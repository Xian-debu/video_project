import React from "react";
import { C, FONT, FT } from "../../design/tokens";
import { Body, CW, Card, Chip, Formula, Head, K, LinePlot, M, PAD, Pages, Row, Stat, fmtF, fmtInt } from "../shared";

const P1: React.FC = () => (
  <>
    <Head kicker="第 3 章 / 预测层" title="归一化三兄弟" goal="RevIN、NowNorm、MeanNorm" />
    <div style={{ position: "absolute", left: PAD, top: 340, width: 980 }}>
      <Card label="p.45-46 · 三句话" accent={C.cyan} style={{ height: 340 }}>
        <Row name="可逆实例归一化" value="减均值，再除标准差" note="TSMixer / RLinear / TimeMixer" width={920} />
        <Row name="NowNorm" value="只减最后一个观测" note="NLinear：先减末值，最后加回" width={920} />
        <Row name="MeanNorm" value="只减窗口均值" note="SparseTSF：不减标准差" width={920} />
        <div style={{ marginTop: 18 }}>
          <Chip color={C.coral}>三处都没有公式 · 勘误 E33</Chip>
        </div>
      </Card>
    </div>
    <div style={{ position: "absolute", left: PAD + 1010, top: 340, width: CW - 1010 }}>
      <Card label="本集论点" accent={C.violet} style={{ height: 340 }}>
        <Formula size={34} color={C.violet}>x̂ = f(x − base) + base</Formula>
        <Body size={FT.body} style={{ marginTop: 18 }}>
          三个方法用同一个骨架，差别只在 base 怎么算：窗口均值加标准差、末值、均值。
          减什么，就是问模型该对什么不变。
        </Body>
      </Card>
    </div>
    <div style={{ position: "absolute", left: PAD, top: 760, width: CW }}>
      <Body size={FT.lead} color={C.ink}>
        书里三个名字，三句话；这一集把它们写成公式，再找一个能把它们分开的实验。
      </Body>
    </div>
  </>
);

const P2: React.FC = () => (
  <>
    <Head kicker="01 / 开场" title="一条日线，十五年" goal="后复权，二千五百多个交易日" />
    <div style={{ position: "absolute", left: PAD, top: 336, width: 1180 }}>
      <LinePlot
        width={1180}
        height={520}
        legend={false}
        series={[{ values: M.panel.maotai, color: C.cyan, name: "茅台后复权" }]}
        yFmt={(v) => fmtInt(v)}
        yMin={0}
        title={"茅台后复权收盘价 · 每九个交易日取一点"}
      />
      <div style={{ display: "flex", gap: 18, marginTop: 8 }}>
        <K>{M.data.first} → {M.data.last}</K>
        <K color={C.amber}>均价 {fmtInt(M.data.maotaiMean)} 元</K>
      </div>
    </div>
    <div style={{ position: "absolute", left: PAD + 1220, top: 336, width: CW - 1220, display: "flex", flexDirection: "column", gap: 18 }}>
      <Stat label="交易日" value={fmtInt(M.data.rows)} accent={C.cyan} style={{ height: 150 }}
        sub={<span>四边内连接，无缺失</span>} />
      <Stat label="量纲差 · 茅台 / 工行" value={fmtF(M.data.levelRatio, 1) + "×"} accent={C.amber} style={{ height: 150 }}
        sub={<span>{fmtInt(M.data.maotaiMean)} 元 对 {fmtF(M.data.icbcMean, 1)} 元</span>} />
      <Stat label="CSV 字节" value={fmtInt(M.data.csvBytes)} accent={C.violet} style={{ height: 150 }}
        sub={<span>ts-admin 导出，四列宽表</span>} />
    </div>
  </>
);

