# 交接文档（2026-11-02 深夜，E43 完成后封存）

> 本文件取代此前所有交接文档：docs/HANDOFF.md、docs/HANDOFF-EVENING.md、docs/HANDOFF-NEXT-AGENT.md、docs/HANDOFF-E41.md、docs/HANDOFF-E42.md 自本文件起只作历史存档，**不要按旧文档继续工作**。
> 旧文档里的「下一步」已全部过期；以本文件末尾的进度表与工作规范为准。

## 0. 一句话现状

- 视频系列 tsint 已交付 **53 / 74 集**（E01–E18、E19–E43、E65–E74），最新一集 **E43 43-shapelet-search-pips** 已 end-to-end 完成（算法 / 证据 / 数据 / 讲稿 / 配音 / 渲染 / 交付 / 文档 / 提交）。
- **目标（goal）处于 active + armed**：objective 是「逐集完成 E42–E64，不发布 B 站，status 停在 ready」，maxGoalRounds 400；如果会话中断后恢复时 goal 变成 disarmed，人类说「继续」就 `update_goal action=resume`。
- **永远不要发布到 Bilibili**。每集结束时 film.json 的 status 必须是 `ready`（不是 published），`bili` 字段保持 null。
- 下一集：**E44 `44-learnable-shapelet-softmin`**，标题《把 min 换成 SoftMin：Shapelet 终于可以求导》，预估 24 分钟，三个算法单元（可学习 Shapelet / Shapelet 决策树 / MLP 分类器），数据源是 ts-base/plans/series.json 的第 44 项。

## 1. 四个仓库与它们的关系

| 路径 | 角色 | 谁写 |
| --- | --- | --- |
| `/root/ts-base` | Haskell 算法库 + 单测 + 证据程序（每集的读数都由它产出） | 算法模块 `src/TsBase/Algos/ChNN/*.hs`、测试 `test/Algos/ChNN/*Spec.hs`、证据 `app/ChNN*Evidence.hs` |
| `/root/ts-admin` | 数据湖导出脚本（日线 / 分钟线 → CSV + manifest） | `inventory/scripts/export_chNN_*.py` |
| `/root/video_project` | **内容仓**：每集一个 pack（画面源码 + 数据 + 讲稿 + 交付），以及全仓文档、schema、工具 | `series/tsint/episodes/<NN-slug>/` |
| `/root/video-pipeline-blueprint` | **渲染引擎**（Remotion + make 流水线）。引擎不知道任何片名，按 film 清单挂载内容仓 | 一般**不改**；只有引擎 bug 才动，且要单独提交 |

挂载方向：**内容仓是源，引擎是挂载点**。任何时候改内容都改 `/root/video_project` 里的 pack，然后 `node scripts/films.mjs sync` 把 pack 拷进引擎（`src/tsint-NN-...`、`data/tsint-NN-...`）。反向编辑引擎里的副本会被下一次 sync 覆盖。

系列计划在 `/root/ts-base/plans/series.json`：74 项（顶层是 dict，episodes 是 list），每项有 id / title / slug / runtimeMinutes / thesis / algorithms / verification / data 要求。**开工前先读它**。

## 2. 工具链（全部在本机，无外网依赖）

### 2.1 Haskell（GHC 不在 PATH）

~~~bash
docker exec haskell-ts bash -lc 'export PATH=/opt/ghc/9.14.1/bin:$PATH && cd /work && cabal build lib:ts-base'
docker exec haskell-ts bash -lc 'export PATH=/opt/ghc/9.14.1/bin:$PATH && cd /work && cabal test'
docker exec haskell-ts bash -lc 'export PATH=/opt/ghc/9.14.1/bin:$PATH && cd /work && cabal build exe:tsbase'
~~~~

证据程序跑起来很慢（几十秒到几分钟），直接跑已编译的二进制，或 `cabal run -v0 tsbase -- <args>`；容器内存上限 **12 GiB**，超了就是 exit 137（不是 Haskell 异常）。

E43 实际命令（三模块 44 条断言 + 23 检查）：

