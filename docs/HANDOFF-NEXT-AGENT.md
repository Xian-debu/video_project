# HANDOFF — 下一任 agent 接手单（tsint 系列，E18 收尾后）

> 写于 2026-10-31。本文件写给**下一个接手本工程的 agent**：读完这一份就能继续跑，不必回放旧会话。
> 真源顺序：本文件 → `docs/HANDOFF-EVENING.md`（长期主入口，§4 流水线、§5 冻结口径、§8 坑）→ `STATUS.md` → 四仓 `git log` → `docs/production-log.md`。
> 当前用户状态：**无人值守目标已被用户暂停**（goal phase=paused）。不要再自动开启全系列连跑；等用户明确指令再继续下一集。

## 0. 60 秒接手

```bash
# 四仓位置
/root/ts-base                 # Haskell 算法 + 证据 + 数据
/root/ts-admin                # 只读数据导出（Python，Lake）
/root/video_project           # 内容仓：每集一个 pack（video_project = 内容，engine = 渲染器）
/root/video-pipeline-blueprint # 渲染引擎（Remotion + TTS + score + QA 门禁），生产期已冻结

# 当前状态自检
cd /root/video_project && git status --short && node tools/check.mjs
cd /root/ts-base && git log --oneline -3
docker ps --format '{{.Names}} {{.Status}}' | grep haskell-ts || docker start haskell-ts
node /root/video_project/tools/status.mjs --md | sed -n 1,12p
```

- 已交付成片 **28 / 74**：E01–E18 + E65–E74，全部 `status: ready`，**未发布 B 站**。
- 算法 **68 / 190** 模块、**965** 条断言、**67** 组 cabal suite。
- 当前最后一集 **E18 `norm-revin-now-mean`**（ch03 第三集，归一化三兄弟：RevIN / NowNorm / MeanNorm），本轮已走完 数据 → 算法 → 测试 → 证据 → pack → TTS → 成片。
- **下一集 = E19 `linear-revival-dlinear-fits`**（`plans/series.json` production_order 第 29 位、series order 19；“线性模型复兴：共享权重线性、DLinear、FITS”）。E18 的 outro 已经按这个标题写了下一集预告。

## 1. 用户目标与授权（不要改口）

- 用户要按 `/root/ts-base/plans/series.json` 的 `production_order` **一集一集**做完整系列（74 集）：每集在 ts-base 实现算法+测试、ts-admin 导出数据、video_project 出成片、过全部 check/证据门，**逐集 git 提交**，每次提交在 body 末尾附**增量自授权清单**引用。
- **不发布 B 站**，只做到 `status: ready`；唯一例外是用户以后明确要求。
- 视频长度不限，但必须讲清楚；不能为凑时长灌水。
- 每集提交说明末尾固定带：
  ```
  self-auth: A5 (video_project) — 全系列无人值守恢复；详见 docs/HANDOFF-EVENING.md §1/§3
  ```
  ts-base/ts-admin 的每次提交引用各自的 SELF-AUTH 条目（A38–A41 是 E18 新增）。
- 用户暂停了 goal，**本接手单只交代现状与做法，不构成自动续跑授权**。

## 2. 四仓结构

