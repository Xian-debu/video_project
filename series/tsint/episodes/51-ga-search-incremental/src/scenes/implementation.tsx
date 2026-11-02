import React from "react";
import { AbsoluteFill } from "remotion";
import { C, FONT, FT } from "../../design/tokens";
import { M, Body, Card, Chip, CodeBlock, KV, PAD, Pages, Scene, SceneHead, fmtInt, pagesOf } from "../shared";
import { SplitBar } from "../figs";

const MODULES = [
  { t: "-- src/TsBase/Algos/Ch06/GaSearch.hs", dim: true },
  { t: "evolve         :: GaParams -> (Chromosome -> Double) -> Population" },
  { t: "evolveCoverage :: GaParams -> (Chromosome -> Double) -> ([Population], [Int])", hi: true },
  { t: "crossover      :: Gen -> Chromosome -> Chromosome -> Chromosome" },
  { t: "mutate         :: Double -> Gen -> Chromosome -> Chromosome" },
  { t: "" },
  { t: "-- src/TsBase/Algos/Ch06/IncrementalSearch.hs", dim: true },
  { t: "fitLine        :: [(Int, Double)] -> Maybe Fit" },
  { t: "extrapolate    :: [(Int, Double)] -> Int -> Double" },
  { t: "stagePoints    :: Int -> [Int]", hi: true },
  { t: "pruneByCurve   :: Double -> [(Int, Double)] -> [Int]" },
];

const CORE = [
  { t: "-- 一代：评估 → 记账 → 繁殖", dim: true },
  { t: "evolveOne g ps = let scored = map (eval g) (popList ps)" },
  { t: "                      st     = stats scored" },
  { t: "                  in breed g elite scored st" },
  { t: "" },
  { t: "-- 缓存键是整个基因向量：同基因只训练一次", dim: true },
  { t: "eval g c = case Map.lookup (chrGenes c) cache of" },
  { t: "  Just v  -> v" },
  { t: "  Nothing -> let v = fitness c in Map.insert k v v", hi: true },
  { t: "" },
  { t: "-- 精英复制 + 锦标赛选择 + 交叉 / 变异", dim: true },
  { t: "breed g n scored st = elites ++ [child g a b | ...]" },
];

const CURVE = [
  { t: "-- 最小二乘：两点定线，三点也照算", dim: true },
  { t: "fitLine pts = if sxx <= 1e-18 then Nothing else Just Fit", hi: true },
  { t: "  where b = sxy / sxx; a = my - b * mx" },
  { t: "" },
  { t: "-- 外推前截断：目标不超过最大观测点的四倍", dim: true },
  { t: "extrapolate pts tgt = a + b * fromIntegral (clipTarget pts tgt)" },
  { t: "" },
  { t: "-- 幂律：取对数后还是最小二乘，再取指数", dim: true },
  { t: "powExtrap pts tgt = exp (a2 + b2 * log (fromIntegral tgt))", hi: true },
  { t: "  where (a2, b2) = ols2 [(log n, log v) | (n, v) <- pts]" },
];

const HARNESS = [
  { t: "-- 每只股票：一次全跑完，读数写进摘要", dim: true },
  { t: "evalRun stock = Run" },
  { t: "  { rnValid  = rankIds (map (flip maeSeg va) valPreds)   -- 真值" },
  { t: "  , rnExtrap = rankIds [extrap  curve te | curve <- curves] }" },
  { t: "  , rnIncPow = rankIds [powExtrap curve te | curve <- curves] }" },
  { t: "  , rnGaPick = bestOf pop, rnGaCov = last cov }", hi: true },
];

