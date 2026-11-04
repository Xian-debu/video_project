# 62-anomaly-two-ways - 两种异常，两条路：预测残差与重构误差

> status: delivered (2026-11-04)
> chapter: ch07 | runtime target: 18 min | algorithms: 2

## Thesis

两种异常形态需要两种分数。**尖峰**（单点、5–7σ、只占一天）上，逐点预测残差的 F1 是 0.7059，32 点窗口的自编码器重构误差只有 0.0714——一个点错在 32 个点里会被均方差摊薄。**漂移**（60 天、每天只偏 2σ、整段形状变了）上反过来：残差 F1 0.0914（2σ 每天的误差落在 0.99 分位阈值 3.4467 之下，全程静默），重构 F1 0.6199。两条曲线各赢一场，覆盖的异常形态不同，不是替代关系；这就是本集要量的「边界」。代价也写清楚：窗口长度是另一个旋钮，窗口短则尖峰显、窗口长则漂移显，32 点是折中。

## Verification

证据程序 `evidence-ch07-anom` 一条命令跑 19 项检查（数据 4 / 预测 5 / 重构 5 / 对照 5），**19/19、56.02 s**，写 `summary.json` 与逐行 `checks.txt`。屏幕读数全部来自它：

- 预测侧：33 个系数（32 窗 + 截距）、尖峰 F1 **0.7059**、漂移 F1 **0.0914**、阈值 **3.446733**、标定段报警率 **0.8214%**（4 / 487）。
- 重构侧：**552** 个参数（32×8 + 8 + 8×32 + 32）、训练损失 **0.931890 → 0.650443**（200 轮、lr 0.02）、阈值 **1.624461**、尖峰 F1 **0.0714**、漂移 F1 **0.6199**；漂移窗平均重构分 **2.750203** vs 正常窗 **1.013951**（2.71×）。
- 阈值扫描 6 档（q = 0.90 … 0.999）：尖峰预测 F1 0.189 → 0.8571，漂移预测 0.4294 → 0.0428；重构侧尖峰 0.058 → 0.074、漂移 0.564 → 0.623，方向相反。
- 对照 5 项：两组胜负方向、同种子两次训练一轮参数逐位相同（1 轮 SGD 输出完全一致）、扫描 6 档表与重算一致（无隐藏状态）。

## Data

- `returns_000001.csv`：sz000001 百分比对数收益 `100·ln(c_t/c_{t−1})`，6,599 行（1998-11-26 → 2026-10-28），由 `ts-admin/inventory/scripts/export_ch07_anom.py` 导出（manifest 同目录，sha256 d9e5dad0f561…）。
- 标准化只用 2015–2019 的 **1,219 行**：mu **0.038331**、sd **2.038166**；尖峰与漂移都直接加在标准化后的 z 上，所以幅度单位就是 σ。
- 三段：拟合 2015–2017（**732 窗**）、标定 2018–2019（**487 窗**，定阈值）、测试 2020–2022（**728 点**）。三段不重叠，阈值只在标定段上定，测试段一次都不碰。
- 注入：12 个单点尖峰，幅度 ±5…±7σ（local 30 / 70 / 100 / 200 / 240 / 290 / 320 / 430 / 470 / 540 / 650 / 700）；3 段 60 点梯形漂移（+2.0σ、−2.0σ、+1.8σ，各 20 点爬升 / 20 点持平 / 20 点回落，共 180 点）。

## Algorithms

- `TsBase.Algos.Ch07.PredAnomaly`（104 行）：`residualOf` / `residualsOf`（绝对差）、`quantileThreshold`（type-1：排序取 ceil(q·n)−1）、`flagAbove`（严格大于）、`Confusion` / `confusionOf`、`precisionOf` / `recallOf` / `f1Of`（分母为 0 返回 0）、`sweepThresholds`（同一套函数换 q，不碰训练）。
- `TsBase.Algos.Ch07.ReconAnomaly`（147 行）：`AutoEnc`（W1 是 8×32、W2 是 32×8）、`aeParamCount`、`aeInit`（LCG 种子写死，均匀 [−1/√d, 1/√d]）、`aeForward`（tanh 隐层 + 线性输出）、`aeLoss`（逐维 MSE）、`aeGrad`（解析梯度；dHidden 要按列取 W2——按行取是错的，数值梯度检查当场报错）、`sgdStep`、`trainAE`（`foldl'`）、`causalWindows` / `reconScores`。
- 合计 **251** 行、**24** 条单测（11 + 13），两个模块互不引用、无 IO、无随机（种子写死，可逐位复现）；证据程序 **349** 行。

## 讲稿与排版

