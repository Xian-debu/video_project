#!/usr/bin/env python3
"""把 E37 证据 JSON 编译成片子用的 data/gmm.json（只搬运 + 少量派生，不改数值）。"""
import json, hashlib, subprocess, datetime, pathlib

ROOT = pathlib.Path("/root/ts-base")
PACK = pathlib.Path("/root/video_project/series/tsint/episodes/37-ad-gmm-vae-mixture-prior")
EV = ROOT / "inventory/evidence/37-ad-gmm-vae-mixture-prior.ch4-gmm-vae.json"
MAN = ROOT / "data/episodes/37-ad-gmm-vae-mixture-prior/gmm_panel.manifest.json"
CSV = ROOT / "data/episodes/37-ad-gmm-vae-mixture-prior/gmm_panel.csv"

UNITS_COMMIT = "047ad2e"
EVIDENCE_COMMIT = "41f5879"
DATA_COMMIT = "8d3a03e"


def git(repo, *args):
    return subprocess.run(["git", "-C", str(repo), *args], capture_output=True, text=True).stdout.strip()


def lines_of(rel):
    return len((ROOT / rel).read_text(encoding="utf-8").splitlines())


ev = json.loads(EV.read_text())
man = json.loads(MAN.read_text())
sha_full = hashlib.sha256(CSV.read_bytes()).hexdigest()

unit_keys = ["tau", "f1", "precision", "recall", "tp", "fp", "fn", "detected", "alertPct", "ap"]


def unit(key, name, short):
    d = ev["units"][key]
    return {"name": name, "short": short, **{k: d[k] for k in unit_keys}}


groups = [
    {"label": "数据", "n": 6},
    {"label": "样本", "n": 5},
    {"label": "注入", "n": 7},
    {"label": "混合先验", "n": 14},
    {"label": "K=1 等价", "n": 2},
    {"label": "两团合成", "n": 3},
    {"label": "两个读数", "n": 4},
    {"label": "对照", "n": 1},
    {"label": "分量", "n": 2},
    {"label": "异常段", "n": 1},
    {"label": "跨票", "n": 1},
    {"label": "计数", "n": 1},
]
# 证据生成器只有在 47/47 全过时才写出 JSON，所以每组的通过数就是它的条数。
groups = [{**g, "pass": g["n"]} for g in groups]

