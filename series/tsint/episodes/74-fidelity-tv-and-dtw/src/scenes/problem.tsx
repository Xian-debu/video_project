import React from "react";
import { C, FONT, FT } from "../../design/tokens";
import { Build } from "../../design/primitives";
import { Head, Scene, PAD, Card, Body, Mono, Num, K, Plot, beatAt, V } from "../shared";

const W = 792, H = 300;
const px = (v: number) => 44 + (v / 20) * (W - 70);
const py = (v: number) => H - 30 - (v / 11) * (H - 62);

const Seq: React.FC<{ xs: number[]; color: string }> = ({ xs, color }) => (
  <span style={{ display: "inline-flex", gap: 6 }}>
    {xs.map((v, i) => (
      <span key={i} style={{
        minWidth: 34, textAlign: "center", padding: "3px 7px", border: "1px solid " + C.panelLine,
        borderRadius: 7, fontFamily: FONT.mono, fontSize: FT.meta, color,
      }}>{String(v)}</span>
    ))}
  </span>
);

/** 问题：逐点 MSE 把相位差当成幅度差；DTW 允许拉伸，代价为零但路径变长。 */
export const SProblem: React.FC = () => {
  const b = (i: number) => beatAt("problem", i, 22);
  const s = V.key.shift;

  return (
    <Scene id="problem">
      <Head kicker="01 / 逐点误差的盲区" title="相位错了，逐点全错" goal="MSE 看得见幅度，看不见对齐" />

      <div style={{ position: "absolute", left: PAD, top: 288, width: 860 }}>
        <Build at={b(0)}>
          <Card label="二十一点序列 · 紫色原序列 · 黄色晚三步" accent={C.violet} pad={20} style={{ width: 860 }}>
            <Plot
              w={W} h={H} at={b(4)} dur={36}
              x={px} y={py}
              grid={{ x: [0, 5, 10, 15, 20], y: [0, 5, 10], fmtX: (v) => "t=" + v, fmtY: (v) => String(v) }}
              series={[
                { pts: V.shift.map((d) => ({ x: d.t, y: d.x })), color: C.violet, width: 3, dot: true, fill: true },
                { pts: V.shift.map((d) => ({ x: d.t, y: d.y })), color: C.amber, width: 3, dot: true },
              ]}
            />
            <div style={{ display: "flex", gap: 26, marginTop: 8 }}>
              <span style={{ fontFamily: FONT.mono, fontSize: FT.micro, color: C.violet }}>{"— 原序列 x"}</span>
              <span style={{ fontFamily: FONT.mono, fontSize: FT.micro, color: C.amber }}>{"— 晚三步 y"}</span>
            </div>
          </Card>
        </Build>

        <Build at={b(8)} style={{ marginTop: 20 }}>
          <div style={{ display: "flex", gap: 20 }}>
            <Card label="逐点 MSE" accent={C.amber} pad={18} style={{ width: 420 }}>
              <Num value={s.mse} size={FT.h2} color={C.amber} />
              <Body size={FT.micro} color={C.inkFaint} style={{ marginTop: 4 }}>{"每个采样点都落在不同相位上"}</Body>
            </Card>
            <Card label="DTW 代价" accent={C.cyan} pad={18} style={{ width: 420 }}>
              <Num value={s.cost} size={FT.h2} color={C.cyan} />
              <Body size={FT.micro} color={C.inkFaint} style={{ marginTop: 4 }}>{"允许拉伸后，形状完全重合"}</Body>
            </Card>
          </div>
        </Build>
      </div>

      <div style={{ position: "absolute", left: 938, top: 288, width: 802 }}>
        <Build at={b(1)}>
          <Card label="黄金例 · 第一个序列比第二个长" accent={C.cyan} pad={22} style={{ width: 802 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
              <K>{"x"}</K><Seq xs={[1, 2, 3]} color={C.violet} />
              <span style={{ fontFamily: FONT.mono, fontSize: FT.body, color: C.inkFaint }}>{"vs"}</span>
              <K>{"y"}</K><Seq xs={[2, 3]} color={C.cyan} />
            </div>
            <div style={{ display: "flex", gap: 40, marginTop: 16, alignItems: "flex-end" }}>
              <div><K>{"代价"}</K><div><Num value={V.key.golden.cost} size={FT.h2} color={C.cyan} /></div></div>
              <div>
                <K>{"一条最优路径"}</K>
                <div style={{ fontFamily: FONT.mono, fontSize: FT.meta, color: C.inkDim, marginTop: 5 }}>
                  {"(0,0) → (1,0) → (2,1)"}
                </div>
              </div>
            </div>
            <Body size={FT.micro} color={C.inkFaint} style={{ marginTop: 10 }}>
              {"路径不唯一；这里只展示一条。代价是一，不是零。"}
            </Body>
          </Card>
        </Build>

        <Build at={b(17)} style={{ marginTop: 22 }}>
          <Card label="DTW 为零，不等于两条序列相同" accent={C.amber} pad={22} style={{ width: 802 }}>
            <div style={{ display: "flex", gap: 44, alignItems: "baseline" }}>
              <div><K>{"代价"}</K><div><Num value={s.cost} size={FT.h2} color={C.cyan} /></div></div>
              <div><K>{"最优路径长度"}</K><div><Num value={s.pathLength} size={FT.h2} color={C.amber} /></div></div>
            </div>
            <Body size={FT.meta} color={C.inkDim} style={{ marginTop: 12 }}>
              {"路径从二十一步拉长到三十三步：它把很多点重复对齐了。零只说允许拉伸后形状可以重合，不说两条曲线一样。"}
            </Body>
          </Card>
        </Build>
      </div>

      <div style={{ position: "absolute", left: PAD, top: 900, width: 1680 }}>
        <Build at={b(20)}>
          <K>{"两个指标回答的不是同一个问题；下面把定义写清楚。"}</K>
        </Build>
      </div>
    </Scene>
  );
};
