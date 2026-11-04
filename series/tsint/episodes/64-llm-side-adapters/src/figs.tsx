import React from "react";
import { useCurrentFrame } from "remotion";
import { C, FONT, FT } from "../design/tokens";
import { M, fmt2, fmt4, fmtInt, pct } from "./shared";

export const MiniLegend: React.FC<{ color: string; children: React.ReactNode; dash?: boolean }> = ({ color, children, dash }) => (
  <span style={{ display: "inline-flex", alignItems: "center", gap: 8, fontFamily: FONT.mono, fontSize: FT.meta, color: C.inkDim }}>
    <span style={{ width: 22, height: 0, borderTop: (dash ? "2px dashed " : "2px solid ") + color, display: "inline-block" }} />
    {children}
  </span>
);

const poly = (vals: number[], x: (i: number) => number, y: (v: number) => number) =>
  vals.map((v, i) => (i === 0 ? "M" : "L") + x(i).toFixed(1) + " " + y(v).toFixed(1)).join(" ");

/* ---------- 6,600 个收盘价：预训练段与下游段 ---------- */

export const CloseChart: React.FC<{
  width?: number; height?: number; at?: number; split?: number;
}> = ({ width = 1080, height = 250, at = 0, split = 0.62 }) => {
  const f = useCurrentFrame();
  const p = at > 0 ? pct(f, at, at + 24) : 1;
  const vals = M.series.closes;
  const ml = 54, mr = 16, mt = 24, mb = 30;
  const lo = Math.min(...vals), hi = Math.max(...vals);
  const X = (i: number) => ml + (i / (vals.length - 1)) * (width - ml - mr);
  const Y = (v: number) => height - mb - ((v - lo) / (hi - lo)) * (height - mt - mb);
  return (
    <svg width={width} height={height} style={{ opacity: p }}>
      <rect x={X(0)} y={mt} width={X(vals.length * split) - X(0)} height={height - mt - mb} fill={C.cyan} opacity={0.05} />
      <rect x={X(vals.length * split)} y={mt} width={X(vals.length - 1) - X(vals.length * split)} height={height - mt - mb} fill={C.amber} opacity={0.06} />
      <path d={poly(vals, X, Y)} fill="none" stroke={C.cyan} strokeWidth={1.6} opacity={0.85} />
      <line x1={X(vals.length * split)} y1={mt} x2={X(vals.length * split)} y2={height - mb} stroke={C.inkFaint} strokeDasharray="4 4" />
      <text x={X(vals.length * split) - 10} y={mt + 14} textAnchor="end" fill={C.cyan} fontSize={FT.meta} fontFamily={FONT.mono}>1998 → 2014 预训练</text>
      <text x={X(vals.length * split) + 10} y={mt + 14} fill={C.amber} fontSize={FT.meta} fontFamily={FONT.mono}>2015 → 2019 下游</text>
      <text x={ml} y={mt - 6} fill={C.inkFaint} fontSize={FT.micro} fontFamily={FONT.mono}>{fmtInt(M.data.seriesRows)} 个收盘价 · 后复权</text>
      <text x={ml} y={height - 6} fill={C.inkFaint} fontSize={FT.micro} fontFamily={FONT.mono}>{M.data.start} → {M.data.end}</text>
    </svg>
  );
};

/* ---------- 参数预算：对数刻度 ---------- */

const LOG_MAX = Math.log10(70209 + 1);

