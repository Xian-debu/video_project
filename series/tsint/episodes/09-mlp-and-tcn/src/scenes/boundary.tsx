import React from "react";
import { Build } from "../../design/primitives";
import { C, FONT, FT } from "../../design/tokens";
import { Body, Card, Chip, K, M, PAD, Pages, Scene, SceneHead, Stat, lf } from "../shared";

/* 边界：五条边界，一句话。 */

const Line: React.FC<{ no: string; head: string; text: string; color: string }> = ({ no, head, text, color }) => (
  <div style={{ width: 870, height: 214, background: C.panel, border: "1px solid " + C.panelLine, borderTop: "2px solid " + color, borderRadius: 14, padding: 24, boxSizing: "border-box" }}>
    <div style={{ display: "flex", gap: 14, alignItems: "baseline" }}>
      <K color={color}>边界 {no}</K>
    </div>
    <div style={{ fontFamily: FONT.sans, fontSize: FT.h2, color: C.ink, marginTop: 10 }}>{head}</div>
    <Body size={FT.meta} style={{ marginTop: 10 }}>{text}</Body>
  </div>
);

export const SBoundary: React.FC = () => {
  const m = M;
  return (
    <Scene id="boundary">
      <SceneHead id="boundary" />
      <Pages id="boundary" at={[0, 0.26, 0.5, 0.72]}>
        <div>
          <div style={{ position: "absolute", left: PAD, top: 236, fontFamily: FONT.sans, fontSize: FT.h2, color: C.inkDim }}>
            五条边界，一条一条说。前两条关于「能看见什么」。
          </div>
          <Build at={lf("boundary", 0.03)}>
            <div style={{ position: "absolute", left: PAD, top: 306, display: "flex", gap: 24 }}>
              <Line no="一" head="MLP 没有时间结构" text="这不是缺点，是选择。窗口内的顺序不参与建模；把窗口打乱，它就学成另一个模型。" color={C.cyan} />
              <Line no="二" head="卷积的视野是有限的" text={"15 步就是 15 步。超过 15 步的依赖，它看不见；想看得更远，就得加层、加膨胀、加核长。"} color={C.violet} />
            </div>
          </Build>
          <Build at={lf("boundary", 0.1)}>
            <div style={{ position: "absolute", left: PAD, top: 566, width: 1776 }}>
              <Card accent={C.amber} style={{ height: 140 }}>
                <div style={{ fontFamily: FONT.sans, fontSize: FT.h2, color: C.ink }}>每一样都有代价：层数涨参数，膨胀涨下限，核长涨单层计算。</div>
              </Card>
            </div>
          </Build>
        </div>

        <div>
          <div style={{ position: "absolute", left: PAD, top: 236, fontFamily: FONT.sans, fontSize: FT.h2, color: C.inkDim }}>
            第三条关于数据，第四条关于超参。
          </div>
          <Build at={lf("boundary", 0.29)}>
            <div style={{ position: "absolute", left: PAD, top: 306, display: "flex", gap: 24 }}>
              <Line no="三" head="日频数据，别指望高 R 方" text={"实测比零预测还差一点点（1.0215 / 1.0495）。这不是失败，是这一行数据的常态。"} color={C.coral} />
              <Line no="四" head="超参不是书里的" text="tanh、Adam、批大小、早停，都是我们选的。换一套，数字会变——所以证据写的是这一套的结论。" color={C.amber} />
            </div>
          </Build>
          <Build at={lf("boundary", 0.37)}>
            <div style={{ position: "absolute", left: PAD, top: 566, fontFamily: FONT.sans, fontSize: FT.body, color: C.inkDim }}>
              论文里的高 R 方，多数在低频或强信号数据上；日频收益率不是那个场景。
            </div>
          </Build>
        </div>

        <div>
          <div style={{ position: "absolute", left: PAD, top: 236, fontFamily: FONT.sans, fontSize: FT.h2, color: C.inkDim }}>
            第五条，也是这一集最想留下的一条。
          </div>
          <Build at={lf("boundary", 0.53)}>
            <div style={{ position: "absolute", left: PAD, top: 306, width: 1776 }}>
              <Card label="边界 五" accent={C.cyan} style={{ height: 300 }}>
                <div style={{ fontFamily: FONT.serif, fontSize: FT.h1, color: C.ink }}>因果性测试比损失更可信。</div>
                <Body size={FT.body} style={{ marginTop: 18 }}>损失下降，只能说明拟合；拟合得好，不代表结构对。一个看到未来的模型，损失会更低——因为未来就是答案。</Body>
                <K style={{ display: "block", marginTop: 18 }}>所以每次改卷积，先跑因果性测试</K>
              </Card>
            </div>
          </Build>
          <Build at={lf("boundary", 0.6)}>
            <div style={{ position: "absolute", left: PAD, top: 660, display: "flex", gap: 14, alignItems: "center" }}>
              <Chip color={C.cyan}>maxdiff = {m.tcn.causal.pastMaxdiff}</Chip>
              <Body size={FT.body} style={{ marginLeft: 8 }}>这是唯一一条不依赖训练、不依赖数据的断言。</Body>
            </div>
          </Build>
        </div>

        <div>
          <div style={{ position: "absolute", left: PAD, top: 236, fontFamily: FONT.sans, fontSize: FT.h2, color: C.inkDim }}>
            五条边界，其实是一句话。
          </div>
          <Build at={lf("boundary", 0.75)}>
            <div style={{ position: "absolute", left: PAD, top: 306, width: 1776 }}>
              <Card accent={C.violet} style={{ height: 250 }}>
                <div style={{ fontFamily: FONT.serif, fontSize: FT.display, color: C.ink }}>结构决定它能看见什么。</div>
                <Body size={FT.h2} style={{ marginTop: 16, color: C.inkDim }}>看不见的东西，训练是补不回来的。</Body>
              </Card>
            </div>
          </Build>
          <Build at={lf("boundary", 0.83)}>
            <div style={{ position: "absolute", left: PAD, top: 606, display: "flex", gap: 24 }}>
              <Stat label="600519" accent={C.cyan} value={m.data.daily600519.rows.toLocaleString("en-US") + " 行"} sub={"从 " + m.data.daily600519.first.slice(0, 4) + " 年开始；最长缺口是停牌"} valueColor={C.cyan} style={{ width: 570, height: 200 }} />
              <Stat label="000001" accent={C.violet} value={m.data.daily000001.rows.toLocaleString("en-US") + " 行"} sub={"从 " + m.data.daily000001.first.slice(0, 4) + " 年开始；同样按行取窗"} valueColor={C.violet} style={{ width: 570, height: 200 }} />
              <Stat label="窗口取法" accent={C.amber} value="按行" sub="停牌不是缺失，是没有交易日；不按日历填" valueColor={C.amber} style={{ width: 588, height: 200 }} />
            </div>
          </Build>
        </div>
      </Pages>
    </Scene>
  );
};
