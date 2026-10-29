# 06-decomposition-and-strength - 经典分解与两个强度指标：趋势有多强，季节有多强

> status: draft (scaffolded, not produced)
> chapter: ch02 | runtime target: 22 min | algorithms: 3

## Thesis

分解不是目的，是为了给「这条序列有多规律」标一个数。式(2.1)(2.2) 用 var(R)/var(X−S) 定义趋势强度与季节强度，于是任何「很强的趋势」都可以被证伪：只要残差方差与去季节后方差同量级，指标就是 0。而在纯趋势序列上，季节强度式会撞上 0/0——书中没写这时该返回什么。

## Verification

看完这一集，观众应能对任意一条序列说出「趋势强还是季节强」并给出两个数。屏幕上必须出现 3 个数字：纯周期序列的 Seasonality=1、纯趋势序列的 Trend=1、以及「强趋势弱季节 vs 弱趋势强季节」两组的指标互换（差值 >0.5）。书注的 0.998/0.210/0.944/0.441 只能作为 C 级引用，不得声称复现。

## Data

ts-admin 日线 600519（2019-2021，L=5）、上证指数 2015 横盘段（弱趋势对照）；分钟线 5 分钟 600519 一周（L=48）；合成：纯线性趋势、纯周期、iid 噪声、白噪声（固定 seed，脚本写进视频备注）。

## Algorithms

- ch2-classical-decomp - 经典时间序列分解 (TsBase.Algos.Ch02.ClassicalDecomp)
- ch2-trend - 趋势强度 (TsBase.Algos.Ch02.TrendStrength)
- ch2-seasonality - 季节强度 (TsBase.Algos.Ch02.SeasonalStrength)
