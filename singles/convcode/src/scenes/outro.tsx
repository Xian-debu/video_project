import React from "react";
import { C, FONT, FT, FT_T } from "../../design/tokens";
import { Build } from "../../design/primitives";
import { Card, Mono, Body, Flow, Scene, PAD, CW, beatAt, DEMO } from "../shared";

/** 结语：把三个数字留在屏幕上，然后让噪声重新出现。 */
export const SOutro: React.FC = () => {
  const beats = [0, 1, 2, 3, 4, 5].map((i) => beatAt("outro", i, 6));
  return (
    <Scene id="outro">
      <Flow y={900} count={60} speed={0.6} seed={5} />
      <div style={{ position: "absolute", left: PAD, top: 270, width: CW, textAlign: "center" }}>
        <Build at={beats[0]}>
          <div style={{ fontFamily: FONT.mono, fontSize: FT.label, letterSpacing: FT_T.label, color: C.cyan }}>{"08 / 回到噪声"}</div>
        </Build>
        <Build at={beats[1]}>
          <div style={{ fontFamily: FONT.serif, fontSize: FT.h1, color: C.ink, marginTop: 18 }}>
            它不显眼，却撑着每一次无线通信
          </div>
        </Build>
      </div>

      <Build at={beats[2]} style={{ position: "absolute", left: PAD, top: 520, width: CW }}>
        <div style={{ display: "flex", gap: 26, justifyContent: "center" }}>
          {[
            { n: "189", u: "输入位", s: "一类 + 校验 + 尾零" },
            { n: "×2", u: "速率 1/2", s: "180 度翻转不变的两条支路" },
            { n: "8×57", u: "交织", s: "一帧摊到八个突发" },
            { n: "3.7", u: "dB 增益", s: "软判决 vs 不编码（1e-3 处）" },
          ].map((x) => (
            <Card key={x.n} pad={22} style={{ width: 400 }} accent={C.cyan}>
              <Mono size={FT.display} color={C.ink}>{x.n}</Mono>
              <div style={{ fontFamily: FONT.sans, fontSize: FT.body, color: C.cyan, marginTop: 4 }}>{x.u}</div>
              <Body size={FT.meta} style={{ marginTop: 8 }}>{x.s}</Body>
            </Card>
          ))}
        </div>
      </Build>

      <Build at={beats[4]} style={{ position: "absolute", left: PAD, top: 800, width: CW, textAlign: "center" }}>
        <Body style={{ maxWidth: 1180, margin: "0 auto" }}>
          {"复现脚本见 build/generate_convcode_data.py；每档 " + DEMO.meta.berFramesPerPoint * 189 + " 个信息比特，可原样重跑。"}
        </Body>
      </Build>
    </Scene>
  );
};
