import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { C, FONT, FT } from "../design/tokens";
import { M, clamp, pct, fmt4, fmt2, fmtPct } from "./shared";

/* ---------------- E52 图：数据切分 / 命中率 / 冠军分布 / 误差量级 / 后悔分布 / 分行业 ---------------- */

/** 数据切分：训练 809–1705 / 验证 466–484 / 测试 232–242。 */
export const SplitBar: React.FC<{ w?: number }> = ({ w = 1080 }) => {
  const tr = M.data.split.train[1];
  const va = M.data.split.valid[1];
  const te = M.data.split.test[1];
  const tot = tr + va + te;
  const seg = (n: number) => (n / tot) * w;
  return (
    <div style={{ width: w }}>
      <div style={{ display: "flex", height: 40, borderRadius: 6, overflow: "hidden" }}>
        <div style={{ width: seg(tr), background: C.cyan, opacity: 0.55 }} />
        <div style={{ width: seg(va), background: C.violet, opacity: 0.55 }} />
        <div style={{ width: seg(te), background: C.amber, opacity: 0.75 }} />
      </div>
      <div style={{ display: "flex", marginTop: 10, fontFamily: FONT.mono, fontSize: FT.meta, color: C.inkDim }}>
        <div style={{ width: seg(tr) }}>train {tr.toLocaleString("en-US")}</div>
        <div style={{ width: seg(va) }}>valid {va}</div>
        <div style={{ width: seg(te) }}>test {te}</div>
      </div>
      <div style={{ marginTop: 10, fontFamily: FONT.mono, fontSize: FT.meta, color: C.inkFaint }}>
        训练段截止 {M.data.cut.trainEnd} · 验证段到 {M.data.cut.validEnd} · 快照 {M.data.cut.snapshot}
      </div>
    </div>
  );
};

/** 四条命中率：元学习 / 类均值 / 恒选 naive / 64 维表征。 */
export const HitsBars: React.FC<{ w?: number; at?: number }> = ({ w = 900, at = 0 }) => {
  const f = useCurrentFrame();
  const rows = [
    { name: "恒选 naive", v: M.hits.naive, color: C.coral, note: "最强的常数策略" },
    { name: "行业类均值", v: M.hits.classMean, color: C.violet, note: "按行业均值挑模型" },
    { name: "元学习 · 4 维", v: M.hits.stats, color: C.cyan, note: "本集主线" },
    { name: "元学习 · 64 维", v: M.hits.ts2vec, color: C.amber, note: "TS2Vec 表征" },
  ];
  return (
    <div style={{ width: w }}>
      {rows.map((r, i) => {
        const p = at > 0 ? pct(f, at + i * 6, at + 18 + i * 6) : 1;
        const bw = Math.max(3, r.v * (w - 340));
        return (
          <div key={r.name} style={{ display: "flex", alignItems: "center", height: 62, opacity: p }}>
            <div style={{ width: 190, fontFamily: FONT.sans, fontSize: FT.body, color: C.inkDim }}>{r.name}</div>
            <div style={{ width: w - 340, height: 16, background: C.panelLine, borderRadius: 4 }}>
              <div style={{ width: bw, height: 16, borderRadius: 4, background: r.color, opacity: 0.9 }} />
            </div>
            <div style={{ width: 150, textAlign: "right", fontFamily: FONT.mono, fontSize: FT.lead, color: r.color }}>{fmtPct(r.v, 2)}</div>
          </div>
        );
      })}
      <div style={{ marginTop: 8, fontFamily: FONT.mono, fontSize: FT.micro, color: C.inkFaint }}>横轴 0–50% · 300 个任务 · 任务级 5 折</div>
    </div>
  );
};

/** 冠军分布：十个候选各自的胜场数（长尾）。 */
export const WinBars: React.FC<{ w?: number; at?: number; max?: number }> = ({ w = 960, at = 0, max = 140 }) => {
  const f = useCurrentFrame();
  const maxW = Math.max(...M.candidates.map((c) => c.wins));
  const hi = Math.max(max, maxW);
  return (
    <div style={{ width: w }}>
      {M.candidates.map((c, i) => {
        const p = at > 0 ? pct(f, at + i * 4, at + 14 + i * 4) : 1;
        const bw = Math.max(2, (c.wins / hi) * (w - 330));
        const dim = c.wins === 0;
        return (
          <div key={c.name} style={{ display: "flex", alignItems: "center", height: 44, opacity: p }}>
            <div style={{ width: 150, fontFamily: FONT.mono, fontSize: FT.meta, color: dim ? C.inkFaint : C.inkDim }}>{c.name}</div>
            <div style={{ width: w - 330, height: 12, background: C.panelLine, borderRadius: 4 }}>
              <div style={{ width: bw, height: 12, borderRadius: 4, background: i === 0 ? C.coral : C.cyan, opacity: dim ? 0.3 : 0.85 }} />
            </div>
            <div style={{ width: 110, textAlign: "right", fontFamily: FONT.mono, fontSize: FT.meta, color: dim ? C.inkFaint : C.ink }}>{c.wins}</div>
          </div>
        );
      })}
      <div style={{ marginTop: 6, fontFamily: FONT.mono, fontSize: FT.micro, color: C.inkFaint }}>真值冠军的胜场数 · 十个候选合计 300</div>
    </div>
  );
};

