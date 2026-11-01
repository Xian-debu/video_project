import React from "react";
import { AbsoluteFill } from "remotion";
import { C, FONT, FT } from "../../design/tokens";
import { PAD, CW, M, pageAt, Pages, Scene, SceneHead, Card, Row, Stat, Verdict, Chip, Body, Mono, TagDot } from "../shared";

export const SOutro: React.FC = () => {
  const at = [0, pageAt("outro", 10)];
  return (
    <Scene id="outro">
      <SceneHead id="outro" />
      <Pages id="outro" at={at}>
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 296, width: CW }}>
            <Card label="三句话带走" accent={C.violet} style={{ width: CW }}>
              <div style={{ fontFamily: FONT.serif, fontSize: FT.h1, color: C.ink, lineHeight: 1.3 }}>
                三种搬法，同一套验法
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 18, marginTop: 22 }}>
                <div style={{ display: "flex", gap: 14, alignItems: "baseline" }}>
                  <TagDot color={C.cyan}>第一句</TagDot>
                  <Body size={FT.body} style={{ flex: 1 }}>简单随机源是共同起点，差的只是搬法：排名、加噪退火、可逆映射。</Body>
                </div>
                <div style={{ display: "flex", gap: 14, alignItems: "baseline" }}>
                  <TagDot color={C.amber}>第二句</TagDot>
                  <Body size={FT.body} style={{ flex: 1 }}>闭式值要自己验。计划里的 0.583333 越过了 Frechet 上界，正确值是 1/3。</Body>
                </div>
                <div style={{ display: "flex", gap: 14, alignItems: "baseline" }}>
                  <TagDot color={C.violet}>第三句</TagDot>
                  <Body size={FT.body} style={{ flex: 1 }}>静默错误比崩溃贵：转置、RK4 系数、泰勒分母、端点 NaN，四条坑各有一条断言守着。</Body>
                </div>
              </div>
            </Card>
          </div>
          <div style={{ position: "absolute", left: PAD, top: 800, width: CW, display: "flex", gap: 22 }}>
            <Stat label="Copula 闭式" value={M.copula.cCorrect.toFixed(6)} sub="计划写错，测试钉住" accent={C.cyan} style={{ width: 566 }} />
            <Stat label="RK4 误差比" value={M.cnf.rk4Ratio.toFixed(3)} sub="理论 16" accent={C.amber} style={{ width: 566 }} />
            <Stat label="密度积分" value={M.cnf.integral.toFixed(4)} sub="网格离散后仍为一" accent={C.violet} style={{ width: 566 }} />
          </div>
        </AbsoluteFill>

        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 300, width: 1120 }}>
            <Card label="本集交付" accent={C.cyan} style={{ width: 1080 }}>
              <div style={{ marginTop: 4 }}>
                <Row name="模块" value="Copula · DdpmLoss · Cnf" note="三个模块，四个坑，全部带注释" width={1040} color={C.cyan} />
                <Row name="证据" value={M.meta.checks.ok + " / " + M.meta.checks.total} note="三份 evidence JSON + 一份 summary.json" width={1040} />
                <Row name="测试" value={M.meta.tests.asserts.toLocaleString("en-US") + " 条"} note={M.meta.tests.suites + " 套，零失败；本集新增 58 条"} width={1040} color={C.amber} />
                <Row name="数据" value={M.data.rows.toLocaleString("en-US") + " 行 · 8 通道"} note={"ts-admin 日线，sha256 " + M.data.shaFull.slice(0, 16)} width={1040} />
              </div>
            </Card>
          </div>
          <div style={{ position: "absolute", left: 1250, top: 300, width: 598 }}>
            <Card label="下一集" accent={C.coral}>
              <Body size={FT.body}>
                第 30 集进入第四章：异常检测。滑动窗口怎么切、点调整还是区间调整、ROC 与 PR 的排序为什么不同 —— 先把地基打平。
              </Body>
            </Card>
            <Card label="系列进度" accent={C.violet} style={{ marginTop: 18 }}>
              <div style={{ fontFamily: FONT.mono, fontSize: FT.num, color: C.ink }}>29 / 74</div>
              <Body size={FT.meta} style={{ marginTop: 8 }}>第三篇章模型第 29 集；下一集开始第四章。</Body>
            </Card>
          </div>
          <div style={{ position: "absolute", left: PAD, top: 860, width: CW, display: "flex", gap: 18 }}>
            <Verdict ok label="24 / 24 检查" />
            <Verdict ok label="成片入库" />
            <Mono size={FT.meta} color={C.inkFaint}>第 29 集完</Mono>
          </div>
        </AbsoluteFill>
      </Pages>
    </Scene>
  );
};

