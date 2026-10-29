import React from "react";
import { C, FONT, FT } from "../../design/tokens";
import { Build } from "../../design/primitives";
import { Head, Scene, PAD, Card, Mono, Body, Num, beatAt } from "../shared";

const C0 = "#7f8a9a";
const CK = "#e8b45a";
const CF = "#8fd3c7";
const CS = "#b9a6f0";

const LINES: { t: string; c?: string }[] = [
  { t: "-- TsBase.Algos.Ch09.ParamFit", c: C0 },
  { t: "fitK :: V.Vector (Double, Double) -> Double", c: CK },
  { t: "fitK xs", c: C.ink },
  { t: "  | n < 2      = error \"need at least 2 observations\"", c: CS },
  { t: "  | varT == 0  = error \"timestamps must differ\"", c: CS },
  { t: "  | otherwise  = covTl / varT", c: C.ink },
  { t: "", c: C0 },
  { t: "-- 同一目标函数的梯度版：lossK xs k = mean ((x0 e^{kt} - x)^2)", c: C0 },
  { t: "fitKGradient xs k0 lr iters = go iters k0", c: CK },
  { t: "", c: C0 },
  { t: "-- TsBase.Algos.Ch09.NeuralODE", c: C0 },
  { t: "forwardMLP :: MLP -> Double -> Double -> Double", c: CK },
  { t: "forwardMLP (MLP p) x tau = w3 `dot` h2 + b3", c: C.ink },
  { t: "  where h1 = tanh <$> (w1 · [x, tau] + b1)", c: C.ink },
  { t: "        h2 = tanh <$> (w2 · h1 + b2)", c: C.ink },
  { t: "", c: C0 },
  { t: "integrateRHS f t0 x0 dtMax ts = V.map go ts", c: CF },
  { t: "  where n = max 1 (ceiling ((t - t0) / dtMax))", c: C.ink },
  { t: "        h = (t - t0) / fromIntegral n", c: C.ink },
  { t: "        step (tt, xx) = (tt + h, rk4step f h tt xx)", c: C.ink },
  { t: "", c: C0 },
  { t: "trainFiniteDiff lr epochs eps dtMax ws mlp0", c: CF },
  { t: "  g i = (loss (p // i+eps) - loss (p // i-eps)) / (2*eps)", c: C.ink },
  { t: "  p'  = zipWith (\\pj gj -> pj - lr * gj) p g", c: C.ink },
];

/** 实现：两个模块、三个易错点、50 条断言。 */
export const SImplementation: React.FC = () => {
  const b = (i: number) => beatAt("implementation", i, 21);

  return (
    <Scene id="implementation">
      <Head kicker="04 / 实现" title="把训练写成可测试的 Haskell" goal="签名、边界、严格求值：每一行都能被断言" />

      <div style={{ position: "absolute", left: PAD, top: 266, width: 960 }}>
        <Build at={b(0)}>
          <Card label="ts-base · src/TsBase/Algos/Ch09" accent={C.violet} pad={18}>
            <div style={{ background: "#0b1118", borderRadius: 10, padding: "16px 20px", border: `1px solid ${C.panelLine}` }}>
              <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginBottom: 10 }}>
                <Mono size={FT.micro} color={C.cyan}>{"ParamFit.hs"}</Mono>
                <Mono size={FT.micro} color={C.inkFaint}>{"·"}</Mono>
                <Mono size={FT.micro} color={C.violet}>{"NeuralODE.hs"}</Mono>
              </div>
              {LINES.map((l, i) => (
                <div key={i} style={{ display: "flex", gap: 18, height: 23, alignItems: "center" }}>
                  <span style={{ width: 26, textAlign: "right", fontFamily: FONT.mono, fontSize: 14, color: C.inkFaint, opacity: 0.6 }}>{String(i + 1).padStart(2, " ")}</span>
                  <span style={{ fontFamily: FONT.mono, fontSize: 18, color: l.c ?? C.ink, whiteSpace: "pre" }}>{l.t || " "}</span>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 10, display: "flex", gap: 20 }}>
              <Mono size={FT.micro} color={C.inkFaint}>{"cabal test · 50 条断言 · 全部通过"}</Mono>
              <Mono size={FT.micro} color={C.inkFaint}>{"GHC 9.14.1 · cabal 3.16.1.0"}</Mono>
            </div>
          </Card>
        </Build>
      </div>

      <div style={{ position: "absolute", left: 1040, top: 266, width: 780 }}>
        <Build at={b(4)}>
          <Card label="两个模块" accent={C.cyan} pad={16}>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <div>
                <Mono size={FT.body} color={C.cyan}>{"ParamFit"}</Mono>
                <div><Mono size={FT.micro} color={C.inkFaint}>{"fitK · fitKGradient · lossK"}</Mono></div>
              </div>
              <div>
                <Mono size={FT.body} color={C.violet}>{"NeuralODE"}</Mono>
                <div><Mono size={FT.micro} color={C.inkFaint}>{"forwardMLP · integrateRHS · lossMSE · trainFiniteDiff"}</Mono></div>
              </div>
            </div>
          </Card>
        </Build>

        <Build at={b(8)} style={{ marginTop: 14 }}>
          <Card label="三个容易写错的地方" accent={C.amber} pad={16}>
            {[
              ["01", "时间必须归一化", "t 直接进网络，量和 x 差几个数量级，第一层立刻饱和。"],
              ["02", "RK4 的步数要按段算", "每段 ceiling(Δ/τ)，否则大步长把四阶精度打回一阶。"],
              ["03", "梯度先判边界", "eps<=0、目标时刻早于 t0 都要在计算前报错。"],
            ].map(([n, q, d]) => (
              <div key={n} style={{ display: "flex", gap: 12, marginBottom: 12 }}>
                <Mono size={FT.meta} color={C.amber}>{n}</Mono>
                <div>
                  <div style={{ fontFamily: FONT.sans, fontSize: FT.h3, color: C.ink }}>{q}</div>
                  <Mono size={FT.micro} color={C.inkFaint}>{d}</Mono>
                </div>
              </div>
            ))}
          </Card>
        </Build>

        <Build at={b(15)} style={{ marginTop: 14 }}>
          <Card label="50 条断言 · 分为三组" accent={C.cyan} pad={16}>
            <div style={{ display: "flex", gap: 24, alignItems: "flex-end" }}>
              <div><Mono size={FT.micro} color={C.inkFaint}>{"本章新增"}</Mono><div><Num value={17} size={34} color={C.cyan} /></div></div>
              <div><Mono size={FT.micro} color={C.inkFaint}>{"ParamFit"}</Mono><div><Num value={6} size={34} color={C.cyan} /></div></div>
              <div><Mono size={FT.micro} color={C.inkFaint}>{"NeuralODE"}</Mono><div><Num value={11} size={34} color={C.violet} /></div></div>
              <div><Mono size={FT.micro} color={C.inkFaint}>{"前 33 条"}</Mono><div><Num value={33} size={34} color={C.amber} /></div></div>
            </div>
            <div style={{ marginTop: 8 }}>
              <Body size={FT.micro} color={C.inkDim}>{"边界、解析解、步长收敛、参数计数；失败的断言会停在第一个反例上。"}</Body>
            </div>
          </Card>
        </Build>
      </div>
    </Scene>
  );
};