import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { C, FONT, FT, FT_T } from "../design/tokens";
import { M, clamp, pct, fmt4, fmt2 } from "./shared";

/* ---------------- E51 图：预算阶梯 / 阶段曲线 / 外推 / 差距尺 ---------------- */

const AXIS = C.inkFaint;

/** 数据切分：训练 1,686 / 验证 483 / 测试 242，训练段再标三个阶段点。 */
export const SplitBar: React.FC<{ w?: number; stages?: boolean }> = ({ w = 1080, stages = true }) => {
  const tr = M.data.split.train[1];
  const va = M.data.split.valid[1];
  const te = M.data.split.test[1];
  const tot = tr + va + te;
  const seg = (n: number) => (n / tot) * w;
  return (
    <div style={{ width: w }}>
      <div style={{ display: "flex", height: 40, borderRadius: 6, overflow: "hidden", position: "relative" }}>
        <div style={{ width: seg(tr), background: C.cyan, opacity: 0.55 }} />
        <div style={{ width: seg(va), background: C.violet, opacity: 0.55 }} />
        <div style={{ width: seg(te), background: C.amber, opacity: 0.75 }} />
        {stages ? M.data.stages.map((n) => (
          <div key={n} style={{ position: "absolute", left: seg(n), top: 0, height: 40, width: 2, background: C.ink, opacity: 0.8 }} />
        )) : null}
      </div>
      <div style={{ display: "flex", marginTop: 10, fontFamily: FONT.mono, fontSize: FT.meta, color: C.inkDim }}>
        <div style={{ width: seg(tr) }}>train {tr.toLocaleString("en-US")}</div>
        <div style={{ width: seg(va) }}>valid {va}</div>
        <div style={{ width: seg(te) }}>test {te}</div>
      </div>
      {stages ? (
        <div style={{ marginTop: 12, fontFamily: FONT.mono, fontSize: FT.meta, color: C.inkFaint }}>
          三个阶段点：{M.data.stages.map((n) => n.toLocaleString("en-US")).join(" / ")} 条训练样本 —— 只在这三点上拟合后外推
        </div>
      ) : null}
    </div>
  );
};

/** 三种代价：10 次穷举 / 200 次遗传 / 648 格网格。 */
export const CostLadder: React.FC<{ w?: number; at?: number }> = ({ w = 1000, at = 0 }) => {
  const f = useCurrentFrame();
  const rows = [
    { name: "穷举十个候选", v: 10, color: C.cyan, note: "10 次拟合，答案就是全池扫描" },
    { name: "遗传算法 20×10", v: M.ga.evals, color: C.coral, note: "200 次拟合，答案一模一样" },
    { name: "七维网格", v: 648, color: C.inkFaint, note: "真正的组合爆炸，才轮到 GA" },
  ];
  const hi = 648;
  return (
    <div style={{ width: w }}>
      {rows.map((r, i) => {
        const p = at > 0 ? pct(f, at + i * 6, at + 18 + i * 6) : 1;
        const bw = Math.max(3, (r.v / hi) * (w - 330));
        return (
          <div key={r.name} style={{ display: "flex", alignItems: "center", height: 66, opacity: p }}>
            <div style={{ width: 190, fontFamily: FONT.sans, fontSize: FT.body, color: C.inkDim }}>{r.name}</div>
            <div style={{ width: w - 330, height: 16, background: C.panelLine, borderRadius: 4 }}>
              <div style={{ width: bw, height: 16, borderRadius: 4, background: r.color, opacity: 0.85 }} />
            </div>
            <div style={{ width: 140, textAlign: "right", fontFamily: FONT.mono, fontSize: FT.lead, color: r.color }}>{r.v}</div>
          </div>
        );
      })}
      <div style={{ marginTop: 6, fontFamily: FONT.mono, fontSize: FT.meta, color: C.inkFaint }}>
        遗传算法花掉全池的 20 倍算力，只触及七维网格的 {fmt2(M.budget.gridShare)}%
      </div>
    </div>
  );
};

