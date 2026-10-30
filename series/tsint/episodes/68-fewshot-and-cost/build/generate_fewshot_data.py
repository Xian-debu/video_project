#!/usr/bin/env python3
"""第 68 集的派生数据：把 ts-base 的采样位置与效率测量折算成画面数字。

输入（全部入库、可逐字节复核）：
  /root/ts-base/data/episodes/68-fewshot-and-cost/summary.json
  /root/ts-base/data/episodes/68-fewshot-and-cost/{series,positions,bench}.csv
  /root/ts-base/inventory/evidence/ch8-fewshot-sampler/*.json
  /root/ts-base/inventory/evidence/ch8-efficiency-bench/*.json

输出：data/fewshot.json（派生文件，不入库；由 film.json 的 derive 重跑）

纪律：屏幕上的每个数字都必须能回到这里的一条断言。任何一项对不上就退出，
不写 JSON。1200 点序列只做采样位置演示；三个 MLP 规模只做成本测量。
"""
from __future__ import annotations

import csv
import hashlib
import json
import os
import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DATA = ROOT / "data"
TS_BASE = Path(os.environ.get("TS_BASE", "/root/ts-base"))
TS_ADMIN = Path(os.environ.get("TS_ADMIN", "/root/ts-admin"))
EP = TS_BASE / "data/episodes/68-fewshot-and-cost"
SUMMARY = EP / "summary.json"
SERIES = EP / "series.csv"
POSITIONS = EP / "positions.csv"
BENCH = EP / "bench.csv"
EV_EPISODE = "68-fewshot-and-cost"

STRATEGY_KEYS = [
    "window-front", "window-back", "window-uniform", "window-random",
    "point-front", "point-back", "point-uniform", "point-random",
]


def die(msg: str) -> None:
    raise SystemExit("FAIL " + msg)


def close(a: float, b: float, eps: float = 1e-9) -> bool:
    return abs(a - b) <= eps


def sha256(path: Path) -> str:
    h = hashlib.sha256()
    with path.open("rb") as fh:
        for chunk in iter(lambda: fh.read(1 << 20), b""):
            h.update(chunk)
    return h.hexdigest()


def git_head(repo: Path) -> str:
    return subprocess.run(
        ["git", "-C", str(repo), "rev-parse", "HEAD"],
        capture_output=True, text=True, check=True).stdout.strip()


def load_evidence(unit: str) -> tuple[dict, Path]:
    d = TS_BASE / "inventory/evidence" / unit
    if not d.is_dir():
        die("missing evidence dir " + str(d))
    files = sorted(p for p in d.glob("*.json"))
    if not files:
        die("no evidence json in " + str(d))
    ev = json.loads(files[-1].read_text(encoding="utf-8"))
    if ev.get("unitId") != unit:
        die("evidence unitId mismatch: " + str(ev.get("unitId")))
    if ev.get("schemaVersion") != 1:
        die("evidence schemaVersion changed: " + str(ev.get("schemaVersion")))
    if ev.get("episode") != EV_EPISODE:
        die("evidence episode changed: " + str(ev.get("episode")))
    if not all(t.get("pass") is True for t in ev.get("tests", [])):
        die("evidence has a failing test")
    if len(ev.get("tests", [])) == 0:
        die("evidence has no tests")
    return ev, files[-1]


def verify_hashes(ev: dict, ev_path: Path, label: str) -> None:
    for key in ("inputs", "artifacts"):
        for item in ev.get(key, []):
            p = TS_BASE / item["path"]
            if not p.exists():
                die(label + " " + key + " missing: " + str(p))
            got = sha256(p)
            if got != item["sha256"]:
                die(label + " " + key + " sha mismatch: " + str(p))
    if not ev_path.exists():
        die("evidence file vanished")


def runs_of(ixs: list[int]) -> int:
    if not ixs:
        return 0
    runs = 1
    for a, b in zip(ixs, ixs[1:]):
        if b != a + 1:
            runs += 1
    return runs


def max_gap(ixs: list[int]) -> int:
    if len(ixs) < 2:
        return 0
    return max(b - a - 1 for a, b in zip(ixs, ixs[1:]))


