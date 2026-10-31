# 生产日志（production-log）

> 状态：🧭 规划期建立（2026-10-29）。每集生产完成后追加一段。
> 记录：日期、集号、卡点、返工、最终提交号。用于复盘"哪类集最费时间"。

## 模板

```
## E<NN> <slug> — <YYYY-MM-DD>
- ts-base: <commit>（算法 + 测试 + evidence）
- video_project: <commit>（pack + delivery）
- 用时: <算法 h / 素材 h / 渲染 h>
- 卡点: <一句话>
- 返工: <有/无 + 原因>
- 备注: <对接下游集的影响>
```

## 记录

> 2026-10-30 晚：新会话承接，全系列恢复生产（SELF-AUTH A5）。操作入口 `docs/HANDOFF-EVENING.md`；
> 以下按 `production_order` 继续，每集仍一提交一条目。

## E70 ode-solvers-from-scratch — 2026-10-29
- ts-base: dbc3d85（analytic / Euler / RK4 + 34 断言 + 3 份 evidence）
- video_project: 6fa7265（pack 首版）→ 06ddedc（关键帧修复）→ 3416d4f（图例避让）→ 44b6dc1（score −2.5 dB）；交付 srt/chapters/cover 随后提交
- 引擎: 06b5c49（make 支持 film.audio.musicGainDb）
- 成片: 676.97 s（11.28 min），−15 LUFS，TP −2 dBFS，20309 帧，8 场
- 流水线: score 渲染 29 min（677 s 音频，已知慢点 K15）；画面分段渲染 3 min；全流程一次通过 QA（still lint / music gate / loudnorm / flicker）
- 卡点: ① staticFile 必须用 film.id 而非 prefix；② still lint 抓到图例压轴标签；③ 混音 bed 仅比人声低 4.7 dB，gate 要求 ≤ −5 dB → 新增 film.audio.musicGainDb = −2.5
- 返工: 3 次（关键帧排版、still lint、mix gate），均无内容重写
- 偏差: 计划 22 min，实做 11.28 min；首集先打通全链路，后续集按主题密度决定是否加长
- 备注: 首集即模板；下一集 ch9-nd-solver（第 71 集）

## E01 intro-why-time-series — 2026-10-30
- ts-base: f6dfce8（ep74 证据清理后基线；本集 0 算法，复用 ch09 的 142 条断言快照）
- video_project: 550eda8（pack/script/narration timing）→ 5764fd5（bed gain −4.5 dB + coverFrame 2300）→ 本次 delivery 提交
- 引擎: f140af4（film 自定义封面帧）
- 成片: 821.77 s（13.70 min），−15 LUFS，TP −2 dBFS，24653 帧，8 场；205 条旁白，686.1 s 语音
- 流水线: score 渲染 38 min（822 s 音频）；画面分段渲染 4 min；stills→mix→loudnorm→flicker→publish 全过
- 卡点: ① 首次 mix gate 失败（bed 仅比语音低 4.8 dB）→ `audio.musicGainDb=-4.5`；② make 默认封面 180 帧，改为 film.publish.coverFrame=2300 后单独重出
- 返工: 2 次（open 卡片高度、definitions 卡片高度/文案；均由 still 复核发现）
- 偏差: 计划 14 min，实做 13.70 min；导论集无算法，保留 0 个算法单元的诚实计数
- 备注: 首个非 ch09 集；下一集按 production_order 为 E65 error-metrics-trio（ch08）

## E65 error-metrics-trio — 2026-10-30
- ts-base: 3442ee1（ErrorMetrics / PercentageErrors / Mase + 37 断言 + evidence 模块）→ f177e78（20 只 A 股 CSV + ch8 evidence 快照）
- ts-admin: c1630fb（export_ch08_metrics.py，20 只 × 2020–2025，28,949 行）
- video_project: dc423ba（pack/scenes/script/narration timing）→ 4dbeb1f（definitions 卡片高度与公式字号）→ 本次 delivery 提交
- 引擎: d319797（SELF-AUTH E1/E2：score 跨集复用与 coverFrame 接线）
- 成片: 756.57 s（12.61 min），−15 LUFS，TP −2 dBFS，22697 帧，8 场；193 条旁白，560.0 s 语音
- 流水线: 复用第 01 集 822 s score（seed=11 / energy=0.8 / bpm=84 / minor），混音 gain −4.5 dB；画面分段渲染 4 min；stills→mix→loudnorm→flicker→publish 全过
- 卡点: ① TSX 里 TeX 用普通字符串，\r/\f 被 JS 吃掉，KaTeX 渲染红色源码 → 全部改 String.raw；② definitions 卡片固定高度装不下三条公式 + 小条，footer 溢出 → 公式 32→24、卡高 584→620、footer 从 b(29) 提前到 b(26)；③ make 仍用 180 帧封面 → 单独 publish --cover-frame=1937
- 返工: 4 次（definitions TeX、卡片高度、boundary/outro 入场时序、封面帧），均由 still 复核或 make gate 发现
- 偏差: 计划 13 min，实做 12.61 min；三算法集控制在 822 s 配乐内，未重渲染 score
- 备注: 首个 ch08 集；后续 E66–E69 共用同一 score 与「四组数 + 七边界」语法
## E66 anomaly-metrics-auc — 2026-10-30
- ts-base: 9312f62（ConfusionMetrics / RocAuc / PrAuc + 46 断言 + AUC/PR 曲线）→ d1a25d9（E66 evidence 快照，含 243 点双曲线）
- video_project: 4290579（pack/scenes/script/narration timing）→ 本次 delivery 提交
- 引擎: 无（复用第 01 集 822 s score；make 的 coverFrame 仍走单独 publish）
- 成片: 698.93 s（11.65 min），−15 LUFS，TP −2 dBFS，20968 帧，8 场；194 条旁白，501.5 s 语音
- 流水线: score 复用；画面分段渲染约 4 min；stills→mix→loudnorm→flicker→publish 全过；music gate speech −24.54、bed vs speech −8.4、full −29.95
- 卡点: ① film 字号族没有 h3，TSX 里 FT.h3 = undefined，标题退回 16px（open/boundary/shared Quote 共 5 处）；② 首轮 make 在 content check 因 pack 未提交直接退出；③ make 仍用 180 帧封面 → 单独 publish --cover-frame=2200；④ verification 的 threshold 联合类型 string-or-number 导致 toFixed TS2339，改 Number(...)
- 返工: 3 次（标题字号、open 三件事卡增高、implementation 补手算样例），均由 still 复核发现
- 偏差: 计划 18 min，实做 11.65 min；旁白 194 条比 E65 少 58 s，画面按 822 s 配乐内复用
- 备注: ch08 第二集；下一步 E67 split-no-leakage（时间序列切分与泄漏）
## E67 split-no-leakage — 2026-10-30
- ts-base: b97c7db（TemporalSplit / FixedForecast / RollingForecast + 50 断言 + 2600 点日线与 20 只面板）
- ts-admin: b071b6f（export_ch08_split.py，000001.SZ 2015–2025，2600 行）
- video_project: 9f41b7d（pack/scenes/script/narration timing）→ 0587077（split.json 列为 derive 产物）→ b651b13（delivery 导出）→ 本次封面/文档提交
- 引擎: 856d804（films.mjs 把 film.publish 带进 registry；make 首次自动使用 coverFrame，不再单独 publish）
- 成片: 1364.93 s（22.75 min），−15 LUFS，TP −2 dBFS，40948 帧，8 场；428 条旁白，1106.7 s 语音
- 流水线: 复用 E66 822 s score，两份 6 s 交叉淡化到 1365 s 并重采样 48 kHz；8 段 render 复用；stills→mix→loudnorm→flicker→publish 全过；flicker mean|d| 0.0113、p99 0.1121、max 12.05、cuts 7
- 卡点: ① 测试里 `[0, 0 .. 6]` 步长 0 生成无限列表，spec 被 cgroup OOM kill（12 GB 容器上限挡住宿主崩溃）→ 改 `0 : [0 .. 6]`；② rolling 轮数测试手算错（s=1 应 36、2600 应 70）→ 改断言；③ render_music 生成 1365 s 需 >14 min → 复用 E66 score 拼接；④ 混音采样率 44.1 vs 48 kHz → 重采样；⑤ make 三次被 content check 拦（derived 入库、delivery 未提交、HEAD 移动）→ 逐项提交后 sync；⑥ registry 丢 publish 字段导致封面 180 → films.mjs 接线
- 返工: 4 次（open 三件事卡高度、implementation/verification/intuition/boundary/outro 卡片高度、script kicker 对齐、封面帧 2200）
- 偏差: 计划 22 min，实做 22.75 min（+45 s）；全片 428 条旁白，语音密度高于 E66
- 备注: ch08 第三集；首次全自动封面帧；下一步 E68 按 production_order（用户已要求后续视频暂停）

