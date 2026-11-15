import React from "react";
import { useCurrentFrame } from "remotion";
import { C, FONT, FT, FT_T } from "../../design/tokens";
import { Body, Card, Head, Mono, PAD, Pill, Plate, Scene, beatAt, pct } from "../shared";

/* 05 路由：不相似的 patch 怎么分轻重。
   左列三场景（appearing / moving / disappearing-occluded）配「上一帧 vs 这一帧」小示意；
   右列是论文原文 Figure 3；底部把 IoU 与内部变化率两条判据写清楚。
   不引入新数字：三个场景、两档精度、一条跳过规则，都是论文口径。 */

const SCEN = [
  { i: "01", cn: "出现", en: "appearing", desc: "上一帧这里没有东西，这一帧出现了", color: C.amber, hi: true },
  { i: "02", cn: "移动", en: "moving", desc: "东西还在，但位置或轮廓变了", color: C.cyan, hi: true },
  { i: "03", cn: "消失 / 遮挡", en: "disappearing · occluded", desc: "变化几乎全落在上一帧的框里", color: C.coral, hi: false },
];

const Mini: React.FC<{ color: string; prev: boolean; cur: boolean; at: number; dx?: number }> = ({ color, prev, cur, at, dx = 0 }) => {
  const f = useCurrentFrame();
  const box = (on: boolean, shift: number, k: number) => (
    <div style={{ position: "relative", width: 78, height: 56, borderRadius: 4, background: C.panel, border: "1px solid " + C.panelLine, opacity: pct(f, at + k * 6, at + k * 6 + 10) }}>
      {on ? <div style={{ position: "absolute", left: 16 + shift, top: 16, width: 30, height: 22, background: color, borderRadius: 2, opacity: 0.9 }} /> : null}
    </div>
  );
  return (
    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
      {box(prev, 0, 0)}
      <span style={{ fontFamily: FONT.mono, fontSize: FT.micro, color: C.inkFaint }}>→</span>
      {box(cur, dx, 1)}
    </div>
  );
};

export const SRoute: React.FC = () => {
  const f = useCurrentFrame();
  const id = "route";
  const t0 = beatAt(id, 0, 10);
  const t1 = beatAt(id, 1, 10);
  const t2 = beatAt(id, 2, 10);
  const t3 = beatAt(id, 3, 10);
  const t4 = beatAt(id, 4, 10);
  const t5 = beatAt(id, 5, 10);
  const t6 = beatAt(id, 6, 10);
  const t7 = beatAt(id, 7, 10);
  const t8 = beatAt(id, 8, 10);
  const t9 = beatAt(id, 9, 10);

  return (
    <Scene id={id}>
      <Head kicker="05 / 三种场景" title="出现、移动、消失" goal="不相似的 patch 怎么分轻重" />

      {SCEN.map((s, i) => {
        const at = [t1, t2, t3][i];
        return (
          <div key={s.cn} style={{ position: "absolute", left: PAD, top: 292 + i * 108, width: 700, opacity: pct(f, at, at + 12) }}>
            <div style={{ display: "flex", alignItems: "baseline", gap: 12 }}>
              <Mono size={FT.meta} color={C.inkFaint}>{s.i}</Mono>
              <div style={{ width: 5, height: 30, background: s.color, borderRadius: 3 }} />
              <span style={{ fontFamily: FONT.serif, fontSize: FT.h2, color: C.ink }}>{s.cn}</span>
              <span style={{ fontFamily: FONT.mono, fontSize: FT.tiny, color: C.inkFaint, letterSpacing: FT_T.meta }}>{s.en}</span>
              <div style={{ flex: 1 }} />
              <Pill text={s.hi ? "高精度" : "低精度"} color={s.hi ? C.cyan : C.amber} bg={s.hi ? "rgba(94,234,212,0.10)" : "rgba(251,191,36,0.10)"} />
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 20, marginTop: 8, paddingLeft: 17 }}>
              <Body size={FT.label} color={C.inkDim} style={{ width: 470 }}>{s.desc}</Body>
              <Mini color={s.color} prev={i !== 0} cur={i !== 2} at={at} dx={i === 1 ? 22 : 0} />
            </div>
          </div>
        );
      })}

      <div style={{ position: "absolute", left: PAD, top: 626, width: 700, opacity: pct(f, t5, t5 + 14) }}>
        <Card label="怎么分：两个量" accent={C.violet} pad={20}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 12, padding: "4px 0" }}>
            <Mono size={FT.h2} color={C.violet}>IoU</Mono>
            <Body size={FT.label} color={C.inkDim}>不相似掩码 ∩ 上一帧检测框 的交并比</Body>
          </div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 12, padding: "4px 0" }}>
            <Mono size={FT.h2} color={C.violet}>r_in</Mono>
            <Body size={FT.label} color={C.inkDim}>变化落在框里的比例（内部变化率）</Body>
          </div>
          <div style={{ marginTop: 8, borderTop: "1px solid " + C.panelLine, paddingTop: 10, opacity: pct(f, t8, t8 + 12) }}>
            <Body size={FT.label} color={C.ink}>
              IoU ≥ θ₂ 且 r_in &gt; θ₁ → 判成第三种；否则按出现或移动走高精度。
            </Body>
          </div>
        </Card>
      </div>

      <div style={{ position: "absolute", left: 900, top: 292, width: 900 }}>
        <Plate id="fig3" width={860} at={t0} caption="原文 Figure 3：三种场景（appearing / moving / disappearing），以及三档采样精度" />
      </div>
    </Scene>
  );
};
