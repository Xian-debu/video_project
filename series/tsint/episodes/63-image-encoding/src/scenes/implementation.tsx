import React from "react";
import { AbsoluteFill } from "remotion";
import { C, FONT, FT } from "../../design/tokens";
import { Body, Chip, CodeBlock, Foot, KV, M, PAD, Pages, Scene, SceneHead, pagesOf } from "../shared";
import { ModuleBars } from "../figs";

export const ImplementationScene: React.FC = () => (
  <Scene id="implementation">
    <SceneHead id="implementation" />
    <Pages id="implementation" at={pagesOf("implementation")}>
      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 292, width: 620 }}>
          <Body size={FT.h1} color={C.ink} style={{ lineHeight: 1.2 }}>三个模块，<br />各管一段。</Body>
          <Body style={{ marginTop: 26 }}>
            格拉姆角场一百行，转移场九十二行，卷积前端一百四十七行，加二十四条单测和一个证据程序。
            全部纯函数，没有输入输出，没有随机数——所以每个数都能逐位复现。
          </Body>
          <div style={{ display: "flex", marginTop: 28 }}>
            <KV k="模块" v={M.code.totalLines + " 行"} color={C.cyan} />
            <KV k="单测" v={M.code.tests + " 条"} color={C.violet} />
            <KV k="证据" v={M.code.evidenceLines + " 行"} color={C.amber} />
          </div>
          <div style={{ display: "flex", marginTop: 22, gap: 10 }}>
            <Chip color={C.cyan}>纯函数</Chip>
            <Chip color={C.amber}>无 IO</Chip>
            <Chip color={C.violet}>无随机</Chip>
          </div>
        </div>
        <div style={{ position: "absolute", left: 790, top: 292, width: 1030 }}>
          <ModuleBars width={980} />
        </div>
        <Foot>没有 IO，才敢说可复现。</Foot>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 292, width: 620 }}>
          <Body size={FT.h1} color={C.ink} style={{ lineHeight: 1.2 }}>角场侧：<br />几行就够。</Body>
          <Body style={{ marginTop: 26 }}>
            缩放、夹紧、取极角，然后两个列表推导生成和场与差场。反解分两支：整体正，或整体负；一支里逐列比
            两个候选角，选更接近第一行的那个。
          </Body>
          <div style={{ display: "flex", marginTop: 28 }}>
            <KV k="和场" v="对称" color={C.cyan} />
            <KV k="差场" v="反对称" color={C.violet} />
          </div>
        </div>
        <div style={{ position: "absolute", left: 790, top: 292, width: 1030 }}>
          <CodeBlock
            title="TsBase.Algos.Ch07.GAF"
            width={1010}
            lines={[
              { t: "-- 极角：phi_i = arccos(x_i)，输入已缩放到 [-1,1]", dim: true },
              { t: "toPolar :: [Double] -> [Double]" },
              { t: "toPolar = map (acos . clampUnit)" },
              { t: "" },
              { t: "gasf xs = let ps = toPolar xs", hi: true },
              { t: "           in [[cos (a + b) | b <- ps] | a <- ps]" },
              { t: "gadf xs = let ps = toPolar xs", hi: true },
              { t: "           in [[sin (a - b) | b <- ps] | a <- ps]" },
              { t: "" },
              { t: "-- 反解：对角给 |x|，第一行定符号", dim: true },
              { t: "recoverFromGasfBranch neg sc img = map (unscaleWith sc . pick) [0 .. n-1]", hi: true },
              { t: "  where phi0 = acos (clampUnit (head mags))" },
              { t: "        pick j = let a = acos (mags !! j); b = pi - a" },
              { t: "                     g = row0 !! j" },
              { t: "                 in if |cos (phi0+b) - g| < |cos (phi0+a) - g|" },
              { t: "                    then cos b else cos a" },
            ]}
          />
        </div>
        <Foot>两行列表推导，就是两张图。</Foot>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 292, width: 620 }}>
          <Body size={FT.h1} color={C.ink} style={{ lineHeight: 1.2 }}>转移场侧：<br />按秩分箱。</Body>
          <Body style={{ marginTop: 26 }}>
            分箱按秩，用排序后的秩；数相邻对，逐行归一；再按状态序列铺开。三件事都不含随机，也没有可调参数——
            八个箱是写死的。
          </Body>
          <div style={{ display: "flex", marginTop: 28 }}>
            <KV k="分箱" v="按秩" color={C.violet} />
            <KV k="每箱" v="16 点" color={C.cyan} />
            <KV k="行和" v="1" color={C.inkDim} />
          </div>
        </div>
        <div style={{ position: "absolute", left: 790, top: 292, width: 1030 }}>
          <CodeBlock
            title="TsBase.Algos.Ch07.MTF"
            width={1010}
            lines={[
              { t: "-- 按秩分箱：每箱个数一样，相等值不会被挤进一箱", dim: true },
              { t: "binsOf q xs = [min (q - 1) (rank x * q `div` n) | x <- xs]", hi: true },
              { t: "  where rank x = length (takeWhile (< x) sorted)" },
              { t: "" },
              { t: "-- 数相邻箱对，逐行归一；空行退化成均匀分布", dim: true },
              { t: "transitionMatrix q bins = map normalize counts", hi: true },
              { t: "  where counts = [[pairs (i,j) | j <- [0..q-1]] | i <- [0..q-1]]" },
              { t: "        normalize row" },
              { t: "          | sum row <= 0 = replicate q (1 / fromIntegral q)" },
              { t: "          | otherwise    = map (/ sum row) row" },
              { t: "" },
              { t: "-- 按状态序列铺回时间轴：MTF_ij = W[bin_i][bin_j]", dim: true },
              { t: "mtfFromBins w bs = [[w !! bi !! bj | bj <- bs] | bi <- bs]", hi: true },
            ]}
          />
        </div>
        <Foot>矩阵记转移，序列记位置，两者相乘才是图。</Foot>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 292, width: 620 }}>
          <Body size={FT.h1} color={C.ink} style={{ lineHeight: 1.2 }}>卷积前端：<br />最容易写错。</Body>
          <Body style={{ marginTop: 26 }}>
            三乘三卷积、三个固定核、池化到八乘八，拼成一百九十二维。线性头解方程，用列主元消元——主元要取绝对值
            最大的。第一版取了最小的，还忘了除，两元方程就解错了。
          </Body>
          <div style={{ display: "flex", marginTop: 28, gap: 10 }}>
            <Chip color={C.cyan}>三个固定核</Chip>
            <Chip color={C.amber}>自适应池化</Chip>
            <Chip color={C.coral}>错一次，修一次</Chip>
          </div>
        </div>
        <div style={{ position: "absolute", left: 790, top: 292, width: 1030 }}>
          <CodeBlock
            title="TsBase.Algos.Ch07.VisionForecast"
            width={1010}
            lines={[
              { t: "-- 自适应池化：行列同时分组，四乘四池到二乘二", dim: true },
              { t: "poolTo g m = [[cell i j | j <- [0..g-1]] | i <- [0..g-1]]", hi: true },
              { t: "  where bounds total k = (k*total `div` g, (k+1)*total `div` g)" },
              { t: "" },
              { t: "-- 列主元：主元取绝对值最大的，最后才除以它", dim: true },
              { t: "let (pivot, best) = maximum [(abs (r !! k), i) | (i, r) <- ...]", hi: true },
              { t: "    pivoted = ...", },
              { t: "" },
              { t: "-- 三个核固定，不学习；池化后拼成 192 维", dim: true },
              { t: "imgFeatures xs = flattenMat" },
              { t: "  [ flattenMat (poolTo 8 (reluMat (conv2d k (gasf scaled))))", hi: true },
              { t: "  | k <- kernels ]" },
              { t: "" },
              { t: "ridgeFit lambda xs ys = solveLinear (penalize xtx) (matVec xt ys)", hi: true },
            ]}
          />
        </div>
        <Foot>这些错误都不会崩，只会让数字悄悄错掉。</Foot>
      </AbsoluteFill>
    </Pages>
  </Scene>
);
