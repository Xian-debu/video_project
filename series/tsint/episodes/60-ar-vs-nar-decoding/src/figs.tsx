import React from "react";
import { useCurrentFrame } from "remotion";
import { C, FONT, FT } from "../design/tokens";
import { M, fmt2, fmt4, pct } from "./shared";

export const MiniLegend: React.FC<{ color: string; children: React.ReactNode; dash?: boolean }> = ({ color, children, dash }) => (
  <span style={{ display: "inline-flex", alignItems: "center", gap: 8, fontFamily: FONT.mono, fontSize: FT.meta, color: C.inkDim }}>
    <span style={{ width: 22, height: 0, borderTop: (dash ? "2px dashed " : "2px solid ") + color, display: "inline-block" }} />
    {children}
  </span>
);

/* ---------- 两条路：AR 递推 / NAR 一次 ---------- */

export const TwoPaths: React.FC<{ width?: number; height?: number; at?: number }> = ({ width = 1020, height = 330, at = 0 }) => {
  const f = useCurrentFrame();
  const p = at > 0 ? pct(f, at, at + 26) : 1;
  const box = (x: number, y: number, w: number, h: number, label: string, color: string) => (
    <g key={label + x}>
      <rect x={x} y={y} width={w} height={h} rx={8} fill="rgba(21,30,43,0.95)" stroke={color} strokeOpacity={0.9} />
      <text x={x + w / 2} y={y + h / 2 + 5} textAnchor="middle" fontFamily={FONT.mono} fontSize={FT.meta} fill={color}>{label}</text>
    </g>
  );
  const arrow = (x1: number, y1: number, x2: number, y2: number, color: string) => (
    <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={1.6} markerEnd="url(#arrowhead)" />
  );
  return (
    <div style={{ opacity: p }}>
      <svg width={width} height={height} style={{ overflow: "visible" }}>
        <defs>
          <marker id="arrowhead" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto">
            <path d="M0,0 L10,5 L0,10 z" fill={C.inkFaint} />
          </marker>
        </defs>
        <text x={0} y={18} fontFamily={FONT.mono} fontSize={FT.meta} fill={C.cyan}>自回归 · 20 次前向</text>
        {box(0, 46, 150, 56, "窗口 w", C.cyan)}
        {box(190, 46, 126, 56, "头 → 1 点", C.cyan)}
        {box(356, 46, 110, 56, "接回末尾", C.cyan)}
        {box(506, 46, 130, 56, "下一个 w", C.cyan)}
        {arrow(150, 74, 186, 74, C.cyan)}
        {arrow(316, 74, 352, 74, C.cyan)}
        {arrow(466, 74, 502, 74, C.cyan)}
        <path d={"M571,102 C571,188 75,188 75,110"} fill="none" stroke={C.coral} strokeWidth={1.5} strokeDasharray="6 5" markerEnd="url(#arrowhead)" />
        <text x={210} y={186} fontFamily={FONT.mono} fontSize={FT.micro} fill={C.coral}>回灌：自己的预测成为下一步的输入</text>
        <text x={660} y={78} fontFamily={FONT.mono} fontSize={FT.body} fill={C.inkFaint}>每一步复制 512 点</text>
        <text x={660} y={110} fontFamily={FONT.mono} fontSize={FT.meta} fill={C.inkDim}>窗口整体左移</text>
        <line x1={0} y1={224} x2={width} y2={224} stroke={C.panelLine} />
        <text x={0} y={258} fontFamily={FONT.mono} fontSize={FT.meta} fill={C.violet}>非自回归 · 1 次前向</text>
        {box(0, 282, 150, 52, "窗口 w", C.violet)}
        {box(190, 282, 150, 52, "表示 64 维", C.violet)}
        {box(380, 282, 180, 52, "矩阵 20 × 66", C.violet)}
        <text x={600} y={314} fontFamily={FONT.mono} fontSize={FT.lead} fill={C.violet}>20 点同时</text>
        {arrow(150, 308, 186, 308, C.violet)}
        {arrow(340, 308, 376, 308, C.violet)}
        {arrow(560, 308, 596, 308, C.violet)}
      </svg>
    </div>
  );
};