| 仓 | 职责 | 关键路径 |
|---|---|---|
| ts-base | Haskell 算法库 + 测试 + 证据 + 数据 | `src/TsBase/Algos/ChNN/*.hs`、`test/Algos/ChNN/*Spec.hs`、`app/*Evidence.hs`、`data/episodes/<NN-slug>/`、`inventory/evidence/chN-*/`、`SELF-AUTH.md`、`docs/09-book-errata.md`、`plans/series.json` |
| ts-admin | 只读数据导出（A 股日线、面板、成交量） | `inventory/scripts/export_*.py`、`inventory/evidence/`（只入库脚本/manifest/校验和，原始 csv 不入库） |
| video_project | 内容仓：每集一个 pack | `series/tsint/episodes/<NN-slug>/`（film.json、src/scenes/*.tsx、src/script.ts、build/*.py、data/、docs/plan.md、delivery/） |
| video-pipeline-blueprint | 渲染引擎（Remotion、score、mix、QA） | `scripts/make.mjs`、`films.mjs`、`qa/dump_script.mjs`、`out/e04-score-loop-48k.wav`（复用 score） |

引擎与内容仓的边界：**engine 不存内容**，`node scripts/films.mjs sync` 把 video_project 的 film.json/pack 镜像成 `.films/index.json` 与 `src/tsint-*/…`、`data/tsint-*/`；改内容永远改 video_project。

每集 pack 结构（8 场固定六段：open / problem / definitions / intuition / implementation / verification / boundary / outro）：

```
<NN-slug>/
  film.json          # id/composition/entry/exports/status/narration/audio/derive/derived/docs/notes/publish.coverFrame
  src/script.ts      # 讲稿（SCENES/LINES/TOTAL/CAPTIONS），数字全部从 data 取
  src/shared.tsx     # 设计令牌 + 组件（Head/Card/Stat/Row/Bars/LinePlot/CodeBlock/Pages/Scene/Formula/Verdict…）
  src/scenes/*.tsx   # 8 个场景，每场 2–5 页（Pages at 分数）
  src/TsintNN*.tsx   # composition：Audio + Sequence + Subtitle
  build/generate_*_data.py  # 从证据产物重建 data/*.json（derived、不入库）
  build/tts_narration.py / make_narration.py  # 逐句 TTS + 拼接
  data/*.json        # lines.json / voice.json / clips.json / norm.json（norm.json 是 derived）
  docs/plan.md       # 论点 + Verification 清单 + Data + Algorithms + Boundaries（数字必须真实）
  delivery/          # mp4（不入库）+ cover.png + tsint-NN.srt + chapters + ffmeta
```

## 3. 工具与固定命令

### ts-base（Haskell，宿主机无 GHC）
```bash
docker exec haskell-ts bash -lc 'export PATH=/opt/ghc/9.14.1/bin:$PATH; cd /work && cabal build all'
docker exec haskell-ts bash -lc 'export PATH=/opt/ghc/9.14.1/bin:$PATH; cd /work && cabal test'
docker exec haskell-ts bash -lc 'export PATH=/opt/ghc/9.14.1/bin:$PATH; cd /work && cabal run tsbase -- evidence-ch03-norm --data data/episodes/18-norm-revin-now-mean --out data/episodes/18-norm-revin-now-mean --evidence inventory/evidence'
```
- 新增算法模块：`src/TsBase/Algos/ChNN/Xxx.hs`，测试 `test/Algos/ChNN/XxxSpec.hs`，并在 `test/Spec.hs` 挂 suite（断言条数进 meta/plan）。
- 证据程序：`app/ChNN*Evidence.hs` 输出 `inventory/evidence/<unit>.json`（schemaVersion/unitId/episode/commit/env/inputs/artifacts/metrics/tests/checks），同输入两次要逐字节一致。

### ts-admin（Python 导出）
```bash
cd /root/ts-admin && .venv/bin/python inventory/scripts/export_ch03_norm_panel.py
# 只读 Lake、hfq、剔停牌与 close<=0、CSV 6 位小数、manifest 带 rows/first/last/max_gap_days/sha256
# DEFAULT_OUT 指向 /root/ts-base/data/episodes/<NN-slug>
```

### video-pipeline-blueprint（引擎）
```bash
cd /root/video-pipeline-blueprint
node scripts/films.mjs sync                     # 每次改完 pack/film.json 必跑
node scripts/qa/dump_script.mjs src/tsint-18-norm-revin-now-mean/script.ts data/tsint-18-norm-revin-now-mean/lines.json
npx tsc --noEmit                                # 场景类型检查（remotion still 不查类型！）
# TTS 在 pack 里跑（宿主机 python3 没有 edge_tts，必须用 /root/.venvs/tts/bin/python）
cd /root/video_project/series/tsint/episodes/18-norm-revin-now-mean
/root/.venvs/tts/bin/python build/tts_narration.py --lines data/lines.json --clips assets/audio/clips \
  --voice-out data/voice.json --clips-json data/clips.json
python3 build/make_narration.py
# 出片（必须显式 --score，否则会重渲染 bed 卡死）
cd /root/video-pipeline-blueprint
node scripts/make.mjs --film tsint-18-norm-revin-now-mean --score=out/e04-score-loop-48k.wav
```

## 4. 每集流水线（固定 12 步）

1. **侦察**：读 `plans/series.json` 该集全部字段（algorithms/impl_notes/tests/demo/concepts/book_figures/verification/risks/data）+ 书页原文（PDF 页 = 印刷页 + 8，用 `pdftoppm` 逐字核对公式）。冲突先写进该集 plan.md 的「口径决定」。
2. **算法**（ts-base）：≤3 个独立模块，`Algos/**` 之间不互相 import；Haddock 写清公式/决定。
3. **测试**（ts-base）：黄金值、不变量、边界、错误路径；`cabal test` 全绿。
4. **提交 1**：`algos(chNN): <模块> — <一句话>`（含 self-auth 行）。
5. **数据**（ts-admin）：只读导出 + manifest；`DEFAULT_OUT` 指向 ts-base `data/episodes/<NN-slug>`；单集 ≤5 MB；核对行数/首末/最大空档。**提交 2**：`export(chNN): …`。
6. **证据**（ts-base）：`app/ChNN*Evidence.hs` → `inventory/evidence/*.json` + `summary.json`/`*.csv`；**提交 3**：`evidence(chNN): <集> — <关键数字>`。
7. **pack**（video_project）：`build/generate_*_data.py` 重建 `data/*.json`（derived、gitignore）；写 shared/script/8 scenes/composition/film.json（status producing、narration、audio{music:null,musicGainDb:-4.5}、derive、derived、notes、assetsStatus incomplete）。
8. **dump + TTS**：`sync` → `dump_script` → 把 engine 的 lines.json 拷回 pack `data/` → TTS → 再 `sync` → 用实测 `voice.json` 重跑 `dump_script` → 把新 lines.json 拷回 pack → `make_narration.py`。
9. **页面时间轴**：把所有 `Pages at` 分数按**实测 voice 行起点**重新吸附（页切换落在某句开头，不能句中切页）；改完 `npx tsc --noEmit`。
10. **静帧复核**：`make` 的 stills 或 `remotion still` 逐场看关键帧，取**页中段**帧；查排版/字数/公式越界/字幕条遮挡。修一轮再提交 pack。
11. **出片 + 门禁**：`make.mjs --film … --score=out/e04-score-loop-48k.wav`；必须 **PASS**：loudnorm I∈[−16.5,−13]、TP≤−1.5、music gate、flicker、content check、delivery 全件。coverFrame 选**无字幕、场末卡**的帧；publish 只写 `out/export`，**要把 cover.png / srt / chapters / ffmeta 拷回 pack `delivery/`**。
12. **文档 + 提交 4**：`docs/production-log.md` 加本集条目（ts-base/ts-admin/video_project 提交号、成片秒数/帧数/旁白/门禁数、卡点、返工、偏差、下一集）；`node tools/status.mjs --md` 重新生成 `STATUS.md`；更新 `docs/HANDOFF-EVENING.md` §2 数字与 §5 下一步；四仓 `git status` 干净后进下一集。

## 5. 当前进度（E18 已交付）

- 成片 28/74：E01–E18（ch01 起）+ E65–E74；均已 `ready`，无 B 站发布。
- E18 交付物：讲稿 223 行、**840.87 s / 25,226 帧**、8 场 27 页、−15 LUFS / TP −2 dBFS、223 cue 无换行、8 章、封面 4350；证据 28 checks（4 数据 / 4 结构 / 20 行为）；断言 +20（revin 8 / nownorm 6 / meannorm 6），套件 67 / 总断言 965。
- E18 关键读数（已冻结，plan.md 与画面一致）：RevIN 往返误差 0、归一化后均值 0 / 方差 1；NowNorm 手算 (1−3)·1+3 = **1**（brief 的 4 是错的）；MeanNorm 与 z-score 逐点最大差 **2.2247**；panel 3,867 行、量纲比 **658.67×**；未归一化 MAE 963.93 / 0.9538 → RevIN 后 481.94 / 0.3625；合成漂移序列 NowNorm **0.9731** vs MeanNorm **2.0931**（2.15×）、去漂移后 **0.5215** vs **1.0045**（1.93×）；指数 76.55 / 82.25 / 84.88。
- 四仓 HEAD（E18 全部提交后以 git log 为准）：video_project `8971747`（delivery；docs 提交紧随其后）；ts-base `d992d5f`（evidence）← `5d617cc`（algos）；ts-admin `f6902e9`；engine `a667688`（冻结，未改）。
- 下一集 E19 `linear-revival-dlinear-fits`：先从系列计划读 `algorithms` 三模块（共享权重线性 / DLinear / FITS），再按上面 12 步走；E18 的 evidence 程序 `app/Ch03NormEvidence.hs` 是最好的模板（H=48/F=24 骨干、Adam/seed 写死、三条曲线导出）。

## 6. 已冻结口径（写片前必读，详见 HANDOFF-EVENING §5）

- E13 归一化三件套：参数个数是本仓参数化；RevIN 存 (mu,sigma)、eps 是正确性；三条桥接逐位 0.0。
- E14 注意力：τ 乘在 QKᵀ 上 == 温度 1/τ；Δ 按列加；行偏置被 softmax 吃掉。
- E15/E16 读数与 STL：相关系数四口径、配对完整、总体方差 /K；STL 按 Cleveland 1990（L=5 → n_s=7 / n_t=11 / inner=2 / outer=0 / tricube / 端点局部线性）；读数不是数据的属性。
- E17 滑窗/指标/选模：窗口数 `(T−off−H−F) div s + 1`（第 4 参是 offset，gap 属 chronoSplit，A35/E31）；MAE 与 MAPE 对价段给出相反结论；MAPE 零值三口径都要报计数；Adam(1e−3)+早停回最优轮。
- E18 归一化：三个都是 `x̂ = f(x−base)+base`，区别只在 base；RevIN eps 用 `sqrt(sigma²+eps)`（与 ch02 的 `sigma+eps` 不同，不能混用）、统计窗只取输入 H、仿射默认关闭；NowNorm 减末值、MeanNorm 只减不除；**漂移决定减谁**，不是谁更先进（A38–A41 / E33）。

## 7. 坑（按类，都是踩过的）

### 流程 / 引擎
- `make` 的 content check 把**未提交文件也算 dirty**：改完 pack/文档必须先提交再 make，否则首轮就红。
- **make 必须显式带 `--score=out/e04-score-loop-48k.wav`**：不带会重渲染整段 bed（E11 单核 46 min 没写出来）。
- `films.mjs sync` 会镜像 pack 的 `data/`，**会删掉 engine 侧 lines.json**：顺序永远是 sync → dump_script → 把 engine 的 lines.json 拷回 pack，否则下一轮 sync 又丢。
- publish 只写 `out/export`；`cover.png / tsint-NN.srt / chapters / ffmeta` 必须手工拷回 pack `delivery/`，否则 `node tools/check.mjs` 报 delivery 缺件。
- `report.json` 的 content.commit/dirty 是生成时快照；最终以交付提交 HEAD 为准。
- engine 处于生产冻结（`a667688`），**不要改引擎**；需要新能力先问用户。

### 画面 / 排版
- `remotion still` **不做类型检查**：写完场景先 `npx tsc --noEmit`（`Chip` 传未声明 prop 会 TS2322，make 的 typecheck 阶段才炸）。
- `Pages` 的 `at` 是场景时长分数，页间 12 帧交叉淡变：静帧取在 at 边界会看到**上一页**，复核一律取页中段。
- `Pages at` 必须用**实测 voice.json** 重算并吸附到句首（E14 估算比实测短 79 s，页面整体前移）。
- `LinePlot` 自动 8% 留白会把价格轴拉负 → 显式传 `yMin/yMax`；窄卡 `Row` 名字列给 36%、值列 nowrap；右栏 4 个 Stat 高 130 装不下（实测 ~150）；公式 TeX 一律 `String.raw`，`FT.h3` 不存在。
- 书页引用必须对 **printed 页**（PDF = printed + 8），逐字核对公式，不能凭计划摘要（E12/E13 都因页码/公式错返工）。
- 旁白不要声称「书里说 N 个参数」：参数清点属本仓参数化，必须标「本仓」。

### TTS / 时间轴
- 改讲稿某行**必须删对应 clip** 再跑 TTS：`tts_narration.py` 对已存在且 >800 B 的 mp3 直接跳过，不删就沿用旧音（总长会变，delivery 要整跑）。
- 讲稿每行 <6 字会被剔除；`MAX_CHARS=34` 是字幕上限，超了要换行（publish 会统计 longest）。
- TTS 用 `/root/.venvs/tts/bin/python`（宿主机 python3 无 edge_tts），并发 4；`narration.wav` 是 48 kHz 单声道（与 score 混音必须同采样率）。

### 数据 / 证据
- 面板数据必须**对齐日期**再降采样：E18 首版 dates 3867 行 vs 序列 430 点，按同一 step 取 `cols["date"][::step]` 才对。
- 证据 JSON 不能用 Haskell `show` 写字符串（中文会变十进制转义、非法 JSON）：自写 `q` 转义 `"\\\n\r\t` 与 `\u%04x`。
- `gaps.idxmax()` 在未重置索引的 Series 上返回标签不是位置；用 numpy timedelta 差值再 argmax。
- 停牌 = 无行，不是 NaN；常数窗口才有 sigma=0。
- 真实数据读数只属于这只票这段历史，plan 的 Boundaries 必须写清楚不外推。

### Haskell / 训练
- 计时别用惰性绑定：`let outcome = train ...` 计时恒 0，必须在 IO 里 `evaluate (length …)` 强制求值。
- 大训练别 forkIO 全并行（GCN 13 路 + 300 轮 thunk OOM、容器 EXIT=137）；串行或分档。
- 梯度检查阈值按网络规模分档；BPTT 末步不再乘 tanh′；Adam 步数从 1 起算。
- 证据重跑只应改 `sec` 列；指标列变了说明代码/数据真的动了。

### Git / 授权
- 一次提交只做一件事；只用路径 add；提交 body 带 self-auth 行。
- 三个仓都要干净；video_project `node tools/check.mjs` = 90 films / 2 series / 0 error（E18 加一集后 91 films，以实际输出为准）。
- 不发布 B 站；不删 `delivery/` 里已交付的 mp4；改 film.json 后一定重新 `sync`。

## 8. 断线恢复（60 秒）

```bash
cd /root/video_project && git status --short && node tools/status.mjs --md | grep -c ready
cd /root/ts-base && git log --oneline -3 && ls data/episodes | tail -3
docker ps --format '{{.Names}} {{.Status}}' | grep haskell-ts || docker start haskell-ts
tail -30 /root/video-pipeline-blueprint/out/e18-make.log
```
若 make 中途断：看 `out/e18-make.log` 最后一个 `== stage`；`delivery/scenes/` 里已渲好的分段会被复用（segments reused），重跑同一条命令即可，不要手工拼。

## 9. 交付验收清单（每集打勾）

- [ ] ts-base：`cabal build all` / `cabal test` 全绿；断言条数与 plan/meta 一致。
- [ ] ts-admin：导出脚本 + manifest；行数/首末/最大空档与证据一致；原始数据不入库。
- [ ] 证据：`inventory/evidence/<unit>.json` 的 checks 全 ok、重复跑逐字节一致。
- [ ] pack：`npx tsc --noEmit` 通过；`Pages at` 已按实测 voice 吸附；静帧逐场复核过。
- [ ] make：PASS；I=−15 LUFS、TP=−2 dBFS；music gate / flicker / content check 全过。
- [ ] delivery：mp4 + cover.png + srt + chapters + ffmeta 都在；cover 无字幕。
- [ ] docs：plan（真实数字）、production-log 条目、STATUS.md 重新生成、HANDOFF-EVENING §2/§5 更新。
- [ ] 四仓提交齐全且干净；提交 body 带 self-auth 行。

## 10. 不要做的事

- 不要在用户没发话时自动跑下一集（goal 已暂停）。
- 不要改渲染引擎（生产冻结）、不要重渲染整段 score、不要动 `out/e04-score-loop-48k.wav`。
- 不要为了让门禁过而改阈值/关检查；门禁红就修内容。
- 不要在旁白/画面里编造书里没有的归属、页码或数字。
- 不要把 derived 数据（`data/*.json`）或原始 csv 提交进库。
- 不要全局 kill 进程、不要动用户真实浏览器 profile（与本项目无关），长任务用后台 job + 日志。