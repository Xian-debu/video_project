import React from "react";
import { C, FONT, FT } from "../../design/tokens";
import { Body, CW, Card, Chip, Head, K, M, PAD, Pages, Row, Stat, fmtF } from "../shared";

const P1: React.FC = () => (
  <>
    <Head kicker="07 / 边界" title="三条边界" goal="归一化不是万灵药" />
    <div style={{ position: "absolute", left: PAD, top: 350, width: CW, display: "flex", gap: 22 }}>
      <Card label="一 · 不创造信息" accent={C.cyan} style={{ flex: 1, height: 330 }}>
        <Body size={FT.h2} color={C.ink}>减掉基准，</Body>
        <Body size={FT.h2} color={C.ink}>也减掉了一部分信号。</Body>
        <Body size={FT.body} style={{ marginTop: 16 }}>
          成交量上两种归一化只差百分之一：没有漂移，就没有可省的差。
        </Body>
      </Card>
      <Card label="二 · 单变量线性" accent={C.violet} style={{ flex: 1, height: 330 }}>
        <Body size={FT.h2} color={C.ink}>四十八进，二十四出，</Body>
        <Body size={FT.h2} color={C.ink}>没有非线性。</Body>
        <Body size={FT.body} style={{ marginTop: 16 }}>
          结论只在这个容量下成立。换成 MLP 或加协变量，排序要重跑。
        </Body>
      </Card>
      <Card label="三 · 轮数有限" accent={C.amber} style={{ flex: 1, height: 330 }}>
        <Body size={FT.h2} color={C.ink}>四十轮不是收敛保证。</Body>
        <Body size={FT.h2} color={C.ink}>只是这份数据够用。</Body>
        <Body size={FT.body} style={{ marginTop: 16 }}>
          早停耐心八轮，最优点在第二十一轮出现；换数据要重新看曲线。
        </Body>
      </Card>
    </div>
    <div style={{ position: "absolute", left: PAD, top: 740, width: CW }}>
      <Body size={FT.lead} color={C.ink}>
        三条边界都不是论文的错，是读数的边界：别把一次排序当成定论。
      </Body>
    </div>
  </>
);

const P2: React.FC = () => (
  <>
    <Head kicker="07 / 边界" title="两处口径偏差" goal="简报与代码对不上，按代码记" />
    <div style={{ position: "absolute", left: PAD, top: 340, width: 980 }}>
      <Row name="简报手算 · NowNorm" value="4 → 1" color={C.coral} note="(1−3)·1+3 = 1，不是 4" />
      <Row name="简报量纲 · 茅台 / 工行" value="320× → 658.7×" color={C.coral} note="未复权口径换成后复权" />
      <Row name="加回的是什么" value="输入窗的 base" color={C.violet} note="不是预测段的、不是归一化后的零" />
      <Row name="反变换用什么" value="保存的 μ、σ" color={C.amber} note="重算就不是同一次变换" />
      <div style={{ marginTop: 34 }}>
        <Body size={FT.lead} color={C.ink}>
          两处偏差都写进自授条目：A39 记手算，A41 记量纲。
        </Body>
      </div>
    </div>
    <div style={{ position: "absolute", left: PAD + 1020, top: 340, width: CW - 1020, display: "flex", flexDirection: "column", gap: 16 }}>
      <Stat label="A39 · 手算" value="1.000000" accent={C.coral} style={{ height: 150 }} sub={<span>断言按定义写</span>} />
      <Stat label="A41 · 量纲" value={fmtF(M.data.levelRatio, 1) + "×"} accent={C.amber} style={{ height: 150 }} sub={<span>后复权读数</span>} />
    </div>
  </>
);

const P3: React.FC = () => (
  <>
    <Head kicker="07 / 边界" title="五条不做" goal="边界清单" />
    <div style={{ position: "absolute", left: PAD, top: 340, width: CW }}>
      <Row name="一 · 不做多变量" value="单通道" color={C.inkDim} note="协变量留给后面的集" />
      <Row name="二 · 不做非线性" value="只有线性层" color={C.inkDim} note="模型容量不在这一集" />
      <Row name="三 · 不做多种子" value="种子 7" color={C.inkDim} note="排序不报显著性" />
      <Row name="四 · 不做超参搜索" value="一套配置" color={C.inkDim} note="基准差不是调参调出来的" />
      <Row name="五 · 不拿测试集调归一化" value="只看验证集" color={C.inkDim} note="测试集碰两次就废" />
      <div style={{ marginTop: 40 }}>
        <Body size={FT.lead} color={C.ink}>
          还有一条，诚实说：这一集证明了 base 会改变排序，没证明哪个 base 永远最好。
        </Body>
        <div style={{ marginTop: 14, display: "flex", gap: 10 }}>
          <Chip color={C.cyan}>A38</Chip>
          <Chip color={C.violet}>A39</Chip>
          <Chip color={C.amber}>A40</Chip>
          <Chip color={C.coral}>A41</Chip>
          <Chip color={C.inkDim}>E33</Chip>
        </div>
      </div>
    </div>
  </>
);

export const SBoundary: React.FC = () => (
  <Pages id="boundary" at={[0, 0.332, 0.656]}>
    <P1 />
    <P2 />
    <P3 />
  </Pages>
);
