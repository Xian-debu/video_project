import React from "react";
import { useCurrentFrame } from "remotion";
import { C, FONT, FT } from "../design/tokens";
import { M, pct, fmt4, fmt2, Card } from "./shared";

/* ---------------------------------------------------------------- 卷积示意 */

/** 一维卷积：输入四个点，核 [1,0,−1] 滑两次，输出 [−2,−2]。 */
export const ConvKernelFig: React.FC<{ width?: number; at?: number }> = ({ width = 960, at = 0 }) => {
  const f = useCurrentFrame();
  const p = at > 0 ? pct(f, at, at + 20) : 1;
  const cw = 92;
  const gap = 10;
  const left = 210;
  const xin = (i: number) => left + i * (cw + gap);
  const kin = M.conv.kernel;
  const inp = M.conv.input;
  const out = M.conv.golden;
  return (
    <div style={{ width, opacity: p }}>
      <svg width={width} height={300} style={{ display: "block" }}>
        <text x={left - 24} y={54} textAnchor="end" fill={C.inkFaint} fontFamily={FONT.mono} fontSize={FT.micro}>输入 x</text>
        {inp.map((v, i) => (
          <g key={"i" + i}>
            <rect x={xin(i)} y={34} width={cw} height={52} rx={6} fill={C.panel} stroke={i < 3 ? C.cyan : C.panelLine} strokeWidth={i < 3 ? 2 : 1} />
            <text x={xin(i) + cw / 2} y={68} textAnchor="middle" fill={C.ink} fontFamily={FONT.mono} fontSize={FT.lead}>{v.toFixed(0)}</text>
            <text x={xin(i) + cw / 2} y={110} textAnchor="middle" fill={C.inkFaint} fontFamily={FONT.mono} fontSize={FT.micro}>x{i}</text>
          </g>
        ))}
        <text x={left - 24} y={166} textAnchor="end" fill={C.inkFaint} fontFamily={FONT.mono} fontSize={FT.micro}>核 w</text>
        {kin.map((v, i) => (
          <g key={"k" + i}>
            <rect x={xin(i) + 16} y={146} width={cw - 32} height={40} rx={5} fill={v === 0 ? C.panel : "rgba(251,113,133,0.18)"} stroke={C.coral} strokeWidth={1.4} />
            <text x={xin(i) + 16 + (cw - 32) / 2} y={172} textAnchor="middle" fill={C.coral} fontFamily={FONT.mono} fontSize={FT.meta}>{v.toFixed(0)}</text>
          </g>
        ))}
        <path d={`M ${left} 206 L ${left + 3 * (cw + gap) - gap} 206`} stroke={C.inkFaint} strokeWidth={1.2} />
        <text x={left + (3 * (cw + gap) - gap) / 2} y={228} textAnchor="middle" fill={C.inkFaint} fontFamily={FONT.mono} fontSize={FT.micro}>第一个窗口：1×1 + 2×0 + 3×(−1) = −2</text>
        <text x={left - 24} y={276} textAnchor="end" fill={C.inkFaint} fontFamily={FONT.mono} fontSize={FT.micro}>输出 y</text>
        {out.map((v, i) => (
          <g key={"o" + i}>
            <rect x={xin(i)} y={252} width={cw} height={40} rx={5} fill="rgba(94,234,212,0.16)" stroke={C.cyan} strokeWidth={1.6} />
            <text x={xin(i) + cw / 2} y={278} textAnchor="middle" fill={C.cyan} fontFamily={FONT.mono} fontSize={FT.lead}>{v.toFixed(0)}</text>
          </g>
        ))}
        <text x={xin(2) + 10} y={278} fill={C.inkFaint} fontFamily={FONT.mono} fontSize={FT.micro}>核再滑一格：2 − 4 = −2</text>
      </svg>
    </div>
  );
};

