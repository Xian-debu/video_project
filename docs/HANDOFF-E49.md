# 交接文档（2026-11-03 凌晨，E49 完成后封存）

> 本文件取代此前所有交接文档：docs/HANDOFF.md、HANDOFF-EVENING.md、HANDOFF-NEXT-AGENT.md、HANDOFF-E41.md ~ HANDOFF-E48.md 自本文件起只作历史存档，**不要按旧文档继续工作**。
> 旧文档里的「下一步」已全部过期；以本文件末尾的进度与工作规范为准。

## 0. 一句话现状

- 视频系列 tsint 已交付 **59 / 74 集**（E01–E18、E19–E49、E65–E74），最新一集 **E49 49-gaf-mtf-cote-multidomain** 已 end-to-end 完成（算法 / 证据 / 数据 / 讲稿 / 配音 / 渲染 / 交付 / 文档 / 提交），成片 24:03.73。
- **目标（goal）处于 active + armed**：objective 是「逐集完成 E50–E64，不发布 B 站，status 停在 ready」；如果会话中断后恢复时 goal 变成 disarmed，人类说「继续」就 `update_goal action=resume`。
- **永远不要发布到 Bilibili**。每集结束时 film.json 的 status 必须是 `ready`（不是 published），`bili` 字段保持 null。
- 下一集：**E50 `50-model-selection-skeleton`**，标题《自动选模型：池子比策略更重要》，预估 20 分钟，chapter ch06。E49 的 outro 把主题收成一句「池子比策略更重要 / 换空间，不换数据」，E50 就从这个角度接。

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
docker exec haskell-ts bash -lc 'export PATH=/opt/ghc/9.14.1/bin:$PATH && cd /work && cabal build all'
docker exec haskell-ts bash -lc 'export PATH=/opt/ghc/9.14.1/bin:$PATH && cd /work && cabal test'
~~~

稳定跑法（本集实测）：把命令写进 `/tmp/e49_test.sh` → `docker cp` 进容器 → `docker exec haskell-ts bash /tmp/e49_test.sh`。**别在 `bash -c` 的双引号里写 `$PATH`**，会被吞成空串导致 `cabal: command not found`。容器内存上限 **12 GiB**，超了就是 exit 137。GHC 9.14 的坑：严格字段 `!VU.Vector Double` 编不过（数据族要写 `!(VU.Vector Double)`）；`VU.fromList` 字面量歧义要加类型注解。

E49 证据 **28 条 / 476.9 s**（单轮 8 分钟左右，改断言要按分钟算），全仓 **153 套 / 2,074 断言**。

### 2.2 Python / 数据

- 数据湖入口：`from tsa.api import Lake`（在 ts-admin 仓根用 `.venv/bin/python`，系统 python 没有 duckdb）。`Lake.daily / panel / minute / instruments`；返回 pyarrow Table（`.to_pandas()`）。
- 湖表：`instruments(code,name,market,board,list_date,delist_date,is_st,industry,updated_at)`、`index_members(...)`、`bars_daily(...)`、`index_daily`。
- **`bars_daily.amount` 全列为 NULL**（E49 实测 672,637 行无一非空）——任何按成交额排序的取样都会退化成按代码排。要选股票就用**行业分层**（HS300 成分数 ≥ 5 的门类各取一只）。
- `index_members` 只有 **2026-10-30 一期快照**，没有历史成分；所有集都按「快照 + 每只股票自己的连续有效段」切窗，偏差写进 manifest。
- E49 的实际口径：20 个门类各一只股票、128 根日线窗口、步长 5、前向 20 根、窗口内 z 归一化、编码前显式 min-max；候选 **8,531** 条，三分位切点 **−0.031416 / 0.036240**，按窗口末日 < 2022-01-01 切 5,672 / 2,859；CNN 抽样 2,400 / 1,200。

### 2.3 配音（TTS）

虚拟环境 `/root/.venvs/tts`（edge_tts 7.3.1），音色 `zh-CN-YunyangNeural`；系统 python3 **没有** edge_tts。脚本从上一集拷 `build/tts_narration.py` 与 `build/make_narration.py`：

