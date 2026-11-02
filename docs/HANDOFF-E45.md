# 交接文档（2026-11-03 凌晨，E45 完成后封存）

> 本文件取代此前所有交接文档：docs/HANDOFF.md、HANDOFF-EVENING.md、HANDOFF-NEXT-AGENT.md、HANDOFF-E41.md、HANDOFF-E42.md、HANDOFF-E43.md、HANDOFF-E44.md 自本文件起只作历史存档，**不要按旧文档继续工作**。
> 旧文档里的「下一步」已全部过期；以本文件末尾的进度表与工作规范为准。

## 0. 一句话现状

- 视频系列 tsint 已交付 **55 / 74 集**（E01–E18、E19–E45、E65–E74），最新一集 **E45 45-cnn-resnet-gap-cam** 已 end-to-end 完成（算法 / 证据 / 数据 / 讲稿 / 配音 / 渲染 / 交付 / 文档 / 提交）。
- **目标（goal）处于 active + armed**：objective 是「逐集完成 E45–E64，不发布 B 站，status 停在 ready」；如果会话中断后恢复时 goal 变成 disarmed，人类说「继续」就 `update_goal action=resume`。
- **永远不要发布到 Bilibili**。每集结束时 film.json 的 status 必须是 `ready`（不是 published），`bili` 字段保持 null。
- 下一集：**E46 `46-rnn-shallow-dilated`**，标题《感受野之争：RNN、Brick 并行与空洞卷积》，预估 22 分钟。三个算法单元：vanilla RNN（BPTT + clip 5）/ brick 并行 RNN（窗口切 10 块）/ 空洞卷积（dilation 换感受野）。计划数据是 T=500 的单只股票 500 日窗口、3 类走势；**先核湖里能不能凑出 500 日连续窗口**，凑不出按实际改写并登记 deviation。series.json 第 46 项。

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
docker exec haskell-ts bash -lc 'export PATH=/opt/ghc/9.14.1/bin:$PATH && cd /work && cabal run -v0 tsbase -- evidence-ch05-cnn --data data/episodes/45-cnn-resnet-gap-cam --out out/ep45 --evidence inventory/evidence'
~~~

证据程序跑几十秒到几分钟；容器内存上限 **12 GiB**，超了就是 exit 137（不是 Haskell 异常）。GHC-18932：严格字段 `!V.Vector Double` 编不过，用惰性字段；深 ReLU 网络会整片死亡，stem bias 0.5 才活。

### 2.2 Python / 数据

- 数据湖入口：`from tsa.api import Lake`（在 ts-admin 仓根用 `.venv/bin/python`，系统 python 没有 duckdb）。`Lake.daily / panel / minute / instruments`；返回 pyarrow Table（`.to_pandas()`）。复权读取时算：`hfq = price*adj_factor`。
- 湖表：`instruments(code,name,market,board,list_date,delist_date,is_st,industry,updated_at)`、`index_members(...)`、`bars_daily(...)`、`index_daily`。
- 每集导出脚本照抄上一集形状（读 manifest、算 sha256、写 splits / window / deviation）。**计划里的覆盖期 / 股票数常和湖里不一致**：以实际导出为准，deviation 写进 manifest 与画面。

### 2.3 配音（TTS）

虚拟环境 `/root/.venvs/tts`，edge-tts 音色 `zh-CN-YunyangNeural`；TTS 脚本从上一集拷 `build/tts_narration.py` 与 `build/make_narration.py`：

~~~bash
cd <pack>
/root/.venvs/tts/bin/python build/tts_narration.py --lines data/lines.json --clips assets/audio/clips --voice-out data/voice.json --clips-json data/clips.json
/root/.venvs/tts/bin/python build/make_narration.py     # 生成 assets/audio/narration.wav
~~~

**片段缓存按 `scene#index` 命名**，不看文本内容。改一句台词必须手动删对应 mp3 再跑；跑之前先重 dump，让 lines.json 的 text 是新的。脚本每次都会 ffprobe 全部 clip，只缺文件才 synth。**后台 TTS 任务在会话重启后会丢**：重启后先数 `assets/audio/clips` 的 mp3 个数与 0 字节文件，删掉坏片再续跑（E45 栽过一次）。

**时间轴两轮 dump**：`script.ts` 里 `voice.json` 的 import 路径必须写引擎挂载路径 `../../data/<film.id>/voice.json`；dump 必须在 `films.mjs sync` 之后对**引擎副本**跑：`node scripts/qa/dump_script.mjs src/<pack>/script.ts <pack>/data/lines.json`。TTS 定稿前 dump 的 lines.json 是过期的（LINE_PAD 未生效），会让静帧页面与字幕错位约 1 s——**TTS → sync → 再 dump → 才按 lines.json 算静帧帧号**。E45 实测 1,288.78 s。

### 2.4 静帧预览与渲染

~~~bash
cd /root/video-pipeline-blueprint
node scripts/make.mjs --film <film-id> --score out/e04-score-loop-48k.wav
~~~

