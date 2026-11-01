import React from "react";
import { C, FONT, FT } from "../../design/tokens";
import { Body, CW, Card, Chip, Formula, Head, K, KV, LinePlot, M, PAD, Pages, Row, Stat, Verdict, pageAt } from "../shared";

const P1: React.FC = () => (
  <>
    <Head kicker="06 / 验证" title="四十一项，零失败" goal="五类检查各自的职责" />
    <div style={{ position: "absolute", left: PAD, top: 350, width: 600 }}>
      <Stat label="证据检查" value={M.meta.checks.ok + " / " + M.meta.checks.total} accent={C.cyan} style={{ height: 240 }} sub={<span>cabal run -v0 tsbase -- evidence-ch03-prob</span>} />
      <Body size={FT.meta} style={{ marginTop: 14 }}>另有 {M.meta.tests.suites} 套 cabal 测试、{M.meta.tests.asserts.toLocaleString("en-US")} 条断言，全部通过。</Body>
    </div>
    <div style={{ position: "absolute", left: PAD + 640, top: 350, width: CW - 640 }}>
      <Card label="五类，按职责分" accent={C.violet} style={{ height: 350 }}>
        <Row name="数据" value={M.meta.checks.data + " 项"} color={C.cyan} note="形状、统计量、sha" />
        <Row name="高斯" value={M.meta.checks.gauss + " 项"} color={C.amber} note="手算、常数、梯度、拟合" />
        <Row name="分位数" value={M.meta.checks.quantile + " 项"} color={C.violet} note="pinball、经验分位、比值" />
        <Row name="QL 指标" value={M.meta.checks.eval + " 项"} color={C.coral} note="两套口径、交叉率" />
        <Row name="真实读数" value={M.meta.checks.real + " 项"} color={C.cyan} note="覆盖、QL、NLL" />
      </Card>
    </div>
  </>
);

const P2: React.FC = () => (
  <>
    <Head kicker="06 / 验证" title="先验数据本身" goal="两段数据，两个 sha" />
    <div style={{ position: "absolute", left: PAD, top: 350, width: 960 }}>
      <Card label="合成样本" accent={C.cyan} style={{ height: 330 }}>
        <Row name="点数" value={M.synth.n} />
        <Row name="均值" value={M.synth.mean.toFixed(4)} color={C.cyan} />
        <Row name="标准差" value={M.synth.sd.toFixed(4)} color={C.amber} />
        <Row name="sha256" value={M.data.gaussSha.slice(0, 16) + "…"} />
        <K style={{ display: "block", marginTop: 6 }}>{M.data.gaussRows} 行 · {M.data.gaussBytes.toLocaleString("en-US")} 字节</K>
      </Card>
    </div>
    <div style={{ position: "absolute", left: PAD + 1000, top: 350, width: CW - 1000 }}>
      <Card label="真实收益 600519" accent={C.coral} style={{ height: 330 }}>
        <Row name="天数" value={M.real.n} />
        <Row name="区间" value={M.real.dates[0] + " → " + M.real.dates[M.real.dates.length - 1]} />
        <Row name="sha256" value={M.data.retSha.slice(0, 16) + "…"} color={C.coral} />
        <K style={{ display: "block", marginTop: 6 }}>{M.data.retRows} 行 · {M.data.retBytes.toLocaleString("en-US")} 字节</K>
      </Card>
    </div>
    <div style={{ position: "absolute", left: PAD, top: 740, width: CW }}>
      <Body size={FT.body} color={C.inkDim}>先证明“输入没被换过”，再谈后面的数字。六个数据断言都是这样。</Body>
    </div>
  </>
);

