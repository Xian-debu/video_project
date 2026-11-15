import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { C, FONT, FT, FT_T } from "../../design/tokens";
import { Body, Card, Head, Mono, PAD, Pill, Scene, beatAt, pct, sceneFrames, CW } from "../shared";

/* 01 开场：一台一直在看的摄像头，问「能不能只算该算的」。 */

const Frame: React.FC<{ at: number; f: number }> = ({ at, f }) => {
  // 画面里：静止的场景 + 一个横穿的行人 + 一片晃动的树叶；只有这两处真的变了。
  const walk = interpolate(f, [at, at + 150], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const leaf = Math.sin((f - at) / 12) * 6;
  return (
    <div style={{ position: "relative", width: 620, height: 349, background: "#0A1017", border: "1px solid " + C.panelLine, borderRadius: 12, overflow: "hidden" }}>
      {/* 地平线与路面 */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 210, height: 1, background: C.panelLine }} />
      {/* 建筑（静止） */}
      {[0, 1, 2, 3].map((i) => (
        <div key={i} style={{ position: "absolute", left: 40 + i * 150, top: 96 + (i % 2) * 12, width: 92, height: 114 - (i % 2) * 12, background: C.panel, border: "1px solid " + C.panelLine, borderRadius: 3 }} />
      ))}
      {/* 树叶（在动） */}
      <div style={{ position: "absolute", left: 470 + leaf, top: 118 + leaf * 0.5, width: 54, height: 34, borderRadius: 20, background: "rgba(94,234,212,0.22)", border: "1px solid " + C.cyan }} />
      {/* 行人（在动） */}
      <div style={{ position: "absolute", left: 60 + walk * 470, top: 232, width: 18, height: 42, borderRadius: 4, background: C.amber, opacity: 0.9 }} />
      {/* 帧角标 */}
      <div style={{ position: "absolute", left: 12, top: 10, fontFamily: FONT.mono, fontSize: FT.micro, color: C.inkFaint, letterSpacing: FT_T.micro }}>
        FRAME t · 1920×1080 · 30 fps
      </div>
    </div>
  );
};

export const SOpen: React.FC = () => {
  const f = useCurrentFrame();
  const id = "open";
  const t1 = beatAt(id, 2, 9);
  const t2 = beatAt(id, 4, 9);
  const t3 = beatAt(id, 6, 9);
  return (
    <Scene id={id}>
      <Head kicker="DAC 2026 / 论文精读" title="一台一直在看的摄像头" goal="从一个路口摄像头说起，问一个很朴素的问题" />
      <div style={{ position: "absolute", left: PAD, top: 300, display: "flex", gap: 60 }}>
        <div style={{ opacity: pct(f, 20, 40) }}>
          <Frame at={0} f={f} />
          <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
            <Pill text="静止：建筑 / 路面" color={C.inkFaint} bg="transparent" />
            <Pill text="在动：行人" color={C.amber} bg="rgba(251,191,36,0.10)" />
            <Pill text="在动：树叶" color={C.cyan} bg="rgba(94,234,212,0.10)" />
          </div>
        </div>
        <div style={{ width: 600, paddingTop: 6 }}>
          <div style={{ opacity: pct(f, t1, t1 + 12) }}>
            <Card label="运行时长" accent={C.cyan}>
              <div style={{ display: "flex", alignItems: "baseline", gap: 12 }}>
                <Mono size={72} color={C.ink}>24</Mono>
                <span style={{ fontFamily: FONT.sans, fontSize: FT.lead, color: C.inkDim }}>小时 / 天，不关机</span>
              </div>
            </Card>
          </div>
          <div style={{ marginTop: 22, opacity: pct(f, t2, t2 + 12) }}>
            <Card label="它做的事" accent={C.panelLine}>
              <Body color={C.inkDim}>按固定帧率采样、按全分辨率转换、每帧都传、每帧都算。</Body>
            </Card>
          </div>
          <div style={{ marginTop: 22, opacity: pct(f, t3, t3 + 12) }}>
            <Card label="这一帧里真正变了的像素" accent={C.amber}>
              <Body color={C.ink}>大部分像素，和上一帧一模一样。</Body>
            </Card>
          </div>
        </div>
      </div>
      <div style={{ position: "absolute", left: PAD, top: 300 + 349 + 96, width: CW, opacity: pct(f, sceneFrames(id) - 70, sceneFrames(id) - 30) }}>
        <Body color={C.inkFaint} size={FT.lead} style={{ fontFamily: FONT.serif }}>
          论文问的那句话：能不能只算它该算的那部分？
        </Body>
      </div>
    </Scene>
  );
};
