#!/usr/bin/env python3
"""Assemble data/dist.json for episode 53 from the ts-base evidence summary.

Every number on screen is re-derived from daily.csv + manifest.json + summary.json;
a mismatch aborts with EVIDENCE MISMATCH:
  * 20 stocks x 10 candidates, 48,572 rows, bars 2,412-2,431, tune/test 362-365;
  * equal 10.1566 vs best 9.5498 vs mean single 11.2070 vs oracle 9.5397;
  * ridge weights improve 20/20 (5.16%), iterative eta=0.1 improves 20/20 (5.78%);
  * noise ensemble 10.6134 vs single variant mean 16.7067 (dev ratio 0.2649);
  * 28 checks in 8.9 s.

Usage: python3 build/make_dist_data.py [--tsbase PATH] [--tsadmin PATH] [--out PATH]
"""
import argparse, csv, json, os, statistics, subprocess, sys

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
EP = "53-ensemble-average-iter"

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
if codes != man["pool"]["chosen"]:
    fail("codes order differs from manifest chosen")
if len(rows) != man["files"]["daily.csv"]["rows"]:
    fail("rows %d vs manifest %d" % (len(rows), man["files"]["daily.csv"]["rows"]))

bars = [len(seen[c]) for c in codes]
if [min(bars), max(bars)] != rd["bars"]:
    fail("bars %r vs evidence %r" % ([min(bars), max(bars)], rd["bars"]))
for c in codes:
    if len(set(seen[c])) != len(seen[c]):
        fail("duplicate dates in %s" % c)

tune = [b - t for b, t in zip(bars, [s["train"] for s in rd["per_stock"]])]
for name, got, want in (("train", [s["train"] for s in rd["per_stock"]], rd["split"]["train"]),
                        ("tune", [s["tune"] for s in rd["per_stock"]], rd["split"]["tune"]),
                        ("test", [s["test"] for s in rd["per_stock"]], rd["split"]["test"])):
    if [min(got), max(got)] != want:
        fail("%s %r vs evidence %r" % (name, [min(got), max(got)], want))
for s in rd["per_stock"]:
    if s["train"] + s["tune"] + s["test"] != s["bars"]:
        fail("split of %s does not add up" % s["code"])

# ---------------------------------------------------------------- guards
eq, best, mean_s, naive = rd["equal"], rd["best_single"], rd["mean_single"], rd["naive"]
oracle, median, fit = rd["oracle"], rd["median"], rd["fit"]
noise = rd["noise"]
cands = rd["per_candidate"]
stocks = rd["per_stock"]
if len(cands) != 10 or [c["name"] for c in cands] != rd["candidates"]:
    fail("candidates %r" % [c["name"] for c in cands])
if len(stocks) != 20:
    fail("per_stock %d" % len(stocks))
if eq["mae"] <= best["mae"]:
    fail("documented negative result does not hold: equal %r <= best %r" % (eq["mae"], best["mae"]))
if abs(eq["mae"] / mean_s["mae"] - 1 + 0.0937) > 5e-4:
    fail("equal vs mean single %r" % (eq["mae"] / mean_s["mae"] - 1))
if abs(best["mae"] - statistics.mean([s["best_single"] for s in stocks])) > 2e-4:
    fail("best_single mean mismatch")
if abs(oracle["mae"] - statistics.mean([s["oracle"] for s in stocks])) > 2e-4:
    fail("oracle mean mismatch")
if abs(eq["mae"] - statistics.mean([s["equal"] for s in stocks])) > 2e-4:
    fail("equal mean mismatch")
if fit["wins_over_equal"] != 20:
    fail("ridge weights improve %r/20" % fit["wins_over_equal"])
if sum(1 for s in stocks if s["fit"] > s["equal"] + 1e-9) != 0:
    fail("ridge weights self-harm on some stock")
if sum(1 for s in stocks if s["equal"] <= s["best_single"] + 1e-9) != eq["wins_over_best"]:
    fail("equal wins_over_best mismatch")
if eq["wins_over_best"] != 0:
    fail("equal beat best on %d stocks" % eq["wins_over_best"])
if abs(fit["mae"] / eq["mae"] - 1 + 0.0516) > 5e-4:
    fail("fit vs equal %r" % (fit["mae"] / eq["mae"] - 1))
if not (0.02 < noise["dev_ratio"] < 0.5):
    fail("dev_ratio %r" % noise["dev_ratio"])
if noise["sigma0_max_diff"] != 0.0 or not noise["seed_same"]:
    fail("noise sigma=0 / seed check %r" % noise)
if abs(noise["ensemble"] - statistics.mean([s["noise_ens"] for s in stocks])) > 2e-4:
    fail("noise ensemble mean mismatch")
if abs(noise["single"] - statistics.mean([s["noise_single"] for s in stocks])) > 2e-4:
    fail("noise single mean mismatch")

iters = rd["iter_curve"]
if len(iters) != 8:
    fail("iter_curve rows %d" % len(iters))
i01 = [r for r in iters if r["eta"] == 0.1]
i05 = [r for r in iters if r["eta"] == 0.5]
if len(i01) != 4 or len(i05) != 4:
    fail("iter curve eta split")
if not all(i01[k]["test_mae"] > i01[k + 1]["test_mae"] for k in range(3)):
    fail("eta 0.1 test MAE is not monotone")
if not (i01[-1]["test_mae"] < eq["mae"]):
    fail("eta 0.1 round 10 does not beat equal")
if not (i05[-1]["test_mae"] < i01[-1]["test_mae"]):
    fail("eta 0.5 does not beat eta 0.1")
if i01[-1]["test_mae"] != 9.5588:
    fail("eta 0.1 round-10 test %r" % i01[-1]["test_mae"])

