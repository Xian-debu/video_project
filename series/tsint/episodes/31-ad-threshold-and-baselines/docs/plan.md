# 31-ad-threshold-and-baselines - 分数怎么变成 0/1：阈值、分类器，与最笨的基线

> status: draft (scaffolded, not produced)
> chapter: ch04 | runtime target: 22 min | algorithms: 3

## Thesis

阈值不是超参而是口径：同一分数序列上，固定阈值在 A 股上的 F1 比训练段 1% 分位低一截，而 SPOT 只在尾部近似幂律时才赢。

## Verification

同一分数序列上三条阈值路线的 P/R/F1 三个数；分类器测试集概率图；MA 残差 F1 必须明显低于前两者（若不低于，说明注入太容易，需要重做注入）

## Data

ts-admin：600519.SH 日线（同 L0）+ 注入①与②（②=在波动率最低 20% 分位窗口内注入 k·σ_c∈[2,4] 的中等偏移，全局不显眼）。三方法共用同一分数序列：MA 残差 / 分类器概率 / 手动分数，注入率 1%，评分口径点调整+范围调整双报。

## Algorithms

- ch4-thresh - 阈值三路线（固定/分位/SPOT） (TsBase.Algos.Ch04.Threshold)
- ch4-sup-cls - 有监督滑窗分类检测器 (TsBase.Algos.Ch04.SupCls)
- ch4-ma-es - 统计平滑残差检测（MA / 指数平滑） (TsBase.Algos.Ch04.Smoothing)
