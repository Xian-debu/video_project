import React from "react";
import { useCurrentFrame } from "remotion";
import { S, TONE } from "./theme";
import type { DiagramItem } from "./types";

const W = 1440;
const H = 560;

const Label: React.FC<{ x: number; y: number; children: React.ReactNode; size?: number; fill?: string; anchor?: "start" | "middle" | "end"; weight?: number }> = ({
  x, y, children, size = 22, fill = S.dim, anchor = "middle", weight = 400,
}) => (
  <text x={x} y={y} fill={fill} fontFamily={S.font} fontSize={size} fontWeight={weight} textAnchor={anchor}>
    {children}
  </text>
);

const Arrow: React.FC<{ x1: number; y1: number; x2: number; y2: number; color?: string; dash?: boolean }> = ({
  x1, y1, x2, y2, color = S.line, dash = false,
}) => (
  <g>
    <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={2} strokeDasharray={dash ? "8 8" : undefined} />
    <path d={"M" + x2 + "," + y2 + " l-10,-6 l0,12 z"} fill={color} />
  </g>
);

const toneColor = (t?: DiagramItem["tone"]) => (t ? TONE[t].fg : S.inkDim);

/** 流水线 / 发射宽度：每一格是一个阶段，光点表示一条指令在走。 */
const Pipeline: React.FC<{ items: DiagramItem[]; frame: number }> = ({ items, frame }) => {
  const n = Math.max(1, items.length);
  const w = Math.min(224, (W - 160 - (n - 1) * 26) / n);
  const gap = 26;
  const total = n * w + (n - 1) * gap;
  const x0 = (W - total) / 2;
  const t = (frame % 140) / 140;
  const pos = t * (n - 1);
  return (
    <g>
      <Label x={W / 2} y={76} size={24} fill={S.inkDim}>一条指令在流水线里的位置</Label>
      {items.map((it, i) => {
        const x = x0 + i * (w + gap);
        const active = Math.abs(pos - i) < 0.55;
        const col = toneColor(it.tone);
        return (
          <g key={it.label}>
            <rect x={x} y={156} width={w} height={132} rx={14} fill={active ? TONE.cyan.bg : S.panel} stroke={active ? col : S.line} strokeWidth={active ? 3 : 2} />
            <Label x={x + w / 2} y={210} size={32} fill={S.ink} weight={600}>{it.label}</Label>
            <Label x={x + w / 2} y={252} size={22} fill={S.dim}>{it.value ?? ""}</Label>
            {i < n - 1 ? <Arrow x1={x + w + 4} y1={222} x2={x + w + gap - 4} y2={222} color={S.line} /> : null}
          </g>
        );
      })}
      <circle cx={x0 + pos * (w + gap) + w / 2} cy={116} r={9} fill={S.cyan} />
      <line x1={x0 + pos * (w + gap) + w / 2} y1={126} x2={x0 + pos * (w + gap) + w / 2} y2={156} stroke={S.cyan} strokeWidth={2} />
      <Label x={W / 2} y={370} size={24} fill={S.faint}>每个周期推进一格；宽度和发射宽度决定同时有多少条指令在飞</Label>
      {items[0]?.note ? <Label x={W / 2} y={430} size={26} fill={S.amber}>{items[0].note}</Label> : null}
    </g>
  );
};

