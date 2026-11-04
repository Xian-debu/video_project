> 本集交接：E59 已交付；会话级交接见 `docs/HANDOFF-SESSION-2026-11-04.md`。

# HANDOFF — E59《一万个参数的「基础模型」》交付与 E60 开工

> 交接时点：2026-11-04 晚（E59 成片 PASS、delivery/docs 已提交）
> 系列进度：tsint 74 集中已交付 **69 集**（E1–E59 按生产顺序；E59 为第 69 集）
> 本集结论：**遮住三成只学形状**——154 个掩码位置、66,113 参数编码器、20 轮 64 秒；固定掩码损失比 0.2067、线性探测相对 MSE 0.1364（表示里有 86% 的方差），但收益头相对 MAE **1.0643**、跨 20 只股票 **1.0960**，计划书的 0.9 没有出现，按负结果讲。

## 1. 一句话现状

E59 已交付 tsint-59-mini-foundation-loop：8 场 50 页、500 条旁白、成片 **26:59.03（1,619.03 s / 48,571 帧）**，mp4 88,640,252 B（88.6 MB）/ sha256 d3b3626…9ab06；34 项证据全绿（102.15 s）、39 条单测全绿；ts-base 两笔、ts-admin 一笔、video_project pack 一笔 + delivery + docs。下一集 E60《一步一步还是一口气》（60-ar-vs-nar-decoding，16 分钟，ch07 第四集）。

## 2. 四仓提交

| 仓 | HEAD | 本集提交 |
|---|---|---|
| ts-base | 116b3ff | 95a1193 Ch07/MaskRecon.hs 552 行 + FlattenHead.hs 181 行 + ShotProtocol.hs 89 行 + 39 条单测；116b3ff app/Ch07MiniFoundationEvidence.hs 510 行 + Main/cabal + 数据 + inventory（34/34、102.15 s） |
| ts-admin | 862b9ed | export_ch07_minifoundation.py：000001.SZ 6,600 收盘 + 20 只股票 1,900 行对齐，polars 读 lake，写 CSV + manifest（sha256/rows） |
| video_project | adb837a + delivery + docs | adb837a content/pack（50 页 / 500 行 / film.json ready / musicGain −4.5）；delivery 提交（cover / 500 条 srt / 8 章）；docs 提交（plan Delivery / SELF-AUTH A56 / 本文件 / production-log / STATUS） |
| video-pipeline-blueprint | a667688（未改） | 无；score 复用 out/e04-score-loop-48k.wav |

## 3. 成片与流水线读数

- 成片：**1,619.03 s（26:59.03）/ 48,571 帧 / 8 场 50 页 / 500 条旁白 / 500 cue**；mp4 88,640,252 B（88.6 MB）/ sha256 d3b3626…9ab06；cover.png 221,449 B / sha256 963fcd8…481fe9（frame 180 = 6.00 s）。
- 音量：mix peak −1.00 dBFS、RMS −27.16 dBFS、ducked 53.4%、preGain 0.9585、1620.23 s；loudnorm in I=−23.66 LUFS / TP=−1.12 dBTP → out I=−15 LUFS / TP=−2 dBFS（linear，+0.8 LU target offset）；music gate speech −23.87、gap_full −30.64、gap_audible −33.55、bed contribution 36.5 dB、PASS。
- 字幕与章节：500 cue、00:00:01,200 → 00:26:56,820、speaking 1,503.3 s、0 条换行、最长 20 字符；8 章合计 1,619.03 s；8 章合计 1,619.03 s。
- 闪烁：mean|d| 0.0142、p99 0.1187、max 10.20、7 个切点、PASS；still_lint 4 帧 PASS。
- 流水线：**23 stage 全 ok**；tree 85e25d717f5309a1；8 段全渲染、48,571 帧、复用 0。
- 讲稿：8 场 50 页 500 行；TTS 500 clips、实测语音 **1,328.3 s**、均值 2.66 s；行跨度 1.20 → 1,616.82 s；narration.wav 1,619.03 s / 155,426,924 B（不入库）。

## 4. 内容结构（8 场 50 页）

