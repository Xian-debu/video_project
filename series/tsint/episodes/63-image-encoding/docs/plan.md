# 63-image-encoding - 把序列画成图：GAF 与 MTF

> status: draft
> chapter: ch07 | runtime target: 20 min | algorithms: 3

## Thesis

把一维序列画成二维图，信息会怎么丢？本集把两种画法拆开量：**格拉姆角和场（GASF）**是双射——只要握住对角线（或第一行），原序列能逐点反解回来，实测最大误差 **1.349e−14**；代价是它对整体反射不敏感，序列 x 与 −x 画出逐位相同的图，所以反解只到「差一个整体符号」。**马尔可夫转移场（MTF）**只保结构——真正逐行归一、行和为 1 的是 8×8 的转移矩阵 W，铺回 128×128 的图像行和是 **16.0000**（= 128/8），同一张图可以由很多条序列生成，不能逐位反推。第三件事是值不值得：把 32 点窗口的 GASF 喂给卷积前端 + 岭回归，测试 MAE **1.391316**，三个尺度数字特征 **1.390786**——图没有赢，差 **万分之四**，方向还偏向数字一侧；两者都赢朴素持久基线 **2.155171**。结论照实讲：图像化是可用的表示，但「画成图」本身不带来预测优势。

## Verification

证据程序 `evidence-ch07-image` 一条命令跑 19 项检查（数据 3 / gaf 5 / mtf 6 / vision 5），**19/19、4.45 s**，写 `summary.json` 与逐行 `checks.txt`。屏幕读数全部来自它：

- GAF：手算两点 `[-1,0]` → 和场 `[[1,0],[0,-1]]`、差场 `[[0,1],[-1,0]]`；和场对称偏差 **0**、差场反对称偏差 **0**、差场对角 **0**；对角反解最大误差 **1.349e−14**（允许整体反射）。
- MTF：q=8 箱、每箱 **16** 个样本；W 逐行和最大偏差 **0.0**；图像行和 **16.0000**（与「箱计数 × W 行」的偏差 2.132e−14）；给定 (W, 箱序列) 重放图像偏差 **0.0**。
- 视觉预测：窗口 32 点、步长 8 → 1,024 点段出 **124** 窗，训练 **60** / 验证 **29** / 测试 **35**；图特征 **192** 维（3 个 3×3 核 → 8×8 池化 → 展平）+ 3 个尺度数字 = **196** 个参数（含截距）；λ 图像 **10000**、数字 **100**；测试 MAE 图 **1.391316**、数字 **1.390786**、朴素持久 **2.155171**。
- 确定性：同一窗口两次提特征逐位一致；196 个参数固定；证据程序 4.45 s（含 124 窗提特征与闭式解）。

## Data

- `window_128.csv`：sz000001 后复权日线，**128 行**（2016-06-01 → 2016-12-08），口径 `100·ln(c_t/c_{t−1})`，min **−2.3734** / max **2.9917**（sha256 a5cc9508ddc1…）。
- `series_1024.csv`：同一口径 **1,024 行**（2015-10-26 → 2019-12-31），min **−8.0281** / max **8.3901**（sha256 6b87c5d3fdd1…）；由 `ts-admin/inventory/scripts/export_ch07_image.py` 从 lake `bars_daily` 导出，manifest 同目录。
- 缩放只用本窗 min/max：`x̃ = 2·(x−min)/(max−min) − 1`，再 `φ = arccos(clamp(x̃))`；缩放参数随之入图，反解要带着同一个 Scale。
- 预测段：1,024 点滑 32 点窗、步长 8；训练取前 60 窗、验证 29 窗定 λ、测试 35 窗只读一次。窗口重叠，样本不独立——写进边界页，不下显著性结论。

## Algorithms

