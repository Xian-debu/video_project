import React from "react";
import { AbsoluteFill } from "remotion";
import { C, FONT, FT, FT_T } from "../../design/tokens";
import { PAD, CW, M, pageAt, Pages, Scene, SceneHead, Stat, K, Mono, Body, Card, Row, Verdict, Chip } from "../shared";

export const SOpen: React.FC = () => {
  const at = [0, pageAt("open", 8), pageAt("open", 14)];
  return (
    <Scene id="open">
      <SceneHead id="open" />
      <Pages id="open" at={at}>
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 470, width: CW }}>
            <div style={{ fontFamily: FONT.mono, fontSize: FT.label, letterSpacing: FT_T.label, color: C.cyan }}>CHANNEL MIXING · iTransformer · GCN</div>
            <div style={{ fontFamily: FONT.serif, fontSize: 128, color: C.ink, marginTop: 18, lineHeight: 1.08 }}>把注意力翻到通道轴</div>
            <Body style={{ marginTop: 24, maxWidth: 1240 }} size={FT.body}>
              前二十集，注意力都在时间轴上。这一集换一个方向：把八个通道当成八个 token，看它们之间谁跟谁有关系。
            </Body>
          </div>
          <div style={{ position: "absolute", left: PAD, top: 800, width: CW, display: "flex", gap: 28 }}>
            <Stat label="证据" value="44 / 44" sub="五组检查，零失败" style={{ width: 420 }} />
            <Stat label="混合参数量" value="144" sub="N = 8，2N² + 2N" accent={C.amber} style={{ width: 420 }} />
            <Stat label="图的分量" value="3" sub="八通道 1-NN 图，与行业同构" accent={C.violet} style={{ width: 420 }} />
          </div>
        </AbsoluteFill>

        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 420, width: CW, display: "flex", gap: 26 }}>
            <Card label="01 · 混合" accent={C.cyan} style={{ width: 540, height: 310 }}>
              <div style={{ fontFamily: FONT.serif, fontSize: 60, color: C.ink }}>ChannelMix</div>
              <Body size={FT.label} style={{ marginTop: 14 }}>
                TSMixer 式：先把每个时刻的通道乘一个 N×N，再换方向混时间。
              </Body>
              <Mono size={FT.meta} color={C.inkFaint} style={{ display: "block", marginTop: 18 }}>参数量 144 · 一个块 1,784</Mono>
            </Card>
            <Card label="02 · 注意力" accent={C.amber} style={{ width: 540, height: 310 }}>
              <div style={{ fontFamily: FONT.serif, fontSize: 60, color: C.ink }}>iTransformer</div>
              <Body size={FT.label} style={{ marginTop: 14 }}>
                维度倒置：把每一列变成一个 token，注意力只在变量之间算。
              </Body>
              <Mono size={FT.meta} color={C.inkFaint} style={{ display: "block", marginTop: 18 }}>64 格 vs 9,216 格 · 参数量 53,248</Mono>
            </Card>
            <Card label="03 · 图" accent={C.violet} style={{ width: 540, height: 310 }}>
              <div style={{ fontFamily: FONT.serif, fontSize: 60, color: C.ink }}>GraphChannel</div>
              <Body size={FT.label} style={{ marginTop: 14 }}>
                先按相关建 kNN 图，再加自环做归一化消息传递。
              </Body>
              <Mono size={FT.meta} color={C.inkFaint} style={{ display: "block", marginTop: 18 }}>k = 2 · 20 只票 3 个分量</Mono>
            </Card>
          </div>
          <div style={{ position: "absolute", left: PAD, top: 800, width: CW }}>
            <Row name="书页" value={M.meta.bookPages} note="印刷版页码：3.3.6 三种策略、3.4.3 图、3.4.4 MLP/CNN" width={1180} />
            <Row name="本集结论" value="通道关系可测，图能还原行业分块" note="测的是结构，不是预测精度" width={1180} />
          </div>
        </AbsoluteFill>

        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 430, width: CW, display: "flex", gap: 26 }}>
            <Stat label="交付" value="44 / 44" sub="证据全过，重跑 0.30 s" style={{ width: 400, height: 220 }} />
            <Stat label="测试" value={M.meta.tests.suites + " 套"} sub={M.meta.tests.asserts + " 条断言"} accent={C.amber} style={{ width: 400, height: 220 }} />
            <Stat label="面板 A" value={M.meta.panelA.rows + " 行"} sub="8 个通道 · 2015 → 2025" accent={C.violet} style={{ width: 400, height: 220 }} />
            <Stat label="面板 B" value={M.meta.panelB.rows + " 行"} sub="20 只票 · 4 个行业" accent={C.coral} style={{ width: 400, height: 220 }} />
          </div>
          <div style={{ position: "absolute", left: PAD, top: 710, width: CW }}>
            <Body size={FT.label}>
              本集只回答“通道关系怎么算、算得对不对”，不回答“模型准不准”。第七节会把边界逐条说清。
            </Body>
            <div style={{ marginTop: 22, display: "flex", gap: 18 }}>
              <Verdict ok label="实现通过" />
              <Verdict ok label="证据通过" />
              <Verdict ok={false} label="未做端到端训练" />
              <Chip color={C.inkFaint}>解析探针 ≠ 训练权重</Chip>
            </div>
          </div>
        </AbsoluteFill>
      </Pages>
    </Scene>
  );
};
