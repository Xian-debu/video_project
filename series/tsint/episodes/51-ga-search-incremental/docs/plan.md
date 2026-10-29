# 51-ga-search-incremental - 省算力的两把刀：遗传算法与学习曲线外推

> status: draft (scaffolded, not produced)
> chapter: ch06 | runtime target: 18 min | algorithms: 2

## Thesis

在 20 只股票、10 个候选上，增量外推只用 40% 的训练量就复现了全量遍历的 Top-2 集合（Accuracy@2 ≥ 0.8）；同样预算下遗传算法并没有更好——它的优势只在超参空间大到搜不完时才出现。

## Verification

看完能自己复现：① 学习曲线外推的黄金值 (0.6)；② GA 固定 seed 的逐代 best 序列；③ 40% 预算下 Accuracy@2 的实测值（目标 ≥0.8）；④ GA(200 次训练) 与网格(648 次) 的精度/预算对比表。屏幕上必须出现：0.6、200 vs 648、Accuracy@2 数值、代际 best 曲线。

## Data

ts-admin：同 F1 的 20 只股票、10 个候选；F1 的全池遍历结果作为 ground truth；预算口径 = 训练次数（GA 200 次 vs 网格 648 次 vs 增量 4 阶段×10 候选=40 次全量等价）。

## Algorithms

- ch6-ga-search - 遗传算法搜索（染色体=特征+模型+超参） (TsBase.Algos.Ch06.GaSearch)
- ch6-incremental - 增量训练 + 学习曲线线性外推（AutoAI-TS 式） (TsBase.Algos.Ch06.IncrementalSearch)
