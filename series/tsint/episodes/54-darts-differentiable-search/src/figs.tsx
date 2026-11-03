import React from "react";
import { useCurrentFrame } from "remotion";
import { C, FONT, FT } from "../design/tokens";
import { M, fmt2, fmt4, pct } from "./shared";

/* ---------------- E54 图形：三层空间、权重曲线、学习率阶梯、误差尺、边选择 ---------------- */

const LABEL = 168;
const OP_NAME = ["恒等", "卷积", "置零"];

type Pt = { x: number; y: number };
type Series = { label: string; color: string; points: Pt[]; width?: number; dash?: string };

/** 通用折线图：用于 20 步权重轨迹与五档学习率扫描。 */
export const TraceChart: React.FC<{
  series: Series[]; yLo: number; yHi: number; yTicks: number[];
  xLo?: number; xHi?: number; xTicks?: number[];
  width?: number; height?: number; at?: number; xUnit?: string; refY?: { y: number; label: string; color: string };
}> = ({ series, yLo, yHi, yTicks, xLo = 1, xHi = 20, xTicks = [1, 5, 10, 15, 20], width = 900, height = 380, at = 0, xUnit = "步", refY }) => {
  const f = useCurrentFrame();
  const p = at > 0 ? pct(f, at, at + 18) : 1;
  const padL = 76;
  const padB = 48;
  const padT = 24;
  const x = (v: number) => padL + ((v - xLo) / (xHi - xLo)) * (width - padL - 26);
  const y = (v: number) => padT + (1 - (v - yLo) / (yHi - yLo)) * (height - padT - padB);
  return (
    <div style={{ width, opacity: p }}>
      <svg width={width} height={height} style={{ overflow: "visible" }}>
        {yTicks.map((v) => (
          <g key={v}>
            <line x1={padL} x2={width - 26} y1={y(v)} y2={y(v)} stroke={C.panelLine} strokeWidth={1} />
            <text x={padL - 12} y={y(v) + 4} textAnchor="end" fill={C.inkFaint} fontFamily={FONT.mono} fontSize={13}>{v.toFixed(yHi - yLo < 0.1 ? 4 : 2)}</text>
          </g>
        ))}
        {refY ? (
          <g>
            <line x1={padL} x2={width - 26} y1={y(refY.y)} y2={y(refY.y)} stroke={refY.color} strokeWidth={1} strokeDasharray="6 5" />
            <text x={width - 26} y={y(refY.y) - 8} textAnchor="end" fill={refY.color} fontFamily={FONT.mono} fontSize={13}>{refY.label}</text>
          </g>
        ) : null}
        {xTicks.map((v) => (
          <text key={v} x={x(v)} y={height - 18} textAnchor="middle" fill={C.inkFaint} fontFamily={FONT.mono} fontSize={13}>{v}{xUnit}</text>
        ))}
        {series.map((s) => {
          const d = s.points.map((q, k) => (k === 0 ? "M" : "L") + x(q.x) + "," + y(q.y)).join(" ");
          return (
            <g key={s.label}>
              <path d={d} fill="none" stroke={s.color} strokeWidth={s.width ?? 3} strokeDasharray={s.dash} />
              {s.points.map((q, k) => <circle key={k} cx={x(q.x)} cy={y(q.y)} r={s.width === 2 ? 2 : 3.5} fill={s.color} />)}
            </g>
          );
        })}
      </svg>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 18, marginLeft: padL, fontFamily: FONT.mono, fontSize: FT.micro, maxWidth: width - padL }}>
        {series.map((s) => <span key={s.label} style={{ color: s.color }}>● {s.label}</span>)}
      </div>
    </div>
  );
};