## E68 fewshot-and-cost — 2026-10-30
- ts-base: 267b0c2（FewShotSampler / Efficiency + 33 断言，总套件 308）→ 0fca48c（1,200 点日线 CSV + manifest）→ f49c7c1（MLP 严格更新、推理计时去共享）→ e73c193（证据元数据修剪 + UTC runAt）→ 255dc3f（证据快照：22 + 13 条检查）
- ts-admin: a37e35a（export_ch08_fewshot.py，000001.SZ 1,200 点，只读 Lake）
- video_project: 856f0c8（pack/scenes/script/narration timing）→ d0bdb6d（静帧复核后版式修正）→ 32290a0（delivery 导出）→ 本次文档提交
- 引擎: 无（复用 E66 822 s score；两份 6 s acrossfade 后 atrim 1,123.81 s、48 kHz，make 全阶段 PASS）
- 成片: 1,123.81 s（18.73 min），−15 LUFS，TP −2 dBFS，33,714 帧，8 场；316 条旁白，927.2 s 语音
- 流水线: 8 段分开渲染；stills 45/3,371/15,171/26,971；mix musicGain −4.5 dB、ducked 46.3%；flicker mean|d| 0.0118、p99 0.1078、max 12.16、cuts 7；316 cue 无一换行、最长 29 字；8 章；封面 frame 2200（73.33 s）
- 卡点: ① TTS 只装在 /root/.venvs/tts（host python3 无 edge_tts）；② dump_script 必须跑引擎副本，否则 ../../data 落到内容仓；③ 计划手算 337 与"输入 1 维"矛盾（1 维 = 321），改用 2 个滞后输入并在画面并列 321/337；④ 两个反例（点×均匀、点×随机）由库直接 error，证据生成器本地重建索引；⑤ 128 维 MLP 同预算 MSE 反而最大（0.0100），保留为结论并改断言
- 返工: 3 次（首轮静帧：单位缺失/Lazy 倍数措辞/右栏空白；二轮：intuition 行距、definitions 卡高与 Quote 位置、outro 拍点）
- 偏差: 计划 16 min，实做 18.73 min（+2.73 min）；旁白 316 条、语音 927 s，密度高于 E67
- 备注: ch08 第四集；下一步 E69 hexbin-balance-audit（PCA + Hexbin 均衡性，书 p.198 图 8.2，1 算法，16 min）

## E69 hexbin-balance-audit — 2026-10-30
- ts-base: 64773de（HexbinBalance：pca2/hexbin/concentration + 23 断言，总套件 331）→ 0eb1597（20 只 `panel_20.csv` 50,757 行）→ 26374d9（`app/Ch08HexbinEvidence.hs` + `evidence-ch08-hexbin` 分支）→ d9701f6（证据快照：12 条检查）→ c8d9631（网格敏感度 15/20/30/40/60）
- ts-admin: e798aad（`export_ch08_hexbin.py`，20 只 A 股 2015–2025 前复权，50,757 行 / 2.15 MB，只读 Lake）
- video_project: 820298d（pack/scenes/script/narration timing）→ e20b985（场景补 `lines` 字段供分段渲染哈希）→ f8831df（ready + coverFrame 3900）→ 本次 delivery/文档提交
- 引擎: 无（复用 E66 822 s score；两份 6 s acrossfade + atrim 961.34 s、48 kHz）
- 成片: 961.33 s（16.02 min），−15 LUFS，TP −2 dBFS，28,840 帧，8 场；247 条旁白，716.2 s 语音
- 流水线: 8 段分开渲染；mix musicGain −4.5 dB；flicker mean|d| 0.0144、p99 0.1741、max 11.95、cuts 7；247 cue 无一换行、最长 32 字；8 章；封面 frame 3900
- 卡点: ① 首轮 make 在 render 阶段报 `Cannot read properties of undefined (reading 'join')` —— script.ts 的 SCENES 缺 `lines` 字段，分段渲染哈希取不到行；② 未提交的 publish 产物让 content check 判 dirty，必须先删再重跑；③ 直觉场讲轴向坐标时只有真实密度图，补 `HexSchematic`；④ 问题场结论条压字幕
- 返工: 3 次（首轮静帧版式、intuition 示意图、definitions 卡标签）
- 偏差: 计划 16 min，实做 16.02 min，几乎命中
- 备注: ch08 第五集，ch08 全部成片；下一步按 production_order 回到 E02 `missing-values-three-ways`（ch01）

## E02 missing-values-three-ways — 2026-10-30
- ts-base: eb38253（Locf/StatImp/LinInterp 三模块 + 36 断言，总套件 367；SELF-AUTH A12）→ 164e440（三只 qfq 日线 + manifest 279,873 B）→ 0b5175f（`app/Ch02ImputeEvidence.hs` + `evidence-ch02-impute` 分支，49 条运行时检查；SELF-AUTH A13）
- ts-admin: da0e0c0（`inventory/scripts/export_ch02_missing.py`，sh600519 5,834 行 / sz000001 5,902 行 / sz000693 1,996 行）
- video_project: e395e08（pack/scenes/script/派生数据）→ 9b0cb5c（narration 拼接脚本）→ fb64aa6（ready + coverFrame 4480）→ 0a247ad（断言口径修正）→ 910da65（时间轴标签行距）→ 1bc9abd（narration 48 kHz）→ 本次 delivery/文档提交
- 引擎: 无（score 由 E69 961.34 s bed 两份 6 s 交叉淡化后 atrim 1105.01 s、48 kHz，`--score=` 复用；1105 s 直接重渲染 >20 min 且未完成）
- 成片: 1,105.01 s（18.42 min），−15 LUFS，TP −2 dBFS，33,150 帧，8 场；298 条旁白，918.3 s 字幕跨度
- 流水线: 8 段分开渲染（segments reused 8/rendered 0，树哈希未变）；mix musicGain −4.5 dB、ducked 48.2%、peak −1.13 dBFS；flicker mean|d| 0.0195、p99 0.2729、max 11.63、cuts 7；298 cue 无一换行、最长 25 字；8 章；封面 frame 4480（149.33 s，三数页、无字幕）
- 卡点: ① film 声明 narration 但文件不存在——先补 `build/make_narration.py` 按 `lines.json` 的 start 把 298 条 clip 拼成 narration.wav（gitignore，不入库）；② make 的 content check 连未跟踪脚本也算 dirty；③ 提交后 HEAD 移动必须重新 sync；④ 直接重渲染 1105 s score 单线程跑 20 min 未完成——改用 E69 bed 交叉淡化拼接；⑤ still lint 在 f45 判 ticker 与名称行重叠 29%（>25% 上限）——行距 16→24 px；⑥ mix 拒绝 24 kHz 旁白对 48 kHz bed——make_narration 输出改 48 kHz
- 返工: 5 次 make（4 次失败 + 1 次 PASS）；首轮 27 张静帧版式修正 5 处（problem 标题换行、WindowPlot y 轴被全序列均价 495.16 拉爆、implementation 代码块过晚、StatImp 卡溢出、boundary 三卡）
- 偏差: 计划 19 min，实做 18.42 min（−0.58 min）；旁白 298 条、语音 813 s，密度低于 E68
- 备注: ch02 第一集；下一步 E03 `sma-wma-ses`（SMA/WMA/SES，α=2/(N+1) 的滞后等价，21 min）。**下一集起 score 继续复用 `out/e02-score-loop-48k.wav`（1105 s，够 E03 的 1260 s 不够——E03 需先重建 ≥1300 s 的 bed）**

## E03 sma-wma-ses — 2026-10-30
- ts-base: 39c2fa7（Sma/Wma/Ses 三模块 + 41 断言，总套件 408；SELF-AUTH A14）→ eaa7367（茅台日线 730 行 + 5 分钟线 240 行）→ f7b469a（`app/Ch03SmoothingEvidence.hs` + `evidence-ch03-smoothing` 分支，summary.json + 三份证据快照 12/13/16）
- ts-admin: 243fd60（`inventory/scripts/export_ch03_smoothing.py`，sh600519 2019-01-02–2021-12-31 前复权 730 行；5 分钟线 240 根）
- video_project: b30d06d（pack/scenes/script/派生数据）→ 本次 delivery/文档提交
- 引擎: 无（复用 E69 961.34 s bed 两份 6 s acrossfade + atrim 1320 s、48 kHz，`--score=` 复用）
- 成片: 1,299.93 s（21:39.93），−15 LUFS，TP −2 dBFS，38,998 帧，8 场；343 条旁白，语音 968.4 s，字幕跨度 1,088.5 s
- 流水线: score 复用（音乐门 stem PASS：full −25.09 / audible 63% / sub 7%）；8 段分开渲染；mix musicGain −4.5 dB、ducked 48.5%、peak −1.0 dBFS；mix 门 speech −23.38、bed vs speech −9.7、gap audible −33.1；flicker mean|d| 0.0171、p99 0.2442、max 9.38、cuts 7；343 cue 无一换行、最长 25 字；8 章；封面 frame 5610（187.00 s，三数页、无字幕）
- 卡点: ① engine 的 `src/tsint-03-sma-wma-ses` 是 sync 出来的真实拷贝，改 pack 后不 sync 会渲染旧代码；② summary.json 字段名与派生层不一致（`daily_compare`→`dailyCompare`、`corr_sma20_ses21`、`max_diff_first5`/`max_diff_after100`、α 在 `M.bridge.alpha_for_20`）；③ `fmtE(0)` 走 `Math.log10(0)` 出 NaN，验证页出现「差是 NaN e NaN」——加 0 分支；④ 两处 Mono 内联（推导行、`alphaForWindow`/`windowForAlpha`）挤成一行，改 block div；⑤ make 的 content check 连未提交 docs/派生都算 dirty；⑥ 首轮 make 被外层命令超时截断，改后台日志重跑才拿到全阶段 PASS
- 返工: 3 轮静帧（29 张首轮抓 6 处版式；次轮修 verification 卡高、StepPlot 说明条；终轮复核 3 页），无内容重写
- 偏差: 计划 21 min，实做 21.67 min（+0.67 min）；旁白 343 条、语音 968 s，密度高于 E02
- 备注: ch02 第二集；下一步 E04 `stationarity-and-differencing`（平稳性与差分，书 2.4）

