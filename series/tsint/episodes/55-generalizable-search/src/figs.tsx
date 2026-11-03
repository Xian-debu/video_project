import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { C, FONT, FT } from "../design/tokens";
import { clamp, fmt4, M, pct } from "./shared";

const LABEL = 168;

const tick = (x: number, y: number, text: string, anchor: "start" | "middle" | "end" = "middle") => (
  <text x={x} y={y} fill={C.inkFaint} fontFamily={FONT.mono} fontSize={FT.micro} textAnchor={anchor}>{text}</text>
);

/* 合成空间：四种做法的最大值，阈值线在 3.3014。 */
export const SynthBars: React.FC<{ width?: number; at?: number }> = ({ width = 1000, at = 0 }) => {
  const f = useCurrentFrame();
  const lo = 3.24;
  const hi = 3.98;
  const x = (v: number) => ((v - lo) / (hi - lo)) * (width - LABEL - 190);
  const rows = [
    { label: "随机", value: M.synth.randomBest, color: C.inkDim, note: "10,000 次" },
    { label: "子空间", value: M.synth.cherryBest, color: C.cyan, note: "+0.1021" },
    { label: "比较器", value: M.synth.cmpBest, color: C.violet, note: "+0.1313" },
    { label: "组合预测器", value: M.synth.combBest, color: C.amber, note: "+0.1424" },
  ];
  return (
    <div style={{ width }}>
      <div style={{ fontFamily: FONT.mono, fontSize: FT.meta, color: C.inkFaint, marginBottom: 10 }}>
        合成空间最大值 · 99% 分位线 {fmt4(M.synth.threshold)}
      </div>
      <div style={{ position: "relative" }}>
        <div style={{ position: "absolute", left: LABEL + x(M.synth.threshold), top: 0, bottom: 26, width: 1, borderLeft: "1px dashed " + C.coral }} />
        <div style={{ position: "absolute", left: LABEL + x(M.synth.threshold) + 6, top: -2, fontFamily: FONT.mono, fontSize: FT.micro, color: C.coral }}>阈值</div>
        {rows.map((r, i) => {
          const p = at > 0 ? pct(f, at + i * 6, at + 18 + i * 6) : 1;
          return (
            <div key={r.label} style={{ display: "flex", alignItems: "center", height: 62, opacity: p }}>
              <div style={{ width: LABEL, fontFamily: FONT.sans, fontSize: FT.body, color: C.inkDim }}>{r.label}</div>
              <div style={{ width: width - LABEL - 190, height: 16, background: C.panelLine, borderRadius: 4 }}>
                <div style={{ height: 16, width: Math.max(2, x(r.value)), background: r.color, borderRadius: 4, opacity: 0.9 }} />
              </div>
              <div style={{ width: 190, display: "flex", alignItems: "baseline", gap: 12, paddingLeft: 12 }}>
                <span style={{ fontFamily: FONT.mono, fontSize: FT.lead, color: r.color }}>{fmt4(r.value)}</span>
                <span style={{ fontFamily: FONT.mono, fontSize: FT.micro, color: C.inkFaint }}>{r.note}</span>
              </div>
            </div>
          );
        })}
      </div>
      <div style={{ fontFamily: FONT.mono, fontSize: FT.micro, color: C.inkFaint, marginTop: 2 }}>
        四条都越过阈值；随机自己也越线，差别只在抬升了多少
      </div>
    </div>
  );
};

/* 预算：对数刻度，比较器只花 201 次。 */
export const BudgetBars: React.FC<{ width?: number; at?: number }> = ({ width = 920, at = 0 }) => {
  const f = useCurrentFrame();
  const rows = [
    { label: "随机", value: M.synth.budgets.random, color: C.inkDim },
    { label: "子空间", value: M.synth.budgets.cherry, color: C.cyan },
    { label: "比较器", value: M.synth.budgets.cmp, color: C.violet },
    { label: "组合预测器", value: M.synth.budgets.comb, color: C.amber },
  ];
  const log = (v: number) => Math.log10(v) / Math.log10(12000);
  return (
    <div style={{ width }}>
      {rows.map((r, i) => {
        const p = at > 0 ? pct(f, at + i * 5, at + 16 + i * 5) : 1;
        return (
          <div key={r.label} style={{ display: "flex", alignItems: "center", height: 58, opacity: p }}>
            <div style={{ width: 150, fontFamily: FONT.sans, fontSize: FT.body, color: C.inkDim }}>{r.label}</div>
            <div style={{ width: width - 320, height: 14, background: C.panelLine, borderRadius: 4 }}>
              <div style={{ height: 14, width: Math.max(3, log(r.value) * (width - 320)), background: r.color, borderRadius: 4, opacity: 0.9 }} />
            </div>
            <div style={{ width: 150, textAlign: "right", fontFamily: FONT.mono, fontSize: FT.lead, color: r.color }}>
              {r.value.toLocaleString("en-US")} 次
            </div>
          </div>
        );
      })}
      <div style={{ fontFamily: FONT.mono, fontSize: FT.micro, color: C.inkFaint, marginTop: 4 }}>横轴为对数刻度；一万次是空间的 1%</div>
    </div>
  );
};

