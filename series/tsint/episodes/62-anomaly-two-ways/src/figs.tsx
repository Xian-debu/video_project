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

const poly = (vals: number[], x: (i: number) => number, y: (v: number) => number) =>
  vals.map((v, i) => (i === 0 ? "M" : "L") + x(i).toFixed(1) + " " + y(v).toFixed(1)).join(" ");

/* ---------- 开场：两种错法并排 ---------- */

export const SpikeDriftIntro: React.FC<{ width?: number; height?: number; at?: number }> = ({ width = 960, height = 250, at = 0 }) => {
  const f = useCurrentFrame();
  const p = at > 0 ? pct(f, at, at + 26) : 1;
  const pw = 430;
  const ph = 170;
  const top = 40;
  const gap = 44;
  const left = 8;
  const panel = (ox: number, vals: number[], lo: number, hi: number, color: string, title: string, note: string) => {
    const X = (i: number) => ox + 14 + (i / Math.max(1, vals.length - 1)) * (pw - 28);
    const Y = (v: number) => top + ph - ((v - lo) / (hi - lo)) * ph;
    return (
      <g key={title}>
        <text x={ox} y={24} fontFamily={FONT.mono} fontSize={FT.meta} fill={color}>{title}</text>
        <rect x={ox} y={top} width={pw} height={ph} rx={8} fill="rgba(21,30,43,0.55)" stroke={C.panelLine} />
        <line x1={ox + 8} x2={ox + pw - 8} y1={Y(0)} y2={Y(0)} stroke={C.panelLine} strokeDasharray="4 6" />
        <path d={poly(vals, X, Y)} fill="none" stroke={color} strokeWidth={2} />
        <text x={ox} y={top + ph + 24} fontFamily={FONT.mono} fontSize={FT.micro} fill={C.inkFaint}>{note}</text>
      </g>
    );
  };
  const sx = M.series.spikeZ.slice(180, 220);
  const dx = M.series.driftZ.slice(105, 190);
  return (
    <div style={{ opacity: p }}>
      <svg width={width} height={height} style={{ overflow: "visible" }}>
        {panel(left, sx, -9.5, 8.5, C.coral, "尖峰：一天 −6σ", "横轴 40 天 · 纵轴 z 分数")}
        {panel(left + pw + gap, dx, -3.2, 5.2, C.cyan, "漂移：六十天抬高 2σ", "横轴 85 天 · 虚线是训练均值")}
        <text x={left + pw + gap + 8} y={top + 30} fontFamily={FONT.mono} fontSize={FT.micro} fill={C.amber}>20 天爬 · 20 天平 · 20 天落</text>
        <text x={left + 190} y={top + 30} fontFamily={FONT.mono} fontSize={FT.micro} fill={C.amber}>第 200 天 · −6σ</text>
      </svg>
    </div>
  );
};

/* ---------- 尖峰放大：残差与形状 ---------- */

export const SpikeZoom: React.FC<{ width?: number; height?: number; at?: number }> = ({ width = 940, height = 300, at = 0 }) => {
  const f = useCurrentFrame();
  const p = at > 0 ? pct(f, at, at + 24) : 1;
  const vals = M.series.spikeZ.slice(185, 225);
  const ml = 54, mr = 20, mt = 22, mb = 40;
  const lo = -9, hi = 8.5;
  const X = (i: number) => ml + (i / (vals.length - 1)) * (width - ml - mr);
  const Y = (v: number) => height - mb - ((v - lo) / (hi - lo)) * (height - mt - mb);
  return (
    <div style={{ opacity: p }}>
      <svg width={width} height={height}>
        {[-8, -4, 0, 4, 8].map((t) => (
          <g key={t}>
            <line x1={ml} x2={width - mr} y1={Y(t)} y2={Y(t)} stroke={C.panelLine} strokeDasharray="4 6" opacity={t === 0 ? 0.9 : 0.5} />
            <text x={ml - 10} y={Y(t) + 5} textAnchor="end" fontFamily={FONT.mono} fontSize={FT.micro} fill={C.inkFaint}>{t}</text>
          </g>
        ))}
        <line x1={ml} x2={width - mr} y1={Y(2)} y2={Y(2)} stroke={C.violet} strokeDasharray="2 7" opacity={0.8} />
        <line x1={ml} x2={width - mr} y1={Y(-2)} y2={Y(-2)} stroke={C.violet} strokeDasharray="2 7" opacity={0.8} />
        <path d={poly(vals, X, Y)} fill="none" stroke={C.cyan} strokeWidth={2.6} />
        {vals.map((v, i) => (i === 15 ? <circle key={i} cx={X(i)} cy={Y(v)} r={7} fill={C.panel} stroke={C.coral} strokeWidth={2.4} /> : null))}
        <text x={X(15) + 14} y={Y(-6) - 4} fontFamily={FONT.mono} fontSize={FT.meta} fill={C.coral}>−6σ · 一天就回去</text>
        <text x={ml} y={height - 8} fontFamily={FONT.mono} fontSize={FT.micro} fill={C.inkFaint}>横轴：测试段第 185–225 天 · 纵轴：z 分数</text>
        <text x={width - mr} y={mt + 4} textAnchor="end" fontFamily={FONT.mono} fontSize={FT.micro} fill={C.violet}>虚线 ±2σ：正常波动带</text>
      </svg>
    </div>
  );
};

