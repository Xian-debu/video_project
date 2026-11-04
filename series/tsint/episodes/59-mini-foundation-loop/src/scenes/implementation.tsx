import React from "react";
import { AbsoluteFill } from "remotion";
import { C, FONT, FT } from "../../design/tokens";
import { Body, Card, CodeBlock, Foot, KV, M, PAD, Pages, Row, Scene, SceneHead, fmt4, pagesOf } from "../shared";

export const ImplementationScene: React.FC = () => (
  <Scene id="implementation">
    <SceneHead id="implementation" />
    <Pages id="implementation" at={pagesOf("implementation")}>
      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 292, width: 640 }}>
          <Body size={FT.h1} color={C.ink} style={{ lineHeight: 1.2 }}>三个模块，<br />八百二十二行。</Body>
          <Body style={{ marginTop: 26 }}>
            掩码与编码器五百五十二行，线性头一百八十一行，少样本协议八十九行。全部是纯函数，唯一的依赖是随机数核心。
            没有 IO，没有外部库。算法之间互不引用，这是仓库的硬规矩。下面按模块讲关键实现。
          </Body>
          <div style={{ display: "flex", marginTop: 26 }}>
            <KV k="掩码 + 编码器" v="552" color={C.cyan} />
            <KV k="线性头" v="181" color={C.violet} />
            <KV k="协议" v="89" color={C.amber} />
          </div>
        </div>
        <div style={{ position: "absolute", left: 790, top: 286, width: 1050 }}>
          <Card label="三个文件，三块职责" accent={C.cyan}>
            <Row name="MaskRecon.hs" value="552 行" note="掩码生成、前向、手写反传、Adam、训练循环" width={1000} color={C.cyan} />
            <Row name="FlattenHead.hs" value="181 行" note="中心化、岭回归原始/对偶两条路径、Cholesky" width={1000} color={C.violet} />
            <Row name="ShotProtocol" value="89 行" note="少样本协议：三块切分、支持集抽样、边界断言" width={1000} color={C.amber} />
            <Row name="依赖" value="TsBase.Core.Rand" note="Gen、洗牌、高斯抽样；其余全部自写" width={1000} color={C.coral} />
          </Card>
          <div style={{ marginTop: 12, fontFamily: FONT.mono, fontSize: FT.micro, color: C.inkFaint }}>
            导出 43 个符号 · 单测 39 条 · 证据程序 510 行
          </div>
        </div>
        <Foot>没有 IO，才敢说可复现。</Foot>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 292, width: 640 }}>
          <Body size={FT.h1} color={C.ink} style={{ lineHeight: 1.2 }}>掩码：<br />先算账，再抽段。</Body>
          <Body style={{ marginTop: 26 }}>
            掩码段长固定十六。先算段数，再算整段数与余数。用洗牌算法无放回抽段：抽中的整段全部置为真，再抽一段，只遮前余数个点。
            权重向量同步填写：被遮位置填一除以总数，其余位置的权重为零。最后交给损失函数。
          </Body>
          <div style={{ display: "flex", marginTop: 26 }}>
            <KV k="段长" v="16" color={C.cyan} />
            <KV k="整段" v="9" color={C.amber} />
            <KV k="余数" v="10" color={C.violet} />
          </div>
        </div>
        <div style={{ position: "absolute", left: 790, top: 286, width: 1050 }}>
          <Card label="掩码与权重的生成（节选）" accent={C.cyan}>
            <CodeBlock
              width={1000}
              size={19}
              lines={[
                { t: "segLen = 16", dim: true },
                { t: "segCount = div n segLen" },
                { t: "q = div target segLen      -- 整段数" },
                { t: "r = mod target segLen      -- 余数" },
                { t: "segs = shuffleIndices seed segCount", hi: true },
                { t: "full = take q segs" },
                { t: "part = segs !! q" },
                { t: "mask t = segOf t elem full" },
                { t: "       || (segOf t == part && off t < r)" },
                { t: "w = 1 / target", dim: true },
              ]}
            />
          </Card>
        </div>
        <Foot>先抽段，再截余数，最后填权重。</Foot>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 292, width: 640 }}>
          <Body size={FT.h1} color={C.ink} style={{ lineHeight: 1.2 }}>前向直白，<br />反向手写。</Body>
          <Body style={{ marginTop: 26 }}>
            输入先过第一层，加偏置，过双曲正切；再过第二层，加偏置，输出五百一十二维。只取掩码位置算损失。
            反向传播手写：链式法则，一层一层往回。梯度按样本累加，用可变向量，避免反复分配。
          </Body>
          <div style={{ display: "flex", marginTop: 26 }}>
            <KV k="激活" v="tanh" color={C.cyan} />
            <KV k="输出" v="线性" color={C.amber} />
            <KV k="梯度" v="手写反传" color={C.violet} />
          </div>
        </div>
        <div style={{ position: "absolute", left: 790, top: 286, width: 1050 }}>
          <Card label="前向与反传的形状" accent={C.violet}>
            <CodeBlock
              width={1000}
              size={19}
              lines={[
                { t: "encForward enc x = (h, out)", hi: true },
                { t: "  h   = tanh (W1 x + b1)     -- 64 维" },
                { t: "  out = W2 h + b2            -- 512 维" },
                { t: "" },
                { t: "encGradients enc samples = ...", hi: true },
                { t: "  逐样本: dOut -> dH -> dW2,db2 -> dW1,db1" },
                { t: "  只对掩码位置反传: dOut_t = w_t * 2 * (out_t - x_t)" },
                { t: "  累加进 ST 可变向量，最后取一次" , dim: true },
                { t: "" },
                { t: "encGradCheck eps enc samples  -- 中心差分" },
              ]}
            />
          </Card>
        </div>
        <Foot>手写反传，必须用数值梯度兜底。</Foot>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 292, width: 640 }}>
          <Body size={FT.h1} color={C.ink} style={{ lineHeight: 1.2 }}>Adam：<br />每轮换掩码。</Body>
          <Body style={{ marginTop: 26 }}>
            优化器是 Adam：一阶矩、二阶矩，偏差校正。学习率千分之一，批量三十二。每轮开始先洗牌，再按批切分，每轮重新抽掩码。
            这是防「背下这一批」的关键。早停看验证损失，耐心五轮。实测每轮三点二秒，二十轮共六十四秒。
          </Body>
          <div style={{ display: "flex", marginTop: 26 }}>
            <KV k="lr" v="1e-3" color={C.cyan} />
            <KV k="batch" v="32" color={C.amber} />
            <KV k="patience" v="5" color={C.violet} />
          </div>
        </div>
        <div style={{ position: "absolute", left: 790, top: 286, width: 1050 }}>
          <Card label="训练循环：洗牌 → 切批 → 换掩码 → 更新" accent={C.amber}>
            <Row name="学习率" value="1e-3" note="Adam，β1 = 0.9，β2 = 0.999，ε = 1e-8" width={1000} color={C.cyan} />
            <Row name="批量" value="32" note="每批重抽一次掩码与权重" width={1000} color={C.amber} />
            <Row name="轮数" value="20" note="早停 patience = 5，最佳第 19 轮" width={1000} color={C.violet} />
            <Row name="耗时" value="3.2 秒/轮" note="纯 Haskell，单线程" width={1000} color={C.coral} />
            <Row name="种子" value="20261104" note="每轮 seed + epoch × 7919，可复现" width={1000} color={C.cyan} />
          </Card>
          <div style={{ marginTop: 12, fontFamily: FONT.sans, fontSize: FT.meta, color: C.inkFaint }}>
            末轮训练损失 {fmt4(M.train.trainLoss[19])}，验证损失 {fmt4(M.train.valLoss[19])}。
          </div>
        </div>
        <Foot>换掩码，是正则化，也是防泄漏。</Foot>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 292, width: 640 }}>
          <Body size={FT.h1} color={C.ink} style={{ lineHeight: 1.2 }}>闭式解：<br />样本多走原始，维度高走对偶。</Body>
          <Body style={{ marginTop: 26 }}>
            线性头用岭回归闭式解：先算特征均值与目标均值，中心化之后解方程，截距最后补回来。样本多于维度，走原始形式；
            样本少于维度，走对偶形式。两条路都有测试。这里踩过一个坑：对偶路径返回的维度写错了。
          </Body>
          <div style={{ display: "flex", marginTop: 26 }}>
            <KV k="原始" v="p × p 求逆" color={C.cyan} />
            <KV k="对偶" v="n × n 求逆" color={C.violet} />
            <KV k="分解" v="Cholesky" color={C.amber} />
          </div>
        </div>
        <div style={{ position: "absolute", left: 790, top: 286, width: 1050 }}>
          <Card label="两条路径的实现（节选）" accent={C.violet}>
            <CodeBlock
              width={1000}
              size={19}
              lines={[
                { t: "fitRidge :: Double -> Matrix -> Matrix -> Vector", hi: true },
                { t: "fitRidge lam x y" },
                { t: "  | n >= p    = primal xc yc   -- (X'X + lam I)^-1 X'Y" },
                { t: "  | otherwise = dual xc yc     -- X'(XX' + lam I)^-1 Y" },
                { t: "" },
                { t: "primal xc yc = cross xc (cholSolve (gram xc) yc)" },
                { t: "dual   xc yc = rowCross xc (cholSolve (gramT xc) yc)" },
                { t: "" },
                { t: "-- 对偶解是 n 维，必须再乘 X' 才回到 p 维", hi: true },
              ]}
            />
          </Card>
          <div style={{ marginTop: 12, fontFamily: FONT.sans, fontSize: FT.meta, color: C.inkFaint }}>
            曾把对偶解直接当 p 维权重用：越界读，进程直接崩。
          </div>
        </div>
        <Foot>数学等价的两条路，实现上各有一个坑。</Foot>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 292, width: 640 }}>
          <Body size={FT.h1} color={C.ink} style={{ lineHeight: 1.2 }}>崩的时候，<br />没有任何报错。</Body>
          <Body style={{ marginTop: 26 }}>
            测试只留下一行失败。查了很久才定位：原因是拿 n 维向量当 p 维用。改成先乘转置，再取值，改完之后问题消失。
            教训是：不安全索引不报错；维度不对，只会段错误。所以测试要跑二进制看退出码。这条写进了交接文档。
          </Body>
          <div style={{ display: "flex", marginTop: 26 }}>
            <KV k="症状" v="无异常退出" color={C.coral} />
            <KV k="原因" v="越界读" color={C.amber} />
            <KV k="修法" v="返回前乘 Xᵀ" color={C.cyan} />
          </div>
        </div>
        <div style={{ position: "absolute", left: 790, top: 286, width: 1050 }}>
          <Card label="一个段错误的定位记录" accent={C.coral}>
            <Row name="现象" value="进程退出码 139" note="没有 Haskell 异常，spec.log 只有 RUNNING/FAIL" width={1000} color={C.coral} />
            <Row name="怀疑" value="Cholesky 不正定" note="先加抖动、放宽测试，仍然崩" width={1000} color={C.amber} />
            <Row name="真因" value="对偶解维度错" note="V.unsafeIndex 读到 p 维之外，未定义行为" width={1000} color={C.violet} />
            <Row name="修复" value="cross xc (cholSolve l yc)" note="返回 Xᵀα，p 维；删掉 crossRow" width={1000} valueW={480} color={C.cyan} />
            <Row name="预防" value="跑二进制看退出码" note="CI 不能只看框架日志的 FAIL 字样" width={1000} color={C.cyan} />
          </Card>
        </div>
        <Foot>不安全索引的错误，只在运行时炸。</Foot>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 292, width: 640 }}>
          <Body size={FT.h1} color={C.ink} style={{ lineHeight: 1.2 }}>协议很短，<br />断言很硬。</Body>
          <Body style={{ marginTop: 26 }}>
            先按比例切三块：测试取最后两成，验证取再往前一成，剩下的是训练池。支持集从池里洗牌抽前若干个。
            种子等于基础种子加重复序号乘七九一九。样本数超过池子大小就报错，重复次数小于一也报错。所有边界都有断言。
          </Body>
          <div style={{ display: "flex", marginTop: 26 }}>
            <KV k="测试" v="20%" color={C.violet} />
            <KV k="验证" v="10%" color={C.amber} />
            <KV k="池" v="70%" color={C.cyan} />
          </div>
        </div>
        <div style={{ position: "absolute", left: 790, top: 286, width: 1050 }}>
          <Card label="shotSplit：切分与抽样" accent={C.amber}>
            <CodeBlock
              width={1000}
              size={19}
              lines={[
                { t: "shotSplit :: Shot -> Int -> Int -> Int -> [Split]", hi: true },
                { t: "shotSplit shot n repeats seed =" },
                { t: "  [ (support, valBlock n, testBlock n)" },
                { t: "  | rep <- [0 .. repeats - 1]" },
                { t: "  , let support = case shot of" },
                { t: "          ZeroShot  -> []" },
                { t: "          FullShot  -> [0 .. pool n - 1]" },
                { t: "          FewShot k -> take k (shuffle (seed + rep * 7919) (pool n))" },
                { t: "  ]" },
                { t: "" },
                { t: "-- k > pool 或 repeats < 1：直接 error", dim: true },
              ]}
            />
          </Card>
        </div>
        <Foot>协议的价值，全在边界断言里。</Foot>
      </AbsoluteFill>
    </Pages>
  </Scene>
);
