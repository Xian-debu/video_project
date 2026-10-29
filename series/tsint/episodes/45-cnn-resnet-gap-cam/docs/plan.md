# 45-cnn-resnet-gap-cam - 卷积、残差与 GAP：让分类器指出「哪几天在起作用」

> status: draft (scaffolded, not produced)
> chapter: ch05 | runtime target: 22 min | algorithms: 3

## Thesis

在只有 60 步的 A 股窗口上，加残差几乎不提升准确率，但 GAP+CAM 能把「哪 5 个交易日支撑了这次判断」画出来——本集的可验证增益是可解释性，不是精度。

## Verification

看完能自己复现：① 卷积输出的维度公式（4→2 的手算例子）；② 恒等残差块的逐元素相等断言；③ GAP 让同一模型吃 60/120 步两种长度；④ 一张 CAM 热图，并能指出 top-5 交易日的索引。屏幕上必须出现：[−2,−2]（卷积黄金值）、GAP=2.5、CAM 归一化四元组 [0,0.333,0.667,1.0]、top-5 索引。

## Data

ts-admin：沪深 300 中 300 只股票，2018-2024，60 日 × 5 字段（open/high/low/close/volume，分别 z-score），标签=行业三分类；另取同一批股票 120 日窗口做变长验证。合成对照：3 类 motif 验证卷积核是否学到周期。

## Algorithms

- ch5-cnn - 一维 CNN 分类骨干（通道独立与通道依赖） (TsBase.Algos.Ch05.Cnn)
- ch5-resnet - 残差卷积网络（ResNet 9 层） (TsBase.Algos.Ch05.ResNet)
- ch5-gap-cam - 全局平均池化 + 类激活映射（GAP / CAM） (TsBase.Algos.Ch05.GapCam)
