import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { C, FONT, FT, FT_T, G } from "../design/tokens";
import { ChapterBar, SceneShell } from "../design/Scene";
import { SCENES, LINES, FPS } from "./script";
import metricsJson from "../../data/tsint-65-error-metrics-trio/metrics.json";

/* 本片共用件：E65 的数据形状、场景壳、数字/卡片/公式/散点。 */

export type Level = {
  code: string; name: string; mae: number; rmse: number; mapePct: number; mase5: number;
  rankMae: number; rankRmse: number; rankMape: number; rankMase: number;
};
export type Metrics = {
  meta: {
    episode: number; bookPages: string; dataWindow: string; stocks: number; rows: number;
    train: string; test: string; forecast: string; season: number; tests: number;
    tsBaseCommit: string; source: string; command: string;
  };
  example: { a: { mse: number; rmse: number; mae: number }; b: { mse: number; rmse: number; mae: number } };
  levels: Level[];
  mase: { median: number; belowOne: number; min: number; minName: string; max: number; maxName: string; values: { code: string; name: string; mase5: number }[] };
  divergence: {
    changjiang: { name: string; mae: number; mapePct: number; rankMae: number; rankMape: number };
    maotai: { name: string; mae: number; mapePct: number; rankMae: number; rankMape: number };
  };
  returns: { code: string; name: string; n: number; negative: number; zero: number; valid: number; skipped: number; mapePct: number; smapePct: number; mpePct: number }[];
  checks: Record<string, boolean>;
};

export const M = metricsJson as unknown as Metrics;

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

export const Num: React.FC<{ value: number; size?: number; color?: string }> = ({ value, size = FT.num, color = C.ink }) => (
  <span style={{ fontFamily: FONT.mono, fontSize: size, color, fontVariantNumeric: "tabular-nums", letterSpacing: -0.5 }}>{String(value)}</span>
);

export const K: React.FC<{ children: React.ReactNode; color?: string }> = ({ children, color = C.inkFaint }) => (
  <span style={{ fontFamily: FONT.mono, fontSize: FT.micro, letterSpacing: FT_T.micro, color }}>{children}</span>
);

export const Chip: React.FC<{ children: React.ReactNode; color?: string }> = ({ children, color = C.coral }) => (
  <span style={{ display: "inline-block", padding: "2px 8px", borderRadius: 6, border: "1px solid " + color, color, fontFamily: FONT.mono, fontSize: FT.micro }}>{children}</span>
);

/** 原文短摘录：本集只摘 p.205 的一句指认，公式由正文给出，不冒充原文。 */
export const Quote: React.FC<{ lines: string[]; width?: number; label?: string; source?: string }> = ({
  lines, width = 860, label = "原文 · p.205 · 8.6.2 评估指标的选择", source = "《时序智能》p.205 · 短摘录 · CC BY-NC-ND 4.0",
}) => (
  <Card label={label} accent={C.inkFaint} pad={20} style={{ width }}>
    {lines.map((q, i) => (
      <div key={i} style={{ fontFamily: FONT.serif, fontSize: FT.h3, color: C.inkDim, lineHeight: 1.6, marginTop: i ? 10 : 0 }}>{q}</div>
    ))}
    <div style={{ marginTop: 12, fontFamily: FONT.mono, fontSize: FT.micro, color: C.inkFaint }}>{source}</div>
  </Card>
);

/** 折线/散点：给定投影函数，按 frame 从 0 描到 1；可挂少量直接标注。 */
export const Plot: React.FC<{
  w: number; h: number; at: number; dur?: number;
  x: (v: number) => number; y: (v: number) => number;
  series: { pts: { x: number; y: number }[]; color: string; width?: number; dash?: boolean; dot?: boolean; fill?: boolean }[];
  grid?: { x: number[]; y: number[]; fmtX?: (v: number) => string; fmtY?: (v: number) => string };
  labels?: { x: number; y: number; text: string; color?: string; dx?: number; dy?: number; anchor?: "start" | "middle" | "end" }[];
}> = ({ w, h, at, dur = 40, x, y, series, grid, labels = [] }) => {
  const f = useCurrentFrame();
  const p = pct(f, at, at + dur);
  const cid = "fplot" + React.useId().replace(/[^a-zA-Z0-9_-]/g, "");
  return (
    <svg width={w} height={h} style={{ display: "block", overflow: "visible" }}>
      <defs><clipPath id={cid}><rect x={0} y={0} width={w} height={h} /></clipPath></defs>
      {grid ? (
        <>
          {grid.x.map((v) => <line key={"gx" + v} x1={x(v)} y1={0} x2={x(v)} y2={h} stroke={C.panelLine} strokeWidth={1} opacity={0.5} />)}
          {grid.y.map((v) => <line key={"gy" + v} x1={0} y1={y(v)} x2={w} y2={y(v)} stroke={C.panelLine} strokeWidth={1} opacity={0.5} />)}
          {grid.x.map((v) => (
            <text key={"tx" + v} x={x(v)} y={h - 10} textAnchor="middle" fill={C.inkFaint} fontFamily={FONT.mono} fontSize={FT.micro}>{grid.fmtX ? grid.fmtX(v) : String(v)}</text>
          ))}
          {grid.y.map((v) => (
            <text key={"ty" + v} x={-10} y={y(v) + 5} textAnchor="end" fill={C.inkFaint} fontFamily={FONT.mono} fontSize={FT.micro}>{grid.fmtY ? grid.fmtY(v) : String(v)}</text>
          ))}
        </>
      ) : null}
      <g clipPath={"url(#" + cid + ")"}>
        {series.map((s, si) => {
          const pts = s.pts.map((q) => x(q.x).toFixed(1) + "," + y(q.y).toFixed(1)).join(" ");
          const dots = s.dot && p > 0.98 ? s.pts : [];
          return (
            <g key={si}>
              {s.fill ? <polygon points={"0," + h + " " + pts + " " + w + "," + h} fill={s.color} opacity={0.07 * p} /> : null}
              <polyline points={pts} fill="none" stroke={s.color} strokeWidth={s.width ?? 2.5}
                strokeLinejoin="round" strokeLinecap="round" pathLength={1}
                strokeDasharray={s.dash ? undefined : p + " 1"} opacity={s.dash ? 0.75 : 1} />
              {dots.map((q, i) => <circle key={i} cx={x(q.x)} cy={y(q.y)} r={4.5} fill={s.color} />)}
            </g>
          );
        })}
      </g>
      {labels.map((l, i) => (
        <text key={i} x={x(l.x) + (l.dx ?? 10)} y={y(l.y) + (l.dy ?? -10)} textAnchor={l.anchor ?? "start"}
          fill={l.color ?? C.inkDim} fontFamily={FONT.sans} fontSize={FT.meta} opacity={p}>
          {l.text}
        </text>
      ))}
    </svg>
  );
};

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
