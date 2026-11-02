import React from "react";
import { AbsoluteFill } from "remotion";
import { C, FONT, FT } from "../../design/tokens";
import {
  PAD, M, pagesOf, Pages, Scene, SceneHead, Card, Body, Chip, Stat, Row, Verdict,
  GainBar, CheckGrid, fmt4, fmtInt,
} from "../shared";

export const SBoundary: React.FC = () => {
  const at = pagesOf("boundary");
  return (
    <Scene id="boundary">
      <SceneHead id="boundary" />
      <Pages id="boundary" at={at}>
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 292, width: 780 }}>
            <div style={{ fontFamily: FONT.serif, fontSize: FT.h1, color: C.ink, lineHeight: 1.2 }}>
              收益序列里，
              <br />
              没有稳定的局部形状。
            </div>
            <Body style={{ marginTop: 20, width: 750 }}>
              为什么 shapelet 在收益窗上失效？因为日收益接近白噪声，一百点里没有周期。模板截出来的只是一段噪声，换一条序列就变样。所以增益只有零点三九八三。
            </Body>
            <div style={{ marginTop: 22, display: "flex", gap: 12 }}>
              <Chip color={C.coral}>真实增益 0.3983 bit</Chip>
              <Chip color={C.inkDim}>合成 0.8475 bit</Chip>
            </div>
          </div>
          <div style={{ position: "absolute", left: 900, top: 292, width: 940 }}>
            <Card label="均值差是真的，形状差是假的" accent={C.coral} pad={20}>
              <Body>
                行业之间确实有均值差：F 显著，H 也显著。但均值差不是形状差。形状方法要的是可重复的片段，不是一次性的水平偏移。
              </Body>
              <div style={{ marginTop: 16 }}>
                <Row name="ANOVA F" value={fmt4(M.real.anova.f)} note={"p = " + fmt4(M.real.anova.p)} width={860} color={C.cyan} />
                <Row name="Kruskal H" value={fmt4(M.real.kruskal.h)} note={"p = " + fmt4(M.real.kruskal.p)} width={860} color={C.violet} />
                <Row name="阈值分类精确率" value={fmt4(M.real.split.precision, 2)} note="显著不等于可分" width={860} color={C.coral} />
              </div>
            </Card>
          </div>
        </AbsoluteFill>

        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 292, width: 760 }}>
            <div style={{ fontFamily: FONT.serif, fontSize: FT.h1, color: C.ink, lineHeight: 1.2 }}>
              上界不是实测，
              <br />
              不能混着报。
            </div>
            <Body style={{ marginTop: 20, width: 730 }}>
              三分类一对其余的上界是零点九一八三 bit，两类平衡的上界才是一点零。本集实测零点八四七五和零点八九三八。计划里写的一点零 bit 附近，要拆开说成两件事：上界是多少，实测是多少。
            </Body>
            <div style={{ marginTop: 20 }}>
              <Card label="计划 vs 本集口径" accent={C.amber} pad={18}>
                <Row name="计划原文" value="最优 1.0 bit 附近" note="把两类上界当成了三分类目标" width={700} color={C.coral} />
                <Row name="本集" value="0.8475 / 0.9183" note="实测 / 三分类上界" width={700} color={C.cyan} />
                <Row name="两类对照" value="0.8938 / 1.0" note="实测 / 两类上界" width={700} color={C.violet} />
              </Card>
            </div>
          </div>
          <div style={{ position: "absolute", left: 880, top: 300, width: 960 }}>
            <Card label="两个上界，两个实测" accent={C.amber} pad={22}>
              <GainBar
                width={900}
                max={1.02}
                labelW={300}
                items={[
                  { label: "三分类上界", value: 0.9183, color: C.inkDim, note: "一对其余" },
                  { label: "三分类实测", value: 0.8475, color: C.cyan, note: "差 0.0708" },
                  { label: "两类上界", value: 1.0, color: C.inkDim, note: "平衡" },
                  { label: "两类实测", value: 0.8938, color: C.violet, note: "差 0.1062" },
                ]}
              />
            </Card>
          </div>
        </AbsoluteFill>

        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 292, width: 780 }}>
            <div style={{ fontFamily: FONT.serif, fontSize: FT.h1, color: C.ink, lineHeight: 1.2 }}>
              反向 shapelet
              <br />
              不是 bug。
            </div>
            <Body style={{ marginTop: 20, width: 750 }}>
              反向是定义的一部分：增益对方向对称，距离大也可以判为这一类。但分类器必须知道方向。本集的分类器只用同类模板，所以反向模板没有参与预测。这是一个可以改进的地方。
            </Body>
            <div style={{ marginTop: 22, display: "flex", gap: 12 }}>
              <Chip color={C.amber}>Top-5 全部反向</Chip>
              <Chip color={C.coral}>但未进分类器</Chip>
            </div>
          </div>
          <div style={{ position: "absolute", left: 900, top: 292, width: 940 }}>
            <Card label="本集分类器的实际构成" accent={C.violet} pad={20}>
              <Row name="模板来源" value="每类一条同类模板" note="hitClass = 序列标签" width={860} color={C.cyan} />
              <Row name="反向模板" value="未参与预测" note="Top-5 的 class 2 模板" width={860} color={C.coral} />
              <Row name="下一集的改进" value="可微的 min" note="SoftMin 让梯度穿过搜索" width={860} color={C.violet} />
            </Card>
          </div>
        </AbsoluteFill>

        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 292, width: 760 }}>
            <div style={{ fontFamily: FONT.serif, fontSize: FT.h1, color: C.ink, lineHeight: 1.2 }}>
              拐点可能漏掉
              <br />
              真正的最优起点。
            </div>
            <Body style={{ marginTop: 20, width: 730 }}>
              十个拐点可能漏掉真正的最优起点。合成数据上没漏，不代表真实数据不漏。本集没有做漏检率的实验。这是未验证的部分，要写清楚，不能当成已验证的结论。
            </Body>
            <div style={{ marginTop: 22 }}>
              <Card label="未验证清单" accent={C.coral} pad={18}>
                <Row name="漏检率" value="未测" note="PIPs 起点错过最优的频率" width={700} color={C.coral} />
                <Row name="长度选择" value="只试 8 / 12 / 20" note="没有连续搜索" width={700} color={C.inkDim} />
                <Row name="真实数据模板" value="4.68 s 全搜索" note="未做 PIPs 对照" width={700} color={C.inkDim} />
              </Card>
            </div>
          </div>
          <div style={{ position: "absolute", left: 900, top: 300, width: 940 }}>
            <Card label="PIPs 的十个点" accent={C.amber} pad={18}>
              <div style={{ fontFamily: FONT.mono, fontSize: FT.body, color: C.inkDim, lineHeight: 1.9 }}>
                [0, 5, 9, 13, 17, 29, 33, 38, 42, 99]
              </div>
              <Body style={{ marginTop: 10 }}>
                这条序列的最优起点是 8，不在集合里。同分模板出现在别的起点，掩盖了这一次错过。
              </Body>
            </Card>
          </div>
        </AbsoluteFill>

        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 292, width: 780 }}>
            <div style={{ fontFamily: FONT.serif, fontSize: FT.h1, color: C.ink, lineHeight: 1.2 }}>
              计划写沪深三百，
              <br />
              实际是全市场同门类。
            </div>
            <Body style={{ marginTop: 20, width: 750 }}>
              计划里写沪深三百 150 只、2018–2024；三百内凑不齐这些行业各 50 只，改全市场同门类各 50 只、2018–2025。偏差记在 manifest 和 dist 里，也写进这一页的中线字幕。不悄悄改口径。
            </Body>
            <div style={{ marginTop: 22 }}>
              <Card label="偏差登记" accent={C.coral} pad={18}>
                <Row name="样本" value="150 只 · 三组各 50" note="全市场同门类" width={700} color={C.cyan} />
                <Row name="区间" value="2018-01-02 – 2025-12-31" note="计划写 2018–2024" width={700} color={C.amber} />
                <Row name="面板" value="1,942 行 × 150 列" note={"sha256 " + M.dataset.csvSha256.slice(0, 8)} width={700} color={C.inkDim} />
              </Card>
            </div>
          </div>
          <div style={{ position: "absolute", left: 900, top: 300, width: 940 }}>
            <Card label="镜头里也要说清" accent={C.violet} pad={20}>
              <Body>
                计划与实测的每一条不一致，都同时出现在三个地方：manifest 的 deviation、dist.json 的 meta.deviations、这一页的画面。三处对不上，就不算讲清楚。
              </Body>
            </Card>
          </div>
        </AbsoluteFill>

        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 292, width: 800 }}>
            <div style={{ fontFamily: FONT.serif, fontSize: FT.h1, color: C.ink, lineHeight: 1.2 }}>
              证据全过，
              <br />
              下一集换个方向。
            </div>
            <Body style={{ marginTop: 20, width: 770 }}>
              证据：二十三组检查全过，三十六点八秒。测试：三个模块四十四条新断言。下一集，把这个 min 换成 SoftMin，让 shapelet 可以求导。
            </Body>
            <div style={{ marginTop: 22, display: "flex", gap: 12 }}>
              <Verdict ok label="23 / 23" />
              <Chip color={C.cyan}>44 条新断言</Chip>
              <Chip color={C.violet}>36.8 s</Chip>
            </div>
          </div>
          <div style={{ position: "absolute", left: 920, top: 292, width: 920 }}>
            <Card label="二十三项检查的分组" accent={C.cyan} pad={20}>
              <CheckGrid width={860} />
            </Card>
          </div>
        </AbsoluteFill>
      </Pages>
    </Scene>
  );
};
