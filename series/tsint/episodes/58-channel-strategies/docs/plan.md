# 58-channel-strategies - 通道独立还是混合：一个由相关性决定的选择题

> status: ready (produced) | 成片 1,235.33 s（20:35.3）/ 37,060 帧
> chapter: ch07 | runtime target: 20 min | algorithms: 1 个模块（相关 / 谱 / 决策 / token 账）

## Thesis

上一集把序列切成了 token。这一集多出六条通道：每条通道自己切（Channel Independent，CI），还是先把同一时刻的六个值拼起来再切（Channel Mixed，CM）？答案不是口味，而是由相关矩阵决定的选择题。六只 A 股、512 个对数收益：真实平均绝对相关 **0.5109**，最大 **0.8401**，六个特征值 **3.5953 / 1.0091 / 0.6312 / 0.3788 / 0.2467 / 0.1388**，有效秩 **2.4714**，前三个方向占 **87.3%**。两个阈值（0.6 / 0.2）都不过，落在中间地带，组数取 round(2.4714)=**2**——**Hybrid 2**，32 个 token。三档 token 数 **96 / 16 / 32**，注意力代价 **294,912 / 8,192 / 32,768**，比值 **36 = 6²**；Hybrid 2 比独立省 9 倍位置。全部是纯函数，**不训练任何模型**。

## Verification

看完能自己复现：① 6 只股票 × 513 收盘 → **512** 个对数收益，六列对齐、无缺失；② 6×6 相关矩阵：对角 1.0000（最大偏差 1.7e-15）、对称（偏差 0.0）、mean|ρ| 0.5109、max|ρ| 0.8401；③ Jacobi 特征分解：迹 6.0000、特征向量残差 8.9e-16、特征值降序；④ effRank=(Σλ)²/Σλ² = **2.4714**，top1=0.5992、top3=0.8726；⑤ 决策三分支：合成 ρ=0 → Independent（effRank 4.0000、top1 0.2500），合成 ρ=0.9 → Mixed（effRank 1.1662、top1 0.9250），真实数据 → Hybrid 2；⑥ token 账：CI=6×16=96、CM=16、Hybrid 2=2×16=32，注意力 96²×32=294,912 对 16²×32=8,192，比 36；⑦ 24 项证据检查五组全绿（0.02 s）、29 条单测全绿。屏幕上必须出现：6、512、0.5109、0.8401、3.5953/1.0091/0.6312/0.3788/0.2467/0.1388、2.4714、0.8726、96/16/32、294,912/8,192/32,768、36、24/24、29。

## Data

- `data/episode/channels.csv`：6 只 A 股（sz000001 平安、sz000002 万科、sz000858 五粮液、sh600000 浦发、sh600519 茅台、sh600036 招商）后复权日线，2024-09-10 → 2026-10-28，**513** 行收盘、**512** 个对数收益；列 date + 6 列，六列严格对齐、无缺失、无 NaN。sha256 `96451c4c787599b557657f207ce92593ee25133d38ddb28ec8a0c5bb59faa0a8`。
- 由 ts-admin `inventory/scripts/export_ch07_channels.py` 从 `data/lake/bars_daily/year=*/part-000.parquet` 导出（过滤停牌、close×adj_factor、内连接后取尾部 513 行）。
- 合成对照：`synthChannels c h rho seed` 生成两两相关精确等于 rho 的通道（z 与 e 各自 Gram-Schmidt 正交归一、样本 sd=1）；rho=0 与 rho=0.9 各 4 条、512 点。

## Algorithms

- ch7-channel-mix — 通道策略与谱（TsBase.Algos.Ch07.ChannelMix，269 行 / 18 导出）：`Strategy = ChannelIndependent | ChannelMixed | ChannelHybrid Int`；`standardize`（样本 sd，n−1）、`correlationMatrix`（标准化后点积/(n−1)，只算上三角、镜像）、`meanAbsCorr` / `maxAbsCorr`（非对角绝对值）、`jacobiEigen`（最大非对角旋转消元，≤100 次、off<1e-30 早停，特征值降序）、`effectiveRank`、`topShare`、`mixReconstructionError`、`decideStrategy`（0.6 / 0.2 / effRank≤C/2 三分支，Hybrid k=clip 1 C (round effRank)）、`ciTokenCount` / `cmTokenCount` / `hybridTokenCount` / `attentionCost` / `tokenSaving`、`synthChannels`。
- 证据程序 `app/Ch07ChannelEvidence.hs`（212 行）：读 CSV、算 512 个对数收益、标准化、6×6 相关、Jacobi 谱、决策与 token 账；24 项检查分 data 4 / corr 6 / spectrum 9 / decision 3 / token 2，写 evidence JSON + checks.txt + summary.json。

