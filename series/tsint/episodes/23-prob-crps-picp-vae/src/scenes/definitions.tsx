import React from "react";
import { AbsoluteFill } from "remotion";
import { C, FONT, FT, FT_T } from "../../design/tokens";
import { PAD, CW, M, pageAt, Pages, Scene, SceneHead, Stat, Mono, Body, Card, Row, Formula, CodeBlock } from "../shared";

export const SDefinitions: React.FC = () => {
  const at = [0, pageAt("definitions", 6), pageAt("definitions", 12), pageAt("definitions", 18), pageAt("definitions", 24)];
  return (
    <Scene id="definitions">
      <SceneHead id="definitions" />
      <Pages id="definitions" at={at}>
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 430, width: 820 }}>
            <Card label="点预测" accent={C.inkFaint} style={{ height: 300 }}>
              <Formula size={58}>y&#770;</Formula>
              <div style={{ marginTop: 22 }}>
                <Row name="代价" value="平方误差 / 绝对误差" width={740} />
                <Row name="价格" value="对称" note="方向不进价格" width={740} />
              </div>
            </Card>
          </div>
          <div style={{ position: "absolute", left: PAD + 860, top: 430, width: 820 }}>
            <Card label="分位数预测" accent={C.amber} style={{ height: 300 }}>
              <Formula size={58}>q_&#123;τ&#125;, τ ∈ (0, 1)</Formula>
              <div style={{ marginTop: 22 }}>
                <Row name="代价" value="pinball" note="上一集的主角" width={740} />
                <Row name="价格" value="不对称" note="τ = 0.9 时低估罚 9 倍" width={740} />
              </div>
            </Card>
          </div>
          <div style={{ position: "absolute", left: PAD + 1720, top: 430, width: 120, visibility: "hidden" }} />
          <div style={{ position: "absolute", left: PAD, top: 760, width: CW }}>
            <Card label="概率预测" accent={C.cyan} style={{ height: 210 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 60 }}>
                <Formula size={58}>p(y | x)</Formula>
                <div style={{ flex: 1 }}>
                  <Row name="代价" value="CRPS" note="对整个分布积分" width={1100} />
                  <Row name="价格" value="形状与宽度都算钱" note="这是本集的主角" width={1100} />
                </div>
              </div>
            </Card>
          </div>
        </AbsoluteFill>

        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 400, width: 1120 }}>
            <Card label="定义（连续情形）" accent={C.cyan} style={{ height: 430 }}>
              <Formula size={54} style={{ lineHeight: 1.55 }}>CRPS = ∫ ( F_pred(x) − 1&#123;x ≥ y&#125; )² dx</Formula>
              <Body size={FT.label} style={{ marginTop: 22 }}>
                把预测分布函数和观测的阶跃函数逐点相减，平方，再积分。积分域是整个实数轴。
              </Body>
              <Body size={FT.label} style={{ marginTop: 12 }} color={C.amber}>
                等价写法：CRPS = 2 ∫ pinball_τ(q_τ, y) dτ / (1 − 0)。
              </Body>
            </Card>
          </div>
          <div style={{ position: "absolute", left: PAD + 1160, top: 400, width: 560 }}>
            <Stat label="性质" value="单位一致" sub="和观测同量纲，所以能和平均误差直接比" style={{ height: 190 }} />
            <Stat label="性质" value="越小越好" sub="下界为零，退化为绝对误差" accent={C.amber} style={{ height: 190, marginTop: 40 }} />
          </div>
        </AbsoluteFill>

        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 400, width: 1080 }}>
            <Card label="高斯闭式" accent={C.amber} style={{ height: 430 }}>
              <Formula size={48} style={{ lineHeight: 1.5 }}>
                CRPS = σ · [ z(2Φ(z) − 1) + 2φ(z) − 1/√π ]
              </Formula>
              <Mono size={FT.body} color={C.amber} style={{ display: "block", marginTop: 14 }}>z = (y − μ) / σ</Mono>
              <Body size={FT.label} style={{ marginTop: 18 }}>
                当 y 等于 μ，z 为零，Φ 为 0.5，φ 为 1/√(2π)，只剩常数 1/√π。
              </Body>
            </Card>
          </div>
          <div style={{ position: "absolute", left: PAD + 1120, top: 400, width: 600 }}>
            <Stat label="黄金值" value="0.2337" sub="1 / √π = 0.56419 的一半" accent={C.amber} style={{ height: 430 }} />
          </div>
        </AbsoluteFill>

        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 430, width: 900 }}>
            <Card label="区间覆盖率 PICP" accent={C.cyan} style={{ height: 380 }}>
              <Formula size={54} style={{ lineHeight: 1.5 }}>coverage = (1/n) Σ 1&#123;l ≤ y_i ≤ u&#125;</Formula>
              <Body size={FT.label} style={{ marginTop: 18 }}>
                分子是盖住的观测数，分母是总数。端点算盖住，这一点写进实现。
              </Body>
            </Card>
          </div>
          <div style={{ position: "absolute", left: PAD + 940, top: 430, width: 780 }}>
            <Card label="它只能落在栅格上" accent={C.amber} style={{ height: 380 }}>
              <Row name="n = 24" value="0.0417" note="1/24 是步长" width={720} />
              <Row name="n = 10000" value="0.0001" note="本集合成实验的步长" width={720} />
              <Row name="报 0.8023" value="8023 / 10000" note="不是四舍五入出来的" width={720} />
            </Card>
          </div>
        </AbsoluteFill>

        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 420, width: 900 }}>
            <Card label="ELBO 与我们的 loss" accent={C.violet} style={{ height: 400 }}>
              <Formula size={52} style={{ lineHeight: 1.4 }}>ELBO = E[log p(x|z)]</Formula>
              <Formula size={52} style={{ lineHeight: 1.4, marginTop: 4 }}>− KL(q(z|x) ‖ p(z))</Formula>
              <Body size={FT.label} style={{ marginTop: 18 }}>
                本集最大化 ELBO，也就是最小化 loss = 重建项 + KL。两项都可算，KL 在高斯先验下有闭式。
              </Body>
            </Card>
          </div>
          <div style={{ position: "absolute", left: PAD + 940, top: 420, width: 780 }}>
            <Card label="手算这一行" accent={C.cyan} style={{ height: 400 }}>
              <Formula size={44} style={{ lineHeight: 1.5 }}>KL = ½(μ² + σ² − 1 − log σ²)</Formula>
              <Mono size={FT.body} color={C.cyan} style={{ display: "block", marginTop: 14 }}>μ = 1, σ² = 4 → 1.3068528194</Mono>
              <Body size={FT.meta} style={{ marginTop: 14 }}>
                计划书早先写的是 1.806853，差 0.5；以手算和程序同值为准。
              </Body>
            </Card>
          </div>
        </AbsoluteFill>
      </Pages>
    </Scene>
  );
};