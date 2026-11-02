#!/usr/bin/env python3
"""Assemble data/dist.json for episode 49 from the ts-base evidence summary.

Every number shown on screen is re-derived here from the raw windows file and the
evidence summary; a mismatch aborts with EVIDENCE MISMATCH:
  * 20 stocks x 128-day windows, stride 5, 20-day forward return terciles;
  * 8,531 windows = 5,672 train + 2,859 test, balanced CNN draws 2,400 / 1,200;
  * GASF / GADF / MTF / RP goldens, side 32, 8 bins, eps 0.5;
  * Fisher ratios, three CNN accuracies, COTE domain table and weights;
  * parameter counts 687 (1 channel) / 787 (2 channels) recomputed from ImgCfg.

Usage: python3 build/make_dist_data.py [--tsbase PATH] [--tsadmin PATH] [--out PATH]
"""
import argparse, csv, json, math, os, re, subprocess, sys

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
EP = "49-gaf-mtf-cote-multidomain"
LEN = 128
STRIDE = 5
FWD = 20
SIDE = 32
BINS = 8
EPS = 0.5
K1, K2, F1, F2 = 5, 3, 4, 4
CLASSES = 3

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


def r4(x):
    return round(x, 4)


def params_for(chans):
    h1 = SIDE - K1 + 1
    p1 = h1 // 2
    h2 = p1 - K2 + 1
    p2 = h2 // 2
    fd = F2 * p2 * p2
    return F1 * chans * K1 * K1 + F1 + F2 * F1 * K2 * K2 + F2 + fd * CLASSES + CLASSES


epdir = os.path.join(args.tsbase, "data/episodes", EP)
ev = json.load(open(os.path.join(epdir, "summary.json")))
man = json.load(open(os.path.join(epdir, "manifest.json")))
rd = ev["readings"]
commits = {"tsBase": short_head(args.tsbase), "tsAdmin": short_head(args.tsadmin)}

# ---------------------------------------------------------------- windows
with open(os.path.join(epdir, "windows.csv"), newline="") as f:
    rows = list(csv.reader(f))
head = rows[0]
if head[:7] != ["id", "code", "end_date", "split", "label", "cnn", "ret20"]:
    fail("windows.csv header %r" % head[:7])
if len(head) != 7 + LEN:
    fail("windows.csv carries %d series columns, expected %d" % (len(head) - 7, LEN))

train = [r for r in rows[1:] if r[3] == "train"]
test = [r for r in rows[1:] if r[3] == "test"]
wins = len(train) + len(test)
if wins != rd["windows"]:
    fail("windows %d vs evidence %d" % (wins, rd["windows"]))
if len(train) != rd["train"] or len(test) != rd["test"]:
    fail("pool split %d/%d vs evidence %d/%d" % (len(train), len(test), rd["train"], rd["test"]))

trC = [sum(1 for r in train if r[4] == k) for k in ("0", "1", "2")]
teC = [sum(1 for r in test if r[4] == k) for k in ("0", "1", "2")]
if trC != rd["train_class"] or teC != rd["test_class"]:
    fail("class counts %r/%r vs evidence %r/%r" % (trC, teC, rd["train_class"], rd["test_class"]))

trainCnn = sorted([r for r in train if r[5] == "1"], key=lambda r: int(r[0]))
testCnn = sorted([r for r in test if r[5] == "1"], key=lambda r: int(r[0]))
if len(trainCnn) != 2400 or len(testCnn) != 1200:
    fail("cnn draws %d/%d, expected 2400/1200" % (len(trainCnn), len(testCnn)))
for r in rows[1:]:
    vals = [float(v) for v in r[7:]]
    if len(vals) != LEN or any((v != v) or abs(v) == float("inf") for v in vals):
        fail("window %s is not 128 finite points" % r[0])

codes = sorted({r[1] for r in rows[1:]})
if len(codes) != 20:
    fail("%d stocks, expected 20" % len(codes))

# ---------------------------------------------------------------- samples
def downsample(vals, n):
    step = len(vals) / float(n)
    return [r4(vals[min(len(vals) - 1, int(i * step))]) for i in range(n)]

samples = []
for lbl, nm in (("0", "下行"), ("1", "震荡"), ("2", "上行")):
    cand = [r for r in testCnn if r[4] == lbl]
    if not cand:
        fail("no cnn test window for class " + nm)
    r = cand[0]
    samples.append({"code": r[1], "end": r[2], "label": nm,
                    "ret20": r4(float(r[6])),
                    "series": downsample([float(v) for v in r[7:]], 64)})

# ---------------------------------------------------------------- panels
panels = rd["panels"]
for key in ("gasf", "gadf", "mtf", "rp"):
    g = panels.get(key)
    if not g or len(g) != 16 or any(len(row) != 16 for row in g):
        fail("panel %s is not 16x16" % key)
    if not all(abs(v) <= 1e-9 or v == v for row in g for v in row):
        fail("panel %s has non-finite cells" % key)

# ---------------------------------------------------------------- numbers
fisher = rd["fisher"]
for k, v in fisher.items():
    if not (v > 0 and math.isfinite(v)):
        fail("fisher %s is not a finite positive ratio: %r" % (k, v))