/** 五档 alpha 学习率：末步平均最大权重，塌缩的档位单独标出。 */
export const SweepBars: React.FC<{ width?: number; at?: number; labelW?: number }> = ({ width = 980, at = 0, labelW = 240 }) => {
  const f = useCurrentFrame();
  const w = width - labelW - 250;
  const lo = 0.3;
  const hi = 1.0;
  return (
    <div style={{ width }}>
      {M.search.sweep.map((r, i) => {
        const p = at > 0 ? pct(f, at + i * 6, at + 16 + i * 6) : 1;
        const frac = (r.meanMax - lo) / (hi - lo);
        const strong = r.collapsedEdges > 0;
        return (
          <div key={r.lr} style={{ display: "flex", alignItems: "center", height: 54, opacity: p }}>
            <div style={{ width: labelW, fontFamily: FONT.mono, fontSize: FT.meta, color: strong ? C.coral : C.inkDim }}>
              lr {r.lr} <span style={{ color: C.inkFaint }}>· {r.lr === 0.05 ? "论文尺度" : "×" + Math.round(r.lr / 0.05)}</span>
            </div>
            <div style={{ width: w, height: 16, background: C.panelLine, borderRadius: 3, position: "relative" }}>
              <div style={{ position: "absolute", left: 0, top: 0, height: 16, width: Math.max(2, frac * w), background: strong ? C.coral : C.cyan, opacity: 0.9, borderRadius: 3 }} />
            </div>
            <div style={{ width: 120, textAlign: "right", fontFamily: FONT.mono, fontSize: FT.meta, color: strong ? C.coral : C.ink }}>
              {fmt4(r.meanMax)}
            </div>
            <div style={{ width: 130, textAlign: "right", fontFamily: FONT.mono, fontSize: FT.micro, color: C.inkFaint }}>
              {r.collapsedEdges > 0 ? "塌缩 " + r.collapsedEdges + "/8 @ 步" + r.collapseStep : "未塌缩"}
            </div>
          </div>
        );
      })}
      <div style={{ marginTop: 6, fontFamily: FONT.mono, fontSize: FT.micro, color: C.inkFaint }}>
        横轴 0.30 → 1.00 平均最大 softmax 权重；只有 lr=500 在第 12 步把 6 条边压到 0.9 以上
      </div>
    </div>
  );
};

/** 七组重训架构的检验 MAE：零基线画成虚线。 */
export const MaeBars: React.FC<{ width?: number; at?: number }> = ({ width = 1000, at = 0 }) => {
  const f = useCurrentFrame();
  const rows = [
    { label: "零基线", value: M.demo.mae.zero, color: C.cyan, note: "永远预测 0" },
    { label: "随机架构", value: M.demo.mae.random, color: C.violet, note: "LCG 随机选 8 条边" },
    { label: "同批架构", value: M.demo.mae.sameBatch, color: C.violet, note: "不切验证集" },
    { label: "top-2 重训", value: M.demo.mae.top2, color: C.amber, note: "每边留两条路径" },
    { label: "top-1 重训", value: M.demo.mae.top1, color: C.coral, note: "每边留一条" },
    { label: "初始化权重", value: M.demo.mae.init, color: C.inkDim, note: "未训练" },
    { label: "超网", value: M.demo.mae.supernet, color: C.inkFaint, note: "混合算子直接用" },
  ];
  const lo = 210;
  const hi = 300;
  const w = width - LABEL - 110;
  const zeroX = ((M.demo.mae.zero - lo) / (hi - lo)) * w;
  return (
    <div style={{ width }}>
      {rows.map((r, i) => {
        const p = at > 0 ? pct(f, at + i * 5, at + 14 + i * 5) : 1;
        const frac = (r.value - lo) / (hi - lo);
        return (
          <div key={r.label} style={{ display: "flex", alignItems: "center", height: 46, opacity: p }}>
            <div style={{ width: LABEL, fontFamily: FONT.sans, fontSize: FT.meta, color: C.inkDim }}>{r.label}</div>
            <div style={{ width: w, height: 12, background: C.panelLine, borderRadius: 3, position: "relative" }}>
              <div style={{ position: "absolute", left: 0, top: 0, height: 12, width: Math.max(2, frac * w), background: r.color, opacity: 0.9, borderRadius: 3 }} />
              <div style={{ position: "absolute", left: zeroX, top: -6, height: 24, width: 1, background: C.cyan, opacity: 0.8 }} />
            </div>
            <div style={{ width: 96, textAlign: "right", fontFamily: FONT.mono, fontSize: FT.meta, color: r.color }}>{r.value.toFixed(4)}</div>
          </div>
        );
      })}
      <div style={{ marginTop: 6, fontFamily: FONT.mono, fontSize: FT.micro, color: C.inkFaint }}>
        检验段 MAE（bps）；青色竖线 = 零基线 {M.demo.mae.zero.toFixed(4)}
      </div>
    </div>
  );
};

