import React from "react";
import { AbsoluteFill } from "remotion";
import { C, FONT, FT } from "../../design/tokens";
import {
  PAD, M, md, modelColor, pagesOf, Pages, Scene, SceneHead, ModelKey,
  Card, Row, Body, Verdict, Chip, Stat, Formula, Strip, fmtInt,
} from "../shared";

export const SOpen: React.FC = () => {
  const at = pagesOf("open");
  const pairs: Array<[ModelKey, ModelKey, string, string]> = [
    ["sbt", "attn", "二值稀疏 + Step-T 因果", "稠密注意力"],
    ["tvae", "gauss", "Student-t 重尾先验", "高斯 VAE"],
    ["dcd", "patchAe", "双注意力对比", "单视图 patch-AE"],
  ];
  return (
    <Scene id="open">
      <SceneHead id="open" />
      <Pages id="open" at={at}>
        {/* 页一：换掉一个假设 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 296, width: 900 }}>
            <div style={{ fontFamily: FONT.serif, fontSize: FT.display, color: C.ink, lineHeight: 1.18 }}>
              换掉一个
              <br />
              假设。
            </div>
            <Body style={{ marginTop: 26, width: 860 }}>
              上一集的四个神经网络判据都没到零点二五。这一集不换更多的层，换三个没人写下来的假设：注意力必须稠密、重构误差服从高斯、一个视图就够。每个方法配一个同结构基线，只换掉那一个假设。
            </Body>
            <div style={{ display: "flex", gap: 14, marginTop: 30 }}>
              <Verdict ok label={M.meta.evidence.passed + " / " + M.meta.evidence.checks + " 项证据检查通过"} />
              <Chip color={C.violet}>新测试 {M.meta.newCases} 条 · 仓库 {fmtInt(M.meta.tests.assertions)} 条</Chip>
            </div>
          </div>
          <div style={{ position: "absolute", left: 1040, top: 300, width: 810, display: "grid", gridTemplateColumns: "1fr", gap: 16 }}>
            {pairs.map(([k, b, claim, base]) => {
              const v = md(k);
              const w = md(b);
              const win = v.f1 > w.f1 + 0.01;
              return (
                <Card key={k} label={claim} accent={modelColor[k]} pad={18}>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 18, marginTop: 6 }}>
                    <div style={{ fontFamily: FONT.mono, fontSize: 38, color: modelColor[k] }}>{v.f1.toFixed(3)}</div>
                    <div style={{ fontFamily: FONT.mono, fontSize: 22, color: C.inkDim }}>vs {w.f1.toFixed(3)}</div>
                    <div style={{ fontFamily: FONT.sans, fontSize: FT.meta, color: win ? C.coral : C.inkDim }}>
                      {win ? "赢" : "打平"} · 基线 {base}
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </AbsoluteFill>

        {/* 页二：数据与真值 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 282, width: 970 }}>
            <Body style={{ width: 940 }}>
              一只票、一段日线、一段五分钟线。日线做三个方法的主读数，五分钟线只给 DCdetector 做一次形状替换的独立演示。真值按窗口末尾算，三种注入窗口互不重叠。
            </Body>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 18, marginTop: 26 }}>
              <Stat label="日线" value={fmtInt(M.data.dailyRows)} sub={M.data.start + " 至 " + M.data.end} valueColor={C.cyan} />
              <Stat label="训练 / 验证 / 测试" value={fmtInt(M.windows.fit) + " / " + fmtInt(M.windows.val) + " / " + fmtInt(M.windows.test)} sub="窗口 100 天，滑动一格" valueSize={26} />
              <Stat label="真值窗口" value={fmtInt(M.inject.truth)} sub={"占测试 " + (M.inject.truthShare * 100).toFixed(1) + "%"} valueColor={C.coral} />
            </div>
            <div style={{ marginTop: 26 }}>
              <div style={{ fontFamily: FONT.sans, fontSize: FT.meta, color: C.inkFaint, marginBottom: 8 }}>红色刻度：注入的真值窗口。尖峰 8 段、形态 4 段、相位 4 段。</div>
              <Strip idx={M.series.truthIdx} width={940} height={26} total={M.windows.test} />
            </div>
            <Row name="五分钟线" value={fmtInt(M.data.minuteRows) + " 根"} note="2026-05-26 至 2026-10-27，patch 长 16" />
          </div>
          <div style={{ position: "absolute", left: 1120, top: 288, width: 730 }}>
            <Card label="先说结论" accent={C.coral} pad={22}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 12 }}>
                {pairs.map(([k, b]) => (
                  <div key={k} style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                    <span style={{ fontFamily: FONT.sans, fontSize: FT.body, color: C.ink }}>{md(k).name}</span>
                    <span style={{ fontFamily: FONT.mono, fontSize: 26, color: modelColor[k] }}>{md(k).f1.toFixed(3)}</span>
                  </div>
                ))}
              </div>
              <Body style={{ marginTop: 14, fontSize: FT.meta, color: C.inkDim }}>
                两个赢，一个打平。赢的两个，验证段都没领先：这一集的结论不在「谁最好」，在「增益出现在哪一段」。
              </Body>
            </Card>
          </div>
        </AbsoluteFill>
      </Pages>
    </Scene>
  );
};
