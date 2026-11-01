import React from "react";
import { AbsoluteFill } from "remotion";
import { C, FONT, FT } from "../../design/tokens";
import {
  PAD, M, md, modelKeys, modelColor, modelShort, pagesOf, Pages, Scene, SceneHead,
  Card, Row, Body, Verdict, Chip, Stat, fmtInt,
} from "../shared";

export const SBoundary: React.FC = () => {
  const at = pagesOf("boundary");
  return (
    <Scene id="boundary">
      <SceneHead id="boundary" />
      <Pages id="boundary" at={at}>
        {/* 页一：五条边界 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 282, width: 900 }}>
            <div style={{ fontFamily: FONT.serif, fontSize: FT.h2, color: C.ink }}>
              不声称的事，先摆出来。
            </div>
            <Body style={{ marginTop: 22, width: 860 }}>
              这一集只回答「三个神经网络判据在日频单票上是什么表现」，不回答「哪个方法更好」，也不声称任何一个能上生产。
            </Body>
            <div style={{ marginTop: 26 }}>
              <Row name="不声称 SOTA" value="无公开基准" note="一只票、五十七项检查，够说明现象，不够排名" />
              <Row name="不声称通用" value="A 股 · 白酒" note="换市场、换品种，全部重跑" />
              <Row name="不声称实时" value="日频 · 收盘后" note="批处理；没有在线检测的延迟与漂移处理" />
              <Row name="不声称集成更稳" value="实测更差" note="验证段 0.28，测试段 0.06，方向反了" />
              <Row name="不声称能量可比" value="量纲不同" note="负对数似然与重建误差没有换算关系" />
            </div>
          </div>
          <div style={{ position: "absolute", left: 1010, top: 282, width: 850 }}>
            <Card label="一条方法论" accent={C.cyan} pad={26}>
              <Body style={{ fontSize: FT.meta, lineHeight: 1.9 }}>
                一个方法「有效」至少要同时满足：验证段能挑出阈值、测试段不掉太多、失败方式能被解释。这一集里，第三个条件比前两个更难。
              </Body>
            </Card>
            <Card label="为什么还是要报" accent={C.amber} pad={26} style={{ marginTop: 18 }}>
              <Body style={{ fontSize: FT.meta, lineHeight: 1.9 }}>
                四个读数都在零点二五以下，正是这一集的信息量：书里三句话听起来都成立，实测三种失败。把这三种失败写清楚，比报一个零点八有用。
              </Body>
            </Card>
          </div>
        </AbsoluteFill>

        {/* 页二：三条债 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 282, width: 1730 }}>
            <div style={{ fontFamily: FONT.serif, fontSize: FT.h2, color: C.ink }}>
              三条债，这一集没还。
            </div>
          </div>
          <div style={{ position: "absolute", left: PAD, top: 382, width: 1730, display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 22 }}>
            <Card label="一 · 对抗不稳定" accent={C.coral} pad={24}>
              <Stat label="L1 末值" value={fmtInt(M.usad.l1Last)} sub={"暖启动末值 " + fmtInt(M.usad.l1[19])} valueSize={40} valueColor={C.coral} />
              <Body style={{ fontSize: FT.meta, lineHeight: 1.8, marginTop: 12 }}>
                对抗训练没有收敛保证，轮次一多曲线就翘。什么时候停，本集用固定二十轮，没有回答「早停应该按什么指标」。
              </Body>
            </Card>
            <Card label="二 · 集成为什么全错" accent={C.amber} pad={24}>
              <Stat label="多 AE 测试段 F1" value={md("ens").f1.toFixed(4)} sub={"验证段 " + md("ens").f1Val.toFixed(4)} valueSize={40} valueColor={C.amber} />
              <Body style={{ fontSize: FT.meta, lineHeight: 1.8, marginTop: 12 }}>
                只看到「掉下来」，没有拆开看每个成员的分数。五个成员各自的测试段表现，是下一集可以补的实验。
              </Body>
            </Card>
            <Card label="三 · 窗口重叠" accent={C.violet} pad={24}>
              <Stat label="重叠天数" value={M.data.window - 1 + " 天"} sub={"每个窗口与相邻窗口共享 " + (M.data.window - 1) + " 天"} valueSize={40} valueColor={C.violet} />
              <Body style={{ fontSize: FT.meta, lineHeight: 1.8, marginTop: 12 }}>
                1228 个窗口不是独立样本，F1 的置信区间没法直接算。这一集只报点估计，不报区间。
              </Body>
            </Card>
          </div>
          <div style={{ position: "absolute", left: PAD, top: 830, width: 1730 }}>
            <Row name="三条都留给后续" value="早停准则 · 成员诊断 · 重叠样本的区间估计" note="不是这一集的旁枝，是下一集之后要还的主债。" color={C.coral} />
          </div>
        </AbsoluteFill>

        {/* 页三：下一集 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 282, width: 900 }}>
            <div style={{ fontFamily: FONT.serif, fontSize: FT.h2, color: C.ink }}>
              下一集：给「正常」加一个先验。
            </div>
            <Body style={{ marginTop: 22, width: 860 }}>
              这一集三个方法都在回答「怎么学正常」。下一个问题是「正常本来长什么样」：SPADE 用少量正常样本做条件先验，
              DualAttention 在特征和样本两个方向上加权，再用少样本设定考验它们。
            </Body>
            <div style={{ display: "flex", gap: 14, marginTop: 26 }}>
              <Chip color={C.cyan}>SPADE</Chip>
              <Chip color={C.violet}>DualAttention</Chip>
              <Chip color={C.amber}>少样本</Chip>
            </div>
            <div style={{ marginTop: 22, fontFamily: FONT.mono, fontSize: FT.meta, color: C.inkFaint }}>
              ad-sparse-prior-dual-attention · 约 30 分钟
            </div>
          </div>
          <div style={{ position: "absolute", left: 1010, top: 282, width: 850 }}>
            <Card label="从「学正常」换到「先验正常」" accent={C.cyan} pad={26}>
              <Row name="SPADE" value="少样本 + 先验" note="用少量正常样本构造条件分布，而不是从零学" />
              <Row name="DualAttention" value="两个方向加权" note="特征维度和样本维度各一套注意力" />
              <Row name="少样本" value="每类 k 个正常样本" note="k 很小，考的是先验的质量" />
              <Body style={{ fontSize: FT.meta, lineHeight: 1.8, marginTop: 12 }}>
                不变的问题：训练上学到的「正常」，到测试段还算不算正常——只是这一次，「正常」的样本更少了。
              </Body>
            </Card>
          </div>
        </AbsoluteFill>
      </Pages>
    </Scene>
  );
};
