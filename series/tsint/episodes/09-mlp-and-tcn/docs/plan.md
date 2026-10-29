# 09-mlp-and-tcn - MLP 与 TCN：从一行仿射变换到因果膨胀卷积

> status: draft (scaffolded, not produced)
> chapter: ch02 | runtime target: 27 min | algorithms: 2

## Thesis

MLP 与 TCN 的差别不在深度，而在「谁能看见谁」：MLP 把窗口展平，第 k 个输入与第 k+1 个输入在权重矩阵里毫无关系；TCN 用因果卷积把「时间相邻」写进结构，于是 K=3、d=1,2,4 三层就能让最后一个输出看见前 15 步，且第 t 个输出永远看不见第 t+1 步。把式(2.62) 的核翻转写错，这个性质当场消失，而模型仍然能训练、损失仍然下降——只有因果性测试能抓住它。

## Verification

看完这一集，观众应能写出一个通过有限差分梯度检查的 MLP，并解释式(2.62) 为什么必须翻转核。屏幕上必须出现 4 个数字：1985（MLP 参数量）、y=[3,11,14,20,26] 的卷积黄金值、RF=15、以及因果性测试的两个结果（y_1..y_4 逐位不变 = 通过；未翻转版本 = 挂）。

## Data

ts-admin 日线：600519 + 上证指数 + 200 只随机票（2010-2021，前复权）；合成：AR(2) 序列（固定 seed）用于 TCN 可学性测试，XOR 用于 MLP 可学性测试。

## Algorithms

- ch2-mlp - 多层感知机 (TsBase.Algos.Ch02.Mlp)
- ch2-tcn - 时间卷积网络 (TsBase.Algos.Ch02.Tcn)
