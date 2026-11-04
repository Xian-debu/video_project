> 本集交接：E63 已交付；会话级交接见 `docs/HANDOFF-SESSION-2026-11-04.md`。

# HANDOFF — E63《把序列画成图》交付与 E64 开工

> 交接时点：2026-11-05 凌晨（E63 成片 PASS、delivery/docs 本次提交）
> 系列进度：tsint 74 集中已交付 **73 集**（E1–E63 按生产顺序；E63 为第 73 集，ch07 第七集）
> 本集结论：**「图像化无损」只对一半**——格拉姆角场差一个整体反射即可反解（逐位误差 **1.3e−14**）；转移场只保结构，n×n 图像行和是 **16**（= n/q）不是 1，且不能由图像反推箱序列；把图喂给卷积前端预测下一天，**没有赢**过三个尺度数字（1.3913 对 1.3908），两条都赢朴素基线 **2.1552**。

## 1. 一句话现状

E63 已交付 tsint-63-image-encoding：8 场 **32 页**、320 条旁白、成片 **18:31.50（1,111.50 s / 33,345 帧）**，mp4 59,894,069 B（59.9 MB）/ sha256 `8dc2caa5…34da9cb`；19 项证据全绿（4.45 s）、24 条单测全绿；ts-base 一笔（9122e4f）、ts-admin 一笔（3f065d7）、video_project pack 一笔（fb2b1e9）+ delivery 一笔（本次）。下一集 E64《只训练 0.1% 的参数》（64-llm-side-adapters，约 16 分钟，ch07 第八集），后端未开始。

## 2. 四仓提交

| 仓 | HEAD | 本集提交 |
|---|---|---|
| ts-base | 9122e4f | `9122e4f` 单笔：GAF.hs 100 行 + MTF.hs 92 行 + VisionForecast.hs 147 行、三个 Spec（9/7/8 = 24 条）、Ch07ImageEvidence.hs 269 行、Main/cabal/Spec、data/episodes/63-image-encoding（window_128.csv 128 行 / series_1024.csv 1,024 行 / manifest / summary / checks）、inventory/evidence/63-image-encoding.ch7-image.json、SELF-AUTH A97/A98 |
| ts-admin | 3f065d7 | `3f065d7` export_ch07_image.py：sz000001 2016-06-01→2016-12-08 的 128 点窗口、2015-10-26→2019-12-31 的 1,024 点分段（百分比对数收益）+ manifest |
| video_project | fb2b1e9 + 本次 | `fb2b1e9` pack 源 + 320 行讲稿 + 32 页 + dist + voice/clips + film.json ready；本次 delivery（cover / 320 条 srt / 8 章 / assetsStatus complete / plan Delivery + delivered） |
| video-pipeline-blueprint | 未改 | 无；score 复用 `out/e04-score-loop-48k.wav`（1,560 s）；`.tmp-e63-stills.mjs` 已删 |

## 3. 成片与流水线读数

- 成片：**1,111.50 s（18:31.50）/ 33,345 帧 / 8 场 32 页 / 320 条旁白 / 320 cue**；mp4 59,894,069 B / sha256 `8dc2caa5ae2f12a1e32aaad39a4e198b3e5ba78a0046bdd557161ee0234da9cb`；cover.png 233,968 B / sha256 `2ac6bfa4702e436dfd07010b610aeb9d4d3aafb144d636c1e7782701190ff030`（frame 180 = 6.00 s）。
- 音量：mix 48 kHz / 1,112.34 s、peak −1.07 dBFS、RMS −26.84 dBFS、ducked **54.1%**（4.5 dB）、musicGain −4.5 dB、preGain 1.0000、fade 1.5 / 2.5；loudnorm out I **−15 LUFS** / TP **−2 dBFS**（in −23.4 / −1.0，+0.9 offset，dynamic）；music gate stem full −25.1 / audible −27.88 / share 0.631 / sub 0.068、PASS；mix gate speech −23.78 / gap_full −30.58 / gap_audible −33.29 / bed 36.7、PASS。
- 字幕与章节：320 cue、00:00:01,200 → 00:18:29,290、**0 条换行**、最长 22 字；8 章合计 1,111.49 s（00:00:00 / 00:02:25 / 00:04:49 / 00:07:03 / 00:09:23 / 00:11:38 / 00:14:00 / 00:16:24）。
- 闪烁：33,345 帧 mean|d| **0.0152** / p99 0.1111 / max 10.24 / 7 个切点；still_lint **32 帧 PASS**；32 页静帧逐页人工看（返工 15 处，见 §8）。
- 流水线：**23 stage 全 ok**；tree `cede2c4e965fc0ce`；8 段全渲染、33,345 帧、复用 0。
- 讲稿：8 场 32 页 320 行（每场 40 行 / 4 页 × 10 行整页）；TTS 320 clips、实测语音 **916.1 s**、均值 **2.86 s**（min 2.4 上下 / max 4.1）；narration.wav 1,111.14 s / 106,669,484 B（不入库）。