const P3: React.FC = () => (
  <>
    <Head kicker="01 / 开场" title="四个数，先钉在墙上" goal="量纲、漂移、平稳、指数" />
    <div style={{ position: "absolute", left: PAD, top: 360, width: CW, display: "flex", gap: 22 }}>
      <Stat label="量纲 · 茅台 / 工行" value={fmtF(M.data.levelRatio, 1) + "×"} accent={C.cyan} style={{ flex: 1, height: 250 }}
        sub={<span>后复权均价之比</span>} />
      <Stat label="漂移 · MAE 末值 / 均值" value={fmtF(M.mae.drift.now, 2) + " / " + fmtF(M.mae.drift.mean, 2)} accent={C.amber} valueSize={32} style={{ flex: 1, height: 250 }}
        sub={<span>差 {fmtF(M.mae.drift.mean / M.mae.drift.now, 2)} 倍</span>} />
      <Stat label="无趋势 · MAE 末值 / 均值" value={fmtF(M.mae.flat.now, 2) + " / " + fmtF(M.mae.flat.mean, 2)} accent={C.violet} valueSize={32} style={{ flex: 1, height: 250 }}
        sub={<span>排序反过来，差 {fmtF(M.mae.flat.now / M.mae.flat.mean, 2)} 倍</span>} />
      <Stat label="上证指数 · 末值 / RevIN / 均值" value={fmtF(M.mae.index.now, 1) + " / " + fmtF(M.mae.index.revin, 1)} accent={C.coral} valueSize={28} style={{ flex: 1, height: 250 }}
        sub={<span>均值 {fmtF(M.mae.index.mean, 1)} · 二十四步</span>} />
    </div>
    <div style={{ position: "absolute", left: PAD, top: 690, width: CW }}>
      <Body size={FT.lead} color={C.ink}>
        第一组：量纲差六百五十八倍。第二组：有漂移时末值赢，去掉趋势均值赢。
      </Body>
      <Body size={FT.lead} color={C.ink} style={{ marginTop: 8 }}>
        第三组：真实指数上，末值依然最低。
      </Body>
    </div>
  </>
);

const P4: React.FC = () => (
  <>
    <Head kicker="01 / 开场" title="两句话，管整集" goal="基准是假设，不是预处理" />
    <div style={{ position: "absolute", left: PAD, top: 350, width: CW, display: "flex", gap: 26 }}>
      <Card label="第一句 · 减什么就是选不变量" accent={C.cyan} style={{ flex: 1, height: 300 }}>
        <Body size={FT.h2} color={C.ink}>减均值，模型对平移不变。</Body>
        <Body size={FT.h2} color={C.ink}>减末值，模型对水平位置不变。</Body>
        <Body size={FT.body} style={{ marginTop: 18 }}>
          三个方法不是三种预处理，是三种假设。假设对上数据，误差就低；对不上，同一骨干也能差一倍。
        </Body>
      </Card>
      <Card label="第二句 · 归一化是模型的一部分" accent={C.violet} style={{ flex: 1, height: 300 }}>
        <Body size={FT.h2} color={C.ink}>基准要从输入窗算，</Body>
        <Body size={FT.h2} color={C.ink}>反变换要用同一组统计量。</Body>
        <Body size={FT.body} style={{ marginTop: 18 }}>
          用输出段算基准就是泄漏；反变换重算就不是同一次变换。两条都写死在代码里。
        </Body>
      </Card>
    </div>
    <div style={{ position: "absolute", left: PAD, top: 720, width: CW }}>
      <Body size={FT.lead} color={C.ink}>
        所以：先问基准代表什么，再问误差降了多少。
      </Body>
      <div style={{ marginTop: 14 }}>
        <K color={C.amber}>输入比 {fmtF(M.norm.normScaleRatio, 3)} · 成交量只差 1.0% · 归一化不是万灵药</K>
      </div>
    </div>
  </>
);

export const SOpen: React.FC = () => (
  <Pages id="open" at={[0, 0.251, 0.458, 0.716]}>
    <P1 />
    <P2 />
    <P3 />
    <P4 />
  </Pages>
);
