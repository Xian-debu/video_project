import React from "react";
import { C, FONT, FT } from "../../design/tokens";
import { Build } from "../../design/primitives";
import { Head, Scene, PAD, Card, Body, Mono, K, beatAt } from "../shared";

/** 边界：七类；证据等级、样本、基准、泄漏、零值、实现、等级。 */
export const SBoundary: React.FC = () => {
  const b = (i: number) => beatAt("boundary", i, 23);
  const items = [
    { k: "证据等级", t: "书里只有公式", d: "p.205 给了 MSE/MAE/MAPE/MASE，没有数据、代码、基线。全片数字来自本机快照。", f: "claims: C", c: C.coral },
    { k: "样本", t: "20 只，不是市场", d: "2020–2025、剔除停牌、20 只大盘股；存活偏差与行业集中都在。", f: "scope: 20 symbols", c: C.amber },
    { k: "基准", t: "naive-1 不是模型比较", d: "预测就是昨日收盘；MASE 用 s=5 的季节朴素做分母。没有训练任何模型。", f: "baseline: naive", c: C.cyan },
    { k: "数据泄漏", t: "分母只看训练段", d: "MASE 的分母用 2020–2023 的季节差分；测试段 2024–2025 不参与。", f: "split: 2023 | 2024", c: C.violet },
    { k: "零与负", t: "MAPE 会失效", d: "收益率有 265 个负值和 2 个零；严格版报错，跳过版计数，不补零。", f: "invalid: 53%", c: C.coral },
    { k: "实现", t: "边界是代码的一部分", d: "长度不等、空向量、NaN、Inf、s<1、分母为零，全部显式报错或返回正无穷。", f: "lang: Haskell", c: C.cyan },
    { k: "等级", t: "C 不抬成 A", d: "机制可复现，数字可复算；但没有基线、没有置信区间，不能外推成市场结论。", f: "grade: C", c: C.amber },
  ];
  const w1 = 400, w2 = 547;

  return (
    <Scene id="boundary">
      <Head kicker="06 / 什么时候不能信" title="七个边界，一把尺子" goal="公式能复用，结论不能顺手外推" />

      <div style={{ position: "absolute", left: PAD, top: 284, display: "flex", gap: 20 }}>
        {items.slice(0, 4).map((x, i) => (
          <Build key={x.k} at={b(i * 3)}>
            <Card label={x.k} accent={x.c} pad={18} style={{ width: w1, height: 252 }}>
              <div style={{ fontFamily: FONT.serif, fontSize: FT.h3, color: C.ink, lineHeight: 1.25 }}>{x.t}</div>
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
              <div style={{ fontFamily: FONT.serif, fontSize: FT.h3, color: C.ink, lineHeight: 1.25 }}>{x.t}</div>
              <Body size={FT.micro} color={C.inkDim} style={{ marginTop: 10 }}>{x.d}</Body>
              <div style={{ marginTop: 12 }}><Mono size={FT.micro} color={x.c}>{x.f}</Mono></div>
            </Card>
          </Build>
        ))}
      </div>

      <Build at={b(19)} style={{ position: "absolute", left: PAD, top: 856, width: 1680 }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 20 }}>
          <div style={{ fontFamily: FONT.serif, fontSize: FT.h2, color: C.ink }}>{"指标可复算，结论不可顺手外推。"}</div>
          <K>{"这一集只给公式、边界和一次本机快照；不给排行榜。"}</K>
        </div>
      </Build>
    </Scene>
  );
};
