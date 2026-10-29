# 52-meta-learning-task-library - 把 300 只股票当成 300 个任务：元学习选模型

> status: draft (scaffolded, not produced)
> chapter: ch06 | runtime target: 24 min | algorithms: 2

## Thesis

300 个任务（每只股票=一个任务）训练出的元学习器，在留出 30 只上的 Hit@1 比「按类均值选模型」的基线高 0.1 以上；而把 4 维统计元特征换成 TS2Vec 的 64 维表征，提升不到 0.03——贵的不一定有用。

## Verification

看完能自己复现：① 任务库构造脚本（300 任务、每任务 10 个候选、5 折任务级切分）；② 元学习 vs 类均值基线的 Hit@1 差（目标 >0.1）；③ 64 维表征的 t-SNE 图；④ 统计特征 vs TS2Vec 表征的 Hit@1 对照（目标差 <0.03）。屏幕上必须出现：300/30/5 折三个数字、两组 Hit@1、64 维。

## Data

ts-admin：沪深 300 全部成分股，2010-2024 日线 close；每只股票 = 一个任务（300 个任务），每任务用前 70% 训练/后 30% 验证，候选 10 个（5 模型 × 2 超参档）；留出 30 只完全未见的股票做最终评估。TS2Vec 预训练用同一批股票的 500 日窗口（缩到 2000 条）。

## Algorithms

- ch6-metalearn - 元学习模型选择（元样本 + 多输出回归 + 任务级 F 折） (TsBase.Algos.Ch06.MetaLearn)
- ch6-meta-ts2vec - 数据集表征（TS2Vec 编码元特征） (TsBase.Algos.Ch06.Ts2Vec)
