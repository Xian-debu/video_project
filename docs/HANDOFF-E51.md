# 交接文档（2026-11-03 上午，E51 完成后封存）

> 本文件取代此前所有交接文档：docs/HANDOFF.md、HANDOFF-EVENING.md、HANDOFF-NEXT-AGENT.md、HANDOFF-E41.md ~ HANDOFF-E50.md 自本文件起只作历史存档，**不要按旧文档继续工作**。
> 旧文档里的「下一步」已全部过期；以本文件末尾的进度与工作规范为准。

## 0. 一句话现状

- 视频系列 tsint 已交付 **61 / 74 集**（E01–E18、E19–E51、E65–E74），最新一集 **E51 51-ga-search-incremental** 已 end-to-end 完成（算法 / 证据 / 数据 / 讲稿 / 配音 / 渲染 / 交付 / 文档 / 提交），成片 20:59.7。
- **目标（goal）处于 active + armed**：objective 是「逐集完成」，不发布 B 站，status 停在 ready；如果会话中断后恢复时 goal 变成 disarmed，人类说「继续」就 `update_goal action=resume`。
- **永远不要发布到 Bilibili**。每集结束时 film.json 的 status 必须是 `ready`（不是 published），`bili` 字段保持 null。
- 下一集：**E52 `52-meta-learning-task-library`**，标题《把 300 只股票当成 300 个任务：元学习选模型》，预估 **24 分钟**，chapter ch06，两个算法单元。E51 的 outro 把主题收成「不再问怎么省算力，问怎么复用经验」，E52 从「一只股票 = 一个任务」接。

## 1. 四个仓库与它们的关系

| 路径 | 角色 | 谁写 |
| --- | --- | --- |
| `/root/ts-base` | Haskell 算法库 + 单测 + 证据程序（每集的读数都由它产出） | 算法模块 `src/TsBase/Algos/ChNN/*.hs`、测试 `test/Algos/ChNN/*Spec.hs`、证据 `app/ChNN*Evidence.hs` |
| `/root/ts-admin` | 数据湖导出脚本（日线 / 分钟线 → CSV + manifest） | `inventory/scripts/export_chNN_*.py` |
| `/root/video_project` | **内容仓**：每集一个 pack（画面源码 + 数据 + 讲稿 + 交付），以及全仓文档、schema、工具 | `series/tsint/episodes/<NN-slug>/` |
| `/root/video-pipeline-blueprint` | **渲染引擎**（Remotion + make 流水线）。引擎不知道任何片名，按 film 清单挂载内容仓 | 一般**不改**；只有引擎 bug 才动，且要单独提交 |

挂载方向：**内容仓是源，引擎是挂载点**。改内容只改 `/root/video_project` 里的 pack，然后 `node scripts/films.mjs sync` 拷进引擎（`src/tsint-NN-...`、`data/tsint-NN-...`）。反向编辑引擎副本会被下一次 sync 覆盖。

系列计划在 `/root/ts-base/plans/series.json`：顶层 dict，`episodes` 是 list（74 项，**按 order 排序，不是交付顺序**），每项有 slug / title / thesis / chapter / algorithms（unit_id / module / api / math / impl_notes / tests / demo / figures）/ verification / data 要求。**开工前先读它**。注意第 52 项往后的项里没有 `order` 键，用列表下标或 `slug` 找，别用 `e['order']`。

## 2. 工具链（全部在本机，无外网依赖）

### 2.1 Haskell（GHC 不在 PATH）

~~~bash
docker exec haskell-ts bash -lc 'export PATH=/opt/ghc/9.14.1/bin:$PATH && cd /work && cabal build all'
docker exec haskell-ts bash -lc 'export PATH=/opt/ghc/9.14.1/bin:$PATH && cd /work && cabal test'
~~~

稳定跑法：把命令写进 `/tmp/eNN_*.sh` → `docker cp` 进容器 → `docker exec haskell-ts bash /tmp/eNN_*.sh`。**别在 `bash -c` 的双引号里写 `$PATH`**，会被吞成空串导致 `cabal: command not found`。容器内存上限 **12 GiB**，超了 exit 137。`/work` 是容器内独立卷，不是 bind mount，改完必须 docker cp 进去。

