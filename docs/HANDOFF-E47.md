# 交接文档（2026-11-03 凌晨，E47 完成后封存）

> 本文件取代此前所有交接文档：docs/HANDOFF.md、HANDOFF-EVENING.md、HANDOFF-NEXT-AGENT.md、HANDOFF-E41.md ~ HANDOFF-E46.md 自本文件起只作历史存档，**不要按旧文档继续工作**。
> 旧文档里的「下一步」已全部过期；以本文件末尾的进度与工作规范为准。

## 0. 一句话现状

- 视频系列 tsint 已交付 **57 / 74 集**（E01–E18、E19–E47、E65–E74），最新一集 **E47 47-gcn-gat-attention** 已 end-to-end 完成（算法 / 证据 / 数据 / 讲稿 / 配音 / 渲染 / 交付 / 文档 / 提交）。
- **目标（goal）处于 active + armed**：objective 是「逐集完成 E48–E64，不发布 B 站，status 停在 ready」；如果会话中断后恢复时 goal 变成 disarmed，人类说「继续」就 `update_goal action=resume`。
- **永远不要发布到 Bilibili**。每集结束时 film.json 的 status 必须是 `ready`（不是 published），`bili` 字段保持 null。
- 下一集：**E48 `48-ssl-augment-contrast-mask`**，标题《没有标签怎么办：增强、对比与掩码重构》，预估 26 分钟。三个算法单元：`Ch05.Augment`（Jitter / Flip / Scale / Warp / Mixup）、`Ch05.Contrast`（TCL / TNC / InfoNCE）、`Ch05.Mask`（TST 式掩码重构）。thesis：A 股无标签窗口上预训练，只用 50 个标签做线性探针，三分类准确率若不能超过「多数类基线」，说明增强破坏了时序语义。屏幕上必须出现 **InfoNCE 0.5514** 与 **ln 3 = 1.0986**。计划数据是沪深 300 全部成分股 2015–2025、60 日 × 单变量对数收益窗口、1,000 条无标签预训练 + 50 个有标签样本（行业三分类）；合成对照周期 8/12/20 各 300 条。**开工先核湖里能不能凑出「1,000 条无标签 + 50 个有标签、同一批股票同一区间」**，凑不出按实际改写并登记 deviation。series.json 第 48 项；pack 已在 `series/tsint/episodes/48-ssl-augment-contrast-mask/` scaffold（`docs/plan.md` 是 22 行 draft）。

## 1. 四个仓库与它们的关系

| 路径 | 角色 | 谁写 |
| --- | --- | --- |
| `/root/ts-base` | Haskell 算法库 + 单测 + 证据程序（每集的读数都由它产出） | 算法模块 `src/TsBase/Algos/ChNN/*.hs`、测试 `test/Algos/ChNN/*Spec.hs`、证据 `app/ChNN*Evidence.hs` |
| `/root/ts-admin` | 数据湖导出脚本（日线 / 分钟线 → CSV + manifest） | `inventory/scripts/export_chNN_*.py` |
| `/root/video_project` | **内容仓**：每集一个 pack（画面源码 + 数据 + 讲稿 + 交付），以及全仓文档、schema、工具 | `series/tsint/episodes/<NN-slug>/` |
| `/root/video-pipeline-blueprint` | **渲染引擎**（Remotion + make 流水线）。引擎不知道任何片名，按 film 清单挂载内容仓 | 一般**不改**；只有引擎 bug 才动，且要单独提交 |

挂载方向：**内容仓是源，引擎是挂载点**。改内容只改 `/root/video_project` 里的 pack，然后 `node scripts/films.mjs sync` 拷进引擎（`src/tsint-NN-...`、`data/tsint-NN-...`）。反向编辑引擎副本会被下一次 sync 覆盖。

系列计划在 `/root/ts-base/plans/series.json`：顶层 dict，`episodes` 是 list（74 项），每项有 slug / title / thesis / chapter / algorithms（unit_id / module / api / math / impl_notes / tests / demo / figures）/ verification / data 要求。**开工前先读它**。

## 2. 工具链（全部在本机，无外网依赖）

### 2.1 Haskell（GHC 不在 PATH）

~~~bash
docker exec haskell-ts bash -lc 'export PATH=/opt/ghc/9.14.1/bin:$PATH && cd /work && cabal build lib:ts-base'
docker exec haskell-ts bash -lc 'export PATH=/opt/ghc/9.14.1/bin:$PATH && cd /work && cabal test'
docker exec haskell-ts bash -lc 'export PATH=/opt/ghc/9.14.1/bin:$PATH && cd /work && cabal build exe:tsbase'
docker exec haskell-ts bash -lc 'export PATH=/opt/ghc/9.14.1/bin:$PATH && cd /work && ./.dist-newstyle-mount/build/x/tsbase/build/tsbase/tsbase evidence-ch05-graph --data data/episodes/47-gcn-gat-attention --out data/episodes/47-gcn-gat-attention --evidence inventory/evidence'
~~~

