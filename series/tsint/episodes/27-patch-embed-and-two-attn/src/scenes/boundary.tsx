import React from "react";
import { AbsoluteFill } from "remotion";
import { C, FONT, FT, FT_T } from "../../design/tokens";
import { PAD, CW, M, pageAt, Pages, Scene, SceneHead, Stat, Mono, Body, Card, Row, Formula, Chip, Verdict, KV } from "../shared";

export const SBoundary: React.FC = () => {
  const at = [0, pageAt("boundary", 5), pageAt("boundary", 11), pageAt("boundary", 16), pageAt("boundary", 21)];
  return (
    <Scene id="boundary">
      <SceneHead id="boundary" />
      <Pages id="boundary" at={at}>
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 330, width: 1150 }}>
            <Card label="边界一 · 没有训练" accent={C.coral} style={{ width: 1150 }}>
              <Formula size={48} color={C.coral}>没有拟合，就没有精度</Formula>
              <Row name="这集做了" value="结构、参数、置换、方向、掩码" note="每一条都能用一条断言钉住" width={1050} />
              <Row name="这集没做" value="训练、损失曲线、预测误差" note="没有端到端训练" color={C.coral} width={1050} />
              <Row name="所以不能说" value="PatchTST 更准" note="只能说它的交互对数少七十六倍" color={C.amber} width={1050} />
            </Card>
          </div>
          <div style={{ position: "absolute", left: 1290, top: 330, width: 558 }}>
            <Stat label="训练步数" value="0" sub="本集没有跑一次训练" accent={C.coral} style={{ width: 558, height: 210 }} />
            <Card label="证据原则" style={{ width: 558, marginTop: 26 }}>
              <Body size={FT.label}>不能说得比证据多。参数、方向、掩码能测；精度不能测。</Body>
            </Card>
          </div>
        </AbsoluteFill>

        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 340, width: 1150 }}>
            <Card label="边界二 · 块内信息是有损的" accent={C.amber} style={{ width: 1150 }}>
              <Formula size={52} color={C.amber}>16 步 → 1 个向量</Formula>
              <Row name="映射" value="一个线性投影" note="不是可逆变换" width={1050} />
              <Row name="可能丢的" value="块内高频" note="相邻几步的快速起伏被摊平" width={1050} />
              <Row name="能不能补" value="只能靠块间" note="重叠八个点，相邻块共享一半上下文" width={1050} />
              <Row name="性质" value="设计如此" note="不是实现 bug" color={C.cyan} width={1050} />
            </Card>
          </div>
          <div style={{ position: "absolute", left: 1290, top: 340, width: 558 }}>
            <Stat label="块内压缩" value="16 : 1" sub="十六步压成一个点" accent={C.amber} style={{ width: 558, height: 210 }} />
            <Stat label="重叠" value={String(M.patch.overlap) + " 步"} sub="相邻块共享一半" accent={C.cyan} style={{ width: 558, height: 210, marginTop: 26 }} />
          </div>
        </AbsoluteFill>

        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 340, width: 1150 }}>
            <Card label="边界三 · 注意力热图是未训练的" accent={C.violet} style={{ width: 1150 }}>
              <Formula size={46}>查询随机初始化 · 位置固定投影</Formula>
              <Row name="查询" value="N(0, 0.02)" note={"二十四个可学习向量，实测标准差 " + M.cross.querySd.toFixed(4)} width={1050} />
              <Row name="位置" value="固定线性投影" note="不是训练出来的" width={1050} />
              <Row name="矩阵能说明" value="形状" note="行和为一，二十四乘九十六" color={C.violet} width={1050} />
              <Row name="不能说明" value="模型关注哪里" note="因为模型还没学过" color={C.coral} width={1050} />
            </Card>
          </div>
          <div style={{ position: "absolute", left: 1290, top: 340, width: 558 }}>
            <Stat label="热图" value="24 × 96" sub="未训练的注意力权重" accent={C.violet} style={{ width: 558, height: 210 }} />
            <Card label="画面口径" style={{ width: 558, marginTop: 26 }}>
              <Body size={FT.label}>热图上必须标未训练。否则读者会以为它是学出来的注意力。</Body>
            </Card>
          </div>
        </AbsoluteFill>

        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 330, width: CW }}>
            <Card label="边界四 · 单一面板" accent={C.cyan} style={{ width: CW }}>
              <Row name="通道" value={String(M.data.channels)} note="白酒三、银行三、指数二" width={1660} />
              <Row name="行" value={String(M.data.rows)} note={"面板从 " + M.data.start + " 到 " + M.data.end} width={1660} />
              <Row name="窗口" value={String(M.data.windows)} note={"九十六步历史，二十四步预测，步长八" } width={1660} />
              <Row name="训练段" value={String(M.data.train)} note="前七成，后三成留测试" width={1660} />
              <Row name="不外推" value="全市场" note="换更大的样本，结论可能反过来" color={C.amber} width={1660} />
            </Card>
          </div>
        </AbsoluteFill>

        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 330, width: CW }}>
            <Card label="三笔债 · 记在账上" accent={C.amber} style={{ width: CW }}>
              <Row name="算法卡" value="没写" note="接口、口径、与书本的差异待成文" color={C.amber} width={1660} />
              <Row name="demo 子命令" value="没做" note="还没有一键跑三个模块入口的命令" color={C.amber} width={1660} />
              <Row name="端到端训练" value="没做" note="没有拟合，就没有精度可报" color={C.amber} width={1660} />
            </Card>
          </div>
          <div style={{ position: "absolute", left: PAD, top: 760, width: CW, display: "flex", gap: 26 }}>
            <Card label="交付状态" accent={C.cyan} style={{ width: 860, height: 180 }}>
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                <Verdict ok label="实现通过" />
                <Verdict ok label="证据通过" />
                <Verdict ok={false} label="未做端到端训练" />
              </div>
              <Mono size={FT.meta} color={C.inkFaint} style={{ display: "block", marginTop: 14 }}>31 / {M.meta.checks.total} 检查 · {M.meta.tests.suites} 套 / {M.meta.tests.asserts} 断言</Mono>
            </Card>
            <Card label="边界是为了可复现" accent={C.cyan} style={{ width: 860, height: 180 }}>
              <Body size={FT.label}>写清不能说什么，剩下的读数才可信。下一集换通道轴，账继续记。</Body>
            </Card>
          </div>
        </AbsoluteFill>
      </Pages>
    </Scene>
  );
};
