import React from "react";
import { useCurrentFrame } from "remotion";
import { C, FONT, FT } from "../design/tokens";
import { M, fmt2, fmt3, fmt4, pct } from "./shared";

export const MiniLegend: React.FC<{ color: string; children: React.ReactNode; dash?: boolean }> = ({ color, children, dash }) => (
  <span style={{ display: "inline-flex", alignItems: "center", gap: 8, fontFamily: FONT.mono, fontSize: FT.meta, color: C.inkDim }}>
    <span style={{ width: 22, height: 0, borderTop: (dash ? "2px dashed " : "2px solid ") + color, display: "inline-block" }} />
    {children}
  </span>
);

const poly = (vals: number[], x: (i: number) => number, y: (v: number) => number) =>
  vals.map((v, i) => (i === 0 ? "M" : "L") + x(i).toFixed(1) + " " + y(v).toFixed(1)).join(" ");

/* ---------- 一条序列：从 1,024 点到 128 点窗口 ---------- */

export const SeriesStrip: React.FC<{
  vals: number[]; width?: number; height?: number; color?: string; at?: number;
  lo?: number; hi?: number; title?: string; note?: string; box?: [number, number];
}> = ({ vals, width = 920, height = 230, color = C.cyan, at = 0, lo, hi, title, note, box }) => {
  const f = useCurrentFrame();
  const p = at > 0 ? pct(f, at, at + 24) : 1;
  const ml = 46, mr = 18, mt = 30, mb = 34;
  const a = lo ?? Math.min(...vals);
  const b = hi ?? Math.max(...vals);
  const X = (i: number) => ml + (i / Math.max(1, vals.length - 1)) * (width - ml - mr);
  const Y = (v: number) => height - mb - ((v - a) / (b - a || 1)) * (height - mt - mb);
  return (
    <div style={{ opacity: p }}>
      <svg width={width} height={height}>
        {title ? <text x={4} y={16} fontFamily={FONT.mono} fontSize={FT.meta} fill={C.inkFaint}>{title}</text> : null}
        {box ? (
          <rect x={X(box[0])} y={mt - 4} width={X(box[1]) - X(box[0])} height={height - mt - mb + 8} rx={8}
            fill="rgba(78,226,214,0.07)" stroke={C.cyanDeep} strokeDasharray="4 5" />
        ) : null}
        <line x1={ml} x2={width - mr} y1={Y(0)} y2={Y(0)} stroke={C.panelLine} strokeDasharray="4 6" />
        <path d={poly(vals, X, Y)} fill="none" stroke={color} strokeWidth={1.8} />
        <text x={ml - 8} y={Y(b) + 4} textAnchor="end" fontFamily={FONT.mono} fontSize={FT.micro} fill={C.inkFaint}>{fmt2(b)}</text>
        <text x={ml - 8} y={Y(a) + 4} textAnchor="end" fontFamily={FONT.mono} fontSize={FT.micro} fill={C.inkFaint}>{fmt2(a)}</text>
        {note ? <text x={4} y={height - 6} fontFamily={FONT.mono} fontSize={FT.micro} fill={C.inkFaint}>{note}</text> : null}
      </svg>
    </div>
  );
};

/* ---------- 极角：一个点变成一个角度 ---------- */