证据程序跑几秒到几分钟；容器内存上限 **12 GiB**，超了就是 exit 137（不是 Haskell 异常）。GHC-18932：严格字段 `!V.Vector Double` 编不过，用惰性字段；深 ReLU 网络会整片死亡，stem bias 0.5 才活。E47 证据 **28 条 / 7.0 s**，全仓 **148 套 / 2,003 断言**。注意 tsbase 可执行文件路径要**先现查**（E47 用的是 `/work/.dist-newstyle-mount/build/x/tsbase/build/tsbase/tsbase`，E46 的路径不同），查不到就 `cabal list-bin exe:tsbase`。

### 2.2 Python / 数据

- 数据湖入口：`from tsa.api import Lake`（在 ts-admin 仓根用 `.venv/bin/python`，系统 python 没有 duckdb）。`Lake.daily / panel / minute / instruments`；返回 pyarrow Table（`.to_pandas()`）。复权读取时算：`hfq = price*adj_factor`。
- 湖表：`instruments(code,name,market,board,list_date,delist_date,is_st,industry,updated_at)`、`index_members(...)`、`bars_daily(...)`、`index_daily`。
- 每集导出脚本照抄上一集形状（读 manifest、算 sha256、写 splits / window / deviation）。**计划里的覆盖期 / 股票数常和湖里不一致**：以实际导出为准，deviation 写进 manifest 与画面。
- E47 的实际口径：按证监会门类 J66 / C39 / C27 各取 10 只（非 ST、2018-01-01 前上市、有效日 ≥ 1900、成交额中位数降序前 10），2018-01-02..2025-12-31，panel 1,942 行 × 30 列（58,155 个有效值），对齐后 1,822 天（丢 120 天 / 6.2%）；边 = 两两皮尔逊相关 `|corr| ≥ 0.3` → 162 条（行业内 134 / 跨行业 28）；标签行业三分类；划分按行业前 7 / 后 3 = 21 / 9。

### 2.3 配音（TTS）

虚拟环境 `/root/.venvs/tts`，edge-tts 音色 `zh-CN-YunyangNeural`；TTS 脚本从上一集拷 `build/tts_narration.py` 与 `build/make_narration.py`：

~~~bash
cd <pack>
/root/.venvs/tts/bin/python build/tts_narration.py --lines data/lines.json --clips assets/audio/clips --voice-out data/voice.json --clips-json data/clips.json
/root/.venvs/tts/bin/python build/make_narration.py     # 生成 assets/audio/narration.wav
~~~

**片段缓存按 `scene#index` 命名**，不看文本内容。改一句台词必须手动删对应 mp3 再跑（`--only=<scene#idx,...>` 可只补这几句）；跑之前先重 dump，让 lines.json 的 text 是新的。脚本每次都会 ffprobe 全部 clip，只缺文件才 synth。**后台 TTS 任务在会话重启后会丢**：重启后先数 `assets/audio/clips` 的 mp3 个数与 0 字节文件，删掉坏片再续跑。

**时间轴两轮 dump**：`script.ts` 里 `voice.json` 的 import 路径必须写引擎挂载路径 `../../data/<film.id>/voice.json`；dump 必须在 `films.mjs sync` 之后对**引擎副本**跑：`node scripts/qa/dump_script.mjs src/<pack>/script.ts data/<pack>/lines.json`。TTS 定稿前 dump 的 lines.json 是过期的（LINE_PAD 未生效），会让静帧页面与字幕错位约 1 s——**TTS → sync → 再 dump → 才按 lines.json 算静帧帧号**。dump 出来的 lines.json 落在**引擎**数据目录，打包前要手动 `cp` 回 pack 的 `data/lines.json` 再跑 make_narration.py（E47 实测 1,230.54 s / 360 句，发声 1,140.0 s，mean 2.82 s）。

### 2.4 静帧预览与渲染

~~~bash
cd /root/video-pipeline-blueprint
node scripts/make.mjs --film <film-id> --score out/e04-score-loop-48k.wav
~~~

**`--score` 一定要带**：不带会现场合成一条二十分钟的分数字床，单核实测 28 分钟还没跑完；共享床是 `/root/video-pipeline-blueprint/out/e04-score-loop-48k.wav`（1560 s，48 kHz）。

**先 content 提交，再 sync，再 make**：make 的 content check 会拦 dirty（`content repo is dirty; commit or sync`），也会拦「提交后 HEAD moved 但没 sync」（`content HEAD moved (…); run sync`）——E47 这两条都栽过一次。流程固定成：**改完 → commit → `node scripts/films.mjs sync` → make**。仓检查命令是 `node scripts/films.mjs check`，正常输出 `films: ok — 90 film(s), 2 series; registry current`。

