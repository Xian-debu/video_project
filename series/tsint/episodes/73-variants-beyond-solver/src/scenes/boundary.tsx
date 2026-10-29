import React from "react";
import { C, FONT, FT } from "../../design/tokens";
import { Build } from "../../design/primitives";
import { Head, Scene, PAD, Card, Body, Mono, K, beatAt } from "../shared";

type Item = { n: string; label: string; title: string; body: string; foot: string; color: string };

const ITEMS: Item[] = [
  { n: "01", label: "第一类 · 证据等级", title: "书里的数字都标 C", body: "CfC 的 100–100000 倍没有基线、数据和硬件；GM-ODE 的 0.82%/1.13% 没有划分与预处理。", foot: "claims: C / C", color: C.coral },
  { n: "02", label: "第二类 · 标量近似", title: "一个数不等于整个网络", body: "完整 CfC 还有门控、归一化和多层耦合；这里只验了标量闭环，不能外推成模型精度。", foot: "scope: scalar only", color: C.violet },
  { n: "03", label: "第三类 · 线性假设", title: "白化方程抓不住拐点", body: "GM(1,1) 的白化方程是线性的；真实序列有季节、拐点和冲击，一个指数不够。", foot: "model: linear ODE", color: C.amber },
  { n: "04", label: "第四类 · 小样本", title: "MAPE 会被小分母放大", body: "观测接近零时百分比失真；0.82 与 1.13 是两个能源任务上的数，不能直接搬到别的数据。", foot: "metric: unstable near 0", color: C.cyan },
  { n: "05", label: "第五类 · 计算账", title: "GM-ODE 没有省求解器", body: "它仍用 RK4 积分；换来的是小样本下的结构先验，不是更少的函数求值。", foot: "solver: still RK4", color: C.inkDim },
];

/** 边界：五条不能信的地方，最后收在「机制可复现、性能数字不可复现」。 */
export const SBoundary: React.FC = () => {
  const b = (i: number) => beatAt("boundary", i, 18);

  return (
    <Scene id="boundary">
      <Head kicker="06 / 什么时候不能信" title="两个数字，五条边界" goal="C 级声明、标量近似、线性假设、小样本、求解器仍在" />

      <div style={{ position: "absolute", left: PAD, top: 286, width: 1716, display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 18 }}>
        {ITEMS.slice(0, 3).map((it, i) => (
          <Build key={it.n} at={b(i * 2)}>
            <Card label={it.label} accent={it.color} pad={18} style={{ height: 268, position: "relative" }}>
              <div style={{ fontFamily: FONT.serif, fontSize: FT.h2, color: C.ink, lineHeight: 1.25 }}>{it.title}</div>
              <Body size={FT.meta} color={C.inkDim} style={{ marginTop: 12 }}>{it.body}</Body>
              <div style={{ position: "absolute", left: 18, bottom: 14 }}><Mono size={FT.micro} color={it.color}>{it.foot}</Mono></div>
            </Card>
          </Build>
        ))}
      </div>

      <div style={{ position: "absolute", left: PAD, top: 584, width: 1716, display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 18 }}>
        {ITEMS.slice(3).map((it, i) => (
          <Build key={it.n} at={b(6 + i)}>
            <Card label={it.label} accent={it.color} pad={18} style={{ height: 232, position: "relative" }}>
              <div style={{ fontFamily: FONT.serif, fontSize: FT.h2, color: C.ink, lineHeight: 1.25 }}>{it.title}</div>
              <Body size={FT.meta} color={C.inkDim} style={{ marginTop: 12 }}>{it.body}</Body>
              <div style={{ position: "absolute", left: 18, bottom: 14 }}><Mono size={FT.micro} color={it.color}>{it.foot}</Mono></div>
            </Card>
          </Build>
        ))}
      </div>

      <div style={{ position: "absolute", left: PAD, top: 856, width: 1716, display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
        <Build at={b(10)}>
          <div style={{ fontFamily: FONT.serif, fontSize: FT.lead, color: C.ink }}>
            {"机制可复现，性能数字不可复现。"}
          </div>
        </Build>
        <Build at={b(12)}>
          <K>{"两种不同的可信度"}</K>
        </Build>
      </div>
    </Scene>
  );
};
