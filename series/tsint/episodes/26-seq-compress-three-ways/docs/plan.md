# 26-seq-compress-three-ways - 序列压缩三法：奇偶下采样、周期下采样、最后时刻压缩

> status: draft (scaffolded, not produced)
> chapter: ch03 | runtime target: 22 min | algorithms: 3

## Thesis

把 96 步压到 12 步再预测，三种压缩里只有一种能无损往返；压缩比 8:1 让计算量掉到 1/4 的同时，有损的那两种会在突变行情上系统性滞后。

## Verification

两套数据并行：合成断言——奇偶往返 1e-12、SCINet 手工值 [1,5]、乘加比 8、SparseTSF 参数量 96、last-step 求和 L·c、因果逐位不变；A 股与分钟线演示——5 分钟线奇偶拆分叠图、SparseTSF vs DLinear 的 MAE 与参数量对照。屏幕上必须出现 4 个数字：8（压缩比）、96（SparseTSF 参数量）、1560（压缩头参数量）、1e-12（往返误差）。

## Data

ts-admin 5 分钟线单只 2019–2025；合成序列 x_t=sin(2πt/p)+噪声，p∈{24,12}

## Algorithms

- ch3-scinet - 奇偶下采样与交互卷积（SCINet 式） (TsBase.Algos.Ch03.SCINet)
- ch3-sparse-tsf - 周期下采样稀疏线性 SparseTSF (TsBase.Algos.Ch03.SparseTsf)
- ch3-last-step-compress - 最后时刻压缩 (TsBase.Algos.Ch03.LastStepCompress)
