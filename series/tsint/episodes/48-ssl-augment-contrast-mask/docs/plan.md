# 48-ssl-augment-contrast-mask - 没有标签怎么办：增强、对比与掩码重构

> status: draft (scaffolded, not produced)
> chapter: ch05 | runtime target: 26 min | algorithms: 3

## Thesis

在 A 股无标签窗口上预训练后，只用 50 个标签做线性探针，三分类准确率若不能超过「多数类基线」，就说明增强已经破坏了时序语义——本集用这条红线检验四种增强方法。

## Verification

看完能自己复现：① InfoNCE 的 0.5514 与 ln3=1.0986 两个黄金值；② 同 seed 两次增强逐元素相等；③ 四种增强方法对线性探针准确率的影响，并画出多数类基线红线；④ 对比学习 vs 掩码重构的探针准确率对比表。屏幕上必须出现：0.5514、1.0986、多数类基线数值、三方对照准确率。

## Data

ts-admin：沪深 300 全部成分股 2015-2025，60 日 × 单变量对数收益窗口，取 1000 条无标签预训练（缩小比例 1/3，原文未指定规模）；下游 50 个有标签样本（随机抽自 300 只，标签=行业三分类）。合成对照：周期 8/12/20 序列各 300 条，用于验证增强不变性。

## Algorithms

- ch5-augment - 分类数据增强算子族（Jitter/Flip/Scale/Warp/Mixup） (TsBase.Algos.Ch05.Augment)
- ch5-contrast - 序列级对比学习表征（TCL / TNC / InfoNCE） (TsBase.Algos.Ch05.Contrast)
- ch5-mask - 掩码-重构预训练（TST 式） (TsBase.Algos.Ch05.Mask)