## E04 holt-and-holt-winters — 2026-10-30
- ts-base: 19afbda（Holt/HoltWinters 两模块 + 33 断言，总套件 441；SELF-AUTH A15）→ 67d72d3（`app/Ch04HoltEvidence.hs` + `evidence-ch04-holt`，24 条检查）→ 65b3cab（日线 730 行 / 5 分钟 3,264 根 / 成交量 4,487 行 + 证据快照）
- ts-admin: 776f57e（`inventory/scripts/export_ch04_holt.py`：600519 日线 730 行、5 分钟只保留每天恰好 48 根的 68 天、sz000693 成交量 4,487 行含 2,491 个零；零值按 zero_filled 记）
- video_project: 90b9287（pack/scenes/script/派生数据/plan）→ 本次 delivery/文档提交
- 引擎: 无（E69 961 s bed 两份 6 s acrossfade + atrim 1560 s、48 kHz，`--score=` 复用）
- 成片: 1,480.90 s（24:40.90），−15 LUFS，TP −2 dBFS，44,427 帧，8 场；351 条旁白，语音 1,142.2 s，字幕跨度 1,477.5 s（1.2→1478.69）
- 流水线: score 复用（stem 门：full −25.1 / audible 63.1% / sub 6.8%）；8 段分开渲染；mix musicGain −4.5 dB、ducked 51.9%、peak −1.0 dBFS；mix 门 speech −23.57、bed vs speech −9.5、gap audible −33.08；flicker mean|d| 0.0173、p99 0.2587、max 10.24、cuts 7；stills lint PASS（4 帧；29 张全页帧另跑一轮 PASS）；351 cue 中 6 条换行、最长 34 字；8 章；封面 frame 6860（228.67 s，open 场末「2,491 / 1,628 / 4,487」页，无字幕）
- 卡点: ① TTS 必须用 `/root/.venvs/tts/bin/python`（系统 python3 没有 edge_tts）；② open 场漏渲染 `SceneHead`（元素 import 了却没用）；③ Flatten 迷你图 y 映射方向写反、虚线/标签被裁；④ SeasonPlot 只画正柱、负值全 1px、intraday 折线错层；⑤ ScaleSketch 上下两排反了、负值向上画；⑥ 两处 Build at 正好等于页中点（珊瑚卡与青卡在静帧里根本看不到）；⑦ make 的 content check 连未提交 docs 都算 dirty，必须先提交 pack 再 make
- 返工: 3 轮静帧（29 张首轮抓 6 处，次轮修 2 处，终轮复核 open/直觉页）；1 次 TTS 重跑（换解释器）；make 1 次 PASS
- 偏差: 计划 24 min，实做 24.68 min（+0.68 min）；旁白 351 条、语音 1,142 s；证据从 18 条扩到 24 条（日内口径重做）
- 备注: ch02 第三集；下一步 E05 `stationarize-three-ways`（三种平稳化：差分、对数、Z-score，书 2.4）

## E05 stationarize-three-ways — 2026-10-30
- ts-base: 0a2d412（Diff/LogT/ZScore 三模块 + 34 断言，总套件 475；SELF-AUTH A17）→ 8c454dd（`app/Ch05StationarizeEvidence.hs` + `evidence-ch05-stationarize`，31 条检查 16/10/5）→ 118b29b（三只日线 + summary.json + 合成序列）
- ts-admin: eeb23ac（`inventory/scripts/export_ch05_stationarize.py`：600519 730 行 / 000001 244 行 / 000693 4,487 行含 2,491 零 / 随机游走 10,001 点 / 异方差 5,000 点）
- video_project: 01317d9（pack/scenes/script/派生数据/plan）→ d34d3db（「一半」改「过半」+ 重录旁白 + coverFrame 1519）→ **514cc7a**（本次 delivery 提交：cover.png / srt / chapters / film ready）
- 引擎: 无（score 由 E04 1560 s bed `--score=out/e04-score-loop-48k.wav` 复用；新谱 1210 s 单线程跑了 1 分多钟未完成即杀掉，避免重蹈 30 分钟）
- 成片: 1,209.03 s（20:09.03），−15 LUFS，TP −2 dBFS，36,271 帧，8 场；309 条旁白，语音 908.1 s，字幕跨度 1,016.3 s（1.2→1206.83）
- 流水线: 8 段一次性渲染（0 reused / 8 rendered）；musicGain −4.5 dB、ducked 49.2%、peak −1.11 dBFS；stem 门 full −25.1 / audible 63.0% / sub 6.8%；mix 门 speech −23.49、bed vs speech −9.9、gap audible −33.37；flicker mean|d| 0.0164、p99 0.2749、max 7.74、cuts 7；stills lint PASS（4 帧 + 28 张全页复核）；309 cue 无一换行、最长 26 字；8 章；封面 frame 1519（50.63 s，茅台曲线页、无字幕）
- 卡点: ① still lint 首轮满屏越界——真实 `PAD=72`/`CW=1776`，我按 96 排版，右列 `PAD+1220+636`、三卡行 1852 全部出界，逐处改 1776/574/580/592/832；② `implementation p1` 右卡「看不见」其实 `Build at=lf(0.18)` 正好从页中点开始淡入，非缺陷；③ TTS `--only` 的键是 `scene#index`（`definitions#35`），写成 `definitions-35` 会 synth 0 条再因缺 clip 失败；④ make 的 content check 依旧要求 commit 后先 `sync`；⑤ 直接重渲染 1210 s score 太慢，复用 E04 bed
- 返工: 1 轮布局（8 处宽度/间距修正）+ 1 次文案（2491/4487=55.5%，「一半」→「过半」并重录 1 条旁白）；make 1 次 PASS
- 偏差: 计划 20 min，实做 20.15 min（+0.15 min）；旁白 309 条、语音 908 s，密度高于 E04（351 条/1,142 s）以外的最低值，但仍保住 20 min
- 备注: ch02 第四集；下一步 E06 `decomposition`（分解：趋势/季节/残差，书 2.4 之后）。**E04 bed 1560 s 已够 E06 的 1300 s 左右，继续 `--score=` 复用；新集超过 1560 s 才需重建 bed**

## E06 decomposition-and-strength — 2026-10-30
- ts-base: 3bce049（ClassicalDecomp/TrendStrength/SeasonalStrength 三模块 + 28 断言，总套件 503；SELF-AUTH A18 d0fb444）→ 3c7d013（茅台 730 行分解 + 48 相位 profile + synthetic 240 行 + summary.json）→ 7fa2e6d（`app/Ch06DecompEvidence.hs` + `evidence-ch06-decomp`，39 条检查 13/12/14）→ 83c8bfb（证据输出 + 三份 evidence 快照）→ 3a97ccd（修 E05 证据 writer 的 tests JSON 缺 `}`）→ 5303159（manifest 记 exporter 提交 30f9b27）
- ts-admin: 30f9b27（`export_ch02_decomp.py`：600519 730 行 / 000001 730 行 / 5 分钟 240 根 / 上证 2015 平盘 120 行）
- video_project: b59fb85（pack/scenes/script/346 行讲稿/narration/plan）→ **784074a**（本次 delivery 提交：cover.png 157,721 B / srt / chapters / film ready + coverFrame 1450）
- 引擎: 无（复用 E04 1560 s bed `--score=out/e04-score-loop-48k.wav`；先在前台跑被 120 s 超时截断，改后台 job 重跑）
- 成片: 1,374.73 s（22:54.73），−15 LUFS，TP −2 dBFS，41,093 帧，8 场；346 条旁白，语音 1,040.5 s，字幕跨度 1,372.5 s（1.2→1372.52）
- 流水线: 8 段渲染；musicGain −4.5 dB、ducked 50.4%、peak −1 dBFS；stem 门 full −25.1 / audible −27.88（share 63.1% / sub 6.8%）；mix 门 speech −23.92、bed vs speech −9.5、gap audible −33.42；flicker mean|d| 0.0179、p99 0.2936、max 10.13、cuts 7；346 cue 无一换行、最长 33 字；8 章；封面 frame 1450（48.33 s，茅台曲线 + 两个强度卡、无字幕）
- 卡点: ① dump 的 `lines.json` 落在**引擎** `data/tsint-06-…/`，pack 里没有 → TTS 报 `FileNotFoundError: 'data/lines.json'`，必须 `cp` 回 pack `data/`；② film 声明 narration 但没有 narration.wav → check 报 `narration is missing`，先跑 `build/make_narration.py`（131,392,364 B / 1,368.67 s）；③ `DecompStat` 上季节字段叫 `seasonal` 不是 `season`（tsc 6 处报错）；④ 噪声种子 44 的 ac1=0.203 把「纯噪声」趋势强度抬到 0.416，换 seed 45（ac1=0.012，趋势 0.2747）并把这次踩坑独立成 verification 第 5 页；⑤ 封面帧 1250 正好是 Stats `Build at=.26` 的起点，右栏全空 → 改 1450；⑥ make 的 content check 依旧要求先 commit 再 sync
- 返工: 静态页 3 轮（首轮 28 帧抓 6 处：problem p3 profile 图淡入过晚、两处 Bars 标签折行、implementation 签名 `\n` 被折叠、verification/boundary/outro 的 goal 与 title 重复；次轮修 gates；终轮把 verification 拆成 6 页并把种子坑独立）；讲稿一次成型无 TTS 重录；make 1 次 PASS
- 偏差: 计划 22 min，实做 22.91 min（+0.91 min）；29 页（verification 6 页）；旁白 346 条、语音 1,040 s；证据 39 条超过计划的 30 条
- 备注: ch02 第五集；下一步 E07 `fft-basis-patch`（频域与分块：FFT / 基展开 / Patch，三种换坐标系的方式）。**E04 bed 1560 s 可用到 E07 的 23 min 左右，再长就需重建 bed**

