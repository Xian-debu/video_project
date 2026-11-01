import React from "react";
import { AbsoluteFill } from "remotion";
import { C, FONT, FT } from "../../design/tokens";
import { PAD, M, pagesOf, Pages, Scene, SceneHead, Card, Row, Body, Chip, K, Formula, CodeBlock, Stat } from "../shared";

export const SDefinitions: React.FC = () => {
  const at = pagesOf("definitions");
  return (
    <Scene id="definitions">
      <SceneHead id="definitions" />
      <Pages id="definitions" at={at}>
        {/* 页一：自编码器 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 288, width: 1000 }}>
            <Card label="自编码器，三行公式" accent={C.cyan}>
              <Formula size={FT.h2} note="编码器压到 d 维，解码器还原到 C 维；目标是重构平方和">
                Z = f(X),  X̂ = g(Z)
              </Formula>
              <Formula size={FT.h2} note="去噪版本：输入先被掩码抹掉一部分点，目标仍是干净输入" style={{ marginTop: 14 }}>
                X̃ = M ⊙ X,  M ~ Bernoulli(1 − p)
              </Formula>
            </Card>
          </div>
          <div style={{ position: "absolute", left: 1150, top: 288, width: 700 }}>
            <Card label="三个要点" accent={C.amber}>
              <Row name="不对称" value="破坏输入" note="目标还是原来的 X" width={640} />
              <Row name="逼着学结构" value="不是学恒等" note="掩码让抄近路失效" width={640} />
              <Row name="没有先验" value="也没有采样" note="潜空间不受约束" width={640} />
            </Card>
            <Body size={FT.meta} color={C.inkFaint} style={{ width: 660, marginTop: 18 }}>
              书里图4.6 画的就是这个结构。它的自由度既是优点，也是恒等陷阱的入口。
            </Body>
          </div>
        </AbsoluteFill>

        {/* 页二：VAE 下界 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 288, width: 1060 }}>
            <Card label="变分自编码器，一条下界" accent={C.violet}>
              <Formula size={FT.h2} note="式(4.22)：重构项 + β 倍 KL；书上 β=1">
                L = E_q‖X − X̂‖² + β · KL(q(Z|X) ‖ p(Z))
              </Formula>
              <Formula size={FT.h2} style={{ marginTop: 16 }} note="重参数化：ε 从 N(0,I) 抽，梯度可以穿过采样">
                Z = μ + σ ⊙ ε,  ε ~ N(0, I)
              </Formula>
            </Card>
            <Body style={{ marginTop: 22, width: 1020 }}>
              先验固定成 N(0,I)，KL 就是后验离先验多远。这一项同时起两个作用：约束潜空间，也做正则。
            </Body>
          </div>
          <div style={{ position: "absolute", left: 1210, top: 288, width: 640 }}>
            <Card label="两个头" accent={C.cyan}>
              <Row name="均值" value="μ 的八乘八" note="编码器的输出之一" width={580} />
              <Row name="对数方差" value="logσ²" note="学它可以取负，数值更稳" width={580} />
              <Row name="采样" value="固定种子" note="同种子逐位可复现" width={580} />
            </Card>
            <Card label="跟原文对齐" accent={C.amber} style={{ marginTop: 18 }}>
              <Row name="重构项" value="不除以 N" note="与式(4.10) 的 1/R 平均不同" width={580} />
              <Row name="β" value="书上没有" note="屏幕标「非书中」" width={580} />
            </Card>
          </div>
        </AbsoluteFill>

        {/* 页三：KL 解析式 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 288, width: 1080 }}>
            <Card label="KL 有解析式，不用采样" accent={C.violet}>
              <Formula size={FT.h2} note="对每个维度求和，再对窗口取平均">
                KL = ½ Σ ( μ² + σ² − 1 − log σ² )
              </Formula>
            </Card>
            <Card label="黄金值" accent={C.cyan} style={{ marginTop: 20 }}>
              <Row name="μ = 0, logσ² = 0" value={"KL = " + M.vae.klZero.toFixed(1)} note="后验就是先验" width={1030} />
              <Row name="μ = 1, logσ² = 0" value={"KL = " + M.vae.klGolden.toFixed(1)} note="半个单位方差的代价" width={1030} />
              <Row name="容限" value="1e−12" note="这两条都进了单元测试" width={1030} />
            </Card>
          </div>
          <div style={{ position: "absolute", left: 1230, top: 288, width: 620 }}>
            <Body size={FT.body} color={C.inkDim} style={{ width: 590, lineHeight: 1.7 }}>
              细节两条：学的是 logσ² 而不是 σ；重构项按原文不除以窗口长度。后者会让 β 的等效强度跟着变。
            </Body>
            <Chip color={C.amber} style={{ marginTop: 16 }}>口径不同，数字不可直接比</Chip>
          </div>
        </AbsoluteFill>

        {/* 页四：beta 是旋钮 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 288, width: 1000 }}>
            <Card label="两项各管什么" accent={C.amber}>
              <Row name="重构项" value="管还原" note="输出要像输入" width={950} />
              <Row name="KL 项" value="管先验" note="后验不要离 N(0,I) 太远" width={950} />
              <Row name="β = 1" value="原文权重" note="书上就是这个值" width={950} />
              <Row name="β < 1" value="放松 KL" note="重构更自由，潜空间更散" width={950} />
              <Row name="β 太大" value="后验坍缩" note="KL 压到零，输出退化成常数" width={950} />
            </Card>
          </div>
          <div style={{ position: "absolute", left: 1150, top: 288, width: 700 }}>
            <Card label="参数账" accent={C.cyan}>
              <Row name="第一层" value="100 × 8 + 8" note="808" width={640} />
              <Row name="两个头" value="2 × (64 + 8)" note="144" width={640} />
              <Row name="解码层" value="8 × 100 + 100" note="900" width={640} />
              <Row name="合计" value={M.vae.params.toLocaleString("en-US")} note="很小，每个数都能手核" width={640} />
            </Card>
            <Body size={FT.meta} color={C.inkFaint} style={{ width: 660, marginTop: 18 }}>
              模型这么小，是为了让每个数字都能手工核对，也为了四十分钟内跑完四十项检查。
            </Body>
          </div>
        </AbsoluteFill>
      </Pages>
    </Scene>
  );
};
