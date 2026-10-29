import React from "react";
import { useCurrentFrame } from "remotion";
import { C, FONT, FT } from "../../design/tokens";
import { Build } from "../../design/primitives";
import { Math as MathTex, MathLine } from "../../design/Math";
import { Head, Scene, PAD, Plate, Card, Mono, Body, Num, beatAt, NEURAL } from "../shared";

/** 定义：闭式 k̂、Neural ODE 的式 9.18/9.21/9.22，以及 337 个参数的来历。 */
export const SDefinitions: React.FC = () => {
  const b = (i: number) => beatAt("definitions", i, 22);
  const f = useCurrentFrame();
  const showNeural = f >= b(12);

  return (
    <Scene id="definitions">
      <Head kicker="02 / 闭式解与可学习函数" title="一行闭式解，一个可学习函数" goal="把式 9.14 到式 9.22 落到可计算的形状" />

      <div style={{ position: "absolute", left: PAD, top: 250, width: 830 }}>
        <Build at={b(0)}>
          <Card label="连续模型 · 式 9.14 / 9.15" accent={C.amber} pad={14}>
            <MathLine tex={"\\frac{dx}{dt} = k x"} no={"9.14"} size={23} />
            <MathLine tex={"x(t) = x_0 e^{k t}"} no={"9.15"} size={23} active />
            <div style={{ marginTop: 4 }}>
              <Mono size={FT.micro} color={C.inkFaint}>{"k 是常数：整条轨迹由一个参数决定"}</Mono>
            </div>
          </Card>
        </Build>

        <Build at={b(5)} style={{ marginTop: 8 }}>
          <Card label="离散观测 · 闭式最小二乘" accent={C.cyan} pad={14}>
            <MathLine tex={"\\hat{k} = \\frac{\\mathrm{Cov}(t,\\ln x)}{\\mathrm{Var}(t)}"} size={24} active />
            <div style={{ display: "flex", gap: 26, marginTop: 2 }}>
              <MathTex tex={"\\mathrm{Cov} = \\tfrac1n \\sum_i (t_i-\\bar t)(\\ln x_i-\\overline{\\ln x})"} block size={17} />
              <MathTex tex={"\\mathrm{Var} = \\tfrac1n \\sum_i (t_i-\\bar t)^2"} block size={17} />
            </div>
            <div style={{ marginTop: 4 }}>
              <Mono size={FT.micro} color={C.inkFaint}>{"不需要迭代；t 先中心化，避免大时间戳吃掉精度"}</Mono>
            </div>
          </Card>
        </Build>

        <Build at={b(11)} style={{ marginTop: 8 }}>
          <Card label="神经微分方程 · 式 9.18 / 9.21 / 9.22" accent={C.violet} pad={10}>
            <MathLine tex={"\\frac{d\\mathbf{x}(t)}{dt} = f_\\theta(\\mathbf{x}(t), t)"} no={"9.18"} size={22} active />
            <MathLine tex={"\\hat{\\mathbf{x}}_{t_1,\\dots,t_n} = \\mathrm{ODESolver}(x_0, f_\\theta, t_0, \\langle t_1,\\dots,t_n\\rangle)"} no={"9.21"} size={17} />
            <MathLine tex={"\\mathcal{L} = \\frac1n \\sum_i (x_i - \\hat{x}_i)^2"} no={"9.22"} size={19} />
            <div style={{ marginTop: 0, display: "flex", alignItems: "baseline", gap: 18 }}>
              <Mono size={FT.micro} color={C.inkFaint}>{"2→16→16→1 tanh"}</Mono>
              <Mono size={FT.micro} color={C.cyan}>{"48 + 272 + 17 ="}</Mono>
              <Num value={NEURAL.key.paramCount} size={22} color={C.cyan} />
              <Mono size={FT.micro} color={C.inkFaint}>{"个参数"}</Mono>
            </div>
          </Card>
        </Build>
      </div>

      <div style={{ position: "absolute", left: 920, top: 266, width: 900 }}>
        <Build at={b(2)}>
          {showNeural ? (
            <Plate id="eq-neuralode" width={600} caption="原文 9.2.1：把右端项换成神经网络的参数化函数" />
          ) : (
            <Plate id="eq-compound" width={600} caption="原文 9.1.3：连续复利模型 x' = kx 与它的指数解" />
          )}
        </Build>
      </div>
    </Scene>
  );
};