# 交接文档（2026-11-03 上午，E52 完成后封存）

> 本文件取代 docs/HANDOFF-E51.md 及更早的所有交接文档（HANDOFF.md、HANDOFF-EVENING.md、HANDOFF-NEXT-AGENT.md、HANDOFF-E41.md ~ HANDOFF-E51.md 只作历史存档，**不要按旧文档继续工作**）。
> 旧文档里的「下一步」已过期；以本文件末尾的进度、读数与流水线为准。

## 0. 一句话现状

- 视频系列 tsint 已交付 **62 / 74 集**（E01–E18、E19–E52、E65–E74），最新一集 **E52 52-meta-learning-task-library** 已 end-to-end 完成（算法 / 证据 / 数据 / 讲稿 / 配音 / 渲染 / 交付 / 文档 / 提交），成片 **20:06.4（1,206.37 s / 36,191 帧）**。
- **goal 已由人类主动暂停**（收费波峰，2026-11-03）。本次只完成 E52；E53–E74 下次继续。若恢复后 goal 是 disarmed 且人类说「继续 / 接着做」，用 `update_goal action=resume` 重新 armed。
- **永远不要发布到 Bilibili**。每集结束 film.json 的 status 必须是 `ready`（不是 published），`bili` 字段保持 null。E52 的封面帧是 **180（6.00 s）**，plan 与 film.json 都按这个值写。
- 下一集：**E53 `53-ensemble-average-iter`**，标题《集成：平均就能赢，但别乱调权》，预估 **22 分钟**，chapter ch06（cluster F4 自动集成），三个算法单元（Ensemble / NoiseAugEnsemble / IterEnsemble）。

## 1. 四个仓库与它们的关系

| 路径 | 角色 | 谁写 |
| --- | --- | --- |
| `/root/ts-base` | Haskell 算法库 + 单测 + 证据程序（每集读数由它产出） | 算法模块 `src/TsBase/Algos/ChNN/*.hs`、测试 `test/Algos/ChNN/*Spec.hs`、证据 `app/ChNN*Evidence.hs` |
| `/root/ts-admin` | 数据湖导出脚本（日线 → CSV + manifest） | `inventory/scripts/export_chNN_*.py` |
| `/root/video_project` | **内容仓**：每集一个 pack（画面源码 + 数据 + 讲稿 + 交付），以及全仓文档、schema、工具 | `series/tsint/episodes/<NN-slug>/` |
| `/root/video-pipeline-blueprint` | **渲染引擎**（Remotion + make 流水线），按 film 清单挂载内容仓 | 一般**不改**；只有引擎 bug 才动，且单独提交 |

挂载方向：**内容仓是源，引擎是挂载点**。改内容只改 `/root/video_project` 的 pack，然后 `node scripts/films.mjs sync` 拷进引擎（`src/tsint-NN-...`、`data/tsint-NN-...`）。反向编辑引擎副本会被下一次 sync 覆盖。

系列计划在 `/root/ts-base/plans/series.json`：`episodes` 是 74 项 list（按 order 排序，第 52 项起**没有 order 键**，用下标或 slug 找）。

## 2. 工具链

### 2.1 Haskell（GHC 不在 PATH）

~~~bash
docker exec haskell-ts bash -lc 'export PATH=/opt/ghc/9.14.1/bin:$PATH && cd /work && cabal build all'
docker exec haskell-ts bash -lc 'export PATH=/opt/ghc/9.14.1/bin:$PATH && cd /work && cabal test'
~~~

稳定跑法：把命令写进 `/tmp/eNN_*.sh` → `docker cp` 进容器 → `docker exec haskell-ts bash /tmp/eNN_*.sh`。**别在 `bash -c` 双引号里写 `$PATH`**（会被吞成空串）。容器内存上限 **12 GiB**（超了 exit 137），`/work` 是容器内独立卷，不是 bind mount，改完必须 `docker cp` 进去。

E52 状态：全仓 **150 套 / 2,111 断言**全绿（`algos.ch06.metalearn 6/6`、`algos.ch06.ts2vec 6/6`）。

### 2.2 Python / 数据

