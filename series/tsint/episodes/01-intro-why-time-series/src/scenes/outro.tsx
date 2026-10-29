import React from "react";
import { C, FONT, FT } from "../../design/tokens";
import { Build } from "../../design/primitives";
import { Head, Scene, PAD, Card, Body, Mono, Num, K, Chip, beatAt, V } from "../shared";

const CHAPTERS = [
  { id: "ch01", n: 1, name: "介绍" },
  { id: "ch02", n: 15, name: "基础概念" },
  { id: "ch03", n: 13, name: "预测" },
  { id: "ch04", n: 12, name: "异常检测" },
  { id: "ch05", n: 8, name: "分类" },
  { id: "ch06", n: 7, name: "自动分析" },
  { id: "ch07", n: 8, name: "基础模型" },
  { id: "ch08", n: 5, name: "测评基准" },
  { id: "ch09", n: 5, name: "神经微分方程" },
];

export const SOutro: React.FC = () => {
  const b = (i: number) => beatAt("outro", i, 14);
  return (
    <Scene id="outro">
      <Head kicker="07 / 一句话" title="先问任务，再问模型。" goal="五个任务，四次迁移，一条可复算的管线" />

      <div style={{ position: "absolute", left: PAD, top: 300, width: 1776, display: "flex", gap: 22 }}>
        {[
          ["任务", "五个任务，四条主线", "预测 / 异常检测 / 分类 / 插值；聚类只提名。"],
          ["方法", "四次迁移，偏置搬家", "方程 → 特征 → 结构 → 数据；不是四个时代。"],
          ["证据", "一条管线，142 条断言", "ts-admin 湖 → 6 个切片 → Haskell 实现 → cabal test。"],
        ].map(([k, t, d], i) => (
          <Build key={k} at={b(1 + i * 3)}>
            <Card label={k} accent={[C.cyan, C.violet, C.amber][i]} pad={20} style={{ width: 577, height: 196 }}>
              <Body size={FT.lead} color={C.ink} style={{ lineHeight: 1.3 }}>{t}</Body>
              <Body size={FT.meta} color={C.inkDim} style={{ marginTop: 10, lineHeight: 1.6 }}>{d}</Body>
            </Card>
          </Build>
        ))}
      </div>

      <div style={{ position: "absolute", left: PAD, top: 540, width: 1776 }}>
        <Build at={b(8)}>
          <Card label="九章地图 · 74 集 / 190 个算法" accent={C.cyan} pad={18} style={{ width: 1776, height: 200 }}>
            <div style={{ display: "flex", gap: 10 }}>
              {CHAPTERS.map((c) => (
                <div key={c.id} style={{ flex: 1, borderLeft: "2px solid " + (c.id === "ch01" ? C.cyan : C.panelLine), paddingLeft: 10 }}>
                  <Mono size={FT.micro} color={c.id === "ch01" ? C.cyan : C.inkFaint}>{c.id}</Mono>
                  <div style={{ marginTop: 2, fontFamily: FONT.sans, fontSize: 18, color: C.ink }}>{c.name}</div>
                  <div style={{ marginTop: 2 }}><Mono size={FT.meta} color={C.inkFaint}>{c.n + " 集"}</Mono></div>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 12, borderTop: "1px solid " + C.panelLine, paddingTop: 10 }}>
              <Body size={FT.meta} color={C.inkFaint}>
                {"第一章是地图；第二到九章逐章把算法写成实现。每集不超过三个完整 Haskell 算法，每个算法有测试、有证据、有真实数据上的行为演示。"}
              </Body>
            </div>
          </Card>
        </Build>
      </div>

      <div style={{ position: "absolute", left: PAD, top: 782, width: 1776 }}>
        <Build at={b(11)}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 18 }}>
            <Chip color={C.coral}>{"下一集"}</Chip>
            <Body size={FT.lead} color={C.ink}>{"缺失值三法：三种补洞，先看谁在改方差。"}</Body>
          </div>
        </Build>
      </div>

      <div style={{ position: "absolute", left: PAD, top: 900, width: 1776 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
          <K>{"《时序智能》 · 74 集 · 190 个算法 · 每集可复算"}</K>
          <Mono size={FT.meta} color={C.cyan}>{"01 / 74"}</Mono>
        </div>
      </div>
    </Scene>
  );
};