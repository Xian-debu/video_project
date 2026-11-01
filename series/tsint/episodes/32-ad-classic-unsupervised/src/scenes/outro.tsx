import React from "react";
import { C, FONT, FT } from "../../design/tokens";
import { PAD, M, fmtF, Scene, SceneHead, Card, Row, Body } from "../shared";

export const SOutro: React.FC = () => (
  <Scene id="outro">
    <SceneHead id="outro" />
    <div style={{ position: "absolute", left: PAD, top: 300, width: 1080 }}>
      <Card label="三句话带走" accent={C.cyan}>
        <Row name="第一句" value="无监督没有最准" note="同一批尖峰，三个 F1，换个形状排序全变" width={1040} />
        <Row name="第二句" value="形态替换是共同盲区" note="三种几何全部低于 0.025" width={1040} />
        <Row name="第三句" value="高维会让距离失效" note="想抓单点尖峰，先把维度拆开" width={1040} />
      </Card>
      <Body size={FT.body} style={{ marginTop: 26 }}>
        第 32 集，完。第四章还差四集 —— 下一集，把时间结构用起来。
      </Body>
    </div>
    <div style={{ position: "absolute", left: 1240, top: 300, width: 580 }}>
      <Card label="下一集" accent={C.violet}>
        <div style={{ fontFamily: FONT.serif, fontSize: 38, color: C.ink, lineHeight: 1.4 }}>
          序列模型
          <br />
          上异常检测。
        </div>
        <Body size={FT.meta} color={C.inkFaint} style={{ marginTop: 14 }}>
          自回归和状态空间 —— 用预测残差代替几何分数，把先后顺序也算进去。
        </Body>
      </Card>
    </div>
  </Scene>
);
