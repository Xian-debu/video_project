#!/usr/bin/env python3
"""把 E38 证据 JSON 编译成片子用的 data/graph.json（只搬运 + 少量派生，不改数值）。"""
import json, hashlib, subprocess, datetime, pathlib

ROOT = pathlib.Path("/root/ts-base")
PACK = pathlib.Path("/root/video_project/series/tsint/episodes/38-ad-graph-contrastive")
EV = ROOT / "inventory/evidence/38-ad-graph-contrastive.ch4-gnn.json"
MAN = ROOT / "data/episodes/38-ad-graph-contrastive/graph_panel.manifest.json"
CSV = ROOT / "data/episodes/38-ad-graph-contrastive/graph_panel.csv"

UNITS_COMMIT = "1bae41d"
EVIDENCE_COMMIT = "beb0a57"
DATA_COMMIT = "d1cce83"

GROUPS = [
    ("data.", "数据"), ("windows.", "窗口"), ("features.", "特征"), ("gnn.", "训练"),
    ("adj.", "邻接"), ("cosine.", "余弦"), ("infonce.", "对比"), ("aug.", "增强"),
    ("inject.", "注入"), ("scores.", "读数"), ("regime.", "对照"),
    ("split.", "切分"), ("negative.", "负向"),
]


def lines_of(rel):
    return len((ROOT / rel).read_text(encoding="utf-8").splitlines())


def cases_of(rel):
    return (ROOT / rel).read_text(encoding="utf-8").count('check "')


ev = json.loads(EV.read_text())
man = json.loads(MAN.read_text())
sha_full = hashlib.sha256(CSV.read_bytes()).hexdigest()
codes = ev["data"]["codes"]
names = ev["data"]["names"]
name_of = dict(zip(codes, names))
sub = ev["data"]["subgroups"]
group_of = [0] * len(codes)
for gi, key in enumerate(("baijiu", "beer", "other")):
    for i in sub[key]:
        group_of[i] = gi
subgroup_names = ["白酒", "啤酒", "其他"]

groups = []
for prefix, label in GROUPS:
    rows = [c for c in ev["checks"] if c["name"].startswith(prefix)]
    if not rows:
        continue
    groups.append({"label": label, "n": len(rows), "pass": len([c for c in rows if c["ok"]])})

# ---- 邻接矩阵的派生读数（只做平均/计数） ----
A = ev["adjacency"]["matrix"]
n = len(A)
row_sums = [round(sum(r), 4) for r in A]
within = {}
for key, idx in sub.items():
    vals = [A[i][j] for i in idx for j in idx if i != j]
    within[key] = round(sum(vals) / len(vals), 4) if vals else 0.0
sym_pairs = sum(1 for i in range(n) for j in range(i + 1, n) if (A[i][j] > 0.5) == (A[j][i] > 0.5))
top_edges = sorted(
    ({"v": round(A[i][j], 4), "a": names[i], "b": names[j]} for i in range(n) for j in range(n) if i != j),
    key=lambda e: -e["v"],
)[:6]

# ---- 单位读数（图 / 无图） ----
by_kind = {}
for unit in ("graph", "flat"):
    rows = ev["scores"]["byKind"][unit]
    by_kind[unit] = {r["name"]: r for r in rows}
units = {}
for unit, tau in (("graph", ev["scores"]["tauG"]), ("flat", ev["scores"]["tauF"])):
    s = ev["scores"][unit]
    units[unit] = {
        "name": unit, "f1": s["f1"], "p": s["p"], "r": s["r"], "tau": tau,
        "alertPct": s["alertPct"],
    }

alert_days = round(ev["scores"]["graph"]["alertPct"] / 100.0 * ev["windows"]["test"])
inject = ev["inject"]
inject_out = {
    "seed": inject["seed"], "runs": inject["runs"],
    "spikeRuns": inject["spikeRuns"], "spreadRuns": inject["spreadRuns"],
    "truthPts": inject["truthPts"], "spikePts": inject["spikePts"], "spreadPts": inject["spreadPts"],
    "truthDays": inject["truthDays"], "spikeDays": inject["spikeDays"], "spreadDays": inject["spreadDays"],
    "ratePct": round(100.0 * inject["truthDays"] / ev["windows"]["test"], 3),
    "spike": {"amp": "5–10σ", "len": "1 或 3 天", "pos": "窗内第 15–40 位"},
    "spread": {"nodes": "3 只同组票", "len": "1 或 3 天", "amp": "3–5σ"},
}

max_gap = 96
gap_note = "2015-07-29 .. 2015-11-02 源数据整段缺失（对齐后仍缺，不是停牌标记）"

