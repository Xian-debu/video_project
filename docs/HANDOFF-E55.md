# HANDOFF E55 → E56

> 写给下一个接手的人（或下一次会话的自己）。本文件在 E55 交付后写，目标是让 E56 不用重新摸一遍流水线。
> 状态截至 2026-11-03 夜：E55 **已交付（ready）**；tsint 系列累计 65/74（E01–E18、E19–E55、E65–E74）。

## 1. 一句话

E55 把「省算力」拆成三种策略：合成 10^6 空间上给 1% 预算（10,000 次评估），随机最大值 3.7759 已越过 99% 分位线 3.3014，子空间 / 比较器 / 组合预测器只是把它抬高 0.10–0.14（3.8780 / 3.9072 / 3.9183）——**省评估成立**；换到真实 A 股 12 架构代理任务，全距 0.9683%、最好 6.1780 只比零基线 6.1782 低万分之三——**找到更好架构不成立**。

## 2. 四仓提交

| 仓 | 提交 | 内容 |
|---|---|---|
| ts-base | 17a3c44 | Ch06/CherryRegion.hs 151 行 + RandomCmp.hs 149 行 + CombPredictor.hs 85 行 + 3 个 Spec 27 条 |
| ts-base | a34b635 | app/Ch06GeneralizableEvidence.hs 549 行 + Main/cabal + inventory：33 项证据，4.8 s |
| ts-base | 4e35cf4 | 第 55 集数据：summary 33/33、10^6 合成、12 真实架构、daily30.csv/export/manifest |
| ts-admin | 1318010 | 未动（复用 E54 的 daily30.csv，未重新导出） |
| video_project | 30ecad8 | content：36 页、360 行、20:32 旁白、dist/voice/clips |
| video_project | 6a49dda | delivery：cover / 360 cue srt / 8 章 |
| video_project | 84cf174 | film.json ready（coverFrame 180） |
| video_project | 本次 docs 提交 | docs：plan Delivery、SELF-AUTH A52、本 HANDOFF、production-log、STATUS |
| 引擎 | a667688 | 未改；score 复用 out/e04-score-loop-48k.wav |

## 3. 成片与流水线读数

- 成片：**1,232.34 s（20:32.3）/ 36,970 帧 / 8 场 36 页 / 360 cue**；target 24 分钟，未命中，D1 记偏差。
- 帧数：TOTAL = 36,970（round(1232.34 × 30)）；narration.wav 1,232.34 s / 118,304,684 B（不入库）。
- make：**PASS** —— 23 stage 全 ok；8 段 rendered 8（reused 0）；tree 17a94804a347deea；mp4 61,085,185 B、sha256 d756ca0c5d7c0aa8730ae7164ae3a87e0e3d3f154d8c97199f14f6802673dbe1。
- 混音：mix 1,233.54 s、peak −1.00 dBFS、RMS −26.18 dBFS、ducked 53.6%、musicGain 0 dB、fade 1.5/2.5；loudnorm 输出 **−15.0 LUFS / TP −2.0 dBFS / LRA 1.7**（ebur128 复核 −15.4 / −1.3）。
- 画面：36,970 帧 luma mean 21.17 / min 14.57 / max 24.92 / mean|d| 0.0138 / p99 0.1058 / max 7.83 / 7 切点 5291,10193,14336,19397,23519,27992,32146；4 静帧 45/3697/16636/29576 PASS。
- 字幕与章节：360 cue、0 wrapped、longest 26、跨度 00:00:01,200→00:20:30,140、发声 1,141.8 s；8 章合计 1,232.34 s；cover frame 180 / 193,584 B。
- 章节起点：open 0:00.0 / problem 2:56.4 / definitions 5:39.8 / metrics 7:57.9 / implementation 10:46.6 / verification 13:04.0 / boundary 15:33.1 / outro 17:51.5。

## 4. 内容结构（8 场 × 页数 = 36 页，360 行）

