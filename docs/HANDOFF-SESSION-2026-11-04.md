# SESSION HANDOFF — 2026-11-05（E64 之后）— 下一任 agent 从这里开始

> **这是当前唯一 active 的交接文档。** 旧文件（`HANDOFF-E41.md` … `HANDOFF-E58.md`、`HANDOFF-EVENING.md`）都是历史记录；按集开工时读对应集那份，**上手先读本文**。
> 交接时状态：**E59–E64 全部交付（系列 74/74，ch07 收束）**，四仓干净、没有正在运行的 job。下一集 E65《误差三件套》（ch08 第一集，原文 p.205）后端未开始。

## 1. 一句话现状

tsint 系列 74 集，已按生产顺序交付 **E1–E64（74 集，全系列收齐）**。最后一集是 **E64《只训练 0.1% 的参数：线性探测、LoRA 与语义锚点》**（`series/tsint/episodes/64-llm-side-adapters`）：8 场 **32 页**、320 条旁白、成片 **1,053.47 s（17:33.47）/ 31,604 帧**、mp4 53,734,999 B、19/19 证据（主干 70,209 / 线性头 1,300 / LoRA 512 / 锚点 0；relMAE 1.0543、LoRA 只降 0.03%、锚点 0.09 对 0.365）、26 单测。E63《把序列画成图》同批交付（1,111.50 s / 8 场 32 页 / 320 条旁白；GAF 反解 1.3e−14 / MTF 图像行和 16 / 图 1.3913 对数字 1.3908）。ch07 收束，下一集进 ch08 第一集 E65。

## 2. 读什么（顺序）

1. 本文（环境 / 工作流 / 坑）。
2. `docs/HANDOFF-E64.md`（上一集成片读数、8 场结构、本集教训、E65 入口）。
3. `series/tsint/plan.md`（74 集顺序与时长）、`docs/series-tsint-episodes.md`（每集主张/模块/验收/数据）。
4. `AGENTS.md`（工作规范）、`SELF-AUTH.md`（自授权记录，每集末尾追加一条）。
5. 要开工 E65 时，再看 `docs/HANDOFF-E63.md` 与本文的流程与坑（一致，可交叉验证）。

## 3. 仓库与环境

| 路径 | 角色 | 备注 |
|---|---|---|
| `/root/ts-base` | Haskell 算法库 + 证据程序 + 数据 | 容器 `haskell-ts` 的 `/work` 是 bind mount，宿主改文件即容器可见 |
| `/root/ts-admin` | 数据导出脚本（polars 读 lake parquet） | 只加脚本，不改数据湖 |
| `/root/video_project` | 内容仓：每集 pack + 文档 + 成片交付 | git 主仓；`series/tsint/episodes/<id>/` |
| `/root/video-pipeline-blueprint` | 渲染引擎（Remotion + 音频 + QA + make） | **不要直接改** `src/tsint-*`；改 pack 后 `films sync` 生成 |

- Haskell 工具链在容器里：`docker exec haskell-ts bash -lc 'export PATH=/opt/ghc/9.14.1/bin:$PATH && cd /work && cabal build all'`；测试 `cabal test`（全量约 2–5 分钟，用后台 job，别用默认 120 s）。
- 证据可执行 `tsbase` 由 cabal 构建；调用形如 `cabal run -v0 tsbase -- evidence-ch07-channel --data data/episodes/58-channel-strategies --out data/episodes/58-channel-strategies --evidence inventory/evidence`。
- Python：TTS 用 `/root/venv-netbond/bin/python3`（装了 edge-tts）；其余脚本用 `python3` 即可。
- 渲染：`npx remotion still <Composition> <out.png> --frame=N '--props={"music":null,"narration":null}'`；整片用 make（见 §4）。

## 4. 一集的标准生产流程（E58 实测跑通）

### 4.1 后端（ts-base + ts-admin）
1. 读 `docs/series-tsint-episodes.md` 里该集的算法单元/验收画面/数据；在 `src/TsBase/Algos/ChNN/<Module>.hs` 写纯函数模块（无 IO、无外部库），在 `test/Algos/ChNN/<Module>Spec.hs` 写单测并注册到 `test/Spec.hs` 与 `ts-base.cabal`。
2. `/root/ts-admin/inventory/scripts/export_chNN_*.py` 导出数据到 `/root/ts-base/data/episodes/<id>/`（csv + manifest），记录 sha256 与行数。
3. 写 `app/ChNN<Name>Evidence.hs`：读数据、算读数、写 evidence JSON + checks.txt + summary.json；在 `app/Main.hs` 注册子命令、`ts-base.cabal` 加 other-modules。
4. 构建 + 全量测试 + 跑证据；证据 JSON 里 checks 数就是视频「验收」页的依据。
5. 提交 ts-base：模块+单测一笔、数据+证据一笔（只用路径 `git add`，禁 `commit -am`）。

