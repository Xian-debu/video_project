import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { C, FONT, FT, FT_T, G } from "../design/tokens";
import { ChapterBar, SceneShell } from "../design/Scene";
import { SCENES, LINES, FPS } from "./script";
import hexbinJson from "../../data/tsint-69-hexbin-balance-audit/hexbin.json";

/* 本片共用件：E69 的数据形状、六边形密度图与场景壳。 */

export type GridPoint = { gridsize: number; occupiedBins: number; concentration: number; hexSize: number };

export type HexData = {
  meta: {
    episode: number; bookPages: string;
    tsBaseCommit: string; tsBaseHead: string; tsAdminHead: string;
    evidenceRunAt: string; command: string;
    tests: { hexbin: number; suite: number };
    checks: { total: number };
    evidencePath: string;
  };
  data: { path: string; rows: number; codes: number; first: string; last: string; sha256: string };
  window: { length: number; ddof: number; features: string[] };
  panel20: {
    windows: number; occupiedBins: number; hexSize: number; concentration: number; maxBinCount: number;
    reconMaxErr: number; lam1: number; lam2: number; cos: number; sin: number;
    meanX: number; meanY: number; stdX: number; stdY: number; k20: number;
  };
  blue3: {
    codes: string[]; windows: number; occupiedBins: number; hexSize: number; concentration: number; k3: number;
  };
  gridSensitivity: GridPoint[];
  topBins: { col: number; row: number; count: number }[];
  topBinShare: number;
  perCode: { code: string; windows: number }[];
  cells20: number[][];
  cells3: number[][];
  scatter: number[][];
  example: { code: string; firstDate: string; lastDate: string; mu: number; sd: number; n: number; closes: number[] };
};

export const M = hexbinJson as unknown as HexData;

export const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
export const pct = (f: number, a: number, b: number) => interpolate(f, [a, b], [0, 1], clamp);
export const PAD = G.pad;
export const CW = 1920 - PAD * 2;

export const fmtInt = (v: number) => v.toLocaleString("en-US");
export const fmtP = (v: number, d = 2) => (v * 100).toFixed(d) + "%";
export const fmtF = (v: number, d = 4) => v.toFixed(d);
export const fmtSci = (v: number) => {
  const e = Math.floor(Math.log10(Math.abs(v)));
  const m = v / Math.pow(10, e);
  return m.toFixed(2) + "×10" + String(e).replace("-", "⁻") + (e >= 0 ? "" : "");
};

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

const mix = (a: string, b: string, t: number): string => {
  const pa = [1, 3, 5].map((i) => parseInt(a.slice(i, i + 2), 16));
  const pb = [1, 3, 5].map((i) => parseInt(b.slice(i, i + 2), 16));
  const c = pa.map((v, i) => Math.round(v + (pb[i] - v) * t));
  return "#" + c.map((v) => v.toString(16).padStart(2, "0")).join("");
};

/** 点型六边形：尖顶朝上，R = s/√3，行距 s·√3/2。 */
export const hexPoints = (x: number, y: number, r: number): string => {
  const pts: string[] = [];
  for (let k = 0; k < 6; k += 1) {
    const a = (Math.PI / 180) * (30 + 60 * k);
    pts.push((x + r * Math.cos(a)).toFixed(2) + "," + (y + r * Math.sin(a)).toFixed(2));
  }
  return pts.join(" ");
};

