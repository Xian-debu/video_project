import React from "react";
import { C, FT } from "../../design/tokens";
import { Body, CW, Card, Formula, Head, K, M, Pages, PAD, Row, fmtF } from "../shared";

const P1: React.FC = () => (
  <>
    <Head kicker="08 / 收尾" title="一句话，四个数" goal="下一集：缺失值补全三法" />
    <div style={{ position: "absolute", left: PAD, top: 320, width: CW }}>
      <Formula size={58}>{"τ 是温度，Δ 是偏置，加在行上是幻觉。"}</Formula>
    </div>
    <div style={{ position: "absolute", left: PAD, top: 480, width: CW, display: "flex", gap: 26 }}>
      <Card label="问题一" accent={C.cyan} style={{ flex: 1, height: 250 }}>
        <Body size={FT.h2} color={C.ink}>τ 不是新东西。</Body>
        <Body size={FT.body} style={{ marginTop: 10 }}>等价于温度，逐位相等。</Body>
        <K>τ=2 ≡ temp 0.5</K>
      </Card>
      <Card label="问题二" accent={C.violet} style={{ flex: 1, height: 250 }}>
        <Body size={FT.h2} color={C.ink}>Δ 只能按列加。</Body>
        <Body size={FT.body} style={{ marginTop: 10 }}>按行加被 softmax 吃掉，梯度恰为零。</Body>
        <K>列梯度 0.6094 / 行梯度 0.0</K>
      </Card>
      <Card label="问题三" accent={C.amber} style={{ flex: 1, height: 250 }}>
        <Body size={FT.h2} color={C.ink}>真实数据没有偏置可纠。</Body>
        <Body size={FT.body} style={{ marginTop: 10 }}>三段 35.0 / 33.7 / 31.4，几乎均匀。</Body>
        <K>最大差 {fmtF(M.real.third_spread, 4)}</K>
      </Card>
    </div>
    <div style={{ position: "absolute", left: PAD, top: 770, width: CW }}>
      <Card label="四个数回扣" accent={C.cyan} style={{ height: 200 }}>
        <Row name="合成熵 / τ=2 熵" value={fmtF(M.synthetic.entropy_std, 4) + " / " + fmtF(M.synthetic.entropy_tau2, 4)} note="温度解释掉了 τ" color={C.cyan} />
        <Row name="末段 / 早段质量" value={fmtF(M.synthetic.late_mass, 3) + " / " + fmtF(M.synthetic.early_mass, 3)} note="方差 1→10 的效应" color={C.coral} />
        <Row name="真实三段最大差" value={fmtF(M.real.third_spread, 4)} note="没有可纠的偏置" color={C.amber} />
      </Card>
    </div>
    <div style={{ position: "absolute", left: PAD, top: 985, width: CW }}>
      <Body size={FT.meta} color={C.inkFaint}>
        下一集：缺失值补全三法 —— DTW、低秩、矩阵分解。这一集就到这里。
      </Body>
    </div>
  </>
);

export const SOutro: React.FC = () => (
  <Pages id="outro" at={[0]}>{[<P1 key="p1" />]}</Pages>
);
