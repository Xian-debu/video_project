import React from "react";
import { AbsoluteFill } from "remotion";
import { C, FONT, FT } from "../../design/tokens";
import { PAD, CW, M, pageAt, Pages, Scene, SceneHead, Card, Row, Stat, Verdict, Chip, Body, Mono, TagDot } from "../shared";

export const SBoundary: React.FC = () => {
  const at = [0, pageAt("boundary", 12), pageAt("boundary", 26)];
  return (
    <Scene id="boundary">
      <SceneHead id="boundary" />
      <Pages id="boundary" at={at}>
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 300, width: CW, display: "flex", gap: 22 }}>
            <Card label="边界一 · 没有训练" accent={C.coral} style={{ width: 566 }}>
              <Body size={FT.body}>
                三个模块只证明结构、接口与数值。扩散网络虽然训练了 400 步，只到"能跑通"，不跟任何训练好的预测器比精度。本集没有精度可报。
              </Body>
              <Mono size={FT.meta} color={C.inkFaint} style={{ display: "block", marginTop: 14 }}>没有拟合对照，就没有效果结论</Mono>
            </Card>
            <Card label="边界二 · 20 条路径不是生成声明" accent={C.amber} style={{ width: 566 }}>
              <Body size={FT.body}>
                DDIM 采样的均值误差 {M.ddpm.meanErr.toFixed(1)}、标准差误差 {M.ddpm.sdErr.toFixed(1)}，样本 sd {M.ddpm.sampleSd.toFixed(1)} 对数据 sd {M.ddpm.dataSd.toFixed(1)}。
                路径全部有限，但明显发散。
              </Body>
              <Mono size={FT.meta} color={C.inkFaint} style={{ display: "block", marginTop: 14 }}>能采样，不等于采得对</Mono>
            </Card>
            <Card label="边界三 · 结构随窗长变" accent={C.violet} style={{ width: 566 }}>
              <Body size={FT.body}>
                同组与跨组的差：宽带口径 {(M.copula.withinRet - M.copula.crossRet).toFixed(3)}，96 日窗内口径 {(M.copula.withinWin - M.copula.crossWin).toFixed(3)}。
                行业结构不是固定的数，取决于减掉多少共模。
              </Body>
              <Mono size={FT.meta} color={C.inkFaint} style={{ display: "block", marginTop: 14 }}>相关也不等于因果</Mono>
            </Card>
          </div>
          <div style={{ position: "absolute", left: PAD, top: 660, width: CW, display: "flex", gap: 22 }}>
            <Card label="边界四 · 原文只点名" accent={C.coral} style={{ width: 1130 }}>
              <Body size={FT.body}>
                p.67–68 只列出三种做法，没有公式，文献编号也没有核过 PDF。本集的单位、公式与断言都从第一性原理重写，
                原文数值只作为对账线索 —— 而且已经抓出计划里一个越界的闭式值。
              </Body>
            </Card>
            <Card label="三笔债" accent={C.amber} style={{ width: 624 }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 4 }}>
                <Row name="算法卡" value="没写" note="接口、口径、与书的差异" width={584} color={C.amber} />
                <Row name="demo 子命令" value="没做" note="没有一键跑的 tsbase 入口" width={584} color={C.amber} />
                <Row name="端到端训练" value="没做" note="无精度对照" width={584} color={C.amber} />
              </div>
            </Card>
          </div>
        </AbsoluteFill>

        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 296, width: 1180 }}>
            <Card label="两个读数，两句边界" accent={C.coral} style={{ width: 1140 }}>
              <div style={{ marginTop: 4 }}>
                <TagDot color={C.coral}>样本</TagDot>
                <Body size={FT.body} style={{ marginTop: 8 }}>
                  DDIM 20 条路径的样本 sd = {M.ddpm.sampleSd.toFixed(2)}，数据 sd = {M.ddpm.dataSd.toFixed(2)}。均值误差 {M.ddpm.meanErr.toFixed(2)}，
                  标准差误差 {M.ddpm.sdErr.toFixed(2)}。训练只有 400 步，去噪器没学好，样本整体发散 —— 这些数字原样进证据，不挑路径。
                </Body>
                <div style={{ height: 22 }} />
                <TagDot color={C.amber}>窗长</TagDot>
                <Body size={FT.body} style={{ marginTop: 8 }}>
                  同组减跨组的差：宽带 {(M.copula.withinRet - M.copula.crossRet).toFixed(4)}，96 日窗内 {(M.copula.withinWin - M.copula.crossWin).toFixed(4)}。
                  同一批数据，换一个估计口径，行业结构的读数缩水一半多。
                </Body>
              </div>
            </Card>
          </div>
          <div style={{ position: "absolute", left: 1290, top: 300, width: 558 }}>
            <Stat label="样本 sd" value={M.ddpm.sampleSd.toFixed(1)} sub={"数据 sd " + M.ddpm.dataSd.toFixed(2)} accent={C.coral} style={{ width: 518 }} />
            <Stat label="均值误差" value={M.ddpm.meanErr.toFixed(2)} sub="按维平均" accent={C.coral} style={{ width: 518, marginTop: 18 }} />
            <Stat label="窗长效应" value={(M.copula.withinWin - M.copula.crossWin).toFixed(3)} sub={"宽带口径 " + (M.copula.withinRet - M.copula.crossRet).toFixed(3)} accent={C.amber} style={{ width: 518, marginTop: 18 }} />
          </div>
          <div style={{ position: "absolute", left: PAD, top: 872, width: CW, display: "flex", gap: 18 }}>
            <Verdict ok label="边界写进证据 JSON" />
            <Verdict ok label="画面与证据同源" />
            <Mono size={FT.meta} color={C.inkFaint}>不宣称生成质量，也不宣称预测精度</Mono>
          </div>
        </AbsoluteFill>

        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 296, width: 1120 }}>
            <Card label="交付状态" accent={C.cyan} style={{ width: 1080 }}>
              <div style={{ display: "flex", gap: 16, marginBottom: 18 }}>
                <Verdict ok label="实现通过" />
                <Verdict ok label="证据通过" />
                <Chip color={C.coral}>未做端到端训练</Chip>
              </div>
              <div style={{ marginTop: 4 }}>
                <Row name="证据检查" value={M.meta.checks.ok + " / " + M.meta.checks.total} note="三组模块 + 数据 + 伪影" width={1040} color={C.cyan} />
                <Row name="底层断言" value={M.meta.tests.asserts.toLocaleString("en-US")} note={M.meta.tests.suites + " 套 · 0 失败 · 本集新增 " + (M.meta.tests.copula + M.meta.tests.ddpm + M.meta.tests.cnf) + " 条"} width={1040} />
                <Row name="证据程序" value={M.meta.runtimeSec + " s"} note="一次跑完，读数直连画面" width={1040} color={C.amber} />
              </div>
            </Card>
          </div>
          <div style={{ position: "absolute", left: 1250, top: 300, width: 598 }}>
            <Card label="原文缺口与登记" accent={C.violet}>
              <Body size={FT.body}>
                计划第 2519 行写 C(0.5,0.5;ρ=0.5) = {M.copula.cPlan.toFixed(6)}，违反 Frechet 上界。本集在 errata 与 SELF-AUTH 各登记一次，
                测试同时钉住正确值与越界事实。
              </Body>
              <Mono size={FT.meta} color={C.inkFaint} style={{ display: "block", marginTop: 14 }}>
                docs/09-book-errata.md E29 行 · A66 设计 / A67 证据
              </Mono>
            </Card>
            <Card label="下一集" accent={C.coral} style={{ marginTop: 18 }}>
              <Body size={FT.body}>
                第 30 集切到第四章：异常检测的地基。窗口、指标、评分三件套，同一组模型输出换评分口径，F1 排序会翻转。
              </Body>
            </Card>
          </div>
        </AbsoluteFill>
      </Pages>
    </Scene>
  );
};

