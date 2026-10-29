# 57-tokenization-trio - 把序列切成块：Patch、周期、分辨率前缀

> status: draft (scaffolded, not produced)
> chapter: ch07 | runtime target: 16 min | algorithms: 3

## Thesis

同一 96 点序列，patch=8/16/32 分别给出 12/6/3 个 token——token 数与可容纳的最长周期成反比；三种切法都是无参数或近无参数的确定性变换，本集是纯「组件实现」，不训练任何模型。

## Verification

屏幕上必须出现：(1) 96 点 → 12/6/3 个 token 的手算表；(2) 11 个 token 的重叠切分；(3) ACF 主峰 = 24 的图。看完能自己写三种 tokenizer 并解释 token 数为什么重要。

## Data

合成 sin（P=24）+ ts-admin 日线 000001.SZ 512 点；降采样 4 档用于分辨率前缀

## Algorithms

- ch7-patch-embed - 多尺度 Patch 嵌入（Multi-scale Patch Embedding） (TsBase.Algos.Ch07.PatchEmbed)
- ch7-period-token - 周期化切片（Period Tokenization） (TsBase.Algos.Ch07.PeriodToken)
- ch7-res-prefix - 分辨率前缀调优（Resolution Prefix Tuning） (TsBase.Algos.Ch07.ResPrefix)
