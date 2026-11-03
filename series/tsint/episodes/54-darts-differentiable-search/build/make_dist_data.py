#!/usr/bin/env python3
"""Assemble data/dist.json for episode 54 from the ts-base evidence files.

The screen numbers are re-derived, not copied:
  * data block: daily30.csv is parsed row by row; bars, windows, split, pooled
    label sd and the return-correlation graph are recomputed and compared with
    summary.json (tolerance 5e-4);
  * model/search blocks: summary.json readings are the only source, and their
    internal relations (ladder monotone, supernet worst, top-1 worse than
    random, checks all pass) are asserted here;
  * the two loss readings only exist as check details in summary.json; they are
    parsed with a regex and the build fails if the text changes.

A mismatch aborts with EVIDENCE MISMATCH.

Usage: python3 build/make_dist_data.py [--tsbase PATH] [--tsadmin PATH] [--out PATH]
"""
import argparse, csv, json, math, os, re, statistics, subprocess, sys

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
EP = "54-darts-differentiable-search"

ap = argparse.ArgumentParser()
ap.add_argument("--tsbase", default="/root/ts-base")
ap.add_argument("--tsadmin", default="/root/ts-admin")
ap.add_argument("--out", default=os.path.join(ROOT, "data", "dist.json"))
args = ap.parse_args()


def short_head(repo):
    try:
        return subprocess.run(["git", "-C", repo, "rev-parse", "--short", "HEAD"],
                              capture_output=True, text=True, check=True).stdout.strip()
    except Exception:
        return "unknown"


def fail(msg):
    print("EVIDENCE MISMATCH: " + msg, file=sys.stderr)
    sys.exit(1)


epdir = os.path.join(args.tsbase, "data/episodes", EP)
ev = json.load(open(os.path.join(epdir, "summary.json")))
rd = ev["readings"]
man = json.load(open(os.path.join(epdir, "manifest.json")))
commits = {"tsBase": short_head(args.tsbase), "tsAdmin": short_head(args.tsadmin)}

# ------------------------------------------------------------------ daily30.csv
rows = []
with open(os.path.join(epdir, "daily30.csv"), newline="") as f:
    rdr = csv.reader(f)
    head = next(rdr)
    if head != ["code", "date", "close"]:
        fail("daily30.csv header %r" % head)
    for r in rdr:
        rows.append((r[0], r[1], float(r[2])))
if not rows:
    fail("daily30.csv is empty")

codes, closes, dates = [], {}, {}
for code, date, close in rows:
    if code not in closes:
        closes[code] = []
        dates[code] = []
        codes.append(code)
    closes[code].append(close)
    dates[code].append(date)
if codes != rd["codes"]:
    fail("codes order differs from summary")
if len(rows) != man["files"]["daily30.csv"]["rows"]:
    fail("rows %d vs manifest %d" % (len(rows), man["files"]["daily30.csv"]["rows"]))
if len(codes) != rd["stocks"]:
    fail("stocks %d vs evidence %d" % (len(codes), rd["stocks"]))

bars = [len(closes[c]) for c in codes]
if [min(bars), max(bars)] != rd["bars"]:
    fail("bars %r vs evidence %r" % ([min(bars), max(bars)], rd["bars"]))
for c in codes:
    if len(set(dates[c])) != len(dates[c]):
        fail("duplicate dates in %s" % c)
    if any(v <= 0 for v in closes[c]):
        fail("non-positive close in %s" % c)

common = set(dates[codes[0]])
for c in codes[1:]:
    common &= set(dates[c])
common = sorted(common)
if len(common) - 1 != rd["common_days"]:
    fail("common days %d vs evidence %d" % (len(common) - 1, rd["common_days"]))

H = rd["h"]
train_labels, nwin, ptr, pva, pte = [], [], 0, 0, 0
rets_by_code = {}
for c in codes:
    px = closes[c]
    n = len(px)
    rets = [0.0] + [px[i] / px[i - 1] - 1 for i in range(1, n)]
    rets_by_code[c] = dict(zip(dates[c], rets))
    w = [rets[t + 1] for t in range(H, n - 1)]
    nwin.append(len(w))
    a = int(0.7 * len(w))
    b = int(0.15 * len(w))
    ptr += a
    pva += b
    pte += len(w) - a - b
    train_labels += w[:a]

if sum(nwin) != rd["windows"]["total"] or [min(nwin), max(nwin)] != [rd["windows"]["min"], rd["windows"]["max"]]:
    fail("windows %d %r vs evidence %r" % (sum(nwin), [min(nwin), max(nwin)], rd["windows"]))
if [ptr, pva, pte] != [rd["split"]["train"], rd["split"]["valid"], rd["split"]["test"]]:
    fail("split %r vs evidence %r" % ([ptr, pva, pte], [rd["split"]["train"], rd["split"]["valid"], rd["split"]["test"]]))
y_sd = statistics.pstdev(train_labels) * 1e4
if abs(y_sd - rd["y_sd_bps"]) > 5e-4:
    fail("y_sd_bps %.6f vs evidence %.6f" % (y_sd, rd["y_sd_bps"]))

