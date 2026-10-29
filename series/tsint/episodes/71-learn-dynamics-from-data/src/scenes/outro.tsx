import React from "react";
import { C, FONT, FT, FT_T } from "../../design/tokens";
import { Build } from "../../design/primitives";
import { Card, Mono, Body, Scene, PAD, Num, beatAt, NEURAL } from "../shared";

const ITEMS = [
  { k: "公式", v: "x' = kx → f_θ(x,t)", n: "闭式解给基准，网络给形状", c: C.cyan },
  { k: "参数", v: "2 → 337", n: "2→16→16→1，48+272+17", c: C.violet },
  { k: "裁判", v: "50 条断言", n: "闭式、轨迹、边界、成本", c: C.amber },
];

/** 收束：把常数换成函数，下一集交给反向传播。 */
export const SOutro: React.FC = () => {
  const beats = [0, 1, 2, 3, 4, 5, 6, 7].map((i) => beatAt("outro", i, 8));
  return (
    <Scene id="outro">
      <div style={{ position: "absolute", left: PAD, top: 132, width: 1500 }}>
        <div style={{ fontFamily: FONT.mono, fontSize: FT.label, letterSpacing: FT_T.label, color: C.cyan }}>{"07 / 收束"}</div>
        <div style={{ fontFamily: FONT.serif, fontSize: FT.display, lineHeight: 1.15, marginTop: 16 }}>
          <>{"把常数换成函数，"}</> <br /> <>{"把拟合换成动力学。"}</>
        </div>
      </div>

      <div style={{ position: "absolute", left: PAD, top: 480, display: "flex", gap: 22 }}>
        {ITEMS.map((it, i) => (
          <Build key={it.k} at={beats[1 + i]}>
            <Card accent={it.c} pad={22} style={{ width: 520 }}>
              <Mono size={FT.micro} color={C.inkFaint}>{it.k}</Mono>
              <div style={{ fontFamily: FONT.serif, fontSize: FT.h2, marginTop: 8 }}>{it.v}</div>
              <Body size={FT.meta} style={{ marginTop: 6 }}>{it.n}</Body>
            </Card>
          </Build>
        ))}
      </div>

      <Build at={beats[5]} style={{ position: "absolute", left: PAD, top: 736, width: 1780 }}>
        <div style={{ height: 1, background: C.panelLine, marginBottom: 18 }} />
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
          <div>
            <Mono size={FT.meta} color={C.inkDim}>{"代码与证据 · ts-base @ " + NEURAL.meta.tsBaseCommit.slice(0, 7)}</Mono>
            <div style={{ marginTop: 8 }}>
              <Mono size={FT.meta} color={C.inkFaint}>{"cabal test · 50 passed　|　证据 3 份、CSV 7 个、train 94.063471744 s"}</Mono>
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <Mono size={FT.micro} color={C.inkFaint}>{"下一集"}</Mono>
            <div style={{ fontFamily: FONT.serif, fontSize: FT.h2, marginTop: 4 }}>{"让梯度穿过整个求解器"}</div>
          </div>
        </div>
      </Build>

      <div style={{ position: "absolute", left: PAD, top: 940 }}>
        <Mono size={FT.micro} color={C.inkFaint}>{"屏幕上的每个数，都能在 ts-base 的 evidence/ch09 里找到同一次运行。"}</Mono>
      </div>
    </Scene>
  );
};
