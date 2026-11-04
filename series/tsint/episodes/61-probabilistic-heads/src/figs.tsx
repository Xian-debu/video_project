import React from "react";
import { useCurrentFrame } from "remotion";
import { C, FONT, FT } from "../design/tokens";
import { M, fmt2, fmt3, fmt4, pct } from "./shared";

export const MiniLegend: React.FC<{ color: string; children: React.ReactNode; dash?: boolean }> = ({ color, children, dash }) => (
  <span style={{ display: "inline-flex", alignItems: "center", gap: 8, fontFamily: FONT.mono, fontSize: FT.meta, color: C.inkDim }}>
    <span style={{ width: 22, height: 0, borderTop: (dash ? "2px dashed " : "2px solid ") + color, display: "inline-block" }} />
    {children}
  </span>
);

/* ---------- 九条线各自训练：交叉示意 ---------- */

export const CrossingSchematic: React.FC<{ width?: number; height?: number; at?: number }> = ({ width = 960, height = 320, at = 0 }) => {
  const f = useCurrentFrame();
  const p = at > 0 ? pct(f, at, at + 26) : 1;
  const pw = 420;
  const ph = 210;
  const top = 46;
  const leftX = 40;
  const rightX = 520;
  const X = (i: number, ox: number) => ox + 18 + (i / 5) * (pw - 36);
  const Y = (v: number) => top + ph - ((v + 3.2) / 6.4) * ph;
  // 三条线（tau 0.1 / 0.5 / 0.9），横轴五个样本；左图故意让 0.1 与 0.9 在第二个样本交叉。
  const taus = [
    { tau: 0.1, color: C.cyan, vals: [-2.4, 1.9, -2.1, -1.7, -2.2] },
    { tau: 0.5, color: C.inkFaint, vals: [-0.4, 0.2, -0.6, -0.3, -0.2] },
    { tau: 0.9, color: C.violet, vals: [2.2, 1.2, 2.4, 2.0, 2.6] },
  ];
  const sorted = taus.map((r) => r.vals.map((_, i) => [0, 1, 2].map((k) => taus[k].vals[i]).sort((a, b) => a - b)[r.tau === 0.1 ? 0 : r.tau === 0.5 ? 1 : 2]));
  const line = (vals: number[], ox: number) => vals.map((v, i) => (i === 0 ? "M" : "L") + X(i, ox).toFixed(1) + " " + Y(v).toFixed(1)).join(" ");
  return (
    <div style={{ opacity: p }}>
      <svg width={width} height={height} style={{ overflow: "visible" }}>
        <text x={leftX} y={26} fontFamily={FONT.mono} fontSize={FT.meta} fill={C.coral}>独立训练：九条线各说各话</text>
        <rect x={leftX} y={top} width={pw} height={ph} rx={8} fill="rgba(21,30,43,0.55)" stroke={C.panelLine} />
        <line x1={leftX + 18} x2={leftX + pw - 18} y1={top + ph / 2} y2={top + ph / 2} stroke={C.panelLine} strokeDasharray="4 6" />
        {taus.map((r) => <path key={r.tau} d={line(r.vals, leftX)} fill="none" stroke={r.color} strokeWidth={2.2} />)}
        <circle cx={X(1, leftX)} cy={Y(1.9)} r={6} fill="none" stroke={C.coral} strokeWidth={2} />
        <text x={X(1, leftX) + 12} y={Y(1.9) + 5} fontFamily={FONT.mono} fontSize={FT.micro} fill={C.coral}>交叉</text>
        <text x={leftX} y={top + ph + 26} fontFamily={FONT.mono} fontSize={FT.micro} fill={C.inkFaint}>横轴：测试样本 · 纵轴：预测值</text>

        <text x={rightX} y={26} fontFamily={FONT.mono} fontSize={FT.meta} fill={C.cyan}>逐样本排序：次序被摆正</text>
        <rect x={rightX} y={top} width={pw} height={ph} rx={8} fill="rgba(21,30,43,0.55)" stroke={C.panelLine} />
        <line x1={rightX + 18} x2={rightX + pw - 18} y1={top + ph / 2} y2={top + ph / 2} stroke={C.panelLine} strokeDasharray="4 6" />
        {taus.map((r, k) => <path key={r.tau} d={line(sorted[k], rightX)} fill="none" stroke={r.color} strokeWidth={2.2} />)}
        <text x={rightX} y={top + ph + 26} fontFamily={FONT.mono} fontSize={FT.micro} fill={C.inkFaint}>同样九个值，只是换了顺序</text>

        <path d={"M" + (rightX - 46) + " " + (top + ph / 2) + " L" + (rightX - 16) + " " + (top + ph / 2)} stroke={C.inkFaint} strokeWidth={1.6} />
        <path d={"M" + (rightX - 22) + " " + (top + ph / 2 - 6) + " L" + (rightX - 14) + " " + (top + ph / 2) + " L" + (rightX - 22) + " " + (top + ph / 2 + 6)} fill="none" stroke={C.inkFaint} strokeWidth={1.6} />
        <text x={500} y={height - 6} fontFamily={FONT.mono} fontSize={FT.micro} fill={C.amber}>排序：零参数、零训练、只换位置</text>
      </svg>
    </div>
  );
};

