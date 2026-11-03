import React from "react";
import { AbsoluteFill } from "remotion";
import { C, FONT, FT } from "../../design/tokens";
import { M, Body, Card, Chip, CodeBlock, Foot, KV, PAD, Pages, Row, Scene, SceneHead, pagesOf } from "../shared";

export const ImplementationScene: React.FC = () => (
  <Scene id="implementation">
    <SceneHead id="implementation" />
    <Pages id="implementation" at={pagesOf("implementation")}>
      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 292, width: 590 }}>
          <Body size={FT.h1} color={C.ink} style={{ lineHeight: 1.2 }}>一个模块，<br />二百六十九行。</Body>
          <Body style={{ marginTop: 26 }}>
            相关、谱、决策，全在一个纯函数模块里。十八个导出，没有 IO，不依赖外部库，输入输出都是列表。
          </Body>
          <div style={{ display: "flex", marginTop: 26 }}>
            <KV k="行数" v="269" color={C.cyan} />
            <KV k="导出" v="18" color={C.violet} />
            <KV k="单测" v="29" color={C.amber} />
          </div>
        </div>
        <div style={{ position: "absolute", left: 720, top: 286, width: 1080 }}>
          <CodeBlock
            title="src/TsBase/Algos/Ch07/ChannelMix.hs · 导出"
            width={1040}
            lines={[
              { t: "data Strategy = ChannelIndependent | ChannelMixed | ChannelHybrid Int" },
              { t: "standardize :: V.Vector Double -> V.Vector Double", dim: true },
              { t: "correlationMatrix :: V.Vector (V.Vector Double) -> [[Double]]", hi: true },
              { t: "meanAbsCorr / maxAbsCorr :: [[Double]] -> Double", dim: true },
              { t: "jacobiEigen :: [[Double]] -> ([Double], [[Double]])", hi: true },
              { t: "effectiveRank :: [Double] -> Double", dim: true },
              { t: "topShare / mixReconstructionError :: Int -> [Double] -> Double", dim: true },
              { t: "decideStrategy :: Double -> Double -> Int -> Strategy", hi: true },
              { t: "ciTokenCount :: Int -> Int -> Int", dim: true },
              { t: "cmTokenCount :: Int -> Int", dim: true },
              { t: "hybridTokenCount :: Int -> Int -> Int", dim: true },
              { t: "attentionCost :: Int -> Int -> Int", dim: true },
            ]}
          />
        </div>
        <Foot>纯函数，没有 IO。</Foot>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 292, width: 590 }}>
          <Body size={FT.h1} color={C.ink} style={{ lineHeight: 1.2 }}>先标准化，<br />再算相关。</Body>
          <Body style={{ marginTop: 26 }}>
            减均值、除以样本标准差，除以样本数减一。相关就是标准化后的协方差。两层循环，六乘六；对角写成一，对称只算上三角。
          </Body>
          <div style={{ display: "flex", marginTop: 26 }}>
            <KV k="矩阵" v="6 × 6" color={C.cyan} />
            <KV k="边" v="15" color={C.violet} />
            <KV k="样本" v="n − 1" color={C.amber} />
          </div>
        </div>
        <div style={{ position: "absolute", left: 720, top: 286, width: 1080 }}>
          <CodeBlock
            title="标准与相关：样本口径，对角为一"
            width={1040}
            lines={[
              { t: "standardize :: V.Vector Double -> V.Vector Double" },
              { t: "standardize v" },
              { t: "  | n < 2      = V.replicate n 0", dim: true },
              { t: "  | sd < 1e-12 = V.replicate n 0", dim: true },
              { t: "  | otherwise  = V.map (\\x -> (x - m) / sd) v", hi: true },
              { t: "  where n  = V.length v" },
              { t: "        m  = V.sum v / fromIntegral n" },
              { t: "        sd = sqrt (V.sum (V.map (\\x -> (x - m) ^ 2) v) / fromIntegral (n - 1))" },
              { t: "" },
              { t: "correlationMatrix chans =", dim: true },
              { t: "  [[dot (zs !! i) (zs !! j) / fromIntegral (n - 1)", dim: true },
              { t: "    | j <- [0 .. c - 1]] | i <- [0 .. c - 1]]", dim: true },
              { t: "  where zs = map standardize (V.toList chans)" },
              { t: "        dot a b = V.sum (V.zipWith (*) a b)" },
            ]}
          />
        </div>
        <Foot>相关，就是标准化的协方差。</Foot>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 292, width: 590 }}>
          <Body size={FT.h1} color={C.ink} style={{ lineHeight: 1.2 }}>特征值，<br />用 Jacobi。</Body>
          <Body style={{ marginTop: 26 }}>
            对称矩阵，旋转消元。每次找最大的非对角，旋转把它压到零；迭代到残差小于一的负十次。特征值排在对角线上，特征向量按列存，降序排时一起交换。
          </Body>
          <div style={{ display: "flex", marginTop: 26 }}>
            <KV k="残差" v="9e-16" color={C.cyan} />
            <KV k="迭代" v="≤ 100" color={C.violet} />
            <KV k="顺序" v="降序" color={C.amber} />
          </div>
        </div>
        <div style={{ position: "absolute", left: 720, top: 286, width: 1080 }}>
          <CodeBlock
            title="jacobiEigen：对称矩阵，旋转消元"
            width={1040}
            lines={[
              { t: "jacobiEigen :: [[Double]] -> ([Double], [[Double]])" },
              { t: "jacobiEigen m0 = finish (go 0 m0 identity)" },
              { t: "  where go it a v" },
              { t: "          | it >= 100 = (a, v)", dim: true },
              { t: "          | off < 1e-30 = (a, v)", dim: true },
              { t: "          | otherwise = go (it + 1) (rotate p q a) v'", hi: true },
              { t: "          where (p, q) = maxOff a", dim: true },
              { t: "                off = maximum [a!!i!!j * a!!i!!j | i <- is, j <- is, i /= j]", dim: true },
              { t: "" },
              { t: "        finish (a, v) =", dim: true },
              { t: "          let vals = [a !! i !! i | i <- [0 .. n - 1]]", dim: true },
              { t: "              cols = [[v !! i !! k | i <- [0 .. n - 1]] | k <- [0 .. n - 1]]", dim: true },
              { t: "              order = map snd (reverse (sortOn fst (zip vals [0 ..])))", dim: true },
              { t: "          in ([vals !! k | k <- order], [cols !! k | k <- order])", dim: true },
            ]}
          />
        </div>
        <Foot>迭代到残差小于一的负十次。</Foot>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 292, width: 590 }}>
          <Body size={FT.h1} color={C.ink} style={{ lineHeight: 1.2 }}>决策，<br />三个分支。</Body>
          <Body style={{ marginTop: 26 }}>
            输入平均相关、有效秩、通道数。先判断混合，再判断独立，否则组数四舍五入，夹在一和通道数之间。模式匹配三个分支，没有默认值，编译器帮你查漏。
          </Body>
          <div style={{ display: "flex", marginTop: 26 }}>
            <KV k="分支" v="3" color={C.cyan} />
            <KV k="默认" v="无" color={C.coral} />
            <KV k="结果" v="Hybrid 2" color={C.violet} />
          </div>
        </div>
        <div style={{ position: "absolute", left: 720, top: 286, width: 1080 }}>
          <CodeBlock
            title="决策与 token 计数：全部是纯函数"
            width={1040}
            lines={[
              { t: "decideStrategy :: Double -> Double -> Int -> Strategy" },
              { t: "decideStrategy meanAbs eff c" },
              { t: "  | c <= 0 = ChannelIndependent", dim: true },
              { t: "  | meanAbs >= 0.6 && eff <= fromIntegral c / 2 = ChannelMixed", hi: true },
              { t: "  | meanAbs <= 0.2 = ChannelIndependent", hi: true },
              { t: "  | otherwise = ChannelHybrid (max 1 (min c (round eff)))", hi: true },
              { t: "" },
              { t: "ciTokenCount c m = c * m", dim: true },
              { t: "cmTokenCount m = m", dim: true },
              { t: "hybridTokenCount k m = k * m", dim: true },
              { t: "attentionCost n d = n * n * d", dim: true },
            ]}
          />
          <div style={{ marginTop: 14, fontFamily: FONT.mono, fontSize: FT.micro, color: C.inkFaint }}>六个通道 ⇒ CI = 96；m = 16 ⇒ CM = 16；k = 2 ⇒ Hybrid 2 = 32。</div>
        </div>
        <Foot>模式匹配，三个分支。</Foot>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 292, width: 590 }}>
          <Body size={FT.h1} color={C.ink} style={{ lineHeight: 1.2 }}>整数账，<br />精确。</Body>
          <Body style={{ marginTop: 26 }}>
            token 数是三个乘法：独立通道乘块数，混合块数，两两混合组数乘块数。注意力代价是平方乘维度。再加一个节省比例，全部可手算，没有浮点误差。
          </Body>
          <div style={{ display: "flex", marginTop: 26 }}>
            <KV k="CI" v="96" color={C.cyan} />
            <KV k="H2" v="32" color={C.violet} />
            <KV k="CM" v="16" color={C.amber} />
          </div>
        </div>
        <div style={{ position: "absolute", left: 720, top: 286, width: 1080 }}>
          <Card label="三档 token 与代价：一次前向，d = 32" accent={C.cyan}>
            <Row name="CI" value="6 × 16 = 96" note="294,912 = 96² × 32" width={1000} color={C.cyan} />
            <Row name="Hybrid 2" value="2 × 16 = 32" note="32,768 = 32² × 32" width={1000} color={C.violet} />
            <Row name="CM" value="1 × 16 = 16" note="8,192 = 16² × 32" width={1000} color={C.amber} />
            <Row name="节省" value="1 − k / C" note="Hybrid 2：0.667；CM：0.833" width={1000} color={C.coral} />
          </Card>
          <div style={{ marginTop: 18, display: "flex", gap: 10 }}>
            <Chip color={C.cyan}>整数</Chip>
            <Chip color={C.violet}>无浮点误差</Chip>
            <Chip color={C.amber}>可手算</Chip>
          </div>
        </div>
        <Foot>全部是乘法。</Foot>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 292, width: 590 }}>
          <Body size={FT.h1} color={C.ink} style={{ lineHeight: 1.2 }}>证据程序，<br />二十四项。</Body>
          <Body style={{ marginTop: 26 }}>
            读 CSV，算相关，算谱，算决策；每组读数写进 JSON，检查清单一条条对。数据四项、相关六项、谱九项、决策三项、token 两项，一共二十四项，跑完不到一秒。
          </Body>
          <div style={{ display: "flex", marginTop: 26 }}>
            <KV k="证据行数" v="212" color={C.cyan} />
            <KV k="检查" v="24" color={C.violet} />
            <KV k="耗时" v="0.02 s" color={C.amber} />
          </div>
        </div>
        <div style={{ position: "absolute", left: 720, top: 286, width: 1080 }}>
          <Card label="一只数据目录，一条流水线" accent={C.amber}>
            <Row name="01 读 CSV" value="6 列" note="日期 + 六只股票，513 行收盘" width={1000} color={C.cyan} />
            <Row name="02 收益" value="512" note="逐行对数收益，六列对齐" width={1000} color={C.violet} />
            <Row name="03 相关" value="6 × 6" note="标准化后两两相关，取绝对值" width={1000} color={C.amber} />
            <Row name="04 谱" value="6 值" note="Jacobi 特征分解，降序" width={1000} color={C.cyan} />
            <Row name="05 决策" value="Hybrid 2" note="两个阈值，三个分支" width={1000} color={C.violet} />
            <Row name="06 写 JSON" value="24 项" note="读数与检查一起落盘" width={1000} color={C.amber} />
          </Card>
          <div style={{ marginTop: 16, fontFamily: FONT.mono, fontSize: FT.micro, color: C.inkFaint }}>tsbase evidence-ch07-channel --data … --out … --evidence …</div>
        </div>
        <Foot>检查清单一条条对。</Foot>
      </AbsoluteFill>
    </Pages>
  </Scene>
);