`--score` 一定要带：不带会现场合成一条二十多分钟的床，单核二十分钟以上。共享床是 `/root/video-pipeline-blueprint/out/e04-score-loop-48k.wav`（1560 s，48 kHz）。

**先 content 提交，再 sync，再 make**：make 的 content check 会拦 dirty，也会拦「提交后 HEAD moved 但没 sync」。单页静帧预览脚本放**引擎根目录**（否则 @remotion 解析不到），bundle 一次 + `renderStill` 循环；帧号按每页首句 `start + 1.2 s` 算、clamp 到页尾前 18 帧。提交前删临时脚本（`tmp-still*.mjs`）。

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
10. **静帧复核**：按每页首句渲全部页面（E45 41 张），逐张 `read_image` 检查；修完 **sync → tsc → 重渲受影响页** 确认（不 sync 会渲出旧副本）。
11. **内容提交**：`node tools/check.mjs` 必须 0 error。提交 pack 源：`tsint/NN-slug: content — ...`。
12. **渲染**：`films.mjs sync` → make（带 `--score`）。先提交再 sync 再 make。
13. **交付**：make 的 `--out` 直接指向 pack `delivery/`；mp4 / wav / report.json / scenes / stills 不入库，cover/srt/chapters/ffmeta 入库。
14. **收尾**：film.json `ready` + `assetsStatus: complete` + `publish.coverFrame: 20`；plan.md 补实测 + Delivery；SELF-AUTH 加一条；production-log 加一节；STATUS.md 那行改 `ready | - | yes | ok | 11 | -`；提交 delivery（含 docs）。**写含反引号/长 Markdown 的段落用 write/python 整段写，别用 shell printf**（E45 栽过一次，反引号被当命令替换吞掉）。

## 4. 当前进度（E45 完成时）

- ts-base：`37411e1`（E45 证据 27 条检查 / 105.3885 s；`719d46e` 含算法 Ch05/Cnn.hs 19、Ch05/ResNet.hs 10、Ch05/GapCam.hs 13，共 42 条新断言；`a670287` 数据）。全仓 **142 套测试 / 1,938 断言**全绿。
- ts-admin：`d89ebd3`（`export_ch05_cnn.py`：全市场 C39/C27/C35 各 100 只共 300、2018-01-02..2025-12-31、panel 1,942 行 × 300 列、窗口 60 步长 150、每只 4 窗 1,178 个、按股票切 945 / 233）。
- video_project：E45 content `b001380` + delivery（cover/srt/chapters/ffmeta + plan Delivery + SELF-AUTH A42 + HANDOFF-E45）。
- 引擎：未改（`a667688`）。
- E45 读数：随机 0.3333 / 线性 0.5494 / 卷积 **0.5880** / 四块残差 0.6266 / 一块残差 0.6609 / GAP-CAM 0.4893；黄金 [−2,−2]、池化 [3,5]、维度 60→53→26→19→9（展平 288）、GAP 2.5、CAM 归一化 [0,0.3333,0.6667,1.0000]、真实样本 sh600130 top-5 52/51/53/50/54（1.0000/0.9655/0.8985/0.8486/0.8062）。
- 成片：1,288.77 s / 38,663 帧 / 8 场 41 页 / 342 cue / −15 LUFS / TP −2 dBFS / mp4 65,180,040 B / tree `c40f8f96b125b389`。
- E45 修过的坑（下一集复用）：① fig 里的字号只能用 `FT.lead / FT.h2 / FT.body / FT.label / FT.meta / FT.tiny / FT.micro`（没有 h3/h4）；② Row 的 name 列约 3 汉字、note 列约 4 汉字，超了折行——长句挪 Body/Chip；③ 同一组件多处复用时改一处要重渲全部使用页（E45 的 AccBars45 改了却漏渲 metrics_1）；④ 数据口径不一致时先查证据程序里的映射（E45 的 CAM heat 是均匀上采样、top5 是 feature+3），画面侧按证据改，不改证据；⑤ boundary 六页的顺序要和旁白编号严格对齐，重排按 `{/* 页N */}` 注释块整体搬。

## 5. 已知欠账 / 风险

- E46 要核 T=500 窗口：湖里单只股票 2018–2025 约 1,942 个交易日，500 日窗口够；但 3 类走势的标注规则要先定（用未来收益分位还是形态聚类），定完写进 manifest。
- `python3 plans/check_evidence.py` 仍然会崩：inventory/evidence 里 5 个历史 JSON 是坏的（33-ad-causal-dilated-conv.summary.json、34-ad-gru-lstm-predictor.summary.json、ch2-nonstat-attn.json、ch2-normalization.json、ch2-impute-3ways.json），属 A73 同类未转义引号 bug，可做一次 chore 修复。
- 真实股票数据只有 seed 7 一组、没有多初始化方差；E45 的「加深没用」只测两档，E46 若要讲稳定性先补多 seed 证据。
- 每集交付前必须重新 sync；引擎 `out/` 里不得留 `tsint-*` 残留，pack `delivery/` 里只入库 cover/srt/chapters/ffmeta。
