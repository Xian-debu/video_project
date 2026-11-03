import React from "react";
import { AbsoluteFill } from "remotion";
import { C, FONT, FT } from "../../design/tokens";
import { M, Body, Card, Chip, CodeBlock, KV, PAD, Pages, Scene, SceneHead, pagesOf } from "../shared";

export const ImplementationScene: React.FC = () => (
  <Scene id="implementation">
    <SceneHead id="implementation" />
    <Pages id="implementation" at={pagesOf("implementation")}>
      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 292, width: 560 }}>
          <Body size={FT.h2} color={C.ink} style={{ lineHeight: 1.28 }}>三个模块，<br />三种平均。</Body>
          <Body style={{ marginTop: 24 }}>
            它们共用同一个模型接口：一个拟合函数，一个预测函数。所以任何候选都能直接塞进集成。三个模块都是纯函数，没有随机数。
          </Body>
          <div style={{ display: "flex", marginTop: 22 }}>
            <KV k="模块" v="3" color={C.cyan} />
            <KV k="单测" v="27 条" color={C.violet} />
            <KV k="全量" v="2,138 条" color={C.amber} />
          </div>
        </div>
        <div style={{ position: "absolute", left: 700, top: 276, width: 1150 }}>
          <CodeBlock width={1060} title="TsBase.Algos.Ch06 · 三个入口" lines={[
            { t: "weightedAvg :: Vector Double -> [Vector Double] -> Vector Double" },
            { t: "medianEns   :: [Vector Double] -> Vector Double" },
            { t: "fitWeights  :: [[Double]] -> [Double] -> Vector Double" },
            { t: "" },
            { t: "iterReweight :: Double -> Int -> [Vector Double]" },
            { t: "             -> Vector Double -> (Vector Double, [Int])", dim: true },
            { t: "" },
            { t: "noisyVariants :: Int -> Double -> Gen -> Series -> [Series]" },
            { t: "noiseEnsemblePredict :: [Model] -> Series -> Double", dim: true },
          ]} />
          <div style={{ marginTop: 16, display: "flex", gap: 10 }}>
            <Chip color={C.cyan}>纯函数</Chip>
            <Chip color={C.violet}>无随机（除噪声）</Chip>
            <Chip color={C.amber}>逐位可复现</Chip>
          </div>
        </div>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 292, width: 540 }}>
          <Body size={FT.h2} color={C.ink} style={{ lineHeight: 1.28 }}>学习权重：<br />解一次方程。</Body>
          <Body style={{ marginTop: 24 }}>
            先算 X 转置乘 X，加惩罚项；再算 X 转置乘 y。解一个六元线性方程组，投影到单纯形，归一化。
          </Body>
        </div>
        <div style={{ position: "absolute", left: 660, top: 270, width: 1190 }}>
          <CodeBlock width={1100} title="fitWeights · 约束岭回归（λ = 1e-3）" lines={[
            { t: "fitWeights xrows y = normalize (project raw)" },
            { t: "  where" },
            { t: "    p  = length (head xrows)" },
            { t: "    a  = foldl\' addOuter (scaleMat lam identity) xrows" },
            { t: "    b  = foldl\' addVec zero (zipWith scale xrows y)" },
            { t: "    w0 = solveLin a b" },
            { t: "    q  = solveLin a (replicate p 1)" },
            { t: "    mu = (1 - sum w0) / sum q", hi: true },
            { t: "    raw = map (\\wi qi -> max 0 (wi + mu * qi)) (zip w0 q)", hi: true },
            { t: "    normalize v = if sum v <= 1e-12 then equal p else map (/ sum v) v" },
          ]} />
        </div>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 292, width: 540 }}>
          <Body size={FT.h2} color={C.ink} style={{ lineHeight: 1.28 }}>迭代：<br />误差驱动。</Body>
          <Body style={{ marginTop: 24 }}>
            每轮先算当前集成的误差，再算每个模型单独的误差。差值乘以步长加到权重上，负的截零，归一化。全零时回退等权。
          </Body>
          <div style={{ marginTop: 22 }}>
            <KV k="剔除" v="最多 95 个" color={C.coral} />
          </div>
        </div>
        <div style={{ position: "absolute", left: 660, top: 270, width: 1190 }}>
          <CodeBlock width={1100} title="iterReweight · 十轮以内收敛" lines={[
            { t: "iterReweight eta rounds ps y = go rounds initial" },
            { t: "  where" },
            { t: "    errs = map (mae y) ps" },
            { t: "    step w = let eEns = mae y (weightedAvg w ps)" },
            { t: "                 raw = zipWith (\\wi ei -> max 0 (wi + eta * (eEns - ei))) w errs", hi: true },
            { t: "             in if sum raw <= 1e-12 then equalWeights else map (/ sum raw) raw" },
            { t: "    go 0 w = (w, [i | (i, wi) <- zip [0..] w, wi == 0])" },
            { t: "    go k w = go (k - 1) (step w)", dim: true },
            { t: "    initial = equalWeights (length ps)" },
          ]} />
        </div>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 292, width: 540 }}>
          <Body size={FT.h2} color={C.ink} style={{ lineHeight: 1.28 }}>噪声：<br />先复制，再平均。</Body>
          <Body style={{ marginTop: 24 }}>
            把训练序列加上小扰动，复制多份。每份拟合一个模型，再平均预测。扰动幅度按序列标准差缩放，同一个种子结果完全可复现。
          </Body>
          <div style={{ marginTop: 22, display: "flex", gap: 10 }}>
            <Chip color={C.cyan}>σ = 0 退化</Chip>
            <Chip color={C.violet}>Box-Muller</Chip>
            <Chip color={C.amber}>LCG</Chip>
          </div>
        </div>
        <div style={{ position: "absolute", left: 660, top: 270, width: 1190 }}>
          <CodeBlock width={1100} title="noisyVariants · 线性同余 + Box-Muller" lines={[
            { t: "noisyVariants k sigma (Gen seed) xs" },
            { t: "  | sigma <= 0 = replicate k xs", hi: true },
            { t: "  | otherwise  = [zipWith (+) xs (draws scale seed) | ...]" },
            { t: "  where scale = sigma * populationSd xs" },
            { t: "" },
            { t: "lcg s = (1103515245 * s + 12345) mod 2147483647" },
            { t: "normalPair u1 u2 = (r * cos t, r * sin t)", dim: true },
            { t: "  where r = sqrt (-2 * log u1); t = 2 * pi * u2", dim: true },
            { t: "" },
            { t: "noiseEnsemblePredict ms xs =", dim: true },
            { t: "  weightedAvg (equalWeights (length ms)) (map (forecast xs) ms)", dim: true },
          ]} />
        </div>
      </AbsoluteFill>
    </Pages>
  </Scene>
);
