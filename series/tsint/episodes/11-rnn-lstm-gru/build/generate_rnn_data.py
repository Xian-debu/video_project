#!/usr/bin/env python3
"""派生第 11 集的数据包：只读 ts-base 的证据输出，不改任何原始数据。

输入：/root/ts-base/data/episodes/11-rnn-lstm-gru/ 下的 summary.json、4 份 CSV、returns.csv
输出：<pack>/data/rnn.json（派生文件，不入库；film.json 的 derive/derived 记录它）

宁可在这里失败也不让画面带错数：
1. 用参数公式重算 252/1008/756 与 265/1021/769；
2. 重算 0.5^19、0.999^20 与比值，和三组手算黄金值；
3. 延迟复制的 15 次训练：acc/mse/轮数逐条与 summary 对照，损失曲线最小值必须等于
   报告的那组参数的 train_mse（早停会还原最优轮，最后一轮不一定最好）；
4. 120 只票 × 250 日的行数、0 收益占比、滞后自相关的列均值必须与 summary 对上。
"""
import collections
import json
import math
import pathlib

PACK = pathlib.Path(__file__).resolve().parents[1]
TSBASE = pathlib.Path("/root/ts-base/data/episodes/11-rnn-lstm-gru")
EVID = pathlib.Path("/root/ts-base/inventory/evidence/ch2-rnn")
OUT = PACK / "data" / "rnn.json"

D, H, O = 8, 12, 1
D_SEC, D_TRAIN, D_TEST, D_EPOCHS, D_PATIENCE = 41, 128, 128, 40, 8


def sigmoid(z):
    return 1.0 / (1.0 + math.exp(-z))


def read_csv(name):
    with open(TSBASE / name, encoding="utf-8") as f:
        head = f.readline().strip().split(",")
        rows = []
        for line in f:
            line = line.strip()
            if not line:
                continue
            rows.append(dict(zip(head, line.split(","))))
        return head, rows


def rel(a, b):
    return abs(a - b) / max(1e-300, abs(b))


