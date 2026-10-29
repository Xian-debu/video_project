# 65-error-metrics-trio - 误差三件套：同一组预测，MSE 涨 4 倍而 MAE 一动不动

> status: draft (scaffolded, not produced)
> chapter: ch08 | runtime target: 18 min | algorithms: 3

## Thesis

把 4 个绝对误差从 [1,1,1,1] 改成 [4,0,0,0]，MAE 保持 1 不变、MSE 从 1 涨到 4——所以「MAE 没变差」完全不代表大偏差被修好；三个指标的排名分歧只在误差幅度不等时出现。

## Verification

屏幕上必须出现：(1) 误差向量 [1,1,1,1]→[4,0,0,0] 时 MSE 1→4、MAE 1→1 的两个数；(2) MASE=1.0 的精确值（F=Y+1 时）；(3) 20 只 A 股的 MASE 箱线图或排序表。看完能自己用 Haskell 实现三指标并解释为什么跨股票要报 MASE。

## Data

ts-admin 日线表：20 只股票、2020-2025、收盘价；另取 5 只做收益率演示（负值触发 MAPE 失效）

## Algorithms

- ch8-mse-rmse-mae - 点预测误差三件套（MSE/RMSE/MAE） (TsBase.Algos.Ch08.ErrorMetrics)
- ch8-mape-mpe - 百分比误差（MPE/sMAPE/MAPE） (TsBase.Algos.Ch08.PercentageErrors)
- ch8-mase - 平均绝对比例误差（MASE） (TsBase.Algos.Ch08.Mase)
