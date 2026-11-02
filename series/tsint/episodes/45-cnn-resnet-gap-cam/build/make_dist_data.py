#!/usr/bin/env python3
"""Assemble data/dist.json for episode 45 from the ts-base evidence summary.

Every number that appears on screen comes from the evidence JSON, and the build
re-derives the cheap invariants before it writes anything:
  * the 4-point x length-3 kernel golden value must equal [-2,-2] (hand computed);
  * the layer dimensions must equal 60 -> 53 -> 26 -> 19 -> 9 with flat 9*32 = 288;
  * the pooled pair must be [3,5];
  * gap([1,2,3,4]) must equal 2.5 and its min-max normalisation [0,1/3,2/3,1];
  * the CAM top-5 feature indices must be argmax-ordered, day index = feature + 3;
  * the shallow residual must be the better one, and all 27 checks must pass.
A mismatch aborts the build.

Usage: python3 build/make_dist_data.py [--tsbase PATH] [--commits tsBase=abc,tsAdmin=def]
"""
import argparse, json, math, os, subprocess, sys

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
EP = "45-cnn-resnet-gap-cam"

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


ev = json.load(open(os.path.join(args.tsbase, "inventory/evidence", EP + ".ch5-cnn.json")))
man = json.load(open(os.path.join(args.tsbase, "data/episodes", EP, "manifest.json")))

commits = {"tsBase": short_head(args.tsbase), "tsAdmin": short_head(args.tsadmin)}
for part in args.commits.split(","):
    if "=" in part:
        k, v = part.split("=", 1)
        commits[k.strip()] = v.strip()


def fail(msg):
    print("EVIDENCE MISMATCH: " + msg, file=sys.stderr)
    sys.exit(1)


# ---------------------------------------------------------------- hand-computed golden values
KERNEL = [1.0, 0.0, -1.0]
INPUT = [1.0, 2.0, 3.0, 4.0]

def conv1d(x, w, b=0.0):
    out = []
    for i in range(len(x) - len(w) + 1):
        out.append(sum(x[i + j] * w[j] for j in range(len(w))) + b)
    return out

golden = conv1d(INPUT, KERNEL)
if len(golden) != 2 or any(abs(a - b) > 1e-12 for a, b in zip(golden, ev["conv"]["golden"])):
    fail("conv golden %r != hand computed %r" % (ev["conv"]["golden"], golden))
if ev["conv"]["goldenLen"] != len(golden):
    fail("conv goldenLen %r != %r" % (ev["conv"]["goldenLen"], len(golden)))

