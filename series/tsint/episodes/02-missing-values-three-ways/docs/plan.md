# 02-missing-values-three-ways - 缺失值三法：谁在偷偷改变你的方差

> status: ready — rendered 1105.0 s (18:25), −15 LUFS / TP −2 dBFS
> chapter: ch02 | runtime target: 19 min | algorithms: 3

## Thesis

三种填充里只有均值填充能写出精确的方差损失公式——填充后总体方差恰好等于 (1−p)·观测方差（p 为缺失比例）；LOCF 的方差损失不取决于缺失比例，而取决于缺口落在序列的哪个位置；线性插值误差最小，但它假设价格沿直线穿过缺口。所谓「无害的补洞」是伪命题：每一种填法都在改写序列的方差、零收益比例与误差分布。

## 核心判断

1. 均值填充的方差恒等式是精确的，不是近似。观测点占 1−p、常数占 p，常数与观测无关，交叉项为零，于是 Var(填充后) = (1−p)·Var(原序列)。实测 p=5% 时 3.983551e-4 → 3.784135e-4，p=20% 时 3.946651e-4 → 3.157050e-4，与 (1−p)×原方差逐位相同（相对误差 0.0）。中位数填充不是线性算子，没有恒等式，只有接近（p=5% 实测 3.784532e-4），这个差别在边界里明说。
2. 三种填法的价格误差差两个数量级，收益率误差的排名却会翻转。5% 遮挡下价格 MAE：线性 4.53 元、LOCF 6.82 元、均值 521.63 元（全序列均价 495.16 元，远超这段 57 元行情）；换到收益率口径：均值 0.0147、线性 0.0185、LOCF 0.0213。口径不同，排名不同——这是本集最重要的方法论提醒，不是自相矛盾。
3. LOCF 的代价可以逐条量出来：5% 单点遮挡把零收益从 35 个推到 324 个（+289），把 292 个缺口压成 292 段平台、最大跳跃 12.7%；同样的 292 个点改成连续双点遮挡，平台数减半到 146，level MAE 从 6.82 元升到 8.14 元、最大跳跃 14.8%，而零收益仍是 324 个。方差损失取决于缺口长度，不取决于缺失比例。
4. 停牌不是缺失值，是「没有交易」。sz000693 从 2001-01-02 到 2019-07-08 只有 1,996 行，中间 2007-04-27 → 2014-01-10 有 2,450 天完全没有行；按行号对齐会把这段六年断档压成相邻两行，一个跨六年的收益被算成一天——这是全片标红的最危险错误。本集一律按日期对齐，缺失只发生在序列内部，首尾各留一个观测。
5. 遮挡实验是人为的，真实缺失机制可能非随机。5%/20% 的随机遮挡只提供可复现的压力测试；结论只在三种填法、这一组数据、这一套指标之间成立。价格口径的误差依赖价格水平：20% 遮挡分五段看，2001–2006 段线性 MAE 0.08 元，2021–2025 段 13.08 元——方法没变，价格变了。

## Verification

屏幕上必须出现：