/** 六边形密度图：cells 行是 [row,col,count,cx,cy]，cx/cy 为 μ/σ 原始单位。 */
export const HexPlot: React.FC<{
  cells: number[][]; s: number; width: number; height: number; at?: number;
  topN?: number; padL?: number; padB?: number; axis?: boolean; legend?: boolean;
}> = ({ cells, s, width, height, at = 0, topN = 3, padL = 96, padB = 62, axis = true, legend = true }) => {
  const f = useCurrentFrame();
  const p = at > 0 ? pct(f, at, at + 22) : 1;
  const xs = cells.map((c) => c[3]);
  const ys = cells.map((c) => c[4]);
  const xmin = Math.min(...xs) - s * 1.2, xmax = Math.max(...xs) + s * 1.2;
  const ymin = Math.min(...ys) - s * 1.2, ymax = Math.max(...ys) + s * 1.2;
  const padT = 24, padR = 24;
  const scale = Math.min((width - padL - padR) / (xmax - xmin), (height - padT - padB) / (ymax - ymin));
  const offX = padL + ((width - padL - padR) - (xmax - xmin) * scale) / 2;
  const offY = padT + ((height - padT - padB) - (ymax - ymin) * scale) / 2;
  const sx = (x: number) => offX + (x - xmin) * scale;
  const sy = (y: number) => height - padB - ((y - ymin) * scale);
  const r = (s / Math.sqrt(3)) * scale * 0.97;
  const counts = cells.map((c) => c[2]);
  const cmax = Math.max(...counts), cmin = Math.min(...counts);
  const top = cells.slice().sort((a, b) => b[2] - a[2]).slice(0, topN);
  const topSet = new Set(top.map((c) => c[0] + ":" + c[1]));
  const tone = (n: number) => Math.pow((n - cmin) / Math.max(1, cmax - cmin), 0.42);
  return (
    <svg width={width} height={height} style={{ display: "block" }}>
      {axis ? (
        <g>
          <line x1={padL - 10} y1={height - padB} x2={width - padR} y2={height - padB} stroke={C.panelLine} strokeWidth={1.5} />
          <line x1={padL - 10} y1={padT} x2={padL - 10} y2={height - padB} stroke={C.panelLine} strokeWidth={1.5} />
          {[-0.02, 0.0, 0.02].map((v) => (
            <g key={"x" + v}>
              <text x={sx(v)} y={height - padB + 26} textAnchor="middle" fill={C.inkFaint} fontFamily={FONT.mono} fontSize={FT.micro}>
                {v.toFixed(2)}
              </text>
            </g>
          ))}
          {[0.02, 0.04, 0.06].map((v) => (
            <g key={"y" + v}>
              <text x={padL - 20} y={sy(v) + 5} textAnchor="end" fill={C.inkFaint} fontFamily={FONT.mono} fontSize={FT.micro}>
                {v.toFixed(2)}
              </text>
            </g>
          ))}
          <text x={width - padR} y={height - padB + 26} textAnchor="end" fill={C.inkFaint} fontFamily={FONT.mono} fontSize={FT.micro}>μ 日收益</text>
          <text x={padL - 20} y={padT - 6} textAnchor="start" fill={C.inkFaint} fontFamily={FONT.mono} fontSize={FT.micro}>σ</text>
        </g>
      ) : null}
      <g opacity={p}>
        {cells.map((c, i) => {
          const n = c[2];
          const isTop = topSet.has(c[0] + ":" + c[1]);
          const fill = mix("#16222F", C.cyan, tone(n));
          if (i > p * cells.length + 2) return null;
          return <polygon key={i} points={hexPoints(sx(c[3]), sy(c[4]), r)} fill={fill}
            stroke={isTop ? C.coral : mix(C.panelLine, C.cyan, tone(n) * 0.5)} strokeWidth={isTop ? 2.4 : 0.8} opacity={0.96} />;
        })}
      </g>
      {top.slice(0, 2).map((c) => (
        <text key={"t" + c[0] + c[1]} x={sx(c[3])} y={sy(c[4]) - r - 8} textAnchor="middle" fill={C.coral}
          fontFamily={FONT.mono} fontSize={FT.micro} opacity={p}>{fmtInt(c[2])}</text>
      ))}
      {legend ? (
        <g>
          <text x={padL - 10} y={padT - 6} fill={C.inkFaint} fontFamily={FONT.mono} fontSize={FT.micro}>每格样本数 · 越亮越多</text>
          <rect x={width - padR - 150} y={padT - 2} width={100} height={10} fill="url(#grad69)" rx={3} />
          <defs>
            <linearGradient id="grad69" x1="0" x2="1">
              <stop offset="0%" stopColor={mix("#16222F", C.cyan, 0)} />
              <stop offset="100%" stopColor={C.cyan} />
            </linearGradient>
          </defs>
          <text x={width - padR - 150} y={padT + 26} fill={C.inkFaint} fontFamily={FONT.mono} fontSize={FT.micro}>{fmtInt(cmin)}</text>
          <text x={width - padR - 50} y={padT + 26} textAnchor="end" fill={C.inkFaint} fontFamily={FONT.mono} fontSize={FT.micro}>{fmtInt(cmax)}</text>
        </g>
      ) : null}
    </svg>
  );
};

/** 网格敏感度列表：尺寸 → 占用格数 + 集中度条。 */
export const SensitivityRows: React.FC<{ width: number; at?: number; pick?: number[] }> = ({ width, at = 0, pick }) => {
  const f = useCurrentFrame();
  const rows = M.gridSensitivity.filter((g) => !pick || pick.includes(g.gridsize));
  return (
    <div style={{ width }}>
      {rows.map((g, i) => {
        const p = at > 0 ? pct(f, at + i * 6, at + 18 + i * 6) : 1;
        const active = g.gridsize === 30;
        return (
          <div key={g.gridsize} style={{ display: "flex", alignItems: "center", gap: 14, height: 44, opacity: p }}>
            <div style={{ width: 96, fontFamily: FONT.mono, fontSize: FT.meta, color: active ? C.cyan : C.inkDim }}>
              {g.gridsize}×{g.gridsize}
            </div>
            <div style={{ width: 78, fontFamily: FONT.mono, fontSize: FT.meta, color: C.inkFaint, textAlign: "right" }}>{fmtInt(g.occupiedBins)} 格</div>
            <div style={{ flex: 1, height: 12, background: C.panelLine, borderRadius: 4, position: "relative" }}>
              <div style={{ position: "absolute", left: 0, top: 0, height: 12, borderRadius: 4,
                width: ((g.concentration - 0.8) / 0.2) * 100 + "%", background: active ? C.cyan : C.inkFaint, opacity: 0.9 }} />
            </div>
            <div style={{ width: 86, fontFamily: FONT.mono, fontSize: FT.meta, color: active ? C.cyan : C.inkDim, textAlign: "right" }}>
              {fmtP(g.concentration)}
            </div>
          </div>
        );
      })}
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
