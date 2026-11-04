import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { C, FONT, FT, FT_T, G } from "../design/tokens";
import { ChapterBar, SceneShell } from "../design/Scene";
import { SCENES, LINES, FPS, PAGES_INDEX } from "./script";
import distJson from "../../data/tsint-59-mini-foundation-loop/dist.json";

/* ---------- 本集数据形状：E59 一万参数的小基础模型 ---------- */

export type Check = { group: string; name: string; ok: boolean; detail?: string };
export type CurvePoint = { k: number; relMAE: number; headMAE: number; baseMAE: number; sd: number; lambda: number };
export type DistData = {
  meta: { episode: number; slug: string; chapter: string; title: string; runtimeTarget: number };
  checks: Check[];
  summary: { total: number; passed: number; failed: number; ok: boolean };
  data: {
    series: string; rows: number; windows: number; availWindows: number;
    trainN: number; valN: number; testN: number;
    trainOff: number; valOff: number; testOff: number; firstDate: string; lastDate: string;
    maskedCount: number; maskRatio: number; patchLen: number;
    segCount: number; segFull: number; segPartial: number;
  };
  params: {
    enc: number; planEnc: number; w1: number; b1: number; w2: number; b2: number; token: number;
    head: number; total: number; planTotal: number; planDiff: number; probe: number;
  };
  train: {
    epochs: number; bestEpoch: number; trainLoss: number[]; valLoss: number[];
    valTrained: number; valUntrained: number; valRatio: number; gradErr: number; epochSec: number;
  };
  curve: CurvePoint[];
  probe: { relMSE: number; lambda: number; params: number };
  cross: { stocks: number; rows: number; rel100: number; reconMSE: number; windows: number; pool: number; val: number; test: number };
  example: { true: number[]; pred: number[]; mask: number[] };
  code: { modules: number; moduleLines: number; exports: number; tests: number; evidenceLines: number; checks: number };
};
export const M = distJson as unknown as DistData;

export const CHECK_GROUPS: string[] = ["data", "mask", "param", "train", "head", "shot", "curve", "cross"];
export const GROUP_NAME: Record<string, string> = {
  data: "数据", mask: "掩码", param: "参数", train: "训练", head: "线性头",
  shot: "少样本", curve: "收益曲线", cross: "换股票",
};
export const checkGroups = () =>
  CHECK_GROUPS.filter((g) => M.checks.some((c) => c.group === g)).map((g) => {
    const rows = M.checks.filter((c) => c.group === g);
    return { g, pass: rows.filter((c) => c.ok).length, total: rows.length };
  });
export const checksOf = (g: string): Check[] => M.checks.filter((c) => c.group === g);

export const fmt4 = (v: number, d = 4) => v.toFixed(d);
export const fmt3 = (v: number) => v.toFixed(3);
export const fmt2 = (v: number, d = 2) => v.toFixed(d);
export const fmtInt = (v: number) => Math.round(v).toLocaleString("en-US");
export const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
export const pct = (f: number, a: number, b: number) => interpolate(f, [a, b], [0, 1], clamp);
export const PAD = G.pad;
export const CW = 1920 - PAD * 2;

export const lf = (id: string, k: number): number => {
  const s = SCENES.find((x) => x.id === id);
  if (!s) return 0;
  return Math.max(0, Math.round(s.dur * k * FPS));
};
export const pageAt = (id: string, k: number): number => {
  const s = SCENES.find((x) => x.id === id);
  const l = LINES.find((x) => x.scene === id && x.index === k);
  if (!s || !l) return 0;
  return Math.max(0, Math.min(1, (l.start - s.start) / s.dur));
};
export const pagesOf = (id: string): number[] => (PAGES_INDEX[id] ?? [0]).map((k) => pageAt(id, k));
export const sceneFrames = (id: string): number => {
  const s = SCENES.find((x) => x.id === id);
  return s ? Math.round(s.dur * FPS) : 0;
};

