import React from "react";
import { C, FONT, FT } from "../../design/tokens";
import {
  Body, CW, Card, Chip, CodeBlock, Formula, Head, K, M, Pages, PAD, Row, Verdict,
} from "../shared";

const P1: React.FC = () => (
  <>
    <Head kicker="05 / 实现" title="一条式子，两条独立实现" goal="判决靠 ==，不靠「差不多」" />
    <div style={{ position: "absolute", left: PAD, top: 340, width: 1150 }}>
      <CodeBlock
        title="TsBase.Algos.Ch02.NonstatAttn"
        width={1150}
        lines={[
          { t: "nsAttention          :: NSACfg -> Double -> Vector Double" },
          { t: "                     -> Matrix -> Matrix -> Matrix -> Either ...", dim: true },
          { t: "temperatureAttention :: NSACfg -> Double -> Matrix -> Matrix", dim: true },
          { t: "                     -> Matrix -> Either ...", dim: true },
          { t: "standardAttention    :: NSACfg -> Matrix -> Matrix -> Matrix -> Either ...", dim: true },
          { t: "rowBiasAttention     :: ...   -- 按行偏置的可辨识写法：丢弃" },
          { t: "rowBiasAttentionRaw  :: ...   -- 真加进去，只做取证", dim: true },
        ]}
      />
      <div style={{ marginTop: 24 }}>
        <Body size={FT.body} color={C.inkDim}>
          前三条是生产路径，后两条只在证据程序里出现。按行加的「原始版」故意留着，用来证明它和标准注意力只差舍入。
        </Body>
      </div>
    </div>
    <div style={{ position: "absolute", left: 1300, top: 340, width: 530 }}>
      <Card label="共同底座" accent={C.cyan} style={{ height: 250 }}>
        <Body size={FT.body}>scores = Q Kᵀ / √dk，行 = query，列 = key。</Body>
        <Body size={FT.body} style={{ marginTop: 10 }}>softmax 减行最大值，不用 −Infinity。</Body>
      </Card>
      <Card label="为什么留两条" accent={C.violet} style={{ marginTop: 20, height: 250 }}>
        <Body size={FT.body}>
          一条乘 τ，一条除温度。同一批 Q、K、V，如果结果逐位相等，τ 就没有任何独立行为。
        </Body>
      </Card>
    </div>
  </>
);

const P2: React.FC = () => (
  <>
    <Head kicker="05 / 实现" title="判决一与判决二：τ 的全部分量" goal="同一批输入，两条路径，一次 ==" />
    <div style={{ position: "absolute", left: PAD, top: 340, width: 1120 }}>
      <CodeBlock
        title="τ = 1、Δ = 0 → 标准注意力"
        width={1120}
        lines={[
          { t: "let (a, _) = nsAttention cfg 1 (zerosT t) qm km vm" },
          { t: "let (b, _) = standardAttention cfg qm km vm" },
          { t: "a == b                       -- 逐位相等，不是近似", hi: true },
        ]}
      />
      <div style={{ marginTop: 26 }}>
        <CodeBlock
          title="τ = 2 → 温度 0.5"
          width={1120}
          lines={[
            { t: "let (c, _) = nsAttention cfg 2 (zerosT t) qm km vm" },
            { t: "let (d, _) = temperatureAttention cfg 0.5 qm km vm" },
            { t: "c == d                       -- 逐位相等", hi: true },
          ]}
        />
      </div>
    </div>
    <div style={{ position: "absolute", left: 1270, top: 340, width: 560 }}>
      <Card label="实测最大差" accent={C.cyan} style={{ height: 360 }}>
        <Row name="τ=1 vs 标准" value={M.verdicts.tau1_std_maxdiff.toFixed(2)} color={C.cyan} />
        <Row name="τ=2 vs 减半" value={M.verdicts.tau2_temp_maxdiff.toFixed(2)} color={C.cyan} />
        <div style={{ marginTop: 16 }}><Verdict ok label="两条都逐位相等" /></div>
        <K>比较的是整个输出矩阵，不是抽样</K>
      </Card>
      <Card label="结论" accent={C.violet} style={{ marginTop: 20, height: 180 }}>
        <Body size={FT.h2} color={C.ink}>τ 解释完了。</Body>
        <Body size={FT.meta} color={C.inkFaint} style={{ marginTop: 8 }}>剩下要解释的，只有 Δ。</Body>
      </Card>
    </div>
  </>
);

const P3: React.FC = () => (
  <>
    <Head kicker="05 / 实现" title="Δ 的坑在加法的那一维" goal="按列是列偏置，按行是幻觉" />
    <div style={{ position: "absolute", left: PAD, top: 340, width: 1150 }}>
      <CodeBlock
        title="同一个 Δ，两种加法"
        width={1150}
        lines={[
          { t: "-- 按列（式 2.9）：z_ij + Delta_j    每个 key 一个偏置" },
          { t: "-- 按行（错误）：   z_ij + delta_i    每个 query 一个偏置", dim: true },
          { t: "" },
          { t: "rowBiasAttentionRaw  -- 真的把 delta_i 加进 logits" },
          { t: "rowBiasAttention     -- 数学上等于标准注意力：整行常数被吃掉", hi: true },
        ]}
      />
      <div style={{ marginTop: 26 }}>
        <Body size={FT.body} color={C.inkDim}>
          按行的那一版留着，是为了让梯度亲口说：它是零。有限差分用中心差分，h = 1e−6。
        </Body>
      </div>
    </div>
    <div style={{ position: "absolute", left: 1270, top: 340, width: 560 }}>
      <Card label="有限差分 · 第 0 个 key 的总权重" accent={C.coral} style={{ height: 320 }}>
        <Row name="按列加 Δ" value={M.verdicts.column_grad_max.toFixed(4)} note="逐列不同，有符号" color={C.cyan} />
        <Row name="按列梯度之和" value={"1.36e−09"} note="应为零，这里是 FD 噪声" color={C.inkDim} />
        <Row name="按行加 δ" value={M.verdicts.row_grad_max.toFixed(2)} note="恰为零，不是小" color={C.coral} />
      </Card>
      <Card label="所以" accent={C.amber} style={{ marginTop: 20, height: 190 }}>
        <Formula size={32}>{"softmax(z + δ·1ᵀ) = softmax(z)"}</Formula>
        <Body size={FT.meta} color={C.inkFaint} style={{ marginTop: 8 }}>整行常数在归一化里被完全约掉。</Body>
      </Card>
    </div>
  </>
);

export const SImplementation: React.FC = () => (
  <Pages id="implementation" at={[0, 0.38, 0.72]}>
    <P1 />
    <P2 />
    <P3 />
  </Pages>
);
