#!/usr/bin/env python3
"""E62 dist.json: evidence readings + the injected test series for the figures.

The series is the same 728-point test segment the evidence program uses, standardised
with the 2015-2019 mu/sigma, so the figures can draw the real spikes and drift ramps
without re-running the detectors.
"""
from __future__ import annotations

import csv
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
EVIDENCE = Path("/root/ts-base/inventory/evidence/62-anomaly-two-ways.ch7-anom.json")
MANIFEST = ROOT / "data" / "episode" / "manifest.json"
CSV = ROOT / "data" / "episode" / "returns_000001.csv"
OUT = ROOT / "data" / "dist.json"

SPIKE_IDX = [30, 70, 100, 200, 240, 290, 320, 430, 470, 540, 650, 700]
SPIKE_AMP = [6, -6, 5, -5, 7, -7, 6, -6, 5, -5, 6, -6]
DRIFT_SEGS = [[120, 60, 2.0], [340, 60, -2.0], [560, 60, 1.8]]


def main() -> None:
    ev = json.loads(EVIDENCE.read_text())
    r = ev["readings"]
    man = json.loads(MANIFEST.read_text())

    rows: list[tuple[str, float]] = []
    with CSV.open() as f:
        rd = csv.reader(f)
        next(rd)
        for row in rd:
            rows.append((row[0], float(row[1])))

    tr_lo, tr_hi = man["train"]["range"]
    te_lo, te_hi = man["test"]["range"]
    train = [(d, v) for d, v in rows if tr_lo <= d <= tr_hi]
    test = [(d, v) for d, v in rows if te_lo <= d <= te_hi]
    assert len(train) == man["train"]["rows"] == 1219, len(train)
    assert len(test) == man["test"]["rows"] == 728, len(test)

    mu, sigma = r["mu"], r["sigma"]
    series = [round((v - mu) / sigma, 3) for _, v in test]
    spike_at = {i: a for i, a in zip(SPIKE_IDX, SPIKE_AMP)}
    spike_z = [round(v + spike_at.get(i, 0.0), 3) for i, v in enumerate(series)]
    drift_delta = [0.0] * len(series)
    for start, length, amp in DRIFT_SEGS:
        for k in range(length):
            ramp = 20
            frac = min(1.0, min(k, length - 1 - k) / ramp)
            drift_delta[start + k] += amp * frac
    drift_z = [round(v + d, 3) for v, d in zip(series, drift_delta)]

    data = {
        "meta": {
            "episode": 62,
            "slug": "anomaly-two-ways",
            "chapter": "ch07",
            "title": "两种异常，两条路：预测残差与重构误差",
            "runtimeTarget": 18,
        },
        "checks": ev["checks"],
        "summary": {"total": ev["total"], "passed": ev["passed"], "failed": ev["failed"], "ok": ev["ok"]},
        "data": {
            "returnsRows": r["returnsRows"],
            "trainRows": len(train),
            "testRows": len(test),
            "fitWindows": r["trainRows"],
            "calibWindows": r["calibRows"],
            "testPoints": r["testRows"],
            "winLen": r["winLen"],
            "firstDate": rows[0][0],
            "lastDate": rows[-1][0],
            "trainStart": train[0][0],
            "trainEnd": train[-1][0],
            "testStart": test[0][0],
            "testEnd": test[-1][0],
            "mu": mu,
            "sigma": sigma,
            "spikeCount": r["spikeCount"],
            "driftPoints": r["driftPoints"],
            "driftSegments": len(DRIFT_SEGS),
        },
        "pred": {
            "params": r["ridgeParams"],
            "winLen": r["winLen"],
            "q": 0.99,
            "threshold": r["thresholdPred"],
            # 证据 readings 里是四舍五入到 4 位的 0.0082；屏幕用 checks 里的 0.8214%（4/487）
            "calibRate": 0.008214,
            "spikeF1": r["spikeF1Pred"],
            "driftF1": r["driftF1Pred"],
            "lambda": 1.0,
        },
        "recon": {
            "params": r["aeParams"],
            "hidden": r["hidden"],
            "winLen": r["winLen"],
            "epochs": 200,
            "lr": 0.02,
            "threshold": r["thresholdRecon"],
            "spikeF1": r["spikeF1Recon"],
            "driftF1": r["driftF1Recon"],
            "lossFirst": r["aeLossFirst"],
            "lossLast": r["aeLossLast"],
            "normalMean": r["reconNormalMean"],
            "driftMean": r["reconDriftMean"],
        },
        "sweep": r["sweep"],
        "series": {
            "test": series,
            "spikeZ": spike_z,
            "driftZ": drift_z,
            "spikeIdx": SPIKE_IDX,
            "spikeAmp": SPIKE_AMP,
            "driftSegs": DRIFT_SEGS,
            "min": min(series),
            "max": max(series),
        },
        "windows": {
            "normal": series[250:282],
            "drift": drift_z[118:150],
        },
        "timing": {"seconds": r["seconds"]},
        "code": {
            "modules": 2,
            "predLines": 104,
            "reconLines": 147,
            "totalLines": 251,
            "tests": 24,
            "predTests": 11,
            "reconTests": 13,
            "evidenceLines": 349,
            "checks": ev["total"],
        },
    }
    OUT.write_text(json.dumps(data, ensure_ascii=False, indent=1) + "\n")
    print(f"wrote {OUT.relative_to(ROOT)} ({OUT.stat().st_size} B)")
    print(f"train {train[0][0]}..{train[-1][0]} n={len(train)} | test {test[0][0]}..{test[-1][0]} n={len(test)}")
    print(f"z range {min(series)}..{max(series)} | spikes {[series[i] for i in SPIKE_IDX][:4]}")


if __name__ == "__main__":
    main()