/* ---------- pinball 损失形状 ---------- */

export const PinballShape: React.FC<{ width?: number; height?: number; at?: number }> = ({ width = 880, height = 260, at = 0 }) => {
  const f = useCurrentFrame();
  const p = at > 0 ? pct(f, at, at + 22) : 1;
  const ml = 60;
  const mr = 150;
  const mt = 16;
  const mb = 44;
  const X = (e: number) => ml + ((e + 2) / 4) * (width - ml - mr);
  const Y = (v: number) => height - mb - (v / 2) * (height - mt - mb);
  const seg = (tau: number, color: string, w: number) => {
    const l = (e: number) => (e < 0 ? (1 - tau) * -e : tau * e);
    return <path d={"M" + X(-2) + " " + Y(l(-2)) + " L" + X(0) + " " + Y(0) + " L" + X(2) + " " + Y(l(2))} fill="none" stroke={color} strokeWidth={w} />;
  };
  return (
    <div style={{ opacity: p }}>
      <svg width={width} height={height} style={{ overflow: "visible" }}>
        <line x1={ml} x2={width - mr} y1={Y(0)} y2={Y(0)} stroke={C.panelLine} />
        <line x1={X(0)} x2={X(0)} y1={mt} y2={height - mb} stroke={C.panelLine} strokeDasharray="4 6" />
        {seg(0.9, C.coral, 2.6)}
        {seg(0.1, C.cyan, 2.6)}
        {seg(0.5, C.inkFaint, 1.6)}
        <text x={X(0) + 6} y={mt + 14} fontFamily={FONT.mono} fontSize={FT.micro} fill={C.inkFaint}>q = y</text>
        <text x={width - mr + 8} y={Y(1.8) + 4} fontFamily={FONT.mono} fontSize={FT.meta} fill={C.coral}>tau = 0.9</text>
        <text x={width - mr + 8} y={Y(0.2) + 4} fontFamily={FONT.mono} fontSize={FT.meta} fill={C.cyan}>tau = 0.1</text>
        <text x={width - mr + 8} y={Y(0.5) + 18} fontFamily={FONT.mono} fontSize={FT.micro} fill={C.inkFaint}>tau = 0.5 对称</text>
        <text x={X(-2)} y={height - 18} fontFamily={FONT.mono} fontSize={FT.micro} fill={C.inkFaint}>低估（q 小于 y）</text>
        <text x={X(2)} y={height - 18} textAnchor="end" fontFamily={FONT.mono} fontSize={FT.micro} fill={C.inkFaint}>高估（q 大于 y）</text>
      </svg>
    </div>
  );
};

/* ---------- 重排：五个样本 × 九条线 ---------- */

