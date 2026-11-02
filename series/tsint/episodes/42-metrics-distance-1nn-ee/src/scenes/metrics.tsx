import React from "react";
import { AbsoluteFill } from "remotion";
import { C, FONT, FT } from "../../design/tokens";
import {
  PAD, M, pagesOf, Pages, Scene, SceneHead, Card, Body, Chip, Stat,
  Row, Formula, Verdict, Confusion, RankPlot, Golden, groupKeys, groupName, fmtF, pct, modelName,
} from "../shared";

const labels = groupKeys.map((k) => groupName[k]);
const gcols = groupKeys.map((k) => (k === "bank" ? C.cyan : k === "semi" ? C.amber : C.violet));

const PRF: React.FC = () => {
  const conf = M.main.ed.confusion;
  const rec = M.main.ed.recall;
  const rows = conf.map((row, i) => {
    const colSum = conf.reduce((a, r) => a + r[i], 0);
    const p = colSum ? conf[i][i] / colSum : 0;
    const r = rec[i];
    const f1 = p + r ? (2 * p * r) / (p + r) : 0;
    return { i, p, r, f1 };
  });
  return (
    <div style={{ width: 820 }}>
      <div style={{ display: "flex", fontFamily: FONT.mono, fontSize: FT.meta, color: C.inkFaint, borderBottom: "1px solid " + C.panelLine, paddingBottom: 8 }}>
        <div style={{ width: 240 }}>类别</div>
        <div style={{ width: 160, textAlign: "right" }}>精度</div>
        <div style={{ width: 160, textAlign: "right" }}>召回</div>
        <div style={{ width: 160, textAlign: "right" }}>F1</div>
      </div>
      {rows.map((r) => (
        <div key={r.i} style={{ display: "flex", alignItems: "baseline", padding: "12px 0", borderBottom: "1px solid " + C.panelLine, fontFamily: FONT.mono, fontSize: FT.body }}>
          <div style={{ width: 240, fontFamily: FONT.sans, color: gcols[r.i] }}>{labels[r.i]}</div>
          <div style={{ width: 160, textAlign: "right", color: C.ink }}>{fmtF(r.p, 4)}</div>
          <div style={{ width: 160, textAlign: "right", color: C.ink }}>{fmtF(r.r, 4)}</div>
          <div style={{ width: 160, textAlign: "right", color: C.ink }}>{fmtF(r.f1, 4)}</div>
        </div>
      ))}
      <div style={{ display: "flex", paddingTop: 12, fontFamily: FONT.mono, fontSize: FT.body }}>
        <div style={{ width: 240, fontFamily: FONT.sans, color: C.inkDim }}>macro 平均</div>
        <div style={{ width: 160, textAlign: "right", color: C.inkFaint }}>{fmtF(M.main.ed.macroP, 4)}</div>
        <div style={{ width: 160, textAlign: "right", color: C.inkFaint }}>{fmtF(M.main.ed.macroR, 4)}</div>
        <div style={{ width: 160, textAlign: "right", color: C.coral }}>{fmtF(M.main.ed.macroF1, 4)}</div>
      </div>
    </div>
  );
};

