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

## 2. 状态（2026-10-31 10:1x 实测）

- 成片 **19 / 74**：E01–E09、E65–E74（全部 `status: ready`，**未发布 B 站**）。
- 算法 **45 / 190** 模块、**640** 条断言（ch02 22 模块；ch08 13；ch09 11）。
- 四仓 HEAD（E09 交付后）：video_project `489db36`（delivery；docs 提交紧随）、ts-base `e0cb04a`、ts-admin `8e256a2`、
  engine `a667688`；`node tools/check.mjs` = 90 films / 2 series / 0 error。
- E02 成片 `1105.01 s / 33,150 帧 / 8 场 / −15 LUFS / TP −2 dBFS`，298 cue、8 章、封面 4480。
- E03 成片 `1299.93 s / 38,998 帧 / 8 场 / −15 LUFS / TP −2 dBFS`，343 cue、8 章、封面 5610。
- E04 成片 `1480.90 s / 44,427 帧 / 8 场 / −15 LUFS / TP −2 dBFS`，351 cue、8 章、封面 6860。
- E05 成片 `1209.03 s / 36,271 帧 / 8 场 / −15 LUFS / TP −2 dBFS`，309 cue、8 章、封面 1519。
- E06 成片 `1374.73 s / 41,093 帧 / 8 场 / −15 LUFS / TP −2 dBFS`，346 cue、8 章、封面 1450。
- E07 成片 `1298.73 s / 38,962 帧 / 8 场 / −15 LUFS / TP −2 dBFS`，294 cue、8 章、封面 2259。
- E08 成片 `1343.89 s / 40,317 帧 / 8 场 / −15 LUFS / TP −2 dBFS`，332 cue、8 章、封面 3693。
- E09 成片 `1506.37 s / 45,191 帧 / 8 场 / −15 LUFS / TP −2 dBFS`，364 cue、8 章、封面 23891。
- E69 成片 `961.33 s / 28,840 帧 / 8 场 / −15 LUFS / TP −2 dBFS`，247 cue、8 章、封面 3984。
- E68 成片 `1123.81 s / 33714 帧 / 8 场`，316 cue、8 章、封面 2200。
- Docker `haskell-ts` 已启动：GHC 9.14.1（`/opt/ghc/9.14.1/bin`），`/root/ts-base` → `/work`，
  `/root/.cache/ts-haskell` → `/cabalhome`；容器内存限额 12 GiB / swap 16 GiB。
- 宿主机 `.wslconfig` 已改 memory=40GB/swap=24GB，但**需 `wsl --shutdown` 才生效**；本会话不执行。
- 下一步入口：**E10 `attention-block`**（production_order 索引 19，22–24 min）；score 继续复用
  `out/e04-score-loop-48k.wav`（1560 s，E10 ≤1560 s 直接 `--score=` 复用）。

## 3. 授权（增量自授权清单）

本会话新增 **A5**（见 `SELF-AUTH.md`）：按用户 2026-10-30 晚指令，**恢复全系列生产**，
无人值守逐集推进；仍未发布 B 站、仍只到 `ready`；每集验证后提交，提交说明附本文件与 A5 引用。
E05 起逐集增量授权记在 `ts-base/SELF-AUTH.md`（A12–A21），提交 body 同时引用对应条目。
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

## 5. 排期（production_order 剩余 55 集）

E01–E09 与 E65–E74 已交付；**ch02 八集全部完成**，成片 13.70 / 18.42 / 21.67 / 24.68 / 20.15 / 22.91 / 21.65 / 22.40 / 25.11 min。按 `production_order` 继续：
**E10 attention-block** → E11 rnn-lstm-gru → … → E64 llm-side-adapters。
每章开工前先读该章 `plans` 的 unit 清单与 `ALGORITHM-SPEC.md`，按"章批"实现该章全部算法，再逐集出片（沿用 A3）。

E05 冻结口径（E06 直接复用，别重新发明）：差分 `diff :: Int -> Maybe Int -> ...` 先 d 次普通再一次季节，输出长度 `n − d − d·L`；
对数入口拒绝非正（`LogNonPositive i v`），绝不加 1；Z-score 用总体 σ（除以 T）、返回 `(z, μ, σ)`、σ=0 拒绝。
数据在 `/root/ts-base/data/episodes/05-stationarize-three-ways/`（600519 730 行、000001 244 行、000693 4,487 含有 2,491 个零、
随机游走 10,001 点、异方差 5,000 点）。

