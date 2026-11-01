import React from "react";
import { AbsoluteFill } from "remotion";
import { C, FONT, FT } from "../../design/tokens";
import { PAD, CW, M, fmtInt, fmtF, pageAt, Pages, Scene, SceneHead, Card, Row, Body, Formula, Chip } from "../shared";

const DIL = [1, 2, 4, 8];

/** 膨胀堆叠把感受野从 3 撑到 31：每一行画一层，格子宽度按层数递增。 */
const RfStack: React.FC<{ width: number }> = ({ width }) => {
  const gap = 3;
  const spans = [3, 7, 15, 31];
  const unit = (width - 150) / 31;
  const cell = unit - gap;
  return (
    <svg width={width} height={252} style={{ display: "block" }}>
      {spans.map((sp, i) => {
        const w = sp * unit;
        const x = 52;
        const y = 26 + i * 48;
        return (
          <g key={sp}>
            <text x={0} y={y + 22} fill={C.inkFaint} fontFamily={FONT.mono} fontSize={FT.micro}>{"d=" + DIL[i]}</text>
            <rect x={x} y={y} width={w} height={28} rx={4} fill={C.cyanDeep} opacity={0.9} />
            {Array.from({ length: sp }).map((_, j) => (
              <rect key={j} x={x + j * unit} y={y} width={cell} height={28} rx={2} fill={C.cyan} opacity={j === Math.floor(sp / 2) ? 0.95 : 0.25} />
            ))}
            <text x={width - 84} y={y + 20} fill={C.inkFaint} fontFamily={FONT.mono} fontSize={FT.meta}>{"RF " + sp}</text>
          </g>
        );
      })}
      <text x={0} y={244} fill={C.inkFaint} fontFamily={FONT.sans} fontSize={FT.micro}>每层 k=3，膨胀 1/2/4/8：感受野 3 → 7 → 15 → 31，正好一个月。</text>
    </svg>
  );
};

