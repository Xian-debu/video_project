# 71-learn-dynamics-from-data - 把 k 换成一张表：参数辨识与 Neural ODE 前向

> status: draft (scaffolded, not produced)
> chapter: ch09 | runtime target: 24 min | algorithms: 2

## Thesis

当 f 退化为 kx 时，一个参数的最小二乘估计有闭式解；把它换成 2 层 MLP（321 个参数）后，同一套 RK4 前向与 MSE 损失就能拟合非指数轨迹——Neural ODE 的全部新增自由度就是把常数 k 换成 f_θ。

## Verification

屏幕上必须出现：(1) k̂=0.1 的精确恢复（无噪声）；(2) 321 个参数的 MLP 自检；(3) 训练后的轨迹与真值的叠图 + 训练 MSE 数值。看完能自己写一个「f_θ + RK4 + MSE」的完整前向。

## Data

ts-admin 日线 000001.SZ 200 交易日（含停牌缺口）；合成 sin/指数轨迹作为对照

## Algorithms

- ch9-param-ode-fit - 从数据估动力学参数（连续复利 k 的最小二乘辨识） (TsBase.Algos.Ch09.ParamFit)
- ch9-neuralode-forward - 神经微分方程前向（Neural ODE Forward） (TsBase.Algos.Ch09.NeuralODE)