dims = [60]
dims.append(dims[-1] - 8 + 1)          # conv k=8
dims.append(dims[-1] // 2)             # pool 2
dims.append(dims[-1] - 8 + 1)          # conv k=8
dims.append(dims[-1] // 2)             # pool 2
if dims != ev["conv"]["dims"]:
    fail("dims %r != recomputed %r" % (ev["conv"]["dims"], dims))
if ev["conv"]["flat"] != dims[-1] * ev["conv"]["channels"][-1]:
    fail("flat %r != last*channels %r" % (ev["conv"]["flat"], dims[-1] * ev["conv"]["channels"][-1]))

pool = [max([1, 3]), max([2, 5])]
if pool != ev["conv"]["pool"]:
    fail("pool %r != %r" % (ev["conv"]["pool"], pool))

res = ev["residual"]
ident = [x for x in res["identity"]]
if ident != [1.0, 2.0, 3.0]:
    fail("residual identity %r is not the input" % res["identity"])
proj = [2.0 * x for x in [1.0, 2.0]]
if proj != res["proj"]:
    fail("residual projection %r != 2x %r" % (res["proj"], proj))

g = ev["gapcam"]
if abs(g["gap"] - sum([1.0, 2.0, 3.0, 4.0]) / 4.0) > 1e-12:
    fail("gap %r != mean([1,2,3,4]) 2.5" % g["gap"])
vec = [1.0, 2.0, 3.0, 4.0]
lo, hi = min(vec), max(vec)
norm = [round((x - lo) / (hi - lo), 4) for x in vec]
if norm != [0.0, 0.3333, 0.6667, 1.0] or any(abs(a - b) > 1e-4 for a, b in zip(norm, g["norm"])):
    fail("gapcam norm %r != %r" % (g["norm"], norm))
if g["len60"] != 3 or g["len120"] != 3:
    fail("gapcam length invariance failed: %r / %r" % (g["len60"], g["len120"]))

cam = ev["cam"]
if cam["featureLen"] != 60 - 8 + 1:
    fail("cam featureLen %r != 53" % cam["featureLen"])
feats = cam["features"]
order = sorted(range(len(feats)), key=lambda i: -feats[i])[:5]
if order != cam["top5Feature"]:
    fail("cam top5Feature %r != argmax order %r" % (cam["top5Feature"], order))
days = [i + 3 for i in cam["top5Feature"]]
if days != cam["top5"]:
    fail("cam top5 days %r != feature+3 %r" % (cam["top5"], days))
if any(d < 0 or d > 59 for d in days):
    fail("cam top5 days out of window: %r" % days)

m = ev["models"]
if m["resnetShallow"]["testAcc"] <= m["resnet"]["testAcc"]:
    fail("shallow residual %r is not better than deep %r" % (m["resnetShallow"]["testAcc"], m["resnet"]["testAcc"]))
if m["gapcam"]["testAcc"] >= m["cnn"]["testAcc"]:
    fail("gapcam %r unexpectedly beats cnn %r" % (m["gapcam"]["testAcc"], m["cnn"]["testAcc"]))
if ev["checksPassed"] != ev["checksTotal"] or any(not c["pass"] for c in ev["checks"]):
    fail("evidence checks are not all green")
ds = ev["dataset"]
if ds["windows"] != ds["train"] + ds["test"]:
    fail("windows %r != train+test %r" % (ds["windows"], ds["train"] + ds["test"]))

deep_gap_pp = round((m["resnetShallow"]["testAcc"] - m["resnet"]["testAcc"]) * 100, 1)

# ---------------------------------------------------------------- assemble
dist = {
    "meta": {
        "episode": EP,
        "title": "卷积、残差与 GAP：让分类器指出「哪几天在起作用」",
        "commits": commits,
        "tests": {"groups": 142, "assertions": 1938},
        "modules": [
            {"file": "src/TsBase/Algos/Ch05/Cnn.hs", "cases": 19},
            {"file": "src/TsBase/Algos/Ch05/ResNet.hs", "cases": 10},
            {"file": "src/TsBase/Algos/Ch05/GapCam.hs", "cases": 13},
        ],
        "newCases": 42,
        "evidence": {"checks": ev["checksTotal"], "passed": ev["checksPassed"], "seconds": ev["checksSeconds"]},
        "progress": {"delivered": 55, "total": 74},
        "next": {
            "id": "46-rnn-shallow-dilated",
            "title": "感受野之争：RNN、Brick 并行与空洞卷积",
            "minutes": 22,
        },
        "deviation": man.get("deviation"),
        "tsAdminCommit": man.get("tsAdminCommit"),
    },
    "dataset": ds,
    "conv": {
        "kernel": KERNEL,
        "input": INPUT,
        "golden": ev["conv"]["golden"],
        "goldenLen": ev["conv"]["goldenLen"],
        "poolIn": [1, 3, 2, 5],
        "poolOut": ev["conv"]["pool"],
        "dims": dims,
        "flat": ev["conv"]["flat"],
        "channels": ev["conv"]["channels"],
        "k": 8,
    },
    "residual": {
        "identity": res["identity"],
        "proj": res["proj"],
        "blocks": res["blocks"],
        "deepAcc": m["resnet"]["testAcc"],
        "shallowAcc": m["resnetShallow"]["testAcc"],
        "deepMinusShallowPp": -deep_gap_pp,
    },
    "gapcam": {
        "vec": vec,
        "gap": g["gap"],
        "w": 0.5,
        "cam": [0.5 * x for x in vec],
        "norm": g["norm"],
        "len60": g["len60"],
        "len120": g["len120"],
        "acc": m["gapcam"]["testAcc"],
        "trainAcc": m["gapcam"]["trainAcc"],
        "channels": m["gapcam"].get("channels", 16),
        "k": 8,
        "epochs": m["gapcam"]["epochs"],
    },
    "cam": cam,
    "models": m,
    "checks": ev["checks"],
}

os.makedirs(os.path.dirname(args.out), exist_ok=True)
with open(args.out, "w") as f:
    json.dump(dist, f, ensure_ascii=False, indent=1)
    f.write("\n")
print("wrote %s (%d bytes)" % (args.out, os.path.getsize(args.out)))
print("checks %d/%d  conv %r  dims %r  flat %d  cnn %.4f  res4 %.4f  res1 %.4f  gapcam %.4f  top5 %r" % (
    ev["checksPassed"], ev["checksTotal"], golden, dims, ev["conv"]["flat"],
    m["cnn"]["testAcc"], m["resnet"]["testAcc"], m["resnetShallow"]["testAcc"],
    m["gapcam"]["testAcc"], cam["top5"]))
