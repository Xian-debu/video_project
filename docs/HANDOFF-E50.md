# 交接文档（2026-11-03 早，E50 完成后封存）

> 本文件取代此前所有交接文档：docs/HANDOFF.md、HANDOFF-EVENING.md、HANDOFF-NEXT-AGENT.md、HANDOFF-E41.md ~ HANDOFF-E49.md 自本文件起只作历史存档，**不要按旧文档继续工作**。
> 旧文档里的「下一步」已全部过期；以本文件末尾的进度与工作规范为准。

## 0. 一句话现状

- 视频系列 tsint 已交付 **60 / 74 集**（E01–E18、E19–E50、E65–E74），最新一集 **E50 50-model-selection-skeleton** 已 end-to-end 完成（算法 / 证据 / 数据 / 讲稿 / 配音 / 渲染 / 交付 / 文档 / 提交），成片 18:19.6。
- **目标（goal）处于 active + armed**：objective 是「逐集完成」，不发布 B 站，status 停在 ready；如果会话中断后恢复时 goal 变成 disarmed，人类说「继续」就 `update_goal action=resume`。
- **永远不要发布到 Bilibili**。每集结束时 film.json 的 status 必须是 `ready`（不是 published），`bili` 字段保持 null。
- 下一集：**E51 `51-ga-search-incremental`**，标题《省算力的两把刀：遗传算法与学习曲线外推》，预估 **18 分钟**，chapter ch06，是 ch06 的最后一集。E50 的 outro 把主题收成「少算几次、能不能一样选对」，E51 直接从这两把刀接。

## 1. 四个仓库与它们的关系

| 路径 | 角色 | 谁写 |
| --- | --- | --- |
| `/root/ts-base` | Haskell 算法库 + 单测 + 证据程序（每集的读数都由它产出） | 算法模块 `src/TsBase/Algos/ChNN/*.hs`、测试 `test/Algos/ChNN/*Spec.hs`、证据 `app/ChNN*Evidence.hs` |
| `/root/ts-admin` | 数据湖导出脚本（日线 / 分钟线 → CSV + manifest） | `inventory/scripts/export_chNN_*.py` |
| `/root/video_project` | **内容仓**：每集一个 pack（画面源码 + 数据 + 讲稿 + 交付），以及全仓文档、schema、工具 | `series/tsint/episodes/<NN-slug>/` |
| `/root/video-pipeline-blueprint` | **渲染引擎**（Remotion + make 流水线）。引擎不知道任何片名，按 film 清单挂载内容仓 | 一般**不改**；只有引擎 bug 才动，且要单独提交 |

挂载方向：**内容仓是源，引擎是挂载点**。改内容只改 `/root/video_project` 里的 pack，然后 `node scripts/films.mjs sync` 拷进引擎（`src/tsint-NN-...`、`data/tsint-NN-...`）。反向编辑引擎副本会被下一次 sync 覆盖。

系列计划在 `/root/ts-base/plans/series.json`：顶层 dict，`episodes` 是 list（74 项，**按 order 排序，不是交付顺序**），每项有 slug / title / thesis / chapter / algorithms（unit_id / module / api / math / impl_notes / tests / demo / figures）/ verification / data 要求。**开工前先读它**。

## 2. 工具链（全部在本机，无外网依赖）

### 2.1 Haskell（GHC 不在 PATH）

~~~bash
docker exec haskell-ts bash -lc 'export PATH=/opt/ghc/9.14.1/bin:$PATH && cd /work && cabal build all'
docker exec haskell-ts bash -lc 'export PATH=/opt/ghc/9.14.1/bin:$PATH && cd /work && cabal test'
~~~

稳定跑法：把命令写进 `/tmp/eNN_*.sh` → `docker cp` 进容器 → `docker exec haskell-ts bash /tmp/eNN_*.sh`。**别在 `bash -c` 的双引号里写 `$PATH`**，会被吞成空串导致 `cabal: command not found`。容器内存上限 **12 GiB**，超了 exit 137。

