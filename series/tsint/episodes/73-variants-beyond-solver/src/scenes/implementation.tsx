import React from "react";
import { C, FONT, FT } from "../../design/tokens";
import { Build } from "../../design/primitives";
import { Head, Scene, PAD, Card, Mono, Body, Num, K, beatAt, V } from "../shared";

const C0 = "#7f8a9a";
const CK = "#e8b45a";
const CF = "#8fd3c7";
const CS = "#b9a6f0";

const CODE: { t: string; c?: string }[] = [
  { t: "-- TsBase.Algos.Ch09.CfC", c: C0 },
  { t: "softplus :: Double -> Double", c: CK },
  { t: "softplus x", c: C.ink },
  { t: "  | x > 0 = x + log (1 + exp (-x))", c: C.ink },
  { t: "  | otherwise = log (1 + exp x)", c: C.ink },
  { t: "", c: C0 },
  { t: "cfcClosedForm :: Double -> Double -> Double -> Double -> Double", c: CK },
  { t: "cfcClosedForm x0 a f t", c: CF },
  { t: "  | f <= 0 = error \"rate f must be > 0\"", c: CS },
  { t: "  | t < 0  = error \"time t must be >= 0\"", c: CS },
  { t: "  | otherwise = a + (x0 - a) * exp (-(f * t))", c: C.ink },
  { t: "", c: C0 },
  { t: "cfcGateBlend g h f t =", c: C.ink },
  { t: "  let s = 1 / (1 + exp (f * t))", c: C.ink },
  { t: "   in s * g + (1 - s) * h", c: C.ink },
  { t: "", c: C0 },
  { t: "-- TsBase.Algos.Ch09.GmOde", c: C0 },
  { t: "gm11Fit xs = (a, b)", c: CF },
  { t: "  where z = ago xs", c: C.ink },
  { t: "        det = m * suu - su * su", c: C.ink },
  { t: "        a = (m * suy - su * sy) / det", c: C.ink },
  { t: "        b = (sy - a * su) / m", c: C.ink },
  { t: "", c: C0 },
  { t: "gmOdeIntegrate z0 a b dt steps = ... rk4Step ...", c: C.ink },
];

