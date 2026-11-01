#!/usr/bin/env python3
"""把 ts-base 的 26 集证据产物转成本片唯一的 data/compress.json。

真源：TS_BASE/data/episodes/26-seq-compress-three-ways/{summary.json,compress_curve.csv,spike_curve.csv,window_sample.csv,compress_series.csv,compress_series.manifest.json}
用法：python3 build/generate_compress_data.py [--ts-base /root/ts-base] [--out data/compress.json]
"""
import argparse, csv, json, os

EP = "26-seq-compress-three-ways"


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
    ap.add_argument("--out", default="data/compress.json")
    a = ap.parse_args()
    d = os.path.join(a.ts_base, "data", "episodes", EP)
    summary = json.load(open(os.path.join(d, "summary.json")))
    man = json.load(open(os.path.join(d, "compress_series.manifest.json")))
    m = read_metrics(summary)

    curve = [{k: num(v) for k, v in row.items()} for row in read_csv(os.path.join(d, "compress_curve.csv"))]
    spike = [{k: num(v) for k, v in row.items()} for row in read_csv(os.path.join(d, "spike_curve.csv"))]
    sample = [{k: num(v) for k, v in row.items()} for row in read_csv(os.path.join(d, "window_sample.csv"))]

    rows = read_csv(os.path.join(d, "compress_series.csv"))
    times = [r["bar_time"] for r in rows]
    closes = [float(r["close"]) for r in rows]

    start = 2000
    demo = closes[start:start + 32]
    demo_t = times[start:start + 32]
    even = demo[0::2]
    odd = demo[1::2]
    rebuilt = []
    for i in range(len(demo)):
        rebuilt.append(even[i // 2] if i % 2 == 0 else odd[i // 2])
    err = max(abs(x - y) for x, y in zip(demo, rebuilt))

    phasewin = closes[start:start + 96]
    period = 12
    phases = [[phasewin[q + j * period] for j in range(8)] for q in range(period)]

    win = {row["step"]: row for row in sample}
    steps = [int(row["step"]) for row in sample]

    out = {
        "meta": {
            "episode": EP,
            "bookPages": "p.46-52",
            "commit": summary.get("commit", ""),
            "checks": summary["checks"],
            "tests": {"suites": 90, "asserts": 1195, "scinet": 12, "sparsetsf": 12, "laststep": 10},
            "sec": round(summary.get("durationSec", 0.0), 2),
            "repro": summary.get("repro", ""),
        },
        "data": {
            "rows": man["series"]["rows"], "days": man["series"]["days"], "freq": man["series"]["freq"],
            "returns": summary["data"]["returns"], "windows": summary["data"]["windows"],
            "train": summary["data"]["trainWindows"], "test": summary["data"]["testWindows"],
            "start": man["series"]["start"], "end": man["series"]["end"],
            "sha256": man["series"]["sha256"], "bytes": man["series"]["bytes"],
            "code": man["series"]["code"],
        },
        "compress": curve,
        "spike": spike,
        "sample": {"steps": steps, "actual": [win[s]["actual"] for s in steps],
                   "sparse": [win[s]["sparse"] for s in steps],
                   "last8": [win[s]["last8"] for s in steps],
                   "dense": [win[s]["dense"] for s in steps]},
        "split": {"closes": demo, "times": demo_t, "even": even, "odd": odd, "err": err},
        "phase": {"period": period, "pointsPerPhase": 8, "keepPerPhase": 4, "phases": phases},
        "params": {
            "scin": m.get("params", 0), "sparse": 96, "last": 216, "dense": 2328,
            "denseMacs": 2304, "compressedMacs": 288, "ratio": 8,
            "roundTrip": m.get("roundTripErr", 0.0), "keptRatio": m.get("keptRatio", 0.5),
        },
        "baseline": {"constant": m.get("constantMae", 0.0)},
    }
    os.makedirs(os.path.dirname(a.out), exist_ok=True)
    json.dump(out, open(a.out, "w"), ensure_ascii=False, indent=1)
    print("wrote", a.out, len(json.dumps(out)), "bytes; split err", err, "phases", len(phases), "x", len(phases[0]))


if __name__ == "__main__":
    main()
