import React from "react";
import { Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { C, FONT, FT, FT_T, G } from "../design/tokens";
import { ChapterBar, SceneShell } from "../design/Scene";
import { SCENES, LINES, FPS } from "./script";
import introJson from "../../data/tsint-01-intro-why-time-series/intro.json";

/* 本片共用件：数据形状、场景壳、数字/卡片/折线/柱条，以及原文图版。 */

type Slice = { name: string; rows: number; bytes: number; sha256: string; sha12: string; codes: number; kind: string; note: string };
type Point = { d: string; c: number };

export type Intro = {
  meta: { episode: number; bookPages: string; snapshot: string; statusCommand: string; exportCommand: string; testCommand: string; ghc: string; cabal: string };
  lake: {
    barsDaily: number; barsMinute: number; instruments: number; adjEvents: number; calendar: number;
    indexDaily: number; indexMembers: number; dailyFrom: string; dailyTo: string; dailyCodes: number;
    minuteFrom: string; minuteTo: string; minuteCodes: number; sizeMb: number;
  };
  slices: Slice[];
  totals: { rows: number; count: number; bytes: number };
  series: {
    code: string; name: string; points: Point[];
    stats: {
      n: number; first: number; last: number; min: number; max: number;
      firstMean: number; lastMean: number; acfPrice: number; acfReturn: number;
      maxGap: number; maxGapFrom: string; maxGapTo: string; gaps: number; gapOver3: number; gapOver20?: number;
    };
    gapHist: { label: string; lo: number; hi: number; count: number }[];
  };
  tests: { pass: number; modules: number; moduleCounts: Record<string, number> };
};

export const V = introJson as unknown as Intro;

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

/** 全精度数字：屏幕上的值必须与 JSON 逐位一致，不做四舍五入。 */
export const Num: React.FC<{ value: number; size?: number; color?: string }> = ({ value, size = FT.num, color = C.ink }) => (
  <span style={{ fontFamily: FONT.mono, fontSize: size, color, fontVariantNumeric: "tabular-nums", letterSpacing: -0.5 }}>{String(value)}</span>
);

export const K: React.FC<{ children: React.ReactNode; color?: string }> = ({ children, color = C.inkFaint }) => (
  <span style={{ fontFamily: FONT.mono, fontSize: FT.micro, letterSpacing: FT_T.micro, color }}>{children}</span>
);

export const Chip: React.FC<{ children: React.ReactNode; color?: string }> = ({ children, color = C.coral }) => (
  <span style={{
    display: "inline-block", padding: "2px 8px", borderRadius: 6,
    border: "1px solid " + color, color, fontFamily: FONT.mono, fontSize: FT.micro,
  }}>{children}</span>
);

/** 原文短摘录：只摘一句定义；页码与许可必须可见。 */
export const Quote: React.FC<{ lines: string[]; width?: number; label?: string; source?: string }> = ({
  lines, width = 860, label = "原文 · p.1 · 1.1 初识时间序列", source = "《时序智能》p.1 · 短摘录 · CC BY-NC-ND 4.0",
}) => (
  <Card label={label} accent={C.inkFaint} pad={20} style={{ width }}>
    {lines.map((q, i) => (
      <div key={i} style={{ fontFamily: FONT.serif, fontSize: FT.h2, color: C.inkDim, lineHeight: 1.6, marginTop: i ? 10 : 0 }}>
        {q}
      </div>
    ))}
    <div style={{ marginTop: 12, fontFamily: FONT.mono, fontSize: FT.micro, color: C.inkFaint }}>{source}</div>
  </Card>
);

/** 原文图版：图号与页码贴在图下，许可跟在最后。 */
export const Figure: React.FC<{
  file: string; label: string; caption: string; width: number; height: number; source?: string;
}> = ({ file, label, caption, width, height, source = "《时序智能》 · CC BY-NC-ND 4.0" }) => (
  <Card label={label} accent={C.inkFaint} pad={14} style={{ width }}>
    <div style={{ width: width - 28, height, background: C.paper, borderRadius: 8, overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <Img src={staticFile(file)} style={{ width: "100%", height: "100%", objectFit: "contain" }} />
    </div>
    <div style={{ marginTop: 8, fontFamily: FONT.mono, fontSize: FT.micro, color: C.inkFaint }}>{caption}</div>
    <div style={{ fontFamily: FONT.mono, fontSize: FT.micro, color: C.inkFaint }}>{source}</div>
  </Card>
);

/** 折线图：给定投影函数，按 frame 从 0 描到 1。 */
export const Plot: React.FC<{
  w: number; h: number; at: number; dur?: number;
  x: (v: number) => number; y: (v: number) => number;
  series: { pts: { x: number; y: number }[]; color: string; width?: number; dash?: boolean; dot?: boolean; fill?: boolean }[];
  grid?: { x: number[]; y: number[]; fmtX?: (v: number) => string; fmtY?: (v: number) => string };
}> = ({ w, h, at, dur = 40, x, y, series, grid }) => {
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

/** 600519 全历史收盘价：横轴是真实日历天，53 天空档就能被看见。 */
const EPOCH = Date.parse("2001-08-27T00:00:00Z");
const DAY = 86400000;
const dayOf = (d: string) => (Date.parse(d + "T00:00:00Z") - EPOCH) / DAY;

export const PricePlot: React.FC<{ w: number; h: number; at: number }> = ({ w, h, at }) => {
  const f = useCurrentFrame();
  const p = pct(f, at, at + 55);
  const st = V.series.stats;
  const pts = V.series.points;
  const maxD = dayOf(pts[pts.length - 1].d);
  const maxC = 2700;
  const x = (d: number) => 58 + (d / maxD) * (w - 80);
  const y = (c: number) => h - 34 - (c / maxC) * (h - 64);
  const path = pts
    .filter((_, i) => i % 2 === 0 || i === pts.length - 1)
    .map((q, i) => (i === 0 ? "M" : "L") + x(dayOf(q.d)).toFixed(1) + "," + y(q.c).toFixed(1))
    .join(" ");
  const cid = "price" + React.useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const gx = ["2001", "2006", "2011", "2016", "2021", "2026"].map((yr) => ({ yr, d: dayOf(yr + "-01-01") }));
  const gy = [0, 500, 1000, 1500, 2000, 2500];
  const gx0 = x(dayOf(st.maxGapFrom));
  return (
    <svg width={w} height={h} style={{ display: "block", overflow: "visible" }}>
      <defs><clipPath id={cid}><rect x={0} y={0} width={w} height={h} /></clipPath></defs>
      {gx.map((g) => <line key={g.yr} x1={x(g.d)} y1={0} x2={x(g.d)} y2={h - 34} stroke={C.panelLine} strokeWidth={1} opacity={0.45} />)}
      {gy.map((v) => <line key={v} x1={58} y1={y(v)} x2={w} y2={y(v)} stroke={C.panelLine} strokeWidth={1} opacity={0.45} />)}
      {gx.map((g) => (
        <text key={g.yr} x={x(g.d)} y={h - 12} textAnchor="middle" fill={C.inkFaint} fontFamily={FONT.mono} fontSize={FT.micro}>{g.yr}</text>
      ))}
      {gy.map((v) => (
        <text key={v} x={48} y={y(v) + 5} textAnchor="end" fill={C.inkFaint} fontFamily={FONT.mono} fontSize={FT.micro}>{String(v)}</text>
      ))}
      {/* 53 天空档：在日线图上是一条几乎垂直的跳空 */}
      <rect x={gx0 - 5} y={0} width={10} height={h - 34} fill={C.coral} opacity={0.18 * p} />
      <line x1={gx0} y1={0} x2={gx0} y2={h - 34} stroke={C.coral} strokeWidth={1.5} strokeDasharray="4 4" opacity={0.85 * p} />
      <text x={gx0 + 10} y={22} fill={C.coral} fontFamily={FONT.mono} fontSize={FT.micro} opacity={p}>{"53 天"}</text>
      <g clipPath={"url(#" + cid + ")"}>
        <path d={path} fill="none" stroke={C.cyan} strokeWidth={2.2} strokeLinejoin="round" strokeLinecap="round" pathLength={1} strokeDasharray={p + " 1"} />
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
