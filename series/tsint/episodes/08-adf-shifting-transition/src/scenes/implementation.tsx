import React from "react";
import { Build } from "../../design/primitives";
import { C, FONT, FT } from "../../design/tokens";
import { Body, Card, Chip, CodeBlock, K, M, PAD, Pages, Scene, SceneHead, Stat, lf } from "../shared";

/* 实现：Schwert 滞后、Householder QR、秩亏错误、九条线、clamp 与零行。 */

const Pit: React.FC<{ n: string; title: string; bad: string; good: string }> = ({ n, title, bad, good }) => (
  <div style={{ marginTop: 16 }}>
    <div style={{ display: "flex", gap: 12, alignItems: "baseline" }}>
      <Chip color={C.coral}>{n}</Chip>
      <div style={{ fontFamily: FONT.sans, fontSize: FT.body, color: C.ink }}>{title}</div>
    </div>
    <div style={{ display: "flex", gap: 16, marginTop: 8, marginLeft: 4 }}>
      <Body size={FT.meta} color={C.coral}>✕ {bad}</Body>
      <Body size={FT.meta} color={C.cyan}>✓ {good}</Body>
    </div>
  </div>
);

export const SImplementation: React.FC = () => {
  const s = M.stats;
  return (
    <Scene id="implementation">
      <SceneHead id="implementation" />
      <Pages id="implementation" at={[0, 0.2, 0.38, 0.55, 0.78, 0.92]}>
        <div>
          <div style={{ position: "absolute", left: PAD, top: 236, fontFamily: FONT.sans, fontSize: FT.h2, color: C.inkDim }}>
            先看 ADF 的回归：被解释变量是差分，解释变量是滞后一期的水平值。
          </div>
          <Build at={lf("implementation", 0.03)}>
            <div style={{ position: "absolute", left: PAD, top: 306, width: 1120 }}>
              <Card label="回归式" accent={C.cyan} style={{ height: 250 }}>
                <div style={{ fontFamily: FONT.serif, fontSize: 44, color: C.ink, lineHeight: 1.4 }}>{"Δx_t = α + γ·x_{t−1} + Σ_{i=1}^{p} φ_i Δx_{t−i} + ε_t"}</div>
                <Body style={{ marginTop: 14 }}>滞后差分项用来吸收自相关；滞后几阶，书里没给规则。</Body>
              </Card>
            </div>
          </Build>
          <Build at={lf("implementation", 0.09)}>
            <div style={{ position: "absolute", left: PAD + 1184, top: 306, width: 592 }}>
              <Card label="Schwert 规则" accent={C.cyan} style={{ height: 250 }}>
                <div style={{ fontFamily: FONT.mono, fontSize: FT.body, color: C.cyan }}>{"p = ⌊ 12·(n/100)^{1/4} ⌋"}</div>
                <Body size={FT.meta} style={{ marginTop: 12 }}>250 个点算出来 15 阶；有效观测 234 个。</Body>
              </Card>
            </div>
          </Build>
          <Build at={lf("implementation", 0.15)}>
            <div style={{ position: "absolute", left: PAD, top: 596, display: "flex", gap: 26 }}>
              <Stat label="滞后阶" accent={C.cyan} value={String(s.adf.lag_level)} sub="Schwert：n = 250" style={{ width: 574, height: 156 }} />
              <Stat label="有效观测" accent={C.cyan} value={String(s.adf.nobs_level)} sub="250 − 15 − 1" style={{ width: 574, height: 156 }} />
              <Stat label="回归设计矩阵" accent={C.amber} value={String(s.cost.regressors) + " 列"} sub="1 个水平值 + 15 个滞后差分 + 截距" style={{ width: 574, height: 156 }} />
            </div>
          </Build>
        </div>

        <div>
          <div style={{ position: "absolute", left: PAD, top: 236, fontFamily: FONT.sans, fontSize: FT.h2, color: C.inkDim }}>
            系数用什么方法解？这里有一个很容易踩的坑。
          </div>
          <Build at={lf("implementation", 0.23)}>
            <div style={{ position: "absolute", left: PAD, top: 306, width: 1120 }}>
              <Card label="正规方程的代价" accent={C.coral} style={{ height: 330 }}>
                <div style={{ fontFamily: FONT.mono, fontSize: FT.body, color: C.coral, lineHeight: 1.7 }}>{"(XᵀX) β = Xᵀy"}</div>
                <Body style={{ marginTop: 12 }}>价格量级是一千，方差量级是一百万；正规方程会把条件数平方。</Body>
                <Pit n="坑" title="直接解正规方程" bad="条件数一变大，系数就不稳" good="对设计矩阵做正交变换，不组正规方程" />
              </Card>
            </div>
          </Build>
          <Build at={lf("implementation", 0.3)}>
            <div style={{ position: "absolute", left: PAD + 1184, top: 306, width: 592 }}>
              <Card label="Householder QR" accent={C.cyan} style={{ height: 330 }}>
                <Body size={FT.meta}>把设计矩阵变成上三角 R；残差平方和从变换后的向量取，标准误从 R 的对角线取。</Body>
                <div style={{ marginTop: 14 }}><Chip color={C.cyan}>Q 不显式存；只做反射</Chip></div>
                <div style={{ fontFamily: FONT.mono, fontSize: FT.body, color: C.cyan, marginTop: 16 }}>{"τ = γ̂ / se(γ̂)"}</div>
                <Body size={FT.meta} style={{ marginTop: 8 }}>se 来自 R 的对角线元素。</Body>
              </Card>
            </div>
          </Build>
          <Build at={lf("implementation", 0.35)}>
            <div style={{ position: "absolute", left: PAD, top: 676, width: 1776 }}>
              <Card accent={C.amber} style={{ height: 130 }}>
                <div style={{ fontFamily: FONT.sans, fontSize: FT.h2, color: C.ink }}>代价是慢一点；换来的是系数和标准误都稳定。</div>
                <K style={{ display: "block", marginTop: 10 }}>这一条写进 SELF-AUTH：不组正规方程</K>
              </Card>
            </div>
          </Build>
        </div>

        <div>
          <div style={{ position: "absolute", left: PAD, top: 236, fontFamily: FONT.sans, fontSize: FT.h2, color: C.inkDim }}>
            第二个坑，常数序列：设计矩阵秩亏，解不出来。
          </div>
          <Build at={lf("implementation", 0.42)}>
            <div style={{ position: "absolute", left: PAD, top: 306, width: 1120 }}>
              <Card label="常数序列会发生什么" accent={C.coral} style={{ height: 330 }}>
                <Body>差分全零，水平值是常数；每一条解释变量都和截距共线。</Body>
                <div style={{ display: "flex", gap: 16, marginTop: 18 }}>
                  <Chip color={C.coral}>不返回 NaN</Chip>
                  <Chip color={C.coral}>不静默给零</Chip>
                  <Chip color={C.cyan}>返回专门的错误</Chip>
                </div>
                <div style={{ fontFamily: FONT.mono, fontSize: FT.meta, color: C.cyan, marginTop: 20 }}>{"Left (AdfRankDeficient ...)"}</div>
                <Body size={FT.meta} style={{ marginTop: 10 }}>调用方拿到 Left，就知道这条序列不适合做 ADF；而不是拿到一个 0 继续往下算。</Body>
              </Card>
            </div>
          </Build>
          <Build at={lf("implementation", 0.48)}>
            <div style={{ position: "absolute", left: PAD + 1184, top: 306, width: 592 }}>
              <Stat label="秩亏判据" accent={C.coral} value="pivot" sub="QR 的对角线出现零或近零" valueSize={FT.h2} style={{ height: 156 }} />
              <Stat label="返回" accent={C.cyan} value="Left" sub="错误在类型里，不在日志里" style={{ height: 156, marginTop: 14 }} />
            </div>
          </Build>
          <Build at={lf("implementation", 0.52)}>
            <div style={{ position: "absolute", left: PAD, top: 676, fontFamily: FONT.sans, fontSize: FT.body, color: C.inkDim }}>
              这条错误分支有测试；常数序列的零方差，也在漂移性那条错误表里。
            </div>
          </Build>
        </div>

        <div>
          <div style={{ position: "absolute", left: PAD, top: 236, fontFamily: FONT.sans, fontSize: FT.h2, color: C.inkDim }}>
            第二种，漂移性的实现：九条线、九个中位数、一次归一化。
          </div>
          <Build at={lf("implementation", 0.58)}>
            <div style={{ position: "absolute", left: PAD, top: 306, width: 1120 }}>
              <Card label="三条实现细节" accent={C.amber} style={{ height: 350 }}>
                <div style={{ fontFamily: FONT.sans, fontSize: FT.body, color: C.ink, marginTop: 4 }}>一、九条线在最小值和最大值之间等距画。</div>
                <Body size={FT.meta} style={{ marginTop: 6 }}>线本身不参与中位数计算；只有严格大于线的点才算。</Body>
                <div style={{ fontFamily: FONT.sans, fontSize: FT.body, color: C.ink, marginTop: 16 }}>二、归一化九个中位数。</div>
                <Body size={FT.meta} style={{ marginTop: 6 }}>区间用这九个数自己的范围，不用原序列的范围。</Body>
                <div style={{ fontFamily: FONT.sans, fontSize: FT.body, color: C.ink, marginTop: 16 }}>三、再取这九个数的中位数。</div>
                <Body size={FT.meta} style={{ marginTop: 6 }}>就是指标的值。</Body>
              </Card>
            </div>
          </Build>
          <Build at={lf("implementation", 0.65)}>
            <div style={{ position: "absolute", left: PAD + 1184, top: 306, width: 592 }}>
              <Card label="这一步最容易换口径" accent={C.coral} style={{ height: 350 }}>
                <Body>换成原序列的范围，数就变了；换成 m = 20，数也变了。</Body>
                <Body size={FT.meta} style={{ marginTop: 12 }}>所以这一条写进了自授权文件 A20：归一化区间 = 九个中位数自身的 min–max。</Body>
                <div style={{ marginTop: 14 }}><Chip color={C.amber}>口径写死，测试锁住</Chip></div>
              </Card>
            </div>
          </Build>
          <Build at={lf("implementation", 0.72)}>
            <div style={{ position: "absolute", left: PAD, top: 700, fontFamily: FONT.sans, fontSize: FT.body, color: C.inkDim }}>
              书里没给这条口径；我们选一种，写下来，再用测试锁住。
            </div>
          </Build>
        </div>

        <div>
          <div style={{ position: "absolute", left: PAD, top: 236, fontFamily: FONT.sans, fontSize: FT.h2, color: C.inkDim }}>
            第三种，转移性的实现：分箱、数转移、行归一化、列方差。
          </div>
          <Build at={lf("implementation", 0.81)}>
            <div style={{ position: "absolute", left: PAD, top: 306, width: 1120 }}>
              <Card label="分箱是最容易漏的一步" accent={C.coral} style={{ height: 360 }}>
                <div style={{ fontFamily: FONT.mono, fontSize: FT.body, color: C.ink, lineHeight: 1.8 }}>{"state = floor((x − min) / (max − min) * 3)"}</div>
                <Body style={{ marginTop: 10 }}>最大值那一格，floor 会算出三；必须把它夹回第二格。</Body>
                <div style={{ marginTop: 10 }}><Chip color={C.coral}>漏了 clamp：最后一点落到不存在的状态</Chip></div>
                <div style={{ marginTop: 18, fontFamily: FONT.mono, fontSize: FT.meta, color: C.cyan }}>{"state = min 2 (floor (...))"}</div>
                <Body size={FT.meta} style={{ marginTop: 8 }}>然后数转移，行归一化；零行保持零行，不补均匀。</Body>
              </Card>
            </div>
          </Build>
          <Build at={lf("implementation", 0.87)}>
            <div style={{ position: "absolute", left: PAD + 1184, top: 306, width: 592 }}>
              <Card label="最后一步" accent={C.violet} style={{ height: 360 }}>
                <Body>对三个列各算方差，除以三，再加起来。</Body>
                <div style={{ marginTop: 14 }}><Chip color={C.coral}>除以二，两个黄金值会翻三倍</Chip></div>
                <Body size={FT.meta} style={{ marginTop: 12 }}>周期 2/3 会变成 1；常数 2/9 会变成 1/3。所以分母写死，测试里有一条专门锁它。</Body>
              </Card>
            </div>
          </Build>
        </div>

        <div>
          <div style={{ position: "absolute", left: PAD, top: 236, fontFamily: FONT.sans, fontSize: FT.h2, color: C.inkDim }}>
            三种实现，三种代价。
          </div>
          <Build at={lf("implementation", 1.0)}>
            <div style={{ position: "absolute", left: PAD, top: 312, display: "flex", gap: 26 }}>
              <Card label="ADF" accent={C.cyan} style={{ width: 574, height: 280 }}>
                <div style={{ fontFamily: FONT.sans, fontSize: FT.h1, color: C.ink }}>回归</div>
                <Body style={{ marginTop: 10 }}>QR 分解、滞后 15 阶、234 个有效观测。</Body>
              </Card>
              <Card label="漂移性" accent={C.amber} style={{ width: 574, height: 280 }}>
                <div style={{ fontFamily: FONT.sans, fontSize: FT.h1, color: C.ink }}>排序</div>
                <Body style={{ marginTop: 10 }}>九次「取线以上的中位数」，每次都要排序。</Body>
              </Card>
              <Card label="转移性" accent={C.violet} style={{ width: 574, height: 280 }}>
                <div style={{ fontFamily: FONT.sans, fontSize: FT.h1, color: C.ink }}>分箱</div>
                <Body style={{ marginTop: 10 }}>边界、零行、归一化；三个地方各有一个坑。</Body>
              </Card>
            </div>
          </Build>
          <Build at={lf("implementation", 0.97)}>
            <div style={{ position: "absolute", left: PAD, top: 640, fontFamily: FONT.sans, fontSize: FT.body, color: C.inkDim }}>
              实现讲完了；现在看数字，看每个数能不能回到一条检查。
            </div>
          </Build>
        </div>
      </Pages>
    </Scene>
  );
};
