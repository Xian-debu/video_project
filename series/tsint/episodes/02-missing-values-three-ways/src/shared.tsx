import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { C, FONT, FT, FT_T, G } from "../design/tokens";
import { ChapterBar, SceneShell } from "../design/Scene";
import { SCENES, LINES, FPS } from "./script";
import imputeJson from "../../data/tsint-02-missing-values-three-ways/impute.json";

/* 本片共用件：E02 的数据形状、价格窗口图、遮挡网格与场景壳。 */

export type Seg = { from: string; to: string; rows: number };
export type Win = {
  index: number; from: string; to: string;
  dates: string[]; closes: number[]; mean: number[]; locf: number[]; linear: number[];
  maskedLocal: number[];
};
export type Block = { from: string; to: string; masked: number; meanMae: number; linearMae: number; locfMae: number };

export type ImputeData = {
  meta: {
    episode: number; bookPages: string; tsBaseCommit: string; evidenceRunAt: string; command: string;
    tests: { new: number; locf: number; statimp: number; lininterp: number; suite_total: number };
    checks: { all: boolean; total: number }; evidencePath: string; seed: number;
  };
  data: { path: string; rows: number; codes: string[]; first: string; last: string; sha256: string; bytes: number };
  returns: { n: number; p5: { masked: number; pActual: number }; p20: { masked: number; pActual: number } };
  variance: {
    p5: { obs: number; imputed: number; predicted: number; relErr: number; median: number; lossPct: number };
    p20: { obs: number; imputed: number; predicted: number; relErr: number; median: number; lossPct: number };
  };
  maePrice: { p5: { linear: number; mean: number; locf: number; locfForward: number }; p20: { linear: number; mean: number; locf: number } };
  maeReturns: { p5: { linear: number; mean: number; locf: number }; p20: { linear: number; mean: number; locf: number } };
  locf: {
    single: { masked: number; runs: number; zeros: number; levelMae: number; varReturns: number; maxJump: number };
    doublet: { masked: number; runs: number; zeros: number; levelMae: number; varReturns: number; maxJump: number };
  };
  zeros: { orig: number; single: number; doublet: number; added: number; maxRun: number };
  suspension: { code: string; rows: number; gapDays: number; gapFrom: string; first: string; last: string; segments: Seg[] };
  masks: { p5: number[]; p20: number[]; n: number };
  window: Win;
  window20: Win;
  blocks20: Block[];
  golden: {
    series: (number | null)[]; locf: number[]; locfForwardError: string; linear: number[];
    mean: number[]; median: number[]; pair: { series: (number | null)[]; linear: number[] };
  };
  manifest: { totalBytes: number; files: { code: string; rows: number; first: string; last: string; gapDays: number; gapAt: string; bytes: number; sha256: string }[] };
};

export const M = imputeJson as unknown as ImputeData;

export const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
export const pct = (f: number, a: number, b: number) => interpolate(f, [a, b], [0, 1], clamp);
export const PAD = G.pad;
export const CW = 1920 - PAD * 2;