export const ParamBudget: React.FC<{ width?: number; at?: number; rowH?: number }> = ({ width = 900, at = 0, rowH = 86 }) => {
  const f = useCurrentFrame();
  const items = [
    { label: "冻结主干", v: M.frozen.total, text: fmtInt(M.frozen.total), share: "100%", color: C.inkDim, dim: true },
    { label: "线性头", v: M.probe.params, text: fmtInt(M.probe.params), share: M.probe.share.toFixed(2) + "%", color: C.cyan },
    { label: "低秩旁路", v: M.lora.params, text: String(M.lora.params), share: M.lora.share.toFixed(2) + "%", color: C.violet },
    { label: "语义锚点", v: 0, text: "0", share: "0%", color: C.amber },
  ];
  return (
    <div style={{ width }}>
      {items.map((it, i) => {
        const p = at > 0 ? pct(f, at + i * 6, at + 16 + i * 6) : 1;
        const w = Math.max(3, (Math.log10(it.v + 1) / LOG_MAX) * (width - 300));
        return (
          <div key={it.label} style={{ display: "flex", alignItems: "center", height: rowH, opacity: p }}>
            <div style={{ width: 130, fontFamily: FONT.sans, fontSize: FT.body, color: it.dim ? C.inkFaint : C.inkDim }}>{it.label}</div>
            <div style={{ width: width - 300, height: 20, background: C.panelLine, borderRadius: 4, position: "relative" }}>
              <div style={{ position: "absolute", left: 0, top: 0, height: 20, width: w, borderRadius: 4, background: it.color, opacity: it.dim ? 0.4 : 0.9 }} />
            </div>
            <div style={{ width: 110, textAlign: "right", fontFamily: FONT.mono, fontSize: FT.lead, color: it.color }}>{it.text}</div>
            <div style={{ width: 60, textAlign: "right", fontFamily: FONT.mono, fontSize: FT.meta, color: C.inkFaint }}>{it.share}</div>
          </div>
        );
      })}
      <div style={{ fontFamily: FONT.mono, fontSize: FT.micro, color: C.inkFaint, marginTop: 2 }}>对数刻度 · 百分比是相对冻结主干 70,209 个参数</div>
    </div>
  );
};

/* ---------- 线性头：64 → 65×20 → 20 ---------- */

export const ProbeDiagram: React.FC<{ width?: number; at?: number }> = ({ width = 1000, at = 0 }) => {
  const f = useCurrentFrame();
  const p = at > 0 ? pct(f, at, at + 20) : 1;
  const box = (x: number, y: number, w: number, h: number, color: string, dim = false) => (
    <div style={{ position: "absolute", left: x, top: y, width: w, height: h, border: "1px solid " + color, borderRadius: 8, opacity: dim ? 0.55 : 0.9, background: color + "14" }} />
  );
  return (
    <div style={{ position: "relative", width, height: 340, opacity: p }}>
      {box(0, 90, 180, 160, C.inkFaint, true)}
      <div style={{ position: "absolute", left: 18, top: 128, fontFamily: FONT.mono, fontSize: FT.meta, color: C.inkDim }}>64 维表示</div>
      <div style={{ position: "absolute", left: 18, top: 160, fontFamily: FONT.mono, fontSize: FT.micro, color: C.inkFaint }}>主干冻结输出</div>
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} style={{ position: "absolute", left: 120, top: 100 + i * 18, width: 44, height: 12, background: C.inkFaint, opacity: 0.5, borderRadius: 2 }} />
      ))}
      <div style={{ position: "absolute", left: 205, top: 164, fontFamily: FONT.mono, fontSize: 30, color: C.inkFaint }}>→</div>
      {box(268, 60, 300, 220, C.cyan)}
      <div style={{ position: "absolute", left: 288, top: 78, fontFamily: FONT.mono, fontSize: FT.meta, color: C.cyan }}>线性头 · 闭式解</div>
      {Array.from({ length: 6 }).map((_, r) =>
        Array.from({ length: 12 }).map((__, c) => (
          <div key={r + "-" + c} style={{ position: "absolute", left: 292 + c * 23, top: 112 + r * 26, width: 16, height: 16, borderRadius: 2, background: C.cyan, opacity: 0.14 + ((r * 7 + c * 3) % 5) * 0.05 }} />
        ))
      )}
      <div style={{ position: "absolute", left: 288, top: 252, fontFamily: FONT.mono, fontSize: FT.micro, color: C.inkFaint }}>65 行（64 维 + 截距）× 20 列</div>
      <div style={{ position: "absolute", left: 592, top: 164, fontFamily: FONT.mono, fontSize: 30, color: C.inkFaint }}>→</div>
      {box(650, 90, 150, 160, C.violet)}
      <div style={{ position: "absolute", left: 668, top: 120, fontFamily: FONT.mono, fontSize: FT.meta, color: C.violet }}>20 个数</div>
      <div style={{ position: "absolute", left: 668, top: 150, fontFamily: FONT.mono, fontSize: FT.micro, color: C.inkFaint }}>未来 1..20 天</div>
      <div style={{ position: "absolute", left: 668, top: 186, fontFamily: FONT.mono, fontSize: FT.h2, color: C.cyan }}>1,300</div>
      <div style={{ position: "absolute", left: 668, top: 238, fontFamily: FONT.mono, fontSize: FT.micro, color: C.inkFaint }}>= 65 × 20</div>
    </div>
  );
};

