import React from "react";
import { C, FONT, FT, FT_T } from "../../design/tokens";
import { Build } from "../../design/primitives";
import { Card, Mono, Body, Plate, Head, Scene, PAD, beatAt, DEMO } from "../shared";

const BOX = 150;
const GAP = 26;

/** 移位寄存器 + 两个模二加法器：一眼看清「一个比特，两个输出」。 */
const ShiftReg: React.FC = () => {
  const x0 = 20;
  const y = 24;
  const h = 74;
  const cx = (i: number) => x0 + i * (BOX + GAP) + BOX / 2;
  const busY0 = 176;
  const busY1 = 250;
  const xorX = 928;
  const cells = ["u(k)", "u(k-1)", "u(k-2)", "u(k-3)", "u(k-4)"];
  return (
    <svg width={1120} height={292} style={{ display: "block" }}>
      <text x={x0} y={12} fill={C.inkFaint} fontFamily={FONT.mono} fontSize={FT.micro} letterSpacing={FT_T.micro}>
        {"输入 → 四位记忆（每来一位，整体右移）"}
      </text>
      {cells.map((c, i) => (
        <g key={c}>
          <rect x={x0 + i * (BOX + GAP)} y={y} width={BOX} height={h} rx={8} fill={C.panel} stroke={i === 0 ? C.cyan : C.panelLine} strokeWidth={i === 0 ? 2 : 1} />
          <text x={cx(i)} y={y + h / 2 + 8} textAnchor="middle" fill={C.ink} fontFamily={FONT.mono} fontSize={FT.mono}>{c}</text>
        </g>
      ))}
      {cells.map((_, i) => (
        <g key={"tap" + i}>
          {[0, 3, 4].includes(i) ? <line x1={cx(i)} y1={y + h} x2={cx(i)} y2={busY0} stroke={C.cyan} strokeWidth={2} opacity={0.85} /> : null}
          {[0, 1, 3, 4].includes(i) ? <line x1={cx(i)} y1={y + h} x2={cx(i)} y2={busY1} stroke={C.violet} strokeWidth={2} opacity={0.85} /> : null}
          <circle cx={cx(i)} cy={y + h} r={4} fill={[0, 3, 4].includes(i) ? C.cyan : C.panelLine} />
        </g>
      ))}
      <line x1={cx(0)} y1={busY0} x2={xorX - 20} y2={busY0} stroke={C.cyan} strokeWidth={2} opacity={0.5} />
      <line x1={cx(0)} y1={busY1} x2={xorX - 20} y2={busY1} stroke={C.violet} strokeWidth={2} opacity={0.5} />
      <circle cx={xorX} cy={busY0} r={19} fill={C.panel} stroke={C.cyan} strokeWidth={2} />
      <text x={xorX} y={busY0 + 7} textAnchor="middle" fill={C.cyan} fontFamily={FONT.mono} fontSize={FT.mono}>{"⊕"}</text>
      <circle cx={xorX} cy={busY1} r={19} fill={C.panel} stroke={C.violet} strokeWidth={2} />
      <text x={xorX} y={busY1 + 7} textAnchor="middle" fill={C.violet} fontFamily={FONT.mono} fontSize={FT.mono}>{"⊕"}</text>
      <line x1={xorX + 19} y1={busY0} x2={1010} y2={busY0} stroke={C.cyan} strokeWidth={2} />
      <line x1={xorX + 19} y1={busY1} x2={1010} y2={busY1} stroke={C.violet} strokeWidth={2} />
      <text x={1020} y={busY0 + 8} fill={C.cyan} fontFamily={FONT.mono} fontSize={FT.mono}>{"c(2k)"}</text>
      <text x={1020} y={busY1 + 8} fill={C.violet} fontFamily={FONT.mono} fontSize={FT.mono}>{"c(2k+1)"}</text>
      <text x={24} y={busY0 - 12} fill={C.cyan} fontFamily={FONT.mono} fontSize={FT.meta} opacity={0.9}>{"G0 取 u(k)、u(k-3)、u(k-4)"}</text>
      <text x={24} y={busY1 - 12} fill={C.violet} fontFamily={FONT.mono} fontSize={FT.meta} opacity={0.9}>{"G1 再多取一个 u(k-1)"}</text>
      <text x={24} y={288} fill={C.inkFaint} fontFamily={FONT.sans} fontSize={FT.meta}>
        {"四个记忆位 → 16 个状态；每来一位，两条支路各算一个校验，合起来是两个比特。"}
      </text>
    </svg>
  );
};