E50 的算法与证据都是**纯计算**，证据 **26 条 / 21.4 s**（不是 E49 那种几分钟级），所以本集规则是「改断言 → 秒级重跑」。E50 新增 3 个模块 14 个用例后，全仓 **146 套测试 / 1,968 断言**全绿（测试输出 `algos.ch06.metrics: 5/5`、`modelsel: 4/4`、`gridsearch: 5/5`）。

### 2.2 Python / 数据

- 数据湖入口：`from tsa.api import Lake`（在 ts-admin 仓根用 `.venv/bin/python`，系统 python 没有 duckdb）。`Lake.daily / panel / minute / instruments`；返回 pyarrow Table（`.to_pandas()`）。
- 湖表：`instruments(code,name,market,board,list_date,delist_date,is_st,industry,updated_at)`、`index_members(...)`、`bars_daily(...)`、`index_daily`。
- **`bars_daily.amount` 全列为 NULL**（E49 实测 672,637 行无一非空）——任何按成交额排序的取样都会退化成按代码排。选股票统一用**行业分层**（HS300 成分数 ≥ 5 的门类各取一只）。
- `index_members` 只有 **2026-10-30 一期快照**，没有历史成分；所有集都按「快照 + 每只股票自己的连续有效段」切窗，偏差写进 manifest。
- **E50 可复用的数据**：`/root/ts-base/data/episodes/50-model-selection-skeleton/daily.csv`（20 只行业分层股票、后复权收盘、2,412–2,431 根、2022-01-01 / 2024-01-01 切分）。E51 就在这份数据上做 GA 与增量外推，**不用重新导出**；需要新字段再动脚本。
- E50 的实际口径：HS300 快照 300 只 → 行业分层 20 只（每个门类取有效交易日最多的一只）→ 取各自最长连续段（`MAX_GAP_DAYS=20`，10 天会被 2020 春节 11 天假断段）→ `MIN_TRAIN=1500`。

### 2.3 配音（TTS）

虚拟环境 `/root/.venvs/tts`（edge_tts 7.3.1），音色 `zh-CN-YunyangNeural`；系统 python3 **没有** edge_tts。脚本从上一集拷 `build/tts_narration.py` 与 `build/make_narration.py`：

~~~bash
cd <pack>
/root/.venvs/tts/bin/python build/tts_narration.py --lines data/lines.json --clips assets/audio/clips --voice-out data/voice.json --clips-json data/clips.json --concurrency 6
python3 build/make_narration.py     # 生成 assets/audio/narration.wav
~~~

**片段缓存按 `scene#index` 命名**，不看文本内容；改一句台词必须手动删对应 mp3 再跑（`--only=<scene#idx,...>` 可只补这几句）。脚本会跳过「已存在且 > 800 B」的 mp3——**改稿后要清空 clips 目录**才会重录。

**时间轴两轮 dump（E50 又踩了一次）**：`script.ts` 里 `voice.json` 的 import 路径必须写引擎挂载路径 `../../data/<film.id>/voice.json`；dump 必须在 `films.mjs sync` 之后对**引擎副本**跑。顺序固定：**TTS → sync → dump（实测）→ cp 回 pack → make_narration**。E50 第一版按估算 1,087.79 s 摆 narration，实测 1,099.61 s，重摆一次。

E50 读数：320 行 / speech 904.2 s / mean 2.83 s / narration.wav 105,562,604 B。

### 2.4 静帧预览与渲染

~~~bash
cd /root/video-pipeline-blueprint
node scripts/make.mjs --film <film-id> --score=out/e04-score-loop-48k.wav
~~~

**`--score` 一定要带**：不带会现场合成一条二十分钟的分数字床，单核实测 23 分钟还没跑完；共享床是 `/root/video-pipeline-blueprint/out/e04-score-loop-48k.wav`（1560 s，48 kHz）。

**先 content 提交，再 sync，再 make**：make 的 content check 会拦 dirty，也会拦「提交后 HEAD moved 但没 sync」。E50 首轮 make 就是被 `x content HEAD moved (7b765609… -> 3704b93…); run sync` 拦下的。流程固定成：**改完 → commit → sync → check --strict → make**。

