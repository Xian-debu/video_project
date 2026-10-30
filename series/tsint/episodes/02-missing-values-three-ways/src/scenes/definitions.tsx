import React from "react";
import { Build } from "../../design/primitives";
import { C, FONT, FT } from "../../design/tokens";
import { Card, Body, Mono, K, Chip, PAD, Pages, Scene, SceneHead, CodeBlock, fmtE, M, lf } from "../shared";

/** 定义：三行公式、值加掩码的返回值约定、方差恒等式。 */
export const SDefinitions: React.FC = () => {
  const id = "definitions";
  const b = (k: number) => lf(id, k);
  const v = M.variance;
  const cells = (vals: (number | string)[], color: string, on: number[]) => (
    <div style={{ display: "flex", gap: 10 }}>
      {vals.map((x, i) => (
        <div key={i} style={{
          width: 74, height: 62, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center",
          background: on.includes(i) ? "rgba(251,113,133,0.10)" : C.panel,
          border: "1.5px solid " + (on.includes(i) ? C.coral : C.panelLine),
          fontFamily: FONT.mono, fontSize: FT.mono, color: on.includes(i) ? color : C.inkDim,
        }}>{x}</div>
      ))}
    </div>
  );
  return (
    <Scene id={id}>
      <SceneHead id={id} />
      <Pages id={id} at={[0, 0.44, 0.72]}>
        {/* 1 · 三行公式 */}
        <div>
          <div style={{ position: "absolute", left: PAD, top: 272, width: 560 }}>
            <Build at={b(0.02)}>
              <CodeBlock width={560} title="Locf.hs · 一次前向扫描" lines={[
                { t: "locf :: Vector (Maybe Double)", hi: true },
                { t: "     -> Either LocfError", hi: true },
                { t: "          (Vector Double, Vector Bool)", hi: true },
                { t: "-- 携带上一个观测，逐点写" },
                { t: "step carry Nothing  = (carry, True)" },
                { t: "step _     (Just x) = (Just x, False)" },
                { t: "-- 首端缺失 / 整段无观测 → Left" },
              ]} />
            </Build>
            <Build at={b(0.06)}>
              <div style={{ marginTop: 12 }}><Card accent={C.amber} pad={14} style={{ width: 560 }}>
                <K color={C.amber}>locfForward：先跳过首端缺失，其余相同</K>
              </Card></div>
            </Build>
          </div>
          <div style={{ position: "absolute", left: PAD + 600, top: 272, width: 560 }}>
            <Build at={b(0.1)}>
              <CodeBlock width={560} title="StatImp.hs · 均值与中位数" lines={[
                { t: "data Stat = Mean | Median", hi: true },
                { t: "statimp :: Stat -> Vector (Maybe Double)" },
                { t: "        -> Either StatImpError", hi: true },
                { t: "                    (Vector Double, Vector Bool)" },
                { t: "-- 均值：Kahan 补偿求和" },
                { t: "kahan (t,c) x = let y = x - c" },
                { t: "                    t' = t + y" },
                { t: "                in (t', (t' - t) - y)" },
                { t: "-- 中位数：排序后取中，偶数取两中均值" },
              ]} />
            </Build>
          </div>
          <div style={{ position: "absolute", left: PAD + 1200, top: 272, width: 576 }}>
            <Build at={b(0.18)}>
              <CodeBlock width={576} title="LinInterp.hs · 比例插值" lines={[
                { t: "lininterp :: (Double, Double) -> Int", hi: true },
                { t: "          -> Vector (Maybe Double)", hi: true },
                { t: "          -> Either LinInterpError [...]", hi: true },
                { t: "-- 左邻：前缀扫描；右邻：后缀扫描" },
                { t: "lerp l r t = l + (r - l) * t" },
                { t: "-- t = (i - iL) / (iR - iL)" },
                { t: "lininterpAxis :: Vector Double", hi: true },
                { t: "  -> Vector (Maybe Double) -> ...", hi: true },
                { t: "-- 日期坐标：t 按时间比例，不规则间隔也支持" },
              ]} />
            </Build>
          </div>
          <div style={{ position: "absolute", left: PAD, top: 800, width: 1776 }}>
            <Build at={b(0.26)}>
              <Body size={FT.body}>公式只有这三行；所有错误都可测，所有函数都是纯函数。</Body>
            </Build>
          </div>
        </div>

        {/* 2 · 值加掩码 */}
        <div>
          <div style={{ position: "absolute", left: PAD, top: 280, width: 1776 }}>
            <Body color={C.ink} size={FT.lead}>返回值不是裸向量，是值加一个掩码。</Body>
          </div>
          <div style={{ position: "absolute", left: PAD, top: 356, width: 900 }}>
            <Build at={b(0.47)}>
              <Card label="输入 · 1, _, _, 4" accent={C.inkFaint} pad={22} style={{ width: 880, height: 300 }}>
                {cells([1, "?", "?", 4], C.coral, [1, 2])}
                <div style={{ marginTop: 22 }}><Mono size={FT.meta} color={C.coral}>掩码 [False, True, True, False]</Mono></div>
                <Body size={FT.body} style={{ marginTop: 14 }}>掩码告诉你，哪些位置是算出来的，哪些是观测。</Body>
              </Card>
            </Build>
          </div>
          <div style={{ position: "absolute", left: PAD + 920, top: 356, width: 856 }}>
            <Build at={b(0.52)}>
              <Card label="输出 · LOCF" accent={C.amber} pad={22} style={{ width: 856, height: 140 }}>
                {cells([1, 1, 1, 4], C.amber, [1, 2])}
              </Card>
            </Build>
            <Build at={b(0.56)}>
              <Card label="输出 · 线性" accent={C.cyan} pad={22} style={{ width: 856, height: 140, marginTop: 16 }}>
                {cells([1, 2, 3, 4], C.cyan, [1, 2])}
              </Card>
            </Build>
          </div>
          <div style={{ position: "absolute", left: PAD, top: 690, width: 1776 }}>
            <Build at={b(0.63)}>
              <Card label="四个错误类型 · 全部可测" accent={C.coral} pad={20} style={{ width: 1776, height: 150 }}>
                <div style={{ display: "flex", gap: 14 }}>
                  {["首端缺失", "末端缺失", "全缺失", "坐标长度不匹配"].map((t) => (
                    <Chip key={t} color={C.coral}>{t}</Chip>
                  ))}
                </div>
                <Body size={FT.body} style={{ marginTop: 16 }}>下游必须知道，哪个数是观测，哪个数是猜测；这是定义层最重要的约定。</Body>
              </Card>
            </Build>
          </div>
        </div>

        {/* 3 · 方差恒等式 */}
        <div>
          <div style={{ position: "absolute", left: PAD, top: 280, width: 1776 }}>
            <Body color={C.ink} size={FT.lead}>均值填充为什么准：填进去的是常数，常数和观测无关。</Body>
          </div>
          <div style={{ position: "absolute", left: PAD, top: 366, width: 880 }}>
            <Build at={b(0.75)}>
              <Card label="恒等式" accent={C.cyan} pad={26} style={{ width: 860, height: 250 }}>
                <Body color={C.ink} size={FT.h2} style={{ fontFamily: FONT.mono, lineHeight: 1.6 }}>
                  Var(填充后) = (1 − p) · Var(原序列)
                </Body>
                <Body size={FT.body} style={{ marginTop: 18 }}>观测比例 1−p；实测应等于预测，相对误差为零。</Body>
              </Card>
            </Build>
          </div>
          <div style={{ position: "absolute", left: PAD + 900, top: 366, width: 876 }}>
            <Build at={b(0.79)}>
              <Card label="解析值 vs 实测值" accent={C.amber} pad={22} style={{ width: 876, height: 250 }}>
                {[
                  { k: "p = 5%", obs: v.p5.obs, imp: v.p5.imputed, rel: v.p5.relErr },
                  { k: "p = 20%", obs: v.p20.obs, imp: v.p20.imputed, rel: v.p20.relErr },
                ].map((r) => (
                  <div key={r.k} style={{ display: "flex", alignItems: "baseline", gap: 14, height: 64 }}>
                    <Mono size={FT.meta} color={C.inkFaint} style={{ width: 80 }}>{r.k}</Mono>
                    <Mono size={FT.mono} color={C.inkDim}>{fmtE(r.obs, 3)}</Mono>
                    <Mono size={FT.mono} color={C.inkFaint}>→</Mono>
                    <Mono size={FT.mono} color={C.amber}>{fmtE(r.imp, 3)}</Mono>
                    <K color={C.cyan}>RelErr {r.rel.toFixed(1)}</K>
                  </div>
                ))}
                <K style={{ display: "block", marginTop: 10 }}>预测与实测逐位相同（浮点误差范围内）</K>
              </Card>
            </Build>
          </div>
          <div style={{ position: "absolute", left: PAD, top: 660, width: 1776 }}>
            <Build at={b(0.86)}>
              <Card accent={C.inkFaint} pad={20} style={{ width: 1776, height: 120 }}>
                <Body size={FT.body}>这个恒等式只对均值填充成立；中位数也接近，但它不是线性算子，没有恒等式。</Body>
              </Card>
            </Build>
          </div>
        </div>
      </Pages>
    </Scene>
  );
};
