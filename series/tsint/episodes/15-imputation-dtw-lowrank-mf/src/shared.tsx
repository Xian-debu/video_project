import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { C, FONT, FT, FT_T, G } from "../design/tokens";
import { ChapterBar, SceneShell } from "../design/Scene";
import { SCENES, FPS } from "./script";
import imputeJson from "../../data/tsint-15-imputation-dtw-lowrank-mf/impute.json";

/* 本片共用件：E15 的数据形状与通用零件。 */

export type Ep15Data = {
  meta: {
    episode: string;
    bookPages: string;
    tsBaseCommit: string;
    panelExportCommit: string;
    runAt: string;
    checks: { total: number; failed: number; data: number; struct: number; behavior: number };
    tests: { suites: number; asserts: number; dtwknn: number; lowrank: number; matrixfact: number };
  };
  data: {
    codes: number; days: number; rows: number; csvBytes: number;
    firstDate: string; lastDate: string; firstCode: string; lastCode: string;
  };
  masks: { total: number; n: number; blockCells: number; blockCols: number; blockIdx: number[] };
  random: { mean: number; knn: number; lowrank: number; mf: number };
  block: {
    mean: number; knn: number; lowrank: number; mf: number;
    blockcol_knn: number; blockcol_lowrank: number; blockcol_mf: number;
    blockcol_corr_knn: number; blockcol_corr_lowrank: number;
    randomcol_lowrank: number;
    crash_days: number; crash_mean_ret: number; crash_rms_truth: number;
    crash_rmse_knn: number; crash_rmse_lowrank: number; crash_rmse_mf: number;
  };
  synthetic: {
    rank3_err: number; rank3_knn_rmse: number; rank2_err: number;
    rank3_t: number; rank3_n: number; rank2_t: number; rank2_n: number;
  };
  spectrum: { s: number[]; cum: number[]; rank5_share: number; rank10_share: number; rank20_share: number; sigma1: number };
  panel: {
    rows: number; cols: number; rowIdx: number[]; colIdx: number[];
    dates: string[]; codes: string[]; z: number[][]; blockCols: number[];
  };
  column: { col: number; code: string; t: number; truth: number[]; knn: number[]; lowrank: number[]; mf: number[]; crashDays: number[] };
  neighbours: {
    col: number; colCode: string; day: number; date: string; truth: number; pred: number;
    items: { rank: number; code: string; col: number; dist: number; w: number; value: number }[];
  };
  dtw: { a: number[]; b: number[]; dist: number; triangle: { left: number; right: number } };
};

export const M = imputeJson as unknown as Ep15Data;
export const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
export const pct = (f: number, a: number, b: number) => interpolate(f, [a, b], [0, 1], clamp);
export const PAD = G.pad;
export const CW = 1920 - PAD * 2;

export const fmtInt = (v: number) => Math.round(v).toLocaleString("en-US");
export const fmtP = (v: number, d = 2) => (v * 100).toFixed(d) + "%";
export const fmtF = (v: number, d = 4) => v.toFixed(d);
export const fmtE = (v: number, d = 2) => {
  if (Math.abs(v) < 1e-300) return "0";
  const e = Math.floor(Math.log10(Math.abs(v)));
  const m = v / Math.pow(10, e);
  return m.toFixed(d) + "e" + String(e).replace("-", "−");
};
export const fmtM = (v: number, d = 2) => v.toFixed(d);

export const lf = (id: string, k: number): number => {
  const s = SCENES.find((x) => x.id === id);
  if (!s) return 0;
  return Math.max(0, Math.round(s.dur * k * FPS));
};

export const sceneFrames = (id: string): number => {
  const s = SCENES.find((x) => x.id === id);
  return s ? Math.round(s.dur * FPS) : 900;
};

export const mix = (a: string, b: string, t: number): string => {
  const pa = [1, 3, 5].map((i) => parseInt(a.slice(i, i + 2), 16));
  const pb = [1, 3, 5].map((i) => parseInt(b.slice(i, i + 2), 16));
  const c = pa.map((v, i) => Math.round(v + (pb[i] - v) * t));
  return "#" + c.map((v) => v.toString(16).padStart(2, "0")).join("");
};

export const Head: React.FC<{ kicker: string; title: string; goal?: string }> = ({ kicker, title, goal }) => (
  <div style={{ position: "absolute", left: PAD, top: 88, width: CW }}>
    <div style={{ fontFamily: FONT.mono, fontSize: FT.label, letterSpacing: FT_T.label, color: C.cyan }}>{kicker}</div>
    <div style={{ fontFamily: FONT.serif, fontSize: FT.h1, color: C.ink, marginTop: 10, lineHeight: 1.15 }}>{title}</div>
    {goal ? <div style={{ fontFamily: FONT.sans, fontSize: FT.label, color: C.inkFaint, marginTop: 10 }}>{goal}</div> : null}
  </div>
);

