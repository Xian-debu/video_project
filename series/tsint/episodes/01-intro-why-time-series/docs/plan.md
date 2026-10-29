# 01-intro-why-time-series - 一条带时间戳的序列能承载什么：四个任务、三次范式迁移，与本系列的方法论

> status: draft (scaffolded, not produced)
> chapter: ch01 | runtime target: 18 min | algorithms: 0

## Thesis

预测、异常检测、分类、插补这四个任务从 1920 年代的统计模型到 2024 年的基础模型都没变，变的只是「归纳偏置从哪来」；这条主线就是全书九章的路线图，也解释了本系列为什么用 Haskell 把每个公式一行行实现、并用一条命令判决它算得对不对。

## Verification

本集无算法，验证落在管线上：①现场跑 `tsa status` 与 `python3 inventory/scripts/export_demo.py`，屏幕上出现真实数字（日线 17,763,617 行、分钟 105,435,686 行、6 个 CSV 切片共 46,489 行）；②现场跑 `cabal test` 让观众看到当前测试通过；③观众应能回答：为什么 A 股日线同时是「不规则采样 + 非平稳 + 有停牌」，为什么我们不选择端到端调库。

## Data

ts-admin 全库统计（docs/11 与 docs/14 验收记录）+ /root/ts-base/data/demo/ 的 6 个 CSV 切片（docs/06 数据接口，含 sha256 manifest）。本集只读数据、不训练。

## Algorithms

- (none: this is an introduction episode)
