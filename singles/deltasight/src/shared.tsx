import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { C, FONT, FT, FT_T, G } from "../design/tokens";
import { ChapterBar, SceneShell } from "../design/Scene";
import { SourcePlate } from "../design/SourcePlate";
import { SCENES, LINES, FPS, PLATES } from "./script";
import simJson from "../../data/deltasight/sim.json";
import adcJson from "../../data/deltasight/adc.json";
import evalJson from "../../data/deltasight/eval.json";
import figuresJson from "../../data/deltasight/source-figures.json";

/* 片子共用件：数据类型、原文图版清单、场景壳、以及几个会被两场以上复用的部件。
 * 每个场景一个文件，放在 scenes/ 下。所有动画只由 useCurrentFrame 决定。 */

/* ---------------- 数据 ---------------- */
export type Patch = {
  i: number; row: number; col: number; count_c: number; similar: number;
  iou: number; r_in: number; change_ratio: number; scenario: string; bit_width: number; region_id: number;
};
export type Sim = {
  meta: { synthetic: boolean; seed: number; patch: number; grid_h: number; grid_w: number; frame_h: number; frame_w: number; tau_px: number; kappa_count: number; theta2: number; theta3: number; note: string };
  frames: { count: number; moved_patches: number[]; noise_amp: number; objects: Record<string, Record<string, number[]>>; psi_prev_pixels: number; note: string };
  patches: Patch[];
  totals: { similar_patches: number; skip_rate: number; bitmix: Record<string, number>; avg_bits: number; scenario_counts: Record<string, number> };
  sensitivity: { tau_values: number[]; kappa_values: number[]; grid: number[][]; axis: string; note: string };
};
export type Adc = {
  meta: { synthetic: boolean; source: string; nbits: number; vref: number; seed: number; note: string };
  cDAC: { prev_code: string; weights: number[]; reconstructed_v: number; note: string };
  sar: { vin: number; steps: { k: number; trial_v: number; bit: number; residual_v: number; err_v: number }[]; code: string; code_value_v: number; lsb_v: number; note: string };
  similarity: { tau_v: number; delta_v: number; vin_minus_vdac_v: number; cases: { inject: string; vminus_v: number; comparator: number; verdict: string }[]; verdict: string; note: string };
  comparison_count: { full_sar: number; similarity_mode: number; saved: number; note: string };
};
export const SIM = simJson as unknown as Sim;
export const ADC = adcJson as unknown as Adc;
export const EV = evalJson as unknown as { meta: Record<string, string>; values: Record<string, unknown>; derived: Record<string, unknown> };

type PlateDoc = {
  plates: { id: string; file: string; doc: string; page: string; figure: string; attribution: string; license: string; width?: number; height?: number }[];
};
const FIG = figuresJson as unknown as PlateDoc;
/** 场景里用 script.ts 的 PLATES 短键（fig1），这里解析成 data/source-figures.json 的 id。 */
export const plate = (id: string) => {
  const mapped = (PLATES as Record<string, string>)[id] ?? id;
  const key = mapped.split("/").pop() ?? mapped;
  const p = FIG.plates.find((x) => x.id === key);
  if (!p) throw new Error("plate not in data/source-figures.json: " + id + " -> " + key);
  return p;
};

/* ---------------- 基础 ---------------- */
export const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
export const pct = (f: number, a: number, b: number) => interpolate(f, [a, b], [0, 1], clamp);
export const PAD = G.pad;
export const CW = 1920 - PAD * 2;

/** 场景配色：三场景一律同色，全片不改含义。 */
export const SCENE_COLOR: Record<string, string> = {
  skipped: C.inkFaint,
  appearing: C.amber,
  moving: C.cyan,
  disappearing: C.coral,
};
export const SCENE_CN: Record<string, string> = {
  skipped: "跳过",
  appearing: "出现",
  moving: "移动",
  disappearing: "消失",
};

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

export const Num: React.FC<{ value: string | number; unit?: string; size?: number; color?: string; label?: string }> = ({ value, unit, size = FT.num, color = C.ink, label }) => (
  <div>
    <div style={{ fontFamily: FONT.mono, fontSize: size, color, fontVariantNumeric: "tabular-nums", lineHeight: 1.1 }}>
      {value}
      {unit ? <span style={{ fontSize: size * 0.45, color: C.inkDim, marginLeft: 6 }}>{unit}</span> : null}
    </div>
    {label ? <div style={{ fontFamily: FONT.sans, fontSize: FT.meta, color: C.inkFaint, marginTop: 6 }}>{label}</div> : null}
  </div>
);