## 4. 内容结构（8 场 32 页）

| 场 | 页 | 标题 | 关键读数 |
|---|---|---|---|
| open | 4 | 把序列画成图 | 128 点 → 128×128 = 16,384 格；三句结论（可逆 / 只保结构 / 没赢）；2.1552 基线 |
| problem | 4 | 画成图，丢了什么 | 借工具三笔账：图模型成熟 ← 卷积池化；代价一信息、代价二归纳偏置；x 与 −x 两张 GASF 逐格相同；8×8 W 与铺回的 128×128 |
| definitions | 4 | 缩放、极角与状态 | x̃ = 2(x−min)/(max−min)−1；φ = arccos(x̃)；GASF=cos(φi+φj) 对称 / GADF=sin(φi−φj) 反对称；对角给 |x|、第一行定符号；按秩 8 箱 / 每箱 16 |
| metrics | 4 | 先钉口径再读数 | 128 / 1,024 点两段；窗 32 步长 8 → 124 窗（60 / 29 / 35，不随机打乱）；λ 五档 1→1e4，图 10000 / 数字 100；三条口径都写清 |
| implementation | 4 | 三个模块各管一段 | 100 + 92 + 147 = 339 行、24 单测、267 行证据；两行列表推导生成两张图；按秩分箱；三核固定 + 池化 8×8 → 192 维；列主元消元 |
| verification | 4 | 十九项，四秒半 | 19/19、0 失败、4.45 s；分组 3/5/6/5；GAF 反解 1.3e−14、三项偏差 0；W 行和 1.0000 / 图像行和 16.0000 / 重放 0；图 1.3913 vs 数字 1.3908 vs 基线 2.1552 |
| boundary | 4 | 无损只对一半 | 能说四条（可逆 / 行和 W / 打平 / 都赢基线）；不能说四条（都不丢信息 / 图更强 / 数能搬走 / 124 够）；窗口 32 池化 8×8 单一切分；一只股票两段时期 |
| outro | 4 | 把图放回表示 | 回到那张图（差一个整体反射）；四数复盘 1.3e−14 / 16.0000 / 1.3913 / 2.1552 + 三条复现命令；下一集 1,300 参数 / 每层几百 / 选前缀；边界之内图可以无损 |

## 5. 证据与关键读数（ts-base 9122e4f 后不变）

