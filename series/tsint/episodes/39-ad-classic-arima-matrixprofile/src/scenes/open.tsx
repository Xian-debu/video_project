import React from "react";
import { AbsoluteFill } from "remotion";
import { C, FONT, FT } from "../../design/tokens";
import { PAD, M, U, pagesOf, Pages, Scene, SceneHead, Card, Row, Body, Verdict, Chip, K, Stat, Formula, Strip, unitName, unitColor, fmtInt } from "../shared";

export const SOpen: React.FC = () => {
  const at = pagesOf("open");
  return (
    <Scene id="open">
      <SceneHead id="open" />
      <Pages id="open" at={at}>
        {/* 页一：两个基线，两张成绩单 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 300, width: 880 }}>
            <div style={{ fontFamily: FONT.serif, fontSize: FT.display, color: C.ink, lineHeight: 1.18 }}>
              残差与邻居，
              <br />
              两个基线。
            </div>
            <Body style={{ marginTop: 26, width: 840 }}>
              上一集把十二只票画成一张图，结构学到了，读数没接上。这一集退回去，只看书里最朴素的两句话：
              模型解释不了的当异常，找不到邻居的当异常。验证下来两个都不好看，但失败的方式完全不同。
            </Body>
            <div style={{ display: "flex", gap: 14, marginTop: 30 }}>
              <Verdict ok label={M.meta.evidence.total + " 项证据检查通过"} />
              <Chip color={C.violet}>新测试 {M.meta.tests.newCases} 条 · 仓库 {fmtInt(M.meta.tests.assertions)} 条</Chip>
            </div>
          </div>
          <div style={{ position: "absolute", left: 1020, top: 292, width: 830, display: "flex", flexDirection: "column", gap: 20 }}>
            <Card label={unitName.arima} accent={unitColor.arima} pad={20}>
              <Stat label="F1" value={U("arima").f1.toFixed(4)} sub={"P " + U("arima").p.toFixed(3) + " · R " + U("arima").r.toFixed(3) + " · 报警 " + U("arima").alerts + " 天"} valueSize={54} valueColor={unitColor.arima} />
            </Card>
            <Card label={unitName.mp} accent={unitColor.mp} pad={20}>
              <Stat label="F1" value={U("mp").f1.toFixed(4)} sub={"报警 " + U("mp").alerts + " 天 · 最大分数 11.02 < 阈值 11.40"} valueSize={54} valueColor={unitColor.mp} />
            </Card>
          </div>
        </AbsoluteFill>

        {/* 页二：一句定义 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 282, width: 1730, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 26 }}>
            <Card label="式(4.41) 的邻居：残差分数" accent={C.cyan} pad={28}>
              <Formula size={52} color={C.cyan}>
                s<sub>t</sub> = |e<sub>t</sub>| / σ̂
              </Formula>
              <Body style={{ marginTop: 16 }}>e<sub>t</sub> 是 ARIMA 残差，σ̂ 是训练段残差的标准差。分数越大，模型越解释不了这一天。</Body>
              <div style={{ marginTop: 14, fontFamily: FONT.mono, fontSize: FT.meta, color: C.inkFaint }}>书里一句话：用 ARIMA 残差当异常分数。</div>
            </Card>
            <Card label="式(4.42) 的邻居：最近邻距离" accent={C.violet} pad={28}>
              <Formula size={52} color={C.violet}>
                P(i) = min d(i, j)
              </Formula>
              <Body style={{ marginTop: 16 }}>拿一个窗口去全段找最像它的另一段，最近邻越远，这个片段越没有同伴，叫 discord。</Body>
              <div style={{ marginTop: 14, fontFamily: FONT.mono, fontSize: FT.meta, color: C.inkFaint }}>书里一句话：全局最近邻距离，没有公式。</div>
            </Card>
          </div>
          <div style={{ position: "absolute", left: PAD, top: 760, width: 1730 }}>
            <Row name="出处" value="第 4.4.1–4.4.2 节 · p.85" note="两小节合起来不到一页，零个公式；括号里的编号与推导全部由本集补上，标「非书中」。" />
            <Row name="本集主题" value="残差 · 距离 · 停牌" note="两种看不见异常的方式，和一块两个都读不懂的停牌段。" />
          </div>
        </AbsoluteFill>

        {/* 页三：两个读数，一块停牌 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 286, width: 900 }}>
            <Body size={FT.body}>
              测试段一千三百二十八个点，真值六百六十一点。两个基线都对了「点」，都看不见「形」。
              中间二百四十天停牌把两者的边界同时打了出来：一个静默，一个爆炸。
            </Body>
            <div style={{ display: "flex", gap: 18, marginTop: 24 }}>
              <Stat label="测试点" value="1,328" sub={M.series.testStart + " 起"} style={{ width: 260 }} />
              <Stat label="真值点" value="661" sub={"占 " + M.inject.truthPct.toFixed(1) + "%"} accent={C.coral} style={{ width: 260 }} />
              <Stat label="停牌对照" value="240 天" sub={"测试内第 " + M.inject.flatStart + " 点起"} accent={C.amber} style={{ width: 260 }} />
            </div>
            <div style={{ marginTop: 34, fontFamily: FONT.sans, fontSize: FT.meta, color: C.inkFaint }}>
              红色刻度：注入的真值点；琥珀带：收益置零的停牌段。
            </div>
            <div style={{ marginTop: 12 }}>
              <Strip idx={M.series.truthIdx} total={M.series.arimaScore.length} width={1500} height={22} color={C.coral} flat={{ start: M.inject.flatStart, len: M.inject.flatLen, color: C.amber }} />
            </div>
          </div>
          <div style={{ position: "absolute", left: 1300, top: 286, width: 560 }}>
            <Card label="口径警告" accent={C.coral} pad={22}>
              <Stat label="点级调整后的 ARIMA F1" value={U("arima").f1PointAdj.toFixed(4)} sub="一个真值段里报过一次警，整段都算命中；这不是检测能力，是口径。" valueSize={46} valueColor={C.coral} />
            </Card>
            <div style={{ marginTop: 18, fontFamily: FONT.sans, fontSize: FT.body, color: C.inkDim, lineHeight: 1.6 }}>
              本集同时报两个数：严口径才算结论，宽口径只用来对照。
            </div>
          </div>
        </AbsoluteFill>
      </Pages>
    </Scene>
  );
};
