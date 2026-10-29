# 30-ad-foundation-window-score - 地基：窗口·指标·评分——异常检测里 80% 的差别不在模型

> status: draft (scaffolded, not produced)
> chapter: ch04 | runtime target: 20 min | algorithms: 3

## Thesis

同一组模型输出喂给三种评分口径（式4.10 重构-MSE / 式4.11 MAE / 式4.14 预测），F1 的排序会翻转——所以先钉死口径，再谈模型。

## Verification

看完能从 CSV 走到 F1。屏幕必须出现：①窗口数 1349（T=1448,C=100,s=1 手算对照）②完美重构 Score=0.0 且 F1=1.0 ③注入率 1% 下 P/R/F1 三个数，点调整与范围调整各一行（两者差值是本集的钩子）

## Data

ts-admin：600519.SH 日线 2001-08-27 起至 2026-06-30（trade_date, close, volume），T≈5,900；z-score 归一（非书中）。GT=注入①：x_t←x_t·(1+δ) 或 x_t±k·σ_rolling，k∈[5,10]，单点或 1–3 连点，注入率 1%，随机种子 42（注入规则自定，书中 p.79 只支持『注入用于增广』）。评分口径双报：点调整=注入段内命中任一点即整段记 TP；范围调整=注入区间与预测区间 IoU≥0.2 记对并按重叠比例给 α 权重（Tatbul 2018 口径，非书中）。

## Algorithms

- ch4-window - 滑窗与标签构造 (TsBase.Algos.Ch04.Window)
- ch4-metrics - 检测评估指标 (TsBase.Algos.Ch04.Metrics)
- ch4-score - 重构/预测异常评分 (TsBase.Algos.Ch04.Score)