/* ---------- 漂移放大：梯形 ---------- */

export const DriftZoom: React.FC<{ width?: number; height?: number; at?: number }> = ({ width = 940, height = 300, at = 0 }) => {
  const f = useCurrentFrame();
  const p = at > 0 ? pct(f, at, at + 24) : 1;
  const vals = M.series.driftZ.slice(108, 192);
  const ml = 54, mr = 20, mt = 22, mb = 40;
  const lo = -3.4, hi = 5.4;
  const X = (i: number) => ml + (i / (vals.length - 1)) * (width - ml - mr);
  const Y = (v: number) => height - mb - ((v - lo) / (hi - lo)) * (height - mt - mb);
  return (
    <div style={{ opacity: p }}>
      <svg width={width} height={height}>
        <rect x={X(12)} y={mt} width={X(72) - X(12)} height={height - mt - mb} fill="rgba(94,234,212,0.07)" stroke="rgba(94,234,212,0.28)" strokeDasharray="4 6" />
        <text x={X(12) + 8} y={mt + 16} fontFamily={FONT.mono} fontSize={FT.micro} fill={C.cyan}>注入段：60 天</text>
        {[-2, 0, 2, 4].map((t) => (
          <g key={t}>
            <line x1={ml} x2={width - mr} y1={Y(t)} y2={Y(t)} stroke={C.panelLine} strokeDasharray="4 6" opacity={t === 0 ? 0.9 : 0.5} />
            <text x={ml - 10} y={Y(t) + 5} textAnchor="end" fontFamily={FONT.mono} fontSize={FT.micro} fill={C.inkFaint}>{t}</text>
          </g>
        ))}
        <path d={poly(vals, X, Y)} fill="none" stroke={C.cyan} strokeWidth={2.6} />
        <text x={X(42)} y={Y(4.6)} textAnchor="middle" fontFamily={FONT.mono} fontSize={FT.meta} fill={C.amber}>持平 2σ</text>
        <text x={ml} y={height - 8} fontFamily={FONT.mono} fontSize={FT.micro} fill={C.inkFaint}>横轴：测试段第 108–192 天 · 纵轴：z 分数</text>
        <text x={width - mr} y={mt + 4} textAnchor="end" fontFamily={FONT.mono} fontSize={FT.micro} fill={C.inkFaint}>每天的残差只有 2σ</text>
      </svg>
    </div>
  );
};

/* ---------- 两个窗口：正常 vs 漂移 ---------- */

