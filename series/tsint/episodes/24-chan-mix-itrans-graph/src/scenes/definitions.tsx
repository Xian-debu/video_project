import React from "react";
import { AbsoluteFill } from "remotion";
import { C, FONT, FT, FT_T } from "../../design/tokens";
import { PAD, CW, M, pageAt, Pages, Scene, SceneHead, Stat, Mono, Body, Card, Row, Formula, Chip } from "../shared";

export const SDefinitions: React.FC = () => {
  const at = [0, pageAt("definitions", 5), pageAt("definitions", 13), pageAt("definitions", 22), pageAt("definitions", 30)];
  return (
    <Scene id="definitions">
      <SceneHead id="definitions" />
      <Pages id="definitions" at={at}>
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 390, width: CW }}>
            <Card label="输入：一块面板" accent={C.cyan} style={{ height: 190 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 40 }}>
                <Formula size={54}>X ∈ R&#123;T × N&#125;</Formula>
                <Body size={FT.label} style={{ width: 760 }}>
                  T 行是时间，N 列是通道。八通道面板是 2657 行、8 列；窗口宽度 96，步长 1。
                </Body>
              </div>
            </Card>
          </div>
          <div style={{ position: "absolute", left: PAD, top: 620, width: CW }}>
            <div style={{ display: "flex", gap: 24 }}>
              <Card label="混合 MLP" accent={C.cyan} style={{ width: 560, height: 300 }}>
                <Formula size={40}>Z′ = Z + W₂σ(W₁Z)</Formula>
                <Body size={FT.label} style={{ marginTop: 14 }}>
                  每个时刻的 N 个通道，乘一个 N×N。参数量 144。
                </Body>
              </Card>
              <Card label="变量注意力" accent={C.amber} style={{ width: 560, height: 300 }}>
                <Formula size={40}>Z = Embed(Xᵀ)</Formula>
                <Body size={FT.label} style={{ marginTop: 14 }}>
                  每个变量一个 token，注意力在 N 个 token 上。
                </Body>
              </Card>
              <Card label="图通道" accent={C.violet} style={{ width: 560, height: 300 }}>
                <Formula size={40}>H′ = σ(Â H W)</Formula>
                <Body size={FT.label} style={{ marginTop: 14 }}>
                  邻居来自相关 kNN 图，Â 是加自环并归一化之后的矩阵。
                </Body>
              </Card>
            </div>
          </div>
          <div style={{ position: "absolute", left: PAD, top: 960, width: CW }}>
            <Body size={FT.label}>
              三种做法都是“通道混合”的特例：区别只在混合矩阵从哪里来——学出来、算出来、还是从图上取。
            </Body>
          </div>
        </AbsoluteFill>

        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 400, width: 1100 }}>
            <Card label="通道混合（第一个方向）" accent={C.cyan} style={{ height: 230 }}>
              <Formula size={52}>Z′ = Z + W₂ · σ(W₁ Z + b₁) + b₂</Formula>
              <Body size={FT.label} style={{ marginTop: 14 }}>
                W₁ 是 H×N，W₂ 是 N×H。逐时间步作用，不动时间轴。
              </Body>
            </Card>
            <Card label="时间混合（第二个方向）" accent={C.coral} style={{ height: 230, marginTop: 26 }}>
              <Formula size={52}>Z″ = Z′ + σ(Z′ W₃ + b₃) · W₄ + b₄</Formula>
              <Body size={FT.label} style={{ marginTop: 14 }}>
                W₃ 是 T×H，W₄ 是 H×T。逐通道作用，不动通道轴。
              </Body>
            </Card>
          </div>
          <div style={{ position: "absolute", left: PAD + 1140, top: 400, width: 580 }}>
            <Stat label="通道混合参数" value="2NH + H + N" sub="N = 8，H = 8 → 144" accent={C.cyan} style={{ height: 210 }} />
            <Stat label="时间混合参数" value="2TH + H + T" sub="T = 96 → 18,624" accent={C.coral} style={{ height: 210, marginTop: 40 }} />
          </div>
          <div style={{ position: "absolute", left: PAD, top: 880, width: CW }}>
            <Row name="残差" value="两个方向都是加在输入上，不是替换" note="清零权重 → 恒等，这是第一条断言" width={1200} />
          </div>
        </AbsoluteFill>

        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 400, width: 1080 }}>
            <Card label="维度倒置：每列一个 token" accent={C.amber} style={{ height: 460 }}>
              <Formula size={46}>Z = Embed(Xᵀ) ∈ R&#123;N × D&#125;</Formula>
              <Mono size={FT.body} color={C.amber} style={{ display: "block", marginTop: 16 }}>8 个变量 → 8 个 token，每个 D = 32 维</Mono>
              <Formula size={46} style={{ marginTop: 18 }}>A = softmax( Z W_Q (Z W_K)ᵀ / √d_k )</Formula>
              <Body size={FT.label} style={{ marginTop: 16 }}>
                注意力在 8 个变量之间算，再乘 Z W_V 输出。时间维只出现在嵌入里。
              </Body>
            </Card>
          </div>
          <div style={{ position: "absolute", left: PAD + 1120, top: 400, width: 600 }}>
            <Stat label="复杂度" value="O(N² + NH)" sub="不是 T²；H 是注意力头数 × 维度" accent={C.amber} style={{ height: 210 }} />
            <Stat label="参数量" value="53,248" sub="D = 32，N = 8，d_ff = 3D" accent={C.violet} style={{ height: 210, marginTop: 40 }} />
          </div>
          <div style={{ position: "absolute", left: PAD, top: 900, width: CW }}>
            <Chip color={C.amber}>变量即 token</Chip>
            <Chip color={C.inkFaint}>时间顺序只影响嵌入的输入顺序</Chip>
          </div>
        </AbsoluteFill>

        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 390, width: 1080 }}>
            <Card label="第一步：从相关到图" accent={C.violet} style={{ height: 270 }}>
              <Formula size={46}>A_ij = corr(x_i, x_j)，N(i) = top-k 邻居</Formula>
              <Body size={FT.label} style={{ marginTop: 16 }}>
                相关矩阵稠密，kNN 只保留每个节点最强的 k 条边，对称化之后得到稀疏图。
              </Body>
            </Card>
            <Card label="第二步：加自环、归一化、传递" accent={C.cyan} style={{ height: 300, marginTop: 24 }}>
              <Formula size={44}>Ã = A + I，Â = D⁻¹ᐟ² Ã D⁻¹ᐟ²</Formula>
              <Formula size={44} style={{ marginTop: 10 }}>H′ = σ( Â H W )</Formula>
              <Body size={FT.label} style={{ marginTop: 14 }}>
                自环保证孤立节点不丢自己；D 是度矩阵，归一化让每行权重和为 1。
              </Body>
            </Card>
          </div>
          <div style={{ position: "absolute", left: PAD + 1120, top: 390, width: 600 }}>
            <Stat label="两节点金例" value="0.5" sub="加自环归一化后每行 0.5 / 0.5" accent={C.violet} style={{ height: 210 }} />
            <Stat label="h = 1 时输出" value="1" sub="精确等于 1，不是约等于" accent={C.cyan} style={{ height: 210, marginTop: 40 }} />
          </div>

        </AbsoluteFill>

        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 400, width: 1160 }}>
            <Card label="书里的位置（印刷版）" accent={C.cyan} style={{ height: 430 }}>
              <Row name="3.3.6" value="三种通道策略" note="独立 / 完全依赖 / 部分依赖，表 3.4 在 55 页" width={1100} />
              <Row name="3.4.3" value="图神经网络通道建模" note="静态图 MTGNN、时变图 TPGNN、时空图" width={1100} />
              <Row name="3.4.4" value="MLP 与卷积通道混合" note="TS-Mixer 的通道混合、Informer 的通道合并" width={1100} />
              <Row name="本集" value="三个模块 = 三个代表" note="混合 MLP、变量注意力、kNN-GCN" width={1100} />
            </Card>
          </div>
          <div style={{ position: "absolute", left: PAD + 1200, top: 400, width: 520 }}>
            <Stat label="本集页码" value="p.55 – 62" sub="按印刷版引用，PDF 版式不同" style={{ height: 430 }} />
          </div>
        </AbsoluteFill>
      </Pages>
    </Scene>
  );
};