import React from "react";
import { C, FONT, FT } from "../../design/tokens";
import { Body, CW, Card, Chip, Head, HistPair, K, LinePlot, M, PAD, Pages, Row, Stat, fmtF, fmtInt } from "../shared";

const P1: React.FC = () => (
  <>
    <Head kicker="04 / 直觉" title="绝对误差跟着价格走" goal="同一条线，两个价段" />
    <div style={{ position: "absolute", left: PAD, top: 336, width: 1100 }}>
      <LinePlot
        width={1100}
        height={520}
        series={[
          { values: M.horizon.low.mae, color: C.cyan, name: "低价段 MAE" },
          { values: M.horizon.high.mae, color: C.amber, name: "高价段 MAE" },
        ]}
        yFmt={(v) => fmtInt(v)}
        yMin={0}
        yMax={760}
        title={"逐视野平均绝对误差（元）· 横轴第 1 到第 24 步"}
      />
      <div style={{ display: "flex", gap: 22, marginTop: 6 }}>
        <K color={C.cyan}>第 1 步 13.92 → 第 24 步 71.38</K>
        <K color={C.amber}>第 24 步 683.12</K>
      </div>
    </div>
    <div style={{ position: "absolute", left: PAD + 1140, top: 336, width: CW - 1140, display: "flex", flexDirection: "column", gap: 18 }}>
      <Stat label="低价段 · MAE" value={fmtF(M.era.low.mae, 2)} accent={C.cyan} style={{ height: 150 }}
        sub={<span>{fmtInt(M.era.low.windows)} 个窗口 · 均价 {fmtF(M.era.low.mean, 0)} 元</span>} />
      <Stat label="高价段 · MAE" value={fmtF(M.era.high.mae, 2)} accent={C.amber} style={{ height: 150 }}
        sub={<span>{fmtInt(M.era.high.windows)} 个窗口 · 均价 {fmtF(M.era.high.mean, 0)} 元</span>} />
      <Stat label="倍率" value={fmtF(M.era.maeRatio, 2) + "×"} accent={C.coral} style={{ height: 150 }}
        sub={<span>尺度效应，不是模型变差</span>} />
    </div>
    <div style={{ position: "absolute", left: PAD, top: 890, width: CW }}>
      <Body size={FT.lead} color={C.ink}>
        同一个线性层，高价段的误差是低价段的九点九倍——因为它错的是同样的比例。
      </Body>
    </div>
  </>
);

const P2: React.FC = () => (
  <>
    <Head kicker="04 / 直觉" title="百分比误差把价格除掉" goal="低价 5.05%，高价 4.24%" />
    <div style={{ position: "absolute", left: PAD, top: 340, width: 1000 }}>
      <HistPair
        title="每窗 MAPE 分布 · 低价段 vs 高价段"
        edges={M.hist.mapeEdges}
        a={M.hist.lowMape}
        b={M.hist.highMape}
        aLabel="低价段 1,411 窗"
        bLabel="高价段 1,579 窗"
        colorA={C.cyan}
        colorB={C.amber}
        width={1000}
        height={430}
        xTitle="MAPE (%)"
      />
      <div style={{ display: "flex", gap: 26, marginTop: 8 }}>
        <K color={C.cyan}>低价段均值 5.05%</K>
        <K color={C.amber}>高价段均值 4.24%</K>
      </div>
    </div>
    <div style={{ position: "absolute", left: PAD + 1040, top: 350, width: CW - 1040 }}>
      <Card label="读法" accent={C.violet} style={{ height: 330 }}>
        <Row name="低价段 MAPE" value={fmtF(M.era.low.mape, 2) + "%"} color={C.cyan} width={CW - 1040 - 48} />
        <Row name="高价段 MAPE" value={fmtF(M.era.high.mape, 2) + "%"} color={C.amber} width={CW - 1040 - 48} />
        <Row name="倍率" value={fmtF(M.era.mapeRatio, 2) + "×"} note="高价段反而更低" color={C.coral} width={CW - 1040 - 48} />
        <Body size={FT.body} style={{ marginTop: 16 }}>
          两个分布几乎重合。尺度效应被除掉，剩下的是模型本身的比例误差。
        </Body>
      </Card>
    </div>
    <div style={{ position: "absolute", left: PAD, top: 830, width: CW }}>
      <Body size={FT.lead} color={C.ink}>
        绝对误差量错了多少钱，百分比误差量错了百分之几。两个问题都对。
      </Body>
    </div>
  </>
);

const P3: React.FC = () => (
  <>
    <Head kicker="04 / 直觉" title="合成数据：两个赢家" goal="加五 vs 乘一点零二" />
    <div style={{ position: "absolute", left: PAD, top: 340, width: CW, display: "flex", gap: 26 }}>
      <Card label="候选一 · 每个点加五" accent={C.cyan} style={{ flex: 1, height: 300 }}>
        <div style={{ fontFamily: FONT.mono, fontSize: FT.h1, color: C.ink }}>{fmtF(M.synthetic.add5Mae, 4)}</div>
        <Body size={FT.meta}>MAE · 元</Body>
        <div style={{ marginTop: 14 }}>
          <Row name="MAPE" value={fmtF(M.synthetic.add5Mape, 4) + "%"} color={C.cyan} width={760} />
          <Row name="验证集 MAPE" value={fmtF(M.synthetic.valAdd5Mape, 4) + "%"} color={C.cyan} width={760} />
        </div>
        <div style={{ marginTop: 16 }}><Chip color={C.cyan}>MAE 的赢家</Chip></div>
      </Card>
      <Card label="候选二 · 每个点乘一点零二" accent={C.amber} style={{ flex: 1, height: 300 }}>
        <div style={{ fontFamily: FONT.mono, fontSize: FT.h1, color: C.ink }}>{fmtF(M.synthetic.mul102Mape, 4) + "%"}</div>
        <Body size={FT.meta}>MAPE · 百分比</Body>
        <div style={{ marginTop: 14 }}>
          <Row name="MAE" value={fmtF(M.synthetic.mul102Mae, 4)} color={C.amber} width={760} />
          <Row name="验证集 MAPE" value={fmtF(M.synthetic.valMul102Mape, 4) + "%"} color={C.amber} width={760} />
        </div>
        <div style={{ marginTop: 16 }}><Chip color={C.amber}>MAPE 的赢家</Chip></div>
      </Card>
    </div>
    <div style={{ position: "absolute", left: PAD, top: 700, width: CW }}>
      <Row name="按 MAE 选模" value={"选 " + M.synthetic.maePick} note="误差五块，比十点一二小" color={C.cyan} width={CW} />
      <Row name="按 MAPE 选模" value={"选 " + M.synthetic.mapePick} note="百分之二，比二十五点二三小" color={C.amber} width={CW} />
      <Row name="验证样本" value={fmtInt(M.synthetic.n) + " 个点"} note="真值均值五十左右" color={C.inkFaint} width={CW} />
    </div>
    <div style={{ position: "absolute", left: PAD, top: 880, width: CW }}>
      <Body size={FT.lead} color={C.ink}>
        同一个验证集，两个赢家。指标的选择，就是对哪种错误更不可接受表态。
      </Body>
    </div>
  </>
);

export const SIntuition: React.FC = () => (
  <Pages id="intuition" at={[0, 0.4, 0.7]}>
    <P1 />
    <P2 />
    <P3 />
  </Pages>
);
