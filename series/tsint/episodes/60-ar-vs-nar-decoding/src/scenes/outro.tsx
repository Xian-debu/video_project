import React from "react";
import { AbsoluteFill } from "remotion";
import { C, FONT, FT } from "../../design/tokens";
import { Body, Card, Chip, CodeBlock, Foot, Formula, KV, M, PAD, Pages, Row, Scene, SceneHead, Stat, fmt2, fmt4, pagesOf } from "../shared";
import { TwoPaths } from "../figs";

export const OutroScene: React.FC = () => (
  <Scene id="outro">
    <SceneHead id="outro" />
    <Pages id="outro" at={pagesOf("outro")}>
      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 292, width: 620 }}>
          <Body size={FT.h1} color={C.ink} style={{ lineHeight: 1.2 }}>累积，<br />还是一次成形。</Body>
          <Body style={{ marginTop: 26 }}>
            一步一步还是一口气，不只是速度问题。它决定了误差的结构：自回归把每一步的误差带回输入，非自回归把误差一次性摊平——代价是它抹掉了
            二十个点之间的条件结构。在我们的数据上，平摊的代价更小。但这只是一只股票、一个时间段。
          </Body>
          <div style={{ display: "flex", marginTop: 26, gap: 10 }}>
            <Chip color={C.cyan}>一只股票</Chip>
            <Chip color={C.cyan}>一个时间段</Chip>
            <Chip color={C.cyan}>一个编码器</Chip>
          </div>
        </div>
        <div style={{ position: "absolute", left: 790, top: 292, width: 1030 }}>
          <Card label="两种误差结构" accent={C.cyan} style={{ width: 1020 }}>
            <TwoPaths width={960} height={300} />
          </Card>
        </div>
        <Foot>结论的范围，和数据的范围一样大。</Foot>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 292, width: 620 }}>
          <Body size={FT.h1} color={C.ink} style={{ lineHeight: 1.2 }}>下一集：<br />不是一个数。</Body>
          <Body style={{ marginTop: 26 }}>
            如果预测不该只有一个数呢。未来不是一条确定的路，而是一个分布。下一集讲概率头：分位损失与分位线交叉——不再问会是多少，
            而是问有多少概率低于它。那需要新的损失函数，也需要新的检查方式。
          </Body>
          <Formula size={40} style={{ marginTop: 24 }} note="τ 是目标分位；低估和高估的惩罚不对称">
            ρ<sub style={{ fontSize: 22 }}>τ</sub>( y − ŷ ) = max( τ(y − ŷ), (τ−1)(y − ŷ) )
          </Formula>
        </div>
        <div style={{ position: "absolute", left: 790, top: 292, width: 1030 }}>
          <Card label="从解码器到分布" accent={C.violet} style={{ width: 1020 }}>
            <Row name="这一集" value="一个点预测" note="问「会是多少」，用 MAE 度量" width={972} color={C.inkDim} valueW={300} />
            <Row name="下一集" value="一条分位线" note="问「多少概率低于它」，用分位损失" width={972} color={C.violet} valueW={300} />
            <Row name="检查方式" value="分位线交叉" note="十条线的单调性、覆盖率、交叉惩罚" width={972} color={C.amber} valueW={300} />
            <Row name="共同点" value="还是纯函数" note="闭式解换成迭代拟合，其余接口不变" width={972} color={C.cyan} valueW={300} />
          </Card>
          <div style={{ marginTop: 14, fontFamily: FONT.mono, fontSize: FT.micro, color: C.inkFaint }}>
            一集比一集更接近真实的不确定性。
          </div>
        </div>
        <Foot>这一集的路，是从解码器到分布。</Foot>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 292, width: 620 }}>
          <Body size={FT.h1} color={C.ink} style={{ lineHeight: 1.2 }}>数字再<br />念一遍。</Body>
          <Body style={{ marginTop: 26 }}>
            一百九十七个测试窗口，地平线一到二十。自回归相对误差一点五六四七，非自回归一点二九三二。交叉点第八步，耗时比十五点七倍。
            十八项检查全过，一百二十二秒。复现命令在右边，仓库是公开的，数字都能对上。
          </Body>
          <div style={{ display: "flex", marginTop: 28 }}>
            <KV k="检查" v={M.summary.passed + "/" + M.summary.total} color={C.cyan} />
            <KV k="窗口" v={M.data.windows} color={C.amber} />
            <KV k="交叉" v={"F = " + M.crossing} color={C.violet} />
          </div>
        </div>
        <div style={{ position: "absolute", left: 790, top: 292, width: 1030 }}>
          <div style={{ display: "flex", gap: 14 }}>
            <Stat label="AR · F=20" value={fmt4(M.ar.rel20)} sub="回灌二十步" accent={C.cyan} style={{ width: 240 }} valueColor={C.cyan} />
            <Stat label="NAR · F=20" value={fmt4(M.nar.rel20)} sub="一次前向" accent={C.violet} style={{ width: 240 }} valueColor={C.violet} />
            <Stat label="耗时比" value={fmt2(M.timing.ratio) + "×"} sub="197 个窗口总耗时" accent={C.amber} style={{ width: 240 }} valueColor={C.amber} />
            <Stat label="检查" value={M.summary.passed + "/" + M.summary.total} sub="121.90 秒" accent={C.cyan} style={{ width: 240 }} />
          </div>
          <CodeBlock width={1010} size={FT.meta} title="复现三条" lines={[
            { t: "cabal run tsbase -- evidence-ch07-decode --data data/episodes/60-ar-vs-nar-decoding --out out/evidence-60", hi: true },
            { t: "  --evidence inventory/evidence   # 写入 summary.json 与 checks.txt" },
            { t: "cabal test" },
            { t: "node scripts/make.mjs --film tsint-60-ar-vs-nar-decoding" },
          ]} />
          <div style={{ marginTop: 12, fontFamily: FONT.mono, fontSize: FT.micro, color: C.inkFaint }}>
            三条命令分别跑证据程序、全部单测、成片渲染；仓库公开，数字都能对上。
          </div>
        </div>
        <Foot>感谢观看，下一集见。</Foot>
      </AbsoluteFill>
    </Pages>
  </Scene>
);
