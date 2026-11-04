> 本集交接：E60 已交付；会话级交接见 `docs/HANDOFF-SESSION-2026-11-04.md`。

# HANDOFF — E60《一步一步还是一口气》交付与 E61 开工

> 交接时点：2026-11-04 夜（E60 成片 PASS、delivery/docs 待提交）
> 系列进度：tsint 74 集中已交付 **70 集**（E1–E60 按生产顺序；E60 为第 70 集）
> 本集结论：**两条解码路都没打赢基线**——197 个测试窗口上 20 步相对误差 AR **1.5647** / NAR **1.2932**（F=8 交叉、NAR 快 **15.71×**），但都大于 persistence 的 1.0；√F 的 4.47× 放大没有出现，误差是系统性偏差而不是独立噪声。

## 1. 一句话现状

E60 已交付 tsint-60-ar-vs-nar-decoding：8 场 30 页、300 条旁白、成片 **21:50.27（1,310.27 s / 39,308 帧）**，mp4 70,833,385 B（70.8 MB）/ sha256 `b57a01e…b611e`；18 项证据全绿（121.90 s）、18 条单测全绿；ts-base 三笔、ts-admin 一笔、video_project pack + delivery 两笔。下一集 E61《不止一个数：分位损失、分位线交叉与分布头》（61-probabilistic-heads，约 18 分钟，ch07 第五集），后端已完成 18/18（见 §7）。

## 2. 四仓提交

| 仓 | HEAD | 本集提交 |
|---|---|---|
| ts-base | 673ca34 | `19efa1a` Autoregressive.hs 83 行 + NonAutoregressive.hs 60 行 + 18 条单测；`5e8f810` Ch07DecodeEvidence.hs 421 行 + Main/cabal + 数据 + inventory（18/18）；`42b05f6` 计时三次取最小 + 口径修正 + 证据 JSON/checks/SELF-AUTH A92 |
| ts-admin | 2c10fa3 | `a6ad270` export_ch07_decode.py：000001.SZ 6,600 收盘 + 2020–2022 高波动段 728 点；`2c10fa3` 是 E61 的 export_ch07_prob.py（E60 之后进的） |
| video_project | ac3fbc0 | `d19f9f1` pack 源 + 300 行讲稿 + 30 页 + dist + voice/clips + film.json ready / musicGain −4.5；`ac3fbc0` delivery（cover / 300 条 srt / 8 章 / film.json assetsStatus complete / plan Delivery） |
| video-pipeline-blueprint | a667688（未改） | 无；score 复用 `out/e04-score-loop-48k.wav`（scoreReused false）；两个临时 stills 脚本已删 |

## 3. 成片与流水线读数

- 成片：**1,310.27 s（21:50.27）/ 39,308 帧 / 8 场 30 页 / 300 条旁白 / 300 cue**；mp4 70,833,385 B（70.8 MB）/ sha256 `b57a01e71a0e309109118da50532151eb5936bfb8fd5396cdcbd6c152d3b611e`；cover.png 191,527 B / sha256 `3cf095cc755a591a96d27943f961e42e731e71ba708be3473889175211808a1d`（frame 180 = 6.00 s）。
- 音量：mix 48 kHz / 1,311.45 s、peak −1.20 dBFS、RMS −26.66 dBFS、ducked **60.4%**（4.5 dB）、musicGain −4.5 dB、preGain 1.0000、fade 1.5 / 2.5；loudnorm out I **−15 LUFS** / TP **−2 dBFS**；music gate stem full_median −25.1 / audible −27.88 / share **0.631** / sub **0.068**、PASS；mix gate speech −23.73 / gap_full −30.51 / gap_audible −33.24 / bed 36.8、PASS。
- 字幕与章节：300 cue、00:00:01,200 → 00:21:48,050、**0 条换行**、最长 29 字符；8 章合计 1,310.25 s，首 00:00:00、末 00:19:56。
- 闪烁：39,308 帧 mean|d| **0.0150** / p99 0.1157 / max 10.16 / 7 个切点；still_lint 4 帧 PASS；30 页静帧逐页人工看。
- 流水线：**23 stage 全 ok**；tree `88fafef16c80fa5f`；8 段全渲染、39,308 帧、复用 0。
- 讲稿：8 场 30 页 300 行；TTS 300 clips、实测语音 **1,125.48 s**、均值 **3.75 s**（min 1.656 / max 5.76）；行跨度 1.20 → 1,308.05 s；narration.wav 1,310.25 s / 125,784,044 B（不入库）。

