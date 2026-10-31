import React from "react";
import { C, FONT, FT } from "../../design/tokens";
import { Bars, Body, CW, Card, Head, K, M, PAD, Pages, Row, Stat, Verdict, fmtE, fmtF, fmtInt, pageAt } from "../shared";

const Cell: React.FC<{ label: string; value: string; ok?: boolean; color: string }> = ({ label, value, ok = true, color }) => (
  <div style={{ width: 520, borderLeft: "2px solid " + color, paddingLeft: 14, marginBottom: 16 }}>
    <div style={{ fontFamily: FONT.sans, fontSize: FT.meta, color: C.inkDim }}>{label}</div>
    <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginTop: 2 }}>
      <div style={{ fontFamily: FONT.mono, fontSize: FT.mono, color: C.ink }}>{value}</div>
      <Verdict ok={ok} />
    </div>
  </div>
);

const P1: React.FC = () => (
  <>
    <Head kicker="06 / 验证" title="结构断言：先把定义钉死" goal="三十项检查，全部进证据 JSON" />
    <div style={{ position: "absolute", left: PAD, top: 350, width: CW }}>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "4px 40px" }}>
        <Cell label="共享线性参数量" value={String(M.meta.params.shared)} color={C.cyan} />
        <Cell label="DLinear 参数量" value={String(M.meta.params.dlinear)} color={C.amber} />
        <Cell label="FITS 参数量（R=24）" value={String(M.meta.params.fits)} color={C.violet} />
        <Cell label="分解恒等式 t + s = x" value={fmtE(M.struct.decompErr)} color={C.cyan} />
        <Cell label="k = 1 退化为共享线性" value={fmtE(M.struct.k1EquivErr)} color={C.cyan} />
        <Cell label="49 点 FFT 往返" value={fmtE(M.struct.fftRoundTrip)} color={C.cyan} />
        <Cell label="DC 分量保持" value={fmtE(M.struct.dcErr)} color={C.cyan} />
        <Cell label="合成序列完整重建" value={fmtE(M.struct.synthFull)} color={C.cyan} />
        <Cell label="R=24 低通残差 RMS" value={fmtF(M.struct.synthLowRms, 4)} color={C.amber} />
        <Cell label="批处理恒等 max 误差" value={fmtE(M.struct.batchErr)} color={C.violet} />
      </div>
    </div>
    <div style={{ position: "absolute", left: PAD, top: 800, width: CW }}>
      <Card label="为什么先验结构" accent={C.cyan} pad={20}>
        <Body size={FT.h2}>
          训练指标好，可能只是早停蒙对了；结构断言错，模型从定义上就不对。
        </Body>
      </Card>
    </div>
  </>
);

const P2: React.FC = () => (
  <>
    <Head kicker="06 / 验证" title="梯度：解析式对得上数值差分" goal="中心差分，逐参数抽查" />
    <div style={{ position: "absolute", left: PAD, top: 350, width: 1080 }}>
      <Card label="模块内解析梯度 vs 数值差分（门槛 1e-6）" accent={C.amber}>
        <Row name="共享线性" value={fmtE(M.grad.shared)} note="2328 个参数" width={1000} />
        <Row name="DLinear" value={fmtE(M.grad.dlinear)} note="4656 个参数" width={1000} />
        <Row name="FITS" value={fmtE(M.grad.fits)} note="2352 个参数" width={1000} />
        <div style={{ marginTop: 18 }}>
          <Body size={FT.body}>数值差分用 ε = 1e-5，取一条真实验证窗逐参数抽查，不做截断近似。</Body>
        </div>
      </Card>
    </div>
    <div style={{ position: "absolute", left: PAD + 1110, top: 350, width: CW - 1110 }}>
      <Stat label="快速训练器 vs 模块梯度" value={fmtE(M.grad.fastShared)} accent={C.cyan} valueSize={FT.h2} style={{ height: 150 }} sub={<span>共享线性，门槛 1e-9</span>} />
      <Stat label="同上 · DLinear" value={fmtE(M.grad.fastDlinear)} accent={C.cyan} valueSize={FT.h2} style={{ height: 150, marginTop: 16 }} sub={<span>门槛 1e-9</span>} />
      <Stat label="同上 · FITS" value={fmtE(M.grad.fastFits)} accent={C.cyan} valueSize={FT.h2} style={{ height: 150, marginTop: 16 }} sub={<span>门槛 1e-9</span>} />
    </div>
    <div style={{ position: "absolute", left: PAD, top: 790, width: CW }}>
      <Body size={FT.body} color={C.inkDim}>
        训练器为速度重写了批量梯度；它必须和模块的解析梯度逐元素一致，否则训练出来的数不可信。
      </Body>
    </div>
  </>
);

