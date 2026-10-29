import React from "react";
import { C, FONT, FT } from "../../design/tokens";
import { Build } from "../../design/primitives";
import { Math as MathTex } from "../../design/Math";
import { Head, Scene, PAD, Plate, Card, Mono, Body, K, beatAt } from "../shared";

/** 问题：真实采样不等间隔，固定步长模型要先补洞；ODE 原生支持任意时刻。 */
export const SProblem: React.FC = () => {
  const b = (i: number) => beatAt("problem", i, 15);
  const w = 720, h = 230;
  const xs = [0.03, 0.09, 0.16, 0.22, 0.34, 0.39, 0.49, 0.56, 0.7, 0.75, 0.86, 0.93];
  const X = (t: number) => 40 + t * (w - 70);
  const Y = h - 58;

  return (
    <Scene id="problem">
      <Head kicker="01 / 采样与动力学" title="拟合不是解释" goal="真实序列的采样不等间隔，右端项也不是常数" />

      <div style={{ position: "absolute", left: PAD, top: 274, width: 800 }}>
        <Build at={b(2)}>
          <Card label="观测 · 不等间隔的采样" accent={C.cyan} pad={18}>
            <svg width={w} height={h} style={{ display: "block" }}>
              <line x1={30} y1={Y} x2={w - 20} y2={Y} stroke={C.panelLine} strokeWidth={2} />
              {[0, 1, 2, 3, 4, 5].map((i) => {
                const gx = X(0.03 + i * 0.18);
                return <rect key={i} x={gx - 12} y={Y - 4} width={24} height={8} fill={C.panelLine} opacity={0.9} />;
              })}
              {xs.map((t, i) => (
                <g key={i}>
                  <line x1={X(t)} y1={Y} x2={X(t)} y2={Y - 30 - (i % 3) * 10} stroke={C.cyan} strokeWidth={1.6} strokeDasharray="3 5" opacity={0.7} />
                  <circle cx={X(t)} cy={Y - 30 - (i % 3) * 10} r={5.5} fill={C.cyan} />
                </g>
              ))}
              <text x={X(0.34)} y={Y + 34} fill={C.inkFaint} fontFamily={FONT.mono} fontSize={18}>周末 / 停牌 = 缺口</text>
              <text x={w - 22} y={Y + 34} fill={C.inkFaint} fontFamily={FONT.mono} fontSize={18} textAnchor="end">t</text>
            </svg>
            <div style={{ display: "flex", gap: 18, marginTop: 2 }}>
              <Mono size={FT.micro} color={C.cyan}>{"观测点：收盘那一刻"}</Mono>
              <Mono size={FT.micro} color={C.inkFaint}>{"缺口：模型不该假装它不存在"}</Mono>
            </div>
          </Card>
        </Build>

        <Build at={b(5)} style={{ marginTop: 18 }}>
          <Card label="微分方程的原生优势" accent={C.violet} pad={18}>
            <Body size={FT.body}>
              {"ODE 不要求等间隔：已知右端项，就能从任意 t₀ 积到任意目标时刻。"}
            </Body>
            <div style={{ marginTop: 10, display: "flex", alignItems: "baseline", gap: 12 }}>
              <MathTex tex={"\\hat{x}_{t_1},\\dots,\\hat{x}_{t_n} = \\mathrm{ODESolver}(x_0, f_\\theta, t_0, \\langle t_1,\\dots,t_n\\rangle)"} size={25} />
            </div>
            <div style={{ marginTop: 8 }}>
              <Mono size={FT.micro} color={C.inkFaint}>{"书里式 9.21：目标时刻是输入，不是网格"}</Mono>
            </div>
          </Card>
        </Build>

        <Build at={b(12)} style={{ marginTop: 18 }}>
          <div style={{ display: "flex", gap: 16 }}>
            <K>{"k 怎么估"}</K>
            <K>{"f 怎么参数化"}</K>
            <K>{"训练怎么穿过求解器"}</K>
          </div>
        </Build>
      </div>

      <div style={{ position: "absolute", left: 900, top: 270, width: 880 }}>
        <Build at={b(2)}>
          <Plate id="eq-odesolve" width={600} caption="原文式 9.21–9.22：求解器给任意时刻的值，损失按观测时刻算" />
        </Build>

        <div style={{ marginTop: 18, display: "flex", flexDirection: "column", gap: 12 }}>
          {[
            { n: "01", q: "k 怎么估", d: "常数模型：闭式最小二乘，一行算完。", c: C.amber },
            { n: "02", q: "f 怎么参数化", d: "两层 tanh MLP，输入状态与时间，输出变化率。", c: C.violet },
            { n: "03", q: "训练怎么走", d: "把求解器当前向，损失对参数求梯度。", c: C.cyan },
          ].map((x, i) => (
            <Build key={x.n} at={b(5 + i)}>
              <Card accent={x.c} pad={14} style={{ width: 860 }}>
                <div style={{ display: "flex", alignItems: "baseline", gap: 16 }}>
                  <Mono size={FT.meta} color={x.c}>{x.n}</Mono>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: FONT.sans, fontSize: FT.h3, color: C.ink }}>{x.q}</div>
                    <Mono size={FT.micro} color={C.inkFaint}>{x.d}</Mono>
                  </div>
                </div>
              </Card>
            </Build>
          ))}
        </div>
      </div>
    </Scene>
  );
};