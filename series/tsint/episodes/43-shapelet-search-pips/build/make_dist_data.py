#!/usr/bin/env python3
"""Assemble data/dist.json for episode 43 from the ts-base evidence summary.

Every number that appears on screen comes from the evidence JSON or is
recomputed here from the exported panel and cross-checked against it:
  * real sliding distances of the top shapelet must match the evidence;
  * ANOVA F / Kruskal-Wallis H and their p-values are recomputed;
  * the best split of the top shapelet is recomputed (gain 0.8475);
  * the worked F / H examples are recomputed to 13.5 / 3.857142857.
A mismatch aborts the build.

Usage: python3 build/make_dist_data.py [--tsbase PATH] [--commits tsBase=abc,tsAdmin=def]
"""
import argparse, csv, json, math, os, sys

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
TS = "/root/ts-base"
EP = "43-shapelet-search-pips"

ap = argparse.ArgumentParser()
ap.add_argument("--tsbase", default=TS)
ap.add_argument("--commits", default="")
ap.add_argument("--out", default=os.path.join(ROOT, "data", "dist.json"))
args = ap.parse_args()

ev = json.load(open(os.path.join(args.tsbase, "inventory/evidence", EP + ".ch5-shapelet.json")))
data_dir = os.path.join(args.tsbase, "data/episodes", EP)
checks_path = os.path.join(data_dir, "checks.txt")
manifest = json.load(open(os.path.join(data_dir, "manifest.json")))

commits = {"tsBase": "24fa1a0", "tsAdmin": "8955376"}
for part in args.commits.split(","):
    if "=" in part:
        k, v = part.split("=", 1)
        commits[k.strip()] = v.strip()

# ------------------------------------------------------------ 数据读取
rows = list(csv.reader(open(os.path.join(data_dir, "panel_close.csv"))))
head = rows[0]
codes = head[1:]
cols = {c: [] for c in codes}
dates = []
for r in rows[1:]:
    dates.append(r[0])
    for c, v in zip(codes, r[1:]):
        cols[c].append(float(v) if v else float("nan"))

labels = []
for r in csv.DictReader(open(os.path.join(data_dir, "labels.csv"))):
    labels.append({"code": r["code"], "name": r["name"], "group": r["group"]})
GIDX = {"electronics": 0, "pharma": 1, "equipment": 2}

def zs(v):
    n = len(v)
    mu = sum(v) / n
    sd = math.sqrt(sum((x - mu) ** 2 for x in v) / n)
    if sd <= 1e-12:
        return [0.0 for _ in v]
    return [(x - mu) / sd for x in v]

def last_window(xs, w=100):
    valid = [x for x in xs if not (math.isnan(x) or math.isinf(x))]
    return zs(valid[-w:])

def window_dist(q, w):
    wz = zs(w)
    return math.sqrt(sum((a - b) ** 2 for a, b in zip(q, wz)))

def slide_min(xs, q):
    q = zs(q)
    m = len(q)
    best, best_at = float("inf"), 0
    curve = []
    for i in range(len(xs) - m + 1):
        d = window_dist(q, xs[i:i + m])
        curve.append(d)
        if d < best:
            best, best_at = d, i
    return best, best_at, curve

series = {st["code"]: last_window(cols[st["code"]]) for st in labels}
assert all(len(v) == 100 for v in series.values()), "window length"

top = ev["real"]["top"]
tmpl = top["values"]
th = top["threshold"]
dist = []
best_pos = []
for st in labels:
    d, at, _ = slide_min(series[st["code"]], tmpl)
    dist.append(d)
    best_pos.append(at)

diff = max(abs(a - b) for a, b in zip(dist, ev["real"]["distances"]))
print("real distance maxdiff vs evidence: %.6f" % diff)
assert diff < 0.01, "distance mismatch"
assert [GIDX[st["group"]] for st in labels] == ev["real"]["labels"], "label order mismatch"

# 屏幕上的真实数据读数一律用证据里的距离（模板在 JSON 里存成 4 位小数，
# 本地重算的误差约 2e-4，足以在 15 个近邻对上换序，从而影响秩和 H）。
real_d = ev["real"]["distances"]
real_ls = ev["real"]["labels"]

# ------------------------------------------------------------ 统计检验
def mean(v):
    return sum(v) / len(v)

def entropy2(a, b):
    n = a + b
    if n <= 0:
        return 0.0
    h = 0.0
    for c in (a, b):
        if c > 0:
            p = c / n
            h -= p * math.log(p, 2)
    return h

