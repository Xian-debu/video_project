#!/usr/bin/env python3
"""E59 dist.json: readings from the 34-check evidence + window examples."""
from __future__ import annotations

import csv
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
EVIDENCE = Path("/root/ts-base/inventory/evidence/59-mini-foundation-loop.ch7-mini.json")
CSV = ROOT / "data" / "episode" / "series_000001.csv"
OUT = ROOT / "data" / "dist.json"


def main() -> None:
    ev = json.loads(EVIDENCE.read_text())
    r = ev["readings"]
    dates = []
    with CSV.open() as f:
        rd = csv.reader(f)
        next(rd)
        for row in rd:
            dates.append(row[0])

    data = {
        "meta": {
            "episode": 59,
            "slug": "mini-foundation-loop",
            "chapter": "ch07",
            "title": "一万个参数的「基础模型」：掩码重建 + 线性头 + 少样本",
            "runtimeTarget": 24,
        },
        "checks": ev["checks"],
        "summary": {"total": ev["total"], "passed": ev["passed"], "failed": ev["failed"], "ok": ev["ok"]},
        "data": {
            "series": r["series"],
            "rows": r["rows"],
            "windows": r["trainN"] + r["valN"] + r["testN"],
            "availWindows": r["windows"],
            "trainN": r["trainN"],
            "valN": r["valN"],
            "testN": r["testN"],
            "trainOff": r["trainOff"],
            "valOff": r["valOff"],
            "testOff": r["testOff"],
            "firstDate": dates[0],
            "lastDate": dates[-1],
            "maskedCount": r["maskedCount"],
            "maskRatio": r["maskRatio"],
            "patchLen": r["patchLen"],
            "segCount": 512 // r["patchLen"],
            "segFull": r["maskedCount"] // r["patchLen"],
            "segPartial": r["maskedCount"] % r["patchLen"],
        },
        "params": {
            "enc": r["encParams"],
            "planEnc": r["planEncParams"],
            "w1": r["encW1"],
            "b1": r["encB1"],
            "w2": r["encW2"],
            "b2": r["encB2"],
            "token": r["encToken"],
            "head": r["headParams"],
            "total": r["totalParams"],
            "planTotal": 66956,
            "planDiff": 457,
            "probe": r["probeParams"],
        },
        "train": {
            "epochs": r["epochs"],
            "bestEpoch": r["bestEpoch"],
            "trainLoss": r["trainLoss"],
            "valLoss": r["valLoss"],
            "valTrained": r["valTrained"],
            "valUntrained": r["valUntrained"],
            "valRatio": r["valRatio"],
            "gradErr": r["gradErr"],
            "epochSec": 3.2,
        },
        "curve": r["curve"],
        "probe": {"relMSE": r["probeRelMSE"], "lambda": r["probeLambda"], "params": r["probeParams"]},
        "cross": {
            "stocks": r["crossStocks"],
            "rows": 1900,
            "rel100": r["crossRel100"],
            "reconMSE": r["crossReconMSE"],
            "windows": 1369,
            "pool": 960,
            "val": 136,
            "test": 273,
        },
        "example": {"true": r["exampleTrue"], "pred": r["examplePred"], "mask": r["exampleMask"]},
        "code": {"modules": 3, "moduleLines": 822, "exports": 43, "tests": 39, "evidenceLines": 510, "checks": 34},
    }
    OUT.write_text(json.dumps(data, ensure_ascii=False, indent=1) + "\n")
    print(f"dist: {len(ev['checks'])} checks, {r['encParams']} params, {OUT.stat().st_size} B")


if __name__ == "__main__":
    main()
