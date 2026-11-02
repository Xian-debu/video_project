import React from "react";
import { useCurrentFrame } from "remotion";
import { C, FONT, FT } from "../design/tokens";
import { M, pct, fmt4, fmt2, Card } from "./shared";

const axis = (x: number, y: number, w: number, color = C.panelLine) => (
  <line x1={x} y1={y} x2={x + w} y2={y} stroke={color} strokeWidth={1} />
);

/** 一条 500 步的收益序列：窗口有多长。 */
export const SeriesRetFig: React.FC<{ width?: number; at?: number }> = ({ width = 1040, at = 0 }) => {
  const f = useCurrentFrame();
  const p = at > 0 ? pct(f, at, at + 24) : 1;
  const v = M.series.ret;
  const H = 240;
  const lo = Math.min(...v);
  const hi = Math.max(...v);
  const mid = (lo + hi) / 2;
  const sc = (H - 40) / Math.max(1e-9, hi - lo);
  const x = (i: number) => (i / (v.length - 1)) * width;
  const y = (val: number) => H / 2 - (val - mid) * sc;
  const d = v.map((val, i) => (i ? "L" : "M") + " " + fmt2(x(i), 1) + " " + fmt2(y(val), 1)).join(" ");
  const bw = (60 / (v.length - 1)) * width;
  return (
    <div style={{ width, opacity: p }}>
      <svg width={width} height={H + 74} style={{ display: "block" }}>
        {axis(0, H / 2, width, C.panelLine)}
        <path d={d} fill="none" stroke={C.cyan} strokeWidth={1.6} />
        <rect x={width - bw} y={8} width={bw} height={H - 16} fill="rgba(251,113,133,0.14)" stroke={C.coral} strokeWidth={1.3} />
        <text x={width - bw / 2} y={H - 6} textAnchor="middle" fill={C.coral} fontFamily={FONT.mono} fontSize={FT.micro}>末 60 天</text>
        <text x={4} y={H + 26} fill={C.inkFaint} fontFamily={FONT.mono} fontSize={FT.micro}>day 0</text>
        <text x={width} y={H + 26} textAnchor="end" fill={C.inkFaint} fontFamily={FONT.mono} fontSize={FT.micro}>day 499</text>
        <text x={0} y={H + 60} fill={C.inkDim} fontFamily={FONT.sans} fontSize={FT.meta}>
          {M.series.code + " " + M.series.name + "：一条 500 步的对数收益序列，标签看末 60 天。"}
        </text>
      </svg>
    </div>
  );
};

/** 串行 500 步 vs brick：十块并行，第二层十步。 */
export const BrickFig: React.FC<{ width?: number; at?: number; compact?: boolean }> = ({ width = 1020, at = 0, compact = false }) => {
  const f = useCurrentFrame();
  const p = at > 0 ? pct(f, at, at + 22) : 1;
  const n = M.brick.blocks;
  const bw = 52;
  const gap = 14;
  const top = 46;
  const left = 96;
  return (
    <div style={{ width, opacity: p }}>
      <svg width={width} height={compact ? 300 : 330} style={{ display: "block" }}>
        <text x={0} y={22} fill={C.inkFaint} fontFamily={FONT.mono} fontSize={FT.micro}>{"串行：" + M.brick.depthSerial + " 步"}</text>
        <rect x={left} y={30} width={width - left - 60} height={12} rx={6} fill="rgba(154,167,182,0.22)" />
        {Array.from({ length: 50 }).map((_, i) => (
          <line key={"s" + i} x1={left + (i * (width - left - 60)) / 49} y1={30} x2={left + (i * (width - left - 60)) / 49} y2={42} stroke={C.inkFaint} strokeWidth={0.6} opacity={0.5} />
        ))}
        <text x={0} y={top + 62} fill={C.inkFaint} fontFamily={FONT.mono} fontSize={FT.micro}>{"brick：" + n + " 块 × " + M.brick.blockLen + " 步"}</text>
        {Array.from({ length: n }).map((_, i) => (
          <g key={"b" + i}>
            <rect x={left + i * (bw + gap)} y={top + 72} width={bw} height={40} rx={5} fill="rgba(94,234,212,0.14)" stroke={C.cyan} strokeWidth={1.2} />
            <text x={left + i * (bw + gap) + bw / 2} y={top + 98} textAnchor="middle" fill={C.cyan} fontFamily={FONT.mono} fontSize={FT.micro}>{M.brick.blockLen}</text>
          </g>
        ))}
        <text x={left + n * (bw + gap) + 12} y={top + 98} fill={C.inkDim} fontFamily={FONT.mono} fontSize={FT.micro}>{"并行"}</text>
        {Array.from({ length: n }).map((_, i) => (
          <line key={"a" + i} x1={left + i * (bw + gap) + bw / 2} y1={top + 112} x2={left + n * (bw + gap) / 2 + i * 26} y2={top + 152} stroke={C.panelLine} strokeWidth={1} />
        ))}
        {Array.from({ length: n }).map((_, i) => (
          <rect key={"c" + i} x={left + n * (bw + gap) / 2 + i * 26} y={top + 154} width={20} height={26} rx={4} fill="rgba(167,139,250,0.2)" stroke={C.violet} strokeWidth={1} />
        ))}
        <text x={left + n * (bw + gap) / 2} y={top + 210} fill={C.violet} fontFamily={FONT.mono} fontSize={FT.micro}>{n + " 个块末状态 → 第二层 " + n + " 步"}</text>
        <text x={0} y={compact ? 294 : 300} fill={C.coral} fontFamily={FONT.mono} fontSize={FT.meta}>
          {"串行深度 " + M.brick.depthSerial + " → " + M.brick.depthParallel + "，比 " + fmt2(M.brick.depthRatio, 2) + " 倍"}
        </text>
        {compact ? null : (
          <text x={0} y={324} fill={C.inkDim} fontFamily={FONT.sans} fontSize={FT.meta}>{"块内串行、块间并行；第二层只吃 " + n + " 个状态，窗口再长也只走 " + n + " 步。"}</text>
        )}
      </svg>
    </div>
  );
};

