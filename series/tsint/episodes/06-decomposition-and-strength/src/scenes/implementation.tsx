import React from "react";
import { Build } from "../../design/primitives";
import { C, FONT, FT } from "../../design/tokens";
import { Body, Card, Chip, CodeBlock, K, PAD, Pages, Scene, SceneHead, Stat, lf } from "../shared";

const Mod: React.FC<{ name: string; sig: string; err: string; color: string; width: number }> = ({ name, sig, err, color, width }) => (
  <Card label={name} accent={color} style={{ width, height: 300 }}>
    <div style={{ fontFamily: FONT.mono, fontSize: 19, color: C.ink, lineHeight: 1.45, whiteSpace: "pre-wrap" }}>{sig}</div>
    <div style={{ fontFamily: FONT.mono, fontSize: 17, color: C.inkFaint, marginTop: 12 }}>{err}</div>
  </Card>
);

export const SImplementation: React.FC = () => (
  <Scene id="implementation">
    <SceneHead id="implementation" />
    <Pages id="implementation" at={[0, 0.36, 0.69]}>
      <div>
        <div style={{ position: "absolute", left: PAD, top: 236, fontFamily: FONT.sans, fontSize: FT.h2, color: C.inkDim }}>
          三个模块，互相不 import；只依赖 vector 和 Decomp 这个记录类型。
        </div>
        <Build at={lf("implementation", 0.04)}>
          <div style={{ position: "absolute", left: PAD, top: 310, display: "flex", gap: 26 }}>
            <Mod name="TsBase.Algos.Ch02.ClassicalDecomp" sig={"classicalDecomp :: DecompMode\n  -> Int -> Vector Double\n  -> Either DecompError Decomp"} err="DecompBadPeriod / DecompTooShort / DecompNonPositive / DecompZeroSeasonal" color={C.cyan} width={574} />
            <Mod name="TsBase.Algos.Ch02.TrendStrength" sig={"trendStrength :: Decomp -> Double\ntrendVarRatio :: Decomp -> Maybe Double"} err="分母退化时返回 Nothing，对外取 0" color={C.amber} width={574} />
            <Mod name="TsBase.Algos.Ch02.SeasonalStrength" sig={"seasonalStrength :: Decomp -> Double\nseasonalVarRatio :: Decomp -> Maybe Double"} err="同一套退化规则" color={C.violet} width={574} />
          </div>
        </Build>
        <Build at={lf("implementation", 0.14)}>
          <div style={{ position: "absolute", left: PAD, top: 650, width: 1776, display: "flex", gap: 26 }}>
            <Card accent={C.cyan} style={{ width: 574, height: 210 }}><K>纯函数</K><Body style={{ marginTop: 8 }}>没有 IO、没有随机数、没有全局状态；同一个输入永远同一个输出。</Body></Card>
            <Card accent={C.amber} style={{ width: 574, height: 210 }}><K>错误显式</K><Body style={{ marginTop: 8 }}>错误是返回值的一部分，不用异常；调用方必须面对 Left。</Body></Card>
            <Card accent={C.violet} style={{ width: 574, height: 210 }}><K>端点用 Maybe</K><Body style={{ marginTop: 8 }}>两端没有定义就写 Nothing，不用 NaN 假装是数。</Body></Card>
          </div>
        </Build>
      </div>

      <div>
        <div style={{ position: "absolute", left: PAD, top: 236, fontFamily: FONT.sans, fontSize: FT.h2, color: C.inkDim }}>
          先查定义域，再算；顺序本身就是接口的一部分。
        </div>
        <Build at={lf("implementation", 0.4)}>
          <div style={{ position: "absolute", left: PAD, top: 300, width: 1120 }}>
            <CodeBlock title="classicalDecomp · guard 与核心三步" width={1120} size={17} lines={[
              { t: "classicalDecomp mode m xs" },
              { t: "  | m < 2 = Left DecompBadPeriod", hi: true },
              { t: "  | V.length xs < 2 * m + 1 = Left DecompTooShort", hi: true },
              { t: "  | Multiplicative <- mode, Just (i, v) <- firstNonPositive xs" },
              { t: "    = Left (DecompNonPositive i v)" },
              { t: "  | otherwise = build mode m xs" },
              { t: "", dim: true },
              { t: "build mode m xs = do", dim: true },
              { t: "  w <- centeredMaWeights m" },
              { t: "  let k = m `div` 2; lo = k; hi = n - 1 - k" },
              { t: "      trend = V.generate n (\\t -> if t < lo || t > hi then Nothing" },
              { t: "                 else Just (V.sum (V.zipWith (*) w (V.slice (t - k) (2 * k + 1) xs))))" },
              { t: "      detrended = alignPair xs trend" },
              { t: "      raw = V.map phaseMean (phaseTable m detrended)" },
              { t: "      overall = V.sum raw / fromIntegral m" },
              { t: "  ..." },
            ]} at={lf("implementation", 0.42)} />
          </div>
        </Build>
        <Build at={lf("implementation", 0.5)}>
          <div style={{ position: "absolute", left: PAD + 1184, top: 300, width: 592 }}>
            <Card accent={C.coral} style={{ height: 240 }}>
              <K>为什么先查长度</K>
              <Body style={{ marginTop: 8 }}>m ≥ 2 且 n ≥ 2m + 1，核才有足够多的点；否则 trend 全空，后面所有方差都在空集上算。</Body>
            </Card>
            <Card accent={C.amber} style={{ height: 240, marginTop: 18 }}>
              <K>为什么乘法先查正数</K>
              <Body style={{ marginTop: 8 }}>对数没有定义域外的值；一个 0 就会把整个季节项变成 −∞。</Body>
            </Card>
          </div>
        </Build>
        <Build at={lf("implementation", 0.6)}>
          <div style={{ position: "absolute", left: PAD, top: 900, fontFamily: FONT.sans, fontSize: FT.meta, color: C.inkFaint }}>
            顺序写死在 build 里：先趋势、再相位、最后残差——加法与乘法只差这一步用除还是用减。
          </div>
        </Build>
      </div>

      <div>
        <div style={{ position: "absolute", left: PAD, top: 236, fontFamily: FONT.sans, fontSize: FT.h2, color: C.inkDim }}>
          二十八个断言；套件五百零三条，全过。
        </div>
        <Build at={lf("implementation", 0.74)}>
          <div style={{ position: "absolute", left: PAD, top: 310, display: "flex", gap: 26 }}>
            <Card label="ClassicalDecompSpec" accent={C.cyan} style={{ width: 574, height: 280 }}>
              <div style={{ fontFamily: FONT.mono, fontSize: 68, color: C.cyan, lineHeight: 1 }}>13</div>
              <Body size={FT.meta} style={{ marginTop: 10 }}>核权重、端点、重建误差、乘法与加法、错误分支</Body>
            </Card>
            <Card label="TrendStrengthSpec" accent={C.amber} style={{ width: 574, height: 280 }}>
              <div style={{ fontFamily: FONT.mono, fontSize: 68, color: C.amber, lineHeight: 1 }}>8</div>
              <Body size={FT.meta} style={{ marginTop: 10 }}>纯趋势、纯噪声、交换、乘法口径、退化分母</Body>
            </Card>
            <Card label="SeasonalStrengthSpec" accent={C.violet} style={{ width: 574, height: 280 }}>
              <div style={{ fontFamily: FONT.mono, fontSize: 68, color: C.violet, lineHeight: 1 }}>7</div>
              <Body size={FT.meta} style={{ marginTop: 10 }}>纯周期、纯噪声、交换、乘法口径、退化分母</Body>
            </Card>
          </div>
        </Build>
        <Build at={lf("implementation", 0.84)}>
          <div style={{ position: "absolute", left: PAD, top: 650, width: 1120 }}>
            <CodeBlock title="测试命令" width={1120} lines={[
              { t: "docker exec haskell-ts bash -lc 'cd /work && cabal test'" },
              { t: "503 assertions, 0 failures", hi: true },
            ]} at={lf("implementation", 0.8)} />
          </div>
        </Build>
        <Build at={lf("implementation", 0.82)}>
          <div style={{ position: "absolute", left: PAD + 1184, top: 650, width: 592 }}>
            <Stat label="证据条数" value="39" sub="手算 13 · 真实数据 12 · 合成 14" accent={C.cyan} style={{ height: 230 }} />
          </div>
        </Build>
      </div>
    </Pages>
  </Scene>
);