export const Card: React.FC<{ label?: string; accent?: string; children: React.ReactNode; style?: React.CSSProperties; pad?: number }> = ({
  label, accent = C.panelLine, children, style, pad = 24,
}) => (
  <div style={{ background: C.panel, border: "1px solid " + C.panelLine, borderTop: "2px solid " + accent, borderRadius: 14, padding: pad, boxSizing: "border-box", ...style }}>
    {label ? <div style={{ fontFamily: FONT.mono, fontSize: FT.meta, letterSpacing: FT_T.meta, color: C.inkFaint, marginBottom: 10 }}>{label}</div> : null}
    {children}
  </div>
);

export const Mono: React.FC<{ children: React.ReactNode; size?: number; color?: string; style?: React.CSSProperties }> = ({
  children, size = FT.mono, color = C.ink, style,
}) => <span style={{ fontFamily: FONT.mono, fontSize: size, color, fontVariantNumeric: "tabular-nums", ...style }}>{children}</span>;

export const Body: React.FC<{ children: React.ReactNode; color?: string; size?: number; style?: React.CSSProperties }> = ({
  children, color = C.inkDim, size = FT.body, style,
}) => <div style={{ fontFamily: FONT.sans, fontSize: size, color, lineHeight: 1.62, ...style }}>{children}</div>;

export const Num: React.FC<{ value: number; digits?: number; size?: number; color?: string }> = ({ value, digits, size = FT.num, color = C.ink }) => (
  <span style={{ fontFamily: FONT.mono, fontSize: size, color, fontVariantNumeric: "tabular-nums", letterSpacing: -0.5 }}>
    {digits === undefined ? String(value) : value.toFixed(digits)}
  </span>
);

export const K: React.FC<{ children: React.ReactNode; color?: string; style?: React.CSSProperties }> = ({ children, color = C.inkFaint, style }) => (
  <span style={{ fontFamily: FONT.mono, fontSize: FT.micro, letterSpacing: FT_T.micro, color, ...style }}>{children}</span>
);

export const Chip: React.FC<{ children: React.ReactNode; color?: string; style?: React.CSSProperties }> = ({ children, color = C.coral, style }) => (
  <span style={{ display: "inline-block", padding: "2px 8px", borderRadius: 6, border: "1px solid " + color, color, fontFamily: FONT.mono, fontSize: FT.micro, ...style }}>{children}</span>
);

export const Stat: React.FC<{
  label: string; value: React.ReactNode; sub?: React.ReactNode; accent?: string;
  style?: React.CSSProperties; valueSize?: number; valueColor?: string;
}> = ({ label, value, sub, accent = C.cyan, style, valueSize = FT.num, valueColor = C.ink }) => (
  <Card label={label} accent={accent} pad={20} style={style}>
    <div style={{ fontFamily: FONT.mono, fontSize: valueSize, color: valueColor, lineHeight: 1.1, letterSpacing: -0.5, fontVariantNumeric: "tabular-nums" }}>{value}</div>
    {sub ? <div style={{ fontFamily: FONT.sans, fontSize: FT.meta, color: C.inkFaint, marginTop: 10, lineHeight: 1.45 }}>{sub}</div> : null}
  </Card>
);

/** 场景内分页：按场景时长的分数硬切（页间不留交叉淡变帧，Lint 规则 overlap 要求画面内只有一页文字）。 */
export const Pages: React.FC<{ id: string; at: number[]; children: React.ReactNode[] }> = ({ id, at, children }) => {
  const f = useCurrentFrame();
  const dur = Math.max(1, sceneFrames(id));
  return (
    <>
      {children.map((child, i) => {
        const a = (at[i] ?? 0) * dur;
        const b = (i + 1 < at.length ? at[i + 1] : 1) * dur;
        if (f < a || f >= b) return null;
        return <div key={i} style={{ position: "absolute", inset: 0 }}>{child}</div>;
      })}
    </>
  );
};

export type LineSeries = { values: (number | null)[]; color: string; name: string; dash?: boolean };