export const PolarCircle: React.FC<{ width?: number; height?: number; at?: number }> = ({ width = 460, height = 380, at = 0 }) => {
  const f = useCurrentFrame();
  const p = at > 0 ? pct(f, at, at + 22) : 1;
  const cx = 200, cy = 190, r = 128;
  const phiI = Math.acos(0.2), phiJ = Math.acos(-0.5);
  const pt = (phi: number, rr = r) => [cx + Math.cos(phi) * rr, cy - Math.sin(phi) * rr];
  const [ax, ay] = pt(phiI);
  const [bx, by] = pt(phiJ);
  return (
    <div style={{ opacity: p }}>
      <svg width={width} height={height}>
        <circle cx={cx} cy={cy} r={r} fill="none" stroke={C.panelLine} />
        <line x1={cx - r - 16} x2={cx + r + 16} y1={cy} y2={cy} stroke={C.panelLine} strokeDasharray="4 6" />
        <line x1={cx} x2={ax} y1={cy} y2={ay} stroke={C.violet} strokeWidth={2} />
        <line x1={cx} x2={bx} y1={cy} y2={by} stroke={C.cyan} strokeWidth={2} />
        <path d={arc(cx, cy, r * 0.30, 0, phiI)} fill="none" stroke={C.amber} strokeWidth={2} />
        <path d={arc(cx, cy, r * 0.46, 0, phiJ)} fill="none" stroke={C.amber} strokeWidth={1.4} opacity={0.7} />
        <circle cx={ax} cy={ay} r={6} fill={C.violet} />
        <circle cx={bx} cy={by} r={6} fill={C.cyan} />
        <text x={cx + Math.cos(phiI / 2) * r * 0.38} y={cy - Math.sin(phiI / 2) * r * 0.38 + 5} fontFamily={FONT.mono} fontSize={FT.meta} fill={C.amber}>φ_i</text>
        <text x={cx + Math.cos(phiJ / 2) * r * 0.54} y={cy - Math.sin(phiJ / 2) * r * 0.54 + 5} fontFamily={FONT.mono} fontSize={FT.meta} fill={C.amber}>φ_j</text>
        <text x={bx + 12} y={by - 12} fontFamily={FONT.mono} fontSize={FT.meta} fill={C.cyan}>x_j = −0.5</text>
        <text x={ax + 12} y={ay - 12} fontFamily={FONT.mono} fontSize={FT.meta} fill={C.violet}>x_i = 0.2</text>
        <text x={cx - r - 12} y={cy + 26} fontFamily={FONT.mono} fontSize={FT.micro} fill={C.inkFaint}>−1</text>
        <text x={cx + r - 4} y={cy + 26} fontFamily={FONT.mono} fontSize={FT.micro} fill={C.inkFaint}>+1</text>
      </svg>
    </div>
  );
};

const arc = (cx: number, cy: number, r: number, a0: number, a1: number) => {
  const p0 = [cx + Math.cos(a0) * r, cy - Math.sin(a0) * r];
  const p1 = [cx + Math.cos(a1) * r, cy - Math.sin(a1) * r];
  const large = a1 - a0 > Math.PI ? 1 : 0;
  return "M" + p0[0].toFixed(1) + " " + p0[1].toFixed(1) + " A " + r + " " + r + " 0 " + large + " 0 " + p1[0].toFixed(1) + " " + p1[1].toFixed(1);
};

/* ---------- 矩阵热图：GASF / MTF 图像 ---------- */

export const Heat: React.FC<{
  m: number[][]; width?: number; at?: number; signed?: boolean; title?: string; note?: string;
  diag?: boolean; rowHi?: number;
}> = ({ m, width = 420, at = 0, signed = true, title, note, diag, rowHi }) => {
  const f = useCurrentFrame();
  const p = at > 0 ? pct(f, at, at + 22) : 1;
  const n = m.length;
  const cell = width / n;
  const vals = m.flat();
  const lo = Math.min(...vals);
  const hi = Math.max(...vals);
  const absMin = Math.min(...vals.map((x) => Math.abs(x)));
  const absMax = Math.max(...vals.map((x) => Math.abs(x)));
  const span = (a: number, b: number) => (b - a > 1e-9 ? b - a : 1);
  const colorOf = (v: number) => {
    if (signed) {
      const a0 = 0.08 + 0.82 * Math.min(1, Math.max(0, (Math.abs(v) - absMin) / span(absMin, absMax)));
      return v >= 0
        ? "rgba(78,226,214," + (Math.abs(v) < 1e-12 ? 0.08 : a0).toFixed(2) + ")"
        : "rgba(255,107,107," + a0.toFixed(2) + ")";
    }
    const t = Math.min(1, Math.max(0, (v - lo) / span(lo, hi)));
    return "rgba(167,139,250," + (0.06 + 0.9 * t).toFixed(2) + ")";
  };
  return (
    <div style={{ opacity: p }}>
      {title ? <div style={{ fontFamily: FONT.mono, fontSize: FT.meta, color: C.inkFaint, marginBottom: 8 }}>{title}</div> : null}
      <svg width={width} height={width + (note ? 26 : 0)}>
        {m.map((row, i) =>
          row.map((v, j) => (
            <rect key={i + "-" + j} x={j * cell} y={i * cell} width={cell - 0.6} height={cell - 0.6}
              fill={colorOf(v)} stroke={diag && i === j ? C.amber : "none"} strokeWidth={diag && i === j ? 0.8 : 0} />
          )),
        )}
        {rowHi !== undefined ? <rect x={0} y={rowHi * cell} width={width} height={cell} fill="none" stroke={C.coral} strokeWidth={2} /> : null}
        {note ? <text x={0} y={width + 18} fontFamily={FONT.mono} fontSize={FT.micro} fill={C.inkFaint}>{note}</text> : null}
      </svg>
    </div>
  );
};

