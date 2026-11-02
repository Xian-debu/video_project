import React from "react";
import { AbsoluteFill } from "remotion";
import { C, FONT, FT } from "../../design/tokens";
import {
  PAD, M, pagesOf, Pages, Scene, SceneHead, Card, Body, Chip, Stat, Row, Verdict,
  SeriesBox, MiniTable, fmt4, fmtInt, groupKeys, groupName, groupColor,
} from "../shared";

export const SOpen: React.FC = () => {
  const at = pagesOf("open");
  const ex = M.synthExamples;
  const t0 = M.top5[0];
  return (
    <Scene id="open">
      <SceneHead id="open" />
      <Pages id="open" at={at}>
        {/* 页一：一小段 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 292, width: 740 }}>
            <div style={{ fontFamily: FONT.serif, fontSize: FT.display, color: C.ink, lineHeight: 1.16 }}>
              挖一小段。
            </div>
            <Body style={{ marginTop: 26, width: 720 }}>
              一条曲线不必整条拿来比。从里面截出八个点，就够把一类和其余分开。这一小段形状有自己的名字：shapelet，读作形状子。
            </Body>
            <div style={{ display: "flex", gap: 12, marginTop: 26, flexWrap: "wrap" }}>
              <Chip color={C.cyan}>合成三类</Chip>
              <Chip color={C.amber}>周期 8 / 12 / 20</Chip>
              <Chip color={C.violet}>每类 50 条 · 每条 100 点</Chip>
            </div>
            <div style={{ marginTop: 28 }}>
              <Verdict ok label="训练 90 条 · 测试 60 条" />
            </div>
          </div>
          <div style={{ position: "absolute", left: 880, top: 272, width: 960 }}>
            <Card label="同一条曲线，三种周期" accent={C.cyan} pad={16}>
              <div style={{ display: "flex", gap: 18 }}>
                {ex.map((e, i) => (
                  <div key={i}>
                    <SeriesBox values={e.values} width={280} height={116} color={[C.cyan, C.amber, C.violet][i]} label={"周期 " + M.synth.periods[i]} />
                  </div>
                ))}
              </div>
            </Card>
            <div style={{ marginTop: 16 }}>
              <Card label="从第一类序列里挖出的八点模板" accent={C.coral} pad={16}>
                <SeriesBox values={t0.values} width={890} height={92} color={C.coral} accent={C.coral} />
                <div style={{ marginTop: 6, fontFamily: FONT.mono, fontSize: FT.meta, color: C.inkDim }}>
                  长度 {t0.len} · 起点 {t0.start} · 增益 {fmt4(t0.gain)} bit · 阈值 {fmt4(t0.threshold)}
                </div>
              </Card>
            </div>
          </div>
        </AbsoluteFill>

        {/* 页二：十倍 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 292, width: 780 }}>
            <div style={{ fontFamily: FONT.serif, fontSize: FT.h1, color: C.ink, lineHeight: 1.2 }}>
              候选砍到 9.82%，
              <br />
              增益没有掉。
            </div>
            <Body style={{ marginTop: 24, width: 750 }}>
              全搜索要试两万三千六百七十个候选，二十二点一五秒。让起点只落在十个感知拐点上，候选压到两千三百二十五个，两秒出头。增益一模一样。
            </Body>
            <div style={{ display: "flex", gap: 12, marginTop: 26 }}>
              <Chip color={C.cyan}>{fmt4(M.synth.speedup, 2)} 倍加速</Chip>
              <Chip color={C.amber}>增益差 {fmt4(M.synth.gainDelta)}</Chip>
            </div>
          </div>
          <div style={{ position: "absolute", left: 920, top: 286, width: 920 }}>
            <Card label="全搜索 vs 拐点起点" accent={C.amber} pad={22}>
              <Row name="候选数" value={fmtInt(M.synth.full.candidates) + " → " + fmtInt(M.synth.pips.candidates)} note={"只剩 " + (M.synth.pips.candidateRatio * 100).toFixed(2) + "%，省掉 " + fmtInt(M.synth.candidatesSaved) + " 个"} width={860} color={C.cyan} />
              <Row name="搜索耗时" value={fmt4(M.synth.full.seconds, 2) + " s → " + fmt4(M.synth.pips.seconds, 2) + " s"} note={"倍数 " + fmt4(M.synth.speedup, 2)} width={860} color={C.amber} />
              <Row name="最优增益" value={fmt4(M.synth.full.gain) + " → " + fmt4(M.synth.pips.gain)} note="bit，差 0.0000" width={860} color={C.violet} />
              <Row name="测试准确率" value={fmt4(M.synth.full.accuracy, 2) + " → " + fmt4(M.synth.pips.accuracy, 2)} note="60 条全对" width={860} color={C.ink} />
            </Card>
          </div>
        </AbsoluteFill>

        {/* 页三：真实数据 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 280, width: 700 }}>
            <div style={{ fontFamily: FONT.mono, fontSize: FT.micro, color: C.inkFaint, letterSpacing: 2 }}>REAL DATA · 150 STOCKS</div>
            <div style={{ fontFamily: FONT.mono, fontSize: 104, color: C.coral, lineHeight: 1.05, marginTop: 6 }}>{fmt4(M.real.accuracy)}</div>
            <Body style={{ marginTop: 18, width: 660 }}>
              换成真实的一百五十只股票，每只取最后一百个交易日的收益。同一个算法，一百零五个测试窗只对三十六个。随机猜三分之一，它只多一点点。
            </Body>
          </div>
          <div style={{ position: "absolute", left: 840, top: 286, width: 1000 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
              <Stat label="训练 / 测试" value={M.real.train + " / " + M.real.test} sub="45 条训练，105 条测试" valueColor={C.ink} valueSize={36} />
              <Stat label="随机基线" value={fmt4(M.real.chance)} sub="三类各五十只" valueColor={C.inkDim} valueSize={36} />
              <Stat label="只高" value={((M.real.accuracy - M.real.chance) * 100).toFixed(2) + " pp"} sub="0.96 个百分点" valueColor={C.coral} valueSize={36} />
            </div>
            <div style={{ marginTop: 18 }}>
              <Card label="完美和失效，差的是什么" accent={C.coral} pad={22}>
                <Body>
                  合成数据上一模一样的算法拿到 1.0。真实收益窗上只有 0.3429。中间差的不是代码，是数据里到底有没有稳定的局部形状。这一集要把这条边界量出来。
                </Body>
              </Card>
            </div>
          </div>
        </AbsoluteFill>

        {/* 页四：三件事 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 292, width: 1770 }}>
            <div style={{ fontFamily: FONT.serif, fontSize: FT.h1, color: C.ink }}>这一集讲三件事。</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 22, marginTop: 34 }}>
              <Card label="一 · 形状怎么变成特征" accent={C.cyan} pad={24} style={{ minHeight: 300 }}>
                <Body>
                  从一条序列里截出连续子序列，对每条序列取滑动窗口的最小距离。距离小就判这一类，阈值由信息增益选出来。
                </Body>
                <div style={{ marginTop: 16 }}><Chip color={C.cyan}>候选 · 距离 · 阈值</Chip></div>
              </Card>
              <Card label="二 · 搜索怎么打分" accent={C.amber} pad={24} style={{ minHeight: 300 }}>
                <Body>
                  对每一类做一对其余，把距离排序，每个可切的位置算一次增益。三分类取增益最大的那一段作模板。
                </Body>
                <div style={{ marginTop: 16 }}><Chip color={C.amber}>信息熵 · 一对其余</Chip></div>
              </Card>
              <Card label="三 · PIPs 与真实边界" accent={C.violet} pad={24} style={{ minHeight: 300 }}>
                <Body>
                  十个拐点把候选砍到十分之一。合成数据上增益不掉；真实收益上算法失效。再补两个检验：F 与 H，看它们什么时候吵架。
                </Body>
                <div style={{ marginTop: 16 }}><Chip color={C.violet}>加速 · 检验</Chip></div>
              </Card>
            </div>
          </div>
        </AbsoluteFill>
      </Pages>
    </Scene>
  );
};
