#!/usr/bin/env python3
"""E39 pack data: classic.json from the ts-base evidence of the ARIMA / Matrix Profile episode."""
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]          # episodes/39-...
EVID = Path("/root/ts-base/inventory/evidence/39-ad-classic-arima-matrixprofile.ch4-classic.json")
CHECKS = Path("/root/ts-base/data/episodes/39-ad-classic-arima-matrixprofile/checks.txt")
CSV = Path("/root/ts-base/data/episodes/39-ad-classic-arima-matrixprofile/classic_series.csv")

ev = json.loads(EVID.read_text())
rows = [ln.strip().split(",") for ln in CSV.read_text().splitlines()[1:] if ln.strip()]
closes = [float(r[1]) for r in rows]
dates = [r[0] for r in rows]

test_len = ev["dataset"]["test"]
test_close = closes[-test_len:]
step = 4
price = [round(v, 2) for v in test_close[::step]]

checks = []
for line in CHECKS.read_text().splitlines():
    if not line.strip():
        continue
    g, n, ok = line.split("\t")
    checks.append({"g": g, "n": n, "ok": ok == "pass"})

groups = []
for g in ["data", "returns", "arima", "mp", "blind", "inject", "scores", "kind"]:
    sub = [c for c in checks if c["g"] == g]
    groups.append({"g": g, "pass": sum(1 for c in sub if c["ok"]), "total": len(sub)})

out = {
    "meta": {
        "episode": "39-ad-classic-arima-matrixprofile",
        "title": "残差与邻居：ARIMA 残差检测与 Matrix Profile discord",
        "chapter": "第 4 章 / 异常检测 · 第三十九集",
        "book": "§4.4.1–4.4.2 · p.85（书中只有两句话、零公式）",
        "commits": {"tsBase": "b1f07ea", "tsAdmin": "7065608"},
        "tests": {"suites": 124, "assertions": 1663, "newSuites": 2, "newCases": 18},
        "evidence": {"total": ev["checks"]["total"], "seconds": ev["checks"]["seconds"]},
        "progress": {"delivered": 49, "total": 74},
        "next": {
            "slug": "ad-adversarial-dual-decoder",
            "title": "两个解码器，一个说谎：USAD 对抗、DAGMM 能量与多 AE 中位数",
            "minutes": 30,
        },
    },
    "data": dict(ev["dataset"], name="贵州茅台 600519.SH", testStart=dates[-test_len]),
    "arima": ev["arima"],
    "mp": ev["mp"],
    "inject": ev["inject"],
    "kind": ev["kind"],
    "diag": ev["diag"],
    "series": dict(
        ev["series"],
        price=price,
        priceStep=step,
        testStart=dates[-test_len],
        testEnd=dates[-1],
    ),
    "checks": checks,
    "groups": groups,
    "modules": [
        {"file": "Ch04/ARIMA.hs", "lines": 338, "tests": 10},
        {"file": "Ch04/MatrixProfile.hs", "lines": 129, "tests": 8},
    ],
}

dst = ROOT / "data" / "classic.json"
dst.write_text(json.dumps(out, ensure_ascii=False, indent=1))
print(f"wrote {dst} ({dst.stat().st_size} B)")
print("groups", groups)
print("arima", out["arima"]["f1"], out["arima"]["f1PointAdj"], "mp", out["mp"]["f1"])