/* ---------- 手算两点：和场与差场 ---------- */

const Matrix2: React.FC<{ v: number[][]; title: string; color: string }> = ({ v, title, color }) => (
  <div style={{ display: "inline-block", marginRight: 40 }}>
    <div style={{ fontFamily: FONT.mono, fontSize: FT.meta, color, marginBottom: 10 }}>{title}</div>
    <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 86px)", gap: 6 }}>
      {v.flatMap((row, i) => row.map((x, j) => (
        <div key={i + "-" + j} style={{
          width: 86, height: 64, borderRadius: 8, background: C.panel, border: "1px solid " + C.panelLine,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontFamily: FONT.mono, fontSize: 26, color: x === 0 ? C.inkFaint : C.ink,
        }}>{Math.abs(x) < 1e-9 ? "0" : fmt2(x)}</div>
      )))}
    </div>
  </div>
);

export const GasfHand: React.FC<{ at?: number }> = ({ at = 0 }) => {
  const f = useCurrentFrame();
  const p = at > 0 ? pct(f, at, at + 20) : 1;
  return (
    <div style={{ opacity: p }}>
      <div style={{ fontFamily: FONT.mono, fontSize: FT.meta, color: C.inkFaint, marginBottom: 18 }}>
        输入 x = [−1, 0] · 恒等缩放 · 极角 [π, π/2]
      </div>
      <Matrix2 v={M.gaf.handGasf} title="GASF = cos(φi + φj)" color={C.cyan} />
      <Matrix2 v={M.gaf.handGadf} title="GADF = sin(φi − φj)" color={C.violet} />
      <div style={{ marginTop: 22, fontFamily: FONT.sans, fontSize: FT.meta, color: C.inkFaint, lineHeight: 1.6 }}>
        对角是 1 和 −1，差场是反对称的 —— 两点的例子把所有符号都钉死了。
      </div>
    </div>
  );
};

/* ---------- 转移场三件套：状态序列 / W / 图像 ---------- */

export const MtfTiles: React.FC<{ at?: number; width?: number }> = ({ at = 0, width = 940 }) => {
  const f = useCurrentFrame();
  const p = at > 0 ? pct(f, at, at + 24) : 1;
  const stripW = 300;
  const cellW = stripW / 128;
  return (
    <div style={{ opacity: p, display: "flex", gap: 34 }}>
      <div>
        <div style={{ fontFamily: FONT.mono, fontSize: FT.meta, color: C.inkFaint, marginBottom: 10 }}>状态序列（128 点，8 箱）</div>
        <svg width={stripW} height={176}>
          {M.series.window.map((v, i) => {
            const h = 18 + (i % 8) * 18;
            return <rect key={i} x={i * cellW} y={170 - h} width={cellW - 0.8} height={h} rx={1}
              fill={binColor(i)} opacity={0.85} />;
          })}
        </svg>
        <div style={{ fontFamily: FONT.mono, fontSize: FT.micro, color: C.inkFaint, marginTop: 4 }}>每箱 16 个点</div>
      </div>
      <div>
        <div style={{ fontFamily: FONT.mono, fontSize: FT.meta, color: C.inkFaint, marginBottom: 10 }}>转移矩阵 W（8×8）</div>
        <Heat m={M.mtf.w} width={176} signed={false} />
        <div style={{ fontFamily: FONT.mono, fontSize: FT.micro, color: C.inkFaint, marginTop: 6 }}>每行和 = 1</div>
      </div>
      <div>
        <div style={{ fontFamily: FONT.mono, fontSize: FT.meta, color: C.inkFaint, marginBottom: 10 }}>铺回时间轴（128×128）</div>
        <Heat m={M.mtf.img64} width={300} signed={false} />
        <div style={{ fontFamily: FONT.mono, fontSize: FT.micro, color: C.inkFaint, marginTop: 6 }}>每行和 = 16</div>
      </div>
    </div>
  );
};