/* ---------- 回灌：窗口推进 ---------- */

export const RolloutDiagram: React.FC<{ width?: number; height?: number; at?: number; steps?: number }> = ({
  width = 1000, height = 236, at = 0, steps = 3,
}) => {
  const f = useCurrentFrame();
  const p = at > 0 ? pct(f, at, at + 24) : 1;
  const winW = 132;
  const gap = 34;
  const ys = 54;
  const rows = Array.from({ length: steps });
  return (
    <div style={{ opacity: p }}>
      <svg width={width} height={height} style={{ overflow: "visible" }}>
        <defs>
          <marker id="arrow2" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto">
            <path d="M0,0 L10,5 L0,10 z" fill={C.inkFaint} />
          </marker>
        </defs>
        {rows.map((_, i) => {
          const x = 8 + i * (winW + gap);
          return (
            <g key={i}>
              {Array.from({ length: 14 }).map((_, k) => (
                <rect key={k} x={x + k * (winW / 14)} y={ys} width={winW / 14 - 2} height={30}
                  fill={i === 0 && k < 2 ? "rgba(251,113,133,0.20)" : "rgba(94,234,212,0.13)"}
                  stroke={i === 0 && k < 2 ? C.coral : "rgba(94,234,212,0.45)"} strokeWidth={1} />
              ))}
              {i === 0 ? <text x={x + 6} y={ys - 12} fontFamily={FONT.mono} fontSize={FT.micro} fill={C.coral}>丢掉</text> : null}
              <circle cx={x + winW + 11} cy={ys + 15} r={5} fill={C.cyan} />
              <text x={x + winW + 22} y={ys + 20} fontFamily={FONT.mono} fontSize={FT.micro} fill={C.cyan}>x{i + 1}</text>
              {i < steps - 1 ? (
                <line x1={x + winW + 46} y1={ys + 15} x2={x + winW + gap - 8} y2={ys + 15} stroke={C.inkFaint} strokeWidth={1.4} markerEnd="url(#arrow2)" />
              ) : null}
            </g>
          );
        })}
        <text x={8 + steps * (winW + gap) + 6} y={ys + 20} fontFamily={FONT.mono} fontSize={FT.lead} fill={C.inkFaint}>… 第 20 步</text>
        <text x={8} y={ys + 92} fontFamily={FONT.mono} fontSize={FT.meta} fill={C.inkFaint}>512 点定长窗口，每一步左移一格；被丢掉的点不再参与</text>
        <text x={8} y={ys + 130} fontFamily={FONT.mono} fontSize={FT.meta} fill={C.coral}>第 i 步的误差进入第 i+1 步的输入</text>
      </svg>
    </div>
  );
};

/* ---------- 参数账 ---------- */

export const ParamCompare: React.FC<{ width?: number; height?: number; at?: number }> = ({ width = 920, height = 230, at = 0 }) => {
  const f = useCurrentFrame();
  const p = at > 0 ? pct(f, at, at + 24) : 1;
  const rows = [
    { label: "编码器 512-64-512", value: M.params.enc, color: C.cyan, text: "66,113" },
    { label: "AR 单步头", value: M.params.arHead, color: C.coral, text: "66" },
    { label: "NAR 头 20 × 66", value: M.params.narHead, color: C.violet, text: "1,320" },
  ];
  const max = M.params.enc;
  return (
    <div style={{ opacity: p, width }}>
      {rows.map((r) => (
        <div key={r.label} style={{ display: "flex", alignItems: "center", height: 58 }}>
          <div style={{ width: 250, fontFamily: FONT.mono, fontSize: FT.meta, color: C.inkDim }}>{r.label}</div>
          <div style={{ width: 430, height: 16, background: C.panelLine, borderRadius: 4, position: "relative" }}>
            <div style={{ position: "absolute", left: 0, top: 0, height: 16, borderRadius: 4, background: r.color, opacity: 0.9,
              width: Math.max(3, (r.value / max) * 430) }} />
          </div>
          <div style={{ marginLeft: 18, fontFamily: FONT.mono, fontSize: FT.lead, color: r.color }}>{r.text}</div>
        </div>
      ))}
      <div style={{ fontFamily: FONT.mono, fontSize: FT.micro, color: C.inkFaint, marginTop: 6 }}>
        计划书写 NAR 头 1,300；偏置并入最后一列后是 (64+1+1) × 20
      </div>
    </div>
  );
};

