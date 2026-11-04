import React from "react";
import { AbsoluteFill } from "remotion";
import { C, FONT, FT } from "../../design/tokens";
import { Body, Card, Chip, Foot, KV, M, PAD, Pages, Row, Scene, SceneHead, fmt4, pagesOf } from "../shared";
import { ReconScores } from "../figs";

export const BoundaryScene: React.FC = () => (
  <Scene id="boundary">
    <SceneHead id="boundary" />
    <Pages id="boundary" at={pagesOf("boundary")}>
      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 292, width: 620 }}>
          <Body size={FT.h1} color={C.ink} style={{ lineHeight: 1.2 }}>预测残差<br />在哪里失效。</Body>
          <Body style={{ marginTop: 26 }}>
            它只在点上有效：要求异常短、幅度大、孤立的。漂移被摊薄到每一天，2σ 的残差淹没在厚尾里，阈值 3.4467
            几乎不响——不是检测器坏了，是这个量本来就不该在这种异常上灵。
          </Body>
          <div style={{ display: "flex", marginTop: 28 }}>
            <KV k="有效" v="孤立 5σ+" color={C.cyan} />
            <KV k="失效" v="整段 2σ" color={C.coral} />
            <KV k="漂移 F1" v={fmt4(M.pred.driftF1)} color={C.amber} />
          </div>
        </div>
        <div style={{ position: "absolute", left: 790, top: 292, width: 1030 }}>
          <Card label="残差这把尺子的适用面" accent={C.coral} style={{ width: 1010 }}>
            <Row name="有效：尖峰" value="6σ · 1 天" note="残差一天一个大数，阈值直接越过" width={962} color={C.cyan} valueW={280} />
            <Row name="失效：漂移" value="2σ · 60 天" note="残差每天 2σ，落在厚尾阈值下，全程静默" width={962} color={C.coral} valueW={280} />
            <Row name="机制" value="逐点比较" note="只看当前点，窗口其余 31 点不参与判定" width={962} color={C.inkDim} valueW={280} />
            <Row name="边界条件" value="幅度 > τ" note="幅度掉到阈值以下，残差就看不见了" width={962} color={C.amber} valueW={280} />
          </Card>
        </div>
        <Foot>点上的尺子，量不了整段形状。</Foot>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 292, width: 620 }}>
          <Body size={FT.h1} color={C.ink} style={{ lineHeight: 1.2 }}>重构侧<br />也有盲区。</Body>
          <Body style={{ marginTop: 26 }}>
            重构分对整段形状敏感，对单点不敏感：尖峰只让 32 个点里错 1 个。要让它抓尖峰，得把窗口切短；可窗口短了，
            漂移这种缓慢形状变化又看不出来。两端都想要的窗口长度，不存在。
          </Body>
          <div style={{ display: "flex", marginTop: 28 }}>
            <KV k="尖峰 F1" v={fmt4(M.recon.spikeF1)} color={C.coral} />
            <KV k="漂移 F1" v={fmt4(M.recon.driftF1)} color={C.cyan} />
            <KV k="窗口" v="32 点" color={C.inkDim} />
          </div>
        </div>
        <div style={{ position: "absolute", left: 790, top: 292, width: 1030 }}>
          <Card label="重构分 · 同一把编码器的两个方向" accent={C.violet} style={{ width: 1010 }} pad={20}>
            <ReconScores width={950} height={165} />
          </Card>
          <Card label="窗口长度的取舍" accent={C.amber} style={{ marginTop: 16, width: 1010 }} pad={20}>
            <Row name="窗口短" value="尖峰更显" note="单点占比变大，但漂移被切成看不见的碎片" width={962} color={C.coral} valueW={280} />
            <Row name="窗口长" value="漂移更显" note="形状变化被累积，但单点又被平均掉" width={962} color={C.cyan} valueW={280} />
            <Row name="本集选的 32" value="折中" note="两边都留一点，两边都不极致" width={962} color={C.inkDim} valueW={280} />
          </Card>
        </div>
        <Foot>窗口长度是这条边界上另一个旋钮。</Foot>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 292, width: 620 }}>
          <Body size={FT.h1} color={C.ink} style={{ lineHeight: 1.2 }}>能说<br />与不能说。</Body>
          <Body style={{ marginTop: 26 }}>
            能说：在这份数据、这套注入方式、这个窗口长度下，两种检测器各自覆盖一种异常形态。不能说：换个市场、
            换个幅度，F1 的绝对值会变；也不能说两者可以互相替代。
          </Body>
        </div>
        <div style={{ position: "absolute", left: 790, top: 292, width: 1030 }}>
          <Card label="四条能说" accent={C.cyan} style={{ width: 1010 }} pad={18}>
            <Row name="尖峰" value="残差覆盖" note="0.7059 对 0.0714，差距足够大" width={962} color={C.cyan} valueW={280} />
            <Row name="漂移" value="重构覆盖" note="0.6199 对 0.0914，方向明确" width={962} color={C.violet} valueW={280} />
            <Row name="机制" value="可解释" note="逐点 vs 整段，两种尺度天然分工" width={962} color={C.inkDim} valueW={280} />
            <Row name="代价" value="251 行" note="两个模块、24 条单测、19 项检查" width={962} color={C.inkDim} valueW={280} />
          </Card>
          <Card label="三条不能说" accent={C.coral} style={{ marginTop: 12, width: 1010 }} pad={18}>
            <Row name="绝对值" value="不可搬" note="换市场、换幅度，F1 会变" width={962} color={C.coral} valueW={280} />
            <Row name="互相替代" value="不能" note="两者不是同一把尺子的两个版本" width={962} color={C.coral} valueW={280} />
            <Row name="万用" value="不能" note="两种形态之外，还有第三种、第四种" width={962} color={C.coral} valueW={280} />
          </Card>
        </div>
        <Foot>边界写清楚，结论才站得住。</Foot>
      </AbsoluteFill>
    </Pages>
  </Scene>
);
