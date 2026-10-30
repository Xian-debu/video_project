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

