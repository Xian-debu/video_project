# 58-channel-strategies - 通道独立还是混合：一个由相关性决定的选择题

> status: draft (scaffolded, not produced)
> chapter: ch07 | runtime target: 20 min | algorithms: 3

## Thesis

通道独立（CI）等价于给每个变量训练一个模型，因此在变量互相独立时最优；一旦通道间相关系数超过 0.8，混合（CM/TSMixer）能利用跨通道信息反超——用同一份合成 panel 让排序随相关性翻转，就能证明「CI 更好」不是普遍结论。

## Verification

屏幕上必须出现：(1) 置换等变性的断言结果；(2) 96×5 输入下 TSMixer 参数量 6560 的实测；(3) 相关性 0.9 时 CI 与 CM 的误差翻转。看完能解释「通道独立什么时候会输」。

## Data

合成 panel（独立/相关两档）+ ts-admin A 股 OHLCV（5 通道，含停牌缺失）

## Algorithms

- ch7-chan-indep - 通道独立（Channel Independence） (TsBase.Algos.Ch07.ChannelIndep)
- ch7-chan-mix - 通道混合（Channel Mixing） (TsBase.Algos.Ch07.ChannelMix)
- ch7-tsmixer - TSMixer MLP 混合块（TSMixer Block） (TsBase.Algos.Ch07.TsMixer)
