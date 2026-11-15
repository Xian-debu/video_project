import React from "react";
import { useCurrentFrame } from "remotion";
import { C, FONT, FT } from "../../design/tokens";
import { Body, Card, Head, Mono, PAD, Scene, beatAt, pct } from "../shared";

/* 03 判据：传感器按像素判冗余，模型按 patch 用数据，粒度对不上。
   左边 32×16 像素的双帧差示意（一个矩形块在动），右边把其中 16×16 像素放大成一个 patch。
   红色 = 两帧之间变了的像素。不引入新数字：16×16 是论文设定 P=16，其余是示意。 */

const COLS = 32;
const ROWS = 16;
const CELL = 18;
const GAP = 2;
const STEP = CELL + GAP;

const PATCH_COLS = 16;
const PATCH_ROWS = 16;
const MAG = 22;
const MGAP = 2;
const MSTEP = MAG + MGAP;

/* 运动物体：上一帧在这里，这一帧往右上挪了一点。 */
const inPrev = (c: number, r: number) => c >= 3 && c < 7 && r >= 3 && r < 7;
const inCur = (c: number, r: number) => c >= 9 && c < 13 && r >= 6 && r < 10;
const changed = (c: number, r: number) => inPrev(c, r) !== inCur(c, r);

const PixelFrame: React.FC<{ at: number }> = ({ at }) => {
  const f = useCurrentFrame();
  return (
    <div style={{ position: "relative", width: COLS * STEP, height: ROWS * STEP }}>
      {Array.from({ length: COLS * ROWS }).map((_, i) => {
        const c = i % COLS;
        const r = Math.floor(i / COLS);
        const ch = changed(c, r);
        const on = pct(f, at + (c + r) * 0.8, at + (c + r) * 0.8 + 8);
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: c * STEP,
              top: r * STEP,
              width: CELL,
              height: CELL,
              borderRadius: 2,
              background: ch ? C.coral : C.panel,
              border: "1px solid " + (ch ? C.coral : C.panelLine),
              opacity: on,
            }}
          />
        );
      })}
      <div style={{ position: "absolute", left: 3 * STEP - 2, top: 3 * STEP - 2, width: 4 * STEP - GAP + 4, height: 4 * STEP - GAP + 4, border: "2px dashed " + C.amber, borderRadius: 4, opacity: 0.75 }} />
      <div style={{ position: "absolute", left: 9 * STEP - 2, top: 6 * STEP - 2, width: 4 * STEP - GAP + 4, height: 4 * STEP - GAP + 4, border: "2px solid " + C.coral, borderRadius: 4 }} />
      <div style={{ position: "absolute", left: -6, top: -6, width: PATCH_COLS * STEP - GAP + 12, height: PATCH_ROWS * STEP - GAP + 12, border: "2px solid " + C.violet, borderRadius: 6 }} />
      <div style={{ position: "absolute", left: 4, top: 4, background: C.bg, padding: "2px 6px", borderRadius: 4 }}>
        <span style={{ fontFamily: FONT.mono, fontSize: FT.micro, color: C.violet, letterSpacing: 1 }}>这一格 = 16 × 16</span>
      </div>
    </div>
  );
};

