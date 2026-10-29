# 46-rnn-shallow-dilated - 感受野之争：RNN、Brick 并行与空洞卷积

> status: draft (scaffolded, not produced)
> chapter: ch05 | runtime target: 22 min | algorithms: 3

## Thesis

把 T=500 的窗口切成 10 块并行跑 RNN，训练时间降到 1/6 左右，而验证集准确率与串行 RNN 的差距不足 1 个百分点；空洞卷积则用 1/5 的参数拿到同样的感受野。

## Verification

看完能自己复现：① tanh(0.5)=0.4621 的单步手算；② 空洞卷积 [4,6,8] 的手算；③ 串行 vs 并行的墙钟时间比（目标≈6 倍）；④ 两种感受野（T=500 的 RNN vs 31 天的 4 层空洞）对比图。屏幕上必须出现：0.4621、[4,6,8]、时间比值、感受野 31。

## Data

ts-admin：沪深 300 中 500 只股票，2015-2025，T=500（约两年交易日）× 单变量 close 对数收益；标签=未来 60 日收益的三分位（涨/平/跌）。合成对照：周期 8/12/20 的长序列，用于验证空洞卷积感受野是否覆盖完整周期。

## Algorithms

- ch5-rnn - 循环网络分类器（Vanilla RNN） (TsBase.Algos.Ch05.Rnn)
- ch5-shallow-rnn - 浅层循环网络（Brick 并行） (TsBase.Algos.Ch05.ShallowRnn)
- ch5-dilated - 空洞卷积（因果/非因果） (TsBase.Algos.Ch05.Dilated)
