import React from "react";
import { useCurrentFrame } from "remotion";
import { C, FONT, FT } from "../design/tokens";
import { Card, Mono, K, clamp, mix, pct } from "./shared";

export const SHORT: Record<string, string> = {
  sz000001: "平安", sz000002: "万科", sz000858: "五粮液",
  sh600000: "浦发", sh600519: "茅台", sh600036: "招商",
};

/* ---------- 6×6 相关矩阵 ---------- */

export const CorrMatrix: React.FC<{
  corr: number[][]; codes: string[]; cell?: number; at?: number; showValues?: boolean; labelW?: number;
}> = ({ corr, codes, cell = 58, at = 0, showValues = true, labelW = 58 }) => {
  const f = useCurrentFrame();
  const p = at > 0 ? pct(f, at + 20, at + 46) : 1;
  return (
    <div style={{ opacity: p }}>
      <div style={{ display: "flex", marginLeft: labelW }}>
        {codes.map((c) => (
          <div key={c} style={{ width: cell, textAlign: "center", fontFamily: FONT.sans, fontSize: 13, color: C.inkFaint, paddingBottom: 8 }}>{SHORT[c] ?? c}</div>
        ))}
      </div>
      {corr.map((row, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center" }}>
          <div style={{ width: labelW, fontFamily: FONT.sans, fontSize: 13, color: C.inkFaint }}>{SHORT[codes[i]] ?? codes[i]}</div>
          {row.map((v, j) => {
            const a = Math.abs(v);
            return (
              <div key={j} style={{
                width: cell - 4, height: cell - 4, margin: 2, borderRadius: 4,
                background: i === j ? "rgba(94,234,212,0.16)" : mix(C.panel, C.cyan, 0.08 + 0.72 * a),
                border: "1px solid " + (i === j ? "rgba(94,234,212,0.55)" : C.panelLine),
                display: "flex", alignItems: "center", justifyContent: "center",
                fontFamily: FONT.mono, fontSize: 13,
                color: i === j ? C.cyan : a > 0.5 ? "#06121a" : C.inkDim,
              }}>{showValues ? v.toFixed(2).replace("0.", ".") : ""}</div>
            );
          })}
        </div>
      ))}
    </div>
  );
};

/* ---------- 通道独立：6 行 × 每行 16 个 token ---------- */

export const ChannelStack: React.FC<{
  rows: number; perRow?: number; codes?: string[]; cell?: number; gap?: number; at?: number; width?: number;
}> = ({ rows, perRow = 16, codes = [], cell = 15, gap = 3, at = 0, width }) => {
  const f = useCurrentFrame();
  const p = at > 0 ? pct(f, at, at + 24) : 1;
  const rowW = perRow * (cell + gap);
  return (
    <div style={{ opacity: p, width: width ?? 54 + rowW + 24 }}>
      {Array.from({ length: rows }).map((_, r) => (
        <div key={r} style={{ display: "flex", alignItems: "center", height: cell + gap + 9 }}>
          <div style={{ width: 54, flexShrink: 0, fontFamily: FONT.sans, fontSize: 13, color: C.inkFaint }}>{SHORT[codes[r]] ?? "c" + (r + 1)}</div>
          <div style={{ display: "flex", gap, width: rowW }}>
            {Array.from({ length: perRow }).map((_, i) => (
              <div key={i} style={{
                width: cell, height: cell, borderRadius: 2,
                background: C.cyan, opacity: 0.28 + 0.5 * ((r * 7 + i * 3) % 5) / 4,
                border: "1px solid rgba(94,234,212,0.45)",
              }} />
            ))}
          </div>
          <div style={{ marginLeft: 12, fontFamily: FONT.mono, fontSize: FT.micro, color: C.inkFaint }}>{perRow}</div>
        </div>
      ))}
    </div>
  );
};

/* ---------- 混合后的 token 序列：一条，16 个，每个 k 段 ---------- */