/** 三层空间：宏观 block、微观表达式、算子，各自 softmax。 */
export const ThreeLayer: React.FC<{ at?: number }> = ({ at = 0 }) => {
  const f = useCurrentFrame();
  const p = at > 0 ? pct(f, at, at + 16) : 1;
  const box = (label: string, sub: string, accent: string, children?: React.ReactNode) => (
    <div style={{ border: "1px solid " + accent, borderRadius: 12, padding: 14, marginBottom: 12 }}>
      <div style={{ fontFamily: FONT.mono, fontSize: FT.micro, letterSpacing: 1, color: accent, marginBottom: 6 }}>{label}</div>
      <div style={{ fontFamily: FONT.sans, fontSize: FT.meta, color: C.inkDim, marginBottom: 8 }}>{sub}</div>
      {children}
    </div>
  );
  const chip = (t: string, color: string, v: string) => (
    <div key={t} style={{ display: "inline-flex", alignItems: "baseline", gap: 10, marginRight: 18, padding: "6px 12px", borderRadius: 8, background: C.bgSoft, border: "1px solid " + C.panelLine }}>
      <span style={{ fontFamily: FONT.sans, fontSize: FT.meta, color: C.inkDim }}>{t}</span>
      <span style={{ fontFamily: FONT.mono, fontSize: FT.meta, color }}>{v}</span>
    </div>
  );
  return (
    <div style={{ opacity: p }}>
      {box("第一层 · 宏观", "β 在 2 个 block 上做 softmax，选中哪些块", C.cyan,
        <div>{chip("block A", C.cyan, "β " + M.stg.macro.beta[0].toFixed(1))}{chip("block B", C.cyan, "β " + M.stg.macro.beta[1].toFixed(1))}
          <div style={{ marginTop: 8, fontFamily: FONT.mono, fontSize: FT.meta, color: C.inkFaint }}>0.9×1 + 0.1×3 = <span style={{ color: C.cyan }}>{M.stg.macro.out.toFixed(1)}</span></div></div>)}
      {box("第二层 · 微观", "γ 在 2 个隐藏表达式上做 softmax", C.violet,
        <div>{chip("表达式 1", C.violet, "γ 0.5")}{chip("表达式 2", C.violet, "γ 0.5")}
          <div style={{ marginTop: 8, fontFamily: FONT.mono, fontSize: FT.meta, color: C.inkFaint }}>0.5×2 + 0.5×4 = <span style={{ color: C.violet }}>{M.stg.micro.out.toFixed(1)}</span></div></div>)}
      {box("第三层 · 算子", "每条边的 3 个算子再 softmax", C.amber,
        <div>{chip("恒等", C.amber, "α")}{chip("卷积", C.amber, "α")}{chip("置零", C.amber, "α")}
          <div style={{ marginTop: 8, fontFamily: FONT.mono, fontSize: FT.meta, color: C.inkFaint }}>三层嵌套结果 0.5×3 + 0.5×10 = <span style={{ color: C.amber }}>{M.stg.three.out.toFixed(1)}</span></div></div>)}
    </div>
  );
};

