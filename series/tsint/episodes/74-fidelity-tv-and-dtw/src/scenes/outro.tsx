import React from "react";
import { C, FONT, FT } from "../../design/tokens";
import { Build } from "../../design/primitives";
import { Head, Scene, PAD, Card, Body, Mono, K, beatAt } from "../shared";

/** 收束：三种误差、三个指标，然后把系列交出去。 */
export const SOutro: React.FC = () => {
  const b = (i: number) => beatAt("outro", i, 10);

  return (
    <Scene id="outro">
      <Head kicker="07 / 一句话" title="误差有三种，指标只有一种。" goal="把 MSE、TV、DTW 放回各自的位置" />

      <div style={{ position: "absolute", left: PAD, top: 330, display: "flex", gap: 24 }}>
        {[
          ["幅度错", "MSE", "逐点平方误差；对齐之后才有意义。", C.amber],
          ["抖动多", "TV", "相邻差绝对值和；λ 买平滑也卖峰值。", C.cyan],
          ["相位错", "DTW", "允许拉伸对齐；代价零，路径会变长。", C.violet],
        ].map(([what, name, desc, color], i) => (
          <Build key={String(name)} at={b(i * 2)} style={{ width: 544 }}>
            <Card label={String(what)} accent={color as string} pad={22} style={{ width: 544, height: 190 }}>
              <div style={{ fontFamily: FONT.serif, fontSize: FT.h1, color: color as string, lineHeight: 1.1 }}>{name}</div>
              <Body size={FT.meta} color={C.inkDim} style={{ marginTop: 12 }}>{desc}</Body>
            </Card>
          </Build>
        ))}
      </div>

      <div style={{ position: "absolute", left: PAD, top: 610, width: 1680 }}>
        <Build at={b(5)}>
          <div style={{ fontFamily: FONT.serif, fontSize: FT.h1, color: C.ink, lineHeight: 1.35 }}>
            {"没有一个指标能同时管三种。"}
          </div>
        </Build>
        <Build at={b(6)} style={{ marginTop: 8 }}>
          <Body size={FT.body} color={C.inkDim}>{"选指标之前，先问误差长什么样。"}</Body>
        </Build>
      </div>

      <div style={{ position: "absolute", left: PAD, top: 790, width: 1680, display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
        <Build at={b(7)}>
          <div>
            <K>{"第 9 章到此结束 · 系列到此结束"}</K>
            <div style={{ marginTop: 6, fontFamily: FONT.serif, fontSize: FT.h2, color: C.inkDim }}>{"七十四个问题，一百九十个算法。"}</div>
          </div>
        </Build>
        <Build at={b(9)}>
          <div style={{ textAlign: "right" }}>
            <Mono size={FT.meta} color={C.cyan}>{"74 / 74"}</Mono>
            <div><K>{"愿你看数字时，先看它漏掉了什么。"}</K></div>
          </div>
        </Build>
      </div>

      <div style={{ position: "absolute", left: PAD, top: 900, width: 1680 }}>
        <Build at={b(9)}>
          <K>{"ts-base · ch9-tv-reg / ch9-dtw · 证据可复算"}</K>
        </Build>
      </div>
    </Scene>
  );
};