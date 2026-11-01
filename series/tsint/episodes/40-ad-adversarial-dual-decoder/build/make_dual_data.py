#!/usr/bin/env python3
"""Assemble data/dual.json for episode 40 from the ts-base evidence summary."""
import json, os, statistics

SRC = "/root/ts-base/out/ep40/summary.json"
CHECKS = "/root/ts-base/out/ep40/checks.txt"
OUT = os.path.join(os.path.dirname(__file__), "..", "data", "dual.json")

s = json.load(open(SRC))
checks = []
for line in open(CHECKS):
    parts = line.rstrip("\n").split("\t")
    if len(parts) == 3:
        checks.append({"g": parts[0], "n": parts[1], "ok": parts[2] == "pass"})

ser = s["series"]
usad = ser["usadScore"]
dagmm = ser["dagmmScore"]
ens = ser["ensScore"]
truth = ser["truthIdx"]
spikes = ser["spikeStarts"]
drifts = ser["driftStarts"]
truth_set = set(truth)
spike_w = set()
for st in spikes:
    for i in range(max(0, st - 99), min(len(usad), st + 1)):
        if i in truth_set:
            spike_w.add(i)
drift_w = set()
for st in drifts:
    for i in range(max(0, st - 99), min(len(usad), st + 20)):
        if i in truth_set:
            drift_w.add(i)
clean_w = [i for i in range(100, len(usad)) if i not in truth_set]

def med(xs):
    return round(statistics.median(xs), 6) if xs else 0.0

def kind_of(arr):
    return {
        "spike": med([arr[i] for i in sorted(spike_w)]),
        "drift": med([arr[i] for i in sorted(drift_w)]),
        "clean": med([arr[i] for i in clean_w]),
    }

groups = {}
for c in checks:
    g = groups.setdefault(c["g"], {"g": c["g"], "total": 0, "pass": 0})
    g["total"] += 1
    g["pass"] += 1 if c["ok"] else 0

out = {
    "meta": {
        "episode": "40-ad-adversarial-dual-decoder",
        "title": "两个解码器，一个说谎：USAD 对抗、DAGMM 能量与多 AE 中位数",
        "commits": {"tsBase": "20a044f", "tsAdmin": "8da7527"},
        "tests": {"suites": 127, "assertions": 1689},
        "newCases": 26,
        "evidence": {"checks": s["checks"]["total"], "seconds": s["checks"]["seconds"]},
        "progress": s["progress"],
        "next": {
            "id": "41-ad-sparse-prior-dual-attention",
            "title": "稀疏先验与双注意力：SPADE、DualAttention 与少样本异常",
            "minutes": 30,
        },
    },
    "data": s["dataset"],
    "windows": s["windowCounts"],
    "usad": {**s["usad"], "l1": ser["usadL1"], "l2": ser["usadL2"]},
    "dagmm": s["dagmm"],
    "ens": s["ens"],
    "ae": s["ae"],
    "inject": s["inject"],
    "kind": {
        "usad": kind_of(usad),
        "dagmm": kind_of(dagmm),
        "ens": kind_of(ens),
        "counts": {"spike": len(spike_w), "drift": len(drift_w), "clean": len(clean_w)},
    },
    "series": {
        "usad": usad,
        "dagmm": dagmm,
        "ens": ens,
        "truthIdx": truth,
        "spikeStarts": spikes,
        "driftStarts": drifts,
    },
    "checks": checks,
    "groups": sorted(groups.values(), key=lambda g: -g["total"]),
    "modules": [
        {"file": "Ch04/USAD.hs", "lines": 354, "tests": 9},
        {"file": "Ch04/DAGMM.hs", "lines": 456, "tests": 10},
        {"file": "Ch04/AEEnsemble.hs", "lines": 211, "tests": 7},
    ],
}
json.dump(out, open(OUT, "w"), ensure_ascii=False, separators=(",", ":"))
print("wrote", OUT, os.path.getsize(OUT), "bytes")
print("kind", out["kind"])
print("groups", [(g["g"], g["pass"], g["total"]) for g in out["groups"]])
