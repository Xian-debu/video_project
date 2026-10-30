import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { C, FONT, FT, FT_T, G } from "../design/tokens";
import { ChapterBar, SceneShell } from "../design/Scene";
import { SCENES, LINES, FPS } from "./script";
import holtJson from "../../data/tsint-04-holt-and-holt-winters/holt.json";

/* 本片共用件：E04 的数据形状、日线拟合图、季节轮廓图与场景壳。 */

export type Quote = { alpha: number; beta: number; gamma?: number; L?: number };

export type HoltData = {
  meta: {
    episode: number; bookPages: string; tsBaseCommit: string; evidenceRunAt: string; command: string;
    seed: number;
    checks: { total: number; failed: number; manual: number; hw: number; data: number };
    evidencePath: string;
  };
  data: {
    daily: { rows: number; first: string; last: string; min: number; max: number; mean: number; bytes: number; sha256: string };
    intraday: { rows: number; first: string; last: string; bar_minutes: number; series: string; normalized: string; bytes: number; sha256: string };
    volume: { rows: number; first: string; last: string; zero_rows: number; max_zero_run: number; zero_ratio: number; zero_filled: boolean; bytes: number; sha256: string };
    rows: number; intradayDays: number; firstClose: number; lastClose: number; gainPct: number;
  };
  holt: {
    manual: { alpha: number; beta: number; s0: number; b0: number; x: number[]; level: number[]; trend: number[]; forecast: number[] };
    daily: { alpha: number; beta: number; sse: number; sseSes: number; improve: number; lastLevel: number; lastTrend: number; forecast: number[] };
    series: { dates: string[]; close: number[]; holt: number[]; hwAdd5: number[]; hwAdd252: number[] };
  };
  hw: {
    add5: { alpha: number; beta: number; gamma: number; L: number; sse: number; amp: number; season: number[]; forecast: number[] };
    add252: { sse: number; amp: number; seasonHead: number[]; forecast: number[] };
    mul5: { sse: number };
    intraday: {
      alpha: number; beta: number; gamma: number; L: number; sse: number; amp: number; corr: number;
      season: number[]; empirical: number[]; forecast: number[];
    };
    zero: { additiveSse: number; error: { code: string; index: number; value: number } };
  };
  artifacts: { fittedDaily: { path: string; bytes: number; sha256: string }; season48: { path: string; bytes: number; sha256: string } };
};

export const M = holtJson as unknown as HoltData;

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

type SeriesKey = "close" | "holt" | "hwAdd5" | "hwAdd252";

const SERIES_COLORS: Record<SeriesKey, string> = {
  close: C.inkFaint, holt: C.amber, hwAdd5: C.cyan, hwAdd252: C.violet,
};
const SERIES_NAMES: Record<SeriesKey, string> = {
  close: "收盘价", holt: "Holt", hwAdd5: "HW 加法 L5", hwAdd252: "HW 加法 L252",
};

