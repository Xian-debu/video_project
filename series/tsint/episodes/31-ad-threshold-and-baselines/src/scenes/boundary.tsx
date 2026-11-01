import React from "react";
import { AbsoluteFill } from "remotion";
import { C, FONT, FT } from "../../design/tokens";
import { PAD, CW, M, fmtF, pageAt, Pages, Scene, SceneHead, Card, Row, Body, Mono, Chip, TagDot } from "../shared";

export const SBoundary: React.FC = () => {
  const at = [0, pageAt("boundary", 21)];
  return (
    <Scene id="boundary">
      <SceneHead id="boundary" />
      <Pages id="boundary" at={at}>
        {/* 页一：四条边界 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 296, width: CW, display: "flex", gap: 22 }}>
            <Card label="边界一 · 阈值不是超参" accent={C.cyan} style={{ width: 410 }}>
              <Body size={FT.body} color={C.ink}>
                阈值是口径的一部分。同一串分数换阈值就换 F1，所以报 F1 必须报阈值。
              </Body>
            </Card>
            <Card label="边界二 · SPOT 只在厚尾上赢" accent={C.amber} style={{ width: 410 }}>
              <Body size={FT.body} color={C.ink}>
                尾部不是帕累托，它就会偏。股票日收益厚尾是产业结构，换个市场结论要重测。
              </Body>
            </Card>
            <Card label="边界三 · 全局分数看不见局部" accent={C.violet} style={{ width: 410 }}>
              <Body size={FT.body} color={C.ink}>
                中等偏移实验已经证明：三种切法全部低于 0.1。要抓，得先换分数。
              </Body>
            </Card>
            <Card label="边界四 · 分类器受限于样本" accent={C.coral} style={{ width: 410 }}>
              <Body size={FT.body} color={C.ink}>
                训练段几十个正样本，学不出稳定边界。它输给手写 z 分数，不丢人。
              </Body>
            </Card>
          </div>
          <div style={{ position: "absolute", left: PAD, top: 800, width: 1500 }}>
            <Body size={FT.body}>
              这一集不报模型。它报的是尺子：同一串分数，怎么切，切点从哪来，切完 F1 差多少。
            </Body>
            <div style={{ display: "flex", gap: 18, marginTop: 22 }}>
              <Chip color={C.cyan}>分数瞎了，切法再准也没用</Chip>
              <Chip color={C.inkFaint}>阈值是口径，不是能力</Chip>
            </div>
          </div>
        </AbsoluteFill>

        {/* 页二：三笔债 + 下一集 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 300, width: 1040 }}>
            <Card label="三笔债" accent={C.amber}>
              <Row name="第一笔 · 无监督" value="K 均值 · LOF · 孤立森林" note="没有标签的时候，怎么定义异常" width={1000} />
              <Row name="第二笔 · 序列模型" value="自回归 · 状态空间" note="把时间结构用起来" width={1000} />
              <Row name="第三笔 · 阈值自适应" value="今天固定，明天呢" note="这笔债还没还" width={1000} />
            </Card>
            <Card label="下一集 · 无监督异常检测" accent={C.violet} style={{ marginTop: 22 }}>
              <Row name="问题" value="没有标签，怎么定义异常" width={1000} />
              <Row name="三个方法" value="K 均值 · LOF · 孤立森林" note="都不看真值" width={1000} />
              <Row name="难点" value="F1 怎么算" note="无监督的评分，和阈值是一道题" width={1000} />
            </Card>
          </div>
          <div style={{ position: "absolute", left: 1240, top: 300, width: 580 }}>
            <Card label="留给观众的判断" accent={C.cyan}>
              <Body size={FT.body} color={C.ink}>
                下次看到一篇异常检测论文报 F1，先问三件事：阈值怎么定的？扫过风险率吗？有没有和移动平均比？三个问题里有两个没答，那个 F1 就没法复现。
              </Body>
            </Card>
            <Card label="这一集的尺子" accent={C.amber} style={{ marginTop: 18 }}>
              <Body size={FT.meta} color={C.inkDim}>
                尖峰上 SPOT 到一，中等偏移上三种切法全低于 0.1。两端一放，这条数据的边界就清楚了。
              </Body>
            </Card>
          </div>
        </AbsoluteFill>
      </Pages>
    </Scene>
  );
};
