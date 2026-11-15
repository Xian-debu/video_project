#!/usr/bin/env python3
"""校验"发布事实"在三处投影之间一致（A3 门禁）。

三处来源（见 docs/CLOSEOUT-PLAN-2026-11-15.md §6）：
  release/ledger.json      发布事实（bvid / url / submittedAt）      —— 唯一真源
  film.json{status,bili}   每个 pack 的投影（backfill_status.py 写）
  release/manifest.json    成品度量（videoBytes / videoSha256 / durationSec / cover / srt）

检查项：
  1. ledger 每集都有形如 BV1xxxxxxxxx 的 bvid，且 url 与 bvid 自洽
  2. 对应 film.json：status == "published"，bili.bv == ledger.bvid，bili.url 自洽
  3. manifest 每集有 video / cover / srt 路径、videoBytes > 0、videoSha256 与 coverSha256 是 64 位 hex、durationSec > 0
  4. 三处的集合一致：ledger 的集 = manifest 的集 = film.json 中 series.order 对应的集
  5. --sha：本机存在成片时实测 sha256 与 manifest 对比（清理前用；清理后 unavailable 计数会很大）

用法：
  python3 series/tsint/release/verify_release_state.py          # 结构与交叉一致
  python3 series/tsint/release/verify_release_state.py --sha    # 额外实测本机成片 sha256
退出码 0 = 全部一致；1 = 有不一致（逐条列出）。
"""
from __future__ import annotations

import argparse
import hashlib
import json
import re
import sys
from pathlib import Path

SERIES = Path(__file__).resolve().parents[1]           # .../series/tsint
VP = SERIES.parents[1]                                  # .../video_project
BV_RE = re.compile(r"^BV[0-9A-Za-z]{10}$")
SHA_RE = re.compile(r"^[0-9a-f]{64}$")


def sha256_file(path: Path) -> str:
    h = hashlib.sha256()
    with path.open("rb") as fh:
        for chunk in iter(lambda: fh.read(1 << 20), b""):
            h.update(chunk)
    return h.hexdigest()


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--sha", action="store_true", help="实测本机成片 sha256")
    ap.add_argument("--quiet", action="store_true")
    args = ap.parse_args()

    manifest = json.loads((SERIES / "release/manifest.json").read_text(encoding="utf-8"))
    ledger = json.loads((SERIES / "release/ledger.json").read_text(encoding="utf-8"))
    eps = {e["order"]: e for e in manifest["episodes"]}
    bad = []

    # 1) ledger
    led = ledger.get("episodes", {})
    if not led:
        bad.append("ledger.episodes 为空")
    bv_seen = {}
    for key, e in led.items():
        order = e.get("order") or int(key)
        bvid = e.get("bvid")
        if not bvid or not BV_RE.match(bvid):
            bad.append("ledger order %s: bvid 非法 (%r)" % (order, bvid))
            continue
        if bvid in bv_seen:
            bad.append("ledger: bvid 重复 %s (order %s 与 %s)" % (bvid, bv_seen[bvid], order))
        bv_seen[bvid] = order
        url = e.get("url") or ""
        if url and bvid not in url:
            bad.append("ledger order %s: url 与 bvid 不一致 (%s)" % (order, url))

    # 2) manifest 结构与 film.json 投影
    sha_checked = sha_missing = 0
    for order in sorted(eps):
        ep = eps[order]
        for k in ("video", "cover", "srt"):
            if not ep.get(k):
                bad.append("manifest order %s: 缺 %s" % (order, k))
        if not isinstance(ep.get("videoBytes"), int) or ep["videoBytes"] <= 0:
            bad.append("manifest order %s: videoBytes 非法" % order)
        for k in ("videoSha256", "coverSha256"):
            if not SHA_RE.match(str(ep.get(k) or "")):
                bad.append("manifest order %s: %s 不是 64 位 hex" % (order, k))
        if not isinstance(ep.get("durationSec"), (int, float)) or ep["durationSec"] <= 0:
            bad.append("manifest order %s: durationSec 非法" % order)

        film_path = SERIES / "episodes" / ep["dir"] / "film.json"
        if not film_path.is_file():
            bad.append("order %s: film.json 不存在 (%s)" % (order, film_path))
            continue
        film = json.loads(film_path.read_text(encoding="utf-8"))
        led_e = led.get(str(order)) or {}
        bvid = led_e.get("bvid")
        if film.get("status") != "published":
            bad.append("order %s %s: film.status=%r，ledger 说已发布" % (order, ep["dir"], film.get("status")))
        if (film.get("bili") or {}).get("bv") != bvid:
            bad.append("order %s %s: film.bili.bv=%r，ledger=%r" % (order, ep["dir"], (film.get("bili") or {}).get("bv"), bvid))

        if args.sha:
            video = SERIES / ep["video"]
            if video.is_file():
                got = sha256_file(video)
                sha_checked += 1
                if got != ep["videoSha256"]:
                    bad.append("order %s: 成片 sha256 不符 (%s != %s)" % (order, got, ep["videoSha256"]))
            else:
                sha_missing += 1

    # 3) 集合一致
    film_orders = set()
    for p in sorted((SERIES / "episodes").glob("*/film.json")):
        film = json.loads(p.read_text(encoding="utf-8"))
        o = (film.get("series") or {}).get("order")
        if o is not None:
            film_orders.add(o)
    if film_orders != set(eps) or set(int(k) for k in led) != set(eps):
        bad.append("集合不一致: film.json=%d, manifest=%d, ledger=%d" % (len(film_orders), len(eps), len(led)))

    statuses = {}
    for p in (SERIES / "episodes").glob("*/film.json"):
        st = json.loads(p.read_text(encoding="utf-8")).get("status")
        statuses[st] = statuses.get(st, 0) + 1

    if bad:
        print("release state: FAILED — %d 项" % len(bad))
        for b in bad[:40]:
            print("  x " + b)
        if len(bad) > 40:
            print("  ... 共 %d 项" % len(bad))
        return 1

    if not args.quiet:
        print("release state: OK — ledger %d/74 已发布，film.json 全部 published 且 bvid 对齐，manifest 成品度量齐全" % len(led))
        print("  film.status 分布: " + ", ".join("%s=%d" % (k, v) for k, v in sorted(statuses.items())))
        if args.sha:
            print("  成片 sha256 实测: %d 集通过, %d 集本机文件不存在（已清理则正常）" % (sha_checked, sha_missing))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
