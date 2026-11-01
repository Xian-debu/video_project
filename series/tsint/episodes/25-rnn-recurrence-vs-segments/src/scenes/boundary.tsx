import React from "react";
import { AbsoluteFill } from "remotion";
import { C, FONT, FT, FT_T } from "../../design/tokens";
import { PAD, CW, M, pageAt, Pages, Scene, SceneHead, Stat, K, Mono, Body, Card, Row, Bars, Chip, Verdict } from "../shared";

const Point: React.FC<{ n: string; title: string; children: React.ReactNode; w: number; h: number }> = ({ n, title, children, w, h }) => (
  <Card label={"0" + n + " · " + title} accent={C.coral} style={{ width: w, height: h }}>
    {children}
  </Card>
);

export const SBoundary: React.FC = () => {
  const at = [0, pageAt("boundary", 6), pageAt("boundary", 13), pageAt("boundary", 24)];
  return (
    <Scene id="boundary">
      <SceneHead id="boundary" />
      <Pages id="boundary" at={at}>
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 330, width: 860 }}>
            <Card label="预期 · 分段应该更平滑" accent={C.cyan} style={{ width: 860, height: 260 }}>
              <Body size={FT.label}>块内一次生成 8 步，理论上应该比逐点递归更连贯。我们把这个当成先验。</Body>
            </Card>
            <Card label="实测 · 反过来了" accent={C.coral} style={{ width: 860, height: 300, marginTop: 22 }}>
              <div style={{ fontFamily: FONT.mono, fontSize: 52, color: C.ink }}>{M.seg.smoothSeg.toFixed(4)} vs {M.seg.smoothAr.toFixed(4)}</div>
              <Mono size={FT.meta} color={C.coral}>分段抖 {M.seg.smoothRatio.toFixed(2)} 倍 · 二阶差分平均绝对值</Mono>
            </Card>
          </div>
          <div style={{ position: "absolute", left: 1020, top: 330, width: 756 }}>
            <Card label="原因" accent={C.amber} style={{ width: 756, height: 560 }}>
              <Row name="块内无约束" value="每步独立" note="没有在块内加平滑项" width={700} />
              <Row name="误差不共享" value="块内各步各错" note="相邻步之间没有约束传导" width={700} />
              <Row name="拼接处" value="会跳" note="块与块的交界处最明显" width={700} />
              <Body size={FT.meta} style={{ marginTop: 22 }}>这是这个变体的真实性质，不是实现错误。证据里写的是测量值，不是期望值。</Body>
            </Card>
          </div>
        </AbsoluteFill>

        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 330, width: 880 }}>
            <Point n="2" title="分段前向是自定变体" w={880} h={280}>
              <Row name="书里" value="表 3.2 三条性质" note="块嵌入、并行生成、训练目标" width={820} />
              <Row name="没写" value="怎么融合" color={C.coral} note="解码器结构由我们补全" width={820} />
              <div style={{ marginTop: 14 }}><Chip color={C.amber}>证据等级 B</Chip></div>
            </Point>
            <Point n="3" title="只有一个标的" w={880} h={240}>
              <Row name="数据" value="单指数 · 十年" note={M.meta.data.start + " → " + M.meta.data.end} width={820} />
              <Row name="外推" value="不能代表全市场" color={C.coral} width={820} />
            </Point>
          </div>
          <div style={{ position: "absolute", left: 1020, top: 330, width: 756 }}>
            <Point n="4" title="没做端到端回测" w={756} h={260}>
              <Row name="量的是" value="预测误差" note="MAE，24 步" width={700} />
              <Row name="没量" value="收益与回撤" color={C.coral} note="误差小不等于赚钱" width={700} />
            </Point>
            <Point n="5" title="膨胀只有 1.10 倍" w={756} h={260}>
              <Row name="第 1 → 24 步" value={M.rnn.arMae1.toFixed(4) + " → " + M.rnn.arMae24.toFixed(4)} width={700} />
              <Row name="口径" value="标准化收益" note="换成价格会放大" width={700} />
              <Body size={FT.micro} style={{ marginTop: 10 }}>别把它说成爆炸。</Body>
            </Point>
          </div>
        </AbsoluteFill>

        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 340, width: 1120 }}>
            <Card label="数据缺口 · 按行连续切窗" accent={C.coral} style={{ width: 1120, height: 230 }}>
              <Row name="断点" value={M.meta.data.maxGapDays + " 天"} note={M.meta.data.maxGapAt + " → " + M.meta.data.maxGapNext} width={1050} />
              <Row name="处理" value="不剔除，不插值" note="窗口按行连续切，读数是近似" width={1050} />
            </Card>
            <Card label="两项欠账 · 留到统一补" accent={C.amber} style={{ width: 1120, height: 230, marginTop: 24 }}>
              <Row name="算法卡" value="未写" note="本集只有模块与证据" width={1050} />
              <Row name="演示命令" value="tsbase demo 仍规划中" note="当前用 evidence 子命令复现" width={1050} />
            </Card>
          </div>
          <div style={{ position: "absolute", left: 1240, top: 340, width: 536 }}>
            <Card label="所以这一集仍算 ready" accent={C.cyan} style={{ width: 536, height: 484 }}>
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                <Verdict ok label="实现通过" />
                <Verdict ok label="证据通过" />
                <Verdict ok label="边界已报" />
              </div>
              <Body size={FT.label} style={{ marginTop: 20 }}>ready 说的是内容可交付，不是整个项目没有缺口。六条边界都记在证据与文档里。</Body>
            </Card>
          </div>
        </AbsoluteFill>

        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 380, width: CW }}>
            <div style={{ display: "flex", gap: 26 }}>
              <Stat label="平滑度比值" value={"×" + M.seg.smoothRatio.toFixed(2)} sub="分段更抖" accent={C.coral} style={{ width: 420, height: 220 }} />
              <Stat label="24 步差" value="0.016" sub="分段反超的量级" accent={C.amber} style={{ width: 420, height: 220 }} />
              <Stat label="证据" value={M.meta.checks.ok + " / " + M.meta.checks.total} sub="零失败" style={{ width: 420, height: 220 }} />
              <Stat label="边界" value="6 条" sub="全部写进文档" accent={C.violet} style={{ width: 420, height: 220 }} />
            </div>
            <Body style={{ marginTop: 50, maxWidth: 1600 }} size={FT.body}>
              六条边界：平滑度反直觉、分段前向是自定变体、单标的、无端到端回测、误差膨胀不夸张、数据有缺口。这六条不是 bug，是口径必须一起报的东西。
            </Body>
          </div>
        </AbsoluteFill>
      </Pages>
    </Scene>
  );
};
