import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { C, FONT, FT, FT_T, G } from "../design/tokens";
import { ChapterBar, SceneShell } from "../design/Scene";
import { SCENES, LINES, FPS, PAGES_INDEX } from "./script";
import distJson from "../../data/tsint-49-gaf-mtf-cote-multidomain/dist.json";
export type Pt = [number, number];
export type CurvePt = { r: number; p: number };
export type CheckRow = { g: string; n: string; ok: boolean };
export type Deviation = { planned: string; actual: string; reason: string };

/* ---------------- 本集数据形状：E49 图像化编码 · GAF / MTF / RP · COTE ---------------- */

export type Check = { group: string; name: string; pass: boolean };
export type Img = number[][];
export type Domain = { key: string; val: number; test: number };
export type Sample = { code: string; end: string; label: string; ret20: number; series: number[] };
export type DistData = {
  meta: {
    episode: string; title: string;
    commits: { tsBase: string; tsAdmin: string };
    manifestCommit: string;
    tests: { groups: number; assertions: number };
    modules: { file: string; cases: number }[];
    newCases: number;
    evidence: { checks: number; passed: number; seconds: number };
    progress: { delivered: number; total: number };
    next: { id: string; title: string; minutes: number };
    deviation: string[];
    tsAdminCommit: string;
  };
  data: {
    stocks: number; length: number; stride: number; fwd: number; split: string;
    windows: number; train: number; test: number;
    trainClasses: number[]; testClasses: number[];
    cnnTrain: number; cnnTest: number; baseline: number;
    industries: { short: string; code: string; n: number; bars: number }[];
    rule: string;
  };
  enc: {
    side: number; bins: number; pool: number; eps: number;
    gasf: Img; gadf: Img; mtf: Img; seq: number[]; gasfDiag: number;
  };
  fisher: { gasf: number; gadf: number; mtf: number; rp: number };
  cnn: {
    epochs: number; lr: number; batch: number; seed: number;
    gasf: number; mtf: number; dual: number;
    band: number[]; chans: number;
    paramsSingle: number; paramsDual: number;
    layers: number[]; kernels: number[];
  };
  cote: {
    domains: Domain[]; weights: number[];
    cote: number; uniform: number; best: number; worst: number;
  };
  panels: { gasf: Img; gadf: Img; mtf: Img; rp: Img };
  samples: Sample[];
  checks: Check[];
};

export const M = distJson as unknown as DistData;

export const CLASS_NAME: string[] = ["下行", "震荡", "上行"];
export const CLASS_DOT: string[] = ["#fb7185", "#67e8f9", "#5eead4"];
export const DOMAIN_NAME: Record<string, string> = {
  time: "时域", acf: "ACF", spectrum: "谱域", shapelet: "shapelet",
};

export const CHECK_GROUPS: string[] = ["data", "encode", "image", "fisher", "cnn", "cote", "demo"];
export const checkGroups = () =>
  CHECK_GROUPS.filter((g) => M.checks.some((c) => c.group === g)).map((g) => {
    const rows = M.checks.filter((c) => c.group === g);
    return { g, pass: rows.filter((c) => c.pass).length, total: rows.length };
  });
export const checksOf = (g: string): Check[] => M.checks.filter((c) => c.group === g);

export const fmt4 = (v: number, d = 4) => v.toFixed(d);
export const fmt2 = (v: number, d = 2) => v.toFixed(d);
export const fmtF = fmt4;
export const fmtInt = (v: number) => Math.round(v).toLocaleString("en-US");
export const fmtPct = (v: number, d = 2) => (v * 100).toFixed(d) + "%";
export const fmtSigned = (v: number, d = 2) => (v > 0 ? "+" : "") + v.toFixed(d);
export const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
export const pct = (f: number, a: number, b: number) => interpolate(f, [a, b], [0, 1], clamp);
export const PAD = G.pad;
export const CW = 1920 - PAD * 2;

export const lf = (id: string, k: number): number => {
  const s = SCENES.find((x) => x.id === id);
  if (!s) return 0;
  return Math.max(0, Math.round(s.dur * k * FPS));
};

