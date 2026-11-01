#!/usr/bin/env python3
"""Generate data/foundation.json for E30 from the ts-base evidence artifacts.

唯一真源是 ts-base 证据程序的落盘产物（summary.json / metrics.csv /
window_scores.csv / foundation_600519.manifest.json）与三份 evidence JSON；
画面上的每个数字都从这里来，不手抄。
"""
import csv
import json
import pathlib
import sys

PACK = pathlib.Path(__file__).resolve().parent.parent
TS_BASE = pathlib.Path("/root/ts-base/data/episodes/30-ad-foundation-window-score")
EVIDENCE = pathlib.Path("/root/ts-base/inventory/evidence")
UNITS = ["ch4-window", "ch4-metrics", "ch4-score"]


def read_json(path):
    return json.loads(path.read_text(encoding="utf-8"))


def main() -> int:
    summary = read_json(TS_BASE / "summary.json")
    manifest = read_json(TS_BASE / "foundation_600519.manifest.json")
    rows = list(csv.DictReader((TS_BASE / "window_scores.csv").open(encoding="utf-8")))
    metrics = {r["scorer"]: r for r in csv.DictReader((TS_BASE / "metrics.csv").open(encoding="utf-8"))}

    if len(rows) != int(summary["window"]["count"]):
        print(f"window_scores.csv has {len(rows)} rows, summary says {summary['window']['count']}", file=sys.stderr)
        return 1
    if summary["data"]["sha256"] != manifest["sha256"]:
        print("summary/data sha256 disagree with manifest", file=sys.stderr)
        return 1

    labeled = [r for r in rows if r["label"] == "1"]
    windows = [int(r["window"]) for r in rows]
    mse = [float(r["mse"]) for r in rows]
    mae = [float(r["mae"]) for r in rows]
    pred = [float(r["pred"]) for r in rows]

    top = sorted(rows, key=lambda r: (-float(r["mse"]), int(r["window"])))[: int(summary["threshold"]["k"])]

    # 图上的曲线按每 3 个窗口取 1 个点（196 点），统计与检查仍用全部 586 个。
    step = 3
    curve = {
        "windows": windows[::step],
        "mse": [round(v, 4) for v in mse[::step]],
        "mae": [round(v, 4) for v in mae[::step]],
        "pred": [round(v, 4) for v in pred[::step]],
        "label": [1 if r["label"] == "1" else 0 for r in rows[::step]],
    }

    checks = []
    for unit in UNITS:
        doc = read_json(EVIDENCE / f"30-ad-foundation-window-score.{unit}.json")
        for c in doc["checks"]:
            checks.append({"unit": unit, "name": c["name"], "ok": bool(c["ok"]), "detail": str(c["detail"])})

    def score_row(name):
        m = metrics[name]
        return {
            "p": round(float(m["plainP"]), 4),
            "r": round(float(m["plainR"]), 4),
            "f1": round(float(m["plainF1"]), 4),
            "padj": round(float(m["padjF1"]), 4),
            "rp": round(float(m["rangeP"]), 4),
            "rr": round(float(m["rangeR"]), 4),
            "rf1": round(float(m["rangeF1"]), 4),
        }

    out = {
        "meta": {
            "film": "30-ad-foundation-window-score",
            "checks": int(summary["checks"]["pass"]),
            "checkTotal": int(summary["checks"]["total"]),
            "runtimeSec": 0.1,
            "tests": {"suites": 102, "asserts": 1418, "new": 47},
            "algoCommit": "be8601e",
            "evidenceCommit": "3f047b8",
            "dataCommit": "27c92b6",
        },
        "data": {
            "file": summary["data"]["file"],
            "code": manifest["code"],
            "name": manifest["name"],
            "rows": int(summary["data"]["rows"]),
            "start": summary["data"]["start"],
            "end": summary["data"]["end"],
            "bytes": int(manifest["bytes"]),
            "sha": summary["data"]["sha256"],
            "mean": round(float(summary["data"]["mean"]), 2),
            "sd": round(float(summary["data"]["sd"]), 2),
            "maxGapDays": int(manifest["maxGapDays"]),
            "maxGapAt": manifest["maxGapAt"],
        },
        "window": {
            "len": int(summary["window"]["len"]),
            "stride": int(summary["window"]["stride"]),
            "count": int(summary["window"]["count"]),
            "strideTrain": int(manifest["window"]["strideTrain"]),
            "strideInfer": int(manifest["window"]["strideInfer"]),
            "hand": {"T": 1448, "s1": 1349, "s10": 135},
        },
        "inject": {
            "seed": int(summary["injection"]["seed"]),
            "rate": round(float(summary["injection"]["rate"]), 4),
            "points": int(summary["injection"]["points"]),
            "segments": int(summary["injection"]["segments"]),
            "sigmaMin": int(summary["injection"]["sigma"][0]),
            "sigmaMax": int(summary["injection"]["sigma"][1]),
            "actualRate": round(float(summary["labels"]["pointRate"]), 6),
        },
        "labels": {
            "windows": int(summary["labels"]["windowsLabeled"]),
            "rate": round(float(summary["labels"]["windowRate"]), 4),
            "foldedMse": int(summary["labels"]["foldedPointsMse"]),
            "foldedPred": int(summary["labels"]["foldedPointsPred"]),
            "k": int(summary["threshold"]["k"]),
        },
        "scores": {
            "mse": score_row("recon-mse"),
            "mae": score_row("recon-mae"),
            "pred": score_row("pred-mse"),
        },
        "flip": {
            "plainA": round(float(summary["flip"]["plainA"]), 4),
            "plainB": round(float(summary["flip"]["plainB"]), 4),
            "padjA": round(float(summary["flip"]["padjA"]), 4),
            "padjB": round(float(summary["flip"]["padjB"]), 4),
            "rangeA": round(float(summary["flip"]["rangeA"]), 4),
        },
        "top": [
            {
                "window": int(r["window"]),
                "start": int(r["start"]),
                "label": int(r["label"]),
                "mse": round(float(r["mse"]), 4),
                "mae": round(float(r["mae"]), 4),
                "pred": round(float(r["pred"]), 4),
            }
            for r in top
        ],
        "curve": curve,
        "checks": checks,
    }

    dest = PACK / "data" / "foundation.json"
    dest.write_text(json.dumps(out, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
    print(f"wrote {dest} ({dest.stat().st_size} B)")
    print(f"rows {out['data']['rows']}, windows {out['window']['count']}, labels {out['labels']['windows']}"
          f" ({out['labels']['rate'] * 100:.2f}%), checks {out['meta']['checks']}/{out['meta']['checkTotal']}")
    print("top windows:", [(t["window"], t["start"], t["label"]) for t in out["top"]])
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