/** 通用折线图：多序列、共用 y 域；可截取窗口、画参考线。 */
export const LinePlot: React.FC<{
  series: LineSeries[]; width: number; height: number; at?: number;
  from?: number; to?: number; title?: string; padL?: number; padB?: number; padT?: number;
  zeroLine?: boolean; legend?: boolean; yFmt?: (v: number) => string; stretch?: number;
  hlines?: { v: number; color: string; label?: string }[];
}> = ({ series, width, height, at = 0, from, to, title, padL = 92, padB = 54, padT = 40, zeroLine = false, legend = true, yFmt = (v) => v.toFixed(0), stretch = 1, hlines = [] }) => {
  const f = useCurrentFrame();
  const p = at > 0 ? pct(f, at, at + 20) : 1;
  const padR = 26;
  const i0 = from ?? 0;
  const i1 = to ?? Math.max(...series.map((s) => s.values.length - 1));
  const n = i1 - i0 + 1;
  const vals: number[] = [];
  for (const s of series) for (let i = i0; i <= Math.min(i1, s.values.length - 1); i++) {
    const v = s.values[i];
    if (v !== null && isFinite(v)) vals.push(v);
  }
  const rawLo = Math.min(...vals);
  const rawHi = Math.max(...vals);
  const dy = (rawHi - rawLo) * 0.08 || 1;
  const y0 = rawLo - dy, y1 = rawHi + dy;
  const sx = (i: number) => padL + (i / Math.max(1, n - 1)) * (width - padL - padR);
  const sy = (v: number) => height - padB - ((v - y0) / (y1 - y0)) * (height - padT - padB) * stretch;
  const pathOf = (arr: (number | null)[]) => {
    const pts: string[] = [];
    let started = false;
    for (let i = i0; i <= Math.min(i1, arr.length - 1); i++) {
      const v = arr[i];
      if (v === null || !isFinite(v)) continue;
      pts.push((started ? "L" : "M") + sx(i - i0).toFixed(1) + "," + sy(v).toFixed(1));
      started = true;
    }
    return pts.join(" ");
  };
  const yTicks = [0, 0.5, 1].map((t) => y0 + (y1 - y0) * t);
  return (
    <svg width={width} height={height} style={{ display: "block" }}>
      {yTicks.map((v) => (
        <g key={"y" + v}>
          <line x1={padL} y1={sy(v)} x2={width - padR} y2={sy(v)} stroke={C.panelLine} strokeWidth={1} />
          <text x={padL - 12} y={sy(v) + 4} textAnchor="end" fill={C.inkFaint} fontFamily={FONT.mono} fontSize={FT.micro}>{yFmt(v)}</text>
        </g>
      ))}
      {zeroLine && y0 < 0 && y1 > 0 ? <line x1={padL} y1={sy(0)} x2={width - padR} y2={sy(0)} stroke={C.inkFaint} strokeDasharray="4 4" strokeWidth={1} /> : null}
      {hlines.filter((h) => h.v >= y0 && h.v <= y1).map((h) => (
        <g key={"h" + h.v + h.color}>
          <line x1={padL} y1={sy(h.v)} x2={width - padR} y2={sy(h.v)} stroke={h.color} strokeDasharray="5 4" strokeWidth={1.2} opacity={0.75} />
          {h.label ? <text x={width - padR} y={sy(h.v) - 6} textAnchor="end" fill={h.color} fontFamily={FONT.mono} fontSize={FT.micro}>{h.label}</text> : null}
        </g>
      ))}
      {title ? <text x={padL} y={22} fill={C.inkFaint} fontFamily={FONT.mono} fontSize={FT.micro}>{title}</text> : null}
      {series.map((s) => (
        <path key={s.name} d={pathOf(s.values)} fill="none" stroke={s.color} strokeWidth={s.dash ? 1.8 : 2.2} strokeDasharray={s.dash ? "6 5" : undefined} opacity={p} />
      ))}
      {legend ? series.map((s, i) => (
        <g key={"lg" + s.name}>
          <line x1={padL + i * 250} y1={height - 18} x2={padL + i * 250 + 26} y2={height - 18} stroke={s.color} strokeWidth={2.4} strokeDasharray={s.dash ? "6 5" : undefined} />
          <text x={padL + i * 250 + 34} y={height - 14} fill={C.inkFaint} fontFamily={FONT.sans} fontSize={FT.meta}>{s.name}</text>
        </g>
      )) : null}
    </svg>
  );
};

