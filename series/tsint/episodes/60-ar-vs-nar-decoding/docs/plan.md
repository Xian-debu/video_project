# 60-ar-vs-nar-decoding - 一步一步还是一口气：自回归与非自回归解码

> status: draft (2026-11-04) | runtime target: 16 min | chapter: ch07 | algorithms: 2 个模块（自回归 rollout / 非自回归一次输出）

## Thesis

同一个编码器、同一批窗口、同一个目标：把未来 20 天一次说完，还是说一步再回灌一步？本集把预测头拆成两条路，在 000001.SZ 2020–2022 的高波动段上直接对拍。

自回归头只有 **66** 个参数（64 维表示 + 最后一点直连 × 1 步输出），训练时喂真值（教师强制），推理时把自己的预测喂回去，滚 20 步。非自回归头 **1,320** 个参数（(64+1+1)×20，偏置并入最后一列），一次前向直接吐出 20 维。

结论分三句讲：① 短地平线上两条路本来就是同一个预测器，F=1 相对 MAE 同为 **1.1352**；② 地平线拉长，回灌开始积累误差，F=20 时 AR **1.5647**、NAR **1.2932**，AR 高出 21%，两条曲线在 **F=8** 交叉；③ 一次性解码快 **15.71×**（197 个窗口：AR 20 步 0.368249 s，NAR 一次 0.023443 s）。但两条曲线都 > 1：**谁都没打赢 persistence**（基线 MAE 0.224299），计划里「误差按 √F 放大」也没有出现。本集按实测讲，负结果与偏差逐条登记。

## Verification

看完能自己复现：① 全集 6,600 行（1998-11-25 → 2026-10-28），测试段取 2020-01-02 → 2022-12-30 的 **728** 点（全集 testStart = 4949），切 512+20 得 **197** 个窗口；② 训练/验证只用 2020 前数据：4,418 个候选窗 → **3,418 训 / 1,000 验**，测试段与全集切片逐值对齐（contiguous）；③ 编码器不用 E59 权重，按同结构 **66,113** 参数在 2020 前窗口重训 20 epoch，最佳第 20 轮，val 0.230266；④ AR 复制函数 f=last 时 20 步 rollout 全等于最后一点，F=1 与单步预测逐位相同，同一窗口两次 rollout 逐位相同；⑤ 曝光偏差：教师强制 MAE **0.076236**，自由回灌 **0.350959**，差 **0.2747**（4.6 倍）；⑥ NAR 参数账 (65+1)×20 = **1,320**，100 样本 8 维恒等任务 MSE **0.0**（< 1e-6），同一输入两次前向逐位相同；⑦ 20 个地平线的相对误差曲线全为有限数，persistence 基线非零，交叉点 **F=8**（NAR 首次低于 AR 的 98%）；⑧ 18 项证据检查五组全绿（data 4 / ar 5 / nar 4 / timing 2 / curve 3）、18 条单测全绿。屏幕上必须出现：6,600、728、197、4,418、3,418/1,000、66,113、0.2303、66、1,320、1,300、1.1352、1.5647、1.2932、F=8、0.0762、0.3510、0.2747、15.71×、0.3682/0.0234、0.224299、0.0、18/18、121.90 s。

## Data

- data/episode/series_000001.csv：sz000001 后复权日线（close × adj_factor，过滤停牌），1998-11-25 → 2026-10-28，**6,600** 行；与 E59 同一份导出，本集测试段从第 4,949 行起。
- data/episode/segment_2020_2022.csv：高波动段切片，2020-01-02 → 2022-12-30，**728** 行，sha256 由 manifest 记录。
- 由 ts-admin inventory/scripts/export_ch07_decode.py 从 data/lake/bars_daily/year=*/part-000.parquet 导出（polars；只读湖仓；close × adj_factor；非停牌），manifest 记行数、区间、sha256。
- 切分：训练/验证只取 2020 之前的 4,949 点（可切 4,418 窗，验证取最后 1,000），测试段单独切 197 窗，段间不重叠；窗口内 z-score（均值 0 / 标准差 1），目标 = 第 f 天收盘相对窗口最后一点的变化 ÷ 窗口标准差。
- 编码器重训：512 → 64 → 512，20 epoch，最佳 epoch 20，val 0.230266；权重不跨集复用。

## Algorithms

- ch7-ar-decoding — 自回归 rollout（TsBase.Algos.Ch07.Autoregressive，**83 行**）：rollout 逐日回灌、pushWindow 窗口左移（丢最旧点、接新预测）、teacherForce 教师强制路径、rolloutMae / relMae 口径；硬断言：F ≥ 1、窗口长度与模型输入一致。
- ch7-nar-decoding — 非自回归一次输出（TsBase.Algos.Ch07.NonAutoregressive，**60 行**）：narDecode 一次前向出 F 维、augmentFeat 把最后一点 z 拼进特征（65 维输入）、narParamCount n d f = (n + 1 + 1) * f（64/1/20 → 1,320）、narTrain 逐地平线岭回归、narMae / relMae。
- 两个模块共 143 行、18 条单测（Autoregressive 9 / NonAutoregressive 9），唯一依赖 TsBase.Core.Rand；无 IO、无外部库，算法之间互不引用。
- 头部的设计决定：输入在 64 维表示后拼窗口最后一点 z（残差直连）。没有它，单步预测被表示损失支配，AR 连 persistence 都打不过（相对 6.98）；加上后两侧才在同一水平线上对拍。这一条写进实现页与偏差页。