## 4. 内容结构（8 场 30 页）

| 场 | 页 | 标题 | 关键读数 |
|---|---|---|---|
| open | 4 | 一步一步，还是一口气 | 20 次前向 vs 1 次；1.5647 / 1.2932 / F=8 / 15.71×；197 窗、三条曲线 |
| problem | 4 | 二十步之后，误差在哪 | √F=4.47 上界直觉；三条预期；复制成本 20×512；验收 5× |
| definitions | 4 | 回灌、教师强制、一次输出 | 三个纯函数接口；pushWindow；66×20 → 1,320；恒等 MSE 0.0 |
| metrics | 4 | 相对误差与持久化基线 | rel = MAE/0.224299；MAE vs MSE；6,600/728/197 与 3,418/1,000；编码器 66,113 / val 0.2303 |
| implementation | 4 | 推进、闭式解与计时 | 143 行两模块（83+60）、18 单测、421 行证据；直连消融 6.98→1.1352；GC 三段计时 |
| verification | 4 | 122 秒，18/18 | 五组 4/5/4/2/3；曲线 F=8 交叉；确定性 idMse 0.0；曝光偏差 0.0762 / 0.3510 |
| boundary | 3 | 两条曲线都没打赢基线 | 都 >1；√F 没出现；四条偏差；能说/不能说 |
| outro | 3 | 从解码到分布 | 累积 vs 一次成形；下一集概率头；数字复盘 + 三条复现命令 |

## 5. 证据与关键读数（ts-base 42b05f6 后不变）

- 命令：`tsbase evidence-ch07-decode --data data/episodes/60-ar-vs-nar-decoding --out out/evidence-60 --evidence inventory/evidence`，**18/18、121.90 s**；分组 data 4 / ar 5 / nar 4 / timing 2 / curve 3。
- 口径：全集 6,600 行（1998-11-25 → 2026-10-28）；测试段 2020-01-02 → 2022-12-30 的 **728** 点（testStart 4949），切 512+20 得 **197** 窗；训练/验证只取 2020 前 4,949 点 → 4,418 窗，验证取最后 1,000 → **3,418 / 1,000 / 197**；编码器重训 66,113 参数、20 epoch、val **0.230266**、最佳 epoch 20。
- 主结果：F=1 AR/NAR 同为 **1.1352**；F=20 AR **1.5647** / NAR **1.2932**（AR 高 21%）；persistence 自身 MAE **0.224299**；**交叉点 F=8**（F≤6 差 <2%）。
- 曝光偏差：teacher **0.076236** / free **0.350959** / gap **0.2747**（≈4.6 倍）。
- 速度：197 窗上 AR 20 步 **0.368249 s** / NAR 一次 **0.023443 s** = **15.71×**（三次重复取最小值）。
- 恒等任务 idMse **0.0**；NAR 参数 **1,320**（计划 1,300）。

## 6. 本集的决定与偏差

- **D1 NAR 参数 1,300 → 1,320**：偏置并入最后一列，实算 (65+1+1)×20。
- **D2 主结论是负结果**：两个相对误差都 >1，打不过 persistence；不硬凑。
- **D3 √F 的 4.47× 没出现**：实测只差 21%，误差是系统性偏差；边界页明说。
- **D4 残差直连是最大设计决定**：不加时 AR 相对 6.98，加了才从 1.1352 起。
- **D5 NAR 逐地平线选 λ**（0.01/0.1/1/10/100/1000），共用 λ 已否决。
- **D6 计时口径**：三次重复取最小值、rotateBy 轮换工作集；重复运行间 ±7% 抖动，统一取最终一次 15.71×。
- **D7 检查分组按实现**：data 4 / ar 5 / nar 4 / timing 2 / curve 3；讲稿逐条对齐。
- **D8 时长 21:50 超过 16 分钟 target**：按用户「长度不限、讲清楚优先」，不删行，plan.md 已登记。