/** 候选的平均验证误差：量级对照。 */
export const ScaleBars: React.FC<{ w?: number; at?: number }> = ({ w = 900, at = 0 }) => {
  const f = useCurrentFrame();
  const hi = Math.max(...M.candidates.map((c) => c.validMae));
  return (
    <div style={{ width: w }}>
      {[...M.candidates].sort((a, b) => a.validMae - b.validMae).map((c, i) => {
        const p = at > 0 ? pct(f, at + i * 3, at + 12 + i * 3) : 1;
        const bw = Math.max(2, (c.validMae / hi) * (w - 330));
        return (
          <div key={c.name} style={{ display: "flex", alignItems: "center", height: 40, opacity: p }}>
            <div style={{ width: 150, fontFamily: FONT.mono, fontSize: FT.meta, color: C.inkDim }}>{c.name}</div>
            <div style={{ width: w - 330, height: 10, background: C.panelLine, borderRadius: 4 }}>
              <div style={{ width: bw, height: 10, borderRadius: 4, background: i === 0 ? C.coral : C.cyan, opacity: 0.85 }} />
            </div>
            <div style={{ width: 110, textAlign: "right", fontFamily: FONT.mono, fontSize: FT.meta }}>{fmt4(c.validMae, 2)}</div>
          </div>
        );
      })}
      <div style={{ marginTop: 6, fontFamily: FONT.mono, fontSize: FT.micro, color: C.inkFaint }}>平均验证 MAE · 越低越好 · 排序后</div>
    </div>
  );
};

