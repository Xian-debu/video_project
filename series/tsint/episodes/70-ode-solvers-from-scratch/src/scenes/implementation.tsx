import React from "react";
import { C, FONT, FT, FT_T } from "../../design/tokens";
import { Build } from "../../design/primitives";
import { Card, Mono, Body, Head, Scene, PAD, beatAt } from "../shared";

const kw = (s: string) => <span style={{ color: C.violet }}>{s}</span>;
const cm = (s: string) => <span style={{ color: C.inkFaint }}>{s}</span>;
const str = (s: string) => <span style={{ color: C.cyan }}>{s}</span>;
const fn = (s: string) => <span style={{ color: C.amber }}>{s}</span>;

const Line: React.FC<{ n: number; children: React.ReactNode }> = ({ n, children }) => (
  <div style={{ display: "flex", gap: 18, height: 31, alignItems: "center" }}>
    <div style={{ width: 26, textAlign: "right", color: C.inkFaint, fontSize: FT.micro, fontFamily: FONT.mono }}>{n}</div>
    <div style={{ whiteSpace: "pre", fontFamily: FONT.mono, fontSize: 19, color: C.ink, lineHeight: 1.55 }}>{children}</div>
  </div>
);

const MODULES = [
  { path: "Core/Physics", note: "omega · springEnergy" },
  { path: "Ch09/Analytic", note: "复利 · 弹簧解析解" },
  { path: "Ch09/Euler", note: "一阶步进器" },
  { path: "Ch09/RK4", note: "四阶步进器" },
];

const TESTS = [
  { name: "core.vec", n: 7 },
  { name: "analytic", n: 10 },
  { name: "euler", n: 9 },
  { name: "rk4", n: 8 },
];

/** 实现：同一签名、严格累加器、边界报错、三十四条断言。 */
export const SImplementation: React.FC = () => {
  const beats = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19].map((i) => beatAt("implementation", i, 20));
  return (
    <Scene id="implementation">
      <Head kicker="04 / 实现" title="把公式写成可测试的 Haskell" goal="看签名、严格求值、边界和测试怎么落地" />

      <Build at={beats[3]} style={{ position: "absolute", left: PAD, top: 282, width: 1010 }}>
        <Card label="ts-base · src/TsBase/Algos/Ch09" accent={C.cyan} pad={18}>
          <Line n={1}>{cm("-- 四个模块：Physics / Analytic / Euler / RK4")}</Line>
          <Line n={2}>{cm("-- 两个步进器签名完全相同")}</Line>
          <Line n={3}>{fn("euler")}{" :: (Double -> Double -> Double) -> Double"}</Line>
          <Line n={4}>{cm("      ")}{" -> Double -> Double -> Double -> Int"}</Line>
          <Line n={5}>{cm("      ")}{" -> V.Vector (Double, Double)"}</Line>
          <Line n={6}>{fn("euler")}{" f t0 x0 dt n"}</Line>
          <Line n={7}>{cm("  ")}{"| dt <= 0 = "}{kw("error")}{" "}{str('"euler: dt must be > 0"')}</Line>
          <Line n={8}>{cm("  ")}{"| n < 0  = "}{kw("error")}{" "}{str('"euler: n must be >= 0"')}</Line>
          <Line n={9}>{cm("  ")}{"| otherwise = V.iterateN (n + 1) step (t0, x0)"}</Line>
          <Line n={10}>{cm("  where step (!t, !x) =")}{" (t + dt, x + dt * f t x)"}</Line>
          <Line n={11}>{""}</Line>
          <Line n={12}>{fn("rk4")}{" f t0 x0 dt n = V.iterateN (n + 1) step (t0, x0)"}</Line>
          <Line n={13}>{cm("  where h2 = dt / 2; k1 = f t x")}</Line>
          <Line n={14}>{cm("        ")}{"k2 = f (t + h2) (x + h2 * k1)"}</Line>
          <Line n={15}>{cm("        ")}{"k3 = f (t + h2) (x + h2 * k2)"}</Line>
          <Line n={16}>{cm("        ")}{"k4 = f (t + dt) (x + dt * k3)"}</Line>
          <Line n={17}>{cm("        ")}{"x' = x + dt * (k1 + 2*k2 + 2*k3 + k4) / 6"}</Line>
        </Card>
      </Build>

      <div style={{ position: "absolute", left: 1130, top: 282, width: 718 }}>
        <Build at={beats[1]}>
          <Card label="模块划分" pad={16}>
            {MODULES.map((m) => (
              <div key={m.path} style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", padding: "5px 0" }}>
                <Mono size={FT.meta} color={C.ink}>{m.path}</Mono>
                <Mono size={FT.micro} color={C.inkFaint}>{m.note}</Mono>
              </div>
            ))}
          </Card>
        </Build>

        <Build at={beats[8]} style={{ marginTop: 14 }}>
          <Card label="三个容易写错的地方" accent={C.amber} pad={16}>
            <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
              <div>
                <Mono size={FT.meta} color={C.amber}>{"① 返回 Vector，不是列表"}</Mono>
                <Body size={FT.tiny} style={{ marginTop: 2 }}>{"要按帧索引、要长度，O(1) 取值；列表会在证据程序里退化成 O(n)。"}</Body>
              </div>
              <div>
                <Mono size={FT.meta} color={C.amber}>{"② 累加器加感叹号"}</Mono>
                <Body size={FT.tiny} style={{ marginTop: 2 }}>{"惰性求值会堆出几百万个未求值表达式；严格字段让每步真正算掉。"}</Body>
              </div>
              <div>
                <Mono size={FT.meta} color={C.amber}>{"③ 先判边界再算"}</Mono>
                <Body size={FT.tiny} style={{ marginTop: 2 }}>{"dt ≤ 0 与 n < 0 立即 error，而不是返回空轨迹。"}</Body>
              </div>
            </div>
          </Card>
        </Build>

        <Build at={beats[12]} style={{ marginTop: 14 }}>
          <Card label="测试 · 34 条断言（cabal test）" accent={C.cyan} pad={16}>
            <div style={{ display: "flex", gap: 10 }}>
              {TESTS.map((t) => (
                <div key={t.name} style={{ flex: 1, textAlign: "center", background: C.bg, border: "1px solid " + C.panelLine, borderRadius: 8, padding: "7px 0" }}>
                  <Mono size={FT.h2} color={C.cyan}>{t.n}</Mono>
                  <div><Mono size={FT.micro} color={C.inkFaint}>{t.name}</Mono></div>
                </div>
              ))}
            </div>
          </Card>
        </Build>
      </div>

      <Build at={beats[17]} style={{ position: "absolute", left: PAD, bottom: 108 }}>
        <Mono size={FT.meta} color={C.inkFaint}>{"同一套函数：测试调用一次，证据程序再调用一次"}</Mono>
      </Build>
    </Scene>
  );
};
