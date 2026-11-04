import React from "react";
import { useCurrentFrame } from "remotion";
import { C, FONT, FT } from "../design/tokens";
import { M, Mono, K, clamp, mix, pct } from "./shared";

/* ---------- 掩码条：真实曲线 + 被遮段 ---------- */

const runsOf = (mask: number[]): [number, number][] => {
  const out: [number, number][] = [];
  let i = 0;
  while (i < mask.length) {
    if (mask[i] > 0.5) {
      let j = i;
      while (j < mask.length && mask[j] > 0.5) j += 1;
      out.push([i, j]);
      i = j;
    } else i += 1;
  }
  return out;
};

export const MaskStrip: React.FC<{ width?: number; height?: number; at?: number; label?: boolean }> = ({
  width = 980, height = 210, at = 0, label = true,
}) => {
  const f = useCurrentFrame();
  const p = at > 0 ? pct(f, at, at + 26) : 1;
  const series = M.example.true;
  const mask = M.example.mask;
  const runs = runsOf(mask);
  const lo = Math.min(...series);
  const hi = Math.max(...series);
  const X = (i: number) => 14 + (i / (series.length - 1)) * (width - 28);
  const Y = (v: number) => height - 34 - ((v - lo) / (hi - lo)) * (height - 68);
  const d = series.map((v, i) => (i === 0 ? "M" : "L") + X(i).toFixed(1) + " " + Y(v).toFixed(1)).join(" ");
  return (
    <div style={{ opacity: p }}>
      <svg width={width} height={height} style={{ overflow: "visible" }}>
        {runs.map(([a, b], i) => (
          <rect key={i} x={X(a)} y={16} width={Math.max(2, X(b - 1) - X(a))} height={height - 52}
            fill="rgba(251,191,36,0.16)" stroke="rgba(251,191,36,0.5)" strokeWidth={1} />
        ))}
        <path d={d} fill="none" stroke={C.inkDim} strokeWidth={1.8} />
        <line x1={14} x2={width - 14} y1={height - 34} y2={height - 34} stroke={C.panelLine} />
      </svg>
      {label ? (
        <div style={{ display: "flex", gap: 22, marginTop: 4 }}>
          <MiniLegend color={C.inkDim}>真实曲线（窗口内标准化）</MiniLegend>
          <MiniLegend color="rgba(251,191,36,0.8)">被遮段：154 / 512</MiniLegend>
        </div>
      ) : null}
    </div>
  );
};

/* ---------- 重建对比：真值与预测 ---------- */

export const ReconCompare: React.FC<{ width?: number; height?: number; at?: number; showMask?: boolean }> = ({
  width = 1000, height = 300, at = 0, showMask = true,
}) => {
  const f = useCurrentFrame();
  const p = at > 0 ? pct(f, at, at + 30) : 1;
  const t = M.example.true;
  const q = M.example.pred;
  const runs = runsOf(M.example.mask);
  const all = t.concat(q);
  const lo = Math.min(...all);
  const hi = Math.max(...all);
  const X = (i: number) => 12 + (i / (t.length - 1)) * (width - 24);
  const Y = (v: number) => height - 30 - ((v - lo) / (hi - lo)) * (height - 58);
  const line = (arr: number[]) => arr.map((v, i) => (i === 0 ? "M" : "L") + X(i).toFixed(1) + " " + Y(v).toFixed(1)).join(" ");
  return (
    <div style={{ opacity: p }}>
      <svg width={width} height={height} style={{ overflow: "visible" }}>
        {showMask ? runs.map(([a, b], i) => (
          <rect key={i} x={X(a)} y={10} width={Math.max(2, X(b - 1) - X(a))} height={height - 46}
            fill="rgba(251,191,36,0.10)" />
        )) : null}
        <path d={line(t)} fill="none" stroke={C.inkFaint} strokeWidth={1.6} />
        <path d={line(q)} fill="none" stroke={C.cyan} strokeWidth={2.2} />
        <line x1={12} x2={width - 12} y1={height - 30} y2={height - 30} stroke={C.panelLine} />
      </svg>
      <div style={{ display: "flex", gap: 22, marginTop: 4 }}>
        <MiniLegend color={C.inkFaint}>真实</MiniLegend>
        <MiniLegend color={C.cyan}>模型重建</MiniLegend>
        <MiniLegend color="rgba(251,191,36,0.7)">掩码区</MiniLegend>
      </div>
    </div>
  );
};

