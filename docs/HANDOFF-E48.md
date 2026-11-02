# 交接文档（2026-11-03 凌晨，E48 完成后封存）

> 本文件取代此前所有交接文档：docs/HANDOFF.md、HANDOFF-EVENING.md、HANDOFF-NEXT-AGENT.md、HANDOFF-E41.md ~ HANDOFF-E47.md 自本文件起只作历史存档，**不要按旧文档继续工作**。
> 旧文档里的「下一步」已全部过期；以本文件末尾的进度与工作规范为准。

## 0. 一句话现状

- 视频系列 tsint 已交付 **58 / 74 集**（E01–E18、E19–E48、E65–E74），最新一集 **E48 48-ssl-augment-contrast-mask** 已 end-to-end 完成（算法 / 证据 / 数据 / 讲稿 / 配音 / 渲染 / 交付 / 文档 / 提交），成片 24:06.47。
- **目标（goal）处于 active + armed**：objective 是「逐集完成 E49–E64，不发布 B 站，status 停在 ready」；如果会话中断后恢复时 goal 变成 disarmed，人类说「继续」就 `update_goal action=resume`。
- **永远不要发布到 Bilibili**。每集结束时 film.json 的 status 必须是 `ready`（不是 published），`bili` 字段保持 null。
- 下一集：**E49 `49-gaf-mtf-cote-multidomain`**，标题《换一种表示：图像化编码与多域集成》，预估 22 分钟。两个算法单元：`Ch05.Imaging`（GASF / GADF / MTF / RP + CNN）与 `Ch05.Cote`（时域 / ACF / PS / shapelet 四域加权投票）。thesis：GAF 与 MTF 都是分箱序列的双射编码（不丢信息）但偏置完全不同——GAF 只依赖幅值、MTF 只依赖转移次序，同一窗口上两者 Fisher 判别比相差 1 倍以上，双通道 CNN 比任一单通道高 3 个百分点；COTE 式四域加权投票只要有两个强域就足以压过任何单域。屏幕上必须出现 **−1 / 0 / 1 三个数、0.8、1.5、四联图、单域与集成两组准确率**。
- E49 计划数据：ts-admin 日线，**20 只股票、窗口 128 日、步长 5**、重采样到固定长；标签 = **20 日前向收益三分位**（上行/震荡/下行）。开工先查湖里能不能凑出「20 只 × 128 日窗口 + 三分位标签」；凑不出按实际改写并登记 deviation。

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
docker exec haskell-ts bash -lc 'export PATH=/opt/ghc/9.14.1/bin:$PATH && cd /work && cabal build lib:ts-base'
docker exec haskell-ts bash -lc 'export PATH=/opt/ghc/9.14.1/bin:$PATH && cd /work && cabal test'
docker exec haskell-ts bash -lc 'export PATH=/opt/ghc/9.14.1/bin:$PATH && cd /work && cabal build exe:tsbase'
docker exec haskell-ts bash -lc 'export PATH=/opt/ghc/9.14.1/bin:$PATH && cd /work && ./.dist-newstyle-mount/build/x/tsbase/build/tsbase/tsbase evidence-ch05-ssl --data data/episodes/48-ssl-augment-contrast-mask --out data/episodes/48-ssl-augment-contrast-mask --evidence inventory/evidence'
~~~

证据程序跑几秒到几分钟；容器内存上限 **12 GiB**，超了就是 exit 137（不是 Haskell 异常）。GHC-18932：严格字段 `!V.Vector Double` 编不过，用惰性字段。E48 证据 **28 条 / 10.8 s**，全仓 **151 套 / 2,060 断言**。tsbase 可执行文件路径要先现查（`cabal list-bin exe:tsbase`），各集路径不一样。

### 2.2 Python / 数据

- 数据湖入口：`from tsa.api import Lake`（在 ts-admin 仓根用 `.venv/bin/python`，系统 python 没有 duckdb）。`Lake.daily / panel / minute / instruments`；返回 pyarrow Table（`.to_pandas()`）。复权读取时算：`hfq = price*adj_factor`。
- 湖表：`instruments(code,name,market,board,list_date,delist_date,is_st,industry,updated_at)`、`index_members(...)`、`bars_daily(...)`、`index_daily`。
- 每集导出脚本照抄上一集形状（读 manifest、算 sha256、写 splits / window / deviation）。**计划里的覆盖期 / 股票数常和湖里不一致**：以实际导出为准，deviation 写进 manifest 与画面。
- E48 的实际口径：股票池只有 `index_members` 的 **2026-10-30 一期快照 300 只**（无历史成分），2015-01-01..2025-12-31，按每只股票自己连续有效段切窗（61 收盘价 → 60 对数收益、步长 20、不跳日不插值、剔除窗口内单日 `|收益| ≥ 0.5` 的异常段），得 **292 只 / 32,878 条候选**，种子 7 洗牌取 **1,000** 条预训练；探针按证监会门类 **C39 / J66 / J67 各 17 / 17 / 16 只**、每只取中间窗口共 **50 条**（多数类 17/50 = 0.34），划分「每类前十条训练」→ 30 训练 / 20 测试。

