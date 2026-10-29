# 33-ad-causal-dilated-conv - 卷积看见了未来：因果卷积、膨胀核与 TCN

> status: draft (scaffolded, not produced)
> chapter: ch04 | runtime target: 28 min | algorithms: 3

## Thesis

普通卷积在偷看未来：把 padding 从『左右对称』改成『只在左侧』后，训练段 F1 略降、2021–2026 测试段 F1 反而升高——用未来信息训练出的高分会兑现成上线后的崩塌。

## Verification

屏幕必须出现：①因果 padding 前后同一模型的训练/测试 F1 两对数（证明『偷看未来』的代价）②感受野 31 的实测扰动范围 ③注入①处重构误差峰与注入段的 IoU

## Data

ts-admin：600519.SH 与 000858.SZ 日线 2010-01-04 至 2026-06-30（train 2010–2020 / test 2021–2026），C=100；注入①（k∈[5,10]σ，单点与 3 连点）与注入③（跨股票形态替换 20–60 长），注入率 1%。评分口径：点调整与范围调整双报；因果性用『未来扰动不变性』自动测试，不依赖 GT。

## Algorithms

- ch4-causal-dilated - 因果卷积 / 空洞卷积 (TsBase.Algos.Ch04.CausalConv)
- ch4-dual-conv - MACE 双重卷积 (TsBase.Algos.Ch04.DualConv)
- ch4-tcn - TCN 残差块重构检测 (TsBase.Algos.Ch04.TCN)
