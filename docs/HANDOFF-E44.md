# 交接文档（2026-11-03 凌晨，E44 完成后封存）

> 本文件取代此前所有交接文档：docs/HANDOFF.md、HANDOFF-EVENING.md、HANDOFF-NEXT-AGENT.md、HANDOFF-E41.md、HANDOFF-E42.md、HANDOFF-E43.md 自本文件起只作历史存档，**不要按旧文档继续工作**。
> 旧文档里的「下一步」已全部过期；以本文件末尾的进度表与工作规范为准。

## 0. 一句话现状

- 视频系列 tsint 已交付 **54 / 74 集**（E01–E18、E19–E44、E65–E74），最新一集 **E44 44-learnable-shapelet-softmin** 已 end-to-end 完成（算法 / 证据 / 数据 / 讲稿 / 配音 / 渲染 / 交付 / 文档 / 提交）。
- **目标（goal）处于 active + armed**：objective 是「逐集完成 E44–E64，不发布 B 站，status 停在 ready」；如果会话中断后恢复时 goal 变成 disarmed，人类说「继续」就 `update_goal action=resume`。
- **永远不要发布到 Bilibili**。每集结束时 film.json 的 status 必须是 `ready`（不是 published），`bili` 字段保持 null。
- 下一集：**E45 `45-cnn-resnet-gap-cam`**，标题《卷积、残差与 GAP：让分类器指出「哪几天在起作用」》，预估 22 分钟，三个算法单元（一维卷积 / 残差块 / GAP + CAM），数据源是 ts-base/plans/series.json 的第 45 项。E44 的 5 字段多通道窗口欠账在这一集还。

## 1. 四个仓库与它们的关系

| 路径 | 角色 | 谁写 |
| --- | --- | --- |
| `/root/ts-base` | Haskell 算法库 + 单测 + 证据程序（每集的读数都由它产出） | 算法模块 `src/TsBase/Algos/ChNN/*.hs`、测试 `test/Algos/ChNN/*Spec.hs`、证据 `app/ChNN*Evidence.hs` |
| `/root/ts-admin` | 数据湖导出脚本（日线 / 分钟线 → CSV + manifest） | `inventory/scripts/export_chNN_*.py` |
| `/root/video_project` | **内容仓**：每集一个 pack（画面源码 + 数据 + 讲稿 + 交付），以及全仓文档、schema、工具 | `series/tsint/episodes/<NN-slug>/` |
| `/root/video-pipeline-blueprint` | **渲染引擎**（Remotion + make 流水线）。引擎不知道任何片名，按 film 清单挂载内容仓 | 一般**不改**；只有引擎 bug 才动，且要单独提交 |

挂载方向：**内容仓是源，引擎是挂载点**。改内容只改 `/root/video_project` 里的 pack，然后 `node scripts/films.mjs sync` 拷进引擎（`src/tsint-NN-...`、`data/tsint-NN-...`）。反向编辑引擎副本会被下一次 sync 覆盖。

系列计划在 `/root/ts-base/plans/series.json`：74 项（顶层 dict，episodes 是 list），每项有 id / title / slug / runtimeMinutes / thesis / algorithms / verification / data 要求。**开工前先读它**。

## 2. 工具链（全部在本机，无外网依赖）

### 2.1 Haskell（GHC 不在 PATH）

~~~bash
docker exec haskell-ts bash -lc 'export PATH=/opt/ghc/9.14.1/bin:$PATH && cd /work && cabal build lib:ts-base'
docker exec haskell-ts bash -lc 'export PATH=/opt/ghc/9.14.1/bin:$PATH && cd /work && cabal test'
docker exec haskell-ts bash -lc 'export PATH=/opt/ghc/9.14.1/bin:$PATH && cd /work && cabal build exe:tsbase'
~~~

证据程序跑起来几十秒到几分钟；容器内存上限 **12 GiB**，超了就是 exit 137（不是 Haskell 异常）。E44 实际命令：

~~~bash
docker exec haskell-ts bash -lc 'export PATH=/opt/ghc/9.14.1/bin:$PATH && cd /work && cabal build exe:tsbase && cabal run -v0 tsbase -- evidence-ch05-learn --data data/episodes/43-shapelet-search-pips --out out/ep44 --evidence inventory/evidence'
~~~

### 2.2 Python / 数据

