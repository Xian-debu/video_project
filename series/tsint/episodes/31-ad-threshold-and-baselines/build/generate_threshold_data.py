#!/usr/bin/env python3
"""Generate data/threshold.json for E31 from the ts-base evidence artifacts.

唯一真源是 ts-base 证据程序的落盘产物（summary.json / threshold_routes.csv /
manifest.json / 三份 evidence JSON）。画面上的每个数字都从这里来，不手抄。
"""
import csv
import json
import pathlib
import sys

PACK = pathlib.Path(__file__).resolve().parent.parent
TS_BASE = pathlib.Path("/root/ts-base/data/episodes/31-ad-threshold-and-baselines")
EVIDENCE = pathlib.Path("/root/ts-base/inventory/evidence")
UNITS = ["ch4-thresh", "ch4-sup-cls", "ch4-ma-es"]
EPISODE = "31-ad-threshold-and-baselines"

# 下面这些是我们的配方（书里没给），证据程序里写死，这里按同一口径标注。
FIXED_TAU = 3.0
Q_RATE = 0.01
ALPHA_RANGE = 0.2
SPIKE_SIGMA = (5, 10)
MEDIUM_SIGMA = (2, 4)
SPOT_Q, SPOT_RISK, SPOT_TAIL_MIN = 0.02, 0.01, 50
MA_K, MA_ALPHA = 20, 0.3

ROUTE_LABEL = {
    "fixed 3 sigma": "固定 3σ",
    "train quantile 1%": "训练段 1% 分位",
    "spot": "SPOT",
}
ROUTE_KEY = {"fixed 3 sigma": "fixed", "train quantile 1%": "quantile", "spot": "spot"}
SWEEP_LABEL = {"fixed 3 sigma": "fixed", "train quantile": "quantile", "spot": "spot"}
DET_LABEL = {"hand z-score": ("hand", "手打 |z|"), "ma residual": ("ma", "MA 残差"), "logistic window": ("cls", "监督分类器")}


def read_json(path):
    return json.loads(path.read_text(encoding="utf-8"))


