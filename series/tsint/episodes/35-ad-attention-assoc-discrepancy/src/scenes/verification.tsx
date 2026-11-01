import React from "react";
import { AbsoluteFill } from "remotion";
import { C, FONT, FT } from "../../design/tokens";
import { PAD, M, U, prOf, curveOf, pageAt, Pages, Scene, SceneHead, Card, Row, Body, PRPlot, Bars, Stat, Verdict, Chip, K, unitColor, unitName, checksLike } from "../shared";

export const SVerification: React.FC = () => {
  const at = [0, pageAt("verification", 12), pageAt("verification", 24), pageAt("verification", 36), pageAt("verification", 48), pageAt("verification", 58)];
  const a = U("assoc");
  const s = U("sat");
  const t = U("tranad");
  return (
    <Scene id="verification">
      <SceneHead id="verification" />
      <Pages id="verification" at={at}>
        {/* 页一：数据与注入 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 292, width: 900 }}>
            <Card label="数据" accent={C.cyan}>
              <Row name="两票交集" value={M.data.rows + " 行"} note={M.data.start + " 至 " + M.data.end} width={850} />
              <Row name="长缺口" value={M.data.maxGap.days + " 天"} note={M.data.gapNote} width={850} />
              <Row name="训练 / 测试" value={M.windows.train + " / " + M.windows.test + " 窗"} note={"窗长 " + M.windows.C + " 天，步长 1"} width={850} />
              <Row name="sha256" value={M.data.sha} note="数据文件逐字节锁死" width={850} />
            </Card>
          </div>
          <div style={{ position: "absolute", left: 1010, top: 292, width: 840 }}>
            <Card label="同一套注入，三个单元共用" accent={C.amber}>
              <Row name="尖峰 ①" value={M.inject.spike.amp} note={"长 " + M.inject.spike.len + "，位置 " + M.inject.spike.pos} width={790} />
              <Row name="形状 ③" value={M.inject.shape.len} note={"取自 " + M.inject.shape.src} width={790} />
              <Row name="各 10 窗" value={"种子 " + M.inject.seed} note="窗与窗不重叠" width={790} />
              <Row name="真值" value={M.inject.truthRuns + " 段 / " + M.inject.truthPts + " 点"} note={"占测试窗 " + M.inject.ratePct.toFixed(3) + "%"} width={790} color={C.cyan} />
            </Card>
          </div>
          <div style={{ position: "absolute", left: PAD, top: 812, width: 1776 }}>
            <Verdict ok label={"原始真值 " + M.inject.rawLen + " 点，去重后 " + M.inject.truthPts + " 点 —— 屏幕上只用去重后的口径"} />
          </div>
        </AbsoluteFill>

        {/* 页二：关联差异 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 288, width: 1000 }}>
            <Stat label={unitName.assoc} value={a.f1.toFixed(4)} sub={"F1 · 阈值 " + a.tau.toFixed(2)} accent={C.cyan} />
            <Card label="同一套真值上的取舍" accent={C.cyan} style={{ marginTop: 18 }}>
              <Row name="精度 / 召回" value={a.precision.toFixed(4) + " / " + a.recall.toFixed(4)} note={"TP " + a.tp + "  FP " + a.fp + "  FN " + a.fn} width={950} />
              <Row name="命中段" value={a.detected + " / " + M.inject.truthRuns} note="一段里命中一次就算" width={950} />
              <Row name="告警率" value={a.alertPct.toFixed(2) + "%"} note="测试点里被判异常的比例" width={950} />
              <Row name="平均精度" value={a.ap.toFixed(4)} note="不需要调阈值" width={950} color={C.cyan} />
              <Row name="分类型命中" value={M.byKind.assoc.spike.hit + " / " + M.byKind.assoc.shape.hit} note={"原始点级：尖峰 " + M.byKind.assoc.spike.n + " 点、形状 " + M.byKind.assoc.shape.n + " 点"} width={950} />
            </Card>
          </div>
          <div style={{ position: "absolute", left: 1110, top: 292, width: 730 }}>
            <Card label="精度-召回曲线" accent={C.cyan}>
              <PRPlot width={690} height={470} series={[{ name: "关联差异", color: C.cyan, pts: prOf(curveOf("assoc")) }]} />
            </Card>
          </div>
        </AbsoluteFill>

        {/* 页三：次邻域 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 288, width: 1000 }}>
            <Stat label={unitName.sat} value={s.f1.toFixed(4)} sub={"F1 · 阈值 " + s.tau.toExponential(2)} accent={C.amber} />
            <Card label="最全，也最吵" accent={C.amber} style={{ marginTop: 18 }}>
              <Row name="精度 / 召回" value={s.precision.toFixed(4) + " / " + s.recall.toFixed(4)} note={"TP " + s.tp + "  FP " + s.fp + "  FN " + s.fn} width={950} />
              <Row name="命中段" value={s.detected + " / " + M.inject.truthRuns} note="几乎不漏段" width={950} />
              <Row name="告警率" value={s.alertPct.toFixed(2) + "%"} note={"另外两个是 " + a.alertPct.toFixed(2) + "% 和 " + t.alertPct.toFixed(2) + "%"} width={950} color={C.amber} />
              <Row name="平均精度" value={s.ap.toFixed(4)} note="曲线整体抬不高" width={950} />
              <Row name="分类型命中" value={M.byKind.sat.spike.hit + " / " + M.byKind.sat.shape.hit} note={"形状点命中 " + M.byKind.sat.shape.hit + " / " + M.byKind.sat.shape.n} width={950} />
            </Card>
          </div>
          <div style={{ position: "absolute", left: 1110, top: 292, width: 730 }}>
            <Card label="精度-召回曲线" accent={C.amber}>
              <PRPlot width={690} height={470} series={[{ name: "次邻域遮罩", color: C.amber, pts: prOf(curveOf("sat")) }]} />
            </Card>
          </div>
        </AbsoluteFill>

        {/* 页四：两阶段 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 288, width: 1000 }}>
            <Stat label={unitName.tranad} value={t.f1.toFixed(4)} sub={"F1 · 阈值 " + t.tau.toFixed(2)} accent={C.violet} />
            <Card label="召回满分，代价是误报" accent={C.violet} style={{ marginTop: 18 }}>
              <Row name="精度 / 召回" value={t.precision.toFixed(4) + " / " + t.recall.toFixed(4)} note={"TP " + t.tp + "  FP " + t.fp + "  FN " + t.fn} width={950} />
              <Row name="命中段" value={t.detected + " / " + M.inject.truthRuns} note="14 段一段不漏" width={950} />
              <Row name="告警率" value={t.alertPct.toFixed(2) + "%"} note="比次邻域克制得多" width={950} />
              <Row name="平均精度" value={t.ap.toFixed(4)} note="三者最高" width={950} color={C.violet} />
              <Row name="真值点分数" value={"中位 " + M.stats.tranad.truthMedian.toFixed(1) + " / 最大 " + Math.round(M.stats.tranad.truthMax).toLocaleString("en-US")} note="顶部爆发极强" width={950} />
            </Card>
          </div>
          <div style={{ position: "absolute", left: 1110, top: 292, width: 730 }}>
            <Card label="精度-召回曲线" accent={C.violet}>
              <PRPlot width={690} height={470} series={[{ name: "两阶段焦点", color: C.violet, pts: prOf(curveOf("tranad")) }]} />
            </Card>
          </div>
        </AbsoluteFill>

        {/* 页五：三条曲线叠一起 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 292, width: 1060 }}>
            <Card label="同一套注入，三条曲线" accent={C.cyan}>
              <PRPlot
                width={1010}
                height={520}
                series={[
                  { name: "关联差异", color: C.cyan, pts: prOf(curveOf("assoc")) },
                  { name: "次邻域遮罩", color: C.amber, pts: prOf(curveOf("sat")), dash: true },
                  { name: "两阶段焦点", color: C.violet, pts: prOf(curveOf("tranad")) },
                ]}
              />
            </Card>
          </div>
          <div style={{ position: "absolute", left: 1180, top: 292, width: 670 }}>
            <Card label="读数" accent={C.amber}>
              <Row name="F1 最高" value="关联差异" note={a.f1.toFixed(4)} width={620} color={C.cyan} />
              <Row name="AP 最高" value="两阶段焦点" note={t.ap.toFixed(4)} width={620} color={C.violet} />
              <Row name="召回最高" value="两阶段焦点" note={"1.0000，14/14 段"} width={620} />
              <Row name="最克制" value="关联差异" note={"告警 " + a.alertPct.toFixed(2) + "%"} width={620} />
            </Card>
            <Body style={{ marginTop: 18, width: 640 }}>
              没有全面的赢家。要准、零训练，选关联差异；要一段不漏，选两阶段；要两个参数就能上，选次邻域遮罩 —— 代价是告警率三成四。
            </Body>
          </div>
        </AbsoluteFill>

        {/* 页六：检查清单与失败记录 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 292, width: 900 }}>
            <Card label="34 项检查按组" accent={C.cyan}>
              <Bars
                width={860}
                rowH={54}
                items={M.groups.map((g) => ({ label: g.label, value: g.n, text: String(g.n) }))}
              />
            </Card>
          </div>
          <div style={{ position: "absolute", left: 1010, top: 292, width: 840 }}>
            <Card label="路上踩到的三个坑" accent={C.coral}>
              <Row name="温度用错尺度" value="F1 0.0000" note="拿 σ 当注意力温度，整行压平，带子消失" width={790} color={C.coral} />
              <Row name="焦点漏反传" value="梯度 1.9e-2" note="f 依赖 x1，那一项没算进去" width={790} color={C.coral} />
              <Row name="损失曲线倒序" value="误判发散" note="把升序当降序读，差点改坏模型" width={790} color={C.coral} />
            </Card>
            <Card label="现状" accent={C.cyan} style={{ marginTop: 18 }}>
              <Row name="检查" value={M.meta.checks} note="一次跑完，全部通过" width={790} color={C.cyan} />
              <Row name="复现" value="一条命令" note="tsbase 子命令 + 固定种子" width={790} />
            </Card>
          </div>
        </AbsoluteFill>
      </Pages>
    </Scene>
  );
};