~~~bash
docker exec haskell-ts bash -lc 'export PATH=/opt/ghc/9.14.1/bin:$PATH && cd /work && cabal build exe:tsbase && cabal run -v0 tsbase -- evidence-ch05-shapelet --data data/episodes/43-shapelet-search-pips --out data/episodes/43-shapelet-search-pips --evidence inventory/evidence'
~~~~

### 2.2 Python / 数据

- 数据湖入口：`from tsa.api import Lake`（在 ts-admin 仓根用 `.venv/bin/python`，系统 python 没有 duckdb）。`Lake.daily(codes, start, end, adjust="raw|qfq|hfq", columns)` / `panel(field,...)` / `minute(codes, freq, start, end)` / `instruments(as_of, active_only)`；返回 pyarrow Table（`.to_pandas()`）。复权在读取时算：`hfq = price*adj_factor`。
- 湖表：`instruments(code,name,market,board,list_date,delist_date,is_st,industry,updated_at)`（industry 是证监会门类，如 `J66货币金融服务`）、`index_members(index_code,code,name,as_of,source,fetched_at)`、`bars_daily(...)`、`index_daily`。
- 每集导出脚本照抄上一集的形状（读 manifest、算 sha256、写 splits / window 参数 / deviation 字段）。**计划里的数据覆盖期 / 股票数可能和湖里实际不一致**：以实际导出为准，把 deviation 写进 manifest 和画面。

### 2.3 配音（TTS）

虚拟环境 `/root/.venvs/tts`，edge-tts 音色 `zh-CN-YunyangNeural`；TTS 脚本从上一集拷 `build/tts_narration.py` 与 `build/make_narration.py`：

~~~bash
cd <pack>
/root/.venvs/tts/bin/python build/tts_narration.py --lines data/lines.json --clips assets/audio/clips --voice-out data/voice.json --clips-json data/clips.json
/root/.venvs/tts/bin/python build/make_narration.py     # 生成 assets/audio/narration.wav
~~~~

**片段缓存按 `scene#index` 命名**，不看文本内容。改了一句台词必须手动删掉对应 mp3（例如 `assets/audio/clips/verification-50.mp3`）再跑；跑之前先重 dump，让 lines.json 的 text 是新的，否则 TTS 还是念旧稿。TTS 脚本有 `--only verification#50`，但**每次都会 ffprobe 全部 clip**，只缺文件才 synth。

**时间轴两轮 dump**：`script.ts` 里 `voice.json` 的 import 路径必须写引擎挂载路径 `../../data/<film.id>/voice.json`；dump 必须在 `films.mjs sync` 之后对**引擎副本**跑：`node scripts/qa/dump_script.mjs src/<pack>/script.ts <pack>/data/lines.json`。TTS 定稿前 dump 的 lines.json 是过期的（LINE_PAD 未生效），会让静帧页面与字幕错位约 1 s——**TTS → sync → 再 dump → 才按 lines.json 算静帧帧号**。

### 2.4 渲染

~~~bash
cd /root/video-pipeline-blueprint
node scripts/films.mjs sync                 # 内容仓 → 引擎挂载（改完 pack 必跑）
node scripts/films.mjs check --strict       # 内容检查；失败通常是「dirty」或「HEAD moved」
npx tsc --noEmit -p tsconfig.json           # 类型检查（查的是引擎里的副本！）
node scripts/make.mjs --film <film-id> --score out/e04-score-loop-48k.wav
~~~~

`--score` 一定要带：不带会现场合成一条十几分钟的床，单核 20 分钟以上。共享床是 `/root/video-pipeline-blueprint/out/e04-score-loop-48k.wav`（1560 s，48 kHz）。

单页静帧预览（复核排版用）：把渲染脚本放**引擎根目录**（否则 @remotion 解析不到），bundle 一次 + `renderStill` 循环；帧号按每页首句 `start + 1.2 s` 算，clamp 到页尾前 18 帧。提交前删掉临时脚本（`tmp-still*.mjs`）。

## 3. 一集的标准流水线（同 E41 §3，未变）

