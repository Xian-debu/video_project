# 61-probabilistic-heads - 不止一个数：分位损失、分位线交叉与分布头

> status: produced (pack ready; delivery pending render)
> chapter: ch07 | runtime target: 18 min | algorithms: 3

## Thesis

三个分位数独立训练的预测会出现交叉（本章实测交叉率 3.36%）；把 τ 维度按样本排序后交叉率归零，而 pinball 损失只变 −0.2568%——「分位线必须单调」是一条可以零成本加上的结构约束。负结果与口径：交叉率是设定的函数（窗口 64 → 14.10%、窗口 20 + 全量 → 0.0275%），所以屏幕上的数只能与固定口径一起引用；高斯分布头的覆盖率 0.924 低于名义 0.95，缺口全在尾部（最极端一天 −17.69%，区间外 38 天 = 15 低 + 23 高）。

## Verification

证据程序 `evidence-ch07-prob` 一条命令跑 18 项检查（数据 4 / pinball 4 / 交叉 6 / 分布 4），18/18、2.18 s，写 `summary.json` 与逐行 `checks.txt`。屏幕读数全部来自它：交叉 881 / 26,208 = 3.3616% → 0；pinball 0.726731 → 0.724864；黄金值 0.9 / 0.1 / 0.1 / 0.9；tau=0.5 退化 1.0000；中位数 MAE 1.666557 vs 基线 1.724896；手工样例 3 个逆序对；NLL 锚点 0.918939；拟合高斯 mu −0.026562 / sigma 2.168555 / NLL 2.274503；覆盖率 0.9240；解析梯度 −2.136647 / −0.860855。

## Data

- `returns_000001.csv`：sz000001 后复权收盘的百分比对数收益 `100·ln(c_t/c_{t−1})`，6,599 行（1998-11-26 → 2026-10-28，sha256 d9e5dad0f561…），由 `ts-admin/inventory/scripts/export_ch07_prob.py` 导出（manifest 同目录）。
- 切分：训练池 1,219 行（2015–2019）；拟合用 400 个少样本窗口（`shuffleTake`，确定性 LCG 键排序）；测试 728 行（2020–2022）；覆盖率窗口取测试段最后 500 天（2020-12-11 → 2022-12-30）。
- 窗口 32 点、桶 33（含偏置 1），9 条分位线 0.1…0.9。均值 −0.0266、标准差 2.1686、实测覆盖率 0.9240。

## Algorithms

- `TsBase.Algos.Ch07.Pinball`（87 行）：`pinball`（tau 外报错、两分支罚项）、`meanPinball`（按 tau 数 × 样本数归一）、`empiricalQuantile`（type-1）、`isTauGrid`、`crossingPairs` / `crossingRate`（逆序对归一，<2 条线报错）。
- `TsBase.Algos.Ch07.QuantileRearrange`（52 行）：`rearrangeRow` / `rearrangeRows`（逐样本排序回填，行宽不一致报错）、`monotoneRow` / `monotoneRows`（按样本取九个 tau 检查单调）。
- `TsBase.Algos.Ch07.DistHead`（120 行）：`gaussianNll`、`gaussianNllMean`、`gaussianNllGrad`（mu / raw 解析梯度）、`softplus` / `sigmoid`、`sigmaFromRaw`（softplus + 1e-6）、`fitGaussianMoments`（n−1）、`standardNormalQuantile`（Acklam，误差约 1.6e-9）、`intervalCoverage`。
- 合计 259 行，28 条单测（11 / 8 / 9），三个模块互不引用、无 IO、无外部库；证据程序 282 行。

## 讲稿与排版

- 8 场 30 页 300 行，每场 10 行整页；目标 18 min，实测见 Delivery。
- 版式沿用 E60：左栏 `left:120, top:292, width:620`，右栏 `left:790, top:292, width:1030`，Card 宽 1020（内宽 972）、图表 ≤950，Foot `top:812`。
- 图：`CrossingSchematic`（交叉/排序两态）、`PinballShape`（三 tau 损失曲线）、`RearrangeStrip`（6 tau × 5 样本）、`CrossingBars`（881 → 0）、`LossDelta`（0.726731/0.724864）、`QuantileFan`（经验 vs 高斯九分位）、`CoverageBars`（0.95 / 0.924）、`ModuleLines`（87/52/120）、`DataSplit`（6599/1219/400/728/500）、`TauOrderStrip`。

