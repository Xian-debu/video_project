# 交接文档（2026-11-02，E42 完成后封存）

> 本文件取代此前所有交接文档：docs/HANDOFF.md、docs/HANDOFF-EVENING.md、docs/HANDOFF-NEXT-AGENT.md、docs/HANDOFF-E41.md 自本文件起只作历史存档，**不要按旧文档继续工作**。
> 旧文档里的「下一步」已全部过期；以本文件末尾的进度表与工作规范为准。

## 0. 一句话现状

- 视频系列 tsint 已交付 **52 / 74 集**（E01–E18、E19–E42、E65–E74），最新一集 **E42 metrics-distance-1nn-ee** 已 end-to-end 完成（算法 / 证据 / 数据 / 讲稿 / 配音 / 渲染 / 交付 / 文档 / 提交）。
- **目标（goal）处于 active + armed**：objective 是「逐集完成 E42–E64，不发布 B 站，status 停在 ready」，maxGoalRounds 400；如果会话中断后恢复时 goal 变成 disarmed，人类说「继续」就 `update_goal action=resume`。
- **永远不要发布到 Bilibili**。每集结束时 film.json 的 status 必须是 `ready`（不是 published），`bili` 字段保持 null。
- 下一集：**E43 `43-shapelet-search-pips`**，标题《Shapelet：从一条序列里挖出一小段判别力》，预估 20 分钟，数据源是 ts-base/plans/series.json 的第 43 项。

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
docker exec haskell-ts bash -lc 'export PATH=/opt/ghc/9.14.1/bin:$PATH && cd /work && cabal test'
docker exec haskell-ts bash -lc 'export PATH=/opt/ghc/9.14.1/bin:$PATH && cd /work && cabal build exe:tsbase'
~~~

证据程序跑起来很慢（几分钟），直接跑已编译的二进制，或在容器里 `cabal run -v0 tsbase -- <args>`：

~~~bash
docker exec haskell-ts bash -lc 'export PATH=/opt/ghc/9.14.1/bin:$PATH && cd /work && cabal run -v0 tsbase -- evidence-ch05-metrics --data data/episodes/42-ch05-tsclassification --out data/episodes/42-ch05-tsclassification --evidence inventory/evidence'
~~~

容器内存上限 **12 GiB**，超了就是 exit 137（不是 Haskell 异常）。

### 2.2 Python / 数据

- 数据湖入口：`from tsa.api import Lake`（在 ts-admin 仓根用 `.venv/bin/python`，系统 python 没有 duckdb）。`Lake.daily(codes, start, end, adjust="raw|qfq|hfq", columns)` / `panel(field,...)` / `minute(codes, freq, start, end)` / `instruments(as_of, active_only)`；返回 pyarrow Table（`.to_pandas()`）。复权在读取时算：`hfq = price*adj_factor`。
- 湖表：`instruments(code,name,market,board,list_date,delist_date,is_st,industry,updated_at)`（industry 是证监会门类，如 `J66货币金融服务`）、`index_members(index_code,code,name,as_of,source,fetched_at)`、`bars_daily(code,trade_date,open,high,low,close,pre_close,volume,amount,adj_factor,is_suspended,source,fetched_at,year)`。
- 每集导出脚本照抄上一集的形状（读 manifest、算 sha256、写 splits / window 参数 / deviation 字段）。**计划里的数据覆盖期 / 股票数可能和湖里实际不一致**：以实际导出为准，把 deviation 写进 manifest 和画面。

### 2.3 配音（TTS）

虚拟环境 `/root/.venvs/tts`，edge-tts 音色 `zh-CN-YunyangNeural`；TTS 脚本从上一集拷 `build/tts_narration.py` 与 `build/make_narration.py`：

~~~bash
cd <pack>
/root/.venvs/tts/bin/python build/tts_narration.py --lines data/lines.json --clips assets/audio/clips --voice-out data/voice.json --clips-json data/clips.json
/root/.venvs/tts/bin/python build/make_narration.py     # 生成 assets/audio/narration.wav 与合轨时间轴
~~~

**片段缓存按 `scene#index` 命名**，不看文本内容。改了一句台词必须手动删掉对应 mp3（例如 `assets/audio/clips/verification-52.mp3`）再跑，否则会沿用旧音频。

**时间轴两轮 dump**：`script.ts` 里 `voice.json` 的 import 路径必须写引擎挂载路径 `../../data/<film.id>/voice.json`；dump 必须在 `films.mjs sync` 之后对**引擎副本**跑：`node scripts/qa/dump_script.mjs src/<pack>/script.ts <pack>/data/lines.json`。TTS 定稿前 dump 的 lines.json 是过期的（LINE_PAD 未生效），会让静帧页面与字幕错位约 1 s——**TTS → sync → 再 dump → 才按 lines.json 算静帧帧号**。

### 2.4 渲染

