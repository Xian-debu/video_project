#!/usr/bin/env python3
"""把发布事实（ledger.json）投影进每个 episode 的 film.json。

单一真源（docs/CLOSEOUT-PLAN-2026-11-15.md §6）：
  release/ledger.json      发布事实，只由发布动作写（bvid / url / submittedAt）
  film.json{status, bili}  投影，由本脚本写（幂等：只补不覆盖人工字段）
  STATUS.md                投影，由 tools/status.mjs --md 生成（本脚本不再改它）

旧版行为（已废弃）：直接改 STATUS.md 的 tsint 行 —— 那只改投影的表、不改数据源，
导致 74 个 film.json 的状态与 STATUS.md 长期不一致（D1/D2）。

用法：
  python3 series/tsint/release/backfill_status.py --dry-run   # 只报告
  python3 series/tsint/release/backfill_status.py             # 写回 film.json
  python3 series/tsint/release/backfill_status.py --check     # 不一致则 exit 1（CI 用）

手术式写入：仅就地改 "status" 行、就地插入/更新 bili 块，不重排整个 JSON，git diff 最小。
"""
from __future__ import annotations

import argparse
import json
import re
import sys
from pathlib import Path

VP = Path(__file__).resolve().parents[3]  # .../video_project
SERIES = VP / "series/tsint"
STATUS_LINE_RE = re.compile(r'^(\s*)"status"\s*:\s*"[^"]*"\s*,?\s*$')


def plan_patch(film_path: Path, bvid: str, url: str):
    """返回 (新文本 or None, 说明列表)。None 表示无需改动。"""
    text = film_path.read_text(encoding="utf-8")
    data = json.loads(text)  # 先确认原来是合法 JSON
    if data.get("status") == "published" and (data.get("bili") or {}).get("bv") == bvid:
        return None, []
    notes = []
    lines = text.split("\n")

    # "bili": null 是旧模板留下的占位符：视为没有 bili，先摘掉该行再走插入分支
    for i in range(len(lines) - 1, -1, -1):
        if re.match(r'^\s*"bili"\s*:\s*null\s*,?\s*$', lines[i]):
            del lines[i]
            data.pop("bili", None)

    idx = None
    for i, line in enumerate(lines):
        if STATUS_LINE_RE.match(line):
            idx = i
            break
    if idx is None:
        raise SystemExit("%s: 找不到顶层 status 行" % film_path)
    indent = STATUS_LINE_RE.match(lines[idx]).group(1)
    if data.get("status") != "published":
        lines[idx] = indent + '"status": "published",'
        notes.append("status -> published")

    bili = data.get("bili") or {}
    if bili.get("bv") != bvid:
        if "bili" not in data:
            block = [
                indent + '"bili": {',
                indent + '  "bv": ' + json.dumps(bvid) + ',',
                indent + '  "url": ' + json.dumps(url),
                indent + '},',
            ]
            lines[idx + 1:idx + 1] = block
            notes.append("bili -> " + bvid)
        else:
            done = False
            for i, line in enumerate(lines):
                if re.match(r'^\s*"bv"\s*:', line):
                    lines[i] = re.sub(r'(:\s*)"[^"]*"', lambda m: m.group(1) + json.dumps(bvid), line)
                    done = True
                    break
            if not done:
                raise SystemExit("%s: 有 bili 块但没有 bv 行" % film_path)
            notes.append("bili.bv -> " + bvid)

    new = "\n".join(lines)
    try:
        json.loads(new)
    except Exception as exc:
        raise SystemExit("%s: 改写后不是合法 JSON：%s" % (film_path, exc))
    return new, notes


def main() -> int:
    ap = argparse.ArgumentParser()
    g = ap.add_mutually_exclusive_group()
    g.add_argument("--dry-run", action="store_true")
    g.add_argument("--check", action="store_true")
    args = ap.parse_args()

    manifest = json.loads((SERIES / "release/manifest.json").read_text(encoding="utf-8"))
    ledger = json.loads((SERIES / "release/ledger.json").read_text(encoding="utf-8"))
    eps = {e["order"]: e for e in manifest["episodes"]}

    changes, problems = [], []
    for key, led in sorted(ledger.get("episodes", {}).items(), key=lambda kv: int(kv[0])):
        order = led.get("order") or int(key)
        bvid = led.get("bvid")
        ep = eps.get(order)
        if not bvid:
            problems.append("order %s: ledger 无 bvid" % order)
            continue
        if not ep:
            problems.append("order %s: manifest 无对应集" % order)
            continue
        film_path = SERIES / "episodes" / ep["dir"] / "film.json"
        if not film_path.is_file():
            problems.append("order %s: film.json 不存在 (%s)" % (order, film_path))
            continue
        url = led.get("url") or ("https://www.bilibili.com/video/%s/" % bvid)
        new, notes = plan_patch(film_path, bvid, url)
        if new is not None:
            changes.append((order, film_path, new, notes))

    n_ledger = len(ledger.get("episodes", {}))
    print("episodes: %d in ledger, %d in manifest" % (n_ledger, len(manifest["episodes"])))
    print("将回填 %d 个 film.json" % len(changes))
    for order, path, _new, notes in changes[:8]:
        print("  E%02d %s: %s" % (order, path.parent.name, "; ".join(notes)))
    if len(changes) > 8:
        print("  ... 共 %d 个" % len(changes))
    for p in problems:
        print("  ! " + p, file=sys.stderr)

    if args.check:
        return 1 if (changes or problems) else 0
    if not args.dry_run and changes:
        for _order, path, new, _notes in changes:
            path.write_text(new, encoding="utf-8")
        print("已写回 %d 个 film.json" % len(changes))
    return 1 if problems else 0


if __name__ == "__main__":
    raise SystemExit(main())