/* ---------- 低秩旁路：W0 + B·A ---------- */

export const LoraDiagram: React.FC<{ width?: number; at?: number }> = ({ width = 1000, at = 0 }) => {
  const f = useCurrentFrame();
  const p = at > 0 ? pct(f, at, at + 20) : 1;
  return (
    <div style={{ position: "relative", width, height: 360, opacity: p }}>
      <div style={{ position: "absolute", left: 0, top: 70, width: 300, height: 220, border: "1px solid " + C.panelLine, borderRadius: 10, background: C.panel }} />
      <div style={{ position: "absolute", left: 20, top: 86, fontFamily: FONT.mono, fontSize: FT.meta, color: C.inkDim }}>W0 · 64 × 64 · 冻结</div>
      {Array.from({ length: 8 }).map((_, r) => Array.from({ length: 8 }).map((__, c) => (
        <div key={r + "-" + c} style={{ position: "absolute", left: 30 + c * 32, top: 120 + r * 20, width: 24, height: 14, borderRadius: 2, background: C.inkFaint, opacity: 0.12 + ((r * 5 + c) % 4) * 0.04 }} />
      )))}
      <div style={{ position: "absolute", left: 316, top: 158, fontFamily: FONT.mono, fontSize: 34, color: C.inkFaint }}>+</div>
      <div style={{ position: "absolute", left: 360, top: 70, width: 210, height: 100, border: "1px solid " + C.violet, borderRadius: 10, background: C.violet + "12" }} />
      <div style={{ position: "absolute", left: 378, top: 86, fontFamily: FONT.mono, fontSize: FT.meta, color: C.violet }}>B · 64 × 4</div>
      <div style={{ position: "absolute", left: 378, top: 118, fontFamily: FONT.mono, fontSize: FT.micro, color: C.inkFaint }}>初始全零 → 输出逐位相同</div>
      <div style={{ position: "absolute", left: 360, top: 190, width: 210, height: 100, border: "1px solid " + C.cyan, borderRadius: 10, background: C.cyan + "12" }} />
      <div style={{ position: "absolute", left: 378, top: 206, fontFamily: FONT.mono, fontSize: FT.meta, color: C.cyan }}>A · 4 × 64</div>
      <div style={{ position: "absolute", left: 378, top: 238, fontFamily: FONT.mono, fontSize: FT.micro, color: C.inkFaint }}>小随机数 · 0.02 倍</div>
      <div style={{ position: "absolute", left: 586, top: 158, fontFamily: FONT.mono, fontSize: 34, color: C.inkFaint }}>⇒</div>
      <div style={{ position: "absolute", left: 630, top: 70, width: 300, height: 220, border: "1px solid " + C.amber, borderRadius: 10, background: C.amber + "10" }} />
      <div style={{ position: "absolute", left: 650, top: 86, fontFamily: FONT.mono, fontSize: FT.meta, color: C.amber }}>合并 · 64 × 64</div>
      <div style={{ position: "absolute", left: 650, top: 120, fontFamily: FONT.mono, fontSize: FT.h2, color: C.ink }}>W0 + B A</div>
      <div style={{ position: "absolute", left: 650, top: 166, fontFamily: FONT.mono, fontSize: FT.meta, color: C.inkDim }}>参数 2 × 4 × 64 = 512</div>
      <div style={{ position: "absolute", left: 650, top: 198, fontFamily: FONT.mono, fontSize: FT.meta, color: C.inkFaint }}>占主干 {M.lora.share.toFixed(2)}%</div>
      <div style={{ position: "absolute", left: 650, top: 230, fontFamily: FONT.mono, fontSize: FT.meta, color: C.coral }}>训练损失只动 0.03%</div>
    </div>
  );
};

/* ---------- 语义锚点：64 词 → 每类一个下标 ---------- */

