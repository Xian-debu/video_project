import React from "react";
import { useCurrentFrame } from "remotion";
import { C, FONT, FT } from "../../design/tokens";
import { Build } from "../../design/primitives";
import { Math as MathTex } from "../../design/Math";
import { Head, Scene, PAD, Card, Mono, Body, Num, Plot, BP, beatAt, pct } from "../shared";

/** 开场：一条 200 步的显式欧拉链，终点和梯度先上屏。 */
export const SOpen: React.FC = () => {
  const f = useCurrentFrame();
  const b = (i: number) => beatAt("open", i, 13);
  const k = BP.key;
  const fw = BP.forward;
  const w = 860, h = 350, pl = 64, pr = 30, pt = 20, pb = 54;
  const X = (n: number) => pl + (n / 200) * (w - pl - pr);
  const Y = (v: number) => h - pb - ((v - 0.95) / (2.85 - 0.95)) * (h - pt - pb);
  const tapeP = pct(f, b(8), b(8) + 70);

  return (
    <Scene id="open">
      <Head kicker="第 9 章 / 神经微分方程" title="一条链，两次反向" goal="同一个梯度，两条完全不同的路" />

      <div style={{ position: "absolute", left: PAD, top: 290, width: 780 }}>
        <Build at={b(2)}>
          <Card label="显式欧拉 · 一个参数" accent={C.amber} pad={24} style={{ width: 740 }}>
            <MathTex tex={"x_{n+1} = x_n + h\\,\\theta\\,x_n"} block size={36} />
            <div style={{ marginTop: 18, display: "flex", gap: 42, alignItems: "flex-end" }}>
              <div><Mono size={FT.micro} color={C.inkFaint}>{"θ"}</Mono><div><Num value={BP.meta.theta} size={34} color={C.amber} /></div></div>
              <div><Mono size={FT.micro} color={C.inkFaint}>{"h"}</Mono><div><Num value={BP.meta.h} size={34} color={C.ink} /></div></div>
              <div><Mono size={FT.micro} color={C.inkFaint}>{"T"}</Mono><div><Num value={200} size={34} color={C.ink} /></div></div>
              <div><Mono size={FT.micro} color={C.inkFaint}>{"x₀"}</Mono><div><Num value={1} size={34} color={C.ink} /></div></div>
            </div>
            <div style={{ marginTop: 20, display: "flex", gap: 38 }}>
              <div><Mono size={FT.micro} color={C.inkFaint}>{"终点 x_T"}</Mono><div><Num value={k.xT} size={30} color={C.violet} /></div></div>
              <div><Mono size={FT.micro} color={C.inkFaint}>{"dL/dθ = 2·x_T·(1+hθ)^(T−1)"}</Mono><div><Num value={k.gradDirect} size={30} color={C.cyan} /></div></div>
            </div>
          </Card>
        </Build>

        <Build at={b(4)} style={{ marginTop: 18 }}>
          <Body size={FT.body} color={C.inkDim} style={{ width: 740 }}>
            {"损失 L = x_T²。前向走一遍，反传要从终点把误差送回起点。"}
          </Body>
        </Build>

        <Build at={b(10)} style={{ marginTop: 16 }}>
          <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
            <Mono size={FT.meta} color={C.inkFaint}>{"路径积分"}</Mono>
            <MathTex tex={"\\frac{dL}{d\\theta}=\\sum_{n=0}^{T-1} a_{n+1}\\,h\\,x_n"} size={26} />
          </div>
        </Build>
      </div>

      <div style={{ position: "absolute", left: 900, top: 290, width: 900 }}>
        <Build at={b(0)}>
          <Card label="前向轨迹 · 201 个状态 · 终点 2.7115171229292927" accent={C.violet} pad={18}>
            <Plot
              w={w} h={h} at={b(0)} dur={80}
              x={X} y={Y}
              series={[{ pts: fw.map((p) => ({ x: p.n, y: p.x })), color: C.violet, width: 2.8, fill: true }]}
              grid={{ x: [0, 50, 100, 150, 200], y: [1, 1.5, 2, 2.5], fmtX: (v) => String(v), fmtY: (v) => v.toFixed(1) }}
            />
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
              <Mono size={FT.micro} color={C.inkFaint}>{"步数 n"}</Mono>
              <Mono size={FT.micro} color={C.violet}>{"x 从 1 长到 2.71"}</Mono>
            </div>
          </Card>
        </Build>

        <Build at={b(7)} style={{ marginTop: 16 }}>
          <Card label="磁带 · 每一步都要留一个状态" accent={C.amber} pad={16}>
            <div style={{ display: "flex", gap: 2 }}>
              {Array.from({ length: 100 }).map((_, i) => {
                const on = i / 100 <= tapeP;
                return <div key={i} style={{ flex: 1, height: 26, borderRadius: 1, background: on ? (i < 52 ? C.violet : C.amber) : C.panelLine, opacity: on ? 0.9 : 0.35 }} />;
              })}
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8 }}>
              <Mono size={FT.micro} color={C.inkFaint}>{"n = 0"}</Mono>
              <Mono size={FT.micro} color={C.amber}>{"201 个 float64 · 反向时逐帧取用"}</Mono>
              <Mono size={FT.micro} color={C.inkFaint}>{"n = 200"}</Mono>
            </div>
          </Card>
        </Build>
        <Build at={b(11)} style={{ marginTop: 12, textAlign: "right" }}>
          <Mono size={FT.micro} color={C.inkFaint}>{"ts-base · ch09 · 908f333"}</Mono>
        </Build>
      </div>
    </Scene>
  );
};
