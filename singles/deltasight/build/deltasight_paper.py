#!/usr/bin/env python3
"""DeltaSight 片的原文素材构建：抽论文全文 + 渲染图版 + 写 source-figures.json。

为什么要「脚本化」，不手工截图（对照 docs/59 的 A8/A16）：
  - 批注不得入画：用 annots=False 渲染，并对每块裁切区域断言「没有 annotation 与其相交」；
    再叠一层黄像素比例检查，防止批注被压平成内容。
  - 出处必须机器可查：source-figures.json 的七字段（file/source/doc/page/figure/license/attribution）
    由本脚本写，不手填；width/height 由实测像素写入，content 的 plates 门禁会逐张核对。
  - 可复现：裁切矩形写死在 RECTS 里，论文 PDF 不变则输出逐字节一致。

用法：python3 build/deltasight_paper.py [--pdf PATH] [--fail-on-annots]
需要在包根目录下跑（cwd = singles/deltasight）。
"""
import argparse, hashlib, json, os, sys

from PIL import Image

PAPER = "/root/tex_project/my_prof_12/jd1/01-source/3770743.3804070.pdf"
DPI = 300
LICENSE = "CC-BY-4.0"
# 上下白边（占图片宽度的比例）：见 crop 之后那段注释
PAD_TOP = 0.04
PAD_BOTTOM = 0.055
SOURCE = "Qinyu Wang, Cen Chen, Jingkai Huang, Yawen Qiu, Hongen Shao, Xiaofeng Zou, Ziqian Zeng. DeltaSight: Architecting Efficient Video AIoT Systems via Cross-Stage Consistent Redundancy Elimination. DAC '26, Long Beach, CA, USA. DOI 10.1145/3770743.3804070. CC-BY-4.0."

# (id, page, x0, y0, x1, y1, doc, figure, note)
# 坐标来自对 PDF 文本行坐标与图元聚类的实测（见 /root/work/deltasight/{clusters,labels}.py），
# 每块都在 /root/work/deltasight/crops/ 下目检过：不夹正文、不夹 caption、不夹页码。
RECTS = [
    ("fig1-pipeline", 1, 322, 381, 600, 479, "§1 Fig.1",
     "Processing pipeline of a visual AIoT system",
     "sensing（像素阵列→ADC→ISP）→ transmission（MIPI）→ computing（模型）；右下角是 4-bit SAR ADC 的 0/1/3/4 bit 示例"),
    ("fig2-pruning", 2, 316, 78, 565, 140.5, "§2.3 Fig.2",
     "(a) pruning-rate vs mAP; (b) noise injection in different regions",
     "M1 与 M2 的原始证据：(a) 剪掉 60% 以上精度几乎不变；(b) 目标区域加噪掉点、非目标区域加噪几乎不掉"),
    ("fig3-scenes", 3, 66, 255, 290, 367, "§3 Fig.3",
     "Three different scenarios in video streams",
     "① Appearing ② Moving ③ Disappearing 三列；第三行是 masking 结果，底部图例只有三种精度：high / low / skip"),
    ("fig5-arch", 3, 314, 404.5, 545, 544.5, "§4.1 Fig.5",
     "System architecture of DeltaSight",
     "(a) 三层堆栈：Pixel Array / ADC-Readout / In-sensor NPU 经 μTSV 竖直相连、再经 MIPI CSI 到 Host Processor；(b) 标准 5T 像素；(c) 提出来的可重构 ADC（Cτ 用红线圈出）"),
    ("fig6-cdac", 4, 90, 82, 560, 181, "§4.2.1 Fig.6",
     "Similarity Identification Mode of the Reconfigurable ADC",
     "三阶段：① current-frame sampling and holding ② previous-frame reconstruction（SRAM 码打回 CDAC）③ threshold comparison（Cτ 注入 ±τ）"),
    ("fig7-block", 5, 62, 275, 290, 401, "§4.2.2 Fig.7",
     "Block-level readout circuitry",
     "16×32 读出域 = 两个相邻块组；每列组 16 列并行可重构 ADC；blk_sel 控制 2:1 MUX；col_en 逐列门控；右侧 switch box/connection box 做跨域路由"),
    ("table1-accuracy", 6, 50, 228, 300, 326, "§5.2 Table 1",
     "Accuracy and pruning statistics",
     "六次实验的 mAP 与 skip；注意 NFS 的 ViTDeT-B/L 是下降的（−0.50 / −0.88）"),
    ("fig9-energy", 6, 58, 638, 304, 694, "§5.2 Fig.9",
     "Energy savings across individual stages and the end-to-end system",
     "两张子图 ImageNet-VID / NFS，四组柱：sensing / transmission / computation / E2E system；NFS 的节省更多（帧率更高、时序冗余更大）"),
]


