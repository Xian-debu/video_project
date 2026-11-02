import React from "react";
import { AbsoluteFill } from "remotion";
import { C, FONT, FT } from "../../design/tokens";
import { M, Body, Card, Chip, KV, PAD, Pages, Row, Scene, SceneHead, fmtInt, fmtPct, pagesOf } from "../shared";
import { Pipe, PoolChips, SplitBar } from "../figs";

export const OpenScene: React.FC = () => (
  <Scene id="open">
    <SceneHead id="open" />
    <Pages id="open" at={pagesOf("open")}>
      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 300, width: 660 }}>
          <Body size={FT.h1} color={C.ink} style={{ lineHeight: 1.22 }}>机器<br />怎么挑模型。</Body>
          <Body style={{ marginTop: 26 }}>
            前面几集都在调一个具体的模型。这一集换问题：手上十个候选，凭什么挑一个交出去。指标、池子、搜索策略，三件事各量一次。
          </Body>
          <div style={{ display: "flex", marginTop: 26 }}>
            <KV k="候选" v={M.data.candidates} color={C.cyan} />
            <KV k="股票" v={M.data.stocks} color={C.violet} />
            <KV k="检查" v={M.checks.length} color={C.amber} />
          </div>
        </div>
        <div style={{ position: "absolute", left: 780, top: 286, width: 1060 }}>
          <Card label="一条选择链：空间 · 判据 · 搜索" accent={C.cyan}>
            <Pipe width={1010} />
          </Card>
          <div style={{ marginTop: 24 }}>
            <Card label="十个候选，三个池子">
              <PoolChips width={1010} />
            </Card>
          </div>
        </div>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 300, width: 620 }}>
          <Body size={FT.h2} color={C.ink} style={{ lineHeight: 1.3 }}>这一集有<br />三个坏消息。</Body>
          <Body style={{ marginTop: 24 }}>
            第一，指标会换冠军：同一只股票，MAE 和 MSE 选出来的最优候选，二十只里有一半不同。第二，池子会设上限：候选不在池子里，再好的策略也挑不出来。第三，搜索要花算力：十个候选乘二十只，就是两百次拟合。
          </Body>
          <div style={{ display: "flex", gap: 10, marginTop: 22 }}>
            <Chip color={C.cyan}>指标</Chip>
            <Chip color={C.violet}>池子</Chip>
            <Chip color={C.amber}>策略</Chip>
          </div>
        </div>
        <div style={{ position: "absolute", left: 740, top: 296, width: 1090 }}>
          <Card label="数据：二十只股票，三段切分" accent={C.violet}>
            <SplitBar width={1030} />
            <div style={{ display: "flex", gap: 18, marginTop: 20 }}>
              <KV k="根数" v={M.data.bars[0] + "–" + M.data.bars[1]} color={C.cyan} size={FT.lead} />
              <KV k="验证" v={M.data.split.valid[0] + " 点"} color={C.violet} size={FT.lead} />
              <KV k="测试" v={M.data.split.test[0] + " 点"} color={C.amber} size={FT.lead} />
              <KV k="切点" v={M.data.cut.trainEnd} color={C.inkFaint} size={FT.lead} />
            </div>
          </Card>
          <div style={{ marginTop: 24, fontFamily: FONT.sans, fontSize: FT.body, color: C.inkDim, width: 1030 }}>
            真值 = 全池十个候选都在测试集上打分，误差最小的那个。真实决策时看不到测试集，所以这只是一个事后标准。
          </div>
        </div>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 300, width: 660 }}>
          <Body size={FT.h2} color={C.ink} style={{ lineHeight: 1.3 }}>一句话版本<br />先放这里。</Body>
          <Body style={{ marginTop: 24 }}>
            池子决定天花板，策略决定你能摸到多近，指标决定冠军是谁。计划里我以为池子最重要；数据说池子抬了上限，却没抬命中率。
          </Body>
          <div style={{ marginTop: 22, fontFamily: FONT.mono, fontSize: FT.meta, color: C.inkFaint }}>
            这一集 26 项检查，{M.seconds.toFixed(1)} 秒跑完
          </div>
        </div>
        <div style={{ position: "absolute", left: 780, top: 300, width: 1050 }}>
          <Card label="三个结论，三个数字" accent={C.amber}>
            <Row name="指标会换冠军" value={M.flips + " / " + M.data.stocks} note="MAE 与 MSE 选出不同候选" width={990} color={C.cyan} />
            <Row name="池子覆盖率" value={fmtPct(M.coverage.pool3, 0) + " → " + fmtPct(M.coverage.pool5, 0)} note="池 3 → 池 5，全池 100%" width={990} color={C.violet} />
            <Row name="预筛省算力" value={fmtPct(M.prefilter.saved, 1)} note={fmtInt(M.prefilter.evalsFull) + " → " + fmtInt(M.prefilter.evalsPre) + " 次评测"} width={990} color={C.amber} />
            <Row name="命中率" value={fmtPct(M.hit.pool3, 0) + " = " + fmtPct(M.hit.pool5, 0)} note="扩池没抬命中，这是这集的负结果" width={990} color={C.coral} />
          </Card>
        </div>
      </AbsoluteFill>
    </Pages>
  </Scene>
);
