import React from "react";
import { Build } from "../../design/primitives";
import { C, FONT, FT } from "../../design/tokens";
import { Body, Card, Chip, Formula, K, M, PAD, Pages, Scene, SceneHead, Stat, fmtE, fmtF, lf } from "../shared";

/* 开场：换一个定义域，四个数。 */

const Metric: React.FC<{ label: string; value: string; note: string; color: string; width: number }> = ({ label, value, note, color, width }) => (
  <Card label={label} accent={color} style={{ width, height: 268 }}>
    <div style={{ fontFamily: FONT.mono, fontSize: 52, color, lineHeight: 1.1, letterSpacing: -1.5, fontVariantNumeric: "tabular-nums" }}>{value}</div>
    <Body size={FT.meta} style={{ marginTop: 14 }}>{note}</Body>
  </Card>
);

export const SOpen: React.FC = () => {
  const m = M;
  return (
    <Scene id="open">
      <SceneHead id="open" />
      <Pages id="open" at={[0, 0.3, 0.5, 0.74]}>
        <div>
          <div style={{ position: "absolute", left: PAD, top: 232, fontFamily: FONT.sans, fontSize: FT.h2, color: C.inkDim }}>
            前面九集，位置都是时刻；这一集，位置是节点。
          </div>
          <Build at={lf("open", 0.04)}>
            <div style={{ position: "absolute", left: PAD, top: 314, display: "flex", gap: 26 }}>
              <Card label="前九集 · 时间域" accent={C.inkFaint} style={{ width: 875, height: 330 }}>
                <div style={{ fontFamily: FONT.serif, fontSize: FT.h1, color: C.ink }}>一条线，一个窗口</div>
                <Body style={{ marginTop: 16 }}>邻居就是前后的几格。位置由距离决定，跟数据内容无关。</Body>
                <K style={{ display: "block", marginTop: 16 }}>卷积 · 式 (2.48) · 第二章 p.31</K>
              </Card>
              <Card label="这一集 · 图域" accent={C.cyan} style={{ width: 875, height: 330 }}>
                <div style={{ fontFamily: FONT.serif, fontSize: FT.h1, color: C.ink }}>一张网，一张矩阵</div>
                <Body style={{ marginTop: 16 }}>邻居由连边决定。谁是谁的邻居，全写在邻接矩阵里。</Body>
                <K style={{ display: "block", marginTop: 16 }}>图卷积 · 式 (2.64) · 第二章 p.34</K>
              </Card>
            </div>
          </Build>
          <Build at={lf("open", 0.13)}>
            <div style={{ position: "absolute", left: PAD, top: 690, width: 1776, background: C.panel, border: "1px solid " + C.panelLine, borderLeft: "3px solid " + C.cyan, borderRadius: 12, padding: "20px 26px" }}>
              <div style={{ fontFamily: FONT.sans, fontSize: FT.h2, color: C.ink }}>同一件事：邻域的加权和。</div>
              <K style={{ display: "block", marginTop: 8 }}>定义域换了，算子没换</K>
            </div>
          </Build>
        </div>

        <div>
          <div style={{ position: "absolute", left: PAD, top: 232, fontFamily: FONT.sans, fontSize: FT.h2, color: C.inkDim }}>
            先看顺序这条线，再看图这张网。
          </div>
          <Build at={lf("open", 0.33)}>
            <div style={{ position: "absolute", left: PAD, top: 314, display: "flex", gap: 26 }}>
              <Card label="一维：核在时间上滑" accent={C.violet} style={{ width: 875, height: 392 }}>
                <Formula size={44} style={{ color: C.ink }}>y_t = Σ_k w_k · x_(t−k)</Formula>
                <Body style={{ marginTop: 16 }}>核只有三个权重，却在每一个位置复用。这就是参数共享。</Body>
                <K style={{ display: "block", marginTop: 14 }}>每个输出的邻居，是它前面固定的几格</K>
              </Card>
              <Card label="图域：邻居由邻接矩阵决定" accent={C.cyan} style={{ width: 875, height: 392 }}>
                <Formula size={44} style={{ color: C.ink }}>y_i = Σ_j P_ij · x_j</Formula>
                <Body style={{ marginTop: 16 }}>每一行给出一个节点怎么取邻居的平均。P 是常数矩阵，不参与训练。</Body>
                <K style={{ display: "block", marginTop: 14 }}>谁是谁的邻居，不再由距离决定</K>
              </Card>
            </div>
          </Build>
          <Build at={lf("open", 0.4)}>
            <div style={{ position: "absolute", left: PAD, top: 742, display: "flex", gap: 22 }}>
              <Chip color={C.cyan}>加自环：把自己也算成邻居</Chip>
              <Chip color={C.violet}>按度归一化：行和不必是一</Chip>
              <Chip color={C.amber}>阈值未给：相关图自己造</Chip>
            </div>
          </Build>
        </div>

        <div>
          <div style={{ position: "absolute", left: PAD, top: 232, fontFamily: FONT.sans, fontSize: FT.h2, color: C.inkDim }}>
            这一集要钉四个数。
          </div>
          <Build at={lf("open", 0.53)}>
            <div style={{ position: "absolute", left: PAD, top: 310, display: "flex", gap: 24 }}>
              <Metric label="手算第一个输出" value="−4" note="三乘三输入、两乘两核，左上角一格" color={C.cyan} width={426} />
              <Metric label="完全图传播子元素" value={fmtF(1 / 3, 4)} note="三行完全相同：一层之后节点一模一样" color={C.violet} width={426} />
              <Metric label="传播子谱上界" value={fmtF(m.struct.spectralRatio, 3)} note="一百个随机方向里的最大比值，小于一" color={C.amber} width={426} />
              <Metric label="行和最大偏差" value={fmtE(m.struct.rowSumDev, 2)} note="对称归一化不等于行归一化" color={C.coral} width={426} />
            </div>
          </Build>
          <Build at={lf("open", 0.62)}>
            <div style={{ position: "absolute", left: PAD, top: 630, display: "flex", gap: 24 }}>
              <Stat label="真实数据" accent={C.cyan} value={m.data.codes + " 只票"} sub={m.data.days + " 个交易日，切出 " + m.data.featureDays + " 个特征日"} valueSize={54} style={{ width: 570, height: 196 }} />
              <Stat label="对抗基线" accent={C.violet} value={fmtF(m.real.mlpTestAcc, 4)} sub="同一份代码，传播子换成单位矩阵" valueColor={C.violet} valueSize={54} style={{ width: 570, height: 196 }} />
              <Stat label="合成任务" accent={C.amber} value={m.syn.nodes + " 节点"} sub={"环的半径从一放到二十五，看信息能传多远"} valueColor={C.amber} valueSize={54} style={{ width: 588, height: 196 }} />
            </div>
          </Build>
        </div>

        <div>
          <div style={{ position: "absolute", left: PAD, top: 232, fontFamily: FONT.sans, fontSize: FT.h2, color: C.inkDim }}>
            书里给了三个式子，其余全是自己定的。
          </div>
          <Build at={lf("open", 0.77)}>
            <div style={{ position: "absolute", left: PAD, top: 306 }}>
              <Formula size={50} style={{ color: C.ink }}>P = D~^(−1/2) · A~ · D~^(−1/2)，  y = tanh(P · X · W)</Formula>
              <K style={{ display: "block", marginTop: 14 }}>式 (2.64) · 第二章 p.34；A~ = A + I，D~ 是 A~ 的行和</K>
            </div>
          </Build>
          <Build at={lf("open", 0.83)}>
            <div style={{ position: "absolute", left: PAD, top: 452, display: "flex", gap: 22 }}>
              <Chip color={C.cyan}>式 2.48 · 二维卷积</Chip>
              <Chip color={C.violet}>式 2.62 · 因果卷积</Chip>
              <Chip color={C.amber}>式 2.64 · 图卷积</Chip>
              <Chip color={C.coral}>步长、补零、阈值：书里没给</Chip>
            </div>
          </Build>
          <Build at={lf("open", 0.88)}>
            <div style={{ position: "absolute", left: PAD, top: 556, width: 1776 }}>
              <Stat label="检查与测试" accent={C.cyan} value={m.meta.checks.total + " 项检查 · " + m.meta.tests.asserts + " 条断言"} sub={"零失败；卷积 " + m.meta.tests.conv + " 条、图卷积 " + m.meta.tests.gcn + " 条；全仓 " + m.meta.tests.suites + " 组套件"} valueColor={C.ink} style={{ height: 200 }} />
            </div>
          </Build>
          <Build at={lf("open", 0.94)}>
            <div style={{ position: "absolute", left: PAD, top: 786, fontFamily: FONT.sans, fontSize: FT.h2, color: C.ink }}>
              先说书里那三个式子的不对劲。
            </div>
          </Build>
        </div>
      </Pages>
    </Scene>
  );
};