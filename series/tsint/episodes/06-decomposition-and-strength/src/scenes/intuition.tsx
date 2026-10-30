import React from "react";
import { Build } from "../../design/primitives";
import { C, FONT, FT } from "../../design/tokens";
import { Bars, Body, Card, Chip, CodeBlock, K, M, PAD, Pages, Scene, SceneHead, Stat, fmtF, lf } from "../shared";

const F: React.FC<{ children: React.ReactNode; size?: number; color?: string }> = ({ children, size, color }) => (
  <div style={{ fontFamily: FONT.mono, fontSize: size || 28, color: color || C.ink, lineHeight: 1.5 }}>{children}</div>
);

export const SIntuition: React.FC = () => {
  const s = M.stats;
  const ma4 = s.ma4;
  return (
    <Scene id="intuition">
      <SceneHead id="intuition" />
      <Pages id="intuition" at={[0, 0.27, 0.53, 0.77]}>
        <div>
          <div style={{ position: "absolute", left: PAD, top: 236, fontFamily: FONT.sans, fontSize: FT.h2, color: C.inkDim }}>
            第一个为什么：直接卷积，不做两次移动平均。
          </div>
          <Build at={lf("intuition", 0.04)}>
            <div style={{ position: "absolute", left: PAD, top: 310, width: 860 }}>
              <Card label="m = 4 的核权重" accent={C.cyan} style={{ height: 380 }}>
                <Bars items={ma4.map((v, i) => ({ label: ["t−2", "t−1", "t", "t+1", "t+2"][i], value: v, text: v.toFixed(3), color: C.cyan }))} width={780} max={0.25} rowH={54} at={lf("intuition", 0.06)} />
                <Body size={FT.meta} style={{ marginTop: 6 }}>首末 0.125、中间 0.25：权重和 1，一阶矩 Σ j·w_j = 0。</Body>
              </Card>
            </div>
          </Build>
          <Build at={lf("intuition", 0.14)}>
            <div style={{ position: "absolute", left: PAD + 900, top: 310, width: 876 }}>
              <Card label="两条性质，两个通过" accent={C.amber} style={{ height: 380 }}>
                <div style={{ fontFamily: FONT.sans, fontSize: FT.h2, color: C.ink }}>常数进去，常数出来；线性进去，还是同一条线性。</div>
                <Body style={{ marginTop: 10 }}>权重和 1 保证常数不被改变；一阶矩 0 保证斜率不被改变。这两条是核的资格线。</Body>
                <Body style={{ marginTop: 10 }}>两次移动平均代数上等价，但要跑两趟，区间一长还会多丢一圈端点。所以直接卷积，一趟算完。</Body>
                <Chip color={C.amber}>等价，但代价不同</Chip>
              </Card>
            </div>
          </Build>
          <Build at={lf("intuition", 0.22)}>
            <div style={{ position: "absolute", left: PAD, top: 740, width: 1776, fontFamily: FONT.sans, fontSize: FT.meta, color: C.inkFaint }}>
              证据里第一条手算，就是 m = 4 的权重和等于 1；第二条是端点区间。
            </div>
          </Build>
        </div>

        <div>
          <div style={{ position: "absolute", left: PAD, top: 236, fontFamily: FONT.sans, fontSize: FT.h2, color: C.inkDim }}>
            第二个为什么：按相位平均，不按日历平均。
          </div>
          <Build at={lf("intuition", 0.3)}>
            <div style={{ position: "absolute", left: PAD, top: 310, width: 860 }}>
              <Card label="日历平均：每个日期一个观测" accent={C.coral} style={{ height: 320 }}>
                <F size={26}>mean_t = X_t − T_t</F>
                <Body style={{ marginTop: 10 }}>700 多个交易日，跨两年；同一天只有一年出现过一次。这样平均出来的东西是噪声，不是季节。</Body>
                <Body style={{ marginTop: 8 }}>日历上「同一天」不重复，就没有可以跨周期共享的结构。</Body>
              </Card>
            </div>
          </Build>
          <Build at={lf("intuition", 0.38)}>
            <div style={{ position: "absolute", left: PAD + 900, top: 310, width: 876 }}>
              <Card label="相位平均：同一个位置，跨周期共享" accent={C.amber} style={{ height: 320 }}>
                <F size={26}>{"S_t = mean{ X_s − T_s : s ≡ t (mod m) }"}</F>
                <Body style={{ marginTop: 10 }}>周期 5，周五对周五；周期 21，一个月里第 21 天对第 21 天。同一个相位在每个周期各出一个观测，平均才有意义。</Body>
                <Body style={{ marginTop: 8 }}>趋势没定义的端点，季节项仍然有值：缺失只影响趋势和残差。</Body>
              </Card>
            </div>
          </Build>
          <Build at={lf("intuition", 0.46)}>
            <div style={{ position: "absolute", left: PAD, top: 690, width: 1776 }}>
              <Card accent={C.violet} style={{ height: 170 }}>
                <K>四点纯周期：相位把 10、13、16、19 对齐</K>
                <Body style={{ marginTop: 8 }}>均值 14.5 归趋势，季节项 −4.5 / −1.5 / 1.5 / 4.5；同一相位跨周期共享一个值。</Body>
              </Card>
            </div>
          </Build>
        </div>

        <div>
          <div style={{ position: "absolute", left: PAD, top: 236, fontFamily: FONT.sans, fontSize: FT.h2, color: C.inkDim }}>
            第三个为什么：分母各去各的，不用原始序列。
          </div>
          <Build at={lf("intuition", 0.56)}>
            <div style={{ position: "absolute", left: PAD, top: 300, width: 1776 }}>
              <CodeBlock title="两个强度指标的定义（式 2.2 的写法）" width={1776} lines={[
                { t: "F_trend  = max(0, 1 − var(R) / var(X − S))" },
                { t: "F_season = max(0, 1 − var(R) / var(X − T))" },
                { t: "", dim: true },
                { t: "分母先去掉对方：算趋势强度时先扣掉季节，算季节强度时先扣掉趋势。", hi: true },
              ]} at={lf("intuition", 0.58)} />
            </div>
          </Build>
          <Build at={lf("intuition", 0.6)}>
            <div style={{ position: "absolute", left: PAD, top: 620, width: 1776, fontFamily: FONT.sans, fontSize: FT.h2, color: C.ink }}>
              用原始序列当分母，另一项的方差会被算进来：强季节序列，趋势强度被抬高；长趋势序列，季节强度被压扁。
            </div>
          </Build>
          <Build at={lf("intuition", 0.64)}>
            <div style={{ position: "absolute", left: PAD, top: 740, width: 1776, fontFamily: FONT.sans, fontSize: FT.body, color: C.inkDim }}>
              所以两个分母必须各去各的；这是让两个数各自可解释的写法，也是实现里的一份约定。
            </div>
          </Build>
        </div>

        <div>
          <div style={{ position: "absolute", left: PAD, top: 236, fontFamily: FONT.sans, fontSize: FT.h2, color: C.inkDim }}>
            第四个为什么：纯噪声不是零，残差方差只剩 0.725。
          </div>
          <Build at={lf("intuition", 0.8)}>
            <div style={{ position: "absolute", left: PAD, top: 310, width: 860 }}>
              <Card label="四个合成序列" accent={C.violet} style={{ height: 360 }}>
                <Bars items={[
                  { label: "纯噪声 · 趋势", value: s.noiseTrend, text: fmtF(s.noiseTrend, 4), color: C.coral },
                  { label: "纯噪声 · 季节", value: s.noiseSeason, text: fmtF(s.noiseSeason, 4), color: C.coral },
                  { label: "趋势+噪声", value: s.synth.trend_noise.trend, text: fmtF(s.synth.trend_noise.trend, 4), color: C.cyan },
                  { label: "季节+噪声", value: s.synth.season_noise.seasonal, text: fmtF(s.synth.season_noise.seasonal, 4), color: C.amber },
                ]} width={780} max={1} rowH={58} at={lf("intuition", 0.82)} />
              </Card>
            </div>
          </Build>
          <Build at={lf("intuition", 0.86)}>
            <div style={{ position: "absolute", left: PAD + 900, top: 310, width: 876 }}>
              <Card label="核把噪声平滑掉一部分" accent={C.coral} style={{ height: 360 }}>
                <div style={{ fontFamily: FONT.sans, fontSize: FT.h2, color: C.ink }}>残差方差 = 0.7253 × 原方差</div>
                <Body style={{ marginTop: 10 }}>一减，就是 0.2747。这个数不是信号，是移动平均这个低通滤波的形状；核越长，残余越小。</Body>
                <Body style={{ marginTop: 10 }}>所以读强度指标之前，先问一句：这一集的合成基线是多少。</Body>
                <Chip color={C.coral}>0.2747 是核的脚印</Chip>
              </Card>
            </div>
          </Build>
          <Build at={lf("intuition", 0.9)}>
            <div style={{ position: "absolute", left: PAD, top: 730, width: 1776, fontFamily: FONT.sans, fontSize: FT.body, color: C.inkDim }}>
              纯趋势 1、纯周期 1、纯噪声 0.2747 —— 三个基线，后面的每个数都要和它们比。
            </div>
          </Build>
        </div>
      </Pages>
    </Scene>
  );
};
