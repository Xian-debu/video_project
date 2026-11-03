#!/usr/bin/env python3
"""E58 dist.json: readings from the 24-check evidence + correlation matrix."""
from __future__ import annotations

import csv
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
EVIDENCE = Path("/root/ts-base/inventory/evidence/58-channel-strategies.ch7-channel.json")
CSV = ROOT / "data" / "episode" / "channels.csv"
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
            "episode": 58,
            "slug": "channel-strategies",
            "chapter": "ch07",
            "title": "通道独立还是混合：一个由相关性决定的选择题",
            "runtimeTarget": 20,
        },
        "checks": ev["checks"],
        "summary": {"total": ev["total"], "passed": ev["passed"], "failed": ev["failed"], "ok": ev["ok"]},
        "data": {
            "channels": r["channels"],
            "rows": r["rows"],
            "samples": r["samples"],
            "codes": r["codes"],
            "firstDate": dates[0],
            "lastDate": dates[-1],
            "corr": r["corr"],
            "meanAbsCorr": r["meanAbsCorr"],
            "maxAbsCorr": r["maxAbsCorr"],
            "eig": r["eig"],
            "effRank": r["effRank"],
            "top1": r["top1"],
            "top3": r["top3"],
        },
        "synth": {
            "rho0": {"effRank": r["synth0Eff"], "top1": r["synth0Top1"], "meanAbs": r["synth0Mean"], "strategy": "independent"},
            "rho9": {"effRank": r["synth9Eff"], "top1": r["synth9Top1"], "meanAbs": r["synth9Mean"], "strategy": "mixed"},
        },
        "decision": {
            "strategy": r["realStrategy"],
            "groups": 2,
            "meanThreshold": 0.6,
            "indThreshold": 0.2,
            "rankThreshold": 3,
        },
        "tokens": {
            "patch": 32,
            "perChannel": 16,
            "ci": r["ciTokens"],
            "cm": r["cmTokens"],
            "hybrid": r["hybridTokens"],
            "costCi": r["attentionCi"],
            "costCm": r["attentionCm"],
            "costHybrid": 32768,
            "ratio": 36,
            "hybridRatio": 9,
        },
        "code": {"modules": 1, "moduleLines": 269, "exports": 18, "tests": 29, "evidenceLines": 212},
    }
    OUT.write_text(json.dumps(data, ensure_ascii=False, indent=1) + "\n")
    print(f"dist: {len(ev['checks'])} checks, effRank {r['effRank']}, {OUT.stat().st_size} B")


if __name__ == "__main__":
    main()
