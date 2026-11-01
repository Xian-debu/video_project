# 24-chan-mix-itrans-graph - 通道关系三法：混合 MLP、iTransformer、图通道

> status: ready（证据 44/44；画面与旁白已按实测语音对齐）
> chapter: ch03 · 通道关系 | 书 p.55–62（印刷页） | units: ch3-channel-mix / ch3-itrans / ch3-gcn
> 算法：ts-base df465a2；证据：ts-base 8a3b74e；数据：ts-admin 1c92e68

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


## Delivery

2026-11-01 生产完成：806.1 s / 24,183 帧，-15 LUFS（真峰 -2 dBFS），mp4 38,006,588 B。

- 封面帧 9300（310.00 s，直觉页的八通道相关矩阵热图，无字幕条）。
- 字幕 223 条 / 8 章，0 条换行（最长 31 字），字幕跨度 00:00:01,200 → 00:13:23,910（发声 740.2 s）。
- 闸门：静帧 lint 全过；亮度闪烁 mean 22.70、mean|d| 0.0181、p99 0.2794、最大 7.81、7 个切点，均过；响度 I=-15 / TP=-2。
- 证据 44/44（五组 7 / 9 / 9 / 8 / 11），测试 85 套 / 1,133 断言。
- 欠账：A7 算法卡、`tsbase demo` 子命令仍规划中。
