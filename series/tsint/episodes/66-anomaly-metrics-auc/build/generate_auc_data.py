#!/usr/bin/env python3
"""第 66 集的派生数据：把 ts-base 的 E66 证据折算成画面要用的数字。

输入（全部入库、可逐字节复核）：
  /root/ts-base/data/episodes/66-anomaly-metrics-auc/summary.json
  /root/ts-base/inventory/evidence/ch8-anomaly-metrics.json

输出：data/auc.json（派生文件，不入库；由 film.json 的 derive 重跑）

这一集没有拟合模型：标签、分数、阈值全部写死；脚本只做解析、排序、
断言。任何一项对不上，脚本退出，不写 JSON。
"""
from __future__ import annotations

import json
import os
import statistics
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DATA = ROOT / "data"
TS_BASE = Path(os.environ.get("TS_BASE", "/root/ts-base"))
SUMMARY = TS_BASE / "data/episodes/66-anomaly-metrics-auc/summary.json"
EVIDENCE = TS_BASE / "inventory/evidence/ch8-anomaly-metrics.json"

def die(msg: str) -> None:
    raise SystemExit("FAIL " + msg)

def load() -> tuple[dict, dict]:
    if not SUMMARY.exists():
        die("missing " + str(SUMMARY) + " (run cabal run tsbase -- evidence-ch08-auc ...)")
    if not EVIDENCE.exists():
        die("missing " + str(EVIDENCE))
    return json.loads(SUMMARY.read_text(encoding="utf-8")), json.loads(EVIDENCE.read_text(encoding="utf-8"))

def close(a: float, b: float, eps: float = 1e-9) -> bool:
    return abs(a - b) <= eps

