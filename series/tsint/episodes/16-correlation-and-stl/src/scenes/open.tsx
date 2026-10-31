import React from "react";
import { C, FONT, FT } from "../../design/tokens";
import { Body, Card, Chip, CW, Formula, Head, K, LinePlot, M, PAD, Pages, Stat, fmtF, fmtInt } from "../shared";

const PATH_COLORS = [C.cyan, C.violet, C.amber, C.coral, C.inkDim, C.cyan, C.violet, C.amber, C.coral, C.inkDim, C.cyan, C.violet];

const P1: React.FC = () => (
  <>
    <Head kicker="第 2 章 / 数据层" title="相关性与 STL" goal="一个数说面板，一条分解说序列" />
    <div style={{ position: "absolute", left: PAD, top: 350, width: 860 }}>
      <Card label="式(2.4) · 面板相关读数" accent={C.cyan} style={{ height: 390 }}>
        <Formula size={44}>Corr = mean(p) + 1 / (1 + var(p))</Formula>
        <Body size={FT.body} style={{ marginTop: 22 }}>
          p 是所有变量对的皮尔逊相关系数。书里对这一项只写了一句话，
          没说缺失值、方差口径、常数序列、变量对怎么数。
        </Body>
        <div style={{ marginTop: 18 }}><Chip color={C.cyan}>一本书 · 一个数</Chip></div>
      </Card>
    </div>
    <div style={{ position: "absolute", left: PAD + 890, top: 350, width: CW - 890 }}>
      <Card label="分解 · 趋势 + 季节 + 残差" accent={C.violet} style={{ height: 390 }}>
        <Formula size={44} color={C.violet}>X = T + S + R</Formula>
        <Body size={FT.body} style={{ marginTop: 22 }}>
          LOESS-STL 与经典分解，两条独立的去趋势路径。
          书里没有 STL 的公式，只有 Cleveland 一九九零的原始定义。
        </Body>
        <div style={{ marginTop: 18 }}><Chip color={C.violet}>一条序列 · 三件</Chip></div>
      </Card>
    </div>
    <div style={{ position: "absolute", left: PAD, top: 800, width: CW }}>
      <Body size={FT.lead} color={C.ink}>
        一个数压住整张面板，一条分解量一条序列。这一集把这两件事各拆一遍。
      </Body>
    </div>
  </>
);

const P2: React.FC = () => (
  <>
    <Head kicker="01 / 开场" title="同一张面板，两种读法" goal="价格是趋势，收益是噪声" />
    <div style={{ position: "absolute", left: PAD, top: 336, width: 1080 }}>
      <LinePlot
        width={1080}
        height={500}
        legend={false}
        zeroLine={false}
        series={M.paths.series.map((s, i) => ({ values: s.price, color: PATH_COLORS[i], name: s.code }))}
        yFmt={(v) => v.toFixed(0)}
        title={"12 只票的收盘价 · 以首日为 100（每两日取一点）"}
      />
      <div style={{ display: "flex", gap: 18, marginTop: 8 }}>
        <K>12 条价格路径全部向上</K>
        <K color={C.cyan}>共同趋势：这一段面板的主成分</K>
      </div>
    </div>
    <div style={{ position: "absolute", left: PAD + 1120, top: 336, width: CW - 1120, display: "flex", flexDirection: "column", gap: 18 }}>
      <Stat label="面板规模" value={fmtInt(M.data.codes) + " × " + fmtInt(M.data.days)} accent={C.cyan} style={{ height: 148 }}
        sub={<span>{M.data.firstDate} → {M.data.lastDate}</span>} />
      <Stat label="变量对" value={fmtInt(M.pairs.total)} accent={C.violet} style={{ height: 148 }}
        sub={<span>上三角枚举，每对只算一次</span>} />
      <Stat label="CSV 字节" value={fmtInt(M.data.csvBytes)} accent={C.amber} style={{ height: 148 }}
        sub={<span>ts-admin 导出，与 E15 面板逐字节相同</span>} />
    </div>
  </>
);

