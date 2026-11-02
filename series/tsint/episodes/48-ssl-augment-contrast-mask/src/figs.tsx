import React from "react";
import { C, FONT, FT } from "../design/tokens";
import { clamp, fmt4, fmt2, M, CLASS_ARROW } from "./shared";

const W = (n: number) => Math.round(n * 100) / 100;

/* ---------------- 一条窗口：60 个对数收益 ---------------- */

export const SeriesFig: React.FC<{
  width: number; height?: number; series: number[]; color?: string;
  second?: number[]; secondColor?: string;
  maskIdx?: number[]; blockIdx?: number[]; title?: string; note?: string;
}> = ({ width, series, height = 300, color = C.cyan, second, secondColor = C.violet, maskIdx, blockIdx, title, note }) => {
  const padL = 54, padR = 18, padT = title ? 44 : 16, padB = 30;
  const w = width - padL - padR, h = height - padT - padB;
  const all = second ? series.concat(second) : series;
  const lo = Math.min(...all), hi = Math.max(...all);
  const X = (i: number) => padL + (w * i) / (series.length - 1);
  const Y = (v: number) => padT + h - (h * (v - lo)) / (hi - lo || 1);
  const line = (s: number[]) => s.map((v, i) => (i ? "L" : "M") + W(X(i)) + " " + W(Y(v))).join(" ");
  return (
    <svg width={width} height={height} style={{ fontFamily: FONT.mono }}>
      {title && <text x={padL} y={26} fill={C.inkDim} fontSize={FT.micro}>{title}</text>}
      <line x1={padL} x2={width - padR} y1={Y(0)} y2={Y(0)} stroke={C.panelLine} strokeWidth={1} />
      {blockIdx && blockIdx.length > 0 && (
        <rect x={X(blockIdx[0]) - 4} y={padT} width={X(blockIdx[blockIdx.length - 1]) - X(blockIdx[0]) + 8} height={h}
          fill={C.amber} opacity={0.09} />
      )}
      {second && <path d={line(second)} fill="none" stroke={secondColor} strokeWidth={2.2} opacity={0.9} />}
      <path d={line(series)} fill="none" stroke={color} strokeWidth={2.2} />
      {maskIdx && maskIdx.map((i) => (
        <circle key={i} cx={X(i)} cy={Y(series[i])} r={4.6} fill={C.bg} stroke={C.amber} strokeWidth={2} />
      ))}
      <text x={padL} y={height - 8} fill={C.inkFaint} fontSize={FT.micro}>第 1 天</text>
      <text x={width - padR} y={height - 8} textAnchor="end" fill={C.inkFaint} fontSize={FT.micro}>{series.length} 天</text>
      {note && <text x={width - padR} y={title ? 26 : 16} textAnchor="end" fill={C.inkFaint} fontSize={FT.micro}>{note}</text>}
    </svg>
  );
};

/* ---------------- 四种增强：一条原曲线 + 四条变体 ---------------- */

const MiniPair: React.FC<{ w: number; h: number; base: number[]; aug: number[]; color: string; name: string; sub: string }> = ({ w, h, base, aug, color, name, sub }) => {
  const pad = 26;
  const all = base.concat(aug);
  const lo = Math.min(...all), hi = Math.max(...all);
  const X = (i: number) => pad + ((w - pad * 2) * i) / (base.length - 1);
  const Y = (v: number) => 30 + (h - 60) - ((h - 60) * (v - lo)) / (hi - lo || 1);
  const d = (s: number[]) => s.map((v, i) => (i ? "L" : "M") + W(X(i)) + " " + W(Y(v))).join(" ");
  return (
    <div style={{ width: w }}>
      <svg width={w} height={h} style={{ fontFamily: FONT.mono }}>
        <path d={d(base)} fill="none" stroke={C.inkFaint} strokeWidth={1.4} opacity={0.75} />
        <path d={d(aug)} fill="none" stroke={color} strokeWidth={2} />
      </svg>
      <div style={{ fontSize: FT.small, color: C.ink, marginTop: 2 }}>{name}</div>
      <div style={{ fontSize: FT.micro, color: C.inkFaint, fontFamily: FONT.mono }}>{sub}</div>
    </div>
  );
};

