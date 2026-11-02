#!/usr/bin/env python3
"""Assemble data/dist.json for episode 48 from the ts-base evidence summary.

Every number shown on screen is re-derived here from the raw windows / probe
files and the evidence summary; a mismatch aborts with EVIDENCE MISMATCH:
  * 1,000 unlabeled windows x 60 days; probe 50 rows, classes 17/17/16;
  * baseline 34/100 = 0.34, probe train 30 / test 20 (one cell = 5 pts);
  * encoder 3,008 params = (60*32+32) + (32*32+32);
  * masked encoder 5,852 params = (32*120+32) + (60*32+60);
  * InfoNCE goldens 0.5514 (= -ln(e/(e+2))) and ln 3 = 1.0986;
  * recon golden 9.0; demo arrays (flip / mixup / mask layout) recomputed here;
  * similarity row: softmax(sim/tau) sums to 1 and loss = -ln(w_pos).

Usage: python3 build/make_dist_data.py [--tsbase PATH] [--tsadmin PATH] [--out PATH]
"""
import argparse, csv, json, math, os, subprocess, sys

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
EP = "48-ssl-augment-contrast-mask"
TAU = 0.2
WIN = 60
MASK_FRAC = 0.15
BLOCK_FRAC = 0.10

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


epdir = os.path.join(args.tsbase, "data/episodes", EP)
ev = json.load(open(os.path.join(epdir, "summary.json")))
man = json.load(open(os.path.join(epdir, "manifest.json")))
commits = {"tsBase": short_head(args.tsbase), "tsAdmin": short_head(args.tsadmin)}

# ---------------------------------------------------------------- windows
with open(os.path.join(epdir, "windows.csv"), newline="") as f:
    rows = list(csv.reader(f))
head = rows[0]
if head != ["r%d" % (i + 1) for i in range(WIN)]:
    fail("windows.csv header %r" % head[:3])
wins = [[float(v) for v in row] for row in rows[1:]]
if len(wins) != ev["data"]["windows"] or len(wins[0]) != ev["data"]["length"]:
    fail("windows %d x %d != evidence %d x %d" % (len(wins), len(wins[0]),
                                                   ev["data"]["windows"], ev["data"]["length"]))
if any(len(w) != WIN for w in wins):
    fail("a window is not %d days" % WIN)

# ---------------------------------------------------------------- probe
with open(os.path.join(epdir, "probe.csv"), newline="") as f:
    prows = list(csv.DictReader(f))
if len(prows) != ev["data"]["probe"]:
    fail("probe rows %d != evidence %d" % (len(prows), ev["data"]["probe"]))
classes = [0, 0, 0]
for p in prows:
    classes[int(p["group"])] += 1
if classes != ev["data"]["classes"]:
    fail("probe classes %r != evidence %r" % (classes, ev["data"]["classes"]))
baseline = max(classes) / len(prows)
if abs(baseline - ev["data"]["baseline"]) > 1e-9:
    fail("baseline %r != evidence %r" % (baseline, ev["data"]["baseline"]))

# one example window per industry, taken from the probe file
samples = []
for gi, short in enumerate(["电子", "银行", "券商"]):
    p = next(q for q in prows if int(q["group"]) == gi)
    seq = [round(float(p["r%d" % (i + 1)]), 4) for i in range(WIN)]
    samples.append({"short": short, "code": p["code"], "series": seq})

# ---------------------------------------------------------------- manifest
u = man["universe"]
if u["codes"] != 300 or u["stocks_with_windows"] != 292 or u["candidate_windows"] != 32878:
    fail("manifest universe moved: %r" % u)
if man["probe"]["majority_baseline"] != baseline:
    fail("manifest baseline %r != %.2f" % (man["probe"]["majority_baseline"], baseline))

# ---------------------------------------------------------------- demo arrays
dm = ev["demo"]
for k in ["base", "jitter", "scaling", "warp", "flip", "partner", "mixup"]:
    if len(dm[k]) != WIN:
        fail("demo %s has %d points" % (k, len(dm[k])))
if dm["flip"] != list(reversed(dm["base"])):
    fail("flip is not the reversed window")
for a, b, m in zip(dm["base"], dm["partner"], dm["mixup"]):
    if abs(0.5 * a + 0.5 * b - m) > 1e-4:
        fail("mixup lambda=0.5 mismatch: %r %r -> %r" % (a, b, m))
if not any(abs(a - b) > 1e-6 for a, b in zip(dm["base"], dm["jitter"])):
    fail("jitter changed nothing")
if dm["jitter"] == dm["scaling"]:
    fail("scaling equals jitter")

midx = dm["maskIdx"]
bidx = dm["blockIdx"]
if len(midx) != 9 or len(bidx) != 6:
    fail("mask indices %r / block %r" % (midx, bidx))