/** 空洞：核不连着摆，隔 d 个点取一个。 */
export const DilTapsFig: React.FC<{ width?: number; at?: number }> = ({ width = 1000, at = 0 }) => {
  const f = useCurrentFrame();
  const p = at > 0 ? pct(f, at, at + 20) : 1;
  const cw = 46;
  const gap = 8;
  const left = 150;
  const rows = [1, 2, 4];
  const labs: Record<number, string> = { 1: "d = 1 普通卷积", 2: "d = 2 隔一个点", 4: "d = 4 隔三个点" };
  return (
    <div style={{ width, opacity: p }}>
      <svg width={width} height={250} style={{ display: "block" }}>
        {rows.map((d, r) => {
          const y = 26 + r * 70;
          const taps = [0, d, 2 * d];
          return (
            <g key={d}>
              <text x={left - 18} y={y + 30} textAnchor="end" fill={C.inkFaint} fontFamily={FONT.mono} fontSize={FT.micro}>{labs[d]}</text>
              {Array.from({ length: 9 }).map((_, i) => {
                const on = taps.indexOf(i) >= 0;
                return (
                  <rect key={i} x={left + i * (cw + gap)} y={y} width={cw} height={40} rx={4}
                    fill={on ? "rgba(94,234,212,0.18)" : C.panel} stroke={on ? C.cyan : C.panelLine} strokeWidth={on ? 1.6 : 1} />
                );
              })}
              {taps.map((t, k) => (
                <line key={k} x1={left + t * (cw + gap) + cw / 2} y1={y + 42} x2={left + t * (cw + gap) + cw / 2} y2={y + 54} stroke={C.coral} strokeWidth={1.2} />
              ))}
              <text x={left + 9 * (cw + gap) + 6} y={y + 26} fill={d === 4 ? C.coral : C.inkFaint} fontFamily={FONT.mono} fontSize={FT.micro}>{d === 4 ? "rf 9" : ""}</text>
            </g>
          );
        })}
        <text x={0} y={240} fill={C.inkDim} fontFamily={FONT.sans} fontSize={FT.meta}>{"核长三，间隔 d：一层就跨过 d 个点，叠层感受野按间隔之和增长。"}</text>
      </svg>
    </div>
  );
};

/** 单步 RNN：输入、隐状态、tanh、线性头。 */
export const RnnCellFig: React.FC<{ width?: number; at?: number }> = ({ width = 980, at = 0 }) => {
  const f = useCurrentFrame();
  const p = at > 0 ? pct(f, at, at + 20) : 1;
  const box = (x: number, y: number, w: number, h: number, label: string, color: string, val?: string) => (
    <g key={label + x}>
      <rect x={x} y={y} width={w} height={h} rx={8} fill={val ? "rgba(94,234,212,0.14)" : C.panel} stroke={color} strokeWidth={val ? 1.8 : 1} />
      <text x={x + w / 2} y={y + (val ? 26 : h / 2 + 8)} textAnchor="middle" fill={val ? C.cyan : C.inkDim} fontFamily={FONT.mono} fontSize={FT.micro}>{label}</text>
      {val ? <text x={x + w / 2} y={y + h - 12} textAnchor="middle" fill={C.ink} fontFamily={FONT.mono} fontSize={FT.meta}>{val}</text> : null}
    </g>
  );
  return (
    <div style={{ width, opacity: p }}>
      <svg width={width} height={210} style={{ display: "block" }}>
        {box(60, 70, 96, 62, "x_t 输入", C.panelLine, "1 维")}
        {box(250, 70, 130, 62, "W_x x + W_h h + b", C.cyan, "tanh → h_t")}
        {box(440, 70, 96, 62, "h_t 隐状态", C.cyan, "4 维")}
        {box(600, 70, 140, 62, "线性头 3H+3", C.violet, "3 个分数")}
        {box(800, 70, 110, 62, "softmax", C.amber, "三类概率")}
        <line x1={156} y1={101} x2={246} y2={101} stroke={C.inkFaint} strokeWidth={1.3} />
        <line x1={380} y1={101} x2={436} y2={101} stroke={C.inkFaint} strokeWidth={1.3} />
        <line x1={536} y1={101} x2={596} y2={101} stroke={C.inkFaint} strokeWidth={1.3} />
        <line x1={740} y1={101} x2={796} y2={101} stroke={C.inkFaint} strokeWidth={1.3} />
        <path d="M 410 70 C 410 26, 300 26, 300 66" fill="none" stroke={C.coral} strokeWidth={1.3} strokeDasharray="5 4" />
        <text x={352} y={22} textAnchor="middle" fill={C.coral} fontFamily={FONT.mono} fontSize={FT.micro}>h_(t−1)</text>
        <text x={0} y={168} fill={C.inkDim} fontFamily={FONT.sans} fontSize={FT.meta}>
          {"整个网络两组权重：输入→隐状态 " + M.rnn.params + " 个参数（D=1, H=4），隐状态→三类再做一层线性。"}
        </text>
        <text x={0} y={200} fill={C.coral} fontFamily={FONT.mono} fontSize={FT.meta}>{"39 = H·D + H·H + H + 3H + 3"}</text>
      </svg>
    </div>
  );
};