export const AugQuadFig: React.FC<{ width: number }> = ({ width }) => {
  const g = 14;
  const cw = (width - g) / 2;
  const ch = 132;
  const d = M.demo;
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: g, width }}>
      <MiniPair w={cw} h={ch} base={d.base} aug={d.jitter} color={C.cyan} name="抖动 Jitter" sub={"σ = " + M.augment.jitterSigma + " · 每点小幅扰动"} />
      <MiniPair w={cw} h={ch} base={d.base} aug={d.scaling} color={C.cyan} name="缩放 Scaling" sub={"σγ = " + M.augment.scalingSigma + " · 整体乘一个系数"} />
      <MiniPair w={cw} h={ch} base={d.base} aug={d.warp} color={C.amber} name="时间弯曲 Warp" sub={M.augment.warpPct + " 个百分点 · 数轴被拉扯"} />
      <MiniPair w={cw} h={ch} base={d.base} aug={d.flip} color={C.violet} name="翻转 Flip" sub="整段倒过来 · 不改变分布" />
    </div>
  );
};

/* ---------------- 对比：anchor 与四个候选 ---------------- */

const candName = ["正例 · 同一条的增强", "负例 · 别的窗口 1", "负例 · 别的窗口 2", "负例 · 别的窗口 3"];

export const SimFig: React.FC<{ width: number }> = ({ width }) => {
  const d = M.demo;
  const rowH = 58;
  const labelW = 260;
  const bw = width - labelW - 250;
  const simMax = 1.1;
  const bar = (v: number, i: number) => {
    const isPos = i === 0;
    const w = Math.max(2, (Math.abs(v) / simMax) * bw);
    return (
      <div style={{ display: "flex", alignItems: "center", height: rowH, gap: 14 }}>
        <div style={{ width: labelW, fontSize: FT.small, color: isPos ? C.cyan : C.inkDim }}>{candName[i]}</div>
        <div style={{ width: bw, height: 18, position: "relative", background: "rgba(255,255,255,0.04)", borderRadius: 4 }}>
          <div style={{ position: "absolute", left: v >= 0 ? bw / 2 : bw / 2 - w, top: 0, width: w, height: 18, borderRadius: 4, background: isPos ? C.cyan : C.inkFaint, opacity: isPos ? 0.95 : 0.7 }} />
        </div>
        <div style={{ width: 90, textAlign: "right", fontFamily: FONT.mono, fontSize: FT.small, color: isPos ? C.cyan : C.inkDim }}>{v.toFixed(4)}</div>
        <div style={{ width: 120, textAlign: "right", fontFamily: FONT.mono, fontSize: FT.small, color: isPos ? C.cyan : C.violet }}>{d.weights[i].toFixed(4)}</div>
      </div>
    );
  };
  return (
    <div style={{ width }}>
      <div style={{ display: "flex", alignItems: "center", height: 34, gap: 14, fontSize: FT.micro, color: C.inkFaint, fontFamily: FONT.mono }}>
        <div style={{ width: labelW }}>候选</div>
        <div style={{ width: bw }}>余弦相似度（中线为 0）</div>
        <div style={{ width: 90, textAlign: "right" }}>相似度</div>
        <div style={{ width: 120, textAlign: "right" }}>softmax 权重</div>
      </div>
      {d.sims.map((v, i) => <div key={i}>{bar(v, i)}</div>)}
      <div style={{ fontFamily: FONT.mono, fontSize: FT.micro, color: C.inkFaint, marginTop: 6 }}>
        加权损失 −ln {d.weights[0].toFixed(4)} = {d.loss.toFixed(4)} · 温度 τ = {d.tau}
      </div>
    </div>
  );
};

/* ---------------- 编码器与参数 ---------------- */

