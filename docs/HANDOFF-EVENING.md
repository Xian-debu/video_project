# HANDOFF-EVENING — tsint 全系列无人值守生产（2026-10-30 晚）

> 本文件是 2026-10-30 晚间新会话的**唯一操作入口**，取代 `docs/HANDOFF.md` 的"暂停"状态。
> 旧交接单保留为历史记录（E67 及之前的数字仍有效），但**进度与授权以本文件为准**。
> 断线、重启、上下文丢失后：先读本文件 → `STATUS.md`/`git log` → 从"下一步"继续，不要从头侦察。

## 1. 用户指令（2026-10-30 晚，m00001）

用户要求承接 `session-b3e7ef20-c047-4654-acb5-00dd60d2fcc7` 的工程，**高水准跑完剩下的全部系列**：

- 每个视频不可糊弄，**长度不限，必须讲清楚内容**；依据 `ts-base/plans/series.json` 的规划，
  **一集一集生成，经验证后 git 提交**；不限 token。
- 这是极大系列（74 集），需要**特别精细的规划与 git 管理**，避免混乱。
- 注意上一会话的**任务中断问题**（WSL 重启过一次）。按计划一一实践推进、逐步验证后提交；
  工程化的目的只是方便发布、迁移、复现、管理、回退。
- 用户不盯着，**全部授权**无人值守跑到底；唯一附加要求：**git 提交时单独增量提交一个自授权清单**。
- 允许把上述内容提交到 video_project / ts-admin / ts-base 的规划中，并**制定 goal 防断**.

## 2. 状态（2026-10-30 18:0x 实测）

- 成片 **10 / 74**：E01、E65、E66、E67、E68、E70–E74（全部 `status: ready`，**未发布 B 站**）。
- 算法 **22 / 190** 模块、**308** 条断言（ch09 11/142；ch08 E65 3/37、E66 3/46、E67 3/50、E68 3/66）。
- 四仓 HEAD（E68 完成后）：video_project `32290a0`、ts-base `255dc3f`、ts-admin `a37e35a`、
  engine `856d804`；`node tools/check.mjs` = 90 films / 2 series / 0 error。
- E68 成片 `1123.81 s / 33714 帧 / 8 场 / −15 LUFS / TP −2 dBFS`，316 cue、8 章、封面 2200。
- Docker `haskell-ts` 已启动：GHC 9.14.1（`/opt/ghc/9.14.1/bin`），`/root/ts-base` → `/work`，
  `/root/.cache/ts-haskell` → `/cabalhome`；容器内存限额 12 GiB / swap 16 GiB。
- 宿主机 `.wslconfig` 已改 memory=40GB/swap=24GB，但**需 `wsl --shutdown` 才生效**；本会话不执行。
- 下一步入口：**E69 `hexbin-balance-audit`**（规格见 `ts-base/plans/series.json` 第 69 项，
  设计要点：PCA 二维全秩旋转 + 六边形网格 + 集中度；E68 冻结决定见 §6，E69 冻结决定见 §7）。

## 3. 授权（增量自授权清单）

本会话新增 **A5**（见 `SELF-AUTH.md`）：按用户 2026-10-30 晚指令，**恢复全系列生产**，
无人值守逐集推进；仍未发布 B 站、仍只到 `ready`；每集验证后提交，提交说明附本文件与 A5 引用。
每个仓的每次提交都在 commit body 末尾带一行：

```
self-auth: A5 (video_project) — 全系列无人值守恢复；详见 docs/HANDOFF-EVENING.md §1/§3
```

## 4. 每集流水线（固定 12 步，脚本化程度越高越好）

1. **侦察**：读 `ts-base/plans/series.json` 该集全部字段（algorithms/impl_notes/tests/demo/
   concepts/book_figures/verification/risks/data）；读对应书页原文（PDF 页 = 印刷页 + 8）；
   核对书页公式与计划里的数学，发现冲突先记到该集 `plan.md` 的"口径决定"。
2. **算法**（ts-base）：扫 AGENTS 与既有 `src/TsBase/Algos/ChNN/` 模式；实现 ≤3 个独立模块
   + Haddock 说明书页/规则/决定；`Algos/**` 之间不互相 import。