export const WindowPair: React.FC<{ width?: number; height?: number; at?: number }> = ({ width = 940, height = 300, at = 0 }) => {
  const f = useCurrentFrame();
  const p = at > 0 ? pct(f, at, at + 24) : 1;
  const rows = [
    { label: "正常窗口", vals: M.windows.normal, color: C.cyan, note: "逐点有误差，但整段没有偏移" },
    { label: "漂移窗口", vals: M.windows.drift, color: C.coral, note: "后 30 个点进入漂移段" },
  ];
  const rowH = 112;
  const ml = 96, mr = 20, mt = 18;
  const lo = -3.4, hi = 5.2;
  const X = (i: number) => ml + (i / 31) * (width - ml - mr);
  const Y = (v: number, top: number) => top + rowH - 20 - ((v - lo) / (hi - lo)) * (rowH - 34);
  return (
    <div style={{ opacity: p }}>
      <svg width={width} height={height}>
        {rows.map((r, ri) => {
          const top = mt + ri * (rowH + 34);
          return (
            <g key={r.label}>
              <text x={0} y={top + 16} fontFamily={FONT.mono} fontSize={FT.meta} fill={r.color}>{r.label}</text>
              <line x1={ml} x2={width - mr} y1={Y(0, top)} y2={Y(0, top)} stroke={C.panelLine} strokeDasharray="4 6" />
              <path d={poly(r.vals, X, (v) => Y(v, top))} fill="none" stroke={r.color} strokeWidth={2.4} />
              <text x={width - mr} y={top + 16} textAnchor="end" fontFamily={FONT.mono} fontSize={FT.micro} fill={C.inkFaint}>{r.note}</text>
            </g>
          );
        })}
        <text x={ml} y={height - 6} fontFamily={FONT.mono} fontSize={FT.micro} fill={C.inkFaint}>每个窗口 32 个点 · 纵轴 z 分数 · 同一把编码器</text>
      </svg>
    </div>
  );
};

/* ---------- 因果窗口示意 ---------- */

export const CausalWindow: React.FC<{ width?: number; height?: number; at?: number }> = ({ width = 930, height = 210, at = 0 }) => {
  const f = useCurrentFrame();
  const p = at > 0 ? pct(f, at, at + 24) : 1;
  const vals = M.series.test.slice(40, 104);
  const ml = 30, mr = 30, mt = 26, mb = 42;
  const lo = -3.2, hi = 3.6;
  const X = (i: number) => ml + (i / (vals.length - 1)) * (width - ml - mr);
  const Y = (v: number) => height - mb - ((v - lo) / (hi - lo)) * (height - mt - mb);
  const from = 31, to = 63;
  return (
    <div style={{ opacity: p }}>
      <svg width={width} height={height}>
        <rect x={X(from)} y={mt} width={X(to) - X(from)} height={height - mt - mb} rx={4} fill="rgba(94,234,212,0.10)" stroke={C.cyan} strokeDasharray="4 6" />
        <path d={poly(vals, X, Y)} fill="none" stroke={C.inkDim} strokeWidth={1.8} />
        {vals.map((v, i) => (i >= from && i <= to ? <circle key={i} cx={X(i)} cy={Y(v)} r={2.6} fill={C.cyan} /> : null))}
        <circle cx={X(to + 1)} cy={Y(vals[to + 1] ?? 0)} r={7} fill={C.panel} stroke={C.coral} strokeWidth={2.2} />
        <text x={X(to + 1) + 14} y={Y(vals[to + 1] ?? 0) + 5} fontFamily={FONT.mono} fontSize={FT.meta} fill={C.coral}>当前点：要判定</text>
        <text x={(X(from) + X(to)) / 2} y={mt - 8} textAnchor="middle" fontFamily={FONT.mono} fontSize={FT.micro} fill={C.cyan}>过去 32 个点 · 特征</text>
        <text x={ml} y={height - 10} fontFamily={FONT.mono} fontSize={FT.micro} fill={C.inkFaint}>窗口右端对齐当前点，左端往前数 32 天 · 不看未来</text>
      </svg>
    </div>
  );
};

/* ---------- F1 四格 ---------- */

