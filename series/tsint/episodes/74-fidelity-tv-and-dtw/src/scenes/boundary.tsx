import React from "react";
import { C, FONT, FT } from "../../design/tokens";
import { Build } from "../../design/primitives";
import { Head, Scene, PAD, Card, Body, Mono, K, beatAt } from "../shared";

const ITEMS = [
  { n: "第一类 · 证据等级", t: "45.9% 只能标 C", d: "没有基线、数据、硬件；书里只有两段机制描述。", tag: "claims: C", color: C.coral },
  { n: "第二类 · 量纲", t: "TV 的 l1 是本集补的", d: "换成平方 TV，数值会变；公式不是原文给的。", tag: "inferred", color: C.amber },
  { n: "第三类 · λ 的甜区", t: "只对这条合成序列成立", d: "换数据、换噪声，0.005 会移动；不能照搬。", tag: "scope: n=120", color: C.violet },
  { n: "第四类 · 峰值", t: "TV 会抹掉拐点", d: "冲击、尖峰、阶跃，都是 TV 要罚的东西。", tag: "l1 penalty", color: C.coral },
  { n: "第五类 · 度量", t: "DTW 不满足三角不等式", d: "反例差出 4；不同长度还要先归一化。", tag: "violation 4", color: C.violet },
  { n: "第六类 · 复杂度", t: "DTW 不是免费的", d: "无窗口 n×m；窗口提速，但可能挡掉最优路径。", tag: "O(nm)", color: C.amber },
  { n: "第七类 · 数据", t: "合成序列只验证定义", d: "它能复算，不能替代真实任务上的结论。", tag: "synthetic", color: C.cyan },
];

/** 边界：七条限制，以及一句总的可信度判断。 */
export const SBoundary: React.FC = () => {
  const b = (i: number) => beatAt("boundary", i, 21);
  const row1 = ITEMS.slice(0, 3);
  const row2 = ITEMS.slice(3);

  const Cell: React.FC<{ item: typeof ITEMS[number]; width: number; at: number }> = ({ item, width, at }) => (
    <Build at={at} style={{ width, position: "relative" }}>
      <Card label={item.n} accent={item.color} pad={18} style={{ width, height: 220, position: "relative" }}>
        <div style={{ fontFamily: FONT.serif, fontSize: FT.h3, color: C.ink, lineHeight: 1.3 }}>{item.t}</div>
        <Body size={FT.micro} color={C.inkDim} style={{ marginTop: 10 }}>{item.d}</Body>
        <div style={{ position: "absolute", bottom: 16 }}>
          <Mono size={FT.micro} color={item.color}>{item.tag}</Mono>
        </div>
      </Card>
    </Build>
  );

  return (
    <Scene id="boundary">
      <Head kicker="06 / 什么时候不能信" title="两个数字，七条边界" goal="C 级声明、量纲、度量、复杂度" />

      <div style={{ position: "absolute", left: PAD, top: 300, display: "flex", gap: 22 }}>
        {row1.map((item, i) => <Cell key={item.n} item={item} width={545} at={b(i * 2)} />)}
      </div>

      <div style={{ position: "absolute", left: PAD, top: 546, display: "flex", gap: 16 }}>
        {row2.map((item, i) => <Cell key={item.n} item={item} width={408} at={b(7 + i * 2)} />)}
      </div>

      <div style={{ position: "absolute", left: PAD, top: 806, width: 1680, display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
        <Build at={b(18)}>
          <div style={{ fontFamily: FONT.serif, fontSize: FT.h2, color: C.ink, lineHeight: 1.3 }}>{"机制可复现，性能数字不可复现。"}</div>
        </Build>
        <Build at={b(20)}>
          <div style={{ textAlign: "right" }}>
            <K>{"两种不同的可信度"}</K>
            <div><Mono size={FT.micro} color={C.inkFaint}>{"C / C · 本集推断"}</Mono></div>
          </div>
        </Build>
      </div>
    </Scene>
  );
};