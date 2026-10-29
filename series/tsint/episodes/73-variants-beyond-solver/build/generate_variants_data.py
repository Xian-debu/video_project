#!/usr/bin/env python3
"""Build data/variants.json for episode 73 from ts-base evidence.

The episode's claim is narrow and testable: CfC's scalar closed form is one
evaluation (no solver), while GM-ODE keeps RK4 and only replaces the black-box
right-hand side with a grey whitening equation. Every number on screen comes
from summary.json / CSV produced by evidence-ch09d.
"""
from __future__ import annotations

import csv
import hashlib
import json
from pathlib import Path

HERE = Path(__file__).resolve().parent
PACK = HERE.parent
EV = PACK / "data" / "evidence"
OUT = PACK / "data" / "variants.json"

TS_BASE_COMMIT = "d894a85"


def rows(name):
    with (EV / name).open(newline="") as f:
        return list(csv.DictReader(f))


def num(row, key):
    return float(row[key])


def sha(name):
    return hashlib.sha256((EV / name).read_bytes()).hexdigest()


summary = json.loads((EV / "summary.json").read_text())
ago_rows = rows("ago.csv")
fit_rows = rows("gm_fit.csv")
rk4_rows = rows("gm_rk4.csv")
cfc_rows = rows("cfc.csv")
softplus_rows = rows("softplus.csv")

# ---------- assertions: the story must still be true ----------
assert summary["episode"] == 73
assert [round(num(r, "level")) for r in ago_rows] == [1, 2, 3, 4]
assert [round(num(r, "ago")) for r in ago_rows] == [1, 3, 6, 10]
assert [round(num(r, "iago")) for r in ago_rows] == [1, 2, 3, 4]
assert abs(summary["fit"]["a"] - 0.03045685279187818) < 1e-15
assert abs(summary["fit"]["b"] - 12.182741116751265) < 1e-12
assert summary["fit"]["mape"] < 0.01, summary["fit"]["mape"]
assert summary["gm"]["rk4MaxError"] < 1e-9, summary["gm"]["rk4MaxError"]
assert summary["cfc"]["softplusNaive"] == "Infinity"
assert abs(summary["cfc"]["softplusStable"] - 1000.0) < 1e-12
assert abs(summary["cfc"]["logSumExp"] - (1000.0 + 0.6931471805599453)) < 1e-12
assert summary["cfc"]["evalsClosed"] == 1 and summary["cfc"]["evalsRK4"] == 800
assert len(fit_rows) == 24 and len(rk4_rows) == 24 and len(cfc_rows) == 5

# 24 个点上的拟合/闭式/预测；rk4 与闭式在整数点对照
fit = [
    {
        "k": int(num(r, "k")),
        "actual": num(r, "actual"),
        "ago": num(r, "ago"),
        "response": num(r, "response"),
        "forecast": num(r, "forecast"),
    }
    for r in fit_rows
]
rk4 = [{"k": int(num(r, "k")), "closed": num(r, "z_closed"), "rk4": num(r, "z_rk4")} for r in rk4_rows]
cfc = [{"t": num(r, "t"), "exact": num(r, "exact"), "gate": num(r, "gate")} for r in cfc_rows]
softplus = [
    {"raw": num(r, "raw"), "naive": None if r["naive"] == "Infinity" else num(r, "naive"), "stable": num(r, "stable")}
    for r in softplus_rows
]

doc = {
    "meta": {
        "episode": 73,
        "title": "variants-beyond-solver",
        "bookPage": 219,
        "tsBaseCommit": TS_BASE_COMMIT,
        "evidenceRunAt": "2026-10-29T15:56:34+0000",
        "ghc": "9.14.1",
        "cabal": "3.16.1.0",
        "evidenceSha": sha("ch9-variants-20261029T155634.json"),
        "tests": summary["tests"],
    },
    "key": {
        "ago": summary["ago"],
        "iago": summary["iago"],
        "seriesN": summary["series"]["n"],
        "seriesQ": summary["series"]["q"],
        "seriesX0": summary["series"]["x0"],
        "a": summary["fit"]["a"],
        "b": summary["fit"]["b"],
        "mape": summary["fit"]["mape"],
        "rk4MaxError": summary["gm"]["rk4MaxError"],
        "forecastLast": summary["gm"]["forecastLast"],
        "cfcX0": summary["cfc"]["x0"],
        "cfcA": summary["cfc"]["A"],
        "cfcF": summary["cfc"]["f"],
        "softplusRaw": summary["cfc"]["softplusRaw"],
        "softplusNaive": summary["cfc"]["softplusNaive"],
        "softplusStable": summary["cfc"]["softplusStable"],
        "logSumExp": summary["cfc"]["logSumExp"],
        "evalsClosed": summary["cfc"]["evalsClosed"],
        "evalsRK4": summary["cfc"]["evalsRK4"],
    },
    "fit": fit,
    "rk4": rk4,
    "cfc": cfc,
    "softplus": softplus,
}

OUT.write_text(json.dumps(doc, ensure_ascii=False, separators=(",", ":")))
print(f"wrote {OUT} ({OUT.stat().st_size} bytes)")
print("a", summary["fit"]["a"], "b", summary["fit"]["b"], "mape", summary["fit"]["mape"])
print("rk4MaxError", summary["gm"]["rk4MaxError"])
print("cfc stable", summary["cfc"]["softplusStable"], "lse", summary["cfc"]["logSumExp"])