### 2.3 配音（TTS）

虚拟环境 `/root/.venvs/tts`（edge_tts 7.3.1），音色 `zh-CN-YunyangNeural`；系统 python3 **没有** edge_tts。脚本从上一集拷 `build/tts_narration.py` 与 `build/make_narration.py`：

~~~bash
cd <pack>
/root/.venvs/tts/bin/python build/tts_narration.py --lines data/lines.json --clips assets/audio/clips --voice-out data/voice.json --clips-json data/clips.json --concurrency 6
python3 build/make_narration.py     # 生成 assets/audio/narration.wav
~~~

**片段缓存按 `scene#index` 命名**，不看文本内容；改一句台词必须手动删对应 mp3 再跑（`--only=<scene#idx,...>` 可只补这几句）。脚本会跳过「已存在且 > 800 B」的 mp3——**改稿后要清空 clips 目录**才会重录。E48 实测 397 clips / 语音 1,210.3 s / narration.wav 138,862,124 B。

**时间轴两轮 dump**：`script.ts` 里 `voice.json` 的 import 路径必须写引擎挂载路径 `../../data/<film.id>/voice.json`；dump 必须在 `films.mjs sync` 之后对**引擎副本**跑：`node scripts/qa/dump_script.mjs src/<pack>/script.ts data/<pack>/lines.json`。TTS 定稿前 dump 的 lines.json 是过期的（LINE_PAD 未生效）——**TTS → sync → 再 dump → 才按 lines.json 算静帧帧号**。dump 出来的 lines.json 落在**引擎**数据目录，要手动 `cp` 回 pack 的 `data/lines.json`；而 `films.mjs sync` 是 **pack → 引擎单向镜像且会删除引擎多余文件**，所以顺序必须是「先在引擎 dump → cp 回 pack → 再 sync」。

### 2.4 静帧预览与渲染

~~~bash
cd /root/video-pipeline-blueprint
node scripts/make.mjs --film <film-id> --score out/e04-score-loop-48k.wav
~~~

**`--score` 一定要带**：不带会现场合成一条二十分钟的分数字床，单核实测 23 分钟还没跑完；共享床是 `/root/video-pipeline-blueprint/out/e04-score-loop-48k.wav`（1560 s，48 kHz）。

**先 content 提交，再 sync，再 make**：make 的 content check 会拦 dirty（`content repo is dirty; commit or sync`），也会拦「提交后 HEAD moved 但没 sync」（`content HEAD moved (…); run sync`）。注意 **delivery/ 里的 cover.png / srt / chapters 也要入库**（.gitignore 只忽略 mp4/wav/report/scenes/stills/score.meta），否则它们以 untracked 身份把内容仓弄脏。流程固定成：**改完 → commit → sync → check --strict → make**。

几何/排版自检：`node scripts/qa/still_lint.mjs --compositions=<Comp> --frames=<f1,f2,…>`（越界、贴边、溢出、文本重叠一次查完）。单帧预览：`npx remotion still <Comp> /tmp/x.png --frame=<f>`（在引擎根跑）。

## 3. 一集的标准流水线（未变）