~~~bash
cd <pack>
/root/.venvs/tts/bin/python build/tts_narration.py --lines data/lines.json --clips assets/audio/clips --voice-out data/voice.json --clips-json data/clips.json --concurrency 6
python3 build/make_narration.py     # 生成 assets/audio/narration.wav
~~~

**片段缓存按 `scene#index` 命名**，不看文本内容；改一句台词必须手动删对应 mp3 再跑（`--only=<scene#idx,...>` 可只补这几句）。脚本会跳过「已存在且 > 800 B」的 mp3——**改稿后要清空 clips 目录**才会重录。

**时间轴两轮 dump（本集又踩了一次）**：`script.ts` 里 `voice.json` 的 import 路径必须写引擎挂载路径 `../../data/<film.id>/voice.json`；dump 必须在 `films.mjs sync` 之后对**引擎副本**跑。TTS 定稿前 dump 出来的 lines.json 是过期的——顺序必须是 **TTS → sync → dump（实测）→ cp 回 pack → 再 make_narration**。E49 第一版 narration 按估算 1466.94 s 摆，真时间轴是 **1443.75 s**，白跑一次。

### 2.4 静帧预览与渲染

~~~bash
cd /root/video-pipeline-blueprint
node scripts/make.mjs --film <film-id> --score=out/e04-score-loop-48k.wav
~~~

**`--score` 一定要带**：不带会现场合成一条二十分钟的分数字床，单核实测 23 分钟还没跑完；共享床是 `/root/video-pipeline-blueprint/out/e04-score-loop-48k.wav`（1560 s，48 kHz）。

**先 content 提交，再 sync，再 make**：make 的 content check 会拦 dirty，也会拦「提交后 HEAD moved 但没 sync」。`delivery/` 里的 cover.png / srt / chapters 也要入库（.gitignore 只忽略 mp4/wav/report/scenes/stills/score.meta）。流程固定成：**改完 → commit → sync → check --strict → make**。

几何/排版自检：`node scripts/qa/still_lint.mjs --compositions=<Comp> --frames=<f1,f2,…>`。单帧预览：`npx remotion still <Comp> /tmp/x.png --frame=<f> --scale=0.34`（在引擎根跑）。**抽帧时避开页面切换**：`Pages` 有 12 帧淡入淡出，正好落在两页之间时 still_lint 会把两页文本报成重叠（E49 因此虚报 39 处）；把采样点偏移 18 帧就 PASS。

## 3. 一集的标准流水线（未变）

