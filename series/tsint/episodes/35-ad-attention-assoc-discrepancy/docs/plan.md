# 35-ad-attention-assoc-discrepancy - 注意力矩阵里的异常：关联差异、两阶段焦点与次邻域遮罩

> status: draft (scaffolded, not produced)
> chapter: ch04 | runtime target: 30 min | algorithms: 3

## Thesis

异常点的『关联』不是更大而是更平：正常段先验高斯核 p 与序列注意力 s 近乎重合、关联矩阵呈对角带状，注入段变平，对称 KL 分数随之抬升——这条信号比重构误差更会说『哪里异常』。

## Verification

屏幕必须出现：①正常段与注入段的关联热力图并排（带状 vs 平坦）②对称 KL 的黄金值 1.4723 ③三个单元在同一注入集上的 F1（各自一个数）

## Data

ts-admin：600519.SH + 000858.SZ 日线 2015–2026，C=100（T=100 关联矩阵）；注入①与③各 1%。**本集额外提供书中口径的数字对照**：表4.2 的 SWaT/WADI 结果只能作为文献数字标注（C 级，不可本机复现）。评分口径：点调整（主）+ 范围调整（副）。

## Algorithms

- ch4-assoc-diff - Anomaly Transformer 关联差异 (TsBase.Algos.Ch04.AssocDiff)
- ch4-tranad - TranAD 两阶段自条件推理 (TsBase.Algos.Ch04.TranAD)
- ch4-sat - SAT 次邻域注意力 (TsBase.Algos.Ch04.SAT)
