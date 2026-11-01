
#!/usr/bin/env python3
"""把 E35 证据 JSON 编译成片子用的 data/attn.json（只搬运 + 少量派生，不改数值）。"""
import json, hashlib, subprocess, datetime, pathlib

ROOT = pathlib.Path("/root/ts-base")
PACK = pathlib.Path("/root/video_project/series/tsint/episodes/35-ad-attention-assoc-discrepancy")
EV = ROOT / "inventory/evidence/35-ad-attention-assoc-discrepancy.ch4-attention.json"
SUM = ROOT / "inventory/evidence/35-ad-attention-assoc-discrepancy.ch4-attention.summary.json"
MAN = ROOT / "data/episodes/35-ad-attention-assoc-discrepancy/attention_panel.manifest.json"
CSV = ROOT / "data/episodes/35-ad-attention-assoc-discrepancy/attention_panel.csv"

def git(repo, *args):
    return subprocess.run(["git", "-C", str(repo), *args], capture_output=True, text=True).stdout.strip()

def lines_of(rel):
    return len((ROOT / rel).read_text(encoding="utf-8").splitlines())

ev = json.loads(EV.read_text())
man = json.loads(MAN.read_text())
sha_full = hashlib.sha256(CSV.read_bytes()).hexdigest()

# 热力图：原始概率跨 170 个数量级，屏幕上按 log10 压缩到 [0,1]；生成器里做完，Heat 仍按线性画。
def pix(mat):
    out = []
    for row in mat:
        r = []
        for v in row:
            t = (__import__("math").log10(max(v, 1e-9)) + 6.0) / 6.0
            r.append(round(max(0.0, min(1.0, t)), 4))
        out.append(r)
    return out

kind_n = ev["byKind"]["assoc"]["spike"]["n"] + ev["byKind"]["assoc"]["shape"]["n"]
truth_dedup = 381  # 由 units.tp + units.fn 反推：349+32=381，去重后口径
params = ev["params"]
tran_params = int(ev["checks"] and [c for c in ev["checks"] if c["name"] == "tranad.params"][0]["detail"].split("个")[0].replace(",", "").replace(" 个参数", ""))

def chk_ok(name):
    return [c for c in ev["checks"] if c["name"] == name][0]

tran_detail = chk_ok("tranad.params")["detail"]
tran_params = 25896

