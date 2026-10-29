import React from "react";
import { C, FONT, FT, FT_T } from "../../design/tokens";
import { Build } from "../../design/primitives";
import { Card, Mono, Body, Scene, PAD, ODE, beatAt } from "../shared";

const ITEMS = [
  { k: "公式", v: "欧拉 / RK4", n: "同一签名，边界先判" },
  { k: "裁判", v: "解析解 + 能量", n: "34 条断言，3 份证据" },
  { k: "边界", v: "稳定域 + 光滑性", n: "先问假设成不成立" },
];

/** 收束：三件事、一句话、下一集。 */
export const SOutro: React.FC = () => {
  const beats = [0, 1, 2, 3, 4, 5, 6, 7].map((i) => beatAt("outro", i, 8));
  return (
    <Scene id="outro">
      <div style={{ position: "absolute", left: PAD, top: 132, width: 1400 }}>
        <div style={{ fontFamily: FONT.mono, fontSize: FT.label, letterSpacing: FT_T.label, color: C.cyan }}>{"07 / 收束"}</div>
        <div style={{ fontFamily: FONT.serif, fontSize: FT.display, lineHeight: 1.15, marginTop: 16 }}>
          <>{"方法的选择，"}<br />{"是模型的一部分。"}</>
        </div>
      </div>

      <div style={{ position: "absolute", left: PAD, top: 470, display: "flex", gap: 22 }}>
        {ITEMS.map((it, i) => (
          <Build key={it.k} at={beats[1 + i]}>
            <Card accent={[C.cyan, C.violet, C.coral][i]} pad={22} style={{ width: 520 }}>
              <Mono size={FT.micro} color={C.inkFaint}>{it.k}</Mono>
              <div style={{ fontFamily: FONT.serif, fontSize: FT.h2, marginTop: 8 }}>{it.v}</div>
              <Body size={FT.meta} style={{ marginTop: 6 }}>{it.n}</Body>
            </Card>
          </Build>
        ))}
      </div>

      <Build at={beats[5]} style={{ position: "absolute", left: PAD, top: 720, width: 1780 }}>
        <div style={{ height: 1, background: C.panelLine, marginBottom: 18 }} />
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
          <div>
            <Mono size={FT.meta} color={C.inkDim}>{"代码与证据 · ts-base @ " + ODE.meta.tsBaseCommit.slice(0, 7)}</Mono>
            <div style={{ marginTop: 8 }}>
              <Mono size={FT.meta} color={C.inkFaint}>{"cabal test · 34 passed　|　check_evidence.py · 3 files, 0 error"}</Mono>
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <Mono size={FT.micro} color={C.inkFaint}>{"下一集"}</Mono>
            <div style={{ fontFamily: FONT.serif, fontSize: FT.h2, marginTop: 4 }}>{"让神经网络自己学动力学"}</div>
          </div>
        </div>
      </Build>
    </Scene>
  );
};