const Td: React.FC<{ children: React.ReactNode; w?: number; align?: "left" | "right"; color?: string; size?: number }> = ({ children, w = 260, align = "right", color = C.inkDim, size = FT.meta }) => (
  <div style={{ width: w, textAlign: align, fontFamily: FONT.mono, fontSize: size, color, fontVariantNumeric: "tabular-nums" }}>{children}</div>
);

const P3: React.FC = () => (
  <>
    <Head kicker="06 / 验证" title="日线：DLinear 赢共享线性，输给最朴素基线" goal="八条序列，二十四步，反变换后 MAE" />
    <div style={{ position: "absolute", left: PAD, top: 340, width: CW }}>
      <Card label="样本外 MAE · 单位：元（后复权）" accent={C.amber} pad={18}>
        <div style={{ display: "flex", borderBottom: "1px solid " + C.panelLine, paddingBottom: 8 }}>
          <Td w={280} align="left" color={C.inkFaint}>序列</Td>
          <Td color={C.cyan}>共享线性</Td>
          <Td color={C.amber}>DLinear</Td>
          <Td color={C.violet}>FITS</Td>
          <Td color={C.ink}>最朴素</Td>
          <Td w={170} color={C.inkFaint}>谁最好</Td>
        </div>
        {M.mae.perSeries.map((r) => {
          const vals = [r.shared, r.dlinear, r.fits];
          const best = Math.min(...vals);
          const who = best === r.dlinear ? "DLinear" : best === r.fits ? "FITS" : "共享";
          const last = r.last;
          return (
            <div key={r.series} style={{ display: "flex", alignItems: "baseline", padding: "7px 0", borderBottom: "1px solid " + C.panelLine }}>
              <Td w={280} align="left" color={r.series === "ALL" ? C.ink : C.inkDim} size={r.series === "ALL" ? FT.body : FT.meta}>{r.series}</Td>
              <Td color={r.shared === best ? C.cyan : C.inkDim}>{r.shared.toFixed(2)}</Td>
              <Td color={r.dlinear === best ? C.amber : C.inkDim}>{r.dlinear.toFixed(2)}</Td>
              <Td color={r.fits === best ? C.violet : C.inkDim}>{r.fits.toFixed(2)}</Td>
              <Td color={C.ink}>{last.toFixed(2)}</Td>
              <Td w={170} color={last < best ? C.coral : C.inkFaint}>{last < best ? "最朴素更低" : who}</Td>
            </div>
          );
        })}
      </Card>
    </div>
    <div style={{ position: "absolute", left: PAD, top: 860, width: CW }}>
      <Body size={FT.body} color={C.inkDim}>
        八条序列里，最朴素基线在八条上都更低。DLinear 在三条线性模型里赢了七条。
      </Body>
    </div>
  </>
);

