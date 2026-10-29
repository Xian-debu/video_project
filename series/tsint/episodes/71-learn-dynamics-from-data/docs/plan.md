# 71-learn-dynamics-from-data - 把 k 换成一张表：参数辨识与 Neural ODE 前向

> status: produced (2026-10-29)
> chapter: ch09 | runtime 10m39s | algorithms: 2

## Thesis

当 f 退化为 kx 时，一个参数的最小二乘估计有闭式解 k̂ = Cov(t, ln x) / Var(t)；把它换成 2 层 MLP（2→16→16→1，337 个参数）后，同一套 RK4 前向与 MSE 损失就能拟合非指数轨迹——Neural ODE 的全部新增自由度就是把常数 k 换成 f_θ。

## Verification

屏幕上出现并逐项对应证据文件：
1. 合成数据（x=2e^{0.1t}，2% 噪声）：真实 k=0.1，闭式 k̂=0.09814604110644974，梯度下降 k̂=0.09995806992289122（误差 <1e-2）。
2. 2006-11-22–2007-10-29 qfq 日线 200 行：k̂=1.2702893275022433，R²=0.9413535306498018。
3. Neural ODE：sin(2πt) 6 窗 / stock 12 窗，每窗 4 个后续观测；整段 RMSE 0.7499706868863578 / 0.45960674293569964，50 步 RMSE 0.10422545562606406，训练 94.063471744 s。
4. 断言：cabal test 50 条（ParamFit 6 + NeuralODE 11 + 本章前 33 条）。

## Data

- 书页图版 3 张：p.214 式 9.14/9.15、p.215 式 9.18、p.217 式 9.21/9.22（data/source-figures.json，CC BY-NC-ND 4.0 引用边界）。
- data/evidence/：ts-base 证据 JSON 2 份 + CSV 7 个（paramfit/neuralode 轨迹与 loss）。
- data/stock_000001_2006.csv：ts-admin 日线，200 行，含停牌缺口；data/neural.json 由 build/generate_neural_data.py 从上述文件重组并断言。

## Algorithms

- ch9-param-ode-fit — 从数据估动力学参数（连续复利 k 的最小二乘辨识），TsBase.Algos.Ch09.ParamFit（fitK / fitKGradient / lossK）。
- ch9-neuralode-forward — 神经微分方程前向，TsBase.Algos.Ch09.NeuralODE（forwardMLP / integrateRHS / lossMSE / trainFiniteDiff）；本集用中心差分，手写反向传播留第 72 集。
