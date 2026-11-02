import React from "react";
import { AbsoluteFill } from "remotion";
import { C, FONT, FT } from "../../design/tokens";
import {
  PAD, M, pagesOf, Pages, Scene, SceneHead, Card, Body, Chip, Stat, Row,
  fmt4, fmtInt,
} from "../shared";

const mt = M.meta;
const rl = M.real;

export const SOutro: React.FC = () => {
  const at = pagesOf("outro");
  return (
    <Scene id="outro">
      <SceneHead id="outro" />
      <Pages id="outro" at={at}>
        {/* 页一：本集读数 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 288, width: 820 }}>
            <div style={{ fontFamily: FONT.serif, fontSize: FT.h1, color: C.ink, lineHeight: 1.18 }}>
              min 换成 SoftMin，
              <br />
              模板就能学了。
            </div>
            <Body style={{ marginTop: 20, width: 780 }}>
              这一集把不可导的最小值换成可导的软最小值，推出它的梯度是 softmax，用三段退火把五个模板训练出来。真实收益上的准确率从零点三四二九到零点五五二四，同时否掉了书里两条定量结论。
            </Body>
            <div style={{ marginTop: 22, display: "flex", gap: 10 }}>
              <Chip color={C.cyan}>黄金值 −1.0986</Chip>
              <Chip color={C.amber}>35 / 35 检查</Chip>
              <Chip color={C.inkDim}>{mt.newCases} 条新断言</Chip>
            </div>
          </div>
          <div style={{ position: "absolute", left: 940, top: 292, width: 880 }}>
            <Card label="本集读数" accent={C.cyan} pad={22}>
              <Row name="真实准确率" value={fmt4(rl.lsAcc)} note={"搜索模板 " + fmt4(rl.searchBaseline)} color={C.cyan} />
              <Row name="三段退火" value={fmt4(M.anneal.losses[0], 4) + " → " + fmt4(M.anneal.losses[M.anneal.losses.length - 1], 4)} note="损失下降" color={C.amber} />
              <Row name="α = 1000" value={fmt4(M.stall.lossChangePct, 1) + "%"} note="下溢但没停" color={C.violet} />
              <Row name="证据检查" value={mt.evidence.passed + " / " + mt.evidence.checks} note={fmt4(mt.evidence.seconds, 1) + " 秒"} color={C.cyan} />
            </Card>
          </div>
        </AbsoluteFill>

        {/* 页二：下一集 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 292, width: 860 }}>
            <div style={{ fontFamily: FONT.serif, fontSize: FT.display, color: C.ink, lineHeight: 1.12 }}>
              下一集：
              <br />
              卷积、残差
              <br />
              与 GAP。
            </div>
            <Body style={{ marginTop: 20, width: 820 }}>
              模板告诉我们「哪一小段形状重要」，但没告诉我们「它出现在第几天」。下一集换成卷积核，直接扫描整条窗口；残差让网络变深；GAP 把最后一层压成一个热力图，指出哪几天在起作用。
            </Body>
          </div>
          <div style={{ position: "absolute", left: 980, top: 292, width: 840 }}>
            <Card label="下一集的三件事" accent={C.cyan} pad={22}>
              <Row name="卷积" value="局部感受野" note="形状在哪几天" color={C.cyan} />
              <Row name="残差" value="深层也能训" note="跳连不衰减梯度" color={C.amber} />
              <Row name="GAP-CAM" value="时间热力图" note="哪几天在起作用" color={C.violet} />
              <div style={{ marginTop: 16 }}>
                <Chip color={C.inkDim}>{mt.next.minutes} 分钟 · {mt.next.id}</Chip>
              </div>
            </Card>
          </div>
        </AbsoluteFill>
      </Pages>
    </Scene>
  );
};
