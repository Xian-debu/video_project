# 24-chan-mix-itrans-graph - 通道关系三法：混合 MLP、iTransformer、图通道

> status: draft (scaffolded, not produced)
> chapter: ch03 | runtime target: 24 min | algorithms: 3

## Thesis

同一个 A 股 panel，时序注意力学到的差异不显著，把注意力翻到通道轴上却立刻出现行业分块；通道关系才是这组数据的信号所在。

## Verification

两套数据并行：合成断言——TSMixer 恒等（1e-15）、参数量 144/53248、iTransformer 转置恒等（1e-12）、GCN 2 节点手工值 0.5/0.5、归一化行和 1（1e-12）、kNN 边数上界；A 股演示——8×8 通道注意力热图与 20 只股票的 kNN 图，比对行业分组。屏幕上必须出现 4 个数字：144（N=8 混合参数量）、64 vs 9216（注意力规模比）、0.5（GCN 手工值）、3（k）。

## Data

ts-admin 日线：8 通道（600519/000858/000568 白酒；600036/601398/601288 银行；000001.SH/399001.SZ 指数）2015–2025；另用 20 只 4 行业 panel 画 kNN 图

## Algorithms

- ch3-channel-mix-mlp - 时间-变量交错混合 MLP（TSMixer 式） (TsBase.Algos.Ch03.ChannelMixMlp)
- ch3-itransformer - 倒置 Transformer（变量即 token） (TsBase.Algos.Ch03.ITransformer)
- ch3-graph-channel - 图卷积通道建模（kNN 图 + GCN） (TsBase.Algos.Ch03.GraphChannel)
