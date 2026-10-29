import React from "react";
import { C, FT } from "../../design/tokens";
import { Build } from "../../design/primitives";
import { Math as MathTex } from "../../design/Math";
import { Head, Scene, PAD, Card, Body, Mono, K, V, beatAt } from "../shared";

const Chip: React.FC<{ children: React.ReactNode; color?: string }> = ({ children, color = C.cyan }) => (
  <span style={{
    display: "inline-block", minWidth: 52, textAlign: "center", padding: "4px 10px", marginRight: 8,
    border: "1px solid " + C.panelLine, borderRadius: 8, fontFamily: "monospace", fontSize: FT.meta, color,
  }}>{children}</span>
);

/** 定义：CfC 的标量闭式解与 GM(1,1) 的白化方程，各自一条链。 */
export const SDefinitions: React.FC = () => {
  const b = (i: number) => beatAt("definitions", i, 33);
  const k = V.key;

  return (
    <Scene id="definitions">
      <Head kicker="02 / 闭式解与灰色白化" title="两条方程，两种闭式" goal="CfC 的指数解，GM(1,1) 的累加与最小二乘" />

      <div style={{ position: "absolute", left: PAD, top: 290, width: 880 }}>
        <Build at={b(0)}>
          <Card label="CfC · 标量版本" accent={C.cyan} pad={22} style={{ width: 880 }}>
            <MathTex tex={String.raw`\frac{dx}{dt}=-f\,(x-A)`} block size={32} />
            <div style={{ display: "flex", gap: 24, marginTop: 8 }}>
              <K>{"标量版 · w_τ 并入 f"}</K>
              <K>{"f = softplus(raw) > 0"}</K>
              <K>{"A 候选状态"}</K>
            </div>
            <div style={{ height: 1, background: C.panelLine, margin: "16px 0" }} />
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <Mono size={FT.label} color={C.inkFaint}>{"常数输入的闭式解"}</Mono>
              <MathTex tex={String.raw`x(t)=A+(x_0-A)\,e^{-ft}`} size={34} />
            </div>
            <Body size={FT.meta} color={C.inkDim} style={{ marginTop: 8 }}>
              {"t=0 回到 x0；t→∞ 收敛到 A。网络学 f 与 A，不做积分。"}
            </Body>
          </Card>
        </Build>

        <Build at={b(9)} style={{ marginTop: 20 }}>
          <Card label="CfC · 门控形式（两个候选）" accent={C.violet} pad={22} style={{ width: 880 }}>
            <MathTex tex={String.raw`x(t)=\sigma(-ft)\,g+\bigl(1-\sigma(-ft)\bigr)\,h`} block size={32} />
            <Body size={FT.meta} color={C.inkDim} style={{ marginTop: 8 }}>
              {"t=0 取 g 与 h 的中点；t 增大趋近 h。同样只要一次 exp，但它和上面的指数解不是同一条曲线。"}
            </Body>
          </Card>
        </Build>
      </div>

      <div style={{ position: "absolute", left: 1000, top: 290, width: 776 }}>
        <Build at={b(14)}>
          <Card label="GM(1,1) · 累加与白化" accent={C.amber} pad={22} style={{ width: 776 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <Mono size={FT.meta} color={C.inkFaint}>{"AGO"}</Mono>
              <Chip color={C.inkDim}>{"1"}</Chip><Chip color={C.inkDim}>{"2"}</Chip><Chip color={C.inkDim}>{"3"}</Chip><Chip color={C.inkDim}>{"4"}</Chip>
              <span style={{ color: C.inkFaint }}>{"→"}</span>
              <Chip color={C.cyan}>{k.ago[0]}</Chip><Chip color={C.cyan}>{k.ago[1]}</Chip><Chip color={C.cyan}>{k.ago[2]}</Chip><Chip color={C.cyan}>{k.ago[3]}</Chip>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 10 }}>
              <Mono size={FT.meta} color={C.inkFaint}>{"IAGO"}</Mono>
              <Chip color={C.cyan}>{k.ago[0]}</Chip><Chip color={C.cyan}>{k.ago[1]}</Chip><Chip color={C.cyan}>{k.ago[2]}</Chip><Chip color={C.cyan}>{k.ago[3]}</Chip>
              <span style={{ color: C.inkFaint }}>{"→"}</span>
              <Chip color={C.inkDim}>{k.iago[0]}</Chip><Chip color={C.inkDim}>{k.iago[1]}</Chip><Chip color={C.inkDim}>{k.iago[2]}</Chip><Chip color={C.inkDim}>{k.iago[3]}</Chip>
            </div>
            <MathTex tex={String.raw`\frac{dz^{(1)}}{dt}+a\,z^{(1)}=b`} block size={32} style={{ marginTop: 14 }} />
            <MathTex tex={String.raw`\begin{bmatrix}a\\ b\end{bmatrix}=(B^{\mathsf T}B)^{-1}B^{\mathsf T}y`} block size={28} />
            <div style={{ height: 1, background: C.panelLine, margin: "10px 0 12px" }} />
            <div style={{ display: "flex", gap: 30 }}>
              <div><K>{"a · 发展系数"}</K><div><Mono size={FT.h2} color={C.cyan}>{String(k.a)}</Mono></div></div>
              <div><K>{"b · 灰作用量"}</K><div><Mono size={FT.h2} color={C.cyan}>{String(k.b)}</Mono></div></div>
            </div>
            <Body size={FT.meta} color={C.inkDim} style={{ marginTop: 10 }}>
              {"两个未知数，最小二乘一次解出。这是 GM(1,N) 的单变量特例；多变量耦合不在本集。"}
            </Body>
          </Card>
        </Build>

        <Build at={b(24)} style={{ marginTop: 18 }}>
          <div style={{ display: "flex", gap: 12, alignItems: "center", justifyContent: "flex-end" }}>
            <K>{"一个省求值，一个换先验"}</K>
            <Mono size={FT.micro} color={C.inkFaint}>{"p.219 · 9.3"}</Mono>
          </div>
        </Build>
      </div>
    </Scene>
  );
};
