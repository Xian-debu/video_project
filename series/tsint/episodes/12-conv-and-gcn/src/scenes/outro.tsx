import React from "react";
import { Build } from "../../design/primitives";
import { C, FONT, FT } from "../../design/tokens";
import { Body, Card, Chip, Formula, K, M, PAD, Pages, Scene, SceneHead, Stat, lf } from "../shared";

/* 收尾：四个数字，一句话。 */

export const SOutro: React.FC = () => {
  const m = M;
  const last = m.syn.sweep[m.syn.sweep.length - 1];
  return (
    <Scene id="outro">
      <SceneHead id="outro" />
      <Pages id="outro" at={[0, 0.26, 0.52, 0.74]}>
        <div>
          <div style={{ position: "absolute", left: PAD, top: 296, fontFamily: FONT.sans, fontSize: FT.h2, color: C.inkDim }}>
            四个数字，收个尾。
          </div>
          <Build at={lf("outro", 0.04)}>
            <div style={{ position: "absolute", left: PAD, top: 386, display: "flex", gap: 24 }}>
              <Stat label="手算的第一个输出" accent={C.coral} value="−4" sub="三乘三输入 · 两乘二核" valueColor={C.coral} valueSize={76} style={{ width: 426, height: 260 }} />
              <Stat label="完全图传播子" accent={C.cyan} value="1/3" sub="每个元素三分之一" valueColor={C.cyan} valueSize={76} style={{ width: 426, height: 260 }} />
              <Stat label="谱上界" accent={C.violet} value={m.struct.spectralRatio.toFixed(3)} sub="一百个随机方向最大比值" valueColor={C.violet} valueSize={76} style={{ width: 426, height: 260 }} />
              <Stat label="行和最大偏差" accent={C.amber} value="9.2e−2" sub="对称归一化 ≠ 行归一化" valueColor={C.amber} valueSize={76} style={{ width: 450, height: 260 }} />
            </div>
          </Build>
        </div>

        <div>
          <Build at={lf("outro", 0.29)}>
            <div style={{ position: "absolute", left: PAD, top: 300 }}>
              <div style={{ fontFamily: FONT.serif, fontSize: 54, color: C.ink }}>一句话：卷积是固定邻域的加权和。</div>
              <div style={{ fontFamily: FONT.serif, fontSize: 42, color: C.cyan, marginTop: 18 }}>图的差别，只在邻居由邻接矩阵决定。</div>
            </div>
          </Build>
          <Build at={lf("outro", 0.4)}>
            <div style={{ position: "absolute", left: PAD, top: 520, display: "flex", gap: 26 }}>
              <Card label="能保证" accent={C.cyan} style={{ width: 875, height: 260 }}>
                <Body style={{ color: C.ink }}>传播子不放大信号：谱上界小于一，一百个方向都测过。</Body>
              </Card>
              <Card label="不能保证" accent={C.coral} style={{ width: 875, height: 260 }}>
                <Body style={{ color: C.ink }}>不磨平：完全图上乘一次，所有节点就一样了。</Body>
              </Card>
            </div>
          </Build>
        </div>

        <div>
          <Build at={lf("outro", 0.56)}>
            <div style={{ position: "absolute", left: PAD, top: 296, fontFamily: FONT.sans, fontSize: FT.h2, color: C.inkDim }}>
              所以图结构不是免费的。
            </div>
          </Build>
          <Build at={lf("outro", 0.6)}>
            <div style={{ position: "absolute", left: PAD, top: 380, width: 1100 }}>
              <div style={{ fontFamily: FONT.mono, fontSize: 28, color: C.ink, lineHeight: 2.1 }}>
                <div>它把邻居从一个固定窗口，换成一张任意的图。</div>
                <div style={{ color: C.coral }}>代价是：图越密，越接近全连接。</div>
                <div>半径二十五的环：{last.edges} 条边，准确率 {last.testAcc.toFixed(4)}，余弦相似度 {last.embedCos.toFixed(4)}。</div>
              </div>
            </div>
          </Build>
          <Build at={lf("outro", 0.67)}>
            <div style={{ position: "absolute", left: PAD, top: 700 }}>
              <Chip color={C.cyan}>真实数据：没东西可学</Chip>
              <Chip color={C.violet} style={{ marginLeft: 18 }}>合成任务：把问题放大</Chip>
              <K style={{ marginLeft: 18 }}>两个实验量的是同一件事</K>
            </div>
          </Build>
        </div>

        <div>
          <Build at={lf("outro", 0.78)}>
            <div style={{ position: "absolute", left: PAD, top: 300 }}>
              <div style={{ fontFamily: FONT.sans, fontSize: FT.h2, color: C.inkDim }}>前九集，位置都是时刻；这一集，位置变成节点。</div>
            </div>
          </Build>
          <Build at={lf("outro", 0.88)}>
            <div style={{ position: "absolute", left: PAD, top: 408, display: "flex", gap: 28 }}>
              <Card label="第 13 集" accent={C.cyan} style={{ width: 860, height: 300 }}>
                <div style={{ fontFamily: FONT.serif, fontSize: FT.h1, color: C.ink }}>归一化三兄弟</div>
                <Body style={{ marginTop: 12 }}>批归一化、层归一化、实例归一化：差别只有一句话——用谁的统计量。</Body>
              </Card>
              <div style={{ width: 860, paddingTop: 20 }}>
                <Formula size={42} style={{ color: C.ink }}>x̂ = (x − μ) / σ</Formula>
                <K style={{ display: "block", marginTop: 16 }}>μ 和 σ 从哪个集合上取，就是三种归一化的全部区别。</K>
              </div>
            </div>
          </Build>
        </div>
      </Pages>
    </Scene>
  );
};