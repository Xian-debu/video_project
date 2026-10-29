#!/usr/bin/env python3
"""Generate data/ode.json for episode 70 (ODE solvers) from the recorded evidence.

The curves are recomputed here in double precision with the same formulas as the Haskell
implementation; the scalar metrics are then checked against data/evidence/*.json before they are
written, so a drift between the film and the recorded run fails the build instead of shipping.

Run from the pack root:  python3 build/generate_ode_data.py
"""
from __future__ import annotations

import csv
import hashlib
import json
import math
import pathlib
import sys

PACK = pathlib.Path(__file__).resolve().parent.parent
DATA = PACK / "data"
OUT = DATA / "ode.json"

OMEGA = 1.0
H = 0.1
PERIODS = 10
T_END = PERIODS * 2.0 * math.pi
STEPS = 628  # int(T_END / H) in the Haskell evidence run (0, h, ..., 628h)
H_SMALL = 0.01
STEPS_SMALL = 6280

CONV_H = [0.2, 0.1, 0.05, 0.02, 0.01, 0.005, 0.0025]
CONV_SMALL = [0.02, 0.01, 0.005, 0.0025]


def load_evidence(unit: str) -> dict:
    path = DATA / "evidence" / (unit + ".json")
    doc = json.loads(path.read_text(encoding="utf-8"))
    doc["_sha256"] = hashlib.sha256(path.read_bytes()).hexdigest()
    return doc


def metric(doc: dict, key: str) -> float:
    return float(doc["metrics"][key]["value"])


def euler_2d(x: float, v: float, h: float) -> tuple[float, float]:
    # x' = v, v' = -omega^2 x, explicit Euler.
    return x + h * v, v - h * OMEGA * OMEGA * x


def rk4_2d(x: float, v: float, h: float) -> tuple[float, float]:
    def f(state: tuple[float, float]) -> tuple[float, float]:
        px, pv = state
        return pv, -OMEGA * OMEGA * px

    k1x, k1v = f((x, v))
    k2x, k2v = f((x + h / 2 * k1x, v + h / 2 * k1v))
    k3x, k3v = f((x + h / 2 * k2x, v + h / 2 * k2v))
    k4x, k4v = f((x + h * k3x, v + h * k3v))
    return (
        x + h / 6 * (k1x + 2 * k2x + 2 * k3x + k4x),
        v + h / 6 * (k1v + 2 * k2v + 2 * k3v + k4v),
    )


def energy(x: float, v: float) -> float:
    return 0.5 * v * v + 0.5 * OMEGA * OMEGA * x * x


def run_spring(step, h: float, steps: int) -> tuple[list[tuple[float, float]], list[float], list[float]]:
    x, v = 1.0, 0.0
    e0 = energy(x, v)
    pts, ratios, ts = [(x, v)], [1.0], [0.0]
    for n in range(1, steps + 1):
        x, v = step(x, v, h)
        pts.append((x, v))
        ratios.append(energy(x, v) / e0)
        ts.append(n * h)
    return pts, ratios, ts


def euler_on_exp(h: float) -> float:
    # x' = x, x(0) = 1; n = 10 / h steps, exact answer e^10.
    n = round(10.0 / h)
    return (1.0 + h) ** n


def rk4_step_exp(h: float) -> float:
    return 1.0 + h + h * h / 2 + h * h * h / 6 + h * h * h * h / 24


def rk4_on_exp(h: float) -> float:
    n = round(10.0 / h)
    return rk4_step_exp(h) ** n


def max_err(one_step, h: float) -> float:
    """Max |numerical - exp(kh)| over k = 0..10/h, matching the Haskell evidence."""
    n = round(10.0 / h)
    x, worst = 1.0, 0.0
    for k in range(0, n + 1):
        if k:
            x = one_step(x, h)
        worst = max(worst, abs(x - math.exp(k * h)))
    return worst


def max_err_euler(h: float) -> float:
    return max_err(lambda x, step: x * (1.0 + step), h)