### 4.2 视频包（video_project）
1. 复制上一集 pack 骨架到 `series/tsint/episodes/<id>/`，改 `film.json`（id/composition/prefix/order/status draft/audio.musicGainDb **必须写 −4.5**）、`build/script_spec.json`（8 场，页按每 10 行切）、`build/make_*.py` 的 id 与 voice 路径、`src/scenes/*`、`src/figs.tsx`、`src/shared.tsx`、composition。
2. 文案先对齐证据实际分组再写，避免返工（E58 的坑）。
3. `cd /root/video-pipeline-blueprint && node scripts/films.mjs sync`。
4. 生成 script 与时间轴（**voice.json 是先有鸡先有蛋**：script.ts 要 import 它，首次没有就从上集 `data/` 拷一份占位，TTS 跑完会覆盖）：
   - 在 pack 根：`python3 build/make_script.py`
   - 在引擎根：`node scripts/qa/dump_script.mjs src/tsint-<id>/script.ts /root/video_project/series/tsint/episodes/<id>/data/lines.json`
   - 在 pack 根：`/root/venv-netbond/bin/python3 build/tts_narration.py --lines data/lines.json --clips assets/audio/clips --voice-out data/voice.json --clips-json data/clips.json --concurrency 6`（后台 job，可能 10+ 分钟）
   - `python3 build/make_narration.py`；`python3 build/make_script.py`；再次 `films sync`；再 dump 一次确认总时长。
5. 静帧复核：帧 = `round(((页首行 start + 下一页首行 start)/2) × 30)`，最后一页用 scene 末；用 remotion still 逐页看，修版式。
6. `film.json` 设 status ready / narration `assets/audio/narration.wav` / assetsStatus complete；**提交 content pack**（否则 make 的 content check 会失败）。
7. make（后台 job）：
   `cd /root/video-pipeline-blueprint && node scripts/make.mjs --film tsint-<id> --score=out/e04-score-loop-48k.wav > /tmp/e<NN>_make.log 2>&1`
   23 stage 全 ok 即 PASS；报告在 pack `delivery/report.json`（gitignored）。
8. 提交 delivery（cover / srt / chapters 两件）与 docs（plan Delivery、SELF-AUTH 一条、HANDOFF-E<NN>、production-log、STATUS、本 session handoff 视情况更新）。
9. `git status` 三仓确认干净。

## 5. 当前进度与 E65

- 已完成：E1–E64（74/74，四仓干净）。E64：ts-base `c03dc93` + `aed8004`、ts-admin `0b42eee`、video_project `11cf61c` / `db4e249` / docs `777829c`。E62 及更早：E59 提交：ts-base `95a1193` / `116b3ff`；E60：ts-base `19efa1a` / `5e8f810` / `42b05f6`、ts-admin `a6ad270`、video_project `d19f9f1` / `ac3fbc0`；E61：ts-base `673ca34`、ts-admin `2c10fa3`、video_project `ae82538` / `453ab60`。E62：ts-base `10b3d90` / `ed20c13` / `417f3ad`、ts-admin `379ea56`、video_project `23973e8` / `f775a04`。E63：ts-base `9122e4f`、ts-admin `3f065d7`、video_project `fb2b1e9` + 本次 delivery/docs。引擎 `a667688` 未改。
- E64 已交付读数见 `docs/HANDOFF-E64.md` §3–§5：19/19 证据 107.10 s、模块 321 行 / 26 单测、主干 70,209（66,113 + 4,096）、线性头 1,300（1.85%，relMAE 1.0543 对随机头 1.0847）、LoRA 512（0.73%，loss 只降 0.03%，testMSE 36.5813 对 36.5847）、锚点 0 参数（0.09 对线性 0.365 对机会 0.05、top-8 26/41/20/51/50/61/52/30）。
- E65 规格（`docs/series-tsint-episodes.md` 第 1166 行起）：`65-error-metrics-trio`，ch08 第一集，原文 p.205；主张 4 个绝对误差 [1,1,1,1]→[4,0,0,0] 时 MAE 保持 1、MSE 从 1 涨到 4，三个指标（MSE/MAE/中间指标）排名分歧只在误差幅度不等时出现。目录只有 stub，后端未开始；数据可复用 sz000001 收益序列或构造误差样例。
- E65 内容包要做的：从 E64 拷 build/ 三个 py 与 src 骨架改 id；`build/make_dist_data.py` 新写；16 分钟 → 约 300 行（8 场 × 4 页 × 10 行，E64 实测节奏）；注意每场页数 = 场景文件 AbsoluteFill 数；TTS 顺序见 §4.2 第 4 步（改文本后要跑两轮）。
## 6. 坑（按踩坑频率排序）

