import React from "react";
import { Build } from "../../design/primitives";
import { C, FONT, FT } from "../../design/tokens";
import { Card, Body, Mono, K, PAD, Pages, Scene, SceneHead, fmtF, fmtInt, M, lf } from "../shared";

/** 收尾：三个数，一个判据，下一集预告。 */
export const SOutro: React.FC = () => {
  const id = "outro";
  const b = (k: number) => lf(id, k);
  const mp = M.maePrice.p5;
  return (
    <Scene id={id}>
      <SceneHead id={id} />
      <Pages id={id} at={[0, 0.45]}>
        <div>
          <div style={{ position: "absolute", left: PAD, top: 300, width: 1776 }}>
            <Body color={C.ink} size={FT.lead}>回到开头三个数。</Body>
          </div>
          {[
            { l: "收益率", v: fmtInt(M.returns.n), s: "5834 个收盘价 → 5833 个日收益", c: C.cyan },
            { l: "5% 遮挡", v: fmtInt(M.returns.p5.masked), s: "20% 是 " + fmtInt(M.returns.p20.masked) + " 个", c: C.violet },
            { l: "线性 vs 均值", v: fmtF(mp.linear, 2) + " 对 " + fmtF(mp.mean, 2), s: "价格 MAE（元）· 两个数量级", c: C.amber },
          ].map((d, i) => (
            <div key={d.l} style={{ position: "absolute", left: PAD + i * 600, top: 380, width: 560 }}>
              <Build at={b(0.04 + i * 0.03)}>
                <Card label={d.l} accent={d.c} pad={24} style={{ width: 560, height: 230 }}>
                  <div style={{ fontFamily: FONT.mono, fontSize: i === 2 ? FT.h1 : FT.display, color: d.c, lineHeight: 1.1 }}>{d.v}</div>
                  <Body size={FT.meta} style={{ marginTop: 16 }}>{d.s}</Body>
                </Card>
              </Build>
            </div>
          ))}
          <div style={{ position: "absolute", left: PAD, top: 660, width: 1776 }}>
            <Build at={b(0.16)}>
              <Card accent={C.coral} pad={22} style={{ width: 1776, height: 130 }}>
                <Body color={C.ink} size={FT.h2} style={{ fontFamily: FONT.serif }}>三种填法，一个判据：先问缺在哪，再选填法。</Body>
                <K>代码、证据、成片都在版本库里；数据哈希写在证据里，四十九条检查可以重跑</K>
              </Card>
            </Build>
          </div>
        </div>
        <div>
          <div style={{ position: "absolute", left: PAD, top: 300, width: 1776 }}>
            <Body color={C.ink} size={FT.lead}>下一集开始讲平滑：同一个问题，滞后多少。</Body>
          </div>
          {[
            { t: "简单移动平均", s: "SMA · 等权，窗口决定滞后" },
            { t: "加权移动平均", s: "WMA · 线性权重，压近端" },
            { t: "指数平滑", s: "SES · 一个 α，记忆衰减" },
          ].map((c, i) => (
            <div key={c.t} style={{ position: "absolute", left: PAD + i * 600, top: 390, width: 560 }}>
              <Build at={b(0.5 + i * 0.03)}>
                <Card label={"第 3 章 · 平滑 " + (i + 1)} accent={C.cyan} pad={24} style={{ width: 560, height: 210 }}>
                  <Body color={C.ink} size={FT.h2} style={{ fontFamily: FONT.serif }}>{c.t}</Body>
                  <Mono size={FT.meta} color={C.inkFaint} style={{ display: "block", marginTop: 14 }}>{c.s}</Mono>
                </Card>
              </Build>
            </div>
          ))}
          <div style={{ position: "absolute", left: PAD, top: 680, width: 1776 }}>
            <Build at={b(0.85)}>
              <Body color={C.inkDim} size={FT.body}>三个窗口，三种权重；那我们就下集见。</Body>
            </Build>
          </div>
        </div>
      </Pages>
    </Scene>
  );
};
