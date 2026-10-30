# 67-split-no-leakage - 切数据的三条规矩：一次 shuffle 就让你的 MSE 好两个数量级

> status: ready (scenes + narration built; delivery pending)
> chapter: ch08 | runtime target: 22 min | algorithms: 3

## Thesis

同一只股票、同一段历史、同一个查表预测器，只把切分方式从「按时间」换成「随机 shuffle」，测试 MSE 从 5.0622 掉到 0.0297，好了 170.2 倍。这不是模型变强，是训练集里混进了测试点之后才发生的观测。时间序列的切分先于模型：训练段最大索引必须小于验证段最小索引，再小于测试段最小索引；这一条断言就能把泄漏变成可计数的错误。固定预测只拟合一次，滚动预测逐轮重拟合，两条协议都必须把测试点挡在训练窗口之外。

## 核心判断

- 随机 shuffle 后按 7:1:2 分，三个集合的大小仍然对，但顺序全错；本机 2600 个交易日下，训练集里有 519 个测试点之后才发生的观测。
- 泄漏检测器只查三件事：`max(train) < min(val)`、`max(val) < min(test)`、三集两两不相交；时间切分 0 条违规，随机切分 2 条（order/train-val、order/val-test）。
- 查表探针的误差比不是模型指标，是切分体检：同一份最近邻查表，时间切分 MSE=5.0622，随机切分 MSE=0.0297，比值 170.25×；换探针后这个倍数会变，但「随机切分误差更低」的方向不变。
- 固定预测 f=20 时训练 2580 点、测试 20 点：naive 的 train/test 是 0.0585 / 0.0951（gap +0.0366），线性趋势外推是 7.4220 / 0.6735（gap -6.7485）。负 gap 不代表泛化好，是训练段里线性头根本没拟合上。
- 滚动预测 n_init=1200、f=20、step=20 共 70 轮；70 个测试 MSE 的均值 0.6804，最小 0.0075，最大 3.7320。每轮重拟合，标准化统计量也只能从当轮训练段算。
- 面板按「每只股票各切一刀」会得到 13 个不同的训练终点，训练行数从 473 到 1820；正确做法是日期轴切一次，20 只股票共用 2022-06-28 这个训练终点、2023-07-24 这个测试起点，日期违规 0。
- 本集没有训练任何模型：查表、naive、线性头都是协议探针。证据等级：协议与公式 B（书中只有定义），本机数字 A（50 条断言 + 可重跑证据），泄漏检测器 B（本仓自建，正负对照都有）。

## Verification

屏幕上必须出现、且能逐项回到同一次运行的数：

1. 十点切分：n=10、7:1:2 → train 索引 0–6（7 个）、val 7（1 个）、test 8–9（2 个）；0 基索引，不是 1 基。
2. 滚动轮数：n=100、f=5、n_init=60、step=5 → 8 轮；第 8 轮训练区间 [1..95]、测试 96–100（窗口右开，末轮刚好接到序列末端）。
3. 真实数据切分：2600 个交易日（2015-01-05..2025-09-10）→ 1820 / 260 / 520；训练最后一天 2022-06-28，验证第一天 2022-06-29，测试第一天 2023-07-24。
4. 泄漏对照：时间切分 0 条泄漏；随机切分（seed=42）2 条，类型 order/train-val、order/val-test；训练集里 519 个测试点之后的观测。
5. 查表探针：chrono MSE=5.062234230353、shuffle MSE=0.029734124098、比值 170.249986637171。
6. 固定预测：f=20、train 2580 / test 20、测试 2025-08-14..2025-09-10；naive 0.05851481981525 / 0.0951015370496 / gap 0.03658671723435；linear 7.422038029699 / 0.673508705187 / gap -6.748529324512。
7. 滚动预测：70 轮、mean 0.680433157601、min 0.0075351491947、max 3.731959677546、末轮 train_end=2580、test_end=2599。
8. 面板：20 只、49277 行、13 个训练终点、训练行数 473..1820、测试行数 514..520、日期违规 0；中芯国际 2024-02-20 / 473 行，中国石化 2022-06-28 / 1820 行。
9. 测试：50 条全过（TemporalSplit 19、FixedForecast 17、RollingForecast 14），GHC 9.14.1。

看完能自己写出 `chronologicalSplit` 与 `splitLeaks`，并说清固定预测与滚动预测的训练窗口边界。

## Data

- ts-base `data/episodes/67-split-no-leakage/sz000001_2015_2025.csv`：000001.SZ 前复权日线，2674 原始行，截取最近 2600 行用于演示；sha256 33a022ab5906ea72eb2b3b2b6856afd54195f25f1a6f224b33577f7ba9a36640。
- ts-base `data/episodes/67-split-no-leakage/panel_20.csv`：20 只 A 股 2015-01-05..2025-09-10 面板原始 50757 行；用于面板演示的有效行 49277；sha256 ed50451b23d937471a5b7698f81152c3e54029530832c3452826e45d10963cf3。
- ts-base `data/episodes/67-split-no-leakage/summary.json`：切分、泄漏、探针、固定预测、滚动 70 轮误差、面板统计、50 条测试计数的唯一真源。
- ts-base `data/episodes/67-split-no-leakage/panel_counts.csv`：20 行，每只股票的 n / train_end_date / train_rows / test_rows / shared_train_end / matches_shared。
- ts-base `data/episodes/67-split-no-leakage/fixed_reports.csv`、`rolling_errors.csv`：固定预测两行与滚动 70 轮误差。
- ts-base `inventory/evidence/ch8-split.json`：数据 sha256、tsBaseCommit d1a25d93905060fc59aff52d1a19001956c41f26、50 条测试、24 条数据断言，全 PASS。
- 导出脚本：ts-admin `inventory/scripts/export_ch08_split.py`（Lake.daily 前复权，剔除停牌，写 CSV + manifest）。
- data/split.json：由 `build/generate_split_data.py` 读 summary.json + evidence，逐项断言后写出（约 8.7 KB）。
- 书页：p.199–204；8.4.3 划分（p.199）、8.6.1 评估设置（p.202–204）。固定预测与滚动预测的公式在书中只有文字定义，边界与实现按本仓协议写死。