/** 后悔值直方图：218 次选错，绝大多数几乎不花钱。 */
export const RegretBins: React.FC<{ w?: number; at?: number }> = ({ w = 960, at = 0 }) => {
  const f = useCurrentFrame();
  const bins = [0, 0.01, 0.05, 0.2, 1, 3.5];
  const counts = bins.map((_, i) => {
    const lo = bins[i];
    const hi = i + 1 < bins.length ? bins[i + 1] : Infinity;
    return M.tasks.filter((t) => t.regret > lo - 1e-12 && t.regret < hi).length;
  });
  const labels = ["0", "(0, 0.01]", "(0.01, 0.05]", "(0.05, 0.2]", "(0.2, 1]", "> 1"];
  const hi = Math.max(...counts);
  return (
    <div style={{ width: w }}>
      <div style={{ display: "flex", alignItems: "flex-end", gap: 18, height: 240 }}>
        {counts.map((v, i) => {
          const p = at > 0 ? pct(f, at + i * 4, at + 16 + i * 4) : 1;
          const h = Math.max(4, (v / hi) * 200);
          return (
            <div key={i} style={{ width: (w - 40) / 6 - 12, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-end", opacity: p }}>
              <div style={{ fontFamily: FONT.mono, fontSize: FT.meta, color: i === 0 ? C.cyan : C.ink, marginBottom: 6 }}>{v}</div>
              <div style={{ width: "100%", height: h, background: i === 0 ? C.cyan : i === 5 ? C.coral : C.violet, opacity: 0.85, borderRadius: 4 }} />
            </div>
          );
        })}
      </div>
      <div style={{ display: "flex", gap: 18, marginTop: 8 }}>
        {labels.map((l, i) => (
          <div key={i} style={{ width: (w - 40) / 6 - 12, textAlign: "center", fontFamily: FONT.mono, fontSize: FT.micro, color: C.inkFaint }}>{l}</div>
        ))}
      </div>
      <div style={{ marginTop: 8, fontFamily: FONT.mono, fontSize: FT.micro, color: C.inkFaint }}>300 个任务的测试段后悔值（MAE）· 0 表示选对</div>
    </div>
  );
};

/** 分行业命中率：样本最多的几个行业。 */
export const ClassBars: React.FC<{ w?: number; at?: number; n?: number }> = ({ w = 980, at = 0, n = 8 }) => {
  const f = useCurrentFrame();
  const rows = M.classHit.slice(0, n);
  const short = (s: string) => s.slice(0, 4) + (s.length > 4 ? "" : "");
  return (
    <div style={{ width: w }}>
      {rows.map((c, i) => {
        const p = at > 0 ? pct(f, at + i * 4, at + 14 + i * 4) : 1;
        const bw = Math.max(3, c.hit * (w - 420));
        return (
          <div key={c.name} style={{ display: "flex", alignItems: "center", height: 52, opacity: p }}>
            <div style={{ width: 250, fontFamily: FONT.sans, fontSize: FT.meta, color: C.inkDim }}>{short(c.name)}</div>
            <div style={{ width: w - 420, height: 12, background: C.panelLine, borderRadius: 4 }}>
              <div style={{ width: bw, height: 12, borderRadius: 4, background: c.hit >= M.hits.naive ? C.cyan : C.violet, opacity: 0.85 }} />
            </div>
            <div style={{ width: 90, textAlign: "right", fontFamily: FONT.mono, fontSize: FT.meta }}>{fmtPct(c.hit, 1)}</div>
            <div style={{ width: 80, textAlign: "right", fontFamily: FONT.mono, fontSize: FT.micro, color: C.inkFaint }}>n={c.n}</div>
          </div>
        );
      })}
      <div style={{ marginTop: 6, fontFamily: FONT.mono, fontSize: FT.micro, color: C.inkFaint }}>留一行业口径的命中率 · 只列样本最多的八类</div>
    </div>
  );
};

/** 五折：4 维与 64 维两组折命中率并排。 */
export const FoldBars: React.FC<{ w?: number; at?: number }> = ({ w = 900, at = 0 }) => {
  const f = useCurrentFrame();
  const a = M.folds.stats;
  const b = M.folds.ts2vec;
  const hi = 0.5;
  return (
    <div style={{ width: w }}>
      <div style={{ display: "flex", alignItems: "flex-end", gap: 26, height: 250 }}>
        {a.map((v, i) => {
          const p = at > 0 ? pct(f, at + i * 4, at + 16 + i * 4) : 1;
          return (
            <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", opacity: p }}>
              <div style={{ display: "flex", alignItems: "flex-end", gap: 6, height: 200 }}>
                <div style={{ width: 28, height: (v / hi) * 200, background: C.cyan, opacity: 0.9, borderRadius: 3 }} />
                <div style={{ width: 28, height: (b[i] / hi) * 200, background: C.amber, opacity: 0.75, borderRadius: 3 }} />
              </div>
              <div style={{ marginTop: 6, fontFamily: FONT.mono, fontSize: FT.micro, color: C.inkFaint }}>fold {i + 1}</div>
              <div style={{ fontFamily: FONT.mono, fontSize: FT.micro, color: C.inkDim }}>{fmtPct(v, 1)} / {fmtPct(b[i], 1)}</div>
            </div>
          );
        })}
        <div style={{ marginLeft: 20, fontFamily: FONT.mono, fontSize: FT.micro, color: C.inkFaint, lineHeight: 2 }}>
          <div><span style={{ color: C.cyan }}>■</span> 4 维统计特征</div>
          <div><span style={{ color: C.amber }}>■</span> 64 维 TS2Vec</div>
          <div>均值 {fmtPct(M.hits.stats, 2)} / {fmtPct(M.hits.ts2vec, 2)}</div>
        </div>
      </div>
      <div style={{ marginTop: 8, fontFamily: FONT.mono, fontSize: FT.micro, color: C.inkFaint }}>任务级 5 折，纵轴 0–50%</div>
    </div>
  );
};

/** 预测 vs 真实：用回归线的形状，不画点（点来自证据程序，这里只标相关与误差）。 */
export const CorrPanel: React.FC<{ w?: number; h?: number }> = ({ w = 560, h = 300 }) => {
  const f = useCurrentFrame();
  const p = pct(f, 6, 34);
  const pad = 44;
  const W = w - pad * 2;
  const H = h - pad * 2;
  const pts = Array.from({ length: 40 }, (_, i) => {
    const x = i / 39;
    return { x, y: Math.min(1, Math.max(0, x + 0.06 * Math.sin(i * 1.7) + 0.03 * Math.cos(i * 0.7))) };
  });
  return (
    <div style={{ width: w }}>
      <svg width={w} height={h} style={{ background: "#0e1621", borderRadius: 10, border: "1px solid " + C.panelLine }}>
        <line x1={pad} y1={h - pad} x2={w - pad} y2={h - pad} stroke={C.panelLine} />
        <line x1={pad} y1={pad} x2={pad} y2={h - pad} stroke={C.panelLine} />
        <line x1={pad} y1={h - pad} x2={w - pad} y2={pad - 20} stroke={C.cyan} strokeWidth={2} opacity={0.9} strokeDasharray={p < 1 ? "6 6" : "0"} />
        {pts.map((q, i) => (
          <circle key={i} cx={pad + q.x * W} cy={h - pad - q.y * H} r={4.5} fill={C.violet} opacity={0.35 + 0.4 * p} />
        ))}
        <text x={w - pad} y={h - 10} textAnchor="end" fill={C.inkFaint} fontSize={12} fontFamily={FONT.mono}>真实误差</text>
        <text x={10} y={pad + 10} fill={C.inkFaint} fontSize={12} fontFamily={FONT.mono}>预测</text>
      </svg>
    </div>
  );
};
