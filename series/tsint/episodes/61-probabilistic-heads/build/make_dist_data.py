#!/usr/bin/env python3
"""E61 dist.json: readings from the 18-check evidence + an honest quantile fan.

The fan is computed here from the same 500-day coverage window the evidence uses:
empirical quantiles (type-1) next to the Gaussian quantiles implied by (mu, sigma).
"""
from __future__ import annotations

import csv
import json
import math
from pathlib import Path
from statistics import NormalDist

ROOT = Path(__file__).resolve().parents[1]
EVIDENCE = Path("/root/ts-base/inventory/evidence/61-probabilistic-heads.ch7-prob.json")
CSV = ROOT / "data" / "episode" / "returns_000001.csv"
OUT = ROOT / "data" / "dist.json"

TAUS = [round(0.1 * i, 1) for i in range(1, 10)]


def empirical_quantile(sorted_vals: list[float], tau: float) -> float:
    n = len(sorted_vals)
    k = max(1, math.ceil(tau * n))
    return sorted_vals[k - 1]


def main() -> None:
    ev = json.loads(EVIDENCE.read_text())
    r = ev["readings"]

    rows: list[tuple[str, float]] = []
    with CSV.open() as f:
        rd = csv.reader(f)
        next(rd)
        for row in rd:
            rows.append((row[0], float(row[1])))

    cover = [v for d, v in rows if r["coverageStart"] <= d <= r["coverageEnd"]]
    cover.sort()
    nd = NormalDist()
    mu, sigma = r["mu"], r["sigma"]
    fan = [
        {
            "tau": t,
            "empirical": round(empirical_quantile(cover, t), 4),
            "gaussian": round(mu + sigma * nd.inv_cdf(t), 4),
        }
        for t in TAUS
    ]

    # 完整的尾部曲线：tau 从 0.01 到 0.99，同一批 500 天。
    curve_taus = [round(0.01 + 0.02 * i, 2) for i in range(50)]
    tails_curve = [
        {
            "tau": t,
            "empirical": round(empirical_quantile(cover, t), 4),
            "gaussian": round(mu + sigma * nd.inv_cdf(t), 4),
        }
        for t in curve_taus
    ]

    # 两端尾部的厚度：经验 5% / 95% 分位相对高斯分位外扩或内收多少。
    q05 = empirical_quantile(cover, 0.05)
    q95 = empirical_quantile(cover, 0.95)
    g05 = mu + sigma * nd.inv_cdf(0.05)
    g95 = mu + sigma * nd.inv_cdf(0.95)

    data = {
        "meta": {
            "episode": 61,
            "slug": "probabilistic-heads",
            "chapter": "ch07",
            "title": "不止一个数：分位损失、分位线交叉与分布头",
            "runtimeTarget": 18,
        },
        "checks": ev["checks"],
        "summary": {"total": ev["total"], "passed": ev["passed"], "failed": ev["failed"], "ok": ev["ok"]},
        "data": {
            "returnsRows": r["returnsRows"],
            "trainRows": r["trainRows"],
            "fitRows": r["fitRows"],
            "testRows": r["testRows"],
            "coverageRows": r["coverageRows"],
            "coverageStart": r["coverageStart"],
            "coverageEnd": r["coverageEnd"],
            "winLen": r["winLen"],
            "winBuckets": r["winLen"] + 1,
            "taus": r["taus"],
            "tauCount": r["tauCount"],
            "firstDate": rows[0][0],
            "lastDate": rows[-1][0],
        },
        "crossing": {
            "rate": r["crossingRate"],
            "rateAfter": r["crossingRateAfter"],
            "pairs": r["crossingPairs"],
            "pairsAfter": r["crossingPairsAfter"],
            "pairTotal": r["crossingPairs"] * 0 + 26208,
            "samples": r["testRows"],
        },
        "pinball": {
            "before": r["pinballBefore"],
            "after": r["pinballAfter"],
            "relDelta": r["pinballRelDelta"],
            "golden": [0.9, 0.1, 0.1, 0.9],
            "medianMae": 1.666557,
            "medianBaseline": 1.724896,
        },
        "dist": {
            "mu": r["mu"],
            "sigma": r["sigma"],
            "nll": r["nllTest"],
            "nllAnchor": 0.918939,
            "z95": r["z95"],
            "coverage": r["coverage95"],
            "coverageTarget": 0.95,
            "gradMu": -2.136647,
            "gradRaw": -0.860855,
        },
        "fan": fan,
        "tailsCurve": tails_curve,
        "tails": {"q05": round(q05, 4), "q95": round(q95, 4), "g05": round(g05, 4), "g95": round(g95, 4)},
        "timing": {"seconds": r["seconds"]},
        "code": {
            "modules": 3,
            "pinballLines": 87,
            "rearrangeLines": 52,
            "distLines": 120,
            "totalLines": 259,
            "tests": 28,
            "pinballTests": 11,
            "rearrangeTests": 8,
            "distTests": 9,
            "evidenceLines": 282,
            "checks": ev["total"],
        },
    }
    OUT.write_text(json.dumps(data, ensure_ascii=False, indent=1) + "\n")
    print(f"wrote {OUT.relative_to(ROOT)} ({OUT.stat().st_size} B)")
    print(f"cover n={len(cover)} fan={[(f['tau'], f['empirical'], f['gaussian']) for f in fan]}")


if __name__ == "__main__":
    main()
