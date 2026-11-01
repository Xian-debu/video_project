import React from "react";
import { AbsoluteFill } from "remotion";
import { C, FONT, FT } from "../../design/tokens";
import { PAD, M, U, pagesOf, Pages, Scene, SceneHead, Card, Row, Body, K, Formula, Verdict, Stat, Bars, groupOf, unitColor } from "../shared";

export const SVerification: React.FC = () => {
  const at = pagesOf("verification");
  return (
    <Scene id="verification">
      <SceneHead id="verification" />
      <Pages id="verification" at={at}>
        {/* 页一：口径 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 282, width: 830 }}>
            <div style={{ fontFamily: FONT.serif, fontSize: FT.h2, color: C.ink }}>先对口径，再读数</div>
            <Body style={{ marginTop: 18, width: 790 }}>
              一只票、日频、复权收盘。两个模型吃同一段测试、同一套真值；阈值都取训练段九十九分位，测试段一个数都不进阈值。
              停牌对照二百四十天，不参与调参。
            </Body>
            <div style={{ marginTop: 22 }}>
              <Verdict ok label="训练 / 测试不交叉" />
            </div>
          </div>
          <div style={{ position: "absolute", left: 950, top: 282, width: 900 }}>
            <Card label="实验口径" accent={C.cyan} pad={24}>
              <Row name="标的" value="600519.SH" note="贵州茅台，前复权收盘" />
              <Row name="训练 / 测试" value={"2667 / " + M.data.test} note={"测试 " + M.data.testStart + " 起"} />
              <Row name="模型" value="ARIMA(0,0,2) · MP(100,25)" note="各自在训练段定阈值" />
              <Row name="阈值" value="训练段 99 分位" note="两个模型同一条规则" />
              <Row name="真值" value={String(M.inject.truthPoints) + " 点"} note={"占测试段 " + M.inject.truthPct.toFixed(1) + "%"} color={C.coral} />
            </Card>
          </div>
        </AbsoluteFill>

        {/* 页二：ARIMA 读数 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 278, width: 900 }}>
            <Stat label="ARIMA(0,0,2) · F1" value={M.arima.f1.toFixed(4)} sub={"精确率 " + M.arima.p.toFixed(3) + " · 召回 " + M.arima.r.toFixed(3)} accent={unitColor.arima} valueColor={unitColor.arima} valueSize={64} />
            <div style={{ marginTop: 20 }}>
              <Row name="AIC" value={M.arima.aic.toFixed(3)} note="网格里最小" />
              <Row name="σ̂" value={M.arima.sigma.toFixed(8)} note="训练残差标准差" />
              <Row name="c" value={M.arima.c.toFixed(8)} note="漂移几乎为零" />
              <Row name="θ₁ / θ₂" value="0.014715 / −0.036615" note="移动平均两项" />
              <Row name="τ" value={M.arima.tau.toFixed(6)} note="训练分数 99 分位" color={C.coral} />
            </div>
          </div>
          <div style={{ position: "absolute", left: 1000, top: 282, width: 860 }}>
            <Card label="逐点读数" accent={unitColor.arima} pad={24}>
              <Row name="TP / FP / FN" value={M.arima.tp + " / " + M.arima.fp + " / " + M.arima.fn} note="命中 43，误报 2，漏 618" />
              <Row name="报警天数" value={String(M.arima.alerts)} note={"占测试段 " + M.arima.alertPct.toFixed(2) + "%"} />
              <Row name="干净日中位" value={M.arima.cleanMed.toFixed(4)} note="阈值以下" />
              <Row name="停牌段报警" value={String(M.arima.flatAlerts)} note="停牌分数最高 0.068" color={C.cyan} />
              <Row name="点调整 F1" value={M.arima.f1PointAdj.toFixed(4)} note="宽口径，只做对照" color={C.coral} />
            </Card>
          </div>
        </AbsoluteFill>

        {/* 页三：MP 读数 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 278, width: 900 }}>
            <Stat label="Matrix Profile · F1" value={M.mp.f1.toFixed(4)} sub={"精确率 0 · 召回 0 · 报警 " + M.mp.alerts} accent={unitColor.mp} valueColor={unitColor.mp} valueSize={64} />
            <div style={{ marginTop: 20 }}>
              <Row name="窗口 / 排除区" value={M.mp.m + " / " + M.mp.excl} note="窗口 100 点，四分之一排除" />
              <Row name="τ" value={M.mp.tau.toFixed(6)} note="训练段 99 分位" color={C.coral} />
              <Row name="评估段最大" value="11.0171" note="差 0.38 没过线" color={C.coral} />
              <Row name="干净日中位" value={M.mp.cleanMed.toFixed(4)} note="距离底噪不低" />
              <Row name="常数窗口" value={String(M.mp.zeroWindows)} note="240 − 100 + 1" />
            </div>
          </div>
          <div style={{ position: "absolute", left: 1000, top: 282, width: 860 }}>
            <Card label="两个口径" accent={unitColor.mp} pad={24}>
              <Row name="严格口径" value={String(M.mp.flatAlertsStrict) + " 天"} note="常数段距离 = +∞" color={C.coral} />
              <Row name="宽松口径" value={String(M.mp.flatAlertsLimit) + " 天"} note="+∞ 改 0" color={C.inkFaint} />
              <Row name="评估段报警" value={String(M.mp.alerts)} note="一次都没有" />
              <Row name="TP / FP / FN" value={"0 / 0 / " + M.mp.fn} note="661 个真值全漏" />
            </Card>
            <Body style={{ marginTop: 20 }}>
              MP 不是「算错」，是「阈值贴得太近」：训练分布的尾部把阈值顶到 11.40，测试段最大只到 11.02。
            </Body>
          </div>
        </AbsoluteFill>

        {/* 页四：ARIMA 为什么只抓点 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 282, width: 900 }}>
            <div style={{ fontFamily: FONT.serif, fontSize: FT.h2, color: C.ink }}>三种真值，三种分数</div>
            <div style={{ marginTop: 22 }}>
              <Bars width={820} items={[
                { label: "尖峰点", value: M.kind.spikeMedArima, text: M.kind.spikeMedArima.toFixed(3), color: C.coral },
                { label: "相位点", value: M.kind.phaseMedArima, text: M.kind.phaseMedArima.toFixed(3), color: C.amber },
                { label: "干净点", value: M.arima.cleanMed, text: M.arima.cleanMed.toFixed(3), color: C.inkFaint },
              ]} unit="中位分数 · 阈值 3.064" max={8} />
            </div>
            <div style={{ marginTop: 22 }}>
              <Verdict ok={false} label="相位点只比干净点高一点" />
            </div>
          </div>
          <div style={{ position: "absolute", left: 1000, top: 282, width: 860 }}>
            <Body>
              重排一个六十点窗口，不改边际分布：均值、方差、直方图都一样。
              ARIMA 的残差看的是相邻两天的关系，重排之后只有接缝处的两个点变了，其余五十八个点原封不动。
              所以召回只有百分之六点五，里面还有三个是接缝。
            </Body>
            <div style={{ marginTop: 22 }}>
              <Row name="尖峰点命中" value="40 / 40" note="全部抓住" color={C.cyan} />
              <Row name="相位点命中" value={"3 / " + M.kind.phasePoints} note="只有接缝" color={C.coral} />
              <Row name="误报" value="2 天" note="干净段上的两次波动" />
            </div>
          </div>
        </AbsoluteFill>

        {/* 页五：MP 为什么也只抓点 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 282, width: 900 }}>
            <div style={{ fontFamily: FONT.serif, fontSize: FT.h2, color: C.ink }}>窗口比相位段还长</div>
            <div style={{ marginTop: 22 }}>
              <Bars width={820} items={[
                { label: "尖峰点", value: M.kind.spikeMedMp, text: M.kind.spikeMedMp.toFixed(3), color: C.coral },
                { label: "相位点", value: M.kind.phaseMedMp, text: M.kind.phaseMedMp.toFixed(3), color: C.amber },
                { label: "干净点", value: M.mp.cleanMed, text: M.mp.cleanMed.toFixed(3), color: C.inkFaint },
              ]} unit="中位距离 · 阈值 11.40" max={10} />
            </div>
            <div style={{ marginTop: 22 }}>
              <Verdict ok={false} label="三类分不开，阈值一划全在下面" />
            </div>
          </div>
          <div style={{ position: "absolute", left: 1000, top: 282, width: 860 }}>
            <Body>
              窗口一百，比相位的六十五点段还长。一个窗口横跨整个相位段，前后两半被平均成同一个形状，邻居照样找得到。
              前五名 discord 里两个在热身段、三个是真实行情的重复结构，没有一个是注入点。
            </Body>
            <div style={{ marginTop: 20 }}>
              {M.mp.discords.map((d) => (
                <Row key={d.start + ""} name={"discord " + d.start} value={d.dist.toFixed(4)} note={d.start < 100 ? "热身，样本不足" : "行情结构"} color={d.start < 100 ? C.inkFaint : C.violet} />
              ))}
            </div>
          </div>
        </AbsoluteFill>

        {/* 页六：停牌与检查 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 276, width: 860 }}>
            <div style={{ fontFamily: FONT.serif, fontSize: FT.h2, color: C.ink }}>四十九项，全过</div>
            <div style={{ marginTop: 18, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              {M.groups.map((g) => (
                <div key={g.g} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <Verdict ok={g.pass === g.total} label={g.g} />
                  <span style={{ fontFamily: FONT.mono, fontSize: FT.meta, color: C.inkDim }}>{g.pass} / {g.total}</span>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 20 }}>
              <Row name="运行时间" value={M.meta.evidence.seconds.toFixed(1) + " 秒"} note="一次跑完，无随机" />
              <Row name="模块测试" value={M.meta.tests.suites + " 套 / " + M.meta.tests.assertions + " 断言"} note="仓库合计" />
              <Row name="本集新增" value={M.meta.tests.newCases + " 条"} note="两个模块，十八个案例" />
            </div>
          </div>
          <div style={{ position: "absolute", left: 980, top: 276, width: 880 }}>
            <Card label="三条负向断言" accent={C.amber} pad={24}>
              <Row name="ACF 超出白噪声带" value={M.diag.acf1.toFixed(3) + " > " + M.diag.acfBand.toFixed(3)} note="真实收益有自相关，不是 bug" color={C.amber} />
              <Row name="仿射不变（有限距离）" value={"最大差 " + M.diag.invMax.toExponential(1)} note="常数段受前缀和消去影响，不计入" />
              <Row name="F1 不许满分" value="两个都 < 1" note="严口径 0.122 与 0.000" />
            </Card>
            <Body style={{ marginTop: 18 }}>
              这三条不是装饰：没有它们，一张全绿的检查表可能只是检查写松了。
            </Body>
          </div>
        </AbsoluteFill>
      </Pages>
    </Scene>
  );
};
