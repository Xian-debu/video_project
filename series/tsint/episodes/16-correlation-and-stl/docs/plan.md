# 16-correlation-and-stl - 相关性与 STL：一个数说面板，一条分解说序列

> status: draft (scaffolded, not produced)
> chapter: ch02 | runtime target: 20 min | algorithms: 2

## Thesis

式(2.4) 把整张面板的相关结构压成一个数：Correlation = mean(p) + 1/(1+var(p))。它的两个极端是可手算的——所有变量两两完全相关时 p 全 1、var=0，得 2.0（值域上限）；两两不相关时 p 全 0，得 1.0。图2.6 标注的 1.988 与 0.752 正好落在 [1,2] 里，这是全书少数能与公式对上号却又无法复现的数（数据未公开）。而 STL 走另一条路：把一条序列拆成 X=T+S+R，用 Loess（局部三次方权重）分别拟合趋势与季节。两个算法的共同点是「都在描述结构」，差别是一个横向看面板、一个纵向看时间。

## Verification

看完这一集，观众应能手算 p={1,0,1,0} 时的 1.25，并解释为什么 p 全 1 时得到 2.0。屏幕上必须出现：2.0 与 1.0 两个极点值（逐位）、1.25 的手算对照、w(0.5)=0.669921875、以及 STL 的 T+S+R 逐位恒等（1e-12）。图2.6 的 1.988/0.752 只能作为「与公式值域一致」的旁证，必须明确标注无法复现。

## Data

ts-admin 日线 50 只票×250 日（相关性热力图与滚动指数）；单票 250 日（STL）；合成：4 条完全相关/正交序列、周期 5 + 线性趋势序列（T=200）、注入 5% 离群点的鲁棒性用例。

## Algorithms

- ch2-correlation - 面板相关性指数 (TsBase.Algos.Ch02.Correlation)
- ch2-stl - STL 季节-趋势分解 (TsBase.Algos.Ch02.Stl)