export const fmtInt = (v: number) => Math.round(v).toLocaleString("en-US");
export const fmtP = (v: number, d = 2) => (v * 100).toFixed(d) + "%";
export const fmtF = (v: number, d = 4) => v.toFixed(d);
export const fmtE = (v: number, d = 2) => {
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

/** 价格窗口图：真值细线 + 若干条填充曲线 + 被遮挡位置的竖带。 */
export const WindowPlot: React.FC<{
  w: Win; width: number; height: number; shows: ("mean" | "locf" | "linear")[];
  at?: number; padL?: number; padB?: number; title?: string;
}> = ({ w, width, height, shows, at = 0, padL = 88, padB = 56, title }) => {
  const f = useCurrentFrame();
  const p = at > 0 ? pct(f, at, at + 20) : 1;
  const padT = 28, padR = 24;
  // The mean fill uses the WHOLE series average (495.16 for this stock), far outside a 57–61
  // window. Scaling the axis to it would flatten the very shapes this scene is about, so the
  // axis follows price and the mean is announced as off-chart instead of silently squashing it.
  const vals: number[] = [];
  for (const v of w.closes) vals.push(v);
  for (const s of shows) if (s !== "mean") for (const v of w[s]) vals.push(v);
  const lo = Math.min(...vals), hi = Math.max(...vals);
  const dy = (hi - lo) * 0.12 || 1;
  const y0 = lo - dy, y1 = hi + dy;
  const meanVals = shows.includes("mean") ? w.mean : [];
  const meanOut = meanVals.length > 0 && meanVals.some((v) => v < y0 || v > y1);
  // index 0 is an observed point (its value is the close); the filled constant lives at a hole
  const meanAt = meanVals.length ? (w.maskedLocal.length ? meanVals[w.maskedLocal[0]] : Math.max(...meanVals)) : 0;
  const n = w.closes.length;
  const sx = (i: number) => padL + (i / (n - 1)) * (width - padL - padR);
  const sy = (v: number) => height - padB - ((v - y0) / (y1 - y0)) * (height - padT - padB);
  const step = (width - padL - padR) / (n - 1);
  const path = (arr: number[]) => arr.map((v, i) => (i === 0 ? "M" : "L") + sx(i).toFixed(1) + "," + sy(v).toFixed(1)).join(" ");
  const colors: Record<string, string> = { mean: C.coral, locf: C.amber, linear: C.cyan };
  const names: Record<string, string> = { mean: "均值（珊瑚）", locf: "LOCF（琥珀）", linear: "线性（青）" };
  const yTicks = [0, 0.25, 0.5, 0.75, 1].map((t) => y0 + (y1 - y0) * t);
  return (
    <svg width={width} height={height} style={{ display: "block" }}>
      {yTicks.map((v) => (
        <g key={"y" + v}>
          <line x1={padL} y1={sy(v)} x2={width - padR} y2={sy(v)} stroke={C.panelLine} strokeWidth={1} opacity={0.7} />
          <text x={padL - 12} y={sy(v) + 4} textAnchor="end" fill={C.inkFaint} fontFamily={FONT.mono} fontSize={FT.micro}>{v.toFixed(1)}</text>
        </g>
      ))}
      {w.maskedLocal.map((i) => (
        <rect key={"m" + i} x={sx(i) - step * 0.5} y={padT} width={Math.max(2, step)} height={height - padT - padB} fill={C.coral} opacity={0.10} />
      ))}
      <path d={path(w.closes)} fill="none" stroke={C.inkFaint} strokeWidth={1.4} opacity={0.75} />
      {shows.map((s, si) => (
        meanOut && s === "mean" ? null : (
          <path key={s} d={path(w[s])} fill="none" stroke={colors[s]} strokeWidth={2.4}
            opacity={p * 0.95} strokeDasharray={s === "mean" ? "7 5" : undefined}
            style={{ transition: "none" }} data-order={si} />
        )
      ))}
      {w.maskedLocal.map((i) => (
        <circle key={"d" + i} cx={sx(i)} cy={sy(w.closes[i])} r={3.6} fill={C.coral} opacity={p} />
      ))}
      {[0, 0.25, 0.5, 0.75, 1].map((t) => {
        const i = Math.round(t * (n - 1));
        return (
          <text key={"x" + t} x={sx(i)} y={height - padB + 24} textAnchor="middle" fill={C.inkFaint} fontFamily={FONT.mono} fontSize={FT.micro}>
            {w.dates[i].slice(5)}
          </text>
        );
      })}
      <text x={padL} y={padT - 8} fill={C.inkFaint} fontFamily={FONT.mono} fontSize={FT.micro}>
        {title ?? w.from + " → " + w.to + " · 前复权价"}
      </text>
      <text x={width - padR} y={padT - 8} textAnchor="end" fill={C.coral} fontFamily={FONT.mono} fontSize={FT.micro}>
        遮挡 {w.maskedLocal.length} 点
      </text>
      {meanOut ? (
        <text x={width - padR} y={padT + 20} textAnchor="end" fill={C.coral} fontFamily={FONT.mono} fontSize={FT.micro}>
          均值线 {meanAt.toFixed(1)} 元 · 在图外（全序列均价）
        </text>
      ) : null}
      <g>
        {shows.map((s, i) => (
          <g key={"lg" + s} transform={"translate(" + (padL + i * 190) + "," + (height - 12) + ")"}>
            <rect x={0} y={-7} width={22} height={3} fill={colors[s]} rx={1.5} />
            <text x={30} y={0} fill={C.inkDim} fontFamily={FONT.mono} fontSize={FT.micro}>{names[s]}</text>
          </g>
        ))}
      </g>
    </svg>
  );
};

/** 停牌时间轴：三只股票的行覆盖 + 退市股中间六年无行。 */
export const GapTimeline: React.FC<{ width: number; height?: number; at?: number }> = ({ width, height = 300, at = 0 }) => {
  const f = useCurrentFrame();
  const p = at > 0 ? pct(f, at, at + 24) : 1;
  const s = M.suspension;
  const t0 = Date.parse(s.first), t1 = Date.parse("2025-12-31");
  const x = (d: string) => 140 + ((Date.parse(d) - t0) / (t1 - t0)) * (width - 200);
  const rows = [
    { code: "sh600519", label: "贵州茅台", from: "2001-08-27", to: "2025-12-31" },
    { code: "sz000001", label: "平安银行", from: "2001-01-02", to: "2025-12-31" },
    { code: s.code, label: "ST 锌业", from: s.first, to: s.last },
  ];
  const rowH = 44, top = 46;
  return (
    <svg width={width} height={height} style={{ display: "block" }}>
      {[2002, 2006, 2010, 2014, 2018, 2022, 2025].map((yr) => {
        const d = yr + "-01-01";
        return (
          <g key={yr}>
            <line x1={x(d)} y1={top - 18} x2={x(d)} y2={top + rowH * 3 + 6} stroke={C.panelLine} strokeWidth={1} opacity={0.6} />
            <text x={x(d)} y={top + rowH * 3 + 30} textAnchor="middle" fill={C.inkFaint} fontFamily={FONT.mono} fontSize={FT.micro}>{yr}</text>
          </g>
        );
      })}
      {rows.map((r, i) => {
        const y = top + rowH * i;
        const isLast = i === 2;
        return (
          <g key={r.code}>
            <text x={0} y={y + 18} fill={isLast ? C.coral : C.inkDim} fontFamily={FONT.mono} fontSize={FT.meta}>{r.code}</text>
            <text x={0} y={y + 34} fill={C.inkFaint} fontFamily={FONT.sans} fontSize={FT.tiny}>{r.label}</text>
            {isLast ? (
              <g>
                {s.segments.map((g, gi) => (
                  <rect key={gi} x={x(g.from)} y={y + 4} width={Math.max(2, x(g.to) - x(g.from))} height={22} rx={4}
                    fill={C.cyanDeep} stroke={C.cyan} strokeWidth={1.2} opacity={0.85} />
                ))}
                <line x1={x("2007-04-27")} y1={y + 15} x2={x("2014-01-10")} y2={y + 15} stroke={C.coral} strokeWidth={2.4} strokeDasharray="8 6" />
              </g>
            ) : (
              <rect x={x(r.from)} y={y + 4} width={x(r.to) - x(r.from)} height={22} rx={4} fill={C.cyanDeep} opacity={0.55} />
            )}
          </g>
        );
      })}
      <g opacity={p}>
        <text x={x("2007-04-27") + 8} y={top + rowH * 2 - 6} fill={C.coral} fontFamily={FONT.mono} fontSize={FT.label}>
          2450 天，一行都没有
        </text>
        <text x={x("2014-01-10") - 6} y={top + rowH * 3 + 54} textAnchor="end" fill={C.inkFaint} fontFamily={FONT.mono} fontSize={FT.micro}>
          2007-04-27 → 2014-01-10
        </text>
      </g>
    </svg>
  );
};

/** 遮挡网格：5833 个日收益位置，被 mask 的位置点亮（p5 / p20 各一格）。 */
export const MaskGrid: React.FC<{ width: number; height: number; which: "p5" | "p20"; at?: number }> = ({ width, height, which, at = 0 }) => {
  const f = useCurrentFrame();
  const p = at > 0 ? pct(f, at, at + 18) : 1;
  const n = M.masks.n;
  const cols = 90;
  const rows = Math.ceil(n / cols);
  const cw = width / cols;
  const ch = (height - 26) / rows;
  const set = new Set(M.masks[which]);
  const color = which === "p5" ? C.cyan : C.amber;
  return (
    <svg width={width} height={height} style={{ display: "block" }}>
      {Array.from({ length: n }).map((_, i) => {
        const r = Math.floor(i / cols), c = i % cols;
        const hit = set.has(i);
        if (!hit) return <rect key={i} x={c * cw} y={r * ch} width={Math.max(1, cw - 1.2)} height={Math.max(1, ch - 1.2)} fill={C.panelLine} opacity={0.55} />;
        return <rect key={i} x={c * cw} y={r * ch} width={Math.max(1.4, cw - 0.8)} height={Math.max(1.4, ch - 0.8)} fill={color} opacity={p} />;
      })}
      <text x={0} y={height - 4} fill={C.inkFaint} fontFamily={FONT.mono} fontSize={FT.micro}>
        {which === "p5" ? "p = 5%" : "p = 20%"} · 遮挡 {fmtInt(M.masks[which].length)} / {fmtInt(n)} 个位置 · 从左到右是时间
      </text>
    </svg>
  );
};

/** 横向条形组：可对数刻度（价格 MAE 要跨两个数量级）。 */
export const Bars: React.FC<{
  items: { label: string; value: number; text: string; color?: string; dim?: boolean }[];
  width: number; max?: number; log?: boolean; rowH?: number; at?: number; unit?: string;
}> = ({ items, width, max, log = false, rowH = 62, at = 0, unit }) => {
  const f = useCurrentFrame();
  const vals = items.map((i) => i.value);
  const hi = max ?? Math.max(...vals);
  const lo = Math.min(...vals);
  const pos = (v: number) => {
    if (!log) return v / hi;
    const a = Math.log10(Math.max(lo * 0.5, 1e-9)), b = Math.log10(hi);
    return (Math.log10(v) - a) / (b - a);
  };
  return (
    <div style={{ width }}>
      {items.map((it, i) => {
        const p = at > 0 ? pct(f, at + i * 5, at + 16 + i * 5) : 1;
        const w = Math.max(2, pos(it.value) * (width - 250));
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

export const lineCount = (id: string): number => LINES.filter((l) => l.scene === id).length;