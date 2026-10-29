import React from "react";
import { useCurrentFrame } from "remotion";
import { C, FONT, FT, FT_T } from "../../design/tokens";
import { Build } from "../../design/primitives";
import { Head, Scene, PAD, Card, Body, Mono, K, Quote, beatAt } from "../shared";

/** 开场：先把两条路分开——CfC 拿掉求解器，GM-ODE 没有。 */
export const SOpen: React.FC = () => {
  const f = useCurrentFrame();
  const b = (i: number) => beatAt("open", i, 14);

  return (
    <Scene id="open">
      <Head kicker="第 9 章 / 神经微分方程" title="不求解器也能算" goal="两条去掉求解器的路，和一条其实没去掉的路" />

      <div style={{ position: "absolute", left: PAD, top: 300, width: 800 }}>
        <Build at={b(1)}>
          <Quote
            lines={[
              "CfC：通过为连续时间神经网络的微分方程推导近似闭式解，从根本上消除了对数值求解器的依赖及其计算瓶颈。",
              "GM-ODE：将灰色 GM(1,N) 的白化方程嵌入神经微分方程框架，增强 Neural ODE 的泛化能力。",
            ]}
            width={800}
          />
        </Build>

        <Build at={b(9)} style={{ marginTop: 24 }}>
          <Card label="证据等级 · C" accent={C.coral} pad={20} style={{ width: 800 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
              <div style={{ fontFamily: FONT.serif, fontSize: FT.display, lineHeight: 1, color: C.coral }}>C</div>
              <Body size={FT.body} color={C.inkDim} style={{ flex: 1 }}>
                {"书里只有两段机制描述：没有数据、没有代码、没有复现协议。性能数字不能当结论用。"}
              </Body>
            </div>
          </Card>
        </Build>
      </div>

      <div style={{ position: "absolute", left: 952, top: 300, width: 800 }}>
        <Build at={b(2)}>
          <Card label="CfC · 闭式连续时间网络" accent={C.cyan} pad={22} style={{ width: 800 }}>
            <div style={{ display: "flex", alignItems: "baseline", gap: 16 }}>
              <Mono size={FT.label} color={C.inkFaint}>{"RK4 800 次求值"}</Mono>
              <span style={{ fontFamily: FONT.mono, fontSize: FT.h2, color: C.inkFaint }}>{"→"}</span>
              <Mono size={FT.h1} color={C.cyan}>{"1 次 exp"}</Mono>
            </div>
            <Body size={FT.body} color={C.inkDim} style={{ marginTop: 12 }}>
              {"对常数输入推导指数闭式解；求解器被整个拿掉。"}
            </Body>
          </Card>
        </Build>

        <Build at={b(3)} style={{ marginTop: 22 }}>
          <Card label="GM-ODE · 灰色神经微分方程" accent={C.amber} pad={22} style={{ width: 800 }}>
            <div style={{ fontFamily: FONT.serif, fontSize: FT.h1, color: C.amber, lineHeight: 1.1 }}>{"RK4 仍在"}</div>
            <Body size={FT.body} color={C.inkDim} style={{ marginTop: 12 }}>
              {"去掉的是黑箱右端项 f_θ，换成 GM(1,N) 白化方程；积分一步没少。"}
            </Body>
          </Card>
        </Build>

        <Build at={b(10)} style={{ marginTop: 22 }}>
          <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
            <K>{"这一集的判断"}</K>
            <Mono size={FT.meta} color={C.inkDim}>{"两条路去掉的不是同一个东西"}</Mono>
          </div>
        </Build>
      </div>

      <div style={{ position: "absolute", left: PAD, top: 888, width: 1680, display: "flex", justifyContent: "space-between" }}>
        <Build at={b(7)}>
          <K>{"原文 · 《时序智能》p.219 · 9.3 相关应用研究 · CC BY-NC-ND 4.0"}</K>
        </Build>
        <Build at={b(11)}>
          <Mono size={FT.micro} color={C.inkFaint}>{"ts-base · ch9-cfc / ch9-gm-ode · d894a85"}</Mono>
        </Build>
      </div>
    </Scene>
  );
};
