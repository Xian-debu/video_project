# 14-nonstationary-attention - 非平稳注意力：一个标量 τ 与一个向量 Δ 能改什么

> status: draft (scaffolded, not produced)
> chapter: ch02 | runtime target: 14 min | algorithms: 1

## Thesis

式(2.9) 只在标准注意力里插了两个东西：一个标量 τ 乘在 Q Kᵀ 上（等于改 softmax 温度），一个向量 Δ 以 1Δᵀ 的形式加在 logits 上（等于给每个 key 一个偏置）。前者与「把 √d_k 除小」完全等价，后者才是真正的新自由度——而且它必须按「列」加：如果按行加，softmax 的行归一化会把它整条吃掉，Δ 的梯度恒为 0，训练一万轮也学不到东西。这个「加了等于没加」的陷阱，是这一集唯一必须讲透的事。

## Verification

看完这一集，观众应能一眼看出 1Δᵀ 是「按列加偏置」并解释为什么按行加会失效。屏幕上必须出现三个判决：τ=1,Δ=0 ≡ EP9 标准注意力（逐位）、按行加时 ∂L/∂Δ ≡ 0（有限差分恰为 0）、τ=2 ≡ 温度减半（逐位）。本集是单算法小集，若档期紧张可与 EP9 合并为上下半集。

## Data

合成：方差随时间放大 10 倍的 60 步序列（5 千条，固定 seed）；ts-admin 日线 60 日窗口（对照，证明 A股 上收益很小）。

## Algorithms

- ch2-nonstat-attn - 非平稳注意力 (TsBase.Algos.Ch02.NonstatAttn)
