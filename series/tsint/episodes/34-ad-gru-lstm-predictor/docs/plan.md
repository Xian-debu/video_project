# 34-ad-gru-lstm-predictor - 预测未来，误差就是分数：GRU 单元与 LSTM 预测器

> status: draft (scaffolded, not produced)
> chapter: ch04 | runtime target: 24 min | algorithms: 2

## Thesis

预测式检测的分数不是重构误差而是未来 F 步的误差：F 从 1 加到 5，点异常的 F1 会掉——式(4.14) 的 1/F 把单点尖峰稀释了 5 倍。

## Verification

屏幕必须出现：①F=1 vs F=5 的 F1 两个数（且 F=5 更低）②一步预测的 MAE/σ 比值 ③200 步隐藏状态的二维轨迹图

## Data

ts-admin：600519.SH 日线 2010–2026（train/test 同前），C=100、F∈{1,5}；注入①与④（把 5 日/20 日周期相位整体平移半周期）。评分口径：点调整（主）+ 范围调整（副）；另外单独报告『单点注入在 F=5 下的检出率』以支撑集标题。

## Algorithms

- ch4-gru-cell - GRU 单元 (TsBase.Algos.Ch04.GRU)
- ch4-lstm-pred - LSTM 预测式检测 (TsBase.Algos.Ch04.LSTMPred)
