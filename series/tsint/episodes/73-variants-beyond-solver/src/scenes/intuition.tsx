import React from "react";
import { C, FT } from "../../design/tokens";
import { Build } from "../../design/primitives";
import { Head, Scene, PAD, Card, Body, Mono, K, Plot, V, beatAt } from "../shared";

/** 直觉：CfC 的两条曲线不是逐点对照；GM-ODE 的累加层与原尺度各看一次。 */
export const SIntuition: React.FC = () => {
  const b = (i: number) => beatAt("intuition", i, 27);
  const { cfc, fit } = V;

  const w = 840, h = 330, pl = 58, pr = 24, pt = 16, pb = 42;
  const X = (t: number) => pl + (t / 4) * (w - pl - pr);
  const Y = (v: number) => h - pb - (v / 1.1) * (h - pt - pb);

  const w2 = 748, h2 = 178, pl2 = 54, pr2 = 18, pt2 = 10, pb2 = 34;
  const X2 = (k: number) => pl2 + (k / 23) * (w2 - pl2 - pr2);
  const Y2 = (v: number) => h2 - pb2 - (v / 220) * (h2 - pt2 - pb2);
  const Y3 = (v: number) => h2 - pb2 - ((v - 5) / 7.6) * (h2 - pt2 - pb2);

  return (
    <Scene id="intuition">
      <Head kicker="03 / 一次前向与八百次求值" title="形状对了就够了" goal="指数近似、累加阶梯，以及可比的只有计算量" />

      <div style={{ position: "absolute", left: PAD, top: 296, width: 880 }}>
        <Build at={b(0)}>
          <Card label="CfC · 闭式解 vs 门控混合" accent={C.cyan} pad={18} style={{ width: 880 }}>
            <Plot
              w={w} h={h} at={b(0)} dur={70}
              x={X} y={Y}
              series={[
                { pts: cfc.map((p) => ({ x: p.t, y: p.exact })), color: C.cyan, width: 3 },
                { pts: cfc.map((p) => ({ x: p.t, y: p.gate })), color: C.amber, width: 2.6, dash: true },
              ]}
              grid={{ x: [0, 1, 2, 3, 4], y: [0, 0.5, 1], fmtX: (v) => String(v), fmtY: (v) => v.toFixed(1) }}
            />
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
              <div style={{ display: "flex", gap: 22 }}>
                <span><span style={{ color: C.cyan }}>{"━"}</span>{" x(t)=A+(x0−A)e^(−ft)"}</span>
                <span><span style={{ color: C.amber }}>{"┅"}</span>{" σ(−ft)g+(1−σ)h"}</span>
              </div>
              <K>{"t"}</K>
            </div>
            <Body size={FT.meta} color={C.inkDim} style={{ marginTop: 8 }}>
              {"参数：x0=1，A=0，f=2；门控取 g=0.2，h=0.8。紫线衰减到 0，黄线从 0.5 升到 0.8。"}
            </Body>
          </Card>
        </Build>

        <Build at={b(12)} style={{ marginTop: 20 }}>
          <div style={{ display: "flex", gap: 18, alignItems: "center" }}>
            <K>{"两条线回答不同问题"}</K>
            <Mono size={FT.meta} color={C.inkFaint}>{"一条是给定初值的解，一条是门在候选间的移动"}</Mono>
          </div>
        </Build>
      </div>

      <div style={{ position: "absolute", left: 996, top: 296, width: 780 }}>
        <Build at={b(15)}>
          <Card label="GM-ODE · AGO 累加层" accent={C.amber} pad={16} style={{ width: 780 }}>
            <Plot
              w={w2} h={h2} at={b(15)} dur={50}
              x={X2} y={Y2}
              series={[{ pts: fit.map((p) => ({ x: p.k, y: p.ago })), color: C.violet, width: 2.6, fill: true }]}
              grid={{ x: [0, 6, 12, 18, 23], y: [0, 100, 200], fmtX: (v) => String(v), fmtY: (v) => String(v) }}
            />
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 2 }}>
              <K>{"原始 12 → 5.96"}</K>
              <K>{"累加 12 → 207.4"}</K>
            </div>
          </Card>
        </Build>

        <Build at={b(18)} style={{ marginTop: 16 }}>
          <Card label="回到原尺度 · 观测 vs 还原" accent={C.cyan} pad={16} style={{ width: 780 }}>
            <Plot
              w={w2} h={h2} at={b(18)} dur={50}
              x={X2} y={Y3}
              series={[
                { pts: fit.map((p) => ({ x: p.k, y: p.actual })), color: C.cyan, width: 2.8, dot: true },
                { pts: fit.map((p) => ({ x: p.k, y: p.forecast })), color: C.amber, width: 2.2, dash: true },
              ]}
              grid={{ x: [0, 6, 12, 18, 23], y: [6, 8, 10, 12], fmtX: (v) => String(v), fmtY: (v) => v.toFixed(0) }}
            />
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 2 }}>
              <span style={{ color: C.cyan, fontFamily: "monospace", fontSize: FT.micro }}>{"● 观测"}</span>
              <span style={{ color: C.amber, fontFamily: "monospace", fontSize: FT.micro }}>{"┅ 还原"}</span>
            </div>
          </Card>
        </Build>

        <Build at={b(21)} style={{ marginTop: 14, textAlign: "right" }}>
          <Mono size={FT.micro} color={C.inkFaint}>{"能比的只有 1 次 vs 800 次；不是书里的 100–100000×"}</Mono>
        </Build>
      </div>
    </Scene>
  );
};
