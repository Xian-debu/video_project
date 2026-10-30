import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { C, FONT, FT, FT_T, G } from "../design/tokens";
import { ChapterBar, SceneShell } from "../design/Scene";
import { SCENES, LINES, FPS } from "./script";
import fewshotJson from "../../data/tsint-68-fewshot-and-cost/fewshot.json";

/* 本片共用件：E68 的数据形状、场景壳、位置图与覆盖条形图。 */

export type Strategy = {
  key: string;
  label: string;
  kind: "window" | "point";
  anchor: "front" | "back" | "uniform" | "random";
  legal: boolean;
  count: number;
  runs: number;
  maxGap: number;
  span: number;
  first: number;
  last: number;
  firstDate: string;
  lastDate: string;
  months: number;
  indices: number[];
};

export type FewShotData = {
  meta: {
    episode: number; bookPages: string;
    tsBaseCommit: string; tsBaseHead: string; tsAdminHead: string;
    evidenceRunAt: string; command: string;
    tests: { new: number; fewshot: number; efficiency: number; suite: number };
    checks: { fewshot: number; efficiency: number; total: number };
  };
  data: {
    path: string; code: string; rows: number; first: string; last: string; sha256: string;
    trainFirst: string; trainLast: string; testFirst: string; testLast: string;
  };
  window: { total: number; train: number; test: number; rho: number; window: number; budget: number; windows: number };
  strategies: Strategy[];
  identity: { front: boolean; back: boolean };
  seedCheck: { seed: number; sameSeedEqual: boolean; otherSeedDiffers: boolean };
  boundary: { n: number; rho: number; rawRound: number; liftedPoints: number; windows: number };
  efficiency: {
    protocol: { warmup: number; reps: number; steps: number; batch: number; lr: number; n: number; train: number; test: number; seed: number };
    selfCheck: { shape: number[]; layout: number[]; params: number; oneInput: number };
    scales: { shape: number[]; params: number; trainMs: number; inferMs: number; lazyMs: number; mse: number; peakBytes: number; peakMb: number }[];
    ratios: { train: number; infer: number; params: number; peak: number; mse: number };
  };
  series: { dates: string[]; closes: number[] };
  evidence: {
    fewshot: { unitId: string; path: string; commit: string; runAt: string; checks: number };
    efficiency: { unitId: string; path: string; commit: string; runAt: string; checks: number };
  };
};

export const M = fewshotJson as unknown as FewShotData;

export const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
export const pct = (f: number, a: number, b: number) => interpolate(f, [a, b], [0, 1], clamp);
export const PAD = G.pad;
export const CW = 1920 - PAD * 2;

export const fmtInt = (v: number) => v.toLocaleString("en-US");
export const fmtMs = (v: number) => (v >= 1000 ? (v / 1000).toFixed(2) + " s" : v >= 10 ? v.toFixed(1) : v >= 1 ? v.toFixed(2) : v.toFixed(4));
export const fmtMse = (v: number) => v.toFixed(4);

