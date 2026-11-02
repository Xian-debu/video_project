import React from "react";
import { AbsoluteFill } from "remotion";
import { C, FONT, FT } from "../../design/tokens";
import {
  PAD, M, pagesOf, Pages, Scene, SceneHead, Card, Body, Chip, Stat,
  Row, Formula, Verdict, Confusion, RankPlot, groupKeys, groupName, fmtF, modelName, modelColor,
} from "../shared";

const gname = groupKeys.map((k) => groupName[k]);
const gcol = [C.cyan, C.amber, C.violet];

const WeightBars: React.FC = () => {
  const ws = M.main.weights;
  const items: { k: string; label: string; v: number; color: string }[] = [
    { k: "ddtw", label: "导数 DTW", v: ws.ddtw, color: C.cyan },
    { k: "wdtw", label: "加权 DTW", v: ws.wdtw, color: C.violet },
    { k: "dtw", label: "普通 DTW", v: ws.dtw, color: C.amber },
    { k: "lcss", label: "LCSS", v: ws.lcss, color: C.coral },
  ];
  return (
    <div style={{ width: 760 }}>
      {items.map((it) => (
        <div key={it.k} style={{ marginBottom: 18 }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontFamily: FONT.sans, fontSize: FT.body, color: C.inkDim }}>
            <span>{it.label}</span>
            <span style={{ fontFamily: FONT.mono, color: it.color }}>{fmtF(it.v, 4)}</span>
          </div>
          <div style={{ height: 14, background: C.panel, borderRadius: 3, marginTop: 7, overflow: "hidden" }}>
            <div style={{ width: Math.max(1.2, it.v * 100) + "%", height: "100%", background: it.color, opacity: 0.9 }} />
          </div>
        </div>
      ))}
    </div>
  );
};

