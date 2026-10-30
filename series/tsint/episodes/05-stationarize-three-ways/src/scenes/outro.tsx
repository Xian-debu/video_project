import React from "react";
import { Build } from "../../design/primitives";
import { C, FONT, FT } from "../../design/tokens";
import { Body, Card, K, M, PAD, Pages, Scene, SceneHead, Stat, lf } from "../shared";

export const SOutro: React.FC = () => {
  const s = M.stats;
  return (
    <Scene id="outro">
      <SceneHead id="outro" />
      <Pages id="outro" at={[0, 0.52]}>
        <div>
          <div style={{ position: "absolute", left: PAD, top: 236, fontFamily: FONT.sans, fontSize: FT.h2, color: C.inkDim }}>
            回到开头三个数：一个改了，另一个没改。
          </div>
          <Build at={lf("outro", 0.06)}>
            <div style={{ position: "absolute", left: PAD, top: 320, display: "flex", gap: 26 }}>
              <Stat label="水平 ACF" accent={C.amber} value={s.acfLevel.toFixed(4)} sub="价格几乎记住前一天" style={{ width: 574, height: 240 }} />
              <Stat label="差分后 ACF" accent={C.cyan} value={s.acfDiff.toFixed(4)} sub="记忆被拿走，方差成为常数" style={{ width: 574, height: 240 }} />
              <Stat label="Z-score 后 ACF" accent={C.violet} value={s.acfZ.toFixed(4)} sub="和原来完全相同" style={{ width: 574, height: 240 }} />
            </div>
          </Build>
          <Build at={lf("outro", 0.14)}>
            <div style={{ position: "absolute", left: PAD, top: 620, width: 1776, fontFamily: FONT.serif, fontSize: 44, color: C.ink }}>
              差分改积分阶，对数改方差，标准化改坐标。
            </div>
          </Build>
        </div>

        <div>
          <div style={{ position: "absolute", left: PAD, top: 236, fontFamily: FONT.sans, fontSize: FT.h2, color: C.inkDim }}>
            下一集：把一条序列拆成趋势、季节、残差。
          </div>
          <Build at={lf("outro", 0.58)}>
            <div style={{ position: "absolute", left: PAD, top: 320, display: "flex", gap: 26 }}>
              <Card label="趋势" accent={C.cyan} style={{ width: 574, height: 250 }}><div style={{ fontFamily: FONT.serif, fontSize: 40, color: C.ink }}>T<sub>t</sub></div><Body style={{ marginTop: 10 }}>往哪走：水平、斜率、拐点。</Body></Card>
              <Card label="季节" accent={C.amber} style={{ width: 574, height: 250 }}><div style={{ fontFamily: FONT.serif, fontSize: 40, color: C.ink }}>S<sub>t</sub></div><Body style={{ marginTop: 10 }}>怎么绕：周期、振幅、相位。</Body></Card>
              <Card label="残差" accent={C.violet} style={{ width: 574, height: 250 }}><div style={{ fontFamily: FONT.serif, fontSize: 40, color: C.ink }}>R<sub>t</sub></div><Body style={{ marginTop: 10 }}>剩下什么：拟合之后还能不能检验。</Body></Card>
            </div>
          </Build>
          <Build at={lf("outro", 0.66)}>
            <div style={{ position: "absolute", left: PAD, top: 620, width: 1776 }}>
              <Body>拆开之后，每一块都能单独检验；这也是后面所有模型的前置步骤。</Body>
              <K style={{ display: "block", marginTop: 16 }}>这一集的代码、数据、证据都已入库</K>
            </div>
          </Build>
        </div>
      </Pages>
    </Scene>
  );
};