export const RearrangeStrip: React.FC<{ width?: number; height?: number; at?: number }> = ({ width = 900, height = 300, at = 0 }) => {
  const f = useCurrentFrame();
  const p = at > 0 ? pct(f, at, at + 26) : 1;
  const cols = 5;
  const rows = 6;
  // 前 6 条线（tau 0.1…0.6），第 2 个样本故意交叉
  const before = [
    [-2.4, 1.9, -2.1, -1.7, -2.2],
    [-1.9, 1.2, -1.6, -1.2, -1.7],
    [-1.2, 0.6, -1.0, -0.7, -1.0],
    [-0.6, 0.1, -0.5, -0.3, -0.4],
    [0.1, -0.3, 0.2, 0.1, 0.3],
    [0.8, -0.9, 0.9, 0.7, 1.0],
  ];
  const sortedCols = before[0].map((_, ci) => before.map((r) => r[ci]).sort((a, b) => a - b));
  const cw = 74;
  const ch = 28;
  const gx = (c: number, ox: number) => ox + c * cw;
  const gy = (r: number) => 56 + r * ch;
  const cell = (x: number, y: number, v: number, bad: boolean, ox: number) => (
    <g key={x + "-" + y}>
      <rect x={x} y={y} width={cw - 6} height={ch - 6} rx={3} fill={bad ? "rgba(251,113,133,0.22)" : "rgba(94,234,212,0.14)"} stroke={bad ? C.coral : "rgba(94,234,212,0.4)"} />
      <text x={x + (cw - 6) / 2} y={y + 16} textAnchor="middle" fontFamily={FONT.mono} fontSize={FT.micro} fill={bad ? C.coral : C.inkDim}>{fmt2(v, 1)}</text>
    </g>
  );
  return (
    <div style={{ opacity: p }}>
      <svg width={width} height={height} style={{ overflow: "visible" }}>
        <text x={0} y={24} fontFamily={FONT.mono} fontSize={FT.meta} fill={C.coral}>排序前：样本 2 的次序翻了</text>
        {before.map((r, ri) => r.map((v, ci) => cell(gx(ci, 8), gy(ri), v, ci === 1, 8)))}
        <text x={0} y={gy(rows) + 26} fontFamily={FONT.mono} fontSize={FT.micro} fill={C.inkFaint}>行 = 分位线 tau，列 = 样本</text>

        <text x={452} y={24} fontFamily={FONT.mono} fontSize={FT.meta} fill={C.cyan}>排序后：每个样本内部升序</text>
        {before.map((_, ri) => before[0].map((_, ci) => cell(gx(ci, 460), gy(ri), sortedCols[ci][ri], false, 460)))}
        <text x={452} y={gy(rows) + 26} fontFamily={FONT.mono} fontSize={FT.micro} fill={C.inkFaint}>九个值一个不少，只换了位置</text>

        <path d={"M" + 386 + " 130 L" + 426 + " 130"} stroke={C.amber} strokeWidth={1.8} />
        <path d={"M" + 418 + " 122 L" + 428 + " 130 L" + 418 + " 138"} fill="none" stroke={C.amber} strokeWidth={1.8} />
        <text x={452} y={height - 4} fontFamily={FONT.mono} fontSize={FT.micro} fill={C.inkFaint}>每列一个样本，逐列 sort</text>
      </svg>
    </div>
  );
};

/* ---------- 交叉率：881 / 26,208 → 0 ---------- */

