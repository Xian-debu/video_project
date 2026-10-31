#!/usr/bin/env python3
"""把 ts-base 的 E14 证据汇总成片子用的 data/attn.json（派生文件，不入库）。

源：/root/ts-base/data/episodes/14-nonstationary-attention/
  summary.json                证据程序写出的判决与数字
  attn_bias_grid.csv          Delta 探针：a 从 -6 到 6
  attn_mean_synthetic.csv     合成数据 60x60 平均注意力矩阵
  attn_mean_real.csv          真实 A 股 60x60 平均注意力矩阵

所有断言不通过就直接退出，宁可 derive 失败也不让画面拿脏数据。
"""
import csv
import json
import os
import sys

SRC = "/root/ts-base/data/episodes/14-nonstationary-attention"
OUT = os.path.join(os.path.dirname(__file__), "..", "data", "attn.json")

def fail(msg):
    print("FAIL: " + msg, file=sys.stderr)
    sys.exit(1)

def close(a, b, tol=1e-9):
    return abs(a - b) <= tol * max(1.0, abs(a), abs(b))

def read_csv(path):
    with open(path, newline="", encoding="utf-8") as fh:
        return list(csv.reader(fh))

def block_mean(rows, k=2):
    """60x60 平均到 30x30：2x2 块取均值，画面上一格 2 个 token。"""
    n = len(rows)
    m = n // k
    out = []
    for i in range(m):
        line = []
        for j in range(m):
            s = 0.0
            for a in range(k):
                for b in range(k):
                    s += float(rows[i * k + a][j * k + b])
            line.append(s / (k * k))
        out.append(line)
    return out

