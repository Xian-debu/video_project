#!/usr/bin/env python3
"""E22 数据生成：从 ts-base 证据数据与 summary.json 生成画面用 data/prob.json。"""
import csv, json, hashlib, pathlib

ROOT = pathlib.Path(__file__).resolve().parents[1]
TS = pathlib.Path("/root/ts-base/data/episodes/22-prob-nll-quantile-eval")
EV = json.loads((TS / "summary.json").read_text())
MET = {m["name"]: m["value"] for m in EV["metrics"]}

def rows(name):
    with open(TS / name) as f:
        return list(csv.DictReader(f))

synth = rows("gauss_sample.csv")
rets = rows("returns_600519.csv")
grid = rows("quantile_grid.csv")
scores = rows("quantile_scores.csv")

def sha(name):
    return hashlib.sha256((TS / name).read_bytes()).hexdigest()

fit_steps, fit_mu, fit_sigma, fit_loss = [], [], [], []
for r in rows("gauss_fit.csv"):
    fit_steps.append(int(r["step"]))
    fit_mu.append(float(r["mu"]))
    fit_sigma.append(float(r["sigma"]))
    fit_loss.append(float(r["loss"]))

out = {
  "meta": {
    "episode": "22-prob-nll-quantile-eval",
    "bookPages": "p.67-69",
    "tsBaseCommit": EV["commit"],
    "checks": {"total": EV["checks"]["total"], "ok": EV["checks"]["ok"],
               "data": 8, "gauss": 11, "quantile": 8, "eval": 7, "real": 7},
    "tests": {"suites": 79, "asserts": 1059, "gaussnll": 12, "quantileloss": 9, "evalql": 8},
    "taus": [0.1, 0.25, 0.5, 0.75, 0.9],
  },
  "synth": {
    "n": len(synth),
    "mean": MET["sample_mean"], "sd": MET["sample_sd"],
    "fitMu": MET["fit_mu"], "fitSigma": MET["fit_sigma"],
    "fitLoss": MET["fit_loss"], "lossBefore": MET["fit_loss_before"],
    "steps": int(MET["fit_steps"]), "gradErr": MET["grad_max_err"],
    "fit": {"steps": fit_steps, "mu": fit_mu, "sigma": fit_sigma, "loss": fit_loss},
  },
  "nll": {
    "book": MET["nll_book"], "std": MET["nll_std"],
    "gap": MET["nll_constant_gap"], "gapTotal": MET["nll_constant_gap_total"],
  },
  "hand": {"mu": 1.0, "sigma": 2.0, "y": 3.0},
  "quantile": {
    "under": MET["ql_under"], "over": MET["ql_over"], "ratio": MET["ql_ratio"],
    "ql05": MET["ql05"], "mae": MET["sample_mae"],
    "empMedian": MET["empirical_median_1_10"], "emp90": MET["empirical_q90_1_10"],
    "grid": {
      "q": [float(r["q"]) for r in grid],
      "loss05": [float(r["loss_tau05"]) for r in grid],
      "loss09": [float(r["loss_tau09"]) for r in grid],
    },
  },
  "eval": {
    "book05": MET["ql_book_05"], "x205": MET["ql2_05"],
    "mixBook": MET["ql_mix_book"], "mixScaled": MET["ql_mix_scaled"],
    "crossNone": MET["cross_none"], "crossAll": MET["cross_all"], "crossQuarter": MET["cross_quarter"],
  },
  "real": {
    "n": len(rets),
    "dates": [r["date"] for r in rets],
    "values": [float(r["ret"]) for r in rets],
    "mu": MET["real_mu"], "sigma": MET["real_sigma"], "nll": MET["real_nll"],
    "q10": float(scores[0]["real_q"]), "q50": float(scores[2]["real_q"]), "q90": float(scores[4]["real_q"]),
    "cov10": MET["real_cov10"], "cov50": 0.5, "cov90": MET["real_cov90"],
    "coverage80": MET["real_coverage_80"], "coverageGauss80": MET["real_coverage_gauss80"],
    "qlEmp": MET["real_ql_empirical"], "qlConst": MET["real_ql_constant"],
    "crossing": MET["real_crossing"],
    "scores": [{"tau": float(r["tau"]), "synthQ": float(r["synth_q"]), "synthQl": float(r["synth_ql"]),
                "realQ": float(r["real_q"]), "coverage": float(r["real_coverage"]), "realQl": float(r["real_ql"])} for r in scores],
  },
  "data": {
    "gaussRows": len(synth), "gaussBytes": (TS / "gauss_sample.csv").stat().st_size, "gaussSha": sha("gauss_sample.csv"),
    "retRows": len(rets), "retBytes": (TS / "returns_600519.csv").stat().st_size, "retSha": sha("returns_600519.csv"),
  },
}

dst = ROOT / "data" / "prob.json"
dst.parent.mkdir(parents=True, exist_ok=True)
dst.write_text(json.dumps(out, ensure_ascii=False, indent=1) + "\n")
print("wrote", dst, dst.stat().st_size, "bytes")
