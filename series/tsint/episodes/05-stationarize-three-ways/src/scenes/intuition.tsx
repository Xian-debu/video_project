import React from "react";
import { Build } from "../../design/primitives";
import { C, FONT, FT } from "../../design/tokens";
import { Bars, Body, Card, Chip, K, M, PAD, Pages, Scene, SceneHead, Stat, fmtE, fmtM, lf } from "../shared";

const Flow: React.FC<{ items: string[]; accent: string; width: number }> = ({ items, accent, width }) => (
  <div style={{ display: "flex", alignItems: "center", width, justifyContent: "space-between" }}>
    {items.map((t, i) => (
      <React.Fragment key={i}>
        <div style={{
          padding: "14px 18px", borderRadius: 10, border: "1px solid " + C.panelLine,
          borderTop: "2px solid " + (i % 2 === 0 ? accent : C.inkFaint), background: "#101823",
          fontFamily: FONT.mono, fontSize: FT.meta + 2, color: C.ink, textAlign: "center",
        }}>{t}</div>
        {i < items.length - 1 ? <div style={{ fontFamily: FONT.mono, fontSize: 26, color: C.inkFaint }}>→</div> : null}
      </React.Fragment>
    ))}
  </div>
);

export const SIntuition: React.FC = () => {
  const s = M.stats;
  return (
    <Scene id="intuition">
      <SceneHead id="intuition" />
      <Pages id="intuition" at={[0, 0.27, 0.53, 0.77]}>
        <div>
          <div style={{ position: "absolute", left: PAD, top: 236, fontFamily: FONT.sans, fontSize: FT.h2, color: C.inkDim }}>
            差分不是把曲线压平，它是在把生成机制还原。
          </div>
          <Build at={lf("intuition", 0.06)}>
            <div style={{ position: "absolute", left: PAD, top: 320 }}>
              <Flow items={["收益 ε_t", "累加 Σ", "价格 x_t", "差分 Δ", "收益 ε_t"]} accent={C.cyan} width={1180} />
            </div>
          </Build>
          <Build at={lf("intuition", 0.1)}>
            <div style={{ position: "absolute", left: PAD, top: 450, width: 1180 }}>
              <Card accent={C.cyan} style={{ height: 240 }}>
                <Body>价格是收益的累加。累加一次，积分阶加一；差分一次，正好抵消。所以差分把非平稳的累计量还原成平稳的增量。</Body>
                <Body style={{ marginTop: 12 }}>代价是噪声被放大：白噪声相邻两点的差，方差是原来的两倍。</Body>
              </Card>
            </div>
          </Build>
          <Build at={lf("intuition", 0.14)}>
            <div style={{ position: "absolute", left: PAD, top: 730, width: 1180 }}>
              <Chip color={C.coral}>对随机游走，差分回来的是步长噪声本身，方差是 σ²，不是 2σ²</Chip>
            </div>
          </Build>
        </div>

        <div>
          <div style={{ position: "absolute", left: PAD, top: 236, fontFamily: FONT.sans, fontSize: FT.h2, color: C.inkDim }}>
            随机游走：水平几乎完全记住过去，差分把记忆拿走。
          </div>
          <Build at={lf("intuition", 0.31)}>
            <div style={{ position: "absolute", left: PAD, top: 330, width: 1360 }}>
              <Bars items={[
                { label: "水平 ACF", value: s.walkAcfLevel, text: s.walkAcfLevel.toFixed(6), color: C.amber },
                { label: "差分 ACF", value: s.walkAcfDiff, text: s.walkAcfDiff.toFixed(6), color: C.cyan },
              ]} width={1360} max={1} rowH={96} at={lf("intuition", 0.33)} />
            </div>
          </Build>
          <Build at={lf("intuition", 0.37)}>
            <div style={{ position: "absolute", left: PAD, top: 620, width: 1180 }}>
              <Body>水平 0.9998 几乎是完美记忆；差分后 0.0006，只剩噪声。这就是「改积分阶」在数字上的样子。</Body>
            </div>
          </Build>
        </div>

        <div>
          <div style={{ position: "absolute", left: PAD, top: 236, fontFamily: FONT.sans, fontSize: FT.h2, color: C.inkDim }}>
            对数：乘法变加法，异方差被压平；趋势和积分阶不动。
          </div>
          <Build at={lf("intuition", 0.57)}>
            <div style={{ position: "absolute", left: PAD, top: 318, width: 900 }}>
              <Card accent={C.amber} style={{ height: 300 }}>
                <div style={{ fontFamily: FONT.serif, fontSize: 44, color: C.ink }}>log(ab) = log a + log b</div>
                <Body style={{ marginTop: 18 }}>方差随水平增长时，取对数把乘性波动变成加性波动，方差近似常数。</Body>
                <Body style={{ marginTop: 10 }}>但加法趋势原样保留；指数增长反而被拉成直线，看起来更「平稳」，其实没有。</Body>
              </Card>
            </div>
          </Build>
          <Build at={lf("intuition", 0.61)}>
            <div style={{ position: "absolute", left: PAD + 940, top: 318, width: 856 }}>
              <Bars items={[
                { label: "水平", value: Math.abs(s.corrLevel), text: s.corrLevel.toFixed(4), color: C.amber },
                { label: "取对数", value: Math.abs(s.corrLog), text: s.corrLog.toFixed(4), color: C.cyan },
              ]} width={856} max={1} rowH={90} at={lf("intuition", 0.63)} />
              <Body size={FT.meta} style={{ marginTop: 12 }}>条形是相关的绝对值；符号翻转，因为对数压缩了大值。</Body>
            </div>
          </Build>
          <Build at={lf("intuition", 0.68)}>
            <div style={{ position: "absolute", left: PAD, top: 660, width: 1776 }}>
              <div style={{ fontFamily: FONT.sans, fontSize: FT.h2, color: C.ink }}>对数之后，还是要差分：异方差没了，单位根还在。</div>
            </div>
          </Build>
        </div>

        <div>
          <div style={{ position: "absolute", left: PAD, top: 236, fontFamily: FONT.sans, fontSize: FT.h2, color: C.inkDim }}>
            Z-score：平移加缩放，时间结构一点没动。
          </div>
          <Build at={lf("intuition", 0.81)}>
            <div style={{ position: "absolute", left: PAD, top: 330, width: 1360 }}>
              <Bars items={[
                { label: "原序列 ACF", value: s.acfLevel, text: s.acfLevel.toFixed(6), color: C.amber },
                { label: "Z 之后 ACF", value: s.acfZ, text: s.acfZ.toFixed(6), color: C.violet },
                { label: "两者之差", value: Math.abs(s.acfDelta), text: fmtE(s.acfDelta, 2), color: C.cyan },
              ]} width={1360} max={1} rowH={80} at={lf("intuition", 0.83)} />
            </div>
          </Build>
          <Build at={lf("intuition", 0.87)}>
            <div style={{ position: "absolute", left: PAD, top: 660, width: 1776 }}>
              <div style={{ display: "flex", gap: 18 }}>
                <Card accent={C.violet} style={{ width: 580 }}><K>不变</K><Body style={{ marginTop: 8 }}>ACF 只看形状，不看位置和尺度。</Body></Card>
                <Card accent={C.cyan} style={{ width: 580 }}><K>改变</K><Body style={{ marginTop: 8 }}>均值 0、方差 1、单位换成标准差。</Body></Card>
                <Card accent={C.coral} style={{ width: 580 }}><K>结论</K><Body style={{ marginTop: 8 }}>标准化不是平稳化，不能代替差分。</Body></Card>
              </div>
            </div>
          </Build>
        </div>
      </Pages>
    </Scene>
  );
};
