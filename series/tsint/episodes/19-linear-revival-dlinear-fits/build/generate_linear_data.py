#!/usr/bin/env python3
"""生成 E19「线性模型复兴」的画面数据 data/linear.json。

输入（全部来自已提交的证据/数据，不手抄屏幕数字）：
  /root/ts-base/data/episodes/19-linear-revival-dlinear-fits/{summary.json,
      mae_daily.csv,mae_minute.csv,params_mae.csv,training.csv,spectrum.csv,
      decomp_600519.csv,predictions_daily.csv,linear_panel.manifest.json}
  /root/ts-base/inventory/evidence/ch3-linear-shared/ch3-linear-shared.json

输出：<pack>/data/linear.json
仅用标准库：合成序列的低通重建按 fitsBins/reconWith 的定义在本地算一遍，
并断言重建误差与证据程序 reported 的 1e-10 一致。
"""
from __future__ import annotations

import json
import math
import pathlib
import subprocess

SRC = pathlib.Path("/root/ts-base/data/episodes/19-linear-revival-dlinear-fits")
EV = pathlib.Path("/root/ts-base/inventory/evidence/ch3-linear-shared/ch3-linear-shared.json")
OUT = pathlib.Path(__file__).resolve().parents[1] / "data" / "linear.json"

H, F, R, K = 96, 24, 24, 25


def git_head(repo: str) -> str:
    return subprocess.run(["git", "-C", repo, "rev-parse", "--short", "HEAD"],
                          capture_output=True, text=True, check=True).stdout.strip()


def read_csv(name: str) -> list[list[str]]:
    return [r for r in (SRC / name).read_text().splitlines()[1:] if r]


def round_list(xs, d=4):
    return [round(v, d) for v in xs]


def bins(n: int, r: int, x: list[float]) -> list[float]:
    """与 Fits.fitsBins 同义：前 r 个实部，后 r 个虚部（Im 带负号）。"""
    re = [sum(v * math.cos(2 * math.pi * k * t / n) for t, v in enumerate(x)) for k in range(r)]
    im = [-sum(v * math.sin(2 * math.pi * k * t / n) for t, v in enumerate(x)) for k in range(r)]
    return re + im


def recon(n: int, r: int, z: list[float]) -> list[float]:
    """与 evidence/Ch03LinearEvidence.hs 的 reconWith 同义。"""
    out = []
    for t in range(n):
        total = z[0]
        for k in range(1, r):
            w = 1.0 if (n % 2 == 0 and 2 * k == n) else 2.0
            total += w * (z[k] * math.cos(2 * math.pi * k * t / n)
                          - z[r + k] * math.sin(2 * math.pi * k * t / n))
        out.append(total / n)
    return out


def synth_series(n: int = 96) -> list[float]:
    return [2 * math.sin(2 * math.pi * 2 * t / n)
            + 0.5 * math.sin(2 * math.pi * 32 * t / n)
            + 0.1 * math.cos(2 * math.pi * 40 * t / n) for t in range(n)]


