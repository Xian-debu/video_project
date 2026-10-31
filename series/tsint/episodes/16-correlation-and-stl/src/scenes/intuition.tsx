import React from "react";
import { C, FONT, FT } from "../../design/tokens";
import { Body, Card, Chip, CW, Head, K, LinePlot, M, PAD, Pages, Stat, fmtF, fmtInt } from "../shared";

const Hist: React.FC<{ title: string; counts: number[]; color: string; width: number; height: number }> = ({ title, counts, color, width, height }) => {
  const padL = 54, padB = 46, padT = 30, padR = 16;
  const max = Math.max(...counts);
  const bw = (width - padL - padR) / counts.length;
  const hiA = counts[14] ?? 0, hiB = counts[15] ?? 0;
  return (
    <svg width={width} height={height} style={{ display: "block" }}>
      <text x={0} y={14} fill={C.inkFaint} fontFamily={FONT.mono} fontSize={FT.micro}>{title}</text>
      {counts.map((v, i) => {
        const h = ((v / max) * (height - padT - padB));
        const isHi = i >= 14;
        return (
          <rect key={i} x={padL + i * bw + 1.5} y={height - padB - h} width={bw - 3} height={Math.max(1, h)}
            fill={isHi ? C.coral : color} opacity={isHi ? 0.95 : 0.8} />
        );
      })}
      <line x1={padL} y1={height - padB} x2={width - padR} y2={height - padB} stroke={C.panelLine} />
      {[-0.6, -0.3, 0, 0.3, 0.6, 0.9].map((v) => {
        const i = (v + 0.6) / 0.1;
        return <text key={v} x={padL + i * bw} y={height - padB + 20} textAnchor="middle" fill={C.inkFaint} fontFamily={FONT.mono} fontSize={FT.micro}>{v.toFixed(1)}</text>;
      })}
      <text x={width - padR} y={height - padB + 40} textAnchor="end" fill={C.coral} fontFamily={FONT.mono} fontSize={FT.micro}>
        {"p > 0.8：" + fmtInt(hiA + hiB) + " 对"}
      </text>
    </svg>
  );
};

const P1: React.FC = () => (
  <>
    <Head kicker="04 / 直觉" title="离散度藏在分布里" goal="同一个面板，两种相关分布" />
    <div style={{ position: "absolute", left: PAD, top: 330, width: 900 }}>
      <Hist title="收盘价 · 4950 对皮尔逊相关" counts={M.hist.price} color={C.cyan} width={880} height={430} />
    </div>
    <div style={{ position: "absolute", left: PAD + 930, top: 330, width: 900 }}>
      <Hist title="log 收益 · 4950 对皮尔逊相关" counts={M.hist.returns} color={C.violet} width={880} height={430} />
    </div>
    <div style={{ position: "absolute", left: PAD, top: 800, width: CW }}>
      <Body size={FT.lead} color={C.ink}>
        价格的相关几乎全在 0.4 以上：共同趋势。收益的相关挤在 0.2 附近：去掉趋势后互不相关。
      </Body>
      <div style={{ display: "flex", gap: 26, marginTop: 14 }}>
        <K color={C.coral}>负相关 1533 / 113 对</K>
        <K>均值 0.2132 / 0.2361</K>
        <K color={C.amber}>方差 0.1693 / 0.0177</K>
      </div>
    </div>
  </>
);

const StackBar: React.FC<{ label: string; mean: number; sat: number; total: number; color: string }> = ({ label, mean, sat, total, color }) => {
  const W = 1420;
  const sc = W / 1.3;
  return (
    <div style={{ marginTop: 26 }}>
      <div style={{ display: "flex", alignItems: "baseline", gap: 18 }}>
        <div style={{ width: 190, fontFamily: FONT.sans, fontSize: FT.body, color }}>{label}</div>
        <div style={{ position: "relative", width: W, height: 46, background: C.panelLine, borderRadius: 8 }}>
          <div style={{ position: "absolute", left: 0, top: 0, height: 46, width: mean * sc, background: color, opacity: 0.9, borderRadius: "8px 0 0 8px" }} />
          <div style={{ position: "absolute", left: mean * sc, top: 0, height: 46, width: sat * sc, background: C.amber, opacity: 0.55, borderRadius: "0 8px 8px 0" }} />
        </div>
        <div style={{ fontFamily: FONT.mono, fontSize: FT.body, color: C.ink }}>{fmtF(total, 4)}</div>
      </div>
      <div style={{ display: "flex", gap: 22, marginLeft: 208, marginTop: 6 }}>
        <K color={color}>mean {fmtF(mean, 4)}</K>
        <K color={C.amber}>1/(1+var) {fmtF(sat, 4)}</K>
      </div>
    </div>
  );
};

