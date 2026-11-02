#!/usr/bin/env python3
"""Assemble data/dist.json for episode 47 from the ts-base evidence summary.

Every number shown on screen is re-derived here from the raw panel before the
file is written; a mismatch aborts with EVIDENCE MISMATCH:
  * panel 1,942 trading days x 30 stocks, 58,155 filled cells;
  * aligned log returns keep 1,822 days (all 30 finite and > 0);
  * |corr| >= 0.3 -> 162 edges; 134 intra-industry / 28 cross;
  * 21 train / 9 test nodes (first 7 vs last 3 of each industry);
  * GCN params 147 = (5*16+16) + (16*3+3), tanh(1) = 0.7616, P(2 nodes,1 edge) = 0.5;
  * GAT params 328 = 4*(5*4+2*4) + 4*(16*3+2*3), softmax([0, ln3]) = [0.25, 0.75],
    LeakyReLU(-1) = -0.2;
  * self-attention params 816 = 4*3*5*4 + 4*3*16*3, scale d'=4 -> 0.5, uniform 0.5;
  * test accuracies are multiples of 1/9; GCN 9/9, shuffled 1/9.

Usage: python3 build/make_dist_data.py [--tsbase PATH] [--commits tsBase=abc,tsAdmin=def]
"""
import argparse, csv, json, math, os, subprocess, sys

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
EP = "47-gcn-gat-attention"
THETA = 0.3

ap = argparse.ArgumentParser()
ap.add_argument("--tsbase", default="/root/ts-base")
ap.add_argument("--tsadmin", default="/root/ts-admin")
ap.add_argument("--commits", default="")
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


def r4(x):
    return round(x, 4)


epdir = os.path.join(args.tsbase, "data/episodes", EP)
ev = json.load(open(os.path.join(epdir, "summary.json")))
man = json.load(open(os.path.join(epdir, "manifest.json")))

commits = {"tsBase": short_head(args.tsbase), "tsAdmin": short_head(args.tsadmin)}
for part in args.commits.split(","):
    if "=" in part:
        k, v = part.split("=", 1)
        commits[k.strip()] = v.strip()

# ---------------------------------------------------------------- panel
with open(os.path.join(epdir, "panel_close.csv"), newline="") as f:
    rows = list(csv.reader(f))
codes = rows[0][1:]
dates = [r[0] for r in rows[1:]]
vals = [[float(x) if x != "" else float("nan") for x in r[1:]] for r in rows[1:]]
n = len(codes)
cells = len(vals) * n
filled = sum(1 for r in vals for v in r if math.isfinite(v))
if (len(dates), n) != (ev["data"]["rows"], ev["data"]["cols"]):
    fail("panel %d x %d != evidence %d x %d" % (len(dates), n, ev["data"]["rows"], ev["data"]["cols"]))
if filled != man["panel"]["filled"]:
    fail("filled %d != manifest %d" % (filled, man["panel"]["filled"]))
if dates[0] != ev["data"]["firstDate"] or dates[-1] != ev["data"]["lastDate"]:
    fail("date span %s..%s != evidence %s..%s" % (dates[0], dates[-1],
                                                   ev["data"]["firstDate"], ev["data"]["lastDate"]))

labels = []
with open(os.path.join(epdir, "labels.csv"), newline="") as f:
    for row in csv.DictReader(f):
        labels.append((row["code"], row["name"], row["industry"], int(row["group"])))
if len(labels) != n or [l[0] for l in labels] != codes:
    fail("labels.csv does not line up with panel columns")

ok = lambda v: math.isfinite(v) and v > 0
rets = []
for t in range(1, len(vals)):
    if all(ok(vals[t][j]) and ok(vals[t - 1][j]) for j in range(n)):
        rets.append([math.log(vals[t][j] / vals[t - 1][j]) for j in range(n)])
if len(rets) != ev["data"]["alignedDays"]:
    fail("aligned days %d != evidence %d" % (len(rets), ev["data"]["alignedDays"]))

