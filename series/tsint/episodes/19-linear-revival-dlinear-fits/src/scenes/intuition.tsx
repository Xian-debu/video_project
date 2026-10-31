import React from "react";
import { C, FONT, FT } from "../../design/tokens";
import { Bars, Body, CW, Card, Head, K, LinePlot, M, PAD, Pages, Row, Stat, fmtE, fmtF, fmtInt, pageAt } from "../shared";

const P1: React.FC = () => (
  <>
    <Head kicker="04 / 直觉" title="茅台窗口：趋势与季节" goal="后复权收盘价，九十六个交易日" />
    <div style={{ position: "absolute", left: PAD, top: 340, width: 1180 }}>
      <LinePlot width={1180} height={380} series={[
        { values: M.decomp.x, color: C.inkFaint, name: "收盘价" },
        { values: M.decomp.trend, color: C.amber, name: "趋势 · MA25" },
      ]} yFmt={(v) => fmtInt(v)} title="原始价格与移动平均趋势" />
    </div>
    <div style={{ position: "absolute", left: PAD, top: 760, width: 1180 }}>
      <LinePlot width={1180} height={210} series={[{ values: M.decomp.season, color: C.cyan, name: "季节 · x − 趋势" }]}
        yFmt={(v) => v.toFixed(0)} zeroLine legend={false} title="季节分量：围绕零上下摆动" padT={22} />
    </div>
    <div style={{ position: "absolute", left: PAD + 1210, top: 340, width: CW - 1210 }}>
      <Card label="读数" accent={C.amber} style={{ height: 630 }}>
        <Row name="窗口" value={M.meta.h + " 个交易日"} width={520} />
        <Row name="价格区间" value={fmtInt(Math.min(...M.decomp.x)) + " – " + fmtInt(Math.max(...M.decomp.x))} width={520} />
        <Row name="趋势核" value="25 日" note="中心对齐" width={520} />
        <Row name="季节范围" value={fmtInt(Math.min(...M.decomp.season)) + " – " + fmtInt(Math.max(...M.decomp.season))} width={520} />
        <div style={{ marginTop: 22 }}>
          <Body size={FT.body} color={C.inkDim}>
            两条线相加精确等于灰线：分解不增加信息，只是换排列。
          </Body>
          <K color={C.cyan} style={{ display: "block", marginTop: 12 }}>证据里 max |trend + season − x| = 0</K>
        </div>
      </Card>
    </div>
  </>
);

const P2: React.FC = () => (
  <>
    <Head kicker="04 / 直觉" title="五分钟线：峰值在一天" goal="绝对值收益率的功率谱，96 根窗" />
    <div style={{ position: "absolute", left: PAD, top: 340, width: 1120 }}>
      <Card label="|5-min log return| 的功率谱 · 前十六个频点" accent={C.cyan} pad={18}>
        <Bars width={1080} rowH={29} unit="横轴 k：周期 = 96 / k 根；48 根 = 一个交易日"
          items={M.spectrum.bins.filter((b) => b.k >= 1 && b.k <= 16).map((b) => ({
            label: "k=" + b.k,
            value: b.power,
            text: b.power.toFixed(1),
            color: b.k === M.spectrum.peakK ? C.amber : C.cyan,
            dim: b.k !== M.spectrum.peakK,
          }))} />
      </Card>
    </div>
    <div style={{ position: "absolute", left: PAD + 1150, top: 340, width: CW - 1150 }}>
      <Stat label="峰值频点" value={"k = " + M.spectrum.peakK} accent={C.amber} style={{ height: 160 }} sub={<span>周期 {fmtF(M.spectrum.periodBars, 0)} 根 = 一天</span>} />
      <Stat label="峰值功率" value={fmtF(M.spectrum.peakPower, 1)} accent={C.cyan} style={{ height: 160, marginTop: 18 }} sub={<span>第二峰 {fmtF(M.spectrum.secondPower, 1)}</span>} />
      <Stat label="峰 / 次峰" value={fmtF(M.spectrum.peakRatio, 3)} accent={C.violet} style={{ height: 160, marginTop: 18 }} sub={<span>门槛 1.2，已过</span>} />
    </div>
    <div style={{ position: "absolute", left: PAD, top: 902, width: CW }}>
      <K color={C.amber}>日内周期是真的；但周期强，不等于线性模型能把它变成误差优势。</K>
    </div>
  </>
);

const P3: React.FC = () => (
  <>
    <Head kicker="04 / 直觉" title="R=24 的低通，留下了波纹" goal="合成序列：周期 48、3 与一点高频" />
    <div style={{ position: "absolute", left: PAD, top: 340, width: 1120 }}>
      <LinePlot width={1120} height={330} series={[
        { values: M.synth.x, color: C.inkFaint, name: "原序列" },
        { values: M.synth.low, color: C.amber, name: "R=24 重建" },
      ]} legend title="完整重建 vs 只留 24 个分量" yFmt={(v) => v.toFixed(1)} />
      <div style={{ marginTop: 4 }}>
        <LinePlot width={1120} height={190} series={[{ values: M.synth.resid, color: C.coral, name: "残差" }]}
          legend={false} zeroLine title="残差：被砍掉的高频" yFmt={(v) => v.toFixed(2)} padT={22} />
      </div>
    </div>
    <div style={{ position: "absolute", left: PAD + 1150, top: 340, width: CW - 1150 }}>
      <Stat label="完整重建误差" value={fmtE(M.struct.synthFull)} accent={C.cyan} valueSize={FT.num} style={{ height: 180 }} sub={<span>49 个分量，往返</span>} />
      <Stat label="低通残差 RMS" value={fmtF(M.struct.synthLowRms, 4)} accent={C.amber} style={{ height: 180, marginTop: 18 }} sub={<span>只留前 24 个分量</span>} />
      <Card label="结论" accent={C.violet} style={{ height: 200, marginTop: 18 }}>
        <Body size={FT.body}>能混合频率，不能创造高频。带宽是结构约束。</Body>
      </Card>
    </div>
    <div style={{ position: "absolute", left: PAD, top: 880, width: CW }}>
      <Body size={FT.body} color={C.inkDim}>
        三张图说同一件事：线性模型的强弱，取决于你给它什么坐标。
      </Body>
    </div>
  </>
);

export const SIntuition: React.FC = () => (
  <Pages id="intuition" at={[0, pageAt("intuition", 10), pageAt("intuition", 20)]}>
    <P1 />
    <P2 />
    <P3 />
  </Pages>
);