export const AnchorDiagram: React.FC<{ width?: number; at?: number }> = ({ width = 1000, at = 0 }) => {
  const f = useCurrentFrame();
  const p = at > 0 ? pct(f, at, at + 20) : 1;
  const top = M.anchor.top8;
  const cell = 46;
  return (
    <div style={{ width, opacity: p }}>
      <div style={{ fontFamily: FONT.mono, fontSize: FT.meta, color: C.inkDim, marginBottom: 12 }}>词表 · 64 个正交词</div>
      <div style={{ display: "flex", flexWrap: "wrap", width: cell * 12 + 11 * 6 }}>
        {Array.from({ length: 64 }).map((_, i) => {
          const hit = top.indexOf(i);
          return (
            <div key={i} style={{
              width: cell, height: cell, marginRight: 6, marginBottom: 6, borderRadius: 4,
              border: "1px solid " + (hit >= 0 ? C.cyan : C.panelLine),
              background: hit >= 0 ? C.cyan + "22" : "transparent",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontFamily: FONT.mono, fontSize: hit >= 0 ? FT.meta : FT.micro,
              color: hit >= 0 ? C.cyan : C.inkFaint,
            }}>{hit >= 0 ? i : ""}</div>
          );
        })}
      </div>
      <div style={{ marginTop: 14, fontFamily: FONT.mono, fontSize: FT.meta, color: C.inkFaint }}>
        前 8 个查询命中：{top.join(" · ")}
      </div>
      <div style={{ marginTop: 18, display: "flex", alignItems: "center", gap: 6 }}>
        {top.map((t, i) => (
          <div key={i} style={{ padding: "6px 10px", borderRadius: 4, border: "1px solid " + C.amber, color: C.amber, fontFamily: FONT.mono, fontSize: FT.meta }}>w{t}</div>
        ))}
        <div style={{ fontFamily: FONT.mono, fontSize: FT.meta, color: C.inkFaint }}>+</div>
        <div style={{ padding: "6px 10px", borderRadius: 4, border: "1px dashed " + C.inkFaint, color: C.inkDim, fontFamily: FONT.mono, fontSize: FT.meta }}>查询</div>
        <div style={{ marginLeft: 12, fontFamily: FONT.mono, fontSize: FT.meta, color: C.inkDim }}>9 个 token · 0 个参数</div>
      </div>
    </div>
  );
};

/* ---------- 20 维目标：累计对数平均绝对收益 ---------- */

export const VolCurve: React.FC<{ width?: number; height?: number; at?: number }> = ({ width = 900, height = 260, at = 0 }) => {
  const f = useCurrentFrame();
  const p = at > 0 ? pct(f, at, at + 24) : 1;
  const a = M.series.volMean, b = M.series.volOne;
  const all = [...a, ...b];
  const lo = Math.min(...all), hi = Math.max(...all);
  const ml = 54, mr = 20, mt = 24, mb = 34;
  const X = (i: number) => ml + (i / 19) * (width - ml - mr);
  const Y = (v: number) => height - mb - ((v - lo) / (hi - lo)) * (height - mt - mb);
  return (
    <svg width={width} height={height} style={{ opacity: p }}>
      <path d={poly(a, X, Y)} fill="none" stroke={C.cyan} strokeWidth={2.2} />
      <path d={poly(b, X, Y)} fill="none" stroke={C.amber} strokeWidth={2.2} strokeDasharray="6 5" />
      {a.map((v, i) => (
        <circle key={i} cx={X(i)} cy={Y(v)} r={2.6} fill={C.cyan} />
      ))}
      {[1, 5, 10, 15, 20].map((h) => (
        <text key={h} x={X(h - 1)} y={height - 10} textAnchor="middle" fill={C.inkFaint} fontSize={FT.micro} fontFamily={FONT.mono}>{h}</text>
      ))}
      <text x={ml} y={mt - 4} fill={C.inkFaint} fontSize={FT.micro} fontFamily={FONT.mono}>未来第 1..20 天</text>
      <text x={width - mr} y={mt - 4} textAnchor="end" fill={C.inkFaint} fontSize={FT.micro} fontFamily={FONT.mono}>y 轴：log 累计平均 |收益|</text>
    </svg>
  );
};

/* ---------- 词表 Gram：近似单位矩阵 ---------- */