const P4: React.FC = () => (
  <>
    <Head kicker="06 / 验证" title="五分钟线：FITS 反超，幅度有限" goal="茅台五分钟，四十八根一天" />
    <div style={{ position: "absolute", left: PAD, top: 350, width: 760 }}>
      <Card label="五分钟 MAE · 单位：元" accent={C.cyan}>
        <Bars width={700} rowH={54} items={[
          { label: "共享线性", value: M.mae.minuteShared, text: fmtF(M.mae.minuteShared, 3), color: C.cyan },
          { label: "DLinear", value: M.mae.minuteDlinear, text: fmtF(M.mae.minuteDlinear, 3), color: C.amber },
          { label: "FITS", value: M.mae.minuteFits, text: fmtF(M.mae.minuteFits, 3), color: C.violet },
          { label: "最朴素", value: M.mae.minuteLast, text: fmtF(M.mae.minuteLast, 3), color: C.coral },
        ]} />
        <K style={{ display: "block", marginTop: 10 }}>三条线性模型两两差距不超过 1.4%</K>
      </Card>
    </div>
    <div style={{ position: "absolute", left: PAD + 790, top: 350, width: CW - 790 }}>
      <Card label="功率谱峰值 · |五分钟对数收益|" accent={C.amber}>
        <Bars width={840} rowH={38} items={M.spectrum.bins.filter((b) => b.k >= 1 && b.k <= 6).map((b) => ({
          label: "k=" + b.k + " · " + Math.round(b.period) + " 根",
          value: b.power, text: b.power.toFixed(1),
          color: b.k === 2 ? C.amber : C.cyan,
          dim: b.k !== 2,
        }))} />
        <Row name="峰 / 次峰" value={fmtF(M.spectrum.peakRatio, 3)} note="门槛 1.2" width={820} />
      </Card>
    </div>
    <div style={{ position: "absolute", left: PAD, top: 820, width: CW }}>
      <Body size={FT.body} color={C.inkDim}>
        日内周期在谱上很硬，但它没有变成线性模型的误差优势。最朴素基线在五分钟线上也仍然更低。
      </Body>
    </div>
  </>
);

const P5: React.FC = () => (
  <>
    <Head kicker="06 / 验证" title="三十项检查，零失败" goal="可复现命令写在证据 JSON 里" />
    <div style={{ position: "absolute", left: PAD, top: 350, width: CW, display: "flex", gap: 24 }}>
      <Stat label="证据检查" value={M.meta.checks.ok + " / " + M.meta.checks.total} accent={C.cyan} style={{ flex: 1, height: 200 }} sub={<span>结构、梯度、数据、指标</span>} />
      <Stat label="测试套件" value={String(M.meta.tests.suites)} accent={C.cyan} style={{ flex: 1, height: 200 }} sub={<span>{"asserts " + M.meta.tests.asserts}</span>} />
      <Stat label="日线提升" value="3.32%" accent={C.amber} style={{ flex: 1, height: 200 }} sub={<span>DLinear 相对共享线性</span>} />
      <Stat label="最朴素优势" value="4.40%" accent={C.coral} style={{ flex: 1, height: 200 }} sub={<span>相对 DLinear</span>} />
    </div>
    <div style={{ position: "absolute", left: PAD, top: 620, width: 1120 }}>
      <Card label="本集真正的问题" accent={C.violet}>
        <Body size={FT.h2} color={C.ink}>
          结构换来的是可解释与可优化，而不是必然更高的精度。
        </Body>
        <Body size={FT.body} style={{ marginTop: 16 }}>
          参数量从十四万降到四千六，误差却没有甩开最朴素基线；能赢的只有
          「同样简单的前提下，谁更快、更稳」。
        </Body>
      </Card>
    </div>
    <div style={{ position: "absolute", left: PAD + 1150, top: 620, width: CW - 1150 }}>
      <Stat label="参数量之比" value="31×" accent={C.amber} style={{ height: 160 }} sub={<span>书表 3.1 大模型 vs DLinear</span>} />
      <Stat label="我们三个模型" value="2.0×" accent={C.cyan} style={{ height: 160, marginTop: 16 }} sub={<span>4656 / 2328，参数量并非精度主因</span>} />
    </div>
  </>
);

export const SVerification: React.FC = () => (
  <Pages id="verification" at={[0, pageAt("verification", 10), pageAt("verification", 20), pageAt("verification", 32), pageAt("verification", 42)]}>
    <P1 />
    <P2 />
    <P3 />
    <P4 />
    <P5 />
  </Pages>
);