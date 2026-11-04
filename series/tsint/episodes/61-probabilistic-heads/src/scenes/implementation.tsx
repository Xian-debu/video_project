import React from "react";
import { AbsoluteFill } from "remotion";
import { C, FONT, FT } from "../../design/tokens";
import { Body, Card, Chip, CodeBlock, Foot, KV, M, PAD, Pages, Row, Scene, SceneHead, fmtInt, pagesOf } from "../shared";
import { ModuleLines } from "../figs";

export const ImplementationScene: React.FC = () => (
  <Scene id="implementation">
    <SceneHead id="implementation" />
    <Pages id="implementation" at={pagesOf("implementation")}>
      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 292, width: 620 }}>
          <Body size={FT.h1} color={C.ink} style={{ lineHeight: 1.2 }}>三个模块，<br />二百五十九行。</Body>
          <Body style={{ marginTop: 26 }}>
            Pinball 八十七行，管损失、经验分位与交叉计数；QuantileRearrange 五十二行，管排序回填；DistHead 一百二十行，
            管高斯似然与覆盖率。三个模块互不引用，没有 IO，没有外部库，可以单独拷走。
          </Body>
          <div style={{ display: "flex", marginTop: 28 }}>
            <KV k="模块" v="3" color={C.inkDim} />
            <KV k="行数" v={M.code.totalLines} color={C.cyan} />
            <KV k="测试" v={M.code.tests} color={C.amber} />
          </div>
        </div>
        <div style={{ position: "absolute", left: 790, top: 292, width: 1030 }}>
          <Card label="三个模块，三块职责" accent={C.cyan}>
            <ModuleLines width={930} height={200} />
          </Card>
          <div style={{ marginTop: 14, display: "flex", gap: 10 }}>
            <Chip color={C.cyan}>纯函数</Chip>
            <Chip color={C.amber}>无 IO</Chip>
            <Chip color={C.violet}>可单独拷走</Chip>
          </div>
          <div style={{ marginTop: 14, fontFamily: FONT.mono, fontSize: FT.micro, color: C.inkFaint, width: 1000 }}>
            证据程序 {M.code.evidenceLines} 行，把读数写进 JSON；{M.code.tests} 条单测分布在三个模块：{M.code.pinballTests} / {M.code.rearrangeTests} / {M.code.distTests}。
          </div>
        </div>
        <Foot>没有 IO，才敢说可复现。</Foot>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 292, width: 620 }}>
          <Body size={FT.h1} color={C.ink} style={{ lineHeight: 1.2 }}>pinball：<br />三个分支。</Body>
          <Body style={{ marginTop: 26 }}>
            参数是 tau、真实值 y、预测 q。tau 不在零到一之间直接报错，不静默夹断。y 大于等于 q 时罚 tau 乘 y 减 q，
            否则罚一减 tau 乘 q 减 y。三个分支，没有隐藏状态，短到可以逐行对上定义。
          </Body>
          <div style={{ display: "flex", marginTop: 28 }}>
            <KV k="低估" v="tau·(y−q)" color={C.coral} />
            <KV k="高估" v="(1−tau)·(q−y)" color={C.cyan} />
            <KV k="错误" v="报错" color={C.amber} />
          </div>
        </div>
        <div style={{ position: "absolute", left: 790, top: 292, width: 1030 }}>
          <CodeBlock
            title="TsBase.Algos.Ch07.Pinball"
            width={1010}
            size={FT.mono}
            lines={[
              { t: "pinball :: Double -> Double -> Double -> Double" },
              { t: "pinball tau y q" },
              { t: "  | tau <= 0 || tau >= 1 = error \"tau out of (0,1)\"" },
              { t: "  | y >= q    = tau * (y - q)" },
              { t: "  | otherwise = (1 - tau) * (q - y)" },
              { t: "" },
              { t: "meanPinball :: [Double] -> [[Double]] -> [Double] -> Double" },
              { t: "meanPinball taus rows ys =" },
              { t: "  let total = sum [ pinball t y (r !! i) | (t, r) <- zip taus rows," },
              { t: "                                         (i, y) <- zip [0 ..] ys ]" },
              { t: "  in  total / fromIntegral (length taus * length ys)" },
              { t: "" },
              { t: "-- 分母写错是最容易犯的错，所以检查里有一条手算对照" },
            ]}
          />
        </div>
        <Foot>代码短，但每一行都要能对上定义。</Foot>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 292, width: 620 }}>
          <Body size={FT.h1} color={C.ink} style={{ lineHeight: 1.2 }}>排序回填，<br />也只有几行。</Body>
          <Body style={{ marginTop: 26 }}>
            对每个样本取九个值，排序，按 tau 顺序写回。行宽不一致直接报错，说明上游漏了分位。单调检查一开始写反了：
            我按分位线逐行查，而每一行本来就几乎单调；正确做法是按样本取九个 tau 的值再查。这个错误被单元测试抓到。
          </Body>
          <div style={{ display: "flex", marginTop: 28 }}>
            <KV k="排序" v="逐样本" color={C.cyan} />
            <KV k="检查" v="逐样本单调" color={C.amber} />
            <KV k="错误" v="逐行查" color={C.coral} />
          </div>
        </div>
        <div style={{ position: "absolute", left: 790, top: 292, width: 1030 }}>
          <CodeBlock
            title="TsBase.Algos.Ch07.QuantileRearrange"
            width={1010}
            size={FT.code}
            lines={[
              { t: "rearrangeRow :: V.Vector Double -> V.Vector Double" },
              { t: "rearrangeRow = V.fromList . sort . V.toList" },
              { t: "" },
              { t: "rearrangeRows :: [V.Vector Double] -> [V.Vector Double]" },
              { t: "rearrangeRows rows" },
              { t: "  | any ((/= m) . V.length) rows = error \"row width mismatch\"" },
              { t: "  | otherwise = map rearrangeRow rows" },
              { t: "" },
              { t: "-- 单调检查：按样本取九个 tau，不是按 tau 取样本" },
              { t: "monotoneRows ts rows =" },
              { t: "  all monoAt [0 .. m - 1] where monoAt i = ascending (map (V.! i) rows)" },
            ]}
          />
          <div style={{ marginTop: 12, fontFamily: FONT.mono, fontSize: FT.micro, color: C.inkFaint }}>
            交叉计数也一样：先数逆序对，再归一；两条线以下直接报错。
          </div>
        </div>
        <Foot>边界条件不留给调用方去猜。</Foot>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 292, width: 620 }}>
          <Body size={FT.h1} color={C.ink} style={{ lineHeight: 1.2 }}>梯度漏了<br />一个负号。</Body>
          <Body style={{ marginTop: 26 }}>
            分布头有三个部件：NLL、解析梯度、softplus 与 sigmoid。第一版梯度漏了负号，dMu 应该是负的残差除以 sigma 平方；
            数值梯度检查立刻报错，补上负号后两个梯度对上，测试转绿。还有标准正态分位数，用 Acklam 近似。
          </Body>
          <div style={{ display: "flex", marginTop: 28 }}>
            <KV k="dMu" v={M.dist.gradMu.toFixed(4)} color={C.cyan} />
            <KV k="draw" v={M.dist.gradRaw.toFixed(4)} color={C.violet} />
            <KV k="近似误差" v="1.6e-9" color={C.amber} />
          </div>
        </div>
        <div style={{ position: "absolute", left: 790, top: 292, width: 1030 }}>
          <CodeBlock
            title="TsBase.Algos.Ch07.DistHead"
            width={1010}
            size={FT.code}
            lines={[
              { t: "sigmaFromRaw :: Double -> Double" },
              { t: "sigmaFromRaw raw = softplus raw + 1e-6" },
              { t: "" },
              { t: "-- 对 mu 与原始参数 raw 的解析梯度" },
              { t: "gaussianNllGrad :: Double -> Double -> Double -> (Double, Double)" },
              { t: "gaussianNllGrad mu raw y =" },
              { t: "  let s  = sigmaFromRaw raw" },
              { t: "      e  = y - mu" },
              { t: "      dMu  = negate e / (s * s)" },
              { t: "      draw = (1 - (e * e) / (s * s)) * sigmoid raw" },
              { t: "  in  (dMu, draw)" },
              { t: "" },
              { t: "-- 数值梯度检查：两个分量都必须对上，容差 1e-6" },
            ]}
          />
        </div>
        <Foot>补上负号，测试才转绿。</Foot>
      </AbsoluteFill>
    </Pages>
  </Scene>
);
