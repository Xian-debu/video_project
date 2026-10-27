import React from "react";
import { C, FONT, FT, FT_T } from "../../design/tokens";
import { Build } from "../../design/primitives";
import { Card, Mono, Body, Plate, Head, Scene, PAD, CW, beatAt } from "../shared";

const Arrow: React.FC<{ at: number }> = () => <div style={{ height: 16, width: 2, background: C.panelLine, margin: "0 auto" }} />;

const Box: React.FC<{ label: string; value: string; accent?: string; w?: number }> = ({ label, value, accent = C.panelLine, w }) => (
  <div style={{
    width: w, background: C.panel, border: "1px solid " + C.panelLine, borderLeft: "3px solid " + accent,
    borderRadius: 10, padding: "12px 18px", boxSizing: "border-box",
  }}>
    <div style={{ fontFamily: FONT.sans, fontSize: FT.meta, color: C.inkFaint }}>{label}</div>
    <div style={{ fontFamily: FONT.mono, fontSize: FT.h2, color: C.ink, marginTop: 4, fontVariantNumeric: "tabular-nums" }}>{value}</div>
  </div>
);

/** 标准：TCH/FS 一帧怎么切、怎么加保护。左边是我们画的流水线，右边是原文。 */
export const SSpec: React.FC = () => {
  const beats = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => beatAt("spec", i, 10));
  return (
    <Scene id="spec">
      <Head kicker="02 / TS 45.003" title="标准里的那张图" goal="GSM 全速率语音信道怎么切分一帧" />

      <div style={{ position: "absolute", left: PAD, top: 292, width: 960 }}>
        <Build at={beats[1]}>
          <Box label="语音编码器输出 · 20 ms" value="260 bit" accent={C.cyan} w={520} />
        </Build>
        <Arrow at={beats[2]} />
        <Build at={beats[2]}>
          <div style={{ display: "flex", gap: 24 }}>
            <Box label="一类 / 对错误敏感" value="182 bit" accent={C.cyan} w={392} />
            <Box label="二类 / 原样发出" value="78 bit" accent={C.amber} w={392} />
          </div>
        </Build>
        <Arrow at={beats[3]} />
        <Build at={beats[3]}>
          <div style={{ display: "flex", gap: 24 }}>
            <Box label="一类里挑出最重要的 50 位，加 3 个校验位" value="53 bit" accent={C.cyan} w={392} />
            <div style={{ display: "flex", alignItems: "center", fontFamily: FONT.sans, fontSize: FT.meta, color: C.inkFaint, width: 392, lineHeight: 1.6 }}>
              校验位只能告诉你「这 50 位里有错」，<br />不能告诉你错在哪。
            </div>
          </div>
        </Build>
        <Arrow at={beats[4]} />
        <Build at={beats[4]}>
          <div style={{ display: "flex", gap: 24 }}>
            <Box label="重排 + 3 校验 + 4 尾比特" value="189 bit" accent={C.cyan} w={392} />
            <Box label="卷积码 1/2 · K=5" value="378 bit" accent={C.violet} w={392} />
          </div>
        </Build>
        <Arrow at={beats[5]} />
        <Build at={beats[5]}>
          <Box label="378 + 78 二类 = 一帧编码后的长度" value="456 bit" accent={C.cyan} w={808} />
        </Build>
        <Build at={beats[6]}>
          <div style={{ fontFamily: FONT.sans, fontSize: FT.meta, color: C.inkFaint, marginTop: 20 }}>
            编码后 456 位，正好是 8 个突发里每突发的 57 位：先编码，再摊开。
          </div>
        </Build>
      </div>

      <Build at={beats[7]} style={{ position: "absolute", right: PAD, top: 292, width: 700 }}>
        <Plate id="parity" width={700} caption="原文 §3.1.2.1：前 50 位加 3 个校验位，生成多项式 g(D)=D³+D+1" />
      </Build>
      <Build at={beats[9]} style={{ position: "absolute", right: PAD, top: 700, width: 700 }}>
        <Card label="为什么是 50 位" accent={C.amber} pad={20}>
          <Body size={FT.meta}>
            一类 182 位里，语音最敏感的是前 50 位。校验位只做检错：知道「翻了」，再交给下一层去纠。
          </Body>
        </Card>
      </Build>
    </Scene>
  );
};
