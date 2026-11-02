import React from "react";
import { AbsoluteFill } from "remotion";
import { C, FONT, FT } from "../../design/tokens";
import { M, Body, Card, Chip, KV, PAD, Pages, pagesOf, Row, Scene, SceneHead } from "../shared";

export const OutroScene: React.FC = () => (
  <Scene id="outro">
    <SceneHead id="outro" />
    <Pages id="outro" at={pagesOf("outro")}>
      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 300, width: 680 }}>
          <Body size={FT.h1} color={C.ink} style={{ lineHeight: 1.25 }}>三句话<br />带走。</Body>
          <Body style={{ marginTop: 26 }}>
            第一，图像化是双射，不丢信息 —— 但双射不等于有用。第二，同一段曲线，GASF 看幅值、MTF 看次序，偏置不一样，Fisher 差两倍多。第三，表示能把信息摆到网络面前，摆不出来的信息它造不出来。
          </Body>
          <div style={{ display: "flex", gap: 10, marginTop: 24 }}>
            <Chip color={C.cyan}>双射</Chip>
            <Chip color={C.violet}>偏置</Chip>
            <Chip color={C.amber}>上限</Chip>
          </div>
        </div>
        <div style={{ position: "absolute", left: 800, top: 300, width: 1020 }}>
          <Card label="这一集的三个结论" accent={C.cyan}>
            <Row name="双射" value="反解误差 1e-16" note="min-max 前置" width={940} color={C.cyan} />
            <Row name="偏置" value={(M.fisher.gasf / M.fisher.mtf).toFixed(2) + " 倍"} note="GASF 对 MTF" width={940} color={C.violet} />
            <Row name="上限" value={((M.cnn.dual) * 100).toFixed(2) + "%"} note="双通道，随机带内" width={940} color={C.coral} />
            <Row name="集成" value={M.cote.cote.toFixed(4)} note={"低于最好单域 " + M.cote.best.toFixed(4)} width={940} color={C.amber} />
          </Card>
        </div>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 300, width: 700 }}>
          <Body size={FT.h2} color={C.ink} style={{ lineHeight: 1.28 }}>下一集：<br />自动选模型。</Body>
          <Body style={{ marginTop: 24 }}>
            第 50 集换一个角度：不调一个模型，而是问该在什么样的模型空间里选。同样的特征，池子不同，结果可能差出好几个点。
          </Body>
          <div style={{ marginTop: 22, fontFamily: FONT.sans, fontSize: FT.meta, color: C.inkDim }}>
            {M.meta.next.title}
          </div>
        </div>
        <div style={{ position: "absolute", left: 820, top: 300, width: 1000 }}>
          <Card label="下一集的问题" accent={C.violet}>
            <Row name="主题" value="池子比策略更重要" note="先定搜索空间" width={920} color={C.violet} />
            <Row name="问法" value="换空间，不换数据" note="同一套特征" width={920} />
            <Row name="时长" value={String(M.meta.next.minutes) + " 分钟"} note={"第 " + M.meta.next.id + " 集"} width={920} color={C.amber} />
          </Card>
          <div style={{ marginTop: 26, fontFamily: FONT.sans, fontSize: FT.h2, color: C.ink }}>
            谢谢观看，我们下集再见。
          </div>
        </div>
      </AbsoluteFill>
    </Pages>
  </Scene>
);
