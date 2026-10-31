import React from "react";
import { C, FONT, FT } from "../../design/tokens";
import { Body, Card, CW, Formula, FT as FTs, Head, K, PAD, Pages, Row } from "../shared";

const P1: React.FC = () => (
  <>
    <Head kicker="08 / 收尾" title="缺失值的补法，取决于缺失的样子" goal="随机看邻居，整段更是只有邻居" />
    <div style={{ position: "absolute", left: PAD, top: 380, width: CW }}>
      <div style={{ fontFamily: FONT.sans, fontSize: 56, color: C.ink, lineHeight: 1.5 }}>
        随机缺失，看邻居。
      </div>
      <div style={{ fontFamily: FONT.sans, fontSize: 56, color: C.ink, lineHeight: 1.5, marginTop: 8 }}>
        整段缺失，邻居是唯一还有信号的。
      </div>
      <div style={{ marginTop: 44 }}>
        <Card label="下一集：相关性与 STL 分解" accent={C.cyan} style={{ height: 190 }}>
          <Body size={FT.lead} color={C.ink}>从补格子，转到拆结构。</Body>
          <Body size={FT.body} style={{ marginTop: 12 }}>
            补完的矩阵要能被读：谁和谁一起动，趋势和季节各自多少。
          </Body>
        </Card>
      </div>
    </div>
  </>
);

const P2: React.FC = () => (
  <>
    <Head kicker="08 / 收尾" title="四个数回扣" goal="这一集的全部证据" />
    <div style={{ position: "absolute", left: PAD, top: 320, width: CW }}>
      <Card label="四个数回扣" accent={C.cyan} style={{ height: 420 }}>
        <Row name="随机掩码 · 最近邻 / 低秩" value="0.0193 / 0.0261" note="低秩比列均值还差" color={C.cyan} />
        <Row name="块状缺失 · 相关系数" value="0.00 / 0.329" note="低秩在预测零" color={C.coral} />
        <Row name="合成秩三 · 低秩误差" value="4.93 × 10⁻⁹" note="相差八个数量级" color={C.violet} />
        <Row name="前五个奇异值占比" value="41.4%" note="这张表本来就不低秩" color={C.amber} />
      </Card>
      <Body size={FT.meta} style={{ marginTop: 22, color: C.inkFaint }}>
        五十九组、八百八十条断言全绿；二十四个证据检查零失败。
      </Body>
    </div>
  </>
);

export const SOutro: React.FC = () => (
  <Pages id="outro" at={[0, 0.52]}>
    <P1 />
    <P2 />
  </Pages>
);
