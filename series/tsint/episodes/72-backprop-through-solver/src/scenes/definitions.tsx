import React from "react";
import { C, FONT, FT } from "../../design/tokens";
import { Build } from "../../design/primitives";
import { Math as MathTex } from "../../design/Math";
import { Head, Scene, PAD, Card, Mono, Body, Plate, beatAt } from "../shared";
import { PLATES } from "../script";

/** 定义：把求解器摊成计算链，再换成伴随方程。 */
export const SDefinitions: React.FC = () => {
  const b = (i: number) => beatAt("definitions", i, 23);

  return (
    <Scene id="definitions">
      <Head kicker="02 / 链式法则与伴随方程" title="把求解器摊开" goal="从一步欧拉走到式 9.23 到 9.25" />

      <div style={{ position: "absolute", left: PAD, top: 260, width: 900 }}>
        <Build at={b(2)}>
          <Card label="计算链 · 一步欧拉" accent={C.violet} pad={20} style={{ width: 860 }}>
            <MathTex tex={"x_{n+1}=x_n+h\\,f(x_n,\\theta),\\qquad L=x_T^2"} block size={30} />
            <div style={{ marginTop: 14, display: "flex", gap: 30, alignItems: "baseline" }}>
              <MathTex tex={"a_n=\\frac{\\partial L}{\\partial x_n}"} size={27} />
              <MathTex tex={"a_n=a_{n+1}\\,(1+h\\,\\partial_x f)"} size={27} />
            </div>
            <div style={{ marginTop: 10 }}>
              <MathTex tex={"\\frac{dL}{d\\theta}=\\sum_{n=0}^{T-1}a_{n+1}\\,h\\,\\partial_\\theta f(x_n,\\theta)"} size={25} />
            </div>
            <div style={{ marginTop: 8 }}><Mono size={FT.micro} color={C.inkFaint}>{"直接法：每一步都留在 tape 里，反向逐项累加。"}</Mono></div>
          </Card>
        </Build>

        <Build at={b(9)} style={{ marginTop: 12 }}>
          <Card label="伴随方程 · 连续版本" accent={C.amber} pad={20} style={{ width: 860 }}>
            <MathTex tex={"\\frac{da(t)}{dt}=-a(t)^{\\top}\\frac{\\partial f(x(t),t,\\theta)}{\\partial x}"} block size={26} />
            <div style={{ marginTop: 8 }}>
              <MathTex tex={"\\frac{dL}{d\\theta}=-\\int_{t_0}^{t_1}a(t)^{\\top}\\frac{\\partial f}{\\partial\\theta}\\,dt"} size={24} />
            </div>
            <div style={{ marginTop: 8 }}><Mono size={FT.micro} color={C.inkFaint}>{"式 9.24 与 9.25：从终点反向积分，空间不随步数线性增长。"}</Mono></div>
          </Card>
        </Build>

        <Build at={b(16)} style={{ marginTop: 12 }}>
          <Card label="代价 · 表 9.1" accent={C.cyan} pad={16} style={{ width: 860 }}>
            <div style={{ display: "flex", gap: 40 }}>
              <div><Mono size={FT.micro} color={C.inkFaint}>{"RK-Net · 空间 / 时间"}</Mono><div><Mono size={FT.h3} color={C.violet}>{"O(L) / O(L)"}</Mono></div></div>
              <div><Mono size={FT.micro} color={C.inkFaint}>{"ODE-Net · 空间 / 时间"}</Mono><div><Mono size={FT.h3} color={C.amber}>{"O(1) / O(L)"}</Mono></div></div>
              <div style={{ flex: 1 }}><Body size={FT.micro} color={C.inkDim}>{"L̄ 是一次求解器调用的计算量；常数空间不是零成本，重算要还时间。"}</Body></div>
            </div>
          </Card>
        </Build>
      </div>

      <div style={{ position: "absolute", left: 940, top: 268, width: 760 }}>
        <Build at={b(1)}>
          <Plate id={PLATES.backprop} width={620} caption="原文 9.2.2：直接法与邻接伴随法" at={b(1)} />
        </Build>
      </div>
    </Scene>
  );
};
