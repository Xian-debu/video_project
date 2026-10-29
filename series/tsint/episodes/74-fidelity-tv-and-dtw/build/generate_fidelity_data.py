#!/usr/bin/env python3
"""Build data/fidelity.json for episode 74 from ts-base evidence.

Every number on screen must come from the same evidence run. The episode has
two independent claims: TV regularization trades smoothness against clean
error, and DTW ignores a pure phase shift but is not a metric. The assertions
below fail the build if either story stops being true.
"""
from __future__ import annotations

import csv
import hashlib
import json
from pathlib import Path

HERE = Path(__file__).resolve().parent
PACK = HERE.parent
EV = PACK / "data" / "evidence"
OUT = PACK / "data" / "fidelity.json"

TS_BASE_COMMIT = "a32c1e0"


def rows(name):
    with (EV / name).open(newline="") as f:
        return list(csv.DictReader(f))


def num(row, key):
    return float(row[key])


def sha(name):
    return hashlib.sha256((EV / name).read_bytes()).hexdigest()


evidence_name = "ch9-fidelity-20261029T165851.json"
summary = json.loads((EV / "summary.json").read_text())
evidence = json.loads((EV / evidence_name).read_text())
tv_rows = rows("tv_curve.csv")
path_rows = rows("dtw_path.csv")
shift_rows = rows("dtw_shift.csv")
banded_rows = rows("dtw_banded.csv")

# ---------- assertions: the story must still be true ----------
assert summary["episode"] == 74
assert evidence["episode"] == "74-fidelity-tv-and-dtw"
assert summary["tests"] == 142

tv = summary["tv"]
assert len(tv_rows) == 8
assert abs(tv["lambdaZero"]["tv"] - 94.98208830918223) < 1e-12
assert abs(tv["lambdaZero"]["cleanMse"] - 0.16) < 1e-12
assert abs(tv["best"]["lambda"] - 0.005) < 1e-15
assert abs(tv["best"]["tv"] - 13.990103373965104) < 1e-12
assert abs(tv["best"]["cleanMse"] - 0.007065947199407385) < 1e-15
assert tv["best"]["cleanMse"] < 0.02 < tv["lambdaZero"]["cleanMse"]
assert abs(tv["over"]["lambda"] - 0.05) < 1e-15
assert abs(tv["over"]["tv"] - 4.54157213780954) < 1e-12
assert tv["over"]["cleanMse"] > 0.17
assert tv["over"]["cleanMse"] > tv["lambdaZero"]["cleanMse"]

dtw = summary["dtw"]
assert dtw["golden"]["cost"] == 1.0
assert [tuple(p) for p in dtw["golden"]["path"]] == [(0, 0), (1, 0), (2, 1)]
assert abs(dtw["shift"]["mse"] - 15.80952380952381) < 1e-12
assert dtw["shift"]["cost"] == 0.0
assert dtw["shift"]["pathLength"] == 33
assert abs(dtw["triangle"]["xz"] - 6.0) < 1e-15
assert abs(dtw["triangle"]["sum"] - 2.0) < 1e-15
assert dtw["triangle"]["violation"] > 0
assert abs(dtw["banded"]["cost"] - dtw["banded"]["fullCost"]) < 1e-9
assert dtw["banded"]["n"] == 500 and dtw["banded"]["w"] == 20
assert len(shift_rows) == 21 and len(path_rows) == 33

curve = [
    {
        "lambda": num(r, "lambda"),
        "tv": num(r, "tv"),
        "trainMse": num(r, "train_mse"),
        "cleanMse": num(r, "clean_mse"),
    }
    for r in tv_rows
]
path = [{"k": int(num(r, "k")), "i": int(num(r, "i")), "j": int(num(r, "j"))} for r in path_rows]
shift = [{"t": int(num(r, "i")), "x": num(r, "x"), "y": num(r, "y")} for i, r in enumerate(shift_rows)]

doc = {
    "meta": {
        "episode": 74,
        "title": "fidelity-tv-and-dtw",
        "bookPage": 219,
        "tsBaseCommit": TS_BASE_COMMIT,
        "evidenceRunAt": summary.get("runAt", "2026-10-29T16:58:51+0000"),
        "evidenceSha": sha(evidence_name),
        "tests": summary["tests"],
    },
    "key": {
        "n": tv["n"],
        "noise": tv["noise"],
        "lambdaZero": {
            "lambda": 0.0,
            "tv": tv["lambdaZero"]["tv"],
            "trainMse": 0.0,
            "cleanMse": tv["lambdaZero"]["cleanMse"],
            "tvRatio": 1.0,
        },
        "best": tv["best"],
        "over": {
            **tv["over"],
            "tvRatio": tv["over"]["tv"] / tv["best"]["tv"],
        },
        "golden": dtw["golden"],
        "shift": dtw["shift"],
        "triangle": dtw["triangle"],
        "banded": dtw["banded"],
    },
    "tvCurve": curve,
    "dtwPath": path,
    "shift": shift,
    "claims": {"tvOde": "C", "dtw": "C"},
}

OUT.write_text(json.dumps(doc, ensure_ascii=False, separators=(",", ":")))
print(f"wrote {OUT} ({OUT.stat().st_size} bytes)")
print("tv best", tv["best"]["lambda"], tv["best"]["tv"], tv["best"]["cleanMse"])
print("over", tv["over"]["cleanMse"], "shift", dtw["shift"]["mse"], dtw["shift"]["cost"], dtw["shift"]["pathLength"])
print("triangle", dtw["triangle"]["xz"], dtw["triangle"]["sum"], "banded ms", dtw["banded"]["ms"])