export const sceneFrames = (id: string): number => {
  const s = SCENES.find((x) => x.id === id);
  return s ? Math.round(s.dur * FPS) : 900;
};
export const beatFrames = (id: string): number[] => {
  const s = SCENES.find((x) => x.id === id);
  if (!s) return [];
  const from = s.start, to = s.start + s.dur;
  const out: number[] = [];
  for (const l of LINES) {
    if (l.start < from || l.start >= to) continue;
    const f = Math.round((l.start - from) * FPS);
    if (f >= 0 && (out.length === 0 || f > out[out.length - 1] + 8)) out.push(f);
  }
  return out;
};
export const beatAt = (id: string, i: number, n: number): number => {
  const target = (sceneFrames(id) * (i + 0.5)) / Math.max(1, n);
  const beats = beatFrames(id);
  if (!beats.length) return Math.round(target);
  return beats.reduce((best, f) => (Math.abs(f - target) < Math.abs(best - target) ? f : best), beats[0]);
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

export const K: React.FC<{ children: React.ReactNode; color?: string }> = ({ children, color = C.inkFaint }) => (
  <span style={{ fontFamily: FONT.mono, fontSize: FT.micro, letterSpacing: FT_T.micro, color }}>{children}</span>
);

export const Chip: React.FC<{ children: React.ReactNode; color?: string }> = ({ children, color = C.coral }) => (
  <span style={{ display: "inline-block", padding: "2px 8px", borderRadius: 6, border: "1px solid " + color, color, fontFamily: FONT.mono, fontSize: FT.micro }}>{children}</span>
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

export const Quote: React.FC<{ lines: string[]; width?: number; label?: string; source?: string }> = ({
  lines, width = 860, label = "原文 · p.203–204 · 8.6.1", source = "《时序智能》p.203–204 · 短摘录 · CC BY-NC-ND 4.0",
}) => (
  <Card label={label} accent={C.inkFaint} pad={20} style={{ width }}>
    {lines.map((q, i) => (
      <div key={i} style={{ fontFamily: FONT.serif, fontSize: FT.body, color: C.inkDim, lineHeight: 1.64, marginTop: i ? 10 : 0 }}>{q}</div>
    ))}
    <div style={{ marginTop: 12, fontFamily: FONT.mono, fontSize: FT.micro, color: C.inkFaint }}>{source}</div>
  </Card>
);

/** 把 1000 个位置压成连续段；点采样得到 50 个 1 宽的段。 */
export const runsOf = (ix: number[]): [number, number][] => {
  const out: [number, number][] = [];
  if (!ix.length) return out;
  let a = ix[0], b = ix[0];
  for (let i = 1; i < ix.length; i += 1) {
    if (ix[i] === b + 1) b = ix[i];
    else { out.push([a, b]); a = ix[i]; b = ix[i]; }
  }
  out.push([a, b]);
  return out;
};

/** 一行 50 点位置图：横轴 0..train-1，标出训练窗。 */
export const StrategyStrip: React.FC<{
  s: Strategy; width: number; height?: number; at?: number; showLabel?: boolean; scaleN?: number;
}> = ({ s, width, height = 44, at = 0, showLabel = true, scaleN = M.window.train }) => {
  const f = useCurrentFrame();
  const p = at > 0 ? pct(f, at, at + 18) : 1;
  const color = s.legal ? (s.kind === "window" ? C.cyan : C.violet) : C.coral;
  const x = (i: number) => (i / Math.max(1, scaleN - 1)) * width;
  const runs = runsOf(s.indices);
  return (
    <div style={{ width, opacity: p }}>
      {showLabel ? (
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 4 }}>
          <div style={{ fontFamily: FONT.sans, fontSize: FT.meta, color: s.legal ? C.inkDim : C.coral }}>
            {s.label}
            {!s.legal ? <span style={{ marginLeft: 8 }}><Chip>不合法</Chip></span> : null}
          </div>
          <div style={{ fontFamily: FONT.mono, fontSize: FT.micro, color: C.inkFaint }}>
            {s.months} 个月 · {s.runs} 段 · 空洞 {s.maxGap}
          </div>
        </div>
      ) : null}
      <svg width={width} height={height} style={{ display: "block" }}>
        <rect x={0} y={height / 2 - 3} width={width * p} height={6} fill={C.panelLine} opacity={0.9} />
        {runs.map(([a, b], i) => {
          const x0 = x(a);
          const w = Math.max(3, x(b) - x(a) + 3);
          return <rect key={i} x={x0} y={height / 2 - (s.kind === "window" ? 10 : 7)} width={w}
            height={s.kind === "window" ? 20 : 14} rx={s.kind === "window" ? 3 : 7} fill={color} opacity={0.92} />;
        })}
      </svg>
    </div>
  );
};

/** 覆盖月份条形图：横轴 0..48 个月。 */
export const MonthBar: React.FC<{ s: Strategy; width: number; at?: number; max?: number }> = ({ s, width, at = 0, max = 48 }) => {
  const f = useCurrentFrame();
  const p = at > 0 ? pct(f, at, at + 18) : 1;
  const w = (s.months / max) * width * p;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
      <div style={{ width: 232, fontFamily: FONT.sans, fontSize: FT.meta, color: s.legal ? C.inkDim : C.coral, textAlign: "right" }}>{s.label}</div>
      <div style={{ width, height: 16, background: C.panelLine, borderRadius: 4, position: "relative" }}>
        <div style={{ width: w, height: 16, borderRadius: 4, background: s.legal ? (s.kind === "window" ? C.cyan : C.violet) : C.coral, opacity: 0.9 }} />
      </div>
      <div style={{ width: 90, fontFamily: FONT.mono, fontSize: FT.meta, color: C.inkFaint }}>{s.months} 个月</div>
    </div>
  );
};

/** 场景壳：统一章节条与进度。 */
export const Scene: React.FC<{ id: string; children: React.ReactNode }> = ({ id, children }) => {
  const f = useCurrentFrame();
  const i = SCENES.findIndex((s) => s.id === id);
  const s = SCENES[Math.max(0, i)];
  const dur = Math.max(1, Math.round(s.dur * FPS));
  return (
    <SceneShell>
      <ChapterBar chapter={s.chapter} index={i + 1} total={SCENES.length} progress={Math.min(1, f / dur)} />
      {children}
    </SceneShell>
  );
};
