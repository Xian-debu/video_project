import React from "react";
import { AbsoluteFill } from "remotion";
import { C, FONT, FT, FT_T } from "../../design/tokens";
import { PAD, CW, M, pageAt, Pages, Scene, SceneHead, Stat, Mono, Body, Card, Row, Formula, Verdict } from "../shared";

export const SOutro: React.FC = () => {
  const at = [0, pageAt("outro", 7)];
  const t = M.patchtst;
  return (
    <Scene id="outro">
      <SceneHead id="outro" />
      <Pages id="outro" at={at}>
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 360, width: CW }}>
            <Card label="三句话带走" accent={C.cyan} style={{ width: CW }}>
              <Formula size={44}>{"交互 " + t.denseInteractions.toLocaleString("en-US") + " → " + t.interactions + "，比值 " + t.ratio.toFixed(2) + " 倍"}</Formula>
              <Row name="第一句" value="分块把平方的账砍掉七十六倍" note="位置少了，每对交互管辖的跨度长了" color={C.cyan} width={1660} />
              <Row name="第二句" value="交叉注意力的方向必须钉死" note="查询在解码端，键值在编码端" color={C.violet} width={1660} />
              <Row name="第三句" value="压掉分辨率，换回全局" note="块内细节有损，块间结构更清晰" color={C.amber} width={1660} />
            </Card>
          </div>
          <div style={{ position: "absolute", left: PAD, top: 800, width: CW, display: "flex", gap: 26 }}>
            <Stat label="块嵌入" value={String(M.patch.params)} sub="参数" style={{ width: 520 }} />
            <Stat label="PatchTST" value={String(M.patchtst.totalParams)} sub="参数" accent={C.amber} style={{ width: 520 }} />
            <Stat label="交叉解码器" value={String(M.cross.params)} sub="参数" accent={C.violet} style={{ width: 520 }} />
          </div>
        </AbsoluteFill>

        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 380, width: CW }}>
            <div style={{ fontFamily: FONT.serif, fontSize: 120, color: C.ink, lineHeight: 1.1 }}>第 27 集，完。</div>
            <Body size={FT.h2} color={C.inkDim} style={{ marginTop: 22, maxWidth: 1500 }}>
              下一集，通道三补集：混合 MLP、路由注意力、动态聚类，把时间轴换成通道轴。
            </Body>
          </div>
          <div style={{ position: "absolute", left: PAD, top: 780, width: CW, display: "flex", gap: 26 }}>
            <Card label="下一集" accent={C.cyan} style={{ width: 860, height: 170 }}>
              <Body size={FT.label}>八个通道不再各走各的：先补上通道之间的关系，再谈预测。</Body>
            </Card>
            <Card label="本集的账" accent={C.amber} style={{ width: 860, height: 170 }}>
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                <Verdict ok label="31 / 31" />
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