const binColor = (i: number) => {
  const ramp = [C.cyan, C.cyanDeep, C.violet, C.amber, C.coral, C.coralDeep, C.paper, C.inkDim];
  return ramp[(i * 5) % ramp.length];
};

/* ---------- 行和对照：1 与 16 ---------- */

export const RowSumBars: React.FC<{ width?: number; at?: number }> = ({ width = 900, at = 0 }) => {
  const f = useCurrentFrame();
  const p = at > 0 ? pct(f, at, at + 20) : 1;
  const rows = [
    { label: "8×8 的 W", value: 1, max: 16, text: "= 1.0000", color: C.cyan, note: "每行是概率分布" },
    { label: "128×128 图像", value: 16, max: 16, text: "= 16.0000", color: C.violet, note: "每箱 16 个点乘出来的" },
  ];
  return (
    <div style={{ opacity: p, width }}>
      {rows.map((r) => (
        <div key={r.label} style={{ display: "flex", alignItems: "center", height: 74 }}>
          <div style={{ width: 150, fontFamily: FONT.mono, fontSize: FT.meta, color: C.inkDim }}>{r.label}</div>
          <div style={{ width: width - 420, height: 16, background: C.panelLine, borderRadius: 4, position: "relative" }}>
            <div style={{ position: "absolute", left: 0, top: 0, height: 16, borderRadius: 4, width: (r.value / r.max) * (width - 420), background: r.color, opacity: 0.9 }} />
          </div>
          <div style={{ width: 150, textAlign: "right", fontFamily: FONT.mono, fontSize: FT.lead, color: r.color }}>{r.text}</div>
          <div style={{ width: 120, textAlign: "right", fontFamily: FONT.sans, fontSize: FT.micro, color: C.inkFaint }}>{r.note}</div>
        </div>
      ))}
      <div style={{ fontFamily: FONT.sans, fontSize: FT.meta, color: C.inkFaint, marginTop: 8, lineHeight: 1.6 }}>
        行和为 1 的是 8×8 的转移矩阵；n×n 的图像每行是被状态序列打散的一行，行和是 n/q。
      </div>
    </div>
  );
};

/* ---------- 三个固定核 ---------- */

export const KernelTrio: React.FC<{ at?: number }> = ({ at = 0 }) => {
  const f = useCurrentFrame();
  const p = at > 0 ? pct(f, at, at + 20) : 1;
  const names = ["横向梯度", "纵向梯度", "拉普拉斯"];
  return (
    <div style={{ opacity: p, display: "flex", gap: 26 }}>
      {M.vision.kernels.map((k, idx) => (
        <div key={idx}>
          <div style={{ fontFamily: FONT.mono, fontSize: FT.micro, color: C.inkFaint, marginBottom: 8 }}>{names[idx]}</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 44px)", gap: 3 }}>
            {k.flatMap((row, i) => row.map((v, j) => (
              <div key={i + "-" + j} style={{
                width: 44, height: 40, borderRadius: 5, display: "flex", alignItems: "center", justifyContent: "center",
                background: v === 0 ? C.panel : v > 0 ? "rgba(78,226,214,0.14)" : "rgba(255,107,107,0.16)",
                border: "1px solid " + C.panelLine, fontFamily: FONT.mono, fontSize: FT.micro,
                color: v === 0 ? C.inkFaint : C.ink,
              }}>{v === 0 ? "0" : v > 0 ? "+" + v : v}</div>
            )))}
          </div>
        </div>
      ))}
    </div>
  );
};

