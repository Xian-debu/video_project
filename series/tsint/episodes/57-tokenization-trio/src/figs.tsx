import React from "react";
import { useCurrentFrame } from "remotion";
import { C, FONT, FT } from "../design/tokens";
import { M, pct } from "./shared";

/* ---------------- E57 figures: patches, periods, ACF, resolution prefix ---------------- */

const H = M.data.h;
const PALETTE = [C.cyan, C.violet, C.amber, C.coral];

export const WaveStrip: React.FC<{
  values: number[]; width?: number; height?: number; color?: string; at?: number; label?: string;
}> = ({ values, width = 900, height = 160, color = C.cyan, at = 0, label }) => {
  const f = useCurrentFrame();
  const p = at > 0 ? pct(f, at, at + 18) : 1;
  const lo = Math.min(...values);
  const hi = Math.max(...values);
  const y = (v: number) => height - 12 - ((v - lo) / (hi - lo || 1)) * (height - 24);
  const pts = values.map((v, i) => {
    const x = (i / (values.length - 1)) * width;
    return x.toFixed(2) + "," + y(v).toFixed(2);
  });
  return (
    <div style={{ width, opacity: p }}>
      <svg width={width} height={height}>
        <line x1={0} y1={height - 12} x2={width} y2={height - 12} stroke={C.panelLine} strokeWidth={1} />
        <polyline points={pts.join(" ")} fill="none" stroke={color} strokeWidth={2} strokeLinejoin="round" />
      </svg>
      {label ? <div style={{ fontFamily: FONT.sans, fontSize: FT.meta, color: C.inkFaint }}>{label}</div> : null}
    </div>
  );
};

export const TokenStrip: React.FC<{
  p: number; width?: number; height?: number; at?: number; showLabels?: boolean;
}> = ({ p, width = 960, height = 44, at = 0, showLabels = true }) => {
  const f = useCurrentFrame();
  const fade = at > 0 ? pct(f, at, at + 16) : 1;
  const count = Math.floor(H / p);
  const cell = width / H;
  return (
    <div style={{ width, opacity: fade }}>
      <div style={{ display: "flex", gap: 2, height }}>
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} style={{
            width: p * cell - 2, height, borderRadius: 3,
            background: "rgba(94,234,212,0.13)",
            border: "1px solid " + PALETTE[i % 2],
            display: "flex", alignItems: "center", justifyContent: "center",
            fontFamily: FONT.mono, fontSize: FT.meta, color: PALETTE[i % 2],
          }}>{showLabels ? i + 1 : ""}</div>
        ))}
      </div>
      <div style={{ marginTop: 8, fontFamily: FONT.mono, fontSize: FT.meta, color: C.inkFaint }}>
        p={p} · {count} token · 每块 {p} 点
      </div>
    </div>
  );
};

export const OverlapStrip: React.FC<{ width?: number; stride?: number; p?: number; at?: number }> = ({
  width = 880, stride = 8, p = 16, at = 0,
}) => {
  const f = useCurrentFrame();
  const fade = at > 0 ? pct(f, at, at + 16) : 1;
  const cell = width / H;
  const rows = Math.floor((H - p) / stride) + 1;
  return (
    <div style={{ width, opacity: fade }}>
      {Array.from({ length: rows }).map((_, r) => (
        <div key={r} style={{ display: "flex", gap: 1, height: 13, marginBottom: 3 }}>
          {Array.from({ length: H }).map((_, i) => {
            const on = i >= r * stride && i < r * stride + p;
            return (
              <div key={i} style={{
                width: Math.max(2, cell - 1), height: "100%", borderRadius: 1,
                background: on ? (r % 2 === 0 ? C.cyan : C.violet) : "#141f2b",
                opacity: on ? 0.75 : 0.75,
              }} />
            );
          })}
        </div>
      ))}
      <div style={{ marginTop: 6, fontFamily: FONT.mono, fontSize: FT.meta, color: C.inkFaint }}>
        p={p}, stride={stride} · 窗口 {rows} 个 · 每步重叠 {p - stride} 点
      </div>
    </div>
  );
};

export const AcfChart: React.FC<{
  data: number[]; peak?: number | null; threshold?: number; width?: number; height?: number;
  yMin?: number; yMax?: number; color?: string; at?: number; label?: string;
}> = ({ data, peak = null, threshold, width = 900, height = 300, yMin = -1.05, yMax = 1.05, color = C.cyan, at = 0, label }) => {
  const f = useCurrentFrame();
  const fade = at > 0 ? pct(f, at, at + 18) : 1;
  const n = data.length;
  const left = 46;
  const bottom = height - 26;
  const top = 12;
  const x = (k: number) => left + (k / (n - 1)) * (width - left - 16);
  const y = (v: number) => bottom - ((v - yMin) / (yMax - yMin)) * (bottom - top);
  const ticks = [0, 12, 24, 36, 48].filter((k) => k < n);
  return (
    <div style={{ width, opacity: fade }}>
      <svg width={width} height={height}>
        {[yMin, 0, yMax].map((v, i) => (
          <line key={i} x1={left} y1={y(v)} x2={width - 16} y2={y(v)}
            stroke={v === 0 ? C.panelLine : "#141f2b"} strokeWidth={1} />
        ))}
        {threshold !== undefined ? (
          <line x1={left} y1={y(threshold)} x2={width - 16} y2={y(threshold)}
            stroke={C.coral} strokeWidth={1} strokeDasharray="5 4" />
        ) : null}
        {ticks.map((k) => (
          <text key={k} x={x(k)} y={height - 8} fill={C.inkFaint} fontSize={FT.meta}
            fontFamily={FONT.mono} textAnchor="middle">{k}</text>
        ))}
        <polyline points={data.map((v, k) => x(k).toFixed(2) + "," + y(v).toFixed(2)).join(" ")}
          fill="none" stroke={color} strokeWidth={2.2} strokeLinejoin="round" />
        {peak !== null && peak < n ? (
          <>
            <line x1={x(peak)} y1={top} x2={x(peak)} y2={bottom} stroke={C.amber} strokeWidth={1} strokeDasharray="3 3" />
            <circle cx={x(peak)} cy={y(data[peak])} r={6} fill={C.amber} />
            <text x={x(peak) + 10} y={y(data[peak]) - 10} fill={C.amber} fontSize={FT.meta} fontFamily={FONT.mono}>
              lag {peak}
            </text>
          </>
        ) : null}
      </svg>
      {label ? <div style={{ fontFamily: FONT.sans, fontSize: FT.meta, color: C.inkFaint }}>{label}</div> : null}
    </div>
  );
};

