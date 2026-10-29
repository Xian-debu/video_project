# 41-ad-sparse-prior-dual-attention - 换掉一个假设：SBT 稀疏二值注意力、Student-t 重尾先验、DCdetector 双注意力

> status: draft (scaffolded, not produced)
> chapter: ch04 | runtime target: 29 min | algorithms: 3

## Thesis

性能提升常常不在更深的网络，而在换掉一个假设：SBT 把注意力换成二值稀疏掩码（回应噪声稀疏）、TVAE 把高斯先验换成 Student-t 重尾（回应 A 股跳空）、DCdetector 把单一注意力拆成互为对比的两支（回应模式多义）——三个『换假设』分别对应三种真实数据病。

## Verification

屏幕必须出现：①SBT 的二值权重集合与 Step-T 因果性测试结果 ②TVAE 的 p(0)=1/π 黄金值与跳空日高斯/重尾两版分数 ③DCdetector 的 L=ln(#neg+1) 黄金值 ④三者与对应基线（第6集的注意力、第7集的VAE、第9集的InfoNCE）在同一注入集上的 F1 对照

## Data

ts-admin：SBT/TVAE 用 600519.SH 日线 2010–2026（C=100，含涨跌停与停复牌日作重尾样本）；DCdetector 用 5 分钟线 2023–2026 切片（patch=16、stride=8）。注入①③④各 1%，种子 42。评分口径：点调整（主）+ 范围调整（副）；TVAE 额外单列『跳空日分数』作为重尾假设的直接证据。

## Algorithms

- ch4-sbt - SBT 稀疏二值注意力 (TsBase.Algos.Ch04.SBT)
- ch4-tvae - Student-t 先验 VAE（RDSMM） (TsBase.Algos.Ch04.TVAE)
- ch4-dcdetector - DCdetector patch 双注意力对比 (TsBase.Algos.Ch04.DCDetector)