- 数据湖入口：`from tsa.api import Lake`（在 ts-admin 仓根用 `.venv/bin/python`，系统 python 没有 duckdb）。返回 pyarrow Table。
- 湖表：`instruments(code,name,market,board,list_date,delist_date,is_st,industry,updated_at)`、`index_members`、`bars_daily`、`index_daily`。
- **`bars_daily.amount` 全列为 NULL**；按成交额排序会退化成按代码排，选股票用行业分层或直接取 HS300 快照。
- `index_members` 只有 **2026-10-30 一期快照**，没有历史成分。E52 用快照内全部 300 只，各自取最长连续段（`MAX_GAP_DAYS=20`，`MIN_TRAIN=1500`），切分 train < 2022-01-01 / valid 2022–2023 / test ≥ 2024-01-01。
- E52 数据在 `/root/ts-base/data/episodes/52-meta-learning-task-library/`：`daily300.csv` 18,777,048 B、300 只、1,535–2,431 根；`classes.csv` 11,966 B（53 行业 + unknown 3）；`manifest.json` 只留计数与校验（633,177 B）。E53 若做 20 只 × 10 候选，可直接用 `daily300.csv` 里按行业抽 20 只，或复用 E50/E51 的 20 只行业分层文件。

### 2.3 配音（TTS）

本机实测可用解释器 **`/root/venv-netbond/bin/python3`**（edge_tts 7.3.1、python 3.12.3）；E51 文档写的 `/root/.venvs/tts` 也是同类环境，先 `ls` 确认再跑。系统 python3 **没有** edge_tts。音色 `zh-CN-YunyangNeural`。

~~~bash
cd <pack>
/root/venv-netbond/bin/python3 build/tts_narration.py --lines data/lines.json --clips assets/audio/clips --voice-out data/voice.json --clips-json data/clips.json --concurrency 6
python3 build/make_narration.py     # 生成 assets/audio/narration.wav
~~~

**顺序固定**：TTS → `node scripts/films.mjs` sync → 对**引擎副本** dump 实测 → cp 回 pack → `make_narration.py` → 再 sync（让引擎的 narration 也更新）。E52 读数：估 1,170.58 s → 实测 **1,206.36 s**（360 行 / 语音 989.8 s / mean 2.75 s / narration.wav 115,810,604 B）。`script.ts` 里 voice.json 的 import 必须写引擎挂载路径 `../../data/<film.id>/voice.json`。

**clips 按 `scene#index` 缓存，不看文本**：改一句必须删对应 mp3（`--only=...` 可补录），改整集就清空 `assets/audio/clips`。

### 2.4 静帧预览与渲染

~~~bash
cd /root/video-pipeline-blueprint
node scripts/make.mjs --film <film-id> --score=out/e04-score-loop-48k.wav --still-frames=...
~~~

- **`--score` 一定要带**：不带会到 score stage 现场合成二十分钟床（单核 20+ 分钟）。E52 首轮忘带，到 score stage 立刻 kill 后重跑——**这是第二次踩同一个坑**（E48/E51 也踩过），记在这里。
- **先 content 提交，再 sync，再 make**：make 的 content check 会拦 dirty，也会拦「提交后 HEAD moved 但没 sync」。
- 单帧预览：`npx remotion still <Comp> /tmp/x.png --frame=<f> --log=error`（**引擎根跑**）。抽帧避开 `Pages` 12 帧淡变，偏移 18 帧。
- make 默认 `--cover-frame=180`（6.0 s）；E52 没显式传，所以 cover.png 与 film.json 的 `publish.coverFrame` 都是 180。若要 20 帧必须显式传并同步改 film.json。

### 2.5 make 的 23 个 stage

content check（dirty 拦截）→ film coverage → derived check → design contract → type ratchet → film isolation → typecheck → docs check → probe composition → score → music gate (stem) → render（8 段）→ probe duration → still ×3 → still lint → mix → music gate (mix) → mux → loudnorm → flicker gate → publish → report.json。失败仍写 report.json，先看它。

## 3. 一集的标准流水线

