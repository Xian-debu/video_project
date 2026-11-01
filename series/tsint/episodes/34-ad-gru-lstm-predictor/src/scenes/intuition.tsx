import React from "react";
import { AbsoluteFill } from "remotion";
import { C, FONT, FT } from "../../design/tokens";
import { PAD, M, det, fmtF, pageAt, Pages, PairBar, LinePlot, Scene, SceneHead, Card, Row, Body, Formula, Num, K, Chip } from "../shared";

export const SIntuition: React.FC = () => {
  const at = [0, pageAt("intuition", 12), pageAt("intuition", 27)];
  const f1 = det("f1");
  const f5 = det("f5");
  const traj = M.demo.traj;
  return (
    <Scene id="intuition">
      <SceneHead id="intuition" />
      <Pages id="intuition" at={at}>
        {/* 页一：门是平滑的开关 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 296, width: 1020 }}>
            <Card label="两个极端，一根滑杆" accent={C.cyan}>
              <Row name="z → 0" value="几乎不更新" note="旧状态原样带下去" width={970} />
              <Row name="z → 1" value="几乎全换掉" note="新信息直接覆盖" width={970} />
              <Row name="中间" value="学出来的比例" note="要不要记、记多少，权重说了算" width={970} />
            </Card>
            <Body size={FT.body} color={C.inkDim} style={{ marginTop: 22, width: 1000 }}>
              卷积的记忆是硬的：感受野三十一天，多一天都接不上。循环的记忆是软的：状态一直在，记多少由门控权重决定。
            </Body>
          </div>
          <div style={{ position: "absolute", left: 1180, top: 296, width: 640 }}>
            <Card label="硬记忆 vs 软记忆" accent={C.violet}>
              <Row name="卷积" value="31 天" note="超过就看不见" width={590} />
              <Row name="GRU" value="1 个状态" note="权重决定记多久" width={590} />
              <Row name="代价" value="串行" note="一天一天算，慢" width={590} />
            </Card>
            <div style={{ marginTop: 18, display: "flex", gap: 12 }}>
              <Chip color={C.cyan}>平滑开关</Chip>
              <Chip color={C.violet}>软记忆</Chip>
            </div>
          </div>
        </AbsoluteFill>

        {/* 页二：手算一个状态 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 300, width: 1000 }}>
            <Card label="手算：z = 0.5，h̃ = 0.8，h = 0.2" accent={C.amber}>
              <div style={{ fontFamily: FONT.mono, fontSize: FT.h2, color: C.ink, lineHeight: 1.9 }}>
                <div>h′ = (1 − 0.5) × 0.2 + 0.5 × 0.8</div>
                <div>{"      = 0.1 + 0.4 = 0.5"}</div>
              </div>
              <Body size={FT.meta} color={C.inkFaint} style={{ marginTop: 16 }}>
                这个 0.5 就是屏幕上那个数。单元测试锁的就是它：门与候选按式(4.35)混合，误差小于 1e-12。
              </Body>
            </Card>
            <Card label="测试锁的三个不变量" accent={C.cyan} style={{ marginTop: 20 }}>
              <Row name="01" value="极端门控" note="z=0 时状态不变，z=1 时状态全换" width={950} />
              <Row name="02" value="手算样例" note="上面的 0.5，逐位相等" width={950} />
              <Row name="03" value="不塌缩" note="两百步内状态起伏不归零" width={950} />
            </Card>
          </div>
          <div style={{ position: "absolute", left: 1160, top: 300, width: 660 }}>
            <Card label="单元测试" accent={C.violet}>
              <Row name="套件" value={M.meta.tests.newSuites + " 套"} note={M.meta.tests.newAsserts + " 条断言"} width={610} />
              <Row name="GRU" value={(M.units[0] ? M.units[0].cases : 12) + " 例"} note={M.units[0] ? M.units[0].module : "GRU.hs"} width={610} />
              <Row name="LSTM" value={(M.units[1] ? M.units[1].cases : 12) + " 例"} note={M.units[1] ? M.units[1].module : "LSTMPred.hs"} width={610} />
            </Card>
            <Card label="演示轨迹" accent={C.amber} style={{ marginTop: 18 }}>
              <Row name="步数" value={String(M.demo.steps)} note="前两百步" width={610} />
              <Row name="max |h|" value={fmtF(M.demo.maxAbs, 4)} note={"起伏 " + fmtF(M.demo.spread, 4)} width={610} />
            </Card>
          </div>
        </AbsoluteFill>

        {/* 页三：稀释赛跑 + 轨迹 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 300, width: 980 }}>
            <PairBar
              a={{ label: "信噪比 F=1", value: f1.spikeMean / f1.tau, text: fmtF(f1.spikeMean / f1.tau, 2) + "×" }}
              b={{ label: "信噪比 F=5", value: f5.spikeMean / f5.tau, text: fmtF(f5.spikeMean / f5.tau, 2) + "×" }}
              width={920}
              height={150}
              at={at[2]}
            />
            <PairBar
              a={{ label: "干净均分 F=1", value: f1.cleanMean, text: fmtF(f1.cleanMean, 3) }}
              b={{ label: "干净均分 F=5", value: f5.cleanMean, text: fmtF(f5.cleanMean, 3) }}
              width={920}
              height={150}
              colorA={C.inkFaint}
              colorB={C.inkFaint}
              at={at[2] + 6}
            />
            <Body size={FT.body} color={C.inkDim} style={{ marginTop: 20, width: 940 }}>
              尖峰均值和阈值都被 1/F 摊薄，但倍率不同：一个缩 2.68 倍，一个只缩 1.73 倍。差出来的那部分，就是检出不掉的余量。
            </Body>
          </div>
          <div style={{ position: "absolute", left: 1120, top: 300, width: 700 }}>
            <Card label="隐状态轨迹 · 两百步" accent={C.cyan} pad={16}>
              <LinePlot
                series={[
                  { name: "h₁", color: C.cyan, values: traj.map((p) => p[0]) },
                  { name: "h₂", color: C.violet, values: traj.map((p) => p[1]) },
                ]}
                width={640}
                height={300}
                at={at[2] + 10}
                stretch={0.85}
                yFmt={(v) => fmtF(v, 1)}
                title={"loss " + fmtF(M.demo.loss, 4)}
              />
            </Card>
            <div style={{ marginTop: 14 }}>
              <K>门在动，状态也在动。不是退化的常数。</K>
            </div>
          </div>
        </AbsoluteFill>
      </Pages>
    </Scene>
  );
};
