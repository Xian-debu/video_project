#!/usr/bin/env python3
"""派生第 9 集的数据包：只读 ts-base 的证据输出，不改任何原始数据。

输入：/root/ts-base/data/episodes/09-mlp-and-tcn/ 下的 summary.json + 6 份 CSV
输出：<pack>/data/mlp_tcn.json（派生文件，不入库；film.json 的 derive/derived 记录它）

宁可在这里失败也不让画面带错数：
1. 用式(2.62) 逐项重算卷积黄金值，与 summary 对照；
2. 重算参数量 1985 / 1649、感受野 15；
3. 检查证据文件里的 tsBaseCommit 与 summary 一致。
"""
import json
import math
import pathlib

PACK = pathlib.Path(__file__).resolve().parents[1]
TSBASE = pathlib.Path("/root/ts-base/data/episodes/09-mlp-and-tcn")
EVID = pathlib.Path("/root/ts-base/inventory/evidence")
OUT = PACK / "data" / "mlp_tcn.json"


def read_csv(name):
    rows = []
    with open(TSBASE / name, encoding="utf-8") as f:
        head = f.readline().strip().split(",")
        for line in f:
            line = line.strip()
            if not line:
                continue
            parts = line.split(",")
            rows.append({k: (v if k == "date" else float(v)) for k, v in zip(head, parts)})
    return rows


def col(rows, key):
    return [r[key] for r in rows]


def causal_conv(f, x, pad):
    """式(2.62)：y_t = Σ_k f_k · x_{t-(K-k)}，左侧补 pad 个零。"""
    k = len(f)
    n = len(x)
    y = []
    for t in range(n):
        s = 0.0
        for j in range(k):
            idx = t - (k - 1 - j) + pad
            xi = x[idx - pad] if 0 <= idx - pad < n and idx >= pad else 0.0
            # idx 已经是补零后的坐标；补零区内视为 0
            idx2 = t - (k - 1 - j)
            xi = x[idx2] if 0 <= idx2 < n else 0.0
            s += f[j] * xi
        y.append(s)
    return y


