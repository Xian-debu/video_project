import React from "react";
import { C, FONT, FT } from "../../design/tokens";
import { Bars, Body, CW, Card, Chip, Formula, Head, K, KV, LinePlot, M, PAD, Pages, Row, Stat, pageAt } from "../shared";

const errs = Array.from({ length: 41 }, (_, i) => -2 + i * 0.1);
const pin = (e: number, tau: number) => (e >= 0 ? tau * e : (tau - 1) * e);
const l09 = errs.map((e) => pin(e, 0.9));
const l05 = errs.map((e) => pin(e, 0.5));

const P1: React.FC = () => (
  <>
    <Head kicker="04 / 直觉" title="不对称的损失" goal="横轴误差，纵轴罚款" />
    <div style={{ position: "absolute", left: PAD, top: 348, width: 1120 }}>
      <Card label="pinball 的形状" accent={C.amber} style={{ height: 400 }} pad={16}>
        <LinePlot
          series={[
            { values: l09, color: C.amber, name: "τ = 0.9" },
            { values: l05, color: C.violet, name: "τ = 0.5" },
          ]}
          width={1040}
          height={300}
          title="横轴：误差 e，从 −2 到 +2；纵轴：损失"
          yMin={0}
          yFmt={(v) => v.toFixed(2)}
          vlines={[{ i: 20, color: C.inkFaint, label: "e = 0" }]}
        />
      </Card>
    </div>
    <div style={{ position: "absolute", left: PAD + 1160, top: 348, width: CW - 1160 }}>
      <Card label="读图" accent={C.cyan} style={{ height: 400 }}>
        <Row name="τ = 0.9 低估" value="斜率 0.9" color={C.amber} />
        <Row name="τ = 0.9 高估" value="斜率 0.1" color={C.cyan} />
        <Row name="τ = 0.5" value="两边 0.5，V 形" color={C.violet} />
        <K style={{ display: "block", marginTop: 10 }}>
          同样差 1 元，低估罚 0.9，高估只罚 0.1——模型会主动往高里报。
        </K>
        <K style={{ display: "block", marginTop: 8 }}>这正是 90 分位数的性格：宁可高一点。</K>
      </Card>
    </div>
  </>
);

const P2: React.FC = () => (
  <>
    <Head kicker="04 / 直觉" title="最优常数是中位数" goal="分位数回归名字的来源" />
    <div style={{ position: "absolute", left: PAD, top: 350, width: 1060 }}>
      <Card label="样本 1 到 10，只能报一个常数" accent={C.cyan} style={{ height: 382 }}>
        <Bars
          width={1000}
          rowH={50}
          items={[
            { label: "c = 4", value: 2.7, text: "2.70", color: C.inkFaint },
            { label: "c = 5", value: 2.5, text: "2.50", color: C.cyan },
            { label: "c = 5.5（均值）", value: 2.5, text: "2.50", color: C.amber },
            { label: "c = 6", value: 2.5, text: "2.50", color: C.cyan },
            { label: "c = 7", value: 2.7, text: "2.70", color: C.inkFaint },
          ]}
        />
        <K style={{ display: "block", marginTop: 4 }}>纵轴：τ = 0.5 时平均 pinball 损失；5 到 6 之间并列最小。</K>
      </Card>
    </div>
    <div style={{ position: "absolute", left: PAD + 1100, top: 350, width: CW - 1100 }}>
      <Card label="两个分位数的最优常数" accent={C.violet} style={{ height: 382 }}>
        <Row name="τ = 0.5" value={"中位数 " + M.quantile.empMedian} color={C.cyan} />
        <Row name="τ = 0.9" value={"经验分位 " + M.quantile.emp90} color={C.amber} />
        <Row name="取 5 还是 6" value="并列最优，定义决定" />
        <K style={{ display: "block", marginTop: 10 }}>
          均值 5.5 也并列，但这只在对称样本上成立；重尾样本上中位数才是稳健答案。
        </K>
      </Card>
    </div>
    <div style={{ position: "absolute", left: PAD, top: 740, width: CW }}>
      <Body size={FT.lead} color={C.ink}>“分位数回归”就是：把损失换成 pinball，最优解自动变成分位数。</Body>
    </div>
  </>
);

