# 交接文档（2026-11-03 晚间，E53 完成后封存）

> 本文件取代 docs/HANDOFF-E52.md 及更早的所有交接文档（HANDOFF.md、HANDOFF-EVENING.md、HANDOFF-NEXT-AGENT.md、HANDOFF-E41.md ~ HANDOFF-E52.md 只作历史存档，**不要按旧文档继续工作**）。
> 旧文档里的「下一步」已过期；以本文件末尾的进度、读数与流水线为准。

## 0. 一句话现状

- 视频系列 tsint 已交付 **63 / 74 集**（E01–E18、E19–E53、E65–E74），最新一集 **E53 53-ensemble-average-iter** 已 end-to-end 完成（算法 / 单测 / 证据 / 数据 / 讲稿 / 配音 / 渲染 / 交付 / 文档 / 提交），成片 **18:56（1,135.97 s / 34,079 帧）**。
- **人类最后一次明确指令是「暂停 goal、做完当前这一集就停」（2026-11-03 收费波峰）**。E52 收尾后 harness 自动续跑 goal，E53 已按计划做完；下次开会话先看 goal 状态：若人类说「继续」，用 `update_goal action=resume` 重新 armed；若没说，**不要自动开 E54**。
- **永远不要发布到 Bilibili**。每集结束 film.json 的 status 必须是 `ready`（不是 published），`bili` 字段保持 null。E52/E53 的封面帧都是 **180（6.00 s）**，plan 与 film.json 都按这个值写。
- 下一集：**E54 `54-darts-differentiable-search`**，标题《把架构搜索变成可微：DARTS 与三层搜索空间》，预估 **26 分钟**，chapter ch06，deps `ensemble-average-iter`。

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

稳定跑法：把命令写进 `/tmp/eNN_*.sh` → `docker cp` 进容器 → `docker exec haskell-ts bash /tmp/eNN_*.sh`。**别在 `bash -c` 双引号里写 `$PATH`**（会被吞成空串）。容器内存上限 **12 GiB**（超了 exit 137），`/work` 是容器内独立卷，不是 bind mount；同步用：

~~~bash
cd /root/ts-base && tar -cf - src test app ts-base.cabal | docker exec -i haskell-ts tar -C /work -xf -
~~~

（tar 会报 `file changed as we read it`，exit 仍 0，可忽略。）

E53 状态：全仓断言 **2,138 条全绿**（原 2,111 + 新增 27：`algos.ch06.ensemble` 11 / `algos.ch06.noiseaug` 8 / `algos.ch06.iterens` 8）。**跑全量 `cabal test` 时给 run_code 设 `timeoutMs≈300000` 并把输出重定向到 /tmp 再 grep**，默认 120 s 会超时。

### 2.2 Python / 数据

- 数据湖入口：`from tsa.api import Lake`（在 ts-admin 仓根用 `.venv/bin/python`，系统 python 没有 duckdb）。返回 pyarrow Table。
- 湖表：`instruments(code,name,market,board,list_date,delist_date,is_st,industry,updated_at)`、`index_members`、`bars_daily`、`index_daily`。
- **`bars_daily.amount` 全列为 NULL**；按成交额排序会退化成按代码排，选股票用行业分层或直接取 HS300 快照。
- `index_members` 只有 **2026-10-30 一期快照**，没有历史成分。
- E53 数据目录 `/root/ts-base/data/episodes/53-ensemble-average-iter/`：`daily.csv` 1,486,348 B（从 E50 原样复制，sha 一致）、20 只 HS300 行业分层、**48,572 行**、每只 bars **2,412–2,431**；切分按比例 **70% / 15% / 15%**（train 1,688–1,701 / tune 362–365 / test 362–365），与 E50 的 `trainEnd=2022-01-01` 对齐。10 候选与 E50/E52 同一套。
- E52 的 `daily300.csv`（18,777,048 B，300 只）仍在 `data/episodes/52-meta-learning-task-library/`；E54 若要更大池子可直接用，小池子继续用 E53 的 20 只。

### 2.3 配音（TTS）

本机实测可用解释器 **`/root/venv-netbond/bin/python3`**（edge_tts 7.3.1、python 3.12.3）；系统 python3 **没有** edge_tts。音色 `zh-CN-YunyangNeural`。

~~~bash
cd <pack>
/root/venv-netbond/bin/python3 build/tts_narration.py --lines data/lines.json --clips assets/audio/clips --voice-out data/voice.json --clips-json data/clips.json --concurrency 6
python3 build/make_narration.py     # 生成 assets/audio/narration.wav
~~~

