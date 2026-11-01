import React from "react";
import { AbsoluteFill } from "remotion";
import { C, FONT, FT } from "../../design/tokens";
import { PAD, M, pagesOf, Pages, Scene, SceneHead, Card, Row, Body, Formula, KV, Chip, Verdict, Stat } from "../shared";

export const SDefinitions: React.FC = () => {
  const at = pagesOf("definitions");
  return (
    <Scene id="definitions">
      <SceneHead id="definitions" />
      <Pages id="definitions" at={at}>
        {/* 页一：两个式子 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 288, width: 980 }}>
            <Formula size={54} color={C.cyan} note="式(4.26) · p.101–102">
              p(z) = Σ<sub>k=1..K</sub> π<sub>k</sub> N(z | μ<sub>k</sub>, Σ<sub>k</sub>)
            </Formula>
            <Body style={{ marginTop: 14, width: 940 }}>
              权重非负，和为一。每个分量有自己的均值与协方差。
            </Body>
            <Formula size={40} color={C.violet} note="式(4.27) · 重构项减去对混合先验的 KL" style={{ marginTop: 26 }}>
              L = E<sub>q(z|x)</sub>[log p(x|z)] − KL(q(z|x) ‖ p(z))
            </Formula>
          </div>
          <div style={{ position: "absolute", left: 1120, top: 288, width: 730 }}>
            <Card label="三个数值要点" accent={C.amber}>
              <Row name="混合似然" value="log-sum-exp" note="四个分量直接 log(sum) 会下溢成负无穷" width={670} />
              <Row name="协方差" value="Cholesky + jitter 1e-6" note="A 股横盘段方差接近零，log-det 会掉到负无穷" width={670} />
              <Row name="权重" value="夹紧 [1e-8, 1] 再归一" note="每次 EM 更新后都做，和永远是一" width={670} />
            </Card>
            <Body size={FT.meta} color={C.inkFaint} style={{ marginTop: 18, width: 700 }}>
              这三条不是优化，是能不能算出有限数的前提。三条都写成了检查。
            </Body>
          </div>
        </AbsoluteFill>

        {/* 页二：w 的自由度与两种实现 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 288, width: 1000 }}>
            <Card label="书里没写的那一半" accent={C.coral}>
              <Row name="w 是离散隐变量" value="式(4.27) 里出现" note="只引了一篇文献，没有展开" width={950} />
              <Row name="推断网络" value="书没给" note="这是这一集最大的自由度" width={950} />
            </Card>
            <Card label="两种实现，同一套编码器" accent={C.violet} style={{ marginTop: 20 }}>
              <Row name="联合训练" value="EM + 梯度" note="每二十轮更新一次先验；只当诊断" width={950} />
              <Row name="两段式" value="冻结编码器再 EM" note="与上一集 VAE 共用编码器，读数才可比" color={C.violet} width={950} />
            </Card>
            <Body style={{ marginTop: 20, width: 950 }}>
              片子主要报两段式。分数写成负的混合对数密度——这是 p.102 判据的口语化，不是书上的公式，屏幕会标「非书中」。
            </Body>
          </div>
          <div style={{ position: "absolute", left: 1180, top: 288, width: 700 }}>
            <Chip color={C.coral}>非书中 · 分数定义</Chip>
            <Formula size={34} color={C.ink} note="p.102 判据的口语化：任何分量都解释不了" style={{ marginTop: 16 }}>
              score(x) = −log Σ<sub>k</sub> π<sub>k</sub> p(x | z, w=k)
            </Formula>
            <Card label="对 K=1 的要求" accent={C.cyan} style={{ marginTop: 24 }}>
              <Row name="退化" value="退回式(4.23)" note="一个分量、权重一、标准正态" width={650} />
              <Row name="判据" value="逐位相同" note="不是近似，是相等" width={650} />
            </Card>
          </div>
        </AbsoluteFill>

        {/* 页三：参数账与合成数据 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 288, width: 1000 }}>
            <Card label="参数账 · 每一个都能手核" accent={C.cyan}>
              <Row name="编码器 + 两个头" value="1,852" note="复用上一集 VAE" width={950} />
              <Row name="四个八维均值" value="32" note="4 × 8" width={950} />
              <Row name="四个权重" value="4" note="π，和为 1" width={950} />
              <Row name="四个八乘八下三角协方差" value="144" note="4 × 8 × 9 / 2" width={950} />
              <Row name="合计" value={M.fit.params + " 个"} note={"与联合训练同一个数：" + M.gmm.params} color={C.cyan} width={950} />
            </Card>
            <Body style={{ marginTop: 18, width: 950 }}>
              都很小。正因为小，每个数都能手核，也才敢把它当证据。
            </Body>
          </div>
          <div style={{ position: "absolute", left: 1180, top: 288, width: 700 }}>
            <Card label="合成数据先验一次 · 两团各两百点" accent={C.violet}>
              <Stat label="中心恢复误差" value={M.blob.err.toFixed(3)} sub={"两团中心隔 " + M.blob.sep.toFixed(2) + " 个标准差"} valueSize={48} valueColor={C.violet} />
              <Row name="权重" value={M.blob.pi.map((p) => p.toFixed(2)).join(" / ")} note="K=2 · 六十步" width={650} />
              <Row name="后验置信点" value={M.blob.confident + "%"} note="最大后验超过 0.9 的点" width={650} />
            </Card>
            <div style={{ marginTop: 16 }}>
              <Verdict ok label="EM 本身没写错" />
            </div>
          </div>
        </AbsoluteFill>
      </Pages>
    </Scene>
  );
};
