#!/usr/bin/env python3
"""派生第 10 集的数据包：只读 ts-base 的证据输出，不改任何原始数据。

输入：/root/ts-base/data/episodes/10-attention-block/ 下的 summary.json + 5 份 CSV + 两份日线
输出：<pack>/data/attention.json（派生文件，不入库；film.json 的 derive/derived 记录它）

宁可在这里失败也不让画面带错数：
1. 用式(2.65) 重算 softmax 与 2x2 手算黄金值，与 summary 对照；
2. 重算参数量 768、PE 第 0 行交替、注意力矩阵行和；
3. 逐窗重算真实数据的平均偏差/平均熵/平均损失，必须与 summary 完全对上。
"""
import json
import math
import pathlib

PACK = pathlib.Path(__file__).resolve().parents[1]
TSBASE = pathlib.Path("/root/ts-base/data/episodes/10-attention-block")
EVID = pathlib.Path("/root/ts-base/inventory/evidence/ch2-attention")
OUT = PACK / "data" / "attention.json"


def read_csv(name):
    with open(TSBASE / name, encoding="utf-8") as f:
        head = f.readline().strip().split(",")
        rows = []
        for line in f:
            line = line.strip()
            if not line:
                continue
            parts = line.split(",")
            rows.append(dict(zip(head, parts)))
        return head, rows


def read_numeric(name):
    head, rows = read_csv(name)
    out = []
    for r in rows:
        row = {}
        for k, v in r.items():
            if k in ("date", "series"):
                row[k] = v
            else:
                row[k] = None if v == "null" else float(v)
        out.append(row)
    return out


def col(rows, key):
    return [r[key] for r in rows]


def softmax(z):
    m = max(z)
    e = [math.exp(v - m) for v in z]
    s = sum(e)
    return [v / s for v in e]


