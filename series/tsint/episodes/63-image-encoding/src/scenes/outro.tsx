import React from "react";
import { AbsoluteFill } from "remotion";
import { C, FONT, FT } from "../../design/tokens";
import { Body, Card, Chip, CodeBlock, Foot, KV, M, PAD, Pages, Row, Scene, SceneHead, Stat, fmt2, fmt4, pagesOf } from "../shared";
import { Heat } from "../figs";

export const OutroScene: React.FC = () => (
  <Scene id="outro">
    <SceneHead id="outro" />
    <Pages id="outro" at={pagesOf("outro")}>
      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 292, width: 620 }}>
          <Body size={FT.h1} color={C.ink} style={{ lineHeight: 1.2 }}>回到开头<br />那张图。</Body>
          <Body style={{ marginTop: 26 }}>
            一百二十八个数字，一万六千三百八十四个格子，每个格子是两个角度的余弦。对角线能反解出原序列，
            差一个整体反射——这就是无损的全部含义。转移场是另一种故事：保结构，不保位置。
          </Body>
          <div style={{ display: "flex", marginTop: 28 }}>
            <KV k="点数" v={M.data.windowRows} color={C.cyan} />
            <KV k="格子" v="16,384" color={C.violet} />
            <KV k="死角" v="整体反射" color={C.coral} />
          </div>
        </div>
        <div style={{ position: "absolute", left: 790, top: 292, width: 1030 }}>
          <Card label="同一张图 · 两种读法" accent={C.cyan} style={{ width: 1010 }} pad={20}>
            <Heat m={M.gaf.gasf40} width={420} signed diag title="和场：对角给出绝对值" />
            <div style={{ fontFamily: FONT.sans, fontSize: FT.meta, color: C.inkDim, lineHeight: 1.9, marginTop: 12 }}>
              对角线是每个点的两倍角余弦，第一行把它和第一个点绑在一起。两样合起来，序列就回来了——
              只是正负看不出来。这就是「几乎无损」的准确说法。
            </div>
          </Card>
        </div>
        <Foot>一张图，能还原到什么程度。</Foot>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 292, width: 620 }}>
          <Body size={FT.h1} color={C.ink} style={{ lineHeight: 1.2 }}>最后复盘<br />四个数。</Body>
          <Body style={{ marginTop: 26 }}>
            反解误差一点三乘十的负十四次方；图像行和是十六，不是一；图特征一点三九一三，数字一点三九零八；
            朴素基线二点一五五二。三个模块三百三十九行，二十四条单测，十九项检查，四秒半。
          </Body>
          <div style={{ display: "flex", marginTop: 28 }}>
            <KV k="模块" v={M.code.totalLines + " 行"} color={C.cyan} />
            <KV k="检查" v={M.summary.passed + "/" + M.summary.total} color={C.amber} />
            <KV k="耗时" v={fmt2(M.timing.seconds, 2) + " s"} color={C.violet} />
          </div>
        </div>
        <div style={{ position: "absolute", left: 790, top: 292, width: 1030 }}>
          <div style={{ display: "flex", gap: 14 }}>
            <Stat label="反解误差" value={M.gaf.inverseMaxErr.toExponential(1).replace("e-", "e−")} sub="只差整体反射" accent={C.cyan} style={{ width: 235 }} valueSize={44} valueColor={C.cyan} />
            <Stat label="图像行和" value={fmt4(M.mtf.imgRowSum)} sub="不是 1，是每箱点数" accent={C.violet} style={{ width: 235 }} valueSize={44} valueColor={C.violet} />
            <Stat label="图 / 数字" value={fmt4(M.vision.maeImage) + " / " + fmt4(M.vision.maeContext)} sub="差万分之四，偏向数字" accent={C.amber} style={{ width: 235 }} valueSize={30} valueColor={C.amber} />
            <Stat label="朴素基线" value={fmt4(M.vision.maePersist)} sub="零收益猜测" accent={C.coral} style={{ width: 235 }} valueSize={44} valueColor={C.coral} />
          </div>
          <div style={{ marginTop: 16 }}>
          <CodeBlock
            title="复现三条"
            width={1010}
            lines={[
              { t: "cabal run tsbase -- evidence-ch07-image \\" },
              { t: "  --data data/episodes/63-image-encoding --out out/evidence-63 \\", hi: true },
              { t: "  --evidence inventory/evidence/63-image-encoding.ch7-image.json", hi: true },
              { t: "cabal test" },
              { t: "node scripts/make.mjs --film tsint-63-image-encoding" },
            ]}
          />
          </div>
        </div>
        <Foot>屏幕上的每个数都能自己跑出来。</Foot>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 292, width: 620 }}>
          <Body size={FT.h1} color={C.ink} style={{ lineHeight: 1.2 }}>下一集<br />换个方向。</Body>
          <Body style={{ marginTop: 26 }}>
            不问怎么表示，问怎么适配。冻结一个大模型，只训练很少的参数：线性探测、低秩重参数化、语义锚点。
            三个办法都只动很小的一块，代价可以精确算出来——这比微调更接近工程。
          </Body>
          <div style={{ display: "flex", marginTop: 28, gap: 10 }}>
            <Chip color={C.cyan}>冻结主干</Chip>
            <Chip color={C.amber}>少量参数</Chip>
            <Chip color={C.violet}>下一集：适配</Chip>
          </div>
        </div>
        <div style={{ position: "absolute", left: 790, top: 292, width: 1030 }}>
          <Card label="下一集：只训练一小块" accent={C.violet} style={{ width: 1010 }} pad={20}>
            <Row name="线性探测" value="1,300 参数" note="只训一个线性头，主干完全冻结" width={962} color={C.cyan} valueW={300} />
            <Row name="低秩重参数化" value="每层几百" note="在权重旁加一对低秩矩阵，只训这两个" width={962} color={C.violet} valueW={300} />
            <Row name="语义锚点" value="选前缀" note="不训权重，只挑一小段上下文当锚" width={962} color={C.amber} valueW={300} />
          </Card>
        </div>
        <Foot>下一集，怎么适配。</Foot>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 292, width: 620 }}>
          <Body size={FT.h1} color={C.ink} style={{ lineHeight: 1.2 }}>边界之内，<br />图可以无损。</Body>
          <Body style={{ marginTop: 26 }}>
            边界之外，图只是图。这一集量到的不是「图像更好」，而是一条边界：
            在哪里能还原，在哪里只能保结构。
          </Body>
          <div style={{ display: "flex", marginTop: 28, gap: 10 }}>
            <Chip color={C.cyan}>可逆</Chip>
            <Chip color={C.violet}>结构</Chip>
            <Chip color={C.coral}>负结果</Chip>
          </div>
        </div>
        <div style={{ position: "absolute", left: 790, top: 292, width: 1030 }}>
          <Card label="最后留一句" accent={C.cyan} style={{ width: 1010 }} pad={20}>
            <Row name="二维卷积" value="新问题" note="借来的工具，不是借来的结论" width={962} color={C.cyan} valueW={300} />
            <Row name="可逆性" value="新问题" note="能还原，不等于有用" width={962} color={C.violet} valueW={300} />
            <Row name="新问题" value="不保证好答案" note="这一集量到的是一条边界，不是一次胜利" width={962} color={C.coral} valueW={300} />
          </Card>
          <div style={{ marginTop: 18, fontFamily: FONT.sans, fontSize: FT.meta, color: C.inkDim, lineHeight: 1.9 }}>
            表示的价值不在像不像图，在于它让你能问出新的问题。边界之内，图可以无损；边界之外，图只是图。
          </div>
        </div>
        <Foot>感谢观看本集。</Foot>
      </AbsoluteFill>
    </Pages>
  </Scene>
);