/** 8 条边的算子选择：实心 = top-1，圈 = top-2 的第二条路径。 */
export const EdgeGrid: React.FC<{ at?: number; width?: number; choices?: number[]; top2?: number[][]; caption?: string }> = ({
  at = 0, width = 960, choices = M.search.top1, top2 = M.search.top2, caption,
}) => {
  const f = useCurrentFrame();
  const p = at > 0 ? pct(f, at, at + 16) : 1;
  const cell = 74;
  return (
    <div style={{ width, opacity: p }}>
      <div style={{ display: "flex", alignItems: "center", marginBottom: 8 }}>
        <div style={{ width: 84, fontFamily: FONT.mono, fontSize: FT.micro, color: C.inkFaint }}>边</div>
        {OP_NAME.map((o, i) => (
          <div key={o} style={{ width: cell, textAlign: "center", fontFamily: FONT.mono, fontSize: FT.micro, color: i === 0 ? C.inkDim : C.inkFaint }}>{i} · {o}</div>
        ))}
      </div>
      {choices.map((c, i) => {
        const second = (top2[i] ?? []).filter((k) => k !== c);
        return (
          <div key={i} style={{ display: "flex", alignItems: "center", marginBottom: 6, opacity: p }}>
            <div style={{ width: 84, fontFamily: FONT.mono, fontSize: FT.meta, color: C.inkDim }}>e{i + 1}</div>
            {OP_NAME.map((o, k) => {
              const isTop1 = k === c;
              const isSecond = second.includes(k);
              return (
                <div key={o} style={{ width: cell, height: 40, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <div style={{
                    width: 44, height: 30, borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center",
                    background: isTop1 ? C.cyan : isSecond ? "transparent" : C.bgSoft,
                    border: "1.5px solid " + (isTop1 ? C.cyan : isSecond ? C.amber : C.panelLine),
                    opacity: isTop1 ? 0.92 : isSecond ? 0.9 : 0.5,
                    fontFamily: FONT.mono, fontSize: FT.tiny, color: isTop1 ? "#0b1118" : isSecond ? C.amber : C.inkFaint,
                  }}>{isTop1 ? "top-1" : isSecond ? "top-2" : ""}</div>
                </div>
              );
            })}
            <div style={{ marginLeft: 16, fontFamily: FONT.mono, fontSize: FT.micro, color: C.inkFaint }}>
              选中 {c} {c === 0 ? "恒等" : c === 1 ? "卷积" : "置零"} · 第二 {second.length ? second.join(",") : "—"}
            </div>
          </div>
        );
      })}
      {caption ? <div style={{ marginTop: 8, fontFamily: FONT.mono, fontSize: FT.micro, color: C.inkFaint }}>{caption}</div> : null}
    </div>
  );
};

/** 紧凑边条：8 列 × 3 算子，一眼看完塌缩后的选择。 */
export const EdgeStrip: React.FC<{ at?: number; width?: number; choices?: number[]; top2?: number[][]; caption?: string }> = ({
  at = 0, width = 700, choices = M.search.top1, top2 = M.search.top2, caption,
}) => {
  const f = useCurrentFrame();
  const p = at > 0 ? pct(f, at, at + 16) : 1;
  const col = (width - 70) / 8;
  return (
    <div style={{ width, opacity: p }}>
      <div style={{ display: "flex", marginBottom: 6, marginLeft: 62 }}>
        {choices.map((_, i) => (
          <div key={i} style={{ width: col, textAlign: "center", fontFamily: FONT.mono, fontSize: FT.micro, color: C.inkFaint }}>e{i + 1}</div>
        ))}
      </div>
      <div style={{ display: "flex", marginLeft: 62 }}>
        {choices.map((c, i) => {
          const second = (top2[i] ?? []).filter((k) => k !== c);
          return (
            <div key={i} style={{ width: col, display: "flex", flexDirection: "column", gap: 4, alignItems: "center" }}>
              {OP_NAME.map((o, k) => {
                const isTop1 = k === c;
                const isSecond = second.includes(k);
                return (
                  <div key={o} style={{
                    width: Math.min(58, col - 14), height: 26, borderRadius: 5, display: "flex", alignItems: "center", justifyContent: "center",
                    background: isTop1 ? C.cyan : "transparent",
                    border: "1.5px solid " + (isTop1 ? C.cyan : isSecond ? C.amber : C.panelLine),
                    fontFamily: FONT.mono, fontSize: FT.tiny, color: isTop1 ? "#0b1118" : isSecond ? C.amber : C.inkFaint,
                    opacity: isTop1 || isSecond ? 0.95 : 0.45,
                  }}>{OP_NAME[k]}</div>
                );
              })}
            </div>
          );
        })}
      </div>
      <div style={{ marginTop: 8, marginLeft: 62, display: "flex", gap: 18, fontFamily: FONT.mono, fontSize: FT.micro, color: C.inkFaint }}>
        <span><span style={{ color: C.cyan }}>■</span> top-1</span>
        <span><span style={{ color: C.amber }}>□</span> top-2 第二路径</span>
        <span>顺序 恒等 / 卷积 / 置零</span>
      </div>
      {caption ? <div style={{ marginTop: 6, marginLeft: 62, fontFamily: FONT.mono, fontSize: FT.micro, color: C.inkFaint }}>{caption}</div> : null}
    </div>
  );
};

/** 空间对比：6,561 个 cell 架构 vs AutoCTS 约 10^6。 */
export const SpaceCompare: React.FC<{ width?: number; at?: number }> = ({ width = 900, at = 0 }) => {
  const f = useCurrentFrame();
  const p = at > 0 ? pct(f, at, at + 16) : 1;
  const rows = [
    { label: "本机格子", value: M.search.space.cells, color: C.cyan, note: "3 个算子 × 8 条边 = 3^8" },
    { label: "AutoCTS", value: M.search.space.autocts, color: C.violet, note: "论文量级，约 10^6" },
  ];
  const hi = Math.log10(M.search.space.autocts * 3);
  return (
    <div style={{ width, opacity: p }}>
      {rows.map((r, i) => {
        const frac = Math.log10(r.value) / hi;
        return (
          <div key={r.label} style={{ marginBottom: 16 }}>
            <div style={{ display: "flex", alignItems: "baseline" }}>
              <div style={{ width: 150, fontFamily: FONT.sans, fontSize: FT.meta, color: C.inkDim }}>{r.label}</div>
              <div style={{ width: width - 300, height: 16, background: C.panelLine, borderRadius: 3 }}>
                <div style={{ height: 16, width: Math.max(3, frac * (width - 300)), background: r.color, opacity: 0.85, borderRadius: 3 }} />
              </div>
              <div style={{ width: 150, textAlign: "right", fontFamily: FONT.mono, fontSize: FT.meta, color: r.color }}>{r.value.toLocaleString("en-US")}</div>
            </div>
            <div style={{ marginLeft: 150, marginTop: 4, fontFamily: FONT.mono, fontSize: FT.micro, color: C.inkFaint }}>{r.note}</div>
          </div>
        );
      })}
      <div style={{ marginTop: 6, fontFamily: FONT.mono, fontSize: FT.micro, color: C.inkFaint }}>
        横轴按 10 的对数缩放；比值 {M.search.space.ratio.toFixed(2)}×（10^6 / 6,561）
      </div>
    </div>
  );
};

/** 一条大数字的差值标注。 */
export const GapNote: React.FC<{ a: string; b: string; diff: string; color?: string }> = ({ a, b, diff, color = C.coral }) => (
  <div style={{ display: "flex", alignItems: "baseline", gap: 18, fontFamily: FONT.mono }}>
    <span style={{ fontSize: FT.lead, color: C.inkDim }}>{a}</span>
    <span style={{ fontSize: FT.meta, color: C.inkFaint }}>→</span>
    <span style={{ fontSize: FT.lead, color: C.ink }}>{b}</span>
    <span style={{ fontSize: FT.num, color }}>{diff}</span>
  </div>
);