/* 子空间漂移：三轮收缩的盒子，中心在 0.7 附近，而最优在四个角。 */
export const BoxDrift: React.FC<{ size?: number; at?: number }> = ({ size = 380, at = 0 }) => {
  const f = useCurrentFrame();
  const p = at > 0 ? pct(f, at, at + 18) : 1;
  const S = size - 40;
  const X = (v: number) => 20 + v * S;
  const box = (lo: number, hi: number, color: string, w: number, dash = false) => (
    <rect
      x={X(lo)} y={S - X(hi) + 20} width={(hi - lo) * S} height={(hi - lo) * S}
      fill="none" stroke={color} strokeWidth={w} strokeDasharray={dash ? "5 4" : undefined}
      opacity={p}
    />
  );
  const c = M.synth.cherryBox;
  return (
    <div style={{ display: "flex", gap: 18, alignItems: "flex-start" }}>
      <svg width={size} height={size}>
        <rect x={20} y={20} width={S} height={S} fill="#0E141C" stroke={C.panelLine} />
        <rect x={X(0.82)} y={20} width={S * 0.18} height={S * 0.18} fill={C.amber} opacity={0.10} />
        <rect x={X(0.82)} y={20} width={S * 0.18} height={S * 0.18} fill="none" stroke={C.amber} strokeDasharray="4 4" opacity={0.8} />
        {box(0.35, 0.95, C.cyan, 1.5, true)}
        {box(Math.min(...c.lo), Math.max(...c.hi), C.cyan, 3)}
        <circle cx={X(0.71)} cy={S - X(0.71) + 20} r={4} fill={C.coral} opacity={p} />
        {tick(20, size - 6, "0", "start")}
        {tick(size - 20, size - 6, "1", "end")}
        {tick(X(0.91), 16, "最优区域", "middle")}
      </svg>
      <div style={{ paddingTop: 6 }}>
        <div style={{ fontFamily: FONT.mono, fontSize: FT.meta, color: C.inkFaint }}>最终盒（第 3 轮）</div>
        <div style={{ fontFamily: FONT.mono, fontSize: FT.lead, color: C.cyan, marginTop: 8 }}>
          [{fmt4(c.lo[0], 2)}, {fmt4(c.hi[0], 2)}]
        </div>
        <div style={{ fontFamily: FONT.sans, fontSize: FT.meta, color: C.inkFaint, marginTop: 14, lineHeight: 1.6 }}>
          四维宽度都不到 0.15<br />
          盒子中心约 0.71<br />
          离角上的最优区域约 0.2
        </div>
        <div style={{ marginTop: 18 }}>
          <div style={{ fontFamily: FONT.mono, fontSize: FT.micro, color: C.inkFaint }}>体积</div>
          {M.synth.cherryVolumes.map((v, i) => (
            <div key={i} style={{ fontFamily: FONT.mono, fontSize: FT.meta, color: i === 2 ? C.cyan : C.inkDim, marginTop: 4 }}>
              第 {i + 1} 轮 {v.toFixed(4)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

/* 真实代理：12 个架构的 MAE，零基线参考线。 */
export const RealBars: React.FC<{ width?: number; at?: number }> = ({ width = 1000, at = 0 }) => {
  const f = useCurrentFrame();
  const lo = 6.172;
  const hi = 6.242;
  const labelW = 118;
  const x = (v: number) => ((v - lo) / (hi - lo)) * (width - labelW - 130);
  return (
    <div style={{ width }}>
      <div style={{ position: "relative" }}>
        <div style={{ position: "absolute", left: labelW + x(M.real.zeroMae), top: 0, bottom: 8, borderLeft: "1px dashed " + C.cyan }} />
        {M.real.archs.map((a, i) => {
          const p = at > 0 ? pct(f, at + i * 3, at + 12 + i * 3) : 1;
          const isBest = a.name === M.real.best.name;
          const isWorst = a.name === M.real.worst.name;
          const color = isBest ? C.cyan : isWorst ? C.coral : C.inkFaint;
          return (
            <div key={a.name} style={{ display: "flex", alignItems: "center", height: 41, opacity: p }}>
              <div style={{ width: labelW, fontFamily: FONT.mono, fontSize: FT.meta, color: isBest || isWorst ? color : C.inkDim }}>{a.name}</div>
              <div style={{ width: width - labelW - 130, height: 11, background: C.panelLine, borderRadius: 3 }}>
                <div style={{ height: 11, width: Math.max(2, x(a.mae)), background: color, opacity: isBest || isWorst ? 0.95 : 0.5, borderRadius: 3 }} />
              </div>
              <div style={{ width: 118, textAlign: "right", fontFamily: FONT.mono, fontSize: FT.meta, color }}>{fmt4(a.mae)}</div>
            </div>
          );
        })}
      </div>
      <div style={{ fontFamily: FONT.mono, fontSize: FT.micro, color: C.inkFaint, marginTop: 6 }}>
        检验段 MAE（bps，越小越好）；青色虚线 = 零基线 {fmt4(M.real.zeroMae)}
      </div>
    </div>
  );
};

/* 成对比较器示意：两个候选，只判谁高。 */
export const CompareDemo: React.FC<{ at?: number }> = ({ at = 0 }) => {
  const f = useCurrentFrame();
  const p = at > 0 ? pct(f, at, at + 16) : 1;
  const arch = (name: string, score: number, color: string, width: number) => (
    <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
      <div style={{ width: 34, fontFamily: FONT.mono, fontSize: FT.meta, color: C.inkFaint }}>{name}</div>
      <div style={{ width: 250, height: 16, background: C.panelLine, borderRadius: 4 }}>
        <div style={{ width: width, height: 16, background: color, borderRadius: 4, opacity: 0.9 }} />
      </div>
      <div style={{ fontFamily: FONT.mono, fontSize: FT.meta, color }}>{score.toFixed(2)}</div>
    </div>
  );
  return (
    <div style={{ opacity: p }}>
      {arch("A", 0.9, C.violet, 250)}
      <div style={{ height: 14 }} />
      {arch("B", 0.5, C.inkFaint, 139)}
      <div style={{ display: "flex", alignItems: "center", gap: 14, marginTop: 16 }}>
        <div style={{ width: 34 }} />
        <div style={{ fontFamily: FONT.sans, fontSize: FT.meta, color: C.inkDim }}>比较器只回答：A 比 B 高？</div>
        <span style={{ fontFamily: FONT.mono, fontSize: FT.meta, color: C.cyan }}>是</span>
      </div>
      <div style={{ fontFamily: FONT.mono, fontSize: FT.micro, color: C.inkFaint, marginTop: 10 }}>
        200 个成对样本训练；不给绝对分数，只给次序
      </div>
    </div>
  );
};

/* 组合预测器：8 块留 4 块。 */
export const PruneDemo: React.FC<{ at?: number }> = ({ at = 0 }) => {
  const f = useCurrentFrame();
  const p = at > 0 ? pct(f, at, at + 16) : 1;
  return (
    <div style={{ opacity: p }}>
      <div style={{ display: "flex", gap: 10 }}>
        {Array.from({ length: 8 }).map((_, i) => {
          const keep = i >= 4;
          return (
            <div key={i} style={{ flex: 1 }}>
              <div style={{
                height: 120, borderRadius: 8, border: "1px solid " + (keep ? C.cyan : C.panelLine),
                background: keep ? "rgba(94,234,212,0.10)" : "#0F161F",
                display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
              }}>
                <div style={{ fontFamily: FONT.mono, fontSize: FT.meta, color: C.inkFaint }}>块 {i + 1}</div>
                <div style={{ fontFamily: FONT.mono, fontSize: FT.lead, color: keep ? C.cyan : C.inkFaint, marginTop: 6 }}>{i + 1}</div>
              </div>
              <div style={{ textAlign: "center", fontFamily: FONT.mono, fontSize: FT.micro, color: keep ? C.cyan : C.inkFaint, marginTop: 6 }}>{keep ? "留下" : "剪掉"}</div>
            </div>
          );
        })}
      </div>
      <div style={{ fontFamily: FONT.mono, fontSize: FT.micro, color: C.inkFaint, marginTop: 12 }}>
        块内平均分 1..8；保留比例 0.5，留下 {'{'}5,6,7,8{'}'}
      </div>
    </div>
  );
};

/* 空间规模：10^6 与 10^20 对数刻度。 */
export const SpaceScale: React.FC<{ width?: number; at?: number }> = ({ width = 900, at = 0 }) => {
  const f = useCurrentFrame();
  const p = at > 0 ? pct(f, at, at + 18) : 1;
  const rows = [
    { label: "本集合成", exp: 6, text: "10^6", color: C.cyan, note: "可穷举真值" },
    { label: "真实联合空间", exp: 20, text: "10^20", color: C.coral, note: "只能采样" },
  ];
  return (
    <div style={{ width, opacity: p }}>
      {rows.map((r) => (
        <div key={r.label} style={{ display: "flex", alignItems: "center", marginBottom: 20 }}>
          <div style={{ width: 190, fontFamily: FONT.sans, fontSize: FT.body, color: C.inkDim }}>{r.label}</div>
          <div style={{ width: width - 390, height: 18, background: C.panelLine, borderRadius: 4 }}>
            <div style={{ height: 18, width: (r.exp / 20) * (width - 390), background: r.color, borderRadius: 4, opacity: 0.85 }} />
          </div>
          <div style={{ width: 90, textAlign: "right", fontFamily: FONT.mono, fontSize: FT.lead, color: r.color }}>{r.text}</div>
          <div style={{ width: 110, textAlign: "right", fontFamily: FONT.mono, fontSize: FT.micro, color: C.inkFaint }}>{r.note}</div>
        </div>
      ))}
      <div style={{ fontFamily: FONT.mono, fontSize: FT.micro, color: C.inkFaint }}>对数刻度；预算一万次，只够真实空间的 10^-16</div>
    </div>
  );
};
