# -*- coding: utf-8 -*-
"""E24 pack data: from ts-base evidence to data/chan.json."""
import csv, json, os

SRC = "/root/ts-base/data/episodes/24-chan-mix-itrans-graph"
OUT = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "data", "chan.json")

def read_rows(path):
    with open(path) as f:
        r = list(csv.reader(f))
    return r[0], r[1:]

def read_matrix(path, n):
    hdr, body = read_rows(path)
    m = [[0.0] * n for _ in range(n)]
    for row in body:
        i, j = int(row[0]), int(row[1])
        m[i][j] = float(row[2])
        m[j][i] = float(row[2])
    for i in range(n):
        m[i][i] = 1.0
    return m

def read_edges(path, n):
    hdr, body = read_rows(path)
    m = [[0] * n for _ in range(n)]
    out = []
    for row in body:
        i, j = int(row[0]), int(row[1])
        c = float(row[2])
        e = int(row[3])
        m[i][j] = m[j][i] = e
        out.append({"i": i, "j": j, "corr": round(c, 6), "edge": e})
    return m, out

summary = json.load(open(os.path.join(SRC, "summary.json")))
manifest = json.load(open(os.path.join(SRC, "chan_panel.manifest.json")))
met = {m["name"]: m["value"] for m in summary["metrics"]}

corr8 = read_matrix(os.path.join(SRC, "corr_8.csv"), 8)
attn8 = read_matrix(os.path.join(SRC, "attention_8.csv"), 8)
corr20 = read_matrix(os.path.join(SRC, "corr_20.csv"), 20)
adj20, edges20 = read_edges(os.path.join(SRC, "graph20_edges.csv"), 20)

_, share_body = read_rows(os.path.join(SRC, "mixing_energy.csv"))
mixing = [float(r[1]) for r in share_body]

names20 = manifest["panelB"]["names"]
groups20 = []
for gi, (g, codes) in enumerate(manifest["panelB"]["groups"].items()):
    groups20 += [gi] * len(codes)
names20 = [names20[c] for c in [c for g in manifest["panelB"]["groups"].values() for c in g]]

namesA_stock = manifest["panelA"]["channels"]
index_names = {"sh000300": "沪深300", "sz399001": "深证成指"}
name_map = manifest["panelB"].get("names", {})
namesA = []
groups8 = []
for gi, (g, codes) in enumerate(namesA_stock.items()):
    for c in codes:
        namesA.append(index_names.get(c, name_map.get(c, c)))
        groups8.append(gi)

pay = {
    "meta": {
        "episode": "24-chan-mix-itrans-graph",
        "bookPages": "p.55–62",
        "commit": summary["commit"],
        "checks": summary["checks"],
        "tests": {"suites": 85, "asserts": 1133, "channelmix": 11, "itransformer": 11, "graphchannel": 14},
        "duration": summary["durationSec"],
        "panelA": {k: manifest["panelA"][k] for k in ("rows", "start", "end", "maxGapDays", "maxGapAt", "bytes", "sha256")},
        "panelB": {k: manifest["panelB"][k] for k in ("rows", "start", "end", "maxGapDays", "maxGapAt", "bytes", "sha256")},
        "windows": {"width": 96, "stride": 1},
    },
    "mix": {
        "params": int(met["channelMixParams"]),
        "timeParams": int(met["timeMixParams"]),
        "blockParams": int(met["mixParamCount"]),
        "zeroDiff": 1e-16,
        "linearDiff": 1e-13,
        "permDiff": 1e-13,
        "resDiff": 0.621,
    },
    "itrans": {
        "params": int(met["itParams"]),
        "attnMult": int(met["attnMult"]),
        "stdMult": int(met["stdAttnMult"]),
        "ratio": int(met["stdAttnMult"] // met["attnMult"]),
        "attnDiff": 1e-13,
        "shufDiff": 3.8,
    },
    "graph": {
        "k8": 1,
        "k20": 2,
        "comps8": int(met["graph8Components"]),
        "comps20": int(met["graph20Components"]),
        "purity": met["graph20Purity"],
        "ari": met["graph20Ari"],
        "edges": int(sum(1 for (i, j) in [(i, j) for i in range(20) for j in range(i + 1, 20)] if adj20[i][j])),
        "compsSynth": 4,
        "k3ari": 0.296,
    },
    "real": {
        "withinA": met["withinA"],
        "acrossA": met["acrossA"],
        "withinB": met["withinB"],
        "acrossB": met["acrossB"],
        "liquor": met["liquorMean"],
        "bank": met["bankMean"],
        "indexPair": met["indexPair"],
        "attnWithin": met["attnWithin"],
        "attnAcross": met["attnAcross"],
        "splitCorr": met["splitCorr"],
        "mixingShare": met["mixingShare"],
        "corr8": [[round(v, 6) for v in row] for row in corr8],
        "attn8": [[round(v, 6) for v in row] for row in attn8],
        "corr20": [[round(v, 6) for v in row] for row in corr20],
        "adj20": adj20,
        "edges20": edges20,
        "groups8": groups8,
        "groups20": groups20,
        "names8": namesA,
        "names20": names20,
        "industries": list(manifest["panelB"]["groups"].keys()),
        "mixing": [round(v, 6) for v in mixing],
    },
    "data": {"corr8Rows": 28, "attn8Rows": 28, "corr20Rows": 190, "edgeRows": 190, "shareRows": len(mixing)},
}

os.makedirs(os.path.dirname(OUT), exist_ok=True)
with open(OUT, "w") as f:
    json.dump(pay, f, ensure_ascii=False, indent=1)
print("wrote", OUT, os.path.getsize(OUT), "bytes")
print("names8", namesA)
print("groups8", groups8)
print("mixing", mixing)
print("edges20", pay["graph"]["edges"], "purity", pay["graph"]["purity"], "ari", pay["graph"]["ari"])