const P3: React.FC = () => (
  <>
    <Head kicker="04 / 直觉" title="真实收益上的校准" goal="240 个交易日，一个标的" />
    <div style={{ position: "absolute", left: PAD, top: 350, width: 1000 }}>
      <Card label="名义 vs 实际覆盖率" accent={C.cyan} style={{ height: 340 }}>
        <Bars
          width={940}
          rowH={58}
          items={[
            { label: "τ = 0.1", value: M.real.cov10 * 100, text: (M.real.cov10 * 100).toFixed(1) + "%", color: C.cyan },
            { label: "τ = 0.5", value: M.real.cov50 * 100, text: (M.real.cov50 * 100).toFixed(1) + "%", color: C.violet },
            { label: "τ = 0.9", value: M.real.cov90 * 100, text: (M.real.cov90 * 100).toFixed(1) + "%", color: C.amber },
            { label: "10–90 区间", value: M.real.coverage80 * 100, text: (M.real.coverage80 * 100).toFixed(1) + "%", color: C.coral },
          ]}
          max={100}
        />
        <K style={{ display: "block", marginTop: 4 }}>名义：10% / 50% / 90% / 80%。</K>
      </Card>
    </div>
    <div style={{ position: "absolute", left: PAD + 1040, top: 350, width: CW - 1040 }}>
      <Card label="怎么读" accent={C.coral} style={{ height: 340 }}>
        <Row name="10% 分位" value={M.real.cov10.toFixed(4)} color={C.cyan} />
        <Row name="90% 分位" value={M.real.cov90.toFixed(4)} color={C.amber} />
        <Row name="80% 区间" value={M.real.coverage80.toFixed(4)} color={C.coral} />
        <K style={{ display: "block", marginTop: 10 }}>
          这三个数和名义值几乎一致：经验分位数把每个 τ 都校准住了。区间略宽，是因为样本少、尾部厚。
        </K>
      </Card>
    </div>
    <div style={{ position: "absolute", left: PAD, top: 740, width: CW }}>
      <Body size={FT.body} color={C.inkDim}>校准说的是频率：说 10% 就真的占 10%，不是“感觉差不多”。</Body>
    </div>
  </>
);

const P4: React.FC = () => (
  <>
    <Head kicker="04 / 直觉" title="高斯 NLL 的性格" goal="它学的是均值和尺度" />
    <div style={{ position: "absolute", left: PAD, top: 350, width: 1060 }}>
      <Card label="σ 太小或太大都不好" accent={C.amber} style={{ height: 340 }}>
        <Row name="σ 太小" value="残差项 (y−μ)²/σ² 爆炸" color={C.coral} />
        <Row name="σ 太大" value="log σ 项变大" color={C.violet} />
        <Row name="最优 σ" value="|y − μ|（每点）" color={C.cyan} />
        <Row name="总体最优" value="残差的标准差" />
        <K style={{ display: "block", marginTop: 10 }}>所以 NLL 同时把中心（μ）和尺度（σ）都学出来，不是只拟合均值。</K>
      </Card>
    </div>
    <div style={{ position: "absolute", left: PAD + 1100, top: 350, width: CW - 1100 }}>
      <Card label="拟合读数" accent={C.cyan} style={{ height: 340 }}>
        <Row name="μ" value={M.synth.fitMu.toFixed(4)} color={C.cyan} />
        <Row name="σ" value={M.synth.fitSigma.toFixed(4)} color={C.amber} />
        <Row name="损失" value={M.synth.fitLoss.toFixed(4)} color={C.violet} />
        <Row name="高斯 80% 区间覆盖" value={(M.real.coverageGauss80 * 100).toFixed(2) + "%"} color={C.coral} />
        <K style={{ display: "block", marginTop: 8 }}>比名义 80% 高：真实收益尾部更厚，正态装不下。</K>
      </Card>
    </div>
    <div style={{ position: "absolute", left: PAD, top: 740, width: CW }}>
      <Body size={FT.lead} color={C.ink}>一个分布、一组分位数，都是“报不确定性”的方式。</Body>
    </div>
  </>
);

export const SIntuition: React.FC = () => (
  <Pages id="intuition" at={[0, pageAt("intuition", 8), pageAt("intuition", 17), pageAt("intuition", 25)]}>
    <P1 />
    <P2 />
    <P3 />
    <P4 />
  </Pages>
);
