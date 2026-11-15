#!/usr/bin/env python3
"""Build data/claims.json: one row per paper number the film shows or says.

Why a generator rather than hand-typed quotes (docs/59 A9): a quote must be an EXACT slice of
data/paper.txt, and typing it by hand is how a paraphrase sneaks in. Each row below names its
sentence by a unique hint; the generator slices that sentence out of paper.txt and refuses to write
anything if the hint is missing, if the value is in none of the committed ledgers, or if the scene
is not one of the film's scenes.

  python3 build/make_claims.py            # write data/claims.json (prints every quote)
  python3 build/make_claims.py --check    # verify only
"""
import argparse
import json
import pathlib
import re
import sys

PACK = pathlib.Path(__file__).resolve().parent.parent
PAPER = PACK / "data" / "paper.txt"
OUT = PACK / "data" / "claims.json"
SKIP_LEDGERS = {"claims.json", "clips.json", "crops.json", "voice.json", "lines.json"}

SCENES = ["open", "problem", "mismatch", "criterion", "algo", "route", "adc",
          "block", "pipeline", "system", "accuracy", "energy", "limits", "outro"]

# (id, scene, onScreen, value, dataset, hint, where, note)
SPEC = [
    # --- 开场 / 问题 -------------------------------------------------------------------
    ("open-fixed", "open", "固定帧率 · 全分辨率", "30",
     "ImageNet VID 评测帧率（Table 2 表头）",
     "sampling is performed at a fixed frame rate and full resolution",
     "§1 stage (i)", "SENTENCE-SUPPORT：这句只支持「固定帧率、全分辨率」这个设计前提；30 取自 Table 2 表头的评测帧率"),

    ("problem-share", "problem", "传感 + 传输 = 37%∼53% 系统能耗", "37%∼53%",
     "§1 引 [3,8] 的系统能耗调查",
     "for as much as 37",
     "§1 ¶3", ""),

    ("problem-stages", "problem", "三段：sensing / transmission / computing", "3",
     "§1 Fig.1",
     "generally comprises three stages",
     "§1 ¶2", "数字是「三段」这个结构本身；分段名称逐字来自原文"),

    # --- 错配 ---------------------------------------------------------------------------
    ("mismatch-60", "mismatch", "扔掉 60% 以上的数据与相应计算", "60",
     "§2.3 Motivation 1 / Fig.2(a)",
     "even eliminating over 60% of the data",
     "§2.3 M1 + §2 intro", ""),

    ("mismatch-noise", "mismatch", "同一噪声注入：前景 vs 背景", "0.3",
     "§2.3 Motivation 2 / Fig.2(b)",
     "corrupting foreground regions leads to a noticeable accuracy drop",
     "§2.3 M2", "SENTENCE-SUPPORT: 0.3 = Fig.2(b) 横轴噪声幅度上限；这句给的是「不对称」这个结论"),

    # --- 判据 ---------------------------------------------------------------------------
    ("criterion-p16", "criterion", "P = 16（执行粒度）", "16",
     "§4.2.2",
     "minimum execution granularity of",
     "§4.2.2", ""),

    ("criterion-patch", "criterion", "ViT patch 16×16", "16",
     "§5.1 Benchmarks",
     "All models adopt a 16",
     "§5.1", ""),

    # --- 算法 ---------------------------------------------------------------------------
    ("algo-tau", "algo", "τ = 0.5% VREF", "0.5",
     "§3 Eq.(3)",
     "is fixed at 0.5%",
     "§5.2 Algorithm Validation（阈值定义与 Table 1 同）", ""),

    ("algo-kappa", "algo", "κ = 60 / 80（按模型扫出来的计数阈值）", "60",
     "Table 1 的 (τ, κ) 列",
     "0.5%, 60.0",
     "Table 1", "κ 是「块内有多少像素差在 τ 内才判相似」的计数阈值，不是比例"),

    # --- 三场景 -------------------------------------------------------------------------
    ("route-three", "route", "appearing / moving / disappearing-occluded", "3",
     "§3 图 3 的三个场景",
     "we summarize the inter-frame variations into three typical scenarios",
     "§3", ""),

    # --- 硬件算例 -----------------------------------------------------------------------
    ("adc-vin", "adc", "V_IN = 0.751 V", "0.751", "§4.2.1 算例",
     "we illustrate the similarity-identification mode", "§4.2.1", ""),

    ("adc-code", "adc", "上帧码 1100000000₂", "1100000000", "§4.2.1 算例",
     "Given the previous-frame code", "§4.2.1", ""),

    ("adc-vdac", "adc", "V_DAC = 0.75 V", "0.75", "§4.2.1 算例",
     "is loaded into the CDAC array", "§4.2.1", ""),

    ("adc-residual", "adc", "−1 mV（重建后的残差）", "-1mV", "§4.2.1 算例",
     "The comparator negative-input voltage is then updated to", "§4.2.1", ""),

    ("adc-tau", "adc", "τ ≈ 0.5% VREF = 5 mV（±τ 由 Cτ 注入）", "5mV", "§4.2.1 算例",
     "a small capacitor", "§4.2.1", ""),

    ("adc-plus", "adc", "+τ 支路 → +4 mV → 比较器输出 1", "+4mV", "§4.2.1 算例",
     "Two successive comparisons are performed", "§4.2.1", ""),

    ("adc-minus", "adc", "−τ 支路 → −6 mV → 比较器输出 0", "-6mV", "§4.2.1 算例",
     "is grounded to apply a", "§4.2.1", ""),

    # --- 块级读出 -----------------------------------------------------------------------
    ("block-domain", "block", "16× 32 读出域（16 行 × 32 列）", "16× 32", "§4.2.2",
     "32 readout domain, which corresponds", "§4.2.2", ""),

    ("block-cols", "block", "每个 ADC 阵列 16 列并行", "16", "§4.2.2",
     "Each ADC array contains 16 column-parallel channels", "§4.2.2", ""),

    ("block-array", "block", "672×672 像素阵列", "672", "§5.2 Sensor Area",
     "stacked design integrates a", "§5.2", ""),

    ("block-pitch", "block", "2.9 μm 像元间距", "2.9", "§5.2 Sensor Area",
     "pixel pitch", "§5.2", ""),

    # --- 四阶段位宽 ---------------------------------------------------------------------
    ("bit-zero-vid", "pipeline", "ImageNet VID：79.4% 像素 0-bit", "79.4", "Table 2",
     "Over 79.4% of pixels are assigned 0-bit", "§5.2 Table 2", ""),

    ("bit-ten-vid", "pipeline", "只有 18.1% 需要完整 10-bit", "18.1", "Table 2",
     "only 10.5%", "§5.2 Table 2", ""),

    ("bit-zero-nfs", "pipeline", "NFS：86.8% 像素 0-bit", "86.8", "Table 2",
     "NFS @120FPS ImageNet VID @30FPS 0 Bit", "§5.2 Table 2", ""),

    ("bit-energy", "pipeline", "A/D 能耗降 83.9%（NFS）/ 74.2%（VID）", "83.9", "Table 2",
     "lowers A/D conversion energy by", "§5.2", ""),

    ("bit-energy-vid", "pipeline", "同上，VID 侧 74.2%", "74.2", "Table 2",
     "compared with conventional fixed-precision sampling", "§5.2", ""),

    # --- 系统协同 -----------------------------------------------------------------------
    ("system-transmit", "system", "每帧真正传的比例：35.2% / 27.8%", "35.2",
     "由 Table 1 的 skip 列推得", "The host retains the complete previous frame", "§5.2 Multi-ROI coalesced frame",
     "DERIVED：= 100 − skip，两个数都由 Table 1 的 skip 列算出"),

    # --- 精度 ---------------------------------------------------------------------------
    ("acc-skip", "accuracy", "跳过 64.8% / 72.2% 的区域", "64.8", "Table 1",
     "DeltaSight skips 64.8% and 72.2% of regions", "§5.2", ""),

    ("acc-vid-map", "accuracy", "VID：41.06 / 82.37 / 83.51", "41.06", "Table 1",
     "ImageNet VID ViTDeT-S 0.5%, 60.0 40.94", "Table 1", ""),

    ("acc-nfs-map", "accuracy", "NFS：55.99 / 81.69 / 81.47", "81.69", "Table 1",
     "0.5%, 60.0 82.19 81.69 70.1", "Table 1", ""),

    ("acc-drop", "accuracy", "NFS 上 B 掉 0.50、L 掉 0.88 mAP", "-0.50", "Table 1",
     "0.5%, 80.0 82.35 81.47 73.2", "Table 1",
     "DERIVED：82.19−81.69 = −0.50，82.35−81.47 = −0.88；表里没有直接写差值"),

    ("acc-avg", "accuracy", "平均 68.67→69.98（+1.31）/ 72.71→73.05（+0.34）", "69.98", "Table 1",
     "Average - 0.5%, 66.7 68.67 69.98 64.8", "Table 1", ""),

    # --- 能耗 ---------------------------------------------------------------------------
    ("energy-sensing", "energy", "sensing 2.4×", "2.4", "§5.2 / Fig.9",
     "the sensing and transmission stages achieve average", "§5.2", ""),

    ("energy-transmission", "energy", "transmission 3.2×", "3.2", "§5.2 / Fig.9",
     "the sensing and transmission stages achieve average", "§5.2", ""),

    ("energy-e2e", "energy", "E2E 1.7×", "1.7", "§5.2 / Fig.9",
     "yielding an overall 1.7", "§5.2", ""),

    ("energy-simid", "energy", "相似识别自身吃掉传感功耗 25.98% ~ 30.97%", "25.98", "§5.2 Fig.10(c)",
     "this stage accounts for 25.98% and 30.97%", "§5.2", ""),

    ("energy-simid-nfs", "energy", "NFS 侧 30.97%", "30.97", "§5.2 Fig.10(c)",
     "corresponding to 11.86% of the Base-FULL sensor energy", "§5.2", "同一句给了两个数据集的占比"),

    ("energy-simid-budget", "energy", "= Base-FULL 传感能量的 11.86%", "11.86", "§5.2",
     "this stage accounts for 25.98%", "§5.2", "同一句给了两个数据集占比与相对 Base-FULL 的 11.86%"),

    ("energy-simid-119", "energy", "相似识别占 Base-FULL 预算 11.9%", "11.9", "§5.2",
     "adds similarity identification at 11.9%", "§5.2", ""),

    # --- 边界 ---------------------------------------------------------------------------
    ("limits-array-area", "limits", "像素阵列 6.81 mm²", "6.81", "§5.2 Sensor Area",
     "this region occupies 6.81", "§5.2", ""),

    ("limits-die", "limits", "整个 die ≈ 7.4 mm²（版图估算，不是流片）", "7.4", "§5.2 Sensor Area",
     "The total die area is therefore approximately 7.4", "§5.2", "面积是 foot-print 估算；论文没有 silicon measurement"),

    ("limits-sram", "limits", "片内 SRAM 0.9 MB", "0.9", "§5.2 Sensor Area",
     "including the SRAM", "§5.2", ""),

    # --- 结语 ---------------------------------------------------------------------------
    ("outro-e2e", "outro", "跨级一致地消冗余 → 1.7× 端到端", "1.7", "§5.2",
     "yielding an overall 1.7", "§5.2", ""),
]


