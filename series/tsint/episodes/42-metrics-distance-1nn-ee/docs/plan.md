# 42-metrics-distance-1nn-ee - 距离决定一切：从 1-NN+DTW 到弹性集成

> status: draft (scaffolded, not produced)
> chapter: ch05 | runtime target: 22 min | algorithms: 3

## Thesis

在 A 股 60 日收益窗上，把欧氏 1-NN 换成 DTW 1-NN 的准确率提升不足 2 个百分点——「DTW 显著更好」在本数据上大概率不成立，而这正是 11 个弹性距离还要加权集成的原因。

## Verification

看完能自己跑出：① 一张 3 分类器 × 20 股票的排名表；② Nemenyi CD 图（含 CD≈1.16 的显著性连线）；③ DTW 与欧氏的准确率差 <2 个百分点的实测数字；④ EE(4 距离) 的 CV 权重条形图。屏幕上必须出现：0.8333（macro-F1 黄金值）、CD 数值、两组准确率差、4 个权重值。

## Data

ts-admin 日线表：股票代码、交易日、close；取沪深 300 成分股中的银行/半导体/医药三个行业各 30 只，2015-2025，按 60 个交易日窗口取对数收益，标签=行业名。合成对照集：3 类 motif（sin 周期 8/12/20 + 相位随机 + 高斯噪声 0.1），每类 50 条，用于验证 DTW 抗错位。

## Algorithms

- ch5-metrics - 分类评估与 Nemenyi CD 图 (TsBase.Algos.Ch05.Metrics)
- ch5-dtw - DTW 距离与 1-NN 分类器 (TsBase.Algos.Ch05.Dtw)
- ch5-ee - 弹性集成（11 弹性距离加权 1-NN） (TsBase.Algos.Ch05.ElasticEnsemble)