def main():
    summ = json.loads((TSBASE / "summary.json").read_text(encoding="utf-8"))
    meta = summ["meta"]
    mlp = summ["mlp"]
    tcn = summ["tcn"]

    fit = read_csv("mlp_fit.csv")
    curve = read_csv("mlp_curve.csv")
    mret = read_csv("mlp_returns.csv")
    conv = read_csv("tcn_conv.csv")
    ar2 = read_csv("tcn_ar2.csv")
    tret = read_csv("tcn_returns.csv")

    # ---- 1. 黄金值重算（式(2.62)）
    f = [1.0, 2.0, 3.0]
    x = [1.0, 2.0, 3.0, 4.0, 5.0]
    golden = causal_conv(f, x, 2)
    assert [round(v, 9) for v in golden] == [3.0, 8.0, 14.0, 20.0, 26.0], golden
    csv_golden = [round(r["causal"], 9) for r in conv]
    assert csv_golden == [3.0, 8.0, 14.0, 20.0, 26.0], csv_golden
    # 未翻转版本：y_t = Σ f_k x_{t+k-1}（会看到未来）
    leaky = []
    for t in range(5):
        s = 0.0
        for j in range(3):
            idx = t + j
            s += f[j] * (x[idx] if idx < 5 else 0.0)
        leaky.append(s)
    assert leaky == [14.0, 20.0, 26.0, 14.0, 5.0], leaky
    assert [round(r["leaky"], 9) for r in conv] == leaky
    # 膨胀 d=2 黄金值（测试里钉住的另一组）
    dil = []
    for t in range(5):
        s = 0.0
        for j in range(3):
            idx = t - (3 - 1 - j) * 2
            s += f[j] * (x[idx] if 0 <= idx < 5 else 0.0)
        dil.append(s)
    assert dil == [3.0, 6.0, 11.0, 16.0, 22.0], dil

    # ---- 2. 参数量与感受野
    mlp_params = 60 * 32 + 32 + 32 * 1 + 1
    tcn_params = (3 * 1 * 16 + 16) + (3 * 16 * 16 + 16) + (3 * 16 * 16 + 16) + (16 * 1 + 1)
    rf = 1 + (3 - 1) * (1 + 2 + 4)
    assert mlp_params == 1985, mlp_params
    assert tcn_params == 1649, tcn_params
    assert rf == 15, rf
    assert mlp["param_60_32_1"] == 1985
    assert tcn["param_count"] == 1649
    assert tcn["receptive_field"] == 15
    assert tcn["causal_first"] == 3.0 and tcn["leaky_first"] == 14.0

    # ---- 3. 证据文件
    ev_files = sorted(EVID.glob("ch2-mlp/*.json")) + sorted(EVID.glob("ch2-tcn/*.json"))
    ev_meta = []
    for p in ev_files:
        doc = json.loads(p.read_text(encoding="utf-8"))
        assert doc["tsBaseCommit"] == meta["tsBaseCommit"], (p, doc["tsBaseCommit"])
        ev_meta.append(
            {
                "path": str(p.relative_to(pathlib.Path("/root/ts-base"))),
                "unitId": doc["unitId"],
                "runAt": doc["runAt"],
                "checks": doc.get("checks", {}),
                "tests": doc.get("tests", {}),
            }
        )

    # 真实收益率曲线：1507 个测试窗口，抽稀到约 380 个点画图
    step = max(1, len(mret) // 380)
    mret_plot = [mret[i] for i in range(0, len(mret), step)]

    out = {
        "meta": {
            "episode": meta["episode"],
            "bookPages": meta["bookPages"],
            "tsBaseCommit": meta["tsBaseCommit"],
            "runAt": meta["runAt"],
            "command": meta["command"],
            "seed": meta["seed"],
            "checks": summ["checks"],
            "tests": {"mlp": 16, "tcn": 19, "suites": 46, "asserts": 640},
            "evidence": ev_meta,
            "artifacts": summ["artifacts"],
        },
        "data": {
            "daily600519": {"rows": summ["data"]["daily600519"]["rows"], "returns": summ["data"]["daily600519"]["returns"], "first": "2005-01-04", "last": "2025-12-31"},
            "daily000001": {"rows": summ["data"]["daily000001"]["rows"], "returns": summ["data"]["daily000001"]["returns"], "first": "2005-01-04", "last": "2025-12-31"},
            "windows": {
                "mlpAll": summ["data"]["mlp_windows"],
                "mlpTrain": summ["data"]["mlp_train_windows"],
                "mlpTest": summ["data"]["mlp_test_windows"],
                "ar2Train": summ["data"]["tcn_ar2_train"],
                "ar2Test": summ["data"]["tcn_ar2_test"],
                "tcnReal": tcn["real_train_windows"],
            },
        },
        "mlp": {
            "dims": [60, 32, 1],
            "params": mlp["param_60_32_1"],
            "gradcheck": mlp["gradcheck"],
            "linear": {"w": mlp["linear_w"], "b": mlp["linear_b"], "mse": mlp["linear_mse"]},
            "quad": {"mse": mlp["quadratic_mse"], "linearMse": mlp["quadratic_linear_mse"], "ratio": mlp["quadratic_ratio"]},
            "xor": {"mse": mlp["xor_mse"], "first": mlp["xor_first_loss"]},
            "real": {"test": mlp["real_test_mse"], "base": mlp["real_zero_baseline_mse"], "ratio": mlp["real_ratio"], "trainFirst": mlp["real_train_first"], "trainLast": mlp["real_train_last"]},
        },
        "tcn": {
            "params": tcn["param_count"],
            "rf": tcn["receptive_field"],
            "gradcheck": tcn["gradcheck"],
            "layers": {"channels": 16, "k": 3, "dils": [1, 2, 4]},
            "causal": {"pastMaxdiff": tcn["causality_past_maxdiff"], "first": tcn["causal_first"]},
            "leaky": {"first": tcn["leaky_first"]},
            "ar2": {"test": tcn["ar2_test_mse"], "naive": tcn["ar2_naive_mse"], "ratio": tcn["ar2_ratio"], "trainFirst": tcn["ar2_train_first"], "trainLast": tcn["ar2_train_last"]},
            "real": {"test": tcn["real_test_mse"], "base": tcn["real_zero_baseline_mse"], "ratio": tcn["real_ratio"], "trainLast": tcn["real_train_last"]},
        },
        "hand": {
            "goldenY": golden,
            "planY": [3, 11, 14, 20, 26],
            "leakyY": leaky,
            "dilY": dil,
            "paramMlp": "60·32+32 + 32·1+1",
            "paramTcn": "(3·1·16+16)+(3·16·16+16)+(3·16·16+16)+(16·1+1)",
            "rfCalc": "1+(3−1)(1+2+4)",
        },
        "series": {
            "fit": {"x": col(fit, "x"), "y": col(fit, "y"), "line": col(fit, "line"), "mlp": col(fit, "mlp")},
            "loss": {"epoch": col(curve, "epoch"), "loss": col(curve, "loss")},
            "mlpReturns": {"actual": col(mret_plot, "actual"), "pred": col(mret_plot, "pred"), "stride": step},
            "conv": {"t": col(conv, "t"), "x": col(conv, "x"), "causal": col(conv, "causal"), "leaky": col(conv, "leaky")},
            "ar2": {"actual": col(ar2, "actual"), "pred": col(ar2, "pred"), "naive": col(ar2, "naive")},
            "tcnReturns": {"actual": col(tret, "actual"), "pred": col(tret, "pred")},
        },
    }
    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(json.dumps(out, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
    print(f"wrote {OUT} ({OUT.stat().st_size} bytes)")
    print(f"golden={golden} leaky={leaky} rf={rf} params={mlp_params}/{tcn_params}")
    print(f"checks={summ['checks']} evidence={[e['unitId'] for e in ev_meta]}")


if __name__ == "__main__":
    main()
