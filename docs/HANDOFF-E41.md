# 交接文档（2026-11-02，E41 完成后封存）

> 本文件取代此前所有交接文档：docs/HANDOFF.md、docs/HANDOFF-EVENING.md、docs/HANDOFF-NEXT-AGENT.md 自本文件起只作历史存档，**不要按旧文档继续工作**。
> 旧文档里的「下一步」已全部过期；以本文件末尾的进度表与工作规范为准。

## 0. 一句话现状

- 视频系列 tsint 已交付 **51 / 74 集**（E01–E18、E19–E41、E65–E74），最新一集 **E41 ad-sparse-prior-dual-attention** 已 end-to-end 完成（算法 / 证据 / 数据 / 讲稿 / 配音 / 渲染 / 交付 / 文档 / 提交）。
- **目标（goal）已被用户暂停**：不要擅自 resume，也不要自动继续 E42。只有在人类明确要求「继续做下一集」时才恢复流水线。
- **永远不要发布到 Bilibili**。每集结束时 film.json 的 status 必须是 `ready`（不是 published），`bili` 字段保持 null。
- 下一集（等人类发话再做）：**E42 `42-metrics-distance-1nn-ee`**，标题《距离决定一切：从 1-NN+DTW 到弹性集成》，预估 22 分钟，数据源是 ts-base/plans/series.json 的第 42 项。

## 1. 四个仓库与它们的关系

| 路径 | 角色 | 谁写 |
| --- | --- | --- |
| `/root/ts-base` | Haskell 算法库 + 单测 + 证据程序（每集的读数都由它产出） | 算法模块 `src/TsBase/Algos/ChNN/*.hs`、测试 `test/Algos/ChNN/*Spec.hs`、证据 `app/ChNN*Evidence.hs` |
| `/root/ts-admin` | 数据湖导出脚本（日线 / 分钟线 → CSV + manifest） | `inventory/scripts/export_chNN_*.py` |
| `/root/video_project` | **内容仓**：每集一个 pack（画面源码 + 数据 + 讲稿 + 交付），以及全仓文档、schema、工具 | `series/tsint/episodes/<NN-slug>/` |
| `/root/video-pipeline-blueprint` | **渲染引擎**（Remotion + make 流水线）。引擎不知道任何片名，按 film 清单挂载内容仓 | 一般**不改**；只有引擎 bug 才动，且要单独提交 |

挂载方向：**内容仓是源，引擎是挂载点**。任何时候改内容都改 `/root/video_project` 里的 pack，然后 `node scripts/films.mjs sync` 把 pack 拷进引擎（`src/tsint-NN-...`、`data/tsint-NN-...`）。反向编辑引擎里的副本会被下一次 sync 覆盖。

系列计划在 `/root/ts-base/plans/series.json`：74 项，每项有 id / title / slug / runtimeMinutes / thesis / algorithms / pages / data 要求。**开工前先读它**。

## 2. 工具链（全部在本机，无外网依赖）

### 2.1 Haskell（GHC 不在 PATH）

容器 `haskell-ts` 把 `/root/ts-base` 挂在 `/work`：

~~~bash
docker exec haskell-ts bash -lc 'export PATH=/opt/ghc/9.14.1/bin:$PATH && cd /work && cabal build lib:ts-base'
docker exec haskell-ts bash -lc 'export PATH=/opt/ghc/9.14.1/bin:$PATH && cd /work && cabal run spec'          # 全仓测试
docker exec haskell-ts bash -lc 'export PATH=/opt/ghc/9.14.1/bin:$PATH && cd /work && cabal build exe:tsbase'
~~~

证据程序跑起来很慢（几分钟到十几分钟），直接跑已编译的二进制、**不要**每次 cabal run：

~~~bash
docker exec haskell-ts bash -lc 'cd /work && ./dist-newstyle/build/x86_64-linux/ghc-9.14.1/ts-base-0.1.0.0/x/tsbase/build/tsbase/tsbase evidence-ch04-sparse-prior --data /work/data/episodes/41-ad-sparse-prior-dual-attention --out /work/inventory/evidence/ep41 --evidence /work/inventory/evidence'
~~~

