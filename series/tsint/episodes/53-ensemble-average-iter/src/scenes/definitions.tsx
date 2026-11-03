import React from "react";
import { AbsoluteFill } from "remotion";
import { C, FONT, FT } from "../../design/tokens";
import { M, Body, Card, Chip, Formula, KV, PAD, Pages, Row, Scene, SceneHead, fmt4, pagesOf } from "../shared";
import { SplitBar } from "../figs";

export const DefinitionsScene: React.FC = () => (
  <Scene id="definitions">
    <SceneHead id="definitions" />
    <Pages id="definitions" at={pagesOf("definitions")}>
      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 290, width: 660 }}>
          <Body size={FT.h2} color={C.ink} style={{ lineHeight: 1.28 }}>先定义四个量。</Body>
          <Body style={{ marginTop: 24 }}>
            第一个是加权平均。式 6.5：预测等于权重乘各模型预测之和。权重非负，和为一。权重全相等，就是等权。第二个是中位数集成，每个时点取十个预测的中位数。
          </Body>
        </div>
        <div style={{ position: "absolute", left: 800, top: 292, width: 1040 }}>
          <Card label="式 6.5 · 加权平均" accent={C.cyan}>
            <Formula size={56}>ŷ = Σ wᵢ ŷᵢ,  wᵢ ≥ 0,  Σ wᵢ = 1</Formula>
            <div style={{ height: 20 }} />
            <Row name="等权" value="wᵢ = 1/10" note="十个候选各占十分之一" width={960} color={C.amber} />
            <Row name="中位数" value="median(ŷᵢ)" note="不看权重，只看排序；对离群值更稳" width={960} color={C.violet} />
            <Row name="代价" value="丢幅度" note="中位数只看位置，不看离得多远" width={960} color={C.inkDim} />
          </Card>
        </div>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 290, width: 640 }}>
          <Body size={FT.h2} color={C.ink} style={{ lineHeight: 1.28 }}>学习权重，<br />带约束。</Body>
          <Body style={{ marginTop: 24 }}>
            把十个候选在调参段的预测排成矩阵，解一个带约束的岭回归。先解无约束，再投影回单纯形，解一次线性方程组就够。
          </Body>
        </div>
        <div style={{ position: "absolute", left: 760, top: 292, width: 1080 }}>
          <Card label="约束岭回归 · 千分之一惩罚" accent={C.violet}>
            <Formula size={40}>min ‖Xw − y‖² + λ‖w‖²</Formula>
            <div style={{ height: 16 }} />
            <Row name="约束" value="w ≥ 0, Σw = 1" note="投影到单纯形，不是简单截断" width={1000} color={C.violet} />
            <Row name="解" value="A⁻¹b, 再投影" note="A = XᵀX + λI" width={1000} color={C.cyan} />
            <Row name="λ" value="10⁻³" note="权重和 20 只都精确等于 1" width={1000} color={C.amber} />
            <Row name="有效权重" value={fmt4(M.fit.effW, 2)} note="1/Σw²；等权是 10，单选是 1" width={1000} color={C.violet} />
          </Card>
        </div>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 290, width: 640 }}>
          <Body size={FT.h2} color={C.ink} style={{ lineHeight: 1.28 }}>再定义<br />迭代重加权。</Body>
          <Body style={{ marginTop: 24 }}>
            每轮先算集成误差和各模型误差。误差比集成小的模型权重加，比集成大的减。步长 eta 控制每次加多少，负权重截零后重新归一化。
          </Body>
          <div style={{ display: "flex", gap: 10, marginTop: 24 }}>
            <Chip color={C.cyan}>eta 0.1 / 0.5</Chip>
            <Chip color={C.violet}>轮数 1 / 3 / 5 / 10</Chip>
          </div>
        </div>
        <div style={{ position: "absolute", left: 760, top: 292, width: 1080 }}>
          <Card label="误差驱动的权重更新" accent={C.amber}>
            <Formula size={46}>wᵢ ← max(0, wᵢ + η(e_ens − eᵢ))</Formula>
            <div style={{ height: 20 }} />
            <Row name="e_ens" value="集成误差" note="当前权重下，集成预测的 MAE" width={1000} color={C.cyan} />
            <Row name="eᵢ" value="单模型误差" note="第 i 个候选自己的 MAE" width={1000} color={C.violet} />
            <Row name="好模型" value="eᵢ < e_ens" note="差值正，权重增加" width={1000} color={C.cyan} />
            <Row name="坏模型" value="eᵢ > e_ens" note="差值负，权重减少，可能截零" width={1000} color={C.coral} />
          </Card>
        </div>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 290, width: 600 }}>
          <Body size={FT.h2} color={C.ink} style={{ lineHeight: 1.28 }}>切分：<br />只看调参段。</Body>
          <Body style={{ marginTop: 24 }}>
            前百分之七十做训练，中间百分之十五做调参，后百分之十五做检验。权重、挑选、选参只看调参段。检验段只报告，不回头改。
          </Body>
        </div>
        <div style={{ position: "absolute", left: 720, top: 300, width: 1120 }}>
          <Card label="二十只股票，每只按时间切三段" accent={C.amber}>
            <SplitBar width={1040} />
          </Card>
          <div style={{ marginTop: 24, display: "flex", gap: 30 }}>
            <KV k="训练根数" v={M.data.split.train[0] + " – " + M.data.split.train[1]} color={C.cyan} />
            <KV k="调参根数" v={M.data.split.tune[0] + " – " + M.data.split.tune[1]} color={C.violet} />
            <KV k="检验根数" v={M.data.split.test[0] + " – " + M.data.split.test[1]} color={C.amber} />
          </div>
          <div style={{ marginTop: 20, fontFamily: FONT.mono, fontSize: FT.meta, color: C.inkFaint }}>
            检验段 362–365 天，二十只合计约 7,000 个交易日。
          </div>
        </div>
      </AbsoluteFill>
    </Pages>
  </Scene>
);
