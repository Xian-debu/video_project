import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { C, FONT, FT, FT_T, G } from "../design/tokens";
import { ChapterBar, SceneShell } from "../design/Scene";
import { SCENES, LINES, FPS } from "./script";
import variantsJson from "../../data/tsint-73-variants-beyond-solver/variants.json";

/* 本片共用件：数据形状、场景壳、数字/卡片/折线，以及原文短摘录。 */

type Variants = {
  meta: {
    episode: number; title: string; bookPage: number; tsBaseCommit: string;
    evidenceRunAt: string; ghc: string; cabal: string; evidenceSha: string; tests: number;
  };
  key: {
    ago: number[]; iago: number[]; seriesN: number; seriesQ: number; seriesX0: number;
    a: number; b: number; mape: number; rk4MaxError: number; forecastLast: number;
    cfcX0: number; cfcA: number; cfcF: number;
    softplusRaw: number; softplusNaive: string; softplusStable: number;
    logSumExp: number; evalsClosed: number; evalsRK4: number;
  };
  fit: { k: number; actual: number; ago: number; response: number; forecast: number }[];
  rk4: { k: number; closed: number; rk4: number }[];
  cfc: { t: number; exact: number; gate: number }[];
  softplus: { raw: number; naive: number | null; stable: number }[];
};

export const V = variantsJson as unknown as Variants;

export const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
export const pct = (f: number, a: number, b: number) => interpolate(f, [a, b], [0, 1], clamp);
export const PAD = G.pad;
export const CW = 1920 - PAD * 2;

/* ---------- 与口播同一拍 ---------- */
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

/* ---------- 通用小件 ---------- */
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

/** 全精度数字：屏幕上的值必须与证据逐位一致，不做四舍五入。 */
export const Num: React.FC<{ value: number; size?: number; color?: string }> = ({ value, size = FT.num, color = C.ink }) => (
  <span style={{ fontFamily: FONT.mono, fontSize: size, color, fontVariantNumeric: "tabular-nums", letterSpacing: -0.5 }}>{String(value)}</span>
);

export const K: React.FC<{ children: React.ReactNode; color?: string }> = ({ children, color = C.inkFaint }) => (
  <span style={{ fontFamily: FONT.mono, fontSize: FT.micro, letterSpacing: FT_T.micro, color }}>{children}</span>
);

/** 原文短摘录：本集没有书页图，只摆两段机制原话；页码与许可必须可见。 */
export const Quote: React.FC<{ lines: string[]; width?: number }> = ({ lines, width = 860 }) => (
  <Card label="原文 · p.219 · 9.3 相关应用研究" accent={C.inkFaint} pad={20} style={{ width }}>
    {lines.map((q, i) => (
      <div key={i} style={{ fontFamily: FONT.serif, fontSize: FT.h3, color: C.inkDim, lineHeight: 1.6, marginTop: i ? 10 : 0 }}>
        {q}
      </div>
    ))}
    <div style={{ marginTop: 12, fontFamily: FONT.mono, fontSize: FT.micro, color: C.inkFaint }}>
      {"《时序智能》p.219 · 短摘录 · CC BY-NC-ND 4.0"}
    </div>
  </Card>
);

/** 折线/散点图：给定投影函数，按 frame 从 0 描到 1。null 断线。 */
export const Plot: React.FC<{
  w: number; h: number; at: number; dur?: number;
  x: (v: number) => number; y: (v: number) => number;
  series: { pts: { x: number; y: number }[]; color: string; width?: number; dash?: boolean; dot?: boolean; fill?: boolean }[];
  grid?: { x: number[]; y: number[]; fmtX?: (v: number) => string; fmtY?: (v: number) => string };
}> = ({ w, h, at, dur = 40, x, y, series, grid }) => {
  const f = useCurrentFrame();
  const p = pct(f, at, at + dur);
  const cid = "plot" + React.useId().replace(/[^a-zA-Z0-9_-]/g, "");
  return (
    <svg width={w} height={h} style={{ display: "block", overflow: "visible" }}>
      <defs><clipPath id={cid}><rect x={0} y={0} width={w} height={h} /></clipPath></defs>
      {grid ? (
        <>
          {grid.x.map((v) => <line key={"gx" + v} x1={x(v)} y1={0} x2={x(v)} y2={h} stroke={C.panelLine} strokeWidth={1} opacity={0.5} />)}
          {grid.y.map((v) => <line key={"gy" + v} x1={0} y1={y(v)} x2={w} y2={y(v)} stroke={C.panelLine} strokeWidth={1} opacity={0.5} />)}
          {grid.x.map((v) => (
            <text key={"tx" + v} x={x(v)} y={h - 10} textAnchor="middle" fill={C.inkFaint} fontFamily={FONT.mono} fontSize={FT.micro}>
              {grid.fmtX ? grid.fmtX(v) : String(v)}
            </text>
          ))}
          {grid.y.map((v) => (
            <text key={"ty" + v} x={-10} y={y(v) + 5} textAnchor="end" fill={C.inkFaint} fontFamily={FONT.mono} fontSize={FT.micro}>
              {grid.fmtY ? grid.fmtY(v) : String(v)}
            </text>
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
              {dots.map((q, i) => <circle key={i} cx={x(q.x)} cy={y(q.y)} r={4} fill={s.color} />)}
            </g>
          );
        })}
      </g>
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
