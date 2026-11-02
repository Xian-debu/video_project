#!/usr/bin/env python3
"""Assemble data/dist.json for episode 42 from the ts-base evidence summary.

Numbers on screen come from this file only: evidence JSON -> here -> TSX.
The four case windows are recomputed from the panel CSV and checked against
the evidence's leave-one-out predictions; a mismatch aborts the build.

Usage: python3 build/make_dist_data.py [--tsbase PATH] [--commits tsBase=abc,tsAdmin=def]
"""
import argparse, csv, json, math, os, re, sys

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
TS = "/root/ts-base"
EP = "42-ch05-tsclassification"

ap = argparse.ArgumentParser()
ap.add_argument("--tsbase", default=TS)
ap.add_argument("--commits", default="")
ap.add_argument("--out", default=os.path.join(ROOT, "data", "dist.json"))
args = ap.parse_args()

ev = json.load(open(os.path.join(args.tsbase, "inventory/evidence", EP + ".ch5-metrics.json")))
data_dir = os.path.join(args.tsbase, "data/episodes", EP)
checks_path = os.path.join(data_dir, "checks.txt")

commits = {"tsBase": "fc75bdf", "tsAdmin": "315cbb8"}
for part in args.commits.split(","):
    if "=" in part:
        k, v = part.split("=", 1)
        commits[k.strip()] = v.strip()

# ---------------------------------------------------------------- 数据读取
rows = list(csv.reader(open(os.path.join(data_dir, "panel_close.csv"))))
head = rows[0]
codes = head[1:]
cols = {c: [] for c in codes}
dates = []
for r in rows[1:]:
    dates.append(r[0])
    for c, v in zip(codes, r[1:]):
        cols[c].append(float(v) if v else float("nan"))

labels = {}
for r in csv.DictReader(open(os.path.join(data_dir, "labels.csv"))):
    labels[r["code"]] = {"name": r["name"], "group": r["group"]}

def log_returns(xs):
    out, prev = [], None
    for x in xs:
        if math.isnan(x) or math.isinf(x) or x <= 0:
            continue
        if prev is not None:
            out.append(math.log(x / prev))
        prev = x
    return out

rets = {c: log_returns(cols[c]) for c in codes}
W = 60

def zs(v):
    n = len(v)
    mu = sum(v) / n
    sd = math.sqrt(sum((x - mu) ** 2 for x in v) / n)
    if sd <= 0:
        return [x - mu for x in v]
    return [(x - mu) / sd for x in v]

order = [c for c in codes]
windows, truth = [], []
for i, c in enumerate(order):
    r = rets[c]
    span = max(1, len(r) - W + 1)
    st = (i * 977 + 31) % span
    windows.append(zs(r[st:st + W]))
    truth.append(("bank", "semi", "pharma").index(labels[c]["group"]))

def ed(a, b):
    return math.sqrt(sum((x - y) ** 2 for x, y in zip(a, b)))

def dtw_path(a, b, band=None):
    n, m = len(a), len(b)
    inf = float("inf")
    def ok(i, j):
        return band is None or abs(i - j) <= band
    D = [[inf] * m for _ in range(n)]
    D[0][0] = (a[0] - b[0]) ** 2
    for j in range(1, m):
        if ok(0, j):
            D[0][j] = D[0][j - 1] + (a[0] - b[j]) ** 2
    for i in range(1, n):
        if ok(i, 0):
            D[i][0] = D[i - 1][0] + (a[i] - b[0]) ** 2
        for j in range(1, m):
            if not ok(i, j):
                continue
            d = (a[i] - b[j]) ** 2
            D[i][j] = d + min(D[i - 1][j], D[i][j - 1], D[i - 1][j - 1])
    path = [(n - 1, m - 1)]
    i, j = n - 1, m - 1
    while i > 0 or j > 0:
        if i == 0:
            j -= 1
        elif j == 0:
            i -= 1
        else:
            cand = [(D[i - 1][j - 1], i - 1, j - 1), (D[i - 1][j], i - 1, j), (D[i][j - 1], i, j - 1)]
            cand = [c for c in cand if ok(c[1], c[2])]
            _, i, j = min(cand)
        path.append((i, j))
    path.reverse()
    return math.sqrt(D[n - 1][m - 1] / (n + m)), path, D

