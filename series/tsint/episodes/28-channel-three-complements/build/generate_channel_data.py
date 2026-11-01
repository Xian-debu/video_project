#!/usr/bin/env python3
"""把 ts-base 的 28 集证据产物转成本片唯一的 data/channel.json。

真源：TS_BASE/data/episodes/28-channel-three-complements/{summary.json,tsmixer_w1.csv,tsmixer_w3.csv,channel_corr_8.csv,channel_corr_64.csv,router_assign.csv,cluster_assign.csv,cluster_ari.csv,channel_panel_8.csv,*.manifest.json}
用法：python3 build/generate_channel_data.py [--ts-base /root/ts-base] [--out data/channel.json]
证据不训练任何模型：所有读数都是结构性质与真实数据上的探针，脚本只做搬运、降采样与排版。
"""
import argparse, csv, json, math, os

EP = "28-channel-three-complements"
CH8 = [
    ("sh600519", "贵州茅台"), ("sz000596", "古井贡酒"), ("sh600809", "山西汾酒"),
    ("sh600036", "招商银行"), ("sh601398", "工商银行"), ("sz000001", "平安银行"),
    ("sh000300", "沪深300"), ("sz399001", "深证成指"),
]


def read_metrics(summary):
    m = {}
    raw = summary["metrics"]
    if isinstance(raw, dict):
        return {k: float(v) for k, v in raw.items()}
    for item in raw:
        name, k, i = item["name"], item["name"], 0
        while k in m:
            i += 1
            k = name + "#" + str(i)
        m[k] = item["value"]
    return m


def read_csv(path):
    with open(path, newline="", encoding="utf-8") as f:
        return list(csv.DictReader(f))


def num(v):
    try:
        return float(v)
    except (TypeError, ValueError):
        return v


def mat_from(path, key="row"):
    rows = read_csv(path)
    labels = [row[key] for row in rows]
    cols = [c for c in rows[0].keys() if c != key]
    m = [[float(row[c]) for c in cols] for row in rows]
    return labels, cols, m


def log_returns(xs):
    out = []
    for i in range(1, len(xs)):
        if xs[i - 1] > 0 and xs[i] > 0:
            out.append(math.log(xs[i] / xs[i - 1]))
        else:
            out.append(0.0)
    return out


def mean(xs):
    return sum(xs) / len(xs)


def sd(xs):
    mu = mean(xs)
    return math.sqrt(sum((x - mu) ** 2 for x in xs) / len(xs))


def downsample(m, f):
    n = len(m)
    k = n // f
    out = []
    for i in range(k):
        row = []
        for j in range(k):
            vals = [m[i * f + a][j * f + b] for a in range(f) for b in range(f)]
            row.append(sum(vals) / len(vals))
        out.append(row)
    return out


