import React from "react";
import { C, FONT, FT } from "../../design/tokens";
import { Body, CW, Card, CodeBlock, Head, K, M, PAD, Pages, Row, pageAt } from "../shared";

const P1: React.FC = () => (
  <>
    <Head kicker="05 / 实现" title="三个模块，一个口径" goal="softplus、pinball、两套 QL" />
    <div style={{ position: "absolute", left: PAD, top: 345, width: 1080 }}>
      <Card label="src/TsBase/Algos/Ch03/" accent={C.cyan} style={{ height: 350 }} pad={18}>
        <K style={{ display: "block", color: C.cyan }}>GaussNll.hs</K>
        <K style={{ display: "block", marginLeft: 18 }}>gaussNll · gaussNllBook · gaussNllGrad</K>
        <K style={{ display: "block", color: C.amber, marginTop: 8 }}>QuantileLoss.hs</K>
        <K style={{ display: "block", marginLeft: 18 }}>pinball · quantileLoss · multiQuantileLoss · empiricalQuantile</K>
        <K style={{ display: "block", color: C.violet, marginTop: 8 }}>EvalQl.hs</K>
        <K style={{ display: "block", marginLeft: 18 }}>evalQl · evalQl2 · crossingRate</K>
        <Body size={FT.meta} style={{ marginTop: 12 }}>
          三个模块只做“纯函数”的事：算损失、算梯度、算指标，训练循环留在证据程序里。
        </Body>
      </Card>
    </div>
    <div style={{ position: "absolute", left: PAD + 1120, top: 345, width: CW - 1120 }}>
      <Card label="三条设计约定" accent={C.violet} style={{ height: 350 }}>
        <Row name="① σ 参数化" value="σ = softplus(raw) + 1e-6" color={C.cyan} />
        <Row name="② pinball" value="两个方向分开写" color={C.amber} />
        <Row name="③ QL 默认" value="书版，不乘 2" color={C.violet} />
        <K style={{ display: "block", marginTop: 10 }}>约定都是本仓选择，不是书上的标准答案。</K>
      </Card>
    </div>
  </>
);

const P2: React.FC = () => (
  <>
    <Head kicker="05 / 实现" title="高斯损失：把 σ 关进正数" goal="softplus + 解析梯度" />
    <div style={{ position: "absolute", left: PAD, top: 340, width: 1000 }}>
      <CodeBlock
        title="GaussNll.hs"
        width={1000}
        lines={[
          { t: "sigmaFromRaw raw = softplus raw + 1e-6", hi: true },
          { t: "" },
          { t: "softplus x" },
          { t: "  | x > 30    = x" },
          { t: "  | x < -30   = exp x" },
          { t: "  | otherwise = log (1 + exp x)", hi: true },
          { t: "" },
          { t: "gaussNllPoint mu sigma y = 0.5 * (logTwoPi" },
          { t: "  + 2 * log sigma + (y-mu)^2 / (sigma*sigma))", hi: true },
          { t: "" },
          { t: "gaussNll yHat sigma y = meanTensor (V.zipWith3" },
          { t: "  gaussNllPoint (tsData yHat) (tsData sigma) (tsData y))" },
        ]}
      />
    </div>
    <div style={{ position: "absolute", left: PAD + 1020, top: 340, width: CW - 1020 }}>
      <Card label="拟合设置与读数" accent={C.cyan} style={{ height: 360 }}>
        <Row name="步数" value={M.synth.steps + " 步"} />
        <Row name="学习率" value="μ 0.05 · raw 0.02" />
        <Row name="梯度最大误差" value={M.synth.gradErr.toExponential(4)} color={C.cyan} />
        <Row name="损失" value={M.synth.lossBefore.toFixed(2) + " → " + M.synth.fitLoss.toFixed(4)} color={C.amber} />
        <Row name="拟合 μ / σ" value={M.synth.fitMu.toFixed(4) + " / " + M.synth.fitSigma.toFixed(4)} color={C.violet} />
        <K style={{ display: "block", marginTop: 8 }}>用 exp 参数化也能保证正，但 exp 在 0 附近导数接近 1，容易冲出去。</K>
      </Card>
    </div>
  </>
);

