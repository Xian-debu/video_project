import React from "react";
import { AbsoluteFill } from "remotion";
import { C, FONT, FT } from "../../design/tokens";
import { PAD, CW, M, pageAt, Pages, Scene, SceneHead, Stat, Mono, Body, Card, Row, Verdict } from "../shared";

export const SOutro: React.FC = () => {
  const at = [0, pageAt("outro", 6)];
  return (
    <Scene id="outro">
      <SceneHead id="outro" />
      <Pages id="outro" at={at}>
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 400, width: 1120 }}>
            <Card label="三句话带走" accent={C.cyan} style={{ height: 440 }}>
              <Row name="一" value="通道轴是另一条注意力轴" note="N×N 比 T×T 便宜 144 倍，且对应关系而非自相关" width={1060} />
              <Row name="二" value="稠密与稀疏是两条路" note="iTransformer 学、图卷积算；前者灵活，后者可解释" width={1060} />
              <Row name="三" value="结构验证先于效果验证" note="等变、归一化、连通分量先锁死，再谈收益" width={1060} />
            </Card>
          </div>
          <div style={{ position: "absolute", left: PAD + 1160, top: 400, width: 560 }}>
            <Stat label="注意力乘法" value="64" sub="对 9,216" accent={C.cyan} style={{ height: 210 }} />
            <Stat label="图边数" value="29" sub="二十只票，k = 2" accent={C.violet} style={{ height: 210, marginTop: 40 }} />
          </div>
        </AbsoluteFill>

        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 420, width: CW }}>
            <div style={{ fontFamily: FONT.serif, fontSize: 88, color: C.ink }}>下一集：递归与分段</div>
            <div style={{ fontFamily: FONT.serif, fontSize: FT.h1, color: C.inkDim, marginTop: 18 }}>
              RNN 的两条生成路
            </div>
            <Body size={FT.label} style={{ marginTop: 30, width: 1100 }}>
              通道关系讲完，回到时间轴：循环网络怎么一步步把序列喂进去，又怎么把误差传回去。
            </Body>
          </div>
          <div style={{ position: "absolute", left: PAD, top: 940, width: CW }}>
            <Mono size={FT.meta} color={C.inkFaint}>第 24 集 · 完 · 下一集 第 25 集</Mono>
          </div>
        </AbsoluteFill>
      </Pages>
    </Scene>
  );
};
