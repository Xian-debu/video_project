import React from "react";
import { AbsoluteFill } from "remotion";
import { C, FONT, FT, FT_T } from "../../design/tokens";
import { PAD, CW, M, pageAt, Pages, Scene, SceneHead, Stat, Mono, Body, Card, Row, Formula, Verdict } from "../shared";

export const SOutro: React.FC = () => {
  const at = [0, pageAt("outro", 7)];
  const t = M.tsmixer;
  return (
    <Scene id="outro">
      <SceneHead id="outro" />
      <Pages id="outro" at={at}>
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 360, width: CW }}>
            <Card label="三句话带走" accent={C.cyan} style={{ width: CW }}>
              <Formula size={44}>{"通道交互 " + M.router.denseComplexity + " → " + M.router.complexity + "，少 " + M.router.ratio + " 倍"}</Formula>
              <Row name="第一句" value="通道轴也有结构，但比时间轴贵" note={"双轴混合 " + t.params.toLocaleString("en-US") + " 参数，一次矩阵乘铺满 96×96"} color={C.cyan} width={1660} />
              <Row name="第二句" value="槽和簇是用容量换交互次数" note="路由 256 参数、聚类 9312 参数，都不碰 N²" color={C.amber} width={1660} />
              <Row name="第三句" value="不训练就只量结构与容量" note="纯度与 ARI 是读数，不是效果；边界写清楚" color={C.violet} width={1660} />
            </Card>
          </div>
          <div style={{ position: "absolute", left: PAD, top: 800, width: CW, display: "flex", gap: 26 }}>
            <Stat label="双轴混合" value={M.tsmixer.params.toLocaleString("en-US")} sub="参数" style={{ width: 520 }} />
            <Stat label="路由交互" value={String(M.router.complexity)} sub={"对稠密 " + M.router.denseComplexity} accent={C.amber} style={{ width: 520 }} />
            <Stat label="聚类 k=4" value={M.cluster.paramsK4.toLocaleString("en-US")} sub="参数" accent={C.violet} style={{ width: 520 }} />
          </div>
        </AbsoluteFill>

        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 380, width: CW }}>
            <div style={{ fontFamily: FONT.serif, fontSize: 120, color: C.ink, lineHeight: 1.1 }}>第 28 集，完。</div>
            <Body size={FT.h2} color={C.inkDim} style={{ marginTop: 22, maxWidth: 1500 }}>
              下一集，概率生成补集：Copula、扩散损失、连续流，把点预测换成分布。
            </Body>
          </div>
          <div style={{ position: "absolute", left: PAD, top: 780, width: CW, display: "flex", gap: 26 }}>
            <Card label="下一集" accent={C.cyan} style={{ width: 860, height: 180 }}>
              <Body size={FT.label}>通道之间的关系直接建成联合分布，再从中采样；三种做法，三种对相关结构的建模方式。</Body>
            </Card>
            <Card label="本集的账" accent={C.amber} style={{ width: 860, height: 180 }}>
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                <Verdict ok label="38 / 38" />
                <Verdict ok={false} label="未训练" />
              </div>
              <Mono size={FT.meta} color={C.inkFaint} style={{ display: "block", marginTop: 12 }}>book {M.meta.bookPages} · 算法提交 {M.meta.commit}</Mono>
            </Card>
          </div>
        </AbsoluteFill>
      </Pages>
    </Scene>
  );
};
