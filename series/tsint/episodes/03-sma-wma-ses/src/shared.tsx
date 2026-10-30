import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { C, FONT, FT, FT_T, G } from "../design/tokens";
import { ChapterBar, SceneShell } from "../design/Scene";
import { SCENES, LINES, FPS } from "./script";
import smoothingJson from "../../data/tsint-03-sma-wma-ses/smoothing.json";

/* 本片共用件：E03 的数据形状、日线窗口图、阶跃响应图与场景壳。 */

export type Win = {
  start: string; end: string;
  dates: string[]; close: number[]; sma5: number[]; sma20: number[]; sma60: number[];
  wma_linear20: number[]; ses_2_21: number[]; ses_0_5: number[];
};
export type Step = { sma20: number[]; ses_2_21: number[]; ses_0_5: number[]; wma_linear20: number[] };

export type SmoothData = {
  meta: {
    episode: number; bookPages: string; tsBaseCommit: string; evidenceRunAt: string; command: string;
    seed: number;
    tests: { new: number; sma: number; wma: number; ses: number; suite_total: number };
    checks: { all: boolean; total: number }; evidencePath: string;
  };
  data: {
    daily: { rows: number; first: string; last: string; min: number; max: number; mean: number; bytes: number; sha256: string };
    intraday: { rows: number; first: string; last: string; bar_minutes: number; bytes: number; sha256: string };
    firstClose: number; lastClose: number; gainPct: number; rows: number;
  };
  centroids: { sma20: number; ses_2_21: number; ses_0_5: number; wma_linear20: number; wma_tri20: number };
  bridge: { alpha_for_20: number; window_for_alpha: number; centroid_diff: number };
  step: {
    reach_half: { sma20: number; ses_2_21: number; ses_0_5: number };
    reach_95: { sma20: number; ses_2_21: number };
    measured_centroid: { sma20: number; ses_2_21: number; ses_0_5: number; wma_linear20: number };
  };
  dailyCompare: { corr_sma20_ses21: number; max_abs_diff: number; mean_abs_diff: number; sma20_last: number; ses21_last: number; close_last: number };
  init: { max_diff_first5: number; max_diff_after100: number };
  drift: { n: number; window: number; inc_vs_direct: number; ctrl_vs_direct: number; last_incremental: number; last_direct: number };
  frequency: { daily_bar_minutes: number; intraday_bar_minutes: number; daily_window_minutes: number; intraday_window_minutes: number; ratio: number; intraday_sma20_last: number; intraday_sma20_min: number; intraday_sma20_max: number };
  window: Win;
  stepSeries: Step;
  intradaySeries: { bar_time: string[]; close: number[]; sma20: (number | null)[] };
  weights: { linear20: number[]; tri20: number[] };
  golden: { sma: { n: number; x: number[]; y: number[] }; ses: { alpha: number; s0: number; x: number[]; y: number[] } };
  manifest: { dailyBytes: number; dailySha256: string; intraBytes: number; intraSha256: string; intraBars: number };
};

export const M = smoothingJson as unknown as SmoothData;

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

/** 场景内分页：按场景时长的分数切页，页间 12 帧交叉淡变。 */
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
        const outO = last ? 1 : interpolate(f, [b - fade, b], [1, 0], clamp);
        const o = Math.min(inO, outO);
        if (o <= 0.001) return null;
        return <div key={i} style={{ position: "absolute", inset: 0, opacity: o }}>{child}</div>;
      })}
    </>
  );
};

type SeriesKey = "close" | "sma5" | "sma20" | "sma60" | "wma_linear20" | "ses_2_21" | "ses_0_5";

const PLOT_COLORS: Record<SeriesKey, string> = {
  close: C.inkFaint, sma5: C.cyan, sma20: C.amber, sma60: C.violet,
  wma_linear20: C.coral, ses_2_21: C.cyan, ses_0_5: C.violet,
};

