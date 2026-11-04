import React from "react";
import { AbsoluteFill } from "remotion";
import { C, FONT, FT } from "../../design/tokens";
import { Body, Card, CodeBlock, Foot, KV, M, PAD, Pages, Row, Scene, SceneHead, Stat, fmt4, fmtInt, pagesOf } from "../shared";
import { ParamBudget } from "../figs";

export const OutroScene: React.FC = () => (
  <Scene id="outro">
    <SceneHead id="outro" />
    <Pages id="outro" at={pagesOf("outro")}>
      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 300, width: 620 }}>
          <Body size={FT.h1} color={C.ink} style={{ lineHeight: 1.2 }}>回到开头<br />那张表。</Body>
          <Body style={{ marginTop: 24 }}>
            70,209，1,300，512，零。三笔账都能自己算：线性头是一次解方程，旁路是一对小矩阵，
            锚点是从词表里选词。三个都不改主干，三个都便宜，三个都没换来预测提升。
          </Body>
          <div style={{ display: "flex", marginTop: 26 }}>
            <KV k="主干" v={fmtInt(M.frozen.total)} color={C.inkDim} />
            <KV k="线性头" v={fmtInt(M.probe.params)} color={C.cyan} />
            <KV k="旁路" v={String(M.lora.params)} color={C.violet} />
            <KV k="锚点" v="0" color={C.amber} />
          </div>
        </div>
        <div style={{ position: "absolute", left: 790, top: 286, width: 1030 }}>
          <Card label="参数表 · 再看一眼" accent={C.cyan} style={{ width: 1010 }} pad={22}>
            <ParamBudget width={940} rowH={100} />
          </Card>
        </div>
        <Foot>这一集量到的东西，就是这张表。</Foot>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 300, width: 620 }}>
          <Body size={FT.h1} color={C.ink} style={{ lineHeight: 1.2 }}>最后复盘<br />四个数。</Body>
          <Body style={{ marginTop: 24 }}>
            {fmtInt(M.probe.params)} 个参数，百分之一点八五；{M.lora.params} 个，百分之零点七三；
            零个，也是零；主干 {fmtInt(M.frozen.total)}。三个适配器 {M.code.totalLines} 行，{M.code.tests} 条单测；
            {M.code.checks} 项检查，{M.timing.seconds.toFixed(2)} 秒。
          </Body>
          <div style={{ display: "flex", marginTop: 26 }}>
            <KV k="实现" v={M.code.totalLines + " 行"} color={C.cyan} />
            <KV k="检查" v={M.code.checks + "/" + M.code.checks} color={C.amber} />
            <KV k="耗时" v={M.timing.seconds.toFixed(2) + " s"} color={C.violet} />
          </div>
        </div>
        <div style={{ position: "absolute", left: 790, top: 280, width: 1030 }}>
          <div style={{ display: "flex", gap: 16 }}>
            <Stat label="线性头" value={fmtInt(M.probe.params)} sub="1.85% · 一次闭式解" style={{ width: 236 }} />
            <Stat label="低秩旁路" value={String(M.lora.params)} sub="0.73% · 一对小矩阵" accent={C.violet} valueColor={C.violet} style={{ width: 236 }} />
            <Stat label="语义锚点" value="0" sub="0% · 只挑词" accent={C.amber} valueColor={C.amber} style={{ width: 236 }} />
            <Stat label="主干" value={fmtInt(M.frozen.total)} sub="冻结，不动" accent={C.inkDim} valueColor={C.inkDim} style={{ width: 236 }} />
          </div>
          <div style={{ marginTop: 20 }}>
            <CodeBlock
              width={1000}
              size={FT.code}
              title="复现三条"
              lines={[
                { t: "cabal run tsbase -- evidence-ch07-adapters \\", },
                { t: "  --data data/episodes/64-llm-side-adapters --out out/evidence-64 \\", dim: true },
                { t: "  --evidence inventory/evidence/64-llm-side-adapters.ch7-adapters.json", dim: true },
                { t: "cabal test" },
                { t: "node scripts/make.mjs --film tsint-64-llm-side-adapters" },
              ]}
            />
          </div>
        </div>
        <Foot>屏幕上的每个数都能自己跑出来。</Foot>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 300, width: 620 }}>
          <Body size={FT.h1} color={C.ink} style={{ lineHeight: 1.2 }}>这一章<br />到这里收束。</Body>
          <Body style={{ marginTop: 24 }}>
            从表示讲到适配。一个问题一直没变：冻结的东西，能借来多少。
            答案不是「更多」，是「可以算清楚」——参数能算，误差能算，边界能算。算清楚，才知道值不值。
          </Body>
        </div>
        <div style={{ position: "absolute", left: 790, top: 292, width: 1030 }}>
          <Card label="一章的线索" accent={C.violet} style={{ width: 1010 }} pad={20}>
            <Row name="表示" value="能不能还原" note="画成图、反解、结构保持——第六十三集" width={962} color={C.inkDim} valueW={300} />
            <Row name="适配" value="能借来多少" note="冻结主干，只训练一小块——本集" width={962} color={C.violet} valueW={300} />
            <Row name="答案" value="可以算清楚" note="参数账、误差账、边界，都是可复现的数" width={962} color={C.cyan} valueW={300} />
            <Row name="下一章" value="换一个方向" note="不讲怎么建模，讲怎么评" width={962} color={C.amber} valueW={300} />
          </Card>
        </div>
        <Foot accent={C.violet}>算清楚，才知道值不值。</Foot>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 300, width: 620 }}>
          <Body size={FT.h1} color={C.ink} style={{ lineHeight: 1.2 }}>下一集：<br />误差三件套。</Body>
          <Body style={{ marginTop: 24 }}>
            同一组预测，MSE 涨四倍，MAE 一动不动。三个指标给出三种结论——这是下一集的问题。
            参数账算清了，效果账还欠着。下一集，换一把尺子，再量一次。
          </Body>
          <div style={{ display: "flex", marginTop: 26 }}>
            <KV k="MSE" v="×4" color={C.coral} />
            <KV k="MAE" v="不动" color={C.amber} />
            <KV k="下一章" v="怎么评" color={C.violet} />
          </div>
        </div>
        <div style={{ position: "absolute", left: 790, top: 292, width: 1030 }}>
          <Card label="下一章 · 怎么评" accent={C.coral} style={{ width: 1010 }} pad={20}>
            <Row name="MSE" value="涨四倍" note="平方放大大误差；一个坏点就能改变结论" width={962} color={C.coral} valueW={300} />
            <Row name="MAE" value="不动" note="对离群点不敏感；同一组预测，它看不出差别" width={962} color={C.amber} valueW={300} />
            <Row name="三个指标" value="三种结论" note="选哪个指标，等于先决定了要讲什么故事" width={962} color={C.violet} valueW={300} />
            <Row name="下一集" value="换一把尺子" note="误差三件套：MSE、MAE、以及它们中间的东西" width={962} color={C.cyan} valueW={300} />
          </Card>
        </div>
        <Foot accent={C.coral}>感谢观看本集。</Foot>
      </AbsoluteFill>
    </Pages>
  </Scene>
);
