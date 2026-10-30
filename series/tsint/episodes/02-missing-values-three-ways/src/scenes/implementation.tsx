import React from "react";
import { Build } from "../../design/primitives";
import { C, FONT, FT } from "../../design/tokens";
import { Card, Body, Mono, K, Chip, PAD, Pages, Scene, SceneHead, CodeBlock, M, lf } from "../shared";

/** 实现：三个独立模块，纯函数，值加掩码。 */
export const SImplementation: React.FC = () => {
  const id = "implementation";
  const b = (k: number) => lf(id, k);
  const mods = [
    {
      f: "src/TsBase/Algos/Ch02/Locf.hs", c: C.amber,
      exports: "LocfError(..), locf, locfForward, imputedCount",
      note: "一次扫描，携带上一个观测；掩码同一循环生成",
    },
    {
      f: "src/TsBase/Algos/Ch02/StatImp.hs", c: C.coral,
      exports: "Stat(..), StatImpError(..), statimp, statValue, popVar, populationVariance",
      note: "Kahan 求和 + 排序取中；总体方差除 T，不除 T−1",
    },
    {
      f: "src/TsBase/Algos/Ch02/LinInterp.hs", c: C.cyan,
      exports: "LinInterpError(..), lininterp, lininterpAxis",
      note: "前缀找左邻、后缀找右邻；axis 版按日期比例",
    },
  ];
  return (
    <Scene id={id}>
      <SceneHead id={id} />
      <Pages id={id} at={[0, 0.4, 0.7]}>
        {/* 1 · 模块地图 + locf */}
        <div>
          <div style={{ position: "absolute", left: PAD, top: 268, width: 860 }}>
            {mods.map((m, i) => (
              <div key={m.f}>
                <Build at={b(0.03 + i * 0.03)}>
                  <Card label={m.f} accent={m.c} pad={16} style={{ width: 860, height: 148, marginBottom: 12 }}>
                    <Mono size={FT.meta} color={m.c}>{m.exports}</Mono>
                    <Body size={FT.meta} style={{ marginTop: 10 }}>{m.note}</Body>
                  </Card>
                </Build>
              </div>
            ))}
            <Build at={b(0.16)}>
              <div style={{ display: "flex", gap: 10, marginTop: 4 }}>
                <Chip color={C.violet}>只依赖 vector</Chip>
                <Chip color={C.violet}>合计不到 300 行</Chip>
                <Chip color={C.violet}>模块之间不互相 import</Chip>
              </div>
            </Build>
          </div>
          <div style={{ position: "absolute", left: PAD + 900, top: 268, width: 876 }}>
            <Build at={b(0.05)}>
              <CodeBlock width={876} title="Locf.hs · 核心是一次扫描" size={FT.mono} lines={[
                { t: "locf xs = go Nothing V.empty xs" , dim: true },
                { t: "  where" },
                { t: "    go carry !vals !marks = \\ case ..." },
                { t: "      -- 观测：更新携带值，掩码 False" },
                { t: "      Just x  -> (x, False)" },
                { t: "      -- 缺失：用携带值，掩码 True" },
                { t: "      Nothing -> case carry of" },
                { t: "        Just c  -> (c, True)" },
                { t: "        Nothing -> Left LeadingMissing", hi: true },
                { t: "" },
                { t: "-- 一次遍历，O(n)；错误在第一次无值可用时短路" },
              ]} />
            </Build>
            <Build at={b(0.11)}>
              <Card accent={C.amber} pad={16} style={{ width: 876, marginTop: 14 }}>
                <Body size={FT.meta}><Mono color={C.amber}>locfForward</Mono>：跳过首端缺失，其余与 locf 相同。价格口径的误差用它。</Body>
              </Card>
            </Build>
          </div>
        </div>

        {/* 2 · 统计量填充 */}
        <div>
          <div style={{ position: "absolute", left: PAD, top: 268, width: 860 }}>
            <Build at={b(0.42)}>
              <Card label="StatImp · 两个统计量" accent={C.coral} pad={20} style={{ width: 860, height: 340 }}>
                <Body color={C.ink} size={FT.h2} style={{ fontFamily: FONT.serif }}>均值：Kahan 补偿求和</Body>
                <Body size={FT.body} style={{ marginTop: 8 }}>一万个点的和，误差停在一个最小单位附近；朴素的累加做不到。</Body>
                <Body color={C.ink} size={FT.h2} style={{ fontFamily: FONT.serif, marginTop: 18 }}>中位数：排序后取中</Body>
                <Body size={FT.body} style={{ marginTop: 8 }}>偶数个点取中间两个的平均；排序是 O(n log n)，本集数据量下不到十毫秒。</Body>
              </Card>
            </Build>
            <Build at={b(0.5)}>
              <Card label="为什么不用样本方差" accent={C.amber} pad={16} style={{ width: 860, marginTop: 14 }}>
                <Body size={FT.meta}>Var 用总体口径（除 T，ddof=0）。填了这些点，要的是「这一段窗口」的描述统计，不是对总体的无偏估计。</Body>
              </Card>
            </Build>
          </div>
          <div style={{ position: "absolute", left: PAD + 900, top: 268, width: 876 }}>
            <Build at={b(0.46)}>
              <CodeBlock width={876} title="StatImp.hs · 均值与中位数" size={FT.mono} lines={[
                { t: "statimp Mean xs = fillWith (kahanMean xs) xs", hi: true },
                { t: "statimp Median xs = fillWith (median xs) xs", hi: true },
                { t: "" },
                { t: "kahanMean = uncurry (+) . V.foldl' step (0,0)" },
                { t: "  where step (t,c) x = let y = x - c" },
                { t: "                           t' = t + y" },
                { t: "                       in (t', (t' - t) - y)" },
                { t: "" },
                { t: "median xs = let ys = V.modify sort xs" },
                { t: "                n  = V.length ys" },
                { t: "            in if even n" },
                { t: "                 then (ys!(h-1) + ys!h) / 2" },
                { t: "                 else ys!h" },
              ]} />
            </Build>
            <Build at={b(0.56)}>
              <Card accent={C.coral} pad={16} style={{ width: 876, marginTop: 14 }}>
                <K color={C.coral}>statValue 返回被填入的那个统计量，供画图与断言复用</K>
              </Card>
            </Build>
          </div>
        </div>

        {/* 3 · 线性插值 */}
        <div>
          <div style={{ position: "absolute", left: PAD, top: 268, width: 860 }}>
            <Build at={b(0.72)}>
              <CodeBlock width={860} title="LinInterp.hs · 前后缀 + 比例" size={FT.mono} lines={[
                { t: "-- 左邻：前缀扫描，记住最近观测下标" },
                { t: "lefts  = V.scanl' keep (-1) ix" },
                { t: "-- 右邻：后缀扫描" },
                { t: "rights = V.scanr' keep n ix" },
                { t: "" },
                { t: "lerp iL iR xL xR i = xL + (xR-xL) * t" },
                { t: "  where t = (i - iL) / (iR - iL)", hi: true },
                { t: "" },
                { t: "-- lininterpAxis：t 用日期差，不用行号差" },
                { t: "t = (d!i - d!iL) / (d!iR - d!iL)", hi: true },
              ]} />
            </Build>
          </div>
          <div style={{ position: "absolute", left: PAD + 900, top: 268, width: 876 }}>
            <Build at={b(0.8)}>
              <Card label="纯函数四条" accent={C.cyan} pad={20} style={{ width: 876, height: 300 }}>
                {["输入输出都是不可变向量", "没有全局可变状态", "没有随机数输入", "没有隐式类型转换"].map((t) => (
                  <div key={t} style={{ display: "flex", alignItems: "center", gap: 10, height: 52 }}>
                    <div style={{ width: 8, height: 8, borderRadius: 4, background: C.cyan }} />
                    <Body size={FT.body} color={C.ink}>{t}</Body>
                  </div>
                ))}
                <K style={{ display: "block", marginTop: 10 }}>所以可以逐点对拍，也可以逐条断言</K>
              </Card>
            </Build>
            <Build at={b(0.88)}>
              <Card label="验证规模" accent={C.violet} pad={20} style={{ width: 876, height: 180, marginTop: 14 }}>
                <div style={{ display: "flex", gap: 48 }}>
                  <div>
                    <Mono size={FT.num} color={C.violet}>{M.meta.checks.total}</Mono>
                    <K style={{ display: "block" }}>条证据检查</K>
                  </div>
                  <div>
                    <Mono size={FT.num} color={C.cyan}>{M.meta.tests.suite_total}</Mono>
                    <K style={{ display: "block" }}>总测试（本集 +49）</K>
                  </div>
                  <div>
                    <Mono size={FT.num} color={C.amber}>{M.meta.tests.new}</Mono>
                    <K style={{ display: "block" }}>本集新增断言</K>
                  </div>
                </div>
              </Card>
            </Build>
          </div>
        </div>
      </Pages>
    </Scene>
  );
};
