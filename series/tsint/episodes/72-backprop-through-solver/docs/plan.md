# 72-backprop-through-solver - 两种反向传播：把 200 步求解器摊开，还是在时间里倒着积分

> status: produced
> chapter: ch09 | runtime: 10:17 (616.94 s) | algorithms: 2

## Thesis

对同一个显式欧拉链，直接法沿计算链反向累积梯度，伴随法用检查点把空间压到 O(T/K+K)；两者给出同一个梯度（直接法与伴随法逐位相同，闭式相对误差 4.698427621121810e-14），但直接法的峰值内存随步数线性增长（200 万步 / 20 万步 = 11.955063174960559），伴随法不随步数增长（0.4656114414269645）。

## Verification

屏幕上出现五组数字：(1) 闭式 29.262985504233836、直接 29.262985504235210、伴随 29.262985504235210 三列对照；(2) 有限差分 29.262985488465173，相对误差 5.389073417114963e-10；(3) RK4 与连续伴随对闭式的相对误差 1.110223024625157e-15 / 8.985420969244963e-15；(4) 直接法/伴随法的峰值内存与倍数；(5) 股票参数彩蛋（k̂=1.2702893275022433，200 步，梯度 25.01211482828232）。另演示错误方向版本 −29.262985504235210。

## Data

纯合成标量链；A 股仅作 10 秒彩蛋，不参与训练或结论。

## Algorithms

- ch9-neuralode-direct - 直接法反传（求解器展开成计算图，RK-Net） (TsBase.Algos.Ch09.DirectGrad)
- ch9-neuralode-adjoint - 邻接伴随法（Adjoint Sensitivity Method） (TsBase.Algos.Ch09.Adjoint)

## Evidence

- ts-base commit 908f333
- data/evidence/backprop_{forward,gradients,slots,memory}.csv
- data/evidence/20261029T152219-ch9-neuralode-{direct,adjoint}.json
- 测试 72 条全通过（本集新增 22 条：DirectGrad 10、Adjoint 12）
- 书页 p.217 式 9.23–9.25、p.218 图 9.6 / 表 9.1