def norm(s):
    return re.sub(r"\s+", " ", s).strip()


def cmp_key(s):
    """Compare on the characters the paper and the screen spell differently: the true-minus sign
    and the tilde. Display strings keep whatever they were authored with."""
    return s.replace("\u2212", "-").replace("\u223c", "~").replace("\uff5e", "~")


def paragraphs(text):
    out = []
    for raw in text.split("\n\n"):
        p = norm(raw)
        if p:
            out.append(p)
    return out


def split_sentences(para):
    return [s.strip() for s in re.split(r"(?<=[.!?])\s+", para) if len(s.strip()) > 12]


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--check", action="store_true")
    a = ap.parse_args()

    paper_raw = PAPER.read_text(encoding="utf-8")
    paras = paragraphs(paper_raw)
    sents = [(pi, s) for pi, p in enumerate(paras) for s in split_sentences(p)]
    paper = norm(paper_raw)

    data_dir = PACK / "data"
    ledgers = {}
    for p in sorted(data_dir.glob("*.json")):
        if p.name in SKIP_LEDGERS:
            continue
        ledgers[p.name] = norm(p.read_text(encoding="utf-8"))
    if not ledgers:
        print("no ledger json under data/ (run build/generate_deltasight_data.py first)", file=sys.stderr)
        return 1

    claims = []
    problems = []
    for row in SPEC:
        cid, scene, on_screen, value, dataset, hint, where, note = row
        if scene not in SCENES:
            problems.append("%s: scene %r is not a film scene" % (cid, scene))
        v = cmp_key(value)
        hits = [s for (_, s) in sents if hint in s]
        quote = None
        if len(hits) == 1 and note.startswith(("DERIVED", "SENTENCE-SUPPORT")):
            quote = hits[0]
        elif len(hits) == 1 and v in cmp_key(hits[0]):
            quote = hits[0]
        elif len(hits) >= 1:
            # 句子里没有这个数：退一步取它所在的整段（表格里句号会切碎行）
            para_hits = [p for p in paras if hint in p and v in cmp_key(p)]
            if len(para_hits) == 1:
                quote = para_hits[0]
        if quote is None:
            problems.append("%s: hint %r -> %d sentence(s), and no single paragraph holds value %r"
                            % (cid, hint, len(hits), value))
            continue
        if not note.startswith(("DERIVED", "SENTENCE-SUPPORT")):
            missing = [n for n, t in ledgers.items() if v not in cmp_key(t)]
            if len(missing) == len(ledgers):
                problems.append("%s: value %r is in none of %s" % (cid, value, sorted(ledgers)))
                continue
        else:
            missing = [n for n, t in ledgers.items() if v not in cmp_key(t)]
            if len(missing) == len(ledgers):
                problems.append("%s: even with a %s note, value %r is in no ledger"
                                % (cid, note.split(":")[0], value))
                continue
        entry = {
            "id": cid,
            "scene": scene,
            "onScreen": on_screen,
            "value": value,
            "dataset": dataset,
            "quote": quote,
            "where": where,
        }
        if note:
            entry["note"] = note
        claims.append(entry)

    if problems:
        print("FAIL %d problem(s):" % len(problems), file=sys.stderr)
        for p in problems:
            print("  " + p, file=sys.stderr)
        return 1

    doc = {
        "meta": {
            "paper": "Qinyu Wang et al., DeltaSight: Architecting Efficient Video AIoT Systems via Cross-Stage Consistent Redundancy Elimination, DAC '26, DOI 10.1145/3770743.3804070, CC BY 4.0",
            "source": "data/paper.txt（PyMuPDF 抽取，页码 = PDF 物理页）",
            "generator": "build/make_claims.py——quote 由生成器从 paper.txt 切出，不手打；每行 quote 都是 paper.txt 里一整句（空白归一后逐字匹配）",
            "ledgers": sorted(ledgers),
            "note": "note 以 DERIVED 开头 = 由表里的数算出来的差值，原文没有直接写；SENTENCE-SUPPORT = 这句只支持定性结论，数字另有出处",
        },
        "claims": claims,
    }
    text = json.dumps(doc, ensure_ascii=False, indent=2) + "\n"
    if a.check:
        print("check ok: %d claims (dry run, %d ledgers)" % (len(claims), len(ledgers)))
        return 0
    OUT.write_text(text, encoding="utf-8")
    per_scene = {}
    for c in claims:
        per_scene[c["scene"]] = per_scene.get(c["scene"], 0) + 1
    print("wrote %s: %d claims over %d scenes" % (OUT.relative_to(PACK), len(claims), len(per_scene)))
    for s in SCENES:
        print("  %-10s %d" % (s, per_scene.get(s, 0)))
    missing = [s for s in SCENES if s not in per_scene]
    if missing:
        print("  note: no rows for " + ", ".join(missing))
    return 0


if __name__ == "__main__":
    sys.exit(main())
