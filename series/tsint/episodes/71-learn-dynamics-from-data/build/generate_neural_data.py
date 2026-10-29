#!/usr/bin/env python3
"""Generate data/neural.json for episode 71 (parameter fit + neural ODE) from recorded evidence.

Every scalar that appears on screen is read from data/evidence/*.json and re-checked against the
artifact the picture is drawn from (train MSE vs the last loss row, k̂ vs the pinned formula on the
recorded synthetic table). A drift fails the derive step instead of shipping.

Run from the pack root:  python3 build/generate_neural_data.py
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
OUT = DATA / "neural.json"

K_TRUE = 0.1
LR = 0.3
EPOCHS = 300
DT_MAX = 0.25
WINDOWS_SIN = 6
WINDOWS_STOCK = 12


def load_evidence(unit: str) -> dict:
    path = DATA / "evidence" / (unit + ".json")
    doc = json.loads(path.read_text(encoding="utf-8"))
    doc["_sha256"] = hashlib.sha256(path.read_bytes()).hexdigest()
    return doc


def metric(doc: dict, key: str) -> float:
    return float(doc["metrics"][key]["value"])


def rows(name: str) -> list[dict]:
    with (DATA / "evidence" / name).open(encoding="utf-8") as fh:
        return list(csv.DictReader(fh))


def close(a: float, b: float, rel: float = 1e-9) -> bool:
    return abs(a - b) <= rel * max(1.0, abs(a), abs(b))


def main() -> int:
    param = load_evidence("ch9-param-ode-fit")
    neural = load_evidence("ch9-neuralode-forward")

    synth = rows("paramfit_synth.csv")
    pstock = rows("paramfit_stock.csv")
    nsin = rows("neuralode_sin.csv")
    nstock = rows("neuralode_stock.csv")
    lsin = rows("neuralode_loss_sin.csv")
    lstock = rows("neuralode_loss_stock.csv")

    k_closed = metric(param, "k_closed_synth")
    k_grad = metric(param, "k_gradient_synth")
    k_stock = metric(param, "k_stock_200d")
    r2_stock = metric(param, "r2_stock_exp_fit")

    param_count = metric(neural, "param_count")
    mse_sin = metric(neural, "train_mse_sin")
    rmse_sin_full = metric(neural, "full_rmse_sin")
    rmse_sin_25 = metric(neural, "rollout_rmse_sin_25")
    mse_stock = metric(neural, "train_mse_stock")
    rmse_stock_full = metric(neural, "full_rmse_stock")
    rmse_stock_50 = metric(neural, "rollout_rmse_stock_50")
    train_seconds = metric(neural, "train_seconds")

    # The synthetic table was generated as x = 2 exp(0.1 t)(1 + 2% noise); the closed form must
    # reproduce the recorded k on that exact table, and the displayed fit line is exp(k t).
    k_py = sum((float(r["t"]) - sum(float(q["t"]) for q in synth) / len(synth)) * math.log(float(r["x"]) / 2.0) for r in synth)
    k_py /= sum((float(r["t"]) - sum(float(q["t"]) for q in synth) / len(synth)) ** 2 for r in synth)
    if not close(k_py, k_closed, 1e-9):
        print("MISMATCH closed-form k: %.17g vs recorded %.17g" % (k_py, k_closed), file=sys.stderr)
        return 1
    if abs(k_grad - K_TRUE) > 0.01:
        print("gradient fit left the neighbourhood of 0.1: %.17g" % k_grad, file=sys.stderr)
        return 1

    # Loss rows and the displayed metrics are the same run: last epoch must equal train MSE.
    if not close(float(lsin[-1]["loss"]), mse_sin, 1e-9):
        print("MISMATCH sin loss tail: %.17g vs %.17g" % (float(lsin[-1]["loss"]), mse_sin), file=sys.stderr)
        return 1
    if not close(float(lstock[-1]["loss"]), mse_stock, 1e-9):
        print("MISMATCH stock loss tail: %.17g vs %.17g" % (float(lstock[-1]["loss"]), mse_stock), file=sys.stderr)
        return 1
    if int(param_count) != 337:
        print("param count changed: %r" % param_count, file=sys.stderr)
        return 1

    # The picture uses the recorded trajectories; check their length and endpoints.
    for name, table, n in (("sin", nsin, 201), ("stock", nstock, 200)):
        if len(table) != n:
            print("unexpected %s rows: %d" % (name, len(table)), file=sys.stderr)
            return 1
    if abs(float(nsin[-1]["true"]) - math.sin(2.0 * math.pi) ) > 8e-4:
        print("sin truth endpoint drifted: %s" % nsin[-1]["true"], file=sys.stderr)
        return 1

    stock_src = list(csv.DictReader((DATA / "stock_000001_2006.csv").open(encoding="utf-8")))
    close0 = float(stock_src[0]["close"])
    stock = [{"date": r["trade_date"], "v": round(float(r["close"]) / close0, 6)} for r in stock_src]
    if len(stock) != 200:
        print("stock csv rows: %d" % len(stock), file=sys.stderr)
        return 1

    def f(t: str) -> float:
        return float(t)

    key = {
        "kTrue": K_TRUE,
        "kClosed": k_closed,
        "kGrad": k_grad,
        "kStock": k_stock,
        "r2Stock": r2_stock,
        "paramCount": int(param_count),
        "mseSin": mse_sin,
        "rmseSinFull": rmse_sin_full,
        "rmseSin25": rmse_sin_25,
        "mseStock": mse_stock,
        "rmseStockFull": rmse_stock_full,
        "rmseStock50": rmse_stock_50,
        "trainSeconds": train_seconds,
    }

    doc = {
        "meta": {
            "code": "sz000001",
            "window": "2006-11-22 – 2007-10-29",
            "rows": len(stock),
            "source": "ts-admin bars_daily qfq (close*adj_factor)",
            "tsAdminCommit": "5e80ec3",
            "tsBaseCommit": param["tsBaseCommit"],
            "evidenceSha": {
                "param": param["_sha256"],
                "neural": neural["_sha256"],
            },
            "params": int(param_count),
            "lr": LR,
            "epochs": EPOCHS,
            "dtMax": DT_MAX,
            "windowsSin": WINDOWS_SIN,
            "windowsStock": WINDOWS_STOCK,
        },
        "key": key,
        "paramSynth": [{"t": f(r["t"]), "x": f(r["x"]), "fit": f(r["fit"])} for r in synth],
        "paramStock": [{"t": f(r["t"]), "v": f(r["close_norm"]), "fit": f(r["fit"])} for r in pstock],
        "neuralSin": [{"t": f(r["t"]), "truth": f(r["true"]), "pred": f(r["pred"])} for r in nsin],
        "neuralStock": [{"t": f(r["t"]), "truth": f(r["true"]), "pred": f(r["pred"])} for r in nstock],
        "lossSin": [{"epoch": int(float(r["epoch"])), "loss": f(r["loss"])} for r in lsin],
        "lossStock": [{"epoch": int(float(r["epoch"])), "loss": f(r["loss"])} for r in lstock],
        "stock": stock,
    }
    OUT.write_text(json.dumps(doc, ensure_ascii=False, separators=(",", ":")) + "\n", encoding="utf-8")
    print("wrote %s (%.1f KB), %d param rows, %d neural rows" % (OUT, OUT.stat().st_size / 1024, len(synth), len(nsin) + len(nstock)))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
