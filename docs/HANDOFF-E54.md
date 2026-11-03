# HANDOFF E54 → E55

> 写给下一个接手的人（或下一次会话的自己）。本文件在 E54 交付后写，目标是让 E55 不用重新摸一遍流水线。
> 状态截至 2026-11-03 夜：E54 **已交付（ready）**；tsint 系列累计 64/74（E01–E18、E19–E54、E65–E74）。

## 1. 一句话

E54 把架构搜索连续化：48 个离散决策（3 算子 × 8 边 × 2 block）、单 block 6,561 个架构、α 20 步只从 0.3334 挪到 0.3338——**机制成立**；离散化保 top-2、重训 150 步，七个架构（超网 288.4740 / top-1 267.2185 / top-2 256.3004 / 随机 230.2738 / 同批 236.8403 / 初始化 270.5292）**全部输给零基线 221.8159**——**收益不成立**。

## 2. 四仓提交

| 仓 | 提交 | 内容 |
|---|---|---|
| ts-base | `60ea125` | `Ch06/Darts.hs`：边输出取平均、逐边梯度按边数缩放 |
| ts-base | `77084ac` | `app/Ch06DartsEvidence.hs` 519 行 + Main/cabal + inventory：28 项证据，3.8 s |
| ts-base | `dc741db` | 第 54 集数据：summary 28/28、30 只、alpha lr ladder、daily30.csv |
| ts-admin | `1318010` | 未动（E54 复用 E52 的 300 只快照，`codes[::10]` 抽 30 只） |
| video_project | `b4e0f01` | content：40 页、400 行、26:39 旁白、dist/voice/clips |
| video_project | `6adc9ca` | delivery：cover / 400 cue srt / 8 章 |
| video_project | `1d6f1f6` | film.json ready（coverFrame 180） |
| video_project | 本次 docs 提交 | docs：plan Delivery、SELF-AUTH A51、本 HANDOFF、production-log、STATUS |
| 引擎 | `a667688` | 未改；score 复用 `out/e04-score-loop-48k.wav` |

## 3. 成片与流水线读数

- 成片：**1,598.77 s（26:38.8）/ 47,963 帧 / 8 场 40 页 / 400 cue**；target 26 分钟，命中。
- 帧数：TOTAL = 47,963（round(1598.78 × 30)）；音频 narration.wav 1,598.78 s / 153,482,924 B。
- make：**PASS** —— 23 stage 全 ok；1,598.77 s / 47,963 帧 / 400 cue；loudnorm in −23.2 / −1.2 / LRA 4.0 → out **−15.8 LUFS / TP −2.0 dBFS / LRA 2.7**（Dynamic +0.8）；luma 47,963 帧 mean 20.80 / min 14.58 / max 24.63 / mean|Δ| 0.0131 / p99 0.1116 / max 6.50 / 7 切点；publish 400 cue / 8 章 / speaking 1,501.0 s；cover frame 180；tree `6eabd93324d71b26`。
- 章节：8 章（open 0:00.0 / problem 3:39.4 / definitions 7:06.7 / metrics 10:24.0 / implementation 13:37.1 / verification 16:55.4 / boundary 20:32.0 / outro 23:43.9）。
- 交付文件：cover.png（frame 180 = 6.00 s）、`tsint-54.srt`（400 cue）、`tsint-54.chapters.txt`、`tsint-54.chapters.ffmeta.txt`。

## 4. 内容结构（8 场 × 5 页 = 40 页）

