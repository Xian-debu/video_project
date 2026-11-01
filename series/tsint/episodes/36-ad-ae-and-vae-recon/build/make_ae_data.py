#!/usr/bin/env python3
"""把 E36 证据 JSON 编译成片子用的 data/ae.json（只搬运 + 少量派生，不改数值）。"""
import json, hashlib, subprocess, datetime, pathlib

ROOT = pathlib.Path("/root/ts-base")
PACK = pathlib.Path("/root/video_project/series/tsint/episodes/36-ad-ae-and-vae-recon")
EV = ROOT / "inventory/evidence/36-ad-ae-and-vae-recon.ch4-ae-vae.json"
MAN = ROOT / "data/episodes/36-ad-ae-and-vae-recon/ae_panel.manifest.json"
CSV = ROOT / "data/episodes/36-ad-ae-and-vae-recon/ae_panel.csv"

UNITS_COMMIT = "4857cb1"
EVIDENCE_COMMIT = "b815f6b"
DATA_COMMIT = "97f7091"

def git(repo, *args):
    return subprocess.run(["git", "-C", str(repo), *args], capture_output=True, text=True).stdout.strip()

def lines_of(rel):
    return len((ROOT / rel).read_text(encoding="utf-8").splitlines())

ev = json.loads(EV.read_text())
man = json.loads(MAN.read_text())
sha_full = hashlib.sha256(CSV.read_bytes()).hexdigest()

unit_keys = ["tau", "f1", "precision", "recall", "tp", "fp", "fn", "detected", "alertPct", "ap"]

def unit(key, name, short):
    return {"name": name, "short": short, **{k: ev["units"][key][k] for k in unit_keys}}

groups = [
    {"label": "数据", "n": 5},
    {"label": "样本", "n": 5},
    {"label": "注入", "n": 5},
    {"label": "自编码器", "n": 10},
    {"label": "变分自编码器", "n": 10},
    {"label": "潜空间", "n": 2},
    {"label": "对比", "n": 2},
    {"label": "计数", "n": 1},
]

out = {
  "meta": {
    "episode": 36,
    "slug": ev["episode"],
    "chapter": "第 4 章 · 第 36 集",
    "book": "§4.4.5–4.4.6 p.92–99",
    "runtimeTarget": 26,
    "title": "从重构到概率：AE 与 VAE 的潜空间",
    "subtitle": "自编码器 · 变分下界 · 潜空间",
    "checks": f'{ev["nPass"]}/{ev["nChecks"]}',
    "checkCount": ev["nChecks"],
    "elapsedSec": round(ev["elapsedSec"], 1),
    "tests": {"suites": 118, "asserts": 1602, "newSuites": 2, "newAsserts": 29},
    "commits": {"units": UNITS_COMMIT, "evidence": EVIDENCE_COMMIT, "data": DATA_COMMIT},
    "repro": ev["repro"],
    "generatedAt": datetime.datetime.now().astimezone().isoformat(timespec="seconds")
  },
  "data": {
    "file": ev["data"]["file"], "rows": ev["data"]["rows"],
    "start": ev["data"]["start"], "end": ev["data"]["end"],
    "sha": ev["data"]["sha256"], "shaFull": sha_full,
    "codes": man["codes"], "names": man["names"],
    "maxGap": {"days": ev["data"]["maxGap"]["days"], "pair": ev["data"]["maxGap"]["pair"]},
    "bytes": man["bytes"],
    "split": man["split"], "gapNote": "2015-07-30 至 2015-10-30 源数据整段缺失（不是停牌标记）"
  },
  "windows": {
    "C": ev["params"]["window"], "train": ev["samples"]["train"], "test": ev["samples"]["test"],
    "trainUsed": ev["samples"]["trainUsed"], "trainStride": ev["samples"]["trainStride"],
    "split": {"train": "2010-01-01 .. 2020-12-31", "test": "2021-01-01 .. 2026-06-30"}
  },
  "inject": {
    "seed": ev["inject"]["seed"], "perKind": ev["inject"]["perKind"],
    "spike": {"amp": "5–10 个 σ", "len": "1 点 或 3 点", "pos": "窗内 15..40"},
    "drift": {"len": "20–30 点", "net": "3–6 个 σ，两端符号相反"},
    "truthPts": ev["inject"]["truthPts"], "truthRuns": ev["inject"]["truthRuns"],
    "ratePct": ev["inject"]["ratePct"]
  },
  "params": {
    "aeDim": ev["params"]["aeDim"], "aeEpochs": ev["params"]["aeEpochs"], "aeLr": ev["params"]["aeLr"],
    "vaeDim": ev["params"]["vaeDim"], "vaeEpochs": ev["params"]["vaeEpochs"], "vaeLr": ev["params"]["vaeLr"],
    "vaeBeta1": ev["params"]["vaeBeta1"], "plotDim": ev["params"]["plotDim"], "plotSeed": ev["params"]["plotSeed"]
  },
  "ae": ev["ae"],
  "vae": ev["vae"],
  "latent": ev["latent"],
  "units": {
    "ae16": unit("ae16", "瓶颈自编码器", "AE d=16"),
    "ae100": unit("ae100", "恒等自编码器", "AE d=100"),
    "vae01": unit("vae01", "变分自编码器 β=0.1", "VAE β=0.1"),
    "vae1": unit("vae1", "变分自编码器 β=1", "VAE β=1")
  },
  "stats": ev["stats"],
  "byKind": ev["byKind"],
  "curves": ev["curves"],
  "series": {
    "ae16Loss": [round(v, 5) for v in ev["series"]["ae16Loss"]],
    "ae100Loss": [round(v, 5) for v in ev["series"]["ae100Loss"]],
    "vae01Loss": [round(v, 5) for v in ev["series"]["vae01Loss"]],
    "vae1Loss": [round(v, 5) for v in ev["series"]["vae1Loss"]]
  },
  "checks": ev["checks"],
  "groups": groups,
  "modules": [
    {"id": "ch4-ae", "name": "自编码器", "file": "src/TsBase/Algos/Ch04/AE.hs", "lines": lines_of("src/TsBase/Algos/Ch04/AE.hs"), "cases": 14},
    {"id": "ch4-vae", "name": "变分自编码器", "file": "src/TsBase/Algos/Ch04/VAE.hs", "lines": lines_of("src/TsBase/Algos/Ch04/VAE.hs"), "cases": 15},
  ],
  "next": {"episode": 37, "title": "混合先验：GMM-VAE 与「多个正常模式」", "slug": "37-ad-gmm-vae-mixture-prior", "minutes": 20},
  "progress": {"delivered": 45, "total": 74},
}

(PACK / "data").mkdir(parents=True, exist_ok=True)
(PACK / "data" / "ae.json").write_text(json.dumps(out, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
print(f'wrote ae.json {len(json.dumps(out)):,} B; checks {out["meta"]["checks"]}; '
      f'F1 ae16 {out["units"]["ae16"]["f1"]:.4f} vae01 {out["units"]["vae01"]["f1"]:.4f} vae1 {out["units"]["vae1"]["f1"]:.4f}')
