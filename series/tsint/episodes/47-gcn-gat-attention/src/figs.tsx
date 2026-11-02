import React from "react";
import { useCurrentFrame } from "remotion";
import { C, FONT, FT } from "../design/tokens";
import { M, fmt4, fmt2, fmtInt, pct } from "./shared";

const gm = M.graph;
const d = M.data;

/** 30 只股票的品类环：位置按行业分段，边取自相关性矩阵。 */
export const GraphFig: React.FC<{ width?: number; height?: number; at?: number }> = ({ width = 1010, height = 610, at = 0 }) => {
  const f = useCurrentFrame();
  const p = at > 0 ? pct(f, at, at + 26) : 1;
  const cx = 520, cy = 300, R = 238;
  const gcol = [C.cyan, C.amber, C.violet];
  const N = d.cols;
  const pos = (i: number): [number, number] => {
    const g = d.groups[i];
    const within = i - g * 10;
    const a0 = -90 + g * 120 + 5;
    const step = 110 / 9;
    const a = ((a0 + within * step) * Math.PI) / 180;
    return [cx + R * Math.cos(a), cy + R * Math.sin(a)];
  };
  const rad = (i: number) => {
    const deg = gm.degrees[i]?.deg ?? 10;
    return 4 + ((deg - gm.minDeg) / Math.max(1, gm.maxDeg - gm.minDeg)) * 6.5;
  };
  return (
    <div style={{ width, height, position: "relative", opacity: p }}>
      <svg width={width} height={height} style={{ display: "block" }}>
        {d.names.map((_, i) =>
          d.names.map((__, j) => {
            if (j <= i) return null;
            const r = gm.corr[i]?.[j] ?? 0;
            if (Math.abs(r) < gm.theta) return null;
            const [x1, y1] = pos(i);
            const [x2, y2] = pos(j);
            const same = d.groups[i] === d.groups[j];
            return (
              <line key={i + "-" + j} x1={x1} y1={y1} x2={x2} y2={y2}
                stroke={same ? gcol[d.groups[i] % 3] : C.coral}
                strokeWidth={same ? 1.1 : 1.5} strokeDasharray={same ? undefined : "4 4"}
                opacity={same ? 0.28 : 0.5} />
            );
          })
        )}
        {d.names.map((n, i) => {
          const [x, y] = pos(i);
          return (
            <g key={n}>
              <circle cx={x} cy={y} r={rad(i)} fill={gcol[d.groups[i] % 3]} opacity={0.92} />
            </g>
          );
        })}
        {d.industries.map((ind, g) => {
          const a0 = -90 + g * 120 + 5;
          const am = a0 + 55;
          const a = (am * Math.PI) / 180;
          const x = cx + (R + 34) * Math.cos(a);
          const y = cy + (R + 34) * Math.sin(a);
          return (
            <text key={ind.name} x={x} y={y} textAnchor="middle" fill={gcol[g]} fontFamily={FONT.sans} fontSize={FT.body}>
              {ind.name + " · " + ind.count}
            </text>
          );
        })}
      </svg>
      <div style={{ position: "absolute", left: 24, bottom: 12, fontFamily: FONT.mono, fontSize: FT.micro, color: C.inkFaint }}>
        {"|corr| ≥ " + fmt2(gm.theta, 1) + " · " + d.edges + " 条线 · 点大小 = 度数 " + gm.minDeg + "–" + gm.maxDeg}
      </div>
    </div>
  );
};

