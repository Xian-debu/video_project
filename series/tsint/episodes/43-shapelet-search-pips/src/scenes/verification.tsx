import React from "react";
import { AbsoluteFill } from "remotion";
import { C, FONT, FT } from "../../design/tokens";
import {
  PAD, M, pagesOf, Pages, Scene, SceneHead, Card, Body, Chip, Stat, Row, Verdict,
  MiniTable, SplitDots, AnovaTable, KwTable, GainBar, fmt4, fmtInt, groupKeys, groupName, groupColor,
} from "../shared";

export const SVerification: React.FC = () => {
  const at = pagesOf("verification");
  const s = M.synth;
  const g = M.gainSplit;
  const b = M.worked.binary;
  return (
    <Scene id="verification">
      <SceneHead id="verification" />
      <Pages id="verification" at={at}>
        {/* 页一：合成总表 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 292, width: 740 }}>
            <div style={{ fontFamily: FONT.serif, fontSize: FT.h1, color: C.ink, lineHeight: 1.2 }}>
              先看合成数据的
              <br />
              总表。
            </div>
            <Body style={{ marginTop: 20, width: 710 }}>
              全搜索：增益零点八四七五，准确率一点零。拐点搜索：同样的增益，同样的准确率。候选两万三千六百七十对两千三百二十五，耗时二十二点一五对二点一七。十倍加速，判别力零损失。
            </Body>
            <div style={{ marginTop: 22, display: "flex", gap: 12 }}>
              <Chip color={C.cyan}>{fmt4(s.speedup, 2)} 倍</Chip>
              <Chip color={C.amber}>增益差 {fmt4(s.gainDelta)}</Chip>
              <Verdict ok label="60 / 60 全对" />
            </div>
          </div>
          <div style={{ position: "absolute", left: 880, top: 292, width: 960 }}>
            <Card label="全搜索 vs 拐点起点：四个读数" accent={C.cyan} pad={20}>
              <MiniTable
                head={["读数", "全搜索", "拐点起点", "差"]}
                colW={[280, 210, 210, 200]}
                width={920}
                rowH={44}
                rows={[
                  ["候选数", fmtInt(s.full.candidates), fmtInt(s.pips.candidates), "−21,345"],
                  ["耗时", fmt4(s.full.seconds, 2) + " s", fmt4(s.pips.seconds, 2) + " s", fmt4(s.speedup, 2) + "×"],
                  ["增益", fmt4(s.full.gain) + " bit", fmt4(s.pips.gain) + " bit", "0.0000"],
                  ["准确率", fmt4(s.full.accuracy, 2), fmt4(s.pips.accuracy, 2), "0.0000"],
                ]}
              />
            </Card>
          </div>
        </AbsoluteFill>

        {/* 页二：Top-5 + 反向 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 292, width: 720 }}>
            <div style={{ fontFamily: FONT.serif, fontSize: FT.h1, color: C.ink, lineHeight: 1.2 }}>
              Top-5 全是
              <br />
              反向 shapelet。
            </div>
            <Body style={{ marginTop: 20, width: 690 }}>
              五条全是长度八，起点分别是八、十六、二十、三十二、四十八，全部来自第一条训练序列，全部对第三类分裂最好。阈值从一点零四七七到一点三四五八。第三类的三十条全在阈值右边。
            </Body>
            <div style={{ marginTop: 20 }}>
              <Card label="五十九条对三十一条" accent={C.amber} pad={18}>
                <Body>
                  其余五十九条全在左边，有一个例外是模板自己的序列，距离记无穷。增益 {fmt4(g.gain)} bit。
                </Body>
              </Card>
            </div>
          </div>
          <div style={{ position: "absolute", left: 860, top: 280, width: 980 }}>
            <Card label="Top-5 明细" accent={C.violet} pad={18}>
              <MiniTable
                head={["起点", "长度", "来源", "命中类", "增益", "阈值"]}
                colW={[130, 120, 160, 160, 190, 200]}
                width={920}
                rowH={36}
                rows={M.top5.map((t) => [String(t.start), String(t.len), "#" + t.series, "第 " + (t.class + 1) + " 类", fmt4(t.gain), fmt4(t.threshold)])}
              />
            </Card>
            <div style={{ marginTop: 14 }}>
              <Card label="距离轴上的分割" accent={C.amber} pad={14}>
                <SplitDots pos={g.posDist} neg={g.negDist} threshold={g.threshold} width={900} height={180} posLabel="第 3 类 30 条" negLabel="其余 59 条" />
              </Card>
            </div>
          </div>
        </AbsoluteFill>

        {/* 页三：平衡二分类 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 292, width: 760 }}>
            <div style={{ fontFamily: FONT.serif, fontSize: FT.h1, color: C.ink, lineHeight: 1.2 }}>
              两类平衡：
              <br />
              0.8938 / 1.0。
            </div>
            <Body style={{ marginTop: 20, width: 730 }}>
              再加一个人为的两类平衡对照：两类各三十条，理论上界是一点零 bit。实测零点八九三八，差零点一零六二。差距来自自距离记无穷远：模板自己那条序列不参与分裂。这不是噪声，是口径。
            </Body>
            <div style={{ marginTop: 22 }}>
              <Chip color={C.cyan}>类 0 距离 0 – 0.9943</Chip>{" "}
              <Chip color={C.amber}>类 1 距离 1.0999 – 1.3449</Chip>
            </div>
          </div>
          <div style={{ position: "absolute", left: 900, top: 286, width: 940 }}>
            <Card label="两类距离完全分开，仍差上界 0.1062 bit" accent={C.cyan} pad={18}>
              <SplitDots pos={b.distances.filter((_, i) => b.labels[i] === 1)} neg={b.distances.filter((_, i) => b.labels[i] === 0)} threshold={b.threshold} width={900} height={210} posLabel="类 1（30 条）" negLabel="类 0（30 条）" />
            </Card>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14, marginTop: 14 }}>
              <Stat label="实测增益" value={fmt4(b.gain)} sub="bit" valueColor={C.cyan} valueSize={34} />
              <Stat label="理论上界" value={fmt4(b.ceiling, 1)} sub="bit" valueColor={C.inkDim} valueSize={34} />
              <Stat label="差距" value={fmt4(b.ceiling - b.gain)} sub="来自自距离记无穷" valueColor={C.coral} valueSize={34} />
            </div>
          </div>
        </AbsoluteFill>

        {/* 页四：真实数据 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 286, width: 720 }}>
            <div style={{ fontFamily: FONT.mono, fontSize: FT.micro, color: C.inkFaint, letterSpacing: 2 }}>REAL DATA · 150 STOCKS · 105 TEST</div>
            <div style={{ fontFamily: FONT.mono, fontSize: 96, color: C.coral, lineHeight: 1.05, marginTop: 4 }}>{fmt4(M.real.accuracy)}</div>
            <Body style={{ marginTop: 16, width: 680 }}>
              训练四十五，测试一百零五。搜索八千一百九十个候选，四点六八秒。最优模板增益只有零点三九八三。准确率零点三四二九，三十六条对；随机猜是三分之一，只高了一个百分点。
            </Body>
          </div>
          <div style={{ position: "absolute", left: 840, top: 292, width: 1000 }}>
            <Card label="真实数据的四个读数" accent={C.coral} pad={20}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <Stat label="搜索候选" value={fmtInt(M.real.hits)} sub="4.68 s" valueColor={C.inkDim} valueSize={38} />
                <Stat label="最优增益" value={fmt4(M.real.top.gain)} sub={"bit · 长度 " + M.real.top.len} valueColor={C.amber} valueSize={38} />
                <Stat label="准确率" value={fmt4(M.real.accuracy)} sub="105 条测试对 36 条" valueColor={C.coral} valueSize={38} />
                <Stat label="随机基线" value={fmt4(M.real.chance)} sub="三类各五十只" valueColor={C.inkDim} valueSize={38} />
              </div>
            </Card>
          </div>
        </AbsoluteFill>

        {/* 页五：检验与可分 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 292, width: 780 }}>
            <div style={{ fontFamily: FONT.serif, fontSize: FT.h1, color: C.ink, lineHeight: 1.2 }}>
              检验说有差，
              <br />
              阈值却分不开。
            </div>
            <Body style={{ marginTop: 20, width: 750 }}>
              ANOVA：F 等于三点五七二六，p 零点零三零五。Kruskal：H 等于九点二零零九，p 零点零一零零。两个都显著。三组均值：一点三八二八、一点二零三七、一点二八九七。F 显著说明均值有差，不代表一条模板能分开它们。
            </Body>
            <div style={{ marginTop: 18 }}>
              <Card label="用阈值 1.6709 去切" accent={C.coral} pad={18}>
                <Row name="召回电子" value="39 / 50" note="真阳 39" width={720} color={C.cyan} />
                <Row name="误伤其余" value="91 条" note="假阳 91" width={720} color={C.coral} />
                <Row name="精确率" value={fmt4(M.real.split.precision, 2)} note="三条里只有一条是对的" width={720} color={C.coral} />
              </Card>
            </div>
          </div>
          <div style={{ position: "absolute", left: 900, top: 292, width: 940 }}>
            <Card label="两个检验，同一批距离" accent={C.amber} pad={20}>
              <Row name="ANOVA F" value={fmt4(M.real.anova.f)} note={"p = " + fmt4(M.real.anova.p)} width={880} color={C.cyan} />
              <Row name="Kruskal H" value={fmt4(M.real.kruskal.h)} note={"p = " + fmt4(M.real.kruskal.p)} width={880} color={C.violet} />
              <div style={{ marginTop: 14, fontFamily: FONT.mono, fontSize: FT.body, color: C.inkDim }}>
                组均值：{M.real.anova.means.map((m) => fmt4(m)).join(" · ")}
              </div>
            </Card>
            <div style={{ marginTop: 14 }}>
              <Card label="显著 ≠ 可分" accent={C.coral} pad={18}>
                <Body>
                  均值差是真的，形状差也是真的；但一条阈值切下去，把电子和另外两类混在一起。这就是「检验显著」和「一条模板能分类」之间的距离。
                </Body>
              </Card>
            </div>
          </div>
        </AbsoluteFill>

        {/* 页六：黄金 F 例 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 292, width: 760 }}>
            <div style={{ fontFamily: FONT.serif, fontSize: FT.h1, color: C.ink, lineHeight: 1.2 }}>
              黄金小例一：
              <br />
              F 正好 13.5。
            </div>
            <Body style={{ marginTop: 20, width: 730 }}>
              两组相同，第三组整体加九。组间平方和二百七，组内一百二；自由度二和十二，均方一百三十五和十。F 正好十三点五，p 零点零零零八四九。
            </Body>
            <div style={{ marginTop: 20 }}>
              <Card label="三组数据" accent={C.cyan} pad={18}>
                <div style={{ fontFamily: FONT.mono, fontSize: FT.body, color: C.inkDim, lineHeight: 1.9 }}>
                  <div>A：−4, −2, 0, 2, 4</div>
                  <div>B：−4, −2, 0, 2, 4</div>
                  <div style={{ color: C.cyan }}>C：5, 7, 9, 11, 13（整体 +9）</div>
                </div>
              </Card>
            </div>
          </div>
          <div style={{ position: "absolute", left: 900, top: 300, width: 940 }}>
            <Card label="ANOVA 表" accent={C.cyan} pad={22}>
              <AnovaTable width={860} />
            </Card>
          </div>
        </AbsoluteFill>

        {/* 页七：黄金 H 例 + 分歧 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 292, width: 760 }}>
            <div style={{ fontFamily: FONT.serif, fontSize: FT.h1, color: C.ink, lineHeight: 1.2 }}>
              黄金小例二：
              <br />
              F 和 H 吵架。
            </div>
            <Body style={{ marginTop: 20, width: 730 }}>
              H 例：秩和分别是四、二十四、五十；H 等于三点八五七一四三，p 零点一四五四。F 说显著，H 说不显著。还有一个反例：第三组放一个一百的离群点，F 被方差拉平，p 零点四八七七；H 只看秩，p 零点零四四五。
            </Body>
            <div style={{ marginTop: 20 }}>
              <Card label="离群点反例" accent={C.coral} pad={18}>
                <Row name="F 检验" value={"p = " + fmt4(M.worked.disagree.fP)} note="不显著" width={700} color={C.inkDim} />
                <Row name="H 检验" value={"p = " + fmt4(M.worked.disagree.hP)} note="显著" width={700} color={C.coral} />
              </Card>
            </div>
            <div style={{ marginTop: 14 }}>
              <Card label="结论" accent={C.amber} pad={16}>
                <Body>先问数据长什么样，再选检验。正态、无离群，用 F；否则用 H。</Body>
              </Card>
            </div>
          </div>
          <div style={{ position: "absolute", left: 900, top: 300, width: 940 }}>
            <Card label="Kruskal 表（秩和 4 / 24 / 50）" accent={C.amber} pad={20}>
              <KwTable width={870} />
            </Card>
          </div>
        </AbsoluteFill>
      </Pages>
    </Scene>
  );
};
