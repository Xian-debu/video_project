# 44-learnable-shapelet-softmin - 把 min 换成 SoftMin：Shapelet 终于可以求导

> status: draft (scaffolded, not produced)
> chapter: ch05 | runtime target: 24 min | algorithms: 3

## Thesis

min 让梯度恒为 0，SoftMin 让梯度处处存在：α 每放大 10 倍，学到的 Shapelet 落点误差缩小约 10 倍；但 α>500 后梯度下溢为 0，训练反而停住。

## Verification

看完能自己复现：① SoftMin 与 min 在 α=1/20/200 下的三条曲线；② 学到的 5 个 Shapelet 位置与真实 motif 的误差表；③ MLP 的梯度数值校验（<1e-6）；④ 树深与准确率的过拟合拐点。屏幕上必须出现：−1.0986（SoftMin 黄金值）、α 退火三档、梯度误差量级、拐点处树深。

## Data

主：合成 3 类 motif（周期 8/12/20）× 50 条 × 长度 100 × 噪声 0.1。对照：ts-admin 沪深 300 中 150 只股票，60 日 × 5 字段归一化窗口，标签=行业三分类。

## Algorithms

- ch5-shapelet-learn - 可学习 Shapelet（SoftMin 距离 + 分类头） (TsBase.Algos.Ch05.LearnShapelet)
- ch5-shapelet-tree - Shapelet 决策树 / 距离特征 softmax (TsBase.Algos.Ch05.ShapeletTree)
- ch5-mlp - MLP 分类器（含 DTW-NN 变体） (TsBase.Algos.Ch05.Mlp)
