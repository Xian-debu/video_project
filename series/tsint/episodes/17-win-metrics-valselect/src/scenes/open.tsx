import React from "react";
import { C, FONT, FT } from "../../design/tokens";
import { Body, CW, Card, Chip, Formula, Head, K, LinePlot, M, PAD, Pages, Stat, fmtF, fmtInt } from "../shared";

const P1: React.FC = () => (
  <>
    <Head kicker="第 3 章 / 预测层" title="窗口、指标与验证集" goal="四个指标，一个验证集" />
    <div style={{ position: "absolute", left: PAD, top: 340, width: 860 }}>
      <Card label="式(3.1) · 预测映射" accent={C.cyan} style={{ height: 330 }}>
        <Formula size={44}>X̂ = f_θ(X)</Formula>
        <Body size={FT.body} style={{ marginTop: 20 }}>
          一个函数，把 H 步历史映射到 F 步未来。书里就这一行。
          样本怎么切、三段怎么分、边界留不留空，一句话没写。
        </Body>
        <div style={{ marginTop: 16 }}><Chip color={C.cyan}>一条序列 · 一个映射</Chip></div>
      </Card>
    </div>
    <div style={{ position: "absolute", left: PAD + 890, top: 340, width: CW - 890 }}>
      <Card label="滑窗样本 · (H+F) × N" accent={C.violet} style={{ height: 330 }}>
        <Formula size={30} color={C.violet}>X_i = (x_t−H+1, …, x_t, x_t+1, …, x_t+F)</Formula>
        <Body size={FT.body} style={{ marginTop: 20 }}>
          输入九十六根，标签二十四根，起点每步走一格。
          书里只有这个形状，没有数量公式。
        </Body>
        <div style={{ marginTop: 16 }}><Chip color={C.violet}>H = 96 · F = 24</Chip></div>
      </Card>
    </div>
    <div style={{ position: "absolute", left: PAD, top: 760, width: CW }}>
      <Body size={FT.lead} color={C.ink}>
        一条日线，切成三千七百六十一个窗口，每一步都在预测未来。
      </Body>
    </div>
  </>
);

const P2: React.FC = () => (
  <>
    <Head kicker="01 / 开场" title="一条线，三千八百天" goal="后复权，二零一零到二零二五" />
    <div style={{ position: "absolute", left: PAD, top: 336, width: 1180 }}>
      <LinePlot
        width={1180}
        height={520}
        legend={false}
        series={[{ values: M.path.close, color: C.cyan, name: "收盘价" }]}
        yFmt={(v) => fmtInt(v)}
        yMin={0}
        yMax={18000}
        title={"茅台后复权收盘价 · 每四个交易日取一点"}
        hlines={[
          { v: M.path.lowT, color: C.cyan, label: "低价段阈值 1,500 元" },
          { v: M.path.highT, color: C.amber, label: "高价段阈值 6,000 元" },
        ]}
      />
      <div style={{ display: "flex", gap: 18, marginTop: 8 }}>
        <K>min 515.43</K>
        <K>max 17,080.59</K>
        <K color={C.amber}>两个价段分别看误差</K>
      </div>
    </div>
    <div style={{ position: "absolute", left: PAD + 1220, top: 336, width: CW - 1220, display: "flex", flexDirection: "column", gap: 18 }}>
      <Stat label="交易日" value={fmtInt(M.data.rows)} accent={C.cyan} style={{ height: 150 }}
        sub={<span>{M.data.first} → {M.data.last}</span>} />
      <Stat label="滑窗样本" value={fmtInt(M.windows.total)} accent={C.violet} style={{ height: 150 }}
        sub={<span>H {M.windows.h} · F {M.windows.f} · 步长 1</span>} />
      <Stat label="CSV 字节" value={fmtInt(M.data.csvBytes)} accent={C.amber} style={{ height: 150 }}
        sub={<span>ts-admin 导出，单票后复权</span>} />
    </div>
  </>
);

