import React from "react";
import { Build } from "../../design/primitives";
import { C, FONT, FT } from "../../design/tokens";
import { Body, Card, K, Mono, PAD, Pages, Scene, SceneHead, StepPlot, fmtM, M, lf } from "../shared";

/** 三种权重形状：把“怎么摊”画出来。 */
const WeightShape: React.FC<{ values: number[]; width: number; height: number; color: string; label: string }> = ({ values, width, height, color, label }) => {
  const mx = Math.max(...values);
  const bw = width / values.length;
  return (
    <svg width={width} height={height} style={{ display: "block" }}>
      {values.map((v, i) => (
        <rect key={i} x={i * bw} y={height - 20 - (v / mx) * (height - 40)} width={Math.max(2, bw - 3)} height={(v / mx) * (height - 40)} fill={color} opacity={0.9} rx={2} />
      ))}
      <text x={0} y={height - 4} fill={C.inkFaint} fontFamily={FONT.mono} fontSize={FT.micro}>{label}</text>
    </svg>
  );
};

/** 问题：为什么平滑一定滞后；三种摊法；质心是公共的尺子。 */
export const SProblem: React.FC = () => {
  const id = "problem";
  const b = (k: number) => lf(id, k);
  const eq = Array.from({ length: 20 }, () => 1);
  return (
    <Scene id={id}>
      <SceneHead id={id} />
      <Pages id={id} at={[0, 0.26, 0.52, 0.76]}>
        {/* 1 · 滞后从哪来 */}
        <div>
          <div style={{ position: "absolute", left: PAD, top: 268, width: 880 }}>
            <Build at={b(0.01)}>
              <Card label="平滑器 = 低通滤波器" accent={C.coral} pad={24} style={{ width: 860, height: 300 }}>
                <Body color={C.ink} size={FT.h2} style={{ fontFamily: FONT.serif }}>它只看过去，所以只能把已经发生的摊开。</Body>
                <Body size={FT.body} style={{ marginTop: 14 }}>摊开 = 平均；平均 = 反应慢。慢多少，取决于权重怎么摊。</Body>
                <div style={{ marginTop: 16 }}><K color={C.coral}>代价是相位延迟，不是实现缺陷</K></div>
              </Card>
            </Build>
          </div>
          <div style={{ position: "absolute", left: PAD + 900, top: 268, width: 876 }}>
            <Build at={b(0.05)}>
              <Card accent={C.amber} pad={24} style={{ width: 876, height: 300 }}>
                <Body color={C.ink} size={FT.h2} style={{ fontFamily: FONT.serif }}>PAD，在这里不是填充，是一个记号。</Body>
                <Body size={FT.body} style={{ marginTop: 14 }}>每个平滑器都是输入的加权和，权重非负、和为归一；权重向量的形状，决定响应形状。</Body>
              </Card>
            </Build>
          </div>
          <div style={{ position: "absolute", left: PAD, top: 612, width: 1776 }}>
            <Build at={b(0.1)}>
              <Card accent={C.violet} pad={20} style={{ width: 1776, height: 130 }}>
                <Body size={FT.body}>比较两个平滑器，就是比较两组权重；但权重长度不同，不能直接比。</Body>
                <K>于是要找一把公共的尺子：阶跃响应的质心</K>
              </Card>
            </Build>
          </div>
        </div>

        {/* 2 · 三种摊法 */}
        <div>
          <div style={{ position: "absolute", left: PAD, top: 278, width: 1776 }}>
            <Body color={C.ink} size={FT.lead}>三种摊法：等权、偏心、几何衰减；三种滞后。</Body>
          </div>
          {[
            { t: "SMA", w: eq, c: C.amber, note: "每个点一样重" },
            { t: "WMA 线性", w: M.weights.linear20, c: C.cyan, note: "越近越重" },
            { t: "SES(2/21)", w: M.weights.tri20.map((_, i) => Math.pow(1 - 2 / 21, i)), c: C.violet, note: "越远越轻，不归零" },
          ].map((m, i) => (
            <div key={m.t} style={{ position: "absolute", left: PAD + i * 600, top: 352, width: 560 }}>
              <Build at={b(0.28 + i * 0.02)}>
                <Card label={m.t} accent={m.c} pad={20} style={{ width: 560, height: 300 }}>
                  <WeightShape values={i === 2 ? m.w.slice(0, 20) : m.w} width={520} height={170} color={m.c} label={m.note} />
                  <Body size={FT.meta} style={{ marginTop: 6 }}>{i === 2 ? "权重按最近的一端对齐；前二十个只为看形状" : "窗口二十个点，横轴是离今天的距离"}</Body>
                </Card>
              </Build>
            </div>
          ))}
          <div style={{ position: "absolute", left: PAD, top: 690, width: 1776 }}>
            <Build at={b(0.36)}>
              <Body size={FT.body} color={C.inkDim}>摊得越平，反应越慢；偏得越狠，等待越短。</Body>
            </Build>
          </div>
        </div>

        {/* 3 · 交换 */}
        <div>
          <div style={{ position: "absolute", left: PAD, top: 276, width: 860 }}>
            <Build at={b(0.54)}>
              <Card label="两个方向相反的量" accent={C.coral} pad={24} style={{ width: 860, height: 300 }}>
                <Body color={C.ink} size={FT.h2} style={{ fontFamily: FONT.serif }}>窗口越大，方差降得越多，滞后也越大。</Body>
                <Body size={FT.body} style={{ marginTop: 14 }}>SMA 的方差大约是原来的 N 分之一；滞后是 N 减一除以二。</Body>
                <div style={{ marginTop: 16 }}><K color={C.coral}>这是一个交换，没有免费的午餐</K></div>
              </Card>
            </Build>
          </div>
          <div style={{ position: "absolute", left: PAD + 900, top: 276, width: 876 }}>
            <Build at={b(0.57)}>
              <Card label="窗口的代价表" accent={C.amber} pad={22} style={{ width: 876, height: 300 }}>
                {[5, 20, 60].map((n) => (
                  <div key={n} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid " + C.panelLine }}>
                    <Mono size={FT.body} color={C.ink}>N = {n}</Mono>
                    <Mono size={FT.body} color={C.inkDim}>滞后 {fmtM((n - 1) / 2, 1)} 步</Mono>
                    <Mono size={FT.body} color={C.inkFaint}>方差 ≈ σ² / {n}</Mono>
                  </div>
                ))}
                <Body size={FT.meta} style={{ marginTop: 12 }}>两个方向相反的旋钮：平滑得更狠，等于等得更久。</Body>
              </Card>
            </Build>
          </div>
        </div>

        {/* 4 · 质心登场 */}
        <div>
          <div style={{ position: "absolute", left: PAD, top: 250, width: 940 }}>
            <Build at={b(0.78)}>
              <StepPlot width={900} height={380} curves={["sma20", "ses_2_21"]} at={b(0.8)} marks={["half"]} area="sma20" legend={false} />
            </Build>
          </div>
          <div style={{ position: "absolute", left: PAD + 960, top: 262, width: 816 }}>
            <Build at={b(0.79)}>
              <Card label="阶跃响应" accent={C.cyan} pad={22} style={{ width: 816, height: 210 }}>
                <Body color={C.ink} size={FT.h2} style={{ fontFamily: FONT.serif }}>给一个阶跃，看输出多久跟上。</Body>
                <Body size={FT.body} style={{ marginTop: 12 }}>曲线下面的面积，就是平均滞后；这个面积叫质心，是一个一阶矩。</Body>
              </Card>
            </Build>
            <Build at={b(0.83)}>
              <Card label="两把尺子" accent={C.amber} pad={22} style={{ width: 816, marginTop: 16 }}>
                <div style={{ display: "flex", gap: 40 }}>
                  <div><Mono size={FT.num} color={C.amber}>9.5</Mono><Body size={FT.meta} style={{ marginTop: 4 }}>SMA20 的质心</Body></div>
                  <div><Mono size={FT.num} color={C.cyan}>9.5</Mono><Body size={FT.meta} style={{ marginTop: 4 }}>SES(2/21) 的质心</Body></div>
                </div>
                <K style={{ display: "block", marginTop: 10 }}>两者相等，不是巧合；下一场把公式写出来</K>
              </Card>
            </Build>
          </div>
        </div>
      </Pages>
    </Scene>
  );
};
