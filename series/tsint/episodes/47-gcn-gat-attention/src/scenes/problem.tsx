import React from "react";
import { AbsoluteFill } from "remotion";
import { C, FONT, FT } from "../../design/tokens";
import {
  PAD, M, pagesOf, Pages, Scene, SceneHead, Card, Body, Chip, Row, MiniTable, Heat, fmt4,
} from "../shared";
import { SplitFig } from "../figs";

const d = M.data;
const gm = M.graph;

export const SProblem: React.FC = () => {
  const at = pagesOf("problem");
  return (
    <Scene id="problem">
      <SceneHead id="problem" />
      <Pages id="problem" at={at}>
        {/* 页一：样本不独立 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 292, width: 660 }}>
            <div style={{ fontFamily: FONT.serif, fontSize: FT.h1, color: C.ink, lineHeight: 1.18 }}>
              表格里的样本
              <br />
              是独立的。
            </div>
            <Body style={{ marginTop: 20, width: 640 }}>
              一行一只股票、一天，样本之间假装互不相干。可现实里，一家银行的坏消息会顺着同业一起动：工行和建行的收益相关性是 {fmt4(gm.edges[0].corr)}，几乎同一条线。把这种关系写进邻接矩阵，模型才看得见「谁和谁一起动」。
            </Body>
            <div style={{ marginTop: 20, display: "flex", gap: 12, flexWrap: "wrap" }}>
              <Chip color={C.coral}>样本独立假设</Chip>
              <Chip color={C.cyan}>图上消息传递</Chip>
            </div>
          </div>
          <div style={{ position: "absolute", left: 780, top: 288, width: 1050 }}>
            <Card label="最强的五条边，全在银行内部" accent={C.coral} pad={20}>
              <MiniTable
                head={["一对股票", "相关性", "行业"]}
                rows={gm.edges.slice(0, 5).map((e) => [e.a + " · " + e.b, fmt4(e.corr), "银行"])}
                colW={[520, 200, 200]}
                width={1000}
                rowH={50}
              />
            </Card>
            <div style={{ marginTop: 14 }}>
              <Body color={C.inkDim} size={FT.meta}>
                {"同一行业的十只股票，四十五对里连上三十四对；行业外三百对只连上二十八对。"}
              </Body>
            </div>
          </div>
        </AbsoluteFill>

        {/* 页二：图是算出来的 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 288, width: 620 }}>
            <div style={{ fontFamily: FONT.serif, fontSize: FT.h1, color: C.ink, lineHeight: 1.18 }}>
              图不是学出来的，
              <br />
              是算出来的。
            </div>
            <Body style={{ marginTop: 20, width: 600 }}>
              {"邻接矩阵 A 在训练前就定死了：相关性绝对值越过 " + fmt4(gm.theta, 1) + " 就是 1，否则是 0。A 不动，训练只改权重。"}
            </Body>
            <div style={{ marginTop: 20 }}>
              <Row name="节点" value={String(d.cols)} note="三十只股票" color={C.cyan} width={560} />
              <Row name="边" value={String(d.edges)} note={"阈值 " + fmt4(gm.theta, 1)} color={C.violet} width={560} />
              <Row name="A 的块结构" value="三个方块" note="行业内部几乎全连" color={C.amber} width={560} />
            </div>
          </div>
          <div style={{ position: "absolute", left: 700, top: 282, width: 1140 }}>
            <Card label="30 × 30 相关性矩阵：块对角先于模型出现" accent={C.cyan} pad={14}>
              <Heat matrix={gm.corr} labels={d.names} groups={d.groups} cell={17} gap={2} labelW={92} size={10} min={-1} max={1} />
            </Card>
          </div>
        </AbsoluteFill>

        {/* 页三：21 / 9 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 290, width: 660 }}>
            <div style={{ fontFamily: FONT.serif, fontSize: FT.h1, color: C.ink, lineHeight: 1.18 }}>
              二十一个训练，
              <br />
              九个测试。
            </div>
            <Body style={{ marginTop: 20, width: 640 }}>
              把三十个节点按行业切开：每个行业前七只的标签拿来训练，后三只只在最后打分时出现。图本身两个子集共用，测试节点的边也在图里——但它们的标签不参与训练。
            </Body>
            <div style={{ marginTop: 20 }}>
              <Row name="训练节点" value={String(d.trainNodes)} note="占七成" color={C.cyan} />
              <Row name="测试节点" value={String(d.testNodes)} note="占三成" color={C.amber} />
              <Row name="随机猜" value={fmt4(d.chance)} note="三类，各 1/3" color={C.inkFaint} />
            </div>
          </div>
          <div style={{ position: "absolute", left: 780, top: 290, width: 1050 }}>
            <Card label="同一张图，两个互不重叠的标签集" accent={C.amber} pad={22}>
              <SplitFig width={990} />
            </Card>
          </div>
        </AbsoluteFill>

        {/* 页四：三种态度 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 288, width: 680 }}>
            <div style={{ fontFamily: FONT.serif, fontSize: FT.h1, color: C.ink, lineHeight: 1.18 }}>
              同一张图，
              <br />
              三种态度。
            </div>
            <Body style={{ marginTop: 20, width: 660 }}>
              GCN 把归一化邻接当成固定的平均算子，先算好 P，每一层乘一次；GAT 让每条边的权重由打分和 softmax 学出来，每一层重算；自注意力干脆不要图，把掩码设成全 1，所有点两两互看。
            </Body>
          </div>
          <div style={{ position: "absolute", left: 800, top: 288, width: 1060 }}>
            <Card label="固定 / 学 / 不要，三种用图方式" accent={C.violet} pad={22}>
              <Row name="固定邻接" value={"P = D⁻¹ᐟ²(A+I)D⁻¹ᐟ²"} note={"GCN · 参数 " + M.gcn.params} color={C.cyan} width={1000} />
              <Row name="学边权" value={"α = softmax(mask(LeakyReLU))"} note={"GAT · 参数 " + M.gat.params} color={C.violet} width={1000} />
              <Row name="不要图" value={"softmax(QKᵀ/√d′)V"} note={"自注意力 · 参数 " + M.attn.params} color={C.amber} width={1000} />
            </Card>
            <div style={{ marginTop: 16 }}>
              <Body color={C.inkDim} size={FT.meta}>
                {"三套参数都在同一批节点上训练三百轮，用的损失和优化器完全一样。"}
              </Body>
            </div>
          </div>
        </AbsoluteFill>

        {/* 页五：三个问题 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 290, width: 700 }}>
            <div style={{ fontFamily: FONT.serif, fontSize: FT.h1, color: C.ink, lineHeight: 1.18 }}>
              三个问题，
              <br />
              三张成绩单。
            </div>
            <Body style={{ marginTop: 20, width: 680 }}>
              第一，这张图真的有用吗？把邻接打乱再跑一遍，准确率会掉到多少。第二，GAT 学出来的边权有用吗？比固定邻接好还是差。第三，干脆不要图会怎样？自注意力只剩节点自己的特征。
            </Body>
            <div style={{ marginTop: 22, display: "flex", gap: 12, flexWrap: "wrap" }}>
              <Chip color={C.cyan}>图有用吗</Chip>
              <Chip color={C.violet}>边权有用吗</Chip>
              <Chip color={C.coral}>不要图行不行</Chip>
            </div>
          </div>
          <div style={{ position: "absolute", left: 820, top: 290, width: 1040 }}>
            <Card label="三个问题都能量，答案都在证据 JSON 里" accent={C.cyan} pad={22}>
              <Row name="① 图有用吗" value={"打乱邻接 " + fmt4(M.control.shuffledTestAcc)} note={"九格里对一格"} color={C.coral} width={980} />
              <Row name="② 边权有用吗" value={"GAT " + fmt4(M.gat.testAcc)} note={"九格里对八格"} color={C.violet} width={980} />
              <Row name="③ 不要图行不行" value={"自注意力 " + fmt4(M.attn.testAcc)} note={"九格里对六格"} color={C.amber} width={980} />
            </Card>
            <div style={{ marginTop: 16 }}>
              <Body color={C.inkDim} size={FT.meta}>
                {"先记住这三个数，后面的定义页和验证页会一条一条把它们算出来。"}
              </Body>
            </div>
          </div>
        </AbsoluteFill>
      </Pages>
    </Scene>
  );
};