export const CrossingBars: React.FC<{ width?: number; height?: number; at?: number }> = ({ width = 900, height = 240, at = 0 }) => {
  const f = useCurrentFrame();
  const p = at > 0 ? pct(f, at, at + 24) : 1;
  const max = 900;
  const rowH = 78;
  const rows = [
    { label: "独立训练 · 排序前", value: M.crossing.pairs, color: C.coral, text: M.crossing.pairs + " 对", sub: (M.crossing.rate * 100).toFixed(4) + "%" },
    { label: "逐样本排序后", value: M.crossing.pairsAfter, color: C.cyan, text: "0 对", sub: "0.0000%" },
  ];
  const bw = width - 430;
  return (
    <div style={{ opacity: p, width }}>
      {rows.map((r) => (
        <div key={r.label} style={{ display: "flex", alignItems: "center", height: rowH }}>
          <div style={{ width: 250, fontFamily: FONT.mono, fontSize: FT.meta, color: C.inkDim }}>{r.label}</div>
          <div style={{ width: bw, height: 22, background: C.panelLine, borderRadius: 4 }}>
            <div style={{ height: 22, borderRadius: 4, background: r.color, opacity: 0.9, width: Math.max(2, (Math.max(8, r.value) / max) * bw) }} />
          </div>
          <div style={{ marginLeft: 16, width: 150, flexShrink: 0, whiteSpace: "nowrap", fontFamily: FONT.mono, fontSize: FT.lead, color: r.color }}>{r.text}</div>
        </div>
      ))}
      <div style={{ fontFamily: FONT.mono, fontSize: FT.micro, color: C.inkFaint }}>
        分母 = {M.crossing.pairTotal.toLocaleString("en-US")} 对（36 × {M.crossing.samples} 样本）
      </div>
    </div>
  );
};

/* ---------- 损失代价 ---------- */

export const LossDelta: React.FC<{ width?: number; height?: number; at?: number }> = ({ width = 900, height = 230, at = 0 }) => {
  const f = useCurrentFrame();
  const p = at > 0 ? pct(f, at, at + 22) : 1;
  const lo = 0.7;
  const hi = 0.74;
  const rows = [
    { label: "排序前 pinball", value: M.pinball.before, color: C.coral, text: fmt4(M.pinball.before, 6) },
    { label: "排序后 pinball", value: M.pinball.after, color: C.cyan, text: fmt4(M.pinball.after, 6) },
  ];
  const bw = width - 460;
  const wOf = (v: number) => Math.max(10, ((v - lo) / (hi - lo)) * bw);
  return (
    <div style={{ opacity: p, width }}>
      {rows.map((r) => (
        <div key={r.label} style={{ display: "flex", alignItems: "center", height: 66 }}>
          <div style={{ width: 250, fontFamily: FONT.mono, fontSize: FT.meta, color: C.inkDim }}>{r.label}</div>
          <div style={{ width: bw, height: 20, background: C.panelLine, borderRadius: 4 }}>
            <div style={{ height: 20, borderRadius: 4, background: r.color, opacity: 0.9, width: wOf(r.value) }} />
          </div>
          <div style={{ marginLeft: 16, width: 180, flexShrink: 0, whiteSpace: "nowrap", fontFamily: FONT.mono, fontSize: FT.lead, color: r.color }}>{r.text}</div>
        </div>
      ))}
      <div style={{ fontFamily: FONT.mono, fontSize: FT.meta, color: C.amber }}>
        相对变化 {(M.pinball.relDelta * 100).toFixed(4)}%　·　容差 2%　·　略降不是精度提升
      </div>
    </div>
  );
};

/* ---------- 尾部曲线：经验分位 vs 高斯分位 ---------- */

