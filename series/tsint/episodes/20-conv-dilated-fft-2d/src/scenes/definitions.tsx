import React from "react";
import { C, FONT, FT } from "../../design/tokens";
import { Bars, Body, CW, Card, Chip, Formula, Head, K, M, PAD, Pages, PanelHeat, Row, Stat, fmtInt, pageAt } from "../shared";

const ez = (v: number) => (v === 0 ? "0" : v.toExponential(1));

const P1: React.FC = () => (
  <>
    <Head kicker="02 / 定义" title="因果空洞卷积：只能看过去" goal="左填充、空洞、逐层累加" />
    <div style={{ position: "absolute", left: PAD, top: 340, width: 1080 }}>
      <Card label="时间轴 · 式 3.14" accent={C.cyan} style={{ height: 400 }}>
        <Formula size={FT.h1}>
          Z_t = Σ_k f_k · z_(t − (K−1−k)d)
        </Formula>
        <Body size={FT.body} style={{ marginTop: 18 }}>
          第 l 层在 t 时刻只读本层 t 及更早的位置：卷积窗右端对齐当前时刻。
        </Body>
        <Body size={FT.body} style={{ marginTop: 10 }}>
          d 是膨胀因子，每个抽头之间空 d − 1 个点；在时间轴上跳着看，不越界。
        </Body>
        <div style={{ marginTop: 14, display: "flex", gap: 10 }}>
          <Chip color={C.cyan}>只左填充</Chip>
          <Chip color={C.amber}>k = 0 最老</Chip>
          <Chip color={C.violet}>无未来项</Chip>
        </div>
      </Card>
    </div>
    <div style={{ position: "absolute", left: PAD + 1110, top: 340, width: CW - 1110 }}>
      <Card label="四层之后，一个输出点能看到多远" accent={C.amber} style={{ height: 400 }} pad={20}>
        <Bars
          items={[
            { label: "L1 · d=1", value: 3, text: "RF 3", color: C.cyan, dim: true },
            { label: "L2 · d=2", value: 7, text: "RF 7", color: C.cyan, dim: true },
            { label: "L3 · d=4", value: 15, text: "RF 15", color: C.amber, dim: true },
            { label: "L4 · d=8", value: M.meta.rf, text: "RF 31", color: C.amber },
          ]}
          width={CW - 1160}
          max={31}
          rowH={58}
        />
        <K style={{ marginTop: 12 }}>1 + Σ(K−1)d = 1 + 2 + 4 + 8 + 16 = {M.meta.rf}</K>
      </Card>
    </div>
    <div style={{ position: "absolute", left: PAD, top: 800, width: CW }}>
      <Body size={FT.lead} color={C.ink}>三个参数就能钉住因果性，剩下的全是形状。</Body>
    </div>
  </>
);

const P2: React.FC = () => (
  <>
    <Head kicker="02 / 定义" title="FFT 定周期：谁在振动" goal="去直流、取峰、换成根数" />
    <div style={{ position: "absolute", left: PAD, top: 340, width: 1000 }}>
      <Card label="式 3.16 · 频率分量" accent={C.violet} style={{ height: 390 }}>
        <Formula size={FT.h1}>Z_k = Σ_t z_t · e^(−2πikt/n)</Formula>
        <Body size={FT.body} style={{ marginTop: 16 }}>
          取振幅最大的 k 个频率；周期 p = ceil(n / f)，夹在 2 到 n 之间。
        </Body>
        <Body size={FT.body} style={{ marginTop: 10 }}>
          直流项是均值，不是周期，先移除；否则排第一的永远是它。
        </Body>
        <div style={{ marginTop: 14, display: "flex", gap: 10 }}>
          <Chip color={C.violet}>去直流</Chip>
          <Chip color={C.violet}>取前 k 峰</Chip>
          <Chip color={C.coral}>并列按周期排序</Chip>
        </div>
      </Card>
    </div>
    <div style={{ position: "absolute", left: PAD + 1030, top: 340, width: CW - 1030 }}>
      <Card label="真实五分钟线 · 前六峰" accent={C.amber} style={{ height: 390 }} pad={18}>
        {M.spectrum.peaks.slice(0, 5).map((p) => (
          <Row
            key={p.period}
            name={"第 " + p.rank + " · " + p.period + " 根"}
            value={p.amp.toFixed(3)}
            note={p.rank === 1 ? "约一个交易日" : p.period === 24 ? "半个交易日" : "日内谐波"}
            color={p.rank === 1 ? C.amber : C.inkDim}
            width={CW - 1080}
          />
        ))}
        <K style={{ marginTop: 8 }}>窗长 {M.meta.h} 根；振幅归一化到第一峰 = 1</K>
      </Card>
    </div>
    <div style={{ position: "absolute", left: PAD, top: 790, width: CW }}>
      <Body size={FT.lead} color={C.ink}>第一峰和第二峰只差 3.8%，这份样本的周期并不尖锐。</Body>
    </div>
  </>
);

