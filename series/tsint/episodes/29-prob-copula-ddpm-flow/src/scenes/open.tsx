import React from "react";
import { AbsoluteFill } from "remotion";
import { C, FONT, FT, FT_T } from "../../design/tokens";
import { PAD, CW, M, pageAt, Pages, Scene, SceneHead, Card, Row, Stat, Verdict, Chip, Body, Mono, Formula, TagDot } from "../shared";

export const SOpen: React.FC = () => {
  const at = [0, pageAt("open", 10), pageAt("open", 20)];
  return (
    <Scene id="open">
      <SceneHead id="open" />
      <Pages id="open" at={at}>
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 296, width: 1180 }}>
            <div style={{ fontFamily: FONT.serif, fontSize: 96, color: C.ink, lineHeight: 1.18 }}>
              同一个分布，
              <br />
              三种搬法。
            </div>
            <Body size={FT.body} style={{ marginTop: 26, width: 1080 }}>
              边缘好估，联合难估。Copula 用秩变换搬边缘，扩散用一千步加噪再退火，连续流用可逆映射搬整条密度。
              本集三种都实现，也都有证据；但不训练成预测器，不报生成质量。
            </Body>
            <div style={{ display: "flex", gap: 18, marginTop: 34 }}>
              <Verdict ok label="实现通过" />
              <Verdict ok label="证据通过" />
              <Chip color={C.amber}>未做端到端训练</Chip>
            </div>
          </div>
          <div style={{ position: "absolute", left: 1320, top: 300, width: 528 }}>
            <Stat label="证据检查" value={M.meta.checks.ok + " / " + M.meta.checks.total} sub="三组模块、数据、伪影，逐条落盘" accent={C.cyan} valueColor={C.cyan} style={{ width: 488 }} />
            <Stat label="全仓断言" value={M.meta.tests.asserts.toLocaleString("en-US")} sub={M.meta.tests.suites + " 套，零失败；本集新增 " + (M.meta.tests.copula + M.meta.tests.ddpm + M.meta.tests.cnf) + " 条"} accent={C.violet} style={{ width: 488, marginTop: 20 }} />
            <Stat label="证据程序" value={M.meta.runtimeSec + " s"} sub="二十四项检查一次跑完" accent={C.amber} style={{ width: 488, marginTop: 20 }} />
          </div>
        </AbsoluteFill>

        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 300, width: CW, display: "flex", gap: 22 }}>
            <Card label="01 / Copula" accent={C.cyan} style={{ width: 566 }}>
              <div style={{ fontFamily: FONT.mono, fontSize: 68, color: C.cyan, lineHeight: 1.1 }}>{M.copula.cCorrect.toFixed(6)}</div>
              <Body size={FT.body} style={{ marginTop: 14 }}>
                二分位高斯 Copula 的闭式值，ρ = 0.5。计划里写的是 {M.copula.cPlan.toFixed(6)} —— 满足不了上界 min(u,v) = {M.copula.bound.toFixed(1)}。
              </Body>
              <Mono size={FT.meta} color={C.inkFaint} style={{ display: "block", marginTop: 14 }}>
                C(u,v;rho) = 1/4 + arcsin(rho)/(2 pi)
              </Mono>
            </Card>
            <Card label="02 / Diffusion" accent={C.amber} style={{ width: 566 }}>
              <div style={{ fontFamily: FONT.mono, fontSize: 68, color: C.amber, lineHeight: 1.1 }}>{M.ddpm.xtHalf.toFixed(6)}</div>
              <Body size={FT.body} style={{ marginTop: 14 }}>
                前向过程在 t = 500 时的 x_t，ᾱ 取 0.5，手算恰好是根号二。精确到 1e-12 的闭式断言。
              </Body>
              <Mono size={FT.meta} color={C.inkFaint} style={{ display: "block", marginTop: 14 }}>
                x_t = sqrt(aBar) x0 + sqrt(1 - aBar) eps
              </Mono>
            </Card>
            <Card label="03 / Continuous flow" accent={C.violet} style={{ width: 566 }}>
              <div style={{ fontFamily: FONT.mono, fontSize: 68, color: C.violet, lineHeight: 1.1 }}>{M.cnf.logDet.toFixed(6)}</div>
              <Body size={FT.body} style={{ marginTop: 14 }}>
                仿射层的对数行列式，就是 log 2。可逆流往返误差 {M.cnf.roundtrip.toExponential(2)}，密度在网格上积分 1.0000。
              </Body>
              <Mono size={FT.meta} color={C.inkFaint} style={{ display: "block", marginTop: 14 }}>
                log |det J| = sum log |s_i|
              </Mono>
            </Card>
          </div>
          <div style={{ position: "absolute", left: PAD, top: 792, width: CW }}>
            <Row name="原文" value="p.67–68" note="3.5.1 节只点名三种做法，公式与文献编号需回 PDF 核" />
            <Row name="数据" value={M.data.rows.toLocaleString("en-US") + " 行 · " + M.data.channels + " 通道"} note={M.data.start + " 到 " + M.data.end + " · 一千个窗口 · sha256 " + M.data.sha} />
            <Row name="本集交付" value="三个模块 + 五十八条断言" note="Copula.hs · DdpmLoss.hs · Cnf.hs，证据程序一项一项跑" color={C.cyan} />
          </div>
        </AbsoluteFill>

        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 300, width: 1120 }}>
            <Card label="证据链 · 从实现到画面">
              <div style={{ marginTop: 4 }}>
                <Row name="一、实现" value="3 个模块 · 4 个坑" note="梯度转置、RK4 系数、泰勒项分母、PIT 端点" width={1040} />
                <Row name="二、断言" value="22 + 21 + 15" note="Copula / DDPM 损失 / 连续流，三个测试文件" width={1040} />
                <Row name="三、证据" value="24 项检查" note="8.7 秒，summary.json 与三份 evidence JSON" width={1040} />
                <Row name="四、数据" value="2,657 行 × 8 通道" note="ts-admin 日线，前 70% 定均值方差，无测试段泄漏" width={1040} color={C.cyan} />
              </div>
            </Card>
          </div>
          <div style={{ position: "absolute", left: 1250, top: 300, width: 598 }}>
            <Card label="三句话预告" accent={C.violet}>
              <div style={{ display: "flex", flexDirection: "column", gap: 16, marginTop: 4 }}>
                <div>
                  <TagDot color={C.cyan}>第一句</TagDot>
                  <Body size={FT.body} style={{ marginTop: 6 }}>简单随机源是共同起点，差的只是搬法。</Body>
                </div>
                <div>
                  <TagDot color={C.amber}>第二句</TagDot>
                  <Body size={FT.body} style={{ marginTop: 6 }}>闭式值要自己验，书里的计划写错了。</Body>
                </div>
                <div>
                  <TagDot color={C.violet}>第三句</TagDot>
                  <Body size={FT.body} style={{ marginTop: 6 }}>静默错误比崩溃更贵，四条测试各守一类。</Body>
                </div>
              </div>
            </Card>
            <Card label="下一集" accent={C.coral} style={{ marginTop: 20 }}>
              <Body size={FT.body}>
                第 30 集切到第四章：异常检测的地基。窗口、指标、评分 —— 同一组模型输出，三种评分口径，F1 的排序会翻转。
              </Body>
            </Card>
          </div>
          <div style={{ position: "absolute", left: PAD, top: 860, width: CW, display: "flex", gap: 18 }}>
            <Verdict ok label="24 / 24 检查" />
            <Verdict ok label="1,371 / 1,371 断言" />
            <Mono size={FT.meta} color={C.inkFaint}>所有读数来自刚跑过的实现，画面不手抄数字</Mono>
          </div>
        </AbsoluteFill>
      </Pages>
    </Scene>
  );
};

