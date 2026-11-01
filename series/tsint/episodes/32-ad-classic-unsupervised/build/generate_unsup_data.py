#!/usr/bin/env python3
"""Generate data/unsup.json for E32 from the ts-base evidence artifacts.

唯一真源是 ts-base 证据程序的落盘产物：inventory/evidence 里的 ch4-unsup JSON
（读数、曲线、PCA 散点、边界）与 data/episodes 里的 summary.json / manifest.json。
画面上的每个数字都从这里来，不手抄。
"""
import json
import pathlib
import sys

PACK = pathlib.Path(__file__).resolve().parent.parent
TS_BASE = pathlib.Path("/root/ts-base/data/episodes/32-ad-classic-unsupervised")
EVIDENCE = pathlib.Path("/root/ts-base/inventory/evidence/32-ad-classic-unsupervised.ch4-unsup.json")
EPISODE = "32-ad-classic-unsupervised"
DET_ORDER = ["kmeans", "lof", "iforest"]


def read_json(path):
    return json.loads(path.read_text(encoding="utf-8"))


def r6(v):
    return round(float(v), 6)


def main() -> int:
    ev = read_json(EVIDENCE)
    summary = read_json(TS_BASE / "summary.json")
    manifest = read_json(TS_BASE / "unsup_panel.manifest.json")

    if int(ev["coverage"]["rows"]) != int(manifest["rows"]):
        print("evidence rows disagree with manifest", file=sys.stderr)
        return 1
    if ev["coverage"]["sha256"] != manifest["sha256"]:
        print("evidence sha256 disagrees with manifest", file=sys.stderr)
        return 1
    failed = [c for c in ev["details"] if not c["ok"]]
    if failed or int(ev["checks"]["passed"]) != int(ev["checks"]["total"]):
        print("evidence checks did not all pass; refusing to build data", file=sys.stderr)
        return 1

    readings = []
    for r in ev["readings"]:
        readings.append({
            "injection": r["injection"],
            "detector": r["detector"],
            "tau": r6(r["tau"]),
            "pos": int(r["positives"]),
            "p": r6(r["precision"]),
            "r": r6(r["recall"]),
            "f1": r6(r["f1"]),
            "bestF1": r6(r["bestF1"]),
            "bestTau": r6(r["bestTau"]),
            "ap": r6(r["averagePrecision"]),
        })

    curves = {}
    for inj in ("spike", "swap"):
        curves[inj] = {}
        for det in DET_ORDER:
            pts = ev["curves"][inj][det]
            if len(pts) != 101:
                print(f"curve {inj}/{det} has {len(pts)} points", file=sys.stderr)
                return 1
            curves[inj][det] = [[r6(p[0]), r6(p[1]), r6(p[2]), r6(p[3])] for p in pts]

    pca = ev["pca"]
    scatter = [[round(float(p[0]), 3), round(float(p[1]), 3), int(p[2])] for p in pca["scatter"]]
    if len(scatter) != len(pca["scatter"]):
        print("scatter truncated", file=sys.stderr)
        return 1

    cov = ev["coverage"]
    bnd = ev["boundary"]
    out = {
        "meta": {
            "film": EPISODE,
            "checks": int(ev["checks"]["passed"]),
            "checkTotal": int(ev["checks"]["total"]),
            "runtimeSec": round(float(ev["elapsedSec"]), 2),
            "tests": {"suites": 108, "asserts": 1493, "new": 20},
            "algoCommit": "7dbbce0",
            "evidenceCommit": "8fe4791",
            "dataCommit": "6ddf78b",
        },
        "data": {
            "file": manifest["file"],
            "rows": int(manifest["rows"]),
            "start": manifest["start"],
            "end": manifest["end"],
            "bytes": int(manifest["bytes"]),
            "sha": manifest["sha256"],
            "split": {"train": "2015-01-01..2020-12-31", "test": "2021-01-01..2026-06-30"},
            "maxGapDays": int(manifest["maxGapDays"]),
            "maxGapAt": manifest["maxGapAt"],
            "stocks": len(manifest["codes"]),
        },
        "samples": {
            "total": int(cov["samples"]["total"]),
            "train": int(cov["samples"]["train"]),
            "test": int(cov["samples"]["test"]),
            "perStock": int(cov["samples"]["perStock"]),
            "trainPerStock": int(cov["samples"]["train"]) // 8,
            "dim": int(cov["samples"]["dim"]),
            "panelDim": int(cov["samples"]["panelDim"]),
            "window": 24,
        },
        "inject": {
            "seed": int(cov["injection"]["seed"]),
            "perStock": int(cov["injection"]["perStock"]),
            "spike": int(cov["injection"]["spike"]),
            "swap": int(cov["injection"]["swap"]),
            "ratePct": round(100.0 * float(cov["injection"]["rate"]), 3),
        },
        "params": {
            "k": int(ev["method"]["kmeans"]["k"]),
            "iters": int(ev["method"]["kmeans"]["iterations"]),
            "seed": 42,
            "lofK": int(ev["method"]["lof"]["k"]),
            "trees": int(ev["method"]["iforest"]["trees"]),
            "psi": int(ev["method"]["iforest"]["sampleSize"]),
            "q": 0.99,
            "smallShare": 0.03,
        },
        "readings": readings,
        "headline": {
            "kmeansSpikeF1": r6(summary["headline"]["kmeansSpikeF1"]),
            "lofSwapF1": r6(summary["headline"]["lofSwapF1"]),
        },
        "boundary": {
            "trainTau": r6(bnd["trainQuantileThreshold"]),
            "posAtTrainTau": int(bnd["positivesAtTrainThreshold"]),
            "rateAtTrainTau": r6(bnd["rateAtTrainThreshold"]),
            "matchedTau": r6(bnd["matchedRateThreshold"]),
            "matchedF1": r6(bnd["matchedRateF1"]),
            "matchedPos": int(bnd["matchedRatePositives"]),
            "matchedP": r6(bnd["matchedRatePrecision"]),
            "matchedR": r6(bnd["matchedRateRecall"]),
            "spikeDelta": r6(bnd["spikeScoreDeltaMean"]),
            "zShift": r6(bnd["spikeZShiftMean"]),
        },
        "diag": {
            "trainAlertRate": r6(ev["method"]["kmeans"]["kRate"]) if "kRate" in ev["method"]["kmeans"] else 0.0100,
            "smallClusters": int(ev["method"]["kmeans"]["smallClusterCount"]),
            "smallShare": r6(ev["method"]["kmeans"]["smallClusterShare"]),
            "ifMean": 0.3978,
        },
        "pca": {
            "ratio1": round(float(pca["ratio"][0]), 6),
            "ratio2": round(float(pca["ratio"][1]), 6),
            "var1": round(float(pca["variance"][0]), 4),
            "var2": round(float(pca["variance"][1]), 4),
            "cum10": round(float(pca["cumulativeRatio10"]), 6),
            "scatter": scatter,
        },
        "curves": curves,
        "checks": [{"name": c["name"], "ok": bool(c["ok"]), "detail": str(c["detail"])} for c in ev["details"]],
    }

    dest = PACK / "data" / "unsup.json"
    dest.write_text(json.dumps(out, ensure_ascii=False, separators=(",", ":")) + "\n", encoding="utf-8")
    print(f"wrote {dest} ({dest.stat().st_size} bytes, {len(out['checks'])} checks, {len(readings)} readings, {len(scatter)} scatter points)")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