~~~bash
cd /root/video-pipeline-blueprint
node scripts/films.mjs sync                 # 内容仓 → 引擎挂载（改完 pack 必跑）
node scripts/films.mjs check --strict       # 内容检查；失败通常是「dirty」或「HEAD moved」
node scripts/qa/dump_script.mjs src/<pack>/script.ts <pack>/data/lines.json
npx tsc --noEmit -p tsconfig.json           # 类型检查（查的是引擎里的副本！）
node scripts/make.mjs --film <film-id> --score out/e04-score-loop-48k.wav
~~~

`--score` 一定要带：不带会现场合成一条十几分钟的床，单核 20 分钟以上。共享床是 `/root/video-pipeline-blueprint/out/e04-score-loop-48k.wav`（1560 s，48 kHz；score.meta.json 记 source）。

单页静帧预览（复核排版用）：把渲染脚本放**引擎根目录**（否则 @remotion 解析不到），bundle 一次 + `renderStill` 循环；帧号按每页首句 `start + 1.2 s` 算，clamp 到页尾前 18 帧。

## 3. 一集的标准流水线（同 E41 §3，未变）

1. **读计划**：series.json 第 N 项 + 书页。thesis / 算法 / 页数 / 数据配方都是硬约束；湖里凑不齐就如实记录 deviation，不凑数。
2. **算法模块**：`src/TsBase/Algos/ChNN/<X>.hs`，纯函数、无外部数值库、无随机数表（种子只决定注入落点）。在 ts-base.cabal 的 exposed-modules 与 test other-modules 注册，`test/Spec.hs` 加 import 与 runSuite。
3. **单测**：`test/Algos/ChNN/<X>Spec.hs`，必须包含「反向器」型检查；黄金值写绝对值。
4. **证据程序**：`app/ChNN<Name>Evidence.hs`，`runEvidence :: FilePath -> FilePath -> FilePath -> IO ()`；自己维护 checks（分组）、写 `summary.json` / `checks.txt` / `<episode>.chN-*.json`；跑完打印 `checks: P/T in S s`，非零退出码表示失败。`app/Main.hs` 加 dispatch 与 usage。
5. **数据导出**：ts-admin 写 `inventory/scripts/export_chNN_*.py`，输出到 `/root/ts-base/data/episodes/<slug>/`（CSV + manifest.json）。提交 ts-admin。
6. **跑证据到全绿**：先小样本验证再接全量；失败看 checks.txt 的分组名定位。全绿后提交 ts-base（`feat(ch05): ... for epNN`）。
7. **生成 pack 数据**：`build/make_<name>_data.py` 读证据 JSON + manifest，产出 `data/dist.json`（画面所有数字的唯一来源），commits / tests / checks / progress / next 写进 `meta`；**每个字段都要和证据 JSON 对得上（assert）**。
8. **写画面**：`src/shared.tsx`（从上一集复制组件与数据头）、`src/script.ts`（8 场，页面数组 + 旁白 + PAGES_INDEX）、`src/scenes/*.tsx`、wrapper。先写旁白，再按旁白写页。
9. **配音**：见 §2.3，注意两轮 dump。
10. **静帧复核**：按每页首句渲全部页面（40–50 张），逐张 `read_image` 检查；修完 **sync → tsc → 重渲受影响页** 确认（不 sync 会渲出旧副本）。
11. **内容提交**：`node tools/check.mjs` 必须 0 error（渲染期 film.json 写 `draft`）。提交 pack 源：`tsint/NN-slug: content — ...`。
12. **渲染**：`films.mjs sync` → make（带 `--score`）。先提交再 sync 再 make。
13. **交付**：make 的 `--out` 直接指向 pack `delivery/`；mp4 / wav / report.json / scenes / stills 不入库，cover/srt/chapters/ffmeta 入库。
14. **收尾**：film.json `ready` + `assetsStatus: complete` + `publish.coverFrame: 20`；plan.md 补实测 + Delivery；SELF-AUTH 加一条；production-log 加一节；STATUS.md 那行改 `ready | - | yes | ok | 11 | -`；提交 delivery（含 docs）。

## 4. 当前进度（E42 完成时）

- ts-base：`2affc73`（E42 证据 + 带宽消融；算法在 `fc75bdf`：Ch05/Metrics.hs 24 测试、Ch05/Dtw.hs 16、Ch05/ElasticEnsemble.hs 18）。全仓 **133 套测试 / 1,802 条断言**（直接跑 spec 二进制实测，全部 PASS）。
- ts-admin：`315cbb8`（`export_ch05_tsclassification.py`：HS300 银行 25 / 半导体 18 / 医药 17 共 60 只，2015-01-05..2025-12-31，panel_close.csv 2,674 行 × 60 列；窗口 60；manifest 记三处 deviation）。
- E42 证据：**20 / 20，62.8 s**（data 8 / main 4 / repeats 4 / synth 4）。
- E42 读数：ED 0.4167（macro-F1 0.3918，25/60）；DTW 带宽 6 0.4167（0.4084，25/60）；EE 0.4667（0.4557，28/60）；去掉带宽 0.3500；权重 导数 DTW 0.7273 / 加权 0.1818 / DTW 0.0909 / LCSS 0；20 次抽样平均秩 EE 1.75 < ED 1.90 < DTW 2.35，CD 0.7409，三对全不显著；合成 clean 全 1.0、左移 5 点 ED 0.0 / DTW 1.0 / EE 1.0。
- E42 成片：**926.37 s / 27,791 帧 / 8 场 45 页 / 272 cue / −15 LUFS / TP −2 dBFS**；delivery 只提交 cover.png + srt + chapters + ffmeta（mp4/wav 被 .gitignore 排除），coverFrame 20。
- 已交付：E01–E18、E19–E42、E65–E74，共 52 集；剩余 E43–E64 共 22 集。

