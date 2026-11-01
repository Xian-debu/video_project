import React from "react";
import { AbsoluteFill } from "remotion";
import { C, FONT, FT } from "../../design/tokens";
import { PAD, M, U, pagesOf, Pages, Scene, SceneHead, Card, Row, Body, Verdict, Chip, K, Stat, unitName, unitColor, fmtInt } from "../shared";
import { SCENES } from "../script";

const mmss = (s: number) => Math.floor(s / 60) + ":" + String(Math.round(s % 60)).padStart(2, "0");

export const SOpen: React.FC = () => {
  const at = pagesOf("open");
  return (
    <Scene id="open">
      <SceneHead id="open" />
      <Pages id="open" at={at}>
        {/* 页一：十二个节点 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 286, width: 900 }}>
            <div style={{ fontFamily: FONT.serif, fontSize: FT.display, color: C.ink, lineHeight: 1.18 }}>
              十二个节点，
              <br />
              一条学出来的边。
            </div>
            <Body style={{ marginTop: 26, width: 860 }}>
              上一集的混合先验没救回检测。这一集换一种关系：不再是十二个独立样本，而是把它们画成一张图，
              邻接不用行业标签，让余弦相似度自己选邻居。图神经网络、六种增强、对比损失、TopK 邻接。
            </Body>
            <div style={{ display: "flex", gap: 14, marginTop: 30 }}>
              <Verdict ok label={M.meta.checks + " 项证据检查通过"} />
              <Chip color={C.violet}>新测试 {M.meta.tests.newAsserts} 条 · 仓库 {M.meta.tests.asserts.toLocaleString("en-US")} 条</Chip>
            </div>
          </div>
          <div style={{ position: "absolute", left: 1040, top: 292, width: 810 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
              {(["graph", "flat"] as const).map((k) => (
                <Card key={k} label={unitName[k]} accent={unitColor[k]} pad={20}>
                  <Stat label="F1" value={U(k).f1.toFixed(4)} sub={"P " + U(k).p.toFixed(4) + " · R " + U(k).r.toFixed(4)} valueSize={50} valueColor={unitColor[k]} />
                </Card>
              ))}
            </div>
            <Body size={FT.meta} color={C.coral} style={{ marginTop: 16, width: 790 }}>
              两个读数连显示位数都相同。不是实现错误，是阈值让两个模型都退化成了「每天报警」。
            </Body>
          </div>
        </AbsoluteFill>

        {/* 页二：两个读数并排 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 288, width: 1020 }}>
            <Card label="两个读数" accent={C.cyan}>
              <Row name="图神经网络 · F1" value={U("graph").f1.toFixed(4)} note={"精确率 " + U("graph").p.toFixed(4) + "，召回 " + U("graph").r.toFixed(4)} color={C.cyan} width={970} />
              <Row name="同结构无图 · F1" value={U("flat").f1.toFixed(4)} note={"精确率 " + U("flat").p.toFixed(4) + "，召回 " + U("flat").r.toFixed(4)} color={C.inkFaint} width={970} />
              <Row name="报警率" value={U("graph").alertPct.toFixed(2) + "%"} note={"测试 " + M.windows.test + " 日，报警 " + M.scores.alertDays + " 日"} width={970} />
              <Row name="阈值" value={M.scores.tauG.toFixed(2) + " / " + M.scores.tauF.toFixed(2)} note="训练段 99 分位，两个数只差一点" width={970} />
              <Row name="干净测试日中位" value={M.scores.cleanMedianGraph.toFixed(3)} note={"无图 " + M.scores.cleanMedianFlat.toFixed(3) + "，都在阈值上面"} color={C.coral} width={970} />
            </Card>
          </div>
          <div style={{ position: "absolute", left: 1150, top: 288, width: 700 }}>
            <Body size={FT.lead} color={C.inkDim} style={{ width: 660, lineHeight: 1.7 }}>
              结构是学到了：邻接的组内精度 0.586 对随机 0.379。但结构没有变成读数：阈值一破，两个模型一起瘫痪。
            </Body>
            <Card label="这一集先说结论" accent={C.amber} style={{ marginTop: 26 }}>
              <Row name="结构" value="学到" note="邻接抓到行业同步性，只有一半对称" width={640} />
              <Row name="读数" value="没接上" note="干净中位 1.398 高于阈值 0.98" width={640} />
              <Row name="代价" value="算得到" note="对照期图报警 100%，无图 74.6%" width={640} />
            </Card>
          </div>
        </AbsoluteFill>

        {/* 页三：三个问题与数据 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 288, width: 1010 }}>
            <Card label="先摆三个问题" accent={C.cyan}>
              <Row name="邻接怎么来" value="从表示里学" note="TopK 余弦，每行恰好三条边" width={960} />
              <Row name="表示怎么训" value="对比学习" note="同票两视图为正，别的票为负" width={960} />
              <Row name="分数怎么读" value="逐日取最大" note="覆盖点的窗取最大重构误差" width={960} />
            </Card>
            <Card label="数据" accent={C.violet} style={{ marginTop: 20 }}>
              <Row name="十二只票" value={fmtInt(M.data.rows) + " 行"} note={M.data.start + " 至 " + M.data.end} width={960} />
              <Row name="训练 / 测试窗" value={M.windows.train + " / " + M.windows.test} note={"窗长 " + M.windows.C + " 天，最大间隔 " + M.data.maxGap.days + " 天"} width={960} />
              <Row name="注入" value={"20 + 20 段"} note={M.inject.truthPts + " 个点级真值，种子 " + M.inject.seed} width={960} />
            </Card>
          </div>
          <div style={{ position: "absolute", left: 1150, top: 288, width: 700 }}>
            {SCENES.map((s, i) => (
              <div key={s.id} style={{ display: "flex", alignItems: "baseline", gap: 16, padding: "7px 0", borderBottom: "1px solid " + C.panelLine }}>
                <span style={{ fontFamily: FONT.mono, fontSize: FT.meta, color: C.inkFaint, width: 30 }}>{String(i + 1).padStart(2, "0")}</span>
                <span style={{ fontFamily: FONT.sans, fontSize: FT.body, color: C.inkDim, flex: 1 }}>{s.title}</span>
                <span style={{ fontFamily: FONT.mono, fontSize: FT.meta, color: C.inkFaint }}>{mmss(s.dur)}</span>
              </div>
            ))}
            <K style={{ display: "block", marginTop: 14 }}>先看一只票跳和整个板块跳的区别。</K>
          </div>
        </AbsoluteFill>
      </Pages>
    </Scene>
  );
};

