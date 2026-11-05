# 《时序智能》B 站发布报告

生成时间：2026-11-05 14:16:48 +0800（由 series/tsint/release/make_report.py 从 manifest + ledger 生成，不要手改）。

## 一、结论

- 目标：把 74 集《时序智能》全部以公开可见投稿到 B 站，逐批验证后提交台账。
- 进度：**51/74 集已投稿**，失败 1 集，未开始 22 集。
- 规模：已投稿时长 915:16（54915 秒）、2.45 GB；全系列 1324:08、3.56 GB。
- 每集简介含固定行「源码与实验证据（Haskell）：https://github.com/Xian-debu/ts-base」，由 audit_published.py 逐集校验。

## 二、涉及仓库

| 仓库 | 用途 | 许可 |
| --- | --- | --- |
| https://github.com/Xian-debu/ts-base | Haskell 算法实现与实验证据（每集数字来源） | BSD-3-Clause |
| https://github.com/Xian-debu/ts-admin | 数据导出与管道脚本 | MIT |
| https://github.com/Xian-debu/video_project | 内容包/渲染/发布台账与工具（本报告所在仓） | BSD-3-Clause |

## 三、逐集台账

| # | 标题 | 时长 | 体积 | 状态 | BV / 原因 | 已复核 |
| ---: | --- | ---: | ---: | --- | --- | :---: |
| 01 | 时序智能 · 第01集｜一条序列，五个问题：从任务定义到可复算的管线 | 13:42 | 37.34 MB | submitted | [BV11oxZ66E2f](https://www.bilibili.com/video/BV11oxZ66E2f/) | OK |
| 02 | 时序智能 · 第02集｜缺失值三法：谁在偷偷改变你的方差 | 18:25 | 48.68 MB | submitted | [BV1TXxZ6VEy1](https://www.bilibili.com/video/BV1TXxZ6VEy1/) | OK |
| 03 | 时序智能 · 第03集｜滑动平均与一次指数平滑：N 和 α 是同一把尺子的两种刻度 | 21:40 | 54.54 MB | submitted | [BV1bDxZ6yEsT](https://www.bilibili.com/video/BV1bDxZ6yEsT/) | OK |
| 04 | 时序智能 · 第04集｜Holt 家族：三行递推把趋势和季节塞进指数平滑 | 24:41 | 63.61 MB | submitted | [BV1Juxf6aEgR](https://www.bilibili.com/video/BV1Juxf6aEgR/) | OK |
| 05 | 时序智能 · 第05集｜三种平稳化：差分、对数、Z-score 各治什么病 | 20:09 | 50.88 MB | submitted | [BV1PFxf6BEK7](https://www.bilibili.com/video/BV1PFxf6BEK7/) | OK |
| 06 | 时序智能 · 第06集｜经典分解与两个强度指标：趋势有多强，季节有多强 | 22:50 | 60.07 MB | submitted | [BV1rNxf6NEmz](https://www.bilibili.com/video/BV1rNxf6NEmz/) | OK |
| 07 | 时序智能 · 第07集｜频域与分块：FFT、基展开、Patch 三种「换坐标系」的方式 | 21:39 | 58.98 MB | submitted | [BV1EhxZ6tEuD](https://www.bilibili.com/video/BV1EhxZ6tEuD/) | OK |
| 08 | 时序智能 · 第08集｜冷门三指标：ADF 检验、漂移性、转移性 | 22:24 | 59.86 MB | submitted | [BV1wAxf6iERQ](https://www.bilibili.com/video/BV1wAxf6iERQ/) | OK |
| 09 | 时序智能 · 第09集｜MLP 与 TCN：从一行仿射变换到因果膨胀卷积 | 25:06 | 64.03 MB | submitted | [BV1BhxZ6tEVM](https://www.bilibili.com/video/BV1BhxZ6tEVM/) | OK |
| 10 | 时序智能 · 第10集｜注意力：一次 softmax 加权，把「对齐」变成可看的矩阵 | 17:30 | 47.53 MB | submitted | [BV1JbxZ6fEcT](https://www.bilibili.com/video/BV1JbxZ6fEcT/) | OK |
| 11 | 时序智能 · 第11集｜循环三兄弟：一条梯度路径的三种走法 | 19:47 | 54.07 MB | submitted | [BV1zbxZ6fEb7](https://www.bilibili.com/video/BV1zbxZ6fEb7/) | OK |
| 12 | 时序智能 · 第12集｜卷积与图卷积：同一件事的两种定义域 | 18:38 | 48.76 MB | submitted | [BV1jexZ6xEkq](https://www.bilibili.com/video/BV1jexZ6xEkq/) | OK |
| 13 | 时序智能 · 第13集｜归一化三兄弟：差别只在「用谁的统计量」 | 14:40 | 38.27 MB | submitted | [BV1HWxZ6AEDQ](https://www.bilibili.com/video/BV1HWxZ6AEDQ/) | OK |
| 14 | 时序智能 · 第14集｜非平稳注意力：一个标量 τ 与一个向量 Δ 能改什么 | 12:29 | 33.83 MB | submitted | [BV1HWxZ6AEeU](https://www.bilibili.com/video/BV1HWxZ6AEeU/) | OK |
| 15 | 时序智能 · 第15集｜缺失值三法：邻域、低秩、因子 | 13:48 | 37.41 MB | submitted | [BV1JtxZ68EaU](https://www.bilibili.com/video/BV1JtxZ68EaU/) | OK |
| 16 | 时序智能 · 第16集｜相关性与 STL：一个数说面板，一条分解说序列 | 13:25 | 36.92 MB | submitted | [BV1JtxZ68EaM](https://www.bilibili.com/video/BV1JtxZ68EaM/) | OK |
| 17 | 时序智能 · 第17集｜滑窗、指标与选模：先把「分数」这件事做对 | 13:57 | 37.22 MB | submitted | [BV1ztxZ68EX2](https://www.bilibili.com/video/BV1ztxZ68EX2/) | OK |
| 18 | 时序智能 · 第18集｜归一化三兄弟：RevIN、NowNorm、MeanNorm | 14:01 | 36.95 MB | submitted | [BV1n4xZ6cEwY](https://www.bilibili.com/video/BV1n4xZ6cEwY/) | OK |
| 19 | 时序智能 · 第19集｜线性复兴：DLinear 与 FITS | 21:04 | 58.20 MB | submitted | [BV1n4xZ6cEpy](https://www.bilibili.com/video/BV1n4xZ6cEpy/) | OK |
| 20 | 时序智能 · 第20集｜卷积看时序：因果空洞卷积、FFT 周期、二维聚合 | 16:35 | 46.13 MB | submitted | [BV1XCxZ6JEYs](https://www.bilibili.com/video/BV1XCxZ6JEYs/) | OK |
| 21 | 时序智能 · 第21集｜注意力三件套：多头自注意力、Transformer 块、因果掩码 | 14:16 | 36.88 MB | submitted | [BV1ivxZ6REpG](https://www.bilibili.com/video/BV1ivxZ6REpG/) | OK |
| 22 | 时序智能 · 第22集｜概率预测入门：高斯 NLL、分位数损失、分位数指标 | 15:06 | 38.79 MB | submitted | [BV196xZ6HEaa](https://www.bilibili.com/video/BV196xZ6HEaa/) | OK |
| 23 | 时序智能 · 第23集｜概率预测进阶：CRPS、区间覆盖率、VAE 的 ELBO | 14:34 | 37.71 MB | submitted | [BV196xZ6HEQS](https://www.bilibili.com/video/BV196xZ6HEQS/) | OK |
| 24 | 时序智能 · 第24集｜通道关系三法：混合 MLP、iTransformer、图通道 | 13:26 | 36.25 MB | submitted | [BV1e6xZ6HEFE](https://www.bilibili.com/video/BV1e6xZ6HEFE/) | OK |
| 25 | 时序智能 · 第25集｜递归与分段：RNN 的两条生成路 | 12:53 | 32.92 MB | submitted | [BV15BxZ6XEwt](https://www.bilibili.com/video/BV15BxZ6XEwt/) | OK |
| 26 | 时序智能 · 第26集｜序列压缩三法：奇偶下采样、周期下采样、最后时刻压缩 | 11:35 | 31.17 MB | submitted | [BV1LBxZ69Eun](https://www.bilibili.com/video/BV1LBxZ69Eun/) | OK |
| 27 | 时序智能 · 第27集｜块嵌入与两种注意力架构：PatchTST 与交叉注意力解码器 | 11:48 | 32.19 MB | submitted | [BV1eY4t6BEss](https://www.bilibili.com/video/BV1eY4t6BEss/) | OK |
| 28 | 时序智能 · 第28集｜通道三补集：混合 MLP、路由注意力、动态聚类 | 14:02 | 39.34 MB | submitted | [BV15Y4t6BE7D](https://www.bilibili.com/video/BV15Y4t6BE7D/) | OK |
| 29 | 时序智能 · 第29集｜概率生成补集：Copula、扩散损失、连续流 | 14:43 | 41.88 MB | submitted | [BV15Y4t6BEW9](https://www.bilibili.com/video/BV15Y4t6BEW9/) | OK |
| 30 | 时序智能 · 第30集｜地基：窗口·指标·评分——异常检测里 80% 的差别不在模型 | 17:42 | 47.69 MB | submitted | [BV1La4t6uEwz](https://www.bilibili.com/video/BV1La4t6uEwz/) | OK |
| 31 | 时序智能 · 第31集｜分数怎么变成 0/1：阈值、分类器，与最笨的基线 | 16:36 | 45.94 MB | submitted | [BV15a4t6uER4](https://www.bilibili.com/video/BV15a4t6uER4/) | OK |
| 32 | 时序智能 · 第32集｜三种几何直觉：距离、密度、随机分割 | 16:11 | 44.36 MB | submitted | [BV15a4t6uEiN](https://www.bilibili.com/video/BV15a4t6uEiN/) | OK |
| 33 | 时序智能 · 第33集｜卷积看见了未来：因果卷积、膨胀核与 TCN | 16:50 | 46.21 MB | submitted | [BV1Yi4t6iEJ1](https://www.bilibili.com/video/BV1Yi4t6iEJ1/) | OK |
| 34 | 时序智能 · 第34集｜预测未来，误差就是分数：GRU 单元与 LSTM 预测器 | 18:48 | 47.66 MB | submitted | [BV1Xi4t6iEUG](https://www.bilibili.com/video/BV1Xi4t6iEUG/) | OK |
| 35 | 时序智能 · 第35集｜注意力矩阵里的异常：关联差异、两阶段焦点与次邻域遮罩 | 22:23 | 64.78 MB | submitted | [BV1Vv4t6TE4m](https://www.bilibili.com/video/BV1Vv4t6TE4m/) | OK |
| 36 | 时序智能 · 第36集｜从重构到概率：AE 与 VAE 的潜空间 | 20:51 | 57.71 MB | submitted | [BV1Vv4t6TEBP](https://www.bilibili.com/video/BV1Vv4t6TEBP/) | OK |
| 37 | 时序智能 · 第37集｜混合先验：GMM-VAE 与『多个正常模式』 | 19:22 | 53.12 MB | submitted | [BV1Vv4t6TEYu](https://www.bilibili.com/video/BV1Vv4t6TEYu/) | OK |
| 38 | 时序智能 · 第38集｜图上的异常：增强、对比损失与 TopK 邻接 | 18:07 | 49.59 MB | submitted | [BV1744t6kE57](https://www.bilibili.com/video/BV1744t6kE57/) | OK |
| 39 | 时序智能 · 第39集｜残差与邻居：ARIMA 残差检测与 Matrix Profile di… | 19:10 | 52.48 MB | submitted | [BV1744t6kEVU](https://www.bilibili.com/video/BV1744t6kEVU/) | OK |
| 40 | 时序智能 · 第40集｜两个解码器，一个说谎：USAD 对抗、DAGMM 能量与多 AE 中位数 | 16:53 | 51.56 MB | submitted | [BV17x4t6VE9b](https://www.bilibili.com/video/BV17x4t6VE9b/) | OK |
| 41 | 时序智能 · 第41集｜换掉一个假设：SBT 稀疏二值注意力、Student-t 重尾先验、D… | 15:09 | 45.83 MB | submitted | [BV1Bx4t6VE3e](https://www.bilibili.com/video/BV1Bx4t6VE3e/) | OK |
| 42 | 时序智能 · 第42集｜距离决定一切：从 1-NN+DTW 到弹性集成 | 15:26 | 46.07 MB | submitted | [BV17x4t6VEkA](https://www.bilibili.com/video/BV17x4t6VEkA/) | OK |
| 43 | 时序智能 · 第43集｜Shapelet：从一条序列里挖出一小段判别力 | 18:47 | 56.62 MB | submitted | [BV1L84t66EXt](https://www.bilibili.com/video/BV1L84t66EXt/) | OK |
| 44 | 时序智能 · 第44集｜把 min 换成 SoftMin：Shapelet 终于可以求导 | 21:32 | 63.73 MB | submitted | [BV1v84t66EUS](https://www.bilibili.com/video/BV1v84t66EUS/) | OK |
| 45 | 时序智能 · 第45集｜卷积、残差与 GAP：让分类器指出「哪几天在起作用」 | 21:29 | 62.16 MB | submitted | [BV1Lb4t63Eon](https://www.bilibili.com/video/BV1Lb4t63Eon/) | OK |
| 46 | 时序智能 · 第46集｜感受野之争：RNN、Brick 并行与空洞卷积 | 23:07 | 67.36 MB | submitted | [BV1jb4t63ExE](https://www.bilibili.com/video/BV1jb4t63ExE/) | OK |
| 47 | 时序智能 · 第47集｜谁在影响谁：图卷积、图注意力与自注意力 | 20:31 | 60.10 MB | submitted | [BV1jb4t63EnV](https://www.bilibili.com/video/BV1jb4t63EnV/) | OK |
| 48 | 时序智能 · 第48集｜没有标签怎么办：增强、对比与掩码重构 | 24:06 | 67.64 MB | submitted | [BV1t14t68Eyu](https://www.bilibili.com/video/BV1t14t68Eyu/) | OK |
| 49 | 时序智能 · 第49集｜换一种表示：图像化编码与多域集成 | 24:04 | 65.69 MB | submitted | [BV1b14t68EM9](https://www.bilibili.com/video/BV1b14t68EM9/) | OK |
| 50 | 时序智能 · 第50集｜自动选模型：池子比策略更重要 | 18:20 | 50.18 MB | submitted | [BV1My4t6cEfm](https://www.bilibili.com/video/BV1My4t6cEfm/) | OK |
| 51 | 时序智能 · 第51集｜省算力的两把刀：遗传算法与学习曲线外推 | 21:00 | 61.37 MB | submitted | [BV1uy4t6cEgu](https://www.bilibili.com/video/BV1uy4t6cEgu/) | OK |
| 52 | 时序智能 · 第52集｜把 300 只股票当成 300 个任务：元学习选模型 | 20:06 | 55.25 MB | failed | 失败：[submit-readback] 点提交后读不回 bvid：稿件管理页 120000ms 内找不到标题「时序智能 ·… |  |
| 53 | 时序智能 · 第53集｜平均能赢平均，赢不过最强 | 18:56 | 51.55 MB | pending | 未开始 |  |
| 54 | 时序智能 · 第54集｜把架构搜索变成可微：DARTS 与三层搜索空间 | 26:39 | 75.22 MB | pending | 未开始 |  |
| 55 | 时序智能 · 第55集｜省算力的三种剪枝：子空间、比较器与组合预测器 | 20:32 | 58.26 MB | pending | 未开始 |  |
| 56 | 时序智能 · 第56集｜先筛模型再调权：遗传算法筛选 + 核岭回归融合 | 21:21 | 61.78 MB | pending | 未开始 |  |
| 57 | 时序智能 · 第57集｜把序列切成块：Patch、周期、分辨率前缀 | 17:56 | 49.35 MB | pending | 未开始 |  |
| 58 | 时序智能 · 第58集｜通道独立还是混合：一个由相关性决定的选择题 | 20:35 | 58.23 MB | pending | 未开始 |  |
| 59 | 时序智能 · 第59集｜一万个参数的「基础模型」：掩码重建 + 线性头 + 少样本 | 26:59 | 84.53 MB | pending | 未开始 |  |
| 60 | 时序智能 · 第60集｜一步一步还是一口气：自回归与非自回归解码 | 21:50 | 67.55 MB | pending | 未开始 |  |
| 61 | 时序智能 · 第61集｜不止一个数：分位损失、分位线交叉与分布头 | 19:55 | 60.79 MB | pending | 未开始 |  |
| 62 | 时序智能 · 第62集｜两种异常，两条路：预测残差与重构误差 | 19:16 | 55.57 MB | pending | 未开始 |  |
| 63 | 时序智能 · 第63集｜把序列画成图：GAF 与 MTF 的可逆性边界 | 18:32 | 57.12 MB | pending | 未开始 |  |
| 64 | 时序智能 · 第64集｜只训练 0.1% 的参数：线性探测、LoRA 与语义锚点 | 17:34 | 51.25 MB | pending | 未开始 |  |
| 65 | 时序智能 · 第65集｜误差三件套：同一组预测，MSE 涨 4 倍而 MAE 一动不动 | 12:37 | 30.53 MB | pending | 未开始 |  |
| 66 | 时序智能 · 第66集｜不平衡数据上的三门考卷：Acc 0.99 的模型其实什么都没学到 | 11:39 | 29.35 MB | pending | 未开始 |  |
| 67 | 时序智能 · 第67集｜切数据的三条规矩：一次 shuffle 就让你的 MSE 好两个数量级 | 22:45 | 54.93 MB | pending | 未开始 |  |
| 68 | 时序智能 · 第68集｜5% 的样本怎么选：Few-shot 采样器与它的成本账 | 18:44 | 46.18 MB | pending | 未开始 |  |
| 69 | 时序智能 · 第69集｜你的基准数据集均衡吗：PCA 投影 + Hexbin 密度图 | 16:01 | 41.30 MB | pending | 未开始 |  |
| 70 | 时序智能 · 第70集｜欧拉法把弹簧算成了永动机 | 11:17 | 29.57 MB | pending | 未开始 |  |
| 71 | 时序智能 · 第71集｜把 k 换成一张表：参数辨识与 Neural ODE 前向 | 10:15 | 27.99 MB | pending | 未开始 |  |
| 72 | 时序智能 · 第72集｜两种反向传播：把 200 步求解器摊开，还是在时间里倒着积分 | 10:25 | 28.54 MB | pending | 未开始 |  |
| 73 | 时序智能 · 第73集｜不求解器也能算：CfC 的闭式解与灰色 GM-ODE | 12:14 | 32.07 MB | pending | 未开始 |  |
| 74 | 时序智能 · 第74集｜别只看 MSE：总变差正则与 DTW 保真度 | 12:44 | 31.87 MB | pending | 未开始 |  |

## 四、发布流程与验证

1. manifest.json 由各集 delivery 产物生成（标题/简介/标签/分区/封面/视频 sha256），verify_manifest.py 校验字段与文件存在性。
2. cdp-admin/bilibili-tool 的 batch 子命令串行投稿：stage 到 Windows 暂存盘 → 上传 → 填表 → 点「立即投稿」→ 三路读回 bvid → 原子写 ledger.json（断点续跑）。
3. 每批发布后用 audit_published.py 走公开 API 复核标题/标签集合/简介（含 ts-base 行）/时长 ±2 s，全部通过再回填 STATUS.md 并提交。
4. 单集失败停批并记录 lastError/errorCode/截图；修好工具后按序补发，不跳集。

## 五、已知问题

- 平台限流 137022「投稿过于频繁」：连续投稿 51 集后触发，前端只把错误打进 console、不渲染 UI，表现为「点立即投稿无反应」。工具已加 console 探针（RATE_LIMITED 快速失败）与冷却重试/集间间隔参数，剩余集数按冷却窗口分批投。
- 合集：账号未开通合集功能，collection 走 fail-closed（不静默跳过、不假装成功），故各集不挂合集。
- 转码/审核：投稿成功后短时间 x/web-interface/view 可能返回 -404，属平台正常延迟；台账以管理页读回为准。
- tname（分区）在公开 API 上可能为空，审计不校验分区，分区以填表下拉读回为准。

## 六、复现方式

     python3 series/tsint/release/verify_manifest.py
     node bin/bili.mjs login --check --json          # cdp-admin/bilibili-tool
     node bin/bili.mjs batch --manifest /root/video_project/series/tsint/release/manifest.json \
       --ledger /root/video_project/series/tsint/release/ledger.json --from 1 --to 74 \
       --gap-ms 90000 --rate-wait-ms 900000 --rate-retries 4 --yes
     python3 series/tsint/release/audit_published.py --from 1 --to 74 --json > /tmp/audit.json
     python3 series/tsint/release/backfill_status.py
     python3 series/tsint/release/make_report.py --audit /tmp/audit.json

