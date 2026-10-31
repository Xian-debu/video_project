import React from "react";
import { C, FONT, FT } from "../../design/tokens";
import { Body, CW, Card, CodeBlock, Head, K, M, PAD, Pages, Row, Stat, Verdict, fmtF, fmtInt } from "../shared";

const P1: React.FC = () => (
  <>
    <Head kicker="05 / 实现" title="Revin.hs：三行核心" goal="保存 μ、σ，反变换不重算" />
    <div style={{ position: "absolute", left: PAD, top: 320, width: 1120 }}>
      <CodeBlock
        width={1120}
        title="ts-base/src/TsBase/Algos/Ch03/Revin.hs"
        lines={[
          { t: "revin cfg x" },
          { t: "  | V.null x = (V.empty, 0, 0)" },
          { t: "  | otherwise =" },
          { t: "      let mu    = windowMean x" },
          { t: "          sigma = windowStd x", hi: true },
          { t: "          scale = sqrt (sigma*sigma + ncEps cfg)", hi: true },
          { t: "          zs    = V.map (\\v -> (v - mu) / scale) x", hi: true },
          { t: "       in (gated, mu, sigma)   -- 保存统计量" },
          { t: "" },
          { t: "revinInv cfg mu sigma y =" },
          { t: "  let scale = sqrt (sigma*sigma + ncEps cfg)" },
          { t: "   in V.map (\\v -> v * scale + mu) unAffine", hi: true },
        ]}
      />
    </div>
    <div style={{ position: "absolute", left: PAD + 1160, top: 320, width: CW - 1160, display: "flex", flexDirection: "column", gap: 16 }}>
      <Stat label="断言" value="8" accent={C.cyan} style={{ height: 140 }} sub={<span>往返、常数窗、方差、仿射</span>} />
      <Stat label="eps" value="1e-5" accent={C.amber} style={{ height: 140 }} sub={<span>先进平方再开方</span>} />
      <Stat label="仿射" value="默认关" accent={C.violet} style={{ height: 140 }} sub={<span>NormCfg 1e-5 Nothing</span>} />
    </div>
    <div style={{ position: "absolute", left: PAD, top: 830, width: CW }}>
      <Body size={FT.body} color={C.inkDim}>
        与第二章的 sigma 加 eps 不同：这里按原论文的 sqrt(sigma² + eps)。差别只在零方差。
      </Body>
    </div>
  </>
);

const P2: React.FC = () => (
  <>
    <Head kicker="05 / 实现" title="NowNorm 与 MeanNorm" goal="两行代码换一个假设" />
    <div style={{ position: "absolute", left: PAD, top: 340, width: 860 }}>
      <CodeBlock
        width={860}
        title="NowNorm.hs"
        lines={[
          { t: "lastBase x = x ! (H - 1)", hi: true },
          { t: "nowNorm lin x =" },
          { t: "  let base = lastBase x" },
          { t: "      shifted = V.map (subtract base) x" },
          { t: "   in V.map (+ base) (applyLinear lin shifted)" },
        ]}
      />
    </div>
    <div style={{ position: "absolute", left: PAD + 900, top: 340, width: 860 }}>
      <CodeBlock
        width={860}
        title="MeanNorm.hs"
        lines={[
          { t: "meanBase = windowMean", hi: true },
          { t: "meanNorm lin x =" },
          { t: "  let base = meanBase x" },
          { t: "      shifted = V.map (subtract base) x" },
          { t: "   in V.map (+ base) (applyLinear lin shifted)" },
        ]}
      />
    </div>
    <div style={{ position: "absolute", left: PAD, top: 620, width: CW }}>
      <Row name="共同骨架" value="减 base → 线性层 → 加 base" color={C.cyan} note="applyLinear 三个模块共用" />
      <Row name="唯一差别" value="base 怎么算" color={C.violet} note="末值取最后一个元素，均值取窗口均值" />
      <Row name="不变量" value="只减不除" color={C.amber} note="除以末值会在负值上翻转符号" />
      <div style={{ marginTop: 30 }}>
        <Body size={FT.lead} color={C.ink}>
          两个模块各六条断言：平移、末值定位、常数、空输入。
        </Body>
      </div>
    </div>
  </>
);

const P3: React.FC = () => (
  <>
    <Head kicker="05 / 实现" title="训练与测试" goal="不写新优化器" />
    <div style={{ position: "absolute", left: PAD, top: 320, width: 1120 }}>
      <CodeBlock
        width={1120}
        title="证据程序 · 每个窗口只算一次基准"
        lines={[
          { t: "fitSeries cfg norm model ds train = foldl' step model train" },
          { t: "  where step m (xs, ys) =" },
          { t: "          let (z, mu, sd) = revin cfg xs   -- 只用输入段" },
          { t: "              (m', _)    = TL.train m [(z, ys)]" },
          { t: "           in m'" },
          { t: "" },
          { t: "-- 推理：预测后反变换" },
          { t: "predict cfg norm m (xs, mu, sd) = revinInv cfg mu sd (apply m z)", hi: true },
        ]}
      />
    </div>
    <div style={{ position: "absolute", left: PAD + 1160, top: 320, width: CW - 1160, display: "flex", flexDirection: "column", gap: 14 }}>
      <Stat label="测试套件" value={fmtInt(M.meta.tests.suites)} accent={C.cyan} style={{ height: 130 }} sub={<span>全仓 cabal test</span>} />
      <Stat label="断言" value={fmtInt(M.meta.tests.asserts)} accent={C.violet} style={{ height: 130 }} sub={<span>本集 +{M.meta.tests.revin + M.meta.tests.nownorm + M.meta.tests.meannorm}</span>} />
      <Stat label="参数量" value={fmtInt(M.meta.params)} accent={C.amber} style={{ height: 130 }} sub={<span>48 × 24 + 24</span>} />
    </div>
    <div style={{ position: "absolute", left: PAD, top: 760, width: CW }}>
      <Body size={FT.lead} color={C.ink}>
        骨干沿用上一集的 TrainLoss：Adam、早停、恢复最优轮，一行没改。
      </Body>
      <div style={{ marginTop: 12 }}>
        <K>踩过的坑：训练返回的模型必须真的用来预测，否则三种归一化会给出同一组数。</K>
      </div>
    </div>
  </>
);

export const SImplementation: React.FC = () => (
  <Pages id="implementation" at={[0, 0.372, 0.669]}>
    <P1 />
    <P2 />
    <P3 />
  </Pages>
);
