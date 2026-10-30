import React from "react";
import { Build } from "../../design/primitives";
import { C, FONT, FT } from "../../design/tokens";
import { Card, Body, Mono, K, Stat, PAD, Pages, Scene, SceneHead, WindowPlot, GapTimeline, fmtF, fmtInt, M, lf } from "../shared";

/** 直觉：2009 年一段上涨行情的三种填法，以及六年断档的形状。 */
export const SIntuition: React.FC = () => {
  const id = "intuition";
  const b = (k: number) => lf(id, k);
  const w = M.window;
  const w20 = M.window20;
  return (
    <Scene id={id}>
      <SceneHead id={id} />
      <Pages id={id} at={[0, 0.42, 0.72]}>
        {/* 1 · 9 个点 */}
        <div>
          <div style={{ position: "absolute", left: PAD, top: 268, width: 1200 }}>
            <Build at={b(0.02)}>
              <Card accent={C.cyan} pad={16} style={{ width: 1200, height: 610 }}>
                <WindowPlot w={w} width={1160} height={570} shows={["linear", "locf", "mean"]} at={b(0.04)} />
              </Card>
            </Build>
          </div>
          <div style={{ position: "absolute", left: PAD + 1230, top: 268, width: 546 }}>
            <Build at={b(0.08)}>
              <Stat label="窗口" value="91 个交易日" accent={C.cyan} style={{ width: 546, height: 130 }}
                sub="2008-12-29 → 2009-05-15 · 前复权 57.43 → 61.26" />
            </Build>
            <Build at={b(0.12)}>
              <Stat label="遮挡" value="9 个点" accent={C.violet} style={{ width: 546, height: 130, marginTop: 14 }}
                sub="约 5% · 只在窗口内部" />
            </Build>
            <Build at={b(0.16)}>
              <Card label="三种形状" accent={C.coral} pad={18} style={{ width: 546, height: 404, marginTop: 14 }}>
                <Body size={FT.body}><Mono color={C.cyan} size={FT.body}>线性</Mono>：把缺口连成直线，这段行情里最贴近。</Body>
                <Body size={FT.body} style={{ marginTop: 10 }}><Mono color={C.amber} size={FT.body}>LOCF</Mono>：阶梯，只在观测点跳一下，中间是平的。</Body>
                <Body size={FT.body} style={{ marginTop: 10 }}><Mono color={C.coral} size={FT.body}>均值</Mono>：全序列均价 {fmtF(M.window.mean[M.window.maskedLocal[0]], 2)}，高出这段行情八倍。</Body>
                <K style={{ display: "block", marginTop: 14 }}>有趋势的行情利于线性插值；震荡行情结论会变</K>
              </Card>
            </Build>
          </div>
        </div>

        {/* 2 · 23 个点 */}
        <div>
          <div style={{ position: "absolute", left: PAD, top: 268, width: 1200 }}>
            <Build at={b(0.44)}>
              <Card accent={C.amber} pad={16} style={{ width: 1200, height: 610 }}>
                <WindowPlot w={w20} width={1160} height={570} shows={["linear", "locf", "mean"]} at={b(0.46)} title="同一窗口 · 遮挡 20% · 前复权价" />
              </Card>
            </Build>
          </div>
          <div style={{ position: "absolute", left: PAD + 1230, top: 268, width: 546 }}>
            <Build at={b(0.5)}>
              <Stat label="同一窗口，遮 20%" value="23 个点" accent={C.amber} style={{ width: 546, height: 130 }}
                sub="遮挡越多，常数填充离真值越远" />
            </Build>
            <Build at={b(0.54)}>
              <Card label="看点" accent={C.inkFaint} pad={18} style={{ width: 546, height: 300, marginTop: 14 }}>
                <Body size={FT.body}>均值线不动，但真值在走；缺口越长，水平线错得越久。</Body>
                <Body size={FT.body} style={{ marginTop: 10 }}>LOCF 的平台变长，误差累积。</Body>
                <Body size={FT.body} style={{ marginTop: 10 }}>线性仍贴着走势，但它假设直线路径。</Body>
                <K style={{ display: "block", marginTop: 14 }}>所以看图不能只看一张</K>
              </Card>
            </Build>
            <Build at={b(0.58)}>
              <Card accent={C.violet} pad={14} style={{ width: 546, marginTop: 14 }}>
                <K color={C.violet}>下一场验证：价格 MAE 与收益 MAE 会给出不同的排名</K>
              </Card>
            </Build>
          </div>
        </div>

        {/* 3 · 六年缺口 */}
        <div>
          <div style={{ position: "absolute", left: PAD, top: 268, width: 1776 }}>
            <Body color={C.ink} size={FT.lead}>再看那个六年的缺口：三种填法，都在编造历史。</Body>
          </div>
          <div style={{ position: "absolute", left: PAD, top: 350, width: 1560 }}>
            <Build at={b(0.75)}>
              <GapTimeline width={1500} height={300} at={b(0.77)} />
            </Build>
          </div>
          <div style={{ position: "absolute", left: PAD + 1560, top: 350, width: 216 }}>
            <Build at={b(0.8)}>
              <Card accent={C.coral} pad={14} style={{ width: 216 }}>
                <Mono size={FT.num} color={C.coral}>{fmtInt(M.suspension.gapDays)}</Mono>
                <Body size={FT.meta} style={{ marginTop: 4 }}>天</Body>
              </Card>
            </Build>
          </div>
          <div style={{ position: "absolute", left: PAD, top: 680, width: 1776 }}>
            {[
              { t: "LOCF → 常数", s: "最后一个收盘价，带六年" },
              { t: "均值 → 常数", s: "整段只有一个数" },
              { t: "线性 → 直线", s: "把六年画成一条斜线" },
            ].map((c, i) => (
              <div key={c.t} style={{ position: "absolute", left: i * 600, top: 0, width: 560 }}>
                <Build at={b(0.84 + i * 0.02)}>
                  <Card label={"填法 " + (i + 1)} accent={C.inkFaint} pad={18} style={{ width: 560, height: 130 }}>
                    <Body color={C.ink} size={FT.h2} style={{ fontFamily: FONT.serif }}>{c.t}</Body>
                    <K style={{ display: "block", marginTop: 8 }}>{c.s}</K>
                  </Card>
                </Build>
              </div>
            ))}
          </div>
          <div style={{ position: "absolute", left: PAD, top: 830, width: 1776 }}>
            <Build at={b(0.93)}>
              <Body size={FT.body} color={C.inkDim}>区别只是编造的形状不同。所以第一件事是判断缺失机制：随机缺失、停牌，还是整段没有数据。</Body>
            </Build>
          </div>
        </div>
      </Pages>
    </Scene>
  );
};
