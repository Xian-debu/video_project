import React from "react";
import { AbsoluteFill } from "remotion";
import { C, FONT, FT } from "../../design/tokens";
import { M, Body, Card, Chip, Foot, KV, PAD, Pages, Row, Scene, SceneHead, fmt4, pagesOf } from "../shared";
import { SplitBar, SubsetGrid } from "../figs";

const subsets = M.data.subsets;
const predictions = subsets * M.data.tune;

export const ProblemScene: React.FC = () => (
  <Scene id="problem">
    <SceneHead id="problem" />
    <Pages id="problem" at={pagesOf("problem")}>
      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 292, width: 660 }}>
          <Body size={FT.h1} color={C.ink} style={{ lineHeight: 1.2 }}>一笔账：<br />三十七万次预测。</Body>
          <Body style={{ marginTop: 24 }}>
            十个候选，每个要么选要么不选，二的十次方就是一千零二十四个子集。每评一个子集，要在三百六十五个点上算误差；全评一遍，三十七万次预测。
          </Body>
          <div style={{ display: "flex", marginTop: 26 }}>
            <KV k="子集" v={subsets.toLocaleString("en-US")} color={C.cyan} />
            <KV k="调参点" v={M.data.tune} color={C.violet} />
            <KV k="预测" v={predictions.toLocaleString("en-US")} color={C.coral} />
          </div>
        </div>
        <div style={{ position: "absolute", left: 800, top: 286, width: 960 }}>
          <Card label="一千零二十四个子集，评了 200 个" accent={C.cyan}>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <SubsetGrid cell={11} />
            </div>
          </Card>
          <div style={{ marginTop: 14, fontFamily: FONT.sans, fontSize: FT.meta, color: C.inkFaint }}>
            候选上百时，二的百次方是天文数字。穷举，第一天就该放弃。
          </div>
        </div>
        <Foot>一千零二十四乘三百六十五。</Foot>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 292, width: 640 }}>
          <Body size={FT.h2} color={C.ink} style={{ lineHeight: 1.3 }}>少五倍，<br />但不是白少。</Body>
          <Body style={{ marginTop: 24 }}>
            遗传算法只评二百个个体：二十个体，十代。比穷举少五倍。每一代都重新算适应度，而适应度不是精度一个数，是两个数。
          </Body>
          <div style={{ marginTop: 24 }}>
            <Chip color={C.cyan}>偏差</Chip>
            <Chip color={C.violet} style={{ marginLeft: 10 }}>方差</Chip>
            <Chip color={C.amber} style={{ marginLeft: 10 }}>两个都要小</Chip>
          </div>
        </div>
        <div style={{ position: "absolute", left: 720, top: 286, width: 1120 }}>
          <Card label="一套预算，两种评法" accent={C.violet}>
            <Row name="穷举" value="1,024" note="每个子集都要在 365 个点上算一遍" width={1060} color={C.coral} />
            <Row name="遗传算法" value={M.ga.evaluations} note="二十个体 × 十代，每代评二十个" width={1060} color={C.cyan} />
            <Row name="种群" value={M.ga.pop} note="一代保留二十个个体" width={1060} />
            <Row name="代数" value={M.ga.gens} note="十代之后选一个子集" width={1060} />
            <Row name="锦标赛" value={M.ga.tournament} note="抽三个比适应度，赢的进下一代" width={1060} />
            <Row name="变异率" value={fmt4(M.ga.mutation, 2)} note="每一位翻面的概率" width={1060} color={C.amber} />
          </Card>
        </div>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 292, width: 660 }}>
          <Body size={FT.h2} color={C.ink} style={{ lineHeight: 1.3 }}>只看精度，<br />会选出十个一样的。</Body>
          <Body style={{ marginTop: 24 }}>
            精度的最优解常常是一组高度同质的模型：它们错在同一处，平均之后误差还是那一处。方差管的就是这件事——成员残差越分散，集成越稳。
          </Body>
          <div style={{ marginTop: 20, fontFamily: FONT.mono, fontSize: FT.meta, color: C.inkFaint, lineHeight: 1.9 }}>
            偏差 bias = mean |集成残差|<br />
            方差 variance = 中心化后的离散度
          </div>
        </div>
        <div style={{ position: "absolute", left: 780, top: 286, width: 1060 }}>
          <Card label="两个目标，什么时候有取舍" accent={C.amber}>
            <Row name="只看精度" value="同质" note="成员错在同一处，平均救不回来" width={1000} color={C.coral} />
            <Row name="看过方差" value="分散" note="成员残差越不相关，集成越稳" width={1000} color={C.cyan} />
            <Row name="方向一致" value="没取舍" note="两个目标一起变好时，随便挑" width={1000} color={C.inkDim} />
            <Row name="方向冲突" value="有前沿" note="互不支配的点组成 Pareto 前沿" width={1000} color={C.violet} />
          </Card>
          <div style={{ marginTop: 18, fontFamily: FONT.sans, fontSize: FT.meta, color: C.inkFaint }}>
            这一集两个目标都按「越小越好」写：偏差是误差大小，方差是误差的稳定性。
          </div>
        </div>
        <Foot>方差管的是「错在一起」。</Foot>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 292, width: 620 }}>
          <Body size={FT.h2} color={C.ink} style={{ lineHeight: 1.3 }}>筛完，<br />怎么加权？</Body>
          <Body style={{ marginTop: 24 }}>
            等权最省事，但它假设每个成员同样可信。学权重需要样本：每个候选在调参段有三百六十五个预测，十个候选拼起来，就是十列特征、三百六十五行。
          </Body>
          <Body style={{ marginTop: 16 }}>
            核岭回归用核函数代替线性权重。样本少、特征多时，核方法比直接拟合线性权更稳；代价是三次方复杂度。
          </Body>
        </div>
        <div style={{ position: "absolute", left: 740, top: 286, width: 1100 }}>
          <Card label="十列特征，三百六十五行" accent={C.cyan}>
            <Row name="每候选" value="365" note="调参段的预测向量" width={1040} color={C.cyan} />
            <Row name="特征矩阵" value="365 × 10" note="十列，每列一个候选" width={1040} color={C.violet} />
            <Row name="核矩阵" value="365 × 365" note="每对样本一个核值" width={1040} color={C.amber} />
            <Row name="解方程" value="4.86e7" note="365 的三次方，Cholesky 分解" width={1040} color={C.coral} />
          </Card>
          <div style={{ marginTop: 20, padding: "14px 18px", border: "1px solid " + C.panelLine, borderRadius: 10, width: 1040, boxSizing: "border-box" }}>
            <div style={{ fontFamily: FONT.mono, fontSize: FT.meta, color: C.inkFaint }}>
              f̂(x) = k(x)ᵀ (K + λI)⁻¹ y　　k(x,x') = exp(−‖x−x'‖² / 2ℓ²)
            </div>
          </div>
        </div>
        <Foot>样本少，特征多，核方法更稳。</Foot>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 292, width: 620 }}>
          <Body size={FT.h2} color={C.ink} style={{ lineHeight: 1.3 }}>还有一个陷阱：<br />在同一段上筛、又调。</Body>
          <Body style={{ marginTop: 24 }}>
            会挑出恰好在这段上好的模型；检验段一换，收益就没了。所以切三段：训练拟合候选，调参做筛选与调权，检验只报告、不参与。
          </Body>
          <Body style={{ marginTop: 16 }}>
            这一集的每个读数，都守这条线。
          </Body>
        </div>
        <div style={{ position: "absolute", left: 740, top: 286, width: 1100 }}>
          <Card label="三段切分，从左到右" accent={C.violet}>
            <SplitBar width={1040} />
            <div style={{ marginTop: 22 }}>
              <Row name="训练段" value="70%" note="拟合十个候选的系数" width={1040} color={C.inkDim} />
              <Row name="调参段" value="15%" note="GA 适应度、KR 拟合、CV 选 λ" width={1040} color={C.violet} />
              <Row name="检验段" value="15%" note="只算一次，只报告" width={1040} color={C.cyan} />
            </div>
          </Card>
        </div>
        <Foot>先把定义说清楚。</Foot>
      </AbsoluteFill>
    </Pages>
  </Scene>
);