/* ---------- 66 × 20 网格 ---------- */

export const NarColumns: React.FC<{ width?: number; height?: number; at?: number }> = ({ width = 760, height = 300, at = 0 }) => {
  const f = useCurrentFrame();
  const p = at > 0 ? pct(f, at, at + 26) : 1;
  const cols = 66;
  const rows = 20;
  const cw = (width - 60) / cols;
  const ch = (height - 90) / rows;
  return (
    <div style={{ opacity: p }}>
      <svg width={width} height={height}>
        {Array.from({ length: rows }).map((_, r) =>
          Array.from({ length: cols }).map((__, c) => (
            <rect key={r + "-" + c} x={44 + c * cw} y={16 + r * ch} width={Math.max(1.5, cw - 1.2)} height={Math.max(1.5, ch - 1.2)}
              fill={c === cols - 1 ? "rgba(251,113,133,0.55)" : "rgba(167,139,250,0.30)"} />
          )),
        )}
        <text x={44} y={height - 46} fontFamily={FONT.mono} fontSize={FT.meta} fill={C.inkFaint}>65 列权重 + 1 列偏置</text>
        <text x={44} y={height - 18} fontFamily={FONT.mono} fontSize={FT.lead} fill={C.violet}>20 × 66 = 1,320</text>
        <text x={width - 10} y={height - 18} textAnchor="end" fontFamily={FONT.mono} fontSize={FT.micro} fill={C.coral}>最后一列 = 偏置</text>
      </svg>
    </div>
  );
};

/* ---------- 主曲线：误差随地平线 ---------- */

export const ErrorHorizon: React.FC<{ width?: number; height?: number; at?: number; legend?: boolean; markCross?: boolean }> = ({
  width = 1120, height = 430, at = 0, legend = true, markCross = true,
}) => {
  const f = useCurrentFrame();
  const p = at > 0 ? pct(f, at, at + 34) : 1;
  const ml = 76;
  const mr = 130;
  const mt = 22;
  const mb = 52;
  const lo = 0.95;
  const hi = 1.72;
  const X = (k: number) => ml + ((k - 1) / 19) * (width - ml - mr);
  const Y = (v: number) => height - mb - ((v - lo) / (hi - lo)) * (height - mt - mb);
  const path = (key: "arRel" | "narRel" | "persistMae") => M.curve.map((c, i) => (i === 0 ? "M" : "L") + X(c.f).toFixed(1) + " " + Y(c[key]).toFixed(1)).join(" ");
  const ticks = [1.0, 1.2, 1.4, 1.6];
  const crossX = X(M.crossing);
  return (
    <div style={{ opacity: p }}>
      <svg width={width} height={height} style={{ overflow: "visible" }}>
        {ticks.map((t) => (
          <g key={t}>
            <line x1={ml} x2={width - mr} y1={Y(t)} y2={Y(t)} stroke={C.panelLine} strokeWidth={1} strokeDasharray="4 6" />
            <text x={ml - 14} y={Y(t) + 5} textAnchor="end" fontFamily={FONT.mono} fontSize={FT.micro} fill={C.inkFaint}>{t.toFixed(1)}</text>
          </g>
        ))}
        {[1, 4, 8, 12, 16, 20].map((k) => (
          <text key={k} x={X(k)} y={height - mb + 26} textAnchor="middle" fontFamily={FONT.mono} fontSize={FT.micro} fill={C.inkFaint}>F={k}</text>
        ))}
        {markCross ? (
          <g>
            <line x1={crossX} x2={crossX} y1={mt} y2={height - mb} stroke={C.amber} strokeWidth={1.2} strokeDasharray="5 5" />
            <text x={crossX + 10} y={mt + 16} fontFamily={FONT.mono} fontSize={FT.meta} fill={C.amber}>F={M.crossing} 交叉</text>
          </g>
        ) : null}
        <line x1={X(1)} x2={X(20)} y1={Y(1)} y2={Y(1)} stroke={C.coral} strokeWidth={1.8} strokeDasharray="7 6" />
        <path d={path("arRel")} fill="none" stroke={C.cyan} strokeWidth={2.6} />
        <path d={path("narRel")} fill="none" stroke={C.violet} strokeWidth={2.6} />
        <text x={X(20) + 12} y={Y(M.curve[19].arRel) + 6} fontFamily={FONT.mono} fontSize={FT.meta} fill={C.cyan}>AR {fmt4(M.curve[19].arRel)}</text>
        <text x={X(20) + 12} y={Y(M.curve[19].narRel) + 6} fontFamily={FONT.mono} fontSize={FT.meta} fill={C.violet}>NAR {fmt4(M.curve[19].narRel)}</text>
        <line x1={ml} x2={width - mr} y1={height - mb} y2={height - mb} stroke={C.panelLine} />
        <line x1={ml} x2={ml} y1={mt} y2={height - mb} stroke={C.panelLine} />
      </svg>
      {legend ? (
        <div style={{ display: "flex", gap: 26, marginTop: 2 }}>
          <MiniLegend color={C.cyan}>自回归 AR</MiniLegend>
          <MiniLegend color={C.violet}>非自回归 NAR</MiniLegend>
          <MiniLegend color={C.coral} dash>持久化基线 = 1.0</MiniLegend>
        </div>
      ) : null}
    </div>
  );
};

