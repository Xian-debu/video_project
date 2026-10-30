#!/usr/bin/env python3
"""第 67 集的派生数据：把 ts-base 的切分证据折算成画面要用的数字。

输入（全部入库、可逐字节复核）：
  /root/ts-base/data/episodes/67-split-no-leakage/summary.json
  /root/ts-base/data/episodes/67-split-no-leakage/panel_counts.csv
  /root/ts-base/inventory/evidence/ch8-split.json

输出：data/split.json（派生文件，不入库；由 film.json 的 derive 重跑）

这一集不训练预测模型：固定预测用朴素头与线性趋势头，滚动预测逐轮重拟合
朴素头。脚本只做解析、汇总、断言；任何一项对不上就退出，不写 JSON。
"""
from __future__ import annotations

import csv
import json
import os
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DATA = ROOT / "data"
TS_BASE = Path(os.environ.get("TS_BASE", "/root/ts-base"))
EP = TS_BASE / "data/episodes/67-split-no-leakage"
SUMMARY = EP / "summary.json"
PANEL = EP / "panel_counts.csv"
EVIDENCE = TS_BASE / "inventory/evidence/ch8-split.json"


def die(msg: str) -> None:
    raise SystemExit("FAIL " + msg)


def close(a: float, b: float, eps: float = 1e-9) -> bool:
    return abs(a - b) <= eps


def load() -> tuple[dict, dict, list[dict]]:
    for p in (SUMMARY, PANEL, EVIDENCE):
        if not p.exists():
            die("missing " + str(p) + " (run cabal run tsbase -- evidence-ch08-split ...)")
    with PANEL.open(encoding="utf-8") as fh:
        panel = list(csv.DictReader(fh))
    return (
        json.loads(SUMMARY.read_text(encoding="utf-8")),
        json.loads(EVIDENCE.read_text(encoding="utf-8")),
        panel,
    )


def chronological(n: int, a: float, b: float) -> tuple[int, int, int]:
    tr = int(n * a + 1e-9)
    va = int(n * b + 1e-9)
    return tr, va, n - tr - va


