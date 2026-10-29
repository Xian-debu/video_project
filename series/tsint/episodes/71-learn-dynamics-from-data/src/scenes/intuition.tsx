import React from "react";
import { C, FONT, FT } from "../../design/tokens";
import { Build } from "../../design/primitives";
import { Math as MathTex } from "../../design/Math";
import { Head, Scene, PAD, Card, Mono, Body, Num, Plot, beatAt, NEURAL } from "../shared";

/** 直觉：指数在对数坐标里是直线；换成一个网络，参数从 2 变成 337。 */
export const SIntuition: React.FC = () => {
  const b = (i: number) => beatAt("intuition", i, 24);
  const stock = NEURAL.paramStock;
  const lossS = NEURAL.lossSin;
  const lossT = NEURAL.lossStock;
  const lw = 740, lh = 300;
  const X = (t: number) => 50 + t * (lw - 80);
  const logPts = stock.map((p) => ({ x: p.t, y: Math.log(p.v) }));
  const fitLog = stock.map((p) => ({ x: p.t, y: Math.log(p.fit) }));

  const dw = 700, dh = 240;
  const DX = (t: number) => 46 + t * (dw - 70);
  const lossMin = 0.65, lossMax = 1.02;
  const DY = (v: number) => dh - 40 - ((Math.log(v) - Math.log(lossMin)) / (Math.log(lossMax) - Math.log(lossMin))) * (dh - 70);
  const sN = lossS.map((p) => ({ x: p.epoch / 300, y: p.loss / lossS[0].loss }));
  const tN = lossT.map((p) => ({ x: p.epoch / 300, y: p.loss / lossT[0].loss }));

  return (
    <Scene id="intuition">
      <Head kicker="03 / 从直线到网络" title="从两个参数到三百三十七个" goal="先看为什么常数够用，再看它为什么不够" />

      <div style={{ position: "absolute", left: PAD, top: 266, width: 820 }}>
        <Build at={b(0)}>
          <Card label="对数坐标 · 指数变成直线" accent={C.cyan} pad={14}>
            <Plot
              w={lw} h={lh} at={b(0)} dur={60}
              x={X} y={(v) => lh - 44 - ((v + 0.06) / 1.42) * (lh - 70)}
              series={[
                { pts: logPts, color: C.violet, width: 2.2 },
                { pts: fitLog, color: C.cyan, width: 2.4, dash: true },
              ]}
              grid={{ x: [0, 0.5, 1], y: [0, 0.5, 1], fmtX: (v) => (v === 0 ? "0" : v === 1 ? "200 日" : String(Math.round(v * 200))), fmtY: (v) => v.toFixed(1) }}
            />
            <Mono size={FT.micro} color={C.inkFaint}>{"k 就是斜率；直线的弯曲量，就是常数模型的残差"}</Mono>
          </Card>
        </Build>

        <Build at={b(6)} style={{ marginTop: 12 }}>
          <Card label="训练损失 · loss/loss₀（对数纵轴）" accent={C.amber} pad={14}>
            <Plot
              w={dw} h={dh} at={b(6)} dur={70}
              x={DX} y={DY}
              series={[
                { pts: tN, color: C.violet, width: 2.2 },
                { pts: sN, color: C.amber, width: 2.2 },
              ]}
              grid={{ x: [0, 0.5, 1], y: [0.7, 0.8, 0.9, 1], fmtX: (v) => (v === 0 ? "0 ep" : String(Math.round(v * 300)) + " ep"), fmtY: (v) => v.toFixed(2) }}
            />
            <div style={{ display: "flex", gap: 22, marginTop: 6 }}>
              <Mono size={FT.micro} color={C.amber}>{"— sin · 6 窗"}</Mono>
              <Mono size={FT.micro} color={C.violet}>{"— stock · 12 窗"}</Mono>
              <Mono size={FT.micro} color={C.inkFaint}>{"末端：sin 0.993×，stock 0.728×"}</Mono>
            </div>
          </Card>
        </Build>
      </div>

      <div style={{ position: "absolute", left: 900, top: 266, width: 900 }}>
        <Build at={b(3)}>
          <Card label="f_θ · 2 → 16 → 16 → 1" accent={C.violet} pad={16}>
            <svg width={860} height={300} style={{ display: "block" }}>
              {[70, 150].map((iy, j) =>
                [0, 1, 2, 3, 4, 5].map((i) => (
                  <line key={"a" + j + i} x1={182} y1={iy} x2={402} y2={20 + i * 40} stroke={C.cyan} strokeWidth={1} opacity={0.55} />
                ))
              )}
              {[0, 1, 2, 3, 4, 5].map((i) =>
                [0, 1, 2, 3, 4, 5].map((j) => (
                  <line key={"b" + i + j} x1={438} y1={20 + i * 40} x2={582} y2={20 + j * 40} stroke={C.violet} strokeWidth={1} opacity={0.42} />
                ))
              )}
              {[0, 1, 2, 3, 4, 5].map((j) => (
                <line key={"c" + j} x1={618} y1={20 + j * 40} x2={744} y2={120} stroke={C.violet} strokeWidth={1} opacity={0.55} />
              ))}
              {[{ x: 150, y: 70, t: "x" }, { x: 150, y: 150, t: "τ" }].map((q, i) => (
                <g key={"i" + i}>
                  <circle cx={q.x} cy={q.y} r={16} fill={C.bg} stroke={C.cyan} strokeWidth={2} />
                  <text x={q.x} y={q.y + 6} fill={C.cyan} fontFamily={FONT.mono} fontSize={17} textAnchor="middle">{q.t}</text>
                </g>
              ))}
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <g key={"h1" + i}>
                  <circle cx={420} cy={20 + i * 40} r={16} fill={C.bg} stroke={C.violet} strokeWidth={2} />
                  <text x={420} y={26 + i * 40} fill={C.inkFaint} fontFamily={FONT.mono} fontSize={14} textAnchor="middle">{"h"}</text>
                </g>
              ))}
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <g key={"h2" + i}>
                  <circle cx={600} cy={20 + i * 40} r={16} fill={C.bg} stroke={C.violet} strokeWidth={2} />
                  <text x={600} y={26 + i * 40} fill={C.inkFaint} fontFamily={FONT.mono} fontSize={14} textAnchor="middle">{"h"}</text>
                </g>
              ))}
              <circle cx={760} cy={120} r={16} fill={C.bg} stroke={C.amber} strokeWidth={2} />
              <text x={790} y={126} fill={C.amber} fontFamily={FONT.mono} fontSize={15} textAnchor="start">{"dx/dt"}</text>
              {[[150, "2"], [420, "16 tanh"], [600, "16 tanh"], [760, "1"]].map(([x, t], i) => (
                <text key={"l" + i} x={Number(x)} y={286} fill={C.inkFaint} fontFamily={FONT.mono} fontSize={16} textAnchor="middle">{t as string}</text>
              ))}
            </svg>
            <Mono size={FT.micro} color={C.inkFaint}>{"输入是 (x, τ)，输出是这一刻的变化率；积分器负责把变化率连成轨迹"}</Mono>
          </Card>
        </Build>

        <Build at={b(10)} style={{ marginTop: 14 }}>
          <Card label="337 个参数 · 674 次前向 / epoch" accent={C.cyan} pad={14} style={{ width: 860 }}>
            <div style={{ display: "flex", gap: 30, alignItems: "baseline" }}>
              <div><Mono size={FT.micro} color={C.inkFaint}>{"32+16"}</Mono><div><Num value={48} size={30} color={C.cyan} /></div></div>
              <div><Mono size={FT.micro} color={C.inkFaint}>{"256+16"}</Mono><div><Num value={272} size={30} color={C.cyan} /></div></div>
              <div><Mono size={FT.micro} color={C.inkFaint}>{"16+1"}</Mono><div><Num value={17} size={30} color={C.cyan} /></div></div>
              <div style={{ flex: 1 }} />
              <div style={{ textAlign: "right" }}>
                <Mono size={FT.micro} color={C.inkFaint}>{"中心差分：每个参数两次扰动"}</Mono>
                <div><Num value={674} size={30} color={C.amber} /></div>
              </div>
            </div>
          </Card>
        </Build>

        <Build at={b(14)} style={{ marginTop: 10 }}>
          <Card label="为什么不用反向传播" accent={C.amber} pad={12} style={{ width: 860 }}>
            <Body size={FT.body}>
              {"这一集只做前向与有限差分；反向传播留给下一集。"}
            </Body>
            <div style={{ marginTop: 8 }}>
              <MathTex tex={"\\theta_{j} \\leftarrow \\theta_j - \\eta \\frac{\\mathcal{L}(\\theta_j+h)-\\mathcal{L}(\\theta_j-h)}{2h}"} size={18} />
            </div>
          </Card>
        </Build>
      </div>
    </Scene>
  );
};