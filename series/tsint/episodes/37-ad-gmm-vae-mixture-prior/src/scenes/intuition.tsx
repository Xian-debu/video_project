import React from "react";
import { AbsoluteFill } from "remotion";
import { C, FONT, FT } from "../../design/tokens";
import { PAD, M, pagesOf, Pages, Scene, SceneHead, Card, Row, Body, Scatter, KV, Bars, Verdict } from "../shared";

export const SIntuition: React.FC = () => {
  const at = pagesOf("intuition");
  const arr = (a: number[]) => a.map((v) => v.toFixed(1)).join(" · ");
  return (
    <Scene id="intuition">
      <SceneHead id="intuition" />
      <Pages id="intuition" at={at}>
        {/* 页一：合成两团先证明能拟合 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 288, width: 940 }}>
            <Body size={FT.lead} color={C.inkDim} style={{ width: 900, lineHeight: 1.7 }}>
              先看合成两团：各两百个点，中心隔六个标准差。K 等于二的混合从 k-means 起点开始 EM，六十步后两个中心都收回到真值。
            </Body>
            <Card label="真值与恢复值" accent={C.violet} style={{ marginTop: 26 }}>
              <Row name="真值中心" value={M.blob.true.map((p) => "(" + p[0] + ", " + p[1] + ")").join("  ")} note="两团各两百点" width={890} />
              <Row name="恢复中心" value={M.blob.est.map((p) => "(" + p[0].toFixed(3) + ", " + p[1].toFixed(3) + ")").join("  ")} note={"误差 " + M.blob.err.toFixed(3)} color={C.violet} width={890} />
              <Row name="权重" value={M.blob.pi.map((p) => p.toFixed(2)).join(" / ")} note="一半一半，没有骑墙的点" width={890} />
              <Row name="后验置信点" value={M.blob.confident + "%"} note="最大后验超过 0.9" width={890} />
            </Card>
            <div style={{ marginTop: 18, display: "flex", gap: 12 }}>
              <Verdict ok label="多个模式确实能被拟合" />
              <Verdict ok label="问题不在优化器" />
            </div>
          </div>
          <div style={{ position: "absolute", left: 1140, top: 300, width: 700 }}>
            <Card label="这一步证明什么" accent={C.cyan}>
              <Row name="EM 实现" value="没错" note="中心、权重、后验都对" width={640} />
              <Row name="k-means 起点" value="必须给" note="对称初始化会让两个分量合并到全局均值" width={640} />
              <Row name="下一步" value="看真实潜空间" note="那里没有两团，只有一个主团" width={640} />
            </Card>
            <Body size={FT.meta} color={C.inkFaint} style={{ marginTop: 16, width: 660 }}>
              合成数据的意义不是成绩，是排除「优化器写错了」这个解释。
            </Body>
          </div>
        </AbsoluteFill>

        {/* 页二：真实潜空间 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 280, width: 960 }}>
            <Scatter width={940} height={600} normal={M.latent.normal} spike={M.latent.spike} drift={M.latent.drift} title={"二维投影 · 四个分量的中心"} />
          </div>
          <div style={{ position: "absolute", left: 1150, top: 288, width: 700 }}>
            <Card label="四个分量 · 四个中心" accent={C.violet}>
              <Row name="权重" value={M.latent.pi.map((p) => p.toFixed(2)).join(" / ")} width={640} />
              <Row name="中心 1 / 2" value={M.latent.centers.slice(0, 2).map((p) => "(" + p[0].toFixed(2) + ", " + p[1].toFixed(2) + ")").join("  ")} width={640} />
              <Row name="中心 3 / 4" value={M.latent.centers.slice(2).map((p) => "(" + p[0].toFixed(2) + ", " + p[1].toFixed(2) + ")").join("  ")} width={640} />
            </Card>
            <Card label="半径中位数 · 离分量中心的距离" accent={C.cyan} style={{ marginTop: 18 }}>
              <Row name="正常窗" value={M.latent.normMedian.toFixed(3)} note={M.latent.normal.length + " 点"} width={640} />
              <Row name="注入窗" value={M.latent.injMedian.toFixed(3)} note={M.latent.injected.length + " 点，与正常几乎一样"} width={640} />
              <Row name="尖峰" value={M.latent.spikeMedian.toFixed(3)} note="稍远，但没飞出去" color={C.coral} width={640} />
              <Row name="斜坡" value={M.latent.driftMedian.toFixed(3)} note="比正常更靠近中心" color={C.amber} width={640} />
            </Card>
            <Body size={FT.small} color={C.inkDim} style={{ marginTop: 16, width: 660, lineHeight: 1.65 }}>
              四个中心几乎排在一条对角线上：真实潜空间里并没有四个清晰的模式，权重也不均分，最大的一个占六成四。
            </Body>
          </div>
        </AbsoluteFill>

        {/* 页三：分量解释 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 288, width: 1000 }}>
            <Card label="四个分量对各窗的平均负对数似然" accent={C.amber}>
              <Row name="漂移窗" value={arr(M.components.driftMean)} note={"min 中位 " + M.components.driftMinMedian.toFixed(3)} color={C.amber} width={950} />
              <Row name="正常窗" value={arr(M.components.normalMean)} note={"min 中位 " + M.components.normalMinMedian.toFixed(3)} color={C.cyan} width={950} />
              <Row name="尖峰窗" value={arr(M.components.spikeMean)} note={"min 中位 " + M.components.spikeMinMedian.toFixed(3)} color={C.coral} width={950} />
            </Card>
            <Body style={{ marginTop: 20, width: 950 }}>
              每个窗取四个分量里最小的那个，也就是最相信它的分量，用它有多不信它当分数。漂移窗的最小值比正常窗还低：趋势段被某个分量完整解释了。
            </Body>
          </div>
          <div style={{ position: "absolute", left: 1180, top: 288, width: 660 }}>
            <Bars
              width={640}
              labelW={104}
              items={[
                { label: "正常", value: M.components.normalMinMedian, text: M.components.normalMinMedian.toFixed(3), color: C.cyan },
                { label: "漂移", value: M.components.driftMinMedian, text: M.components.driftMinMedian.toFixed(3), color: C.amber },
                { label: "尖峰", value: M.components.spikeMinMedian, text: M.components.spikeMinMedian.toFixed(3), color: C.coral },
              ]}
            />
            <KV k="「任何分量都解释不了」" v="在趋势段失效" note="书说多个模式能救状态切换，这就是代价" color={C.coral} />
            <Body size={FT.meta} color={C.inkDim} style={{ marginTop: 14, width: 620 }}>
              救的方式，是把不该放过的也放过了。
            </Body>
          </div>
        </AbsoluteFill>
      </Pages>
    </Scene>
  );
};
