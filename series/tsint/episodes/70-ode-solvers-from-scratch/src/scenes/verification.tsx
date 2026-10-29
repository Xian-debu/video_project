import React from "react";
import { C, FONT, FT } from "../../design/tokens";
import { Build } from "../../design/primitives";
import { Card, Mono, Body, Plot, Num, Head, Scene, PAD, ODE, beatAt } from "../shared";

const PW = 760;
const PH = 420;
const lx = (h: number) => (Math.log10(h) + 3) / 2.4;
const X = (h: number) => lx(h) * PW;
const ly = (e: number) => (Math.log10(e) + 8) / 13;
const Y = (e: number) => PH - ly(e) * PH;

const fit = (h: number[], err: number[], slope: number) => {
  const i = h.findIndex((v) => Math.abs(v - 0.02) < 1e-12);
  const b = Math.log10(err[i]) - slope * Math.log10(h[i]);
  return [0.2, 0.0025].map((v) => ({ x: v, y: Math.pow(10, b + slope * Math.log10(v)) }));
};

/** 验证：单步、能量、收敛阶、相图、测试；每个数都能回到证据文件。 */
export const SVerification: React.FC = () => {
  const beats = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20].map((i) => beatAt("verification", i, 21));
  const c = ODE.convergence;
  return (
    <Scene id="verification">
      <Head kicker="05 / 验证" title="每个数字都能回到一次运行" goal="单步、能量、收敛阶、相图、测试，逐项对照" />

      <div style={{ position: "absolute", left: PAD, top: 286, width: 820 }}>
        <Build at={beats[8]}>
          <Card label="第三组 · 误差随步长下降（双对数）" accent={C.cyan} pad={16}>
            <div style={{ position: "relative", width: PW, height: PH }}>
              <svg width={PW} height={PH} style={{ position: "absolute", inset: 0 }}>
                {[0.2, 0.05, 0.01, 0.0025].map((h) => (
                  <g key={h}>
                    <line x1={X(h)} y1={0} x2={X(h)} y2={PH} stroke={C.panelLine} opacity={0.5} />
                    <text x={X(h)} y={PH + 22} textAnchor="middle" fill={C.inkFaint} fontFamily={FONT.mono} fontSize={FT.micro}>{String(h)}</text>
                  </g>
                ))}
                {[1e4, 1, 1e-4, 1e-8].map((v) => (
                  <g key={v}>
                    <line x1={0} y1={Y(v)} x2={PW} y2={Y(v)} stroke={C.panelLine} opacity={0.5} />
                    <text x={-10} y={Y(v) + 5} textAnchor="end" fill={C.inkFaint} fontFamily={FONT.mono} fontSize={FT.micro}>
                      {v >= 1 ? "1e" + Math.round(Math.log10(v)) : "1e" + Math.round(Math.log10(v))}
                    </text>
                  </g>
                ))}
                <text x={PW / 2} y={PH + 52} textAnchor="middle" fill={C.inkDim} fontFamily={FONT.sans} fontSize={FT.meta}>{"步长 Δt"}</text>
                <text x={-46} y={-12} fill={C.inkDim} fontFamily={FONT.sans} fontSize={FT.meta}>{"终点误差"}</text>
              </svg>
              <div style={{ position: "absolute", inset: 0 }}>
                <Plot w={PW} h={PH} at={beats[8]} dur={55} x={(v) => X(Math.pow(10, v))} y={(v) => Y(Math.pow(10, v))}
                  series={[
                    { pts: fit(c.h, c.eulerErr, c.eulerSlope).map((p) => ({ x: Math.log10(p.x), y: Math.log10(p.y) })), color: C.amber, width: 1.5, dash: true },
                    { pts: fit(c.h, c.rk4Err, c.rk4Slope).map((p) => ({ x: Math.log10(p.x), y: Math.log10(p.y) })), color: C.violet, width: 1.5, dash: true },
                    { pts: c.h.map((h, i) => ({ x: Math.log10(h), y: Math.log10(c.eulerErr[i]) })), color: C.amber, width: 3, dot: true },
                    { pts: c.h.map((h, i) => ({ x: Math.log10(h), y: Math.log10(c.rk4Err[i]) })), color: C.violet, width: 3, dot: true },
                  ]} />
              </div>
            </div>
            <div style={{ display: "flex", gap: 24, marginTop: 2 }}>
              <Mono size={FT.meta} color={C.amber}>{"— 欧拉 · 拟合斜率 0.974…"}</Mono>
              <Mono size={FT.meta} color={C.violet}>{"— RK4 · 拟合斜率 3.993…"}</Mono>
            </div>
          </Card>
        </Build>

        <Build at={beats[15]} style={{ marginTop: 18 }}>
          <Card label="第四组 · 相图（十周期）" accent={C.inkFaint} pad={10}>
            <div style={{ display: "flex", gap: 18, alignItems: "center" }}>
              <div style={{ width: 210, height: 110, position: "relative" }}>
                <Plot w={210} h={110} at={beats[15]} dur={40}
                  x={(v) => ((v + 1.6) / 3.2) * 210} y={(v) => 55 - (v / 3.2) * 110}
                  series={[
                    { pts: ODE.phase.analytic.map((p) => ({ x: p.x, y: p.v })), color: C.inkDim, width: 1.5, dash: true },
                    { pts: ODE.phase.euler.map((p) => ({ x: p.x, y: p.v })), color: C.amber, width: 2 },
                    { pts: ODE.phase.rk4.map((p) => ({ x: p.x, y: p.v })), color: C.violet, width: 1.6 },
                  ]} />
              </div>
              <div style={{ flex: 1 }}>
                <Body size={FT.meta}>{"精确解闭合；欧拉向外扩张；RK4 的螺旋几乎贴着椭圆。"}</Body>
                <div style={{ display: "flex", gap: 16, marginTop: 8 }}>
                  <Mono size={FT.micro} color={C.inkDim}>{"— 精确"}</Mono>
                  <Mono size={FT.micro} color={C.amber}>{"— 欧拉"}</Mono>
                  <Mono size={FT.micro} color={C.violet}>{"— RK4"}</Mono>
                </div>
              </div>
            </div>
          </Card>
        </Build>
      </div>

      <div style={{ position: "absolute", left: 950, top: 286, width: 898 }}>
        <Build at={beats[3]}>
          <Card label="第一组 · 单步" accent={C.amber} pad={16}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
              <Mono size={FT.label} color={C.inkDim}>{"欧拉"}</Mono>
              <Mono size={FT.h2} color={C.amber}>{"1.1"}</Mono>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginTop: 4 }}>
              <Mono size={FT.label} color={C.inkDim}>{"RK4"}</Mono>
              <Num value={ODE.key.rk4OneStep} size={FT.h2} color={C.violet} />
            </div>
          </Card>
        </Build>

        <Build at={beats[5]} style={{ marginTop: 14 }}>
          <Card label="第二组 · 十个周期的能量比" accent={C.coral} pad={16}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
              <Mono size={FT.label} color={C.amber}>{"欧拉"}</Mono>
              <Num value={ODE.key.eulerEnergyRatio} size={FT.num} color={C.amber} />
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginTop: 4 }}>
              <Mono size={FT.label} color={C.violet}>{"RK4"}</Mono>
              <Num value={ODE.key.rk4EnergyRatio} size={FT.num} color={C.violet} />
            </div>
          </Card>
        </Build>

        <Build at={beats[10]} style={{ marginTop: 14 }}>
          <Card label="收敛阶 · 最小二乘拟合" accent={C.cyan} pad={16}>
            <div style={{ display: "flex", gap: 24 }}>
              <div style={{ flex: 1 }}>
                <Mono size={FT.micro} color={C.inkFaint}>{"欧拉 · 一阶"}</Mono>
                <div><Num value={ODE.key.eulerOrder} size={FT.h2} color={C.amber} /></div>
              </div>
              <div style={{ width: 1, background: C.panelLine }} />
              <div style={{ flex: 1 }}>
                <Mono size={FT.micro} color={C.inkFaint}>{"RK4 · 四阶"}</Mono>
                <div><Num value={ODE.key.rk4Order} size={FT.h2} color={C.violet} /></div>
              </div>
            </div>
            <Body size={FT.tiny} style={{ marginTop: 6 }}>{"只取小步长四点；大步长时渐近展开还没生效。"}</Body>
          </Card>
        </Build>

        <Build at={beats[18]} style={{ marginTop: 14 }}>
          <Card label="第五组 · 测试与证据" accent={C.cyan} pad={14}>
            <div style={{ background: C.bg, border: "1px solid " + C.panelLine, borderRadius: 8, padding: "10px 14px" }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <Mono size={FT.micro} color={C.inkDim}>{"$ cabal test"}</Mono>
                <Mono size={FT.micro} color={C.cyan}>{"34 / 34 passed"}</Mono>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
                <Mono size={FT.micro} color={C.inkDim}>{"$ check_evidence.py"}</Mono>
                <Mono size={FT.micro} color={C.cyan}>{"3 files · 0 error"}</Mono>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
                <Mono size={FT.micro} color={C.inkDim}>{"tsBaseCommit"}</Mono>
                <Mono size={FT.micro} color={C.inkFaint}>{"dbc3d85"}</Mono>
              </div>
            </div>
          </Card>
        </Build>
      </div>
    </Scene>
  );
};
