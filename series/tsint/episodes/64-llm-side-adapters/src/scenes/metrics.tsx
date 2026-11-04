import React from "react";
import { AbsoluteFill } from "remotion";
import { C, FONT, FT } from "../../design/tokens";
import { Body, Card, Foot, Formula, KV, M, PAD, Pages, Row, Scene, SceneHead, fmt4, fmtInt, pagesOf } from "../shared";
import { SplitStrip, VolCurve } from "../figs";

export const MetricsScene: React.FC = () => (
  <Scene id="metrics">
    <SceneHead id="metrics" />
    <Pages id="metrics" at={pagesOf("metrics")}>
      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 300, width: 640 }}>
          <Body size={FT.h1} color={C.ink} style={{ lineHeight: 1.2 }}>主干<br />从哪来。</Body>
          <Body style={{ marginTop: 24 }}>
            这一集预训练的编码器：512 点进，64 维出，{fmtInt(M.frozen.encParams)} 个参数；再加一个冻结投影 4,096，
            合计 {fmtInt(M.frozen.total)}。它只用 1998–2014 的数据训练。
          </Body>
          <div style={{ display: "flex", marginTop: 28 }}>
            <KV k="预训练窗口" v={fmtInt(M.data.pretrainWindows)} color={C.cyan} />
            <KV k="最好一轮" v={"第 " + M.frozen.bestEpoch + " 轮"} color={C.amber} />
            <KV k="验证误差" v="1.0246" color={C.inkDim} />
          </div>
        </div>
        <div style={{ position: "absolute", left: 790, top: 286, width: 1030 }}>
          <Card label="冻结主干 · 账目" accent={C.cyan} style={{ width: 1010 }} pad={18}>
            <Row name="输入" value="512 点" note="每窗 512 点；单位是百分比对数收益" width={974} color={C.inkDim} valueW={300} />
            <Row name="表示" value="64 维" note="编码器最后一层；下游只看这个向量" width={974} color={C.violet} valueW={300} />
            <Row name="编码器" value={fmtInt(M.frozen.encParams)} note="权重全部冻结，本集一个都不更新" width={974} color={C.cyan} valueW={300} />
            <Row name="投影" value={fmtInt(M.frozen.pParams)} note="冻结的线性投影，把 64 维对齐到词向量空间" width={974} color={C.inkDim} valueW={300} />
            <Row name="合计" value={fmtInt(M.frozen.total)} note="这就是所有百分比的分母" width={974} color={C.ink} valueW={300} />
            <Row name="预训练" value={fmtInt(M.data.pretrainWindows) + " 窗"} note={"1998–2014；最好第 " + M.frozen.bestEpoch + " 轮，验证误差 1.0246"} width={974} color={C.inkDim} valueW={300} />
          </Card>
        </div>
        <Foot>之后就不再动它。</Foot>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 300, width: 620 }}>
          <Body size={FT.h1} color={C.ink} style={{ lineHeight: 1.2 }}>下游三段，<br />按时间切。</Body>
          <Body style={{ marginTop: 24 }}>
            2015 到 2019 一共 1,219 个窗口；2020 年以后留着，不动。再按时间切三段：
            训练 732，验证 243，测试 224。不打乱——时间序列不能随机打乱。测试段一次都不参与选择。
          </Body>
        </div>
        <div style={{ position: "absolute", left: 780, top: 286, width: 1060 }}>
          <SplitStrip width={1000} />
          <Card label="切分 · 不打乱" accent={C.amber} style={{ width: 1010, marginTop: 26 }} pad={18}>
            <Row name="训练" value="732" note="拟合线性头与旁路；旁路只用其中 92 对样本" width={962} color={C.cyan} valueW={300} />
            <Row name="验证" value="243" note="只在这里选岭参数与学习率" width={962} color={C.amber} valueW={300} />
            <Row name="测试" value="224" note="一次都不参与选择；报出来的数就是「拿去用」时的数" width={962} color={C.coral} valueW={300} />
          </Card>
        </div>
        <Foot accent={C.amber}>测试段一次都不参与选择。</Foot>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 300, width: 620 }}>
          <Body size={FT.h1} color={C.ink} style={{ lineHeight: 1.2 }}>目标换成<br />波动率。</Body>
          <Body style={{ marginTop: 24 }}>
            最早想预测 20 个未来收益，线性头 1.03、随机特征 1.05，都赢不了「预测零」。
            于是换一个目标：未来第 1 天到第 20 天，每天算累计平均绝对收益，取对数，得到 20 个数。
          </Body>
          <div style={{ display: "flex", marginTop: 26 }}>
            <KV k="目标" v="20 维" color={C.cyan} />
            <KV k="第 1 层" v="第 1 天" color={C.inkDim} />
            <KV k="第 20 层" v="第 20 天" color={C.inkDim} />
          </div>
        </div>
        <div style={{ position: "absolute", left: 790, top: 286, width: 1030 }}>
          <Card label="20 维目标 · 累计平均绝对收益" accent={C.cyan} style={{ width: 1010 }} pad={18}>
            <VolCurve width={950} height={250} />
            <div style={{ display: "flex", gap: 26, marginTop: 10 }}>
              <span style={{ fontFamily: FONT.mono, fontSize: FT.meta, color: C.cyan }}>实线 · 全体窗口均值</span>
              <span style={{ fontFamily: FONT.mono, fontSize: FT.meta, color: C.amber }}>虚线 · 单个窗口</span>
            </div>
          </Card>
        </div>
        <Foot>预测收益测不出信号，换波动率。</Foot>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 300, width: 620 }}>
          <Body size={FT.h1} color={C.ink} style={{ lineHeight: 1.2 }}>口径钉死，<br />数才有意义。</Body>
          <Body style={{ marginTop: 24 }}>
            每维用训练段的均值标准差标准化。相对误差的分母，是「预测全零」的误差——
            在标准化空间里，它就等于预测均值。所以 1.0543 的意思是：比预测均值差百分之五点四。
          </Body>
          <Formula size={FT.body} note="分母固定，换模型不加权" style={{ marginTop: 26 }}>
            relMAE = MAE / MAE(预测均值)
          </Formula>
        </div>
        <div style={{ position: "absolute", left: 790, top: 286, width: 1030 }}>
          <Card label="三个口径 · 都不能含糊" accent={C.amber} style={{ width: 1010 }} pad={18}>
            <Row name="标准化" value="训练段" note="每维减训练段均值、除标准差；验证与测试用同一组数" width={962} color={C.inkDim} valueW={300} />
            <Row name="分母" value="预测均值" note="等价于「预测全零」在原尺度上的误差" width={962} color={C.amber} valueW={300} />
            <Row name="线性头的数" value={fmt4(M.probe.relMae)} note={"比预测均值差 " + ((M.probe.relMae - 1) * 100).toFixed(1) + "%；MAE " + fmt4(M.probe.mae) + " 对 " + fmt4(M.probe.meanMae)} width={962} color={C.coral} valueW={300} />
            <Row name="对照" value={fmt4(M.probe.randomRelMae)} note="同参数量的随机特征头，更差一点" width={962} color={C.violet} valueW={300} />
          </Card>
        </div>
        <Foot accent={C.amber}>口径钉死，后面的数才有意义。</Foot>
      </AbsoluteFill>
    </Pages>
  </Scene>
);
