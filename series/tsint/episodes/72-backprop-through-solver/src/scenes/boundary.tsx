import React from "react";
import { C, FONT, FT } from "../../design/tokens";
import { Build } from "../../design/primitives";
import { Head, Scene, PAD, Card, Mono, Body, Num, BP, beatAt } from "../shared";

const ITEMS = [
  {
    lab: "第一类 · 直接法的内存",
    q: "步数一大，磁带装不下",
    d: "这是复杂度，不是实现问题。200 万步的峰值内存是 20 万步的 11.955063174960559 倍。",
    n: "mem_direct_ratio",
    c: C.violet,
  },
  {
    lab: "第二类 · 伴随法的重算",
    q: "省内存，时间至少多一倍",
    d: "检查点太稀，重算变长；太密，内存又上去。K 是设计参数，不是常数。",
    n: "2× 前向",
    c: C.amber,
  },
  {
    lab: "第三类 · 刚性与不连续",
    q: "反向积分会失稳",
    d: "右端项变化太快，连续伴随没有定义；收盘价是分段常数，拐点处导数不存在。",
    n: "假设不成立",
    c: C.cyan,
  },
  {
    lab: "第四类 · 可逆性",
    q: "耗散系统倒不回去",
    d: "连续伴随要求能把状态倒着积回去。实际实现仍然存轨迹，只是存得少。",
    n: "O(T/K + K)",
    c: C.cyan,
  },
  {
    lab: "第五类 · 符号",
    q: "漏一个负号，梯度整体翻转",
    d: "错误方向版本给出 −29.262985504235210，数值上一眼可见。先跑小规模对照，再上大规模。",
    n: "grad_wrong_sign",
    c: C.amber,
  },
];

/** 边界：五类失效条件，最后交接到下一集。 */
export const SBoundary: React.FC = () => {
  const b = (i: number) => beatAt("boundary", i, 22);
  const k = BP.key;

  return (
    <Scene id="boundary">
      <Head kicker="06 / 什么时候不能信" title="什么时候不该用伴随法" goal="内存、重算、刚性、可逆性和符号，五类失效条件" />

      <div style={{ position: "absolute", left: PAD, top: 256, display: "flex", gap: 18 }}>
        {ITEMS.slice(0, 3).map((it, i) => (
          <Build key={it.lab} at={b(i * 3)}>
            <Card label={it.lab} accent={it.c} pad={18} style={{ width: 570, height: 250, display: "flex", flexDirection: "column" }}>
              <div style={{ fontFamily: FONT.serif, fontSize: FT.h2, color: C.ink }}>{it.q}</div>
              <Body size={FT.meta} style={{ marginTop: 10 }}>{it.d}</Body>
              <div style={{ marginTop: "auto" }}>
                <Mono size={FT.micro} color={it.c}>{it.n === "mem_direct_ratio" ? "ratio " : ""}{it.n === "mem_direct_ratio" ? <Num value={k.memDirectRatio} size={18} color={it.c} /> : it.n}</Mono>
              </div>
            </Card>
          </Build>
        ))}
      </div>

      <div style={{ position: "absolute", left: PAD, top: 526, display: "flex", gap: 18 }}>
        {ITEMS.slice(3).map((it, i) => (
          <Build key={it.lab} at={b(5 + i * 2)}>
            <Card label={it.lab} accent={it.c} pad={18} style={{ width: 870, height: 230, display: "flex", flexDirection: "column" }}>
              <div style={{ fontFamily: FONT.serif, fontSize: FT.h2, color: C.ink }}>{it.q}</div>
              <Body size={FT.meta} style={{ marginTop: 10, width: 780 }}>{it.d}</Body>
              <div style={{ marginTop: "auto" }}>
                <Mono size={FT.micro} color={it.c}>{it.n}</Mono>
              </div>
            </Card>
          </Build>
        ))}
      </div>

      <Build at={b(17)} style={{ position: "absolute", left: PAD, top: 790, width: 1780 }}>
        <div style={{ height: 1, background: C.panelLine, marginBottom: 14 }} />
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
          <Mono size={FT.meta} color={C.inkDim}>{"所以下一集：把梯度穿进网络，而不是只验证一条标量链。"}</Mono>
          <Mono size={FT.meta} color={C.cyan}>{"73 · neural-ode-training →"}</Mono>
        </div>
      </Build>
    </Scene>
  );
};