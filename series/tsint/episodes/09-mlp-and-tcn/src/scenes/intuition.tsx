import React from "react";
import { Build } from "../../design/primitives";
import { C, FONT, FT } from "../../design/tokens";
import { Body, Card, Chip, K, M, PAD, Pages, Scene, SceneHead, Formula, lf } from "../shared";

/* 直觉：一个看见点，一个看见顺序。 */

const DilRow: React.FC<{ d: number; color: string; label: string; taps: number[] }> = ({ d, color, label, taps }) => (
  <div style={{ display: "flex", alignItems: "center", marginTop: 16 }}>
    <div style={{ width: 300, fontFamily: FONT.sans, fontSize: FT.body, color: C.inkDim }}>{label}</div>
    <div style={{ display: "flex", gap: 6 }}>
      {Array.from({ length: 15 }, (_, i) => {
        const on = taps.includes(i);
        return (
          <div key={i} style={{
            width: 46, height: 46, borderRadius: 8, border: "1px solid " + (on ? color : C.panelLine),
            background: on ? color : C.panel, opacity: on ? 0.92 : 1,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontFamily: FONT.mono, fontSize: FT.micro, color: on ? C.bg : C.inkFaint,
          }}>{on ? "w" + (taps.indexOf(i) + 1) : i + 1}</div>
        );
      })}
    </div>
    <div style={{ width: 110, textAlign: "right", fontFamily: FONT.mono, fontSize: FT.meta, color }}>d = {d}</div>
  </div>
);