export const SDefinitions: React.FC = () => {
  const at = [0, pageAt("definitions", 14), pageAt("definitions", 25)];
  const p = M.params;
  return (
    <Scene id="definitions">
      <SceneHead id="definitions" />
      <Pages id="definitions" at={at}>
        {/* 页一：因果卷积与感受野 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 292, width: 1000 }}>
            <Formula size={56} note="causalConv1d :: ConvCfg -> Tensor -> Tensor · 左填充，右边不填">
              y[t] = Σ w[j] · x[t − d·j] ,  j = 0 … k−1
            </Formula>
            <div style={{ marginTop: 26 }}>
              <Formula size={44} note={"k=" + p.k + " · d∈{" + p.dilations.join(",") + "} · L=" + p.layers} color={C.cyan}>
                RF = 1 + (k−1) · Σ d = 1 + 2·15 = 31
              </Formula>
            </div>
            <div style={{ display: "flex", gap: 18, marginTop: 30 }}>
              <Chip color={C.cyan}>权重只在过去那侧</Chip>
              <Chip color={C.amber}>单层撑开 (k−1)·d</Chip>
              <Chip color={C.violet}>堆叠是等比求和</Chip>
            </div>
          </div>
          <div style={{ position: "absolute", left: 1180, top: 300, width: 650 }}>
            <Card label="感受野怎么长出来" accent={C.cyan}>
              <RfStack width={610} />
            </Card>
            <Card label="为什么是 31" accent={C.amber} style={{ marginTop: 18 }}>
              <Body size={FT.body} color={C.ink}>
                一个月的交易日大约是 21 天，31 天留了余量。再长的记忆，卷积要靠加层或加膨胀，不能靠核本身。
              </Body>
            </Card>
          </div>
        </AbsoluteFill>

        {/* 页二：双重卷积 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 292, width: 1080 }}>
            <Formula size={46} note="式 4.16a（第 86 页）：先幂变换，除以标准差，乘增益，再过 1×L 卷积">
              {"DualisticConv(X) = γ · Conv_{1×L}( X^γ / σ , s )"}
            </Formula>
            <div style={{ marginTop: 26 }}>
              <Body size={FT.body} style={{ width: 1040 }}>
                X^γ 怎么写，书里有两种说法：规格按“核覆盖的子序列取最大”读，正文写的是子序列聚合。两种都实现，都留读数 ——
                这一集不判哪一种对。
              </Body>
            </div>
            <div style={{ display: "flex", gap: 22, marginTop: 26 }}>
              <Card label="读法一 · 取最大" accent={C.violet} style={{ width: 500 }}>
                <div style={{ fontFamily: FONT.mono, fontSize: FT.num, color: C.violet }}>{fmtF(M.dual.maxReadingMean, 4)}</div>
                <Body size={FT.meta} color={C.inkFaint} style={{ marginTop: 8 }}>最大读法的均值，是均值读法的 {fmtF(M.dual.gammaRatio, 0)} 倍增益的线性响应</Body>
              </Card>
              <Card label="读法二 · 取均值" accent={C.cyan} style={{ width: 500 }}>
                <div style={{ fontFamily: FONT.mono, fontSize: FT.num, color: C.cyan }}>{fmtF(M.dual.meanReadingMean, 4)}</div>
                <Body size={FT.meta} color={C.inkFaint} style={{ marginTop: 8 }}>均值读法退化成均匀核因果卷积，逐点相同</Body>
              </Card>
            </div>
          </div>
          <div style={{ position: "absolute", left: 1240, top: 300, width: 590 }}>
            <Card label="这一节的坑" accent={C.coral}>
              <Row name="书 vs 规格" value="两种说法" note="式 4.16a 与正文冲突" width={540} color={C.coral} />
              <Row name="取最大" value="只量统计量" note="非均匀核，无闭式解" width={540} />
              <Row name="取均值" value="逐点可验证" note="与均匀核卷积逐位相同" width={540} color={C.cyan} />
            </Card>
            <Card label="γ 的作用" accent={C.amber} style={{ marginTop: 18 }}>
              <Body size={FT.body} color={C.ink}>
                γ 是增益，检查里直接比：γ=2 的输出恰好是 γ=1 的两倍。线性才成立，这是双重卷积能被复用的前提。
              </Body>
            </Card>
          </div>
        </AbsoluteFill>

        {/* 页三：TCN */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 292, width: 1020 }}>
            <Formula size={52} note="一层残差：F 是三次膨胀卷积加一次 1×1 投影">
              y = ReLU( x + F(x) )
            </Formula>
            <div style={{ marginTop: 28 }}>
              <Card label="配方写死" accent={C.violet}>
                <Row name="核 / 膨胀" value={"k=" + p.k + " · d=" + p.dilations.join("/")} note={"层数 " + p.layers + " · 隐藏 " + p.hidden} width={960} />
                <Row name="参数量" value={fmtInt(p.paramCount)} note="小到可以在 CPU 上跑十二轮" width={960} />
                <Row name="学习率 / 批" value={p.lr + " · " + p.batch} note={"最多 " + p.epochs + " 轮，早停耐心 " + p.patience} width={960} />
                <Row name="阈值" value={"q = " + p.quantile} note="训练段分数分位，不用测试段" width={960} />
              </Card>
            </div>
          </div>
          <div style={{ position: "absolute", left: 1150, top: 300, width: 680 }}>
            <Card label="为什么加残差" accent={C.cyan}>
              <Body size={FT.body} color={C.ink}>
                四层叠起来，梯度要穿过十二次矩阵乘。残差给一条直通路：就算 F 学成零，也还有 x 本身。
              </Body>
            </Card>
            <Card label="一个警告" accent={C.amber} style={{ marginTop: 18 }}>
              <Body size={FT.body} color={C.ink}>
                直通路太顺，模型容易学成恒等映射：输入原样输出，训练损失掉得飞快。后面会看到，这解释了为什么两个模型的离线分数贴得那么近。
              </Body>
            </Card>
          </div>
        </AbsoluteFill>
      </Pages>
    </Scene>
  );
};
