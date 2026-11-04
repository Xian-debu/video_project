# 59-mini-foundation-loop - 一万个参数的「基础模型」：掩码重建 + 线性头 + 少样本

> status: draft (in production) | runtime target: 24 min | chapter: ch07 | algorithms: 3 个模块（掩码与编码器 / 岭回归线性头 / 少样本协议）

## Thesis

不给标签，只给收盘价：遮住 512 点窗口的 30%（**154** 个位置，按 16 点整段遮），用一个只有 **66,113** 个参数的编码器（512 → 64 → 512，外加 1 个可学习 mask 标量）把它补回来。20 轮、64 秒、纯 Haskell 单线程。冻结表示，只接一层 **1,300** 参数的线性头做岭回归，在少样本协议下（k = 0/5/10/100）预测未来 20 天收益。

主结论是诚实的负结果：**重建学得会（固定掩码损失比 0.2067），表示里也确实有信息（线性探测相对 MSE 0.1364），但收益预测打不过 persistence 基线**——相对 MAE 1.0643，跨 20 只股票复现为 1.0960。计划书设想的 0.9 没有出现。本集不硬凑数字：三个模块、39 条单测、34 项证据检查全部通过，屏幕上按实测讲，偏差逐条登记。

## Verification

看完能自己复现：① 000001.SZ 6,600 个后复权收盘（1998-11-25 → 2026-10-28）→ 5,000 个 512 点窗口（训 3,000 / 验 1,000 / 测 1,000，各隔 512 点隔离带）；② 掩码 154 = 9 段整遮 + 1 段前 10 点，32 段逐段核对；③ 编码器 66,113 参数（w1 32,768 / b1 64 / w2 32,768 / b2 512 / token 1），计划书 65,856，差 257；④ 训练 20 轮（最佳第 19 轮），末轮/首轮训练损失 0.4246，固定掩码验证损失比 0.2067（未训练 1.1069 / 已训练 0.2288）；⑤ 梯度检查（中心差分，n=32、d=4）最大相对误差 0.000000；⑥ 线性头 1,300 = (64+1)×20，λ 从 1e-3 到 1000 时 ‖W‖ 从 20.3736 单调降到 0.8367，对偶路径训练残差 0；⑦ 少样本协议：k=5 支持集恰好 5 条且与测试集交集为空，三档共用测试块，5 次重复种子各不相同；⑧ 相对 MAE 曲线 k=0/5/10/100 = 1.0000 / 1.3164 / 1.0975 / 1.0643；跨 20 只股票 k=100 = 1.0960、掩码重建 MSE 0.2498；⑨ 34 项证据检查八组全绿、39 条单测全绿。屏幕上必须出现：154、66,113、65,856、257、1,300、67,413、33,280、0.2067、0.4246、1.0000/1.3164/1.0975/1.0643、1.0960、0.2498、0.1364、34/34、39。

## Data

- `data/episode/series_000001.csv`：sz000001 后复权日线（close × adj_factor，过滤停牌），1998-11-25 → 2026-10-28，**6,600** 行；sha256 `463422fe5c88c149de089ed027b2956183d64f3042ccd1fb35c7218efebcf2d5`。
- `data/episode/fewshot.csv`：20 只 A 股对齐收盘（sz000001, sz000002, sz000858, sh600000, sh600519, sh600036, sh601318, sz000333, sz000651, sh600276, sh600030, sz002304, sh601166, sz000538, sh600887, sh601899, sz002415, sh600585, sh601012, sz300750），2018-07-27 → 2026-10-28，**1,900** 行；sha256 `cbef054f349b882352dcde407d704e007a8c1a2b30481fdb238b0fdf424cf1be`。
- 由 ts-admin `inventory/scripts/export_ch07_minifoundation.py` 从 `data/lake/bars_daily/year=*/part-000.parquet` 导出（polars；只读湖仓；close × adj_factor；非停牌）；manifest 记录行数、区间、sha256。
- 切分无重叠：训练窗口 0–2999（原始点 0–3510）、验证 3512–4511（点 3512–5022）、测试 5024–6023（点 5024–6554）；窗口内 z-score（均值 0 / 标准差 1），目标 = 未来第 20 天收盘相对窗口最后一点的变化 ÷ 窗口标准差。
- 合成对照：`ar1Series n phi sigma gen`（phi=0.99、sigma=0.3）仅用于单测「训练确实降低验证损失」，不参与真实数据结论。

## Algorithms

