import React from "react";
import { Build } from "../../design/primitives";
import { C, FONT, FT } from "../../design/tokens";
import { Body, Card, Chip, K, Mono, PAD, Pages, Scene, SceneHead, SmoothingPlot, StepPlot, fmtM, lf, M } from "../shared";

/** 直觉：三条 SMA 的形状；SES 与 SMA 的差别；阶跃响应；换算的后果。 */
export const SIntuition: React.FC = () => {
  const id = "intuition";
  const b = (k: number) => lf(id, k);
  const dc = M.dailyCompare;
  const w = M.window;
  const n = w.close.length;
  return (
    <Scene id={id}>
      <SceneHead id={id} />
      <Pages id={id} at={[0, 0.3, 0.55, 0.8]}>
        {/* 1 · 三条 SMA */}
        <div>
          <div style={{ position: "absolute", left: PAD, top: 236 }}>
            <Build at={b(0.01)}>
              <SmoothingPlot width={1200} height={440} shows={["close", "sma5", "sma20", "sma60"]} at={b(0.03)} title="最后一百二十个交易日 · 三条简单移动平均" padL={86} />
            </Build>
          </div>
          <div style={{ position: "absolute", left: PAD + 1240, top: 236, width: 536 }}>
            <Build at={b(0.04)}>
              <Card label="末值" accent={C.amber} pad={20} style={{ width: 536, height: 200 }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <div><Mono size={FT.h2} color={C.amber}>{fmtM(dc.sma20_last, 2)}</Mono><Body size={FT.micro}>SMA20</Body></div>
                  <div><Mono size={FT.h2} color={C.inkDim}>{fmtM(dc.close_last, 2)}</Mono><Body size={FT.micro}>收盘</Body></div>
                </div>
                <Body size={FT.meta} style={{ marginTop: 12 }}>均线还在下面：它在等这段上涨走完。</Body>
              </Card>
            </Build>
            <Build at={b(0.07)}>
              <Card label="窗口方向" accent={C.violet} pad={20} style={{ width: 536, marginTop: 16 }}>
                <Body size={FT.body}>窗口越小越贴价格，越大越钝；三条线是同一条路，只是走得快慢不同。</Body>
                <K style={{ display: "block", marginTop: 10 }}>N=5 的线几乎贴着收盘</K>
              </Card>
            </Build>
          </div>
          <div style={{ position: "absolute", left: PAD, top: 716, width: 1776 }}>
            <Build at={b(0.1)}>
              <Body size={FT.meta} color={C.inkFaint}>{w.start} → {w.end} · 前复权收盘价 · 共 {n} 个点</Body>
            </Build>
          </div>
        </div>

        {/* 2 · SMA vs SES */}
        <div>
          <div style={{ position: "absolute", left: PAD, top: 236 }}>
            <Build at={b(0.32)}>
              <SmoothingPlot width={1200} height={440} shows={["close", "sma20", "ses_2_21"]} at={b(0.34)} title="同一段行情：等权 SMA20 与 SES(2/21)" padL={86} />
            </Build>
          </div>
          <div style={{ position: "absolute", left: PAD + 1240, top: 236, width: 536 }}>
            <Build at={b(0.35)}>
              <Card label="相关系数" accent={C.cyan} pad={20} style={{ width: 536, height: 176 }}>
                <Mono size={FT.h2} color={C.cyan}>{fmtM(dc.corr_sma20_ses21, 4)}</Mono>
                <Body size={FT.meta} style={{ marginTop: 8 }}>相关系数只问形状；两条线看起来几乎一样。</Body>
              </Card>
            </Build>
            <Build at={b(0.38)}>
              <Card label="但差值不小" accent={C.coral} pad={20} style={{ width: 536, marginTop: 14 }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <div><Mono size={FT.h2} color={C.coral}>{fmtM(dc.max_abs_diff, 1)}</Mono><Body size={FT.micro}>最大差 · 元</Body></div>
                  <div><Mono size={FT.h2} color={C.amber}>{fmtM(dc.mean_abs_diff, 2)}</Mono><Body size={FT.micro}>平均差 · 元</Body></div>
                </div>
                <Body size={FT.meta} style={{ marginTop: 10 }}>同样的质心，形状不同，误差落在不同的地方。</Body>
              </Card>
            </Build>
            <Build at={b(0.41)}>
              <Body size={FT.meta} style={{ marginTop: 14 }}>相关系数高，不代表能互相替代。</Body>
            </Build>
          </div>
        </div>

        {/* 3 · 阶跃 */ }
        <div>
          <div style={{ position: "absolute", left: PAD, top: 230 }}>
            <Build at={b(0.57)}>
              <StepPlot width={1180} height={420} curves={["sma20", "ses_2_21"]} at={b(0.59)} marks={["half", "ninetyFive"]} area="sma20" title="阶跃响应 · 五十个零之后突然跳到一" />
            </Build>
          </div>
          <div style={{ position: "absolute", left: PAD + 1220, top: 236, width: 556 }}>
            <Build at={b(0.6)}>
              <Card label="爬到一半" accent={C.amber} pad={20} style={{ width: 556, height: 176 }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <div><Mono size={FT.h2} color={C.amber}>10</Mono><Body size={FT.micro}>SMA20 · 步</Body></div>
                  <div><Mono size={FT.h2} color={C.cyan}>6</Mono><Body size={FT.micro}>SES(2/21) · 步</Body></div>
                </div>
                <Body size={FT.meta} style={{ marginTop: 10 }}>SES 起步更冲：最早的几个点权重大。</Body>
              </Card>
            </Build>
            <Build at={b(0.63)}>
              <Card label="爬到 95%" accent={C.violet} pad={20} style={{ width: 556, marginTop: 14 }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <div><Mono size={FT.h2} color={C.violet}>18</Mono><Body size={FT.micro}>SMA20 · 步</Body></div>
                  <div><Mono size={FT.h2} color={C.cyan}>29</Mono><Body size={FT.micro}>SES(2/21) · 步</Body></div>
                </div>
                <Body size={FT.meta} style={{ marginTop: 10 }}>SES 的尾巴更长：它有记忆，但线性窗口有硬截断。</Body>
              </Card>
            </Build>
            <Build at={b(0.66)}>
              <K style={{ display: "block", marginTop: 14 }}>质心一样，形状不同：一个陡，一个长尾</K>
            </Build>
          </div>
        </div>

        {/* 4 · 换算的后果 */}
        <div>
          <div style={{ position: "absolute", left: PAD, top: 268, width: 1776 }}>
            <Body color={C.ink} size={FT.lead}>α 和 N 不是两套系统：定住质心，它们一一对应。</Body>
          </div>
          <div style={{ position: "absolute", left: PAD, top: 356, width: 860 }}>
            <Build at={b(0.82)}>
              <Card label="α = 0.5" accent={C.coral} pad={24} style={{ width: 860, height: 250 }}>
                <Mono size={FT.h2} color={C.coral}>N = 2 / 0.5 - 1 = 3</Mono>
                <Body size={FT.body} style={{ marginTop: 14 }}>它的等效窗口只有三个点；拿它去和 N=20 比，等于拿短跑选手比马拉松。</Body>
                <Chip color={C.coral}>不是更灵敏，是尺子不同</Chip>
              </Card>
            </Build>
          </div>
          <div style={{ position: "absolute", left: PAD + 900, top: 356, width: 876 }}>
            <Build at={b(0.85)}>
              <Card label="对照" accent={C.amber} pad={24} style={{ width: 876, height: 250 }}>
                {[["SES(0.5)", 1.0, C.coral], ["SMA20", 9.5, C.amber], ["SES(2/21)", 9.5, C.cyan]].map(([lab, v, c]) => (
                  <div key={String(lab)} style={{ display: "flex", alignItems: "center", gap: 16, padding: "6px 0" }}>
                    <Mono size={FT.meta} color={C.inkDim} style={{ width: 130 }}>{lab as string}</Mono>
                    <div style={{ height: 14, width: (v as number) * 44, background: c as string, borderRadius: 3 }} />
                    <Mono size={FT.meta} color={c as string}>{(v as number).toFixed(1)}</Mono>
                  </div>
                ))}
                <Body size={FT.meta} style={{ marginTop: 12 }}>质心是横轴；只有质心对齐，比较才公平。</Body>
              </Card>
            </Build>
          </div>
        </div>
      </Pages>
    </Scene>
  );
};
