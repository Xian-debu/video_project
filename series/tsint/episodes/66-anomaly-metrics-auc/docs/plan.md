# 66-anomaly-metrics-auc - 不平衡数据上的三门考卷：Acc 0.99 的模型其实什么都没学到

> status: draft (scenes, narration and stills built; delivery building)
> chapter: ch08 | runtime target: 12 min | algorithms: 3

## Thesis

同一份预测，准确率、ROC-AUC、AP 给出三种判决。99:1 的合成样本上，全判正常的模型拿 Acc=0.99，AUC 恰好 0.5，AP 只有 0.01——等于正类比例。换到 20 只 A 股、23,829 个真实点上，全判正常的 Acc 仍有 90.70%；把波动率 z≥1.0 当异常，召回 19.9%，但 2,906 个假阳把 Acc 拖到 80.35%，比什么都不做还低 10.3 个百分点。准确率看的是多数类，AUC 看全局排序，AP 看前面一段准不准；三个指标不是同一把尺。

## 核心判断

- 99:1 时「全判正常」是准确率上的作弊解：Acc=0.99，但 F1=0，召回=0；只看 Acc 会把「什么都没学到」当成「几乎满分」。
- ROC-AUC 对阈值不敏感，代价是它把后面大量真阴也计入面积；本机 20 只股票 pooled AUC=0.5408，只比随机高 0.041。
- AP 的随机基线不是 0.5，是正类比例 0.0930；本机 AP=0.1121，是基线的 1.20 倍，不是「0.11 很低」那么简单。
- 真实数据上全判正常 Acc=90.70%，z≥1.0 的 Acc=80.35%：一旦引入假阳，准确率反而下降；这不是模型变差，是指标换了分母。
- 20 只股票里 15 只 AUC>0.5，但正类率从 0.75%（工商银行）到 20.9%（中国中免）不等；同一标签、不同股票，考卷难度不同，不能直接排名。
- 单类样本上 AUC 没有定义，代码返回 Nothing；precision 在分母为零时也返回 Nothing，不做 0/0 的静默补零。
- 本集没有训练模型：标签「未来 5 日收益 < -5%」、分数「20 日已实现波动率的 250 日 z-score」都是人事先写死的。证据等级 C，不抬成 A。

## Verification

屏幕上必须出现、且能逐项回到同一次运行的数：

1. 合成 99:1：100 点、1 正 99 负、全判正常 → TP 0 / FP 0 / FN 1 / TN 99；Acc=0.99、Recall=0、F1=0、AUC=0.5、AP=0.01。
2. 黄金值：AUC 0.75（标签 [F,T,F,T]、分数 [0.5,0.4,0.3,0.9]）；AP 0.5（同一标签、分数 [0.9,0.8,0.3,0.2]）；混淆矩阵 actual [T,T,T,F×7]、pred [T,T,F,T,F×6] → TP 2 / FP 1 / FN 1 / TN 6，P=R=F1=2/3、Acc=0.8。
3. 真实 pooled：23,829 点、2,217 正、21,612 负，prevalence=0.09303789500188846；AUC=0.5408429478903407；AP=0.11209042040182658；AP/基线=1.2047824211795786。
4. 阈值表：全判正常 Acc=0.9069621049981116；z≥1.0 → P=0.13175978488198387、R=0.19891745602165087、Acc=0.803516723320324、F1=0.15851905104241554；z≥1.5、z≥2.0 逐行给出。
5. 20 只股票：15 只 AUC>0.5，中位 0.5580904244734384；最高工商银行 0.7976657329598507（9 正/1199），最低中国中免 0.4649797434733639（251 正/1199）；AP 最高海康威视 0.21425243815013412，最低长江电力 0.013461844187150898。
6. 测试：46 条全过（ConfusionMetrics 19、RocAuc 14、PrAuc 13），GHC 9.14.1 / cabal 3.16.1.0。

看完能回答：为什么 99:1 时 Acc 会骗人；AUC 与 AP 分别在奖励什么；AP 的随机基线为什么是正类比例；为什么单类样本不能算 AUC。

## Data

- ts-base data/episodes/65-error-metrics-trio/closes_2020_2025.csv：20 只 A 股、2020-01-01..2025-12-31、剔除停牌，28,949 行 / 2,211,992 字节，sha256 71b29bef4eae169fad5603342e03e8cf5bcbc496e0a766ddf1a683bae6bd5ae6。
- ts-base data/episodes/66-anomaly-metrics-auc/summary.json：synthetic、golden、pooled、20 只股票、阈值四行的全部数字与 ROC/PR 曲线（243 点各一条）。
- ts-base data/episodes/66-anomaly-metrics-auc/auc_20.csv：20 只股票一行一只的 n / positives / AUC / AP。
- ts-base inventory/evidence/ch8-anomaly-metrics.json：数据 sha256、tsBaseCommit 9312f62bc43194404d84b1ca206d5dd9c424841d、46 条测试与 metrics。
- data/auc.json：由 build/generate_auc_data.py 读上述 JSON，断言合成、黄金值、pooled、阈值、曲线端点与单调、20 只计数后写出（38,330 bytes）。
- 书页：p.205–206；式 8.7–8.10 在 pp.205–206，ROC-AUC / PR-AUC 只有文字与图 8.8。

