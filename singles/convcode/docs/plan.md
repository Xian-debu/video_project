# 《卷积码：GSM 如何在噪声里听清你》—— 验收片

四部分收尾任务里的"一条验收片"：材料是 3GPP TS 45.003 V18.0.0（Channel coding，
ETSI TS 145 003 V18.0.0），讲 GSM 全速率语音信道里那段速率 1/2、K=5 的卷积码。
目标读者是"听说过误码率、没写过维特比"的人：先给直觉，再上标准原文，最后跑一遍。

composition id `Convcode`，9 场、1920×1080 / 30 fps。

## 1. 这部片子要同时满足的四件事

1. **清楚**：不做章节复述。顺序是 问题（噪声里为什么还能听懂）→ 标准的切法（260 位怎么分）
   → 编码器（四位记忆、两次异或）→ 译码（16 状态网格 + 维特比）→ 交织（把连错摊开）
   → 实测（自己跑 BER）→ 工程（定点、吞吐、继任者）。标准原文只出现在它真正回答问题的位置。
2. **低门槛**：每个抽象概念先给一个日常类比（邮寄地址写两遍 / 鸡蛋分篮子 / 十六个状态里挑最像的一条路），
   再落到公式；公式旁边一定有可读的数字。
3. **可复现**：BER 曲线、纠错恢复率、交织示意全部由 `build/generate_convcode_data.py`
   确定性生成（seed 20261027），不是画出来的示意图。
4. **有出处**：每个上屏的规范数字都进 `data/claims.json`，`quote` 是 `data/spec.txt`
   某一行的精确切片；片子里的原文图用 `SourcePlate` 显示并标注页码。

## 2. 材料：哪几段原文、为什么只截这几段

标准 PDF 共 348 页，图 1a（信道编码总览）整页缩进 1080p 后字号不足 6 px，不可读。
所以片子只截**四个信息密度最高的局部**，每张都紧贴正文、按 200 dpi 渲染、白底，
底部留 100 px 白边给出处条（`SourcePlate` 的出处条压在图片内部，紧贴正文会把最后一行盖住）：

| plate id | 文件 | 出处 | 画面用途 |
|---|---|---|---|
| `parity` | ts45003-3121-parity.png | §3.1.2.1 a)（p.44） | 50 位 + 3 校验位、(53,50,2) 循环码、g(D)=D³+D+1 |
| `conv-encoder` | ts45003-3122-conv.png | §3.1.2.2（p.45） | G0/G1 多项式、c(2k)/c(2k+1) 定义、class 2 直通 |
| `interleave` | ts45003-313-interleave.png | §3.1.3（p.45） | i(B,j)=c(n,k) 规则 + 每块 57 位的分布说明 |
| `annexb` | ts45003-annexb-g.png | Annex B（p.347） | G0/G1 被 TCH/FS、SDCCH、SACCH、FACCH 等复用 |

四张图都只用一次，画面上停留 5–8 s，配合旁白读关键行；不整页贴、不盖住原文批注。
最窄的一张显示宽度 780 px（原图 1463 px），正文约 15 px，暂停可读。

## 3. 九场

| # | id | 章节 | 主体 | 原文 |
|---|----|------|------|------|
| 1 | open | 开场 | 260 bit / 20 ms 的一帧语音，穿过空气 | — |
| 2 | problem | 冗余的代价 | 0 dB 未编码 7.9% 误比特；地址写两遍的类比 | — |
| 3 | spec | 标准里的那张图 | 260 → 182+78 → 50+3 → 189 → 378 → 456 | `parity` |
| 4 | encoder | 四位记忆 | 移位寄存器 + 两条异或支路 + 真跑前八步对账 | `conv-encoder` |
| 5 | trellis | 十六个状态 | 16 状态网格、每步 32 条候选留 16 条、4 位尾零收尾 | — |
| 6 | interleave | 把错误摊开 | 24 位连错 vs 摊到 8 个突发；块对角深度 4；40 ms 延迟 | `interleave` |
| 7 | demo | 跑一遍 | 不编码 / 硬判决 / 软判决三条 BER 曲线；1e-3 处 6.8/5.2/3.2 dB；翻位恢复率 | — |
| 8 | impl | 算法很短，工程很长 | 十行 JS 编码器 + Annex B 复用 + 定点/吞吐/功耗 | `annexb` |
| 9 | outro | 结语 | 189、×2、8×57、3.6 dB 四个数字 | — |