## Delivery

- 成片：**1,194.87 s（19:54.87）/ 35,846 帧 / 8 场 30 页 / 300 条旁白 / 300 cue**；mp4 63,742,098 B（63.7 MB）/ sha256 `1d06c00…6e609`；cover.png 218,621 B / sha256 `3f2d387…bc0510`（frame 180 = 6.00 s）。
- 音量：mix 48 kHz / 1,196.07 s、peak −1.00 dBFS（限幅前 −0.97）、RMS −26.61 dBFS、ducked **58.3%**（4.5 dB）、musicGain −4.5 dB、preGain 0.9963、fade 1.5 / 2.5；loudnorm out I **−15 LUFS** / TP **−2 dBFS**；music gate stem full-band −25.1 dBFS、audible share 63.1%、sub 6.8%、PASS；mix gate speech −23.57 / gap_full −30.58 / gap_audible −33.36 / bed 36.6 dB、PASS。
- 字幕与章节：300 cue、00:00:01,200 → 00:19:52,670、**0 条换行**、最长 32 字符；章节合计 1,194.87 s，首 00:00:00、末 00:18:08，共 8 章。
- 闪烁：35,846 帧 mean|d| **0.0141** / p99 0.1084 / max 7.89 / 7 个切点；still_lint 4 帧 PASS；30 页静帧逐页人工看（返工 5 页版式）。
- 流水线：**23 stage 全 ok**；tree `bfc9602f1479596d`；8 段全渲染、35,846 帧、复用 0；score 用本集 `delivery/score.wav`（1,560 s，scoreReused false）。
- TTS：300 clips、实测语音 **1,010.11 s**、均值 **3.367 s**（min 1.704 / max 5.424）；narration.wav 1,194.87 s / 114,707,564 B（不入库）。
- 复现三条（与成片屏幕上一致）：
  1. docker exec haskell-ts bash -lc 'export PATH=/opt/ghc/9.14.1/bin:$PATH; cd /work && cabal run tsbase -- evidence-ch07-prob --data data/episodes/61-probabilistic-heads --out out/evidence-61 --evidence inventory/evidence'
  2. docker exec haskell-ts bash -lc 'export PATH=/opt/ghc/9.14.1/bin:$PATH; cd /work && cabal test'
  3. cd /root/video-pipeline-blueprint && node scripts/make.mjs --film tsint-61-probabilistic-heads

## Deviations

- D1 交叉率不是书里的「3–5%」单一数：实测 3.3616%，且随设定变化（窗口 64 → 14.10%、窗口 20 + 全量 1,155 → 0.0275%）；本集在边界页把三种设定并排写出来。
- D2 主结论带负结果：排序消交叉几乎免费，但**不提升精度**，高斯头的覆盖率也低于名义值（0.924 vs 0.95）。
- D3 拟合用 400 个窗口（少样本协议），不是全量 1,155：全量会让九条线几乎平行、交叉率掉到万分之三，失去本集的观测对象。
- D4 交叉计数分母是「Tau 对子数 × 样本数」（26,208 = 36 × 728），不是样本数；检查里有一条手算样例（3 个逆序对）锁定口径。
- D5 高斯头用矩估计（`fitGaussianMoments`，n−1）而不是最大似然，屏幕上的 mu/sigma 与 NLL 都来自矩估计。
- D6 标准正态分位数用 Acklam 近似而非库函数，误差约 1.6e-9；覆盖率对 z 的敏感性未做扫描。
- D7 计时 2.18 s 含拟合与覆盖率统计；首版计时漏了惰性求值，检查数稳定但耗时为 0，已用 `evaluate` 强制求值后才给出数字。
- D8 本集不训练神经网络：三个模块是纯函数 + 闭式/迭代拟合，分位头用加权岭回归 IRLS（25 轮），编码器沿用 E60 的 512-64-512 结构但不重训。
- D9 成片 1,194.87 s（19:54.87），长于 18 min 目标：讲清楚优先，长度按实测旁白走。
- D10 尾部页改用 50 点分位曲线（tau 0.01–0.99）而不是九点扇形：九点扇形在 0.9 与 0.95 之间看不出右尾的跳变，会把「右尾更厚」讲反。