export const SMetrics: React.FC = () => {
  const at = pagesOf("metrics");
  const ed = M.main.ed;
  return (
    <Scene id="metrics">
      <SceneHead id="metrics" />
      <Pages id="metrics" at={at}>
        {/* 页一：混淆矩阵 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 292, width: 780 }}>
            <div style={{ fontFamily: FONT.serif, fontSize: FT.h1, color: C.ink, lineHeight: 1.24 }}>第一把尺子：混淆矩阵。</div>
            <Body style={{ marginTop: 20, width: 750 }}>
              行是真值，列是预测，对角线是判对的窗。三个行业就是三乘三。准确率是对角线之和除以六十，简单，但下一节会看到它会骗人。
            </Body>
            <div style={{ marginTop: 22 }}>
              <Row name="判对" value={ed.correct + " / 60"} width={740} />
              <Row name="准确率" value={fmtF(ed.acc, 4)} color={C.cyan} width={740} />
              <Row name="macro-F1" value={fmtF(ed.macroF1, 4)} width={740} />
            </div>
          </div>
          <div style={{ position: "absolute", left: 900, top: 296 }}>
            <Confusion matrix={ed.confusion} labels={labels} colors={gcols} cell={104} />
          </div>
        </AbsoluteFill>

        {/* 页二：不平衡陷阱 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 292, width: 820 }}>
            <div style={{ fontFamily: FONT.serif, fontSize: FT.h1, color: C.ink, lineHeight: 1.24 }}>全判成大类，准确率也能很高。</div>
            <Body style={{ marginTop: 20, width: 790 }}>
              五个 A 类、一个 B 类，全判成 A：准确率六分之五，零点八三三三。可 B 类一个都没召回。这个数字看上去漂亮，实际上分类器什么也没学会。
            </Body>
            <div style={{ marginTop: 22 }}>
              <Row name="准确率" value="0.8333" note="按样本计票" color={C.amber} width={780} />
              <Row name="macro-F1" value="0.4546" note="按类别计票" color={C.coral} width={780} />
            </div>
          </div>
          <div style={{ position: "absolute", left: 960, top: 300, width: 860 }}>
            <Confusion matrix={M.worked.imbalanced.confusion} labels={["A", "B"]} colors={[C.cyan, C.coral]} cell={116} title="全判 A · acc 0.8333 / macro-F1 0.4546" />
          </div>
        </AbsoluteFill>

        {/* 页三：逐类指标 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 292, width: 860 }}>
            <div style={{ fontFamily: FONT.serif, fontSize: FT.h1, color: C.ink, lineHeight: 1.24 }}>第二把尺子：逐类精度、召回、F1。</div>
            <Body style={{ marginTop: 20, width: 820 }}>
              精度看「预测成该类的里面有多少是对的」，召回看「该类真值里被找出多少」，F1 是两者的调和平均。宏平均给每个类一张等值选票，小类不再被大类淹没。
            </Body>
          </div>
          <div style={{ position: "absolute", left: 980, top: 300, width: 880 }}>
            <Card label="欧氏 1-NN 的逐类读数" accent={C.cyan} pad={22}>
              <PRF />
            </Card>
          </div>
        </AbsoluteFill>

        {/* 页四：黄金值 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 292, width: 800 }}>
            <Golden value="0.8333" label="黄金值 · macro-F1" note="十个窗，两个行业各错一个：准确率 0.80，macro-F1 0.8333。两个数都不是错，是加权方式不同。" color={C.cyan} />
            <Body style={{ marginTop: 22, width: 760 }}>
              准确率按样本计票，十分之八。宏平均按类别计票：A 类 F1 是 1.0，B 类与 C 类各是 0.75，平均下来 0.8333。同一张混淆矩阵，两把尺子给出两个数。
            </Body>
          </div>
          <div style={{ position: "absolute", left: 900, top: 300, width: 920 }}>
            <Confusion matrix={M.worked.balanced.confusion} labels={["A 类", "B 类", "C 类"]} colors={[C.cyan, C.amber, C.violet]} cell={108} title={"准确率 " + fmtF(M.worked.balanced.acc, 4) + " · macro-F1 " + fmtF(M.worked.balanced.macroF1, 4)} />
          </div>
        </AbsoluteFill>

        {/* 页五：平均秩 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 292, width: 620 }}>
            <div style={{ fontFamily: FONT.serif, fontSize: FT.h1, color: C.ink, lineHeight: 1.24 }}>第三把尺子：排名。</div>
            <Body style={{ marginTop: 20, width: 590 }}>
              二十次平衡抽样，每次每类抽十只，共三十窗。每次给三个分类器排名，平均秩越小越好。集成 1.75，欧氏 1.90，DTW 2.35。
            </Body>
            <div style={{ marginTop: 20 }}>
              <Row name="抽样次数" value={"N = " + M.repeats.n} width={570} />
              <Row name="每次窗数" value="3 × 10 = 30" width={570} />
              <Row name="平均秩" value="EE 1.75 · ED 1.90 · DTW 2.35" width={570} />
            </div>
          </div>
          <div style={{ position: "absolute", left: 700, top: 306 }}>
            <RankPlot width={1140} height={330} />
          </div>
        </AbsoluteFill>

        {/* 页六：CD */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 292, width: 880 }}>
            <Formula size={44} note="k 个分类器，N 次抽样，q 查表" color={C.coral}>
              CD = q · sqrt( k(k+1) / 6N )
            </Formula>
            <div style={{ marginTop: 24 }}>
              <Row name="k" value="3" width={840} />
              <Row name="N" value="20" width={840} />
              <Row name="q(0.05)" value="2.343" width={840} />
              <Row name="CD" value="0.7409" color={C.coral} width={840} />
            </div>
          </div>
          <div style={{ position: "absolute", left: 1020, top: 300, width: 810 }}>
            <Card label="三对秩差，全部小于 CD" accent={C.coral} pad={22}>
              <Row name="EE − ED" value="0.4500" note="不显著" width={730} />
              <Row name="EE − DTW" value="0.6000" note="不显著" width={730} />
              <Row name="ED − DTW" value="0.1500" note="不显著" width={730} />
              <Verdict label="结论：三个分类器没有显著差异" ok={false} />
            </Card>
            <Body style={{ marginTop: 14, width: 780, fontSize: FT.meta }}>
              计划文档里算的 CD 是 1.16，算错了；正确值 0.7409。即使按错误的大数，结论仍然是「不显著」。
            </Body>
          </div>
        </AbsoluteFill>
      </Pages>
    </Scene>
  );
};
