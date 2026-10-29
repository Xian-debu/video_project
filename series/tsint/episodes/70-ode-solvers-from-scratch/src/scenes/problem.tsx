import React from "react";
import { C, FONT, FT, FT_T } from "../../design/tokens";
import { Build } from "../../design/primitives";
import { Math as TeX, MathLine } from "../../design/Math";
import { Card, Mono, Body, Plot, Head, Scene, PAD, ODE, beatAt } from "../shared";

const QA = [
  { n: "01", q: "单步公式怎么写", a: "把导数换成差商：欧拉一行，RK4 四行" },
  { n: "02", q: "误差多大", a: "局部截断误差的阶，决定走一万步后偏多少" },
  { n: "03", q: "什么时候失效", a: "稳定域、光滑性、成本：三条边界各自会咬人" },
];

/** 问题：连续模型天天有，解析解很少；观测还是离散的。 */
export const SProblem: React.FC = () => {
  const beats = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15].map((i) => beatAt("problem", i, 16));
  const rows = ODE.stock.rows;
  const wave = Array.from({ length: 240 }, (_, i) => ({
    x: (i / 239) * rows.length, y: Math.sin((i / 239) * Math.PI * 3.6) * 0.34 + 0.5,
  }));
  return (
    <Scene id="problem">
      <Head kicker="01 / 问题" title="没有解析解的时候" goal="为什么时间序列研究绕不开数值积分" />

      <div style={{ position: "absolute", left: PAD, top: 286, width: 860 }}>
        <Build at={beats[2]}>
          <Card label="初值问题 · 书里式 9.11" accent={C.cyan} pad={26}>
            <TeX tex={"\\frac{\\mathrm{d}x}{\\mathrm{d}t} = f(t, x), \\qquad x(t_0) = x_0"} block size={44} />
            <Body size={FT.meta} style={{ marginTop: 10 }}>
              {"右端项给出「此刻变化多快」，初值给出「从哪里出发」，轨迹就唯一确定。"}
            </Body>
          </Card>
        </Build>

        <Build at={beats[4]} style={{ marginTop: 20 }}>
          <Card label="两类右端项" pad={22}>
            <div style={{ display: "flex", gap: 18 }}>
              <div style={{ flex: 1 }}>
                <Mono size={FT.label} color={C.cyan}>{"教科书 · 可积"}</Mono>
                <Body size={FT.meta} style={{ marginTop: 6 }}>{"复利、弹簧、少数线性系统：写出公式，直接算。"}</Body>
              </div>
              <div style={{ width: 1, background: C.panelLine }} />
              <div style={{ flex: 1 }}>
                <Mono size={FT.label} color={C.amber}>{"真实模型 · 只有代码"}</Mono>
                <Body size={FT.meta} style={{ marginTop: 6 }}>{"神经网络、分段规则、查表：只能一步一步推。"}</Body>
              </div>
            </div>
          </Card>
        </Build>

        <div style={{ display: "flex", gap: 16, marginTop: 20 }}>
          {QA.map((q, i) => (
            <Build key={q.n} at={beats[10 + i]}>
              <Card accent={i === 0 ? C.cyan : i === 1 ? C.amber : C.coral} pad={16} style={{ width: 268, height: 156 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                  <Mono size={FT.micro} color={C.inkFaint}>{q.n}</Mono>
                  <Mono size={FT.micro} color={C.inkFaint}>{"本集"}</Mono>
                </div>
                <div style={{ fontFamily: FONT.serif, fontSize: FT.h2, marginTop: 10 }}>{q.q}</div>
                <Body size={FT.tiny} style={{ marginTop: 8 }}>{q.a}</Body>
              </Card>
            </Build>
          ))}
        </div>
      </div>

      <div style={{ position: "absolute", left: 1010, top: 286, width: 830 }}>
        <Build at={beats[6]}>
          <Card label="真实观测 · 离散且带噪" accent={C.violet} pad={22}>
            <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between" }}>
              <Mono size={FT.meta} color={C.violet}>{ODE.meta.stock.code} · 2019 下半年</Mono>
              <Mono size={FT.micro} color={C.inkFaint}>{ODE.meta.stock.rows + " 个交易日"}</Mono>
            </div>
            <div style={{ marginTop: 8 }}>
              <Plot w={786} h={250} at={beats[7]} dur={50}
                x={(v) => (v / (rows.length - 1)) * 786}
                y={(v) => 250 - v * 250}
                series={[
                  {
                    pts: rows.map((r, i) => ({ x: i, y: r.v })),
                    color: C.violet, width: 2, dot: true,
                  },
                ]} />
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
              <Mono size={FT.micro} color={C.inkFaint}>{"归一化收盘价（前复权）"}</Mono>
              <Mono size={FT.micro} color={C.inkFaint}>{"ts-admin · 5e80ec3"}</Mono>
            </div>
          </Card>
        </Build>

        <Build at={beats[8]} style={{ marginTop: 22 }}>
          <Card label="连续模型 · 一条光滑轨迹" accent={C.cyan} pad={18}>
            <Plot w={786} h={140} at={beats[9]} dur={50}
              x={(v) => (v / 239) * 786} y={(v) => 140 - v * 140}
              series={[{ pts: wave, color: C.cyan, width: 2.5 }]} />
            <Body size={FT.meta} style={{ marginTop: 8 }}>
              {"模型给的是任意时刻的值；数据只在收盘那一刻被采到。"}
            </Body>
          </Card>
        </Build>

        <Build at={beats[15]} style={{ marginTop: 16 }}>
          <Mono size={FT.meta} color={C.inkFaint}>{"数值积分 = 在两个世界之间搭桥"}</Mono>
        </Build>
      </div>
    </Scene>
  );
};