## 5. 坑清单（E42 新增）

### 5.1 写文件 / 工具

- **run_code 里的模板字符串不能含反引号**：Haskell 的 `div` 中缀形式、Markdown 代码块都会让 TypeScript 解析器在反引号处断开（`Expected a semicolon`）。对策：Haskell 用前缀 `div a b` / `mod a b`；本文件用波浪线 fence。
- **ops 工具会在被编辑目录留 `.dsh-ops-update-*.lock`**：首次 commit 会把它带进 git。根 .gitignore 已加 `**/.dsh-ops-*.lock`；提交前 `git status` 看到就以 amend 移除。
- **tsc 查的是引擎副本**；**make 第一步比对内容仓 HEAD**——提交/amend 后必须重新 sync。
- **改完 pack 不 sync 就渲静帧**会渲出旧副本，文件大小可能相同，只能靠内容辨别。

### 5.2 画面 / 时间轴

- **lines.json 必须在 TTS 定稿后 dump**：旧 lines.json 会让页面比字幕早约 1 s，静帧看起来像「两页叠影」，其实是转场帧落在错误的字幕上。
- 字幕条高度固定：图表底部说明、矩阵轴标签要留在 top≈950 以上，否则被字幕压住（E42 修了带宽图与对齐矩阵两处）。
- CheckGrid 这类分组组件不要再按组循环画标题行：分组标签会重复出现、第二行是空的；改单行格子 + 图例。
- 页面上出现的每个小数都要能追到 dist.json 字段；E42 验证页原先只在字幕里念 0.1765→0.3529，屏幕没有，补了三枚 Chip 从 `ed.recall[2]` 读。

### 5.3 数值 / 性能

- boxed / unboxed 两套向量不能混：Metrics 与 `emWeights` 用 boxed（`Data.Vector` as VB），Dtw 的 `Series` 与 `emTrain` 用 unboxed（`Data.Vector.Unboxed` as V）；索引 `VB.!` / `V.!`、求和 `VB.sum` / `V.sum` 不同。
- 局部 let 里的 printf 辅助函数必须写类型签名，否则 PrintfType 歧义（`Ambiguous type variable`）。
- 合成对照的随机相位会「覆盖」平移：训练集随机相位 + 查询平移 5 点，ED 仍能 0.9+；固定相位 + 左移 5 点才复现 ED 0 / DTW 1。
- 证据检查条数尽量锁死（E42 保持 20 条，用带宽消融替换一条弱检查）：改条数要改讲稿、重录旁白、重 dump、重算帧。

## 6. 工作规范（硬约束）

1. 一阶段一提交，消息格式：`tsint/NN-slug: content — ...`、`tsint/NN-slug: delivery — ...`；ts-base 用 `feat(ch05): ...`，ts-admin 用 `data(ch05): ...`。
2. 提交前跑 `node tools/check.mjs` 与 `git status`；派生文件（mp4、wav、clips）不入库。
3. 每集结束必须：film.json `ready` + `assetsStatus: complete` + `publish.coverFrame: 20`；plan.md 补实测；SELF-AUTH 加编号条目；production-log 加一节；STATUS.md 那行改 ready。
4. 不发布：不调用任何 Bilibili 上传，不填 `bili`。
5. 交付件必须齐全：mp4、programme_unnorm.mp4、raw_video.mp4、mix.wav、score.wav、score.meta.json、report.json、scenes/、stills/、cover.png、srt、chapters、ffmeta。结束后检查引擎 `out/` 没有 `tsint-*` 残留。
6. 静帧复核与证据复核是**前置门**，不是可选步骤；没看过全部页面不要开 make。

## 7. 接手第一步（checklist）

1. `cd /root/video_project && git log --oneline -4 && git status --short`，确认 E42 的 content / delivery 两个提交都在，工作区干净。
2. `grep tsint-42 STATUS.md`，确认状态 ready、delivery 齐全。
3. 读本文件第 3 节，按第 1 步读 series.json 的第 43 项，再开工 E43。
4. 如果人类说「继续」而 goal 是 disarmed：`update_goal action=resume`；如果话题与视频无关，不要碰流水线。
