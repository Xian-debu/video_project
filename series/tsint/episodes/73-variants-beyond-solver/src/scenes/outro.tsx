import React from "react";
import { C, FONT, FT } from "../../design/tokens";
import { Build } from "../../design/primitives";
import { Head, Scene, PAD, Card, Body, Mono, K, V, beatAt } from "../shared";

/** 收束：一句话分开两条路，然后把第 74 集交出去。 */
export const SOutro: React.FC = () => {
  const b = (i: number) => beatAt("outro", i, 9);

  return (
    <Scene id="outro">
      <Head kicker="07 / 一句话" title="一个省求值，一个省样本。" goal="把两条路收成一句话，然后交给下一集" />

      <div style={{ position: "absolute", left: PAD, top: 330, width: 1716, display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 22 }}>
        <Build at={b(2)}>
          <Card label="CfC" accent={C.cyan} pad={22} style={{ height: 250 }}>
            <div style={{ fontFamily: FONT.serif, fontSize: FT.num, color: C.cyan }}>{"1 次 exp"}</div>
            <Body size={FT.body} color={C.inkDim} style={{ marginTop: 10 }}>{"对常数输入有闭式解，RK4 的 800 次求值被整个拿掉。"}</Body>
          </Card>
        </Build>
        <Build at={b(3)}>
          <Card label="GM-ODE" accent={C.amber} pad={22} style={{ height: 250 }}>
            <div style={{ fontFamily: FONT.serif, fontSize: FT.num, color: C.amber }}>{"RK4 仍在"}</div>
            <Body size={FT.body} color={C.inkDim} style={{ marginTop: 10 }}>{"换掉的是黑箱 f_θ；省下的是样本，不是积分步数。"}</Body>
          </Card>
        </Build>
        <Build at={b(4)}>
          <Card label="证据" accent={C.violet} pad={22} style={{ height: 250 }}>
            <div style={{ fontFamily: FONT.serif, fontSize: FT.num, color: C.violet }}>{String(V.meta.tests) + " 条"}</div>
            <Body size={FT.body} color={C.inkDim} style={{ marginTop: 10 }}>{"73 条旧断言加 35 条新增，全部通过；数字可回到同一次运行。"}</Body>
          </Card>
        </Build>
      </div>

      <div style={{ position: "absolute", left: PAD, top: 626, width: 1716 }}>
        <Build at={b(6)}>
          <div style={{ fontFamily: FONT.serif, fontSize: FT.lead, color: C.ink, lineHeight: 1.5 }}>
            {"一个省的是函数求值，一个省的是样本。"}
            <br />
            {"两个都值得学，但不是同一个技巧。"}
          </div>
        </Build>
      </div>

      <div style={{ position: "absolute", left: PAD, top: 806, width: 1716, display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
        <Build at={b(7)}>
          <div>
            <K>{"代码、证据和全部数字"}</K>
            <div><Mono size={FT.meta} color={C.inkDim}>{"ts-base @ " + V.meta.tsBaseCommit + " · evidence " + V.meta.evidenceRunAt}</Mono></div>
          </div>
        </Build>
        <Build at={b(7)}>
          <div style={{ textAlign: "right" }}>
            <K>{"下一集"}</K>
            <div style={{ fontFamily: FONT.serif, fontSize: FT.h2, color: C.cyan }}>{"别只看 MSE：总变差正则与 DTW"}</div>
          </div>
        </Build>
      </div>
    </Scene>
  );
};
