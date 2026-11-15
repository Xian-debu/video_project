import React from "react";
import { useCurrentFrame } from "remotion";
import { C, FONT, FT, FT_T } from "../../design/tokens";
import { Bars, Body, Card, EV, Head, Mono, PAD, Pill, Scene, beatAt, pct } from "../shared";
import { SCENES } from "../script";

/* 09 拼帧与协议：只传变了的块。
   左：三步（传感器内只对不相似块去马赛克 → 拼成一个逻辑帧、帧头记块号 → 主机按块号替换重建）；
   右：8×6 块示意图（哪些块不相似）+ 传输量（100 − 跳过率，推导值，卡上标明）。
   右下：计算侧直接用同一张掩码当门控。 */

const SKIP = EV.values.skipPct as { vid: number; nfs: number };
const TR = EV.derived.transmittedPct as { vid: number; nfs: number };

const COLS = 8;
const ROWS = 6;
const CELL = 44;
const GAP = 6;

/** 固定的不相似块（raster 序号），只是示意图，不代表论文的实测分布。 */
const CHANGED = [3, 7, 8, 12, 14, 15, 19, 20, 21, 26, 27, 31, 33, 34, 39, 41, 44];

const Step: React.FC<{ i: string; cn: string; en: string; color: string; at: number; right?: React.ReactNode; children: React.ReactNode }> = ({
  i, cn, en, color, at, right, children,
}) => {
  const f = useCurrentFrame();
  return (
    <div style={{ opacity: pct(f, at, at + 12), display: "flex", gap: 14, padding: "10px 0", borderBottom: "1px solid " + C.panelLine }}>
      <div style={{ width: 5, background: color, borderRadius: 3, flexShrink: 0 }} />
      <div style={{ flex: 1 }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
          <Mono size={FT.meta} color={C.inkFaint}>{i}</Mono>
          <span style={{ fontFamily: FONT.serif, fontSize: FT.h2, color: C.ink }}>{cn}</span>
          <span style={{ fontFamily: FONT.mono, fontSize: FT.tiny, color: C.inkFaint, letterSpacing: FT_T.meta }}>{en}</span>
          <div style={{ flex: 1 }} />
          {right}
        </div>
        <div style={{ marginTop: 6 }}>{children}</div>
      </div>
    </div>
  );
};

export const SSystem: React.FC = () => {
  const f = useCurrentFrame();
  const id = "system";
  const s = SCENES.find((x) => x.id === id)!;
  const t1 = beatAt(id, 1, 12);
  const t2 = beatAt(id, 2, 12);
  const t3 = beatAt(id, 3, 12);
  const t5 = beatAt(id, 5, 12);
  const t8 = beatAt(id, 8, 12);
  const t9 = beatAt(id, 9, 12);
  const t10 = beatAt(id, 10, 12);

  const W = COLS * (CELL + GAP) - GAP;
  const H = ROWS * (CELL + GAP) - GAP;

  return (
    <Scene id={id}>
      <Head kicker={s.kicker} title={s.title} goal={s.goal} />

      {/* 左列：三步 */}
      <div style={{ position: "absolute", left: PAD, top: 276, width: 748 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, opacity: pct(f, t1, t1 + 12) }}>
          <Mono size={FT.meta} color={C.inkFaint} style={{ letterSpacing: FT_T.meta }}>§4.3 与主机协作</Mono>
          <div style={{ flex: 1, height: 1, background: C.panelLine }} />
          <Pill text="物理层仍是 MIPI CSI-2" color={C.cyan} size={FT.tiny} />
        </div>

        <div style={{ marginTop: 14 }}>
          <Step i="①" cn="传感器内先筛" en="in-sensor" color={C.cyan} at={t2}>
            <Body size={FT.body} color={C.inkDim}>
              只对<span style={{ color: C.ink }}>不相似的块</span>做局部去马赛克；相似的块连这一步都省了。
            </Body>
          </Step>
          <Step i="②" cn="拼成一个逻辑帧" en="multi-ROI" color={C.violet} at={t3} right={<Pill text="帧头记块号" color={C.violet} size={FT.tiny} bg="rgba(167,139,250,0.12)" />}>
            <Body size={FT.body} color={C.inkDim}>
              更新的块重排进一帧，帧头写块号，叫<span style={{ color: C.ink }}>多感兴趣区合并帧</span>。
            </Body>
          </Step>
          <Step i="③" cn="主机按编号替换" en="reconstruct" color={C.amber} at={t5}>
            <Body size={FT.body} color={C.inkDim}>
              主机留着上一帧，收到哪块换哪块，<span style={{ color: C.ink }}>当前帧就重建出来了</span>。
            </Body>
          </Step>
        </div>

        <div style={{ marginTop: 16, opacity: pct(f, t9, t9 + 12) }}>
          <Card label="协议层只加了两样" accent={C.cyanDeep} pad={18}>
            <Body size={FT.label} color={C.inkDim}>
              块级差分更新 + 语义索引。物理层、编码、引脚都不动——
              <span style={{ color: C.ink }}>改的是「这一帧里哪几块是新的」怎么表达。</span>
            </Body>
          </Card>
        </div>
      </div>

      {/* 右上：8×6 块示意 */}
      <div style={{ position: "absolute", left: 840, top: 274, opacity: pct(f, t2, t2 + 12) }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginBottom: 10 }}>
          <Mono size={FT.meta} color={C.inkFaint} style={{ letterSpacing: FT_T.meta }}>这一帧的块</Mono>
          <Body size={FT.tiny} color={C.inkFaint}>8 × 6 = 48 块 · 排布示意</Body>
        </div>
        <div style={{ position: "relative", width: W, height: H }}>
          {Array.from({ length: ROWS * COLS }).map((_, n) => {
            const r = Math.floor(n / COLS);
            const c = n % COLS;
            const on = CHANGED.indexOf(n) >= 0;
            return (
              <div
                key={n}
                style={{
                  position: "absolute",
                  left: c * (CELL + GAP),
                  top: r * (CELL + GAP),
                  width: CELL,
                  height: CELL,
                  borderRadius: 4,
                  background: on ? "rgba(251,113,133,0.20)" : C.panel,
                  border: "1px solid " + (on ? C.coral : C.panelLine),
                }}
              />
            );
          })}
        </div>
        <div style={{ display: "flex", gap: 16, marginTop: 10 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
            <div style={{ width: 12, height: 12, borderRadius: 3, background: "rgba(251,113,133,0.20)", border: "1px solid " + C.coral }} />
            <Body size={FT.tiny} color={C.inkDim}>不相似 · 要传</Body>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
            <div style={{ width: 12, height: 12, borderRadius: 3, background: C.panel, border: "1px solid " + C.panelLine }} />
            <Body size={FT.tiny} color={C.inkDim}>相似 · 不传</Body>
          </div>
        </div>
      </div>

      {/* 右上二：传输量 */}
      <div style={{ position: "absolute", left: 1404, top: 296, width: 444, opacity: pct(f, t8, t8 + 12) }}>
        <Card label="实际要传的像素占比" accent={C.coralDeep} pad={18}>
          <Bars
            rows={[
              { label: "ImageNet VID", value: TR.vid, color: C.cyan, note: "跳过 " + SKIP.vid.toFixed(1) + "% → 传 " + TR.vid.toFixed(1) + "%" },
              { label: "NFS", value: TR.nfs, color: C.violet, note: "跳过 " + SKIP.nfs.toFixed(1) + "% → 传 " + TR.nfs.toFixed(1) + "%" },
            ]}
            max={100}
            w={396}
            at={t8 + 6}
            unit="%"
            rowH={50}
            digits={1}
          />
          <div style={{ marginTop: 10 }}>
            <Body size={FT.tiny} color={C.inkFaint}>推导值：100% 减去跳过率，论文原表没有这一列。</Body>
          </div>
        </Card>
      </div>

      {/* 右下：主机侧 */}
      <div style={{ position: "absolute", left: 840, top: 706, width: 1050, opacity: pct(f, t10, t10 + 12) }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 5, height: 58, background: C.amber, borderRadius: 3 }} />
          <Body size={FT.label} color={C.inkDim}>
            计算侧不用再自己找冗余——<span style={{ color: C.ink }}>同一张相似掩码直接当门控</span>，没变的 patch 跳过、特征从片上缓存取。
          </Body>
        </div>
      </div>
    </Scene>
  );
};
