#!/usr/bin/env python3
"""派生第 8 集的数据包：只读 ts-base 的证据输出，不改任何原始数据。

输入：/root/ts-base/data/episodes/08-adf-shifting-transition/ 下的 summary.json + 9 份 CSV
输出：<pack>/data/adf.json（派生文件，不入库；film.json 的 derive/derived 记录它）

除此之外还做两件事，宁可在这里失败也不让画面带错数：
1. 用与 Haskell 相同的口径重算「常数序列 2/9」「完美周期 2/3」「等差 0.5」三个手算值，
   与 summary.json 对照，差超过 1e-12 就报错退出。
2. 数一下「按字面 τ<0.05 判平稳」会错判几次，画面上的说法由这个数决定。
"""
import json
import math
import pathlib
import statistics

ROOT = pathlib.Path(__file__).resolve().parents[1]
TSBASE = pathlib.Path("/root/ts-base/data/episodes/08-adf-shifting-transition")
OUT = ROOT / "data" / "adf.json"
EYE = pathlib.Path("/root/ts-base/inventory/evidence")


def read_csv(name):
    rows = []
    with open(TSBASE / name, encoding="utf-8") as f:
        head = f.readline().strip().split(",")
        for line in f:
            line = line.strip()
            if not line:
                continue
            parts = line.split(",")
            rows.append({k: (v if k in ("date", "window", "series") else float(v)) for k, v in zip(head, parts)})
    return rows


def symbolise(k, xs):
    lo, hi = min(xs), max(xs)
    if hi - lo <= 0:
        return [0] * len(xs)
    return [max(0, min(k - 1, math.floor(k * (x - lo) / (hi - lo)))) for x in xs]


def transition_matrix(k, xs, normalise=True):
    syms = symbolise(k, xs)
    counts = [[0] * k for _ in range(k)]
    for a, b in zip(syms, syms[1:]):
        counts[a][b] += 1
    m = [row[:] for row in counts]
    if normalise:
        for row in m:
            s = sum(row)
            if s > 0:
                for j in range(k):
                    row[j] /= s
    return counts, m


def transition_value(k, xs):
    _, m = transition_matrix(k, xs, True)
    col_vars = []
    for j in range(k):
        col = [m[i][j] for i in range(k)]
        mu = sum(col) / k
        col_vars.append(sum((v - mu) ** 2 for v in col) / k)
    return sum(col_vars), m


def shifting(m, xs):
    xs = sorted(xs)
    lo, hi = xs[0], xs[-1]
    if hi - lo <= 0:
        return None, []
    meds, lines = [], []
    for i in range(1, m + 1):
        s = lo + (i - 1) * (hi - lo) / m
        above = [x for x in xs if x > s]
        if not above:
            return None, lines
        meds.append(statistics.median(above))
        lines.append(s)
    lo2, hi2 = min(meds), max(meds)
    if hi2 - lo2 <= 0:
        return None, lines
    norm = [(v - lo2) / (hi2 - lo2) for v in meds]
    return statistics.median(norm), meds


