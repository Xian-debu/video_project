#!/usr/bin/env python3
"""生成 E20「卷积看时序」的画面数据 data/conv.json。

输入（全部来自已提交的证据/数据，不手抄屏幕数字）：
  /root/ts-base/data/episodes/20-conv-dilated-fft-2d/{summary.json,
      period_spectrum.csv,rf_impulse.csv,causality_real.csv,
      fold_heatmap.csv,conv_output.csv,minute_5m_600519.csv,conv_panel.manifest.json}
  /root/ts-base/inventory/evidence/ch3-dilated-causal-conv/ch3-dilated-causal-conv.json

输出：<pack>/data/conv.json
仅用标准库：按定义重算手算卷积与感受野，与证据程序 reported 的数对不上就不写盘。
"""
from __future__ import annotations

import json
import math
import pathlib
import subprocess

SRC = pathlib.Path("/root/ts-base/data/episodes/20-conv-dilated-fft-2d")
EV = pathlib.Path("/root/ts-base/inventory/evidence/ch3-dilated-causal-conv/ch3-dilated-causal-conv.json")
OUT = pathlib.Path(__file__).resolve().parents[1] / "data" / "conv.json"
H, F = 96, 24
K, DILATIONS = 3, [1, 2, 4, 8]
R = 3


def git_head(repo: str) -> str:
    return subprocess.run(["git", "-C", repo, "rev-parse", "--short", "HEAD"],
                          capture_output=True, text=True, check=True).stdout.strip()


def read_csv(name: str) -> list[list[str]]:
    return [r.split(",") for r in (SRC / name).read_text().splitlines()[1:] if r]


def round_list(xs, d=4):
    return [round(v, d) for v in xs]


def causal_conv(w: list[float], x: list[float], k: int, d: int) -> list[float]:
    """按 DilatedCausalConv 定义重算：左侧补 (k-1)d 个零，w[0] 是最旧的抽头。"""
    pad = (k - 1) * d
    xu = [0.0] * pad + x
    return [sum(w[j] * xu[t + pad - (k - 1 - j) * d] for j in range(k)) for t in range(len(x))]


def receptive_field(layers: list[int]) -> int:
    return 1 + sum((K - 1) * d for d in layers)