# correlation graph: prices are aligned on the common dates first, then returns
# are taken inside that aligned series (matches the evidence graph)
aligned = []
for c in codes:
    px = [closes[c][dates[c].index(dt)] for dt in common]
    aligned.append([px[i] / px[i - 1] - 1 for i in range(1, len(px))])
corr = []
for i in range(len(codes)):
    for j in range(i + 1, len(codes)):
        corr.append(abs(statistics.correlation(aligned[i], aligned[j])))
mean_abs = statistics.mean(corr)
max_abs = max(corr)
edges = sum(1 for v in corr if v >= 0.5)
if abs(mean_abs - rd["graph"]["mean_abs_corr"]) > 5e-4:
    fail("mean abs corr %.6f vs evidence %.6f" % (mean_abs, rd["graph"]["mean_abs_corr"]))
if abs(max_abs - rd["graph"]["max_abs_corr"]) > 5e-4:
    fail("max abs corr %.6f vs evidence %.6f" % (max_abs, rd["graph"]["max_abs_corr"]))
if edges != rd["graph"]["edges_05"]:
    fail("edges>=0.5 %d vs evidence %d" % (edges, rd["graph"]["edges_05"]))

# ------------------------------------------------------------------ readings
space, trace, sweep = rd["space"], rd["trace"], rd["alpha_sweep"]
mae = dict(rd["mae_bps"])
zero, init = rd["zero_mae"], rd["mae_init"]

if len(trace) != 20 or [r["step"] for r in trace] != list(range(1, 21)):
    fail("trace is not 20 steps")
if trace[-1]["mean_max"] != sweep[0]["final_mean_max"]:
    fail("default trace does not match sweep lr 0.05")
if len(sweep) != 5 or [r["lr"] for r in sweep] != [0.05, 0.5, 5.0, 50.0, 500.0]:
    fail("alpha sweep ladders changed: %r" % [r["lr"] for r in sweep])
ladder = [r["final_mean_max"] for r in sweep]
if not all(ladder[k] < ladder[k + 1] for k in range(4)):
    fail("sweep ladder is not increasing: %r" % ladder)
if [r["collapse_step"] for r in sweep] != [0, 0, 0, 0, 12]:
    fail("collapse steps changed: %r" % [r["collapse_step"] for r in sweep])
if sweep[-1]["final_collapsed"] != 6 or sweep[-1]["distinct_ops"] != 2:
    fail("lr=500 collapse %r" % sweep[-1])
if any(r["final_collapsed"] for r in sweep[:4]):
    fail("a non-500 lr collapsed")
if mae["supernet"] <= max(mae["top1"], mae["top2"], mae["random"], mae["same_batch"]):
    fail("supernet is not the worst: %r" % mae)
if mae["top1"] <= mae["random"]:
    fail("documented negative result does not hold: top1 %r <= random %r" % (mae["top1"], mae["random"]))
if min(mae.values()) <= zero:
    fail("some retrained architecture beats the zero baseline")
if rd["same_diff"] != 7:
    fail("same_diff %r" % rd["same_diff"])
if space["ops"] != 3 or space["edges"] != 8 or space["cells"] != 3 ** 8:
    fail("space %r" % space)
if space["ops"] * space["edges"] * 2 != 48:
    fail("discrete decision count is not 3*8*2")
if abs(space["autocts"] / space["cells"] - space["ratio"]) > 5e-3:
    fail("ratio %r vs evidence %r" % (space["autocts"] / space["cells"], space["ratio"]))

top1, top2, same_top1 = rd["top1"], rd["top2"], rd["same_batch_top1"]
if len(top1) != 8 or len(same_top1) != 8 or len(top2) != 8:
    fail("edge choice vectors have the wrong length")
if sum(1 for a, b in zip(top1, same_top1) if a != b) != rd["same_diff"]:
    fail("same_diff does not match the two choice vectors")
if set(top1) - {0, 1, 2}:
    fail("op id outside the three-op space")

checks = [{"group": c["group"], "name": c["name"], "ok": c["ok"], "detail": c.get("detail", "")} for c in ev["checks"]]
if len(checks) != ev["total"] or not all(c["ok"] for c in checks):
    fail("checks %d/%d" % (sum(1 for c in checks if c["ok"]), ev["total"]))

# the two training readings live in the check details, not in readings
loss = {}
for c in checks:
    m = re.search(r"loss ([0-9.]+) -> ([0-9.]+)", c["detail"])
    if m:
        loss = {"start": float(m.group(1)), "end": float(m.group(2))}
m = None
for c in checks:
    m = re.search(r"位移 ([0-9.]+)", c["detail"])
    if m:
        step_shift = float(m.group(1))
        break
if not loss or not m:
    fail("loss / alpha-shift readings disappeared from the check details")
if not (loss["end"] < loss["start"]):
    fail("loss did not fall: %r" % loss)

