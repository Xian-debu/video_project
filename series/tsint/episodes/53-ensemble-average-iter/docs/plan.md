# 53-ensemble-average-iter - 集成：平均就能赢，但别乱调权

> status: draft (scaffolded, not produced)
> chapter: ch06 | runtime target: 22 min | algorithms: 3

## Thesis

在 20 只股票 × 10 个候选中，等权平均的 MAE 比池内最优单模型低 3%-8%；而按残差贡献迭代调权若不加收缩，验证集 MAE 反而比等权平均更差——「自动调权」在样本不足时会自伤。

## Verification

看完能自己复现：① 式(6.5) 的黄金值 1.7；② 等权平均 vs 最优单模型的 MAE 差（3%-8% 区间）；③ η=0.1 与 η=0.5 的轮数-MAE 曲线对比（后者应出现更差区）；④ σ=0 时噪声集成的退化断言。屏幕上必须出现：1.7、MAE 差百分比、η=0.5 的劣化幅度、σ=0 一致性。

## Data

ts-admin：同 F1 的 20 只股票、10 个候选（5 模型×2 档）；F1 的全池遍历结果作为单模型最优参考；验证集固定为每只股票后 30% 时间；噪声集成用 ARIMA 基础模型，σ=0.05。

## Algorithms

- ch6-ensemble-avg - 加权平均 / 中位数集成（权重为 0 即选择） (TsBase.Algos.Ch06.Ensemble)
- ch6-noise-aug-ens - 噪声增强式集成（多噪声变体各训一模型） (TsBase.Algos.Ch06.NoiseAugEnsemble)
- ch6-ensemble-iter - 残差贡献迭代调权 / 剔除 (TsBase.Algos.Ch06.IterEnsemble)
