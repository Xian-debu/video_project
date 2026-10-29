import React from "react";
import { C, FONT, FT } from "../../design/tokens";
import { Build } from "../../design/primitives";
import { Head, Scene, PAD, Card, Mono, Body, Plate, beatAt } from "../shared";
import { PLATES } from "../script";

const Segments: React.FC<{ n: number; k: number; color: string }> = ({ n, k, color }) => (
  <div style={{ display: "flex", gap: 3 }}>
    {Array.from({ length: n }).map((_, i) => (
      <div key={i} style={{ flex: 1, height: 26, background: i % k === 0 ? color : C.panelLine, opacity: i % k === 0 ? 0.95 : 0.45, borderRadius: 2 }} />
    ))}
  </div>
);

/** 直觉：磁带 vs 检查点，以及连续伴随的反向积分。 */
export const SIntuition: React.FC = () => {
  const b = (i: number) => beatAt("intuition", i, 24);

  return (
    <Scene id="intuition">
      <Head kicker="03 / 磁带与检查点" title="两种走法" goal="磁带、检查点、重算，以及连续伴随的近似" />

      <div style={{ position: "absolute", left: PAD, top: 258, width: 1780 }}>
        <div style={{ display: "flex", gap: 24 }}>
          <Build at={b(0)} style={{ width: 860 }}>
            <Card label="直接法 · 磁带" accent={C.violet} pad={18} style={{ width: 860 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <div style={{ fontFamily: FONT.serif, fontSize: FT.h2 }}>{"每一步都录下来"}</div>
                <Mono size={FT.meta} color={C.violet}>{"201 slots"}</Mono>
              </div>
              <div style={{ marginTop: 14 }}><Segments n={100} k={1} color={C.violet} /></div>
              <div style={{ marginTop: 9, display: "flex", justifyContent: "space-between" }}>
                <Mono size={FT.micro} color={C.inkFaint}>{"x₀"}</Mono>
                <Mono size={FT.micro} color={C.violet}>{"反向播放，按帧取状态"}</Mono>
                <Mono size={FT.micro} color={C.inkFaint}>{"x_T"}</Mono>
              </div>
              <div style={{ marginTop: 12 }}><Mono size={FT.micro} color={C.inkDim}>{"空间 O(T)，时间 O(T)。"}</Mono></div>
            </Card>
          </Build>

          <Build at={b(4)} style={{ width: 860 }}>
            <Card label="伴随法 · checkpoint" accent={C.amber} pad={18} style={{ width: 860 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <div style={{ fontFamily: FONT.serif, fontSize: FT.h2 }}>{"每二十步留一个书签"}</div>
                <Mono size={FT.meta} color={C.amber}>{"11 checkpoints"}</Mono>
              </div>
              <div style={{ marginTop: 14 }}><Segments n={100} k={10} color={C.amber} /></div>
              <div style={{ marginTop: 9, display: "flex", justifyContent: "space-between" }}>
                <Mono size={FT.micro} color={C.inkFaint}>{"每段 20 步"}</Mono>
                <Mono size={FT.micro} color={C.amber}>{"反向时从书签重算这一小段"}</Mono>
                <Mono size={FT.micro} color={C.inkFaint}>{"T = 200"}</Mono>
              </div>
              <div style={{ marginTop: 12 }}><Mono size={FT.micro} color={C.inkDim}>{"空间 O(T/K + K)，时间约 2×前向。"}</Mono></div>
            </Card>
          </Build>
        </div>
      </div>

      <div style={{ position: "absolute", left: PAD, top: 552, width: 680 }}>
        <Build at={b(7)}>
          <Plate id={PLATES.adjoint} width={620} caption="原文 图 9.6：状态与伴随状态的反向传播" at={b(7)} />
        </Build>
      </div>

      <div style={{ position: "absolute", left: 740, top: 552, width: 620 }}>
        <Build at={b(11)}>
          <Plate id={PLATES.complexity} width={560} caption="原文 表 9.1：直接法与伴随法的时空复杂度" at={b(11)} />
        </Build>
      </div>

      <div style={{ position: "absolute", left: 1380, top: 552, width: 420 }}>
        <Build at={b(13)}>
          <Card label="这笔账" accent={C.cyan} pad={18} style={{ width: 420 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div><Mono size={FT.micro} color={C.inkFaint}>{"直接法"}</Mono><div><Mono size={FT.h3} color={C.violet}>{"存 201 份状态"}</Mono></div></div>
              <div><Mono size={FT.micro} color={C.inkFaint}>{"伴随法"}</Mono><div><Mono size={FT.h3} color={C.amber}>{"存 11 份 + 重算"}</Mono></div></div>
              <div><Mono size={FT.micro} color={C.inkFaint}>{"连续版本"}</Mono><div><Mono size={FT.h3} color={C.cyan}>{"反向积分 ODE"}</Mono></div></div>
            </div>
            <div style={{ marginTop: 14 }}><Body size={FT.micro} color={C.inkDim}>{"常数空间不是免费：重算、积分误差、刚性都要还。"}</Body></div>
          </Card>
        </Build>
      </div>
    </Scene>
  );
};