def betacf(a, b, x):
    MAXIT, EPS, FPMIN = 200, 3e-14, 1e-300
    qab, qap, qam = a + b, a + 1.0, a - 1.0
    c = 1.0
    d = 1.0 - qab * x / qap
    if abs(d) < FPMIN:
        d = FPMIN
    d = 1.0 / d
    h = d
    for m in range(1, MAXIT + 1):
        m2 = 2 * m
        aa = m * (b - m) * x / ((qam + m2) * (a + m2))
        d = 1.0 + aa * d
        if abs(d) < FPMIN:
            d = FPMIN
        c = 1.0 + aa / c
        if abs(c) < FPMIN:
            c = FPMIN
        d = 1.0 / d
        h *= d * c
        aa = -(a + m) * (qab + m) * x / ((a + m2) * (qap + m2))
        d = 1.0 + aa * d
        if abs(d) < FPMIN:
            d = FPMIN
        c = 1.0 + aa / c
        if abs(c) < FPMIN:
            c = FPMIN
        d = 1.0 / d
        delt = d * c
        h *= delt
        if abs(delt - 1.0) < EPS:
            break
    return h

def betai(a, b, x):
    if x <= 0.0:
        return 0.0
    if x >= 1.0:
        return 1.0
    bt = math.exp(math.lgamma(a + b) - math.lgamma(a) - math.lgamma(b)
                  + a * math.log(x) + b * math.log(1.0 - x))
    if x < (a + 1.0) / (a + b + 2.0):
        return bt * betacf(a, b, x) / a
    return 1.0 - bt * betacf(b, a, 1.0 - x) / b

def f_sf(f, dfb, dfw):
    return betai(dfw / 2.0, dfb / 2.0, dfw / (dfw + dfb * f))

def anova(groups):
    k = len(groups)
    ns = [len(g) for g in groups]
    N = sum(ns)
    gm = sum(sum(g) for g in groups) / N
    ssb = sum(len(g) * (mean(g) - gm) ** 2 for g in groups)
    ssw = sum(sum((x - mean(g)) ** 2 for x in g) for g in groups)
    dfb, dfw = k - 1, N - k
    msb, msw = ssb / dfb, ssw / dfw
    f = msb / msw
    return {"f": f, "p": f_sf(f, dfb, dfw), "ssb": ssb, "ssw": ssw, "dfb": dfb, "dfw": dfw,
            "msb": msb, "msw": msw, "ns": ns, "means": [mean(g) for g in groups]}

def kruskal(groups):
    flat = [(x, g) for g, grp in enumerate(groups) for x in grp]
    flat.sort(key=lambda t: t[0])
    N = len(flat)
    ranks = [0.0] * N
    ties = 0
    i = 0
    while i < N:
        j = i
        while j + 1 < N and flat[j + 1][0] == flat[i][0]:
            j += 1
        r = (i + j) / 2.0 + 1.0
        for t in range(i, j + 1):
            ranks[t] = r
        if j > i:
            ties += (j - i + 1) ** 3 - (j - i + 1)
        i = j + 1
    h = 12.0 / (N * (N + 1)) * sum(sum(ranks[t] for t in range(N) if flat[t][1] == g) ** 2 / len(groups[g]) for g in range(len(groups))) - 3.0 * (N + 1)
    corr = 1.0 - ties / float(N ** 3 - N) if ties else 1.0
    h = h / corr
    p = math.exp(-h / 2.0) if len(groups) == 3 else None
    return {"h": h, "p": p, "ties": ties, "corr": corr, "n": N}

# 真实数据：对第 1 类（电子）做一对其余的检验
g0 = [[real_d[i] for i, g in enumerate(real_ls) if g == k] for k in (0, 1, 2)]
an_real = anova(g0)
kw_real = kruskal(g0)
print("real ANOVA F=%.4f p=%.4f (evidence %.4f / %.4f)" % (an_real["f"], an_real["p"], ev["real"]["anova"]["f"], ev["real"]["anova"]["p"]))
print("real KW H=%.4f p=%.4f (evidence %.4f / %.4f)" % (kw_real["h"], kw_real["p"], ev["real"]["kruskal"]["h"], ev["real"]["kruskal"]["p"]))
assert abs(an_real["f"] - ev["real"]["anova"]["f"]) < 2e-3
assert abs(an_real["p"] - ev["real"]["anova"]["p"]) < 2e-3
assert abs(kw_real["h"] - ev["real"]["kruskal"]["h"]) < 5e-2
assert abs(kw_real["p"] - ev["real"]["kruskal"]["p"]) < 5e-4