/** 维度账：60 → 53 → 26 → 19 → 9，×32 通道 = 288。 */
export const DimChainFig: React.FC<{ width?: number; at?: number }> = ({ width = 1000, at = 0 }) => {
  const f = useCurrentFrame();
  const p = at > 0 ? pct(f, at, at + 18) : 1;
  const dims = M.conv.dims;
  const labels = ["输入", "卷积 k=8", "池化 2", "卷积 k=8", "池化 2"];
  const bw = 118;
  const gap = (width - dims.length * bw) / (dims.length - 1);
  return (
    <div style={{ width, opacity: p }}>
      <svg width={width} height={210} style={{ display: "block" }}>
        {dims.map((d, i) => {
          const x = i * (bw + gap);
          const last = i === dims.length - 1;
          return (
            <g key={i}>
              <rect x={x} y={54} width={bw} height={64} rx={8} fill={last ? "rgba(251,113,133,0.16)" : C.panel} stroke={last ? C.coral : C.panelLine} strokeWidth={last ? 2 : 1} />
              <text x={x + bw / 2} y={96} textAnchor="middle" fill={last ? C.coral : C.ink} fontFamily={FONT.mono} fontSize={FT.h2}>{d}</text>
              <text x={x + bw / 2} y={42} textAnchor="middle" fill={C.inkFaint} fontFamily={FONT.mono} fontSize={FT.micro}>{labels[i]}</text>
              {i < dims.length - 1 ? (
                <g>
                  <line x1={x + bw + 6} y1={86} x2={x + bw + gap - 6} y2={86} stroke={C.inkFaint} strokeWidth={1.4} />
                  <path d={`M ${x + bw + gap - 12} 81 L ${x + bw + gap - 5} 86 L ${x + bw + gap - 12} 91`} fill="none" stroke={C.inkFaint} strokeWidth={1.4} />
                </g>
              ) : null}
            </g>
          );
        })}
        <text x={0} y={164} fill={C.inkDim} fontFamily={FONT.sans} fontSize={FT.meta}>{"九个位置 × 32 个通道 = 288 个特征；从 300 个数到 288 个特征，数目差不多，含义完全不同。"}</text>
        <text x={0} y={196} fill={C.coral} fontFamily={FONT.mono} fontSize={FT.meta}>{"9 × 32 = 288"}</text>
      </svg>
    </div>
  );
};

/** 池化：窗口内取最大，记下 argmax。 */
export const PoolFig: React.FC<{ width?: number; at?: number }> = ({ width = 820, at = 0 }) => {
  const f = useCurrentFrame();
  const p = at > 0 ? pct(f, at, at + 18) : 1;
  const cw = 78;
  const gap = 8;
  const left = 150;
  const cell = (v: number, i: number, y: number, hi: boolean, tag: string) => (
    <g key={tag + i}>
      <rect x={left + i * (cw + gap)} y={y} width={cw} height={52} rx={6} fill={hi ? "rgba(94,234,212,0.18)" : C.panel} stroke={hi ? C.cyan : C.panelLine} strokeWidth={hi ? 1.8 : 1} />
      <text x={left + i * (cw + gap) + cw / 2} y={y + 34} textAnchor="middle" fill={hi ? C.cyan : C.inkDim} fontFamily={FONT.mono} fontSize={FT.lead}>{v}</text>
    </g>
  );
  return (
    <div style={{ width, opacity: p }}>
      <svg width={width} height={230} style={{ display: "block" }}>
        <text x={left - 18} y={62} textAnchor="end" fill={C.inkFaint} fontFamily={FONT.mono} fontSize={FT.micro}>窗口一</text>
        {M.conv.poolIn.map((v, i) => cell(v, i, 30, i === 1, "in"))}
        <path d={`M ${left} 100 L ${left + 2 * (cw + gap) - gap} 100`} stroke={C.cyan} strokeWidth={1.4} />
        <path d={`M ${left} 100 L ${left} 108 M ${left + 2 * (cw + gap) - gap} 100 L ${left + 2 * (cw + gap) - gap} 108`} stroke={C.cyan} strokeWidth={1.4} />
        <text x={left + 4 * (cw + gap) + 26} y={62} fill={C.cyan} fontFamily={FONT.mono} fontSize={FT.micro}>argmax 索引 1</text>
        <text x={left - 18} y={166} textAnchor="end" fill={C.inkFaint} fontFamily={FONT.mono} fontSize={FT.micro}>窗口二</text>
        {M.conv.poolIn.map((v, i) => (i >= 2 ? cell(v, i, 134, i === 3, "in2") : null))}
        <text x={left + 4 * (cw + gap) + 26} y={166} fill={C.cyan} fontFamily={FONT.mono} fontSize={FT.micro}>argmax 索引 3</text>
        <text x={left} y={210} fill={C.inkDim} fontFamily={FONT.sans} fontSize={FT.meta}>{"池化把长度减半；反传时梯度只回最大值那一格，其余是零。"}</text>
      </svg>
    </div>
  );
};

