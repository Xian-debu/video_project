#!/usr/bin/env python3
"""把 ledger 里的 bvid 回填到 STATUS.md 的 tsint 行（最后一列 BV），状态改 published。

用法：
  python3 release/backfill_status.py --dry-run   # 只报告将改的行
  python3 release/backfill_status.py             # 原地写回 STATUS.md
只改 tsint-* 行；其它行、列顺序、对齐都不动。
"""
from __future__ import annotations

import argparse
import json
import re
from pathlib import Path

VP = Path(__file__).resolve().parents[3]  # .../video_project
STATUS = VP / "STATUS.md"
SERIES = VP / "series/tsint"


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--dry-run", action="store_true")
    args = ap.parse_args()

    manifest = json.loads((SERIES / "release/manifest.json").read_text(encoding="utf-8"))
    ledger = json.loads((SERIES / "release/ledger.json").read_text(encoding="utf-8"))
    id_by_order = {e["order"]: e["id"] for e in manifest["episodes"]}
    bv_by_id = {}
    for key, led in ledger.get("episodes", {}).items():
        if led.get("bvid"):
            order = led.get("order") or int(key)
            ep_id = id_by_order.get(order)
            if ep_id:
                bv_by_id[ep_id] = led["bvid"]

    lines = STATUS.read_text(encoding="utf-8").splitlines(keepends=True)
    header = None
    changed = []
    for i, line in enumerate(lines):
        cells = line.rstrip("\n").split("|")
        if len(cells) >= 3 and cells[1].strip() == "id":
            header = [c.strip() for c in cells]
            continue
        if not line.startswith("| tsint-"):
            continue
        row = line.rstrip("\n").split("|")
        # 行形如 | id | title | status | sec | audio | derived | delivery | BV |
        ep_id = row[1].strip()
        if ep_id not in bv_by_id:
            continue
        bv = bv_by_id[ep_id]
        status_idx = None
        bv_idx = None
        for idx, name in enumerate(header or []):
            if name == "status" and status_idx is None:
                status_idx = idx
            if name == "BV" and bv_idx is None:
                bv_idx = idx
        if status_idx is None or bv_idx is None:
            raise SystemExit("STATUS.md 表头缺 status 或 BV 列")
        new = list(row)
        new[status_idx] = " published "
        if len(new) <= bv_idx:
            new.extend([" "] * (bv_idx + 1 - len(new)))
            new[bv_idx] = " " + bv + " "
        else:
            new[bv_idx] = " " + bv + " "
        newline = "|".join(new).rstrip() + "\n"
        if newline != line:
            changed.append((ep_id, bv))
            lines[i] = newline

    print("将回填 %d 行" % len(changed))
    for ep_id, bv in changed[:5]:
        print("  %s -> %s" % (ep_id, bv))
    if len(changed) > 5:
        print("  ... 共 %d 行" % len(changed))
    if not args.dry_run and changed:
        STATUS.write_text("".join(lines), encoding="utf-8")
        print("已写回", STATUS)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
