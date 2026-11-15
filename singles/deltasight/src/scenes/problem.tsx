import React from "react";
import { useCurrentFrame } from "remotion";
import { C, FONT, FT, FT_T } from "../../design/tokens";
import { Body, Card, EV, Head, Mono, Num, PAD, Pill, Plate, Scene, beatAt, pct } from "../shared";

/* 02 问题：三段流水线怎么分能耗，为什么绕不开 ADC，为什么「各自为政」。 */

const STAGES = [
  { cn: "传感", en: "Sensing", sub: "像素阵列 → ADC → ISP", color: C.cyan },
  { cn: "传输", en: "Transmission", sub: "MIPI CSI-2 送到主机", color: C.amber },
  { cn: "计算", en: "Computing", sub: "CNN / Transformer 推理", color: C.violet },
];

export const SProblem: React.FC = () => {
  const f = useCurrentFrame();
  const id = "problem";
  const t0 = beatAt(id, 0, 9);
  const t1 = beatAt(id, 1, 9);
  const t2 = beatAt(id, 2, 9);
  const t3 = beatAt(id, 3, 9);
  const t4 = beatAt(id, 4, 9);
  const t6 = beatAt(id, 6, 9);
  const t7 = beatAt(id, 7, 9);
  const share = String(EV.values.energyShare).replace("∼", "–");
  return (
    <Scene id={id}>
      <Head kicker="01 / 三段流水线" title="采样、传输、计算，各干各的" goal="视频 AIoT 系统的能耗花在哪一段" />

      <div style={{ position: "absolute", left: PAD, top: 292, width: 740 }}>
        {STAGES.map((s, i) => {
          const at = [t0, t1, t2][i];
          return (
            <div key={s.cn} style={{ opacity: pct(f, at, at + 12), display: "flex", alignItems: "baseline", gap: 16, padding: "14px 0", borderBottom: "1px solid " + C.panelLine }}>
              <Mono size={FT.meta} color={C.inkFaint}>{["01", "02", "03"][i]}</Mono>
              <div style={{ width: 5, height: 34, background: s.color, borderRadius: 3 }} />
              <div>
                <span style={{ fontFamily: FONT.serif, fontSize: FT.h2, color: C.ink }}>{s.cn}</span>
                <span style={{ fontFamily: FONT.mono, fontSize: FT.meta, color: C.inkFaint, marginLeft: 12, letterSpacing: FT_T.meta }}>{s.en}</span>
                <div style={{ fontFamily: FONT.sans, fontSize: FT.label, color: C.inkDim, marginTop: 2 }}>{s.sub}</div>
              </div>
            </div>
          );
        })}

        <div style={{ marginTop: 26, opacity: pct(f, t4, t4 + 14) }}>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 18 }}>
            <Num value={share} unit="" size={FT.display} color={C.amber} />
            <Body size={FT.label} color={C.inkDim} style={{ paddingBottom: 10 }}>传感 + 传输<br />占系统总能耗</Body>
          </div>
          <div style={{ marginTop: 10, height: 16, width: 700, background: C.panel, borderRadius: 8, position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", left: "37%", width: "16%", top: 0, bottom: 0, background: C.amber, opacity: 0.9 }} />
            <div style={{ position: "absolute", left: 0, width: "37%", top: 0, bottom: 0, background: C.cyan, opacity: 0.28 }} />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", width: 700, marginTop: 6 }}>
            <Mono size={FT.micro} color={C.cyan}>传感</Mono>
            <Mono size={FT.micro} color={C.amber}>传感 + 传输 37%–53%</Mono>
            <Mono size={FT.micro} color={C.inkFaint}>计算</Mono>
          </div>
        </div>

        <div style={{ marginTop: 26, opacity: pct(f, t6, t6 + 14) }}>
          <Card label="传感这一段里" accent={C.cyan}>
            <Body size={FT.label} color={C.inkDim}>
              能耗大头是 <span style={{ color: C.ink }}>ADC</span>——模拟量变数字量的那一步。所以想省能耗，绕不开它。
            </Body>
          </Card>
        </div>
      </div>

      <div style={{ position: "absolute", left: 880, top: 296, width: 780, opacity: pct(f, t3, t3 + 16) }}>
        <Plate id="fig1" width={780} caption="原文 Figure 1：传感 → 传输 → 计算，以及一个 4-bit SAR ADC 的示例" />
      </div>

      <div style={{ position: "absolute", left: 880, top: 708, width: 780, opacity: pct(f, t7, t7 + 16) }}>
        <Card label="问题不是哪一段慢，是三段各自为政" accent={C.coral}>
          <div style={{ display: "flex", gap: 10, marginBottom: 14, flexWrap: "wrap" }}>
            <Pill text="固定帧率" color={C.coral} bg="rgba(251,113,133,0.10)" />
            <Pill text="全分辨率" color={C.coral} bg="rgba(251,113,133,0.10)" />
            <Pill text="统一精度" color={C.coral} bg="rgba(251,113,133,0.10)" />
          </div>
          <Body size={FT.label} color={C.inkDim}>
            同一套假设绑住三段：前面按自己的规矩扔，后面按自己的规矩再算一遍——冗余不会被真正消掉，只是在段内被优化。
          </Body>
        </Card>
      </div>
    </Scene>
  );
};