/** tanh 压缩 + 三步链：0.4621 → 0.2270 → 0.1130。 */
export const TanhChainFig: React.FC<{ width?: number; at?: number }> = ({ width = 1000, at = 0 }) => {
  const f = useCurrentFrame();
  const p = at > 0 ? pct(f, at, at + 20) : 1;
  const curveW = 360;
  const H = 210;
  const pts = Array.from({ length: 80 }).map((_, i) => {
    const x = -3 + (6 * i) / 79;
    const y = Math.tanh(x);
    return [40 + ((x + 3) / 6) * curveW, H / 2 - 74 - y * 62];
  });
  const d = pts.map((q, i) => (i ? "L" : "M") + " " + fmt2(q[0], 1) + " " + fmt2(q[1], 1)).join(" ");
  const chain = M.rnn.chain;
  const bw = 46;
  return (
    <div style={{ width, opacity: p }}>
      <svg width={width} height={250} style={{ display: "block" }}>
        <path d={d} fill="none" stroke={C.inkFaint} strokeWidth={1.4} />
        <line x1={40} y1={H / 2 - 74} x2={40 + curveW} y2={H / 2 - 74} stroke={C.panelLine} strokeWidth={1} />
        <line x1={40 + curveW / 2} y1={H / 2 - 136} x2={40 + curveW / 2} y2={H / 2 - 12} stroke={C.panelLine} strokeWidth={1} />
        {(() => {
          const px = 40 + ((0.5 + 3) / 6) * curveW;
          const py = H / 2 - 74 - 0.4621 * 62;
          return (
            <g>
              <line x1={40 + ((0 + 3) / 6) * curveW} y1={py} x2={px} y2={py} stroke={C.coral} strokeWidth={1} strokeDasharray="4 3" />
              <line x1={px} y1={H / 2 - 74} x2={px} y2={py} stroke={C.coral} strokeWidth={1} strokeDasharray="4 3" />
              <circle cx={px} cy={py} r={4} fill={C.coral} />
              <text x={px + 8} y={py - 8} fill={C.coral} fontFamily={FONT.mono} fontSize={FT.micro}>tanh 0.5 = 0.4621</text>
            </g>
          );
        })()}
        <text x={0} y={H / 2 - 74 - 84} fill={C.inkFaint} fontFamily={FONT.mono} fontSize={FT.micro}>1</text>
        <text x={0} y={H / 2 - 74 + 8} fill={C.inkFaint} fontFamily={FONT.mono} fontSize={FT.micro}>0</text>
        <text x={0} y={H / 2 - 74 + 60} fill={C.inkFaint} fontFamily={FONT.mono} fontSize={FT.micro}>−1</text>
        {chain.map((v, i) => {
          const bh = 150 * (v / 0.5);
          const x = 520 + i * (bw + 54);
          return (
            <g key={i}>
              <rect x={x} y={200 - bh} width={bw} height={bh} rx={4} fill="rgba(251,113,133,0.18)" stroke={C.coral} strokeWidth={1.3} />
              <text x={x + bw / 2} y={200 - bh - 10} textAnchor="middle" fill={C.coral} fontFamily={FONT.mono} fontSize={FT.meta}>{fmt4(v)}</text>
              <text x={x + bw / 2} y={222} textAnchor="middle" fill={C.inkFaint} fontFamily={FONT.mono} fontSize={FT.micro}>{"t=" + (i + 1)}</text>
            </g>
          );
        })}
        <text x={520} y={250} fill={C.inkDim} fontFamily={FONT.sans} fontSize={FT.micro}>{"三步掉一半多；五百步之后第一步的信息基本没了。"}</text>
      </svg>
    </div>
  );
};

/** 时间平均池化 → 线性 → softmax → 交叉熵。 */
export const HeadPoolFig: React.FC<{ width?: number; at?: number }> = ({ width = 1000, at = 0 }) => {
  const f = useCurrentFrame();
  const p = at > 0 ? pct(f, at, at + 20) : 1;
  const n = 60;
  const x0 = 30;
  const step = 3.2;
  return (
    <div style={{ width, opacity: p }}>
      <svg width={width} height={230} style={{ display: "block" }}>
        <text x={x0} y={16} fill={C.inkFaint} fontFamily={FONT.mono} fontSize={FT.micro}>{"隐状态 h_1 … h_T"}</text>
        {Array.from({ length: n }).map((_, i) => (
          <line key={i} x1={x0 + i * step} y1={30} x2={x0 + i * step} y2={92} stroke={C.cyan} strokeWidth={1.4} opacity={0.55} />
        ))}
        <line x1={x0} y1={100} x2={x0 + n * step} y2={100} stroke={C.panelLine} />
        <text x={x0} y={124} fill={C.cyan} fontFamily={FONT.mono} fontSize={FT.micro}>{"平均池化 → 一个 4 维向量"}</text>
        <line x1={x0 + n * step + 10} y1={62} x2={x0 + n * step + 70} y2={62} stroke={C.inkFaint} strokeWidth={1.3} />
        {Array.from({ length: 4 }).map((_, i) => (
          <rect key={"h" + i} x={x0 + n * step + 76 + i * 26} y={46} width={20} height={32} rx={3} fill="rgba(94,234,212,0.2)" stroke={C.cyan} strokeWidth={1.2} />
        ))}
        <text x={x0 + n * step + 76} y={96} fill={C.inkFaint} fontFamily={FONT.mono} fontSize={FT.micro}>hbar</text>
        <line x1={x0 + n * step + 190} y1={62} x2={x0 + n * step + 240} y2={62} stroke={C.inkFaint} strokeWidth={1.3} />
        <text x={x0 + n * step + 246} y={56} fill={C.violet} fontFamily={FONT.mono} fontSize={FT.micro}>线性 3H+3</text>
        <text x={x0 + n * step + 246} y={78} fill={C.inkFaint} fontFamily={FONT.mono} fontSize={FT.micro}>3 个分数</text>
        <line x1={x0 + n * step + 400} y1={62} x2={x0 + n * step + 450} y2={62} stroke={C.inkFaint} strokeWidth={1.3} />
        <text x={x0 + n * step + 456} y={56} fill={C.amber} fontFamily={FONT.mono} fontSize={FT.micro}>softmax</text>
        <text x={x0 + n * step + 456} y={78} fill={C.inkFaint} fontFamily={FONT.mono} fontSize={FT.micro}>交叉熵</text>
        <text x={0} y={170} fill={C.inkDim} fontFamily={FONT.sans} fontSize={FT.meta}>{"三个类均匀猜，损失是 log 3 = " + fmt4(M.rnn.lossChance) + "；这是训练的起点，也是随机水平的参照。"}</text>
        <text x={0} y={204} fill={C.coral} fontFamily={FONT.mono} fontSize={FT.meta}>{"训练 30 轮：" + fmt4(M.rnn.lossStart) + " → " + fmt4(M.rnn.lossEnd)}</text>
      </svg>
    </div>
  );
};

