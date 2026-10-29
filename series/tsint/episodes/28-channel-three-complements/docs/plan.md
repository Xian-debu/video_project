# 28-channel-three-complements - 通道三补集：混合 MLP、路由注意力、动态聚类

> status: draft (scaffolded, not produced)
> chapter: ch03 | runtime target: 22 min | algorithms: 3

## Thesis

通道关系可以用三种代价完全不同的方式学：N×N 混合、路由注意力、动态聚类；N=300 时三者参数量相差 40 倍，而它们学到的相关性图应当互相重合。

## Verification

两套数据并行：合成断言——TSMixer 恒等 1e-15、参数量 10048、轴分离等变、路由注意力行和 1（1e-12）、N=3/c=1 手工值 2、复杂度比 16、聚类纯度 1.0（固定 seed）、k=1 退化 1e-12、参数量 9312；A 股演示——W1/W3 热图、4 槽路由热图、20 只股票的动态分配表与调整兰德指数。屏幕上必须出现 4 个数字：10048、256 vs 4096、1.0（纯度）、9312。

## Data

ts-admin 日线：8 通道（行业混合）与 64 只（10 行业）两套 panel；合成 3 簇数据（簇内相关 0.9、簇间 0）用于纯度断言

## Algorithms

- ch3-tsmixer - 完整 TSMixer 块（双轴混合 + 仿射分支） (TsBase.Algos.Ch03.TSMixer)
- ch3-channel-router-attn - 通道路由注意力（软聚类） (TsBase.Algos.Ch03.ChannelRouterAttn)
- ch3-channel-cluster - 动态硬聚类通道建模 (TsBase.Algos.Ch03.ChannelCluster)