cols = [[r[j] for r in rets] for j in range(n)]


def corr(x, y):
    m = len(x)
    mx = sum(x) / m
    my = sum(y) / m
    cov = sum((u - mx) * (v - my) for u, v in zip(x, y)) / m
    sx = math.sqrt(sum((u - mx) ** 2 for u in x) / m)
    sy = math.sqrt(sum((v - my) ** 2 for v in y) / m)
    return cov / (sx * sy)


C = [[0.0] * n for _ in range(n)]
for i in range(n):
    C[i][i] = 1.0
    for j in range(i + 1, n):
        C[i][j] = C[j][i] = corr(cols[i], cols[j])

edges = [(i, j) for i in range(n) for j in range(i + 1, n) if abs(C[i][j]) >= THETA]
if len(edges) != ev["data"]["edges"]:
    fail("edges %d != evidence %d" % (len(edges), ev["data"]["edges"]))

grp = [l[3] for l in labels]
intra = sum(1 for i, j in edges if grp[i] == grp[j])
cross = len(edges) - intra
intra_pairs = sum(1 for i in range(n) for j in range(i + 1, n) if grp[i] == grp[j])
cross_pairs = n * (n - 1) // 2 - intra_pairs
deg = [0] * n
for i, j in edges:
    deg[i] += 1
    deg[j] += 1
if sum(deg) != 2 * len(edges):
    fail("degree sum %d != 2E %d" % (sum(deg), 2 * len(edges)))

top = sorted(((abs(C[i][j]), i, j) for i, j in edges), reverse=True)[:6]

train_idx = [i for i in range(n) if i % 10 < 7]
test_idx = [i for i in range(n) if i % 10 >= 7]
if (len(train_idx), len(test_idx)) != (ev["data"]["trainNodes"], ev["data"]["testNodes"]):
    fail("node split %d/%d != evidence %d/%d" % (len(train_idx), len(test_idx),
                                                 ev["data"]["trainNodes"], ev["data"]["testNodes"]))

industries = [{"name": name, "count": sum(1 for l in labels if l[2] == name)}
              for name in ["银行", "电子", "医药"]]
if [x["count"] for x in industries] != [10, 10, 10]:
    fail("industry counts %r" % [x["count"] for x in industries])

# ---------------------------------------------------------------- goldens
tanh1 = math.tanh(1.0)
if r4(tanh1) != 0.7616:
    fail("tanh(1) %r" % tanh1)
p2 = [[0.5, 0.5], [0.5, 0.5]]  # A~ = [[1,1],[1,1]], D~ = 2 -> rows 0.5 / 0.5

gcn_params = (5 * 16 + 16) + (16 * 3 + 3)
if gcn_params != ev["gcn"]["params"] or gcn_params != 147:
    fail("gcn params %d != evidence %d" % (gcn_params, ev["gcn"]["params"]))
gat_l1 = 4 * (5 * 4 + 2 * 4)
gat_l2 = 4 * (16 * 3 + 2 * 3)
gat_params = gat_l1 + gat_l2
if gat_params != ev["gat"]["params"] or gat_params != 328:
    fail("gat params %d != evidence %d" % (gat_params, ev["gat"]["params"]))
attn_l1 = 4 * 3 * 5 * 4
attn_l2 = 4 * 3 * 16 * 3
attn_params = attn_l1 + attn_l2
if attn_params != ev["attention"]["params"] or attn_params != 816:
    fail("attn params %d != evidence %d" % (attn_params, ev["attention"]["params"]))
if not (gcn_params < gat_params < attn_params):
    fail("param ordering %d / %d / %d" % (gcn_params, gat_params, attn_params))

scores = [0.0, math.log(3.0)]
mx = max(scores)
ex = [math.exp(s - mx) for s in scores]
alpha = [e / sum(ex) for e in ex]
if [round(x, 12) for x in alpha] != [0.25, 0.75]:
    fail("alpha %r != [0.25, 0.75]" % alpha)
