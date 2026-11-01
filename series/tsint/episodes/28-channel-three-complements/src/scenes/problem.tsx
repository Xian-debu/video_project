import React from "react";
import { AbsoluteFill } from "remotion";
import { C, FONT, FT } from "../../design/tokens";
import { PAD, CW, M, pageAt, Pages, Scene, SceneHead, Stat, Mono, Body, Card, Row, Heat, Formula, PairBar } from "../shared";

export const SProblem: React.FC = () => {
  const at = [0, pageAt("problem", 9), pageAt("problem", 19)];
  const gcol = [C.cyan, C.amber, C.violet, C.coral];
  return (
    <Scene id="problem">
      <SceneHead id="problem" />
      <Pages id="problem" at={at}>
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 290, width: 900 }}>
            <Card label="六十四通道相关矩阵 · 色越亮相关越高" style={{ width: 880 }}>
              <Heat matrix={M.series.corr64} labels={[]} groups={M.series.groups64} cell={10} gap={1} min={0} max={1} />
              <div style={{ display: "flex", gap: 16, marginTop: 12, flexWrap: "wrap" }}>
                {M.industryNames.map((nm, i) => (
                  <span key={nm} style={{ fontFamily: FONT.sans, fontSize: FT.tiny, color: gcol[i % 4] }}>{nm}</span>
                ))}
              </div>
            </Card>
          </div>
          <div style={{ position: "absolute", left: 1060, top: 300, width: 760 }}>
            <Stat label="两两相关对数" value={M.data.channels * (M.data.channels - 1) / 2 + ""} sub="六十四乘六十三除以二" style={{ width: 700 }} />
            <Stat label="同行业平均相关" value={M.tsmixer.withinCorr8.toFixed(4)} sub="八通道面板，三组各三只" accent={C.cyan} style={{ width: 700, marginTop: 22 }} />
            <Stat label="跨行业平均相关" value={M.tsmixer.crossCorr8.toFixed(4)} sub="同一段样本，同一把尺子" accent={C.coral} style={{ width: 700, marginTop: 22 }} />
          </div>
        </AbsoluteFill>

        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 330, width: CW }}>
            <Card label="同组与跨组：八通道面板" style={{ width: CW }}>
              <PairBar
                a={{ label: "同组", value: M.tsmixer.withinCorr8, text: M.tsmixer.withinCorr8.toFixed(4) }}
                b={{ label: "跨组", value: M.tsmixer.crossCorr8, text: M.tsmixer.crossCorr8.toFixed(4) }}
                width={1500}
                height={170}
              />
              <Row name="差距" value={(M.tsmixer.withinCorr8 - M.tsmixer.crossCorr8).toFixed(4)} note="不是零，但很小：行业结构只值这么点" color={C.amber} width={1500} />
            </Card>
          </div>
          <div style={{ position: "absolute", left: PAD, top: 760, width: CW, display: "flex", gap: 26 }}>
            <Card label="共同因子" accent={C.violet} style={{ width: 820, height: 210 }}>
              <Formula size={56}>{"λ₁ / N = " + M.tsmixer.marketShare.toFixed(4)}</Formula>
              <Body size={FT.meta} style={{ marginTop: 8 }}>第一主成分占四成三：市场一起涨、一起跌，把行业信号压在下面。</Body>
            </Card>
            <Card label="这条面板的行业块" style={{ width: 820, height: 210 }}>
              <div style={{ fontFamily: FONT.mono, fontSize: 52, color: C.amber }}>{M.tsmixer.corrBlockMass8.toFixed(4)}</div>
              <Body size={FT.meta} style={{ marginTop: 8 }}>行业内部相关占全部相关质量的比例，八通道面板。</Body>
            </Card>
          </div>
        </AbsoluteFill>

        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 330, width: CW }}>
            <div style={{ fontFamily: FONT.serif, fontSize: 60, color: C.ink }}>减掉市场共模，符号就分开了。</div>
            <div style={{ display: "flex", gap: 28, marginTop: 48 }}>
              <Stat label="减共模后 · 同行业" value={M.cluster.withinResid.toFixed(4)} sub="六十四通道，训练段相关" accent={C.cyan} valueColor={C.cyan} style={{ width: 560 }} />
              <Stat label="减共模后 · 跨行业" value={M.cluster.acrossResid.toFixed(4)} sub="负号：行业内部比外部更同步" accent={C.coral} valueColor={C.coral} style={{ width: 560 }} />
              <Stat label="原始 · 同行业" value={M.cluster.withinRaw.toFixed(4)} sub="被共模抬到零点四七" accent={C.violet} style={{ width: 560 }} />
            </div>
            <div style={{ marginTop: 40 }}>
              <Row name="做法" value="z − (z·v₁) v₁" note="逐日减去第一主成分方向的投影" width={1500} />
              <Row name="代价" value="去掉的不只是噪声" note="共模里也可能有真实的市场信息" color={C.amber} width={1500} />
              <Row name="结论" value="通道建模先处理共模" note="否则三种模块都在拟合同一个因子" color={C.cyan} width={1500} />
            </div>
          </div>
          <div style={{ position: "absolute", left: PAD, top: 860, width: CW }}>
            <Mono size={FT.meta} color={C.inkFaint}>面板：{M.data.rows64} 行 × {M.data.channels} 通道，{M.data.start} 到 {M.data.end}</Mono>
          </div>
        </AbsoluteFill>
      </Pages>
    </Scene>
  );
};
