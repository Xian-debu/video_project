# 18-norm-revin-now-mean - 归一化三兄弟：RevIN、NowNorm、MeanNorm

> status: draft (scaffolded, not produced)
> chapter: ch03 | runtime target: 18 min | algorithms: 3

## Thesis

同样是「减一个数再预测再加回来」，减均值与减末值在漂移序列上给出的误差能差一倍；而三个归一化都会让平移不变性变成可断言的性质。

## Verification

两套数据并行：合成断言——三个归一化的平移不变性（<1e-12）、round-trip 恒等（<1e-12）、常数窗口不产生 NaN、以及 NowNorm 的手工值 4；A 股演示——茅台/银行同 panel 的量纲对齐、上证指数上 NowNorm 与 z-score 的 24 步曲线、成交量序列上 MeanNorm 的劣化。屏幕上必须出现 3 个数字：1e-12（往返误差）、1600/5（两通道量纲相差 320 倍）、以及三个归一化在同一线性骨干上的 MAE 三行表。

## Data

ts-admin 日线：600519（高价）、600036（低价）、000001.SH 指数点位、某银行股成交量；合成序列 x_t=100+0.05t+5sin(2πt/48)+N(0,1)（带水平漂移，用来暴露 MeanNorm 的弱点）

## Algorithms

- ch3-revin - 可逆实例归一化 RevIN (TsBase.Algos.Ch03.Revin)
- ch3-now-norm - 末值平移归一化 NowNorm (TsBase.Algos.Ch03.NowNorm)
- ch3-mean-norm - 均值平移归一化 MeanNorm (TsBase.Algos.Ch03.MeanNorm)
