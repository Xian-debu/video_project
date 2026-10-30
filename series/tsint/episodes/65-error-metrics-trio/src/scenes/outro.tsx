import React from "react";
import { C, FONT, FT } from "../../design/tokens";
import { Build } from "../../design/primitives";
import { Head, Scene, PAD, Card, Body, Mono, K, beatAt } from "../shared";

/** 收束：一句话、三张回执、九章地图与下一集。 */
export const SOutro: React.FC = () => {
  const b = (i: number) => beatAt("outro", i, 12);
  const map = [
    ["ch01", "介绍", 1], ["ch02", "基础概念", 15], ["ch03", "预测", 13],
    ["ch04", "异常检测", 12], ["ch05", "分类", 8], ["ch06", "自动分析", 7],
    ["ch07", "基础模型", 8], ["ch08", "测评基准", 5], ["ch09", "神经微分方程", 5],
  ] as const;

  return (
    <Scene id="outro">
      <Head kicker="07 / 一句话" title="先问误差怎么罚。" goal="三个指标，六条公式，37 条断言" />

      <div style={{ position: "absolute", left: PAD, top: 280, display: "flex", gap: 24 }}>
        {[
          { k: "指标", t: "平方、绝对、比例", d: "MSE / RMSE / MAE / MAPE / sMAPE / MASE。", c: C.cyan },
          { k: "边界", t: "零值、基准、训练段", d: "MAPE 遇零失效；MASE 的分母只读训练段。", c: C.coral },
          { k: "证据", t: "20 只，37 条断言", d: "3 个 Haskell 模块，cabal test 全过。", c: C.violet },
        ].map((x, i) => (
          <Build key={x.k} at={b(i * 2)}>
            <Card label={x.k} accent={x.c} pad={22} style={{ width: 536, height: 196 }}>
              <div style={{ fontFamily: FONT.serif, fontSize: FT.h2, color: C.ink, lineHeight: 1.3 }}>{x.t}</div>
              <Body size={FT.meta} color={C.inkDim} style={{ marginTop: 14 }}>{x.d}</Body>
            </Card>
          </Build>
        ))}
      </div>

      <Build at={b(6)} style={{ position: "absolute", left: PAD, top: 540, width: 1680 }}>
        <Card accent={C.cyan} pad={18} style={{ width: 1680 }}>
          <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between" }}>
            <K>{"九章地图 · 74 集 / 190 个算法"}</K>
            <K>{"第二章到第九章：每章 1–15 集"}</K>
          </div>
          <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
            {map.map(([id, name, n]) => (
              <div key={id} style={{ flex: 1, borderLeft: "1px solid " + C.panelLine, paddingLeft: 10 }}>
                <Mono size={FT.micro} color={id === "ch08" ? C.cyan : C.inkFaint}>{id}</Mono>
                <div style={{ fontFamily: FONT.serif, fontSize: FT.meta, color: id === "ch08" ? C.ink : C.inkDim, marginTop: 2 }}>{name}</div>
                <Mono size={FT.micro} color={C.inkFaint}>{n + " 集"}</Mono>
              </div>
            ))}
          </div>
        </Card>
      </Build>

      <Build at={b(7)} style={{ position: "absolute", left: PAD, top: 806, width: 1680 }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 18 }}>
          <div style={{ fontFamily: FONT.mono, fontSize: FT.meta, color: C.inkFaint }}>{"下一集"}</div>
          <div style={{ fontFamily: FONT.serif, fontSize: FT.h2, color: C.ink }}>{"E66 · 99:1 之后，AUC 还剩多少"}</div>
        </div>
        <Body size={FT.meta} color={C.inkFaint} style={{ marginTop: 8 }}>
          {"同一份数据，全判正常；准确率、AUC、AP 会给出三个不同的故事。"}
        </Body>
      </Build>

      <div style={{ position: "absolute", left: PAD, top: 1002, width: 1680, display: "flex", justifyContent: "space-between" }}>
        <Mono size={FT.micro} color={C.inkFaint}>{"《时序智能》 · 74 集 · 190 个算法 · 每集可复算"}</Mono>
        <Mono size={FT.micro} color={C.cyan}>{"01 / 74"}</Mono>
      </div>
    </Scene>
  );
};