/** 感受野逐层累加：3 / 7 / 15 / 31 / 63。 */
export const RfFig: React.FC<{ width?: number; at?: number }> = ({ width = 1000, at = 0 }) => {
  const f = useCurrentFrame();
  const p = at > 0 ? pct(f, at, at + 22) : 1;
  const bars = M.dil.rf;
  const maxW = 700;
  const bw = 46;
  return (
    <div style={{ width, opacity: p }}>
      <svg width={width} height={286} style={{ display: "block" }}>
        {bars.map((v, i) => {
          const w = (v / M.dil.rf63) * maxW;
          const y = 26 + i * 40;
          return (
            <g key={i}>
              <text x={96} y={y + 26} textAnchor="end" fill={C.inkFaint} fontFamily={FONT.mono} fontSize={FT.micro}>{"d=" + M.dil.ds[i]}</text>
              <rect x={110} y={y} width={Math.max(4, w)} height={30} rx={4}
                fill={i >= 3 ? "rgba(251,113,133,0.2)" : "rgba(94,234,212,0.16)"} stroke={i >= 3 ? C.coral : C.cyan} strokeWidth={1.3} />
              <text x={110 + Math.max(4, w) + 10} y={y + 21} fill={i >= 3 ? C.coral : C.cyan} fontFamily={FONT.mono} fontSize={FT.meta}>{v}</text>
            </g>
          );
        })}
        <text x={0} y={252} fill={C.inkDim} fontFamily={FONT.sans} fontSize={FT.meta}>
          {"四层 d=1/2/4/8 感受野 " + M.dil.rf31 + "；再加一层 d=16 到 " + M.dil.rf63 + "。总宽 31 是窗口两端的跨度。"}
        </text>
      </svg>
    </div>
  );
};

/** 长窗口准确率：50 / 250 / 500 全贴随机线。 */
export const LongAccFig: React.FC<{ width?: number; at?: number }> = ({ width = 980, at = 0 }) => {
  const f = useCurrentFrame();
  const p = at > 0 ? pct(f, at, at + 20) : 1;
  const rows = M.long;
  const maxW = 520;
  const scale = (v: number) => (v / 0.6) * maxW;
  return (
    <div style={{ width, opacity: p }}>
      <svg width={width} height={250} style={{ display: "block" }}>
        <line x1={140 + scale(M.models.chance)} y1={14} x2={140 + scale(M.models.chance)} y2={188} stroke={C.coral} strokeWidth={1.2} strokeDasharray="4 4" />
        <text x={140 + scale(M.models.chance) + 8} y={24} fill={C.coral} fontFamily={FONT.mono} fontSize={FT.micro}>{"随机 " + fmt4(M.models.chance)}</text>
        {rows.map((r, i) => {
          const y = 34 + i * 52;
          return (
            <g key={r.T}>
              <text x={130} y={y + 26} textAnchor="end" fill={C.inkFaint} fontFamily={FONT.mono} fontSize={FT.micro}>{"T=" + r.T}</text>
              <rect x={140} y={y} width={scale(r.trainAcc)} height={16} rx={3} fill="rgba(167,139,250,0.28)" stroke={C.violet} strokeWidth={0.8} />
              <rect x={140} y={y + 20} width={scale(r.testAcc)} height={16} rx={3} fill="rgba(94,234,212,0.3)" stroke={C.cyan} strokeWidth={1} />
              <text x={140 + scale(r.testAcc) + 8} y={y + 33} fill={C.cyan} fontFamily={FONT.mono} fontSize={FT.micro}>{fmt4(r.testAcc)}</text>
              <text x={140 + scale(r.trainAcc) + 8} y={y + 13} fill={C.violet} fontFamily={FONT.mono} fontSize={FT.micro}>{fmt4(r.trainAcc)}</text>
            </g>
          );
        })}
        <text x={0} y={222} fill={C.inkDim} fontFamily={FONT.sans} fontSize={FT.meta}>{"窗口拉长十倍，测试准确率没动；训练集也只在 0.45 上下。"}</text>
        <text x={0} y={246} fill={C.inkFaint} fontFamily={FONT.mono} fontSize={FT.micro}>{"紫 = 训练，青 = 测试"}</text>
      </svg>
    </div>
  );
};