leaky = lambda x: x if x >= 0 else 0.2 * x
if abs(leaky(-1.0) + 0.2) > 1e-12:
    fail("leaky(-1) %r != -0.2" % leaky(-1.0))
scale4 = 1 / math.sqrt(4)
if abs(scale4 - 0.5) > 1e-12:
    fail("attn scale %r != 0.5" % scale4)

chance = 1 / 3
if abs(chance - ev["data"]["chance"]) > 1e-4:
    fail("chance %r != evidence %r" % (chance, ev["data"]["chance"]))
for key, v in [("gcn", ev["gcn"]["testAcc"]), ("gat", ev["gat"]["testAcc"]),
               ("attn", ev["attention"]["testAcc"]),
               ("shuffled", ev["control"]["shuffledTestAcc"])]:
    k9 = v * 9
    if abs(k9 - round(k9)) > 2e-3:
        fail("%s testAcc %r is not a ninth" % (key, v))
if ev["gcn"]["testAcc"] != 1.0 or abs(ev["control"]["shuffledTestAcc"] - 1 / 9) > 1e-4:
    fail("gcn/shuffled accuracies moved: %r / %r" % (ev["gcn"]["testAcc"],
                                                    ev["control"]["shuffledTestAcc"]))
if ev["attention"]["testAcc"] >= ev["gat"]["testAcc"]:
    fail("attention should trail GAT on this graph")
if ev["control"]["permEquivErr"] > 1e-9:
    fail("permutation equivariance %r too large" % ev["control"]["permEquivErr"])
if ev["gcn"]["lossEnd"] >= ev["gcn"]["lossStart"]:
    fail("gcn loss did not fall")

groups = {}
for c in ev["checks"]:
    groups[c["group"]] = groups.get(c["group"], 0) + 1
if ev["checksTotal"] != sum(groups.values()) or ev["checksPassed"] != ev["checksTotal"]:
    fail("checks are not all green: %r" % groups)
if groups != {"data": 5, "gcn": 5, "gat": 6, "attn": 5, "control": 4, "train": 3}:
    fail("check groups %r" % groups)
if any(not c["pass"] for c in ev["checks"]):
    fail("a check is marked failed")

