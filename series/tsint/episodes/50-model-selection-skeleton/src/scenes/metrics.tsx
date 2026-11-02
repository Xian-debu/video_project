import React from "react";
import { AbsoluteFill } from "remotion";
import { C, FONT, FT } from "../../design/tokens";
import { M, Bars, Body, Card, Chip, K, PAD, Pages, Row, Scene, SceneHead, fmt4, pagesOf } from "../shared";

const TOP = 292;

export const MetricsScene: React.FC = () => (
  <Scene id="metrics">
    <SceneHead id="metrics" />
    <Pages id="metrics" at={pagesOf("metrics")}>
      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 300, width: 600 }}>
          <Body size={FT.h2} color={C.ink} style={{ lineHeight: 1.3 }}>先钉住实现：<br />五个黄金值。</Body>
          <Body style={{ marginTop: 24 }}>
            同一组真值和预测，五个指标各有一个期望值。实现里有一段固定的测试用例，五个数对不上就报错。指标实现不过关，后面所有排序都不算数。
          </Body>
        </div>
        <div style={{ position: "absolute", left: 720, top: TOP, width: 1120 }}>
          <Card label="黄金用例：y = 1,2,3 · ŷ = 1.5,2,2" accent={C.cyan}>
            <Row name="MAE" value={fmt4(M.metrics.mae)} note="绝对误差 0.5 / 0 / 1，平均 0.5" width={1030} color={C.cyan} />
            <Row name="MSE" value={fmt4(M.metrics.mse)} note="平方 0.25 / 0 / 1，平均 0.4167" width={1030} color={C.violet} />
            <Row name="RMSE" value={fmt4(M.metrics.rmse)} note="√0.4167 = 0.6455，大于 MAE" width={1030} color={C.amber} />
            <Row name="MAPE" value={fmt4(M.metrics.mape) + "%"} note="(0.5 + 0 + 0.3333) / 3 × 100" width={1030} color={C.coral} />
            <Row name="Acc@3" value={fmt4(M.metrics.acc3)} note="预测 {1,3,4} 对真值 {1,2,3}，交集 2" width={1030} color={C.cyan} />
          </Card>
        </div>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 290, width: 520 }}>
          <Body size={FT.h2} color={C.ink} style={{ lineHeight: 1.3 }}>十个候选，<br />误差差得很开。</Body>
          <Body style={{ marginTop: 20 }}>
            验证段和测试段的排序基本一致：朴素模型最低，两个指数平滑最高。岭回归和 AR(1) 挤在中间，差不到零点一。
          </Body>
          <K style={{ display: "block", marginTop: 16 }}>左：验证 MAE · 右：测试 MAE</K>
        </div>
        <div style={{ position: "absolute", left: 620, top: 270, width: 620 }}>
          <Card label="验证段 MAE" accent={C.violet}>
            <Bars width={560} rowH={44} labelW={104}
              items={M.candidates.map((c) => ({ label: c.name, value: c.validMae, text: c.validMae.toFixed(3), color: C.violet }))} />
          </Card>
        </div>
        <div style={{ position: "absolute", left: 1270, top: 270, width: 580 }}>
          <Card label="测试段 MAE" accent={C.amber}>
            <Bars width={520} rowH={44} labelW={104}
              items={M.candidates.map((c) => ({ label: c.name, value: c.testMae, text: c.testMae.toFixed(3), color: C.amber }))} />
          </Card>
        </div>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 300, width: 640 }}>
          <Body size={FT.h2} color={C.ink} style={{ lineHeight: 1.3 }}>一半的股票，<br />换指标就换冠军。</Body>
          <Body style={{ marginTop: 24 }}>
            对每只股票，分别按 MAE 和 MSE 排十个候选，看第一名是否同一个。二十只里有 {M.flips} 只不同。MSE 罚大残差，偏向稳的模型；MAE 罚所有残差，偏向中庸的模型。
          </Body>
          <div style={{ display: "flex", gap: 10, marginTop: 22 }}>
            <Chip color={C.cyan}>MAE 怕偏</Chip>
            <Chip color={C.violet}>MSE 怕爆</Chip>
          </div>
        </div>
        <div style={{ position: "absolute", left: 780, top: 296, width: 1060 }}>
          <Card label="同一个池子，两种指标，两种冠军" accent={C.coral}>
            <div style={{ display: "flex", alignItems: "baseline", gap: 26 }}>
              <div style={{ fontFamily: FONT.mono, fontSize: FT.cover, color: C.coral, lineHeight: 1 }}>{M.flips}</div>
              <div style={{ fontFamily: FONT.mono, fontSize: FT.h1, color: C.inkFaint, lineHeight: 1 }}>/ {M.data.stocks}</div>
              <div style={{ fontFamily: FONT.sans, fontSize: FT.body, color: C.inkDim }}>只股票的 argmin 不同</div>
            </div>
            <div style={{ marginTop: 26 }}>
              <Row name="口径" value="argmin test MAE" note="对比 argmin test MSE" width={1000} color={C.cyan} />
              <Row name="结论" value="指标是假设" note="不是中立的度量工具" width={1000} color={C.violet} />
            </div>
          </Card>
        </div>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 300, width: 600 }}>
          <Body size={FT.h2} color={C.ink} style={{ lineHeight: 1.3 }}>朴素模型赢了<br />十四只。</Body>
          <Body style={{ marginTop: 24 }}>
            一步预测里，昨天的价格就是很强的预测。复杂模型在同一个训练段上没有赚到，原因不是它差，是任务的信息量就这么大。这一条要带着条件说。
          </Body>
        </div>
        <div style={{ position: "absolute", left: 740, top: 296, width: 1100 }}>
          <Card label="真值最优的分布：谁在测试段赢" accent={C.cyan}>
            <Bars width={1040} rowH={52} max={14} labelW={132}
              items={M.candidates.filter((c) => c.wins > 0).map((c) => ({ label: c.name, value: c.wins, text: c.wins + " 只", color: C.cyan }))} />
          </Card>
          <div style={{ marginTop: 20, fontFamily: FONT.sans, fontSize: FT.meta, color: C.inkDim, width: 1040 }}>
            其余六个候选一只都没赢。主指标定了 MAE，所以这里的「最优」和整集口径一致；换成 MSE，分布会变。
          </div>
        </div>
      </AbsoluteFill>
    </Pages>
  </Scene>
);