/** 数据口径：500 只 × 2,674 天，滑出 4,392 个窗口，三类各三分之一。 */
export const DataSplitFig: React.FC<{ width?: number; at?: number }> = ({ width = 1000, at = 0 }) => {
  const f = useCurrentFrame();
  const p = at > 0 ? pct(f, at, at + 22) : 1;
  const w = 620;
  const h = 132;
  const winW = (M.data.window / M.data.rows) * w;
  const cls = M.data.classes;
  const total = cls.reduce((a, b) => a + b, 0);
  const colors = [C.coral, C.inkDim, C.cyan];
  const names = ["下三分位", "中三分位", "上三分位"];
  return (
    <div style={{ width, opacity: p }}>
      <svg width={width} height={300} style={{ display: "block" }}>
        <text x={0} y={16} fill={C.inkFaint} fontFamily={FONT.mono} fontSize={FT.micro}>{M.data.firstDate + " → " + M.data.lastDate + "，500 列（每列一只股票）"}</text>
        <rect x={0} y={28} width={w} height={h} fill="rgba(34,48,63,0.5)" stroke={C.panelLine} />
        {Array.from({ length: 7 }).map((_, i) => (
          <rect key={i} x={(i * w) / 7} y={28} width={w / 7 - 2} height={h} fill={i % 2 ? "rgba(94,234,212,0.05)" : "rgba(94,234,212,0.02)"} />
        ))}
        {[0, 1, 2].map((k) => (
          <rect key={"win" + k} x={((k * M.data.window) / M.data.rows) * w} y={28 + k * 22} width={winW} height={20} rx={2} fill="none" stroke={C.cyan} strokeWidth={1.3} />
        ))}
        <text x={0} y={182} fill={C.cyan} fontFamily={FONT.mono} fontSize={FT.micro}>{"T = " + M.data.window + " 步，步长 " + M.data.stride + "；每只 " + M.data.perStock[0] + "–" + M.data.perStock[1] + " 个窗口"}</text>
        <text x={0} y={206} fill={C.inkDim} fontFamily={FONT.sans} fontSize={FT.meta}>{"一共 " + fmtInt(M.data.windows) + " 个窗口；按股票切分，" + M.data.trainStocks + " 只训练、" + M.data.testStocks + " 只测试。"}</text>
        {cls.map((v, i) => {
          const bw = (v / total) * 620;
          const x = cls.slice(0, i).reduce((a, b) => a + (b / total) * 620, 0);
          return (
            <g key={i}>
              <rect x={x} y={232} width={bw - 2} height={24} fill={colors[i]} opacity={0.75} />
              <text x={x + bw / 2 - 1} y={250} textAnchor="middle" fill={C.bg} fontFamily={FONT.mono} fontSize={FT.micro}>{fmtInt(v)}</text>
            </g>
          );
        })}
        <text x={0} y={286} fill={C.inkDim} fontFamily={FONT.sans} fontSize={FT.micro}>
          {"标签是末 60 天收益的三分位（下界 " + fmt4(M.data.tercileLo) + "、上界 " + fmt4(M.data.tercileHi) + "），三类各占三分之一。"}
        </text>
      </svg>
    </div>
  );
};
export const fmtInt = (v: number): string => Math.round(v).toLocaleString("en-US");

/** 损失：1.0744 → 1.0362，随机线 1.0986。 */
export const LossFig: React.FC<{ width?: number; at?: number }> = ({ width = 960, at = 0 }) => {
  const f = useCurrentFrame();
  const p = at > 0 ? pct(f, at, at + 20) : 1;
  const W = 460;
  const H = 150;
  const lo = 1.0;
  const hi = 1.12;
  const y = (v: number) => H - ((v - lo) / (hi - lo)) * H;
  const xs = [50, 50 + W];
  return (
    <div style={{ width, opacity: p }}>
      <svg width={width} height={250} style={{ display: "block" }}>
        <line x1={50} y1={y(M.rnn.lossChance)} x2={50 + W} y2={y(M.rnn.lossChance)} stroke={C.coral} strokeWidth={1.2} strokeDasharray="5 4" />
        <text x={50 + W + 8} y={y(M.rnn.lossChance) + 5} fill={C.coral} fontFamily={FONT.mono} fontSize={FT.micro}>{"log 3 = " + fmt4(M.rnn.lossChance)}</text>
        <line x1={50} y1={y(M.rnn.lossStart)} x2={50 + W} y2={y(M.rnn.lossEnd)} stroke={C.cyan} strokeWidth={2} />
        <circle cx={50} cy={y(M.rnn.lossStart)} r={4.5} fill={C.cyan} />
        <circle cx={50 + W} cy={y(M.rnn.lossEnd)} r={4.5} fill={C.cyan} />
        <text x={50} y={y(M.rnn.lossStart) - 12} textAnchor="middle" fill={C.cyan} fontFamily={FONT.mono} fontSize={FT.meta}>{fmt4(M.rnn.lossStart)}</text>
        <text x={50 + W} y={y(M.rnn.lossEnd) - 12} textAnchor="middle" fill={C.cyan} fontFamily={FONT.mono} fontSize={FT.meta}>{fmt4(M.rnn.lossEnd)}</text>
        <text x={50} y={H + 24} textAnchor="middle" fill={C.inkFaint} fontFamily={FONT.mono} fontSize={FT.micro}>第 1 轮</text>
        <text x={50 + W} y={H + 24} textAnchor="middle" fill={C.inkFaint} fontFamily={FONT.mono} fontSize={FT.micro}>第 30 轮</text>
        <text x={0} y={H + 66} fill={C.inkDim} fontFamily={FONT.sans} fontSize={FT.meta}>
          {"30 轮只降了 " + fmt4(M.rnn.lossStart - M.rnn.lossEnd) + "，比随机线低 " + fmt4(M.rnn.lossChance - M.rnn.lossEnd) + "；曲线是平的。"}
        </text>
        <text x={0} y={H + 96} fill={C.inkFaint} fontFamily={FONT.sans} fontSize={FT.micro}>{"图上两点是实测首末，中间没有逐轮记录——只画趋势。"}</text>
      </svg>
    </div>
  );
};

