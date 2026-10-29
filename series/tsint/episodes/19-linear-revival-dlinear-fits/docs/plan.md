# 19-linear-revival-dlinear-fits - 线性模型复兴：共享权重线性、DLinear、FITS

> status: draft (scaffolded, not produced)
> chapter: ch03 | runtime target: 22 min | algorithms: 3

## Thesis

同一条线性骨干，只改「怎么归一化、怎么分解、在时域还是频域乘」，参数量跨三个数量级（1.4e5 → 4.5e3），而参数量少 30 倍的模型在 A 股日线上并不必然更差。

## Verification

两套数据并行：合成断言——参数量恒等式 2328 / 4656 / 2352、DLinear 分解恒等（<1e-12）、k=1 退化等价（<1e-12）、FFT 往返恒等（<1e-10）、DC 保持；A 股与分钟线演示——8 只股票上三者与基线的 MAE 表、5 分钟线的频谱截图、以及三条「参数量 vs MAE」散点。屏幕上必须出现 4 个数字：2328、4656、2352、1e-10。书中表3.1 的 7.05e4/1.397e5/4.5e3 只能作为量级引用（C 级），不作为本仓证据。

## Data

ts-admin 日线 8 只（600519/000858/600036/601398/000001.SZ/600030/000300.SH/399001.SZ）2015–2025；5 分钟线 2019–2025 单只；合成序列含 48 与 3 两个周期成分

## Algorithms

- ch3-linear-shared - 通道独立共享权重线性 (TsBase.Algos.Ch03.LinearShared)
- ch3-dlinear - 趋势-季节分解线性 DLinear (TsBase.Algos.Ch03.DLinear)
- ch3-fits - 频域低通线性变换 FITS (TsBase.Algos.Ch03.Fits)
