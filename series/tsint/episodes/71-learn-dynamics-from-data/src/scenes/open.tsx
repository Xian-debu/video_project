import React from "react";
import { C, FONT, FT } from "../../design/tokens";
import { Build } from "../../design/primitives";
import { Math as MathTex } from "../../design/Math";
import { Head, Scene, PAD, NEURAL, Num, Mono, Body, Card, Plot, beatAt, clamp } from "../shared";
import { useCurrentFrame } from "remotion";

/** 开场：一条 200 天的股票曲线，被一个常数增长率拟合得很紧。 */
export const SOpen: React.FC = () => {
  const f = useCurrentFrame();
  const b = (i: number) => beatAt("open", i, 12);
  const key = NEURAL.key;
  const stock = NEURAL.stock;
  const fit = NEURAL.paramStock;
  const w = 840, h = 430, pl = 56, pr = 26, pt = 18, pb = 52;
  const X = (t: number) => pl + t * (w - pl - pr);
  const Y = (v: number) => h - pb - ((v - 0.9) / (3.7 - 0.9)) * (h - pt - pb);
  const fitPts = fit.map((p) => ({ x: p.t, y: p.fit }));
  const stockPts = stock.map((p, i) => ({ x: i / (stock.length - 1), y: p.v }));

  return (
    <Scene id="open">
      <Head kicker="第 9 章 / 神经微分方程" title="一条曲线，一个常数" goal="先看拟合，再看它为什么不够" />

      <div style={{ position: "absolute", left: PAD, top: 300, width: 780 }}>
        <Build at={b(3)}>
          <Card label="一个常数增长率 · 拟合两百天" accent={C.amber} pad={22} style={{ width: 740 }}>
            <div style={{ display: "flex", alignItems: "baseline", gap: 16 }}>
              <MathTex tex={"x(t) = x_0 e^{kt}"} block size={34} />
              <Mono size={FT.meta} color={C.inkFaint}>{"k 是常数"}</Mono>
            </div>
            <div style={{ marginTop: 16, display: "flex", gap: 40, alignItems: "flex-end" }}>
              <div>
                <Mono size={FT.meta} color={C.inkFaint}>{"k̂"}</Mono>
                <div><Num value={key.kStock} size={38} color={C.amber} /></div>
              </div>
              <div>
                <Mono size={FT.meta} color={C.inkFaint}>{"R²"}</Mono>
                <div><Num value={key.r2Stock} size={38} color={C.cyan} /></div>
              </div>
            </div>
            <div style={{ marginTop: 12 }}>
              <Mono size={FT.micro} color={C.inkFaint}>{"200 个交易日 · 2 个参数 · 归一化时间上的增长率"}</Mono>
            </div>
          </Card>
        </Build>

        <Build at={b(8)} style={{ marginTop: 20 }}>
          <Body size={FT.body} color={C.inkDim} style={{ width: 740 }}>
            {"拟合得紧，不等于解释得对：它只说明这 200 天里，一条指数曲线贴住了价格。"}
          </Body>
        </Build>

        <Build at={b(10)} style={{ marginTop: 18 }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 14 }}>
            <Mono size={FT.meta} color={C.inkFaint}>{"如果 k 不是常数："}</Mono>
            <Mono size={FT.meta} color={C.cyan}>{"f_θ(x,t)"}</Mono>
          </div>
        </Build>
      </div>

      <div style={{ position: "absolute", left: 900, top: 278, width: 900 }}>
        <Build at={b(1)}>
          <Card label="sz000001 · 2006-11-22 – 2007-10-29 · qfq 归一化" accent={C.violet} pad={18}>
            <Plot
              w={w} h={h} at={b(1)} dur={70}
              x={X} y={Y}
              series={[
                { pts: stockPts, color: C.violet, width: 2.4 },
                { pts: fitPts, color: C.cyan, width: 2.6, dash: true },
              ]}
              grid={{
                x: [0, 0.25, 0.5, 0.75, 1],
                y: [1, 2, 3],
                fmtX: (v) => (v === 0 ? "0" : v === 1 ? "200 日" : String(Math.round(v * 200))),
                fmtY: (v) => v.toFixed(0),
              }}
            />
            <div style={{ display: "flex", gap: 26, marginTop: 8 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ width: 22, height: 2, background: C.violet }} />
                <Mono size={FT.micro} color={C.inkFaint}>{"收盘价"}</Mono>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ width: 22, height: 2, background: C.cyan, opacity: 0.9 }} />
                <Mono size={FT.micro} color={C.inkFaint}>{"一个常数 k 的指数拟合"}</Mono>
              </div>
            </div>
          </Card>
        </Build>
        <Build at={b(5)} style={{ marginTop: 12, textAlign: "right" }}>
          <Mono size={FT.micro} color={C.inkFaint}>{"ts-base · ch09 · 29418ad"}</Mono>
        </Build>
      </div>
    </Scene>
  );
};