1. **读计划**：series.json 按 slug 找那一项 + 书页；thesis / 算法 / 页数 / 数据配方是硬约束，湖里凑不齐或计划自相矛盾就记 deviation，不凑数。
2. **算法模块**：`src/TsBase/Algos/ChNN/<X>.hs`，纯函数、无外部数值库；在 `ts-base.cabal` 的 exposed-modules 与 test other-modules 注册，`test/Spec.hs` 加 import 与 runSuite。
3. **单测**：`test/Algos/ChNN/<X>Spec.hs`，黄金值写绝对值，浮点用容差；**文件末尾别忘导出列表**。
4. **证据程序**：`app/ChNN<Name>Evidence.hs`，`runEvidence :: FilePath -> FilePath -> FilePath -> IO ()`；自维护 checks（分组）、写 `summary.json` / `checks.txt` / `<episode>.chN-*.json`；跑完打印 `checks: P/T in S s`。`app/Main.hs` 加 dispatch（缩进 4 空格）与 usage；`--evidence` 传**文件路径**。
5. **数据导出**：ts-admin 写 `inventory/scripts/export_chNN_*.py`，输出到 `/root/ts-base/data/episodes/<slug>/`（CSV + manifest），提交 ts-admin 并写它的 SELF-AUTH。
6. **跑证据到全绿**，然后分开提交 ts-base（数据 / 算法 / 证据）。
7. **生成 pack 数据**：`build/make_dist_data.py` 读证据 JSON + manifest 产出 `data/dist.json`（画面唯一数字源）；字段对不上就 `EVIDENCE MISMATCH` 退出 1；不能出现 `Infinity`。
8. **写画面**：`src/shared.tsx`（类型 + 组件 + `M`）、`src/script.ts`（8 场：页数 + 旁白 + PAGES_INDEX）、`src/scenes/*.tsx`、wrapper。先写旁白再按旁白写页；每页 10 句、每场景 10 的倍数。36 页 360 行 ≈ 20 分钟。
9. **配音**：见 2.3，两轮 dump。
10. **静帧复核**：make 抽 3 帧 + 人工看关键页（版式 + 口径一起看）。
11. **内容提交**：`node scripts/films.mjs check --strict` 0 error；提交 pack 源 `tsint/NN-slug: content — …`；film.json 单独提交。
12. **渲染**：sync → make（带 `--score`）。
13. **交付**：make 的 `--out` 指向 pack `delivery/`；mp4 / wav / report.json / scenes / stills 不入库，cover / srt / chapters / ffmeta 入库。
14. **收尾**：plan.md 补实测 + Delivery；SELF-AUTH 加一条；production-log 加一节；STATUS.md 那行改 `ready | - | yes | ok | 11 | -`；写下一版 HANDOFF；提交 delivery、ready、docs 三笔。**写长 Markdown 用 `tools.write` 写临时文件再 `cat` 追加，别用 shell printf**。

## 4. 当前进度（E52 完成时）

- ts-base：`77f9362`（第 52 集数据：summary 29/29 in 30.9 s、per-task picks、candidate means、per-industry hit）← `391ce00` ← `1c2e383` ← `a4fd4d6`（27/27 首版）← `7f16be6`（证据 27 条）← `b0d09a0`（Ts2Vec）← `16d4ecd`（MetaLearn）。工作区干净。
- ts-admin：`1318010`（manifest 只留计数，374 MB → 633,177 B）← `587373f`（导出 300 任务）。
- video_project：`a923884`（E52 content）+ `1aaf9fc`（delivery：cover / 360 cue srt / 8 章）+ `ac9ae79`（film ready，coverFrame 180）+ 本次 docs 提交（plan Delivery / SELF-AUTH A49 / 本文件 / production-log / STATUS）。
- 引擎：未改（`a667688`）。

