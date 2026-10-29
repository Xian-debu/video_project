# 39-ad-classic-arima-matrixprofile - 残差与邻居：ARIMA 残差检测与 Matrix Profile discord

> status: draft (scaffolded, not produced)
> chapter: ch04 | runtime target: 26 min | algorithms: 2

## Thesis

两种不需要神经网络的定义：ARIMA 把『模型解释不了的部分』当异常（残差），Matrix Profile 把『整条序列里找不到相似邻居的子序列』当异常（discord）——前者假设线性可预测、后者假设重复；个股停牌常值段会让残差恒 0、距离恒 0，两者同时失效，这正好是它们的边界。

## Verification

屏幕必须出现：①AR(1) 的 φ̂ 一个数（落在 0.45–0.55）②MP 对复制段的 P≈0 与注入段 top-1 ③停牌常值段两种方法的分数（都≈0，失效证明）

## Data

ts-admin：600519.SH 日线 2010-01-04 至 2026-06-30（train 2010–2020 / test 2021–2026）；单变量、无窗口。注入①（k∈[5,10]σ 单点与 3 连点）与注入④（周期相位平移半周期），注入率 1%、种子 42；另人工置入 50 点常值段模拟停牌做失效对照。评分口径：点调整（主）+ 范围调整（副）。

## Algorithms

- ch4-arima - ARIMA 残差检测 (TsBase.Algos.Ch04.ARIMA)
- ch4-mp - Matrix Profile 子序列异常（discord） (TsBase.Algos.Ch04.MatrixProfile)
