# 22-prob-nll-quantile-eval - 概率预测入门：高斯 NLL、分位数损失、分位数指标

> status: draft (scaffolded, not produced)
> chapter: ch03 | runtime target: 20 min | algorithms: 3

## Thesis

分位数损失在 τ=0.5 时恰好是 0.5 倍的 MAE，在 τ=0.9 时把「低估」罚 9 倍于「高估」——同一组预测，均值口径与 90 分位口径对「该往哪边调」的结论完全相反。

## Verification

两套数据并行：合成断言——NLL 解析值 1.765512、σ 最优解 <1e-3、pinball τ=0.5 等于 0.5·MAE（1e-15）、黄金值 1.8/0.2、QL 在 τ=0.5 时等于 MAE、交叉率 100% 仍有限；A 股演示——μ±2σ 扇形与 10%-90% 分位扇形、按 τ 分开的 QL 表。屏幕上必须出现 4 个数字：1.765512、0.5（τ=0.5 的系数）、1.8（τ=0.9 的损失）、9（不对称比）。

## Data

ts-admin 日线单只（600519）与 8 通道 panel；合成数据：固定 seed 的高斯噪声序列（y=5+ε），用于解析断言

## Algorithms

- ch3-gauss-nll - 高斯负对数似然头 (TsBase.Algos.Ch03.GaussNll)
- ch3-quantile-loss - 分位数（pinball）损失 (TsBase.Algos.Ch03.QuantileLoss)
- ch3-eval-ql - 分位数损失评估口径（Quantile Loss 指标） (TsBase.Algos.Ch03.EvalQl)
