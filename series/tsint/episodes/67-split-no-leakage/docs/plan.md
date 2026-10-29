# 67-split-no-leakage - 切数据的三条规矩：一次 shuffle 就让你的 MSE 好一个数量级

> status: draft (scaffolded, not produced)
> chapter: ch08 | runtime target: 22 min | algorithms: 3

## Thesis

对时间序列做一次随机 shuffle 再按 7:1:2 划分，同一只股票的未来会进入训练集；用「训练段最大索引 < 验证段最小索引」这一条断言就能检测出泄漏，而泄漏后的 MSE 会凭空低一个数量级。

## Verification

屏幕上必须出现：(1) n=10 → 7/1/2 的具体索引；(2) n=100、f=5、n_init=60、s=5 → 8 轮；(3) shuffle 后的泄漏计数 >0 与时间切分的泄漏计数 =0 的对照。看完能自己写划分函数并证明它不泄漏。

## Data

ts-admin 日线：000001.SZ 2015-2025 共约 2600 交易日；再取 20 只股票做面板泄漏演示

## Algorithms

- ch8-temporal-split - 时间序三集划分（Chronological Split） (TsBase.Algos.Ch08.TemporalSplit)
- ch8-fixed-forecast - 固定预测协议（Fixed Forecasting） (TsBase.Algos.Ch08.FixedForecast)
- ch8-rolling-forecast - 滚动预测协议（Rolling Forecasting） (TsBase.Algos.Ch08.RollingForecast)