def main():
    with open(os.path.join(SRC, "summary.json"), encoding="utf-8") as fh:
        s = json.load(fh)

    checks = s["checks"]
    if checks["total"] != 21 or checks["failed"] != 0:
        fail("checks: %r" % (checks,))
    if checks["data"] + checks["struct"] + checks["behavior"] != checks["total"]:
        fail("checks buckets do not add up: %r" % (checks,))

    d = s["data"]
    if (d["codes"], d["days"], d["rows"]) != (60, 60, 3600):
        fail("data shape: %r" % (d,))
    if d["csvBytes"] != 105540:
        fail("csvBytes: %r" % (d["csvBytes"],))

    syn = s["synthetic"]
    if syn["t"] != 60 or syn["seqs"] != 2000:
        fail("synthetic shape: %r" % (syn,))
    if not close(syn["entropy_std"], 3.3072996501, 1e-8):
        fail("entropy_std: %r" % (syn["entropy_std"],))
    if not close(syn["entropy_tau2"], 2.5682435891, 1e-8):
        fail("entropy_tau2: %r" % (syn["entropy_tau2"],))
    if not close(syn["late_mass_std"], 0.4821393513, 1e-8):
        fail("late_mass_std")
    if not close(syn["early_mass_std"], 0.2082718312, 1e-8):
        fail("early_mass_std")
    syn_mid = 1.0 - syn["early_mass_std"] - syn["late_mass_std"]
    if syn_mid <= 0.0:
        fail("derived mid mass")
    if not close(syn["score_spread_std"], 6.0983636232, 1e-8):
        fail("score_spread_std")

    real = s["real"]
    if (real["codes"], real["days"]) != (60, 60):
        fail("real shape")
    if not close(real["entropy"], 3.559154869, 1e-8):
        fail("real entropy")
    if not close(real["third_spread"], 0.036265607812, 1e-8):
        fail("real third_spread")
    if real["third_spread"] > 0.1:
        fail("real thirds are not balanced any more; the honest conclusion needs a rewrite")

    v = s["verdicts"]
    if v["tau1_std_maxdiff"] != 0.0 or v["tau2_temp_maxdiff"] != 0.0:
        fail("tau verdicts are no longer bit-exact: %r" % (v,))
    if v["row_grad_max"] != 0.0:
        fail("row bias gradient is no longer exactly zero: %r" % (v["row_grad_max"],))
    if v["row_raw_maxdiff"] > 1e-12:
        fail("rowBiasAttentionRaw drifted too far: %r" % (v["row_raw_maxdiff"],))
    if not (0.5 < v["column_grad_max"] < 0.8):
        fail("column_grad_max: %r" % (v["column_grad_max"],))
    if v["column_grad_sum_max"] > 1e-6:
        fail("column gradient does not sum to zero: %r" % (v["column_grad_sum_max"],))

    grid_rows = read_csv(os.path.join(SRC, "attn_bias_grid.csv"))
    if grid_rows[0] != ["a", "syn_entropy", "syn_early", "syn_late", "real_entropy", "real_early", "real_late"]:
        fail("grid header: %r" % (grid_rows[0],))
    grid = []
    for row in grid_rows[1:]:
        a = float(row[0])
        vals = [float(x) for x in row[1:]]
        grid.append({
            "a": a,
            "syn_entropy": vals[0],
            "syn_early": vals[1],
            "syn_late": vals[2],
            "real_entropy": vals[3],
            "real_early": vals[4],
            "real_late": vals[5],
        })
    if len(grid) != 13 or grid[0]["a"] != -6.0 or grid[-1]["a"] != 6.0:
        fail("grid is not a=-6..6: %r" % (len(grid),))
    zero = [g for g in grid if g["a"] == 0.0]
    if len(zero) != 1:
        fail("grid has no a=0 row")
    if not close(zero[0]["syn_entropy"], syn["entropy_std"], 5e-3):
        fail("a=0 synthetic entropy disagrees with summary")
    if not close(zero[0]["real_entropy"], real["entropy"], 1e-6):
        fail("a=0 real entropy disagrees with summary")
    probe = [g for g in grid if g["a"] == syn["probe_a"]][0]
    if not close(probe["syn_early"], syn["probe_early_mass"], 5e-3):
        fail("probe early mass disagrees with summary")
    if not close(probe["real_entropy"], real["probe_entropy"], 1e-6):
        fail("probe real entropy disagrees with summary")

    syn_mean = read_csv(os.path.join(SRC, "attn_mean_synthetic.csv"))
    real_mean = read_csv(os.path.join(SRC, "attn_mean_real.csv"))
    if len(syn_mean) != 60 or len(real_mean) != 60:
        fail("mean matrices are not 60x60")
    for name, rows in (("synthetic", syn_mean), ("real", real_mean)):
        for row in rows:
            total = sum(float(x) for x in row)
            if not (0.999 < total < 1.001):
                fail("%s mean matrix row does not sum to 1: %r" % (name, total))

    out = {
        "meta": {
            "episode": "14-nonstationary-attention",
            "bookPages": s["meta"]["bookPages"],
            "tsBaseCommit": s["meta"]["tsBaseCommit"],
            "runAt": s["meta"]["runAt"],
            "checks": checks,
            "tests": {"suites": 56, "asserts": 833, "nonstat": 15},
        },
        "data": d,
        "synthetic": {
            "t": syn["t"],
            "seqs": syn["seqs"],
            "sigma2Start": syn["sigma2Start"],
            "sigma2End": syn["sigma2End"],
            "entropy_std": syn["entropy_std"],
            "entropy_tau2": syn["entropy_tau2"],
            "early_mass": syn["early_mass_std"],
            "mid_mass": syn_mid,
            "late_mass": syn["late_mass_std"],
            "score_spread": syn["score_spread_std"],
            "probe_a": syn["probe_a"],
            "probe_entropy": syn["probe_entropy"],
            "probe_early_mass": syn["probe_early_mass"],
            "probe_late_mass": syn["probe_late_mass"],
        },
        "real": {
            "codes": real["codes"],
            "days": real["days"],
            "entropy": real["entropy"],
            "early_mass": real["early_mass"],
            "mid_mass": real["mid_mass"],
            "late_mass": real["late_mass"],
            "third_spread": real["third_spread"],
            "score_spread": real["score_spread"],
            "probe_a": real["probe_a"],
            "probe_entropy": real["probe_entropy"],
            "probe_early_mass": real["probe_early_mass"],
            "probe_late_mass": real["probe_late_mass"],
            "probe_entropy_delta": real["probe_entropy_delta"],
        },
        "verdicts": v,
        "grid": grid,
        "heat": {
            "synthetic": block_mean(syn_mean),
            "real": block_mean(real_mean),
        },
    }
    os.makedirs(os.path.dirname(OUT), exist_ok=True)
    with open(OUT, "w", encoding="utf-8") as fh:
        json.dump(out, fh, ensure_ascii=False, separators=(",", ":"))
    print("wrote %s (%d bytes)" % (os.path.normpath(OUT), os.path.getsize(OUT)))

if __name__ == "__main__":
    main()
