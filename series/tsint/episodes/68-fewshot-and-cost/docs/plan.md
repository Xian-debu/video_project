# 68-fewshot-and-cost - 5% 的样本怎么选：Few-shot 采样器与它的成本账

> status: draft (scaffolded, not produced)
> chapter: ch08 | runtime target: 16 min | algorithms: 2

## Thesis

few-shot 只能取「连续的时间段」而不能随机撒点（否则时间连续性被破坏），因此 5% 的采样率在 1000 点序列上固定只有 50 个点、且位置由窗口类型决定——换一种窗口，结果就不可比。

## Verification

屏幕上必须出现：(1) 8 种采样组合的 50 点位置图；(2) 同一个种子两次采样逐位一致的断言结果；(3) 3 个规模模型的参数量（337 作为自检数字）。看完能自己实现采样器并解释为什么不能随机撒点。

## Data

ts-admin 日线：1200 点单票序列用于采样演示；ts-base 三个规模 MLP 用于效率测量（本阶段不实现，brief 只定义协议）

## Algorithms

- ch8-fewshot-sampler - Few-shot 采样器（窗口/点采样） (TsBase.Algos.Ch08.FewShotSampler)
- ch8-efficiency-bench - 效率指标测量（Efficiency Metrics） (TsBase.Algos.Ch08.Efficiency)
