#!/usr/bin/env python3
"""第 65 集的派生数据：把 ts-base 的 E65 证据折算成画面要用的数字。

输入（全部入库、可逐字节复核）：
  /root/ts-base/data/episodes/65-error-metrics-trio/summary.json
  /root/ts-base/inventory/evidence/ch8-error-metrics.json

输出：data/metrics.json（派生文件，不入库；由 film.json 的 derive 重跑）

三个算法都不是拟合，只有指标计算；所以这里做解析、排序、断言，不造数。
任何一项对不上，脚本直接退出，不写 JSON。
"""
from __future__ import annotations

import json
import os
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DATA = ROOT / "data"
TS_BASE = Path(os.environ.get("TS_BASE", "/root/ts-base"))
SUMMARY = TS_BASE / "data/episodes/65-error-metrics-trio/summary.json"
EVIDENCE = TS_BASE / "inventory/evidence/ch8-error-metrics.json"

def die(msg: str) -> None:
    raise SystemExit("FAIL " + msg)

def load() -> tuple[dict, dict]:
    if not SUMMARY.exists():
        die("missing " + str(SUMMARY) + " (run cabal run tsbase -- evidence-ch08 ...)")
    if not EVIDENCE.exists():
        die("missing " + str(EVIDENCE))
    return json.loads(SUMMARY.read_text(encoding="utf-8")), json.loads(EVIDENCE.read_text(encoding="utf-8"))

def short(name: str) -> str:
    return name.replace("A", "") if name.endswith("A") else name

def main() -> None:
    s, ev = load()
    if s.get("episode") != 65 or s.get("slug") != "error-metrics-trio":
        die("summary is not E65")

    levels = s["levels"]
    if len(levels) != 20:
        die(f"expected 20 levels, got {len(levels)}")
    if len({x["code"] for x in levels}) != 20:
        die("duplicate codes")

    a, b = s["example"]["a"], s["example"]["b"]
    if not (a == {"mse": 1.0, "rmse": 1.0, "mae": 1.0} and b == {"mse": 4.0, "rmse": 2.0, "mae": 1.0}):
        die("example vectors changed")
    if not (abs(a["mse"] - 1.0) < 1e-12 and abs(b["mse"] - 4.0) < 1e-12 and abs(a["mae"] - b["mae"]) < 1e-12):
        die("example identity broken")

    mase = s["mase"]
    if mase["belowOne"] != sum(1 for x in levels if x["mase5"] < 1.0):
        die("belowOne does not match levels")
    if not (mase["min"] <= mase["median"] <= mase["max"]):
        die("mase order broken")
    by_code = {x["code"]: x for x in levels}
    if mase["minCode"] not in by_code or mase["maxCode"] not in by_code:
        die("mase code missing")

    # 排序必须能从同一组数重算出来，不依赖 JSON 里 rank 字段的正确性。
    for key, rank in (("mae", "rankMae"), ("rmse", "rankRmse"), ("mapePct", "rankMape"), ("mase5", "rankMase")):
        order = sorted(levels, key=lambda x: x[key])
        for i, x in enumerate(order, 1):
            if x[rank] != i:
                die(f"{x['code']} {rank} is {x[rank]}, recomputed {i}")
    if [x["code"] for x in sorted(levels, key=lambda x: x["mae"])[:3]] != s["disagreement"]["topMae"]:
        die("topMae changed")
    if [x["code"] for x in sorted(levels, key=lambda x: x["mapePct"])[:3]] != s["disagreement"]["topMape"]:
        die("topMape changed")

    cj = by_code["sh600900"]
    mt = by_code["sh600519"]
    if (cj["rankMae"], cj["rankMape"]) != (6, 1):
        die("长江电力 rank divergence changed")
    if (mt["rankMae"], mt["rankMape"]) != (20, 4):
        die("贵州茅台 rank divergence changed")

    returns = s["returns"]
    if len(returns) != 5 or any(r["n"] != 483 for r in returns):
        die("returns length changed")
    if any(r["negative"] + r["zero"] != r["mapeSkipped"] for r in returns):
        die("returns skip accounting changed")
    if any(r["mapeValid"] + r["mapeSkipped"] != r["n"] for r in returns):
        die("returns total accounting changed")
    if not all(140.0 < r["smapePct"] < 160.0 for r in returns):
        die("sMAPE range changed")

    checks = ev.get("tests", [])
    if not checks or not all(c.get("pass") is True for c in checks):
        die("evidence checks missing or failing")
    test_total = 37  # cabal test: 13 ErrorMetrics + 14 PercentageErrors + 10 Mase

    values = sorted(({"code": x["code"], "name": short(x["name"]), "mase5": x["mase5"]} for x in levels), key=lambda x: x["mase5"])
    out = {
        "meta": {
            "episode": 65,
            "bookPages": "205–206",
            "dataWindow": "2020-01-01..2025-12-31",
            "stocks": len(levels),
            "rows": 28949,
            "train": s["data"]["train"],
            "test": s["data"]["test"],
            "forecast": s["data"]["forecast"],
            "season": s["data"]["season"],
            "tests": test_total,
            "tsBaseCommit": ev.get("tsBaseCommit", ""),
            "source": "/root/ts-base/data/episodes/65-error-metrics-trio/summary.json",
            "command": "cabal run tsbase -- evidence-ch08 --data data/episodes/65-error-metrics-trio/closes_2020_2025.csv --out data/episodes/65-error-metrics-trio --evidence inventory/evidence",
        },
        "example": {"a": a, "b": b},
        "levels": [
            {
                "code": x["code"],
                "name": short(x["name"]),
                "mae": x["mae"],
                "rmse": x["rmse"],
                "mapePct": x["mapePct"],
                "mase5": x["mase5"],
                "rankMae": x["rankMae"],
                "rankRmse": x["rankRmse"],
                "rankMape": x["rankMape"],
                "rankMase": x["rankMase"],
            }
            for x in sorted(levels, key=lambda x: x["rankMae"])
        ],
        "mase": {
            "median": mase["median"],
            "belowOne": mase["belowOne"],
            "min": mase["min"],
            "minName": short(by_code[mase["minCode"]]["name"]),
            "max": mase["max"],
            "maxName": short(by_code[mase["maxCode"]]["name"]),
            "values": values,
        },
        "divergence": {
            "changjiang": {"name": "长江电力", "mae": cj["mae"], "mapePct": cj["mapePct"], "rankMae": cj["rankMae"], "rankMape": cj["rankMape"]},
            "maotai": {"name": "贵州茅台", "mae": mt["mae"], "mapePct": mt["mapePct"], "rankMae": mt["rankMae"], "rankMape": mt["rankMape"]},
        },
        "returns": [
            {
                "code": r["code"], "name": short(r["name"]), "n": r["n"],
                "negative": r["negative"], "zero": r["zero"], "valid": r["mapeValid"], "skipped": r["mapeSkipped"],
                "mapePct": r["mapePct"], "smapePct": r["smapePct"], "mpePct": r["mpePct"],
            }
            for r in returns
        ],
        "checks": s["checks"],
    }
    text = json.dumps(out, ensure_ascii=False, separators=(",", ":")) + "\n"
    (DATA / "metrics.json").write_text(text, encoding="utf-8")
    print(
        "wrote data/metrics.json %d bytes; stocks=%d minMase=%s %.7f median=%.10f belowOne=%d tests=%d"
        % (len(text), len(levels), out["mase"]["minName"], out["mase"]["min"], out["mase"]["median"], out["mase"]["belowOne"], test_total)
    )

if __name__ == "__main__":
    main()