1. **读计划**：series.json 第 N 项 + 书页。thesis / 算法 / 页数 / 数据配方是硬约束；湖里凑不齐就如实记 deviation，不凑数。
2. **算法模块**：`src/TsBase/Algos/ChNN/<X>.hs`，纯函数、无外部数值库。在 ts-base.cabal 的 exposed-modules 与 test other-modules 注册，`test/Spec.hs` 加 import 与 runSuite。
3. **单测**：`test/Algos/ChNN/<X>Spec.hs`，必须含「反向器」型检查；黄金值写绝对值。
4. **证据程序**：`app/ChNN<Name>Evidence.hs`，`runEvidence :: FilePath -> FilePath -> FilePath -> IO ()`；自己维护 checks（分组）、写 `summary.json` / `checks.txt` / `<episode>.chN-*.json`；跑完打印 `checks: P/T in S s`，非零退出码表示失败。`app/Main.hs` 加 dispatch 与 usage。
5. **数据导出**：ts-admin 写 `inventory/scripts/export_chNN_*.py`，输出到 `/root/ts-base/data/episodes/<slug>/`（CSV + manifest.json）。提交 ts-admin。
6. **跑证据到全绿**：先小样本再接全量；失败看 checks.txt 的分组名定位。全绿后提交 ts-base。
7. **生成 pack 数据**：`build/make_<name>_data.py` 读证据 JSON + manifest，产出 `data/dist.json`（画面所有数字的唯一来源），commits / tests / checks / progress / next 写进 `meta`；**每个字段都要和证据 JSON 对得上（assert）**；JSON 里不能出现 `Infinity`。证据里的字符文案有笔误就在这一步做**显示层替换**（只动文案，不造数）。
8. **写画面**：`src/shared.tsx`（从上一集复制组件与数据头）、`src/script.ts`（8 场，页面数组 + 旁白 + PAGES_INDEX）、`src/scenes/*.tsx`、wrapper。先写旁白，再按旁白写页。
9. **配音**：见 §2.3，注意两轮 dump。
10. **静帧复核**：按每页首句渲全部页面（E48 40 张），逐张 `read_image` 检查——**既要看版式，也要核口径**（下集预告写的字段是不是下一集的、页头 goal 与证据实测对不对）。E48 就是这一轮抓出「outro 把本集 50 条/32 维当成 E49 字段」与「goal 10.6 vs 证据 10.8」。
11. **内容提交**：`node scripts/films.mjs check --strict` 必须 0 error。提交 pack 源：`tsint/NN-slug: content — …`。
12. **渲染**：`films.mjs sync` → make（带 `--score`）。先提交再 sync 再 make。
13. **交付**：make 的 `--out` 直接指向 pack `delivery/`；mp4 / wav / report.json / scenes / stills / score.meta 不入库，cover/srt/chapters/ffmeta 入库。
14. **收尾**：film.json `ready` + `assetsStatus: complete` + `publish.coverFrame: 20`；plan.md 补实测 + Delivery；SELF-AUTH 加一条；production-log 加一节；STATUS.md 那行改 `ready | - | yes | ok | 11 | -`；提交 delivery（含 docs）。**写含反引号/长 Markdown 的段落用 write/python 整段写，别用 shell printf**。

## 4. 当前进度（E48 完成时）

- ts-base：`1f5f17f`（E48 证据 28 条 / 10.8 s；算法 `3ea0e17` augment 29 + `aef7e74` contrast 13 + `5ab03b2` mask 15 = 57 条新断言；demo `babd75d` + `94c179c`）。全仓 **151 套测试 / 2,060 断言**全绿。
- ts-admin：`1966618`（`inventory/scripts/export_ch05_ssl.py`：快照 300 只、2015-01-01..2025-12-31、292 只 / 32,878 条候选窗口、1,000 条预训练池；C39/J66/J67 各 17/17/16 只共 50 条探针）。
- video_project：E48 content `05d0daa` + ready `8ac56b4` + plan `c6aa731` + 删重复页头 `b920812` + outro/goal 修 `cc01e9e` + delivery `d37bef5`。
- 引擎：未改（`a667688`）。
- E48 读数：对比探针 **0.45（9/20）** / 掩码 **0.35（7/20）** / 未训练 **0.30（6/20）** / 多数类基线 **0.34（17/50）**；对比损失 1.6298 → 0.5894（12 轮 / 批 32 / 参数 3,008）、掩码重构 0.0084 → 0.0009（10 轮 / 批 64 / 参数 5,852）、掩码率 0.1533；warp 20% → **0.20**、标签错位 0.20、置换等变误差 0；InfoNCE 黄金值 0.5514 / ln 3 = 1.0986 / τ 0.2→0.05 1.0559→0.0003；重构黄金 9.0；证据 28/28。
- 成片：1,446.47 s / 43,394 帧 / 8 场 40 页 / 397 cue / −15 LUFS / TP −2 dBFS / LRA 2.6 / mp4 70,925,270 B / tree `312667dc40ba150b`；mix peak −1.2 dBFS、RMS −26.72 dBFS；闪烁 mean 20.33 / mean|d| 0.0130 / p99 0.1065 / max 7.55 / 7 切点。

