# 23-prob-crps-picp-vae - 概率预测进阶：CRPS、区间覆盖率、VAE 的 ELBO

> status: draft (scaffolded, not produced)
> chapter: ch03 | runtime target: 24 min | algorithms: 3

## Thesis

一个「平均预测很准但区间永远只覆盖 60%」的模型，PICP 会当场判它死刑；而 CRPS 在高斯情形下有一条闭式解，可以拿采样估计去对——两条路差 1e-3 就说明采样器写错了。

## Verification

两套数据并行：合成断言——高斯 CRPS 闭式 vs 采样差 <1e-3、排序恒等式差 <1e-9、S=1 退化为 |x-y|、PICP 在已知高斯区间下 ∈[0.89,0.91]、KL 闭式 1.806853、重参数化梯度差 <1e-6；A 股演示——CRPS 与 MAE 同量纲对照表、80%/95% 区间的覆盖率与平均宽度、VAE 隐空间散点。屏幕上必须出现 4 个数字：1e-3（闭式对齐误差）、1.806853（KL 手算）、0.90（PICP 目标）、1e-9（排序恒等式差）。

## Data

ts-admin 8 通道 panel 1000 个 96 步窗口；合成：固定 seed 标准正态样本做闭式断言，高斯生成器做 CRPS 采样对齐

## Algorithms

- ch3-crps - 连续排序概率分数 CRPS (TsBase.Algos.Ch03.Crps)
- ch3-picp - 预测区间覆盖率 PICP (TsBase.Algos.Ch03.Picp)
- ch3-vae-elbo - VAE 的 ELBO 损失（概率预测生成器） (TsBase.Algos.Ch03.VaeElbo)