export const mix = (a: string, b: string, t: number): string => {
  const pa = parseInt(a.slice(1), 16);
  const pb = parseInt(b.slice(1), 16);
  const ch = (sh: number) => {
    const x = (pa >> sh) & 255;
    const y = (pb >> sh) & 255;
    return Math.round(x + (y - x) * t);
  };
  return "#" + [16, 8, 0].map((sh) => ch(sh).toString(16).padStart(2, "0")).join("");
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

export const Body: React.FC<{ children: React.ReactNode; color?: string; size?: number; style?: React.CSSProperties }> = ({
  children, color = C.inkDim, size = FT.body, style,
}) => <div style={{ fontFamily: FONT.sans, fontSize: size, color, lineHeight: 1.62, ...style }}>{children}</div>;

export const Mono: React.FC<{ children: React.ReactNode; size?: number; color?: string; style?: React.CSSProperties }> = ({
  children, size = FT.mono, color = C.ink, style,
}) => <span style={{ fontFamily: FONT.mono, fontSize: size, color, fontVariantNumeric: "tabular-nums", ...style }}>{children}</span>;

export const K: React.FC<{ children: React.ReactNode; color?: string; style?: React.CSSProperties }> = ({ children, color = C.inkFaint, style }) => (
  <span style={{ fontFamily: FONT.mono, fontSize: FT.micro, letterSpacing: FT_T.micro, color, ...style }}>{children}</span>
);

export const Chip: React.FC<{ children: React.ReactNode; color?: string; style?: React.CSSProperties }> = ({ children, color = C.coral, style }) => (
  <span style={{ display: "inline-block", padding: "2px 8px", borderRadius: 6, border: "1px solid " + color, color, fontFamily: FONT.mono, fontSize: FT.micro, ...style }}>{children}</span>
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

export const Row: React.FC<{ name: string; value: React.ReactNode; note?: string; width?: number; color?: string; valueW?: number }> = ({
  name, value, note, width = 900, color = C.ink, valueW = 300,
}) => (
  <div style={{ display: "flex", alignItems: "baseline", width, borderTop: "1px solid " + C.panelLine, padding: "13px 0" }}>
    <div style={{ width: 190, fontFamily: FONT.sans, fontSize: FT.body, color: C.inkDim, flexShrink: 0 }}>{name}</div>
    <div style={{ width: valueW, fontFamily: FONT.mono, fontSize: FT.lead, color, fontVariantNumeric: "tabular-nums", flexShrink: 0 }}>{value}</div>
    <div style={{ flex: 1, fontFamily: FONT.sans, fontSize: FT.meta, color: C.inkFaint }}>{note}</div>
  </div>
);

export const Foot: React.FC<{ children: React.ReactNode; accent?: string; top?: number }> = ({ children, accent = C.cyan, top = 812 }) => (
  <div style={{ position: "absolute", left: PAD, right: PAD, top }}>
    <div style={{ borderLeft: "4px solid " + accent, paddingLeft: 22, fontFamily: FONT.mono, fontSize: FT.h2, lineHeight: 1.5, color: C.ink }}>{children}</div>
  </div>
);

export const KV: React.FC<{ k: string; v: React.ReactNode; color?: string; size?: number }> = ({ k, v, color = C.ink, size = FT.lead }) => (
  <div style={{ display: "inline-block", marginRight: 26 }}>
    <div style={{ fontFamily: FONT.mono, fontSize: FT.micro, color: C.inkFaint, marginBottom: 4 }}>{k}</div>
    <div style={{ fontFamily: FONT.mono, fontSize: size, color, fontVariantNumeric: "tabular-nums" }}>{v}</div>
  </div>
);

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
        const outO = last ? 1 : interpolate(f, [b, b + fade], [1, 0], clamp);
        const o = Math.min(inO, outO);
        if (o <= 0.001) return null;
        return <div key={i} style={{ position: "absolute", inset: 0, opacity: o }}>{child}</div>;
      })}
    </>
  );
};

export const Bars: React.FC<{
  items: { label: string; value: number; text: string; color?: string; dim?: boolean }[];
  width: number; max?: number; rowH?: number; at?: number; unit?: string; labelW?: number;
}> = ({ items, width, max, rowH = 62, at = 0, unit, labelW = 132 }) => {
  const f = useCurrentFrame();
  const hi = max ?? Math.max(...items.map((i) => i.value));
  return (
    <div style={{ width }}>
      {items.map((it, i) => {
        const p = at > 0 ? pct(f, at + i * 5, at + 16 + i * 5) : 1;
        const w = Math.max(2, (it.value / hi) * (width - 250));
        return (
          <div key={it.label} style={{ display: "flex", alignItems: "center", height: rowH, opacity: p }}>
            <div style={{ width: labelW, fontFamily: FONT.mono, fontSize: FT.meta, color: it.dim ? C.inkFaint : C.inkDim }}>{it.label}</div>
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

export const Formula: React.FC<{ children: React.ReactNode; size?: number; color?: string; note?: React.ReactNode; style?: React.CSSProperties }> = ({
  children, size = 54, color = C.ink, note, style,
}) => (
  <div style={style}>
    <div style={{ fontFamily: FONT.serif, fontSize: size, color, lineHeight: 1.3 }}>{children}</div>
    {note ? <div style={{ fontFamily: FONT.mono, fontSize: FT.micro, color: C.inkFaint, marginTop: 8 }}>{note}</div> : null}
  </div>
);

export const Verdict: React.FC<{ ok: boolean; label?: string }> = ({ ok, label }) => (
  <span style={{
    display: "inline-block", padding: "2px 10px", borderRadius: 6,
    border: "1px solid " + (ok ? C.cyan : C.coral), color: ok ? C.cyan : C.coral,
    fontFamily: FONT.mono, fontSize: FT.micro,
  }}>{label ?? (ok ? "PASS" : "FAIL")}</span>
);

export const CheckGrid: React.FC<{ cell?: number; at?: number }> = ({ cell = 26, at = 0 }) => {
  const f = useCurrentFrame();
  const p = at > 0 ? pct(f, at, at + 18) : 1;
  return (
    <div style={{ opacity: p }}>
      {checkGroups().map(({ g, pass, total }) => (
        <div key={g} style={{ display: "flex", alignItems: "center", marginBottom: 12 }}>
          <div style={{ width: 92, fontFamily: FONT.mono, fontSize: FT.meta, color: C.inkFaint }}>{GROUP_NAME[g] ?? g}</div>
          <div style={{ display: "flex", gap: 4 }}>
            {Array.from({ length: total }).map((_, i) => (
              <div key={i} style={{
                width: cell, height: cell, borderRadius: 4,
                background: i < pass ? C.cyan : C.coral, opacity: i < pass ? 0.85 : 0.9,
              }} />
            ))}
          </div>
          <div style={{ marginLeft: 14, fontFamily: FONT.mono, fontSize: FT.meta, color: C.inkFaint }}>{pass}/{total}</div>
        </div>
      ))}
    </div>
  );
};
