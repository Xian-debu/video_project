import React from "react";
import { C, FONT, FT, FT_T } from "../../design/tokens";
import { Build } from "../../design/primitives";
import { DEMO } from "../shared";
import { Card, Mono, Body, BitStrip, Head, Scene, PAD, CW, beatAt, pct } from "../shared";

/** 问题：冗余换可靠，代价是带宽。左边是寄信的类比，右边是不编码时的误比特率。 */
export const SProblem: React.FC = () => {
  const beats = [0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => beatAt("problem", i, 9));
  const uncoded0 = DEMO.ber.find((p) => p.ebn0Db === 0);
  const rate = ((uncoded0 ? uncoded0.uncoded : 0.07876) * 100).toFixed(1);
  return (
    <Scene id="problem">
      <Head kicker="01 / 冗余的代价" title="多加一点，换回很多" goal="信道编码要解决的是什么问题" />

      <Build at={beats[0]} style={{ position: "absolute", left: PAD, top: 292, width: 780 }}>
        <Card label="类比 / 寄信时多写一遍地址" accent={C.cyan}>
          <div style={{ fontFamily: FONT.sans, fontSize: FT.body, color: C.inkDim, lineHeight: 1.8 }}>
            <div>北京市海淀区中关村科学院南路 6 号</div>
            <div>北京市海淀区中关村科学院南路 6 号</div>
          </div>
          <div style={{ fontFamily: FONT.sans, fontSize: FT.meta, color: C.inkFaint, marginTop: 16 }}>
            两行地址里错一份，收信人仍然能猜对
          </div>
        </Card>
      </Build>

      <Build at={beats[2]} style={{ position: "absolute", left: PAD, top: 520, width: 780 }}>
        <Card label="代价" accent={C.amber}>
          <Body>
            冗余要占带宽。多一倍冗余，就少一半能传信息的比特；<br />
            所以工程问题不是「要不要加」，而是<b style={{ color: C.ink }}>「用多少换多少」</b>。
          </Body>
        </Card>
      </Build>

      <Build at={beats[6]} style={{ position: "absolute", right: PAD, top: 292, width: 880 }}>
        <Card label="没有编码的链路 · BPSK / AWGN" accent={C.coral}>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 16 }}>
            <div style={{ fontFamily: FONT.mono, fontSize: FT.display, color: C.coral, fontVariantNumeric: "tabular-nums" }}>{rate}%</div>
            <div style={{ marginBottom: 18, fontFamily: FONT.sans, fontSize: FT.body, color: C.inkDim }}>误比特率 · 0 dB</div>
          </div>
          <div style={{ marginTop: 22 }}>
            <BitStrip
              bits={[1, 1, 0, 0, 1, 0, 1, 1, 0, 0, 1, 1, 0, 1, 0, 0, 1, 1, 0, 1, 0, 1, 0, 0, 1]}
              bitW={26}
              h={38}
              from={beats[6] + 10}
              highlight={[5, 12]}
              label="25 个比特里翻了 2 个（示意）"
            />
          </div>
          <div style={{ fontFamily: FONT.sans, fontSize: FT.meta, color: C.inkFaint, marginTop: 18 }}>
            100 个比特错 8 个，语音已经很难听清
          </div>
        </Card>
      </Build>

      <Build at={beats[8]} style={{ position: "absolute", left: PAD, top: 792, width: CW }}>
        <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
          <div style={{ width: 160, height: 2, background: C.cyan }} />
          <div style={{ fontFamily: FONT.serif, fontSize: FT.h2, color: C.ink }}>
            目标：用最少的冗余，换最多的可靠
          </div>
          <div style={{ fontFamily: FONT.mono, fontSize: FT.meta, color: C.inkFaint, letterSpacing: FT_T.meta }}>
            编码增益 · coding gain
          </div>
        </div>
      </Build>
    </Scene>
  );
};
