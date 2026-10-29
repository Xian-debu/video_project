# 36-ad-ae-and-vae-recon - 从重构到概率：AE 与 VAE 的潜空间

> status: draft (scaffolded, not produced)
> chapter: ch04 | runtime target: 26 min | algorithms: 2

## Thesis

AE 的潜空间没有约束：隐层足够宽时它会把每个窗口都重构得完美，分数恒为 0（检测器失效）；加上式(4.22) 的 KL 项后，正常样本被钉在 N(0,I) 上，重构误差才第一次有概率含义。

## Verification

屏幕必须出现：①AE 在 d=16 与 d=100 两种配置下的分数均值（证明恒等映射陷阱）②VAE 的 KL 黄金值 0.5 ③2D 潜空间散点（正常团 vs 注入飞出）

## Data

ts-admin：600519.SH + 000858.SZ 日线 2010–2026，C=100、N=1（潜空间降维便于 2D 可视化）；注入①与⑤（线性漂移使局部斜率变号，p.79 表述）。评分口径：点调整（主）+ 范围调整（副），并额外报告『分数全 0 的失效检测』这一项。

## Algorithms

- ch4-ae - MLP 自编码器（含去噪 DAE） (TsBase.Algos.Ch04.AE)
- ch4-vae - VAE / ELBO 重构检测 (TsBase.Algos.Ch04.VAE)
