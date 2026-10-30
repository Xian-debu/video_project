# 68-fewshot-and-cost - 5% 的样本怎么选：Few-shot 采样器与它的成本账

> status: draft (scaffolded, not produced)
> chapter: ch08 | runtime target: 16 min | algorithms: 2

## Thesis

few-shot 只能取「连续的时间段」而不能随机撒点（否则时间连续性被破坏），因此 5% 的采样率在 1000 点序列上固定只有 50 个点、且位置由窗口类型决定——换一种窗口，结果就不可比。

## 核心判断

1. 5% 不是「随机取 50 个点」，而是「按位置规则取 50 个点」。图 8.6 给了四类窗口锚点（前/后/均匀/随机），锚点规则一变，训练集分布就变，模型分数不可直接横比（p.204）。
2. 时间序列的样本必须保持时间连续，所以点采样也只有位置策略：前段连续、末端连续；等距抽样与随机撒点在本仓被实现为「不合法」反例，库函数直接报错，而不是「效果差」（p.204）。
3. 同样 50 点预算，覆盖范围差一个数量级：前端窗口只覆盖 3 个月，均匀窗口铺满 4 年（跨度 999 个索引），随机窗口（种子 42）落在 8 个月份、最大空洞 168 个交易日，且训练窗末尾 93 个点一次都没被看到（本集实测）。
4. 效率必须与精度一起报（p.207）：参数量 105→17025（162 倍），训练时间 24.7→7041 ms（285 倍），推理 0.095→11.32 ms（119 倍），峰值内存 3.8→262.6 MB（69 倍）；但固定 200 步预算下误差并不随规模单调下降（0.00300→0.00316→0.0100）。
5. 参数量是「本仓补充指标」：书的 7 项效率指标（训练/预训练/推理/批处理时间、IPS、GPU 利用率、内存占用率）不含 |θ|（p.207）；本集把它作为可手算闭合的自检数字（337 = 48+272+17），并明确标注为补充。

## Verification

屏幕上必须出现：

1. 八种策略的 50 点位置图（同一横轴 0–999）：前端窗口 0–49、后端窗口 950–999、均匀窗口 10 窗跨度 999、随机窗口首 16 末 906、两个反例（等距步长 20、随机散点）。
2. 同一个种子两次采样逐位一致的断言结果（same=true），换种子后不同（other=true）。
3. 两个反例被库拒绝的报错路径，画面上标「不合法」而不是「更差」。
4. n=10、ρ=5% 的取整边界：round(0.5)=0 → 至少提升到 1 点、1 个窗口。
5. 参数自检 337 = 48 + 272 + 17；一维输入 321；两者并排手算。
6. 三规模 MLP 的参数量/训练/推理/峰值/误差表，数字与 summary.json 逐项一致。
7. lazy 计时 0.0007 ms 与 forced 计时 0.095 ms 起的对照，说明计时前必须 force。
8. 35 条证据检查（22 + 13）与 33 条断言（18 + 15）全部 pass，总套件 308 条。
9. 屏上每个数字都能在 data/fewshot.json 找到同名字段（meta/data/window/strategies/efficiency）。

看完能自己实现采样器、解释为什么不能随机撒点，并能报出一组「参数量-时间-内存-误差」四件套。

## Data

- ts-admin 只读导出：`inventory/scripts/export_ch08_fewshot.py` → `sz000001_1200.csv`（000001.SZ，1200 个交易日，2020-01-02 至 2024-12-13，前复权，剔停牌，含 manifest sha256）。
- 训练/测试窗口：前 1000 点训练（止于 2024-02-20），后 200 点测试（2024-02-21 起）；5% 预算 = 50 点，窗宽 5 → 10 个窗口。
- ts-base 证据运行：`data/episodes/68-fewshot-and-cost/` 下 summary.json、series.csv、positions.csv（8×50）、bench.csv（3 规模）；证据文件 `inventory/evidence/ch8-fewshot-sampler/`、`inventory/evidence/ch8-efficiency-bench/`。
- 全部数字由 `build/generate_fewshot_data.py` 从上述文件重算并交叉校验 sha256 后写入 `data/fewshot.json`；任何不一致直接失败。

## Algorithms

- ch8-fewshot-sampler - Few-shot 采样器（窗口/点采样） (TsBase.Algos.Ch08.FewShotSampler)，18 条断言
  - `sampleFewShot :: FewShotCfg -> V.Vector a -> (V.Vector a, [Int])`，返回样本与索引（索引用于复核位置）。
  - 4 窗口（前/后/均匀/随机）× 2 采样单元（窗口/点），其中点×均匀（等距）与点×随机（撒点）为反例，`isLegal=False` 且调用即 error。
  - 点数 `max 1 (round (rho*n))`；窗数 `min (n div w) (max 1 (round (rho*n/w)))`；随机锚点用可注入种子的 LCG 排序。