- ch7-mask-recon — 掩码重建（TsBase.Algos.Ch07.MaskRecon，**552 行**）：`maskSeq :: Double -> Gen -> Int -> (Vector Double, Vector Bool)`（段长 16；目标数 round(ratio·n)；先抽整段再抽 1 段遮前 r 点；权重 1/|M|）、`maskCount`、`applyMask`（被遮位置填可学习 mask 标量，不填 0——A 股 0 表示停牌）、`reconLoss`（只算被遮位置；|M|=0 显式返回 0；长度不符报错）、`Encoder`（行主序 Unboxed 向量）、`encParamCount n d = n*d + d + d*n + n + 1`（512/64 → 66,113）、`initEncoder`（Xavier sigma = sqrt(2/(n+d))，显式种子）、`encForward`、`encode`、`encLoss`、`encObjective`、`encGradients`（手写反传，ST 可变向量按样本累加）、`encGradCheck`（中心差分相对误差）、`encFlatten` / `encUnflatten`、`EncCfg` / `defaultEncCfg`（d=64、mask 0.3、lr 1e-3、batch 32、epoch 20、patience 5、seed 20261104）、`trainEncoder`（纯函数，每轮 seed + epoch×7919 洗牌、重抽掩码、Adam β 0.9/0.999 ε 1e-8、早停返回最佳）、`trainEncoderIO`（每轮打印损失与秒数）、`ar1Series`。
- ch7-flatten-head — 岭回归线性头（TsBase.Algos.Ch07.FlattenHead，**181 行**）：`type Matrix = Vector (Vector Double)`；`flattenMatrix`、`matrixShape`、`headParamCount p f = (p+1)*f`、`flattenHead :: Matrix Double -> Vector Double -> Vector Double`（H·w + b）、`fitRidge :: Double -> Matrix Double -> Matrix Double -> Vector Double`（中心化 + 截距；N ≥ p 走原始 Gram + Cholesky，N < p 走对偶；λ ≤ 0 加 1e-12 抖动）、`fitFlattenHead`、`cholFactor :: Matrix Double -> Maybe (Matrix Double)`、`cholSolve`、`columnMean`。
- ch7-shot-protocol — 少样本协议（TsBase.Algos.Ch07.ShotProtocol，**89 行**）：`Shot = ZeroShot | FewShot Int | FullShot`；`blockSizes n`（测试末 20%、验证再前 10%、余下为训练池；n < 3 报错）、`testBlock`、`valBlock`、`shotSplit :: Shot -> Int -> Int -> Int -> [(TrainSet, ValSet, TestSet)]`（支持集只从训练池洗牌抽；seed + rep×7919；k > pool 或 repeats < 1 报错）。
- 证据程序 `app/Ch07MiniFoundationEvidence.hs`（**510 行**）：读两份 CSV、建窗口、训练编码器、梯度检查、线性头与 λ 路径、探测、少样本曲线（5 次重复）、20 只股票迁移；34 项检查分 data 4 / mask 5 / param 4 / train 5 / head 6 / shot 4 / curve 3 / cross 3，写 evidence JSON + checks.txt + summary.json。

## Delivery

- 待补（make 完成后回填成片时长、音量、字幕、闪烁、流水线、讲稿、证据测试与复现命令）。

## Deviations

- **D1（参数账 65,856 → 66,113）**：计划书写 65,856，按 512→64→512 + 偏置 + 1 个可学习 mask 标量实算为 66,113，差 257；总参数 66,956 → 67,413，差 457。屏幕一律用实算值，差值写进画面与证据，不硬凑计划数。
- **D2（主结论是负结果）**：计划书断言「线性头把相对 MAE 从 1.00 降到 0.9 以下」。实测 1.0643、跨股票 1.0960，方向相反。证据与视频都按实测讲，论点改为「表示有信息 ≠ 信息能预测」；0.9 只作为「计划未实现」出现，不当作结果。
- **D3（成片 26:59，超过 24 分钟目标）**：500 行讲稿实测语音 1,328.3 s；按 LEAD 1.2 / TAIL 2.2 / 行间距节奏展开后成片 1,619.03 s（26:59）。用户明确「视频长度不限，必须讲清楚」，故不删行、不压语速；时长偏差登记在此。
- **D4（目标定义与标签重叠）**：目标用「未来 20 天相对最后一点的变化 ÷ 窗口标准差」，persistence 基线为 0；相邻窗口的未来 20 天有 19 天重合，有效样本远少于 5,000。画面明写这一点；不做重叠修正（修正会改变主结论的问题定义）。
- **D5（新增线性探测为第 6 项 head 检查）**：计划只要求 4 项头检查；为回答「表示里有什么」新增探测（64 维 → 512 点线性重建，33,280 参数，相对 MSE 0.1364）。探测是诊断，不属于模型，不计入 67,413。
- **D6（合成 AR(1) 用 phi=0.99）**：16 点整段掩码下，phi=0.9 训练 20 轮只能降 25%（0.745），达不到单测要求的 ≥50%；选 phi=0.99、n=64、d=16、lr=3e-3、batch=16 才降到 0.3097。该口径只用于验证训练实现，真实数据另有口径。
- **D7（检查分组按实现落盘）**：34 项分八组 data 4 / mask 5 / param 4 / train 5 / head 6 / shot 4 / curve 3 / cross 3；讲稿逐条对齐这个分组，不按草稿的 7/4/4 拆。
- **D8（154 = 9×16 + 10 的末端处理）**：512 / 16 = 32 段整除，154 点被实现为 9 个整段 + 第 10 段的前 10 点（该段其余 6 点不遮），因此不存在「末段截断」；单测与证据逐段断言 9 段整遮、1 段前 10 点、其余 0。
- **D9（波动率副目标被否决，未上屏）**：曾试「未来 20 天对数波动率」作副目标，曲线看似改善（k=100 → 0.9539），但检查发现切分均值漂移主导（train −0.1202 / val −0.3140 / test −0.3675，常数预测即达 0.5579），该「技能」不可解释，整段删除，最终证据不含任何波动率数字。
