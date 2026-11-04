> 本集交接：E61 已交付；会话级交接见 `docs/HANDOFF-SESSION-2026-11-04.md`。

# HANDOFF — E61《不止一个数》交付与 E62 开工

> 交接时点：2026-11-04 夜（E61 成片 PASS、delivery/docs 已提交）
> 系列进度：tsint 74 集中已交付 **71 集**（E1–E61 按生产顺序；E61 为第 71 集）
> 本集结论：**分位线交叉可以零成本消掉，但不会提高精度**——9 条独立拟合的分位线在 728 个测试样本上交点 **881**（3.3616%），排序回填后归零，pinball 只变 **−0.2568%**；高斯头 95% 区间实测覆盖 **0.9240**，差在右尾。

## 1. 一句话现状

E61 已交付 tsint-61-probabilistic-heads：8 场 30 页、300 条旁白、成片 **19:54.87（1,194.87 s / 35,846 帧）**，mp4 63,742,098 B（63.7 MB）/ sha256 `1d06c001…e6e609`；18 项证据全绿（2.18 s）、28 条单测全绿；ts-base 一笔、ts-admin 一笔、video_project pack + delivery 两笔。下一集 E62《两种异常检测》（62-anomaly-two-ways，约 18 分钟，ch07 第六集），后端已完成 19/19（见 §7）。

## 2. 四仓提交

| 仓 | HEAD | 本集提交 |
|---|---|---|
| ts-base | ed20c13 | `673ca34` Pinball.hs 87 行 + QuantileRearrange.hs 52 行 + DistHead.hs 120 行 + 28 条单测 + Ch07ProbEvidence.hs 282 行 + Main/cabal/Spec + data/episodes/61-probabilistic-heads + inventory + SELF-AUTH A93/A94 |
| ts-admin | 379ea56 | `2c10fa3` export_ch07_prob.py：百分比对数收益 100·ln(c_t/c_{t-1})，6,599 行 + manifest |
| video_project | 453ab60 | `ae82538` pack 源 + 300 行讲稿 + 30 页 + dist + voice/clips + film.json ready；`453ab60` delivery（cover / 300 条 srt / 8 章 / assetsStatus complete / plan Delivery） |
| video-pipeline-blueprint | a667688（未改） | 无；score 用本集 `delivery/score.wav`（1,560 s，scoreReused false）；`.tmp-e61-stills.mjs` 已删 |

## 3. 成片与流水线读数

- 成片：**1,194.87 s（19:54.87）/ 35,846 帧 / 8 场 30 页 / 300 条旁白 / 300 cue**；mp4 63,742,098 B（63.7 MB）/ sha256 `1d06c001cdb1b7febada97a7e581889e2405a95aafa0c464374f20a416e6e609`；cover.png 218,621 B / sha256 `3f2d3874f16abeb486e8f13ef7af6a7cfa3abd5cd4cc0fa0d4d8d22435bc0510`（frame 180 = 6.00 s）。
- 音量：mix 48 kHz / 1,196.07 s、peak −1.00 dBFS（限幅前 −0.97）、RMS −26.61 dBFS、ducked **58.3%**（4.5 dB）、musicGain −4.5 dB、preGain 0.9963、fade 1.5 / 2.5；loudnorm out I **−15 LUFS** / TP **−2 dBFS**；music gate stem full_median −25.1 / audible −27.88 / share **0.631** / sub **0.068**、PASS；mix gate speech −23.57 / gap_full −30.58 / gap_audible −33.36 / bed 36.6、PASS。
- 字幕与章节：300 cue、00:00:01,200 → 00:19:52,670、**0 条换行**、最长 32 字符；8 章合计 1,194.87 s，首 00:00:00、末 00:18:08。
- 闪烁：35,846 帧 mean|d| **0.0141** / p99 0.1084 / max 7.89 / 7 个切点；still_lint 4 帧 PASS；30 页静帧逐页人工看。
- 流水线：**23 stage 全 ok**；tree `bfc9602f1479596d`；8 段全渲染、35,846 帧、复用 0。
- 讲稿：8 场 30 页 300 行；TTS 300 clips、实测语音 **1,010.11 s**、均值 **3.367 s**（min 1.704 / max 5.424）；narration.wav 1,194.87 s / 114,707,564 B（不入库）。

## 4. 内容结构（8 场 30 页）