export const QuantileTails: React.FC<{ width?: number; height?: number; at?: number; legend?: boolean }> = ({ width = 930, height = 330, at = 0, legend = true }) => {
  const f = useCurrentFrame();
  const p = at > 0 ? pct(f, at, at + 30) : 1;
  const ml = 66;
  const mr = 34;
  const mt = 22;
  const mb = 46;
  const lo = -7;
  const hi = 7;
  const X = (tau: number) => ml + tau * (width - ml - mr);
  const Y = (v: number) => height - mb - ((v - lo) / (hi - lo)) * (height - mt - mb);
  const path = (key: "empirical" | "gaussian") =>
    M.tailsCurve.map((d, i) => (i === 0 ? "M" : "L") + X(d.tau).toFixed(1) + " " + Y(d[key]).toFixed(1)).join(" ");
  const near = (tau: number) => M.tailsCurve.reduce((a, b) => (Math.abs(b.tau - tau) < Math.abs(a.tau - tau) ? b : a));
  const q05 = near(0.05);
  const q95 = near(0.95);
  return (
    <div style={{ opacity: p }}>
      <svg width={width} height={height} style={{ overflow: "visible" }}>
        {[-6, -4, -2, 0, 2, 4, 6].map((t) => (
          <g key={t}>
            <line x1={ml} x2={width - mr} y1={Y(t)} y2={Y(t)} stroke={C.panelLine} strokeWidth={1} strokeDasharray="4 6" opacity={t === 0 ? 1 : 0.6} />
            <text x={ml - 10} y={Y(t) + 5} textAnchor="end" fontFamily={FONT.mono} fontSize={FT.micro} fill={C.inkFaint}>{t}</text>
          </g>
        ))}
        <path d={path("gaussian")} fill="none" stroke={C.violet} strokeWidth={2.2} strokeDasharray="7 6" />
        <path d={path("empirical")} fill="none" stroke={C.cyan} strokeWidth={2.6} />
        {[
          { d: q05, label: "5%", left: true },
          { d: q95, label: "95%", left: false },
        ].map(({ d, label, left }) => (
          <g key={label}>
            <circle cx={X(d.tau)} cy={Y(d.empirical)} r={5} fill={C.cyan} />
            <circle cx={X(d.tau)} cy={Y(d.gaussian)} r={5} fill={C.violet} />
            <line x1={X(d.tau)} x2={X(d.tau)} y1={Y(d.empirical)} y2={Y(d.gaussian)} stroke={C.inkFaint} strokeWidth={1} />
            {left ? (
              <g>
                <text x={X(d.tau) + 14} y={Y(d.empirical) + 20} fontFamily={FONT.mono} fontSize={FT.meta} fill={C.cyan}>{fmt2(d.empirical)}</text>
                <text x={X(d.tau) + 14} y={Y(d.gaussian) - 10} fontFamily={FONT.mono} fontSize={FT.meta} fill={C.violet}>{fmt2(d.gaussian)}</text>
              </g>
            ) : (
              <text x={X(d.tau) - 6} y={mt + 26} textAnchor="end" fontFamily={FONT.mono} fontSize={FT.micro} fill={C.inkFaint}>{fmt2(d.empirical)} / {fmt2(d.gaussian)}</text>
            )}
            <text x={X(d.tau)} y={mt - 4} textAnchor="middle" fontFamily={FONT.mono} fontSize={FT.micro} fill={C.inkFaint}>{label}</text>
          </g>
        ))}
        {[0.01, 0.25, 0.5, 0.75, 0.99].map((t) => (
          <text key={t} x={X(t)} y={height - mb + 24} textAnchor="middle" fontFamily={FONT.mono} fontSize={FT.micro} fill={C.inkFaint}>{t.toFixed(2)}</text>
        ))}
        <line x1={ml} x2={width - mr} y1={height - mb} y2={height - mb} stroke={C.panelLine} />
        <line x1={ml} x2={ml} y1={mt} y2={height - mb} stroke={C.panelLine} />
        <text x={ml} y={height - 6} fontFamily={FONT.mono} fontSize={FT.micro} fill={C.inkFaint}>横轴：分位 tau · 纵轴：日收益 %</text>
      </svg>
      {legend ? (
        <div style={{ display: "flex", gap: 26, marginTop: 2 }}>
          <MiniLegend color={C.cyan}>经验分位 · 500 天</MiniLegend>
          <MiniLegend color={C.violet} dash>高斯分位 · mu / sigma 拟合</MiniLegend>
        </div>
      ) : null}
    </div>
  );
};

/* ---------- 覆盖率 ---------- */

