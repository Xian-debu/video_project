import React from "react";
import { AbsoluteFill } from "remotion";
import { C, FONT, FT } from "../../design/tokens";
import { M, Body, Card, Chip, CodeBlock, Foot, KV, PAD, Pages, Row, Scene, SceneHead, fmt4, pagesOf } from "../shared";

export const ImplementationScene: React.FC = () => (
  <Scene id="implementation">
    <SceneHead id="implementation" />
    <Pages id="implementation" at={pagesOf("implementation")}>
      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 292, width: 620 }}>
          <Body size={FT.h2} color={C.ink} style={{ lineHeight: 1.3 }}>三个模块，<br />一套预算。</Body>
          <Body style={{ marginTop: 24 }}>
            子空间、比较器、组合预测器各自独立，共用同一份合成空间与真实数据。全是纯函数：固定种子，没有网络，没有外部数值库。
          </Body>
          <div style={{ display: "flex", marginTop: 24 }}>
            <KV k="模块" v="385 行" color={C.cyan} />
            <KV k="单测" v="27 条" color={C.violet} />
            <KV k="全仓" v="2,185" color={C.amber} />
          </div>
        </div>
        <div style={{ position: "absolute", left: 740, top: 286, width: 1100 }}>
          <Card label="三个文件，三百八十五行" accent={C.cyan}>
            <Row name="CherryRegion" value="151 行" note="mkBox / shrinkRegion / cherrySearch / sampleRegion" width={980} color={C.cyan} />
            <Row name="RandomCmp" value="149 行" note="trainComparator / sortByComp / positionAccuracy" width={980} color={C.violet} />
            <Row name="CombPredict" value="85 行" note="combPredict / pruneByComb / inheritParams" width={980} color={C.amber} />
            <Row name="公共部分" value="Rand" note="LCG 随机源，所有种子从这里来" width={980} color={C.inkDim} />
          </Card>
          <div style={{ marginTop: 18, fontFamily: FONT.mono, fontSize: FT.meta, color: C.inkFaint }}>
            模块在 src/TsBase/Algos/Ch06/；证据程序在 app/Ch06GeneralizableEvidence.hs。
          </div>
        </div>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 292, width: 560 }}>
          <Body size={FT.h2} color={C.ink} style={{ lineHeight: 1.3 }}>子空间：<br />收缩函数是核心。</Body>
          <Body style={{ marginTop: 22 }}>
            输入点集，输出盒子。每一维先算均值和总体标准差，再按 λ 展宽；盒子之外的点被裁掉，采样只落在盒内。
          </Body>
          <div style={{ marginTop: 20, fontFamily: FONT.mono, fontSize: FT.meta, color: C.inkFaint, lineHeight: 1.9 }}>
            样本少于 2：报错<br />
            λ=0：退化成均值点<br />
            体积：逐维宽度相乘
          </div>
        </div>
        <div style={{ position: "absolute", left: 660, top: 286, width: 1180 }}>
          <Card label="CherryRegion.hs · 收缩与搜索" accent={C.cyan}>
            <div style={{ fontFamily: FONT.mono, fontSize: FT.code, lineHeight: 1.75, color: C.ink, whiteSpace: "pre" }}>
              {`shrinkRegion :: Double -> [Vector Double] -> Box\nshrinkRegion lambda pts\n  | length pts < 2 = error "need 2 points"\n  | otherwise =\n      let n  = fromIntegral (length pts)\n          mu = V.map (/ n) (V.foldl' (V.zipWith (+)) (head pts) (tail pts))\n          sd = ...  -- 总体标准差，逐维\n      in (V.zipWith (-) mu (V.map (* lambda) sd)\n         ,V.zipWith (+) mu (V.map (* lambda) sd))\n\ncherrySearch rounds budget lambda f box g = go ...`}
            </div>
          </Card>
          <div style={{ marginTop: 16, fontFamily: FONT.mono, fontSize: FT.meta, color: C.inkFaint }}>
            黄金值：shrinkRegion 1 [0,2,4] = [0.3670, 3.6330]。
          </div>
        </div>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 292, width: 560 }}>
          <Body size={FT.h2} color={C.ink} style={{ lineHeight: 1.3 }}>比较器：<br />排序比打分便宜。</Body>
          <Body style={{ marginTop: 22 }}>
            成对差做岭回归，解一个正规方程；排序用手写归并，比较器回答「谁更高」，相等时保持原序，保证稳定。
          </Body>
          <div style={{ marginTop: 20, fontFamily: FONT.mono, fontSize: FT.meta, color: C.inkFaint, lineHeight: 1.9 }}>
            200 对样本 → 一个权重向量<br />
            十万候选 → 一次遍历比较<br />
            位置准确率：1.0（线性真值）
          </div>
        </div>
        <div style={{ position: "absolute", left: 660, top: 286, width: 1180 }}>
          <Card label="RandomCmp.hs · 拟合、排序、打分" accent={C.violet}>
            <div style={{ fontFamily: FONT.mono, fontSize: FT.code, lineHeight: 1.75, color: C.ink, whiteSpace: "pre" }}>
              {`trainComparator :: Double -> [Sample] -> Comparator\ntrainComparator lambda samples =\n  let (a, b) = foldl' accumulate (zeros, zeros) (pairs samples)\n      w      = solveLin (a + lambda * I) b\n  in \\x -> dot w (arch x)\n\nsortByComp :: Comparator -> [Arch] -> [Arch]\n-- 归并：GT 取左，LT 取右，EQ 取左（稳定）\n\npositionAccuracy cmp archs true = ...`}
            </div>
          </Card>
          <div style={{ marginTop: 16, fontFamily: FONT.mono, fontSize: FT.meta, color: C.inkFaint }}>
            黄金值：真值 [0.9,0.5,0.7,0.3] 排成 [1,3,2,4]；solveLin [[2,1],[1,3]] = [0.8,1.4]。
          </div>
        </div>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 292, width: 560 }}>
          <Body size={FT.h2} color={C.ink} style={{ lineHeight: 1.3 }}>组合预测器：<br />剪枝与继承。</Body>
          <Body style={{ marginTop: 22 }}>
            pruneByComb 按块均分排序，保留前 ⌈ρn⌉ 块，返回时按索引升序，保证结果稳定可复现；参数继承把新旧参数按 α 混合。
          </Body>
          <div style={{ marginTop: 20, fontFamily: FONT.mono, fontSize: FT.meta, color: C.inkFaint, lineHeight: 1.9 }}>
            8 块，ρ=0.5 → 留 4 块<br />
            至少留 1 块，空输入返回空<br />
            α=1 保留旧参数，α=0 全用新参数
          </div>
        </div>
        <div style={{ position: "absolute", left: 660, top: 286, width: 1180 }}>
          <Card label="CombPredictor.hs · 剪枝与参数继承" accent={C.amber}>
            <div style={{ fontFamily: FONT.mono, fontSize: FT.code, lineHeight: 1.75, color: C.ink, whiteSpace: "pre" }}>
              {`combPredict :: Subspace -> Double\ncombPredict s = mean (subScores s)\n\npruneByComb :: Double -> [Subspace] -> [Subspace]\npruneByComb rho subs =\n  let k    = max 1 (ceiling (rho * fromIntegral (length subs)))\n      kept = take k (sortOn (negate . combPredict) subs)\n  in  sortOn subIndex kept\n\ninheritParams :: Double -> Params -> Params -> Params\ninheritParams a old new = zipWith (\\o n -> a*o + (1-a)*n) old new`}
            </div>
          </Card>
          <div style={{ marginTop: 16, fontFamily: FONT.mono, fontSize: FT.meta, color: C.inkFaint }}>
            黄金值：8 块留 [5,6,7,8]；inherit 0.7 [1,2] [3,4] = [1.6, 2.6]。
          </div>
        </div>
        <Foot>先保证同一套预算能跑完，再谈省得多不多。</Foot>
      </AbsoluteFill>
    </Pages>
  </Scene>
);