export const SVerification: React.FC = () => {
  const at = pagesOf("verification");
  const ed = M.main.ed, dtw = M.main.dtw, ee = M.main.ee;
  return (
    <Scene id="verification">
      <SceneHead id="verification" />
      <Pages id="verification" at={at}>
        {/* 页一：三个主读数 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 292, width: 700 }}>
            <div style={{ fontFamily: FONT.serif, fontSize: FT.h1, color: C.ink, lineHeight: 1.24 }}>同数据、同窗口、同一把尺。</div>
            <Body style={{ marginTop: 20, width: 670 }}>
              六十个窗留一。欧氏判对二十五，DTW 也判对二十五，集成二十八。三个分类器唯一的差别就是距离。
            </Body>
            <div style={{ display: "flex", gap: 14, marginTop: 24 }}>
              <Chip color={C.cyan}>ED 25</Chip>
              <Chip color={C.amber}>DTW 25</Chip>
              <Chip color={C.violet}>EE 28</Chip>
            </div>
          </div>
          <div style={{ position: "absolute", left: 800, top: 288, width: 1020 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
              <Stat label="欧氏" value={fmtF(ed.acc, 4)} sub={"macro-F1 " + fmtF(ed.macroF1, 4)} valueColor={C.cyan} valueSize={42} />
              <Stat label="DTW" value={fmtF(dtw.acc, 4)} sub={"macro-F1 " + fmtF(dtw.macroF1, 4)} valueColor={C.amber} valueSize={42} />
              <Stat label="弹性集成" value={fmtF(ee.acc, 4)} sub={"macro-F1 " + fmtF(ee.macroF1, 4)} valueColor={C.violet} valueSize={42} />
            </div>
            <div style={{ marginTop: 20 }}>
              <Row name="欧氏 1-NN" value={ed.correct + " / 60"} note="留一" width={980} />
              <Row name="DTW 1-NN" value={dtw.correct + " / 60"} note="带宽 6" width={980} />
              <Row name="弹性集成" value={ee.correct + " / 60"} note="四距离加权" width={980} />
            </div>
          </div>
        </AbsoluteFill>

        {/* 页二：净提升零 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 292, width: 900 }}>
            <div style={{ fontFamily: FONT.serif, fontSize: FT.display, color: C.coral, lineHeight: 1.1 }}>0.0</div>
            <div style={{ fontFamily: FONT.sans, fontSize: FT.lead, color: C.ink, marginTop: 6 }}>个百分点：ED 与 DTW 净提升</div>
            <Body style={{ marginTop: 20, width: 860 }}>
              书里写「提升不到两个百分点」，实测直接是零。不是 DTW 没起作用，是它的作用被另一批错误抵消了。下一张混淆矩阵是证据。
            </Body>
          </div>
          <div style={{ position: "absolute", left: 1030, top: 300, width: 800 }}>
            <Card label="先把三个数摆在一起" accent={C.cyan} pad={22}>
              <Row name="ED 准确率" value={fmtF(ed.acc, 4)} width={740} />
              <Row name="DTW 准确率" value={fmtF(dtw.acc, 4)} width={740} />
              <Row name="差值" value="0.0000" color={C.coral} width={740} />
              <Row name="EE 准确率" value={fmtF(ee.acc, 4)} color={C.violet} width={740} />
              <Row name="EE − ED" value="+3 只窗" color={C.violet} width={740} />
            </Card>
          </div>
        </AbsoluteFill>

        {/* 页三：三张混淆矩阵 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 286 }}>
            <div style={{ display: "flex", gap: 60 }}>
              <Confusion matrix={ed.confusion} labels={gname} colors={gcol} cell={92} compact title={"ED · " + fmtF(ed.acc, 4)} accent={C.cyan} />
              <Confusion matrix={dtw.confusion} labels={gname} colors={gcol} cell={92} compact title={"DTW · " + fmtF(dtw.acc, 4)} accent={C.amber} />
              <Confusion matrix={ee.confusion} labels={gname} colors={gcol} cell={92} compact title={"EE · " + fmtF(ee.acc, 4)} accent={C.violet} />
            </div>
            <div style={{ display: "flex", gap: 16, marginTop: 20, alignItems: "center" }}>
              <Chip color={C.cyan}>医药召回 ED {fmtF(ed.recall[2], 4)}</Chip>
              <Chip color={C.amber}>DTW {fmtF(dtw.recall[2], 4)}</Chip>
              <Chip color={C.violet}>EE {fmtF(ee.recall[2], 4)}</Chip>
            </div>
            <Body style={{ marginTop: 18, width: 1700 }}>
              总数二十五对二十五，看起来一模一样；但每个格子的分布不同。看第三行：真值是医药，ED 只认出三只，DTW 认出六只，剩下的被推给银行与半导体。
            </Body>
          </div>
        </AbsoluteFill>

        {/* 页四：医药召回 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 292, width: 880 }}>
            <div style={{ fontFamily: FONT.serif, fontSize: FT.h1, color: C.ink, lineHeight: 1.24 }}>医药召回翻倍，总数不动。</div>
            <Body style={{ marginTop: 20, width: 840 }}>
              ED 的医药召回只有零点一七六五：十七只医药，认出三只，另外十四只被判成银行或半导体。DTW 把召回提到零点三五二九，认出六只，但银行和半导体各多错几只，总数补平。
            </Body>
            <div style={{ marginTop: 20 }}>
              <Row name="ED 医药召回" value={fmtF(ed.recall[2], 4)} note="3 / 17" color={C.cyan} width={820} />
              <Row name="DTW 医药召回" value={fmtF(dtw.recall[2], 4)} note="6 / 17" color={C.amber} width={820} />
              <Row name="EE 医药召回" value={fmtF(ee.recall[2], 4)} note="6 / 17" color={C.violet} width={820} />
            </div>
          </div>
          <div style={{ position: "absolute", left: 1000, top: 300, width: 830 }}>
            <Card label="集成为什么多对三只" accent={C.violet} pad={22}>
              <div style={{ display: "flex", gap: 14 }}>
                <Stat label="银行召回" value={fmtF(ee.recall[0], 4)} sub="14 / 25" valueColor={C.cyan} valueSize={32} />
                <Stat label="半导体召回" value={fmtF(ee.recall[1], 4)} sub="8 / 18" valueColor={C.amber} valueSize={32} />
                <Stat label="医药召回" value={fmtF(ee.recall[2], 4)} sub="6 / 17" valueColor={C.violet} valueSize={32} />
              </div>
              <Body style={{ marginTop: 16, fontSize: FT.meta }}>
                银行 +1、半导体 −1、医药 +3，净增三只。集成的收益集中在医药，仍然不是三类通吃。
              </Body>
            </Card>
          </div>
        </AbsoluteFill>

        {/* 页五：权重 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 292, width: 800 }}>
            <div style={{ fontFamily: FONT.serif, fontSize: FT.h1, color: C.ink, lineHeight: 1.24 }}>导数 DTW 拿走了七成权重。</div>
            <Body style={{ marginTop: 20, width: 770 }}>
              权重来自四个距离各自的留一准确率。导数距离比的是斜率，说明在这个数据上「形状怎么变」比「值是多少」更稳。LCSS 的留一准确率正好是三分之一，扣掉随机项就是零。
            </Body>
            <div style={{ marginTop: 20 }}>
              <Chip color={C.coral}>LCSS 权重 0</Chip>
            </div>
          </div>
          <div style={{ position: "absolute", left: 920, top: 300, width: 860 }}>
            <Card label={"四个权重 · 和为 " + fmtF(M.main.weights.ddtw + M.main.weights.wdtw + M.main.weights.dtw + M.main.weights.lcss, 1)} accent={C.violet} pad={24}>
              <WeightBars />
            </Card>
          </div>
        </AbsoluteFill>

        {/* 页六：抽样与 CD */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 292, width: 640 }}>
            <div style={{ fontFamily: FONT.serif, fontSize: FT.h1, color: C.ink, lineHeight: 1.24 }}>二十次抽样，排名好看，差异不显著。</div>
            <Body style={{ marginTop: 20, width: 610 }}>
              每次每类抽十只，共三十窗，给三个分类器排名。平均秩集成 1.75 最好，DTW 2.35 最差。但最大一对秩差 0.60，临界差 0.7409，三对全不显著。
            </Body>
            <div style={{ marginTop: 18 }}>
              <Formula size={34} color={C.coral} note="k = 3, N = 20, q = 2.343">
                CD = 0.7409
              </Formula>
            </div>
          </div>
          <div style={{ position: "absolute", left: 720, top: 300 }}>
            <RankPlot width={1100} height={330} />
          </div>
        </AbsoluteFill>

        {/* 页七：合成 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 292, width: 940 }}>
            <div style={{ fontFamily: FONT.serif, fontSize: FT.h1, color: C.ink, lineHeight: 1.24 }}>合成数据给教科书翻案，真实数据不给。</div>
            <Body style={{ marginTop: 20, width: 900 }}>
              三类周期 motif，干净查询下三个分类器全对。把查询循环左移五个点，欧氏立刻掉到零，DTW 与集成保持一点零。教科书结论在合成数据上成立，在真实收益窗上不成立——因为真实窗里没有那么多「同形状、纯平移」的样本。
            </Body>
            <div style={{ marginTop: 22 }}>
              <Row name="干净查询" value="ED 1.0000 · DTW 1.0000 · EE 1.0000" color={C.cyan} width={880} />
              <Row name="左移 5 点" value="ED 0.0000 · DTW 1.0000 · EE 1.0000" color={C.amber} width={880} />
            </div>
          </div>
          <div style={{ position: "absolute", left: 1040, top: 300, width: 790 }}>
            <Card label="这不是矛盾" accent={C.violet} pad={24}>
              <Body>
                DTW 的能力是「对齐平移」，不是「提高分类」。数据里没有平移，或者平移与标签无关，DTW 就没有可发挥的余地。真实收益窗的变异更多来自幅度与噪声，而不是整体相位。
              </Body>
              <div style={{ marginTop: 18 }}>
                <Verdict ok label="合成：DTW 抗平移，复现" />
              </div>
              <div style={{ marginTop: 10 }}>
                <Verdict ok={false} label="真实：净提升 0，不显著" />
              </div>
            </Card>
          </div>
        </AbsoluteFill>
      </Pages>
    </Scene>
  );
};