export const CoverageBars: React.FC<{ width?: number; height?: number; at?: number }> = ({ width = 880, height = 230, at = 0 }) => {
  const f = useCurrentFrame();
  const p = at > 0 ? pct(f, at, at + 22) : 1;
  const rows = [
    { label: "名义 95% 区间", value: M.dist.coverageTarget, color: C.inkFaint, text: "0.9500", dim: true },
    { label: "实测覆盖（500 天）", value: M.dist.coverage, color: C.coral, text: fmt4(M.dist.coverage), dim: false },
  ];
  const bw = width - 400;
  return (
    <div style={{ opacity: p, width }}>
      {rows.map((r) => (
        <div key={r.label} style={{ display: "flex", alignItems: "center", height: 62 }}>
          <div style={{ width: 236, fontFamily: FONT.mono, fontSize: FT.meta, color: C.inkDim }}>{r.label}</div>
          <div style={{ width: bw, height: 20, background: C.panelLine, borderRadius: 4, position: "relative" }}>
            <div style={{ height: 20, borderRadius: 4, background: r.color, opacity: r.dim ? 0.4 : 0.9, width: (r.value / 1) * bw }} />
            <div style={{ position: "absolute", left: bw, top: -6, width: 2, height: 32, background: C.inkFaint }} />
          </div>
          <div style={{ marginLeft: 16, width: 130, flexShrink: 0, whiteSpace: "nowrap", fontFamily: FONT.mono, fontSize: FT.lead, color: r.color }}>{r.text}</div>
        </div>
      ))}
      <div style={{ fontFamily: FONT.mono, fontSize: FT.micro, color: C.inkFaint }}>
        区间 ±{fmt2(M.dist.z95)} sigma = ±{fmt2(M.dist.z95 * M.dist.sigma)}%；500 天里 38 天在区间外（15 低 / 23 高）
      </div>
    </div>
  );
};

/* ---------- 模块行数 ---------- */

export const ModuleLines: React.FC<{ width?: number; height?: number; at?: number }> = ({ width = 860, height = 210, at = 0 }) => {
  const f = useCurrentFrame();
  const p = at > 0 ? pct(f, at, at + 22) : 1;
  const rows = [
    { label: "Pinball.hs", value: M.code.pinballLines, color: C.cyan, note: "损失 · 经验分位 · 交叉计数" },
    { label: "QuantileRearrange.hs", value: M.code.rearrangeLines, color: C.violet, note: "排序回填 · 单调检查" },
    { label: "DistHead.hs", value: M.code.distLines, color: C.amber, note: "NLL · 梯度 · 分位数 · 覆盖率" },
  ];
  const max = 130;
  const bw = width - 470;
  return (
    <div style={{ opacity: p, width }}>
      {rows.map((r) => (
        <div key={r.label} style={{ display: "flex", alignItems: "center", height: 54 }}>
          <div style={{ width: 230, fontFamily: FONT.mono, fontSize: FT.meta, color: C.inkDim }}>{r.label}</div>
          <div style={{ width: bw, height: 16, background: C.panelLine, borderRadius: 4 }}>
            <div style={{ height: 16, borderRadius: 4, background: r.color, opacity: 0.9, width: (r.value / max) * bw }} />
          </div>
          <div style={{ marginLeft: 16, width: 90, flexShrink: 0, whiteSpace: "nowrap", fontFamily: FONT.mono, fontSize: FT.lead, color: r.color }}>{r.value}</div>
          <div style={{ marginLeft: 8, fontFamily: FONT.sans, fontSize: FT.micro, color: C.inkFaint }}>{r.note}</div>
        </div>
      ))}
      <div style={{ fontFamily: FONT.mono, fontSize: FT.micro, color: C.inkFaint, marginTop: 4 }}>合计 {M.code.totalLines} 行 · 测试 {M.code.tests} 条 · 证据程序 {M.code.evidenceLines} 行</div>
    </div>
  );
};

/* ---------- 数据切分 ---------- */

