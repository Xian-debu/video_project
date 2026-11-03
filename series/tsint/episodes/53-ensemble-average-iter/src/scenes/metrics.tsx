import React from "react";
import { AbsoluteFill } from "remotion";
import { C, FONT, FT } from "../../design/tokens";
import { M, Body, Card, CheckGrid, Chip, KV, PAD, Pages, Scene, SceneHead, fmt2, pagesOf } from "../shared";
import { CandidateBars, LevelBars, WinTally } from "../figs";

export const MetricsScene: React.FC = () => (
  <Scene id="metrics">
    <SceneHead id="metrics" />
    <Pages id="metrics" at={pagesOf("metrics")}>
      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 292, width: 620 }}>
          <Body size={FT.h2} color={C.ink} style={{ lineHeight: 1.3 }}>五组，<br />二十八项，<br />八点九秒。</Body>
          <Body style={{ marginTop: 24 }}>
            全部通过。下面按组看：先看七条基线的高低，再看十个候选谁强谁弱，最后看二十只股票的胜负表。
          </Body>
        </div>
        <div style={{ position: "absolute", left: 740, top: 286, width: 1100 }}>
          <Card label="二十八项检查：按组成簇" accent={C.cyan}>
            <CheckGrid cell={30} />
          </Card>
          <div style={{ marginTop: 20, display: "flex", gap: 26 }}>
            <KV k="数据" v="4 / 4" color={C.cyan} />
            <KV k="集成" v="6 / 6" color={C.violet} />
            <KV k="交叉验证" v="7 / 7" color={C.amber} />
            <KV k="迭代" v="6 / 6" color={C.cyan} />
            <KV k="噪声" v="5 / 5" color={C.violet} />
          </div>
        </div>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 286, width: 600 }}>
          <Body size={FT.h2} color={C.ink} style={{ lineHeight: 1.28 }}>七个误差，<br />一条尺。</Body>
          <Body style={{ marginTop: 22 }}>
            从十一点二一到十点一六，集成确实降了误差。从十点一六到九点五五，挑选又降了一截。oracle 只比最强单模型低零点零一，这个池子的冠军几乎都能被选出来。
          </Body>
        </div>
        <div style={{ position: "absolute", left: 720, top: 280, width: 1130 }}>
          <Card label="检验段 MAE：平均单模型 → oracle" accent={C.amber}>
            <LevelBars width={1000} />
          </Card>
        </div>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 286, width: 600 }}>
          <Body size={FT.h2} color={C.ink} style={{ lineHeight: 1.28 }}>池子的形状<br />决定了上限。</Body>
          <Body style={{ marginTop: 22 }}>
            十个候选里六个在十以下，两个在十五以上。等权把它们也平均进来，所以只能到十点一六。如果池子更整齐，等权会更好看。
          </Body>
          <div style={{ marginTop: 22 }}>
            <Chip color={C.cyan}>六个 &lt; 10</Chip>
            <Chip color={C.coral} style={{ marginLeft: 10 }}>两个 &gt; 15</Chip>
          </div>
        </div>
        <div style={{ position: "absolute", left: 720, top: 276, width: 1130 }}>
          <Card label="十个候选的检验误差（升序）" accent={C.cyan}>
            <CandidateBars width={1000} />
          </Card>
        </div>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 286, width: 590 }}>
          <Body size={FT.h2} color={C.ink} style={{ lineHeight: 1.28 }}>二十只股票，<br />一个偏序。</Body>
          <Body style={{ marginTop: 22 }}>
            岭权重和迭代都稳定地赢过等权，二十比零。但没有一个集成方法整体赢过挑选。等权对最强单模型，零比二十。
          </Body>
        </div>
        <div style={{ position: "absolute", left: 700, top: 286, width: 1150 }}>
          <Card label="逐只股票的胜负：实心 = 赢" accent={C.violet}>
            <WinTally />
          </Card>
          <div style={{ marginTop: 18, fontFamily: FONT.mono, fontSize: FT.meta, color: C.inkFaint }}>
            赢等权靠降方差；输挑选因为挑选已经接近 oracle。
          </div>
        </div>
      </AbsoluteFill>
    </Pages>
  </Scene>
);