**顺序固定**：TTS → `node scripts/films.mjs` sync → 对**引擎副本** dump 实测 → cp 回 pack → `make_narration.py` → 再 sync。E53 读数：估 1,114.91 s → 实测 **1,135.96 s**（320 行 / 语音 940.6 s / mean 2.94 s / narration.wav 109,052,204 B）。`script.ts` 里 voice.json 的 import 必须写引擎挂载路径 `../../data/<film.id>/voice.json`。

**clips 按 `scene#index` 缓存，不看文本**：改一句必须删对应 mp3（`--only=...` 可补录），改整集就清空 `assets/audio/clips`。**TTS 本身跑 1–2 分钟，run_code 必须显式 `timeoutMs=600000`**（E53 首跑被默认 120 s 杀掉，320 个 clip 已生成但 voice.json 还是 `{}`，重跑会跳过已存在文件）。

### 2.4 静帧预览与渲染

~~~bash
cd /root/video-pipeline-blueprint
node scripts/films.mjs sync
node scripts/make.mjs --film <film-id> --score=out/e04-score-loop-48k.wav --still-frames=...
npx remotion still <Comp> /tmp/x.png --frame=<f> --log=error   # 单帧，引擎根跑
~~~

- **`--score` 一定要带**：不带会到 score stage 现场合成二十分钟床（单核 20+ 分钟）。
- **先 content 提交，再 sync，再 make**：make 的 content check 会拦 dirty，也会拦「提交后 HEAD moved 但没 sync」。E53 首轮就死在 `x content HEAD moved (dfc46ee... -> 0c1cbd78...); run sync`，**这是第三次踩同一个坑**（E48/E51/E52 都踩过）。记死：**commit → sync → make** 三步不许跳。
- 抽帧避开 `Pages` 的 12 帧交叉淡变，偏移 18 帧。
- make 默认 `--cover-frame=180`（6.0 s）；E53 没显式传，cover.png 与 `publish.coverFrame` 都是 **180**。要 20 帧必须显式传并同步改 film.json。

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
8. **写画面**：`src/shared.tsx`（类型 + 组件 + `M`）、`src/script.ts`（8 场：页数 + 旁白 + PAGES_INDEX）、`src/scenes/*.tsx`、wrapper。先写旁白再按旁白写页；每页 10 句、每场景 10 的倍数。32 页 320 行 ≈ 19–21 分钟。
9. **配音**：见 2.3，两轮 dump。
10. **静帧复核**：make 抽 3 帧 + 人工看关键页（版式 + 口径一起看）。
11. **内容提交**：`node scripts/films.mjs check --strict` 0 error；提交 pack 源 `tsint/NN-slug: content — …`；film.json 单独提交。
12. **渲染**：sync → make（带 `--score`）。
13. **交付**：make 的 `--out` 指向 pack `delivery/`；mp4 / wav / report.json / scenes / stills 不入库，cover / srt / chapters / ffmeta 入库。
14. **收尾**：plan.md 补实测 + Delivery；SELF-AUTH 加一条；production-log 加一节；STATUS.md 那行改 `ready | 1136 | yes | ok | 11 | -`（sec 填实测秒数取整；tsint 集的 delivery 一律 11）；写下一版 HANDOFF；提交 delivery、ready、docs 三笔。**写长 Markdown 用 `tools.write` 写临时文件再 `cat` 追加，别用 shell printf**。

## 4. 当前进度（E53 完成时）

- ts-base：`bb3fc52`（第 53 集数据/证据快照）← `5893dc0`（证据 28 条）← `42c89b7`（三模块 + 27 条单测）。工作区干净。
- ts-admin：未动，HEAD `1318010`（E52 的 manifest 瘦身）。
- video_project：`0c1cbd7`（E53 content：32 页 / 320 行 / dist / 配音）+ `9fa097c`（delivery：cover / 320 cue srt / 8 章）+ `80b20cb`（film ready，coverFrame 180）+ 本次 docs 提交（plan Delivery / SELF-AUTH A50 / 本文件 / production-log / STATUS）。
- 引擎：未改（`a667688`）。