export const TokenRun: React.FC<{
  count?: number; groups?: number; tokenW?: number; h?: number; at?: number; labels?: boolean; colors?: string[];
}> = ({ count = 16, groups = 1, tokenW = 48, h = 52, at = 0, labels = true, colors = [C.cyan, C.violet, C.amber] }) => {
  const f = useCurrentFrame();
  const p = at > 0 ? pct(f, at, at + 22) : 1;
  const gap = 4;
  return (
    <div style={{ opacity: p }}>
      <div style={{ display: "flex", gap }}>
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} style={{ width: tokenW, height: h, display: "flex", borderRadius: 4, overflow: "hidden", border: "1px solid " + C.panelLine }}>
            {Array.from({ length: groups }).map((_, g) => (
              <div key={g} style={{
                flex: 1, height: "100%", background: colors[g % colors.length],
                opacity: 0.24 + 0.16 * g,
                borderRight: g < groups - 1 ? "1px solid " + C.panelLine : "none",
              }} />
            ))}
          </div>
        ))}
      </div>
      {labels ? (
        <div style={{ display: "flex", gap, marginTop: 8 }}>
          {Array.from({ length: count }).map((_, i) => (
            <div key={i} style={{ width: tokenW, textAlign: "center", fontFamily: FONT.mono, fontSize: 10, color: C.inkFaint }}>z{i + 1}</div>
          ))}
        </div>
      ) : null}
    </div>
  );
};

/* ---------- 特征值柱图 ---------- */

export const SpectrumBars: React.FC<{ eig: number[]; width?: number; height?: number; at?: number }> = ({
  eig, width = 900, height = 400, at = 0,
}) => {
  const f = useCurrentFrame();
  const p = at > 0 ? pct(f, at, at + 30) : 1;
  const max = 4.0;
  const barW = 86;
  const gap = 52;
  const baseY = height - 64;
  return (
    <svg width={width} height={height} style={{ overflow: "visible", opacity: p }}>
      {[0, 1, 2, 3, 4].map((t) => (
        <g key={t}>
          <line x1={0} x2={width - 60} y1={baseY - (t / max) * (baseY - 40)} y2={baseY - (t / max) * (baseY - 40)} stroke={C.panelLine} strokeDasharray={t === 0 ? "" : "3 7"} />
          <text x={width - 46} y={baseY - (t / max) * (baseY - 40) + 4} fill={C.inkFaint} fontFamily="monospace" fontSize={12}>{t}</text>
        </g>
      ))}
      {eig.map((v, i) => {
        const h = (v / max) * (baseY - 40);
        const x = 30 + i * (barW + gap);
        return (
          <g key={i}>
            <rect x={x} y={baseY - h} width={barW} height={h} rx={5} fill={i === 0 ? C.cyan : i < 3 ? "rgba(94,234,212,0.45)" : "rgba(94,234,212,0.2)"} />
            <text x={x + barW / 2} y={baseY - h - 12} textAnchor="middle" fill={i < 3 ? C.ink : C.inkDim} fontFamily="monospace" fontSize={16}>{v.toFixed(4)}</text>
            <text x={x + barW / 2} y={baseY + 24} textAnchor="middle" fill={C.inkFaint} fontFamily="monospace" fontSize={13}>λ{i + 1}</text>
          </g>
        );
      })}
    </svg>
  );
};

/* ---------- 有效秩刻度 ---------- */

export const EffRankScale: React.FC<{
  values: { label: string; value: number; color: string }[]; width?: number; at?: number;
}> = ({ values, width = 900, at = 0 }) => {
  const f = useCurrentFrame();
  const p = at > 0 ? pct(f, at + 10, at + 36) : 1;
  const max = 6;
  const y = 150;
  return (
    <div style={{ width, opacity: p, position: "relative", height: 240 }}>
      <div style={{ position: "absolute", left: 0, right: 40, top: y, height: 1, background: C.panelLine }} />
      {[0, 1, 2, 3, 4, 5, 6].map((t) => (
        <div key={t} style={{ position: "absolute", left: (t / max) * (width - 40), top: y - 6, width: 1, height: 12, background: C.panelLine }} />
      ))}
      {[0, 1, 2, 3, 4, 5, 6].map((t) => (
        <div key={t} style={{ position: "absolute", left: (t / max) * (width - 40) - 5, top: y + 18, fontFamily: FONT.mono, fontSize: 12, color: C.inkFaint }}>{t}</div>
      ))}
      {values.map((v, i) => {
        const x = (v.value / max) * (width - 40);
        const up = i % 2 === 0;
        return (
          <div key={v.label} style={{ position: "absolute", left: x - 6, top: y - (up ? 92 : 52) }}>
            <div style={{ width: 12, height: 12, borderRadius: 6, background: v.color, marginLeft: 0 }} />
            <div style={{ position: "absolute", left: 20, top: -4, width: 200, fontFamily: FONT.sans, fontSize: 15, color: v.color, whiteSpace: "nowrap" }}>{v.label}</div>
            <div style={{ position: "absolute", left: 20, top: 16, fontFamily: FONT.mono, fontSize: 14, color: C.inkDim, whiteSpace: "nowrap" }}>{v.value.toFixed(4)}</div>
            <div style={{ position: "absolute", left: 6, top: up ? 16 : 62, width: 1, height: up ? 62 : 20, background: v.color, opacity: 0.5 }} />
          </div>
        );
      })}
    </div>
  );
};