export const GramHeat: React.FC<{ width?: number; at?: number }> = ({ width = 520, at = 0 }) => {
  const f = useCurrentFrame();
  const p = at > 0 ? pct(f, at, at + 20) : 1;
  const n = 64;
  const cell = width / n;
  return (
    <svg width={width} height={width} style={{ opacity: p }}>
      {M.words.gram.map((row, r) =>
        row.map((v, c) => {
          const id = Math.abs(v);
          const on = r === c;
          return (
            <rect
              key={r + "-" + c}
              x={c * cell}
              y={r * cell}
              width={cell}
              height={cell}
              fill={on ? C.cyan : C.panelLine}
              opacity={on ? 0.95 : 0.16 + Math.min(0.5, id * 40)}
            />
          );
        })
      )}
    </svg>
  );
};

/* ---------- 切分：3,218 / 1,219 → 732 / 243 / 224 ---------- */

export const SplitStrip: React.FC<{ width?: number; at?: number }> = ({ width = 1000, at = 0 }) => {
  const f = useCurrentFrame();
  const p = at > 0 ? pct(f, at, at + 20) : 1;
  const pre = M.data.pretrainWindows, down = M.data.downstreamWindows;
  const tot = pre + down;
  const wPre = (pre / tot) * width;
  const parts = [
    { n: M.data.train, c: C.cyan, label: "训练" },
    { n: M.data.val, c: C.amber, label: "验证" },
    { n: M.data.test, c: C.coral, label: "测试" },
  ];
  const downSum = parts.reduce((a, b) => a + b.n, 0);
  return (
    <div style={{ width, opacity: p }}>
      <div style={{ display: "flex", height: 34, borderRadius: 6, overflow: "hidden" }}>
        <div style={{ width: wPre, background: C.panelLine }} />
        {parts.map((q) => (
          <div key={q.label} style={{ width: (q.n / downSum) * (width - wPre), background: q.c, opacity: 0.82 }} />
        ))}
      </div>
      <div style={{ display: "flex", marginTop: 10, fontFamily: FONT.mono, fontSize: FT.meta }}>
        <div style={{ width: wPre, color: C.inkFaint }}>{fmtInt(pre)} 窗 · 1998–2014 预训练</div>
        <div style={{ flex: 1, display: "flex", gap: 18, color: C.inkDim }}>
          {parts.map((q) => (
            <span key={q.label} style={{ color: q.c }}>{q.label} {q.n}</span>
          ))}
          <span style={{ color: C.inkFaint }}>共 {fmtInt(down)} 窗 · 2015–2019</span>
        </div>
      </div>
    </div>
  );
};

/* ---------- 相对误差：放大到 0.96–1.12 ---------- */

export const RelMaeBars: React.FC<{ width?: number; at?: number }> = ({ width = 780, at = 0 }) => {
  const f = useCurrentFrame();
  const p = at > 0 ? pct(f, at, at + 20) : 1;
  const lo = 0.96, hi = 1.12;
  const items = [
    { label: "预测均值", v: 1.0, color: C.inkDim, text: "1.0000" },
    { label: "线性头", v: M.probe.relMae, color: C.cyan, text: fmt4(M.probe.relMae) },
    { label: "随机特征头", v: M.probe.randomRelMae, color: C.violet, text: fmt4(M.probe.randomRelMae) },
  ];
  const X = (v: number) => ((v - lo) / (hi - lo)) * (width - 300);
  return (
    <div style={{ width, opacity: p }}>
      {items.map((it) => (
        <div key={it.label} style={{ display: "flex", alignItems: "center", height: 62 }}>
          <div style={{ width: 150, fontFamily: FONT.sans, fontSize: FT.body, color: C.inkDim }}>{it.label}</div>
          <div style={{ width: width - 300, height: 16, background: C.panelLine, borderRadius: 4, position: "relative" }}>
            <div style={{ position: "absolute", left: 0, top: 0, height: 16, width: Math.max(3, X(it.v)), borderRadius: 4, background: it.color, opacity: 0.85 }} />
            <div style={{ position: "absolute", left: X(1.0), top: -6, width: 1, height: 28, background: C.inkFaint }} />
          </div>
          <div style={{ width: 110, textAlign: "right", fontFamily: FONT.mono, fontSize: FT.lead, color: it.color }}>{it.text}</div>
        </div>
      ))}
      <div style={{ fontFamily: FONT.mono, fontSize: FT.micro, color: C.inkFaint, marginTop: 4 }}>竖线 = 1.0000（预测零 / 预测均值）；刻度从 0.96 起，为了看清差别</div>
    </div>
  );
};

