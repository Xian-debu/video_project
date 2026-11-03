> **历史文档**：E57 已于 2026-11-04 交付；上手请先读 `docs/HANDOFF-SESSION-2026-11-04.md`（当前 active 交接），本文只作该集记录。

# HANDOFF — E57《把序列切成块》交付与 E58 开工

> 交接时点：2026-11-04 凌晨（E57 成片 PASS、delivery/ready/docs 已提交）
> 系列进度：tsint 74 集中已交付 **67 集**（E1–E57 按生产顺序；E57 为第 67 集）
> 本集结论：**三种切法都成立，token 数能手算，真实序列退化**——96 点 → 12/6/3 个 token、重叠 11、合成正弦 ACF 峰 24、真实序列 lag 24 仅 0.4243 且无局部峰

## 1. 一句话现状

E57 已交付 tsint-57-tokenization-trio：8 场 35 页、350 条旁白、成片 **17:55.7（1,075.70 s / 32,271 帧）**，mp4 51,747,860 B；22 项证据检查全绿（<1 s）、50 条单测全绿；ts-base 三笔、ts-admin 一笔、video_project 内容/交付/文档三笔。下一集 E58《通道独立还是混合：一个由相关性决定的选择题》（58-channel-strategies，20 分钟，ch07 第二集）。

## 2. 三仓提交

| 仓 | HEAD | 本集提交 |
|---|---|---|
| ts-base | 3d69344 | b214ad4 Ch07/PatchEmbed + PeriodToken + ResPrefix 三模块 + 50 条单测；78343c3 app/Ch07TokenizationEvidence.hs 222 行 + Main/cabal + inventory（22/22）；3d69344 第 57 集数据（token_series.csv 512 点、manifest/summary/checks） |
| ts-admin | 074e746 | export_ch07_token.py：000001.SZ 512 点后复权日线（polars 读 lake） |
| video_project | 6e77d7f + delivery + docs | 6e77d7f content/pack（35 页 / 350 行 / film.json ready）；本次 delivery（cover / 350 条 srt / 8 章）；本次 docs（plan + SELF-AUTH A54 + 本文件 + production-log + STATUS） |
| video-pipeline-blueprint | a667688（未改） | 无；score 复用 out/e04-score-loop-48k.wav |

## 3. 成片与流水线读数

- 成片：**1,075.70 s（17:55.7）/ 32,271 帧 / 8 场 35 页 / 350 条旁白 / 350 cue**；mp4 **51,747,860 B**，sha256 7e0bac66f9f4293db106fe117709304ab89ac8314ecad18a1926795c094015ef；cover.png **193,112 B**（frame 180 = 6.00 s）。
- 音量：mix 48 kHz / 1,076.9 s、peak **−1.00 dBFS**、RMS **−27.25 dBFS**、ducked **48.9%**（4.5 dB）、musicGain −4.5 dB、fade 1.5 / 2.5；loudnorm in I −23.6 / TP −1.0 / LRA 3.7 → 目标 −15 / −2（Dynamic，+0.9），ebur128 复核 **I −15.9 / TP −2.0 / LRA 2.3**。
- 字幕与章节：350 cue、**0 条换行**、最长 27 字符；字幕跨度 **00:00:01,200 → 00:17:53,500**，发声 987.0 s；8 章合计 1,075.70 s（首 00:00:00、末 00:15:56）。
- 闪烁：32,271 帧 mean **21.04** / min 14.32 / max 22.71 / mean|d| 0.0138 / p99 0.1054 / max 7.45；7 切点 3,845 / 8,650 / 13,440 / 17,300 / 21,877 / 25,241 / 28,709。
- 流水线：**23 stage 全 ok**，8 段 rendered 8（reused 0），tree **2836635f1706321e**；scoreReused false；stem full_median −25.1 dB / audible −27.88 dB / audible_share 0.631 / sub_share 0.068；music gate speech −23.76 / gap_full −31.24 / gap_audible −33.98 / bed 36.0；still_lint 4 帧 PASS。
- 讲稿：8 场 35 页 350 行；TTS 350 clips、实测语音 **864.4 s**、均值 2.47 s；narration.wav 1,075.7 s / 103,267,244 B（不入库）。

## 4. 内容结构（8 场 35 页）

| 场 | 页 | 标题 | 关键读数 |
|---|---|---|---|
| open | 4 | 三种切法，一套 token | 96 / 12/6/3 / 21 / 11 / 4 / 24；不训练、可手算、可复现 |
| problem | 5 | 九十六个点，三种切法 | 512→96 窗口、12/6/3 手算、11 重叠、ACF 24、512/256/128/64 |
| definitions | 5 | patch、周期、前缀 | DCT-II 正交与重构 3.11e-15、无偏 ACF、阀值 0.3、只取整周期、前缀 32 维 |
| metrics | 4 | 十二、六、三 | 重叠 11、真实 lag24 0.4243 无峰、四组结论 |
| implementation | 5 | 三个纯函数，五十条单测 | 三模块代码、证据程序 222 行、50 条单测黄金值 |
| verification | 4 | 二十二个检查，四组 | 22/22、patch 12 项读数、周期退化 PASS、前缀 6 项 |
| boundary | 4 | 十八分钟，只讲切法 | 单变量、真实周期弱、书中未给、四个不能推 |
| outro | 4 | 切完，再喂给模型 | 三句读数、交付清单、复现命令、下一集通道策略 |

## 5. 本集教训（E58 直接可用）

- **ACF 必须无偏**：k/(n−k) 修正后再归一化；有偏版本正弦 lag 24 只有 0.75，峰高与阈值都会失真。
- **时间轴以运行时脚本为准**：make_script 后先 dump 时引擎 voice.json 可能还是上一版（本集得 1,079.70 s，sync 后实为 1,075.70 s）。先 films sync，再 dump，再重建 narration，再算静帧页中点；否则字幕漂 4 s、页映射错位。
- **run_code 必须显式 timeoutMs=600000**：TTS 首跑被默认 120 s 杀掉（350 clip 已缓存，重跑补测 voice.json 即可）；make 用后台 job。
- **页中点静帧法**：帧 = round(((page首行 start + 下一页首行 start)/2) × 30)，最后一页用 scene end；改稿后只重渲受影响页。
- **窄值列换行**：Row 的 value 宽 300 px 装不下 `512 / 256 / 128 / 64`，改 `512 → 64` 并把明细放 note；前缀/周期这类长读数优先用 KV。
- **时长口径要回写标题**：成片 17:55.7 与「十六分钟」不符，改「十八分钟」并重录 boundary#5；下一集 20 分钟 target，出片后同样核对 title/chip/outro 的「比这一集多几分钟」。

## 6. 偏差与边界

- D1 真实序列无稳定周期：lag 24 = 0.4243、无局部峰，周期切法退化为固定 patch；24 的演示放合成正弦。
- D2 自相关无偏修正；D3 DCT-II / 阈值 0.3 / 四档 / 前缀 32 均为本集选择（书中未给）；D4 前缀向量固定不训练；D5 周期切片只取完整周期；D6 成片 17:55.7 超 target 1:55.7；D7 重叠切分覆盖仍 96 点但被看多次。

## 7. 下一步 E58

E58《通道独立还是混合：一个由相关性决定的选择题》（tsint-58-channel-strategies，20 分钟，ch07 第二集）。建议从「同一 96 点窗口、多变量序列」接：通道独立（每列一套参数）vs 通道混合（共享），判断依据是通道间相关性；数据可复用 000001.SZ 与合成多通道，先做 ts-base 模块 + 证据 + 50 条左右单测，再做 8 场 pack。