1. **读计划**：series.json 第 N 项 + 书页。thesis / 算法 / 页数 / 数据配方是硬约束；湖里凑不齐就如实记 deviation，不凑数。
2. **算法模块**：`src/TsBase/Algos/ChNN/<X>.hs`，纯函数、无外部数值库。在 ts-base.cabal 的 exposed-modules 与 test other-modules 注册，`test/Spec.hs` 加 import 与 runSuite。
3. **单测**：`test/Algos/ChNN/<X>Spec.hs`，黄金值写绝对值；浮点比较用容差（cos(π/2) = 6.1e-17，别用精确相等）。
4. **证据程序**：`app/ChNN<Name>Evidence.hs`，`runEvidence :: FilePath -> FilePath -> FilePath -> IO ()`；自己维护 checks（分组）、写 `summary.json` / `checks.txt` / `<episode>.chN-*.json`；跑完打印 `checks: P/T in S s`。`app/Main.hs` 加 dispatch 与 usage。**`--evidence` 传文件路径，不是目录**（传目录报 `withFile: inappropriate type (Is a directory)`）。
5. **数据导出**：ts-admin 写 `inventory/scripts/export_chNN_*.py`，输出到 `/root/ts-base/data/episodes/<slug>/`（CSV + manifest.json）。提交 ts-admin，并写 ts-admin 的 SELF-AUTH。
6. **跑证据到全绿**：先小样本再接全量；失败看 checks.txt 的分组名定位。全绿后提交 ts-base。
7. **生成 pack 数据**：`build/make_dist_data.py` 读证据 JSON + manifest，产出 `data/dist.json`（画面所有数字的唯一来源）；**每个字段都要和证据 JSON 对得上（assert 不一致就 EVIDENCE MISMATCH 退出）**；JSON 里不能出现 `Infinity`。
8. **写画面**：`src/shared.tsx`（类型 + 组件 + `M`）、`src/script.ts`（8 场：页数 + 旁白 + PAGES_INDEX）、`src/scenes/*.tsx`、wrapper。先写旁白，再按旁白写页。E49 的节奏基准：**每页 10 句、每场景 10 的倍数**，38 页 380 行 ≈ 24 分钟。
9. **配音**：见 §2.3，注意两轮 dump。
10. **静帧复核**：按每页首句渲全部页面（E49 38 张，约 12 分钟），拼三张联系表逐页看——**既看版式，也核口径**（数字对不对、下集预告字段是不是下一集的、页头 goal 与证据实测一致吗）。
11. **内容提交**：`node scripts/films.mjs check --strict` 必须 0 error。提交 pack 源：`tsint/NN-slug: content — …`；再单独提交 film.json ready。
12. **渲染**：`films.mjs sync` → make（带 `--score`）。先提交再 sync 再 make。
13. **交付**：make 的 `--out` 直接指向 pack `delivery/`；mp4 / wav / report.json / scenes / stills / score.meta 不入库，cover/srt/chapters/ffmeta 入库。
14. **收尾**：plan.md 补实测 + Delivery；SELF-AUTH 加一条；production-log 加一节；STATUS.md 那行改 `ready | - | yes | ok | 11 | -`；写本文件下一版；提交 delivery（含 docs）。**写含反引号/长 Markdown 的段落用 write/python 整段写，别用 shell printf**。

## 4. 当前进度（E49 完成时）

- ts-base：`3accf37`（E49 证据 28 条 / 476.9 s；数据 `ceba42e`；算法 `9fabc7c` imaging 9 + cote 5 = 14 条新断言；`2288161` Domain 多态）。全仓 **153 套测试 / 2,074 断言**全绿。
- ts-admin：`527e03b`（`inventory/scripts/export_ch05_imaging.py`：20 个门类各一只、8,531 条 128 日窗口、三分位标签；SELF-AUTH A20 记录 amount 全 NULL 与行业分层改法）。
- video_project：E49 content `c609fb3` + ready `e55ea69` + delivery `abcb9d9`（+ 本次 docs 提交）。
- 引擎：未改（`a667688`）。
- E49 读数：Fisher **GASF 0.0139 / GADF 0.0114 / MTF 0.0059 / RP 0.0076**（比值 2.3559）；CNN **GASF 0.3517 / MTF 0.3633 / 双通道 0.3133**（随机带 0.28–0.39）；COTE 权重 0.2607 / 0.2472 / 0.2397 / 0.2524，四域测试 **0.3456 / 0.3444 / 0.3200 / 0.3211**，COTE **0.3322** vs 最好单域 **0.3456** vs 等权 **0.3367**；双射反解 **4.471e-15**（min-max）/ **1.695**（z-score+clamp）；参数 **687 / 787**；证据 28/28。
- 成片：1,443.73 s / 43,312 帧 / 8 场 38 页 / 380 cue / −15 LUFS / TP −2 dBFS / LRA 2.4 / mp4 68,885,116 B / tree `f1e2457955f0818c`；mix peak −1.0 dBFS、RMS −26.58 dBFS；闪烁 mean 20.54 / mean|d| 0.0131 / p99 0.1087 / max 8.21 / 7 切点。

## 5. E50 的开工顺序（建议）

