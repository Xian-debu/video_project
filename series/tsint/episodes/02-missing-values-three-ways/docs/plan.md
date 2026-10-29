# 02-missing-values-three-ways - 缺失值三法：谁在偷偷改变你的方差

> status: draft (scaffolded, not produced)
> chapter: ch02 | runtime target: 19 min | algorithms: 3

## Thesis

三种填充里只有均值填充能写出精确的方差损失公式——填充后总体方差恰好等于 (1−p)·观测方差（p 为缺失比例）；而 LOCF 的方差损失取决于缺口落在序列的哪个位置，不是缺失比例。所谓「无害的补洞」是伪命题。

## Verification

看完这一集，观众应能自己用一张带缺口的 CSV 跑出三种填充并解释方差差异。屏幕上必须出现 4 个数字：均值填充后方差 = (1−p)σ² 的实测值与公式预测值（应相同到 1e-12）、LOCF 在「连续 2 点缺口」与「单点缺口」两种排布下的方差（应不同）、线性插值在 5% 随机遮挡下的缺口段 MAE。

## Data

ts-admin 日线（panel API 导 CSV：5917 只 / 1,776 万行 / 1990-2026）：600519 贵州茅台、000001 平安银行各一条完整序列 + 一只长期停牌票；缺口由脚本按固定 seed 随机遮挡 5%/20%（seed 写进视频脚本，保证可复现）。

## Algorithms

- ch2-locf - 末值填充（前推/后推） (TsBase.Algos.Ch02.Locf)
- ch2-statimp - 统计量填充（均值/中位数/众数） (TsBase.Algos.Ch02.StatImp)
- ch2-lininterp - 线性插值填充 (TsBase.Algos.Ch02.LinInterp)