1. 三只股票的行数与断档：sh600519 5,834 行、sz000001 5,902 行、sz000693 1,996 行（2,450 天缺口，2007-04-27 → 2014-01-10，6 段交易日）。
2. 序列、窗口、遮挡三组数：5,833 个日收益；32 日收益/窗口、逐日滑 1 步；5% 遮挡 292 个点、20% 遮挡 1,167 个点（实际比例 5.006% / 20.007%）。
3. 方差恒等式两边：p=5% 3.983551e-4 → 3.784135e-4，p=20% 3.946651e-4 → 3.157050e-4，相对误差两项均为 0.0；中位数填充 3.784532e-4（接近，但没有恒等式）。
4. LOCF 代价 5 个数：零收益 35 → 324（+289）、平台 292 段、最大跳跃 12.7%、level MAE 6.82 元、收益率方差 3.953437e-4；连续双点：平台 146 段、8.14 元、14.8%、4.012129e-4、零收益仍 324。
5. 价格 MAE 与收益率 MAE 双口径：4.53 / 6.82 / 521.63 元，对 0.0185 / 0.0213 / 0.0147；并明确写出「排名翻转是口径差异」。
6. 20% 遮挡按价格五等分的分段表（遮 228/237/232/235/234 个点，线性 0.080/0.927/1.278/7.973/13.084 元）。
7. golden 小例：1, NaN, NaN, 4 → LOCF 1,1,1,4；线性 1,2,3,4；均值=中位=2.5；LOFC 首端缺失拒绝、locfForward 可跳过。
8. 证据：49 条检查全过、总套件 367、输入 sha256 = 45ba1824e489…、证据运行 2026-10-30T11:27:19Z、ts-base 0b5175f；复现命令一行。

看完能自己用一张带缺口的 CSV 跑出三种填充、复算方差恒等式，并解释为什么「更准」要看你想保住哪个统计量。

## Data

- ts-admin 只读导出（`inventory/scripts/export_ch02_missing.py`，qfq，剔停牌与 close<=0，CSV 六位小数）：
  - `sh600519.csv` 5,834 行，2001-08-27 → 2025-12-31，最大自然日间隔 53 天（2006-04-17），125,953 B，sha256 45ba1824…
  - `sz000001.csv` 5,902 行，2001-01-02 → 2025-12-31，最大间隔 65 天（2010-09-02），118,889 B，sha256 5c7d6301…
  - `sz000693.csv` 1,996 行，2001-01-02 → 2019-07-08，最大间隔 2,450 天（2014-01-10），35,031 B，sha256 2fff9621…
  - 合计 279,873 B；manifest 记录 rows/first/last/max_gap_days/max_gap_at/bytes/sha256。
- ts-base 证据运行（`data/episodes/02-missing-values-three-ways/`）：summary.json、impute_preview.csv、gap_layout.csv、mae.csv；证据 `inventory/evidence/ch2-{locf,statimp,lininterp}/20261030T112719-*.json`（49 条检查，含输入 sha256 与命令）。
- 画面数字全部由 `build/generate_impute_data.py` 从上述 CSV 与 summary.json 重算并交叉断言（金标、MAE、方差、LOCF 平台、分段、停牌段），任何不一致直接失败；LCG 用 wrap64 复刻 Haskell 的 64 位回绕，seed=42。

## Algorithms

- ch2-locf - 末值填充（LOCF / LOCF-Forward）(TsBase.Algos.Ch02.Locf)，22 条断言
  - `locf :: V.Vector (Maybe Double) -> Either LocfError (V.Vector Double, V.Vector Bool)`：一次前向扫描，携带最近观测；首端缺失或整段无观测 → Left；值向量 + 掩码（True 表示填出来的）。
  - `locfForward`：跳过首端缺失，其余相同（价格口径的误差用它）；`imputedCount :: V.Vector Bool -> Int`。
- ch2-statimp - 统计量填充（均值/中位数）(TsBase.Algos.Ch02.StatImp)，11 条断言
  - `statimp :: Stat -> V.Vector (Maybe Double) -> Either StatImpError (V.Vector Double, V.Vector Bool)`；`data Stat = Mean | Median`。
  - 均值用 Kahan 补偿求和（一万个点的用例）；中位数排序后取中，偶数取中间两个平均。
  - `popVar` / `populationVariance :: V.Vector Double -> Double`：总体方差（除 T，ddof=0）——这一集要的是「这段窗口」的描述统计，不是总体无偏估计。
- ch2-lininterp - 线性插值填充 (TsBase.Algos.Ch02.LinInterp)，16 条断言
  - `lininterp :: (Double, Double) -> Int -> Either LinInterpError [Double]`：等距坐标；`lininterpAxis :: V.Vector Double -> V.Vector (Maybe Double) -> Either LinInterpError …`：按日期比例，不规则间隔也对。
  - 前缀扫描记左邻下标、后缀扫描记右邻；首尾必须有观测，否则 Left。

