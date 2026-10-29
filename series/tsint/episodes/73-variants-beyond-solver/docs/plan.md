# 73-variants-beyond-solver - 不求解器也能算：CfC 的闭式解与灰色 GM-ODE

> status: draft (scaffolded, not produced)
> chapter: ch09 | runtime target: 18 min | algorithms: 2

## Thesis

两个变体都在「去掉数值求解器」：CfC 用闭式解替掉积分，GM-ODE 用灰色微分方程的白化结构替掉黑箱 f_θ——它们能讲清楚的只有机制（AGO 累加、SoftPlus 保号、闭式近似的 log-sum-exp 稳定化），书中的「快 100–100000 倍」「MAPE 0.82%」在本书里没有可复现的协议，只能标 C 级。

## Verification

屏幕上必须出现：(1) AGO=[1,3,6,10] 与 IAGO 还原；(2) GM(1,1) 的 (a,b) 闭式拟合数值；(3) log-sum-exp 防溢出前后 Inf 的对照。看完知道「哪些部分书中给了、哪些必须引文献」。

## Data

合成小样本（20–50 点月度序列）；A 股日线只作 CfC 的不规则采样演示

## Algorithms

- ch9-cfc - 闭式连续时间网络（CfC） (TsBase.Algos.Ch09.CfC)
- ch9-gm-ode - 灰色神经微分方程（GM-ODE） (TsBase.Algos.Ch09.GmOde)
