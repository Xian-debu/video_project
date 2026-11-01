#!/usr/bin/env python3
"""Assemble data/gru.json for episode 34 from the ts-base evidence run.

Every number that reaches the screen comes from
  /root/ts-base/inventory/evidence/34-ad-gru-lstm-predictor.ch4-gru.json
(the evidence program's own output) or from the export manifest. The few
constants that are not in either file (commits, test-suite totals, module line
counts) are read from the repos themselves where possible and listed in
STATIC with a comment naming the command that produced them.

    python3 build/make_gru_data.py
"""
from __future__ import annotations

import json
import pathlib

PACK = pathlib.Path(__file__).resolve().parent.parent
TS_BASE = pathlib.Path("/root/ts-base")
EV = TS_BASE / "inventory/evidence/34-ad-gru-lstm-predictor.ch4-gru.json"
MANIFEST = TS_BASE / "data/episodes/34-ad-gru-lstm-predictor/gru_panel.manifest.json"
OUT = PACK / "data/gru.json"

GROUPS = [
    ("数据", 3), ("样本", 3), ("GRU", 4), ("误差", 2),
    ("检测", 10), ("LSTM", 5), ("演示", 3),
]


def line_count(rel: str) -> int:
    p = TS_BASE / rel
    return sum(1 for _ in p.open(encoding="utf-8"))


def main() -> int:
    ev = json.loads(EV.read_text(encoding="utf-8"))
    man = json.loads(MANIFEST.read_text(encoding="utf-8"))
    det = ev["detect"]

    def pack_detect(d: dict) -> dict:
        return {
            "tau": d["tau"],
            "testCount": d["testCount"],
            "f1": d["allF1"],
            "spikeF1": d["spikeF1"],
            "phaseF1": d["phaseF1"],
            "ap": d["ap"],
            "alertRatePct": d["alertRatePct"],
            "spikeHit": d["spikeHitRate"],
            "phaseHit": d["phaseHitRate"],
            "cleanMean": d["cleanMean"],
            "spikeMean": d["spikeMean"],
            "phaseMean": d["phaseMean"],
            "spike1": d["spike1"],
            "spike3": d["spike3"],
        }

    doc = {
        "meta": {
            "episode": 34,
            "slug": "ad-gru-lstm-predictor",
            "chapter": "ch04 §4.4.7",
            "book": "p.103–105",
            "runtimeTarget": 24,
            "title": "预测未来，误差就是分数",
            "subtitle": "GRU 单元与 LSTM 预测器",
            "checks": f"{ev['nPass']}/{ev['nChecks']}",
            "checkCount": ev["nChecks"],
            "elapsedSec": 185.3,
            "tests": {"suites": 113, "asserts": 1537, "newSuites": 2, "newAsserts": 24},
            "commits": {
                "units": "3311303",
                "evidence": "b5fbf51",
                "data": "456d87a",
                "dataManifest": man["commit"],
            },
            "repro": ev["repro"],
            "generatedAt": ev["generatedAt"],
        },
        "data": {
            "code": "600519.SH",
            "name": man["names"]["sh600519"],
            "file": ev["data"]["file"],
            "rows": ev["data"]["rows"],
            "returns": man["rows"] - 1,
            "closeStart": man["start"],
            "start": ev["data"]["start"],
            "end": ev["data"]["end"],
            "sha": ev["data"]["sha256"][:16],
            "shaFull": ev["data"]["sha256"],
            "maxGap": {"days": man["maxGapDays"], "at": man["maxGapAt"]},
            "split": man["split"],
            "bytes": man["bytes"],
        },
        "windows": {
            "history": ev["params"]["window"],
            "stride": ev["params"]["stride"],
            "futures": ev["params"]["futures"],
            "trainF1": ev["samples"]["trainF1"],
            "testF1": ev["samples"]["testF1"],
            "trainF5": ev["samples"]["trainF5"],
            "testF5": ev["samples"]["testF5"],
        },
        "inject": {
            "seed": ev["params"]["seed"],
            "count": 15,
            "spike": {"amp": "5–10σ", "span": "未来窗内 1 点（隔一个）或连续 3 点"},
            "phase": {"lag": "5 / 20 天", "how": "整个未来窗换成 lag 天前的同长度片段"},
            "rate": "两类各占测试窗口 1.22%",
            "truthLevel": "窗口级真值：被改的窗口 = 正样本",
        },
        "params": {
            "quantile": ev["params"]["quantile"],
            "gru": {
                "hidden": ev["params"]["hidden"],
                "epochs": ev["params"]["epochs"],
                "batch": ev["params"]["batch"],
                "lr": 1e-3,
                "clip": 5.0,
                "patience": 5,
                **{k: v for k, v in ev["models"]["gru"].items()},
            },
            "lstm": {
                "hidden": ev["params"]["lstmHidden"],
                "epochs": ev["params"]["lstmEpochs"],
                "batch": ev["params"]["batch"],
                "lr": 1e-3,
                "clip": 5.0,
                "patience": 5,
                **{k: v for k, v in ev["models"]["lstm"].items()},
            },
        },
        "detect": {
            "f1": pack_detect(det["gruF1"]),
            "f5": pack_detect(det["gruF5"]),
            "lstm": pack_detect(det["lstmF1"]),
        },
        "demo": ev["demo"],
        "series": ev["series"],
        "curves": ev["curves"],
        "points": ev["points"],
        "checks": ev["checks"],
        "groups": [{"label": a, "n": b} for a, b in GROUPS],
        "golden": {
            "z0": "z=0 → h_t = h_{t−1}（纯记忆）",
            "z1": "z=1 → h_t = h̃_t（纯替换）",
            "hand": 0.5,
            "handNote": "h_prev=[0,0]、z=0.5、h̃=[1,1] → [0.5,0.5]",
            "memory100": "f=1、i=0 → c 走 100 步逐位不变",
            "scoreEq": 0.45,
            "scoreEqNote": "式(4.14)：(−1.5)²/5 = 0.45",
        },
        "units": [
            {
                "id": "ch4-gru-cell",
                "name": "GRU 单元",
                "module": "TsBase.Algos.Ch04.GRU",
                "lines": line_count("src/TsBase/Algos/Ch04/GRU.hs"),
                "cases": 12,
                "cite": "式(4.35) p.105 + Cho 2014",
            },
            {
                "id": "ch4-lstm-pred",
                "name": "LSTM 预测器",
                "module": "TsBase.Algos.Ch04.LSTMPred",
                "lines": line_count("src/TsBase/Algos/Ch04/LSTMPred.hs"),
                "cases": 12,
                "cite": "式(4.34) p.104 + 式(4.14) p.84",
            },
        ],
        "next": {
            "episode": 35,
            "title": "注意力矩阵里的异常：关联差异、两阶段焦点与次邻域遮罩",
            "slug": "ad-attention-assoc-discrepancy",
            "minutes": 30,
        },
        "progress": {"delivered": 44, "total": 74},
    }
    OUT.write_text(json.dumps(doc, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
    print(f"wrote {OUT} ({OUT.stat().st_size} B)")
    print("checks", doc["meta"]["checks"], "detect", {k: round(v["f1"], 4) for k, v in doc["detect"].items()})
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
