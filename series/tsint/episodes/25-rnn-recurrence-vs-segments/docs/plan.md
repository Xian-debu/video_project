# 25-rnn-recurrence-vs-segments - 递归与分段：RNN 的两条生成路

> status: draft (scaffolded, not produced)
> chapter: ch03 | runtime target: 20 min | algorithms: 2

## Thesis

同一个循环骨架，逐点递归与分段并行给出相近的 24 步预测，但后者的推理调用次数从 24 次降到 3 次——代价是生成结果更平滑，高频抖动被抹掉。

## Verification

两套数据并行：合成断言——两步递归手工值 h1=1/h2=2、BPTT 梯度差 <1e-6、截断等价 <1e-10、分段覆盖下标相等、s=1 退化 <1e-12、并行调用 120→15 次；A 股演示——自回归 24 步的误差膨胀曲线、SegRNN 与逐点 RNN 的预测叠图。屏幕上必须出现 4 个数字：h2=2（手算）、15 vs 120（调用次数）、1e-6（梯度门）、MAE 膨胀比。

## Data

ts-admin 日线单只 96 步窗口（600519，2015–2025）；合成数据：x_t=sin(2πt/12)+N(0,0.1) 用于手工值与梯度测试

## Algorithms

- ch3-rnn - 循环状态更新与自回归生成 (TsBase.Algos.Ch03.Rnn)
- ch3-segrnn - 分段循环网络 SegRNN (TsBase.Algos.Ch03.SegRnn)
