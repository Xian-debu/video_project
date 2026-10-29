import React from "react";
import { useCurrentFrame } from "remotion";
import { C, FONT, FT } from "../../design/tokens";
import { Build } from "../../design/primitives";
import { Head, Scene, PAD, Card, Body, Mono, K, Quote, Num, beatAt, V } from "../shared";

/** 开场：先摆出同一个形状的两个答案，再说明书里只有两句提名。 */
export const SOpen: React.FC = () => {
  const b = (i: number) => beatAt("open", i, 14);

  return (
    <Scene id="open">
      <Head kicker="第 9 章 / 神经微分方程" title="别只看 MSE" goal="两条序列，两个指标，和它们各自的账" />

      <div style={{ position: "absolute", left: PAD, top: 296, width: 760 }}>
        <Build at={b(5)}>
          <Quote
            width={760}
            lines={[
              "TV-ODE 在损失中引入基于总变差（TV）的感知正则化项，显式控制预测精度与时间动态保真度的平衡。",
              "评估标准需超越 MSE 的时空敏感指标（如 DTW、物理守恒律约束）。",
            ]}
          />
        </Build>
        <Build at={b(8)} style={{ marginTop: 22 }}>
          <Card label="证据等级 · C" accent={C.coral} pad={20} style={{ width: 760 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
              <div style={{ fontFamily: FONT.serif, fontSize: FT.display, lineHeight: 1, color: C.coral }}>C</div>
              <Body size={FT.body} color={C.inkDim} style={{ flex: 1 }}>
                {"书里只有机制描述：没有公式、没有数据、没有复现协议。性能数字不能当结论用。"}
              </Body>
            </div>
          </Card>
        </Build>
      </div>

      <div style={{ position: "absolute", left: 920, top: 296, width: 820 }}>
        <Build at={b(1)}>
          <Card label="同一个形状 · 平移三步" accent={C.cyan} pad={24} style={{ width: 820 }}>
            <Body size={FT.label} color={C.inkFaint}>{"逐点 MSE 与 DTW 给出的答案"}</Body>
            <div style={{ display: "flex", gap: 48, alignItems: "flex-end", marginTop: 16 }}>
              <div>
                <K>{"逐点 MSE"}</K>
                <div><Num value={V.key.shift.mse} size={FT.num} color={C.amber} /></div>
              </div>
              <div style={{ paddingBottom: 14, fontFamily: FONT.mono, fontSize: FT.h2, color: C.inkFaint }}>{"vs"}</div>
              <div>
                <K>{"DTW 代价"}</K>
                <div><Num value={V.key.shift.cost} size={FT.num} color={C.cyan} /></div>
              </div>
            </div>
            <Body size={FT.meta} color={C.inkDim} style={{ marginTop: 14 }}>
              {"同一个形状，一个被罚十五点八一，一个是零。"}
            </Body>
          </Card>
        </Build>

        <Build at={b(10)} style={{ marginTop: 22 }}>
          <Card label="本集要补的三样东西" accent={C.violet} pad={22} style={{ width: 820 }}>
            <div style={{ display: "flex", gap: 30 }}>
              {[
                ["01", "TV 的 l1 形式", "怎样把抖动写进损失"],
                ["02", "DTW 的递推", "怎样允许一个点对多个点"],
                ["03", "可复算的数", "每个屏上数字回到一次运行"],
              ].map(([n, t, d]) => (
                <div key={n} style={{ flex: 1 }}>
                  <Mono size={FT.micro} color={C.cyan}>{n}</Mono>
                  <div style={{ fontFamily: FONT.serif, fontSize: FT.h3, color: C.ink, marginTop: 4 }}>{t}</div>
                  <Body size={FT.micro} color={C.inkFaint} style={{ marginTop: 4 }}>{d}</Body>
                </div>
              ))}
            </div>
          </Card>
        </Build>
      </div>

      <div style={{ position: "absolute", left: PAD, top: 900, width: 1680, display: "flex", justifyContent: "space-between" }}>
        <Build at={b(6)}>
          <K>{"原文 · 《时序智能》p.219 · 9.3 相关应用研究 · CC BY-NC-ND 4.0"}</K>
        </Build>
        <Build at={b(11)}>
          <Mono size={FT.micro} color={C.inkFaint}>{"ts-base · ch9-tv-reg / ch9-dtw · " + V.meta.tsBaseCommit}</Mono>
        </Build>
      </div>
    </Scene>
  );
};
