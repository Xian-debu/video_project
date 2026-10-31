import React from "react";
import { C, FONT, FT } from "../../design/tokens";
import { Body, Card, Chip, CW, CodeBlock, Head, K, M, PAD, Pages, Stat, fmtE, fmtInt } from "../shared";

const P1: React.FC = () => (
  <>
    <Head kicker="05 / 实现" title="两个模块，一套口径" goal="Correlation.hs 与 Stl.hs 怎么写" />
    <div style={{ position: "absolute", left: PAD, top: 330, width: 1000 }}>
      <CodeBlock
        title="ts-base/src/TsBase/Algos/Ch02/Correlation.hs"
        width={980}
        size={FT.code}
        lines={[
          { t: "pairwisePearson cols = V.fromList" },
          { t: "  [ pearson (cols V.! i) (cols V.! j)" },
          { t: "  | i <- [0 .. n - 2]" },
          { t: "  , j <- [i + 1 .. n - 1] ]", hi: true },
          { t: "" },
          { t: "panelCorrelation cols" },
          { t: "  | V.length cols < 2 =", dim: true },
          { t: "      Left (CorrTooFewVariables (V.length cols))" },
          { t: "  | otherwise =", dim: true },
          { t: "      correlationStats (pairwisePearson cols)" },
          { t: "" },
          { t: "varP  = ... / kk          -- 总体方差，除以 K", hi: true },
          { t: "score = mean + 1 / (1 + varP)" },
        ]}
      />
    </div>
    <div style={{ position: "absolute", left: PAD + 1020, top: 330, width: CW - 1020, display: "flex", flexDirection: "column", gap: 16 }}>
      <Card label="配对完整" accent={C.cyan} style={{ height: 200 }}>
        <Body size={FT.body} color={C.ink}>
          pearson 先按位求交集，再算中心化和。整行删除会把一只票的停牌传播到所有票。
        </Body>
      </Card>
      <Card label="上三角" accent={C.violet} style={{ height: 200 }}>
        <Body size={FT.body} color={C.ink}>
          i 小于 j，行主序。N 只票出 N(N−1)/2 对，本片 100 只票 → 4950 对。
        </Body>
        <div style={{ marginTop: 10 }}><K>重复计入会人为压小 var(p)</K></div>
      </Card>
      <Card label="错误不伪装成零" accent={C.coral} style={{ height: 200 }}>
        <Body size={FT.body} color={C.ink}>
          没有一对有定义就 Left (CorrNoValidPairs k)。返回 0 会被读成「完全不相关」。
        </Body>
      </Card>
    </div>
  </>
);

const P2: React.FC = () => (
  <>
    <Head kicker="05 / 实现" title="STL 的一轮" goal="去趋势 · 平滑 · 低通 · 再平滑" />
    <div style={{ position: "absolute", left: PAD, top: 330, width: 1010 }}>
      <CodeBlock
        title="ts-base/src/TsBase/Algos/Ch02/Stl.hs"
        width={990}
        size={FT.code}
        lines={[
          { t: "step (tPrev, _) _k =" },
          { t: "  let d  = V.zipWith (-) xs tPrev" },
          { t: "      c  = seasonalSmooth period ns d", hi: true },
          { t: "      lp = centeredMa 3" },
          { t: "             (centeredMa period" },
          { t: "                (centeredMa period c))", hi: true },
          { t: "      s  = V.zipWith (-) c lp" },
          { t: "      de = V.zipWith (-) xs s" },
          { t: "      t  = loess1 nt de", hi: true },
          { t: "  in (t, s)" },
          { t: "" },
          { t: "(trend, seasonal) =" },
          { t: "  foldl step (zeros, zeros) [1 .. inner]" },
          { t: "residual = xs - trend - seasonal" },
        ]}
      />
    </div>
    <div style={{ position: "absolute", left: PAD + 1030, top: 330, width: CW - 1030 }}>
      <Card label="四个动作，三个参数" accent={C.violet} style={{ height: 420 }}>
        <Body size={FT.body} color={C.ink}>
          季节：按相位拆成 L 条子序列，各自跑 LOESS(n_s)，再还原。
        </Body>
        <Body size={FT.body} color={C.ink} style={{ marginTop: 14 }}>
          低通：MA(L)、MA(L)、MA(3) 三次中心化滑动平均，把季节项里的低频拿走。
        </Body>
        <Body size={FT.body} color={C.ink} style={{ marginTop: 14 }}>
          趋势：对去季节的序列跑 LOESS(n_t)。
        </Body>
        <Body size={FT.meta} color={C.inkFaint} style={{ marginTop: 16 }}>
          LOESS 用 tricube 权重 (1−|u|³)³，r = (span−1)/2，每个窗口解一元加权线性最小二乘。
        </Body>
      </Card>
    </div>
    <div style={{ position: "absolute", left: PAD, top: 830, width: CW }}>
      <Body size={FT.body} color={C.inkDim}>
        内循环两轮。没有外层鲁棒迭代：bisquare 权重会说另一套话，片中不混进来。
      </Body>
    </div>
  </>
);

const P3: React.FC = () => (
  <>
    <Head kicker="05 / 实现" title="测试守住哪些事" goal="恒等式、边界、一对都不剩" />
    <div style={{ position: "absolute", left: PAD, top: 336, width: CW, display: "flex", gap: 24 }}>
      <Stat label="测试套件" value={fmtInt(M.meta.tests.suites)} accent={C.cyan} style={{ flex: 1, height: 200 }} sub={<span>全仓 cabal test</span>} />
      <Stat label="断言" value={fmtInt(M.meta.tests.asserts)} accent={C.violet} style={{ flex: 1, height: 200 }} sub={<span>Correlation +20 · Stl +17</span>} />
      <Stat label="合成恒等式误差" value={fmtE(M.synthetic.identityErr, 1)} accent={C.amber} style={{ flex: 1, height: 200 }} sub={<span>n = {M.synthetic.n}，逐位 X = T + S + R</span>} />
      <Stat label="趋势误差" value={fmtE(M.synthetic.trendErr, 1)} accent={C.coral} style={{ flex: 1, height: 200 }} sub={<span>深内段 [60..139]</span>} />
    </div>
    <div style={{ position: "absolute", left: PAD, top: 600, width: CW }}>
      <Card label="n = 60 那个坑" accent={C.coral} style={{ height: 300 }}>
        <Body size={FT.body} color={C.ink}>
          合成序列一开始只有 60 点，趋势端点误差 2.03e−3。不是 bug：LOESS 在端点窗口只有半边数据，
          线性外推本来就有偏。范围也就从端点到不了内点。
        </Body>
        <Body size={FT.body} color={C.ink} style={{ marginTop: 14 }}>
          改成 n = 200，只测深内段 60 到 139，误差掉到 2.8e−14。
          边界偏差留在边界页讲，不用测试去「修」它。
        </Body>
      </Card>
    </div>
  </>
);

export const SImplementation: React.FC = () => (
  <Pages id="implementation" at={[0, 0.38, 0.66]}>
    <P1 />
    <P2 />
    <P3 />
  </Pages>
);