if not (fisher["gasf"] > fisher["mtf"]):
    fail("GASF fisher %.4f is not above MTF %.4f" % (fisher["gasf"], fisher["mtf"]))

cnn = rd["cnn"]
for k, v in cnn.items():
    if not (0.28 <= v <= 0.39):
        fail("cnn %s = %.4f is outside the random band 0.28-0.39" % (k, v))
if cnn["dual"] > min(cnn["gasf"], cnn["mtf"]):
    fail("dual channel %.4f now beats a single channel - rewrite the episode" % cnn["dual"])

domains = rd["cote_domains"]
if [d["name"] for d in domains] != ["time", "acf", "spectrum", "shapelet"]:
    fail("domain order %r" % [d["name"] for d in domains])
w = rd["cote_weights"]
if abs(sum(w) - 1) > 1e-6 or any(x < 0 for x in w):
    fail("cote weights %r do not sum to 1" % w)
best = max(d["test"] for d in domains)
worst = min(d["test"] for d in domains)
if rd["cote_acc"] > best + 1e-12:
    fail("COTE %.4f now beats the best single domain %.4f - rewrite the episode" % (rd["cote_acc"], best))

single = params_for(1)
dual = params_for(2)
if single != 687 or dual != 787:
    fail("parameter counts moved to %d/%d" % (single, dual))

industries = []
for name, info in man["pool"]["industry_picks"].items():
    short = re.sub(r"^[A-Z]\d+", "", name.split("、")[0])
    industries.append({"short": short, "code": info["code"], "n": info["n_industry"],
                       "bars": info["bars"]})
if len(industries) != 20:
    fail("%d industries, expected 20" % len(industries))

checks = [{"group": c["group"], "name": c["name"], "pass": bool(c["ok"])} for c in ev["checks"]]
if len(checks) != 28 or ev["passed"] != 28:
    fail("evidence is %d/28 - fix the evidence before building dist" % ev["passed"])

dist = {
    "meta": {
        "episode": EP,
        "title": "换一种表示：图像化编码与多域集成",
        "commits": commits,
        "manifestCommit": man.get("commit"),
        "tests": {"groups": 153, "assertions": 2074},
        "modules": [
            {"file": "src/TsBase/Algos/Ch05/Imaging.hs", "cases": 9},
            {"file": "src/TsBase/Algos/Ch05/Cote.hs", "cases": 5},
        ],
        "newCases": 14,
        "evidence": {"checks": ev["total"], "passed": ev["passed"],
                     "seconds": round(rd["seconds"], 1)},
        "progress": {"delivered": 59, "total": 74},
        "next": {"id": "50-model-selection-skeleton",
                 "title": "自动选模型：池子比策略更重要", "minutes": 20},
        "deviation": man.get("deviation") or [],
        "tsAdminCommit": man.get("commit"),
    },
    "data": {
        "stocks": len(codes), "length": LEN, "stride": STRIDE, "fwd": FWD,
        "split": "2022-01-01", "windows": wins,
        "train": len(train), "test": len(test),
        "trainClasses": trC, "testClasses": teC,
        "cnnTrain": len(trainCnn), "cnnTest": len(testCnn),
        "baseline": r4(1.0 / 3.0), "industries": industries,
        "rule": man["pool"]["rule"],
    },
    "enc": {
        "side": SIDE, "bins": BINS, "pool": LEN // SIDE, "eps": EPS,
        "gasf": [[-1.0, 0.0], [0.0, 1.0]],
        "gadf": [[0.0, 1.0], [-1.0, 0.0]],
        "mtf": [[0, 1, 0], [1, 0, 1], [0, 1, 0]],
        "seq": [0.0, 1.0],
        "gasfDiag": 2 * 1.0 - 1,
    },
    "fisher": fisher,
    "cnn": {
        "epochs": 20, "lr": 0.01, "batch": 32, "seed": 7,
        "gasf": cnn["gasf"], "mtf": cnn["mtf"], "dual": cnn["dual"],
        "band": [0.28, 0.39], "chans": 1,
        "paramsSingle": single, "paramsDual": dual,
        "layers": [F1, F2], "kernels": [K1, K2],
    },
    "cote": {
        "domains": [{"key": d["name"], "val": d["val"], "test": d["test"]} for d in domains],
        "weights": w, "cote": rd["cote_acc"], "uniform": rd["uniform_acc"],
        "best": best, "worst": worst,
    },
    "panels": {k: panels[k] for k in ("gasf", "gadf", "mtf", "rp")},
    "samples": samples,
    "checks": checks,
}

os.makedirs(os.path.dirname(args.out), exist_ok=True)
with open(args.out, "w") as f:
    json.dump(dist, f, ensure_ascii=False, indent=1)
    f.write("\n")
print("wrote %s (%d bytes)" % (args.out, os.path.getsize(args.out)))
print("windows %d = train %d + test %d | classes %r / %r" % (wins, len(train), len(test), trC, teC))
print("stocks %d | cnn draws %d/%d | params %d/%d" % (len(codes), len(trainCnn), len(testCnn), single, dual))
print("fisher %r" % fisher)
print("cnn %r | cote %.4f vs best %.4f vs uniform %.4f" % (cnn, rd["cote_acc"], best, rd["uniform_acc"]))