- `TsBase.Algos.Ch07.GAF`（100 行）：`Scale` / `fitScale`（常数序列退化为 `Scale mn (mn+1)`）、`scaleWith` / `unscaleWith`、`clampUnit`、`toPolar`、`gasf`（cos(φi+φj)）、`gadf`（sin(φi−φj)）、`gasfDiagonal`、`recoverFromGasfBranch`（对角给 |x|，第一行在两个候选角里挑更接近的；负分支输出整体反射）、`recoverFromGasf`。
- `TsBase.Algos.Ch07.MTF`（92 行）：`quantileEdges`（type-1）、`binOf`（严格小于边界）、`binsOf`（**按秩分箱** `min (q−1) (rank·q div n)`——相等值多时按值阈值会让一箱吃光样本）、`binCounts`、`transitionMatrix`（相邻箱对计数、逐行归一，空行退化为均匀）、`mtf` / `mtfFromBins`、`rowSums`、`isStochastic`。
- `TsBase.Algos.Ch07.VisionForecast`（147 行）：`conv2d`（3×3、valid、步长 1）、`reluMat`、`poolTo`（行列同时分组的自适应平均池化）、`flattenMat`、`kernels`（横向梯度 / 纵向梯度 / 拉普拉斯）、`imgFeatures`（fitScale → gasf → 三核 → ReLU → 8×8 池化 → 192 维）、`contextFeatures`（末值 / 均值 / 标准差）、`dot`、`solveLinear`（列主元高斯-约当）、`ridgeFit`、`predict`。
- 合计 **339** 行、**24** 条单测（9 + 7 + 8），三个模块互不引用、无 IO、无随机；证据程序 **267** 行。

## 讲稿与排版

- 8 场 32 页 320 行，每场 4 页 40 行；目标 20 min，实测见 Delivery。
- 版式沿用 E60/E61：左栏 `left:120, top:292, width:620`，右栏 `left:790, top:292, width:1030`，Card 宽 1010、图 ≤950，Foot `top:812`。
- 图：`SeriesStrip`（128 点窗口 / 1,024 点段）、`Heat`（GASF / MTF 图像 / 核）、`PolarCircle`（缩放后的极角）、`GasfHand`（手算两点和场/差场）、`MtfTiles`（状态序列 → W → 图像）、`RowSumBars`（W 行和 1.0000 vs 图像行和 16.0000）、`KernelTrio`（三个 3×3 核）、`VisionPipe`（五段前端）、`MaeBars`（图 1.3913 / 数字 1.3908 / 基线 2.1552）、`SplitWindows`（1,024 点 + 124 条窗口按 train/val/test 着色）、`ModuleBars`（100 / 92 / 147 / 267）。

## Delivery

- 成片：渲染后回填（时长 / 帧数 / cue / 音量 / sha256）。
- 复现三条（与成片屏幕一致）：
  1. `cabal run tsbase -- evidence-ch07-image --data data/episodes/63-image-encoding --out out/evidence-63 --evidence inventory/evidence/63-image-encoding.ch7-image.json`
  2. `cabal test`
  3. `node scripts/make.mjs --film tsint-63-image-encoding`

## Deviations

- D1 规格里手算 GASF 写成 `[[−1,0],[0,1]]`；按 `clampUnit + acos` 实算 `[-1,0]` 得 `[[1,0],[0,−1]]`（cos(3π/2) 的 −1.8e−16 归零），差场 `[[0,1],[−1,0]]`。屏幕以程序为准，证据里用手算断言 + 1e−12 容差。
- D2 GASF 对 `x → −x` 逐位不变：`acos(−x) = π − acos(x)`，`cos((π−φi)+(π−φj)) = cos(φi+φj)`。所以反解只到整体反射，误差取「原序列 / 反射序列」两者的较小值；这不是 bug，是这条路的固有代价。
- D3 MTF 不是逐位可逆：行和 1 的是 q×q 的 W，n×n 图像第 i 行是被箱序列打散的 W 的一行，行和 = 16。证据只验证「给定 (W, 箱序列) 重放逐位一致」，不从图像反推序列。
- D4 分箱按秩而不是按值阈值：128 点里相等值多，值阈值会让边界箱吞掉全部样本；按秩保证每箱 16 个。
- D5 图像特征没有赢（1.391316 对 1.390786，差万分之四，方向偏向数字一侧）：照实讲，不写成「图像更好」；两者都赢持久基线靠的是岭回归收缩，不是形状。
- D6 λ 只有五档网格（1 / 10 / 100 / 1e3 / 1e4），图像选 10000、数字选 100；单一切分、无交叉验证，35 个测试窗重叠。万分之四的差在噪声里，只报方向不报显著性。
- D7 窗口 32 点、步长 8：1,024 点段出 124 窗，留出 60/29/35；步长 1 会得到 993 窗但高度重叠、训练更慢，8 是折中。
- D8 成片时长见 Delivery（目标 20 min，按实测旁白走）；证据耗时 4.45 s 随机器负载浮动，旁白不念秒数。
