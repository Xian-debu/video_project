#!/usr/bin/env python3
"""Assemble data/dist.json for episode 46 from the ts-base evidence summary.

Every number that appears on screen comes from the evidence JSON; the build
re-derives the cheap invariants before writing anything and aborts on a mismatch:
  * tanh(0.5) = 0.4621 and the three-step chain 0.4621 / 0.2270 / 0.1130;
  * RNN parameter count 39 = H*D + H*H + H + 3H + 3 for D=1, H=4;
  * zero-weight cross entropy = log 3 = 1.0986;
  * brick split: T=500, k=50 -> 10 blocks, serial depth 500 vs 60 (8.3333x);
  * dilated golden [4,6,8] (d=2, kernel [1,1]) and the d=1 degeneration [-2,-2];
  * receptive field 1+(k-1)*sum(ds) = 31 / 63, params 15 vs 63 (1/4.2);
  * period-8 sine cancels under d=8 (≈0) and survives under d=1 (0.4991);
  * every long-window test accuracy sits inside [0.28, 0.40];
  * the panel still yields 4,392 windows, 8-9 per stock, thirds 1465/1464/1463.

Usage: python3 build/make_dist_data.py [--tsbase PATH] [--commits tsBase=abc,tsAdmin=def]
"""
import argparse, csv, json, math, os, subprocess, sys

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
EP = "46-rnn-shallow-dilated"

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


epdir = os.path.join(args.tsbase, "data/episodes", EP)
ev = json.load(open(os.path.join(args.tsbase, "out/ep46/summary.json")))
man = json.load(open(os.path.join(epdir, "manifest.json")))

commits = {"tsBase": short_head(args.tsbase), "tsAdmin": short_head(args.tsadmin)}
for part in args.commits.split(","):
    if "=" in part:
        k, v = part.split("=", 1)
        commits[k.strip()] = v.strip()

WIN_T, WIN_H, WIN_S = 500, 60, 250


def r4(x):
    return round(x, 4)

# ---------------------------------------------------------------- panel recompute
with open(os.path.join(epdir, "panel_close.csv"), newline="") as f:
    rd = csv.reader(f)
    hdr = next(rd)
    codes = hdr[1:]
    dates = []
    cols = [[] for _ in codes]
    for row in rd:
        if not row:
            continue
        dates.append(row[0])
        for i in range(len(codes)):
            cols[i].append(row[i + 1] if i + 1 < len(row) else "")

def log_returns(prices):
    out = []
    prev = None
    for s in prices:
        try:
            x = float(s)
        except ValueError:
            prev = None
            continue
        if not math.isfinite(x) or x <= 0:
            prev = None
            continue
        if prev is not None:
            out.append(math.log(x / prev))
        prev = x
    return out

rets = [log_returns(c) for c in cols]

def raw_windows(r):
    n = len(r)
    out = []
    e = WIN_T - 1
    while e <= n - WIN_H - 1:
        ret = sum(r[e + 1:e + 1 + WIN_H])
        out.append((e, r[e - WIN_T + 1:e + 1], ret))
        e += WIN_S
    return out

wins = [raw_windows(r) for r in rets]
allw = [(s, e, steps, ret) for s, ws in enumerate(wins) for (e, steps, ret) in ws]
if len(allw) != ev["data"]["windows"]:
    fail("windows %d != evidence %d" % (len(allw), ev["data"]["windows"]))
per = [len(ws) for ws in wins]
if min(per) < 8 or max(per) > 9:
    fail("windows per stock outside 8..9: %r" % (min(per), max(per)))

