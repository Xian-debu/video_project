import React from "react";
import { C, FONT, FT, FT_T } from "../../design/tokens";
import { Build } from "../../design/primitives";
import { Card, Mono, Body, Plot, Num, Scene, PAD, ODE, beatAt, sceneFrames } from "../shared";

const PW = 720;
const PH = 480;
const X = (v: number) => ((v + 1.7) / 3.4) * PW;
const Y = (v: number) => PH / 2 - (v / 3.4) * PH;

/** 开场：一个本应闭合的椭圆，和一条越走越远的螺旋。 */
export const SOpen: React.FC = () => {
  const beats = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((i) => beatAt("open", i, 12));
  const n = sceneFrames("open");
  const euler = ODE.phase.euler.map((p) => ({ x: p.x, y: p.v }));
  const rk4 = ODE.phase.rk4.map((p) => ({ x: p.x, y: p.v }));
  return (
    <Scene id="open">
      <div style={{ position: "absolute", left: PAD, top: 86, width: 980 }}>
        <div style={{ fontFamily: FONT.mono, fontSize: FT.label, letterSpacing: FT_T.label, color: C.cyan }}>
          {"第 9 章 / 常微分方程 · 9.1.2"}
        </div>
        <div style={{ fontFamily: FONT.serif, fontSize: FT.display, lineHeight: 1.12, marginTop: 14 }}>
          <>{"欧拉法把弹簧"}<br />{"算成了永动机"}</>
        </div>
      </div>

      <div style={{ position: "absolute", left: PAD, top: 330 }}>
        <div style={{ position: "relative", width: PW, height: PH }}>
          <svg width={PW} height={PH} style={{ position: "absolute", inset: 0 }}>
            {[-1, 0, 1].map((v) => (
              <line key={"x" + v} x1={X(v)} y1={0} x2={X(v)} y2={PH} stroke={C.panelLine} opacity={0.45} />
            ))}
            {[-1, 0, 1].map((v) => (
              <line key={"y" + v} x1={0} y1={Y(v)} x2={PW} y2={Y(v)} stroke={C.panelLine} opacity={0.45} />
            ))}
            <text x={PW - 6} y={Y(0) - 10} textAnchor="end" fill={C.inkFaint} fontFamily={FONT.mono} fontSize={FT.micro}>{"位移 x"}</text>
            <text x={X(0) + 12} y={18} fill={C.inkFaint} fontFamily={FONT.mono} fontSize={FT.micro}>{"速度 v"}</text>
          </svg>
          <div style={{ position: "absolute", inset: 0 }}>
            <Plot w={PW} h={PH} at={beats[2]} dur={70} x={X} y={Y}
              series={[{ pts: ODE.phase.analytic.map((p) => ({ x: p.x, y: p.v })), color: C.inkDim, width: 2, dash: true }]} />
          </div>
          <div style={{ position: "absolute", inset: 0 }}>
            <Plot w={PW} h={PH} at={beats[3]} dur={Math.round(n * 0.55)} x={X} y={Y}
              series={[{ pts: euler, color: C.amber, width: 3 }]} />
          </div>
          <div style={{ position: "absolute", inset: 0 }}>
            <Plot w={PW} h={PH} at={beats[9]} dur={90} x={X} y={Y}
              series={[{ pts: rk4, color: C.violet, width: 2.5 }]} />
          </div>
        </div>
        <div style={{ display: "flex", gap: 26, marginTop: 8 }}>
          <Mono size={FT.meta} color={C.inkDim}>{"— 精确解 · 闭合曲线"}</Mono>
          <Mono size={FT.meta} color={C.amber}>{"— 欧拉 · 向外扩张"}</Mono>
          <Mono size={FT.meta} color={C.violet}>{"— RK4 · 几乎重合"}</Mono>
        </div>
      </div>

      <div style={{ position: "absolute", left: 860, top: 330, width: 940 }}>
        <Build at={beats[4]}>
          <Card label="同一张网格 · 步长 h = 0.1 · 十个周期" accent={C.amber} pad={22}>
            <Body size={FT.meta}>{"能量比 = 末态能量 / 初态能量"}</Body>
            <div style={{ display: "flex", alignItems: "baseline", gap: 18, marginTop: 8 }}>
              <Num value={ODE.key.eulerEnergyRatio} size={FT.num} color={C.amber} />
              <Mono size={FT.label} color={C.inkFaint}>{"欧拉"}</Mono>
            </div>
            <div style={{ marginTop: 16, height: 150 }}>
              <Plot w={860} h={150} at={beats[5]} dur={60}
                x={(v) => (v / ODE.meta.steps) * 860}
                y={(v) => 150 - (Math.log10(v) / Math.log10(1000)) * 150}
                series={[
                  { pts: ODE.energy.euler.map((v, i) => ({ x: (i / (ODE.energy.euler.length - 1)) * ODE.meta.steps, y: v })), color: C.amber, width: 2.5 },
                  { pts: ODE.energy.rk4.map((v, i) => ({ x: (i / (ODE.energy.rk4.length - 1)) * ODE.meta.steps, y: v })), color: C.violet, width: 2.5 },
                ]} />
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
              <Mono size={FT.micro} color={C.inkFaint}>{"能量（对数轴）"}</Mono>
              <Mono size={FT.micro} color={C.inkFaint}>{"628 步"}</Mono>
            </div>
          </Card>
        </Build>

        <Build at={beats[9]} style={{ marginTop: 22 }}>
          <div style={{ display: "flex", gap: 20 }}>
            <Card accent={C.violet} pad={18} style={{ flex: 1 }}>
              <Mono size={FT.meta} color={C.violet}>{"RK4 · 能量比"}</Mono>
              <div style={{ marginTop: 6 }}><Num value={ODE.key.rk4EnergyRatio} size={FT.h2} color={C.violet} /></div>
            </Card>
            <Card accent={C.cyan} pad={18} style={{ flex: 1 }}>
              <Mono size={FT.meta} color={C.cyan}>{"单步 · 从 1 出发"}</Mono>
              <div style={{ marginTop: 6, display: "flex", gap: 18, alignItems: "baseline" }}>
                <Mono size={FT.h2} color={C.amber}>{"1.1"}</Mono>
                <Mono size={FT.meta} color={C.inkFaint}>{"vs"}</Mono>
                <Mono size={FT.h2} color={C.violet}>{String(ODE.key.rk4OneStep)}</Mono>
              </div>
            </Card>
          </div>
        </Build>
      </div>

      <Build at={beats[11]} style={{ position: "absolute", right: PAD, bottom: 116 }}>
        <Mono size={FT.meta} color={C.inkFaint}>{"ts-base · ch09 · dbc3d85"}</Mono>
      </Build>
    </Scene>
  );
};
