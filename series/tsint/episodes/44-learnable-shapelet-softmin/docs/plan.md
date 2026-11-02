# 44-learnable-shapelet-softmin - 把 min 换成 SoftMin：Shapelet 终于可以求导

> status: ready
> chapter: ch05 | runtime: 24 min target (actual 22:18) | algorithms: 3

## Thesis

第 43 集的 shapelet 模板只能「枚举」：min 的梯度是 one-hot，九十二个窗口为零，模板无法从数据里学。把 min 换成 SoftMin（alpha 可控的软最小值），梯度变成一组 softmax 权重，模板的每个参数都能收到所有窗口的信号。本集实测：真实收益三分类准确率从搜索模板的 0.3429 升到 0.5524（+21.0 pp），而书里两条定量结论——「alpha 每放大十倍落点误差缩小十倍」和「alpha>500 训练停住」——都没有复现，按实测改写。

## Verification

看完能自己复现：

1. **黄金值**：三个零距离、alpha=1 时 SoftMin = −log 3 = −1.0986；alpha=1e6 时与 min 的差 < 1e-5；四个权重之和 = 1.0000。
2. **软到硬**：距离 [0, 0.5, 1, 1.5] 上，alpha=1 权重 [0.4551, 0.2760, 0.1674, 0.1015]，alpha=20/200 退化为 [1, 0, 0, 0]；min 的零权重比例 0.9892。
3. **alpha 扫描**：三档 alpha=1/10/100，分类全对（1.00/1.00），落点误差 1.8113 / 2.1242 / 2.1415。
4. **退火**：三十轮 1→20→200，损失 1.4455 → 0.0129（换档处一次上跳），测试准确率 1.00，五个模板平均落点误差 1.8201。
5. **下溢**：alpha=200/500/1000 时六个窗口里分别 2/4/5 个权重归零（0.3333/0.6667/0.8333）。
6. **没停住**：alpha=1000 跑十二轮，损失 1.6205 → 0.0731（−95.4885%），测试准确率 1.00，零权重比例 0.9032 —— 下溢把 SoftMin 压成硬 min，但没有断流。
7. **真实数据**：150 只股票（45 训练 / 105 测试），学到模板 0.5524；搜索模板 0.3429；DTW 1-NN 0.5143；随机 0.3333。五个模板平均落点误差 2.0754。
8. **树与 MLP**：五个学到的距离当特征，深度 2 就到训练/测试 1.00；二十个原始点当特征，拐点深度 4（训练 0.9444 / 测试 0.8667，gap 0.0778）；100-16-3 MLP 在合成数据测试 0.9667，梯度校验 0.0000。

屏幕上必须出现：−1.0986、1.8113 / 2.1242 / 2.1415、1.4455 → 0.0129、0.9032、0.5524、0.3429、0.5143、0.3333、深度 2 / 深度 4。

## Data

主：合成 3 类 motif（周期 8/12/20）× 50 条 × 长度 100 × 噪声 0.1。序列 150 条，训练 90 / 测试 60，模板长度候选 [8, 12, 20]，seed 20261102。

对照：复用第 43 集 ts-admin 导出的面板（全市场同门类各 50 只、1,942 行 × 150 列、2018-01-02..2025-12-31、sha256 0ccdea98…），每只取最后 100 个交易日收盘价；窗口 100、45 训练 / 105 测试。

证据：ts-base `app/Ch05LearnEvidence.hs`，35 组检查、11.7954 s；summary 与 checks 写进 `data/episodes/44-learnable-shapelet-softmin/`。

## Algorithms

- **ch5-shapelet-learn** — 可学习 shapelet（SoftMin 距离 + 线性分类头 + Adam + 三段退火）(`TsBase.Algos.Ch05.LearnShapelet`, 17 cases)
- **ch5-shapelet-tree** — 距离特征决策树（5 个学到的距离 vs 20 个原始点）(`TsBase.Algos.Ch05.ShapeletTree`, 19 cases)
- **ch5-mlp** — 100-16-3 MLP（反向传播、梯度校验、Adam）(`TsBase.Algos.Ch05.Mlp`, 14 cases)