# ---------------------------------------------------------------- 留一核对
pred_ed, pred_dtw = [], []
for i in range(len(windows)):
    best, bc = float("inf"), -1
    for j in range(len(windows)):
        if j == i:
            continue
        d = ed(windows[i], windows[j])
        if d < best:
            best, bc = d, truth[j]
    pred_ed.append(bc)
best = {}
for i in range(len(windows)):
    bd, bc, bj = float("inf"), -1, -1
    for j in range(len(windows)):
        if j == i:
            continue
        d, _, _ = dtw_path(windows[i], windows[j], band=6)
        if d < bd:
            bd, bc, bj = d, truth[j], j
    best[i] = (bd, bc, bj)
pred_dtw = [best[i][1] for i in range(len(windows))]

# 带宽消融：不设 band（等价全矩阵），与证据里的 dtwFree 对账
pred_free = []
for i in range(len(windows)):
    bd, bc = float("inf"), -1
    for j in range(len(windows)):
        if j == i:
            continue
        d, _, _ = dtw_path(windows[i], windows[j], band=None)
        if d < bd:
            bd, bc = d, truth[j]
    pred_free.append(bc)

acc_ed = sum(1 for p, t in zip(pred_ed, truth) if p == t) / len(truth)
acc_dtw = sum(1 for p, t in zip(pred_dtw, truth) if p == t) / len(truth)
acc_free = sum(1 for p, t in zip(pred_free, truth) if p == t) / len(truth)
print("recomputed acc ED", round(acc_ed, 4), "DTW", round(acc_dtw, 4))
assert round(acc_ed, 4) == ev["main"]["ed"]["acc"], (acc_ed, ev["main"]["ed"]["acc"])
assert round(acc_dtw, 4) == ev["main"]["dtw"]["acc"], (acc_dtw, ev["main"]["dtw"]["acc"])
print("recomputed acc band-free", round(acc_free, 4))
assert round(acc_free, 4) == ev["main"]["dtwFree"]["acc"], (acc_free, ev["main"]["dtwFree"]["acc"])
assert [("bank", "semi", "pharma")[t] for t in truth] == [labels[c]["group"] for c in order]

# ---------------------------------------------------------------- 案例
def nearest_of(i):
    code = order[i]
    # ED 最近邻
    be, bj = float("inf"), -1
    for j in range(len(windows)):
        if j == i:
            continue
        d = ed(windows[i], windows[j])
        if d < be:
            be, bj = d, j
    bd, bj2 = best[i][0], best[i][2]
    dpath = dtw_path(windows[i], windows[bj2], band=6)[1]
    return {
        "code": code, "name": labels[code]["name"], "group": labels[code]["group"],
        "series": [round(v, 6) for v in windows[i]],
        "predEd": ("bank", "semi", "pharma")[pred_ed[i]],
        "predDtw": ("bank", "semi", "pharma")[pred_dtw[i]],
        "nnEd": {"code": order[bj], "name": labels[order[bj]]["name"], "dist": round(be, 4), "series": [round(v, 6) for v in windows[bj]]},
        "nnDtw": {"code": order[bj2], "name": labels[order[bj2]]["name"], "dist": round(bd, 4), "series": [round(v, 6) for v in windows[bj2]], "path": dpath},
    }

case_codes = ["sh600276", "sh688271", "sh603392", "sh601009"]
cases = [nearest_of(order.index(c)) for c in case_codes]
for c in cases:
    print("case", c["code"], c["name"], c["group"], "ED->", c["predEd"], "DTW->", c["predDtw"])

# ---------------------------------------------------------------- motif 演示
period, shift = 12, 5
a = [math.sin(2 * math.pi * t / period) for t in range(W)]
b = [math.sin(2 * math.pi * (t + shift) / period) for t in range(W)]
a, b = zs(a), zs(b)
motif_ed = ed(a, b)
motif_dtw, motif_path, motif_cost = dtw_path(a, b)
# 代价矩阵归一化到 0..1 供热图使用
flat = [v for row in motif_cost for v in row if math.isfinite(v)]
cmax = max(flat)
norm = [[round(min(1.0, v / cmax), 3) for v in row] for row in motif_cost]