## E07 fft-basis-patch — 2026-10-31
- ts-base: 0f68316（Fft/BasisExp/Patchify 三模块 + 47 断言，总套件 550）→ 6480e48（`app/Ch07FftEvidence.hs` + 证据数据，55 条检查 26/18/11）→ df5f27e（SELF-AUTH A19：归一化/补零/最小二乘坐标/Patch 填充）
- ts-admin: a021e44（`inventory/scripts/export_ch02_fft.py`：600519 日线 730 行 2019-01-02–2021-12-31，窗口取最后 512 点；5 分钟 240 根 2026-08-10–08-14，每天 48 根）
- video_project: 27b6e73（pack/scenes/script/294 行讲稿/narration/plan）→ b110a64（页间交叉淡变 + outro Build 提前）→ **09063b4**（本次 delivery 提交：cover.png 153,988 B / srt / chapters / film ready + coverFrame 2259）
- 引擎: 无（a667688；score 复用 `out/e04-score-loop-48k.wav` 1560 s、48 kHz）
- 成片: 1,298.73 s（21:38.73），−15 LUFS，TP −2 dBFS，38,962 帧，8 场；294 条旁白，语音 1,011.3 s，字幕跨度 1.2→1296.52 s（speaking 1,114.2 s）
- 流水线: 8 段分开渲染（reused 0 / rendered 8）；musicGain −4.5 dB、ducked 52.8%、peak −1.0 dBFS；stem 门 full −25.1 / audible −27.88（share 63.1% / sub 6.8%）；mix 门 speech −23.84、gap_full −30.44、gap_audible −33.18、bed vs speech −9.6；flicker mean|d| 0.0213、p99 0.3153、max 10.04、cuts 7；294 cue 无一换行、最长 34 字（budget 34）；8 章；封面 frame 2259（75.30 s，茅台日线 + FFT 窗口 512 / 最大谱线 bin 1 双卡、无字幕）
- 卡点: ① 图 2.12 合成信号的口径分裂——CSV 只导前 1,000 点，但 FFT 实际用 4,096 点（bin 0.244 Hz，10 Hz = 40.96 bin 才「不在整格」），intuition 图标题与「泄漏」文案改成「分析 4096 点 · 图中前 1000 点」，讲稿边界段同步改；② `Pages` 页间淡变非重叠（`outO [b−fade,b]` + 下一页 `inO [b,b+fade]`）→ 边界帧两页同时透明，flicker 门在 outro 判 blink dips（frame 37684 depth 5.5 / 38093 depth 5.2）；改 `outO [b,b+fade]` 真正交叉淡变，并把 outro 内容 Build 提前到 `lf 0.36/0.55`；③ dump 的 `lines.json` 落引擎 `data/tsint-07-…/`，TTS 后 `voice.json` 也要 cp 回引擎同名目录再重 dump，否则时间轴全空；④ pack 一提交 HEAD 移动，make 的 content check 立刻失败，必须先 `films.mjs sync`；⑤ 封面候选 f631（标题页）/ f5766 / f2259 都在字幕间隙，取内容最全的 2259
- 返工: 讲稿 268→294 行扩写一次成型；静帧 37 页末帧 lint 一轮 PASS（预修 definitions p4 callout top 640→672、intuition 图标题）；make 2 轮（第 1 轮 flicker 失败 + 1 轮 PASS）；TTS 294 条一次过
- 偏差: 计划 23 min，实做 21.65 min（−1.35 min）；37 页；旁白 294 条、语音 1,011 s；证据 55 条
- 备注: ch02 第六集；下一步 E08 `adf-shifting-transition`（冷门三指标：ADF/漂移性/转移性）。**E04 bed 1560 s 仍够 E08 的 1440 s；超过 1560 s 再重建**

## E08 adf-shifting-transition — 2026-10-31
- ts-base: 69e2805（Adf/Shifting/Transition 三模块 + 55 断言，总套件 605）→ a4cb74c（`app/Ch08AdfEvidence.hs` + 证据数据，43 条检查 36/7）→ 345c0df（SELF-AUTH A20：ADF 回归式/滞后/Schwert/临界值、Shifting m=9 与 minmax、Transition 分箱与 2/9）
- ts-admin: bad962c（`inventory/scripts/export_ch02_adf.py`：600519 日线 2188 行 2013-01-04–2021-12-31，ADF 取最后 250 点；002456 725 行 2019-01-02–2021-12-31；两只票的收益率符号各 250）
- video_project: 441a015（pack/scenes/script/332 行讲稿/narration/plan）→ **f368495**（本次 delivery 提交：cover.png 133,866 B / tsint-08.srt 25,329 B / chapters / film ready + coverFrame 3693）
- 引擎: 无（a667688；score 复用 `out/e04-score-loop-48k.wav` 1560 s、48 kHz）
- 成片: 1,343.89 s（22:23.89），−15 LUFS，TP −2 dBFS，40,317 帧，8 场；332 条旁白，语音 1,022.3 s，字幕跨度 1.2→1341.70 s（speaking 1,138.4 s）
- 流水线: 8 段分开渲染（reused 0 / rendered 8）；musicGain −4.5 dB、ducked 50.8%、peak −1.0 dBFS；stem 门 full −25.1 / audible −27.88（share 63.1% / sub 6.8%）；mix 门 speech −23.64、gap_full −30.30、gap_audible −33.13、bed vs speech −9.6；flicker mean|d| 0.0218、p99 0.3902、max 9.73、cuts 7；332 cue 无一换行、最长 27 字（budget 34）；8 章；封面 frame 3693（123.10 s，open 转移性两张矩阵页：完美周期 2/3 与常数 2/9、无字幕）
- 卡点: ① `film.json` 没写 `publish.coverFrame` 就开 make，publish 阶段按默认 180 帧出封面（纯标题黑场）；补 `coverFrame: 3693` 后单独重跑 `publish.mjs --cover-frame=3693` 再 `cp` 回 delivery；② `films.mjs sync` 会清空引擎 `data/tsint-08-…/`，每次 sync 后必须重跑 `dump_script.mjs` 再 `cp` lines.json 回 pack，否则 TTS 用的是旧时间轴；③ `script_check` 对短句报 cps 3.13–3.40（E07 同样 9 条），是 TTS 固定停顿造成的口径噪声，不是语速错误；④ 讲稿按 CPS 4.5 估 1,372.27 s、实测 1,343.89 s（−28 s），8 个场景起点整体前移，still lint 帧与封面候选全部重算
- 返工: 讲稿一次成型 332 行；静帧 43 页末帧 lint 一轮 PASS；make 一轮 PASS；封面 8 个页末帧 + 3 个字幕间隙帧实测后取 3693（矩阵页内容最全且无字幕）；publish 重跑一次（补 coverFrame）
- 偏差: 计划 24 min，实做 22.40 min（−1.60 min）；43 页；旁白 332 条、语音 1,022 s；证据 43 条（36 手算 / 7 数据）；断言 55（AdfSpec 30 / ShiftingSpec 11 / TransitionSpec 14），套件 605
- 备注: ch02 第七集；下一步 E09 `mlp-and-tcn`（production_order 索引 18：先 MLP 再 TCN，同一个任务换模型）。**E04 bed 1560 s 仍够 E09 的 22–23 min；超过 1560 s 再重建**

## E09 mlp-and-tcn — 2026-10-31
- ts-base: af656e2（Mlp/Tcn 两模块 + 35 断言，总套件 640）→ 4e63cc7（SELF-AUTH A21 + errata E26）→ ce8ff1d（`app/Ch02MlpTcnEvidence.hs` 证据程序）→ e0cb04a（证据数据：两只票 CSV + 6 个产物 + summary.json + 2 个 evidence JSON，31 条检查 = 27 手算 + 4 数据）
- ts-admin: 8e256a2（`inventory/scripts/export_ch02_mlp_tcn.py`：600519 日线 5,033 行 2005-01-04–2025-12-31、000001 4,953 行，qfq、剔停牌，manifest 带 max_gap）
- video_project: c32c885（pack/scenes/script/364 行讲稿/数据生成器）→ 6970b63（TTS takes + `Row` 布局修复 + coverFrame 23891）→ **489db36**（本次 delivery 提交：cover.png 163,447 B / tsint-09.srt 28,220 B / chapters / film ready）
- 引擎: 无（a667688；score 复用 `out/e04-score-loop-48k.wav` 1560 s、48 kHz）
- 成片: 1,506.37 s（25:06.37），−15 LUFS，TP −2 dBFS，45,191 帧，8 场；364 条旁白，语音 1,156.0 s（mean 3.18 s），字幕跨度 1.2→1504.16 s（speaking 1,283.4 s）
- 流水线: 8 段分开渲染（reused 0 / rendered 8）；musicGain −4.5 dB、ducked 51.2%、peak −1.06 dBFS；stem 门 full −25.1 / audible −27.88（share 63.1% / sub 6.8%）；mix 门 speech −23.69、gap_full −30.46、gap_audible −33.18、bed vs speech −9.6；flicker mean|d| 0.0183、p99 0.3425、max 8.98、cuts 7；364 cue 中 1 条换行、最长行 34 字（budget 34）；8 章；封面 frame 23891（796.37 s，definitions 末页：MLP 1985 / TCN 1649 参数量算式 + 感受野公式，无字幕）
- 卡点: ① 本仓 brief 的卷积黄金值算错（`y=[3,11,14,20,26]`）——按式(2.62) 第二项应为 `2·1+3·2=8`，全仓改 `[3,8,14,20,26]`，登记 errata E26；② 式(2.62) 字面直读是非翻转卷积（会看到未来，错版首值 14 而非 3），本仓实现翻转核 + 左补零，`leakyConv1d` 留作反面教材；③ TCN 数组布局：卷积输出曾用时间主序 `t·C+c`、其余通道主序 `c·T+t`，单通道单层测试全过、多层梯度检查误差 1.29–1.95，改成 `co = idx div t` 后归零；④ MLP 反向两错（δ 列表多算输入层、梯度取用层序反了），单层梯度检查是二分定位的关键；⑤ `Row` 组件列宽写死 470+300，窄卡片把注释压成 0 宽竖排并溢出，改百分比列 + `maxWidth`；⑥ 字幕间隙只有 7 段（全是场景交界），封面只能在交界帧里挑；⑦ Haskell lambda 经 write 工具写入会丢反斜杠（GHC-31244），改用 python 回写。
- 返工: 讲稿 364 行一次成型；梯度/布局调试 2 轮（MLP 梯度、TCN 布局各一次）；stills 26 页末帧 lint PASS 后因 `Row` 布局重渲染一遍；make 一轮 PASS；TTS 364 条一次过；封面在 7 个交界帧里实测后取 23891
- 偏差: 计划 23 min，实做 25.11 min（+2.11 min）；34 页；旁白 364 条、语音 1,156 s；证据 31 条（27 手算 / 4 数据）；断言 35（MlpSpec 16 / TcnSpec 19），套件 640
- 备注: **ch02 八集全部完成**（E02–E09）；下一步 E10 `attention-block`（production_order 索引 19，22–24 min）。**E04 bed 1560 s 仍够 E10；超过再重建**

