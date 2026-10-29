# 10-attention-block - 注意力：一次 softmax 加权，把「对齐」变成可看的矩阵

> status: draft (scaffolded, not produced)
> chapter: ch02 | runtime target: 23 min | algorithms: 1

## Thesis

式(2.65) 只有一个 softmax，它同时承担了三件事：归一化、选择、可解释。前两件用数值测试能钉死（行和为 1、最大 logit 权重最大），第三件才是本集的演示核心：在复制任务上训练 200 步后，注意力矩阵会收敛到单位阵——如果它没收敛，多半是位置编码或掩码写错了，而不是「注意力没学到东西」。

## Verification

看完这一集，观众应能手算 3 元素 softmax 并解释 √d_k 为什么不能省。屏幕上必须出现 4 个数字：softmax([1,2,3]) 的三个值、注意力矩阵行和=1、复制任务 300 步后与单位阵的平均偏差 <0.05、以及无位置编码时置换等变的测试结果。

## Data

合成：复制任务（16 步 × 8 维随机向量，固定 seed）、置换等变测试；ts-admin 日线 600519（60 日窗口，3 万样本训练 + 1 万验证）。

## Algorithms

- ch2-attention - 缩放点积注意力 (TsBase.Algos.Ch02.Attention)
