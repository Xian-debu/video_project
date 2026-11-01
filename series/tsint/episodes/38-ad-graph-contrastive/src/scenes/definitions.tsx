import React from "react";
import { AbsoluteFill } from "remotion";
import { C, FONT, FT } from "../../design/tokens";
import { PAD, M, pagesOf, Pages, Scene, SceneHead, Card, Row, Body, Verdict, Chip, K, Stat, Formula, fmtInt, fmtP } from "../shared";

export const SDefinitions: React.FC = () => {
  const at = pagesOf("definitions");
  const v = M.aug.views;
  return (
    <Scene id="definitions">
      <SceneHead id="definitions" />
      <Pages id="definitions" at={at}>
        {/* 页一：邻接 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 288, width: 1010 }}>
            <Formula size={42} note="式(4.41) · 每行恰好三条边 · 有向">
              {"A(i,j) = 1  ⟺  j ∈ TopK₃( cos(hᵢ, hⱼ) )"}
            </Formula>
            <Card label="五个约定" accent={C.cyan} style={{ marginTop: 26 }}>
              <Row name="节点" value="十二只票" note={"每只一条 " + M.windows.C + " × 12 的窗"} width={960} />
              <Row name="边" value="余弦前三个邻居" note="相似度最高的三只，才连边" width={960} />
              <Row name="方向" value="允许不对称" note={"实测只有 " + (M.gnn.symFrac * 100).toFixed(1) + "% 的边成对出现"} width={960} />
              <Row name="权重" value="硬 0/1" note="没有权重，也就没有对邻接的梯度" width={960} />
              <Row name="出度" value={M.gnn.degree.toFixed(0) + " 条"} note="每行和恰好三条，手工可核" width={960} />
            </Card>
          </div>
          <div style={{ position: "absolute", left: 1150, top: 288, width: 700 }}>
            <Body size={FT.lead} color={C.inkDim} style={{ width: 660, lineHeight: 1.7 }}>
              行业标签是别人给的。这里的邻接是从表示里长出来的：谁和谁在潜空间里方向接近，谁就是邻居。
            </Body>
            <Card label="三个后果" accent={C.amber} style={{ marginTop: 26 }}>
              <Row name="邻接不训练" value="选出来就定" note="TopK 是离散操作，传不回梯度" width={640} />
              <Row name="表示决定图" value="每步都变" note="编码器一变，邻居就换一批" width={640} />
              <Row name="图决定表示" value="交替进行" note="这就是这一集最难的地方" width={640} />
            </Card>
          </div>
        </AbsoluteFill>

        {/* 页二：消息传递 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 288, width: 1010 }}>
            <Formula size={34} note="式(4.42) · 一层传播 · tanh 有界">
              {"hᵢ′ = tanh( W_s hᵢ + (1/|N(i)|) Σ_{j∈N(i)} W_n hⱼ + b )"}
            </Formula>
            <Card label="四个细节" accent={C.cyan} style={{ marginTop: 26 }}>
              <Row name="自环" value="自己也进来" note="W_s 项单独保留自己的信息" width={960} />
              <Row name="度数归一" value="除以邻居数" note="不归一，七只白酒组会压过三只啤酒组" width={960} />
              <Row name="激活" value="tanh" note="有界，跟上一集的解码器一致" width={960} />
              <Row name="层数" value="一层" note="十二个节点，传一次就够了" width={960} />
            </Card>
          </div>
          <div style={{ position: "absolute", left: 1150, top: 288, width: 700 }}>
            <Card label="参数账 · 每个都能手核" accent={C.violet}>
              <Row name="编码器 100→16" value="1,616" note="100 × 16 + 16" width={640} />
              <Row name="自环矩阵 16×16" value="256" note="无偏置" width={640} />
              <Row name="邻居矩阵 16×16" value="256" note="无偏置" width={640} />
              <Row name="共享偏置" value="16" note="传播层只加一次" width={640} />
              <Row name="解码器 16→100" value="1,700" note="16 × 100 + 100" width={640} />
              <Row name="合计" value={M.params.params.toLocaleString("en-US") + " 个"} note="与证据里的 gnn.params 逐位相同" color={C.cyan} width={640} />
            </Card>
            <K style={{ display: "block", marginTop: 16 }}>数一遍，别背。</K>
          </div>
        </AbsoluteFill>

        {/* 页三：分数 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 288, width: 1010 }}>
            <Card label="分数从哪来" accent={C.cyan}>
              <Row name="单点误差" value="重构 MSE" note="十二只票各自算，逐点" width={960} />
              <Row name="窗误差" value="十二个点取最大" note="最响的那只票赢，板块跳就被放大" width={960} />
              <Row name="日分数" value="覆盖该日的窗取最大" note="一天会被一百个窗覆盖" width={960} />
              <Row name="阈值" value="训练段 99 分位" note={M.scores.tauG.toFixed(4) + " / " + M.scores.tauF.toFixed(4)} width={960} />
              <Row name="方向" value="越高越异常" note="与前面三十七集同一个口径" width={960} />
            </Card>
          </div>
          <div style={{ position: "absolute", left: 1150, top: 288, width: 700 }}>
            <Card label="数值三条" accent={C.amber}>
              <Row name="邻接" value="0/1" note="不做 softmax，不学权重" width={640} />
              <Row name="余弦" value="先归一化再点积" note={"范数 " + M.cosine.normMin.toFixed(2) + " 至 " + M.cosine.normMax.toFixed(2) + "，不归一会偏"} width={640} />
              <Row name="分数" value="不必再标准化" note="逐窗算，窗内已 z 分数化" width={640} />
            </Card>
            <Body size={FT.meta} color={C.inkFaint} style={{ marginTop: 16, width: 660 }}>
              三条都不是优化，是「算出来的数能不能互相比」的前提。
            </Body>
            <div style={{ display: "flex", gap: 14, marginTop: 18 }}>
              <Stat label="干净日中位" value={M.scores.cleanMedianGraph.toFixed(3)} sub="测试段" valueSize={40} valueColor={C.coral} />
              <Stat label="阈值" value={M.scores.tauG.toFixed(3)} sub="训练 99 分位" valueSize={40} />
            </div>
          </div>
        </AbsoluteFill>

        {/* 页四：对比损失 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 288, width: 1010 }}>
            <Formula size={36} note="式(4.43) · 温度 τ 控制分布的软硬">
              {"L = − log [ exp(sim(zᵢ, zᵢ⁺)/τ) / Σⱼ exp(sim(zᵢ, zⱼ)/τ) ]"}
            </Formula>
            <Card label="三个部件" accent={C.cyan} style={{ marginTop: 26 }}>
              <Row name="正样本" value="同一只票的扰动视图" note={"抖动 · 缩放 · 裁剪 · 打乱 · 掩码 · 差分"} width={960} />
              <Row name="负样本" value="同窗另外十一只票" note="不构造，直接拿来当反例" width={960} />
              <Row name="温度" value="0.05 / 0.1 / 0.5" note={"损失 " + M.infonce.lossTau005.toFixed(4) + " / " + M.infonce.lossTau01.toFixed(4) + " / " + M.infonce.lossTau05.toFixed(4)} width={960} />
              <Row name="距离" value={"正 " + M.infonce.posMean.toFixed(3) + " · 负 " + M.infonce.negMean.toFixed(3)} note="余弦相似度，正样本明显更近" width={960} />
            </Card>
          </div>
          <div style={{ position: "absolute", left: 1150, top: 288, width: 700 }}>
            <Card label="六种增强的实测行为" accent={C.violet}>
              {v.map((a) => (
                <Row key={a.op} name={a.op} value={a.corr == null ? "无定义" : a.corr.toFixed(4)} note={"最大差 " + a.maxAbsDiff.toFixed(3) + " · 峰位 " + a.argmax} width={640} />
              ))}
            </Card>
            <Body size={FT.meta} color={C.inkFaint} style={{ marginTop: 14, width: 660 }}>
              裁剪几乎什么都没做，缩放只改了幅度，分块打乱把序列拆了。对比学习学到的「不变性」，取决于增强到底改了什么。
            </Body>
          </div>
        </AbsoluteFill>
      </Pages>
    </Scene>
  );
};

