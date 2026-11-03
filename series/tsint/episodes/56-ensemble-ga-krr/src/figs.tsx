import React from "react";
import { useCurrentFrame } from "remotion";
import { C, FONT, FT } from "../design/tokens";
import { M, fmt4, pct } from "./shared";

/* ---------------- E56 figures: subsets, Pareto, KR curve, fusion ---------------- */

export const SubsetGrid: React.FC<{ width?: number; cell?: number; at?: number }> = ({ width = 760, cell = 20, at = 0 }) => {
  const f = useCurrentFrame();
  const p = at > 0 ? pct(f, at, at + 20) : 1;
  const n = M.data.subsets;
  const cols = 32;
  return (
    <div style={{ width, opacity: p }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(" + cols + ", " + cell + "px)", gap: 2 }}>
        {Array.from({ length: n }).map((_, i) => {
          const sampled = (i * 37 + 13) % 1000 < 200;
          return (
            <div key={i} style={{
              width: cell, height: cell, borderRadius: 2,
              background: sampled ? C.amber : "#1a2836",
              opacity: sampled ? 0.9 : 0.7,
            }} />
          );
        })}
      </div>
      <div style={{ marginTop: 12, fontFamily: FONT.sans, fontSize: FT.meta, color: C.inkFaint }}>
        1,024 个子集（浅色）；GA 只评了 200 个个体（亮色）。
      </div>
    </div>
  );
};

export const Bits: React.FC<{ label: string; bits: number[]; color?: string; note?: string }> = ({ label, bits, color = C.cyan, note }) => (
  <div style={{ display: "flex", alignItems: "center", marginBottom: 10 }}>
    <div style={{ width: 120, fontFamily: FONT.mono, fontSize: FT.meta, color: C.inkFaint }}>{label}</div>
    <div style={{ display: "flex", gap: 4 }}>
      {bits.map((b, i) => (
        <div key={i} style={{
          width: 30, height: 34, borderRadius: 4, display: "flex", alignItems: "center", justifyContent: "center",
          background: b ? "rgba(96,220,214,0.14)" : "#141f2b",
          border: "1px solid " + (b ? color : C.panelLine),
          fontFamily: FONT.mono, fontSize: FT.meta, color: b ? color : C.inkFaint,
        }}>{b}</div>
      ))}
    </div>
    {note ? <div style={{ marginLeft: 16, fontFamily: FONT.sans, fontSize: FT.meta, color: C.inkFaint }}>{note}</div> : null}
  </div>
);

export const ParetoChart: React.FC<{ width?: number; height?: number; at?: number; showDominated?: boolean }> = ({
  width = 620, height = 360, at = 0, showDominated = true,
}) => {
  const f = useCurrentFrame();
  const p = at > 0 ? pct(f, at, at + 16) : 1;
  const x0 = 76, y0 = height - 52, x1 = width - 26, y1 = 24;
  const bx = (v: number) => x0 + (v / 1.3) * (x1 - x0);
  const by = (v: number) => y0 - (v / 1.7) * (y0 - y1);
  const pts = M.demo.points;
  const dom = M.demo.dominated;
  return (
    <svg width={width} height={height} style={{ opacity: p }}>
      <line x1={x0} y1={y0} x2={x1} y2={y0} stroke={C.panelLine} />
      <line x1={x0} y1={y0} x2={x0} y2={y1} stroke={C.panelLine} />
      {[0.5, 1.0, 1.5].map((v) => (
        <g key={"y" + v}>
          <line x1={x0} y1={by(v)} x2={x1} y2={by(v)} stroke="#1b2836" strokeDasharray="3 5" />
          <text x={x0 - 12} y={by(v) + 4} fill={C.inkFaint} fontSize={14} fontFamily={FONT.mono} textAnchor="end">{v.toFixed(1)}</text>
        </g>
      ))}
      {[0.3, 0.6, 0.9, 1.2].map((v) => (
        <text key={"x" + v} x={bx(v)} y={y0 + 26} fill={C.inkFaint} fontSize={14} fontFamily={FONT.mono} textAnchor="middle">{v.toFixed(1)}</text>
      ))}
      <text x={(x0 + x1) / 2} y={height - 8} fill={C.inkFaint} fontSize={14} fontFamily={FONT.sans} textAnchor="middle">偏差 bias（越小越好）</text>
      <text x={20} y={(y0 + y1) / 2} fill={C.inkFaint} fontSize={14} fontFamily={FONT.sans} textAnchor="middle" transform={"rotate(-90 20 " + (y0 + y1) / 2 + ")"}>方差 variance（越小越好）</text>
      {pts.map(([b, v], i) => {
        const isDom = showDominated && b === dom[0] && v === dom[1];
        const crowded = pts.some(([b2, v2], j) => j !== i && Math.abs(b2 - b) < 0.2 && Math.abs(v2 - v) < 0.15);
        const left = crowded && !isDom;
        return (
          <g key={i}>
            <circle cx={bx(b)} cy={by(v)} r={isDom ? 8 : 10} fill={isDom ? C.coral : C.cyan} opacity={0.9} />
            <text
              x={isDom ? bx(b) + 12 : left ? bx(b) - 16 : bx(b) + 16}
              y={isDom ? by(v) - 14 : by(v) + 5}
              textAnchor={left ? "end" : "start"}
              fill={isDom ? C.coral : C.ink}
              fontSize={isDom ? 15 : 16}
              fontFamily={FONT.mono}
            >
              ({b.toFixed(1)}, {v.toFixed(1)})
            </text>
          </g>
        );
      })}
      {showDominated ? (
        <line x1={bx(1.0)} y1={by(0.1)} x2={bx(1.1)} y2={by(0.1)} stroke={C.coral} strokeDasharray="4 4" strokeWidth={1.5} />
      ) : null}
    </svg>
  );
};

export const KernelCurve: React.FC<{ width?: number; height?: number; at?: number }> = ({ width = 520, height = 250, at = 0 }) => {
  const f = useCurrentFrame();
  const p = at > 0 ? pct(f, at, at + 16) : 1;
  const x0 = 54, y0 = height - 40, x1 = width - 20, y1 = 20;
  const bx = (d: number) => x0 + (d / 2.5) * (x1 - x0);
  const by = (k: number) => y0 - k * (y0 - y1);
  const ell = 0.85;
  const path = Array.from({ length: 120 }).map((_, i) => {
    const d = (i / 119) * 2.5;
    const k = Math.exp(-(d * d) / (2 * ell * ell));
    return (i === 0 ? "M" : "L") + bx(d).toFixed(1) + " " + by(k).toFixed(1);
  }).join(" ");
  return (
    <svg width={width} height={height} style={{ opacity: p }}>
      <line x1={x0} y1={y0} x2={x1} y2={y0} stroke={C.panelLine} />
      <line x1={x0} y1={y0} x2={x0} y2={y1} stroke={C.panelLine} />
      <path d={path} fill="none" stroke={C.cyan} strokeWidth={2.5} />
      <text x={x1} y={y0 + 26} fill={C.inkFaint} fontSize={13} fontFamily={FONT.mono} textAnchor="end">距离 d</text>
      <text x={x0 - 10} y={y1 + 6} fill={C.inkFaint} fontSize={13} fontFamily={FONT.mono} textAnchor="end">1</text>
      <text x={x0 - 10} y={y0 + 4} fill={C.inkFaint} fontSize={13} fontFamily={FONT.mono} textAnchor="end">0</text>
      <text x={bx(1.0)} y={by(0.62) - 8} fill={C.inkFaint} fontSize={13} fontFamily={FONT.sans} textAnchor="middle">核值随距离衰减</text>
    </svg>
  );
};

export const FusionBars: React.FC<{ width?: number; at?: number }> = ({ width = 900, at = 0 }) => {
  const f = useCurrentFrame();
  const rows = [
    { label: "子集等权", v: M.fusion.pEq, color: C.cyan, note: "GA 选出的子集，等权" },
    { label: "最好单模型", v: M.fusion.best, color: C.inkFaint, note: "oracle 下界，检验段事后才有" },
    { label: "Top-3 平均", v: M.fusion.top3, color: C.violet, note: "按调参段排名取前三" },
    { label: "核岭回归", v: M.fusion.krr, color: C.amber, note: "子集等权 + 核修正" },
    { label: "全池等权", v: M.fusion.equal, color: C.inkDim, note: "十个候选全用" },
    { label: "全池核回归", v: M.fusion.krrAll, color: C.coral, note: "十个候选学权重" },
  ];
  const lo = 9.45, hi = 10.3;
  return (
    <div style={{ width }}>
      {rows.map((r, i) => {
        const p = at > 0 ? pct(f, at + i * 4, at + 16 + i * 4) : 1;
        const w = ((r.v - lo) / (hi - lo)) * (width - 320);
        return (
          <div key={r.label} style={{ display: "flex", alignItems: "center", height: 58, opacity: p }}>
            <div style={{ width: 132, fontFamily: FONT.sans, fontSize: FT.meta, color: C.inkDim }}>{r.label}</div>
            <div style={{ width: width - 320, height: 16, background: "#16232f", borderRadius: 4, position: "relative" }}>
              <div style={{ position: "absolute", left: 0, top: 0, height: 16, width: Math.max(3, w), borderRadius: 4, background: r.color, opacity: 0.9 }} />
            </div>
            <div style={{ width: 92, textAlign: "right", fontFamily: FONT.mono, fontSize: FT.meta, color: r.color }}>{fmt4(r.v)}</div>
            <div style={{ width: 96, textAlign: "right", fontFamily: FONT.sans, fontSize: FT.micro, color: C.inkFaint }}>{r.note.includes("oracle") ? "下界" : ""}</div>
          </div>
        );
      })}
      <div style={{ marginTop: 6, fontFamily: FONT.sans, fontSize: FT.meta, color: C.inkFaint }}>
        横轴截断：只画 9.45 到 10.30 这一段；越低越好。六个读数都来自二十只股票的检验段。
      </div>
    </div>
  );
};

export const CandidateBars: React.FC<{ width?: number; at?: number }> = ({ width = 860, at = 0 }) => {
  const f = useCurrentFrame();
  const tune = M.fusion.perCandTune;
  const test = M.fusion.perCandTest;
  const labels = M.fusion.candidates;
  const hi = 17.6;
  return (
    <div style={{ width }}>
      {labels.map((c, i) => {
        const p = at > 0 ? pct(f, at + i * 3, at + 14 + i * 3) : 1;
        return (
          <div key={c.key} style={{ display: "flex", alignItems: "center", height: 34, opacity: p }}>
            <div style={{ width: 108, fontFamily: FONT.mono, fontSize: FT.micro, color: C.inkDim }}>{c.label}</div>
            <div style={{ width: (width - 280) / 2, height: 9, background: "#16232f", borderRadius: 3 }}>
              <div style={{ height: 9, width: Math.max(2, (tune[i] / hi) * ((width - 280) / 2)), borderRadius: 3, background: C.violet, opacity: 0.85 }} />
            </div>
            <div style={{ width: (width - 280) / 2, height: 9, background: "#16232f", borderRadius: 3, marginLeft: 8 }}>
              <div style={{ height: 9, width: Math.max(2, (test[i] / hi) * ((width - 280) / 2)), borderRadius: 3, background: C.cyan, opacity: 0.85 }} />
            </div>
            <div style={{ width: 74, textAlign: "right", fontFamily: FONT.mono, fontSize: FT.micro, color: C.inkFaint }}>{fmt4(test[i])}</div>
          </div>
        );
      })}
      <div style={{ display: "flex", marginTop: 10, gap: 20 }}>
        <span style={{ fontFamily: FONT.mono, fontSize: FT.micro, color: C.violet }}>■ 调参段</span>
        <span style={{ fontFamily: FONT.mono, fontSize: FT.micro, color: C.cyan }}>■ 检验段</span>
        <span style={{ fontFamily: FONT.sans, fontSize: FT.micro, color: C.inkFaint }}>右列为检验段 MAE；naive 与 exp .2 是两个极端。</span>
      </div>
    </div>
  );
};

export const LambdaDots: React.FC<{ width?: number; at?: number }> = ({ width = 520, at = 0 }) => {
  const f = useCurrentFrame();
  const p = at > 0 ? pct(f, at, at + 14) : 1;
  const names = ["λ=0.01", "λ=0.1", "λ=1.0"];
  const counts = M.krr.lamCounts;
  const colors = [C.coral, C.amber, C.cyan];
  let k = 0;
  return (
    <div style={{ width, opacity: p }}>
      {counts.map((n, gi) => {
        const dots = Array.from({ length: n });
        const row = dots.map((_, i) => {
          const col = colors[gi];
          k += 1;
          return <div key={i} style={{ width: 22, height: 22, borderRadius: 11, background: col, opacity: 0.9 }} />;
        });
        return (
          <div key={gi} style={{ display: "flex", alignItems: "center", marginBottom: 12 }}>
            <div style={{ width: 96, fontFamily: FONT.mono, fontSize: FT.meta, color: C.inkDim }}>{names[gi]}</div>
            <div style={{ display: "flex", gap: 6 }}>{row.length ? row : <span style={{ fontFamily: FONT.mono, fontSize: FT.meta, color: C.inkFaint }}>0</span>}</div>
            <div style={{ marginLeft: 14, fontFamily: FONT.mono, fontSize: FT.meta, color: C.inkFaint }}>{n}/20</div>
          </div>
        );
      })}
      <div style={{ fontFamily: FONT.sans, fontSize: FT.meta, color: C.inkFaint }}>20 只股票，5 折 CV 选出的 λ：18 只选了最大的 1.0。</div>
    </div>
  );
};

export const SplitBar: React.FC<{ width?: number; at?: number }> = ({ width = 900, at = 0 }) => {
  const f = useCurrentFrame();
  const p = at > 0 ? pct(f, at, at + 16) : 1;
  const segs = [
    { label: "训练段 70%", frac: 0.7, color: "#2b4353", note: "拟合十个候选" },
    { label: "调参段 15%", frac: 0.15, color: C.violet, note: "GA 适应度 + KR 拟合" },
    { label: "检验段 15%", frac: 0.15, color: C.cyan, note: "只报告，不参与" },
  ];
  let x = 0;
  return (
    <div style={{ width, opacity: p }}>
      <div style={{ display: "flex", width, height: 34, borderRadius: 6, overflow: "hidden" }}>
        {segs.map((s) => {
          const w = s.frac * width;
          const left = x;
          x += w;
          return <div key={s.label} style={{ position: "relative", width: w, background: s.color, opacity: 0.9 }}>
            <div style={{ position: "absolute", left: 10, top: 8, fontFamily: FONT.mono, fontSize: FT.micro, color: "#07121a" }}>{s.label}</div>
          </div>;
        })}
      </div>
      <div style={{ display: "flex", marginTop: 8 }}>
        {segs.map((s) => (
          <div key={s.label} style={{ width: s.frac * width, fontFamily: FONT.sans, fontSize: FT.micro, color: C.inkFaint, paddingRight: 8 }}>{s.note}</div>
        ))}
      </div>
    </div>
  );
};
