# 49-gaf-mtf-cote-multidomain - 换一种表示：图像化编码与多域集成

> status: draft (scaffolded, not produced)
> chapter: ch05 | runtime target: 22 min | algorithms: 2

## Thesis

GAF 与 MTF 都是分箱序列的双射编码（不丢信息），但偏置完全不同：GAF 只依赖幅值、MTF 只依赖转移次序，同一窗口上两者的 Fisher 判别比相差 1 倍以上，双通道 CNN 比任一单通道高 3 个百分点；而 COTE 式四域加权投票，只要有两个强域就足以压过任何单域。

## Verification

看完能自己复现：① GASF=[[−1,0],[0,1]]、GADF=[[0,1],[−1,0]]、MTF=[[0,1,0],[1,0,1],[0,1,0]]、RP 全 1 与 [[1,0,1],[0,1,0],[1,0,1]]；② 加权票 0.8 vs 1.5 → 输出 B；③ 同一窗口的四联图；④ 4 个单域与 COTE 的准确率对照。屏幕上必须出现：−1/0/1 三个数、0.8、1.5、四联图、单域与集成两组准确率。

## Data

ts-admin 日线：20 只股票，窗口 128 日、步长 5，重采样到固定长；标签=20 日前向收益三分位（上行/震荡/下行）。图像化编码在 ch5-gaf-mtf 内生成 GASF/GADF/MTF/RP；COTE 的 shapelet 域复用 ch5-shapelet 实现，ACF/PS 域用 T/4 滞后与 Welch 周期图。

## Algorithms

- ch5-gaf-mtf - 时序图像化 + CNN（GAF/MTF/RP） (TsBase.Algos.Ch05.Imaging)
- ch5-cote - COTE 多域集成（时域/ACF/PS/shapelet） (TsBase.Algos.Ch05.Cote)