export const F1Quad: React.FC<{ width?: number; height?: number; at?: number }> = ({ width = 940, height = 330, at = 0 }) => {
  const f = useCurrentFrame();
  const p = at > 0 ? pct(f, at, at + 26) : 1;
  const cells = [
    { row: "尖峰", col: "预测残差", v: M.pred.spikeF1, color: C.cyan, win: true },
    { row: "尖峰", col: "重构误差", v: M.recon.spikeF1, color: C.violet, win: false },
    { row: "漂移", col: "预测残差", v: M.pred.driftF1, color: C.cyan, win: false },
    { row: "漂移", col: "重构误差", v: M.recon.driftF1, color: C.violet, win: true },
  ];
  const cw = 340, ch = 118, gx = 210, gy = 54;
  const lx = 118;
  return (
    <div style={{ opacity: p }}>
      <svg width={width} height={height}>
        <text x={lx + gx + cw / 2} y={26} textAnchor="middle" fontFamily={FONT.mono} fontSize={FT.meta} fill={C.cyan}>预测残差</text>
        <text x={lx + gx + cw + 34 + cw / 2} y={26} textAnchor="middle" fontFamily={FONT.mono} fontSize={FT.meta} fill={C.violet}>重构误差</text>
        <text x={lx - 22} y={gy + ch / 2 + 6} textAnchor="end" fontFamily={FONT.sans} fontSize={FT.body} fill={C.inkDim}>尖峰</text>
        <text x={lx - 22} y={gy + ch + 34 + ch / 2 + 6} textAnchor="end" fontFamily={FONT.sans} fontSize={FT.body} fill={C.inkDim}>漂移</text>
        {cells.map((c, i) => {
          const x = lx + gx + (i % 2) * (cw + 34);
          const y = gy + Math.floor(i / 2) * (ch + 34);
          return (
            <g key={c.row + c.col}>
              <rect x={x} y={y} width={cw} height={ch} rx={10} fill={c.win ? "rgba(94,234,212,0.08)" : "rgba(21,30,43,0.7)"} stroke={c.win ? c.color : C.panelLine} strokeWidth={c.win ? 2 : 1} />
              <text x={x + 18} y={y + 82} fontFamily={FONT.mono} fontSize={52} fill={c.win ? c.color : C.inkDim}>{fmt4(c.v)}</text>
              <rect x={x + 178} y={y + 62} width={140} height={10} rx={5} fill={C.panelLine} />
              <rect x={x + 178} y={y + 62} width={Math.max(4, 140 * c.v)} height={10} rx={5} fill={c.color} opacity={c.win ? 0.95 : 0.5} />
              <text x={x + 178} y={y + 96} fontFamily={FONT.mono} fontSize={FT.micro} fill={c.win ? c.color : C.inkFaint}>{c.win ? "赢" : "输"}</text>
            </g>
          );
        })}
        <text x={0} y={height - 4} fontFamily={FONT.mono} fontSize={FT.micro} fill={C.inkFaint}>同一段测试序列、同一批注入点，只换检测分数</text>
      </svg>
    </div>
  );
};

/* ---------- 一对 F1 ---------- */

export const F1Pair: React.FC<{ kind: "spike" | "drift"; width?: number; height?: number; at?: number }> = ({ kind, width = 940, height = 250, at = 0 }) => {
  const f = useCurrentFrame();
  const p = at > 0 ? pct(f, at, at + 24) : 1;
  const isSpike = kind === "spike";
  const rows = [
    { label: "预测残差", v: isSpike ? M.pred.spikeF1 : M.pred.driftF1, color: C.cyan },
    { label: "重构误差", v: isSpike ? M.recon.spikeF1 : M.recon.driftF1, color: C.violet },
  ];
  const max = 1;
  const bw = width - 360;
  return (
    <div style={{ opacity: p, width }}>
      {rows.map((r, i) => (
        <div key={r.label} style={{ display: "flex", alignItems: "center", height: 84 }}>
          <div style={{ width: 170, fontFamily: FONT.mono, fontSize: FT.meta, color: C.inkDim }}>{r.label}</div>
          <div style={{ width: bw, height: 26, background: C.panelLine, borderRadius: 5, position: "relative" }}>
            <div style={{ position: "absolute", left: 0, top: 0, height: 26, width: Math.max(3, (r.v / max) * bw), borderRadius: 5, background: r.color, opacity: i === (isSpike ? 0 : 1) ? 0.95 : 0.55 }} />
            <div style={{ position: "absolute", left: (0.1 / max) * bw, top: -6, width: 1, height: 38, background: C.inkFaint }} />
          </div>
          <div style={{ width: 150, marginLeft: 16, fontFamily: FONT.mono, fontSize: 40, color: r.color }}>{fmt4(r.v)}</div>
        </div>
      ))}
      <div style={{ fontFamily: FONT.mono, fontSize: FT.micro, color: C.inkFaint }}>竖线 = 0.1 · {isSpike ? "尖峰：残差逐点放大，重构只错一个点" : "漂移：整段形状变了，逐点误差却很小"}</div>
    </div>
  );
};

