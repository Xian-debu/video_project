import React from "react";
import { AbsoluteFill } from "remotion";
import { C, FT } from "../../design/tokens";
import { M, Body, Card, KV, PAD, Pages, Row, Scene, SceneHead, fmtPct, pagesOf } from "../shared";

export const BoundaryScene: React.FC = () => (
  <Scene id="boundary">
    <SceneHead id="boundary" />
    <Pages id="boundary" at={pagesOf("boundary")}>
      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 290, width: 620 }}>
          <Body size={FT.h2} color={C.ink} style={{ lineHeight: 1.3 }}>五条边界，<br />先划清。</Body>
          <Body style={{ marginTop: 22 }}>
            结果只属于这套切分、这批股票、这个市场阶段。换一段历史、换一批标的，数字会变。方法上最关键的一条：候选太像，误差再准也换不来排序。
          </Body>
        </div>
        <div style={{ position: "absolute", left: 760, top: 288, width: 1080 }}>
          <Card label="边界：结果的适用范围" accent={C.coral}>
            <Row name="样本期" value="1535–2431" note="单段历史，没做多市场阶段对照" width={1000} />
            <Row name="标的池" value="300 只" note="全部来自同一个 A 股快照" width={1000} color={C.violet} />
            <Row name="候选集" value="10 个" note="经典时序模型家族，不含深度学习" width={1000} color={C.cyan} />
            <Row name="评价" value="MAE" note="换损失函数排序会变" width={1000} color={C.amber} />
            <Row name="表征" value="闭式自监督" note="不是原版对比学习，偏差已记录" width={1000} color={C.coral} />
          </Card>
        </div>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 292, width: 660 }}>
          <Body size={FT.h2} color={C.ink} style={{ lineHeight: 1.3 }}>两次负结果，<br />都写进计划。</Body>
          <Body style={{ marginTop: 22 }}>
            计划假设元特征能把命中率推高十个点，实测低了 {Math.abs(M.hits.gain * 100).toFixed(2)} 个点。计划假设六十四维表征不掉队，实测持平略降。两个都没兑现，照实报告。
          </Body>
        </div>
        <div style={{ position: "absolute", left: 800, top: 288, width: 1040 }}>
          <Card label="计划 vs 实测：两条未成立" accent={C.coral}>
            <Row name="元学习增益" value={M.hits.gain.toFixed(4)} note="计划 +0.10；实测相对类均值" width={980} color={C.coral} />
            <Row name="元学习命中" value={fmtPct(M.hits.stats, 2)} note={"类均值 " + fmtPct(M.hits.classMean, 2)} width={980} color={C.cyan} />
            <Row name="表征差" value={M.ts2vec.gap.toFixed(4)} note="计划 |差| < 0.03；实测在带内但没有提升" width={980} color={C.violet} />
            <Row name="表征命中" value={fmtPct(M.hits.ts2vec, 2)} note={"四维特征 " + fmtPct(M.hits.stats, 2)} width={980} color={C.amber} />
          </Card>
        </div>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 292, width: 640 }}>
          <Body size={FT.h2} color={C.ink} style={{ lineHeight: 1.3 }}>为什么准<br />还是没有用。</Body>
          <Body style={{ marginTop: 22 }}>
            相关系数 {M.corr.toFixed(4)}，说明预测的误差排序几乎和真实一致。但冠军与亚军的差距在千分位，而预测误差在百分之几。把十个数放回原尺度，第一名的预测可能比第三名还高。回归做得再好，也不等于排序做得对。
          </Body>
        </div>
        <div style={{ position: "absolute", left: 780, top: 288, width: 1060 }}>
          <Card label="三个不能越过的推论" accent={C.violet}>
            <Row name="不能推论一" value="换任务也这样" note="任务分布可以完全不同；元学习器的迁移有前提" width={1000} color={C.coral} />
            <Row name="不能推论二" value="换模型也这样" note="候选集换成同一家族的近似模型，结果会更差" width={1000} color={C.violet} />
            <Row name="不能推论三" value="选对就一定省钱" note="命中率不做代价加权，错一个可能贵很多" width={1000} color={C.amber} />
            <Row name="能推论" value="排序是独立的难题" note="回归准不等于排序准，两层要分开评估" width={1000} color={C.cyan} />
          </Card>
        </div>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 288, width: 640 }}>
          <Body size={FT.h2} color={C.ink} style={{ lineHeight: 1.3 }}>什么时候<br />值得用。</Body>
          <Body style={{ marginTop: 22 }}>
            候选之间的差距必须大于你估计误差的能力；元特征必须能解释差距从哪来；判据必须和业务对齐。三条有一条不满足，老老实实恒选朴素，或者直接穷举。
          </Body>
        </div>
        <div style={{ position: "absolute", left: 780, top: 286, width: 1060 }}>
          <Card label="适用条件：三条都满足才划算" accent={C.cyan}>
            <Row name="差距" value="> 误差" note="候选间的真实差距要大于预测误差的量级" width={1000} color={C.cyan} />
            <Row name="特征" value="解释力" note="四维元特征得能区分谁更适合这个任务" width={1000} color={C.violet} />
            <Row name="判据" value="对齐业务" note="命中率不够，还要看错选的代价分布" width={1000} color={C.amber} />
            <Row name="反例" value="本集" note="差距 千分位、误差 百分位，所以没赢" width={1000} color={C.coral} />
          </Card>
          <div style={{ marginTop: 18, display: "flex" }}>
            <KV k="平均后悔" v={M.regret.mean.toFixed(4)} color={C.violet} />
            <KV k="最大后悔" v={M.regret.max.toFixed(4)} color={C.coral} />
            <KV k="选错" v={M.regret.wrong + "/300"} color={C.amber} />
          </div>
        </div>
      </AbsoluteFill>
    </Pages>
  </Scene>
);
