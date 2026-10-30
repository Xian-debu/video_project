import React from "react";
import { Build } from "../../design/primitives";
import { C, FONT, FT } from "../../design/tokens";
import { Bars, Body, Card, Chip, K, M, PAD, Pages, Scene, SceneHead, Stat, fmtE, fmtF, lf } from "../shared";

const Row: React.FC<{ name: string; trend: number; season: number; meta: string; accent: string }> = ({ name, trend, season, meta, accent }) => (
  <Card label={name} accent={accent} style={{ width: 875, height: 240 }}>
    <div style={{ display: "flex", gap: 52, alignItems: "flex-end" }}>
      <div>
        <K>趋势强度</K>
        <div style={{ fontFamily: FONT.mono, fontSize: 46, color: accent, lineHeight: 1.2 }}>{fmtF(trend, 4)}</div>
      </div>
      <div>
        <K>季节强度</K>
        <div style={{ fontFamily: FONT.mono, fontSize: 46, color: C.ink, lineHeight: 1.2 }}>{fmtF(season, 4)}</div>
      </div>
    </div>
    <Body size={FT.meta} style={{ marginTop: 8 }}>{meta}</Body>
  </Card>
);

export const SVerification: React.FC = () => {
  const s = M.stats;
  const d = s.decomp;
  const sy = s.synth;
  return (
    <Scene id="verification">
      <SceneHead id="verification" />
      <Pages id="verification" at={[0, 0.19, 0.41, 0.61, 0.78, 0.9]}>
        <div>
          <div style={{ position: "absolute", left: PAD, top: 236, fontFamily: FONT.sans, fontSize: FT.h2, color: C.inkDim }}>
            手算十三条：每一条都能在纸上验一遍。
          </div>
          <Build at={lf("verification", 0.03)}>
            <div style={{ position: "absolute", left: PAD, top: 310, width: 860 }}>
              <Card label="m = 4 的核：五个权重" accent={C.cyan} style={{ height: 300 }}>
                <div style={{ display: "flex", gap: 22 }}>
                  {s.ma4.map((v, i) => (
                    <Stat key={i} label={["t−2", "t−1", "t", "t+1", "t+2"][i]} value={v.toFixed(3)} style={{ width: 148, height: 150 }} valueSize={30} />
                  ))}
                </div>
                <Body size={FT.meta} style={{ marginTop: 8 }}>0.125 + 0.25 + 0.25 + 0.25 + 0.125 = {s.ma4Sum.toFixed(3)}，误差 0。</Body>
              </Card>
            </div>
          </Build>
          <Build at={lf("verification", 0.09)}>
            <div style={{ position: "absolute", left: PAD + 900, top: 310, width: 876 }}>
              <Card label="四点纯周期" accent={C.amber} style={{ height: 300 }}>
                <div style={{ display: "flex", gap: 24 }}>
                  {s.cycleSeasonal.map((v, i) => (
                    <Stat key={i} label={"相位 " + i} value={(v > 0 ? "+" : "") + v.toFixed(1)} sub={"X = " + s.cyclePhase[i].toFixed(0)} style={{ width: 190, height: 150 }} valueSize={30} />
                  ))}
                </div>
                <Body size={FT.meta} style={{ marginTop: 8 }}>均值 {s.cycleMean} 被趋势拿走，季节项 −4.5 / −1.5 / 1.5 / 4.5；整个样本 ΣS = {fmtE(s.seasonSum, 2)}。</Body>
              </Card>
            </div>
          </Build>
          <Build at={lf("verification", 0.15)}>
            <div style={{ position: "absolute", left: PAD, top: 660, display: "flex", gap: 22 }}>
              <Stat label="线性 1–12 · T_2" value="3" sub="权重和 1、一阶矩 0，线性原样通过" style={{ width: 424, height: 200 }} valueColor={C.cyan} />
              <Stat label="线性 1–12 · T_3" value="4" sub="同一条直线上的第三点" style={{ width: 424, height: 200 }} valueColor={C.cyan} />
              <Stat label="乘法季节均值" value="1.0000" sub="mean(S) = 1，误差在机器精度" style={{ width: 424, height: 200 }} valueColor={C.amber} />
              <Stat label="重建最大误差" value={fmtE(s.reconstructionMaxErr, 2)} sub="max |X − (T + S + R)|" style={{ width: 424, height: 200 }} valueColor={C.cyan} />
            </div>
          </Build>
          <Build at={lf("verification", 0.24)}>
            <div style={{ position: "absolute", left: PAD, top: 900, fontFamily: FONT.sans, fontSize: FT.meta, color: C.inkFaint }}>
              十三条手算里还包括周期小于 2、长度不足、乘法遇到零和负数的三个拒绝分支。
            </div>
          </Build>
        </div>

        <div>
          <div style={{ position: "absolute", left: PAD, top: 236, fontFamily: FONT.sans, fontSize: FT.h2, color: C.inkDim }}>
            真实数据十二条：四份样本，趋势与季节各一条。
          </div>
          <Build at={lf("verification", 0.24)}>
            <div style={{ position: "absolute", left: PAD, top: 300, display: "flex", flexWrap: "wrap", gap: 26 }}>
              <Row name="贵州茅台 · 日线" trend={d.maotai.trend} season={d.maotai.seasonal} meta={"730 行 · m = 5 · 有效 726 · 区间 2–727"} accent={C.cyan} />
              <Row name="平安银行 · 日线" trend={d.pingan.trend} season={d.pingan.seasonal} meta={"730 行 · m = 21 · 有效 710 · 区间 10–719"} accent={C.cyan} />
              <Row name="贵州茅台 · 五分钟" trend={d.minute.trend} season={d.minute.seasonal} meta={"240 行 · m = 48 · 有效 192 · 区间 24–215"} accent={C.amber} />
              <Row name="上证指数 · 二零一五" trend={d.index.trend} season={d.index.seasonal} meta={"120 行 · m = 5 · 有效 116 · 区间 2–117"} accent={C.amber} />
            </div>
          </Build>
          <Build at={lf("verification", 0.34)}>
            <div style={{ position: "absolute", left: PAD, top: 830, width: 1776, fontFamily: FONT.sans, fontSize: FT.body, color: C.inkDim }}>
              同一只茅台，日线趋势 0.998、五分钟 0.675：采样频率本身就是口径的一部分。
            </div>
          </Build>
        </div>

        <div>
          <div style={{ position: "absolute", left: PAD, top: 236, fontFamily: FONT.sans, fontSize: FT.h2, color: C.inkDim }}>
            合成十四条：六个序列，覆盖极值和非极值。
          </div>
          <Build at={lf("verification", 0.44)}>
            <div style={{ position: "absolute", left: PAD, top: 310, display: "flex", flexWrap: "wrap", gap: 22 }}>
              {[
                ["线性趋势", sy.linear, C.cyan],
                ["纯周期", sy.cycle, C.amber],
                ["纯噪声", sy.noise, C.coral],
                ["趋势 + 噪声", sy.trend_noise, C.cyan],
                ["季节 + 噪声", sy.season_noise, C.amber],
                ["乘法分解", sy.multiplicative, C.violet],
              ].map(([name, v, color]: any) => (
                <Card key={name} accent={color} style={{ width: 424, height: 210 }}>
                  <K>{name}</K>
                  <div style={{ display: "flex", gap: 22, marginTop: 6 }}>
                    <div style={{ fontFamily: FONT.mono, fontSize: 32, color, lineHeight: 1.3 }}>{fmtF(v.trend, 4)}</div>
                    <div style={{ fontFamily: FONT.mono, fontSize: 32, color: C.inkDim, lineHeight: 1.3 }}>{fmtF(v.seasonal, 4)}</div>
                  </div>
                  <Body size={FT.micro}>趋势强度 / 季节强度 · 周期 4 · 有效 236</Body>
                </Card>
              ))}
            </div>
          </Build>
          <Build at={lf("verification", 0.54)}>
            <div style={{ position: "absolute", left: PAD, top: 780, width: 1776, fontFamily: FONT.sans, fontSize: FT.body, color: C.inkDim }}>
              纯趋势 1 / 0，纯周期 0 / 1；加噪声之后，趋势+噪声仍是 0.9995，季节+噪声是 0.9341。
            </div>
          </Build>
        </div>

        <div>
          <div style={{ position: "absolute", left: PAD, top: 236, fontFamily: FONT.sans, fontSize: FT.h2, color: C.inkDim }}>
            交换检验：把趋势和季节对调。
          </div>
          <Build at={lf("verification", 0.62)}>
            <div style={{ position: "absolute", left: PAD, top: 310, width: 860 }}>
              <Card label="swap：两个序列各有各的强项" accent={C.violet} style={{ height: 300 }}>
                <Bars items={[
                  { label: "趋势序列 T", value: sy.trend_noise.trend, text: fmtF(sy.trend_noise.trend, 4), color: C.cyan },
                  { label: "季节序列 T", value: sy.season_noise.trend, text: fmtF(sy.season_noise.trend, 4), color: C.inkDim },
                  { label: "季节序列 S", value: sy.season_noise.seasonal, text: fmtF(sy.season_noise.seasonal, 4), color: C.amber },
                  { label: "趋势序列 S", value: sy.trend_noise.seasonal, text: fmtF(sy.trend_noise.seasonal, 4), color: C.inkDim },
                ]} width={790} max={1} rowH={58} at={lf("verification", 0.63)} />
              </Card>
            </div>
          </Build>
          <Build at={lf("verification", 0.645)}>
            <div style={{ position: "absolute", left: PAD + 900, top: 310, width: 876 }}>
              <Stat label="趋势差" value={fmtF(s.swapTrendGap, 4)} sub="0.9995 − 0.2579，门槛 0.5" accent={C.cyan} style={{ height: 140 }} valueColor={C.cyan} />
              <Stat label="季节差" value={fmtF(s.swapSeasonGap, 4)} sub="0.9341 − 0.0070，门槛 0.5" accent={C.amber} style={{ height: 140, marginTop: 16 }} valueColor={C.amber} />
              <Body size={FT.meta} style={{ marginTop: 12 }}>两个差都远大于 0.5：两个指标真的在测不同的东西。</Body>
            </div>
          </Build>
        </div>

        <div>
          <div style={{ position: "absolute", left: PAD, top: 236, fontFamily: FONT.sans, fontSize: FT.h2, color: C.inkDim }}>
            那 0.2747 是怎么来的？先说一个踩过的坑。
          </div>
          <Build at={lf("verification", 0.79)}>
            <div style={{ position: "absolute", left: PAD, top: 310, display: "flex", gap: 26 }}>
              <Stat label="种子 44 · 纯噪声趋势" value="0.416" sub="噪声的滞后一阶自相关 0.203" accent={C.coral} style={{ width: 875, height: 220 }} valueColor={C.coral} />
              <Stat label="种子 45 · 纯噪声趋势" value="0.2747" sub="滞后一阶自相关 0.012" accent={C.cyan} style={{ width: 875, height: 220 }} valueColor={C.cyan} />
            </div>
          </Build>
          <Build at={lf("verification", 0.81)}>
            <div style={{ position: "absolute", left: PAD, top: 580, width: 1776, background: C.panel, border: "1px solid " + C.panelLine, borderLeft: "3px solid " + C.coral, borderRadius: 12, padding: "22px 26px" }}>
              <K>种子也是参数</K>
              <div style={{ fontFamily: FONT.sans, fontSize: FT.h2, color: C.ink, marginTop: 6, lineHeight: 1.5 }}>第一版合成用种子 44，纯噪声自相关 0.203，趋势强度虚高到 0.416——差了一倍。</div>
              <Body size={FT.meta} style={{ marginTop: 8 }}>换种子 45，ac1 回到 0.012，趋势强度 0.2747。证据固定种子，并把种子写进报告；否则同一个「纯噪声」可以给出两个差一倍的强度。</Body>
            </div>
          </Build>
          <Build at={lf("verification", 0.84)}>
            <div style={{ position: "absolute", left: PAD, top: 880, fontFamily: FONT.sans, fontSize: FT.meta, color: C.inkFaint }}>
              0.2747 不是信号的强度，是核的脚印；换周期、换窗口长度，它还会再变。
            </div>
          </Build>
        </div>

        <div>
          <div style={{ position: "absolute", left: PAD, top: 236, fontFamily: FONT.sans, fontSize: FT.h2, color: C.inkDim }}>
            三十九条：十三条手算，十二条真实数据，十四条合成。
          </div>
          <Build at={lf("verification", 0.91)}>
            <div style={{ position: "absolute", left: PAD, top: 310, display: "flex", gap: 26 }}>
              <Stat label="手算" value="13" sub="权重、端点、周期、重建、拒绝" accent={C.cyan} style={{ width: 574, height: 220 }} />
              <Stat label="真实数据" value="12" sub="四份样本 × 两个强度" accent={C.amber} style={{ width: 574, height: 220 }} />
              <Stat label="合成" value="14" sub="六个序列 × 两个强度" accent={C.violet} style={{ width: 574, height: 220 }} />
            </div>
          </Build>
          <Build at={lf("verification", 0.93)}>
            <div style={{ position: "absolute", left: PAD, top: 590, width: 1776, background: C.panel, border: "1px solid " + C.panelLine, borderLeft: "3px solid " + C.cyan, borderRadius: 12, padding: "22px 26px" }}>
              <div style={{ fontFamily: FONT.sans, fontSize: FT.h2, color: C.ink }}>验收标准：每个数都能回到一条检查，不是看起来对，是能复现。</div>
              <K style={{ display: "block", marginTop: 10 }}>evidence/ch2-classical · ch2-trendstrength · ch2-seasonalstrength · 20261030T150458</K>
            </div>
          </Build>
          <Build at={lf("verification", 0.95)}>
            <div style={{ position: "absolute", left: PAD, top: 760, fontFamily: FONT.sans, fontSize: FT.body, color: C.inkDim }}>
              全套测试 503 条断言；这三十九条检查与它们一一对应。
            </div>
          </Build>
        </div>
      </Pages>
    </Scene>
  );
};
