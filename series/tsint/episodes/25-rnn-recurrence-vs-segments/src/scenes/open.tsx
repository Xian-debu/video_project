import React from "react";
import { AbsoluteFill } from "remotion";
import { C, FONT, FT, FT_T } from "../../design/tokens";
import { PAD, CW, M, pageAt, Pages, Scene, SceneHead, Stat, K, Mono, Body, Card, Row, Verdict, Chip } from "../shared";

export const SOpen: React.FC = () => {
  const at = [0, pageAt("open", 7), pageAt("open", 15)];
  return (
    <Scene id="open">
      <SceneHead id="open" />
      <Pages id="open" at={at}>
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 470, width: CW }}>
            <div style={{ fontFamily: FONT.mono, fontSize: FT.label, letterSpacing: FT_T.label, color: C.cyan }}>RECURRENT vs SEGMENTED</div>
            <div style={{ fontFamily: FONT.serif, fontSize: 128, color: C.ink, marginTop: 18, lineHeight: 1.08 }}>两条生成路</div>
            <Body style={{ marginTop: 24, maxWidth: 1280 }} size={FT.body}>
              给定 96 步历史，预测未来 24 步。一条路一步一步往外推，一条路把时间轴切块并行。本集把两条路都实现，再用同一把尺子量。
            </Body>
          </div>
          <div style={{ position: "absolute", left: PAD, top: 820, width: CW, display: "flex", gap: 28 }}>
            <Stat label="数据窗口" value={M.meta.window.history + " + " + M.meta.window.horizon} sub="历史 96 步，预测 24 步，单指数十年" style={{ width: 520 }} />
            <Stat label="证据" value={M.meta.checks.ok + " / " + M.meta.checks.total} sub="四组检查，零失败" accent={C.amber} style={{ width: 520 }} />
            <Stat label="测试" value={M.meta.tests.suites + " 套"} sub={M.meta.tests.asserts + " 条断言"} accent={C.violet} style={{ width: 520 }} />
          </div>
        </AbsoluteFill>

        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 400, width: CW, display: "flex", gap: 26 }}>
            <Card label="01 · 逐点递归" accent={C.cyan} style={{ width: 860, height: 300 }}>
              <div style={{ fontFamily: FONT.serif, fontSize: 60, color: C.ink }}>Autoregressive</div>
              <Body size={FT.label} style={{ marginTop: 14 }}>
                把 96 步读成一个隐藏状态，再把自己的输出喂回输入，一步一步推完 24 步。串行，无法并行。
              </Body>
              <Mono size={FT.meta} color={C.inkFaint} style={{ display: "block", marginTop: 18 }}>前向 96 + 24 = 120 次 · 参数 1,121 · 训练 214 s</Mono>
            </Card>
            <Card label="02 · 分段并行" accent={C.amber} style={{ width: 860, height: 300 }}>
              <div style={{ fontFamily: FONT.serif, fontSize: 60, color: C.ink }}>Segmented</div>
              <Body size={FT.label} style={{ marginTop: 14 }}>
                历史切成 12 段，每段一次读完；生成切成 3 块，块内一次出 8 步。块之间并行，前向只剩 15 次。
              </Body>
              <Mono size={FT.meta} color={C.inkFaint} style={{ display: "block", marginTop: 18 }}>前向 12 + 3 = 15 次 · 参数 1,832 · 训练 54 s</Mono>
            </Card>
          </div>
          <div style={{ position: "absolute", left: PAD, top: 760, width: CW }}>
            <Row name="同一个问题" value="96 步历史 → 24 步预测" note="同一份数据，同一个训练/测试切分" width={1300} />
            <Row name="同一个尺子" value="平均绝对误差 + 二阶差分平滑度" note="误差越小越好，平滑度越小越好" width={1300} />
            <Row name="这一次的意外" value="分段更快更准，但更抖" note="快 8 倍，第 24 步误差低 0.016，平滑度差 1.43 倍" width={1300} />
          </div>
        </AbsoluteFill>

        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 430, width: CW, display: "flex", gap: 26 }}>
            <Stat label="调用次数" value="120 → 15" sub="串行 120 次，切块 15 次，差 8 倍" style={{ width: 560, height: 230 }} />
            <Stat label="24 步误差" value={M.rnn.arMae24.toFixed(4) + " / " + M.seg.mae24.toFixed(4)} sub="逐点递归 / 分段，分段反超 0.016" accent={C.amber} style={{ width: 560, height: 230 }} />
            <Stat label="平滑度" value={"×" + M.seg.smoothRatio.toFixed(2)} sub="分段 0.6353 vs 递归 0.4435，更抖" accent={C.coral} style={{ width: 560, height: 230 }} />
          </div>
          <div style={{ position: "absolute", left: PAD, top: 720, width: CW, display: "flex", gap: 26 }}>
            <Card label="本集结论" accent={C.cyan} style={{ width: 860, height: 200 }}>
              <Body size={FT.body}>两条路都能走通，代价不同：一条用串行换简单，一条用切块换速度，但块内没有平滑约束，拼接处会跳。</Body>
            </Card>
            <Card label="交付状态" accent={C.amber} style={{ width: 860, height: 200 }}>
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                <Verdict ok label="实现通过" />
                <Verdict ok label="证据通过" />
                <Verdict ok={false} label="未做端到端回测" />
              </div>
              <Mono size={FT.meta} color={C.inkFaint} style={{ display: "block", marginTop: 14 }}>book {M.meta.bookPages} · ts-base {M.meta.commit}</Mono>
            </Card>
          </div>
        </AbsoluteFill>
      </Pages>
    </Scene>
  );
};
