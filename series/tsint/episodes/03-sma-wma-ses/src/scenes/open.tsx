import React from "react";
import { Build } from "../../design/primitives";
import { C, FONT, FT } from "../../design/tokens";
import { Body, Card, K, Mono, PAD, Pages, Scene, SceneHead, SmoothingPlot, StepPlot, fmtInt, fmtM, M, lf } from "../shared";

/** 开场：一条曲线两个旋钮，数据的三个数字。 */
export const SOpen: React.FC = () => {
  const id = "open";
  const b = (k: number) => lf(id, k);
  const d = M.data;
  return (
    <Scene id={id}>
      <SceneHead id={id} />
      <Pages id={id} at={[0, 0.2, 0.4, 0.62, 0.82]}>
        {/* 1 · 两个旋钮 */}
        <div>
          <div style={{ position: "absolute", left: PAD, top: 258 }}>
            <Build at={b(0.01)}>
              <SmoothingPlot width={1180} height={430} shows={["close", "sma5", "sma20", "sma60"]} at={b(0.03)} />
            </Build>
          </div>
          <div style={{ position: "absolute", left: PAD + 1230, top: 264, width: 546 }}>
            <Build at={b(0.03)}>
              <Card label="两个旋钮" accent={C.cyan} pad={22} style={{ width: 546 }}>
                <Body color={C.ink} size={FT.h2} style={{ fontFamily: FONT.serif }}>窗口多宽，权重怎么给。</Body>
                <Body size={FT.body} style={{ marginTop: 12 }}>这是平滑的全部自由；两个旋钮决定一条线的形状，也决定它慢多少。</Body>
              </Card>
            </Build>
            <Build at={b(0.06)}>
              <Card label="代价" accent={C.coral} pad={22} style={{ width: 546, marginTop: 18 }}>
                <Body color={C.ink} size={FT.h2} style={{ fontFamily: FONT.serif }}>它慢半拍。</Body>
                <Body size={FT.body} style={{ marginTop: 12 }}>不同的平滑器，慢得还不一样；这一集只问：差在哪。</Body>
                <div style={{ marginTop: 12 }}><K color={C.coral}>先问滞后，再看曲线</K></div>
              </Card>
            </Build>
          </div>
        </div>

        {/* 2 · 数据 */}
        <div>
          <div style={{ position: "absolute", left: PAD, top: 276, width: 1776 }}>
            <Body color={C.ink} size={FT.lead}>贵州茅台，二零一九年初到二零二一年底；七百三十个交易日，前复权。</Body>
          </div>
          <div style={{ position: "absolute", left: PAD, top: 350, width: 880 }}>
            <Build at={b(0.22)}>
              <Card label="样本" accent={C.cyan} pad={24} style={{ width: 860, height: 196 }}>
                <div style={{ fontFamily: FONT.mono, fontSize: FT.display, color: C.cyan, lineHeight: 1 }}>{fmtInt(d.daily.rows)} 行</div>
                <Body size={FT.meta} style={{ marginTop: 14 }}>{d.daily.first} → {d.daily.last} · 日线 · 前复权收盘价</Body>
              </Card>
            </Build>
          </div>
          <div style={{ position: "absolute", left: PAD + 900, top: 350, width: 876 }}>
            <Build at={b(0.25)}>
              <Card label="区间" accent={C.amber} pad={24} style={{ width: 876, height: 196 }}>
                <div style={{ fontFamily: FONT.mono, fontSize: FT.display, color: C.amber, lineHeight: 1 }}>+{d.gainPct.toFixed(2)}%</div>
                <Body size={FT.meta} style={{ marginTop: 14 }}>从 {fmtM(d.daily.min, 0)} 元，到最高 {fmtM(d.daily.max, 0)} 元</Body>
              </Card>
            </Build>
          </div>
          <div style={{ position: "absolute", left: PAD, top: 590, width: 1776 }}>
            <Build at={b(0.29)}>
              <Card accent={C.violet} pad={20} style={{ width: 1776, height: 150 }}>
                <Body size={FT.body}>这本书第二章第二十一到二十二页，给了三条公式：SMA、WMA、SES。</Body>
                <K>书里没给权重方案，也没给 N 和 α 的换算；这两件事，本仓补上。</K>
              </Card>
            </Build>
          </div>
        </div>

        {/* 3 · 三种摊法 */}
        <div>
          <div style={{ position: "absolute", left: PAD, top: 278, width: 1776 }}>
            <Body color={C.ink} size={FT.lead}>同一段行情，三种摊法；窗口、权重、记忆，各一个旋钮。</Body>
          </div>
          {[
            { t: "SMA", s: "窗口 N 个点，等权", f: "s_t = (x_t + … + x_{t-N+1}) / N", c: C.amber },
            { t: "WMA", s: "窗口 N 个点，权重自选", f: "s_t = Σ w_i x_i / Σ w_i", c: C.cyan },
            { t: "SES", s: "没有窗口，只有 α", f: "s_t = α x_t + (1-α) s_{t-1}", c: C.violet },
          ].map((m, i) => (
            <div key={m.t} style={{ position: "absolute", left: PAD + i * 600, top: 356, width: 560 }}>
              <Build at={b(0.42 + i * 0.02)}>
                <Card label={"摊法 " + (i + 1)} accent={m.c} pad={22} style={{ width: 560, height: 236 }}>
                  <div style={{ fontFamily: FONT.serif, fontSize: FT.h1, color: m.c }}>{m.t}</div>
                  <Body size={FT.meta} style={{ marginTop: 8 }}>{m.s}</Body>
                  <div style={{ marginTop: 16 }}><Mono size={FT.code} color={C.inkDim}>{m.f}</Mono></div>
                </Card>
              </Build>
            </div>
          ))}
          <div style={{ position: "absolute", left: PAD, top: 626, width: 1776 }}>
            <Build at={b(0.5)}>
              <Card accent={C.coral} pad={22} style={{ width: 1776, height: 138 }}>
                <Body color={C.ink} size={FT.h2} style={{ fontFamily: FONT.serif }}>这三个旋钮不是正交的：窗口和 α 可以互换算。</Body>
                <K>换算准则，就是这一集的主线</K>
              </Card>
            </Build>
          </div>
        </div>

        {/* 4 · 代价 */}
        <div>
          <div style={{ position: "absolute", left: PAD, top: 272, width: 900 }}>
            <Build at={b(0.64)}>
              <Card label="平滑器 = 低通滤波器" accent={C.coral} pad={24} style={{ width: 860, height: 300 }}>
                <Body color={C.ink} size={FT.h2} style={{ fontFamily: FONT.serif }}>压掉快变成分，代价是相位延迟。</Body>
                <Body size={FT.body} style={{ marginTop: 12 }}>窗口越大，方差降得越多；但滞后也越大，这是一个交换。</Body>
              </Card>
            </Build>
          </div>
          <div style={{ position: "absolute", left: PAD + 900, top: 264 }}>
            <Build at={b(0.66)}>
              <StepPlot width={876} height={370} curves={["sma20"]} at={b(0.64)} title="阶跃响应：二十步到顶" legend={false} />
            </Build>
          </div>
          <div style={{ position: "absolute", left: PAD, top: 648, width: 1776 }}>
            <Build at={b(0.64)}>
              <Card accent={C.inkFaint} pad={20} style={{ width: 1776, height: 130 }}>
                <Body size={FT.body}>在价格序列上，这个延迟会直接变成买卖点；所以“平滑一点”从来不是免费的。</Body>
                <K>本片用一个可以量、可以算的判据：阶跃响应的质心</K>
              </Card>
            </Build>
          </div>
        </div>

        {/* 5 · 三个数 */}
        <div>
          <div style={{ position: "absolute", left: PAD, top: 296, width: 1776 }}>
            <Body color={C.ink} size={FT.lead}>先记住三个数字，下面逐个解释。</Body>
          </div>
          {[
            { l: "SMA20 的质心", v: "9.5", sub: "平均等待 9.5 个采样点", c: C.amber },
            { l: "线性 WMA20 的质心", v: "6.33", sub: "偏心，等待缩短", c: C.cyan },
            { l: "两种频率的倍数", v: "48×", sub: "日线 20 根 = 五分钟线 20 根 × 48", c: C.violet },
          ].map((s, i) => (
            <div key={s.l} style={{ position: "absolute", left: PAD + i * 600, top: 380, width: 560 }}>
              <Build at={b(0.84 + i * 0.02)}>
                <Card label={s.l} accent={s.c} pad={24} style={{ width: 560, height: 240 }}>
                  <div style={{ fontFamily: FONT.mono, fontSize: FT.display, color: s.c, lineHeight: 1 }}>{s.v}</div>
                  <Body size={FT.meta} style={{ marginTop: 16 }}>{s.sub}</Body>
                </Card>
              </Build>
            </div>
          ))}
          <div style={{ position: "absolute", left: PAD, top: 680, width: 1776 }}>
            <Build at={b(0.9)}>
              <Body size={FT.body} color={C.inkDim}>三个数分别对应：等权的等待、偏心的等待、窗口的单位。</Body>
            </Build>
          </div>
        </div>
      </Pages>
    </Scene>
  );
};
