# 32-ad-classic-unsupervised - 三种几何直觉：距离、密度、随机分割

> status: draft (scaffolded, not produced)
> chapter: ch04 | runtime target: 20 min | algorithms: 3

## Thesis

同一份嵌入上 k-means、LOF、隔离森林给出三种不同的假阳性——没有最准的无监督，只有与异常形状最匹配的那个；把形态替换型异常（注入③）喂给 LOF，F1 会掉到 0.2 以下。

## Verification

同一份 192 维嵌入上三条 PR 曲线 + 三个 F1；必须出现两个可复现结论数字：k-means 对注入①的 F1、LOF 对注入③的 F1（应 <0.2）

## Data

ts-admin：同板块 8 只股票（如白酒：600519/000858/000568/600809/603369/000596/600779/603198）日线 2015-01-01 至 2026-06-30，C=24 窗口 → 192 维嵌入，样本 ≈8×2,700；注入①（每只 10 段）与注入③（每只 10 段，从另一只股票截 20–60 长形态替换）。评分口径同 L0，注入率 1%。

## Algorithms

- ch4-kmeans - k-means 聚类检测 (TsBase.Algos.Ch04.KMeans)
- ch4-lof - LOF 局部离群因子 (TsBase.Algos.Ch04.Lof)
- ch4-iforest - 隔离森林 (TsBase.Algos.Ch04.IForest)
