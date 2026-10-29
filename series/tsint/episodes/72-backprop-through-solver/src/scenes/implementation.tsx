import React from "react";
import { C, FONT, FT } from "../../design/tokens";
import { Build } from "../../design/primitives";
import { Head, Scene, PAD, Card, Mono, Body, Num, beatAt, BP } from "../shared";

const C0 = "#7f8a9a";
const CK = "#e8b45a";
const CF = "#8fd3c7";
const CS = "#b9a6f0";

const CODE: { t: string; c?: string }[] = [
  { t: "-- TsBase.Algos.Ch09.DirectGrad", c: C0 },
  { t: "gradDirectEuler :: (Double -> Double) -> (Double -> Double)", c: CK },
  { t: "  -> (Double -> Double) -> Double -> Double -> Int -> Double", c: CK },
  { t: "gradDirectEuler f dfdx dfdth h x0 steps", c: C.ink },
  { t: "  | steps < 0 = error \"steps must be >= 0\"", c: CS },
  { t: "  | otherwise = go (steps - 1) (2 * xT) 0", c: C.ink },
  { t: "  where xs = V.iterateN (steps + 1) (\\x -> x + h * f x) x0", c: C.ink },
  { t: "        go n a g | n < 0 = g", c: C.ink },
  { t: "                 | otherwise = go (n-1) (a*(1+h*dfdx x)) (g+a*h*dfdth x)", c: C.ink },
  { t: "", c: C0 },
  { t: "-- TsBase.Algos.Ch09.Adjoint", c: C0 },
  { t: "gradAdjointEuler f dfdx dfdth h x0 steps every", c: CF },
  { t: "  | every <= 0 = error \"checkpoint interval must be > 0\"", c: CS },
  { t: "  | otherwise = back cps 0 x0 0 (2 * xT)", c: C.ink },
  { t: "  where cps = V.fromList (reverse (build 0 x0 []))", c: C.ink },
  { t: "        build i x acc | i > steps = acc", c: C.ink },
  { t: "                      | i `mod` every == 0 = build (i+1) x' ((i,x):acc)", c: C.ink },
  { t: "                      | otherwise = build (i+1) x' acc", c: C.ink },
  { t: "                      where x' = x + h * f x", c: C.ink },
  { t: "", c: C0 },
  { t: "-- 反向：每段从检查点重算，梯度沿段累加", c: C0 },
  { t: "back (i,x0i):rest a g = fold ... (i,x0i) (a,g)", c: C.ink },
  { t: "  where a' = a * (1 + h * dfdx x)", c: C.ink },
  { t: "        g' = g + a * h * dfdth x", c: C.ink },
];