/* ---------- 卷积前端：一张图进去，一个数出来 ---------- */

export const VisionPipe: React.FC<{ width?: number; at?: number }> = ({ width = 940, at = 0 }) => {
  const f = useCurrentFrame();
  const p = at > 0 ? pct(f, at, at + 24) : 1;
  const stages = ["32×32 的 GASF", "3×3 卷积 ×3", "池化 8×8", "192 维 + 3", "线性头"];
  return (
    <div style={{ opacity: p, width }}>
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        {stages.map((s, i) => (
          <React.Fragment key={s}>
            <div style={{
              flex: i === 1 || i === 2 ? 1.2 : 1, height: 66, borderRadius: 10, background: C.panel,
              border: "1px solid " + C.panelLine, borderTop: "2px solid " + [C.cyan, C.violet, C.amber, C.coral, C.cyanDeep][i],
              display: "flex", alignItems: "center", justifyContent: "center",
              fontFamily: FONT.mono, fontSize: FT.meta, color: C.inkDim, textAlign: "center",
            }}>{s}</div>
            {i < stages.length - 1 ? <div style={{ color: C.inkFaint, fontFamily: FONT.mono }}>→</div> : null}
          </React.Fragment>
        ))}
      </div>
      <div style={{ display: "flex", gap: 30, marginTop: 22, alignItems: "flex-start" }}>
        <Heat m={M.vision.gasf32} width={220} signed title="一个 32 点窗口的 GASF" />
        <div>
          <KernelTrio />
          <div style={{ fontFamily: FONT.sans, fontSize: FT.meta, color: C.inkFaint, marginTop: 14, lineHeight: 1.6 }}>
            三个核固定、不学习；池化后拼成 192 维。加末值、均值、标准差三个数字，共 195 维，196 个参数。
          </div>
        </div>
      </div>
    </div>
  );
};

/* ---------- MAE 三条 ---------- */

export const MaeBars: React.FC<{ width?: number; at?: number }> = ({ width = 900, at = 0 }) => {
  const f = useCurrentFrame();
  const p = at > 0 ? pct(f, at, at + 22) : 1;
  const rows = [
    { label: "图特征", v: M.vision.maeImage, color: C.cyan, note: "192 + 3 维，λ = 10000" },
    { label: "三个数字", v: M.vision.maeContext, color: C.violet, note: "末值、均值、标准差，λ = 100" },
    { label: "朴素基线", v: M.vision.maePersist, color: C.coral, note: "把下一天当零收益" },
  ];
  const max = 2.4;
  return (
    <div style={{ opacity: p, width }}>
      {rows.map((r) => (
        <div key={r.label} style={{ display: "flex", alignItems: "center", height: 78 }}>
          <div style={{ width: 120, fontFamily: FONT.mono, fontSize: FT.meta, color: C.inkDim }}>{r.label}</div>
          <div style={{ width: width - 334, height: 18, background: C.panelLine, borderRadius: 4, position: "relative" }}>
            <div style={{ position: "absolute", left: 0, top: 0, height: 18, borderRadius: 4, width: (r.v / max) * (width - 334), background: r.color, opacity: 0.9 }} />
          </div>
          <div style={{ width: 104, textAlign: "right", fontFamily: FONT.mono, fontSize: FT.lead, color: r.color }}>{fmt4(r.v)}</div>
          <div style={{ width: 180, textAlign: "right", fontFamily: FONT.sans, fontSize: FT.micro, color: C.inkFaint }}>{r.note}</div>
        </div>
      ))}
      <div style={{ fontFamily: FONT.sans, fontSize: FT.meta, color: C.inkFaint, marginTop: 8, lineHeight: 1.6 }}>
        图特征和三个数字打平，差距只有万分之四；两者对朴素基线的优势主要来自收缩。
      </div>
    </div>
  );
};

/* ---------- 1,024 点切 124 个窗口 ---------- */

