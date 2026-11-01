import React from "react";
import { C, FT } from "../../design/tokens";
import { Body, CW, Card, Chip, Head, K, PAD, Pages, Row, pageAt } from "../shared";

const P1: React.FC = () => (
  <>
    <Head kicker="08 / 收尾" title="三句话带走" goal="一件套一句" />
    <div style={{ position: "absolute", left: PAD, top: 370, width: CW }}>
      <Card accent={C.cyan} style={{ height: 360 }} pad={28}>
        <Row name="多头自注意力" value="软查表，四路并行" color={C.cyan} />
        <Row name="Transformer 块" value="残差加深，归一化稳住" color={C.violet} />
        <Row name="因果掩码" value="把未来从打分里删掉" color={C.coral} />
        <Body size={FT.lead} style={{ marginTop: 20 }}>三件事都不难，难的是每一处都有人对着验。</Body>
      </Card>
    </div>
  </>
);

const P2: React.FC = () => (
  <>
    <Head kicker="08 / 收尾" title="下一集：概率与损失" goal="从机制转到评分" />
    <div style={{ position: "absolute", left: PAD, top: 350, width: 900 }}>
      <Card label="下一集要回答的问题" accent={C.cyan} style={{ height: 380 }}>
        <Body size={FT.h2} color={C.cyan}>负对数似然怎么算，分位数与 CRPS 怎么定义。</Body>
        <Body size={FT.body} style={{ marginTop: 16 }}>
          这一集的注意力只混合信息；下一集要给它一个「打分」的出口。
        </Body>
        <K style={{ display: "block", marginTop: 14 }}>第 22 集 · 概率与损失</K>
      </Card>
    </div>
    <div style={{ position: "absolute", left: PAD + 940, top: 350, width: CW - 940 }}>
      <Card label="本集的证词" accent={C.violet} style={{ height: 380 }}>
        <Body size={FT.body} color={C.ink}>自洽的测试救不了错的实现。</Body>
        <Body size={FT.body} color={C.ink} style={{ marginTop: 12 }}>证据要跨层对：前向、求导、整体流程互相照。</Body>
        <Chip color={C.cyan}>下集见</Chip>
      </Card>
    </div>
  </>
);

export const SOutro: React.FC = () => (
  <Pages id="outro" at={[0, pageAt("outro", 5)]}>
    <P1 />
    <P2 />
  </Pages>
);