/* ---------- 相对误差 vs 基线 ---------- */

export const RelErrorBars: React.FC<{ width?: number; height?: number; at?: number }> = ({ width = 900, height = 210, at = 0 }) => {
  const f = useCurrentFrame();
  const p = at > 0 ? pct(f, at, at + 22) : 1;
  const max = 1.8;
  const bw = width - 340;
  const rows = [
    { label: "持久化基线", value: 1.0, color: C.coral, text: "1.0000" },
    { label: "自回归 F=20", value: M.ar.rel20, color: C.cyan, text: fmt4(M.ar.rel20) },
    { label: "非自回归 F=20", value: M.nar.rel20, color: C.violet, text: fmt4(M.nar.rel20) },
  ];
  return (
    <div style={{ opacity: p, width }}>
      {rows.map((r) => (
        <div key={r.label} style={{ display: "flex", alignItems: "center", height: 56 }}>
          <div style={{ width: 230, fontFamily: FONT.mono, fontSize: FT.meta, color: C.inkDim }}>{r.label}</div>
          <div style={{ width: bw, height: 16, background: C.panelLine, borderRadius: 4, position: "relative" }}>
            <div style={{ position: "absolute", left: 0, top: 0, height: 16, borderRadius: 4, background: r.color, opacity: 0.9, width: (r.value / max) * bw }} />
            <div style={{ position: "absolute", left: (1.0 / max) * bw, top: -8, width: 2, height: 32, background: C.coral }} />
          </div>
          <div style={{ marginLeft: 16, width: 160, flexShrink: 0, whiteSpace: "nowrap", fontFamily: FONT.mono, fontSize: FT.lead, color: r.color }}>{r.text}</div>
        </div>
      ))}
      <div style={{ fontFamily: FONT.mono, fontSize: FT.micro, color: C.inkFaint }}>竖线 = 基线 1.0；大于一说明还不如「什么都不变」</div>
    </div>
  );
};

/* ---------- 放大倍数：√F 预期 vs 实测 ---------- */

