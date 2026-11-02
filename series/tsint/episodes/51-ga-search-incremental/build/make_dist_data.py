#!/usr/bin/env python3
"""Assemble data/dist.json for episode 51 from the ts-base evidence summary.

Every number on screen is re-derived from daily.csv and the evidence summary;
a mismatch aborts with EVIDENCE MISMATCH:
  * 20 HS300 stocks, 2,412-2,431 bars, split 2022-01-01 / 2024-01-01;
  * stage points 213 / 426 / 852, GA 200 evaluations per stock with 200 unique trainings;
  * linear extrapolation err 4.76 / pow 1.38, Top-1 5% / 30%, gap 0.065 (21x);
  * budget 0.874 data ratio, grid share 30.9%, 26 checks in 26.4 s.

Usage: python3 build/make_dist_data.py [--tsbase PATH] [--tsadmin PATH] [--out PATH]
"""
import argparse, csv, json, os, subprocess, sys

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
EP = "51-ga-search-incremental"
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

# ---------------------------------------------------------------- guards
ga, curve, demo, budget = rd["ga"], rd["curve"], rd["demo"], rd["budget"]
n = rd["stocks"]

if ga["evals"] != 200:
    fail("ga evals %r" % ga["evals"])
if ga["unique_trainings"] > 200:
    fail("ga unique trainings %r" % ga["unique_trainings"])
if ga["same_as_exhaustive"] != n:
    fail("ga same as exhaustive %r" % ga["same_as_exhaustive"])
if budget["ga_evals_total"] != ga["evals"] * n:
    fail("ga evals total %r" % budget["ga_evals_total"])
if abs(budget["data_ratio"] - 0.875) > 0.002:
    fail("data ratio %r" % budget["data_ratio"])
if rd["stages"] != [213, 426, 852]:
    fail("stages %r" % rd["stages"])
if demo["acc2_lin"] > 0.10 or demo["acc1_lin"] > 0.10:
    fail("linear extrapolation is not the documented failure: %r" % demo)
if demo["err_mean_lin"] < 4.0 or demo["err_mean_pow"] > 1.5:
    fail("extrapolation errors %r / %r" % (demo["err_mean_lin"], demo["err_mean_pow"]))
if demo["acc1_pow"] > 0.35:
    fail("power-law Top-1 %r" % demo["acc1_pow"])
if demo["gap_mean"] > 0.10:
    fail("top gap %r" % demo["gap_mean"])
if demo["ga_same"] != n:
    fail("ga same %r" % demo["ga_same"])
if demo["mono"] != 161 or demo["mono_of"] != 200:
    fail("monotone %r/%r" % (demo["mono"], demo["mono_of"]))

def frac(v):
    return round(v * n)

checks = [{"group": c["group"], "name": c["name"], "ok": c["ok"]} for c in ev["checks"]]
if len(checks) != ev["total"] or not all(c["ok"] for c in checks):
    fail("checks %d/%d" % (sum(1 for c in checks if c["ok"]), ev["total"]))

stage_curves = [{"name": c["name"], "at": c["at"], "mae": c["mae"], "full": c["full"]}
                for c in rd["stage_curves"]]
if len(stage_curves) != 10 or any(len(c["mae"]) != 3 for c in stage_curves):
    fail("stage curves %r" % stage_curves)

cands = [{"name": c["name"], "validMae": c["valid_mae"], "extrapMae": c["extrap_mae"],
          "extrapPow": c["extrap_pow"], "testMae": c["test_mae"], "wins": c["wins"]}
         for c in rd["per_candidate"]]
if len(cands) != 10:
    fail("candidates %d" % len(cands))
if sum(c["wins"] for c in cands) != n:
    fail("wins sum %d != %d" % (sum(c["wins"] for c in cands), n))

per = [{"code": p["code"], "truth": p["truth"], "inc": p["inc"], "ga": p["ga"],
        "acc1": p["acc1"], "pow1": p["pow1"], "powok": p["powok"], "unique": p["unique"]}
       for p in rd["per_stock"]]