/* ---------- 损失曲线：训练与验证 ---------- */

export const LossCurve: React.FC<{ width?: number; height?: number; at?: number }> = ({ width = 980, height = 320, at = 0 }) => {
  const f = useCurrentFrame();
  const p = at > 0 ? pct(f, at, at + 34) : 1;
  const tr = M.train.trainLoss;
  const va = M.train.valLoss;
  const maxY = 0.42;
  const X = (e: number) => 46 + (e / (tr.length - 1)) * (width - 96);
  const Y = (v: number) => height - 40 - (v / maxY) * (height - 70);
  const path = (arr: number[]) => arr.map((v, i) => (i === 0 ? "M" : "L") + X(i).toFixed(1) + " " + Y(v).toFixed(1)).join(" ");
  return (
    <div style={{ opacity: p }}>
      <svg width={width} height={height} style={{ overflow: "visible" }}>
        {[0, 0.1, 0.2, 0.3, 0.4].map((v) => (
          <g key={v}>
            <line x1={46} x2={width - 50} y1={Y(v)} y2={Y(v)} stroke={C.panelLine} strokeDasharray={v === 0 ? "" : "3 7"} />
            <text x={8} y={Y(v) + 4} fill={C.inkFaint} fontFamily="monospace" fontSize={12}>{v.toFixed(1)}</text>
          </g>
        ))}
        <path d={path(tr)} fill="none" stroke={C.cyan} strokeWidth={2} />
        <path d={path(va)} fill="none" stroke={C.amber} strokeWidth={2} />
        <line x1={X(M.train.bestEpoch - 1)} x2={X(M.train.bestEpoch - 1)} y1={24} y2={height - 40} stroke={C.coral} strokeDasharray="4 6" />
        <text x={X(M.train.bestEpoch - 1) - 52} y={20} fill={C.coral} fontFamily="monospace" fontSize={12}>best #{M.train.bestEpoch}</text>
        {tr.map((_, i) => (i % 4 === 0 ? <text key={i} x={X(i) - 4} y={height - 18} fill={C.inkFaint} fontFamily="monospace" fontSize={11}>{i + 1}</text> : null))}
      </svg>
      <div style={{ display: "flex", gap: 22, marginTop: 2 }}>
        <MiniLegend color={C.cyan}>训练损失</MiniLegend>
        <MiniLegend color={C.amber}>验证损失</MiniLegend>
      </div>
    </div>
  );
};

/* ---------- 参数账：三段堆叠 ---------- */

