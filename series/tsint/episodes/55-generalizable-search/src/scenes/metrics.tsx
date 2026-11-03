import React from "react";
import { AbsoluteFill } from "remotion";
import { C, FONT, FT } from "../../design/tokens";
import { M, Body, Card, Chip, Foot, KV, PAD, Pages, Row, Scene, SceneHead, fmt4, pagesOf } from "../shared";
import { BoxDrift, RealBars } from "../figs";

export const MetricsScene: React.FC = () => (
  <Scene id="metrics">
    <SceneHead id="metrics" />
    <Pages id="metrics" at={pagesOf("metrics")}>
      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 292, width: 620 }}>
          <Body size={FT.h2} color={C.ink} style={{ lineHeight: 1.3 }}>先算抬升，<br />再谈输赢。</Body>
          <Body style={{ marginTop: 24 }}>
            阈值三点三零一四之上的点有一万个，随机采一万次就能碰到。四种做法的最大值都越线，所以真正的区别是比随机高多少。
          </Body>
          <div style={{ display: "flex", marginTop: 24 }}>
            <KV k="随机" v={fmt4(M.synth.randomBest)} color={C.inkDim} />
            <KV k="最高" v={fmt4(M.synth.combBest)} color={C.cyan} />
            <KV k="抬升" v="0.1424" color={C.violet} />
          </div>
        </div>
        <div style={{ position: "absolute", left: 740, top: 286, width: 1100 }}>
          <Card label="四个最大值，和它们的差值" accent={C.cyan}>
            <Row name="随机基线" value={fmt4(M.synth.randomBest)} note="四个值都要跟它比" width={980} color={C.inkDim} />
            <Row name="子空间" value={fmt4(M.synth.cherryBest)} note={"+" + fmt4(M.synth.gaps.cherry)} width={980} color={C.cyan} />
            <Row name="比较器" value={fmt4(M.synth.cmpBest)} note={"+" + fmt4(M.synth.gaps.cmp)} width={980} color={C.violet} />
            <Row name="组合预测器" value={fmt4(M.synth.combBest)} note={"+" + fmt4(M.synth.gaps.comb)} width={980} color={C.amber} />
          </Card>
          <div style={{ marginTop: 18, fontFamily: FONT.mono, fontSize: FT.meta, color: C.inkFaint }}>
            抬升约 2.7% 到 3.8%；方向对，幅度小。合成空间的分数在 3.24 到 3.98 之间。
          </div>
        </div>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 292, width: 620 }}>
          <Body size={FT.h2} color={C.ink} style={{ lineHeight: 1.3 }}>省下的不是零头，<br />是几十倍。</Body>
          <Body style={{ marginTop: 24 }}>
            子空间和组合预测器都采满一万次，比较器只用二百零一次就完成排序：二百个成对样本，加上一次整体评估。它省的是评估次数，不是精度。
          </Body>
          <div style={{ marginTop: 24 }}>
            <Chip color={C.cyan}>10,000 → 201</Chip>
            <Chip color={C.coral} style={{ marginLeft: 10 }}>约五十倍</Chip>
          </div>
        </div>
        <div style={{ position: "absolute", left: 740, top: 286, width: 1100 }}>
          <Card label="四种做法的评估次数" accent={C.cyan}>
            <Row name="随机基线" value="10,000" note="均匀采样，取最大" width={980} color={C.inkDim} />
            <Row name="子空间" value="10,000" note="6,000 + 3,000 + 1,000" width={980} color={C.cyan} />
            <Row name="比较器" value="201" note="200 对 + 1 次整体评估" width={980} color={C.violet} />
            <Row name="组合预测器" value="10,000" note="八块 × 二十点，再挖剩下预算" width={980} color={C.amber} />
          </Card>
          <div style={{ marginTop: 18, fontFamily: FONT.mono, fontSize: FT.meta, color: C.inkFaint }}>
            预算相同不代表花费相同：比较器把大头花在「排序」而不是「逐个评估」上。
          </div>
        </div>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 292, width: 600 }}>
          <Body size={FT.h2} color={C.ink} style={{ lineHeight: 1.3 }}>盒子缩得快，<br />方向却偏了。</Body>
          <Body style={{ marginTop: 24 }}>
            三轮之后体积从零点零七七缩到零点零零零五，缩了一百五十倍；但盒心停在零点七一附近，没有到四个角。
          </Body>
          <div style={{ marginTop: 24, fontFamily: FONT.mono, fontSize: FT.meta, color: C.inkFaint, lineHeight: 1.9 }}>
            主轴 [0.65, 0.79]；最优角在 0.9 以上。<br />
            收缩是有效的，前提是「好点在中间」。
          </div>
        </div>
        <div style={{ position: "absolute", left: 720, top: 286, width: 1150 }}>
          <Card label="三轮收缩：盒子变小，但没有到角" accent={C.coral}>
            <BoxDrift size={400} />
          </Card>
        </div>
        <Foot accent={C.coral}>省评估是真的，找对位置是另一回事。</Foot>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 292, width: 580 }}>
          <Body size={FT.h2} color={C.ink} style={{ lineHeight: 1.3 }}>换到真实任务，<br />差距只剩万分之几。</Body>
          <Body style={{ marginTop: 24 }}>
            十二个架构，检验误差从六点一七八到六点二三八。最好的 L5-mom 比零基线好万分之三；长回看的 L20-raw 反而最差。
          </Body>
          <div style={{ marginTop: 24 }}>
            <KV k="零基线" v={fmt4(M.real.zeroMae)} color={C.cyan} />
            <KV k="最好" v={fmt4(M.real.best.mae)} color={C.violet} />
            <KV k="全距" v={M.real.spreadPct.toFixed(4) + "%"} color={C.coral} />
          </div>
        </div>
        <div style={{ position: "absolute", left: 700, top: 286, width: 1170 }}>
          <Card label="12 个架构的检验误差（基点）" accent={C.coral}>
            <RealBars width={1090} />
          </Card>
        </div>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 292, width: 600 }}>
          <Body size={FT.h2} color={C.ink} style={{ lineHeight: 1.3 }}>六组，三十三项，<br />结论只有一句。</Body>
          <Body style={{ marginTop: 24 }}>
            机制全部成立：公式、黄金值、预算、复现。收益不成立：合成上的抬升没有迁移到真实任务，十二个架构排不出稳定顺序。
          </Body>
          <div style={{ marginTop: 24 }}>
            <Chip color={C.cyan}>机制成立</Chip>
            <Chip color={C.coral} style={{ marginLeft: 10 }}>收益不成立</Chip>
            <Chip color={C.violet} style={{ marginLeft: 10 }}>33 / 33</Chip>
          </div>
        </div>
        <div style={{ position: "absolute", left: 740, top: 286, width: 1100 }}>
          <Card label="六组读数，一条底线" accent={C.cyan}>
            <Row name="零基线" value={fmt4(M.real.zeroMae)} note="永远预测零" width={980} color={C.cyan} />
            <Row name="最好" value={fmt4(M.real.best.mae)} note={M.real.best.name + "，只低万分之三"} width={980} color={C.violet} />
            <Row name="最差" value={fmt4(M.real.worst.mae)} note={M.real.worst.name + "，长回看家族"} width={980} color={C.coral} />
            <Row name="短家族最好" value={fmt4(M.real.family5Best)} note="回看 5 天的一族" width={980} color={C.cyan} />
            <Row name="长家族最好" value={fmt4(M.real.family20Best)} note="回看 20 天的一族，反而更差" width={980} color={C.amber} />
            <Row name="全距" value={M.real.spreadPct.toFixed(4) + "%"} note="十二个架构之间的相对差距" width={980} color={C.coral} />
          </Card>
        </div>
      </AbsoluteFill>
    </Pages>
  </Scene>
);