## E10 attention-block — 2026-10-31
- ts-base: 3bd9389（Attention 模块 + 32 断言，总套件 672）→ 74b8882（SELF-AUTH A22 + errata E27）→ ccd521e（`app/Ch02AttentionEvidence.hs` 证据程序）→ d2ab717（证据数据：两只票 CSV + 6 个产物 + summary.json + evidence JSON，31 条检查 = 26 手算 + 5 数据）
- ts-admin: 6a4eabe（`inventory/scripts/export_ch02_attention.py`：600519 5,033 行 / 000001 4,953 行 qfq 日线，manifest 带 max_gap）
- video_project: 604b8c1（pack/scenes/script/231 行讲稿/数据生成器 + coverFrame 5609）→ **919b7da**（本次 delivery 提交：cover.png 155,731 B / tsint-10.srt 19,321 B / chapters / film ready）
- 引擎: 无（a667688；score 复用 `out/e04-score-loop-48k.wav` 1560 s、48 kHz）
- 成片: 1,050.07 s（17:30.07），−15 LUFS，TP −2 dBFS，31,502 帧，8 场；231 条旁白，语音 819.4 s（mean 3.55 s），字幕跨度 1.2→1047.88 s（speaking 900.3 s）
- 流水线: 8 段分开渲染（reused 0 / rendered 8）；musicGain −4.5 dB、ducked 54.4%、peak −1.23 dBFS；stem 门 full −25.1 / audible −27.88（share 63.1% / sub 6.8%）；mix 门 speech −23.72、gap_full −30.47、gap_audible −33.12、bed vs speech −9.4；flicker mean|d| 0.0217、p99 0.4692、max 11.69、cuts 7（3302/7417/11870/16644/20801/25617/29182）；231 cue 中 0 条换行、最长行 34 字（budget 34）；8 章；封面 frame 5609（186.97 s，problem 第二页：16×16 注意力矩阵对角 + 3.31e−2 / 1.46e−3 两张卡，字幕间隙帧）
- 卡点: ① JSX 属性里直接写 `sub="测试集 " + fmtF(...)` 非法（TS1003/TS1382），必须 `sub={"..." + ...}`；两处（intuition 页一、verification 页二）；② `Matrix` 16×16 用 cell=50/44 纵向溢出（16×(cell+6) 从 top 312 起 >1080），改 36；③ definitions 首页小标题 top 210 与 `SceneHead` 的 goal 行重叠 67%，改 246、公式 268→306；④ verification 真实窗页两行 `Row` 放在 top 560 落在卡片（312..732）内部，改 774；⑤ outro 四个 Stat 432 宽 + gap 24 = 1800 > 可用宽 1776，改 427 + gap 18；⑥ **提交 pack 后 make 的 content check 报 `content HEAD moved …; run sync`**——HEAD 变了 tree 哈希要重算，提交后必须再 sync 一次再 make（E10 首轮就死在这）；⑦ 生成器解析 `attention_softmax.csv` 的朴素版 NaN 写作字符串 `null`（`float('null')` 报错），改 `None if v=="null"`；⑧ 讲稿按 CPS 4.5 估 1112.03 s、实测 1050.08 s（−62 s），八个场景起点整体前移，still lint 帧与封面候选全部按实测时间轴重算
- 返工: 讲稿 231 行一次成型；stills 28 帧首轮 72 violations（矩阵溢出/标题重叠/卡片内 Row/outro 横向溢出）→ 两轮修完 PASS；make 一轮 PASS（首轮被 content check 挡下）；TTS 231 条一次过；封面在字幕间隙帧里实测取 5609
- 偏差: 计划 22–24 min，实做 17.50 min（−4.5 ~ −6.5 min）；28 页；旁白 231 条、语音 819.4 s；证据 31 条（26 手算 / 5 数据）；断言 32（AttentionSpec 四个分组），套件 672
- 备注: **ch02 九集全部完成**（E02–E10）；下一步 E11 `rnn-lstm-gru`。E04 bed 1560 s 仍够 E11（E10 实测 1050 s）

## E11 rnn-lstm-gru — 2026-10-31
- ts-base: ec7e3b7（SELF-AUTH A23/A24/A25 + errata E05 改「已核实」）→ 20ed99b（Rnn/Lstm/Gru 三模块 + 三个 Spec，断言 13/15/13 = +41，总套件 713）→ d353ef4（`data/episodes/11-rnn-lstm-gru` 延迟复制 sweep + 滞后自相关 + `app/Ch02RnnEvidence.hs`，22 条检查 = 17 手工 + 5 数据）→ 3d34f22（用含代码的提交重跑证据刷 provenance）
- ts-admin: f525b10（`inventory/scripts/export_ch11_returns.py`：120 只 × 250 日、30,000 行，2024-12-09–2025-12-31，前复权剔停牌，8 位小数）
- video_project: 172b60c（pack/scenes/script 243 行讲稿/生成器 + coverFrame 26851）→ **ac234fd**（本次 delivery 提交：cover.png 203,564 B / tsint-11.srt 21,267 B / chapters / film ready）
- 引擎: 无（a667688；score 复用 `out/e04-score-loop-48k.wav` 1560 s、48 kHz）
- 成片: 1,187.07 s（19:47.07），−15 LUFS，TP −2 dBFS，35,612 帧，8 场；243 条旁白，语音 945.6 s（mean 3.89 s），字幕跨度 1.2→1184.86 s（speaking 1030.6 s）
- 流水线: 8 段分开渲染（reused 0 / rendered 8）；musicGain −4.5 dB、ducked 56.3%、peak −1.13 dBFS；stem 门 full −25.1 / audible −27.88（share 63.1% / sub 6.8%）；mix 门 speech −23.61、gap_full −30.27、gap_audible −33.18；flicker mean|d| 0.0209、p99 0.4637、max 9.18、cuts 7（3901/8333/12415/17043/21645/28305/32804）；243 cue 中 5 条换行、最长行 34 字（budget 34）；8 章；封面 frame 26851（895.03 s，verification 判决表页：五个延迟 × 三个模型的命中率 + 随机基线/早停两张卡，字幕间隙 894.75–895.30 s）
- 卡点: ① `Row` 三列固定百分比在 570 宽卡片里把值列压到 135 px，长值（`0.5 / −0.3 / 0.2 / 0.7`、`σ(W_f x + U_f h + b_f)`）折 2–3 行并顶出卡底 → 改成柔性列（name 34%、value auto min 24%/max 54%、note flex），并新增竖排 `KV` 组件给窄卡片；② verification p3 右列两张 200 高卡（526 宽）内容折行压边框、`含义` 行落到卡外 → σ 拆成 LSTM/GRU 两行、卡高 236；③ definitions p2 `每门` 值 `12 × 8 + 12 × 12 + 12` 折行、errata 卡用 `Body`+`K` 层级失衡 → 值改 252（算式进 note）、errata 改 4 行 Row；④ implementation p1 三列 Row 注释被挤成 2–3 行；p2 三张 148 高 Stat（306+3×148+2×18=786）压到底部结论条（top 720）→ 高度 140 + valueSize 54 + 结论条移 776；⑤ intuition p2 LSTM 四门卡 470 高装不下 5 组公式 → 560（右卡同高）；⑥ outro p2 值「数据 / 预算 / 初始化」折三行出卡 → 改「三样都要」、明细进 note；⑦ **make 不带 `--score` 时 `render_music.mjs` 对 1188 s 单核跑 46 min 仍未完成**（卷积混响），kill 后按 E06–E10 惯例 `--score=out/e04-score-loop-48k.wav` 复用 1560 s bed，score 阶段秒过；⑧ 讲稿 CPS 4.5 估约 1100 s、实测 1187.07 s（+87 s），31 帧 lint 帧号与封面候选全部按实测时间轴重算
- 返工: 讲稿 241→243 行（两条 48 字超限拆分、四条短句加长）；stills 31 帧两轮（首轮 2 处 spill，次轮 6 类构图缺陷共 12 处）；make 两轮（首轮 score 卡死，二轮 PASS）；TTS 243 条一次过；封面在字幕间隙帧里取 26851
- 偏差: 计划 26 min，实做 19.78 min（−6.2 min）；31 页；旁白 243 条、语音 945.6 s；证据 22 条（17 手工 / 5 数据）；断言 41（Rnn 13 / Lstm 15 / Gru 13），套件 713
- 备注: ch02 十五集里已出 E02–E11（前十集）；下一步 E12。判决表口径：T=41、train 128/test 128、Adam(1e−2) batch 32、最多 40 轮、patience 8、seed 42；d=20 GRU 0.6094 略高于 LSTM 0.6016，d=40 LSTM 0.6172 最高、GRU 0.4531 在噪声内。E04 bed 1560 s 仍够 E12（E11 实测 1187 s）

