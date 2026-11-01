#!/usr/bin/env python3
"""E23 数据生成：从 ts-base 证据数据与 summary.json 生成画面用 data/crps.json。"""
import csv, json, hashlib, pathlib

ROOT = pathlib.Path(__file__).resolve().parents[1]
TS = pathlib.Path("/root/ts-base/data/episodes/23-prob-crps-picp-vae")
EV = json.loads((TS / "summary.json").read_text())
MET = {m["name"]: m["value"] for m in EV["metrics"]}

def rows(name):
    with open(TS / name) as f:
        return list(csv.DictReader(f))

def sha(name):
    return hashlib.sha256((TS / name).read_bytes()).hexdigest()

bias_rows = rows("crps_sampling.csv")
picp_rows = rows("picp_windows.csv")
train_rows = rows("vae_training.csv")
latent_rows = rows("vae_latent.csv")
real_rows = rows("crps_real.csv")

def fnum(r, k):
    return float(r[k])

out = {
  "meta": {
    "episode": "23-prob-crps-picp-vae",
    "bookPages": "p.68-69",
    "tsBaseCommit": EV["commit"],
    "checks": {"total": EV["checks"]["total"], "ok": EV["checks"]["ok"],
               "data": 7, "crps": 11, "picp": 7, "elbo": 9, "real": 7},
    "tests": {"suites": 82, "asserts": 1097, "crps": 17, "picp": 10, "vaeelbo": 11},
    "panel": {"rows": int(MET["panelRows"]), "channels": int(MET["panelChannels"]),
              "returns": int(MET["returnRows"]), "windows": int(MET["windows"]),
              "dim": int(MET["windowDim"]), "sha": EV["data"]["sha256Panel"]},
  },
  "crps": {
    "atMean": MET["crpsAtMean"],
    "closedErr": MET["crpsClosedErr"],
    "sortRel": MET["crpsSortRelErr"],
    "directRel": MET["crpsDirectRelErr"],
    "biasS10": MET["crpsBiasS10"],
    "biasS100": MET["crpsBiasS100"],
    "biasS1000": MET["crpsBiasS1000"],
    "bias": [{"S": int(r["S"]), "seeds": int(r["seeds"]),
              "direct": fnum(r, "direct"), "sorted": fnum(r, "sorted"),
              "closed": fnum(r, "closed"), "bias": fnum(r, "bias"),
              "theory": fnum(r, "theory")} for r in bias_rows],
  },
  "picp": {
    "synth80": MET["picpCover80"],
    "synth95": MET["picpCover95"],
    "realCov80": MET["realCoverage80"],
    "realCov95": MET["realCoverage95"],
    "rows": [{"level": int(r["level"]), "channel": r["channel"],
              "coverage": fnum(r, "coverage"), "width": fnum(r, "mean_width")} for r in picp_rows],
  },
  "vae": {
    "d": 768, "h": 32, "z": 8, "params": int(MET["paramCount"]),
    "lr": 0.02, "epochs": 60, "trainN": 100,
    "lossStart": MET["trainLossStart"], "lossEnd": MET["trainLossEnd"],
    "dropPct": MET["trainDropPct"], "gradErr": MET["gradErr"],
    "klHand": MET["klHand"], "corr": MET["latentVolCorr"],
    "testCfg": {"d": 4, "h": 6, "z": 2, "params": 88},
    "history": {
      "epoch": [int(r["epoch"]) for r in train_rows],
      "loss": [fnum(r, "mean_loss") for r in train_rows],
      "recon": [fnum(r, "recon") for r in train_rows],
      "kl": [fnum(r, "kl") for r in train_rows],
    },
    "latent": [{"act": fnum(r, "activity"), "norm": fnum(r, "norm")}
               for i, r in enumerate(latent_rows) if i % 8 == 0],
  },
  "real": {
    "channels": [{"channel": r["channel"], "crps": fnum(r, "crps"), "mae": fnum(r, "mae"),
                  "cov80": fnum(r, "coverage80"), "w80": fnum(r, "width80"),
                  "cov95": fnum(r, "coverage95"), "w95": fnum(r, "width95")} for r in real_rows],
    "crpsMean": MET["realCrpsMean"], "maeMean": MET["realMaeMean"],
  },
  "data": {
    "panelRows": int(MET["panelRows"]), "panelBytes": (TS / "panel_daily_8.csv").stat().st_size,
    "panelSha": sha("panel_daily_8.csv"),
    "crpsRows": len(bias_rows), "picpRows": len(picp_rows),
    "trainRows": len(train_rows), "latentRows": len(latent_rows),
  },
}

dst = ROOT / "data" / "crps.json"
dst.write_text(json.dumps(out, ensure_ascii=False, indent=1) + "\n")
print("wrote", dst, dst.stat().st_size, "B")
