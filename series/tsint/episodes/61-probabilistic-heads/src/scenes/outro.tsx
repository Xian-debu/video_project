import React from "react";
import { AbsoluteFill } from "remotion";
import { C, FONT, FT } from "../../design/tokens";
import { Body, Card, Chip, CodeBlock, Foot, KV, M, PAD, Pages, Row, Scene, SceneHead, Stat, fmt2, fmt4, pagesOf, pct } from "../shared";
import { CrossingSchematic } from "../figs";

const pctText = (v: number) => (v * 100).toFixed(2) + "%";

export const OutroScene: React.FC = () => (
  <Scene id="outro">
    <SceneHead id="outro" />
    <Pages id="outro" at={pagesOf("outro")}>
      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 292, width: 620 }}>
          <Body size={FT.h1} color={C.ink} style={{ lineHeight: 1.2 }}>回到开头<br />那个问题。</Body>
          <Body style={{ marginTop: 26 }}>
            开头问：九个分开训练的分位点，为什么会互相穿过。答案是它们各说各话，而分位线必须按次序排好。
            排序零参数、零训练、只换位置；代价是 pinball 损失变化不到零点三。所以「分位线必须单调」是可以免费加上的约束。
          </Body>
          <div style={{ display: "flex", marginTop: 26, gap: 10 }}>
            <Chip color={C.cyan}>零参数</Chip>
            <Chip color={C.cyan}>零训练</Chip>
            <Chip color={C.cyan}>只换位置</Chip>
          </div>
        </div>
        <div style={{ position: "absolute", left: 790, top: 292, width: 1030 }}>
          <Card label="同一个预测头，两种摆放" accent={C.cyan} style={{ width: 1020 }}>
            <CrossingSchematic width={960} height={300} />
          </Card>
        </div>
        <Foot>排序本身，就值一集。</Foot>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 292, width: 620 }}>
          <Body size={FT.h1} color={C.ink} style={{ lineHeight: 1.2 }}>下一步，<br />走向异常检测。</Body>
          <Body style={{ marginTop: 26 }}>
            分位线给出了一个区间：低于下分位、高于上分位，都是少见的事。异常检测就从这里出发——不预测正常值，而是判断「这一天有多不正常」。
            下一集讲两种做法：一种看残差，一种看局部密度。它们都要用到本集的覆盖率与尾部。
          </Body>
          <div style={{ display: "flex", marginTop: 28 }}>
            <KV k="下一集" v="异常检测" color={C.violet} />
            <KV k="用到" v="分位与尾部" color={C.amber} />
          </div>
        </div>
        <div style={{ position: "absolute", left: 790, top: 292, width: 1030 }}>
          <Card label="从分布到异常" accent={C.violet} style={{ width: 1020 }}>
            <Row name="这一集" value="一条分布" note="九个分位点、一条区间、覆盖率 0.924" width={972} color={C.inkDim} valueW={300} />
            <Row name="下一集" value="一次判定" note="今天是不是异常：残差法、局部密度法两条路" width={972} color={C.violet} valueW={300} />
            <Row name="用到的" value="尾部与覆盖率" note="区间外的样本，就是第一版异常候选" width={972} color={C.amber} valueW={300} />
            <Row name="共同的" value="纯函数" note="判定规则也是纯函数，可以单独检查" width={972} color={C.cyan} valueW={300} />
          </Card>
          <div style={{ marginTop: 14, fontFamily: FONT.mono, fontSize: FT.micro, color: C.inkFaint }}>
            先记住这一集的四件事，下一集它们都会回来。
          </div>
        </div>
        <Foot>分位线之后，就该问「多不正常」。</Foot>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 292, width: 620 }}>
          <Body size={FT.h1} color={C.ink} style={{ lineHeight: 1.2 }}>最后复盘<br />四个数。</Body>
          <Body style={{ marginTop: 26 }}>
            交叉八百八十一对，摊在两万六千二百零八对上，是三点三六；排序后归零，损失只变百分之零点二六。十八项检查全过，二点二秒。
            四条口径、一条命令、一份 checks.txt——数字都能自己跑出来。
          </Body>
          <div style={{ display: "flex", marginTop: 28 }}>
            <KV k="检查" v={M.summary.passed + "/" + M.summary.total} color={C.cyan} />
            <KV k="交叉" v={pctText(M.crossing.rate)} color={C.coral} />
            <KV k="耗时" v={fmt2(M.timing.seconds, 2) + " s"} color={C.amber} />
          </div>
        </div>
        <div style={{ position: "absolute", left: 790, top: 292, width: 1030 }}>
          <div style={{ display: "flex", gap: 14 }}>
            <Stat label="交叉率" value={pctText(M.crossing.rate)} sub="881 / 26,208 对" accent={C.coral} style={{ width: 240 }} valueColor={C.coral} />
            <Stat label="排序后" value={pctText(M.crossing.rateAfter)} sub="多重集不变" accent={C.cyan} style={{ width: 240 }} valueColor={C.cyan} />
            <Stat label="损失变化" value={pctText(M.pinball.relDelta)} sub="0.726731 → 0.724864" accent={C.amber} style={{ width: 240 }} valueColor={C.amber} />
            <Stat label="覆盖率" value={fmt4(M.dist.coverage)} sub="名义 0.95 · 差全在尾部" accent={C.violet} style={{ width: 240 }} valueColor={C.violet} />
          </div>
          <CodeBlock width={1010} size={FT.meta} title="复现三条" lines={[
            { t: "cabal run tsbase -- evidence-ch07-prob --data data/episodes/61-probabilistic-heads --out out/evidence-61", hi: true },
            { t: "  --evidence inventory/evidence   # 写入 summary.json 与 checks.txt" },
            { t: "cabal test" },
            { t: "node scripts/make.mjs --film tsint-61-probabilistic-heads" },
          ]} />
          <div style={{ marginTop: 12, fontFamily: FONT.mono, fontSize: FT.micro, color: C.inkFaint }}>
            三条命令分别跑证据程序、全部单测、成片渲染；仓库公开，数字都能对上。
          </div>
        </div>
        <Foot>感谢观看，下一集，异常检测。</Foot>
      </AbsoluteFill>
    </Pages>
  </Scene>
);