/** 日线窗口图：原始收盘价 + 若干条平滑线，右端对齐到同一根 K 线。 */
export const SmoothingPlot: React.FC<{
  win?: Win; shows: SeriesKey[]; width: number; height: number;
  at?: number; title?: string; padL?: number; padB?: number; legend?: boolean;
}> = ({ win = M.window, shows, width, height, at = 0, title, padL = 92, padB = 54, legend = true }) => {
  const f = useCurrentFrame();
  const p = at > 0 ? pct(f, at, at + 20) : 1;
  const padT = 34, padR = 26;
  const vals: number[] = [];
  for (const v of win.close) vals.push(v);
  for (const s of shows) if (s !== "close") for (const v of win[s]) vals.push(v);
  const lo = Math.min(...vals), hi = Math.max(...vals);
  const dy = (hi - lo) * 0.1 || 1;
  const y0 = lo - dy, y1 = hi + dy;
  const n = win.close.length;
  const sx = (i: number) => padL + (i / (n - 1)) * (width - padL - padR);
  const sy = (v: number) => height - padB - ((v - y0) / (y1 - y0)) * (height - padT - padB);
  const path = (arr: number[]) => arr.map((v, i) => (i === 0 ? "M" : "L") + sx(i).toFixed(1) + "," + sy(v).toFixed(1)).join(" ");
  const yTicks = [0, 0.5, 1].map((t) => y0 + (y1 - y0) * t);
  const names: Record<SeriesKey, string> = {
    close: "收盘价", sma5: "SMA 5", sma20: "SMA 20", sma60: "SMA 60",
    wma_linear20: "WMA 线性 20", ses_2_21: "SES 2/21", ses_0_5: "SES 0.5",
  };
  return (
    <svg width={width} height={height} style={{ display: "block" }}>
      {yTicks.map((v) => (
        <g key={"y" + v}>
          <line x1={padL} y1={sy(v)} x2={width - padR} y2={sy(v)} stroke={C.panelLine} strokeWidth={1} opacity={0.7} />
          <text x={padL - 12} y={sy(v) + 4} textAnchor="end" fill={C.inkFaint} fontFamily={FONT.mono} fontSize={FT.micro}>{v.toFixed(0)}</text>
        </g>
      ))}
      <path d={path(win.close)} fill="none" stroke={C.inkFaint} strokeWidth={1.3} opacity={0.8} />
      {shows.filter((s) => s !== "close").map((s) => (
        <path key={s} d={path(win[s])} fill="none" stroke={PLOT_COLORS[s]} strokeWidth={2.4} opacity={p * 0.95} />
      ))}
      {[0, 0.25, 0.5, 0.75, 1].map((t) => {
        const i = Math.round(t * (n - 1));
        return (
          <text key={"x" + t} x={sx(i)} y={height - padB + 24} textAnchor="middle" fill={C.inkFaint} fontFamily={FONT.mono} fontSize={FT.micro}>
            {win.dates[i].slice(5)}
          </text>
        );
      })}
      <text x={padL} y={padT - 10} fill={C.inkFaint} fontFamily={FONT.mono} fontSize={FT.micro}>
        {title ?? win.start + " → " + win.end + " · 前复权价 · 120 个交易日"}
      </text>
      {legend ? (
        <g>
          <g transform={"translate(" + padL + "," + (height - 10) + ")"}>
            <rect x={0} y={-7} width={22} height={3} fill={PLOT_COLORS.close} rx={1.5} />
            <text x={28} y={0} fill={C.inkDim} fontFamily={FONT.mono} fontSize={FT.micro}>收盘价</text>
          </g>
          {shows.filter((s) => s !== "close").map((s, i) => (
            <g key={"lg" + s} transform={"translate(" + (padL + 116 + i * 168) + "," + (height - 10) + ")"}>
              <rect x={0} y={-7} width={22} height={3} fill={PLOT_COLORS[s]} rx={1.5} />
              <text x={28} y={0} fill={C.inkDim} fontFamily={FONT.mono} fontSize={FT.micro}>{names[s]}</text>
            </g>
          ))}
        </g>
      ) : null}
    </svg>
  );
};

