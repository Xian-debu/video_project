import React from "react";
import { Build } from "../../design/primitives";
import { C, FONT, FT } from "../../design/tokens";
import { Body, Card, K, Mono, PAD, Pages, Scene, SceneHead, lf } from "../shared";

/** 收尾：三个数，然后下一集。 */
export const SOutro: React.FC = () => {
  const id = "outro";
  const b = (k: number) => lf(id, k);
  return (
    <Scene id={id}>
      <SceneHead id={id} />
      <Pages id={id} at={[0, 0.5]}>
        {/* 1 · 三个数 */}
        <div>
          <div style={{ position: "absolute", left: PAD, top: 286, width: 1776 }}>
            <Body color={C.ink} size={FT.lead}>回到开头三个数。</Body>
          </div>
          {[
            { l: "SMA20 的质心", v: "9.5", s: "等权窗口的平均等待", c: C.amber },
            { l: "线性 WMA20 的质心", v: "6.33", s: "偏心权重把等待缩短", c: C.cyan },
            { l: "频率倍数", v: "48×", s: "日线的二十根，不是五分钟的二十根", c: C.violet },
          ].map((s, i) => (
            <div key={s.l} style={{ position: "absolute", left: PAD + i * 600, top: 366, width: 560 }}>
              <Build at={b(0.02 + i * 0.03)}>
                <Card label={s.l} accent={s.c} pad={24} style={{ width: 560, height: 238 }}>
                  <div style={{ fontFamily: FONT.mono, fontSize: FT.display, color: s.c, lineHeight: 1 }}>{s.v}</div>
                  <Body size={FT.meta} style={{ marginTop: 14 }}>{s.s}</Body>
                </Card>
              </Build>
            </div>
          ))}
          <div style={{ position: "absolute", left: PAD, top: 664, width: 1776 }}>
            <Build at={b(0.1)}>
              <Card accent={C.coral} pad={20} style={{ width: 1776, height: 140 }}>
                <Body color={C.ink} size={FT.h2} style={{ fontFamily: FONT.serif }}>一个判据：先问滞后，再看曲线。</Body>
                <K>平滑器是在用滞后换稳定；换多少，可以算</K>
              </Card>
            </Build>
          </div>
        </div>

        {/* 2 · 下一集 */}
        <div>
          <div style={{ position: "absolute", left: PAD, top: 286, width: 1776 }}>
            <Body color={C.ink} size={FT.lead}>下一集讲 Holt：趋势和季节，各一个旋钮。</Body>
          </div>
          {[
            { t: "Holt 线性趋势", s: "水平与斜率，两个 α", c: C.cyan },
            { t: "Holt-Winters", s: "再给季节一个周期", c: C.amber },
            { t: "误差与区间", s: "平滑之后，还剩多少不确定", c: C.violet },
          ].map((s, i) => (
            <div key={s.t} style={{ position: "absolute", left: PAD + i * 600, top: 366, width: 560 }}>
              <Build at={b(0.56 + i * 0.03)}>
                <Card label={"第 3 章 · 平滑 " + (i + 1)} accent={s.c} pad={24} style={{ width: 560, height: 238 }}>
                  <Body color={C.ink} size={FT.h2} style={{ fontFamily: FONT.serif }}>{s.t}</Body>
                  <Mono size={FT.meta} color={s.c} style={{ display: "block", marginTop: 16 }}>{s.s}</Mono>
                </Card>
              </Build>
            </div>
          ))}
          <div style={{ position: "absolute", left: PAD, top: 664, width: 1776 }}>
            <Build at={b(0.66)}>
              <Body size={FT.meta} color={C.inkFaint}>本片关于质心的换算（α = 2/(N+1)）是本仓推导，草稿只保留在 SELF-AUTH 里；书里没有。</Body>
            </Build>
          </div>
        </div>
      </Pages>
    </Scene>
  );
};