def main() -> None:
    s, ev = load()
    if s.get("episode") != 66 or s.get("slug") != "anomaly-metrics-auc":
        die("summary is not E66")
    metrics = ev["metrics"]
    for key in ("synthetic_accuracy", "synthetic_auc", "synthetic_ap", "pooled_auc", "pooled_ap"):
        if key not in metrics:
            die("evidence metric missing: " + key)
    if not close(metrics["pooled_auc"]["value"], s["pooled"]["auc"], 1e-12):
        die("evidence AUC disagrees with summary")
    if not close(metrics["pooled_ap"]["value"], s["pooled"]["ap"], 1e-12):
        die("evidence AP disagrees with summary")
    if metrics["tests"]["value"] != 46:
        die("evidence test count changed")

    syn = s["synthetic"]
    if syn["n"] != 100 or syn["positives"] != 1:
        die("synthetic sample changed")
    if syn["confusion"] != {"tp": 0, "fp": 0, "fn": 1, "tn": 99}:
        die("synthetic confusion changed")
    if not (close(syn["accuracy"], 0.99) and close(syn["auc"], 0.5) and close(syn["ap"], 0.01)):
        die("synthetic metrics changed")
    if syn["precision"] is not None or syn["recall"] != 0.0 or syn["f1"] != 0.0:
        die("synthetic P/R changed")

    golden = s["golden"]
    if not (close(golden["auc"], 0.75, 1e-12) and close(golden["ap"], 0.5, 1e-12)):
        die("golden AUC/AP changed")
    if not close(golden["precision"], 2 / 3, 1e-12) or not close(golden["recall"], 2 / 3, 1e-12):
        die("golden P/R changed")

    pooled = s["pooled"]
    n, pos = pooled["n"], pooled["positives"]
    if n != 23829 or pos != 2217:
        die("pooled sample changed")
    if pooled["negatives"] != n - pos:
        die("negative count broken")
    if not close(pooled["prevalence"], pos / n, 1e-15):
        die("prevalence not derived from counts")
    if not close(pooled["auc"], 0.5408429478903407, 1e-12):
        die("pooled AUC changed")
    if not close(pooled["ap"], 0.11209042040182658, 1e-12):
        die("pooled AP changed")

    all_normal = pooled["allNormal"]
    if all_normal["tp"] != 0 or all_normal["fp"] != 0:
        die("all-normal is not all-normal")
    if all_normal["fn"] != pos or all_normal["tn"] != n - pos:
        die("all-normal confusion broken")
    if not close(all_normal["accuracy"], 1 - pos / n, 1e-12):
        die("all-normal accuracy broken")

    thresholds = pooled["thresholds"]
    if [round(t["threshold"], 2) for t in thresholds] != [1.0, 1.5, 2.0]:
        die("threshold list changed")
    for t in thresholds:
        if t["tp"] + t["fp"] + t["fn"] + t["tn"] != n:
            die("threshold confusion does not sum to n")
        if t["tp"] + t["fn"] != pos:
            die("threshold positives broken")
    if not all(t["accuracy"] < all_normal["accuracy"] for t in thresholds):
        die("a threshold beat all-normal accuracy; narrative gone")
    z1 = thresholds[0]
    if not (close(z1["precision"], 0.13175978488198387, 1e-12) and close(z1["recall"], 0.19891745602165087, 1e-12)):
        die("z>=1 metrics changed")

    curves = pooled["curves"]
    roc, pr = curves["roc"], curves["pr"]
    if len(roc) != 243 or len(pr) != 243:
        die("curve point count changed")
    if roc[0] != [0.0, 0.0] or roc[-1] != [1.0, 1.0]:
        die("ROC endpoints changed")
    if pr[0] != [0.0, 1.0] or not close(pr[-1][0], 1.0) or not close(pr[-1][1], pos / n, 1e-12):
        die("PR endpoints changed")
    for a, b in zip(roc, roc[1:]):
        if a[0] > b[0] + 1e-15 or a[1] > b[1] + 1e-15:
            die("ROC not monotone")
    for a, b in zip(pr, pr[1:]):
        if a[0] > b[0] + 1e-15:
            die("PR recall not monotone")

    stocks = s["stocks"]
    if len(stocks) != 20 or len({x["code"] for x in stocks}) != 20:
        die("stock list changed")
    if sum(x["n"] for x in stocks) != n or sum(x["positives"] for x in stocks) != pos:
        die("per-stock counts do not sum to pooled")
    for x in stocks:
        if not (0.0 < x["auc"] < 1.0):
            die("AUC out of range for " + x["code"])
        if not (0.0 <= x["ap"] <= 1.0):
            die("AP out of range for " + x["code"])

    ordered = sorted(stocks, key=lambda x: -x["auc"])
    rank_auc = {x["code"]: i + 1 for i, x in enumerate(ordered)}
    rank_ap = {x["code"]: i + 1 for i, x in enumerate(sorted(stocks, key=lambda x: -x["ap"]))}
    levels = [
        {
            "code": x["code"],
            "name": x["name"],
            "n": x["n"],
            "positives": x["positives"],
            "prevalence": x["prevalence"],
            "auc": x["auc"],
            "ap": x["ap"],
            "rankAuc": rank_auc[x["code"]],
            "rankAp": rank_ap[x["code"]],
        }
        for x in ordered
    ]
    above_half = sum(1 for x in stocks if x["auc"] > 0.5)
    if above_half != 15:
        die("above-half count changed")
    median_auc = statistics.median(x["auc"] for x in stocks)
    auc_max = max(stocks, key=lambda x: x["auc"])
    auc_min = min(stocks, key=lambda x: x["auc"])
    ap_max = max(stocks, key=lambda x: x["ap"])
    ap_min = min(stocks, key=lambda x: x["ap"])
    if auc_max["name"] != "工商银行" or auc_min["name"] != "中国中免":
        die("AUC extremes changed")
    if ap_max["name"] != "海康威视" or ap_min["name"] != "长江电力":
        die("AP extremes changed")

    out = {
        "meta": {
            "episode": 66,
            "bookPages": "205–206",
            "tests": 46,
            "stocks": len(stocks),
            "rows": s["data"]["rows"],
            "pairs": n,
            "positives": pos,
            "tsBaseCommit": ev["tsBaseCommit"],
            "label": s["data"]["label"],
            "score": s["data"]["score"],
            "command": str(SUMMARY.parent.name),
        },
        "synthetic": {
            "n": syn["n"],
            "positives": syn["positives"],
            "confusion": syn["confusion"],
            "accuracy": syn["accuracy"],
            "precision": syn["precision"],
            "recall": syn["recall"],
            "f1": syn["f1"],
            "auc": syn["auc"],
            "ap": syn["ap"],
        },
        "golden": {"auc": golden["auc"], "ap": golden["ap"], "precision": golden["precision"], "recall": golden["recall"]},
        "pooled": {
            "n": n,
            "positives": pos,
            "negatives": pooled["negatives"],
            "prevalence": pooled["prevalence"],
            "auc": pooled["auc"],
            "ap": pooled["ap"],
            "apOverPrevalence": pooled["apOverPrevalence"],
            "allNormal": all_normal,
            "thresholds": thresholds,
            "curves": curves,
        },
        "levels": levels,
        "extremes": {
            "aboveHalf": above_half,
            "medianAuc": median_auc,
            "aucMax": {"name": auc_max["name"], "code": auc_max["code"], "value": auc_max["auc"]},
            "aucMin": {"name": auc_min["name"], "code": auc_min["code"], "value": auc_min["auc"]},
            "apMax": {"name": ap_max["name"], "code": ap_max["code"], "value": ap_max["ap"]},
            "apMin": {"name": ap_min["name"], "code": ap_min["code"], "value": ap_min["ap"]},
        },
        "evidence": {
            "path": "inventory/evidence/ch8-anomaly-metrics.json",
            "metrics": {k: v["value"] for k, v in ev["metrics"].items()},
            "checks": {c["name"]: c["pass"] for c in ev["tests"]},
            "tests": ev["metrics"]["tests"]["value"],
        },
    }
    DATA.mkdir(exist_ok=True)
    (DATA / "auc.json").write_text(json.dumps(out, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
    print(f"wrote data/auc.json stocks={len(stocks)} pairs={n} positives={pos} tests={ev['tests']}")

if __name__ == "__main__":
    main()