/** 435 对相关性的分布，阈值线落在 0.3。 */
export const CorrHistFig: React.FC<{ width?: number; height?: number }> = ({ width = 520, height = 300 }) => {
  const bins = new Array(10).fill(0) as number[];
  let total = 0;
  for (let i = 0; i < d.cols; i++) for (let j = i + 1; j < d.cols; j++) {
    const a = Math.abs(gm.corr[i]?.[j] ?? 0);
    bins[Math.min(9, Math.floor(a * 10))] += 1;
    total += 1;
  }
  const hi = Math.max(...bins);
  const padL = 46, padB = 50, padT = 26;
  const bw = (width - padL - 16) / 10;
  const X = (k: number) => padL + k * bw;
  const bh = (v: number) => (v / hi) * (height - padT - padB);
  const above = d.edges;
  return (
    <svg width={width} height={height} style={{ display: "block" }}>
      <line x1={padL} y1={height - padB} x2={width - 16} y2={height - padB} stroke={C.panelLine} strokeWidth={1} />
      {bins.map((v, k) => (
        <g key={k}>
          <rect x={X(k) + 2} y={height - padB - bh(v)} width={bw - 4} height={bh(v)} rx={2}
            fill={k >= 3 ? C.cyan : C.inkFaint} opacity={k >= 3 ? 0.8 : 0.35} />
          {v > 0 ? <text x={X(k) + bw / 2} y={height - padB - bh(v) - 7} textAnchor="middle" fill={C.inkFaint} fontFamily={FONT.mono} fontSize={FT.micro}>{v}</text> : null}
          <text x={X(k) + bw / 2} y={height - padB + 20} textAnchor="middle" fill={C.inkFaint} fontFamily={FONT.mono} fontSize={FT.micro}>{(k / 10).toFixed(1)}</text>
        </g>
      ))}
      <line x1={X(3)} y1={padT} x2={X(3)} y2={height - padB} stroke={C.coral} strokeDasharray="5 4" strokeWidth={1.2} />
      <text x={X(3) + 8} y={padT + 14} fill={C.coral} fontFamily={FONT.mono} fontSize={FT.micro}>{"θ = 0.3"}</text>
      <text x={padL} y={height - 10} fill={C.inkFaint} fontFamily={FONT.sans} fontSize={FT.micro}>{"|相关性| · " + total + " 对 · 过线 " + above + " 对"}</text>
    </svg>
  );
};

/** 行业内密度 vs 跨行业密度。 */
export const DensityFig: React.FC<{ width?: number }> = ({ width = 980 }) => {
  const p = 1;
  const rows: { label: string; value: number; text: string; color: string; note: string }[] = [
    { label: "行业内", value: gm.intraRate, text: fmt4(gm.intraRate), color: C.cyan, note: d.intra + " / " + d.intraPairs + " 对" },
    { label: "跨行业", value: gm.crossRate, text: fmt4(gm.crossRate), color: C.coral, note: d.cross + " / " + d.crossPairs + " 对" },
  ];
  return (
    <div style={{ width, opacity: p }}>
      {rows.map((r, i) => (
        <div key={r.label} style={{ display: "flex", alignItems: "center", marginTop: i ? 22 : 6 }}>
          <div style={{ width: 120, fontFamily: FONT.sans, fontSize: FT.body, color: C.inkDim }}>{r.label}</div>
          <div style={{ width: width - 470, height: 26, background: C.panelLine, borderRadius: 5, position: "relative" }}>
            <div style={{ position: "absolute", left: 0, top: 0, height: 26, width: Math.max(4, r.value * (width - 470)), borderRadius: 5, background: r.color, opacity: 0.9 }} />
          </div>
          <div style={{ width: 96, textAlign: "right", fontFamily: FONT.mono, fontSize: FT.body, color: r.color }}>{r.text}</div>
          <div style={{ width: 250, paddingLeft: 18, fontFamily: FONT.mono, fontSize: FT.meta, color: C.inkFaint }}>{r.note}</div>
        </div>
      ))}
      <div style={{ marginTop: 22, display: "flex", gap: 26, fontFamily: FONT.mono, fontSize: FT.meta, color: C.inkFaint }}>
        <span>{"边总数 " + d.edges}</span>
        <span>{"行业内 " + d.intra + " 条"}</span>
        <span>{"跨行业 " + d.cross + " 条"}</span>
        <span>{"行业内部几乎全连满"}</span>
      </div>
    </div>
  );
};

/** 30 个节点切 21 / 9：每个行业的前 7 只训练、后 3 只测试（splitMask 按类内计数切）。 */
export const SplitFig: React.FC<{ width?: number }> = ({ width = 980 }) => {
  const cells = new Array(d.cols).fill(0).map((_, i) => i);
  return (
    <div style={{ width }}>
      <div style={{ display: "flex", gap: 6 }}>
        {cells.map((i) => {
          const test = i % 10 >= 7;
          return (
            <div key={i} style={{ flex: 1, height: 84, background: test ? C.amber : C.panel, border: "1px solid " + (test ? C.amber : C.panelLine), borderRadius: 5, opacity: test ? 0.85 : 1, display: "flex", alignItems: "flex-end", justifyContent: "center", paddingBottom: 6, fontFamily: FONT.mono, fontSize: 10, color: test ? C.bg : C.inkFaint }}>
              {i + 1}
            </div>
          );
        })}
      </div>
      <div style={{ display: "flex", marginTop: 12, gap: 26, fontFamily: FONT.mono, fontSize: FT.meta }}>
        <span style={{ color: C.cyan }}>{"训练 " + d.trainNodes + " 个"}</span>
        <span style={{ color: C.amber }}>{"测试 " + d.testNodes + " 个"}</span>
        <span style={{ color: C.inkFaint }}>{"每个行业前 7 只训练、后 3 只测试 · 同一张图，两个子集"}</span>
      </div>
    </div>
  );
};