export const SIntuition: React.FC = () => {
  const m = M;
  return (
    <Scene id="intuition">
      <SceneHead id="intuition" />
      <Pages id="intuition" at={[0, 0.24, 0.48, 0.7, 0.86]}>
        <div>
          <div style={{ position: "absolute", left: PAD, top: 236, fontFamily: FONT.sans, fontSize: FT.h2, color: C.inkDim }}>
            多层感知机的全部内容，就是一行仿射变换，再套一个非线性。
          </div>
          <Build at={lf("intuition", 0.04)}>
            <div style={{ position: "absolute", left: PAD, top: 312, width: 1010 }}>
              <Card label="式 (2.46) (2.47) · p.30" accent={C.cyan} style={{ height: 300 }}>
                <Formula size={58} note="W 行是输出维、列是输入维；b 每个输出一个">{"z = W·h + b ,    h = φ(z)"}</Formula>
                <Body size={FT.meta} style={{ marginTop: 16 }}>一层叠一层，就成了网络。60 → 32 → 1。</Body>
              </Card>
            </div>
          </Build>
          <Build at={lf("intuition", 0.1)}>
            <div style={{ position: "absolute", left: PAD + 1034, top: 312, width: 742 }}>
              <Card label="没有共享，没有局部性" accent={C.coral} style={{ height: 300 }}>
                <Body size={FT.body}>第一层每个输出都看全部 60 个输入；第二层每个输出都看全部 32 个隐单元。</Body>
                <Body size={FT.body} style={{ marginTop: 12 }}>第 k 个和第 k+1 个输入，地位完全一样。</Body>
              </Card>
            </div>
          </Build>
          <Build at={lf("intuition", 0.15)}>
            <div style={{ position: "absolute", left: PAD, top: 656, width: 1776, background: C.panel, border: "1px solid " + C.panelLine, borderLeft: "3px solid " + C.coral, borderRadius: 12, padding: "20px 26px" }}>
              <div style={{ fontFamily: FONT.sans, fontSize: FT.h2, color: C.ink }}>你把窗口顺序打乱，它就学成另一个模型：时间相邻没被写进结构。</div>
            </div>
          </Build>
        </div>

        <div>
          <div style={{ position: "absolute", left: PAD, top: 236, fontFamily: FONT.sans, fontSize: FT.h2, color: C.inkDim }}>
            时间卷积的核只有三个权重，在时间轴上滑，每个位置用同一组权重。
          </div>
          <Build at={lf("intuition", 0.27)}>
            <div style={{ position: "absolute", left: PAD, top: 306, width: 1140 }}>
              <Card label="三层、每层 16 通道、核长 3" accent={C.violet} style={{ height: 430 }}>
                <DilRow d={1} color={C.cyan} label="第一层：看相邻三步" taps={[0, 1, 2]} />
                <DilRow d={2} color={C.violet} label="第二层：中间隔一格" taps={[0, 2, 4]} />
                <DilRow d={4} color={C.amber} label="第三层：中间隔三格" taps={[0, 4, 8]} />
                <K style={{ display: "block", marginTop: 20 }}>膨胀不让参数量变，只让视野变；核还是那三个权重</K>
              </Card>
            </div>
          </Build>
          <Build at={lf("intuition", 0.34)}>
            <div style={{ position: "absolute", left: PAD + 1164, top: 306, width: 612 }}>
              <Card label="权重共享" accent={C.cyan} style={{ height: 430 }}>
                <Body size={FT.body}>同一组三权重，滑到每个位置都复用。</Body>
                <Body size={FT.meta} style={{ marginTop: 14 }}>所以参数量不随序列长度涨。</Body>
                <Chip color={C.violet}>3 × 16 × 16 + 16 = 784 / 层</Chip>
              </Card>
            </div>
          </Build>
        </div>

        <div>
          <div style={{ position: "absolute", left: PAD, top: 236, fontFamily: FONT.sans, fontSize: FT.h2, color: C.inkDim }}>
            感受野 15 怎么来的：一层膨胀 d 多看出 (K−1)·d 步。
          </div>
          <Build at={lf("intuition", 0.51)}>
            <div style={{ position: "absolute", left: PAD, top: 312, width: 1100 }}>
              <Card label="本仓推导 · 书里没给这个公式" accent={C.amber} style={{ height: 320 }}>
                <Formula size={60} color={C.amber} note="K = 3，Σd = 1 + 2 + 4 = 7">{"RF = 1 + (K − 1) · Σ d"}</Formula>
                <Body size={FT.body} style={{ marginTop: 18 }}>{m.hand.rfCalc}</Body>
              </Card>
            </div>
          </Build>
          <Build at={lf("intuition", 0.56)}>
            <div style={{ position: "absolute", left: PAD + 1124, top: 312, width: 652 }}>
              <Card label="钉住它的测试" accent={C.cyan} style={{ height: 320 }}>
                <Body size={FT.body}>不是断言公式，是断言支撑集：把输入只在第 15 步之前扰动，输出必须变；扰动第 16 步，输出必须不变。</Body>
                <K style={{ display: "block", marginTop: 16 }}>RF = {m.tcn.rf}</K>
              </Card>
            </div>
          </Build>
          <Build at={lf("intuition", 0.6)}>
            <div style={{ position: "absolute", left: PAD, top: 676, fontFamily: FONT.sans, fontSize: FT.body, color: C.inkDim }}>
              三步叠起来才是因果膨胀卷积：层、膨胀、左补零，少一个性质就没了。
            </div>
          </Build>
        </div>

        <div>
          <div style={{ position: "absolute", left: PAD, top: 236, fontFamily: FONT.sans, fontSize: FT.h2, color: C.inkDim }}>
            因果性靠两件事：翻转核，左边补 (K−1)·d 个零。
          </div>
          <Build at={lf("intuition", 0.73)}>
            <div style={{ position: "absolute", left: PAD, top: 306, width: 1776 }}>
              <Card label="补零与输出长度" accent={C.cyan} style={{ height: 250 }}>
                <div style={{ display: "flex", gap: 40, alignItems: "baseline" }}>
                  <div style={{ fontFamily: FONT.mono, fontSize: FT.lead, color: C.cyan }}>左补 (K−1)·d 个零</div>
                  <div style={{ fontFamily: FONT.mono, fontSize: FT.lead, color: C.ink }}>输出长度 = 输入长度</div>
                  <div style={{ fontFamily: FONT.mono, fontSize: FT.lead, color: C.amber }}>第 t 个输出只看 ≤ t 的输入</div>
                </div>
                <K style={{ display: "block", marginTop: 18 }}>补零个数写死，错一位整条线就平移</K>
              </Card>
            </div>
          </Build>
          <Build at={lf("intuition", 0.79)}>
            <div style={{ position: "absolute", left: PAD, top: 600, width: 1776 }}>
              <Card label="训练配方：书里一个字都没有" accent={C.coral} style={{ height: 170 }}>
                <Body size={FT.body}>优化器、学习率、批大小、早停，全都没写。我们的选择不是书给的，全部写进自查表 A21。</Body>
                <K style={{ display: "block", marginTop: 12 }}>tanh 隐层 · 线性输出 · MSE · Adam 1e-3 · batch 64 · patience 5</K>
              </Card>
            </div>
          </Build>
        </div>

        <div>
          <div style={{ position: "absolute", left: PAD, top: 236, fontFamily: FONT.sans, fontSize: FT.h2, color: C.inkDim }}>
            所以这一集的所有数字，都带着这一套超参的条件。
          </div>
          <Build at={lf("intuition", 0.89)}>
            <div style={{ position: "absolute", left: PAD, top: 312, width: 1776 }}>
              <Card accent={C.violet} style={{ height: 240 }}>
                <div style={{ fontFamily: FONT.serif, fontSize: FT.h1, color: C.ink }}>结构决定它能看见什么；看不见的东西，训练补不回来。</div>
                <K style={{ display: "block", marginTop: 18 }}>下面先把符号钉死，再看两段实现</K>
              </Card>
            </div>
          </Build>
        </div>
      </Pages>
    </Scene>
  );
};
