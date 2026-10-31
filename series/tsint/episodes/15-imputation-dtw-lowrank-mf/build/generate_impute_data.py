#!/usr/bin/env python3
"""E15 data sheet: masks, RMSE, spectrum, panel crop, one fully-missing column.

Reads the Haskell evidence products (same run as summary.json) and re-derives
only what the pictures need: a display crop of the panel, the singular-value
spectrum, DTW neighbour weights for one masked cell, and the crash-day marks.
Run from the pack root: python3 build/generate_impute_data.py
"""
import csv
import json
import math
import os
import sys

import numpy as np

PACK = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA = "/root/ts-base/data/episodes/15-imputation-dtw-lowrank-mf"
OUT = os.path.join(PACK, "data", "impute.json")

def read_panel(path):
    with open(path, newline="", encoding="utf-8") as f:
        rows = list(csv.reader(f))
    header = rows[0]
    codes = header[1:]
    dates = [r[0] for r in rows[1:]]
    x = np.array([[float(v) for v in r[1:]] for r in rows[1:]], dtype=float)
    return dates, codes, x

def dtw(a, b, band):
    n, m = len(a), len(b)
    inf = float("inf")
    prev = np.full(m + 1, inf)
    prev[0] = 0.0
    for i in range(1, n + 1):
        cur = np.full(m + 1, inf)
        lo = max(1, i - band)
        hi = min(m, i + band)
        ai = a[i - 1]
        for j in range(lo, hi + 1):
            cost = abs(ai - b[j - 1])
            cur[j] = cost + min(prev[j], cur[j - 1], prev[j - 1])
        prev = cur
    return float(prev[m])

def main():
    dates, codes, closes = read_panel(os.path.join(DATA, "panel.csv"))
    # panel.csv holds closes; the evidence program works on log returns.
    x = np.diff(np.log(closes), axis=0)
    dates = dates[1:]
    with open(os.path.join(DATA, "summary.json"), encoding="utf-8") as f:
        summary = json.load(f)
    t, n = x.shape

    # ---- display crop: 40 evenly spaced days x first 30 stocks, z-scored
    ridx = [round(i * (t - 1) / 39) for i in range(40)]
    cidx = list(range(30))
    crop = x[np.ix_(ridx, cidx)]
    mu = crop.mean()
    sd = crop.std() or 1.0
    zcrop = np.clip((crop - mu) / sd, -3, 3)

    # ---- spectrum: demean each column first (the level would otherwise eat 99.9%)
    xc = x - x.mean(axis=0, keepdims=True)
    u, s, vt = np.linalg.svd(xc, full_matrices=False)
    energy = s ** 2
    cum = np.cumsum(energy) / energy.sum()
    spectrum = {
        "s": [float(v) for v in s[:20] / s[0]],
        "cum": [float(v) for v in cum[:10]],
        "rank5_share": float(cum[4]),
        "rank10_share": float(cum[9]),
        "rank20_share": float(cum[19]),
        "sigma1": float(s[0]),
    }

    # ---- one fully missing column
    with open(os.path.join(DATA, "impute_block_column.csv"), newline="", encoding="utf-8") as f:
        rows = list(csv.DictReader(f))
    col = int(rows[0]["t"]) if False else int(json.load(open(os.path.join(DATA, "summary.json")))["masks"]["blockColumnIdx"].split(",")[0])
    truth = [float(r["truth"]) for r in rows]
    knn = [float(r["knn"]) for r in rows]
    low = [float(r["lowrank"]) for r in rows]
    mf = [float(r["mf"]) for r in rows]

    # market mean per day, crash days = 20 most negative
    market = [float(v) for v in x.mean(axis=1)]
    order = sorted(range(t), key=lambda i: market[i])[:20]
    crash_days = sorted(order)

    # ---- DTW neighbour weights for one masked cell (block column, first crash day)
    bcols = [int(v) for v in summary["masks"]["blockColumnIdx"].split(",")]
    others = [c for c in range(n) if c not in set(bcols)]
    target = x[:, col]
    day = crash_days[0]
    band = max(1, t // 10)
    dists = [(dtw(target, x[:, c], band), c) for c in others]
    dists.sort()
    near = dists[:5]
    eps = 1e-9
    raw = [1.0 / (d + eps) for d, _ in near]
    tot = sum(raw)
    weights = [w / tot for w in raw]
    neighbours = {
        "col": col,
        "colCode": codes[col],
        "day": day,
        "date": dates[day],
        "truth": float(target[day]),
        "pred": float(sum(w * float(x[day, c]) for w, (_, c) in zip(weights, near))),
        "items": [
            {"rank": i + 1, "code": codes[c], "col": c, "dist": float(d), "w": float(w), "value": float(x[day, c])}
            for i, ((d, c), w) in enumerate(zip(near, weights))
        ],
    }

    # ---- mask grid on the same crop: block columns intersect the crop, plus
    # the random mask is not exported per cell, so the picture only shows the
    # block mask (10 dark columns) and says the random one is a scatter.
    block_display = [1.0 if c in set(bcols) else 0.0 for c in cidx]

    payload = {
        "meta": {
            "episode": "15-imputation-dtw-lowrank-mf",
            "bookPages": "p.16-17, p.26",
            "tsBaseCommit": summary["meta"]["tsBaseCommit"].strip(),
            "panelExportCommit": "7e041ee",
            "runAt": summary["meta"]["runAt"],
            "checks": summary["checks"],
            "tests": {"suites": 59, "asserts": 880, "dtwknn": 17, "lowrank": 16, "matrixfact": 14},
        },
        "data": summary["data"],
        "masks": {
            "total": t * n,
            "n": summary["masks"]["randomCells"],
            "blockCells": summary["masks"]["blockCells"],
            "blockCols": len(bcols),
            "blockIdx": bcols,
        },
        "random": summary["random"],
        "block": summary["block"],
        "synthetic": summary["synthetic"],
        "spectrum": spectrum,
        "panel": {
            "rows": len(ridx), "cols": len(cidx),
            "rowIdx": ridx, "colIdx": cidx,
            "dates": [dates[i] for i in ridx],
            "codes": [codes[c] for c in cidx],
            "z": [[round(float(v), 4) for v in row] for row in zcrop],
            "blockCols": block_display,
        },
        "column": {
            "col": col, "code": codes[col], "t": t,
            "truth": [round(v, 6) for v in truth],
            "knn": [round(v, 6) for v in knn],
            "lowrank": [round(v, 6) for v in low],
            "mf": [round(v, 6) for v in mf],
            "crashDays": crash_days,
        },
        "neighbours": neighbours,
        "dtw": {"a": [1, 2, 3], "b": [1, 3], "dist": 1.0, "triangle": {"left": 4.0, "right": 1.0 + 2.0}},
    }
    with open(OUT, "w", encoding="utf-8") as f:
        json.dump(payload, f, ensure_ascii=False, indent=1)
    print("wrote", OUT, os.path.getsize(OUT), "bytes")
    print("rank5_share", spectrum["rank5_share"], "rank10", spectrum["rank10_share"])
    print("neighbours", [i["code"] for i in neighbours["items"]], "pred", neighbours["pred"], "truth", neighbours["truth"])
    print("crash first", dates[day], "market", market[day])

if __name__ == "__main__":
    main()
