import React from "react";
import { C, FONT, FT } from "../../design/tokens";
import { Build } from "../../design/primitives";
import { Math, MathLine } from "../../design/Math";
import { Card, Mono, Body, Plate, Num, Head, Scene, PAD, ODE, beatAt } from "../shared";

/** 定义：两个单步公式，以及弹簧方程怎么变成两个一阶方程。 */
export const SDefinitions: React.FC = () => {
  const beats = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18].map((i) => beatAt("definitions", i, 19));
  return (
    <Scene id="definitions">
      <Head kicker="02 / 定义" title="一步到底算了什么" goal="把欧拉、RK4 与弹簧方程写成可计算的式子" />

      <div style={{ position: "absolute", left: PAD, top: 286, width: 840 }}>
        <Build at={beats[2]}>
          <Card label="欧拉法 · 一阶" accent={C.amber} pad={18}>
            <MathLine tex={"x_{n+1} = x_n + \\Delta t \\, f(t_n, x_n)"} no={"9.12"} size={27} active />
            <div style={{ display: "flex", alignItems: "baseline", gap: 14, marginTop: 8 }}>
              <Mono size={FT.meta} color={C.inkFaint}>{"f(t,x)=x, x₀=1, Δt=0.1 →"}</Mono>
              <Mono size={FT.h2} color={C.amber}>{"1.1"}</Mono>
            </div>
          </Card>
        </Build>

        <Build at={beats[8]} style={{ marginTop: 14 }}>
          <Card label="四阶龙格库塔 · 一步采四个斜率" accent={C.violet} pad={14}>
            <MathLine tex={"k_1 = f(t_n, x_n)"} size={23} />
            <MathLine tex={"k_2 = f(t_n + \\tfrac{\\Delta t}{2}, x_n + \tfrac{\\Delta t}{2} k_1)"} size={23} />
            <MathLine tex={"k_3 = f(t_n + \\tfrac{\\Delta t}{2}, x_n + \\tfrac{\\Delta t}{2} k_2)"} size={23} />
            <MathLine tex={"k_4 = f(t_n + \\Delta t, x_n + \\Delta t \\, k_3)"} size={23} />
            <MathLine tex={"x_{n+1} = x_n + \\Delta t \\, \\frac{k_1 + 2k_2 + 2k_3 + k_4}{6}"} no={"9.13"} size={23} active />
          </Card>
        </Build>

        <Build at={beats[14]} style={{ marginTop: 14 }}>
          <Card label="弹簧 · 两个一阶方程" accent={C.cyan} pad={14}>
            <div style={{ display: "flex", gap: 28, alignItems: "center" }}>
              <Math tex={"\\begin{cases} m \\dot v = -k x \\\\ \\dot x = v \\end{cases}"} block size={25} />
              <Math tex={"E = \\tfrac12 v^2 + \\tfrac12 \\omega^2 x^2"} block size={25} />
            </div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 14, marginTop: 4 }}>
              <Mono size={FT.micro} color={C.inkFaint}>{"ω = √(k/m)"}</Mono>
              <Mono size={FT.micro} color={C.inkFaint}>{"精确解：x = A cos ωt + B sin ωt"}</Mono>
              <Mono size={FT.micro} color={C.cyan}>{"E 恒定 → 裁判"}</Mono>
            </div>
          </Card>
        </Build>
      </div>

      <div style={{ position: "absolute", left: 1010, top: 286, width: 830 }}>
        <Build at={beats[1]}>
          <Plate id="eq-euler" width={720} caption="原文 9.1.2：欧拉法用当前斜率近似增量" />
        </Build>
        <Build at={beats[14]} style={{ marginTop: 22 }}>
          <Plate id="eq-spring" width={720} caption="原文式 9.16–9.17：弹簧方程的解析解" />
        </Build>
      </div>
    </Scene>
  );
};
