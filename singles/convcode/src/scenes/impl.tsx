import React from "react";
import { C, FONT, FT, FT_T } from "../../design/tokens";
import { Build } from "../../design/primitives";
import { Card, Mono, Body, Plate, Head, Scene, PAD, beatAt } from "../shared";

const CODE = [
  "const popcount = (x) => { let c = 0;",
  "  while (x) { c ^= x & 1; x >>= 1; } return c; };",
  "",
  "let s = 0;                        // 4 位记忆",
  "for (const u of frame) {          // 一帧 189 位",
  "  const reg = (u << 4) | s;       // 记忆 + 当前位",
  "  out.push(popcount(reg & 0b10011));  // G0",
  "  out.push(popcount(reg & 0b11011));  // G1",
  "  s = ((s >> 1) | (u << 3)) & 0b1111; // 右移进新位",
  "}",
  "// out.length === 378，速率 1/2",
].join("\n");

/** 实现：算法本身十行；难的是定点、吞吐和几十年后的继任者。 */
export const SImpl: React.FC = () => {
  const beats = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => beatAt("impl", i, 11));
  return (
    <Scene id="impl">
      <Head kicker="07 / 剩下的活" title="算法很短，工程很长" goal="写出来要多少代码，难在哪里" />

      <Build at={beats[0]} style={{ position: "absolute", left: PAD, top: 272, width: 1000 }}>
        <Card label="编码器 / 十行 JS（复数溢出图）" accent={C.cyan} pad={22}>
          <pre style={{
            margin: 0, fontFamily: FONT.mono, fontSize: FT.code, lineHeight: 1.62, color: C.ink,
            whiteSpace: "pre", overflow: "hidden",
          }}>{CODE}</pre>
          <div style={{ fontFamily: FONT.sans, fontSize: FT.meta, color: C.inkFaint, marginTop: 14 }}>
            每帧约 190 次循环、每次几个位运算：在 1990 年代的 DSP 上也只是几十微秒
          </div>
        </Card>
      </Build>

      <Build at={beats[2]} style={{ position: "absolute", right: PAD, top: 268, width: 760 }}>
        <Plate id="annexb" width={760} caption="原文 Annex B：G0/G1 这一对多项式被 GSM 的多个信道复用" />
      </Build>

      <Build at={beats[6]} style={{ position: "absolute", right: PAD, top: 664, width: 760 }}>
        <Card label="真正的工程量" accent={C.amber} pad={20}>
          <div style={{ display: "flex", gap: 26 }}>
            {[
              { k: "定点化", v: "软判决的度量要压进有限位宽，量化噪声会吃掉一部分增益" },
              { k: "吞吐", v: "每 20 ms 一帧，实时约束下译码器必须跟上话音" },
              { k: "功耗", v: "1990 年代手机靠电池，每条支路都要省" },
            ].map((x) => (
              <div key={x.k} style={{ flex: 1 }}>
                <Mono size={FT.label} color={C.ink}>{x.k}</Mono>
                <Body size={FT.meta} style={{ marginTop: 6 }}>{x.v}</Body>
              </div>
            ))}
          </div>
        </Card>
      </Build>

      <Build at={beats[8]} style={{ position: "absolute", left: PAD, top: 790, width: 1040 }}>
        <Card label="四十年，同一条思路" accent={C.violet} pad={20}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            {[
              { y: "1990", k: "GSM", v: "卷积码 1/2" },
              { y: "2000", k: "3G", v: "Turbo 码" },
              { y: "2010", k: "4G", v: "Turbo / LDPC" },
              { y: "2020", k: "5G", v: "LDPC + Polar" },
            ].map((x) => (
              <div key={x.k} style={{ flex: 1, borderLeft: "2px solid " + C.panelLine, paddingLeft: 14 }}>
                <Mono size={FT.micro} color={C.inkFaint}>{x.y}</Mono>
                <div style={{ fontFamily: FONT.sans, fontSize: FT.lead, color: C.ink }}>{x.k}</div>
                <Mono size={FT.meta} color={C.inkDim}>{x.v}</Mono>
              </div>
            ))}
          </div>
        </Card>
      </Build>
    </Scene>
  );
};
