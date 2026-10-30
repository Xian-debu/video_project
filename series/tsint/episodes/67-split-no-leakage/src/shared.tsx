import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { C, FONT, FT, FT_T, G } from "../design/tokens";
import { ChapterBar, SceneShell } from "../design/Scene";
import { SCENES, LINES, FPS } from "./script";
import splitJson from "../../data/tsint-67-split-no-leakage/split.json";

/* 本片共用件：E67 的数据形状、场景壳、数字/卡片/时间轴。 */

export type PanelRow = {
  code: string; name: string; n: number; trainEnd: string;
  trainRows: number; testRows: number; matchesShared: boolean;
};
export type SplitData = {
  meta: {
    episode: number; bookPages: string; tests: number; symbols: number;
    rowsRaw: number; rows: number; first: string; last: string; panelRows: number;
    tsBaseCommit: string; command: string; predictor: string;
  };
  split: {
    n: number; train: number; val: number; test: number;
    trainEnd: string; valStart: string; testStart: string; last: string; chronoLeaks: number;
    shuffle: { seed: number; train: number; val: number; test: number; leaks: number; leakKinds: string[]; futureTestPoints: number };
    leakProbe: { chronoMse: number; shuffleMse: number; ratio: number };
  };
  fixed: {
    f: number; trainN: number; testN: number; testStart: string; testEnd: string;
    naive: { train_mse: number; test_mse: number; gap: number };
    linear: { train_mse: number; test_mse: number; gap: number };
  };
  rolling: {
    f: number; nInit: number; step: number; rounds: number; mean: number;
    min: number; max: number; lastTrainEnd: number; lastTestEnd: number; errors: number[];
  };
  panel: {
    symbols: number; sharedTrainEnd: string; sharedTestStart: string;
    distinctTrainEndDates: number; symbolsDifferingFromShared: number;
    minTrainEnd: string; maxTrainEnd: string; trainRowsMin: number; trainRowsMax: number;
    testRowsMin: number; testRowsMax: number; dateViolations: number; rows: PanelRow[];
  };
  examples: {
    n10: { n: number; trainIdx: number[]; valIdx: number[]; testIdx: number[] };
    n100: { n: number; f: number; nInit: number; s: number; rounds: number; lastTrainEnd: number };
  };
  evidence: { path: string; metrics: Record<string, number>; checks: Record<string, boolean>; tests: number };
};

export const M = splitJson as unknown as SplitData;

export const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
export const pct = (f: number, a: number, b: number) => interpolate(f, [a, b], [0, 1], clamp);
export const PAD = G.pad;
export const CW = 1920 - PAD * 2;

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
  lines, width = 860, label = "原文 · p.199–204 · 8.4.3 / 8.6.1", source = "《时序智能》p.199–204 · 短摘录 · CC BY-NC-ND 4.0",
}) => (
  <Card label={label} accent={C.inkFaint} pad={20} style={{ width }}>
    {lines.map((q, i) => (
      <div key={i} style={{ fontFamily: FONT.serif, fontSize: FT.body, color: C.inkDim, lineHeight: 1.64, marginTop: i ? 10 : 0 }}>{q}</div>
    ))}
    <div style={{ marginTop: 12, fontFamily: FONT.mono, fontSize: FT.micro, color: C.inkFaint }}>{source}</div>
  </Card>
);

/** 100 个点：同一份预测，一眼看到「全判正常」。 */
export const DotGrid: React.FC<{ w: number; h: number; at: number; anomaly?: number; caught?: number }> = ({ w, h, at, anomaly = 37, caught = 0 }) => {
  const f = useCurrentFrame();
  const p = pct(f, at, at + 24);
  const cols = 10, rows = 10;
  const gap = w / cols;
  return (
    <svg width={w} height={h} style={{ display: "block" }}>
      {Array.from({ length: cols * rows }).map((_, i) => {
        const x = (i % cols) * gap + gap / 2;
        const y = Math.floor(i / cols) * (h / rows) + h / rows / 2;
        const isA = i === anomaly;
        const hit = isA && caught > 0;
        return <circle key={i} cx={x} cy={y} r={isA ? 6 : 3.4} fill={isA ? (hit ? C.coral : C.coral) : C.inkFaint}
          opacity={p * (isA ? 1 : 0.55)} stroke={isA && !hit ? C.coral : undefined} strokeWidth={isA && !hit ? 1.5 : 0} />;
      })}
    </svg>
  );
};

/** 2600 点时间轴：三段色带 + 少量抽样刻点；shuffle 行按随机色散点。 */
export const TimeAxis: React.FC<{
  w: number; h: number; at: number; mode: "chrono" | "shuffle";
  trainPct: number; valPct: number; testPct: number; dates?: boolean;
}> = ({ w, h, at, mode, trainPct, valPct, testPct, dates = true }) => {
  const f = useCurrentFrame();
  const p = pct(f, at, at + 36);
  const n = 260;
  const x = (i: number) => (i / (n - 1)) * w;
  const band = h * 0.26, top = h * 0.22;
  const split1 = trainPct * w, split2 = (trainPct + valPct) * w;
  const colors = [C.cyan, C.violet, C.amber];
  // deterministic pseudo-random shuffle assignment
  const shuffled = (i: number) => {
    const hsh = Math.sin(i * 12.9898 + 42) * 43758.5453;
    return hsh - Math.floor(hsh);
  };
  return (
    <svg width={w} height={h} style={{ display: "block", overflow: "visible" }}>
      {mode === "chrono" ? (
        <>
          <rect x={0} y={top} width={split1 * p} height={band} fill={colors[0]} opacity={0.85} />
          <rect x={split1} y={top} width={(split2 - split1) * p} height={band} fill={colors[1]} opacity={0.85} />
          <rect x={split2} y={top} width={(w - split2) * p} height={band} fill={colors[2]} opacity={0.85} />
          {Array.from({ length: n }).map((_, i) => (
            <circle key={i} cx={x(i)} cy={top + band + 18} r={1.9} fill={C.inkFaint} opacity={0.55 * p} />
          ))}
        </>
      ) : (
        <>
          <rect x={0} y={top} width={w * p} height={band} fill={C.panelLine} opacity={0.7} />
          {Array.from({ length: n }).map((_, i) => {
            const r = shuffled(i);
            const c = r < trainPct ? colors[0] : r < trainPct + valPct ? colors[1] : colors[2];
            const yy = top + band / 2 + (shuffled(i + 991) - 0.5) * band * 0.8;
            return <circle key={i} cx={x(i)} cy={yy} r={2.1} fill={c} opacity={0.85 * p} />;
          })}
          {Array.from({ length: n }).map((_, i) => (
            <circle key={"b" + i} cx={x(i)} cy={top + band + 18} r={1.9} fill={C.inkFaint} opacity={0.55 * p} />
          ))}
        </>
      )}
      <line x1={0} y1={top + band + 8} x2={w * p} y2={top + band + 8} stroke={C.panelLine} />
      {dates ? (
        <>
          <text x={0} y={h - 4} fill={C.inkFaint} fontFamily={FONT.mono} fontSize={FT.micro}>2015-01-05</text>
          <text x={w} y={h - 4} textAnchor="end" fill={C.inkFaint} fontFamily={FONT.mono} fontSize={FT.micro}>2025-09-10</text>
        </>
      ) : null}
    </svg>
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