1. **make 前 content 仓必须干净**：`films check --strict` 连未跟踪的 delivery 产出都算 dirty。提交 pack / 移走旧 delivery 后再 make；改混音参数重跑时，画面段会 reused（E58 第二次 make 8 段全复用，2 分钟出片）。
2. **musicGain 显式写 −4.5**：只写 `music: null` 会按 0 dB 混，gap 只比 speech 低 3.8 dB，听感吵；E57/E58 口径都是 `"musicGainDb": -4.5`。
3. **时间轴只认 sync 后的运行时脚本**：先 `films sync` 再 dump；否则 voice.json 还是上一版，字幕漂几秒、静帧页映射错位。
4. **TTS 必须后台 job / timeoutMs≥600000**：run_code 默认 120 s 会杀掉 TTS（clips 有缓存，重跑只补缺）。
5. **run_code 默认 120 s**：cabal test、make、TTS 全部用 `run_in_background` + 轮询，或显式 timeoutMs。
6. **文案对齐证据**：页面/讲稿的「几项」必须等于 evidence JSON 的 checks 分组；分组变了改视频，不改证据（E58 谱九项/token 两项）。
7. **窄值列**：Row 的 value 约 300 px，长公式/长列表换行；改用 KV 或缩短值，明细放 note。
8. **自绘图组件算宽度**：ChannelStack 写死宽度导致 flex 压扁标签竖排；宽度 = 标签 + 内容 + 边距，标签 `flexShrink: 0`。
9. **帧/页中点**：改稿后只重渲受影响页；dump 与运行时脚本不一致时以运行时为准。
10. **容器**：haskell-ts 内存上限 12 GiB；`bash -lc` 双引号里 `$PATH` 会被吞，命令写进 /tmp 脚本再 `docker cp`/`docker exec` 更稳；跑全量测试输出重定向后 grep。
11. **commit 纪律**：`<对象/阶段>: <做了什么>`；只用路径 add；禁 `commit -am`；提交前后 `git status/diff/log`。
12. **每集收尾必须追加 SELF-AUTH 一条**（决定/依据/可逆性/返工成本），并更新 STATUS 行与 production-log。

## 7. 关键路径速查

- 成片与封面：`series/tsint/episodes/<id>/delivery/`
- 报告：同目录 `report.json`（gitignored）
- 证据：`/root/ts-base/inventory/evidence/<id>.<group>.json` 与 `data/episodes/<id>/`
- 引擎运行脚本：`/root/video-pipeline-blueprint/src/tsint-<id>/script.ts`（由 films sync 从 pack 生成）
- 交接模板：`docs/HANDOFF-E58.md`（本集）、本文（会话级）

## 8. 承接记录（2026-11-04 晚，session 承接 session-39f2d02d）

- 四仓基线：video_project `ef095bd` / ts-base `2b608c5` / ts-admin `d2857a8` / 引擎 `a667688`，承接时四仓 clean；容器 haskell-ts 在跑（GHC 9.14.1，/work 剩余 449G）。
- 承接决定：剩余 **E59–E64**（生产序 69–74）按本文 14 步逐集生产，每集四段提交（ts-base 模块+测试 / 数据+证据 / video pack+timeline / delivery+docs），每集在 video_project `SELF-AUTH.md` 追加一条（A56 起）；`film.json` 停在 `ready`，不发布 B 站。
- goal：用户要求以防断流，本会话以 active goal 推进（objective = 交付 E59–E64 至 74/74），中断后按 STATUS/本文与 goal 续跑。
- E59 参数账（先记，开工后按实测上屏）：计划写 **65,856** 个编码器参数；512→64→512 MLP 实算 **66,112**（512·64+64 + 64·512+512），加 1 个可学习掩码标量 = **66,113**。决定按实测数上屏、在 `docs/plan.md` 偏差表写清差值来源，不硬凑计划数；线性头 (64+1)×20 = **1,300** 与计划一致。
- 执行顺序：E59 开工前先读 `docs/HANDOFF-E58.md` 与 `series/tsint/episodes/58-channel-strategies/` 模板，算法先单测+证据、后视频；每完成一集更新 `STATUS.md`、`docs/production-log.md` 与本文进度。
- 2026-11-05 凌晨收尾：E64 交付（系列 74/74，ch07 收束），成片 1,053.47 s / 31,604 帧 / 320 cue；pack `11cf61c`、delivery `db4e249`、docs `777829c`；`.tmp-e64-stills.mjs` 与 `.tmp-e63-stills.mjs` 已删，引擎 `a667688` 未改。
- 承接记录（历史）：E59、E60、E61、E62、E63 五集已交付（系列 73/74）。四仓基线：video_project 见本次 docs 提交 / ts-base `9122e4f` / ts-admin `3f065d7` / 引擎 `a667688`。E61 起 score 仍复用引擎 `out/e04-score-loop-48k.wav`（report scoreReused false）；交付摘要见 `docs/HANDOFF-E59.md` … `HANDOFF-E63.md`。