/* ---------- 合成矩阵小图 ---------- */

export const MatrixMini: React.FC<{ rho: number; cell?: number; at?: number; label?: string }> = ({ rho, cell = 17, at = 0, label }) => {
  const f = useCurrentFrame();
  const p = at > 0 ? pct(f, at, at + 26) : 1;
  return (
    <div style={{ opacity: p }}>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(6, ${cell}px)`, gap: 2 }}>
        {Array.from({ length: 36 }).map((_, k) => {
          const i = Math.floor(k / 6);
          const j = k % 6;
          const v = i === j ? 1 : rho;
          return <div key={k} style={{ width: cell, height: cell, borderRadius: 2, background: mix(C.panel, C.cyan, 0.06 + 0.7 * v) }} />;
        })}
      </div>
      {label ? <div style={{ marginTop: 8, fontFamily: FONT.mono, fontSize: FT.micro, color: C.inkFaint }}>{label}</div> : null}
    </div>
  );
};

/* ---------- 三策略 token 计数条 ---------- */

export const TokenCountRows: React.FC<{ at?: number; width?: number }> = ({ at = 0, width = 760 }) => {
  const f = useCurrentFrame();
  const p = at > 0 ? pct(f, at, at + 24) : 1;
  const rows = [
    { label: "CI", n: 96, color: C.cyan, note: "6 × 16" },
    { label: "Hybrid 2", n: 32, color: C.violet, note: "2 × 16" },
    { label: "CM", n: 16, color: C.amber, note: "1 × 16" },
  ];
  const max = 96;
  return (
    <div style={{ width, opacity: p }}>
      {rows.map((r, i) => (
        <div key={r.label} style={{ display: "flex", alignItems: "center", height: 58 }}>
          <div style={{ width: 116, fontFamily: FONT.sans, fontSize: FT.body, color: C.inkDim }}>{r.label}</div>
          <div style={{ width: width - 230, height: 16, background: C.panelLine, borderRadius: 4 }}>
            <div style={{ width: (r.n / max) * (width - 230), height: 16, background: r.color, opacity: 0.85, borderRadius: 4 }} />
          </div>
          <div style={{ marginLeft: 16, fontFamily: FONT.mono, fontSize: FT.body, color: C.ink }}>{r.n}</div>
        </div>
      ))}
    </div>
  );
};

/* ---------- 策略判据卡 ---------- */

export const DecisionLines: React.FC<{ at?: number }> = ({ at = 0 }) => {
  const f = useCurrentFrame();
  const p = at > 0 ? pct(f, at, at + 20) : 1;
  return (
    <div style={{ opacity: p }}>
      {[
        { k: "mean|ρ| ≥ 0.6", v: "且 effRank ≤ 3", out: "Mixed", color: C.cyan },
        { k: "mean|ρ| ≤ 0.2", v: "—", out: "Independent", color: C.amber },
        { k: "其余", v: "k = round(effRank)", out: "Hybrid k", color: C.violet },
      ].map((r, i) => (
        <div key={r.out} style={{ display: "flex", alignItems: "center", borderTop: i === 0 ? "none" : "1px solid " + C.panelLine, padding: "14px 0" }}>
          <Mono size={FT.body} color={C.inkDim} style={{ width: 250 }}>{r.k}</Mono>
          <Mono size={FT.meta} color={C.inkFaint} style={{ width: 240 }}>{r.v}</Mono>
          <Mono size={FT.lead} color={r.color}>{r.out}</Mono>
        </div>
      ))}
    </div>
  );
};

export const MiniLegend: React.FC<{ color: string; children: React.ReactNode }> = ({ color, children }) => (
  <span style={{ display: "inline-flex", alignItems: "center", marginRight: 22, fontFamily: FONT.mono, fontSize: FT.micro, color: C.inkFaint }}>
    <span style={{ width: 10, height: 10, borderRadius: 2, background: color, marginRight: 8 }} />{children}
  </span>
);
