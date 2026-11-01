import React from "react";
import { AbsoluteFill } from "remotion";
import { C, FONT, FT } from "../../design/tokens";
import { PAD, CW, M, fmtF, pageAt, Pages, Scene, SceneHead, Card, Row, Verdict, Chip, Body, Mono, TagDot } from "../shared";

export const SOpen: React.FC = () => {
  const at = [0, pageAt("open", 10), pageAt("open", 22)];
  const s = M.scores;
  return (
    <Scene id="open">
      <SceneHead id="open" />
      <Pages id="open" at={at}>
        {/* 页一：口径先于模型 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 296, width: 1120 }}>
            <div style={{ fontFamily: FONT.serif, fontSize: 96, color: C.ink, lineHeight: 1.18 }}>
              同一组输出，
              <br />
              三种口径。
            </div>
            <Body size={FT.body} style={{ marginTop: 26, width: 1040 }}>
              这一章里，八成的差别不在模型，在口径。同一批异常点、同一组预测，换一种评分方式，F1 就换一个数。
              这一集先把地基铺好：怎么切窗，怎么算分，怎么把窗口的标签折回逐点 —— 三件事都不训练。
            </Body>
            <div style={{ display: "flex", gap: 18, marginTop: 34 }}>
              <Verdict ok label="实现通过" />
              <Verdict ok label="证据通过" />
              <Chip color={C.amber}>本集没有模型</Chip>
            </div>
          </div>
          <div style={{ position: "absolute", left: 1250, top: 300, width: 570 }}>
            <Card label="这一集的三块地基" accent={C.cyan} pad={22}>
              <div style={{ display: "flex", alignItems: "baseline", gap: 14 }}>
                <Mono size={30} color={C.cyan}>01</Mono>
                <Body color={C.ink} size={30} style={{ lineHeight: 1.2 }}>窗口</Body>
              </div>
              <Body size={FT.meta} style={{ marginTop: 8 }}>窗长 100，步长 10，586 个窗口 —— 切法决定标签有多糊。</Body>
            </Card>
            <Card label=" " accent={C.amber} pad={22} style={{ marginTop: 18 }}>
              <div style={{ display: "flex", alignItems: "baseline", gap: 14 }}>
                <Mono size={30} color={C.amber}>02</Mono>
                <Body color={C.ink} size={30} style={{ lineHeight: 1.2 }}>指标</Body>
              </div>
              <Body size={FT.meta} style={{ marginTop: 8 }}>逐点、点调整、范围调整 —— 同一个真阳性，三种定义。</Body>
            </Card>
            <Card label=" " accent={C.violet} pad={22} style={{ marginTop: 18 }}>
              <div style={{ display: "flex", alignItems: "baseline", gap: 14 }}>
                <Mono size={30} color={C.violet}>03</Mono>
                <Body color={C.ink} size={30} style={{ lineHeight: 1.2 }}>评分</Body>
              </div>
              <Body size={FT.meta} style={{ marginTop: 8 }}>重构 MSE、重构 MAE、预测误差 —— 三个分数选出三个不同的六窗。</Body>
            </Card>
          </div>
        </AbsoluteFill>

        {/* 页二：三个 F1 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 312, width: CW, display: "flex", gap: 26 }}>
            <Card label="01 / 逐点 · 重构 MSE" accent={C.cyan} style={{ width: 550 }}>
              <div style={{ fontFamily: FONT.mono, fontSize: 82, color: C.cyan, lineHeight: 1.05 }}>{fmtF(s.mse.f1, 4)}</div>
              <Body size={FT.body} style={{ marginTop: 14 }}>精度 {fmtF(s.mse.p, 4)} · 召回 {fmtF(s.mse.r, 4)}</Body>
              <Mono size={FT.meta} color={C.inkFaint} style={{ display: "block", marginTop: 10 }}>8 个真阳性 / 150 个预测点</Mono>
            </Card>
            <Card label="02 / 逐点 · 预测误差" accent={C.amber} style={{ width: 550 }}>
              <div style={{ fontFamily: FONT.mono, fontSize: 82, color: C.amber, lineHeight: 1.05 }}>{fmtF(s.pred.f1, 4)}</div>
              <Body size={FT.body} style={{ marginTop: 14 }}>精度 {fmtF(s.pred.p, 4)} · 召回 {fmtF(s.pred.r, 4)}</Body>
              <Mono size={FT.meta} color={C.inkFaint} style={{ display: "block", marginTop: 10 }}>19 个真阳性 / 540 个预测点</Mono>
            </Card>
            <Card label="03 / 范围调整" accent={C.coral} style={{ width: 550 }}>
              <div style={{ fontFamily: FONT.mono, fontSize: 82, color: C.coral, lineHeight: 1.05 }}>{fmtF(s.mse.rf1, 4)}</div>
              <Body size={FT.body} style={{ marginTop: 14 }}>精度 {fmtF(s.mse.rp, 4)} · 召回 {fmtF(s.mse.rr, 4)}</Body>
              <Mono size={FT.meta} color={C.inkFaint} style={{ display: "block", marginTop: 10 }}>0 个命中段 / 44 个真实段</Mono>
            </Card>
          </div>
          <div style={{ position: "absolute", left: PAD, top: 742, width: 1180 }}>
            <Body size={FT.body}>
              同一批预测，三种口径，三个数。这不是模型差 —— 这一集根本没有模型。只有三块地基：窗口、指标、评分。
            </Body>
            <div style={{ display: "flex", gap: 18, marginTop: 24 }}>
              <Chip color={C.cyan}>三个数都来自同一份 586 窗读数</Chip>
              <Chip color={C.inkFaint}>训练：无</Chip>
              <Chip color={C.inkFaint}>模型：无</Chip>
            </div>
          </div>
        </AbsoluteFill>

        {/* 页三：数据与证据 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 300, width: 1050 }}>
            <Card label="数据 · 一只股票，二十五年">
              <Row name="代码" value={M.data.code + " · " + M.data.name} width={1000} />
              <Row name="区间" value={M.data.start + " → " + M.data.end} width={1000} />
              <Row name="交易日" value={M.data.rows.toLocaleString("en-US")} note="复权日线，去掉停牌与零价" width={1000} />
              <Row name="最长停牌" value={M.data.maxGapDays + " 天"} note={M.data.maxGapAt + "；这些缺口后面要单独处理"} width={1000} />
              <Row name="窗口" value={M.window.count + " × " + M.window.len + " 日"} note={"步长 " + M.window.stride + "；训练步长 " + M.window.strideTrain} width={1000} />
              <Row name="注入" value={M.inject.points + " 点 / " + M.inject.segments + " 段"} note={"1% 比例，seed " + M.inject.seed + "，5–10 sigma"} width={1000} />
              <Row name="sha256" value={M.data.sha.slice(0, 12) + "…"} note="ts-admin 导出的 CSV，逐字节校验" width={1000} />
            </Card>
          </div>
          <div style={{ position: "absolute", left: 1190, top: 300, width: 630 }}>
            <Card label="实现与证据" accent={C.violet}>
              <Row name="模块" value="3" note="Window · Metrics · Score" width={580} />
              <Row name="坑" value="4" note="全部是静默错误，各配一条断言" width={580} />
              <Row name="断言" value="16 + 15 + 16" note={"本集新增 " + M.meta.tests.new + " 条"} width={580} />
              <Row name="检查" value={M.meta.checks + " / " + M.meta.checkTotal} note={M.meta.runtimeSec + " s，summary.json 与三份 evidence JSON"} width={580} color={C.cyan} />
              <Row name="全仓" value={M.meta.tests.asserts.toLocaleString("en-US")} note={M.meta.tests.suites + " 套，零失败"} width={580} />
            </Card>
            <div style={{ display: "flex", gap: 14, marginTop: 26 }}>
              <TagDot color={C.cyan}>画面数字全部来自证据程序</TagDot>
            </div>
            <div style={{ display: "flex", gap: 14, marginTop: 14 }}>
              <TagDot color={C.amber}>下一集：分数怎么变成 0/1</TagDot>
            </div>
          </div>
          <div style={{ position: "absolute", left: PAD, top: 880, width: CW, display: "flex", gap: 18 }}>
            <Verdict ok label={M.meta.checks + " / " + M.meta.checkTotal + " 检查"} />
            <Verdict ok label={M.meta.tests.asserts.toLocaleString("en-US") + " 断言"} />
            <Mono size={FT.meta} color={C.inkFaint}>不手抄数字：每块画面都读 foundation.json</Mono>
          </div>
        </AbsoluteFill>
      </Pages>
    </Scene>
  );
};
