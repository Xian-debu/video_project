import React from "react";
import { C, FONT, FT } from "../../design/tokens";
import {
  Body, CW, Card, Chip, Formula, Head, K, M, Pages, PAD, Row, fmtF,
} from "../shared";

const P1: React.FC = () => (
  <>
    <Head kicker="07 / 边界" title="这一集没做的三件事" goal="没做的，画面标出来" />
    <div style={{ position: "absolute", left: PAD, top: 360, width: CW, display: "flex", gap: 26 }}>
      <Card label="一 · 没有训练" accent={C.coral} style={{ flex: 1, height: 420 }}>
        <Body size={FT.h2} color={C.ink}>τ、Δ 是从 MLP 里学出来的。</Body>
        <Body size={FT.body} style={{ marginTop: 14 }}>
          书里只写了这一句。没有初始化、没有损失、没有配方。本仓只做前向判决，不训练这两个旋钮。
        </Body>
      </Card>
      <Card label="二 · τ 不是新结构" accent={C.violet} style={{ flex: 1, height: 420 }}>
        <Body size={FT.h2} color={C.ink}>它等价于温度。</Body>
        <Body size={FT.body} style={{ marginTop: 14 }}>
          训练 τ，本质是训练一个标量超参。它能改变尖平，但不能让模型看见新的东西。
        </Body>
      </Card>
      <Card label="三 · Δ 只在 logits 上" accent={C.amber} style={{ flex: 1, height: 420 }}>
        <Body size={FT.h2} color={C.ink}>它不改 Q、K、V。</Body>
        <Body size={FT.body} style={{ marginTop: 14 }}>
          列偏置只改 softmax 之前的那张表。注意力之外的一切 —— 编码器、残差、输出头 —— 它都碰不到。
        </Body>
      </Card>
    </div>
    <div style={{ position: "absolute", left: PAD, top: 830, width: CW }}>
      <Body size={FT.lead} color={C.inkDim}>
        三条边界合起来，就是一句话：这一集验证的是机制，不是收益。
      </Body>
    </div>
  </>
);

const P2: React.FC = () => (
  <>
    <Head kicker="07 / 边界" title="真实数据不承诺有偏置" goal="没有偏置可纠，不等于方法无效" />
    <div style={{ position: "absolute", left: PAD, top: 360, width: 900 }}>
      <Card label="三段质量 · 真实窗口" accent={C.amber} style={{ height: 380 }}>
        <Row name="早段" value={(M.real.early_mass * 100).toFixed(2) + "%"} color={C.amber} />
        <Row name="中段" value={(M.real.mid_mass * 100).toFixed(2) + "%"} color={C.amber} />
        <Row name="晚段" value={(M.real.late_mass * 100).toFixed(2) + "%"} color={C.amber} />
        <Row name="最大差" value={(M.real.third_spread * 100).toFixed(2) + " pp"} note="几乎均匀" color={C.cyan} />
      </Card>
    </div>
    <div style={{ position: "absolute", left: 1040, top: 360, width: 800 }}>
      <Card label="要证明有用，还差什么" accent={C.coral} style={{ height: 380 }}>
        <Body size={FT.body}>一、把 τ、Δ 接进一个真正的 NSformer 编码器。</Body>
        <Body size={FT.body} style={{ marginTop: 10 }}>二、在两阶段训练里学出它们。</Body>
        <Body size={FT.body} style={{ marginTop: 10 }}>三、看测试集的预测误差，不看注意力热图。</Body>
        <Body size={FT.body} color={C.coral} style={{ marginTop: 16 }}>
          这三步都不在这一集的范围里。后面的集如果做了，要重新报数。
        </Body>
      </Card>
    </div>
    <div style={{ position: "absolute", left: PAD, top: 800, width: CW }}>
      <Body size={FT.lead} color={C.ink}>
        我们证明了机制，没有证明收益。这两件事不能混着说。
      </Body>
    </div>
  </>
);

const P3: React.FC = () => (
  <>
    <Head kicker="07 / 边界" title="书里给的，和这一集给的" goal="对照表，一行都不能少" />
    <div style={{ position: "absolute", left: PAD, top: 360, width: CW }}>
      <Card label="对照" accent={C.cyan} style={{ height: 430 }}>
        <Row name="书里：一条式子，两个由 MLP 学出的量" value="我们：两条独立实现 + 逐位判决" note="τ=1/Δ=0 与 τ=2 的判决都不训练" color={C.cyan} />
        <Row name="书里：τ 是正缩放标量" value="我们：证明它只是温度" note="softmax(τs) = softmax(s/(1/τ))，逐位" color={C.cyan} />
        <Row name="书里：Δ 是偏移向量" value="我们：证明它只能按列加" note="按行加被 softmax 吃掉，梯度恰为 0.0" color={C.cyan} />
        <Row name="书里：NSformer 的预测收益" value="我们：没有测" note="真实窗口三段 35/34/31，没有可纠的偏置" color={C.coral} />
      </Card>
    </div>
    <div style={{ position: "absolute", left: PAD, top: 840, width: CW, display: "flex", gap: 18, alignItems: "center" }}>
      <Chip color={C.amber}>SELF-AUTH A31</Chip>
      <Body size={FT.body} color={C.inkDim}>
        口径冻结：τ 等价温度、Δ 按列加、按行不可辨识、不训练、真实数据无偏置可纠。
      </Body>
    </div>
  </>
);

export const SBoundary: React.FC = () => (
  <Pages id="boundary" at={[0, 0.34, 0.66]}>
    <P1 />
    <P2 />
    <P3 />
  </Pages>
);