- 数据湖入口：`from tsa.api import Lake`（在 ts-admin 仓根用 `.venv/bin/python`，系统 python 没有 duckdb）。`Lake.daily(codes, start, end, adjust="raw|qfq|hfq", columns)` / `panel(field,...)` / `minute(codes, freq, start, end)` / `instruments(as_of, active_only)`；返回 pyarrow Table（`.to_pandas()`）。复权在读取时算：`hfq = price*adj_factor`。
- 湖表：`instruments(code,name,market,board,list_date,delist_date,is_st,industry,updated_at)`（industry 是证监会门类，如 `J66货币金融服务`）、`index_members(index_code,code,name,as_of,source,fetched_at)`、`bars_daily(...)`、`index_daily`。
- 每集导出脚本照抄上一集形状（读 manifest、算 sha256、写 splits / window / deviation）。**计划里的覆盖期 / 股票数常和湖里不一致**：以实际导出为准，deviation 写进 manifest 与画面。

### 2.3 配音（TTS）

虚拟环境 `/root/.venvs/tts`，edge-tts 音色 `zh-CN-YunyangNeural`；TTS 脚本从上一集拷 `build/tts_narration.py` 与 `build/make_narration.py`：

~~~bash
cd <pack>
/root/.venvs/tts/bin/python build/tts_narration.py --lines data/lines.json --clips assets/audio/clips --voice-out data/voice.json --clips-json data/clips.json
/root/.venvs/tts/bin/python build/make_narration.py     # 生成 assets/audio/narration.wav
~~~

**片段缓存按 `scene#index` 命名**，不看文本内容。改一句台词必须手动删对应 mp3（例如 `assets/audio/clips/verification-50.mp3`）再跑；跑之前先重 dump，让 lines.json 的 text 是新的。脚本每次都会 ffprobe 全部 clip，只缺文件才 synth。

**时间轴两轮 dump**：`script.ts` 里 `voice.json` 的 import 路径必须写引擎挂载路径 `../../data/<film.id>/voice.json`；dump 必须在 `films.mjs sync` 之后对**引擎副本**跑：`node scripts/qa/dump_script.mjs src/<pack>/script.ts <pack>/data/lines.json`。TTS 定稿前 dump 的 lines.json 是过期的（LINE_PAD 未生效），会让静帧页面与字幕错位约 1 s——**TTS → sync → 再 dump → 才按 lines.json 算静帧帧号**。E44 估算 1,332.57 s、实测 1,291.52 s。

### 2.4 渲染

~~~bash
cd /root/video-pipeline-blueprint
node scripts/films.mjs sync                 # 内容仓 → 引擎挂载（改完 pack 必跑）
node scripts/films.mjs check --strict       # 内容检查；失败通常是「dirty」或「HEAD moved」
npx tsc --noEmit                            # 类型检查（查的是引擎里的副本！）
node scripts/make.mjs --film <film-id> --score out/e04-score-loop-48k.wav
~~~

`--score` 一定要带：不带会现场合成一条二十多分钟的床，单核二十分钟以上。共享床是 `/root/video-pipeline-blueprint/out/e04-score-loop-48k.wav`（1560 s，48 kHz）。

**先 content 提交，再 sync，再 make**：make 的 content check 会拦 dirty，也会拦「提交后 HEAD moved 但没 sync」（E44 两轮都栽在这）。单页静帧预览脚本放**引擎根目录**（否则 @remotion 解析不到），bundle 一次 + `renderStill` 循环；帧号按每页首句 `start + 1.2 s` 算、clamp 到页尾前 18 帧。提交前删临时脚本（`tmp-still*.mjs`）。

## 3. 一集的标准流水线（未变）

