# 40-ad-adversarial-dual-decoder - 两个解码器，一个说谎：USAD 对抗、DAGMM 能量与多 AE 中位数

> status: draft (scaffolded, not produced)
> chapter: ch04 | runtime target: 30 min | algorithms: 3

## Thesis

同一批无标签数据，三种让分数更稳的思路：对抗（USAD 让两个解码器互相挑错）、密度（DAGMM 在潜空间拟合 GMM 算能量）、集成（多个 AE 取中位数压掉个体噪声）——它们回答的是三个不同的问题：『不像自己』『不像正常分布』『多数模型都认为不像』。

## Verification

屏幕必须出现：①USAD 两阶段损失曲线（含负号写反的反向对照）②DAGMM 能量在马氏距离上的黄金值对拍 ③median vs mean 的抗离群演示 ④三者与 ch4-ae 基线在同一注入集上的 F1 四个数

## Data

ts-admin：600519.SH + 000858.SZ 日线 2010–2026，C=100、N=1；注入①（k∈[5,10]σ）、⑤（线性漂移致斜率变号）各 1%，注入率 1%、种子 42。评分口径：点调整（主）+ 范围调整（副）；三个单元共享同一测试集与同一阈值选择协议（在验证集上取 F1 最优阈值），保证可比。

## Algorithms

- ch4-usad - USAD 双解码器对抗 (TsBase.Algos.Ch04.USAD)
- ch4-dagmm - DAGMM 深度自编码高斯混合 (TsBase.Algos.Ch04.DAGMM)
- ch4-ae-ens - 多 AE 中位数集成（S-RNNAE） (TsBase.Algos.Ch04.AEEnsemble)