if bidx != list(range(bidx[0], bidx[0] + 6)):
    fail("block mask is not contiguous: %r" % bidx)
mi = dm["maskedInput"]
if len(mi) != 2 * WIN:
    fail("maskInput length %d != %d" % (len(mi), 2 * WIN))
for j in range(WIN):
    want = 0.0 if j in midx else dm["base"][j]
    if abs(mi[j] - want) > 1e-6:
        fail("masked input at %d: %r != %r" % (j, mi[j], want))
    flag = 1.0 if j in midx else 0.0
    if abs(mi[WIN + j] - flag) > 1e-6:
        fail("mask flag at %d: %r != %r" % (j, mi[WIN + j], flag))

# ---------------------------------------------------------------- similarity row
sims = dm["sims"]
w = dm["weights"]
if len(sims) != 4 or len(w) != 4:
    fail("similarity row %r / weights %r" % (sims, w))
ex = [math.exp(s / TAU) for s in sims]
tot = sum(ex)
for got, want in zip(w, [e / tot for e in ex]):
    if abs(got - want) > 2e-4:
        fail("softmax weight %r != %r" % (got, want))
if abs(sum(w) - 1.0) > 2e-4:
    fail("weights sum %r" % sum(w))
if abs(-math.log(w[0]) - dm["loss"]) > 2e-4:
    fail("demo loss %r != -ln(w0) %r" % (dm["loss"], -math.log(w[0])))
if abs(dm["tau"] - TAU) > 1e-9:
    fail("demo tau %r" % dm["tau"])

# ---------------------------------------------------------------- goldens
gold = -math.log(math.e / (math.e + 2))
if abs(gold - ev["contrast"]["infoNce"]) > 2e-4:
    fail("InfoNCE golden %r != evidence %r" % (gold, ev["contrast"]["infoNce"]))
if abs(math.log(3.0) - ev["contrast"]["uniform"]) > 2e-4:
    fail("uniform loss %r != ln3" % ev["contrast"]["uniform"])
if ev["mask"]["reconGolden"] != 9.0:
    fail("recon golden %r" % ev["mask"]["reconGolden"])

enc_params = (WIN * 32 + 32) + (32 * 32 + 32)
if enc_params != ev["contrast"]["params"] or enc_params != 3008:
    fail("encoder params %d != %d" % (enc_params, ev["contrast"]["params"]))
mask_params = (32 * 2 * WIN + 32) + (WIN * 32 + WIN)
if mask_params != ev["mask"]["params"] or mask_params != 5852:
    fail("mask params %d != %d" % (mask_params, ev["mask"]["params"]))

# ---------------------------------------------------------------- accuracies
test_n = ev["data"]["testProbe"]
for key in ["probeAcc"]:
    for sect in ["contrast", "mask"]:
        v = ev[sect][key]
        if abs(v * test_n - round(v * test_n)) > 2e-3:
            fail("%s %s = %r is not a 1/%d step" % (sect, key, v, test_n))
if not (ev["contrast"]["probeAcc"] > ev["mask"]["probeAcc"] >= baseline):
    fail("probe ordering: %r / %r / %r" % (ev["contrast"]["probeAcc"],
                                           ev["mask"]["probeAcc"], baseline))
if ev["control"]["untrainedProbe"] >= ev["contrast"]["probeAcc"]:
    fail("untrained probe should trail the trained one")
if ev["control"]["shuffledProbe"] > baseline:
    fail("shuffled labels should not beat the baseline")
warp_acc = next(p["acc"] for p in ev["probeTable"] if p["aug"] == "warp")
if warp_acc >= baseline:
    fail("warp is expected to fall below the baseline: %r" % warp_acc)
if ev["contrast"]["lossEnd"] >= ev["contrast"]["lossStart"]:
    fail("contrast loss did not fall")
if ev["mask"]["lossEnd"] >= ev["mask"]["lossStart"]:
    fail("mask loss did not fall")

groups = {}
for c in ev["checks"]:
    groups[c["group"]] = groups.get(c["group"], 0) + 1
if ev["checksTotal"] != sum(groups.values()) or ev["checksPassed"] != ev["checksTotal"]:
    fail("checks are not all green: %r" % groups)
if groups != {"data": 5, "augment": 5, "contrast": 6, "mask": 5, "control": 4, "train": 3}:
    fail("check groups %r" % groups)
if any(not c["pass"] for c in ev["checks"]):
    fail("a check is marked failed")

def correct(v):
    return int(round(v * test_n))