/** 残差块：x → F(x) → ⊕ → ReLU。 */
export const ResBlockFig: React.FC<{ width?: number; at?: number }> = ({ width = 940, at = 0 }) => {
  const f = useCurrentFrame();
  const p = at > 0 ? pct(f, at, at + 20) : 1;
  return (
    <div style={{ width, opacity: p }}>
      <svg width={width} height={220} style={{ display: "block" }}>
        <rect x={20} y={86} width={86} height={52} rx={8} fill={C.panel} stroke={C.panelLine} />
        <text x={63} y={118} textAnchor="middle" fill={C.ink} fontFamily={FONT.mono} fontSize={FT.body}>x</text>
        <line x1={106} y1={112} x2={168} y2={112} stroke={C.inkFaint} strokeWidth={1.4} />
        <rect x={168} y={40} width={188} height={62} rx={8} fill="rgba(94,234,212,0.10)" stroke={C.cyan} strokeWidth={1.6} />
        <text x={262} y={78} textAnchor="middle" fill={C.cyan} fontFamily={FONT.mono} fontSize={FT.meta}>conv + ReLU</text>
        <line x1={356} y1={71} x2={420} y2={71} stroke={C.inkFaint} strokeWidth={1.4} />
        <rect x={420} y={40} width={168} height={62} rx={8} fill="rgba(94,234,212,0.10)" stroke={C.cyan} strokeWidth={1.6} />
        <text x={504} y={78} textAnchor="middle" fill={C.cyan} fontFamily={FONT.mono} fontSize={FT.meta}>conv</text>
        <text x={504} y={26} fill={C.inkFaint} fontFamily={FONT.mono} fontSize={FT.micro}>F(x)</text>
        <line x1={588} y1={71} x2={640} y2={71} stroke={C.inkFaint} strokeWidth={1.4} />
        <line x1={640} y1={71} x2={640} y2={112} stroke={C.inkFaint} strokeWidth={1.4} />
        <circle cx={676} cy={112} r={20} fill={C.panel} stroke={C.amber} strokeWidth={1.8} />
        <text x={676} y={120} textAnchor="middle" fill={C.amber} fontFamily={FONT.mono} fontSize={FT.h2}>+</text>
        <path d={`M 106 112 L 200 112 L 200 186 L 656 186 L 656 112`} fill="none" stroke={C.amber} strokeWidth={1.6} strokeDasharray="6 5" />
        <text x={330} y={206} fill={C.amber} fontFamily={FONT.mono} fontSize={FT.micro}>恒等捷径（不可学时加 1×1 投影）</text>
        <line x1={696} y1={112} x2={760} y2={112} stroke={C.inkFaint} strokeWidth={1.4} />
        <rect x={760} y={86} width={132} height={52} rx={8} fill={C.panel} stroke={C.panelLine} />
        <text x={826} y={118} textAnchor="middle" fill={C.ink} fontFamily={FONT.mono} fontSize={FT.body}>ReLU</text>
      </svg>
    </div>
  );
};

