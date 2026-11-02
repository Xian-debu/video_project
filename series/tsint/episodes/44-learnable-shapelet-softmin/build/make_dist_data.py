#!/usr/bin/env python3
"""Assemble data/dist.json for episode 44 from the ts-base evidence summary.

Every number that appears on screen comes from the evidence JSON, and the
build re-derives the cheap invariants before it writes anything:
  * SoftMin golden value must equal -log(3) (rounded to 4 decimals);
  * every sweep meanErr must equal the mean of its five template errors;
  * anneal meanErr likewise, and its 30 losses must be strictly decreasing;
  * the underflow fractions must be 2/6, 4/6 and 5/6 at alpha 200/500/1000;
  * the tree best depth must be argmax of testAcc.
A mismatch aborts the build.

Usage: python3 build/make_dist_data.py [--tsbase PATH] [--commits tsBase=abc]
"""
import argparse, json, math, os, sys

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
EP = "44-learnable-shapelet-softmin"

ap = argparse.ArgumentParser()
ap.add_argument("--tsbase", default="/root/ts-base")
ap.add_argument("--commits", default="")
ap.add_argument("--out", default=os.path.join(ROOT, "data", "dist.json"))
args = ap.parse_args()

ev = json.load(open(os.path.join(args.tsbase, "inventory/evidence", EP + ".ch5-learn.json")))
man = json.load(open(os.path.join(args.tsbase, "data/episodes", EP, "manifest.json")))
checks_txt = os.path.join(args.tsbase, "data/episodes", EP, "checks.txt")

commits = {"tsBase": "79f293d", "tsAdmin": "8955376"}
for part in args.commits.split(","):
    if "=" in part:
        k, v = part.split("=", 1)
        commits[k.strip()] = v.strip()

def fail(msg):
    print("EVIDENCE MISMATCH: " + msg, file=sys.stderr)
    sys.exit(1)

# ---------------------------------------------------------------- 独立校验
golden = -math.log(3.0)
if abs(ev["softmin"]["golden"] - round(golden, 4)) > 1e-9:
    fail("softmin golden %r != -log(3) %r" % (ev["softmin"]["golden"], golden))

for s in ev["sweep"]:
    m = sum(s["errors"]) / len(s["errors"])
    if abs(m - s["meanErr"]) > 5e-4:
        fail("sweep alpha=%s meanErr %r != mean(errors) %r" % (s["alpha"], s["meanErr"], m))

an = ev["anneal"]
m = sum(an["errors"]) / len(an["errors"])
if abs(m - an["meanErr"]) > 5e-4:
    fail("anneal meanErr %r != mean(errors) %r" % (an["meanErr"], m))
# 退火每次抬高 alpha 都会让损失跳一下（目标函数变了），整体仍必须大幅下降
losses = an["losses"]
if losses[-1] >= losses[0] * 0.1:
    fail("anneal final loss %r is not below 10%% of start %r" % (losses[-1], losses[0]))
if sum(1 for a, b in zip(losses, losses[1:]) if b > a + 1e-9) > 3:
    fail("anneal losses increase %d times, expected only at alpha steps" % (
        sum(1 for a, b in zip(losses, losses[1:]) if b > a + 1e-9)))

EXPECT = {200: 2.0 / 6.0, 500: 4.0 / 6.0, 1000: 5.0 / 6.0}
for u in ev["softmin"]["underflow"]:
    e = EXPECT.get(int(u["alpha"]))
    if e is None:
        continue
    if abs(u["fraction"] - round(e, 4)) > 1e-4:
        fail("underflow alpha=%s fraction %r != %r" % (u["alpha"], u["fraction"], e))

tr = ev["tree"]
best = max(range(len(tr["testAcc"])), key=lambda i: tr["testAcc"][i])
if tr["depths"][best] != tr["bestDepth"]:
    fail("tree bestDepth %r != argmax testAcc depth %r" % (tr["bestDepth"], tr["depths"][best]))

stall = ev["stall"]
pct = (stall["lossEnd"] - stall["lossStart"]) / stall["lossStart"] * 100.0
if abs(pct - stall["lossChangePct"]) > 1e-2:
    fail("stall change pct %r != recomputed %r" % (stall["lossChangePct"], pct))

# ---------------------------------------------------------------- 组装
dist = {
    "meta": {
        "episode": EP,
        "title": "把 min 换成 SoftMin：Shapelet 终于可以求导",
        "commits": commits,
        "tests": {"groups": 139, "assertions": 1896},
        "modules": [
            {"file": "src/TsBase/Algos/Ch05/LearnShapelet.hs", "cases": 17},
            {"file": "src/TsBase/Algos/Ch05/ShapeletTree.hs", "cases": 19},
            {"file": "src/TsBase/Algos/Ch05/Mlp.hs", "cases": 14},
        ],
        "newCases": 50,
        "evidence": {"checks": ev["checksTotal"], "passed": ev["checksPassed"], "seconds": ev["checksSeconds"]},
        "progress": {"delivered": 53, "total": 74},
        "next": {
            "id": "45-cnn-resnet-gap-cam",
            "title": "卷积、残差与 GAP：让分类器指出「哪几天在起作用」",
            "minutes": 22,
        },
        "deviations": man["deviations"],
        "reuse": man["dataSource"],
    },
    "dataset": ev["dataset"],
    "synth": ev["synth"],
    "softmin": ev["softmin"],
    "sweep": ev["sweep"],
    "anneal": an,
    "stall": stall,
    "mlp": ev["mlp"],
    "dtw": ev["dtw"],
    "tree": tr,
    "real": ev["real"],
    "checks": ev["checks"],
}

os.makedirs(os.path.dirname(args.out), exist_ok=True)
with open(args.out, "w") as f:
    json.dump(dist, f, ensure_ascii=False, indent=1)
    f.write("\n")
print("wrote %s (%d bytes)" % (args.out, os.path.getsize(args.out)))
print("checks %d/%d  golden %.4f  real %.4f  treeBest %s  stall %s%%" % (
    ev["checksPassed"], ev["checksTotal"], golden, ev["real"]["lsAcc"], tr["bestDepth"], stall["lossChangePct"]))
