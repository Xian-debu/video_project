import React from "react";
import { C, FONT, FT } from "../../design/tokens";
import { Build } from "../../design/primitives";
import { Math } from "../../design/Math";
import { Head, Scene, PAD, Card, Body, Mono, K, beatAt } from "../shared";

/** 定义：六条公式，三张卡；每个符号与两个约定都写在屏幕上。 */
export const SDefinitions: React.FC = () => {
  const b = (i: number) => beatAt("definitions", i, 32);
  const w = 536;

  return (
    <Scene id="definitions">
      <Head kicker="02 / 三个指标，三种罚法" title="误差的三种罚法" goal="平方、绝对值、比例，以及各自的基准" />

      <div style={{ position: "absolute", left: PAD, top: 292, display: "flex", gap: 24 }}>
        <Build at={b(0)}>
          <Card label="绝对误差 · 式 8.1 / 8.5 / 8.6" accent={C.cyan} pad={20} style={{ width: w, height: 584 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <Math tex={String.raw`\mathrm{MSE}=\frac{1}{h}\sum_{k=1}^{h}(F_k-Y_k)^2`} block size={28} color={C.cyan} align="left" />
              <Math tex={String.raw`\mathrm{RMSE}=\sqrt{\mathrm{MSE}}`} block size={28} color={C.cyan} align="left" />
              <Math tex={String.raw`\mathrm{MAE}=\frac{1}{h}\sum_{k=1}^{h}|F_k-Y_k|`} block size={28} color={C.cyan} align="left" />
            </div>
            <div style={{ marginTop: 18, borderTop: "1px solid " + C.panelLine, paddingTop: 14 }}>
              <Body size={FT.meta} color={C.inkDim}>{"MSE 按平方罚，一个 4 倍误差会变成 16 倍。"}</Body>
              <Body size={FT.meta} color={C.inkDim} style={{ marginTop: 8 }}>{"RMSE 开根号，量纲回到原序列，但仍然是平方罚。"}</Body>
              <Body size={FT.meta} color={C.inkDim} style={{ marginTop: 8 }}>{"MAE 每个误差权重相同；零点不可导，优化要用次梯度。"}</Body>
            </div>
            <div style={{ marginTop: 16, background: C.bg, borderRadius: 8, padding: "10px 12px" }}>
              <K>{"同一组误差，两种答案"}</K>
              <div style={{ fontFamily: FONT.mono, fontSize: FT.meta, color: C.inkDim, marginTop: 6 }}>{"1 1 1 1  →  MSE 1 / MAE 1"}</div>
              <div style={{ fontFamily: FONT.mono, fontSize: FT.meta, color: C.inkDim, marginTop: 4 }}>{"4 0 0 0  →  MSE 4 / MAE 1"}</div>
            </div>
            <div style={{ marginTop: 14 }}><K>{"h = 预测步数 · F = 预测 · Y = 真实"}</K></div>
          </Card>
        </Build>

        <Build at={b(17)}>
          <Card label="百分比 · 式 8.3 / 8.4 · MAPE 同形" accent={C.amber} pad={20} style={{ width: w, height: 584 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <Math tex={String.raw`\mathrm{MPE}=\frac{100\%}{h}\sum_{k=1}^{h}\frac{Y_k-F_k}{Y_k}`} block size={20} color={C.amber} align="left" />
              <Math tex={String.raw`\mathrm{MAPE}=\frac{100\%}{h}\sum_{k=1}^{h}\frac{|F_k-Y_k|}{|Y_k|}`} block size={20} color={C.amber} align="left" />
              <Math tex={String.raw`\mathrm{sMAPE}=\frac{100\%}{h}\sum_{k=1}^{h}\frac{|F_k-Y_k|}{(|Y_k|+|F_k|)/2}`} block size={19} color={C.amber} align="left" />
            </div>
            <div style={{ marginTop: 14, borderTop: "1px solid " + C.panelLine, paddingTop: 12 }}>
              <Body size={FT.meta} color={C.inkDim}>{"MPE 方向反了：Y 减 F，正数表示低估。"}</Body>
              <Body size={FT.meta} color={C.inkDim} style={{ marginTop: 8 }}>{"MAPE 把不同价格拉到同一把尺上；Y 小于等于零就失效。"}</Body>
              <Body size={FT.meta} color={C.inkDim} style={{ marginTop: 8 }}>{"sMAPE 上下对称，代价是单点最多罚 200%。"}</Body>
              <Body size={FT.micro} color={C.inkFaint} style={{ marginTop: 8 }}>{"MAPE 在书里没有单独编号，按 MPE 同形写出。"}</Body>
            </div>
          </Card>
        </Build>

        <Build at={b(25)}>
          <Card label="比例基准 · 式 8.2" accent={C.violet} pad={20} style={{ width: w, height: 584 }}>
            <Math
              tex={String.raw`\mathrm{MASE}=\frac{\frac{1}{h}\sum_{k=M+1}^{M+h}|F_k-Y_k|}{\frac{1}{M-s}\sum_{k=s+1}^{M}|Y_k-Y_{k-s}|}`}
              block size={26} color={C.violet} align="left"
            />
            <div style={{ marginTop: 14, borderTop: "1px solid " + C.panelLine, paddingTop: 12 }}>
              <Body size={FT.meta} color={C.inkDim}>{"分子：测试段的平均绝对误差。"}</Body>
              <Body size={FT.meta} color={C.inkDim} style={{ marginTop: 8 }}>{"分母：训练段的季节朴素误差，只用训练段。"}</Body>
              <Body size={FT.meta} color={C.inkDim} style={{ marginTop: 8 }}>{"s 是季节周期；小于 1 或训练段不够两个季节都报错。"}</Body>
              <Body size={FT.meta} color={C.inkDim} style={{ marginTop: 8 }}>{"分母为零时返回正无穷，不返回 0 或 NaN。"}</Body>
            </div>
            <div style={{ marginTop: 14, background: C.bg, borderRadius: 8, padding: "10px 12px" }}>
              <K>{"本机 20 只 · MASE(5)"}</K>
              <div style={{ fontFamily: FONT.mono, fontSize: FT.meta, color: C.violet, marginTop: 6 }}>{"14 只 < 1 · 中位数 0.7918"}</div>
            </div>
            <div style={{ marginTop: 12 }}><K>{"书里写 M-S；本集统一小写 s，含义相同。"}</K></div>
          </Card>
        </Build>
      </div>

      <Build at={b(29)} style={{ position: "absolute", left: PAD, top: 916, width: 1680 }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 20 }}>
          <div style={{ fontFamily: FONT.serif, fontSize: FT.h2, color: C.ink }}>{"定义只规定罚法，任务才规定选哪把尺。"}</div>
          <K>{"七个式子，六条有编号；三个基准。"}</K>
        </div>
      </Build>
    </Scene>
  );
};