export const SqrtAmplification: React.FC<{ width?: number; height?: number; at?: number }> = ({ width = 780, height = 240, at = 0 }) => {
  const f = useCurrentFrame();
  const p = at > 0 ? pct(f, at, at + 22) : 1;
  const arAmp = M.ar.rel20 / M.ar.rel1;
  const narAmp = M.nar.rel20 / M.nar.rel1;
  const max = 4.8;
  const bw = width - 340;
  const rows = [
    { label: "独立误差 · √20", value: Math.sqrt(20), color: C.amber, text: "4.47×", dim: true },
    { label: "AR 实测", value: arAmp, color: C.cyan, text: fmt2(arAmp) + "×" },
    { label: "NAR 实测", value: narAmp, color: C.violet, text: fmt2(narAmp) + "×" },
  ];
  return (
    <div style={{ opacity: p, width }}>
      {rows.map((r) => (
        <div key={r.label} style={{ display: "flex", alignItems: "center", height: 56 }}>
          <div style={{ width: 230, fontFamily: FONT.mono, fontSize: FT.meta, color: r.dim ? C.inkFaint : C.inkDim }}>{r.label}</div>
          <div style={{ width: bw, height: 16, background: C.panelLine, borderRadius: 4 }}>
            <div style={{ height: 16, borderRadius: 4, background: r.color, opacity: r.dim ? 0.5 : 0.9, width: (r.value / max) * bw }} />
          </div>
          <div style={{ marginLeft: 16, width: 160, flexShrink: 0, whiteSpace: "nowrap", fontFamily: FONT.mono, fontSize: FT.lead, color: r.color }}>{r.text}</div>
        </div>
      ))}
      <div style={{ fontFamily: FONT.mono, fontSize: FT.micro, color: C.inkFaint }}>F=20 相对 F=1 的误差倍数；实测远低于独立噪声的 √F</div>
    </div>
  );
};

/* ---------- 数据切分 ---------- */

export const SplitStrip: React.FC<{ width?: number; height?: number; at?: number }> = ({ width = 1000, height = 268, at = 0 }) => {
  const f = useCurrentFrame();
  const p = at > 0 ? pct(f, at, at + 26) : 1;
  const D = M.data;
  const barH = 34;
  const seriesW = width - 90;
  const segW = (D.segmentRows / D.seriesRows) * seriesW;
  const rowY = [54, 150, 226];
  return (
    <div style={{ opacity: p }}>
      <svg width={width} height={height}>
        <text x={0} y={22} fontFamily={FONT.mono} fontSize={FT.meta} fill={C.inkDim}>全集 {D.seriesRows.toLocaleString("en-US")} 行 · {D.firstDate} → {D.lastDate}</text>
        <rect x={10} y={rowY[0]} width={seriesW} height={barH} rx={5} fill="rgba(21,30,43,0.9)" stroke={C.panelLine} />
        <rect x={10 + (D.testStart / D.seriesRows) * seriesW} y={rowY[0] + 4} width={Math.max(6, segW)} height={barH - 8} rx={3} fill="rgba(251,113,133,0.35)" stroke={C.coral} />
        <text x={10 + (D.testStart / D.seriesRows) * seriesW - 8} y={rowY[0] + 24} textAnchor="end" fontFamily={FONT.mono} fontSize={FT.micro} fill={C.inkFaint}>第 {D.testStart} 行</text>
        <text x={0} y={rowY[1] - 10} fontFamily={FONT.mono} fontSize={FT.meta} fill={C.inkDim}>测试段 {D.segmentRows} 点 · {D.segmentStart} → {D.segmentEnd}</text>
        <rect x={10} y={rowY[1]} width={seriesW} height={barH} rx={5} fill="rgba(251,113,133,0.18)" stroke={C.coral} />
        {Array.from({ length: D.windows }).map((_, i) => (
          <rect key={i} x={10 + (i / D.windows) * seriesW} y={rowY[1] + 5} width={Math.max(1, seriesW / D.windows - 3)} height={barH - 10} fill="rgba(94,234,212,0.30)" />
        ))}
        <text x={seriesW + 16} y={rowY[1] + 24} fontFamily={FONT.mono} fontSize={FT.micro} fill={C.cyan}>{D.windows} 窗</text>
        <text x={0} y={rowY[2] - 10} fontFamily={FONT.mono} fontSize={FT.meta} fill={C.inkDim}>训练池 {D.preWindows.toLocaleString("en-US")} 窗（2020 年前）</text>
        <rect x={10} y={rowY[2]} width={seriesW * (D.trainN / D.preWindows)} height={barH} rx={5} fill="rgba(94,234,212,0.30)" stroke={C.cyan} />
        <rect x={10 + seriesW * (D.trainN / D.preWindows) + 3} y={rowY[2]} width={seriesW * (D.valN / D.preWindows) - 3} height={barH} rx={5} fill="rgba(251,191,36,0.28)" stroke={C.amber} />
        <text x={16} y={rowY[2] + 24} fontFamily={FONT.mono} fontSize={FT.micro} fill={C.ink}>训练 {D.trainN.toLocaleString("en-US")}</text>
        <text x={10 + seriesW * (D.trainN / D.preWindows) + 14} y={rowY[2] + 24} fontFamily={FONT.mono} fontSize={FT.micro} fill={C.ink}>验证 {D.valN.toLocaleString("en-US")}</text>
      </svg>
    </div>
  );
};

