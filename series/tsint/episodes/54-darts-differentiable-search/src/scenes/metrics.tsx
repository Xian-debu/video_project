import React from "react";
import { AbsoluteFill } from "remotion";
import { C, FONT, FT } from "../../design/tokens";
import { M, Body, Card, CheckGrid, Chip, Foot, KV, PAD, Pages, Row, Scene, SceneHead, fmt4, pagesOf } from "../shared";
import { EdgeGrid, EdgeStrip, MaeBars, SweepBars, TraceChart } from "../figs";

export const MetricsScene: React.FC = () => (
  <Scene id="metrics">
    <SceneHead id="metrics" />
    <Pages id="metrics" at={pagesOf("metrics")}>
      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 296, width: 690 }}>
          <Body size={FT.h2} color={C.ink} style={{ lineHeight: 1.3 }}>二十八项，五组，<br />三点八秒。</Body>
          <Body style={{ marginTop: 20 }}>
            权重有没有动、学习率放大后会不会塌、离散重训误差多少、三层空间对不对、演示是否复现。先看第一组：搜索本身发生了吗。
          </Body>
          <div style={{ marginTop: 22, display: "flex", gap: 22 }}>
            <KV k="起始权重" v={fmt4(M.search.startMeanMax)} color={C.inkDim} />
            <KV k="第 20 步" v={fmt4(M.search.trace[M.search.trace.length - 1].meanMax)} color={C.cyan} />
            <KV k="塌缩边" v={M.search.default.collapsedEdges} color={C.coral} />
          </div>
        </div>
        <div style={{ position: "absolute", left: 800, top: 286, width: 1040 }}>
          <Card label="二十步，平均最大权重几乎不动" accent={C.cyan}>
            <TraceChart
              series={[{ label: "平均最大 softmax 权重", color: C.cyan, points: M.search.trace.map((t) => ({ x: t.step, y: t.meanMax })) }]}
              yLo={0.333}
              yHi={0.334}
              yTicks={[0.333, 0.3334, 0.3338, 0.334]}
              width={960}
              height={330}
              at={36}
              refY={{ y: 1 / 3, label: "1/3 平局线", color: C.inkFaint }}
            />
          </Card>
          <div style={{ marginTop: 14, fontFamily: FONT.mono, fontSize: FT.meta, color: C.inkFaint }}>
            纵轴放大一千倍（0.3330–0.3340）；相对 1.0 的权重尺度，这是几乎不动。第一个负结果。
          </div>
        </div>
        <Foot accent={C.cyan}>二十步只挪万分之四，机制成立，收益不成立。</Foot>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 292, width: 1000 }}>
          <Body size={FT.h2} color={C.ink} style={{ lineHeight: 1.3 }}>把学习率放大五档。</Body>
          <Body style={{ marginTop: 18 }}>
            零点零五、零点五、五、五十、五百。前四档都没有塌缩，只有五百这一档，在第十二步塌到六条边。
          </Body>
          <div style={{ marginTop: 26 }}>
            <SweepBars width={960} labelW={240} />
          </div>
          <div style={{ marginTop: 24 }}>
            <EdgeStrip width={960} caption="lr=500 塌缩后的选择：8 条边，2 种算子" />
          </div>
        </div>
        <div style={{ position: "absolute", left: 1110, top: 292, width: 740 }}>
          <Card label="塌缩，不等于选对" accent={C.coral}>
            <Row name="第 12 步" value="6 / 8 边" note="平均最大权重到 0.9424" width={680} color={C.coral} />
            <Row name="用到的算子" value="2 种" note="八条边只落回两个选择" width={680} color={C.amber} />
            <Row name="黄金值" value="0.9424" note="lr=500 的终点读数" width={680} color={C.violet} />
          </Card>
        </div>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 292, width: 1060 }}>
          <Body size={FT.h2} color={C.ink} style={{ lineHeight: 1.3 }}>离散化之后，误差多少。</Body>
          <Body style={{ marginTop: 16 }}>
            单位是基点，越小越好。零基线是永远预测零；超网是混合算子直接用；四个架构是离散化后各重训一百五十步。
          </Body>
          <div style={{ marginTop: 20 }}>
            <MaeBars width={1010} />
          </div>
        </div>
        <div style={{ position: "absolute", left: 1140, top: 292, width: 710 }}>
          <Card label="七个数字，一条尺子" accent={C.cyan}>
            <Row name="零基线" value="221.8159" note="不训练，永远输出 0" width={650} color={C.cyan} />
            <Row name="top-1" value="267.2185" note="每条边只留一个算子" width={650} color={C.coral} />
            <Row name="top-2" value="256.3004" note="每条边留两个" width={650} color={C.amber} />
            <Row name="超网" value="288.4740" note="混合算子，三条路径" width={650} color={C.inkFaint} />
          </Card>
        </div>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 292, width: 650 }}>
          <Body size={FT.h2} color={C.ink} style={{ lineHeight: 1.3 }}>顺序很清楚：<br />零基线最低。</Body>
          <Body style={{ marginTop: 22 }}>
            零基线、随机架构、同批架构、top-2、top-1、初始化、超网。所有训练过的网络，都输给永不训练的零基线。
          </Body>
          <Body style={{ marginTop: 14 }}>
            这不是架构搜索的问题，是任务本身没有信号：三十只股票的次日收益，预测不出方向。
          </Body>
        </div>
        <div style={{ position: "absolute", left: 760, top: 286, width: 1080 }}>
          <Card label="从低到高，一个偏序" accent={C.violet}>
            <Row name="1 零基线" value="221.8159" note="永远预测 0" width={1010} color={C.cyan} />
            <Row name="2 随机架构" value="230.2738" note="LCG 随机选 8 条边" width={1010} color={C.violet} />
            <Row name="3 同批架构" value="236.8403" note="不切验证集" width={1010} color={C.violet} />
            <Row name="4 top-2" value="256.3004" note="每边留两条路径" width={1010} color={C.amber} />
            <Row name="5 top-1" value="267.2185" note="每边留一条" width={1010} color={C.coral} />
            <Row name="6 初始化" value="270.5292" note="未训练权重" width={1010} color={C.inkDim} />
            <Row name="7 超网" value="288.4740" note="混合算子直接用" width={1010} color={C.inkFaint} />
          </Card>
          <div style={{ marginTop: 16, display: "flex", gap: 10 }}>
            <Chip color={C.cyan}>7 个读数</Chip>
            <Chip color={C.amber}>top2 比 top1 低 4.09%</Chip>
            <Chip color={C.coral}>全部输给零基线</Chip>
          </div>
        </div>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 292, width: 1020 }}>
          <Card label="机制与收益，要分开算" accent={C.amber}>
            <Row name="top-1 比随机" value="+16.04%" note="差值 / 随机值，方向是「更差」" width={950} color={C.coral} />
            <Row name="top-2 比 top-1" value="-4.09%" note="留两条路径确实更好一点" width={950} color={C.cyan} />
            <Row name="同切成 7 / 8" value="7 条边不同" note="不切验证集，选择几乎全变" width={950} color={C.violet} />
            <Row name="同种子复现" value="逐位一致" note="top-1 与超网 MAE 完全相同" width={950} color={C.cyan} />
          </Card>
          <div style={{ marginTop: 18, fontFamily: FONT.mono, fontSize: FT.meta, color: C.inkFaint }}>
            四条读数，两条关于机制（离散化可跑、搜索可复现），两条关于收益（都不如随机）。
          </div>
        </div>
        <div style={{ position: "absolute", left: 1100, top: 292, width: 750 }}>
          <div style={{ fontFamily: FONT.mono, fontSize: FT.meta, color: C.inkFaint, marginBottom: 10 }}>
            同批架构（不切验证集）的选择：
          </div>
          <EdgeGrid width={720} choices={M.search.sameBatchTop1} top2={M.search.top2} caption="与 top-1 相比，8 条边里 7 条不同" />
        </div>
      </AbsoluteFill>
    </Pages>
  </Scene>
);