单帧预览：`npx remotion still <Comp> /tmp/x.png --frame=<f> --scale=0.34`（在引擎根跑）。**抽帧时避开页面切换**：`Pages` 有 12 帧淡入淡出，正好落在两页之间时 still_lint 会把两页文本报成重叠（E49 因此虚报 39 处）；把采样点偏移 18 帧就 PASS。

## 3. 一集的标准流水线（未变）

1. **读计划**：series.json 第 N 项 + 书页。thesis / 算法 / 页数 / 数据配方是硬约束；湖里凑不齐或计划自相矛盾就如实记 deviation，不凑数。
2. **算法模块**：`src/TsBase/Algos/ChNN/<X>.hs`，纯函数、无外部数值库。在 ts-base.cabal 的 exposed-modules 与 test other-modules 注册，`test/Spec.hs` 加 import 与 runSuite。
3. **单测**：`test/Algos/ChNN/<X>Spec.hs`，黄金值写绝对值；浮点比较用容差（cos(π/2) = 6.1e-17，别用精确相等）。
4. **证据程序**：`app/ChNN<Name>Evidence.hs`，`runEvidence :: FilePath -> FilePath -> FilePath -> IO ()`；自己维护 checks（分组）、写 `summary.json` / `checks.txt` / `<episode>.chN-*.json`；跑完打印 `checks: P/T in S s`。`app/Main.hs` 加 dispatch 与 usage，**dispatch 分支缩进 4 空格**（2 空格报 `parse error on input '->'`）。**`--evidence` 传文件路径，不是目录**。
5. **数据导出**：ts-admin 写 `inventory/scripts/export_chNN_*.py`，输出到 `/root/ts-base/data/episodes/<slug>/`（CSV + manifest.json）。提交 ts-admin，并写 ts-admin 的 SELF-AUTH。
6. **跑证据到全绿**：先小样本再接全量；失败看 checks.txt 的分组名定位。全绿后提交 ts-base（数据 / 算法 / 证据分开提交）。
7. **生成 pack 数据**：`build/make_dist_data.py` 读证据 JSON + manifest，产出 `data/dist.json`（画面所有数字的唯一来源）；**每个字段都要和证据 JSON 对得上（不一致就 `EVIDENCE MISMATCH` 退出）**；JSON 里不能出现 `Infinity`。
8. **写画面**：`src/shared.tsx`（类型 + 组件 + `M`）、`src/script.ts`（8 场：页数 + 旁白 + PAGES_INDEX）、`src/scenes/*.tsx`、wrapper。先写旁白，再按旁白写页。E50 节奏基准：**每页 10 句、每场景 10 的倍数**，32 页 320 行 ≈ 18 分钟（E49 是 38 页 380 行 ≈ 24 分钟）。
9. **配音**：见 `2.3，注意两轮 dump。
10. **静帧复核**：按每页首句渲全部页面（E50 32 张，约 10 分钟），拼联系表逐页看——**既看版式，也核口径**（数字对不对、下集预告字段是不是下一集的、页头 goal 与证据实测一致吗）。E50 在 32 页里抓到 2 处（公式折行、代码路径写错）。
11. **内容提交**：`node scripts/films.mjs check --strict` 必须 0 error。提交 pack 源：`tsint/NN-slug: content — …`；再单独提交 film.json ready。
12. **渲染**：`films.mjs sync` → make（带 `--score`）。先提交再 sync 再 make。
13. **交付**：make 的 `--out` 直接指向 pack `delivery/`；mp4 / wav / report.json / scenes / stills / score.meta 不入库，cover/srt/chapters/ffmeta 入库。
14. **收尾**：plan.md 补实测 + Delivery；SELF-AUTH 加一条；production-log 加一节；STATUS.md 那行改 `ready | - | yes | ok | 11 | -`；写本文件下一版；提交 delivery（含 docs）。**写含反引号/长 Markdown 的段落用 tools.write 写临时文件再 cat 追加，别用 JS 模板或 shell printf**。
## 4. 当前进度（E50 完成时）

- ts-base：`5f2582b`（manifest commit 字段）← `74443c9`（per-stock 读数）← `b159569`（`app/Ch06ModelSelEvidence.hs` 26 条 / 21.4 s）← `7c33a93`（Metrics / ModelSelection / GridSearch 三模块 + 14 用例）← `3decbdc`（数据）。工作区干净。
- ts-admin：`a8135a4`（`inventory/scripts/export_ch06_modelsel.py`：HS300 快照 300 只、后复权、行业分层 20 只、`MAX_GAP_DAYS=20`、`MIN_TRAIN=1500`、2022-01-01 / 2024-01-01 切分）。
- video_project：E50 content `3704b93` + ready + delivery + docs（本次）。
- 引擎：未改（`a667688`）。
- E50 读数：**覆盖率 pool3 0.75（15/20）/ pool5 0.85（17/20）/ 全池 1.00**；**Hit@1 0.50 / 0.50 / 0.55**、Hit@2 0.60、Average Rank 2.35；预筛 **96,790 → 62,716（省 35.2%）**、Top-4 召回 0.85、season_m12 = 0、pruned 40；**flips 10/20**；网格 **648 → 81**；AIC 黄金值 **206**；黄金值 MAE 0.5 / MSE 0.4167 / RMSE 0.6455 / MAPE 27.7778% / Acc@3 0.6667；真值分布 naive 14 / drift30 2 / sar12 2 / ar1 1 / sar5 1；证据 26/26。
- 10 候选 test MAE：naive 10.3148、drift30 11.3161、exp0.2 16.9688、exp0.5 12.1423、ar1 10.4364、ridge(1e-3) 10.4866、ridge(1) 10.4856、sar12 10.4252、sar5 10.4137、hmean5 15.9035。
- 成片：1,099.6 s / 32,988 帧 / 8 场 32 页 / 320 cue / −15 LUFS / TP −2 dBFS / LRA 2.3 / mp4 52,616,637 B / tree `cdbaa9fade4d1c93`；mix peak −1.32 dBFS、RMS −26.68 dBFS；闪烁 mean 20.93 / mean|d| 0.0137 / p99 0.1089 / max 6.88 / 7 切点。

## 5. E51 的开工顺序（建议）

1. 读 `plans/series.json` 里 slug `ga-search-incremental`（chapter ch06、runtime 18 min）。两个算法单元：
   - `ch6-ga-search` → `TsBase.Algos.Ch06.GaSearch`：`evolve :: GaParams -> (Chromosome -> Double) -> Population`、`crossover`、`mutate`。要点：**可复现的纯随机流**（固定 seed，同 seed 两次逐代 best 完全一致）、**repair 算子**（交叉后可能出 p=3 但 d 已被特征锁的非法染色体）、**适应度缓存**、**精英保留 2**、种群 **20 × 10 代 = 200 次训练**（对照网格 648）。测试黄金值：f(x) = −(x−3)²、x ∈ {1..5}、种群 6、2 代后 best = 3.0（适应度 0）；每代规模恒定；精英代际非降；同 seed 可复现。
   - `ch6-incremental` → `TsBase.Algos.Ch06.IncrementalSearch`：`learningCurve :: FittingFn -> [Double] -> [(Int, Double)]`、`extrapolate :: [(Int, Double)] -> Int -> Double`、`pruneByCurve :: Double -> [(Int, Double)] -> [Int]`。要点：阶段点 ≥ 3 且取**训练量翻倍**的对数点（12.5% / 25% / 50%）、外推必须截断（≤ 4× 最大观测点）、学习曲线在数据量小时陡降。
2. 数据直接用 E50 的 `daily.csv`（20 只 × 三切分），**不用重新导出**；如果 GA 的染色体要「特征+模型+超参」，候选集沿用 E50 的 10 个 spec，超参在解码时填。
3. 计划 thesis：「增量外推只用 **40% 的训练量**就复现全量遍历的 Top-2 集合（**Accuracy@2 ≥ 0.8**）；同样预算下 GA 并没有更好——它的优势只在超参空间大到搜不完时才出现。」**这是可以输的预言**：如果 40% 复现不到 0.8，照 E48/E49/E50 的做法照实讲，把阈值写进 boundary，不调参救。
4. 证据 20–30 条量级；画面 8 场、32 页上下、旁白 10 句/页（E50 的 320 行 / 18:19 是最近基准）。
5. 别忘了 outro 的下一集卡：E52 的 title 与 minutes 从 `series.json` 第 52 项读，不要凭印象写。

## 6. 已知欠账 / 风险

- `python3 plans/check_evidence.py` 仍会崩：inventory/evidence 里有 5 个历史 JSON 是坏的（33/34 summary、ch2 三个），属 A73 同类未转义引号 bug，可做一次 chore 修复。
- E50 的结论只到「池子抬上限、命中被验证噪声锁住」：单指标（MAE）、20 只股票、10 个手挑候选、单次切分。后续集不要把它说成「扩池没用」——覆盖率确实从 0.75 抬到 0.85，是命中没跟上。
- E51 的两个算法都要**随机性可复现**；GA 如果不固定 seed，逐代 best 会飘，证据里的「同 seed 一致」断言就是防这个的。别用全局随机状态，自己写 splitmix 或固定种子的 pure 流。
- 每集交付前必须重新 sync；引擎 `out/` 里不得留 `tsint-*` 残留，pack `delivery/` 里只入库 cover/srt/chapters/ffmeta。

## 7. E50 修过的坑（下一集复用）

1. **run_code 单次预算 120 s**：轮询 make（`sleep 240`）会直接超时；轮询时在 run_code 顶层传 `timeoutMs`（≤ 600000），并把 bash 的 sleep 控制在预算内。make 前段（music gate / render 8 段）约 20 分钟。
2. **make 首轮被 content check 拦**：`films check failed: x content HEAD moved (7b765609… -> 3704b93…); run sync`。提交 content 之后必须 `films.mjs sync` 再 make；delivery 里的 cover/srt/chapters 要在 make 之后入库。
3. **长公式在 1120 宽下会折行**：p10 的 `Hit@k = 命中数 / N (â 在池子的前 k 名里，且 â = t)` 折成两行、「t）」被下方 K 注压住。修法：公式只留紧凑形式（`Hit@k = 命中数 / N`），把解释写进 `<Body size={FT.meta}>` 注。
4. **CodeBlock 里写的路径/类型名必须和 ts-base 真实代码一致**：E50 的 p17 写成 `src/Algos/Ch06/Metrics.hs` 与 `V.Vector`，真实是 `src/TsBase/Algos/Ch06/Metrics.hs` 与 `VU.Vector`，`mape` 的真实签名是 `mapeWith 1e-12 False`。写完对着 `src/TsBase/Algos/Ch06/*.hs` 逐行核。
5. **Formula 里不能有裸花括号**：`#{ â ∈ top-k(pool) : â = t }` 报 TS1127/TS1381，集合记号直接写成纯文字。
6. **场景漏 import**：verification 用了 `K` 但没 import（TS2304）；composition 忘记 `export { TOTAL, FPS }`（TS2459）。
7. **写文档别在 JS 模板里转义反引号**：`String.raw` 里转义反引号会留下反斜杠（plan.md 被污染了 5 处）。含反引号的 Markdown 用 `tools.write` 写临时文件，再 `cat /tmp/x.md >> 目标`。
8. **`app/Main.hs` 的 dispatch 分支缩进 4 空格**：写成 2 空格报 `parse error on input '->'`，报错行号在分支后一行，容易找错位置。
9. **GHC 9.14 的 Prelude 已导出 `foldl'`**：再从 `Data.List` import 会吃 `-Wunused-imports`；同理 `pred` 会被 Prelude 的 `pred` 遮蔽，参数名改 `preds`。
10. **负结果照实讲**：E50 计划里「池 3→5 让 Hit@1 +0.15」实测 +0.00，画面第 28 页直接写「计划的预期没有成立」。这一条比任何要头都重要——下一集如果 40% 复现不到 0.8，也这么写。