1. **读计划**：series.json 第 N 项 + 书页。thesis / 算法 / 页数 / 数据配方都是硬约束；湖里凑不齐就如实记录 deviation，不凑数。
2. **算法模块**：`src/TsBase/Algos/ChNN/<X>.hs`，纯函数、无外部数值库、无随机数表（种子只决定注入落点）。在 ts-base.cabal 的 exposed-modules 与 test other-modules 注册，`test/Spec.hs` 加 import 与 runSuite。
3. **单测**：`test/Algos/ChNN/<X>Spec.hs`，必须包含「反向器」型检查；黄金值写绝对值。
4. **证据程序**：`app/ChNN<Name>Evidence.hs`，`runEvidence :: FilePath -> FilePath -> FilePath -> IO ()`；自己维护 checks（分组）、写 `summary.json` / `checks.txt` / `<episode>.chN-*.json`；跑完打印 `checks: P/T in S s`，非零退出码表示失败。`app/Main.hs` 加 dispatch 与 usage。
5. **数据导出**：ts-admin 写 `inventory/scripts/export_chNN_*.py`，输出到 `/root/ts-base/data/episodes/<slug>/`（CSV + manifest.json）。提交 ts-admin。
6. **跑证据到全绿**：先小样本验证再接全量；失败看 checks.txt 的分组名定位。全绿后提交 ts-base。
7. **生成 pack 数据**：`build/make_<name>_data.py` 读证据 JSON + manifest，产出 `data/dist.json`（画面所有数字的唯一来源），commits / tests / checks / progress / next 写进 `meta`；**每个字段都要和证据 JSON 对得上（assert）**；JSON 里不能出现 `Infinity`（TS 解析失败），dump 前把非有限 float 递归换成 null。
8. **写画面**：`src/shared.tsx`（从上一集复制组件与数据头）、`src/script.ts`（8 场，页面数组 + 旁白 + PAGES_INDEX）、`src/scenes/*.tsx`、wrapper。先写旁白，再按旁白写页。
9. **配音**：见 §2.3，注意两轮 dump。
10. **静帧复核**：按每页首句渲全部页面（40–50 张），逐张 `read_image` 检查；修完 **sync → tsc → 重渲受影响页** 确认（不 sync 会渲出旧副本）。
11. **内容提交**：`node tools/check.mjs` 必须 0 error。提交 pack 源：`tsint/NN-slug: content — ...`。
12. **渲染**：`films.mjs sync` → make（带 `--score`）。先提交再 sync 再 make。
13. **交付**：make 的 `--out` 直接指向 pack `delivery/`；mp4 / wav / report.json / scenes / stills 不入库，cover/srt/chapters/ffmeta 入库。
14. **收尾**：film.json `ready` + `assetsStatus: complete` + `publish.coverFrame: 20`；plan.md 补实测 + Delivery；SELF-AUTH 加一条；production-log 加一节；STATUS.md 那行改 `ready | - | yes | ok | 11 | -`；提交 delivery（含 docs）。

## 4. 当前进度（E43 完成时）

- ts-base：`24fa1a0`（E43 证据；算法在 `d3c0e87`/前序：Ch05/Shapelet.hs 19 测试、Ch05/Pips.hs 11、Ch05/DistTest.hs 14）。全仓 **136 套测试 / 1,846 条断言**（直接跑 spec 二进制实测，全部 PASS）。
- ts-admin：`8955376`（`export_ch05_shapelet.py`：全市场同门类各 50 只共 150、2018-01-02..2025-12-31、panel 1,942 行 × 150 列、sha256 0ccdea98…；HS300 内凑不齐各 50，manifest 记 deviation）。
- E43 证据：**23 / 23，36.8 s**（data 5 / synth 8 / real 5 / worked 5）。
- E43 读数：合成全搜索增益 0.8475（23,670 候选 / 22.15 s / acc 1.00）、PIPs 0.8475（2,325 候选 / 2.17 s / acc 1.00，9.82% / 10.21× / 差 0.0000）；三分类上界 0.9183、两类平衡 0.8938/1.0；真实 0.3429（36/105，基线 0.3333）、增益 0.3983、8,190 命中 / 4.68 s；ANOVA F 3.5726 p .0305、KW H 9.2009 p .0100、精确率 0.30；黄金 F 13.5（p .000849）、黄金 H 3.857143（p .145356）、离群点反例 F p .487704 / H p .044502。
- E43 成片：**1127.13 s / 33,814 帧 / 8 场 39 页 / 303 cue / −15 LUFS / TP −2 dBFS / LRA 2.6**；delivery 只提交 cover.png + srt + chapters + ffmeta（mp4/wav 被 .gitignore 排除），coverFrame 20。
- 已交付：E01–E18、E19–E43、E65–E74，共 53 集；剩余 E44–E64 共 21 集。

