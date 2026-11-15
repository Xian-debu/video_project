import React from "react";
import { useCurrentFrame } from "remotion";
import { C, FONT, FT, FT_T } from "../../design/tokens";
import { Body, Card, Head, Mono, Num, PAD, Plate, Scene, beatAt, pct } from "../shared";

/* 03 动机：两个证据——剪掉六成不掉点；噪声在前景与背景上不对称。 */

export const SMismatch: React.FC = () => {
  const f = useCurrentFrame();
  const id = "mismatch";
  const t0 = beatAt(id, 0, 11);
  const t1 = beatAt(id, 3, 11);
  const t4 = beatAt(id, 4, 11);
  const t5 = beatAt(id, 5, 11);
  const t6 = beatAt(id, 6, 11);
  const t9 = beatAt(id, 9, 11);
  const t10 = beatAt(id, 10, 11);
  return (
    <Scene id={id}>
      <Head kicker="02 / 两个证据" title="冗余是真的，重要性是不一样的" goal="为什么「全都算」不合理" />

      <div style={{ position: "absolute", left: PAD, top: 292, width: 660 }}>
        <div style={{ opacity: pct(f, t0, t0 + 12) }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 12 }}>
            <Mono size={FT.meta} color={C.cyan} style={{ letterSpacing: FT_T.meta }}>证据一</Mono>
            <span style={{ fontFamily: FONT.serif, fontSize: FT.h2, color: C.ink }}>冗余真的存在</span>
          </div>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 16, marginTop: 14 }}>
            <Num value="> 60%" size={FT.display} color={C.cyan} />
            <Body size={FT.label} color={C.inkDim} style={{ paddingBottom: 12 }}>的数据与计算被扔掉<br />精度几乎不变</Body>
          </div>
        </div>

        <div style={{ height: 1, background: C.panelLine, margin: "26px 0", opacity: pct(f, t4, t4 + 10) }} />

        <div style={{ opacity: pct(f, t4, t4 + 12) }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 12 }}>
            <Mono size={FT.meta} color={C.amber} style={{ letterSpacing: FT_T.meta }}>证据二</Mono>
            <span style={{ fontFamily: FONT.serif, fontSize: FT.h2, color: C.ink }}>重要性不一样</span>
          </div>
          <Body size={FT.meta} color={C.inkFaint} style={{ marginTop: 10 }}>
            同样往画面里加噪声：加在前景精度明显掉，加在背景几乎没影响。
          </Body>

          <div style={{ display: "flex", gap: 14, marginTop: 18 }}>
            <div style={{ flex: 1, opacity: pct(f, t5, t5 + 12) }}>
              <Card label="噪声 → 前景" accent={C.coral} pad={18}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 8, background: C.coral, opacity: 0.85 }} />
                  <Mono size={FT.label} color={C.coral}>mAP 明显掉</Mono>
                </div>
              </Card>
            </div>
            <div style={{ flex: 1, opacity: pct(f, t6, t6 + 12) }}>
              <Card label="噪声 → 背景" accent={C.cyanDeep} pad={18}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 8, background: C.panelLine }} />
                  <Mono size={FT.label} color={C.cyan}>几乎不变</Mono>
                </div>
              </Card>
            </div>
          </div>
        </div>

        <div style={{ marginTop: 24, opacity: pct(f, t9, t9 + 12) }}>
          <Body size={FT.label} color={C.inkDim}>
            既然能扔、又该区别对待，为什么系统还是全采、全传、全算？
          </Body>
        </div>
      </div>

      <div style={{ position: "absolute", left: 780, top: 296, width: 1068, opacity: pct(f, t1, t1 + 16) }}>
        <Plate id="fig2" width={1000} caption="原文 Figure 2：(a) 剪掉六成 patch，mAP 仍在基线附近；(b) 噪声加在目标/非目标区域，结果不对称" />
      </div>

      <div style={{ position: "absolute", left: 780, top: 700, width: 1000, opacity: pct(f, t10, t10 + 16) }}>
        <Card label="论文给这个现象起了名字" accent={C.amber}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 20 }}>
            <span style={{ fontFamily: FONT.serif, fontSize: FT.h1, color: C.ink }}>粒度错配</span>
            <Mono size={FT.label} color={C.amber} style={{ letterSpacing: FT_T.meta }}>GRANULARITY MISMATCH</Mono>
          </div>
          <Body size={FT.label} color={C.inkDim} style={{ marginTop: 12 }}>
            上游按像素判冗余，下游按 patch 用数据——两个粒度对不上，谁也替不了谁。
          </Body>
        </Card>
      </div>
    </Scene>
  );
};
