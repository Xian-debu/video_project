import React from "react";
import { AbsoluteFill } from "remotion";
import { C, FT } from "../../design/tokens";
import { PAD, M, fmtF, Scene, SceneHead, Card, Body, Row } from "../shared";

export const SOutro: React.FC = () => (
  <Scene id="outro">
    <SceneHead id="outro" />
    <AbsoluteFill>
      <div style={{ position: "absolute", left: PAD, top: 300, width: 1000 }}>
        <Card label="三句话带走" accent={C.cyan}>
          <Row name="第一句" value="窗口一叠，标签就糊" note={"586 个窗里 " + M.labels.windows + " 个带标签"} width={940} />
          <Row name="第二句" value="同一组预测，三种口径三个 F1" note={fmtF(M.scores.mse.f1, 4) + " / " + fmtF(M.scores.pred.f1, 4) + " / 0"} width={940} color={C.amber} />
          <Row name="第三句" value="四个坑都是静默错误" note="只有断言能钉住它们" width={940} color={C.violet} />
        </Card>
        <div style={{ marginTop: 26 }}>
          <Body size={FT.body}>第 30 集，完。第四章从这里开始 —— 下一集把分数变成判定。</Body>
        </div>
      </div>
      <div style={{ position: "absolute", left: 1150, top: 330, width: 670 }}>
        <Card label="下一集" accent={C.coral} pad={24}>
          <Body size={FT.body} color={C.ink}>第 31 集 · 分数怎么变成 0/1：阈值、分类器，与最笨的基线。</Body>
          <Body size={FT.meta} style={{ marginTop: 14 }}>同一串分数，扫一遍阈值，看 P 和 R 怎么互相让路。</Body>
        </Card>
      </div>
    </AbsoluteFill>
  </Scene>
);
