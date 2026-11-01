import React from "react";
import { AbsoluteFill } from "remotion";
import { C, FONT, FT, FT_T } from "../../design/tokens";
import { PAD, CW, M, pageAt, Pages, Scene, SceneHead, Stat, Mono, Body, Card, Row, Formula, Chip, Heat, SeriesBars, PatchWindows, Verdict } from "../shared";

export const SIntuition: React.FC = () => {
  const at = [0, pageAt("intuition", 7), pageAt("intuition", 12), pageAt("intuition", 20)];
  const p = M.patch;
  const t = M.patchtst;
  return (
    <Scene id="intuition">
      <SceneHead id="intuition" />
      <Pages id="intuition" at={at}>
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 320, width: 1150 }}>
            <Card label="九十六步收盘价 · 十一个块怎么铺" accent={C.cyan} style={{ width: 1150 }}>
              <div style={{ marginTop: 4 }}>
                <SeriesBars values={M.series.window} width={1060} height={140} color={C.inkFaint} />
              </div>
              <div style={{ height: 14 }} />
              <PatchWindows values={M.series.window} patches={M.series.patches} width={1060} rowH={34} labelW={130} />
            </Card>
          </div>
          <div style={{ position: "absolute", left: 1290, top: 330, width: 558 }}>
            <Stat label="块数" value={String(p.n)} sub="十一块，最后一块 81–96" accent={C.cyan} style={{ width: 558, height: 170 }} />
            <Stat label="重叠" value={String(p.overlap)} sub="相邻块共享一半上下文" accent={C.amber} style={{ width: 558, height: 170, marginTop: 22 }} />
            <Stat label="位置" value={String(p.posParams)} sub="十一个位置，每个三十二维" accent={C.violet} style={{ width: 558, height: 170, marginTop: 22 }} />
          </div>
        </AbsoluteFill>

        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 330, width: 1150 }}>
            <Card label="算术 · 为什么是十一不是十二" accent={C.amber} style={{ width: 1150 }}>
              <Formula size={46}>{"⌊(96 − 16) / 8⌋ + 1 = 11"}</Formula>
              <Row name="窗口" value="96" note="九十六步历史" width={1050} />
              <Row name="减块长" value="96 − 16 = 80" note="最后一块必须整块落进窗口" width={1050} />
              <Row name="除以步长" value="80 / 8 = 10" note="能走的步数" width={1050} />
              <Row name="加一" value="10 + 1 = 11" note="块数比步数多一" color={C.amber} width={1050} />
              <Body size={FT.label} style={{ marginTop: 14 }}>
                若要十二块，步长得是六又三分之二。步长只能整数，所以十二做不到。
              </Body>
            </Card>
          </div>
          <div style={{ position: "absolute", left: 1290, top: 330, width: 558 }}>
            <Stat label="真实块数" value={String(p.n)} sub={"书上写的 " + p.naive} accent={C.amber} style={{ width: 558, height: 210 }} />
            <Stat label="要求的步长" value="6.67" sub="非整数，所以十二块不可达" accent={C.coral} style={{ width: 558, height: 210, marginTop: 26 }} />
          </div>
        </AbsoluteFill>

        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 320, width: 1150 }}>
            <Card label="感受野 · 第一块只看到前十六步" accent={C.cyan} style={{ width: 1150 }}>
              <SeriesBars values={M.series.window} width={1060} height={170} color={C.cyan} />
              <Row name="改第 16 步" value="第一块变" note="十六在块内" width={1050} />
              <Row name="改第 17 步" value="第一块不变" note="十七在块内，也在下一个块里" width={1050} />
              <Row name="可测感受野" value={String(t.receptiveSteps) + " 步"} note="十六步，后面全是空的" color={C.cyan} width={1050} />
              <Body size={FT.label} style={{ marginTop: 14 }}>
                这条性质是这么测的：逐个位置扰动，看第一个 token 变不变。变与不变之间就是块边界。
              </Body>
            </Card>
          </div>
          <div style={{ position: "absolute", left: 1290, top: 320, width: 558 }}>
            <Stat label="感受野" value={t.receptiveSteps + " 步"} sub="块长就是视野" accent={C.cyan} style={{ width: 558, height: 210 }} />
            <Stat label="遮蔽一块的位移" value={t.noMaskDelta.toFixed(4)} sub="扰动一块，输出差百分之一五" accent={C.amber} style={{ width: 558, height: 210, marginTop: 26 }} />
          </div>
        </AbsoluteFill>

        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 330, width: CW }}>
            <Card label="交叉注意力 · 二十四个查询读九十六个记忆" accent={C.violet} style={{ width: CW }}>
              <Heat matrix={M.series.heatmap} labels={Array.from({ length: 96 }, (_, i) => String(i + 1))} cell={14} gap={2} labelW={110} min={0} max={0.02} at={0} />
            </Card>
          </div>
          <div style={{ position: "absolute", left: PAD, top: 850, width: CW, display: "flex", gap: 26 }}>
            <Card label="每行和为一" accent={C.cyan} style={{ width: 700, height: 130 }}>
              <Body size={FT.label}>九十六列 softmax，行和误差 {M.cross.rowSumErr.toFixed(1)}e−16。</Body>
            </Card>
            <Card label="但这是未训练的" accent={C.coral} style={{ width: 970, height: 130 }}>
              <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                <Verdict ok={false} label="未训练" />
                <Body size={FT.label}>查询随机初始化，位置是固定线性投影，矩阵只说明形状，不说明模型关注哪里。</Body>
              </div>
            </Card>
          </div>
        </AbsoluteFill>
      </Pages>
    </Scene>
  );
};
