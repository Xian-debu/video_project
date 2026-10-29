# 05-stationarize-three-ways - 三种平稳化：差分、对数、Z-score 各治什么病

> status: draft (scaffolded, not produced)
> chapter: ch02 | runtime target: 20 min | algorithms: 3

## Thesis

三种变换里只有差分真的改变了序列的积分阶：对随机游走，一阶差分把方差从 σ²t 变成 2σ²（常数），而 Z-score 是纯仿射变换、一点也没改变平稳性，对数只治异方差。把价格做 Z-score 再声称「已平稳」是时序分析里最常见的一类自欺。

## Verification

看完这一集，观众应能对任意一条 A股 价格序列说出「该用哪种变换、为什么另外两种不够」。屏幕上必须出现 3 个数字：随机游走差分的实测方差（≈2，理论 2σ²）、Z-score 后的 Σz²=4（口径取证）、以及 log 变换前后 |corr(|x|,σ_local)| 从 >0.8 降到 <0.3。

## Data

ts-admin 日线 600519（2019-2021 收盘价 + 成交量）、000001（2015 牛熊段做跨年份对照）；合成：σ=1 随机游走 n=10000（固定 seed）、异方差序列、常数序列。

## Algorithms

- ch2-diff - 差分（一阶/二阶/季节） (TsBase.Algos.Ch02.Diff)
- ch2-log - 对数变换 (TsBase.Algos.Ch02.LogT)
- ch2-zscore - Z-score 标准化 (TsBase.Algos.Ch02.ZScore)
