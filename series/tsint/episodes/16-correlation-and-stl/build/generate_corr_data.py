#!/usr/bin/env python3
"""E16 data sheet: correlation readings, pair histograms, price/return paths, STL profiles.

Reads the Haskell evidence products (summary.json, maotai_stl.csv, season profile)
and re-derives only what the pictures need: a display crop of 12 price paths,
histograms of the 4950 pairwise correlations, and a downsample of the Maotai fit.
Run from the pack root: python3 build/generate_corr_data.py
"""
import csv
import json
import math
import os

import numpy as np

PACK = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA = "/root/ts-base/data/episodes/16-correlation-and-stl"
EVID = "/root/ts-base/inventory/evidence/ch2-corr-stl/ch2-corr-stl.json"
OUT = os.path.join(PACK, "data", "corr.json")

BIN_EDGES = [-0.6 + 0.1 * i for i in range(17)]  # -0.6 .. 1.0, 16 bins


def read_panel(path):
    with open(path, newline="", encoding="utf-8") as f:
        rows = list(csv.reader(f))
    codes = rows[0][1:]
    dates = [r[0] for r in rows[1:]]
    x = np.array([[float(v) for v in r[1:]] for r in rows[1:]], dtype=float)
    return dates, codes, x


def pearson(a, b):
    ma, mb = a.mean(), b.mean()
    sxy = float(np.sum((a - ma) * (b - mb)))
    sxx = float(np.sum((a - ma) ** 2))
    syy = float(np.sum((b - mb) ** 2))
    return sxy / math.sqrt(sxx * syy)


def pair_corrs(x):
    t, n = x.shape
    out = []
    for i in range(n):
        for j in range(i + 1, n):
            out.append(pearson(x[:, i], x[:, j]))
    return np.array(out)


def main():
    dates, codes, closes = read_panel(os.path.join(DATA, "panel_close.csv"))
    rets = np.diff(np.log(closes), axis=0) * 100.0
    rdates = dates[1:]
    with open(os.path.join(DATA, "summary.json"), encoding="utf-8") as f:
        summary = json.load(f)
    with open(EVID, encoding="utf-8") as f:
        evid = json.load(f)
    metrics = {m["name"]: m["value"] for m in evid["metrics"]}

    cp = pair_corrs(closes)
    cr = pair_corrs(rets)
    hp = np.histogram(cp, bins=BIN_EDGES)[0].tolist()
    hr = np.histogram(cr, bins=BIN_EDGES)[0].tolist()
    hi_p = int(np.sum(cp > 0.8))
    hi_r = int(np.sum(cr > 0.8))
    neg_p = int(np.sum(cp < 0))
    neg_r = int(np.sum(cr < 0))
    assert hi_p == int(metrics["corr_price_hi_pairs"]), (hi_p, metrics["corr_price_hi_pairs"])
    assert hi_r == int(metrics["corr_ret_hi_pairs"]), (hi_r, metrics["corr_ret_hi_pairs"])

    # display crop: 12 evenly spaced price paths normalised to 100, every other day
    cidx = [round(i * (len(codes) - 1) / 11) for i in range(12)]
    ridx = list(range(0, len(dates), 2))
    retidx = [i for i in ridx if i < rets.shape[0]]
    paths = []
    for c in cidx:
        p = closes[ridx, c]
        paths.append({
            "code": codes[c],
            "price": [round(float(v / p[0] * 100.0), 3) for v in p],
            "ret": [round(float(v), 4) for v in rets[retidx, c]],
        })

    # Maotai fit downsampled
    with open(os.path.join(DATA, "maotai_stl.csv"), newline="", encoding="utf-8") as f:
        rows = list(csv.DictReader(f))
    step = 2
    mt_dates = [r["date"] for r in rows][::step]
    mt_close = [round(float(r["close"]), 3) for r in rows][::step]
    mt_trend = [round(float(r["trend"]), 3) for r in rows][::step]

    with open(os.path.join(DATA, "maotai_season_profile.csv"), newline="", encoding="utf-8") as f:
        prof = list(csv.DictReader(f))
    profile_stl = [float(r["stl_seasonal"]) for r in prof]
    profile_classic = [float(r["classic_seasonal"]) for r in prof]

    # 1/(1+var) saturation curve
    vars_ = [round(0.005 * i, 4) for i in range(71)]
    vals = [round(1.0 / (1.0 + v), 6) for v in vars_]

    mt = summary["maotai"]
    payload = {
        "meta": {
            "episode": "16-correlation-and-stl",
            "bookPages": summary["meta"]["bookPages"],
            "tsBaseCommit": summary["meta"]["tsBaseCommit"].strip(),
            "panelExportCommit": "40a8188",
            "evidenceCommit": "31b99c5",
            "runAt": summary["meta"]["runAt"],
            "checks": summary["checks"],
            "tests": {"suites": 61, "asserts": 917, "corr": 20, "stl": 17},
        },
        "data": summary["data"],
        "readings": {
            "price": summary["readings"]["price"],
            "returns": summary["readings"]["returns"],
            "stl": summary["readings"]["stl_detrended"],
            "classic": summary["readings"]["classic_detrended"],
        },
        "pairs": {"total": len(cp), "hiPrice": hi_p, "hiRet": hi_r, "negPrice": neg_p, "negRet": neg_r},
        "saturation": {"vars": vars_, "vals": vals},
        "hist": {"edges": [round(e, 4) for e in BIN_EDGES], "price": hp, "returns": hr},
        "paths": {"dates": [dates[i] for i in ridx], "series": paths, "step": 2},
        "maotai": {"dates": mt_dates, "close": mt_close, "trend": mt_trend},
        "profiles": {"stl": [round(v, 6) for v in profile_stl], "classic": [round(v, 6) for v in profile_classic]},
        "maotaiStats": {
            "stl": mt["stl_season_strength"], "classic": mt["classic_season_strength"],
            "gap": mt["profile_gap"], "ampPct": mt["season_amp_pct"],
        },
        "synthetic": {
            "n": summary["synthetic"]["n"],
            "trendErr": summary["synthetic"]["trend_err"],
            "seasonErr": summary["synthetic"]["season_err"],
            "identityErr": summary["synthetic"]["identity_err"],
        },
    }
    with open(OUT, "w", encoding="utf-8") as f:
        json.dump(payload, f, ensure_ascii=False, indent=1)
    print("wrote", OUT, os.path.getsize(OUT), "bytes")
    print("pairs hi", hi_p, hi_r, "neg", neg_p, neg_r)
    print("hist price", hp)
    print("hist ret", hr)
    print("paths", len(paths), "points", len(ridx))
    print("saturation", vals[0], vals[-1])


if __name__ == "__main__":
    main()
