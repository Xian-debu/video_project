import React from "react";
import { useCurrentFrame } from "remotion";
import { C, FONT, FT, FT_T } from "../design/tokens";
import { M, POOL3, POOL5, Chip, Mono, pct } from "./shared";

/* ---------------------------------------------------------------- 三零件流水线 */

export const Pipe: React.FC<{ width?: number }> = ({ width = 1000 }) => {
  const boxW = 260;
  const boxH = 96;
  const gap = (width - boxW * 3) / 2;
  const items = [
    { t: "候选池", s: "十个写法", c: C.cyan },
    { t: "指标打分", s: "验证集误差", c: C.violet },
    { t: "排序挑一", s: "argmin", c: C.amber },
  ];
  return (
    <div style={{ position: "relative", width, height: boxH + 44 }}>
      {items.map((it, i) => (
        <div key={it.t} style={{
          position: "absolute", left: i * (boxW + gap), top: 0, width: boxW, height: boxH,
          background: C.panel, border: "1px solid " + C.panelLine, borderTop: "2px solid " + it.c,
          borderRadius: 12, boxSizing: "border-box", padding: 16,
        }}>
          <div style={{ fontFamily: FONT.sans, fontSize: FT.lead, color: C.ink }}>{it.t}</div>
          <div style={{ fontFamily: FONT.mono, fontSize: FT.meta, color: C.inkFaint, marginTop: 6 }}>{it.s}</div>
        </div>
      ))}
      {[0, 1].map((i) => (
        <div key={i} style={{
          position: "absolute", left: i * (boxW + gap) + boxW + 8, top: boxH / 2 - 1,
          width: gap - 16, height: 2, background: C.panelLine,
        }}>
          <div style={{ position: "absolute", right: -2, top: -5, width: 0, height: 0,
            borderTop: "6px solid transparent", borderBottom: "6px solid transparent", borderLeft: "10px solid " + C.inkFaint }} />
        </div>
      ))}
      <div style={{ position: "absolute", left: 0, top: boxH + 14, fontFamily: FONT.sans, fontSize: FT.meta, color: C.inkFaint }}>
        空间 · 判据 · 搜索 —— 这一集三件事各量一次
      </div>
    </div>
  );
};

/* ---------------------------------------------------------------- 十个候选与池子成员 */

const NAMES = ["naive", "drift30", "exp0.2", "exp0.5", "ar1", "ridge·1e-3", "ridge·1", "sar12", "sar5", "hmean5"];

export const PoolChips: React.FC<{ width?: number; at?: number }> = ({ width = 1020, at = 0 }) => {
  const f = useCurrentFrame();
  const p = at > 0 ? pct(f, at, at + 18) : 1;
  return (
    <div style={{ width, opacity: p }}>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
        {NAMES.map((n, i) => {
          const in3 = POOL3.includes(i);
          const in5 = POOL5.includes(i);
          const col = in3 ? C.cyan : in5 ? C.violet : C.inkFaint;
          const bg = in3 ? "rgba(94,234,212,0.10)" : in5 ? "rgba(167,139,250,0.10)" : "transparent";
          return (
            <div key={n} style={{
              width: 184, padding: "10px 12px", borderRadius: 10, background: bg,
              border: "1px solid " + col, boxSizing: "border-box",
            }}>
              <div style={{ fontFamily: FONT.mono, fontSize: FT.meta, color: col }}>{String(i).padStart(2, "0")} · {n}</div>
              <div style={{ fontFamily: FONT.mono, fontSize: FT.micro, color: C.inkFaint, marginTop: 4 }}>
                验证 {M.candidates[i].validMae.toFixed(3)} / 胜 {M.candidates[i].wins}
              </div>
            </div>
          );
        })}
      </div>
      <div style={{ display: "flex", gap: 26, marginTop: 12, fontFamily: FONT.sans, fontSize: FT.meta, color: C.inkFaint }}>
        <span><span style={{ color: C.cyan }}>▍</span> 池 3 = 00 / 02 / 04</span>
        <span><span style={{ color: C.violet }}>▍</span> 池 5 再加 05 / 07</span>
        <span><span style={{ color: C.inkFaint }}>▍</span> 全池 10 个</span>
      </div>
    </div>
  );
};

/* ---------------------------------------------------------------- 三段切分条 */

