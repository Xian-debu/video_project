# 27-patch-embed-and-two-attn - 块嵌入与两种注意力架构：PatchTST 与交叉注意力解码器

> status: draft (scaffolded, not produced)
> chapter: ch03 | runtime target: 24 min | algorithms: 3

## Thesis

把 96 步切成 12 个 patch，注意力矩阵从 96×96 缩到 12×12，参数量掉一个数量级；但 patch 内的时间细节被一个线性投影压掉，所以 PatchTST 在突变行情上会输给逐点模型。

## Verification

两套数据并行：合成断言——patch 数 11、取出切片逐位相等、块嵌入参数量 544、通道等价 1e-12、PatchTST 参数量 20736、单 token 交叉注意力输出 = V（1e-12）、解码器上三角恰为 0；A 股演示——patch 位置示意图、PatchTST 与逐点 Transformer 的 MAE/训练步数对照、24×96 交叉注意力热图。屏幕上必须出现 4 个数字：11（patch 数）、544、20736、1e-12（等价误差）。

## Data

ts-admin 日线 8 通道 96 步窗口（2015–2025）；另用合成张量 T=16,d=16 做手算断言

## Algorithms

- ch3-patch-embed - 块嵌入 Patch Embedding (TsBase.Algos.Ch03.PatchEmbed)
- ch3-patchtst - 通道独立 Patch 编码器 PatchTST (TsBase.Algos.Ch03.PatchTst)
- ch3-cross-attn-decoder - 交叉注意力解码器 (TsBase.Algos.Ch03.CrossAttnDecoder)