const P3: React.FC = () => (
  <>
    <Head kicker="06 / 验证" title="高斯的黄金值" goal="手算一行，程序必须同值" />
    <div style={{ position: "absolute", left: PAD, top: 350, width: 980 }}>
      <Card label="μ=1, σ=2, y=3" accent={C.amber} style={{ height: 330 }}>
        <Row name="书版" value={M.nll.book.toFixed(10)} color={C.amber} />
        <Row name="标准版" value={M.nll.std.toFixed(10)} color={C.cyan} />
        <Row name="差" value={M.nll.gap.toFixed(10)} color={C.coral} />
        <Row name="½log 2π" value={(0.5 * Math.log(2 * Math.PI)).toFixed(10)} />
        <K style={{ display: "block", marginTop: 6 }}>容差 1e-12：这些值都是双精度下能逐位复现的。</K>
      </Card>
    </div>
    <div style={{ position: "absolute", left: PAD + 1020, top: 350, width: CW - 1020 }}>
      <Card label="另一条路：手推" accent={C.cyan} style={{ height: 330 }}>
        <Formula size={26} note="σ=2, y−μ=2">
          L_std = ½[log 2π + log 4 + 4/4]
        </Formula>
        <Row name="⅓ 项" value="½log 2π = 0.9189" />
        <Row name="log σ 项" value="½log 4 = 0.6931" />
        <Row name="残差项" value="4/(2·4) = 0.5" color={C.cyan} />
        <Row name="合计" value="2.1121" color={C.violet} />
      </Card>
    </div>
  </>
);

const P4: React.FC = () => (
  <>
    <Head kicker="06 / 验证" title="pinball 的黄金值" goal="方向与比值" />
    <div style={{ position: "absolute", left: PAD, top: 350, width: 980 }}>
      <Card label="τ = 0.9，误差 1 元" accent={C.amber} style={{ height: 330 }}>
        <Row name="低估 1" value={"罚 " + M.quantile.under.toFixed(1)} color={C.amber} />
        <Row name="高估 1" value={"罚 " + M.quantile.over.toFixed(1)} color={C.cyan} />
        <Row name="比值" value={M.quantile.ratio.toFixed(0) + " 倍"} color={C.coral} />
        <K style={{ display: "block", marginTop: 6 }}>τ=0.1 时正好互为镜像：0.2 / 1.8。</K>
      </Card>
    </div>
    <div style={{ position: "absolute", left: PAD + 1020, top: 350, width: CW - 1020 }}>
      <Card label="τ=0.5 等于半个 MAE" accent={C.violet} style={{ height: 330 }}>
        <Row name="QL(τ=0.5)" value={M.quantile.ql05.toFixed(10)} color={C.violet} />
        <Row name="MAE" value={M.quantile.mae.toFixed(10)} color={C.cyan} />
        <Row name="比值" value={(M.quantile.ql05 / M.quantile.mae).toFixed(10)} color={C.amber} />
        <K style={{ display: "block", marginTop: 6 }}>这条恒等式是 QL 里那个 ½ 的来源，也是“QL=MAE”误会的来源。</K>
      </Card>
    </div>
  </>
);

const P5: React.FC = () => (
  <>
    <Head kicker="06 / 验证" title="QL 的两套口径" goal="同一份预测，两个数" />
    <div style={{ position: "absolute", left: PAD, top: 350, width: 980 }}>
      <Card label="黄金例" accent={C.violet} style={{ height: 330 }}>
        <Row name="τ=0.5 · 书版" value={M.eval.book05.toFixed(2)} color={C.violet} />
        <Row name="τ=0.5 · ×2" value={M.eval.x205.toFixed(2)} color={C.cyan} />
        <Row name="混合 τ · 书版" value={M.eval.mixBook.toFixed(2)} />
        <Row name="混合 τ · ×2" value={M.eval.mixScaled.toFixed(2)} color={C.amber} />
        <K style={{ display: "block", marginTop: 6 }}>两倍关系逐项成立，不是巧合。</K>
      </Card>
    </div>
    <div style={{ position: "absolute", left: PAD + 1020, top: 350, width: CW - 1020 }}>
      <Card label="交叉率三个例子" accent={C.coral} style={{ height: 330 }}>
        <Row name="单调" value={M.eval.crossNone.toFixed(2)} color={C.cyan} />
        <Row name="全反" value={M.eval.crossAll.toFixed(2)} color={C.coral} />
        <Row name="四分之一反" value={M.eval.crossQuarter.toFixed(2)} color={C.amber} />
        <K style={{ display: "block", marginTop: 6 }}>分子、分母都写死，避免“0 或者 1”这种假通过。</K>
      </Card>
    </div>
  </>
);