容器内存上限 **12 GiB**，超了就是 exit 137（不是 Haskell 异常）。注意力类模型每轮 O(t²)，先估内存与耗时再定轮次。

### 2.2 Python / 数据

- 数据湖：`from lake import lake`；`lake.daily(codes=[...], start=..., end=..., adjust='hfq', columns=[...]).to_pandas()`；`lake.minute(codes=[...], freq=5, start=..., end=..., adjust='raw').to_pandas()`。
- 每集导出脚本照抄上一集的形状（读 manifest、算 sha256、写 splits / window 参数 / deviation 字段）。**计划里的数据覆盖期可能和湖里实际不一致**：以实际导出为准，把 deviation 写进 manifest 和画面。

### 2.3 配音（TTS）

虚拟环境 `/root/.venvs/tts`，edge-tts 音色 `zh-CN-YunyangNeural`：

~~~bash
cd <pack>
/root/.venvs/tts/bin/python build/tts_narration.py --lines data/lines.json --clips assets/audio/clips --voice-out data/voice.json --clips-json data/clips.json
/root/.venvs/tts/bin/python build/make_narration.py     # 生成 assets/audio/narration.wav 与合轨时间轴
~~~

**片段缓存按 `scene#index` 命名**，不看文本内容。改了一句台词必须手动删掉对应 mp3（例如 `assets/audio/clips/verification-52.mp3`）再跑，否则会沿用旧音频。

### 2.4 渲染

~~~bash
cd /root/video-pipeline-blueprint
node scripts/films.mjs sync                 # 内容仓 → 引擎挂载（改完 pack 必跑）
node scripts/films.mjs check --strict       # 内容检查；失败通常是「dirty」或「HEAD moved」
node scripts/qa/dump_script.mjs src/<pack>/script.ts /tmp/lines.json   # 讲稿 → 时间轴 JSON
npx tsc --noEmit -p tsconfig.json           # 类型检查（查的是引擎里的副本！）
npm run make -- --film <film-id> --out <pack>/delivery --score out/e04-score-loop-48k.wav
~~~

`--score` 一定要带：不带的话 make 会现场合成一条十几分钟的床，单核跑 20 分钟以上。共享床是 `/root/video-pipeline-blueprint/out/e04-score-loop-48k.wav`（1560 s，48 kHz）。

单页静帧预览（复核排版用）：

~~~bash
npx remotion still <Composition> /tmp/e41stills/frame_<frame>.png --frame=<frame> --log=error
~~~

## 3. 一集的标准流水线（照做，不要跳步）