/** 重命名：架构寄存器 → 映射表 → 物理寄存器。 */
const Rename: React.FC<{ items: DiagramItem[]; frame: number }> = ({ items, frame }) => {
  const rows = 7;
  const rowH = 44;
  const top = 150;
  const active = Math.floor((frame / 26) % rows);
  const xs = [180, 720, 1260];
  return (
    <g>
      <Label x={xs[0]} y={96} size={26} fill={S.inkDim}>架构寄存器</Label>
      <Label x={xs[1]} y={96} size={26} fill={S.inkDim}>重命名映射表</Label>
      <Label x={xs[2]} y={96} size={26} fill={S.inkDim}>物理寄存器堆</Label>
      {Array.from({ length: rows }).map((_, i) => {
        const y = top + i * rowH;
        const on = i === active;
        return (
          <g key={i}>
            <rect x={xs[0] - 96} y={y} width={192} height={32} rx={6} fill={on ? TONE.cyan.bg : S.panel} stroke={on ? S.cyan : S.line} />
            <Label x={xs[0]} y={y + 22} size={20} fill={on ? S.ink : S.dim}>{i < 4 ? "r" + i : "r" + i + "（忙）"}</Label>
            <line x1={xs[0] + 100} y1={y + 16} x2={xs[1] - 130} y2={y + 16} stroke={on ? S.cyan : S.line} strokeWidth={on ? 2 : 1} strokeDasharray={on ? undefined : "5 6"} />
            <rect x={xs[1] - 126} y={y} width={252} height={32} rx={6} fill={on ? "rgba(94,234,212,0.06)" : "transparent"} stroke={S.line} />
            <Label x={xs[1]} y={y + 22} size={19} fill={on ? S.cyan : S.dim}>{["p8", "p12", "p3", "p21", "p5", "p17", "p30"][i]}</Label>
            <line x1={xs[1] + 130} y1={y + 16} x2={xs[2] - 120} y2={y + 16} stroke={on ? S.cyan : S.line} strokeWidth={on ? 2 : 1} strokeDasharray={on ? undefined : "5 6"} />
            <rect x={xs[2] - 118} y={y} width={236} height={32} rx={6} fill={on ? TONE.amber.bg : S.panel} stroke={on ? S.amber : S.line} />
            <Label x={xs[2]} y={y + 22} size={20} fill={on ? S.ink : S.dim}>{["p0", "p1", "p2", "p3", "p4", "p5", "p6"][i]}</Label>
          </g>
        );
      })}
      <Label x={W / 2} y={500} size={23} fill={S.faint}>同一条架构指令每次执行可落到不同物理寄存器——依赖靠映射表解开</Label>
      {items[0]?.note ? <Label x={W / 2} y={540} size={24} fill={S.amber}>{items[0].note}</Label> : null}
    </g>
  );
};

/** 存储层次：容量与延迟同时画出来，避免只看容量。 */
const Cache: React.FC<{ items: DiagramItem[]; frame: number }> = ({ items, frame }) => {
  const rows = items.length;
  const top = 130;
  const rowH = Math.min(92, 360 / Math.max(1, rows));
  const widths = [420, 600, 790, 980];
  const t = (frame % 120) / 120;
  return (
    <g>
      <Label x={W / 2} y={76} size={24} fill={S.inkDim}>越靠上越快、越小；越靠下越慢、越大</Label>
      {items.map((it, i) => {
        const w = widths[Math.min(i, widths.length - 1)];
        const x = (W - w) / 2;
        const y = top + i * rowH;
        const active = Math.floor(t * rows) === i;
        return (
          <g key={it.label}>
            <rect x={x} y={y} width={w} height={rowH - 18} rx={12} fill={active ? TONE.cyan.bg : S.panel} stroke={active ? S.cyan : S.line} strokeWidth={active ? 3 : 2} />
            <Label x={x + 28} y={y + 33} size={24} fill={S.ink} anchor="start" weight={600}>{it.label}</Label>
            <Label x={x + 28} y={y + 60} size={19} fill={S.dim} anchor="start">{it.value ?? ""}</Label>
            {it.note ? <Label x={x + w - 28} y={y + 60} size={18} fill={S.faint} anchor="end">{it.note}</Label> : null}
          </g>
        );
      })}
      <Label x={W / 2} y={530} size={23} fill={S.faint}>光点每走一层就是一次缺失；系统优化往往是在补这条路径上的坑</Label>
      <circle cx={90} cy={top + 20 + Math.floor(t * rows) * rowH} r={8} fill={S.amber} />
    </g>
  );
};

