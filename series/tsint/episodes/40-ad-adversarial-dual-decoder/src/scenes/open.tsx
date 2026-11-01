import React from "react";
import { AbsoluteFill } from "remotion";
import { C, FONT, FT } from "../../design/tokens";
import {
  PAD, M, md, modelKeys, modelColor, modelName, pagesOf, Pages, Scene, SceneHead,
  Card, Row, Body, Verdict, Chip, Stat, Formula, Strip, fmtInt,
} from "../shared";

export const SOpen: React.FC = () => {
  const at = pagesOf("open");
  return (
    <Scene id="open">
      <SceneHead id="open" />
      <Pages id="open" at={at}>
        {/* 页一：四个读数，三个方法 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 300, width: 880 }}>
            <div style={{ fontFamily: FONT.serif, fontSize: FT.display, color: C.ink, lineHeight: 1.18 }}>
              两个解码器，
              <br />
              一个说谎。
            </div>
            <Body style={{ marginTop: 26, width: 840 }}>
              上一集把两个经典统计判据做成基线，残差抓点、距离抓形。这一集换成神经网络：USAD 用两个解码器互相拉扯，DAGMM 在高斯混合里算能量，再加一个多 AE 中位数做集成。三个方法，同一个问题：训练上学到的正常，到测试段还算不算正常。
            </Body>
            <div style={{ display: "flex", gap: 14, marginTop: 30 }}>
              <Verdict ok label={M.meta.evidence.checks + " 项证据检查通过"} />
              <Chip color={C.violet}>新测试 {M.meta.newCases} 条 · 仓库 {fmtInt(M.meta.tests.assertions)} 条</Chip>
            </div>
          </div>
          <div style={{ position: "absolute", left: 1020, top: 292, width: 830, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
            {modelKeys.map((k) => {
              const v = md(k);
              return (
                <Card key={k} label={modelName[k]} accent={modelColor[k]} pad={18}>
                  <Stat
                    label="F1"
                    value={v.f1.toFixed(4)}
                    sub={"P " + v.p.toFixed(3) + " · R " + v.r.toFixed(3) + " · 参数 " + fmtInt(v.params)}
                    valueSize={40}
                    valueColor={modelColor[k]}
                  />
                </Card>
              );
            })}
          </div>
        </AbsoluteFill>

        {/* 页二：三个方法的公式 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 282, width: 1730, display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 22 }}>
            <Card label="USAD：两个解码器的对抗" accent={C.cyan} pad={24}>
              <Formula size={27} color={C.cyan}>
                L1 = (1/n)·||x − AE1(x)||<sup>2</sup>
                <br />
                {"     "}+ (1 − 1/n)·||x − AE2(x)||<sup>2</sup>
              </Formula>
              <Formula size={27} color={C.cyan} style={{ marginTop: 12 }}>
                L2 = (1/n)·||x − AE2(x)||<sup>2</sup>
                <br />
                {"     "}− (1 − 1/n)·||x − AE2(AE1(x))||<sup>2</sup>
              </Formula>
              <Body style={{ marginTop: 14, fontSize: FT.meta }}>n 是轮次不是样本数；分数 = α·s1 + β·s2，α = 1/3。</Body>
            </Card>
            <Card label="DAGMM：混合密度里的能量" accent={C.violet} pad={24}>
              <Formula size={32} color={C.violet}>
                E(z) = −log Σ<sub>k</sub> π<sub>k</sub> N(z | μ<sub>k</sub>, Σ<sub>k</sub>)
              </Formula>
              <Body style={{ marginTop: 16, fontSize: FT.meta }}>
                z 是「潜变量 + 重建误差 + 余弦相似度」拼起来的增广向量。能量越高越异常。
              </Body>
            </Card>
            <Card label="集成：五个 AE 的中位数" accent={C.amber} pad={24}>
              <Formula size={32} color={C.amber}>
                s(x) = median<sub>i=1..5</sub> s<sub>i</sub>(x)
              </Formula>
              <Body style={{ marginTop: 16, fontSize: FT.meta }}>
                五个随机初始化的单 AE，各算一个重建误差，取中位数。中位数对一两个坏成员不敏感。
              </Body>
            </Card>
          </div>
          <div style={{ position: "absolute", left: PAD, top: 800, width: 1730 }}>
            <Row name="出处" value="第 4.5 节 · p.94–97" note="三个公式都不是书里的原式；书里只有名字和一段直觉，编号与推导由本集补上，标「非书中」。" />
            <Row name="本集主题" value="对抗 · 密度 · 集成" note="三种神经网络异常检测方式，四个读数（含单 AE 基线）。" />
          </div>
        </AbsoluteFill>

        {/* 页三：数据与真值 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 286, width: 940 }}>
            <Body size={FT.body}>
              两只白酒股，日频，复权收盘。训练到二〇一八年底，验证两年，测试从二〇二一年起。真值按窗口算：尖峰段只标段内，漂移段从起点往后铺二十天。
            </Body>
            <div style={{ display: "flex", gap: 18, marginTop: 24 }}>
              <Stat label="样本" value={fmtInt(M.data.rows) + " 行"} sub={M.data.start + " 至 " + M.data.end} style={{ width: 280 }} />
              <Stat label="训练 / 验证 / 测试" value={fmtInt(M.data.fit) + " / " + M.data.val + " / " + fmtInt(M.data.test)} sub={"测试窗 " + fmtInt(M.windows.test)} accent={C.violet} style={{ width: 400 }} valueSize={34} />
              <Stat label="真值窗" value={M.inject.truthPoints + " 个"} sub={"占测试 " + M.inject.truthPct.toFixed(1) + "%"} accent={C.coral} style={{ width: 230 }} />
            </div>
            <div style={{ marginTop: 48, fontFamily: FONT.sans, fontSize: FT.meta, color: C.inkFaint }}>
              红色刻度：注入的真值窗口。尖峰 {M.inject.spikeSegments} 段、漂移 {M.inject.driftSegments} 段。
            </div>
            <div style={{ marginTop: 12 }}>
              <Strip idx={M.series.truthIdx} total={M.series.usad.length} width={1500} height={22} color={C.coral} />
            </div>
          </div>
          <div style={{ position: "absolute", left: 1300, top: 286, width: 560 }}>
            <Card label="先说结论" accent={C.coral} pad={22}>
              <Stat label="四个模型的 F1" value="0.24 / 0.24 / 0.06 / 0.22" sub="USAD / DAGMM / 多 AE / 单 AE。都不高，且失败方式各不相同。" valueSize={30} valueColor={C.coral} />
            </Card>
            <div style={{ marginTop: 18, fontFamily: FONT.sans, fontSize: FT.body, color: C.inkDim, lineHeight: 1.6 }}>
              这一集不挑一个赢家，只把四个读数摆齐，看每个方法在哪一步掉下去。
            </div>
          </div>
        </AbsoluteFill>
      </Pages>
    </Scene>
  );
};
