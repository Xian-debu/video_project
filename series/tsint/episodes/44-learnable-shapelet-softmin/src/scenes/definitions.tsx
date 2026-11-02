import React from "react";
import { AbsoluteFill } from "remotion";
import { C, FONT, FT } from "../../design/tokens";
import {
  PAD, M, pagesOf, Pages, Scene, SceneHead, Card, Body, Chip, Stat, Row, Formula,
  WeightSquares, LinePlot, Bars, CodeBlock, fmt4, fmtPct, fmtInt,
} from "../shared";

const sm = M.softmin;
const an = M.anneal;
const under = sm.underflow;

export const SDefinitions: React.FC = () => {
  const at = pagesOf("definitions");
  return (
    <Scene id="definitions">
      <SceneHead id="definitions" />
      <Pages id="definitions" at={at}>
        {/* 页一：公式与黄金值 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 288, width: 820 }}>
            <div style={{ fontFamily: FONT.serif, fontSize: FT.h1, color: C.ink, lineHeight: 1.18 }}>
              一条软的最小值，
              <br />
              三行就能写完。
            </div>
            <Body style={{ marginTop: 20, width: 790 }}>
              把每个距离取指数、乘负 α，加起来取对数，除以 α 取负号。α 越大，结果越贴近最小的那个距离；α 趋于无穷时，它就是 min。中间那些 α 里，它是一族「光滑的 min」。
            </Body>
            <div style={{ marginTop: 18 }}>
              <Card label="SoftMin 的定义" accent={C.cyan} pad={18}>
                <Formula size={40} color={C.cyan}>{"SoftMin(α; x) = −(1/α) · log Σ_i exp(−α · x_i)"}</Formula>
              </Card>
            </div>
          </div>
          <div style={{ position: "absolute", left: 920, top: 292, width: 900 }}>
            <Card label="三个数校验公式" accent={C.violet} pad={22}>
              <Row name="三个窗口，距离全零" value={fmt4(sm.golden)} note="α = 1 时，等于 −log 3" color={C.cyan} />
              <Row name="同样输入，min 的值" value={fmt4(sm.minValue)} note="硬最小值" />
              <Row name="α 放大到 1e6" value={sm.alphaBig.toExponential(2)} note="与 min 只差一点" color={C.amber} />
            </Card>
            <div style={{ marginTop: 14 }}>
              <Body color={C.inkDim}>
                第 43 集的 min 是这条曲线的极限。差别在于：极限不可导，中间那一族处处可导。
              </Body>
            </div>
          </div>
        </AbsoluteFill>

        {/* 页二：梯度就是 softmax 权重 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 292, width: 820 }}>
            <div style={{ fontFamily: FONT.serif, fontSize: FT.h1, color: C.ink, lineHeight: 1.18 }}>
              对距离求导，
              <br />
              得到一组 softmax。
            </div>
            <Body style={{ marginTop: 20, width: 780 }}>
              每个距离的偏导是「这个窗口的指数项」除以「所有指数项之和」—— 正好是 softmax，且全部为正。这就是 min 做不到的事：九十二个零权重变成九十二个正的小权重，模板每个参数都能收到所有窗口的信号。
            </Body>
            <div style={{ marginTop: 20, display: "flex", gap: 12 }}>
              <Chip color={C.cyan}>权重和 {fmt4(sm.gradSum, 1)}</Chip>
              <Chip color={C.violet}>数值梯度差 {fmt4(sm.gradNumeric)}</Chip>
            </div>
          </div>
          <div style={{ position: "absolute", left: 900, top: 292, width: 920 }}>
            <Card label="解析梯度 vs 数值梯度" accent={C.cyan} pad={22}>
              <Formula size={34} color={C.cyan}>{"∂SoftMin / ∂x_i = exp(−α x_i) / Σ_j exp(−α x_j)"}</Formula>
              <div style={{ height: 18 }} />
              <WeightSquares rows={[sm.weights[0]]} width={820} labels={["窗口 1", "窗口 2", "窗口 3", "窗口 4"]} />
              <Row name="四个权重之和" value={fmt4(sm.gradSum, 1)} note="恒等于一，可当概率读" color={C.cyan} />
            </Card>
          </div>
        </AbsoluteFill>

        {/* 页三：两条性质 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 292, width: 800 }}>
            <div style={{ fontFamily: FONT.serif, fontSize: FT.h1, color: C.ink, lineHeight: 1.18 }}>
              平移同变，
              <br />
              但永远到不了 min。
            </div>
            <Body style={{ marginTop: 20, width: 770 }}>
              两条性质决定了它怎么用。第一，所有距离一起加一个常数，SoftMin 的结果也加同一个常数 —— 这叫平移同变，不是平移不变。第二，它严格小于 min（除非只有一个窗口），所以「距离为零」这个理想情况只能逼近，不能到达。
            </Body>
            <div style={{ marginTop: 20, display: "flex", gap: 12 }}>
              <Chip color={C.cyan}>SoftMin(x + c) = SoftMin(x) + c</Chip>
              <Chip color={C.coral}>SoftMin &lt; min</Chip>
            </div>
          </div>
          <div style={{ position: "absolute", left: 900, top: 292, width: 920 }}>
            <Card label="零距离时它等于 −log(k)/α" accent={C.violet} pad={22}>
              <Formula size={38} color={C.cyan}>{"SoftMin(α; [0,…,0]) = −log(k) / α"}</Formula>
              <Row name="k = 3，α = 1" value={fmt4(sm.golden)} note="−log 3" />
              <Row name="α 放大十倍" value="结果缩小十倍" note="只能逼近，不能等于零" color={C.amber} />
            </Card>
          </div>
        </AbsoluteFill>

        {/* 页四：退火 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 292, width: 800 }}>
            <div style={{ fontFamily: FONT.serif, fontSize: FT.h1, color: C.ink, lineHeight: 1.18 }}>
              从软到硬，
              <br />
              分三段退火。
            </div>
            <Body style={{ marginTop: 20, width: 770 }}>
              一开始 α 小，所有窗口权重差不多，模板能在全局范围内挪动；训练到中途把 α 调大，权重逐渐集中到最近的窗口；最后 α 到二百，几乎等于 min。分三段而不是一路升到底，是因为一次跳太多会让已学到的位置被推翻。
            </Body>
            <div style={{ marginTop: 20, display: "flex", gap: 10 }}>
              <Chip color={C.cyan}>α = {an.levels[0]}</Chip>
              <Chip color={C.amber}>α = {an.levels[1]}</Chip>
              <Chip color={C.violet}>α = {an.levels[2]}</Chip>
            </div>
            <Body color={C.inkDim} style={{ marginTop: 14 }}>
              每段各约十轮，总共 {an.epochs} 轮。损失在换档处会跳一下，之后继续下降。
            </Body>
          </div>
          <div style={{ position: "absolute", left: 860, top: 280, width: 980 }}>
            <Card label="退火过程中的训练损失" accent={C.amber} pad={16}>
              <LinePlot
                width={930}
                height={330}
                series={[{ name: "训练损失", color: C.amber, values: an.losses }]}
                yFmt={(v) => v.toFixed(2)}
                vlines={[{ i: 8, color: C.cyan, label: "α → 20" }, { i: 20, color: C.violet, label: "α → 200" }]}
              />
            </Card>
          </div>
        </AbsoluteFill>

        {/* 页五：下溢 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 292, width: 800 }}>
            <div style={{ fontFamily: FONT.serif, fontSize: FT.h1, color: C.ink, lineHeight: 1.18 }}>
              下溢把软最小值
              <br />
              压回硬最小值。
            </div>
            <Body style={{ marginTop: 20, width: 770 }}>
              指数项 exp(−α x) 在 α 很大、x 又远离零的时候，会小到双精度浮点数的下界以下，直接变成零。归一化之后，那些窗口的权重就成了真正的零。我们统计了六个窗口里归零的个数：α 到一千时五个都归零，只剩最小那个。
            </Body>
            <div style={{ marginTop: 22, display: "flex", gap: 12 }}>
              <Chip color={C.coral}>α=1000：{fmtPct(under[2].fraction, 1)} 归零</Chip>
              <Chip color={C.amber}>也就是退化成 min</Chip>
            </div>
          </div>
          <div style={{ position: "absolute", left: 900, top: 292, width: 920 }}>
            <Card label="六个窗口里归零的个数" accent={C.coral} pad={22}>
              <Bars
                width={840}
                items={under.map((u) => ({
                  label: "α = " + fmtInt(u.alpha),
                  value: u.fraction * 6,
                  text: fmt4(u.fraction * 6, 1) + " / 6",
                  color: u.alpha >= 1000 ? C.coral : u.alpha >= 500 ? C.amber : C.cyan,
                }))}
                max={6}
              />
            </Card>
            <div style={{ marginTop: 14 }}>
              <Body color={C.inkDim}>
                解决方法是 log-sum-exp 变形：先减去最大的指数项再取指数，权重不变，中间量不溢出。
              </Body>
            </div>
          </div>
        </AbsoluteFill>

        {/* 页六：分类头 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 288, width: 760 }}>
            <div style={{ fontFamily: FONT.serif, fontSize: FT.h1, color: C.ink, lineHeight: 1.18 }}>
              从距离到分类，
              <br />
              最后一层是线性的。
            </div>
            <Body style={{ marginTop: 20, width: 730 }}>
              五个模板对输入窗口各给一个 SoftMin 距离，拼成五维向量；乘一个 3×5 的权重矩阵加偏置，得到三个类的 logits；再走 softmax 和交叉熵。整条链从窗口到类别处处可导，梯度能一路回到模板的采样位置。
            </Body>
            <div style={{ marginTop: 20 }}>
              <Card label="链式法则里容易漏的一步" accent={C.coral} pad={16}>
                <Body>
                  距离先对窗口求导，再对模板形状求导。求 dL/dshape 时不能把 dL/dd 当距离传进去 —— 要把 logits 的梯度先乘回权重矩阵。
                </Body>
              </Card>
            </div>
          </div>
          <div style={{ position: "absolute", left: 880, top: 292, width: 960 }}>
            <CodeBlock
              width={900}
              title="分类头（伪码）"
              lines={[
                { t: "ds   = [ softMin alpha (sqDists s windows) | s <- shapes ]", hi: true },
                { t: "logit = W <> ds + b            -- 3 x 5 权重" },
                { t: "p    = softmax logit           -- 三个概率" },
                { t: "loss = -log (p !! label)        -- 交叉熵" },
                { t: "" },
                { t: "dlogit = p - oneHot label       -- 3 维" },
                { t: "dds    = transpose W <> dlogit  -- 先乘回 5 维", hi: true },
                { t: "dshape = chain dds ds windows   -- 再对形状", dim: true },
              ]}
            />
          </div>
        </AbsoluteFill>
      </Pages>
    </Scene>
  );
};
