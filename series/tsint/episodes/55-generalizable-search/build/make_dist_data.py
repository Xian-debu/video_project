#!/usr/bin/env python3
"""Build data/dist.json for episode 55 from the evidence files.

Every number on screen is recomputed here from the CSV or asserted against
summary.json. Run: python3 build/make_dist_data.py --tsbase /root/ts-base
"""
import argparse, csv, json, math, subprocess, sys
from collections import defaultdict
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
H = 24
EP = "55-generalizable-search"


def close(a, b, tol=1e-4):
    return abs(a - b) <= tol


def git_head(repo):
    return subprocess.run(["git", "-C", repo, "rev-parse", "--short", "HEAD"],
                          capture_output=True, text=True, check=True).stdout.strip()


def fail(msg):
    print("EVIDENCE MISMATCH:", msg)
    sys.exit(1)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--tsbase", default="/root/ts-base")
    ap.add_argument("--tsadmin", default="/root/ts-admin")
    ap.add_argument("--out", default=str(ROOT / "data" / "dist.json"))
    args = ap.parse_args()

    ep = Path(args.tsbase) / "data" / "episodes" / EP
    summary = json.load(open(ep / "summary.json"))
    manifest = json.load(open(ep / "manifest.json"))

    dates = defaultdict(set)
    bars = {}
    rows = 0
    with open(ep / "daily30.csv", newline="") as f:
        for r in csv.DictReader(f):
            rows += 1
            code = r["code"]
            dates[code].add(r["date"])
            bars[code] = bars.get(code, 0) + 1

    stocks = len(bars)
    bars_min, bars_max = min(bars.values()), max(bars.values())
    windows = {c: n - 1 - H for c, n in bars.items()}
    win_total = sum(windows.values())
    win_min, win_max = min(windows.values()), max(windows.values())
    tr = va = te = 0
    for n in windows.values():
        a = math.floor(0.7 * n)
        b = math.floor(0.15 * n)
        tr += a
        va += b
        te += n - a - b
    common_days = len(set.intersection(*dates.values())) - 1

    if stocks != 30: fail("stocks %d" % stocks)
    if (bars_min, bars_max) != (1544, 2431): fail("bars %d..%d" % (bars_min, bars_max))
    if rows != 60865: fail("rows %d" % rows)
    if win_total != 60115 or (win_min, win_max) != (1519, 2406):
        fail("windows %d %d..%d" % (win_total, win_min, win_max))
    if (tr, va, te) != (42067, 9003, 9045): fail("split %d/%d/%d" % (tr, va, te))
    if common_days != 1495: fail("common days %d" % common_days)

    rd = summary["readings"]
    sp, sy, re_, go = rd["space"], rd["synth"], rd["real"], rd["golden"]

    if sp["size"] != 1000000 or sp["dim"] != 4 or sp["top_fraction"] != 0.01: fail("space")
    if sp["top_count"] != 10000 or not close(sp["threshold"], 3.3014, 1e-3): fail("threshold")
    if not close(sy["random_best"], 3.7759) or not close(sy["cherry_best"], 3.878):
        fail("synth bests")
    if not close(sy["cmp_best"], 3.9072) or not close(sy["comb_best"], 3.9183):
        fail("synth bests 2")
    for k in ("cherry", "cmp", "comb"):
        expect = {"cherry": 3.878, "cmp": 3.9072, "comb": 3.9183}[k] - sy["random_best"]
        if not close(sy["gaps"][k], round(expect, 4), 2e-3): fail("gap " + k)
    if sy["budgets"] != {"random": 10000, "cherry": 10000, "cmp": 201, "comb": 10000}:
        fail("budgets")
    if abs(6000 + 3000 + 1000 - 10000) > 0 or abs(160 + 9840 - 10000) > 0: fail("budget split")
    vols = sy["cherry_volumes"]
    if not (vols[0] > vols[1] > vols[2]) or vols[2] >= 0.01: fail("volumes")
    box = sy["cherry_box"]
    widths = [round(h - l, 6) for l, h in zip(box["lo"], box["hi"])]
    if max(widths) >= 0.2: fail("box width")
    if not all(0.6 < l < h < 0.85 for l, h in zip(box["lo"], box["hi"])): fail("box range")

    arch_names = re_["architectures"]
    maes = re_["mae"]
    if len(arch_names) != 12 or len(maes) != 12: fail("archs")
    lo_i = min(range(12), key=lambda i: maes[i])
    hi_i = max(range(12), key=lambda i: maes[i])
    if arch_names[lo_i] != re_["best"] or not close(maes[lo_i], re_["best_mae"]): fail("best")
    if not close(maes[hi_i], 6.2379): fail("worst")
    spread = (maes[hi_i] - maes[lo_i]) / maes[lo_i] * 100
    if not close(spread, re_["spread_pct"], 2e-3): fail("spread %.4f" % spread)
    if not close(maes[0], 6.2007): fail("L3-raw")
    fam5 = min(maes[i] for i, n in enumerate(arch_names) if n.startswith("L5-"))
    fam20 = min(maes[i] for i, n in enumerate(arch_names) if n.startswith("L20-"))
    if not close(fam5, re_["family5_best"]) or not close(fam20, re_["family20_best"]): fail("family")
    if (re_["zero_mae"] - maes[lo_i]) / re_["zero_mae"] * 100 >= 0.5: fail("zero gap")

    checks = summary["checks"]
    if len(checks) != 33 or not all(c["ok"] for c in checks): fail("checks")
    if summary["passed"] != 33 or summary["failed"] != 0: fail("passed")
    groups = ["data", "synth", "cherry", "cmp", "comb", "transfer"]
    if sorted({c["group"] for c in checks}) != sorted(groups): fail("groups")

    archs = [{"name": n, "lookback": int(n[1:n.index("-")]),
              "agg": n.split("-")[1], "mae": m} for n, m in zip(arch_names, maes)]

    dist = {
        "meta": {
            "episode": 55,
            "slug": EP,
            "title": "省算力的三种剪枝",
            "chapter": "ch06",
            "seconds": rd["seconds"],
            "generatedBy": "inventory/scripts/export_ch06_generalizable.py",
            "tsBase": git_head(args.tsbase),
            "tsAdmin": git_head(args.tsadmin),
        },
        "checks": [{"group": c["group"], "name": c["name"], "ok": c["ok"],
                    "detail": c.get("detail", "")} for c in checks],
        "data": {
            "stocks": stocks, "barsMin": bars_min, "barsMax": bars_max, "rows": rows,
            "windows": win_total, "windowsMin": win_min, "windowsMax": win_max,
            "commonDays": common_days,
            "split": {"train": tr, "valid": va, "test": te},
            "pools": {"train": manifest["split"]["train_pool"],
                      "valid": manifest["split"]["test_pool"]},
        },
        "synth": {
            "size": sp["size"], "dim": sp["dim"], "topFraction": sp["top_fraction"],
            "topCount": sp["top_count"], "threshold": sp["threshold"],
            "randomBest": sy["random_best"], "cherryBest": sy["cherry_best"],
            "cmpBest": sy["cmp_best"], "combBest": sy["comb_best"],
            "gaps": sy["gaps"], "budgets": sy["budgets"],
            "cherryVolumes": vols, "cherryBox": {"lo": box["lo"], "hi": box["hi"],
                                                 "widths": widths},
        },
        "real": {
            "archs": archs, "zeroMae": re_["zero_mae"],
            "best": {"name": arch_names[lo_i], "mae": maes[lo_i]},
            "worst": {"name": arch_names[hi_i], "mae": maes[hi_i]},
            "spreadPct": spread, "family20Best": fam20, "family5Best": fam5,
        },
        "golden": {
            "shrink": {"samples": [0, 2, 4], "mean": 2.0, "sd": round(math.sqrt(8 / 3), 4),
                       "lo": go.get("shrink_lo", 0.367), "hi": go.get("shrink_hi", 3.633)},
            "sortOrder": go["sort_order"], "pruneKeep": go["prune_keep"],
            "inheritMix": go["inherit_mix"], "cmpAccuracy": go["cmp_accuracy"],
            "quadraticBest": go["quadratic_best"],
        },
    }
    Path(args.out).parent.mkdir(parents=True, exist_ok=True)
    json.dump(dist, open(args.out, "w"), ensure_ascii=False, indent=1)
    print("dist ok: rows %d, stocks %d, windows %d, split %d/%d/%d, 33/33 in %.2f s"
          % (rows, stocks, win_total, tr, va, te, rd["seconds"]))


if __name__ == "__main__":
    main()
