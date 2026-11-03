# HANDOFF — E56《先筛模型，再调权》交付与 E57 开工

> 交接时点：2026-11-03 深夜（E56 成片 PASS、delivery/ready 已提交，docs 正在提交）
> 系列进度：tsint 74 集中已交付 **66 集**（E1–E56 按生产顺序；E55 为第 65 集）
> 本集结论：**筛选成立，调权不成立**——GA 把检验 MAE 从 10.1566 压到 9.5721（5.75%），KR 调权只到 10.0322（对全池 +1.22%，对子集 −4.8%）

## 1. 一句话现状

E56 已交付 tsint-56-ensemble-ga-krr：8 场 40 页、400 条旁白、成片 **21:21.1（1,281.13 s / 38,434 帧）**，mp4 64,776,967 B；24 项证据检查全绿（48.2 s）；ts-base / video_project 两仓各三笔 + 内容/交付/ready 提交，工作区只剩本次 docs。下一集 E57《把序列切成块：Patch、周期、分辨率前缀》（57-tokenization-trio，16 分钟，ch07 第一集）。

## 2. 四仓提交

| 仓 | HEAD | 本集提交 |
|---|---|---|
| ts-base | 3a68c49 | 271990d Ch06/GaEnsemble 模块 + 17 条单测（GA 双目标、KRR、Pareto）；4d40253 app/Ch06GaEnsembleEvidence.hs 517 行 + Main/cabal + inventory JSON（24/24）；3a68c49 第 56 集数据（daily.csv 复用、manifest/summary/checks） |
| ts-admin | 1318010（未动） | 无——E56 复用 E53 的 daily.csv，未重新导出 |
| video_project | ed42c1a → 6fc8cf6 | 8d0cf0a content（40 页 / 400 行 / 21:21 / 24 项）；d9f0dc7 plan 草稿；ed42c1a delivery（cover / 400 cue srt / 8 章）；6fc8cf6 ready（coverFrame 180、assets complete）；本次 docs 提交 |
| video-pipeline-blueprint | a667688（未改） | 无；score 复用 out/e04-score-loop-48k.wav |

## 3. 成片与流水线读数

- 成片：**1,281.13 s（21:21.1）/ 38,434 帧 / 8 场 40 页 / 400 条旁白 / 400 cue**；mp4 **64,776,967 B**，sha256 14e7f77fc1c5a7152546ad138f9a08f263d121fed5fb4cdecd3b56a8217b2ae2；cover.png **188,421 B**（frame 180 = 6.00 s）。
- 音量：mix 48 kHz / 1,282.33 s、peak **−1.11 dBFS**、RMS **−26.88 dBFS**、ducked **51.4%**（4.5 dB）、musicGain −4.5 dB、fade 1.5 / 2.5；loudnorm in I −23.26 / TP −1.20 → 目标 −15 / −2（linear），ebur128 复核 **I −15.9 / TP −2.0 / LRA 2.4**。
- 字幕与章节：400 cue、**0 条换行**、最长 27 字符；字幕跨度 **00:00:01,200 → 00:21:18,930**，发声 1,183.3 s；8 章合计 1,281.13 s（首 00:00:00、末 00:18:47）。
- 闪烁：38,434 帧 mean **21.08** / min 14.66 / max 23.90 / mean|d| 0.0137 / p99 0.1064 / max 7.84；7 切点 4,885 / 9,905 / 14,923 / 19,606 / 24,389 / 29,003 / 33,813。
- 流水线：**23 stage 全 ok**，8 段 rendered 8（reused 0），tree b44f31b463ef6368；scoreReused false；stem full_median −25.1 dB / audible −27.88 dB / audible_share 0.631 / sub_share 0.068；music gate speech −23.44 / gap_full −30.73 / gap_audible −33.34 / bed 36.7；still_lint 4 帧 PASS。
- 讲稿：8 场 40 页 400 行；TTS 400 clips、实测语音 **1,043.4 s**、均值 2.61 s；narration.wav 1,281.13 s / 122,988,524 B（不入库）。

## 4. 内容结构（8 场 40 页）