单页静帧预览脚本放**引擎根目录**（否则 @remotion 解析不到），bundle 一次 + `renderStill` 循环；帧号按每页首句 `start + 1.2 s` 算、clamp 到页尾前 18 帧。E47 用 python 生成计划 JSON（`<scene>,<page>,<frame>` 列表）+ mjs 读计划，并发 3，40 张约几分钟。提交前删临时脚本（`tmp-still*.mjs` / `tmp-still*.json`），稳帧脚本留在 `out/tools/`（gitignore）。

## 3. 一集的标准流水线（未变）

1. **读计划**：series.json 第 N 项 + 书页。thesis / 算法 / 页数 / 数据配方是硬约束；湖里凑不齐就如实记 deviation，不凑数。
2. **算法模块**：`src/TsBase/Algos/ChNN/<X>.hs`，纯函数、无外部数值库、无随机数表（种子只决定注入落点）。在 ts-base.cabal 的 exposed-modules 与 test other-modules 注册，`test/Spec.hs` 加 import 与 runSuite。
3. **单测**：`test/Algos/ChNN/<X>Spec.hs`，必须含「反向器」型检查；黄金值写绝对值。
4. **证据程序**：`app/ChNN<Name>Evidence.hs`，`runEvidence :: FilePath -> FilePath -> FilePath -> IO ()`；自己维护 checks（分组）、写 `summary.json` / `checks.txt` / `<episode>.chN-*.json`；跑完打印 `checks: P/T in S s`，非零退出码表示失败。`app/Main.hs` 加 dispatch 与 usage。
5. **数据导出**：ts-admin 写 `inventory/scripts/export_chNN_*.py`，输出到 `/root/ts-base/data/episodes/<slug>/`（CSV + manifest.json）。提交 ts-admin。
6. **跑证据到全绿**：先小样本再接全量；失败看 checks.txt 的分组名定位。全绿后提交 ts-base。
7. **生成 pack 数据**：`build/make_<name>_data.py` 读证据 JSON + manifest，产出 `data/dist.json`（画面所有数字的唯一来源），commits / tests / checks / progress / next 写进 `meta`；**每个字段都要和证据 JSON 对得上（assert）**；JSON 里不能出现 `Infinity`（TS 解析失败），dump 前把非有限 float 递归换成 null。证据里的字符文案有笔误就在这一步做**显示层替换**（只动文案，不造数）。
8. **写画面**：`src/shared.tsx`（从上一集复制组件与数据头）、`src/script.ts`（8 场，页面数组 + 旁白 + PAGES_INDEX）、`src/scenes/*.tsx`、wrapper。先写旁白，再按旁白写页。
9. **配音**：见 §2.3，注意两轮 dump。
10. **静帧复核**：按每页首句渲全部页面（E47 40 张），逐张 `read_image` 检查——**既要看版式，也要核口径**（划分怎么切、阈值多少、样本量、对齐丢了多少天）。E47 就是在这一轮抓出「按种子随机划分」这句硬错与「直方图过线数 164 vs 边数 162」的数字矛盾。修完 **sync → `npx tsc --noEmit` → 重渲受影响页**确认。
11. **内容提交**：`node scripts/films.mjs check` 必须 0 error。提交 pack 源：`tsint/NN-slug: content — …`。
12. **渲染**：`films.mjs sync` → make（带 `--score`）。先提交再 sync 再 make。
13. **交付**：make 的 `--out` 直接指向 pack `delivery/`；mp4 / wav / report.json / scenes / stills / score.meta 不入库，cover/srt/chapters/ffmeta 入库。
14. **收尾**：film.json `ready` + `assetsStatus: complete` + `publish.coverFrame: 20`；plan.md 补实测 + Delivery；SELF-AUTH 加一条；production-log 加一节；STATUS.md 那行改 `ready | - | yes | ok | 11 | -`；提交 delivery（含 docs）。**写含反引号/长 Markdown 的段落用 write/python 整段写，别用 shell printf**（E45 栽过一次，反引号被当命令替换吞掉）。

## 4. 当前进度（E47 完成时）

