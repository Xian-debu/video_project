import React from "react";
import { AbsoluteFill } from "remotion";
import { C, FONT, FT } from "../../design/tokens";
import { PAD, M, pagesOf, Pages, Scene, SceneHead, Card, Body, K, Formula, Verdict, Stat, Row, LinePlot, Bars, unitColor, Strip } from "../shared";

export const SIntuition: React.FC = () => {
  const at = pagesOf("intuition");
  return (
    <Scene id="intuition">
      <SceneHead id="intuition" />
      <Pages id="intuition" at={at}>
        {/* 页一：ARIMA 分数轨迹 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 276, width: 1000 }}>
            <LinePlot
              series={[{ values: M.series.arimaScore, color: C.cyan, name: "ARIMA 残差分数" }]}
              width={980}
              height={420}
              from={100}
              title="测试段逐日分数（前 100 天热身不计）"
              hlines={[{ v: M.arima.tau, color: C.coral, label: "τ = " + M.arima.tau.toFixed(2) }]}
              legend={false}
            />
          </div>
          <div style={{ position: "absolute", left: 1080, top: 282, width: 780 }}>
            <Stat label="报警" value={String(M.arima.alerts)} sub={"占测试段 " + M.arima.alertPct.toFixed(2) + "%"} valueColor={C.cyan} />
            <div style={{ marginTop: 16 }}>
              <Row name="干净日中位" value={M.arima.cleanMed.toFixed(4)} note="阈值以下，大部分点在这里" />
              <Row name="最高分" value="10.37" note="约三倍于阈值" color={C.coral} />
              <Row name="精确率 / 召回" value="0.956 / 0.065" note="报警几乎都是真的，但一万个真值只报出几百个" />
            </div>
            <Body style={{ marginTop: 22 }}>
              它抓住的是「这一天跳了一下」。连续几天的相位变化，残差看不出来。
            </Body>
          </div>
        </AbsoluteFill>

        {/* 页二：MP 分数与前五名 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 276, width: 1000 }}>
            <LinePlot
              series={[{ values: M.series.mpScore, color: C.violet, name: "Matrix Profile 最近邻距离" }]}
              width={980}
              height={420}
              from={100}
              title="测试段逐日距离（取覆盖该点的最小 profile）"
              hlines={[{ v: M.mp.tau, color: C.coral, label: "τ = " + M.mp.tau.toFixed(2) }]}
              legend={false}
            />
          </div>
          <div style={{ position: "absolute", left: 1080, top: 282, width: 780 }}>
            <Stat label="评估段最大值" value="11.02" sub={"阈值 " + M.mp.tau.toFixed(2) + "，差 0.38"} valueColor={C.violet} />
            <div style={{ marginTop: 18 }}>
              <K>前五名 discord（位置 · 距离）</K>
              <div style={{ marginTop: 10 }}>
                {M.mp.discords.map((d) => (
                  <Row key={d.start + ""} name={"第 " + d.start + " 点"} value={d.dist.toFixed(4)} note={d.start < 100 ? "热身段，样本不足" : "真实行情的重复结构"} color={d.start < 100 ? C.inkFaint : C.violet} />
                ))}
              </div>
            </div>
          </div>
        </AbsoluteFill>

        {/* 页三：停牌对照 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 282, width: 880 }}>
            <div style={{ fontFamily: FONT.serif, fontSize: FT.h2, color: C.ink }}>二百四十天停牌</div>
            <Body style={{ marginTop: 18, width: 840 }}>
              收益置零，价格走成一条直线。ARIMA 的残差在这里恒为零，分数还是零，一天都不报警。
              Matrix Profile 的常数段距离是无穷：严格口径报四十二天，把无穷当零的宽松口径报零天。
            </Body>
            <div style={{ marginTop: 22, display: "flex", gap: 14 }}>
              <Verdict ok label="ARIMA 静默" />
              <Verdict ok={false} label="MP 严格口径爆炸" />
            </div>
            <div style={{ marginTop: 30 }}>
              <Strip idx={[]} total={M.data.test} width={840} height={18} color={C.inkFaint} flat={{ start: M.inject.flatStart, len: M.inject.flatLen, color: C.amber }} />
              <div style={{ marginTop: 10, fontFamily: FONT.mono, fontSize: FT.meta, color: C.inkFaint }}>
                琥珀：停牌 240 天 · 常值窗口 141 个
              </div>
            </div>
          </div>
          <div style={{ position: "absolute", left: 1000, top: 286, width: 860 }}>
            <Card label="同一段横线，两种极端" accent={C.amber} pad={24}>
              <Row name="ARIMA 分数最高" value={M.arima.flatMaxScore.toFixed(4)} note="阈值 3.064，差五十倍" color={C.cyan} />
              <Row name="ARIMA 报警" value={String(M.arima.flatAlerts) + " 天"} note="残差恒零，方法静默" color={C.cyan} />
              <Row name="MP 严格口径" value={String(M.mp.flatAlertsStrict) + " 天"} note="无穷大于任何阈值" color={C.coral} />
              <Row name="MP 宽松口径" value={String(M.mp.flatAlertsLimit) + " 天"} note="无穷改零，又完全看不见" color={C.inkFaint} />
            </Card>
          </div>
        </AbsoluteFill>
      </Pages>
    </Scene>
  );
};
