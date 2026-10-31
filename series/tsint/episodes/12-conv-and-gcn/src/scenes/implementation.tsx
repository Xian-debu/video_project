import React from "react";
import { Build } from "../../design/primitives";
import { C, FONT, FT } from "../../design/tokens";
import { Body, Card, Chip, CodeBlock, Formula, K, M, PAD, Pages, Row, Scene, SceneHead, Stat, Verdict, fmtE, lf } from "../shared";

/* 实现：三个坑，都写进模块头。 */

export const SImplementation: React.FC = () => {
  const m = M;
  return (
    <Scene id="implementation">
      <SceneHead id="implementation" />
      <Pages id="implementation" at={[0, 0.23, 0.39, 0.52, 0.74]}>
        <div>
          <div style={{ position: "absolute", left: PAD, top: 292, fontFamily: FONT.sans, fontSize: FT.h2, color: C.inkDim }}>
            卷积是四层循环，没有技巧。
          </div>
          <Build at={lf("implementation", 0.04)}>
            <div style={{ position: "absolute", left: PAD, top: 366 }}>
              <CodeBlock width={880} size={19} title="conv2d · 前向" lines={[
                { t: "for oy in [0 .. hOut-1]:" },
                { t: "  for ox in [0 .. wOut-1]:" },
                { t: "    acc = 0" },
                { t: "    for ky in [0 .. m-1]:      -- 核行" },
                { t: "      for kx in [0 .. n-1]:    -- 核列" },
                { t: "        iy = oy*s + ky - p; ix = ox*s + kx - p", dim: true },
                { t: "        acc += w[ky][kx] * at(x, iy, ix)", hi: true },
                { t: "    y[oy][ox] = acc" },
              ]} />
            </div>
          </Build>
          <Build at={lf("implementation", 0.1)}>
            <div style={{ position: "absolute", left: 1000, top: 366, width: 780 }}>
              <Row name="输入下标" value="oy×s + ky − p" note="步长乘输出下标，再加核下标，再减补零" width={780} />
              <Row name="越界" value="不取，当零" note="补出来的位置本来就是零，不必单独判断" width={780} />
              <Row name="尺寸先检查" value="报错，不是截断" note="核比补零后的输入还大：ConvKernelLargerThanPadded" color={C.coral} width={780} />
              <div style={{ display: "flex", gap: 18, marginTop: 26 }}>
                <Chip color={C.cyan}>有效卷积 s=1 p=0</Chip>
                <Chip color={C.violet}>核在行列两向复用</Chip>
              </div>
            </div>
          </Build>
        </div>

        <div>
          <div style={{ position: "absolute", left: PAD, top: 292, fontFamily: FONT.sans, fontSize: FT.h2, color: C.inkDim }}>
            反向三件事：转核、互相关、累加。
          </div>
          <Build at={lf("implementation", 0.26)}>
            <div style={{ position: "absolute", left: PAD, top: 372, display: "flex", gap: 26 }}>
              <Card label="输入梯度 dX" accent={C.cyan} style={{ width: 570, height: 340 }}>
                <Body style={{ color: C.ink, fontSize: FT.h3 }}>输出梯度先和核做一次全卷积</Body>
                <div style={{ fontFamily: FONT.mono, fontSize: FT.body, color: C.cyan, marginTop: 12 }}>dX = fullConv(dY, rot180(W))</div>
                <K style={{ display: "block", marginTop: 12 }}>全卷积 = 把核转一百八十度，再正常卷积</K>
              </Card>
              <Card label="权重梯度 dW" accent={C.violet} style={{ width: 570, height: 340 }}>
                <Body style={{ color: C.ink, fontSize: FT.h3 }}>输入和输出梯度的互相关</Body>
                <div style={{ fontFamily: FONT.mono, fontSize: FT.body, color: C.violet, marginTop: 12 }}>dW = corr(X, dY)</div>
                <K style={{ display: "block", marginTop: 12 }}>每个窗口共用同一个核，梯度必须累加</K>
              </Card>
              <Card label="为什么必须累加" accent={C.amber} style={{ width: 588, height: 340 }}>
                <Body style={{ color: C.ink, fontSize: FT.h3 }}>同一个核在几百个位置出现过</Body>
                <K style={{ display: "block", marginTop: 12 }}>每个位置的贡献都算进同一份 dW，漏一个就偏</K>
              </Card>
            </div>
          </Build>
        </div>

        <div>
          <div style={{ position: "absolute", left: PAD, top: 292, fontFamily: FONT.sans, fontSize: FT.h2, color: C.inkDim }}>
            第一个坑：核的方向。
          </div>
          <Build at={lf("implementation", 0.42)}>
            <div style={{ position: "absolute", left: PAD, top: 366, width: 1010 }}>
              <CodeBlock width={1010} size={19} title="方向翻错的两种写法" lines={[
                { t: "dX = corr(dY, W)         -- 错：这是相关的反向", dim: true },
                { t: "dX = fullConv(dY, rot180 W)   -- 对：卷积的反向", hi: true },
                { t: "dW = corr(X, dY)          -- 对：两个方向一起翻，等于没翻", dim: true },
              ]} />
            </div>
          </Build>
          <Build at={lf("implementation", 0.47)}>
            <div style={{ position: "absolute", left: 1100, top: 366, width: 680 }}>
              <Stat label="卷积梯度相对误差" accent={C.cyan} value={fmtE(m.struct.convGradRel)} sub="中心差分对照，阈值 1e−6" valueSize={62} style={{ width: 680, height: 200 }} />
              <K style={{ display: "block", marginTop: 18 }}>方向错的时候，前向照样跑完，只有梯度检查会炸。</K>
            </div>
          </Build>
          <Build at={lf("implementation", 0.5)}>
            <div style={{ position: "absolute", left: PAD, top: 720 }}>
              <Verdict ok label="转置、翻转、互相关，三者只差一次 rot180" />
            </div>
          </Build>
        </div>

        <div>
          <div style={{ position: "absolute", left: PAD, top: 288, fontFamily: FONT.sans, fontSize: FT.h2, color: C.inkDim }}>
            图这块短得多：传播子算一次，之后只做矩阵乘。
          </div>
          <Build at={lf("implementation", 0.55)}>
            <div style={{ position: "absolute", left: PAD, top: 366 }}>
              <Formula size={44} style={{ color: C.ink }}>P = D~^(−1/2) (A + I) D~^(−1/2)</Formula>
              <K style={{ display: "block", marginTop: 12 }}>每层：一次平均、一次乘权重、一次非线性</K>
            </div>
          </Build>
          <Build at={lf("implementation", 0.62)}>
            <div style={{ position: "absolute", left: PAD, top: 520, width: 1080 }}>
              <div style={{ fontFamily: FONT.sans, fontSize: FT.h2, color: C.coral }}>第二条坑：自环</div>
              <Row name="默认实现" value="先清对角，再加单位矩阵" note="clearDiag → addSelfLoops" width={1080} />
              <Row name="不清对角" value="原来的自环被算两遍" note="A 里已经有自环时，A+I 会把对角线翻倍" color={C.coral} width={1080} />
            </div>
          </Build>
          <Build at={lf("implementation", 0.68)}>
            <div style={{ position: "absolute", left: 1180, top: 500, width: 600 }}>
              <Stat label="完全图元素" accent={C.cyan} value="0.3333" sub="理论上每个元素三分之一" valueSize={54} style={{ width: 600, height: 170 }} />
              <Stat label="两种写法的差" accent={C.coral} value={fmtE(m.struct.selfLoopTrapDev)} sub="对角线会变成二分之一，差六分之一" valueColor={C.coral} valueSize={54} style={{ width: 600, height: 170, marginTop: 18 }} />
            </div>
          </Build>
        </div>

        <div>
          <div style={{ position: "absolute", left: PAD, top: 292, fontFamily: FONT.sans, fontSize: FT.h2, color: C.inkDim }}>
            第三个坑不在数学里，在资源里。
          </div>
          <Build at={lf("implementation", 0.77)}>
            <div style={{ position: "absolute", left: PAD, top: 372, display: "flex", gap: 26 }}>
              <Card label="十三个模型并行" accent={C.coral} style={{ width: 875, height: 300 }}>
                <div style={{ fontFamily: FONT.serif, fontSize: FT.h2, color: C.coral }}>内存被 thunk 撑爆</div>
                <Body style={{ marginTop: 12 }}>每一轮都在堆惰性求值的中间量，十三路一起，进程直接被系统杀掉。</Body>
                <K style={{ display: "block", marginTop: 10 }}>退出码 137</K>
              </Card>
              <Card label="改成串行 + 一百二十轮" accent={C.cyan} style={{ width: 875, height: 300 }}>
                <div style={{ fontFamily: FONT.serif, fontSize: FT.h2, color: C.cyan }}>十几分钟跑完</div>
                <Body style={{ marginTop: 12 }}>每个模型五十秒左右，一个个来；轮数从三百降到一百二，结果仍然稳。</Body>
                <K style={{ display: "block", marginTop: 10 }}>慢一点，但跑得完</K>
              </Card>
            </div>
          </Build>
          <Build at={lf("implementation", 0.83)}>
            <div style={{ position: "absolute", left: PAD, top: 726, width: 1776 }}>
              <Row name="阈值分档" value={"卷积 " + fmtE(m.struct.convGradRel) + " < 1e−6　·　图网络 " + fmtE(m.struct.gcnGradRel) + " < 1e−5"} note="图网络反向有四层，中心差分的舍入误差大一个量级" width={1776} />
            </div>
          </Build>
        </div>
      </Pages>
    </Scene>
  );
};