export const DataSplit: React.FC<{ width?: number; height?: number; at?: number }> = ({ width = 980, height = 250, at = 0 }) => {
  const f = useCurrentFrame();
  const p = at > 0 ? pct(f, at, at + 26) : 1;
  const D = M.data;
  const barH = 34;
  const seriesW = width - 120;
  const trainW = (D.trainRows / D.returnsRows) * seriesW;
  const testW = (D.testRows / D.returnsRows) * seriesW;
  const coverW = (D.coverageRows / D.returnsRows) * seriesW;
  return (
    <div style={{ opacity: p }}>
      <svg width={width} height={height}>
        <text x={0} y={22} fontFamily={FONT.mono} fontSize={FT.meta} fill={C.inkDim}>全集 {D.returnsRows.toLocaleString("en-US")} 行 · {D.firstDate} → {D.lastDate}</text>
        <rect x={10} y={44} width={seriesW} height={barH} rx={5} fill="rgba(21,30,43,0.9)" stroke={C.panelLine} />
        <rect x={10} y={44} width={trainW} height={barH} rx={5} fill="rgba(94,234,212,0.26)" stroke={C.cyan} />
        <rect x={10 + seriesW - trainW - testW} y={44} width={testW} height={barH} rx={5} fill="rgba(251,113,133,0.26)" stroke={C.coral} />
        <text x={16} y={68} fontFamily={FONT.mono} fontSize={FT.micro} fill={C.ink}>训练池 {D.trainRows.toLocaleString("en-US")}</text>
        <text x={10 + seriesW - trainW - testW + 8} y={68} fontFamily={FONT.mono} fontSize={FT.micro} fill={C.ink}>测试 {D.testRows}</text>

        <text x={0} y={124} fontFamily={FONT.mono} fontSize={FT.meta} fill={C.inkDim}>少样本拟合：训练池里取 {D.fitRows} 个</text>
        <rect x={10} y={144} width={trainW} height={26} rx={4} fill="rgba(94,234,212,0.14)" stroke="rgba(94,234,212,0.5)" />
        <rect x={10} y={144} width={trainW * (D.fitRows / D.trainRows)} height={26} rx={4} fill="rgba(167,139,250,0.35)" stroke={C.violet} />
        <text x={16} y={163} fontFamily={FONT.mono} fontSize={FT.micro} fill={C.ink}>{D.fitRows}</text>

        <text x={0} y={212} fontFamily={FONT.mono} fontSize={FT.meta} fill={C.inkDim}>覆盖率窗口：测试段最后 {D.coverageRows} 天 · {D.coverageStart} → {D.coverageEnd}</text>
        <rect x={10} y={224} width={coverW} height={20} rx={4} fill="rgba(251,191,36,0.30)" stroke={C.amber} />
        <text x={coverW + 24} y={239} fontFamily={FONT.mono} fontSize={FT.micro} fill={C.amber}>{D.coverageRows} 天</text>
      </svg>
    </div>
  );
};

/* ---------- 九条线的次序（示意小图） ---------- */

export const TauOrderStrip: React.FC<{ width?: number; height?: number; at?: number }> = ({ width = 800, height = 170, at = 0 }) => {
  const f = useCurrentFrame();
  const p = at > 0 ? pct(f, at, at + 20) : 1;
  const cw = 62;
  const vals = [-1.9, -1.2, -0.6, 0.1, 0.8, 1.5, 2.1, 2.6, 3.0];
  return (
    <div style={{ opacity: p }}>
      <svg width={width} height={height}>
        {vals.map((v, i) => (
          <g key={i}>
            <rect x={i * cw} y={26} width={cw - 6} height={40} rx={4} fill="rgba(94,234,212,0.14)" stroke="rgba(94,234,212,0.45)" />
            <text x={i * cw + (cw - 6) / 2} y={52} textAnchor="middle" fontFamily={FONT.mono} fontSize={FT.micro} fill={C.inkDim}>{v.toFixed(1)}</text>
            <text x={i * cw + (cw - 6) / 2} y={18} textAnchor="middle" fontFamily={FONT.mono} fontSize={FT.micro} fill={C.inkFaint}>{"t" + (i + 1)}</text>
          </g>
        ))}
        <text x={0} y={98} fontFamily={FONT.mono} fontSize={FT.micro} fill={C.inkFaint}>tau 从 0.1 到 0.9，值必须单调不减</text>
        <text x={0} y={130} fontFamily={FONT.mono} fontSize={FT.meta} fill={C.cyan}>排序后天然满足，不需要训练时加约束</text>
      </svg>
    </div>
  );
};