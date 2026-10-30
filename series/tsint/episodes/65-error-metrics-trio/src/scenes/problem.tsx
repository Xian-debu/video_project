import React from "react";
import { C, FONT, FT } from "../../design/tokens";
import { Build } from "../../design/primitives";
import { Head, Scene, PAD, Card, Body, Mono, K, Num, M, beatAt } from "../shared";

/** 问题：平方罚与绝对罚的最小反例；再把同一套预测换成两把尺。 */
export const SProblem: React.FC = () => {
  const b = (i: number) => beatAt("problem", i, 28);
  const level = (code: string) => M.levels.find((x) => x.code === code)!;
  const rows = [
    { l: level("sh601398"), note: "MAE 最小" },
    { l: level("sh600900"), note: "MAPE 最小" },
    { l: level("sh600519"), note: "MAE 最大" },
    { l: level("sh600028"), note: "两个都靠前" },
  ];
  const a = [1, 1, 1, 1];
  const bb = [4, 0, 0, 0];
  const max = 4;

  const Bars = ({ data, color }: { data: number[]; color: string }) => (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 14, height: 150 }}>
      {data.map((v, i) => (
        <div key={i} style={{ width: 70, height: Math.max(4, (v / max) * 136), background: v ? color : C.panelLine, borderRadius: 5, opacity: v ? 0.9 : 0.5, position: "relative" }}>
          <div style={{ position: "absolute", left: 0, right: 0, top: -24, textAlign: "center", fontFamily: FONT.mono, fontSize: FT.meta, color: v ? color : C.inkFaint }}>{v}</div>
        </div>
      ))}
    </div>
  );

  return (
    <Scene id="problem">
      <Head kicker="01 / 同一组误差" title="MAE 稳，MSE 狠" goal="四个小错和一个大错，谁更贵" />

      <Build at={b(0)} style={{ position: "absolute", left: PAD, top: 296, width: 900 }}>
        <Card label="最小反例 · 四个误差点" accent={C.cyan} pad={26} style={{ width: 900 }}>
          <div style={{ display: "flex", gap: 34 }}>
            <div style={{ flex: 1 }}>
              <K>{"A 组 · 四个小错"}</K>
              <div style={{ marginTop: 12 }}><Bars data={a} color={C.cyan} /></div>
              <div style={{ display: "flex", gap: 34, marginTop: 18 }}>
                {[["MAE", 1], ["MSE", 1], ["RMSE", 1]].map(([k, v]) => (
                  <div key={String(k)}><K>{String(k)}</K><div><Num value={Number(v)} size={FT.h2} color={C.cyan} /></div></div>
                ))}
              </div>
            </div>
            <div style={{ width: 1, background: C.panelLine }} />
            <div style={{ flex: 1 }}>
              <K>{"B 组 · 一个大错"}</K>
              <div style={{ marginTop: 12 }}><Bars data={bb} color={C.amber} /></div>
              <div style={{ display: "flex", gap: 30, marginTop: 18 }}>
                {[["MAE", 1], ["MSE", 4], ["RMSE", 2]].map(([k, v]) => (
                  <div key={String(k)}><K>{String(k)}</K><div><Num value={Number(v)} size={FT.h2} color={C.amber} /></div></div>
                ))}
              </div>
            </div>
          </div>
          <Body size={FT.meta} color={C.inkDim} style={{ marginTop: 18 }}>
            {"MSE 从 1 涨到 4，RMSE 从 1 涨到 2，MAE 仍是 1。平方把 4 变成 16，绝对值仍是 4。"}
          </Body>
        </Card>
      </Build>

      <Build at={b(18)} style={{ position: "absolute", left: 1060, top: 296, width: 740 }}>
        <Card label="同一套 naive-1 预测 · 两把尺" accent={C.amber} pad={24} style={{ width: 740 }}>
          <div style={{ display: "flex", paddingBottom: 10, borderBottom: "1px solid " + C.panelLine }}>
            <div style={{ flex: 1 }}><K>{"股票"}</K></div>
            <div style={{ width: 120, textAlign: "right" }}><K>{"MAE 名次"}</K></div>
            <div style={{ width: 130, textAlign: "right" }}><K>{"MAPE 名次"}</K></div>
          </div>
          {rows.map((r) => {
            const hot = r.l.code === "sh600900" || r.l.code === "sh600519";
            return (
              <div key={r.l.code} style={{ display: "flex", alignItems: "center", padding: "14px 0", borderBottom: "1px solid " + C.panelLine }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: FONT.serif, fontSize: FT.h3, color: hot ? C.cyan : C.ink }}>{r.l.name}</div>
                  <div style={{ fontFamily: FONT.mono, fontSize: FT.micro, color: C.inkFaint }}>{r.note}</div>
                </div>
                <div style={{ width: 120, textAlign: "right" }}><Num value={r.l.rankMae} size={FT.num} color={hot ? C.cyan : C.inkDim} /></div>
                <div style={{ width: 130, textAlign: "right" }}><Num value={r.l.rankMape} size={FT.num} color={hot ? C.amber : C.inkDim} /></div>
              </div>
            );
          })}
          <Body size={FT.meta} color={C.inkDim} style={{ marginTop: 18 }}>
            {"长江电力 MAE 第 6、MAPE 第 1；贵州茅台 MAE 第 20、MAPE 第 4。"}
          </Body>
        </Card>
      </Build>

      <Build at={b(24)} style={{ position: "absolute", left: PAD, top: 848, width: 1680 }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 20 }}>
          <div style={{ fontFamily: FONT.serif, fontSize: FT.h2, color: C.ink }}>{"同一组预测，两把尺，两个冠军。"}</div>
          <K>{"名次变了，不是模型变了。"}</K>
        </div>
      </Build>
    </Scene>
  );
};
