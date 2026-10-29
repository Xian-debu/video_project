# 74-fidelity-tv-and-dtw - 别只看 MSE：总变差正则与 DTW 保真度

> status: ready (成片 763.77 s，已交付)
> chapter: ch09 | runtime target: 13 min | algorithms: 2

## Thesis

MSE 只看逐点幅度，看不见「形状对、只是晚了几步」。把同一段形状整体平移三个采样点后，逐点 MSE 是 15.81，DTW 却是 0；但 DTW 不是距离，三角不等式可以差出 4.0。另一条路是 TV 正则：把预测的抖动总量从 94.98 压到 13.99 时，干净信号上的 MSE 从 0.160 降到 0.0071；再压到 4.54，干净 MSE 反升到 0.187。两个指标都不是免费的，本集给出它们各自的账本。

## 核心判断

- 书中 p.219 只给机制描述和一句「感知质量最高提升 45.9%」，没有公式、数据或复现协议，按 C 级处理。
- TV 的 `l1` 定义、次梯度、DTW 递推式都标「标准定义/本集推断」，不冒充书中原文。
- DTW=0 不是「两条序列完全相同」，而是「允许重复对齐后形状一致」；必须同时给路径长度 33，否则观众会误读。
- 相位错开的例子用「同形状、整体平移」构造，MSE 大而 DTW 为 0，这是本集的核心演示，不是真实行情结论。
- TV 实验训练看带噪观测、评估看干净信号；否则 λ=0 拟合噪声会让「TV 有用」变成循环论证。
- λ 的甜区是实验值（n=120、交替噪声 ±0.4），不能外推成「所有任务取 0.005」。

## Verification

屏幕上必须出现、且能逐项回到同一次运行的数：

1. TV 定义：`[1,2,4,7]` 的 TV = 1+2+3 = 6。
2. TV 三个 λ：0 / 0.005 / 0.05 的 TV 与干净 MSE；甜区 λ=0.005 的 TV=13.990103373965104、clean MSE=0.007065947199407385；过平滑 λ=0.05 的 clean MSE=0.18698043848077975。
3. DTW 黄金例：`[1,2,3]` vs `[2,3]` = 1，路径 `(0,0),(1,0),(2,1)`。
4. 平移例：MSE=15.80952380952381，DTW=0，路径长度 33。
5. 三角不等式反例：x=[0,0]、y=[0,2]、z=[0,2,2,2]；xz=6，xy+yz=2，违反量 4。
6. 带约束：n=500、w=20，cost=28.53169548885456，32.399641 ms，与完整 DTW 相等。

看完能回答：什么时候该用 DTW 而不是 MSE；TV 的 λ 在买什么、又在卖什么。

## Data

不再使用 ts-admin 行情切片。两个演示都用确定性合成序列，由证据生成器直接写出：

- TV：n=120，干净信号 = 正弦 + 线性趋势；观测 = 干净 + 交替 ±0.4 噪声。训练目标是观测，评估目标是干净信号。
- DTW：21 点序列，形状 `[0,2,5,8,10,8,5,2,0]` 分别整体平移；黄金例与三角不等式反例是手算小序列。

理由：本集要验证的是指标的定义与性质，不是某只股票的预测精度；合成序列让每个数字可复算，也避免把「DTW 对相位不敏感」说成投资结论。

## Algorithms

- ch9-tv-reg — 总变差感知正则（Total Variation Regularizer）→ `TsBase.Algos.Ch09.TvReg`
  - 导出：`totalVariation`、`totalVariationSquared`、`meanSquaredError`、`tvLoss`、`tvLossSquared`、`tvSubgradient`、`tvDescent`
  - `tvLoss lambda pred mse = mse + lambda * TV(pred)`；`l1` 次梯度在 Δ=0 处取 0。
- ch9-dtw — 动态时间规整（Dynamic Time Warping）→ `TsBase.Algos.Ch09.Dtw`
  - 导出：`dtw`、`dtwCost`、`dtwRooted`、`dtwNormalized`、`dtwBanded`
  - 返回未开方累计代价 + 0 基路径；`dtwCost` 滚动两行 O(min(n,m))；`dtwBanded` 是 Sakoe-Chiba 窗口。

## 场景（8 场）

1. **open · 别只看 MSE** — 两条同形状、错开三步的序列并排；MSE 15.81 vs DTW 0。抛出问题：误差小是否等于预测好？书页 p.219 引文 + C 级徽章。
2. **problem · 逐点误差看不见相位** — 把逐点差画成柱状/连线：每个点都错，但形状其实一模一样；DTW 允许「晚一点对上」。给出黄金例 `[1,2,3]` vs `[2,3]` 的 3×2 网格与路径。
3. **definitions · 两个指标，两种账本** — 左：TV 定义、`tvLoss`、`l1` 次梯度；右：DTW 递推、边界、路径约束。明确「标准定义/本集推断」，书中只提名。
4. **intuition · λ 在买什么** — 左：TV 曲线（λ 对数轴）与 clean MSE 剪刀差，标出 0.005 甜区、0.05 过平滑；右：DTW 对齐网格 + 平移例的 33 步路径。两条曲线回答不同问题。
5. **implementation · 两个 Haskell 模块** — `TvReg.hs` / `Dtw.hs` 关键行；三个易错点：λ 与 MSE 量纲、`l1` 在 0 处的次梯度、DTW 的 O(nm) 与归一化。
6. **verification · 每个数字回到一次运行** — 三组卡片：TV 定义 6；λ 三档 94.98→13.99→4.54 与 clean MSE 0.160→0.0071→0.187；DTW 黄金例 1、平移 0/33、三角反例 6>2+0；带约束 31.5 ms。
7. **boundary · 两个指标，五条边界** — ① 45.9% 是 C；② TV 的 l1 是推断；③ λ 过平滑会抹掉峰值；④ DTW 不是度量；⑤ DTW O(nm)、归一化与窗口改变数值。
8. **outro · 误差有三种，指标只有一种** — 幅度、平滑、相位；MSE 管第一种，TV 管第二种，DTW 管第三种。收束第 9 章。

## Claims

| 陈述 | 等级 | 依据 |
| --- | --- | --- |
| TV-ODE 在损失中加入 TV 感知正则，控制精度与动态保真度平衡 | B | 书中 p.219 机制描述，可复现思路 |
| 感知质量最高提升 45.9% | C | 书中一句，无数据/代码/协议 |
| DTW 可作为超越 MSE 的时空敏感指标 | B | 书中 p.219 提名 + 标准定义 |
| 本集 TV/DTW 所有数值 | A | ts-base 证据 JSON + 142 条断言 |

## Evidence

- 生成器：`app/Ch09FidelityEvidence.hs`
- 证据：`inventory/evidence/ch9-fidelity-20261029T165739.json`
- 数据：`data/episodes/74-fidelity-tv-and-dtw/`（summary.json、tv_curve.csv、dtw_*.csv）
- 测试：`cabal test` 142 条全过（TvReg 19 + Dtw 15 + 旧 108）。
