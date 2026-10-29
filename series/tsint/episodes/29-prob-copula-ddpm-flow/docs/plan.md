# 29-prob-copula-ddpm-flow - 概率生成补集：Copula、扩散损失、连续流

> status: draft (scaffolded, not produced)
> chapter: ch03 | runtime target: 26 min | algorithms: 3

## Thesis

三种生成式概率预测都在做同一件事——把简单随机源搬成目标分布：Copula 用秩变换搬边缘，扩散用 1000 步加噪再退火，连续流用可逆映射搬整条密度。

## Verification

两套数据并行：合成断言——Copula 二分位解析值 0.583333、PIT 的 KS<0.05、独立时 |τ|<0.02、扩散前向 x_t=1.414214、ε_θ=ε 时 loss=0、仿射 log-det 0.693147、逆流往返 1e-10、RK4 误差比 ∈[10,20]；A 股演示——8 通道秩相关矩阵热图、扩散采样路径带、PCA 投影的密度等高线。屏幕上必须出现 4 个数字：0.583333、1.414214、0.693147、16（RK4 阶）。

## Data

ts-admin 8 通道 panel（2015–2025）1000 个窗口；合成：固定 seed 高斯样本（Copula 断言）、标准正态 ε（扩散断言）、一维高斯（CNF 归一化断言）

## Algorithms

- ch3-copula - Copula 多元联合分布建模 (TsBase.Algos.Ch03.Copula)
- ch3-ddpm-loss - 扩散模型噪声预测损失 (TsBase.Algos.Ch03.DdpmLoss)
- ch3-cnf - 连续归一化流（常微分方程密度模型） (TsBase.Algos.Ch03.Cnf)