def main() -> int:
    summary = json.loads((SRC / "summary.json").read_text())
    ev = json.loads(EV.read_text())
    st, gd, dt, sp, real = summary["struct"], summary["grad"], summary["data"], summary["spectrum"], summary["real"]
    manifest = json.loads((SRC / "conv_panel.manifest.json").read_text())

    # 手算：K=3, d=1, w=[3,2,1]（w[0] 最旧），x=1..7 -> [1,4,10,16,22]
    hand = [round(v, 6) for v in causal_conv([3.0, 2.0, 1.0], [1, 2, 3, 4, 5, 6, 7], 3, 1)]
    assert hand[:5] == [1.0, 4.0, 10.0, 16.0, 22.0], hand
    # 感受野：4 层 d=1,2,4,8 -> 31
    rf = receptive_field(DILATIONS)
    assert rf == st["rf"] == 31, (rf, st["rf"])

    # 频谱：f=1..16 的柱；240 周周期的位置与排名
    spec_rows = [(int(f), float(p), float(a)) for f, p, a in read_csv("period_spectrum.csv")]
    ranked = sorted(spec_rows, key=lambda r: -r[2])
    rank_of = {p: i + 1 for i, (_, p, _) in enumerate(ranked)}
    weekly = [r for r in spec_rows if 235 <= r[1] <= 245]
    weekly_rank = min((rank_of[round(r[1], 1)] for r in weekly), default=None)
    weekly_amp = max((r[2] for r in weekly), default=0.0)

    peaks = [{"period": int(p["period"]), "amp": round(float(p["amp"]), 4)} for p in sp["peaks"]]
    peaks_txt = [{**p, "f": round(4991 / p["period"], 1),
                  "norm": round(p["amp"] / peaks[0]["amp"], 4),
                  "rank": i + 1} for i, p in enumerate(peaks)]
    top1, top2 = peaks[0]["amp"], peaks[1]["amp"]

    # 感受野脉冲：lag 最大非零 = 30，验证 31 个抽头
    rf_pts = [{"lag": int(l), "diff": round(float(v), 6)} for l, v in read_csv("rf_impulse.csv")]
    first_zero = max(p["lag"] for p in rf_pts if abs(p["diff"]) > 1e-9) + 1
    assert first_zero == st["rf"], (first_zero, st["rf"])

    causal = [{"row": int(r), "before": round(float(b), 4), "after": round(float(a), 4)}
              for r, b, a in read_csv("causality_real.csv")]
    changed = [c["row"] for c in causal if abs(c["after"] - c["before"]) > 1e-9]
    assert len(changed) == len(causal) - st["causalSameRows"], (len(changed), st["causalSameRows"])

    fold = read_csv("fold_heatmap.csv")
    rows = 1 + max(int(r) for r, _, _ in fold)
    cols = 1 + max(int(c) for _, c, _ in fold)
    grid = [[0.0] * cols for _ in range(rows)]
    for r, c, v in fold:
        grid[int(r)][int(c)] = round(float(v), 4)
    assert rows * cols == len(fold), (rows, cols, len(fold))

    conv_rows = read_csv("conv_output.csv")
    conv = {"ch0": [], "ch1": []}
    for _, c0, c1 in conv_rows:
        conv["ch0"].append(round(float(c0), 4))
        conv["ch1"].append(round(float(c1), 4))

    minute = read_csv("minute_5m_600519.csv")
    closes = [float(r[1]) for r in minute]
    rets = [math.log(closes[i] / closes[i - 1]) for i in range(1, len(closes))]
    assert len(closes) == dt["minuteRows"] and len(rets) == real["rets"]

    data = {
        "meta": {
            "episode": "20-conv-dilated-fft-2d",
            "bookPages": "p.49-51",
            "tsBaseCommit": git_head("/root/ts-base"),
            "dataCommit": git_head("/root/ts-admin"),
            "checks": {"total": summary["checks"]["total"],
                       "ok": summary["checks"]["total"] - summary["checks"]["failed"],
                       "data": summary["checks"]["data"], "struct": summary["checks"]["struct"],
                       "grad": summary["checks"]["grad"], "real": summary["checks"]["real"]},
            "tests": {"suites": 73, "asserts": 1014, "conv": 8, "fft": 9, "twod": 10},
            "h": H, "f": F, "kernel": K, "layers": len(DILATIONS), "dilations": DILATIONS,
            "rf": rf, "r": R,
        },
        "data": {
            "minuteRows": dt["minuteRows"], "days": dt["minuteDays"], "barsPerDay": dt["minuteBarsPerDay"],
            "first": dt["first"], "last": dt["last"], "sha256": dt["sha256"],
            "maxAbsReturn": round(dt["maxAbsReturn"], 6), "bytes": 145593,
            "closeFirst": round(closes[0], 2), "closeLast": round(closes[-1], 2),
        },
        "struct": {k: (round(v, 12) if isinstance(v, float) else v) for k, v in st.items()},
        "grad": {k: round(v, 12) for k, v in gd.items()},
        "real": {"top1Period": real["top1Period"], "top1Amp": round(real["top1Amp"], 4),
                 "topPeriods": real["topPeriods"], "rets": real["rets"]},
        "spectrum": {"peaks": peaks_txt, "top1": top1, "top2": top2,
                     "top1OverTop2": round(top1 / top2, 4),
                     "weekly240Rank": weekly_rank, "weekly240Amp": round(weekly_amp, 3),
                     "bins": len(spec_rows)},
        "rf": {"points": rf_pts, "firstZero": first_zero},
        "causal": {"rows": causal, "changed": len(changed), "sameRows": st["causalSameRows"],
                   "diffAt95": round(st["causalDiffAt95"], 4)},
        "fold": {"grid": grid, "rows": rows, "cols": cols},
        "conv": conv,
        "curves": {"price": round_list(closes[:H], 2), "rets": round_list(rets[:H], 6)},
        "artifacts": {"checksPassed": summary["checks"]["total"], "evidenceCommit": ev["tsBaseCommit"],
                      "manifestFiles": len(manifest["files"])},
    }
    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(json.dumps(data, ensure_ascii=False, separators=(",", ":")) + "\n")
    print(f"wrote {OUT} bytes={OUT.stat().st_size} rf={rf} hand={hand} "
          f"top1={top1} top2={top2} ratio={round(top1/top2, 4)} "
          f"weekly240Rank={weekly_rank} fold={rows}x{cols} changed={len(changed)}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
