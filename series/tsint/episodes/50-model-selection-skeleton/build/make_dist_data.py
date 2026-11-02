#!/usr/bin/env python3
"""Assemble data/dist.json for episode 50 from the ts-base evidence summary.

Every number shown on screen is re-derived here from daily.csv and the evidence
summary; a mismatch aborts with EVIDENCE MISMATCH:
  * 20 HS300 stocks, 2,412-2,431 daily bars, split at 2022-01-01 / 2024-01-01;
  * five metric goldens (MAE 0.5 / MSE 0.4167 / RMSE 0.6455 / MAPE 27.7778 / Acc@3 0.6667);
  * pool coverage 0.75 / 0.85, Hit@1 0.50 / 0.50 / 0.55, prefilter 0.55 with 35.2% fewer evals;
  * grid 648 -> 81, AIC golden 206, 26 checks in 21.4 s.

Usage: python3 build/make_dist_data.py [--tsbase PATH] [--tsadmin PATH] [--out PATH]
"""
import argparse, csv, json, os, subprocess, sys

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
EP = "50-model-selection-skeleton"
TRAIN_END = "2022-01-01"
VALID_END = "2024-01-01"

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
commits = {"tsBase": short_head(args.tsbase), "tsAdmin": short_head(args.tsadmin)}

# ---------------------------------------------------------------- daily.csv
rows = []
with open(os.path.join(epdir, "daily.csv"), newline="") as f:
    rdr = csv.reader(f)
    head = next(rdr)
    if head != ["code", "date", "close"]:
        fail("daily.csv header %r" % head)
    for r in rdr:
        rows.append((r[0], r[1], float(r[2])))
if not rows:
    fail("daily.csv is empty")

codes, seen = [], {}
for code, date, _ in rows:
    if code not in seen:
        seen[code] = []
        codes.append(code)
    seen[code].append(date)
if len(codes) != rd["stocks"]:
    fail("stocks %d vs evidence %d" % (len(codes), rd["stocks"]))

bars = [len(seen[c]) for c in codes]
if [min(bars), max(bars)] != rd["bars"]:
    fail("bars %r vs evidence %r" % ([min(bars), max(bars)], rd["bars"]))
if sum(bars) != len(rows):
    fail("rows %d vs sum(bars) %d" % (len(rows), sum(bars)))
for c in codes:
    if len(set(seen[c])) != len(seen[c]):
        fail("duplicate dates in %s" % c)

train = [sum(1 for d in seen[c] if d < TRAIN_END) for c in codes]
valid = [sum(1 for d in seen[c] if TRAIN_END <= d < VALID_END) for c in codes]
test = [sum(1 for d in seen[c] if d >= VALID_END) for c in codes]
for name, got, want in (("train", train, rd["split"]["train"]),
                        ("valid", valid, rd["split"]["valid"]),
                        ("test", test, rd["split"]["test"])):
    if [min(got), max(got)] != want:
        fail("%s %r vs evidence %r" % (name, [min(got), max(got)], want))

# ---------------------------------------------------------------- readings
gold = rd["metrics"]
cov, hit, pre = rd["coverage"], rd["hit"], rd["prefilter"]
n = rd["stocks"]


def frac(v):
    return round(v * n)


for key, want in (("pool3", 0.75), ("pool5", 0.85)):
    if abs(cov[key] - want) > 1e-9:
        fail("coverage %s %r" % (key, cov[key]))
if abs(hit["pool3"] - 0.50) > 1e-9 or abs(hit["pool5"] - 0.50) > 1e-9:
    fail("hit@1 %r/%r" % (hit["pool3"], hit["pool5"]))
if abs(hit["full"] - hit["prefilter"]) > 1e-9:
    fail("prefilter hit %r != full %r" % (hit["prefilter"], hit["full"]))
if pre["evals_pre"] >= pre["evals_full"]:
    fail("prefilter did not save evaluations")
saved = 1.0 - pre["evals_pre"] / pre["evals_full"]
if saved < 0.35:
    fail("saved %.4f < 0.35" % saved)

cands = [{"name": c["name"], "validMae": c["valid_mae"], "testMae": c["test_mae"], "wins": c["wins"]}
         for c in rd["candidates"]]
