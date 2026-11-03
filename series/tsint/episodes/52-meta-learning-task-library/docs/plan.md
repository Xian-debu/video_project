# 52-meta-learning-task-library — 把 300 只股票当成 300 个任务：元学习选模型

> status: ready (rendered 2026-11-03)
> chapter: ch06 | runtime target: 24 min (actual 20:06.4) | algorithms: 2 (MetaLearn, TS2Vec)

## Thesis

300 个任务（每只股票 = 一个任务）训出的元学习器，**没有一个数支持计划里的两个假设**。计划说 Hit@1 比「按类均值选模型」高 0.1 以上，实测 **0.2733 vs 0.3867（增益 −0.1133）**；计划说换 64 维 TS2Vec 表征提升不到 0.03，实测 **0.2667（差 −0.0067，持平略降）**。反过来，元学习器对「哪个候选更好」的**预测**极准：300 × 10 个分数与测试 MAE 的 Pearson **0.9983**，预测误差只差 **0.0042**。所以本集的主结论是**会打分，不等于会挑**：预测做对了，排序做错了；恒选 naive 的 Hit@1 是 **0.4333**，比元学习器与类均值都高。省下的算力换不到分辨率，因为候选之间的差距太小——平均后悔 **0.0263 MAE**，最坏 3.2029，218 个任务选错。

## Verification

看完能自己复现：

1. 黄金值：元学习器在 `[[0.1,0.2],[0.3,0.1],[0.2,0.25]]` 上的 argmin = `[0,1,0]`，恒选 0 的 Hit@1 = 0.6667；任务内中心化不改变 argmin；岭回归在 40 条合成样本上全部选对（Hit@1 = 1）。
2. 交叉验证：`taskFolds` 5 折不重叠且覆盖全部 300 个任务；任务级均值回落到 `mean(hit) = 0.2733`（五折 0.2 / 0.2333 / 0.4 / 0.25 / 0.2833）。
3. 数据范围：300 个任务 = 300 只 A 股，每只 1,535–2,431 根日线；三段切分 train `[809, 1705]` / valid `[466, 484]` / test `[232, 242]`；53 个行业全覆盖，csv 行数 = 各股根数之和，日期无重复。
4. 表征：TS2Vec 编码器输出 64 维、范数 1、同参数两次编码逐位相等（确定性），季节相关性 0.6194，四项检查全过——**但命中率没动**（0.2667 vs 统计特征 0.2733，差 −0.0067）。
5. 演示：300 个任务的 3,000 次拟合 + 300 次编码全流程 **31.0 s**；预测误差 3.5044 vs 真实 3.5002（差 0.0042）、相关 0.9983；30 只完全留出股票上元学习器命中 **8/30**、类均值 **12/30**（差 4 只）；平均后悔 0.0263 MAE、最坏 3.2029、218 个任务选错。
6. 候选分布：300 个任务里真值冠军次数 naive **130**、sar12 **59**、ar1 **48**、sar5 **27**、drift30 **19**、ridge5-l1 **11**、ridge5-l1e-3 **6**，exp0.2 / exp0.5 / hmean5 各 **0**；元学习器选中次数 naive **173**、ridge5-l1 **35**、drift30 **31**、sar5 **30**、ar1 **28**、ridge5-l1e-3 **28**。
7. 读数一致性：`dist.json` 由 ts-admin 导出脚本 + 证据 summary 重算，任何改动都会打印 `EVIDENCE MISMATCH` 并退出 1；29 项检查全绿。

## Data

ts-admin 的 `inventory/scripts/export_ch06_meta.py`（1318010）从 Lake 取 HS300 快照 300 只、2010-01-01..2024-12-31 日线（后复权收盘），**不做行业分层**；每只保留自家最长连续段（`MAX_GAP_DAYS=20`），要求至少 1,500 根日线。切分：train < 2022-01-01、valid 2022–2023、test ≥ 2024-01-01；每只股票在自己的日线上做 10 个候选的拟合，验证集 MAE 是标签，预测目标是测试集 MAE。

本集数据（/root/ts-base/data/episodes/52-meta-learning-task-library/，commit 77f9362）：`daily300.csv` 18,777,048 B、300 只、1,535–2,431 根；`classes.csv` 11,966 B（53 个行业 + unknown 3 只）；`manifest.json` 只保留计数与校验，**不存每股序列**（374 MB → 633,177 B）。股票池 5,413 只有日线、2,911 只满足最低根数，取 HS300 快照内的全部 300 只；seed 20261103。

元特征 4 维：均值、标准差、偏度、一阶自相关系数。候选 10 个：naive、drift30、exp0.2、exp0.5、ar1、ridge5-l1e-3、ridge5-l1、sar12、sar5、hmean5。

## Algorithms

