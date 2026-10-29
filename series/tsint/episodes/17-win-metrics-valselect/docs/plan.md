# 17-win-metrics-valselect - 滑窗、指标与选模：先把「分数」这件事做对

> status: draft (scaffolded, not produced)
> chapter: ch03 | runtime target: 20 min | algorithms: 3

## Thesis

四个指标不是同一件事：同一组预测在 MAE 与 MAPE 下能给出相反的模型排序，而 MAPE 碰到真实零值会直接给出 Inf。

## Verification

两套数据并行：合成断言——[1..10] 的黄金滑窗、四指标手算值、θ²+3θ+1 的解析梯度、3 个学习率的固定 seed 排序；A 股演示——600519 后复权日线 2010–2025 出划分清单，并给出两个零参数基线的四指标表。屏幕上必须出现 4 个数字：881（训练窗口数）、0.666667（MAE 与 MSE 的黄金值）、22.2222%（黄金 MAPE）、<1e-6（梯度相对误差）。看完这集观众能自己复现：任意 OHLC 序列 → 滑窗 → 基线 → 四指标表，且知道 MAPE 什么时候不能信。

## Data

ts-admin 日线表：600519 后复权 2010-01-01..2025-12-31（约 3800 行）；另用合成序列 x_t=0.02t+3sin(2πt/48)+N(0,0.1) 做黄金断言

## Algorithms

- ch3-window - 滑窗样本构造与时间序切分 (TsBase.Algos.Ch03.Window)
- ch3-metrics - 点预测四指标（MAE/MSE/RMSE/MAPE） (TsBase.Algos.Ch03.Metrics)
- ch3-train-loss - 训练损失、中心差分梯度检查与验证集选模 (TsBase.Algos.Ch03.TrainLoss)