| 场 | 页 | 标题 | 关键读数 |
|---|---|---|---|
| open | 5 | 先筛模型，再调权 | 候选 10 / 筛后 3.85 / 全池等权 10.1566 / KR 10.0322；三句结论 −5.75% / 1.22% / 24-24 |
| problem | 5 | 一千零二十四个子集，怎么挑 | 2^10 = 1,024、穷举 373,760 次预测、200 vs 1,024、双目标、365×365 核矩阵 4.86e7、70/15/15 |
| definitions | 5 | 个体、前沿、核方程 | 10 位 0/1、bias/variance 两组读数、Pareto 四点（前三个在前沿）、RBF 核、黄金值 0.875 六步 |
| metrics | 5 | 零点八七五，和五个误差 | 0.875 拆解、λ=0 插值 / λ=1e6 收缩、归一化选点 s、六个误差、两结论 |
| implementation | 5 | 两个算子，一套预算 | 三种数据结构、GA 算子、KR 代码、一只股票流水线、17 项单测 |
| verification | 5 | 二十四个检查，五组 | 24 格全绿、黄金组、数据+GA、λ 计数 0/2/18、融合五项负结果 |
| boundary | 5 | 一点二二，不是百分之二到六 | 2–6% 未复现、规模、书中未给、λ 选择、四个不能推 |
| outro | 5 | 筛选成立，调权不成立 | 三句、交付清单、复现命令、两段读数、下一集 |

## 5. 证据（24 项 / 5 组 / 48.2 s）

命令：tsbase evidence-ch06-ga-krr --data data/episodes/56-ensemble-ga-krr --out data/episodes/56-ensemble-ga-krr --evidence inventory/evidence/56-ensemble-ga-krr.ch6-ga-krr.json

- 分组：data 4 / ga 7 / krr 6 / pareto 2 / fusion 5。
- GA：种群 20 × 10 代 = 200 个体；平均留下 **3.85** 个、前沿平均 **2.85** 个点；双目标与只看精度 **13/20** 选出不同子集；pBias **11.7322** / pVar **2115.0028** vs bBias **11.7145** / bVar **2119.5927**。
- KRR：λ 计数 **0 / 2 / 18**；5 折 CV 均值 **12.0467**；调参段 KR **11.5177** vs 等权 **13.4317**（看起来有效），检验段却反转。
- 融合：子集等权 **9.5721**、KR **10.0322**、全池等权 **10.1566**、全池 KR **10.2115**、Top-3 **9.6050**、最好单模型 **9.5397**（oracle 下界）；KR 胜全池等权 **6/20**、胜全池 KR **12/20**。
- 黄金值：0.875、α=[0.25, 1.25]、λ=0 误差 0.00e0、λ=1e6 预测 2.21e-6。
- 单测：algos.ch06.gaensemble **17/17**；全套 cabal test PASS（2,185 条断言 / 168 套）。

## 6. 卡点与偏差

**卡点**
1. 方差语义第一版用「成员残差两两平均绝对差」（多样性），与计划「方差越小越好」相反；整模块改成中心化方差，17 条单测同步。
2. cholSolve 第一版在 ST 循环里用列表索引 a !! i !! j，复杂度 O(n⁴)；365 点 KR 跑不动，改成先拷进 STArray 再读，恢复 O(n³)。
3. 证据程序首版把 KR 直接拟合 10 列预测向量，与子集等权重复；改成「子集等权残差 + 核修正」。
4. 静帧 3 轮：Pareto 两个近点标签重叠（第一次按 width-170 判断仍压在点上，第二次改「近邻拥挤」判断）；K 与 K+λI 矩阵 300 px 值列换行（valueW=520）；verification P5 / outro P4 两个长 label 缩短。
5. 百分比口径：屏上 5.76 与 5.75 混用；统一为 **5.75%**（5.7549），并删 2 条 clip 用 --only 重录旁白。
6. TTS 首跑被 run_code 默认 120 s deadline 杀掉（377/400 已缓存），重跑补 23 条；--only 重录 2 条后时间轴不变。
7. make 首次被 content check 拦（内容仓未提交报告 content repo is dirty）；提交 content + plan 草稿后重跑 PASS。
8. 后台 make job 的完成通知晚于实际结束，需查 /tmp/e56_make.log 或 delivery/report.json 判断，不要只等通知。