const P2: React.FC = () => (
  <>
    <Head kicker="04 / 直觉" title="读数是一根被压住的条" goal="第一项能分辨，第二项不能" />
    <div style={{ position: "absolute", left: PAD, top: 330, width: CW }}>
      <StackBar label="价格面板" mean={M.readings.price.mean} sat={1 / (1 + M.readings.price.var)} total={M.readings.price.score} color={C.cyan} />
      <StackBar label="收益面板" mean={M.readings.returns.mean} sat={1 / (1 + M.readings.returns.var)} total={M.readings.returns.score} color={C.violet} />
    </div>
    <div style={{ position: "absolute", left: PAD, top: 620, width: CW }}>
      <Card label="两根条差在哪" accent={C.amber} style={{ height: 230 }}>
        <Body size={FT.body} color={C.ink}>
          蓝色部分差 0.023，是有分辨力的一段。琥珀部分差 0.128，但它是被方差推到边界的：
          不管数据多嘈杂，这一项都贴着 1。
        </Body>
        <Body size={FT.body} color={C.inkDim} style={{ marginTop: 12 }}>
          条的总长 1.0684 vs 1.2188 —— 0.15 的差距，全部来自两个被压住的分量互相抵消。
        </Body>
      </Card>
    </div>
    <div style={{ position: "absolute", left: PAD, top: 890, width: CW }}>
      <K>横轴 0 → 1.3</K>
    </div>
  </>
);

const P3: React.FC = () => (
  <>
    <Head kicker="04 / 直觉" title="同一条剖面，两种强度" goal="剖面差 0.166 元，强度差 19 倍" />
    <div style={{ position: "absolute", left: PAD, top: 336, width: 1000 }}>
      <LinePlot
        width={1000}
        height={430}
        legend
        zeroLine
        series={[
          { values: M.profiles.stl, color: C.cyan, name: "STL 季节项" },
          { values: M.profiles.classic, color: C.coral, name: "经典分解季节项", dash: true },
        ]}
        yFmt={(v) => v.toFixed(1)}
        title="茅台 · 五个相位的平均季节效应（元）"
      />
      <div style={{ marginTop: 10 }}><K>相位 1 → 5，周期 5</K></div>
    </div>
    <div style={{ position: "absolute", left: PAD + 1040, top: 336, width: CW - 1040, display: "flex", flexDirection: "column", gap: 18 }}>
      <Stat label="STL 季节强度" value={fmtF(M.maotaiStats.stl, 4)} accent={C.cyan} style={{ height: 150 }}
        sub={<span>残差是 LOESS 剩下的</span>} />
      <Stat label="经典分解强度" value={fmtF(M.maotaiStats.classic, 4)} accent={C.coral} style={{ height: 150 }}
        sub={<span>残差是移动平均剩下的</span>} />
      <Card label="比值" accent={C.amber} style={{ height: 150 }} pad={20}>
        <div style={{ fontFamily: FONT.mono, fontSize: FT.num, color: C.ink }}>19.2 ×</div>
        <div style={{ fontFamily: FONT.sans, fontSize: FT.meta, color: C.inkFaint, marginTop: 8 }}>剖面最大差 {fmtF(M.maotaiStats.gap, 3)} 元，占均价 {fmtF(M.maotaiStats.ampPct, 4)}%</div>
      </Card>
    </div>
    <div style={{ position: "absolute", left: PAD, top: 820, width: CW }}>
      <Body size={FT.lead} color={C.ink}>
        两条曲线贴在一起，强度却差十九倍。强度量的不是季节有多大，是残差有多小。
      </Body>
    </div>
  </>
);

export const SIntuition: React.FC = () => (
  <Pages id="intuition" at={[0, 0.45, 0.72]}>
    <P1 />
    <P2 />
    <P3 />
  </Pages>
);
