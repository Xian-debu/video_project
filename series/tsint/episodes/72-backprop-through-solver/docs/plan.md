# 72-backprop-through-solver - 两种反向传播：把 200 步求解器摊开，还是在时间里倒着积分

> status: draft (scaffolded, not produced)
> chapter: ch09 | runtime target: 26 min | algorithms: 2

## Thesis

对同一个显式欧拉链，直接法把 θ 的梯度写成 T·h·(1+hθ)^{T−1}·2x_T 的乘积式、伴随法把它写成一次反向递推——两者必须给出相同梯度（相对误差 <1e-10），但直接法的峰值内存随步数线性增长，伴随法近似常数。

## Verification

屏幕上必须出现：(1) 手推梯度 2Te^{2θT} 与伴随法结果的数值对照（相对误差数量级）；(2) 同一 T 下直接法与伴随法的 max residency 比值；(3) 去掉负号后梯度翻转的 bug 演示。看完能自己实现两种反传并解释内存差异。

## Data

纯合成标量/二维轨迹；A 股仅作一段 10 秒的「真实序列上梯度长什么样」的彩蛋

## Algorithms

- ch9-neuralode-direct - 直接法反传（求解器展开成计算图，RK-Net） (TsBase.Algos.Ch09.DirectGrad)
- ch9-neuralode-adjoint - 邻接伴随法（Adjoint Sensitivity Method） (TsBase.Algos.Ch09.Adjoint)