dist = {
    "meta": {
        "episode": EP,
        "title": "没有标签怎么办：增强、对比与掩码重构",
        "commits": commits,
        "manifestCommit": man.get("commit"),
        "tests": {"groups": 151, "assertions": 2060},
        "modules": [
            {"file": "src/TsBase/Algos/Ch05/Augment.hs", "cases": 29},
            {"file": "src/TsBase/Algos/Ch05/Contrast.hs", "cases": 13},
            {"file": "src/TsBase/Algos/Ch05/Mask.hs", "cases": 15},
        ],
        "newCases": 57,
        "evidence": {"checks": ev["checksTotal"], "passed": ev["checksPassed"],
                     "seconds": round(ev["checksSeconds"], 1)},
        "progress": {"delivered": 58, "total": 74},
        "next": {"id": "49-gaf-mtf-cote-multidomain",
                 "title": "把曲线画成图：GAF、MTF 与多域融合", "minutes": 22},
        "deviation": man.get("deviation") or [],
        "tsAdminCommit": man.get("commit"),
    },
    "data": {
        "windows": len(wins), "length": WIN, "stride": man["window"]["stride"],
        "pool": u["codes"], "withWindows": u["stocks_with_windows"],
        "candidates": u["candidate_windows"],
        "probe": len(prows), "classes": classes, "baseline": r4(baseline),
        "trainProbe": ev["data"]["trainProbe"], "testProbe": test_n,
        "industries": [{"short": g["short"], "count": g["want"]} for g in man["probe"]["groups"]],
    },
    "augment": {
        "jitterSigma": ev["augment"]["jitterSigma"],
        "scalingSigma": ev["augment"]["scalingSigma"],
        "warpPct": ev["augment"]["warpPct"],
        "mixupLambda": 0.5,
        "maskFrac": MASK_FRAC, "blockFrac": BLOCK_FRAC,
        "blockLen": len(bidx),
        "meanMaskRate": ev["augment"]["meanMaskRate"],
    },
    "demo": {
        "base": dm["base"], "jitter": dm["jitter"], "scaling": dm["scaling"],
        "warp": dm["warp"], "flip": dm["flip"], "partner": dm["partner"],
        "mixup": dm["mixup"],
        "maskIdx": midx, "blockIdx": bidx,
        "masked": mi[:WIN],
        "sims": sims, "weights": w, "loss": dm["loss"], "tau": dm["tau"],
    },
    "samples": samples,
    "contrast": {
        "tau": ev["contrast"]["tau"], "dim": ev["contrast"]["dim"],
        "batch": ev["contrast"]["batch"], "epochs": 12, "lr": 0.01,
        "layers": [WIN * 32 + 32, 32 * 32 + 32], "params": enc_params,
        "infoNce": ev["contrast"]["infoNce"], "uniform": ev["contrast"]["uniform"],
        "lossStart": ev["contrast"]["lossStart"], "lossEnd": ev["contrast"]["lossEnd"],
        "probeAcc": ev["contrast"]["probeAcc"], "correct": correct(ev["contrast"]["probeAcc"]),
        "seconds": ev["contrast"]["seconds"],
    },
    "mask": {
        "dim": ev["mask"]["dim"], "batch": ev["mask"]["batch"], "epochs": 10, "lr": 0.005,
        "layers": [32 * 2 * WIN + 32, WIN * 32 + WIN], "params": mask_params,
        "reconGolden": ev["mask"]["reconGolden"],
        "lossStart": ev["mask"]["lossStart"], "lossEnd": ev["mask"]["lossEnd"],
        "probeAcc": ev["mask"]["probeAcc"], "correct": correct(ev["mask"]["probeAcc"]),
        "seconds": ev["mask"]["seconds"],
    },
    "control": {
        "untrainedProbe": ev["control"]["untrainedProbe"],
        "untrainedCorrect": correct(ev["control"]["untrainedProbe"]),
        "shuffledProbe": ev["control"]["shuffledProbe"],
        "shuffledCorrect": correct(ev["control"]["shuffledProbe"]),
        "permEquivErr": ev["control"]["permEquivErr"],
    },
    "probeTable": ev["probeTable"],
    "checks": ev["checks"],
}

os.makedirs(os.path.dirname(args.out), exist_ok=True)
with open(args.out, "w") as f:
    json.dump(dist, f, ensure_ascii=False, indent=1)
    f.write("\n")
print("wrote %s (%d bytes)" % (args.out, os.path.getsize(args.out)))
print("windows %d x %d | probe %d %r | baseline %.2f | test %d"
      % (len(wins), WIN, len(prows), classes, baseline, test_n))
print("params encoder %d / mask %d | sims %r" % (enc_params, mask_params, [round(s, 3) for s in sims]))
print("acc contrast %.2f mask %.2f untrained %.2f shuffled %.2f warp %.2f"
      % (ev["contrast"]["probeAcc"], ev["mask"]["probeAcc"],
         ev["control"]["untrainedProbe"], ev["control"]["shuffledProbe"], warp_acc))