| 场 | 行数 | 页数 | 讲什么 |
|---|---|---|---|
| open | 50 | 5 | 「把选择变成权重」：48 / 6,561 / 20 / 150 四个数，两条结论（机制成立、收益不成立） |
| problem | 50 | 5 | 离散空间没有梯度：argmax → softmax，双层优化，一阶近似 |
| definitions | 50 | 5 | 式 6.11–6.13：softmax 权重、混合算子、三层空间；黄金值 [0.5,0.5] / [4.54e-5,0.99995] / 1.2 / 3.0 / 6.5 |
| metrics | 50 | 5 | 五组 28 项：20 步轨迹（纵轴放大一千倍）、lr 阶梯五档、MaeBars 七条、离散化选择条 |
| implementation | 50 | 5 | 两个模块 311 行：softmaxWeights / mixedOp / dartsStep / macroMix / microMix / stBlock |
| verification | 50 | 5 | 28 项怎么过：DARTS 组 6 项、搜索组 6 项、三层空间 6 项、演示 6 项、数据 4 项 |
| boundary | 50 | 5 | 三条边界、四个不能推：步数、学习率、任务、规模；一阶近似省略 Hessian |
| outro | 50 | 5 | 三个数三句话，交付清单（311 行 / 20 单测 / 28 证据 / 一集） |

## 5. 证据 28 项（data 4 / darts 6 / search 6 / stg 6 / demo 6，3.7898 s）

- data 4：股票 30 且 bars−1 ≥ 1500；共同交易日 1,495 ≥ 1,490；窗口 60,115 ≥ 45,000；切分 42,067 / 9,003 / 9,045。
- darts 6：softmax [0,0]→[0.5,0.5]、[0,10]→[4.54e-5,0.99995]；mixed {Identity,Zero}→[0.5,1.0]；one-hot 复现 [1,2]；20 步损失 0.3763→0.2798；dartsStep 位移 0.0029。
- search 6：space 6,561 / 48 决策 / ratio 152.4158；lr 阶梯 0.3338→0.9424 严格递增；lr=500 第 12 步 6/8 塌缩且 2 种算子；默认 20 步塌缩边 0；< 120 s。
- stg 6：macro 1.2、micro 3.0、三层 6.5、凸包 2.8 ∈ [1,4]、置换等变 2.2、12 个离散选择。
- demo 6：超网 288.4740 > 所有离散架构；top-1 比随机差 16.04%；全部 > 零基线 221.8159；同批差 7/8；|top-2−top-1|/top-1 = 4.26% < 5%；同 seed 逐位复现。

## 6. 卡点与偏差（本集踩的坑，下一集别再踩）

1. **dump 必须指向 `script.ts`**，不是入口组件：`node scripts/qa/dump_script.mjs src/tsint-54-darts-differentiable-search/script.ts /tmp/e54-dump.json`；指向入口会拿到没有 LINES 的 bundle。
2. **TTS 必须显式 `timeoutMs=600000`**：run_code 默认 120 s 会杀掉；重跑会跳过已存在 clip（缓存按 scene#index）。
3. **cover.png 不要提前生成**：content check 要求内容仓干净，先把 delivery/cover.png 挪出 repo 再 make（make 自己会生成 cover）。
4. **字幕字段是 `speech` 不是 `text`**：`Line = { scene, index, start, dur, speech }`，入口 Subtitle 用 `line.speech`。
5. **页内 Row 的数值列默认 300 px 会换行**：`[4.54e-5, 0.99995]` 这类长串要传 `valueW={470}`。
6. **TraceChart 的 yTicks 不能超过 yHi**：0.3340 的刻度画到 0.334 之上会顶到卡片标题；同时 `padT` 已从 24 调到 42。
7. **EdgeGrid 8 行 × 46 会溢出画面**：改用 `EdgeStrip`（8 列 × 3 小格，约 150 px 高），放到左栏 SweepBars 下方。
8. **TTS 后要重跑 `build/make_script.py`**：它用 `data/voice.json` 的实测时长重写 script.ts；再 dump 出新 lines.json 给 `make_narration.py`。
9. 证据首版有 2 条恒真断言（stg 的置换、demo 的复现），已改成实测断言。
10. 单测实际 **20 条**（Darts 12 / StgBlock 8），提交 `28f1720` 信息里的「28 tests」是笔误（28 是证据项数）。

## 7. 复用命令

