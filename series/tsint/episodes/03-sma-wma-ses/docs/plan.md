# E03 · 滑动平均与一次指数平滑：N 和 α 是同一把尺子的两种刻度

status: ready — rendered 1299.9 s (21:40), −15 LUFS / TP −2 dBFS
series: tsint · ch02 · episode 03
book: 《AI for Trading》第 2 章，印刷 p.21–22（PDF p.29–30）

## 这一集要讲清的一件事

平滑器只有两个自由：窗口多宽、权重怎么给。两者都会让曲线**滞后**。这一集把“滞后”变成一个可算的数——阶跃响应的质心——并证明：当 α = 2/(N+1) 时，SMA(N) 与 SES(α) 的质心严格相等。于是“窗口 N”和“平滑系数 α”不是两套参数，而是同一把尺子的两种刻度；拿 α=0.5 去和 N=20 比，等于拿等效窗口 3 去比窗口 20。

## 五条核心判断

1. **质心相等是代数恒等，不是近似。** SMA 的质心 (N−1)/2，SES 的质心 (1−α)/α；令二者相等即得 α=2/(N+1)。N=20 时 α=0.0952380952381，质心差 0.0（浮点）。证据里解析值与实测值都记。
2. **质心相同，形状可以不同。** 同一段茅台日线（730 行，2019-01-02..2021-12-31），SMA20 与 SES(2/21) 相关系数 0.999215985398，但最大绝对差 82.90 元、平均绝对差 11.03 元；阶跃响应爬到一半分别是 10 步与 6 步，爬到 95% 是 18 步与 29 步。SES 起步更冲、尾巴更长。
3. **WMA 的“偏心”由权重方案决定，分母必须是 Σw。** 线性权重 [1..20] 的质心 6.333333333333，三角权重 [1..10,10..1] 的质心回到 9.5（与等权相同）；把分母误写成 N 会把 [0,0,1] 的输出从 3 变成 0.5，测试钉住了这一条。
4. **窗口的单位是时间，不是点数。** 日线一根 240 分钟、五分钟线一根 5 分钟，同样“20 根”对应 4800 分钟对 100 分钟，相差 48 倍；窗口数字不写单位就无法跨频率比较。
5. **工程不变量也要能算。** 增量滑动和在 10 万个点的斜坡上与直接求和的最大偏差 2.455635694787e-11（每 1024 步重算）；SES 初值的影响前 5 步平均偏差 1.499，100 步后衰减到 6.75e-5。平滑不制造信息，只是延迟信息——这条写进边界。

## 与书的关系

- 式(2.13) SMA、式(2.14) WMA、式(2.15) SES、式(2.16) 初值，四条都来自书。
- **书中没有** α=2/(N+1)、没有质心换算、没有权重方案。片中凡是这三层，都标注“本仓推导 / 本仓选择”，并记入 SELF-AUTH A14。

## Verification（八条）

1. 黄金样例：SMA N=3，x=[1..5] → y=[2,3,4]；SES α=0.5、s0=2、x=[1,2,3,4] → y=[1.5,1.75,2.375,3.1875]。
2. 质心恒等：解析 9.5 与 9.5，centroid_diff = 0.0；实测 9.5 与 9.499999999871。
3. WMA 三权重质心：等权 9.5、线性 6.333333333333、三角 9.5。
4. N=1 恒等、N>n 返回空；α=1 恒等；α 越界返回 BadAlpha；全零权重返回 ZeroWeights。
5. 增量 vs 直接：2.455635694787e-11；常数序列上两者都为 1099.996。
6. 初始化敏感性：first5 1.499138603175 → after100 6.749512533588e-05。
7. 日线对比：corr 0.999215985398、max diff 82.902705148157、mean diff 11.025091895752、末值 SMA20 1798.27 / SES 1780.87 / close 1771.87。
8. 频率换算：4800 / 100 = 48；五分钟线 SMA20 末值 1341.478。

## 数据

