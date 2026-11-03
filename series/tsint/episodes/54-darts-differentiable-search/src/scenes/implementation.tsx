import React from "react";
import { AbsoluteFill } from "remotion";
import { C, FONT, FT } from "../../design/tokens";
import { M, Body, Card, Chip, CodeBlock, Foot, KV, Mono, PAD, Pages, Row, Scene, SceneHead, pagesOf } from "../shared";

export const ImplementationScene: React.FC = () => (
  <Scene id="implementation">
    <SceneHead id="implementation" />
    <Pages id="implementation" at={pagesOf("implementation")}>
      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 292, width: 660 }}>
          <Body size={FT.h2} color={C.ink} style={{ lineHeight: 1.3 }}>两个模块，<br />三百一十一行。</Body>
          <Body style={{ marginTop: 22 }}>
            一个管可微搜索，一个管三层空间。都是纯函数：没有随机数，没有外部数值库，不接受隐式状态。
          </Body>
          <div style={{ marginTop: 24, display: "flex", gap: 22 }}>
            <KV k="Darts" v="245 行" color={C.cyan} />
            <KV k="StgBlock" v="66 行" color={C.violet} />
            <KV k="单测" v="20 条" color={C.amber} />
          </div>
        </div>
        <div style={{ position: "absolute", left: 770, top: 286, width: 1070 }}>
          <CodeBlock
            title="TsBase/Algos/Ch06/Darts.hs · softmax 权重"
            width={1010}
            at={20}
            lines={[
              { t: "softmaxWeights :: Double -> V.Vector Double -> V.Vector Double", hi: true },
              { t: "softmaxWeights temp alpha =" },
              { t: "  let m = V.maximum alpha" },
              { t: "      ex = V.map (\\a -> exp ((a - m) / temp)) alpha" },
              { t: "      s  = V.sum ex" },
              { t: "  in V.map (/ s) ex" },
              { t: "" },
              { t: "-- 先减最大值：指数不会溢出" },
              { t: "-- 温度默认 1：越小越锐，越大越平" },
            ]}
          />
          <div style={{ marginTop: 14, fontFamily: FONT.mono, fontSize: FT.meta, color: C.inkFaint }}>
            减最大值不改变 softmax 的结果，只改变数值稳定性。
          </div>
        </div>
        <Foot>先减最大值：不改结果，只买数值稳定。</Foot>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 292, width: 1020 }}>
          <CodeBlock
            title="Darts.hs · 混合算子与搜索一步"
            width={960}
            at={16}
            lines={[
              { t: "mixedOp :: V.Vector Double -> [Op] -> Tensor -> Tensor", hi: true },
              { t: "mixedOp w ops x = foldl' add zero (zipWith scale w (map ($ x) ops))" },
              { t: "" },
              { t: "dartsStep :: DartsParams -> Batch -> Batch -> DartsState -> DartsState", hi: true },
              { t: "dartsStep p tr va st =" },
              { t: "  let st1 = trainStep (dpWeightLR p) tr st      -- 内层：只走一步" },
              { t: "      g   = gradAlpha (dpWeightLR p) va st1      -- 外层：验证梯度" },
              { t: "  in st1 { dsAlpha = stepAlpha (dpAlphaLR p) g" },
              { t: "          , dsSteps = dsSteps st + 1 }" },
              { t: "" },
              { t: "-- 离散化：选中的算子给 +10，其余给 -10，再 softmax 就接近 0/1" },
            ]}
          />
        </div>
        <div style={{ position: "absolute", left: 1100, top: 292, width: 740 }}>
          <Card label="搜索一步做了三件事" accent={C.violet}>
            <Row name="内层" value="1 步" note="用训练批更新 w" width={680} color={C.cyan} />
            <Row name="外层" value="验证梯度" note="穿过一步内层，近似" width={680} color={C.violet} />
            <Row name="收尾" value="α 更新" note="步数 +1，记录轨迹" width={680} color={C.amber} />
            <Row name="不做的" value="海森矩阵" note="二阶项整块省掉" width={680} color={C.coral} />
          </Card>
          <div style={{ marginTop: 16, fontFamily: FONT.mono, fontSize: FT.meta, color: C.inkFaint }}>
            冻结后用 ±10 而不是直接取 argmax：这样离散网络仍然可以写成同一个混合函数的特例。
          </div>
        </div>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 292, width: 680 }}>
          <Body size={FT.h2} color={C.ink} style={{ lineHeight: 1.3 }}>三层空间，<br />三个加权求和。</Body>
          <Body style={{ marginTop: 22 }}>
            宏观混合权重乘块输出，微观混合权重乘表达式输出，三层组合再套一层。没有新的算子，只有嵌套。
          </Body>
        </div>
        <div style={{ position: "absolute", left: 790, top: 286, width: 1050 }}>
          <CodeBlock
            title="StgBlock.hs · 12 个离散选择的组合"
            width={990}
            at={20}
            lines={[
              { t: "macroMix :: V.Vector Double -> [Tensor] -> Tensor" },
              { t: "macroMix beta outs = sum [b * o | (b, o) <- zip (V.toList beta) outs]" },
              { t: "" },
              { t: "microMix :: V.Vector Double -> [Tensor] -> Tensor" },
              { t: "microMix gamma outs = sum [g * o | (g, o) <- zip (V.toList gamma) outs]" },
              { t: "" },
              { t: "stBlock :: MacroWeights -> [HiddenExpr] -> Tensor -> Tensor", hi: true },
              { t: "stBlock mw exprs x = macroMix (mwBeta mw)" },
              { t: "  [ microMix (mwGamma mw) [e x | e <- exprs] | b <- mwBlocks mw ]" },
            ]}
          />
          <div style={{ marginTop: 14, fontFamily: FONT.mono, fontSize: FT.meta, color: C.inkFaint }}>
            黄金值：1.2（宏观）、3.0（微观）、6.5（三层套起来）。
          </div>
        </div>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 292, width: 1000 }}>
          <Card label="单测二十条：十二条 DARTS，八条三层" accent={C.cyan}>
            <Row name="softmax" value="[0.5, 0.5]" note="α = [0,0]，写入绝对值" width={930} color={C.cyan} />
            <Row name="softmax 极端" value="[4.54e-5, 0.99995]" note="α = [0,10]" width={930} color={C.violet} />
            <Row name="混合" value="[0.5, 1.0]" note="恒等 + 置零，输入 [1,2]" width={930} color={C.amber} />
            <Row name="三层" value="1.2 / 3.0 / 6.5" note="宏观 / 微观 / 嵌套" width={930} color={C.cyan} />
            <Row name="性质" value="凸包 · 等变" note="不测性能，只测机制" width={930} color={C.violet} />
          </Card>
          <div style={{ marginTop: 18, display: "flex", gap: 24 }}>
            <KV k="新增断言" v="20" color={C.cyan} />
            <KV k="全仓断言" v="2,158" color={C.violet} />
            <KV k="模块代码" v="311 行" color={C.amber} />
          </div>
        </div>
        <div style={{ position: "absolute", left: 1110, top: 292, width: 740 }}>
          <Body size={FT.h2} color={C.ink} style={{ lineHeight: 1.3 }}>浮点用容差，<br />整数用相等。</Body>
          <Body style={{ marginTop: 22 }}>
            黄金值全部写绝对值：softmax 用 1e-9，MAE 用 1e-4。整数项——选择数、边数、步数——直接相等比较。
          </Body>
          <Body style={{ marginTop: 14 }}>
            这样一条测试既能抓实现错误，也不会因为平台浮点差异随机失败。
          </Body>
        </div>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 292, width: 1030 }}>
          <Card label="证据程序五百一十九行，分六段" accent={C.violet}>
            <Row name="读数据" value="CSV 逐行" note="收益率、滑窗 24 天，标签是下一天" width={960} color={C.cyan} />
            <Row name="切分" value="70 / 15 / 15" note="每只股票各自切，不跨股票" width={960} color={C.violet} />
            <Row name="批处理" value="150 / 80 / 300" note="等距抽样，不整批算" width={960} color={C.amber} />
            <Row name="标准化" value="训练段" note="特征和标签都用训练段均值方差" width={960} color={C.cyan} />
            <Row name="搜索与重训" value="20 + 150 步" note="四个架构各重训一次" width={960} color={C.coral} />
            <Row name="写读数" value="JSON" note="检查清单、汇总、清单三份" width={960} color={C.violet} />
          </Card>
        </div>
        <div style={{ position: "absolute", left: 1130, top: 292, width: 720 }}>
          <Body size={FT.h2} color={C.ink} style={{ lineHeight: 1.3 }}>一条命令，<br />四秒内跑完。</Body>
          <Body style={{ marginTop: 22 }}>
            {M.meta.total} 项检查，{M.meta.passed} 项通过。没有 GPU，没有网络请求，所有随机性都用固定种子。
          </Body>
          <div style={{ marginTop: 22, display: "flex", gap: 22 }}>
            <KV k="检查" v={M.meta.passed + " / " + M.meta.total} color={C.cyan} />
            <KV k="耗时" v={M.seconds.toFixed(2) + "s"} color={C.violet} />
          </div>
        </div>
      </AbsoluteFill>
    </Pages>
  </Scene>
);