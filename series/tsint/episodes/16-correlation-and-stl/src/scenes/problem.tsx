import React from "react";
import { C, FONT, FT } from "../../design/tokens";
import { Body, Card, Chip, CW, Formula, Head, K, M, PAD, Pages, Row, fmtF } from "../shared";

const P1: React.FC = () => (
  <>
    <Head kicker="02 / 问题" title="两个问题，同一个毛病" goal="读数里谁在动，分解给的是什么" />
    <div style={{ position: "absolute", left: PAD, top: 336, width: 780 }}>
      <Card label="书中原文 · p.13" accent={C.cyan} style={{ height: 400 }}>
        <Formula size={40}>Corr = mean(p) + 1 / (1 + var(p))</Formula>
        <Body size={FT.body} style={{ marginTop: 20 }}>
          「相关性可以通过计算所有变量对之间的皮尔逊相关系数的均值和方差得到。」
          书里就这一句，没有别的。
        </Body>
        <div style={{ marginTop: 18 }}><Chip color={C.cyan}>式(2.4)</Chip></div>
      </Card>
    </div>
    <div style={{ position: "absolute", left: PAD + 810, top: 336, width: CW - 810 }}>
      <Card label="公式没回答的四件事" accent={C.coral} style={{ height: 400 }}>
        <Row name="缺失值怎么处理" value="没说" note="配对完整，还是删整行？" width={CW - 880} />
        <Row name="方差是总体还是样本" value="没说" note="除以 K，还是 K−1？" width={CW - 880} />
        <Row name="常数序列怎么办" value="没说" note="方差为零，相关系数无定义" width={CW - 880} />
        <Row name="变量对怎么数" value="没说" note="对称的两半算不算两次？" width={CW - 880} />
      </Card>
    </div>
    <div style={{ position: "absolute", left: PAD, top: 790, width: CW }}>
      <Body size={FT.lead} color={C.ink}>
        四个选择，每一个都能让读数动。本仓全部写死，记在自授条目 A 三十三。
      </Body>
    </div>
  </>
);

const P2: React.FC = () => (
  <>
    <Head kicker="02 / 问题" title="读数只有两项" goal="平均项 + 饱和项" />
    <div style={{ position: "absolute", left: PAD, top: 350, width: CW, display: "flex", gap: 26 }}>
      <Card label="第一项 · mean(p)" accent={C.cyan} style={{ flex: 1, height: 340 }}>
        <div style={{ fontFamily: FONT.mono, fontSize: FT.num, color: C.ink }}>
          {fmtF(M.readings.price.mean, 4)} / {fmtF(M.readings.returns.mean, 4)}
        </div>
        <Body size={FT.body} style={{ marginTop: 16 }}>
          所有配对相关的算术平均。价格面板和收益面板差 0.023，
          这一项本来能区分两个面板。
        </Body>
      </Card>
      <Card label="第二项 · 1/(1+var)" accent={C.amber} style={{ flex: 1, height: 340 }}>
        <div style={{ fontFamily: FONT.mono, fontSize: FT.num, color: C.ink }}>
          {fmtF(1 / (1 + M.readings.price.var), 4)} / {fmtF(1 / (1 + M.readings.returns.var), 4)}
        </div>
        <Body size={FT.body} style={{ marginTop: 16 }}>
          方差从 {fmtF(M.readings.price.var, 4)} 掉到 {fmtF(M.readings.returns.var, 4)}，
          这一项只从 0.855 走到 0.983。它是一个饱和项。
        </Body>
      </Card>
    </div>
    <div style={{ position: "absolute", left: PAD, top: 750, width: CW }}>
      <Card label="两项相加" accent={C.violet} style={{ height: 190 }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 30 }}>
          <span style={{ fontFamily: FONT.mono, fontSize: FT.h1, color: C.cyan }}>{fmtF(M.readings.price.score, 4)}</span>
          <K>价格面板：0.2132 + 0.8551</K>
          <span style={{ width: 40 }} />
          <span style={{ fontFamily: FONT.mono, fontSize: FT.h1, color: C.violet }}>{fmtF(M.readings.returns.score, 4)}</span>
          <K>收益面板：0.2361 + 0.9826</K>
        </div>
        <Body size={FT.body} style={{ marginTop: 12 }}>
          方差差 9.6 倍，读数只差 0.15。读数的分辨率不在方差上。
        </Body>
      </Card>
    </div>
  </>
);

const P3: React.FC = () => (
  <>
    <Head kicker="02 / 问题" title="季节强度也是相对量" goal="式(2.2) 的句式，换方法就换分母" />
    <div style={{ position: "absolute", left: PAD, top: 340, width: 820 }}>
      <Card label="式(2.2) 的句式" accent={C.violet} style={{ height: 350 }}>
        <Formula size={46} color={C.violet}>S = max(0, 1 − var(R) / var(S+R))</Formula>
        <Body size={FT.body} style={{ marginTop: 20 }}>
          分子是季节，分母是季节加残差。这个式子里唯一的自由度，是残差怎么来。
        </Body>
      </Card>
    </div>
    <div style={{ position: "absolute", left: PAD + 850, top: 340, width: CW - 850 }}>
      <Card label="两个分母" accent={C.coral} style={{ height: 350 }}>
        <Body size={FT.body} color={C.ink}>
          STL：残差是「趋势 LOESS 和相位 LOESS 都没拿走的」。
        </Body>
        <Body size={FT.body} color={C.ink} style={{ marginTop: 14 }}>
          经典分解：残差是「中心化移动平均和相位均值都没拿走的」。
        </Body>
        <Body size={FT.meta} color={C.inkFaint} style={{ marginTop: 16 }}>
          LOESS 的窗更宽、更光滑，能拿走更多低频结构，残差更小，强度更大。
        </Body>
      </Card>
    </div>
    <div style={{ position: "absolute", left: PAD, top: 750, width: CW }}>
      <Body size={FT.lead} color={C.ink}>
        茅台：STL 0.1596，经典分解 0.0083。同一个定义，差十九倍。
      </Body>
      <Body size={FT.body} color={C.inkDim} style={{ marginTop: 10 }}>
        所以「季节强度」不是数据的属性，是数据加方法的属性。
      </Body>
    </div>
  </>
);

export const SProblem: React.FC = () => (
  <Pages id="problem" at={[0, 0.42, 0.74]}>
    <P1 />
    <P2 />
    <P3 />
  </Pages>
);
