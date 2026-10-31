import React from "react";
import { Build } from "../../design/primitives";
import { C, FONT, FT } from "../../design/tokens";
import { Body, Card, Chip, Formula, K, M, PAD, Pages, Row, Scene, SceneHead, Stat, Verdict, lf } from "../shared";

/* 定义：三块零件、三个式号，以及书里没写的超参。 */

export const SDefinitions: React.FC = () => {
  const m = M;
  const p = m.struct.params;
  return (
    <Scene id="definitions">
      <SceneHead id="definitions" />
      <Pages id="definitions" at={[0, 0.13, 0.33, 0.47, 0.72, 0.86]}>
        <div>
          <div style={{ position: "absolute", left: PAD, top: 296, fontFamily: FONT.sans, fontSize: FT.h2, color: C.inkDim }}>
            三块零件：一个二维窗口、一个因果窗口、一个传播子。
          </div>
          <Build at={lf("definitions", 0.05)}>
            <div style={{ position: "absolute", left: PAD, top: 380, display: "flex", gap: 26 }}>
              <Card label="第一块 · 式 (2.48)" accent={C.cyan} style={{ width: 570, height: 320 }}>
                <div style={{ fontFamily: FONT.serif, fontSize: FT.h1, color: C.ink }}>二维卷积</div>
                <Body style={{ marginTop: 14 }}>窗口在行和列两个方向滑动，核在两个方向复用。</Body>
                <K style={{ display: "block", marginTop: 12 }}>有效卷积：核放不下的位置不出输出</K>
              </Card>
              <Card label="第二块 · 式 (2.62)" accent={C.violet} style={{ width: 570, height: 320 }}>
                <div style={{ fontFamily: FONT.serif, fontSize: FT.h1, color: C.ink }}>因果卷积</div>
                <Body style={{ marginTop: 14 }}>只在左边补零，输出与输入等长；每个输出只看过去。</Body>
                <K style={{ display: "block", marginTop: 12 }}>本仓把下标改成不含未来</K>
              </Card>
              <Card label="第三块 · 式 (2.64)" accent={C.amber} style={{ width: 588, height: 320 }}>
                <div style={{ fontFamily: FONT.serif, fontSize: FT.h1, color: C.ink }}>图卷积</div>
                <Body style={{ marginTop: 14 }}>传播子乘一次取邻居均值，再乘权重、过双曲正切。</Body>
                <K style={{ display: "block", marginTop: 12 }}>权重所有节点共享，只学一份</K>
              </Card>
            </div>
          </Build>
        </div>

        <div>
          <div style={{ position: "absolute", left: PAD, top: 292, fontFamily: FONT.sans, fontSize: FT.h2, color: C.inkDim }}>
            输出的行数是 H 减 m 加一，列数是 W 减 n 加一。
          </div>
          <Build at={lf("definitions", 0.16)}>
            <div style={{ position: "absolute", left: PAD, top: 372 }}>
              <Formula size={46} style={{ color: C.ink }}>H_out = ⌊(H + 2p − m) / s⌋ + 1</Formula>
              <K style={{ display: "block", marginTop: 14 }}>步长 s、补零 p、核 m×n：书里一个都没给</K>
            </div>
          </Build>
          <Build at={lf("definitions", 0.23)}>
            <div style={{ position: "absolute", left: PAD, top: 500, width: 1776 }}>
              <Row name="我们的选择" value="s = 1，p = 0" note="有效卷积：输出比输入小 m−1 行、n−1 列" width={1776} />
              <Row name="步长写成零" value="报错" note="ConvBadStride：尺寸公式除以零" color={C.coral} width={1776} />
              <Row name="补零写成负数" value="报错" note="ConvBadPad：补出来的区域比输入还大也不许" color={C.coral} width={1776} />
              <Row name="核比补零后的输入还大" value="报错" note="ConvKernelLargerThanPadded" color={C.coral} width={1776} />
            </div>
          </Build>
        </div>

        <div>
          <div style={{ position: "absolute", left: PAD, top: 292, fontFamily: FONT.sans, fontSize: FT.h2, color: C.inkDim }}>
            因果卷积：输出和输入一样长，只在左边补零。
          </div>
          <Build at={lf("definitions", 0.36)}>
            <div style={{ position: "absolute", left: PAD, top: 372 }}>
              <Formula size={46} style={{ color: C.ink }}>y_t = Σ_(j=1..K) w_j · x_(t−j+1)</Formula>
            </div>
          </Build>
          <Build at={lf("definitions", 0.4)}>
            <div style={{ position: "absolute", left: PAD, top: 486, width: 1776 }}>
              <Row name="黄金用例" value="核 [1,2,3] · 输入 [1..5] → 3, 8, 14, 20, 26" note="errata E26：式 (2.62) 的下标需改成这条" width={1776} />
              <Row name="因果性" value="改第五个输入，前四个输出不动" note="测试钉住：扰动只影响当刻与之后" width={1776} />
            </div>
          </Build>
          <Build at={lf("definitions", 0.44)}>
            <div style={{ position: "absolute", left: PAD, top: 664 }}>
              <Verdict ok label="tcn 的因果卷积与本模块逐位一致" />
              <K style={{ marginLeft: 16 }}>同一份实现，两条路径</K>
            </div>
          </Build>
        </div>

        <div>
          <div style={{ position: "absolute", left: PAD, top: 288, fontFamily: FONT.sans, fontSize: FT.h2, color: C.inkDim }}>
            第三块：先平均邻居，再乘权重，再过双曲正切。
          </div>
          <Build at={lf("definitions", 0.5)}>
            <div style={{ position: "absolute", left: PAD, top: 366 }}>
              <Formula size={44} style={{ color: C.ink }}>z1 = P X W1　h1 = tanh(z1)　z2 = P h1 W2</Formula>
              <K style={{ display: "block", marginTop: 14 }}>两层：一层取邻居，一层再取邻居，最后每个节点输出一个分数</K>
            </div>
          </Build>
          <Build at={lf("definitions", 0.58)}>
            <div style={{ position: "absolute", left: PAD, top: 486, display: "flex", gap: 24 }}>
              <Stat label="输入维" accent={C.inkFaint} value={String(p.feat)} sub="技术特征：收益、波动、量比、均线偏离" valueSize={52} style={{ width: 426, height: 214 }} />
              <Stat label="隐藏维" accent={C.violet} value={String(p.hidden)} sub="每个节点一层十六维" valueColor={C.violet} valueSize={52} style={{ width: 426, height: 214 }} />
              <Stat label="第一层权重" accent={C.cyan} value={String(p.w1)} sub={p.feat + " × " + p.hidden} valueSize={52} style={{ width: 426, height: 214 }} />
              <Stat label="合计" accent={C.amber} value={String(p.total)} sub={p.w1 + " + " + p.w2 + "，所有节点共享"} valueColor={C.amber} valueSize={52} style={{ width: 450, height: 214 }} />
            </div>
          </Build>
          <Build at={lf("definitions", 0.66)}>
            <div style={{ position: "absolute", left: PAD, top: 742, display: "flex", gap: 20 }}>
              <Chip color={C.cyan}>传播子是常数矩阵</Chip>
              <Chip color={C.violet}>不参与训练</Chip>
              <Chip color={C.amber}>反向只对权重求导</Chip>
            </div>
          </Build>
        </div>

        <div>
          <div style={{ position: "absolute", left: PAD, top: 292, fontFamily: FONT.sans, fontSize: FT.h2, color: C.inkDim }}>
            便宜不等于有用。
          </div>
          <Build at={lf("definitions", 0.75)}>
            <div style={{ position: "absolute", left: PAD, top: 372, display: "flex", gap: 26 }}>
              <Card label="对抗基线" accent={C.cyan} style={{ width: 875, height: 300 }}>
                <div style={{ fontFamily: FONT.serif, fontSize: FT.h2, color: C.ink }}>把传播子换成单位矩阵</div>
                <Body style={{ marginTop: 14 }}>同一份代码、同一个参数量，只差一张图。多出来的准确率只能来自图。</Body>
              </Card>
              <Card label="实验设计" accent={C.violet} style={{ width: 875, height: 300 }}>
                <div style={{ fontFamily: FONT.serif, fontSize: FT.h2, color: C.ink }}>五个阈值、八个半径</div>
                <Body style={{ marginTop: 14 }}>真图从零点六扫到零点三；环图半径从一放到二十五。</Body>
                <K style={{ display: "block", marginTop: 12 }}>十三个模型，同一套超参</K>
              </Card>
            </div>
          </Build>
          <Build at={lf("definitions", 0.83)}>
            <div style={{ position: "absolute", left: PAD, top: 716, fontFamily: FONT.sans, fontSize: FT.body, color: C.inkDim }}>
              下一场看实现：三个坑，都写进了模块头。
            </div>
          </Build>
        </div>
      </Pages>
    </Scene>
  );
};