pct = lambda a, b: round(a / b - 1, 4)
gains = {
    "top1VsRandom": pct(mae["top1"], mae["random"]),
    "top2VsTop1": pct(mae["top2"], mae["top1"]),
    "supernetVsTop1": pct(mae["supernet"], mae["top1"]),
    "zeroVsTop1": pct(zero, mae["top1"]),
}

doc = {
    "meta": {
        "episode": ev["episode"],
        "slug": ev["slug"],
        "group": ev["group"],
        "title": "把架构搜索变成可微：DARTS 与三层搜索空间",
        "chapter": "ch06",
        "chapterName": "自动化模型设计",
        "runtimeTarget": 26,
        "next": {"id": 55, "title": "省算力的三种剪枝：子空间、比较器与组合预测器", "minutes": 24},
        "commits": commits,
        "total": ev["total"],
        "passed": ev["passed"],
        "failed": ev["failed"],
    },
    "data": {
        "stocks": len(codes),
        "codes": codes,
        "rows": len(rows),
        "bars": [min(bars), max(bars)],
        "commonDays": len(common) - 1,
        "h": H,
        "windows": {"total": sum(nwin), "min": min(nwin), "max": max(nwin)},
        "split": {"train": ptr, "valid": pva, "test": pte,
                  "batches": rd["split"]["batches"], "fractions": [0.7, 0.15, 0.15]},
        "graph": {"edges05": edges, "meanAbsCorr": round(mean_abs, 4), "maxAbsCorr": round(max_abs, 4)},
        "ySd": round(y_sd, 4),
    },
    "darts": {
        "softmax": {"zero": [0.5, 0.5], "wide": [4.54e-5, 0.99995]},
        "multiply": {"weights": [0.5, 0.5], "ops": ["identity", "zero"], "input": [1.0, 2.0], "out": [0.5, 1.0]},
        "identity": {"op": "identity", "input": [1.0, 2.0], "out": [1.0, 2.0]},
        "loss": {"start": loss["start"], "end": loss["end"], "steps": 20},
        "step": {"steps": 1, "alphaShift": step_shift},
    },
    "search": {
        "space": {"ops": space["ops"], "edges": space["edges"], "cells": space["cells"],
                   "autocts": space["autocts"], "ratio": space["ratio"]},
        "decisions": space["ops"] * space["edges"] * 2,
        "trace": [{"step": r["step"], "meanMax": r["mean_max"], "collapsed": r["collapsed"]} for r in trace],
        "startMeanMax": trace[0]["mean_max"],
        "default": {"lr": 0.05, "meanMax": trace[-1]["mean_max"], "collapsedEdges": trace[-1]["collapsed"]},
        "sweep": [{"lr": r["lr"], "meanMax": r["final_mean_max"], "collapseStep": r["collapse_step"],
                   "collapsedEdges": r["final_collapsed"], "distinctOps": r["distinct_ops"],
                   "top1": r["top1"]} for r in sweep],
        "top1": top1,
        "top2": top2,
        "sameBatchTop1": same_top1,
    },
    "stg": {
        "macro": {"beta": [0.9, 0.1], "blocks": [1.0, 3.0], "out": 1.2},
        "micro": {"gamma": [0.5, 0.5], "exprs": [2.0, 4.0], "out": 3.0},
        "three": {"macro": 0.5, "micro": 0.5, "block": 10.0, "out": 6.5},
        "hull": {"weights": [0.2, 0.3, 0.5], "lo": 1.0, "hi": 4.0},
        "perm": {"weights": [0.4, 0.6], "outs": [1.0, 3.0], "out": 2.2},
        "choices": 3 * 2 * 2,
    },
    "demo": {
        "mae": {"zero": zero, "init": init, "supernet": mae["supernet"], "top1": mae["top1"],
                "top2": mae["top2"], "random": mae["random"], "sameBatch": mae["same_batch"]},
        "gains": gains,
        "sameDiff": rd["same_diff"],
        "seedSame": True,
    },
    "checks": checks,
    "seconds": rd["seconds"],
}

os.makedirs(os.path.dirname(args.out), exist_ok=True)
payload = json.dumps(doc, ensure_ascii=False, indent=1) + chr(10)
with open(args.out, "w", encoding="utf-8") as f:
    f.write(payload)
print("wrote %s (%d bytes)" % (os.path.relpath(args.out, ROOT), len(payload.encode())))
print("stocks %d rows %d bars %r windows %d split %r ySd %.4f common %d" % (
    len(codes), len(rows), [min(bars), max(bars)], sum(nwin), [ptr, pva, pte], y_sd, len(common) - 1))
print("MAE zero %.4f init %.4f supernet %.4f top1 %.4f top2 %.4f random %.4f same %.4f" % (
    zero, init, mae["supernet"], mae["top1"], mae["top2"], mae["random"], mae["same_batch"]))
print("ladder %r | loss %.4f->%.4f shift %.4f | checks %d/%d %.3fs" % (
    ladder, loss["start"], loss["end"], step_shift, ev["passed"], ev["total"], rd["seconds"]))
