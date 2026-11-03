import React from "react";
import { useCurrentFrame } from "remotion";
import { C, FONT, FT } from "../design/tokens";
import { M, fmt2, pct } from "./shared";

/* ---------------- E53 图形：切分、层级、候选、迭代曲线、胜负表、噪声 ---------------- */

const LABEL = 150;

/** 训练 / 调参 / 检验三段的时间切分。 */
export const SplitBar: React.FC<{ width?: number; at?: number }> = ({ width = 900, at = 0 }) => {
  const f = useCurrentFrame();
  const p = at > 0 ? pct(f, at, at + 18) : 1;
  const segs = [
    { k: "训练", frac: 0.7, color: C.cyan, note: `${M.data.split.train[0]}–${M.data.split.train[1]} 根` },
    { k: "调参", frac: 0.15, color: C.violet, note: `${M.data.split.tune[0]}–${M.data.split.tune[1]} 根` },
    { k: "检验", frac: 0.15, color: C.amber, note: `${M.data.split.test[0]}–${M.data.split.test[1]} 根` },
  ];
  return (
    <div style={{ width, opacity: p }}>
      <div style={{ display: "flex", height: 34, borderRadius: 6, overflow: "hidden", border: "1px solid " + C.panelLine }}>
        {segs.map((s) => (
          <div key={s.k} style={{ width: width * s.frac, background: s.color, opacity: 0.82, display: "flex", alignItems: "center", paddingLeft: 12 }}>
            <span style={{ fontFamily: FONT.mono, fontSize: FT.meta, color: "#0b1118" }}>{s.k} {Math.round(s.frac * 100)}%</span>
          </div>
        ))}
      </div>
      <div style={{ display: "flex", marginTop: 8 }}>
        {segs.map((s) => (
          <div key={s.k} style={{ width: width * s.frac, fontFamily: FONT.mono, fontSize: FT.micro, color: C.inkFaint }}>{s.note}</div>
        ))}
      </div>
    </div>
  );
};

/** 七个误差放在同一条尺上：从平均单模型到 oracle。 */
export const LevelBars: React.FC<{ width?: number; at?: number }> = ({ width = 980, at = 0 }) => {
  const f = useCurrentFrame();
  const rows = [
    { label: "平均单模型", value: M.levels.meanSingle, color: C.inkFaint },
    { label: "等权集成", value: M.levels.equal, color: C.amber },
    { label: "中位数", value: M.levels.median, color: C.violet },
    { label: "岭权重", value: M.levels.fit, color: C.violet },
    { label: "迭代 η=0.5", value: M.levels.iter05, color: C.violet },
    { label: "最强单模型", value: M.levels.best, color: C.cyan },
    { label: "oracle", value: M.levels.oracle, color: C.cyan },
  ];
  const lo = 9.45;
  const hi = 11.35;
  const w = width - LABEL - 96;
  return (
    <div style={{ width }}>
      {rows.map((r, i) => {
        const p = at > 0 ? pct(f, at + i * 4, at + 14 + i * 4) : 1;
        const frac = (r.value - lo) / (hi - lo);
        return (
          <div key={r.label} style={{ display: "flex", alignItems: "center", height: 44, opacity: p }}>
            <div style={{ width: LABEL, fontFamily: FONT.sans, fontSize: FT.meta, color: C.inkDim }}>{r.label}</div>
            <div style={{ width: w, height: 12, background: C.panelLine, borderRadius: 3, position: "relative" }}>
              <div style={{ position: "absolute", left: 0, top: 0, height: 12, width: Math.max(2, frac * w), background: r.color, opacity: 0.9, borderRadius: 3 }} />
            </div>
            <div style={{ width: 84, textAlign: "right", fontFamily: FONT.mono, fontSize: FT.meta, color: r.color }}>{fmt2(r.value)}</div>
          </div>
        );
      })}
      <div style={{ marginTop: 6, fontFamily: FONT.mono, fontSize: FT.micro, color: C.inkFaint }}>
        横轴 9.45 → 11.35 MAE；长度按误差线性缩放
      </div>
    </div>
  );
};

