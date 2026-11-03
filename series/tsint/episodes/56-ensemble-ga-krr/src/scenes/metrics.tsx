import React from "react";
import { AbsoluteFill } from "remotion";
import { C, FONT, FT } from "../../design/tokens";
import { M, Body, Card, Chip, Foot, Formula, KV, PAD, Pages, Row, Scene, SceneHead, Stat, fmt4, pagesOf } from "../shared";

const gainVsEqual = ((M.fusion.equal - M.fusion.pEq) / M.fusion.equal) * 100;
const lossVsSubset = ((M.fusion.krr - M.fusion.pEq) / M.fusion.pEq) * 100;

export const MetricsScene: React.FC = () => (
  <Scene id="metrics">
    <SceneHead id="metrics" />
    <Pages id="metrics" at={pagesOf("metrics")}>
      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 292, width: 620 }}>
          <Body size={FT.h2} color={C.ink} style={{ lineHeight: 1.3 }}>零点八七五，<br />拆开看。</Body>
          <Body style={{ marginTop: 24 }}>
            核矩阵加 lambda 倍单位阵，解方程得到两个系数：零点二五和一点二五。第一个训练点的核向量是一和零点五，两项相乘再相加。
          </Body>
          <Formula size={34} color={C.amber} style={{ marginTop: 22 }}>0.25 × 1 + 1.25 × 0.5 = 0.875</Formula>
        </div>
        <div style={{ position: "absolute", left: 740, top: 286, width: 1100 }}>
          <Card label="矩阵、系数、核向量、预测" accent={C.amber}>
            <Row name="K + λI" value="[[1.5, 0.5], [0.5, 1.5]]" note="λ = 0.5 加到对角" width={1040} color={C.cyan} valueW={520} />
            <Row name="系数 α" value="[0.25, 1.25]" note="解 2×2 线性方程" width={1040} color={C.violet} />
            <Row name="核向量" value="[1, 0.5]" note="第一个训练点与两个点" width={1040} color={C.inkDim} />
            <Row name="相乘再相加" value="0.25 + 0.625" note="两项内积" width={1040} color={C.inkDim} />
            <Row name="预测" value="0.8750" note="黄金值，一分不差" width={1040} color={C.amber} />
          </Card>
        </div>
        <Foot>零点二五加零点六二五。</Foot>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 292, width: 620 }}>
          <Body size={FT.h2} color={C.ink} style={{ lineHeight: 1.3 }}>两个极限，<br />说明正则项在做什么。</Body>
          <Body style={{ marginTop: 24 }}>
            lambda 等于零，矩阵可逆，预测精确穿过两个训练点；lambda 趋于无穷，系数被压到接近零，预测退化成零。一个极端是记忆，一个极端是遗忘。
          </Body>
          <div style={{ display: "flex", marginTop: 24, gap: 12 }}>
            <Chip color={C.cyan}>λ = 0 记忆</Chip>
            <Chip color={C.coral}>λ → ∞ 遗忘</Chip>
          </div>
        </div>
        <div style={{ position: "absolute", left: 760, top: 286, width: 1080 }}>
          <div style={{ display: "flex", gap: 20 }}>
            <Stat label="λ = 0：训练点插值" value="0.00e0" accent={C.cyan} valueColor={C.cyan} sub="两个训练点上的最大误差" style={{ width: 500 }} />
            <Stat label="λ = 1e6：收缩到零" value="2.21e-6" accent={C.coral} valueColor={C.coral} sub="预测的绝对值，已经等于不修正" style={{ width: 500 }} />
          </div>
          <Card label="同一个方程，两个极端" accent={C.violet} style={{ marginTop: 22 }}>
            <Row name="λ = 0" value="精确插值" note="K 可逆；训练点误差小于 1e-9" width={1000} color={C.cyan} />
            <Row name="λ → ∞" value="收缩" note="α → 0；预测趋近零" width={1000} color={C.coral} />
            <Row name="λ 中间" value="折中" note="既不过拟合，也不全忘" width={1000} color={C.violet} />
          </Card>
        </div>
        <Foot>一个极端是记忆，一个极端是遗忘。</Foot>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 292, width: 620 }}>
          <Body size={FT.h2} color={C.ink} style={{ lineHeight: 1.3 }}>前沿上的点，<br />选哪个？</Body>
          <Body style={{ marginTop: 24 }}>
            前沿上的点互不支配，选哪一个要看偏好。这一集用归一化分数：偏差除以基线偏差，方差除以基线方差，两项相加取最小。基线就是全池等权。
          </Body>
          <Formula size={34} color={C.cyan} style={{ marginTop: 22 }}>s = bias / b_ref + variance / v_ref</Formula>
        </div>
        <div style={{ position: "absolute", left: 740, top: 286, width: 1100 }}>
          <Card label="选点：两项都除以基线，再相加" accent={C.cyan}>
            <Row name="基线偏差" value={fmt4(M.ga.pBiasMean)} note="全池等权在调参段的偏差" width={1040} color={C.inkDim} />
            <Row name="基线方差" value={fmt4(M.ga.pVarMean)} note="同一个基线的方差" width={1040} color={C.inkDim} />
            <Row name="归一化" value="两项相加" note="都越小越好，直接加" width={1040} color={C.violet} />
            <Row name="取最小" value="选一个点" note="分数最低的前沿点" width={1040} color={C.cyan} />
            <Row name="检查" value="在前沿上" note="GA 选出的点确实属于前沿" width={1040} color={C.amber} />
          </Card>
          <div style={{ marginTop: 16, fontFamily: FONT.sans, fontSize: FT.meta, color: C.inkFaint }}>
            加权法只是其中一种偏好；换权重会选到别的点，收益也跟着变。
          </div>
        </div>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 292, width: 600 }}>
          <Body size={FT.h2} color={C.ink} style={{ lineHeight: 1.3 }}>真实数据，<br />五个误差。</Body>
          <Body style={{ marginTop: 24 }}>
            二十只股票，每只十个候选。子集等权最好，核岭回归其次，全池等权再次，全池核回归最差；最好单模型是下界，不是策略——检验段之前，没人知道它是最好。
          </Body>
          <div style={{ display: "flex", marginTop: 24 }}>
            <KV k="最好单模型" v={fmt4(M.fusion.best)} color={C.inkFaint} />
            <KV k="子集等权" v={fmt4(M.fusion.pEq)} color={C.cyan} />
          </div>
        </div>
        <div style={{ position: "absolute", left: 720, top: 286, width: 1120 }}>
          <Card label="六个读数，同一批检验段" accent={C.cyan}>
            <Row name="子集等权" value={fmt4(M.fusion.pEq)} note="GA 选出的子集，等权" width={1060} color={C.cyan} />
            <Row name="核岭回归" value={fmt4(M.fusion.krr)} note="子集等权再加核修正" width={1060} color={C.amber} />
            <Row name="全池等权" value={fmt4(M.fusion.equal)} note="十个候选全用" width={1060} color={C.inkDim} />
            <Row name="全池核回归" value={fmt4(M.fusion.krrAll)} note="十个候选学权重，最差" width={1060} color={C.coral} />
            <Row name="Top-3 平均" value={fmt4(M.fusion.top3)} note="按调参段排名取前三" width={1060} color={C.violet} />
            <Row name="最好单模型" value={fmt4(M.fusion.best)} note="oracle 下界，不能在事前知道" width={1060} color={C.inkFaint} />
          </Card>
        </div>
        <Foot>五个数，排个序。</Foot>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 292, width: 620 }}>
          <Body size={FT.h2} color={C.ink} style={{ lineHeight: 1.3 }}>两个结论，<br />分开写。</Body>
          <Body style={{ marginTop: 24 }}>
            筛选把误差从十点一五六六降到九点五七二一，相对改进百分之五点七五；调权相对全池等权好百分之一点二二，却相对子集等权差了百分之四点八。
          </Body>
          <Body style={{ marginTop: 16 }}>
            一正一负，不能合成一句「融合有效」。
          </Body>
        </div>
        <div style={{ position: "absolute", left: 740, top: 286, width: 1100 }}>
          <Card label="结论：筛选成立，调权没有额外收益" accent={C.coral}>
            <Row name="筛选 gain" value={gainVsEqual.toFixed(2) + "%"} note="子集等权 9.5721 对全池等权 10.1566" width={1040} color={C.cyan} />
            <Row name="调权 gain" value={M.fusion.relImprovePct.toFixed(2) + "%"} note="核岭回归 10.0322 对全池等权" width={1040} color={C.amber} />
            <Row name="调权 vs 子集" value={"+" + lossVsSubset.toFixed(1) + "%"} note="10.0322 对 9.5721：核修正把子集弄差了" width={1040} color={C.coral} />
            <Row name="胜率" value={M.fusion.krrWinsEqual + " / 20"} note="核岭回归胜全池等权的股票数" width={1040} color={C.inkDim} />
            <Row name="检查" value="24 / 24" note="负结果也写成检查" width={1040} color={C.cyan} />
          </Card>
        </div>
        <Foot accent={C.coral}>筛选有效；调权没有额外收益。</Foot>
      </AbsoluteFill>
    </Pages>
  </Scene>
);
