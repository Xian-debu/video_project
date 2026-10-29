# 70-ode-solvers-from-scratch - 欧拉法把弹簧算成了永动机：Δt=0.1 时 10 个周期能量涨 535 倍

> status: draft (scaffolded, not produced)
> chapter: ch09 | runtime target: 22 min | algorithms: 3

## Thesis

对 ω=1 的弹簧振子，显式欧拉每步把能量精确乘以 (1+h²ω²)：h=0.1 时 628 步后能量是初值的 535 倍；同一网格上 RK4 的误差随 h 以 4 阶下降（h 减半误差降 16 倍），这是「求解器选错，后面全白算」的定量证据。

## Verification

屏幕上必须出现：(1) 欧拉 1 步 = 1.1、RK4 1 步 = 1.1051708333 两个精确值；(2) 能量比 535 这个数（1.01^628）与相图螺旋；(3) 误差-步长双对数图的两条斜率 1 与 4。看完能自己实现两个求解器并解释「为什么不能用欧拉训练 Neural ODE」。

## Data

纯合成数据（复利 + 弹簧），无需 A 股；预留 10 秒片段：把一只股票的收盘价当轨迹，演示 RK4 在非平滑数据上降为 1 阶

## Algorithms

- ch9-analytic-baseline - 解析解基准（复利/弹簧） (TsBase.Algos.Ch09.Analytic)
- ch9-euler - 显式欧拉法（Euler Method） (TsBase.Algos.Ch09.Euler)
- ch9-rk4 - 四阶龙格-库塔（RK4） (TsBase.Algos.Ch09.RK4)