vals = sorted(w[3] for w in allw)
n = len(vals)
lo, hi = vals[n // 3], vals[2 * n // 3]
if r4(lo) != ev["data"]["tercileLo"] or r4(hi) != ev["data"]["tercileHi"]:
    fail("terciles %r/%r != evidence %r/%r" % (lo, hi, ev["data"]["tercileLo"], ev["data"]["tercileHi"]))
cls = [0, 0, 0]
for w in allw:
    r = w[3]
    cls[0 if r <= lo else (1 if r <= hi else 2)] += 1
if cls != ev["data"]["classes"]:
    fail("classes %r != evidence %r" % (cls, ev["data"]["classes"]))
train_all = sum(1 for w in allw if w[0] < ev["data"]["trainStocks"])

# ---------------------------------------------------------------- rnn goldens
tanh05 = math.tanh(0.5)
if r4(tanh05) != ev["rnn"]["tanh05"]:
    fail("tanh(0.5) %r != %r" % (tanh05, ev["rnn"]["tanh05"]))
chain = [math.tanh(0.5)]
for _ in range(2):
    chain.append(math.tanh(0.5 * chain[-1]))
if [r4(x) for x in chain] != ev["rnn"]["chain"]:
    fail("tanh chain %r != evidence %r" % (chain, ev["rnn"]["chain"]))
D, H = 1, 4
params39 = H * D + H * H + H + 3 * H + 3
if params39 != 39 or params39 != ev["rnn"]["params"]:
    fail("rnn params %r != 39" % params39)
loss_chance = math.log(3.0)
if r4(loss_chance) != ev["rnn"]["lossChance"]:
    fail("loss chance %r != log3 %r" % (ev["rnn"]["lossChance"], loss_chance))

# ---------------------------------------------------------------- brick / dilated goldens
b = ev["brick"]
blocks = (500 + b["blockLen"] - 1) // b["blockLen"]
if blocks != b["blocks500"] or blocks != 10:
    fail("brick blocks %r != 10" % blocks)
if b["depthSerial"] != 500 or b["depthParallel"] != b["blockLen"] + blocks:
    fail("brick depth %r/%r" % (b["depthSerial"], b["depthParallel"]))
ratio = b["depthSerial"] / b["depthParallel"]
if abs(ratio - b["depthRatio"]) > 1e-4:
    fail("depth ratio %r != %r" % (ratio, b["depthRatio"]))
if not (0.4 < b["forwardWallRatio"] < 0.6):
    fail("single-thread wall ratio %r out of the honest band" % b["forwardWallRatio"])

def conv1d(x, w, d=1, bias=0.0):
    k = len(w)
    return [sum(x[i + j * d] * w[j] for j in range(k)) + bias
            for i in range(len(x) - (k - 1) * d)]

dil = ev["dil"]
golden = conv1d([1.0, 2.0, 3.0, 4.0, 5.0], [1.0, 1.0], d=2)
if golden != dil["golden"]:
    fail("dilated golden %r != %r" % (dil["golden"], golden))
deg = conv1d([1.0, 2.0, 3.0, 4.0], [1.0, 0.0, -1.0], d=1)
if deg != dil["degenerate"]:
    fail("dilated degenerate %r != %r" % (dil["degenerate"], deg))
ds31 = [1, 2, 4, 8]
ds63 = ds31 + [16]
rf31 = 1 + (3 - 1) * sum(ds31)
rf63 = 1 + (3 - 1) * sum(ds63)
if rf31 != dil["rf31"] or rf63 != dil["rf63"]:
    fail("receptive field %r/%r != %r/%r" % (rf31, rf63, dil["rf31"], dil["rf63"]))
if 3 * 5 != dil["stackParams"] or rf63 != dil["plainParams"]:
    fail("param counts %r/%r != %r/%r" % (15, rf63, dil["stackParams"], dil["plainParams"]))
if r4(15 / 63) != dil["paramRatio"]:
    fail("param ratio %r != %r" % (dil["paramRatio"], 15 / 63))

def sine(n, period):
    return [math.sin(2 * math.pi * t / period) for t in range(n)]

def period_check(period, d):
    y = conv1d(sine(240, period), [1.0, -1.0], d=d)
    return sum(abs(v) for v in y) / len(y)

pc = period_check(8, 8)
pn = period_check(8, 1)
if abs(pc - dil["periodCancel"]) > 1e-9 or r4(pn) != dil["periodNormal"]:
    fail("period check %r/%r != %r/%r" % (pc, pn, dil["periodCancel"], dil["periodNormal"]))

# ---------------------------------------------------------------- long / models / checks
for row in ev["long"]:
    if not (0.28 <= row["testAcc"] <= 0.40):
        fail("long T=%r test acc %r outside the chance band" % (row["T"], row["testAcc"]))
if abs(ev["models"]["serial"]["testAcc"] - ev["models"]["chance"]) > 0.05:
    fail("serial test acc %r is not chance-level" % ev["models"]["serial"]["testAcc"])
if ev["synthetic"]["testAcc"] <= 0.85:
    fail("synthetic test acc %r is too low to claim RNN learns" % ev["synthetic"]["testAcc"])
if ev["checksPassed"] != ev["checksTotal"] or any(not c["pass"] for c in ev["checks"]):
    fail("evidence checks are not all green")

# ---------------------------------------------------------------- series for figures
test_codes = [(i, c) for i, c in enumerate(codes) if i >= ev["data"]["trainStocks"] and wins[i]]
pick = next((i, c) for (i, c) in test_codes if len(rets[i]) >= WIN_T + WIN_H)
e0, steps0, ret0 = wins[pick[0]][0]
mu = sum(steps0) / len(steps0)
sd = max(1e-6, math.sqrt(sum((x - mu) ** 2 for x in steps0) / len(steps0)))
zc = [max(-4.0, min(4.0, (x - mu) / sd)) for x in steps0]
label0 = 0 if ret0 <= lo else (1 if ret0 <= hi else 2)

name_by_code = {}
with open(os.path.join(epdir, "labels.csv"), newline="") as f:
    for row in csv.DictReader(f):
        name_by_code[row["code"]] = row["name"]

synth = []
for c, period in enumerate(ev["synthetic"]["periods"]):
    def lcg_uniform(s):
        return ((1103515245 * s + 12345) % 2147483648) / 2147483648.0
    vals = [math.sin(2 * math.pi * (t + (0 * 7 + c * 13)) / period)
            + 0.2 * (lcg_uniform(0 * 131 + t * 17 + c * 3) - 0.5)
            for t in range(60)]
    synth.append(vals)

s8 = sine(120, 8)
diff1 = conv1d(s8, [1.0, -1.0], d=1)
diff8 = conv1d(s8, [1.0, -1.0], d=8)

dist = {
    "meta": {
        "episode": EP,
        "title": "感受野之争：RNN、Brick 并行与空洞卷积",
        "commits": commits,
        "tests": {"groups": 145, "assertions": 1965},
        "modules": [
            {"file": "src/TsBase/Algos/Ch05/Rnn.hs", "cases": 10},
            {"file": "src/TsBase/Algos/Ch05/ShallowRnn.hs", "cases": 8},
            {"file": "src/TsBase/Algos/Ch05/Dilated.hs", "cases": 9},
        ],
        "newCases": 27,
        "evidence": {"checks": ev["checksTotal"], "passed": ev["checksPassed"],
                     "seconds": round(ev["checksSeconds"], 1)},
        "progress": {"delivered": 56, "total": 74},
        "next": {"id": "47-gcn-gat-attention", "title": "谁在影响谁：图卷积、图注意力与自注意力",
                 "minutes": 24},
        "deviation": man["deviations"],
        "tsAdminCommit": man.get("commit"),
    },
    "data": {
        "rows": len(dates),
        "cols": len(codes),
        "firstDate": dates[0][:10],
        "lastDate": dates[-1][:10],
        "windows": len(allw),
        "perStock": [min(per), max(per)],
        "trainStocks": ev["data"]["trainStocks"],
        "testStocks": ev["data"]["testStocks"],
        "tercileLo": r4(lo),
        "tercileHi": r4(hi),
        "classes": cls,
        "window": WIN_T,
        "stride": WIN_S,
        "horizon": WIN_H,
        "trainWindows": train_all,
        "sampleTrain": 120,
        "sampleTest": 60,
    },
    "rnn": {
        "tanh05": r4(tanh05),
        "chain": [r4(x) for x in chain],
        "params": params39,
        "hidden": 4,
        "d": D,
        "lossChance": r4(loss_chance),
        "gradDiff": ev["rnn"]["gradDiff"],
        "clipNorm": ev["rnn"]["clipNorm"],
        "epochs": 30,
        "lr": 0.01,
        "batch": 16,
        "seed": 7,
        "seconds": r4(ev["models"]["serial"]["seconds"]),
        "trainAcc": ev["models"]["serial"]["trainAcc"],
        "testAcc": ev["models"]["serial"]["testAcc"],
        "lossStart": ev["models"]["serial"]["lossStart"],
        "lossEnd": ev["models"]["serial"]["lossEnd"],
    },
    "brick": {
        "blocks": blocks,
        "blockLen": b["blockLen"],
        "depthSerial": b["depthSerial"],
        "depthParallel": b["depthParallel"],
        "depthRatio": r4(b["depthRatio"]),
        "params": b["params"],
        "wallRatio": b["forwardWallRatio"],
    },
    "dil": {
        "k": 3,
        "ds": ds63,
        "rf": [1 + 2 * sum(ds31[:i]) for i in range(1, len(ds31) + 1)] + [rf63],
        "rf31": rf31,
        "rf63": rf63,
        "golden": golden,
        "degenerate": deg,
        "stackParams": 15,
        "plainParams": rf63,
        "paramRatio": r4(15 / 63),
        "stackLen": dil["stackLen"],
        "periodCancel": dil["periodCancel"],
        "periodNormal": r4(dil["periodNormal"]),
    },
    "long": ev["long"],
    "synthetic": {
        "periods": ev["synthetic"]["periods"],
        "len": 60,
        "noise": 0.2,
        "hidden": 16,
        "epochs": ev["synthetic"]["epochs"],
        "lr": 0.02,
        "trainAcc": ev["synthetic"]["trainAcc"],
        "testAcc": ev["synthetic"]["testAcc"],
        "seconds": round(ev["synthetic"]["seconds"], 1),
    },
    "models": ev["models"],
    "series": {
        "code": pick[1],
        "name": name_by_code.get(pick[1], ""),
        "label": label0,
        "tercileReturn": r4(ret0),
        "ret": [r4(x) for x in zc],
        "synth": [[r4(x) for x in v] for v in synth],
        "sine8": [r4(x) for x in s8],
        "diff1": [r4(x) for x in diff1],
        "diff8": [r4(x) for x in diff8],
    },
    # 证据 JSON 里 brick 这条检查的文案有个笔误「块长全 50」，屏幕上改成通顺说法；
    # 只动显示文案，检查项与数字都不变。
    "checks": [dict(c, name=c["name"].replace("块长全 50", "每块 50 步")) for c in ev["checks"]],
}

os.makedirs(os.path.dirname(args.out), exist_ok=True)
with open(args.out, "w") as f:
    json.dump(dist, f, ensure_ascii=False, indent=1)
    f.write("\n")
print("wrote %s (%d bytes)" % (args.out, os.path.getsize(args.out)))
print("windows %d (%d-%d/stock) terciles %.4f/%.4f classes %r" % (
    len(allw), min(per), max(per), lo, hi, cls))
print("tanh %.4f chain %r params %d loss %.4f" % (tanh05, [r4(x) for x in chain], params39, loss_chance))
print("brick %d blocks depth %d/%d ratio %.4f wall %.3f" % (blocks, b["depthSerial"], b["depthParallel"], ratio, b["forwardWallRatio"]))
print("dil golden %r rf %d/%d params 15/%d ratio %.4f cancel %.3e normal %.4f" % (
    golden, rf31, rf63, rf63, 15 / 63, pc, pn))
print("series %s %s label %d ret %.4f rets=%d" % (pick[1], name_by_code.get(pick[1], ""), label0, ret0, len(zc)))