/** 阶跃响应图：横轴步数，纵轴输出 0–1；可选画 50% / 95% 两条参考线与一条面积填充。 */
export const StepPlot: React.FC<{
  curves: ("sma20" | "ses_2_21" | "ses_0_5" | "wma_linear20")[];
  width: number; height: number; at?: number;
  marks?: ("half" | "ninetyFive")[]; area?: "sma20" | "ses_2_21";
  padL?: number; padB?: number; title?: string; legend?: boolean;
}> = ({ curves, width, height, at = 0, marks = [], area, padL = 74, padB = 46, title, legend = true }) => {
  const f = useCurrentFrame();
  const p = at > 0 ? pct(f, at, at + 20) : 1;
  const padT = 30, padR = 26;
  const data = M.stepSeries;
  const n = data.sma20.length;
  const sx = (i: number) => padL + (i / (n - 1)) * (width - padL - padR);
  const sy = (v: number) => height - padB - v * (height - padT - padB);
  const path = (arr: number[]) => arr.map((v, i) => (i === 0 ? "M" : "L") + sx(i).toFixed(1) + "," + sy(v).toFixed(1)).join(" ");
  const names: Record<string, string> = { sma20: "SMA 20", ses_2_21: "SES 2/21", ses_0_5: "SES 0.5", wma_linear20: "WMA 线性 20" };
  const colors: Record<string, string> = { sma20: C.amber, ses_2_21: C.cyan, ses_0_5: C.violet, wma_linear20: C.coral };
  const areaPath = (key: "sma20" | "ses_2_21") =>
    path(data[key]) + " L" + sx(n - 1).toFixed(1) + "," + sy(0).toFixed(1) + " L" + sx(0).toFixed(1) + "," + sy(0).toFixed(1) + " Z";
  return (
    <svg width={width} height={height} style={{ display: "block" }}>
      {[0, 0.5, 1].map((v) => (
        <g key={"y" + v}>
          <line x1={padL} y1={sy(v)} x2={width - padR} y2={sy(v)} stroke={C.panelLine} strokeWidth={1} opacity={0.7} />
          <text x={padL - 12} y={sy(v) + 4} textAnchor="end" fill={C.inkFaint} fontFamily={FONT.mono} fontSize={FT.micro}>{v.toFixed(1)}</text>
        </g>
      ))}
      {marks.includes("half") ? (
        <g>
          <line x1={padL} y1={sy(0.5)} x2={width - padR} y2={sy(0.5)} stroke={C.coral} strokeWidth={1} strokeDasharray="6 5" opacity={0.55} />
          <text x={width - padR} y={sy(0.5) - 8} textAnchor="end" fill={C.coral} fontFamily={FONT.mono} fontSize={FT.micro}>50%</text>
        </g>
      ) : null}
      {marks.includes("ninetyFive") ? (
        <g>
          <line x1={padL} y1={sy(0.95)} x2={width - padR} y2={sy(0.95)} stroke={C.inkFaint} strokeWidth={1} strokeDasharray="2 5" opacity={0.7} />
          <text x={width - padR} y={sy(0.95) - 8} textAnchor="end" fill={C.inkFaint} fontFamily={FONT.mono} fontSize={FT.micro}>95%</text>
        </g>
      ) : null}
      {area ? <path d={areaPath(area)} fill={colors[area]} opacity={0.09} /> : null}
      {curves.map((k) => (
        <path key={k} d={path(data[k])} fill="none" stroke={colors[k]} strokeWidth={2.6} opacity={p * 0.96} />
      ))}
      {[0, 10, 20, 30, 40, 50, 60, 70].map((i) => (
        <text key={"x" + i} x={sx(i)} y={height - padB + 22} textAnchor="middle" fill={C.inkFaint} fontFamily={FONT.mono} fontSize={FT.micro}>{i}</text>
      ))}
      <text x={padL} y={padT - 8} fill={C.inkFaint} fontFamily={FONT.mono} fontSize={FT.micro}>
        {title ?? "阶跃响应：输入从 0 跳到 1，看输出多久跟上"}
      </text>
      {legend ? (
        <g>
          {curves.map((k, i) => (
            <g key={"lg" + k} transform={"translate(" + (padL + i * 168) + "," + (height - 8) + ")"}>
              <rect x={0} y={-7} width={22} height={3} fill={colors[k]} rx={1.5} />
              <text x={28} y={0} fill={C.inkDim} fontFamily={FONT.mono} fontSize={FT.micro}>{names[k]}</text>
            </g>
          ))}
        </g>
      ) : null}
    </svg>
  );
};

/** 横向条形组。 */
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
