import React from "react";
import { AbsoluteFill } from "remotion";
import { C, FONT, FT } from "../../design/tokens";
import { M, Body, Card, Chip, CodeBlock, Foot, KV, PAD, Pages, Row, Scene, SceneHead, fmt4, pagesOf } from "../shared";

const types = [
  { t: "data Model = Model" },
  { t: "  { modelName  :: String" },
  { t: "  , modelPred  :: VU.Vector Double" },
  { t: "  , modelResid :: VU.Vector Double }" },
  { t: "" },
  { t: "data Subset = Subset" },
  { t: "  { subBits     :: [Bool]" },
  { t: "  , subBias     :: Double" },
  { t: "  , subVariance :: Double }" },
  { t: "" },
  { t: "data GaParams = GaParams" },
  { t: "  { gpPopSize :: Int, gpGenerations :: Int" },
  { t: "  , gpSeed :: Int, gpMinModels :: Int ... }" },
];

const gaOps = [
  { t: "tournament :: [Subset] -> Gen -> Subset" },
  { t: "-- 抽三个，先比秩，再比偏差，再比方差" },
  { t: "" },
  { t: "uniformCrossover :: Gen -> Subset -> Subset -> (Subset, Subset)" },
  { t: "-- 每一位独立交换，0/1 串不用解码" },
  { t: "" },
  { t: "mutateAt :: Gen -> Double -> Subset -> Subset" },
  { t: "-- 每一位以 p 翻面" },
  { t: "" },
  { t: "repair :: Int -> Subset -> Subset" },
  { t: "-- 少于两个成员就补回两个" },
  { t: "" },
  { t: "dominates :: Subset -> Subset -> Bool" },
  { t: "-- 两项都不差，且至少一项更好" },
];

const krr = [
  { t: "krrFitWith :: Double -> Double -> [[Double]] -> [Double] -> KrrModel" },
  { t: "krrFitWith lambda ell xs y =" },
  { t: "  let zs = standardize xs" },
  { t: "      ks = rbfMatrix ell zs" },
  { t: "      alpha = cholSolve (addLambda lambda ks) (center y)" },
  { t: "  in KrrModel ell (mean xs) (std xs) (mean y) alpha" },
  { t: "" },
  { t: "cholSolve :: [[Double]] -> [Double] -> Maybe [Double]" },
  { t: "-- O(n^3)；失败时加 1e-9 抖动重试" },
  { t: "" },
  { t: "krrPredict :: KrrModel -> [Double] -> Double" },
  { t: "-- 核向量点乘 alpha，再加回标签均值" },
];

