#!/usr/bin/env python3
"""Generate data/dist.json for episode 64 from the evidence JSON + episode CSVs."""
import csv
import json
import math
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
EV = Path("/root/ts-base/inventory/evidence/64-llm-side-adapters.ch7-adapters.json")
SERIES = ROOT / "data/episode/series_000001.csv"
WORDS = ROOT / "data/episode/word_vectors.csv"
OUT = ROOT / "data/dist.json"

ev = json.loads(EV.read_text())
r = ev["readings"]

closes = []
dates = []
with SERIES.open(newline="") as fh:
    rd = csv.DictReader(fh)
    cols = rd.fieldnames
    dcol = cols[0]
    ccol = cols[1]
    for row in rd:
        dates.append(row[dcol])
        closes.append(float(row[ccol]))

# 收益口径与证据程序一致：100 * ln(c_t / c_{t-1})
rets = [100.0 * math.log(closes[i] / closes[i - 1]) for i in range(1, len(closes))]

# 20 维目标：未来 1..20 天累计对数平均绝对收益，取若干窗口求均值
def vol_at(t, j):
    m = sum(abs(rets[t + k]) for k in range(1, j + 1)) / j
    return math.log(max(1e-6, m))

vol_mean = []
vol_one = []
for j in range(1, 21):
    vals = [vol_at(t, j) for t in range(4000, 4200)]
    vol_mean.append(sum(vals) / len(vals))
    vol_one.append(vol_at(5200, j))

# 词表：64 x 64，按 CSV 六位小数给出
words = []
names = []
with WORDS.open(newline="") as fh:
    rd = csv.DictReader(fh)
    cols = rd.fieldnames[1:]
    for row in rd:
        names.append(row["word"])
        words.append([float(row[c]) for c in cols])

# Gram 矩阵（正交性可视化）
def dot(a, b):
    return sum(x * y for x, y in zip(a, b))

gram = [[round(dot(a, b), 4) for b in words] for a in words]

checks = [{"group": c["group"], "name": c["name"], "ok": c["ok"], "detail": c.get("detail", "")} for c in ev["checks"]]

# 长 detail 截断（避免溢出卡片）
for c in checks:
    if len(c["detail"]) > 90:
        c["detail"] = c["detail"][:88] + "…"

dist = {
    "meta": {
        "episode": 64,
        "slug": "tsint-64-llm-side-adapters",
        "chapter": "ch07",
        "title": "只训练 0.1% 的参数",
        "runtimeTarget": 16,
    },
    "checks": checks,
    "summary": {"total": ev["total"], "passed": ev["passed"], "failed": ev["failed"], "ok": ev["ok"]},
    "data": {
        "seriesRows": r["seriesRows"],
        "returns": r["returns"],
        "winLen": 512,
        "start": dates[0],
        "end": dates[-1],
        "min": round(min(closes), 4),
        "max": round(max(closes), 4),
        "pretrainWindows": r["pretrainWindows"],
        "downstreamWindows": r["downstreamWindows"],
        "train": r["trainWindows"],
        "val": r["valWindows"],
        "test": r["testWindows"],
    },
    "frozen": {
        "encParams": r["encoderParams"],
        "pParams": r["pParams"],
        "total": r["frozenParams"],
        "dim": 64,
        "bestEpoch": r["encoderBestEpoch"],
    },
    "probe": {
        "dim": 64,
        "targets": 20,
        "params": r["probeParams"],
        "share": round(100.0 * r["probeParams"] / r["frozenParams"], 4),
        "lambda": r["probeLambda"],
        "relMae": r["probeRelMae"],
        "mae": r["probeMae"],
        "meanMae": r["persistMae"],
        "randomRelMae": r["randomFeatureRelMae"],
        "exactErr": r["exactErr"],
    },
    "lora": {
        "rank": 4,
        "dim": 64,
        "params": r["loraParams"],
        "share": round(100.0 * r["loraParams"] / r["frozenParams"], 4),
        "pairs": 92,
        "epochs": 80,
        "lr": 0.001,
        "lossFirst": 36.4925,
        "lossLast": 36.4807,
        "dropPct": round(100.0 * r["loraDrop"], 4),
        "testMse": r["loraMse"],
        "frozenMse": r["frozenMse"],
        "identityDiff": r["identityDiff"],
        "mergeRestore": 6.939e-18,
    },
    "anchor": {
        "vocab": 64,
        "classes": 20,
        "perClass": 40,
        "prefixLen": r["anchors"] and 9,
        "orthoDev": r["orthoDev"],
        "top8": [26, 41, 20, 51, 50, 61, 52, 30],
        "anchors": r["anchors"],
        "anchorAcc": r["anchorAcc"],
        "probeSynthAcc": r["probeSynthAcc"],
        "chance": 0.05,
    },
    "timing": {"seconds": r["seconds"]},
    "code": {
        "modules": 3,
        "probeLines": 106,
        "loraLines": 126,
        "anchorLines": 89,
        "totalLines": 321,
        "tests": 26,
        "probeTests": 9,
        "loraTests": 7,
        "anchorTests": 10,
        "evidenceLines": 443,
        "checks": ev["total"],
    },
    "series": {
        "closes": [round(c, 4) for c in closes[::10]],
        "dates": dates,
        "volMean": [round(v, 4) for v in vol_mean],
        "volOne": [round(v, 4) for v in vol_one],
    },
    "words": {"names": names, "gram": gram},
}

OUT.write_text(json.dumps(dist, ensure_ascii=False, separators=(",", ":")) + "\n")
print("wrote", OUT, OUT.stat().st_size, "bytes")
print("checks", dist["summary"], "series", dist["data"]["seriesRows"], "words", len(words))