def lag_profile(m, lags=32):
    n = len(m)
    out = []
    for k in range(lags):
        vals = [abs(m[i][j]) for i in range(n) for j in range(n) if abs(i - j) == k]
        out.append(sum(vals) / len(vals))
    return out


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--ts-base", default="/root/ts-base")
    ap.add_argument("--out", default="data/channel.json")
    a = ap.parse_args()
    d = os.path.join(a.ts_base, "data", "episodes", EP)
    summary = json.load(open(os.path.join(d, "summary.json"), encoding="utf-8"))
    man = json.load(open(os.path.join(d, "channel_panel.manifest.json"), encoding="utf-8"))
    man8 = json.load(open(os.path.join(d, "channel_panel_8.manifest.json"), encoding="utf-8"))
    m = read_metrics(summary)

    _, _, w1 = mat_from(os.path.join(d, "tsmixer_w1.csv"))
    _, _, w3 = mat_from(os.path.join(d, "tsmixer_w3.csv"))
    _, _, c8 = mat_from(os.path.join(d, "channel_corr_8.csv"))
    labels64, _, c64 = mat_from(os.path.join(d, "channel_corr_64.csv"), key="code")

    industries = list(man["industries"].items())
    ind_of = {}
    ind_names = []
    for gi, (name, spec) in enumerate(industries):
        ind_names.append(name)
        for code in spec["codes"]:
            ind_of[code] = gi
    groups64 = [ind_of.get(code, -1) for code in labels64]
    names64 = {}
    for _, spec in industries:
        for code, nm in zip(spec["codes"], spec["names"]):
            names64[code] = nm

    router = [{k: num(v) for k, v in row.items()} for row in read_csv(os.path.join(d, "router_assign.csv"))]
    cluster = [{k: num(v) for k, v in row.items()} for row in read_csv(os.path.join(d, "cluster_assign.csv"))]
    ari = [{k: num(v) for k, v in row.items()} for row in read_csv(os.path.join(d, "cluster_ari.csv"))]

    panel = read_csv(os.path.join(d, "channel_panel_8.csv"))
    cols8 = [c for c in panel[0].keys() if c != "date"]
    closes = {c: [float(row[c]) for row in panel] for c in cols8}
    rets = {c: log_returns(closes[c]) for c in cols8}
    cut = int(len(next(iter(rets.values()))) * 7 / 10)
    zs = {}
    for c in cols8:
        r = rets[c]
        mu, s = mean(r[:cut]), sd(r[:cut])
        zs[c] = [(x - mu) / (s if s > 0 else 1.0) for x in r]
    nret = len(zs[cols8[0]])
    win = 96
    window = []
    for c in cols8:
        vals = zs[c][nret - win: nret]
        window.append({"code": c, "values": [round(v, 6) for v in vals]})

    out = {
        "meta": {
            "episode": EP,
            "bookPages": "p.46-64",
            "commit": summary.get("commit", ""),
            "checks": {"total": len(summary["checks"]), "ok": len([c for c in summary["checks"] if c["ok"]]), "failed": len(summary["failures"])},
            "tests": {"suites": 95, "asserts": 1313, "tsmixer": 20, "router": 21, "cluster": 21},
            "sec": round(summary.get("durationSec", 0.0), 4),
            "repro": summary.get("repro", ""),
        },
        "data": {
            "rows8": man8["rows"],
            "rows64": man["rows"],
            "channels": man["channels"],
            "industries": len(industries),
            "returns": num(summary["data"]["returns64"]),
            "start": man["start"],
            "end": man["end"],
            "sha256_8": man8["sha256"],
            "sha256_64": man["sha256"],
            "bytes64": man["bytes"],
        },
        "tsmixer": {
            "T": 96, "N": 8, "blocks": 1,
            # summary.metrics 是 name->value 的字典，重名键会互相覆盖：router 的 params=256
            # 覆盖掉了 TSMixer 的 10,048。这里按定义重算 T² + T·N + N²。
            "params": 96 * 96 + 96 * 8 + 8 * 8,
            "identityErr": m["identityErr"],
            "handProdErr": m["handProdErr"],
            "chanEquiv": m["chanEquiv"],
            "timeEquiv": m["timeEquiv"],
            "bandMass": m["w1BandMass"],
            "bandWidth": 8,
            "w3BlockMass": m["w3BlockMass"],
            "w3UniformMass": m["w3UniformMass"],
            "marketShare": m["marketModeShare"],
            "withinCorr8": m["withinCorr8"],
            "crossCorr8": m["crossCorr8"],
            "corrBlockMass8": m["corrBlockMass8"],
        },
        "router": {
            "slots": int(m["slots"]),
            "d": int(m["channels"]),
            "dBook": 32,
            "params": int(m["params"]),
            "paramsBook": int(m["paramsBook"]),
            "denseParams": int(m["denseParams"]),
            "complexity": int(m["complexity"]),
            "denseComplexity": int(m["denseComplexity"]),
            "ratio": m["complexityRatio"],
            "rowSumErr": m["rowSumErr"],
            "c1Err": m["c1Err"],
            "handMeanErr": m["handMeanErr"],
            "permDiff": m["permDiff"],
            "randPurity": m["randPurity"],
            "randARI": m["randARI"],
            "pcaPurity": m["pcaPurity"],
            "pcaARI": m["pcaARI"],
            "collapsedSlots": int(m["pcaCollapsedSlots"]),
        },
        "cluster": {
            "k": int(m["k"]),
            "kParams": 4,
            "H": 96, "F": 24,
            "paramsK4": int(m["paramsK4"]),
            "paramsK10": int(m["paramsK10"]),
            "synPurity": m["syntheticPurity"],
            "rawPurity": m["rawPurity"],
            "rawARI": m["rawARI"],
            "rawPurityMean": m["rawPurityMean"],
            "rawARIMean": m["rawARIMean"],
            "residPurityMean": m["residPurityMean"],
            "residARIMean": m["residARIMean"],
            "withinRaw": m["withinRaw"],
            "acrossRaw": m["acrossRaw"],
            "withinResid": m["withinResid"],
            "acrossResid": m["acrossResid"],
            "emptyClusters": int(m["emptyClusters"]),
            "windows": int(m["windows"]),
        },
        "industryNames": ind_names,
        "series": {
            "window": window,
            "w1": downsample(w1, 4),
            "w3": w3,
            "corr8": c8,
            "labels8": [nm for _, nm in CH8],
            "groups8": [0, 0, 0, 1, 1, 1, 2, 2],
            "corr64": c64,
            "labels64": [names64.get(code, code) for code in labels64],
            "codes64": labels64,
            "groups64": groups64,
            "router": router,
            "cluster": cluster,
            "ari": ari,
            "lagProfile": lag_profile(w1, 32),
        },
    }
    os.makedirs(os.path.dirname(a.out), exist_ok=True)
    with open(a.out, "w", encoding="utf-8") as f:
        json.dump(out, f, ensure_ascii=False, indent=1)
        f.write("\n")
    print("wrote", a.out, "bytes", os.path.getsize(a.out))
    print("w1", len(out["series"]["w1"]), "w3", len(w3), "c8", len(c8), "c64", len(c64), "router", len(router), "cluster", len(cluster), "ari", len(ari), "window", len(window), "x", len(window[0]["values"]))


if __name__ == "__main__":
    main()
