import React from "react";
import { C, FONT, FT } from "../../design/tokens";
import { Build } from "../../design/primitives";
import { Head, Scene, PAD, Card, Body, Mono, K, beatAt } from "../shared";

/** 边界：七类；证据、标签、分数、样本、阈值、单类、等级。 */
export const SBoundary: React.FC = () => {
  const b = (i: number) => beatAt("boundary", i, 24);
  const items = [
    { k: "证据等级", t: "书里只有定义", d: "p.206 给了 P/R/Acc/Fβ/AUC/AP，没有代码、数据、实验。全片数字来自本机快照。", f: "claims: C", c: C.coral },
    { k: "标签", t: "未来五日跌 5%", d: "标签是人事先定的；换一个跌幅、换一个窗口，正类就换一批。", f: "label: return < -5%", c: C.amber },
    { k: "分数", t: "不是模型输出", d: "分数 = 20 日已实现波动率的 250 日 z-score；手工特征，不是训练出来的。", f: "score: vol z", c: C.cyan },
    { k: "样本", t: "20 只大盘股", d: "2020–2025、六年、20 只；不是全市场，行业与市值都偏大。", f: "scope: 20 symbols", c: C.violet },
    { k: "阈值", t: "事先写死", d: "1.0、1.5、2.0 三档都是事前定的；没有在测试集上挑最好看的那个。", f: "thresholds: 3", c: C.cyan },
    { k: "单类", t: "AUC 没有定义", d: "一只股票没有正类，AUC 就没有定义；代码返回空值，不返回 0.5。", f: "single-class: Nothing", c: C.coral },
    { k: "等级", t: "C 不抬成 A", d: "机制可复现、数字可复算；但没有基线模型、没有置信区间，不能外推。", f: "grade: C", c: C.amber },
  ];
  const w1 = 400, w2 = 547;
  return (
    <Scene id="boundary">
      <Head kicker="06 / 什么时候不能信" title="七个边界，一把尺子" goal="公式能复用，结论不能外推" />

      <div style={{ position: "absolute", left: PAD, top: 284, display: "flex", gap: 20 }}>
        {items.slice(0, 4).map((x, i) => (
          <Build key={x.k} at={b(i * 3)}>
            <Card label={x.k} accent={x.c} pad={18} style={{ width: w1, height: 252 }}>
              <div style={{ fontFamily: FONT.serif, fontSize: FT.h2, color: C.ink, lineHeight: 1.25 }}>{x.t}</div>
              <Body size={FT.micro} color={C.inkDim} style={{ marginTop: 10 }}>{x.d}</Body>
              <div style={{ marginTop: 12 }}><Mono size={FT.micro} color={x.c}>{x.f}</Mono></div>
            </Card>
          </Build>
        ))}
      </div>

      <div style={{ position: "absolute", left: PAD, top: 556, display: "flex", gap: 20 }}>
        {items.slice(4).map((x, i) => (
          <Build key={x.k} at={b(12 + i * 2)}>
            <Card label={x.k} accent={x.c} pad={18} style={{ width: w2, height: 252 }}>
              <div style={{ fontFamily: FONT.serif, fontSize: FT.h2, color: C.ink, lineHeight: 1.25 }}>{x.t}</div>
              <Body size={FT.micro} color={C.inkDim} style={{ marginTop: 10 }}>{x.d}</Body>
              <div style={{ marginTop: 12 }}><Mono size={FT.micro} color={x.c}>{x.f}</Mono></div>
            </Card>
          </Build>
        ))}
      </div>

      <Build at={b(20)} style={{ position: "absolute", left: PAD, top: 856, width: 1680 }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 20 }}>
          <div style={{ fontFamily: FONT.serif, fontSize: FT.h2, color: C.ink }}>{"指标可复算，结论不可外推。"}</div>
          <K>{"这一集给公式、边界和一次本机快照；不给排行榜。"}</K>
        </div>
      </Build>
    </Scene>
  );
};
