#!/usr/bin/env python3
"""Assemble data/sparse.json for episode 41 from the ts-base evidence summary.

Usage: python3 build/make_sparse_data.py [--summary PATH] [--checks PATH] [--commits tsBase=abc,tsAdmin=def]
"""
import argparse, json, os, re, statistics

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
DEFAULT_SUMMARY = "/root/ts-base/inventory/evidence/ep41/summary.json"
DEFAULT_CHECKS = "/root/ts-base/inventory/evidence/ep41/checks.txt"

ap = argparse.ArgumentParser()
ap.add_argument("--summary", default=DEFAULT_SUMMARY)
ap.add_argument("--checks", default=DEFAULT_CHECKS)
ap.add_argument("--commits", default="")
ap.add_argument("--out", default=os.path.join(ROOT, "data", "sparse.json"))
args = ap.parse_args()

s = json.load(open(args.summary))

checks = []
for line in open(args.checks):
    m = re.match(r"^\[(PASS|FAIL)\]\s+(\S+)\s+(.*)$", line.rstrip("\n"))
    if m:
        checks.append({"g": m.group(2), "n": m.group(3), "ok": m.group(1) == "PASS"})

commits = {"tsBase": "pending", "tsAdmin": "pending"}
if args.commits:
    for part in args.commits.split(","):
        if "=" in part:
            k, v = part.split("=", 1)
            commits[k.strip()] = v.strip()

ser = s["series"]
truth = set(ser["truthIdx"])
n = len(ser["sbtScore"])
spikes = ser["spikeStarts"]
shapes = ser["shapeStarts"]
phases = ser["phaseStarts"]

def seg_windows(starts, length=20):
    w = set()
    for st in starts:
        for i in range(max(0, st), min(n, st + length)):
            if i in truth:
                w.add(i)
    return w

spike_w = set(i for i in spikes if i in truth)
shape_w = seg_windows(shapes)
phase_w = seg_windows(phases)
clean_w = [i for i in range(n) if i not in truth]

def med(xs):
    return round(statistics.median(xs), 6) if xs else 0.0

def kind_of(arr):
    return {
        "spike": med([arr[i] for i in sorted(spike_w)]),
        "shape": med([arr[i] for i in sorted(shape_w)]),
        "phase": med([arr[i] for i in sorted(phase_w)]),
        "clean": med([arr[i] for i in clean_w]),
    }

groups = {}
for c in checks:
    g = groups.setdefault(c["g"], {"g": c["g"], "total": 0, "pass": 0})
    g["total"] += 1
    g["pass"] += 1 if c["ok"] else 0

models = {}
for key, src in (("sbt", "sbt"), ("attn", "attn"), ("tvae", "tvae"), ("vae", "vae"), ("dcd", "dcd"), ("patchAe", "patchAe")):
    models[key] = s[src]

data = s["data"]
windows = {
    "fit": data["fit"] - 99,
    "val": data["val"] - 99,
    "test": data["test"] - 99,
}

out = {
    "meta": {
        "episode": "41-ad-sparse-prior-dual-attention",
        "title": "换掉一个假设：SBT 稀疏二值注意力、Student-t 重尾先验、DCdetector 双注意力",
        "commits": commits,
        "tests": {"suites": s.get("suites", 127), "assertions": s.get("assertions", 1689)},
        "newCases": s["newCases"],
        "evidence": {"checks": s["checks"], "passed": s["passed"], "seconds": s["seconds"]},
        "progress": s["progress"],
        "next": {
            "id": "42-metrics-distance-1nn-ee",
            "title": "距离决定一切：从 1-NN+DTW 到弹性集成",
            "minutes": 22,
        },
    },
    "data": data,
    "windows": windows,
    "models": models,
    "inject": s["inject"],
    "minute": s["minute"],
    "kind": {
        "sbt": kind_of(ser["sbtScore"]),
        "tvae": kind_of(ser["tvaeScore"]),
        "dcd": kind_of(ser["dcdScore"]),
        "counts": {"spike": len(spike_w), "shape": len(shape_w), "phase": len(phase_w), "clean": len(clean_w)},
    },
    "series": {
        "sbtScore": ser["sbtScore"],
        "attnScore": ser["attnScore"],
        "tvaeScore": ser["tvaeScore"],
        "gaussScore": ser["gaussScore"],
        "dcdScore": ser["dcdScore"],
        "patchAeScore": ser["patchAeScore"],
        "truthIdx": ser["truthIdx"],
        "spikeStarts": spikes,
        "shapeStarts": shapes,
        "phaseStarts": phases,
    },
    "checks": checks,
    "groups": sorted(groups.values(), key=lambda g: -g["total"]),
    "modules": s["modules"],
}
json.dump(out, open(args.out, "w"), ensure_ascii=False, separators=(",", ":"))
print("wrote", args.out, os.path.getsize(args.out), "bytes")
print("models", {k: (v["f1"], v["precision"], v["recall"]) for k, v in models.items()})
print("groups", [(g["g"], g["pass"], g["total"]) for g in out["groups"]])
print("kind", json.dumps(out["kind"], ensure_ascii=False))
