import React from "react";
import { AbsoluteFill } from "remotion";
import { C, FONT, FT } from "../../design/tokens";
import { PAD, CW, M, det, fmtF, fmtP, fmtInt, pctOf, pageAt, Pages, Scene, SceneHead, Card, Row, Body, Formula, Chip, Num, K } from "../shared";

const Window: React.FC<{ title: string; accent: string; hist: number; fut: number; scoreFuture: boolean }> = ({ title, accent, hist, fut, scoreFuture }) => {
  const hasFuture = fut > 0;
  return (
  <Card label={title} accent={accent} style={{ width: 470 }}>
    <div style={{ display: "flex", alignItems: "flex-end", gap: 6, height: 76 }}>
      {Array.from({ length: 10 }).map((_, i) => (
        <div key={i} style={{ width: 34, height: 26 + ((i * 7) % 22), background: C.panelLine, border: "1px solid #26374A", borderRadius: 3 }} />
      ))}
      <div style={{ fontFamily: FONT.mono, fontSize: FT.micro, color: C.inkFaint, margin: "0 4px 2px" }}>{hist} 天</div>
      {hasFuture ? Array.from({ length: 4 }).map((_, i) => (
        <div key={"f" + i} style={{ width: 26, height: 22 + ((i * 5) % 14), background: scoreFuture ? accent : C.panelLine, opacity: scoreFuture ? 0.75 : 1, border: "1px solid #26374A", borderRadius: 3 }} />
      )) : (
        <div style={{ fontFamily: FONT.mono, fontSize: FT.micro, color: C.inkFaint, margin: "0 4px 2px" }}>整窗一起还原</div>
      )}
      {hasFuture ? <div style={{ fontFamily: FONT.mono, fontSize: FT.micro, color: C.inkFaint, margin: "0 2px 2px" }}>{fut}</div> : null}
    </div>
    <Body size={FT.meta} color={C.inkFaint} style={{ marginTop: 12 }}>
      {scoreFuture ? "分数只算后面这几格的平方误差" : "分数算窗口里每一格"}
    </Body>
  </Card>
  );
};

export const SProblem: React.FC = () => {
  const at = [0, pageAt("problem", 12), pageAt("problem", 28)];
  const f1 = det("f1");
  const f5 = det("f5");
  const trainN = M.windows.trainF1;
  const testN = M.windows.testF1;
  return (
    <Scene id="problem">
      <SceneHead id="problem" />
      <Pages id="problem" at={at}>
        {/* 页一：重构 vs 预测 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 296, width: 1720 }}>
            <Body size={FT.body} style={{ marginBottom: 24, width: 1500 }}>
              前面几集做重构：给一个窗口，把整窗还原，误差大的位置是异常。这一集做预测：拿前一百天当历史，预测后面 F 天，分数只算未来那一段。
            </Body>
            <div style={{ display: "flex", gap: 24 }}>
              <Window title="重构 · 第 33 集" accent={C.inkFaint} hist={100} fut={0} scoreFuture={false} />
              <Window title="预测 · 这一集" accent={C.cyan} hist={100} fut={5} scoreFuture />
              <Card label="书上的式子" accent={C.violet} style={{ width: 700 }}>
                <Formula size={54} note="式(4.14) 与 式(4.33)：历史窗 H，未来窗 F，分数除以 F">
                  {"s(x) = (1/F) · Σ (xᵢ − x̂ᵢ)²"}
                </Formula>
              </Card>
            </div>
          </div>
        </AbsoluteFill>

        {/* 页二：阈值从哪里来 —— 两个会一起动的量 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 300, width: 1020 }}>
            <Card label="分数只算未来，阈值只用训练段" accent={C.cyan}>
              <Row name="训练段" value={fmtInt(trainN) + " 个窗口"} note="2010-01-05 .. 2020-12-31" width={970} />
              <Row name="测试段" value={fmtInt(testN) + " 个窗口"} note="2021-01-04 .. 2026-06-30" width={970} />
              <Row name="阈值" value={fmtF(f1.tau, 4)} note={"训练段干净窗口分数的 " + fmtP(M.params.quantile) + " 分位"} width={970} />
              <Row name="F=5 的阈值" value={fmtF(f5.tau, 4)} note="同一个分位，换一个 F" width={970} />
            </Card>
            <Body size={FT.body} color={C.inkDim} style={{ marginTop: 22, width: 1000 }}>
              信号里含注入，阈值只含干净窗口。两者被同一个 1/F 摊薄，但摊薄的倍率不一定一样 —— 这才是本集要量的东西。
            </Body>
          </div>
          <div style={{ position: "absolute", left: 1180, top: 300, width: 640 }}>
            <Card label="三个判据" accent={C.amber}>
              <Row name="01" value="F1：F=1 vs F=5" note="计划书只看这个" width={590} />
              <Row name="02" value="MAE / σ" note="一步预测的误差尺度" width={590} />
              <Row name="03" value="单点检出率" note="F=5 下的 1 点与 3 点" width={590} />
            </Card>
            <Card label="共同的盲区" accent={C.coral} style={{ marginTop: 18 }}>
              <Body size={FT.body} color={C.ink}>相位注入：形状变了，幅度没变。</Body>
            </Card>
          </div>
        </AbsoluteFill>

        {/* 页三：口径先行 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 300, width: 1020 }}>
            <Card label="数据口径先定死" accent={C.violet}>
              <Row name="切分" value="训练 2010–2020" note="测试 2021–2026，只读" width={970} />
              <Row name="标准化" value="只用训练段" note="均值方差都不看测试" width={970} />
              <Row name="阈值" value="只用训练段" note="测试段绝不回填" width={970} />
              <Row name="窗口" value="不跨切分边界" note="未来窗也不越界" width={970} />
              <Row name="注入" value="只落测试窗" note={"seed " + M.inject.seed + " · " + M.inject.truthLevel} width={970} />
            </Card>
          </div>
          <div style={{ position: "absolute", left: 1180, top: 300, width: 640 }}>
            <Card label="量什么" accent={C.cyan}>
              <Row name="尖峰" value={M.inject.spike.span} note={M.inject.spike.amp} width={590} />
              <Row name="相位" value={M.inject.phase.lag} note={M.inject.phase.how} width={590} />
              <Row name="个数" value={M.inject.count + " + " + M.inject.count} note={"占测试窗 " + pctOf(M.inject.rate)} width={590} />
            </Card>
            <div style={{ marginTop: 22, display: "flex", gap: 12 }}>
              <Chip color={C.cyan}>单点</Chip>
              <Chip color={C.amber}>三点</Chip>
              <Chip color={C.coral}>相位平移</Chip>
            </div>
          </div>
        </AbsoluteFill>
      </Pages>
    </Scene>
  );
};
