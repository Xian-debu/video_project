import React from "react";
import { AbsoluteFill } from "remotion";
import { C, FONT, FT } from "../../design/tokens";
import { PAD, CW, M, fmtF, fmtP, pageAt, Pages, Scene, SceneHead, Card, Row, Verdict, Chip, Body, Mono } from "../shared";

const spike = M.routes.filter((r) => r.variant === "spike");
const R = (key: string) => spike.find((r) => r.key === key)!;

export const SOpen: React.FC = () => {
  const at = [0, pageAt("open", 10), pageAt("open", 22)];
  return (
    <Scene id="open">
      <SceneHead id="open" />
      <Pages id="open" at={at}>
        {/* 页一：分数到判断 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 292, width: 1120 }}>
            <div style={{ fontFamily: FONT.serif, fontSize: 92, color: C.ink, lineHeight: 1.2 }}>
              分数怎么变成
              <br />
              零和一。
            </div>
            <Body size={FT.body} style={{ marginTop: 26, width: 1020 }}>
              上一集铺好了地基：怎么切窗，怎么算分，怎么折叠标签。分数还是连续的数，交易要的是判断。
              这一集只做一件事 —— 在分数上放一把尺子，看同一批分数在不同切法下，F1 能差多远。
            </Body>
            <div style={{ display: "flex", gap: 18, marginTop: 34 }}>
              <Verdict ok label="实现通过" />
              <Verdict ok label="证据通过" />
              <Chip color={C.amber}>同一串分数 · 三种切法</Chip>
            </div>
          </div>
          <div style={{ position: "absolute", left: 1250, top: 296, width: 580 }}>
            <Card label="这一集的三块零件" accent={C.cyan} pad={22}>
              <div style={{ display: "flex", alignItems: "baseline", gap: 14 }}>
                <Mono size={30} color={C.cyan}>01</Mono>
                <Body color={C.ink} size={30} style={{ lineHeight: 1.2 }}>阈值</Body>
              </div>
              <Body size={FT.meta} style={{ marginTop: 8 }}>固定 3σ、训练段 1% 分位、SPOT —— 三个切点一个比一个高。</Body>
            </Card>
            <Card label=" " accent={C.amber} pad={22} style={{ marginTop: 18 }}>
              <div style={{ display: "flex", alignItems: "baseline", gap: 14 }}>
                <Mono size={30} color={C.amber}>02</Mono>
                <Body color={C.ink} size={30} style={{ lineHeight: 1.2 }}>分类器</Body>
              </div>
              <Body size={FT.meta} style={{ marginTop: 8 }}>同一串分数喂给逻辑回归 —— 它不切分数，它重学一个边界。</Body>
            </Card>
            <Card label=" " accent={C.violet} pad={22} style={{ marginTop: 18 }}>
              <div style={{ display: "flex", alignItems: "baseline", gap: 14 }}>
                <Mono size={30} color={C.violet}>03</Mono>
                <Body color={C.ink} size={30} style={{ lineHeight: 1.2 }}>基线</Body>
              </div>
              <Body size={FT.meta} style={{ marginTop: 8 }}>手写 z 分数、移动平均残差 —— 比切法更笨的问题：分数本身够不够用。</Body>
            </Card>
          </div>
        </AbsoluteFill>

        {/* 页二：三个 F1 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 300, width: CW }}>
            <Body size={FT.body} style={{ width: 900, marginBottom: 26 }}>
              同一批异常、同一串分数，只换切点。三个切点，三个 F1。
            </Body>
            <div style={{ display: "flex", gap: 26 }}>
              <Card label="01 / 固定 3σ" accent={C.cyan} style={{ width: 550 }}>
                <div style={{ fontFamily: FONT.mono, fontSize: 76, color: C.cyan, lineHeight: 1.05 }}>{fmtF(R("fixed").f1, 4)}</div>
                <Body size={FT.body} style={{ marginTop: 14 }}>精度 {fmtF(R("fixed").p, 4)} · 召回 {fmtF(R("fixed").r, 4)}</Body>
                <Mono size={FT.meta} color={C.inkFaint} style={{ display: "block", marginTop: 10 }}>{R("fixed").pos} 个预测点 · 阈值 {fmtF(M.taus.fixed, 2)}</Mono>
              </Card>
              <Card label="02 / 训练段 1% 分位" accent={C.amber} style={{ width: 550 }}>
                <div style={{ fontFamily: FONT.mono, fontSize: 76, color: C.amber, lineHeight: 1.05 }}>{fmtF(R("quantile").f1, 4)}</div>
                <Body size={FT.body} style={{ marginTop: 14 }}>精度 {fmtF(R("quantile").p, 4)} · 召回 {fmtF(R("quantile").r, 4)}</Body>
                <Mono size={FT.meta} color={C.inkFaint} style={{ display: "block", marginTop: 10 }}>{R("quantile").pos} 个预测点 · 阈值 {fmtF(M.taus.trainQuantile, 4)}</Mono>
              </Card>
              <Card label="03 / SPOT" accent={C.violet} style={{ width: 550 }}>
                <div style={{ fontFamily: FONT.mono, fontSize: 76, color: C.violet, lineHeight: 1.05 }}>{fmtF(R("spot").f1, 4)}</div>
                <Body size={FT.body} style={{ marginTop: 14 }}>精度 {fmtF(R("spot").p, 4)} · 召回 {fmtF(R("spot").r, 4)}</Body>
                <Mono size={FT.meta} color={C.inkFaint} style={{ display: "block", marginTop: 10 }}>{R("spot").pos} 个预测点 · 阈值 {fmtF(M.taus.spot, 4)}</Mono>
              </Card>
            </div>
          </div>
          <div style={{ position: "absolute", left: PAD, top: 790, width: 1500 }}>
            <Body size={FT.body}>
              切点从 3.0 挪到 4.79，F1 从零点六九走到一。模型没动，分数没动 —— 动的只是尺子。
            </Body>
            <div style={{ display: "flex", gap: 18, marginTop: 24 }}>
              <Chip color={C.cyan}>真值 {M.inject.spike.testTruth} 个点</Chip>
              <Chip color={C.inkFaint}>注入 {M.inject.spike.points} 点 / {M.inject.spike.segments} 段</Chip>
              <Chip color={C.inkFaint}>训练：无</Chip>
            </div>
          </div>
        </AbsoluteFill>

        {/* 页三：数据与证据 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 296, width: 1060 }}>
            <Card label="数据 · 一只股票，二十五年">
              <Row name="区间" value={M.data.start + " → " + M.data.end} width={1010} />
              <Row name="交易日" value={M.data.rows.toLocaleString("en-US")} note="复权日线，去掉停牌与零价" width={1010} />
              <Row name="训练段" value={M.data.split.train} note="定阈值与尾部拟合" width={1010} />
              <Row name="测试段" value={M.data.split.test} note="只读，不参与任何拟合" width={1010} />
              <Row name="尖峰注入" value={M.inject.spike.points + " 点 / " + M.inject.spike.segments + " 段"} note={"1% 比例，seed " + M.inject.seed + "，5–10 sigma"} width={1010} />
              <Row name="中等偏移" value={M.inject.medium.points + " 点 / " + M.inject.medium.segments + " 段"} note="2–4 个局部 sigma，全局 z 看不见" width={1010} />
              <Row name="sha256" value={M.data.sha.slice(0, 12) + "…"} note="ts-admin 导出，逐字节校验" width={1010} />
            </Card>
          </div>
          <div style={{ position: "absolute", left: 1190, top: 296, width: 640 }}>
            <Card label="实现与证据" accent={C.violet}>
              <Row name="模块" value="3" note="Threshold · SupCls · Smoothing" width={600} />
              <Row name="检查" value={M.meta.checks + " / " + M.meta.checkTotal} note={"一次跑完，耗时 " + M.meta.runtimeSec + " s"} width={600} />
              <Row name="断言" value={M.meta.tests.suites + " 套 · " + M.meta.tests.asserts.toLocaleString("en-US")} note={"本集新增 " + M.meta.tests.new} width={600} />
              <Row name="提交" value={M.meta.algoCommit + " / " + M.meta.evidenceCommit} note={"数据 " + M.meta.dataCommit} width={600} />
            </Card>
            <Card label="这一集的回答" accent={C.amber} style={{ marginTop: 20 }}>
              <Body size={FT.body}>
                分数怎么变成 0/1：拿一把尺子。尺子准不准，先看分数，再看尾部的形状。三种切法都能算 F1，但只有一种在这组数据上把真值全接住。
              </Body>
            </Card>
          </div>
        </AbsoluteFill>
      </Pages>
    </Scene>
  );
};
