# 07-fft-basis-patch - 频域与分块：FFT、基展开、Patch 三种「换坐标系」的方式

> status: draft (scaffolded, not produced)
> chapter: ch02 | runtime target: 25 min | algorithms: 3

## Thesis

FFT 不是免费的午餐：它的分辨率是 1/N（周期数/样本），把一段 250 点的日线做 10Hz 去噪在数学上毫无意义，因为 Nyquist 频率只有采样率的一半。三种表示（FFT / 基展开 / Patch）本质是同一件事——选一组基把序列重写——区别只在基是固定的（傅里叶/多项式）还是可变的（可学习）。

## Verification

看完这一集，观众应能解释「为什么补零不提高分辨率」并手算 5 个补丁数。屏幕上必须出现 3 个数字：N=5（L=10,P=4,S=2）、Parseval 相对误差 <1e-12、带阻后与参考信号的 RMS <1e-3；以及归一化前后设计矩阵条件数的两个数量级差。

## Data

合成信号（0.3/1.17/10Hz，fs=100，n=1024，复刻图2.12 的设定）；ts-admin 日线 600519（512 点频谱、250 点基展开与 Patch）、分钟线 5 分钟 600519 一周（L=48 的傅里叶基与 Patch）。

## Algorithms

- ch2-fft - 快速傅里叶变换与频域滤波 (TsBase.Algos.Ch02.Fft)
- ch2-basis-exp - 基函数展开 (TsBase.Algos.Ch02.BasisExp)
- ch2-patchify - Patch 分块（Triformer 口径） (TsBase.Algos.Ch02.Patchify)
