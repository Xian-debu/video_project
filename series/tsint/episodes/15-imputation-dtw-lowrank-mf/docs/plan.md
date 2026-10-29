# 15-imputation-dtw-lowrank-mf - 缺失值三法：邻域、低秩、因子

> status: draft (scaffolded, not produced)
> chapter: ch02 | runtime target: 27 min | algorithms: 3

## Thesis

三者在解同一个矩阵补全问题，先验不同：DTW-KNN 相信「相似的序列在同一时刻有相似的值」（局部、非参数）；低秩填补相信「整张面板落在低维子空间里」（全局、凸松弛）；矩阵分解式(2.40) 把同一件事写成显式的两个因子 F、X̂（非凸、但可解释）。在 20% 随机缺失的面板上，低秩通常赢；换成整段停牌的块状缺失，低秩的前提（缺失随机）被破坏，它反而输给 KNN——把这两种缺失方式各跑一次，就是这一集最值钱的两分钟。

## Verification

看完这一集，观众应能回答「为什么低秩填补在停牌段会失效」。屏幕上必须出现：DTW([1,2,3],[1,3])=1、rank-3 矩阵 20% 缺失恢复误差 <1e-6、rank-2 矩阵 15% 缺失恢复误差 <1e-9、以及随机缺失 vs 块状缺失两栏的 RMSE 对比（后者必须显示出低秩的退化）。DTW 公式与 KNN 权重书中未给，画面需标注来自 [30]。

## Data

ts-admin 日线 100 只票×250 日（前复权收益，作为可补全面板）；合成：rank-3 40×30、rank-2 30×20（精确恢复测试）；两类缺失掩码（20% 随机 / 10 只整段停牌）。

## Algorithms

- ch2-dtw-knn - DTW 近邻填补 (TsBase.Algos.Ch02.DtwKnn)
- ch2-lowrank-imp - 低秩矩阵填补 (TsBase.Algos.Ch02.LowRank)
- ch2-matrix-factorization - 矩阵分解填补 (TsBase.Algos.Ch02.MatrixFactorization)