## 5. 坑清单（E43 新增）

### 5.1 写文件 / 工具

- **引擎里的根组件可能是 stub**：`src/TsintNN*.tsx` 若只有 300 字节 `() => null`，静帧会渲成整页白图（39 张同 sha256），selectComposition 还会报 duration 36000。写根组件就从上一集整文件替换编号，别手攒。
- **`read` 带 limit 的结果绝不能整体写回**：曾把 42 KB 的 shared.tsx 截成 123 行。要改大文件先全文读，或用 edit 精准替换。
- **JSON 里不能有 `Infinity`**：dist.json 里的非有限 float 会让 `tsc` 报 TS1328；evidence builder 里递归 sanitize。
- **run_code 模板字符串不能含反引号**（Haskell 中缀 `div`、Markdown fence）；Haskell 用前缀 `div a b`。这是第二次踩。
- **PAGES_INDEX 的长度必须等于页数**：多一页/少一页会在 typecheck 或运行时报越界；改 pages 数组时同步改 `pages={pagesOf(id)}` 的场景页数。

### 5.2 画面 / 时间轴

- **字幕念的数字必须和页面一致**：E43 的黄金 H 例旁白把秩和写成「四、二十四、七十七」，页面表却是 4/24/50——静帧复核时人眼对上了才发现。**画面表与旁白要交叉核对一遍**，这条比排版更重要。
- 页面上出现的每个小数都要能追到 dist.json 字段；E43 的 0.9183 上界也进了 dist.json（meta.deviations + GainBar 读字段）。
- 字幕条高度固定：图表底部说明、矩阵轴标签要留在 top≈950 以上，否则被字幕压住。
- 大数字条形图的格式化要跟语义走：候选数是整数，别用 `toFixed(4)`（E43 出现过 23670.0000）；给 `GainBar` 加 `valueFmt` 后传 `Math.round`。

### 5.3 数值 / 性能

- `SoftMin` / `log-sum-exp` 先减 max 再取 log（E44 会用到）：不能直接 `sum (map exp)`。
- 合成数据的「上界」要认真算：三分类一对其余熵上界 0.9183 ≠ 两类平衡 1.0；把上界当实测是最容易犯的叙述错误。
- 证据检查条数尽量锁死：改条数要改讲稿、重录旁白、重 dump、重算帧。

## 6. 工作规范（硬约束）

1. 一阶段一提交，消息格式：`tsint/NN-slug: content — ...`、`tsint/NN-slug: delivery — ...`；ts-base 用 `feat(ch05): ...`，ts-admin 用 `data(ch05): ...`。
2. 提交前跑 `node tools/check.mjs` 与 `git status`；派生文件（mp4、wav、clips、narration.wav）不入库。
3. 每集结束必须：film.json `ready` + `assetsStatus: complete` + `publish.coverFrame: 20`；plan.md 补实测；SELF-AUTH 加编号条目；production-log 加一节；STATUS.md 那行改 ready。
4. 不发布：不调用任何 Bilibili 上传，不填 `bili`。
5. 交付件必须齐全：mp4、programme_unnorm.mp4、raw_video.mp4、mix.wav、score.wav、score.meta.json、report.json、scenes/、stills/、cover.png、srt、chapters、ffmeta。结束后检查引擎 `out/` 没有 `tsint-*` 残留。
6. 静帧复核与证据复核是**前置门**，不是可选步骤；没看过全部页面不要开 make。

## 7. 接手第一步（checklist）

1. `cd /root/video_project && git log --oneline -4 && git status --short`，确认 E43 的 content / delivery 两个提交都在，工作区干净。
2. `grep tsint-43 STATUS.md`，确认状态 ready、delivery 齐全。
3. 读本文件第 3 节，按第 1 步读 series.json 的第 44 项，再开工 E44。
4. 如果人类说「继续」而 goal 是 disarmed：`update_goal action=resume`；如果话题与视频无关，不要碰流水线。