- 8 场 30 页 300 行，每场 10 行整页（open / problem / definitions / metrics / implementation / verification 各 4 页，boundary / outro 各 3 页）；目标 18 min，实测见 Delivery。
- 版式沿用 E60/E61：左栏 `left:120, top:292, width:620`，右栏 `left:790, top:292, width:1030`，Card 宽 1010、图表 ≤950，Foot `top:812`。
- 图：`SpikeDriftIntro`（尖峰 −6σ 一天 / 漂移 2σ 六十天）、`SpikeZoom`（测试段 185–225 天）、`DriftZoom`（测试段 108–192 天，注入段 60 天阴影）、`WindowPair`（正常窗 1.0140 vs 漂移窗 2.7502 逐点）、`CausalWindow`（32 点右端对齐当前点）、`AeDiagram`（32 → 8 → 32，552 参数）、`F1Quad` / `F1Pair`（两组 F1 胜负）、`ReconScores`（两种窗口的平均重构分）、`SweepLines`（四条 F1–q 曲线）、`ModuleBars`（104 / 147 / 349）、`SplitBar`（行数与窗口两种切分）。

## Delivery

- 成片：**1,155.80 s（19:15.80）/ 34,674 帧 / 8 场 30 页 / 300 条旁白 / 300 cue**；mp4 58,271,859 B（58.3 MB）/ sha256 `a698ee3b97d25bb2d2add0bbe8f22c91bdc7917adb5a4ac7bde3103cb18b1d9c`；cover.png 212,412 B / sha256 `71613a499fdcb9d6d280d7625dc4f1bbf5e3a71cfe8cae594b8930eab78fb343`（frame 180 = 6.00 s）。
- 音量：mix 48 kHz / 1,156.27 s、peak −1.45 dBFS（限幅前 −1.45）、RMS −26.67 dBFS、ducked **57.7%**（4.5 dB）、musicGain −4.5 dB、preGain 1.0000、fade 1.5 / 2.5；loudnorm out I **−15 LUFS** / TP **−2 dBFS**；music gate stem full_median −25.1 / audible −27.88 / share 0.631 / sub 0.068、PASS；mix gate speech −23.53 / gap_full −30.51 / gap_audible −33.28 / bed 36.7、PASS。
- 字幕与章节：300 cue、00:00:01,200 → 00:19:13,610、**0 条换行**、最长 30 字符；8 章合计 1,155.81 s，首 00:00:00、末 00:17:24。
- 闪烁：34,674 帧 mean|d| **0.0141** / p99 0.1089 / max 8.93 / 7 个切点；still_lint **30 帧 PASS**；30 页静帧逐页人工看（返工 12 处：图注口径、AeDiagram 溢出、SplitBar 行数、calibRate 小数、复现命令路径等）。
- 流水线：**23 stage 全 ok**；tree `43abaa09a5bcc0ad`；8 段全渲染、34,674 帧、复用 0；score 复用 `out/e04-score-loop-48k.wav`（1,560 s / 84 BPM / seed 11，拷入 delivery/score.wav，scoreReused false）。
- 讲稿：8 场 30 页 300 行；TTS 300 clips、实测语音 **971.04 s**、均值 **3.237 s**（min 1.656 / max 5.568）；narration.wav 1,155.07 s / 110,886,764 B（不入库）。
- 复现三条（与成片屏幕一致）：
  1. `cabal run tsbase -- evidence-ch07-anom --data data/episodes/62-anomaly-two-ways --out out/evidence-62 --evidence inventory/evidence/62-anomaly-two-ways.ch7-anom.json`
  2. `cabal test`
  3. `node scripts/make.mjs --film tsint-62-anomaly-two-ways`

## Deviations

- D1 尖峰与漂移都是**注入**的两类形态，不是真实异常标注：本集量的是「两种分数对形态的敏感性」，注入点的位置与幅度写在证据程序里，可逐点复现；不对真实市场的异常检出率下结论。
- D2 预测侧用 33 系数岭回归（λ=1.0）而不是神经网络：残差分数只需要「一个稳定的逐点预测」，闭式解让整条链路无随机、可逐位复算。E60 的 512-64-512 编码器不重训、不参与本集。
- D3 重构侧是 552 参数的 32-8-32 自编码器：小到能在证据程序里 200 轮训完、也能逐行手写梯度；换成 PCA 或别的自编码器逻辑不变——分数要匹配异常的**形状**，这一点不变。
- D4 漂移幅度选 2σ：4σ、10 点爬升的首版让残差 F1 冲到 0.4762（爬升段残差 > 3.45 被抓），量不出「残差失效」；改成 2σ、20 点爬升后预测 F1 0.0914、重构 0.6199。这一条是本集最主要的调参，也说明边界与幅度绑定。
- D5 阈值是标定段 0.99 分位（预测 3.446733 / 重构 1.624461），不是拍出来的数；也因此标定报警率 0.8214% 略低于名义 1%（标定段残差比测试段更薄尾）。
- D6 窗口 32 点是折中而不是最优：窗口短则尖峰的单点占比变大、漂移被切成看不见的碎片；窗口长则形状变化被累积、单点又被平均掉。两端都想要的窗口长度不存在。
- D7 计时 56.02 s 含 200 轮自编码器训练与 6 档阈值扫描，随机器负载浮动（同机 56–73 s）；旁白只说「一分钟上下」，屏幕上的秒数来自当次 JSON。
- D8 成片时长见 Delivery（目标 18 min，按实测旁白走）。