const P3: React.FC = () => (
  <>
    <Head kicker="05 / 实现" title="pinball 与经验分位数" goal="一行分支，一个 ceil" />
    <div style={{ position: "absolute", left: PAD, top: 340, width: 980 }}>
      <CodeBlock
        title="QuantileLoss.hs"
        width={980}
        lines={[
          { t: "pinball tau yHat y" },
          { t: "  | y >= yHat = tau * (y - yHat)", hi: true },
          { t: "  | otherwise = (1 - tau) * (yHat - y)", hi: true },
          { t: "" },
          { t: "quantileLoss tau yHat y =" },
          { t: "  quantileLossSum tau yHat y / n" },
          { t: "" },
          { t: "-- type-1：sorted 后取第 ceil(tau*n) 个" },
          { t: "empiricalQuantile tau xs =" },
          { t: "  sorted V.! max 0 (min (n-1) (ceiling (tau*n) - 1))", hi: true },
          { t: "  where sorted = V.fromList (List.sort xs)" },
        ]}
      />
    </div>
    <div style={{ position: "absolute", left: PAD + 1000, top: 340, width: CW - 1000 }}>
      <Card label="为什么这样选" accent={C.amber} style={{ height: 382 }}>
        <Row name="两方向" value="必须分开写，不能取绝对值" color={C.coral} />
        <Row name="平均" value="对元素取平均，不对 τ 取" />
        <Row name="经验分位" value="type-1：sort 后 ceil(τn)" color={C.cyan} />
        <Row name="小样本" value="type-1 最稳，不插值" />
        <K style={{ display: "block", marginTop: 10 }}>1 到 10 的样本上，τ=0.5 得 5、τ=0.9 得 9，和手算一致。</K>
      </Card>
    </div>
  </>
);

const P4: React.FC = () => (
  <>
    <Head kicker="05 / 实现" title="评估：两套 QL 与交叉率" goal="口径写成函数名" />
    <div style={{ position: "absolute", left: PAD, top: 345, width: 1000 }}>
      <CodeBlock
        title="EvalQl.hs"
        width={1000}
        lines={[
          { t: "evalQl taus yHat y =" },
          { t: "  meanList (map snd (perQuantile taus yHat y))", hi: true },
          { t: "evalQl2 taus yHat y = 2 * evalQl taus yHat y", hi: true },
          { t: "" },
          { t: "-- 每个 tau 先对样本取均值，再对 tau 平均" },
          { t: "perQuantile taus yHat y = [(tau, colMean j tau)" },
          { t: "  | (j, tau) <- zip [0 ..] taus]" },
        ]}
      />
    </div>
    <div style={{ position: "absolute", left: PAD + 1040, top: 345, width: CW - 1040 }}>
      <Card label="交叉率" accent={C.coral} style={{ height: 340 }}>
        <Row name="定义" value="q_τ 不随 τ 单调的样本占比" />
        <Row name="单调" value={M.eval.crossNone.toFixed(2)} color={C.cyan} />
        <Row name="全反" value={M.eval.crossAll.toFixed(2)} color={C.coral} />
        <Row name="四分之一" value={M.eval.crossQuarter.toFixed(2)} color={C.amber} />
        <K style={{ display: "block", marginTop: 10 }}>QQ 图上交叉的分位数预测是坏的；这个指标专门抓它。</K>
      </Card>
    </div>
    <div style={{ position: "absolute", left: PAD, top: 740, width: CW }}>
      <Body size={FT.body} color={C.inkDim}>指标实现和损失实现分开写，避免“拿自己的损失证明自己”。</Body>
    </div>
  </>
);

const P5: React.FC = () => (
  <>
    <Head kicker="05 / 实现" title="边界：小尺度上的梯度下降" goal="真实收益几乎不动" />
    <div style={{ position: "absolute", left: PAD, top: 345, width: 1060 }}>
      <Card label="必须先说的限制" accent={C.coral} style={{ height: 350 }}>
        <Row name="真实日收益量级" value="1e-4 到 1e-3" />
        <Row name="固定步长 GD" value="2000 步几乎不动" color={C.coral} />
        <Row name="μ 初值" value="0 → 停在 1e-5 附近" />
        <Row name="σ 初值" value="1.6 附近触底" color={C.coral} />
        <K style={{ display: "block", marginTop: 10 }}>学习率按合成数据的尺度调过，换到真实收益上就不再合适。</K>
      </Card>
    </div>
    <div style={{ position: "absolute", left: PAD + 1100, top: 345, width: CW - 1100 }}>
      <Card label="本仓的替代" accent={C.cyan} style={{ height: 350 }}>
        <Row name="μ" value="闭式：样本均值" color={C.cyan} />
        <Row name="σ" value="闭式：样本标准差" color={C.cyan} />
        <Row name="读数 μ / σ" value={M.real.mu.toExponential(2) + " / " + M.real.sigma.toFixed(4)} />
        <Row name="80% 覆盖" value={(M.real.coverageGauss80 * 100).toFixed(2) + "%"} color={C.amber} />
        <K style={{ display: "block", marginTop: 8 }}>证据里写明：这是矩估计，不是训练出来的；不能声称会拟合。</K>
      </Card>
    </div>
  </>
);

export const SImplementation: React.FC = () => (
  <Pages id="implementation" at={[0, pageAt("implementation", 8), pageAt("implementation", 16), pageAt("implementation", 24), pageAt("implementation", 32)]}>
    <P1 />
    <P2 />
    <P3 />
    <P4 />
    <P5 />
  </Pages>
);
