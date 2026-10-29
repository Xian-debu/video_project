# 74-fidelity-tv-and-dtw - 别只看 MSE：总变差正则与 DTW 保真度

> status: draft (scaffolded, not produced)
> chapter: ch09 | runtime target: 18 min | algorithms: 2

## Thesis

MSE 无法区分「形状对但相位错开」与「形状本身错」：对 x=[1,2,3] 与 y=[2,3]，DTW 给出 1，而逐点 MSE 给 0.67 且完全看不出「只是一个平移」；TV 正则把预测的抖动总量压到原来的 1/2 以下时，MSE 往往反而变差。

## Verification

屏幕上必须出现：(1) DTW([1,2,3],[2,3])=1 的手算路径；(2) DTW 违反三角不等式的具体三元组；(3) TV-MSE 剪刀曲线上的 λ 甜区数值。看完能自己判断「什么时候该用 DTW 而不是 MSE」。

## Data

ts-admin：5 分钟线 500 点（TV）+ 两只走势相似的股票日线（DTW）

## Algorithms

- ch9-tv-reg - 总变差感知正则（Total Variation Regularizer） (TsBase.Algos.Ch09.TvReg)
- ch9-dtw - 动态时间规整（DTW） (TsBase.Algos.Ch09.Dtw)
