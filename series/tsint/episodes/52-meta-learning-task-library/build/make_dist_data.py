#!/usr/bin/env python3
"""Assemble data/dist.json for episode 52 from the ts-base evidence summary.

Every number on screen is re-derived from daily300.csv + manifest.json + summary.json;
a mismatch aborts with EVIDENCE MISMATCH:
  * 300 tasks, 1,535-2,431 bars, split 809-1,705 / 466-484 / 232-242;
  * Hit@1: meta 27.33% vs class mean 38.67% vs constant naive 43.33% vs TS2Vec 26.67%;
  * Pearson 0.9983, regret mean 0.0263 / max 3.2029, 29 checks in 30.9 s.

Usage: python3 build/make_dist_data.py [--tsbase PATH] [--tsadmin PATH] [--out PATH]
"""
import argparse, csv, json, os, statistics, subprocess, sys

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
EP = "52-meta-learning-task-library"
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
man = json.load(open(os.path.join(epdir, "manifest.json")))
commits = {"tsBase": short_head(args.tsbase), "tsAdmin": short_head(args.tsadmin)}

# ---------------------------------------------------------------- daily300.csv
rows = []
with open(os.path.join(epdir, "daily300.csv"), newline="") as f:
    rdr = csv.reader(f)
    head = next(rdr)
    if head != ["code", "date", "close"]:
        fail("daily300.csv header %r" % head)
    for r in rdr:
        rows.append((r[0], r[1], float(r[2])))
if not rows:
    fail("daily300.csv is empty")

codes, seen = [], {}
for code, date, _ in rows:
    if code not in seen:
        seen[code] = []
        codes.append(code)
    seen[code].append(date)
if len(codes) != rd["tasks"]:
    fail("tasks %d vs evidence %d" % (len(codes), rd["tasks"]))
if codes != man["pool"]["chosen"]:
    fail("codes order differs from manifest chosen")

bars = [len(seen[c]) for c in codes]
if [min(bars), max(bars)] != rd["bars"]:
    fail("bars %r vs evidence %r" % ([min(bars), max(bars)], rd["bars"]))
for c in codes:
    if len(set(seen[c])) != len(seen[c]):
        fail("duplicate dates in %s" % c)
if man["files"]["daily300.csv"]["rows"] != len(rows):
    fail("manifest rows %r vs csv %d" % (man["files"]["daily300.csv"]["rows"], len(rows)))

train = [sum(1 for d in seen[c] if d < TRAIN_END) for c in codes]
valid = [sum(1 for d in seen[c] if TRAIN_END <= d < VALID_END) for c in codes]
test = [sum(1 for d in seen[c] if d >= VALID_END) for c in codes]
for name, got, want in (("train", train, rd["split"]["train"]),
                        ("valid", valid, rd["split"]["valid"]),
                        ("test", test, rd["split"]["test"])):
    if [min(got), max(got)] != want:
        fail("%s %r vs evidence %r" % (name, [min(got), max(got)], want))

# ---------------------------------------------------------------- guards
meta, hold, tsv, cands, tasks = rd["meta"], rd["holdout"], rd["ts2vec"], rd["per_candidate"], rd["per_task"]
n = rd["tasks"]
if n != 300:
    fail("tasks %r" % n)
if rd["industries"] != 53:
    fail("industries %r" % rd["industries"])
if len(cands) != 10 or len(tasks) != n:
    fail("candidates %d / per_task %d" % (len(cands), len(tasks)))
if sum(c["wins"] for c in cands) != n:
    fail("wins sum %d" % sum(c["wins"] for c in cands))
if abs(cands[0]["wins"] / n - meta["hit_naive"]) > 5e-5:
    fail("naive wins %r vs hit_naive %r" % (cands[0]["wins"] / n, meta["hit_naive"]))
if abs(statistics.mean(meta["folds"]) - meta["hit_stats"]) > 1e-4:
    fail("fold mean %r vs hit_stats %r" % (statistics.mean(meta["folds"]), meta["hit_stats"]))
if abs(statistics.mean(tsv["folds"]) - tsv["hit"]) > 1e-4:
    fail("ts2vec fold mean %r vs hit %r" % (statistics.mean(tsv["folds"]), tsv["hit"]))
if meta["hit_stats"] >= meta["hit_class"] or meta["hit_stats"] >= meta["hit_naive"]:
    fail("documented negative result does not hold: %r" % meta)
rg = rd["regret"]
if abs(statistics.mean([t["regret"] for t in tasks]) - rg["mean"]) > 2e-4:
    fail("regret mean mismatch")
