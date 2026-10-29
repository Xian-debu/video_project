# 63-image-encoding - 把序列画成图：GAF 与 MTF 都是可逆的

> status: draft (scaffolded, not produced)
> chapter: ch07 | runtime target: 20 min | algorithms: 3

## Thesis

GAF 与 MTF 都是双射（GAF 的对角线可直接反余弦还原原序列，MTF 由转移矩阵与分箱可逆推箱序列），因此「图像化预测」不是丢信息换归纳偏置，而是把一维卷积换成二维卷积的等价重参数化。

## Verification

屏幕上必须出现：(1) GAF 手算矩阵 [[−1,0],[0,1]]；(2) GASF 对角线反解原序列的误差 <1e-12；(3) MTF 行和为 1 的断言。看完能自己实现两种编码并说明它们可逆。

## Data

ts-admin 日线 128 点（GAF/MTF）与 1024 点（vision）窗口

## Algorithms

- ch7-gaf - 格拉姆角场（Gramian Angular Field） (TsBase.Algos.Ch07.GAF)
- ch7-mtf - 马尔可夫转移场（Markov Transition Field） (TsBase.Algos.Ch07.MTF)
- ch7-vision-recon - 图像化预测/末列重建（Vision-Style Forecasting） (TsBase.Algos.Ch07.VisionForecast)
