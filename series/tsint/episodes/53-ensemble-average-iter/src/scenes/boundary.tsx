import React from "react";
import { AbsoluteFill } from "remotion";
import { C, FONT, FT } from "../../design/tokens";
import { M, Body, Card, Chip, KV, PAD, Pages, Row, Scene, SceneHead, fmt2, pagesOf } from "../shared";

export const BoundaryScene: React.FC = () => (
  <Scene id="boundary">
    <SceneHead id="boundary" />
    <Pages id="boundary" at={pagesOf("boundary")}>
      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 292, width: 620 }}>
          <Body size={FT.h2} color={C.ink} style={{ lineHeight: 1.3 }}>我们学到<br />什么？</Body>
          <Body style={{ marginTop: 24 }}>
            一章里最值钱的不是公式，是三次落空。计划想当然地认为平均一定赢、调权一定自伤，实测把两条都推翻了。
          </Body>
        </div>
        <div style={{ position: "absolute", left: 720, top: 292, width: 1120 }}>
          <Card label="三条预言的教训" accent={C.amber}>
            <Row name="降方差" value="成立" note="等权低于平均单模型 9.37%" width={1040} color={C.cyan} />
            <Row name="替代挑选" value="不成立" note="等权高于最强单模型 6.35%，0/20" width={1040} color={C.coral} />
            <Row name="调权自伤" value="不成立" note="岭权重和迭代都 20/20 改善" width={1040} color={C.violet} />
            <Row name="根源" value="池子形状" note="六个候选在十以下，挑选已经接近 oracle" width={1040} color={C.amber} />
          </Card>
          <div style={{ marginTop: 20, fontFamily: FONT.mono, fontSize: FT.meta, color: C.inkFaint }}>
            预测没有错，错在把「平均更稳」当成了「平均更强」。
          </div>
        </div>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 290, width: 600 }}>
          <Body size={FT.h2} color={C.ink} style={{ lineHeight: 1.28 }}>为什么<br />赢不过？</Body>
          <Body style={{ marginTop: 24 }}>
            因为十个候选并不对称。六个强、两个弱，等权把权重白送给拖后腿的。而调参段挑选几乎免费，冠军就在池子里躺着。
          </Body>
          <div style={{ marginTop: 20, display: "flex", gap: 10 }}>
            <Chip color={C.cyan}>冠军只差 oracle 0.01</Chip>
            <Chip color={C.coral}>最弱比最强差 6.76</Chip>
          </div>
        </div>
        <div style={{ position: "absolute", left: 700, top: 292, width: 1140 }}>
          <Card label="误差的两条来源，待遇不同" accent={C.cyan}>
            <Row name="方差" value="可以平均掉" note="成员不相关时，除以 K；σ²/10" width={1060} color={C.cyan} />
            <Row name="偏差" value="平均不掉" note="弱成员的偏差原样进平均值" width={1060} color={C.coral} />
            <Row name="挑选" value="几乎免费" note="362–365 天调参段足够选准" width={1060} color={C.amber} />
            <Row name="结论" value="平均只能赢回方差" note="赢不回被偏差吃掉的那部分" width={1060} color={C.violet} />
          </Card>
        </div>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 290, width: 600 }}>
          <Body size={FT.h2} color={C.ink} style={{ lineHeight: 1.28 }}>四个<br />不能推。</Body>
          <Body style={{ marginTop: 24 }}>
            这三百多天、二十只股票、十个候选，只能说明这一种情况。换个池子、换个样本量、换个损失，结论都可能变。
          </Body>
        </div>
        <div style={{ position: "absolute", left: 700, top: 292, width: 1140 }}>
          <Card label="这一集不能推出的四件事" accent={C.coral}>
            <Row name="更大池子" value="未必" note="成员越多、方差越低，但弱成员也越多" width={1060} color={C.coral} />
            <Row name="强相关成员" value="未必" note="相关性高时 1/√K 不成立，降方差有限" width={1060} color={C.coral} />
            <Row name="负权重" value="没测" note="约束非负，放开可能更好也可能爆炸" width={1060} color={C.amber} />
            <Row name="其它损失" value="没测" note="MAE 下中位数天然合适；MSE 下结论会变" width={1060} color={C.amber} />
          </Card>
          <div style={{ marginTop: 18, fontFamily: FONT.mono, fontSize: FT.meta, color: C.inkFaint }}>
            一个池子一条结论。换池子要重跑二十比零，不是照搬。
          </div>
        </div>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 290, width: 590 }}>
          <Body size={FT.h2} color={C.ink} style={{ lineHeight: 1.28 }}>什么时候<br />该集成？</Body>
          <Body style={{ marginTop: 22 }}>
            看账本，不看口号。集成是保险：它把「万一挑错」的代价压小，代价是「挑对时」跑不过冠军。要不要买，看你的损失函数更怕哪种错。
          </Body>
        </div>
        <div style={{ position: "absolute", left: 690, top: 288, width: 1150 }}>
          <Card label="四条适用条件" accent={C.violet}>
            <Row name="成员同质" value="优先" note="同一接口、量纲一致，才能直接平均" width={1070} color={C.cyan} />
            <Row name="相关性低" value="优先" note="误差独立，平均才降方差" width={1070} color={C.cyan} />
            <Row name="挑选不可靠" value="优先" note="样本少、冠军差距小时，平均更稳" width={1070} color={C.violet} />
            <Row name="要保险" value="优先" note="担心单模型崩，集成是廉价保险" width={1070} color={C.violet} />
          </Card>
          <div style={{ marginTop: 22, display: "flex", gap: 34 }}>
            <KV k="等权" v={fmt2(M.levels.equal)} color={C.amber} />
            <KV k="最强单模型" v={fmt2(M.levels.best)} color={C.cyan} />
            <KV k="迭代" v={fmt2(M.levels.iter05)} color={C.violet} />
            <KV k="oracle" v={fmt2(M.levels.oracle)} color={C.cyan} />
          </div>
        </div>
      </AbsoluteFill>
    </Pages>
  </Scene>
);
