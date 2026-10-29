import React from "react";
import { C, FONT, FT } from "../../design/tokens";
import { Build } from "../../design/primitives";
import { Head, Scene, PAD, Card, Body, Mono, K, Chip, beatAt } from "../shared";

const TOP = [
  ["第一类 · 证据等级", "书里没有实验", "第一章只有定义、任务表和四阶段方法表；没有数据、代码、基线。本集所有数字来自本机快照，不是书的实验。", C.coral, "claims: C"],
  ["第二类 · 快照时间", "2026-10-28 之后就变了", "湖每天增长，重跑会得到新行数；画面锁在 tsa-status-2026-10-30.txt 这一次输出上。", C.amber, "snapshot: one run"],
  ["第三类 · 样本范围", "一只票不是市场", "600519 只是一只票；面板只有 120 只票一年。生存偏差、停牌、涨跌停都在，不能外推成市场结论。", C.violet, "scope: one symbol"],
];

const BOTTOM = [
  ["第四类 · 任务范围", "五个任务，四条主线", "聚类在书里只有一句列举，没有形式化定义；本系列不硬做算法，只保留名字。", "scope: 4/5"],
  ["第五类 · 性能", "没有基线就不排序", "没有切分、没有误差、没有对照模型；这一集不做「谁更好」的判断。", "no baseline"],
  ["第六类 · 实现", "Haskell 不为速度", "选它是为了让断言可判决；生产里常用 Python/C++，慢不是这里要解决的问题。", "lang: not a claim"],
  ["第七类 · 等级", "C 不抬成 A", "机制可复现，性能数字不可复现；书里的 100–100000 倍、0.82% 都不能当结论。", "grade: C"],
];

export const SBoundary: React.FC = () => {
  const b = (i: number) => beatAt("boundary", i, 27);
  return (
    <Scene id="boundary">
      <Head kicker="06 / 什么时候不能信" title="一张地图，七条边界" goal="证据等级、快照、样本、任务、性能、实现、等级" />

      <div style={{ position: "absolute", left: PAD, top: 286, width: 1776, display: "flex", gap: 18 }}>
        {TOP.map(([label, title, desc, accent, tag], i) => (
          <Build key={String(label)} at={b(1 + i * 2)}>
            <Card label={String(label)} accent={String(accent)} pad={20} style={{ width: 580, height: 220, position: "relative" }}>
              <Body size={FT.lead} color={C.ink} style={{ lineHeight: 1.25 }}>{String(title)}</Body>
              <Body size={FT.meta} color={C.inkDim} style={{ marginTop: 8, lineHeight: 1.55 }}>{String(desc)}</Body>
              <div style={{ position: "absolute", left: 20, bottom: 14 }}>
                <Mono size={FT.micro} color={String(accent)}>{String(tag)}</Mono>
              </div>
            </Card>
          </Build>
        ))}
      </div>

      <div style={{ position: "absolute", left: PAD, top: 530, width: 1776, display: "flex", gap: 16 }}>
        {BOTTOM.map(([label, title, desc, tag], i) => (
          <Build key={String(label)} at={b(8 + i * 2)}>
            <Card label={String(label)} accent={C.panelLine} pad={18} style={{ width: 432, height: 220, position: "relative" }}>
              <Body size={FT.body} color={C.ink} style={{ lineHeight: 1.25 }}>{String(title)}</Body>
              <Body size={FT.micro} color={C.inkDim} style={{ marginTop: 8, lineHeight: 1.55 }}>{String(desc)}</Body>
              <div style={{ position: "absolute", left: 18, bottom: 12 }}>
                <Mono size={FT.micro} color={C.inkFaint}>{String(tag)}</Mono>
              </div>
            </Card>
          </Build>
        ))}
      </div>

      <div style={{ position: "absolute", left: PAD, top: 786, width: 1776 }}>
        <Build at={b(23)}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 16 }}>
            <Body size={FT.lead} color={C.ink}>{"机制可复现，性能数字不可复现。"}</Body>
            <K>{"这一集只给地图和账本；不给排行榜。"}</K>
          </div>
        </Build>
      </div>
    </Scene>
  );
};
