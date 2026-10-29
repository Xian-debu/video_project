# 66-anomaly-metrics-auc - 不平衡数据上的三门考卷：Acc 0.99 的模型其实什么都没学到

> status: draft (scaffolded, not produced)
> chapter: ch08 | runtime target: 20 min | algorithms: 3

## Thesis

在 99:1 的不平衡数据上，全判正常的分类器能拿到 Acc=0.99，而 ROC-AUC 恰为 0.5、AP 只有 0.01（等于正类率）——三个指标对同一模型给出「满分、随机、废」三种结论。

## Verification

屏幕上必须出现：(1) 99:1 数据上 Acc=0.99 / AUC=0.5 / AP=0.01 三个数；(2) 手算 AUC=0.75 的秩公式逐项展开；(3) AP 阶梯与梯形积分差值（≥1 个百分点的具体数）。看完能自己实现四指标与两条 AUC 曲线。

## Data

ts-admin 日线：以 5 日未来跌幅 >5% 为标签（正类率约 3–5%）；合成一份精确 99:1 的数据用于演示 Acc 失效

## Algorithms

- ch8-confusion-metrics - 混淆矩阵指标组（P/R/Acc/F-beta） (TsBase.Algos.Ch08.ConfusionMetrics)
- ch8-roc-auc - ROC 曲线下面积（ROC-AUC） (TsBase.Algos.Ch08.RocAuc)
- ch8-pr-auc-ap - PR 曲线下面积与 AP (TsBase.Algos.Ch08.PrAuc)
