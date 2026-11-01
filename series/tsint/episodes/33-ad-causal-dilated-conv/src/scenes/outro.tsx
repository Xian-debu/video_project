import React from "react";
import { AbsoluteFill } from "remotion";
import { C, FONT, FT } from "../../design/tokens";
import { PAD, M, fmtF, fmtInt, Scene, SceneHead, Card, Body, Chip } from "../shared";

export const SOutro: React.FC = () => {
  return (
    <Scene id="outro">
      <SceneHead id="outro" />
      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 300, width: 1080 }}>
          <Card label="三句话带走" accent={C.cyan}>
            <div style={{ display: "flex", alignItems: "baseline", padding: "10px 0", borderBottom: "1px solid " + C.panelLine }}>
              <div style={{ width: 120, fontFamily: FONT.sans, fontSize: FT.body, color: C.inkDim }}>第一句</div>
              <div style={{ width: 430, fontFamily: FONT.sans, fontSize: FT.h2, color: C.ink }}>卷积默认看两边</div>
              <div style={{ fontFamily: FONT.sans, fontSize: FT.meta, color: C.inkFaint }}>左填充才叫因果</div>
            </div>
            <div style={{ display: "flex", alignItems: "baseline", padding: "10px 0", borderBottom: "1px solid " + C.panelLine }}>
              <div style={{ width: 120, fontFamily: FONT.sans, fontSize: FT.body, color: C.inkDim }}>第二句</div>
              <div style={{ width: 430, fontFamily: FONT.sans, fontSize: FT.h2, color: C.ink }}>离线分数不等于上线分数</div>
              <div style={{ fontFamily: FONT.sans, fontSize: FT.meta, color: C.inkFaint }}>对称核两种口径不一样</div>
            </div>
            <div style={{ display: "flex", alignItems: "baseline", padding: "10px 0" }}>
              <div style={{ width: 120, fontFamily: FONT.sans, fontSize: FT.body, color: C.inkDim }}>第三句</div>
              <div style={{ width: 430, fontFamily: FONT.sans, fontSize: FT.h2, color: C.ink }}>因果模型两种口径逐位相同</div>
              <div style={{ fontFamily: FONT.sans, fontSize: FT.meta, color: C.inkFaint }}>这才是能验证的承诺</div>
            </div>
          </Card>
          <Body size={FT.body} color={C.inkDim} style={{ marginTop: 26 }}>
            感受野靠膨胀撑开：k 三，d 一二四八，三十一天。第 33 集，完。
          </Body>
          <div style={{ display: "flex", gap: 14, marginTop: 18 }}>
            <Chip color={C.cyan}>40 / 40</Chip>
            <Chip color={C.amber}>{fmtF(M.offline.gap, 4)} 差距</Chip>
            <Chip color={C.violet}>上线口径逐位相同</Chip>
          </div>
        </div>
        <div style={{ position: "absolute", left: 1200, top: 300, width: 630 }}>
          <Card label="下一集" accent={C.violet}>
            <div style={{ fontFamily: FONT.sans, fontSize: FT.h1, color: C.ink, lineHeight: 1.25 }}>
              门控记忆
            </div>
            <div style={{ fontFamily: FONT.sans, fontSize: FT.h2, color: C.violet, marginTop: 6 }}>
              GRU 与 LSTM
            </div>
            <Body size={FT.meta} color={C.inkFaint} style={{ marginTop: 10 }}>
              自回归预测，残差当分数。第 4 章还剩八集。
            </Body>
          </Card>
        </div>
      </AbsoluteFill>
    </Scene>
  );
};