export const EncoderFig: React.FC<{ width: number }> = ({ width }) => {
  const boxes = [
    { top: "输入窗口", mid: "60 × 1", bot: "对数收益" },
    { top: "线性 + tanh", mid: "60 → 32", bot: "1952 参数" },
    { top: "线性 + tanh", mid: "32 → 32", bot: "1056 参数" },
    { top: "输出 z", mid: "32 维", bot: "探针的输入" },
  ];
  const bw = (width - 36 * 3) / 4;
  return (
    <div style={{ display: "flex", width, gap: 36, alignItems: "stretch" }}>
      {boxes.map((b, i) => (
        <React.Fragment key={i}>
          <div style={{ width: bw, border: "1px solid " + (i === 3 ? C.cyan + "88" : C.panelLine), borderRadius: 8, padding: "12px 14px", background: i === 3 ? "rgba(94,234,212,0.06)" : "transparent" }}>
          <div style={{ fontSize: FT.micro, color: C.inkFaint }}>{b.top}</div>
          <div style={{ fontSize: FT.h3, color: i === 3 ? C.cyan : C.ink, fontFamily: FONT.mono, marginTop: 6 }}>{b.mid}</div>
          <div style={{ fontSize: FT.micro, color: C.inkFaint, marginTop: 4 }}>{b.bot}</div>
          </div>
          {i < 3 && <div style={{ alignSelf: "center", color: C.inkFaint, fontSize: 22 }}>›</div>}
        </React.Fragment>
      ))}
    </div>
  );
};

export const ParamFig: React.FC<{ width: number }> = ({ width }) => {
  const rows = [
    { name: "编码器", total: M.contrast.params, parts: [[60 * 32 + 32, C.cyan], [32 * 32 + 32, C.violet]] as [number, string][], note: "60→32 · 1952 ＋ 32→32 · 1056" },
    { name: "掩码网", total: M.mask.params, parts: [[32 * 120 + 32, C.amber], [60 * 32 + 60, C.violet]] as [number, string][], note: "60+60→32 · 3872 ＋ 32→60 · 1980" },
  ];
  const max = Math.max(...rows.map((r) => r.total));
  const labelW = 120, numW = 110, bw = width - labelW - numW;
  return (
    <div style={{ width }}>
      {rows.map((r, i) => (
        <div key={i} style={{ marginBottom: 26 }}>
          <div style={{ display: "flex", alignItems: "center" }}>
            <div style={{ width: labelW, fontSize: FT.small, color: C.ink }}>{r.name}</div>
            <div style={{ width: bw, height: 20, display: "flex", borderRadius: 4, overflow: "hidden" }}>
              {r.parts.map(([n, col], k) => <div key={k} style={{ width: (n / max) * bw, background: col, height: 20 }} />)}
            </div>
            <div style={{ width: numW, textAlign: "right", fontFamily: FONT.mono, fontSize: FT.small, color: C.ink }}>{r.total.toLocaleString("en-US")}</div>
          </div>
          <div style={{ marginLeft: labelW, marginTop: 6, fontSize: FT.micro, color: C.inkFaint, fontFamily: FONT.mono }}>{r.note}</div>
        </div>
      ))}
    </div>
  );
};

/* ---------------- 损失曲线（两点 + 中间插值示意） ---------------- */

const LossPanel: React.FC<{ w: number; h: number; start: number; end: number; color: string; label: string; decimals: number; log?: boolean }> = ({ w, h, start, end, color, label, decimals, log }) => {
  const padL = 62, padR = 14, padT = 30, padB = 26;
  const iw = w - padL - padR, ih = h - padT - padB;
  const f = (t: number) => (log ? Math.pow(end / start, t) * start : start + (end - start) * Math.pow(t, 1.35));
  const pts = Array.from({ length: 40 }, (_, k) => f(k / 39));
  const lo = Math.min(...pts), hi = Math.max(...pts);
  const X = (i: number) => padL + (iw * i) / 39;
  const Y = (v: number) => padT + ih - (ih * (v - lo)) / (hi - lo || 1);
  const d = pts.map((v, i) => (i ? "L" : "M") + W(X(i)) + " " + W(Y(v))).join(" ");
  return (
    <div style={{ width: w }}>
      <svg width={w} height={h} style={{ fontFamily: FONT.mono }}>
        <path d={d} fill="none" stroke={color} strokeWidth={2.6} />
        <text x={padL} y={18} fill={C.inkDim} fontSize={FT.micro}>{label}</text>
        <text x={w - padR} y={padT + 10} textAnchor="end" fill={color} fontSize={FT.small}>{start.toFixed(decimals)}</text>
        <text x={w - padR} y={h - 6} textAnchor="end" fill={color} fontSize={FT.small}>{end.toFixed(decimals)}</text>
        <text x={padL} y={h - 6} fill={C.inkFaint} fontSize={FT.micro}>第 1 轮</text>
      </svg>
    </div>
  );
};

