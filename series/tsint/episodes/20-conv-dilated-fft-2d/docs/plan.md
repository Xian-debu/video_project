# 20-conv-dilated-fft-2d - 卷积看时序：因果空洞卷积、FFT 周期、二维聚合

> status: draft (scaffolded, not produced)
> chapter: ch03 | runtime target: 22 min | algorithms: 3

## Thesis

卷积的感受野可以被精确数出来：4 层 K=3、d=1,2,4,8 的因果空洞卷积恰好看到过去 31 步；扰动第 32 步之前的任何输入，输出的每一个比特都不变。

## Verification

两套数据并行：合成断言——因果性（扰动后未来输出逐位不变）、RF=31、K=3/d=1 的边界手工值 [3,2,1]、top-1 周期 48、fold/unfold 往返 1e-12、1×1 核恒等 1e-12；A 股与分钟线演示——5 分钟线的三维热图与「扰动无变化」截图、折叠卷积 vs 仅相位卷积的 MAE 对照。屏幕上必须出现 4 个数字：31（感受野）、48（周期）、1e-12（往返误差）、0（扰动后未来输出误差）。

## Data

ts-admin 5 分钟线 2019–2025 单只（每日 48 根）；合成序列含周期 48 与 16 两个成分 + 固定 seed 噪声

## Algorithms

- ch3-dilated-causal-conv - 空洞因果卷积（时间轴/通道轴） (TsBase.Algos.Ch03.DilatedCausalConv)
- ch3-fft-period - FFT 主周期检测与折叠 (TsBase.Algos.Ch03.FftPeriod)
- ch3-2d-conv-agg - 折叠二维卷积与振幅加权聚合 (TsBase.Algos.Ch03.TwoDConvAgg)