export const Pill: React.FC<{ text: string; color?: string; bg?: string; size?: number }> = ({ text, color = C.cyan, bg = "rgba(94,234,212,0.10)", size = FT.meta }) => (
  <span style={{ fontFamily: FONT.mono, fontSize: size, color, background: bg, border: "1px solid " + color, borderRadius: 999, padding: "4px 12px", letterSpacing: FT_T.meta }}>{text}</span>
);

/** 折线：values 归一化到 [lo,hi]；null 断线。pathLength=1 + dasharray 做确定性描边。 */
export const Line: React.FC<{
  values: (number | null)[]; w: number; h: number; lo: number; hi: number;
  color: string; width?: number; at: number; dur?: number; fill?: boolean;
}> = ({ values, w, h, lo, hi, color, width = 2, at, dur = 40, fill }) => {
  const f = useCurrentFrame();
  const p = pct(f, at, at + dur);
  if (!values.length) return null;
  const pts = values.flatMap((v, i) => {
    if (v === null) return [];
    const x = (i / Math.max(1, values.length - 1)) * w;
    const y = h - ((v - lo) / (hi - lo || 1)) * h;
    return [x.toFixed(1) + "," + Math.max(0, Math.min(h, y)).toFixed(1)];
  });
  if (pts.length < 2) return null;
  const solid = values.every((v) => v !== null);
  return (
    <svg width={w} height={h} style={{ display: "block", overflow: "visible" }}>
      {fill && solid ? <polygon points={"0," + h + " " + pts.join(" ") + " " + w + "," + h} fill={color} opacity={0.08 * p} /> : null}
      <polyline points={pts.join(" ")} fill="none" stroke={color} strokeWidth={width} strokeLinejoin="round" pathLength={1} strokeDasharray={p + " 1"} />
    </svg>
  );
};

/** 原文图版：统一带「原文」角标、页/图号与来源行；片子里唯一允许出现原文的组件。 */
export const Plate: React.FC<{
  id: string; width: number; at?: number; caption?: string; highlight?: { x: number; y: number; w: number; h: number };
}> = ({ id, width, at = 0, caption, highlight }) => {
  const p = plate(id);
  return (
    <SourcePlate
      src={"deltasight/plates/" + p.file.split("/").pop()}
      width={width}
      nativeW={p.width ?? 1000}
      nativeH={p.height ?? 400}
      badge={p.doc}
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

/* ---------------- 与口播同一拍 ---------------- */
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

/* ---------------- 本片专用部件 ---------------- */
/** patch 网格：6×8，颜色=三场景，格内是 Eq.(3) 的计数 c_i。 */
export const PatchGrid: React.FC<{
  cell?: number; at?: number; stagger?: number; showCount?: boolean; showKappa?: boolean; only?: (p: Patch) => boolean; x?: number; y?: number;
}> = ({ cell = 92, at = 0, stagger = 3, showCount = true, showKappa = true, only, x = 0, y = 0 }) => {
  const f = useCurrentFrame();
  const kappa = SIM.meta.kappa_count;
  return (
    <div style={{ position: "relative", width: SIM.meta.grid_w * (cell + 6), height: SIM.meta.grid_h * (cell + 6), marginLeft: x, marginTop: y }}>
      {SIM.patches.map((p) => {
        const on = pct(f, at + p.i * stagger, at + p.i * stagger + 10);
        const dim = only && !only(p) ? 0.18 : 1;
        const col = SCENE_COLOR[p.scenario] ?? C.panelLine;
        const bg = p.scenario === "skipped" ? C.panel : col;
        return (
          <div key={p.i} style={{
            position: "absolute", left: p.col * (cell + 6), top: p.row * (cell + 6), width: cell, height: cell,
            borderRadius: 8, background: bg,
            border: "1px solid " + (p.scenario === "skipped" ? C.panelLine : col),
            opacity: on * dim, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 2,
          }}>
            {showCount ? (
              <span style={{ fontFamily: FONT.mono, fontSize: cell * 0.26, color: p.scenario === "skipped" ? C.inkFaint : C.bg, fontVariantNumeric: "tabular-nums" }}>{p.count_c}</span>
            ) : null}
            {showKappa && p.scenario !== "skipped" ? null : null}
            {p.scenario !== "skipped" && showCount ? (
              <span style={{ fontFamily: FONT.sans, fontSize: cell * 0.14, color: C.bg, opacity: 0.85 }}>{SCENE_CN[p.scenario]}</span>
            ) : null}
            {p.scenario === "skipped" && showKappa ? (
              <span style={{ fontFamily: FONT.mono, fontSize: cell * 0.13, color: C.inkFaint }}>≥{kappa}</span>
            ) : null}
          </div>
        );
      })}
    </div>
  );
};

/** 比特位权条：10 位 CDAC，可标出「还原出的前两位」与注入的 Cτ。 */
export const BitWeights: React.FC<{ code?: string; at?: number; cell?: number; showWeights?: boolean; highlight?: number[] }> = ({
  code = ADC.cDAC.prev_code, at = 0, cell = 62, showWeights = true, highlight = [],
}) => {
  const f = useCurrentFrame();
  return (
    <div style={{ display: "flex", gap: 6 }}>
      {code.split("").map((b, i) => {
        const on = pct(f, at + i * 3, at + i * 3 + 8);
        const hot = highlight.includes(i) || b === "1";
        return (
          <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, opacity: on }}>
            <div style={{
              width: cell, height: cell, borderRadius: 6, lineHeight: cell + "px", textAlign: "center",
              fontFamily: FONT.mono, fontSize: cell * 0.42,
              background: b === "1" ? C.cyan : C.panel, color: b === "1" ? C.bg : C.inkFaint,
              border: "1px solid " + (hot ? C.cyan : C.panelLine),
            }}>{b}</div>
            {showWeights ? <div style={{ fontFamily: FONT.mono, fontSize: FT.micro, color: C.inkFaint }}>{ADC.cDAC.weights[i] >= 0.001 ? ADC.cDAC.weights[i].toFixed(i < 4 ? 3 : 4) : "…"}</div> : null}
          </div>
        );
      })}
    </div>
  );
};

