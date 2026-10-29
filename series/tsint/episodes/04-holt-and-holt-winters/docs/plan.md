# 04-holt-and-holt-winters - Holt 家族：三行递推把趋势和季节塞进指数平滑

> status: draft (scaffolded, not produced)
> chapter: ch02 | runtime target: 24 min | algorithms: 2

## Thesis

加法与乘法 Holt-Winters 的差别不是「季节形状好不好看」，而是误差的度量：乘法模型把季节幅度写成趋势的百分比，于是任何 0 或负值都会让式(2.27)-(2.33) 的除法当场爆炸。A股 的成交量列里有大量 0（停牌/无成交），所以乘法模型在真实数据上不是「有时差一点」，而是「必须加保护分支」。

## Verification

看完这一集，观众应能从零写出三行递推并复现手算的 6 个状态值。屏幕上必须出现 3 个数字：手算 s3=13.28125、b3=1.296875、ŷ4=14.578125；以及乘法模型在 0 值输入上的错误码（而不是 NaN）。

## Data

ts-admin 日线 600519（L=5 与 L=252 两档）；分钟线 5 分钟 600519 一周（L=48，日内 U 形）；另合成一条含 0 的成交量序列专门触发乘法模型的错误路径。

## Algorithms

- ch2-holt - 二次指数平滑（Holt 线性趋势） (TsBase.Algos.Ch02.Holt)
- ch2-holtwinters - 三次指数平滑（Holt-Winters 加法/乘法） (TsBase.Algos.Ch02.HoltWinters)
