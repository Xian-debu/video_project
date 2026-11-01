import React from "react";
import { AbsoluteFill } from "remotion";
import { C, FONT, FT, FT_T } from "../../design/tokens";
import { PAD, CW, M, pageAt, Pages, Scene, SceneHead, Stat, Mono, Body, Card, Row, Formula, Chip, Verdict } from "../shared";

export const SOutro: React.FC = () => {
  const at = [0, pageAt("outro", 6)];
  return (
    <Scene id="outro">
      <SceneHead id="outro" />
      <Pages id="outro" at={at}>
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 430, width: CW }}>
            <Card label="三句话" accent={C.cyan} style={{ height: 470 }}>
              <div style={{ display: "flex", gap: 40 }}>
                <div style={{ flex: 1 }}>
                  <Mono size={FT.meta} color={C.inkFaint}>01 · 分数</Mono>
                  <Body size={FT.h2} color={C.ink} style={{ marginTop: 10 }}>
                    CRPS 把分布和观测积成一个数。
                  </Body>
                  <Mono size={FT.meta} color={C.amber} style={{ display: "block", marginTop: 14 }}>采样估计偏高：0.564 / S</Mono>
                </div>
                <div style={{ flex: 1 }}>
                  <Mono size={FT.meta} color={C.inkFaint}>02 · 区间</Mono>
                  <Body size={FT.h2} color={C.ink} style={{ marginTop: 10 }}>
                    覆盖率必须带宽度、容差和样本数。
                  </Body>
                  <Mono size={FT.meta} color={C.amber} style={{ display: "block", marginTop: 14 }}>端点算不算，先说清</Mono>
                </div>
                <div style={{ flex: 1 }}>
                  <Mono size={FT.meta} color={C.inkFaint}>03 · 下界</Mono>
                  <Body size={FT.h2} color={C.ink} style={{ marginTop: 10 }}>
                    ELBO 的每一项都要能手算对上。
                  </Body>
                  <Mono size={FT.meta} color={C.amber} style={{ display: "block", marginTop: 14 }}>1.3068528194 · μ = 1，σ² = 4</Mono>
                </div>
              </div>
              <Body size={FT.label} style={{ marginTop: 30 }}>
                三个式子都不难，难的是每一处口径都写清楚、算对、留证。
              </Body>
            </Card>
          </div>
        </AbsoluteFill>

        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 420, width: 900 }}>
            <Card label="下一集" accent={C.violet} style={{ height: 440 }}>
              <div style={{ fontFamily: FONT.serif, fontSize: 84, color: C.ink, lineHeight: 1.15 }}>通道混合</div>
              <Body size={FT.label} style={{ marginTop: 16 }}>
                八个通道，怎么互相借力。iTrans 和一张图，把通道之间的关系学出来。
              </Body>
              <Mono size={FT.meta} color={C.inkFaint} style={{ display: "block", marginTop: 22 }}>第 24 集 · 第 3 章</Mono>
            </Card>
          </div>
          <div style={{ position: "absolute", left: PAD + 940, top: 420, width: 780 }}>
            <Card label="本集的证词" accent={C.amber} style={{ height: 440 }}>
              <Body size={FT.label}>
                验证只能证明实现和定义一致，不能证明模型有用。
              </Body>
              <Body size={FT.label} style={{ marginTop: 16 }}>
                书里的式子和计划书里的数字，都要逐条对过才敢用。
              </Body>
              <div style={{ marginTop: 26, display: "flex", gap: 16 }}>
                <Verdict ok label="41 / 41" />
                <Chip>第 23 集完</Chip>
              </div>
            </Card>
          </div>
        </AbsoluteFill>
      </Pages>
    </Scene>
  );
};