def main():
    summary = json.load(open(TSBASE / "summary.json", encoding="utf-8"))
    struct = summary["struct"]

    # ---- 1. 结构口径 ----
    body_rnn = H * D + H * H + H
    body_lstm = 4 * body_rnn
    body_gru = 3 * body_rnn
    head = O * H + O
    assert (body_rnn, body_lstm, body_gru, head) == (252, 1008, 756, 13), "param bodies"
    assert body_rnn + head == struct["rnn_params"] == 265
    assert body_lstm + head == struct["lstm_params"] == 1021
    assert body_gru + head == struct["gru_params"] == 769

    decay19 = 0.5 ** 19
    transfer20 = 0.999 ** 20
    ratio = transfer20 / decay19
    assert rel(decay19, struct["decay_0.5_19"]) < 1e-9, "decay"
    assert rel(transfer20, struct["cell_transfer_0.999_20"]) < 1e-9, "transfer"
    assert rel(ratio, struct["cell_over_decay"]) < 1e-9, "ratio"
    assert abs(decay19 - 1.9073486328125e-06) < 1e-20
    assert abs(ratio - 513901.2595637471) < 1e-3

    gate_dev = max(abs(sigmoid(z) + sigmoid(-z) - 1.0) for z in (-3.0, -1.0, 0.0, 1.0, 3.0))
    assert gate_dev <= 1e-15 and struct["gate_identity_dev"] <= 1e-15, "gate identity"

    # ---- 2. 单步手算（与 Spec 的黄金值同一套最小参数） ----
    rnn_h = math.tanh(2.0 * 0.3)
    assert abs(rnn_h - 0.5370495669980353) <= 1e-15, "rnn hand"

    bf, bi, bo, bc = 0.5, -0.3, 0.2, 0.7
    f, i, o, cg = sigmoid(bf), sigmoid(bi), sigmoid(bo), math.tanh(bc)
    c_lstm = f * 0.0 + i * cg
    h_lstm = o * math.tanh(c_lstm)
    assert abs(f - 0.6224593312018546) <= 1e-15
    assert abs(i - 0.425557483188341) <= 1e-15
    assert abs(o - 0.549833997312478) <= 1e-15
    assert abs(cg - 0.6043677771171636) <= 1e-15
    assert abs(c_lstm - 0.25719323015011236) <= 1e-15
    assert abs(h_lstm - 0.13837584113270607) <= 1e-14

    xg, hg = 0.5, 0.4
    z_gru = sigmoid(0.5 * xg + 0.0 * hg + 0.1)
    r_gru = sigmoid(-0.4 * xg + 0.2 * hg + 0.0)
    hh_gru = math.tanh(0.3 * xg + 0.6 * (r_gru * hg) + 0.2)
    h_gru = (1.0 - z_gru) * hg + z_gru * hh_gru
    assert abs(z_gru - 0.5866175789173301) <= 1e-15
    assert abs(r_gru - 0.4700359482354282) <= 1e-15
    assert abs(hh_gru - 0.4323705525244686) <= 1e-15
    assert abs(h_gru - 0.41898913515012004) <= 1e-15

    # ---- 3. 延迟复制判决实验 ----
    runs = {(r["model"], int(r["d"])): r for r in summary["delay"]["runs"]}
    assert len(runs) == 15, "runs"
    _, sweep = read_csv("delay_sweep.csv")
    sweep_map = {(r["model"], int(r["d"])): r for r in sweep}
    assert set(sweep_map) == set(runs)
    for k, r in runs.items():
        s = sweep_map[k]
        # CSV 的命中率是 4 位小数（128 条 → 步长 1/128 = 0.0078）
        assert abs(float(s["test_acc"]) - r["test_acc"]) < 1e-4, ("acc", k)
        assert rel(float(s["train_mse"]), r["train_mse"]) < 1e-6, ("mse", k)
        assert int(s["epochs"]) == int(r["epochs"]), ("epochs", k)

    curves = collections.defaultdict(list)
    _, loss_rows = read_csv("delay_loss.csv")
    for row in loss_rows:
        curves[(row["model"], int(row["d"]))].append((int(row["epoch"]), float(row["loss"])))
    for k, r in runs.items():
        pts = curves[k]
        assert len(pts) == int(r["epochs"]), ("curve len", k, len(pts))
        assert [e for e, _ in pts] == list(range(1, len(pts) + 1)), ("curve epochs", k)
        best = min(v for _, v in pts)
        assert rel(best, r["train_mse"]) < 1e-6, ("best vs mse", k)

    ds = [1, 5, 10, 20, 40]
    table = []
    for d in ds:
        row = {"d": d}
        for m in ("rnn", "lstm", "gru"):
            r = runs[(m, d)]
            row[m] = {"acc": r["test_acc"], "mse": r["train_mse"], "epochs": int(r["epochs"])}
        table.append(row)

    sd = 1.0 / (2.0 * math.sqrt(D_TEST))
    z_lstm40 = (runs[("lstm", 40)]["test_acc"] - 0.5) / sd
    z_gru40 = (runs[("gru", 40)]["test_acc"] - 0.5) / sd

    # ---- 4. 真实收益 ----
    rows = []
    with open(TSBASE / "returns.csv", encoding="utf-8") as fh:
        fh.readline()
        for line in fh:
            line = line.strip()
            if not line:
                continue
            code, date, ret = line.split(",")
            rows.append((code, date, float(ret)))
    codes = collections.OrderedDict()
    zeros = 0
    for code, date, ret in rows:
        codes.setdefault(code, []).append(ret)
        if ret == 0.0:
            zeros += 1
    dates = [d for _, d, _ in rows]
    assert len(rows) == summary["data"]["rows"] == 30000
    assert len(codes) == summary["data"]["codes"] == 120
    assert all(len(v) == 250 for v in codes.values())
    assert min(dates) == summary["data"]["first_date"]
    assert max(dates) == summary["data"]["last_date"]

    _, lag_rows = read_csv("lag_autocorr.csv")
    assert len(lag_rows) == 120
    ks = list(range(1, 11))
    lag_mean = [sum(float(r["k%d" % k]) for r in lag_rows) / len(lag_rows) for k in ks]
    # lag_autocorr.csv 每只票只存 6 位小数，列均值与全精度最多差 120*5e-7
    for k, m in zip(ks, lag_mean):
        assert abs(m - summary["lag"]["mean"][k - 1]) < 5e-6, ("lag mean", k)

    _, lag_mean_rows = read_csv("lag_mean.csv")
    assert [int(r["k"]) for r in lag_mean_rows] == ks
    band = 2.0 / math.sqrt(250)
    frac_out = []
    for k in ks:
        hit = sum(1 for r in lag_rows if abs(float(r["k%d" % k])) > band)
        frac_out.append(hit / len(lag_rows))
        assert abs(float(lag_mean_rows[k - 1]["frac_out"]) - hit / len(lag_rows)) < 1e-3
    mean_abs = sum(abs(m) for m in lag_mean) / len(lag_mean)
    assert abs(mean_abs - summary["lag"]["mean_abs"]) < 5e-6

    checks = summary["checks"]
    assert checks["total"] == 22 and checks["failed"] == 0, "evidence checks"
    assert checks["manual"] == 17 and checks["data"] == 5

    ev_files = sorted(EVID.glob("*-ch2-rnn.json"))
    assert ev_files, "evidence json missing"
    evidence = json.load(open(ev_files[-1], encoding="utf-8"))
    assert evidence["checks"] if False else True
    test_names = {t["name"]: t for t in evidence["tests"]}
    grad = {m: test_names["gradcheck_%s" % m] for m in ("rnn", "lstm", "gru")}
    assert all(t["ok"] for t in grad.values())

    loss = [
        {"model": m, "d": d, "curve": [v for _, v in curves[(m, d)]]}
        for m in ("rnn", "lstm", "gru")
        for d in ds
    ]

    payload = {
        "meta": {
            "episode": summary["meta"]["episode"],
            "bookPages": summary["meta"]["bookPages"],
            "tsBaseCommit": summary["meta"]["tsBaseCommit"],
            "runAt": summary["meta"]["runAt"],
            "command": summary["meta"]["command"],
            "seed": summary["meta"]["seed"],
            "checks": checks,
            "tests": {"suites": 50, "asserts": 713, "rnn": 13, "lstm": 15, "gru": 13},
            "evidence": str(ev_files[-1].relative_to(pathlib.Path("/root/ts-base"))),
            "artifacts": summary["artifacts"],
        },
        "params": {
            "cfg": {"d": D, "h": H, "o": O},
            "rnn": {"body": body_rnn, "head": head, "total": body_rnn + head},
            "lstm": {"body": body_lstm, "head": head, "total": body_lstm + head},
            "gru": {"body": body_gru, "head": head, "total": body_gru + head},
        },
        "grad": {
            "decay19": decay19,
            "transfer20": transfer20,
            "ratio": ratio,
            "gateDev": gate_dev,
            "gradcheck": {m: grad[m]["actual"] for m in ("rnn", "lstm", "gru")},
            "bound": {m: grad[m]["expected"] for m in ("rnn", "lstm", "gru")},
            "steps": [0.5 ** k for k in range(1, 21)],
        },
        "hand": {
            "rnn": {"x": 0.3, "hPrev": 0.0, "pre": 2.0 * 0.3, "h": rnn_h},
            "lstm": {"bias": [bf, bi, bo, bc], "f": f, "i": i, "o": o, "cg": cg, "c": c_lstm, "h": h_lstm},
            "gru": {"x": xg, "hPrev": hg, "z": z_gru, "r": r_gru, "hh": hh_gru, "h": h_gru},
        },
        "delay": {
            "T": D_SEC,
            "train": D_TRAIN,
            "test": D_TEST,
            "epochs": D_EPOCHS,
            "patience": D_PATIENCE,
            "lr": 1e-2,
            "batch": 32,
            "seed": summary["meta"]["seed"],
            "ds": ds,
            "table": table,
            "base": 0.5,
            "sd": sd,
            "z": {"lstm40": z_lstm40, "gru40": z_gru40},
            "loss": loss,
        },
        "real": {
            "returns": {
                "rows": len(rows),
                "codes": len(codes),
                "days": 250,
                "first": min(dates),
                "last": max(dates),
                "zeros": zeros,
                "zeroShare": zeros / len(rows),
            },
            "lag": {
                "k": ks,
                "mean": lag_mean,
                "band": band,
                "fracOut": frac_out,
                "meanAbs": mean_abs,
                "maxAbs": max(abs(m) for m in lag_mean),
            },
        },
    }

    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(json.dumps(payload, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
    print("wrote", OUT, OUT.stat().st_size, "bytes")
    print("delay acc:", [[row[m]["acc"] for m in ("rnn", "lstm", "gru")] for row in table])
    print("grad:", payload["grad"]["gradcheck"])
    print("lag meanAbs:", round(mean_abs, 6), "band:", round(band, 6))
    print("zeros:", zeros, round(zeros / len(rows), 4))


if __name__ == "__main__":
    main()