## Algorithms

- ch8-confusion-metrics → TsBase.Algos.Ch08.ConfusionMetrics：confusion / precision（分母零返回 Nothing）/ recall / accuracy / f1 / fbeta，19 条测试。
- ch8-roc-auc → TsBase.Algos.Ch08.RocAuc：rocAuc，Mann-Whitney 秩公式、并列取平均秩、单类返回 Nothing，14 条测试。
- ch8-pr-auc-ap → TsBase.Algos.Ch08.PrAuc：averagePrecision / prAuc，同一阶梯口径，AP=Σ(R_n-R_{n-1})P_n，13 条测试。

## 场景（8 场）

1. **open · 满分、随机、废** — p.206 两条短摘录；100 点面板（99 灰 1 珊瑚）；Acc .99 / AUC .50 / AP .01 三小卡；三件事：准确率会骗人、排序看 AUC 与 AP、边界写进代码；右下角 C 级证据卡。
2. **problem · 全判正常，准确率九十九** — 100 点 + 混淆矩阵 TP0/FP0/FN1/TN99；四指标小卡；右侧真实数据全判正常 Acc 90.7%、prevalence 9.3%、23,829/2,217。
3. **definitions · 四个计数，三条曲线** — P/R/Acc 式 8.7–8.9；Fβ 式 8.10 与 AUC 秩公式；PR-AUC 与 AP 阶梯式；随机基线 0.0930。
4. **intuition · 曲线只比随机高一点** — 本机 pooled ROC 与 PR 两条曲线（各 243 点）；AUC .5408、AP .1121、AP÷基线 1.20×；20 只极值。
5. **implementation · 先把边界写成断言** — 三个模块的代码卡与手算样例：混淆矩阵 2/1/1/6、AUC 0.75、AP 0.5；46 条断言。
6. **verification · 每个数都能回到一次运行** — 四组统计卡（100 点 / 23,829 点 / 1.20 倍 / 46 条）；20 只 AUC+AP 全表；阈值表（全判正常 + z 1.0/1.5/2.0）。
7. **boundary · 七个边界，一把尺子** — 证据、标签、分数、样本、阈值、单类、等级。
8. **outro · 先问谁在少数。** — 三张回执；九章地图；下一集 E67 时间序列不能随机切。

## Claims

| 陈述 | 等级 | 依据 |
| --- | --- | --- |
| P/R/Acc/Fβ 的定义与式号 | B | 书中 pp.205–206，式 8.7–8.10 |
| ROC-AUC 与 AP 的排序含义 | B | 书中 p.206 文字 + 图 8.8；公式按 Fawcett 2006 / Davis & Goadrich 2006 |
| 99:1 合成样本 Acc=0.99 / AUC=0.5 / AP=0.01 | A | ConfusionMetrics/RocAuc/PrAuc + 46 条测试 + summary.json |
| pooled AUC=0.5408、AP=0.1121、AP/基线=1.20 | A | closes CSV + summary.json + auc.json 断言 |
| z≥1.0 的 Acc=80.35%，低于全判正常 90.70% | A | summary.json thresholds + auc.json 断言 |
| 20 只中 15 只 AUC>0.5 | A | auc_20.csv + auc.json extremes 断言 |
| 单类样本 AUC 无定义 | B | 定义本身；代码返回 Nothing 并有测试 |
| 「准确率会骗人」「先问谁在少数」 | 本集判断 | 基于公式与数据的编辑归纳，不冒充原文 |

## Evidence

- 生成器：build/generate_auc_data.py（读 ts-base summary/evidence，断言后写 data/auc.json）
- 数据：ts-admin inventory/scripts/export_ch08_metrics.py → ts-base data/episodes/65-error-metrics-trio/closes_2020_2025.csv
- 证据 JSON：ts-base data/episodes/66-anomaly-metrics-auc/summary.json、auc_20.csv、inventory/evidence/ch8-anomaly-metrics.json
- 测试：cabal test 46 条全过（19 + 14 + 13）

## Delivery

- 旁白：194 条，实测 501.5 s 语音，assets/audio/narration.wav 698.92 s（0 overrun）；TTS zh-CN-YunyangNeural。
- 配乐：复用第 01 集 score.wav 822 s（seed=11 / energy=0.8 / bpm=84 / minor），混音 bed 增益 -4.5 dB。
- 成片：待 make（预计 698.92 s / 20,968 帧）。