| 场 | 页 | 标题 | 关键读数 |
|---|---|---|---|
| open | 4 | 不止一个数，换一个问法 | 9 条分位线、3.36% 交叉、0.0 排序后、0.9240 覆盖率；18/18、2.18 s |
| problem | 4 | 线会互相穿过 | 交叉四件事（宽度负、覆盖崩、少数样本、两条路）；三个问题交叉/代价/覆盖 |
| definitions | 4 | 损失、次序与分布 | pinball 不对称；分母 tau×n；交叉是对子计数（36×728=26,208）；排序回填 |
| metrics | 4 | 三点三六到零 | 6,599/1,219/400/728；881 → 0；0.726731→0.724864（−0.26%）；mu −0.0266 / sigma 2.1686 / 覆盖 0.9240 |
| implementation | 4 | 三个模块，二百五十九行 | 87+52+120、18 导出、28 单测、282 行证据；逐样本排序；dMu 符号 |
| verification | 4 | 十八项，二点二秒 | 五组 4/4/6/4；手工 3 个逆序对；黄金四值 0.9/0.1/0.1/0.9；NLL 锚点 0.9189 |
| boundary | 3 | 交叉率是设定的函数 | 3.36%/14.1%/0.0275%；覆盖差全在尾部；能说/不能说 |
| outro | 3 | 把输出摆正 | 回到开头问题；从分布到异常；数字复盘 + 三条复现命令 |

## 5. 证据与关键读数（ts-base 673ca34 后不变）

- 命令：`tsbase evidence-ch07-prob --data data/episodes/61-probabilistic-heads --out out/evidence-61 --evidence inventory/evidence`，**18/18、2.18 s**；分组 data 4 / pinball 4 / crossing 6 / dist 4。
- 口径：`returns_000001.csv` 6,599 行（1998-11-26 → 2026-10-28）；训练池 2015–2019 共 1,219 样本、少样本协议取 **400** 个拟合；测试 2020–2022 共 **728** 个；覆盖率取最后 500 天（2020-12-11 → 2022-12-30）；窗口 32（p = 33）、tau 0.1…0.9 共 9 条、岭 λ = 0.1、IRLS 25 轮。
- 交叉：**881 / 26,208 = 3.3616%**；排序后 **0 / 0.0000%**；每样本 9 个值不变（多重集保持）。
- 代价：pinball **0.726731 → 0.724864**（相对 **−0.2568%**，容差 2% 内）。
- 分布头：gaussian 矩估计 mu **−0.026562** / sigma **2.168555**；测试段 NLL **2.274503**；NLL 锚点 **0.918939**；95% 名义覆盖率 **0.9240**；5% 分位 −3.44 vs 高斯 −3.59，95% 分位 4.06 vs 3.54。
- 黄金值：0.9 / 0.1 / 0.1 / 0.9；tau=0.5 退化半绝对值；样本中位数最小化 MAE（1.666557 ≤ 1.724896）；解析梯度 vs 数值梯度 mu −2.136647 / raw −0.860855。
- 设定敏感性：窗口 64 → 交叉 **14.10%**；窗口 20 + 全量 1,155 → **0.0275%**。

## 6. 本集的决定与偏差

- **D1 交叉率不是单一常数**：3.36% 是窗口 32 + 400 少样本下的数；换窗口 64 到 14.1%、换全量到 0.03%。边界页并列三种设定。
- **D2 主结论带负结果**：排序消交叉几乎免费，但**不提升精度**；高斯头覆盖率低于名义值（0.924 vs 0.95）。
- **D3 用 400 个窗口（少样本协议）**：全量 1,155 会让九条线几乎平行、交叉率掉到万分之三，失去本集的观测对象。
- **D4 交叉计数分母是「tau 对子数 × 样本数」**（26,208 = 36 × 728）；检查里有一条手算 3 逆序对样例锁定口径。
- **D5 高斯头用矩估计**（`fitGaussianMoments`，n−1）而不是最大似然；mu/sigma/NLL 都来自矩估计。
- **D6 标准正态分位数用 Acklam 近似**（误差约 1.6e-9），未做覆盖率对 z 的敏感性扫描。
- **D7 计时口径**：2.18 s 含拟合与覆盖率统计；首版漏了惰性求值（耗时 0），用 `evaluate` 强制求值后才给出数字。
- **D8 不训练神经网络**：三模块纯函数 + 闭式/迭代拟合；编码器沿用 E60 的 512-64-512 结构但不重训。
- **D9 时长 19:54.87 超过 18 分钟 target**：按「讲清楚优先」不删行，plan.md 已登记。
- **D10 尾部页用 50 点分位曲线**（tau 0.01–0.99）而不是九点扇形：九点扇形看不出 0.9 与 0.95 之间的右尾跳变。