/* ---------- 耗时对比（对数刻度） ---------- */

export const TimingBars: React.FC<{ width?: number; height?: number; at?: number }> = ({ width = 920, height = 200, at = 0 }) => {
  const f = useCurrentFrame();
  const p = at > 0 ? pct(f, at, at + 24) : 1;
  const rows = [
    { label: "AR 20 步 × 197 窗", value: M.timing.arSeconds, color: C.cyan, text: fmt4(M.timing.arSeconds) + " s" },
    { label: "NAR 1 次 × 197 窗", value: M.timing.narSeconds, color: C.violet, text: fmt4(M.timing.narSeconds) + " s" },
  ];
  const bw = width - 470;
  const logW = (v: number) => Math.max(8, ((Math.log10(v) - Math.log10(0.005)) / (Math.log10(0.5) - Math.log10(0.005))) * bw);
  return (
    <div style={{ opacity: p, width }}>
      {rows.map((r) => (
        <div key={r.label} style={{ display: "flex", alignItems: "center", height: 62 }}>
          <div style={{ width: 250, fontFamily: FONT.mono, fontSize: FT.meta, color: C.inkDim }}>{r.label}</div>
          <div style={{ width: bw, height: 18, background: C.panelLine, borderRadius: 4 }}>
            <div style={{ height: 18, borderRadius: 4, background: r.color, opacity: 0.9, width: logW(r.value) }} />
          </div>
          <div style={{ marginLeft: 16, width: 160, flexShrink: 0, whiteSpace: "nowrap", fontFamily: FONT.mono, fontSize: FT.lead, color: r.color }}>{r.text}</div>
        </div>
      ))}
      <div style={{ fontFamily: FONT.mono, fontSize: FT.micro, color: C.inkFaint }}>
        对数刻度；比值 {fmt2(M.timing.ratio)}×，验收线 5×
      </div>
    </div>
  );
};

/* ---------- 曝光偏差 ---------- */

export const ExposureSplit: React.FC<{ width?: number; height?: number; at?: number }> = ({ width = 780, height = 300, at = 0 }) => {
  const f = useCurrentFrame();
  const p = at > 0 ? pct(f, at, at + 22) : 1;
  const base = height - 74;
  const maxV = 0.42;
  const h = (v: number) => (v / maxV) * (base - 40);
  const bars = [
    { label: "教师强制", sub: "训练口径", value: M.exposure.teacher, color: C.cyan, x: 120 },
    { label: "自由回灌", sub: "推理口径", value: M.exposure.free, color: C.coral, x: 380 },
  ];
  return (
    <div style={{ opacity: p }}>
      <svg width={width} height={height}>
        <line x1={40} x2={width - 20} y1={base} y2={base} stroke={C.panelLine} />
        {bars.map((b) => (
          <g key={b.label}>
            <rect x={b.x} y={base - h(b.value)} width={130} height={h(b.value)} fill={b.color} opacity={0.24} stroke={b.color} />
            <text x={b.x + 65} y={base - h(b.value) - 12} textAnchor="middle" fontFamily={FONT.mono} fontSize={FT.lead} fill={b.color}>{fmt4(b.value)}</text>
            <text x={b.x + 65} y={base + 26} textAnchor="middle" fontFamily={FONT.mono} fontSize={FT.meta} fill={C.inkDim}>{b.label}</text>
            <text x={b.x + 65} y={base + 48} textAnchor="middle" fontFamily={FONT.mono} fontSize={FT.micro} fill={C.inkFaint}>{b.sub}</text>
          </g>
        ))}
        <text x={584} y={118} fontFamily={FONT.mono} fontSize={FT.meta} fill={C.inkDim}>差 {fmt4(M.exposure.gap)}</text>
        <text x={584} y={148} fontFamily={FONT.mono} fontSize={FT.meta} fill={C.inkDim}>≈ {(M.exposure.free / M.exposure.teacher).toFixed(1)} 倍</text>
      </svg>
    </div>
  );
};

