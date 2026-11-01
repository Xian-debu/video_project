import React from "react";
import { AbsoluteFill } from "remotion";
import { C, FONT, FT } from "../../design/tokens";
import { PAD, M, fmtF, pageAt, Pages, Scene, SceneHead, Card, Row, Body, Verdict, Formula, K, Num, Chip } from "../shared";

export const SBoundary: React.FC = () => {
  const at = [0, pageAt("boundary", 12), pageAt("boundary", 26)];
  const f1 = M.detect.f1;
  const f5 = M.detect.f5;
  return (
    <Scene id="boundary">
      <SceneHead id="boundary" />
      <Pages id="boundary" at={at}>
        {/* 页一：四条边界 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 296, width: 1020 }}>
            <Card label="边界一 · 单资产" accent={C.cyan}>
              <Row name="数据" value="一份日线" note="十六年半，三万多根" width={970} />
              <Row name="不做的" value="跨标的、跨市场" note="换一份数据要重跑，不能直接搬" width={970} />
            </Card>
            <Card label="边界二 · 未来窗的真值" accent={C.amber} style={{ marginTop: 18 }}>
              <Row name="假设" value="注入只改未来窗" note="历史窗保持干净" width={970} />
              <Row name="为什么" value="检测器看的是预测误差" note="改历史等于换题，不是检测" width={970} />
            </Card>
          </div>
          <div style={{ position: "absolute", left: 1180, top: 296, width: 640 }}>
            <Card label="边界三 · 阈值的前提" accent={C.violet}>
              <Row name="前提" value="干净窗占多数" note="分位数才有意义" width={590} />
              <Row name="失效" value="连续异常" note="分位数被自己脏掉" width={590} />
            </Card>
            <Card label="边界四 · 相位" accent={C.coral} style={{ marginTop: 18 }}>
              <Body size={FT.body} color={C.ink}>幅度不变的异常，平方误差看不见 —— 这是分数本身的天花板。</Body>
            </Card>
          </div>
        </AbsoluteFill>

        {/* 页二：三条债 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 296, width: 1020 }}>
            <Card label="债一 · 记忆长度" accent={C.cyan}>
              <Row name="这一集" value="状态不限长度" note="门控记忆，理论上没有硬上限" width={970} />
              <Row name="下一集" value="还是有限窗" note="注意力要自己选看多远" width={970} />
            </Card>
            <Card label="债二 · 相位" accent={C.coral} style={{ marginTop: 18 }}>
              <Row name="F1" value={fmtF(f1.phaseF1, 4)} note={"F=5 也是 " + fmtF(f5.phaseF1, 4)} width={970} />
              <Row name="留给谁" value="后面的频域与形状特征" note="本集只记账，不还" width={970} />
            </Card>
          </div>
          <div style={{ position: "absolute", left: 1180, top: 296, width: 640 }}>
            <Card label="债三 · 多资产" accent={C.violet}>
              <Row name="现状" value="单序列训练" note="一个模型一份数据" width={590} />
              <Row name="代价" value="换资产要重跑" note="没有共享表示" width={590} />
            </Card>
            <div style={{ marginTop: 18 }}>
              <K>三条债都记在路由图里，谁欠的谁还。</K>
            </div>
          </div>
        </AbsoluteFill>

        {/* 页三：设计转向 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 296, width: 1000 }}>
            <Card label="第一版：改历史窗" accent={C.coral}>
              <Row name="做法" value="把注入放进历史" note="让模型看见异常" width={950} />
              <Row name="结果" value="F1 正好零" note="历史一脏，预测全歪" width={950} />
              <Row name="诊断" value="这不是检测，是换题" note="模型在预测被改过的历史" width={950} />
            </Card>
            <Card label="第二版：改未来窗的真值" accent={C.cyan} style={{ marginTop: 18 }}>
              <Row name="做法" value="历史干净，只改未来真值" note="模型正常预测，误差对真值算" width={950} />
              <Row name="结果" value={"尖峰 F1 " + fmtF(f1.spikeF1, 4)} note="单点十五比十五" width={950} />
              <Row name="含义" value="这是脏数据检测" note="检测的是真值里的坏点" width={950} />
            </Card>
          </div>
          <div style={{ position: "absolute", left: 1160, top: 296, width: 660 }}>
            <Card label="为什么值得讲" accent={C.violet}>
              <Body size={FT.body} color={C.ink}>一个零结果的实验，教会了我们检测器的语义：它看的是真值，不是模型。</Body>
            </Card>
            <div style={{ marginTop: 18, display: "flex", gap: 12 }}>
              <Chip color={C.coral}>v1 · 零</Chip>
              <Chip color={C.cyan}>v2 · 15/15</Chip>
            </div>
            <div style={{ marginTop: 18 }}>
              <Verdict ok label="设计转向写进报告" />
            </div>
          </div>
        </AbsoluteFill>
      </Pages>
    </Scene>
  );
};