E51 的算法与证据也是**纯计算**，证据 **26 条 / 26.4 s**，规则仍是「改断言 → 秒级重跑」。E51 加 2 个模块 11 个用例后，全仓 **159 套 / 2,100 断言**全绿（`algos.ch06.gasearch: 6/6`、`incremental: 5/5`，其余 ch06 不受影响）。

### 2.2 Python / 数据

- 数据湖入口：`from tsa.api import Lake`（在 ts-admin 仓根用 `.venv/bin/python`，系统 python 没有 duckdb）。`Lake.daily / panel / minute / instruments`；返回 pyarrow Table（`.to_pandas()`）。
- 湖表：`instruments(code,name,market,board,list_date,delist_date,is_st,industry,updated_at)`、`index_members(...)`、`bars_daily(...)`、`index_daily`。
- **`bars_daily.amount` 全列为 NULL**（E49 实测 672,637 行无一非空）——任何按成交额排序的取样都会退化成按代码排。选股票统一用**行业分层**（HS300 成分数 ≥ 5 的门类各取一只）。
- `index_members` 只有 **2026-10-30 一期快照**，没有历史成分；所有集都按「快照 + 每只股票自己的连续有效段」切窗，偏差写进 manifest。
- **E51 与 E50 同一份数据**：`/root/ts-base/data/episodes/51-ga-search-incremental/daily.csv`（与 50 的 daily.csv 逐字节相同，1,486,348 B；20 只行业分层、后复权、2,412–2,431 根、2022-01-01 / 2024-01-01 切分）。E52 如果还要这 20 只，直接 cp；要 300 只就改导出脚本（`export_ch06_modelsel.py`）。
- E50/E51 的实际口径：HS300 快照 300 只 → 行业分层 20 只（每个门类取有效交易日最多的一只）→ 取各自最长连续段（`MAX_GAP_DAYS=20`，10 天会被 2020 春节 11 天假断段）→ `MIN_TRAIN=1500`。

### 2.3 配音（TTS）

虚拟环境 `/root/.venvs/tts`（edge_tts 7.3.1），音色 `zh-CN-YunyangNeural`；系统 python3 **没有** edge_tts。脚本从上一集拷 `build/tts_narration.py` 与 `build/make_narration.py`：

~~~bash
cd <pack>
/root/.venvs/tts/bin/python build/tts_narration.py --lines data/lines.json --clips assets/audio/clips --voice-out data/voice.json --clips-json data/clips.json --concurrency 6
python3 build/make_narration.py     # 生成 assets/audio/narration.wav
~~~

**片段缓存按 `scene#index` 命名**，不看文本内容；改一句台词必须手动删对应 mp3 再跑（`--only=<scene#idx,...>` 可只补这几句）。脚本会跳过「已存在且 > 800 B」的 mp3——**改稿后要清空 clips 目录**才会重录。

**时间轴两轮 dump（E51 又踩了一次）**：`script.ts` 里 `voice.json` 的 import 路径必须写引擎挂载路径 `../../data/<film.id>/voice.json`；dump 必须在 `films.mjs sync` 之后对**引擎副本**跑。顺序固定：**TTS → sync → dump（实测）→ cp 回 pack → make_narration**。E51 读数：估 1,273.59 s → 实测 1,259.65 s（320 行 / speech 1,064.3 s / mean 3.33 s / narration.wav 120,926,444 B）。

### 2.4 静帧预览与渲染

~~~bash
cd /root/video-pipeline-blueprint
node scripts/make.mjs --film <film-id> --score=out/e04-score-loop-48k.wav
~~~

**`--score` 一定要带**：不带会现场合成一条二十分钟的分数字床，单核实测 23 分钟还没跑完；共享床是 `/root/video-pipeline-blueprint/out/e04-score-loop-48k.wav`（1560 s，48 kHz）。

**先 content 提交，再 sync，再 make**：make 的 content check 会拦 dirty，也会拦「提交后 HEAD moved 但没 sync」。E51 的流程是：改完 → commit → sync → `check --strict` → make。

单帧预览：`npx remotion still <Comp> /tmp/x.png --frame=<f> --scale=0.34`（**在引擎根跑**，在内容仓跑会报 `npm error could not determine executable to run`）。**抽帧时避开页面切换**：`Pages` 有 12 帧淡入淡出，正好落在两页之间时 still_lint 会把两页文本报成重叠；把采样点偏移 18 帧就 PASS。

## 3. 一集的标准流水线（未变）