## E12 conv-and-gcn — 2026-10-31
- ts-base: 63ccbe1（Conv/Gcn 两模块 + 两个 Spec，断言 34/29 = +63，总套件 776）→ b0da066（SELF-AUTH A26/A27 + errata E28）→ fdd3e25（node_features / sweeps / summary / `app/Ch02ConvGcnEvidence.hs`）→ b3d45e5（用含代码的提交重跑证据刷 provenance）
- ts-admin: 8b5eb10（`inventory/scripts/export_ch12_node_features.py`：50 只 × 300 个连续交易日，15,000 行，2024-10-14–2025-12-31，只导原始 OHLCV，8 维特征在 Haskell 侧算）
- video_project: fbea5f8（pack/scenes/script 240 行讲稿 + `build/generate_conv_data.py` + coverFrame 26490）→ **e8e0faf**（本次 delivery 提交：cover.png 141,958 B / tsint-12.srt 20,620 B / chapters / film ready）
- 引擎: 无（a667688；score 复用 `out/e04-score-loop-48k.wav` 1560 s、48 kHz）
- 成片: 1,117.53 s（18:37.53），−15 LUFS，TP −2 dBFS，33,526 帧，8 场；240 条旁白，语音 878.7 s（mean 3.66 s），字幕跨度 1.20→1115.34 s（speaking 962.8 s）
- 流水线: 8 段分开渲染（reused 0 / rendered 8，约 6 min）；musicGain −4.5 dB、ducked 54.5%、peak −1.62 dBFS；stem 门 full −25.1 / audible −27.88（share 63.1% / sub 6.8%）；mix 门 speech −23.98、gap_full −29.79、gap_audible −32.51、mix 1118.74 s；flicker mean|d| 0.0209、p99 0.4085、max 12.33、cuts 7（3750/8335/12267/16458/20931/26528/30767）；240 cue 中 0 条换行、最长行 33 字（budget 34）；8 章；封面 frame 26490（883.00 s，verification 合成任务曲线页：半径 1→25 的准确率折线 + 0.7760/0.5053/1.0000 三行）
- 卡点: ① make 的 typecheck 卡在 `Chip` 组件——场景里传了 `style={{ marginLeft: 18 }}`，而组件签名只有 `{children, color?}`（remotion still 不做类型检查，静帧全过、make 才炸）→ shared.tsx 给 Chip 加 `style?: React.CSSProperties` 并展开；② open 场三处书页引用原来写 p.44 / p.46，用 `pdftotext -layout` 核对式(2.48) 在 printed **p.31**、式(2.64) 在 printed **p.34**（PDF 页 ≈ 印刷页 + 8），三处全改；③ GCN 首版 13 个模型 `forkIO` 并行 + 300 轮 → 惰性 thunk 累积到 6.3 GB residency、EXIT=137 OOM，改串行 + 120 轮后每模型 50.5 s / 36.0 s、约 11 min 跑完；④ `Gr.matMul` 是矩阵×矩阵，谱性质要手写矩阵×向量；⑤ 自环陷阱旧口径写错（拿对角为 0 的 A 比两种传播子必然相同），改成先 `addSelfLoops` 再比，实测 1/6
- 返工: 讲稿 240 行（26/32/28/30/31/41/31/21；verification「四个都是负四」改了两轮——原先按 −4/−4/−3/−3 假设，实测核和为零 → 四个窗口全等）；stills 16 帧两轮（首轮 boundary 四张 Stat 总宽 1872 > 1776 右溢）；evidence 三轮（39→43→43 条，先修 `above/below` 方向、再修自环陷阱口径）；make 一轮 PASS（此前一轮在页码修复前主动 kill）
- 偏差: 计划 19 min，实做 18.63 min（−0.37 min）；讲稿 240 条（估 1144 s → 实测 1117.53 s）；证据 43 条（24 结构 + 19 结果，其中数据 7 条）；断言 63（Conv 34 / Gcn 29），套件 776
- 备注: ch02 十五集里的第 11 集（E12）；下一步 E13 normalization-trio。判决表口径：MLP 与 GCN 走同一代码路径，MLP 只是把传播子换成单位阵；真实收益上四种阈值差异都在 ±0.006 内（MLP 0.5005 / τ0.6 0.5031 / τ0.5 0.5038 / τ0.4 0.5021 / τ0.3 0.4981），cos 从 0.1833 涨到 0.6859 —— 图越大嵌入越同化，但这批数据没有可学的图结构；合成任务才看得出方向（半径 1 → 25：0.7760 → 0.5053，cos → 1.0000）。证据重跑只在 `sec` 列有差异，判据与准确率逐位一致（当确定性自检用）。`report.json` 的 `content.commit` 是 fbea5f8、`dirty=4`，因为封面/字幕在该提交之后生成

## E13 normalization-trio — 2026-10-31
- ts-base: da3ebe5（Revin/Dain/San 三模块 + 三个 Spec，断言 13/15/14 = +42，总套件 818 断言 / 55 套）→ e60ece2（`app/Ch02NormEvidence.hs` + SELF-AUTH A28–A30 + errata E03「已核实」、E04 页码 30→20）→ 8dc84ca（`data/episodes/13-normalization-trio` 全量产物 + `inventory/evidence/ch2-normalization/ch2-normalization.json` + 按 printed 页修正 SELF-AUTH/errata）
- ts-admin: 0759d34（`inventory/scripts/export_ch13_norm_windows.py`：120 只 × 250 个连续交易日 = 30,000 行，2024-12-23–2025-12-31，日历取 sh600519 末 250 日、15 只因缺口被剔，CSV 880,132 B；manifest 记 lake commit 8b5eb10）
- video_project: 649d66f（pack/scenes/script 225 行讲稿/narration/plan + coverFrame 3063）→ 6b69396（首版 delivery）→ d82c840（DAIN 门改乘法、删掉「书里说十二/四十四参数」、重录 1 clip）→ **86839ee**（本次重渲染 delivery：srt/ffmeta 因总长 879.44→879.63 s 各改 27 行）
- 引擎: 无（a667688；score 复用 `out/e04-score-loop-48k.wav` 1560 s、48 kHz）
- 成片: 879.63 s（14:39.63），−15 LUFS，TP −2 dBFS，26,389 帧，8 场 23 页；225 条旁白，语音 734.6 s（mean 3.26 s），字幕跨度 1.200→877.43 s（speaking 813.2 s）；mp4 40,127,327 B、cover.png 146,276 B、tsint-13.srt 17,678 B
- 流水线: 8 段分开渲染（reused 0 / rendered 8）；musicGain −4.5 dB、ducked 56.8%、peak −1.13 dBFS；stem 门 full −25.1 / audible −27.88（share 63.1% / sub 6.8%）；mix 门 speech −23.55、gap_full −31.05、gap_audible −33.79；flicker mean|d| 0.0155、p99 0.1175、max 9.77、cuts 7（3081/6497/10236/13985/17431/21507/24917）；225 cue 无一换行、最长行 32 字（budget 34）；8 章；封面 frame 3063（102.10 s，open 末页「四个数，先钉在墙上」四张数字卡、无字幕）
- 卡点: ① 照抄式(2.7) 是恒等层（字面版与输入最大差 **1.42e−14**，正确实现 |X'−X| 最大 **78.74**，差约 16 个数量级）；② DAIN 的门在书里是**乘法** ⊙γ（γ = sigm(W_c c̄ + d)，c̄ 是归一化后序列的均值），首版画面写成插值 `g*c + (1−g)*x`，与书和 `Dain.hs` 都不符——静帧看不出来，只有回书逐字核对才抓到；③ 旁白/画面写「书里说十二参数 / 四十四参数」是编造：book.txt 搜 twelve/十二/四十四 全零命中，12 与 44 都是本仓参数化（特征扩成 [mu, sd, 末值]、MLP 2→8→2）；④ 书页按 **printed 页**核对（式(2.6)(2.7) 在 p.20、式(2.8)–(2.12) 在 p.21；PDF 页 = printed + 8），errata E04 原写 p.30 是 PDF 页；⑤ 停牌段 ≠ 零 sigma：数据剔停牌（无行），只有常数窗口才有零 sigma，旁白与 boundary 卡同步改；⑥ make 的 content check 要求先 commit（649d66f）再 sync；⑦ 修正后 1 条 clip 重录 → 总长 879.44→879.63 s，交付需整体重渲染（srt/ffmeta 各 27 行、封面字节不变）
- 返工: 讲稿 178→210→225 行（每场末追加；超 900 s 预算删 5 行、改写 7 行原地替换并删旧 clip）；stills 18 帧首轮抓 3 处溢出（intuition 三卡 300、verification 中卡 340、boundary 数据卡 300）+ 3 处文案，修正后 3 帧复核 PASS；证据 24 检查 0 失败（重跑一次刷 provenance，18.98 s）；make 两轮（首轮 PASS → 发现门错误 → 修正后二轮 PASS）
- 偏差: 计划 16 min，实做 14.66 min（−1.34 min）；23 页；旁白 225 条、语音 734.6 s；证据 24 条（6 数据 / 16 结构 / 2 行为）；断言 42（Revin 13 / Dain 15 / San 14），套件 55、总断言 818
- 备注: ch02 第十二集（tsint 全系列第 23 部成片）；下一步 E14 `nonstationary-attention`。E13 冻结口径：RevIN 存 (mu, sigma)、前向 `(X−mu)/(max |sigma| eps)`、反向用同一份统计量（eps=0 时与 Z-score 逐位相同）；DAIN 三组映射 + 乘法门、eps 取绝对值下界、`dcUseGate=False` 用于桥接；SAN τ=25、M=10、残片丢弃、只训第一阶段（统计量预测），第二阶段留给后续集。诚实结论：SAN 第一阶段**输给**「沿用上一片」基线（mu 3.64×、sigma 1.51×），片内 sigma 平均只有整段 sigma 的 0.3923 —— 画面与检查口径都按「误差同量级」写，不伪装胜利。E04 bed 1560 s 仍够 E14（约 15 min）

