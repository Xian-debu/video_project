import React from "react";
import { AbsoluteFill } from "remotion";
import { C, FONT, FT } from "../../design/tokens";
import { PAD, CW, M, pageAt, Pages, Scene, SceneHead, Card, Formula, Row, Body, Mono, Stat, Verdict, Chip } from "../shared";

export const SDefinitions: React.FC = () => {
  const at = [0, pageAt("definitions", 15), pageAt("definitions", 28), pageAt("definitions", 36)];
  return (
    <Scene id="definitions">
      <SceneHead id="definitions" />
      <Pages id="definitions" at={at}>
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 300, width: 1120 }}>
            <Card label="定义一 · Copula：先搬边缘，再拼相关" accent={C.cyan} style={{ width: 1080 }}>
              <Formula size={54}>{"u_i = ( rank(x_i) − 0.5 ) / T"}</Formula>
              <Formula size={54}>{"z_i = Φ⁻¹(u_i)"}</Formula>
              <Formula size={50} color={C.inkDim}>{"C(u, v) = Φ_Σ( z_u, z_v )"}</Formula>
              <Body size={FT.meta} style={{ marginTop: 14 }}>
                每一列用经验排名换成均匀分位，再用正态分位点变成标准正态。相关矩阵 Σ 单独估，边缘靠排名自动对齐 —— 所以边缘的偏态、厚尾都不用建模。
              </Body>
            </Card>
          </div>
          <div style={{ position: "absolute", left: 1440, top: 300, width: 440 }}>
            <Stat label="通道 N" value={String(M.data.channels)} sub={"相关矩阵 " + M.data.channels + " × " + M.data.channels} style={{ width: 400 }} />
            <Stat label="独立参数" value={String((M.data.channels * (M.data.channels - 1)) / 2)} sub="对角线固定为 1，只估上三角" accent={C.violet} style={{ width: 400, marginTop: 18 }} />
            <Stat label="闭式值" value={M.copula.cCorrect.toFixed(6)} sub="ρ = 0.5 时手算可验" accent={C.amber} style={{ width: 400, marginTop: 18 }} />
          </div>
          <div style={{ position: "absolute", left: PAD, top: 852, width: CW }}>
            <Row name="端点 · 排名" value="clip 1e-6" note="排名 0 或 1 会让 Φ⁻¹ 发散，边缘静默变 NaN" color={C.coral} width={1640} />
            <Row name="端点 · 相关矩阵" value="jitter 1e-6" note="Σ 非正定会让 Cholesky 崩 —— 同样是静默错误" color={C.coral} width={1640} />
          </div>
        </AbsoluteFill>

        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 300, width: 1120 }}>
            <Card label="定义二 · 扩散：先加噪，再退火" accent={C.amber} style={{ width: 1080 }}>
              <Formula size={50}>{"q(x_t | x₀) = N( √ᾱ_t x₀, (1 − ᾱ_t) I )"}</Formula>
              <Formula size={46}>{"x_t = √ᾱ_t x₀ + √(1 − ᾱ_t) ε"}</Formula>
              <Formula size={46} color={C.inkDim}>{"L = E ‖ ε − ε_θ(x_t, t) ‖²"}</Formula>
              <Body size={FT.meta} style={{ marginTop: 14 }}>
                前向过程有闭式解，加到 t 时不用一步一步走。训练只学一件事：给定带噪样本和步号，把噪声猜回来。采样从纯噪声出发，反复减掉预测的噪声。
              </Body>
            </Card>
          </div>
          <div style={{ position: "absolute", left: 1440, top: 300, width: 440 }}>
            <Stat label="步数 T" value="1000" sub="线性 β：1e-4 → 0.02" style={{ width: 400 }} />
            <Stat label="维度 d" value="32" sub="批 64 · 训练 400 步" accent={C.violet} style={{ width: 400, marginTop: 18 }} />
            <Stat label="t = 500 的 x_t" value={M.ddpm.xtHalf.toFixed(6)} sub="ᾱ = 0.5 时闭式就是 √2" accent={C.amber} style={{ width: 400, marginTop: 18 }} />
          </div>
          <div style={{ position: "absolute", left: PAD, top: 852, width: CW }}>
            <Row name="采样" value="DDIM 50 步 · 20 条路径" note="不减步数时 1,000 步 × 100 条要跑六分钟，演示砍到 20 条" width={1640} />
          </div>
        </AbsoluteFill>

        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 300, width: 1120 }}>
            <Card label="定义三 · 连续流：可逆映射搬整条密度" accent={C.violet} style={{ width: 1080 }}>
              <Formula size={54}>{"dz/dt = f_θ(z, t)"}</Formula>
              <Formula size={44}>{"log p(x) = log p₀(z₀) − ∫ tr(∂f/∂z) dt"}</Formula>
              <Formula size={44} color={C.inkDim}>{"仿射层  z' = s ⊙ z + b"}</Formula>
              <Formula size={44} color={C.inkDim} style={{ marginTop: 8 }}>{"log|det J| = Σ log|s_i|"}</Formula>
              <Body size={FT.meta} style={{ marginTop: 14 }}>
                流用 ODE 定义一整族可逆映射，密度沿轨迹按雅可比的迹修正。仿射层的行列式就是各维缩放的乘积 —— 手算可得 log 2。
              </Body>
            </Card>
          </div>
          <div style={{ position: "absolute", left: 1440, top: 300, width: 440 }}>
            <Stat label="可逆往返" value={M.cnf.roundtrip.toExponential(2)} sub="推过去再推回来" accent={C.cyan} style={{ width: 400 }} />
            <Stat label="密度积分" value={M.cnf.integral.toFixed(10)} sub="41 × 41 网格上求和" style={{ width: 400, marginTop: 18 }} />
            <Stat label="RK4 阶数" value={M.cnf.rk4Ratio.toFixed(3)} sub="步长减半，误差比 16" accent={C.amber} style={{ width: 400, marginTop: 18 }} />
          </div>
          <div style={{ position: "absolute", left: PAD, top: 852, width: CW }}>
            <Row name="误差分类" value={"闭式 2.22e-16 · RK4 " + M.cnf.rk4Err8.toExponential(2)} note="一个验证实现，一个验证离散格式" width={1640} />
          </div>
        </AbsoluteFill>

        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 300, width: CW }}>
            <Card label="对账 · 计划里的闭式值写错了" accent={C.coral} style={{ width: CW }}>
              <div style={{ display: "flex", gap: 26, marginTop: 6 }}>
                <div style={{ flex: 1 }}>
                  <Mono size={FT.label} color={C.coral}>计划写的</Mono>
                  <div style={{ fontFamily: FONT.mono, fontSize: 76, color: C.coral, lineHeight: 1.15 }}>{M.copula.cPlan.toFixed(6)}</div>
                </div>
                <div style={{ flex: 1 }}>
                  <Mono size={FT.label} color={C.cyan}>正确值 1/4 + arcsin(ρ)/2π</Mono>
                  <div style={{ fontFamily: FONT.mono, fontSize: 76, color: C.cyan, lineHeight: 1.15 }}>{M.copula.cCorrect.toFixed(6)}</div>
                </div>
                <div style={{ flex: 1 }}>
                  <Mono size={FT.label} color={C.amber}>Frechet 上界 min(u, v)</Mono>
                  <div style={{ fontFamily: FONT.mono, fontSize: 76, color: C.amber, lineHeight: 1.15 }}>{M.copula.bound.toFixed(1)}</div>
                </div>
              </div>
              <Body size={FT.body} style={{ marginTop: 22, width: 1680 }}>
                计划值是 {(M.copula.cPlan / M.copula.bound).toFixed(3)} 倍上界。Copula 值域被 min(u,v) 卡住：u = v = 0.5 时任何 Copula 都不能超过 0.5，所以 {M.copula.cPlan.toFixed(6)} 不可能是对的。
              </Body>
              <div style={{ display: "flex", gap: 18, marginTop: 22 }}>
                <Verdict ok label="测试钉死 1/3" />
                <Verdict ok label="并断言 0.583333 违反上界" />
                <Chip color={C.violet}>errata 一行 + SELF-AUTH 双重登记</Chip>
              </div>
            </Card>
          </div>
          <div style={{ position: "absolute", left: PAD, top: 880, width: CW }}>
            <Row name="登记" value="docs/09-book-errata.md" note="E29 / ch3 / p.67–68 一行，写明计划原文、正确值、违反的上界" width={1640} />
          </div>
        </AbsoluteFill>
      </Pages>
    </Scene>
  );
};