/* ---------- 重构分 ---------- */

export const ReconScores: React.FC<{ width?: number; height?: number; at?: number }> = ({ width = 940, height = 170, at = 0 }) => {
  const f = useCurrentFrame();
  const p = at > 0 ? pct(f, at, at + 22) : 1;
  const rows = [
    { label: "正常窗口", v: M.recon.normalMean, color: C.cyan, text: fmt4(M.recon.normalMean) },
    { label: "漂移窗口", v: M.recon.driftMean, color: C.coral, text: fmt4(M.recon.driftMean) },
  ];
  const bw = width - 430;
  const max = 3;
  return (
    <div style={{ opacity: p, width }}>
      {rows.map((r) => (
        <div key={r.label} style={{ display: "flex", alignItems: "center", height: 62 }}>
          <div style={{ width: 190, fontFamily: FONT.mono, fontSize: FT.meta, color: C.inkDim }}>{r.label}</div>
          <div style={{ width: bw, height: 20, background: C.panelLine, borderRadius: 4 }}>
            <div style={{ height: 20, borderRadius: 4, background: r.color, opacity: 0.9, width: (r.v / max) * bw }} />
          </div>
          <div style={{ marginLeft: 16, width: 160, fontFamily: FONT.mono, fontSize: FT.lead, color: r.color }}>{r.text}</div>
        </div>
      ))}
      <div style={{ fontFamily: FONT.mono, fontSize: FT.micro, color: C.inkFaint }}>同一把编码器 · 平均重构分 · 漂移是正常的 {fmt2(M.recon.driftMean / M.recon.normalMean, 2)} 倍</div>
    </div>
  );
};

/* ---------- 自编码器参数 ---------- */

export const AeDiagram: React.FC<{ width?: number; height?: number; at?: number }> = ({ width = 940, height = 280, at = 0 }) => {
  const f = useCurrentFrame();
  const p = at > 0 ? pct(f, at, at + 26) : 1;
  const cy = 120;
  const dotR = 5;
  // 32 点一列要放进 280 高的画布，点距按列宽算，8 点列留松一点
  const step = (n: number) => (n > 16 ? 5.2 : 16);
  const cols = [
    { n: 32, x: 150, color: C.cyan, label: "输入 32" },
    { n: 8, x: 470, color: C.amber, label: "隐层 8" },
    { n: 32, x: 790, color: C.cyan, label: "输出 32" },
  ];
  const dotY = (i: number, n: number) => cy - ((n - 1) * step(n)) / 2 + i * step(n);
  return (
    <div style={{ opacity: p }}>
      <svg width={width} height={height}>
        {cols.map((c) => (
          <g key={c.x}>
            {Array.from({ length: c.n }).map((_, i) => (
              <circle key={i} cx={c.x} cy={dotY(i, c.n)} r={dotR} fill={c.color} opacity={0.85} />
            ))}
            <text x={c.x} y={cy + 116} textAnchor="middle" fontFamily={FONT.mono} fontSize={FT.meta} fill={c.color}>{c.label}</text>
          </g>
        ))}
        {[0, 1, 2, 3].map((k) => (
          <g key={k}>
            <line x1={cols[0].x + 12} y1={dotY(4 + k * 7, 32)} x2={cols[1].x - 12} y2={dotY(k * 2 + 1, 8)} stroke={C.panelLine} strokeWidth={1.2} />
            <line x1={cols[1].x + 12} y1={dotY(k * 2 + 1, 8)} x2={cols[2].x - 12} y2={dotY(6 + k * 6, 32)} stroke={C.panelLine} strokeWidth={1.2} />
          </g>
        ))}
        <text x={cols[0].x + 18} y={22} fontFamily={FONT.mono} fontSize={FT.micro} fill={C.inkFaint}>W1 · 8 × 32</text>
        <text x={cols[1].x + 18} y={22} fontFamily={FONT.mono} fontSize={FT.micro} fill={C.inkFaint}>W2 · 32 × 8</text>
        <text x={330} y={cy + 60} fontFamily={FONT.mono} fontSize={FT.meta} fill={C.inkDim}>压缩</text>
        <text x={650} y={cy + 60} fontFamily={FONT.mono} fontSize={FT.meta} fill={C.inkDim}>重建</text>
        <text x={0} y={height - 8} fontFamily={FONT.mono} fontSize={FT.micro} fill={C.inkFaint}>32×8 + 8 + 8×32 + 32 = 552 个参数 · tanh 隐层 · 线性输出 · 逐维 MSE</text>
      </svg>
    </div>
  );
};