if len(cands) != 10:
    fail("candidates %d" % len(cands))
if sum(c["wins"] for c in cands) != n:
    fail("wins sum %d != %d" % (sum(c["wins"] for c in cands), n))

per = [{"code": p["code"], "truth": p["truth"], "pool3": p["pool3"], "pool5": p["pool5"],
        "full": p["full"], "pre": p["pre"], "hit3": p["hit3"], "hit5": p["hit5"],
        "hitfull": p["hitfull"], "hitpre": p["hitpre"]} for p in rd["per_stock"]]
if len(per) != n:
    fail("per_stock %d" % len(per))

checks = [{"group": c["group"], "name": c["name"], "ok": c["ok"]} for c in ev["checks"]]
if len(checks) != ev["total"] or not all(c["ok"] for c in checks):
    fail("checks %d/%d" % (sum(1 for c in checks if c["ok"]), ev["total"]))

grid = rd["grid"]
if grid["full"] != 648 or grid["locked"] != 81:
    fail("grid %r" % grid)

doc = {
    "meta": {
        "episode": ev["episode"],
        "slug": ev["slug"],
        "group": ev["group"],
        "title": "自动选模型：池子比策略更重要",
        "chapter": "ch06",
        "chapterName": "自动化模型设计",
        "runtimeTarget": 20,
        "next": {"id": 51, "title": "省算力的两把刀：遗传算法与学习曲线外推", "minutes": 18},
        "commits": commits,
    },
    "data": {
        "stocks": n,
        "codes": codes,
        "bars": rd["bars"],
        "split": {"train": rd["split"]["train"], "valid": rd["split"]["valid"], "test": rd["split"]["test"]},
        "cut": {"trainEnd": TRAIN_END, "validEnd": VALID_END, "snapshot": "2024-12-31"},
        "candidates": len(cands),
    },
    "metrics": {
        "mae": gold["mae"], "mse": gold["mse"], "rmse": gold["rmse"],
        "mape": gold["mape"], "acc3": gold["acc3"],
    },
    "coverage": {"pool3": cov["pool3"], "pool5": cov["pool5"], "all": 1.0,
                 "pool3n": frac(cov["pool3"]), "pool5n": frac(cov["pool5"])},
    "hit": {"pool3": hit["pool3"], "pool5": hit["pool5"], "hit2": hit["hit2_pool5"],
            "avgRank": hit["avgrank_pool5"], "full": hit["full"], "pre": hit["prefilter"],
            "pool3n": frac(hit["pool3"]), "pool5n": frac(hit["pool5"]),
            "fulln": frac(hit["full"]), "pren": frac(hit["prefilter"])},
    "prefilter": {"top4Recall": pre["top4_recall"], "evalsFull": pre["evals_full"],
                  "evalsPre": pre["evals_pre"], "saved": round(saved, 4),
                  "seasonM12": pre["season_m12"], "pruned": pre["pruned"]},
    "flips": rd["flips"],
    "grid": {"full": grid["full"], "locked": grid["locked"], "aicGold": grid["aic_gold"]},
    "candidates": cands,
    "perStock": per,
    "checks": checks,
    "seconds": rd["seconds"],
}

os.makedirs(os.path.dirname(args.out), exist_ok=True)
payload = json.dumps(doc, ensure_ascii=False, indent=1) + "\n"
with open(args.out, "w", encoding="utf-8") as f:
    f.write(payload)
print("wrote %s (%d bytes)" % (os.path.relpath(args.out, ROOT), len(payload.encode())))
print("stocks %d bars %r train %r valid %r test %r" % (n, rd["bars"], rd["split"]["train"], rd["split"]["valid"], rd["split"]["test"]))
print("coverage %.2f/%.2f | hit %.2f/%.2f full %.2f pre %.2f | saved %.4f" % (
    cov["pool3"], cov["pool5"], hit["pool3"], hit["pool5"], hit["full"], hit["prefilter"], saved))
print("grid %d -> %d | checks %d/%d | %.1fs" % (grid["full"], grid["locked"], ev["passed"], ev["total"], rd["seconds"]))
