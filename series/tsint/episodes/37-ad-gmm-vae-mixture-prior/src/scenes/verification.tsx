import React from "react";
import { AbsoluteFill } from "remotion";
import { C, FONT, FT } from "../../design/tokens";
import { PAD, M, U, pagesOf, Pages, Scene, SceneHead, Card, Row, Body, Stat, PRPlot, prOf, Bars, PairBar, Verdict, Chip, KV, unitName, unitColor } from "../shared";

const names = (): string => M.data.codes.map((c) => M.data.names[c]).join(" · ");

export const SVerification: React.FC = () => {
  const at = pagesOf("verification");
  const p1 = U("prior1");
  const p4 = U("mix4");
  return (
    <Scene id="verification">
      <SceneHead id="verification" />
      <Pages id="verification" at={at}>
        {/* 页一：数据 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 288, width: 1000 }}>
            <Card label="数据 · 八只白酒股" accent={C.cyan}>
              <Row name="标的 · 上" value={names().split(" · ").slice(0, 4).join(" · ")} width={950} />
              <Row name="标的 · 下" value={names().split(" · ").slice(4).join(" · ")} width={950} />
              <Row name="对齐后" value={M.data.rows + " 行"} note={M.data.start + " 至 " + M.data.end} width={950} />
              <Row name="最大间隔" value={M.data.maxGap.days + " 天"} note={M.data.maxGap.pair + "，整段缺数据"} color={C.coral} width={950} />
              <Row name="窗长 / 步长" value={M.windows.C + " 天 / 1"} note="窗内跨度超过 20 天就丢" width={950} />
            </Card>
            <Card label="样本与注入" accent={C.violet} style={{ marginTop: 18 }}>
              <Row name="训练 / 测试窗" value={M.windows.train + " / " + M.windows.test} note={"训练段每 " + M.windows.trainStride + " 个取一个，用了 " + M.windows.trainUsed + " 窗"} width={950} />
              <Row name="注入" value={"10 尖峰 + 10 斜坡"} note={"点级真值 " + M.inject.truthPts + " 个点，种子 " + M.inject.seed} width={950} />
              <Row name="对照" value={M.regime.start + " 至 " + M.regime.end} note="不注入，只做状态切换对照" width={950} />
            </Card>
          </div>
          <div style={{ position: "absolute", left: 1160, top: 288, width: 680 }}>
            <Body size={FT.lead} color={C.inkDim} style={{ width: 650, lineHeight: 1.7 }}>
              两个模型吃同一套窗、同一套真值，只有先验不同。这样才能说「换先验」带来了什么。
            </Body>
            <Card label="口径" accent={C.amber} style={{ marginTop: 24 }}>
              <Row name="打分" value="覆盖点的窗取最大" note="逐日判定" width={620} />
              <Row name="阈值" value="训练段 99 分位" note="测试段一个数不进" width={620} />
              <Row name="分数" value="负混合对数密度" note="两段式；均值路径" width={620} />
            </Card>
          </div>
        </AbsoluteFill>

        {/* 页二：单高斯先验的读数 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 288, width: 940 }}>
            <PRPlot
              width={920}
              height={520}
              series={[{ name: unitName.prior1, color: C.cyan, pts: prOf(M.curves.prior1) }]}
              op={[{ r: p1.recall, p: p1.precision, color: C.cyan, label: "τ " + p1.tau.toFixed(2) }]}
              title="单高斯先验 · 精确率 / 召回"
            />
          </div>
          <div style={{ position: "absolute", left: 1080, top: 288, width: 780 }}>
            <div style={{ display: "flex", gap: 26 }}>
              <Stat label="F1" value={p1.f1.toFixed(4)} sub="点调整口径" valueSize={62} valueColor={C.cyan} />
              <Stat label="τ" value={p1.tau.toFixed(2)} sub="训练段 99 分位" valueSize={44} />
            </div>
            <Card label="读数" accent={C.cyan} style={{ marginTop: 22 }}>
              <Row name="精确率 / 召回" value={p1.precision.toFixed(4) + " / " + p1.recall.toFixed(4)} note={"TP " + p1.tp + " · FP " + p1.fp + " · FN " + p1.fn} width={720} />
              <Row name="命中段数" value={p1.detected + " / " + M.inject.perKind * 2} note="二十段抓到七段" width={720} />
              <Row name="报警率" value={p1.alertPct.toFixed(2) + "%"} note={"干净点中位 " + M.stats.prior1.cleanMedian.toFixed(2)} width={720} />
              <Row name="平均精度" value={p1.ap.toFixed(4)} note="曲线贴着左下角" width={720} />
            </Card>
            <Body size={FT.meta} color={C.inkFaint} style={{ marginTop: 14, width: 720 }}>
              它只抓离原点远的点。这就是上一集 VAE 的同一个分数，换了先验才能比较。
            </Body>
          </div>
        </AbsoluteFill>

        {/* 页三：混合先验的读数 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 288, width: 940 }}>
            <PRPlot
              width={920}
              height={520}
              series={[{ name: unitName.mix4, color: C.violet, pts: prOf(M.curves.mix4) }]}
              op={[{ r: p4.recall, p: p4.precision, color: C.violet, label: "τ " + p4.tau.toFixed(2) }]}
              title="混合先验 · 精确率 / 召回"
            />
          </div>
          <div style={{ position: "absolute", left: 1080, top: 288, width: 780 }}>
            <div style={{ display: "flex", gap: 26 }}>
              <Stat label="F1" value={p4.f1.toFixed(4)} sub="只比单高斯高 0.016" valueSize={62} valueColor={C.violet} />
              <Stat label="τ" value={p4.tau.toFixed(2)} sub="从 14.35 掉下来" valueSize={44} />
            </div>
            <Card label="读数" accent={C.violet} style={{ marginTop: 22 }}>
              <Row name="精确率 / 召回" value={p4.precision.toFixed(4) + " / " + p4.recall.toFixed(4)} note={"TP " + p4.tp + " · FP " + p4.fp + " · FN " + p4.fn} width={720} />
              <Row name="命中段数" value={p4.detected + " / " + M.inject.perKind * 2} note="二十段抓到十八段" width={720} />
              <Row name="报警率" value={p4.alertPct.toFixed(2) + "%"} note={"干净点中位 " + M.stats.mix4.cleanMedian.toFixed(2)} width={720} />
              <Row name="平均精度" value={p4.ap.toFixed(4)} note="反而更低" width={720} />
            </Card>
            <Body size={FT.meta} color={C.coral} style={{ marginTop: 14, width: 720 }}>
              召回是买来的，代价是几乎每一段都报警。分数整体变低，训练段的尺子在新数据上更松。
            </Body>
          </div>
        </AbsoluteFill>

        {/* 页四：按类型分开 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 288, width: 1020 }}>
            <Card label="按类型分开看 · 命中点数" accent={C.amber}>
              <Row name="尖峰 · 单高斯" value={M.byKind.prior1.spike.hit + " / " + M.byKind.prior1.spike.n} note="二十二个点" color={C.cyan} width={970} />
              <Row name="尖峰 · 混合" value={M.byKind.mix4.spike.hit + " / " + M.byKind.mix4.spike.n} note="几乎全中" color={C.violet} width={970} />
              <Row name="斜坡 · 单高斯" value={M.byKind.prior1.drift.hit + " / " + M.byKind.prior1.drift.n} note="二百四十四个点" color={C.cyan} width={970} />
              <Row name="斜坡 · 混合" value={M.byKind.mix4.drift.hit + " / " + M.byKind.mix4.drift.n} note="命中大涨，误报也堆在这类窗" color={C.violet} width={970} />
            </Card>
            <Body style={{ marginTop: 20, width: 970 }}>
              斜坡命中大涨，因为混合把趋势窗当成了某个分量的正常样本。这是一个方向明确的交换：召回换精确率。
            </Body>
          </div>
          <div style={{ position: "absolute", left: 1180, top: 288, width: 660 }}>
            <PairBar
              a={{ label: "单高斯 F1", value: p1.f1, text: p1.f1.toFixed(3) }}
              b={{ label: "混合 F1", value: p4.f1, text: p4.f1.toFixed(3) }}
              width={640}
              height={150}
              colorA={C.cyan}
              colorB={C.violet}
            />
            <Card label="两个 F1 都没过 0.30" accent={C.coral} style={{ marginTop: 16 }}>
              <Row name="召回" value={p1.recall.toFixed(3) + " → " + p4.recall.toFixed(3)} note="涨了一倍多" width={600} />
              <Row name="精确率" value={p1.precision.toFixed(3) + " → " + p4.precision.toFixed(3)} note="被误报吃掉" width={600} />
              <Row name="报警率" value={p1.alertPct.toFixed(1) + "% → " + p4.alertPct.toFixed(1) + "%"} note="阈值迁移问题，混合继承了它" width={600} />
            </Card>
          </div>
        </AbsoluteFill>

        {/* 页五：分量解释与两条负向断言 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 288, width: 1020 }}>
            <Card label="分量解释 · 核心证据" accent={C.amber}>
              <Row name="漂移窗最小 NLL 中位" value={M.components.driftMinMedian.toFixed(3)} note="趋势段" color={C.amber} width={970} />
              <Row name="正常窗最小 NLL 中位" value={M.components.normalMinMedian.toFixed(3)} note="训练出来的「正常」" color={C.cyan} width={970} />
              <Row name="尖峰窗最小 NLL 中位" value={M.components.spikeMinMedian.toFixed(3)} note="尖峰" color={C.coral} width={970} />
              <Row name="漂移四分量全高的比例" value={M.components.driftAllHighPct.toFixed(0) + "%"} note="如果混合能区分趋势，这个数应该很高" width={970} />
            </Card>
            <Body style={{ marginTop: 20, width: 970 }}>
              「任何分量都解释不了」在趋势段失效了：漂移窗的最小分量 NLL 比正常还低。我们把这条写成负向检查。
            </Body>
          </div>
          <div style={{ position: "absolute", left: 1180, top: 288, width: 660 }}>
            <Card label="两条负向断言 · 钉住失败" accent={C.coral}>
              <Row name="最大分量权重" value={M.fit.piMax.toFixed(3)} note="四个都在用，但一个偏大" width={600} />
              <Row name="漂移与正常差" value={Math.abs(M.components.driftMinMedian - M.components.normalMinMedian).toFixed(2)} note="比噪声还小，混合不区分趋势" width={600} />
              <Row name="成立的含义" value="失败可复现" note="不是删掉，是钉住" width={600} />
            </Card>
            <div style={{ marginTop: 16, display: "flex", gap: 10, flexWrap: "wrap" }}>
              <Verdict ok label="fit.piMax 0.618" />
              <Verdict ok label="漂移 NLL 差 0.43" />
            </div>
            <Body size={FT.meta} color={C.inkFaint} style={{ marginTop: 14, width: 640 }}>
              真实潜空间不是四个均分模式；差的这 0.43 比噪声还小。
            </Body>
          </div>
        </AbsoluteFill>

        {/* 页六：检查与三个坑 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 288, width: 1000 }}>
            <Card label="四十七项检查 · 一次跑完" accent={C.cyan}>
              {M.groups.map((gr) => (
                <div key={gr.label} style={{ display: "flex", alignItems: "baseline", padding: "7px 0", borderBottom: "1px solid " + C.panelLine }}>
                  <span style={{ flex: "0 0 34%", fontFamily: FONT.sans, fontSize: FT.body, color: C.inkDim }}>{gr.label}</span>
                  <span style={{ width: 90, fontFamily: FONT.mono, fontSize: FT.meta, color: gr.pass === gr.n ? C.cyan : C.coral }}>{gr.pass} / {gr.n}</span>
                  <span style={{ flex: 1, fontFamily: FONT.mono, fontSize: FT.meta, color: C.inkFaint }}>{gr.pass === gr.n ? "全过" : "有失败"}</span>
                </div>
              ))}
            </Card>
          </div>
          <div style={{ position: "absolute", left: 1120, top: 288, width: 720 }}>
            <div style={{ display: "flex", gap: 26 }}>
              <Stat label="检查" value={M.meta.checks} sub="全部通过" valueSize={52} valueColor={C.cyan} />
              <Stat label="用时" value={M.meta.elapsedSec.toFixed(1) + " s"} sub="单线程，可重跑" valueSize={52} />
            </div>
            <Card label="路上踩到的三个坑" accent={C.amber} style={{ marginTop: 24 }}>
              <Row name="联合 EM" value="一步塌缩" note="正则只能保命，不能提升" width={680} />
              <Row name="阈值不迁移" value="混合继承了" note="同一个问题，换了分数没解决" width={680} />
              <Row name="朴素 log-sum-exp" value="远端负无穷" note="八维一百就下溢" width={680} />
            </Card>
            <Body size={FT.meta} color={C.inkFaint} style={{ marginTop: 14, width: 690 }}>
              这三条都写进了证据，不藏在备注里。
            </Body>
          </div>
        </AbsoluteFill>
      </Pages>
    </Scene>
  );
};