/** 合成任务：周期 8/12/20 的正弦，准确率 1.0。 */
export const SynthFig: React.FC<{ width?: number; at?: number }> = ({ width = 1000, at = 0 }) => {
  const f = useCurrentFrame();
  const p = at > 0 ? pct(f, at, at + 20) : 1;
  const arr = M.series.sine8;
  const W = 640;
  const H = 96;
  const path = (vals: number[], amp: number) =>
    vals.map((v, i) => (i ? "L" : "M") + " " + fmt2((i / (vals.length - 1)) * W, 1) + " " + fmt2(H / 2 - v * amp, 1)).join(" ");
  const diffs = M.series.diff8;
  return (
    <div style={{ width, opacity: p }}>
      <svg width={width} height={314} style={{ display: "block" }}>
        <text x={0} y={16} fill={C.inkFaint} fontFamily={FONT.mono} fontSize={FT.micro}>{"周期 8 的正弦（t = " + M.synthetic.len + "）"}</text>
        <line x1={0} y1={40} x2={W} y2={40} stroke={C.panelLine} />
        <g transform="translate(0 40)">
          <path d={path(arr, 34)} fill="none" stroke={C.cyan} strokeWidth={1.8} />
        </g>
        <text x={0} y={172} fill={C.inkFaint} fontFamily={FONT.mono} fontSize={FT.micro}>{"隔 8 差分：完全抵消"}</text>
        <line x1={0} y1={196} x2={W} y2={196} stroke={C.panelLine} />
        <g transform="translate(0 196)">
          <path d={path(diffs, 34)} fill="none" stroke={C.coral} strokeWidth={1.8} />
        </g>
        <text x={W + 20} y={40 + 34} fill={C.cyan} fontFamily={FONT.mono} fontSize={FT.micro}>{"周期 8"}</text>
        <text x={W + 20} y={202} fill={C.coral} fontFamily={FONT.mono} fontSize={FT.micro}>{M.dil.periodCancel.toExponential(1) + " ≈ 0"}</text>
        <text x={0} y={268} fill={C.inkDim} fontFamily={FONT.sans} fontSize={FT.meta}>
          {"三类周期 " + M.synthetic.periods.join(" / ") + "，加 " + M.synthetic.noise * 100 + "% 噪声，隐状态 " + M.synthetic.hidden + "，40 轮。"}
        </text>
        <text x={0} y={300} fill={C.cyan} fontFamily={FONT.mono} fontSize={FT.meta}>
          {"训练 " + fmt2(M.synthetic.trainAcc, 1) + " · 测试 " + fmt2(M.synthetic.testAcc, 1) + " · " + M.synthetic.seconds + " s —— 同一个 RNN 学得会。"}
        </text>
      </svg>
    </div>
  );
};

/** 墙钟：结构比 8.3 倍，实测比 1 附近。 */
export const WallFig: React.FC<{ width?: number; at?: number }> = ({ width = 960, at = 0 }) => {
  const f = useCurrentFrame();
  const p = f > 0 ? pct(f, at, at + 20) : 1;
  const maxW = 480;
  const bars = [
    { label: "结构深度比", value: M.brick.depthRatio, note: "500 : 60", color: C.cyan },
    { label: "墙钟比", value: M.brick.wallRatio, note: "并行 / 串行", color: C.coral },
  ];
  const scale = (v: number) => (v / 9) * maxW;
  return (
    <div style={{ width, opacity: p }}>
      <svg width={width} height={230} style={{ display: "block" }}>
        <line x1={180 + scale(1)} y1={16} x2={180 + scale(1)} y2={158} stroke={C.inkFaint} strokeWidth={1} strokeDasharray="4 4" />
        <text x={180 + scale(1) + 8} y={14} fill={C.inkFaint} fontFamily={FONT.mono} fontSize={FT.micro}>1.0 没变快</text>
        {bars.map((b, i) => {
          const y = 26 + i * 46;
          return (
            <g key={b.label}>
              <text x={172} y={y + 24} textAnchor="end" fill={C.inkFaint} fontFamily={FONT.mono} fontSize={FT.micro}>{b.label}</text>
              <rect x={180} y={y} width={Math.max(4, scale(b.value))} height={28} rx={4} fill={b.color + "33"} stroke={b.color} strokeWidth={1.3} />
              <text x={180 + Math.max(4, scale(b.value)) + 10} y={y + 20} fill={b.color} fontFamily={FONT.mono} fontSize={FT.meta}>{fmt2(b.value, b.value > 2 ? 2 : 4)}</text>
              <text x={width} y={y + 20} textAnchor="end" fill={C.inkFaint} fontFamily={FONT.sans} fontSize={FT.micro}>{b.note}</text>
            </g>
          );
        })}
        <text x={0} y={192} fill={C.inkDim} fontFamily={FONT.sans} fontSize={FT.meta}>{"单线程、60 个 500 步窗口，一次前向：并行反而更慢——F# Runtime 没有多核调度。"}</text>
        <text x={0} y={220} fill={C.inkFaint} fontFamily={FONT.sans} fontSize={FT.micro}>{"所以「快六倍」只能写成「结构上能并行」，数字给不出来。"}</text>
      </svg>
    </div>
  );
};

