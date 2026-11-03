> **历史文档**：E58 已交付；当前 active 交接是 `docs/HANDOFF-SESSION-2026-11-04.md`，本文是该集记录。

# HANDOFF — E58《通道独立还是混合》交付与 E59 开工

> 交接时点：2026-11-04 凌晨（E58 成片 PASS、delivery/docs 已提交）
> 系列进度：tsint 74 集中已交付 **68 集**（E1–E58 按生产顺序；E58 为第 68 集）
> 本集结论：**相关谱给出答案，真实数据走 Hybrid 2**——6 通道、512 收益，mean|ρ| 0.5109、max 0.8401、effRank 2.4714、top3 87.3%；两个阈值都不过，round(2.4714)=2，token 96/16/32，注意力代价 294,912/8,192/32,768（比 36=6²）

## 1. 一句话现状

E58 已交付 tsint-58-channel-strategies：8 场 43 页、430 条旁白、成片 **20:35.3（1,235.33 s / 37,060 帧）**，mp4 61,063,007 B；24 项证据全绿（0.02 s）、29 条单测全绿；ts-base 三笔、ts-admin 一笔、video_project pack/plan/delivery/docs 四笔。下一集 E59《迷你基础模型》（59-mini-transformer，20 分钟，ch07 第三集）。

## 2. 三仓提交

| 仓 | HEAD | 本集提交 |
|---|---|---|
| ts-base | 2b608c5 | 31359a1 Ch07/ChannelMix.hs 269 行 + 29 条单测；45c1715 app/Ch07ChannelEvidence.hs 212 行 + Main/cabal + 数据与证据（24/24）；2b608c5 证据补 6×6 相关矩阵读数 |
| ts-admin | d2857a8 | export_ch07_channels.py：6 只 A 股后复权日线，内连接后 513 行（2024-09-10 → 2026-10-28） |
| video_project | f028d44 + 816bf80 + d6388a0 + docs | f028d44 content/pack（43 页 / 430 行 / film.json ready）；816bf80 plan 草稿 + musicGain −4.5 dB；d6388a0 delivery（cover / 430 条 srt / 8 章）；docs 提交（plan Delivery / SELF-AUTH A55 / 本文件 / production-log / STATUS / session handoff） |
| video-pipeline-blueprint | a667688（未改） | 无；score 复用 out/e04-score-loop-48k.wav |

## 3. 成片与流水线读数

- 成片：**1,235.33 s（20:35.3）/ 37,060 帧 / 8 场 43 页 / 430 条旁白 / 430 cue**；mp4 **61,063,007 B**，sha256 e8528fb76542a8395910bf28e71aa33b4edc9bec479074054cbb2d39f0ded0d8；cover.png **190,375 B**（frame 180 = 6.00 s）。
- 音量：mix 48 kHz / 1,236.53 s、peak **−1.10 dBFS**、RMS **−26.90 dBFS**、ducked **47.4%**（4.5 dB）、musicGain **−4.5 dB**、fade 1.5 / 2.5；loudnorm in I −23.4 / TP −1.2 / LRA 3.4 → out **−15.9 LUFS / TP −2.0 / LRA 2.3**（Dynamic，+0.9），ebur128 复核 **I −16.0 / TP −1.5 / LRA 2.3**。
- 字幕与章节：430 cue、**0 条换行**、最长 20 字符；字幕跨度 **00:00:01,200 → 00:20:33,130**，发声 1,132.3 s；8 章合计 1,235.33 s（首 00:00:00、末 00:18:17）。
- 闪烁：37,060 帧 mean **21.08** / min 14.56 / max 24.32 / mean|d| 0.0135 / p99 0.1306 / max 7.61；7 切点 4,648 / 9,913 / 15,277 / 19,564 / 24,674 / 28,792 / 32,927；still_lint 4 帧 PASS。
- 流水线：**23 stage 全 ok**；tree **fd5ab5b8e017de86**；第二次 make 复用 8 段（rendered 0，reused 8）；stem full_median −25.1 / audible −27.88 / audible_share 0.631 / sub_share 0.068；music gate speech −23.27 / gap_full −30.64 / gap_audible −33.31 / bed 36.7。
- 讲稿：8 场 43 页 430 行；TTS 430 clips、实测语音 **981.7 s**、均值 2.28 s；narration.wav 1,235.33 s / 118,591,724 B（不入库）。

