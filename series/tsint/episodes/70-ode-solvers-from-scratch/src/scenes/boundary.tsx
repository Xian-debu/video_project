import React from "react";
import { C, FONT, FT } from "../../design/tokens";
import { Build } from "../../design/primitives";
import { Math } from "../../design/Math";
import { Card, Mono, Body, Plot, Head, Scene, PAD, ODE, beatAt } from "../shared";

/** 边界：稳定域、光滑性、成本。三张牌，各自说清失效条件。 */
export const SBoundary: React.FC = () => {
  const beats = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21].map((i) => beatAt("boundary", i, 22));
  const rows = ODE.stock.rows;
  return (
    <Scene id="boundary">
      <Head kicker="06 / 边界" title="稳定域与光滑性假设" goal="说清方法的失效条件，而不是只报喜" />

      <Build at={beats[2]} style={{ position: "absolute", left: PAD, top: 286, width: 900 }}>
        <Card label="第一类 · 绝对稳定性" accent={C.coral} pad={20}>
          <div style={{ display: "flex", gap: 26, alignItems: "center" }}>
            <Math tex={"|1 + z| \\le 1 \\quad (z = -h\\lambda)"} block size={26} align="left" />
            <Math tex={"h\\lambda < 2"} block size={26} align="left" />
          </div>
          <div style={{ position: "relative", height: 96, marginTop: 12 }}>
            <div style={{ position: "absolute", left: 0, right: 0, top: 42, height: 8, background: C.panelLine, borderRadius: 4 }} />
            <div style={{ position: "absolute", left: 0, width: "58%", top: 42, height: 8, background: C.cyan, borderRadius: 4 }} />
            <div style={{ position: "absolute", left: "58%", right: 0, top: 42, height: 8, background: C.coral, borderRadius: 4 }} />
            <div style={{ position: "absolute", left: "58%", top: 22, width: 2, height: 48, background: C.coral }} />
            <div style={{ position: "absolute", left: "58%", top: 74 }}>
              <Mono size={FT.micro} color={C.coral}>{"hλ = 2"}</Mono>
            </div>
            <div style={{ position: "absolute", left: 2, top: 74 }}>
              <Mono size={FT.micro} color={C.cyan}>{"稳定"}</Mono>
            </div>
            <div style={{ position: "absolute", right: 0, top: 74 }}>
              <Mono size={FT.micro} color={C.coral}>{"振荡发散（真解在衰减）"}</Mono>
            </div>
          </div>
          <Body size={FT.meta}>
            {"欧拉在实轴上稳定区间是 (−2, 0)；RK4 更大，但虚轴上仍有 "}
            <Mono size={FT.meta} color={C.violet}>{"hω < 2√2"}</Mono>
            {" 的硬上限。"}
          </Body>
        </Card>
      </Build>

      <Build at={beats[13]} style={{ position: "absolute", left: 1010, top: 286, width: 838 }}>
        <Card label="第二类 · 光滑性假设" accent={C.amber} pad={20}>
          <div style={{ display: "flex", gap: 18, alignItems: "center" }}>
            <div style={{ width: 480 }}>
              <Plot w={480} h={130} at={beats[13]} dur={40}
                x={(v) => (v / (rows.length - 1)) * 480} y={(v) => 130 - v * 130}
                series={[{ pts: rows.map((r, i) => ({ x: i, y: r.v })), color: C.amber, width: 2, dot: true }]} />
            </div>
            <div style={{ flex: 1 }}>
              <Body size={FT.meta}>{"收盘价是分段常数（或分段线性），拐点处斜率跳变。"}</Body>
              <Body size={FT.meta} style={{ marginTop: 8 }}>{"四阶收敛假设右端项足够光滑；跳变处高阶项失效，阶数会掉下来。"}</Body>
              <Mono size={FT.micro} color={C.coral} style={{ display: "block", marginTop: 8 }}>{"不是实现错误，是假设不成立"}</Mono>
            </div>
          </div>
        </Card>
      </Build>

      <Build at={beats[18]} style={{ position: "absolute", left: PAD, top: 660, width: 1780 }}>
        <Card label="第三类 · 成本" accent={C.violet} pad={18}>
          <div style={{ display: "flex", gap: 18 }}>
            <div style={{ flex: 1, background: C.bg, borderRadius: 10, padding: "12px 18px" }}>
              <Mono size={FT.micro} color={C.inkFaint}>{"欧拉"}</Mono>
              <div><Mono size={FT.h1} color={C.amber}>{"1×"}</Mono> <Mono size={FT.meta} color={C.inkDim}>{"求值 / 步"}</Mono></div>
            </div>
            <div style={{ flex: 1, background: C.bg, borderRadius: 10, padding: "12px 18px" }}>
              <Mono size={FT.micro} color={C.inkFaint}>{"RK4"}</Mono>
              <div><Mono size={FT.h1} color={C.violet}>{"4×"}</Mono> <Mono size={FT.meta} color={C.inkDim}>{"求值 / 步"}</Mono></div>
            </div>
            <div style={{ flex: 1.6, background: C.bg, borderRadius: 10, padding: "12px 18px" }}>
              <Mono size={FT.micro} color={C.inkFaint}>{"神经微分方程训练"}</Mono>
              <Body size={FT.meta} style={{ marginTop: 4 }}>{"反传要穿过整个求解器：步数 × 每步求值数，都是显存与时间。"}</Body>
            </div>
          </div>
        </Card>
      </Build>

      <Build at={beats[21]} style={{ position: "absolute", left: PAD, top: 906 }}>
        <Mono size={FT.meta} color={C.inkFaint}>{"下一集：把求解器放进网络里，这些边界会变成设计约束"}</Mono>
      </Build>
    </Scene>
  );
};