/** 实现：两个模块、严格向量、检查点和 72 条断言。 */
export const SImplementation: React.FC = () => {
  const b = (i: number) => beatAt("implementation", i, 22);

  return (
    <Scene id="implementation">
      <Head kicker="04 / 两个 Haskell 模块" title="把反传写成可测试的 Haskell" goal="签名、严格向量、检查点和相对误差" />

      <div style={{ position: "absolute", left: PAD, top: 258, width: 980 }}>
        <Build at={b(0)}>
          <Card label="ts-base · src/TsBase/Algos/Ch09" accent={C.violet} pad={16}>
            <div style={{ background: "#0b1118", borderRadius: 10, padding: "14px 18px", border: "1px solid " + C.panelLine }}>
              <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginBottom: 8 }}>
                <Mono size={FT.micro} color={C.cyan}>{"DirectGrad.hs"}</Mono>
                <Mono size={FT.micro} color={C.inkFaint}>{"·"}</Mono>
                <Mono size={FT.micro} color={C.violet}>{"Adjoint.hs"}</Mono>
              </div>
              {CODE.map((l, i) => (
                <div key={i} style={{ display: "flex", gap: 16, height: 21, alignItems: "center" }}>
                  <span style={{ width: 24, textAlign: "right", fontFamily: FONT.mono, fontSize: 13, color: C.inkFaint, opacity: 0.6 }}>{String(i + 1).padStart(2, " ")}</span>
                  <span style={{ fontFamily: FONT.mono, fontSize: 16.5, color: l.c ?? C.ink, whiteSpace: "pre" }}>{l.t || " "}</span>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 9, display: "flex", gap: 20 }}>
              <Mono size={FT.micro} color={C.inkFaint}>{"cabal test · 72 条断言 · 全部通过"}</Mono>
              <Mono size={FT.micro} color={C.inkFaint}>{"GHC 9.14.1 · cabal 3.16.1.0"}</Mono>
            </div>
          </Card>
        </Build>
      </div>

      <div style={{ position: "absolute", left: 1060, top: 258, width: 760 }}>
        <Build at={b(3)}>
          <Card label="两个模块" accent={C.cyan} pad={16} style={{ width: 740 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div>
                <Mono size={FT.body} color={C.cyan}>{"DirectGrad"}</Mono>
                <div><Mono size={FT.micro} color={C.inkFaint}>{"gradDirectEuler · gradDirectRK4Linear · directTapeLength"}</Mono></div>
              </div>
              <div>
                <Mono size={FT.body} color={C.violet}>{"Adjoint"}</Mono>
                <div><Mono size={FT.micro} color={C.inkFaint}>{"gradAdjointEuler · gradAdjointContinuousRK4 · checkpointCount"}</Mono></div>
              </div>
            </div>
          </Card>
        </Build>

        <Build at={b(7)} style={{ marginTop: 12 }}>
          <Card label="三个容易写错的地方" accent={C.amber} pad={16} style={{ width: 740 }}>
            {[
              ["01", "磁带必须是严格向量", "惰性列表会在反向时把整条链重新展开，空间优势消失。"],
              ["02", "检查点间隔决定空间", "K 太密浪费内存，太稀重算变长；本实验 K=20。"],
              ["03", "伴随方程有一个负号", "漏掉它梯度整体翻转，数值上一眼可见。"],
            ].map(([n, q, d]) => (
              <div key={n} style={{ display: "flex", gap: 10, marginBottom: 11 }}>
                <Mono size={FT.meta} color={C.amber}>{n}</Mono>
                <div style={{ width: 620 }}>
                  <div style={{ fontFamily: FONT.sans, fontSize: FT.h3, color: C.ink }}>{q}</div>
                  <Mono size={FT.micro} color={C.inkFaint}>{d}</Mono>
                </div>
              </div>
            ))}
          </Card>
        </Build>

        <Build at={b(13)} style={{ marginTop: 12 }}>
          <Card label="72 条断言 · 分项" accent={C.cyan} pad={16} style={{ width: 740 }}>
            <div style={{ display: "flex", gap: 26, alignItems: "flex-end" }}>
              <div><Mono size={FT.micro} color={C.inkFaint}>{"本集新增"}</Mono><div><Num value={22} size={32} color={C.cyan} /></div></div>
              <div><Mono size={FT.micro} color={C.inkFaint}>{"DirectGrad"}</Mono><div><Num value={10} size={32} color={C.violet} /></div></div>
              <div><Mono size={FT.micro} color={C.inkFaint}>{"Adjoint"}</Mono><div><Num value={12} size={32} color={C.amber} /></div></div>
              <div><Mono size={FT.micro} color={C.inkFaint}>{"前 50 条"}</Mono><div><Num value={50} size={32} color={C.inkDim} /></div></div>
            </div>
            <div style={{ marginTop: 8 }}>
              <Body size={FT.micro} color={C.inkDim}>{"容差用相对误差：abs(got−want) ≤ tol·max 1 (abs want)，没有固定 1e-9。"}</Body>
            </div>
          </Card>
        </Build>

        <Build at={b(19)} style={{ marginTop: 10, textAlign: "right" }}>
          <Mono size={FT.micro} color={C.inkFaint}>{"ts-base @ " + BP.meta.tsBaseCommit + " · 错误方向版本另有一条断言"}</Mono>
        </Build>
      </div>
    </Scene>
  );
};
