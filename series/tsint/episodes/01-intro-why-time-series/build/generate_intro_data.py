#!/usr/bin/env python3
"""第 01 集的派生数据：把 2026-10-30 的三份快照折算成视频要用的数字。

输入（全部入库，可逐字节复核）：
  data/tsa-status-2026-10-30.txt         tsa status 原样输出
  data/manifests/*.manifest.json         6 个 demo 切片的行数/字节/sha256
  data/600519-close.csv                  600519 日线 trade_date,close
  data/cabal-test-2026-10-30.txt         cabal test 的模块计数与总数

输出：data/intro.json（派生文件，不入库；由 film.json 的 derive 重跑）

本集没有算法，所以这里不产生拟合结果，只做三件事：解析、对账、断言。
任何一项对不上，脚本直接退出，不写 JSON。
"""
from __future__ import annotations

import csv
import datetime as dt
import hashlib
import json
import math
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DATA = ROOT / "data"

def die(msg: str) -> None:
    raise SystemExit("FAIL " + msg)

def parse_status() -> dict:
    text = (DATA / "tsa-status-2026-10-30.txt").read_text(encoding="utf-8")
    out: dict = {}
    def num(pat: str) -> int:
        m = re.search(pat, text)
        if not m:
            die("status field missing: " + pat)
        return int(m.group(1).replace(",", ""))
    out["barsDaily"] = num(r"bars_daily\s+rows=\s*([\d,]+)")
    out["barsMinute"] = num(r"bars_minute\s+rows=\s*([\d,]+)")
    out["instruments"] = num(r"instruments\s+rows=\s*([\d,]+)")
    out["adjEvents"] = num(r"adj_events\s+rows=\s*([\d,]+)")
    out["calendar"] = num(r"calendar\s+rows=\s*([\d,]+)")
    out["indexDaily"] = num(r"index_daily\s+rows=\s*([\d,]+)")
    out["indexMembers"] = num(r"index_members\s+rows=\s*([\d,]+)")
    m = re.search(r"bars_daily\s+rows=\s*[\d,]+\s*\n\s*range=([0-9-]+)\.\.([0-9-]+) codes=(\d+)", text)
    if not m:
        die("daily range missing")
    out["dailyFrom"], out["dailyTo"], out["dailyCodes"] = m.group(1), m.group(2), int(m.group(3))
    m = re.search(r"bars_minute\s+rows=\s*[\d,]+\s*\n\s*range=([0-9-]+) [0-9:+]+\.\.([0-9-]+) [0-9:+]+ codes=(\d+)", text)
    if not m:
        die("minute range missing")
    out["minuteFrom"], out["minuteTo"], out["minuteCodes"] = m.group(1), m.group(2), int(m.group(3))
    m = re.search(r"lake size:\s*([\d.]+) MB", text)
    if not m:
        die("lake size missing")
    out["sizeMb"] = float(m.group(1))
    return out

SLICE_ORDER = [
    "single_daily_600519",
    "single_daily_600519_qfq",
    "panel_daily_1y_120",
    "suspended_gap_600519",
    "minute_5m_600519_1m",
    "minute_5m_20codes_2w",
]
SLICE_NOTE = {
    "single_daily_600519": "单只全历史日线，原始价 + adj_factor",
    "single_daily_600519_qfq": "同一只票的前复权价，2015 起",
    "panel_daily_1y_120": "120 只票一年的面板，多变量",
    "suspended_gap_600519": "一年日线，含节假日与停牌造成的空档",
    "minute_5m_600519_1m": "单只 5 分钟线一个月",
    "minute_5m_20codes_2w": "20 只票 5 分钟线两周，分钟级面板",
}

def parse_slices() -> list[dict]:
    out = []
    for name in SLICE_ORDER:
        p = DATA / "manifests" / (name + ".manifest.json")
        m = json.loads(p.read_text(encoding="utf-8"))
        if m["name"] != name:
            die("manifest name mismatch: " + name)
        out.append({
            "name": name,
            "rows": int(m["rows"]),
            "bytes": int(m["bytes"]),
            "sha256": m["sha256"],
            "sha12": m["sha256"][:12],
            "codes": len(m.get("codes") or []),
            "kind": m["kind"],
            "note": SLICE_NOTE[name],
        })
    return out