/** 多核 NoC：2×2 节点网格，每个节点 4 核 + 4 个 L2 bank。 */
const Noc: React.FC<{ items: DiagramItem[]; frame: number }> = ({ items, frame }) => {
  const cols = 2;
  const rows = 2;
  const x0 = 620;
  const y0 = 210;
  const dx = 520;
  const dy = 190;
  const t = (frame % 200) / 200;
  const nodes = [
    { x: x0, y: y0 },
    { x: x0 + dx, y: y0 },
    { x: x0, y: y0 + dy },
    { x: x0 + dx, y: y0 + dy },
  ];
  return (
    <g>
      <Label x={W / 2} y={72} size={24} fill={S.inkDim}>2×2 网格：四个节点，十六颗核</Label>
      {nodes.map((n, i) => {
        const hot = Math.floor(t * 8) % 4 === i;
        return (
          <g key={i}>
            <rect x={n.x - 180} y={n.y - 78} width={360} height={156} rx={14} fill={hot ? TONE.cyan.bg : S.panel} stroke={hot ? S.cyan : S.line} strokeWidth={hot ? 3 : 2} />
            <Label x={n.x} y={n.y - 34} size={26} fill={S.ink}>节点 {i}</Label>
            <Label x={n.x} y={n.y + 6} size={21} fill={S.inkDim}>4 × GS464 + 4 × L2</Label>
            <Label x={n.x} y={n.y + 38} size={18} fill={S.dim}>8×8 crossbar · 4 拍</Label>
          </g>
        );
      })}
      <line x1={x0 + 184} y1={y0} x2={x0 + dx - 184} y2={y0} stroke={S.line} strokeWidth={3} />
      <line x1={x0 + 184} y1={y0 + dy} x2={x0 + dx - 184} y2={y0 + dy} stroke={S.line} strokeWidth={3} />
      <line x1={x0} y1={y0 + 82} x2={x0} y2={y0 + dy - 80} stroke={S.line} strokeWidth={3} />
      <line x1={x0 + dx} y1={y0 + 82} x2={x0 + dx} y2={y0 + dy - 80} stroke={S.line} strokeWidth={3} />
      <circle cx={x0 + dx / 2} cy={y0} r={7} fill={S.amber} />
      <circle cx={x0} cy={y0 + dy / 2} r={7} fill={S.amber} />
      <Label x={W / 2} y={510} size={23} fill={S.faint}>节点内 crossbar，节点间走四条方向；4×4 网格可扩到 64 核</Label>
      <Label x={W / 2} y={545} size={22} fill={S.amber}>四核版 = 1 个节点；八核 = 2；十六核 = 4</Label>
    </g>
  );
};

/** 二进制翻译：guest → 翻译层 → host；硬件只补最贵的语义缺口。 */
const Translation: React.FC<{ items: DiagramItem[]; frame: number }> = ({ items, frame }) => {
  const t = (frame % 120) / 120;
  const host = items[0]?.host ?? "host 指令";
  return (
    <g>
      <Label x={W / 2} y={74} size={24} fill={S.inkDim}>同一份 guest 二进制，经过翻译层落到 host 指令</Label>
      {items.map((it, i) => {
        const y = 150 + i * 108;
        const active = Math.floor(t * items.length) === i;
        const col = toneColor(it.tone);
        return (
          <g key={it.label}>
            <rect x={80} y={y} width={260} height={72} rx={12} fill={S.panel} stroke={S.line} />
            <Label x={210} y={y + 32} size={24} fill={S.ink}>{it.label}</Label>
            <Label x={210} y={y + 58} size={17} fill={S.dim}>{it.note ?? ""}</Label>
            <Arrow x1={348} y1={y + 36} x2={508} y2={y + 36} color={active ? col : S.line} />
            <rect x={516} y={y} width={430} height={72} rx={12} fill={active ? TONE.violet.bg : S.panel} stroke={active ? S.violet : S.line} strokeWidth={active ? 3 : 2} />
            <Label x={731} y={y + 32} size={24} fill={S.ink}>{it.value ?? "翻译 / 动态二进制翻译"}</Label>
            <Label x={731} y={y + 58} size={17} fill={S.dim}>语义等价 · 热点提炼 · 翻译块缓存</Label>
            <Arrow x1={954} y1={y + 36} x2={1114} y2={y + 36} color={active ? col : S.line} />
            <rect x={1122} y={y} width={260} height={72} rx={12} fill={S.panel} stroke={S.line} />
            <Label x={1252} y={y + 32} size={23} fill={S.ink}>{host}</Label>
            <Label x={1252} y={y + 58} size={17} fill={S.dim}>host 指令</Label>
          </g>
        );
      })}
      <Label x={W / 2} y={510} size={23} fill={S.faint}>硬件辅助不是把整个 ISA 搬进硅片，而是把最高频、最贵的语义缺口压下去</Label>
      {items[0]?.note ? <Label x={W / 2} y={544} size={22} fill={S.amber}>{items[0].note}</Label> : null}
    </g>
  );
};