## 5. E49 的开工顺序（建议）

1. 读 `series.json` 第 49 项（`gaf-mtf-cote-multidomain`）与 pack 里 22 行 draft plan；thesis 要求「同一窗口 GAF 与 MTF 的 Fisher 判别比相差 1 倍以上」「双通道 CNN 比单通道高 3 个百分点」「四域投票有两个强域就压过任何单域」——先想清楚这三条各自用什么最小证据去钉。
2. 湖里核数：20 只股票、128 日窗口、步长 5、20 日前向收益三分位能不能凑出；`index_members` 只有一期快照，沿用 E43 起「按证监会门类取样」的口径并登记 deviation。
3. ts-base：`Ch05/Imaging.hs`（GASF/GADF/MTF/RP，全部要能手算黄金值：`[[−1,0],[0,1]]` / `[[0,1],[−1,0]]` / MTF `[[0,1,0],[1,0,1],[0,1,0]]` / RP 全 1 与棋盘）与 `Ch05/Cote.hs`（加权票 0.8 vs 1.5 → B、平票取小索引、权重归一化 Σw=1、域失败权重置 0）。**GAF 前必须 z-score 压到 [−1,1] 再 arccos，浮点上界 1+1e-16 会出 NaN，实现里 clamp**；MTF 分箱用分位数不用等宽（A 股长尾会把 90% 观测塞进一箱）。
4. 证据程序 28 条量级，四联图 + 单域/集成准确率两组对照是画面硬需求。
5. 画面：8 场、40 页量级、旁白 10 句/页（E48 的 397 行 / 24 分钟是新的节奏基准；页数×10 句 ≈ 时长秒数×1.5）。

## 6. 已知欠账 / 风险

- `python3 plans/check_evidence.py` 仍会崩：inventory/evidence 里有 5 个历史 JSON 是坏的（33/34 sumary、ch2 三个），属 A73 同类未转义引号 bug，可做一次 chore 修复。
- E48 的结论只到「方向」：20 条测试、一格 5 个百分点、单种子、单次划分；「对比比掩码强」撑不起排名，后续集若讲稳定性要先补多 seed / 多划分证据。
- E48 的 warp 只测了 20 个百分点一个强度，画面已明确写「只报一个点、不给曲线」；不要在后集里把它说成「时间弯曲一定有害」。
- 每集交付前必须重新 sync；引擎 `out/` 里不得留 `tsint-*` 残留，pack `delivery/` 里只入库 cover/srt/chapters/ffmeta。

## 7. E48 修过的坑（下一集复用）

1. **SceneHead 与页内 Head 会 100% 重叠**：每个 scene 文件已有 `<SceneHead id="…" />`（读 SCENES 的 kicker/title/goal），不要再在页里写 `<Head …/>`——E48 因此吃了 12 处 `boxes intersect by 100%`，删了 40 行页头才过 lint。
2. **页头 goal 不要手写**：goal 从 `script.ts` 的 SCENES 来，必须与证据实测对齐（E48 写 10.6、证据 10.8449 → 改成 10.8）。
3. **下集预告卡的字段是下一集的**：E48 把本集「50 条 / 32 维 / 60 天」当成了 E49 的标签/特征，静帧复核才抓到；预告卡要么写下一集 plan 里的真实口径，要么只写方向。
4. **JSX 属性不能写字符串拼接**：`note="块长 " + M.x + " 天"` 报 TS1003，要写成 `note={"块长 " + M.x + " 天"}`；属性后多一个 `}` 报 TS1382。
5. **字号族只有** `FT.lead / FT.h2 / FT.body / FT.label / FT.meta / FT.tiny / FT.micro`（没有 h3/h4）；Row 的 name 列约 3 汉字、note 列约 4 汉字，超了折行。
6. **改稿后清 clips 重录**：tts_narration.py 跳过 >800 B 的旧 mp3，只清对应文件不够时就整目录清空重跑（E48 全量 397 条）。
7. **films.mjs sync 是单向镜像且删多余文件**：先在引擎 dump、`cp` 回 pack、再 sync。
8. **delivery 的 cover/srt/chapters 要入库**，否则 untracked 会把内容仓弄脏、拦 make。
9. 一次性修补脚本（add_head.py / fix_jsx.py / peek*.py 等）做完就删，build/ 只留四个正式脚本（make_script / tts_narration / make_narration / make_dist_data）。
