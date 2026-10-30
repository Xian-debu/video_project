import React from "react";
import { C, FONT, FT } from "../../design/tokens";
import { Build } from "../../design/primitives";
import { Head, Scene, PAD, Card, Body, Mono, K, beatAt } from "../shared";

/** 实现：三张卡对应三个模块；先把边界写成断言，再谈公式。 */
export const SImplementation: React.FC = () => {
  const b = (i: number) => beatAt("implementation", i, 26);
  const Code: React.FC<{ lines: string[]; color: string }> = ({ lines, color }) => (
    <div style={{ background: C.bg, border: "1px solid " + C.panelLine, borderRadius: 8, padding: "14px 16px", minHeight: 214 }}>
      {lines.map((l, i) => (
        <div key={i} style={{ fontFamily: FONT.mono, fontSize: 15, lineHeight: 1.55, whiteSpace: "pre", color: l.trim().startsWith("--") ? C.inkFaint : color }}>{l || " "}</div>
      ))}
    </div>
  );
  const cards = [
    {
      t: "ErrorMetrics.hs", tag: "式 8.1 / 8.5 / 8.6", color: C.cyan, n: 13,
      code: [
        "mse, rmse, mae :: V.Vector Double",
        "              -> V.Vector Double -> Double",
        "",
        "-- 长度不等 / 空 / NaN / Inf：报错",
        "-- 求和用 Kahan 补偿",
        "mse f y = sumSq f y / fromIntegral h",
        "rmse f y = sqrt (mse f y)",
      ],
      note: "同一组误差，三个数一次算完；RMSE 不是独立实现，是 MSE 开根。",
    },
    {
      t: "PercentageErrors.hs", tag: "式 8.3 / 8.4", color: C.amber, n: 14,
      code: [
        "mape :: V.Vector Double -> V.Vector Double",
        "     -> Double",
        "mape f y",
        "  | V.any (<= 0) y = error \"MAPE: Y <= 0\"",
        "",
        "mapeSkipping f y = (sum / k, skipped)",
        "smape f y = mean (200 * |e| / (|y| + |f|))",
      ],
      note: "严格版遇到零或负数直接报错；跳过版返回 (值, 跳过数)，不偷偷补零。",
    },
    {
      t: "Mase.hs", tag: "式 8.2", color: C.violet, n: 10,
      code: [
        "mase s train actual forecast =",
        "  meanAbs (actual - forecast)",
        "    / seasonalScale s train",
        "",
        "seasonalScale s xs",
        "  | d == 0 = 1 / 0   -- 正无穷",
        "  | otherwise = d",
      ],
      note: "分母只读训练段；s < 1、训练段不足两个季节、空测试，全部报错。",
    },
  ];

  return (
    <Scene id="implementation">
      <Head kicker="04 / 三个模块" title="先把边界写成断言" goal="公式之外，还有长度、零分母和 NaN" />

      <div style={{ position: "absolute", left: PAD, top: 284, display: "flex", gap: 24 }}>
        {cards.map((c, i) => (
          <Build key={c.t} at={b(i * 8)}>
            <Card label={c.t + " · " + c.tag} accent={c.color} pad={20} style={{ width: 536, height: 500 }}>
              <Code lines={c.code} color={c.color} />
              <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginTop: 12 }}>
                <Mono size={FT.h3} color={c.color}>{String(c.n)}</Mono>
                <K>{"条断言"}</K>
              </div>
              <Body size={FT.micro} color={C.inkDim} style={{ marginTop: 6 }}>{c.note}</Body>
            </Card>
          </Build>
        ))}
      </div>

      <Build at={b(22)} style={{ position: "absolute", left: PAD, top: 830, width: 1680 }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 20 }}>
          <div style={{ fontFamily: FONT.serif, fontSize: FT.h2, color: C.ink }}>{"37 条断言，先判边界，再算数。"}</div>
          <K>{"长度不等、Y=0、分母=0、NaN，全部显式报错。"}</K>
        </div>
      </Build>
    </Scene>
  );
};