```bash
# 1) 证据（ts-base）
cd /root/ts-base && cabal run -v0 evidence-ch06-darts --data data/episodes/54-darts-differentiable-search --out data/episodes/54-darts-differentiable-search --evidence inventory/evidence

# 2) dump（引擎侧挂载后）
cd /root/video-pipeline-blueprint && node scripts/films.mjs sync
node scripts/qa/dump_script.mjs src/tsint-54-darts-differentiable-search/script.ts /tmp/e54-dump.json

# 3) TTS（系统 python 没有 edge_tts）
cd /root/video_project/series/tsint/episodes/54-darts-differentiable-search
/root/venv-netbond/bin/python3 build/tts_narration.py --lines data/lines.json --clips assets/audio/clips --voice-out data/voice.json --clips-json data/clips.json --concurrency 6
python3 build/make_script.py                 # 用实测时长重写 script.ts
/root/venv-netbond/bin/python3 build/make_narration.py

# 4) 渲（内容仓干净 + 已 sync）
cd /root/video-pipeline-blueprint && node scripts/make.mjs --film tsint-54-darts-differentiable-search --score=out/e04-score-loop-48k.wav
```

## 8. 下一集 E55（generalizable-search）

- 标题《省算力的三种剪枝：子空间、比较器与组合预测器》，ch06，cluster **F6 可泛化与高效搜索**，target 24 分钟（E54 之后每集按 20–26 分钟收敛）。
- thesis：在合成的 10^6 架构空间上，三种省算力策略各用 1% 预算就能找到真实 top-1% 架构；但换到真实 A 股代理任务后，cherry region 的优势消失——书中 p.167 自己承认「最优子空间不能跨数据集迁移」。
- 三个算法（ts-base，module TsBase.Algos.Ch06.*）：
  1. **ch6-cherry-region**（CherryRegion，200 行）：`shrinkRegion :: Double -> [[Double]] -> (Vector, Vector)`（按分位数收缩，λ=1.0）、`sampleRegion :: Int -> (Vector, Vector) -> Gen -> [Vector]`；ε=5% 探索、3 轮 × 100 样本、预算 1%。
  2. **ch6-random-cmp**（RandomCmp，350 行）：`comparePair` / `sortByComp` / `trainComparator`；黄金值 [0.9,0.5,0.7,0.3] → 排序 [1,3,2,4]；噪声 p=0.1 时 10 候选排序准确率 > 0.8。
  3. **ch6-comb-predictor**（CombPredictor）：`combPredict` / `pruneByComb` / `inheritParams`；组合预测器剪枝 + TAP 排序 + 参数继承。
- 屏上必须出现的数字：0.01（1% 预算）、[1,3,2,4]（比较器排序黄金值）、{5,6,7,8}（保留子空间/候选集合）、参数继承一致性（同架构继承后参数逐位相等）。
- 数据：合成 10^6 空间（已知最优）+ A 股代理任务（30 只，E54 同一份收益面板）；证据需覆盖「合成上三种策略都找到 top-1%」与「真实任务 cherry region 优势消失」两条结论。
- 叙事口径：省算力是真的（预算 1% 对 100%），迁移是假的；别把「找到 top-1%」写成「搜出更好模型」。

## 9. 交付检查清单（E55 开工前过一遍）

- [ ] ts-base HEAD 干净，`cabal test` 全绿（E54 后 2,158 断言）。
- [ ] E55 证据程序 ≥ 26 项，`--evidence inventory/evidence` 输出 JSON。
- [ ] video_project 的 `series.json` 顺序/目录名/film.json 一致（工具 check 会拦）。
- [ ] pack 先写 spec → make_script → dump → 静帧复核 → TTS（timeout 600000）→ make_script 重跑 → dump → narration → make。
- [ ] make 前 content 仓干净（delivery 产物不要提前放进去），make 带 `--score=out/e04-score-loop-48k.wav`。
- [ ] 三笔提交 + docs 提交，提交信息沿用 `tsint/55: ...` 风格，只 add 路径。
