import React from "react";
import { AbsoluteFill } from "remotion";
import { C, FONT, FT, FT_T } from "../../design/tokens";
import { PAD, CW, M, pageAt, Pages, Scene, SceneHead, Stat, K, Mono, Body, Card, Row, Verdict } from "../shared";

export const SOutro: React.FC = () => (
  <Scene id="outro">
    <SceneHead id="outro" />
    <Pages id="outro" at={[0]}>
      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 330, width: 1120 }}>
          <div style={{ fontFamily: FONT.serif, fontSize: 64, color: C.ink, lineHeight: 1.35 }}>
            递归用串行换简单，<br />分段用切块换速度。
          </div>
          <Body style={{ marginTop: 26, maxWidth: 1000 }} size={FT.body}>
            快的未必准，准的未必平滑。第 24 步分段反超 0.016，不是碾压，是另一条路。
          </Body>
          <div style={{ marginTop: 44 }}>
            <Row name="下一集" value="序列压缩三法" note="池化、卷积、补丁：把长序列压短" width={1000} />
            <Row name="本集证词" value="两条路各有各的代价" note="证据 31/31，零失败" width={1000} />
          </div>
        </div>
      </AbsoluteFill>
      <AbsoluteFill>
        <div style={{ position: "absolute", left: 1300, top: 380, width: 476 }}>
          <Card label="交付" accent={C.cyan} style={{ width: 476, height: 240 }}>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <Verdict ok label="实现" />
              <Verdict ok label="证据" />
              <Verdict ok label="成片" />
            </div>
            <Mono size={FT.meta} color={C.inkFaint} style={{ display: "block", marginTop: 16 }}>第 25 集 · 完</Mono>
          </Card>
          <Card label="编号" accent={C.amber} style={{ width: 476, height: 160, marginTop: 22 }}>
            <div style={{ fontFamily: FONT.mono, fontSize: 40, color: C.ink }}>E25 / 74</div>
          </Card>
        </div>
      </AbsoluteFill>
    </Pages>
  </Scene>
);