## E14 nonstationary-attention — 2026-10-31

- ts-base: `608c181`（算法 NonstatAttn）+ `76d79ea`（证据 ch2-nonstat-attn，SELF-AUTH A31）；断言 15，套件 56，总断言 833
- ts-admin: `cd99f71`（60 票 × 60 日 attention 窗口，3600 行；CSV 105,540 B；窗口 2025-10-09..2025-12-31）
- video_project: `085d0c6`（pack 源）+ `090e56b`（delivery：cover.png / tsint-14.srt / chapters）；讲稿 199 行、coverFrame 2880
- 引擎: `a667688`（未变）；score 复用 `out/e04-score-loop-48k.wav`（1560 s 48 kHz）
- 成片: 749.07 s（12:29.07）/ 22,472 帧 / 8 场 / −15 LUFS / TP −2 dBFS / 199 条旁白（语音 617.8 s，mean 3.10 s）/ 字幕跨度 00:00:01,200→00:12:26,840（speaking 687.4 s）/ mp4 35,471,621 B / cover.png 146,024 B / srt 15,045 B
- 流水线: 8 段 rendered 8；musicGain −4.5 dB、ducked 54.8%、peak −1.03 dBFS、rms −26.42；stem 门 full −25.1 / audible −27.88（share 63.1% / sub 6.8%）；mix 门 speech −23.14、gap_full −30.7、gap_audible −33.56、bed_contribution 36.4；flicker mean|d| 0.0181、p99 0.2007、max 9.95、cuts 7（2894/5754/9260/12135/15111/18379/20961）；199 cue 无一换行、最长 34 字（budget 34）；8 章；封面 frame 2880（96.00 s，open 末页「四个数，先钉在墙上」四张数字卡、无字幕）
- 卡点: ① TTS 实测比 CPS 估算短 79 s（829.24→750.58 s），`Pages at` 分数按估算写、实际切页略偏，复核改用页中段帧；② stills 抓到 3 处：outro 回扣卡 150 高装不下 3 行 Row（被「下一集」压住）、implementation P2 标签 `τ=2 vs 温度 0.5` 折行、definitions P4「把 1Δᵀ/√dk 并进 Δ / 吸收根号 dk」是错误等价说法（书里 Δ 就是加在 logits 上，τ=1 逐位相同）→ 改画面 + 重录 1 条 clip；③ make 首轮 `content HEAD moved (864f866 -> 085d0c6); run sync`，提交后必须再 sync；④ 不带 `--score=` 时 render_music 生成 750 s bed 20 min 未出文件 → kill，复用 e04 bed
- 返工: stills 两轮（首轮 18 帧 → 修 3 处 → 复核 PASS）；1 条 clip 重录导致总长 750.58 s 并整体重渲染；make 两轮
- 偏差: 计划 14 min，实做 12.49 min（−1.51 min）；199 条旁白；证据 21 条（6 数据 / 15 结构）；断言 15，套件 56、总断言 833
- 备注: ch02 第十三集（tsint 全系列第 24 部成片）；下一步 E15 `imputation-dtw-lowrank-mf`。E14 冻结口径：τ 乘在 QKᵀ 上**逐位等于**把 softmax 温度改成 1/τ（τ=2 vs temp=0.5 实测 maxdiff 0.0，不是近似）；Δ 以 1Δᵀ 按列加才是新自由度，按行加被整行归一化吃掉（raw 版只差 1.665e−16、中心差分恰 0.0）；本仓 Δ 直接加在 logits 上，τ=1 时与书中逐位相同、不用缩放；不训练 τ/Δ。诚实结论：真实 A 股窗口三段本来就均衡（34.99/33.65/31.36%、最大差 3.63 pp），没有合成数据那种位置偏置可纠，Δ 探针只是把均匀变尖（熵 3.5592→3.0885）——「机制存在」不等于「这份数据有那个问题」。

## E15 imputation-dtw-lowrank-mf — 2026-10-31

- ts-base: `1069b9c`（算法 DtwKnn / LowRank / MatrixFactorization）+ `3a3ebfe`（证据 ch2-impute-3ways，SELF-AUTH A32、errata E29）+ `ca0697f`（A32 补记低秩初值与填 0 对照）；断言 47，套件 59，总断言 880
- ts-admin: `7e041ee`（100 只沪市主板 × 250 交易日面板，panel.csv 251 行 × 101 列、211,044 B、2024-12-20..2025-12-31、sh600000..sh600143）
- video_project: `516101d`（pack 源）+ `e8b23a3`（派生数据不入 git）+ `42f9d37`（plan 冻结 + outro 导入修复）+ `7cc0f3f`（页硬切 / 玩具表 NaN）+ `0c4bc04`（页重排回旁白 + 恢复交叉淡变）+ `fefcb71`（delivery：cover.png / tsint-15.srt / chapters）；讲稿 238 行、coverFrame 3000
- 引擎: `a667688`（未变）；score 复用 `out/e04-score-loop-48k.wav`（1560 s 48 kHz）
- 成片: 827.47 s（13:47.47）/ 24,824 帧 / 8 场 26 页 / −15 LUFS / TP −2 dBFS / 238 条旁白（语音 758.8 s，mean 3.19 s）/ 字幕跨度 00:00:01,200→00:13:45,270 / mp4 39,228,616 B / cover.png 139,424 B / srt 17,071 B / chapters 390 B
- 流水线: 8 段 rendered 8；musicGain −4.5 dB、ducked 53.4%、peak −1.5 dBFS、rms −26.99；stem 门 full −25.1 / audible −27.88（share 63.1% / sub 6.8%）；mix 门 speech −23.75、gap_full −29.86、gap_audible −32.69、bed_contribution 37.3；flicker mean|d| 0.0192、p99 0.3112、max 10.42、cuts 7（3256/6441/10387/13784/16804/21110/23581）；238 cue 无一换行、最长 27 字（budget 34）；8 章；封面 frame 3000（100.00 s，open 末页四数卡、散文句间隙无字幕）
- 卡点: ① 页间硬切触发 flicker gate（f11101 luma 15.5、f12086 13.7，阈值 12）→ 恢复 12 帧交叉淡变，并把 make 的 still 采样帧（总长 ×0.1/0.45/0.8 = 2482/11171/19859）让到页中段，重排全部 `Pages at` 分数对齐旁白（open 0.31/0.47/0.62、problem 0.54/0.75、definitions 0.47/0.565/0.75、intuition 0.13/0.40/0.79、implementation 0.385/0.90、verification 0.25/0.42/0.76、boundary 0.82、outro 0.33）；② still lint f2482 落在 open P3→P4 淡变里出 11 条 overlap（limit 25%）；③ intuition P1 三乘三玩具表在缺列另两格渲染出 `NaN`（rows 改为 `[[0.62,-0.31,NaN],[0.18,0.44,0.03],[-0.55,0.09,-0.21]]`）；④ verification P3 第四行「矩阵分解」被卡片底边裁掉（Card 300→336、Bars rowH 66→60）；⑤ make 的 derived check 要求 `data/impute.json` 不入 git（`git rm --cached` + `.gitignore` 加 `**/data/impute.json`）；⑥ `outro.tsx` 误从 `shared` 引 `FT`（未导出）→ typecheck TS2459；⑦ implementation P2「收敛慢两个数量级」是未登记数字 → 画面改「明显更慢」，同时给 A32 补记「低秩初值取该列观测均值」这条决定
- 返工: stills 三轮（4 帧 lint + 8 帧页中段复核）；3 次整体重渲染（硬切 / 页重排 / 文案收敛）；make 4 轮（首轮 still lint 失败、次轮 flicker gate 失败、三轮 PASS 后因文案改一处再跑一轮定稿）
- 偏差: 计划 27 min，实做 13.79 min（−13.2 min）；238 条旁白；证据 24 条（5 数据 / 6 结构 / 13 行为）；断言 47，套件 59、总断言 880
- 备注: ch02 第十四集（tsint 全系列第 25 部成片）；下一步 E16 `correlation-and-stl`。E15 冻结口径：三法都是矩阵补全、同一面板同一掩码集合（各恰好 5000 格 = 20%，随机 / 块状 10 列整段 2500 格 + 2500 随机）；DTW 带宽 ⌈0.1T⌉、KNN 等权只排序、低秩只在 Ω 上算残差、MF 按 `X ≈ X̂F` 实现（勘误 E29）；诚实结论：真实收益面板不低秩（随机掩码 KNN 0.0193 < 列均值 0.0213 < 低秩 0.0261 < MF 0.0312；块状 KNN 0.0186 < 列均值 0.0197 < 低秩 0.0234 < MF 0.0238），整列全缺时低秩恒补 0（相关 0.0 vs KNN 0.329），低秩只在合成秩三 / 秩二上精确（4.93e−9 / 6.49e−10）——「问题真实存在，低秩就是用不上」。

## E16 correlation-and-stl — 2026-10-31

