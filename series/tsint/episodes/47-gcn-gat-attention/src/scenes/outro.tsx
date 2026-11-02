import React from "react";
import { AbsoluteFill } from "remotion";
import { C, FONT, FT, FT_T } from "../../design/tokens";
import {
  PAD, M, pagesOf, Pages, Scene, SceneHead, Card, Body, Chip, Row, KV, fmt4,
} from "../shared";
import { ThreeUpFig } from "../figs";

const d = M.data;

export const SOutro: React.FC = () => {
  const at = pagesOf("outro");
  return (
    <Scene id="outro">
      <SceneHead id="outro" />
      <Pages id="outro" at={at}>
        {/* 页一：三句话 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 290, width: 660 }}>
            <div style={{ fontFamily: FONT.serif, fontSize: FT.h1, color: C.ink, lineHeight: 1.18 }}>
              三句话带走。
            </div>
            <Body style={{ marginTop: 22, width: 640 }}>
              {"第一，图给了样本之间本不存在的关系，邻居聚合把这层关系变成计算；第二，注意力把「邻居各占多少」从度数换成学出来的权重；第三，判断图有没有用，看打乱邻接后的成绩——" + fmt4(M.control.shuffledTestAcc) + " 对 " + fmt4(M.gcn.testAcc) + "，这才是图像在起作用的证据。"}
            </Body>
            <div style={{ marginTop: 22 }}>
              <Row name="真实图" value={M.control.gcnCorrect + " / " + d.testNodes} note="GCN" color={C.cyan} width={620} />
              <Row name="打乱图" value={M.control.shuffledCorrect + " / " + d.testNodes} note="同一套代码，只换邻接" color={C.coral} width={620} />
              <Row name="随机线" value={fmt4(d.chance)} note="三类各 1/3" color={C.inkFaint} width={620} />
            </div>
          </div>
          <div style={{ position: "absolute", left: 780, top: 296, width: 1040 }}>
            <Card label="同一张图，三种成绩；打乱之后只剩随机" accent={C.cyan} pad={22}>
              <ThreeUpFig width={990} />
            </Card>
          </div>
        </AbsoluteFill>

        {/* 页二：下集 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 300, width: 900 }}>
            <div style={{ fontFamily: FONT.mono, fontSize: FT.label, letterSpacing: FT_T.label, color: C.coral }}>下一集</div>
            <div style={{ fontFamily: FONT.serif, fontSize: 78, color: C.ink, lineHeight: 1.16, marginTop: 14 }}>
              没有标签怎么学：
              <br />
              增强、对比与掩码。
            </div>
            <div style={{ marginTop: 22, display: "flex", gap: 12 }}>
              <Chip color={C.coral}>第 {M.meta.next.id} 集</Chip>
              <Chip color={C.cyan}>{M.meta.next.minutes + " 分钟"}</Chip>
              <Chip color={C.violet}>ch05 · 自监督</Chip>
            </div>
          </div>
          <div style={{ position: "absolute", left: 1080, top: 300, width: 720 }}>
            <Card label="这一集留下的问题" accent={C.violet} pad={24}>
              <KV k="训练节点" v={d.trainNodes + " / " + d.cols} note="只有二十一个标签" color={C.amber} />
              <KV k="如果没标签" v="图还在，标签没了" note="邻居结构本身能不能当监督信号" color={C.cyan} />
              <KV k="下一集" v="扰动、对比、遮住再重建" note="从数据里自己造监督" color={C.violet} />
            </Card>
          </div>
        </AbsoluteFill>
      </Pages>
    </Scene>
  );
};
