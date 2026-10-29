# 59-mini-foundation-loop - 一万个参数的「基础模型」：掩码重建 + 线性头 + 少样本

> status: draft (scaffolded, not produced)
> chapter: ch07 | runtime target: 24 min | algorithms: 3

## Thesis

在 512 点日线窗口上做 30% 掩码重建、只用 6.6 万参数的编码器、20 个 epoch，就能让冻结表示上的线性头把 MAE 从朴素基线的 1.00 降到 0.9 以下——预训练在小规模上就是一次自监督去噪，不是必须有十亿参数。

## Verification

屏幕上必须出现：(1) 154 个掩码位置的计数；(2) 65,856 个参数的实测与 1300 个线性头参数；(3) k=0/5/10/100 四档 MAE 曲线。看完能自己搭一个「预训练+线性头」的最小闭环。

## Data

ts-admin 日线 000001.SZ 5000 个 512 点窗口（训练 3000 / 验证 1000 / 测试 1000）；少样本另取 20 只股票

## Algorithms

- ch7-mask-recon - 掩码重建预训练（Masked Reconstruction） (TsBase.Algos.Ch07.MaskRecon)
- ch7-flatten-head - 展平输出头（Flatten Head） (TsBase.Algos.Ch07.FlattenHead)
- ch7-shot-protocol - 全/少/零样本评估协议（Full/Few/Zero-shot） (TsBase.Algos.Ch07.ShotProtocol)