| 场 | 行数 | 页数 | 讲什么 |
|---|---|---|---|
| open | 50 | 5 | 「省算力的三种剪枝」：1,000,000 / 10,000 / 1% / 0.9696%，两条结论（合成上赢、真实上平） |
| problem | 50 | 5 | 真实空间 10^20 vs 预算几百次：SpaceScale、比较与组合两种更便宜的预测 |
| definitions | 40 | 4 | 式 6.14–6.16：μ±λσ 收缩盒、成对比较、剪枝 keep=top⌈ρn⌉ 与参数继承；CompareDemo / PruneDemo / 四条黄金值 |
| metrics | 50 | 5 | 六组 33 项：四最大值与抬升、预算 10,000→201、BoxDrift 三轮体积、RealBars 12 架构、六组读数表 |
| implementation | 40 | 4 | 三模块 385 行：shrinkRegion / trainComparator+sortByComp / pruneByComb+inheritParams |
| verification | 40 | 4 | 33 项怎么过：CheckGrid、六组分布、黄金值、预算五项、迁移五项负结果 |
| boundary | 40 | 4 | 三条边界、四个不能推：合成最优在角、真实任务无信号、规模差十四个数量级 |
| outro | 50 | 5 | 三句话（机制成立 / 合成抬升 / 真实持平）、交付清单、三个假设、三个问题 |

## 5. 证据 33 项（data 4 / synth 9 / cherry 6 / cmp 5 / comb 4 / transfer 5，4.8335 s）

- data 4：股票 30 且 bars−1 ≥ 1500；共同交易日 1,495 ≥ 1,490；窗口 60,115 ≥ 45,000；切分 42,067 / 9,003 / 9,045。
- synth 9：空间 10^6 / 4 维 / top 1% = 10,000 / 阈值 3.3014；四个最大值 3.7759 / 3.8780 / 3.9072 / 3.9183 均过线；抬升 0.1021 / 0.1313 / 0.1424；预算 10,000 / 10,000 / 201 / 10,000；体积 0.0770→0.0059→0.0005 严格递减且末体积 <0.01；最终盒每维宽 <0.2；同种子逐位复现。
- cherry 6：shrinkRegion 1 [0,2,4] = [0.3670, 3.6330]；λ=0 退化点；体积单调减；采样在盒内；同种子复现；二次曲面 3 轮 best ≥ −0.01；最终盒含 (0.3,0.7)。
- cmp 5：真值 [0.9,0.5,0.7,0.3] → [1,3,2,4]；完美比较器准确率 1.0；噪声 p=0.1 时 >0.8、p=0.5 时 <1；线性真值留出 20 个准确率 1.0；稳定排序；solveLin [[2,1],[1,3]] = [0.8,1.4]。
- comb 4：8 子空间 [1..8]、比例 0.5 → [5,6,7,8]；保留数 8/4/2/1 与预算递减；索引升序；inherit 0.7 [1,2] [3,4] = [1.6,2.6]、α 端点 1/0、old==new 恒等。
- transfer 5：12 架构 MAE 全距 0.9683% < 1.5%；最好 6.1780 比零基线 6.1782 低 0.0002；短家族 6.1780、长家族 6.2074（长回看更差）；最好/最差与 summary 一致。

## 6. 卡点与偏差（本集踩的坑，下一集别再踩）

1. **O(i) 的随机源会拖死证据程序**：TsBase.Core.Rand.randUniformAt 每次 O(i)，对 10^6 点各调 4 次约 2×10^12 步，首跑 13 分钟无输出。改预生成 synthUs 向量（一次 randUniform 7 (4×corner)）后 4.8 s。相似采样循环先查随机源复杂度。
2. **dump 必须指向 script.ts**，不是入口组件：node scripts/qa/dump_script.mjs src/tsint-55-generalizable-search/script.ts /tmp/e55-dump.json。
3. **TTS 必须显式 timeoutMs=600000**：run_code 默认 120 s 会杀掉；缓存按 scene#index，重跑只补缺的 clip。
4. **assetsStatus 只接受 complete|incomplete**：content 提交阶段写 pending 会被 films check 报错，保持 incomplete。
5. **窄 Card 里不要用 Row**：宽 490–540 时 name 190 + value 300 会把 note 挤成单字符竖排；改用 KV 堆叠。
6. **JSX 文本里写集合要加方括号**：花括号列表会被当逗号运算符（TS2695/TS18007），写 [5,6,7,8]。
7. **figs 里的字面量类型要写联合类型**：anchor 默认值会被推断成 string，显式写 start | middle | end 的联合类型。
8. **common_days 要取交集**：30 只股票各自日期集合的并集是 2,430，交集 −1 才是 1,495；make_dist_data.py 会 EVIDENCE MISMATCH。
9. **make 前内容仓必须干净**：cover.png 不要提前生成、HANDOFF 草稿不要留在 repo；否则 content check 直接拦。
10. **TTS 后要重跑 build/make_script.py**：它用 data/voice.json 的实测时长重写 script.ts；再 sync → dump → cp 回 lines.json → make_narration.py。