/** 日线拟合图：收盘价 + 若干条模型线；可截取尾部窗口。 */
export const HoltPlot: React.FC<{
  shows: SeriesKey[]; width: number; height: number; at?: number;
  from?: number; to?: number; title?: string; padL?: number; padB?: number; legend?: boolean;
  forecast?: { from: number; values: number[]; color?: string };
}> = ({ shows, width, height, at = 0, from, to, title, padL = 92, padB = 54, legend = true, forecast }) => {
  const f = useCurrentFrame();
  const p = at > 0 ? pct(f, at, at + 20) : 1;
  const padT = 34, padR = 26;
  const s = M.holt.series;
  const i0 = from ?? 0;
  const i1 = to ?? s.close.length - 1;
  const n = i1 - i0 + 1;
  const vals: number[] = [];
  for (const k of shows) for (let i = i0; i <= i1; i++) vals.push(s[k][i]);
  if (forecast) for (const v of forecast.values) vals.push(v);
  const lo = Math.min(...vals), hi = Math.max(...vals);
  const dy = (hi - lo) * 0.08 || 1;
  const y0 = lo - dy, y1 = hi + dy;
  const span = n + (forecast ? forecast.values.length : 0);
  const sx = (i: number) => padL + (i / (span - 1)) * (width - padL - padR);
  const sy = (v: number) => height - padB - ((v - y0) / (y1 - y0)) * (height - padT - padB);
  const pathOf = (arr: number[], off = 0) => {
    const pts: string[] = [];
    for (let i = i0; i <= i1; i++) pts.push((i === i0 ? "M" : "L") + sx(i - i0 + off).toFixed(1) + "," + sy(arr[i]).toFixed(1));
    return pts.join(" ");
  };
  const forecastPath = () => {
    if (!forecast) return "";
    const out: string[] = [];
    const startIdx = n - 1;
    const lastVal = s[shows[0]][i1];
    out.push("M" + sx(startIdx).toFixed(1) + "," + sy(lastVal).toFixed(1));
    forecast.values.forEach((v, k) => out.push("L" + sx(startIdx + k + 1).toFixed(1) + "," + sy(v).toFixed(1)));
    return out.join(" ");
  };
  const yTicks = [0, 0.5, 1].map((t) => y0 + (y1 - y0) * t);
  return (
    <svg width={width} height={height} style={{ display: "block" }}>
      {yTicks.map((v) => (
        <g key={"y" + v}>
          <line x1={padL} y1={sy(v)} x2={width - padR} y2={sy(v)} stroke={C.panelLine} strokeWidth={1} opacity={0.7} />
          <text x={padL - 12} y={sy(v) + 4} textAnchor="end" fill={C.inkFaint} fontFamily={FONT.mono} fontSize={FT.micro}>{v.toFixed(0)}</text>
        </g>
      ))}
      {shows.map((k) => (
        <path key={k} d={pathOf(s[k])} fill="none" stroke={SERIES_COLORS[k]} strokeWidth={k === "close" ? 1.3 : 2.3} opacity={k === "close" ? 0.8 : p * 0.96} />
      ))}
      {forecast ? <path d={forecastPath()} fill="none" stroke={forecast.color ?? C.coral} strokeWidth={2.4} strokeDasharray="7 6" opacity={p} /> : null}
      {[0, 0.25, 0.5, 0.75, 1].map((t) => {
        const i = i0 + Math.round(t * (n - 1));
        return (
          <text key={"x" + t} x={sx(Math.round(t * (n - 1)))} y={height - padB + 24} textAnchor="middle" fill={C.inkFaint} fontFamily={FONT.mono} fontSize={FT.micro}>
            {s.dates[i].slice(5)}
          </text>
        );
      })}
      <text x={padL} y={padT - 10} fill={C.inkFaint} fontFamily={FONT.mono} fontSize={FT.micro}>
        {title ?? s.dates[i0] + " → " + s.dates[i1] + " · 前复权价 · " + n + " 个交易日"}
      </text>
      {legend ? (
        <g>
          {shows.map((k, i) => (
            <g key={"lg" + k} transform={"translate(" + (padL + i * 186) + "," + (height - 8) + ")"}>
              <rect x={0} y={-7} width={22} height={3} fill={SERIES_COLORS[k]} rx={1.5} />
              <text x={28} y={0} fill={C.inkDim} fontFamily={FONT.mono} fontSize={FT.micro}>{SERIES_NAMES[k]}</text>
            </g>
          ))}
          {forecast ? (
            <g transform={"translate(" + (padL + shows.length * 186) + "," + (height - 8) + ")"}>
              <rect x={0} y={-7} width={22} height={3} fill={forecast.color ?? C.coral} rx={1.5} />
              <text x={28} y={0} fill={C.inkDim} fontFamily={FONT.mono} fontSize={FT.micro}>外推</text>
            </g>
          ) : null}
        </g>
      ) : null}
    </svg>
  );
};

