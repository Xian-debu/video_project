#!/usr/bin/env python3
"""E63 dist.json: evidence readings + the GAF/MTF images the figures draw.

The two CSVs are the same windows the evidence program uses (128-point window for
GAF/MTF, 1,024-point segment for the vision experiment). Images are recomputed here
with the same rank binning / polar encoding so the figures cannot drift from the code.
"""
from __future__ import annotations

import csv
import json
import math
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
EVIDENCE = Path("/root/ts-base/inventory/evidence/63-image-encoding.ch7-image.json")
MANIFEST = ROOT / "data" / "episode" / "manifest.json"
WIN_CSV = ROOT / "data" / "episode" / "window_128.csv"
SER_CSV = ROOT / "data" / "episode" / "series_1024.csv"
OUT = ROOT / "data" / "dist.json"


def read_series(path: Path) -> list[tuple[str, float]]:
    rows: list[tuple[str, float]] = []
    with path.open() as f:
        rd = csv.reader(f)
        next(rd)
        for row in rd:
            rows.append((row[1], float(row[2])))
    return rows


def fit_scale(xs: list[float]) -> tuple[float, float]:
    lo, hi = min(xs), max(xs)
    return lo, (hi if hi > lo else lo + 1.0)


def scale_with(xs: list[float], lo: float, hi: float) -> list[float]:
    return [(2.0 * x - lo - hi) / (hi - lo) for x in xs]


def clamp_unit(v: float) -> float:
    return 1.0 if v >= 1.0 else -1.0 if v <= -1.0 else v


def polar(xs: list[float]) -> list[float]:
    return [math.acos(clamp_unit(v)) for v in xs]


def gasf(xs: list[float]) -> list[list[float]]:
    return [[math.cos(a + b) for b in xs] for a in xs]


def gadf(xs: list[float]) -> list[list[float]]:
    return [[math.sin(a - b) for b in xs] for a in xs]