best_idx = [s["best_idx"] for s in stocks]
if len(best_idx) != 20 or not all(0 <= k < 10 for k in best_idx):
    fail("best_idx %r" % best_idx)
best_name_count = {}
for k in best_idx:
    best_name_count[rd["candidates"][k]] = best_name_count.get(rd["candidates"][k], 0) + 1

checks = [{"group": c["group"], "name": c["name"], "ok": c["ok"]} for c in ev["checks"]]
if len(checks) != ev["total"] or not all(c["ok"] for c in checks):
    fail("checks %d/%d" % (sum(1 for c in checks if c["ok"]), ev["total"]))

cand_doc = [{"name": c["name"], "tuneMae": c["tune_mae"], "testMae": c["test_mae"]} for c in cands]
stock_doc = [{
    "code": s["code"], "bars": s["bars"], "train": s["train"], "tune": s["tune"], "test": s["test"],
    "equal": s["equal"], "best": s["best_single"], "oracle": s["oracle"], "median": s["median"],
    "fit": s["fit"], "iter01": s["iter01_5"], "iter05": s["iter05_5"],
    "noiseSingle": s["noise_single"], "noiseEns": s["noise_ens"],
    "bestName": rd["candidates"][s["best_idx"]],
} for s in stocks]

mean = lambda xs: round(statistics.mean(xs), 4)
gains = {
    "equalVsBest": round(eq["mae"] / best["mae"] - 1, 4),
    "equalVsMean": round(1 - eq["mae"] / mean_s["mae"], 4),
    "fitVsEqual": round(1 - fit["mae"] / eq["mae"], 4),
    "iter01VsEqual": round(1 - i01[-1]["test_mae"] / eq["mae"], 4),
    "iter05VsEqual": round(1 - i05[-1]["test_mae"] / eq["mae"], 4),
    "iter05VsIter01": round(1 - i05[-1]["test_mae"] / i01[-1]["test_mae"], 4),
    "medianVsMean": round(1 - median["mae"] / mean_s["mae"], 4),
}

doc = {
    "meta": {
        "episode": ev["episode"],
        "slug": ev["slug"],
        "group": ev["group"],
        "title": "平均能赢平均，赢不过最强",
        "chapter": "ch06",
        "chapterName": "自动化模型设计",
        "runtimeTarget": 22,
        "next": {"id": 54, "title": "把架构搜索变成可微：DARTS 与三层搜索空间", "minutes": 26},
        "commits": commits,
    },
    "data": {
        "stocks": len(codes),
        "codes": codes,
        "rows": len(rows),
        "bars": rd["bars"],
        "split": {"train": rd["split"]["train"], "tune": rd["split"]["tune"], "test": rd["split"]["test"],
                  "fractions": [0.7, 0.15, 0.15]},
        "candidates": cand_doc,
    },
    "levels": {
        "meanSingle": mean_s["mae"], "equal": eq["mae"], "median": median["mae"],
        "fit": fit["mae"], "iter01": i01[-1]["test_mae"], "iter05": i05[-1]["test_mae"],
        "best": best["mae"], "oracle": oracle["mae"], "naive": naive["mae"],
        "noiseSingle": noise["single"], "noiseAvg": noise["avg_variant"], "noiseEns": noise["ensemble"],
    },
    "gains": gains,
    "bestCounts": best_name_count,
    "fit": {"winsOverEqual": fit["wins_over_equal"], "effW": fit["eff_w"],
            "sumMin": fit["weight_sum_min"], "sumMax": fit["weight_sum_max"]},
    "iters": [{"eta": r["eta"], "rounds": r["rounds"], "tuneMae": r["tune_mae"],
               "testMae": r["test_mae"], "removed": r["removed"]} for r in iters],
    "tally": {
        "fitLEEqual": 20,
        "fitLEBest": sum(1 for s in stocks if s["fit"] <= s["best_single"] + 1e-9),
        "iter01LEBest": sum(1 for s in stocks if s["iter01_5"] <= s["best_single"] + 1e-9),
        "medianLEBest": sum(1 for s in stocks if s["median"] <= s["best_single"] + 1e-9),
        "equalLEBest": sum(1 for s in stocks if s["equal"] <= s["best_single"] + 1e-9),
    },
    "noise": {"single": noise["single"], "avgVariant": noise["avg_variant"],
              "ensemble": noise["ensemble"], "devRatio": noise["dev_ratio"],
              "sigma0Diff": noise["sigma0_max_diff"], "seedSame": noise["seed_same"]},
    "stocks": stock_doc,
    "checks": checks,
    "seconds": rd["seconds"],
}

os.makedirs(os.path.dirname(args.out), exist_ok=True)
payload = json.dumps(doc, ensure_ascii=False, indent=1) + chr(10)
with open(args.out, "w", encoding="utf-8") as f:
    f.write(payload)
print("wrote %s (%d bytes)" % (os.path.relpath(args.out, ROOT), len(payload.encode())))
print("stocks %d rows %d bars %r split tune %r test %r" % (
    len(codes), len(rows), rd["bars"], rd["split"]["tune"], rd["split"]["test"]))
print("equal %.4f best %.4f mean %.4f oracle %.4f | fit %.4f iter01 %.4f iter05 %.4f noise %.4f/%.4f" % (
    eq["mae"], best["mae"], mean_s["mae"], oracle["mae"], fit["mae"],
    i01[-1]["test_mae"], i05[-1]["test_mae"], noise["avg_variant"], noise["ensemble"]))
print("checks %d/%d %.1fs | gains eq-best %+.2f%% eq-mean %+.2f%%" % (
    ev["passed"], ev["total"], rd["seconds"], gains["equalVsBest"] * 100, gains["equalVsMean"] * 100))