export const Bars: React.FC<{
  items: { label: string; value: number; text: string; color?: string; dim?: boolean }[];
  width: number; max?: number; rowH?: number; at?: number; unit?: string;
}> = ({ items, width, max, rowH = 62, at = 0, unit }) => {
  const f = useCurrentFrame();
  const hi = max ?? Math.max(...items.map((i) => i.value));
  return (
    <div style={{ width }}>
      {items.map((it, i) => {
        const p = at > 0 ? pct(f, at + i * 5, at + 16 + i * 5) : 1;
        const w = Math.max(2, (it.value / hi) * (width - 250));
        return (
          <div key={it.label} style={{ display: "flex", alignItems: "center", height: rowH, opacity: p }}>
            <div style={{ width: 132, fontFamily: FONT.mono, fontSize: FT.meta, color: it.dim ? C.inkFaint : C.inkDim }}>{it.label}</div>
            <div style={{ width: width - 250, height: 14, background: C.panelLine, borderRadius: 4, position: "relative" }}>
              <div style={{ position: "absolute", left: 0, top: 0, height: 14, width: w, borderRadius: 4, background: it.color ?? C.cyan, opacity: it.dim ? 0.45 : 0.92 }} />
            </div>
            <div style={{ width: 118, textAlign: "right", fontFamily: FONT.mono, fontSize: FT.meta, color: it.color ?? C.ink }}>{it.text}</div>
          </div>
        );
      })}
      {unit ? <div style={{ fontFamily: FONT.mono, fontSize: FT.micro, color: C.inkFaint, marginTop: 4 }}>{unit}</div> : null}
    </div>
  );
};

export type CodeLine = { t: string; dim?: boolean; hi?: boolean };
export const CodeBlock: React.FC<{ title?: string; lines: CodeLine[]; width: number; size?: number; at?: number }> = ({ title, lines, width, size = FT.code, at = 0 }) => {
  const f = useCurrentFrame();
  const p = at > 0 ? pct(f, at, at + 16) : 1;
  return (
    <div style={{ width, background: "#101823", border: "1px solid " + C.panelLine, borderRadius: 10, padding: "14px 18px", boxSizing: "border-box" }}>
      {title ? <div style={{ fontFamily: FONT.mono, fontSize: FT.micro, letterSpacing: FT_T.micro, color: C.cyan, marginBottom: 8 }}>{title}</div> : null}
      {lines.map((l, i) => (
        <div key={i} style={{ fontFamily: FONT.mono, fontSize: size, lineHeight: 1.62, color: l.hi ? C.cyan : l.dim ? C.inkFaint : C.inkDim, whiteSpace: "pre", opacity: p }}>
          {l.t}
        </div>
      ))}
    </div>
  );
};

/** 场景壳：统一章节条与进度。 */
export const SceneHead: React.FC<{ id: string }> = ({ id }) => {
  const s = SCENES.find((x) => x.id === id);
  if (!s) return null;
  return <Head kicker={s.kicker} title={s.title} goal={s.goal} />;
};

export const Scene: React.FC<{ id: string; children: React.ReactNode }> = ({ id, children }) => {
  const f = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const i = SCENES.findIndex((s) => s.id === id);
  const s = SCENES[Math.max(0, i)];
  const dur = Math.max(1, durationInFrames);
  return (
    <SceneShell>
      <ChapterBar chapter={s.chapter} index={i + 1} total={SCENES.length} progress={Math.min(1, f / dur)} />
      {children}
    </SceneShell>
  );
};

/** 公式块：衬线体，用于把书里的式子原样搬上屏。 */
export const Formula: React.FC<{ children: React.ReactNode; size?: number; color?: string; note?: React.ReactNode; style?: React.CSSProperties }> = ({
  children, size = 64, color = C.ink, note, style,
}) => (
  <div style={style}>
    <div style={{ fontFamily: FONT.serif, fontSize: size, color, lineHeight: 1.28 }}>{children}</div>
    {note ? <div style={{ fontFamily: FONT.mono, fontSize: FT.micro, color: C.inkFaint, marginTop: 10 }}>{note}</div> : null}
  </div>
);

/** 通过 / 失败标记。 */
export const Verdict: React.FC<{ ok: boolean; label?: string }> = ({ ok, label }) => (
  <span style={{
    display: "inline-block", padding: "2px 10px", borderRadius: 6,
    border: "1px solid " + (ok ? C.cyan : C.coral), color: ok ? C.cyan : C.coral,
    fontFamily: FONT.mono, fontSize: FT.micro,
  }}>{label ?? (ok ? "通过" : "失败")}</span>
);