/** 十个候选的检验误差，按大小排序。 */
export const CandidateBars: React.FC<{ width?: number; at?: number }> = ({ width = 980, at = 0 }) => {
  const f = useCurrentFrame();
  const rows = [...M.data.candidates].sort((a, b) => a.testMae - b.testMae);
  const lo = 9.2;
  const hi = 16.8;
  const w = width - LABEL - 100;
  return (
    <div style={{ width }}>
      {rows.map((r, i) => {
        const p = at > 0 ? pct(f, at + i * 4, at + 12 + i * 4) : 1;
        const frac = (r.testMae - lo) / (hi - lo);
        const weak = r.testMae > 14;
        return (
          <div key={r.name} style={{ display: "flex", alignItems: "center", height: 36, opacity: p }}>
            <div style={{ width: LABEL, fontFamily: FONT.mono, fontSize: FT.micro, color: weak ? C.coral : C.inkDim }}>{r.name}</div>
            <div style={{ width: w, height: 10, background: C.panelLine, borderRadius: 3 }}>
              <div style={{ height: 10, width: Math.max(2, frac * w), background: weak ? C.coral : C.cyan, opacity: 0.85, borderRadius: 3 }} />
            </div>
            <div style={{ width: 100, textAlign: "right", fontFamily: FONT.mono, fontSize: FT.micro, color: weak ? C.coral : C.ink }}>{fmt2(r.testMae)}</div>
          </div>
        );
      })}
      <div style={{ marginTop: 6, fontFamily: FONT.mono, fontSize: FT.micro, color: C.inkFaint }}>
        检验段 MAE；红色 = 明显拖后腿的两个成员
      </div>
    </div>
  );
};

/** 两条迭代曲线：检验段 MAE 随轮数下降，逼近最强单模型。 */
export const IterCurve: React.FC<{ width?: number; height?: number; at?: number }> = ({ width = 760, height = 380, at = 0 }) => {
  const f = useCurrentFrame();
  const p = at > 0 ? pct(f, at, at + 20) : 1;
  const padL = 58;
  const padB = 46;
  const padT = 26;
  const xs = [1, 3, 5, 10];
  const x = (r: number) => padL + (xs.indexOf(r) / (xs.length - 1)) * (width - padL - 24);
  const lo = 9.54;
  const hi = 9.645;
  const y = (v: number) => padT + (1 - (v - lo) / (hi - lo)) * (height - padT - padB);
  const series = [
    { eta: 0.1, color: C.cyan, label: "η = 0.1" },
    { eta: 0.5, color: C.amber, label: "η = 0.5" },
  ];
  return (
    <div style={{ width, opacity: p }}>
      <svg width={width} height={height} style={{ overflow: "visible" }}>
        {[9.55, 9.58, 9.61, 9.64].map((v) => (
          <g key={v}>
            <line x1={padL} x2={width - 24} y1={y(v)} y2={y(v)} stroke={C.panelLine} strokeWidth={1} />
            <text x={padL - 10} y={y(v) + 4} textAnchor="end" fill={C.inkFaint} fontFamily={FONT.mono} fontSize={13}>{v.toFixed(2)}</text>
          </g>
        ))}
        <line x1={padL} x2={width - 24} y1={y(M.levels.best)} y2={y(M.levels.best)} stroke={C.violet} strokeWidth={1} strokeDasharray="6 5" />
        <text x={width - 24} y={y(M.levels.best) - 8} textAnchor="end" fill={C.violet} fontFamily={FONT.mono} fontSize={13}>
          最强单模型 {fmt2(M.levels.best)}
        </text>
        {xs.map((r) => (
          <text key={r} x={x(r)} y={height - 18} textAnchor="middle" fill={C.inkFaint} fontFamily={FONT.mono} fontSize={14}>{r} 轮</text>
        ))}
        {series.map((s) => {
          const pts = M.iters.filter((i) => i.eta === s.eta).map((i) => [x(i.rounds), y(i.testMae)] as const);
          const d = pts.map((q, k) => (k === 0 ? "M" : "L") + q[0] + "," + q[1]).join(" ");
          return (
            <g key={s.eta}>
              <path d={d} fill="none" stroke={s.color} strokeWidth={3} />
              {pts.map((q, k) => <circle key={k} cx={q[0]} cy={q[1]} r={5} fill={s.color} />)}
            </g>
          );
        })}
      </svg>
      <div style={{ display: "flex", gap: 26, marginLeft: padL, fontFamily: FONT.mono, fontSize: FT.micro }}>
        {series.map((s) => (
          <span key={s.eta} style={{ color: s.color }}>● {s.label}</span>
        ))}
        <span style={{ color: C.inkFaint }}>检验段 MAE</span>
      </div>
    </div>
  );
};