- 日线 `sh600519_daily.csv`：730 行，2019-01-02..2021-12-31，16,439 B，sha256 e104a2fa28b2…，min 492.078668、max 2227.150235、mean 1254.245217419178，区间涨幅 254.68%。
- 五分钟线 `sh600519_5min.csv`：240 根，2026-08-10 09:35..2026-08-14 15:00，6,683 B，sha256 065c11951517…。
- 合计 23,122 B；导出脚本 ts-admin `inventory/scripts/export_ch03_smoothing.py`，只读 Lake、前复权、剔停牌。
- 派生：pack `build/generate_smoothing_data.py` 只读 ts-base 证据产出 `data/smoothing.json`（约 40 KB，不入库）。

## Algorithms

- `TsBase.Algos.Ch02.Sma`：`sma :: Int -> V.Vector Double -> V.Vector Double`；滑动和增量 + 每 1024 步重算；`smaDirect` 作教学对照。N<=0 或 N>n 返回空。
- `TsBase.Algos.Ch02.Wma`：`wma :: V.Vector Double -> V.Vector Double -> Either WmaError (V.Vector Double)`；权重下标 0 = 最旧；分母 Σw；`meanLag` 算质心。
- `TsBase.Algos.Ch02.Ses`：`ses :: Double -> Double -> V.Vector Double -> Either SesError (V.Vector Double)`（稳定式 s+α(x−s)）；`sesAuto`（初值 = 前 3 点均值）；`alphaForWindow` / `windowForAlpha` / `smaCentroid` / `sesCentroid`。
- 断言：Sma 12 / Wma 13 / Ses 16 = 新增 41，总套件 408；跑法见 Evidence。

## 八场

| # | 场 | 目标 | 页 |
|---|----|------|----|
| 01 | 开场 | 一条曲线两个旋钮；三个数 9.5 / 6.33 / 48× | 5 |
| 02 | 问题 | 为什么平滑一定滞后；三种摊法；质心是公共尺子 | 4 |
| 03 | 定义 | 式 2.13–2.16；质心推导；α=2/(N+1) | 4 |
| 04 | 直觉 | 三条 SMA；SMA20 对 SES(2/21)；阶跃形状；换算后果 | 4 |
| 05 | 实现 | 三模块；稳定式与分母；41 条断言 | 3 |
| 06 | 验证 | 黄金样例；质心恒等；WMA 权重；工程不变量；行情与频率 | 5 |
| 07 | 边界 | 五条 + “平滑不制造信息” | 2 |
| 08 | 收尾 | 三数 + Holt 预告 | 2 |

## Claims（画面逐条可追）

| 画面 | 数值 | 断言/证据 |
|------|------|-----------|
| 质心相等 | 9.5 / 9.5，diff 0.0 | bridge.centroid_diff；step.measured_centroid |
| α 换算 | 0.0952380952381 | bridge.alpha_for_20；测试 alphaForWindow |
| 阶跃半程 | 10 vs 6 | step.reach_half |
| 阶跃 95% | 18 vs 29 | step.reach_95 |
| WMA 质心 | 6.33 vs 9.5 | centroids.wma_linear20 / wma_tri20 |
| 日线对比 | corr 0.9992，max 82.90，mean 11.03 | dailyCompare |
| 漂移 | 2.455635694787e-11 | drift.inc_vs_direct |
| 初值 | 1.499 → 6.75e-5 | init |
| 频率 | 48×（4800/100 分钟） | frequency |
| 数据 | 730 行 / 240 根 / 23,122 B | manifest |

## Evidence

- ts-admin `243fd60` export_ch03_smoothing.py。
- ts-base `eaa7367` 数据（两个 CSV）；`39c2fa7` algos + SELF-AUTH A14；`f7b469a` 证据生成器 `app/Ch03SmoothingEvidence.hs` 与 `inventory/evidence/ch2-{sma,wma,ses}/20261030T124210-*.json`。
- 证据运行命令：
  ```
  docker exec haskell-ts bash -lc 'export PATH=/opt/ghc/9.14.1/bin:$PATH; cd /work && cabal build all && cabal run -v0 tsbase -- evidence-ch03-smoothing --data data/episodes/03-sma-wma-ses --out data/episodes/03-sma-wma-ses --evidence inventory/evidence'
  ```
- 测试：
  ```
  docker exec haskell-ts bash -lc 'export PATH=/opt/ghc/9.14.1/bin:$PATH; cd /work && cabal test'
  ```
