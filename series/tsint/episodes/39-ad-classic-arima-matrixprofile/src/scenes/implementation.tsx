import React from "react";
import { AbsoluteFill } from "remotion";
import { C, FONT, FT } from "../../design/tokens";
import { PAD, M, U, pagesOf, Pages, Scene, SceneHead, Card, Row, Body, K, Formula, Verdict, Stat, CodeBlock, Bars, unitColor } from "../shared";

export const SImplementation: React.FC = () => {
  const at = pagesOf("implementation");
  return (
    <Scene id="implementation">
      <SceneHead id="implementation" />
      <Pages id="implementation" at={at}>
        {/* 页一：两个文件 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 282, width: 880 }}>
            <div style={{ display: "flex", gap: 18 }}>
              <Stat label="Ch04/ARIMA.hs" value="338 行" sub="10 个单元测试" accent={unitColor.arima} style={{ width: 280 }} />
              <Stat label="Ch04/MatrixProfile.hs" value="129 行" sub="8 个单元测试" accent={unitColor.mp} style={{ width: 300 }} />
            </div>
            <Body style={{ marginTop: 24, width: 840 }}>
              合计四百六十七行、十八个测试。全部是纯函数：种子只决定注入落在哪，模型里没有随机数，同一份数据逐位可复现。
            </Body>
            <div style={{ marginTop: 20 }}>
              <Verdict ok label="无外部依赖，纯 Haskell" />
            </div>
          </div>
          <div style={{ position: "absolute", left: 1000, top: 282, width: 850 }}>
            <CodeBlock width={830} title="核心入口（纯函数）" lines={[
              { t: "arimaResidualScore  :: 阶数 -> 序列 -> 逐点分数", hi: true },
              { t: "  fit (Hannan-Rissanen) -> residual -> |e| / σ" },
              { t: "" },
              { t: "matrixProfile       :: m -> excl -> 序列 -> P", hi: true },
              { t: "  prefix sums + diagonal recurrence, O(n²)" },
              { t: "" },
              { t: "no RNG in the model; seed only places injections" },
            ]} />
          </div>
        </AbsoluteFill>

        {/* 页二：三个坑 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 280, width: 1730 }}>
            <div style={{ fontFamily: FONT.serif, fontSize: FT.h2, color: C.ink }}>三个坑，都在数值上</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 22, marginTop: 24 }}>
              <Card label="一 · theta 越界" accent={C.coral} pad={22}>
                <div style={{ fontFamily: FONT.mono, fontSize: FT.body, color: C.coral }}>|θ| ≤ 0.98</div>
                <Body style={{ marginTop: 10 }}>两步法解出的 theta 可能不可逆，递推一步就冲到无穷。实测修复前 2667 个残差里 1912 个是无穷。</Body>
              </Card>
              <Card label="二 · phi 越界" accent={C.coral} pad={22}>
                <div style={{ fontFamily: FONT.mono, fontSize: FT.body, color: C.coral }}>|φ| ≤ 0.99</div>
                <Body style={{ marginTop: 10 }}>同理夹住；非有限值一律写零，宁可低估也不让分数发散。</Body>
              </Card>
              <Card label="三 · 非有限值" accent={C.amber} pad={22}>
                <div style={{ fontFamily: FONT.mono, fontSize: FT.body, color: C.amber }}>NaN → 0</div>
                <Body style={{ marginTop: 10 }}>任何 NaN 都会污染阈值；修法是先清洗，再算分位。</Body>
              </Card>
            </div>
            <div style={{ marginTop: 26 }}>
              <Verdict ok label="修完 49 项检查全过" />
            </div>
            <Body style={{ marginTop: 14, width: 1680 }}>
              这不是「调参」，是数值防御：真实日频收益有极端值，两步法的中间量会越界；不管住它，阈值直接变成 NaN。
            </Body>
          </div>
        </AbsoluteFill>

        {/* 页三：MP 的实现 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 282, width: 900 }}>
            <div style={{ fontFamily: FONT.serif, fontSize: FT.h2, color: C.ink }}>平方展开，前缀和兜底</div>
            <Body style={{ marginTop: 16, width: 860 }}>
              平方距离展开成三项：平方和、点积、系数；平方和用前缀和，点积沿对角线递推。整段一次遍历，不用任何线性代数库。
            </Body>
            <div style={{ marginTop: 20 }}>
              <Formula size={40} color={C.violet}>
                d²(i,j) = 2m(1 − dot̂(i,j))
              </Formula>
            </div>
            <div style={{ marginTop: 22 }}>
              <Row name="常数段" value="σ = 0 → +∞" note="不能当零，也不能当 NaN。" color={C.coral} />
              <Row name="排除区" value="25 点" note="不排除则最近邻是自身。" />
              <Row name="复杂度" value="O(n²)" note="n 等于窗口数，测试段一千二百二十九。" />
            </div>
          </div>
          <div style={{ position: "absolute", left: 1020, top: 282, width: 840 }}>
            <CodeBlock width={820} title="matrixProfile" lines={[
              { t: "for i in windows:", hi: true },
              { t: "  best = +inf" },
              { t: "  for j outside [i-excl, i+excl]:" },
              { t: "    d = znormalized_distance i j" },
              { t: "    if d < best: best = d" },
              { t: "  P[i] = best", hi: true },
              { t: "" },
              { t: "constant window -> P[i] = +inf (skip)" },
            ]} />
            <div style={{ marginTop: 16, fontFamily: FONT.mono, fontSize: FT.meta, color: C.inkFaint }}>
              非书中：书里没有实现层，这一段是本集的工程口径。
            </div>
          </div>
        </AbsoluteFill>

        {/* 页四：口径通货膨胀 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 282, width: 880 }}>
            <div style={{ fontFamily: FONT.serif, fontSize: FT.h2, color: C.ink }}>点级调整会把读数吹起来</div>
            <Formula size={40} color={C.coral} style={{ marginTop: 20 }}>
              F1<sub>pa</sub>：段内报过一次 → 整段命中
            </Formula>
            <Body style={{ marginTop: 22, width: 840 }}>
              四十三次命中摊到六百六十一个真值点上，F1 从零点一二跳到零点九九八。
              这不是模型变好，是分母被抽走了：一段报出一次，整段都算对。
            </Body>
            <div style={{ marginTop: 24 }}>
              <Verdict ok={false} label="宽口径只用来对照，不算结论" />
            </div>
          </div>
          <div style={{ position: "absolute", left: 1000, top: 286, width: 850 }}>
            <Bars width={800} items={[
              { label: "ARIMA 严口径", value: U("arima").f1, text: U("arima").f1.toFixed(4), color: C.cyan },
              { label: "ARIMA 点调整", value: U("arima").f1PointAdj, text: U("arima").f1PointAdj.toFixed(4), color: C.coral, dim: true },
              { label: "MP 严口径", value: U("mp").f1, text: U("mp").f1.toFixed(4), color: C.violet },
              { label: "MP 点调整", value: U("mp").f1PointAdj, text: U("mp").f1PointAdj.toFixed(4), color: C.violet, dim: true },
            ]} max={1} unit="F1（0–1）" />
            <div style={{ marginTop: 18, fontFamily: FONT.mono, fontSize: FT.meta, color: C.inkFaint }}>
              同一批报警，换一种算分方式，读数差八倍。
            </div>
          </div>
        </AbsoluteFill>
      </Pages>
    </Scene>
  );
};
