# 21-attn-mhsa-block-masked - 注意力三件套：多头自注意力、Transformer 块、因果掩码

> status: draft (scaffolded, not produced)
> chapter: ch03 | runtime target: 22 min | algorithms: 3

## Thesis

把 d_k 的缩放去掉，第二层就炸成 NaN；而因果掩码只需要在 softmax 前把上三角置 -inf，就能让每个时刻只看得到自己左边。

## Verification

两套数据并行：合成断言——注意力行和 1（1e-12）、2×2 手算 0.268941/0.731059 与输出 17.3102、置换等变 1e-12、双残差关闭后 = LN(LN(Z0))、掩码上三角恰为 0、首 token 输出等于 V 第一行、参数量 49152、梯度门 1e-6；A 股演示——96 步窗口的 4 头注意力热图、24 步自回归掩码图。屏幕上必须出现 4 个数字：1/√16=0.25（缩放因子）、0.731059（手算权重）、49152（块参数量）、0（上三角权重）。

## Data

ts-admin 日线单只 96 步窗口 × 8 通道；合成张量 T=8, d=16（手算与置换测试用），固定 seed 随机权重

## Algorithms

- ch3-mhsa - 多头自注意力 MHSA (TsBase.Algos.Ch03.Mhsa)
- ch3-transformer-block - Transformer 编码器块（Post-LN + FFN） (TsBase.Algos.Ch03.TransformerBlock)
- ch3-masked-attn - 因果掩码自注意力（解码器用） (TsBase.Algos.Ch03.MaskedAttn)
