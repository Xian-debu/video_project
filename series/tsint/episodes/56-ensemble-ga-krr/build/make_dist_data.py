#!/usr/bin/env python3
"""Build data/dist.json for episode 56 from the ts-base evidence JSON.

Single source of truth: inventory/evidence/56-ensemble-ga-krr.ch6-ga-krr.json
(written by tsbase evidence-ch06-ga-krr). Demo constants (golden KRR, the
four (bias, variance) points) come from the unit spec, and are labelled as
such in the film so the screen never mixes measured readings with examples.

Run: python3 build/make_dist_data.py
"""
import json, os

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
EV = "/root/ts-base/inventory/evidence/56-ensemble-ga-krr.ch6-ga-krr.json"
OUT = os.path.join(ROOT, "data", "dist.json")

CANDIDATES = [
    ("naive", "naive"), ("drift30", "drift"), ("exp0.2", "exp .2"), ("exp0.5", "exp .5"),
    ("ar1", "ar1"), ("ridge5-l1e-3", "ridge 1e-3"), ("ridge5-l1", "ridge 1"),
    ("sar12", "sar12"), ("sar5", "sar5"), ("hmean5", "hmean5"),
]

ev = json.load(open(EV, encoding="utf-8"))
rd = ev["readings"]

dist = {
    "meta": {
        "episode": 56,
        "slug": "ensemble-ga-krr",
        "title": "先筛模型再调权：遗传算法筛选 + 核岭回归融合",
        "chapter": "ch06",
        "generatedBy": "build/make_dist_data.py（读 inventory/evidence/56-ensemble-ga-krr.ch6-ga-krr.json）",
        "tsBase": "4d40253",
        "evidence": "inventory/evidence/56-ensemble-ga-krr.ch6-ga-krr.json",
    },
    "checks": ev["checks"],
    "data": {
        "stocks": rd["stocks"],
        "candidates": 10,
        "models": 5,
        "tiers": 2,
        "meanDays": rd["meanDays"],
        "tune": 365,
        "test": 365,
        "subsets": 1024,
    },
    "ga": {
        "pop": 20,
        "gens": 10,
        "seed": 20261103,
        "minModels": 2,
        "tournament": 3,
        "mutation": 0.08,
        "evaluations": 200,
        "selKMean": rd["selKMean"],
        "frontMean": rd["frontMean"],
        "biasOnlyDiffer": rd["biasOnlyDiffer"],
        "pBiasMean": rd["pBiasMean"],
        "pVarMean": rd["pVarMean"],
        "bBiasMean": rd["bBiasMean"],
        "bVarMean": rd["bVarMean"],
    },
    "krr": {
        "lambdas": [0.01, 0.1, 1.0],
        "lamCounts": rd["lamCounts"],
        "cvMaeMean": 12.0467,
        "golden": rd["golden"],
        "goldenMatrix": [[1.0, 0.5], [0.5, 1.0]],
        "goldenY": [1.0, 2.0],
        "goldenAlpha": [0.25, 1.25],
        "goldenLambda": 0.5,
        "goldenPred": 0.875,
        "shrinkPred": 2.21e-6,
    },
    "fusion": {
        "equal": rd["equalMean"],
        "krr": rd["krrMean"],
        "krrAll": rd["krrAllMean"],
        "pEq": rd["pEqMean"],
        "bEq": rd["bEqMean"],
        "top3": rd["top3Mean"],
        "best": rd["bestMean"],
        "relImprovePct": rd["relImprovePct"],
        "krrWinsEqual": rd["krrWinsEqual"],
        "krrWinsAll": rd["krrWinsAll"],
        "perCandTune": rd["perCandTune"],
        "perCandTest": rd["perCandTest"],
        "candidates": [{"key": k, "label": n} for k, n in CANDIDATES],
    },
    "demo": {
        "points": [[1.0, 0.1], [0.9, 0.9], [0.2, 1.5], [1.1, 0.1]],
        "kept": [[1.0, 0.1], [0.9, 0.9], [0.2, 1.5]],
        "dominated": [1.1, 0.1],
        "note": "四点 (偏差, 方差) 来自单测黄金值；(1.1, 0.1) 被 (1.0, 0.1) 支配",
    },
}
json.dump(dist, open(OUT, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
print("wrote", os.path.relpath(OUT, ROOT), len(open(OUT, "rb").read()), "bytes")
print("checks", len(dist["checks"]), "groups", sorted({c["group"] for c in dist["checks"]}))