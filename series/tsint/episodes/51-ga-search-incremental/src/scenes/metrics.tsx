import React from "react";
import { AbsoluteFill } from "remotion";
import { C, FONT, FT } from "../../design/tokens";
import { M, Body, Card, Chip, KV, PAD, Pages, Row, Scene, SceneHead, fmt2, fmt4, fmtInt, fmtPct, pagesOf } from "../shared";
import { ExtrapBars, GapRuler, StageCurves } from "../figs";

const ar1 = M.stageCurves.find((s) => s.name === "ar1");

export const MetricsScene: React.FC = () => (
  <Scene id="metrics">
    <SceneHead id="metrics" />
    <Pages id="metrics" at={pagesOf("metrics")}>
      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 296, width: 630 }}>
          <Body size={FT.h2} color={C.ink} style={{ lineHeight: 1.3 }}>四个黄金值，<br />钉住实现。</Body>
          <Body style={{ marginTop: 24 }}>
            指标只挑四个够用的：线性外推的三点黄金值、两点共线、阶段点采样、遗传算法的黄金值。单调性也量了：两百对里一百六十一对单调不升，八成的比例，边界那一段要提。
          </Body>
          <div style={{ display: "flex", gap: 10, marginTop: 22 }}>
            <Chip color={C.cyan}>外推</Chip>
            <Chip color={C.violet}>采样</Chip>
            <Chip color={C.coral}>进化</Chip>
          </div>
        </div>
        <div style={{ position: "absolute", left: 760, top: 288, width: 1090 }}>
          <Card label="黄金值：改一行代码就会破" accent={C.cyan}>
            <Row name="三点斜率" value={fmt2(M.curve.slope, 3)} note="(10,1.1) (20,1.0) (30,0.9)，截距 1.2" width={1030} color={C.cyan} />
            <Row name="外推到 60" value={fmt2(M.curve.extrap60, 1)} note="目标点不超过最大观测点的四倍" width={1030} color={C.violet} />
            <Row name="两点外推到 50" value={fmt2(M.curve.twoPoint50, 1)} note="(10,2) (30,4) → 6.0" width={1030} color={C.amber} />
            <Row name="阶段点" value={M.data.stages.map((n) => fmtInt(n)).join(" / ")} note="训练量按八分之一 / 四分之一 / 二分之一切" width={1030} color={C.coral} />
            <Row name="GA 黄金值" value="−1 → 0" note="f(x)=−(x−3)²，种子 136，第二代基因 3" width={1030} color={C.cyan} />
            <Row name="单调对" value={M.demo.mono + " / " + M.demo.monoOf} note="三点 MAE 非递增的比例，八成" width={1030} color={C.inkDim} />
          </Card>
        </div>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 292, width: 600 }}>
          <Body size={FT.h2} color={C.ink} style={{ lineHeight: 1.3 }}>十个候选，<br />四条曲线。</Body>
          <Body style={{ marginTop: 22 }}>
            朴素模型是一条平线，因为它不看训练量；拟合型的候选，三段都在往下掉。以 AR(1) 为例：213 时 {ar1 ? fmt2(ar1.mae[0], 2) : ""}，426 时 {ar1 ? fmt2(ar1.mae[1], 2) : ""}，852 时 {ar1 ? fmt2(ar1.mae[2], 2) : ""}，全量 {ar1 ? fmt2(ar1.full, 2) : ""}。前两段掉得快，后两段几乎不动。
          </Body>
          <div style={{ marginTop: 20, fontFamily: FONT.mono, fontSize: FT.meta, color: C.inkFaint }}>
            最后一段已经平了，这就是平台期；外推恰恰看不见它
          </div>
        </div>
        <div style={{ position: "absolute", left: 720, top: 286, width: 1130 }}>
          <Card label="阶段曲线：验证 MAE 随训练量的形状" accent={C.violet}>
            <StageCurves w={1060} h={430} />
          </Card>
        </div>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 288, width: 600 }}>
          <Body size={FT.h2} color={C.ink} style={{ lineHeight: 1.3 }}>线性外推<br />把排序搞乱了。</Body>
          <Body style={{ marginTop: 22 }}>
            平均绝对差 {fmt4(M.demo.lin.errMean)}，最大一次差 {fmt2(M.demo.lin.errMax, 1)}。为什么这么大：AR(1) 全量十点八，线性外推给 {fmt4(M.candidates.find((c) => c.name === "ar1")?.extrapMae ?? 0)}，差了一个量级。幂律把误差压到 {fmt4(M.demo.pow.errMean)}，压掉三分之二，但离十点八还很远。
          </Body>
          <div style={{ marginTop: 20, display: "flex", gap: 10 }}>
            <Chip color={C.coral}>线性：系统性低估</Chip>
            <Chip color={C.violet}>幂律：压到 1.38</Chip>
          </div>
        </div>
        <div style={{ position: "absolute", left: 720, top: 282, width: 1130 }}>
          <Card label="同一候选，三条读数：真实 / 线性外推 / 幂律外推" accent={C.coral}>
            <ExtrapBars w={1060} />
          </Card>
        </div>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 292, width: 600 }}>
          <Body size={FT.h2} color={C.ink} style={{ lineHeight: 1.3 }}>排序本来<br />就不该恢复。</Body>
          <Body style={{ marginTop: 22 }}>
            线性外推 Top-1 只有 {fmtPct(M.demo.lin.acc1, 0)}，二十只里挑对一只；幂律抬到 {fmtPct(M.demo.pow.acc1, 0)}，六只对，仍远低于全量的 100%。冠军和亚军平均只差 {fmt4(M.demo.gap)}，幂律误差是它的 {fmt2(M.demo.ratio)} 倍。
          </Body>
          <div style={{ marginTop: 20, fontFamily: FONT.mono, fontSize: FT.meta, color: C.inkFaint }}>
            信号比噪声还小，省下来的数据换不来分辨率
          </div>
        </div>
        <div style={{ position: "absolute", left: 720, top: 286, width: 1130 }}>
          <Card label="差距尺：排序要恢复的量，对比外推误差" accent={C.cyan}>
            <GapRuler w={1060} />
          </Card>
          <div style={{ display: "flex", gap: 24, marginTop: 18 }}>
            <KV k="Top-1 线性" v={fmtPct(M.demo.lin.acc1, 0)} color={C.coral} />
            <KV k="Top-1 幂律" v={fmtPct(M.demo.pow.acc1, 0)} color={C.violet} />
            <KV k="Top-1 全量" v={fmtPct(M.demo.acc1Full, 0)} color={C.cyan} />
            <KV k="交集" v={fmt2(M.demo.lin.overlap, 1) + " → " + fmt2(M.demo.pow.overlap, 1)} color={C.inkDim} />
          </div>
        </div>
      </AbsoluteFill>
    </Pages>
  </Scene>
);