def die(msg):
    print("deltasight_paper: " + msg, file=sys.stderr)
    sys.exit(1)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--pdf", default=PAPER)
    ap.add_argument("--paper-txt", default="data/paper.txt")
    ap.add_argument("--plates-json", default="data/source-figures.json")
    ap.add_argument("--plates-dir", default="assets/public/plates")
    ap.add_argument("--dpi", type=int, default=DPI)
    ap.add_argument("--fail-on-annots", action="store_true")
    args = ap.parse_args()

    try:
        import fitz  # PyMuPDF
    except ImportError:
        die("PyMuPDF (fitz) is required: python3 -m pip install pymupdf")

    if not os.path.isfile(args.pdf):
        die("paper not found: " + args.pdf)
    doc = fitz.open(args.pdf)
    if doc.page_count != 7:
        print("warn: page_count=%d (expected 7)" % doc.page_count)

    # ---- 1 全文 ----
    chunks = []
    for i, page in enumerate(doc):
        chunks.append(page.get_text("text"))
    text = "\n".join(chunks)
    text = text.replace("\r\n", "\n")
    os.makedirs(os.path.dirname(args.paper_txt) or ".", exist_ok=True)
    with open(args.paper_txt, "w", encoding="utf-8") as f:
        f.write(text)
    nlines = text.count("\n") + 1
    print("paper.txt: %d bytes, %d lines" % (len(text.encode("utf-8")), nlines))

    # ---- 2 图版 ----
    os.makedirs(args.plates_dir, exist_ok=True)
    plates = []
    for (pid, pg, x0, y0, x1, y1, sec, figure, note) in RECTS:
        page = doc[pg - 1]
        rect = fitz.Rect(x0, y0, x1, y1)
        # 批注不得入画：annots=False 已排除批注对象，这里再断言裁切区内没有批注
        for a in page.annots() or []:
            if a.rect.intersects(rect):
                msg = "%s: annotation %r intersects crop %s" % (pid, a.info.get("title") or a.type, rect)
                die(msg) if args.fail_on_annots else print("warn: " + msg)
        pix = page.get_pixmap(dpi=args.dpi, clip=rect, annots=False, alpha=False)
        name = "p%d-%s.png" % (pg, pid)
        path = os.path.join(args.plates_dir, name)
        pix.save(path)
        # 白边：引擎的 SourcePlate 把「原文」徽标压在左上、把出处条压在图片底部约 26 渲染像素上，
        # 贴底内容（fig2 的 x 轴标签、fig3 的采样精度图例）会被盖住。这里只加白、不动内容：
        # 徽标与出处条落在白边上，缩放到任意渲染宽度都留出余量。
        # pad_top = 0.028、pad_bottom = 0.05 都是按渲染宽度 780–980 px 反推的（26 px / 780 px ≈ 3.3%）。
        _img = Image.open(path).convert("RGB")
        _w, _h = _img.size
        _pt = int(round(PAD_TOP * _w))
        _pb = int(round(PAD_BOTTOM * _w))
        _canvas = Image.new("RGB", (_w, _h + _pt + _pb), (255, 255, 255))
        _canvas.paste(_img, (0, _pt))
        _canvas.save(path)
        pix_w, pix_h = _canvas.size
        # 黄像素自检：纸面本身没有高亮黄，超过 0.2% 说明批注被压平进了内容
        samples = pix.samples
        n = pix.width * pix.height
        yellow = 0
        for i in range(0, len(samples), 3):
            r, g, b = samples[i], samples[i + 1], samples[i + 2]
            if r > 200 and g > 190 and b < 120:
                yellow += 1
        frac = yellow / float(n)
        if frac > 0.002:
            die("%s: %.3f%% yellow pixels — highlighter annotation leaked into the plate" % (pid, frac * 100))
        size = os.path.getsize(path)
        if size > 6 * 1024 * 1024:
            die("%s: %d bytes exceeds the 6 MB plate budget" % (pid, size))
        sha = hashlib.sha256(open(path, "rb").read()).hexdigest()[:16]
        plates.append({
            "id": pid,
            "file": "%s/%s" % (args.plates_dir, name),
            "source": SOURCE,
            "doc": sec,
            "page": str(pg),
            "figure": figure,
            "license": LICENSE,
            "attribution": "Qinyu Wang et al., DeltaSight, DAC'26, p.%d, %s, CC-BY-4.0" % (pg, sec.split(" ")[1]),
            "note": note,
            "width": pix_w,
            "height": pix_h,
            "_sha256_16": sha,
            "_yellow_pct": round(frac * 100, 4),
            "_bytes": size,
        })
        print("plate %-16s p%d %4dx%-4d %6.1f KB yellow=%.3f%% sha=%s" % (pid, pg, pix_w, pix_h, size / 1024.0, frac * 100, sha))

    manifest = {
        "schemaVersion": 1,
        "note": "DeltaSight 论文原文图版：每张都是从 PDF 直接裁切（annots=False，300 dpi），不是重绘。裁切矩形见 build/deltasight_paper.py 的 RECTS。",
        "plates": plates,
    }
    with open(args.plates_json, "w", encoding="utf-8") as f:
        json.dump(manifest, f, ensure_ascii=False, indent=2)
        f.write("\n")
    print("source-figures.json: %d plates" % len(plates))


if __name__ == "__main__":
    main()