3. **测试**（ts-base）：`test/Algos/ChNN/*Spec.hs`（黄金值、不变量、边界、错误路径），
   `test/Spec.hs` 增 suite；`cabal build all && cabal test` **全绿**。
4. **提交 1**（ts-base）：`algos(chNN): <模块> — <一句话>`（含 SELF-AUTH 行）。
5. **数据**（ts-admin）：只读导出脚本（`tsa.api.Lake`）+ manifest（rows/first/last/sha256/
   source commit）；`DEFAULT_OUT` 指向 `/root/ts-base/data/episodes/<NN-slug>`；单集 ≤5 MB；
   运行 `.venv/bin/python`，核对行数与范围。**提交 2**（ts-admin）：
   `export(chNN): <数据> — <行数/区间>`。
6. **证据**（ts-base）：`app/ChNN*Evidence.hs` 生成 `data/episodes/<NN-slug>/summary.json` +
   `inventory/evidence/chN-*.json`（schemaVersion/unitId/episode/commit/env/data sha256/
   metrics/tests/checks）；`cabal run evidence-...` **可重复**（同输入两次逐字节一致）。
   **提交 3**（ts-base）：`evidence(chNN): <集> — <关键数字>`。
7. **pack**（video_project）：按既有 8 场六段结构写 `src/*.tsx`（场景组件）+ `build/*.py`
   （确定性派生）+ `data/claims.json`（屏上每个数一条）+ `script.ts`（讲稿，数字从 data 取）；
   先跑 `node tools/check.mjs`，再 `films.mjs sync`。
8. **静帧复核**：`npm run stills`（或 make 的 stills 阶段）逐场看关键帧；**不是只看指标**。
   修排版、字数、公式越界；TeX 一律 `String.raw`；`FT.h3` 不存在（用 h2/h4）。
9. **配音 + 渲染**：`voice.json` 时长对齐讲稿；`films.mjs sync` → `make.mjs --film=<id>
   --score=/root/video-pipeline-blueprint/out/<score>.wav`；score 优先复用 822 s（E01 seed=11）。
   成片超过 822 s 时按 E67 的方式拼接（两份 6 s 交叉淡化 + 48 kHz 重采样）。
10. **门禁**：loudnorm（I∈[−16.5,−13] LUFS、TP≤−1.5 dBTP）、music gate（bed vs speech ≤−5 dB）、
    flicker、content check（HEAD 与 registry 一致）、`delivery/` 全件（mp4 不入库）。
11. **提交 4**（video_project）：`tsint/NN-slug: <成片一句话> — <时长/断言/关键数>`；
    再补 `delivery` 与封面/文档提交（**一集内可 2–3 次提交，均带 SELF-AUTH 行**）。
12. **记录**：`docs/production-log.md` 追加该集条目（ts-base/ts-admin/video 提交、成片时长、
    卡点、返工次数、与计划偏差、下一集）；更新 `STATUS.md`（`node tools/status.mjs --md`）；
    `docs/HANDOFF-EVENING.md` §2/§5 的进度数字；四仓 `git status` 干净后进入下一集。

## 5. 排期（production_order 剩余 64 集）

ch08 收尾：E68 已完成；**E69 hexbin-balance-audit**（共用 822 s score 与 ch08 视觉语法）。随后按 `production_order` 顺序：E02 missing-values → E03 sma-wma-ses →
E04 holt → E05 stationarize → E06 decomposition → E07 fft → E08 adf → E09 mlp-tcn → … →
E64 llm-side-adapters。每章开工前先读该章 `plans` 的 unit 清单与 `ALGORITHM-SPEC.md`，
按"章批"实现该章全部算法，再逐集出片（沿用 A3）。

## 6. E68 已冻结的设计决定（避免重新发明）

- **8 张采样图 = 6 种合法策略 + 2 个反例**：合法 = 随机窗口 / 均匀窗口 / 前端窗口 /
  后端窗口 / 前端点 / 后端点（书图 8.6 只有这 6 行，"4 窗口 × 2 段 = 8"是计划外推）；
  反例 = 随机散点、等距抽样（p.204 明说点采样"无法随机离散选择点"）。每张图都画 **50 个点**。