export const LossFig: React.FC<{ width: number }> = ({ width }) => (
  <div style={{ display: "flex", gap: 18, width }}>
    <LossPanel w={(width - 18) / 2} h={250} start={M.contrast.lossStart} end={M.contrast.lossEnd} color={C.violet} label="对比损失 InfoNCE" decimals={4} />
    <LossPanel w={(width - 18) / 2} h={250} start={M.mask.lossStart} end={M.mask.lossEnd} color={C.amber} label="重构损失（掩码位）" decimals={4} log />
  </div>
);

/* ---------------- 准确率：增强 vs 基线、三种编码器 ---------------- */

export const AugAccFig: React.FC<{ width: number }> = ({ width }) => {
  const rows = M.probeTable;
  const rowH = 56, labelW = 200, numW = 110, bw = width - labelW - numW;
  const max = 1;
  const nameMap: Record<string, string> = { none: "无增强", jitter: "抖动", scaling: "缩放", flip: "翻转", warp: "时间弯曲" };
  return (
    <div style={{ width }}>
      {rows.map((r, i) => {
        const low = r.acc < M.data.baseline;
        const col = low ? C.coral : r.acc > M.data.baseline ? C.cyan : C.inkFaint;
        return (
          <div key={i} style={{ display: "flex", alignItems: "center", height: rowH }}>
            <div style={{ width: labelW, fontSize: FT.small, color: C.ink }}>{nameMap[r.aug] ?? r.aug}</div>
            <div style={{ width: bw, height: 18, position: "relative" }}>
              <div style={{ position: "absolute", left: 0, top: 6, height: 6, width: bw, background: "rgba(255,255,255,0.05)", borderRadius: 3 }} />
              <div style={{ position: "absolute", left: 0, top: 4, height: 10, width: (r.acc / max) * bw, background: col, borderRadius: 3, opacity: 0.9 }} />
              <div style={{ position: "absolute", left: (M.data.baseline / max) * bw, top: -2, width: 2, height: 22, background: C.coral, opacity: 0.85 }} />
            </div>
            <div style={{ width: numW, textAlign: "right", fontFamily: FONT.mono, fontSize: FT.small, color: col }}>{fmt2(r.acc)}</div>
          </div>
        );
      })}
      <div style={{ fontSize: FT.micro, color: C.inkFaint, fontFamily: FONT.mono, marginTop: 4 }}>红线 = 多数类基线 {fmt2(M.data.baseline)}</div>
    </div>
  );
};

export const ProbeCompareFig: React.FC<{ width: number }> = ({ width }) => {
  const rows = [
    { name: "对比编码器", acc: M.contrast.probeAcc, n: M.contrast.correct, color: C.violet, note: "InfoNCE 预训练" },
    { name: "掩码编码器", acc: M.mask.probeAcc, n: M.mask.correct, color: C.amber, note: "掩码重构预训练" },
    { name: "未训练编码器", acc: M.control.untrainedProbe, n: M.control.untrainedCorrect, color: C.inkFaint, note: "随机初始化" },
    { name: "标签错位对照", acc: M.control.shuffledProbe, n: M.control.shuffledCorrect, color: C.coral, note: "编码器不变，标签打乱" },
  ];
  const rowH = 62, labelW = 210, numW = 150, bw = width - labelW - numW;
  return (
    <div style={{ width }}>
      {rows.map((r, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", height: rowH }}>
          <div style={{ width: labelW }}>
            <div style={{ fontSize: FT.small, color: C.ink }}>{r.name}</div>
            <div style={{ fontSize: FT.micro, color: C.inkFaint }}>{r.note}</div>
          </div>
          <div style={{ width: bw, height: 20, position: "relative" }}>
            <div style={{ position: "absolute", left: 0, top: 6, height: 8, width: bw, background: "rgba(255,255,255,0.05)", borderRadius: 4 }} />
            <div style={{ position: "absolute", left: 0, top: 3, height: 14, width: r.acc * bw, background: r.color, borderRadius: 4 }} />
            <div style={{ position: "absolute", left: M.data.baseline * bw, top: -3, width: 2, height: 26, background: C.coral }} />
          </div>
          <div style={{ width: numW, textAlign: "right", fontFamily: FONT.mono, fontSize: FT.small, color: r.color }}>
            {fmt2(r.acc)} <span style={{ color: C.inkFaint }}>({r.n}/{M.data.testProbe})</span>
          </div>
        </div>
      ))}
      <div style={{ fontSize: FT.micro, color: C.inkFaint, fontFamily: FONT.mono }}>红线 = 多数类基线 {fmt2(M.data.baseline)} · 测试 {M.data.testProbe} 条，一条 5 个百分点</div>
    </div>
  );
};