const Isa: React.FC<{ items: DiagramItem[]; frame: number }> = ({ items, frame }) => {
  const t = (frame % 140) / 140;
  const layers = items.length ? items : [];
  return (
    <g>
      <Label x={W / 2} y={74} size={24} fill={S.inkDim}>指令系统不是一张表，而是软硬件之间的长期契约</Label>
      {layers.map((it, i) => {
        const y = 130 + i * 72;
        const active = Math.floor(t * layers.length) === i;
        return (
          <g key={it.label}>
            <rect x={240} y={y} width={960} height={54} rx={8} fill={active ? TONE.amber.bg : S.panel} stroke={active ? S.amber : S.line} />
            <Label x={720} y={y + 35} size={24} fill={S.ink}>{it.label}</Label>
            {it.value ? <Label x={1160} y={y + 35} size={18} fill={S.dim} anchor="end">{it.value}</Label> : null}
          </g>
        );
      })}
      <line x1={200} y1={394} x2={1240} y2={394} stroke={S.coral} strokeWidth={3} strokeDasharray="10 8" />
      <Label x={1248} y={388} size={20} fill={S.coral} anchor="start">ISA 边界</Label>
      <Label x={W / 2} y={492} size={23} fill={S.faint}>换掉这条边界，上层的二进制就要重编；兼容性产业价值正来自这里</Label>
      {items[0]?.note ? <Label x={W / 2} y={532} size={22} fill={S.amber}>{items[0].note}</Label> : null}
    </g>
  );
};

/** 五条线总览：横轴六个年份，纵轴五条继承线。 */
const Lineage: React.FC<{ items: DiagramItem[]; frame: number }> = ({ items, frame }) => {
  const xs = [250, 430, 610, 790, 970, 1150];
  const rows = ["乱序核模板", "指令系统", "二进制翻译", "存储层次", "并行度"];
  const activeCol = Math.min(5, Math.floor((frame / 90) % 6));
  return (
    <g>
      <Label x={W / 2} y={58} size={22} fill={S.inkDim}>五个继承方向，在同一张时间线上反复出现</Label>
      {["2003", "2005", "2006", "2009", "2015", "2023"].map((y, i) => (
        <g key={y}>
          <Label x={xs[i]} y={104} size={20} fill={i === activeCol ? S.cyan : S.faint}>{y}</Label>
          <line x1={xs[i]} y1={120} x2={xs[i]} y2={460} stroke={i === activeCol ? S.cyan : S.line} strokeWidth={i === activeCol ? 2 : 1} strokeDasharray={i === activeCol ? undefined : "4 8"} />
        </g>
      ))}
      {rows.map((r, ri) => (
        <g key={r}>
          <Label x={120} y={160 + ri * 68} size={21} fill={S.dim} anchor="start">{r}</Label>
          <line x1={210} y1={150 + ri * 68} x2={1200} y2={150 + ri * 68} stroke={S.line} />
          {xs.map((x, ci) => (
            <circle key={ci} cx={x} cy={150 + ri * 68} r={ci === activeCol ? 8 : 5} fill={ci === activeCol ? S.amber : S.faint} />
          ))}
        </g>
      ))}
      <Label x={W / 2} y={520} size={23} fill={S.faint}>同一套乱序核骨架被反复扩参；ISA 与翻译则是另一条更慢、更难的路</Label>
      {items[0]?.note ? <Label x={W / 2} y={548} size={21} fill={S.amber}>{items[0].note}</Label> : null}
    </g>
  );
};



