import React from "react";
import { AbsoluteFill } from "remotion";
import { C, FONT, FT } from "../../design/tokens";
import { Body, Card, Chip, M, PAD, Pages, pagesOf, Row, Scene, SceneHead, fmt2 } from "../shared";
import { ThreeUpFig } from "../figs";

export const OutroScene: React.FC = () => (
  <Scene id="outro">
    <SceneHead id="outro" />
    <Pages id="outro" at={pagesOf("outro")}>
      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 300, width: 660 }}>
          <Body size={FT.h1} color={C.ink} style={{ lineHeight: 1.25 }}>三句话<br />带走。</Body>
          <Body style={{ marginTop: 26 }}>第一，自监督是自己给自己出题：增强、对比、掩码都是把数据变成监督；第二，对比学习比掩码更会用一千条窗口，{fmt2(M.contrast.probeAcc)} 对 {fmt2(M.mask.probeAcc)}；第三，成绩小、测试少、训练欠，所以只说机制成立，不说方法更强。</Body>
          <div style={{ marginTop: 20 }}>
            <Row name="对比" value={fmt2(M.contrast.probeAcc)} note={M.contrast.correct + "/" + M.data.testProbe} width={620} color={C.violet} />
            <Row name="掩码" value={fmt2(M.mask.probeAcc)} note={M.mask.correct + "/" + M.data.testProbe} width={620} color={C.amber} />
            <Row name="基线" value={fmt2(M.data.baseline)} note="多数类" width={620} color={C.coral} />
          </div>
        </div>
        <div style={{ position: "absolute", left: 780, top: 320, width: 1040 }}>
          <ThreeUpFig width={980} />
          <div style={{ marginTop: 18, fontSize: FT.meta, color: C.inkFaint }}>三个数都是同一把尺子量出来的：冻结编码器，线性探针，二十条测试。</div>
        </div>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 300, width: 660 }}>
          <Chip color={C.coral}>下一集</Chip>
          <Body size={FT.h1} color={C.ink} style={{ lineHeight: 1.25, marginTop: 18 }}>把曲线<br />画成图。</Body>
          <Body style={{ marginTop: 22 }}>下一集：GAF 把一维序列铺成二维图，MTF 把状态转移写成矩阵，两条通道并进卷积；再把时域、ACF、谱和 shapelet 四个域的判断投成一票。</Body>
          <div style={{ display: "flex", gap: 10, marginTop: 22 }}>
            <Chip color={C.coral}>第 49 集</Chip>
            <Chip color={C.cyan}>22 分钟</Chip>
            <Chip color={C.violet}>ch05 · 表示</Chip>
          </div>
        </div>
        <div style={{ position: "absolute", left: 800, top: 300, width: 1020 }}>
          <Card label="这一集留下的问题" accent={C.violet}>
            <Row name="只有五十个标签" value="一千条窗口" note="行业三分类" width={960} />
            <Row name="换一种表示" value="曲线能变图像" note="GAF 靠幅值，MTF 靠转移次序" width={960} color={C.cyan} />
            <Row name="下一集" value="图像化 + 四域投票" note="GAF / MTF / RP 与 COTE" width={960} color={C.violet} />
            <div style={{ marginTop: 6 }} />
          </Card>
        </div>
      </AbsoluteFill>
    </Pages>
  </Scene>
);
