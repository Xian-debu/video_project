# 47-gcn-gat-attention - 谁在影响谁：图卷积、图注意力与自注意力

> status: draft (scaffolded, not produced)
> chapter: ch05 | runtime target: 24 min | algorithms: 3

## Thesis

用 30 只同行业股票建相关性图，GCN 的收益来自图结构先验而非参数量：把邻接矩阵随机打乱后，准确率回落到与无图 MLP 持平——这就是可验证的「图确实有用」。

## Verification

看完能自己复现：① GCN 的置换等变断言；② GAT 的 α 行和为 1 与注意力热图；③ 自注意力的 softmax 缩放前后分布对比；④ 真实图/打乱图/无图三种准确率（应呈现「打乱后回落到无图水平」）。屏幕上必须出现：0.5/0.5（注意力权重）、α 行和 1.0、三种准确率、T=500 的内存数字（25 万 float）。

## Data

ts-admin：沪深 300 中按行业取 3 组、每组 10 只共 30 只股票，2018-2024，每只 60 日 × 单变量收益序列 → 节点特征；边=两两相关系数 ≥0.5（式 5.62）；标签=行业。注意：节点数 30 时图较小，需做 5 次随机切分取均值。

## Algorithms

- ch5-gnn - 图卷积分类器（GCN + 建图 + Readout） (TsBase.Algos.Ch05.Gcn)
- ch5-gat - 图注意力分类器（GAT + 动态邻接） (TsBase.Algos.Ch05.Gat)
- ch5-attn - 自注意力分类器（多头 + 位置编码 + 注意力池化） (TsBase.Algos.Ch05.Attention)