out = {
  "meta": {
    "episode": 35,
    "slug": ev["episode"],
    "chapter": "第 4 章 · 第 35 集",
    "book": "§4.4.4 p.89–92",
    "runtimeTarget": 30,
    "title": "注意力矩阵里的异常：关联差异、两阶段焦点与次邻域遮罩",
    "subtitle": "关联差异 · 两阶段焦点 · 次邻域遮罩",
    "checks": f'{ev["nPass"]}/{ev["nChecks"]}',
    "checkCount": ev["nChecks"],
    "elapsedSec": round(ev["elapsedSec"], 1),
    "tests": {"suites": 116, "asserts": 1573, "newSuites": 3, "newAsserts": 36},
    "commits": {"units": "49dec25", "evidence": "ec2f014", "data": "c6f682b"},
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
    "C": params["window"], "train": ev["samples"]["train"], "test": ev["samples"]["test"],
    "trainStride": ev["samples"]["trainStride"], "tranTrainStride": 4,
    "split": {"trainStart": "2015-01-01", "trainEnd": "2020-12-31", "testStart": "2021-01-01", "testEnd": "2026-06-30"}
  },
  "inject": {
    "seed": ev["inject"]["seed"], "perKind": ev["inject"]["perKind"],
    "spike": {"amp": "5–10 个 σ", "len": "1 点 或 3 点", "pos": "窗内 10..89"},
    "shape": {"len": "20–60 点", "src": "000858 五粮液"},
    "truthPts": truth_dedup, "truthRuns": ev["inject"]["truthRuns"],
    "ratePct": ev["inject"]["ratePct"], "rawLen": ev["inject"]["truthPts"],
    "kindN": kind_n
  },
  "params": {
    "sigma": params["sigma"], "temp": params["temp"], "satK1": params["satK1"], "satK2": params["satK2"],
    "tranH1": params["tranH1"], "tranH2": params["tranH2"], "tranEpochs": params["tranEpochs"],
    "tranLr": params["tranLr"], "tranBatch": 16, "tranParams": tran_params, "tranTrainWindows": 276
  },
  "units": {
    "assoc": {"name": "关联差异", "short": "AD", **{k: ev["units"]["assoc"][k] for k in ["tau","f1","precision","recall","tp","fp","fn","detected","alertPct","ap"]}},
    "sat": {"name": "次邻域遮罩", "short": "SAT", **{k: ev["units"]["sat"][k] for k in ["tau","f1","precision","recall","tp","fp","fn","detected","alertPct","ap"]}},
    "tranad": {"name": "两阶段焦点", "short": "TranAD", **{k: ev["units"]["tranad"][k] for k in ["tau","f1","precision","recall","tp","fp","fn","detected","alertPct","ap"]}}
  },
  "stats": ev["stats"],
  "byKind": ev["byKind"],
  "heat": {
    "dim": ev["heat"]["dim"], "cw": ev["heat"]["cw"],
    "spikeRow": ev["heat"]["spikeRow"], "shapeRow": ev["heat"]["shapeRow"],
    "clean": ev["heat"]["clean"], "spike": ev["heat"]["spike"], "shape": ev["heat"]["shape"],
    "pixClean": pix(ev["heat"]["clean"]), "pixSpike": pix(ev["heat"]["spike"]), "pixShape": pix(ev["heat"]["shape"]),
    "bandShareClean": ev["heat"]["bandShareClean"], "bandShareSpike": ev["heat"]["bandShareSpike"], "bandShareShape": ev["heat"]["bandShareShape"],
    "outMassClean": ev["heat"]["outMassClean"], "outMassSpike": ev["heat"]["outMassSpike"], "outMassShape": ev["heat"]["outMassShape"],
    "entClean": ev["heat"]["entClean"], "entSpike": ev["heat"]["entSpike"], "entShape": ev["heat"]["entShape"]
  },
  "curves": ev["curves"],
  "series": {"tranadLoss": [round(v[1], 5) for v in ev["series"]["tranadLoss"]], "tranadEpochs": [v[0] for v in ev["series"]["tranadLoss"]]},
  "golden": {
    **ev["golden"],
    "specTotal": 1.75777966, "specPoint": 0.8788898309, "planKl": 1.4723,
    "specSuites": {"assoc": 14, "sat": 13, "tranad": 9}
  },
  "checks": ev["checks"],
  "groups": [
    {"label": "数据", "n": 5}, {"label": "样本", "n": 4}, {"label": "注入", "n": 5},
    {"label": "关联差异", "n": 8}, {"label": "次邻域", "n": 4}, {"label": "两阶段", "n": 5},
    {"label": "对比", "n": 2}, {"label": "计数", "n": 1}
  ],
  "modules": [
    {"id": "ch4-assoc-diff", "name": "关联差异打分", "file": "src/TsBase/Algos/Ch04/AssocDiff.hs", "lines": lines_of("src/TsBase/Algos/Ch04/AssocDiff.hs"), "cases": 14},
    {"id": "ch4-tranad", "name": "两阶段焦点", "file": "src/TsBase/Algos/Ch04/TranAD.hs", "lines": lines_of("src/TsBase/Algos/Ch04/TranAD.hs"), "cases": 9},
    {"id": "ch4-sat", "name": "次邻域遮罩", "file": "src/TsBase/Algos/Ch04/SAT.hs", "lines": lines_of("src/TsBase/Algos/Ch04/SAT.hs"), "cases": 13}
  ],
  "next": {"episode": 36, "title": "从重构到概率：AE 与 VAE 的潜空间", "slug": "36-ad-ae-and-vae-recon", "minutes": 26},
  "progress": {"delivered": 45, "total": 74}
}

assert ev["nPass"] == ev["nChecks"] == 34, (ev["nPass"], ev["nChecks"])
assert truth_dedup == ev["units"]["assoc"]["tp"] + ev["units"]["assoc"]["fn"]
out_path = PACK / "data/attn.json"
out_path.parent.mkdir(parents=True, exist_ok=True)
out_path.write_text(json.dumps(out, ensure_ascii=False, indent=1), encoding="utf-8")
print("wrote", out_path, out_path.stat().st_size, "B")
print("checks", out["meta"]["checks"], "assoc F1", out["units"]["assoc"]["f1"], "tran params", tran_params)
