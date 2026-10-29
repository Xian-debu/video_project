import React from "react";
import { C, FONT, FT } from "../../design/tokens";
import { Build } from "../../design/primitives";
import { Head, Scene, PAD, Card, Body, Mono, K, Chip, beatAt, V } from "../shared";

const Code: React.FC<{ title: string; accent: string; lines: string[]; width: number }> = ({ title, accent, lines, width }) => (
  <Card label={title} accent={accent} pad={18} style={{ width }}>
    <div style={{ fontFamily: FONT.mono, fontSize: FT.code, lineHeight: 1.58, color: C.inkDim, whiteSpace: "pre" }}>
      {lines.map((t, i) => (
        <div key={i} style={{ display: "flex", gap: 12 }}>
          <span style={{ color: C.inkFaint, minWidth: 18, textAlign: "right" }}>{String(i + 1).padStart(2, " ")}</span>
          <span style={{ color: t.trimStart().startsWith("--") ? C.inkFaint : C.inkDim }}>{t}</span>
        </div>
      ))}
    </div>
  </Card>
);

/** 实现：两个模块、两套函数；三个容易错的地方，以及复杂度。 */
export const SImplementation: React.FC = () => {
  const b = (i: number) => beatAt("implementation", i, 22);

  return (
    <Scene id="implementation">
      <Head kicker="04 / 两个 Haskell 模块" title="把两个指标写成可测试的代码" goal="TvReg 与 Dtw，两套函数" />

      <div style={{ position: "absolute", left: PAD, top: 288, width: 860 }}>
        <Build at={b(0)}>
          <Code
            title="ts-base · src/TsBase/Algos/Ch09/TvReg.hs" accent={C.amber} width={860}
            lines={[
              "totalVariation :: V.Vector Double -> Double",
              "totalVariation xs",
              "  | V.length xs <= 1 = 0",
              "  | otherwise = V.sum (V.map abs",
              "      (V.zipWith (-) (V.tail xs) xs))",
              "",
              "tvSubgradient xs = V.generate n $ \i ->",
              "  let left  = if i > 0   then signum (at i - at (i-1)) else 0",
              "      right = if i < n-1 then signum (at (i+1) - at i) else 0",
              "   in left - right",
              "",
              "tvLoss lambda pred mse = mse + lambda * totalVariation pred",
            ]}
          />
        </Build>
        <Build at={b(10)} style={{ marginTop: 16 }}>
          <div style={{ display: "flex", gap: 10 }}>
            <Chip color={C.cyan}>{"V.zipWith (-)"}</Chip>
            <Chip color={C.cyan}>{"signum"}</Chip>
            <Chip color={C.amber}>{"差为零 → 0"}</Chip>
          </div>
        </Build>
      </div>

      <div style={{ position: "absolute", left: 968, top: 288, width: 772 }}>
        <Build at={b(3)}>
          <Code
            title="ts-base · src/TsBase/Algos/Ch09/Dtw.hs" accent={C.cyan} width={772}
            lines={[
              "dtw xs ys = (d V.! (n-1) V.! (m-1), path)",
              "  where",
              "    d = V.generate n $ \i -> V.generate m $ \j ->",
              "      let c = abs (xs V.! i - ys V.! j)",
              "       in c + case (i, j) of",
              "            (0, 0) -> 0",
              "            (0, _) -> d V.! 0 V.! (j - 1)",
              "            (_, 0) -> d V.! (i - 1) V.! 0",
              "            _      -> minimum [ d V.! (i-1) V.! j",
              "                              , d V.! i V.! (j-1)",
              "                              , d V.! (i-1) V.! (j-1) ]",
              "    path = go (n - 1) (m - 1) []",
            ]}
          />
        </Build>
        <Build at={b(12)} style={{ marginTop: 16 }}>
          <div style={{ display: "flex", gap: 10 }}>
            <Chip color={C.cyan}>{"未开方"}</Chip>
            <Chip color={C.cyan}>{"零基下标"}</Chip>
            <Chip color={C.violet}>{"dtwBanded 加窗口"}</Chip>
          </div>
        </Build>
      </div>

      <div style={{ position: "absolute", left: PAD, top: 716, width: 1680 }}>
        <Build at={b(15)}>
          <Card label="三条实现纪律 · 以及这笔复杂度" accent={C.violet} pad={16} style={{ width: 1680 }}>
            <div style={{ display: "flex", gap: 26 }}>
              {[
                ["01", "模块隔离", "TvReg 与 Dtw 互不 import；重复十几行，换每块单独验证。"],
                ["02", "量纲分开", "λ 与 MSE 不同量纲；比较前先标准化，λ 不当学习率。"],
                ["03", "复杂度诚实", "无窗口 n×m；滚动两行 O(min(n,m))；窗口 O(nw)。"],
              ].map(([n, t, d]) => (
                <div key={n} style={{ flex: 1 }}>
                  <div style={{ display: "flex", gap: 10, alignItems: "baseline" }}>
                    <Mono size={FT.micro} color={C.cyan}>{n}</Mono>
                    <span style={{ fontFamily: FONT.serif, fontSize: FT.body, color: C.ink }}>{t}</span>
                  </div>
                  <Body size={FT.micro} color={C.inkFaint} style={{ marginTop: 3 }}>{d}</Body>
                </div>
              ))}
            </div>
          </Card>
        </Build>
      </div>

      <div style={{ position: "absolute", left: PAD, top: 900, width: 1680, display: "flex", justifyContent: "space-between" }}>
        <Build at={b(18)}>
          <Mono size={FT.meta} color={C.cyan}>{V.meta.tests + " tests · 全部通过"}</Mono>
        </Build>
        <Build at={b(20)}>
          <Mono size={FT.micro} color={C.inkFaint}>{"GHC 9.14.1 · cabal 3.16.1.0 · " + V.meta.tsBaseCommit}</Mono>
        </Build>
      </div>
    </Scene>
  );
};