out = {
    "meta": {
        "episode": 38, "slug": ev["episode"], "chapter": "第 4 章 · 第 38 集",
        "book": "§4.4.7 · 式 (4.41)–(4.46) · GNN 与对比学习",
        "runtimeTarget": 22,
        "title": "图上的异常：增强、对比损失与 TopK 邻接",
        "subtitle": "邻接 · 对比损失 · 阈值迁移",
        "checks": str(ev["nPass"]) + "/" + str(ev["nChecks"]), "checkCount": ev["nChecks"],
        "elapsedSec": round(ev["elapsedSec"], 1),
        "tests": {"suites": 122, "asserts": 1645, "newSuites": 3, "newAsserts": 21},
        "commits": {"units": UNITS_COMMIT, "evidence": EVIDENCE_COMMIT, "data": DATA_COMMIT},
        "repro": ev["repro"],
        "generatedAt": datetime.datetime.now().astimezone().isoformat(timespec="seconds"),
    },
    "data": {
        "file": ev["data"]["file"], "rows": ev["data"]["rows"],
        "start": ev["data"]["start"], "end": ev["data"]["end"],
        "sha": ev["data"]["sha256"], "shaFull": sha_full,
        "codes": codes, "names": name_of,
        "subgroups": group_of, "subgroupNames": subgroup_names,
        "maxGap": {"days": max_gap, "pair": "2015-07-29 / 2015-11-02"},
        "maxGapNote": gap_note, "bytes": man["bytes"],
        "split": {"train": "2015-01-05 .. 2019-12-31", "test": "2020-01-01 .. 2026-06-30"},
    },
    "windows": {
        "C": ev["params"]["window"], "train": ev["windows"]["train"], "test": ev["windows"]["test"],
        "trainUsed": ev["windows"]["usedTrain"], "trainStride": ev["params"]["trainStride"],
        "maxGapDays": ev["windows"]["maxGapDays"],
        "split": {"train": "2015-01-05 .. 2019-12-31", "test": "2020-01-01 .. 2026-06-30"},
    },
    "params": {
        "nodes": ev["params"]["nodes"], "dim": ev["params"]["dim"], "topK": ev["params"]["topK"],
        "epochs": ev["params"]["epochs"], "lr": ev["params"]["lr"], "seed": ev["params"]["seed"],
        "params": ev["gnn"]["params"], "window": ev["params"]["window"],
    },
    "gnn": {
        "lossFirst": ev["gnn"]["lossFirst"], "lossLast": ev["gnn"]["lossLast"],
        "flatLossFirst": ev["gnn"]["flatLossFirst"], "flatLossLast": ev["gnn"]["flatLossLast"],
        "gapLast": ev["gnn"]["flatLossLast"] - ev["gnn"]["lossLast"],
        "params": ev["gnn"]["params"], "precision": ev["adjacency"]["precision"],
        "baseline": ev["adjacency"]["baseline"], "degree": ev["adjacency"]["degree"],
        "symFrac": ev["adjacency"]["symFrac"], "edges": ev["adjacency"]["edges"],
        "samples": ev["adjacency"]["samples"],
    },
    "adjacency": {
        "matrix": A, "labels": names, "groups": group_of,
        "rowSums": row_sums, "within": within, "symPairs": sym_pairs, "topEdges": top_edges,
    },
    "cosine": {
        "diagCorrect": 1.0 - ev["cosine"]["diagCorrect"], "diagWrong": 1.0 - ev["cosine"]["diagWrong"],
        "maxOffDiff": ev["cosine"]["maxOffDiff"],
        "normMin": ev["cosine"]["normMin"], "normMax": ev["cosine"]["normMax"],
    },
    "infonce": {k: ev["infonce"][k] for k in ("lossTau005", "lossTau01", "lossTau05", "posMean", "negMean")},
    "aug": {"views": ev["aug"]["views"], "spikePos": ev["aug"]["spikePos"]},
    "inject": inject_out,
    "scores": {
        "tauG": ev["scores"]["tauG"], "tauF": ev["scores"]["tauF"],
        "graph": units["graph"], "flat": units["flat"],
        "byKind": by_kind,
        "cleanMedianGraph": ev["scores"]["cleanMedianGraph"],
        "cleanMedianFlat": ev["scores"]["cleanMedianFlat"],
        "alertDays": alert_days,
    },
    "regime": ev["regime"],
    "units": units,
    "checks": ev["checks"],
    "groups": groups,
    "modules": [
        {"name": "Ch04/GNN.hs", "lines": lines_of("src/TsBase/Algos/Ch04/GNN.hs"), "cases": cases_of("test/Algos/Ch04/GNNSpec.hs")},
        {"name": "Ch04/Augment.hs", "lines": lines_of("src/TsBase/Algos/Ch04/Augment.hs"), "cases": cases_of("test/Algos/Ch04/AugmentSpec.hs")},
        {"name": "Ch04/InfoNCE.hs", "lines": lines_of("src/TsBase/Algos/Ch04/InfoNCE.hs"), "cases": cases_of("test/Algos/Ch04/InfoNCESpec.hs")},
    ],
    "next": {"slug": "39-ad-classic-arima-matrixprofile", "title": "经典基线：ARIMA 残差与矩阵轮廓", "minutes": 20},
    "progress": {"delivered": 48, "total": 74},
}

(PACK / "data/graph.json").write_text(json.dumps(out, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
print("bytes", (PACK / "data/graph.json").stat().st_size)
print("checks", ev["nPass"], "/", ev["nChecks"], "groups", [(g["label"], g["n"]) for g in groups])
print("modules", out["modules"])
print("window", out["adjacency"]["within"], out["adjacency"]["symPairs"], out["adjacency"]["topEdges"])

