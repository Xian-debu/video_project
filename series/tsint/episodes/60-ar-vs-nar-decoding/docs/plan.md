# 60-ar-vs-nar-decoding - 一步一步还是一口气：自回归与非自回归解码

> status: draft (scaffolded, not produced)
> chapter: ch07 | runtime target: 16 min | algorithms: 2

## Thesis

自回归解码把每一步的误差回灌成下一步输入，误差方差随步数线性增长（F=20 时约为一步误差的 √20≈4.5 倍）；非自回归一次输出全部 F 步，误差不累积但会把尖峰抹平——两条误差-地平线曲线在 F≈8 处交叉。

## Verification

屏幕上必须出现：(1) 复制函数的 20 步 rollout 全等；(2) 误差随 F 的曲线与 √F 对照线；(3) AR 与 NAR 的推理耗时比（≥5×）。看完能自己实现两种解码并解释误差累积。

## Data

ts-admin 日线 000001.SZ 高波动段（2020-2022）；F=1/5/20 三档

## Algorithms

- ch7-ar-decode - 自回归滚动解码（Autoregressive Rollout） (TsBase.Algos.Ch07.Autoregressive)
- ch7-nar-decode - 非自回归并行解码（Non-autoregressive Decoding） (TsBase.Algos.Ch07.NonAutoregressive)
