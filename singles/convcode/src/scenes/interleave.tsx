import React from "react";
import { C, FONT, FT, FT_T } from "../../design/tokens";
import { Build } from "../../design/primitives";
import { Card, Mono, Body, Plate, Head, Scene, PAD, beatAt, DEMO } from "../shared";

const COLS = 24;
const ROWS = 8;
const CW = 17;

const Row: React.FC<{ bad: number[]; label?: string; tint?: string }> = ({ bad, label, tint = C.coral }) => (
  <div>
    {label ? <div style={{ fontFamily: FONT.mono, fontSize: FT.micro, color: C.inkFaint, marginBottom: 6, letterSpacing: FT_T.micro }}>{label}</div> : null}
    <div style={{ display: "flex", gap: 4 }}>
      {Array.from({ length: COLS }).map((_, i) => (
        <div key={i} style={{
          width: CW, height: 22, borderRadius: 3, background: bad.includes(i) ? tint : C.panel,
          border: "1px solid " + (bad.includes(i) ? tint : C.panelLine),
        }} />
      ))}
    </div>
  </div>
);

/** 交织：同样 24 个错，挤在一行 vs 摊到八行。右边是标准里的规则原文。 */
export const SInterleave: React.FC = () => {
  const beats = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => beatAt("interleave", i, 10));
  const burst = [3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 0, 1, 2];
  return (
    <Scene id="interleave">
      <Head kicker="05 / 把错误摊开" title="鸡蛋不要放在一个篮子里" goal="为什么编码之后还要再打乱一次" />

      <Build at={beats[3]} style={{ position: "absolute", left: PAD, top: 288, width: 900 }}>
        <Card label="没有交织 / 24 位的干扰落在一个突发上" accent={C.coral} pad={20}>
          <Row bad={burst} />
          <div style={{ fontFamily: FONT.sans, fontSize: FT.meta, color: C.coral, marginTop: 12 }}>
            卷积码一次只能纠几个错；24 个连错，直接放弃这一帧
          </div>
        </Card>
      </Build>

      <Build at={beats[5]} style={{ position: "absolute", left: PAD, top: 520, width: 900 }}>
        <Card label="交织后 / 同样的 24 位分散到八个突发" accent={C.cyan} pad={20}>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {Array.from({ length: ROWS }).map((_, r) => (
              <Row key={r} bad={[r, r + 8, r + 16].filter((x) => x < COLS)} label={r === 0 ? "突发 0 → 7（每行 3 位）" : undefined} />
            ))}
          </div>
          <div style={{ fontFamily: FONT.sans, fontSize: FT.meta, color: C.inkDim, marginTop: 12 }}>
            每行只剩 3 个错，落进不同帧的纠错能力里
          </div>
        </Card>
      </Build>

      <Build at={beats[4]} style={{ position: "absolute", right: PAD, top: 288, width: 840 }}>
        <Plate id="interleave" width={840} caption="原文 §3.1.3：i(B,j)=c(n,k)，块对角交织，深度 4" />
      </Build>

      <Build at={beats[6]} style={{ position: "absolute", right: PAD, top: 800, width: 840 }}>
        <Card label="代价" accent={C.amber} pad={20}>
          <div style={{ display: "flex", gap: 34, alignItems: "baseline" }}>
            <div>
              <Mono size={FT.num} color={C.amber}>{"8 突发"}</Mono>
              <div style={{ fontFamily: FONT.sans, fontSize: FT.meta, color: C.inkFaint, marginTop: 4 }}>一帧要等八个突发才收齐</div>
            </div>
            <Body size={FT.meta} style={{ flex: 1 }}>
              交织不增加任何冗余，它只是把时间上的连错，换成空间上的分散。代价是延迟：约 40 ms。
            </Body>
          </div>
        </Card>
      </Build>
    </Scene>
  );
};