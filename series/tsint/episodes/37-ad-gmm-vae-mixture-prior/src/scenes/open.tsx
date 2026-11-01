import React from "react";
import { AbsoluteFill } from "remotion";
import { C, FONT, FT } from "../../design/tokens";
import { PAD, M, U, pagesOf, Pages, Scene, SceneHead, Card, Row, Body, Verdict, Chip, K, Stat, unitName, unitColor } from "../shared";
import { SCENES } from "../script";

const mmss = (s: number) => Math.floor(s / 60) + ":" + String(Math.round(s % 60)).padStart(2, "0");

export const SOpen: React.FC = () => {
  const at = pagesOf("open");
  return (
    <Scene id="open">
      <SceneHead id="open" />
      <Pages id="open" at={at}>
        {/* 页一：一个先验够不够 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 286, width: 900 }}>
            <div style={{ fontFamily: FONT.serif, fontSize: FT.display, color: C.ink, lineHeight: 1.18 }}>
              一个先验，
              <br />
              多个模式。
            </div>
            <Body style={{ marginTop: 26, width: 860 }}>
              上一集把潜空间钉在标准正态上：一个先验，一个下界，一条 KL。这一集问的是，如果一个高斯不够呢。
              书给的办法是混合先验：K 个高斯拼成一个先验，每个高斯是一个「正常模式」，状态切换就不再是异常。
            </Body>
            <div style={{ display: "flex", gap: 14, marginTop: 30 }}>
              <Verdict ok label={M.meta.checks + " 项证据检查通过"} />
              <Chip color={C.violet}>新测试 {M.meta.tests.newAsserts} 条 · 仓库 {M.meta.tests.asserts.toLocaleString("en-US")} 条</Chip>
            </div>
          </div>
          <div style={{ position: "absolute", left: 1040, top: 292, width: 810 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
              {(["prior1", "mix4"] as const).map((k) => (
                <Card key={k} label={unitName[k]} accent={unitColor[k]} pad={20}>
                  <Stat label="F1" value={U(k).f1.toFixed(4)} sub="同一编码器，只换先验" valueSize={50} valueColor={unitColor[k]} />
                </Card>
              ))}
            </div>
            <Body size={FT.meta} color={C.inkFaint} style={{ marginTop: 16, width: 790 }}>
              两个读数吃同一套注入、同一条阈值口径。混合的想法很漂亮，实测却没抬起来。
            </Body>
          </div>
        </AbsoluteFill>

        {/* 页二：两个读数并排 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 288, width: 1020 }}>
            <Card label="两个读数" accent={C.cyan}>
              <Row name="单高斯先验 · F1" value={U("prior1").f1.toFixed(4)} note={"召回 " + U("prior1").recall.toFixed(4) + "，报警 " + U("prior1").alertPct.toFixed(2) + "%"} color={C.cyan} width={970} />
              <Row name="混合先验 · F1" value={U("mix4").f1.toFixed(4)} note={"召回 " + U("mix4").recall.toFixed(4) + "，报警 " + U("mix4").alertPct.toFixed(2) + "%"} color={C.violet} width={970} />
              <Row name="召回" value={U("prior1").recall.toFixed(4) + " → " + U("mix4").recall.toFixed(4)} note="涨了一倍多" width={970} />
              <Row name="报警率" value={U("prior1").alertPct.toFixed(2) + "% → " + U("mix4").alertPct.toFixed(2) + "%"} note="多出来的召回全是误报" width={970} />
              <Row name="阈值" value={U("prior1").tau.toFixed(2) + " → " + U("mix4").tau.toFixed(2)} note="分数整体变低，训练段的尺子松了" width={970} />
            </Card>
          </div>
          <div style={{ position: "absolute", left: 1150, top: 288, width: 700 }}>
            <Body size={FT.lead} color={C.inkDim} style={{ width: 660, lineHeight: 1.7 }}>
              召回是买来的，代价是几乎每一段都报警。这一集讲它为什么没抬起来。
            </Body>
            <Card label="这一集的结论先说" accent={C.amber} style={{ marginTop: 26 }}>
              <Row name="多个模式" value="拟合得出" note="合成两团、真实潜空间都收到了" width={640} />
              <Row name="趋势段" value="被收进分量" note="混合不区分「趋势」和「正常」" width={640} />
              <Row name="书的判据" value="边界很模糊" note="「任何分量都解释不了」在真实数据里失效" width={640} />
            </Card>
          </div>
        </AbsoluteFill>

        {/* 页三：三个问题与数据 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 288, width: 1010 }}>
            <Card label="先摆三个问题" accent={C.cyan}>
              <Row name="多个模式怎么进损失" value="式(4.26)(4.27)" note="混合似然替掉单高斯先验" width={960} />
              <Row name="EM 和梯度能不能一起训" value="能跑，学不到" note="联合训练一步塌缩，两段式才是主线" width={960} />
              <Row name="混合有没有把趋势当异常" value="没有" note="漂移窗的最小分量 NLL 比正常还低" width={960} />
            </Card>
            <Card label="数据" accent={C.violet} style={{ marginTop: 20 }}>
              <Row name="八只白酒股" value={M.data.rows + " 行"} note={M.data.start + " 至 " + M.data.end + "，对齐交易日"} width={960} />
              <Row name="训练 / 测试窗" value={M.windows.train + " / " + M.windows.test} note={"窗长 " + M.windows.C + " 天，最大间隔 " + M.data.maxGap.days + " 天"} width={960} />
              <Row name="注入" value={"10 + 10 段"} note={M.inject.truthPts + " 个点级真值，种子 " + M.inject.seed} width={960} />
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
            <K style={{ display: "block", marginTop: 14 }}>先看单高斯为什么只认「远」。</K>
          </div>
        </AbsoluteFill>
      </Pages>
    </Scene>
  );
};