/* ---------- 直连消融 ---------- */

export const DirectLinkBars: React.FC<{ width?: number; height?: number; at?: number }> = ({ width = 860, height = 190, at = 0 }) => {
  const f = useCurrentFrame();
  const p = at > 0 ? pct(f, at, at + 22) : 1;
  const rows = [
    { label: "没有直连", value: 6.98, color: C.coral, text: "6.98×" },
    { label: "加窗口最后一点", value: M.ar.rel1, color: C.cyan, text: fmt4(M.ar.rel1) + "×" },
  ];
  const max = 7.6;
  const bw = width - 360;
  return (
    <div style={{ opacity: p, width }}>
      {rows.map((r) => (
        <div key={r.label} style={{ display: "flex", alignItems: "center", height: 54 }}>
          <div style={{ width: 260, fontFamily: FONT.mono, fontSize: FT.meta, color: C.inkDim }}>{r.label}</div>
          <div style={{ width: bw, height: 16, background: C.panelLine, borderRadius: 4, position: "relative" }}>
            <div style={{ height: 16, borderRadius: 4, background: r.color, opacity: 0.9, width: (r.value / max) * bw }} />
            <div style={{ position: "absolute", left: (1 / max) * bw, top: -8, width: 2, height: 32, background: C.coral }} />
          </div>
          <div style={{ marginLeft: 16, width: 160, flexShrink: 0, whiteSpace: "nowrap", fontFamily: FONT.mono, fontSize: FT.lead, color: r.color }}>{r.text}</div>
        </div>
      ))}
      <div style={{ fontFamily: FONT.mono, fontSize: FT.micro, color: C.inkFaint }}>F=1 时的相对误差；竖线 = 基线 1.0</div>
    </div>
  );
};

/* ---------- 单个窗口：真值 / AR / NAR ---------- */

export const TwentyStepPlot: React.FC<{ width?: number; height?: number; at?: number; legend?: boolean }> = ({ width = 1000, height = 300, at = 0, legend = true }) => {
  const f = useCurrentFrame();
  const p = at > 0 ? pct(f, at, at + 28) : 1;
  const t = M.example.truth20;
  const a = M.example.ar20;
  const n = M.example.nar20;
  const all = t.concat(a).concat(n);
  const lo = Math.min(...all) - 0.08;
  const hi = Math.max(...all) + 0.08;
  const X = (i: number) => 46 + (i / 19) * (width - 90);
  const Y = (v: number) => height - 40 - ((v - lo) / (hi - lo)) * (height - 78);
  const line = (arr: number[]) => arr.map((v, i) => (i === 0 ? "M" : "L") + X(i).toFixed(1) + " " + Y(v).toFixed(1)).join(" ");
  return (
    <div style={{ opacity: p }}>
      <svg width={width} height={height}>
        <line x1={40} x2={width - 20} y1={height - 40} y2={height - 40} stroke={C.panelLine} />
        <text x={40} y={height - 14} fontFamily={FONT.mono} fontSize={FT.micro} fill={C.inkFaint}>未来第 1 天 → 第 20 天</text>
        <path d={line(t)} fill="none" stroke={C.ink} strokeWidth={2.4} />
        <path d={line(a)} fill="none" stroke={C.cyan} strokeWidth={2.2} />
        <path d={line(n)} fill="none" stroke={C.violet} strokeWidth={2.2} />
      </svg>
      {legend ? (
        <div style={{ display: "flex", gap: 24 }}>
          <MiniLegend color={C.ink}>真实</MiniLegend>
          <MiniLegend color={C.cyan}>AR 回灌</MiniLegend>
          <MiniLegend color={C.violet}>NAR 一次</MiniLegend>
        </div>
      ) : null}
    </div>
  );
};
