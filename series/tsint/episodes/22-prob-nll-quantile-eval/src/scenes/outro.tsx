import React from "react";
import { C, FONT, FT } from "../../design/tokens";
import { Body, CW, Card, Chip, Head, K, KV, M, PAD, Pages, Row, pageAt } from "../shared";

const P1: React.FC = () => (
  <>
    <Head kicker="08 / 收尾" title="三句话带走" goal="一个损失一句" />
    <div style={{ position: "absolute", left: PAD, top: 350, width: CW }}>
      <Card label="三句话" accent={C.cyan} style={{ height: 360 }}>
        <KV k="高斯 NLL" v="学均值和尺度，别忘了 ½log 2π" color={C.cyan} size={FT.body} />
        <KV k="分位数损失" v="不对称；τ=0.9 时低估罚 9 倍" color={C.amber} size={FT.body} />
        <KV k="QL 指标" v="书版无系数 2；τ=0.5 是半个 MAE" color={C.violet} size={FT.body} />
        <Body size={FT.body} color={C.inkDim} style={{ marginTop: 16 }}>
          三个式子都不难，难的是每一处口径都写清楚、算对、留证。
        </Body>
      </Card>
    </div>
    <div style={{ position: "absolute", left: PAD, top: 760, width: CW }}>
      <Body size={FT.lead} color={C.ink}>损失函数是概率预测的入口。</Body>
    </div>
  </>
);

const P2: React.FC = () => (
  <>
    <Head kicker="08 / 收尾" title="下一集：CRPS" goal="把整个分布拿来打分" />
    <div style={{ position: "absolute", left: PAD, top: 350, width: 1060 }}>
      <Card label="下一集要回答的问题" accent={C.violet} style={{ height: 340 }}>
        <Body size={FT.body} color={C.ink}>一个分布怎么和单个观测比？</Body>
        <Body size={FT.body} color={C.inkDim} style={{ marginTop: 12 }}>
          CRPS 把预测分布和真值之间的差积分成一个数，不需要先离散成几个分位数。
        </Body>
        <K style={{ display: "block", marginTop: 12 }}>第 23 集 · 评分规则</K>
      </Card>
    </div>
    <div style={{ position: "absolute", left: PAD + 1100, top: 350, width: CW - 1100 }}>
      <Card label="本集的证词" accent={C.amber} style={{ height: 340 }}>
        <Body size={FT.body} color={C.ink}>验证只能证明实现和定义一致，不能证明模型有用。</Body>
        <Body size={FT.body} color={C.ink} style={{ marginTop: 12 }}>书里的式子和 brief 的数字，都要逐条对过才敢用。</Body>
        <div style={{ marginTop: 14 }}><Chip color={C.cyan}>第 22 集完</Chip></div>
      </Card>
    </div>
  </>
);

export const SOutro: React.FC = () => (
  <Pages id="outro" at={[0, pageAt("outro", 8)]}>
    <P1 />
    <P2 />
  </Pages>
);