## 4. 内容结构（8 场 43 页）

| 场 | 页 | 标题 | 关键读数 |
|---|---|---|---|
| open | 5 | 六条通道，三种策略 | 96/16/32；CI/CM/Hybrid；判据 mean|ρ| 与 effRank |
| problem | 6 | 六只股票，一条相关性 | 6×513→512、CI 96、CM 16、注意力账、阈值、四问 |
| definitions | 6 | 相关矩阵，谱与秩 | 6×6、特征值、effRank 公式、决策规则、token 三公式、代价公式 |
| metrics | 5 | 谱算出来，策略就定了 | top1 59.9%/top3 87.3%、effRank 2.4714 vs 4.0 vs 1.1662、Hybrid 2、合成两端、四结论 |
| implementation | 6 | 三个函数，一套判据 | ChannelMix 导出、standardize、Jacobi、decideStrategy、整数账、证据程序 |
| verification | 5 | 二十四项，五组 | 24/24、data+corr 10、谱 9、决策 3、token 2 |
| boundary | 5 | 只做选择题 | 单变量、数据有限、阈值边界、四个不能推、边界之内 |
| outro | 5 | 选完通道，再进模型 | 三句读数、交付清单、复现命令、三种策略、下一集迷你模型 |

## 5. 本集教训（E59 直接可用）

- **musicGain 必须显式写**：E58 film.json 的 audio 只写了 `music: null`，make 按 0 dB 混，gap 只比 speech 低 3.85 dB；补 `"musicGainDb": -4.5` 重混后 gap −30.64（低 7.4 dB）才与 E57 一致。复制 E57 模板时注意这一项。
- **检查分组必须对证据 JSON 数**：讲稿先写「谱七项、token 四项」，实际证据是 9/2；以 evidence JSON 为准改视频，不动 Haskell 与证据。
- **make 前内容仓必须干净**：`films check --strict` 把未跟踪的 delivery 产出也算 dirty；make 生成的 cover/srt/chapters 要先提交或移走，否则第二次 make 在 content check 直接失败。
- **重混可复用渲染段**：只改 film.json 音频参数、script 不变时，第二次 make 的 8 段全部 reused，2 分钟出片；不要为改混音重渲画面。
- **时间轴以 sync 后的运行时脚本为准**：与 E57 相同，先 films sync → 再 dump_script → 再算静帧页中点。
- **run_code 的 120 s deadline 会杀 TTS**：TTS 用 `node build/tts_narration.py` 的后台 job 或显式 timeoutMs=600000；make 一律后台 job。
- **窄值列/图表宽度**：ChannelStack 根 div 原先写死 360 导致标签被 flex 压成竖排；按 `54 + rowW + 24` 计算并给标签 flexShrink: 0。Row 值列 300 px 装不下 `mean|ρ| · effRank`，拆成 KV。

## 6. 偏差与边界

- D1 阈值 0.6 / 0.2 / effRank≤C/2 都是本集选择，不是书里的定理。
- D2 round(2.4714)=2 是取舍，取 3 也成立，选 2 因为更省位置。
- D3 六只股票、一段窗口，不能推广到全市场；四个不能推（换模型、换数据、下游更好、最优策略）。
- D4 合成 rho=0 / 0.9 只用于走通两个分支，不代替真实结论。
- D5 不做下游模型比较；只实现 token 计数与策略选择。
- D6 证据分组按实现 4/6/9/3/2，讲稿与页面同步。
- D7 成片 20:35.3，比 20 分钟 target 长 35 s，不压缩场次。

## 7. 下一步 E59

E59《一万个参数的「基础模型」：掩码重建 + 线性头 + 少样本》（**tsint-59-mini-foundation-loop**，24 分钟，ch07 第三集，依赖 E58）。三模块：ch7-mask-recon（MaskRecon，约 200 行）、ch7-flatten-head（FlattenHead，约 80 行）、ch7-shot-protocol（ShotProtocol，约 90 行）；验收画面必须出现 154 个掩码位置、65,856 个参数与 1,300 个线性头参数、k=0/5/10/100 四档 MAE 曲线。数据：000001.SZ 5000 个 512 点窗口（3000/1000/1000），少样本另取 20 只股票。E58 的 Hybrid 2 32 token 可作为输入接口的上下文，但 E59 主线是「预训练 + 线性头」最小闭环，不追精度。
