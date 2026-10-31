import React from "react";
import { Build } from "../../design/primitives";
import { C, FONT, FT } from "../../design/tokens";
import { Body, Card, Chip, K, LinePlot, M, Matrix, PAD, Pages, Row, Scene, SceneHead, Stat, Verdict, fmtE, fmtF, lf } from "../shared";

/* 验证：手算、结构性质、两个实验。 */

export const SVerification: React.FC = () => {
  const m = M;
  const hand = m.struct.hand;
  const real = m.real;
  const syn = m.syn;
  return (
    <Scene id="verification">
      <SceneHead id="verification" />
      <Pages id="verification" at={[0, 0.2, 0.42, 0.52, 0.83]}>
        <div>
          <div style={{ position: "absolute", left: PAD, top: 292, fontFamily: FONT.sans, fontSize: FT.h2, color: C.inkDim }}>
            第一档：三乘三的输入，两乘二的核，一个数一个数地算。
          </div>
          <Build at={lf("verification", 0.04)}>
            <div style={{ position: "absolute", left: PAD, top: 360, display: "flex", gap: 30, alignItems: "flex-start" }}>
              <Matrix rows={hand.x} cell={92} color={C.inkDim} caption="输入 X" showNumbers digits={0} />
              <Matrix rows={hand.w} cell={92} color={C.violet} caption="核 W" showNumbers digits={0} />
              <Matrix rows={hand.cross} cell={92} color={C.cyan} caption="互相关" showNumbers digits={0} />
              <Matrix rows={hand.trueConv} cell={92} color={C.amber} caption="真卷积（转核）" showNumbers digits={0} />
              <div style={{ width: 560, paddingTop: 20 }}>
                <Row name="左上角" value="1×1 + 2×0 + 4×0 + 5×(−1) = −4" width={560} />
                <Row name="四个都一样" value="核的和为零（1 + 0 + 0 − 1）" note="窗口每移一格，四项一起加一，和不变" width={560} />
                <Row name="真卷积" value="四个数全部换号：4 / 4 / 4 / 4" color={C.amber} width={560} />
                <Verdict ok label="测试钉住这四个数" />
              </div>
            </div>
          </Build>
        </div>

        <div>
          <div style={{ position: "absolute", left: PAD, top: 292, fontFamily: FONT.sans, fontSize: FT.h2, color: C.inkDim }}>
            第二档：结构性质，不看数据，只看矩阵。
          </div>
          <Build at={lf("verification", 0.23)}>
            <div style={{ position: "absolute", left: PAD, top: 366, display: "flex", gap: 30, alignItems: "flex-start" }}>
              <Matrix rows={m.struct.complete.p} cell={110} color={C.cyan} caption="完全图的传播子" digits={4} />
              <div style={{ width: 980 }}>
                <Row name="每个元素" value="三分之一" note="三条边加自环，度都是三，归一化后每个位置都是 1/3" width={980} />
                <Row name="三行完全相同" value="逐位相同" note="任何向量乘上去，结果三行一模一样" width={980} />
                <Row name="元素偏差" value={fmtE(m.struct.completeGraphDev)} note="双精度舍入的量级" color={C.cyan} width={980} />
              </div>
            </div>
          </Build>
          <Build at={lf("verification", 0.31)}>
            <div style={{ position: "absolute", left: PAD, top: 660, display: "flex", gap: 24 }}>
              <Stat label="谱上界 · 一百个随机方向" accent={C.violet} value={fmtF(m.struct.spectralRatio, 3)} sub="最大比值，小于一 = 不放大信号" valueColor={C.violet} valueSize={54} style={{ width: 640, height: 200 }} />
              <Stat label="行和最大偏差" accent={C.coral} value={fmtE(m.struct.rowSumDev)} sub="对称归一化 ≠ 行归一化：每一行加起来不是一" valueColor={C.coral} valueSize={54} style={{ width: 700, height: 200 }} />
            </div>
          </Build>
        </div>

        <div>
          <div style={{ position: "absolute", left: PAD, top: 292, fontFamily: FONT.sans, fontSize: FT.h2, color: C.inkDim }}>
            第三档：梯度，用中心差分对照解析解。
          </div>
          <Build at={lf("verification", 0.45)}>
            <div style={{ position: "absolute", left: PAD, top: 380, width: 1200 }}>
              <Row name="卷积" value={fmtE(m.struct.convGradRel)} note="阈值 1e−6，相对误差" width={1200} />
              <Row name="图网络" value={fmtE(m.struct.gcnGradRel)} note="阈值 1e−5：反向有四层，舍入误差大一个量级" width={1200} />
              <Row name="结论" value="两个都在阈值以内" note="梯度检查比损失曲线更早发现方向错误" color={C.cyan} width={1200} />
            </div>
          </Build>
          <Build at={lf("verification", 0.49)}>
            <div style={{ position: "absolute", left: PAD, top: 700 }}>
              <Chip color={C.cyan}>阈值按网络大小分档</Chip>
              <Chip color={C.violet} style={{ marginLeft: 18 }}>小网络能到 1e−9</Chip>
              <Chip color={C.amber} style={{ marginLeft: 18 }}>默认网络只到 1e−5</Chip>
            </div>
          </Build>
        </div>

        <div>
          <div style={{ position: "absolute", left: PAD, top: 286, fontFamily: FONT.sans, fontSize: FT.h2, color: C.inkDim }}>
            第四档：判决表。五十只票，两百七十九个特征日。
          </div>
          <Build at={lf("verification", 0.55)}>
            <div style={{ position: "absolute", left: PAD, top: 350, width: 1120 }}>
              <Row name="对抗基线 · MLP" value={fmtF(real.mlpTestAcc, 4)} note={"测试集，训练 " + real.mlpEpochs + " 轮"} width={1120} />
              {real.gcn.map((g, i) => (
                <Row key={i} name={"图卷积 · 阈值 " + fmtF(g.tau, 1)} value={fmtF(g.testAcc, 4)} note={g.edges + " 条边"} color={i % 2 === 0 ? C.cyan : C.violet} width={1120} />
              ))}
            </div>
          </Build>
          <Build at={lf("verification", 0.65)}>
            <div style={{ position: "absolute", left: 1220, top: 350, width: 560 }}>
              <K>嵌入余弦相似度</K>
              {real.gcn.map((g, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", fontFamily: FONT.mono, fontSize: 24, color: i === 0 ? C.cyan : i === real.gcn.length - 1 ? C.coral : C.inkDim, padding: "8px 0", borderBottom: "1px solid " + C.panelLine }}>
                  <span>{"τ " + fmtF(g.tau, 1)}</span>
                  <span>{fmtF(g.cos, 4)}</span>
                </div>
              ))}
              <Body size={FT.meta} style={{ marginTop: 12 }}>阈值越低图越密，节点越像。</Body>
            </div>
          </Build>
          <Build at={lf("verification", 0.73)}>
            <div style={{ position: "absolute", left: PAD, top: 760, width: 1776, background: C.panel, border: "1px solid " + C.panelLine, borderLeft: "3px solid " + C.coral, borderRadius: 12, padding: "16px 22px" }}>
              <div style={{ fontFamily: FONT.sans, fontSize: FT.h2, color: C.ink }}>图越密，准确率越低：五个模型全在零点五附近，多出来的边只让节点更像。</div>
            </div>
          </Build>
        </div>

        <div>
          <div style={{ position: "absolute", left: PAD, top: 286, fontFamily: FONT.sans, fontSize: FT.h2, color: C.inkDim }}>
            合成任务更清楚：每个节点的答案只在自己身上。
          </div>
          <Build at={lf("verification", 0.86)}>
            <div style={{ position: "absolute", left: PAD, top: 356, width: 1000 }}>
              <LinePlot width={1000} height={330} at={lf("verification", 0.88)} title="测试准确率 · 环半径" series={[{ values: syn.sweep.map((s) => s.testAcc), color: C.cyan, name: "图卷积" }]} yFmt={(v) => fmtF(v, 2)} hlines={[{ v: syn.mlpTestAcc, color: C.amber, label: "MLP 基线" }]} padL={70} padB={48} />
              <div style={{ fontFamily: FONT.mono, fontSize: 20, color: C.inkFaint, marginTop: 6 }}>横轴：环半径 1 → 25，共八个取值</div>
            </div>
          </Build>
          <Build at={lf("verification", 0.92)}>
            <div style={{ position: "absolute", left: 1100, top: 356, width: 680 }}>
              <Row name="半径一" value={fmtF(syn.sweep[0].testAcc, 4)} note={syn.sweep[0].edges + " 条边，邻居还不多"} color={C.cyan} width={680} />
              <Row name="半径二十五" value={fmtF(syn.sweep[syn.sweep.length - 1].testAcc, 4)} note={"余弦相似度 " + fmtF(syn.sweep[syn.sweep.length - 1].embedCos, 4)} color={C.coral} width={680} />
              <Row name="对抗基线" value={fmtF(syn.mlpTestAcc, 4)} note="同一个任务，只用节点自己的特征" color={C.amber} width={680} />
              <Body size={FT.meta} style={{ marginTop: 14 }}>邻居的信息全是噪声：平均进来只有坏处，环越大掺得越多。</Body>
            </div>
          </Build>
        </div>
      </Pages>
    </Scene>
  );
};