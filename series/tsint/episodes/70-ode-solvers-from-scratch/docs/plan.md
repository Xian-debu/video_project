# 70-ode-solvers-from-scratch — 欧拉法把弹簧算成了永动机

> status: 已出片（676.97 s，content commit 44b6dc1，交付 srt/chapters/cover）
> chapter: ch09 | runtime target: 22 min | algorithms: 3

## Thesis

对 ω=1 的弹簧振子，显式欧拉每步把能量精确乘以 (1+h²ω²)：h=0.1 时 628 步后能量是初值的
517.3956052425341 倍（1.01^628）；同一网格上 RK4 的放大因子是 e^{ihω} 的四阶截断，能量比
0.9999912887184391。误差随步长以 1 阶 / 4 阶下降，这是「求解器选错，后面全白算」的定量证据。

## Verification

屏幕上必须出现：(1) 欧拉 1 步 1.1 与 RK4 1 步 1.1051708333333332；(2) 能量比
517.3956052425341 与相图螺旋；(3) 误差-步长双对数图的两条拟合斜率 0.9742622483525356 与
3.992788894987829；(4) `cabal test` 的 34/34 与三份 evidence 的 0 error。看完能自己实现两个
求解器并解释「为什么不能用欧拉训练 Neural ODE」。

## Data

- 主数据：纯合成（复利 k=1、弹簧 ω=1、h=0.1、628 步），由 `build/generate_ode_data.py`
  从 `data/evidence/*.json` 与 `data/evidence/convergence.csv` 重算并逐项比对（1e-6）。
- 非平滑片段：`data/stock_600519_2019h2.csv`（600519 前复权日线，2019-07-01..2019-12-31，
  126 行），源自 ts-admin `single_daily_600519_qfq.csv`（commit 5e80ec3）。
- 原文图版：p.213 式 9.11/9.12、p.213 式 9.13、p.214 式 9.16/9.17（CC BY-NC-ND 4.0）。

## Algorithms

- ch9-analytic-baseline — `TsBase.Core.Physics` + `TsBase.Algos.Ch09.Analytic`（复利 / 弹簧解析解）
- ch9-euler — `TsBase.Algos.Ch09.Euler`（显式欧拉，含 dt≤0、n<0 拒绝）
- ch9-rk4 — `TsBase.Algos.Ch09.RK4`（四阶 RK，含 dt≤0、n<0 拒绝）

证据：`inventory/evidence/ch9-{analytic-baseline,euler,rk4}/20261029T204911-*.json`，
ts-base commit dbc3d85；断言 34 条（core.vec 7 / analytic 10 / euler 9 / rk4 8）。