/* ---------------- 掩码：60 格条、双通道输入 ---------------- */

export const MaskStripFig: React.FC<{ width: number }> = ({ width }) => {
  const n = M.data.length;
  const cell = (width - 5 * (n - 1)) / n;
  const inMask = new Set(M.demo.maskIdx);
  const inBlock = new Set(M.demo.blockIdx);
  return (
    <div style={{ width }}>
      <div style={{ display: "flex", gap: 5 }}>
        {Array.from({ length: n }, (_, i) => {
          const hit = inMask.has(i) || inBlock.has(i);
          const col = inBlock.has(i) ? C.violet : inMask.has(i) ? C.amber : "rgba(94,234,212,0.30)";
          return <div key={i} style={{ width: cell, height: 30, borderRadius: 3, background: col }} />;
        })}
      </div>
      <div style={{ display: "flex", gap: 24, marginTop: 10, fontSize: FT.micro, fontFamily: FONT.mono, color: C.inkFaint }}>
        <span><span style={{ color: C.amber }}>■</span> 随机点 {M.demo.maskIdx.length} 个（15%）</span>
        <span><span style={{ color: C.violet }}>■</span> 连续块 {M.demo.blockIdx.length} 个（10%）</span>
        <span>平均掩码率 {M.augment.meanMaskRate.toFixed(4)}</span>
      </div>
    </div>
  );
};

export const MaskInputFig: React.FC<{ width: number }> = ({ width }) => {
  const T = M.data.length;
  const masked = M.demo.masked;
  const cell = (width - 2 * (2 * T - 1)) / (2 * T);
  return (
    <div style={{ width }}>
      <div style={{ fontSize: FT.micro, color: C.inkFaint, fontFamily: FONT.mono, marginBottom: 6 }}>前 60 位：被遮处填 0，其余保留</div>
      <div style={{ display: "flex", gap: 2 }}>
        {Array.from({ length: T }, (_, i) => (
          <div key={i} style={{ width: cell, height: 26, borderRadius: 2, background: masked[i] === 0 ? C.amber : "rgba(94,234,212,0.45)" }} />
        ))}
      </div>
      <div style={{ fontSize: FT.micro, color: C.inkFaint, fontFamily: FONT.mono, margin: "10px 0 6px" }}>后 60 位：0/1 标记，告诉网络哪里被挖掉</div>
      <div style={{ display: "flex", gap: 2 }}>
        {Array.from({ length: T }, (_, i) => (
          <div key={i} style={{ width: cell, height: 26, borderRadius: 2, background: masked[T + i] > 0 ? C.violet : "rgba(255,255,255,0.10)" }} />
        ))}
      </div>
    </div>
  );
};

/* ---------------- 数据规模与类别 ---------------- */

export const CountFig: React.FC<{ width: number }> = ({ width }) => {
  const items = [
    { k: "无标签窗口", v: "1,000", n: "预训练用" },
    { k: "有标签", v: "50", n: "线性探针" },
    { k: "候选窗口", v: "32,878", n: "切窗后" },
    { k: "股票池", v: String(M.data.withWindows), n: "有窗口的" },
  ];
  const cw = (width - 3 * 16) / 4;
  return (
    <div style={{ display: "flex", gap: 16, width }}>
      {items.map((it, i) => (
        <div key={i} style={{ width: cw, border: "1px solid " + C.panelLine, borderRadius: 8, padding: "14px 16px" }}>
          <div style={{ fontSize: FT.micro, color: C.inkFaint }}>{it.k}</div>
          <div style={{ fontSize: FT.h2, fontFamily: FONT.mono, color: i < 2 ? C.cyan : C.ink, marginTop: 4 }}>{it.v}</div>
          <div style={{ fontSize: FT.micro, color: C.inkFaint, marginTop: 4 }}>{it.n}</div>
        </div>
      ))}
    </div>
  );
};

