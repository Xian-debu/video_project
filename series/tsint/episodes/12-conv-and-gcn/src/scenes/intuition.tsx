import React from "react";
import { Build } from "../../design/primitives";
import { C, FONT, FT } from "../../design/tokens";
import { Body, Card, Chip, Formula, K, M, Matrix, PAD, Pages, Scene, SceneHead, fmtF, lf } from "../shared";

/* 直觉：同一种运算，换的是邻居的定义方式。 */

export const SIntuition: React.FC = () => {
  const m = M;
  const path = m.struct.path;
  const comp = m.struct.complete;
  return (
    <Scene id="intuition">
      <SceneHead id="intuition" />
      <Pages id="intuition" at={[0, 0.29, 0.6, 0.75]}>
        <div>
          <div style={{ position: "absolute", left: PAD, top: 292, fontFamily: FONT.sans, fontSize: FT.h2, color: C.inkDim }}>
            先看不带图的卷积：一维输入，一维核。
          </div>
          <Build at={lf("intuition", 0.04)}>
            <div style={{ position: "absolute", left: PAD, top: 372 }}>
              <Formula size={46} style={{ color: C.ink }}>x:  1  2  3  4  5        核: 1  2  3</Formula>
            </div>
          </Build>
          <Build at={lf("intuition", 0.1)}>
            <div style={{ position: "absolute", left: PAD, top: 470, width: 1776 }}>
              <div style={{ fontFamily: FONT.mono, fontSize: FT.body, color: C.inkDim, lineHeight: 1.9 }}>
                <div>第 1 格：1×1 + 2×2 + 3×3 = 14</div>
                <div>第 2 格：2×1 + 3×2 + 4×3 = 20</div>
                <div>第 3 格：3×1 + 4×2 + 5×3 = 26</div>
              </div>
              <K style={{ display: "block", marginTop: 12 }}>核往右挪一格，再乘加一次；同一个核在每个位置复用</K>
            </div>
          </Build>
          <Build at={lf("intuition", 0.18)}>
            <div style={{ position: "absolute", left: PAD, top: 716, display: "flex", gap: 22 }}>
              <Chip color={C.cyan}>参数共享：核大小不随序列长度变</Chip>
              <Chip color={C.violet}>邻居由距离决定</Chip>
              <Chip color={C.amber}>跟数据内容无关</Chip>
            </div>
          </Build>
        </div>

        <div>
          <div style={{ position: "absolute", left: PAD, top: 292, fontFamily: FONT.sans, fontSize: FT.h2, color: C.inkDim }}>
            图上没有前后，只有连不连。
          </div>
          <Build at={lf("intuition", 0.32)}>
            <div style={{ position: "absolute", left: PAD, top: 360, display: "flex", gap: 34 }}>
              <Matrix rows={path.adj} cell={112} color={C.inkDim} caption="邻接矩阵 A · 一条链" showNumbers digits={0} />
              <Matrix rows={path.adjSelf} cell={112} color={C.violet} caption="A~ = A + I · 加自环" showNumbers digits={0} />
              <Matrix rows={path.p} cell={112} color={C.cyan} caption="P = D~^(−1/2) A~ D~^(−1/2)" digits={3} />
              <div style={{ width: 380, paddingTop: 40 }}>
                <K>度向量 D~</K>
                <div style={{ fontFamily: FONT.mono, fontSize: 34, color: C.amber, marginTop: 8 }}>{path.deg.join("  ")}</div>
                <Body size={FT.meta} style={{ marginTop: 14 }}>每一行给出一个节点怎么取邻居的加权均值；列是邻居。</Body>
              </div>
            </div>
          </Build>
          <Build at={lf("intuition", 0.4)}>
            <div style={{ position: "absolute", left: PAD, top: 700, display: "flex", gap: 22 }}>
              <Chip color={C.cyan}>加自环：自己也是邻居</Chip>
              <Chip color={C.violet}>按度归一化：输出尺度差不多</Chip>
              <Chip color={C.amber}>孤立节点度为 1，除法不炸</Chip>
            </div>
          </Build>
        </div>

        <div>
          <Build at={lf("intuition", 0.63)}>
            <div style={{ position: "absolute", left: PAD, top: 296 }}>
              <Formula size={46} style={{ color: C.ink }}>y = P x　　y = P (P x)　　y = P^L x</Formula>
              <K style={{ display: "block", marginTop: 14 }}>乘一次取一跳邻居，乘两次两跳，堆 L 层就是 L 阶邻域</K>
            </div>
          </Build>
          <Build at={lf("intuition", 0.68)}>
            <div style={{ position: "absolute", left: PAD, top: 456, display: "flex", gap: 26 }}>
              <Card label="一跳" accent={C.cyan} style={{ width: 570, height: 300 }}>
                <Body style={{ color: C.ink }}>每个节点取自己加直接邻居的加权均值。信息只走一条边。</Body>
              </Card>
              <Card label="两跳" accent={C.violet} style={{ width: 570, height: 300 }}>
                <Body style={{ color: C.ink }}>邻居的邻居也进来了。图上两步能到的人，都算进这个节点的视野。</Body>
              </Card>
              <Card label="L 阶" accent={C.amber} style={{ width: 588, height: 300 }}>
                <Body style={{ color: C.ink }}>视野随层数线性扩张；代价是每层一次矩阵乘，不需要训练。</Body>
              </Card>
            </div>
          </Build>
        </div>

        <div>
          <div style={{ position: "absolute", left: PAD, top: 288, fontFamily: FONT.sans, fontSize: FT.h2, color: C.inkDim }}>
            完全图是最极端的例子。
          </div>
          <Build at={lf("intuition", 0.78)}>
            <div style={{ position: "absolute", left: PAD, top: 366, display: "flex", gap: 40, alignItems: "flex-start" }}>
              <Matrix rows={comp.p} cell={120} color={C.cyan} caption="完全图传播子 · 每个元素三分之一" digits={4} />
              <div>
                <K>传播子乘任意向量</K>
                <div style={{ fontFamily: FONT.mono, fontSize: FT.body, color: C.ink, marginTop: 10 }}>
                  x = [{comp.x.join(", ")}]　→　Px = [{comp.px.join(", ")}]
                </div>
                <Body style={{ marginTop: 16, width: 700 }}>三行完全相同：一层之后，三个节点的特征就一模一样了。</Body>
                <K style={{ display: "block", marginTop: 12, color: C.coral }}>这叫过平滑</K>
              </div>
            </div>
          </Build>
          <Build at={lf("intuition", 0.86)}>
            <div style={{ position: "absolute", left: PAD, top: 760, width: 1776, background: C.panel, border: "1px solid " + C.panelLine, borderLeft: "3px solid " + C.coral, borderRadius: 12, padding: "18px 24px" }}>
              <div style={{ fontFamily: FONT.sans, fontSize: FT.h2, color: C.ink }}>环的半径越大，图越接近完全图，节点被同化得越快。</div>
            </div>
          </Build>
        </div>
      </Pages>
    </Scene>
  );
};