/** 二十只股票的胜负格子：赢 = 实心，输 = 空心。 */
export const WinTally: React.FC<{ at?: number }> = ({ at = 0 }) => {
  const f = useCurrentFrame();
  const rows = [
    { label: "岭权重 vs 等权", win: M.tally.fitLEEqual, color: C.cyan },
    { label: "迭代 η=0.1 vs 等权", win: 20, color: C.cyan },
    { label: "中位数 vs 最强单模型", win: M.tally.medianLEBest, color: C.violet },
    { label: "岭权重 vs 最强单模型", win: M.tally.fitLEBest, color: C.violet },
    { label: "迭代 vs 最强单模型", win: M.tally.iter01LEBest, color: C.violet },
    { label: "等权 vs 最强单模型", win: M.tally.equalLEBest, color: C.coral },
  ];
  return (
    <div>
      {rows.map((r, i) => {
        const p = at > 0 ? pct(f, at + i * 5, at + 14 + i * 5) : 1;
        return (
          <div key={r.label} style={{ display: "flex", alignItems: "center", height: 40, opacity: p }}>
            <div style={{ width: 246, fontFamily: FONT.sans, fontSize: FT.meta, color: C.inkDim }}>{r.label}</div>
            <div style={{ display: "flex", gap: 4 }}>
              {Array.from({ length: 20 }).map((_, k) => (
                <div key={k} style={{
                  width: 16, height: 16, borderRadius: 3,
                  background: k < r.win ? r.color : "transparent",
                  border: "1px solid " + (k < r.win ? r.color : C.panelLine),
                  opacity: k < r.win ? 0.85 : 0.5,
                }} />
              ))}
            </div>
            <div style={{ width: 54, marginLeft: 12, fontFamily: FONT.mono, fontSize: FT.micro, color: C.inkFaint }}>{r.win}/20</div>
          </div>
        );
      })}
    </div>
  );
};

/** 噪声增强：单变体平均 → 集成 → 干净单模型。 */
export const NoisePanel: React.FC<{ width?: number; at?: number }> = ({ width = 820, at = 0 }) => {
  const f = useCurrentFrame();
  const p = at > 0 ? pct(f, at, at + 18) : 1;
  const rows = [
    { label: "单变体平均", value: M.noise.avgVariant, color: C.coral, note: "10 个扰动模型各自预测" },
    { label: "噪声集成", value: M.noise.ensemble, color: C.amber, note: `偏离单变体的 ${M.noise.devRatio.toFixed(4)} 倍` },
    { label: "干净单模型", value: M.noise.single, color: C.cyan, note: "不扰动，直接拟合" },
  ];
  const hi = 17.2;
  const w = width - LABEL - 96;
  return (
    <div style={{ width, opacity: p }}>
      {rows.map((r) => (
        <div key={r.label} style={{ marginBottom: 18 }}>
          <div style={{ display: "flex", alignItems: "baseline" }}>
            <div style={{ width: LABEL, fontFamily: FONT.sans, fontSize: FT.meta, color: C.inkDim }}>{r.label}</div>
            <div style={{ width: w, height: 16, background: C.panelLine, borderRadius: 3 }}>
              <div style={{ height: 16, width: Math.max(3, (r.value / hi) * w), background: r.color, opacity: 0.85, borderRadius: 3 }} />
            </div>
            <div style={{ width: 92, textAlign: "right", fontFamily: FONT.mono, fontSize: FT.lead, color: r.color }}>{fmt2(r.value)}</div>
          </div>
          <div style={{ marginLeft: LABEL, marginTop: 4, fontFamily: FONT.mono, fontSize: FT.micro, color: C.inkFaint }}>{r.note}</div>
        </div>
      ))}
    </div>
  );
};

/** 一条大数字的差值标注：用于「高 6.35%」这类结论。 */
export const GapNote: React.FC<{ a: string; b: string; diff: string; color?: string }> = ({ a, b, diff, color = C.coral }) => (
  <div style={{ display: "flex", alignItems: "baseline", gap: 18, fontFamily: FONT.mono }}>
    <span style={{ fontSize: FT.lead, color: C.inkDim }}>{a}</span>
    <span style={{ fontSize: FT.meta, color: C.inkFaint }}>→</span>
    <span style={{ fontSize: FT.lead, color: C.ink }}>{b}</span>
    <span style={{ fontSize: FT.num, color }}>{diff}</span>
  </div>
);