全仓库测试 139 套 / 1,896 条断言，本集新增 50 条（17+19+14）。

## Implementation

- `LearnShapelet.hs`：softMin / softMinGrad（= softmax）/ underflowFraction / windowMatrix / sqDists / shapeletDist / initModel / trainShapelets / modelLoss / modelAccuracy / sampleGrad / landError / flatParams。
- `ShapeletTree.hs`：distanceVector / distanceMatrix / fitTree / predictTree / treeAccuracy / treeDepth / treeLeaves / bestSplit。
- `Mlp.hs`：initMlp / forward / logitsOf / crossEntropy / mlpGrad / numericGrad / gradCheck / trainMlp / flatMlp。
- 本集踩过最大的坑：形状梯度必须先把 logits 梯度乘回权重矩阵（dds），不能把距离当 dL/dd。
- 数值稳定用 log-sum-exp 变形（第三次在本系列出现）。

## Boundary

- 「十倍规则」只在分类目标下被否定；重建目标下的版本未测。
- alpha > 1000 的数值行为未测（只到 1000）。
- 模板长度固定 [8, 12, 20]，没有连续搜索。
- 真实数据只跑 seed 7 一组，没有多随机初始化的方差。
- 真实收益窗口是收盘价单通道；「哪几天」的局部定位留给下一集卷积 + GAP-CAM。

## Deviations

1. **数据口径**：计划「HS300 150 只、60 日 × 5 字段」，实际沿用第 43 集全市场同门类各 50 只、100 日 close 单通道（5 字段留给 E45 CNN 的多通道卷积核）。
2. **十倍规则不成立**：计划 alpha 每放大十倍落点误差缩小十倍；实测 1.8113 / 2.1242 / 2.1415（alpha=1/10/100），不降反略升。原因是训练目标是分类交叉熵而非重建，分类早已满分，模板没有还原真形状的压力。
3. **alpha>500 没停住**：计划 alpha>500 梯度下溢、训练停住；实测 alpha=1000 十二轮损失下降 95.5%、准确率 1.00。下溢只把非最小窗口权重压成零，梯度仍从最小窗口回传，SoftMin 退化成硬 min。
4. **树拐点**：计划用树深-准确率拐点说明过拟合；实际五个学到的距离深度 2 就满分、没有过拟合段；改用 20 个原始点后才在深度 4 出现拐点（gap 0.0778）。

以上四条同时写进 ts-base `manifest.json`、本片 `data/dist.json` 的 `meta.deviations`、以及成片 boundary 场景画面。

## Delivery

- 成片 **1,291.53 s（21:31.53）/ 38,746 帧 / 8 场 38 页 / 342 条旁白（发声 1,204.2 s）/ −15 LUFS / TP −2 dBFS / LRA 2.5**。
- 交付物：`delivery/Tsint44LearnableShapeletSoftmin.mp4`（66,829,398 B）、`cover.png`（82,542 B，帧 20）、`tsint-44.srt`（26,124 B，342 cue，0 换行，最长 33 字）、`tsint-44.chapters.txt`（454 B）、`tsint-44.chapters.ffmeta.txt`（835 B）。
- 混音：48 kHz / 1,292.72 s，peak −1.01 dBFS、RMS −26.58 dBFS、musicGain −4.5 dB、ducked 57.0%；stem full −25.1 / audible −27.88（share 63.1% / sub 6.8%）；mixGate speech −23.55 / gap_full −30.90 / gap_audible −33.62 / bed 36.4。
- 闪烁门：38,746 帧 mean 20.72 / min 14.73 / max 22.84、mean|d| 0.0131、p99 0.1091、max 7.16、7 切点（3684 / 7597 / 14208 / 19639 / 24602 / 31832 / 36953）。
- make 首轮 PASS（23 stage 全 ok、8 段 rendered 8、reused 0），tree `68c90e7b5c611a00`。
- 分数床复用 E04 的 1560 s 循环（scoreReused false）；封面帧 20；film.json status ready、assetsStatus complete。
