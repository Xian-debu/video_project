import React from "react";
import { C, FONT, FT } from "../../design/tokens";
import { Build } from "../../design/primitives";
import { Math } from "../../design/Math";
import { Card, Mono, Body, Plot, Num, Head, Scene, PAD, ODE, beatAt } from "../shared";

const PW = 900;
const PH = 520;
const X = (v: number) => (v / 3.4) * PW;
const Y = (v: number) => PH - ((v - 0.6) / 3.7) * PH;

const series = (vals: number[], color: string, width = 2.5) => ({
  pts: ODE.amplification.y.map((y, i) => ({ x: y, y: vals[i] })), color, width,
});

/** 直觉：误差不是运气，是每步乘上的放大因子。 */
export const SIntuition: React.FC = () => {
  const beats = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23].map((i) => beatAt("intuition", i, 24));
  const limit = ODE.amplification.rk4Limit;
  return (
    <Scene id="intuition">
      <Head kicker="03 / 直觉" title="误差不是运气，是特征值" goal="从一步的线性映射推出能量为什么单调上涨" />

      <div style={{ position: "absolute", left: PAD, top: 286, width: 960 }}>
        <Build at={beats[5]}>
          <Card label="一步的放大因子 |R(iy)| · y = hω" accent={C.amber} pad={18}>
            <div style={{ position: "relative", width: PW, height: PH }}>
              <svg width={PW} height={PH} style={{ position: "absolute", inset: 0 }}>
                {[0, 1, 2, 3].map((v) => (
                  <g key={v}>
                    <line x1={X(v)} y1={0} x2={X(v)} y2={PH} stroke={C.panelLine} opacity={0.5} />
                    <text x={X(v)} y={PH + 22} textAnchor="middle" fill={C.inkFaint} fontFamily={FONT.mono} fontSize={FT.micro}>{v}</text>
                  </g>
                ))}
                {[1, 2, 3, 4].map((v) => (
                  <g key={"y" + v}>
                    <line x1={0} y1={Y(v)} x2={PW} y2={Y(v)} stroke={C.panelLine} opacity={0.5} />
                    <text x={-12} y={Y(v) + 5} textAnchor="end" fill={C.inkFaint} fontFamily={FONT.mono} fontSize={FT.micro}>{v}</text>
                  </g>
                ))}
                <line x1={0} y1={Y(1)} x2={PW} y2={Y(1)} stroke={C.cyan} strokeWidth={1.5} strokeDasharray="6 6" opacity={0.9} />
                <text x={8} y={Y(1) - 10} fill={C.cyan} fontFamily={FONT.mono} fontSize={FT.micro}>{"|R| = 1 · 能量守恒线"}</text>
              </svg>
              <div style={{ position: "absolute", inset: 0 }}>
                <Plot w={PW} h={PH} at={beats[5]} dur={55} x={X} y={Y}
                  series={[
                    series(ODE.amplification.euler, C.amber, 3),
                    series(ODE.amplification.rk4, C.violet, 3),
                    { pts: [{ x: limit, y: 0.7 }, { x: limit, y: 3.95 }], color: C.coral, width: 1.5, dash: true },
                  ]} />
              </div>
              <div style={{ position: "absolute", left: X(limit) + 8, top: 8 }}>
                <Mono size={FT.micro} color={C.coral}>{"y = 2√2"}</Mono>
              </div>
            </div>
            <div style={{ display: "flex", gap: 28, marginTop: 6 }}>
              <Mono size={FT.meta} color={C.amber}>{"— 欧拉：恒大于 1"}</Mono>
              <Mono size={FT.meta} color={C.violet}>{"— RK4：先低于 1"}</Mono>
              <Mono size={FT.meta} color={C.coral}>{"| 稳定边界"}</Mono>
            </div>
          </Card>
        </Build>
        <Build at={beats[10]} style={{ marginTop: 18 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <Mono size={FT.meta} color={C.inkDim}>{"欧拉每步 ×(1 + h²) = 1.01"}</Mono>
            <Mono size={FT.meta} color={C.inkFaint}>{"× 628 步 →"}</Mono>
            <Num value={ODE.key.eulerEnergyRatio} size={FT.h2} color={C.amber} />
            <Mono size={FT.micro} color={C.inkFaint}>{"倍 · 能量"}</Mono>
          </div>
        </Build>
      </div>

      <div style={{ position: "absolute", left: 1070, top: 286, width: 770 }}>
        <Build at={beats[3]}>
          <Card label="欧拉 · 二阶线性映射" accent={C.amber} pad={20}>
            <Math tex={"A = \\begin{pmatrix} 1 & \\Delta t \\\\ -\\omega^2 \\Delta t & 1 \\end{pmatrix}"} block size={27} align="left" />
            <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginTop: 4 }}>
              <Mono size={FT.micro} color={C.inkFaint}>{"λ = 1 ± i·hω"}</Mono>
              <Mono size={FT.micro} color={C.amber}>{"|λ|² = 1 + (hω)² > 1"}</Mono>
            </div>
          </Card>
        </Build>

        <Build at={beats[12]} style={{ marginTop: 16 }}>
          <Card label="RK4 · 四次多项式" accent={C.violet} pad={20}>
            <Math tex={"R(z) = 1 + z + \\frac{z^2}{2} + \\frac{z^3}{6} + \\frac{z^4}{24}"} block size={24} align="left" />
            <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginTop: 6 }}>
              <Mono size={FT.micro} color={C.inkFaint}>{"z = i·hω 代入"}</Mono>
              <Mono size={FT.micro} color={C.violet}>{"|R|² = 1 − y⁶/72 + y⁸/576"}</Mono>
            </div>
          </Card>
        </Build>

        <Build at={beats[16]} style={{ marginTop: 16 }}>
          <Card label="所以差在哪" accent={C.cyan} pad={20}>
            <div style={{ display: "flex", gap: 16 }}>
              <div style={{ flex: 1 }}>
                <Mono size={FT.label} color={C.amber}>{"欧拉 · 一阶"}</Mono>
                <Body size={FT.meta} style={{ marginTop: 6 }}>{"每步都多给一点能量，误差随步数线性累积。"}</Body>
              </div>
              <div style={{ width: 1, background: C.panelLine }} />
              <div style={{ flex: 1 }}>
                <Mono size={FT.label} color={C.violet}>{"RK4 · 四阶"}</Mono>
                <Body size={FT.meta} style={{ marginTop: 6 }}>{"能量偏差是步长六阶小量：步长减半，降到六十四分之一。"}</Body>
              </div>
            </div>
          </Card>
        </Build>

        <Build at={beats[20]} style={{ marginTop: 16 }}>
          <div style={{ display: "flex", gap: 18 }}>
            <Card accent={C.coral} pad={14} style={{ flex: 1 }}>
              <Mono size={FT.meta} color={C.coral}>{"RK4 一步 = 4 次求值"}</Mono>
            </Card>
            <Card accent={C.cyan} pad={14} style={{ flex: 1 }}>
              <Mono size={FT.meta} color={C.cyan}>{"稳定域仍是有限的"}</Mono>
            </Card>
          </div>
        </Build>
      </div>
    </Scene>
  );
};
