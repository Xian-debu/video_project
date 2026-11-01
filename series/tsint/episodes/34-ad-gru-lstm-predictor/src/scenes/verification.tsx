import React from "react";
import { AbsoluteFill } from "remotion";
import { C, FONT, FT } from "../../design/tokens";
import {
  PAD, M, det, prOf, fmtF, fmtP, fmtInt, pctOf, pageAt, Pages, Scene, SceneHead, Stat, Card, Row, Body, Verdict, PairBar, PRPlot, Bars, K, Chip, Num,
} from "../shared";

export const SVerification: React.FC = () => {
  const at = [0, pageAt("verification", 14), pageAt("verification", 34), pageAt("verification", 56), pageAt("verification", 84), pageAt("verification", 96)];
  const f1 = det("f1");
  const f5 = det("f5");
  const lm = det("lstm");
  const spikeShrink = f1.spikeMean / f5.spikeMean;
  const tauShrink = f1.tau / f5.tau;
  const margin1 = f1.spikeMean / f1.tau;
  const margin5 = f5.spikeMean / f5.tau;
  return (
    <Scene id="verification">
      <SceneHead id="verification" />
      <Pages id="verification" at={at}>
        {/* 页一：数据与口径 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 296, width: 1020 }}>
            <Card label="先看数据：三万九千多根日线" accent={C.cyan}>
              <Row name="样本" value={fmtInt(M.data.rows) + " 行"} note={M.data.start + " .. " + M.data.end} width={970} />
              <Row name="收益" value={fmtInt(M.data.returns) + " 个"} note="收盘价差分，丢第一天" width={970} />
              <Row name="缺口" value={M.data.maxGap.days + " 天"} note={"最大一处 " + M.data.maxGap.at} width={970} />
              <Row name="训练窗" value={fmtInt(M.windows.trainF1) + " 个"} note={"F=1；F=5 是 " + fmtInt(M.windows.trainF5)} width={970} />
              <Row name="测试窗" value={fmtInt(M.windows.testF1) + " 个"} note={"F=1；F=5 是 " + fmtInt(M.windows.testF5)} width={970} />
            </Card>
            <Body size={FT.meta} color={C.inkFaint} style={{ marginTop: 16, width: 960 }}>
              指纹 {M.data.sha}，同一份 CSV 在数据仓库里复现得到。注入只落测试窗，训练段是干净的。
            </Body>
          </div>
          <div style={{ position: "absolute", left: 1180, top: 296, width: 640 }}>
            <Card label="注入清单" accent={C.violet}>
              <Row name="尖峰" value={String(M.inject.count) + " 处"} note={M.inject.spike.amp + " · " + M.inject.spike.span} width={590} />
              <Row name="相位" value={String(M.inject.count) + " 处"} note={M.inject.phase.lag + " · " + M.inject.phase.how} width={590} />
              <Row name="占比" value={pctOf(M.inject.rate)} note={"seed " + M.inject.seed} width={590} />
              <Row name="真值" value={M.inject.truthLevel} note="只改未来窗" width={590} />
            </Card>
            <div style={{ marginTop: 18, display: "flex", gap: 12 }}>
              <Chip color={C.cyan}>F = 1</Chip>
              <Chip color={C.amber}>F = 5</Chip>
              <Chip color={C.violet}>LSTM</Chip>
            </div>
          </div>
        </AbsoluteFill>

        {/* 页二：F=1 读数 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 292, width: 700 }}>
            <Stat label="GRU · F = 1" value={fmtF(f1.f1, 4)} sub={"阈值 " + fmtF(f1.tau, 4) + " · 测试窗 " + fmtInt(f1.testCount)} accent={C.cyan} />
            <div style={{ marginTop: 18 }}>
              <Card label="检测读数" accent={C.cyan}>
                <Row name="尖峰 F1" value={fmtF(f1.spikeF1, 4)} note="只看尖峰窗" width={650} />
                <Row name="相位 F1" value={fmtF(f1.phaseF1, 4)} note="形状变了，幅度没变" width={650} />
                <Row name="平均精度" value={fmtF(f1.ap, 4)} note="PR 曲线下面积" width={650} />
                <Row name="报警率" value={fmtP(f1.alertRatePct / 100)} note="测试窗里报出来的比例" width={650} />
                <Row name="尖峰命中" value={fmtP(f1.spikeHit)} note={"相位命中 " + fmtP(f1.phaseHit)} width={650} />
              </Card>
            </div>
          </div>
          <div style={{ position: "absolute", left: 960, top: 292, width: 880 }}>
            <Card label="精度—召回 · F = 1" accent={C.cyan} pad={16}>
              <PRPlot
                width={820}
                height={520}
                series={[{ name: "GRU · F=1", color: C.cyan, pts: prOf(M.curves.f1) }]}
                op={[{ r: f1.spikeF1, p: 1, color: C.cyan, label: "SPIKE" }]}
                at={at[1]}
                title={"tau = " + fmtF(f1.tau, 4)}
              />
            </Card>
          </div>
        </AbsoluteFill>

        {/* 页三：F=5 读数 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 292, width: 700 }}>
            <Stat label="GRU · F = 5" value={fmtF(f5.f1, 4)} sub={"阈值 " + fmtF(f5.tau, 4) + " · 测试窗 " + fmtInt(f5.testCount)} accent={C.amber} />
            <div style={{ marginTop: 18 }}>
              <Card label="检测读数" accent={C.amber}>
                <Row name="尖峰 F1" value={fmtF(f5.spikeF1, 4)} note="比 F=1 还高一点" width={650} />
                <Row name="相位 F1" value={fmtF(f5.phaseF1, 4)} note="同样是零" width={650} />
                <Row name="平均精度" value={fmtF(f5.ap, 4)} note="略低于 F=1" width={650} />
                <Row name="报警率" value={fmtP(f5.alertRatePct / 100)} note="跟 F=1 差不多" width={650} />
                <Row name="尖峰命中" value={fmtP(f5.spikeHit)} note={"相位命中 " + fmtP(f5.phaseHit)} width={650} />
              </Card>
            </div>
          </div>
          <div style={{ position: "absolute", left: 960, top: 292, width: 880 }}>
            <Card label="精度—召回 · F = 5" accent={C.amber} pad={16}>
              <PRPlot
                width={820}
                height={520}
                series={[{ name: "GRU · F=5", color: C.amber, pts: prOf(M.curves.f5) }]}
                op={[{ r: f5.spikeF1, p: 1, color: C.amber, label: "SPIKE" }]}
                at={at[2]}
                title={"tau = " + fmtF(f5.tau, 4)}
              />
            </Card>
          </div>
        </AbsoluteFill>

        {/* 页四：稀释是真的，判据是假的 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 292, width: 980 }}>
            <PairBar
              a={{ label: "尖峰均分 F=1", value: f1.spikeMean, text: fmtF(f1.spikeMean, 1) }}
              b={{ label: "尖峰均分 F=5", value: f5.spikeMean, text: fmtF(f5.spikeMean, 1) }}
              width={920}
              height={140}
              at={at[3]}
            />
            <PairBar
              a={{ label: "阈值 F=1", value: f1.tau, text: fmtF(f1.tau, 2) }}
              b={{ label: "阈值 F=5", value: f5.tau, text: fmtF(f5.tau, 2) }}
              width={920}
              height={140}
              colorA={C.inkFaint}
              colorB={C.inkFaint}
              at={at[3] + 8}
            />
            <Body size={FT.body} color={C.inkDim} style={{ marginTop: 18, width: 940 }}>
              分数缩了 {fmtF(spikeShrink, 2)} 倍，阈值只缩了 {fmtF(tauShrink, 2)} 倍。两者赛跑，信号没跑输：单点一样抓得住。
            </Body>
          </div>
          <div style={{ position: "absolute", left: 1120, top: 292, width: 700 }}>
            <Card label="单点检出 · 尖峰只有一点宽" accent={C.cyan}>
              <Row name="F=1" value={f1.spike1.n + " / " + f1.spike1.hit} note={fmtP(f1.spike1.rate) + " 命中"} width={650} />
              <Row name="F=5 · 一点" value={f5.spike1.n + " / " + f5.spike1.hit} note={fmtP(f5.spike1.rate) + " 命中"} width={650} />
              <Row name="F=5 · 三点" value={f5.spike3.n + " / " + f5.spike3.hit} note={f5.spike3.n > 0 ? fmtP(f5.spike3.rate) + " 命中" : "这一轮没有三点注入"} width={650} />
            </Card>
            <div style={{ marginTop: 18 }}>
              <Verdict ok={false} label={"计划：F=5 的 F1 会更低"} />
            </div>
            <div style={{ marginTop: 14 }}>
              <K>实测 {fmtF(f5.f1, 4)} 比 {fmtF(f1.f1, 4)} 还高：稀释真实发生，但判据用错了。</K>
            </div>
          </div>
        </AbsoluteFill>

        {/* 页五：三条 PR 曲线 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 296, width: 900 }}>
            <Card label="精度—召回 · 三个读数叠在一起" accent={C.violet} pad={16}>
              <PRPlot
                width={840}
                height={500}
                series={[
                  { name: "GRU F=1", color: C.cyan, pts: prOf(M.curves.f1) },
                  { name: "GRU F=5", color: C.amber, pts: prOf(M.curves.f5), dash: true },
                  { name: "LSTM F=1", color: C.violet, pts: prOf(M.curves.lstm), dash: true },
                ]}
                at={at[4]}
                title="三条曲线几乎重合"
              />
            </Card>
          </div>
          <div style={{ position: "absolute", left: 1060, top: 296, width: 760 }}>
            <Card label="平均精度" accent={C.cyan}>
              <Row name="GRU F=1" value={fmtF(f1.ap, 4)} note="三个里最高" width={710} />
              <Row name="GRU F=5" value={fmtF(f5.ap, 4)} note="差千分之二" width={710} />
              <Row name="LSTM" value={fmtF(lm.ap, 4)} note="换个单元，同一个水平" width={710} />
            </Card>
            <Body size={FT.body} color={C.inkDim} style={{ marginTop: 20, width: 740 }}>
              三条曲线几乎重合，说明排序能力没被 F 改变。变的只是分数的绝对尺度 —— 这正是稀释。
            </Body>
            <div style={{ marginTop: 16, display: "flex", gap: 12 }}>
              <Chip color={C.cyan}>AP 0.52</Chip>
              <Chip color={C.amber}>F 不改排序</Chip>
            </div>
          </div>
        </AbsoluteFill>

        {/* 页六：相位盲区 + 全过 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 292, width: 1020 }}>
            <Card label="共同的盲区：相位注入" accent={C.coral}>
              <Row name="相位 F1" value={fmtF(f1.phaseF1, 4) + " / " + fmtF(f5.phaseF1, 4)} note="GRU 的 F=1 与 F=5" width={970} />
              <Row name="相位均分" value={fmtF(f1.phaseMean, 4)} note={"干净窗口是 " + fmtF(f1.cleanMean, 4)} width={970} />
              <Row name="原因" value="形状变了，幅度没变" note="预测误差只认幅度" width={970} />
            </Card>
            <Body size={FT.body} color={C.inkDim} style={{ marginTop: 18, width: 980 }}>
              这个盲区不是 GRU 的问题：LSTM 同样零命中。只要用平方误差当分数，相位平移就看不见。
            </Body>
          </div>
          <div style={{ position: "absolute", left: 1160, top: 292, width: 660 }}>
            <Card label="LSTM · F=1" accent={C.violet}>
              <Row name="F1" value={fmtF(lm.f1, 4)} note={"阈值 " + fmtF(lm.tau, 4)} width={610} />
              <Row name="尖峰均分" value={fmtF(lm.spikeMean, 3)} note={"干净 " + fmtF(lm.cleanMean, 3)} width={610} />
              <Row name="相位 F1" value={fmtF(lm.phaseF1, 4)} note="一样零" width={610} />
            </Card>
            <Card label="三十项检查" accent={C.cyan} style={{ marginTop: 18 }}>
              <Bars
                items={M.groups.map((g2, i) => ({ label: g2.label, value: g2.n, text: g2.n + " 项", color: i % 2 === 0 ? C.cyan : C.violet }))}
                width={610}
                rowH={44}
                at={at[5]}
                max={Math.max(...M.groups.map((g2) => g2.n))}
              />
            </Card>
          </div>
        </AbsoluteFill>
      </Pages>
    </Scene>
  );
};
