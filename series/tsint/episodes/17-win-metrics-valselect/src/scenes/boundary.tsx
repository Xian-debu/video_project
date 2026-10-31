import React from "react";
import { C, FONT, FT } from "../../design/tokens";
import { Body, CW, Card, Chip, Head, K, PAD, Pages, Row } from "../shared";

const P1: React.FC = () => (
  <>
    <Head kicker="07 / 边界" title="两条边界，先说清楚" goal="一个线性层，一条序列" />
    <div style={{ position: "absolute", left: PAD, top: 340, width: CW, display: "flex", gap: 26 }}>
      <Card label="模型容量" accent={C.coral} style={{ height: 320 }}>
        <Body size={FT.h2} color={C.ink}>一个线性层，</Body>
        <Body size={FT.h2} color={C.ink}>没有非线性，没有多变量。</Body>
        <Body size={FT.body} style={{ marginTop: 18 }}>
          共享权重 H 到 F，参数 8×4+4 等于 36。选它是因为有解析梯度、能跑中心差分门。
          这一集讲口径，不讲模型容量。
        </Body>
      </Card>
      <Card label="数据范围" accent={C.cyan} style={{ height: 320 }}>
        <Body size={FT.h2} color={C.ink}>单票，单序列，日频。</Body>
        <Body size={FT.h2} color={C.ink}>不能外推。</Body>
        <Body size={FT.body} style={{ marginTop: 18 }}>
          茅台后复权 3,880 个交易日。结论只在这个频率、这个口径下成立；
          换票、换频率、换复权方式，都要重跑。
        </Body>
      </Card>
    </div>
    <div style={{ position: "absolute", left: PAD, top: 720, width: CW }}>
      <Body size={FT.lead} color={C.ink}>
        边界不是免责声明，是写清楚哪些话这个实验支持。
      </Body>
    </div>
  </>
);

const P2: React.FC = () => (
  <>
    <Head kicker="07 / 边界" title="一处参数，一处读数" goal="offset 不是 gap；Inf 不是读数" />
    <div style={{ position: "absolute", left: PAD, top: 340, width: CW, display: "flex", gap: 26 }}>
      <Card label="参数口径" accent={C.amber} style={{ height: 340 }}>
        <Row name="第 4 个参数" value="offset" note="分段起点，不是间隙" color={C.amber} width={CW / 2 - 70} />
        <Row name="gap 归谁" value="chronoSplit" note="切分边界的事，不归滑窗" color={C.cyan} width={CW / 2 - 70} />
        <Row name="简报" value="混成一个" note="这里分开，记 A35" color={C.coral} width={CW / 2 - 70} />
        <Body size={FT.body} style={{ marginTop: 16 }}>
          混着用的后果：窗口数看着对，切分边界悄悄漏数据。
        </Body>
      </Card>
      <Card label="读数口径" accent={C.coral} style={{ height: 340 }}>
        <Row name="MAPE 默认" value="Infinity" note="照书直除的结果" color={C.coral} width={CW / 2 - 70} />
        <Row name="报数前提" value="看 metMapeCount" note="参与计算的项数" color={C.cyan} width={CW / 2 - 70} />
        <Row name="三种策略" value="不可混报" note="Inf、25%、3.33e9" color={C.violet} width={CW / 2 - 70} />
        <Body size={FT.body} style={{ marginTop: 16 }}>
          无穷大不是可用读数。报之前先看计数，或者显式换策略。
        </Body>
      </Card>
    </div>
    <div style={{ position: "absolute", left: PAD, top: 740, width: CW }}>
      <Body size={FT.lead} color={C.ink}>
        两处都不影响公式推导，只影响数字。偏偏数字是这一集的主角。
      </Body>
    </div>
  </>
);

const P3: React.FC = () => (
  <>
    <Head kicker="07 / 边界" title="五条不做" goal="边界清单" />
    <div style={{ position: "absolute", left: PAD, top: 340, width: CW }}>
      <Row name="一 · 不做非线性" value="只有线性层" note="模型容量不在这一集" color={C.coral} width={CW} />
      <Row name="二 · 不做多变量" value="N = 1" note="通道方向留给下一集" color={C.coral} width={CW} />
      <Row name="三 · 不拿测试集选模" value="只用验证集" note="测试集碰两次就废" color={C.amber} width={CW} />
      <Row name="四 · 不外推别的频率" value="日频单票" note="分钟线、组合都要重跑" color={C.amber} width={CW} />
      <Row name="五 · 不把 Inf 当读数" value="先看计数" note="或显式换跳过的策略" color={C.violet} width={CW} />
    </div>
    <div style={{ position: "absolute", left: PAD, top: 700, width: CW }}>
      <Body size={FT.lead} color={C.ink}>
        还有一条，诚实说：二十一轮收敛，不代表调好了，只代表这个口径下够用。
      </Body>
      <div style={{ marginTop: 14 }}>
        <Chip color={C.amber}>A35 / A36 / A37</Chip>
      </div>
    </div>
  </>
);

export const SBoundary: React.FC = () => (
  <Pages id="boundary" at={[0, 7 / 21, 13 / 21]}>
    <P1 />
    <P2 />
    <P3 />
  </Pages>
);
