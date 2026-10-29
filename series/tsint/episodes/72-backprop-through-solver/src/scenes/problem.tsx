import React from "react";
import { C, FONT, FT } from "../../design/tokens";
import { Build } from "../../design/primitives";
import { Head, Scene, PAD, Card, Mono, Body, Num, BP, beatAt } from "../shared";

const TapeRow: React.FC<{ n: number; color: string }> = ({ n, color }) => (
  <div style={{ display: "flex", gap: 2 }}>
    {Array.from({ length: n }).map((_, i) => (
      <div key={i} style={{ flex: 1, height: 22, borderRadius: 1, background: color, opacity: i < n - 1 ? 0.85 : 0.35 }} />
    ))}
  </div>
);

const CheckpointRow: React.FC = () => (
  <div style={{ display: "flex", alignItems: "center", gap: 0 }}>
    {Array.from({ length: 11 }).map((_, i) => (
      <React.Fragment key={i}>
        <div style={{ width: 12, height: 12, borderRadius: 6, background: C.amber }} />
        {i < 10 ? <div style={{ flex: 1, height: 2, background: C.panelLine, position: "relative" }}>
          <div style={{ position: "absolute", left: 0, right: 0, top: -4, height: 10, borderTop: "1px dashed " + C.inkFaint, opacity: 0.5 }} />
        </div> : null}
      </React.Fragment>
    ))}
  </div>
);

/** 问题：同一个梯度，直接法存磁带，伴随法存检查点。 */
export const SProblem: React.FC = () => {
  const b = (i: number) => beatAt("problem", i, 15);
  const k = BP.key;

  return (
    <Scene id="problem">
      <Head kicker="01 / 梯度与内存" title="梯度从哪里来" goal="为什么反传会吃掉内存，伴随法又拿什么换" />

      <div style={{ position: "absolute", left: PAD, top: 276, width: 900 }}>
        <Build at={b(2)}>
          <Card label="直接法 · 反向传播" accent={C.violet} pad={22} style={{ width: 860 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
              <div style={{ fontFamily: FONT.serif, fontSize: FT.h2, color: C.ink }}>{"前向录一遍，反向按帧取"}</div>
              <Mono size={FT.h3} color={C.violet}>{"O(T)"}</Mono>
            </div>
            <div style={{ marginTop: 16 }}><TapeRow n={80} color={C.violet} /></div>
            <div style={{ marginTop: 10, display: "flex", justifyContent: "space-between" }}>
              <Mono size={FT.micro} color={C.inkFaint}>{"x₀"}</Mono>
              <Mono size={FT.micro} color={C.violet}>{"201 个状态，全部留在内存里"}</Mono>
              <Mono size={FT.micro} color={C.inkFaint}>{"x_T"}</Mono>
            </div>
            <div style={{ marginTop: 14 }}>
              <Mono size={FT.micro} color={C.inkFaint}>{"峰值内存（20 万步）"}</Mono>
              <div><Num value={k.memDirect200k} size={26} color={C.violet} /> <Mono size={FT.meta} color={C.inkFaint}>{"bytes"}</Mono></div>
            </div>
          </Card>
        </Build>

        <Build at={b(6)} style={{ marginTop: 14 }}>
          <Card label="伴随法 · checkpoint" accent={C.amber} pad={22} style={{ width: 860 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
              <div style={{ fontFamily: FONT.serif, fontSize: FT.h2, color: C.ink }}>{"只存书签，其余重算"}</div>
              <Mono size={FT.h3} color={C.amber}>{"O(T/K + K)"}</Mono>
            </div>
            <div style={{ marginTop: 16 }}><CheckpointRow /></div>
            <div style={{ marginTop: 10, display: "flex", justifyContent: "space-between" }}>
              <Mono size={FT.micro} color={C.inkFaint}>{"每 20 步一个"}</Mono>
              <Mono size={FT.micro} color={C.amber}>{"11 个检查点，反向时逐段重建"}</Mono>
              <Mono size={FT.micro} color={C.inkFaint}>{"t = 2.0"}</Mono>
            </div>
            <div style={{ marginTop: 14 }}>
              <Mono size={FT.micro} color={C.inkFaint}>{"峰值内存（20 万步）"}</Mono>
              <div><Num value={k.memAdjoint200k} size={26} color={C.amber} /> <Mono size={FT.meta} color={C.inkFaint}>{"bytes"}</Mono></div>
            </div>
          </Card>
        </Build>
      </div>

      <div style={{ position: "absolute", left: 1040, top: 276, width: 760 }}>
        <Build at={b(4)}>
          <Card label="同一组实验 · 20 万步 → 200 万步" accent={C.cyan} pad={20} style={{ width: 740 }}>
            <div style={{ display: "flex", gap: 34, alignItems: "flex-end" }}>
              <div>
                <Mono size={FT.micro} color={C.inkFaint}>{"直接法内存倍数"}</Mono>
                <div><Num value={k.memDirectRatio} size={34} color={C.violet} /></div>
              </div>
              <div>
                <Mono size={FT.micro} color={C.inkFaint}>{"伴随法内存倍数"}</Mono>
                <div><Num value={k.memAdjointRatio} size={34} color={C.amber} /></div>
              </div>
            </div>
            <div style={{ marginTop: 14, height: 1, background: C.panelLine }} />
            <div style={{ marginTop: 14 }}>
              <Body size={FT.meta} color={C.inkDim}>{"直接法跟着步数线性涨；伴随法没有。代价是反向时每段要再跑一次前向。"}</Body>
            </div>
          </Card>
        </Build>

        <Build at={b(7)} style={{ marginTop: 16 }}>
          <Card label="这一集要回答" accent={C.cyan} pad={20} style={{ width: 740 }}>
            {[
              ["01", "梯度还能不能对上闭式解", "数值误差有多大"],
              ["02", "内存省了多少", "倍数是否真的接近常数"],
              ["03", "什么时候会失效", "负号、刚性、可逆性"],
            ].map(([n, q, d]) => (
              <div key={n} style={{ display: "flex", gap: 14, marginBottom: 16 }}>
                <Mono size={FT.meta} color={C.cyan}>{n}</Mono>
                <div>
                  <div style={{ fontFamily: FONT.sans, fontSize: FT.h3, color: C.ink }}>{q}</div>
                  <div style={{ marginTop: 3 }}><Mono size={FT.micro} color={C.inkFaint}>{d}</Mono></div>
                </div>
              </div>
            ))}
          </Card>
        </Build>

        <Build at={b(11)} style={{ marginTop: 10, textAlign: "right" }}>
          <Mono size={FT.micro} color={C.inkFaint}>{"T = 200 · 20 万步与 200 万步各跑一次独立进程"}</Mono>
        </Build>
      </div>
    </Scene>
  );
};