export const ClassFig: React.FC<{ width: number }> = ({ width }) => {
  const total = M.data.probe;
  const max = Math.max(...M.data.classes);
  const rowH = 58, labelW = 120, numW = 120, bw = width - labelW - numW;
  const cols = [C.cyan, C.violet, C.amber];
  return (
    <div style={{ width }}>
      {M.data.classes.map((n, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", height: rowH }}>
          <div style={{ width: labelW, fontSize: FT.small, color: C.ink }}>{CLASS_ARROW[i]}</div>
          <div style={{ width: bw, height: 18, position: "relative" }}>
            <div style={{ position: "absolute", left: 0, top: 6, height: 6, width: bw, background: "rgba(255,255,255,0.05)", borderRadius: 3 }} />
            <div style={{ position: "absolute", left: 0, top: 3, height: 12, width: (n / total) * bw, background: cols[i % 3], borderRadius: 3 }} />
          </div>
          <div style={{ width: numW, textAlign: "right", fontFamily: FONT.mono, fontSize: FT.small, color: C.ink }}>{n} / {total}</div>
        </div>
      ))}
      <div style={{ fontSize: FT.micro, color: C.inkFaint, fontFamily: FONT.mono }}>多数类基线 = {fmt2(M.data.baseline)}（{M.data.classes[0]}/{total}）</div>
    </div>
  );
};

/* ---------------- 边界：窗口重叠、20 格成绩 ---------------- */

export const OverlapFig: React.FC<{ width: number }> = ({ width }) => {
  const h = 220;
  const stride = M.data.stride;
  const T = M.data.length;
  const rows = 4;
  const left = 92;
  const iw = width - left - 20;
  const dayW = iw / 180;
  const names = ["样本 k", "样本 k+1", "样本 k+2", "样本 k+3"];
  return (
    <svg width={width} height={h} style={{ fontFamily: FONT.mono }}>
      {Array.from({ length: rows }, (_, r) => {
        const x = left + r * stride * dayW;
        return (
          <g key={r}>
            <text x={0} y={44 + r * 44} fill={C.inkDim} fontSize={FT.micro}>{names[r]}</text>
            <rect x={x} y={28 + r * 44} width={T * dayW} height={24} rx={4} fill={C.cyan} opacity={0.18 + r * 0.05} stroke={C.cyan} strokeWidth={0.8} />
          </g>
        );
      })}
      <text x={left} y={206} fill={C.inkFaint} fontSize={FT.micro}>步长 {stride} 天 · 60 天窗口 → 每条相邻样本共享 {T - stride} 天</text>
      <text x={left} y={18} fill={C.inkFaint} fontSize={FT.micro}>同一只股票的 180 天</text>
    </svg>
  );
};

export const Grid20Fig: React.FC<{ width: number }> = ({ width }) => {
  const n = M.data.testProbe;
  const gap = 10;
  const cell = (width - gap * (n - 1)) / n;
  const rows = [
    { name: "对比编码器", n: M.contrast.correct, color: C.violet },
    { name: "掩码编码器", n: M.mask.correct, color: C.amber },
  ];
  return (
    <div style={{ width }}>
      {rows.map((r, k) => (
        <div key={k} style={{ marginBottom: 16 }}>
          <div style={{ fontSize: FT.micro, color: C.inkFaint, fontFamily: FONT.mono, marginBottom: 6 }}>{r.name}：{r.n} / {n} 正确</div>
          <div style={{ display: "flex", gap }}>
            {Array.from({ length: n }, (_, i) => (
              <div key={i} style={{ width: cell, height: 26, borderRadius: 3, background: i < r.n ? r.color : "rgba(255,255,255,0.10)" }} />
            ))}
          </div>
        </div>
      ))}
      <div style={{ fontSize: FT.micro, color: C.inkFaint, fontFamily: FONT.mono }}>一格 = 1/{n} = {fmt2(100 / n)} 个百分点</div>
    </div>
  );
};

/* ---------------- 三张成绩单 ---------------- */

