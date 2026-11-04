import React from "react";
import { AbsoluteFill } from "remotion";
import { C, FONT, FT } from "../../design/tokens";
import { Body, Card, Chip, Foot, KV, M, PAD, Pages, Row, Scene, SceneHead, fmt2, pagesOf } from "../shared";
import { CrossingSchematic, TauOrderStrip } from "../figs";

export const ProblemScene: React.FC = () => (
  <Scene id="problem">
    <SceneHead id="problem" />
    <Pages id="problem" at={pagesOf("problem")}>
      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 292, width: 620 }}>
          <Body size={FT.h1} color={C.ink} style={{ lineHeight: 1.2 }}>一个数，<br />不够。</Body>
          <Body style={{ marginTop: 26 }}>
            你训练一个模型预测明天收益，它给你一个数，比如零点三。这个数没有告诉你它有多确定，也没有告诉你最坏会到哪。
            风控要的不是一个数，是一个区间：九成情况下不会超出这里。这就是分位数回归要回答的事。
          </Body>
          <div style={{ display: "flex", marginTop: 28 }}>
            <KV k="点预测" v="1 个数" color={C.inkDim} />
            <KV k="区间" v="2 条线" color={C.cyan} />
            <KV k="分位线" v="9 条" color={C.violet} />
          </div>
        </div>
        <div style={{ position: "absolute", left: 790, top: 292, width: 1030 }}>
          <Card label="把输出从一个数扩成一条线" accent={C.cyan}>
            <TauOrderStrip width={900} height={168} />
          </Card>
          <Card label="三种输出，三种用途" accent={C.violet} style={{ marginTop: 14, width: 1020 }}>
            <Row name="点预测" value="一个数" note="最可能的路径，但不知道置信有多高" width={972} color={C.inkDim} valueW={280} />
            <Row name="分位线" value="九个点" note="0.1 到 0.9，每条线回答一个概率问题" width={972} color={C.violet} valueW={280} />
            <Row name="区间" value="两条线夹出来" note="九成区间 = 0.05 与 0.95 两条线的距离" width={972} color={C.cyan} valueW={280} />
          </Card>
        </div>
        <Foot>风控要的不是一个数，是一个区间。</Foot>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 292, width: 620 }}>
          <Body size={FT.h1} color={C.ink} style={{ lineHeight: 1.2 }}>独立训练，<br />各说各话。</Body>
          <Body style={{ marginTop: 26 }}>
            最直接的做法：每个分位点单独训一个模型，九条线就是九个独立的回归。每个只看自己的损失，不知道别的线在哪。
            样本一少、特征一多，估计误差就大。于是某一天，一成线的预测比九成线还高。这不是代码错了，是九个模型各说各话。
          </Body>
          <div style={{ display: "flex", marginTop: 28 }}>
            <KV k="模型" v="9 个" color={C.inkDim} />
            <KV k="书里" v="3–5%" color={C.amber} />
            <KV k="本集" v={fmt2(M.crossing.rate * 100, 2) + "%"} color={C.coral} />
          </div>
        </div>
        <div style={{ position: "absolute", left: 790, top: 292, width: 1030 }}>
          <Card label="左：各自训练 · 右：逐样本排序" accent={C.coral}>
            <CrossingSchematic width={950} height={340} />
          </Card>
          <div style={{ marginTop: 12, fontFamily: FONT.mono, fontSize: FT.micro, color: C.inkFaint, width: 1000 }}>
            图上只画了三条线，实际是九条；任意两条都可能交叉。交叉率就是这么一对一对数出来的。
          </div>
        </div>
        <Foot>量级对上了，说明这不是偶发现象。</Foot>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 292, width: 620 }}>
          <Body size={FT.h1} color={C.ink} style={{ lineHeight: 1.2 }}>交叉不是<br />不好看。</Body>
          <Body style={{ marginTop: 26 }}>
            区间是拿两条线夹出来的。如果上线掉到下线下面，宽度变成负数，你没法解释一个宽度为负的区间，下游的覆盖率统计也会跟着崩。
            更麻烦的是，它只在少数样本上发生，而少数样本会把整体指标悄悄拖偏。
          </Body>
          <div style={{ display: "flex", marginTop: 28 }}>
            <KV k="宽度" v="负数" color={C.coral} />
            <KV k="覆盖率" v="崩" color={C.coral} />
            <KV k="频率" v="少数样本" color={C.amber} />
          </div>
        </div>
        <div style={{ position: "absolute", left: 790, top: 292, width: 1030 }}>
          <Card label="一条交叉会带来的四件事" accent={C.coral} style={{ width: 1020 }}>
            <Row name="区间宽度" value="变成负数" note="上线低于下线，宽度 = 上线 − 下线 小于零" width={972} color={C.coral} valueW={300} />
            <Row name="覆盖率" value="跟着崩" note="夹出来的区间不再有概率含义" width={972} color={C.coral} valueW={300} />
            <Row name="出现频率" value="少数样本" note="正是少数样本，最容易把整体指标拖偏" width={972} color={C.amber} valueW={300} />
            <Row name="两条路" value="约束 或 修正" note="本集走第二条：先量代价，再决定值不值" width={972} color={C.cyan} valueW={300} />
          </Card>
          <div style={{ marginTop: 16, fontFamily: FONT.mono, fontSize: FT.meta, color: C.inkFaint, lineHeight: 1.6, width: 1000 }}>
            输出后修的好处是：不碰训练，不引入新参数，任何已有的分位模型都能直接套用。
          </div>
        </div>
        <Foot>先量清楚代价，再决定值不值。</Foot>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 292, width: 620 }}>
          <Body size={FT.h1} color={C.ink} style={{ lineHeight: 1.2 }}>三个问题，<br />三组检查。</Body>
          <Body style={{ marginTop: 26 }}>
            第一，独立训练到底交叉多少。第二，排序修好之后损失变多少。第三，高斯头的覆盖率配不配得上名义值。
            验收线先写下来：交叉率落在百分之一到十，这是书里的量级；排序后必须归零；损失变化小于百分之二。
          </Body>
          <div style={{ display: "flex", marginTop: 28, gap: 10 }}>
            <Chip color={C.coral}>交叉 1–10%</Chip>
            <Chip color={C.cyan}>重排归零</Chip>
            <Chip color={C.amber}>代价 &lt; 2%</Chip>
          </div>
        </div>
        <div style={{ position: "absolute", left: 790, top: 292, width: 1030 }}>
          <Card label="三个问题 · 三组检查" accent={C.cyan} style={{ width: 1020 }}>
            <Row name="问题一" value="交叉多少" note="crossing 组 6 条：手工样例、881 逆序对、率、归零、多重集、代价" width={972} color={C.coral} valueW={280} />
            <Row name="问题二" value="代价多少" note="pinball 组 4 条：黄金值、退化、中位数、平均损失" width={972} color={C.cyan} valueW={280} />
            <Row name="问题三" value="覆盖率" note="dist 组 4 条：锚点、手算 NLL、覆盖率、解析梯度" width={972} color={C.violet} valueW={280} />
          </Card>
          <div style={{ marginTop: 14, fontFamily: FONT.mono, fontSize: FT.meta, color: C.inkFaint, lineHeight: 1.6, width: 1000 }}>
            验收线在前，读数在后——先写下预期，再打开数据，避免看到结果才编解释。
          </div>
        </div>
        <Foot>三个问题各对应一组检查。</Foot>
      </AbsoluteFill>
    </Pages>
  </Scene>
);