/* ---------- 两个 36.5：训练损失与测试误差 ---------- */

export const DeltaZoom: React.FC<{ width?: number; at?: number }> = ({ width = 780, at = 0 }) => {
  const f = useCurrentFrame();
  const p = at > 0 ? pct(f, at, at + 20) : 1;
  const rows = [
    { label: "训练损失", a: M.lora.lossFirst, b: M.lora.lossLast, c: C.violet, unit: "80 轮前后" },
    { label: "测试 MSE", a: M.lora.frozenMse, b: M.lora.testMse, c: C.cyan, unit: "冻结 → 秩 4" },
  ];
  return (
    <div style={{ width, opacity: p }}>
      {rows.map((r) => (
        <div key={r.label} style={{ marginBottom: 26 }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 14 }}>
            <div style={{ width: 140, fontFamily: FONT.sans, fontSize: FT.body, color: C.inkDim }}>{r.label}</div>
            <div style={{ fontFamily: FONT.mono, fontSize: FT.h2, color: C.inkDim }}>{fmt4(r.a)}</div>
            <div style={{ fontFamily: FONT.mono, fontSize: FT.meta, color: C.inkFaint }}>→</div>
            <div style={{ fontFamily: FONT.mono, fontSize: FT.h2, color: r.c }}>{fmt4(r.b)}</div>
            <div style={{ fontFamily: FONT.mono, fontSize: FT.meta, color: C.inkFaint, marginLeft: 10 }}>{r.unit}</div>
          </div>
          <div style={{ position: "relative", height: 8, background: C.panelLine, borderRadius: 4, marginTop: 12 }}>
            <div style={{ position: "absolute", left: 0, top: 0, height: 8, width: "96%", borderRadius: 4, background: r.c, opacity: 0.35 }} />
            <div style={{ position: "absolute", left: "50%", top: -4, width: 2, height: 16, background: r.c }} />
          </div>
        </div>
      ))}
      <div style={{ fontFamily: FONT.mono, fontSize: FT.micro, color: C.inkFaint }}>两条轴的差别都在百分之一以内；条形长度只标出相对位置，不代表数值</div>
    </div>
  );
};

/* ---------- 准确率三根柱 ---------- */

export const AccBars: React.FC<{ width?: number; at?: number }> = ({ width = 780, at = 0 }) => {
  const f = useCurrentFrame();
  const p = at > 0 ? pct(f, at, at + 20) : 1;
  const items = [
    { label: "线性头", v: M.anchor.probeSynthAcc, color: C.cyan, text: fmt2(M.anchor.probeSynthAcc) },
    { label: "语义锚点", v: M.anchor.anchorAcc, color: C.amber, text: fmt2(M.anchor.anchorAcc) },
    { label: "机会水平", v: M.anchor.chance, color: C.inkFaint, text: fmt2(M.anchor.chance) },
  ];
  return (
    <div style={{ width, opacity: p }}>
      {items.map((it) => (
        <div key={it.label} style={{ display: "flex", alignItems: "center", height: 64 }}>
          <div style={{ width: 140, fontFamily: FONT.sans, fontSize: FT.body, color: C.inkDim }}>{it.label}</div>
          <div style={{ width: width - 290, height: 18, background: C.panelLine, borderRadius: 4 }}>
            <div style={{ height: 18, width: Math.max(3, it.v * (width - 290)), borderRadius: 4, background: it.color, opacity: 0.85 }} />
          </div>
          <div style={{ width: 110, textAlign: "right", fontFamily: FONT.mono, fontSize: FT.lead, color: it.color }}>{it.text}</div>
        </div>
      ))}
      <div style={{ fontFamily: FONT.mono, fontSize: FT.micro, color: C.inkFaint, marginTop: 4 }}>20 类，800 条合成样本；机会水平 1/20 = 0.05</div>
    </div>
  );
};
