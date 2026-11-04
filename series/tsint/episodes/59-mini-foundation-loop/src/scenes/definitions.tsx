import React from "react";
import { AbsoluteFill } from "remotion";
import { C, FONT, FT } from "../../design/tokens";
import { Body, Card, CodeBlock, Foot, Formula, KV, M, PAD, Pages, Row, Scene, SceneHead, pagesOf } from "../shared";
import { ParamSplit, ShotDiagram } from "../figs";

export const DefinitionsScene: React.FC = () => (
  <Scene id="definitions">
    <SceneHead id="definitions" />
    <Pages id="definitions" at={pagesOf("definitions")}>
      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 292, width: 640 }}>
          <Body size={FT.h1} color={C.ink} style={{ lineHeight: 1.2 }}>损失，只算<br />被遮的位置。</Body>
          <Body style={{ marginTop: 26 }}>
            把窗口记作 x，长度五百一十二；掩码集合记作 M。损失只在 M 上求平方误差，再除以 M 的大小：M 上误差平方的平均。
            没被遮的位置权重为零。如果 M 是空集呢？显式返回零——不是零除以零，是定义为零。这一条有单独的测试。
          </Body>
          <div style={{ display: "flex", marginTop: 26 }}>
            <KV k="|M|" v="154" color={C.amber} />
            <KV k="空集" v="返回 0" color={C.cyan} />
            <KV k="权重" v="1 / |M|" color={C.violet} />
          </div>
        </div>
        <div style={{ position: "absolute", left: 790, top: 286, width: 1050 }}>
          <Card label="掩码重建的损失" accent={C.cyan}>
            <Formula size={56} note="M 是被遮位置的下标集合；w_t = 1/|M| 当 t 属于 M，否则 0">
              L = (1 / |M|) · Σ (x_t − x̂_t)²
            </Formula>
            <div style={{ marginTop: 20 }}>
              <Row name="只算掩码位置" value="154 项" note="其余 358 个点不贡献梯度" width={1000} color={C.amber} />
              <Row name="空掩码" value="L = 0" note="显式约定，避免 0/0 = NaN 污染训练" width={1000} color={C.coral} />
              <Row name="实现" value="权重向量" note="maskSeq 直接输出 1/|M| 或 0，损失就是点积" width={1000} color={C.cyan} />
            </div>
          </Card>
        </div>
        <Foot>损失函数只有一处不是显然的：空集。</Foot>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 292, width: 640 }}>
          <Body size={FT.h1} color={C.ink} style={{ lineHeight: 1.2 }}>接口：<br />一个函数出两个向量。</Body>
          <Body style={{ marginTop: 26 }}>
            接口叫 maskSeq：输入掩码率、随机种子、序列长度，输出两个向量。一个是每个位置的权重，一个是被遮与否的布尔标记。
            权重等于一除以 M 的大小，这样损失就是加权平均。同一个种子，逐位可复现；换种子，掩码就换一批。训练时每轮都换。
          </Body>
          <div style={{ display: "flex", marginTop: 26 }}>
            <KV k="输入" v="ratio, Gen, n" color={C.cyan} />
            <KV k="输出" v="weights, mask" color={C.amber} />
          </div>
        </div>
        <div style={{ position: "absolute", left: 790, top: 286, width: 1050 }}>
          <Card label="maskSeq 的签名与返回" accent={C.cyan}>
            <CodeBlock
              width={1000}
              size={20}
              lines={[
                { t: "maskSeq :: Double -> Gen -> Int -> (Vec Double, Vec Bool)", hi: true },
                { t: "maskSeq ratio gen n =" },
                { t: "  let target = round (ratio * fromIntegral n)" },
                { t: "      (full, rest) = divMod target segLen" },
                { t: "      segs = shuffleIndices seed segCount" },
                { t: "      chosen = take full segs" },
                { t: "      part = head (drop full segs)" },
                { t: "  in (weights, mask)", dim: true },
                { t: "" },
                { t: "weights ! t = if mask ! t then 1 / |M| else 0", dim: true },
              ]}
            />
          </Card>
        </div>
        <Foot>种子、权重、标记：一个接口定死口径。</Foot>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 292, width: 640 }}>
          <Body size={FT.h1} color={C.ink} style={{ lineHeight: 1.2 }}>编码器：<br />两层，一个瓶颈。</Body>
          <Body style={{ marginTop: 26 }}>
            第一层五百一十二乘六十四，加六十四个偏置；第二层六十四乘五百一十二，加五百一十二个偏置；再加一个可学习的 mask 向量。
            三万二千七百六十八加六十四，三万二千七百六十八加五百一十二，再加一，等于六万六千一百一十三。计划书写的是六万五千八百五十六。
          </Body>
          <div style={{ display: "flex", marginTop: 26 }}>
            <KV k="W1" v="32,768" color={C.cyan} />
            <KV k="W2" v="32,768" color={C.violet} />
            <KV k="偏置" v="576" color={C.amber} />
          </div>
        </div>
        <div style={{ position: "absolute", left: 790, top: 286, width: 1050 }}>
          <Card label="参数构成" accent={C.cyan}>
            <ParamSplit />
          </Card>
          <Card label="逐项相加" accent={C.amber} style={{ marginTop: 14 }} pad={18}>
            <Row name="W1" value="512 × 64 = 32,768" note="行主序扁平存储" width={1000} color={C.cyan} />
            <Row name="W2" value="64 × 512 = 32,768" note="回到原维度，线性输出" width={1000} color={C.violet} />
            <Row name="b1 + b2" value="64 + 512 = 576" note="两层偏置，输出层偏置不可省" width={1000} color={C.cyan} />
            <Row name="mask" value="1" note="可学习标量，不是零" width={1000} color={C.coral} />
          </Card>
        </div>
        <Foot>66,113 = 32,768 + 64 + 32,768 + 512 + 1。</Foot>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 292, width: 640 }}>
          <Body size={FT.h1} color={C.ink} style={{ lineHeight: 1.2 }}>差的 257，<br />是记法不是错误。</Body>
          <Body style={{ marginTop: 26 }}>
            两个数差了二百五十七：不是算错，是计划把两个偏置和一个标量漏了。我们按实算上屏。
            线性头是六十四加一，乘二十，等于一千三百个参数。总参数六万七千四百一十三，计划写六万六千九百五十六，差四百五十七。偏差写进文档，不硬凑数字。
          </Body>
          <div style={{ display: "flex", marginTop: 26 }}>
            <KV k="编码器差" v="257" color={C.amber} />
            <KV k="头差" v="0" color={C.cyan} />
            <KV k="总差" v="457" color={C.coral} />
          </div>
        </div>
        <div style={{ position: "absolute", left: 790, top: 286, width: 1050 }}>
          <Card label="两本账，并排看" accent={C.amber}>
            <Row name="编码器·计划" value="65,856" note="PLAN.md 的口径" width={1000} color={C.inkFaint} />
            <Row name="编码器·实算" value="66,113" note="W1 + b1 + W2 + b2 + mask token" width={1000} color={C.cyan} />
            <Row name="差值" value="+257" note="两处偏置 576 与标量 1，减去计划隐含的 320" width={1000} color={C.amber} />
            <Row name="总计·计划" value="66,956" note="编码器 65,856 + 线性头 1,300" width={1000} color={C.inkFaint} />
            <Row name="总计·实算" value="67,413" note="上屏与文档一律用这个数" width={1000} color={C.violet} />
          </Card>
        </div>
        <Foot>数字可以对不上，但必须说清为什么。</Foot>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 292, width: 640 }}>
          <Body size={FT.h1} color={C.ink} style={{ lineHeight: 1.2 }}>展平头：<br />六十四维变二十个数。</Body>
          <Body style={{ marginTop: 26 }}>
            把六十四维表示映射成二十个数：二十，就是未来二十天。用岭回归，闭式解。先中心化，再解线性方程。
            目标是误差平方和加惩罚，惩罚让权重收缩：惩罚越强，权重越小。选惩罚系数用验证集，不用测试集。这是本集唯一训练的「下游」。
          </Body>
          <div style={{ display: "flex", marginTop: 26 }}>
            <KV k="输入" v="64" color={C.cyan} />
            <KV k="输出" v="20" color={C.amber} />
            <KV k="参数" v="1,300" color={C.violet} />
          </div>
        </div>
        <div style={{ position: "absolute", left: 790, top: 286, width: 1050 }}>
          <Card label="岭回归的闭式解" accent={C.violet}>
            <Formula size={52} note="H 是 64 维特征，Y 是 20 天目标；λ 由验证集选">
              W = (HᵀH + λI)⁻¹ HᵀY
            </Formula>
            <div style={{ marginTop: 18 }}>
              <Row name="中心化" value="先减均值" note="截距最后补回，避免惩罚截距" width={1000} color={C.cyan} />
              <Row name="惩罚" value="λ · ‖W‖²" note="λ 越大，权重越向零收缩" width={1000} color={C.amber} />
              <Row name="选 λ" value="验证集" note="测试集只在最后评估一次" width={1000} color={C.coral} />
            </div>
          </Card>
        </div>
        <Foot>线性头不参与预训练，只负责读数。</Foot>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 292, width: 640 }}>
          <Body size={FT.h1} color={C.ink} style={{ lineHeight: 1.2 }}>样本少、维度高，<br />就换一条公式。</Body>
          <Body style={{ marginTop: 26 }}>
            解方程有个细节：样本多、维度低，用原始形式；样本少、维度高，用对偶形式。两者数学等价，数值不同。
            我们用 Cholesky 分解，要求矩阵正定；惩罚为零时加一个极小抖动，保证分解不失败。这条路径有专门的测试：训练行残差必须是零。
          </Body>
          <div style={{ display: "flex", marginTop: 26 }}>
            <KV k="原始" v="N ≥ p" color={C.cyan} />
            <KV k="对偶" v="N < p" color={C.violet} />
            <KV k="分解" v="Cholesky" color={C.amber} />
          </div>
        </div>
        <div style={{ position: "absolute", left: 790, top: 286, width: 1050 }}>
          <Card label="两条路径，同一组解" accent={C.cyan}>
            <CodeBlock
              width={1000}
              size={19}
              lines={[
                { t: "fitRidge :: Double -> Matrix Double -> Matrix Double -> Vector Double", hi: true },
                { t: "-- N >= p:  W = (X'X + lam I)^-1 X'Y" },
                { t: "-- N <  p:  W = X' (XX' + lam I)^-1 Y" },
                { t: "" },
                { t: "cholFactor :: Matrix Double -> Maybe (Matrix Double)" },
                { t: "cholSolve  :: Matrix Double -> Vector Double -> Vector Double", dim: true },
                { t: "" },
                { t: "-- lam <= 0 时加 1e-12 抖动，保证正定" },
              ]}
            />
          </Card>
          <div style={{ marginTop: 12, fontFamily: FONT.sans, fontSize: FT.meta, color: C.inkFaint }}>
            对偶路径曾因返回维数写错而段错误——放到实现一节讲。
          </div>
        </div>
        <Foot>数学等价，数值不等价。</Foot>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 292, width: 640 }}>
          <Body size={FT.h1} color={C.ink} style={{ lineHeight: 1.2 }}>少样本协议：<br />支持集只从池里抽。</Body>
          <Body style={{ marginTop: 26 }}>
            先把一千三百六十九个窗口分三块：训练池九百六十，验证一百三十六，测试二百七十三。支持集从训练池里抽。
            样本数为零，支持集为空；样本数为五，抽五条。同一档重复五次，换种子。三档的测试块逐位相同，不同档才可比。
          </Body>
          <div style={{ display: "flex", marginTop: 26 }}>
            <KV k="池" v="960" color={C.cyan} />
            <KV k="验证" v="136" color={C.amber} />
            <KV k="测试" v="273" color={C.violet} />
          </div>
        </div>
        <div style={{ position: "absolute", left: 790, top: 286, width: 1050 }}>
          <Card label="1369 个窗口怎么切" accent={C.violet}>
            <ShotDiagram />
          </Card>
          <Card label="支持集的种子" accent={C.amber} style={{ marginTop: 14 }} pad={18}>
            <Row name="k = 0" value="空集" note="不训练，直接输出零（persistence 基线）" width={1000} color={C.inkFaint} />
            <Row name="k = 5 / 10 / 100" value="洗牌取前 k" note="seed = seed0 + rep × 7919，同一 k 五次不同" width={1000} color={C.cyan} />
            <Row name="测试块" value="逐位相同" note="三档共用同一批测试窗口，否则比较无意义" width={1000} color={C.coral} />
            <Row name="边界" value="k > 池 报错" note="repeats < 1 也报错，全部硬断言" width={1000} color={C.amber} />
          </Card>
        </div>
        <Foot>防泄漏的三条，后面还会再提一次。</Foot>
      </AbsoluteFill>
    </Pages>
  </Scene>
);