def main():
    summ = json.loads((TSBASE / "summary.json").read_text(encoding="utf-8"))
    meta = summ["meta"]
    attn = summ["attention"]
    checks = summ["checks"]

    mat = read_numeric("attention_matrix.csv")
    soft = read_numeric("attention_softmax.csv")
    loss = read_numeric("attention_loss.csv")
    pe = read_numeric("attention_pe.csv")
    real = read_numeric("attention_real.csv")
    _, mt = read_csv("sh600519_daily.csv")
    _, pa = read_csv("sz000001_daily.csv")

    t = 16
    dk = 16
    dc = 8
    pe_dim = 16

    # ---- 1. softmax 与 2x2 手算黄金值
    z1 = [1.0, 2.0, 3.0]
    p1 = softmax(z1)
    golden = [0.09003057317038046, 0.24472847105479764, 0.6652409557748218]
    for a, b in zip(p1, golden):
        assert abs(a - b) < 1e-12, (p1, golden)
    for a, b in zip(p1, attn["softmax_123"]):
        assert abs(a - b) < 1e-11, (p1, attn["softmax_123"])
    logit = 1.0 / math.sqrt(2.0)
    a00 = 1.0 / (1.0 + math.exp(-logit))
    a01 = 1.0 - a00
    out0 = 10.0 * a00
    out1 = 10.0 * a01
    assert abs(a00 - 0.6697615493266569) < 1e-12, a00
    assert abs(out0 - 6.697615493266569) < 1e-12, out0
    assert abs(out1 - 3.302384506733431) < 1e-12, out1
    # CSV 前三条是 softmax([1,2,3])，后三条是整体 +1000（朴素版溢出为 null）
    assert len(soft) == 6, len(soft)
    assert abs(soft[0]["stable"] - p1[0]) < 1e-11
    assert abs(soft[2]["stable"] - p1[2]) < 1e-11
    assert all(r["naive"] is None for r in soft[3:]), soft[3:]
    assert soft[0]["naive"] is not None and abs(soft[0]["naive"] - p1[0]) < 1e-11

    # ---- 2. 参数量与形状
    params = 2 * dk * (dc + pe_dim)
    assert params == 768, params
    assert attn["copy_param_count"] == 768
    assert len(mat) == t and len(pe) == t
    rowsum = max(abs(sum(r["a%d" % j] for j in range(t)) - 1.0) for r in mat)
    assert rowsum < 1e-9, rowsum
    assert attn["mask_rowsum_dev"] < 1e-15
    pe_row0 = [pe[0]["c%d" % j] for j in range(pe_dim)]
    assert pe_row0 == [0.0, 1.0] * 8, pe_row0
    assert abs(pe[1]["c0"] - math.sin(1.0)) < 1e-8

    # ---- 3. 真实窗口的三项诊断量
    def stats(series):
        rows = [r for r in real if r["series"] == series]
        n = len(rows)
        dev = sum(r["dev"] for r in rows) / n
        ent = sum(r["entropy"] for r in rows) / n
        ls = sum(r["loss"] for r in rows) / n
        return rows, n, dev, ent, ls

    mt_rows, mt_n, mt_dev, mt_ent, mt_loss = stats("600519")
    pa_rows, pa_n, pa_dev, pa_ent, pa_loss = stats("000001")
    assert mt_n == summ["data"]["real_windows_600519"] == 197, mt_n
    assert pa_n == summ["data"]["real_windows_000001"] == 193, pa_n
    for got, want, name in [
        (mt_dev, attn["real_600519_dev"], "600519 dev"),
        (mt_ent, attn["real_600519_entropy"], "600519 entropy"),
        (mt_loss, attn["real_600519_loss"], "600519 loss"),
        (pa_dev, attn["real_000001_dev"], "000001 dev"),
        (pa_ent, attn["real_000001_entropy"], "000001 entropy"),
        (pa_loss, attn["real_000001_loss"], "000001 loss"),
    ]:
        assert abs(got - want) < 1e-11, (name, got, want)

    # ---- 4. 损失曲线：最后一行的 final 必须等于 summary 的最终损失
    assert abs(loss[-1]["final"] - attn["copy_final_loss"]) < 1e-11, (loss[-1], attn["copy_final_loss"])
    assert abs(loss[0]["final"] - attn["copy_initial_loss"]) < 1e-11

    # ---- 5. 证据文件
    ev_docs = []
    for p in sorted(EVID.glob("*.json")):
        doc = json.loads(p.read_text(encoding="utf-8"))
        ev_docs.append((p, doc))
    assert ev_docs, "no evidence files"
    matching = [(p, d) for (p, d) in ev_docs if d["tsBaseCommit"] == meta["tsBaseCommit"]]
    stale = [(p.name, d["tsBaseCommit"][:7]) for (p, d) in ev_docs if d["tsBaseCommit"] != meta["tsBaseCommit"]]
    assert matching, ("no evidence at tsBaseCommit", meta["tsBaseCommit"], stale)
    p, doc = max(matching, key=lambda x: x[1]["runAt"])
    ev_meta = [{
        "path": "inventory/evidence/ch2-attention/" + p.name,
        "unitId": doc["unitId"],
        "runAt": doc["runAt"],
    }]

    out = {
        "meta": {
            "episode": meta["episode"],
            "bookPages": meta["bookPages"],
            "tsBaseCommit": meta["tsBaseCommit"],
            "runAt": meta["runAt"],
            "command": meta["command"],
            "seed": meta["seed"],
            "checks": checks,
            "tests": {"attention": 32, "suites": 47, "asserts": 672},
            "evidence": ev_meta,
            "artifacts": summ["artifacts"],
        },
        "data": {
            "daily600519": {"rows": len(mt), "returns": len(mt) - 1, "first": mt[0]["date"], "last": mt[-1]["date"]},
            "daily000001": {"rows": len(pa), "returns": len(pa) - 1, "first": pa[0]["date"], "last": pa[-1]["date"]},
            "windows": {
                "copyTrain": summ["data"]["copy_train_windows"],
                "copyTest": summ["data"]["copy_test_windows"],
                "real600519": mt_n,
                "real000001": pa_n,
            },
        },
        "attn": {
            "softmax123": attn["softmax_123"],
            "rowsumDev": attn["softmax_rowsum_dev"],
            "shiftMaxdiff": attn["softmax_shift_maxdiff"],
            "naiveNaN": attn["softmax_naive_nan"],
            "entropyUniform": attn["entropy_uniform"],
            "entropyOne": attn["entropy_onehot"],
            "maskRowsumDev": attn["mask_rowsum_dev"],
            "permA": attn["permutation_A_maxdiff"],
            "permOut": attn["permutation_out_maxdiff"],
            "pe10": attn["pe_1_0"],
            "copyParams": attn["copy_param_count"],
            "copyInitialLoss": attn["copy_initial_loss"],
            "copyFinalLoss": attn["copy_final_loss"],
            "copyTestLoss": attn["copy_test_loss"],
            "copyDev": attn["copy_attention_dev"],
            "copyEntropy": attn["copy_attention_entropy"],
            "real600519": {"dev": mt_dev, "entropy": mt_ent, "loss": mt_loss},
            "real000001": {"dev": pa_dev, "entropy": pa_ent, "loss": pa_loss},
        },
        "hand": {
            "logitScaled": logit,
            "aDiag": a00,
            "aOff": a01,
            "out0": out0,
            "out1": out1,
            "dk2": 2,
            "t2": 2,
            "maskLogit": -1.0e30,
            "peRow0": pe_row0,
            "pe10": math.sin(1.0),
            "wqParams": dk * (dc + pe_dim),
            "wkParams": dk * (dc + pe_dim),
            "paramsExpr": "2 x 16 x 24 = 768",
        },
        "series": {
            "matrix": {"t": col(mat, "t"), "a": [[r["a%d" % j] for j in range(t)] for r in mat]},
            "softmax": {"i": col(soft, "i"), "z": col(soft, "z"), "stable": col(soft, "stable"), "naive": col(soft, "naive")},
            "loss": {"steps": col(loss, "steps"), "initial": col(loss, "initial"), "train": col(loss, "final")},
            "pe": {"rows": t, "cols": pe_dim, "v": [[r["c%d" % j] for j in range(pe_dim)] for r in pe]},
            "real": {
                "mt": {"window": col(mt_rows, "window"), "dev": col(mt_rows, "dev"), "entropy": col(mt_rows, "entropy"), "loss": col(mt_rows, "loss")},
                "pa": {"window": col(pa_rows, "window"), "dev": col(pa_rows, "dev"), "entropy": col(pa_rows, "entropy"), "loss": col(pa_rows, "loss")},
            },
        },
    }
    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(json.dumps(out, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
    print("wrote %s (%d bytes)" % (OUT, OUT.stat().st_size))
    print("softmax=%s a00=%.12f out=(%.12f, %.12f) params=%d" % (p1, a00, out0, out1, params))
    print("real600519 dev=%.6e ent=%.5f loss=%.6e n=%d" % (mt_dev, mt_ent, mt_loss, mt_n))
    print("real000001 dev=%.6e ent=%.5f loss=%.6e n=%d" % (pa_dev, pa_ent, pa_loss, pa_n))
    print("checks=%s evidence=%s stale=%s" % (checks, [e["unitId"] for e in ev_meta], stale))


if __name__ == "__main__":
    main()
