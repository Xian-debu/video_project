import React from "react";
import { useCurrentFrame } from "remotion";
import { C, FONT, FT, FT_T } from "../../design/tokens";
import { Body, EV, Head, Mono, PAD, Pill, Plate, Scene, beatAt, pct } from "../shared";
import { SCENES } from "../script";

/* 07 块级读出：像素阵列不是逐像素读，是按块读。
   左边把 16×32 的读出域画成两个相邻块 + 16 列并行 ADC + blk_sel / col_en / switch box；
   右边是原文 Figure 7。数字来自 EV.values.block（claims block-domain / block-cols / block-array / block-pitch）。 */

const BLK = EV.values.block as {
  readoutDomain: string; columnParallelChannels: number; pixelArray: string;
  pixelPitchUm: number; muxRatio: string; sramMB: number;
};

const ROWS = 6; // 示意行数，真实是 16 行
const COLS = 32;
const CELL = 15;
const GAP = 3;

const Grid: React.FC<{ at: number }> = ({ at }) => {
  const f = useCurrentFrame();
  const w = COLS * (CELL + GAP) - GAP;
  const h = ROWS * (CELL + GAP) - GAP;
  const cellAt = (c: number, r: number) => at + ((c + r) % 8) * 2;
  return (
    <div style={{ position: "relative", width: w, height: h }}>
      {Array.from({ length: ROWS }).map((_, r) =>
        Array.from({ length: COLS }).map((__, c) => {
          const inA = c < 16;
          return (
            <div key={c + "-" + r} style={{
              position: "absolute", left: c * (CELL + GAP), top: r * (CELL + GAP),
              width: CELL, height: CELL, borderRadius: 2,
              background: inA ? "rgba(94,234,212,0.16)" : "rgba(167,139,250,0.16)",
              border: "1px solid " + (inA ? "rgba(94,234,212,0.45)" : "rgba(167,139,250,0.45)"),
              opacity: pct(f, cellAt(c, r), cellAt(c, r) + 10),
            }} />
          );
        }),
      )}
      {/* 一个读出域 = 两个相邻块：外框 + 中间的分块线 */}
      <div style={{ position: "absolute", left: -8, top: -8, width: w + 16, height: h + 16, border: "2px solid " + C.panelLine, borderRadius: 6 }} />
      <div style={{ position: "absolute", left: 16 * (CELL + GAP) - GAP / 2, top: -8, width: 2, height: h + 16, background: C.violet, opacity: pct(f, at + 26, at + 38) }} />
      <div style={{ position: "absolute", left: 8, top: -34, fontFamily: FONT.mono, fontSize: FT.micro, color: C.cyan, opacity: pct(f, at + 22, at + 32) }}>Block A · 16 列</div>
      <div style={{ position: "absolute", left: 16 * (CELL + GAP) + 8, top: -34, fontFamily: FONT.mono, fontSize: FT.micro, color: C.violet, opacity: pct(f, at + 34, at + 44) }}>Block B · 16 列</div>
    </div>
  );
};

const Box: React.FC<{ label: string; sub?: string; color: string; at: number; w?: number }> = ({ label, sub, color, at, w = 168 }) => {
  const f = useCurrentFrame();
  return (
    <div style={{
      width: w, padding: "8px 12px", borderRadius: 6, border: "1px solid " + C.panelLine,
      background: C.panel, opacity: pct(f, at, at + 12),
    }}>
      <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
        <div style={{ width: 4, height: 16, background: color, borderRadius: 2 }} />
        <Mono size={FT.label} color={C.ink}>{label}</Mono>
      </div>
      {sub ? <div style={{ fontFamily: FONT.sans, fontSize: FT.micro, color: C.inkFaint, marginTop: 4 }}>{sub}</div> : null}
    </div>
  );
};

export const SBlock: React.FC = () => {
  const f = useCurrentFrame();
  const id = "block";
  const s = SCENES.find((x) => x.id === id)!;
  const t1 = beatAt(id, 1, 11);
  const t2 = beatAt(id, 2, 11);
  const t3 = beatAt(id, 3, 11);
  const t4 = beatAt(id, 4, 11);
  const t5 = beatAt(id, 5, 11);
  const t6 = beatAt(id, 6, 11);
  const t7 = beatAt(id, 7, 11);
  const t8 = beatAt(id, 8, 11);
  const t9 = beatAt(id, 9, 11);

  return (
    <Scene id={id}>
      <Head kicker={s.kicker} title={s.title} goal={s.goal} />

      <div style={{ position: "absolute", left: PAD, top: 280, width: 760 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, opacity: pct(f, t1, t1 + 12) }}>
          <Mono size={FT.meta} color={C.inkFaint} style={{ letterSpacing: FT_T.meta }}>§4.2.2 读出电路</Mono>
          <div style={{ flex: 1, height: 1, background: C.panelLine }} />
          <Pill text={"读出域 " + BLK.readoutDomain} color={C.cyan} bg="rgba(94,234,212,0.10)" />
        </div>

        <div style={{ marginTop: 46, opacity: pct(f, t2, t2 + 14) }}>
          <Grid at={t2 + 8} />
        </div>

        {/* 16 列并行 ADC */}
        <div style={{ marginTop: 26, opacity: pct(f, t4, t4 + 14) }}>
          <div style={{ display: "flex", gap: GAP, width: COLS * (CELL + GAP) - GAP }}>
            {Array.from({ length: BLK.columnParallelChannels }).map((_, i) => (
              <div key={i} style={{
                width: (COLS * (CELL + GAP) - GAP - (BLK.columnParallelChannels - 1) * GAP) / BLK.columnParallelChannels,
                height: 26, borderRadius: 3, background: "rgba(94,234,212,0.10)",
                border: "1px solid rgba(94,234,212,0.35)", opacity: pct(f, t4 + i * 2, t4 + i * 2 + 10),
              }} />
            ))}
          </div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginTop: 8 }}>
            <Mono size={FT.label} color={C.cyan}>{BLK.columnParallelChannels}</Mono>
            <Body size={FT.meta} color={C.inkDim}>列并行可重构 ADC —— 一个块里同时读 16 列，不用一列一列等。</Body>
          </div>
        </div>

        {/* 三个控制旋钮 */}
        <div style={{ display: "flex", gap: 12, marginTop: 18 }}>
          <Box label={"blk_sel · " + BLK.muxRatio + " MUX"} sub="整块二选一" color={C.amber} at={t5} w={236} />
          <Box label="col_en · 逐列门控" sub="按位掩码开/关列" color={C.violet} at={t6} w={236} />
          <Box label="switch box" sub="负载不均时，把整块的活改派给邻居" color={C.coral} at={t7} w={236} />
        </div>

        <div style={{ marginTop: 16, display: "flex", alignItems: "baseline", gap: 10, opacity: pct(f, t8, t8 + 12) }}>
          <Body size={FT.label} color={C.inkDim}>
            整个阵列 {BLK.pixelArray}、像元 {BLK.pixelPitchUm} μm ——
            <span style={{ color: C.ink }}> 读的时候按块走，不按像素走。</span>
          </Body>
        </div>
      </div>

      {/* 右：原文 Figure 7 */}
      <div style={{ position: "absolute", left: 872, top: 280, width: 776, opacity: pct(f, t1 + 6, t1 + 18) }}>
        <Plate id="fig7" width={776} caption="原文 Figure 7：两个相邻块组成的 16×32 读出域，16 列并行 ADC，右侧 switch box 负责跨域路由" />
      </div>
    </Scene>
  );
};
