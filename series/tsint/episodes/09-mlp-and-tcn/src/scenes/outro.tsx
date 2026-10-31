import React from "react";
import { Build } from "../../design/primitives";
import { C, FONT, FT } from "../../design/tokens";
import { Body, Card, K, M, PAD, Pages, Scene, SceneHead, Stat, lf } from "../shared";

/* 收尾：四个数字，一句话；下一集注意力。 */

export const SOutro: React.FC = () => {
  const m = M;
  return (
    <Scene id="outro">
      <SceneHead id="outro" />
      <Pages id="outro" at={[0, 0.5]}>
        <div>
          <div style={{ position: "absolute", left: PAD, top: 236, fontFamily: FONT.sans, fontSize: FT.h2, color: C.inkDim }}>
            两个模型，四个数字，给这一集收尾。
          </div>
          <Build at={lf("outro", 0.04)}>
            <div style={{ position: "absolute", left: PAD, top: 312, display: "flex", gap: 24 }}>
              <Stat label="MLP 参数量" accent={C.cyan} value={m.mlp.params.toLocaleString("en-US")} sub="把窗口展平，看见的是点" valueColor={C.cyan} style={{ width: 432, height: 220 }} />
              <Stat label="TCN 参数量" accent={C.violet} value={m.tcn.params.toLocaleString("en-US")} sub="把时间写进结构，看见的是顺序" valueColor={C.violet} style={{ width: 432, height: 220 }} />
              <Stat label="感受野" accent={C.amber} value={String(m.tcn.rf)} sub="15 步之外，它和感知机一样瞎" valueColor={C.amber} style={{ width: 432, height: 220 }} />
              <Stat label="因果性差值" accent={C.coral} value={String(m.tcn.causal.pastMaxdiff)} sub="前十个输出逐位不变" valueColor={C.cyan} style={{ width: 432, height: 220 }} />
            </div>
          </Build>
          <Build at={lf("outro", 0.14)}>
            <div style={{ position: "absolute", left: PAD, top: 576, width: 1776 }}>
              <Card accent={C.cyan} style={{ height: 150 }}>
                <div style={{ fontFamily: FONT.serif, fontSize: FT.h1, color: C.ink }}>参数量更少的那个，看得更远。</div>
              </Card>
            </div>
          </Build>
        </div>

        <div>
          <div style={{ position: "absolute", left: PAD, top: 236, fontFamily: FONT.sans, fontSize: FT.h2, color: C.inkDim }}>
            但时间卷积也有它看不见的地方：十五步之外，一片黑。
          </div>
          <Build at={lf("outro", 0.56)}>
            <div style={{ position: "absolute", left: PAD, top: 306, width: 1100 }}>
              <Card label="下一集 · 换一种看法" accent={C.violet} style={{ height: 330 }}>
                <div style={{ fontFamily: FONT.serif, fontSize: FT.h1, color: C.ink }}>让每个位置自己决定看哪里。</div>
                <Body style={{ marginTop: 16 }}>同一个窗口，同样十五步；但每个位置都能看见整个序列的一部分。</Body>
                <K style={{ display: "block", marginTop: 18 }}>那就注意力。它会学到什么，又会丢掉什么？</K>
              </Card>
            </div>
          </Build>
          <Build at={lf("outro", 0.72)}>
            <div style={{ position: "absolute", left: PAD, top: 690, fontFamily: FONT.sans, fontSize: FT.h2, color: C.inkDim }}>
              下一集，注意力块。感谢观看，下一集见。
            </div>
          </Build>
        </div>
      </Pages>
    </Scene>
  );
};
