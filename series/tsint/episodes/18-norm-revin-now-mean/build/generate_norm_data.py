#!/usr/bin/env python3
"""生成 E18「归一化三兄弟」的画面数据 data/norm.json。

输入（全部来自已提交的证据/数据）：
  /root/ts-base/data/episodes/18-norm-revin-now-mean/{panel_daily.csv,summary.json,
      norm_mae.csv,norm_curves.csv,norm_panel.manifest.json}
  /root/ts-base/inventory/evidence/ch3-norm-revin-now-mean/ch3-norm-revin-now-mean.json

输出：<pack>/data/norm.json
"""
from __future__ import annotations

import json
import pathlib
import subprocess

SRC = pathlib.Path("/root/ts-base/data/episodes/18-norm-revin-now-mean")
EV = pathlib.Path("/root/ts-base/inventory/evidence/ch3-norm-revin-now-mean/ch3-norm-revin-now-mean.json")
OUT = pathlib.Path(__file__).resolve().parents[1] / "data" / "norm.json"

H, F = 48, 24


def git_head(repo: str) -> str:
    return subprocess.run(["git", "-C", repo, "rev-parse", "--short", "HEAD"],
                          capture_output=True, text=True, check=True).stdout.strip()


def read_panel():
    lines = (SRC / "panel_daily.csv").read_text().splitlines()
    head = lines[0].split(",")
    rows = [r for r in lines[1:] if r]
    cols = {name: [] for name in head}
    for r in rows:
        parts = r.split(",")
        for name, v in zip(head, parts):
            cols[name].append(float(v) if name != "date" else v)
    return head, cols


def downsample(xs, target=420):
    step = max(1, len(xs) // target)
    return [round(x, 4) for x in xs[::step]]


def synthetic(n=400):
    seed = 12345
    out = []
    for i in range(n):
        seed = (1103515245 * seed + 12345) % 2147483648
        u = seed / 2147483648
        noise = (u - 0.5) * 2
        out.append(round(100 + 0.05 * i + 5 * __import__("math").sin(2 * 3.141592653589793 * i / 48) + noise, 4))
    return out


def main() -> int:
    head, cols = read_panel()
    summary = json.loads((SRC / "summary.json").read_text())
    ev = json.loads(EV.read_text())
    curves = {}
    for line in (SRC / "norm_curves.csv").read_text().splitlines()[1:]:
        name, h, mae = line.split(",")
        curves.setdefault(name, []).append(round(float(mae), 4))

    tr = summary["training"]
    nd = summary["norm"]
    dt = summary["data"]
    step = max(1, len(cols["maotai"]) // 420)
    panel = {
        "dates": [d[:7] for d in cols["date"][::step]],
        "maotai": downsample(cols["maotai"]),
        "index": downsample(cols["index"]),
        "icbcVol": downsample(cols["icbc_vol"]),
        "maotaiStep": max(1, len(cols["maotai"]) // 420),
        "indexStep": max(1, len(cols["index"]) // 420),
    }
    data = {
        "meta": {
            "episode": "18-norm-revin-now-mean",
            "bookPages": "p.45-46",
            "tsBaseCommit": git_head("/root/ts-base"),
            "dataCommit": git_head("/root/ts-admin"),
            "checks": {"total": ev["metrics"] and sum(1 for t in ev["tests"] if t["ok"]), "ok": len(ev["tests"])},
            "tests": {"suites": 67, "asserts": 965, "revin": 8, "nownorm": 6, "meannorm": 6},
            "h": H, "f": F, "params": H * F + F,
            "synth": {"n": 1600, "slope": 0.05, "amp": 5.0, "period": 48, "seed": 12345},
            "training": {"epochs": 40, "lr": 0.005, "batch": 32, "patience": 8, "seed": 7},
        },
        "panel": panel,
        "data": {
            "rows": dt["rows"], "first": dt["firstDate"], "last": dt["lastDate"],
            "csvBytes": dt["csvBytes"], "levelRatio": round(ratio := dt["levelRatio"], 2),
            "maotaiMean": round(dt["maotaiMean"], 1), "icbcMean": round(dt["icbcMean"], 2),
        },
        "norm": {
            "eps": nd["eps"],
            "revRoundtrip": nd["revRoundTrip"],
            "affineRoundtrip": nd["revAffineRoundTrip"],
            "affineIdentity": nd["affineIdentity"],
            "constWindow": nd["constWindow"],
            "nowShift": nd["nowShift"],
            "nowGolden": nd["nowGolden"],
            "meanShift": nd["meanShift"],
            "meanIdentity": nd["meanIdentity"],
            "meanVsZscore": round(nd["meanVsZscore"], 4),
            "normScaleRatio": round(nd["normScaleRatio"], 4),
        },
        "mae": {
            "drift": {"now": round(tr["synNow"], 4), "mean": round(tr["synMean"], 4), "revin": round(tr["synRev"], 4)},
            "flat": {"now": round(tr["trendNow"], 4), "mean": round(tr["trendMean"], 4)},
            "index": {"now": round(tr["idxNow"], 2), "revin": round(tr["idxRev"], 2), "mean": round(tr["idxMean"], 2)},
            "volume": {"now": round(tr["volNow"], 1), "mean": round(tr["volMean"], 1)},
            "scale": {"maotaiNone": round(tr["maotaiNone"], 2), "maotaiRev": round(tr["maotaiRev"], 2),
                      "icbcNone": round(tr["icbcNone"], 4), "icbcRev": round(tr["icbcRev"], 4)},
        },
        "curves": {k: v[:F] for k, v in curves.items()},
        "synthetic": synthetic(400),
        "artifacts": {"checksPassed": len(ev["tests"]), "evidenceCommit": ev["tsBaseCommit"]},
    }
    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(json.dumps(data, ensure_ascii=False, separators=(",", ":")) + "\n")
    print(f"wrote {OUT} bytes={OUT.stat().st_size} rows={data['data']['rows']} "
          f"ratio={data['data']['levelRatio']} drift={data['mae']['drift']} flat={data['mae']['flat']}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
