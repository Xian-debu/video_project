# 17-win-metrics-valselect - 滑窗、指标与选模：先把「分数」这件事做对

> status: produced | chapter: ch03 | runtime 837.2 s | algorithms: 3 | evidence: 24 checks / 0 failures

## Thesis

第 3 章开头四页（printed p.41–44）给了一条预测流水线需要的全部零件，每个零件都只写了一半。

式(3.1) 是预测映射 `X̂ = f_θ(X)`，**不是滑窗样本的定义**——样本是 p.43 的行内公式 `X_i^train = (x_{t−H+1}, …, x_t, x_{t+1}, …, x_{t+F})`。brief 与 series.json 把式(3.1) 记成滑窗公式，属误标（errata **E30**）。窗口数书里没写；唯一出现计数的窗口表（s = 5）写的 176 是漏了 +1，按 `(T − H − F) div s + 1` 应为 177（**E31**）。p.43「T^train 是整个测试集的样本数量」按上下文与下标只能读成训练集（**E32**）。切分只给 6:2:2 的比例，没给 gap，也没说按时间切。

指标四件套（式(3.5)–(3.8)）看起来只是四个公式，本集用它做两件事。

第一，**MAE 与 MAPE 在真实数据上给出相反的结论**。同一份 600519 后复权日线（3,880 个交易日，2010-01-04..2025-12-31），同一个 persist 基线，低价值段 1,411 个窗口 MAE 47.33、MAPE 5.05%；高价值段 1,579 个窗口 MAE 470.37、MAPE 4.24%。**MAE 差 9.94 倍，MAPE 只差 0.84 倍**——按 MAE 看高价值段糟得多，按 MAPE 看它反而更好。指标不是「同一件事的四种写法」，是四把不同的尺子。

第二，**MAPE 碰到真实零值没有答案**。式(3.7) 只分母除，书里一句「但真实值为零时失效」就过去了。同一个数组 `actual = [0, 1, 2]`、`pred = [1, 1, 1]`，三种写法给出三个答案：照式子直除 `Inf`、跳过零值 25.0%（count 2/3）、加 eps = 1e−8 得 3.33e9。三个都不是「正确值」，是三种不同的口径，必须报计数。

剩下的配角也得写死：滑窗 3,761 个样本（训练 2,209 / 验证 657 / 测试 609，两个边界各丢 gap = 24 帧，**零泄漏**）；训练书里只有式(3.4) 一行 `θ* = arg min_θ L_val(θ)`，没有优化器、没有学习率、没有早停——本集给 Adam(1e−3)、batch 32、最多 200 轮、patience 10、min_delta 1e−6，并断言早停回到第 7 轮的最优权重；梯度检查用中心差分，相对误差 1.41e−11。

一句话进画面：**先让「分数」本身可复现，再谈模型好不好。**

## Verification

屏幕必须出现、且与 `inventory/evidence/ch3-win-metrics-valselect/ch3-win-metrics-valselect.json` 一致（24 条检查全过：数据 4 / 结构 4 / 行为 16）：