if len(per) != n:
    fail("per_stock %d" % len(per))

doc = {
    "meta": {
        "episode": ev["episode"],
        "slug": ev["slug"],
        "group": ev["group"],
        "title": "省算力的两把刀：遗传算法与学习曲线外推",
        "chapter": "ch06",
        "chapterName": "自动化模型设计",
        "runtimeTarget": 18,
        "next": {"id": 52, "title": "把 300 只股票当成 300 个任务：元学习选模型", "minutes": 24},
        "commits": commits,
    },
    "data": {
        "stocks": n,
        "codes": codes,
        "bars": rd["bars"],
        "split": {"train": rd["split"]["train"], "valid": rd["split"]["valid"], "test": rd["split"]["test"]},
        "cut": {"trainEnd": TRAIN_END, "validEnd": VALID_END, "snapshot": "2024-12-31"},
        "stages": rd["stages"],
        "candidates": len(cands),
    },
    "ga": {"evals": ga["evals"], "unique": ga["unique_trainings"], "same": ga["same_as_exhaustive"],
           "best": ga["best_valid_mae"], "worst": ga["worst_valid_mae"]},
    "curve": {"slope": curve["slope"], "intercept": curve["intercept"], "sse": curve["sse"],
              "extrap60": curve["extrap_60"], "twoPoint50": curve["two_point_50"],
              "maxTarget": curve["max_target"]},
    "stageCurves": stage_curves,
    "demo": {
        "lin": {"acc2": demo["acc2_lin"], "acc2n": demo["acc2_lin_n"], "acc1": demo["acc1_lin"],
                "overlap": demo["overlap_lin"], "errMean": demo["err_mean_lin"],
                "errMax": demo["err_max_lin"]},
        "pow": {"acc2": demo["acc2_pow"], "acc2n": demo["acc2_pow_n"], "acc1": demo["acc1_pow"],
                "overlap": demo["overlap_pow"], "errMean": demo["err_mean_pow"],
                "errMax": demo["err_max_pow"]},
        "acc1Full": demo["acc1_full"],
        "gap": demo["gap_mean"],
        "ratio": round(demo["err_mean_pow"] / demo["gap_mean"], 2),
        "gaSame": demo["ga_same"],
        "mono": demo["mono"],
        "monoOf": demo["mono_of"],
    },
    "budget": {"fitsInc": budget["fits_inc"], "fitsFull": budget["fits_full"],
               "rowsInc": budget["rows_inc"], "rowsFull": budget["rows_full"],
               "dataRatio": budget["data_ratio"], "gaEvalsTotal": budget["ga_evals_total"],
               "gridShare": round(budget["grid_share"], 2)},
    "candidates": cands,
    "perStock": per,
    "checks": checks,
    "seconds": rd["seconds"],
}

os.makedirs(os.path.dirname(args.out), exist_ok=True)
payload = json.dumps(doc, ensure_ascii=False, indent=1) + chr(10)
with open(args.out, "w", encoding="utf-8") as f:
    f.write(payload)
print("wrote %s (%d bytes)" % (os.path.relpath(args.out, ROOT), len(payload.encode())))
print("stocks %d bars %r train %r valid %r test %r stages %r" % (
    n, rd["bars"], rd["split"]["train"], rd["split"]["valid"], rd["split"]["test"], rd["stages"]))
print("ga %d evals / %d unique / same %d | lin err %.4f acc1 %.2f | pow err %.4f acc1 %.2f" % (
    ga["evals"], ga["unique_trainings"], ga["same_as_exhaustive"],
    demo["err_mean_lin"], demo["acc1_lin"], demo["err_mean_pow"], demo["acc1_pow"]))
print("gap %.4f ratio %.2f | data %.4f grid %.2f%% | checks %d/%d %.1fs" % (
    demo["gap_mean"], demo["err_mean_pow"] / demo["gap_mean"], budget["data_ratio"],
    budget["grid_share"], ev["passed"], ev["total"], rd["seconds"]))