/* ---------- 阈值扫描 ---------- */

export const SweepLines: React.FC<{ width?: number; height?: number; at?: number }> = ({ width = 940, height = 300, at = 0 }) => {
  const f = useCurrentFrame();
  const p = at > 0 ? pct(f, at, at + 28) : 1;
  const ml = 56, mr = 180, mt = 24, mb = 52;
  const qs = M.sweep.map((s) => s.q);
  const X = (i: number) => ml + (i / (qs.length - 1)) * (width - ml - mr);
  const Y = (v: number) => height - mb - v * (height - mt - mb);
  const series = [
    { key: "predSpike", label: "预测 · 尖峰", color: C.coral, dash: false, dy: 0 },
    { key: "reconDrift", label: "重构 · 漂移", color: C.cyan, dash: false, dy: -4 },
    { key: "predDrift", label: "预测 · 漂移", color: C.amber, dash: true, dy: 2 },
    { key: "reconSpike", label: "重构 · 尖峰", color: C.violet, dash: true, dy: -12 },
  ] as const;
  return (
    <div style={{ opacity: p }}>
      <svg width={width} height={height}>
        {[0, 0.2, 0.4, 0.6, 0.8].map((t) => (
          <g key={t}>
            <line x1={ml} x2={width - mr} y1={Y(t)} y2={Y(t)} stroke={C.panelLine} strokeDasharray="4 6" opacity={0.55} />
            <text x={ml - 10} y={Y(t) + 5} textAnchor="end" fontFamily={FONT.mono} fontSize={FT.micro} fill={C.inkFaint}>{t.toFixed(1)}</text>
          </g>
        ))}
        <line x1={X(3)} x2={X(3)} y1={mt} y2={height - mb} stroke={C.inkFaint} strokeDasharray="3 6" />
        <text x={X(3)} y={mt - 6} textAnchor="middle" fontFamily={FONT.mono} fontSize={FT.micro} fill={C.inkFaint}>q = 0.99</text>
        {series.map((s) => (
          <g key={s.key}>
            <path d={M.sweep.map((row, i) => (i === 0 ? "M" : "L") + X(i).toFixed(1) + " " + Y(row[s.key]).toFixed(1)).join(" ")} fill="none" stroke={s.color} strokeWidth={s.dash ? 1.8 : 2.6} strokeDasharray={s.dash ? "6 5" : undefined} />
            {M.sweep.map((row, i) => <circle key={i} cx={X(i)} cy={Y(row[s.key])} r={3.4} fill={s.color} />)}
            <text x={width - mr + 12} y={Y(M.sweep[M.sweep.length - 1][s.key]) + 5 + s.dy} fontFamily={FONT.mono} fontSize={FT.micro} fill={s.color}>{s.label}</text>
          </g>
        ))}
        {qs.map((q, i) => <text key={q} x={X(i)} y={height - mb + 22} textAnchor="middle" fontFamily={FONT.mono} fontSize={FT.micro} fill={C.inkFaint}>{q.toFixed(3).replace("0.", ".")}</text>)}
        <text x={ml} y={height - 8} fontFamily={FONT.mono} fontSize={FT.micro} fill={C.inkFaint}>横轴：标定分位 q · 纵轴：测试段 F1</text>
      </svg>
    </div>
  );
};

/* ---------- 模块行数 ---------- */

