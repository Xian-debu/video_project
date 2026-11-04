import React from "react";
import { AbsoluteFill } from "remotion";
import { C, FONT, FT } from "../../design/tokens";
import { Body, Card, Foot, Formula, KV, M, PAD, Pages, Scene, SceneHead, fmt4, pagesOf } from "../shared";
import { DriftZoom, SpikeZoom, WindowPair } from "../figs";

export const ProblemScene: React.FC = () => (
  <Scene id="problem">
    <SceneHead id="problem" />
    <Pages id="problem" at={pagesOf("problem")}>
      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 292, width: 620 }}>
          <Body size={FT.h1} color={C.ink} style={{ lineHeight: 1.2 }}>尖峰<br />只占一天。</Body>
          <Body style={{ marginTop: 26 }}>
            测试段第 200 天，序列跳到负六倍标准差，第二天就回来。在逐点比较的残差里，这一天就是一个大数；阈值一卡就抓到。
            这是残差的主场。
          </Body>
          <div style={{ display: "flex", marginTop: 28 }}>
            <KV k="幅度" v="−6σ" color={C.coral} />
            <KV k="持续" v="1 天" color={C.inkDim} />
            <KV k="测试段" v="728 天" color={C.inkDim} />
          </div>
        </div>
        <div style={{ position: "absolute", left: 790, top: 292, width: 1030 }}>
          <Card label="测试段第 185–225 天 · 一处尖峰" accent={C.coral} style={{ width: 1010 }} pad={20}>
            <SpikeZoom width={940} height={300} />
          </Card>
        </div>
        <Foot>一天一个数，逐点比较就能抓住。</Foot>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 292, width: 620 }}>
          <Body size={FT.h1} color={C.ink} style={{ lineHeight: 1.2 }}>残差只比<br />当前点。</Body>
          <Body style={{ marginTop: 26 }}>
            预测模型拿过去 32 个点回归当前点，残差是实际值减预测值的绝对值。它逐点比较，所以只看一天的错误；
            窗口里其余 31 个点不影响这个数。阈值取标定段残差的分位数，不手调。
          </Body>
        </div>
        <div style={{ position: "absolute", left: 790, top: 292, width: 1030 }}>
          <Card label="三行定义" accent={C.cyan} style={{ width: 1010 }} pad={28}>
            <Formula size={46} note="逐点残差">r t = | y t − ŷ t |</Formula>
            <div style={{ height: 18 }} />
            <Formula size={46} color={C.cyan} note="阈值 = 标定段残差的 0.99 分位">τ = quantile(0.99, r 标定)</Formula>
            <div style={{ height: 18 }} />
            <Formula size={46} color={C.coral} note="严格大于才算报警">报警 ⟺ r t &gt; τ</Formula>
          </Card>
          <div style={{ marginTop: 18, display: "flex", gap: 16 }}>
            <KV k="阈值 τ" v={fmt4(M.pred.threshold, 6)} color={C.cyan} />
            <KV k="参数" v={M.pred.params + " 个"} color={C.inkDim} />
            <KV k="标定" v="487 窗 · 2018–2019" color={C.inkFaint} size={FT.meta} />
          </div>
        </div>
        <Foot>逐点残差，天然只认「这一天不对」。</Foot>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 292, width: 620 }}>
          <Body size={FT.h1} color={C.ink} style={{ lineHeight: 1.2 }}>换一种<br />错法。</Body>
          <Body style={{ marginTop: 26 }}>
            从第 120 天起，序列整体抬高 2σ，保持 60 天，再落回来。每天的变化都不大，残差也只有 2σ 左右——但这一段窗口的
            整体形状，已经不在训练时见过的分布里了。
          </Body>
          <div style={{ display: "flex", marginTop: 28 }}>
            <KV k="漂移" v="3 段" color={C.cyan} />
            <KV k="每段" v="60 天" color={C.inkDim} />
            <KV k="幅度" v="2σ" color={C.amber} />
          </div>
        </div>
        <div style={{ position: "absolute", left: 790, top: 292, width: 1030 }}>
          <Card label="三段梯形漂移 · 共 180 点" accent={C.cyan} style={{ width: 1010 }} pad={20}>
            <DriftZoom width={940} height={300} />
          </Card>
        </div>
        <Foot>每天的残差只有 2σ，阈值把它全放过去了。</Foot>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 292, width: 620 }}>
          <Body size={FT.h1} color={C.ink} style={{ lineHeight: 1.2 }}>换一把<br />尺子。</Body>
          <Body style={{ marginTop: 26 }}>
            把整段窗口压成一个数再还原：正常段能还原得很好，形状一旦整体偏移，误差就被放大。它不看单点，
            只看这 32 个点还能不能被重建出来。
          </Body>
          <div style={{ display: "flex", marginTop: 28 }}>
            <KV k="正常窗" v={fmt4(M.recon.normalMean)} color={C.cyan} />
            <KV k="漂移窗" v={fmt4(M.recon.driftMean)} color={C.coral} />
            <KV k="倍数" v={fmt4(M.recon.driftMean / M.recon.normalMean, 2)} color={C.amber} />
          </div>
        </div>
        <div style={{ position: "absolute", left: 790, top: 292, width: 1030 }}>
          <Card label="同一把编码器 · 两种窗口" accent={C.violet} style={{ width: 1010 }} pad={20}>
            <WindowPair width={940} height={300} />
          </Card>
        </div>
        <Foot>残差看一天，重构看整段。</Foot>
      </AbsoluteFill>
    </Pages>
  </Scene>
);
