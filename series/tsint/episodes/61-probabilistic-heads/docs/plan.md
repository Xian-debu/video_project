# 61-probabilistic-heads - 不止一个数：分位损失、分位线交叉与分布头

> status: draft (scaffolded, not produced)
> chapter: ch07 | runtime target: 18 min | algorithms: 3

## Thesis

三个分位数独立训练的预测会出现交叉（本集实测交叉率 3–5%）；把 τ 维度排序后交叉率归零而 pinball 损失几乎不变——这说明「分位线必须单调」是一条可以零成本加上的结构约束。

## Verification

屏幕上必须出现：(1) 四个 pinball 黄金值（0.9/0.1/0.1/0.9）；(2) 交叉率修正前后的实测数（3–5%→0）；(3) 高斯 NLL=0.9189 的手算对照。看完能自己实现三条概率预测路线。

## Data

ts-admin 日线收益率（厚尾）；区间覆盖率用测试段 500 天

## Algorithms

- ch7-pinball - 分位数回归（Pinball / Quantile Loss） (TsBase.Algos.Ch07.Pinball)
- ch7-quantile-rearrange - 分位线交叉修正（Quantile Rearrangement） (TsBase.Algos.Ch07.QuantileRearrange)
- ch7-dist-head - 预设分布头（Parametric Distribution Head） (TsBase.Algos.Ch07.DistHead)