- ts-base: `6f8d430`（算法 Correlation / Stl）+ `75a8a10`（面板与茅台数据）+ `31b99c5`（证据 ch2-corr-stl，22 checks）+ `aa7edea`（证据 JSON 转义修复）+ `234bee7`（SELF-AUTH 恢复 A30–A32 并冻结 A33/A34）；断言 37（corr 20 / stl 17），套件 61，总断言 917
- ts-admin: `40a8188`（100 只 × 251 日收盘价面板 211,044 B + 茅台 730 日；`inventory/scripts/export_ch02_corr_stl.py`）
- video_project: `8cefbc5`（pack 源）+ `15a7b3f`（讲稿收尾 + lines/voice）+ `27b7b02`（数字口径修正：0.169 / 0.4045% / n=400）+ `2e1e206`（delivery：cover.png / tsint-16.srt / chapters）；讲稿 211 行、coverFrame 2892
- 引擎: `a667688`（未变）；score 复用 `out/e04-score-loop-48k.wav`（1560 s 48 kHz）
- 成片: 804.8 s（13:24.8）/ 24,144 帧 / 8 场 22 页 / −15 LUFS / TP −2 dBFS / 211 条旁白（语音 667.2 s，mean 3.16 s）/ 字幕跨度 00:00:01,200→00:13:22,610（speaking 741.1 s）/ mp4 38,711,400 B / cover.png 165,391 B / srt 16,155 B / chapters 367 B
- 流水线: 8 段 rendered 8；musicGain −4.5 dB、ducked 55.5%、peak −1 dBFS、rms −26.67；stem 门 full −25.1 / audible −27.88（share 63.1% / sub 6.8%）；mix 门 speech −23.5、gap_full −30.55、gap_audible −33.2、bed_contribution 36.8；flicker mean|d| 0.0179、p99 0.2270、max 10.17、cuts 7（2922/6271/10033/13701/17024/20603/23123）；211 cue 无一换行、最长 28 字（budget 34）；8 章；封面 frame 2892（96.40 s，open 末页两句卡、无字幕）
- 卡点: ① `script.ts` 第 304 行裸 `;` 收尾（应 `];`）→ TS1137；② 引擎侧要 `data/voice.json` 占位（`{}`）否则 tsc 找不到 import；③ 0.166 只是最后一相位的剖面差，真值是 `0.1693263854`（逐相位 0.06025/0.00278/0.16932/0.03251/0.16639）→ 改画面 + 重录 2 条 clip；④ `ampPct` 是**季节振幅占均价**（0.4045290481%），原写法 `/100` 显示成 0.0040%；⑤ 测试 n=200/深内段 60–139 与证据 n=400/60–339 是两套规模，implementation P3 的 sub 曾错标；⑥ make 首轮 PASS 但 cover frame 180 带字幕 → 换 2892 重生成；⑦ publish 只写 `out/export`，交付 cover/srt/chapters 要拷回 pack `delivery/`
- 返工: stills 两轮（26 帧 → 修卡片高度、definitions P1 chips 压表、impl 采样帧 15894 落淡变改 16300 → 复核 10 帧）；2 条 clip 重录 + narration 重建（804.81 s 不变）；cover 两轮
- 偏差: 计划 20 min，实做 13.41 min（−6.6 min）；211 条旁白；证据 22 条（4 数据 / 4 结构 / 14 行为）；断言 37，套件 61、总断言 917
- 备注: ch02 第十五集（tsint 全系列第 26 部成片）；下一步 E17。E16 冻结口径：式(2.4) 四口径写死（配对完整、上三角 4950 对、总体方差 /K、算不出返回 Left 不返回 0）——价格读数 `1.0683759229` vs 收益 `1.2187852629`，方差差 9.6 倍而读数只差 0.1504（饱和项 0.8551→0.9826）；STL 书里**没有任何公式**，按 Cleveland 1990（L=5 → n_s=7 / n_t=11 / inner=2 / outer=0 / tricube / 端点局部线性）——茅台季节强度 `0.1596093732` vs 经典 `0.0083179375772`（19.2×），剖面逐相位最大差 0.169 元、季节振幅只有均价的 0.4045%；两条去趋势路径读数 `1.1927418917` / `1.2311591349`（差 0.0384）；诚实结论：**读数不是数据的属性、强度也不是数据的属性**，一个是数据加口径、一个是数据加方法。

## E17 win-metrics-valselect — 2026-10-31

- ts-base: `a9d5eef`（算法 Window / Metrics / TrainLoss + 证据 ch3-win-metrics-valselect，SELF-AUTH A35–A37、errata E30–E32）+ `f77377e`（证据补 horizon_metrics / train_history 两张表）+ `2229df0`（端到端 demo 拆真 train/val 并刷新历史）；断言 28（window 10 / metrics 12 / trainloss 6），套件 64，总断言 945
- ts-admin: `5e63b2f`（600519 后复权 3,880 行 / 88,816 B / 2010-01-04..2025-12-31 / max_gap 11 d @2020-02-03；`inventory/scripts/export_ch03_win_metrics.py`）
- video_project: `bd93bd4`（pack 源：script/shared/scenes/composition/film.json/build）+ `a791b1f`（版式修复 + plan 冻结）+ `87e026c`（封面帧 3660）+ `a3e74c8`（delivery：cover.png / tsint-17.srt / chapters / ffmeta）；讲稿 225 行、coverFrame 3660
- 引擎: `a667688`（未变）；score 复用 `out/e04-score-loop-48k.wav`（1560 s 48 kHz）
- 成片: 837.2 s（13:57.2）/ 25,116 帧 / 8 场 27 页 / −15 LUFS / TP −2 dBFS / 225 条旁白（语音 692.2 s，mean 3.08 s）/ 字幕跨度 00:00:01,200→00:13:54,990（speaking 771.0 s）/ mp4 39,025,542 B / cover.png 165,184 B / srt 17,044 B / chapters 396 B / ffmeta 772 B
- 流水线: 25 个 stage 全 ok、8 段 rendered 8（segments reused 0）；musicGain −4.5 dB、ducked 54.8%、peak −1 dBFS、rms −27.12、peakBeforeLimit −0.57；stem 门 full −25.1 / audible −27.88（share 63.1% / sub 6.8%）；mix 门 speech −24、gap_full −30.85、gap_audible −33.63、bed_contribution 36.4；flicker mean|d| 0.0159、p99 0.1944、max 7.6、cuts 7（3692/7278/11603/14892/18115/21762/24041）；225 cue 无一换行、最长 28 字（budget 34）；8 章；封面 frame 3660（122.00 s，open 末页两句卡、字幕条已结束）
- 卡点: ① `LinePlot` 自动 8% 留白把价格轴拉到 **−738**、MAE 轴 **−40** → 加 `yMin`/`yMax`，价格 0..18,000、MAE 0..760；② 窄卡里 `Row` 名字折行把「没说」挤到名字后面 → 名字列 30%→36%、值列 `white-space: nowrap`，五条名字压到 6 字；③ 右栏 4 个 `Stat` 高 130 装不下 label+值+sub（实测约 150）→ 150 且 gap 16→12（implementation P3 / verification P4 各一处压边）；④ definitions P1 卡片 300 高装不下 Formula+3 行，正文溢出卡外 → 320 高、公式 20 px；⑤ verification P1「三段之和 3,475」原注「加两道 24 帧和零头」不成立，真差 286（48 帧空 + 238 个跨界窗口）→ 改成诚实口径；⑥ stills 首轮 27 帧是用**未 sync 的引擎旧副本**渲的（13 帧 sha256 与首轮逐字节相同才发现），sync 后重渲；⑦ make 首轮 PASS 但 cover frame 180 带字幕 → 换 3660 重新 publish 再跑一轮；publish 只写 `out/export`，交付 cover/srt/chapters 必须拷回 pack `delivery/`
- 返工: stills 两轮（27 帧 → 修 6 类 → 复核 13 帧）；封面两轮（180→3660，publish 单独重生成再整跑一轮 make）；make 两轮
- 偏差: 计划 20 min，实做 13.95 min（−6.05 min）；225 条旁白；证据 24 条（4 数据 / 4 结构 / 16 行为）；断言 28，套件 64、总断言 945
- 备注: ch03 第一集（tsint 全系列第 27 部成片）；下一步 E18 `norm-revin-now-mean`。E17 冻结口径：窗口数 `(T−off−H−F) div s + 1`（4th 参数是 offset 不是 gap，gap 属 `chronoSplit`，plan-vs-code 偏差记 A35；s=1 → 881、s=5 → 177，简报 176 漏 +1 记 E31）；切分 6:2:2 + 两边界各丢 gap=24 → 2,209 / 657 / 609（`splitRanges [[0,2328],[2352,776],[3152,728]]`，零泄漏；三段之和与总窗口差 286）；四指标照式(3.5)–(3.8)，MAPE 三策略（默认照书零值→Infinity / `MapeSkip` 25.0% / `MapeEps 1e-8` 3.33e9）都进画面；真实读数低段 `47.3317` / `5.0452%` vs 高段 `470.3713` / `4.2431%`（绝对量 9.94×、相对量 0.84×）——**两个指标对价段给出相反结论**，合成 add5 vs mul1.02 也是 MAE 选前者、MAPE 选后者；训练书里只有式(3.4)，本仓 Adam(1e−3)/batch 32/≤200 轮/patience 10/min_delta 1e−6，梯度相对误差 `1.4126803893e-11`，早停回第 7 轮、端到端 21 轮最优第 16 轮、36 参数（A37）；诚实结论：**指标不是尺子，是带选择的尺子**，MAPE 的零值处没有正确答数、只有三种明说的口径。