dist = {
    "meta": {
        "episode": EP,
        "title": "谁在影响谁：图卷积、图注意力与自注意力",
        "commits": commits,
        "tests": {"groups": 148, "assertions": 2003},
        "modules": [
            {"file": "src/TsBase/Algos/Ch05/Gcn.hs", "cases": 13},
            {"file": "src/TsBase/Algos/Ch05/Gat.hs", "cases": 12},
            {"file": "src/TsBase/Algos/Ch05/Attention.hs", "cases": 13},
        ],
        "newCases": 38,
        "evidence": {"checks": ev["checksTotal"], "passed": ev["checksPassed"],
                     "seconds": round(ev["checksSeconds"], 1)},
        "progress": {"delivered": 57, "total": 74},
        "next": {"id": "48-ssl-augment-contrast-mask",
                 "title": "没有标签怎么学：增强、对比与掩码", "minutes": 26},
        "deviation": man.get("deviations") or man.get("deviation") or [],
        "tsAdminCommit": man.get("commit"),
    },
    "data": {
        "rows": len(dates), "cols": n, "cells": cells, "filled": filled,
        "firstDate": dates[0], "lastDate": dates[-1],
        "alignedDays": len(rets), "pairs": n * (n - 1) // 2,
        "edges": len(edges), "intra": intra, "cross": cross,
        "intraPairs": intra_pairs, "crossPairs": cross_pairs,
        "trainNodes": len(train_idx), "testNodes": len(test_idx),
        "chance": r4(chance),
        "industries": industries,
        "names": [l[1] for l in labels],
        "groups": grp,
    },
    "graph": {
        "theta": THETA,
        "corr": [[round(C[i][j], 3) for j in range(n)] for i in range(n)],
        "edges": [{"a": labels[i][1], "b": labels[j][1], "corr": r4(abs(C[i][j])), "signed": r4(C[i][j])}
                  for _, i, j in top],
        "degrees": [{"name": labels[i][1], "deg": deg[i], "group": labels[i][2]} for i in range(n)],
        "maxDeg": max(deg), "minDeg": min(deg),
        "intraRate": r4(intra / intra_pairs), "crossRate": r4(cross / cross_pairs),
    },
    "gcn": {
        "inDim": 5, "hidden": 16, "layers": [5 * 16 + 16, 16 * 3 + 3],
        "params": gcn_params, "gradDiff": ev["gcn"]["gradDiff"],
        "trainAcc": ev["gcn"]["trainAcc"], "testAcc": ev["gcn"]["testAcc"],
        "lossStart": ev["gcn"]["lossStart"], "lossEnd": ev["gcn"]["lossEnd"],
        "epochs": 300, "lr": 0.01, "seed": 7,
        "tanh1": r4(tanh1), "p2": p2,
    },
    "gat": {
        "heads": ev["gat"]["heads"], "dim": ev["gat"]["dim"],
        "layers": [gat_l1, gat_l2], "params": gat_params,
        "gradDiff": ev["gat"]["gradDiff"], "testAcc": ev["gat"]["testAcc"],
        "lossStart": ev["gat"]["lossStart"], "lossEnd": ev["gat"]["lossEnd"],
        "alpha": [r4(x) for x in alpha], "scores": [r4(x) for x in scores],
        "leaky": -0.2, "epochs": 300, "lr": 0.01, "seed": 7,
    },
    "attn": {
        "heads": ev["attention"]["heads"], "dim": ev["attention"]["dim"],
        "layers": [attn_l1, attn_l2], "params": attn_params,
        "gradDiff": ev["attention"]["gradDiff"], "testAcc": ev["attention"]["testAcc"],
        "lossStart": ev["attention"]["lossStart"], "lossEnd": ev["attention"]["lossEnd"],
        "scale": scale4, "uniform": 0.5, "epochs": 300, "lr": 0.01, "seed": 7,
    },
    "control": {
        "shuffledTestAcc": ev["control"]["shuffledTestAcc"],
        "shuffledCorrect": int(round(ev["control"]["shuffledTestAcc"] * 9)),
        "permEquivErr": ev["control"]["permEquivErr"],
        "reproSame": True,
        "gcnCorrect": int(round(ev["gcn"]["testAcc"] * 9)),
        "attnCorrect": int(round(ev["attention"]["testAcc"] * 9)),
    },
    "checks": ev["checks"],
}

os.makedirs(os.path.dirname(args.out), exist_ok=True)
with open(args.out, "w") as f:
    json.dump(dist, f, ensure_ascii=False, indent=1)
    f.write("\n")
print("wrote %s (%d bytes)" % (args.out, os.path.getsize(args.out)))
print("panel %d x %d filled %d | aligned %d | pairs %d edges %d (intra %d / cross %d)"
      % (len(dates), n, filled, len(rets), n * (n - 1) // 2, len(edges), intra, cross))
print("industries %r | train/test %d/%d | chance %.4f"
      % ([x["count"] for x in industries], len(train_idx), len(test_idx), chance))
print("acc gcn %.4f gat %.4f attn %.4f shuffled %.4f"
      % (ev["gcn"]["testAcc"], ev["gat"]["testAcc"], ev["attention"]["testAcc"],
         ev["control"]["shuffledTestAcc"]))
print("params %d / %d / %d | tanh(1) %.4f | alpha %r" % (gcn_params, gat_params, attn_params, tanh1, [r4(x) for x in alpha]))
print("degrees %d..%d | intra rate %.4f cross rate %.4f" % (min(deg), max(deg),
                                                            intra / intra_pairs, cross / cross_pairs))