# ---------------------------------------------------------------- worked examples
def prf(confusion):
    k = len(confusion)
    per = []
    for c in range(k):
        tp = confusion[c][c]
        fp = sum(confusion[i][c] for i in range(k)) - tp
        fn = sum(confusion[c][j] for j in range(k)) - tp
        p = tp / (tp + fp) if tp + fp else 0.0
        r = tp / (tp + fn) if tp + fn else 0.0
        f1 = 2 * p * r / (p + r) if p + r else 0.0
        per.append({"p": round(p, 4), "r": round(r, 4), "f1": round(f1, 4)})
    tot = sum(sum(row) for row in confusion)
    acc = sum(confusion[i][i] for i in range(k)) / tot
    sup = [sum(row) for row in confusion]
    macro = sum(per[i]["f1"] for i in range(k) if sup[i] > 0) / max(1, sum(1 for s in sup if s > 0))
    return {"confusion": confusion, "acc": round(acc, 4), "macroF1": round(macro, 4), "per": per}

worked = {
    # 三行业十窗：bank 2 全对、semi/pharma 各错一个互相串门。
    # accuracy 8/10 = 0.80，macro-F1 = (1 + .75 + .75)/3 = 0.8333。
    "balanced": prf([[2, 0, 0], [0, 3, 1], [0, 1, 3]]),
    # 两行业六窗：5 个 A、1 个 B，全判成 A。accuracy 5/6 = 0.8333，macro-F1 = 0.4545。
    "imbalanced": prf([[5, 0], [1, 0]]),
}

# ---------------------------------------------------------------- 检查表
checks = []
for line in open(checks_path):
    m = re.match(r"^(\S+)\t(.+)\t(pass|fail)$", line.rstrip("\n"))
    if m:
        checks.append({"g": m.group(1), "n": m.group(2), "ok": m.group(3) == "pass"})
groups = {}
for c in checks:
    g = groups.setdefault(c["g"], {"g": c["g"], "total": 0, "pass": 0})
    g["total"] += 1
    g["pass"] += 1 if c["ok"] else 0

mains = ev["main"]
out = {
    "meta": {
        "episode": EP,
        "title": "距离决定一切：从 1-NN+DTW 到弹性集成",
        "commits": commits,
        "tests": {"suites": 3, "assertions": sum(m["tests"] for m in ev["modules"])},
        "newCases": sum(m["tests"] for m in ev["modules"]),
        "evidence": {"checks": ev["checks"]["total"], "passed": ev["checks"]["passed"], "seconds": ev["checks"]["seconds"]},
        "progress": ev["progress"],
        "next": {"id": "43-shapelet-search-pips", "title": "Shapelet：从一条序列里挖出一小段判别力", "minutes": 20},
        "deviations": [
            "计划的三组各 30 只，湖里只有 25/18/17，按类内抽样与 macro 读数补不平衡",
            "计划的 CD 约 1.16 是算错的：k=3、N=20 下 q=2.343 给出 0.7409，证据里写更正",
        ],
    },
    "dataset": ev["dataset"],
    "main": {
        "ed": mains["ed"], "dtw": mains["dtw"], "ee": mains["ee"], "weights": mains["eeWeights"],
        "dtwFree": mains["dtwFree"],
    },
    "repeats": ev["repeats"],
    "synth": ev["synth"],
    "worked": worked,
    "cases": cases,
    "motif": {
        "period": period, "shift": shift,
        "a": [round(v, 6) for v in a], "b": [round(v, 6) for v in b],
        "ed": round(motif_ed, 6), "dtw": round(motif_dtw, 6),
        "path": motif_path, "cost": norm,
    },
    "checks": checks,
    "groups": sorted(groups.values(), key=lambda g: -g["total"]),
    "modules": ev["modules"],
}
json.dump(out, open(args.out, "w"), ensure_ascii=False, separators=(",", ":"))
print("wrote", args.out, os.path.getsize(args.out), "bytes")
print("checks", len(checks), "time", ev["checks"]["seconds"], "s")
print("motif ed", round(motif_ed, 4), "dtw", round(motif_dtw, 4))
print("worked", json.dumps(worked, ensure_ascii=False))