import React from "react";
import { AbsoluteFill } from "remotion";
import { C, FONT, FT } from "../../design/tokens";
import { M, Body, Card, Chip, Formula, KV, PAD, Pages, pagesOf, Row, Scene, SceneHead } from "../shared";
import { CnnArch, MatrixFig } from "../figs";

const RP_HALF: number[][] = [
  [1, 1, 0, 0],
  [1, 1, 1, 0],
  [0, 1, 1, 1],
  [0, 0, 1, 1],
];

export const ProblemScene: React.FC = () => (
  <Scene id="problem">
    <SceneHead id="problem" />
    <Pages id="problem" at={pagesOf("problem")}>
      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 300, width: 620 }}>
          <Body size={FT.h1} color={C.ink} style={{ lineHeight: 1.25 }}>卷积要<br />一张图。</Body>
          <Body style={{ marginTop: 26 }}>
            卷积网络在图像上很强，但它的输入必须是一张二维矩阵。股票窗口是一串数：直接塞进一维卷积，只能用很小的核，感受野小，看不到跨段的结构。
          </Body>
          <div style={{ display: "flex", gap: 12, marginTop: 24 }}>
            <KV k="一维" v={M.data.length + " 点"} color={C.amber} size={FT.h3} />
            <KV k="二维" v={M.data.length + "×" + M.data.length} color={C.cyan} size={FT.h3} />
            <KV k="降到" v={M.enc.side + "×" + M.enc.side} color={C.violet} size={FT.h3} />
          </div>
        </div>
        <div style={{ position: "absolute", left: 760, top: 320, width: 1060 }}>
          <CnnArch width={1040} />
          <div style={{ marginTop: 30 }}>
            <Card label="感受野的账" accent={C.amber}>
              <Row name="一维卷积 5 点" value="一眼看 5 天" note="跨不了月，看不到季度" width={980} />
              <Row name="二维 5×5" value="一眼看 25 格" note="格子是两两夹角，跨段" width={980} color={C.cyan} />
              <Row name="代价" value="重采样 + 池化" note="图变大，信息不变" width={980} />
            </Card>
          </div>
        </div>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 300, width: 600 }}>
          <Body size={FT.h2} color={C.ink} style={{ lineHeight: 1.28 }}>三种摊法，<br />三种偏置。</Body>
          <Body style={{ marginTop: 24 }}>
            GAF 把每个点映射成一个角度，两两夹角取余弦；MTF 先分箱，再看箱与箱的转移；递归图只回答一件事：两个时刻的值够不够近。
          </Body>
          <div style={{ display: "flex", gap: 10, marginTop: 22 }}>
            <Chip color={C.cyan}>GAF</Chip>
            <Chip color={C.violet}>MTF</Chip>
            <Chip color={C.amber}>RP</Chip>
          </div>
        </div>
        <div style={{ position: "absolute", left: 720, top: 300, width: 1100 }}>
          <div style={{ display: "flex", gap: 30, alignItems: "flex-start" }}>
            <div>
              <div style={{ fontFamily: FONT.mono, fontSize: FT.meta, color: C.cyan, marginBottom: 10 }}>GASF</div>
              <MatrixFig matrix={M.enc.gasf} cell={76} gap={6} caption="cos(φi + φj)：对称，看幅值" />
            </div>
            <div>
              <div style={{ fontFamily: FONT.mono, fontSize: FT.meta, color: C.violet, marginBottom: 10 }}>MTF</div>
              <MatrixFig matrix={M.enc.mtf} cell={56} gap={6} caption="P(bj | bi)：行和 1，看转移" />
            </div>
            <div>
              <div style={{ fontFamily: FONT.mono, fontSize: FT.meta, color: C.amber, marginBottom: 10 }}>RP</div>
              <MatrixFig matrix={RP_HALF} cell={56} gap={6} caption="|xi − xj| < ε：看回归" />
            </div>
          </div>
          <div style={{ marginTop: 24, fontFamily: FONT.sans, fontSize: FT.meta, color: C.inkDim }}>
            三张图都能用几行代码写完，也都有明确的数学定义 —— 这是后面能逐项检查的前提。
          </div>
        </div>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 300, width: 640 }}>
          <Body size={FT.h2} color={C.ink} style={{ lineHeight: 1.28 }}>前置归一化<br />不是小事。</Body>
          <Body style={{ marginTop: 24 }}>
            GAF 要求输入落在正负一之间。很多人先做 z-score 再进反余弦，但 z-score 之后超过一半的点在区间外，实现里截断一下防止出 NaN —— 截断不报错，却改了数据。
          </Body>
          <Formula size={44} style={{ marginTop: 22 }} note="先 min-max 到 [-1,1]，再反余弦">φ = arccos(clamp x̃)</Formula>
        </div>
        <div style={{ position: "absolute", left: 780, top: 300, width: 1040 }}>
          <Card label="同一条曲线，两种前置步骤" accent={C.coral}>
            <Row name="min-max → 反解" value="1e-16" note="浮点精度极限" width={960} color={C.cyan} />
            <Row name="z-score → 反解" value="1.7" note="截断砍掉尾巴，误差落在极端值上" width={960} color={C.coral} />
            <Row name="截断的后果" value="极端值丢失" note="行情里最有信息的那几天" width={960} color={C.amber} />
          </Card>
          <div style={{ marginTop: 20, fontFamily: FONT.sans, fontSize: FT.meta, color: C.inkDim }}>
            本集全程用 min-max。这一条写进了实现笔记，也写成了一个检查项。
          </div>
        </div>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 300, width: 620 }}>
          <Body size={FT.h2} color={C.ink} style={{ lineHeight: 1.28 }}>图有了，<br />谁来判？</Body>
          <Body style={{ marginTop: 24 }}>
            一维序列上本来就有四个域：时域看形状，ACF 看自相关，谱域看周期，shapelet 看子段。四个域经常打架，打架时听谁的？COTE 的答案是：按验证集准确率加权。
          </Body>
          <div style={{ display: "flex", gap: 10, marginTop: 22 }}>
            <Chip color={C.cyan}>时域</Chip>
            <Chip color={C.violet}>ACF</Chip>
            <Chip color={C.amber}>谱域</Chip>
            <Chip color={C.coral}>shapelet</Chip>
          </div>
        </div>
        <div style={{ position: "absolute", left: 760, top: 300, width: 1060 }}>
          <Card label="四个域，一个投票器" accent={C.violet}>
            <Row name="域" value="四套特征 → 四个分类器" note="最近质心，各自训练" width={980} />
            <Row name="权重" value="验证集准确率" note="归一之后加起来等于一" width={980} color={C.violet} />
            <Row name="前提" value="至少两个域真的强" note="否则投票救不了" width={980} color={C.coral} />
          </Card>
          <div style={{ marginTop: 26, fontFamily: FONT.sans, fontSize: FT.h3, color: C.ink }}>
            这一集的结果：四个域都很弱，投票器也就没用。
          </div>
        </div>
      </AbsoluteFill>
    </Pages>
  </Scene>
);
