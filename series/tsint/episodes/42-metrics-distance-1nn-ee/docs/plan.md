# 42-metrics-distance-1nn-ee - 距离决定一切：从 1-NN+DTW 到弹性集成

> status: ready（2026-11-02 晚交付） · chapter: ch05 | runtime: 22 min | 3 algorithms
> 算法 ts-base `2affc73` | 数据 ts-admin `315cbb8`

## Thesis

在 A 股 60 日收益窗上，把欧氏 1-NN 换成 DTW 1-NN 的准确率提升不足 2 个百分点——「DTW 显著更好」在本数据上大概率不成立，而这正是 11 个弹性距离还要加权集成的原因。

## Verification

看完能自己跑出：① 一张 3 分类器 × 20 次平衡抽样的排名表；② Nemenyi CD 图（CD = 0.7409，三对秩差全部小于 CD）；③ DTW 与欧氏的准确率差实测值（0.0 个百分点）；④ EE(4 距离) 的留一权重条形图。屏幕上会出现：0.8333（macro-F1 黄金值）、CD 数值、两组准确率差、4 个权重值。

计划里写的「CD≈1.16」是算错了的数（q 取错 + 除错），正确值 0.7409；结论不受影响，三对秩差仍全部小于临界差。

## Data

ts-admin 日线表：股票代码、交易日、close；沪深 300 成分股里的银行 / 半导体 / 医药，2015-01-05 至 2025-12-31。实际 60 只（银行 25、半导体 18、医药 17，见 Deviations），panel_close.csv 2,674 行 × 60 列，每只票 723–2,673 个对数收益点；窗口 60 个交易日，第 i 只票取起点 `(i*977+31) mod (nRets-60+1)`，一个窗口一个样本，标签 = 行业。合成对照集：3 类 motif（sin 周期 8/12/20，固定相位，高斯噪声 0.1），每类 50 条，训练 150 / 测试 30；查询再循环左移 5 点。

## Algorithms

- ch5-metrics - 分类评估与 Nemenyi CD 图 (TsBase.Algos.Ch05.Metrics)
- ch5-dtw - DTW 距离与 1-NN 分类器 (TsBase.Algos.Ch05.Dtw)
- ch5-ee - 弹性集成（四个弹性距离加权 1-NN） (TsBase.Algos.Ch05.ElasticEnsemble)

## Implementation

- ts-base 三模块纯 Haskell，手写无外部数值库：`src/TsBase/Algos/Ch05/Metrics.hs`（24 测试）、`Dtw.hs`（16）、`ElasticEnsemble.hs`（18），合计 58 个新测试；证据程序 `app/Ch05MetricsEvidence.hs`，命令行入口 `evidence-ch05-metrics`。
- 证据跑：`cabal run -v0 tsbase -- evidence-ch05-metrics --data data/episodes/42-ch05-tsclassification --out data/episodes/42-ch05-tsclassification --evidence inventory/evidence`，20/20 PASS / 62.8 s，summary.json 与 `inventory/evidence/42-ch05-tsclassification.ch5-metrics.json` 同时落盘。
- 主读数（60 窗留一 1-NN）：ED 0.4167 / macro-F1 0.3918（25/60）；DTW 带宽 6 0.4167 / 0.4084（25/60）；EE 0.4667 / 0.4557（28/60）。EE 权重：导数 DTW 0.7273、加权 DTW 0.1818、普通 DTW 0.0909、LCSS 0.0000。
- 混淆矩阵揭示机制：ED 的医药召回只有 0.1765（3/17），DTW 提到 0.3529（6/17），但银行 13→12、半导体 9→7 少对、医药行多对的错位被对称抵消，总数仍是 25。
- 带宽消融：去掉带宽约束降到 0.3500（21/60），差 6.7 个百分点；这条读数由证据程序里 `main.dtwFree` 直接产出，不是手填。
- 20 次平衡抽样（每次每类 10 只、共 30 窗）：平均秩 EE 1.7500 < ED 1.9000 < DTW 2.3500；CD(3,20) = 0.7409（q = 2.343），三对秩差 0.4500 / 0.1500 / 0.6000 全部不显著。
- 合成对照：干净查询 ED / DTW / EE 全 1.0000；左移 5 点后 ED 0.0000、DTW 1.0000、EE 1.0000——教科书结论只在存在平移的合成数据上成立。
- Boxed/unboxed 两套向量是这一集最花时间的坑：Metrics 要装元组与嵌套表用 boxed，Dtw 的 Series 用 unboxed Double，混用时索引与 sum 的算子不同，编译器连报六个类型错。

