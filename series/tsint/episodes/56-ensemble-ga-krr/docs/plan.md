# 56-ensemble-ga-krr - 先筛模型再调权：遗传算法筛选 + 核岭回归融合

> status: draft (scaffolded, not produced)
> chapter: ch06 | runtime target: 22 min | algorithms: 1

## Thesis

先用遗传算法按「偏差+方差」双目标筛掉一半候选模型、再用核岭回归（KR）拟合融合权重，验证集 MAE 比等权平均低 2%-6%；但若 GA 只看精度不看方差，筛出的模型高度同质，融合的额外收益趋近于 0。

## Verification

看完能自己复现：① KR 黄金值 0.875，以及 λ=0 精确插值、λ→∞ 收缩到 0 两个极限；② Pareto 前沿的三个点与一个被支配点；③ GA 筛选前后模型子集大小（10→5）；④ 真实数据上 KR 融合 vs 等权平均的 MAE 差（目标 2%-6%）。屏幕上必须出现：0.875、三个 Pareto 点、(1.1,0.1) 被支配、10→5、两组 MAE。

## Data

ts-admin：20 只股票 × 10 个候选（5 模型×2 超参档，与 F1/F4 同一批预测缓存）；GA 个体=10 位 0/1 子集，适应度=(折外偏差, 折外方差)，Pareto 前沿上每个点再用 KR 的 5 折 CV 分数择优；KR 输入=各候选在验证段上的 10 维预测向量。

## Algorithms

- ch6-ensemble-ga - 遗传算法筛选 + 核岭回归集成权重 (TsBase.Algos.Ch06.GaEnsemble)
