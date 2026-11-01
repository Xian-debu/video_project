import React from "react";
import { AbsoluteFill } from "remotion";
import { C, FONT, FT } from "../../design/tokens";
import {
  PAD, M, md, modelKeys, modelColor, modelShort, pagesOf, Pages, Scene, SceneHead,
  Card, Row, Body, Verdict, Chip, Stat, Formula, Bars, CheckRow, checksLike,
} from "../shared";

export const SProblem: React.FC = () => {
  const at = pagesOf("problem");
  return (
    <Scene id="problem">
      <SceneHead id="problem" />
      <Pages id="problem" at={at}>
        {/* 页一：三个隐藏前提 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 282, width: 900 }}>
            <div style={{ fontFamily: FONT.serif, fontSize: FT.h2, color: C.ink, lineHeight: 1.3 }}>
              方法都给了，前提没给。
            </div>
            <Body style={{ marginTop: 22, width: 860 }}>
              训练集、验证集、测试集切成三段，模型只在训练段训练，阈值在验证段挑，读数在测试段算。听起来干净，但三个方法都靠三个没写出来的前提。
            </Body>
            <Formula size={34} color={C.cyan} style={{ marginTop: 30 }}>
              s<sub>t</sub> = f(x<sub>t−m+1</sub> … x<sub>t</sub>)
            </Formula>
            <Body style={{ marginTop: 10, fontSize: FT.meta }}>
              窗口一百天，滑动一格一个窗口；一个窗口一个分数，再按窗口判异常。窗口之间重叠九十九天，所以读数不是一千二百二十九个独立样本。
            </Body>
          </div>
          <div style={{ position: "absolute", left: 1000, top: 282, width: 860 }}>
            <Card label="三个隐藏前提" accent={C.coral} pad={24}>
              <Row name="前提一：同分布" value="2018 的模型看 2021" note="训练、测试之间隔着两年验证期；风格切换，模型没见过。" />
              <Row name="前提二：阈值可迁移" value="验证段挑 τ" note="验证段和测试段的分数分布不一样，τ 搬过去就偏。" />
              <Row name="前提三：集成更稳" value="中位数一定更好？" note="成员都错的时候，中位数也只是把错误平均了一下。" />
              <Row name="落地" value="三处都写进协议" note="阈值只从验证段来；测试段不参与调参；四个模型同一套口径。" color={C.cyan} />
            </Card>
            <div style={{ marginTop: 18, fontFamily: FONT.sans, fontSize: FT.meta, color: C.inkFaint, lineHeight: 1.7 }}>
              书里只写「用神经网络学正常模式」，剩下全是口径：窗口多长、阈值从哪来、集成取中位数还是均值。
            </div>
          </div>
        </AbsoluteFill>

        {/* 页二：验证段到测试段的掉分 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 282, width: 880 }}>
            <div style={{ fontFamily: FONT.serif, fontSize: FT.h2, color: C.ink }}>
              验证段好看，测试段掉下来。
            </div>
            <Body style={{ marginTop: 22, width: 840 }}>
              阈值在验证段挑到 F1 最优，四个模型验证段都在零点二八到零点三一之间。搬到测试段，USAD 和 DAGMM 只掉几个点，
              多 AE 从零点二八掉到零点零六，单 AE 掉到零点二二。
            </Body>
            <div style={{ display: "flex", gap: 16, marginTop: 26 }}>
              <Stat label="验证段最高" value={Math.max(...modelKeys.map((k) => md(k).f1Val)).toFixed(4)} sub="单 AE 基线" accent={C.inkDim} style={{ width: 260 }} />
              <Stat label="测试段最高" value={Math.max(...modelKeys.map((k) => md(k).f1)).toFixed(4)} sub="DAGMM" accent={C.violet} style={{ width: 260 }} />
              <Stat label="最大落差" value={(md("ens").f1Val - md("ens").f1).toFixed(4)} sub="多 AE：验证到测试" accent={C.coral} style={{ width: 280 }} />
            </div>
            <Body style={{ marginTop: 26, width: 840, color: C.inkDim }}>
              这不是「集成没用」，是集成的稳定假象只在验证段成立：五个成员在验证段一致地偏高，中位数也偏高；到了测试段，
              一半成员失灵，中位数反而被拖到阈值以下，几乎不报警。
            </Body>
          </div>
          <div style={{ position: "absolute", left: 1000, top: 282, width: 860 }}>
            <Card label="验证段 / 测试段 F1" accent={C.amber} pad={26}>
              <Bars
                width={800}
                rowH={64}
                items={modelKeys.map((k) => ({
                  label: modelShort[k],
                  value: md(k).f1Val,
                  text: md(k).f1Val.toFixed(4),
                  color: modelColor[k],
                  dim: false,
                }))}
                unit="验证段"
              />
              <div style={{ height: 14 }} />
              <Bars
                width={800}
                rowH={64}
                items={modelKeys.map((k) => ({
                  label: modelShort[k],
                  value: md(k).f1,
                  text: md(k).f1.toFixed(4),
                  color: modelColor[k],
                }))}
                unit="测试段（同一条阈值规则）"
              />
            </Card>
          </div>
        </AbsoluteFill>

        {/* 页三：注入配方 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 282, width: 900 }}>
            <div style={{ fontFamily: FONT.serif, fontSize: FT.h2, color: C.ink }}>
              真值是人造的，配方要写死。
            </div>
            <Body style={{ marginTop: 22, width: 860 }}>
              尖峰：八个段，每段把一天的对数收益乘以五到十个标准差，符号随机，段内只标这一天。
              漂移：八个段，每段二十天，把收益率加一个线性斜坡，斜坡符号翻转，真值是整段二十天。
            </Body>
            <div style={{ marginTop: 26 }}>
              <Row name="尖峰" value={M.inject.spikeSegments + " 段"} note="单点注入，真值只标注入点" />
              <Row name="漂移" value={M.inject.driftSegments + " 段"} note="二十天斜坡，真值整段" />
              <Row name="真值窗" value={M.inject.truthPoints + " 个"} note={"占测试窗 " + M.inject.truthPct.toFixed(1) + "%"} color={C.coral} />
              <Row name="种子" value={"尖峰 " + M.inject.seedSpike + " · 漂移 " + M.inject.seedDrift} note={"验证段另用 " + M.inject.valSeedSpike + " / " + M.inject.valSeedDrift} />
            </div>
          </div>
          <div style={{ position: "absolute", left: 1000, top: 282, width: 860 }}>
            <Card label="注入位置的两条纪律" accent={C.cyan} pad={26}>
              <Body style={{ fontSize: FT.meta, lineHeight: 1.8 }}>
                一、起点不早于第一百二十天。窗口长一百，起点太早，真值窗口和真值点对不上，读数会虚高。
              </Body>
              <Body style={{ fontSize: FT.meta, lineHeight: 1.8, marginTop: 12 }}>
                二、段与段之间至少隔二十五个点，尖峰和漂移互不覆盖。之前两段漂移叠在一起，真值多算了十四天，查出来才改对。
              </Body>
              <div style={{ marginTop: 18 }}>
                <Verdict ok label="注入与真值同一份代码生成，逐点可复现" />
              </div>
            </Card>
            <Card label="读数只认窗口" accent={C.violet} pad={26} style={{ marginTop: 18 }}>
              <Body style={{ fontSize: FT.meta, lineHeight: 1.8 }}>
                测试段一千三百二十八个点，但模型看的是窗口。窗口数 {M.windows.test}，真值窗 {M.inject.truthPoints}。
                所有 F1 都在窗口层算，不换算成天。
              </Body>
            </Card>
          </div>
        </AbsoluteFill>
      </Pages>
    </Scene>
  );
};