/** 分页起点：用该页第一句在实测时间轴上的位置换算成场景内分数。 */
export const pageAt = (id: string, k: number): number => {
  const s = SCENES.find((x) => x.id === id);
  const l = LINES.find((x) => x.scene === id && x.index === k);
  if (!s || !l) return 0;
  return Math.max(0, Math.min(1, (l.start - s.start) / s.dur));
};
export const pagesOf = (id: string): number[] => (PAGES_INDEX[id] ?? [0]).map((k) => pageAt(id, k));
export const sceneFrames = (id: string): number => {
  const s = SCENES.find((x) => x.id === id);
  return s ? Math.round(s.dur * FPS) : 0;
};
export const mix = (a: string, b: string, t: number): string => {
  const pa = parseInt(a.slice(1), 16);
  const pb = parseInt(b.slice(1), 16);
  const ch = (sh: number) => {
    const x = (pa >> sh) & 255;
    const y = (pb >> sh) & 255;
    return Math.round(x + (y - x) * t);
  };
  return "#" + [16, 8, 0].map((sh) => ch(sh).toString(16).padStart(2, "0")).join("");
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

/** 场景内分页：按场景时长的分数切页，页间 12 帧交叉淡变（硬切会触发 flicker gate 的 luma jump）。 */
export const Pages: React.FC<{ id: string; at: number[]; children: React.ReactNode[] }> = ({ id, at, children }) => {
  const f = useCurrentFrame();
  const dur = Math.max(1, sceneFrames(id));
  const fade = 12;
  return (
    <>
      {children.map((child, i) => {
        const a = (at[i] ?? 0) * dur;
        const b = (i + 1 < at.length ? at[i + 1] : 1) * dur;
        const last = i === children.length - 1;
        const inO = interpolate(f, [a, a + fade], [0, 1], clamp);
        const outO = last ? 1 : interpolate(f, [b, b + fade], [1, 0], clamp);
        const o = Math.min(inO, outO);
        if (o <= 0.001) return null;
        return <div key={i} style={{ position: "absolute", inset: 0, opacity: o }}>{child}</div>;
      })}
    </>
  );
};

export const PRPlot: React.FC<{
  width: number; height: number;
  series: { name: string; color: string; pts: CurvePt[]; dash?: boolean }[];
  op?: { r: number; p: number; color: string; label?: string }[];
  title?: string; at?: number;
}> = ({ width, height, series, op = [], title, at = 0 }) => {
  const f = useCurrentFrame();
  const p0 = at > 0 ? pct(f, at, at + 20) : 1;
  const padL = 80, padB = 88, padT = 36, padR = 26;
  const sx = (r: number) => padL + r * (width - padL - padR);
  const sy = (p: number) => height - padB - p * (height - padT - padB);
  const ticks = [0, 0.25, 0.5, 0.75, 1];
  const pathOf = (pts: CurvePt[]) => pts.map((q, i) => (i === 0 ? "M" : "L") + sx(q.r).toFixed(1) + "," + sy(q.p).toFixed(1)).join(" ");
  return (
    <svg width={width} height={height} style={{ display: "block" }}>
      {ticks.map((t) => (
        <g key={"g" + t}>
          <line x1={sx(t)} y1={padT} x2={sx(t)} y2={height - padB} stroke={C.panelLine} strokeWidth={1} opacity={0.6} />
          <line x1={padL} y1={sy(t)} x2={width - padR} y2={sy(t)} stroke={C.panelLine} strokeWidth={1} opacity={0.6} />
          <text x={sx(t)} y={height - padB + 24} textAnchor="middle" fill={C.inkFaint} fontFamily={FONT.mono} fontSize={FT.micro}>{t.toFixed(2)}</text>
          <text x={padL - 14} y={sy(t) + 4} textAnchor="end" fill={C.inkFaint} fontFamily={FONT.mono} fontSize={FT.micro}>{t.toFixed(2)}</text>
        </g>
      ))}
      <text x={padL} y={height - 12} fill={C.inkFaint} fontFamily={FONT.sans} fontSize={FT.meta}>召回 Recall</text>
      <text x={16} y={sy(1) - 10} fill={C.inkFaint} fontFamily={FONT.sans} fontSize={FT.meta}>精度</text>
      {title ? <text x={padL} y={22} fill={C.inkFaint} fontFamily={FONT.mono} fontSize={FT.micro}>{title}</text> : null}
      {series.map((s) => (
        <path key={s.name} d={pathOf(s.pts)} fill="none" stroke={s.color} strokeWidth={s.dash ? 1.8 : 2.4} strokeDasharray={s.dash ? "7 5" : undefined} opacity={p0} />
      ))}
      {op.map((o) => (
        <g key={o.color + o.r}>
          <circle cx={sx(o.r)} cy={sy(o.p)} r={5.5} fill={o.color} opacity={p0} />
          {o.label ? (op.indexOf(o) % 2 === 0 ? <text x={sx(o.r) - 12} y={sy(o.p) - 10} textAnchor="end" fill={o.color} fontFamily={FONT.mono} fontSize={FT.micro}>{o.label}</text> : <text x={sx(o.r) + 12} y={sy(o.p) + 24} fill={o.color} fontFamily={FONT.mono} fontSize={FT.micro}>{o.label}</text>) : null}
        </g>
      ))}
      {series.map((s, i) => (
        <g key={"lg" + s.name}>
          <line x1={padL + i * 210} y1={height - 44} x2={padL + i * 210 + 26} y2={height - 44} stroke={s.color} strokeWidth={2.4} strokeDasharray={s.dash ? "6 5" : undefined} />
          <text x={padL + i * 210 + 34} y={height - 39} fill={C.inkFaint} fontFamily={FONT.sans} fontSize={FT.meta}>{s.name}</text>
        </g>
      ))}
    </svg>
  );
};

export type LineSeries = { values: (number | null)[]; color: string; name: string; dash?: boolean };

/** 通用折线图：多序列、共用 y 域；可截取窗口、画参考线。 */
export const LinePlot: React.FC<{
  series: LineSeries[]; width: number; height: number; at?: number;
  from?: number; to?: number; title?: string; padL?: number; padB?: number; padT?: number;
  zeroLine?: boolean; legend?: boolean; yFmt?: (v: number) => string; stretch?: number;
  yMin?: number; yMax?: number;
  hlines?: { v: number; color: string; label?: string }[];
  vlines?: { i: number; color: string; label?: string }[];
}> = ({ series, width, height, at = 0, from, to, title, padL = 92, padB = 54, padT = 40, zeroLine = false, legend = true, yFmt = (v) => v.toFixed(0), stretch = 1, hlines = [], vlines = [], yMin, yMax }) => {
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
  const y0 = yMin ?? rawLo - dy, y1 = yMax ?? rawHi + dy;
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
      {vlines.map((v) => (
        <g key={"v" + v.i + v.color}>
          <line x1={sx(v.i - i0)} y1={padT} x2={sx(v.i - i0)} y2={height - padB} stroke={v.color} strokeDasharray="4 5" strokeWidth={1.2} opacity={0.8} />
          {v.label ? <text x={sx(v.i - i0) + 8} y={padT + 16} fill={v.color} fontFamily={FONT.mono} fontSize={FT.micro}>{v.label}</text> : null}
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
  width: number; max?: number; rowH?: number; at?: number; unit?: string; labelW?: number;
}> = ({ items, width, max, rowH = 62, at = 0, unit, labelW = 132 }) => {
  const f = useCurrentFrame();
  const hi = max ?? Math.max(...items.map((i) => i.value));
  return (
    <div style={{ width }}>
      {items.map((it, i) => {
        const p = at > 0 ? pct(f, at + i * 5, at + 16 + i * 5) : 1;
        const w = Math.max(2, (it.value / hi) * (width - 250));
        return (
          <div key={it.label} style={{ display: "flex", alignItems: "center", height: rowH, opacity: p }}>
            <div style={{ width: labelW, fontFamily: FONT.mono, fontSize: FT.meta, color: it.dim ? C.inkFaint : C.inkDim }}>{it.label}</div>
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

/** 公式块：衬线体，用于把式子原样搬上屏。 */
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
export const Row: React.FC<{ name: React.ReactNode; value: React.ReactNode; note?: React.ReactNode; color?: string; width?: number; spread?: boolean }> = ({
  name, value, note, color = C.ink, width = 1720, spread = false,
}) => (
  <div style={{ display: "flex", alignItems: "baseline", width: "100%", maxWidth: width, marginTop: 10 }}>
    <div style={{ flex: "0 0 36%", minWidth: 0, fontFamily: FONT.sans, fontSize: FT.body, color: C.inkDim }}>{name}</div>
    <div style={{ flex: "0 1 auto", minWidth: "18%", maxWidth: spread ? "62%" : "44%", whiteSpace: "nowrap", fontFamily: FONT.mono, fontSize: FT.body, color, fontVariantNumeric: "tabular-nums" }}>{value}</div>
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

/** 小图例：色块 + 文字。 */
export const TagDot: React.FC<{ color: string; children: React.ReactNode; size?: number }> = ({ color, children, size = FT.meta }) => (
  <span style={{ display: "inline-flex", alignItems: "center", fontFamily: FONT.sans, fontSize: size, color: C.inkDim }}>
    <span style={{ width: 10, height: 10, background: color, borderRadius: 2, marginRight: 8, display: "inline-block" }} />
    {children}
  </span>
);

/** 数字对数字的对比条：左值右值各一条，共用一条基线。 */
export const PairBar: React.FC<{
  a: { label: string; value: number; text: string }; b: { label: string; value: number; text: string };
  width?: number; height?: number; colorA?: string; colorB?: string; at?: number; max?: number;
}> = ({ a, b, width = 900, height = 132, colorA = C.cyan, colorB = C.coral, at = 0, max }) => {
  const f = useCurrentFrame();
  const p = at > 0 ? pct(f, at, at + 18) : 1;
  const hi = max ?? Math.max(a.value, b.value);
  const barW = (v: number) => Math.max(3, (v / hi) * (width - 220));
  return (
    <div style={{ width, opacity: p }}>
      {[{ k: a, c: colorA }, { k: b, c: colorB }].map((row, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", height: height / 2 }}>
          <div style={{ width: 150, fontFamily: FONT.sans, fontSize: FT.meta, color: C.inkDim }}>{row.k.label}</div>
          <div style={{ width: width - 220, height: 20, background: C.panelLine, borderRadius: 5, position: "relative" }}>
            <div style={{ position: "absolute", left: 0, top: 0, height: 20, width: barW(row.k.value), borderRadius: 5, background: row.c, opacity: 0.9 }} />
          </div>
          <div style={{ width: 70, textAlign: "right", fontFamily: FONT.mono, fontSize: FT.meta, color: row.c }}>{row.k.text}</div>
        </div>
      ))}
    </div>
  );
};

/** 相关矩阵热图：|corr| 上色，行业分组用格边与行标签标出。labels 空时只画画布。 */
export const Heat: React.FC<{
  matrix: number[][]; labels: string[]; groups?: number[];
  cell?: number; gap?: number; labelW?: number; size?: number;
  min?: number; max?: number; showVals?: boolean; at?: number; style?: React.CSSProperties;
}> = ({ matrix, labels, groups, cell = 46, gap = 3, labelW = 104, size = FT.micro, min = 0, max = 1, showVals = false, at = 0, style }) => {
  const f = useCurrentFrame();
  const p = at > 0 ? pct(f, at, at + 16) : 1;
  const gcol = [C.cyan, C.amber, C.violet, C.coral];
  const lo = min;
  const hi = max;
  const hasLabels = labels.length > 0;
  return (
    <div style={{ opacity: p, ...style }}>
      {hasLabels ? (
        <div style={{ display: "flex", alignItems: "flex-end", marginBottom: 4 }}>
          <div style={{ width: labelW }} />
          {labels.map((l, j) => (
            <div key={"h" + j} style={{ width: cell, marginLeft: gap, height: 54, display: "flex", alignItems: "flex-end", justifyContent: "center", fontFamily: FONT.mono, fontSize: 10, color: C.inkFaint, writingMode: "vertical-rl", whiteSpace: "nowrap" }}>{l}</div>
          ))}
        </div>
      ) : null}
      {matrix.map((row, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", marginBottom: gap }}>
          {hasLabels ? (
            <div style={{ width: labelW, paddingRight: 10, textAlign: "right", fontFamily: FONT.sans, fontSize: size, color: groups ? gcol[(groups[i] ?? 0) % 4] : C.inkDim, whiteSpace: "nowrap", overflow: "hidden" }}>{labels[i]}</div>
          ) : null}
          {row.map((v, j) => {
            const sv = Math.max(0, Math.min(1, (v - lo) / Math.max(1e-9, hi - lo)));
            const t = Math.pow(sv, 1.7);
            const bg = v >= 0 ? mix("#0E1620", "#5EEAD4", t) : mix("#0E1620", "#FB7185", t * 0.85);
            const same = groups ? groups[i] === groups[j] : false;
            return (
              <div key={j} style={{
                width: cell, height: cell, marginLeft: gap, background: bg, borderRadius: 2,
                border: same ? "1px solid " + gcol[(groups![i] ?? 0) % 4] : "1px solid transparent",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontFamily: FONT.mono, fontSize: 9, color: t > 0.55 ? C.bg : C.inkFaint,
              }}>{showVals ? Math.abs(v).toFixed(2) : ""}</div>
            );
          })}
        </div>
      ))}
    </div>
  );
};

export const Scatter: React.FC<{
  width: number; height: number;
  normal: Pt[]; spike: Pt[]; drift: Pt[];
  at?: number; title?: string;
}> = ({ width, height, normal, spike, drift, at = 0, title }) => {
  const f = useCurrentFrame();
  const p0 = at > 0 ? pct(f, at, at + 24) : 1;
  const padL = 76, padB = 76, padT = 30, padR = 28;
  const all = [...normal, ...spike, ...drift];
  const m = Math.max(1, ...all.map((q) => Math.max(Math.abs(q[0]), Math.abs(q[1]))));
  const lim = Math.ceil((m * 1.12) * 2) / 2;
  const sx = (x: number) => padL + ((x + lim) / (2 * lim)) * (width - padL - padR);
  const sy = (y: number) => height - padB - ((y + lim) / (2 * lim)) * (height - padT - padB);
  const ticks = [-lim, -lim / 2, 0, lim / 2, lim];
  const ring = (r: number) => (
    <circle cx={sx(0)} cy={sy(0)} r={((r) / (2 * lim)) * (width - padL - padR)} fill="none" stroke={C.inkFaint} strokeWidth={1} strokeDasharray="5 6" opacity={0.5 * p0} />
  );
  return (
    <svg width={width} height={height} style={{ display: "block" }}>
      {ticks.map((t) => (
        <g key={"g" + t}>
          <line x1={sx(t)} y1={padT} x2={sx(t)} y2={height - padB} stroke={C.panelLine} strokeWidth={1} opacity={0.55} />
          <line x1={padL} y1={sy(t)} x2={width - padR} y2={sy(t)} stroke={C.panelLine} strokeWidth={1} opacity={0.55} />
          <text x={sx(t)} y={height - padB + 22} textAnchor="middle" fill={C.inkFaint} fontFamily={FONT.mono} fontSize={FT.micro}>{t.toFixed(1)}</text>
          <text x={padL - 12} y={sy(t) + 4} textAnchor="end" fill={C.inkFaint} fontFamily={FONT.mono} fontSize={FT.micro}>{t.toFixed(1)}</text>
        </g>
      ))}
      {ring(1)}
      <text x={width - padR} y={height - 14} textAnchor="end" fill={C.inkFaint} fontFamily={FONT.sans} fontSize={FT.meta}>第一维 z₁</text>
      <text x={16} y={padT + 6} fill={C.inkFaint} fontFamily={FONT.sans} fontSize={FT.meta}>z₂</text>
      {title ? <text x={padL} y={18} fill={C.inkFaint} fontFamily={FONT.mono} fontSize={FT.micro}>{title}</text> : null}
      {normal.map((q, i) => (
        <circle key={"n" + i} cx={sx(q[0])} cy={sy(q[1])} r={2.6} fill={C.cyan} opacity={0.45 * p0} />
      ))}
      {drift.map((q, i) => (
        <circle key={"d" + i} cx={sx(q[0])} cy={sy(q[1])} r={4.2} fill={C.amber} opacity={0.9 * p0} />
      ))}
      {spike.map((q, i) => (
        <circle key={"s" + i} cx={sx(q[0])} cy={sy(q[1])} r={5.2} fill={C.coral} opacity={0.95 * p0} />
      ))}
      <g fontFamily={FONT.sans} fontSize={FT.meta} fill={C.inkFaint}>
        <circle cx={padL + 4} cy={height - 40} r={3} fill={C.cyan} opacity={0.6} />
        <text x={padL + 16} y={height - 35}>正常窗</text>
        <circle cx={padL + 110} cy={height - 40} r={4.2} fill={C.amber} />
        <text x={padL + 124} y={height - 35}>斜坡窗</text>
        <circle cx={padL + 226} cy={height - 40} r={5} fill={C.coral} />
        <text x={padL + 242} y={height - 35}>尖峰窗</text>
        <text x={padL + 340} y={height - 35}>虚线圈 = 单位圆（N(0,I) 的一倍标准差）</text>
      </g>
    </svg>
  );
};

export const SlotGrid: React.FC<{
  items: { label: string; group: number; slot: number }[];
  cell?: number; at?: number; title?: string;
}> = ({ items, cell = 88, at = 0, title }) => {
  const f = useCurrentFrame();
  const p = at > 0 ? pct(f, at, at + 16) : 1;
  const scol = [C.cyan, C.amber, C.violet, C.coral];
  const gcol = [C.cyan, C.amber, C.violet, C.coral];
  return (
    <div style={{ opacity: p }}>
      {title ? <div style={{ fontFamily: FONT.mono, fontSize: FT.micro, color: C.inkFaint, marginBottom: 8 }}>{title}</div> : null}
      <div style={{ display: "flex", flexWrap: "wrap", width: cell * 8 + 7 * 4 }}>
        {items.map((it, i) => (
          <div key={i} style={{
            width: cell, height: 46, marginLeft: i % 8 === 0 ? 0 : 4, marginTop: 4,
            background: mix("#0E1620", scol[it.slot % 4], 0.38),
            border: "2px solid " + gcol[it.group % 4],
            borderRadius: 6, boxSizing: "border-box", display: "flex", alignItems: "center", justifyContent: "center",
            fontFamily: FONT.sans, fontSize: 15, color: C.ink,
          }}>{it.label}</div>
        ))}
      </div>
    </div>
  );
};

/** 真值条：在一条时间轴上标出真值点，用于对照打分曲线。 */
export const Strip: React.FC<{
  idx: number[]; total: number; width: number; height?: number; color?: string;
  flat?: { start: number; len: number; color?: string }; at?: number;
}> = ({ idx, total, width, height = 18, color = C.coral, flat, at = 0 }) => {
  const f = useCurrentFrame();
  const p = at > 0 ? pct(f, at, at + 16) : 1;
  const sx = (i: number) => (i / Math.max(1, total - 1)) * width;
  return (
    <div style={{ width, height, position: "relative", opacity: p, background: C.panelLine, borderRadius: 2 }}>
      {flat ? (
        <div style={{ position: "absolute", left: sx(flat.start), width: Math.max(2, sx(flat.start + flat.len) - sx(flat.start)), top: 0, bottom: 0, background: flat.color ?? C.amber, opacity: 0.28 }} />
      ) : null}
      {idx.map((i, k) => (
        <div key={k} style={{ position: "absolute", left: sx(i), width: Math.max(1.5, width / total), top: 0, bottom: 0, background: color, opacity: 0.75 }} />
      ))}
    </div>
  );
};

/* ---------------------------------------------------------------- E43 图形件 */

const pathOf = (vals: number[], w: number, h: number, pad: number, yMin: number, yMax: number): string => {
  const span = Math.max(1e-9, yMax - yMin);
  return vals
    .map((v, i) => {
      const x = pad + (i * (w - 2 * pad)) / Math.max(1, vals.length - 1);
      const y = h - pad - ((v - yMin) / span) * (h - 2 * pad);
      return (i === 0 ? "M" : "L") + x.toFixed(1) + "," + y.toFixed(1);
    })
    .join(" ");
};

/** 一条序列 + 可选的高亮窗口。 */
export const SeriesBox: React.FC<{
  values: number[]; start?: number; len?: number; width: number; height: number;
  color?: string; accent?: string; label?: string;
}> = ({ values, start, len, width, height, color = C.ink, accent = C.coral, label }) => {
  const pad = 10;
  const lo = Math.min(...values);
  const hi = Math.max(...values);
  const padY = Math.max(0.05, (hi - lo) * 0.12);
  const d = pathOf(values, width, height, pad, lo - padY, hi + padY);
  const xAt = (i: number) => pad + (i * (width - 2 * pad)) / Math.max(1, values.length - 1);
  return (
    <div style={{ position: "relative", width, height }}>
      <svg width={width} height={height}>
        <line x1={pad} y1={height / 2} x2={width - pad} y2={height / 2} stroke={C.panelLine} strokeWidth={1} />
        {start !== undefined && len !== undefined ? (
          <rect x={xAt(start)} y={4} width={Math.max(6, xAt(start + len - 1) - xAt(start))} height={height - 8} fill={accent} opacity={0.14} stroke={accent} strokeWidth={1.5} />
        ) : null}
        <path d={d} fill="none" stroke={color} strokeWidth={2.2} />
      </svg>
      {label ? <div style={{ position: "absolute", left: 12, top: 2, fontSize: FT.micro, color: C.inkFaint, fontFamily: FONT.mono }}>{label}</div> : null}
    </div>
  );
};

/** 滑动最小距离曲线：虚线是阈值，圆点是最近的位置。 */
export const SlideCurve: React.FC<{ curve: number[]; threshold: number; minIdx: number; width: number; height: number; color?: string }> = ({ curve, threshold, minIdx, width, height, color = C.cyan }) => {
  const pad = 12;
  const hi = Math.max(...curve, threshold) * 1.1;
  const d = pathOf(curve, width, height, pad, 0, hi);
  const yAt = (v: number) => height - pad - (v / hi) * (height - 2 * pad);
  const xAt = (i: number) => pad + (i * (width - 2 * pad)) / Math.max(1, curve.length - 1);
  return (
    <svg width={width} height={height}>
      <line x1={pad} y1={yAt(threshold)} x2={width - pad} y2={yAt(threshold)} stroke={C.coral} strokeWidth={1.4} strokeDasharray="6 5" />
      <path d={d} fill="none" stroke={color} strokeWidth={2} />
      <circle cx={xAt(minIdx)} cy={yAt(curve[minIdx])} r={5} fill={C.coral} />
    </svg>
  );
};

/** 两类距离的散点条：阈值竖线分开「距离小」和「距离大」。 */
export const SplitDots: React.FC<{ pos: (number | null)[]; neg: (number | null)[]; threshold: number; width: number; height: number; posLabel?: string; negLabel?: string }> = ({ pos, neg, threshold, width, height, posLabel = "正类", negLabel = "其余" }) => {
  const pad = 26;
  const num = (v: number | null): v is number => typeof v === "number" && Number.isFinite(v);
  const all = [...pos, ...neg].filter(num);
  const hi = Math.max(...all, threshold) * 1.02;
  const xAt = (v: number) => pad + (v / hi) * (width - 2 * pad);
  const rows = [height * 0.3, height * 0.72];
  const dots = (vals: (number | null)[], y: number, color: string, k: number) =>
    vals.filter(num).map((v, i) => <circle key={color + k + i} cx={xAt(v)} cy={y + ((i % 5) - 2) * 3.2} r={3.2} fill={color} opacity={0.85} />);
  return (
    <svg width={width} height={height}>
      <line x1={xAt(threshold)} y1={8} x2={xAt(threshold)} y2={height - 8} stroke={C.coral} strokeWidth={1.6} strokeDasharray="6 5" />
      {dots(neg, rows[0], C.inkDim, 1)}
      {dots(pos, rows[1], C.amber, 2)}
      <text x={4} y={rows[0] + 4} fill={C.inkFaint} fontSize={13}>{negLabel}</text>
      <text x={4} y={rows[1] + 4} fill={C.amber} fontSize={13}>{posLabel}</text>
    </svg>
  );
};

/** PIPs：原序列、十个拐点、分段线性重构。 */
export const PipFig: React.FC<{ series: number[]; pips: number[]; reconstruct: number[]; width: number; height: number }> = ({ series, pips, reconstruct, width, height }) => {
  const pad = 12;
  const lo = Math.min(...series);
  const hi = Math.max(...series);
  const padY = Math.max(0.05, (hi - lo) * 0.12);
  const sy = (v: number) => height - pad - ((v - (lo - padY)) / (hi + padY - (lo - padY))) * (height - 2 * pad);
  const sx = (i: number) => pad + (i * (width - 2 * pad)) / Math.max(1, series.length - 1);
  const pipsD = reconstruct.map((v, i) => (i === 0 ? "M" : "L") + sx(i).toFixed(1) + "," + sy(v).toFixed(1)).join(" ");
  return (
    <svg width={width} height={height}>
      <path d={pathOf(series, width, height, pad, lo - padY, hi + padY)} fill="none" stroke={C.inkDim} strokeWidth={1.4} />
      <path d={pipsD} fill="none" stroke={C.cyan} strokeWidth={2} strokeDasharray="5 4" />
      {pips.map((p, i) => <circle key={i} cx={sx(p)} cy={sy(series[p])} r={4.6} fill={C.amber} stroke={C.bg} strokeWidth={1.4} />)}
    </svg>
  );
};

/** 左对齐迷你表。 */
export const MiniTable: React.FC<{ head: string[]; rows: React.ReactNode[][]; colW: number[]; width: number; rowH?: number; size?: number; hilite?: number }> = ({ head, rows, colW, width, rowH = 36, size = FT.meta, hilite = -1 }) => (
  <div style={{ width, fontFamily: FONT.mono }}>
    <div style={{ display: "flex", height: 30, alignItems: "center", borderBottom: "1px solid " + C.panelLine }}>
      {head.map((h, i) => <div key={i} style={{ width: colW[i], fontSize: FT.micro, color: C.inkFaint }}>{h}</div>)}
    </div>
    {rows.map((r, k) => (
      <div key={k} style={{ display: "flex", height: rowH, alignItems: "center", borderBottom: "1px solid " + C.panelLine, background: k === hilite ? "rgba(94,234,212,0.10)" : "transparent" }}>
        {r.map((c, i) => <div key={i} style={{ width: colW[i], fontSize: size, color: i === 0 ? C.ink : C.inkDim }}>{c}</div>)}
      </div>
    ))}
  </div>
);

/** 水平条形：增益对照。 */
export const GainBar: React.FC<{ items: { label: string; value: number; color: string; note?: string }[]; width: number; max: number; labelW?: number; valueFmt?: (v: number) => string }> = ({ items, width, max, labelW = 250, valueFmt = (v) => v.toFixed(4) }) => (
  <div style={{ width }}>
    {items.map((it, i) => (
      <div key={i} style={{ display: "flex", alignItems: "center", marginBottom: 14 }}>
        <div style={{ width: labelW, fontSize: FT.body, color: C.inkDim }}>{it.label}</div>
        <div style={{ width: (width - labelW) * 0.62, height: 18, background: C.panelLine, position: "relative" }}>
          <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: ((width - labelW) * 0.62 * it.value) / max, background: it.color }} />
        </div>
        <div style={{ marginLeft: 16, fontFamily: FONT.mono, fontSize: FT.body, color: it.color }}>{valueFmt(it.value)}</div>
        {it.note ? <div style={{ marginLeft: 12, fontSize: FT.micro, color: C.inkFaint }}>{it.note}</div> : null}
      </div>
    ))}
  </div>
);

/** 28 格检查：按组染色。 */
const GROUP_TINT: Record<string, string> = {
  data: "rgba(94,234,212,0.42)",
  encode: "rgba(94,234,212,0.85)",
  image: "rgba(167,139,250,0.68)",
  fisher: "rgba(251,191,36,0.62)",
  cnn: "rgba(251,113,133,0.55)",
  cote: "rgba(102,167,255,0.6)",
  demo: "rgba(102,117,138,0.7)",
};


export const CheckGrid: React.FC<{ width: number }> = ({ width }) => {
  const cells = M.checks.map((c) => ({ g: c.group, n: c.name, ok: c.pass }));
  const gap = 6;
  const cell = (width - gap * (cells.length - 1)) / cells.length;
  return (
    <div style={{ width }}>
      <div style={{ display: "flex", gap }}>
        {cells.map((c, i) => <div key={i} title={c.g + " · " + c.n} style={{ width: cell, height: 22, background: c.ok ? GROUP_TINT[c.g] ?? "rgba(94,234,212,0.55)" : C.coral, borderRadius: 3 }} />)}
      </div>
      <div style={{ display: "flex", gap: 18, marginTop: 12, fontSize: FT.micro, color: C.inkFaint, fontFamily: FONT.mono }}>
        {checkGroups().map((g) => <span key={g.g}>{g.g} {g.pass}/{g.total}</span>)}
        <span style={{ color: C.inkDim }}>共 {M.checks.length} 组检查</span>
      </div>
    </div>
  );
};