export const ParamSplit: React.FC<{ width?: number; at?: number }> = ({ width = 980, at = 0 }) => {
  const f = useCurrentFrame();
  const p = at > 0 ? pct(f, at, at + 26) : 1;
  const total = M.params.total;
  const segs = [
    { label: "W1 + b1", n: M.params.w1 + M.params.b1, color: C.cyan },
    { label: "W2 + b2", n: M.params.w2 + M.params.b2, color: C.violet },
    { label: "mask token", n: M.params.token, color: C.amber },
    { label: "线性头", n: M.params.head, color: C.coral },
  ];
  return (
    <div style={{ opacity: p, width }}>
      <div style={{ display: "flex", height: 30, borderRadius: 6, overflow: "hidden", border: "1px solid " + C.panelLine }}>
        {segs.map((s) => (
          <div key={s.label} style={{ width: (s.n / total) * width, background: s.color, opacity: 0.85 }} />
        ))}
      </div>
      <div style={{ display: "flex", gap: 28, marginTop: 14, whiteSpace: "nowrap" }}>
        {segs.map((s) => (
          <div key={s.label}>
            <div style={{ fontFamily: FONT.mono, fontSize: FT.micro, color: s.color }}>{s.label}</div>
            <div style={{ fontFamily: FONT.mono, fontSize: FT.meta, color: C.inkDim }}>{s.n.toLocaleString("en-US")}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ---------- 三段切分与隔离带 ---------- */

export const TimeSplit: React.FC<{ width?: number; at?: number }> = ({ width = 1000, at = 0 }) => {
  const f = useCurrentFrame();
  const p = at > 0 ? pct(f, at, at + 28) : 1;
  const total = 6069;
  const blocks = [
    { name: "训练", from: 0, n: 3000, color: C.cyan },
    { name: "验证", from: 3512, n: 1000, color: C.amber },
    { name: "测试", from: 5024, n: 1000, color: C.violet },
  ];
  const X = (i: number) => (i / total) * width;
  return (
    <div style={{ opacity: p, width }}>
      <div style={{ position: "relative", height: 64 }}>
        {blocks.map((b) => (
          <div key={b.name} style={{ position: "absolute", left: X(b.from), width: X(b.n), top: 6, height: 32, background: b.color, opacity: 0.8, borderRadius: 3 }}>
            <div style={{ position: "absolute", left: 8, top: 7, fontFamily: FONT.mono, fontSize: 12, color: "#06121a" }}>{b.name} {b.n}</div>
          </div>
        ))}
        {[3000, 4512, 5024, 6024].filter((v) => v < total).map((v) => (
          <div key={v} style={{ position: "absolute", left: X(v), top: 0, width: 1, height: 44, background: C.inkFaint, opacity: 0.55 }} />
        ))}
      </div>
      <div style={{ fontFamily: FONT.mono, fontSize: FT.micro, color: C.inkFaint, marginTop: 2 }}>
        窗口序号 0 … 6068；间隔 512 点：3000–3511 与 4512–5023
      </div>
    </div>
  );
};

/* ---------- 32 段 × 16 点：9 整段 + 前 10 点 ---------- */

export const SegmentGrid: React.FC<{ segCount?: number; segLen?: number; full?: number; partial?: number; at?: number; cellW?: number; cellH?: number }> = ({
  segCount = 32, segLen = 16, full = 9, partial = 10, at = 0, cellW = 24, cellH = 9,
}) => {
  const f = useCurrentFrame();
  const p = at > 0 ? pct(f, at, at + 30) : 1;
  const fullSegs = [0, 3, 5, 8, 11, 14, 19, 23, 27];
  const partSeg = 30;
  return (
    <div style={{ opacity: p }}>
      {Array.from({ length: segLen }).map((_, r) => (
        <div key={r} style={{ display: "flex", gap: 3, marginBottom: 3 }}>
          {Array.from({ length: segCount }).map((_, c) => {
            const isFull = fullSegs.indexOf(c) >= 0;
            const isPart = c === partSeg && r < partial;
            return (
              <div key={c} style={{
                width: cellW, height: cellH, borderRadius: 2,
                background: isFull ? "rgba(251,191,36,0.85)" : isPart ? "rgba(251,191,36,0.55)" : C.panelLine,
              }} />
            );
          })}
        </div>
      ))}
      <div style={{ display: "flex", marginTop: 10, gap: 24 }}>
        <MiniLegend color="rgba(251,191,36,0.85)">9 个整段（144）</MiniLegend>
        <MiniLegend color="rgba(251,191,36,0.55)">1 段前 10 点（10）</MiniLegend>
        <MiniLegend color={C.panelLine}>22 段保留</MiniLegend>
      </div>
    </div>
  );
};

/* ---------- 编码器结构 ---------- */

export const EncoderDiagram: React.FC<{ width?: number; at?: number }> = ({ width = 1000, at = 0 }) => {
  const f = useCurrentFrame();
  const p = at > 0 ? pct(f, at, at + 26) : 1;
  const box = (x: number, w: number, title: string, sub: string, color: string) => (
    <div key={title} style={{ position: "absolute", left: x, top: 40, width: w, height: 104, border: "1px solid " + color, borderRadius: 8, background: C.panel, padding: 12, boxSizing: "border-box" }}>
      <div style={{ fontFamily: FONT.mono, fontSize: FT.meta, color }}>{title}</div>
      <div style={{ fontFamily: FONT.mono, fontSize: FT.micro, color: C.inkFaint, marginTop: 8, lineHeight: 1.5 }}>{sub}</div>
    </div>
  );
  return (
    <div style={{ opacity: p, width, position: "relative", height: 210 }}>
      {box(0, 220, "输入 x", "512 维 + mask token", C.inkDim)}
      {box(300, 260, "隐层 h", "64 维 · tanh", C.cyan)}
      {box(640, 220, "重建 x̂", "512 维 · 线性", C.violet)}
      {[[220, 300], [560, 80], [560, 640]].map(([a, b], i) => (
        <div key={i} style={{ position: "absolute", left: a, top: 92, width: b - a, height: 1, background: C.inkFaint }} />
      ))}
      <div style={{ position: "absolute", left: 220, top: 60, width: 80, textAlign: "center", fontFamily: FONT.mono, fontSize: 11, color: C.cyan }}>W1</div>
      <div style={{ position: "absolute", left: 560, top: 60, width: 80, textAlign: "center", fontFamily: FONT.mono, fontSize: 11, color: C.violet }}>W2</div>
      <div style={{ position: "absolute", left: 0, top: 168, width: 900, fontFamily: FONT.mono, fontSize: FT.micro, color: C.inkFaint }}>
        66,113 = 512×64 + 64 + 64×512 + 512 + 1
      </div>
    </div>
  );
};

/* ---------- k 样本曲线 ---------- */

export const CurveChart: React.FC<{ width?: number; height?: number; at?: number }> = ({ width = 980, height = 340, at = 0 }) => {
  const f = useCurrentFrame();
  const p = at > 0 ? pct(f, at, at + 30) : 1;
  const pts = M.curve;
  const lo = 0.95;
  const hi = 1.38;
  const X = (i: number) => 70 + (i / (pts.length - 1)) * (width - 150);
  const Y = (v: number) => height - 46 - ((v - lo) / (hi - lo)) * (height - 92);
  const path = pts.map((q, i) => (i === 0 ? "M" : "L") + X(i).toFixed(1) + " " + Y(q.relMAE).toFixed(1)).join(" ");
  return (
    <div style={{ opacity: p }}>
      <svg width={width} height={height} style={{ overflow: "visible" }}>
        {[1.0, 1.1, 1.2, 1.3].map((v) => (
          <g key={v}>
            <line x1={70} x2={width - 60} y1={Y(v)} y2={Y(v)} stroke={v === 1 ? C.coral : C.panelLine} strokeDasharray={v === 1 ? "6 6" : "3 7"} />
            <text x={20} y={Y(v) + 4} fill={v === 1 ? C.coral : C.inkFaint} fontFamily="monospace" fontSize={12}>{v.toFixed(1)}</text>
          </g>
        ))}
        <path d={path} fill="none" stroke={C.cyan} strokeWidth={2.4} />
        {pts.map((q, i) => (
          <g key={q.k}>
            <circle cx={X(i)} cy={Y(q.relMAE)} r={6} fill={C.panel} stroke={C.cyan} strokeWidth={2} />
            <text x={X(i)} y={Y(q.relMAE) - 20} textAnchor="middle" fill={C.ink} fontFamily="monospace" fontSize={17}>{q.relMAE.toFixed(4)}</text>
            <text x={X(i)} y={height - 22} textAnchor="middle" fill={C.inkFaint} fontFamily="monospace" fontSize={13}>k={q.k}</text>
          </g>
        ))}
      </svg>
      <div style={{ fontFamily: FONT.sans, fontSize: FT.meta, color: C.inkFaint, marginTop: 2 }}>
        相对 MAE：模型误差 / persistence 基线误差；基线 1.0 用红线标出，越低越好。
      </div>
    </div>
  );
};

/* ---------- 惩罚路径：λ 越大，范数越小 ---------- */

export const LambdaPath: React.FC<{ width?: number; height?: number; at?: number }> = ({ width = 980, height = 300, at = 0 }) => {
  const f = useCurrentFrame();
  const p = at > 0 ? pct(f, at, at + 28) : 1;
  const lam = [0.001, 0.01, 0.1, 1, 10, 100, 1000];
  const norm = [20.3736, 20.3684, 20.317, 19.8229, 16.2242, 6.3108, 0.8367];
  const X = (i: number) => 64 + (i / (lam.length - 1)) * (width - 140);
  const Y = (v: number) => height - 46 - (v / 22) * (height - 92);
  const d = norm.map((v, i) => (i === 0 ? "M" : "L") + X(i).toFixed(1) + " " + Y(v).toFixed(1)).join(" ");
  return (
    <div style={{ opacity: p }}>
      <svg width={width} height={height} style={{ overflow: "visible" }}>
        {[0, 5, 10, 15, 20].map((v) => (
          <g key={v}>
            <line x1={64} x2={width - 60} y1={Y(v)} y2={Y(v)} stroke={C.panelLine} strokeDasharray={v === 0 ? "" : "3 7"} />
            <text x={26} y={Y(v) + 4} fill={C.inkFaint} fontFamily="monospace" fontSize={12}>{v}</text>
          </g>
        ))}
        <path d={d} fill="none" stroke={C.amber} strokeWidth={2.2} />
        {norm.map((v, i) => (
          <g key={i}>
            <circle cx={X(i)} cy={Y(v)} r={5} fill={C.panel} stroke={C.amber} strokeWidth={2} />
            <text x={X(i)} y={height - 22} textAnchor="middle" fill={C.inkFaint} fontFamily="monospace" fontSize={12}>{lam[i]}</text>
          </g>
        ))}
      </svg>
      <div style={{ fontFamily: FONT.mono, fontSize: FT.micro, color: C.inkFaint }}>
        ‖W‖ 随惩罚系数 λ 单调不增；λ = 1000 时只剩 0.84。
      </div>
    </div>
  );
};

/* ---------- 少样本协议 ---------- */

export const ShotDiagram: React.FC<{ width?: number; at?: number }> = ({ width = 980, at = 0 }) => {
  const f = useCurrentFrame();
  const p = at > 0 ? pct(f, at, at + 26) : 1;
  const total = 1369;
  const X = (i: number) => (i / total) * width;
  return (
    <div style={{ opacity: p, width }}>
      <div style={{ position: "relative", height: 58 }}>
        <div style={{ position: "absolute", left: 0, width: X(960), top: 8, height: 30, background: C.cyan, opacity: 0.8 }}>
          <div style={{ position: "absolute", left: 8, top: 6, fontFamily: FONT.mono, fontSize: 12, color: "#06121a" }}>训练池 960</div>
        </div>
        <div style={{ position: "absolute", left: X(960), width: X(136), top: 8, height: 30, background: C.amber, opacity: 0.85 }}>
          <div style={{ position: "absolute", left: 6, top: 6, fontFamily: FONT.mono, fontSize: 11, color: "#06121a" }}>验证 136</div>
        </div>
        <div style={{ position: "absolute", left: X(1096), width: X(273), top: 8, height: 30, background: C.violet, opacity: 0.85 }}>
          <div style={{ position: "absolute", left: 8, top: 6, fontFamily: FONT.mono, fontSize: 12, color: "#06121a" }}>测试 273</div>
        </div>
      </div>
      <div style={{ fontFamily: FONT.mono, fontSize: FT.micro, color: C.inkFaint }}>
        支持集只从训练池抽：k = 0 / 5 / 10 / 100，重复 5 次，测试块逐位相同
      </div>
    </div>
  );
};

/* ---------- 图例 ---------- */

export const MiniLegend: React.FC<{ color: string; children: React.ReactNode }> = ({ color, children }) => (
  <span style={{ display: "inline-flex", alignItems: "center", marginRight: 22, fontFamily: FONT.mono, fontSize: FT.micro, color: C.inkFaint }}>
    <span style={{ width: 10, height: 10, borderRadius: 2, background: color, marginRight: 8 }} />{children}
  </span>
);
