#!/usr/bin/env python3
"""把 ts-base 的 25 集证据产物转成本片唯一的 data/tsint-25-.../rnn.json。

真源：TS_BASE/data/episodes/25-rnn-recurrence-vs-segments/{summary.json,ar_curve.csv,seg_curve.csv,training_loss.csv,forecast_sample.csv,rnn_series.csv}
用法：python3 build/generate_rnn_data.py [--ts-base /root/ts-base] [--out data/rnn.json]
"""
import argparse, csv, datetime, hashlib, json, os

EP = "25-rnn-recurrence-vs-segments"


def read_metrics(summary):
    m = {}
    for item in summary["metrics"]:
        name = item["name"]
        k = name
        i = 0
        while k in m:
            i += 1
            k = name + "#" + str(i)
        m[k] = item["value"]
    return m


def read_csv(path):
    with open(path, newline="") as f:
        return [{k: float(v) for k, v in row.items()} for row in csv.DictReader(f)]


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--ts-base", default="/root/ts-base")
    ap.add_argument("--out", default="data/rnn.json")
    a = ap.parse_args()
    d = os.path.join(a.ts_base, "data", "episodes", EP)
    summary = json.load(open(os.path.join(d, "summary.json")))
    m = read_metrics(summary)
    ar = read_csv(os.path.join(d, "ar_curve.csv"))
    seg = read_csv(os.path.join(d, "seg_curve.csv"))
    loss = read_csv(os.path.join(d, "training_loss.csv"))
    sample = read_csv(os.path.join(d, "forecast_sample.csv"))

    dates = []
    with open(os.path.join(d, "rnn_series.csv"), newline="") as f:
        for row in csv.DictReader(f):
            dates.append(datetime.date.fromisoformat(row["date"]))
    gaps = [(b - x).days for x, b in zip(dates, dates[1:])]
    gi = max(range(len(gaps)), key=lambda i: gaps[i])
    body = os.path.join(d, "rnn_series.csv")
    out = {
        "meta": {
            "episode": EP,
            "bookPages": "p.47-48",
            "commit": "dd22478",
            "checks": summary["checks"],
            "tests": {"suites": 87, "asserts": 1161, "rnn": 13, "segrnn": 15},
            "window": {"history": 96, "horizon": 24, "seg": 8, "blocks": 12, "genBlocks": 3},
            "data": {
                "rows": summary["data"]["rows"], "returns": summary["data"]["returns"],
                "windows": summary["data"]["windows"], "train": summary["data"]["trainWindows"],
                "test": summary["data"]["testWindows"], "start": summary["data"]["start"],
                "end": summary["data"]["end"], "sha256": summary["data"]["sha256"],
                "bytes": os.path.getsize(body), "maxGapDays": gaps[gi],
                "maxGapAt": str(dates[gi]), "maxGapNext": str(dates[gi + 1]),
            },
            "durationSec": summary["durationSec"],
        },
        "rnn": {
            "params": m["rnnParams"], "calls": m["pointCalls"], "gradRelErr": m["gradRelErr"],
            "truncDiff": m["truncDiff"], "trainMse": m["trainMse"], "epochs": m["rnnEpochs"],
            "sec": m["trainSec"], "arMae1": m["arMae1"], "arMae24": m["arMae24"],
            "expansion": m["arExpansion"], "directMae24": m["directMae24"],
            "directVsAr": m["directVsAr"], "naive24": ar[0]["mae_naive"],
        },
        "seg": {
            "params": m["segParams"], "calls": m["segCalls"], "pointCalls": m["pointCalls#1"],
            "ratio": m["segCallRatio"], "mse": m["segMse"], "epochs": m["segEpochs"],
            "sec": m["trainSec#1"], "mae1": seg[0]["mae_seg"], "mae24": m["segMae24"],
            "smoothAr": m["smoothAr"], "smoothSeg": m["smoothSeg"], "smoothRatio": m["smoothRatio"],
            "vsAr24": m["segMae24"] / m["arMae24"],
        },
        "curves": {
            "ar": [{"step": int(r["step"]), "ar": r["mae_ar"], "direct": r["mae_direct"], "naive": r["mae_naive"]} for r in ar],
            "seg": [{"step": int(r["step"]), "mae": r["mae_seg"]} for r in seg],
            "loss": [{"epoch": int(r["epoch"]), "rnn": r["rnn_mse"], "seg": r["seg_mse"]} for r in loss],
        },
        "sample": [{"step": int(r["step"]), "actual": r["actual"], "ar": r["ar"], "seg": r["segrnn"], "direct": r["direct"]} for r in sample],
    }
    os.makedirs(os.path.dirname(a.out) or ".", exist_ok=True)
    with open(a.out, "w") as f:
        json.dump(out, f, ensure_ascii=False, indent=2)
        f.write("\n")
    print("wrote", a.out, os.path.getsize(a.out), "bytes")
    print("gap", gaps[gi], "days at", dates[gi], "->", dates[gi + 1])
    print("ar1", ar[0]["mae_ar"], "ar24", m["arMae24"], "seg1", seg[0]["mae_seg"], "seg24", m["segMae24"])
    print("trainSec rnn", m["trainSec"], "seg", m["trainSec#1"])


if __name__ == "__main__":
    main()
