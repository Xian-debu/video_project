import React from "react";
import { AbsoluteFill } from "remotion";
import { C, FONT, FT } from "../../design/tokens";
import { PAD, M, det, fmtF, fmtInt, fmtP, pctOf, pageAt, Pages, PairBar, Scene, SceneHead, Card, Row, Body, Verdict, Chip, Num } from "../shared";

export const SOpen: React.FC = () => {
  const at = [0, pageAt("open", 10), pageAt("open", 22), pageAt("open", 35)];
  const f1 = det("f1");
  const f5 = det("f5");
  const margin1 = f1.spikeMean / f1.tau;
  const margin5 = f5.spikeMean / f5.tau;
  return (
    <Scene id="open">
      <SceneHead id="open" />
      <Pages id="open" at={at}>
        {/* 页一：这一集要补上 E33 欠的记忆长度 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 292, width: 1080 }}>
            <div style={{ fontFamily: FONT.serif, fontSize: 92, color: C.ink, lineHeight: 1.2 }}>
              把历史压成
              <br />
              一个状态。
            </div>
            <Body size={FT.body} style={{ marginTop: 28, width: 1010 }}>
              第 33 集的卷积感受野只有三十一天，再远的历史看不见。这一集换成循环单元：状态随每天更新，
              把整段历史压进一个向量，再用它预测未来 F 天。预测错了多少，就是分数。
            </Body>
            <div style={{ display: "flex", gap: 18, marginTop: 34 }}>
              <Verdict ok label="实现通过" />
              <Verdict ok label="证据通过" />
              <Chip color={C.amber}>一次预测 F 步 · 稀释与阈值</Chip>
            </div>
          </div>
          <div style={{ position: "absolute", left: 1250, top: 296, width: 580 }}>
            <Card label="上一集欠的账" accent={C.violet}>
              <Row name="卷积记忆" value="31 天" note="感受野，硬的" width={520} />
              <Row name="多一天" value="看不见" note="窗口外没有连接" width={520} />
            </Card>
            <Card label="这一集换记法" accent={C.cyan} style={{ marginTop: 18 }}>
              <Row name="状态" value="一个向量" note="整段历史压进去" width={520} />
              <Row name="预测" value="未来 F 步" note="分数只算未来窗" width={520} />
            </Card>
          </div>
        </AbsoluteFill>

        {/* 页二：计划书的判据被读数推翻 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 300, width: 1060 }}>
            <Body size={FT.body} style={{ marginBottom: 20 }}>
              计划书的判据很直接：单点异常只污染未来窗里的一个点，分数被 1/F 摊薄，F 从一加到五，F1 应该掉。我们量的结果：
            </Body>
            <PairBar
              a={{ label: "GRU · F=1", value: f1.f1, text: fmtF(f1.f1, 4) }}
              b={{ label: "GRU · F=5", value: f5.f1, text: fmtF(f5.f1, 4) }}
              width={1000}
              height={150}
              at={at[1]}
            />
            <Body size={FT.meta} color={C.inkFaint} style={{ marginTop: 18 }}>
              差 {fmtF(f5.f1 - f1.f1, 4)}，方向反了。不是掉，是略升。
            </Body>
          </div>
          <div style={{ position: "absolute", left: 1180, top: 300, width: 640 }}>
            <Card label="为什么会这样" accent={C.amber}>
              <Row name="F=1" value={fmtF(f1.tau, 4)} note="训练段 99% 分位阈值" width={590} />
              <Row name="F=5" value={fmtF(f5.tau, 4)} note="阈值跟着分布一起缩" width={590} />
            </Card>
            <Card label="一句话" accent={C.violet} style={{ marginTop: 18 }}>
              <Body size={FT.body} color={C.ink}>这一集不报更高的 F1。</Body>
              <Body size={FT.body} color={C.ink}>报稀释与阈值的赛跑。</Body>
            </Card>
          </div>
        </AbsoluteFill>

        {/* 页三：稀释是真的，信噪比还够 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 300, width: 1040 }}>
            <PairBar
              a={{ label: "尖峰均分 F=1", value: f1.spikeMean, text: fmtF(f1.spikeMean, 2) }}
              b={{ label: "尖峰均分 F=5", value: f5.spikeMean, text: fmtF(f5.spikeMean, 2) }}
              width={980}
              height={150}
              at={at[2]}
            />
            <PairBar
              a={{ label: "阈值 F=1", value: f1.tau, text: fmtF(f1.tau, 2) }}
              b={{ label: "阈值 F=5", value: f5.tau, text: fmtF(f5.tau, 2) }}
              width={980}
              height={150}
              at={at[2] + 6}
            />
            <PairBar
              a={{ label: "信噪比 F=1", value: margin1, text: fmtF(margin1, 2) + "×" }}
              b={{ label: "信噪比 F=5", value: margin5, text: fmtF(margin5, 2) + "×" }}
              width={980}
              height={150}
              colorA={C.cyan}
              colorB={C.amber}
              at={at[2] + 12}
            />
          </div>
          <div style={{ position: "absolute", left: 1180, top: 300, width: 640 }}>
            <Card label="倍率" accent={C.cyan}>
              <Row name="尖峰分数" value="缩小 2.68 倍" note="75.52 → 28.19" width={590} />
              <Row name="训练阈值" value="只缩 1.73 倍" note="10.13 → 5.84" width={590} />
              <Row name="信噪比" value="7.46 → 4.83 倍" note="仍远大于一" width={590} />
            </Card>
            <Card label="所以" accent={C.amber} style={{ marginTop: 18 }}>
              <Body size={FT.body} color={C.ink}>稀释是真的，判据是假的。</Body>
            </Card>
          </div>
        </AbsoluteFill>

        {/* 页四：零件与数据 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 300, width: 1020 }}>
            <Card label="零件两个" accent={C.cyan}>
              <Row name="01" value="GRU 单元" note={"门控混合 · " + M.params.gru.params + " 参数"} width={970} />
              <Row name="02" value="LSTM 预测器" note={"细胞状态 · 两层 · " + M.params.lstm.params + " 参数"} width={970} />
            </Card>
            <Card label="数据 · 茅台日线" accent={C.violet} style={{ marginTop: 18 }}>
              <Row name="区间" value={M.data.start + " .. " + M.data.end} note={M.data.name + " · 后复权收盘"} width={970} />
              <Row name="行数" value={fmtInt(M.data.rows) + " 行"} note={"收益率 " + fmtInt(M.data.returns) + " 个 · 最长缺口 " + M.data.maxGap.days + " 天"} width={970} />
              <Row name="窗口" value={"训练 " + fmtInt(M.windows.trainF1) + " / 测试 " + fmtInt(M.windows.testF1)} note={"F=5 时 " + fmtInt(M.windows.trainF5) + " / " + fmtInt(M.windows.testF5)} width={970} />
            </Card>
          </div>
          <div style={{ position: "absolute", left: 1180, top: 300, width: 640 }}>
            <Card label="检查" accent={C.amber}>
              <Row name="检查点" value={M.meta.checks} note={"耗时 " + M.meta.elapsedSec + " 秒"} width={590} />
              <Row name="测试" value={fmtInt(M.meta.tests.suites) + " 套"} note={fmtInt(M.meta.tests.asserts) + " 条断言"} width={590} />
              <Row name="新增" value={M.meta.tests.newSuites + " 套"} note={M.meta.tests.newAsserts + " 条断言"} width={590} />
            </Card>
            <Card label="注入" accent={C.cyan} style={{ marginTop: 18 }}>
              <Row name="尖峰" value={M.inject.count + " 个"} note={M.inject.spike.span + " · " + M.inject.spike.amp} width={590} />
              <Row name="相位" value={M.inject.count + " 个"} note={M.inject.phase.lag + " · " + M.inject.phase.how} width={590} />
              <Row name="比例" value={pctOf(M.inject.rate)} note={"seed " + M.inject.seed} width={590} />
            </Card>
          </div>
        </AbsoluteFill>
      </Pages>
    </Scene>
  );
};