export const SCriterion: React.FC = () => {
  const f = useCurrentFrame();
  const id = "criterion";
  const t0 = beatAt(id, 0, 10);
  const t1 = beatAt(id, 1, 10);
  const t2 = beatAt(id, 2, 10);
  const t3 = beatAt(id, 3, 10);
  const t4 = beatAt(id, 4, 10);
  const t6 = beatAt(id, 6, 10);
  const t7 = beatAt(id, 7, 10);
  const t8 = beatAt(id, 8, 10);
  const t9 = beatAt(id, 9, 10);

  return (
    <Scene id={id}>
      <Head kicker="03 / 像素级对 patch 级" title="传感器和模型，数的不是同一格" goal="错配到底错在哪一层" />

      <div style={{ position: "absolute", left: PAD, top: 292, width: COLS * STEP }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 12, opacity: pct(f, t0, t0 + 12) }}>
          <Mono size={FT.meta} color={C.cyan}>传感器</Mono>
          <span style={{ fontFamily: FONT.sans, fontSize: FT.h2, color: C.ink }}>逐像素判冗余</span>
        </div>
        <div style={{ height: 18 }} />
        <PixelFrame at={t0} />
        <div style={{ display: "flex", gap: 18, marginTop: 16, opacity: pct(f, t1, t1 + 12) }}>
          <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ width: 14, height: 14, background: C.coral, borderRadius: 2 }} />
            <Mono size={FT.meta} color={C.inkDim}>变了 → 采</Mono>
          </span>
          <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ width: 14, height: 14, background: C.panel, border: "1px solid " + C.panelLine, borderRadius: 2 }} />
            <Mono size={FT.meta} color={C.inkDim}>没变 → 不采</Mono>
          </span>
          <Mono size={FT.meta} color={C.inkFaint}>虚线 = 上一帧的物体</Mono>
        </div>
        <div style={{ marginTop: 10, opacity: pct(f, t1, t1 + 12) }}>
          <Body size={FT.label} color={C.inkDim}>两帧相减：只有物体挪动的那几个像素变了。</Body>
        </div>
      </div>

      <div style={{ position: "absolute", left: 860, top: 292 }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 12, opacity: pct(f, t2, t2 + 12) }}>
          <Mono size={FT.meta} color={C.violet}>模型</Mono>
          <span style={{ fontFamily: FONT.sans, fontSize: FT.h2, color: C.ink }}>只认 token，不认像素</span>
        </div>
        <div style={{ height: 18 }} />
        <div style={{ position: "relative", width: PATCH_COLS * MSTEP, height: PATCH_ROWS * MSTEP, opacity: pct(f, t3, t3 + 14) }}>
          {Array.from({ length: PATCH_COLS * PATCH_ROWS }).map((_, i) => {
            const c = i % PATCH_COLS;
            const r = Math.floor(i / PATCH_COLS);
            const ch = changed(c, r);
            return (
              <div
                key={i}
                style={{
                  position: "absolute",
                  left: c * MSTEP,
                  top: r * MSTEP,
                  width: MAG,
                  height: MAG,
                  borderRadius: 3,
                  background: ch ? C.coral : C.panel,
                  border: "1px solid " + (ch ? C.coral : C.panelLine),
                }}
              />
            );
          })}
        </div>
        <div style={{ marginTop: 14, opacity: pct(f, t6, t6 + 12) }}>
          <Mono size={FT.label} color={C.ink}>一个 patch = 16 × 16 像素</Mono>
        </div>
      </div>

      <div style={{ position: "absolute", left: 1436, top: 348, width: 412 }}>
        {[
          { k: "1", v: "个 patch", c: C.violet },
          { k: "16 × 16", v: "像素", c: C.ink },
          { k: "1", v: "个 token", c: C.cyan },
        ].map((row, i) => {
          const at = i === 2 ? t4 : t3;
          return (
            <div key={row.v} style={{ opacity: pct(f, at + i * 10, at + i * 10 + 12), display: "flex", alignItems: "baseline", gap: 10, marginBottom: 10 }}>
              <span style={{ fontFamily: FONT.mono, fontSize: FT.num, color: row.c, fontVariantNumeric: "tabular-nums" }}>{row.k}</span>
              <span style={{ fontFamily: FONT.serif, fontSize: FT.h2, color: C.inkDim }}>{row.v}</span>
            </div>
          );
        })}
        <div style={{ marginTop: 18, opacity: pct(f, t4, t4 + 12) }}>
          <Body size={FT.label} color={C.inkDim} style={{ lineHeight: 1.6 }}>
            整帧切成 6×8 个 patch，每个 patch 当一个 token；后面所有计算都按 token 走。
          </Body>
        </div>
        <div style={{ marginTop: 22, opacity: pct(f, t4 + 12, t4 + 26) }}>
          <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} style={{ width: 26, height: 26, borderRadius: 3, background: C.panel, border: "1px solid " + C.violet }} />
            ))}
            <span style={{ fontFamily: FONT.mono, fontSize: FT.label, color: C.inkFaint, marginLeft: 4 }}>…</span>
          </div>
          <div style={{ marginTop: 8 }}>
            <Mono size={FT.micro} color={C.inkFaint}>48 个 token 串起来 = 模型看到的整帧（示意）</Mono>
          </div>

        </div>
      </div>

      <div style={{ position: "absolute", left: PAD, top: 762, width: 760 }}>
        {[
          { at: t7, text: "传感器扔掉的像素，可能正是模型那一格要的" },
          { at: t8, text: "模型要的整格信息，传感器又没保住" },
        ].map((row, i) => (
          <div key={i} style={{ opacity: pct(f, row.at, row.at + 12), display: "flex", alignItems: "baseline", gap: 12, padding: "8px 0" }}>
            <Mono size={FT.label} color={C.coral}>✕</Mono>
            <Body size={FT.h2} color={C.inkDim}>{row.text}</Body>
          </div>
        ))}
      </div>

      <div style={{ position: "absolute", left: 860, top: 748, width: 988, opacity: pct(f, t9, t9 + 14) }}>
        <Card label="判据得换个粒度" accent={C.cyan} pad={18}>
          <Body size={FT.h2} color={C.ink}>
            把冗余判断搬到 patch 级，跟下游用<Mono size={FT.h2} color={C.cyan}>同一套粒度</Mono>。
          </Body>
          <div style={{ marginTop: 6 }}>
            <Body size={FT.meta} color={C.inkFaint}>
              「传感器省掉的」和「模型不需要的」成了同一件事，判据才能往采样、传输、计算上传。
            </Body>
          </div>
        </Card>
      </div>
    </Scene>
  );
};
