#!/usr/bin/env python3
"""核对已投稿的 B 站条目：台账 -> manifest -> 公开 API（tags + view 标题/简介/时长）。

用法：
  python3 release/audit_published.py            # 台账里所有 bvid
  python3 release/audit_published.py --from 1 --to 20
  python3 release/audit_published.py --json    # 机器可读
退出码：0 全部一致；1 有差异/缺项。
"""
from __future__ import annotations

import argparse
import json
import sys
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
TS_BASE = "https://github.com/Xian-debu/ts-base"
VIDEO_PROJECT = "https://github.com/Xian-debu/video_project"
UA = {"User-Agent": "Mozilla/5.0 (bilibili audit; tsint release)"}


def get_json(url: str) -> dict:
    req = urllib.request.Request(url, headers=UA)
    with urllib.request.urlopen(req, timeout=20) as r:
        return json.loads(r.read().decode("utf-8"))


def norm(s: str) -> str:
    return " ".join(str(s or "").split())


def audit_one(ep: dict, led: dict) -> dict:
    n = ep["order"]
    bvid = led.get("bvid")
    out = {"order": n, "bvid": bvid, "ok": False, "problems": []}
    if not bvid:
        out["problems"].append("台账无 bvid（status=%s）" % led.get("status"))
        return out
    try:
        tags = get_json("https://api.bilibili.com/x/tag/archive/tags?bvid=" + bvid)
        view = get_json("https://api.bilibili.com/x/web-interface/view?bvid=" + bvid)
    except Exception as e:  # noqa: BLE001
        out["problems"].append("API 失败: %s" % e)
        return out
    if tags.get("code") != 0:
        out["problems"].append("tags API code=%s %s" % (tags.get("code"), tags.get("message")))
    else:
        actual = [t.get("tag_name") for t in tags.get("data") or []]
        expect = list(ep.get("tags") or [])
        if sorted(actual) != sorted(expect):
            missing = [t for t in expect if t not in actual]
            extra = [t for t in actual if t not in expect]
            out["problems"].append("tags 不一致 missing=%s extra=%s" % (missing, extra))
        out["tags"] = actual
    if view.get("code") != 0:
        # 转码/审核期常见 -404，记为待复核而不是硬错误
        out["pending"] = "view code=%s %s" % (view.get("code"), view.get("message"))
    else:
        d = view["data"]
        if d.get("title") != ep.get("title"):
            out["problems"].append("标题不一致: %r" % (d.get("title"),))
        desc = d.get("desc") or ""
        if TS_BASE not in desc:
            out["problems"].append("简介缺 ts-base 行")
        if VIDEO_PROJECT not in desc:
            out["problems"].append("简介缺 video_project 行")
        dur = d.get("duration")
        want = ep.get("durationSec")
        if isinstance(dur, int) and isinstance(want, (int, float)) and abs(dur - want) > 2:
            out["problems"].append("时长差 %ss (API %s / manifest %s)" % (round(dur - want, 2), dur, want))
        out["desc_lines"] = len(desc.splitlines())
        out["duration"] = dur
    out["ok"] = not out["problems"]
    return out


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--from", dest="lo", type=int, default=1)
    ap.add_argument("--to", dest="hi", type=int, default=74)
    ap.add_argument("--json", action="store_true")
    args = ap.parse_args()

    manifest = json.loads((ROOT / "release/manifest.json").read_text(encoding="utf-8"))
    ledger = json.loads((ROOT / "release/ledger.json").read_text(encoding="utf-8"))
    by_order = {e["order"]: e for e in manifest["episodes"]}
    rows = []
    for n in range(args.lo, args.hi + 1):
        ep = by_order.get(n)
        led = ledger.get("episodes", {}).get(str(n)) or {}
        if not ep:
            rows.append({"order": n, "ok": False, "problems": ["manifest 无此集"]})
            continue
        if not led.get("bvid"):
            rows.append({"order": n, "ok": False, "problems": ["未投稿"]})
            continue
        rows.append(audit_one(ep, led))

    bad = [r for r in rows if not r["ok"]]
    pending = [r for r in rows if r.get("pending")]
    if args.json:
        print(json.dumps({"rows": rows, "ok": len(rows) - len(bad), "bad": len(bad)}, ensure_ascii=False, indent=2))
    else:
        for r in rows:
            flag = "OK  " if r["ok"] else "BAD "
            print("%s #%02d %s %s" % (flag, r["order"], r.get("bvid") or "-", "; ".join(r["problems"]) or (r.get("pending") or "")))
        print("--- %d 条，通过 %d，失败 %d，待复核 %d" % (len(rows), len(rows) - len(bad), len(bad), len(pending)))
    return 0 if not bad else 1


if __name__ == "__main__":
    sys.exit(main())