场次时长由 `data/convcode/voice.json` 的实测旁白长度决定（`script.ts` 先按字数估值，
合成后重排），不是手填的。

## 4. 一个真源：data/convcode/eval.json

规范数字手写、逐条带原文引用，供 `claims.json` 与画面共用：

- 帧结构：260 位 / 20 ms；class 1 = 182，class 2 = 78；class 1a = 50 + 3 校验位 = 53；
  重排后 189（182 + 3 + 4 尾零）；编码后 378；加 class 2 共 456。
- 卷积码：rate 1/2，K=5，memory 4，16 状态；G0 = 1+D³+D⁴ = 0b10011 = 19；
  G1 = 1+D+D³+D⁴ = 0b11011 = 27。
- 交织：8 个突发 × 57 位；块对角深度 4。

派生数据 `data/demo.json` 由 `python3 build/generate_convcode_data.py` 生成（不提交，见 .gitignore）：

| 内容 | 方法 | 性质 |
|---|---|---|
| BER 曲线 | BPSK/AWGN，每点 4000 帧（756 000 信息比特），0–7 dB；硬判决 Hamming 度量、软判决相关度量，逐帧维特比 + 4 位尾零 | 实测（确定性 seed） |
| 1e-3 处增益 | 三条曲线线性内插到 1e-3：不编码 6.82 dB、硬判决 5.18 dB、软判决 3.18 dB | 内插 |
| 翻位恢复 | 456 位中随机翻 0/10/20/30/40 位，硬判决维特比整帧恢复率：100 / 99.27 / 81.10 / 29.33 / 1.33% | 实测 |
| 交织示意 | 概念性块交织：24 位突发摊到 8 行、每行 3 位 | **示意**，不是 GSM 的块对角交织器 |

## 5. 诚实的边界

- **交织那一场画的是概念性块交织**，GSM 用的是 block diagonal（深度 4）变体。
  旁白说"同样的 24 位分散到八个突发"，画面标注"示意"，claims 记 ILLUSTRATION；
  真正的规则以 `interleave` 原文图为准。
- **K=5 是推出来的**：标准只写多项式最高次为 D⁴，没直接写 K；claims 记 DERIVED。
- **13 kbps 是语音编码器净荷速率**，不是空口速率；40 ms 延迟是 8 个 TDMA 帧的推导值（≈36.9 ms，取整）。
- BER 曲线是本片自己跑的仿真，不是标准里的性能指标；数字与生成脚本一起交付，可原样重跑。

## 6. 复现

```bash
# 1) 结构检查（16 部片子 / 素材门 / 出处门）
node tools/check.mjs && node tools/plates.mjs

# 2) 数据：BER 曲线、恢复率、交织示意（约 10 s）
python3 singles/convcode/build/generate_convcode_data.py

# 3) 逐句旁白（IndexTTS-2，需 TTS 环境）
python3 scripts/tts/synthesize_lines.py --lines data/convcode/lines.json \
  --out-dir public/voice/convcode --voice-json data/convcode/voice.json \
  --clips-json data/convcode/clips.json --indextts ... --model-dir ... --ref-audio ... --fp16

# 4) 成片（引擎仓，21 个阶段）
npm run make -- --film convcode --out out/convcode
```

## 7. 验收清单

- [x] 260/182/78/50/3/53/189/378/456、rate 1/2、K=5、G0/G1、8×57 全部有 claims 行
- [x] 四个原文图版：紧贴正文、白底、出处条、页码、原文徽标
- [x] 数据可重跑：seed 固定、两跑一致
- [x] 片中不出现未标注的"示意"数字（交织场标注"示意"，曲线场标注"Python 复现"）
- [ ] 成片渲染与响度/闪烁 QA
- [ ] B 站投稿