def main():
    summary = json.loads((TSBASE / "summary.json").read_text(encoding="utf-8"))
    st = summary["stats"] if "stats" in summary else summary
    adf, sh, tr = st["adf"], st["shifting"], st["transition"]

    level = read_csv("adf_level.csv")
    diff = read_csv("adf_diff.csv")
    windows = read_csv("shifting_windows.csv")
    medians = read_csv("shifting_medians.csv")
    trans = read_csv("transition.csv")
    signs = read_csv("sign_returns.csv")
    white = read_csv("synth_white_noise.csv")
    walk = read_csv("synth_random_walk.csv")
    periodic = read_csv("synth_periodic.csv")
    constant = read_csv("synth_constant.csv")

    level_x = [r["close"] for r in level]
    diff_x = [r["dclose"] for r in diff]

    # --- 手算三例：与证据里的黄金值对照 ---
    const_x = [r["x"] for r in constant]
    per_x = [r["x"] for r in periodic]
    arith_x = [float(i + 1) for i in range(10)]

    const_val, const_m = transition_value(3, const_x)
    per_val, per_m = transition_value(3, per_x)
    arith_val, _ = shifting(9, arith_x)
    hand = {
        "constant": {"value": const_val, "matrix": const_m},
        "periodic": {"value": per_val, "matrix": per_m},
        "arith": {"value": arith_val, "series": arith_x},
    }
    assert abs(const_val - tr["constant"]) < 1e-12, (const_val, tr["constant"])
    assert abs(per_val - tr["periodic"]) < 1e-12, (per_val, tr["periodic"])
    assert abs(arith_val - sh["arith_1_10"]) < 1e-12, (arith_val, sh["arith_1_10"])

    # --- 字面读法会错判几次 ---
    taus = [
        ("茅台收盘价（水平）", adf["tau_level"], adf["level_stationary"]),
        ("随机游走", adf["tau_walk"], False),
        ("茅台收益率（差分）", adf["tau_diff"], adf["diff_stationary"]),
        ("白噪声", adf["tau_white"], True),
        ("随机游走的差分", adf["tau_walk_diff"], True),
        ("茅台带趋势", adf["tau_trend"], False),
        ("滞后八阶", adf["tau_lag8"], False),
    ]
    naive_wrong = sum(1 for _, tau, truth in taus if (tau < 0.05) != truth)
    naive_table = [{"name": n, "tau": t, "stationary": s, "naive": t < 0.05} for n, t, s in taus]

    win_series, med_series = {}, {}
    for w in ("w2013", "w2017", "last250", "rw250"):
        win_series[w] = [r["value"] for r in windows if r["window"] == w]
        rows = [r for r in medians if r["window"] == w]
        med_series[w] = {
            "i": [int(r["i"]) for r in rows],
            "s": [r["s"] for r in rows],
            "M": [r["M"] for r in rows],
            "norm": [r["norm"] for r in rows],
        }

    tr_series = {}
    for name in ("periodic", "white_noise", "sh600519_sign", "sz002456_sign"):
        rows = [r for r in trans if r["series"] == name]
        counts = [[0.0] * 3 for _ in range(3)]
        probs = [[0.0] * 3 for _ in range(3)]
        for r in rows:
            counts[int(r["from"])][int(r["to"])] = r["count"]
            probs[int(r["from"])][int(r["to"])] = r["prob"]
        tr_series[name] = {"counts": counts, "probs": probs}

    ev = sorted(str(p.relative_to(EYE)) for p in EYE.glob("ch2-*/20261031T*-ch2-*.json"))
    out = {
        "meta": {
            "episode": summary["meta"]["episode"],
            "bookPages": summary["meta"]["bookPages"],
            "tsBaseCommit": summary["meta"]["tsBaseCommit"],
            "tsAdminCommit": "bad962c",
            "evidenceRunAt": summary["meta"]["runAt"],
            "command": summary["meta"]["command"],
            "seed": summary["meta"]["seed"],
            "checks": st["checks"],
            "evidence": ev,
        },
        "data": {
            "daily600519": st["data"]["daily600519"],
            "daily002456": st["data"]["daily002456"],
        },
        "series": {
            "level": {"t": [int(r["t"]) for r in level], "close": level_x},
            "diff": {"t": [int(r["t"]) for r in diff], "dclose": diff_x},
            "whiteNoise": [r["x"] for r in white],
            "randomWalk": [r["x"] for r in walk],
            "periodic": per_x,
            "constant": const_x,
            "shifting": win_series,
            "shiftingMedians": med_series,
            "transition": tr_series,
            "signs": {
                "t": [int(r["t"]) for r in signs],
                "sh600519": [r["sh600519"] for r in signs],
                "sz002456": [r["sz002456"] for r in signs],
            },
        },
        "stats": {
            "adf": adf,
            "shifting": sh,
            "transition": tr,
            "hand": hand,
            "naive": {"wrong": naive_wrong, "rows": naive_table},
            "checks": st["checks"],
            "tests": {"adf": 30, "shifting": 11, "transition": 14, "suite": 605},
            "cost": {
                "n": len(level_x),
                "regressors": adf["lag_level"] + 3,
                "nobs": adf["nobs_level"],
                "qr": "Householder",
            },
        },
        "artifacts": {
            "adfLevel": "data/episodes/08-adf-shifting-transition/adf_level.csv",
            "adfDiff": "data/episodes/08-adf-shifting-transition/adf_diff.csv",
            "shiftingWindows": "data/episodes/08-adf-shifting-transition/shifting_windows.csv",
            "shiftingMedians": "data/episodes/08-adf-shifting-transition/shifting_medians.csv",
            "transition": "data/episodes/08-adf-shifting-transition/transition.csv",
            "signReturns": "data/episodes/08-adf-shifting-transition/sign_returns.csv",
        },
    }
    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(json.dumps(out, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
    print(f"wrote {OUT} ({OUT.stat().st_size} bytes)")
    print(f"checks={st['checks']} naive_wrong={naive_wrong} const={const_val:.6f} per={per_val:.6f} arith={arith_val:.6f}")


if __name__ == "__main__":
    main()