const RAIL = [
  { key: "naive", label: "naive", color: C.inkFaint },
  { key: "ar1", label: "AR(1)", color: C.coral },
  { key: "sar12", label: "SAR(12)", color: C.amber },
  { key: "ridge5-l1e-3", label: "Ridge·1e-3", color: C.violet },
];

/** 阶段曲线：x = 训练样本数（对数感觉的等距三点），y = 验证 MAE。 */
export const StageCurves: React.FC<{ w?: number; h?: number; at?: number }> = ({ w = 1040, h = 420, at = 0 }) => {
  const f = useCurrentFrame();
  const p = at > 0 ? pct(f, at, at + 22) : 1;
  const left = 84;
  const top = 26;
  const iw = w - left - 190;
  const ih = h - top - 46;
  const lo = 10.2;
  const hiV = 21.2;
  const xs = [0, 1, 2, 3];
  const X = (i: number) => left + (i / 3) * iw;
  const Y = (v: number) => top + ih - ((Math.min(hiV, Math.max(lo, v)) - lo) / (hiV - lo)) * ih;
  const label = ["213", "426", "852", "全量"];
  return (
    <div style={{ width: w, height: h, position: "relative", opacity: p }}>
      <svg width={w} height={h} style={{ position: "absolute", left: 0, top: 0 }}>
        {[11, 13, 15, 17, 19, 21].map((v) => (
          <g key={v}>
            <line x1={left} x2={left + iw} y1={Y(v)} y2={Y(v)} stroke={C.panelLine} strokeWidth={1} />
            <text x={left - 12} y={Y(v) + 5} fill={AXIS} fontFamily={FONT.mono} fontSize={16} textAnchor="end">{v}</text>
          </g>
        ))}
        {xs.map((i) => (
          <text key={i} x={X(i)} y={top + ih + 26} fill={AXIS} fontFamily={FONT.mono} fontSize={16} textAnchor="middle">{label[i]}</text>
        ))}
        {M.stageCurves.map((c) => {
          const rail = RAIL.find((r) => r.key === c.name);
          const pts = [...c.mae, c.full];
          const d = pts.map((v, i) => (i === 0 ? "M " : "L ") + fmt2(X(i), 1) + " " + fmt2(Y(v), 1)).join(" ");
          return (
            <path key={c.name} d={d} fill="none" stroke={rail ? rail.color : C.inkFaint}
              strokeWidth={rail ? 3.2 : 1.4} opacity={rail ? 0.95 : 0.42} strokeLinejoin="round" />
          );
        })}
        {M.stageCurves.map((c) => {
          const rail = RAIL.find((r) => r.key === c.name);
          if (!rail) return null;
          return <circle key={c.name} cx={X(3)} cy={Y(c.full)} r={4.5} fill={rail.color} />;
        })}
      </svg>
      <div style={{ position: "absolute", left: left + iw + 22, top: top + 4 }}>
        {RAIL.map((r) => (
          <div key={r.key} style={{ display: "flex", alignItems: "center", marginBottom: 14 }}>
            <div style={{ width: 10, height: 3, background: r.color, marginRight: 10 }} />
            <div style={{ fontFamily: FONT.mono, fontSize: FT.meta, color: C.inkDim }}>{r.label}</div>
          </div>
        ))}
        <div style={{ fontFamily: FONT.mono, fontSize: FT.micro, color: C.inkFaint, marginTop: 6 }}>
          拟合模型三段都在掉，<br />朴素模型一条平线
        </div>
      </div>
    </div>
  );
};

const EXTRAP_ROWS = ["naive", "ar1", "ridge5-l1e-3", "ridge5-l1", "sar5", "sar12"];

