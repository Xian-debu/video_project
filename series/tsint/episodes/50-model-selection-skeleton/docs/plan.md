# 50-model-selection-skeleton - 自动选模型：池子比策略更重要

> status: draft (scaffolded, not produced)
> chapter: ch06 | runtime target: 20 min | algorithms: 3

## Thesis

把候选池从 3 个扩到 5 个，Hit@1 至少提升 0.15；而把全池遍历换成「特征分析锁参 + 两阶段预筛」，Hit@1 下降不到 0.05——决定结果的不是搜索策略，是池子里有没有那个对的模型。

## Verification

看完能自己复现：① 式(6.8)-(6.10) 的黄金值（MAE=0.5、MSE=0.4167、MAPE=27.78%）；② 20 只股票上 3 模型与 5 模型的 Hit@1 差；③ 全池遍历 vs 两阶段预筛的 Hit@1 差值（目标 <0.05）；④ 剪枝前后组合数（648→54）。屏幕上必须出现：0.5、0.4167、27.78%、两组 Hit@1、648 与 54。

## Data

ts-admin 日线表：股票代码/交易日/open/high/low/close/volume；取沪深 300 中 20 只、2015-2024；H=30 日历史、F=1 日预测 close；模型池 5 个（Naive/指数平滑/ARIMA(1,0,0)/Ridge-lag(5)/SARIMA(1,0,0)(0,0,0,12)），每池 2 个超参档 = 10 个候选。

## Algorithms

- ch6-metrics - 自动分析评估指标（MAE/MSE/MAPE/Accuracy@k） (TsBase.Algos.Ch06.Metrics)
- ch6-modelsel - 搜索式模型选择骨架（池遍历 + Hit@k / Average Rank） (TsBase.Algos.Ch06.ModelSelection)
- ch6-grid-search - 超参网格搜索 + 特征分析锁参 + AIC 剪枝 (TsBase.Algos.Ch06.GridSearch)