## 7. E61 已完成的直接线索

- 规格：docs/series-tsint-episodes.md 第 1093 行起「E61 · 不止一个数：分位损失、分位线交叉与分布头」，目录 `episodes/61-probabilistic-heads/`，原文 p.184（7.1.3），18 分钟。
- ts-base `673ca34`：Pinball.hs 87 行 + QuantileRearrange.hs 52 行 + DistHead.hs 120 行 + 28 条单测 + app/Ch07ProbEvidence.hs 282 行 + Main/cabal/Spec + data/episodes/61-probabilistic-heads（returns 6,599 行、manifest）+ inventory/evidence/61-probabilistic-heads.ch7-prob.json + SELF-AUTH A93/A94。
- 读数：交叉率 **3.3616% → 0.0000%**（881 逆序对 / 26,208 对子），pinball **0.726731 → 0.724864**（−0.2568%）；高斯头 mu −0.026562 / sigma 2.168555 / NLL 2.274503 / 95% 覆盖率 **0.9240**；18/18、2.18 s。
- 数据：ts-admin `2c10fa3` export_ch07_prob.py（百分比对数收益 100·ln(c_t/c_{t-1})，polars 只在 /root/venv-netbond/bin/python3）。
- E61 内容包还没开始：film.json、build/script_spec.json、src/scenes 都还没有。

## 8. 本集踩过的坑（下一集直接用）

1. **Haskell 惰性让计时失真**：`mapM (\_ -> timeIO x) [1..3]` 会被 GHC 提成共享 thunk，第二、三次测已算好的值；用 `rotateBy` 让工作量依赖 k（E60）。
2. **纯函数证据的 seconds 只量到写文件**：在 `t1 <- getCurrentTime` 前先 `evaluate` 关键读数（E61）。
3. **GC 记到下一段计时窗口**：首测 NAR 比 AR 慢（0.91×）；三段计时 + 预热修掉。
4. **加 `export { TOTAL, FPS }`**：引擎 films.generated.tsx 从 script 导入这两个名字，不导出就 TS2459。
5. **voice.json 必须放 pack 的 data/ 根**：sync 把 pack `data/` 整体映射成 engine `data/<film>/`，放子目录会 TS2307。
6. **stills 批量脚本必须放引擎目录**：放 /tmp 会 `ERR_MODULE_NOT_FOUND: @remotion/bundler`。
7. **Row 的 name 列固定 190 px**：`190 + valueW` 太大会把 note 挤成竖排并裁切；CJK 用 FT.lead 时 valueW 240 只够 7 字。
8. **ErrorHorizon 的纵轴是相对误差**：persistence 要画成 y=1.0 的横线，不能按 MAE 0.2243 画，否则虚线出图。
9. **反斜杠在 CodeBlock 行尾**：TS 里 `\` 会把下一行吃掉 → TS1002；命令拆成单行 + 注释行。
10. **edge-tts 每次 300 条会卡在一个 websocket 上**：进程无子进程、日志停在 synth n；本次改用 ffprobe 自己量 300 个 mp3 写 voice.json（`/tmp/e60_voice.py` 的思路），TTS 本体可重复用。

## 9. 下一步（接手即做）

1. E60 收尾：本次 docs 提交（SELF-AUTH A57 / 本文件 / production-log / STATUS）；确认 delivery 里被跟踪的 cover/srt/chapters 已进 `ac3fbc0`。
2. E61 内容包：`episodes/61-probabilistic-heads/` 从 E60 拷贝 build/{make_script.py,make_narration.py,tts_narration.py} + src/{shared.tsx,figs.tsx} 骨架，改 id 与数据形状（`DistData` → E61 的 crossing/pinball/dist 三组）；写 `build/make_dist_data.py` 读 evidence JSON + returns CSV。
3. E61 讲稿：30 页左右（8 场），主线「分位线必须单调是可零成本加上的约束」；必须出现的三个画面：黄金四值、交叉率 3.36%→0、NLL 0.9189 手算对照。
4. 之后轮次：E62 两种异常检测 → E63 GAF 与 MTF → E64 0.1% 参数微调（见 series-tsint-episodes.md）。
