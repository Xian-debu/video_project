# 37-ad-gmm-vae-mixture-prior - 混合先验：GMM-VAE 与『多个正常模式』

> status: draft (scaffolded, not produced)
> chapter: ch04 | runtime target: 20 min | algorithms: 1

## Thesis

单高斯先验把牛市/熊市/横盘强行压进一个团，状态切换本身会被误判成异常；换成 K 个组件的混合先验（式4.26）后，切换不再报警，只有『在任何一个组件下都解释不通』的点才算异常（p.102）。

## Verification

屏幕必须出现：①K=4 的混合权重 π（和为 1）②注入⑤段在 4 个组件下的负对数似然（都不低）③与 ch4-vae 单先验版本在同一注入集上的 F1 对比两个数

## Data

ts-admin：同板块 8 只股票 × 日线 2015–2026，C=100、N=1（潜空间 2D 可视化）；注入①与⑤各 1%，另加『状态切换』对照段（2015 股灾、2020 疫情两个 regime，用来展示『切换不应报警』）。评分口径：点调整（主）+ 范围调整（副）。

## Algorithms

- ch4-gmm-vae - GMM-VAE 混合先验变分自编码器 (TsBase.Algos.Ch04.GMMVAE)