const P3: React.FC = () => (
  <>
    <Head kicker="01 / 开场" title="四个数，先钉在墙上" goal="两组对照：读数与强度" />
    <div style={{ position: "absolute", left: PAD, top: 366, width: CW, display: "flex", gap: 24 }}>
      <Stat label="价格面板 · 读数" value={fmtF(M.readings.price.score, 4)} accent={C.cyan} style={{ flex: 1, height: 300 }}
        sub={<span>mean {fmtF(M.readings.price.mean, 4)} · var {fmtF(M.readings.price.var, 4)}</span>} />
      <Stat label="收益面板 · 读数" value={fmtF(M.readings.returns.score, 4)} accent={C.violet} style={{ flex: 1, height: 300 }}
        sub={<span>mean {fmtF(M.readings.returns.mean, 4)} · var {fmtF(M.readings.returns.var, 4)}</span>} />
      <Stat label="配对相关方差" value={fmtF(M.readings.price.var, 4) + " / " + fmtF(M.readings.returns.var, 4)} accent={C.amber} style={{ flex: 1, height: 300 }}
        sub={<span>差 9.6 倍，读数只差 0.15</span>} />
      <Stat label="茅台 · 季节强度" value={fmtF(M.maotaiStats.stl, 4) + " / " + fmtF(M.maotaiStats.classic, 4)} accent={C.coral} style={{ flex: 1, height: 300 }}
        sub={<span>STL / 经典分解，差 19 倍</span>} />
    </div>
    <div style={{ position: "absolute", left: PAD, top: 740, width: CW }}>
      <Body size={FT.lead} color={C.ink}>
        第一组：方差掉了一个量级，读数几乎不动。
      </Body>
      <Body size={FT.lead} color={C.ink} style={{ marginTop: 8 }}>
        第二组：剖面是同一个，强度差了一个量级。
      </Body>
    </div>
  </>
);

const P4: React.FC = () => (
  <>
    <Head kicker="01 / 开场" title="两句话，管整集" goal="读数与强度，各有各的毛病" />
    <div style={{ position: "absolute", left: PAD, top: 350, width: CW, display: "flex", gap: 26 }}>
      <Card label="读数 · 被饱和项压住" accent={C.cyan} style={{ flex: 1, height: 360 }}>
        <Body size={FT.h2} color={C.ink}>方差差 9.6 倍，</Body>
        <Body size={FT.h2} color={C.ink}>读数只差 0.15。</Body>
        <Body size={FT.body} style={{ marginTop: 18 }}>
          1/(1+var) 是饱和项：方差从 0.169 掉到 0.018，这一项只从 0.855 走到 0.983。
          均值和离散被压成一个数，权重还不对等。
        </Body>
      </Card>
      <Card label="强度 · 是相对量" accent={C.coral} style={{ flex: 1, height: 360 }}>
        <Body size={FT.h2} color={C.ink}>剖面几乎相同，</Body>
        <Body size={FT.h2} color={C.ink}>强度差 19 倍。</Body>
        <Body size={FT.body} style={{ marginTop: 18 }}>
          式(2.2) 的句式没变，分母里的残差换了定义：STL 是 LOESS 剩下的，经典分解是移动平均剩下的。
          同一个句子，两个分母。
        </Body>
      </Card>
    </div>
    <div style={{ position: "absolute", left: PAD, top: 790, width: CW }}>
      <Body size={FT.lead} color={C.ink}>
        所以：报读数要同时报方差，报强度要同时报方法。
      </Body>
    </div>
  </>
);

export const SOpen: React.FC = () => (
  <Pages id="open" at={[0, 0.3, 0.47, 0.72]}>
    <P1 />
    <P2 />
    <P3 />
    <P4 />
  </Pages>
);