const P6: React.FC = () => (
  <>
    <Head kicker="06 / 验证" title="真实读数" goal="240 天，一个标的" />
    <div style={{ position: "absolute", left: PAD, top: 350, width: 980 }}>
      <Card label="覆盖率" accent={C.cyan} style={{ height: 330 }}>
        <Row name="10% 分位" value={M.real.cov10.toFixed(4)} color={C.cyan} />
        <Row name="50% 分位" value={M.real.cov50.toFixed(4)} color={C.violet} />
        <Row name="90% 分位" value={M.real.cov90.toFixed(4)} color={C.amber} />
        <Row name="10–90 区间" value={M.real.coverage80.toFixed(4)} color={C.coral} />
        <Row name="高斯 80% 区间" value={M.real.coverageGauss80.toFixed(4)} />
        <K style={{ display: "block", marginTop: 6 }}>经验分位把每个 τ 都校准住；高斯区间偏宽。</K>
      </Card>
    </div>
    <div style={{ position: "absolute", left: PAD + 1020, top: 350, width: CW - 1020 }}>
      <Card label="QL 与 NLL" accent={C.amber} style={{ height: 330 }}>
        <Row name="经验分位 QL" value={M.real.qlEmp.toFixed(6)} color={C.cyan} />
        <Row name="常数中位数 QL" value={M.real.qlConst.toFixed(6)} color={C.coral} />
        <Row name="改善" value={((1 - M.real.qlEmp / M.real.qlConst) * 100).toFixed(1) + "%"} color={C.cyan} />
        <Row name="高斯 NLL" value={M.real.nll.toFixed(4)} color={C.violet} />
        <Row name="交叉率" value={M.real.crossing.toFixed(2)} color={C.amber} />
        <K style={{ display: "block", marginTop: 6 }}>NLL 为负不是 bug：密度大于 1 时 log 密度为正。</K>
      </Card>
    </div>
  </>
);

const P7: React.FC = () => (
  <>
    <Head kicker="06 / 验证" title="拟合轨迹与结算" goal="两千步，单调下降" />
    <div style={{ position: "absolute", left: PAD, top: 350, width: 1000 }}>
      <Card label="合成样本上的损失" accent={C.cyan} style={{ height: 360 }} pad={16}>
        <LinePlot
          series={[{ values: M.synth.fit.loss, color: C.cyan, name: "loss" }]}
          width={930}
          height={280}
          title={"每 100 步记录一次；第 0 步 " + M.synth.lossBefore.toFixed(2) + " → 第 2000 步 " + M.synth.fitLoss.toFixed(4)}
          yMin={0}
          yFmt={(v) => v.toFixed(1)}
        />
      </Card>
    </div>
    <div style={{ position: "absolute", left: PAD + 1040, top: 350, width: CW - 1040 }}>
      <Card label="结算" accent={C.violet} style={{ height: 360 }}>
        <Row name="证据" value={M.meta.checks.ok + " / " + M.meta.checks.total} color={C.cyan} />
        <Row name="测试" value={M.meta.tests.suites + " 套"} />
        <Row name="梯度误差" value={M.synth.gradErr.toExponential(4)} color={C.amber} />
        <Row name="拟合 μ / σ" value={M.synth.fitMu.toFixed(3) + " / " + M.synth.fitSigma.toFixed(3)} />
        <Verdict ok label="四十一项全过" />
      </Card>
    </div>
    <div style={{ position: "absolute", left: PAD, top: 745, width: CW }}>
      <Body size={FT.body} color={C.inkDim}>损失曲线的形状也是证据：单调下降说明步长和链式求导都没写错。</Body>
    </div>
  </>
);

export const SVerification: React.FC = () => (
  <Pages id="verification" at={[0, pageAt("verification", 9), pageAt("verification", 17), pageAt("verification", 24), pageAt("verification", 31), pageAt("verification", 38), pageAt("verification", 45)]}>
    <P1 />
    <P2 />
    <P3 />
    <P4 />
    <P5 />
    <P6 />
    <P7 />
  </Pages>
);