/** 外推前后：同一候选的验证 MAE、线性外推、幂律外推。 */
export const ExtrapBars: React.FC<{ w?: number; at?: number }> = ({ w = 1040, at = 0 }) => {
  const f = useCurrentFrame();
  const hi = 21;
  const bw = (v: number) => Math.max(2, (Math.max(0, Math.min(hi, v)) / hi) * (w - 420));
  return (
    <div style={{ width: w }}>
      {EXTRAP_ROWS.map((name, i) => {
        const c = M.candidates.find((x) => x.name === name);
        if (!c) return null;
        const p = at > 0 ? pct(f, at + i * 7, at + 18 + i * 7) : 1;
        return (
          <div key={name} style={{ display: "flex", alignItems: "center", height: 82, opacity: p }}>
            <div style={{ width: 150, fontFamily: FONT.mono, fontSize: FT.meta, color: C.inkDim }}>{name}</div>
            <div style={{ width: w - 420 }}>
              <div style={{ display: "flex", alignItems: "center", height: 20 }}>
                <div style={{ width: bw(c.validMae), height: 12, borderRadius: 3, background: C.cyan, opacity: 0.8 }} />
                <div style={{ marginLeft: 10, fontFamily: FONT.mono, fontSize: FT.micro, color: C.inkFaint }}>{fmt4(c.validMae)}</div>
              </div>
              <div style={{ display: "flex", alignItems: "center", height: 20 }}>
                <div style={{ width: bw(c.extrapMae), height: 12, borderRadius: 3, background: C.coral, opacity: c.extrapMae < 0 ? 0.35 : 0.85 }} />
                <div style={{ marginLeft: 10, fontFamily: FONT.mono, fontSize: FT.micro, color: C.coral }}>
                  {c.extrapMae < 0 ? fmt4(c.extrapMae) + "（负）" : fmt4(c.extrapMae)}
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", height: 20 }}>
                <div style={{ width: bw(c.extrapPow), height: 12, borderRadius: 3, background: C.violet, opacity: 0.85 }} />
                <div style={{ marginLeft: 10, fontFamily: FONT.mono, fontSize: FT.micro, color: C.violet }}>{fmt4(c.extrapPow)}</div>
              </div>
            </div>
            <div style={{ width: 120, textAlign: "right", fontFamily: FONT.mono, fontSize: FT.meta, color: C.inkDim }}>
              test {fmt4(c.testMae)}
            </div>
          </div>
        );
      })}
      <div style={{ marginTop: 4, fontFamily: FONT.mono, fontSize: FT.micro, color: C.inkFaint }}>
        青 = 验证段真实；珊瑚 = 三点直线外推；紫 = 三点幂律外推
      </div>
    </div>
  );
};

/** 差距尺：冠军与亚军的 valid MAE 差距，对比外推误差。 */
export const GapRuler: React.FC<{ w?: number; at?: number }> = ({ w = 1000, at = 0 }) => {
  const f = useCurrentFrame();
  const p = at > 0 ? pct(f, at, at + 20) : 1;
  const hi = 1.6;
  const bar = (v: number) => Math.max(3, (v / hi) * (w - 300));
  const rows = [
    { name: "冠军 − 亚军", v: M.demo.gap, color: C.cyan, note: "真实排序要恢复的量" },
    { name: "幂律外推误差", v: M.demo.pow.errMean, color: C.violet, note: "外推读数偏离冠军的均值" },
    { name: "线性外推误差", v: M.demo.lin.errMean, color: C.coral, note: "差一个数量级" },
  ];
  return (
    <div style={{ width: w, opacity: p }}>
      {rows.map((r, i) => (
        <div key={r.name} style={{ marginBottom: 22 }}>
          <div style={{ display: "flex", alignItems: "baseline", marginBottom: 6 }}>
            <div style={{ width: 200, fontFamily: FONT.sans, fontSize: FT.body, color: C.inkDim }}>{r.name}</div>
            <div style={{ fontFamily: FONT.mono, fontSize: FT.lead, color: r.color }}>{fmt4(r.v)}</div>
            <div style={{ marginLeft: 16, fontFamily: FONT.sans, fontSize: FT.meta, color: C.inkFaint }}>{r.note}</div>
          </div>
          <div style={{ width: w - 300, height: 14, background: C.panelLine, borderRadius: 4 }}>
            <div style={{ width: bar(r.v), height: 14, borderRadius: 4, background: r.color, opacity: 0.85 }} />
          </div>
        </div>
      ))}
      <div style={{ fontFamily: FONT.mono, fontSize: FT.meta, color: C.ink }}>
        外推误差是排序差距的 {fmt2(M.demo.ratio)} 倍 —— 省下的算力，省不出分辨率
      </div>
    </div>
  );
};

