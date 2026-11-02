import React from "react";
import { C, FONT, FT } from "../design/tokens";
import { Heat, M, SeriesBox, mix } from "./shared";

/** 小矩阵：带数字，正负两色，用于把 2×2 / 3×3 的黄金值摆上屏。 */
export const MatrixFig: React.FC<{
  matrix: number[][]; cell?: number; gap?: number; showVals?: boolean; digits?: number;
  lo?: number; hi?: number; caption?: string; width?: number;
}> = ({ matrix, cell = 96, gap = 8, showVals = true, digits = 4, lo, hi, caption, width }) => {
  const flat = matrix.flat();
  const amax = Math.max(1e-9, ...flat.map((v) => Math.abs(v)));
  const a = lo ?? -amax;
  const b = hi ?? amax;
  const span = Math.max(Math.abs(a), Math.abs(b), 1e-9);
  const colorOf = (v: number) => {
    const t = Math.min(1, Math.abs(v) / span);
    return v >= 0 ? mix("#0E1620", "#5EEAD4", Math.pow(t, 0.8)) : mix("#0E1620", "#FB7185", Math.pow(t, 0.8));
  };
  const text = (v: number) => {
    if (Math.abs(v) < 1e-9) return "0";
    if (Math.abs(v - Math.round(v)) < 1e-9) return String(Math.round(v));
    return v.toFixed(digits);
  };
  return (
    <div style={{ width: width ?? undefined }}>
      {matrix.map((row, i) => (
        <div key={i} style={{ display: "flex", marginBottom: gap }}>
          {row.map((v, j) => (
            <div key={j} style={{
              width: cell, height: cell, marginLeft: j === 0 ? 0 : gap, background: colorOf(v),
              border: "1px solid " + C.panelLine, borderRadius: 6, boxSizing: "border-box",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontFamily: FONT.mono, fontSize: FT.meta, color: Math.abs(v) > 0.55 * span ? C.bg : C.ink,
            }}>{showVals ? text(v) : ""}</div>
          ))}
        </div>
      ))}
      {caption ? <div style={{ marginTop: 8, fontFamily: FONT.mono, fontSize: FT.micro, color: C.inkFaint }}>{caption}</div> : null}
    </div>
  );
};

const PANEL = 13;
const PGAP = 2;

/** 四联图：同一窗口的 GASF / GADF / MTF / RP。 */
export const QuadFig: React.FC<{ captions?: string[]; showTitles?: boolean }> = ({ captions, showTitles = true }) => {
  const items: { key: string; name: string; m: number[][]; lo: number; hi: number }[] = [
    { key: "gasf", name: "GASF", m: M.panels.gasf, lo: -1, hi: 1 },
    { key: "gadf", name: "GADF", m: M.panels.gadf, lo: -1, hi: 1 },
    { key: "mtf", name: "MTF", m: M.panels.mtf, lo: 0, hi: 1 },
    { key: "rp", name: "RP", m: M.panels.rp, lo: 0, hi: 1 },
  ];
  const w = M.panels.gasf.length * (PANEL + PGAP);
  return (
    <div style={{ display: "flex", gap: 26 }}>
      {items.map((it, k) => (
        <div key={it.key}>
          {showTitles ? <div style={{ fontFamily: FONT.mono, fontSize: FT.micro, color: [C.cyan, C.violet, C.amber, C.coral][k], marginBottom: 8 }}>{it.name}</div> : null}
          <Heat matrix={it.m} labels={[]} cell={PANEL} gap={PGAP} min={it.lo} max={it.hi} />
          <div style={{ width: w, marginTop: 8, fontFamily: FONT.sans, fontSize: FT.micro, color: C.inkFaint }}>{captions ? captions[k] : ""}</div>
        </div>
      ))}
    </div>
  );
};

/** 一条 128 点窗口的曲线。 */
export const WindowFig: React.FC<{ width: number; height: number; idx?: number; color?: string; label?: string }> = ({ width, height, idx = 0, color = C.cyan, label }) => {
  const s = M.samples[Math.min(idx, M.samples.length - 1)];
  return <SeriesBox values={s.series} width={width} height={height} color={color} label={label ?? s.code + " · " + s.end} />;
};

/** 编码流程：128 点 → 128×128 → 池化 4 → 32×32。 */
export const EncPipe: React.FC<{ width: number; height?: number }> = ({ width, height = 120 }) => {
  const steps = [
    { t: "128 点", s: "窗口本身" },
    { t: "128×128", s: "16384 格" },
    { t: "4×4 均值", s: "吃掉邻域" },
    { t: "32×32", s: "1024 格" },
  ];
  const bw = (width - 3 * 34) / 4;
  return (
    <div style={{ display: "flex", alignItems: "center", width }}>
      {steps.map((s, i) => (
        <React.Fragment key={s.t}>
          <div style={{ width: bw, height, background: "#101823", border: "1px solid " + C.panelLine, borderRadius: 10, boxSizing: "border-box", padding: "16px 14px" }}>
            <div style={{ fontFamily: FONT.mono, fontSize: FT.h3, color: i === 3 ? C.cyan : C.ink }}>{s.t}</div>
            <div style={{ marginTop: 8, fontFamily: FONT.sans, fontSize: FT.micro, color: C.inkFaint }}>{s.s}</div>
          </div>
          {i < 3 ? <div style={{ width: 34, textAlign: "center", color: C.inkFaint, fontSize: 22 }}>→</div> : null}
        </React.Fragment>
      ))}
    </div>
  );
};

