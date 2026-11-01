import React from "react";
import { AbsoluteFill } from "remotion";
import { C, FONT, FT } from "../../design/tokens";
import { PAD, M, pageAt, Pages, Scene, SceneHead, Card, Row, Body, Formula, CodeBlock, K } from "../shared";

export const SDefinitions: React.FC = () => {
  const at = [0, pageAt("definitions", 9), pageAt("definitions", 19), pageAt("definitions", 31)];
  return (
    <Scene id="definitions">
      <SceneHead id="definitions" />
      <Pages id="definitions" at={at}>
        {/* 页一：先验与注意力 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 292, width: 960 }}>
            <Card label="式(4.17) 位置先验" accent={C.cyan}>
              <Formula size={46} note="离得越近，先验给的权重越大；σ 是先验的带宽">
                {"P_ij ∝ exp( −(i − j)² / (2σ²) )"}
              </Formula>
            </Card>
            <Card label="式(4.18) 序列内注意力" accent={C.violet} style={{ marginTop: 20 }}>
              <Formula size={46} note="T 是注意力的温度，越小越尖；这一集 T = 0.1">
                {"A_ij = softmax_j( −‖x_i − x_j‖² / (2T²) )"}
              </Formula>
            </Card>
          </div>
          <div style={{ position: "absolute", left: 1080, top: 292, width: 770 }}>
            <Card label="两个旋钮，各管一件事" accent={C.amber}>
              <Row name="σ 带宽" value="3.0" note="只进先验，不进注意力" width={720} />
              <Row name="T 温度" value="0.1" note="只进注意力，只影响锐度" width={720} />
              <Row name="输入 x" value="逐窗 z 分数" note="窗口自己的均值/标准差" width={720} />
              <Row name="窗长" value={String(M.windows.C) + " 天"} note="整段落在同一 split 内" width={720} />
            </Card>
            <Body size={FT.meta} color={C.inkFaint} style={{ marginTop: 18, width: 740 }}>
              这两个数不是超参搜索出来的，是照着「先验管带宽、温度管锐度」的分工定的。把它们混成同一个数，会直接毁掉信号，验证段会交代。
            </Body>
          </div>
        </AbsoluteFill>

        {/* 页二：对称 KL */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 292, width: 1000 }}>
            <Card label="式(4.19) 逐行对称 KL" accent={C.cyan}>
              <Formula size={44} note="逐行比两个分布：先验 P_i 和注意力 A_i，两个方向都算，再按行求和">
                {"s = Σ_i [ KL(P_i‖A_i) + KL(A_i‖P_i) ]"}
              </Formula>
              <Formula size={36} color={C.inkDim} note="行内两边都夹一个 1e-8，保证零权重不产生 NaN" style={{ marginTop: 14 }}>
                {"KL(p‖a) = Σ_j p_j · log( p_j / a_j )"}
              </Formula>
            </Card>
          </div>
          <div style={{ position: "absolute", left: 1120, top: 292, width: 730 }}>
            <Card label="单元测试锁住的黄金值" accent={C.amber}>
              <Row name="自身对称 KL" value={M.golden.symKlSelf.toFixed(1)} note="P 跟自己比必须恰好 0" width={680} />
              <Row name="行和最大偏差" value={M.golden.rowSumMaxDev.toExponential(1)} note="注意力行和 = 1" width={680} />
              <Row name="先验行和偏差" value={M.golden.priorRowSumMaxDev.toExponential(1)} note="先验行和 = 1" width={680} />
              <Row name="规格锁定总和" value={M.golden.specTotal.toFixed(4)} note="14 条测试，逐位比对" width={680} color={C.cyan} />
            </Card>
            <Body size={FT.meta} color={C.inkFaint} style={{ marginTop: 18, width: 700 }}>
              计划书里早期估的数字是 1.4723，实测锁在 1.7578。以实测为准，偏差在边界段交代。
            </Body>
          </div>
        </AbsoluteFill>

        {/* 页三：次邻域池化 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 292, width: 980 }}>
            <Card label="式(4.20) 环形平均" accent={C.amber}>
              <Formula size={44} note="先把左右 k 个邻居混进来，再比先验；边界处环绕取，所以叫环形">
                {"Ā^k_ij = 1/(2k+1) · Σ_{l=−k..k} A_i,j+l"}
              </Formula>
            </Card>
            <Card label="次邻域分数" accent={C.amber} style={{ marginTop: 20 }}>
              <Formula size={44} note="池化后仍然逐行和先验比，再按行求和；软最大温度固定为 1">
                {"s_SAT = Σ_i [ KL(P_i‖Ā_i) + KL(Ā_i‖P_i) ]"}
              </Formula>
            </Card>
            <Body size={FT.meta} color={C.inkDim} style={{ marginTop: 22, width: 940 }}>
              池化把左右 k 个邻居的权重摊进带内：形状替换外散的权重因此被拉回来，KL 才抓得住；单点尖峰本来就把邻居拉平，池化抹不掉。环形边界省掉补零带来的边缘假异常，代价是误报变多——这正是它比关联差异吵的原因。
            </Body>
          </div>
          <div style={{ position: "absolute", left: 1100, top: 292, width: 750 }}>
            <Card label="为什么池化能补召回" accent={C.cyan}>
              <Row name="单点尖峰" value="整行坍缩" note="邻居也被拉平，池化后仍高" width={700} />
              <Row name="形状替换" value="能量外散" note="外散的部分被池化抓回来" width={700} />
              <Row name="代价" value="误报上升" note="池化本身把噪声也抹平了" width={700} color={C.coral} />
            </Card>
            <Card label="两个参数" accent={C.amber} style={{ marginTop: 18 }}>
              <Row name="k1 半宽" value={String(M.params.satK1)} note="窄池化，抓单点" width={700} />
              <Row name="k2 半宽" value={String(M.params.satK2)} note="宽池化，抓形状" width={700} />
            </Card>
          </div>
        </AbsoluteFill>

        {/* 页四：两阶段 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 292, width: 1020 }}>
            <Card label="式(4.21) 第一阶段：压成隐向量" accent={C.violet}>
              <Formula size={42} note="100 维窗口 → 32 维隐向量 → 重建回 100 维，得到粗重建 x1">
                {"h = tanh(W₁x + b₁) ,  x₁ = tanh(W₂h + b₂)"}
              </Formula>
            </Card>
            <Card label="式(4.22) 第二阶段：带着焦点重建" accent={C.violet} style={{ marginTop: 18 }}>
              <Formula size={42} note="焦点 f 是粗重建与输入的逐点平方差，按中位残差缩放后拼进输入">
                {"x̂ = tanh(W_b · tanh(W_a [x ; f] + b_a) + b_b)"}
              </Formula>
            </Card>
          </div>
          <div style={{ position: "absolute", left: 1140, top: 292, width: 710 }}>
            <Card label="维度与损失" accent={C.amber}>
              <Row name="第一阶" value="100 → 32 → 100" note="32 是瓶颈" width={660} />
              <Row name="第二阶" value="(100+100) → 64 → 100" note="输入拼上焦点" width={660} />
              <Row name="参数" value={M.params.tranParams.toLocaleString("en-US")} note="全部手写反向" width={660} />
              <Row name="损失" value="两阶 MSE 相加" note="粗重建也要像输入" width={660} />
            </Card>
            <Card label="训练配方" accent={C.cyan} style={{ marginTop: 18 }}>
              <Row name="轮数 / 批" value={M.params.tranEpochs + " / " + M.params.tranBatch} note="小批量 Adam" width={660} />
              <Row name="学习率" value={M.params.tranLr} note="按批平均梯度" width={660} />
              <Row name="训练窗" value={String(M.params.tranTrainWindows)} note="每 4 窗取 1，全训练段" width={660} />
            </Card>
          </div>
        </AbsoluteFill>
      </Pages>
    </Scene>
  );
};