1. **读计划**：series.json 第 N 项 + 书页。thesis / 算法 / 页数 / 数据配方是硬约束；湖里凑不齐就如实记 deviation，不凑数。
2. **算法模块**：`src/TsBase/Algos/ChNN/<X>.hs`，纯函数、无外部数值库、无随机数表（种子只决定注入落点）。在 ts-base.cabal 的 exposed-modules 与 test other-modules 注册，`test/Spec.hs` 加 import 与 runSuite。
3. **单测**：`test/Algos/ChNN/<X>Spec.hs`，必须含「反向器」型检查；黄金值写绝对值。
4. **证据程序**：`app/ChNN<Name>Evidence.hs`，`runEvidence :: FilePath -> FilePath -> FilePath -> IO ()`；自己维护 checks（分组）、写 `summary.json` / `checks.txt` / `<episode>.chN-*.json`；跑完打印 `checks: P/T in S s`，非零退出码表示失败。`app/Main.hs` 加 dispatch 与 usage。
5. **数据导出**：ts-admin 写 `inventory/scripts/export_chNN_*.py`，输出到 `/root/ts-base/data/episodes/<slug>/`（CSV + manifest.json）。提交 ts-admin。
6. **跑证据到全绿**：先小样本再接全量；失败看 checks.txt 的分组名定位。全绿后提交 ts-base。
7. **生成 pack 数据**：`build/make_<name>_data.py` 读证据 JSON + manifest，产出 `data/dist.json`（画面所有数字的唯一来源），commits / tests / checks / progress / next 写进 `meta`；**每个字段都要和证据 JSON 对得上（assert）**；JSON 里不能出现 `Infinity`（TS 解析失败），dump 前把非有限 float 递归换成 null。
8. **写画面**：`src/shared.tsx`（从上一集复制组件与数据头）、`src/script.ts`（8 场，页面数组 + 旁白 + PAGES_INDEX）、`src/scenes/*.tsx`、wrapper。先写旁白，再按旁白写页。
9. **配音**：见 §2.3，注意两轮 dump。
10. **静帧复核**：按每页首句渲全部页面（E44 38 张），逐张 `read_image` 检查；修完 **sync → tsc → 重渲受影响页** 确认（不 sync 会渲出旧副本）。
11. **内容提交**：`node tools/check.mjs` 必须 0 error。提交 pack 源：`tsint/NN-slug: content — ...`。
12. **渲染**：`films.mjs sync` → make（带 `--score`）。先提交再 sync 再 make。
13. **交付**：make 的 `--out` 直接指向 pack `delivery/`；mp4 / wav / report.json / scenes / stills 不入库，cover/srt/chapters/ffmeta 入库。
14. **收尾**：film.json `ready` + `assetsStatus: complete` + `publish.coverFrame: 20`；plan.md 补实测 + Delivery；SELF-AUTH 加一条；production-log 加一节；STATUS.md 那行改 `ready | - | yes | ok | 11 | -`；提交 delivery（含 docs）。

## 4. 当前进度（E44 完成时）

- ts-base：`79f293d`（E44 证据 35/35、11.7954 s；同提交含 Ch05/LearnShapelet.hs 17、Ch05/ShapeletTree.hs 19、Ch05/Mlp.hs 14，共 50 条新断言）。全仓 **139 套测试 / 1,896 断言**全绿。
- ts-admin：`8955376`（未变：`export_ch05_shapelet.py` 全市场同门类各 50 只、2018-01-02..2025-12-31、panel 1,942 行 × 150 列、sha256 0ccdea98…）。
- video_project：E44 content `ebfc952` + delivery（cover/srt/chapters/ffmeta + plan Delivery + SELF-AUTH A41 + HANDOFF-E44）。
- 引擎：未改（`a667688`）。
- E44 读数：搜索模板 0.3429 → SoftMin 学习 **0.5524**（+21.0 pp）；DTW 1-NN 0.5143；随机 0.3333；黄金值 −1.0986；权重 α=1 [0.4551,0.2760,0.1674,0.1015]、α=20/200 [1,0,0,0]；下溢 2/6、4/6、5/6；α 扫描落点误差 1.8113 / 2.1242 / 2.1415；退火损失 1.4455 → 0.0129、平均落点误差 1.8201；五个模板误差 0.9848 / 1.1948 / 3.1731 / 2.9489 / 0.7987；树 5 距离深度 2 满分、20 原点拐点深度 4（0.9444 / 0.8667、gap 0.0778）；MLP [100,16,3] 测试 0.9667、梯度校验 0.0000；α=1000 十二轮损失 −95.49%、零权重 0.9032。
- 成片：1,291.53 s / 38,746 帧 / 8 场 38 页 / 342 cue / −15 LUFS / TP −2 dBFS / mp4 66,829,398 B / tree `68c90e7b5c611a00`。
- E44 修过的坑（下一集复用）：SoftMin 曲线图例要显式错开（曲线图例从 padL+230 起）；Row 的 name 列窄，5 个汉字会折行、note 超过 4 汉字会折行——标题改短或把长句挪进 Body；条形图/表格数值宽度提前估算。

## 5. 已知欠账 / 风险

- `python3 plans/check_evidence.py` 仍然会崩：inventory/evidence 里 5 个历史 JSON 是坏的（33-ad-causal-dilated-conv.summary.json、34-ad-gru-lstm-predictor.summary.json、ch2-nonstat-attn.json、ch2-normalization.json、ch2-impute-3ways.json），属 A73 同类未转义引号 bug，可做一次 chore 修复。
- E44 的 5 字段多通道窗口欠账要在 E45（CNN）还；E44 已把「5 字段留给下一集卷积核」写进画面与 manifest。
- 真实股票数据只有 seed 7 一组、没有多初始化方差；E45 若要讲稳定性，先补多 seed 证据。
- 每集交付前必须重新 sync；引擎 `out/` 里不得留 `tsint-*` 残留，pack `delivery/` 里只入库 cover/srt/chapters/ffmeta。
