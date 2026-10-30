# 65-error-metrics-trio - 误差三件套：同一组预测，MSE 涨 4 倍而 MAE 一动不动

> status: ready (delivery built 2026-10-30; 756.57 s, -15 LUFS, TP -2 dBFS)
> chapter: ch08 | runtime target: 13 min | algorithms: 3

## Thesis

同一组误差 [1,1,1,1] 换成 [4,0,0,0]，绝对误差和不变，MAE 仍是 1；平方和从 4 变成 16，MSE 从 1 涨到 4，RMSE 从 1 涨到 2。指标不是裁判，是权重：平方罚把大错按面积放大，绝对罚给每个错同样权重，百分比罚把不同价格拉到比例上，MASE 再用训练段的季节朴素误差做分母，才敢跨序列比。

## 核心判断

- MSE/RMSE/MAE 的差别不在公式长短，在「一个 4 倍误差值多少」；不比较模型，只比较罚法。
- MAE 与 MAPE 的排名分歧在 20 只 A 股上是真实存在的：长江电力 MAE 第 6、MAPE 第 1；贵州茅台 MAE 第 20、MAPE 第 4。
- MAPE 在收益率序列上会失效：茅台 483 个点里 265 个负收益、2 个零，严格版报错，跳过 267 个点后 sMAPE 仍在 147% 量级；2086% 的 MAPE 不能当精度宣传。
- MASE 的分母只取训练段（2020–2023）的季节差分，测试段（2024–2025）不参与；分母为零返回 +Infinity，不返回 0 或 NaN。
- 本集没有拟合模型，也没有性能数字；20 只股票是样本，不是市场结论。证据等级 C，不抬成 A。

## Verification

屏幕上必须出现、且能逐项回到同一次运行的数：

1. 最小反例：A 组 [1,1,1,1] → MSE 1 / RMSE 1 / MAE 1；B 组 [4,0,0,0] → MSE 4 / RMSE 2 / MAE 1。
2. 20 只 A 股 naive-1：工商银行 MAE 第 1、MAPE 第 2；中国石化 MAE 第 2、MAPE 第 8；长江电力 MAE 第 6、MAPE 第 1；贵州茅台 MAE 第 20、MAPE 第 4。
3. MASE(5)：中位数 0.7917935414，14/20 只小于 1；最小中国中免 0.2816123988，最大工商银行 2.2752776085。
4. 收益率：5 只、每只 483 点；茅台负 265、零 2、无效 267、有效 216，MAPE 2086.4852997991775%、sMAPE 147.39372425170254%；宁德时代/中国平安/万科A/中信证券 sMAPE 分别 144.22% / 154.20% / 145.82% / 148.91%。
5. 测试：37 条全过（ErrorMetrics 13、PercentageErrors 14、Mase 10），GHC 9.14.1 / cabal 3.16.1.0。

看完能回答：平方罚与绝对罚差在哪；为什么 MAE 小不代表 MAPE 小；MAPE 什么时候不能算；MASE 的分母为什么只能取训练段。

## Data

- ts-base data/episodes/65-error-metrics-trio/closes_2020_2025.csv：20 只 A 股、2020-01-01..2025-12-31、剔除停牌，28,949 行 / 2,211,992 字节，sha256 71b29bef4eae169fad5603342e03e8cf5bcbc496e0a766ddf1a683bae6bd5ae6。
- ts-base data/episodes/65-error-metrics-trio/summary.json：每只股票的 MAE/RMSE/MAPE/MASE 与排名、MASE 汇总、5 只收益率失效计数（7.6 KB）。
- ts-base inventory/evidence/ch8-error-metrics.json：数据来源、命令、tsBaseCommit 3442ee14a69994ecbdc002bd242357d3cdb5bb3f、37 条测试与 checks。
- data/metrics.json：由 build/generate_metrics_data.py 读上述两份 JSON，断言 20 只、示例 A/B、belowOne=14、四个排名可重算、长江电力(6,1)、茅台(20,4)、收益率 483 点与 skipped 计数后写出（7,092 bytes）。
- 书页：p.205，式 8.1–8.6；p.205 一句可引原文“预测任务指标用于衡量模型对未来数值的预测精度，如 MAE、RMSE、MAPE 和 MASE 等。”

## Algorithms

- ch8-mse-rmse-mae → TsBase.Algos.Ch08.ErrorMetrics：mse / rmse / mae，Kahan 求和，长度不等/空/NaN/Inf 报错。
- ch8-mape-mpe → TsBase.Algos.Ch08.PercentageErrors：mpe / smape / mape / mapeSkipping，Y≤0 严格报错，跳过版返回计数。
- ch8-mase → TsBase.Algos.Ch08.Mase：mase s train actual forecast / seasonalScale，分母只读训练段，分母 0 返回 +Infinity。

