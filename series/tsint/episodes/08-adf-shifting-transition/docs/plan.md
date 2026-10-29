# 08-adf-shifting-transition - 冷门三指标：ADF 检验、漂移性、转移性

> status: draft (scaffolded, not produced)
> chapter: ch02 | runtime target: 24 min | algorithms: 3

## Thesis

式(2.3) 把 ADF(X) 同一个符号既当统计量又当 p 值，这两者是两件事，差一张非标准分布的临界值表：τ 是回归系数除标准误，而它服从的不是 t 分布。按字面实现「τ<0.05 就平稳」会得到一个几乎永远说「平稳」的判据。另两个指标更反直觉：Transition 用的是 tr(cov(M'))，按这个式子，完美周期序列得 2/3 而常数序列只得 2/9——它不是「自转移比例」。

## Verification

看完这一集，观众应能说出「为什么式(2.3) 的字面实现会恒判平稳」并手算 2/3 与 2/9 两个黄金值。屏幕上必须出现 5 个数字：白噪声 τ（≈−15）、随机游走 τ（≈−1.5）、−3.43/−2.86 两条临界值、Shifting=0.5、Transition=2/3 与 2/9。书注的图2.3-2.5 数值只能 C 级引用。

## Data

ts-admin 日线 600519 收盘价与收益率（250 点）；600519 与一只小市值票的收益率符号序列（Transition 对照）；合成：白噪声（seed 42,n=500）、随机游走（同 seed）、周期 [1,2,3]、常数序列、iid 均匀（n=3000）。

## Algorithms

- ch2-adf - ADF 单位根检验 (TsBase.Algos.Ch02.Adf)
- ch2-shifting - 漂移性指标 (TsBase.Algos.Ch02.Shifting)
- ch2-transition - 转移性指标 (TsBase.Algos.Ch02.Transition)