1. **读计划**：`/root/ts-base/plans/series.json` 第 N 项 + 书页（chapter4 的 p.92–112 等）。计划里的 thesis、算法、页数、注入配方都是硬约束。
2. **算法模块**：`src/TsBase/Algos/ChNN/<X>.hs`，纯函数、无外部数值库、无随机数表（种子只决定注入落点）。同时在 ts-base.cabal 的 exposed-modules 与 test other-modules 注册，`test/Spec.hs` 加 import 与 runSuite。
3. **单测**：`test/Algos/ChNN/<X>Spec.hs`，必须包含「反向器」型检查（把符号翻反后检查必须失败），否则分不清方法失败与噪声。黄金值要写绝对值（例如 Student-t 在 nu=1 时 p(0)=1/π=0.3183098861837909）。
4. **证据程序**：`app/ChNN<Name>Evidence.hs`，签名 `runEvidence :: FilePath -> FilePath -> FilePath -> IO ()`；自己维护 checks（分组）、写 `summary.json` / `checks.txt` / `<episode>.chN-*.json`；跑完打印 `checks: P/T in S s` 并以非零退出码表示失败。`app/Main.hs` 加 import、dispatch 分支和 usage 一行。
5. **数据导出**：ts-admin 写 `inventory/scripts/export_chNN_*.py`，输出到 `/root/ts-base/data/episodes/<slug>/`（daily_series.csv / minute_series.csv / manifest.json）。提交 ts-admin。
6. **跑证据到全绿**：64 项左右，耗时几百秒。**先小样本验证再接全量**；失败时看 `checks.txt` 的分组名定位，不要靠猜。全绿后提交 ts-base（消息 `feat(ch04): ... for epNN`）。
7. **生成 pack 数据**：pack 的 `build/make_<name>_data.py` 读证据 JSON + manifest，产出 `data/<name>.json`（画面所有数字的唯一来源），并把 commits / tests / checks / progress / next 写进 `meta`。**派生 json 必须加进根 .gitignore** 并 `git check-ignore -v` 确认。
8. **写画面**：`src/shared.tsx`（从上一集复制组件与数据头）、`src/script.ts`（8 场，页面数组 + 旁白 + PAGES_INDEX）、`src/scenes/*.tsx`、wrapper `<Composition>.tsx`。页面结构与旁白顺序必须一一对应：先写旁白，再按旁白写页。
9. **配音**：dump 讲稿 → pack `data/lines.json` → TTS → voice.json → sync → 再 dump（此时时间轴才是实测值）→ `make_narration.py`。两轮 dump 的顺序写错，时间轴会整体错位。
10. **静帧复核**：按每页中点渲染全部页面（27–29 张），逐张 `read_image` 检查：标题折行压住副标题、卡片值列溢出、Row 的 value 与 note 重叠、图表刻度出现负值、数字与证据不一致。修完 sync → tsc → 重渲受影响页确认。
11. **内容提交**：`node tools/check.mjs` 必须 0 error（film.json 的 status 只能是 draft / ready / published / retired，渲染期先写 `draft`）。提交 pack 源（`tsint/NN-slug: content — ...`）。
12. **渲染**：`films.mjs sync` → `films.mjs check --strict` → make。**先提交再 sync 再 make**：make 第一步会比对内容仓 HEAD，提交后不重新 sync 会直接失败（HEAD moved）。
13. **交付**：srt / chapters / ffmeta / cover 落 pack `delivery/`；mp4、raw_video、mix.wav、score.wav、report.json、scenes/、stills/ 也都在 delivery（`--out` 指过去，引擎 out/ 不留 tsint-* 目录）。mp4 **不入库**。
14. **收尾**：film.json 改 `status: ready`、`assetsStatus: complete`、`publish.coverFrame: 20`；提交 delivery；写 `docs/plan.md`（把 draft 改成实测读数 + Delivery 段）；SELF-AUTH 加一条 `An E41 交付：...`；docs/production-log.md 加一节；`node tools/status.mjs --md > STATUS.md`。

## 4. 当前进度（E41 完成时）

- ts-base：`3d5c6c7`（SBT 314 行 / 14 测试、TVAE 227 / 18、DCDetector 260 / 23）。全仓 **127 套测试 / 1,689 条断言**。
- ts-admin：`56722f4`（E41 日线 3,996 行 + 5 分钟线 4,952 根；5 分钟覆盖 2026-05-26..2026-10-27，与计划的 2023–2026 不符，已记 deviation）。
- E41 证据：**64 / 64，402.4 s**（data 9 / scores 9 / sbt 8 / tvae 8 / dcd 8 / window 6 / inject 5 / blind 4 / minute 4 / bl 3）。
- E41 读数：SBT F1 0.1009 对稠密基线 0.0987（打平）；TVAE 0.2097 对高斯 VAE 0.1301（赢）；DCdetector 0.2409 对 patch-AE 0.1130（赢）；两个赢的验证段都没领先，增益全部出现在测试段。
- E41 成片：**909.37 s / 27,281 帧 / 8 场 27 页 / 253 cue / −15 LUFS / TP −2 dBFS**；delivery 只提交 cover.png + srt + chapters + ffmeta（mp4/wav 被 .gitignore 排除），coverFrame 20。
- 已交付：E01–E18、E19–E41、E65–E74，共 51 集；剩余 E42–E64 共 23 集，状态 draft。
- E41 的 goal 已由用户暂停。**不要自动继续**。

## 5. 坑清单（按踩过的顺序，全部真实发生过）

### 5.1 写文件 / 工具