- **数据口径**：ts-admin 导出 1200 点单票日线（如 000001.SZ）；**前 1000 点**为训练窗口
  （5% → **50 点**），**后 200 点**为完整测试/验证集（只切训练集，测试集不动，与 E67 一致）。
- **取整策略**：`k = max 1 (round (rho * n))`（n=1000,ρ=0.05 → 50；n=10 → 1，画面标注
  "书中未规定取整，本仓取至少 1 点"）；窗口采样把 1000 点切成不重叠窗口、取整窗数。
- **337 参数的手算**：`2×16+16=48`，`16×16+16=272`，`16×1+1=17` → **337**（输入 2 维：
  t−1、t−2 两个滞后）；**输入 1 维是 321**。计划写"1→16→16→1 = 337"是笔误，片上并列 321/337
  说明差异，并把 337 作为自检黄金值。
- **效率三件套**：参数量 |θ|（本仓补充指标，书 p.207 七项里没有）、训练/推理耗时（warm-up 3
  次取 7 次中位数）、峰值内存（`+RTS -s` 的 max residency，不是 GC 前 heap）；三规模 MLP
  8/32/128 画"成本-误差"散点，**效率必须与精度一起报**。

## 7. E69 已冻结的设计决定（开工即用，避免重新发明）

- **窗口 = 32 步 × 2 维特征**：单票 32 个交易日窗口压成 (均值 μ, 波动 σ) 两点特征 → 5 万窗口
  （20 只 × 约 2,500 天）。这样 PCA 的协方差是 2×2，**特征值有闭式解、全秩旋转可逆**，
  才可能满足"反变换重构 <1e-10"；书里并未给公式（B 级证据，片子标注"本仓实现"）。
- **标准化**：逐维 z-score 后再 PCA，否则价格量级会垄断第一主成分（impl_notes 第 2 条）。
- **hexbin 坐标**：中心 = (col + 0.5·(row mod 2), row·√3/2)，用固定公式而不是取整；
  相邻 bin 不能错位。空 bin 与单样本 bin 分开统计（长尾）。
- **集中度定义**：按 bin 样本数降序，取前 20% 的 bin，计算它们覆盖的样本比例；
  阈值 60% 是**本仓设定**（书中无此数），画面与 plan 都要标注。
- **对照**：20 只股票 panel 版本 vs 只用 3 只蓝筹（如 600519/601318/600036）版本，比较集中度。
- 数据 ≤5 MB：ts-admin 只导 close（20 票 × 约 2,500 行），窗口与 PCA 在 Haskell 里算；
  散点图在 pack 里下采样到 5,000 点，hexbin 网格 40×40 全量入 pack。

## 8. 已知坑（上一会话踩过，直接规避）

- 容器 12 GiB 上限挡宿主 OOM；但**无限列表仍会 OOM-kill 测试**（`[0, 0 .. 6]` 步长 0），
  测试里永远写有限列表。
- `make` 的 content check 要求内容仓已提交且 HEAD 与 registry 一致：**先提交再 sync 再 make**；
  `derived` 产物不得入库（`git ls-files` 为空）。
- 封面：`film.publish.coverFrame` 必须给（E67 起 make 自动用），不能留 180 帧黑场。
- TSX 里 TeX 必须 `String.raw`；`FT.h3` 不存在；卡片固定高度要留 footer 空间（still 复核）。
- 混音采样率 44.1 vs 48 kHz 必须重采样；score 超过 822 s 用交叉淡化拼接而不是重渲染
  （重渲染 1365 s 需 >14 min，且易 OOM）。
- `films.mjs check --strict` 对 mount 哈希敏感：手改挂载点后必须重新 `sync`。
- WSL 冷启动后 Docker 容器不自动起：`docker start haskell-ts`，再 `cabal build all`。

## 8. 断线恢复（60 秒）

```bash
cd /root/video_project && git status --short && node tools/status.mjs --md | grep -c ready
cd /root/ts-base && git log --oneline -3 && ls data/episodes | tail
docker ps --format '{{.Names}} {{.Status}}' | grep haskell-ts || docker start haskell-ts
```

然后读本文件 §5 的"下一步"，从该集流水线第 1 步继续；**不要在旧会话的聊天记录里找状态**，
四仓的 git log + `production-log.md` + 本文件就是全部真源。
