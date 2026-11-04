import React from "react";
import { AbsoluteFill } from "remotion";
import { C, FONT, FT } from "../../design/tokens";
import { Bars, Body, Card, CodeBlock, Foot, KV, M, PAD, Pages, Row, Scene, SceneHead, fmtInt, pagesOf } from "../shared";

export const ImplementationScene: React.FC = () => (
  <Scene id="implementation">
    <SceneHead id="implementation" />
    <Pages id="implementation" at={pagesOf("implementation")}>
      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 300, width: 640 }}>
          <Body size={FT.h1} color={C.ink} style={{ lineHeight: 1.2 }}>三个模块，<br />各管一段。</Body>
          <Body style={{ marginTop: 24 }}>
            线性头 106 行，旁路 126 行，锚点 89 行，一共 {M.code.totalLines} 行；加 {M.code.tests} 条单元测试，
            加一个 443 行的证据程序。全是纯函数，没有输入输出，没有随机数。
          </Body>
          <div style={{ display: "flex", marginTop: 28 }}>
            <KV k="实现" v={M.code.totalLines + " 行"} color={C.cyan} />
            <KV k="单测" v={M.code.tests + " 条"} color={C.violet} />
            <KV k="证据程序" v={fmtInt(M.code.evidenceLines) + " 行"} color={C.coral} />
          </div>
        </div>
        <div style={{ position: "absolute", left: 790, top: 286, width: 1030 }}>
          <Bars
            width={940}
            rowH={92}
            labelW={200}
            max={443}
            items={[
              { label: "LinearProbe", value: M.code.probeLines, text: String(M.code.probeLines), color: C.cyan },
              { label: "LoraBypass", value: M.code.loraLines, text: String(M.code.loraLines), color: C.violet },
              { label: "AnchorPrefix", value: M.code.anchorLines, text: String(M.code.anchorLines), color: C.amber },
              { label: "证据程序", value: M.code.evidenceLines, text: String(M.code.evidenceLines), color: C.coral },
            ]}
          />
          <div style={{ marginTop: 10, fontFamily: FONT.mono, fontSize: FT.meta, color: C.inkFaint }}>
            单测 {M.code.probeTests} / {M.code.loraTests} / {M.code.anchorTests}；证据程序跑 {M.code.checks} 项检查
          </div>
        </div>
        <Foot>没有 IO，才敢说可复现。</Foot>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 296, width: 600 }}>
          <Body size={FT.h1} color={C.ink} style={{ lineHeight: 1.2 }}>线性头：<br />解一个方程。</Body>
          <Body style={{ marginTop: 24 }}>
            正规方程，左边 XᵀX 加岭项，右边 XᵀY。用高斯消元：列主元，每步选绝对值最大的行。
            选错了，方程会悄悄解错。
          </Body>
          <Body style={{ marginTop: 16, color: C.amber }}>
            岭项只加到权重上，截距列不动——不然特征会少掉水平信息。
          </Body>
          <div style={{ display: "flex", marginTop: 22 }}>
            <KV k="消元" v="列主元" color={C.cyan} />
            <KV k="正则" v="只罚权重" color={C.amber} />
          </div>
        </div>
        <div style={{ position: "absolute", left: 730, top: 270, width: 1120 }}>
          <CodeBlock
            width={1090}
            size={FT.code}
            title="TsBase.Algos.Ch07.LinearProbe"
            lines={[
              { t: "-- 正规方程：(XᵀX + λ·I₀) w = XᵀY", dim: true },
              { t: "solveLinear :: [[Double]] -> [Double] -> [Double]", },
              { t: "-- 列主元：每步挑绝对值最大的行交换上来", dim: true },
              { t: "pivotRow m k = snd (maximum [(abs (m !! r !! k), r) | r <- [k .. n-1]])", },
              { t: "-- 岭项只加在权重上，截距列保持不动", dim: true },
              { t: "penalize lambda xtx = [ zipWith (+) (xtx !! i) (col i) | i <- [0 .. n-1] ]" },
              { t: "  where col i = [ if i == j && j < n-1 then lambda else 0 | j <- [0 .. n-1] ]", hi: true },
              { t: "-- 解出来 w：65 行 × 20 列，共 1,300 个数", dim: true },
              { t: "ridgeFit lambda xs ys = solveLinear (penalize lambda (xtx xs)) (xtxY xs ys)" },
            ]}
          />
        </div>
        <Foot>正规方程，一次解出来。</Foot>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 296, width: 600 }}>
          <Body size={FT.h1} color={C.ink} style={{ lineHeight: 1.2 }}>旁路：<br />合并与梯度。</Body>
          <Body style={{ marginTop: 24 }}>
            每个 epoch 只在训练前合并一次。对 B 的梯度是「误差 × A × 输入」，对 A 是「Bᵀ × 误差 × 输入」，
            都乘 2 除以样本数。
          </Body>
          <Body style={{ marginTop: 16, color: C.amber }}>
            更新只做减法；学习率最后定在 0.001。
          </Body>
          <div style={{ display: "flex", marginTop: 22 }}>
            <KV k="秩" v={String(M.lora.rank)} color={C.violet} />
            <KV k="学习率" v="0.001" color={C.amber} />
            <KV k="样本对" v={String(M.lora.pairs)} color={C.inkDim} />
          </div>
        </div>
        <div style={{ position: "absolute", left: 730, top: 270, width: 1120 }}>
          <CodeBlock
            width={1090}
            size={FT.code}
            title="TsBase.Algos.Ch07.LoRA"
            lines={[
              { t: "-- 每个 epoch 只在训练前合并一次", dim: true },
              { t: "wEff = zipWith (zipWith (+)) w0 (matMul b a)" },
              { t: "-- 对 B：误差 × A × 输入，缩放 2/n", dim: true },
              { t: "gB = scale (2 / fromIntegral n) (matMul (matMul err (transpose a)) x)" },
              { t: "-- 对 A：Bᵀ × 误差 × 输入，缩放 2/n", dim: true },
              { t: "gA = scale (2 / fromIntegral n) (matMul (matMul (transpose b) err) x)", hi: true },
              { t: "-- 更新只做减法；lr = 0.001，快了会发散", dim: true },
              { t: "step (b, a) = (sub b (scale lr gB), sub a (scale lr gA))" },
            ]}
          />
        </div>
        <Foot accent={C.violet}>合并不是每一步都做。</Foot>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 300, width: 620 }}>
          <Body size={FT.h1} color={C.ink} style={{ lineHeight: 1.2 }}>最贵的 bug：<br />秩和维度写反。</Body>
          <Body style={{ marginTop: 24 }}>
            4×64 和 64×4 写反，形状不对但代码不报错——逐元素相加会静默截断，只更新左上角 4×4。
            训练照跑，损失照降一点点。
          </Body>
          <Body style={{ marginTop: 16, color: C.coral }}>
            所以单测要盯形状。
          </Body>
        </div>
        <div style={{ position: "absolute", left: 760, top: 286, width: 1060 }}>
          <Card label="这个 bug 为什么静默" accent={C.coral} style={{ width: 1010 }} pad={20}>
            <Row name="写反" value="64 × 4" note="该是 A(4×64)，写成了 64×4；B 也是反的" width={962} color={C.coral} valueW={300} />
            <Row name="为什么不报错" value="zipWith" note="逐元素相加遇到长度不同会截断，不抛异常" width={962} color={C.amber} valueW={300} />
            <Row name="后果" value="只更新 4×4" note="其余位置一直是零；损失仍会降，看不出异常" width={962} color={C.coral} valueW={300} />
            <Row name="对策" value="单测盯形状" note="26 条里有专门的形状断言；也靠合并复原误差兜底" width={962} color={C.cyan} valueW={300} />
          </Card>
        </div>
        <Foot accent={C.coral}>这些错误都不会崩，只会让数字悄悄错掉。</Foot>
      </AbsoluteFill>
    </Pages>
  </Scene>
);
