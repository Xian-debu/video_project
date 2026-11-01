import React from "react";
import { AbsoluteFill } from "remotion";
import { C, FONT, FT } from "../../design/tokens";
import { PAD, CW, M, fmtF, pageAt, Pages, Scene, SceneHead, Card, Row, Body, Chip } from "../shared";

export const SOutro: React.FC = () => (
  <Scene id="outro">
    <SceneHead id="outro" />
    <div style={{ position: "absolute", left: PAD, top: 300, width: 1080 }}>
      <Card label="三句话带走" accent={C.cyan}>
        <Row name="第一句" value="阈值决定 F1" note="同一串分数，三种切法，三个数" width={1040} />
        <Row name="第二句" value="SPOT 强在尾部" note="它把风险写进公式，但只认帕累托的尾巴" width={1040} />
        <Row name="第三句" value="阈值救不了瞎分数" note="全局 z 看不见局部，三种切法全低于 0.1" width={1040} />
      </Card>
      <Body size={FT.body} style={{ marginTop: 26 }}>
        第 31 集，完。第四章还差五集 —— 下一集，把标签拿掉。
      </Body>
    </div>
    <div style={{ position: "absolute", left: 1240, top: 300, width: 580 }}>
      <Card label="下一集" accent={C.violet}>
        <div style={{ fontFamily: FONT.serif, fontSize: 38, color: C.ink, lineHeight: 1.4 }}>
          没有标签，
          <br />
          怎么找异常。
        </div>
        <Body size={FT.meta} color={C.inkFaint} style={{ marginTop: 14 }}>
          K 均值、LOF、孤立森林 —— 三个都不用真值，F1 从哪来才是真问题。
        </Body>
      </Card>
    </div>
  </Scene>
);
