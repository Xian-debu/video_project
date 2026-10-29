# 62-anomaly-two-ways - 两种异常检测：预测残差看得见尖峰，重构误差看得见整段漂移

> status: draft (scaffolded, not produced)
> chapter: ch07 | runtime target: 18 min | algorithms: 2

## Thesis

对「单个尖峰」异常，预测残差法的 F1 高于重构法；但对「整段平滑漂移」异常，预测残差法几乎完全失效（F1<0.1）而重构法仍能检出——两者不是替代关系，而是覆盖不同的异常形态。

## Verification

屏幕上必须出现：(1) 两类异常的 F1 对照表（尖峰 vs 漂移）；(2) 552 参数的自编码器实测；(3) 阈值 k/q 敏感性曲线。看完能解释「为什么漂移异常预测残差法看不见」。

## Data

ts-admin 日线 000001.SZ 正常段（2015-2019）训练，2020-2022 注入两类异常做测试

## Algorithms

- ch7-pred-anomaly - 基于预测的异常检测（Forecast-residual AD） (TsBase.Algos.Ch07.PredAnomaly)
- ch7-recon-anomaly - 基于重构的异常检测（Reconstruction-based AD） (TsBase.Algos.Ch07.ReconAnomaly)