## 场景（8 场）

1. **open · 同一组预测，两种罚法** — p.205 短摘录；A/B 四误差柱与 MAE/MSE；三件事：平方罚与绝对罚、跨序列比较、可测试的实现；右下角 C 级证据卡。
2. **problem · MAE 稳，MSE 狠** — 最小反例 A/B；两把尺名次表（工商银行、长江电力、贵州茅台、中国石化）；结论「同一组预测，两把尺，两个冠军」。
3. **definitions · 误差的三种罚法** — 三张卡：式 8.1/8.5/8.6（MSE/RMSE/MAE）、式 8.3/8.4 与 MAPE 同形、式 8.2（MASE）；符号与「书里 M-S，本集小写 s」的约定。
4. **intuition · 点不沿斜线排** — 20 只股票散点：横轴 log10(MAE)、纵轴 MAPE%；标注长江电力、贵州茅台、工商银行、中国中免；右侧 MASE 14/20<1 与 min/median/max。
5. **implementation · 先把边界写成断言** — 三个模块的代码卡：入口检查、Kahan、严格/跳过 MAPE、MASE 分母与 +Infinity；37 条断言。
6. **verification · 每个数都能回到一次运行** — 四组统计卡（20 只 / 37 条 / 28,949 行 / 483 点）；MASE 20 只全表；收益率 5 只 skipped 与 sMAPE 表；声明没有拟合结果。
7. **boundary · 七个边界，一把尺子** — 证据等级、样本、基准、数据泄漏、零与负、实现、等级。
8. **outro · 先问误差怎么罚。** — 指标/边界/证据三张回执；九章地图 1/15/13/12/8/7/8/5/5 集；下一集 E66 99:1 与 AUC。

## Claims

| 陈述 | 等级 | 依据 |
| --- | --- | --- |
| MSE/RMSE/MAE 的定义与式号 | B | 书中 p.205，式 8.1/8.5/8.6 |
| MPE/sMAPE/MASE 的定义与式号 | B | 书中 p.205，式 8.3/8.4/8.2 |
| [1,1,1,1]→[4,0,0,0] 时 MSE 1→4、MAE 1→1 | A | Haskell 模块 + 13 条 ErrorMetrics 测试 + summary.json |
| 20 只 A 股的 MAE/MAPE 排名与分歧 | A | closes_2020_2025.csv + summary.json + metrics.json 断言 |
| MASE(5) 中位数 0.7918、14/20<1 | A | summary.json + Mase 的 10 条测试 |
| 茅台收益率 265 负 / 2 零 / 跳过 267 | A | summary.json 的 returns 段 + metrics.json 断言 |
| MAPE 在 Y≤0 时失效 | B | 定义本身；以 A 级数据演示 |
| 「指标是权重，不是裁判」 | 本集判断 | 基于公式与排名的编辑归纳，不冒充原文 |

## Evidence

- 生成器：build/generate_metrics_data.py（读 ts-base summary/evidence，断言后写 data/metrics.json）
- 数据：ts-admin inventory/scripts/export_ch08_metrics.py → ts-base data/episodes/65-error-metrics-trio/closes_2020_2025.csv
- 证据 JSON：ts-base summary.json 与 inventory/evidence/ch8-error-metrics.json
- 测试：cabal test 37 条全过（13 + 14 + 10）

## Delivery（2026-10-30）

- 成片：delivery/Tsint65ErrorMetricsTrio.mp4，756.57 s（22,697 帧 @30fps），H.264 + AAC；响度 I=-15 LUFS，TP=-2 dBFS。
- 旁白：193 条，实测 560.0 s 语音，assets/audio/narration.wav 756.55 s（0 overrun）；TTS zh-CN-YunyangNeural。
- 配乐：复用第 01 集 score.wav 822 s（seed=11 / energy=0.8 / bpm=84 / minor），混音 bed 增益 -4.5 dB，music gate 全过（speech -24.4、bed vs speech -8.5、full -30.12）。
- 交付件：tsint-65.srt（193 cues，最长行 27 字符）、tsint-65.chapters.txt（8 章）、tsint-65.chapters.ffmeta.txt、cover.png（第 1937 帧）。
- QA：still lint 4 帧 PASS（48/48/33/108 boxes）、luma flicker PASS（7 个切点，max 10.59）、loudnorm PASS。
