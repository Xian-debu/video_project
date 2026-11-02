import React from "react";
import { AbsoluteFill } from "remotion";
import { C, FONT, FT } from "../../design/tokens";
import {
  PAD, M, pagesOf, Pages, Scene, SceneHead, Card, Body, Chip, Row, CodeBlock, Formula, fmt4,
} from "../shared";

const d = M.data;

export const SImplementation: React.FC = () => {
  const at = pagesOf("implementation");
  return (
    <Scene id="implementation">
      <SceneHead id="implementation" />
      <Pages id="implementation" at={at}>
        {/* 页一：建图 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 290, width: 620 }}>
            <div style={{ fontFamily: FONT.serif, fontSize: FT.h1, color: C.ink, lineHeight: 1.18 }}>
              一行阈值，
              <br />
              一张图。
            </div>
            <Body style={{ marginTop: 20, width: 600 }}>
              {"三十条收益序列先转成三十乘一千九百四十二的矩阵，两两算皮尔逊相关系数，绝对值过 " + M.graph.theta + " 就记一条边；对角线清零，免得自己跟自己连。"}
            </Body>
            <div style={{ marginTop: 20 }}>
              <Row name="节点" value={d.cols + " 只"} note="每只股票一个" color={C.cyan} width={600} />
              <Row name="候选对" value={d.pairs + " 对"} note="30 × 29 ÷ 2" color={C.violet} width={600} />
              <Row name="留下的边" value={d.edges + " 条"} note={"|corr| ≥ " + M.graph.theta} color={C.amber} width={600} />
            </div>
          </div>
          <div style={{ position: "absolute", left: 700, top: 280, width: 1150 }}>
            <CodeBlock
              title="TsBase/Algos/Ch05/Gcn.hs · buildGraph"
              width={1100}
              size={21}
              lines={[
                { t: "buildGraph theta series = clearDiag corrMat" },
                { t: "  where" },
                { t: "    corrMat = V.generate n $ \\i -> V.generate n $ \\j ->" },
                { t: "      if i == j then 0" },
                { t: "      else if abs ((pearsonCorr mat) V.! i V.! j) >= theta" },
                { t: "        then 1 else 0", hi: true },
                { t: "" },
                { t: "-- 建图用 |corr| >= theta（负相关也是关系），对角清零", dim: true },
              ]}
            />
          </div>
        </AbsoluteFill>

        {/* 页二：归一化 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 290, width: 640 }}>
            <div style={{ fontFamily: FONT.serif, fontSize: FT.h1, color: C.ink, lineHeight: 1.18 }}>
              先加自环，
              <br />
              再按度数缩。
            </div>
            <Body style={{ marginTop: 20, width: 620 }}>
              {"孤立节点没有邻居，行和为 0 会除零；给每个节点补一条自环，度数至少是 1，再乘上两端度数的负二分之一次方。一行代码，两个坑一起躲掉。"}
            </Body>
            <div style={{ marginTop: 24 }}>
              <Formula size={46} color={C.cyan}>{"P = D̃⁻¹ᐟ² (A + I) D̃⁻¹ᐟ²"}</Formula>
            </div>
          </div>
          <div style={{ position: "absolute", left: 760, top: 280, width: 1100 }}>
            <CodeBlock
              title="Gcn.hs · normalizeAdj"
              width={1040}
              size={21}
              lines={[
                { t: "normalizeAdj a = V.imap rowFun tilde" },
                { t: "  where" },
                { t: "    tilde = addSelfLoops (clearDiag a)", hi: true },
                { t: "    degs  = V.map V.sum tilde" },
                { t: "    invD i | d <= 0    = 0", dim: true },
                { t: "           | otherwise = 1 / sqrt d" },
                { t: "      where d = degs V.! i" },
                { t: "    rowFun i row = V.imap (\\j v -> invD i * v * invD j) row", hi: true },
              ]}
            />
          </div>
        </AbsoluteFill>

        {/* 页三：一层 GCN */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 290, width: 640 }}>
            <div style={{ fontFamily: FONT.serif, fontSize: FT.h1, color: C.ink, lineHeight: 1.18 }}>
              一层就是
              <br />
              三次乘法。
            </div>
            <Body style={{ marginTop: 20, width: 620 }}>
              {"先乘归一化邻接把邻居的消息平均过来，再乘权重、加偏置、过 tanh。两层叠起来，参数只有 " + M.gcn.params + " 个——和三十只股票的数量无关。"}
            </Body>
            <div style={{ marginTop: 20, display: "flex", gap: 12, flexWrap: "wrap" }}>
              <Chip color={C.cyan}>{"W1 5×16"}</Chip>
              <Chip color={C.violet}>{"W2 16×3"}</Chip>
              <Chip color={C.amber}>{M.gcn.params + " 参数"}</Chip>
            </div>
          </div>
          <div style={{ position: "absolute", left: 740, top: 250, width: 1120 }}>
            <CodeBlock
              title="Gcn.hs · gcnLayerB / addBias"
              width={1060}
              size={21}
              lines={[
                { t: "gcnLayerB :: Matrix -> Matrix -> Matrix -> V.Vector Double -> Matrix" },
                { t: "gcnLayerB p x w b =" },
                { t: "  tanhM (addBias (matMul (matMul p x) w) b)", hi: true },
                { t: "" },
                { t: "addBias :: Matrix -> V.Vector Double -> Matrix" },
                { t: "addBias m b = V.map (V.zipWith (+) b) m" },
                { t: "" },
                { t: "-- P X 把邻居消息聚到每个节点，再乘 W、加 b、过 tanh", dim: true },
              ]}
            />
          </div>
        </AbsoluteFill>

        {/* 页四：GAT */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 290, width: 640 }}>
            <div style={{ fontFamily: FONT.serif, fontSize: FT.h1, color: C.ink, lineHeight: 1.18 }}>
              打分用两组权重，
              <br />
              省掉拼接。
            </div>
            <Body style={{ marginTop: 20, width: 620 }}>
              {"书里写 a 转置乘上拼接向量；拆开就是 a1 点乘自己的表示加 a2 点乘邻居的表示。省掉 2F 维拼接，数值完全等价——梯度核对会钉住这一条。打分过 LeakyReLU，负半轴斜率 0.2，再 softmax。"}
            </Body>
            <div style={{ marginTop: 20 }}>
              <Row name="头数 × 维度" value={M.gat.heads + " × " + M.gat.dim} note="拼成 16 维" color={C.violet} width={600} />
              <Row name="参数" value={String(M.gat.params)} note="一层就把 GCN 翻倍" color={C.amber} width={600} />
            </div>
          </div>
          <div style={{ position: "absolute", left: 760, top: 266, width: 1100 }}>
            <CodeBlock
              title="Gat.hs · gatScores"
              width={1030}
              size={20}
              lines={[
                { t: "data GatHead = GatHead" },
                { t: "  { ghW :: Matrix, ghA1, ghA2 :: V.Vector Double }", hi: true },
                { t: "" },
                { t: "gatScores h x = V.map (\\row -> leakyRelu <$> row) raw" },
                { t: "  where" },
                { t: "    wh  = matMul x (ghW h)" },
                { t: "    raw = V.generate n $ \\i -> V.generate n $ \\j ->" },
                { t: "      dot (ghA1 h) (wh V.! i) + dot (ghA2 h) (wh V.! j)", hi: true },
              ]}
            />
          </div>
        </AbsoluteFill>

        {/* 页五：掩码 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 290, width: 640 }}>
            <div style={{ fontFamily: FONT.serif, fontSize: FT.h1, color: C.ink, lineHeight: 1.18 }}>
              非邻居不是零，
              <br />
              是负无穷。
            </div>
            <Body style={{ marginTop: 20, width: 620 }}>
              {"把非邻居的打分改成负十的三十次方，减完行最大值之后 exp 精确下溢成零——不是「很小」，是精确的零。行和仍然是 1，只在本来的邻居上归一化。"}
            </Body>
            <div style={{ marginTop: 20 }}>
              <Row name="屏蔽对数" value="-1.0e30" note="负十的三十次方" color={C.coral} width={600} />
              <Row name="非邻居 α" value="0.0000" note="精确下溢" color={C.cyan} width={600} />
              <Row name="行和" value="1.0000" note="只在本来的邻居上" color={C.violet} width={600} />
            </div>
          </div>
          <div style={{ position: "absolute", left: 740, top: 250, width: 1120 }}>
            <CodeBlock
              title="Gat.hs · maskedSoftmax（Attention.hs 同款）"
              width={1060}
              size={20}
              lines={[
                { t: "maskLogit :: Double" },
                { t: "maskLogit = -1.0e30", hi: true },
                { t: "" },
                { t: "maskedSoftmax mask scores = V.zipWith softRow mask scores" },
                { t: "  where" },
                { t: "    softRow m z = let masked = V.zipWith keep m z" },
                { t: "                       mx = V.maximum masked" },
                { t: "                       ex = V.map (\\v -> exp (v - mx)) masked", dim: true },
                { t: "                   in V.map (/ V.sum ex) ex" },
                { t: "    keep mi zi = if mi > 0 then zi else maskLogit", hi: true },
              ]}
            />
          </div>
        </AbsoluteFill>

        {/* 页六：缩放与梯度核对 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 290, width: 640 }}>
            <div style={{ fontFamily: FONT.serif, fontSize: FT.h1, color: C.ink, lineHeight: 1.18 }}>
              除以根号 d，
              <br />
              再用数值梯度验收。
            </div>
            <Body style={{ marginTop: 20, width: 620 }}>
              {"点积的方差随维度线性增长，softmax 会随之饱和；先除以根号维度再归一化。三套实现都写了中心差分的数值梯度核对，最大相对误差在十的负十次方量级，干净得可疑——这正是要复现一次的理由。"}
            </Body>
            <div style={{ marginTop: 18 }}>
              <Row name="GCN 梯度差" value={M.gcn.gradDiff.toExponential(3)} note="解析 vs 数值" color={C.cyan} width={600} />
              <Row name="GAT 梯度差" value={M.gat.gradDiff.toExponential(3)} note="解析 vs 数值" color={C.violet} width={600} />
              <Row name="注意力梯度差" value={M.attn.gradDiff.toExponential(3)} note="解析 vs 数值" color={C.amber} width={600} />
            </div>
          </div>
          <div style={{ position: "absolute", left: 740, top: 236, width: 1120 }}>
            <CodeBlock
              title="Attention.hs · attnScores ／ Gcn.hs · gcnGradCheck"
              width={1060}
              size={20}
              lines={[
                { t: "attnScale :: Int -> Double" },
                { t: "attnScale d = 1 / sqrt (fromIntegral d)", hi: true },
                { t: "" },
                { t: "attnScores h x = scaleM sc (matMul q (transposeM k))" },
                { t: "  where q = matMul x (ahWq h)" },
                { t: "        k = matMul x (ahWk h)" },
                { t: "        sc = attnScale (matrixCols (ahWq h))" },
                { t: "" },
                { t: "gcnGradCheck h p params b = maximum (V.zipWith relErr a n)", hi: true },
                { t: "  where a = flattenParams (gcnGrads p params b)" },
                { t: "        n = flattenParams (gcnNumGrads h p params b)", dim: true },
              ]}
            />
          </div>
        </AbsoluteFill>
      </Pages>
    </Scene>
  );
};
