import React from "react";
import { AbsoluteFill } from "remotion";
import { C, FONT, FT } from "../../design/tokens";
import { Body, Card, Chip, CodeBlock, Foot, Formula, KV, M, PAD, Pages, Row, Scene, SceneHead, fmt2, pagesOf } from "../shared";
import { PinballShape, RearrangeStrip } from "../figs";

export const DefinitionsScene: React.FC = () => (
  <Scene id="definitions">
    <SceneHead id="definitions" />
    <Pages id="definitions" at={pagesOf("definitions")}>
      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 292, width: 620 }}>
          <Body size={FT.h1} color={C.ink} style={{ lineHeight: 1.2 }}>损失是<br />不对称的。</Body>
          <Body style={{ marginTop: 26 }}>
            给定分位 tau、预测 q、真实值 y：y 在 q 上面就罚 tau 乘距离，在 q 下面罚一减 tau 乘距离。tau 等于零点九时，
            低估罚九成、高估只罚一成，它宁可往高里猜。这个不对称，就是分位数的全部秘密。
          </Body>
          <div style={{ display: "flex", marginTop: 28 }}>
            <KV k="低估" v="tau" color={C.coral} />
            <KV k="高估" v="1 − tau" color={C.cyan} />
            <KV k="黄金四值" v="0.9 / 0.1" color={C.amber} />
          </div>
        </div>
        <div style={{ position: "absolute", left: 790, top: 292, width: 1030 }}>
          <Card label="pinball 损失：以 q = y 为折点" accent={C.coral}>
            <PinballShape width={930} height={252} />
          </Card>
          <Formula size={38} style={{ marginTop: 18 }} note="y 大于等于 q 取第一支；否则取第二支">
            L = tau · max(y − q, 0) + (1 − tau) · max(q − y, 0)
          </Formula>
        </div>
        <Foot>tau 等于零点九时，它宁可往高里猜。</Foot>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 292, width: 620 }}>
          <Body size={FT.h1} color={C.ink} style={{ lineHeight: 1.2 }}>分母是<br />两个维度。</Body>
          <Body style={{ marginTop: 26 }}>
            单点损失要聚合成一个标量：对所有样本、所有分位取平均。分母是分位个数乘样本数，不是样本数。
            我第一次写就漏了这个除法，数值大了九倍，检查立刻抓到，因为手算的锚点对不上。
          </Body>
          <div style={{ display: "flex", marginTop: 28 }}>
            <KV k="分母" v="tau × n" color={C.cyan} />
            <KV k="单分位" v="重复样本数" color={C.inkDim} />
            <KV k="漏除" v="9 倍" color={C.coral} />
          </div>
        </div>
        <div style={{ position: "absolute", left: 790, top: 292, width: 1030 }}>
          <CodeBlock
            title="TsBase.Algos.Ch07.Pinball"
            width={1010}
            size={FT.code}
            lines={[
              { t: "-- 不对称：低估罚 tau，高估罚 1 - tau" },
              { t: "pinball :: Double -> Double -> Double -> Double" },
              { t: "pinball tau y q" },
              { t: "  | tau <= 0 || tau >= 1 = error \"tau out of (0,1)\"" },
              { t: "  | y >= q    = tau * (y - q)" },
              { t: "  | otherwise = (1 - tau) * (q - y)" },
              { t: "" },
              { t: "-- 平均：分母是分位个数乘样本数" },
              { t: "meanPinball taus qs ys =" },
              { t: "  sum [pinball t y (q t y) | ...] / fromIntegral (length taus * n)" },
            ]}
          />
          <div style={{ marginTop: 12, fontFamily: FONT.mono, fontSize: FT.micro, color: C.inkFaint }}>
            经验分位也在这个模块：把样本排序，取第 ceil(tau · n) 个（type-1，和 numpy 的 lower 一致）。
          </div>
        </div>
        <Foot>分母写错，是这一集最容易犯的错。</Foot>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 292, width: 620 }}>
          <Body size={FT.h1} color={C.ink} style={{ lineHeight: 1.2 }}>交叉是<br />一个计数。</Body>
          <Body style={{ marginTop: 26 }}>
            对每一个样本，九条线给出九个值。任取两条线，tau 小的那条应该更低；如果它反而更高，就记一个逆序对。
            交叉率等于逆序对数除以对子数乘样本数。九条线有三十六对，七百二十八个样本，总共两万六千二百零八对。
          </Body>
          <div style={{ display: "flex", marginTop: 28 }}>
            <KV k="对子" v="36" color={C.cyan} />
            <KV k="样本" v={M.crossing.samples} color={C.inkDim} />
            <KV k="总对子" v={M.crossing.pairTotal.toLocaleString("en-US")} color={C.amber} />
          </div>
        </div>
        <div style={{ position: "absolute", left: 790, top: 292, width: 1030 }}>
          <CodeBlock
            title="TsBase.Algos.Ch07.Pinball · 交叉计数"
            width={1010}
            size={FT.code}
            lines={[
              { t: "-- 一条样本的九个值里，数逆序对" },
              { t: "crossingPairs :: [Double] -> [Double] -> Int" },
              { t: "crossingPairs taus vals = length [ () | i <- [0 ..], j <- [i+1 ..]," },
              { t: "                                taus !! i < taus !! j, vals !! i > vals !! j ]" },
              { t: "" },
              { t: "crossingRate :: [Double] -> [[Double]] -> Double" },
              { t: "crossingRate taus rows" },
              { t: "  | length taus < 2 = error \"need at least two taus\"" },
              { t: "  | otherwise = fromIntegral (sum (map (crossingPairs taus) rows))" },
              { t: "                  / fromIntegral (pairs * length rows)" },
            ]}
          />
          <div style={{ marginTop: 12, fontFamily: FONT.mono, fontSize: FT.micro, color: C.inkFaint }}>
            少于两条线直接报错，不返回零——边界条件不留给调用方去猜。
          </div>
        </div>
        <Foot>好处是可以逐对审计。</Foot>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 292, width: 620 }}>
          <Body size={FT.h1} color={C.ink} style={{ lineHeight: 1.2 }}>修法只有<br />一句话。</Body>
          <Body style={{ marginTop: 26 }}>
            每个样本的九个值排个序。排序不改变这九个数的集合，只改变顺序，所以叫零成本：没有新参数，没有新训练，
            也不改变任何一条线在单点上的能力。代价只可能来自损失函数如何看待组合。
          </Body>
          <div style={{ display: "flex", marginTop: 28, gap: 10 }}>
            <Chip color={C.cyan}>零参数</Chip>
            <Chip color={C.violet}>零训练</Chip>
            <Chip color={C.amber}>只换位置</Chip>
          </div>
        </div>
        <div style={{ position: "absolute", left: 790, top: 292, width: 1030 }}>
          <Card label="逐样本排序：九个值不变，顺序变" accent={C.cyan}>
            <RearrangeStrip width={930} height={300} />
          </Card>
          <div style={{ marginTop: 12, fontFamily: FONT.mono, fontSize: FT.micro, color: C.inkFaint, width: 1000 }}>
            另一件事是分布头：不再给分位，直接给高斯——均值与标准差，sigma 由原始参数经 softplus 保证为正，训练用负对数似然。
          </div>
        </div>
        <Foot>没有新参数，没有新训练。</Foot>
      </AbsoluteFill>
    </Pages>
  </Scene>
);