/** GAP + 线性头 + CAM 回路。 */
export const GapCamFig: React.FC<{ width?: number; at?: number }> = ({ width = 1000, at = 0 }) => {
  const f = useCurrentFrame();
  const p = at > 0 ? pct(f, at, at + 20) : 1;
  return (
    <div style={{ width, opacity: p }}>
      <svg width={width} height={250} style={{ display: "block" }}>
        <text x={10} y={26} fill={C.inkFaint} fontFamily={FONT.mono} fontSize={FT.micro}>{("特征 " + M.cam.featureLen + " × 16")}</text>
        {Array.from({ length: M.cam.featureLen }).map((_, i) => (
          <rect key={i} x={10 + i * 4.2} y={40} width={3} height={92} rx={1} fill={C.panel} stroke={C.panelLine} strokeWidth={0.5} />
        ))}
        <line x1={276} y1={86} x2={340} y2={86} stroke={C.inkFaint} strokeWidth={1.5} />
        <path d="M 332 80 L 341 86 L 332 92" fill="none" stroke={C.inkFaint} strokeWidth={1.5} />
        <text x={308} y={70} textAnchor="middle" fill={C.cyan} fontFamily={FONT.mono} fontSize={FT.micro}>GAP</text>
        {Array.from({ length: 16 }).map((_, i) => (
          <rect key={i} x={352 + i * 13} y={62} width={10} height={48} rx={2} fill="rgba(94,234,212,0.5)" />
        ))}
        <text x={352} y={132} fill={C.inkFaint} fontFamily={FONT.mono} fontSize={FT.micro}>16 维向量</text>
        <line x1={580} y1={86} x2={640} y2={86} stroke={C.inkFaint} strokeWidth={1.5} />
        <path d="M 632 80 L 641 86 L 632 92" fill="none" stroke={C.inkFaint} strokeWidth={1.5} />
        <text x={608} y={70} textAnchor="middle" fill={C.inkDim} fontFamily={FONT.mono} fontSize={FT.micro}>线性 16→3</text>
        {[0, 1, 2].map((i) => (
          <g key={i}>
            <circle cx={686} cy={62 + i * 26} r={9} fill={i === 0 ? C.cyan : C.panelLine} stroke={C.panelLine} />
            <text x={704} y={67 + i * 26} fill={C.inkFaint} fontFamily={FONT.mono} fontSize={FT.micro}>{["电子", "医药", "装备"][i]}</text>
          </g>
        ))}
        <path d={`M 676 150 Q 520 210 300 176`} fill="none" stroke={C.coral} strokeWidth={1.6} strokeDasharray="6 5" />
        <path d="M 306 170 L 298 176 L 307 181" fill="none" stroke={C.coral} strokeWidth={1.6} />
        <text x={430} y={222} fill={C.coral} fontFamily={FONT.mono} fontSize={FT.micro}>{"CAM：分类头权重 × 特征 → 每一天的权重"}</text>
      </svg>
    </div>
  );
};

/** CAM 特征按感受野中心（feature j → day j+3）摊回 60 天，越界取端点值。 */
export const camHeat60 = (): number[] => {
  const f = M.cam.features;
  return Array.from({ length: 60 }, (_, d) => f[Math.min(f.length - 1, Math.max(0, d - 3))]);
};

/** 60 天 CAM 热图：top-5 标出日索引。 */
export const CamHeat: React.FC<{ width?: number; at?: number }> = ({ width = 1000, at = 0 }) => {
  const f = useCurrentFrame();
  const p = at > 0 ? pct(f, at, at + 22) : 1;
  const heat = camHeat60();
  const top = new Set(M.cam.top5);
  const bw = (width - 36) / heat.length;
  return (
    <div style={{ width, opacity: p }}>
      <svg width={width} height={172} style={{ display: "block" }}>
        <text x={0} y={14} fill={C.inkFaint} fontFamily={FONT.mono} fontSize={FT.micro}>{"day 0"}</text>
        <text x={width} y={14} textAnchor="end" fill={C.inkFaint} fontFamily={FONT.mono} fontSize={FT.micro}>{"day 59"}</text>
        {heat.map((v, i) => {
          const t = Math.pow(v, 0.8);
          const isTop = top.has(i);
          return (
            <g key={i}>
              <rect x={18 + i * bw} y={28} width={Math.max(2, bw - 2)} height={64} rx={2} fill={isTop ? "#5EEAD4" : "#1B2B36"} opacity={isTop ? 1 : 0.35 + 0.6 * t} />
              {isTop ? <text x={18 + i * bw + bw / 2} y={110 + (i % 2) * 18} textAnchor="middle" fill={C.coral} fontFamily={FONT.mono} fontSize={FT.micro}>{i}</text> : null}
            </g>
          );
        })}
        <text x={0} y={150} fill={C.inkDim} fontFamily={FONT.sans} fontSize={FT.meta}>{"每个特征管相邻八天，按感受野中心摊回 60 天；最亮的五天集中在窗口末尾。"}</text>
      </svg>
    </div>
  );
};

