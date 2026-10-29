# 43-shapelet-search-pips - Shapelet：从一条序列里挖出一小段判别力

> status: draft (scaffolded, not produced)
> chapter: ch05 | runtime target: 20 min | algorithms: 3

## Thesis

在合成错位 motif 数据上，PIPs 把候选子序列压到 10% 之后，Top-1 Shapelet 的信息增益与全搜索相差小于 0.01 bit，但搜索耗时降一个数量级——省下来的时间几乎不花判别力。

## Verification

看完能自己复现：① 在合成 motif 上跑出 Top-5 Shapelet 及其增益（最优应为 1.0 bit 附近）；② PIPs 把候选压到 10% 后的增益损失 <0.01 bit 的实测数字；③ F 与 H 两张检验表并指出结论不一致的组。屏幕上必须出现：1.0 bit、10% 候选比例、3.857（H 黄金值）、13.5（F 黄金值）。

## Data

合成主数据：3 类 motif，周期 8/12/20，长度 100，每类 50 条，高斯噪声 0.1，随机相位 ±π（制造 DTW/Shapelet 价值）。ts-admin 对照：沪深 300 中 150 只股票，2018-2024，每只取最近 100 个交易日的 close 归一化序列，标签=行业（3 类）。

## Algorithms

- ch5-shapelet - Shapelet 搜索 + 信息增益分裂 (TsBase.Algos.Ch05.Shapelet)
- ch5-pips - 感知重要点 PIPs 提取 (TsBase.Algos.Ch05.Pips)
- ch5-dist-test - 判别力统计检验（ANOVA F / Kruskal-Wallis H） (TsBase.Algos.Ch05.DistTest)
