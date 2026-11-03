# 57-tokenization-trio - 把序列切成块：Patch、周期、分辨率前缀

> status: ready (produced) | 成片 1,075.70 s（17:55.7）/ 32,271 帧
> chapter: ch07 | runtime target: 16 min | algorithms: 3（Patch 嵌入 / 周期切片 / 分辨率前缀）

## Thesis

同一段 96 点序列，patch 长度取 8 / 16 / 32，得到 **12 / 6 / 3** 个 token——token 数与每块能容纳的最长周期成反比；p=16、步长 8 的重叠切分给出 **11** 个 token，边界点被两个 token 同时看到；合成正弦（周期 24）的自相关主峰是 **24**，正好切出 **4** 个完整周期 token；分辨率前缀给四档 512 / 256 / 128 / 64 各配一个 32 维前缀。三种切法都是无参数或近无参数的确定性变换，**不训练任何模型**；真实序列 000001.SZ 的 lag 24 自相关只有 0.4243 且没有局部峰，周期切法返回空、退化回固定 patch——这一集把「找不到周期」也写成一条合法的输出路径。

## Verification

看完能自己复现：① 96 点 → 12/6/3 个 token 的手算表（96÷8/16/32），三种长度合计 21；② 重叠切分 11 =(96−16)/8+1，每步重叠 8 点，比不重叠的 6 个多 5 个 token；③ 合成 sin(2πt/24) 的自相关在 lag 24 等于 1.0000，主峰 24，周期 token 数 4；④ 真实 512 点窗口 lag 24 = 0.4243、无局部峰，dominantPeriod 返回 Nothing，周期切片退化；⑤ DCT-II 投影矩阵正交，重构误差 **3.11e-15**、正交误差 **2.02e-15**，覆盖 96/96；⑥ 四档降采样长度 512/256/128/64、前缀维度 32、拼接长度 +1，最近档 3→2、6→4（平手取小）；⑦ 22 项证据检查四组全绿、50 条单测全绿。屏幕上必须出现：96、12/6/3、21、11、24、1.0000、0.4243、3.11e-15、2.02e-15、512/256/128/64、32、22/22、50。

## Data

- 合成序列：96 点，sin(2πt/24)，t=0..95；用于周期 24 与三种切法的可手算演示。
- 真实序列：`data/episode/token_series.csv`，000001.SZ 后复权日线最后 **512** 个非停牌交易日（2024-09-11 → 2026-10-28），两列 date / close_adj；首 1,084.352512、末 1,443.867263、最低 1,084.352512、最高 1,560.821717。
- 由 ts-admin `inventory/scripts/export_ch07_token.py` 从 `data/lake/bars_daily/year=*/part-000.parquet` 导出（列 code / trade_date / close / adj_factor / is_suspended，过滤 sz000001、非停牌，close×adj_factor）；sha256 `786b33e6e748c8c6baebfcaa8d77c1f79df447521f40ca324c5a3ee210a6237c`。

## Algorithms

- ch7-patch-embed — 多尺度 Patch 嵌入（TsBase.Algos.Ch07.PatchEmbed）：`PatchSpec {patchLen, patchStride}`、`splitPatches`、`projectionMatrix`（DCT-II 正交基 W[i][j]=sqrt(2/p)cos(π(i+0.5)j/p)，第 0 列 sqrt(1/p)）、`patchEmbed`（token=W·patch）、`reconstruct`（Wᵀz）、`multiScaleTokens`；默认长度 [8,16,32]，步长等于长度时不重叠。
- ch7-period-token — 周期化切片（TsBase.Algos.Ch07.PeriodToken）：`acf`（中心化、无偏，k/(n−k) 修正）、`cycleStrength`、`dominantPeriod`（lag 2..max，r≥0.3 且局部极大，取首个；正弦 lag 24 与 48 都是峰 → 24）、`periodCount` / `periodRemainder` / `periodTokens`（只取完整周期，余数丢弃，不补零）。
- ch7-res-prefix — 分辨率前缀（TsBase.Algos.Ch07.ResPrefix）：`downsample`（块均值、除不尽丢尾）、`downsampleCount`、`resolutionEmbedding`（sin(2π(r+1)(k+1)/d)）、`prefixTable`、`nearestResolution`（绝对差最小、平手取小）、`withPrefix` / `withResolutionPrefix`（拼接后长度 +1、位置编码整体偏移一位）。

