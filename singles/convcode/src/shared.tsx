import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { C, FONT, FT, FT_T, G } from "../design/tokens";
import { ChapterBar, SceneShell } from "../design/Scene";
import { SourcePlate } from "../design/SourcePlate";
import { SCENES, LINES, FPS } from "./script";
import demoJson from "../../data/convcode/demo.json";
import evalJson from "../../data/convcode/eval.json";
import figuresJson from "../../data/convcode/source-figures.json";

/* 片子共用件：数据类型、原文图版清单、字号与间距、场景壳，以及几件会被两场以上复用的小部件。
 * 每个场景一个文件，放 scenes/ 下。 */

export type Demo = {
  meta: { seed: number; rate: string; constraintLength: number; states: number; infoBits: number; codedBits: number; berFramesPerPoint: number; recoveryFramesPerPoint: number };
  ber: { ebn0Db: number; uncoded: number; hard: number; soft: number }[];
  gain: { berTarget: number; uncodedDb: number; hardDb: number; softDb: number; hardGainDb: number; softGainDb: number };
  frameRecovery: { flips: number; recoveredPct: number }[];
  example: { input: number[]; output0: number[]; output1: number[]; states: number[] };
  interleave: { rows: number; cols: number; burstBits: number; perRow: number[]; maxPerRow: number; kind: string; note: string };
};
export const DEMO = demoJson as unknown as Demo;
export const EV = evalJson as typeof evalJson;

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

/* ---------- 通用小件 ---------- */
export const Head: React.FC<{ kicker: string; title: string; goal?: string }> = ({ kicker, title, goal }) => (
  <div style={{ position: "absolute", left: PAD, top: 92, width: CW }}>
    <div style={{ fontFamily: FONT.mono, fontSize: FT.label, letterSpacing: FT_T.label, color: C.cyan }}>{kicker}</div>
    <div style={{ fontFamily: FONT.serif, fontSize: FT.h1, color: C.ink, marginTop: 10, lineHeight: 1.15 }}>{title}</div>
    {goal ? <div style={{ fontFamily: FONT.sans, fontSize: FT.label, color: C.inkFaint, marginTop: 10 }}>{goal}</div> : null}
  </div>
);

export const Card: React.FC<{ label?: string; accent?: string; children: React.ReactNode; style?: React.CSSProperties; pad?: number }> = ({
  label, accent = C.panelLine, children, style, pad = 26,
}) => (
  <div style={{ background: C.panel, border: "1px solid " + C.panelLine, borderTop: "2px solid " + accent, borderRadius: 14, padding: pad, ...style }}>
    {label ? <div style={{ fontFamily: FONT.mono, fontSize: FT.meta, letterSpacing: FT_T.meta, color: C.inkFaint, marginBottom: 12 }}>{label}</div> : null}
    {children}
  </div>
);

export const Mono: React.FC<{ children: React.ReactNode; size?: number; color?: string; style?: React.CSSProperties }> = ({
  children, size = FT.mono, color = C.ink, style,
}) => <span style={{ fontFamily: FONT.mono, fontSize: size, color, fontVariantNumeric: "tabular-nums", ...style }}>{children}</span>;

export const Body: React.FC<{ children: React.ReactNode; color?: string; size?: number; style?: React.CSSProperties }> = ({
  children, color = C.inkDim, size = FT.body, style,
}) => <div style={{ fontFamily: FONT.sans, fontSize: size, color, lineHeight: 1.6, ...style }}>{children}</div>;