def parse_prices() -> tuple[list[dict], list[int], dict]:
    rows = list(csv.DictReader((DATA / "600519-close.csv").open(encoding="utf-8")))
    pts = []
    dates = []
    closes = []
    for r in rows:
        d = dt.date.fromisoformat(r["trade_date"])
        c = float(r["close"])
        pts.append({"d": r["trade_date"], "c": c})
        dates.append(d)
        closes.append(c)
    if len(pts) != 6030:
        die("600519 rows != 6030")
    gaps = [(dates[i] - dates[i - 1]).days for i in range(1, len(dates))]
    buckets = [
        ("1 天", 1, 1),
        ("2 天", 2, 2),
        ("3 天", 3, 3),
        ("4 天", 4, 4),
        ("5 天", 5, 5),
        ("6 天", 6, 6),
        ("7–10 天", 7, 10),
        ("11–20 天", 11, 20),
        ("21 天以上", 21, 9999),
    ]
    hist = [{"label": a, "lo": lo, "hi": hi, "count": sum(1 for g in gaps if lo <= g <= hi)} for a, lo, hi in buckets]
    if sum(h["count"] for h in hist) != len(gaps):
        die("gap buckets do not cover all gaps")
    long_gaps = []
    for i in range(1, len(dates)):
        g = (dates[i] - dates[i - 1]).days
        if g >= 18:
            long_gaps.append({"days": g, "from": dates[i - 1].isoformat(), "to": dates[i].isoformat()})
    long_gaps.sort(key=lambda x: -x["days"])

    def acf(x: list[float], k: int = 1) -> float:
        m = sum(x) / len(x)
        num = sum((x[i] - m) * (x[i - k] - m) for i in range(k, len(x)))
        den = sum((v - m) ** 2 for v in x)
        return num / den

    rets = [math.log(closes[i] / closes[i - 1]) for i in range(1, len(closes))]
    half = len(closes) // 2
    stats = {
        "n": len(pts),
        "first": closes[0],
        "last": closes[-1],
        "min": min(closes),
        "max": max(closes),
        "firstMean": sum(closes[:half]) / half,
        "lastMean": sum(closes[half:]) / (len(closes) - half),
        "acfPrice": acf(closes),
        "acfReturn": acf(rets),
        "maxGap": long_gaps[0]["days"],
        "maxGapFrom": long_gaps[0]["from"],
        "maxGapTo": long_gaps[0]["to"],
        "gaps": len(gaps),
        "gapOver3": sum(1 for g in gaps if g > 3),
        "gapOver30": sum(1 for g in gaps if g > 30),
    }
    return pts, hist, stats

def parse_tests() -> dict:
    text = (DATA / "cabal-test-2026-10-30.txt").read_text(encoding="utf-8")
    m = re.search(r"\[PASS\] count:\s*(\d+)", text)
    if not m:
        die("test count missing")
    n = int(m.group(1))
    mods = re.findall(r"^([\w.]+):\s*(\d+)/(\d+) passed", text, re.M)
    if not mods:
        die("module counts missing")
    if sum(int(a) for _, a, _ in mods) != n:
        die("module counts do not sum to total")
    return {"pass": n, "modules": len(mods), "moduleCounts": {k: int(a) for k, a, _ in mods}}

def main() -> None:
    lake = parse_status()
    slices = parse_slices()
    pts, hist, stats = parse_prices()
    tests = parse_tests()
    total_rows = sum(s["rows"] for s in slices)
    if total_rows != 48489:
        die(f"slice rows sum {total_rows} != 48489")
    if lake["barsDaily"] != 17763617 or lake["barsMinute"] != 105435686:
        die("lake row counts changed")
    if stats["n"] != 6030 or stats["maxGap"] != 53:
        die("600519 stats changed")
    if tests["pass"] != 142:
        die("test count changed")
    out = {
        "meta": {
            "episode": 1,
            "bookPages": "1–10",
            "snapshot": "2026-10-30",
            "statusCommand": "cd /root/ts-admin && .venv/bin/tsa status",
            "exportCommand": "cd /root/ts-admin && .venv/bin/python inventory/scripts/export_demo.py",
            "testCommand": "docker exec haskell-ts bash -lc 'export PATH=/opt/ghc/9.14.1/bin:$PATH && cd /work && cabal test'",
            "ghc": "9.14.1",
            "cabal": "3.16.1.0",
        },
        "lake": lake,
        "slices": slices,
        "totals": {"rows": total_rows, "count": len(slices), "bytes": sum(s["bytes"] for s in slices)},
        "series": {
            "code": "sh600519",
            "name": "贵州茅台",
            "points": pts,
            "stats": stats,
            "gapHist": hist,
        },
        "tests": tests,
    }
    text = json.dumps(out, ensure_ascii=False, separators=(",", ":")) + "\n"
    (DATA / "intro.json").write_text(text, encoding="utf-8")
    print(f"wrote data/intro.json {len(text)} bytes; slices={total_rows}; tests={tests['pass']}; maxGap={stats['maxGap']}")

if __name__ == "__main__":
    main()
