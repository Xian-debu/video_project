import React from "react";
import { AbsoluteFill } from "remotion";
import { C, FONT, FT } from "../../design/tokens";
import { M, Body, Card, Chip, K, PAD, Pages, Row, Scene, SceneHead, fmtPct, pagesOf } from "../shared";

export const OutroScene: React.FC = () => (
  <Scene id="outro">
    <SceneHead id="outro" />
    <Pages id="outro" at={pagesOf("outro")}>
      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 300, width: 660 }}>
          <Body size={FT.h1} color={C.ink} style={{ lineHeight: 1.24 }}>三句话<br />带走。</Body>
          <Body style={{ marginTop: 26 }}>
            第一，指标决定冠军是谁，二十只里十只换指标就换冠军。第二，池子决定上限，覆盖从 75% 到 85%，命中率超不过覆盖。第三，搜索可以很便宜，预筛省三成五，命中不变。
          </Body>
          <div style={{ display: "flex", gap: 10, marginTop: 24 }}>
            <Chip color={C.cyan}>指标</Chip>
            <Chip color={C.violet}>池子</Chip>
            <Chip color={C.amber}>策略</Chip>
          </div>
        </div>
        <div style={{ position: "absolute", left: 800, top: 296, width: 1040 }}>
          <Card label="三个结论，三个数字" accent={C.cyan}>
            <Row name="指标" value={M.flips + " / " + M.data.stocks} note="换指标就换冠军的股票数" width={980} color={C.cyan} />
            <Row name="池子" value={fmtPct(M.coverage.pool3, 0) + " → " + fmtPct(M.coverage.pool5, 0)} note="覆盖上限，全池 100%" width={980} color={C.violet} />
            <Row name="策略" value={"省 " + fmtPct(M.prefilter.saved, 1)} note={"评测点 " + M.prefilter.evalsPre.toLocaleString("en-US") + "，命中 " + fmtPct(M.hit.pre, 0)} width={980} color={C.amber} />
            <Row name="命中" value={fmtPct(M.hit.pool3, 0) + " = " + fmtPct(M.hit.pool5, 0)} note="扩池没抬命中，这是负结果" width={980} color={C.coral} />
          </Card>
        </div>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 300, width: 660 }}>
          <Body size={FT.h2} color={C.ink} style={{ lineHeight: 1.3 }}>顺序不能反。</Body>
          <Body style={{ marginTop: 24 }}>
            先把指标写下来，这是假设；再把池子画清楚，这是设计；最后才算搜索策略的成本。反过来的话，会拿策略的复杂度骗自己，以为换了算法就能变好。
          </Body>
        </div>
        <div style={{ position: "absolute", left: 800, top: 296, width: 1040 }}>
          <Card label="三个决定，一个顺序" accent={C.violet}>
            <Row name="一 · 指标" value="写下来" note="假设要可检验" width={980} color={C.cyan} />
            <Row name="二 · 池子" value="画清楚" note="设计要可复现" width={980} color={C.violet} />
            <Row name="三 · 策略" value="算成本" note="工程要算清省了多少" width={980} color={C.amber} />
          </Card>
          <div style={{ marginTop: 20, fontFamily: FONT.mono, fontSize: FT.meta, color: C.inkFaint }}>
            本集证据：{M.checks.length} 项检查，{M.seconds.toFixed(1)} 秒
          </div>
        </div>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 300, width: 700 }}>
          <Body size={FT.h2} color={C.ink} style={{ lineHeight: 1.28 }}>下一集：<br />省算力的两把刀。</Body>
          <Body style={{ marginTop: 24 }}>
            第 51 集讲遗传算法和学习曲线外推。一个在空间里跳着找，一个拿少量点外推；两个都是把拟合次数降下来的办法，也都有各自的坑。
          </Body>
          <div style={{ marginTop: 22, fontFamily: FONT.sans, fontSize: FT.meta, color: C.inkDim }}>
            {M.meta.next.title}
          </div>
        </div>
        <div style={{ position: "absolute", left: 820, top: 300, width: 1000 }}>
          <Card label="下一集的问题" accent={C.amber}>
            <Row name="主题" value="两把省算力的刀" note="遗传算法 · 学习曲线外推" width={940} color={C.amber} />
            <Row name="问法" value="少拟合几次，能不能选对" note="同一套池子和指标" width={940} color={C.cyan} />
            <Row name="时长" value={String(M.meta.next.minutes) + " 分钟"} note={"第 " + M.meta.next.id + " 集"} width={940} color={C.violet} />
          </Card>
          <div style={{ marginTop: 26, fontFamily: FONT.sans, fontSize: FT.h2, color: C.ink }}>
            谢谢观看，我们下集再见。
          </div>
        </div>
      </AbsoluteFill>
    </Pages>
  </Scene>
);