1. **读计划**：series.json 里按 slug 找那一项 + 书页。thesis / 算法 / 页数 / 数据配方是硬约束；湖里凑不齐或计划自相矛盾就如实记 deviation，不凑数。
2. **算法模块**：`src/TsBase/Algos/ChNN/<X>.hs`，纯函数、无外部数值库。在 ts-base.cabal 的 exposed-modules 与 test other-modules 注册，`test/Spec.hs` 加 import 与 runSuite。
3. **单测**：`test/Algos/ChNN/<X>Spec.hs`，黄金值写绝对值；浮点比较用容差。**Spec 文件末尾别忘了导出列表**（只写 `xxxCases = [...]` 会报 `Not in scope`）。
4. **证据程序**：`app/ChNN<Name>Evidence.hs`，`runEvidence :: FilePath -> FilePath -> FilePath -> IO ()`；自己维护 checks（分组）、写 `summary.json` / `checks.txt` / `<episode>.chN-*.json`；跑完打印 `checks: P/T in S s`。`app/Main.hs` 加 dispatch 与 usage，**dispatch 分支缩进 4 空格**（2 空格报 `parse error on input '->'`）。**`--evidence` 传文件路径，不是目录**。
5. **数据导出**：ts-admin 写 `inventory/scripts/export_chNN_*.py`，输出到 `/root/ts-base/data/episodes/<slug>/`（CSV + manifest.json）。提交 ts-admin，并写 ts-admin 的 SELF-AUTH。E51 复用 E50 的数据，**没有**新导出（manifest 里 ts-admin commit 仍记 `a8135a4`）。
6. **跑证据到全绿**：先小样本再接全量；失败看 checks.txt 的分组名定位。全绿后提交 ts-base（数据 / 算法 / 证据分开提交）。
7. **生成 pack 数据**：`build/make_dist_data.py` 读证据 JSON + manifest，产出 `data/dist.json`（画面所有数字的唯一来源）；**每个字段都要和证据 JSON 对得上（不一致就 `EVIDENCE MISMATCH` 退出）**；JSON 里不能出现 `Infinity`。
8. **写画面**：`src/shared.tsx`（类型 + 组件 + `M`）、`src/script.ts`（8 场：页数 + 旁白 + PAGES_INDEX）、`src/scenes/*.tsx`、wrapper。先写旁白，再按旁白写页。E51 节奏基准：**每页 10 句、每场景 10 的倍数**，32 页 320 行 ≈ 21 分钟（E49 38 页 380 行 ≈ 24 分钟、E50 32 页 320 行 ≈ 18:19）。
9. **配音**：见 2.3，注意两轮 dump。
10. **静帧复核**：按每页首句渲全部页面（E51 32 张，约 10 分钟），拼联系表逐页看——**既看版式，也核口径**（数字对不对、下集预告字段是不是下一集的、页头 goal 与证据实测一致吗）。E51 在 32 页里抓到 2 处（护栏算例数字写错、判据尺横条出画）。
11. **内容提交**：`node scripts/films.mjs check --strict` 必须 0 error。提交 pack 源：`tsint/NN-slug: content — …`；再单独提交 film.json ready。
12. **渲染**：`films.mjs sync` → make（带 `--score`）。先提交再 sync 再 make。
13. **交付**：make 的 `--out` 直接指向 pack `delivery/`；mp4 / wav / report.json / scenes / stills / score.meta 不入库，cover/srt/chapters/ffmeta 入库。
14. **收尾**：plan.md 补实测 + Delivery；SELF-AUTH 加一条；production-log 加一节；STATUS.md 那行改 `ready | - | yes | ok | 11 | -`；写本文件下一版；提交 delivery（含 docs）。**写含反引号/长 Markdown 的段落用 tools.write 写临时文件再 cat 追加，别用 JS 模板或 shell printf**。

## 4. 当前进度（E51 完成时）

- ts-base：`8239ee2`（第 51 集数据：summary 26/26 in 26.4 s、checks、daily.csv、evidence JSON）← `1393e0d`（`app/Ch06GaIncrementalEvidence.hs` 26 条 / 26.4 s：data 4 / ga 6 / curve 5 / demo 6 / budget 5）← `b272ab2`（GaSearch 加 `evolveCoverage`，逐代记录唯一训练数）← `55cc368`（GaSearch + IncrementalSearch 两模块 + 10 个黄金用例；实际用例 6 + 5 = 11）。工作区干净。
- ts-admin：`a8135a4`（`inventory/scripts/export_ch06_modelsel.py`，E50 导出、E51 复用）。
- video_project：E51 content `3b84149` + `99c9a64`（护栏算例 4×30=120 / 4×852=3,408）+ `3868b4b`（判据尺按实测最大值定标）+ ready `0e59e43` + delivery `8e7778f` + docs（本次）。
- 引擎：未改（`a667688`）。