## Delivery

- 成片 **1,075.70 s（17:55.7）/ 32,271 帧 / 8 场 35 页 / 350 条旁白 / 350 cue**；mp4 **51,747,860 B**，sha256 `7e0bac66f9f4293db106fe117709304ab89ac8314ecad18a1926795c094015ef`；cover.png **193,112 B**（frame 180 = 6.00 s）。
- 音量：mix 48 kHz / 1,076.9 s、peak −1.00 dBFS、RMS −27.25 dBFS、ducked 48.9%（4.5 dB）、musicGain −4.5 dB、fade 1.5 / 2.5；loudnorm in I −23.6 / TP −1.0 / LRA 3.7 → 目标 **−15 LUFS / TP −2.0**（Dynamic，+0.9 offset），ebur128 复核 **I −15.9 / TP −2.0 / LRA 2.3**。music gate：speech −23.76 / gap_full −31.24 / gap_audible −33.98 / bed 36.0。
- 字幕与章节：350 cue、**0 条换行**、最长 27 字符；字幕跨度 **00:00:01,200 → 00:17:53,500**，发声 987.0 s；8 章合计 1,075.70 s（首 00:00:00、末 00:15:56）。
- 闪烁：32,271 帧 mean **21.04** / min 14.32 / max 22.71 / mean|d| 0.0138 / p99 0.1054 / max 7.45；7 个切点 3,845 / 8,650 / 13,440 / 17,300 / 21,877 / 25,241 / 28,709；still_lint 4 帧 PASS。
- 流水线：23 stage 全 ok，8 段 rendered 8（reused 0），tree `2836635f1706321e`；score 复用 `out/e04-score-loop-48k.wav`（scoreReused false）；stem full_median −25.1 dB / audible −27.88 dB / audible_share 0.631 / sub_share 0.068。
- 讲稿：8 场 35 页 350 行；TTS 350 clips、实测语音 864.4 s、均值 2.47 s；narration.wav 1,075.7 s / 103,267,244 B（不入库）。
- 证据与测试：证据 22/22（data 4 / patch 7 / period 5 / prefix 6，<1 s）、单测 50 条（patch 17 / 周期 15 / 前缀 18）；三模块合计 433 行、证据程序 222 行。
- 复现：`node scripts/make.mjs --film tsint-57-tokenization-trio --score=out/e04-score-loop-48k.wav`；证据 `tsbase evidence-ch07-token --data data/episodes/57-tokenization-trio --out data/episodes/57-tokenization-trio --evidence inventory/evidence/57-tokenization-trio.ch7-token.json`。

## Deviations

- **D1（真实序列没有稳定周期 → 周期切法退化）**：000001.SZ 的 lag 24 自相关 0.4243、单调衰减、无局部峰，dominantPeriod 返回 Nothing；屏幕把退化当正式路径讲，合成正弦承担 24 的演示，两者不混着说。
- **D2（自相关必须无偏）**：有偏版本（除以 n 而非 n−k）把正弦 lag 24 压到 0.75，峰高与阈值都失真；实现按 k/(n−k) 修正后再归一化，lag 24 = 1.0000。
- **D3（书中未给具体算子）**：投影选 DCT-II（正交、逆即转置），阈值 0.3，四档分辨率 [1,2,4,8]，前缀维度 32，均为本集选择，写进偏差表并标注「书中未给」。
- **D4（前缀向量固定，不训练）**：书里的 e_r 是可学习向量；本集用固定的正弦编码，保持「三种切法都不训练」的单变量设定，可学版本留给后续。
- **D5（周期切片只取完整周期）**：余数直接丢弃、不补零（本数据余数 0）；补零会污染注意力，边界页写明。
- **D6（成片 17:55.7，超出 16 分钟目标 1:55.7）**：350 行讲稿实测语音 864.4 s，八场按 40/50/50/40/50/40/40/40 行分配；成片比 target 长 12%，不压缩场次，按实际时长标注 18 分钟。
- **D7（重叠切分的 token 覆盖重叠）**：重叠切分下 96 点被看不止一次，token 总数 11 不等于覆盖计数；屏幕用「覆盖同样是 96 点，只是被看了不止一次」区分。
