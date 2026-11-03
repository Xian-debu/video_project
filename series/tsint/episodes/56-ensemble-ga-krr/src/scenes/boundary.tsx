import React from "react";
import { AbsoluteFill } from "remotion";
import { C, FONT, FT } from "../../design/tokens";
import { M, Body, Card, Chip, Foot, KV, PAD, Pages, Row, Scene, SceneHead, pagesOf } from "../shared";
import { LambdaDots } from "../figs";

const gainVsEqual = ((M.fusion.equal - M.fusion.pEq) / M.fusion.equal) * 100;
const lossVsSubset = ((M.fusion.krr - M.fusion.pEq) / M.fusion.pEq) * 100;

export const BoundaryScene: React.FC = () => (
  <Scene id="boundary">
    <SceneHead id="boundary" />
    <Pages id="boundary" at={pagesOf("boundary")}>
      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 292, width: 620 }}>
          <Body size={FT.h2} color={C.ink} style={{ lineHeight: 1.3 }}>书里说 2% 到 6%，<br />这一集没有复现。</Body>
          <Body style={{ marginTop: 24 }}>
            相对全池等权，只有一点二二；相对子集等权，是负收益。不是没做对，是场景不一样：书上融合的是同质候选，这里的十个候选本身就很不一样。
          </Body>
          <div style={{ marginTop: 22, fontFamily: FONT.mono, fontSize: FT.meta, color: C.inkFaint, lineHeight: 1.9 }}>
            同质成员，平均就能降方差；<br />
            异质成员，学权重容易过拟合。
          </div>
        </div>
        <div style={{ position: "absolute", left: 760, top: 286, width: 1080 }}>
          <Card label="一个数，三个参照" accent={C.coral}>
            <Row name="书上" value="2–6%" note="融合相对等权平均的改进" width={1020} color={C.inkDim} />
            <Row name="这一集 vs 全池" value={M.fusion.relImprovePct.toFixed(2) + "%"} note="核岭回归 10.0322 对全池等权 10.1566" width={1020} color={C.amber} />
            <Row name="这一集 vs 子集" value={"−" + lossVsSubset.toFixed(1) + "%"} note="核岭回归 10.0322 对子集等权 9.5721" width={1020} color={C.coral} />
            <Row name="筛选本身" value={gainVsEqual.toFixed(2) + "%"} note="子集等权对全池等权，这才是收益来源" width={1020} color={C.cyan} />
          </Card>
          <div style={{ marginTop: 18 }}>
            <Chip color={C.cyan}>筛选 5.75%</Chip>
            <Chip color={C.coral} style={{ marginLeft: 10 }}>调权 −4.8%</Chip>
            <Chip color={C.amber} style={{ marginLeft: 10 }}>书的区间不复现</Chip>
          </div>
        </div>
        <Foot accent={C.coral}>一点二二，不是百分之二到六。</Foot>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 292, width: 620 }}>
          <Body size={FT.h2} color={C.ink} style={{ lineHeight: 1.3 }}>这个规模，<br />能说明机制。</Body>
          <Body style={{ marginTop: 24 }}>
            二十只股票、十个候选、一段十年日线、调参段三百六十五个点。能说明机制成立，不能说明更大池子也成立：候选上百时，遗传算法还稳吗？这一条没有测。
          </Body>
          <Body style={{ marginTop: 16 }}>
            检验段只有一年，换一段行情，读数会变。
          </Body>
        </div>
        <div style={{ position: "absolute", left: 740, top: 286, width: 1100 }}>
          <Card label="规模的边界，逐条写清" accent={C.violet}>
            <Row name="股票" value="20" note="不是全市场；行业与流动性都不分层" width={1040} color={C.cyan} />
            <Row name="候选" value="10" note="五个模型两个档；上百候选未测" width={1040} color={C.violet} />
            <Row name="日线" value="约 10 年" note="均值 2428.6 个交易日" width={1040} color={C.inkDim} />
            <Row name="调参段" value="365" note="5 折 CV 每折只有 292 个点" width={1040} color={C.amber} />
            <Row name="检验段" value="365" note="只有一年，换行情会变" width={1040} color={C.coral} />
          </Card>
        </div>
        <Foot>这些边界，先写清楚。</Foot>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 292, width: 600 }}>
          <Body size={FT.h2} color={C.ink} style={{ lineHeight: 1.3 }}>书里没给的，<br />我们自己定。</Body>
          <Body style={{ marginTop: 24 }}>
            遗传算法的算子、种群大小、变异率，书里都没有；核岭回归的闭式解也没有，引了 Rasmussen 与 Williams，还有 Zhang 的二零二一。
          </Body>
          <Body style={{ marginTop: 16 }}>
            这些选择写进偏差表：不是书里的，是我们的。
          </Body>
        </div>
        <div style={{ position: "absolute", left: 740, top: 286, width: 1100 }}>
          <Card label="书中未给，逐项落到参数" accent={C.amber}>
            <Row name="GA 算子" value="自定" note="锦标赛 3、均匀交叉、翻位变异、修复" width={1040} color={C.cyan} />
            <Row name="种群 / 代数" value="20 / 10" note="seed 20261103，逐代确定" width={1040} color={C.violet} />
            <Row name="变异率" value="0.08" note="每一位翻面的概率" width={1040} color={C.amber} />
            <Row name="核宽" value="距离中位数" note="训练集两两距离，按中位数归一化" width={1040} color={C.cyan} />
            <Row name="闭式解" value="引文" note="Rasmussen & Williams；Zhang 2021" width={1040} color={C.inkDim} />
          </Card>
          <div style={{ marginTop: 18 }}>
            <Chip color={C.coral}>书中未给</Chip>
            <Chip color={C.inkFaint} style={{ marginLeft: 10 }}>偏差表里逐条记</Chip>
          </div>
        </div>
        <Foot>不是书里的，是我们的。</Foot>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 292, width: 620 }}>
          <Body size={FT.h2} color={C.ink} style={{ lineHeight: 1.3 }}>为什么调权<br />没有收益？</Body>
          <Body style={{ marginTop: 24 }}>
            核修正学的是残差；残差在调参段很小，到检验段价格换了区间，核函数往外推，退化成均值。lambda 越大越接近不修正，十八只股票选了最大的 lambda。
          </Body>
          <Body style={{ marginTop: 16 }}>
            这等于说：别改了。数据自己在拒绝这一步。
          </Body>
        </div>
        <div style={{ position: "absolute", left: 760, top: 286, width: 1080 }}>
          <Card label="λ 的选择：18 / 20 选了最大" accent={C.coral}>
            <LambdaDots width={1000} />
          </Card>
          <div style={{ marginTop: 18 }}>
            <Row name="调参段" value="很小" note="核修正看起来有用" width={1000} color={C.cyan} />
            <Row name="检验段" value="换区间" note="外推退化成均值，修正反而添噪" width={1000} color={C.coral} />
          </div>
        </div>
        <Foot accent={C.coral}>数据自己在拒绝这一步。</Foot>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 292, width: 620 }}>
          <Body size={FT.h2} color={C.ink} style={{ lineHeight: 1.3 }}>四个不能推。</Body>
          <Body style={{ marginTop: 24 }}>
            不能推换任务也有效，只测了一种任务、一种切分；不能推更大规模也有效，二十只股票不是全市场；不能推有理论保证，只有实验，没有收敛性证明。
          </Body>
          <Body style={{ marginTop: 16 }}>
            能说的是：机制成立，筛选在调参段有效，调权在这一批数据上没有额外收益。
          </Body>
        </div>
        <div style={{ position: "absolute", left: 740, top: 286, width: 1100 }}>
          <Card label="能说的与不能说的" accent={C.cyan}>
            <Row name="不能说" value="换任务也有效" note="只测了一种任务、一种切分" width={1040} color={C.coral} />
            <Row name="不能说" value="更大规模也有效" note="二十只股票不是全市场" width={1040} color={C.coral} />
            <Row name="不能说" value="有理论保证" note="没有收敛性证明，只有实验" width={1040} color={C.coral} />
            <Row name="能说" value="机制成立" note="24 项检查，逐项复现" width={1040} color={C.cyan} />
            <Row name="能说" value="筛选有效" note="子集等权对全池等权，5.75%" width={1040} color={C.cyan} />
            <Row name="能说" value="调权无额外收益" note="核岭回归没有跑赢子集等权" width={1040} color={C.amber} />
          </Card>
        </div>
        <Foot>机制成立；收益有边界。</Foot>
      </AbsoluteFill>
    </Pages>
  </Scene>
);