export const ResolutionLadder: React.FC<{ width?: number; at?: number }> = ({ width = 980, at = 0 }) => {
  const f = useCurrentFrame();
  const fade = at > 0 ? pct(f, at, at + 18) : 1;
  const maxW = width - 300;
  const maxLen = Math.max(...M.prefix.lengths);
  return (
    <div style={{ width, opacity: fade }}>
      {M.prefix.levels.map((r, i) => {
        const len = M.prefix.lengths[i];
        const w = Math.round((len / maxLen) * maxW);
        return (
          <div key={r} style={{ display: "flex", alignItems: "center", marginBottom: 14 }}>
            <div style={{
              width: 44, height: 40, borderRadius: 4, display: "flex", alignItems: "center", justifyContent: "center",
              background: "rgba(167,139,250,0.14)", border: "1px solid " + C.violet,
              fontFamily: FONT.mono, fontSize: FT.meta, color: C.violet,
            }}>e{r}</div>
            <div style={{ marginLeft: 14, width: 58, fontFamily: FONT.mono, fontSize: FT.meta, color: C.inkFaint }}>r={r}</div>
            <div style={{ width: maxW, height: 26 }}>
              <div style={{ width: w, height: 26, borderRadius: 3, background: i === 0 ? "rgba(94,234,212,0.22)" : "rgba(94,234,212,0.12)", border: "1px solid " + C.cyan }} />
            </div>
            <div style={{ marginLeft: 16, width: 70, textAlign: "right", fontFamily: FONT.mono, fontSize: FT.value, color: C.cyan }}>{len}</div>
          </div>
        );
      })}
      <div style={{ marginLeft: 116, fontFamily: FONT.sans, fontSize: FT.meta, color: C.inkFaint }}>
        分辨率每降一级，点数减半；前缀 e_r 告诉模型「这是哪一级」。
      </div>
    </div>
  );
};

export const PrefixDiagram: React.FC<{ width?: number; at?: number }> = ({ width = 1000, at = 0 }) => {
  const f = useCurrentFrame();
  const fade = at > 0 ? pct(f, at, at + 16) : 1;
  const tokenW = 170;
  return (
    <div style={{ width, opacity: fade }}>
      <div style={{ display: "flex", alignItems: "stretch", gap: 6 }}>
        <div style={{
          width: 110, height: 78, borderRadius: 5, display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center", gap: 4,
          background: "rgba(167,139,250,0.16)", border: "1px solid " + C.violet, color: C.violet,
          fontFamily: FONT.mono, fontSize: FT.meta,
        }}>
          <div style={{ fontSize: FT.value }}>e_r</div>
          <div>r = 2</div>
        </div>
        {[0, 1, 2, 3].map((i) => (
          <div key={i} style={{
            width: tokenW, height: 78, borderRadius: 5, display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center", gap: 4,
            background: "rgba(94,234,212,0.12)", border: "1px solid " + C.cyan, color: C.cyan,
            fontFamily: FONT.mono, fontSize: FT.meta,
          }}>
            <div>z{i + 1}</div>
            <div>24 点</div>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 12, fontFamily: FONT.sans, fontSize: FT.meta, color: C.inkFaint }}>
        前缀占一个位置：总长 1 + 4，后面 token 的位置编码整体偏移一位。
      </div>
    </div>
  );
};

export const PrefixNearest: React.FC<{ width?: number; at?: number }> = ({ width = 900, at = 0 }) => {
  const f = useCurrentFrame();
  const fade = at > 0 ? pct(f, at, at + 16) : 1;
  const levels = M.prefix.levels;
  return (
    <div style={{ width, opacity: fade }}>
      <div style={{ display: "flex", alignItems: "flex-end", gap: 10, height: 120 }}>
        {levels.map((r) => (
          <div key={r} style={{
            width: 96, height: 44 + r * 7, borderRadius: 4,
            background: "rgba(94,234,212,0.10)", border: "1px solid " + C.panelLine,
            display: "flex", alignItems: "flex-end", justifyContent: "center", paddingBottom: 6,
            fontFamily: FONT.mono, fontSize: FT.meta, color: C.inkFaint,
          }}>r={r}</div>
        ))}
      </div>
      <div style={{ marginTop: 10, fontFamily: FONT.sans, fontSize: FT.meta, color: C.inkFaint }}>
        没有 r=3 这一档：取最近的 2；r=6 取最近的 4。找不到就退化到最近桶。
      </div>
    </div>
  );
};
