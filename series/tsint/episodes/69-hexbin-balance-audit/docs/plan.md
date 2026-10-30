# 69-hexbin-balance-audit - 你的基准数据集均衡吗：PCA 投影 + Hexbin 密度图

> status: draft (pack scaffolding, data + algorithms ready)
> chapter: ch08 | runtime target: 16 min | algorithms: 1

## Thesis

把窗口压到前两主成分再画六边形密度图，若超过 60% 的窗口落在不到 20% 的格子里，则任何在该数据上报告的 SOTA 都只由少数格子支撑——这是「基准是否均衡」的可量化判据。

## 核心判断

1. 一个窗口 = 32 个日收益，压成 (均值 μ, 波动 σ) 两个数；二维协方差是 2×2，特征值有闭式解 1±|b|，旋转是全秩正交变换，因此「投影后再反变换重构」能到浮点极限（实测 2.78e-17），而不是截断近似的 1e-3 量级。
2. 标准化的顺序不可省：A 股收益均值 1e-4、波动 1e-2，直接做 PCA 会让第一主成分几乎等于 σ 轴；逐维 z-score 后协方差对角恒为 1，只剩相关系数 b = 0.074368，λ1 = 1.074368、λ2 = 0.925632、主轴恒为 45°（对角相等的必然结果，与 b 的符号无关）。
3. 集中度是可比较的标量：占用格子 333，前 20%（k = 67）承载 92.04% 的样本；最大单格 2,583（占 5.15%）。换成三只蓝筹（7,921 窗口、319 格、k = 64）集中度 70.09%——蓝筹彼此更像，分布更窄。
4. 阈值 60% 是本仓约定，书中只给图 8.2 的定性判读（p.198），没有这个数字；画面与边界都明确标注。
5. 网格尺寸会改变分母：15→60 时占用格子 102→951、集中度 0.9213→0.8623；30×30 是主口径，敏感度作为副表一并报出，避免「换网格刷指标」。

## Verification

屏幕上必须出现：

1. 50,117 个窗口的六边形密度图（30×30，333 个占用格），颜色标「每格样本数」，最大格标 2,583。
2. 集中度三个数：333 格、k = 67、92.04%；以及最大格占比 5.15%。
3. 三只蓝筹对照：7,921 窗口、319 格、集中度 70.09%。
4. PCA 反变换最大误差 2.78e-17（< 1e-10 断言），λ1+λ2 = 2.000000 与 45° 主轴。
5. 网格敏感度 15/20/30/40/60 五行：占用格数与集中度同步报出（0.9213/0.9202/0.9204/0.9024/0.8623）。
6. 23 条断言、12 条证据检查、总套件 331；GHC 9.14.1、cabal 3.16.1.0、ts-base HEAD 与 ts-admin HEAD 写进证据。
7. 复现命令一行与输入 sha256（ed50451b…）。
8. 阈值 60% 与「网格尺寸改变分母」两条边界在画面上出现。

看完能自己实现 PCA+hexbin、算出一份数据的集中度，并说明它为什么只是体检而不是判决。

## Data

- ts-admin 只读导出：`inventory/scripts/export_ch08_hexbin.py` → `panel_20.csv`（20 只 A 股，2015-01-05 至 2025-12-31，前复权，剔停牌，50,757 行 / 2,146,156 B，含 manifest sha256）。
- 窗口：单票 32 个对数收益（需 33 个收盘价），逐日滑 1 步；每只 1,289–2,642 个窗口，合计 50,117。
- ts-base 证据运行：`data/episodes/69-hexbin-balance-audit/` 下 summary.json、hexbin_20.csv、hexbin_3.csv、pca_scatter.csv；证据 `inventory/evidence/ch8-hexbin-balance/run-ch8-hexbin-balance.json`（12 条检查，含输入 sha256 与命令）。
- 全部画面数字由 `build/generate_hexbin_data.py` 从上述文件重算并交叉校验（窗口总数、占用格、集中度复算、λ 和、45°、重构误差、行数），任何不一致直接失败。

## Algorithms