export const SplitWindows: React.FC<{ width?: number; at?: number }> = ({ width = 940, at = 0 }) => {
  const f = useCurrentFrame();
  const p = at > 0 ? pct(f, at, at + 22) : 1;
  const H = 150;
  const n = M.series.series1024.length;
  const vals = M.series.series1024;
  const lo = Math.min(...vals), hi = Math.max(...vals);
  const X = (i: number) => 10 + (i / (n - 1)) * (width - 20);
  const Y = (v: number) => 92 - ((v - lo) / (hi - lo)) * 70;
  const win = M.vision.winLen;
  const stride = M.vision.stride;
  const starts: number[] = [];
  for (let s = 0; s + win <= n; s += stride) starts.push(s);
  const testFrom = M.vision.train + M.vision.val;
  return (
    <div style={{ opacity: p }}>
      <svg width={width} height={H + 60}>
        <path d={poly(vals, X, Y)} fill="none" stroke={C.inkDim} strokeWidth={1.1} opacity={0.8} />
        {starts.map((s, k) => {
          const color = k < M.vision.train ? C.cyan : k < testFrom ? C.amber : C.coral;
          return <line key={k} x1={X(s)} x2={X(s + win)} y1={124 + (k % 3) * 9} y2={124 + (k % 3) * 9} stroke={color} strokeWidth={1} opacity={0.7} />;
        })}
        <text x={10} y={26} fontFamily={FONT.mono} fontSize={FT.micro} fill={C.inkFaint}>{M.data.seriesStart} → {M.data.seriesEnd} · 1,024 个点</text>
        <text x={10} y={186} fontFamily={FONT.mono} fontSize={FT.micro} fill={C.inkFaint}>每个短横 = 32 点窗口 · 步长 8 · 共 {M.vision.windows} 个</text>
      </svg>
      <div style={{ display: "flex", gap: 26, fontFamily: FONT.mono, fontSize: FT.micro, color: C.inkFaint }}>
        <span><span style={{ color: C.cyan }}>■</span> 训练 {M.vision.train}</span>
        <span><span style={{ color: C.amber }}>■</span> 验证 {M.vision.val}</span>
        <span><span style={{ color: C.coral }}>■</span> 测试 {M.vision.test}</span>
      </div>
    </div>
  );
};

/* ---------- 模块规模 ---------- */

export const ModuleBars: React.FC<{ width?: number; at?: number }> = ({ width = 900, at = 0 }) => {
  const f = useCurrentFrame();
  const p = at > 0 ? pct(f, at, at + 20) : 1;
  const rows = [
    { label: "GAF.hs", v: M.code.gafLines, color: C.cyan, note: "缩放 · 极角 · 和差场 · 反解" },
    { label: "MTF.hs", v: M.code.mtfLines, color: C.violet, note: "分箱 · 转移矩阵 · 铺开" },
    { label: "VisionForecast.hs", v: M.code.visionLines, color: C.amber, note: "卷积 · 池化 · 岭回归" },
    { label: "证据程序", v: M.code.evidenceLines, color: C.coral, note: "19 项检查" },
  ];
  const max = 280;
  return (
    <div style={{ opacity: p, width }}>
      {rows.map((r) => (
        <div key={r.label} style={{ display: "flex", alignItems: "center", height: 68 }}>
          <div style={{ width: 190, fontFamily: FONT.mono, fontSize: FT.meta, color: C.inkDim }}>{r.label}</div>
          <div style={{ width: width - 470, height: 16, background: C.panelLine, borderRadius: 4, position: "relative" }}>
            <div style={{ position: "absolute", left: 0, top: 0, height: 16, borderRadius: 4, width: (r.v / max) * (width - 470), background: r.color, opacity: 0.9 }} />
          </div>
          <div style={{ width: 90, textAlign: "right", fontFamily: FONT.mono, fontSize: FT.lead, color: r.color }}>{r.v}</div>
          <div style={{ width: 190, textAlign: "right", fontFamily: FONT.sans, fontSize: FT.micro, color: C.inkFaint }}>{r.note}</div>
        </div>
      ))}
      <div style={{ fontFamily: FONT.mono, fontSize: FT.micro, color: C.inkFaint, marginTop: 6 }}>
        三个模块 {M.code.totalLines} 行 · 单测 {M.code.tests} 条（{M.code.gafTests} / {M.code.mtfTests} / {M.code.visionTests}）
      </div>
    </div>
  );
};