export const ImplementationScene: React.FC = () => (
  <Scene id="implementation">
    <SceneHead id="implementation" />
    <Pages id="implementation" at={pagesOf("implementation")}>
      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 292, width: 600 }}>
          <Body size={FT.h2} color={C.ink} style={{ lineHeight: 1.3 }}>模块四百七十七行，<br />三种数据结构。</Body>
          <Body style={{ marginTop: 24 }}>
            模型带名字、预测、残差；子集带位串、偏差、方差；参数带种群、代数、种子。评估一个子集，先求成员残差均值，再算两个数。
          </Body>
          <div style={{ marginTop: 22 }}>
            <Chip color={C.cyan}>Model</Chip>
            <Chip color={C.violet} style={{ marginLeft: 10 }}>Subset</Chip>
            <Chip color={C.amber} style={{ marginLeft: 10 }}>GaParams</Chip>
          </div>
          <div style={{ marginTop: 20, fontFamily: FONT.mono, fontSize: FT.meta, color: C.inkFaint }}>
            src/TsBase/Algos/Ch06/GaEnsemble.hs
          </div>
        </div>
        <div style={{ position: "absolute", left: 760, top: 286, width: 1080 }}>
          <CodeBlock title="GaEnsemble.hs · 数据结构" lines={types} width={1040} size={FT.code} />
        </div>
        <Foot>模块四百七十七行。</Foot>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 292, width: 560 }}>
          <Body size={FT.h2} color={C.ink} style={{ lineHeight: 1.3 }}>算子：<br />锦标赛、交叉、变异。</Body>
          <Body style={{ marginTop: 24 }}>
            初始化随机零一串，修复到至少两个一；锦标赛抽三个，先比秩、再比偏差、再比方差；均匀交叉逐位交换；按概率翻位；精英直接进下一代。
          </Body>
          <div style={{ marginTop: 22, fontFamily: FONT.mono, fontSize: FT.meta, color: C.inkFaint, lineHeight: 1.9 }}>
            同一 seed，逐代一致。<br />
            排序是确定的，没有并发。
          </div>
        </div>
        <div style={{ position: "absolute", left: 700, top: 286, width: 1140 }}>
          <CodeBlock title="GA 算子 · 全部纯函数" lines={gaOps} width={1100} size={FT.code} />
        </div>
        <Foot>每一代保留最好的，其余交叉变异。</Foot>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 292, width: 560 }}>
          <Body size={FT.h2} color={C.ink} style={{ lineHeight: 1.3 }}>核岭回归：<br />标准化、Cholesky。</Body>
          <Body style={{ marginTop: 24 }}>
            每列减均值、除标准差；核宽取两两距离的中位数；加截距之前先减标签均值。分解失败就加一点抖动重试，预测完再加回来。
          </Body>
          <Body style={{ marginTop: 16 }}>
            截距这一项，是踩坑之后加的：不减均值，外推会放大。
          </Body>
          <div style={{ marginTop: 20 }}>
            <KV k="复杂度" v="O(n³)" color={C.amber} />
            <KV k="n" v="365" color={C.cyan} />
          </div>
        </div>
        <div style={{ position: "absolute", left: 700, top: 286, width: 1140 }}>
          <CodeBlock title="GaEnsemble.hs · 核岭回归" lines={krr} width={1100} size={FT.code} />
        </div>
        <Foot>分解失败，加一点抖动。</Foot>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 292, width: 600 }}>
          <Body size={FT.h2} color={C.ink} style={{ lineHeight: 1.3 }}>证据程序，<br />五百一十七行。</Body>
          <Body style={{ marginTop: 24 }}>
            读日线，按股票分组；每只切三段；候选池五个模型两个档。先跑遗传算法得到子集，再跑核岭回归拟合残差，lambda 用段内五折交叉验证选。
          </Body>
          <Body style={{ marginTop: 16 }}>
            检验段只算一次，结果写进 JSON。
          </Body>
        </div>
        <div style={{ position: "absolute", left: 720, top: 286, width: 1120 }}>
          <Card label="一只股票，一条流水线" accent={C.violet}>
            <Row name="01 读日线" value="CSV → 向量" note="按股票代码分组，按日期排序" width={1060} color={C.inkDim} />
            <Row name="02 切三段" value="70 / 15 / 15" note="训练 / 调参 / 检验" width={1060} color={C.violet} />
            <Row name="03 候选池" value="10" note="五个模型 × 两个超参档" width={1060} color={C.cyan} />
            <Row name="04 筛选" value="GA → 子集" note="双目标前沿，再归一化选点" width={1060} color={C.amber} />
            <Row name="05 调权" value="KR → 残差" note="拟合子集成员的残差，λ 由 5 折 CV 选" width={1060} color={C.cyan} />
            <Row name="06 报告" value="检验段一次" note="二十只股票循环，汇总 JSON" width={1060} color={C.inkDim} />
          </Card>
        </div>
        <Foot>二十只股票，循环一遍。</Foot>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 292, width: 600 }}>
          <Body size={FT.h2} color={C.ink} style={{ lineHeight: 1.3 }}>单测十七项，<br />先跑起来。</Body>
          <Body style={{ marginTop: 24 }}>
            黄金值零点八七五、两个极限、前沿四点、被支配点、同 seed 一致、子集至少两个成员、核矩阵对称、正则项大于零分解必成功。
          </Body>
          <div style={{ marginTop: 24, display: "flex" }}>
            <KV k="单测" v="17" color={C.cyan} />
            <KV k="模块" v="477 行" color={C.violet} />
            <KV k="证据" v="517 行" color={C.amber} />
          </div>
        </div>
        <div style={{ position: "absolute", left: 740, top: 286, width: 1100 }}>
          <Card label="十七项单测：先把定义钉住" accent={C.cyan}>
            <Row name="黄金值" value="0.875" note="krrFitWith 0.5，两个点" width={1040} color={C.amber} />
            <Row name="λ = 0" value="精确插值" note="训练点误差 < 1e-9" width={1040} color={C.cyan} />
            <Row name="λ = 1e6" value="收缩到零" note="预测绝对值 < 1e-3" width={1040} color={C.coral} />
            <Row name="前沿" value="四点" note="前三个在前沿，第四个被支配" width={1040} color={C.violet} />
            <Row name="稳定性" value="同 seed 一致" note="两次调用，前沿完全相同" width={1040} color={C.inkDim} />
            <Row name="合法性" value="≥ 2 成员" note="修复之后，子集不会退化" width={1040} color={C.cyan} />
          </Card>
        </div>
        <Foot>先跑起来，再谈收益。</Foot>
      </AbsoluteFill>
    </Pages>
  </Scene>
);