- E51 读数：**数据侧** 20 只 / bars 2,412–2,431 / train 1,686–1,705 / valid 483–484 / test 242 / 行 47,308 / 阶段点 [213, 426, 852]；**预算** rowsInc 297,770 vs rowsFull 340,530 = **87.4%**（不是计划的 40%）。
- **GA**：200 次评估 = **200 次唯一训练**（缓存命中 0）、与穷举一致 **20/20**、best 10.7165 / worst 10.8482；200/648 = **30.86%**。
- **线性外推**：误差 **4.7613**、最大 219.09、Top-1 **5%（1/20）**、Top-2 5%、交集 0.4、单调 161/200；`sar12` 外推到 **−1.4373**（负误差）。
- **幂律外推**：误差 **1.3835**（3.44 倍）、最大 55.7、Top-1 **30%**、Top-2 **3/20**、交集 0.7。
- **判据**：冠军−亚军 **0.0653**，外推误差是它的 **21.19 倍**。
- 10 候选（valid / 线性外推 / test）：naive 10.723 / 10.723 / 10.3148、drift30 11.4219 / 10.6378 / 11.3161、exp0.2 18.2409 / 18.2409 / 16.9688、exp0.5 12.5703 / 12.5703 / 12.1423、ar1 10.7968 / 1.7304 / 10.4364、ridge(1e-3) 10.8498 / 1.3909 / 10.4866、ridge(1) 10.8482 / 4.9447 / 10.4856、sar12 10.8208 / −1.4373 / 10.4252、sar5 10.8151 / 0.9203 / 10.4137、hmean5 16.4623 / 16.4623 / 15.9035。
- 成片：1,259.67 s / 37,790 帧 / 8 场 32 页 / 320 cue / 8 章 / −15 LUFS / TP −2 dBFS / mp4 **64,349,351 B** / tree `2125be3b75aa8fce`；mix peak −1.21 dBFS、RMS −26.6 dBFS、ducked 57.9%、musicGain −4.5 dB；闪烁 37,790 帧 mean 21.45 / mean|d| 0.0142 / p99 0.1111 / max 10.55 / 7 切点。

## 5. E52 的开工顺序（建议）

1. 读 `plans/series.json` 里 slug `meta-learning-task-library`（chapter ch06、runtime 24 min、2 个算法单元）。第 52 项**没有 `order` 键**，用 `next(e['slug'])` 或下标找，别写 `e['order']`。
2. 计划 thesis（草案，已被 E51 的结论加压）：300 个任务（每只股票 = 一个任务）训出的元学习器，在留出 30 只上 Hit@1 比「按类均值选模型」基线高 **0.1 以上**；并把 4 维统计元特征换成 TS2Vec 嵌入做对比。E51 的教训是**先量一下信号**：冠军与亚军的差距如果还是 0.06 量级，元学习器再准也翻不动排序——证据里先把「最优模型在 300 个任务上的分布」和「差距分布」量出来，再定 Hit@1 阈值。
3. 数据：20 只不够做 300 个任务，要改 ts-admin 导出（HS300 全量 + 各自连续段）。E52 是**第一次需要 300 只**的集，导出脚本从 `export_ch06_modelsel.py` 改：去掉行业分层那一步，保留 `MAX_GAP_DAYS=20` / `MIN_TRAIN` 过滤，切分沿用 2022-01-01 / 2024-01-01，并额外输出元特征表（4 维统计）+ 每只股票的最优模型真值。
4. 两个算法单元大致落在 `TsBase.Algos.Ch06.MetaLearning`（任务库 / 元特征 / 元学习器：按类均值、最近邻任务、线性元模型）与 `TsBase.Algos.Ch06.Ts2Vec`（或退化成「分布统计嵌入」——**如果 TS2Vec 写成玩具版，必须在 plan 的 Deviations 里说明**，别把玩具说成 TS2Vec）。
5. 证据 26–30 条量级；画面 8 场、32–36 页、旁白 10 句/页。24 分钟计划 ≈ 34 页 / 340 行。
6. outro 的下一集卡从 series.json 第 53 项读（title / minutes），不要凭印象写。

