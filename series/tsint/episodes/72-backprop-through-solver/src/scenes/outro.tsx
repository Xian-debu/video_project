import React from "react";
import { C, FONT, FT, FT_T } from "../../design/tokens";
import { Build } from "../../design/primitives";
import { Card, Mono, Body, Scene, PAD, Num, beatAt, BP } from "../shared";

const ITEMS = [
  { k: "梯度", v: <Num value={BP.key.gradDirect} size={28} color={C.cyan} />, n: "闭式、直接、伴随：同一个数", c: C.cyan },
  { k: "空间", v: <span style={{ fontFamily: FONT.serif, fontSize: FT.h2 }}>{"201 → 11"}</span>, n: "磁带 vs 检查点，时间换空间", c: C.violet },
  { k: "裁判", v: <span style={{ fontFamily: FONT.serif, fontSize: FT.h2 }}>{"72 条断言"}</span>, n: "22 条新增，相对误差容差", c: C.amber },
];

/** 收束：一笔账，交接到下一集。 */
export const SOutro: React.FC = () => {
  const beats = [0, 1, 2, 3, 4, 5, 6, 7].map((i) => beatAt("outro", i, 8));
  return (
    <Scene id="outro">
      <div style={{ position: "absolute", left: PAD, top: 132, width: 1600 }}>
        <div style={{ fontFamily: FONT.mono, fontSize: FT.label, letterSpacing: FT_T.label, color: C.cyan }}>{"07 / 一笔账"}</div>
        <div style={{ fontFamily: FONT.serif, fontSize: FT.display, lineHeight: 1.15, marginTop: 16 }}>
          <>{"用时间换空间。"}</>
        </div>
        <div style={{ marginTop: 18, width: 1100 }}>
          <Body size={FT.body} color={C.inkDim}>{"反传要梯度，也要内存。直接法存整条磁带；伴随法只存检查点，其余重算。数字一样，代价不同。选哪条路，看内存更贵，还是时间更贵。"}</Body>
        </div>
      </div>

      <div style={{ position: "absolute", left: PAD, top: 470, display: "flex", gap: 22 }}>
        {ITEMS.map((it, i) => (
          <Build key={it.k} at={beats[1 + i]}>
            <Card accent={it.c} pad={22} style={{ width: 500 }}>
              <Mono size={FT.micro} color={C.inkFaint}>{it.k}</Mono>
              <div style={{ marginTop: 8, minHeight: 44 }}>{it.v}</div>
              <Body size={FT.meta} style={{ marginTop: 6 }}>{it.n}</Body>
            </Card>
          </Build>
        ))}
      </div>

      <Build at={beats[5]} style={{ position: "absolute", left: PAD, top: 720, width: 1780 }}>
        <div style={{ height: 1, background: C.panelLine, marginBottom: 18 }} />
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
          <div>
            <Mono size={FT.meta} color={C.inkDim}>{"代码与证据 · ts-base @ " + BP.meta.tsBaseCommit}</Mono>
            <div style={{ marginTop: 8 }}>
              <Mono size={FT.meta} color={C.inkFaint}>{"cabal test · 72 passed　|　证据 2 份、CSV 4 个　|　theta 0.5 / h 0.01 / T 200"}</Mono>
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <Mono size={FT.micro} color={C.inkFaint}>{"下一集"}</Mono>
            <div style={{ fontFamily: FONT.serif, fontSize: FT.h2, marginTop: 4 }}>{"把梯度穿进网络"}</div>
          </div>
        </div>
      </Build>

      <div style={{ position: "absolute", left: PAD, top: 920 }}>
        <Mono size={FT.micro} color={C.inkFaint}>{"屏幕上的每个数，都能在 ts-base 的 evidence/ch09 里找到同一次运行。"}</Mono>
      </div>
    </Scene>
  );
};
