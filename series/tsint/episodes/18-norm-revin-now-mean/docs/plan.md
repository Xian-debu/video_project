# 18-norm-revin-now-mean - 归一化三兄弟：RevIN、NowNorm、MeanNorm

> status: produced | chapter: ch03 | runtime 840.9 s | algorithms: 3 | evidence: 28 checks / 0 failures

## Thesis

第 3 章第 45–46 页把三种归一化并排摆出来，每种只有一句文字：RevIN「在实例归一化的基础上，引入具有参数的仿射变换」、NLinear「减去最后一个值」、SparseTSF「减去均值」。**三种都没有公式、没有 eps、没有统计窗定义**（errata **E33**），表 3.1 又只给「归一化方式」一列，读者拿不到任何可断言的东西。

本集把这三句话补成可运行的代码，再用同一根线性骨干把它们的差别量出来。

第一，**三个归一化都是「减一个基线 → 预测 → 加回来」**，区别只在基线怎么取：RevIN 取窗口均值再除标准差（带可选仿射），NowNorm 取最后一个值，MeanNorm 只减窗口均值、不除。三者都能写成 `x̂ = f(x − base) + base`，于是平移不变性、往返恒等、常数窗不产生 NaN 都成了可断言的性质：合成断言里往返误差 **0**、平移误差 **0**、常数窗 [5×7] 输出全 0、NowNorm 手算 (1−3)·1+3 = **1**（brief 写的 4 是笔误，登记 **A39**）。

第二，**选哪个归一化，取决于窗口内有没有漂移，而不是谁更先进**。合成序列 x_t = 100 + 0.05t + 5 sin(2πt/48) + N(0,1)（1600 点，LCG seed 12345），线性骨干 H = 48、F = 24、共享权重 1,176 参数、Adam lr 5e−3、40 轮：带漂移时 24 步 MAE NowNorm **0.9731** < RevIN **2.0530** < MeanNorm **2.0931**，减末值比减均值好 **2.15 倍**；把 0.05t 去掉后反过来 MeanNorm **0.5215** < NowNorm **1.0045**，减均值好 **1.93 倍**。

第三，**量纲是真实的工程问题**。同一个 panel 里茅台均价 5,595.8 元、工行均价 8.5 元，量纲比 **658.67 倍**。不归一化时同一个线性骨干在两只票上的 MAE 是 963.93 与 0.9538——差的不是模型，是价格单位；上了 RevIN 之后两者被压到 481.94 与 0.3625，读数才可比。上证指数上 24 步 MAE NowNorm **76.55** < RevIN **82.25** < MeanNorm **84.88**（指数点），NowNorm 比 MeanNorm 低 9.8%。

一句话进画面：**归一化不是预处理，是把「基准」这件事写进模型。**

## Verification

屏幕必须出现、且与 `inventory/evidence/ch3-norm-revin-now-mean/ch3-norm-revin-now-mean.json` 一致（28 条检查全过：数据 4 / 结构 4 / 行为 20）：

- RevIN：归一化后均值 **0**、方差 **1**（eps = 0 时逐位）；往返误差普通与带仿射 (2,1) 都是 **0**（<1e−12）；常数窗 [5,5,5,5,5,5,5] 输出全 0、反变换误差 **0**；eps = 1e−5 写死在 `defaultNormCfg`。
- NowNorm：末值定位（x_T = 3 时线性层取到 3、x_T = 0 退化为纯线性）；手算 (1−3)·1+3 = **1**；平移不变误差 **0**。
- MeanNorm：单位层还原误差 **0**、常数序列 [7,7,7,7] 精确 **7**、平移误差 **0**；与 z-score 的逐点最大差 **2.2247356859**（只减不除的分水岭）。
- 真实 panel：3,867 行（2010-01-04..2025-12-31），四列有限正数，指数收在 (1000,6000)，量纲比 **658.6654226357**；茅台/工行 MAE 963.93 / 0.9538 → RevIN 后 481.94 / 0.3625；指数 24 步 MAE 76.55 / 82.25 / 84.88。
- 合成对照：漂移版 NowNorm 0.9731 vs MeanNorm 2.0931（2.15×）、平稳版 0.5215 vs 1.0045（1.93×）；RevIN 两版都在 2.05 附近，说明它压的是尺度、不是水平。
- 测试基线：全仓 67 组 965 条断言（本集 +8 revin / +6 nownorm / +6 meannorm = 20 条）。

## Data

- `data/episodes/18-norm-revin-now-mean/panel_daily.csv`：600519 / 601398 / 000001.SH / 成交量四列日线 3,867 行（2010-01-04..2025-12-31），204,666 B；导出于 ts-admin `inventory/scripts/export_ch03_norm.py`（ts-admin `f6902e9`）。
- 证据产物：`norm_mae.csv`（14 行）、`norm_curves.csv`（144 行 = 6 条曲线 × 24 步）；证据提交 ts-base `5d617cc`。
- 画面用的 `data/norm.json` 由 `build/generate_norm_data.py` 从证据产物重建（不跟踪，derived），23,440 B：dates/maotai/index 各 430 点、synthetic 400 点、6 条曲线各 24 点。

## Algorithms

- ch3-revin — 可逆实例归一化（`TsBase.Algos.Ch03.Revin`）：`revin` 统计窗只取输入 H 段，`scale = sqrt(sigma² + eps)`，eps = 1e−5；`revinInv` 先反仿射再反缩放，gamma = 0 时保底不产生 Inf。与 ch02 的 `sigma + eps` 形式不同，不能混用（A38）。
- ch3-now-norm — 末值平移（`TsBase.Algos.Ch03.NowNorm`）：`nowNorm lin x = lin (x − x_T) + x_T`，`lastBase` 空窗返回 0；brief 的手算 4 按 (1−3)·1+3 应为 1（A39）。
- ch3-mean-norm — 均值平移（`TsBase.Algos.Ch03.MeanNorm`）：`meanNorm lin x = lin (x − mean x) + mean x`，`meanBase = windowMean`；与 z-score 的差别逐点最大 2.2247（A40）。
- 选择规则与演示口径（H/F、Adam、seed、验证窗）全部写死在 `app/Ch03NormEvidence.hs`，读数登记 A41。

合计 20 条断言（8 / 6 / 6），全仓 67 组 965 条。书中三处只有文字的部分登记 `E33`，口径与 plan-vs-code 偏差登记 `A38`–`A41`。

## Boundaries

一只票一段历史：658.67× 是 600519 与 601398 这十六年的均价之比，不是「高价股一定比低价股难」的定律；它只说明同一个未归一化的层对价格单位敏感。合成对照里的 2.15× / 1.93× 是 1,600 点、单一漂移强度、单一骨干的读数，换漂移强度或换模型会变——本集只主张「漂移决定减谁」，不主张倍数。RevIN 的仿射默认关闭，p.45 没给 gamma/beta 的来源与初值，开启后的行为只在合成断言里验证过。MeanNorm 只减不除，遇到方差不齐的窗口它不处理尺度，这是设计而非缺陷。三种归一化都只在输入 H 段上统计，推理时不可用输出段，这条限制写进代码注释但不做运行时校验。