- ts-base：`a3bc61e`（E47 证据 28 条 / 7.0 s；`ecea457` attention 13 + `5fc4a43` gat 12 + `c0fff14` gcn 13 = 38 条新断言；数据 `a299837`）。全仓 **148 套测试 / 2,003 断言**全绿。
- ts-admin：`c70a089`（`export_ch05_graph.py`：证监会门类 J66/C39/C27 各 10 只、2018-01-02..2025-12-31、panel 1,942 行 × 30 列、对齐 1,822 天；`|corr| ≥ 0.3` → 162 条边；划分按行业 21 / 9）。
- video_project：E47 content `cb78c6a` + ready `5570b1e` + delivery（cover/srt/chapters/ffmeta + plan Delivery + SELF-AUTH A44 + HANDOFF-E47）。
- 引擎：未改（`a667688`）。
- E47 读数：P 两节点 **0.5 / 0.5**；tanh(1) = **0.7616**；softmax([0, ln 3]) = **[0.2500, 0.7500]**；非邻居掩码后**精确 0.0000**；缩放 1/√d′ = 1.0000 / **0.5000** / 0.2500；参数 **147 / 328 / 816**（96+51 / 112+216 / 240+576）；梯度差 3.926e−10 / 3.191e−10 / 3.068e−10；置换等变 5.551e−17；真实图 GCN 测试 **9/9**、GAT 8/9、自注意力 6/9、**打乱邻接 1/9**、随机 3/9；损失 1.0673→0.0048 / 1.0310→0.2408 / 1.1055→0.0002；证据 28/28。
- 成片：1,230.53 s / 36,916 帧 / 8 场 40 页 / 360 cue / −15 LUFS / TP −2 dBFS / mp4 约 63 MB / tree `cb522eaf71b78743`；mix peak −1.22 dBFS / RMS −26.93 dBFS；闪烁 mean 20.64 / mean|d| 0.0136 / p99 0.1060 / max 6.69 / 7 切点。
- E47 修过的坑（下一集复用）：
  1. **图里的字号只能用 `FT.lead / FT.h2 / FT.body / FT.label / FT.meta / FT.tiny / FT.micro`**（没有 h3/h4）；Row 的 name 列约 3 汉字、note 列约 4 汉字，超了折行，长句挪 Body/Chip。
  2. **SVG 里的绝对坐标会裁切**：PermFig 环固定画在 cx=700，而卡片 width=700 → 第二个环整块被切；所有几何按 `width` 比例算。
  3. **多条曲线的端点标签要纵向避让**：LossFig 三条损失线终点挤在 0.0002/0.0048 附近，标签直接重叠；加 `ly` 字段每行 +22 排开，并在起点侧也用同样办法。
  4. **图内标注别压在关键点/卡边上**：NormFig 的说明文字压在矩阵下沿（改 svg height 268→306、说明 y=292）、TanhFig 的 x=1 标签压在 tanh 标签上（改到点下方 +26）。
  5. **数字只写证据里有的，且要互相对得上**：直方图 footer 原来按四舍五入后的相关值统计过线对（164），与 `d.edges = 162` 矛盾；`buildGraph` 用的是未舍入值，画面上一切计数都直接取 `d.edges`。
  6. **同一组件多处复用时改一处要重渲全部使用页**。
  7. **数据口径不一致时先查证据程序里的映射，画面侧按证据改，不改证据**。
  8. `fmt4(x, n)` 对 1e−10 级会显示成 `0.0000000002`，改用 `toExponential(2)`；证据 JSON 的 checks 文案有笔误就在 dist builder 里做显示层替换。
  9. **CheckGrid 按组染色**：E47 给 `shared.tsx` 加了 `GROUP_TINT`（data / gcn / gat / attn / control / train 六种色），28 格一条彩色带，比全同色可读得多。下一集若有分组检查直接复用。

## 5. 已知欠账 / 风险

- E48 要核「1,000 条无标签 + 50 个有标签」的数据口径：HS300 历史成分不可得（E43 起就改成全市场门类取样），1,000 条无标签窗口能不能凑出来、50 个标签怎么保证与无标签窗口同分布，**开工第一件事就是查湖**；凑不齐按实际改写并登记 deviation，不凑数。
- E48 的「多数类基线」必须真算：50 个有标签样本按行业三分类，多数类占比可能很接近 1/3，探针要显著超过它才说明表征有用；如果四类增强都不过线，结论就照实写「增强没换来可用表征」，把 InfoNCE 的黄金值（0.5514 / ln 3 = 1.0986）当机制证据。
- `python3 plans/check_evidence.py` 仍然会崩：inventory/evidence 里有 5 个历史 JSON 是坏的（33-ad-causal-dilated-conv.summary.json、34-ad-gru-lstm-predictor.summary.json、ch2-nonstat-attn.json、ch2-normalization.json、ch2-impute-3ways.json），属 A73 同类未转义引号 bug，可做一次 chore 修复。
- E47 的排名结论只到「机制成立」为止：9 个测试点、单次按行业划分、单种子，任何「GCN 比 GAT 好」的说法都撑不起；后续集若讲稳定性先补多 seed / 多划分证据。
- 每集交付前必须重新 sync；引擎 `out/` 里不得留 `tsint-*` 残留，pack `delivery/` 里只入库 cover/srt/chapters/ffmeta。