- ch8-efficiency-bench - 效率指标测量 (TsBase.Algos.Ch08.Efficiency)，15 条断言
  - `data Efficiency = Efficiency { effParams, effTrainMs, effInferMs, effPeakBytes, effMse }`。
  - 参数量按形状算：2→16→16→1 = 337；1→16→16→1 = 321；三规模 2→8→8、2→32→32、2→128→128。
  - 计时协议：预热 3 次、重复 7 次取中位数、200 步全批量、lr 0.05；推理前 force；峰值内存取 RTS `max residency`。
  - 三规模实测（200 步同预算）：MSE 0.002999616677209 / 0.003160689586098 / 0.01000185208867，保留非单调结论。

## 场景

- open · 五十个点 — 同一只股票、1,200 个交易日，只取 5% = 50 点；前端只覆盖 3 个月，均匀窗口铺满 4 年，「同一模型、同一测试集，分数不可比」。
- problem · 位置决定世界 — 八种组合的覆盖月份、空洞（168 个交易日）、末尾 93 点未覆盖；书里四个方向（初始/最新/全局/鲁棒）与 p.204 连续性约束。
- definitions · 窗口与点 — 采样率与预算、窗口数公式、四种锚点、合法 6 种与反例 2 种、n=10 取整边界。
- intuition · 八行位置图 — 每条横轴 0–999 的 50 点位置图，前端窗口与前端点索引相同的巧合（样本单元不同），覆盖月份条形图。
- implementation · 两个模块 — sampleFewShot 五字段配置与十行核心逻辑；效率三件套的参数量手算、计时协议、RTS 峰值。
- verification · 35 条检查 — 位置/种子/边界/参数自检/三规模表/lazy-vs-forced；报告已提交的两个证据单元。
- boundary · 七条边界 — B 级协议、单票不外推、口径标注、固定预算、非单调误差、反例不是差策略、复现命令。
- outro · 三件套 — 50/1000/337 三个数、成本四件套、下一集 hexbin 均衡性。

## Claims

| 陈述 | 等级 | 依据 |
| --- | --- | --- |
| 少样本场景只给少量标注样本，样本选择与分布显著影响性能 | A | 书 p.203；图 8.5b |
| Few-shot 四类窗口采样：前端/后端/均匀/随机 | A | 书 p.203–204；图 8.6 |
| 点采样因需保证时间连续性，只采用位置策略 | A | 书 p.204 |
| 固定/滚动预测与 n−f 训练口径 | A | 书 p.204；图 8.7（E67 已覆盖） |
| 效率指标 7 项（训练/预训练/推理/批处理时间、IPS、GPU、内存） | A | 书 p.207 |
| 1200 点、前 1000 训练、50 点预算、10 窗 | A | ts-admin 导出 + summary.json |
| 前端覆盖 3 个月、均匀 999 跨度、随机 8 个月/空洞 168 | A | summary.json strategies[].months/span/maxGap |
| 同种子逐位一致、反例被拒、n=10 边界放宽到 1 点 | A | 证据 ch8-fewshot-sampler 22 条 |
| 337=48+272+17、321、三规模 105/1185/17025 | A | 证据 ch8-efficiency-bench 13 条 |
| 训练 24.7/271.8/7041.0 ms、推理 0.0953/0.6218/11.32 ms、峰值 3.8/20.7/262.6 MB | A | bench.csv + evidence metrics |
| 同预算误差非单调（0.0030/0.0032/0.0100） | A | summary.json efficiency.scales[].mse |
| 参数量不在书的效率 7 项内 | A | 书 p.207；本仓补充指标，画面标注 |

## Evidence

- ts-base 代码：`267b0c2` feat(ch08): add few-shot sampler and efficiency trio for ep68
- ts-base 数据：`0fca48c` feat(data): add ep68 1200-point sampled series
- ts-base 证据运行：`255dc3f` chore(ch08): add ep68 evidence run for sampling positions and efficiency trio（commit `255dc3fe9ab3346562a886bfd5b6a89b1abb8cbb`，tsBaseCommit `e73c1939b04b10b1d1ee0f40828945709fc50823`，runAt 2026-10-30T10:21:04Z）
- ts-admin 导出：`a37e35a` feat(export): add ch08 few-shot 1200-point sample
- 复现：`cabal run -v0 tsbase -- evidence-ch08-fewshot --data data/episodes/68-fewshot-and-cost --out data/episodes/68-fewshot-and-cost --evidence inventory/evidence +RTS -s -T`
- 派生：`python3 build/generate_fewshot_data.py`（本目录）