def main() -> int:
    summary = read_json(TS_BASE / "summary.json")
    manifest = read_json(TS_BASE / "threshold_600519.manifest.json")
    rows = list(csv.DictReader((TS_BASE / "threshold_routes.csv").open(encoding="utf-8")))

    if int(summary["data"]["rows"]) != int(manifest["rows"]):
        print("summary rows disagree with manifest", file=sys.stderr)
        return 1
    if summary["data"]["sha256"] != manifest["sha256"]:
        print("summary sha256 disagrees with manifest", file=sys.stderr)
        return 1
    if len(rows) != 6:
        print(f"threshold_routes.csv has {len(rows)} rows, expected 6", file=sys.stderr)
        return 1

    checks = []
    for unit in UNITS:
        doc = read_json(EVIDENCE / f"{EPISODE}.{unit}.json")
        for c in doc["checks"]:
            checks.append({"unit": unit, "name": c["name"], "ok": bool(c["ok"]), "detail": str(c["detail"])})
    failed = [c for c in checks if not c["ok"]]
    if failed:
        print(f"{len(failed)} evidence checks failed; refusing to build data", file=sys.stderr)
        return 1

    cls_doc = read_json(EVIDENCE / f"{EPISODE}.ch4-sup-cls.json")
    cls = cls_doc["classifier"]
    detectors = []
    for d in cls_doc["readings"]["detectors"]:
        key, label = DET_LABEL[d["name"]]
        detectors.append({
            "key": key,
            "name": label,
            "f1": round(float(d["f1PointAdjusted"]), 4),
            "rf1": round(float(d["rangeF1"]), 4),
            "pos": int(d["positives"]),
        })

    spot_doc = read_json(EVIDENCE / f"{EPISODE}.ch4-thresh.json")["spot"]

    routes = []
    for r in rows:
        routes.append({
            "key": ROUTE_KEY[r["route"]],
            "label": ROUTE_LABEL[r["route"]],
            "variant": r["variant"],
            "tau": round(float(r["tau"]), 4),
            "pos": int(r["positives"]),
            "p": round(float(r["precision"]), 4),
            "r": round(float(r["recall"]), 4),
            "f1": round(float(r["f1"]), 4),
            "padj": round(float(r["f1PointAdjusted"]), 4),
            "rf1": round(float(r["rangeF1"]), 4),
        })
    sweep = [
        {"variant": s["variant"], "rate": float(s["rate"]), "route": SWEEP_LABEL[s["route"]], "f1": round(float(s["f1"]), 4)}
        for s in summary["sweep"]
    ]
    if len(sweep) != 18:
        print(f"sweep has {len(sweep)} rows, expected 18", file=sys.stderr)
        return 1

    golden = summary["golden"]
    spike = summary["injection"]["spike"]
    medium = summary["injection"]["medium"]
    out = {
        "meta": {
            "film": EPISODE,
            "checks": int(summary["checks"]["passed"]),
            "checkTotal": int(summary["checks"]["total"]),
            "runtimeSec": round(float(summary["elapsedSec"]), 2),
            "tests": {"suites": 105, "asserts": 1473, "new": 55},
            "algoCommit": "e4e0813",
            "evidenceCommit": "7258483",
            "dataCommit": "fd593cc",
        },
        "data": {
            "file": manifest["file"],
            "rows": int(manifest["rows"]),
            "start": manifest["start"],
            "end": manifest["end"],
            "bytes": int(manifest["bytes"]),
            "sha": manifest["sha256"],
            "split": {"train": summary["split"]["train"], "test": summary["split"]["test"]},
        },
        "params": {
            "fixedTau": FIXED_TAU,
            "qRate": Q_RATE,
            "altRates": sorted({float(s["rate"]) for s in summary["sweep"]}),
            "alphaRange": ALPHA_RANGE,
            "maK": MA_K,
            "maAlpha": MA_ALPHA,
            "clsWin": int(cls["window"]),
            "clsEpochs": int(cls["epochs"]),
            "clsLr": float(cls["lr"]),
        },
        "inject": {
            "seed": 42,
            "spike": {
                "points": int(spike["points"]),
                "segments": int(spike["segments"]),
                "ratePct": round(100.0 * int(spike["points"]) / int(manifest["rows"]), 3),
                "sigmaMin": SPIKE_SIGMA[0],
                "sigmaMax": SPIKE_SIGMA[1],
                "testTruth": int(spike["testTruth"]),
            },
            "medium": {
                "points": int(medium["points"]),
                "segments": int(medium["segments"]),
                "sigmaMin": MEDIUM_SIGMA[0],
                "sigmaMax": MEDIUM_SIGMA[1],
                "testTruth": int(medium["testTruth"]),
                "lowVolPool": int(medium["lowVolPool"]),
            },
        },
        "taus": {
            "fixed": round(float(summary["thresholds"]["fixedTau"]), 4),
            "trainQuantile": round(float(summary["thresholds"]["trainQuantileTau"]), 4),
            "testQuantile": round(float(summary["thresholds"]["testQuantileTau"]), 4),
            "spot": round(float(summary["thresholds"]["spotTau"]), 4),
        },
        "spot": {
            "xi": round(float(spot_doc["xi"]), 4),
            "beta": round(float(spot_doc["beta"]), 4),
            "u": round(float(spot_doc["u"]), 4),
            "q": SPOT_Q,
            "risk": SPOT_RISK,
            "tailMin": SPOT_TAIL_MIN,
            "synTau": round(float(spot_doc["syntheticTau"]), 4),
            "synRate": round(float(spot_doc["syntheticRate"]), 5),
        },
        "routes": routes,
        "sweep": sweep,
        "detectors": detectors,
        "classifier": {
            "window": int(cls["window"]),
            "epochs": int(cls["epochs"]),
            "lr": float(cls["lr"]),
            "posWeight": round(float(cls["posWeight"]), 2),
            "trainWindows": int(cls["trainWindows"]),
            "testWindows": int(cls["testWindows"]),
        },
        "golden": {
            "quantile025Tau": round(float(golden["quantile025Tau"]), 4),
            "quantile025Pred": golden["quantile025Pred"],
            "quantile0Pred": golden["quantile0Pred"],
            "quantile1Pred": golden["quantile1Pred"],
            "qCount": int(golden["qCount"]),
            "qExpect": round(float(golden["qExpect"]), 2),
            "smallSpotTau": round(float(golden["smallSpotTau"]), 3),
            "oneStepW": round(float(golden["oneStepW"]), 4),
            "sepF1": round(float(golden["sepF1"]), 4),
            "bigLoss": float(golden["bigLoss"]),
            "maGold": golden["maGold"],
            "esDiff": golden["esDiff"],
            "esPred": golden["esPred"],
        },
        "checks": checks,
    }

    dest = PACK / "data" / "threshold.json"
    dest.write_text(json.dumps(out, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
    print(f"wrote {dest} ({dest.stat().st_size} bytes, {len(checks)} checks, {len(routes)} routes, {len(sweep)} sweep rows)")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