/** 编码：一个比特变两个。上面是硬件图，右上是多项式，右下是真实输出前八步的对账表，左下是原文。 */
export const SEncoder: React.FC = () => {
  const beats = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => beatAt("encoder", i, 10));
  const ex = DEMO.example;
  const rows = ex.input.slice(0, 8).map((u, k) => ({
    k, u, c0: ex.output0[k], c1: ex.output1[k], ns: ex.states[k + 1],
  }));
  return (
    <Scene id="encoder">
      <Head kicker="03 / 一个比特变两个" title="四位记忆，两次异或" goal="速率一比二的卷积码到底在算什么" />

      <Build at={beats[0]} style={{ position: "absolute", left: PAD, top: 254, width: 1120 }}>
        <ShiftReg />
      </Build>

      <Build at={beats[1]} style={{ position: "absolute", right: PAD, top: 254, width: 470 }}>
        <Card label="约束长度 / 两条支路多项式" accent={C.cyan} pad={22}>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 12 }}>
            <Mono size={FT.num} color={C.ink}>{"K = 5"}</Mono>
            <div style={{ fontFamily: FONT.sans, fontSize: FT.meta, color: C.inkFaint, marginBottom: 6 }}>{"= 4 位记忆 + 1 位输入"}</div>
          </div>
          <div style={{ height: 1, background: C.panelLine, margin: "16px 0 14px" }} />
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div>
              <Mono size={FT.label} color={C.cyan}>{"G0 = 1 + D³ + D⁴"}</Mono>
              <div style={{ fontFamily: FONT.mono, fontSize: FT.meta, color: C.inkFaint, marginTop: 4 }}>{"= 0b10011 = 19"}</div>
            </div>
            <div>
              <Mono size={FT.label} color={C.violet}>{"G1 = 1 + D + D³ + D⁴"}</Mono>
              <div style={{ fontFamily: FONT.mono, fontSize: FT.meta, color: C.inkFaint, marginTop: 4 }}>{"= 0b11011 = 27"}</div>
            </div>
          </div>
          <Body size={FT.meta} style={{ marginTop: 14 }}>
            每个时刻的状态就是那四位记忆的取值，共 <Mono size={FT.meta} color={C.cyan}>{"2⁴ = 16"}</Mono> 种。
          </Body>
        </Card>
      </Build>

      <Build at={beats[7]} style={{ position: "absolute", left: PAD, top: 566, width: 780 }}>
        <Plate id="conv-encoder" width={780} caption="原文 §3.1.2.2：G0、G1 与输出比特的定义" />
      </Build>

      <Build at={beats[5]} style={{ position: "absolute", right: PAD, top: 590, width: 860 }}>
        <Card label="对账 / 真跑一遍前八步" accent={C.violet} pad={20}>
          <div style={{ display: "grid", gridTemplateColumns: "66px 106px 132px 132px 150px", rowGap: 4, columnGap: 10 }}>
            {["k", "u(k)", "c(2k)", "c(2k+1)", "下一状态"].map((hd) => (
              <div key={hd} style={{ fontFamily: FONT.mono, fontSize: FT.micro, color: C.inkFaint, letterSpacing: FT_T.micro }}>{hd}</div>
            ))}
            {rows.map((r) => (
              <React.Fragment key={r.k}>
                <div style={{ fontFamily: FONT.mono, fontSize: FT.meta, color: C.inkFaint }}>{r.k}</div>
                <div style={{ fontFamily: FONT.mono, fontSize: FT.meta, color: C.ink }}>{r.u}</div>
                <div style={{ fontFamily: FONT.mono, fontSize: FT.meta, color: C.cyan }}>{r.c0}</div>
                <div style={{ fontFamily: FONT.mono, fontSize: FT.meta, color: C.violet }}>{r.c1}</div>
                <div style={{ fontFamily: FONT.mono, fontSize: FT.meta, color: C.inkDim }}>{r.ns}</div>
              </React.Fragment>
            ))}
          </div>
          <div style={{ fontFamily: FONT.sans, fontSize: FT.micro, color: C.inkFaint, marginTop: 10 }}>
            {"c(0), c(1) 是同一个输入的两个校验；一帧 189 个输入（含 4 个尾零）编出 378 位。"}
          </div>
        </Card>
      </Build>
    </Scene>
  );
};
