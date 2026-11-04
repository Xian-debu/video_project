#!/usr/bin/env python3
"""E60 dist.json: readings from the 18-check evidence + the 20-step example curve."""
from __future__ import annotations

import csv
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
EVIDENCE = Path("/root/ts-base/inventory/evidence/60-ar-vs-nar-decoding.ch7-decode.json")
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
            "episode": 60,
            "slug": "ar-vs-nar-decoding",
            "chapter": "ch07",
            "title": "一步一步还是一口气：自回归与非自回归解码",
            "runtimeTarget": 16,
        },
        "checks": ev["checks"],
        "summary": {"total": ev["total"], "passed": ev["passed"], "failed": ev["failed"], "ok": ev["ok"]},
        "data": {
            "seriesRows": r["seriesRows"],
            "segmentRows": r["segmentRows"],
            "segmentStart": r["segmentStart"],
            "segmentEnd": r["segmentEnd"],
            "testStart": r["testStart"],
            "preWindows": r["preWindows"],
            "windows": r["windows"],
            "trainN": r["trainN"],
            "valN": r["valN"],
            "testN": r["testN"],
            "winLen": 512,
            "horizon": 20,
            "firstDate": dates[0],
            "lastDate": dates[-1],
        },
        "params": {"enc": r["encParams"], "arHead": 66, "narHead": r["narParams"], "planNar": 1300},
        "ar": {
            "lambda": r["arLambda"],
            "mae1": r["arMae1"],
            "mae20": r["arMae20"],
            "rel1": r["arRel1"],
            "rel20": r["arRel20"],
            "teacher": r["teacherMae"],
            "free": r["freeMae"],
            "gap": r["exposureGap"],
            "copyOk": r["copyOk"],
        },
        "nar": {
            "lambda20": r["narLambda20"],
            "mae1": r["narMae1"],
            "mae20": r["narMae20"],
            "rel1": r["narRel1"],
            "rel20": r["narRel20"],
        },
        "timing": {
            "arSeconds": r["arSeconds"],
            "narSeconds": r["narSeconds"],
            "ratio": r["speedRatio"],
            "windows": r["testN"],
        },
        "crossing": r["crossing"],
        "persistMae20": r["persistMae20"],
        "idMse": r["idMse"],
        "exposure": {"teacher": r["teacherMae"], "free": r["freeMae"], "gap": r["exposureGap"]},
        "curve": r["curve"],
        "example": {"truth20": r["truth20"], "ar20": r["ar20"], "nar20": r["nar20"]},
        "code": {
            "modules": 2,
            "arLines": 83,
            "narLines": 60,
            "moduleLines": 143,
            "tests": 18,
            "evidenceLines": 421,
            "checks": 18,
        },
    }
    OUT.write_text(json.dumps(data, ensure_ascii=False, indent=1) + "\n")
    print(f"dist: {len(ev['checks'])} checks, ratio {r['speedRatio']}x, {OUT.stat().st_size} B")


if __name__ == "__main__":
    main()