## 7. E62 已完成的直接线索

- 规格：docs/series-tsint-episodes.md「### E62」段，目录 `episodes/62-anomaly-two-ways/`，原文 p.184 §7.1.3，18 分钟，依赖 ar-vs-nar-decoding。
- ts-base `ed20c13`：PredAnomaly.hs（约 110 行）+ ReconAnomaly.hs（约 170 行）+ 24 条单测（11 / 13）+ app/Ch07AnomEvidence.hs 350 行 + Main/cabal/Spec + data/episodes/62-anomaly-two-ways（returns 6,599 行、manifest）+ inventory/evidence/62-anomaly-two-ways.ch7-anom.json + SELF-AUTH A95/A96。`10b3d90` 是模块提交，`ed20c13` 是数据与证据提交。
- 读数：**尖峰 F1 预测 0.7059 vs 重构 0.0714**；**漂移 F1 预测 0.0914 vs 重构 0.6199**；19/19、73.00 s；分组 data 4 / pred 5 / recon 5 / compare 5。
- 口径：拟合 2015–2017 共 732 窗、标定 2018–2019 共 487 窗、测试 2020–2022 共 728 点；全局标准化 mu 0.038331 / sd 2.038166（**不是窗口内**）；winLen 32、hidden 8、q 0.99、AE 200 轮 0.931890→0.650443、552 参数；预测阈值 3.446733、重构阈值 1.624461；12 个尖峰（±5–7σ）、3 段 60 点 2σ 梯形漂移。
- 数据：ts-admin `379ea56` export_ch07_anom.py。
- E62 内容包还没开始：film.json、build/script_spec.json、src/scenes 都还没有。

## 8. 本集踩过的坑（下一集直接用）

1. **TTS 必须在 script.ts 同步之后**：顺序反了会读到旧 script.ts，白跑 300 条 clip（E59 已踩，E61 未再踩，本条留作对照）。
2. **CJK 宽度**：Row name 列固定 190 px，valueW 240 只够 7 个中文字；超了 note 被挤成竖排并裁切（E60 教训，E61 的「三个模块 259 行」用了 valueW 380）。
3. **九点扇形讲不出尾部**：0.9 与 0.95 之间看不出右尾跳变，用 50 点分位曲线（D10）。
4. **分母写错是本集最容易犯的错**：pinball 平均的分母是 tau 数 × 样本数，漏了会大 9 倍；检查里放了手算锚点。
5. **单调性方向**：排序只能升序；写反时 `isMonotone` 单测立刻失败（E61 踩过）。
6. **gaussian 的 sigma 走 softplus**：raw 梯度要乘 sigmoid(raw)；数值梯度对照差 1e-9。
7. **证据计时**：惰性求值会让耗时读到 0，`evaluate` 关键读数后再计时（D7）。
8. **stills 批量脚本必须放引擎目录**：放 /tmp 会 `ERR_MODULE_NOT_FOUND: @remotion/bundler`。
9. **make 首轮被 content check 拦**：delivery 未跟踪也算 dirty，先提交 pack 再 make。
10. **run_code 默认 120 s deadline**：TTS / 批量 still / 长渲染全部改后台 job。

## 9. 下一步（接手即做）

1. E61 收尾：本次 docs 提交（本文件 / production-log / STATUS）；确认 `453ab60` 含 cover/srt/chapters。
2. E62 内容包：`episodes/62-anomaly-two-ways/` 从 E61 拷贝 build/{make_script.py,make_narration.py,tts_narration.py} + src/{shared.tsx,figs.tsx} 骨架，改 id 与数据形状（`DistData` → E62 的 pred/recon/compare 三组）；写 `build/make_dist_data.py` 读 evidence JSON + returns CSV。
3. E62 讲稿：约 30 页（8 场），主线「两种方法覆盖不同异常形态，不是替代关系」；必须出现的三个画面：两类异常 F1 对照表、552 参数自编码器实测、阈值 q 敏感性曲线。
4. 之后轮次：E63 GAF 与 MTF → E64 0.1% 参数微调（见 series-tsint-episodes.md）。
