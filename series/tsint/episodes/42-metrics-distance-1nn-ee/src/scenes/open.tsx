import React from "react";
import { AbsoluteFill } from "remotion";
import { C, FONT, FT } from "../../design/tokens";
import {
  PAD, M, pagesOf, Pages, Scene, SceneHead, Card, Body, Chip, Stat,
  LinePlot, Verdict, Row, groupColor, groupName, groupKeys, fmtF,
} from "../shared";

export const SOpen: React.FC = () => {
  const at = pagesOf("open");
  const mo = M.motif;
  return (
    <Scene id="open">
      <SceneHead id="open" />
      <Pages id="open" at={at}>
        {/* 页一：挪五个点 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 292, width: 760 }}>
            <div style={{ fontFamily: FONT.serif, fontSize: FT.display, color: C.ink, lineHeight: 1.18 }}>
              向左挪
              <br />
              五个点。
            </div>
            <Body style={{ marginTop: 26, width: 730 }}>
              同一条正弦曲线，只把时间轴循环左移五个点。欧氏距离逐点对齐，误差从一跳到十五；DTW 允许拉伸，距离还是零点三六。这一集要问的不是「哪个距离更漂亮」，是「换个距离，分类真的会变好吗」。
            </Body>
            <div style={{ display: "flex", gap: 14, marginTop: 28 }}>
              <Chip color={C.cyan}>周期 {mo.period} 点</Chip>
              <Chip color={C.amber}>平移 {mo.shift} 点</Chip>
              <Chip color={C.violet}>z 标准化后</Chip>
            </div>
          </div>
          <div style={{ position: "absolute", left: 900, top: 276, width: 940 }}>
            <Card label="同一个形状，两条距离" accent={C.cyan} pad={18}>
              <LinePlot
                width={880} height={250} legend
                yFmt={(v) => v.toFixed(1)}
                series={[
                  { name: "原曲线 a", color: C.ink, values: mo.a },
                  { name: "左移 5 点 b", color: C.cyan, values: mo.b },
                ]}
              />
            </Card>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16, marginTop: 18 }}>
              <Stat label="欧氏距离" value={fmtF(mo.ed, 4)} sub="逐点相减，错位就是大误差" valueColor={C.coral} valueSize={38} />
              <Stat label="DTW 距离" value={fmtF(mo.dtw, 4)} sub="带宽 6，允许时间轴拉伸" valueColor={C.cyan} valueSize={38} />
              <Stat label="比值" value={(mo.ed / mo.dtw).toFixed(0) + "x"} sub="同形状，差四十倍" valueColor={C.violet} valueSize={38} />
            </div>
          </div>
        </AbsoluteFill>

        {/* 页二：任务 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 292, width: 820 }}>
            <div style={{ fontFamily: FONT.serif, fontSize: FT.h1, color: C.ink, lineHeight: 1.2 }}>
              六十天收益窗，
              <br />
              贴一个行业标签。
            </div>
            <Body style={{ marginTop: 24, width: 790 }}>
              输入是一段六十个交易日的对数收益，先做 z 标准化，只留下形状。输出是三个行业之一。分类器固定用 1-NN：训练集里找距离最近的那条窗，把它的标签抄过来。
            </Body>
          </div>
          <div style={{ position: "absolute", left: 980, top: 286, width: 860 }}>
            <Card label="三个行业，六十只股票" accent={C.violet} pad={22}>
              {groupKeys.map((k) => (
                <div key={k} style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", padding: "10px 0", borderBottom: "1px solid " + C.panelLine }}>
                  <span style={{ fontFamily: FONT.sans, fontSize: FT.body, color: groupColor[k] }}>{groupName[k]}</span>
                  <span style={{ fontFamily: FONT.mono, fontSize: FT.num, color: C.ink }}>{M.dataset.groups[k]} 只</span>
                </div>
              ))}
              <Body style={{ marginTop: 14, fontSize: FT.meta }}>
                计划写的是各三十只；湖里只有 25 / 18 / 17。这一集如实记录，不凑数。
              </Body>
            </Card>
          </div>
        </AbsoluteFill>

        {/* 页三：三个读数 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 292, width: 760 }}>
            <div style={{ fontFamily: FONT.serif, fontSize: FT.h1, color: C.ink, lineHeight: 1.2 }}>
              三个分类器，
              <br />
              一个零提升。
            </div>
            <Body style={{ marginTop: 24, width: 740 }}>
              同一批六十个窗，同一个 1-NN，只换距离。欧氏和 DTW 都判对二十五只。弹性集成多对三只，但统计检验说不显著。
            </Body>
          </div>
          <div style={{ position: "absolute", left: 900, top: 286, width: 940 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
              <Stat label="欧氏 1-NN" value={fmtF(M.main.ed.acc, 4)} sub={"判对 " + M.main.ed.correct + " / 60 · macro-F1 " + fmtF(M.main.ed.macroF1, 4)} valueColor={C.cyan} valueSize={40} />
              <Stat label="DTW 1-NN" value={fmtF(M.main.dtw.acc, 4)} sub={"判对 " + M.main.dtw.correct + " / 60 · macro-F1 " + fmtF(M.main.dtw.macroF1, 4)} valueColor={C.amber} valueSize={40} />
              <Stat label="弹性集成" value={fmtF(M.main.ee.acc, 4)} sub={"判对 " + M.main.ee.correct + " / 60 · macro-F1 " + fmtF(M.main.ee.macroF1, 4)} valueColor={C.violet} valueSize={40} />
            </div>
            <div style={{ marginTop: 18 }}>
              <Row name="欧氏 → DTW 净提升" value="0.0 个百分点" note="书里的说法：提升不足两个百分点" color={C.coral} />
              <Row name="Nemenyi 检验" value="三对全不显著" note={"临界差 " + fmtF(M.repeats.cd, 4) + "，最大秩差 0.60"} color={C.coral} />
            </div>
          </div>
        </AbsoluteFill>

        {/* 页四：为什么又是零 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 292, width: 1000 }}>
            <div style={{ fontFamily: FONT.serif, fontSize: FT.h1, color: C.ink, lineHeight: 1.2 }}>
              总数没变，
              <br />
              故事变了。
            </div>
            <Body style={{ marginTop: 24, width: 960 }}>
              DTW 确实把医药召回从零点一七六五提到零点三五二九，多认出三只医药。但银行和半导体被对称地误判了同样多。总数让两个距离打平，混淆矩阵让机制露出来。
            </Body>
            <div style={{ marginTop: 26, display: "flex", gap: 16 }}>
              <Verdict ok label="20 / 20 项证据检查通过" />
              <Chip color={C.violet}>新测试 {M.meta.newCases} 条</Chip>
              <Chip color={C.cyan}>三条测试套件</Chip>
            </div>
          </div>
          <div style={{ position: "absolute", left: 1140, top: 300, width: 700 }}>
            <Card label="书里的主张 vs 实测" accent={C.coral} pad={22}>
              <Row name="书上：DTW 更好" value="提升 < 2pp" note="这本书给的上界" width={640} />
              <Row name="实测：ED vs DTW" value="25 vs 25" note="0.0 个百分点" color={C.coral} width={640} />
              <Row name="实测：EE vs ED" value="28 vs 25" note="+3 只，不显著" color={C.violet} width={640} />
            </Card>
          </div>
        </AbsoluteFill>

        {/* 页五：路线 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 292, width: 1770 }}>
            <div style={{ fontFamily: FONT.serif, fontSize: FT.h1, color: C.ink }}>这一集把三件事拆开讲。</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 22, marginTop: 34 }}>
              <Card label="一 · 距离怎么算" accent={C.cyan} pad={24} style={{ minHeight: 260 }}>
                <Body>
                  欧氏逐点对齐；DTW 填一张代价矩阵，允许相邻点对齐；带宽 6 把搜索关进一条走廊。再讲四个弹性距离：DTW、导数 DTW、加权 DTW、LCSS。
                </Body>
              </Card>
              <Card label="二 · 分类器怎么评" accent={C.amber} pad={24} style={{ minHeight: 260 }}>
                <Body>
                  混淆矩阵、逐类精度召回、macro-F1，再到 Nemenyi 平均秩与临界差。0.8333 这个黄金值会出现在两个地方：一个 worked 例，一个检验读数。
                </Body>
              </Card>
              <Card label="三 · 集成为什么不显著" accent={C.violet} pad={24} style={{ minHeight: 260 }}>
                <Body>
                  四个距离各给一个权重，权重来自留一准确率。权重最高的反而是导数 DTW。多对的三只来自医药，但总数扛不住抽样波动。
                </Body>
              </Card>
            </div>
          </div>
        </AbsoluteFill>
      </Pages>
    </Scene>
  );
};