E06 冻结口径（E07 起复用）：趋势核 `[1/(2m), 1/m, …, 1/(2m)]`，端点返回 `Nothing`，有效区间 `span = (m div 2, n − m div 2 − 1)`；
加法分解 ΣS=0、乘法分解 mean(S)=1；错误 `DecompBadPeriod / DecompTooShort / DecompNonPositive i v / DecompZeroSeasonal i v`，门槛 `m ≥ 2 且 n ≥ 2m+1`；
两个强度指标的分母**各去各的**：`F_trend = max 0 (1 − var(R)/var(X−S))`、`F_season = max 0 (1 − var(R)/var(X−T))`，用总体方差、分母退化返回 `Nothing` 对外取 0，乘法口径在 log 尺度上算。
数据在 `/root/ts-base/data/episodes/06-decomposition-and-strength/`（600519/000001 各 730 行、5 分钟 240 根、上证 2015 平盘 120 行、synthetic 240 行）；
成片 score 继续用 `out/e04-score-loop-48k.wav`（1560 s，E07 若 ≤1560 s 直接 `--score=` 复用）。

E07 冻结口径（E08 起复用）：FFT 正变换不归一化、逆变换除 N′，用 Parseval 钉约定（相对误差 8.47e−16）；长度非 2 的幂时**尾部补零到下一个 2 的幂**（730→1024），补零不提高分辨率；频带用 Hz 给，实序列滤波同时处理 k 与 N′−k，IFFT 后取实部；
基展开系数书中未给（式 2.39），本仓用最小二乘（正规方程 + Cholesky），坐标先 u=t/n 再 v=2u−1；傅里叶基每谐波成对 sin/cos；错误 `BasisEmpty / Underdetermined n k / SingularDesign`；
Patch 严格 `N = floor((L−P)/S) + 2`，**切片前末尾填 S 个最后一个值**（不补零），S=P 且截掉填充可逐位还原、S<P 重叠按出现次数平均；
数据在 `/root/ts-base/data/episodes/07-fft-basis-patch/`（日线 730 行、5 分钟 240 根、图 2.12 合成信号）；score 继续用 `out/e04-score-loop-48k.wav`（1560 s）。

E08 冻结口径（E09 起复用）：ADF 的 τ = γ/se，**服从 DF 非标准分布**，不是 t 值；临界值用 MacKinnon 大样本三档（常数 −3.43/−2.86/−2.57，带趋势 −3.96/−3.41/−3.12），滞后 `p = floor(12(n/100)^(1/4))`（n=500→17；有效观测 234 时落地为 15），SE 用 Householder QR（不用正规方程），秩亏返回 `Left`；
漂移性 m=9、九个不重叠窗口的中位数，minmax 用九个中位数**自身的 range**（严格单调恰 0.5，单边斜坡实测 0.4977）；
转移性三状态 floor+clamp 分箱，M′ 行归一化（零行保零）、列方差除以 3，完美周期 2/3、常数 2/9（不是 1/9，单符号 2/9 是零行把列方差拉到 1/9 的结果）；
数据在 `/root/ts-base/data/episodes/08-adf-shifting-transition/`（600519 2188 行取最后 250、002456 725 行、符号序列各 250）；score 继续用 `out/e04-score-loop-48k.wav`（1560 s）。