## 讲稿与排版

- 8 场 30 页 **300** 行，每页 10 行整页；目标时长 16 min（300 × 3.2 s ≈ 960 s）。
- 场次：open 4 页（一步一步还是一口气）/ problem 4 页（误差怎么长、算力怎么花）/ definitions 4 页（回灌、教师强制、一次输出）/ metrics 4 页（相对误差与持久化基线）/ implementation 4 页（推进、闭式解、计时）/ verification 4 页（122 秒 18/18）/ boundary 3 页（两条曲线都没打赢基线）/ outro 3 页（从解码到分布）。
- 讲稿即字幕：所有数字读 data/dist.json（由 build/make_dist_data.py 从证据 JSON 生成），画面不硬编码。

## Delivery

- 成片：**1,310.27 s（21:50.27）/ 39,308 帧 / 8 场 30 页 / 300 条旁白 / 300 cue**；mp4 70,833,385 B（70.8 MB）/ sha256 `b57a01e…b611e`；cover.png 191,527 B / sha256 `3cf095c…08a1d`（frame 180 = 6.00 s）。
- 音量：mix peak −1.20 dBFS、RMS −26.66 dBFS、ducked 60.4%、preGain 1.0000、1,311.45 s；loudnorm I=−15 LUFS / TP=−2 dBFS；music gate stem full-band −25.1 dBFS、audible share 63.1%、sub 6.8%、PASS；mix gate speech −23.73 / gap_full −30.51 / gap_audible −33.24 / bed 36.8 dB、PASS。
- 字幕与章节：300 cue、00:00:01,200 → 00:21:48,050、**0 条换行**、最长 29 字符；章节合计 1,310.25 s，首 00:00:00、末 00:19:56，共 8 章。
- 闪烁：mean|d| **0.0150**、p99 0.1157、max 10.16、7 个切点；still_lint 4 帧 PASS；30 页静帧逐页人工看（返工 8 页版式）。
- 流水线：**23 stage 全 ok**；tree `88fafef16c80fa5f`；8 段全渲染、39,308 帧、复用 0；score 复用 `out/e04-score-loop-48k.wav`（1,560 s）。
- 复现三条（与成片屏幕上一致）：
  1. docker exec haskell-ts bash -lc 'export PATH=/opt/ghc/9.14.1/bin:$PATH; cd /work && cabal run tsbase -- evidence-ch07-decode --data data/episodes/60-ar-vs-nar-decoding --out out/evidence-60 --evidence inventory/evidence/60-ar-vs-nar-decoding.ch7-decode.json'
  2. docker exec haskell-ts bash -lc 'export PATH=/opt/ghc/9.14.1/bin:$PATH; cd /work && cabal test'
  3. cd /root/video-pipeline-blueprint && node scripts/make.mjs --film tsint-60-ar-vs-nar-decoding --score=out/e04-score-loop-48k.wav

## Deviations

- **D1（NAR 参数 1,300 → 1,320）**：计划按 (64+1)×20 写 1,300；实现把偏置并入最后一列，实算 (65+1+1)×20 = 1,320，多 20。屏幕用 1,320，1,300 以「计划书写的是」出现。
- **D2（主结论是负结果）**：两条曲线相对误差都大于 1，都打不过 persistence（0.224299）。计划的验收只要求曲线与 √F 对照，没要求赢；本集不硬凑，主论点改为「回灌会积累系统偏差，一次输出在原地更稳，但都没到能用」。
- **D3（√F 放大没有出现）**：书上说回灌误差按 √F 涨（F=20 时 4.47×），实测 AR/NAR 只差 21%，因为误差主要是系统性偏差而非独立噪声。边界页明写；SqrtAmplification 图上画的是「书上 4.47× vs 实测 1.38×/1.14×」。
- **D4（残差直连是本集最大设计决定）**：不加直连时 AR 相对 6.98（连 persistence 都打不过），加了之后才落在 1.1352 起。这不是调参，是问题定义的一部分，实现页与偏差页都写明。
- **D5（NAR 逐地平线选 λ）**：每个 F 单独在 1,000 个验证窗上选 λ（0.01/0.1/1/10/100/1000）；共用 λ 会让 F=1 被过度收缩，把 AR 的短期优势变成选参不对称的产物——已否决，口径写进证据。
- **D6（计时口径）**：三次重复取最小值（rotateBy 轮换工作集，避免全惰性共享 thunk）；重复运行间有 ±7% 抖动，本集统一用最终一次 **15.71×**（0.368249 / 0.023443 s）。
- **D7（检查分组按实现落盘）**：18 项分五组 data 4 / ar 5 / nar 4 / timing 2 / curve 3；讲稿逐条对齐这个分组，不按草稿估的 6/4/4/4 拆。
