import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { C, FONT, FT, FT_T, G } from "../design/tokens";
import { ChapterBar, SceneShell } from "../design/Scene";
import { SourcePlate } from "../design/SourcePlate";
import { SCENES, LINES, FPS } from "./script";
import odeJson from "../../data/tsint-70-ode-solvers-from-scratch/ode.json";
import figuresJson from "../../data/tsint-70-ode-solvers-from-scratch/source-figures.json";

/* 本片共用件：数据形状、原文图版、场景壳，以及折线/数字/卡片这些反复出现的小部件。
 * 每个场景一个文件，放 scenes/ 下。 */

export type Pt = { x: number; v: number };
export type Ode = {
  meta: {
    omega: number; h: number; steps: number; periods: number; tEnd: number; convH: number[];
    evidence: Record<string, string>; tsBaseCommit: string;
    stock: { code: string; window: string; rows: number; source: string };
  };
  key: {
    eulerOneStep: number; rk4OneStep: number; eulerEnergyRatio: number; rk4EnergyRatio: number;
    eulerErr: number; rk4Err: number; eulerOrder: number; rk4Order: number;
  };
  phase: { analytic: Pt[]; euler: Pt[]; rk4: Pt[] };
  energy: { euler: number[]; rk4: number[]; eulerFinal: number; rk4Final: number };
  convergence: { h: number[]; eulerErr: number[]; rk4Err: number[]; eulerSlope: number; rk4Slope: number };
  amplification: { y: number[]; euler: number[]; rk4: number[]; rk4Limit: number };
  stock: { rows: { date: string; v: number }[] };
};
export const ODE = odeJson as unknown as Ode;

type PlateDoc = {
  plates: { id: string; file: string; doc: string; page: string; figure: string; attribution: string; license: string; width?: number; height?: number }[];
};
const FIG = figuresJson as unknown as PlateDoc;
export const plate = (id: string) => {
  const p = FIG.plates.find((x) => x.id === id);
  if (!p) throw new Error("plate not in data/source-figures.json: " + id);
  return p;
};

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

/** 折线/散点图：给定投影函数，按 frame 从 0 描到 1。null 断线。 */
export const Plot: React.FC<{
  w: number; h: number; at: number; dur?: number;
  x: (v: number) => number; y: (v: number) => number;
  series: { pts: { x: number; y: number }[]; color: string; width?: number; dash?: boolean; dot?: boolean; fill?: boolean }[];
  grid?: { x: number[]; y: number[]; fmtX?: (v: number) => string; fmtY?: (v: number) => string };
  axes?: { x: string; y: string };
}> = ({ w, h, at, dur = 40, x, y, series, grid, axes }) => {
  const f = useCurrentFrame();
  const p = pct(f, at, at + dur);
  return (
    <svg width={w} height={h} style={{ display: "block", overflow: "visible" }}>
      {grid ? (
        <>
          {grid.x.map((v) => (
            <line key={"gx" + v} x1={x(v)} y1={0} x2={x(v)} y2={h} stroke={C.panelLine} strokeWidth={1} opacity={0.5} />
          ))}
          {grid.y.map((v) => (
            <line key={"gy" + v} x1={0} y1={y(v)} x2={w} y2={y(v)} stroke={C.panelLine} strokeWidth={1} opacity={0.5} />
          ))}
          {grid.x.map((v) => (
            <text key={"tx" + v} x={x(v)} y={h + 24} textAnchor="middle" fill={C.inkFaint} fontFamily={FONT.mono} fontSize={FT.micro}>
              {grid.fmtX ? grid.fmtX(v) : String(v)}
            </text>
          ))}
          {grid.y.map((v) => (
            <text key={"ty" + v} x={-12} y={y(v) + 5} textAnchor="end" fill={C.inkFaint} fontFamily={FONT.mono} fontSize={FT.micro}>
              {grid.fmtY ? grid.fmtY(v) : String(v)}
            </text>
          ))}
        </>
      ) : null}
      {series.map((s, si) => {
        const pts = s.pts.map((q) => x(q.x).toFixed(1) + "," + y(q.y).toFixed(1)).join(" ");
        const dots = s.dot && p > 0.98 ? s.pts : [];
        return (
          <g key={si}>
            {s.fill ? (
              <polygon points={"0," + h + " " + pts + " " + w + "," + h} fill={s.color} opacity={0.07 * p} />
            ) : null}
            <polyline points={pts} fill="none" stroke={s.color} strokeWidth={s.width ?? 2.5}
              strokeLinejoin="round" strokeLinecap="round" pathLength={1}
              strokeDasharray={s.dash ? undefined : p + " 1"} opacity={s.dash ? 0.75 : 1} />
            {dots.map((q, i) => (
              <circle key={i} cx={x(q.x)} cy={y(q.y)} r={4} fill={s.color} />
            ))}
          </g>
        );
      })}
      {axes ? (
        <>
          <text x={w / 2} y={h + 54} textAnchor="middle" fill={C.inkDim} fontFamily={FONT.sans} fontSize={FT.meta}>{axes.x}</text>
          <text x={-46} y={-14} fill={C.inkDim} fontFamily={FONT.sans} fontSize={FT.meta}>{axes.y}</text>
        </>
      ) : null}
    </svg>
  );
};

/** 原文图版：片子唯一允许出现书页的地方；角标/页码/许可由 SourcePlate 强制。 */
export const Plate: React.FC<{ id: string; width: number; at?: number; caption?: string }> = ({ id, width, at = 0, caption }) => {
  const p = plate(id);
  return (
    <SourcePlate
      src={"tsint-70/plates/" + p.file.split("/").pop()}
      width={width}
      nativeW={p.width ?? 980}
      nativeH={p.height ?? 380}
      badge={p.figure}
      caption={caption}
      attribution={p.attribution}
      at={at}
    />
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