export const SplitBar: React.FC<{ width?: number; at?: number }> = ({ width = 1000, at = 0 }) => {
  const f = useCurrentFrame();
  const p = at > 0 ? pct(f, at, at + 18) : 1;
  const [tr] = M.data.split.train;
  const [va] = M.data.split.valid;
  const [te] = M.data.split.test;
  const total = tr + va + te;
  const seg = [
    { n: "训练", v: tr, c: C.cyan, note: "2015 – 2021" },
    { n: "验证", v: va, c: C.violet, note: "2022 – 2023" },
    { n: "测试", v: te, c: C.amber, note: "2024" },
  ];
  let x = 0;
  return (
    <div style={{ width, opacity: p }}>
      <div style={{ position: "relative", height: 44, background: C.panelLine, borderRadius: 8, overflow: "hidden" }}>
        {seg.map((s) => {
          const w = (s.v / total) * width;
          const el = (
            <div key={s.n} style={{ position: "absolute", left: x, top: 0, width: w - 2, height: 44, background: s.c, opacity: 0.55 }} />
          );
          x += w;
          return el;
        })}
      </div>
      <div style={{ display: "flex", marginTop: 10 }}>
        {seg.map((s) => (
          <div key={s.n} style={{ width: (s.v / total) * width, fontFamily: FONT.mono, fontSize: FT.micro, color: C.inkFaint }}>
            {s.n} {s.v} 点 · {s.note}
          </div>
        ))}
      </div>
    </div>
  );
};

/* ---------------------------------------------------------------- 两值对比条 */

export const PairBars: React.FC<{
  width?: number; rows: { label: string; a: number; b: number; aText: string; bText: string; max?: number }[];
  colors?: [string, string]; at?: number; unit?: string;
}> = ({ width = 980, rows, colors = [C.cyan, C.violet], at = 0, unit }) => {
  const f = useCurrentFrame();
  return (
    <div style={{ width }}>
      {rows.map((r, i) => {
        const p = at > 0 ? pct(f, at + i * 6, at + 18 + i * 6) : 1;
        const hi = r.max ?? Math.max(r.a, r.b);
        return (
          <div key={r.label} style={{ marginBottom: 22, opacity: p }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontFamily: FONT.mono, fontSize: FT.meta, color: C.inkFaint }}>
              <span>{r.label}</span>
              <span><span style={{ color: colors[0] }}>{r.aText}</span> · <span style={{ color: colors[1] }}>{r.bText}</span></span>
            </div>
            <div style={{ position: "relative", height: 16, background: C.panelLine, borderRadius: 4, marginTop: 6 }}>
              <div style={{ position: "absolute", left: 0, top: 0, height: 16, width: Math.max(3, (r.a / hi) * width), background: colors[0], opacity: 0.9, borderRadius: 4 }} />
            </div>
            <div style={{ position: "relative", height: 16, background: C.panelLine, borderRadius: 4, marginTop: 6 }}>
              <div style={{ position: "absolute", left: 0, top: 0, height: 16, width: Math.max(3, (r.b / hi) * width), background: colors[1], opacity: 0.9, borderRadius: 4 }} />
            </div>
          </div>
        );
      })}
      {unit ? <div style={{ fontFamily: FONT.mono, fontSize: FT.micro, color: C.inkFaint }}>{unit}</div> : null}
    </div>
  );
};

/* ---------------------------------------------------------------- 组合空间：648 与 81 */

export const GridDots: React.FC<{ cols?: number; rows?: number; cell?: number; color?: string; lit?: number; at?: number }> = ({
  cols = 27, rows = 24, cell = 13, color = C.cyan, lit = 81, at = 0,
}) => {
  const f = useCurrentFrame();
  const p = at > 0 ? pct(f, at, at + 22) : 1;
  const total = cols * rows;
  return (
    <div style={{ display: "flex", flexWrap: "wrap", width: cols * (cell + 3), opacity: p }}>
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} style={{
          width: cell, height: cell, marginRight: 3, marginBottom: 3, borderRadius: 2,
          background: i < lit ? color : C.panelLine, opacity: i < lit ? 0.9 : 0.5,
        }} />
      ))}
    </div>
  );
};

/* ---------------------------------------------------------------- 预筛两步 */

export const PrefilterPipe: React.FC<{ width?: number }> = ({ width = 1020 }) => {
  const f = useCurrentFrame();
  const p = pct(f, 10, 40);
  const stages = [
    { t: "全池", s: "10 个候选 × 480 点", c: C.inkFaint },
    { t: "特征锁", s: "锁 m=4，剔 2 个", c: C.cyan },
    { t: "粗排 120 点", s: "留 4 个", c: C.violet },
    { t: "全段精排", s: "4 × 480", c: C.amber },
  ];
  const w = (width - 3 * 18) / 4;
  return (
    <div style={{ width, display: "flex", gap: 18, opacity: p }}>
      {stages.map((st) => (
        <div key={st.t} style={{ width: w, background: C.panel, border: "1px solid " + C.panelLine, borderTop: "2px solid " + st.c, borderRadius: 12, padding: 16, boxSizing: "border-box" }}>
          <div style={{ fontFamily: FONT.sans, fontSize: FT.lead, color: C.ink }}>{st.t}</div>
          <div style={{ fontFamily: FONT.mono, fontSize: FT.meta, color: C.inkFaint, marginTop: 6 }}>{st.s}</div>
        </div>
      ))}
    </div>
  );
};
