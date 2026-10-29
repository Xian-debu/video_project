# 54-darts-differentiable-search - 把架构搜索变成可微：DARTS 与三层搜索空间

> status: draft (scaffolded, not produced)
> chapter: ch06 | runtime target: 26 min | algorithms: 2

## Thesis

在 3 算子 × 8 边 × 2 block 的玩具空间（48 个架构，约为原 AutoCTS 空间的 1/20000）上，DARTS 的 α 在 20 个外层步内会塌缩到单一算子；把训练/验证切分错开（一阶近似）后，才能保住 top-2 路径。

## Verification

看完能自己复现：① 式(6.11) 的两个黄金值（0.5x 与 one-hot 极限）；② α 的 20 步轨迹图；③ 48 个架构的缩放计算（10×4×10 vs 3×8×2）；④ 三层权重的组合断言（1.2 与 3.0）。屏幕上必须出现：0.5x、4.54e-5/0.99995、48、1.2、3.0。

## Data

ts-admin：沪深 300 中 30 只股票的日线，构 30 节点相关性图（阈值 0.5）；H=24 历史、F=1 预测；任务=单步收益预测（作为搜索的代理任务，不追求精度）。缩放声明：原 AutoCTS 空间 ~10^6+ 架构，本机 3 算子×8 边×2 block=48 架构，约 1/20000；隐藏表达式 4→2；算子 10→3。

## Algorithms

- ch6-darts - 可微架构搜索 DARTS（softmax 混合算子 + 双层优化） (TsBase.Algos.Ch06.Darts)
- ch6-stg-block - ST-block 与三层搜索空间（算子/微观/宏观） (TsBase.Algos.Ch06.StgBlock)
