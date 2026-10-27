import React from "react";
import { useCurrentFrame } from "remotion";
import { C, FONT, FT, FT_T } from "../../design/tokens";
import { Build, CountRoll } from "../../design/primitives";
import { SCENES, TOTAL, FPS } from "../script";
import { Head, Card, Mono, Body, BitStrip, Flow, Scene, PAD, CW, beatAt, pct } from "../shared";

/** 开场：声音变成比特，比特穿过噪声。画面跟着口播的七句走。 */
export const SOpen: React.FC = () => {
  const f = useCurrentFrame();
  const beats = [0, 1, 2, 3, 4, 5, 6].map((i) => beatAt("open", i, 7));
  return (
    <Scene id="open">
      <Flow y={862} count={70} speed={0.85} seed={3} />
      <Flow y={196} count={34} speed={0.45} color={C.cyanDeep} height={4} seed={11} />
      <div style={{ position: "absolute", left: PAD, top: 250, width: 1040 }}>
        <Build at={beats[0]}>
          <Mono size={FT.label} color={C.cyan} style={{ letterSpacing: FT_T.label }}>{"GSM / 信道编码 · 1990s"}</Mono>
        </Build>
        <Build at={beats[1]} dy={26}>
          <div style={{ fontFamily: FONT.serif, fontSize: FT.cover, color: C.ink, lineHeight: 1.02, marginTop: 26, letterSpacing: FT_T.cover }}>
            卷积码
          </div>
        </Build>
        <Build at={beats[1] + 8}>
          <div style={{ width: 150, height: 3, background: C.cyan, marginTop: 30 }} />
        </Build>
        <Build at={beats[2]}>
          <div style={{ fontFamily: FONT.serif, fontSize: FT.h1, color: C.inkDim, marginTop: 30, lineHeight: 1.25 }}>
            GSM 如何在噪声里听清你
          </div>
        </Build>
        <Build at={beats[3]}>
          <Body style={{ marginTop: 26, maxWidth: 980 }}>
            一段二十毫秒的语音，被压成二百六十个比特；<br />
            在它到达天线之前，会先被加上一层看得懂错误的<b style={{ color: C.ink }}>结构</b>。
          </Body>
        </Build>
        <Build at={beats[4]}>
          <div style={{ display: "flex", gap: 30, marginTop: 40, alignItems: "center" }}>
            <Mono size={FT.meta} color={C.inkFaint}>{"3GPP TS 45.003 · V18.0.0"}</Mono>
            <Mono size={FT.meta} color={C.inkFaint}>{"TCH/FS · 全速率语音信道"}</Mono>
          </div>
        </Build>
      </div>

      <Build at={beats[2] + 4} style={{ position: "absolute", right: PAD, top: 322, width: 620 }}>
        <Card label="一帧语音" accent={C.cyan}>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 14 }}>
            <CountRoll to={260} start={beats[2] + 4} size={FT.display} color={C.ink} />
            <div style={{ marginBottom: 16 }}>
              <Mono size={FT.lead} color={C.inkDim}>{"bit"}</Mono>
              <div style={{ fontFamily: FONT.sans, fontSize: FT.label, color: C.inkFaint, marginTop: 4 }}>每 20 毫秒一帧</div>
            </div>
          </div>
          <div style={{ marginTop: 26 }}>
            <BitStrip
              bits={[1, 0, 1, 1, 0, 0, 1, 0, 1, 1, 1, 0, 0, 1, 0, 1]}
              bitW={26}
              h={40}
              from={beats[5] + 6}
              highlight={f > beats[5] + 30 ? [4, 11] : []}
              label="前 16 个比特（示意）"
            />
          </div>
          <div style={{ fontFamily: FONT.sans, fontSize: FT.meta, color: C.coral, marginTop: 18, opacity: pct(f, beats[5] + 30, beats[5] + 44) }}>
            噪声把第 5 位和第 12 位翻掉了
          </div>
        </Card>
      </Build>

      <Build at={beats[6]} style={{ position: "absolute", right: PAD, bottom: 150 }}>
        <Mono size={FT.meta} color={C.inkFaint}>
          {"全片约 " + Math.max(1, Math.round(TOTAL / FPS / 60)) + " 分钟 · " + SCENES.length + " 段 · 含可复现实测"}
        </Mono>
      </Build>
    </Scene>
  );
};