/** 归一化邻接：两节点一边，P 的每一行都是 0.5。 */
export const NormFig: React.FC<{ width?: number }> = ({ width = 980 }) => {
  const p2 = M.gcn.p2;
  return (
    <div style={{ width }}>
      <svg width={width} height={306} style={{ display: "block" }}>
        <circle cx={120} cy={112} r={26} fill="none" stroke={C.cyan} strokeWidth={2} />
        <text x={120} y={119} textAnchor="middle" fill={C.cyan} fontFamily={FONT.mono} fontSize={FT.body}>A</text>
        <circle cx={380} cy={112} r={26} fill="none" stroke={C.cyan} strokeWidth={2} />
        <text x={380} y={119} textAnchor="middle" fill={C.cyan} fontFamily={FONT.mono} fontSize={FT.body}>B</text>
        <line x1={148} y1={112} x2={352} y2={112} stroke={C.inkDim} strokeWidth={1.6} />
        <text x={250} y={98} textAnchor="middle" fill={C.inkFaint} fontFamily={FONT.mono} fontSize={FT.micro}>A_AB = 1</text>
        <text x={250} y={160} textAnchor="middle" fill={C.inkFaint} fontFamily={FONT.sans} fontSize={FT.meta}>{"两个点，一条边，加自环"}</text>
        {p2.map((row, i) =>
          row.map((v, j) => (
            <g key={i + "" + j}>
              <rect x={560 + j * 96} y={52 + i * 96} width={88} height={88} rx={6}
                fill={v > 0.4 ? C.cyanDeep : C.panel} stroke={v > 0.4 ? C.cyan : C.panelLine} strokeWidth={1} />
              <text x={604 + j * 96} y={52 + i * 96 + 56} textAnchor="middle" fill={v > 0.4 ? C.ink : C.inkFaint} fontFamily={FONT.mono} fontSize={FT.body}>{fmt2(v, 1)}</text>
            </g>
          ))
        )}
        <text x={560} y={40} fill={C.inkFaint} fontFamily={FONT.mono} fontSize={FT.micro}>P · 每行和 1</text>
        <text x={560} y={292} fill={C.inkFaint} fontFamily={FONT.sans} fontSize={FT.meta}>{"自己的 1 与邻居的 1 各占一半"}</text>
      </svg>
    </div>
  );
};

/** tanh 在 1 处是 0.7616，不是 1。 */
export const TanhFig: React.FC<{ width?: number; height?: number }> = ({ width = 560, height = 300 }) => {
  const pts = new Array(61).fill(0).map((_, i) => -3 + (i * 6) / 60);
  const padL = 56, padB = 42, padT = 26;
  const X = (x: number) => padL + ((x + 3) / 6) * (width - padL - 26);
  const Y = (y: number) => height - padB - ((y + 1) / 2) * (height - padT - padB);
  const path = pts.map((x, i) => (i === 0 ? "M" : "L") + X(x).toFixed(1) + "," + Y(Math.tanh(x)).toFixed(1)).join(" ");
  return (
    <svg width={width} height={height} style={{ display: "block" }}>
      <line x1={padL} y1={Y(0)} x2={width - 26} y2={Y(0)} stroke={C.panelLine} strokeWidth={1} />
      <line x1={X(0)} y1={padT} x2={X(0)} y2={height - padB} stroke={C.panelLine} strokeWidth={1} />
      <path d={path} fill="none" stroke={C.cyan} strokeWidth={2.4} />
      <line x1={X(1)} y1={padT} x2={X(1)} y2={height - padB} stroke={C.amber} strokeDasharray="4 4" strokeWidth={1.2} />
      <line x1={padL} y1={Y(M.gcn.tanh1)} x2={X(1)} y2={Y(M.gcn.tanh1)} stroke={C.coral} strokeDasharray="4 4" strokeWidth={1.2} />
      <circle cx={X(1)} cy={Y(M.gcn.tanh1)} r={5} fill={C.coral} />
      <text x={X(1) + 14} y={Y(M.gcn.tanh1) - 12} fill={C.coral} fontFamily={FONT.mono} fontSize={FT.micro}>{"tanh(1) = " + fmt4(M.gcn.tanh1)}</text>
      <text x={X(1)} y={Y(M.gcn.tanh1) + 26} textAnchor="middle" fill={C.amber} fontFamily={FONT.mono} fontSize={FT.micro}>x = 1</text>
      <text x={width - 30} y={Y(1) - 8} textAnchor="end" fill={C.inkFaint} fontFamily={FONT.mono} fontSize={FT.micro}>1.0</text>
      <text x={padL} y={height - 12} fill={C.inkFaint} fontFamily={FONT.sans} fontSize={FT.micro}>输入</text>
    </svg>
  );
};