**偏差（plan D1–D6）**
- D1 书中 2%–6% 融合收益**未复现**：KR 对全池 +1.22%，对子集 **−4.8%**；结论改负结果。
- D2 第二目标改中心化方差（均方与偏差共线）。
- D3 KR 拟合残差堆叠，不是 10 列直接回归。
- D4 数据复用 E53 daily.csv，未重导。
- D5 玩具规模：20 只 / 10 候选 / 每段 365 点。
- D6 书中未给 GA/KR 细节：种群、代数、变异率、核宽、λ 网格均自定，闭式解引 Rasmussen & Williams 2006、Zhang 2021。

## 7. 复用命令

1) 模块与单测（容器内）
   docker exec haskell-ts bash -c 'export PATH=/opt/ghc/9.14.1/bin:$PATH; cd /work && cabal build all && cabal test'

2) 证据（24 项 / 5 组 / 48.2 s）
   docker exec haskell-ts bash -c 'export PATH=/opt/ghc/9.14.1/bin:$PATH; cd /work && cabal run tsbase -- evidence-ch06-ga-krr --data data/episodes/56-ensemble-ga-krr --out data/episodes/56-ensemble-ga-krr --evidence inventory/evidence/56-ensemble-ga-krr.ch6-ga-krr.json'

3) 内容仓注册与检查（引擎目录）
   cd /root/video-pipeline-blueprint && node scripts/films.mjs sync && node scripts/films.mjs check --strict

4) TTS 三步（pack 目录；run_code 必须传 timeoutMs=600000）
   /root/venv-netbond/bin/python3 build/tts_narration.py --lines data/lines.json --clips assets/audio/clips --voice-out data/voice.json --clips-json data/clips.json --concurrency 6
   python3 build/make_script.py
   python3 build/make_narration.py
   node scripts/qa/dump_script.mjs src/tsint-56-ensemble-ga-krr/script.ts data/tsint-56-ensemble-ga-krr/lines.json

5) 成片（引擎目录，--score 必带）
   node scripts/make.mjs --film tsint-56-ensemble-ga-krr --score=out/e04-score-loop-48k.wav

6) 单页静帧
   npx remotion still Tsint56EnsembleGaKrr /tmp/x.png --frame=12299 '--props={"music":null,"narration":null}' --log=error

## 8. 下一集 E57（57-tokenization-trio，ch07 第一集）

- 标题《把序列切成块：Patch、周期、分辨率前缀》，16 分钟；目录 series/tsint/episodes/57-tokenization-trio/；无前置算法依赖（E58 才依赖它）。
- 主张：96 点序列按 patch=8/16/32 切成 **12 / 6 / 3 个 token**，token 数与可容纳最长周期成反比；三种切法都是无参数或近无参数的确定性变换，不训练模型。
- 模块：ch7-patch-embed PatchEmbed 70 行、ch7-period-token PeriodToken 60 行、ch7-res-prefix ResPrefix 50 行；算法 id ch7-patch-embed 等。
- 屏幕必须出现：96→12/6/3 手算表、11 token 重叠切分、ACF 主峰 24、三种切法的 token 数对比。
- 数据：合成 sin(P=24) + 000001.SZ 512 点，降采样 4 档。
- 开工顺序：读 E57 plan → 写三个模块 + 单测（黄金值：96/8=12、96/16=6、96/32=3；重叠切分 11 个 token；ACF 峰在 lag 24）→ 证据程序（预计 20–24 项）→ cabal build/test → 数据 manifest → 三笔 ts-base 提交 → video_project pack（约 8 场 32–36 页）→ TTS → 静帧 → make → delivery/ready/docs。

## 9. 交付检查清单

- [x] ts-base 三笔提交（模块 / 证据 / 数据），工作区干净
- [x] 证据 24/24、48.2 s，JSON 与 summary 一致
- [x] cabal test 全绿（17/17 新增）
- [x] 40 页静帧逐场复核（含 3 轮修复）
- [x] TTS 400 条、旁白时间轴 1,281.13 s
- [x] make PASS（23 stage、tree b44f31b463ef6368、loudnorm −15.9 LUFS）
- [x] delivery 四件（cover / srt 400 cue / chapters / ffmeta）
- [x] film.json ready + coverFrame 180 + assets complete
- [x] plan Delivery 回填、SELF-AUTH A53、production-log、STATUS 行
- [ ] docs 提交后重跑 films.mjs check --strict
