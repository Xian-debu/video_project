import React from "react";
import { C, FONT, FT } from "../../design/tokens";
import { Build } from "../../design/primitives";
import { Head, Scene, PAD, Card, Body, Mono, Num, K, Plot, Chip, beatAt, V } from "../shared";

const W = 792, H = 318;
const px = (i: number) => 54 + (i / 7) * (W - 84);
const py = (v: number) => H - 44 - (v / 0.44) * (H - 74);

/** 直觉：λ 在平滑与峰值之间做交易；DTW 在对齐与路径长度之间做交易。 */
export const SIntuition: React.FC = () => {
  const b = (i: number) => beatAt("intuition", i, 30);
  const t = V.key.triangle;

  return (
    <Scene id="intuition">
      <Head kicker="03 / 一个 λ，一条路径" title="λ 在买什么" goal="平滑与峰值，对齐与路径长度" />

      <div style={{ position: "absolute", left: PAD, top: 288, width: 860 }}>
        <Build at={b(0)}>
          <Card label="干净信号上的 MSE · 八档 λ" accent={C.amber} pad={20} style={{ width: 860 }}>
            <Plot
              w={W} h={H} at={b(3)} dur={42}
              x={px} y={py}
              grid={{
                x: [0, 1, 2, 3, 4, 5, 6, 7],
                y: [0, 0.1, 0.2, 0.3, 0.4],
                fmtX: (v) => String(V.tvCurve[v].lambda),
                fmtY: (v) => v.toFixed(1),
              }}
              series={[
                { pts: V.tvCurve.map((d, i) => ({ x: i, y: d.cleanMse })), color: C.amber, width: 3, dot: true, fill: true },
              ]}
            />
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
              <K>{"x 轴：λ（训练权重） · y 轴：干净信号上的 MSE"}</K>
              <K>{"训练看观测，评估看干净信号"}</K>
            </div>
          </Card>
        </Build>

        <Build at={b(10)} style={{ marginTop: 20 }}>
          <Card label="三档 λ 的账" accent={C.cyan} pad={18} style={{ width: 860 }}>
            <div style={{ display: "flex", gap: 18 }}>
              {[
                ["λ = 0", V.key.lambdaZero.tv, V.key.lambdaZero.cleanMse, C.inkDim],
                ["λ = 0.005 · 甜区", V.key.best.tv, V.key.best.cleanMse, C.cyan],
                ["λ = 0.05 · 过平滑", V.key.over.tv, V.key.over.cleanMse, C.coral],
              ].map(([label, tv, mse, color]) => (
                <div key={String(label)} style={{ flex: 1, borderLeft: "2px solid " + color, paddingLeft: 12 }}>
                  <Mono size={FT.micro} color={color as string}>{String(label)}</Mono>
                  <div style={{ marginTop: 4 }}>
                    <K>{"TV"}</K>
                    <Mono size={FT.meta} color={C.inkDim} style={{ marginLeft: 8 }}>{String(tv)}</Mono>
                  </div>
                  <div>
                    <K>{"clean MSE"}</K>
                    <Mono size={FT.meta} color={C.inkDim} style={{ marginLeft: 8 }}>{String(mse)}</Mono>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </Build>
      </div>

      <div style={{ position: "absolute", left: 972, top: 288, width: 768 }}>
        <Build at={b(2)}>
          <Card label="λ 买的是平滑，卖的是峰值" accent={C.amber} pad={22} style={{ width: 768 }}>
            <div style={{ fontFamily: FONT.serif, fontSize: FT.h2, color: C.amber }}>{"抖动少了，误差也小了；再大就反过来。"}</div>
            <Body size={FT.meta} color={C.inkDim} style={{ marginTop: 12 }}>
              {"λ=0 拟合每个噪声点，TV 九十四点九八；λ=0.005 把 TV 压到十三点九九，干净 MSE 反而从零点一六降到零点零零七。"}
            </Body>
            <Body size={FT.meta} color={C.coral} style={{ marginTop: 8 }}>
              {"λ=0.05 只剩四点五四的 TV，但峰值被抹平，干净 MSE 升到零点一八七。"}
            </Body>
          </Card>
        </Build>

        <Build at={b(22)} style={{ marginTop: 20 }}>
          <Card label="DTW 不是度量 · 三角不等式反例" accent={C.violet} pad={22} style={{ width: 768 }}>
            <div style={{ display: "flex", gap: 26, alignItems: "flex-end" }}>
              <div><K>{"DTW(x,z)"}</K><div><Num value={t.xz} size={FT.h2} color={C.violet} /></div></div>
              <div style={{ paddingBottom: 8, fontFamily: FONT.mono, fontSize: FT.body, color: C.inkFaint }}>{">"}</div>
              <div><K>{"DTW(x,y) + DTW(y,z)"}</K><div><Num value={t.sum} size={FT.h2} color={C.inkDim} /></div></div>
              <div style={{ marginLeft: "auto", paddingBottom: 4 }}><Chip color={C.coral}>{"违反量 " + t.violation}</Chip></div>
            </div>
            <Body size={FT.micro} color={C.inkFaint} style={{ marginTop: 10 }}>
              {"所以 DTW 不能当距离用；比较不同长度序列前还要归一化。"}
            </Body>
          </Card>
        </Build>
      </div>

      <div style={{ position: "absolute", left: PAD, top: 900, width: 1680 }}>
        <Build at={b(26)}>
          <K>{"两条曲线回答两个不同的问题：一条是给定初值的解，一条是允许拉伸的对齐。"}</K>
        </Build>
      </div>
    </Scene>
  );
};