/** 六个模型的准确率并排条。 */
export const AccBars45: React.FC<{ width?: number; at?: number }> = ({ width = 980, at = 0 }) => {
  const f = useCurrentFrame();
  const p = at > 0 ? pct(f, at, at + 18) : 1;
  const rows = [
    { k: "随机猜", v: M.models.chance, c: C.inkFaint, note: "1/3" },
    { k: "线性 softmax", v: M.models.linear.testAcc, c: C.inkDim, note: "拉平 288 维" },
    { k: "卷积", v: M.models.cnn.testAcc, c: C.cyan, note: "本集" },
    { k: "四块残差", v: M.models.resnet.testAcc, c: C.violet, note: "深" },
    { k: "一块残差", v: M.models.resnetShallow.testAcc, c: C.amber, note: "浅，最高" },
    { k: "GAP-CAM", v: M.models.gapcam.testAcc, c: C.coral, note: "可解释" },
  ];
  const x0 = 236, x1 = width - 190;
  const lo = 0.3, hi = 0.68;
  return (
    <svg width={width} height={6 * 44 + 44} style={{ display: "block" }}>
      {rows.map((r, i) => {
        const y = 8 + i * 44;
        const w = ((r.v - lo) / (hi - lo)) * (x1 - x0);
        return (
          <g key={r.k} opacity={p}>
            <text x={x0 - 14} y={y + 20} textAnchor="end" fill={C.inkDim} fontFamily={FONT.sans} fontSize={FT.meta}>{r.k}</text>
            <rect x={x0} y={y + 4} width={Math.max(4, w)} height={22} rx={4} fill={r.c} opacity={0.85} />
            <text x={x0 + Math.max(4, w) + 12} y={y + 21} fill={r.c} fontFamily={FONT.mono} fontSize={FT.meta}>{fmt4(r.v)}</text>
            <text x={width - 8} y={y + 21} textAnchor="end" fill={C.inkFaint} fontFamily={FONT.mono} fontSize={FT.micro}>{r.note}</text>
          </g>
        );
      })}
      <line x1={x0} y1={6 * 44 + 20} x2={x1} y2={6 * 44 + 20} stroke={C.panelLine} />
      <text x={x0} y={6 * 44 + 36} fill={C.inkFaint} fontFamily={FONT.mono} fontSize={FT.micro}>{"0.30"}</text>
      <text x={x0 + ((0.35 - lo) / (hi - lo)) * (x1 - x0)} y={6 * 44 + 36} textAnchor="middle" fill={C.inkFaint} fontFamily={FONT.mono} fontSize={FT.micro}>{"0.35"}</text>
      <text x={x0 + ((0.55 - lo) / (hi - lo)) * (x1 - x0)} y={6 * 44 + 36} textAnchor="middle" fill={C.inkFaint} fontFamily={FONT.mono} fontSize={FT.micro}>{"0.55"}</text>
      <text x={x1} y={6 * 44 + 36} textAnchor="end" fill={C.inkFaint} fontFamily={FONT.mono} fontSize={FT.micro}>{"0.68"}</text>
    </svg>
  );
};

/** 两个对照：深浅残差、卷积 vs 线性、GAP-CAM vs 卷积。 */
export const CompareBars: React.FC<{ width?: number; at?: number }> = ({ width = 900, at = 0 }) => {
  const f = useCurrentFrame();
  const p = at > 0 ? pct(f, at, at + 16) : 1;
  const rows = [
    { k: "四块残差", v: M.models.resnet.testAcc, c: C.violet },
    { k: "一块残差", v: M.models.resnetShallow.testAcc, c: C.amber },
    { k: "线性", v: M.models.linear.testAcc, c: C.inkDim },
    { k: "卷积", v: M.models.cnn.testAcc, c: C.cyan },
    { k: "GAP-CAM", v: M.models.gapcam.testAcc, c: C.coral },
  ];
  const x0 = 150, x1 = width - 120;
  const lo = 0.45, hi = 0.7;
  return (
    <div style={{ width, opacity: p }}>
      <svg width={width} height={rows.length * 40 + 26} style={{ display: "block" }}>
        {rows.map((r, i) => {
          const y = i * 40;
          const w = ((r.v - lo) / (hi - lo)) * (x1 - x0);
          return (
            <g key={r.k}>
              <text x={x0 - 12} y={y + 24} textAnchor="end" fill={C.inkDim} fontFamily={FONT.sans} fontSize={FT.meta}>{r.k}</text>
              <rect x={x0} y={y + 8} width={Math.max(4, w)} height={20} rx={4} fill={r.c} opacity={0.85} />
              <text x={x0 + Math.max(4, w) + 10} y={y + 24} fill={r.c} fontFamily={FONT.mono} fontSize={FT.meta}>{fmt4(r.v)}</text>
            </g>
          );
        })}
        <text x={0} y={rows.length * 40 + 22} fill={C.inkFaint} fontFamily={FONT.mono} fontSize={FT.micro}>{"横轴 0.45 – 0.70；同一批窗口，同一套切分。"}</text>
      </svg>
    </div>
  );
};

export { Card, fmt2 };
