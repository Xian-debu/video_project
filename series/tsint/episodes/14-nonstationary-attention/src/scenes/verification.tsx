import React from "react";
import { C, FONT, FT } from "../../design/tokens";
import {
  Body, CW, Card, Chip, Head, K, M, Pages, PAD, Row, Stat, Verdict, fmtF,
} from "../shared";

const P1: React.FC = () => (
  <>
    <Head kicker="06 / 验证" title="六条判决，二十一项检查" goal="三条桥接 + 三项梯度取证" />
    <div style={{ position: "absolute", left: PAD, top: 340, width: CW }}>
      <Card label="判决表" accent={C.cyan} style={{ height: 560 }}>
        <Row name="τ=1、Δ=0 对标准注意力" value={M.verdicts.tau1_std_maxdiff.toFixed(2)} note="逐位相等" color={C.cyan} />
        <Row name="τ=2 对温度 0.5" value={M.verdicts.tau2_temp_maxdiff.toFixed(2)} note="逐位相等" color={C.cyan} />
        <Row name="按行偏置真的加进 logits" value={M.verdicts.row_raw_maxdiff.toExponential(2).replace("e", "e")} note="与标准注意力只差舍入" color={C.inkDim} />
        <Row name="按行偏置的有限差分" value={M.verdicts.row_grad_max.toFixed(2)} note="恰为零 —— 不可辨识" color={C.coral} />
        <Row name="按列偏置梯度最大分量" value={M.verdicts.column_grad_max.toFixed(4)} note="有符号、逐列不同" color={C.cyan} />
        <Row name="按列梯度之和" value={"1.36e−09"} note="零和，噪声量级" color={C.inkDim} />
        <div style={{ marginTop: 20, display: "flex", gap: 16, alignItems: "center" }}>
          <Verdict ok label="21 项 / 0 失败" />
          <Chip color={C.cyan}>4 数据 + 7 结构 + 10 行为</Chip>
        </div>
      </Card>
    </div>
  </>
);

const P2: React.FC = () => (
  <>
    <Head kicker="06 / 验证" title="合成数据：机制确实存在" goal="2000 条序列，方差 1→10" />
    <div style={{ position: "absolute", left: PAD, top: 340, width: CW, display: "flex", gap: 24 }}>
      <Stat label="注意力熵 · 标准" value={fmtF(M.synthetic.entropy_std, 4)} accent={C.cyan} style={{ flex: 1, height: 290 }}
        sub={<span>均匀是 4.094。3.307 说明分布已经偏尖。</span>} />
      <Stat label="注意力熵 · τ = 2" value={fmtF(M.synthetic.entropy_tau2, 4)} accent={C.violet} style={{ flex: 1, height: 290 }}
        sub={<span>温度减半，熵掉了 0.74。</span>} />
      <Stat label="score 的离散度" value={fmtF(M.synthetic.score_spread, 4)} accent={C.amber} style={{ flex: 1, height: 290 }}
        sub={<span>晚段内积的跨度是早段的数倍。</span>} />
    </div>
    <div style={{ position: "absolute", left: PAD, top: 690, width: 1000 }}>
      <Card label="三段质量" accent={C.coral} style={{ height: 210 }}>
        <Row name="早段 key" value={fmtF(M.synthetic.early_mass, 4)} color={C.cyan} />
        <Row name="中段 key" value={fmtF(M.synthetic.mid_mass, 4)} color={C.cyanDeep} />
        <Row name="晚段 key" value={fmtF(M.synthetic.late_mass, 4)} color={C.coral} />
      </Card>
    </div>
    <div style={{ position: "absolute", left: 1130, top: 690, width: 700 }}>
      <Card label="Δ 探针 · a = +2" accent={C.violet} style={{ height: 210 }}>
        <Row name="熵" value={fmtF(M.synthetic.probe_entropy, 4)} note="几乎和标准一样" color={C.inkDim} />
        <Row name="早段质量" value={fmtF(M.synthetic.probe_early_mass, 4)} note="从 0.208 抬到 0.599" color={C.cyan} />
        <Row name="晚段质量" value={fmtF(M.synthetic.probe_late_mass, 4)} note="从 0.482 压到 0.134" color={C.coral} />
      </Card>
    </div>
    <div style={{ position: "absolute", left: PAD, top: 930, width: CW }}>
      <Body size={FT.body} color={C.inkDim}>
        偏置没有改变熵的总量级，只是把质量从末尾搬到开头 —— 这就是「位置偏置」四个字的含义。
      </Body>
    </div>
  </>
);

const P3: React.FC = () => (
  <>
    <Head kicker="06 / 验证" title="真实数据：一个诚实的「没有」" goal="60 只 × 60 个交易日，2025-10-09 → 2025-12-31" />
    <div style={{ position: "absolute", left: PAD, top: 340, width: CW, display: "flex", gap: 24 }}>
      <Stat label="注意力熵" value={fmtF(M.real.entropy, 4)} accent={C.amber} style={{ flex: 1, height: 260 }}
        sub={<span>比合成更接近均匀，本身就更平。</span>} />
      <Stat label="三段最大差" value={fmtF(M.real.third_spread, 4)} accent={C.cyan} style={{ flex: 1, height: 260 }}
        sub={<span>早 34.99 / 中 33.65 / 晚 31.36。</span>} />
      <Stat label="Δ 探针 · 熵变化" value={fmtF(M.real.probe_entropy_delta, 4)} accent={C.coral} style={{ flex: 1, height: 260 }}
        sub={<span>a=+2 把熵压掉 0.47，是加偏，不是纠偏。</span>} />
    </div>
    <div style={{ position: "absolute", left: PAD, top: 660, width: 1030 }}>
      <Card label="结论" accent={C.coral} style={{ height: 280 }}>
        <Body size={FT.h2} color={C.ink}>真实窗口里没有可纠的位置偏置。</Body>
        <Body size={FT.body} style={{ marginTop: 12 }}>
          这不是「Δ 没用」。这是「这份数据没有那个问题」。要证明收益，得训完整 NSformer，看测试集预测误差 —— 那是后面的集。
        </Body>
      </Card>
    </div>
    <div style={{ position: "absolute", left: 1160, top: 660, width: 670 }}>
      <Card label="探针数字" accent={C.amber} style={{ height: 280 }}>
        <Row name="标准熵" value={fmtF(M.real.entropy, 4)} color={C.amber} />
        <Row name="a=+2 熵" value={fmtF(M.real.probe_entropy, 4)} color={C.coral} />
        <Row name="a=+2 早段" value={fmtF(M.real.probe_early_mass, 4)} note="0.350 → 0.735" color={C.cyan} />
        <Row name="a=+2 晚段" value={fmtF(M.real.probe_late_mass, 4)} note="0.314 → 0.059" color={C.coral} />
      </Card>
    </div>
  </>
);

export const SVerification: React.FC = () => (
  <Pages id="verification" at={[0, 0.3, 0.62]}>
    <P1 />
    <P2 />
    <P3 />
  </Pages>
);
