import React from "react";
import { AbsoluteFill } from "remotion";
import { C, FONT, FT } from "../../design/tokens";
import { Body, Card, Chip, CodeBlock, KV, M, PAD, Pages, pagesOf, Row, Scene, SceneHead, fmt4 } from "../shared";

export const ImplementationScene: React.FC = () => (
  <Scene id="implementation">
    <SceneHead id="implementation" />
    <Pages id="implementation" at={pagesOf("implementation")}>
      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 300, width: 660 }}>
          <Body size={FT.h2} color={C.ink} style={{ lineHeight: 1.28 }}>抖动：<br />σ 为零时一个数都不动。</Body>
          <Body style={{ marginTop: 24 }}>强度按相对标准差写：s = σ · sd(x)，再给每个点加一个高斯噪声。σ 等于零时直接返回原向量——这是黄金测试要求的第一条。</Body>
          <div style={{ marginTop: 20 }}>
            <KV k="σ" v={M.augment.jitterSigma} color={C.cyan} size={FT.h3} />
            <KV k="同种子" v="逐元素相同" color={C.violet} size={FT.h3} />
          </div>
        </div>
        <div style={{ position: "absolute", left: 760, top: 300, width: 1080 }}>
          <CodeBlock title="Augment.hs · jitter" width={1040} lines={[
            { t: "jitter :: Double -> V.Vector Double -> Gen -> (V.Vector Double, Gen)" },
            { t: "jitter sigma x g0" },
            { t: "  | sigma == 0.0 = (x, g0)", hi: true },
            { t: "  | otherwise = go x g0 []" },
            { t: "  where" },
            { t: "    s = sigma * stdOf x" },
            { t: "    go v g acc" },
            { t: "      | V.null v = (V.fromList (reverse acc), g)" },
            { t: "      | otherwise =" },
            { t: "          let (z, g') = genGauss g" },
            { t: "          in go (V.tail v) g' ((V.head v + s * z) : acc)", hi: true },
          ]} />
        </div>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 300, width: 660 }}>
          <Body size={FT.h2} color={C.ink} style={{ lineHeight: 1.28 }}>时间弯曲：<br />先造位置，再插值。</Body>
          <Body style={{ marginTop: 24 }}>每个点先算一个权重 1 ± 20%，累积和归一化到 [0, 59]，端点钉死在 0 和 59。位置序列严格递增——测试直接查这一条。最后按位置做线性插值。</Body>
          <div style={{ marginTop: 20 }}>
            <Row name="位置" value="60 个" note="端点固定、内部递增" width={620} color={C.amber} />
            <Row name="弯曲强度" value={M.augment.warpPct + " 个百分点"} note="amp = 0.20" width={620} />
          </div>
        </div>
        <div style={{ position: "absolute", left: 760, top: 300, width: 1080 }}>
          <CodeBlock title="Augment.hs · warpPositions / mixup" width={1040} size={FT.meta} lines={[
            { t: "warpPositions :: Int -> Int -> Gen -> (V.Vector Double, Gen)" },
            { t: "warpPositions pct n g0 =" },
            { t: "  let amp = fromIntegral pct / 100.0" },
            { t: "      w = 1.0 + amp * (2.0 * u - 1.0)", hi: true },
            { t: "      cum = scanl1 (+) ws" },
            { t: "      pos = [fromIntegral (n - 1) * c / total | c <- cum]", hi: true },
            { t: "  in (V.fromList pos', g1)" },
            { t: "" },
            { t: "mixup :: Double -> V.Vector Double -> V.Vector Double -> V.Vector Double" },
            { t: "mixup lambda a b = V.zipWith (\\u v -> lambda * u + (1.0 - lambda) * v) a b", hi: true },
          ]} />
        </div>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 300, width: 660 }}>
          <Body size={FT.h2} color={C.ink} style={{ lineHeight: 1.28 }}>InfoNCE：<br />数值稳定版 softmax。</Body>
          <Body style={{ marginTop: 24 }}>先减最大值再取 exp，避免溢出；τ = 0.2 把相似度拉开。候选列表首元素是正例，只有一个候选时直接报错——没有负例，损失无定义。</Body>
          <div style={{ marginTop: 20 }}>
            <Row name="τ" value={M.contrast.tau} note={"黄金值 " + fmt4(M.contrast.infoNce)} width={620} color={C.violet} />
            <Row name="B=3" value={fmt4(M.contrast.uniform)} note="= ln 3" width={620} />
          </div>
        </div>
        <div style={{ position: "absolute", left: 760, top: 300, width: 1080 }}>
          <CodeBlock title="Contrast.hs · infoNce" width={1040} size={FT.meta} lines={[
            { t: "infoNce :: Double -> V.Vector Double -> [V.Vector Double] -> Double" },
            { t: "infoNce tau z cands =" },
            { t: "  case cands of" },
            { t: "    [] -> error \"infoNce: 至少需要一个正例\"" },
            { t: "    [_] -> error \"infoNce: 至少需要一个负例（B=1 时损失无定义）\"", hi: true },
            { t: "    _ ->" },
            { t: "      let sims = map (cosine z) cands" },
            { t: "          mx = maximum sims" },
            { t: "          exps = map (\\s -> exp ((s - mx) / tau)) sims", hi: true },
            { t: "          total = sum exps" },
            { t: "      in negate (log (max 1.0e-300 (head exps / total)))", hi: true },
          ]} />
        </div>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 300, width: 660 }}>
          <Body size={FT.h2} color={C.ink} style={{ lineHeight: 1.28 }}>训练循环：<br />正例是增强，负例是邻居。</Body>
          <Body style={{ marginTop: 24 }}>每条窗口抽两次增强：一次当锚点、一次当正例；批里其余的窗口都当负例。梯度只回传给锚点这一侧——正例被当成常量，这是 SimCLR 的老规矩。</Body>
          <div style={{ marginTop: 20 }}>
            <Row name="批大小" value={M.contrast.batch} note="32 条窗口" width={620} />
            <Row name="轮数" value={M.contrast.epochs} note="每轮重新洗牌" width={620} color={C.violet} />
            <Row name="优化器" value="Adam · 0.01" note="全批量" width={620} />
          </div>
        </div>
        <div style={{ position: "absolute", left: 760, top: 300, width: 1080 }}>
          <CodeBlock title="Contrast.hs · trainEncoder" width={1040} size={FT.meta} lines={[
            { t: "trainEncoderLosses :: CntParams -> [Series] -> (Encoder, [Double])" },
            { t: "trainEncoderLosses cfg series =" },
            { t: "      b = max 2 (min (cpBatch cfg) n)" },
            { t: "      go st k losses" },
            { t: "        | k > cpEpochs cfg = (Encoder (tsP st), reverse losses)" },
            { t: "        | otherwise =" },
            { t: "            let order = shuffleIndices (cpSeed cfg + k) n", hi: true },
            { t: "                (st', ls) = foldl' step ... batches" },
            { t: "            in go st' (k + 1) (meanLoss : losses)" },
            { t: "trainEncoder cfg series = fst (trainEncoderLosses cfg series)", hi: true },
          ]} />
        </div>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 300, width: 660 }}>
          <Body size={FT.h2} color={C.ink} style={{ lineHeight: 1.28 }}>掩码：<br />两种挖法，一条损失。</Body>
          <Body style={{ marginTop: 24 }}>随机点逐点以 15% 概率挖，连续块挖掉十个点中的六个；损失只在被挖的位置上算，除以 |M|。空掩码直接报错——损失没有定义。</Body>
          <div style={{ marginTop: 20 }}>
            <Row name="随机点" value={M.augment.maskFrac} note="逐点独立抽样" width={620} color={C.amber} />
            <Row name="连续块" value={M.augment.blockFrac} note={"块长 " + M.augment.blockLen} width={620} color={C.violet} />
            <Row name="空掩码" value="error" note="|M| = 0 时无定义" width={620} color={C.coral} />
          </div>
        </div>
        <div style={{ position: "absolute", left: 760, top: 300, width: 1080 }}>
          <CodeBlock title="Mask.hs · maskSeq / reconLoss" width={1040} size={FT.meta} lines={[
            { t: "maskSeq :: Double -> Series -> Gen -> (V.Vector Bool, Gen)" },
            { t: "maskSeq frac series g0 = go 0 g0 []" },
            { t: "  where go i g acc" },
            { t: "          let (u, g') = genUniform g" },
            { t: "          in go (i + 1) g' ((u < frac) : acc)", hi: true },
            { t: "" },
            { t: "reconLoss :: V.Vector Bool -> Series -> Series -> Double" },
            { t: "reconLoss mask target pred = case idxs of" },
            { t: "  [] -> error \"reconLoss: 掩码为空（|M|=0，损失无定义）\"", hi: true },
            { t: "  _ -> sum [ (pred V.! j - target V.! j) ^ (2 :: Int) | j <- idxs ] / fromIntegral (length idxs)", hi: true },
          ]} />
        </div>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 300, width: 660 }}>
          <Body size={FT.h2} color={C.ink} style={{ lineHeight: 1.28 }}>输入布局：<br />值在前，标记在后。</Body>
          <Body style={{ marginTop: 24 }}>一百二十维输入 = 六十个（被挖的填 0）+ 六十个 0/1 标记。这一行决定了「网络怎么知道哪里缺了」。第一版把标记写反，黄金值当场对不上。</Body>
          <div style={{ marginTop: 20 }}>
            <Row name="输入维" value="2 × 60 = 120" note="值 60 + 标记 60" width={620} color={C.violet} />
            <Row name="输出维" value="60" note="预测整条窗口" width={620} />
            <Row name="参数" value={M.mask.params} note="3872 + 1980" width={620} color={C.amber} />
          </div>
        </div>
        <div style={{ position: "absolute", left: 760, top: 300, width: 1080 }}>
          <CodeBlock title="Mask.hs · maskInput" width={1040} size={FT.meta} lines={[
            { t: "maskInput :: V.Vector Bool -> Series -> V.Vector Double" },
            { t: "maskInput mask x =" },
            { t: "  V.generate (2 * n) (\\j ->" },
            { t: "    if j < n" },
            { t: "      then (if mask V.! j then 0.0 else x V.! j)", hi: true },
            { t: "      else (if mask V.! (j - n) then 1.0 else 0.0))", hi: true },
            { t: "  where n = V.length x" },
            { t: "" },
            { t: "-- 前 T 位是值（遮住处填 0），后 T 位是标记", dim: true },
          ]} />
        </div>
      </AbsoluteFill>
    </Pages>
  </Scene>
);