/** GCN 两层：5 维输入 → 16 → 3。 */
export const MessageFig: React.FC<{ width?: number }> = ({ width = 1000 }) => {
  const layers = M.gcn.layers;
  const stages = [
    { k: "输入 X", v: d.cols + " 个节点", n: "5 维特征", c: C.inkDim },
    { k: "P·X·W1 + b1", v: "5 → 16", n: layers[0] + " 个参数", c: C.cyan },
    { k: "tanh", v: "非线性", n: "有界 (−1, 1)", c: C.violet },
    { k: "P·H·W2 + b2", v: "16 → 3", n: layers[1] + " 个参数", c: C.cyan },
    { k: "softmax", v: "三类", n: "概率和 1", c: C.amber },
  ];
  return (
    <div style={{ width }}>
      <div style={{ display: "flex", alignItems: "stretch", gap: 8 }}>
        {stages.map((s, i) => (
          <React.Fragment key={s.k}>
            <div style={{ flex: 1, background: i === 0 || i === stages.length - 1 ? C.bgSoft : C.panel, border: "1px solid " + C.panelLine, borderRadius: 8, padding: "14px 12px", textAlign: "center" }}>
              <div style={{ fontFamily: FONT.mono, fontSize: FT.meta, color: s.c, lineHeight: 1.3 }}>{s.k}</div>
              <div style={{ fontFamily: FONT.sans, fontSize: FT.body, color: C.ink, marginTop: 8 }}>{s.v}</div>
              <div style={{ fontFamily: FONT.mono, fontSize: FT.micro, color: C.inkFaint, marginTop: 6 }}>{s.n}</div>
            </div>
            {i < stages.length - 1 ? <div style={{ display: "flex", alignItems: "center", color: C.inkFaint, fontSize: 20 }}>›</div> : null}
          </React.Fragment>
        ))}
      </div>
      <div style={{ marginTop: 18, fontFamily: FONT.mono, fontSize: FT.meta, color: C.inkDim }}>
        {"参数合计 " + M.gcn.params + " = (" + layers[0] + ") + (" + layers[1] + ")"}
      </div>
    </div>
  );
};

