import React from "react";
import { Build } from "../../design/primitives";
import { C, FONT, FT } from "../../design/tokens";
import { Body, Card, Chip, CodeBlock, K, Mono, PAD, Pages, Scene, SceneHead, lf } from "../shared";

/** 实现：两个模块、一个保护分支、三十三条新断言。 */
export const SImplementation: React.FC = () => {
  const id = "implementation";
  const b = (k: number) => lf(id, k);
  return (
    <Scene id={id}>
      <SceneHead id={id} />
      <Pages id={id} at={[0, 0.36, 0.68]}>
        {/* 1 · 两个模块 */}
        <div>
          <div style={{ position: "absolute", left: PAD, top: 250, width: 860 }}>
            <Build at={b(0.01)}>
              <Card label="模块 1" accent={C.amber} pad={22} style={{ width: 860, height: 196 }}>
                <div style={{ fontFamily: FONT.mono, fontSize: FT.meta, color: C.amber }}>TsBase.Algos.Ch02.Holt</div>
                <Body size={FT.body} color={C.ink} style={{ marginTop: 8 }}>参数、拟合结果、三种初值错误</Body>
                <K style={{ marginTop: 10, display: "block" }}>holt · holtWithInit · holtForecast</K>
              </Card>
            </Build>
            <Build at={b(0.04)}>
              <Card label="模块 2" accent={C.cyan} pad={22} style={{ width: 860, height: 196, marginTop: 20 }}>
                <div style={{ fontFamily: FONT.mono, fontSize: FT.meta, color: C.cyan }}>TsBase.Algos.Ch02.HoltWinters</div>
                <Body size={FT.body} color={C.ink} style={{ marginTop: 8 }}>加法与乘法共用一套状态，两个入口</Body>
                <K style={{ marginTop: 10, display: "block" }}>holtWinters · holtWintersMultiplicative · hwForecast</K>
              </Card>
            </Build>
            <Build at={b(0.07)}>
              <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
                <Chip color={C.cyan}>纯函数</Chip>
                <Chip color={C.cyan}>无 IO</Chip>
                <Chip color={C.coral}>错误显式返回</Chip>
              </div>
            </Build>
          </div>
          <div style={{ position: "absolute", left: PAD + 900, top: 250, width: 876 }}>
            <Build at={b(0.03)}>
              <CodeBlock
                width={876}
                title="Holt.hs · 顺序就是定义"
                size={FT.code}
                lines={[
                  { t: "-- s 先用旧趋势" },
                  { t: "s' = a * x + (1 - a) * (s + b)" },
                  { t: "-- b 再用新的 s" },
                  { t: "b' = beta * (s' - s) + (1 - beta) * b", hi: true },
                  { t: "" },
                  { t: "-- fitted 用 s + b，不用 s' + b'" },
                  { t: "-- 后者偷看了当天收盘价", dim: true },
                ]}
              />
            </Build>
            <Build at={b(0.08)}>
              <Card accent={C.violet} pad={20} style={{ width: 876, height: 128, marginTop: 18 }}>
                <Body size={FT.body}>拟合值取 t−1 时刻的状态；写错这一行，图上会「提前知道答案」。</Body>
              </Card>
            </Build>
          </div>
        </div>

        {/* 2 · 保护分支 */}
        <div>
          <div style={{ position: "absolute", left: PAD, top: 250, width: 1100 }}>
            <Build at={b(0.38)}>
              <CodeBlock
                width={1100}
                title="HoltWinters.hs · 乘法入口"
                size={FT.code}
                lines={[
                  { t: "case V.findIndex (<= 0) xs of" },
                  { t: "  Just i -> Left (HWNonPositive i (xs V.! i))", hi: true },
                  { t: "  Nothing -> go p xs s0 b0 p0", hi: true },
                  { t: "" },
                  { t: "go ... =", dim: true },
                  { t: "  let den = s + b", dim: true },
                  { t: "  in if den <= 0 then Left (HWNonPositive t den)", dim: true },
                  { t: "     else Right $ ...", dim: true },
                ]}
              />
            </Build>
          </div>
          <div style={{ position: "absolute", left: PAD + 1140, top: 250, width: 636 }}>
            <Build at={b(0.42)}>
              <Card label="两条不变量" accent={C.coral} pad={22} style={{ width: 636, height: 300 }}>
                <Body size={FT.body} color={C.ink}>一，绝不产出 NaN 或 Infinity。</Body>
                <Body size={FT.body} style={{ marginTop: 12 }}>二，错误里带下标和值，调用方知道坏在哪。</Body>
                <div style={{ marginTop: 14 }}><Chip color={C.coral}>HWNonPositive i x</Chip></div>
              </Card>
            </Build>
            <Build at={b(0.46)}>
              <Card label="归一化" accent={C.cyan} pad={22} style={{ width: 636, height: 170, marginTop: 18 }}>
                <Body size={FT.body}>每 L 步校一次；加性去均值，乘性归一。</Body>
                <K>预测不变，长度不变</K>
              </Card>
            </Build>
          </div>
          <div style={{ position: "absolute", left: PAD, top: 700, width: 1776 }}>
            <Build at={b(0.5)}>
              <Card accent={C.amber} pad={18} style={{ width: 1776, height: 104 }}>
                <Body size={FT.body}>保护分支不是可选项：真实数据有零，没有它，乘法模型连编译期都过不了这一关。</Body>
              </Card>
            </Build>
          </div>
        </div>

        {/* 3 · 测试 */}
        <div>
          <div style={{ position: "absolute", left: PAD, top: 250, width: 1776 }}>
            <Body color={C.ink} size={FT.lead}>三十三条新断言，把每一步都钉住。</Body>
          </div>
          {[
            { l: "Holt", v: "14", s: "式 2.17–2.20 的每一行", c: C.amber },
            { l: "Holt-Winters", v: "19", s: "加法、乘法、初始化、边界", c: C.cyan },
            { l: "新增合计", v: "33", s: "整套 441 条全过", c: C.violet },
          ].map((x, i) => (
            <div key={x.l} style={{ position: "absolute", left: PAD + i * 608, top: 336, width: 560 }}>
              <Build at={b(0.7 + i * 0.03)}>
                <Card label={x.l} accent={x.c} pad={22} style={{ width: 560, height: 210 }}>
                  <div style={{ fontFamily: FONT.mono, fontSize: FT.display, color: x.c, lineHeight: 1 }}>{x.v}</div>
                  <Body size={FT.meta} style={{ marginTop: 12 }}>{x.s}</Body>
                </Card>
              </Build>
            </div>
          ))}
          <div style={{ position: "absolute", left: PAD, top: 588, width: 1776 }}>
            <Build at={b(0.78)}>
              <Card label="测什么（节选）" accent={C.inkFaint} pad={22} style={{ width: 1776, height: 196 }}>
                <div style={{ display: "flex", gap: 40 }}>
                  <div style={{ flex: 1 }}>
                    <Body size={FT.meta}>· 黄金样例：手算的状态逐位相等，加法与乘法各四步</Body>
                    <Body size={FT.meta}>· β=0 退化成一次平滑；γ=0 退化成 Holt</Body>
                    <Body size={FT.meta}>· 序列短于 2L、负数、零，全部显式报错</Body>
                  </div>
                  <div style={{ flex: 1 }}>
                    <Body size={FT.meta}>· 归一化前后，下一步预测不变</Body>
                    <Body size={FT.meta}>· 网格搜索的最优 SSE 不差于固定组合</Body>
                    <Body size={FT.meta}>· fitted 不偷看当天数据</Body>
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
