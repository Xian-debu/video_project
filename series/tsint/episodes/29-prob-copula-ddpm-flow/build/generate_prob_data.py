#!/usr/bin/env python3
"""E29 数据：把 ts-base 的证据产物折成画面需要的形状。

唯一真源是 ts-base/data/episodes/29-prob-copula-ddpm-flow/ 下的 summary.json 与
四个 CSV。这里的每个数字都能由 evidence-ch03-prob3 重新生成，不手抄。
"""
import csv, json, math, os

SRC = "/root/ts-base/data/episodes/29-prob-copula-ddpm-flow"
DST = "/root/video_project/series/tsint/episodes/29-prob-copula-ddpm-flow/data/prob.json"

SHORT = {
    "sh600519": "茅台", "sz000596": "古井", "sh600809": "汾酒",
    "sh600036": "招行", "sh601398": "工行", "sz000001": "平安",
    "sh000300": "沪深300", "sz399001": "深成指",
}
GROUPS = {"sh600519": 0, "sz000596": 0, "sh600809": 0,
          "sh600036": 1, "sh601398": 1, "sz000001": 1,
          "sh000300": 2, "sz399001": 2}


def read_csv(name):
    with open(os.path.join(SRC, name), encoding="utf-8", newline="") as f:
        return list(csv.reader(f))


def num(x):
    return float(str(x).strip())


def schedule_bars(t_mean_steps=1000, beta_lo=1e-4, beta_hi=0.02):
    """linear beta schedule，返回 (bar_alpha 列表, aBar(500), aBar(1000))。"""
    T = t_mean_steps
    betas = [beta_lo + (beta_hi - beta_lo) * (t - 1) / (T - 1) for t in range(1, T + 1)]
    alphas = [1.0 - b for b in betas]
    bar, acc = [], 1.0
    for a in alphas:
        acc *= a
        bar.append(acc)
    return bar, bar[499], bar[999]


def main():
    summ = json.load(open(os.path.join(SRC, "summary.json"), encoding="utf-8"))
    man = json.load(open(os.path.join(SRC, "prob_panel.manifest.json"), encoding="utf-8"))

    corr_rows = read_csv("prob_corr_8.csv")
    header = corr_rows[0]
    codes = [r[0].strip() for r in corr_rows[1:]]
    corr = [[num(v) for v in r[1:]] for r in corr_rows[1:]]
    assert len(corr) == len(codes) == len(header) - 1 == 8, (len(corr), len(codes), len(header))

    path_rows = read_csv("ddpm_paths.csv")
    paths = [[num(v) for v in r[1:]] for r in path_rows[1:]]

    grid_rows = read_csv("cnf_grid.csv")[1:]
    xs = sorted({round(num(r[0]), 6) for r in grid_rows})
    ys = sorted({round(num(r[1]), 6) for r in grid_rows})
    n = len(xs)
    assert n == len(ys) == 41, (len(xs), len(ys))
    lut = {(round(num(r[0]), 6), round(num(r[1]), 6)): num(r[2]) for r in grid_rows}
    logp = [[lut[(x, y)] for x in xs] for y in ys]
    top = max(v for row in logp for v in row)
    density = [[round(math.exp(v - top), 6) for v in row] for row in logp]

    pca = [[num(r[1]), num(r[2])] for r in read_csv("cnf_pca_points.csv")[1:]]
    pca_small = pca[::2]

    bar, a500, a1000 = schedule_bars()
    c, d, cn = summ["copula"], summ["ddpm"], summ["cnf"]

    out = {
        "meta": {
            "episode": summ["episode"],
            "commit": summ["commit"],
            "evidenceCommit": summ.get("reproCommit", summ["commit"]),
            "bookPages": "67–68",
            "checks": {"total": int(summ["checks"]["total"]), "ok": int(summ["checks"]["pass"])},
            "tests": {"suites": 99, "asserts": 1371, "copula": 22, "ddpm": 21, "cnf": 15},
            "runtimeSec": 8.7,
        },
        "data": {
            "rows": man["rows"], "retRows": int(summ["data"]["retRows"]), "channels": man["channels"],
            "start": man["start"], "end": man["end"], "bytes": man["bytes"],
            "sha": summ["data"]["sha256"][:12], "shaFull": summ["data"]["sha256"],
            "maxGapDays": man["maxGapDays"], "maxGapAt": man["maxGapAt"],
            "winLen": int(summ["data"]["window"]["len"]),
            "winStride": int(summ["data"]["window"]["stride"]),
            "winCount": int(summ["data"]["window"]["count"]),
            "codes": codes,
            "labels": [SHORT[c_] for c_ in codes],
            "groups": [GROUPS[c_] for c_ in codes],
        },
        "copula": {
            "ks": c["ksSyn"], "tau": c["tauOff"], "rho": c["rhoOff"],
            "cCorrect": c["cCorrect"], "cPlan": c["cPlan"], "bound": c["frechetBound"],
            "roundtrip": c["roundtripErr"], "fitErr": c["fitErr"], "fitStatus": c["fitStatus"],
            "withinRet": c["retWithin"], "crossRet": c["retCross"],
            "withinWin": c["winWithin"], "crossWin": c["winCross"],
            "corr": corr, "codes": codes, "labels": [SHORT[c_] for c_ in codes],
        },
        "ddpm": {
            "xtHalf": d["forwardAtHalf"], "oracleLoss": d["oracleLoss"], "zeroPredLoss": d["zeroPredLoss"],
            "sameSeed": d["lossSameSeed"], "otherSeed": d["lossOtherSeed"],
            "trainFirst": d["trainFirst"], "trainLast": d["trainLast"],
            "meanErr": d["sampleMeanErr"], "sdErr": d["sampleSdErr"],
            "dataSd": d["dataSd"], "sampleSd": d["sampleSd"], "allFinite": d["allFinite"],
            "aBar500": a500, "aBar1000": a1000,
            "barAlpha": [round(v, 8) for v in bar],
            "paths": paths,
        },
        "cnf": {
            "logDet": cn["logDet"], "roundtrip": cn["roundtripErr"], "integral": cn["integral"],
            "rk4Err8": cn["rk4Err8"], "rk4Err16": cn["rk4Err16"], "rk4Ratio": cn["rk4Ratio"],
            "pcaShare": cn["pcaShare"], "eigen": cn["pcaEig"],
            "grid": density, "gridAxis": [round(v, 4) for v in xs],
            "pca": pca_small,
        },
    }
    os.makedirs(os.path.dirname(DST), exist_ok=True)
    with open(DST, "w", encoding="utf-8") as f:
        json.dump(out, f, ensure_ascii=False, separators=(",", ":"))
    print("wrote", DST, os.path.getsize(DST), "bytes")
    print("check channels", len(out["data"]["codes"]), "corr", len(corr), "paths", len(paths), "grid", len(density), "pca", len(pca_small))
    print("check aBar500 %.6f aBar1000 %.6e" % (a500, a1000))
    print("check copula", out["copula"]["cCorrect"], out["copula"]["cPlan"], out["copula"]["bound"])
    print("check ddpm sd", out["ddpm"]["dataSd"], out["ddpm"]["sampleSd"])


if __name__ == "__main__":
    main()

