import React from "react";
import { AbsoluteFill } from "remotion";
import { C, FONT, FT } from "../../design/tokens";
import { Body, Card, Chip, CodeBlock, Foot, Formula, KV, M, PAD, Pages, Row, Scene, SceneHead, fmt4, pagesOf } from "../shared";
import { NarColumns, RolloutDiagram } from "../figs";

export const DefinitionsScene: React.FC = () => (
  <Scene id="definitions">
    <SceneHead id="definitions" />
    <Pages id="definitions" at={pagesOf("definitions")}>
      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 292, width: 620 }}>
          <Body size={FT.h1} color={C.ink} style={{ lineHeight: 1.2 }}>每一步，<br />把自己接回去。</Body>
          <Body style={{ marginTop: 26 }}>
            自回归解码的定义只有一行：下一时刻的预测，是当前窗口的函数。拿到预测之后把它接到窗口末尾；窗口长度固定，所以丢掉最老的一点。
            这就是一次推进，重复 F 次就是 F 步解码。F 等于二十，是这一集的主设定。
          </Body>
          <Formula size={44} style={{ marginTop: 24 }} note="推进：x̂ ← f(w)，w ← [w[1:], x̂]">
            x̂<sub style={{ fontSize: 22 }}>t+1</sub> = f( w<sub style={{ fontSize: 22 }}>t</sub> )
          </Formula>
        </div>
        <div style={{ position: "absolute", left: 790, top: 292, width: 1030 }}>
          <Card label="一次推进：丢最老、接最新" accent={C.cyan} style={{ width: 1020 }}>
            <RolloutDiagram width={968} steps={3} />
          </Card>
          <div style={{ marginTop: 14, fontFamily: FONT.mono, fontSize: FT.micro, color: C.coral, width: 1000 }}>
            推理时窗口里混进了模型自己的预测；训练时窗口里全是真实值。这个不对称叫曝光偏差，验证那一段会单独量出来。
          </div>
        </div>
        <Foot>窗口里的东西变了，函数没变。</Foot>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 292, width: 620 }}>
          <Body size={FT.h1} color={C.ink} style={{ lineHeight: 1.2 }}>三个<br />纯函数。</Body>
          <Body style={{ marginTop: 26 }}>
            接口定义成三个纯函数：预测器类型、rollout、教师强制版本。教师强制里第 j 个预测只看真实窗口的第 j 段，从不吃自己的预测，所以适合训练。
            rollout 每一步都要复制窗口，这是它的主要成本——五百一十二个点乘二十步，复制比矩阵乘法还贵。
          </Body>
          <div style={{ display: "flex", marginTop: 26, gap: 10 }}>
            <Chip color={C.cyan}>无 IO</Chip>
            <Chip color={C.cyan}>无外部库</Chip>
            <Chip color={C.amber}>环形缓冲：写进注释，本集不做</Chip>
          </div>
        </div>
        <div style={{ position: "absolute", left: 790, top: 292, width: 1030 }}>
          <CodeBlock width={1010} size={FT.mono} title="TsBase.Algos.Ch07.Autoregressive" lines={[
            { t: "type Predictor = Window -> Double" },
            { t: "" },
            { t: "-- 回灌：每一步吃上一步的输出" },
            { t: "rollout :: Predictor -> Window -> Int -> Vec", hi: true },
            { t: "rollout f w n" },
            { t: "  | n < 0     = error \"negative horizon\"" },
            { t: "  | null w    = error \"empty window\"" },
            { t: "  | otherwise = go w n []" },
            { t: "" },
            { t: "-- 教师强制：每一步都用真实历史，从不回灌" },
            { t: "teacherForced :: Predictor -> Vec -> Int -> Vec", hi: true },
          ]} />
          <div style={{ marginTop: 14, fontFamily: FONT.mono, fontSize: FT.micro, color: C.inkFaint }}>
            20 步 × 512 点复制 = 10,240 个 double 的搬运；更快的写法是环形缓冲，注释里写了，没有实现。
          </div>
        </div>
        <Foot>没有 IO，才敢说可复现。</Foot>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 292, width: 620 }}>
          <Body size={FT.h1} color={C.ink} style={{ lineHeight: 1.2 }}>一次矩阵，<br />二十行。</Body>
          <Body style={{ marginTop: 26 }}>
            非自回归解码的定义也是一行：二十个预测点，一次线性映射同时给出。权重是一个矩阵，行数是地平线长度，每一行负责一个未来时刻、互不依赖。
            输入是六十四维表示，再拼一个常数一作偏置，所以每个输出点有六十五个权重加一个偏置。
          </Body>
          <Formula size={42} style={{ marginTop: 24 }} note="计划书写 1,300；偏置并入最后一列后实测多 20 个">
            (64 + 1 + 1) × 20 = <span style={{ color: C.violet }}>1,320</span>
          </Formula>
        </div>
        <div style={{ position: "absolute", left: 790, top: 292, width: 1030 }}>
          <Card label="20 × 66 个权重：每行一个未来时刻" accent={C.violet} style={{ width: 1020 }}>
            <NarColumns width={950} height={300} />
          </Card>
          <div style={{ marginTop: 14, fontFamily: FONT.mono, fontSize: FT.micro, color: C.inkFaint }}>
            屏幕上永远用实算值：计划 {M.params.planNar}，实测 {M.params.narHead}。
          </div>
        </div>
        <Foot>偏置单独一列也是参数，所以多出二十个。</Foot>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 292, width: 620 }}>
          <Body size={FT.h1} color={C.ink} style={{ lineHeight: 1.2 }}>行主序，<br />不做静默截断。</Body>
          <Body style={{ marginTop: 26 }}>
            矩阵按行主序存，行数等于 F，列数等于六十六；参数个数是输入维加一再加偏置，然后乘地平线。narDecode 只做一件事：一次矩阵向量乘。
            行宽不对就直接报错。测试里用恒等任务验证表达力：一百个样本、八维输入、三维输出，闭式解拟合，均方误差是零。
          </Body>
          <div style={{ display: "flex", marginTop: 28 }}>
            <KV k="恒等任务 MSE" v={fmt4(M.idMse)} color={C.cyan} />
            <KV k="输出维" v="66" color={C.violet} />
            <KV k="地平线" v="20" color={C.amber} />
          </div>
        </div>
        <div style={{ position: "absolute", left: 790, top: 292, width: 1030 }}>
          <CodeBlock width={1010} size={FT.mono} title="TsBase.Algos.Ch07.NonAutoregressive" lines={[
            { t: "-- 一次性输出 F 个点；行数 = F，列数 = 输入维 + 1" },
            { t: "narDecode :: Int -> Mat -> Vec -> Vec", hi: true },
            { t: "narDecode f w x" },
            { t: "  | length w /= f = error \"row count mismatch\"" },
            { t: "  | any ((/= d + 1) . length) w = error \"row width\"" },
            { t: "  | otherwise = [ dot r (augmentFeat x) | r <- w ]" },
            { t: "" },
            { t: "-- 表示末尾补一个 1，作为偏置列" },
            { t: "augmentFeat :: Vec -> Vec", hi: true },
            { t: "augmentFeat x = x ++ [1.0]" },
          ]} />
          <div style={{ marginTop: 14, fontFamily: FONT.mono, fontSize: FT.meta, color: C.inkDim, width: 1000, lineHeight: 1.6 }}>
            恒等测试：100 样本 / 8 维输入 / 3 维输出 → MSE {fmt4(M.idMse)}（Gaussian 随机真值，岭回归闭式解精确求逆）
          </div>
        </div>
        <Foot>定义讲完，下一场定度量。</Foot>
      </AbsoluteFill>
    </Pages>
  </Scene>
);