/** 一条「名字 · 数值 · 备注」的行。 */
export const Row: React.FC<{ name: React.ReactNode; value: React.ReactNode; note?: React.ReactNode; color?: string; width?: number }> = ({
  name, value, note, color = C.ink, width = 1720,
}) => (
  <div style={{ display: "flex", alignItems: "baseline", width: "100%", maxWidth: width, marginTop: 10 }}>
    <div style={{ flex: "0 0 30%", fontFamily: FONT.sans, fontSize: FT.body, color: C.inkDim }}>{name}</div>
    <div style={{ flex: "0 1 auto", minWidth: "22%", maxWidth: "44%", fontFamily: FONT.mono, fontSize: FT.body, color, fontVariantNumeric: "tabular-nums" }}>{value}</div>
    {note ? <div style={{ flex: 1, minWidth: 0, paddingLeft: 18, fontFamily: FONT.sans, fontSize: FT.meta, color: C.inkFaint }}>{note}</div> : null}
  </div>
);

/** 竖排行：标签在上、值在中、注释在下。 */
export const KV: React.FC<{ k: React.ReactNode; v: React.ReactNode; note?: React.ReactNode; color?: string; size?: number }> = ({
  k, v, note, color = C.ink, size = FT.body,
}) => (
  <div style={{ marginTop: 14 }}>
    <div style={{ fontFamily: FONT.sans, fontSize: FT.meta, color: C.inkFaint }}>{k}</div>
    <div style={{ fontFamily: FONT.mono, fontSize: size, color, marginTop: 2, fontVariantNumeric: "tabular-nums", lineHeight: 1.35 }}>{v}</div>
    {note ? <div style={{ fontFamily: FONT.sans, fontSize: FT.meta, color: C.inkFaint, marginTop: 2 }}>{note}</div> : null}
  </div>
);

/** 面板热图：行 = 时刻，列 = 股票；空格（整列缺失）用暗色竖带标出。 */
export const PanelHeat: React.FC<{
  z: number[][]; blockCols: number[]; width?: number; height?: number;
  title?: string; accent?: string; at?: number;
}> = ({ z, blockCols, width = 760, height = 420, title, accent = C.cyan, at = 0 }) => {
  const f = useCurrentFrame();
  const p = at > 0 ? pct(f, at, at + 16) : 1;
  const rows = z.length;
  const cols = z[0].length;
  const cw = width / cols;
  const ch = height / rows;
  const blocked = (j: number) => blockCols[j] > 0;
  return (
    <div style={{ width, opacity: p }}>
      {title ? <div style={{ fontFamily: FONT.mono, fontSize: FT.micro, letterSpacing: FT_T.micro, color: C.inkFaint, marginBottom: 8 }}>{title}</div> : null}
      <svg width={width} height={height} style={{ display: "block", borderRadius: 8, border: "1px solid " + C.panelLine }}>
        {z.map((row, i) =>
          row.map((v, j) => {
            if (blocked(j)) return <rect key={i + "-" + j} x={j * cw} y={i * ch} width={cw + 0.3} height={ch + 0.3} fill={C.coral} opacity={0.18} />;
            const t = Math.max(0, Math.min(1, (v + 3) / 6));
            return <rect key={i + "-" + j} x={j * cw} y={i * ch} width={cw + 0.3} height={ch + 0.3} fill={mix(C.panel, accent, t)} />;
          }),
        )}
      </svg>
    </div>
  );
};

/** 小方阵：把 3×3 的数值排成格子，可标出某格是缺失。 */
export const CellGrid: React.FC<{
  rows: number[][]; cell?: number; label?: string; accent?: string;
  missing?: [number, number][]; highlight?: [number, number][]; fmt?: (v: number) => string;
}> = ({ rows, cell = 78, label, accent = C.cyan, missing = [], highlight = [], fmt = (v) => v.toFixed(2) }) => {
  const isIn = (xs: [number, number][], i: number, j: number) => xs.some(([a, b]) => a === i && b === j);
  return (
    <div>
      {label ? <div style={{ fontFamily: FONT.mono, fontSize: FT.micro, letterSpacing: FT_T.micro, color: C.inkFaint, marginBottom: 8 }}>{label}</div> : null}
      {rows.map((row, i) => (
        <div key={i} style={{ display: "flex" }}>
          {row.map((v, j) => {
            const miss = isIn(missing, i, j);
            const hi = isIn(highlight, i, j);
            return (
              <div key={j} style={{
                width: cell, height: cell * 0.62, display: "flex", alignItems: "center", justifyContent: "center",
                border: "1px solid " + C.panelLine, marginRight: -1, marginTop: -1,
                background: miss ? "rgba(255,107,107,0.14)" : hi ? "rgba(94,234,212,0.12)" : C.panel,
                fontFamily: FONT.mono, fontSize: FT.body,
                color: miss ? C.coral : hi ? accent : C.ink,
              }}>{miss ? "缺失" : fmt(v)}</div>
            );
          })}
        </div>
      ))}
    </div>
  );
};