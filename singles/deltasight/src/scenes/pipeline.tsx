import React from "react";
import { useCurrentFrame } from "remotion";
import { C, FONT, FT, FT_T } from "../../design/tokens";
import { Bars, Body, EV, Head, Mono, PAD, Pill, Plate, Scene, beatAt, pct } from "../shared";
import { SCENES } from "../script";

/* 08 四阶段：相似还不够，要变成位数。
   左：块相似度 → 4-bit MSB → 语义重要度 → 语义精化（补低 4 位）。
   右下：Table 2 的位宽分布（0-bit 占 79.4% / 86.8%）与 A/D 能耗降幅（74.2% / 83.9%）。
   右上：原文 Figure 5 的系统架构（这一段讲的三层堆栈就在这张图里）。 */

const BW = EV.values.bitWidth as {
  nfs: { zero: number; four: number; ten: number; energyDropPct: number };
  vid: { zero: number; four: number; ten: number; energyDropPct: number };
};

const Stage: React.FC<{ i: string; cn: string; en: string; color: string; at: number; right: React.ReactNode; children: React.ReactNode }> = ({
  i, cn, en, color, at, right, children,
}) => {
  const f = useCurrentFrame();
  return (
    <div style={{ opacity: pct(f, at, at + 12), display: "flex", gap: 14, padding: "9px 0", borderBottom: "1px solid " + C.panelLine }}>
      <div style={{ width: 5, background: color, borderRadius: 3, flexShrink: 0 }} />
      <div style={{ flex: 1 }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
          <Mono size={FT.meta} color={C.inkFaint}>{i}</Mono>
          <span style={{ fontFamily: FONT.serif, fontSize: FT.h2, color: C.ink }}>{cn}</span>
          <span style={{ fontFamily: FONT.mono, fontSize: FT.tiny, color: C.inkFaint, letterSpacing: FT_T.meta }}>{en}</span>
          <div style={{ flex: 1 }} />
          {right}
        </div>
        <div style={{ marginTop: 5 }}>{children}</div>
      </div>
    </div>
  );
};

export const SPipeline: React.FC = () => {
  const f = useCurrentFrame();
  const id = "pipeline";
  const s = SCENES.find((x) => x.id === id)!;
  const t1 = beatAt(id, 1, 12);
  const t2 = beatAt(id, 2, 12);
  const t3 = beatAt(id, 3, 12);
  const t4 = beatAt(id, 4, 12);
  const t5 = beatAt(id, 5, 12);
  const t6 = beatAt(id, 6, 12);
  const t7 = beatAt(id, 7, 12);
  const t8 = beatAt(id, 8, 12);
  const t9 = beatAt(id, 9, 12);
  const t10 = beatAt(id, 10, 12);
  const t11 = beatAt(id, 11, 12);

  return (
    <Scene id={id}>
      <Head kicker={s.kicker} title={s.title} goal={s.goal} />

      <div style={{ position: "absolute", left: PAD, top: 276, width: 660 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, opacity: pct(f, t1, t1 + 12) }}>
          <Mono size={FT.meta} color={C.inkFaint} style={{ letterSpacing: FT_T.meta }}>§4.2.3 混合精度</Mono>
          <div style={{ flex: 1, height: 1, background: C.panelLine }} />
          <Pill text="10 bit 分两段" color={C.violet} bg="rgba(167,139,250,0.10)" />
        </div>

        <Stage i="①" cn="块相似度检测" en="similarity" color={C.cyan} at={t2}
          right={<Pill text="相似 → 0 bit" color={C.inkFaint} bg="rgba(255,255,255,0.04)" size={FT.micro} />}>
          <Body size={FT.meta} color={C.inkDim}>逐像素差异先投票，整块相似就把位宽置零——不转换。</Body>
        </Stage>

        <Stage i="②" cn="高位 MSB 转换" en="4-bit MSB" color={C.violet} at={t3}
          right={<Mono size={FT.meta} color={C.violet}>4 bit</Mono>}>
          <Body size={FT.meta} color={C.inkDim}>不相似的块先出高 4 位；低位先补零，等语义信息回来再决定。</Body>
        </Stage>

        <Stage i="③" cn="语义重要度" en="semantic prior" color={C.amber} at={t5}
          right={<Pill text="主机上一帧先验" color={C.amber} bg="rgba(251,191,36,0.10)" size={FT.micro} />}>
          <Body size={FT.meta} color={C.inkDim}>in-sensor NPU 标出「模型真正要看的块」，这部分不能只给 4 位。</Body>
        </Stage>

        <Stage i="④" cn="语义精化" en="refinement" color={C.coral} at={t7}
          right={<Mono size={FT.meta} color={C.coral}>+4 bit → 10 bit</Mono>}>
          <Body size={FT.meta} color={C.inkDim}>重要块再补一次低 4 位，把精度还回去；其余块保持粗量化。</Body>
        </Stage>

        {/* 结果：位宽分布 */}
        <div style={{ marginTop: 16, opacity: pct(f, t8, t8 + 14) }}>
          <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between" }}>
            <Mono size={FT.meta} color={C.inkFaint}>0-bit 像素占比 · Table 2</Mono>
            <Mono size={FT.meta} color={C.cyan}>{"↓" + BW.nfs.energyDropPct + "% A/D 能耗（NFS）"}</Mono>
          </div>
          <div style={{ marginTop: 6 }}>
            <Bars
              rows={[
                { label: "ImageNet VID · 0-bit " + BW.vid.zero + "%", value: BW.vid.zero, color: C.cyan, note: "10-bit 只占 " + BW.vid.ten + "% · A/D 能耗 ↓" + BW.vid.energyDropPct + "%" },
                { label: "NFS · 0-bit " + BW.nfs.zero + "%", value: BW.nfs.zero, color: C.violet, note: "10-bit 只占 " + BW.nfs.ten + "% · A/D 能耗 ↓" + BW.nfs.energyDropPct + "%" },
              ]}
              max={100} w={640} at={t8 + 6} unit="%" rowH={40} digits={1}
            />
          </div>
        </div>

        <div style={{ marginTop: 2, display: "flex", alignItems: "baseline", gap: 10, opacity: pct(f, t10, t10 + 12) }}>
          <Body size={FT.meta} color={C.inkDim}>
            <span style={{ color: C.ink }}>大头是「不转换」省下来的</span>，不是把 10 位慢慢转得更快。
          </Body>
        </div>
      </div>

      {/* 右上：原文 Figure 5 的系统架构 */}
      <div style={{ position: "absolute", left: 744, top: 276, width: 720, opacity: pct(f, t1 + 6, t1 + 18) }}>
        <Plate id="fig5" width={720} caption="原文 Figure 5：三层堆栈（像素阵列 / ADC-Readout / in-sensor NPU）与可重构 ADC 的 CDAC" />
      </div>

      <div style={{ position: "absolute", left: 744, top: 806, width: 1110, opacity: pct(f, t11, t11 + 12) }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 5, height: 26, background: C.cyan, borderRadius: 3 }} />
          <Body size={FT.label} color={C.inkDim}>
            同一套 CDAC 硬件，先当比较器用、再当 DAC 用 —— 位宽不是「多转几位」，是「先不转」。
          </Body>
        </div>
      </div>
    </Scene>
  );
};
