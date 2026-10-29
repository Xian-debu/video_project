#!/usr/bin/env python3
"""Build data/backprop.json for episode 72 from ts-base evidence.

Every number shown on screen comes from here; assertions fail the build if the
evidence stops matching the story (closed form vs direct vs adjoint vs FD).
"""
from __future__ import annotations

import csv
import hashlib
import json
import math
from pathlib import Path

HERE = Path(__file__).resolve().parent
PACK = HERE.parent
EV = PACK / "data" / "evidence"
OUT = PACK / "data" / "backprop.json"

TS_BASE_COMMIT = "908f333"


def rows(name):
    with (EV / name).open(newline="") as f:
        return list(csv.DictReader(f))


def num(row, key):
    return float(row[key])


def sha(name):
    return hashlib.sha256((EV / name).read_bytes()).hexdigest()


summary = json.loads((EV / "summary.json").read_text())
forward = [{"n": int(num(r, "n")), "t": num(r, "t"), "x": num(r, "x"), "a": num(r, "a")} for r in rows("backprop_forward.csv")]
gradients = [{"method": r["method"], "value": float(r["value"])} for r in rows("backprop_gradients.csv")]
slots = [{"T": int(num(r, "T")), "mode": "direct" if int(num(r, "mode")) == 0 else "adjoint", "slots": int(num(r, "slots"))} for r in rows("backprop_slots.csv")]
memory = [{"T": int(num(r, "T")), "mode": "direct" if int(num(r, "mode")) == 0 else "adjoint", "bytes": int(num(r, "bytes"))} for r in rows("backprop_memory.csv")]

# ---------- assertions: the story must still be true ----------
assert len(forward) == 201, len(forward)
assert forward[0]["n"] == 0 and forward[-1]["n"] == 200
assert abs(forward[-1]["x"] - summary["xT"]) < 1e-12, (forward[-1]["x"], summary["xT"])
assert abs(summary["grad_direct"] - summary["grad_closed"]) / abs(summary["grad_closed"]) < 1e-12
assert summary["grad_adjoint"] == summary["grad_direct"]
assert abs(summary["grad_wrong_sign"] + summary["grad_direct"]) < 1e-12
assert abs(summary["rel_finite_diff"]) < 1e-8
assert abs(summary["rel_rk4"]) < 1e-12
assert abs(summary["rel_cont"]) < 1e-12

mem = {(m["T"], m["mode"]): m["bytes"] for m in memory}
assert mem[(200_000, "direct")] == summary["mem_direct_200k"]
assert mem[(2_000_000, "direct")] == summary["mem_direct_2m"]
assert mem[(200_000, "adjoint")] == summary["mem_adjoint_200k"]
assert mem[(2_000_000, "adjoint")] == summary["mem_adjoint_2m"]
assert abs(mem[(2_000_000, "direct")] / mem[(200_000, "direct")] - summary["mem_direct_ratio"]) < 1e-12
assert abs(mem[(2_000_000, "adjoint")] / mem[(200_000, "adjoint")] - summary["mem_adjoint_ratio"]) < 1e-12
assert summary["mem_direct_ratio"] > 10 and summary["mem_adjoint_ratio"] < 1

sl = {(s["T"], s["mode"]): s["slots"] for s in slots}
assert sl[(200, "direct")] == 201 and sl[(20, "direct")] == 21
assert sl[(200, "adjoint")] == 11 and sl[(20, "adjoint")] == 2

# 真实序列彩蛋：把上一集的 k̂ 代进同一条显式欧拉链。
stock_k = 1.2702893275022433
stock_h = 1.0 / 200.0
stock_steps = 200
stock_z = stock_h * stock_k
stock_xt = (1.0 + stock_z) ** stock_steps
stock_grad = 2.0 * stock_xt * stock_steps * stock_h * (1.0 + stock_z) ** (stock_steps - 1)
stock_grad_closed = 2.0 * stock_steps * stock_k * math.exp(2.0 * stock_k)  # continuous analogue, for contrast only

stock_rows = []
with (PACK / "data" / "stock_000001_2006.csv").open(newline="") as f:
    for r in csv.DictReader(f):
        stock_rows.append({"date": r["trade_date"], "v": float(r["close"]) / 382.96})
assert len(stock_rows) == 200
assert abs(stock_rows[0]["v"] - 1.0) < 1e-12
assert abs(stock_rows[-1]["v"] - 3.513238980572) < 1e-9

def pick(method):
    return next(g["value"] for g in gradients if g["method"] == method)

doc = {
    "meta": {
        "episode": 72,
        "title": "backprop-through-solver",
        "theta": summary["theta"],
        "h": summary["h"],
        "steps": int(summary["steps"]),
        "x0": 1.0,
        "tsBaseCommit": TS_BASE_COMMIT,
        "evidenceRunAt": "2026-10-29T15:22:19+0000",
        "ghc": "9.14.1",
        "cabal": "3.16.1.0",
        "evidenceSha": {
            "direct": sha("20261029T152219-ch9-neuralode-direct.json"),
            "adjoint": sha("20261029T152219-ch9-neuralode-adjoint.json"),
        },
    },
    "key": {
        "xT": summary["xT"],
        "gradClosed": summary["grad_closed"],
        "gradDirect": summary["grad_direct"],
        "gradAdjoint": summary["grad_adjoint"],
        "gradFiniteDiff": summary["grad_finite_diff"],
        "gradWrongSign": summary["grad_wrong_sign"],
        "relDirectClosed": summary["rel_direct_closed"],
        "relAdjointDirect": summary["rel_adjoint_direct"],
        "relFiniteDiff": summary["rel_finite_diff"],
        "gradRK4": summary["grad_rk4"],
        "gradRK4Closed": summary["grad_rk4_closed"],
        "relRK4": summary["rel_rk4"],
        "gradCont": summary["grad_cont"],
        "gradContClosed": summary["grad_cont_closed"],
        "relCont": summary["rel_cont"],
        "tape200": int(summary["tape_200"]),
        "tape20": int(summary["tape_20"]),
        "checkpoints200": int(summary["checkpoints_200"]),
        "checkpoints20": int(summary["checkpoints_20"]),
        "memDirect200k": summary["mem_direct_200k"],
        "memDirect2m": summary["mem_direct_2m"],
        "memAdjoint200k": summary["mem_adjoint_200k"],
        "memAdjoint2m": summary["mem_adjoint_2m"],
        "memDirectRatio": summary["mem_direct_ratio"],
        "memAdjointRatio": summary["mem_adjoint_ratio"],
        "stockK": stock_k,
        "stockH": stock_h,
        "stockSteps": stock_steps,
        "stockXT": stock_xt,
        "stockGrad": stock_grad,
        "stockGradContinuous": stock_grad_closed,
    },
    "forward": forward,
    "gradients": gradients,
    "slots": slots,
    "memory": memory,
    "stock": {
        "code": "sz000001",
        "window": "2006-11-22 – 2007-10-29",
        "rows": stock_rows,
    },
}

OUT.write_text(json.dumps(doc, ensure_ascii=False, separators=(",", ":")))
print(f"wrote {OUT} ({OUT.stat().st_size} bytes)")
print("forward", len(forward), "gradients", len(gradients), "slots", len(slots), "memory", len(memory))
print("direct", summary["grad_direct"], "ratio", summary["mem_direct_ratio"])
print("adjoint", summary["grad_adjoint"], "ratio", summary["mem_adjoint_ratio"])
print("stock", stock_xt, stock_grad)