/** 季节轮廓：日内 48 根画实测柱 + 拟合线；L=5 只画拟合柱。 */
export const SeasonPlot: React.FC<{
  mode: "day5" | "intraday"; width: number; height: number; at?: number; padL?: number; padB?: number; title?: string;
}> = ({ mode, width, height, at = 0, padL = 74, padB = 52, title }) => {
  const f = useCurrentFrame();
  const p = at > 0 ? pct(f, at, at + 24) : 1;
  const padT = 32, padR = 26;
  const season = mode === "day5" ? M.hw.add5.season : M.hw.intraday.season;
  const emp = mode === "intraday" ? M.hw.intraday.empirical : null;
  // 日内的季节项是「份额 − 1」的偏差；画拟合线时加回 1，才能和实测份额同轴。
  const shifted = mode === "intraday" ? season.map((v: number) => 1 + v) : season;
  const n = season.length;
  const vals = emp ? [...shifted, ...emp] : [...shifted];
  const lo = mode === "intraday" ? Math.min(0, ...vals) : Math.min(...vals, 0);
  const hi = Math.max(...vals);
  const y0 = lo - (hi - lo) * 0.06, y1 = hi + (hi - lo) * 0.12;
  const sy = (v: number) => height - padB - ((v - y0) / (y1 - y0)) * (height - padT - padB);
  const slotW = (width - padL - padR) / n;
  const bw = Math.max(3, slotW * (emp ? 0.5 : 0.62));
  const cx = (i: number) => padL + slotW * (i + 0.5);
  const linePath = () => shifted.map((v: number, i: number) => (i === 0 ? "M" : "L") + cx(i).toFixed(1) + "," + sy(v).toFixed(1)).join(" ");
  const labels: Record<number, string> = mode === "intraday" ? { 0: "09:35", 23: "11:30", 47: "15:00" } : { 0: "周一", 1: "周二", 2: "周三", 3: "周四", 4: "周五" };
  return (
    <svg width={width} height={height} style={{ display: "block" }}>
      {[y0 + (y1 - y0) * 0.25, y0 + (y1 - y0) * 0.75].map((v) => (
        <line key={"y" + v} x1={padL} y1={sy(v)} x2={width - padR} y2={sy(v)} stroke={C.panelLine} strokeWidth={1} opacity={0.6} />
      ))}
      {mode === "intraday" ? (
        <line x1={padL} y1={sy(1)} x2={width - padR} y2={sy(1)} stroke={C.inkFaint} strokeWidth={1} strokeDasharray="4 6" opacity={0.6} />
      ) : (
        <line x1={padL} y1={sy(0)} x2={width - padR} y2={sy(0)} stroke={C.panelLine} strokeWidth={1} />
      )}
      {emp
        ? emp.map((v, i) => (
            <rect key={"e" + i} x={cx(i) - bw / 2} y={sy(v)} width={bw} height={Math.max(1, sy(0) - sy(v))} fill={C.inkFaint} opacity={0.55 * p} rx={1.5} />
          ))
        : season.map((v, i) => (
            <rect
              key={"b" + i}
              x={cx(i) - bw / 2}
              y={Math.min(sy(0), sy(v))}
              width={bw}
              height={Math.max(2, Math.abs(sy(v) - sy(0)))}
              fill={v >= 0 ? C.cyan : C.coral}
              opacity={0.78 * p}
              rx={2}
            />
          ))}
      {mode === "intraday" ? (
        <path d={linePath()} fill="none" stroke={C.amber} strokeWidth={2.4} opacity={p * 0.95} />
      ) : null}
      {Object.keys(labels).map((k) => {
        const i = Number(k);
        return (
          <text key={"x" + k} x={cx(i)} y={height - padB + 24} textAnchor="middle" fill={C.inkFaint} fontFamily={FONT.mono} fontSize={FT.micro}>{labels[i]}</text>
        );
      })}
      {mode === "day5"
        ? season.map((v, i) => (
            <text
              key={"v" + i}
              x={cx(i)}
              y={v >= 0 ? sy(v) - 9 : sy(v) + 18}
              textAnchor="middle"
              fill={v >= 0 ? C.cyan : C.coral}
              fontFamily={FONT.mono}
              fontSize={FT.meta}
              opacity={p}
            >
              {v >= 0 ? "+" : ""}{v.toFixed(2)}
            </text>
          ))
        : null}
      <text x={padL} y={padT - 8} fill={C.inkFaint} fontFamily={FONT.mono} fontSize={FT.micro}>
        {title ?? (mode === "intraday" ? "日内 48 根 · 成交量份额（当日均值为 1）" : "周内 5 个位置 · 加性季节偏移（元）")}
      </text>
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
