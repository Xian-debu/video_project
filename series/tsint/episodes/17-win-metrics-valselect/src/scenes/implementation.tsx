import React from "react";
import { C, FONT, FT } from "../../design/tokens";
import { Body, CW, Card, CodeBlock, Head, K, M, PAD, Pages, Stat, fmtE, fmtInt } from "../shared";

const P1: React.FC = () => (
  <>
    <Head kicker="05 / 实现" title="Window：切窗与切分" goal="一个公式，两个不变量" />
    <div style={{ position: "absolute", left: PAD, top: 330, width: 1060 }}>
      <CodeBlock
        width={1060}
        title="ts-base/src/TsBase/Algos/Ch03/Window.hs"
        lines={[
          { t: "windowCount t h f s off" },
          { t: "  | h <= 0 || f <= 0 || s <= 0 = 0" },
          { t: "  | t - off < h + f = 0" },
          { t: "  | otherwise = (t - off - h - f) `div` s + 1", hi: true },
          { t: "" },
          { t: "windows h f s off xs     -- 起点 off, off+s, ..." },
          { t: "  -- 惰性：只生成需要的 Sample，不物化张量" },
          { t: "" },
          { t: "chronoSplit h f s gap (tr, va) xs" },
          { t: "  -- 6:2:2，两段边界各丢 gap 个样本" },
          { t: "  -- splitRanges 给出三段 (首帧, 长度)", dim: true },
        ]}
      />
    </div>
    <div style={{ position: "absolute", left: PAD + 1100, top: 340, width: CW - 1100, display: "flex", flexDirection: "column", gap: 18 }}>
      <Card label="边界返回 0" accent={C.cyan} style={{ height: 130 }}>
        <Body size={FT.body}>太短、步长非正，返回零个窗口，不死循环。</Body>
      </Card>
      <Card label="按索引，不按日历" accent={C.violet} style={{ height: 130 }}>
        <Body size={FT.body}>停牌会留洞；按日历切会把交易日数算错。</Body>
      </Card>
      <Card label="gap 属于切分" accent={C.amber} style={{ height: 130 }}>
        <Body size={FT.body}>第 4 个参数是分段起点 offset，不是 gap。</Body>
      </Card>
    </div>
  </>
);

const P2: React.FC = () => (
  <>
    <Head kicker="05 / 实现" title="Metrics：四指标，一策略" goal="metMapeCount 是关键" />
    <div style={{ position: "absolute", left: PAD, top: 330, width: 1060 }}>
      <CodeBlock
        width={1060}
        title="ts-base/src/TsBase/Algos/Ch03/Metrics.hs"
        lines={[
          { t: "data MapePolicy = MapeRaw | MapeSkip | MapeEps Double" },
          { t: "" },
          { t: "metricsWith :: MapePolicy -> V.Vector Double" },
          { t: "            -> V.Vector Double -> Either MetricsError Metrics" },
          { t: "  | V.length actual /= V.length predicted = Left ...", dim: true },
          { t: "" },
          { t: "  metMse  = sum (V.map (^ 2) errs) / fromIntegral n" },
          { t: "  metRmse = sqrt mse        -- 必须由 MSE 开方", hi: true },
          { t: "  metMape = mape            -- 按 policy 计数" },
          { t: "  metMapeCount = nMap       -- 真正进 MAPE 的项数", hi: true },
          { t: "" },
          { t: "perHorizon policy f actual predicted  -- 逐视野拆开" },
        ]}
      />
    </div>
    <div style={{ position: "absolute", left: PAD + 1100, top: 340, width: CW - 1100, display: "flex", flexDirection: "column", gap: 18 }}>
      <Card label="长度不等" accent={C.coral} style={{ height: 120 }}>
        <Body size={FT.body}>返回 Left，不截断、不补零。</Body>
      </Card>
      <Card label="恒等输入" accent={C.cyan} style={{ height: 120 }}>
        <Body size={FT.body}>x 等于 x̂ 时四个指标是精确 0，不是 1e-17。</Body>
      </Card>
      <Card label="逐视野" accent={C.amber} style={{ height: 120 }}>
        <Body size={FT.body}>长程误差被平均掩盖之前，先按 horizon 看一遍。</Body>
      </Card>
    </div>
  </>
);

const P3: React.FC = () => (
  <>
    <Head kicker="05 / 实现" title="TrainLoss：训练与选模" goal="Adam、早停、恢复最优" />
    <div style={{ position: "absolute", left: PAD, top: 330, width: 1060 }}>
      <CodeBlock
        width={1060}
        title="ts-base/src/TsBase/Algos/Ch03/TrainLoss.hs"
        lines={[
          { t: "train cfg trainDs valDs model0" },
          { t: "  -- theta = flatten (W, b)，行主序" },
          { t: "  -- Adam lr 1e-3，beta (0.9,0.999)，带 bias correction", dim: true },
          { t: "  -- 每轮：LCG 采 batch -> gradientOfParams -> 更新" },
          { t: "  -- 验证损失 patience 轮没改善就停" },
          { t: "  -- 停时恢复到 histBestEpoch 的权重", hi: true },
          { t: "" },
          { t: "gradientOfParams cfg ds model = ..." },
          { t: "  -- MSE: 2/(F*N) * sum e" },
          { t: "  -- MAE: sign(e)/(F*N)   -- 次梯度" },
          { t: "" },
          { t: "valSelect :: [Candidate] -> Maybe Candidate" },
          { t: "  -- 分数升序，同分按标签字典序", hi: true },
        ]}
      />
    </div>
    <div style={{ position: "absolute", left: PAD + 1100, top: 340, width: CW - 1100, display: "flex", flexDirection: "column", gap: 16 }}>
      <Stat label="测试套件" value={fmtInt(M.meta.tests.suites)} accent={C.cyan} style={{ height: 130 }}
        sub={<span>全仓 cabal test</span>} />
      <Stat label="断言" value={fmtInt(M.meta.tests.asserts)} accent={C.violet} style={{ height: 130 }}
        sub={<span>Window {M.meta.tests.window} · Metrics {M.meta.tests.metrics} · TrainLoss {M.meta.tests.trainloss}</span>} />
      <Stat label="梯度相对误差" value={fmtE(M.training.gradRelErr)} accent={C.amber} style={{ height: 130 }}
        sub={<span>中心差分，阈值 1e-6</span>} />
      <Stat label="早停最优轮" value={String(M.training.earlyStopBest)} accent={C.coral} style={{ height: 130 }}
        sub={<span>停在 {M.training.epochsRun} 轮</span>} />
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