- 滑窗：`[1..10]`、H = 3、F = 2 得 6 个黄金窗口；T = 1000、H = 96、F = 24 时 s = 1 → 881、s = 5 → 177；计数公式 `(T − off − H − F) div s + 1`；覆盖不变量（每个可预测时刻恰好一次）；stride 大于 1 时窗口起点等差。
- 切分：T = 3,880 → 3,761 个窗口，训练 2,209 / 验证 657 / 测试 609；`splitRanges = [[0,2328],[2352,776],[3152,728]]`；两个边界各丢 24 帧，`noLeak = true`。
- 指标算术：x = [2,4,6]、p = [3,4,5] → MAE `0.666667`、MSE `0.666667`、RMSE `0.816497`、MAPE `22.2222%`；恒等预测四项全 0；MAPE 尺度不变；长度不一致返回 `Left (MetricsLengthMismatch …)`。
- 零值三答案：`Inf` / `25.0%`（count 2/3）/ `3.33e9`（eps = 1e−8），三者都进画面并标注口径。
- 真实数据两段：低价值段（均值 937.01）MAE `47.3317`、RMSE 65.6238、MAPE `5.0452`；高价值段（均值 11,061.57）MAE `470.3713`、RMSE 677.7072、MAPE `4.2431`；比值 `9.9378` 与 `0.841`。视野 1→24 的 MAE 曲线：低段 13.92→71.38、高段 135.04→683.12。
- 排序翻转：同一组合成序列（n = 400）加常数 5 与乘 1.02 两个候选——MAE 选 add5（`5.0000` vs `10.1206`），MAPE 选 mul1.02（`25.2305%` 对 `2.0000%`）；验证集上 `25.2464%` / `2.0000%`，排序不变。
- 训练：θ² + 3θ + 1 在 1.5 的梯度 `6`；线性层 (H = 8, F = 4) 中心差分相对误差 `1.4126803893e-11`（门 1e−6）；固定 seed 三个学习率可复跑且排序稳定；早停第 `7` 轮、回到最优权重；端到端演示 21 轮、最优在第 `16` 轮、参数 36 个。
- 测试基线：全仓 64 组 945 条断言（本集 +10 window / +12 metrics / +6 trainloss = 28 条）。

## Data

- `data/episodes/17-win-metrics-valselect/maotai_hfq.csv`：600519 后复权日线 3,880 行（2010-01-04..2025-12-31），88,816 B，max_gap 11 天（2020-02-03）；收盘价区间 515.429..17,080.588。导出于 ts-admin `inventory/scripts/export_ch03_win_metrics.py`（ts-admin `5e63b2f`）。
- 证据产物：`summary.json`、`era_metrics.csv`、`horizon_metrics.csv`（72 行 = 三段 × 24 视野）、`train_history.csv`（21 轮）、`forecast_metrics.csv`。
- 画面用的 `data/win.json` 由 `build/generate_win_data.py` 从证据产物重建（不跟踪，derived）。

## Algorithms

- ch3-window — 滑窗样本与时间序切分（`TsBase.Algos.Ch03.Window`）：`windowCount`、`windows`（H、F、stride、offset）、`chronoSplit`（6:2:2、两边界各丢 gap）。brief 写第 4 参是 gap，但 gap 属于切分边界、不属于扫描，故实现为 offset，gap 交给 `chronoSplit`（plan-vs-code 偏差，SELF-AUTH A35）。
- ch3-metrics — 点预测四指标（`TsBase.Algos.Ch03.Metrics`）：`metricsWith MapeRaw | MapeSkip | MapeEps ε`，默认照书写法（零值 → `Infinity`），另两种显式可选；RMSE 由 MSE 开方；`perHorizon` 按样本主序取 stride（A36）。
- ch3-train-loss — 训练损失、中心差分与验证集选模（`TsBase.Algos.Ch03.TrainLoss`）：MSE / MAE 损失、`gradientOfParams`（MSE 系数 2/(F·N)、MAE 系数 sign/(F·N)）、Adam(β 0.9/0.999、eps 1e−8、bias correction、LCG 固定 seed)、`earlyStop` 恢复最优、`valSelect`（分数升序、同分标签字典序）（A37）。

合计 28 条断言（10 / 12 / 6），全仓 64 组 945 条。口径与书中未给项全部登记在 SELF-AUTH `A35`–`A37`；书中三处笔误登记为 errata `E30`–`E32`。

## Boundaries

只有一只票、一段行情：MAE 与 MAPE 的 9.94× / 0.84× 是这只票这段历史的读数，不是「MAE 一定偏高价段」的定律——它量的是绝对误差与价格水平的相关性。基线是零参数的 persist（`X̂_{t+1..t+F} = x_t`），任何真模型都该显著更好，本集不比较模型。`windowCount` 的边界只处理 T 太短的一种返回 0，不校验 stride ≤ 0。MAPE 的三种口径给出三个数，本集只负责把口径报清楚，不裁定哪个「对」。训练演示是 36 参数的小线性层，Adam 与早停的行为在更大模型上会变。3,880 行日线跨十六年，含三次以上制度变化，切分按时间但不按制度分层。