## Algorithms

- ch8-temporal-split → TsBase.Algos.Ch08.TemporalSplit：`Split`（0 基索引三集）、`chronologicalSplit`（floor 比例、余数给 test）、`splitLeaks`（越界/重复/相交/顺序/覆盖）、`leakCount`、`splitSizes`，19 条测试。
- ch8-fixed-forecast → TsBase.Algos.Ch08.FixedForecast：`Model`、`Protocol`、`fixedOrigin`（只拟合一次、测试段不可见）、`naiveModel`、`linearModel`、`trainStats` / `standardizeWith`（统计量只从训练段算），17 条测试。
- ch8-rolling-forecast → TsBase.Algos.Ch08.RollingForecast：`Origin`（左闭右开）、`rollingOrigins`（轮数公式）、`originIsClean`、`rollingReport`（逐轮重拟合），14 条测试。

## 场景（8 场，1364.92 s）

1. **open · 一百七十倍的假象** — 同一只股票、同一段历史、同一个查表模型；时间切分 5.062 与随机切分 0.0297 两条对比条；170.2× 与 519 个未来点；三件事：切分先于模型、日期轴切一次、泄漏要能算。
2. **problem · 一次随机切，误差掉两个数量级** — 2600 个交易日的两行索引带（时间 vs 随机）；左右两栏同分数；泄漏检测器 0 条 vs 2 条、519 个未来点；结论「答案差在顺序」。
3. **definitions · 计数全对，顺序全错** — 三种排列；三条检测规则逐条 PASS/FAIL；查表探针 5.062 / 0.0297 / 170.2×；硬证据 519 点。
4. **intuition · 定义分三层** — 切分公式、固定预测窗口、滚动预测公式三张卡；三条规矩：先切时间、只用训练段、逐轮重算；1200 + 20 × 70 轮。
5. **implementation · 先把索引写死** — n=10 → 0–6 / 7 / 8–9 的索引格；三个真实日期；20 只面板「各切各的」13 个终点 vs 正确做法共用终点；日期违规 0。
6. **verification · 先把边界写成断言** — 三个模块的接口卡与断言行数（19 / 17 / 14）；50 条边界断言（n=0/1/9、f≥n、n_init+f>n、step≤0、空集、单类、正负对照）。
7. **boundary · 每个数都能回到一次运行** — 四组数字（7/1/2、8 轮、1820/260/520、170.2×）；70 轮误差曲线；固定预测 naive/linear 表；50 条断言与面板违规 0。
8. **outro · 七个边界，一把尺子** — 证据等级、数据范围、价格口径、模型范围、探针定义、固定预测、面板；隐藏边界「滚动轮数依赖初始长度」；结尾「机制可复现，数字可复算；结论不外推」。

## Claims

| 陈述 | 等级 | 依据 |
| --- | --- | --- |
| 7:1:2 的 floor 划分与 max(train)<min(val)<min(test) | B | 书中 p.199 文字定义；实现与 19 条测试在本仓 |
| 随机 shuffle 会让未来进入训练集 | A | TemporalSplit + summary.json：519 个未来点、2 条泄漏 |
| 同一查表探针 5.0622 → 0.0297，170.25× | A | summary.json leak_probe + 证据 JSON 断言 |
| 固定预测 f=20：naive 0.0585/0.0951、linear 7.4220/0.6735 | A | FixedForecast + fixed_reports.csv |
| 滚动 70 轮：mean 0.6804、min 0.0075、max 3.7320 | A | RollingForecast + rolling_errors.csv |
| 面板各自切分产生 13 个训练终点、行数 473..1820 | A | panel_counts.csv + 证据 JSON 断言 |
| 日期轴共用切分后违规 0 | A | panel_counts.csv + summary.json |
| 50 条测试全过（19+17+14） | A | cabal test + evidence JSON |
| 泄漏检测器本身 | B | 本仓自建；有正例、反例、边界，但书中无此工具 |
| 「切分先于模型」「结论不外推」 | 本集判断 | 基于协议与数据的编辑归纳，不冒充原文 |

## Evidence

- 生成器：`build/generate_split_data.py`（读 ts-base summary/evidence，断言 2600/1820/260/520、0 vs 2、519、170.25、70 轮、20 只、50 条测试后写 data/split.json）。
- 数据：ts-admin `inventory/scripts/export_ch08_split.py` → ts-base `data/episodes/67-split-no-leakage/`。
- 证据 JSON：ts-base `inventory/evidence/ch8-split.json`（24 条 checks 全 PASS）。
- 测试：`cabal test` 50 条全过；`cabal build all` 零 warning。

## Delivery

- 渲染与响度数据待 make 后回填。
