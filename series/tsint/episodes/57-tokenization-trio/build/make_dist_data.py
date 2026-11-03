#!/usr/bin/env python3
"""E57 dist.json: readings from the 22-check evidence + ACF curves for the charts."""
from __future__ import annotations

import csv
import json
import math
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
EVIDENCE = Path("/root/ts-base/inventory/evidence/57-tokenization-trio.ch7-token.json")
CSV = ROOT / "data" / "episode" / "token_series.csv"
OUT = ROOT / "data" / "dist.json"


def acf(xs: list[float], max_lag: int) -> list[float]:
    n = len(xs)
    mu = sum(xs) / n
    c = [x - mu for x in xs]
    denom = sum(v * v for v in c)
    out = []
    for k in range(max_lag + 1):
        num = sum(c[t] * c[t + k] for t in range(n - k))
        out.append((num / (n - k)) / (denom / n))
    return out


def main() -> None:
    ev = json.loads(EVIDENCE.read_text())
    r = ev["readings"]
    closes = []
    with CSV.open() as f:
        rd = csv.reader(f)
        next(rd)
        for row in rd:
            closes.append(float(row[1]))

    sin96 = [math.sin(2 * math.pi * i / 24) for i in range(96)]
    sin_acf = acf(sin96, 48)
    real_acf = acf(closes, 48)

    data = {
        "meta": {
            "episode": 57,
            "slug": "tokenization-trio",
            "chapter": "ch07",
            "title": "把序列切成块：Patch、周期、分辨率前缀",
            "runtimeTarget": 16,
        },
        "checks": ev["checks"],
        "summary": {
            "total": ev["total"],
            "passed": ev["passed"],
            "failed": ev["failed"],
            "ok": ev["ok"],
        },
        "data": {
            "points": r["points"],
            "h": r["h"],
            "first": r["first"],
            "last": r["last"],
            "min": r["min"],
            "max": r["max"],
            "range": ["2024-09-11", "2026-10-28"],
            "sinPeriod": 24,
            "tail96": [round(v, 4) for v in closes[-96:]],
        },
        "patch": {
            "lens": [8, 16, 32],
            "counts": r["tokens"],
            "total": r["tokenTotal"],
            "overlap": r["overlap"],
            "overlapLen": 16,
            "stride": 8,
            "reconErr": r["reconErr"],
            "orthErr": r["orthErr"],
        },
        "period": {
            "peak": r["peak"],
            "acf0": r["acf0"],
            "acf24": r["acf24"],
            "tokens": 4,
            "tokenLen": 24,
            "realAcf24": r["realAcf24"],
            "realPeak": r["realPeak"],
            "threshold": 0.3,
            "sinAcf": [round(v, 6) for v in sin_acf],
            "realAcf": [round(v, 6) for v in real_acf],
        },
        "prefix": {
            "levels": [1, 2, 4, 8],
            "lengths": r["resLengths"],
            "dim": r["prefixDim"],
            "nearest3": r["nearest3"],
            "nearest6": r["nearest6"],
        },
        "code": {"modules": 3, "moduleLines": 433, "tests": 50, "evidenceLines": 222},
    }
    OUT.write_text(json.dumps(data, ensure_ascii=False, indent=1) + "\n")
    print(f"dist: {len(ev['checks'])} checks, tokens {r['tokens']}, acf peak {r['peak']}, {OUT.stat().st_size} B")


if __name__ == "__main__":
    main()
