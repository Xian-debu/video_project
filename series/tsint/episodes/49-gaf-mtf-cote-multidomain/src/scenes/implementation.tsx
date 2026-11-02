import React from "react";
import { AbsoluteFill } from "remotion";
import { C, FONT, FT } from "../../design/tokens";
import { M, Body, Card, Chip, CodeBlock, Formula, KV, MiniTable, PAD, Pages, pagesOf, Row, Scene, SceneHead } from "../shared";
import { CnnArch } from "../figs";

export const ImplementationScene: React.FC = () => (
  <Scene id="implementation">
    <SceneHead id="implementation" />
    <Pages id="implementation" at={pagesOf("implementation")}>
      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 300, width: 620 }}>
          <Body size={FT.h2} color={C.ink} style={{ lineHeight: 1.28 }}>四种编码，<br />四个函数。</Body>
          <Body style={{ marginTop: 24 }}>
            纯函数，同样的输入永远同样的输出 —— 这也是后面能复现的原因。gasf 先反余弦再做余弦和，gadf 只改一个符号，mtf 先分箱再数转移。
          </Body>
          <div style={{ display: "flex", gap: 12, marginTop: 24 }}>
            <KV k="模块" v="Imaging" color={C.cyan} size={FT.h3} />
            <KV k="黄金值" v="9 条" color={C.violet} size={FT.h3} />
            <KV k="矩阵" v="行主序" color={C.amber} size={FT.h3} />
          </div>
        </div>
        <div style={{ position: "absolute", left: 740, top: 290, width: 1080 }}>
          <CodeBlock width={1020} title="TsBase.Algos.Ch05.Imaging" lines={[
            { t: "gasf :: V.Vector Double -> Matrix", hi: true },
            { t: "gadf :: V.Vector Double -> Matrix", hi: true },
            { t: "mtf  :: Int -> V.Vector Int -> Matrix", hi: true },
            { t: "recurrencePlot :: Double -> V.Vector Double -> Matrix", hi: true },
            { t: "" },
            { t: "gasf x = let ph = fmap (acos . clamp1) (norm x)", dim: true },
            { t: "             in mkImg [ cos (ph!i + ph!j) | i <- ix, j <- ix ]", dim: true },
            { t: "gadf x = ... sin (ph!i - ph!j) ...", dim: true },
            { t: "mtf q b = transitionCounts (quantileBins q b)", dim: true },
            { t: "recurrencePlot eps x = [ if i==j || abs (x!i - x!j) < eps then 1 else 0 | ... ]", dim: true },
          ]} />
        </div>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 300, width: 620 }}>
          <Body size={FT.h2} color={C.ink} style={{ lineHeight: 1.28 }}>网络很小，<br />故意的。</Body>
          <Body style={{ marginTop: 24 }}>
            第一层四通道五乘五，接二乘二最大池化；第二层四通道三乘三，再池化一次接全连接。单通道 {M.cnn.paramsSingle} 个参数，双通道 {M.cnn.paramsDual} 个。
          </Body>
          <div style={{ display: "flex", gap: 12, marginTop: 24 }}>
            <KV k="单通道" v={String(M.cnn.paramsSingle)} color={C.cyan} size={FT.h3} />
            <KV k="双通道" v={String(M.cnn.paramsDual)} color={C.violet} size={FT.h3} />
            <KV k="差" v={String(M.cnn.paramsDual - M.cnn.paramsSingle)} color={C.amber} size={FT.h3} />
          </div>
        </div>
        <div style={{ position: "absolute", left: 740, top: 300, width: 1080 }}>
          <CnnArch width={1000} dual />
          <div style={{ marginTop: 24 }}>
            <Card label="参数量怎么算" accent={C.amber}>
              <Row name="第一层" value="4×1×25 + 4" note="单通道" width={940} />
              <Row name="第二层" value="4×4×9 + 4" note="3×3 卷积" width={940} />
              <Row name="全连接" value="144×3 + 3" note="4×6×6 拉平" width={940} />
              <Row name="双通道多出" value="100" note="4 个核 × 25，正好是第一层的输入通道" width={940} color={C.cyan} />
            </Card>
          </div>
        </div>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 300, width: 640 }}>
          <Body size={FT.h2} color={C.ink} style={{ lineHeight: 1.28 }}>三个数字<br />事先定好。</Body>
          <Body style={{ marginTop: 24 }}>
            {M.cnn.epochs} 轮，学习率 {M.cnn.lr}，批量 {M.cnn.batch}，随机种子 {M.cnn.seed}。每轮洗牌用的是种子加轮次，所以同一份数据重训结果逐位相同。Adam 优化器，标准超参，没有调过。
          </Body>
          <div style={{ display: "flex", gap: 10, marginTop: 22 }}>
            <Chip color={C.cyan}>纯函数训练</Chip>
            <Chip color={C.violet}>逐位可复现</Chip>
          </div>
        </div>
        <div style={{ position: "absolute", left: 760, top: 300, width: 1060 }}>
          <Card label="训练配置" accent={C.cyan}>
            <Row name="轮数" value={String(M.cnn.epochs)} note="每轮重新洗牌" width={980} />
            <Row name="学习率" value={String(M.cnn.lr)} note="Adam，β1 0.9 / β2 0.999" width={980} />
            <Row name="批量" value={String(M.cnn.batch)} note="梯度取平均" width={980} />
            <Row name="种子" value={String(M.cnn.seed)} note="洗牌用 seed + epoch" width={980} color={C.violet} />
          </Card>
          <div style={{ marginTop: 26, fontFamily: FONT.sans, fontSize: FT.meta, color: C.inkDim }}>
            这一条被写成了一个检查项：六十条小样本、一轮训练，同种子重训，两次的损失逐位相同。
          </div>
        </div>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 300, width: 640 }}>
          <Body size={FT.h2} color={C.ink} style={{ lineHeight: 1.28 }}>min-max，<br />不是 z-score。</Body>
          <Formula size={44} style={{ marginTop: 24 }} note="线性压到 [-1,1]，不改变顺序">x̃ = 2(x − min) / (max − min) − 1</Formula>
          <Body style={{ marginTop: 22 }}>
            z-score 不保证区间，截断会砍尾，砍掉的正好是极端值 —— 而极端值往往是行情里最有信息的那几天。这一步是编码的一部分，不是小事。
          </Body>
        </div>
        <div style={{ position: "absolute", left: 780, top: 300, width: 1040 }}>
          <Card label="反解误差：同一个序列，两种前置步骤" accent={C.coral}>
            <Row name="min-max" value="1e-16" note="浮点精度极限，双射成立" width={960} color={C.cyan} />
            <Row name="z-score" value="1.7" note="超界被截断，对角信息丢失" width={960} color={C.coral} />
            <Row name="代价" value="极端值不见了" note="行情的尾巴最值钱" width={960} color={C.amber} />
          </Card>
          <div style={{ marginTop: 22, fontFamily: FONT.mono, fontSize: FT.micro, color: C.inkFaint }}>
            实现里仍然 clamp 一下，防止浮点上界 1 + 1e-16 出 NaN —— 但数据本身先在区间内。
          </div>
        </div>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 300, width: 620 }}>
          <Body size={FT.h2} color={C.ink} style={{ lineHeight: 1.28 }}>四个域，<br />四套特征。</Body>
          <Body style={{ marginTop: 24 }}>
            每个域后面接一个最近质心分类器。投票之前，先各自在验证集上报准确率；准确率就是权重，后面的票都按它算。
          </Body>
          <div style={{ marginTop: 22 }}>
            <Row name="域" value="4" note="时域 / ACF / 谱域 / shapelet" width={600} color={C.violet} />
            <Row name="分类器" value="最近质心" note="每域一个" width={600} />
            <Row name="权重" value="验证集准确率" note="归一后求和为 1" width={600} color={C.cyan} />
          </div>
        </div>
        <div style={{ position: "absolute", left: 740, top: 290, width: 1080 }}>
          <Card label="四套特征：各看一个侧面" accent={C.violet}>
            <MiniTable head={["域", "维数", "内容"]} colW={[200, 140, 640]} width={980}
              rows={[
                ["时域", "7", "均值、方差、偏度、峰度、最大回撤、末段斜率、极差"],
                ["ACF", "12", "滞后 1 到 12 的自相关"],
                ["谱域", "8", "Welch 周期图切成八带"],
                ["shapelet", "8", "到八个子段的距离"],
              ]} />
          </Card>
          <div style={{ marginTop: 18, fontFamily: FONT.sans, fontSize: FT.meta, color: C.inkDim }}>
            四个域，四套特征，四种偏见 —— 这就是投票能成立的原因，也是它失效的原因。
          </div>
        </div>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 300, width: 620 }}>
          <Body size={FT.h2} color={C.ink} style={{ lineHeight: 1.28 }}>投票代码<br />也很短。</Body>
          <Body style={{ marginTop: 24 }}>
            先把准确率归一化，加起来等于一；如果所有域都失败，退化成等权。然后对每个类累加票，累加时用严格大于比较，平票保留更小的类号。
          </Body>
          <div style={{ display: "flex", gap: 12, marginTop: 24 }}>
            <KV k="权重" v="0.3478 / 0.3913 / 0.2609" color={C.violet} size={FT.meta} />
            <KV k="平票" v="取小类号" color={C.amber} size={FT.meta} />
          </div>
        </div>
        <div style={{ position: "absolute", left: 740, top: 290, width: 1080 }}>
          <CodeBlock width={1020} title="TsBase.Algos.Ch05.Cote" lines={[
            { t: "coteWeights :: [Double] -> V.Vector Double", hi: true },
            { t: "cotePredict :: V.Vector Double -> Int -> [Int] -> Int", hi: true },
            { t: "" },
            { t: "coteWeights accs = V.map (/ total) (V.fromList ws)", dim: true },
            { t: "  where ws = map domainWeight accs   -- NaN / <=0 -> 0", dim: true },
            { t: "" },
            { t: "cotePredict w n votes = snd (foldl' step (-1, 0) [0 .. n-1])", dim: true },
            { t: "  where step (bestV, bestC) c = let v = sum [ w!k | (k, pred) <- zip [0..] votes, pred == c ]", dim: true },
            { t: "                                 in if v > bestV then (v, c) else (bestV, bestC)", dim: true },
            { t: "" },
            { t: "-- 票 0.3478 / 0.6522 / 0.0000 -> 一类", hi: true },
          ]} />
        </div>
      </AbsoluteFill>
    </Pages>
  </Scene>
);
