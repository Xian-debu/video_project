import React from "react";
import { Build } from "../../design/primitives";
import { C, FONT, FT } from "../../design/tokens";
import { Head, Scene, PAD, Card, Body, Mono, K, beatAt } from "../shared";

const Code: React.FC<{ lines: string[]; color?: string }> = ({ lines, color = C.inkDim }) => (
  <div>
    {lines.map((l, i) => (
      <div key={i} style={{ fontFamily: FONT.mono, fontSize: FT.code, color: l.startsWith("--") ? C.inkFaint : color, lineHeight: 1.72, whiteSpace: "pre" }}>{l}</div>
    ))}
  </div>
);

/** 实现：四个核心函数与二十三条断言。 */
export const SImplementation: React.FC = () => {
  const b = (i: number) => beatAt("implementation", i, 39);
  return (
    <Scene id="implementation">
      <Head kicker="05 / 实现" title="一百九十行，四个函数" goal="不需要 LAPACK 的 2x2" />

      <div style={{ position: "absolute", left: PAD, top: 268, width: 560 }}>
        <Build at={b(3)}>
          <Card label="pca2 · 两遍扫描" accent={C.violet} style={{ width: 560, height: 480 }} pad={20}>
            <Code lines={[
              "-- 第一遍：均值 + 标准差",
              "mx = sum xs / n",
              "sx = sampleStd xs      -- ddof=1",
              "zxs = [(x-mx)/sx | x<-xs]",
              "zys = [(y-my)/sy | y<-ys]",
              "-- 第二遍：相关系数",
              "b  = sum (zipWith (*) zxs zys)",
              "     / (n-1)",
              "lam1 = 1 + abs b",
              "lam2 = max 0 (1 - abs b)",
              "c = 1/sqrt 2; s = sgn * c",
            ]} />
            <Body size={FT.micro} style={{ marginTop: 10 }}>二乘二闭式解：不引线性代数库，特征值之和恒为 2。</Body>
          </Card>
        </Build>
      </div>

      <div style={{ position: "absolute", left: 672, top: 268, width: 560 }}>
        <Build at={b(9)}>
          <Card label="binOf / hexCenter · 互为逆" accent={C.cyan} style={{ width: 560, height: 480 }} pad={20}>
            <Code lines={[
              "binOf s (Win2 x y) = (col, row)",
              "  where",
              "    row = round (y / (s*h))",
              "    col = round (x/s - 0.5*",
              "          fromIntegral (mod row 2))",
              "",
              "hexCenter s (col,row) =",
              "  ( s*(col + 0.5*(row mod 2))",
              "  , s*h*row )",
              "  where h = sqrt 3 / 2",
            ]} color={C.cyan} />
            <Body size={FT.micro} style={{ marginTop: 10 }}>先定行、再按行奇偶取列；先加 1e-9 再 floor/round，削掉浮点毛刺。</Body>
          </Card>
        </Build>
      </div>

      <div style={{ position: "absolute", left: 1272, top: 268, width: 528 }}>
        <Build at={b(14)}>
          <Card label="concentration · 核心判据" accent={C.coral} style={{ width: 528, height: 480 }} pad={20}>
            <Code lines={[
              "concentration cut m",
              "  | null m   = 0",
              "  | otherwise =",
              "      covered / total",
              "  where",
              "    total = binTotal m",
              "    k = max 1 (round",
              "        (cut * occupiedBins m))",
              "    covered = sum (map snd",
              "        (topBins k m))",
            ]} color={C.coral} />
            <Body size={FT.micro} style={{ marginTop: 10 }}>cut=0.2 → 前 20% 格子；稀疏计数用 Data.Map.Strict，按 key 排序可审计。</Body>
          </Card>
        </Build>
      </div>

      <div style={{ position: "absolute", left: PAD, top: 774, width: 1060 }}>
        <Build at={b(20)}>
          <Card label="二十三条断言 · 关键几条" accent={C.amber} style={{ width: 1060, height: 240 }} pad={20}>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
              {[
                "4 格心 → 4 格", "格心/分箱互逆", "9+1 → 集中度 0.9",
                "10 均匀 → 0.2", "反变换 < 1e-10", "平移不变",
                "λ1+λ2 = 2", "完全相关 λ1=2", "常量列不 NaN", "NaN 报错",
              ].map((t) => (
                <div key={t} style={{ padding: "6px 10px", border: "1px solid " + C.panelLine, borderRadius: 8, fontFamily: FONT.mono, fontSize: FT.micro, color: C.inkDim }}>{t}</div>
              ))}
            </div>
            <Body size={FT.meta} style={{ marginTop: 16 }}>
              二十三条全部通过；总套件三百三十一条。第二章起每个模块独立，Algos 之间不互相 import。
            </Body>
          </Card>
        </Build>
      </div>

      <div style={{ position: "absolute", left: 1160, top: 774, width: 640 }}>
        <Build at={b(27)}>
          <Card label="依赖与复杂度" accent={C.inkFaint} style={{ width: 640, height: 240 }} pad={20}>
            <Body size={FT.body} style={{ lineHeight: 1.8 }}>
              O(n) 时间：每个窗口一次分箱。<br />
              O(占用格数) 空间：五万窗口 → 333 个整数计数。<br />
              新增依赖 containers≥0.7（稀疏映射），其余只用 base。
            </Body>
            <K>模块：TsBase.Algos.Ch08.HexbinBalance · 191 行</K>
          </Card>
        </Build>
      </div>
    </Scene>
  );
};