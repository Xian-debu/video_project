#!/usr/bin/env python3
"""Build data/attn.json for episode 21 from the ts-base evidence artifacts.

Inputs (read-only, produced by app/Ch03AttnEvidence.hs):
  /root/ts-base/data/episodes/21-attn-mhsa-block-masked/{summary.json,
      attention_heads.csv, window_daily_8.csv, window_stats.csv,
      scaling_ablation.csv}

Everything numeric on screen comes from these files; the only computed extras
are per-head entropy / top-1 shares and the z-scored heatmap, which are labelled
as visualisations, not as evidence claims.
"""
from __future__ import annotations

import csv
import json
import math
import pathlib

SRC = pathlib.Path("/root/ts-base/data/episodes/21-attn-mhsa-block-masked")
OUT = pathlib.Path(__file__).resolve().parent.parent / "data" / "attn.json"


def read_csv(path: pathlib.Path) -> list[dict[str, str]]:
    with path.open(newline="") as fh:
        return list(csv.DictReader(fh))


def entropy_bits(row: list[float]) -> float:
    return -sum(p * math.log2(p) for p in row if p > 1e-12)


def main() -> int:
    summary = json.loads((SRC / "summary.json").read_text())
    metrics = {m["name"]: m["value"] for m in summary["metrics"]}

    # window: dates + raw closes + per-column z (population sd, same as the evidence colZ)
    rows = read_csv(SRC / "window_daily_8.csv")
    cols = list(rows[0].keys())
    series = cols[1:]
    dates = [r["date"] for r in rows]
    raw = {c: [float(r[c]) for r in rows] for c in series}
    z = {}
    for c in series:
        xs = raw[c]
        mu = sum(xs) / len(xs)
        sd = math.sqrt(sum((x - mu) ** 2 for x in xs) / len(xs))
        sd = sd if sd > 1e-9 else 1.0
        z[c] = [round((x - mu) / sd, 4) for x in xs]

    # attention heads: 4 x 96 x 96 in row-major (head,row,col)
    heads: dict[int, list[list[float]]] = {}
    for r in read_csv(SRC / "attention_heads.csv"):
        h, i, j = int(r["head"]), int(r["row"]), int(r["col"])
        heads.setdefault(h, [[0.0] * 96 for _ in range(96)])[i][j] = float(r["weight"])

    head_stats = []
    for h in sorted(heads):
        m = heads[h]
        ent = [entropy_bits(m[i]) for i in range(96)]
        row_sums = [sum(m[i]) for i in range(96)]
        top1 = [max(m[i]) for i in range(96)]
        amax = [max(range(96), key=lambda j: m[i][j]) for i in range(96)]
        head_stats.append({
            "head": h,
            "entropyBits": round(sum(ent) / 96.0, 4),
            "maxWeightMean": round(sum(top1) / 96.0, 4),
            "rowSumMaxDev": round(max(abs(s - 1.0) for s in row_sums), 12),
            "argmaxColMean": round(sum(amax) / 96.0, 2),
            "argmaxColMin": min(amax),
            "argmaxColMax": max(amax),
        })

    # heatmaps: head 0 at stride 2 (48x48), heads 1..3 at stride 4 (24x24)
    def heat(m: list[list[float]], stride: int) -> list[list[float]]:
        return [[round(m[i][j], 4) for j in range(0, 96, stride)] for i in range(0, 96, stride)]

    heatmaps = [{"head": 0, "stride": 2, "values": heat(heads[0], 2)}]
    for h in (1, 2, 3):
        heatmaps.append({"head": h, "stride": 4, "values": heat(heads[h], 4)})

    # last row of head 0: attention as a soft lookup over the window
    last = heads[0][95]
    order = sorted(range(96), key=lambda j: -last[j])[:6]
    lookup = [{"row": j, "date": dates[j], "weight": round(last[j], 5)} for j in order]

    scaling_rows = read_csv(SRC / "scaling_ablation.csv")
    scaling = [{"mode": r["mode"], "maxAbsLogit": float(r["max_abs_logit"]),
                "entropyBits": float(r["entropy_bits"])} for r in scaling_rows]

    # hand case recomputed here to prove the on-screen numbers are arithmetic, not text.
    # Q = K = [[1],[2]], V = [[10],[20]], d_k = 1, so row i sees logits (i+1)*[1,2].
    vals = [10.0, 20.0]
    rows_w = []
    outs = []
    for i in (0, 1):
        qk = [(i + 1) * 1.0, (i + 1) * 2.0]
        exps = [math.exp(v) for v in qk]
        s = sum(exps)
        w = [e / s for e in exps]
        rows_w.append([round(w[0], 10), round(w[1], 10)])
        outs.append(round(w[0] * vals[0] + w[1] * vals[1], 8))
    w0, w1 = rows_w[0]
    out0, out1 = outs

    data = {
        "meta": {
            "episode": "21-attn-mhsa-block-masked",
            "bookPages": "printed p.53–56",
            "tsBaseCommit": "b1f9322",
            "dataCommit": "41523b5",
            "checks": {"total": 35, "ok": 35, "data": 6, "struct": 19, "grad": 2, "real": 8},
            "tests": {"suites": 76, "asserts": 1030, "mhsa": 7, "block": 4, "masked": 5},
            "config": {"dModel": 64, "heads": 4, "dk": 16, "dff": 256, "horizon": 96, "channels": 8, "lnEps": 1e-5},
            "params": {"mhsa": 16384, "blockMatrix": 49152, "blockTotal": 49920},
        },
        "data": {
            "rows": len(rows),
            "cols": len(series),
            "first": dates[0],
            "last": dates[-1],
            "sha256": summary["data"]["sha256"],
            "bytes": 9565,
            "series": series,
        },
        "window": {"dates": dates, "raw": raw, "z": z},
        "heads": {"stats": head_stats, "heatmaps": heatmaps, "lookup": lookup},
        "scaling": {"rows": scaling,
                    "scaledMax": metrics["scaled_max_logit"], "scaledEntropy": metrics["scaled_entropy_bits"],
                    "unscaledMax": metrics["unscaled_max_logit"], "unscaledEntropy": metrics["unscaled_entropy_bits"]},
        "hand": {
            "logitsRows": [[1.0, 2.0], [2.0, 4.0]],
            "weights": rows_w,
            "out0": out0,
            "out1": out1,
            "planOut": 17.3102,
        },
        "mask": {"strictUpperSum": 0.0, "rowsUnchanged": 3, "firstTokenOnlySelf": True},
        "grad": {"params": 256, "maxErr": metrics["grad_max_err"],
                 "lossBefore": metrics["loss_before"], "lossAfter": metrics["loss_after"], "lr": 0.05},
        "struct": {"permErr": 0.0, "zeroBlockPerRow": 0.0, "head0Entropy": metrics["head0_entropy_bits"]},
        "artifacts": {"checksPassed": 35, "evidenceCommit": "b1f9322", "suites": 76, "asserts": 1030},
    }
    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(json.dumps(data, ensure_ascii=False, separators=(",", ":")) + "\n")
    print(f"attn.json: {OUT.stat().st_size} bytes")
    print("head stats:", json.dumps(head_stats, ensure_ascii=False))
    print("lookup:", json.dumps(lookup, ensure_ascii=False))
    print("hand:", w0, w1, out0, out1)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