/** Cache 别名：两个虚地址索引到不同行，却映射同一个物理页。 */
const Alias: React.FC<{ items: DiagramItem[]; frame: number }> = ({ items, frame }) => {
  const pulse = 0.5 + 0.5 * Math.sin(frame / 18);
  const va = [
    { x: 190, y: 150, name: "虚地址 A", bits: "索引位 (13..12) = 01", tint: TONE.cyan },
    { x: 190, y: 300, name: "虚地址 B", bits: "索引位 (13..12) = 10", tint: TONE.amber },
  ];
  const lines = [
    { x: 900, y: 150, name: "Cache 行 01", tint: TONE.cyan },
    { x: 900, y: 300, name: "Cache 行 10", tint: TONE.amber },
  ];
  return (
    <g>
      <Label x={W / 2} y={64} size={23} fill={S.inkDim}>同一个物理页，被两个虚地址各缓存了一份</Label>
      {va.map((v, i) => (
        <g key={v.name}>
          <rect x={v.x} y={v.y} width={330} height={96} rx={12} fill={S.panel} stroke={v.tint.fg} strokeWidth={2.5} />
          <Label x={v.x + 165} y={v.y + 38} size={26} fill={S.ink} weight={600}>{v.name}</Label>
          <Label x={v.x + 165} y={v.y + 72} size={19} fill={S.dim}>{v.bits}</Label>
          <Arrow x1={v.x + 334} y1={v.y + 48} x2={lines[i].x - 8} y2={lines[i].y + 48} color={v.tint.fg} />
        </g>
      ))}
      <rect x={540} y={198} width={300} height={150} rx={14} fill="rgba(94,234,212,0.05)" stroke={S.line} />
      <Label x={690} y={248} size={24} fill={S.ink} weight={600}>同一物理页</Label>
      <Label x={690} y={282} size={19} fill={S.dim}>物理地址低 14 位相同</Label>
      <Label x={690} y={318} size={17} fill={S.faint}>硬件不维护一致性</Label>
      <line x1={520} y1={246} x2={470} y2={246} stroke={S.line} strokeDasharray="6 6" />
      <line x1={860} y1={300} x2={896} y2={300} stroke={S.line} strokeDasharray="6 6" />
      {lines.map((l) => (
        <g key={l.name}>
          <rect x={l.x} y={l.y} width={340} height={96} rx={12} fill={TONE.coral.bg} stroke={l.tint.fg} strokeWidth={2.5} opacity={0.55 + 0.4 * pulse} />
          <Label x={l.x + 170} y={l.y + 38} size={25} fill={S.ink} weight={600}>{l.name}</Label>
          <Label x={l.x + 170} y={l.y + 72} size={19} fill={S.dim}>tag 相同，数据可能过期</Label>
        </g>
      ))}
      <Label x={W / 2} y={466} size={22} fill={TONE.coral.fg}>两个副本各自更新，读到的可能是旧值</Label>
      <Label x={W / 2} y={510} size={21} fill={S.faint}>页着色让两个虚地址的颜色位一致；大页则直接消掉索引位的差异</Label>
      {items[0]?.note ? <Label x={W / 2} y={544} size={21} fill={S.amber}>{items[0].note}</Label> : null}
    </g>
  );
};

export const Diagram: React.FC<{ variant: string; items: DiagramItem[] }> = ({ variant, items }) => {
  const frame = useCurrentFrame();
  switch (variant) {
    case "pipeline": return <Pipeline items={items} frame={frame} />;
    case "rename": return <Rename items={items} frame={frame} />;
    case "cache": return <Cache items={items} frame={frame} />;
    case "noc": return <Noc items={items} frame={frame} />;
    case "translation": return <Translation items={items} frame={frame} />;
    case "isa": return <Isa items={items} frame={frame} />;
    case "lineage": return <Lineage items={items} frame={frame} />;
    case "alias": return <Alias items={items} frame={frame} />;
    default: return <Label x={W / 2} y={H / 2} size={24} fill={S.dim}>unknown diagram: {variant}</Label>;
  }
};