export const ModuleBars: React.FC<{ width?: number; height?: number; at?: number }> = ({ width = 920, height = 230, at = 0 }) => {
  const f = useCurrentFrame();
  const p = at > 0 ? pct(f, at, at + 22) : 1;
  const rows = [
    { label: "PredAnomaly.hs", value: M.code.predLines, color: C.cyan, note: "残差 · 分位 · 阈值 · F1" },
    { label: "ReconAnomaly.hs", value: M.code.reconLines, color: C.violet, note: "初始化 · 前向 · 解析梯度" },
    { label: "证据程序", value: M.code.evidenceLines, color: C.amber, note: "19 项检查 · 349 行" },
  ];
  const max = 380;
  const bw = width - 470;
  return (
    <div style={{ opacity: p, width }}>
      {rows.map((r) => (
        <div key={r.label} style={{ display: "flex", alignItems: "center", height: 56 }}>
          <div style={{ width: 210, fontFamily: FONT.mono, fontSize: FT.meta, color: C.inkDim }}>{r.label}</div>
          <div style={{ width: bw, height: 16, background: C.panelLine, borderRadius: 4 }}>
            <div style={{ height: 16, borderRadius: 4, background: r.color, opacity: 0.9, width: (r.value / max) * bw }} />
          </div>
          <div style={{ marginLeft: 16, width: 80, fontFamily: FONT.mono, fontSize: FT.lead, color: r.color }}>{r.value}</div>
          <div style={{ marginLeft: 8, fontFamily: FONT.sans, fontSize: FT.micro, color: C.inkFaint }}>{r.note}</div>
        </div>
      ))}
      <div style={{ fontFamily: FONT.mono, fontSize: FT.micro, color: C.inkFaint, marginTop: 4 }}>两个模块合计 {M.code.totalLines} 行 · 单测 {M.code.tests} 条（{M.code.predTests} + {M.code.reconTests}）</div>
    </div>
  );
};

/* ---------- 数据切分 ---------- */

export const SplitBar: React.FC<{ width?: number; height?: number; at?: number; windows?: boolean }> = ({ width = 940, height = 210, at = 0, windows = false }) => {
  const f = useCurrentFrame();
  const p = at > 0 ? pct(f, at, at + 24) : 1;
  const D = M.data;
  const barH = 40;
  const bw = width - 40;
  const segs = windows
    ? [
        { label: "拟合 732 窗", n: D.fitWindows, color: C.cyan, note: "2015–2017" },
        { label: "标定 487 窗", n: D.calibWindows, color: C.amber, note: "2018–2019 · 定阈值" },
        { label: "测试 728 点", n: D.testPoints, color: C.coral, note: "2020–2022 · 注入" },
      ]
    : (() => {
        const held = D.returnsRows - D.trainRows - D.testRows;
        return [
          { label: "训练 " + D.trainRows.toLocaleString("en-US") + " 行", n: D.trainRows, color: C.cyan, note: "2015–2019" },
          { label: "留出 " + held.toLocaleString("en-US") + " 行", n: held, color: C.inkFaint, note: "不参与本集" },
          { label: "测试 " + D.testRows + " 行", n: D.testRows, color: C.coral, note: "2020–2022" },
        ];
      })();
  const total = segs.reduce((a, s) => a + s.n, 0);
  let acc = 20;
  return (
    <div style={{ opacity: p }}>
      <svg width={width} height={height}>
        {segs.map((s) => {
          const w = (s.n / total) * bw;
          const x = acc;
          acc += w;
          return (
            <g key={s.label}>
              <rect x={x} y={44} width={Math.max(6, w - 4)} height={barH} rx={5} fill={s.color} opacity={0.22} stroke={s.color} strokeWidth={1.4} />
              <text x={x + 8} y={40} fontFamily={FONT.mono} fontSize={FT.micro} fill={s.color}>{s.label}</text>
              <text x={x + 8} y={44 + barH + 20} fontFamily={FONT.mono} fontSize={FT.micro} fill={C.inkFaint}>{s.note}</text>
            </g>
          );
        })}
        <text x={20} y={height - 14} fontFamily={FONT.mono} fontSize={FT.micro} fill={C.inkFaint}>
          {windows ? "三段互不重叠 · 阈值只在标定段上定" : "全集 " + D.returnsRows.toLocaleString("en-US") + " 行 · " + D.firstDate + " → " + D.lastDate}
        </text>
      </svg>
    </div>
  );
};
