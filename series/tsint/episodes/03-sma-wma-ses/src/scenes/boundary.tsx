import React from "react";
import { Build } from "../../design/primitives";
import { C, FONT, FT } from "../../design/tokens";
import { Body, Card, K, Mono, PAD, Pages, Scene, SceneHead, lf } from "../shared";

/** 边界：五条 + 一条不在公式里的。 */
export const SBoundary: React.FC = () => {
  const id = "boundary";
  const b = (k: number) => lf(id, k);
  return (
    <Scene id={id}>
      <SceneHead id={id} />
      <Pages id={id} at={[0, 0.5]}>
        {/* 1 · 前四条 */}
        <div>
          {[
            { n: "01", t: "α = 2/(N+1) 只匹配质心", s: "不匹配方差，也不匹配尾部", c: C.coral },
            { n: "02", t: "WMA 的权重方案是自由选择", s: "书里没给；换一组权，滞后就变", c: C.amber },
            { n: "03", t: "SES 没有窗口", s: "N=20 只是换算出来的等效；有效窗口是无限的", c: C.cyan },
            { n: "04", t: "初始化影响开头", s: "前三个点怎么取，会写进曲线", c: C.violet },
          ].map((r, i) => (
            <div key={r.n} style={{ position: "absolute", left: PAD + (i % 2) * 900, top: 262 + Math.floor(i / 2) * 220, width: 860 }}>
              <Build at={b(0.02 + i * 0.04)}>
                <Card accent={r.c} pad={22} style={{ width: 860, height: 190 }}>
                  <div style={{ display: "flex", gap: 22, alignItems: "baseline" }}>
                    <Mono size={FT.num} color={r.c}>{r.n}</Mono>
                    <Body color={C.ink} size={FT.h2} style={{ fontFamily: FONT.serif }}>{r.t}</Body>
                  </div>
                  <Body size={FT.meta} style={{ marginTop: 14, paddingLeft: 62 }}>{r.s}</Body>
                </Card>
              </Build>
            </div>
          ))}
          <div style={{ position: "absolute", left: PAD, top: 712, width: 1776 }}>
            <Build at={b(0.22)}>
              <Body size={FT.body} color={C.inkDim}>前四条是方法本身的边界：等价只在质心这一维成立。</Body>
            </Build>
          </div>
        </div>

        {/* 2 · 四五条与收束 */}
        <div>
          <div style={{ position: "absolute", left: PAD, top: 262, width: 1776 }}>
            <Build at={b(0.52)}>
              <Card accent={C.violet} pad={24} style={{ width: 1776, height: 200 }}>
                <div style={{ display: "flex", gap: 24, alignItems: "baseline" }}>
                  <Mono size={FT.num} color={C.violet}>05</Mono>
                  <div>
                    <Body color={C.ink} size={FT.h2} style={{ fontFamily: FONT.serif }}>频率改变一切：同样二十个点，日线是八十小时，五分钟线是一百分钟。</Body>
                    <Body size={FT.meta} style={{ marginTop: 12 }}>差四十八倍；窗口数字必须带单位，否则没法比较。</Body>
                  </div>
                </div>
              </Card>
            </Build>
          </div>
          <div style={{ position: "absolute", left: PAD, top: 500, width: 1776 }}>
            <Build at={b(0.62)}>
              <Card accent={C.coral} pad={24} style={{ width: 1776, height: 190 }}>
                <Body color={C.ink} size={FT.h2} style={{ fontFamily: FONT.serif }}>这些边界不是缺陷，是方法本身的选择。</Body>
                <Body size={FT.body} style={{ marginTop: 12 }}>你可以接受交换，但不能假装交换不存在。</Body>
              </Card>
            </Build>
          </div>
          <div style={{ position: "absolute", left: PAD, top: 726, width: 1776 }}>
            <Build at={b(0.72)}>
              <Card accent={C.inkFaint} pad={20} style={{ width: 1776, height: 120 }}>
                <Body color={C.ink} size={FT.lead} style={{ fontFamily: FONT.serif }}>还有一条不在公式里：平滑不制造信息，它只是延迟信息。</Body>
                <K>所以平滑之后的任何结论，都要问一句：它是不是原来的数据里就有</K>
              </Card>
            </Build>
          </div>
        </div>
      </Pages>
    </Scene>
  );
};
