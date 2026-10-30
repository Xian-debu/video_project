import React from "react";
import { Build } from "../../design/primitives";
import { C, FONT, FT } from "../../design/tokens";
import { Body, Card, K, M, PAD, Pages, Scene, SceneHead, Stat, fmtF, lf } from "../shared";

export const SOutro: React.FC = () => {
  const d = M.stats.decomp;
  return (
    <Scene id="outro">
      <SceneHead id="outro" />
      <Pages id="outro" at={[0, 0.52]}>
        <div>
          <div style={{ position: "absolute", left: PAD, top: 236, fontFamily: FONT.sans, fontSize: FT.h2, color: C.inkDim }}>
            三个数收尾：一个强趋势，一个反例，一条基线。
          </div>
          <Build at={lf("outro", 0.05)}>
            <div style={{ position: "absolute", left: PAD, top: 310, display: "flex", gap: 26 }}>
              <Stat label="茅台日线" accent={C.cyan} value={fmtF(d.maotai.trend, 4) + " / " + fmtF(d.maotai.seasonal, 4)} sub="趋势 / 季节 · m = 5 · 726 点" style={{ width: 574, height: 230 }} />
              <Stat label="茅台五分钟" accent={C.amber} value={fmtF(d.minute.trend, 4) + " / " + fmtF(d.minute.seasonal, 4)} sub="趋势 / 季节 · m = 48 · 192 点" style={{ width: 574, height: 230 }} />
              <Stat label="纯噪声基线" accent={C.coral} value={fmtF(M.stats.noiseTrend, 4)} sub="不是零，是核的形状" style={{ width: 574, height: 230 }} valueColor={C.coral} />
            </div>
          </Build>
          <Build at={lf("outro", 0.2)}>
            <div style={{ position: "absolute", left: PAD, top: 600, width: 1776, fontFamily: FONT.serif, fontSize: 50, color: C.ink, lineHeight: 1.4 }}>
              分解给的是体检报告：描述现状，不给预测。
            </div>
          </Build>
          <Build at={lf("outro", 0.34)}>
            <div style={{ position: "absolute", left: PAD, top: 720, width: 1776, fontFamily: FONT.sans, fontSize: FT.body, color: C.inkDim }}>
              同样的数据，换成频域看，会得到另一套坐标；那才是下一集要做的事。
            </div>
          </Build>
        </div>

        <div>
          <div style={{ position: "absolute", left: PAD, top: 236, fontFamily: FONT.sans, fontSize: FT.h2, color: C.inkDim }}>
            下一集：三种「换坐标系」的方式。
          </div>
          <Build at={lf("outro", 0.58)}>
            <div style={{ position: "absolute", left: PAD, top: 310, display: "flex", gap: 26 }}>
              <Card label="FFT" accent={C.cyan} style={{ width: 574, height: 300 }}><div style={{ fontFamily: FONT.sans, fontSize: FT.h2, color: C.ink }}>整段序列的频谱</div><Body size={FT.meta} style={{ marginTop: 10 }}>把序列写成一组正弦的叠加，看每个频率占多少能量。</Body></Card>
              <Card label="基展开" accent={C.amber} style={{ width: 574, height: 300 }}><div style={{ fontFamily: FONT.sans, fontSize: FT.h2, color: C.ink }}>选一组基，投影</div><Body size={FT.meta} style={{ marginTop: 10 }}>FFT 是特例；换基就是换一组「基本形状」。</Body></Card>
              <Card label="Patch" accent={C.violet} style={{ width: 574, height: 300 }}><div style={{ fontFamily: FONT.sans, fontSize: FT.h2, color: C.ink }}>切成小段，各自成词</div><Body size={FT.meta} style={{ marginTop: 10 }}>不再要求整段平稳；每一段自己一个表示。</Body></Card>
            </div>
          </Build>
          <Build at={lf("outro", 0.72)}>
            <div style={{ position: "absolute", left: PAD, top: 660, width: 1776 }}>
              <Card accent={C.cyan} style={{ height: 180 }}>
                <K>留给下一集的问题</K>
                <Body style={{ marginTop: 8 }}>形状一样、长度一样的两条序列，频谱一定一样吗？如果不一样，差在哪里？</Body>
              </Card>
            </div>
          </Build>
          <Build at={lf("outro", 0.86)}>
            <div style={{ position: "absolute", left: PAD, top: 880, fontFamily: FONT.sans, fontSize: FT.meta, color: C.inkFaint }}>
              先分解，再换坐标：两个问题，两种问法。
            </div>
          </Build>
        </div>
      </Pages>
    </Scene>
  );
};
