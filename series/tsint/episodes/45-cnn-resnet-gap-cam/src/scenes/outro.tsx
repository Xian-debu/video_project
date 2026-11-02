import React from "react";
import { AbsoluteFill } from "remotion";
import { C, FONT, FT } from "../../design/tokens";
import { PAD, M, pagesOf, Pages, Scene, SceneHead, Card, Body, Chip, Row, fmt4 } from "../shared";

const md = M.models;
const mt = M.meta;

export const SOutro: React.FC = () => {
  const at = pagesOf("outro");
  return (
    <Scene id="outro">
      <SceneHead id="outro" />
      <Pages id="outro" at={at}>
        {/* 页一：本集读数 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 288, width: 780 }}>
            <div style={{ fontFamily: FONT.serif, fontSize: FT.h1, color: C.ink, lineHeight: 1.18 }}>
              卷积有用，
              <br />
              残差没加分。
            </div>
            <Body style={{ marginTop: 20, width: 760 }}>
              卷积比线性高 {fmt4((md.cnn.testAcc - md.linear.testAcc) * 100, 1)} 个百分点；再加深到四块残差，反而掉下来，最浅的一块最好；GAP-CAM 拿热图，代价是 {fmt4((md.cnn.testAcc - md.gapcam.testAcc) * 100, 1)} 个百分点。可解释性是真的拿到了，精度没有白拿。
            </Body>
            <div style={{ marginTop: 20, display: "flex", gap: 12 }}>
              <Chip color={C.cyan}>27 / 27 检查</Chip>
              <Chip color={C.amber}>新增 {mt.newCases} 条断言</Chip>
            </div>
          </div>
          <div style={{ position: "absolute", left: 900, top: 288, width: 950 }}>
            <Card label="本集读数" accent={C.cyan} pad={22}>
              <Row name="卷积 · 测试" value={fmt4(md.cnn.testAcc)} note={"线性 " + fmt4(md.linear.testAcc)} color={C.cyan} />
              <Row name="浅残差 · 测试" value={fmt4(md.resnetShallow.testAcc)} note="本集最高" color={C.violet} />
              <Row name="GAP-CAM · 测试" value={fmt4(md.gapcam.testAcc)} note="换热图" color={C.amber} />
              <Row name="证据检查" value={mt.evidence.passed + " / " + mt.evidence.checks} note={mt.evidence.seconds.toFixed(1) + " 秒"} color={C.cyan} />
            </Card>
          </div>
        </AbsoluteFill>

        {/* 页二：下一集 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 288, width: 780 }}>
            <div style={{ fontFamily: FONT.serif, fontSize: FT.h1, color: C.ink, lineHeight: 1.18 }}>
              下一集：
              <br />
              谁看得更远。
            </div>
            <Body style={{ marginTop: 20, width: 760 }}>
              卷积的核长决定了它一眼能看多远。下一集把窗口切成十块并行跑 RNN，训练时间降到六分之一；再用空洞卷积，用五分之一的参数拿到同样的感受野。三条路线比谁看得远。
            </Body>
            <div style={{ marginTop: 20 }}>
              <Chip color={C.inkDim}>{mt.next.minutes} 分钟 · {mt.next.id}</Chip>
            </div>
          </div>
          <div style={{ position: "absolute", left: 900, top: 292, width: 950 }}>
            <Card label="下一集的三件事" accent={C.cyan} pad={22}>
              <Row name="切块 RNN" value="并行十条" note="训练快六倍" color={C.cyan} />
              <Row name="空洞卷积" value="跳着看" note="参数省五倍" color={C.violet} />
              <Row name="感受野" value="谁看得更远" note="同一把尺" color={C.amber} />
            </Card>
          </div>
        </AbsoluteFill>
      </Pages>
    </Scene>
  );
};
