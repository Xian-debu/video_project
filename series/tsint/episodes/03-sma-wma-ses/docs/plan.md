# 03-sma-wma-ses - 滑动平均与一次指数平滑：N 和 α 是同一把尺子的两种刻度

> status: draft (scaffolded, not produced)
> chapter: ch02 | runtime target: 21 min | algorithms: 3

## Thesis

SMA 的窗口 N 和 SES 的 α 可以互相换算，换算公式是 α=2/(N+1)——因为二者的阶跃响应「质心」（平均滞后）必须相等：(N−1)/2=(1−α)/α。常见做法「α=0.5 配 N=20」等价于拿 N≈3 的超快平滑去对比 N=20，两条曲线不可比。

## Verification

看完这一集，观众应能用一页纸的公式亲手算出 SMA/WMA/SES 三条平滑曲线，并解释「α=0.5 不等于 N=2」。屏幕上必须出现 3 个数字：SES 阶跃响应质心 (1−α)/α、SMA 质心 (N−1)/2、以及 α=2/(N+1) 时两者相等（差 <1e-12）；再加一个 1e5 点序列上增量 SMA 与直接求和的最大偏差。

## Data

ts-admin 日线 600519（2019-2021，约 730 个交易日）；另合成一条 100 点的阶跃序列与一条 1e5 点的常数列（专门测增量误差）；分钟线 5 分钟取 1 周做频率换算演示。

## Algorithms

- ch2-sma - 简单移动平均 (TsBase.Algos.Ch02.Sma)
- ch2-wma - 加权移动平均 (TsBase.Algos.Ch02.Wma)
- ch2-ses - 一次指数平滑 (TsBase.Algos.Ch02.Ses)