- 命令：`tsbase evidence-ch07-image --data data/episodes/63-image-encoding --out out/evidence-63 --evidence inventory/evidence/63-image-encoding.ch7-image.json`，**19/19、4.45 s**；分组 data 3 / gaf 5 / mtf 6 / vision 5。
- 数据：`window_128.csv` 128 个 100·ln(c_t/c_{t−1})（min −2.3734 / max 2.9917，2016-06-01→2016-12-08）；`series_1024.csv` 1,024 个同口径（min −8.0281 / max 8.3901，2015-10-26→2019-12-31）。
- GAF：手算 [−1, 0] → GASF [[1,0],[0,−1]]、GADF [[0,1],[−1,0]]；128×128 的对称 / 反对称 / 对角偏差都是 **0**；反解最大误差 **1.349e−14**（手算样例 0），只差整体反射。
- MTF：8×8 转移矩阵行和 **1.0000**；128×128 图像行和 **16.0000**（= n/q）与「箱计数 × W 行」偏差 **2.1e−14**；按秩分箱每箱 **16**；给定 (W, 箱序列) 重放偏差 **0**。
- vision：卷积特征 **195** 维（192 图 + 3 尺度）+ 截距 = **196** 参数；测试 MAE 图 **1.3913** / 数字 **1.3908** / 基线 **2.1552**；λ 图 10000 / 数字 100（验证段选）。
- 确定性：三个模块都是纯函数、无随机数、无 IO，逐位可复现；证据 267 行。

## 6. 本集的决定与偏差

- **D1 规格主张被证据推翻，照实改正**：series 文档写「GAF 与 MTF 都是双射、MTF 行和为 1 且可反推箱序列」。实测：GASF 差整体反射可反解；MTF 的「行和为 1」只对 q×q 的 W 成立，n×n 图像行和是 n/q = 16，且只凭图像反推箱序列是循环的（要知道箱序列才知道打散顺序）。实现里删掉 `binsFromMtf`、换成 `mtfFromBins`，屏幕把这条当教学点。
- **D2 分箱按秩不按值**：收益序列大量相等值，按值分箱 q=2 时 [0,0,1,0,0] 五个点全进 0 号箱（写测试时当场抓到）；按秩每箱 16 个。
- **D3 三个固定核不是学出来的**：横向梯度 / 纵向梯度 / 拉普拉斯，ReLU 后自适应池化到 8×8；选固定核是为了无随机、可复算，不代表「CNN 最优」。
- **D4 负结果照实讲**：图像特征 1.3913 没有赢三个尺度数字 1.3908，两者对基线 2.1552 的优势主要来自岭回归收缩，不是图形状。屏幕对白「负结果也是结果」。
- **D5 124 样本单一切分**：没有交叉验证、λ 只五档网格，万分之四的差在噪声量级；写进边界页，不宣称「图更强」。
- **D6 窗口 32 / 池化 8×8**：图 32×32 池化后只剩 64 格，信息在池化里被压掉——这是结构性限制，不是参数没调好。
- **D7 计时 4.45 s 随负载浮动**：旁白只说「四秒半」，屏幕秒数来自当次 JSON。
- **D8 成片 18:31.50 短于 20 分钟 target**：32 页 320 行按「讲清楚」收在 18.5 分钟，plan 原写 target 20 min，成片更短不补行。

## 7. E64 已完成的直接线索

- 规格：docs/series-tsint-episodes.md「### E64」段，目录 `episodes/64-llm-side-adapters/`，原文 p.178–189（7.1.2, 7.2.3），16 分钟，依赖 mini-foundation-loop。
- 单元：`ch7-linear-probe` → `TsBase.Algos.Ch07.LinearProbe`（估 80 行）、`ch7-lora` → `TsBase.Algos.Ch07.LoRA`（估 70 行）、`ch7-anchor-prefix` → `TsBase.Algos.Ch07.AnchorPrefix`（估 60 行）。
- 主张：冻结主干 + 线性头（**1,300 参数**）能复现部分下游效果；LoRA 只加 2·r·d 个参数（d=64、r=4 时**每层 512**，占总参数不到 1%），且 **B 初始化为 0 时输出与冻结模型逐位相同**——适配代价可精确算出来。
- 验收画面：(1) LoRA 参数量 512 的手算；(2) B=0 时输出与冻结模型逐位相同的断言；(3) 线性头复原 w_true 的 1e−10 误差。
- 数据：ts-admin 日线序列嵌入（来自 E3 编码器）+ 随机正交词向量表（替代 LLM 词表）；数据资产 lake_daily。

## 8. 本集踩过的坑（下一集直接用）