## Boundary（不声称与欠账）

- 六十个窗不是六十个独立样本：同行业个股同涨同跌，有效样本远小于 60，置信区间比二项分布宽，所有读数按「小样本」读。
- 集成权重在全部 60 个窗上算完再评同一批数据，读数偏乐观；正确做法是双层留一（外层留一个，内层只用剩下 59 个算权重），这一集没做。
- 参数是选的：带宽 6、LCSS 容差 0.2、加权 DTW g = 0.05 都固定，没有做敏感性扫描，不知道六是不是最优；只知道去掉带宽会掉 6.7 个百分点。
- 类别标签来自证监会门类，粗且边界重叠：半导体与电子设备同门，医药里混医疗器械与中药，标签本身有噪声，准确率天花板不是 100%。
- 显著性的正解是「这批数据看不出差异」，不是「三个距离等价」；Nemenyi 在 N = 20 时检验力有限。
- 欠账：① 双层留一；② 11 个弹性距离只实现了 4 个；③ 真实收益窗里没有「同形状、纯平移」样本，DTW 的优势没有可发挥的余量，这一点只用合成对照做了单侧验证。

## Deviations（与计划不同之处）

- 三个行业各 30 只的计划落空：HS300 里银行只有 25 只、医药口径下 17 只、半导体 18 只。如实按湖里体量做（25 / 18 / 17），用类内抽样 + macro 读数处理不平衡，不硬凑 30 只。
- 计划的 CD≈1.16 算错，正确 0.7409（见 Verification）。
- 计划写「11 个弹性距离加权 1-NN」，本集只实现 4 个（DTW / 导数 DTW / 加权 DTW / LCSS）；另 7 个留给后续集，屏幕上写明「四个距离」。
- 合成数据用固定相位（计划写相位随机）：随机相位会让训练集本身覆盖平移，ED 在平移后仍能到 0.9+，复现不出「ED 掉到 0」；固定相位 + 平移 5 点才把 DTW 的抗错位单独拎出来。
- 证据检查总数保持 20 条：把原来一条较弱的检查替换成「band6 > band-free 且 band-free = 0.3500」，不新增条数，避免改讲稿与重录旁白。
- DTW 带宽固定 6（计划未定），归一化用 sqrt(D/(n+m))。

## Delivery（2026-11-02 晚）

- 成片：`delivery/Tsint42MetricsDistance1nnEe.mp4`，926.37 s（15:26.37）/ 27,791 帧 / 8 场 45 页 / −15 LUFS / TP −2 dBFS / LRA 2.2；mp4 48,308,048 B。
- 旁白：272 条（发声 851.5 s），字幕跨度 00:00:01,200 → 00:15:24,150，0 条换行、最长 28 字；8 章合计 926.35 s。
- 流水线：make 23 个 stage 全 ok，8 段 rendered 8（reused 0，tree `dc20cb2af7fda192`）；mix 48 kHz / 927.55 s、peak −1.00 dBFS、RMS −26.90 dBFS、ducked 53.8%（4.5 dB）、musicGain −4.5；stem full −25.1 / audible −27.88（share 63.1% / sub 6.8%）；mixGate speech −23.48、gap_full −30.48、gap_audible −33.25、bed 36.8；闪烁 27,791 帧 mean 19.80 / min 14.77 / max 25.00、mean|d| 0.0139、p99 0.1693、max 7.16、7 切点（2249 / 5461 / 10667 / 15326 / 18358 / 23819 / 26522）。
- 导出：srt 18,877 B / chapters 459 B / ffmeta 833 B / cover.png 77,367 B（帧 20）。score 复用 `out/e04-score-loop-48k.wav`（1560 s，scoreReused false），make 的 `--out` 直接指向 pack 的 delivery，引擎 `out/` 无 `tsint-*` 残留。
- 静帧复核：45 页全部按页中点渲出，修 6 处（带宽图说明被字幕压住、对齐矩阵底部标签贴字幕、problem 标题「三次」→「二十次」、CheckGrid 分组标签重复、验证页补医药召回两个小数、收尾标题折行），另把「去掉带宽 0.3500」接进证据字段（ts-base `2affc73`）。
- 返工：首轮静帧用的是旧 lines.json（TTS 定稿前 dump），页面与字幕错位约 1 s；重 dump（272 行 / 926.35 s）后重渲。make 首轮没带 `--score`，现场合成 927 s 床（单核 8 分钟还没到一半），杀掉后改用共享床，二轮 PASS。
