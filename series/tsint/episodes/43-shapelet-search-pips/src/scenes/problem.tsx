import React from "react";
import { AbsoluteFill } from "remotion";
import { C, FONT, FT } from "../../design/tokens";
import {
  PAD, M, pagesOf, Pages, Scene, SceneHead, Card, Body, Chip, Stat, Row, Verdict,
  SeriesBox, SlideCurve, MiniTable, fmt4, fmtInt, groupName, groupColor,
} from "../shared";

export const SProblem: React.FC = () => {
  const at = pagesOf("problem");
  const equip = M.cases.find((c) => c.code === "sh601717")!;
  const elec = M.cases.find((c) => c.code === "sh600100")!;
  return (
    <Scene id="problem">
      <SceneHead id="problem" />
      <Pages id="problem" at={at}>
        {/* 页一：任务与对比 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 292, width: 700 }}>
            <div style={{ fontFamily: FONT.serif, fontSize: FT.h1, color: C.ink, lineHeight: 1.2 }}>
              整条比，
              <br />
              判别信息被稀释。
            </div>
            <Body style={{ marginTop: 24, width: 670 }}>
              给一条一百点的序列，判它属于三类中的哪一类。直接拿整条序列算距离，上一集试过：欧氏和 DTW 都不到五成。原因之一是判别信息只占一小段，其余九十几点都是背景。
            </Body>
            <div style={{ marginTop: 24, fontFamily: FONT.mono, fontSize: FT.body, color: C.inkDim }}>
              同一条模板 · 两条真实序列 · 距离差一万倍
            </div>
          </div>
          <div style={{ position: "absolute", left: 800, top: 286, width: 1080 }}>
            <Card label={"中创智领 · " + groupName[equip.group] + " · 距离 " + fmt4(equip.dist)} accent={C.coral} pad={16}>
              <SeriesBox values={equip.series} start={equip.bestStart} len={8} width={980} height={120} color={C.inkDim} accent={C.coral} label={"最近窗口起点 " + equip.bestStart} />
            </Card>
            <div style={{ marginTop: 14 }}>
              <Card label={"同方股份 · " + groupName[elec.group] + " · 距离 " + fmt4(elec.dist)} accent={C.cyan} pad={16}>
                <SeriesBox values={elec.series} start={elec.bestStart} len={8} width={980} height={120} color={C.inkDim} accent={C.cyan} label={"最近窗口起点 " + elec.bestStart + " · 几乎完全重合"} />
              </Card>
            </div>
          </div>
        </AbsoluteFill>

        {/* 页二：定义 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 292, width: 780 }}>
            <div style={{ fontFamily: FONT.serif, fontSize: FT.h1, color: C.ink, lineHeight: 1.2 }}>
              一小段，
              <br />
              一条距离。
            </div>
            <Body style={{ marginTop: 22, width: 750 }}>
              这一小段叫 shapelet：从某条序列里截出的连续子序列。它和另一条序列的距离，是把对方的每个窗口都拿出来、各自 z 归一化，算欧氏距离，取最小值。
            </Body>
            <div style={{ marginTop: 24, background: "#101823", border: "1px solid " + C.panelLine, borderRadius: 10, padding: "16px 20px", fontFamily: FONT.mono, fontSize: FT.body, color: C.ink, lineHeight: 1.7 }}>
              <div>d(s, y) = min_i ‖ z(s) − z(y_i) ‖</div>
              <div style={{ color: C.inkDim }}>窗口内先 z 归一化，形状才可比</div>
            </div>
            <div style={{ marginTop: 18, display: "flex", gap: 12 }}>
              <Chip color={C.cyan}>长度 L 由搜索决定</Chip>
              <Chip color={C.amber}>阈值把一类和其余分开</Chip>
            </div>
          </div>
          <div style={{ position: "absolute", left: 900, top: 292, width: 940 }}>
            <Card label="一条序列的 93 个窗口" accent={C.cyan} pad={18}>
              <SlideCurve curve={M.basic.curve} threshold={M.basic.threshold} minIdx={M.basic.start} width={890} height={230} />
              <div style={{ display: "flex", justifyContent: "space-between", fontFamily: FONT.mono, fontSize: FT.micro, color: C.inkFaint, marginTop: 2 }}>
                <span>起点 0</span>
                <span style={{ color: C.coral }}>阈值 {fmt4(M.basic.threshold)}</span>
                <span>起点 92</span>
              </div>
              <div style={{ marginTop: 12, fontFamily: FONT.sans, fontSize: FT.body, color: C.inkDim }}>
                模板就出自这条序列，最近距离 {fmt4(M.basic.min)}；其它位置的窗口距离都抬起来了。
              </div>
            </Card>
          </div>
        </AbsoluteFill>

        {/* 页三：搜索空间 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 292, width: 800 }}>
            <div style={{ fontFamily: FONT.serif, fontSize: FT.h1, color: C.ink, lineHeight: 1.2 }}>
              两百六十三个起点，
              <br />
              两万三千六百七十个候选。
            </div>
            <Body style={{ marginTop: 22, width: 760 }}>
              长度八有九十三个起点，十二八十九个，二十八十一个，合起来二百六十三个。乘以九十条训练序列，就是两万三千六百七十个候选。每个候选都要在九十条序列上滑一遍。
            </Body>
            <div style={{ marginTop: 24, fontFamily: FONT.mono, fontSize: FT.body, color: C.inkDim }}>
              263 × 90 = 23,670 · 每个候选 90 次滑动 · 实测 22.15 s
            </div>
          </div>
          <div style={{ position: "absolute", left: 940, top: 300, width: 900 }}>
            <Card label="长度的代价" accent={C.amber} pad={20}>
              <MiniTable
                head={["长度 L", "起点数", "每条序列的候选"]}
                colW={[200, 200, 400]}
                width={840}
                rows={[
                  ["8", "93", "100 − 8 + 1"],
                  ["12", "89", "100 − 12 + 1"],
                  ["20", "81", "100 − 20 + 1"],
                  ["合计", "263", "× 90 条 = 23,670"],
                ]}
              />
            </Card>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginTop: 16 }}>
              <Stat label="候选总数" value={fmtInt(M.synth.full.candidates)} sub="三种长度合计" valueColor={C.cyan} valueSize={38} />
              <Stat label="全搜索耗时" value={fmt4(M.synth.full.seconds, 2) + " s"} sub="Haskell 证据程序实测" valueColor={C.amber} valueSize={38} />
            </div>
          </div>
        </AbsoluteFill>

        {/* 页四：分类器与检验 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 292, width: 780 }}>
            <div style={{ fontFamily: FONT.serif, fontSize: FT.h1, color: C.ink, lineHeight: 1.2 }}>
              三条模板，
              <br />
              取最近的一类。
            </div>
            <Body style={{ marginTop: 22, width: 750 }}>
              训练集里每类取一条最好的模板，组成三模板分类器。测试时算三条模板的距离，取最近的那条模板的类别。还要再问一句：这个差别是真的吗？用 ANOVA 的 F 和 Kruskal 的 H 两个检验。
            </Body>
            <div style={{ marginTop: 24, display: "flex", gap: 12 }}>
              <Chip color={C.cyan}>一对其余</Chip>
              <Chip color={C.amber}>F 假设正态</Chip>
              <Chip color={C.violet}>H 只看秩</Chip>
            </div>
          </div>
          <div style={{ position: "absolute", left: 900, top: 292, width: 940 }}>
            <Card label="从训练到预测，四步" accent={C.violet} pad={22}>
              <Row name="1 · 搜索" value="序列 × 长度 × 起点" note="三层循环，截出候选" width={880} />
              <Row name="2 · 打分" value="一对其余信息增益" note="取三分类最大" width={880} />
              <Row name="3 · 建模" value={"每类保留一条模板"} note="共 3 条" width={880} />
              <Row name="4 · 预测" value="最近模板的类别" note="测试算 3 次距离" width={880} />
            </Card>
            <div style={{ marginTop: 16 }}>
              <Card label="还要验证的第二步" accent={C.coral} pad={20}>
                <Body>
                  三组距离的均值有没有差？F 与 H 会说。均值有差，又不等于一条模板能分开 —— 这是本集最后要拆开的地方。
                </Body>
              </Card>
            </div>
          </div>
        </AbsoluteFill>
      </Pages>
    </Scene>
  );
};