1. **规格里的「大家都知道的事实」先证再讲**：本集规格两条主张（MTF 行和为 1、可反推箱序列）都只在 q×q 的 W 上成立；证据程序写完当场改口径，别等到讲稿定稿。
2. **PAGES_INDEX 是每场内偏移**（[0,10,20,30] 不是全局行号）：静帧脚本的全局行偏移必须按 `LINES.filter(l => l.scene === id).length` 累加（每场 40 行），不是按每场页数（4）累加；写错会让 4 页取到同一帧。
3. **每场页数写死 4 页，场景文件必须真有 4 个 AbsoluteFill**：boundary / outro 首版只有 3 页，PAGES_INDEX 仍指 4 页 → 第 4 页回落成第 3 页（p27/p28、p31/p32 同图）。静帧审查第一步数页数。
4. **Row 的 value 会折行**：宽值（`128 × 128`、`1 / 10 / 100 / 1e3 / 1e4`、`2015–2019 · 2016`）要配 `valueW` 或缩短写法（`128²`、`1 → 1e4`、`2015–19 · 2016`）；Row name 太长（「训练 / 验证 / 测试」）也会折，改成「切分」把细节放 note。
5. **数字拼接出 `16.00.0000`**：`fmt2(x) + ".0000"` 是 bug；要 4 位小数就用 `toFixed(4)`。
6. **check detail 里的原始数组会溢出卡片**：GASF/MTF 手算矩阵（16 位浮点、0.6666… 重复）必须截断成「逐位一致（详见 checks.txt）」，builder 里按 `detail 长度 > 40 且以 "[[" 开头` 处理。
7. **Heat 要按矩阵范围归一**：值域窄的矩阵（GASF 全部挤在 −0.92…0.05、W 最大 0.44）用固定 alpha 映射就是一片平色；改成按 `lo/hi/absMax` 归一后纹理才出来（纯显示，不动数据）。
8. **PolarCircle 的角度要跟标签一致**：首版 φA/φB 与 `x_j=−1`/`x_i=0` 不符、弧标签「φ_i+φ_j」几何上也不对（两射线间的弧是差角）；改成 `phiI = acos(0.2)`、`phiJ = acos(−0.5)`、两条从 0 起的弧。
9. **Formula 在窄容器折行**：`x̃ = 2·(x − min)/(max − min) − 1` 在 430 宽里「min) − 1」掉行；要么加宽容器，要么拆两行。
10. **清空 render cache 之后必须重跑 still_lint**：修 MaeBars 值列 2px 溢出（100→104、bar 同步 −4）后仍是 32 帧 PASS，但改样式类补丁都值得重跑一遍。
11. **长任务全部后台 job**：TTS / 32 页静帧 / 成片渲染都会超过 run_code 默认 deadline；make 用 `--score=out/e04-score-loop-48k.wav` 显式传路径。
12. **stills 批量脚本必须放引擎目录**（`/tmp` 找不到 `@remotion/bundler`），跑完删除。

## 9. 下一步（接手即做）

1. E63 收尾：本次 docs 提交（本文件 / production-log / HANDOFF-INDEX / STATUS / series 状态）；确认 delivery 只提交 cover / srt / chapters（mp4、wav、scenes、stills、report.json 走 gitignore）。
2. E64 后端：ts-admin 导出 E3 编码器的日线嵌入 + 正交词向量表 → ts-base 写 LinearProbe / LoRA / AnchorPrefix 三模块 + 单测 + `evidence-ch07-adapters`（至少覆盖 512 参数手算、B=0 逐位相同、线性头复原 w_true 1e−10）。
3. E64 内容包：沿用 E63 的 build/ 模板（改 id、DistData 形状），16 分钟 → 按每场 10 行估算 8 场 ×4 页 ×10 行 ≈ 320 行偏长，目标约 260–280 行（约 15–16 分钟）。
4. 系列收尾：E65《误差三件套》进 ch08，见 series-tsint-episodes.md。
