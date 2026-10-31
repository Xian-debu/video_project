import React from "react";
import { C, FONT, FT } from "../../design/tokens";
import { Body, CW, Card, Chip, Head, K, PAD, Pages } from "../shared";

const P1: React.FC = () => (
  <>
    <Head kicker="08 / 收尾" title="把四个选择带走" goal="滑窗、切分、指标、选模" />
    <div style={{ position: "absolute", left: PAD, top: 340, width: CW, display: "flex", gap: 24 }}>
      <Card label="滑窗" accent={C.cyan} style={{ height: 280 }}>
        <Body size={FT.h2} color={C.ink}>3,761 个窗口</Body>
        <Body size={FT.body} style={{ marginTop: 14 }}>
          一行公式，两个不变量：按索引滑，边界留空。
        </Body>
      </Card>
      <Card label="指标" accent={C.violet} style={{ height: 280 }}>
        <Body size={FT.h2} color={C.ink}>四个指标，两种量纲</Body>
        <Body size={FT.body} style={{ marginTop: 14 }}>
          绝对量跟价格走，相对量不跟。零值处三个答案。
        </Body>
      </Card>
      <Card label="选模" accent={C.amber} style={{ height: 280 }}>
        <Body size={FT.h2} color={C.ink}>验证集选，测试集报</Body>
        <Body size={FT.body} style={{ marginTop: 14 }}>
          测试集只碰一次；早停恢复最优权重。
        </Body>
      </Card>
    </div>
    <div style={{ position: "absolute", left: PAD, top: 700, width: CW }}>
      <Body size={FT.lead} color={C.ink}>
        指标带立场，切分带防线，选模在验证，报数在测试。
      </Body>
    </div>
  </>
);

const P2: React.FC = () => (
  <>
    <Head kicker="08 / 收尾" title="下一集，从一条到多条" goal="多变量预测" />
    <div style={{ position: "absolute", left: PAD, top: 360, width: CW }}>
      <Card label="下一站" accent={C.violet} style={{ height: 300 }}>
        <Body size={FT.h2} color={C.ink}>单变量到多变量。</Body>
        <Body size={FT.h2} color={C.ink}>输入从一根线变成一张表。</Body>
        <Body size={FT.body} style={{ marginTop: 18 }}>
          通道独立还是通道依赖，是下一集的核心选择。
          口径还要再写一遍：样本形状、切分、指标、选模，一个都不能少。
        </Body>
        <div style={{ marginTop: 16 }}><Chip color={C.violet}>下一集 · 多变量预测</Chip></div>
      </Card>
    </div>
    <div style={{ position: "absolute", left: PAD, top: 740, width: CW }}>
      <Body size={FT.lead} color={C.ink}>
        数字、代码、证据，都在仓库里。
      </Body>
      <div style={{ marginTop: 10 }}>
        <K>ts-base 2229df0 · ts-admin 5e63b2f · pack 本地</K>
      </div>
    </div>
  </>
);

export const SOutro: React.FC = () => (
  <Pages id="outro" at={[0, 6 / 9]}>
    <P1 />
    <P2 />
  </Pages>
);