- TsBase.Algos.Ch06.MetaLearn（16d4ecd）：`MetaFeatures`（4 维）、`metaRow`、`olsRidge`（λ 正则、多输出、单遍 `foldl'` 累积 XᵀX / XᵀY）、`metaLearn`、`taskFolds`（5 折任务级切分）、`classMean`（按行业回落到全局均值）、`regretOf`。默认 λ = 1e-3。
- TsBase.Algos.Ch06.Ts2Vec（b0d09a0）：`Ts2VecEnc`（空洞卷积层级编码器）、闭式自监督目标（同序列两视图的对比项直接解出线性头）、`encode`（输出 64 维、L2 归一）、`cosPeriod`（季节相关性）。
- 证据程序 `app/Ch06MetaEvidence.hs`：29 项检查（data 4 / meta 6 / cv 6 / ts2vec 4 / demo 9），跑完 **29/29 in 30.9 s**；同一份代码里 `olsRidge` 从 O(p²n²) 的列表索引改成单遍累积后，全流程从 13 分钟以上降到 31 s。
- 黄金用例 12 条：MetaLearn 6（黄金 argmin、中心化不变、合成 40 条全对、5 折覆盖、类均值回落、后悔公式）+ Ts2Vec 6（形状、范数、确定性、季节相关、两视图一致性、维度）。`cabal test` 全绿：`algos.ch06.metalearn 6/6`、`algos.ch06.ts2vec 6/6`，全仓 150 套 / 2,111 断言。

## Boundary

1. 样本只有 300 个任务、10 个候选：命中率分辨率 1/300，候选胜场分布严重偏斜（naive 130、两个指数模型 0）。
2. 单市场、单快照：HS300 只有 2026-10-30 一期成分，2024-12-31 之后的样本没有；没有跨市场验证。
3. 标签噪声：真值是「测试集 MAE 的 argmin」，测试段只有 232–242 根日线，冠军与亚军的差距常在 0.01 量级，本身就不稳定。
4. 4 维元特征太薄、64 维表征没接上任务语义：TS2Vec 是闭式自监督的轻量版本，不是原论文的完整训练流程。
5. 命中率与后悔值量的是两件事：命中率是选拔赛，后悔值是账本；本集的账本很小（0.0263 MAE），所以「选错」的代价远小于「贵」。

## Deviations

- D1（计划 vs 实测，主结论）：「元学习 Hit@1 比类均值高 0.1 以上」**未成立**，实测增益 −0.1133（0.2733 vs 0.3867）；画面与文档照实报，未换数据、未改口径。
- D2（计划 vs 实测）：「64 维 TS2Vec 表征提升不到 0.03」**方向未成立**：差 −0.0067，看似在带内，实际是持平略降（0.2667 vs 0.2733）；按「没有提升」写，不按「小幅提升」写。
- D3（性能）：`olsRidge` 原实现用 `xrows !! k !! i` 做 p²n² 次列表索引，3,000 次拟合跑不完（首跑 13 分钟无输出）；改成单遍 `foldl'` 累积后全流程 31 s。读数不变，只改实现。
- D4（数据规模）：计划写「TS2Vec 预训练缩到 2,000 条窗口」；实际用 300 只股票的同一批 1,535–2,431 根日线做闭式自监督，没有单独下采样，理由写在 Data 段。
- D5（清单瘦身）：manifest 原先把每股序列也写进去，374 MB 无法入库；改成只留计数 + 校验和（633,177 B），`daily300.csv` 与 manifest 的 sha 一致。

## Delivery

## Delivery

- 成片 `delivery/Tsint52MetaLearningTaskLibrary.mp4`：**1,206.37 s（20:06.4）/ 36,191 帧 / 57,931,900 B**，h264 + aac，8 场 36 页；ffprobe 容器时长 1,206.400 s。
- 音量：loudnorm **dynamic**，in I −23.3 / TP −1.4 / LRA 3.5 → **out I −15.8 LUFS / TP −2.0 dBFS / LRA 2.3**（target offset +0.8）；mix 48 kHz / 1,207.56 s，peak −1.16 dBFS、RMS −26.81 dBFS，ducked 53.9%、musicGain −4.5 dB（分数床复用 E04 的 1,560 s 循环），淡入 1.5 s / 淡出 2.5 s。
- 字幕与章节：**360 cue / 8 章**，跨度 00:00:01,200 → 00:20:04,170，说话 1,115.9 s；`0 of 360 cues wrapped to 2 lines, longest line 25`（上限 34 字/行）；章首 00:00:00 / 末章 00:18:01，8 章合计 1,206.36 s。
- 闪烁门：36,191 帧 mean 20.58 / min 14.65 / max 24.43，mean|d| 0.0136、p99 0.1047、max 8.96（阈值 12.0），7 个硬切点（5,185 / 9,233 / 14,171 / 19,208 / 23,160 / 28,342 / 32,448）。
- 静帧复核：make 抽 3 帧（14,400 / 26,760 / 29,850）全部过 `still_lint`：`PASS — 3 frames, no off-frame box, no edge text, no spill, no text overlap`；另在写作期人工看过 metrics、verification、boundary 三页成图。
- 复现：`node scripts/make.mjs --film tsint-52-meta-learning-task-library --score=out/e04-score-loop-48k.wav --still-frames=14400,26760,29850`（23 stage 全 ok、8 段 rendered 8 / reused 0、tree `0f6b1fd7dc97f8a2`）；证据 `tsbase evidence-ch06-meta --data /work/data/episodes/52-meta-learning-task-library --out <同> --evidence /work/inventory/evidence/52-meta-learning-task-library.ch6-meta.json`（29/29、30.9 s）。
- 封面：`publish --cover-frame=180`（6.00 s），cover.png 188,146 B；film.json `publish.coverFrame = 180`（本集沿用 make 默认帧，不另设 20）。