E09 冻结口径（E10 起复用）：MLP/TCN 都只用**严格因果**——卷积核翻转后左补 `(K−1)·d` 个零，输出长度等于输入长度；
感受野 `RF = 1 + (K−1)·Σd`（K=3、Σd=7 → 15，用支撑集断言钉住，不依赖训练）；
数组一律**通道主序** `c·T + t`（卷积输出也是），两层布局黄金 `[0,0,1,2,5,10]` 钉死；残差只在 `C_in == C_out` 时加、加在激活之前；
训练配方**不是书里的**（书 ch2 §2.4 无训练配方）：Xavier、Adam(1e-3, β=(0.9,0.999), ε=1e-8)、batch 64、patience 5、tanh 隐层 + 线性输出头、
MSE（不除 2、不除 batch）、自写 `splitmix64` 随机源保证同 seed 逐位一致；参数量显式导出：MLP 60→32→1 = **1985**、TCN（1→16、16→16、16→16 + 线性头）= **1649**；
数据在 `/root/ts-base/data/episodes/09-mlp-and-tcn/`（600519 5,033 行、000001 4,953 行，MLP 窗口 60 / TCN 窗口 12，按行取窗、停牌即无行不补）；
score 继续用 `out/e04-score-loop-48k.wav`（1560 s，E09 实测 1506.37 s）。

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
- TSX 版心是 `G.pad = SPACING.pageMargin = 72` → 内容宽 **1776**（不是 1856）；三卡行（600×3+gap26）必须缩到 574。
- TTS 单条重录的键是 `scene#index`（如 `--only 'definitions#35'`），写成 `definitions-35` 会 synth 0 条再因缺 clip 报错。
- `dump_script.mjs` 把 `lines.json` 写进**引擎**的 `data/<film-id>/`，不是 pack；TTS 在 pack 里跑，必须把这一个文件 `cp` 回 pack 的 `data/`，否则 `FileNotFoundError: 'data/lines.json'`。
- film 声明了 `narration` 就必须真有 `assets/audio/narration.wav`（gitignore）：先 `python3 build/make_narration.py` 拼，再 make；否则 content check 报 `narration is missing`。
- 封面帧不要落在 `Build at` 的起点：`coverFrame` 取该页 gate 全部结束之后、且字幕间隙内（E06 的 1250 正好是 `.26` 起点，右栏全空；1450 才完整）。
- 静帧要看**页中点帧**：`Pages at` 的下一段起点前的中点必须有内容，gate 晚于中点就会出现「静帧空白」假象；页多时宁可拆页（E06 verification 5→6 页）。
- 新集 score 不要直接重渲染（1210 s 单线程 >1 分钟仍未出、30 分钟级）；先 `--score=` 复用已有最长 bed 再 atrim。
- WSL 冷启动后 Docker 容器不自动起：`docker start haskell-ts`，再 `cabal build all`。
- 页间淡变必须**重叠**：`Pages` 的退场 `outO` 窗口写 `[b, b+fade]`（不是 `[b−fade, b]`），否则边界帧两页同时透明、flicker 门判 blink（E07 outro frame 37684/38093 depth 5.5/5.2）；outro 等亮页的内容 Build 要早于跨页淡入（E07 提前到 `lf 0.36/0.55`）。
- 画面标注分析点数与展示点数要分开：E07 CSV 只导合成信号前 1000 点，FFT 实际 4096 点（bin 0.244 Hz），「10 Hz 不在整格」只对 4096 点成立；标题/字幕写「分析 4096 点 · 图中前 1000 点」。
- `film.json` 没写 `publish.coverFrame` 就开 make：publish 阶段按**默认 180 帧**出封面（纯标题黑场，E08 踩过）；补字段后单独重跑 `publish.mjs --cover-frame=N` 再 `cp` 回 delivery，比整轮 make 便宜。
- `sync` 会清空引擎 `data/<film-id>/`：每次 sync 后必须重跑 `dump_script.mjs` 再 `cp` lines.json 回 pack，TTS 与 `make_narration.py` 都依赖它。
- `script_check` 对短句报 cps 3.1–3.4 是 TTS 固定停顿的噪声（E07/E08 各约 9–13 条），不是语速错误，不必改稿。
- 讲稿按 CPS 4.5 估的时长与 TTS 实测可差 ±30 s（E08：估 1,372.27 s、实测 1,343.89 s）：场景起点整体漂移，still lint 帧号、封面候选、flicker 的 cut-frames 都要按实测 lines.json 重算。

- Haskell 源里写 lambda 不要走 write/edit 工具：它们会解释字符串转义，`\k ->` 的反斜杠被吞成 `k ->`（GHC-31244），`\t`/`\n` 变真控制字符；这类文件改用 python 脚本 chr(92) 回写。
- 卷积数组布局：输出必须通道主序 `c·T+t`（`co = idx div t`）；写成时间主序 `t·C+c` 时单通道单层测试仍全过，多层梯度误差 1.29–1.95；用两层布局黄金 `[0,0,1,2,5,10]` 钉死。
- 手写反向传播：δ 列表从 `go 1` 起（`go 0` 会多算输入层 δ_0），取梯度按层序（`deltas !! li`）；错序时梯度检查相对误差约 1.96。先跑单层梯度检查（应 <1e-9）再跑多层，可二分「梯度错 vs 训练慢」。
- `Row` 组件别写死像素列宽（470+300 最小需 770 px）：窄卡片会把注释列压成 0 宽、每字一行并溢出；改成 `width:100% + maxWidth`、列用百分比、注释 `minWidth:0`。
- 静帧临时渲染器必须在引擎目录（放 /tmp 会 `ERR_MODULE_NOT_FOUND @remotion/bundler`），且 `process.argv` 传帧号要 `join(",").split(",")`，否则 `frame NaN` 直接 RangeError。
- 字幕间隙不一定有：E09 全场只有 7 段平台（全是场景交界约 3.4 s），封面只能在交界帧里挑；先按 lines.json 算空隙再选帧，不要凭页末帧猜。

## 9. 断线恢复（60 秒）

```bash
cd /root/video_project && git status --short && node tools/status.mjs --md | grep -c ready
cd /root/ts-base && git log --oneline -3 && ls data/episodes | tail
docker ps --format '{{.Names}} {{.Status}}' | grep haskell-ts || docker start haskell-ts
```

然后读本文件 §5 的"下一步"，从该集流水线第 1 步继续；**不要在旧会话的聊天记录里找状态**，
四仓的 git log + `production-log.md` + 本文件就是全部真源。