/** 实现：两个模块、稳定 softplus、正规方程，以及刻意保留的 RK4。 */
export const SImplementation: React.FC = () => {
  const b = (i: number) => beatAt("implementation", i, 20);

  return (
    <Scene id="implementation">
      <Head kicker="04 / 两个 Haskell 模块" title="把两条方程写成可测试的代码" goal="softplus、闭式解、正规方程，以及模块隔离" />

      <div style={{ position: "absolute", left: PAD, top: 258, width: 1000 }}>
        <Build at={b(0)}>
          <Card label="ts-base · src/TsBase/Algos/Ch09" accent={C.violet} pad={16} style={{ width: 1000 }}>
            <div style={{ background: "#0b1118", borderRadius: 10, padding: "14px 18px", border: "1px solid " + C.panelLine }}>
              <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginBottom: 8 }}>
                <Mono size={FT.micro} color={C.cyan}>{"CfC.hs"}</Mono>
                <Mono size={FT.micro} color={C.inkFaint}>{"·"}</Mono>
                <Mono size={FT.micro} color={C.violet}>{"GmOde.hs"}</Mono>
                <Mono size={FT.micro} color={C.inkFaint}>{"· 刻意重复 softplus 与 rk4Step"}</Mono>
              </div>
              {CODE.map((l, i) => (
                <div key={i} style={{ display: "flex", gap: 16, height: 20, alignItems: "center" }}>
                  <span style={{ width: 24, textAlign: "right", fontFamily: FONT.mono, fontSize: 12, color: C.inkFaint, opacity: 0.6 }}>{String(i + 1).padStart(2, " ")}</span>
                  <span style={{ fontFamily: FONT.mono, fontSize: 15.5, color: l.c ?? C.ink, whiteSpace: "pre" }}>{l.t || " "}</span>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 9, display: "flex", gap: 20 }}>
              <Mono size={FT.micro} color={C.inkFaint}>{"cabal test · 108 条断言 · 全部通过"}</Mono>
              <Mono size={FT.micro} color={C.inkFaint}>{"GHC 9.14.1 · cabal 3.16.1.0"}</Mono>
            </div>
          </Card>
        </Build>
      </div>

      <div style={{ position: "absolute", left: 1096, top: 258, width: 740 }}>
        <Build at={b(3)}>
          <Card label="两个模块 · 两套函数" accent={C.cyan} pad={16} style={{ width: 740 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <div>
                <Mono size={FT.body} color={C.cyan}>{"CfC"}</Mono>
                <div><Mono size={FT.micro} color={C.inkFaint}>{"softplus · softplusNaive · logSumExp"}</Mono></div>
                <div><Mono size={FT.micro} color={C.inkFaint}>{"cfcClosedForm · cfcGateBlend · cfcTrajectory"}</Mono></div>
              </div>
              <div>
                <Mono size={FT.body} color={C.violet}>{"GmOde"}</Mono>
                <div><Mono size={FT.micro} color={C.inkFaint}>{"ago · iago · gm11Fit · gm11Response · gm11Forecast"}</Mono></div>
                <div><Mono size={FT.micro} color={C.inkFaint}>{"gm11MAPE · gmOdeRate · gmOdeRHS · gmOdeIntegrate"}</Mono></div>
              </div>
            </div>
          </Card>
        </Build>

        <Build at={b(7)} style={{ marginTop: 12 }}>
          <Card label="三条实现纪律" accent={C.amber} pad={16} style={{ width: 740 }}>
            {[
              ["01", "算法模块不互相 import", "GmOde 自带 softplus 与 RK4 一步；重复十几行，换每个模块单独验证。"],
              ["02", "softplus 先提出指数", "x>0 时写 x+log(1+e^(−x))，x=1000 也不会 Inf。"],
              ["03", "gmOdeIntegrate 仍调 RK4", "GM-ODE 没有去掉求解器，这一点代码里最清楚。"],
            ].map(([n, q, d]) => (
              <div key={n} style={{ display: "flex", gap: 10, marginBottom: 9 }}>
                <Mono size={FT.meta} color={C.amber}>{n}</Mono>
                <div style={{ width: 630 }}>
                  <div style={{ fontFamily: FONT.sans, fontSize: FT.h3, color: C.ink }}>{q}</div>
                  <Mono size={FT.micro} color={C.inkFaint}>{d}</Mono>
                </div>
              </div>
            ))}
          </Card>
        </Build>

        <Build at={b(17)} style={{ marginTop: 12 }}>
          <Card label="108 条断言 · 分项" accent={C.cyan} pad={16} style={{ width: 740 }}>
            <div style={{ display: "flex", gap: 26, alignItems: "flex-end" }}>
              <div><K>{"前几集"}</K><div><Num value={73} size={32} color={C.inkDim} /></div></div>
              <div><K>{"CfC"}</K><div><Num value={17} size={32} color={C.cyan} /></div></div>
              <div><K>{"GM-ODE"}</K><div><Num value={18} size={32} color={C.violet} /></div></div>
              <div><K>{"合计"}</K><div><Num value={V.meta.tests} size={32} color={C.amber} /></div></div>
            </div>
            <div style={{ marginTop: 8 }}>
              <Body size={FT.micro} color={C.inkDim}>{"本集新增 35 条；旧的 73 条全部保留，没有为了新功能改旧断言。"}</Body>
            </div>
          </Card>
        </Build>

        <Build at={b(20)} style={{ marginTop: 10, textAlign: "right" }}>
          <Mono size={FT.micro} color={C.inkFaint}>{"ts-base @ " + V.meta.tsBaseCommit}</Mono>
        </Build>
      </div>
    </Scene>
  );
};
