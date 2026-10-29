# 13-normalization-trio - 归一化三兄弟：差别只在「用谁的统计量」

> status: draft (scaffolded, not produced)
> chapter: ch02 | runtime target: 25 min | algorithms: 3

## Thesis

式(2.7)、式(2.6)、式(2.10)-(2.12) 的形状几乎一样：减去一个中心、除以一个尺度。真正的分野是这三个统计量从哪来——RevIN 用当前输入的 μ/σ（无参数），DAIN 用两个线性映射 W_a、W_b 从窗口统计量里学出 α/β，SAN 用另一个 MLP 去预测「未来分片」的统计量。把这句话写成两条测试：当 DAIN 的 α,β 被约束为输入的 μ,σ 时必须与 RevIN 逐位相等，当 SAN 的分片长度 τ=T 时必须与 RevIN 逐位相等。两条都过，说明三者的差异确实只在统计量来源，而不在公式形状——这比背诵三个名字有用得多。

## Verification

看完这一集，观众应能回答「RevIN 和 Z-score 有什么区别」（答：作用范围与可逆反变换）与「DAIN 到底多学了什么」（答：统计量的修正量 α/β 与门 γ）。屏幕上必须出现三条等式判决：DAIN(α=μ,β=σ) ≡ Z-score（逐位）、SAN(τ=T,μ̂=μ,σ̂=σ) ≡ RevIN（逐位）、RevIN∘RevIN⁻¹ ≡ I（1e-12）。原文式(2.7) 的恒等缺陷必须有原文截图取证。

## Data

ts-admin 日线 120 只票×250 日（6 万窗口，前复权）；合成：常数序列（σ=0 的退化测试）、T=10/τ=3 的分片边界用例。

## Algorithms

- ch2-revin - 可逆实例归一化 (TsBase.Algos.Ch02.Revin)
- ch2-dain - 可学习的分布自适应归一化 (TsBase.Algos.Ch02.Dain)
- ch2-san - 分片自适应归一化 (TsBase.Algos.Ch02.San)