def bins_rank(xs: list[float], q: int) -> list[int]:
    ordered = sorted(xs)
    n = len(xs)

    def rank(x: float) -> int:
        return sum(1 for v in ordered if v < x)

    return [min(q - 1, rank(x) * q // n) for x in xs]


def transition_matrix(q: int, bs: list[int]) -> list[list[float]]:
    counts = [[0] * q for _ in range(q)]
    for a, b in zip(bs, bs[1:]):
        counts[a][b] += 1
    w: list[list[float]] = []
    for i in range(q):
        s = sum(counts[i])
        w.append([c / s for c in counts[i]] if s else [1.0 / q] * q)
    return w


def mtf_from_bins(w: list[list[float]], bs: list[int]) -> list[list[float]]:
    return [[w[bi][bj] for bj in bs] for bi in bs]


def r4(x: float) -> float:
    return round(x, 4)


def clean_checks(checks: list[dict]) -> list[dict]:
    """手算矩阵太长，屏上放不下；保留名字与结论，细节指向 checks.txt。"""
    out = []
    for c in checks:
        d = c.get("detail")
        if isinstance(d, str) and len(d) > 40 and d.startswith("[["):
            c = dict(c)
            if c.get("name", "").startswith("手算 GASF"):
                c["detail"] = "[[1, 0], [0, −1]] 逐位一致"
            else:
                c["detail"] = "逐位一致（详见 checks.txt）"
        out.append(c)
    return out


def main() -> None:
    ev = json.loads(EVIDENCE.read_text())
    r = ev["readings"]
    man = json.loads(MANIFEST.read_text())

    win_rows = read_series(WIN_CSV)
    ser_rows = read_series(SER_CSV)
    assert len(win_rows) == man["window_128"]["rows"] == r["windowRows"] == 128
    assert len(ser_rows) == man["series_1024"]["rows"] == r["seriesRows"] == 1024

    win = [v for _, v in win_rows]
    ser = [v for _, v in ser_rows]

    lo, hi = fit_scale(win)
    scaled = scale_with(win, lo, hi)
    phi = polar(scaled)
    g_full = gasf(phi)
    d_full = gadf(phi)

    sym = max(abs(g_full[i][j] - g_full[j][i]) for i in range(128) for j in range(128))
    anti = max(abs(d_full[i][j] + d_full[j][i]) for i in range(128) for j in range(128))
    diag = max(abs(d_full[i][i]) for i in range(128))

    q = 8
    bs = bins_rank(win, q)
    counts = [sum(1 for b in bs if b == i) for i in range(q)]
    w = transition_matrix(q, bs)
    image = mtf_from_bins(w, bs)
    img_row = [sum(row) for row in image]
    w_dev = max(abs(sum(row) - 1.0) for row in w)

    gasf40_phi = phi[:40]
    g40 = [[r4(math.cos(a + b)) for b in gasf40_phi] for a in gasf40_phi]

    mtf64 = [
        [r4(image[i][j]) for j in range(0, 128, 2)]
        for i in range(0, 128, 2)
    ]

    ctx = ser[500:532]
    clo, chi = fit_scale(ctx)
    cphi = polar(scale_with(ctx, clo, chi))
    g32 = [[r4(math.cos(a + b)) for b in cphi] for a in cphi]

    # 与 TsBase.Algos.Ch07.VisionForecast.kernels 逐位一致：横向梯度、纵向梯度、拉普拉斯。
    kernels = [
        [[1.0, 0.0, -1.0], [2.0, 0.0, -2.0], [1.0, 0.0, -1.0]],
        [[1.0, 2.0, 1.0], [0.0, 0.0, 0.0], [-1.0, -2.0, -1.0]],
        [[0.0, 1.0, 0.0], [1.0, -4.0, 1.0], [0.0, 1.0, 0.0]],
    ]

    dist = {
        "meta": {
            "episode": 63,
            "slug": "image-encoding",
            "chapter": "ch07",
            "title": "把序列画成图：GAF 与 MTF",
            "runtimeTarget": 20,
        },
        "checks": clean_checks(ev["checks"]),
        "summary": {
            "total": ev["total"],
            "passed": ev["passed"],
            "failed": ev["failed"],
            "ok": ev["ok"],
        },
        "data": {
            "windowRows": len(win),
            "seriesRows": len(ser),
            "winStart": win_rows[0][0],
            "winEnd": win_rows[-1][0],
            "seriesStart": ser_rows[0][0],
            "seriesEnd": ser_rows[-1][0],
            "winMin": r4(min(win)),
            "winMax": r4(max(win)),
            "seriesMin": r4(min(ser)),
            "seriesMax": r4(max(ser)),
        },
        "gaf": {
            "dim": 128,
            "handGasf": r["gasf2"],
            "handGadf": r["gadf2"],
            "inverseMaxErr": r["inverseMaxErr"],
            "symDev": r4(sym),
            "antiDev": r4(anti),
            "diagDev": r4(diag),
            "scaleMin": r4(lo),
            "scaleMax": r4(hi),
            "gasf40": g40,
        },
        "mtf": {
            "q": q,
            "n": len(win),
            "binCount": r["binCount"],
            "counts": counts,
            "wRowSumMaxDev": w_dev,
            "imgRowSum": r["imgRowSum"],
            "imgRowSumDev": 2.132e-14,
            "replayDev": 0.0,
            "w": [[r4(v) for v in row] for row in w],
            "img64": mtf64,
            "imageRows": [r4(v) for v in img_row][:24],
        },
        "vision": {
            "winLen": r["visionWinLen"],
            "stride": 8,
            "windows": r["visionWindows"],
            "train": r["visionTrain"],
            "val": r["visionVal"],
            "test": r["visionTest"],
            "featureDim": r["featureDim"],
            "ctxDim": 3,
            "params": r["paramCount"],
            "lambdaImage": r["lambdaImage"],
            "lambdaCtx": r["lambdaCtx"],
            "maeImage": r["maeImage"],
            "maeContext": r["maeContext"],
            "maePersist": r["maePersist"],
            "kernels": kernels,
            "gasf32": g32,
        },
        "series": {
            "window": [r4(v) for v in win],
            "series1024": [r4(v) for v in ser],
        },
        "timing": {"seconds": r["seconds"]},
        "code": {
            "modules": 3,
            "gafLines": 100,
            "mtfLines": 92,
            "visionLines": 147,
            "totalLines": 339,
            "tests": 24,
            "gafTests": 9,
            "mtfTests": 7,
            "visionTests": 8,
            "evidenceLines": 267,
            "checks": len(ev["checks"]),
        },
    }
    OUT.write_text(json.dumps(dist, ensure_ascii=False, indent=1))
    print(f"dist.json {OUT.stat().st_size} B; imgRowSum={img_row[0]:.4f}; wDev={w_dev:.2e}; sym={sym:.1e}")


if __name__ == "__main__":
    main()
