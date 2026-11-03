import React from "react";
import { AbsoluteFill } from "remotion";
import { C, FONT, FT } from "../../design/tokens";
import { M, Body, Card, Chip, Foot, Formula, KV, PAD, Pages, Row, Scene, SceneHead, fmt4, pagesOf } from "../shared";
import { Bits, KernelCurve, ParetoChart } from "../figs";

const A = [1, 0, 1, 1, 0, 0, 1, 0, 1, 0];
const B = [0, 1, 1, 0, 0, 1, 0, 1, 0, 1];
const C1 = [1, 1, 1, 0, 0, 1, 1, 1, 1, 0];
const C2 = [1, 1, 0, 0, 0, 1, 1, 0, 1, 0];

export const DefinitionsScene: React.FC = () => (
  <Scene id="definitions">
    <SceneHead id="definitions" />
    <Pages id="definitions" at={pagesOf("definitions")}>
      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 292, width: 620 }}>
          <Body size={FT.h1} color={C.ink} style={{ lineHeight: 1.2 }}>一串零一，<br />一个子集。</Body>
          <Body style={{ marginTop: 24 }}>
            遗传算法的个体就是十位零一串：一位对应一个候选，一表示选中，零表示不选。种群二十个，跑十代；每代保留最好的，其余交叉、变异。
          </Body>
          <div style={{ marginTop: 22, fontFamily: FONT.mono, fontSize: FT.meta, color: C.inkFaint, lineHeight: 1.9 }}>
            交叉：两个父代换一段。<br />
            变异：按概率翻一位。<br />
            修复：至少留两个模型。
          </div>
        </div>
        <div style={{ position: "absolute", left: 780, top: 286, width: 1060 }}>
          <Card label="一个个体，十位" accent={C.cyan}>
            <Bits label="父代 A" bits={A} color={C.cyan} note="选中 1、3、4、7、9" />
            <Bits label="父代 B" bits={B} color={C.violet} note="选中 2、3、6、8、10" />
            <Bits label="交叉" bits={C1} color={C.amber} note="换后四位" />
            <Bits label="变异" bits={C2} color={C.coral} note="按概率翻位，仍合法" />
          </Card>
          <div style={{ marginTop: 18, display: "flex", gap: 24 }}>
            <KV k="种群" v={M.ga.pop} color={C.cyan} />
            <KV k="代数" v={M.ga.gens} color={C.violet} />
            <KV k="至少" v={M.ga.minModels + " 个"} color={C.amber} />
            <KV k="seed" v={M.ga.seed} color={C.inkFaint} />
          </div>
        </div>
        <Foot>一表示选中，零表示不选。</Foot>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 292, width: 620 }}>
          <Body size={FT.h2} color={C.ink} style={{ lineHeight: 1.3 }}>适应度，<br />是两个数。</Body>
          <Formula size={40} note="集成残差绝对值的平均" style={{ marginTop: 24 }}>bias = mean |r̄|</Formula>
          <Formula size={36} color={C.violet} note="中心化后的均方，不是均方本身" style={{ marginTop: 20 }}>variance = mean (r̄ − mean r̄)²</Formula>
          <Body style={{ marginTop: 20 }}>
            均方约等于偏差的平方，两项会共线，双目标退化成单目标；中心化之后，两项才真的冲突。
          </Body>
        </div>
        <div style={{ position: "absolute", left: 760, top: 286, width: 1080 }}>
          <Card label="两个目标，两组读数" accent={C.violet}>
            <Row name="双目标 偏差" value={fmt4(M.ga.pBiasMean)} note="集成残差的平均大小" width={1020} color={C.cyan} />
            <Row name="双目标 方差" value={fmt4(M.ga.pVarMean)} note="中心化后残差的离散度" width={1020} color={C.violet} />
            <Row name="只看精度 偏差" value={fmt4(M.ga.bBiasMean)} note="略低一点，代价在方差" width={1020} color={C.inkDim} />
            <Row name="只看精度 方差" value={fmt4(M.ga.bVarMean)} note="比双目标高，成员更同质" width={1020} color={C.coral} />
          </Card>
          <div style={{ marginTop: 18, display: "flex", gap: 10 }}>
            <Chip color={C.cyan}>偏差略低</Chip>
            <Chip color={C.coral}>方差更高</Chip>
            <Chip color={C.violet}>13/20 选出不同子集</Chip>
          </div>
        </div>
        <Foot>两项都按「越小越好」写。</Foot>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 292, width: 600 }}>
          <Body size={FT.h2} color={C.ink} style={{ lineHeight: 1.3 }}>都不差，<br />才算支配。</Body>
          <Body style={{ marginTop: 24 }}>
            一个解支配另一个，当且仅当两项都不比对方差，且至少一项更好。不被任何解支配的，组成 Pareto 前沿。四个点里，三个在前沿上，第四个被第一个支配。
          </Body>
          <div style={{ display: "flex", marginTop: 24 }}>
            <KV k="前沿" v="3 点" color={C.cyan} />
            <KV k="被支配" v="1 点" color={C.coral} />
          </div>
          <div style={{ marginTop: 18, fontFamily: FONT.mono, fontSize: FT.meta, color: C.inkFaint }}>
            前沿上的点互不支配，选哪个要看偏好。
          </div>
        </div>
        <div style={{ position: "absolute", left: 720, top: 286, width: 1120 }}>
          <Card label="四个点，一条支配关系" accent={C.cyan}>
            <ParetoChart width={1040} height={400} />
          </Card>
          <div style={{ marginTop: 12, fontFamily: FONT.sans, fontSize: FT.meta, color: C.inkFaint }}>
            第四个点 (1.1, 0.1) 在第一个点 (1.0, 0.1) 右边：两项都不更好，偏差还更大。
          </div>
        </div>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 292, width: 560 }}>
          <Body size={FT.h2} color={C.ink} style={{ lineHeight: 1.3 }}>核岭回归，<br />解一个方程组。</Body>
          <Formula size={38} note="K 是核矩阵，λ 是正则项" style={{ marginTop: 22 }}>α = (K + λI)⁻¹ y</Formula>
          <Formula size={38} color={C.cyan} note="预测是核向量与系数的内积" style={{ marginTop: 18 }}>f̂(x) = k(x)ᵀ α</Formula>
          <Body style={{ marginTop: 20 }}>
            核函数用高斯核，两点越近，核值越接近一；越远越接近零。核宽取训练点距离的中位数。
          </Body>
        </div>
        <div style={{ position: "absolute", left: 760, top: 286, width: 1080 }}>
          <Card label="高斯核：距离越远，影响越小" accent={C.cyan}>
            <div style={{ display: "flex", alignItems: "flex-start" }}>
              <KernelCurve width={540} height={270} />
              <div style={{ marginLeft: 26, paddingTop: 8 }}>
                <KV k="核宽 ℓ" v="距离中位数" color={C.cyan} />
                <KV k="正则 λ" v={M.krr.lambdas.join(" / ")} color={C.violet} />
                <div style={{ marginTop: 24, fontFamily: FONT.sans, fontSize: FT.meta, color: C.inkFaint, lineHeight: 1.8, width: 300 }}>
                  λ 大，系数被压小，预测收缩；λ 小，矩阵接近插值，训练点穿过。
                </div>
              </div>
            </div>
          </Card>
          <div style={{ marginTop: 16, fontFamily: FONT.mono, fontSize: FT.meta, color: C.inkFaint }}>
            k(x,x') = exp(−‖x − x'‖² / 2ℓ²)
          </div>
        </div>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 292, width: 600 }}>
          <Body size={FT.h2} color={C.ink} style={{ lineHeight: 1.3 }}>黄金值，<br />两个点。</Body>
          <div style={{ fontFamily: FONT.mono, fontSize: FT.num, color: C.amber, marginTop: 20, letterSpacing: -1 }}>0.875</div>
          <Body style={{ marginTop: 20 }}>
            核矩阵对角一、非对角零点五，标签一和二，lambda 取零点五。解出两个系数，再乘第一个点的核向量，就得到黄金值。
          </Body>
          <div style={{ display: "flex", marginTop: 22 }}>
            <KV k="λ" v="0.5" color={C.cyan} />
            <KV k="α" v="0.25 / 1.25" color={C.violet} />
          </div>
        </div>
        <div style={{ position: "absolute", left: 740, top: 286, width: 1100 }}>
          <Card label="一步一步，算出 0.875" accent={C.amber}>
            <Row name="核矩阵 K" value="[[1, .5], [.5, 1]]" note="对角是自相似" width={1040} color={C.cyan} valueW={520} />
            <Row name="正则 λ" value="0.5" note="加在对角线上" width={1040} color={C.violet} />
            <Row name="标签 y" value="[1, 2]" note="两个训练点" width={1040} color={C.inkDim} />
            <Row name="系数 α" value="[0.25, 1.25]" note="(K + λI)⁻¹ y" width={1040} color={C.cyan} />
            <Row name="核向量 k(x₁)" value="[1, 0.5]" note="与两个训练点的核值" width={1040} color={C.inkDim} />
            <Row name="预测" value="0.8750" note="0.25 × 1 + 1.25 × 0.5" width={1040} color={C.amber} />
          </Card>
        </div>
        <Foot>先看黄金值。</Foot>
      </AbsoluteFill>
    </Pages>
  </Scene>
);