## 6. 已知欠账 / 风险

- `python3 plans/check_evidence.py` 仍会崩：inventory/evidence 里有 5 个历史 JSON 是坏的（33/34 summary、ch2 三个），属 A73 同类未转义引号 bug，可做一次 chore 修复。
- E51 的结论只到「两把刀都没省在排序上」：20 只股票、10 个手挑候选、单次切分、单指标 MAE。**不要把它说成「省算力没用」**——省下来的量是真的（87.4% / 30.86%），只是没换成排序，边界页写的就是这句。
- E51 的 GA 只跑了**单种子**（20261103），证据里断言的是「同 seed 可复现」，不是「多种子稳定」。E52 若要用 GA 结果，别当成期望值。
- 每集交付前必须重新 sync；引擎 `out/` 里不得留 `tsint-*` 残留，pack `delivery/` 里只入库 cover/srt/chapters/ffmeta。
- 成片时长普遍比计划长 15%–20%（E49 24:03 vs 22、E50 18:19 vs 20、E51 20:59 vs 18）。**不压稿**是既定做法，但排期要按实测算：74 集里剩下的按每集 20–24 分钟估。

## 7. E51 修过的坑（下一集复用）

1. **`npx remotion still` 必须在引擎根跑**：在内容仓跑 32 张全失败（`npm error could not determine executable to run`），cd 到 `/root/video-pipeline-blueprint` 就好了。
2. **`still lint` 的 canvas 规则会拦「画出来的盒子」不只文本**：E51 首轮 make 挂在 `div panel box 745,578 2262x14 leaves the 1920x1080 frame`——判据尺的横条宽度按硬编码上限 1.6 定标，而线性误差 4.7613，算出 2,262 px。修法：`hi = Math.max(...)` 按实测最大值定标 + `Math.min(w-300, …)` 夹紧。**自己写条形图时一律夹紧到轨道宽度**。
3. **排查 lint 报错写临时脚本**：`scripts/qa/dbg_lint.mjs` 用 `renderStill` + `inputProps {lint:true, lintFrame}` 收 `LINTBOXES` 一行 JSON，把报错框的 tag/text/x/y/w/h/color 打出来，比猜快十倍。**用完删掉，别提交进引擎**。
4. **JS 模板字符串里写 Haskell 反引号中缀会报 `Expected ',', got 'ident'`**：`\`xor\`` / `\`mod\`` 一类全改前缀形式（`xor a b`），文案里的反引号用 `§§` 占位再 split/join 成 chr 96。
5. **`String.raw` 里写 `\\v` 会得到两个反斜杠**，匹配不到文件里的单反斜杠；要精确替换就先 `read` 再 `edit`，或干脆用 python 脚本批量改。
6. **`tools.edit` 在文件被 bash/docker 改过之后会报 `file changed since it was read`**：重新 `read` 再改；`tools.write` 覆盖「没读过的已存在文件」也会被拒。
7. **Haskell 证据里 `KExp` 用列表索引是 O(n²)**：600 次部分拟合会卡死，改 `VU.scanl` 预计算状态，数值等价但快几十倍。
8. **GHC 9.14 的 Prelude 已导出 `foldl'`**（再从 `Data.List` import 会吃 `-Wunused-imports`）；`pred` 会被 Prelude 遮蔽（参数名改 `preds`）；`head` 用模式匹配替掉（`-Wx-partial`）；`Gen` 构造子不导出时补 `genFromSeed`，否则外部写 `G.Gen s` 会报 `Ambiguous type variable`。
9. **负结果照实讲**：E51 计划里「40% 预算下 Accuracy@2 ≥ 0.8」实测是「87.4% 数据只换到 5%（线性）/ 15%（幂律）Top-2」，画面第 28 页直接写「两条负结果，也留在证据里」。这一条比任何要头都重要。
10. **讲稿长、成片长都不算缺陷**：E51 估 1,273.59 s / 实 1,259.65 s，成片 20:59.7 超计划 2:59。只要每页旁白讲完该讲的、画面数字对得上证据，就不为对齐分钟数删内容——plan 头部按实测记，别写「接近 18 分钟」。