# 黄金小例（Haskell 证据里的三组固定数据）
fGroups = [[-4, -2, 0, 2, 4], [-4, -2, 0, 2, 4], [5, 7, 9, 11, 13]]
hGroups = [[1, 3], [2, 10, 12], [4, 5, 6, 7, 8, 9, 11]]
dGroups = [[1, 2, 3, 4, 5], [6, 7, 8, 9, 10], [1, 2, 3, 4, 100]]
anF = anova(fGroups)
kwH = kruskal(hGroups)
anD = anova(dGroups)
kwD = kruskal(dGroups)
print("worked F=%.6f p=%.6f H=%.6f p=%.6f | disagree F p=%.6f H p=%.6f" % (anF["f"], anF["p"], kwH["h"], kwH["p"], anD["p"], kwD["p"]))
assert abs(anF["f"] - 13.5) < 1e-9
assert abs(kwH["h"] - 3.857142857) < 1e-6
assert abs(anF["p"] - ev["worked"]["fP"]) < 5e-6
assert abs(kwH["p"] - ev["worked"]["hP"]) < 5e-6
assert abs(anD["p"] - ev["worked"]["disagree"]["fP"]) < 5e-6
assert abs(kwD["p"] - ev["worked"]["disagree"]["hP"]) < 5e-6

# ------------------------------------------------------------ 阈值分裂（复刻 bestSplitFor）
def best_split(ds, ls, cls):
    n = len(ds)
    pos_total = sum(1 for l in ls if l == cls)
    parent_h = entropy2(pos_total, n - pos_total)
    pairs = sorted(zip(ds, ls), key=lambda t: t[0])
    splits = []
    pos_acc = 0
    for k in range(n - 1):
        if pairs[k][1] == cls:
            pos_acc += 1
        if pairs[k][0] < pairs[k + 1][0]:
            nl, nr = k + 1, n - k - 1
            left_pos = pos_acc
            right_pos = pos_total - left_pos
            g = parent_h - (nl / n) * entropy2(left_pos, nl - left_pos) - (nr / n) * entropy2(right_pos, nr - right_pos)
            splits.append({"k": k, "threshold": (pairs[k][0] + pairs[k + 1][0]) / 2.0, "gain": g,
                           "left": nl, "right": nr, "leftPos": left_pos, "rightPos": right_pos})
    best = None
    for sp in reversed(splits):
        if best is None or sp["gain"] > best["gain"]:
            best = sp
    return best

gs = ev["gainSplit"]
bs = best_split(gs["distances"], gs["labels"], gs["class"])
print("gainSplit recomputed: gain=%.4f threshold=%.4f (evidence %.4f / %.4f)" % (bs["gain"], bs["threshold"], gs["gain"], gs["threshold"]))
assert abs(bs["gain"] - gs["gain"]) < 5e-4
assert abs(bs["threshold"] - gs["threshold"]) < 1e-3

ds = gs["distances"]
ls = gs["labels"]
pos = [d for d, l in zip(ds, ls) if l == gs["class"]]
neg = [d for d, l in zip(ds, ls) if l != gs["class"]]

# 单条 shapelet 滑动距离曲线（definitions 场景用）
sx = ev["synthExamples"][0]["values"]
st_tmpl = ev["top5"][0]["values"]
st_start = ev["top5"][0]["start"]
st_min, st_at, st_curve = slide_min(sx, st_tmpl)
print("basic slide: min=%.6f at %d (evidence start %d)" % (st_min, st_at, st_start))
assert abs(st_min) < 1e-6 and st_at == st_start

# ------------------------------------------------------------ PIPs 演示
pd = ev["pipsDemo"]
pser, ppips, prec = pd["series"], pd["pips"], pd["reconstruct"]
rmse_pips = math.sqrt(sum((a - b) ** 2 for a, b in zip(pser, prec)) / len(pser))

def interp_at(xs, idx, i):
    for a, b in zip(idx, idx[1:]):
        if a <= i <= b:
            t = (i - a) / (b - a)
            return xs[a] + t * (xs[b] - xs[a])
    return xs[i]

uni = [int(round(t)) for t in [i * 99 / 9.0 for i in range(10)]]
uni_rec = [interp_at(pser, uni, i) for i in range(len(pser))]
rmse_uni = math.sqrt(sum((a - b) ** 2 for a, b in zip(pser, uni_rec)) / len(pser))
print("PIPs %d points, rmse %.4f vs uniform %.4f" % (len(ppips), rmse_pips, rmse_uni))
assert len(ppips) == 10