/** 水平条形：一组带标签的数值，同一条基线。 */
export const Bars: React.FC<{
  rows: { label: string; value: number; color?: string; note?: string }[]; max: number; w?: number; at?: number; unit?: string; rowH?: number; digits?: number;
}> = ({ rows, max, w = 720, at = 0, unit = "", rowH = 44, digits = 2 }) => {
  const f = useCurrentFrame();
  return (
    <div style={{ width: w }}>
      {rows.map((r, i) => {
        const p = pct(f, at + i * 6, at + i * 6 + 26);
        return (
          <div key={r.label} style={{ marginBottom: 14 }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontFamily: FONT.sans, fontSize: FT.label, color: C.inkDim, marginBottom: 4 }}>
              <span>{r.label}</span>
              <Mono size={FT.label} color={r.color ?? C.ink}>{(r.value * p).toFixed(digits)}{unit}</Mono>
            </div>
            <div style={{ height: rowH * 0.42, background: C.panel, borderRadius: 4, overflow: "hidden" }}>
              <div style={{ width: (r.value / max) * 100 * p + "%", height: "100%", background: r.color ?? C.cyan, opacity: 0.85 }} />
            </div>
            {r.note ? <div style={{ fontFamily: FONT.sans, fontSize: FT.meta, color: C.inkFaint, marginTop: 3 }}>{r.note}</div> : null}
          </div>
        );
      })}
    </div>
  );
};

/** 一行「标签 + 值」，用于表格化陈述。 */
export const KV: React.FC<{ k: string; v: React.ReactNode; kSize?: number; vSize?: number; color?: string; border?: boolean }> = ({
  k, v, kSize = FT.body, vSize = FT.body, color = C.ink, border = true,
}) => (
  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", padding: "10px 0", borderBottom: border ? "1px solid " + C.panelLine : "none" }}>
    <span style={{ fontFamily: FONT.sans, fontSize: kSize, color: C.inkDim }}>{k}</span>
    <span style={{ fontFamily: FONT.mono, fontSize: vSize, color, fontVariantNumeric: "tabular-nums" }}>{v}</span>
  </div>
);

/** 合成数据角标：凡是展示 sim/adc 的数字，都必须挂这个。 */
export const SyntheticBadge: React.FC<{ at?: number }> = ({ at = 0 }) => {
  const f = useCurrentFrame();
  return (
    <div style={{ opacity: pct(f, at, at + 10), position: "absolute", right: PAD, bottom: 96 }}>
      <Pill text="合成自测数据 · 非论文实测" color={C.amber} bg="rgba(251,191,36,0.10)" />
    </div>
  );
};