- **run_code 里的模板字符串不能含反引号**：Haskell 的 `` `div` ``、`` `mod` ``、Markdown 的代码块都会让 TypeScript 解析器在反引号处断开（报错 `Expected a semicolon`）。对策：Haskell 用 `div`/`mod` 函数式写法；本文件用波浪线 fence；必要时把长文件分片写入 `/tmp/part*.hs` 再 `cat` 拼接。
- **tsc 查的是引擎副本**，不是 pack。改完 pack 必须 `films.mjs sync`（或手动 cp）再 `npx tsc --noEmit`。
- **内容仓 HEAD 比对**：make 的第一步是 `films.mjs check --strict`；提交/amend 后必须重新 sync，否则报 `content HEAD moved`。
- **film.json 的 status 白名单**只有 draft / ready / published / retired；渲染期写 `producing` 会让 `tools/check.mjs` 直接报错。

### 5.2 画面排版

- 标题过长会折行压住 goal 行：标题控制在 ~26 个中文字以内（E41 从 40 字改成 24 字才一行）。
- Stat 里塞三个数字（如 2,081 / 388 / 1,229）要 `valueSize={26}`，否则折行。
- Row 的 value 列宽固定，长公式会溢出并盖住 note；公式改走正文或 CodeBlock。
- 图表默认会算出负的下界，出现「-93」这种刻度；用 `yMin={0}` 或显式 hlines。
- 大量点（1229 个）挤在 750 px 宽图里会糊成一片；必要时加高或减少可见点。

### 5.3 数值 / 性能

- **惰性求值会堆 thunk**：逐窗 SGD 写 foldl 只强制最外层，四万次更新直接 OOM（exit 137）。修法不是加内存，是按阶段 `V.force` / `evaluate`。
- **SBT 这类注意力模型**一窗 100×100，一轮 2,081 窗要 ~98 s、30 轮 OOM；训练侧每 5 窗取 1（417 窗、10 轮），分数仍在全量窗上算，并把这条 deviation 写进画面。
- 高斯先验的 KL 有闭式，Student-t 没有，只能用 MC；nu=1 的卡方特判要用 N(0,1)²，否则 t 分布数值会飘。
- 任何「重参数化 + 采样」都要把种子钉在窗口下标上（不要用全局 RNG），否则换机器不可复现。

### 5.4 内容一致性

- 画面上的每个数字必须能追到 `data/<name>.json` → 证据 JSON；旁白里念的数字也要与之一致。静帧复核时逐页核对，E41 就抓到画面写 447 s、实际 402.4 s。
- 改旁白数字会改音频时长：删对应 clip → 重跑 TTS → 重新 dump（809 s 级的总时长会变几十毫秒）→ `make_narration.py`。
- 检查表里至少留三条「必须失败」的负向断言（F1 不许满分、打平不许算赢、负结果照记），否则全绿没有信息量。

## 6. 工作规范（硬约束）

1. 一阶段一提交，消息格式：`tsint/NN-slug: content — ...`、`tsint/NN-slug: delivery — ...`；ts-base 用 `feat(ch04): ...`，ts-admin 用 `data(ch04): ...`。
2. 提交前跑 `node tools/check.mjs` 与 `git status`；派生文件（`data/*.json`、mp4、wav、clips）不入库。
3. 每集结束必须：film.json `ready` + `assetsStatus: complete` + `publish.coverFrame: 20`；plan.md 补实测；SELF-AUTH 加编号条目；production-log 加一节；STATUS.md 重生成。
4. 不发布：不调用任何 Bilibili 上传，不填 `bili`。
5. 交付件必须齐全：mp4、programme_unnorm.mp4、raw_video.mp4、mix.wav、score.wav、score.meta.json、report.json、scenes/、stills/、cover.png、srt、chapters、ffmeta。make 的 `--out` 直接指向 pack 的 delivery，结束后检查引擎 `out/` 没有 `tsint-*` 残留。
6. 静帧复核与证据复核是**前置门**，不是可选步骤；没看过全部页面不要开 make。

## 7. 接手第一步（checklist）

1. `cd /root/video_project && git log --oneline -3 && git status --short`，确认 E41 的 content / delivery 两个提交都在，工作区干净。
2. `node tools/status.mjs | grep tsint-41`，确认状态 ready、delivery 齐全。
3. 读本文件第 3 节，按第 1 步读 `/root/ts-base/plans/series.json` 的第 42 项，再决定是否开工。
4. 如果人类说「继续」：先 `update_goal action=resume` 恢复被暂停的目标，再从 E42 的算法模块开始；如果是别的话题，不要碰视频流水线。