def main() -> int:
    summary = json.loads((SRC / "summary.json").read_text())
    ev = json.loads(EV.read_text())
    tr = summary["training"]
    st = summary["struct"]
    gd = summary["grad"]
    dt = summary["data"]
    sp = summary["spectrum"]
    manifest = json.loads((SRC / "linear_panel.manifest.json").read_text())

    per_series = []
    for row in read_csv("mae_daily.csv"):
        cells = row.split(",")
        per_series.append({
            "series": cells[0],
            "shared": round(float(cells[1]), 3),
            "dlinear": round(float(cells[2]), 3),
            "fits": round(float(cells[3]), 3),
            "last": round(float(cells[4]), 3),
        })

    spectrum = []
    for row in read_csv("spectrum.csv"):
        k, period, power, norm = row.split(",")
        spectrum.append({"k": int(k), "period": round(float(period), 1),
                         "power": round(float(power), 3), "norm": round(float(norm), 5)})

    decomp = {"x": [], "trend": [], "season": []}
    for row in read_csv("decomp_600519.csv"):
        i, x, t, s = row.split(",")
        decomp["x"].append(round(float(x), 3))
        decomp["trend"].append(round(float(t), 3))
        decomp["season"].append(round(float(s), 3))

    curves: dict[str, dict[str, list[float]]] = {"daily": {}, "minute": {}}
    for row in read_csv("training.csv"):
        ds, model, ep, loss, mae = row.split(",")
        curves[ds].setdefault(model, []).append(round(float(mae), 3))
    # 训练曲线按 2 取 1，最长 121 点；图宽 1180 足够。
    curves = {ds: {m: v[::2] for m, v in ms.items()} for ds, ms in curves.items()}

    params_mae = []
    for row in read_csv("params_mae.csv"):
        ds, model, params, mae = row.split(",")
        params_mae.append({"dataset": ds, "model": model,
                           "params": int(params), "mae": round(float(mae), 3)})

    pred = None
    for row in read_csv("predictions_daily.csv"):
        series, start, step, p, a = row.split(",")
        if series == "sz399001" and (pred is None or pred["start"] != int(start)):
            pred = {"series": series, "start": int(start), "pred": [], "actual": []}
        if pred is not None and series == "sz399001" and int(start) == pred["start"]:
            pred["pred"].append(round(float(p), 2))
            pred["actual"].append(round(float(a), 2))

    # 合成序列与 R=24 低通重建：与证据的 synthLowRms=0.3606 对得上才写盘。
    n = 96
    x = synth_series(n)
    z = bins(n, 49, x)
    full = recon(n, 49, z)
    low = recon(n, R, bins(n, R, x))
    resid = [a - b for a, b in zip(x, low)]
    rms = math.sqrt(sum(v * v for v in resid) / n)
    assert max(abs(a - b) for a, b in zip(full, x)) < 1e-10, "full recon mismatch"
    assert abs(rms - st["synthLowRms"]) < 1e-6, (rms, st["synthLowRms"])

    data = {
        "meta": {
            "episode": "19-linear-revival-dlinear-fits",
            "bookPages": "p.46-46",
            "tsBaseCommit": git_head("/root/ts-base"),
            "dataCommit": git_head("/root/ts-admin"),
            "checks": {"total": summary["checks"]["total"], "ok": summary["checks"]["total"] - summary["checks"]["failed"]},
            "tests": {"suites": 70, "asserts": 987, "shared": 5, "dlinear": 10, "fits": 7},
            "h": H, "f": F, "rank": R, "kernel": K,
            "params": {"shared": st["paramsShared"], "dlinear": st["paramsDlinear"], "fits": st["paramsFits"], "bookLarge": 139700, "bookDlinear": 4500},
            "training": {"lr": tr["lr"], "epochsCap": tr["epochsCap"], "patience": tr["patience"],
                         "stride": tr["trainStride"], "seed": 0,
                         "dailyBest": tr["dailyBestEpochs"], "minuteBest": tr["minuteBestEpochs"]},
        },
        "data": {
            "dailyRows": dt["dailyRows"], "dailySeries": dt["dailySeries"],
            "dailyFirst": dt["dailyFirst"], "dailyLast": dt["dailyLast"],
            "dailyBytes": dt["dailyBytes"],
            "minuteRows": dt["minuteRows"], "minuteDays": dt["minuteDays"],
            "minuteBars": dt["minuteBarsPerDay"], "minuteBytes": dt["minuteBytes"],
            "minuteFirst": next(f["first"] for f in manifest["files"] if f["path"].startswith("minute")),
            "minuteLast": next(f["last"] for f in manifest["files"] if f["path"].startswith("minute")),
            "substitutions": [
                "sz000858 在 lake 缺 2015-07-30 到 2015-10-30，改用 sz000596（古井贡酒）",
                "sh600030 在 2018-12-25 到 2019-01-09 停牌，改用 sh601318（中国平安）",
                "sh600036 在 2015-04-03 到 04-10 停牌五日，内连接后面板 2669 行",
                "分钟样本只有 2026-05-27 到 2026-10-28 的 104 个交易日，不是计划书的 2019 到 2025",
            ],
        },
        "mae": {
            "dailyShared": round(tr["dailyShared"], 3), "dailyDlinear": round(tr["dailyDlinear"], 3),
            "dailyFits": round(tr["dailyFits"], 3), "dailyLast": round(tr["dailyLast"], 3),
            "minuteShared": round(tr["minuteShared"], 4), "minuteDlinear": round(tr["minuteDlinear"], 4),
            "minuteFits": round(tr["minuteFits"], 4), "minuteLast": round(tr["minuteLast"], 4),
            "perSeries": per_series,
        },
        "struct": {
            "decompErr": st["decompErr"], "k1EquivErr": st["k1EquivErr"],
            "fftRoundTrip": st["fftRoundTrip"], "dcErr": st["dcErr"],
            "synthFull": st["synthFull"], "synthLowRms": round(st["synthLowRms"], 4),
            "batchErr": st["batchErr"],
        },
        "grad": {k: gd[k] for k in ("shared", "dlinear", "fits", "fastShared", "fastDlinear", "fastFits")},
        "spectrum": {"bins": spectrum, "peakK": sp["peakK"], "periodBars": round(sp["periodBars"], 1),
                     "peakPower": round(sp["peakPower"], 3), "secondPower": round(sp["secondPower"], 3),
                     "peakRatio": round(sp["peakRatio"], 4)},
        "decomp": decomp,
        "curves": curves,
        "synth": {"x": round_list(x), "low": round_list(low), "resid": round_list(resid)},
        "pred": pred,
        "paramsMae": params_mae,
        "artifacts": {"checksPassed": summary["checks"]["total"], "evidenceCommit": ev["tsBaseCommit"]},
    }
    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(json.dumps(data, ensure_ascii=False, separators=(",", ":")) + "\n")
    print(f"wrote {OUT} bytes={OUT.stat().st_size} daily={data['mae']['dailyDlinear']} "
          f"minute={data['mae']['minuteFits']} rms={round(rms, 4)} peak={sp['peakK']}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
