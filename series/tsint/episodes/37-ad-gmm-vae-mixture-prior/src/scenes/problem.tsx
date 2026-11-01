import React from "react";
import { AbsoluteFill } from "remotion";
import { C, FONT, FT } from "../../design/tokens";
import { PAD, M, U, pagesOf, Pages, Scene, SceneHead, Card, Row, Body, Formula, Bars, PairBar, K } from "../shared";

export const SProblem: React.FC = () => {
  const at = pagesOf("problem");
  return (
    <Scene id="problem">
      <SceneHead id="problem" />
      <Pages id="problem" at={at}>
        {/* 页一：分数只是一个离心距离 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 288, width: 980 }}>
            <Formula size={44} color={C.cyan} note="单高斯先验的负对数密度，等于二分之一乘潜变量平方和，加常数">
              score(z) = −log N(z; 0, I) = ½‖z‖² + C
            </Formula>
            <Body style={{ marginTop: 24, width: 940 }}>
              分数只量一个东西：离原点多远。正常样本被 KL 压在原点附近；异常如果也落在原点附近，就量不到。
              这就是单高斯先验的全部信息量。
            </Body>
          </div>
          <div style={{ position: "absolute", left: 1130, top: 288, width: 720 }}>
            <Card label="单高斯先验的读数" accent={C.cyan}>
              <Row name="训练段阈值" value={U("prior1").tau.toFixed(4)} note="训练段 99 分位" width={660} />
              <Row name="测试段召回" value={U("prior1").recall.toFixed(4)} note={"二十段只抓到 " + U("prior1").detected + " 段"} width={660} />
              <Row name="精确率" value={U("prior1").precision.toFixed(4)} note={"命中 " + U("prior1").tp + "，误报 " + U("prior1").fp} width={660} />
              <Row name="报警率" value={U("prior1").alertPct.toFixed(2) + "%"} note={"干净点中位 " + M.stats.prior1.cleanMedian.toFixed(2)} width={660} />
            </Card>
            <Body size={FT.meta} color={C.coral} style={{ marginTop: 16, width: 690 }}>
              干净点中位 13.79，紧贴阈值 14.35。分数挤在一起，没有余量。
            </Body>
          </div>
        </AbsoluteFill>

        {/* 页二：状态切换的对照 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 288, width: 1000 }}>
            <Card label="二零二零年疫情段 · 没有任何注入" accent={C.cyan}>
              <Row name="测试点数" value={M.regime.points + " 点"} note={M.regime.start + " 至 " + M.regime.end} width={950} />
              <Row name="单高斯平均分" value={M.regime.priorMean.toFixed(2)} note="整段被读成偏离" color={C.cyan} width={950} />
              <Row name="混合平均分" value={M.regime.mixMean.toFixed(2)} note="整段被读成「另一个正常模式」" color={C.violet} width={950} />
              <Row name="报警率" value={M.regime.priorAlertPct.toFixed(0) + "% / " + M.regime.mixAlertPct.toFixed(0) + "%"} note="两个都没报警，机制方向是对的" width={950} />
            </Card>
            <Body style={{ marginTop: 20, width: 950 }}>
              书说多个模式能救状态切换。这一段就是那条机制的演示：混合把整段读成另一个正常模式，这正是书里想要的方向。
              但机制对，不等于检测变好。
            </Body>
          </div>
          <div style={{ position: "absolute", left: 1180, top: 300, width: 660 }}>
            <div style={{ fontFamily: FONT.sans, fontSize: FT.meta, color: C.inkFaint, marginBottom: 10 }}>该段平均分数</div>
            <PairBar
              a={{ label: "单高斯", value: M.regime.priorMean, text: M.regime.priorMean.toFixed(2) }}
              b={{ label: "混合", value: M.regime.mixMean, text: M.regime.mixMean.toFixed(2) }}
              width={620}
              height={150}
              colorA={C.cyan}
              colorB={C.violet}
            />
            <Body size={FT.meta} color={C.inkFaint} style={{ marginTop: 18, width: 620 }}>
              混合分数整段更低，说明它对这个状态有解释，不是没看见。
            </Body>
          </div>
        </AbsoluteFill>

        {/* 页三：分量解释判据 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 288, width: 1000 }}>
            <Body size={FT.lead} color={C.inkDim} style={{ width: 960, lineHeight: 1.7 }}>
              书的判据是「任何分量都解释不了，才算异常」。我们对每个漂移窗算四个分量的负对数似然，取最小：
              最相信它的分量有多不信它。
            </Body>
            <Card label="每个窗取四个分量的最小 NLL · 中位数" accent={C.amber} style={{ marginTop: 24 }}>
              <Row name="正常窗" value={M.components.normalMinMedian.toFixed(3)} note="训练出来的「正常」" width={960} />
              <Row name="漂移窗" value={M.components.driftMinMedian.toFixed(3)} note="趋势段，本该更高" color={C.amber} width={960} />
              <Row name="尖峰窗" value={M.components.spikeMinMedian.toFixed(3)} note="尖峰，稍远一点" color={C.coral} width={960} />
            </Card>
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
            <Body size={FT.meta} color={C.coral} style={{ marginTop: 18, width: 620 }}>
              漂移比正常还低。趋势段被某个分量完整解释了，它成了「另一个正常模式」。
            </Body>
            <K style={{ display: "block", marginTop: 16 }}>救状态切换的方式，是把不该放过的也放过了。</K>
          </div>
        </AbsoluteFill>
      </Pages>
    </Scene>
  );
};