export const ThreeUpFig: React.FC<{ width: number }> = ({ width }) => {
  const cards = [
    { name: "对比编码器", v: fmt2(M.contrast.probeAcc), n: "InfoNCE · 3008 参数", color: C.violet },
    { name: "掩码编码器", v: fmt2(M.mask.probeAcc), n: "重构 15%+10% · 5852 参数", color: C.amber },
    { name: "未训练", v: fmt2(M.control.untrainedProbe), n: "随机初始化", color: C.inkFaint },
  ];
  const cw = (width - 2 * 16) / 3;
  return (
    <div style={{ display: "flex", gap: 16, width }}>
      {cards.map((c, i) => (
        <div key={i} style={{ width: cw, border: "1px solid " + c.color + "66", borderRadius: 10, padding: "16px 18px", background: "rgba(11,15,20,0.35)" }}>
          <div style={{ fontSize: FT.small, color: C.ink }}>{c.name}</div>
          <div style={{ fontSize: 52, fontFamily: FONT.mono, color: c.color, marginTop: 8 }}>{c.v}</div>
          <div style={{ fontSize: FT.micro, color: C.inkFaint, marginTop: 6 }}>{c.n}</div>
        </div>
      ))}
    </div>
  );
};

/* ---------------- 组检查条数 ---------------- */

export const GroupCountFig: React.FC<{ width: number }> = ({ width }) => {
  const groups = [
    { g: "data", n: 5, name: "数据" },
    { g: "augment", n: 5, name: "增强" },
    { g: "contrast", n: 6, name: "对比" },
    { g: "mask", n: 5, name: "掩码" },
    { g: "control", n: 4, name: "对照" },
    { g: "train", n: 3, name: "训练" },
  ];
  const max = 6;
  const labelW = 130, numW = 70, bw = width - labelW - numW;
  const cols = [C.cyan, C.cyan, C.violet, C.amber, C.coral, C.inkFaint];
  return (
    <div style={{ width }}>
      {groups.map((g, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", height: 44 }}>
          <div style={{ width: labelW, fontSize: FT.small, color: C.ink }}>{g.name} <span style={{ color: C.inkFaint, fontFamily: FONT.mono }}>{g.g}</span></div>
          <div style={{ width: bw, height: 14, position: "relative" }}>
            <div style={{ position: "absolute", left: 0, top: 5, height: 4, width: bw, background: "rgba(255,255,255,0.05)" }} />
            <div style={{ position: "absolute", left: 0, top: 2, height: 10, width: (g.n / max) * bw, background: cols[i], borderRadius: 2 }} />
          </div>
          <div style={{ width: numW, textAlign: "right", fontFamily: FONT.mono, fontSize: FT.small, color: C.ink }}>{g.n}</div>
        </div>
      ))}
    </div>
  );
};

/* ---------------- tau 与黄金值 ---------------- */

export const TauFig: React.FC<{ width: number }> = ({ width }) => {
  const rows = [
    { name: "τ = 0.2（本集）", v: M.contrast.infoNce, color: C.violet },
    { name: "τ 再小一档", v: 0.0003, color: C.violet },
    { name: "均匀分布 B=3", v: M.contrast.uniform, color: C.inkFaint },
  ];
  const rowH = 56, labelW = 260, numW = 120, bw = width - labelW - numW;
  const max = 1.2;
  return (
    <div style={{ width }}>
      {rows.map((r, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", height: rowH }}>
          <div style={{ width: labelW, fontSize: FT.small, color: C.ink }}>{r.name}</div>
          <div style={{ width: bw, height: 18, position: "relative" }}>
            <div style={{ position: "absolute", left: 0, top: 6, height: 6, width: bw, background: "rgba(255,255,255,0.05)", borderRadius: 3 }} />
            <div style={{ position: "absolute", left: 0, top: 3, height: 12, width: (r.v / max) * bw, background: r.color, borderRadius: 3 }} />
          </div>
          <div style={{ width: numW, textAlign: "right", fontFamily: FONT.mono, fontSize: FT.small, color: r.color }}>{r.v.toFixed(4)}</div>
        </div>
      ))}
      <div style={{ fontSize: FT.micro, color: C.inkFaint, fontFamily: FONT.mono }}>−ln(e/(e+2)) = {M.contrast.infoNce.toFixed(4)} · ln 3 = {M.contrast.uniform.toFixed(4)}</div>
    </div>
  );
};