export const ImplementationScene: React.FC = () => (
  <Scene id="implementation">
    <SceneHead id="implementation" />
    <Pages id="implementation" at={pagesOf("implementation")}>
      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 288, width: 570 }}>
          <Body size={FT.h2} color={C.ink} style={{ lineHeight: 1.3 }}>三个模块，<br />十一个黄金用例。</Body>
          <Body style={{ marginTop: 22 }}>
            遗传算法管基因、种群、选择、交叉、变异；增量搜索管直线拟合、外推、阶段点、剪枝；证据程序把两者接到真实数据上。三个模块都是纯函数，随机流用线性同余发生器，种子在哪序列就在哪。
          </Body>
          <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
            <Chip color={C.coral}>GA 6 例</Chip>
            <Chip color={C.violet}>曲线 5 例</Chip>
            <Chip color={C.cyan}>全过才跑证据</Chip>
          </div>
        </div>
        <div style={{ position: "absolute", left: 700, top: 282, width: 1150 }}>
          <CodeBlock title="三个模块的导出" lines={MODULES} width={1100} size={FT.meta} />
        </div>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 286, width: 570 }}>
          <Body size={FT.h2} color={C.ink} style={{ lineHeight: 1.3 }}>遗传算法的<br />核心是一个循环。</Body>
          <Body style={{ marginTop: 22 }}>
            每代先评估、再记账、最后繁殖。评估走 Map 缓存，键是整个基因；繁殖是精英复制加锦标赛，再按概率交叉、变异。每代都记下评估数和去重后的训练数 —— 这条账就是判据的来源。
          </Body>
          <div style={{ marginTop: 18, fontFamily: FONT.mono, fontSize: FT.meta, color: C.inkFaint }}>
            参数全是默认值，种子固定，两百次评估可完整复现
          </div>
        </div>
        <div style={{ position: "absolute", left: 700, top: 280, width: 1150 }}>
          <CodeBlock title="evolve / breed：一代要走的三步" lines={CORE} width={1100} size={FT.meta} />
          <div style={{ marginTop: 18, display: "flex", gap: 24 }}>
            <KV k="评估" v={String(M.ga.evals)} color={C.cyan} />
            <KV k="去重训练" v={String(M.ga.unique)} color={C.coral} />
            <KV k="答案一致" v={M.ga.same + " / " + M.data.stocks} color={C.violet} />
          </div>
        </div>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 286, width: 570 }}>
          <Body size={FT.h2} color={C.ink} style={{ lineHeight: 1.3 }}>增量搜索<br />三件小事。</Body>
          <Body style={{ marginTop: 22 }}>
            拟合直线是标准最小二乘，两点就能算；斜率不存在时返回空，不给错误答案。外推前先截断目标，不超过最大观测点的四倍 —— 没有这条护栏，外推到无穷会给出荒谬的数。阶段点按总量切三段，剪枝只留已经达标的阶段。
          </Body>
          <div style={{ marginTop: 18, display: "flex", gap: 10 }}>
            <Chip color={C.violet}>护栏 4×</Chip>
            <Chip color={C.cyan}>三点采样</Chip>
          </div>
        </div>
        <div style={{ position: "absolute", left: 700, top: 280, width: 1150 }}>
          <CodeBlock title="fitLine / extrapolate / powExtrap" lines={CURVE} width={1100} size={FT.meta} />
          <div style={{ marginTop: 16, fontFamily: FONT.mono, fontSize: FT.meta, color: C.inkFaint }}>
            护栏把目标截到最大观测点的四倍：黄金值那组 4 × 30 = {fmtInt(M.curve.maxTarget)}，真数据 4 × {fmtInt(Math.max(...M.data.stages))} = {fmtInt(Math.max(...M.data.stages) * 4)}；画面上的三条曲线全部由这三个函数算出
          </div>
        </div>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 286, width: 570 }}>
          <Body size={FT.h2} color={C.ink} style={{ lineHeight: 1.3 }}>证据程序<br />把两边接起来。</Body>
          <Body style={{ marginTop: 22 }}>
            每只股票先跑十次全量拟合，得到真值排序；再跑三次部分拟合，得到三个阶段点；然后线性外推一次、幂律外推一次；最后跑一次遗传算法，两百次评估。所有中间值都写进摘要文件，画面上的每个数字都能追溯。
          </Body>
          <div style={{ marginTop: 18, fontFamily: FONT.mono, fontSize: FT.meta, color: C.inkFaint }}>
            {M.checks.length} 项检查，{M.seconds.toFixed(1)} 秒
          </div>
        </div>
        <div style={{ position: "absolute", left: 700, top: 280, width: 1150 }}>
          <CodeBlock title="每只股票一次跑完" lines={HARNESS} width={1100} size={FT.meta} />
          <div style={{ marginTop: 18 }}>
            <SplitBar w={1100} />
          </div>
        </div>
      </AbsoluteFill>
    </Pages>
  </Scene>
);