/** GAT 打分与 softmax：两邻居 [0, ln3] → [0.25, 0.75]。 */
export const ScoreFig: React.FC<{ width?: number }> = ({ width = 980 }) => {
  const [s0, s1] = M.gat.scores;
  const [a0, a1] = M.gat.alpha;
  return (
    <div style={{ width }}>
      <div style={{ display: "flex", gap: 26 }}>
        {[
          { t: "原始打分", v: [s0, s1], d: [fmt4(s0), fmt4(s1)], c: C.inkDim, n: "a·Wh 的 LeakyReLU" },
          { t: "exp", v: [1, 3], d: ["1.0000", "3.0000"], c: C.violet, n: "ln 3 → 3" },
          { t: "归一化权重 α", v: [a0, a1], d: [fmt4(a0), fmt4(a1)], c: C.cyan, n: "和为 1.0000" },
        ].map((col) => (
          <div key={col.t} style={{ flex: 1, background: C.bgSoft, border: "1px solid " + C.panelLine, borderRadius: 8, padding: "14px 16px" }}>
            <div style={{ fontFamily: FONT.mono, fontSize: FT.micro, color: col.c }}>{col.t}</div>
            {col.v.map((v, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", marginTop: 12 }}>
                <div style={{ width: 74, fontFamily: FONT.sans, fontSize: FT.meta, color: C.inkFaint }}>{"邻居 " + (i + 1)}</div>
                <div style={{ flex: 1, height: 16, background: C.panelLine, borderRadius: 4, position: "relative", marginLeft: 8 }}>
                  <div style={{ position: "absolute", left: 0, top: 0, height: 16, borderRadius: 4, background: col.c, opacity: 0.85, width: Math.max(3, Math.min(1, v / 3) * 100) + "%" }} />
                </div>
                <div style={{ width: 92, textAlign: "right", fontFamily: FONT.mono, fontSize: FT.meta, color: col.c }}>{col.d[i]}</div>
              </div>
            ))}
            <div style={{ marginTop: 12, fontFamily: FONT.sans, fontSize: FT.micro, color: C.inkFaint }}>{col.n}</div>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 18, fontFamily: FONT.mono, fontSize: FT.meta, color: C.inkDim }}>
        {"softmax([0, ln 3]) = [" + fmt4(a0) + ", " + fmt4(a1) + "] · 非邻居掩码 −1e30 → 0.0000"}
      </div>
    </div>
  );
};

/** 掩码：非邻居精确 0，行和精确 1。 */
export const MaskFig: React.FC<{ width?: number }> = ({ width = 980 }) => {
  const cells = [
    { k: "邻居 1", v: fmt4(M.gat.alpha[0]), on: true },
    { k: "邻居 2", v: fmt4(M.gat.alpha[1]), on: true },
    { k: "非邻居 1", v: "0.0000", on: false },
    { k: "非邻居 2", v: "0.0000", on: false },
  ];
  return (
    <div style={{ width }}>
      <div style={{ display: "flex", gap: 12 }}>
        {cells.map((c) => (
          <div key={c.k} style={{ flex: 1, background: C.bgSoft, border: "1px " + (c.on ? "solid " + C.cyan : "dashed " + C.coralDeep), borderRadius: 8, padding: "14px 12px", textAlign: "center", opacity: c.on ? 1 : 0.75 }}>
            <div style={{ fontFamily: FONT.sans, fontSize: FT.meta, color: c.on ? C.inkDim : C.inkFaint }}>{c.k}</div>
            <div style={{ fontFamily: FONT.mono, fontSize: FT.num, color: c.on ? C.cyan : C.coral, marginTop: 8 }}>{c.v}</div>
          </div>
        ))}
      </div>
      <div style={{ display: "flex", gap: 24, marginTop: 20, fontFamily: FONT.mono, fontSize: FT.meta, color: C.inkDim }}>
        <span>{"行和 = 1.0000"}</span>
        <span>{"掩码把非邻居压到 −1e30"}</span>
        <span style={{ color: C.coral }}>{"exp(−1e30) 精确下溢到 0"}</span>
      </div>
    </div>
  );
};

/** 缩放：1/sqrt(d′)，d′=4 时 0.5；全零输入退化成均匀 0.5/0.5。 */
export const ScaleFig: React.FC<{ width?: number }> = ({ width = 980 }) => {
  const rows = [
    { d: 1, s: 1.0 },
    { d: 4, s: M.attn.scale },
    { d: 16, s: 0.25 },
  ];
  return (
    <div style={{ width }}>
      <div style={{ display: "flex", gap: 20 }}>
        <div style={{ flex: 1 }}>
          {rows.map((r) => {
            const hi = r.d === 4;
            return (
              <div key={r.d} style={{ display: "flex", alignItems: "center", marginTop: 8 }}>
                <div style={{ width: 130, fontFamily: FONT.mono, fontSize: FT.body, color: hi ? C.cyan : C.inkDim }}>{"d′ = " + r.d}</div>
                <div style={{ flex: 1, height: 22, background: C.panelLine, borderRadius: 4, position: "relative" }}>
                  <div style={{ position: "absolute", left: 0, top: 0, height: 22, width: Math.max(3, r.s * 100) + "%", borderRadius: 4, background: hi ? C.cyan : C.inkFaint, opacity: hi ? 0.92 : 0.4 }} />
                </div>
                <div style={{ width: 90, textAlign: "right", fontFamily: FONT.mono, fontSize: FT.body, color: hi ? C.cyan : C.inkDim }}>{fmt4(r.s)}</div>
              </div>
            );
          })}
          <div style={{ marginTop: 14, fontFamily: FONT.mono, fontSize: FT.micro, color: C.inkFaint }}>{"乘上 1/√d′，点积不再随维度膨胀"}</div>
        </div>
        <div style={{ flex: 1, background: C.bgSoft, border: "1px solid " + C.panelLine, borderRadius: 8, padding: "16px 18px" }}>
          <div style={{ fontFamily: FONT.mono, fontSize: FT.micro, color: C.violet }}>全零输入时的注意力</div>
          <div style={{ display: "flex", alignItems: "center", marginTop: 14 }}>
            <div style={{ width: 96, fontFamily: FONT.sans, fontSize: FT.meta, color: C.inkDim }}>token 1</div>
            <div style={{ flex: 1, height: 18, background: C.panelLine, borderRadius: 4, position: "relative", marginLeft: 8 }}>
              <div style={{ position: "absolute", left: 0, top: 0, height: 18, width: M.attn.uniform * 100 + "%", background: C.violet, opacity: 0.85, borderRadius: 4 }} />
            </div>
            <div style={{ width: 88, textAlign: "right", fontFamily: FONT.mono, fontSize: FT.meta, color: C.violet }}>{fmt4(M.attn.uniform)}</div>
          </div>
          <div style={{ display: "flex", alignItems: "center", marginTop: 12 }}>
            <div style={{ width: 96, fontFamily: FONT.sans, fontSize: FT.meta, color: C.inkDim }}>token 2</div>
            <div style={{ flex: 1, height: 18, background: C.panelLine, borderRadius: 4, position: "relative", marginLeft: 8 }}>
              <div style={{ position: "absolute", left: 0, top: 0, height: 18, width: M.attn.uniform * 100 + "%", background: C.violet, opacity: 0.85, borderRadius: 4 }} />
            </div>
            <div style={{ width: 88, textAlign: "right", fontFamily: FONT.mono, fontSize: FT.meta, color: C.violet }}>{fmt4(M.attn.uniform)}</div>
          </div>
          <div style={{ marginTop: 14, fontFamily: FONT.sans, fontSize: FT.micro, color: C.inkFaint }}>{"没有图的时候，每个位置对每个位置说话"}</div>
        </div>
      </div>
    </div>
  );
};

/** 三个模型的参数量，按两层拆。 */
export const ParamFig: React.FC<{ width?: number }> = ({ width = 990 }) => {
  const items = [
    { label: "GCN", total: M.gcn.params, parts: M.gcn.layers, colors: [C.cyanDeep, C.cyan], names: ["5→16", "16→3"] },
    { label: "GAT", total: M.gat.params, parts: M.gat.layers, colors: [C.violet, C.coral], names: ["4 头 · 5→4", "4 头 · 16→3"] },
    { label: "自注意力", total: M.attn.params, parts: M.attn.layers, colors: [C.amber, C.inkDim], names: ["QKV · 5→4", "QKV · 16→3"] },
  ];
  const max = Math.max(...items.map((i) => i.total));
  const bw = width - 430;
  return (
    <div style={{ width }}>
      {items.map((it) => (
        <div key={it.label} style={{ marginTop: 20 }}>
          <div style={{ display: "flex", alignItems: "baseline" }}>
            <div style={{ width: 130, fontFamily: FONT.sans, fontSize: FT.body, color: C.inkDim }}>{it.label}</div>
            <div style={{ width: 96, fontFamily: FONT.mono, fontSize: FT.body, color: C.ink }}>{fmtInt(it.total)}</div>
            <div style={{ flex: 1, fontFamily: FONT.mono, fontSize: FT.micro, color: C.inkFaint }}>
              {it.parts.map((pv, i) => it.names[i] + " · " + pv).join("   |   ")}
            </div>
          </div>
          <div style={{ display: "flex", marginLeft: 130, marginTop: 8, width: (it.total / max) * bw }}>
            {it.parts.map((pv, i) => (
              <div key={i} style={{ width: (pv / it.total) * 100 + "%", background: it.colors[i], height: 22, borderRadius: i === 0 ? "4px 0 0 4px" : "0 4px 4px 0" }} />
            ))}
          </div>
        </div>
      ))}
      <div style={{ marginTop: 22, fontFamily: FONT.mono, fontSize: FT.micro, color: C.inkFaint }}>{"条长按参数量归一；多头把各头的参数并在一起数"}</div>
    </div>
  );
};

/** 四组准确率：模型 / 随机 / 打乱邻接。 */
export const AccFig: React.FC<{ width?: number }> = ({ width = 1000 }) => {
  const items = [
    { label: "GCN", value: M.gcn.testAcc, text: M.control.gcnCorrect + "/" + d.testNodes, color: C.cyan },
    { label: "GAT", value: M.gat.testAcc, text: Math.round(M.gat.testAcc * d.testNodes) + "/" + d.testNodes, color: C.violet },
    { label: "自注意力", value: M.attn.testAcc, text: M.control.attnCorrect + "/" + d.testNodes, color: C.amber },
    { label: "打乱邻接", value: M.control.shuffledTestAcc, text: M.control.shuffledCorrect + "/" + d.testNodes, color: C.coral },
    { label: "随机猜", value: d.chance, text: "1/3", color: C.inkFaint },
  ];
  const bw = width - 300;
  return (
    <div style={{ width }}>
      {items.map((it, i) => (
        <div key={it.label} style={{ display: "flex", alignItems: "center", height: 54 }}>
          <div style={{ width: 150, fontFamily: FONT.sans, fontSize: FT.body, color: C.inkDim }}>{it.label}</div>
          <div style={{ width: bw, height: 20, background: C.panelLine, borderRadius: 4, position: "relative" }}>
            <div style={{ position: "absolute", left: 0, top: 0, height: 20, width: Math.max(3, (it.value / 1) * bw), borderRadius: 4, background: it.color, opacity: it.label === "随机猜" ? 0.4 : 0.9 }} />
            {i === 0 ? <div style={{ position: "absolute", left: (d.chance / 1) * bw, top: -6, height: 32, borderLeft: "1px dashed " + C.inkFaint }} /> : null}
          </div>
          <div style={{ width: 140, textAlign: "right", fontFamily: FONT.mono, fontSize: FT.body, color: it.color }}>{it.text}</div>
        </div>
      ))}
      <div style={{ marginTop: 8, fontFamily: FONT.mono, fontSize: FT.micro, color: C.inkFaint }}>
        {"测试节点 " + d.testNodes + " 个 · 虚线 = 三类随机 " + fmt4(d.chance)}
      </div>
    </div>
  );
};

/** 三条损失：起点到终点。 */
export const LossFig: React.FC<{ width?: number; height?: number }> = ({ width = 980, height = 300 }) => {
  const series = [
    { name: "GCN", color: C.cyan, values: [M.gcn.lossStart, M.gcn.lossEnd] },
    { name: "GAT", color: C.violet, values: [M.gat.lossStart, M.gat.lossEnd] },
    { name: "自注意力", color: C.amber, values: [M.attn.lossStart, M.attn.lossEnd] },
  ];
  const padL = 74, padB = 52, padT = 26, padR = 214;
  const lo = 0, hi = 1.2;
  const X = (i: number) => padL + i * (width - padL - padR);
  const Y = (v: number) => height - padB - ((v - lo) / (hi - lo)) * (height - padT - padB);
  const placed = series.map((s) => ({ ...s, y: Y(s.values[1]), ly: Y(s.values[1]) }));
  const order = placed.slice().sort((a, b) => a.y - b.y);
  let prevLy = padT + 12;
  for (const k of order) {
    k.ly = Math.max(k.y, prevLy);
    prevLy = k.ly + 22;
  }
  const lyMax = Math.max(...placed.map((p) => p.ly));
  const shift = lyMax > height - padB ? lyMax - (height - padB) : 0;
  for (const p of placed) p.ly -= shift;
  return (
    <svg width={width} height={height} style={{ display: "block" }}>
      {[0, 0.4, 0.8, 1.2].map((v) => (
        <g key={v}>
          <line x1={padL} y1={Y(v)} x2={width - padR} y2={Y(v)} stroke={C.panelLine} strokeWidth={1} />
          <text x={padL - 12} y={Y(v) + 4} textAnchor="end" fill={C.inkFaint} fontFamily={FONT.mono} fontSize={FT.micro}>{v.toFixed(1)}</text>
        </g>
      ))}
      {placed.map((s) => (
        <g key={s.name}>
          <line x1={X(0)} y1={Y(s.values[0])} x2={X(1)} y2={Y(s.values[1])} stroke={s.color} strokeWidth={2.4} />
          <circle cx={X(0)} cy={Y(s.values[0])} r={5} fill={s.color} />
          <circle cx={X(1)} cy={Y(s.values[1])} r={5} fill={s.color} />
          <line x1={X(1) + 6} y1={s.y} x2={X(1) + 14} y2={s.ly} stroke={s.color} strokeWidth={1} opacity={0.7} />
          <text x={X(1) + 18} y={s.ly + 5} fill={s.color} fontFamily={FONT.mono} fontSize={FT.micro}>{s.name + " " + fmt4(s.values[0]) + " → " + fmt4(s.values[1])}</text>
        </g>
      ))}
      <text x={padL} y={height - 16} fill={C.inkFaint} fontFamily={FONT.sans} fontSize={FT.micro}>第 1 轮</text>
      <text x={X(1)} y={height - 16} textAnchor="end" fill={C.inkFaint} fontFamily={FONT.sans} fontSize={FT.micro}>第 300 轮</text>
    </svg>
  );
};

/** 置换等变：重排编号，输出跟着重排。 */
export const PermFig: React.FC<{ width?: number }> = ({ width = 980 }) => {
  const ring = (cx: number, cy: number, phase: number, color: string) => {
    const R = 78;
    return (
      <g>
        {new Array(30).fill(0).map((_, i) => {
          const a = ((i * 12 - 90) * Math.PI) / 180;
          return <circle key={i} cx={cx + R * Math.cos(a)} cy={cy + R * Math.sin(a)} r={4.2} fill={color} opacity={0.55 + 0.4 * ((i + phase) % 3 === 0 ? 1 : 0.2)} />;
        })}
      </g>
    );
  };
  return (
    <div style={{ width }}>
      <svg width={width} height={210} style={{ display: "block" }}>
        {ring(width * 0.24, 100, 0, C.cyan)}
        {ring(width * 0.76, 100, 5, C.violet)}
        <text x={width * 0.24} y={200} textAnchor="middle" fill={C.inkFaint} fontFamily={FONT.mono} fontSize={FT.micro}>原编号</text>
        <text x={width * 0.76} y={200} textAnchor="middle" fill={C.inkFaint} fontFamily={FONT.mono} fontSize={FT.micro}>重排编号</text>
        <line x1={width * 0.24 + 118} y1={100} x2={width * 0.5 - 6} y2={100} stroke={C.inkFaint} strokeWidth={1.4} strokeDasharray="5 5" />
        <line x1={width * 0.5 + 6} y1={100} x2={width * 0.76 - 118} y2={100} stroke={C.inkFaint} strokeWidth={1.4} strokeDasharray="5 5" />
        <text x={width * 0.5} y={78} textAnchor="middle" fill={C.inkDim} fontFamily={FONT.sans} fontSize={FT.meta}>交换两个节点看输出</text>
        <text x={width * 0.5} y={126} textAnchor="middle" fill={C.cyan} fontFamily={FONT.mono} fontSize={FT.meta}>{"最大偏差 " + M.control.permEquivErr.toExponential(3)}</text>
      </svg>
    </div>
  );
};

/** 每组的检查条数。 */
export const GroupCountFig: React.FC<{ width?: number }> = ({ width = 980 }) => {
  const counts = ["data", "gcn", "gat", "attn", "control", "train"].map((g) => ({ g, n: M.checks.filter((c) => c.group === g).length }));
  const hi = Math.max(...counts.map((c) => c.n));
  return (
    <div style={{ width, display: "flex", alignItems: "flex-end", gap: 22, height: 190 }}>
      {counts.map((c) => {
        const h = (c.n / hi) * 130;
        return (
          <div key={c.g} style={{ flex: 1, textAlign: "center" }}>
            <div style={{ fontFamily: FONT.mono, fontSize: FT.body, color: C.cyan, marginBottom: 6 }}>{c.n}</div>
            <div style={{ height: h, background: C.cyanDeep, borderRadius: "4px 4px 0 0", border: "1px solid " + C.cyan, opacity: 0.75 }} />
            <div style={{ fontFamily: FONT.mono, fontSize: FT.micro, color: C.inkFaint, marginTop: 8 }}>{c.g}</div>
          </div>
        );
      })}
    </div>
  );
};

/** 结论条：三步串联的小图，供 outro 用。 */
export const ThreeUpFig: React.FC<{ width?: number }> = ({ width = 980 }) => {
  const items = [
    { k: "GCN", v: fmt4(M.gcn.testAcc), n: "固定邻接 · " + M.gcn.params + " 参数", c: C.cyan },
    { k: "GAT", v: fmt4(M.gat.testAcc), n: "学权重 · " + M.gat.params + " 参数", c: C.violet },
    { k: "自注意力", v: fmt4(M.attn.testAcc), n: "不要图 · " + M.attn.params + " 参数", c: C.amber },
  ];
  return (
    <div style={{ width, display: "flex", gap: 18 }}>
      {items.map((it) => (
        <div key={it.k} style={{ flex: 1, background: C.bgSoft, border: "1px solid " + C.panelLine, borderTop: "3px solid " + it.c, borderRadius: 8, padding: "18px 18px 16px" }}>
          <div style={{ fontFamily: FONT.sans, fontSize: FT.body, color: C.inkDim }}>{it.k}</div>
          <div style={{ fontFamily: FONT.mono, fontSize: FT.num, color: it.c, marginTop: 8 }}>{it.v}</div>
          <div style={{ fontFamily: FONT.mono, fontSize: FT.micro, color: C.inkFaint, marginTop: 10 }}>{it.n}</div>
        </div>
      ))}
    </div>
  );
};