# ------------------------------------------------------------ 真实案例窗
def pick(pred):
    cand = [i for i, st in enumerate(labels) if pred(i, st)]
    return min(cand, key=lambda i: dist[i])

case_idx = [
    pick(lambda i, st: st["group"] == "electronics"),
    pick(lambda i, st: st["group"] == "pharma"),
    pick(lambda i, st: st["group"] == "equipment"),
    max(range(len(labels)), key=lambda i: dist[i]),
]
cases = []
for i in case_idx:
    st = labels[i]
    d, at, _ = slide_min(series[st["code"]], tmpl)
    cases.append({"code": st["code"], "name": st["name"], "group": st["group"],
                  "dist": round(d, 4), "bestStart": at, "threshold": th,
                  "series": [round(x, 4) for x in series[st["code"]]]})

# ------------------------------------------------------------ 阈值分裂的 2x2 读数（150 条）
pred0 = [d <= th for d in real_d]
tp = sum(1 for i, g in enumerate(real_ls) if g == 0 and pred0[i])
fp = sum(1 for i, g in enumerate(real_ls) if g != 0 and pred0[i])
fn = sum(1 for i, g in enumerate(real_ls) if g == 0 and not pred0[i])
tn = sum(1 for i, g in enumerate(real_ls) if g != 0 and not pred0[i])
print("real split: tp=%d fp=%d fn=%d tn=%d" % (tp, fp, fn, tn))

# ------------------------------------------------------------ 检查表
checks = []
for line in open(checks_path):
    m = line.rstrip("\n").split("\t")
    if len(m) == 3 and m[2] in ("pass", "fail"):
        checks.append({"g": m[0], "n": m[1], "ok": m[2] == "pass"})
groups = {}
for c in checks:
    g = groups.setdefault(c["g"], {"g": c["g"], "total": 0, "pass": 0})
    g["total"] += 1
    g["pass"] += 1 if c["ok"] else 0
assert len(checks) == ev["checks"]["total"]
assert all(c["ok"] for c in checks)

# ------------------------------------------------------------ 组装
synth = dict(ev["synth"])
synth["speedup"] = round(synth["full"]["seconds"] / synth["pips"]["seconds"], 2)
synth["gainDelta"] = round(abs(synth["full"]["gain"] - synth["pips"]["gain"]), 4)
synth["candidatesSaved"] = synth["full"]["candidates"] - synth["pips"]["candidates"]

top5 = []
for h in ev["top5"]:
    top5.append({"len": h["len"], "start": h["start"], "series": h["series"], "class": h["class"],
                 "sourceLabel": 0 if h["series"] < 30 else (1 if h["series"] < 60 else 2),
                 "gain": h["gain"], "threshold": h["threshold"],
                 "values": h["values"], "seriesValues": h["seriesValues"]})
distinct = len({tuple(round(v, 2) for v in h["values"]) for h in top5})

