# 64-llm-side-adapters - 只训练 0.1% 的参数：线性探测、LoRA 与语义锚点

> status: draft (scaffolded, not produced)
> chapter: ch07 | runtime target: 16 min | algorithms: 3

## Thesis

冻结主干 + 线性头（1300 参数）就能复现部分下游效果；LoRA 只加 2·r·d 个参数（d=64、r=4 时每层 512 个，占总参数不到 1%），且 B 初始化为 0 时输出与冻结模型逐位相同——「适配」的代价可以被精确算出来。

## Verification

屏幕上必须出现：(1) LoRA 参数量 512 的手算；(2) B=0 时输出与冻结模型逐位相同的断言；(3) 线性头复原 w_true 的 1e-10 误差。看完能精确算出「适配要花多少参数」。

## Data

ts-admin 日线序列嵌入（来自 E3 编码器）+ 随机正交词向量表（替代 LLM 词表）

## Algorithms

- ch7-linear-probe - 线性探测/线性分类头（Linear Probing） (TsBase.Algos.Ch07.LinearProbe)
- ch7-lora - 低秩重参数化（LoRA） (TsBase.Algos.Ch07.LoRA)
- ch7-anchor-prefix - 语义锚点前缀选择（Semantic Anchor Prefix） (TsBase.Algos.Ch07.AnchorPrefix)
