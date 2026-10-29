# 55-generalizable-search - 省算力的三种剪枝：子空间、比较器与组合预测器

> status: draft (scaffolded, not produced)
> chapter: ch06 | runtime target: 24 min | algorithms: 3

## Thesis

在合成的 10^6 架构空间上，三种省算力策略各用 1% 预算就能找到真实 top-1% 架构；但换到真实 A 股代理任务后，cherry region 的优势消失——正如书中 p.167 承认的：最优子空间不能跨数据集迁移。

## Verification

看完能自己复现：① 合成曲面上 cherry region 的收缩轨迹与最优值差（<0.01）；② 完美比较器排序 [1,3,2,4]；③ 剪枝保留集合 {5,6,7,8}；④ 同架构参数继承的逐元素相等断言；⑤ 真实 A 股代理任务上 cherry region 优势消失的对照数字。屏幕上必须出现：0.01、[1,3,2,4]、{5,6,7,8}、继承一致性、真实任务上的两组差值。

## Data

合成主数据：① 二维/四维性能曲面 f=−Σ(x_i−c_i)²（最优点已知）；② 10^6 架构空间用确定性哈希映射到性能值（可精确复现 top-1%）。ts-admin 对照：30 只股票的单步预测代理任务，架构=3 种 block 组合 × 2 种算子，共 12 个架构，用验证 MSE 作为真实性能（规模缩小，只做趋势对照）。

## Algorithms

- ch6-cherry-region - Cherry Region 子空间收缩 + 随机搜索 (TsBase.Algos.Ch06.CherryRegion)
- ch6-random-cmp - 随机搜索 + 成对比较器（快速排序式筛选） (TsBase.Algos.Ch06.RandomCmp)
- ch6-comb-predictor - FACTS：comb predictor 剪枝 + TAP 排序 + 参数继承 (TsBase.Algos.Ch06.CombPredictor)
