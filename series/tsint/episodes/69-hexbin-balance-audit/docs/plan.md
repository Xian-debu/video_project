# 69-hexbin-balance-audit - 你的基准数据集均衡吗：PCA 投影 + Hexbin 密度图

> status: draft (scaffolded, not produced)
> chapter: ch08 | runtime target: 16 min | algorithms: 1

## Thesis

把高维时序窗口压到前两主成分再画六边形密度图，若超过 60% 的窗口落在不到 20% 的格子里，则任何在该数据上报告的 SOTA 都只由少数格子支撑——这是「基准是否均衡」的可量化判据。

## Verification

屏幕上必须出现：(1) 5 万个窗口的集中度数字（前 20% bin 覆盖的样本比例）；(2) 3 只蓝筹股版本的集中度对照；(3) PCA 反变换重构误差 <1e-10 的断言。看完能自己实现 PCA+hexbin 并判断一份基准数据是否均衡。

## Data

ts-admin 日线 panel：20 只股票、2015-2025、窗口 32 步滑窗采样 5 万条

## Algorithms

- ch8-hexbin-balance - 均衡性诊断（PCA + Hexbin Density） (TsBase.Algos.Ch08.HexbinBalance)