- ch8-hexbin-balance - 均衡性诊断（PCA + Hexbin Density）(TsBase.Algos.Ch08.HexbinBalance)，23 条断言
  - `pca2 :: [Win2] -> Pca2`：逐维 z-score（ddof=1）→ b = 样本相关 → λ = 1±|b|、θ = 45°；NaN/Inf 与 n<2 直接报错。
  - `project2` / `reconstruct2`：正交旋转与反变换（重构误差 2.78e-17）。
  - `hexSizeFor` / `binOf` / `hexCenter`：s = max(rx/g, ry/(g·√3/2))；先取 row 再按 row 奇偶取 col，格心与分箱互逆。
  - `hexbin` / `topBins` / `concentration`：`Data.Map.Strict` 稀疏计数；k = max 1 (round(cut·占用格))；集中度 = 前 k 格样本 / 总样本。

## 场景

- open · 前 20% 的格子 — 50,757 行、20 只股票、50,117 窗口、333 格、92.04%；最大格 2,583（5.15%）。
- problem · 不均衡的基准 — 二十只 vs 三只蓝筹七行对照（50,117/7,921、333/319、67/64、92.04%/70.09%、2,583/220）；阈值 60%。
- definitions · 一个窗口两个数 — 窗口 μ/σ、标准化与 2×2 闭式解、六边形分箱三组公式；样例窗口 sh600519 2015-01-05 至 2015-02-25（μ=-0.003004、σ=0.018410）。
- intuition · 图上每一格 — 密度图读法三条（中心密集/尾部稀疏/右上倾斜 b=0.0744）、网格敏感度五行。
- implementation · 四个函数 — pca2 两遍扫描、binOf/hexCenter 互逆、concentration；23 条断言中的 10 条；依赖与复杂度。
- verification · 二十三个断言 — 12 行数据体检表 + 12 条证据检查 + 复现命令。
- boundary · 七条不能说的话 — 阈值本仓定、集中度≠数据坏、二维丢形状、非全市场、网格改分母、不是唯一判据、不能说 SOTA 无效。
- outro · 三个数一个判据 — 50,117 / 333 / 92.04% + 判据 60% + 下一集 70（欧拉法）。

## Claims

| 陈述 | 等级 | 依据 |
| --- | --- | --- |
| Hexbin 密度图用于观察样本分布、发现长尾与不均衡 | A | 书 p.198；图 8.2 |
| PCA 只为降到二维的手段，书中无公式；本仓用 2×2 闭式解 | B | 书 p.198；本仓实现（模块文档注明） |
| 窗口 32 日、逐日滑 1 步、50,117 个窗口 | A | summary.json；ts-admin manifest |
| 占用格 333、k = 67、集中度 92.04%、最大格 2,583（5.15%） | A | 证据 ch8-hexbin-balance 12 条 |
| 三只蓝筹 7,921 窗口、319 格、70.09% | A | summary.json blue3 |
| 重构误差 2.78e-17、λ1+λ2=2、主轴 45° | A | 证据 tests / pca2 |
| 网格 15–60 的集中度 0.9213/0.9202/0.9204/0.9024/0.8623 | A | summary.json gridSensitivity |
| 阈值 60% 为本仓约定，书中无此数 | A | 书 p.198 只有图的判读；本仓 SELF-AUTH A11 |

## Evidence

- ts-admin 导出：`e798aad` feat(export): add ch08 20-stock daily panel for hexbin audit
- ts-base 代码：`64773de` feat(ch08): add hexbin balance audit with 2x2 PCA for ep69
- ts-base 数据：`0eb1597` feat(data): add ep69 20-stock daily panel for balance audit
- ts-base 证据生成器：`26374d9` feat(ch08): add ep69 hexbin evidence generator
- ts-base 证据运行：`d9701f6` chore(ch08): add ep69 evidence run for hexbin balance audit（tsBaseCommit `d9701f6`，tsAdminHead `e798aad`，runAt 2026-10-30T10:53:28Z）
- ts-base 敏感度：`c8d9631` chore(ch08): extend ep69 evidence with grid-size sensitivity（HEAD）
- 复现：`cabal run -v0 tsbase -- evidence-ch08-hexbin --data data/episodes/69-hexbin-balance-audit --out data/episodes/69-hexbin-balance-audit --evidence inventory/evidence`
- 派生：`python3 build/generate_hexbin_data.py`（本目录）

## Delivery

- 待渲染：8 场脚本与画面已就位；TTS 后重 dump 时间线，再跑 make。
