# E04 · Holt 家族：趋势和季节，各一个旋钮

status: production
series: tsint · ch02 · episode 04
book: 《AI for Trading》第 2 章，印刷 p.22–23（PDF p.30–31）

## 这一集要讲清的一件事

一次指数平滑只有一个状态——“现在大概在什么水平”，所以它的预测永远是一条水平线。Holt 给模型加了第二个状态：趋势 b；Holt-Winters 再加第三层：季节 p。这一集的判断是：**加法与乘法的差别不是季节形状好不好看，而是误差的度量**。乘法模型把季节幅度写成水平的百分比，代价是递推里出现除法：任何 0 或负值都会让式 (2.27)–(2.33) 当场爆掉。A 股成交量里有大量 0（4,487 行里 2,491 个 0，最长连零 1,628 天），所以“乘法模型加保护分支”不是一个可选的工程细节，而是这一集的主结论。

## 五条核心判断

1. **二次平滑只多了一个状态：趋势。** s_t = αx_t + (1−α)(s_{t−1}+b_{t−1})，b_t = β(s_t−s_{t−1}) + (1−β)b_{t−1}，预测 ŷ_{t+h} = s_t + h·b_t。SES 的 h 步预测是常数 s，Holt 的预测是一条斜线；能“走出去”的只有 b。
2. **初值是递推的边界条件，不是细节。** s0 取前 L 点均值，b0 取前几个一阶差分的均值（式 2.19/2.20）；b0 给错，前几十步全错，之后才慢慢被数据拉回来。测试把 b0 缺失、n=2、以及两种更新顺序的差异都钉住。
3. **加法与乘法的分界是除法。** 乘法把季节写成百分比：p_t = γ·x_t/(s_{t−1}+b_{t−1}) + (1−γ)p_{t−L}。x_t=0 时这一项是 0，看起来“没事”；但 p 会被拉向 0，下一步 s 里的 x/p 就直接除零。我们的实现入口检查所有 x>0，递推中 p_{t−L} 与 s+b 也必须 >0，否则返回 `HWNonPositive 下标 值`，绝不产出 NaN/Inf。
4. **趋势对一步误差可能是负担。** 600519 日线 730 行上，Holt(α=0.2, β=0.1) 的一步 SSE 是 1,636,445.61，同 α 的 SES 是 1,610,218.96——趋势让一步误差变差 1.63%。这不是 bug：一步预测里 b 只是把上一刻的斜率带进来，噪声大的时候它是负资产。趋势的价值在 h>1 的外推，这一集把两件事分开说。
5. **日内周期要按整日对齐，形状在成交量不在价格。** 5 分钟线只保留每天恰好 48 根的日子（68 天 × 48 = 3,264 根）；按当日 48 根均值归一成“份额”后，09:35 是 4.262、11:30 是 0.664、15:00 是 1.373，HW 拟合季节与实测轮廓相关系数 0.98085。价格在日内没有 U 形——拿价格做 L=48 只会拟合噪声。

## 与书的关系

- 式 (2.17)(2.18) Holt 递推、(2.19)(2.20) 初始化、(2.21)–(2.26) 加法 HW、(2.27)–(2.33) 乘法 HW，全部来自书。
- **书中没有**：周期归一化、把“至少 2L 点”写成显式错误、以及用成交量份额做日内季节。片中凡是这三层，都标注“本仓选择 / 本仓推导”，并记入 SELF-AUTH A15 与 A16。

## Verification（八条）

1. 手算 Holt：α=β=0.5、s0=10、b0=1、x=[10,20,11] → s=[10.5,15.75,13.28125]、b=[0.75,3.0,1.296875]、ŷ4=14.578125。
2. 黄金样例：加法 HW（L=2、α=β=γ=0.5、normalize=False）四步状态逐位等于手算；乘法 HW（p0=[2/3,4/3]）同样逐位手算。
3. 24 条证据检查全过：4 manual / 6 hw / 14 data（`checks.total=24, failed=0`）。
4. 退化：γ=0 的加法 HW 与 Holt 逐位相等；β=0 的趋势冻结；乘法输入含 0 → `HWNonPositive 23 0.0`（不是 NaN）。
5. 日线对比：Holt SSE 1,636,445.61 vs SES 1,610,218.96，improve −1.63%；末态 s=1832.206726、b=3.222912。
6. 季节：L=5 SSE 1,214,985.42、amp 11.81；L=252 SSE 15,853,001.34、amp 754.59；乘法 L=5 SSE 1,217,551.79。
7. 零成交量序列：加法 SSE 7.337489755009e16；乘法错误码 index=23。
8. 日内：3,264 根 / 68 天；份额 4.262 / 0.664 / 1.373；拟合季节 corr 0.98085；全样本零成交量 0/3,264。

## 数据

