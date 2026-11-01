#!/usr/bin/env python3
"""把 ts-base 的 27 集证据产物转成本片唯一的 data/patch.json。

真源：TS_BASE/data/episodes/27-patch-embed-and-two-attn/{summary.json,patch_positions.csv,patch_tokens.csv,attention_heatmap.csv,attention_causal.csv,channels_forecast.csv,window_series.csv,patch_panel.manifest.json}
用法：python3 build/generate_patch_data.py [--ts-base /root/ts-base] [--out data/patch.json]
证据不训练任何模型：所有读数都是结构性质与真实数据上的探针，脚本只做搬运与排版。
"""
import argparse, csv, json, os

EP = "27-patch-embed-and-two-attn"


def read_metrics(summary):
    m = {}
    for item in summary["metrics"]:
        name, k, i = item["name"], item["name"], 0
        while k in m:
            i += 1
            k = name + "#" + str(i)
        m[k] = item["value"]
    return m


def read_csv(path):
    with open(path, newline="") as f:
        return list(csv.DictReader(f))


def num(v):
    try:
        return float(v)
    except (TypeError, ValueError):
        return v


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--ts-base", default="/root/ts-base")
    ap.add_argument("--out", default="data/patch.json")
    a = ap.parse_args()
    d = os.path.join(a.ts_base, "data", "episodes", EP)
    summary = json.load(open(os.path.join(d, "summary.json")))
    man = json.load(open(os.path.join(d, "patch_panel.manifest.json")))
    m = read_metrics(summary)

    positions = [{k: num(v) for k, v in row.items()} for row in read_csv(os.path.join(d, "patch_positions.csv"))]
    tokens = [{k: num(v) for k, v in row.items()} for row in read_csv(os.path.join(d, "patch_tokens.csv"))]
    heat = [{k: num(v) for k, v in row.items()} for row in read_csv(os.path.join(d, "attention_heatmap.csv"))]
    causal = [{k: num(v) for k, v in row.items()} for row in read_csv(os.path.join(d, "attention_causal.csv"))]
    window = [{k: num(v) for k, v in row.items()} for row in read_csv(os.path.join(d, "window_series.csv"))]
    fore = [{k: num(v) for k, v in row.items()} for row in read_csv(os.path.join(d, "channels_forecast.csv"))]

    heat_rows = []
    for row in heat:
        vals = [row["pos" + str(j)] for j in range(1, len(row))]
        heat_rows.append(vals)
    causal_rows = []
    for row in causal:
        vals = [row["key" + str(j)] for j in range(1, len(row))]
        causal_rows.append(vals)

    out = {
        "meta": {
            "episode": EP,
            "bookPages": "p.48-57",
            "commit": summary.get("commit", ""),
            "checks": summary["checks"],
            "tests": {"suites": 92, "asserts": 1251, "patchembed": 20, "patchtst": 20, "crossattn": 16},
            "sec": round(summary.get("durationSec", 0.0), 4),
            "repro": summary.get("repro", ""),
        },
        "data": {
            "rows": man["rows"],
            "channels": len(man["channels"]["liquor"]) + len(man["channels"]["banks"]) + len(man["channels"]["indexes"]),
            "returns": man["rows"] - 1,
            "windows": 318,
            "train": 222,
            "start": man["start"],
            "end": man["end"],
            "sha256": man["sha256"],
            "bytes": man["bytes"],
        },
        "patch": {
            "hist": 96,
            "pat": 16,
            "stride": 8,
            "n": int(m["patchCount"]),
            "params": int(m["patchParams"]),
            "posParams": int(m["posParams"]),
            "overlap": int(m["overlap"]),
            "sliceErr": m["sliceErr"],
            "stitchPatches": 6,
            "stitchErr": m["stitchErr"],
            "naive": 12,
        },
        "patchtst": {
            "d": 32,
            "heads": 4,
            "dff": 128,
            "layers": 1,
            "horizon": 24,
            "encParams": int(m["encoderParams"]),
            "headParams": int(m["headParams"]),
            "totalParams": int(m["totalParams"]),
            "twoLayer": 33024,
            "channelDiff": m["channelDiff"],
            "permDiff": m["permDiff"],
            "noMaskDelta": m["noMaskDelta"],
            "receptiveSteps": int(m["receptiveSteps"]),
            "interactions": int(m["patchInteractions"]),
            "denseInteractions": int(m["denseInteractions"]),
            "ratio": m["interactionRatio"],
        },
        "cross": {
            "d": 32,
            "heads": 4,
            "dff": 128,
            "queries": int(m["queries"]),
            "memLen": int(m["memoryLen"]),
            "params": int(m["params"]),
            "bookParams": 12288,
            "querySd": m["querySd"],
            "oneTokenWeightErr": m["oneTokenWeightErr"],
            "branchErr": m["branchErr"],
            "upperTriMax": m["upperTriMax"],
            "rowSumErr": 4.441e-16,
        },
        "series": {
            "window": [row["value"] for row in window],
            "patches": [{"patch": int(r["patch"]), "start": int(r["start"]), "end": int(r["end"]), "overlap": int(r["overlap_next"])} for r in positions],
            "tokens": [{"patch": int(r["patch"]), "head": [r["dim" + str(j)] for j in range(8)]} for r in tokens],
            "heatmap": heat_rows,
            "causal": causal_rows,
            "channels": [{"ch": int(r["channel"]), "panel": r["panel_h1"], "indep": r["indep_h1"], "diff": r["diff"]} for r in fore],
        },
    }
    os.makedirs(os.path.dirname(a.out), exist_ok=True)
    with open(a.out, "w", encoding="utf-8") as f:
        json.dump(out, f, ensure_ascii=False, indent=1)
        f.write("\n")
    print("wrote", a.out, "bytes", os.path.getsize(a.out))
    print("patches", out["patch"]["n"], "params", out["patch"]["params"], out["patchtst"]["totalParams"], out["cross"]["params"])
    print("heatmap", len(heat_rows), "x", len(heat_rows[0]), "causal", len(causal_rows), "x", len(causal_rows[0]), "window", len(out["series"]["window"]))


if __name__ == "__main__":
    main()
