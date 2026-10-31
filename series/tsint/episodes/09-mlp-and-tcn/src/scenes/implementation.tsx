import React from "react";
import { Build } from "../../design/primitives";
import { C, FONT, FT } from "../../design/tokens";
import { Body, Card, Chip, CodeBlock, Formula, K, M, PAD, Pages, Row, Scene, SceneHead, Verdict, lf } from "../shared";

/* 实现：手写反向传播、卷积栈、共用训练循环。 */

export const SImplementation: React.FC = () => {
  const m = M;
  return (
    <Scene id="implementation">
      <SceneHead id="implementation" />
      <Pages id="implementation" at={[0, 0.22, 0.44, 0.66, 0.86]}>
        <div>
          <div style={{ position: "absolute", left: PAD, top: 236, fontFamily: FONT.sans, fontSize: FT.h2, color: C.inkDim }}>
            实现分三块：多层感知机、卷积、共同的训练循环。全部手写，不引自动微分库。
          </div>
          <Build at={lf("implementation", 0.03)}>
            <div style={{ position: "absolute", left: PAD, top: 312, display: "flex", gap: 24 }}>
              <Card label="MLP · 参数按层存" accent={C.cyan} style={{ width: 570, height: 300 }}>
                <Body size={FT.body}>每层一个权重矩阵、一个偏置向量。</Body>
                <Body size={FT.meta} style={{ marginTop: 12 }}>前向就是循环：逐层算 z，再算 h。</Body>
              </Card>
              <Card label="TCN · 卷积栈" accent={C.violet} style={{ width: 570, height: 300 }}>
                <Body size={FT.body}>每层存核、偏置、膨胀系数、核长。</Body>
                <Body size={FT.meta} style={{ marginTop: 12 }}>通道相同才有残差，残差加在激活之前。</Body>
              </Card>
              <Card label="训练循环 · 共用" accent={C.amber} style={{ width: 588, height: 300 }}>
                <Body size={FT.body}>打乱、切批、前向、反向、更新、早停。</Body>
                <Body size={FT.meta} style={{ marginTop: 12 }}>两个模型共用同一份循环与同一个 splitmix64。</Body>
              </Card>
            </div>
          </Build>
          <Build at={lf("implementation", 0.09)}>
            <div style={{ position: "absolute", left: PAD, top: 660, fontFamily: FONT.sans, fontSize: FT.body, color: C.inkDim }}>
              代码大约两千行 Haskell，反向传播一行一行推。
            </div>
          </Build>
        </div>

        <div>
          <div style={{ position: "absolute", left: PAD, top: 236, fontFamily: FONT.sans, fontSize: FT.h2, color: C.inkDim }}>
            反向从损失对输出的导数开始；tanh 的导数是一减 tanh 的平方。
          </div>
          <Build at={lf("implementation", 0.25)}>
            <div style={{ position: "absolute", left: PAD, top: 306, width: 1010 }}>
              <CodeBlock width={1010} size={FT.code} title="chain · 手写反向" lines={[
                { t: "dOut   = 2 * (yHat - y)" },
                { t: "delta  = dOut * (1 - h_last^2)", hi: true },
                { t: "gradW  = delta ⊗ h_in" },
                { t: "gradB  = delta" },
                { t: "dPrev  = W^T · delta * (1 - h_prev^2)" },
              ]} />
            </div>
          </Build>
          <Build at={lf("implementation", 0.31)}>
            <div style={{ position: "absolute", left: PAD + 1034, top: 306, width: 742 }}>
              <Card label="梯度检查 · 中心差分" accent={C.cyan} style={{ height: 300 }}>
                <Formula size={40} note="步长 1e-6，相对误差门槛 1e-6">{"|g_num − g_ana| / max(1, |g_num|)"}</Formula>
                <Body size={FT.meta} style={{ marginTop: 14 }}>第一次跑，相对误差 1.957 —— 一看就是错的。</Body>
              </Card>
            </div>
          </Build>
          <Build at={lf("implementation", 0.37)}>
            <div style={{ position: "absolute", left: PAD, top: 636, width: 1776 }}>
              <Card label="三个错因，逐个钉死" accent={C.coral} style={{ height: 200 }}>
                <div style={{ display: "flex", gap: 34 }}>
                  <div style={{ flex: 1 }}><Chip color={C.coral}>1</Chip><Body size={FT.meta} style={{ marginTop: 8 }}>循环把输入层的 delta 也算进去了</Body></div>
                  <div style={{ flex: 1 }}><Chip color={C.coral}>2</Chip><Body size={FT.meta} style={{ marginTop: 8 }}>取梯度时层序反了，梯度乱序</Body></div>
                  <div style={{ flex: 1 }}><Chip color={C.cyan}>3</Chip><Body size={FT.meta} style={{ marginTop: 8 }}>先单层过、再多层查：单层对、多层错，问题在层间</Body></div>
                </div>
              </Card>
            </div>
          </Build>
          <Build at={lf("implementation", 0.4)}>
            <div style={{ position: "absolute", left: PAD, top: 856, display: "flex", gap: 14, alignItems: "center" }}>
              <Verdict ok={true} label="修完后" /><K>相对误差 {m.mlp.gradcheck.toExponential(2)} · 门槛 1e-6</K>
            </div>
          </Build>
        </div>

        <div>
          <div style={{ position: "absolute", left: PAD, top: 236, fontFamily: FONT.sans, fontSize: FT.h2, color: C.inkDim }}>
            这里踩了一个大坑：数组布局。卷积输出曾按时间主序，其余地方按通道主序。
          </div>
          <Build at={lf("implementation", 0.47)}>
            <div style={{ position: "absolute", left: PAD, top: 306, width: 940 }}>
              <Card label="同一个索引，两种算法" accent={C.coral} style={{ height: 300 }}>
                <Row name="时间主序（错）" value="t·C + c" note="先排时间，再排通道" color={C.coral} width={894} />
                <Row name="通道主序（对）" value="c·T + t" note="先排通道，再排时间" color={C.cyan} width={894} />
                <Body size={FT.meta} style={{ marginTop: 16 }}>单通道时两种布局完全重合，所以单层测试全过。</Body>
              </Card>
            </div>
          </Build>
          <Build at={lf("implementation", 0.53)}>
            <div style={{ position: "absolute", left: PAD + 964, top: 306, width: 812 }}>
              <Card label="暴露在多层" accent={C.amber} style={{ height: 300 }}>
                <Body size={FT.body}>多层梯度检查，误差跳到 1.29 到 1.95。</Body>
                <Body size={FT.meta} style={{ marginTop: 14 }}>修法只有一行：把两个下标换回来。</Body>
                <Chip color={C.violet}>布局黄金测试</Chip>
              </Card>
            </div>
          </Build>
          <Build at={lf("implementation", 0.59)}>
            <div style={{ position: "absolute", left: PAD, top: 636, width: 1776 }}>
              <Card label="布局黄金 · 两层两通道，手算六个输出" accent={C.cyan} style={{ height: 180 }}>
                <div style={{ display: "flex", gap: 18, alignItems: "baseline" }}>
                  <div style={{ fontFamily: FONT.mono, fontSize: FT.h1, color: C.cyan, letterSpacing: 2 }}>[0, 0, 1, 2, 5, 10]</div>
                  <Body size={FT.meta} style={{ flex: 1 }}>谁再改布局，这条断言先红；它比任何注释都管用。</Body>
                </div>
              </Card>
            </div>
          </Build>
        </div>

        <div>
          <div style={{ position: "absolute", left: PAD, top: 236, fontFamily: FONT.sans, fontSize: FT.h2, color: C.inkDim }}>
            随机数没用系统自带那套，自己写了 splitmix64。
          </div>
          <Build at={lf("implementation", 0.69)}>
            <div style={{ position: "absolute", left: PAD, top: 306, width: 1010 }}>
              <Card label="为什么自己写" accent={C.violet} style={{ height: 330 }}>
                <Body size={FT.body}>原因只有一个：同一个种子，不同机器逐位相同。</Body>
                <Body size={FT.meta} style={{ marginTop: 14 }}>测试里直接比较权重，用相等，不用容差。</Body>
                <Formula size={40} note="无 Int 溢出、纯函数、可穿线" style={{}}>{"seed' = seed + 0x9E3779B97F4A7C15"}</Formula>
              </Card>
            </div>
          </Build>
          <Build at={lf("implementation", 0.75)}>
            <div style={{ position: "absolute", left: PAD + 1034, top: 306, width: 742 }}>
              <Card label="训练循环" accent={C.cyan} style={{ height: 330 }}>
                <Row name="每轮" value="打乱 → 切批" note="LCG 洗牌，可复现" width={696} />
                <Row name="每批" value="前向 → 反向" note="解析梯度" width={696} />
                <Row name="每轮末" value="验证损失" note="训练集尾部切出" width={696} />
                <Row name="早停" value="patience 5" note="不降就停" width={696} />
              </Card>
            </div>
          </Build>
        </div>

        <div>
          <div style={{ position: "absolute", left: PAD, top: 236, fontFamily: FONT.sans, fontSize: FT.h2, color: C.inkDim }}>
            两千行手写代码，换来一个能逐位复现的实现。
          </div>
          <Build at={lf("implementation", 0.89)}>
            <div style={{ position: "absolute", left: PAD, top: 312, width: 1776 }}>
              <Card accent={C.cyan} style={{ height: 300 }}>
                <div style={{ fontFamily: FONT.serif, fontSize: FT.h1, color: C.ink }}>没有自动微分库，梯度检查就是我们唯一的裁判。</div>
                <div style={{ display: "flex", gap: 40, marginTop: 26 }}>
                  <div><K>MLP 梯度</K><div style={{ fontFamily: FONT.mono, fontSize: FT.num, color: C.cyan }}>{m.mlp.gradcheck.toExponential(2)}</div></div>
                  <div><K>TCN 梯度</K><div style={{ fontFamily: FONT.mono, fontSize: FT.num, color: C.violet }}>{m.tcn.gradcheck.toExponential(2)}</div></div>
                  <div><K>门槛</K><div style={{ fontFamily: FONT.mono, fontSize: FT.num, color: C.inkDim }}>1e-6</div></div>
                </div>
              </Card>
            </div>
          </Build>
        </div>
      </Pages>
    </Scene>
  );
};
