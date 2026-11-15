import React from "react";
import { useCurrentFrame } from "remotion";
import { C, FONT, FT, FT_T } from "../../design/tokens";
import { Body, Card, EV, Head, Mono, PAD, Scene, beatAt, beatFrames, pct } from "../shared";
import { SCENES } from "../script";

/* 12 边界：面积是估的，先验会传错——六条边界按「论文没做 / 没给」的顺序排成 2×3 卡片墙。 */

const BLOCK = EV.values.block as { arrayAreaMm2: number; extraAreaMm2: number; dieAreaMm2: number; sramMB: number };
const TAU = String(EV.values.tau);
const KAPPA = (EV.values.kappaPerModel as number[]).join(" / ");
const PATCH = EV.values.patchSize as number;

const CARD_W = 876;
const CARD_H = 148;
const GAP_X = 24;
const GAP_Y = 20;
/* 每条边界对应的讲稿拍：01→1、02→3（误差往下传那句）、03→4、04→5、05→6、06→7。 */
const ROW_BEAT = [1, 3, 4, 5, 6, 7];

type Row = { n: string; title: string; desc: React.ReactNode };

const ROWS: Row[] = [
  {
    n: "01",
    title: "面积是版图估算，没有流片实测",
    desc: (
      <>
        整个 die ≈ <Mono size={FT.label} color={C.cyan}>{BLOCK.dieAreaMm2}</Mono> mm²；像素阵列{" "}
        <Mono size={FT.label} color={C.cyan}>{BLOCK.arrayAreaMm2}</Mono> mm² + 周边{" "}
        <Mono size={FT.label} color={C.cyan}>{BLOCK.extraAreaMm2}</Mono>；片内 SRAM{" "}
        <Mono size={FT.label} color={C.cyan}>{BLOCK.sramMB}</Mono> MB
      </>
    ),
  },
  {
    n: "02",
    title: "语义先验来自上一帧推理",
    desc: "上一帧判错，误差会往后传",
  },
  {
    n: "03",
    title: "τ 与 κ 只给了扫描，没有自动标定",
    desc: (
      <>
        τ = <Mono size={FT.label} color={C.cyan}>{TAU}</Mono>；κ = <Mono size={FT.label} color={C.cyan}>{KAPPA}</Mono>
        ，都是扫描值
      </>
    ),
  },
  {
    n: "04",
    title: `patch 固定 ${PATCH}×${PATCH}`,
    desc: "跟 ViT 对齐，换模型要重调",
  },
  {
    n: "05",
    title: "主机侧 ROI 解析与重建开销",
    desc: "这部分开销，没有单独计入",
  },
  {
    n: "06",
    title: "第一帧与场景切换",
    desc: "没有历史可用，判据缺输入",
  },
];

export const SLimits: React.FC = () => {
  const f = useCurrentFrame();
  const id = "limits";
  const s = SCENES.find((x) => x.id === id)!;
  const beats = beatFrames(id);
  /* beatAt 取的是「离均匀槽位最近的一拍」，逐条对位会整体串行；这里按讲稿顺序取实测起点。 */
  const at = (i: number) => beats[i] ?? beatAt(id, i, Math.max(1, beats.length));
  const t0 = at(0);
  const tHot = at(3); // 「一旦上一帧判错」——02 卡片变红
  const tClose = at(8);

  return (
    <Scene id={id}>
      <Head kicker={s.kicker} title={s.title} goal={s.goal} />

      <div style={{ position: "absolute", left: PAD, top: 268, width: 1776, display: "flex", justifyContent: "space-between", alignItems: "baseline", opacity: pct(f, t0, t0 + 12) }}>
        <Mono size={FT.meta} color={C.inkFaint} style={{ letterSpacing: FT_T.meta }}>六条边界 · 按论文没做 / 没给的顺序</Mono>
        <Mono size={FT.meta} color={C.inkFaint}>01 — 06</Mono>
      </div>
      <div style={{ position: "absolute", left: PAD, top: 302, width: 1776, height: 1, background: C.panelLine, opacity: pct(f, t0, t0 + 12) }} />

      {ROWS.map((r, i) => {
        const enter = pct(f, t0 + i * 5, t0 + i * 5 + 12);
        const tb = at(ROW_BEAT[i]);
        const detail = pct(f, tb, tb + 12);
        const hot = r.n === "02" ? pct(f, tHot, tHot + 10) : 0;
        return (
          <div
            key={r.n}
            style={{
              position: "absolute",
              left: PAD + (i % 2) * (CARD_W + GAP_X),
              top: 324 + Math.floor(i / 2) * (CARD_H + GAP_Y),
              width: CARD_W,
              opacity: enter,
              transform: "translateY(" + ((1 - enter) * 8).toFixed(2) + "px)",
            }}
          >
            <Card
              accent={hot > 0 ? C.coral : C.cyanDeep}
              pad={22}
              style={{
                height: CARD_H,
                boxSizing: "border-box",
                display: "flex",
                alignItems: "center",
                gap: 18,
                borderLeft: "2px solid " + (hot > 0 ? C.coral : "transparent"),
              }}
            >
              <Mono size={FT.num} color={C.inkFaint} style={{ lineHeight: 1, width: 48 }}>{r.n}</Mono>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: FONT.sans, fontSize: FT.h2, color: C.ink, lineHeight: 1.3 }}>{r.title}</div>
                <Body size={FT.label} color={hot > 0 ? C.ink : C.inkDim} style={{ opacity: detail, marginTop: 6 }}>
                  {r.desc}
                </Body>
              </div>
            </Card>
          </div>
        );
      })}

      <div style={{ position: "absolute", left: PAD, top: 824, width: 1776, display: "flex", alignItems: "center", gap: 18, opacity: pct(f, tClose, tClose + 12) }}>
        <div style={{ width: 3, height: 38, background: C.amber, borderRadius: 2 }} />
        <Mono size={FT.meta} color={C.amber} style={{ letterSpacing: FT_T.meta }}>我的判断</Mono>
        <span style={{ fontFamily: FONT.sans, fontSize: FT.body, color: C.ink }}>论文自己没列这些；这是我读下来最想问的。</span>
      </div>
    </Scene>
  );
};
