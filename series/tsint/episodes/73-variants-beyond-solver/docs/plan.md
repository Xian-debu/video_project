# 73-variants-beyond-solver - 不求解器也能算：CfC 的闭式解与灰色 GM-ODE

> status: ready (delivered; 734 s render, srt/chapters/cover in delivery/)
> chapter: ch09 | runtime target: 18 min | algorithms: 2

## Thesis

两个变体都叫「不靠通用求解器」，但拿掉的东西不同。CfC 对分段常数输入真的推出一段闭式解：一次 exp 取代 800 次 RK4 求值，代价是输入必须先在区间内当成常数，且闭式解只对简化后的方程成立。GM-ODE 仍用 RK4 积分，被换掉的是黑箱右端项 f_θ——改成 GM(1,N) 的白化方程，用累加生成（AGO）把原始序列变平滑，再用最小二乘估发展系数与灰作用量，省的是样本而不是积分步数。书中「快 100–100000 倍」与「MAPE 0.82% / 1.13%」没有数据、代码或复现协议，只能标 C 级。

## 编辑判断

- 不能把两者都说成「去掉求解器」：CfC 去的是积分器，GM-ODE 去的是黑箱函数。开场与收尾都用这句区分。
- CfC 的门控曲线与原方程的指数解不是同一条曲线：门在两个候选状态之间移动，闭式解针对的是给定初值的简化方程，不保证逐点等于原方程的解。屏幕和口播都必须说清。
- SoftPlus 保号而非保大小：SoftPlus(1000) 的稳定写法返回 1000，朴素写法溢出成 Infinity；log-sum-exp 给出 1000.6931。
- 测试总数 108 条：73 条旧断言 + 17 条 CfC + 18 条 GM-ODE，全部通过。

## Verification

屏幕上必须出现：(1) AGO=[1,3,6,10] 与 IAGO=[1,2,3,4] 的逐步还原；(2) GM(1,1) 的 a=0.03045685279187818、b=12.182741116751265 与 MAPE=0.4814%；(3) SoftPlus 朴素 Inf / 稳定 1000 / log-sum-exp 1000.6931471805599 的对照；(4) RK4（2400 步，dt=0.01）与闭式解的最大误差 2.5579538487363607e-13；(5) CfC 1 次 exp 对 RK4 800 次求值。看完知道「哪些部分是书中给的，哪些必须自己验证」。

## Data

24 点月度序列 12·0.97^k（合成，用于 GM(1,1) 拟合与预测）；标量 CfC 演示取 x0=1、A=0、f=2（闭式解 1→0），门控演示取 0.2、0.8；全部由 build/generate_variants_data.py 从证据文件重组并断言。

## Algorithms

- ch9-cfc - 闭式连续时间网络（CfC） (TsBase.Algos.Ch09.CfC)
- ch9-gm-ode - 灰色神经微分方程（GM-ODE） (TsBase.Algos.Ch09.GmOde)

## 场景

01 open · 不求解器也能算 → 02 problem · 到底去掉了什么 → 03 definitions · 两条方程，两种闭式 → 04 intuition · 形状对了就够了 → 05 implementation · 把两条方程写成可测试的代码 → 06 verification · 每个数字都能回到一次运行 → 07 boundary · 两个数字，五条边界 → 08 outro · 一个省求值，一个省样本。