1. 读 `series.json` 第 50 项（`model-selection-skeleton`）与 pack 里的 draft plan。按 E49 收尾的那句「池子比策略更重要」：同一个任务、同一套特征，只换**模型空间**（骨架池），看结果差多少。
2. 先想清楚本集要钉的最小证据：骨架池里的模型数量 / 结构差异 → 同一训练预算下的准确率分布；「池子比策略更重要」需要一个策略对照（例如同一池子里换搜索策略 vs 不同池子用同一策略）。读计划里的 algorithms 单元，按它的 api/tests 写模块。
3. 湖里核数（E49 已证明 `amount` 不可用、`index_members` 只有一期快照），沿用行业分层 + 快照口径，偏差登记。
4. 证据程序 20–30 条量级；画面 8 场、40 页量级、旁白 10 句/页。
5. 如果又是负结果（很可能：小网络 + 小池子），照 E48/E49 的做法**照实讲**——写成「方向可报、排名不可报」，不换数据不放松门限。

## 6. 已知欠账 / 风险

- `python3 plans/check_evidence.py` 仍会崩：inventory/evidence 里有 5 个历史 JSON 是坏的（33/34 sumary、ch2 三个），属 A73 同类未转义引号 bug，可做一次 chore 修复。
- E49 的结论只到「方向」：单种子、单次划分、20 只股票、20 日方向标签近随机；画面已明确写「不写 MTF 更好」「不做显著性检验」。后续集不要把它说成「图像化没用」。
- E49 计划里的 RP 黄金值（ε=1.1）与定义矛盾，已按标准定义实现并更正；如果后续集复用计划里的 RP 值，先核一遍。
- GAF 类编码**必须先 min-max 到 [−1,1]** 再 arccos；用 z-score + clamp 会截断尾部、破坏双射（误差 1.695）。这条已写进画面与实现注释。
- 每集交付前必须重新 sync；引擎 `out/` 里不得留 `tsint-*` 残留，pack `delivery/` 里只入库 cover/srt/chapters/ffmeta。

## 7. E49 修过的坑（下一集复用）

1. **`take 300` 落在同一类**：fisher 抽样最初写的是「取前 300 条训练样本」，而训练池是 400 条/类顺序拼接，结果 300 条全在类 0，类间散度为 0，四个 Fisher 全报 0.0000。平衡抽样要显式 `concat [take 100 [r | r <- pool, label r == c] | c <- [0,1,2]]`。
2. **浮点黄金值不能精确相等**：cos(π/2) 是 6.1e-17，`imgVals g == [-1,0,0,1]` 判 FAIL；改成逐元素 `abs (a-b) < 1e-12`。
3. **Haskell 反引号中缀会截断 JS 模板**：在 run_code 的 `String.raw` 里写 `x `div` 2` 会把模板提前结束，报 `Expected a semicolon`。写 Haskell 一律用前缀 `div`/`quot`，或把文件 base64 后 `base64 -d` 落盘。
4. **`tools.edit` 报 file changed since it was read**：文件被 python 改过之后，edit 会拿旧快照比对失败；要么重读，要么继续用 python 批量替换。
5. **`tools.write` 覆盖已存在文件要先 read**：E49 的 `figs.tsx` 是 E48 模板占位，直接 write 被拒，先 `read` 5 行再写。
6. **场景文件漏 `M` 的 import**：8 个 `src/scenes/*.tsx` 全报 `TS2304 Cannot find name 'M'`，用 python 正则把 `M` 加进 `import { … } from "../shared"`。
7. **JSX 属性不能写字符串拼接**：`note="参数量 " + M.x` 报 TS1003，要写 `note={"参数量 " + M.x}`；属性后多一个 `}` 报 TS1382。
8. **Pages 过场会被 still_lint 当重叠**：页面切换有 12 帧淡入淡出，采样点正好落在两页之间时会报「两页文本重叠」（E49 报 39 处、f39905/f42182）；偏移 18 帧后 PASS，不是版面缺陷。
9. **outro 的下集预告字段是下一集的**：E49 把 E50 写成「换空间，不换数据 / 模型骨架搜索」，核对过 dist 的 `meta.next` 才没有再犯 E48 的错。