## Delivery

- 成片 **1,235.33 s（20:35.3）/ 37,060 帧 / 8 场 43 页 / 430 条旁白 / 430 cue**；mp4 **61,063,007 B**，sha256 e8528fb76542a8395910bf28e71aa33b4edc9bec479074054cbb2d39f0ded0d8；cover.png **190,375 B**（frame 180 = 6.00 s）。
- 音量：mix 48 kHz / 1,236.53 s、peak **−1.10 dBFS**、RMS **−26.90 dBFS**、ducked **47.4%**（4.5 dB）、musicGain **−4.5 dB**、fade 1.5 / 2.5；loudnorm in I −23.4 / TP −1.2 / LRA 3.4 → out **−15.9 LUFS / TP −2.0 / LRA 2.3**（Dynamic，+0.9），ebur128 复核 **I −16.0 / TP −1.5 / LRA 2.3**。
- 字幕与章节：430 cue、**0 条换行**、最长 20 字符；字幕跨度 **00:00:01,200 → 00:20:33,130**，发声 1,132.3 s；8 章合计 1,235.33 s（首 00:00:00、末 00:18:17）。
- 闪烁：37,060 帧 mean **21.08** / min 14.56 / max 24.32 / mean|d| 0.0135 / p99 0.1306 / max 7.61；7 切点 4,648 / 9,913 / 15,277 / 19,564 / 24,674 / 28,792 / 32,927；still_lint 4 帧 PASS。
- 流水线：23 stage 全 ok；tree **fd5ab5b8e017de86**；第二次 make 复用 8 段（rendered 0）；stem full_median −25.1 / audible −27.88 / audible_share 0.631 / sub_share 0.068；music gate speech −23.27 / gap_full −30.64 / gap_audible −33.31 / bed 36.7。
- 讲稿：8 场 43 页 430 行；TTS 430 clips、实测语音 **981.7 s**、均值 2.28 s；narration.wav 1,235.33 s / 118,591,724 B（不入库）。
- 证据与测试：证据 **24/24**（data 4 / corr 6 / spectrum 9 / decision 3 / token 2，0.02 s）、单测 **29** 条；模块 269 行、18 个导出、证据程序 212 行。
- 复现：`node scripts/make.mjs --film tsint-58-channel-strategies --score=out/e04-score-loop-48k.wav`；证据 `tsbase evidence-ch07-channel --data data/episodes/58-channel-strategies --out data/episodes/58-channel-strategies --evidence inventory/evidence/58-channel-strategies.ch7-channel.json`。

## Deviations

- **D1（阈值不是定理）**：0.6 / 0.2 / effRank≤C/2 都是本集选定的参数，不是书里的定理；写进代码与偏差表，换阈值结论可能变、流程不变。
- **D2（round(2.4714)=2 是取舍）**：取 3 也说得通；选 2 是因为更省位置（32 token，比独立省 9 倍），屏幕明说这也是一个选择。
- **D3（6 只股票、一段窗口，不能推广）**：相关性随行情漂移，这段窗口的结论只对这段数据成立；滚动窗口可以重算，本集只算一次，四个不能推：换模型、换数据、下游更好、最优策略。
- **D4（合成通道用于验证公式，不代替真实结论）**：rho=0 / 0.9 的合成序列两两相关精确，用来走通 Independent / Mixed 两个分支；真实数据走 Hybrid 2，两者不混着说。
- **D5（不做下游模型比较）**：三种策略只实现 token 计数与选择，不训练、不比较预测精度；单变量设定固定窗口、块长、维度。
- **D6（检查分组按实现落盘）**：证据 24 项分为 data 4 / corr 6 / spectrum 9 / decision 3 / token 2；讲稿按这个分组写（谱九项、token 两项），不按最初草稿的 7/4 拆。
- **D7（成片 20:35.3，超出 20 分钟目标 35 s）**：430 行讲稿实测语音 981.7 s，八场按 50/60/60/50/60/50/50/50 行分配；成片比 target 长 0.6%，标题与旁白保留「二十分钟」。