const P3: React.FC = () => (
  <>
    <Head kicker="02 / 定义" title="折叠：把周期变成第二根轴" goal="相位轴环形，周期轴零填充" />
    <div style={{ position: "absolute", left: PAD, top: 340, width: 1120 }}>
      <Card label={"折叠后的二维网格 · " + M.fold.rows + " × " + M.fold.cols} accent={C.cyan} style={{ height: 400 }} pad={18}>
        <PanelHeat
          z={M.fold.grid}
          blockCols={[]}
          width={1080}
          height={280}
          title="行 = 周期序号，列 = 相位"
          accent={C.cyan}
        />
      </Card>
    </div>
    <div style={{ position: "absolute", left: PAD + 1150, top: 340, width: CW - 1150 }}>
      <Card label="两条边界" accent={C.violet} style={{ height: 400 }}>
        <Body size={FT.h2} color={C.ink}>相位是环。</Body>
        <Body size={FT.body} style={{ marginTop: 8 }}>
          一天结束接次日开始；列方向卷积可以绕回。
        </Body>
        <Body size={FT.h2} color={C.ink} style={{ marginTop: 16 }}>周期是边。</Body>
        <Body size={FT.body} style={{ marginTop: 8 }}>
          行数不够就补零，不能绕回，否则第一个周期会读到最后一个。
        </Body>
      </Card>
    </div>
    <div style={{ position: "absolute", left: PAD, top: 800, width: CW }}>
      <Body size={FT.lead} color={C.ink}>同一份数据，换一个坐标系，卷积就能同时看日内和跨日。</Body>
    </div>
  </>
);

const P4: React.FC = () => (
  <>
    <Head kicker="02 / 定义" title="二维卷积与聚合：三条断言" goal="式 3.17 与实测的式 3.18" />
    <div style={{ position: "absolute", left: PAD, top: 340, width: 1000 }}>
      <Card label="先逐周期卷积，再按振幅加权" accent={C.amber} style={{ height: 400 }}>
        <Formula size={FT.h1}>ŷ = Σ_i A_i · Conv2D(Z_i)</Formula>
        <Body size={FT.body} style={{ marginTop: 16 }}>
          A_i 来自第 i 个周期的振幅；ΣA = 1，否则周期数一变，输出幅度就跟着变。
        </Body>
        <Body size={FT.body} style={{ marginTop: 10 }}>
          书里式 3.18 写的是 A_l，但等式右边按 i 求和；实测按 i 解释，这里照实测。
        </Body>
      </Card>
    </div>
    <div style={{ position: "absolute", left: PAD + 1030, top: 340, width: CW - 1030 }}>
      <Card label="三条可断言的检查" accent={C.cyan} style={{ height: 400 }}>
        <Row name="1×1 核等价恒等" value={ez(M.struct.conv1x1Err)} note="误差上限从 1e-12 起" color={C.cyan} width={CW - 1080} />
        <Row name="权重和" value={M.struct.ampSum.toFixed(1)} note="ΣA = 1，浮点容差 1e-12" color={C.cyan} width={CW - 1080} />
        <Row name="折叠可逆" value={ez(M.struct.foldErr)} note="reshape 之后逐位还原" color={C.cyan} width={CW - 1080} />
        <Row name="输出块恒等" value={ez(M.struct.blockIdentityErr)} note="同相位块，1×1 权重为 1" color={C.violet} width={CW - 1080} />
      </Card>
    </div>
    <div style={{ position: "absolute", left: PAD, top: 800, width: CW, display: "flex", gap: 22 }}>
      <Stat label="折叠误差" value={ez(M.struct.foldErr)} accent={C.cyan} style={{ width: 560 }} sub={<span>336 个元素逐位比较</span>} />
      <Stat label="1×1 核误差" value={ez(M.struct.conv1x1Err)} accent={C.amber} style={{ width: 560 }} sub={<span>核中心对齐之后</span>} />
      <Stat label="振幅和" value={M.struct.ampSum.toFixed(2)} accent={C.violet} style={{ width: 560 }} sub={<span>归一化没漏项</span>} />
    </div>
  </>
);

export const SDefinitions: React.FC = () => (
  <Pages id="definitions" at={[0, pageAt("definitions", 18), pageAt("definitions", 29), pageAt("definitions", 39)]}>
    <P1 />
    <P2 />
    <P3 />
    <P4 />
  </Pages>
);
