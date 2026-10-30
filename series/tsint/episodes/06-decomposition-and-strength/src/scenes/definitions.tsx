import React from "react";
import { Build } from "../../design/primitives";
import { C, FONT, FT } from "../../design/tokens";
import { Body, Card, Chip, CodeBlock, K, M, PAD, Pages, Scene, SceneHead, Stat, fmtF, lf } from "../shared";

const F: React.FC<{ children: React.ReactNode; size?: number; color?: string }> = ({ children, size, color }) => (
  <div style={{ fontFamily: FONT.mono, fontSize: size || 30, color: color || C.ink, lineHeight: 1.5 }}>{children}</div>
);

export const SDefinitions: React.FC = () => {
  const s = M.stats;
  const d = M.series;
  return (
    <Scene id="definitions">
      <SceneHead id="definitions" />
      <Pages id="definitions" at={[0, 0.28, 0.54, 0.79]}>
        <div>
          <div style={{ position: "absolute", left: PAD, top: 236, fontFamily: FONT.sans, fontSize: FT.h2, color: C.inkDim }}>
            三个零件，三条定义。先看趋势项。
          </div>
          <Build at={lf("definitions", 0.04)}>
            <div style={{ position: "absolute", left: PAD, top: 310, width: 900 }}>
              <Card label="趋势项：中心化移动平均" accent={C.cyan} style={{ height: 330 }}>
                <F size={34}>{"T_t = (1/m) · Σ_{j=-k}^{k} X_{t+j}"}</F>
                <F size={26} color={C.inkDim}>{"k = ⌊m/2⌋，m 是周期长度；偶数阶首末权重要折半"}</F>
                <Body size={FT.meta} style={{ marginTop: 14 }}>m = 4 时窗口是 5 个数：1/8, 1/4, 1/4, 1/4, 1/8。首末各分一半，总和才等于 1。</Body>
              </Card>
            </div>
          </Build>
          <Build at={lf("definitions", 0.12)}>
            <div style={{ position: "absolute", left: PAD + 940, top: 310, width: 836 }}>
              <Card label="为什么折半" accent={C.amber} style={{ height: 330 }}>
                <div style={{ fontFamily: FONT.sans, fontSize: FT.h2, color: C.ink }}>不折半，平均值就偏了。</div>
                <Body style={{ marginTop: 10 }}>偶数窗口的中点落在两个观测之间。把首末两个数各算半个，才能让窗口的「重心」正好落在 t 上。</Body>
                <Body style={{ marginTop: 10 }}>这是书里式 (2.1) 的写法，也是我们实现里写死的那一条。</Body>
                <Chip color={C.amber}>权重和必须为 1</Chip>
              </Card>
            </div>
          </Build>
          <Build at={lf("definitions", 0.2)}>
            <div style={{ position: "absolute", left: PAD, top: 670, width: 1776, background: C.panel, border: "1px solid " + C.panelLine, borderLeft: "3px solid " + C.cyan, borderRadius: 12, padding: "20px 26px" }}>
              <div style={{ display: "flex", gap: 56, alignItems: "baseline" }}>
                <div style={{ fontFamily: FONT.mono, fontSize: 26, color: C.ink }}>{"加法：X_t = T_t + S_t + R_t"}</div>
                <div style={{ fontFamily: FONT.mono, fontSize: 26, color: C.ink }}>{"乘法：X_t = T_t · S_t · R_t"}</div>
              </div>
              <Body size={FT.meta} style={{ marginTop: 10 }}>核同时满足 Σw = 1 与 Σ j·w_j = 0：常数和直线都原样通过，不会被平均出一个假趋势。偶数阶的趋势项只有 n − m + 1 个有效值，窗口越宽，丢掉的两端越长。</Body>
            </div>
          </Build>
        </div>

        <div>
          <div style={{ position: "absolute", left: PAD, top: 236, fontFamily: FONT.sans, fontSize: FT.h2, color: C.inkDim }}>
            季节项：同一相位跨周期取平均。
          </div>
          <Build at={lf("definitions", 0.32)}>
            <div style={{ position: "absolute", left: PAD, top: 310, width: 900 }}>
              <Card label="季节项：相位均值" accent={C.amber} style={{ height: 300 }}>
                <F size={32}>{"S_t = mean{ X_s − T_s : s ≡ t (mod m) }"}</F>
                <Body size={FT.meta} style={{ marginTop: 12 }}>先减趋势，再按相位分组求平均；同一相位每 m 个点取一次。</Body>
              </Card>
            </div>
          </Build>
          <Build at={lf("definitions", 0.4)}>
            <div style={{ position: "absolute", left: PAD + 940, top: 310, width: 836 }}>
              <Card label="周期怎么定" accent={C.coral} style={{ height: 300 }}>
                <div style={{ fontFamily: FONT.sans, fontSize: FT.h2, color: C.ink }}>m 是输入，不是估计出来的。</div>
                <Body style={{ marginTop: 10 }}>日线股价取 5（一周），日内 5 分钟取 48（一天），月度数据取 12。选错了，季节项会去拟合别的周期。</Body>
                <Body style={{ marginTop: 10 }}>这一集不讨论怎么选周期，只讨论给定 m 之后怎么算。</Body>
              </Card>
            </div>
          </Build>
          <Build at={lf("definitions", 0.48)}>
            <div style={{ position: "absolute", left: PAD, top: 650, width: 1776, fontFamily: FONT.sans, fontSize: FT.body, color: C.inkDim }}>
              同样一条价格序列，m = 5 得到季节强度 0.0083；m = 21 得到 0.0139。周期换一个数，结论就换一个量级。
            </div>
          </Build>
        </div>

        <div>
          <div style={{ position: "absolute", left: PAD, top: 236, fontFamily: FONT.sans, fontSize: FT.h2, color: C.inkDim }}>
            残差是剩下的部分，也是唯一有缺口的部分。
          </div>
          <Build at={lf("definitions", 0.58)}>
            <div style={{ position: "absolute", left: PAD, top: 310, width: 900 }}>
              <Card label="残差项" accent={C.violet} style={{ height: 300 }}>
                <F size={32}>R_t = X_t − T_t − S_t</F>
                <Body style={{ marginTop: 12 }}>T_t 在两端没有定义（窗口越界），所以 R_t 也只有中间那一段有值。</Body>
              </Card>
            </div>
          </Build>
          <Build at={lf("definitions", 0.64)}>
            <div style={{ position: "absolute", left: PAD + 940, top: 310, width: 836 }}>
              <Card label="有效区间" accent={C.cyan} style={{ height: 300 }}>
                <div style={{ display: "flex", gap: 48 }}>
                  <Stat label="起点下标" value="2" sub="k = 2（m = 5）" style={{ width: 380, height: 170 }} />
                  <Stat label="终点下标" value="727" sub="n − 1 − k" style={{ width: 380, height: 170 }} />
                </div>
                <Body size={FT.meta} style={{ marginTop: 6 }}>730 个观测，只有 726 个能同时算出 T、S、R。</Body>
              </Card>
            </div>
          </Build>
          <Build at={lf("definitions", 0.7)}>
            <div style={{ position: "absolute", left: PAD, top: 650, width: 1776, fontFamily: FONT.sans, fontSize: FT.body, color: C.inkDim }}>
              强度指标只在有效区间上算方差；两端的缺口直接丢掉，不插值、不补零。
            </div>
          </Build>
        </div>

        <div>
          <div style={{ position: "absolute", left: PAD, top: 236, fontFamily: FONT.sans, fontSize: FT.h2, color: C.inkDim }}>
            加法与乘法：分解的两种口径，各自的约束也不同。
          </div>
          <Build at={lf("definitions", 0.82)}>
            <div style={{ position: "absolute", left: PAD, top: 310, width: 860 }}>
              <Card label="加法分解" accent={C.cyan} style={{ height: 300 }}>
                <F size={30}>X_t = T_t + S_t + R_t</F>
                <Body style={{ marginTop: 12 }}>要求一个周期内季节项求和为零：Σ S = 0。否则趋势项会吸收一个常数。</Body>
              </Card>
            </div>
          </Build>
          <Build at={lf("definitions", 0.87)}>
            <div style={{ position: "absolute", left: PAD + 900, top: 310, width: 876 }}>
              <Card label="乘法分解" accent={C.amber} style={{ height: 300 }}>
                <F size={30}>X_t = T_t · S_t · R_t</F>
                <Body style={{ marginTop: 12 }}>要求一个周期内季节项均值为 1：mean(S) = 1。对数为它变回加法，但要求 X_t &gt; 0。</Body>
              </Card>
            </div>
          </Build>
          <Build at={lf("definitions", 0.91)}>
            <div style={{ position: "absolute", left: PAD, top: 650, width: 1776 }}>
              <CodeBlock title="decomp · 错误分支（写死的顺序）" width={1776} lines={[
                { t: "m < 2                       -> Left DecompBadPeriod" },
                { t: "V.length xs < 2 * m + 1     -> Left DecompTooShort" },
                { t: "Multiplicative && any <= 0  -> Left (DecompNonPositive i v)" },
                { t: "abs overall <= 1e-12        -> Left (DecompZeroSeasonal 0 overall)", hi: true },
              ]} at={lf("definitions", 0.94)} />
            </div>
          </Build>
        </div>
      </Pages>
    </Scene>
  );
};