/** 参数：15 对 63，四分之一。 */
export const ParamFig: React.FC<{ width?: number; at?: number }> = ({ width = 940, at = 0 }) => {
  const f = useCurrentFrame();
  const p = at > 0 ? pct(f, at, at + 18) : 1;
  const maxW = 420;
  const sc = (v: number) => (v / 70) * maxW;
  const rows = [
    { label: "空洞五层 k=3", v: M.dil.stackParams, color: C.cyan },
    { label: "同感受野普通卷积", v: M.dil.plainParams, color: C.inkDim },
  ];
  return (
    <div style={{ width, opacity: p }}>
      <svg width={width} height={210} style={{ display: "block" }}>
        {rows.map((r, i) => {
          const y = 34 + i * 62;
          return (
            <g key={r.label}>
              <text x={168} y={y + 26} textAnchor="end" fill={C.inkFaint} fontFamily={FONT.mono} fontSize={FT.micro}>{r.label}</text>
              <rect x={176} y={y} width={Math.max(4, sc(r.v))} height={34} rx={5} fill={r.color + "2e"} stroke={r.color} strokeWidth={1.4} />
              <text x={176 + Math.max(4, sc(r.v)) + 12} y={y + 24} fill={r.color} fontFamily={FONT.mono} fontSize={FT.lead}>{r.v}</text>
            </g>
          );
        })}
        <text x={0} y={182} fill={C.coral} fontFamily={FONT.mono} fontSize={FT.meta}>{"15 / 63 = " + fmt4(M.dil.paramRatio) + " ≈ 四分之一（书里写五分之一）"}</text>
        <text x={0} y={206} fill={C.inkDim} fontFamily={FONT.sans} fontSize={FT.micro}>{"参数只由核长定：五层 × 核长三 = 15，和窗口长度、感受野都无关。"}</text>
      </svg>
    </div>
  );
};

/** 切块保序：T=12、k=4 → 三块，拼回逐项相等。 */
export const BlockOrderFig: React.FC<{ width?: number; at?: number }> = ({ width = 960, at = 0 }) => {
  const f = useCurrentFrame();
  const p = at > 0 ? pct(f, at, at + 18) : 1;
  const cw = 46;
  const gap = 6;
  const left = 150;
  const vals = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  return (
    <div style={{ width, opacity: p }}>
      <svg width={width} height={230} style={{ display: "block" }}>
        <text x={left - 16} y={40} textAnchor="end" fill={C.inkFaint} fontFamily={FONT.mono} fontSize={FT.micro}>T=12</text>
        {vals.map((v, i) => (
          <rect key={i} x={left + i * (cw + gap)} y={24} width={cw} height={38} rx={4} fill={C.panel} stroke={C.panelLine} />
        ))}
        {[0, 1, 2].map((b) => (
          <g key={"blk" + b}>
            <rect x={left + b * 4 * (cw + gap) - 3} y={16} width={4 * (cw + gap) - gap + 6} height={54} rx={6} fill="none" stroke={C.cyan} strokeWidth={1.4} />
            <text x={left + b * 4 * (cw + gap) + 2 * (cw + gap)} y={12} textAnchor="middle" fill={C.cyan} fontFamily={FONT.mono} fontSize={FT.micro}>{"块 " + (b + 1)}</text>
          </g>
        ))}
        <text x={left - 16} y={112} textAnchor="end" fill={C.inkFaint} fontFamily={FONT.mono} fontSize={FT.micro}>拼回</text>
        {vals.map((v, i) => (
          <rect key={"c" + i} x={left + i * (cw + gap)} y={96} width={cw} height={38} rx={4} fill="rgba(94,234,212,0.14)" stroke={C.cyan} strokeWidth={1.1} />
        ))}
        <text x={0} y={182} fill={C.inkDim} fontFamily={FONT.sans} fontSize={FT.meta}>{"十二步切成三块，每块四步；拼回去逐项相等，一个点都不丢。"}</text>
        <text x={0} y={212} fill={C.coral} fontFamily={FONT.mono} fontSize={FT.micro}>{"T=500、k=50 → 10 块，每块 50 步；第二层只吃 10 个块末状态。"}</text>
      </svg>
    </div>
  );
};

/** 空洞黄金值：核 [1,1] 对 [1..5] → [4,6,8]；d=1 退化成普通卷积。 */
export const DilGoldenFig: React.FC<{ width?: number; at?: number }> = ({ width = 960, at = 0 }) => {
  const f = useCurrentFrame();
  const p = at > 0 ? pct(f, at, at + 18) : 1;
  const cw = 62;
  const gap = 10;
  const left = 120;
  const inp = [1, 2, 3, 4, 5];
  const out = M.dil.golden;
  return (
    <div style={{ width, opacity: p }}>
      <svg width={width} height={280} style={{ display: "block" }}>
        <text x={left - 20} y={38} textAnchor="end" fill={C.inkFaint} fontFamily={FONT.mono} fontSize={FT.micro}>输入</text>
        {inp.map((v, i) => (
          <g key={i}>
            <rect x={left + i * (cw + gap)} y={20} width={cw} height={44} rx={5} fill={C.panel} stroke={i === 0 || i === 2 || i === 4 ? C.cyan : C.panelLine} strokeWidth={i === 0 || i === 2 || i === 4 ? 1.8 : 1} />
            <text x={left + i * (cw + gap) + cw / 2} y={49} textAnchor="middle" fill={C.ink} fontFamily={FONT.mono} fontSize={FT.lead}>{v}</text>
            <text x={left + i * (cw + gap) + cw / 2} y={82} textAnchor="middle" fill={C.inkFaint} fontFamily={FONT.mono} fontSize={FT.micro}>{i}</text>
          </g>
        ))}
        <text x={left - 20} y={136} textAnchor="end" fill={C.inkFaint} fontFamily={FONT.mono} fontSize={FT.micro}>d=2 核 [1,1]</text>
        {[0, 2, 4].map((i, k) => (
          <rect key={k} x={left + i * (cw + gap)} y={118} width={cw} height={30} rx={4} fill="rgba(251,113,133,0.16)" stroke={C.coral} strokeWidth={1.2} />
        ))}
        <text x={left - 20} y={222} textAnchor="end" fill={C.inkFaint} fontFamily={FONT.mono} fontSize={FT.micro}>输出</text>
        {out.map((v, i) => (
          <g key={"o" + i}>
            <rect x={left + i * (cw + gap)} y={204} width={cw} height={40} rx={4} fill="rgba(94,234,212,0.2)" stroke={C.cyan} strokeWidth={1.6} />
            <text x={left + i * (cw + gap) + cw / 2} y={231} textAnchor="middle" fill={C.cyan} fontFamily={FONT.mono} fontSize={FT.lead}>{v}</text>
            <text x={left + i * (cw + gap) + cw / 2} y={262} textAnchor="middle" fill={C.inkFaint} fontFamily={FONT.mono} fontSize={FT.micro}>{"1+" + inp[i] + "+" + inp[i + 2]}</text>
          </g>
        ))}
        <text x={left + 3 * (cw + gap) + 30} y={136} fill={C.coral} fontFamily={FONT.mono} fontSize={FT.micro}>{"d=2：跳中间那个点"}</text>
        <text x={0} y={278} fill={C.inkDim} fontFamily={FONT.sans} fontSize={FT.micro}>{"退化检查：d=1、核 [1,0,−1] 对 [1,2,3,4] → [−2,−2]，和普通卷积一模一样。"}</text>
      </svg>
    </div>
  );
};