out = {
  "meta": {
    "episode": 37,
    "slug": ev["episode"],
    "chapter": "第 4 章 · 第 37 集",
    "book": "§4.4.6 · 式 (4.26)(4.27) p.101–102",
    "runtimeTarget": 20,
    "title": "混合先验：GMM-VAE 与『多个正常模式』",
    "subtitle": "混合先验 · EM · 潜空间",
    "checks": f'{ev["nPass"]}/{ev["nChecks"]}',
    "checkCount": ev["nChecks"],
    "elapsedSec": round(ev["elapsedSec"], 1),
    "tests": {"suites": 119, "asserts": 1621, "newSuites": 1, "newAsserts": 19},
    "commits": {"units": UNITS_COMMIT, "evidence": EVIDENCE_COMMIT, "data": DATA_COMMIT},
    "repro": ev["repro"],
    "generatedAt": datetime.datetime.now().astimezone().isoformat(timespec="seconds")
  },
  "data": {
    "file": ev["data"]["file"], "rows": ev["data"]["rows"],
    "start": ev["data"]["start"], "end": ev["data"]["end"],
    "sha": ev["data"]["sha256"], "shaFull": sha_full,
    "codes": man["codes"], "names": dict(zip(ev["data"]["codes"], ev["data"]["names"])),
    "maxGap": {"days": ev["data"]["maxGap"]["days"], "pair": ev["data"]["maxGap"]["pair"]},
    "bytes": man["bytes"],
    "split": {"train": "2015-01-05 .. 2019-12-31", "test": "2020-01-01 .. 2026-06-30"},
    "gapNote": "2015-07-29..2015-11-02 源数据整段缺失（白酒同期对齐后仍缺，不是停牌标记）"
  },
  "windows": {
    "C": ev["params"]["window"], "train": ev["samples"]["train"], "test": ev["samples"]["test"],
    "trainUsed": ev["samples"]["trainUsed"], "trainStride": ev["samples"]["trainStride"],
    "split": {"train": "2015-01-05 .. 2019-12-31", "test": "2020-01-01 .. 2026-06-30"}
  },
  "inject": {
    "seed": ev["inject"]["seed"], "perKind": ev["inject"]["perKind"],
    "spike": {"amp": "5–10 个 σ", "len": "1 点 或 3 点", "pos": "窗内 15..40"},
    "drift": {"len": "20–30 点", "net": "3–6 个 σ，两端符号相反"},
    "truthPts": ev["inject"]["truthPts"], "truthRuns": ev["inject"]["truthRuns"],
    "ratePct": ev["inject"]["ratePct"]
  },
  "params": {
    "gmmDim": ev["params"]["gmmDim"], "gmmK": ev["params"]["gmmK"], "gmmBeta": ev["params"]["gmmBeta"],
    "gmmEpochs": ev["params"]["gmmEpochs"], "gmmLr": ev["params"]["gmmLr"],
    "emEvery": ev["params"]["emEvery"], "emStart": ev["params"]["emStart"], "jitter": ev["params"]["jitter"],
    "vaeDim": ev["params"]["vaeDim"], "vaeEpochs": ev["params"]["vaeEpochs"], "vaeLr": ev["params"]["vaeLr"],
    "plotDim": ev["params"]["plotDim"], "plotSeed": ev["params"]["plotSeed"]
  },
  "gmm": {k: (round(v, 4) if isinstance(v, float) else v) for k, v in ev["gmm"].items()},
  "fit": {k: (round(v, 4) if isinstance(v, float) else v) for k, v in ev["fit"].items()},
  "vae": {k: (round(v, 4) if isinstance(v, float) else v) for k, v in ev["vae"].items()},
  "k1": {"lossIdentical": ev["k1"]["lossIdentical"], "paramsIdentical": ev["k1"]["paramsIdentical"],
         "lossFirst": round(ev["k1"]["lossFirst"], 4)},
  "stability": {k: (round(v, 4) if isinstance(v, float) else v) for k, v in ev["stability"].items()},
  "blob": {
    "true": ev["blob"]["true"], "est": ev["blob"]["est"], "err": ev["blob"]["err"],
    "sep": ev["blob"]["sep"], "pi": [round(v, 4) for v in ev["blob"]["pi"]],
    "confident": ev["blob"]["confident"], "sample": ev["blob"]["sample"]
  },
  "components": {
    "driftMean": [round(v, 2) for v in ev["components"]["driftMean"]],
    "spikeMean": [round(v, 2) for v in ev["components"]["spikeMean"]],
    "normalMean": [round(v, 2) for v in ev["components"]["normalMean"]],
    "driftNll": [[round(v, 2) for v in row] for row in ev["components"]["driftNll"]],
    "spikeNll": [[round(v, 2) for v in row] for row in ev["components"]["spikeNll"]],
    "normalNll": [[round(v, 2) for v in row] for row in ev["components"]["normalNll"]],
    "normalMinMedian": round(ev["components"]["normalMinMedian"], 3),
    "driftMinMedian": round(ev["components"]["driftMinMedian"], 3),
    "spikeMinMedian": round(ev["components"]["spikeMinMedian"], 3),
    "driftAllHighPct": ev["components"]["driftAllHighPct"]
  },
  "latent": {
    "dim": ev["latent"]["dim"], "seed": ev["latent"]["seed"],
    "normal": ev["latent"]["normal"], "injected": ev["latent"]["injected"],
    "spike": ev["latent"]["spike"], "drift": ev["latent"]["drift"],
    "centers": ev["latent"]["centers"], "pi": [round(v, 4) for v in ev["latent"]["pi"]],
    "normMedian": round(ev["latent"]["normMedian"], 4),
    "injMedian": round(ev["latent"]["injMedian"], 4),
    "spikeMedian": round(ev["latent"]["spikeMedian"], 4),
    "driftMedian": round(ev["latent"]["driftMedian"], 4)
  },
  "regime": {**ev["regime"]},
  "crossStock": ev["crossStock"],
  "units": {
    "prior1": unit("prior1", "单高斯先验（VAE）", "VAE-1"),
    "mix4": unit("mix4", "混合先验（K=4，两段拟合）", "GMM-4")
  },
  "stats": ev["stats"],
  "byKind": ev["byKind"],
  "curves": ev["curves"],
  "series": {
    "gmmLoss": [round(v, 5) for v in ev["series"]["gmmLoss"]],
    "vaeLoss": [round(v, 5) for v in ev["series"]["vaeLoss"]]
  },
  "checks": ev["checks"],
  "groups": groups,
  "modules": [
    {"id": "ch4-gmm-vae", "name": "混合先验 GMM-VAE", "file": "src/TsBase/Algos/Ch04/GMMVAE.hs", "lines": lines_of("src/TsBase/Algos/Ch04/GMMVAE.hs"), "cases": 19},
    {"id": "ch4-vae", "name": "变分自编码器", "file": "src/TsBase/Algos/Ch04/VAE.hs", "lines": lines_of("src/TsBase/Algos/Ch04/VAE.hs"), "cases": 15},
  ],
  "next": {"slug": "38-ad-graph-contrastive", "title": "图上的异常：增强、对比损失与 TopK 邻接", "minutes": 20},
  "progress": {"delivered": 46, "total": 74},
}

(PACK / "data").mkdir(parents=True, exist_ok=True)
(PACK / "data" / "gmm.json").write_text(json.dumps(out, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
print(f'wrote gmm.json {len(json.dumps(out)):,} B; checks {out["meta"]["checks"]}; '
      f'F1 prior1 {out["units"]["prior1"]["f1"]:.4f} mix4 {out["units"]["mix4"]["f1"]:.4f}; '
      f'pi {out["units"] and out["fit"]["pi"]}')