- **数据侧**：300 任务 / bars 1,535–2,431 / train [809, 1705] / valid [466, 484] / test [232, 242] / 53 行业 / 股票池 5,413 只有日线、2,911 eligible / seed 20261103。
- **命中率**：统计元特征 **0.2733**、类均值 **0.3867**（增益 **−0.1133**）、恒选 naive **0.4333**、TS2Vec **0.2667**（差 **−0.0067**）、平均排名 2.5167；五折 [0.2, 0.2333, 0.4, 0.25, 0.2833]；留出 30 只：8/30 vs 12/30（0.2667 vs 0.4）。
- **预测**：300 × 10 分数与测试 MAE 相关 **0.9983**、预测误差 3.5044 vs 真实 3.5002（差 0.0042）；3,000 次拟合 + 300 次编码 **31.0 s**。
- **后悔**：平均 **0.0263 MAE**、最坏 3.2029、218 个任务选错；真值冠军 naive 130 / sar12 59 / ar1 48 / sar5 27 / drift30 19 / ridge5-l1 11 / ridge5-l1e-3 6 / exp0.2 0 / exp0.5 0 / hmean5 0；元学习器选择次数 naive 173 / ridge5-l1 35 / drift30 31 / sar5 30 / ar1 28 / ridge5-l1e-3 28。
- **表征**：dim 64、范数 1、确定性、cos 0.6194、gap −0.0067。
- **成片**：1,206.37 s / 36,191 帧 / 8 场 36 页 / 360 cue / 8 章 / mp4 **57,931,900 B** / tree `0f6b1fd7dc97f8a2`；mix 48 kHz / 1,207.56 s、peak −1.16 dBFS、RMS −26.81 dBFS、ducked 53.9%、musicGain −4.5；loudnorm dynamic in I −23.3 / TP −1.4 → out I −15.8 / TP −2.0 / LRA 2.3；闪烁 36,191 帧 mean 20.58 / min 14.65 / max 24.43、mean|d| 0.0136、p99 0.1047、max 8.96、7 切点。

## 5. E53 的开工顺序（建议）

1. 读 `plans/series.json` 第 53 项 `ensemble-average-iter`（ch06、cluster F4、22 min、三个算法单元）。thesis（草案）：20 只 × 10 候选中等权平均 MAE 比池内最优单模型低 3%–8%；按残差贡献迭代调权若不收缩，验证集 MAE 反而差——「自动调权」在样本不足时自伤。**E52 的教训先量差距**：候选之间的差距如果还是 0.01 量级，等权平均的 3%–8% 要写清楚是相对什么基线。
2. 算法：`TsBase.Algos.Ch06.Ensemble`（`weightedAvg` / `medianEns` / `fitWeights`，黄金 1.7 / 中位数 2.0 / 等权同模型 / 权重 (1,0,0) = 选择）、`Ch06.NoiseAugEnsemble`（`noisyVariants`，σ 相对标准差，σ=0 时逐元素相等，K=1..10）、`Ch06.IterEnsemble`（`iterReweight`，收缩参数与删除标记）。
3. **权重只能来自 train/valid，测试段拟合权重算作弊**；集成前若各模型量纲不同，先反变换到同一空间再加权。
4. 数据建议直接复用 `/root/ts-base/data/episodes/52-meta-learning-task-library/daily300.csv` 或 E50/E51 的 20 只行业分层文件，避免再导出。
5. 证据 26–30 条；画面 8 场 32 页 / 320 行 ≈ 20 分钟（22 分钟计划按历史区间可落在 20–21 分钟）。
6. outro 的下一集卡从 series.json 第 54 项读（`darts-differentiable-search`《把架构搜索变成可微：DARTS 与三层搜索空间》），不要凭印象写。

## 6. 已知欠账 / 风险

- **E53–E64 共 12 集未做**；es 后面 E65–E74 已交付。下一集从 E53 开始。
- E52 的两条计划假设都没成立（增益 −0.1133、表征差 −0.0067）；这是主结论，不是失败，后续集引用 E52 读数时别改口径。
- E52 的 TS2Vec 是闭式自监督轻量版，不是原论文完整训练；引用时说清楚。
- E52 生成物大：`daily300.csv` 18.8 MB、narration.wav 115.8 MB（不入库）、delivery mp4 57.9 MB（不入库）。
- 引擎 `out/` 不应留 `tsint-*` 残留（make --out 指向 pack delivery）。