- 日线 `sh600519_daily.csv`：730 行，2019-01-02..2021-12-31，16,439 B，sha256 e104a2fa28b2…，min 492.078668、max 2227.150235、mean 1254.245217419178。
- 五分钟线 `sh600519_5min.csv`：3,264 行 = 68 个完整交易日 × 48 根，2026-05-27 09:35..2026-08-31 15:00，111,123 B，sha256 7e5e1c55e9a9…，列 `bar_time,close,volume`。
- 成交量 `sz000693_volume.csv`：4,487 行，2001-01-02..2019-07-08，69,756 B，sha256 5f7a2a860ea5…，零成交量 2,491 行（55.52%），最长连零 1,628 行，首个零在第 23 行（停牌按 0 记，manifest 标 zero_filled）。
- 合计 197,318 B；导出脚本 ts-admin `inventory/scripts/export_ch04_holt.py`，只读 Lake、前复权、剔停牌；只保留每天恰好 48 根的完整交易日。
- 派生：pack `build/generate_holt_data.py` 只读 ts-base 证据（summary.json、fitted_daily.csv、season_intraday48.csv）产出 `data/holt.json`（约 70 KB，不入库）。

## Algorithms

- `TsBase.Algos.Ch02.Holt`：`holt :: HoltParams -> V.Vector Double -> Either HoltError HoltFit`；`HoltFit { hfLevel, hfTrend, hfFitted }`；`holtAuto`、`holtForecast :: Int -> HoltFit -> V.Vector Double`；`HoltError` = HoltBadAlpha | HoltBadBeta | HoltBadInitN | HoltTooShort | HoltMissingInit。
- `TsBase.Algos.Ch02.HoltWinters`：`holtWinters :: HWParams -> V.Vector Double -> Either HWError HWFit`；`HWParams` 携带 alpha/beta/gamma/L/模型/初值/normalize；`HWFit { hwfLevel, hwfTrend, hwfSeason, hwfFitted }`；`hwForecast`、`hwSse`、`hwGridSearch`；`HWError` 含 HWBadAlpha/Beta/Gamma、HWBadSeason、HWTooShort、HWNonPositive Int Double、HWBadInit。
- 断言：Holt 14 / HoltWinters 19 = 新增 33，总套件 441（32 suites）。跑法见 Evidence。
- 证据生成器 `app/Ch04HoltEvidence.hs`，命令 `evidence-ch04-holt`。

## 八场

| # | 场 | 目标 | 页 |
|---|----|------|----|
| 01 | 开场 | 水平/趋势两个状态；三个数 13.28125 / 1.296875 / 14.578125；家族三代 | 5 |
| 02 | 问题 | SES 预测是水平线；趋势才走得出去；乘法的除法与 0 | 4 |
| 03 | 定义 | 式 2.17–2.33：Holt 两行、加法三行、乘法三行；初始化与 2L | 4 |
| 04 | 直觉 | 三个旋钮各管什么；s+b 与误差；季节形状与放大；0 的路径 | 4 |
| 05 | 实现 | 两模块；保护分支；33 条断言 | 3 |
| 06 | 验证 | 手算状态；日线 −1.63%；L5/L252；错误码；日内份额 | 5 |
| 07 | 边界 | 五条 + “0 不是缺失，是信息” | 2 |
| 08 | 收尾 | 三数 + 平稳化预告 | 2 |

## Claims（画面逐条可追）

| 画面 | 数值 | 断言/证据 |
|------|------|-----------|
| 手算状态 | s3 13.28125 / b3 1.296875 / ŷ4 14.578125 | holt.manual.level / trend / forecast；HoltSpec |
| 日线对比 | 1,636,445.61 vs 1,610,218.96（−1.63%） | holt.daily.sse / sse_ses_same_alpha / improve_vs_ses |
| 末态 | s=1832.206726、b=3.222912 | holt.daily.last_level / last_trend |
| 加法 L5 | SSE 1,214,985.42、amp 11.81 | holtwinters.add_daily5 |
| 加法 L252 | SSE 15,853,001.34、amp 754.59 | holtwinters.add_daily252 |
| 乘法 L5 | SSE 1,217,551.79 | holtwinters.mul_daily5 |
| 零成交量 | 加法 7.337489755009e16；乘法 HWNonPositive 23 0.0 | holtwinters.zero_volume |
| 日内份额 | 4.262 / 0.664 / 1.373 | data.intraday + add_intraday48.empirical |
| 季节拟合 | corr 0.98085、amp 3.989 | add_intraday48.season_corr / season_amp |
| 数据 | 730 行 / 3,264 根 / 4,487 行 | manifest / summary.json |

## Evidence

- ts-admin `776f57e` export_ch04_holt.py（A10 口径：只读导出 + manifest）。
- ts-base `19afbda` algos + 测试；`67d72d3` 证据生成器；`65b3cab` 数据与证据输出 `inventory/evidence/ch2-{holt,holtwinters}/20261030T134454-*.json`。
- 证据运行命令：
  ```
  docker exec haskell-ts bash -lc 'export PATH=/opt/ghc/9.14.1/bin:$PATH; cd /work && cabal build all && cabal run -v0 tsbase -- evidence-ch04-holt --data data/episodes/04-holt-and-holt-winters --out data/episodes/04-holt-and-holt-winters --evidence inventory/evidence'
  ```
- 测试：
  ```
  docker exec haskell-ts bash -lc 'export PATH=/opt/ghc/9.14.1/bin:$PATH; cd /work && cabal test'
  ```