def max_err_rk4(h: float) -> float:
    return max_err(lambda x, step: x * rk4_step_exp(step), h)


def log_slope(hs: list[float], errs: list[float]) -> float:
    xs = [math.log(h) for h in hs]
    ys = [math.log(e) for e in errs]
    mx = sum(xs) / len(xs)
    my = sum(ys) / len(ys)
    num = sum((x - mx) * (y - my) for x, y in zip(xs, ys))
    den = sum((x - mx) ** 2 for x in xs)
    return num / den


def downsample(points: list, target: int) -> list:
    if len(points) <= target:
        return points
    stride = (len(points) - 1) / (target - 1)
    return [points[min(len(points) - 1, round(i * stride))] for i in range(target)]


def main() -> int:
    analytic = load_evidence("ch9-analytic-baseline")
    euler = load_evidence("ch9-euler")
    rk4 = load_evidence("ch9-rk4")

    e_pts, e_ratios, ts = run_spring(euler_2d, H, STEPS)
    r_pts, r_ratios, _ = run_spring(rk4_2d, H, STEPS)
    r_small, r_small_ratios, _ = run_spring(rk4_2d, H_SMALL, STEPS_SMALL)
    a_pts = [(math.cos(t), -math.sin(t)) for t in ts]

    # The plotted errors come from the recorded Haskell run (data/evidence/convergence.csv), so the
    # figure is the same data the evidence JSON was written from. Recomputing them in Python gives
    # the same truncation curve but differs in the last digits of the floating-point accumulation;
    # that is not a different result, so the recorded table wins for display.
    conv_rows = list(csv.DictReader((DATA / "evidence" / "convergence.csv").open(encoding="utf-8")))
    conv_h = [float(row["h"]) for row in conv_rows]
    e_err = [float(row["euler_err"]) for row in conv_rows]
    r_err = [float(row["rk4_err"]) for row in conv_rows]
    if conv_h != CONV_H:
        print("MISMATCH convergence h: %r" % conv_h, file=sys.stderr)
        return 1
    e_order = metric(euler, "order_observed")
    r_order = metric(rk4, "order_observed")
    e_order_py = log_slope(CONV_SMALL, [max_err_euler(h) for h in CONV_SMALL])
    r_order_py = log_slope(CONV_SMALL, [max_err_rk4(h) for h in CONV_SMALL])
    if abs(e_order_py - e_order) > 0.02 or abs(r_order_py - r_order) > 0.02:
        print("MISMATCH recomputed order: %.6f / %.6f vs recorded %.6f / %.6f" % (e_order_py, r_order_py, e_order, r_order), file=sys.stderr)
        return 1

    # Amplification factors on the imaginary axis: |R(i y)| with y = h * omega.
    ys = [4.0 * i / 240 for i in range(241)]
    e_gain = [math.sqrt(1.0 + y * y) for y in ys]
    r_gain = [math.sqrt(max(0.0, 1.0 - y ** 6 / 72.0 + y ** 8 / 576.0)) for y in ys]

    # A-share close as a piecewise-linear, non-smooth trajectory (no numeric value is shown on screen).
    stock_rows = (DATA / "stock_600519_2019h2.csv").read_text(encoding="utf-8").strip().splitlines()
    header = stock_rows[0].split(",")
    close_i = header.index("close")
    date_i = header.index("trade_date")
    stock = [(row.split(",")[date_i], float(row.split(",")[close_i])) for row in stock_rows[1:]]
    lo = min(c for _, c in stock)
    hi = max(c for _, c in stock)
    stock_norm = [{"date": d, "v": round((c - lo) / (hi - lo), 6)} for d, c in stock]

    key = {
        "eulerOneStep": metric(euler, "one_step_h0.1"),
        "rk4OneStep": metric(rk4, "one_step_h0.1"),
        "eulerEnergyRatio": metric(euler, "energy_ratio_10_periods"),
        "rk4EnergyRatio": metric(rk4, "energy_ratio_10_periods_h0.1"),
        "eulerErr": metric(euler, "err_T10_h0.1"),
        "rk4Err": metric(rk4, "err_T10_h0.1"),
        "eulerOrder": metric(euler, "order_observed"),
        "rk4Order": metric(rk4, "order_observed"),
    }

    checks = [
        ("euler one step", key["eulerOneStep"], 1.0 + H),
        ("euler energy ratio", key["eulerEnergyRatio"], e_ratios[-1]),
        ("rk4 one step", key["rk4OneStep"], rk4_step_exp(H)),
        ("rk4 energy ratio", key["rk4EnergyRatio"], r_ratios[-1]),
        ("euler err", key["eulerErr"], e_err[CONV_H.index(0.1)]),
        ("rk4 err", key["rk4Err"], r_err[CONV_H.index(0.1)]),
    ]
    for name, recorded, computed in checks:
        rel = abs(recorded - computed) / max(1e-12, abs(recorded))
        if rel > 1e-6:
            print("MISMATCH %s: evidence %.17g computed %.17g (rel %.3g)" % (name, recorded, computed, rel), file=sys.stderr)
            return 1

    doc = {
        "schemaVersion": 1,
        "meta": {
            "omega": OMEGA,
            "h": H,
            "steps": STEPS,
            "periods": PERIODS,
            "tEnd": round(T_END, 12),
            "convH": CONV_H,
            "evidence": {
                "ch9-analytic-baseline": analytic["_sha256"],
                "ch9-euler": euler["_sha256"],
                "ch9-rk4": rk4["_sha256"],
            },
            "tsBaseCommit": euler["tsBaseCommit"],
            "stock": {
                "code": "sh600519",
                "window": "2019-07-01..2019-12-31",
                "rows": len(stock),
                "source": "ts-admin data/demo/single_daily_600519_qfq.csv",
            },
        },
        "key": key,
        "phase": {
            "analytic": [{"x": round(x, 8), "v": round(v, 8)} for x, v in downsample(a_pts, 200)],
            "euler": [{"x": round(x, 8), "v": round(v, 8)} for x, v in downsample(e_pts, 200)],
            "rk4": [{"x": round(x, 8), "v": round(v, 8)} for x, v in downsample(r_pts, 200)],
        },
        "energy": {
            "euler": [round(v, 8) for v in downsample(e_ratios, 200)],
            "rk4": [round(v, 12) for v in downsample(r_ratios, 200)],
            "eulerFinal": round(e_ratios[-1], 12),
            "rk4Final": round(r_ratios[-1], 12),
        },
        "convergence": {
            "h": CONV_H,
            "eulerErr": [round(v, 8) for v in e_err],
            "rk4Err": [round(v, 12) for v in r_err],
            "eulerSlope": round(e_order, 12),
            "rk4Slope": round(r_order, 12),
        },
        "amplification": {
            "y": [round(y, 6) for y in ys],
            "euler": [round(v, 8) for v in e_gain],
            "rk4": [round(v, 8) for v in r_gain],
            "rk4Limit": round(2.0 * math.sqrt(2.0), 12),
        },
        "stock": {"rows": stock_norm},
    }
    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(json.dumps(doc, ensure_ascii=False, separators=(",", ":")) + "\n", encoding="utf-8")
    print("wrote %s  %.1f KB" % (OUT, OUT.stat().st_size / 1024))
    for name, recorded, computed in checks:
        print("  %-20s evidence %.15g  computed %.15g" % (name, recorded, computed))
    print("  phase points %d / %d / %d" % (len(doc["phase"]["analytic"]), len(doc["phase"]["euler"]), len(doc["phase"]["rk4"])))
    print("  energy final euler %.12f  rk4 %.12f" % (e_ratios[-1], r_ratios[-1]))
    print("  slopes euler %.12f  rk4 %.12f" % (e_order, r_order))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