## 7. 复用命令

```
# ts-base 构建与测试
docker exec haskell-ts bash -c 'export PATH=/opt/ghc/9.14.1/bin:$PATH; cd /work && cabal build all'
docker exec haskell-ts bash -c 'export PATH=/opt/ghc/9.14.1/bin:$PATH; cd /work && cabal test'

# 证据（pack 路径 + 输出目录 + inventory 路径）
docker exec haskell-ts bash -c 'export PATH=/opt/ghc/9.14.1/bin:$PATH; cd /work && cabal run ts-base -- evidence-ch06-generalizable --data data/episodes/55-generalizable-search --out data/episodes/55-generalizable-search --evidence inventory/evidence/55-generalizable-search.ch6-generalizable.json'

# 内容仓校验 / 同步 / 预览
cd /root/video_project && node scripts/films.mjs check --strict
cd /root/video-pipeline-blueprint && node scripts/films.mjs sync
cd /root/video-pipeline-blueprint && node scripts/qa/dump_script.mjs src/tsint-55-generalizable-search/script.ts /tmp/e55-dump.json

# 旁白（必须先 TTS 再重跑 make_script.py）
/root/venv-netbond/bin/python3 build/tts_narration.py --lines data/lines.json --clips assets/audio/clips --voice-out data/voice.json --clips-json data/clips.json --concurrency 6
python3 build/make_script.py
python3 build/make_narration.py

# 成片（必须带 score）
cd /root/video-pipeline-blueprint && node scripts/make.mjs --film tsint-55-generalizable-search --score=out/e04-score-loop-48k.wav
```

## 8. 下一集 E56

- slug ensemble-ga-krr；标题《先筛模型再调权：遗传算法筛选 + 核岭回归融合》；chapter ch06；cluster「F4 自动集成」；runtime 22 分钟。
- thesis：先用遗传算法按「偏差+方差」双目标筛掉一半候选模型、再用核岭回归拟合融合权重，验证集 MAE 比等权平均低 2%–6%；但若 GA 只看精度不看方差，筛出的模型高度同质，融合额外收益趋近 0。
- 算法 ch6-ensemble-ga → module TsBase.Algos.Ch06.GaEnsemble，api gaSelect / krrFit / krrPredict；impl_notes：GA 必须用折外预测算偏差/方差、KR 用另一折拟合；KR 是 O(n³)、n≤1000 用 Cholesky；核宽按训练集距离中位数归一化；Pareto 前沿 + KR 交叉验证挑点，加权法作对照；0/1 编码交叉后至少保留 2 个模型。
- 屏上要出现的数字：2%–6%、筛掉一半、Pareto、n≤1000、至少 2 个模型；证据沿用「数据 + 黄金值 + 负结果」三段式，先想清楚「同质化后收益趋近 0」怎么用一条断言钉住。

## 9. 交付检查清单

- [x] ts-base 三笔提交（模块+单测 / 证据 / 数据），工作区干净；全量测试 2,185 PASS / 168 套。
- [x] video_project content / delivery / ready 三笔，films check --strict 通过。
- [x] make PASS（23 stage、8 段 rendered 8、loudnorm、luma、publish）。
- [x] delivery 4 件入库（cover / srt / chapters / ffmeta），mp4 不入库。
- [x] docs 五件（plan Delivery、SELF-AUTH A52、HANDOFF-E55、production-log、STATUS）。
- [x] STATUS tsint-55 行改 ready / 1233 / yes / ok / 11 / -。