/** 折线：values 归一化到 [lo,hi]；null 断线。pathLength=1 + dasharray 做确定性描边。 */
export const Line: React.FC<{
  values: (number | null)[]; w: number; h: number; lo: number; hi: number;
  color: string; width?: number; at: number; dur?: number; fill?: boolean; log?: boolean;
}> = ({ values, w, h, lo, hi, color, width = 2, at, dur = 40, fill, log }) => {
  const f = useCurrentFrame();
  const p = pct(f, at, at + dur);
  if (!values.length) return null;
  const norm = (v: number) => {
    if (!log) return (v - lo) / (hi - lo || 1);
    const lv = Math.log10(Math.max(v, 1e-12));
    const a = Math.log10(lo), b = Math.log10(hi);
    return (lv - a) / (b - a || 1);
  };
  const pts = values.flatMap((v, i) => {
    if (v === null) return [];
    const x = (i / (values.length - 1)) * w;
    const y = h - norm(v) * h;
    return [x.toFixed(1) + "," + Math.max(0, Math.min(h, y)).toFixed(1)];
  });
  if (pts.length < 2) return null;
  const solid = values.every((v) => v !== null);
  return (
    <svg width={w} height={h} style={{ display: "block", overflow: "visible" }}>
      {fill && solid ? <polygon points={"0," + h + " " + pts.join(" ") + " " + w + "," + h} fill={color} opacity={0.08 * p} /> : null}
      <polyline points={pts.join(" ")} fill="none" stroke={color} strokeWidth={width} strokeLinejoin="round"
        pathLength={1} strokeDasharray={p + " 1"} />
    </svg>
  );
};

/** 原文图版：统一带「原文」角标、页/条号与来源行；片子里唯一允许出现原文的组件。 */
export const Plate: React.FC<{
  id: string; width: number; at?: number; caption?: string; highlight?: { x: number; y: number; w: number; h: number };
}> = ({ id, width, at = 0, caption, highlight }) => {
  const p = plate(id);
  return (
    <SourcePlate
      src={"convcode/plates/" + p.file.split("/").pop()}
      width={width}
      nativeW={p.width ?? 1463}
      nativeH={p.height ?? 500}
      badge={p.doc.replace("TS 45.003 ", "")}
      caption={caption}
      attribution={p.attribution}
      highlight={highlight}
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

/** 比特条：可标出被噪声翻掉的位置。 */
export const BitStrip: React.FC<{
  bits: number[]; w?: number; bitW?: number; h?: number; from?: number; highlight?: number[];
  color?: string; errorColor?: string; label?: string; gap?: number;
}> = ({ bits, w = 0, bitW = 18, h = 30, from = 0, highlight = [], color = C.cyan, errorColor = C.coral, label, gap = 3 }) => {
  const f = useCurrentFrame();
  return (
    <div style={{ width: w || bits.length * (bitW + gap), display: "flex", flexDirection: "column", gap: 6 }}>
      {label ? <div style={{ fontFamily: FONT.mono, fontSize: FT.micro, color: C.inkFaint, letterSpacing: FT_T.micro }}>{label}</div> : null}
      <div style={{ display: "flex", gap }}>
        {bits.map((b, i) => {
          const on = pct(f, from + i * 0.6, from + i * 0.6 + 6);
          const bad = highlight.includes(i);
          return (
            <div key={i} style={{
              width: bitW, height: h, borderRadius: 3,
              background: bad ? errorColor : C.panel,
              border: "1px solid " + (bad ? errorColor : C.panelLine),
              color: bad ? C.bg : b ? color : C.inkFaint,
              fontFamily: FONT.mono, fontSize: FT.tiny, lineHeight: h + "px", textAlign: "center",
              opacity: on * 0.35 + 0.65,
            }}>{b}</div>
          );
        })}
      </div>
    </div>
  );
};

/** 移动的比特流：开场的背景，也用来表达「比特在穿过噪声」。 */
export const Flow: React.FC<{ count?: number; y: number; speed?: number; color?: string; height?: number; seed?: number }> = ({
  count = 46, y, speed = 1, color = C.cyan, height = 8, seed = 7,
}) => {
  const f = useCurrentFrame();
  const w = 1920;
  return (
    <div style={{ position: "absolute", left: 0, top: y, width: w, height, overflow: "hidden" }}>
      {Array.from({ length: count }).map((_, i) => {
        const x = (i * (w / count) + f * speed * (1 + (i % 3) * 0.25) + seed) % (w - 10);
        const on = ((i * 37 + seed) % 9) < 7;
        return <div key={i} style={{ position: "absolute", left: x, top: 0, width: 10, height, background: on ? color : C.panelLine, opacity: on ? 0.8 : 0.35, borderRadius: 2 }} />;
      })}
    </div>
  );
};