- **池与数据**：20 只 HS300 行业分层 / 48,572 行 / bars 2,412–2,431 / train 1,688–1,701 / tune 362–365 / test 362–365；10 候选与 E50/E52 同（naive、drift30、exp0.2、exp0.5、ar1、ridge5-l1e-3、ridge5-l1、sar12、sar5、hmean5）。
- **七条基线（检验段 MAE）**：平均单模型 **11.2070**、等权 **10.1566**、中位数 **9.6562**、岭权重 **9.6322**、迭代 η0.1 十轮 **9.5693**、迭代 η0.5 十轮 **9.5521**、最优单模型 **9.5498**、oracle **9.5397**、naive **9.5433**。
- **增益**：等权比平均单模型低 **9.37%**、比最优单模型高 **6.35%**（20 只里 **0/20** 赢）；岭权重比等权低 **5.16%**（20/20 改善）；迭代 η0.1 五轮比等权低 **5.78%**（20/20）；η0.5 比 η0.1 又低 **0.0172**；中位数与等权差 <5%（9.6562）；有效权重 **2.1601**。
- **十候选检验 MAE**：naive 9.5433 / drift30 11.3371 / exp0.2 16.2997 / exp0.5 11.4157 / ar1 9.6630 / ridge5-l1e-3 9.7193 / ridge5-l1 9.7178 / sar12 9.6605 / sar5 9.6575 / hmean5 15.0564（调参段 11.7125 / 13.0216 / 19.3723 / 13.4902 / 11.7991 / 11.8351 / 11.8334 / 11.8333 / 11.8181 / 17.6019）。
- **冠军分布**：naive 9 / sar12 4 / drift30 3 / sar5 3 / ar1 1；naive 与 oracle 只差 **0.04%**。
- **噪声增强**：σ=0.05×sd、K=10，单变体均值 **16.7067** → 集成 **10.6134**，devRatio **0.2649**，σ=0 偏差 0.0、同 seed 逐位复现；但仍不如干净单模型 9.6630。
- **成片**：1,135.97 s / 34,079 帧 / 8 场 32 页 / 320 cue / 8 章 / mp4 **54,057,947 B** / tree `121eb49bb0d8980b`；mix 48 kHz / 1,137.16 s、peak −1.23 dBFS、RMS −26.71 dBFS、ducked 55.3%、musicGain −4.5；loudnorm dynamic in I −23.4 / TP −1.4 → out I −15.8 / TP −2.0 / LRA 2.5；闪烁 34,079 帧 mean 20.30 / min 14.57 / max 22.44、mean|d| 0.0132、p99 0.1061、max 6.81、7 切点。
- **证据**：28/28、8.9 s（data 4 / ensemble 6 / cv 7 / iter 6 / noise 5）；三条计划预言全部反向，**按实测写成 PASS 的负结果**，没有改阈值。

## 5. E54 的开工顺序（建议）

1. 读 `plans/series.json` 第 54 项 `darts-differentiable-search`（ch06、26 min、deps `ensemble-average-iter`）与对应书页；标题《把架构搜索变成可微：DARTS 与三层搜索空间》。**别照抄本文件对算法细节的猜测** —— 以 plan 与书页为准。
2. 数据：可复用 E53 的 20 只（`data/episodes/53-ensemble-average-iter/daily.csv`）或 E52 的 `daily300.csv`，看 plan 需要多少任务。
3. 证据 26–30 条；画面 8 场 36 页 / 360 行 ≈ 21–22 分钟（26 分钟计划按历史区间可落在 21–23 分钟）。
4. outro 的下一集卡从 series.json 第 55 项读（`generalizable-search`《省算力的三种剪枝：子空间、比较器与组合预测器》），不要凭印象写。
5. 走第 3 节 14 步；**commit → sync → make** 与 **`--score`** 这两条别再踩。

## 6. 已知欠账 / 风险

- **E54–E64 共 11 集未做**；E65–E74 已交付。下一集从 E54 开始，goal 与人类指令的冲突见第 0 节。
- E53 的三条计划预言全部没成立（等权反而高 6.35%、岭权重 20/20 改善、迭代 20/20 改善且 η 越大越好）；这是主结论，不是失败，后续集引用 E53 读数时别改口径。
- E53 的噪声增强是「ARIMA 基础模型 + σ=0.05 相对噪声」的替身实验，不是原书完整流程；引用时说清楚。
- 集成类实验的**权重只能来自 train/tune**，E53 的 fitWeights 与 iterReweight 都只用调参段，检验段只报告 —— E54 别把测试段喂进权重拟合。
- `fitWeights` 的岭项 λ=1e-3 会让黄金权重偏移到 0.69987，单测容差必须 ≥5e-4；`iterReweight` 的 [0.6,0.4] 黄金值必须用单点向量（两点平均会变 [0.55,0.45]）。
- E53 生成物大：narration.wav 109,052,204 B（不入库）、delivery mp4 54 MB（不入库）。
- 引擎 `out/` 不应留 `tsint-*` 残留（make --out 指向 pack delivery）。