real_groups = {}
for g, gv in zip(("electronics", "pharma", "equipment"), g0):
    sv = sorted(gv)
    real_groups[g] = {
        "n": len(gv), "mean": round(mean(gv), 4), "median": round(sv[len(sv) // 2], 4),
        "min": round(min(gv), 4), "max": round(max(gv), 4),
        "below": sum(1 for x in gv if x <= th),
    }

out = {
    "meta": {
        "episode": EP,
        "title": "Shapelet：从一条序列里挖出一小段判别力",
        "commits": commits,
        "tests": {"suites": 3, "assertions": 44},
        "newCases": 44,
        "evidence": {"checks": ev["checks"]["total"], "passed": ev["checks"]["passed"], "seconds": ev["checks"]["seconds"]},
        "progress": {"delivered": 52, "total": 74},
        "next": {"id": "44-learnable-shapelet-softmin", "title": "把 min 换成 SoftMin：Shapelet 终于可以求导", "minutes": 24},
        "deviations": [
            "计划的「最优 1.0 bit 附近」要拆开说：三分类一对其余的理论上界是 0.9183 bit，实测 0.8475；1.0 bit 是两类平衡数据的上界，同类实测 0.8938 —— 两个上界都上屏，不把上界当实测",
            "计划写沪深 300 里 150 只、2018-2024；C39/C27/C35 在沪深 300 内凑不出各 50 只，改全市场同门类各 50 只、2018-01-02..2025-12-31",
            "计划的 PIPs「候选压到 10%」实测 9.82%，增益损失 0.0000 bit（两条路径取到同一个模板）",
        ],
    },
    "dataset": dict(ev["dataset"], csvSha256=manifest["panel"]["csvSha256"][:12]),
    "synth": synth,
    "synthExamples": ev["synthExamples"],
    "top5": top5,
    "top5Distinct": distinct,
    "gainSplit": {"class": gs["class"], "gain": round(bs["gain"], 4), "threshold": round(bs["threshold"], 4),
                  "left": bs["left"], "right": bs["right"], "leftPos": bs["leftPos"], "rightPos": bs["rightPos"],
                  "distances": ds, "labels": ls,
                  "posDist": [round(x, 4) for x in sorted(pos)],
                  "negDist": [round(x, 4) for x in sorted(neg)]},
    "basic": {"series": sx, "template": st_tmpl, "start": st_at, "min": round(st_min, 4),
              "curve": [round(x, 4) for x in st_curve], "threshold": round(gs["threshold"], 4)},
    "pipsDemo": {"series": [round(x, 4) for x in pser], "pips": ppips,
                 "reconstruct": [round(x, 4) for x in prec],
                 "rmse": round(rmse_pips, 4), "rmseUniform": round(rmse_uni, 4)},
    "real": {"train": 45, "test": 105, "seconds": ev["real"]["seconds"], "accuracy": ev["real"]["accuracy"],
             "hits": ev["real"]["hits"], "chance": 0.3333,
             "anova": {"f": ev["real"]["anova"]["f"], "p": ev["real"]["anova"]["p"],
                       "means": [round(x, 4) for x in an_real["means"]], "ns": an_real["ns"],
                       "ssb": round(an_real["ssb"], 4), "ssw": round(an_real["ssw"], 4),
                       "msb": round(an_real["msb"], 4), "msw": round(an_real["msw"], 4),
                       "dfb": an_real["dfb"], "dfw": an_real["dfw"]},
             "kruskal": {"h": ev["real"]["kruskal"]["h"], "p": ev["real"]["kruskal"]["p"]},
             "top": {"len": top["len"], "series": top["series"], "class": top["class"],
                     "gain": top["gain"], "threshold": top["threshold"], "values": top["values"]},
             "distances": real_d, "labels": real_ls,
             "groups": real_groups,
             "split": {"threshold": round(th, 4), "tp": tp, "fp": fp, "fn": fn, "tn": tn,
                       "precision": round(tp / (tp + fp), 4) if tp + fp else 0.0,
                       "recall": round(tp / (tp + fn), 4) if tp + fn else 0.0}},
    "cases": cases,
    "worked": {
        "f": {"groups": fGroups, "f": round(anF["f"], 4), "p": round(anF["p"], 6),
              "ssb": round(anF["ssb"], 4), "ssw": round(anF["ssw"], 4),
              "msb": round(anF["msb"], 4), "msw": round(anF["msw"], 4),
              "dfb": anF["dfb"], "dfw": anF["dfw"], "means": anF["means"], "ns": anF["ns"]},
        "h": {"groups": hGroups, "h": round(kwH["h"], 6), "p": round(kwH["p"], 6),
              "ties": kwH["ties"], "corr": round(kwH["corr"], 4)},
        "disagree": {"groups": dGroups, "f": round(anD["f"], 4), "fP": round(anD["p"], 6),
                     "h": round(kwD["h"], 4), "hP": round(kwD["p"], 6)},
        "binary": ev["binary"],
    },
    "checks": checks,
    "groups": [groups[k] for k in ("data", "synth", "real", "worked") if k in groups],
    "modules": [
        {"path": "src/TsBase/Algos/Ch05/Shapelet.hs", "tests": 19},
        {"path": "src/TsBase/Algos/Ch05/Pips.hs", "tests": 11},
        {"path": "src/TsBase/Algos/Ch05/DistTest.hs", "tests": 14},
    ],
}

# JSON 没有 Infinity：自距离记无穷远的位置写成 null，屏幕上过滤掉。
def finite(o):
    if isinstance(o, float):
        return o if math.isfinite(o) else None
    if isinstance(o, list):
        return [finite(v) for v in o]
    if isinstance(o, dict):
        return {k: finite(v) for k, v in o.items()}
    return o


os.makedirs(os.path.dirname(args.out), exist_ok=True)
json.dump(finite(out), open(args.out, "w"), ensure_ascii=False, indent=1)
print("wrote", args.out, os.path.getsize(args.out), "bytes")