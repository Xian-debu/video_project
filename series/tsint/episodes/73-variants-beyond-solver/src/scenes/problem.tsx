import React from "react";
import { useCurrentFrame } from "remotion";
import { C, FT } from "../../design/tokens";
import { Build } from "../../design/primitives";
import { Math as MathTex } from "../../design/Math";
import { Head, Scene, PAD, Card, Body, Mono, K, beatAt, pct } from "../shared";

/** 问题：先把 RK4 的 800 次求值摆出来，再分清两条路各去掉了什么。 */
export const SProblem: React.FC = () => {
  const f = useCurrentFrame();
  const b = (i: number) => beatAt("problem", i, 20);
  const p = pct(f, b(3), b(3) + 70);

  return (
    <Scene id="problem">
      <Head kicker="01 / 求解器的账" title="到底去掉了什么" goal="八百次函数求值，和一次指数运算" />

      <div style={{ position: "absolute", left: PAD, top: 300, width: 800 }}>
        <Build at={b(0)}>
          <Card label="RK4 · 四阶龙格库塔 · 200 步" accent={C.violet} pad={22} style={{ width: 800 }}>
            <div style={{ display: "flex", alignItems: "baseline", gap: 14 }}>
              <Mono size={FT.label} color={C.inkFaint}>{"200 步 × 4 次"}</Mono>
              <span style={{ color: C.inkFaint, fontFamily: "monospace" }}>{"="}</span>
              <Mono size={FT.num} color={C.violet}>{"800 次右端项求值"}</Mono>
            </div>
            <MathTex tex={String.raw`x_{n+1}=x_n+\frac{h}{6}\,(k_1+2k_2+2k_3+k_4)`} block size={30} style={{ marginTop: 10 }} />
            <div style={{ marginTop: 14, display: "grid", gridTemplateColumns: "repeat(80, 1fr)", gap: 2 }}>
              {Array.from({ length: 800 }).map((_, i) => {
                const on = i / 800 <= p;
                return <div key={i} style={{ height: 7, borderRadius: 1, background: on ? C.violet : C.panelLine, opacity: on ? 0.9 : 0.3 }} />;
              })}
            </div>
            <div style={{ marginTop: 8, display: "flex", justifyContent: "space-between" }}>
              <K>{"第 1 步"}</K>
              <K>{"每一步都访问一遍网络"}</K>
              <K>{"第 200 步"}</K>
            </div>
          </Card>
        </Build>

        <Build at={b(12)} style={{ marginTop: 22 }}>
          <Card label="这一集只算这一笔" accent={C.inkFaint} pad={18} style={{ width: 800 }}>
            <Body size={FT.body} color={C.inkDim}>
              {"书里的 100–100000 倍是模型级说法：没有基线、数据和硬件。这里能直接比的，只有标量闭环的求值次数。"}
            </Body>
          </Card>
        </Build>
      </div>

      <div style={{ position: "absolute", left: 940, top: 300, width: 808 }}>
        <Build at={b(5)}>
          <Card label="CfC · 对常数输入有闭式解" accent={C.cyan} pad={22}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ fontFamily: "serif", fontSize: FT.h2, color: C.ink }}>{"去掉求解器"}</div>
              <Mono size={FT.h2} color={C.cyan}>{"1 次 exp"}</Mono>
            </div>
            <MathTex tex={String.raw`x(t)=A+(x_0-A)\,e^{-ft}`} block size={34} style={{ marginTop: 10 }} />
            <Body size={FT.meta} color={C.inkDim} style={{ marginTop: 8 }}>
              {"一次求值给出任意时刻的状态，不需要逐步积分。"}
            </Body>
          </Card>
        </Build>

        <Build at={b(9)} style={{ marginTop: 22 }}>
          <Card label="GM-ODE · 小样本下的灰色结构" accent={C.amber} pad={22}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ fontFamily: "serif", fontSize: FT.h2, color: C.ink }}>{"没去掉求解器"}</div>
              <Mono size={FT.h2} color={C.amber}>{"RK4 × 200"}</Mono>
            </div>
            <MathTex tex={String.raw`\dot z=-a\,z+b,\qquad z=\mathrm{AGO}(x)`} block size={34} style={{ marginTop: 10 }} />
            <Body size={FT.meta} color={C.inkDim} style={{ marginTop: 8 }}>
              {"右端项从黑箱 f_θ 换成白化方程；积分仍然交给 RK4。"}
            </Body>
          </Card>
        </Build>

        <Build at={b(17)} style={{ marginTop: 20, textAlign: "right" }}>
          <K>{"两条路的区别，先记在这一行"}</K>
        </Build>
      </div>
    </Scene>
  );
};