const P3: React.FC = () => (
  <>
    <Head kicker="01 / 开场" title="四个数，先钉在墙上" goal="两组对照：误差与排序" />
    <div style={{ position: "absolute", left: PAD, top: 360, width: CW, display: "flex", gap: 22 }}>
      <Stat label="低价段 · MAE" value={fmtF(M.era.low.mae, 2)} accent={C.cyan} style={{ flex: 1, height: 250 }}
        sub={<span>均价 {fmtF(M.era.low.mean, 0)} 元 · {fmtInt(M.era.low.windows)} 个窗口</span>} />
      <Stat label="高价段 · MAE" value={fmtF(M.era.high.mae, 2)} accent={C.amber} style={{ flex: 1, height: 250 }}
        sub={<span>均价 {fmtF(M.era.high.mean, 0)} 元 · {fmtInt(M.era.high.windows)} 个窗口</span>} />
      <Stat label="MAPE · 低价 / 高价" value={fmtF(M.era.low.mape, 2) + "% / " + fmtF(M.era.high.mape, 2) + "%"} accent={C.violet} valueSize={32} style={{ flex: 1, height: 250 }}
        sub={<span>高价段反而低，倍率 {fmtF(M.era.mapeRatio, 2)}</span>} />
      <Stat label="合成数据 · 排序" value="add5 / mul1.02" accent={C.coral} valueSize={30} style={{ flex: 1, height: 250 }}
        sub={<span>MAE 选前者，MAPE 选后者</span>} />
    </div>
    <div style={{ position: "absolute", left: PAD, top: 690, width: CW }}>
      <Body size={FT.lead} color={C.ink}>
        第一组：误差差 {fmtF(M.era.maeRatio, 2)} 倍，百分比只差 {fmtF(M.era.mapeRatio, 2)}。
      </Body>
      <Body size={FT.lead} color={C.ink} style={{ marginTop: 8 }}>
        第二组：同一张验证集，两个指标给出两个赢家。
      </Body>
    </div>
  </>
);

const P4: React.FC = () => (
  <>
    <Head kicker="01 / 开场" title="两句话，管整集" goal="指标带立场，验证集只选模" />
    <div style={{ position: "absolute", left: PAD, top: 350, width: CW, display: "flex", gap: 26 }}>
      <Card label="第一句 · 指标带立场" accent={C.cyan} style={{ flex: 1, height: 300 }}>
        <Body size={FT.h2} color={C.ink}>误差量的是钱，</Body>
        <Body size={FT.h2} color={C.ink}>百分比量的是比例。</Body>
        <Body size={FT.body} style={{ marginTop: 18 }}>
          高价段误差四百七十块，低价段四十七块，差十倍；
          百分比五点零五对四点二四，几乎持平。选哪个，就是选哪种错误更不可接受。
        </Body>
      </Card>
      <Card label="第二句 · 验证集只选模" accent={C.violet} style={{ flex: 1, height: 300 }}>
        <Body size={FT.h2} color={C.ink}>验证集挑模型，</Body>
        <Body size={FT.h2} color={C.ink}>测试集只报一次。</Body>
        <Body size={FT.body} style={{ marginTop: 18 }}>
          式(3.4) 只写了验证损失取最小，没写测试集怎么用。
          本仓写死：测试集不参加选模，选完才打开。
        </Body>
      </Card>
    </div>
    <div style={{ position: "absolute", left: PAD, top: 720, width: CW }}>
      <Body size={FT.lead} color={C.ink}>
        所以：报误差要同时报尺度和指标；选模型只准看验证集。
      </Body>
      <div style={{ marginTop: 14 }}>
        <K color={C.coral}>零值处三个答案：Inf / 25% / 3.33e9，后两个必须显式要</K>
      </div>
    </div>
  </>
);

export const SOpen: React.FC = () => (
  <Pages id="open" at={[0, 0.26, 0.46, 0.72]}>
    <P1 />
    <P2 />
    <P3 />
    <P4 />
  </Pages>
);