/** 小 CNN 的结构条。 */
export const CnnArch: React.FC<{ width: number; dual?: boolean }> = ({ width, dual = false }) => {
  const blocks = [
    { name: "输入", dim: dual ? "2×32×32" : "1×32×32", note: dual ? "GASF + MTF" : "单通道" },
    { name: "卷积 4×5×5", dim: "4×28×28", note: "步长 1，不补边" },
    { name: "最大池 2×2", dim: "4×14×14", note: "不重叠" },
    { name: "卷积 4×3×3", dim: "4×12×12", note: "再抽一次" },
    { name: "最大池 2×2", dim: "4×6×6", note: "拉平 144 维" },
    { name: "全连接", dim: "144 → 3", note: "三类方向" },
  ];
  const bw = (width - 5 * 22) / 6;
  return (
    <div style={{ display: "flex", width }}>
      {blocks.map((b, i) => (
        <React.Fragment key={b.name}>
          <div style={{ width: bw, background: i === 0 ? "rgba(94,234,212,0.10)" : "#101823", border: "1px solid " + (i === 0 ? C.cyan : C.panelLine), borderRadius: 8, boxSizing: "border-box", padding: "12px 10px" }}>
            <div style={{ fontFamily: FONT.sans, fontSize: FT.meta, color: C.ink }}>{b.name}</div>
            <div style={{ marginTop: 6, fontFamily: FONT.mono, fontSize: FT.micro, color: C.cyan }}>{b.dim}</div>
            <div style={{ marginTop: 6, fontFamily: FONT.sans, fontSize: 12, color: C.inkFaint }}>{b.note}</div>
          </div>
          {i < blocks.length - 1 ? <div style={{ width: 22, textAlign: "center", color: C.inkFaint, fontSize: 18 }}>→</div> : null}
        </React.Fragment>
      ))}
    </div>
  );
};

/** 四个域的验证 / 测试准确率：两组条。 */
export const DomainFig: React.FC<{ width: number; max?: number }> = ({ width, max = 0.45 }) => {
  const bw = width - 150 - 96;
  return (
    <div style={{ width }}>
      {M.cote.domains.map((d, i) => (
        <div key={d.key} style={{ marginBottom: 18 }}>
          <div style={{ display: "flex", alignItems: "center" }}>
            <div style={{ width: 150, fontFamily: FONT.mono, fontSize: FT.meta, color: C.inkDim }}>{["时域", "ACF", "谱域", "shapelet"][i]}</div>
            <div style={{ width: bw, height: 12, background: C.panelLine, position: "relative" }}>
              <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: (bw * d.val) / max, background: C.violet, opacity: 0.75 }} />
            </div>
            <div style={{ width: 96, textAlign: "right", fontFamily: FONT.mono, fontSize: FT.micro, color: C.violet }}>{d.val.toFixed(4)}</div>
          </div>
          <div style={{ display: "flex", alignItems: "center", marginTop: 5 }}>
            <div style={{ width: 150, fontFamily: FONT.mono, fontSize: 11, color: C.inkFaint }}>测试</div>
            <div style={{ width: bw, height: 12, background: C.panelLine, position: "relative" }}>
              <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: (bw * d.test) / max, background: C.cyan, opacity: 0.9 }} />
            </div>
            <div style={{ width: 96, textAlign: "right", fontFamily: FONT.mono, fontSize: FT.micro, color: C.cyan }}>{d.test.toFixed(4)}</div>
          </div>
        </div>
      ))}
      <div style={{ fontFamily: FONT.mono, fontSize: FT.micro, color: C.inkFaint }}>上条 验证集（900 条）· 下条 测试集（1,200 条）· 满刻度 {max.toFixed(2)}</div>
    </div>
  );
};

/** 两个域的加权票：三条预测各拿多少票。 */
export const VoteFig: React.FC<{ width: number }> = ({ width }) => {
  const items = [
    { label: "下行", value: 0.8, note: "一个域投它", color: C.coral },
    { label: "震荡", value: 1.5, note: "两个域投它", color: C.cyan },
    { label: "上行", value: 0, note: "没有域投它", color: C.inkFaint },
  ];
  const max = 1.8;
  return (
    <div style={{ width }}>
      {items.map((it) => (
        <div key={it.label} style={{ display: "flex", alignItems: "center", marginBottom: 18 }}>
          <div style={{ width: 110, fontFamily: FONT.mono, fontSize: FT.meta, color: C.inkDim }}>{it.label}</div>
          <div style={{ width: width - 110 - 190, height: 20, background: C.panelLine, position: "relative" }}>
            <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: ((width - 110 - 190) * it.value) / max, background: it.color, opacity: 0.9 }} />
          </div>
          <div style={{ width: 70, textAlign: "right", fontFamily: FONT.mono, fontSize: FT.meta, color: it.color }}>{it.value.toFixed(1)}</div>
          <div style={{ width: 120, marginLeft: 12, fontFamily: FONT.sans, fontSize: FT.micro, color: C.inkFaint }}>{it.note}</div>
        </div>
      ))}
      <div style={{ fontFamily: FONT.mono, fontSize: FT.micro, color: C.inkFaint }}>权重 0.8 / 0.9 / 0.6，预测 下行 / 震荡 / 震荡</div>
    </div>
  );
};