/** 三点拟合演示：线性射线 vs 幂律曲线，目标点 1,686。 */
export const FitDemo: React.FC<{ w?: number; h?: number; at?: number }> = ({ w = 980, h = 400, at = 0 }) => {
  const f = useCurrentFrame();
  const p = at > 0 ? pct(f, at, at + 20) : 1;
  const left = 66;
  const top = 24;
  const iw = w - left - 60;
  const ih = h - top - 50;
  const nMax = 1686;
  const X = (n: number) => left + (n / nMax) * iw;
  const Y = (v: number) => top + ih - (Math.max(0, Math.min(20, v)) / 20) * ih;
  const c = M.stageCurves.find((s) => s.name === "ar1");
  if (!c) return null;
  const pts = M.data.stages.map((n, i) => ({ n, v: c.mae[i] }));
  const linEnd = 0;
  const cnd = M.candidates.find((q) => q.name === c.name);
  const powEnd = cnd ? cnd.extrapPow : c.full;
  const actual = c.full;
  const powPath = Array.from({ length: 25 }, (_, k) => {
    const n = 100 + (k / 24) * (nMax - 100);
    const v = Math.exp(Math.log(pts[0].v) + (Math.log(pts[2].v) - Math.log(pts[0].v)) * (Math.log(n) - Math.log(pts[0].n)) / (Math.log(pts[2].n) - Math.log(pts[0].n)));
    return { n, v };
  });
  return (
    <div style={{ width: w, height: h, position: "relative", opacity: p }}>
      <svg width={w} height={h} style={{ position: "absolute", left: 0, top: 0 }}>
        {[5, 10, 15, 20].map((v) => (
          <g key={v}>
            <line x1={left} x2={left + iw} y1={Y(v)} y2={Y(v)} stroke={C.panelLine} />
            <text x={left - 10} y={Y(v) + 5} fill={AXIS} fontFamily={FONT.mono} fontSize={15} textAnchor="end">{v}</text>
          </g>
        ))}
        <line x1={X(nMax)} x2={X(nMax)} y1={top} y2={top + ih} stroke={C.inkFaint} strokeDasharray="4 4" />
        <text x={X(nMax) - 6} y={top + 16} fill={AXIS} fontFamily={FONT.mono} fontSize={15} textAnchor="end">全量 1,686</text>
        {pts.map((pt) => <circle key={pt.n} cx={X(pt.n)} cy={Y(pt.v)} r={5} fill={C.cyan} />)}
        <line x1={X(pts[2].n)} y1={Y(pts[2].v)} x2={X(nMax)} y2={Y(linEnd)} stroke={C.coral} strokeWidth={2.4} strokeDasharray="7 5" />
        <path d={"M " + powPath.map((q) => fmt2(X(q.n), 1) + " " + fmt2(Y(q.v), 1)).join(" L ")} fill="none" stroke={C.violet} strokeWidth={2.4} />
        <circle cx={X(nMax)} cy={Y(actual)} r={6} fill={C.amber} />
        <text x={X(nMax) - 12} y={Y(actual) + 26} fill={C.amber} fontFamily={FONT.mono} fontSize={16} textAnchor="end">真值 {fmt4(actual)}</text>
        <text x={X(400)} y={Y(powEnd) + 34} fill={C.violet} fontFamily={FONT.mono} fontSize={16}>幂律 {fmt4(powEnd)}</text>
        <text x={X(620)} y={Y(0) - 10} fill={C.coral} fontFamily={FONT.mono} fontSize={16}>直线一路朝负</text>
      </svg>
      <div style={{ position: "absolute", left: left, bottom: 2, fontFamily: FONT.mono, fontSize: FT.micro, color: C.inkFaint }}>
        AR(1) 的三点 MAE：{pts.map((q) => q.v.toFixed(2)).join(" / ")} —— 横轴训练样本数，纵轴验证 MAE
      </div>
    </div>
  );
};