def main() -> None:
    s, ev, panel = load()
    if s.get("episode") != 67 or s.get("slug") != "split-no-leakage":
        die("summary is not E67")
    metrics = ev["metrics"]
    for key in (
        "split_train", "split_val", "split_test", "chrono_leaks", "shuffle_leaks",
        "future_test_points", "leak_probe_chrono_mse", "leak_probe_shuffle_mse",
        "leak_probe_ratio", "fixed_naive_gap", "fixed_linear_gap",
        "rolling_rounds", "rolling_mean_mse", "panel_distinct_boundaries", "tests",
    ):
        if key not in metrics:
            die("evidence metric missing: " + key)
    if metrics["tests"]["value"] != 50 or s["tests"]["new"] != 50:
        die("evidence test count changed")
    if metrics["split_train"]["value"] != s["split"]["train"]:
        die("evidence train count disagrees with summary")
    if metrics["chrono_leaks"]["value"] != s["split"]["chrono_leaks"]:
        die("evidence chrono leaks disagree")
    if metrics["shuffle_leaks"]["value"] != s["split"]["shuffle"]["leaks"]:
        die("evidence shuffle leaks disagree")

    data = s["data"]
    if data["rows_raw"] != 2674 or data["rows"] != 2600:
        die("row counts changed")
    if data["first"] != "2015-01-05" or data["last"] != "2025-09-10":
        die("date range changed")
    if data["panel_symbols"] != 20 or data["panel_rows"] != 49277 or data["panel_dates"] != 2600:
        die("panel shape changed")

    sp = s["split"]
    if (sp["train"], sp["val"], sp["test"]) != (1820, 260, 520):
        die("7:1:2 split changed")
    if sp["train"] + sp["val"] + sp["test"] != sp["n"]:
        die("split does not cover the series")
    if sp["n"] != data["rows"]:
        die("split n is not used rows")
    if sp["train_end"] != "2022-06-28" or sp["val_start"] != "2022-06-29":
        die("train/val boundary changed")
    if sp["test_start"] != "2023-07-24" or sp["last"] != "2025-09-10":
        die("test boundary changed")
    if sp["chrono_leaks"] != 0:
        die("chronological split now leaks; narrative gone")
    sh = sp["shuffle"]
    if sh["seed"] != 42 or sh["leaks"] < 1:
        die("shuffle control changed")
    if sh["leaks"] != 2 or sh["leak_kinds"] != ["order/train-val", "order/val-test"]:
        die("shuffle leak kinds changed")
    if sh["future_test_points"] != 519:
        die("shuffle future-point count changed")
    probe = sp["leak_probe"]
    if not close(probe["ratio"], 170.249986637171, 1e-9):
        die("leak probe ratio changed")
    if probe["ratio"] <= 10:
        die("leak probe is no longer an order of magnitude")
    if not close(probe["chrono_mse"], 5.062234230353, 1e-9):
        die("chrono probe MSE changed")
    if not close(probe["shuffle_mse"], 0.029734124098, 1e-9):
        die("shuffle probe MSE changed")

    fx = s["fixed"]
    if (fx["f"], fx["train_n"], fx["test_n"]) != (20, 2580, 20):
        die("fixed protocol shape changed")
    if fx["test_start"] != "2025-08-14" or fx["test_end"] != "2025-09-10":
        die("fixed test window changed")
    naive, linear = fx["naive"], fx["linear"]
    if not close(naive["gap"], naive["test_mse"] - naive["train_mse"], 1e-12):
        die("naive gap is not test-train")
    if not close(linear["gap"], linear["test_mse"] - linear["train_mse"], 1e-12):
        die("linear gap is not test-train")
    if not (linear["train_mse"] > linear["test_mse"] > 0):
        die("linear head no longer shows the negative gap")
    if not (naive["test_mse"] > naive["train_mse"]):
        die("naive head no longer shows the positive gap")

    ro = s["rolling"]
    want_rounds = (ro["n"] - ro["f"] - ro["n_init"]) // ro["step"] + 1 if "n" in ro else None
    if ro["rounds"] != 70:
        die("rolling round count changed")
    if len(ro["errors"]) != 70:
        die("rolling error series changed")
    if ro["last_train_end"] != 2580 or ro["last_test_end"] != 2599:
        die("rolling last window changed")
    if not close(ro["mean"], sum(ro["errors"]) / len(ro["errors"]), 1e-9):
        die("rolling mean is not the arithmetic mean")
    if not (ro["min"] <= ro["mean"] <= ro["max"]):
        die("rolling mean outside min/max")
    if min(ro["errors"]) < 0:
        die("negative MSE")

    pn = s["panel"]
    if pn["symbols"] != 20 or len(panel) != 20:
        die("panel symbol count changed")
    if pn["shared_train_end"] != sp["train_end"] or pn["shared_test_start"] != sp["test_start"]:
        die("panel shared boundary changed")
    if pn["distinct_train_end_dates"] != 13 or pn["symbols_differing_from_shared"] != 13:
        die("panel boundary variety changed")
    if pn["min_train_end"] != "2022-06-28" or pn["max_train_end"] != "2024-02-20":
        die("panel train-end range changed")
    if (pn["train_rows_min"], pn["train_rows_max"]) != (473, 1820):
        die("panel train row range changed")
    if (pn["test_rows_min"], pn["test_rows_max"]) != (514, 520):
        die("panel test row range changed")
    if pn["date_violations"] != 0:
        die("panel split has date violations")
    if sum(1 for x in panel if x["matches_shared"] == "no") != 13:
        die("panel matches_shared does not match the evidence")
    if max(x["train_end_date"] for x in panel) != "2024-02-20":
        die("panel max train-end date changed")

    n_train, n_val, n_test = chronological(10, 0.7, 0.1)
    if (n_train, n_val, n_test) != (7, 1, 2):
        die("n=10 split changed")
    if (n_train, n_val, n_test) != (sp["train"], sp["val"], sp["test"]):
        pass
    rounds100 = (100 - 5 - 60) // 5 + 1
    last_train100 = 60 + (rounds100 - 1) * 5
    if rounds100 != 8 or last_train100 != 95:
        die("n=100 rolling example changed")

    out = {
        "meta": {
            "episode": 67,
            "bookPages": "199–204",
            "tests": 50,
            "symbols": 20,
            "rowsRaw": data["rows_raw"],
            "rows": data["rows"],
            "first": data["first"],
            "last": data["last"],
            "panelRows": data["panel_rows"],
            "tsBaseCommit": ev["tsBaseCommit"].strip(),
            "command": ev["command"],
            "predictor": probe["predictor"],
        },
        "split": {
            "n": sp["n"],
            "train": sp["train"],
            "val": sp["val"],
            "test": sp["test"],
            "trainEnd": sp["train_end"],
            "valStart": sp["val_start"],
            "testStart": sp["test_start"],
            "last": sp["last"],
            "chronoLeaks": sp["chrono_leaks"],
            "shuffle": {
                "seed": sh["seed"],
                "train": sh["train"],
                "val": sh["val"],
                "test": sh["test"],
                "leaks": sh["leaks"],
                "leakKinds": sh["leak_kinds"],
                "futureTestPoints": sh["future_test_points"],
            },
            "leakProbe": {
                "chronoMse": probe["chrono_mse"],
                "shuffleMse": probe["shuffle_mse"],
                "ratio": probe["ratio"],
            },
        },
        "fixed": {
            "f": fx["f"],
            "trainN": fx["train_n"],
            "testN": fx["test_n"],
            "testStart": fx["test_start"],
            "testEnd": fx["test_end"],
            "naive": naive,
            "linear": linear,
        },
        "rolling": {
            "f": ro["f"],
            "nInit": ro["n_init"],
            "step": ro["step"],
            "rounds": ro["rounds"],
            "mean": ro["mean"],
            "min": ro["min"],
            "max": ro["max"],
            "lastTrainEnd": ro["last_train_end"],
            "lastTestEnd": ro["last_test_end"],
            "errors": ro["errors"],
        },
        "panel": {
            "symbols": pn["symbols"],
            "sharedTrainEnd": pn["shared_train_end"],
            "sharedTestStart": pn["shared_test_start"],
            "distinctTrainEndDates": pn["distinct_train_end_dates"],
            "symbolsDifferingFromShared": pn["symbols_differing_from_shared"],
            "minTrainEnd": pn["min_train_end"],
            "maxTrainEnd": pn["max_train_end"],
            "trainRowsMin": pn["train_rows_min"],
            "trainRowsMax": pn["train_rows_max"],
            "testRowsMin": pn["test_rows_min"],
            "testRowsMax": pn["test_rows_max"],
            "dateViolations": pn["date_violations"],
            "rows": [
                {
                    "code": x["code"],
                    "name": x["name"],
                    "n": int(x["n"]),
                    "trainEnd": x["train_end_date"],
                    "trainRows": int(x["train_rows"]),
                    "testRows": int(x["test_rows"]),
                    "matchesShared": x["matches_shared"] == "yes",
                }
                for x in panel
            ],
        },
        "examples": {
            "n10": {
                "n": 10,
                "train": 7,
                "val": 1,
                "test": 2,
                "trainIdx": list(range(0, n_train)),
                "valIdx": [n_train],
                "testIdx": list(range(n_train + n_val, 10)),
            },
            "n100": {
                "n": 100,
                "f": 5,
                "nInit": 60,
                "s": 5,
                "rounds": rounds100,
                "lastTrainEnd": last_train100,
            },
        },
        "evidence": {
            "path": "inventory/evidence/ch8-split.json",
            "metrics": {k: v["value"] for k, v in ev["metrics"].items()},
            "checks": {c["name"]: c["pass"] for c in ev["tests"]},
            "tests": ev["metrics"]["tests"]["value"],
        },
    }
    DATA.mkdir(exist_ok=True)
    (DATA / "split.json").write_text(json.dumps(out, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
    print(
        "wrote data/split.json split=%d/%d/%d leaks=%d/%d ratio=%.2f rounds=%d tests=%d"
        % (sp["train"], sp["val"], sp["test"], sp["chrono_leaks"], sh["leaks"], probe["ratio"], ro["rounds"], 50)
    )


if __name__ == "__main__":
    main()