| 场 | 页 | 标题 | 关键读数 |
|---|---|---|---|
| open | 6 | 没有标签，也能学表示 | 154/512、66,113、1,300、k=0/5/10/100；探测 0.1364 vs 收益 1.0643 vs 换股票 1.0960；34/34 |
| problem | 7 | 五百一十二个点，遮掉三成 | 6,600 收盘 / 5,000 窗口、512 隔离带、16 点整段、154=9×16+10、mask token 非零、参数账 66,113/65,856/1,300/67,413/33,280 |
| definitions | 7 | 掩码、编码器、展平头与协议 | 损失只算 M（空集返回 0）、maskSeq 签名、两层参数逐项、差 257 是记法、岭闭式、原始/对偶、shotSplit 三块 |
| metrics | 6 | 重建、相对 MAE 与信息量 | 验证重建 0.2407、目标 Δc/σ、rel=MAE/MAE_base、固定掩码损失比 0.2067、探测 33,280→0.1364、梯度 0.000000 |
| implementation | 7 | 掩码、反传、岭回归与协议 | 822 行三模块、先算账再抽段、前向/手写反传、Adam 3.2 s/轮、原始/对偶、段错误 139 定位、shotSplit 断言 |
| verification | 6 | 102 秒，34/34 | 八组 4/5/4/5/6/4/3/3、结构与参数、训练四看、头六项（含探测）、协议四条、曲线与跨股票 |
| boundary | 6 | 计划 0.9 没有出现：实测 1.0643 | 负结果定位、三个原因与标签重叠 19/20、探测强/预测弱反例、真基础模型缺五样、三个坑写成检查、能说/不能说 |
| outro | 5 | 预训练 → 冻结 → 线性头 → 少样本 | 一句话结论、下一集 AR vs NAR、数字卡、四条线都在 1 附近、三条复现命令 |

## 5. 本集教训（E60 直接可用）

- **掩码检查别把相邻段合并**：首版用 runsOf 合并连续 1，512 点里 6 段、最长 42，误判失败；正确口径是按 16 点段逐段统计（9 段 16、1 段 10、22 段 0）。
- **对偶路径返回维度必查**：fitRidge 对偶首版返回 n 维 X·α，调用方按 p 维 unsafeIndex 取，越界读直接 core dump（退出码 139、无异常、spec.log 只有 RUNNING/FAIL）。修复为先乘 Xᵀ 回 p 维；CI 不能只看框架的 FAIL 字样，要跑二进制看退出码。
- **参数账按实算上屏**：计划 65,856 vs 实算 66,113（差 257），总参数 66,956 vs 67,413（差 457）；偏差写进 docs/plan.md 与证据，不硬凑。
- **计划目标不可达就按负结果讲**：相对 MAE < 0.9 的验收线没有出现（1.0643 / 1.0960），不改证据、不改口径；用线性探测（0.1364）给正面结论，把「有信息」与「能预测」分开说。
- **非平稳副目标必须先查均值漂移**：曾试未来 20 天对数波动率作副目标，曲线看似改善（0.9539），但切分均值从 −0.1202 漂到 −0.3675，常数预测就有 0.5579，整段删除、不上屏。
- **TTS 前必须确认引擎里的 script.ts 是本集新生成的**：先 sync 后 make_script 会 dump 到上一集旧脚本，白跑 430 条 clip；正确顺序 make_script → sync → dump → TTS。
- **run_code 的 120 s 硬限时**：sleep 与批量 still 都会被 promote/杀；耗时操作一律 tools.bash({run_in_background:true}) 后用 job_output。
- **复制上一集骨架要清干净**：pack 里误拷的 Tsint58ChannelStrategies.tsx 与 E58 场景全部替换，避免 composition/entry 指向旧文件。

## 6. 偏差与边界

- D1 参数账：计划 65,856 / 66,956，实算 66,113 / 67,413（差 257 / 457），按实算上屏。
- D2 主结论是负结果：收益头 1.0643、跨股票 1.0960，计划 0.9 未出现。
- D3 成片 26:59 超过 24 分钟目标：500 行实测语音 1,328.3 s，用户允许长度不限，不删行。
- D4 目标定义与标签重叠：未来 20 天相邻窗口重合 19 天，有效样本远少于 5,000；画面明写。
- D5 新增线性探测为 head 第 6 项（33,280 参数，不计入 67,413）。
- D6 合成 AR(1) 用 phi=0.99 才让 20 轮降 50%（phi=0.9 只降 25%）；只验证训练实现。
- D7 证据分组按实现 4/5/4/5/6/4/3/3 = 34，讲稿逐条对齐。
- D8 154 = 9×16 + 10：9 段整遮 + 1 段前 10 点，不存在末段截断。
- D9 波动率副目标因均值漂移主导而否决，未上屏。

## 7. 下一步（E60）

- 目录 `series/tsint/episodes/60-ar-vs-nar-decoding`，slug `ar-vs-nar-decoding`，ch07 第四集，16 分钟，依赖 E59。
- 两个单元（以 `plans/PLAN.md` 与 `docs/series-tsint-episodes.md` 的 E60 节为准）：`ch7-ar-decode` / `TsBase.Algos.Ch07.Autoregressive`（约 110 行）、`ch7-nar-decode` / `Ch07.NonAutoregressive`（约 60 行）。
- 验收屏：copy-function 20 步 rollout 精确；误差-步数曲线带 √F 参考；AR/NAR 推理耗时比 ≥ 5×；数据 000001.SZ 2020–2022 高波动段，F = 1/5/20；书 p.183–184。
- 沿用流程：先读规格 → 模块+单测 → 数据 → 证据 → 视频 pack → sync/dump/TTS → 静帧 → make → delivery → docs → 四仓提交（SELF-AUTH 下一可用 **A57**；ts-base 下一可用 **A91**）。
