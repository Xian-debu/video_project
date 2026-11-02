import React from "react";
import { AbsoluteFill } from "remotion";
import { C, FONT, FT } from "../../design/tokens";
import { M, Body, Card, Chip, KV, PAD, Pages, Row, Scene, SceneHead, fmt4, fmtPct, pagesOf } from "../shared";

export const OutroScene: React.FC = () => (
  <Scene id="outro">
    <SceneHead id="outro" />
    <Pages id="outro" at={pagesOf("outro")}>
      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 292, width: 640 }}>
          <Body size={FT.h1} color={C.ink} style={{ lineHeight: 1.24 }}>三句话<br />带走。</Body>
          <Body style={{ marginTop: 24 }}>
            第一，省算力的前提是信号比噪声大。第二，遗传算法只在搜不完的空间里划算。第三，学习曲线要先看形状，再看平台期。三句对应三个读数，都能自己复现 —— 复现的方法就是跑证据。
          </Body>
          <div style={{ display: "flex", gap: 10, marginTop: 22 }}>
            <Chip color={C.cyan}>信号</Chip>
            <Chip color={C.coral}>空间</Chip>
            <Chip color={C.violet}>形状</Chip>
          </div>
        </div>
        <div style={{ position: "absolute", left: 800, top: 290, width: 1040 }}>
          <Card label="三句话，三个读数" accent={C.cyan}>
            <Row name="信号比噪声" value={fmt4(M.demo.ratio) + "×"} note="外推误差 ÷ 冠军-亚军差距" width={980} color={C.cyan} />
            <Row name="空间" value="200 : 10 : 648" note="GA 评估 · 穷举 · 七维网格" width={980} color={C.coral} />
            <Row name="平台期" value="843 → 1,686" note="MAE 几乎不动，外推看不见" width={980} color={C.violet} />
            <Row name="省下的数据" value={fmtPct(M.budget.dataRatio, 1)} note="三点部分拟合接触的数据占比" width={980} color={C.amber} />
          </Card>
        </div>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 292, width: 640 }}>
          <Body size={FT.h2} color={C.ink} style={{ lineHeight: 1.3 }}>没有赢家，<br />但账要分开记。</Body>
          <Body style={{ marginTop: 22 }}>
            两把刀都试了，都没省在排序上。但省下来的东西是清楚的：增量侧接触的数据是 87.4%，遗传算法在网格上的评估是 30.9%。只是这两笔省下来的钱，都没换成排序 —— 所以账要分开记，才知道省没省到地方。
          </Body>
          <div style={{ marginTop: 20, fontFamily: FONT.mono, fontSize: FT.meta, color: C.inkFaint }}>
            下一集换一个角度：不再问怎么省算力，问怎么复用经验
          </div>
        </div>
        <div style={{ position: "absolute", left: 800, top: 290, width: 1040 }}>
          <Card label="两笔省下的账，一笔没换到" accent={C.violet}>
            <Row name="数据量" value={fmtPct(M.budget.dataRatio, 1)} note={"部分拟合 " + M.budget.fitsInc + " 次 vs 全量 " + M.budget.fitsFull + " 次"} width={980} color={C.amber} />
            <Row name="评估次数" value={fmtPct(M.budget.gridShare / 100, 1)} note="GA 占七维网格的比例，但小空间用不上" width={980} color={C.cyan} />
            <Row name="排序" value="没换到" note={"Top-1 幂律 " + fmtPct(M.demo.pow.acc1, 0) + "，全量 100%"} width={980} color={C.coral} />
          </Card>
        </div>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 292, width: 680 }}>
          <Body size={FT.h2} color={C.ink} style={{ lineHeight: 1.28 }}>下一集：<br />把股票当成任务。</Body>
          <Body style={{ marginTop: 22 }}>
            三百只股票当成三百个任务，用任务库训一个元学习器，看能不能学出规律：该用统计特征还是表征。时长 {M.meta.next.minutes} 分钟。
          </Body>
          <div style={{ marginTop: 20, fontFamily: FONT.sans, fontSize: FT.meta, color: C.inkDim }}>
            {M.meta.next.title}
          </div>
        </div>
        <div style={{ position: "absolute", left: 820, top: 292, width: 1000 }}>
          <Card label="下一集的问题" accent={C.amber}>
            <Row name="主题" value="把股票当成任务" note="元学习选模型" width={940} color={C.amber} />
            <Row name="问题" value="特征还是表征" note="统计特征 · 任务库表征" width={940} color={C.cyan} />
            <Row name="时长" value={String(M.meta.next.minutes) + " 分钟"} note={"第 " + M.meta.next.id + " 集"} width={940} color={C.violet} />
          </Card>
          <div style={{ marginTop: 24, display: "flex", gap: 26 }}>
            <KV k="本集检查" v={M.checks.length + " 项"} color={C.inkDim} />
            <KV k="用时" v={M.seconds.toFixed(1) + " 秒"} color={C.inkDim} />
          </div>
          <div style={{ marginTop: 22, fontFamily: FONT.sans, fontSize: FT.h2, color: C.ink }}>
            谢谢观看，我们下集再见。
          </div>
        </div>
      </AbsoluteFill>
    </Pages>
  </Scene>
);