/** 十个候选的芯片墙：test MAE 与赢下的股票数。 */
export const CandChips: React.FC<{ w?: number; perRow?: number; at?: number }> = ({ w = 1060, perRow = 5, at = 0 }) => {
  const f = useCurrentFrame();
  const cw = (w - (perRow - 1) * 14) / perRow;
  return (
    <div style={{ width: w, display: "flex", flexWrap: "wrap", gap: 14 }}>
      {M.candidates.map((c, i) => {
        const p = at > 0 ? pct(f, at + i * 4, at + 14 + i * 4) : 1;
        const hot = c.wins >= 3;
        return (
          <div key={c.name} style={{ width: cw, boxSizing: "border-box", opacity: p,
            background: C.bgSoft, border: "1px solid " + (hot ? C.cyan : C.panelLine), borderRadius: 10, padding: "12px 14px" }}>
            <div style={{ fontFamily: FONT.mono, fontSize: FT.meta, color: hot ? C.cyan : C.inkDim }}>{c.name}</div>
            <div style={{ fontFamily: FONT.mono, fontSize: FT.lead, color: C.ink, marginTop: 6 }}>{fmt4(c.testMae)}</div>
            <div style={{ fontFamily: FONT.mono, fontSize: FT.micro, color: C.inkFaint, marginTop: 4 }}>赢 {c.wins} 只</div>
          </div>
        );
      })}
    </div>
  );
};

/** 216 格小方块：GA 的 200 次评估，每次都是一个新基因。 */
export const EvalGrid: React.FC<{ cols?: number; cell?: number; at?: number }> = ({ cols = 20, cell = 20, at = 0 }) => {
  const f = useCurrentFrame();
  const p = at > 0 ? pct(f, at, at + 20) : 1;
  const n = M.ga.evals;
  return (
    <div style={{ opacity: p }}>
      <div style={{ display: "flex", flexWrap: "wrap", width: cols * (cell + 4) }}>
        {Array.from({ length: n }).map((_, i) => (
          <div key={i} style={{
            width: cell, height: cell, margin: 2, borderRadius: 3,
            background: i < M.ga.unique ? C.coral : C.panelLine, opacity: 0.85,
          }} />
        ))}
      </div>
      <div style={{ marginTop: 10, fontFamily: FONT.mono, fontSize: FT.micro, color: C.inkFaint }}>
        {M.ga.evals} 次评估 = {M.ga.unique} 次不重复训练（缓存一次没命中）
      </div>
    </div>
  );
};

export const LEGEND: React.FC<{ items: { color: string; label: string }[] }> = ({ items }) => (
  <div style={{ display: "flex", gap: 22 }}>
    {items.map((it) => (
      <div key={it.label} style={{ display: "flex", alignItems: "center" }}>
        <div style={{ width: 12, height: 12, borderRadius: 3, background: it.color, marginRight: 8 }} />
        <div style={{ fontFamily: FONT.mono, fontSize: FT.micro, letterSpacing: FT_T.micro, color: C.inkFaint }}>{it.label}</div>
      </div>
    ))}
  </div>
);

export { interpolate, clamp };
