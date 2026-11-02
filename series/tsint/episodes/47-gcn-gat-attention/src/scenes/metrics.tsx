import React from "react";
import { AbsoluteFill } from "remotion";
import { C, FONT, FT } from "../../design/tokens";
import {
  PAD, M, pagesOf, Pages, Scene, SceneHead, Card, Body, Chip, Row, MiniTable, fmt4, fmtInt,
} from "../shared";
import { LossFig, ParamFig, ThreeUpFig } from "../figs";

const d = M.data;

export const SMetrics: React.FC = () => {
  const at = pagesOf("metrics");
  return (
    <Scene id="metrics">
      <SceneHead id="metrics" />
      <Pages id="metrics" at={at}>
        {/* 页一：配方 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 292, width: 660 }}>
            <div style={{ fontFamily: FONT.serif, fontSize: FT.h1, color: C.ink, lineHeight: 1.18 }}>
              配方只有一套，
              <br />
              三个模型共用。
            </div>
            <Body style={{ marginTop: 20, width: 640 }}>
              {"三百轮、Adam、学习率 0.01、种子 7、交叉熵；输入是每个节点的五维特征，标签是三类收益率分位。训练节点 " + d.trainNodes + " 个、测试节点 " + d.testNodes + " 个，三次实验只换模型结构，别的都不动。"}
            </Body>
            <div style={{ marginTop: 20, display: "flex", gap: 12, flexWrap: "wrap" }}>
              <Chip color={C.cyan}>{M.gcn.epochs + " 轮"}</Chip>
              <Chip color={C.violet}>{"Adam · " + fmt4(M.gcn.lr, 2)}</Chip>
              <Chip color={C.amber}>{"种子 " + M.gcn.seed}</Chip>
            </div>
          </div>
          <div style={{ position: "absolute", left: 780, top: 290, width: 1050 }}>
            <Card label="同一份配方，三套结构" accent={C.cyan} pad={22}>
              <MiniTable
                head={["项目", "值", "说明"]}
                rows={[
                  ["训练轮数", String(M.gcn.epochs), "三个模型一致"],
                  ["优化器 / 学习率", "Adam · " + fmt4(M.gcn.lr, 2), "没有调过"],
                  ["种子", String(M.gcn.seed), "初始化与打乱共用"],
                  ["划分", d.trainNodes + " / " + d.testNodes, "节点级，标签不重叠"],
                  ["损失", "交叉熵", "三分类，均匀猜是 log 3"],
                ]}
                colW={[280, 280, 400]}
                width={1000}
                rowH={48}
              />
            </Card>
            <div style={{ marginTop: 14 }}>
              <Body color={C.inkDim} size={FT.meta}>
                {"配方越简单，模型之间的差别越能归给结构本身。"}
              </Body>
            </div>
          </div>
        </AbsoluteFill>

        {/* 页二：GCN */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 290, width: 650 }}>
            <div style={{ fontFamily: FONT.serif, fontSize: FT.h1, color: C.ink, lineHeight: 1.18 }}>
              GCN 把九个
              <br />
              全记住了。
            </div>
            <Body style={{ marginTop: 20, width: 630 }}>
              {"固定邻接版本：训练准确率 " + fmt4(M.gcn.trainAcc) + "，测试准确率 " + fmt4(M.gcn.testAcc) + "，九格全对。训练损失从 " + fmt4(M.gcn.lossStart) + " 压到 " + fmt4(M.gcn.lossEnd) + "，梯度核对的偏差只有 " + M.gcn.gradDiff.toExponential(3) + "。"}
            </Body>
            <div style={{ marginTop: 20 }}>
              <Row name="测试" value={M.control.gcnCorrect + " / " + d.testNodes} note="三类随机 1/3" color={C.cyan} />
              <Row name="损失" value={fmt4(M.gcn.lossEnd)} note={"从 " + fmt4(M.gcn.lossStart) + " 降下来"} color={C.violet} />
              <Row name="梯度差" value={M.gcn.gradDiff.toExponential(3)} note="解析 vs 数值" color={C.amber} />
            </div>
          </div>
          <div style={{ position: "absolute", left: 770, top: 288, width: 1060 }}>
            <Card label="三条损失曲线都往下走，GCN 压得最平" accent={C.cyan} pad={20}>
              <LossFig width={1010} height={320} />
            </Card>
          </div>
        </AbsoluteFill>

        {/* 页三：GAT */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 292, width: 650 }}>
            <div style={{ fontFamily: FONT.serif, fontSize: FT.h1, color: C.ink, lineHeight: 1.18 }}>
              GAT 差一个，
              <br />
              但代价最高。
            </div>
            <Body style={{ marginTop: 20, width: 630 }}>
              {"学边权的版本测试 " + fmt4(M.gat.testAcc) + "，" + Math.round(M.gat.testAcc * d.testNodes) + " 个对 " + Math.round((1 - M.gat.testAcc) * d.testNodes) + " 个错；损失停在 " + fmt4(M.gat.lossEnd) + "，比 GCN 高得多。四个头把参数堆到 " + M.gat.params + " 个，是 GCN 的两倍多。"}
            </Body>
            <div style={{ marginTop: 20 }}>
              <Row name="测试" value={Math.round(M.gat.testAcc * d.testNodes) + " / " + d.testNodes} note="对八个" color={C.violet} />
              <Row name="损失" value={fmt4(M.gat.lossEnd)} note={"从 " + fmt4(M.gat.lossStart) + " 降下来"} color={C.cyan} />
              <Row name="参数" value={fmtInt(M.gat.params)} note={"GCN 的 " + fmt4(M.gat.params / M.gcn.params, 2) + " 倍"} color={C.amber} />
            </div>
          </div>
          <div style={{ position: "absolute", left: 790, top: 288, width: 1060 }}>
            <Card label="参数 147 → 328 → 816，一层比一层贵" accent={C.violet} pad={22}>
              <ParamFig width={1000} />
            </Card>
          </div>
        </AbsoluteFill>

        {/* 页四：自注意力 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 292, width: 650 }}>
            <div style={{ fontFamily: FONT.serif, fontSize: FT.h1, color: C.ink, lineHeight: 1.18 }}>
              自注意力损失最低，
              <br />
              测试最差。
            </div>
            <Body style={{ marginTop: 20, width: 630 }}>
              {"不要图的版本测试 " + fmt4(M.attn.testAcc) + "，只对六个。可它的训练损失压到了 " + fmt4(M.attn.lossEnd) + "，比 GCN 还低两个数量级。损失说明它把二十一个训练节点背得很熟，测试说明这份记忆没转移出去。"}
            </Body>
            <div style={{ marginTop: 20 }}>
              <Row name="测试" value={M.control.attnCorrect + " / " + d.testNodes} note="只对六个" color={C.coral} />
              <Row name="训练损失终点" value={fmt4(M.attn.lossEnd)} note="三个里最低" color={C.cyan} />
              <Row name="参数" value={fmtInt(M.attn.params)} note="三个里最多" color={C.amber} />
            </div>
          </div>
          <div style={{ position: "absolute", left: 780, top: 288, width: 1050 }}>
            <Card label="损失越低、测试越差：这份记忆没转移出去" accent={C.coral} pad={22}>
              <MiniTable
                head={["模型", "训练损失终点", "测试准确率", "参数"]}
                rows={[
                  ["GCN", fmt4(M.gcn.lossEnd), fmt4(M.gcn.testAcc), fmtInt(M.gcn.params)],
                  ["GAT", fmt4(M.gat.lossEnd), fmt4(M.gat.testAcc), fmtInt(M.gat.params)],
                  ["自注意力", fmt4(M.attn.lossEnd), fmt4(M.attn.testAcc), fmtInt(M.attn.params)],
                ]}
                colW={[220, 300, 300, 220]}
                width={1000}
                rowH={54}
                hilite={2}
              />
            </Card>
            <div style={{ marginTop: 16 }}>
              <Body color={C.inkDim} size={FT.meta}>
                {"九格测试里一格就是 11.1 个百分点，三个模型的差距都在一两格之内——数量级的事先记住，边界一页再说。"}
              </Body>
            </div>
          </div>
        </AbsoluteFill>

        {/* 页五：三张成绩单 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 290, width: 680 }}>
            <div style={{ fontFamily: FONT.serif, fontSize: FT.h1, color: C.ink, lineHeight: 1.18 }}>
              同一张图，
              <br />
              三种成绩。
            </div>
            <Body style={{ marginTop: 20, width: 660 }}>
              {"固定邻接 " + fmt4(M.gcn.testAcc) + "、学边权 " + fmt4(M.gat.testAcc) + "、不要图 " + fmt4(M.attn.testAcc) + "；三类随机是 " + fmt4(d.chance) + "。三个都过了随机线，但没有谁敢说这是「图上学习」的胜利——真正的对照是打乱邻接，结果在验证一页。"}
            </Body>
            <div style={{ marginTop: 22, display: "flex", gap: 12, flexWrap: "wrap" }}>
              <Chip color={C.cyan}>9 / 9</Chip>
              <Chip color={C.violet}>8 / 9</Chip>
              <Chip color={C.amber}>6 / 9</Chip>
            </div>
          </div>
          <div style={{ position: "absolute", left: 800, top: 288, width: 1060 }}>
            <Card label="三个测试准确率，一条随机线" accent={C.cyan} pad={22}>
              <ThreeUpFig width={1000} />
            </Card>
            <div style={{ marginTop: 18 }}>
              <Row name="随机线" value={fmt4(d.chance)} note="三类各 1/3" color={C.inkFaint} width={980} />
              <Row name="最高" value={fmt4(M.gcn.testAcc)} note="固定邻接" color={C.cyan} width={980} />
              <Row name="差距" value={fmt4(M.gcn.testAcc - M.attn.testAcc)} note="三格，别急着下结论" color={C.coral} width={980} />
            </div>
          </div>
        </AbsoluteFill>
      </Pages>
    </Scene>
  );
};
