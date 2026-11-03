# 第五十三集 · 平均能赢平均，赢不过最强

- **系列**：tsint（第 6 章 · 自动化模型设计，F4 自动集成）
- **slug**：ensemble-average-iter
- **成片**：1920×1080，8 场 32 页，320 行字幕，18:56
- **证据**：ts-base `evidence-ch06-ensemble`，28 项，8.9 s
- **状态**：ready

## Thesis

二十只股票、十个候选。等权平均的检验误差 10.1566，比十个候选各自的平均 11.2070 低 9.37%——降方差这一半成立。但它比按调参段选出的最强单模型 9.5498 高 6.35%，二十只股票零胜——替代挑选这一半不成立。计划的三条预言（等权低 3–8%、按残差调权会自伤、步长越大越糟）全部方向相反，照实报告。集成是保险，不是更强的模型。

## 读数（唯一数字源：data/episodes/53-ensemble-average-iter/summary.json）

| 项 | 值 |
|---|---|
| 平均单模型 mean_single | 11.2070 |
| 等权 equal | 10.1566 |
| 中位数 median | 9.6562 |
| 岭权重 fit | 9.6322（有效权重 2.1601） |
| 迭代 η=0.1 / 5 轮 | 9.5693 |
| 迭代 η=0.5 / 5 轮 | 9.5521 |
| 最强单模型 best_single | 9.5498 |
| oracle（检验段下界） | 9.5397 |
| 等权 vs 平均单模型 | −9.3727% |
| 等权 vs 最强单模型 | +6.3538%，0/20 胜 |
| 岭权重 vs 等权 | −5.1631%，20/20 改善 |
| 迭代 η=0.1 vs 等权 | −5.7824%，20/20 改善 |
| η=0.5 vs η=0.1 | −0.0172（更低） |
| 迭代曲线（η=0.1，1/3/5/10 轮） | 9.6296 / 9.5984 / 9.5693 / 9.5588 |
| 噪声：单变体平均 / 集成 / 干净单模型 | 16.7067 / 10.6134 / 9.6630 |
| 噪声偏离比 dev_ratio | 0.2649（计划 < 0.5，成立） |
| σ=0 退化偏差 | 0.0（< 1e-12） |
| 检查 | 28/28，8.9 s（data 4 / ensemble 6 / cv 7 / iter 6 / noise 5） |

## 数据

- `data/episodes/53-ensemble-average-iter/daily.csv`：20 只 HS300 行业分层股票，2015-01-01..2024-12-31 后复权日线，48,572 行，1,486,348 B（与 E50 同一份，sha256 一致）。
- 每只 2,412–2,431 根；按时间切 70% 训练 / 15% 调参 / 15% 检验，训练 1,688–1,701 根，调参与检验各 362–365 天。
- 十个候选：naive / drift30 / exp0.2 / exp0.5 / ar1 / ridge5-l1e-3 / ridge5-l1 / sar12 / sar5 / hmean5；参数只用训练段，单步预测用真实 past。
- 每只股票按调参段选一个冠军：naive 9、sar12 4、drift30 3、sar5 3、ar1 1。
- `manifest.json` 记录池来源（E50）、切分口径、逐只根数与 5 条偏差。

## 算法（ts-base）

1. `TsBase.Algos.Ch06.Ensemble`：weightedAvg（式 6.5，权重非负和 1）、medianEns（逐点中位）、fitWeights（约束岭回归 λ=1e-3，解 A⁻¹b 后投影单纯形；有效权重 1/Σw²）。
2. `TsBase.Algos.Ch06.NoiseAugEnsemble`：noisyVariants（LCG + Box-Muller，扰动幅度按序列标准差缩放，σ=0 逐元素复制）、noiseEnsemblePredict（等权平均）。
3. `TsBase.Algos.Ch06.IterEnsemble`：iterReweight（e_ens 与 e_i 的差乘 η 加到权重，截零归一化，返回剔除列表）。
- 单测 27 条：Ensemble 11、NoiseAug 8、IterEnsemble 8；全量 2,138 条断言。
- 证据程序 `app/Ch06EnsembleEvidence.hs`：28 项，8.9 s，输出 summary.json / checks.txt / inventory 证据。

## 边界

- 这一集只说明「十个候选、二十只股票、362–365 天检验」这一种情况；更大池子、强相关成员、负权重、其它损失都没有测。
- 等权能把方差平均掉，平均不掉偏差；池子里两个弱成员（15.06 / 16.30）会把均值往下拽。
- 挑选在这个池子里几乎免费：调参段选出的冠军离 oracle 只差 0.01。
- 集成是保险：它压小「挑错」的代价，代价是「挑对时」跑不过冠军。

## Deviations（计划 → 实测）

- **D1 等权低 3–8%**：未成立，实测比最强单模型高 6.35%（0/20 胜）。检查写成负结果并通过。
- **D2 按残差调权会自伤**：未成立，岭权重 20/20 改善（−5.16%），迭代 20/20 改善（−5.78%）。
- **D3 η 越大越糟、轮数越多越差**：未成立，η=0.5 比 0.1 低 0.0172，四档轮数单调下降（9.6296 → 9.5588）。
- **D4 噪声集成退化**：σ=0 时偏差 0.0，成立；集成比单变体平均低 6.09（dev_ratio 0.2649），但仍高于干净单模型 9.66。
- **D5 数据复用 E50 池**：20 只与 E50 完全相同，未重新分层抽样；检验段固定每只后 15%（与 E50 的 2022–2023 / 2024 切分口径不同，manifest 已注明）。

## Delivery

- **成片**：`delivery/Tsint53EnsembleAverageIter.mp4`，1,135.97 s（18:56），34,079 帧，54,057,947 B；tree `121eb49bb0d8980b`。
- **音量**：mix 48 kHz，峰值 −1.23 dBFS（前限制器同值），RMS −26.71 dBFS；loudnorm 输出 I = −15 LUFS、TP = −2 dBTP（ffmpeg 实测 −15.8 LUFS / −2.0 dBTP / LRA 2.5）。
- **混音闸门**：语音 −23.61、整段间隙 −30.61、可听带间隙 −33.37、床贡献 36.6 dB；duck 55.3%（4.5 dB），底线通过。
- **字幕**：`delivery/tsint-53.srt`，320 条 cue（0 条换行，最长 29 字），跨度 00:00:01,200 → 00:18:53,770，语音 1,052.6 s。
- **章节**：`delivery/tsint-53.chapters.txt`（408 B）+ `.chapters.ffmeta.txt`（785 B），8 章合计 1,135.96 s，首 00:00:00，末 00:16:37。
- **闪烁闸门**：frames 34,079，mean 20.30 / min 14.57 / max 22.44，mean|Δ| 0.0132，p99 0.1061，max 6.81，7 个场景硬切（4480, 8565, 12806, 17094, 21304, 25744, 29922）——PASS。
- **静帧**：3 帧（13166 / 23745 / 30522），still lint PASS（无出框、无压边、无溢出、无重叠）。
- **封面**：`delivery/cover.png`，frame 180（6.00 s），185,300 B；film.json `publish.coverFrame = 180`。
- **复现**：
  ```bash
  cd /root/video-pipeline-blueprint
  node scripts/films.mjs sync
  node scripts/make.mjs --film tsint-53-ensemble-average-iter \
    --score=out/e04-score-loop-48k.wav --still-frames=13166,23745,30522
  ```
- **报告**：`delivery/report.json`（23 stage 全 ok，pass true，content commit 0c1cbd7）。
