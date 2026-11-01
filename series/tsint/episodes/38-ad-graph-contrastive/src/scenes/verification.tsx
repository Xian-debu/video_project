import React from "react";
import { AbsoluteFill } from "remotion";
import { C, FONT, FT } from "../../design/tokens";
import { PAD, M, U, pagesOf, Pages, Scene, SceneHead, Card, Row, Body, Verdict, Chip, K, Stat, Bars, PairBar, fmtInt, unitName, unitColor, kindOf } from "../shared";

export const SVerification: React.FC = () => {
  const at = pagesOf("verification");
  const ks = kindOf("graph");
  const kf = kindOf("flat");
  return (
    <Scene id="verification">
      <SceneHead id="verification" />
      <Pages id="verification" at={at}>
        {/* 页一：数据与协议 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 288, width: 1010 }}>
            <Card label="数据 · 十二只票，同一段行情" accent={C.cyan}>
              <Row name="对齐后" value={fmtInt(M.data.rows) + " 行"} note={M.data.start + " 至 " + M.data.end} width={960} />
              <Row name="窗口" value={"训练 " + M.windows.train + " · 测试 " + M.windows.test} note={"窗长 " + M.windows.C + " 天，训练取 " + M.windows.trainUsed} width={960} />
              <Row name="注入" value={M.inject.spikeRuns + " + " + M.inject.spreadRuns + " 段"} note={M.inject.truthPts + " 点 / " + M.inject.truthDays + " 日真值"} width={960} />
              <Row name="对照期" value={M.regime.days + " 日"} note={M.regime.start + " 至 " + M.regime.end + "，不注入，只看报警"} width={960} />
            </Card>
            <Card label="口径" accent={C.violet} style={{ marginTop: 20 }}>
              <Row name="打分" value="覆盖点的窗取最大" note="逐日判定，一次不重复" width={960} />
              <Row name="阈值" value="训练段 99 分位" note={"图 " + M.scores.tauG.toFixed(4) + " · 无图 " + M.scores.tauF.toFixed(4)} width={960} />
              <Row name="分数" value="负重构误差" note="越高越异常，与前面同向" width={960} />
            </Card>
          </div>
          <div style={{ position: "absolute", left: 1150, top: 288, width: 700 }}>
            <Body size={FT.lead} color={C.inkDim} style={{ width: 660, lineHeight: 1.7 }}>
              两个模型吃同一批窗、同一套注入、同一条阈值口径。唯一不同的是 W_n 那一项在不在。
            </Body>
            <div style={{ display: "flex", gap: 14, marginTop: 20 }}>
              <Chip color={C.cyan}>训练 2015–2019</Chip>
              <Chip color={C.violet}>测试 2020–2026</Chip>
            </div>
          </div>
        </AbsoluteFill>

        {/* 页二：图读数 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 288, width: 640 }}>
            <Card label={unitName.graph} accent={unitColor.graph} pad={24}>
              <Stat label="F1" value={U("graph").f1.toFixed(4)} sub={"P " + U("graph").p.toFixed(4) + " · R " + U("graph").r.toFixed(4)} valueSize={70} valueColor={unitColor.graph} />
            </Card>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18, marginTop: 18 }}>
              <Card label="真值日" accent={C.cyan} pad={18}><Stat label="召回 1.0" value={String(M.inject.truthDays)} valueSize={40} /></Card>
              <Card label="报警日" accent={C.amber} pad={18}><Stat label="占比" value={U("graph").alertPct.toFixed(2) + "%"} valueSize={40} /></Card>
            </div>
          </div>
          <div style={{ position: "absolute", left: 830, top: 288, width: 1010 }}>
            <Card label="读数细节" accent={C.cyan}>
              <Row name="精确率" value={U("graph").p.toFixed(4)} note="报警里只有不到六个点是真的" width={960} color={C.coral} />
              <Row name="召回率" value={U("graph").r.toFixed(4)} note="没有漏，因为每天都在报警" width={960} />
              <Row name="干净日中位" value={M.scores.cleanMedianGraph.toFixed(3)} note={"高于阈值 " + M.scores.tauG.toFixed(3) + "，所以必然报警"} color={C.coral} width={960} />
              <Row name="阈值" value={M.scores.tauG.toFixed(4)} note="训练段 99 分位" width={960} />
              <Row name="报警日" value={fmtInt(M.scores.alertDays) + " / " + M.windows.test} note={"测试段共 " + M.windows.test + " 天"} width={960} />
            </Card>
            <Body size={FT.meta} color={C.coral} style={{ marginTop: 14, width: 960 }}>
              这不是图的问题，是阈值搬家：训练段的尺子拿到测试段，整套分数都往上抬。
            </Body>
          </div>
        </AbsoluteFill>

        {/* 页三：无图读数 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 288, width: 640 }}>
            <Card label={unitName.flat} accent={unitColor.flat} pad={24}>
              <Stat label="F1" value={U("flat").f1.toFixed(4)} sub={"P " + U("flat").p.toFixed(4) + " · R " + U("flat").r.toFixed(4)} valueSize={70} valueColor={unitColor.flat} />
            </Card>
            <Card label="和图的差" accent={C.coral} style={{ marginTop: 18 }}>
              <Row name="F1 差" value={(U("flat").f1 - U("graph").f1).toExponential(1)} note="浮点噪声量级" width={590} />
              <Row name="报警率" value={U("flat").alertPct.toFixed(4) + "%"} note="两位小数都相同" width={590} />
            </Card>
          </div>
          <div style={{ position: "absolute", left: 830, top: 288, width: 1010 }}>
            <PairBar
              a={{ label: "图 · F1", value: U("graph").f1, text: U("graph").f1.toFixed(4) }}
              b={{ label: "无图 · F1", value: U("flat").f1, text: U("flat").f1.toFixed(4) }}
              width={960}
              max={0.2}
              height={84}
              colorA={C.cyan}
              colorB={C.inkFaint}
            />
            <Body size={FT.body} color={C.inkDim} style={{ marginTop: 22, width: 960, lineHeight: 1.65 }}>
              两个模型对同一个窗口给出的分数不同，但每天都越过阈值。把「超过阈值」当成 1、「不超过」当成 0，两个序列就完全相同——F1、精确率、召回率、报警率，全部逐位相同。
            </Body>
            <Card label="这不是巧合" accent={C.amber} style={{ marginTop: 20 }}>
              <Row name="条件一" value="两个模型都足够响" note="窗误差远高于阈值" width={960} />
              <Row name="条件二" value="阈值在干净分数下面" note="干净中位 1.398 > 0.98" width={960} />
              <Row name="结论" value="读数退化成常数" note="任何模型都会得到同一组数" width={960} />
            </Card>
          </div>
        </AbsoluteFill>

        {/* 页四：按类型 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 288, width: 1010 }}>
            <Card label="按类型分开看 · 图模型" accent={C.cyan}>
              <Row name="尖峰 · 命中" value={ks.spike.det + " / " + M.inject.spikeDays} note={"真值点 " + ks.spike.tp + " 命中，误报 " + fmtInt(ks.spike.fp)} width={960} />
              <Row name="斜坡 · 命中" value={ks.spread.det + " / " + M.inject.spreadDays} note={"真值点 " + ks.spread.tp + " 命中，误报 " + fmtInt(ks.spread.fp)} width={960} />
              <Row name="尖峰 F1" value={ks.spike.f1.toFixed(4)} note="每天都报警，所以 F1 被误报压死" width={960} />
              <Row name="斜坡 F1" value={ks.spread.f1.toFixed(4)} note="斜坡比尖峰略难" width={960} />
            </Card>
          </div>
          <div style={{ position: "absolute", left: 1150, top: 288, width: 700 }}>
            <Card label="两个模型逐项相同" accent={C.coral}>
              <Row name="尖峰 det" value={ks.spike.det + " / " + kf.spike.det} note="图 / 无图" width={640} />
              <Row name="斜坡 det" value={ks.spread.det + " / " + kf.spread.det} note="图 / 无图" width={640} />
              <Row name="尖峰 FP" value={fmtInt(ks.spike.fp) + " / " + fmtInt(kf.spike.fp)} note="图 / 无图" width={640} />
            </Card>
            <Body size={FT.meta} color={C.inkFaint} style={{ marginTop: 14, width: 660 }}>
              连「哪一天报警」都一样。图的分数确实不同，但没有一处跨过阈值的差别。
            </Body>
          </div>
        </AbsoluteFill>

        {/* 页五：阈值与对照 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 288, width: 1010 }}>
            <Card label="阈值没有搬过去" accent={C.coral}>
              <Row name="训练段 99 分位" value={M.scores.tauG.toFixed(4)} note="图模型" width={960} />
              <Row name="测试段干净中位" value={M.scores.cleanMedianGraph.toFixed(3)} note={"比阈值高 " + (M.scores.cleanMedianGraph - M.scores.tauG).toFixed(3)} color={C.coral} width={960} />
              <Row name="测试段报警日" value={fmtInt(M.scores.alertDays)} note={"共 " + M.windows.test + " 天"} width={960} />
            </Card>
            <Card label="对照期 · 2020 年二月至四月" accent={C.amber} style={{ marginTop: 20 }}>
              <Row name="图 · 报警率" value={M.regime.alertGraph.toFixed(1) + "%"} note={"均值 " + M.regime.meanGraph.toFixed(3)} color={C.coral} width={960} />
              <Row name="无图 · 报警率" value={M.regime.alertFlat.toFixed(1) + "%"} note={"均值 " + M.regime.meanFlat.toFixed(3)} width={960} />
            </Card>
          </div>
          <div style={{ position: "absolute", left: 1150, top: 288, width: 700 }}>
            <Body size={FT.lead} color={C.inkDim} style={{ width: 660, lineHeight: 1.7 }}>
              对照期没有注入，真实行情大跌。图模型的分数被放得更大：报警率 100%，无图 74.6%。
            </Body>
            <Body size={FT.body} color={C.coral} style={{ marginTop: 18, width: 660, lineHeight: 1.65 }}>
              图不是没反应，是反应过头了。它把板块同步放大成「每天都异常」。
            </Body>
          </div>
        </AbsoluteFill>

        {/* 页六：检查 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 268, width: 1010 }}>
            <Card label="四十八项检查 · 一次跑完" accent={C.cyan}>
              {M.groups.map((g) => (
                <Row key={g.label} name={g.label} value={g.pass + " / " + g.n} note={g.pass === g.n ? "全过" : "有失败"} width={960} />
              ))}
            </Card>
          </div>
          <div style={{ position: "absolute", left: 1150, top: 268, width: 700 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
              <Card label="检查" accent={C.cyan} pad={18}><Stat label="" value={M.meta.checks} sub="全部通过" valueSize={40} valueColor={C.cyan} /></Card>
              <Card label="用时" accent={C.violet} pad={18}><Stat label="" value={M.meta.elapsedSec.toFixed(1) + " s"} sub="单线程，可重跑" valueSize={40} /></Card>
            </div>
            <Card label="两条负向断言" accent={C.amber} style={{ marginTop: 18 }}>
              <Row name="余弦" value="非对角必须不同" note="写错成 U·U 会让它归零" width={640} />
              <Row name="读数" value="F1 不许满分" note="满分说明口径退化了" width={640} />
            </Card>
            <K style={{ display: "block", marginTop: 14 }}>失败也写进证据，不藏在备注里。</K>
          </div>
        </AbsoluteFill>
      </Pages>
    </Scene>
  );
};

