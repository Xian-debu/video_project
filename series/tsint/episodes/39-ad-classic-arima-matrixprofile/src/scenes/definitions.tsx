import React from "react";
import { AbsoluteFill } from "remotion";
import { C, FONT, FT } from "../../design/tokens";
import { PAD, M, pagesOf, Pages, Scene, SceneHead, Card, Row, Body, K, Formula, Verdict, CodeBlock, Stat, unitColor } from "../shared";

export const SDefinitions: React.FC = () => {
  const at = pagesOf("definitions");
  return (
    <Scene id="definitions">
      <SceneHead id="definitions" />
      <Pages id="definitions" at={at}>
        {/* 页一：ARIMA 方程 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 290, width: 1000 }}>
            <Formula size={50} color={C.cyan}>
              φ(B)(1−B)<sup>d</sup> y<sub>t</sub> = c + θ(B) ε<sub>t</sub>
            </Formula>
            <div style={{ marginTop: 16, fontFamily: FONT.mono, fontSize: FT.meta, color: C.inkFaint }}>式(4.41) 的位置 · 非书中：书只写「ARIMA」三个字母</div>
            <Body style={{ marginTop: 26, width: 900 }}>
              B 是滞后算子，把 B y<sub>t</sub> 变成 y<sub>t−1</sub>；d 是差分阶数，把趋势磨平；
              ε 是白噪声；c 是漂移。左边是可解释的部分，右边是解释不了的残差。
            </Body>
          </div>
          <div style={{ position: "absolute", left: 1060, top: 286, width: 800 }}>
            <Card label="四个符号" accent={C.cyan} pad={24}>
              <Row name="B" value="滞后算子" note="B y_t = y_{t−1}" />
              <Row name="d" value="差分阶数" note="本集选中 d = 0，不差分。" />
              <Row name="ε_t" value="白噪声" note="均值为零，方差 σ²。" />
              <Row name="c" value="漂移" note="收益的长期均值。" />
            </Card>
          </div>
        </AbsoluteFill>

        {/* 页二：阶数与拟合 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 282, width: 820 }}>
            <div style={{ fontFamily: FONT.serif, fontSize: FT.h2, color: C.ink }}>选中 ARIMA(0,0,2)</div>
            <Body style={{ marginTop: 18, width: 780 }}>
              在 p 0–3、d 0/1、q 0–2 的网格里按 AIC 选。最终没有自回归项，只有两个移动平均项。
              参数一共四个：c、两个 theta、sigma。
            </Body>
            <div style={{ marginTop: 20 }}>
              <Verdict ok label="阶数固定，不再调" />
            </div>
            <div style={{ marginTop: 22, fontFamily: FONT.mono, fontSize: FT.meta, color: C.inkFaint }}>
              用同一份训练段、同一个种子，结果逐位复现。
            </div>
          </div>
          <div style={{ position: "absolute", left: 940, top: 282, width: 920 }}>
            <Card label="解出来的四个数" accent={C.cyan} pad={24}>
              <Row name="AIC" value={M.arima.aic.toFixed(3)} note="网格里最小" />
              <Row name="σ̂" value={M.arima.sigma.toFixed(8)} note="训练残差标准差" />
              <Row name="c" value={M.arima.c.toFixed(8)} note="漂移，几乎是零" />
              <Row name="θ₁ / θ₂" value="0.014715 / −0.036615" note="两个移动平均系数" />
            </Card>
          </div>
        </AbsoluteFill>

        {/* 页三：Hannan-Rissanen */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 282, width: 900 }}>
            <div style={{ fontFamily: FONT.serif, fontSize: FT.h2, color: C.ink }}>两步法，不用 LAPACK</div>
            <Body style={{ marginTop: 16, width: 860 }}>
              MA 项的误差不可观测，所以先用高阶 AR 的残差当替身，再把 y 的滞后和残差滞后拼成回归矩阵，做一次最小二乘。
              AR 那一步用 Levinson-Durbin 递推，不解矩阵。
            </Body>
            <div style={{ marginTop: 20 }}>
              <Verdict ok label="两步法，够稳" />
            </div>
          </div>
          <div style={{ position: "absolute", left: 1020, top: 282, width: 840 }}>
            <CodeBlock width={820} title="Hannan-Rissanen" lines={[
              { t: "1  高阶 AR:  y_t ~ AR(p_max)      -- Levinson-Durbin", hi: true },
              { t: "2  残差替身: e_t = y_t - ŷ_t" },
              { t: "3  拼矩阵:  [y_lag | e_lag] ~ ξ" },
              { t: "4  最小二乘: ξ = (XᵀX)⁻¹Xᵀy     -- Householder QR", hi: true },
              { t: "5  解出 φ, θ, c" },
            ]} />
            <div style={{ marginTop: 18, fontFamily: FONT.mono, fontSize: FT.meta, color: C.inkFaint }}>
              非书中：两步法不是最优估计，但对日频收益足够稳。
            </div>
          </div>
        </AbsoluteFill>

        {/* 页四：Matrix Profile */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 286, width: 950 }}>
            <Formula size={50} color={C.violet}>
              P(i) = min<sub>j∉[i−excl, i+excl]</sub> d(i, j)
            </Formula>
            <div style={{ marginTop: 14, fontFamily: FONT.mono, fontSize: FT.meta, color: C.inkFaint }}>式(4.42) 的位置 · 非书中：书只有「全局最近邻距离」一句</div>
            <Body style={{ marginTop: 24, width: 900 }}>
              展开平方距离，点积可以用前缀和与对角递推一次算完，整段复杂度从三次降到平方。
              profile 的长度是 n 减 m 加一：每个窗口一个值。
            </Body>
          </div>
          <div style={{ position: "absolute", left: 1060, top: 286, width: 800 }}>
            <Card label="三个数" accent={C.violet} pad={24}>
              <Row name="窗口 m" value="100 点" note="要盖住一种形态" />
              <Row name="排除区 excl" value="25 点" note="窗口的四分之一" />
              <Row name="距离" value="z 归一化欧氏" note="形状相似，不看绝对水平" />
            </Card>
          </div>
        </AbsoluteFill>

        {/* 页五：数值四条 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 282, width: 1730 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 22 }}>
              <Card label="一 · 常数段" accent={C.coral} pad={22}>
                <div style={{ fontFamily: FONT.mono, fontSize: FT.body, color: C.coral }}>σ = 0 → d = +∞</div>
                <Body style={{ marginTop: 10 }}>零方差除零会出 NaN；常数子序列的距离记正无穷，跳过。</Body>
              </Card>
              <Card label="二 · 排除区不能省" accent={C.coral} pad={22}>
                <div style={{ fontFamily: FONT.mono, fontSize: FT.body, color: C.coral }}>j ∉ [i−25, i+25]</div>
                <Body style={{ marginTop: 10 }}>省了它，最近的邻居就是自己，profile 全零，方法失效。</Body>
              </Card>
              <Card label="三 · 前缀和会消去" accent={C.amber} pad={22}>
                <div style={{ fontFamily: FONT.mono, fontSize: FT.body, color: C.amber }}>均方 − 平方均值</div>
                <Body style={{ marginTop: 10 }}>常值段上两个大数相减，差值掉进噪声；仿射不变性只在有限距离上成立。</Body>
              </Card>
              <Card label="四 · 点级映射" accent={C.amber} pad={22}>
                <div style={{ fontFamily: FONT.mono, fontSize: FT.body, color: C.amber }}>score[t] = min P(i)</div>
                <Body style={{ marginTop: 10 }}>一个点被多个窗口覆盖，取最小距离；取最大会把孤立点当异常。</Body>
              </Card>
            </div>
            <Body style={{ marginTop: 22, width: 1600 }}>
              四条不是实现细节，是方法的边界：不写清楚，任何一次读数都不可复现。这一集的四十九条检查，前八条就是在钉这四个口径。
            </Body>
          </div>
        </AbsoluteFill>
      </Pages>
    </Scene>
  );
};