if abs(max(t["regret"] for t in tasks) - rg["max"]) > 2e-4:
    fail("regret max mismatch")
if abs(sum(1 for t in tasks if t["regret"] > 5e-5) - rg["wrong"]) > 6:
    fail("wrong picks mismatch %d vs %d" % (sum(1 for t in tasks if t["regret"] > 5e-5), rg["wrong"]))
if sum(c["n"] for c in rd["class_hit"]) != n:
    fail("class_hit sample sum %d" % sum(c["n"] for c in rd["class_hit"]))
if tsv["dim"] != 64 or tsv["gap"] > 0:
    fail("ts2vec %r" % tsv)
if rd["corr"] < 0.95:
    fail("corr %r" % rd["corr"])
if rd["fits"] != n * len(cands):
    fail("fits %r" % rd["fits"])

checks = [{"group": c["group"], "name": c["name"], "ok": c["ok"]} for c in ev["checks"]]
if len(checks) != ev["total"] or not all(c["ok"] for c in checks):
    fail("checks %d/%d" % (sum(1 for c in checks if c["ok"]), ev["total"]))

candidate_doc = [{"name": c["name"], "wins": c["wins"], "validMae": c["valid_mae"]} for c in cands]
task_doc = [{"code": t["code"], "truth": t["truth"], "pick": t["pick"],
             "regret": t["regret"], "cls": t["class"]} for t in tasks]
class_doc = [{"name": c["name"], "n": c["n"], "hit": c["hit"]} for c in rd["class_hit"]]
class_doc.sort(key=lambda c: (-c["n"], c["name"]))

doc = {
    "meta": {
        "episode": ev["episode"],
        "slug": ev["slug"],
        "group": ev["group"],
        "title": "把 300 只股票当成 300 个任务：元学习选模型",
        "chapter": "ch06",
        "chapterName": "自动化模型设计",
        "runtimeTarget": 24,
        "next": {"id": 53, "title": "集成：平均就能赢，但别乱调权", "minutes": 22},
        "commits": commits,
    },
    "data": {
        "stocks": n,
        "codes": codes,
        "bars": rd["bars"],
        "split": {"train": rd["split"]["train"], "valid": rd["split"]["valid"], "test": rd["split"]["test"]},
        "cut": {"trainEnd": TRAIN_END, "validEnd": VALID_END, "snapshot": "2024-12-31"},
        "industries": rd["industries"],
        "candidates": len(cands),
        "universe": man["pool"]["universe_with_data"],
        "eligible": man["pool"]["eligible"],
        "seed": man["pool"]["seed"],
    },
    "hits": {
        "stats": meta["hit_stats"],
        "classMean": meta["hit_class"],
        "naive": meta["hit_naive"],
        "ts2vec": tsv["hit"],
        "gain": meta["gain"],
        "holdStats": hold["hit_stats"],
        "holdClass": hold["hit_class"],
        "holdN": hold["n"],
        "avgRank": meta["avg_rank"],
    },
    "folds": {"stats": meta["folds"], "ts2vec": tsv["folds"]},
    "regret": {"mean": rg["mean"], "max": rg["max"], "wrong": rg["wrong"]},
    "testMae": {"meta": rd["test_mae"]["meta"], "truth": rd["test_mae"]["truth"], "delta": rd["test_mae"]["delta"]},
    "corr": rd["corr"],
    "ts2vec": {"dim": tsv["dim"], "cosPeriod": tsv["cos_period"], "gap": tsv["gap"]},
    "candidates": candidate_doc,
    "tasks": task_doc,
    "classHit": class_doc,
    "checks": checks,
    "fits": rd["fits"],
    "seconds": rd["seconds"],
}

os.makedirs(os.path.dirname(args.out), exist_ok=True)
payload = json.dumps(doc, ensure_ascii=False, indent=1) + chr(10)
with open(args.out, "w", encoding="utf-8") as f:
    f.write(payload)
print("wrote %s (%d bytes)" % (os.path.relpath(args.out, ROOT), len(payload.encode())))
print("tasks %d bars %r split %r/%r/%r industries %d" % (
    n, rd["bars"], rd["split"]["train"], rd["split"]["valid"], rd["split"]["test"], rd["industries"]))
print("hit stats %.4f class %.4f naive %.4f ts2vec %.4f | corr %.4f regret %.4f/%.4f wrong %d" % (
    meta["hit_stats"], meta["hit_class"], meta["hit_naive"], tsv["hit"],
    rd["corr"], rg["mean"], rg["max"], rg["wrong"]))
print("checks %d/%d %.1fs | fits %d" % (ev["passed"], ev["total"], rd["seconds"], rd["fits"]))
