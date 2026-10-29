# 38-ad-graph-contrastive - 图上的异常：增强、对比损失与 TopK 邻接

> status: draft (scaffolded, not produced)
> chapter: ch04 | runtime target: 28 min | algorithms: 3

## Thesis

单只股票上看不出来的异常，在行业图上会显形：GNN 的 TopK 邻接学到的『谁跟谁一起动』若与行业子类重合，跨股票传导型异常的检出率会显著高于任何无图模型。

## Verification

屏幕必须出现：①学到的 TopK 邻接矩阵（与行业子类先验的重合率一个数）②余弦黄金值 ±1 ③有图/无图对传导型异常的检出率两个数 ④余弦分母笔误的现场对照（错版相似度恒为 1）

## Data

ts-admin：某一级行业 12 只股票日线 2015–2026（N=12 通道），C=100；注入①（单只股票 k∈[5,10]σ）与『传导型异常』（同子类 3 只股票同时注入 ±kσ，构造书中未给、本仓自定）；行业子类（白酒/啤酒/其他）作为先验图，用 TopK 重合率评估图学习是否有效。评分口径：点调整（主）+ 范围调整（副）。

## Algorithms

- ch4-aug - 时序增强算子族 (TsBase.Algos.Ch04.Augment)
- ch4-infonce - InfoNCE 对比损失 (TsBase.Algos.Ch04.InfoNCE)
- ch4-gnn - 空域 GNN + TopK 图学习 (TsBase.Algos.Ch04.GNN)
