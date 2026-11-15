import React from "react";
import { useCurrentFrame } from "remotion";
import { C, FONT, FT, FT_T } from "../../design/tokens";
import { Body, Card, EV, Head, Mono, Num, PAD, Scene, beatAt, beatFrames, pct } from "../shared";
import { SCENES } from "../script";

/* 13 结语：把判据搬到产生数据的地方——一个 patch 级判据同时指导采样、传输、计算。 */

const E2E = (EV.values.speedup as { e2e: number }).e2e;

const BRANCHES = [
  { name: "采样", note: "读出之前就决定采不采" },
  { name: "传输", note: "按判据压缩，再送出去" },
  { name: "计算", note: "只把要算的 patch 送进网络" },
];

const SumCard: React.FC<{ label: string; left: number; at: number; children: React.ReactNode }> = ({ label, left, at, children }) => {
  const f = useCurrentFrame();
  return (
    <Card
      label={label}
      accent={C.cyanDeep}
      pad={18}
      style={{ position: "absolute", left, top: 728, width: 576, height: 148, boxSizing: "border-box", opacity: pct(f, at, at + 12) }}
    >
      {children}
    </Card>
  );
};

const Headline: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div style={{ fontFamily: FONT.sans, fontSize: FT.h2, color: C.ink, lineHeight: 1.3 }}>{children}</div>
);

export const SOutro: React.FC = () => {
  const f = useCurrentFrame();
  const id = "outro";
  const s = SCENES.find((x) => x.id === id)!;
  const beats = beatFrames(id);
  /* beatAt 取的是「离均匀槽位最近的一拍」，逐句对位会串行；这里按讲稿顺序取实测起点。 */
  const at = (i: number) => beats[i] ?? beatAt(id, i, Math.max(1, beats.length));
  const t0 = at(0);
  const t1 = at(1);
  const t2 = at(2);
  const t3 = at(3);
  const t4 = at(4);
  const t5 = at(5);
  const t6 = at(6);

  return (
    <Scene id={id}>
      <Head kicker={s.kicker} title={s.title} goal={s.goal} />

      <div style={{ position: "absolute", left: PAD, top: 252, width: 1776, display: "flex", alignItems: "baseline", gap: 24, opacity: pct(f, t0, t0 + 12) }}>
        <Mono size={FT.meta} color={C.cyan} style={{ letterSpacing: FT_T.meta }}>回到开头那个问题</Mono>
        <div style={{ fontFamily: FONT.serif, fontSize: FT.lead, lineHeight: 1.3, color: f >= t1 ? C.ink : C.inkDim }}>
          能不能只算它该算的那部分？
        </div>
      </div>

      <div style={{ position: "absolute", left: PAD, top: 322, width: 1776, boxSizing: "border-box", background: C.panel, border: "1px solid " + C.panelLine, borderLeft: "3px solid " + C.cyan, borderRadius: 14, padding: "16px 28px", opacity: pct(f, t2, t2 + 14) }}>
        <Mono size={FT.meta} color={C.cyan} style={{ letterSpacing: FT_T.meta }}>论文的回答</Mono>
        <div style={{ fontFamily: FONT.sans, fontSize: FT.display, color: C.ink, lineHeight: 1.05, marginTop: 6 }}>判据先于数据发生</div>
      </div>

      <Card
        label="起点"
        accent={C.cyan}
        pad={20}
        style={{ position: "absolute", left: PAD, top: 533, width: 340, boxSizing: "border-box", opacity: pct(f, t3, t3 + 12) }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ width: 64, height: 64, borderRadius: 8, background: C.panel, border: "1px solid " + C.cyan, display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 4, padding: 7, boxSizing: "border-box" }}>
            {[0, 1, 2, 3].map((k) => (
              <div key={k} style={{ background: "rgba(94,234,212," + (k === 1 ? 0.55 : 0.18) + ")", borderRadius: 2 }} />
            ))}
          </div>
          <div>
            <div style={{ fontFamily: FONT.sans, fontSize: FT.label, color: C.ink }}>patch 级判据</div>
            <div style={{ fontFamily: FONT.sans, fontSize: FT.meta, color: C.inkDim, marginTop: 6 }}>冗余 / 不冗余</div>
          </div>
        </div>
      </Card>

      <div style={{ position: "absolute", left: 0, top: 0, opacity: pct(f, t4, t4 + 10) }}>
        <div style={{ position: "absolute", left: 430, top: 536, width: 1, height: 128, background: C.panelLine }} />
        <div style={{ position: "absolute", left: 412, top: 600, width: 18, height: 1, background: C.panelLine }} />
        {BRANCHES.map((b, i) => (
          <div key={b.name}>
            <div style={{ position: "absolute", left: 430, top: 536 + i * 64, width: 130, height: 1, background: C.panelLine }} />
            <div style={{ position: "absolute", left: 552, top: 533 + i * 64, width: 6, height: 6, borderRadius: 3, background: C.cyan }} />
            <div
              style={{
                position: "absolute",
                left: 560,
                top: 508 + i * 64,
                width: 600,
                height: 56,
                boxSizing: "border-box",
                background: C.panel,
                border: "1px solid " + C.panelLine,
                borderRadius: 10,
                display: "flex",
                alignItems: "center",
                gap: 18,
                padding: "0 20px",
                opacity: pct(f, t4 + i * 6, t4 + i * 6 + 12),
              }}
            >
              <span style={{ fontFamily: FONT.sans, fontSize: FT.lead, color: C.ink, width: 72 }}>{b.name}</span>
              <span style={{ fontFamily: FONT.sans, fontSize: FT.meta, color: C.inkDim }}>{b.note}</span>
            </div>
          </div>
        ))}
      </div>

      <Card
        label="论文的说法"
        accent={C.cyan}
        pad={20}
        style={{ position: "absolute", left: 1216, top: 508, width: 632, boxSizing: "border-box", opacity: pct(f, t5, t5 + 14) }}
      >
        <div style={{ fontFamily: FONT.serif, fontSize: FT.h2, color: C.ink, lineHeight: 1.35 }}>同一套粒度，跨级一致</div>
        <Body size={FT.label} color={C.inkDim} style={{ marginTop: 10 }}>同一个 patch 判据，同时指导采样、传输、计算。</Body>
      </Card>

      <SumCard label="端到端" left={PAD} at={t6}>
        <Num value={E2E} unit="×" size={FT.num} color={C.cyan} />
        <Body size={FT.meta} color={C.inkDim} style={{ marginTop: 6 }}>跨级一致地消冗余</Body>
      </SumCard>
      <SumCard label="精度" left={PAD + 600} at={t6 + 6}>
        <Headline>涨一点，掉一点</Headline>
        <Body size={FT.meta} color={C.inkDim} style={{ marginTop: 6 }}>看场景，也看阈值</Body>
      </SumCard>
      <SumCard label="代价" left={PAD + 1200} at={t6 + 12}>
        <Headline>面积与先验依赖</Headline>
        <Body size={FT.meta} color={C.inkDim} style={{ marginTop: 6 }}>版图估算；上一帧推理</Body>
      </SumCard>
    </Scene>
  );
};