def main() -> None:
    for p in (SUMMARY, SERIES, POSITIONS, BENCH):
        if not p.exists():
            die("missing " + str(p) + " (run cabal run tsbase -- evidence-ch08-fewshot ...)")
    s = json.loads(SUMMARY.read_text(encoding="utf-8"))
    if s.get("episode") != "68-fewshot-and-cost":
        die("summary is not E68")

    ev_fs, ev_fs_path = load_evidence("ch8-fewshot-sampler")
    ev_eff, ev_eff_path = load_evidence("ch8-efficiency-bench")
    verify_hashes(ev_fs, ev_fs_path, "fewshot")
    verify_hashes(ev_eff, ev_eff_path, "efficiency")

    # ---- 数据与窗口 ----
    rows = list(csv.DictReader(SERIES.open(encoding="utf-8")))
    if len(rows) != 1200:
        die("series.csv rows changed: %d" % len(rows))
    if rows[0]["index"] != "0" or rows[-1]["index"] != "1199":
        die("series.csv index range changed")
    dates = [r["date"] for r in rows]
    closes = [float(r["close"]) for r in rows]
    if dates[0] != "2020-01-02" or dates[-1] != "2024-12-13":
        die("date range changed")
    if s["data"]["rows"] != 1200 or s["data"]["first"] != dates[0] or s["data"]["last"] != dates[-1]:
        die("summary data block disagrees with series.csv")
    csv_path = EP / "sz000001_1200.csv"
    if not csv_path.exists():
        die("source csv missing: " + str(csv_path))
    if sha256(csv_path) != s["data"]["sha256"]:
        die("source csv sha256 changed")

    w = s["window"]
    if (w["total"], w["train"], w["test"], w["window"], w["budget"]) != (1200, 1000, 200, 5, 50):
        die("window shape changed")
    if not close(w["rho"], 0.05, 1e-12) or w["train"] + w["test"] != w["total"]:
        die("rho or window split changed")
    if round(0.05 * w["train"]) != w["budget"]:
        die("budget is not round(rho*n_train)")
    if dates[999] != "2024-02-20" or dates[1000] != "2024-02-21":
        die("train/test boundary changed")

    # ---- 八种采样 ----
    strategies = s["strategies"]
    if [x["key"] for x in strategies] != STRATEGY_KEYS:
        die("strategy order changed")
    if len(strategies) != 8:
        die("strategy count changed")
    if sum(1 for x in strategies if x["legal"]) != 6:
        die("legal strategy count changed")
    by_key = {x["key"]: x for x in strategies}
    for x in strategies:
        ixs = x["indices"]
        if x["count"] != 50 or len(ixs) != 50 or len(set(ixs)) != 50:
            die(x["key"] + ": not 50 unique points")
        if ixs != sorted(ixs):
            die(x["key"] + ": indices not sorted")
        if x["first"] != ixs[0] or x["last"] != ixs[-1]:
            die(x["key"] + ": first/last disagree")
        if x["runs"] != runs_of(ixs) or x["max_gap"] != max_gap(ixs):
            die(x["key"] + ": runs/max_gap disagree")
        if x["span"] != ixs[-1] - ixs[0]:
            die(x["key"] + ": span disagree")
        if ixs[0] < 0 or ixs[-1] >= w["train"]:
            die(x["key"] + ": escaped the training window")

    if by_key["window-front"]["indices"] != list(range(0, 50)):
        die("front window changed")
    if by_key["window-back"]["indices"] != list(range(950, 1000)):
        die("back window changed")
    if by_key["window-uniform"]["indices"] != [
        0, 1, 2, 3, 4, 110, 111, 112, 113, 114, 221, 222, 223, 224, 225,
        331, 332, 333, 334, 335, 442, 443, 444, 445, 446, 552, 553, 554,
        555, 556, 663, 664, 665, 666, 667, 773, 774, 775, 776, 777, 884,
        885, 886, 887, 888, 995, 996, 997, 998, 999]:
        die("uniform windows changed")
    if (by_key["window-random"]["runs"], by_key["window-random"]["max_gap"],
            by_key["window-random"]["span"]) != (10, 168, 890):
        die("random window statistics changed")
    if by_key["point-uniform"]["indices"] != list(range(0, 1000, 20)):
        die("equidistant counterexample changed")
    if (by_key["point-uniform"]["runs"], by_key["point-uniform"]["max_gap"]) != (50, 19):
        die("equidistant counterexample statistics changed")
    if (by_key["point-random"]["runs"], by_key["point-random"]["max_gap"],
            by_key["point-random"]["span"]) != (50, 123, 900):
        die("scatter counterexample statistics changed")

    # positions.csv 是同一批索引的第二个视角：逐行复核
    pos = list(csv.DictReader(POSITIONS.open(encoding="utf-8")))
    if len(pos) != 8 * 50:
        die("positions.csv rows changed: %d" % len(pos))
    for key in STRATEGY_KEYS:
        want = by_key[key]["indices"]
        got = [int(r["index"]) for r in pos if r["strategy"] == key]
        if got != want:
            die("positions.csv disagrees with summary for " + key)

    # ---- 种子与边界 ----
    sc = s["seed_check"]
    if sc.get("same_seed_equal") is not True or sc.get("other_seed_differs") is not True:
        die("seed check changed")
    bd = s["boundary"]
    if (bd["n"], bd["raw_round"], bd["lifted_points"], bd["windows"]) != (10, 0, 1, 1):
        die("boundary case changed")

    # ---- 效率三件套 ----
    eff = s["efficiency"]
    proto = eff["protocol"]
    if (proto["warmup"], proto["reps"], proto["steps"], proto["batch"], proto["n"],
            proto["train"], proto["test"], proto["seed"]) != (3, 7, 200, 16, 600, 480, 120, 42):
        die("efficiency protocol changed")
    if not close(proto["lr"], 0.05, 1e-12):
        die("learning rate changed")
    chk = eff["params_self_check"]
    if chk["params"] != 337 or chk["params_one_input"] != 321:
        die("parameter self-check changed")
    if chk["shape"] != [2, 16, 16, 1] or chk["layout"] != [48, 272, 17]:
        die("parameter layout changed")
    if sum(chk["layout"]) != chk["params"] or chk["params_one_input"] != chk["params"] - 16:
        die("parameter arithmetic does not close")
    scales = eff["scales"]
    if [x["shape"] for x in scales] != [[2, 8, 8, 1], [2, 32, 32, 1], [2, 128, 128, 1]]:
        die("scale shapes changed")
    if [x["params"] for x in scales] != [105, 1185, 17025]:
        die("scale parameter counts changed")
    want = {
        105: (24.734018, 0.095270, 0.000743, 0.002999616677209, 3796008),
        1185: (271.801123, 0.621755, 0.000721, 0.003160689586098, 20700816),
        17025: (7041.041205, 11.321953, 0.001086, 0.01000185208867, 262557872),
    }
    for x in scales:
        tr, inf, lazy, mse, peak = want[x["params"]]
        if not (close(x["train_ms"], tr, 1e-6) and close(x["infer_ms"], inf, 1e-6)
                and close(x["lazy_ms"], lazy, 1e-6) and close(x["mse"], mse, 1e-9)
                and x["peak_live_bytes"] == peak):
            die("bench numbers changed at params=%d" % x["params"])
    bench = list(csv.DictReader(BENCH.open(encoding="utf-8")))
    if len(bench) != 3:
        die("bench.csv rows changed")
    for row, x in zip(bench, scales):
        if [int(row["shape"].split("-")[i]) for i in range(4)] != x["shape"]:
            die("bench.csv shape order changed")
        if int(row["params"]) != x["params"]:
            die("bench.csv params disagree")
        if not close(float(row["train_ms"]), x["train_ms"], 1e-6):
            die("bench.csv train_ms disagree")
        if not close(float(row["mse"]), x["mse"], 1e-9):
            die("bench.csv mse disagree")
    if not (scales[0]["train_ms"] < scales[1]["train_ms"] < scales[2]["train_ms"]):
        die("training time is not increasing")
    if not (scales[0]["infer_ms"] < scales[1]["infer_ms"] < scales[2]["infer_ms"]):
        die("inference time is not increasing")
    if not (scales[0]["peak_live_bytes"] < scales[1]["peak_live_bytes"] < scales[2]["peak_live_bytes"]):
        die("peak memory is not increasing")
    if not (scales[2]["mse"] > scales[0]["mse"] and scales[0]["mse"] < scales[2]["mse"]):
        die("MSE is no longer non-monotone; the boundary beat would be false")

    # ---- 测试与证据 ----
    t = s["tests"]
    if (t["new"], t["fewshot"], t["efficiency"], t["suite_total"]) != (33, 18, 15, 308):
        die("test counts changed")
    c = s["checks"]
    if c.get("all") is not True or (c["fewshot"], c["efficiency"]) != (22, 13):
        die("evidence checks changed")
    if len(ev_fs["tests"]) != 22 or len(ev_eff["tests"]) != 13:
        die("evidence test lists disagree with summary")

    out = {
        "meta": {
            "episode": 68,
            "bookPages": "203–207",
            "tsBaseCommit": ev_fs["tsBaseCommit"].strip(),
            "tsBaseHead": git_head(TS_BASE),
            "tsAdminHead": git_head(TS_ADMIN),
            "evidenceRunAt": ev_fs["runAt"],
            "command": ev_fs["command"],
            "tests": {"new": 33, "fewshot": 18, "efficiency": 15, "suite": 308},
            "checks": {"fewshot": 22, "efficiency": 13, "total": 35},
        },
        "data": {
            "path": "data/episodes/68-fewshot-and-cost/sz000001_1200.csv",
            "code": "000001.SZ",
            "rows": 1200,
            "first": dates[0],
            "last": dates[-1],
            "sha256": s["data"]["sha256"],
            "trainFirst": dates[0],
            "trainLast": dates[999],
            "testFirst": dates[1000],
            "testLast": dates[-1],
        },
        "window": {
            "total": 1200, "train": 1000, "test": 200,
            "rho": 0.05, "window": 5, "budget": 50, "windows": 10,
        },
        "strategies": [
            {
                "key": x["key"],
                "label": x["label"],
                "kind": x["kind"],
                "anchor": x["anchor"],
                "legal": x["legal"],
                "count": x["count"],
                "runs": x["runs"],
                "maxGap": x["max_gap"],
                "span": x["span"],
                "first": x["first"],
                "last": x["last"],
                "firstDate": dates[x["first"]],
                "lastDate": dates[x["last"]],
                "months": len(sorted({dates[i][:7] for i in x["indices"]})),
                "indices": x["indices"],
            }
            for x in strategies
        ],
        "identity": {
            "front": by_key["window-front"]["indices"] == by_key["point-front"]["indices"],
            "back": by_key["window-back"]["indices"] == by_key["point-back"]["indices"],
        },
        "seedCheck": {
            "seed": 42,
            "sameSeedEqual": sc["same_seed_equal"],
            "otherSeedDiffers": sc["other_seed_differs"],
        },
        "boundary": {
            "n": 10, "rho": 0.05, "rawRound": bd["raw_round"],
            "liftedPoints": bd["lifted_points"], "windows": bd["windows"],
        },
        "efficiency": {
            "protocol": {
                "warmup": proto["warmup"], "reps": proto["reps"], "steps": proto["steps"],
                "batch": proto["batch"], "lr": proto["lr"], "n": proto["n"],
                "train": proto["train"], "test": proto["test"], "seed": proto["seed"],
            },
            "selfCheck": {
                "shape": chk["shape"], "layout": chk["layout"],
                "params": chk["params"], "oneInput": chk["params_one_input"],
            },
            "scales": [
                {
                    "shape": x["shape"], "params": x["params"],
                    "trainMs": x["train_ms"], "inferMs": x["infer_ms"],
                    "lazyMs": x["lazy_ms"], "mse": x["mse"],
                    "peakBytes": x["peak_live_bytes"],
                    "peakMb": round(x["peak_live_bytes"] / 1e6, 1),
                }
                for x in scales
            ],
            "ratios": {
                "train": round(scales[2]["train_ms"] / scales[0]["train_ms"], 1),
                "infer": round(scales[2]["infer_ms"] / scales[0]["infer_ms"], 1),
                "params": round(scales[2]["params"] / scales[0]["params"], 1),
                "peak": round(scales[2]["peak_live_bytes"] / scales[0]["peak_live_bytes"], 1),
                "mse": round(scales[2]["mse"] / scales[0]["mse"], 2),
            },
        },
        "series": {"dates": dates, "closes": [round(v, 5) for v in closes]},
        "evidence": {
            "fewshot": {
                "unitId": ev_fs["unitId"],
                "path": "inventory/evidence/ch8-fewshot-sampler/" + ev_fs_path.name,
                "commit": ev_fs["tsBaseCommit"].strip(),
                "runAt": ev_fs["runAt"],
                "checks": len(ev_fs["tests"]),
            },
            "efficiency": {
                "unitId": ev_eff["unitId"],
                "path": "inventory/evidence/ch8-efficiency-bench/" + ev_eff_path.name,
                "commit": ev_eff["tsBaseCommit"].strip(),
                "runAt": ev_eff["runAt"],
                "checks": len(ev_eff["tests"]),
            },
        },
    }
    DATA.mkdir(exist_ok=True)
    (DATA / "fewshot.json").write_text(json.dumps(out, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
    print(
        "wrote data/fewshot.json rows=%d train/test=%d/%d strategies=%d params=%s tests=%d"
        % (len(rows), w["train"], w["test"], len(strategies),
           "/".join(str(x["params"]) for x in scales), t["new"]))


if __name__ == "__main__":
    main()