/** 抽样：120 训练 / 60 测试，一个种子一次切分。 */
export const SampleFig: React.FC<{ width?: number; at?: number }> = ({ width = 900, at = 0 }) => {
  const f = useCurrentFrame();
  const p = at > 0 ? pct(f, at, at + 18) : 1;
  const tw = 120;
  const tew = 60;
  const unit = 4.2;
  return (
    <div style={{ width, opacity: p }}>
      <svg width={width} height={210} style={{ display: "block" }}>
        <text x={0} y={26} fill={C.inkFaint} fontFamily={FONT.mono} fontSize={FT.micro}>{"全部窗口 " + fmtInt(M.data.windows) + "（每只 8–9 个）"}</text>
        <rect x={0} y={40} width={width - 20} height={16} rx={4} fill="rgba(154,167,182,0.18)" stroke={C.panelLine} />
        <text x={0} y={96} fill={C.inkFaint} fontFamily={FONT.mono} fontSize={FT.micro}>{"实际用于训练的抽样"}</text>
        <rect x={0} y={110} width={tw * unit} height={22} rx={4} fill="rgba(94,234,212,0.24)" stroke={C.cyan} strokeWidth={1.2} />
        <text x={tw * unit / 2} y={126} textAnchor="middle" fill={C.cyan} fontFamily={FONT.mono} fontSize={FT.micro}>{"训练 " + tw}</text>
        <rect x={tw * unit + 12} y={110} width={tew * unit} height={22} rx={4} fill="rgba(251,113,133,0.2)" stroke={C.coral} strokeWidth={1.2} />
        <text x={tw * unit + 12 + tew * unit / 2} y={126} textAnchor="middle" fill={C.coral} fontFamily={FONT.mono} fontSize={FT.micro}>{"测试 " + tew}</text>
        <text x={0} y={170} fill={C.inkDim} fontFamily={FONT.sans} fontSize={FT.meta}>{"单线程跑不动全量；只抽了 " + (tw + tew) + " 个窗口，种子固定 " + M.rnn.seed + "。"}</text>
        <text x={0} y={200} fill={C.coral} fontFamily={FONT.sans} fontSize={FT.meta}>{"没有多次初始化、没有交叉验证：差三个百分点以内，当噪声看。"}</text>
      </svg>
    </div>
  );
};

/** 下一集：三十只股票的相关性图。 */
export const GraphTeaserFig: React.FC<{ width?: number; at?: number }> = ({ width = 940, at = 0 }) => {
  const f = useCurrentFrame();
  const p = at > 0 ? pct(f, at, at + 24) : 1;
  const n = 30;
  const R = 150;
  const cx = 300;
  const cy = 150;
  const nodes = Array.from({ length: n }).map((_, i) => {
    const a = (i / n) * Math.PI * 2 - Math.PI / 2;
    const rr = R * (0.45 + 0.55 * ((i * 37) % 100) / 100);
    return [cx + Math.cos(a) * rr, cy + Math.sin(a) * rr] as const;
  });
  return (
    <div style={{ width, opacity: p }}>
      <svg width={width} height={300} style={{ display: "block" }}>
        {nodes.map((a, i) =>
          nodes.slice(i + 1).filter((_, j) => (i * 7 + j * 3) % 11 === 0).map((b, j) => (
            <line key={i + "-" + j} x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} stroke={C.cyan} strokeWidth={0.7} opacity={0.35} />
          )),
        )}
        {nodes.map((q, i) => (
          <circle key={i} cx={q[0]} cy={q[1]} r={5} fill={i % 3 === 0 ? C.cyan : C.panelLine} stroke={C.cyan} strokeWidth={1} />
        ))}
        <text x={0} y={20} fill={C.inkFaint} fontFamily={FONT.mono} fontSize={FT.micro}>{"30 只股票 · 相关性图"}</text>
        <text x={0} y={288} fill={C.inkDim} fontFamily={FONT.sans} fontSize={FT.meta}>{"图卷积、图注意力、自注意力；把图打乱，准确率该掉回无图水平。"}</text>
      </svg>
    </div>
  );
};

export { Card, fmt2 };
