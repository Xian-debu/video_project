import React from "react";
import { C, FONT, FT } from "../../design/tokens";
import { Body, Card, CW, Head, K, M, PAD, Pages, Verdict, fmtF } from "../shared";

const P1: React.FC = () => (
  <>
    <Head kicker="08 / 收尾" title="记住两组数" goal="一集两个对照" />
    <div style={{ position: "absolute", left: PAD, top: 340, width: CW, display: "flex", gap: 26 }}>
      <Card label="一 · 读数" accent={C.cyan} style={{ flex: 1, height: 300 }}>
        <div style={{ fontFamily: FONT.mono, fontSize: FT.h2, color: C.ink }}>Corr = mean + 1/(1+var)</div>
        <Body size={FT.body} style={{ marginTop: 16 }}>
          报读数要同时报方差。方差差一个量级，读数只动 0.15。
        </Body>
      </Card>
      <Card label="二 · 强度" accent={C.coral} style={{ flex: 1, height: 300 }}>
        <div style={{ fontFamily: FONT.mono, fontSize: FT.h2, color: C.ink }}>0.1596 vs 0.0083</div>
        <Body size={FT.body} style={{ marginTop: 16 }}>
          报强度要同时报方法。同一个定义，LOESS 残差和移动平均残差差十九倍。
        </Body>
      </Card>
      <Card label="三 · 口径" accent={C.violet} style={{ flex: 1, height: 300 }}>
        <div style={{ fontFamily: FONT.mono, fontSize: FT.h2, color: C.ink }}>A33 / A34</div>
        <Body size={FT.body} style={{ marginTop: 16 }}>
          书里没写的四条口径，本仓全部写死，用测试守住边界，再用证据包钉住数字。
        </Body>
      </Card>
    </div>
  </>
);

const P2: React.FC = () => (
  <>
    <Head kicker="08 / 收尾" title="下一站" goal="趋势有了，强度就跟着来" />
    <div style={{ position: "absolute", left: PAD, top: 340, width: CW }}>
      <Card label="本章继续" accent={C.cyan} style={{ height: 360 }}>
        <Body size={FT.h2} color={C.ink}>
          这一集只碰了式(2.2) 和式(2.4)。第 2 章的读数是一个家族：
          相关、季节强度、趋势强度，句式一样，分母不同。
        </Body>
        <Body size={FT.body} style={{ marginTop: 18 }}>
          下一个读数：趋势强度。同样是 var(R) 换分母 —— 这次换的是季节项还留不留。
        </Body>
        <div style={{ display: "flex", gap: 26, marginTop: 22 }}>
          <Verdict ok label="22 / 22 checks" />
          <K>ts-base 61 suites / 917 断言</K>
          <K>E16 · {fmtF(M.readings.price.score, 4)}</K>
        </div>
      </Card>
    </div>
  </>
);

export const SOutro: React.FC = () => (
  <Pages id="outro" at={[0, 6 / 8]}>
    <P1 />
    <P2 />
  </Pages>
);
