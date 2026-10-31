import React from "react";
import { Build } from "../../design/primitives";
import { C, FONT, FT } from "../../design/tokens";
import { Body, Card, Chip, K, LinePlot, M, Matrix, PAD, Pages, Scene, SceneHead, Stat, lf } from "../shared";

/* 直觉：三个指标各测一件事；单位根、上分位中位数的形状、状态转移的确定性。 */

const Step: React.FC<{ n: string; title: string; note: string; color?: string }> = ({ n, title, note, color = C.cyan }) => (
  <div style={{ display: "flex", gap: 16, alignItems: "flex-start", marginTop: 14 }}>
    <div style={{ width: 34, height: 34, borderRadius: 17, background: color, color: C.bg, fontFamily: FONT.mono, fontSize: FT.meta, display: "flex", alignItems: "center", justifyContent: "center", flex: "0 0 auto" }}>{n}</div>
    <div>
      <div style={{ fontFamily: FONT.sans, fontSize: FT.body, color: C.ink }}>{title}</div>
      <Body size={FT.meta} style={{ marginTop: 4 }}>{note}</Body>
    </div>
  </div>
);

export const SIntuition: React.FC = () => {
  const s = M.stats;
  const d = M.series;
  const med = d.shiftingMedians.w2013;
  return (
    <Scene id="intuition">
      <SceneHead id="intuition" />
      <Pages id="intuition" at={[0, 0.15, 0.285, 0.42, 0.55, 0.62, 0.87]}>
        <div>
          <div style={{ position: "absolute", left: PAD, top: 236, fontFamily: FONT.sans, fontSize: FT.h2, color: C.inkDim }}>
            先看 ADF 在测什么：序列里有没有单位根。
          </div>
          <Build at={lf("intuition", 0.03)}>
            <div style={{ position: "absolute", left: PAD, top: 312, width: 860 }}>
              <Card label="单位根的意思" accent={C.cyan} style={{ height: 330 }}>
                <div style={{ fontFamily: FONT.serif, fontSize: 54, color: C.ink, lineHeight: 1.3 }}>{"x_t = x_{t−1} + ε_t"}</div>
                <Body style={{ marginTop: 16 }}>今天的值，几乎就是昨天的值加噪声；冲击永远不会消失。</Body>
                <Body size={FT.meta} style={{ marginTop: 8 }}>所以它没有可以回去的均值。</Body>
              </Card>
            </div>
          </Build>
          <Build at={lf("intuition", 0.08)}>
            <div style={{ position: "absolute", left: PAD + 900, top: 312, width: 876 }}>
              <Card label="ADF 的做法" accent={C.cyan} style={{ height: 330 }}>
                <div style={{ fontFamily: FONT.serif, fontSize: 46, color: C.ink, lineHeight: 1.3 }}>{"Δx_t = α + γ·x_{t−1} + Σ φ_i Δx_{t−i}"}</div>
                <Body style={{ marginTop: 14 }}>回归一个系数 γ。γ 等于零，就有单位根。</Body>
                <div style={{ fontFamily: FONT.mono, fontSize: FT.body, color: C.cyan, marginTop: 14 }}>{"τ = γ̂ / se(γ̂)"}</div>
              </Card>
            </div>
          </Build>
          <Build at={lf("intuition", 0.12)}>
            <div style={{ position: "absolute", left: PAD, top: 676, fontFamily: FONT.sans, fontSize: FT.body, color: C.inkDim }}>
              关键在分母：这个比值不服从 t 分布。因为单位根成立时，回归量本身是随机的。
            </div>
          </Build>
        </div>

        <div>
          <div style={{ position: "absolute", left: PAD, top: 236, fontFamily: FONT.sans, fontSize: FT.h2, color: C.inkDim }}>
            所以要查专门的表，不能查 t 表。
          </div>
          <Build at={lf("intuition", 0.18)}>
            <div style={{ position: "absolute", left: PAD, top: 312, display: "flex", gap: 26 }}>
              <Card label="分母不是常数" accent={C.coral} style={{ width: 874, height: 260 }}>
                <div style={{ fontFamily: FONT.mono, fontSize: FT.body, color: C.coral, lineHeight: 1.7 }}>{"se(γ̂) 随样本波动"}</div>
                <Body style={{ marginTop: 12 }}>回归量取滞后一期的值；在单位根下它本身是随机游走，方差也是一个随机量。</Body>
              </Card>
              <Card label="所以 τ 的分布" accent={C.cyan} style={{ width: 874, height: 260 }}>
                <div style={{ fontFamily: FONT.mono, fontSize: FT.body, color: C.cyan, lineHeight: 1.7 }}>{"τ ~ Dickey–Fuller"}</div>
                <Body style={{ marginTop: 12 }}>左偏、厚尾、都落在负值区；临界值表由模拟给出，不是 t 表的一列。</Body>
              </Card>
            </div>
          </Build>
          <Build at={lf("intuition", 0.24)}>
            <div style={{ position: "absolute", left: PAD, top: 612, width: 1776 }}>
              <Card accent={C.amber} style={{ height: 140 }}>
                <div style={{ fontFamily: FONT.sans, fontSize: FT.h2, color: C.ink }}>所以 ADF 的正确写法，永远是「τ 和临界值比」，不是「τ 和 0.05 比」。</div>
                <K style={{ display: "block", marginTop: 10 }}>第二集之后，这张表一直在代码里，不在注释里</K>
              </Card>
            </div>
          </Build>
        </div>

        <div>
          <div style={{ position: "absolute", left: PAD, top: 236, fontFamily: FONT.sans, fontSize: FT.h2, color: C.inkDim }}>
            第二个指标，漂移性。名字叫漂移，但它测的不是漂移。
          </div>
          <Build at={lf("intuition", 0.32)}>
            <div style={{ position: "absolute", left: PAD, top: 300 }}>
              <LinePlot
                series={[{ values: d.shifting.w2013, color: C.amber, name: "2013 窗口收盘价" }]}
                width={1120}
                height={440}
                title={"九条等距水平线 · 每条线以上取一个中位数 · " + med.s.length + " 条"}
                at={lf("intuition", 0.33)}
                hlines={med.s.map((v, i) => ({ v, color: C.cyan, label: i === 0 ? "最低一条线" : i === med.s.length - 1 ? "最高一条线" : undefined }))}
              />
            </div>
          </Build>
          <Build at={lf("intuition", 0.37)}>
            <div style={{ position: "absolute", left: PAD + 1184, top: 300, width: 592 }}>
              <Stat label="九条线以上的中位数" accent={C.cyan} value={med.M.map((v) => v.toFixed(1)).slice(0, 3).join(" / ")} sub="前三条；整体单调上升" style={{ height: 170 }} />
              <Stat label="归一化之后" accent={C.cyan} value={med.norm.map((v) => v.toFixed(2)).slice(0, 3).join(" / ")} sub="用这九个数自己的范围做 min–max" style={{ height: 170, marginTop: 14 }} />
            </div>
          </Build>
          <Build at={lf("intuition", 0.4)}>
            <div style={{ position: "absolute", left: PAD, top: 774, fontFamily: FONT.sans, fontSize: FT.body, color: C.inkDim }}>
              再取这九个数的中位数，就是这个指标的值。
            </div>
          </Build>
        </div>

        <div>
          <div style={{ position: "absolute", left: PAD, top: 236, fontFamily: FONT.sans, fontSize: FT.h2, color: C.inkDim }}>
            拿一条等差数列试，再拿一条单边上涨的直线试。
          </div>
          <Build at={lf("intuition", 0.45)}>
            <div style={{ position: "absolute", left: PAD, top: 312, display: "flex", gap: 26 }}>
              <Stat label="一到十 · 九条线" accent={C.amber} value={s.shifting.arith_1_10.toFixed(4)} sub="精确的零点五" valueColor={C.amber} style={{ width: 574, height: 200 }} />
              <Stat label="单边上涨 · 250 点" accent={C.amber} value={s.shifting.ramp_250.toFixed(4)} sub="从 0 涨到 250" valueColor={C.amber} style={{ width: 574, height: 200 }} />
              <Stat label="茅台 · 最后 250 点" accent={C.cyan} value={s.shifting.last250.toFixed(4)} sub="同一只股票，换个窗口就不是零点五" valueColor={C.cyan} style={{ width: 574, height: 200 }} />
            </div>
          </Build>
          <Build at={lf("intuition", 0.5)}>
            <div style={{ position: "absolute", left: PAD, top: 552, width: 1776 }}>
              <Card accent={C.coral} style={{ height: 150 }}>
                <div style={{ fontFamily: FONT.sans, fontSize: FT.h2, color: C.ink }}>因为中位数总落在正中间；所以这个数只说明形状对称。</div>
                <K style={{ display: "block", marginTop: 10 }}>不说明有没有漂移，也不说明漂移多强</K>
              </Card>
            </div>
          </Build>
          <Build at={lf("intuition", 0.53)}>
            <div style={{ position: "absolute", left: PAD, top: 742, fontFamily: FONT.sans, fontSize: FT.body, color: C.inkDim }}>
              它测的是上分位中位数的形状。
            </div>
          </Build>
        </div>

        <div>
          <div style={{ position: "absolute", left: PAD, top: 236, fontFamily: FONT.sans, fontSize: FT.h2, color: C.inkDim }}>
            第三个指标，转移性。它的做法分三步。
          </div>
          <Build at={lf("intuition", 0.58)}>
            <div style={{ position: "absolute", left: PAD, top: 312, width: 860 }}>
              <Card label="三步" accent={C.violet} style={{ height: 372 }}>
                <Step n="1" title="把序列分成三个状态" note="等宽分箱；边界 clamp 到最后一格" />
                <Step n="2" title="数状态之间的转移" note="得到一个三乘三的计数矩阵" />
                <Step n="3" title="每行除以这一行的和" note="得到转移概率矩阵；零行保持零行" />
                <Body size={FT.meta} style={{ marginTop: 16 }}>对这个矩阵的三个列，各算一个方差，再加起来。</Body>
              </Card>
            </div>
          </Build>
          <Build at={lf("intuition", 0.63)}>
            <div style={{ position: "absolute", left: PAD + 900, top: 312, width: 876 }}>
              <Card label="完美周期 1 2 3 · 转移概率" accent={C.violet} style={{ height: 372 }}>
                <Matrix rows={d.transition.periodic.probs} cell={72} showNumbers digits={0} color={C.violet} rowLabels={["1 →", "2 →", "3 →"]} colLabels={["到 1", "到 2", "到 3"]} />
                <Body size={FT.meta} style={{ marginTop: 14 }}>每行只有一格是 1；另外两格是零。三列方差各 2/9。</Body>
              </Card>
            </div>
          </Build>
        </div>

        <div>
          <div style={{ position: "absolute", left: PAD, top: 236, fontFamily: FONT.sans, fontSize: FT.h2, color: C.inkDim }}>
            完美周期三分之二；常数序列九分之二。
          </div>
          <Build at={lf("intuition", 0.68)}>
            <div style={{ position: "absolute", left: PAD, top: 306, width: 860 }}>
              <Card label="常数序列 · 转移概率" accent={C.coral} style={{ height: 330 }}>
                <Matrix rows={s.hand.constant.matrix} cell={62} showNumbers digits={1} color={C.coral} rowLabels={["1 →", "2 →", "3 →"]} colLabels={["到 1", "到 2", "到 3"]} />
                <Body size={FT.meta} style={{ marginTop: 12 }}>900 个点全在状态 1；只有第一行非零，另外两行全是零。</Body>
              </Card>
            </div>
          </Build>
          <Build at={lf("intuition", 0.73)}>
            <div style={{ position: "absolute", left: PAD + 900, top: 306, width: 876 }}>
              <Card label="三列的方差" accent={C.coral} style={{ height: 330 }}>
                <div style={{ display: "flex", gap: 16 }}>
                  {["第 1 列", "第 2 列", "第 3 列"].map((t) => (
                    <Stat key={t} label={t} accent={C.coral} value="1/9" sub="恒等行的列均值是 1/3" valueColor={C.coral} style={{ width: 268, height: 148 }} />
                  ))}
                </div>
                <Body size={FT.meta} style={{ marginTop: 18 }}>三个 1/9 相加，得到九分之二。它是「两行是零行」的结果，不是「停住的比例」。</Body>
              </Card>
            </div>
          </Build>
          <Build at={lf("intuition", 0.77)}>
            <div style={{ position: "absolute", left: PAD, top: 672, display: "flex", gap: 26 }}>
              <Stat label="完美周期" accent={C.violet} value={s.transition.periodic.toFixed(4)} sub="一直在动" valueColor={C.violet} style={{ width: 874, height: 140 }} />
              <Stat label="常数序列" accent={C.coral} value={s.transition.constant.toFixed(4)} sub="一动不动" valueColor={C.coral} style={{ width: 874, height: 140 }} />
            </div>
          </Build>
          <Build at={lf("intuition", 0.82)}>
            <div style={{ position: "absolute", left: PAD, top: 834, fontFamily: FONT.sans, fontSize: FT.body, color: C.inkDim }}>
              动的那个数大，不动的那个数小；它测的是动力学的确定性，不是停在原状态的概率。
            </div>
          </Build>
        </div>

        <div>
          <div style={{ position: "absolute", left: PAD, top: 236, fontFamily: FONT.sans, fontSize: FT.h2, color: C.inkDim }}>
            三个指标，三句话。
          </div>
          <Build at={lf("intuition", 0.9)}>
            <div style={{ position: "absolute", left: PAD, top: 312, display: "flex", gap: 26 }}>
              <Card label="ADF" accent={C.cyan} style={{ width: 574, height: 300 }}>
                <div style={{ fontFamily: FONT.sans, fontSize: FT.h1, color: C.ink, lineHeight: 1.25 }}>有没有单位根</div>
                <Body style={{ marginTop: 14 }}>回归系数 γ 的比值；查非标准的表。</Body>
              </Card>
              <Card label="漂移性" accent={C.amber} style={{ width: 574, height: 300 }}>
                <div style={{ fontFamily: FONT.sans, fontSize: FT.h1, color: C.ink, lineHeight: 1.25 }}>上分位中位数的形状</div>
                <Body style={{ marginTop: 14 }}>九条线以上各取中位数；测对称，不测强度。</Body>
              </Card>
              <Card label="转移性" accent={C.violet} style={{ width: 574, height: 300 }}>
                <div style={{ fontFamily: FONT.sans, fontSize: FT.h1, color: C.ink, lineHeight: 1.25 }}>状态转移有多确定</div>
                <Body style={{ marginTop: 14 }}>列方差之和；周期 2/3，常数 2/9。</Body>
              </Card>
            </div>
          </Build>
          <Build at={lf("intuition", 0.95)}>
            <div style={{ position: "absolute", left: PAD, top: 660, width: 1776 }}>
              <Card accent={C.cyan} style={{ height: 150 }}>
                <div style={{ fontFamily: FONT.sans, fontSize: FT.h2, color: C.ink }}>三个数各有一张自己的表、自己的口径、自己的适用范围。</div>
                <K style={{ display: "block", marginTop: 10 }}>下一页把三个签名写清楚</K>
              </Card>
            </div>
          </Build>
        </div>
      </Pages>
    </Scene>
  );
};
