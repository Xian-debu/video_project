import React from "react";
import { AbsoluteFill } from "remotion";
import { C, FONT, FT } from "../../design/tokens";
import {
  PAD, M, pagesOf, Pages, Scene, SceneHead, Card, Body, Chip, Row, Formula, fmt4,
} from "../shared";
import { RnnCellFig, TanhChainFig, HeadPoolFig, BrickFig, RfFig } from "../figs";

const rn = M.rnn;
const dl = M.dil;
const br = M.brick;

export const SDefinitions: React.FC = () => {
  const at = pagesOf("definitions");
  return (
    <Scene id="definitions">
      <SceneHead id="definitions" />
      <Pages id="definitions" at={at}>
        {/* 页一：单步 RNN */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 290, width: 640 }}>
            <div style={{ fontFamily: FONT.serif, fontSize: FT.h1, color: C.ink, lineHeight: 1.18 }}>
              先把单步
              <br />
              钉死。
            </div>
            <Body style={{ marginTop: 20, width: 620 }}>
              输入一个数，隐状态四个数。新的隐状态等于 tanh 作用在输入权重、状态权重、偏置上；隐状态和输入拼起来过一层线性，得到三个类的分数。
            </Body>
            <div style={{ marginTop: 20 }}>
              <Row name="隐状态" value="4 维" note="H = 4" color={C.cyan} />
              <Row name="参数" value={String(rn.params)} note="手算就能对上" color={C.violet} />
              <Row name="输出" value="3 个分数" note="三类" color={C.amber} />
            </div>
          </div>
          <div style={{ position: "absolute", left: 740, top: 288, width: 1110 }}>
            <Card label="一步：输入 → tanh → 隐状态 → 线性头" accent={C.cyan} pad={18}>
              <RnnCellFig width={1060} />
            </Card>
          </div>
        </AbsoluteFill>

        {/* 页二：黄金值 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 292, width: 640 }}>
            <div style={{ fontFamily: FONT.serif, fontSize: FT.h1, color: C.ink, lineHeight: 1.18 }}>
              钉第二个
              <br />
              黄金值。
            </div>
            <Body style={{ marginTop: 20, width: 620 }}>
              输入零点五，输入权重一，偏置零，隐状态从零开始。第一步是 tanh 零点五，等于 {fmt4(rn.tanh05)}，不是 0.5。tanh 是压缩：输入再大，输出也到不了一。
            </Body>
            <div style={{ marginTop: 20, display: "flex", gap: 12, flexWrap: "wrap" }}>
              <Chip color={C.coral}>tanh 0.5 = {fmt4(rn.tanh05)}</Chip>
              <Chip color={C.cyan}>不是 0.5</Chip>
            </div>
          </div>
          <div style={{ position: "absolute", left: 740, top: 292, width: 1110 }}>
            <Card label="压缩，也是遗忘的原因" accent={C.coral} pad={20}>
              <TanhChainFig width={1060} />
            </Card>
          </div>
        </AbsoluteFill>

        {/* 页三：平均池化 + 线性 + 损失 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 292, width: 650 }}>
            <div style={{ fontFamily: FONT.serif, fontSize: FT.h1, color: C.ink, lineHeight: 1.18 }}>
              五百个状态，
              <br />
              平均成一个。
            </div>
            <Body style={{ marginTop: 20, width: 630 }}>
              序列走完，把五百个隐状态平均一下，就是时间维的平均池化。平均值过线性层得到三个分数，过 softmax 得到三类概率，损失是交叉熵。
            </Body>
            <div style={{ marginTop: 20 }}>
              <Row name="均匀猜" value={fmt4(rn.lossChance)} note="log 3" color={C.coral} />
              <Row name="梯度差" value={rn.gradDiff.toExponential(2)} note="解析 vs 差分" color={C.cyan} />
            </div>
          </div>
          <div style={{ position: "absolute", left: 760, top: 288, width: 1090 }}>
            <Card label="从五百个隐状态到三个概率" accent={C.amber} pad={20}>
              <HeadPoolFig width={1040} />
            </Card>
          </div>
        </AbsoluteFill>

        {/* 页四：brick 定义 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 292, width: 620 }}>
            <div style={{ fontFamily: FONT.serif, fontSize: FT.h1, color: C.ink, lineHeight: 1.18 }}>
              切块只用
              <br />
              一句话说清。
            </div>
            <Body style={{ marginTop: 20, width: 600 }}>
              五百步，块长五十，正好十块。每块各跑一个 RNN，只留最后一个隐状态；十个状态拼成一条十步的序列，第二层只吃这十步。
            </Body>
            <div style={{ marginTop: 18 }}>
              <Row name="块长" value={String(br.blockLen)} note={br.blocks + " 块"} color={C.cyan} />
              <Row name="参数" value={String(br.params)} note="与窗口长度无关" color={C.violet} />
            </div>
            <div style={{ marginTop: 16 }}>
              <Chip color={C.coral}>代价：块间不通信</Chip>
            </div>
          </div>
          <div style={{ position: "absolute", left: 700, top: 292, width: 1140 }}>
            <Card label="五百步 → 十块 → 十步" accent={C.cyan} pad={18}>
              <BrickFig width={1100} compact />
            </Card>
          </div>
        </AbsoluteFill>

        {/* 页五：空洞公式 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 290, width: 700 }}>
            <div style={{ fontFamily: FONT.serif, fontSize: FT.h1, color: C.ink, lineHeight: 1.18 }}>
              空洞的公式
              <br />
              只多一个 d。
            </div>
            <Body style={{ marginTop: 20, width: 680 }}>
              输出第 i 个点，取输入第 i、i 加 d、i 加二 d 三个点。核长三、间隔 d；d 等于一就退化成普通卷积。输出长度是输入长度减掉核长减一乘 d。
            </Body>
            <div style={{ marginTop: 20, display: "flex", gap: 12, flexWrap: "wrap" }}>
              <Chip color={C.violet}>k = {dl.k}</Chip>
              <Chip color={C.cyan}>d = 1 / 2 / 4 / 8 / 16</Chip>
            </div>
          </div>
          <div style={{ position: "absolute", left: 800, top: 296, width: 1050 }}>
            <Card label="输出长度：一层比一层短" accent={C.violet} pad={26}>
              <Formula note="k 是核长，d 是间隔；五百步过五层，每层核长三">{"L_out = L_in − (k − 1) · d"}</Formula>
              <div style={{ marginTop: 26 }}>
                <Row name="输入长" value="500" note="一条窗口" color={C.inkDim} width={940} />
                <Row name="层数与间隔" value="5 层 · k = 3" note="d = 1, 2, 4, 8, 16" color={C.violet} width={940} />
                <Row name="输出长" value={String(dl.stackLen)} note="不补零" color={C.cyan} width={940} />
              </div>
            </Card>
          </div>
        </AbsoluteFill>

        {/* 页六：感受野 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 292, width: 640 }}>
            <div style={{ fontFamily: FONT.serif, fontSize: FT.h1, color: C.ink, lineHeight: 1.18 }}>
              感受野
              <br />
              是一把尺子。
            </div>
            <Body style={{ marginTop: 20, width: 620 }}>
              感受野等于一加，核长减一，乘间隔之和。四层 d 取一二四八得三十一；再加一层 d 等于十六是六十三。参数只由核长决定：五层、每层核长三，十五个。
            </Body>
            <div style={{ marginTop: 20 }}>
              <Row name="四层" value={"rf " + dl.rf31} note="d 到 8" color={C.coral} />
              <Row name="五层" value={"rf " + dl.rf63} note="再加 d=16" color={C.coral} />
              <Row name="参数" value={dl.stackParams + " / " + dl.plainParams} note="约四分之一" color={C.cyan} />
            </div>
          </div>
          <div style={{ position: "absolute", left: 760, top: 290, width: 1090 }}>
            <Card label="每加一层，尺子变长" accent={C.coral} pad={20}>
              <RfFig width={1040} />
            </Card>
          </div>
        </AbsoluteFill>
      </Pages>
    </Scene>
  );
};
