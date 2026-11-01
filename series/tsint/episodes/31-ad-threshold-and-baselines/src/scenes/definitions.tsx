import React from "react";
import { AbsoluteFill } from "remotion";
import { C, FONT, FT } from "../../design/tokens";
import { PAD, CW, M, fmtF, pageAt, Pages, Scene, SceneHead, Card, Row, KV, Body, Mono, CodeBlock, Formula, Chip } from "../shared";

export const SDefinitions: React.FC = () => {
  const at = [0, pageAt("definitions", 13), pageAt("definitions", 32)];
  return (
    <Scene id="definitions">
      <SceneHead id="definitions" />
      <Pages id="definitions" at={at}>
        {/* 页一：三条判据 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 300, width: CW, display: "flex", gap: 26 }}>
            <Card label="定义一 · 固定阈值" accent={C.cyan} style={{ width: 550 }}>
              <div style={{ fontFamily: FONT.serif, fontSize: 34, color: C.ink, lineHeight: 1.5, marginTop: 6 }}>
                τ = μ + k·σ
              </div>
              <Mono size={FT.meta} color={C.inkFaint} style={{ display: "block", marginTop: 8 }}>k = 3；μ、σ 用训练段估计</Mono>
              <Body size={FT.body} style={{ marginTop: 16 }}>
                没有参数可学，只是把常识写成公式。它假设分数是正态的 —— 这个假设通常不成立。
              </Body>
            </Card>
            <Card label="定义二 · 分位数" accent={C.amber} style={{ width: 550 }}>
              <div style={{ fontFamily: FONT.serif, fontSize: 34, color: C.ink, lineHeight: 1.5, marginTop: 6 }}>
                τ = Q_q(训练分数)
              </div>
              <Mono size={FT.meta} color={C.inkFaint} style={{ display: "block", marginTop: 8 }}>q = 0.99 是分位水平，不是超限率</Mono>
              <Body size={FT.body} style={{ marginTop: 16 }}>
                让 1% 的点落在阈值右边。方向弄反，阈值会掉到 0.0127，2641 个点被判异常。
              </Body>
            </Card>
            <Card label="定义三 · SPOT" accent={C.violet} style={{ width: 550 }}>
              <div style={{ fontFamily: FONT.serif, fontSize: 34, color: C.ink, lineHeight: 1.5, marginTop: 6 }}>
                尾部拟合 + 风险反推
              </div>
              <Mono size={FT.meta} color={C.inkFaint} style={{ display: "block", marginTop: 8 }}>ξ = −0.456，β = 3.5416，u = 2.6568</Mono>
              <Body size={FT.body} style={{ marginTop: 16 }}>
                先拟合尾部，再给定风险率解阈值。风险率一改，阈值立刻跟着改，不用重训。
              </Body>
            </Card>
          </div>
          <div style={{ position: "absolute", left: PAD, top: 790, width: 1500 }}>
            <Body size={FT.body}>
              三条判据都是判 x 大于 τ。区别只在 τ 从哪来：人拍、数据分位、还是尾部模型。
            </Body>
            <div style={{ display: "flex", gap: 18, marginTop: 22 }}>
              <Chip color={C.cyan}>严格大于</Chip>
              <Chip color={C.amber}>等于阈值算正常</Chip>
              <Chip color={C.inkFaint}>三条都只切分数，不造分数</Chip>
            </div>
          </div>
        </AbsoluteFill>

        {/* 页二：SPOT 的公式 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 300, width: 1060 }}>
            <Formula size={54} note="n 是样本数，n_t 是超过 u 的尾部点数，r 是风险率">
              τ = u + (β/ξ)·((n·r / n_t)^(−ξ) − 1)
            </Formula>
            <div style={{ marginTop: 30 }}>
              <Body size={FT.body} style={{ width: 1000 }}>
                ξ 为负时，幂次翻转，尾部有上界。u 是尾部门槛：低于它的点不参与拟合，高于它的点服从帕累托。
              </Body>
            </div>
            <Card label="为什么不用牛顿迭代" accent={C.coral} style={{ marginTop: 26, width: 1000 }}>
              <Body size={FT.body} color={C.ink}>
                极大似然有两个方程。第二个在 ξ 接近 0 时退化，直接迭代会发散。所以改成剖面似然：ξ 网格上扫，每个点解第一个方程，再三分细化。
              </Body>
            </Card>
          </div>
          <div style={{ position: "absolute", left: 1230, top: 300, width: 590 }}>
            <Card label="这个数据上的读数" accent={C.violet}>
              <Row name="xi" value={fmtF(M.spot.xi, 3)} note="尾指数，负值" width={550} />
              <Row name="beta" value={fmtF(M.spot.beta, 4)} note="尺度" width={550} />
              <Row name="u" value={fmtF(M.spot.u, 4)} note="尾部门槛" width={550} />
              <Row name="风险率 r" value={M.spot.risk} note={"q = " + M.spot.q} width={550} />
              <Row name="tau" value={fmtF(M.taus.spot, 4)} width={550} />
            </Card>
            <Card label="防御" accent={C.amber} style={{ marginTop: 18 }}>
              <Body size={FT.body} color={C.ink}>
                尾部点不足 50 个，SPOT 自动退回分位数。不是近似，是明确的失败路径。
              </Body>
            </Card>
          </div>
        </AbsoluteFill>

        {/* 页三：手算例子 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 300, width: 1050 }}>
            <Card label="验证 · 四个数，纸上一分钟">
              <Row name="数据" value="[1, 2, 3, 4]" width={1000} />
              <Row name="0.25 分位" value={fmtF(M.golden.quantile025Tau, 4)} note="线性插值：1 + 0.25·(4−1)" width={1000} />
              <Row name="判据输出" value={M.golden.quantile025Pred} note="严格大于 1.75" width={1000} />
              <Row name="q = 0" value={M.golden.quantile0Pred} note="τ 取最小值，只有最小点正常" width={1000} />
              <Row name="q = 1" value={M.golden.quantile1Pred} note="τ 取最大值，没有点超过" width={1000} />
              <Row name="正例数" value={M.golden.qCount + " 个"} note={"理论值 " + M.golden.qExpect + "，差不到一个点"} width={1000} />
              <Row name="小样本 SPOT" value={fmtF(M.golden.smallSpotTau, 3)} note="尾部不足，退回分位" width={1000} />
            </Card>
          </div>
          <div style={{ position: "absolute", left: 1180, top: 300, width: 650 }}>
            <Card label="第三条判据的性格" accent={C.violet}>
              <Body size={FT.body} color={C.ink}>
                固定阈值是人的经验。分位数是数据的形状。SPOT 是风险的定义 —— 风险率给多少，阈值算多少。
              </Body>
              <Body size={FT.meta} color={C.inkFaint} style={{ marginTop: 16 }}>
                三种切法都能算 F1。能不能赢，取决于尾部长什么样。
              </Body>
            </Card>
            <Card label="判据实现" accent={C.cyan} style={{ marginTop: 18 }}>
              <CodeBlock
                width={600}
                lines={[
                  { t: "applyThreshold :: Threshold -> Double -> Bool" },
                  { t: "applyThreshold (FixedThreshold t) x = x > t", hi: true },
                  { t: "-- 严格大于；等于阈值算正常", dim: true },
                ]}
              />
            </Card>
          </div>
        </AbsoluteFill>
      </Pages>
    </Scene>
  );
};