## 场景

- open · 断了六年的序列，怎么补 — 三只股票行数、2,450 天缺口时间轴、按行号 vs 按日期的对齐、5,833/292/4.53 三个先导数字。
- problem · 删除比填补更贵 — 删行=删尾部（停牌常发生在坏消息之后）、方差随 p 缩（3.98e-4/3.78e-4/3.16e-4）、遮挡网格只挖内部孔。
- definitions · 值向量加一个掩码 — 三个模块签名、掩码示意（1,?,?,4 → 1,1,1,4 / 1,2,3,4）、方差恒等式。
- intuition · 一段上涨，三种填空 — 2009 窗口 91 点遮 9 点（57.43 → 61.26）：线性贴趋势、LOCF 阶梯、均值是 495.16 元全序列均价（图外标注）；再看 20% 遮挡与六年断档。
- implementation · 三个模块，不到三百行 — Locf 一次扫描、StatImp Kahan+排序、LinInterp 前后缀；纯函数四条；49 条检查 / 367 总测试。
- verification · 五张证据 — golden 小例、方差恒等式与实测、LOCF 代价、价格 vs 收益率 MAE 双口径、20% 遮挡分段表 + 证据卡。
- boundary · 七条不能说的话 — 均值只适合平稳段、LOCF 压方差也造零收益、线性假设直线、价格口径依赖价格水平、停牌不是缺失、遮挡是人为的、20% 只是压力测试。
- outro · 三个数，一个判据 — 5,833 / 292 / 4.53 对 521.63；下一集 SMA/WMA/SES。

## Claims

| 陈述 | 等级 | 依据 |
| --- | --- | --- |
| 均值填充后方差 = (1−p)·原方差 是恒等式 | A | 本仓推导 + 证据 variance（相对误差 0.0） |
| 三种填充在 5% 遮挡下的价格 MAE 4.53 / 6.82 / 521.63 元 | A | 证据 mae_price；summary.json |
| 收益率口径 0.0147 / 0.0185 / 0.0213，排名与价格口径不同 | A | 证据 mae_returns |
| LOCF 零收益 35 → 324、平台 292→146、最大跳跃 12.7%→14.8% | A | 证据 locf.single/doublet |
| sz000693 1,996 行、2,450 天无数据 | A | ts-admin manifest；summary.json suspension |
| 三只股票共 13732 行 / 279,873 B | A | manifest 三条相加 |
| 总体方差（ddof=0）是描述当前窗口，不是总体无偏估计 | A | 书中无公式；本仓 SELF-AUTH A12/A13 |
| 「20% 遮挡是压力测试，不代表真实缺失率」 | A | 实验设计；边界明说 |
| 中位数填充「接近」恒等式但没有恒等式 | A | 实测 3.784532e-4 vs 预测 3.784135e-4 |

## Evidence

- ts-admin 导出：`da0e0c0` feat(export): add ch02 missing-value dumps for ep02
- ts-base 数据：`164e440` data(ch02): add ep02 missing-value dumps and imputation measurements
- ts-base 代码+证据：`0b5175f` chore(ch02): add ep02 impute evidence generator and run（含三模块与 49 条检查；tsBaseCommit 0b5175f，tsAdminHead da0e0c0，runAt 2026-10-30T11:27:19Z）
- 复现：`cabal run -v0 tsbase -- evidence-ch02-impute --data data/episodes/02-missing-values-three-ways --out data/episodes/02-missing-values-three-ways --evidence inventory/evidence`
- 测试：`docker exec haskell-ts bash -lc 'export PATH=/opt/ghc/9.14.1/bin:$PATH; cd /work && cabal test'`（37 个新断言，总套件 367）
