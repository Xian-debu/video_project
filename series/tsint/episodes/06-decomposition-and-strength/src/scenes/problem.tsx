import React from "react";
import { Build } from "../../design/primitives";
import { C, FONT, FT } from "../../design/tokens";
import { Body, Card, Chip, K, LinePlot, M, PAD, Pages, Scene, SceneHead, Stat, fmtF, lf } from "../shared";

export const SProblem: React.FC = () => {
  const d = M.series;
  const s = M.stats;
  const book = [
    { t: "趋势强度", a: "0.998", b: "趋势强度", c: "0.9981" },
    { t: "季节强度", a: "0.210", b: "季节强度", c: "0.0083" },
    { t: "趋势强度", a: "0.944", b: "季节强度", c: "0.0139" },
    { t: "季节强度", a: "0.441", b: "证据条数", c: "39" },
  ];
  return (
    <Scene id="problem">
      <SceneHead id="problem" />
      <Pages id="problem" at={[0, 0.34, 0.64]}>
        <div>
          <div style={{ position: "absolute", left: PAD, top: 236, fontFamily: FONT.sans, fontSize: FT.h2, color: C.inkDim }}>
            书里 p.25 有一组数；照做，复现不出来。
          </div>
          <Build at={lf("problem", 0.04)}>
            <div style={{ position: "absolute", left: PAD, top: 310, width: 760 }}>
              <Card label="书里给的四个数（C 级引用）" accent={C.coral} style={{ height: 300 }}>
                <div style={{ display: "flex", gap: 28 }}>
                  <div>
                    <K>第一组</K>
                    <div style={{ fontFamily: FONT.mono, fontSize: 38, color: C.inkDim, marginTop: 8 }}>0.998 / 0.210</div>
                    <div style={{ fontFamily: FONT.mono, fontSize: 38, color: C.inkDim, marginTop: 8 }}>0.944 / 0.441</div>
                  </div>
                  <div style={{ width: 300 }}>
                    <Body size={FT.meta}>周期、端点、数据窗口三样都没给全。这四个数只能当引用，不能当结论。</Body>
                    <Chip color={C.coral}>C 级</Chip>
                  </div>
                </div>
              </Card>
            </div>
          </Build>
          <Build at={lf("problem", 0.1)}>
            <div style={{ position: "absolute", left: PAD + 800, top: 310, width: 976 }}>
              <Card label="本仓复现（茅台 · m=5 · 730 天）" accent={C.cyan} style={{ height: 300 }}>
                <div style={{ display: "flex", gap: 60 }}>
                  <div>
                    <K>趋势强度</K>
                    <div style={{ fontFamily: FONT.mono, fontSize: 54, color: C.cyan }}>{fmtF(s.decomp.maotai.trend, 4)}</div>
                  </div>
                  <div>
                    <K>季节强度</K>
                    <div style={{ fontFamily: FONT.mono, fontSize: 54, color: C.amber }}>{fmtF(s.decomp.maotai.seasonal, 4)}</div>
                  </div>
                </div>
                <Body size={FT.meta} style={{ marginTop: 14 }}>季节强度差了二十五倍：0.210 对 0.0083。</Body>
              </Card>
            </div>
          </Build>
          <Build at={lf("problem", 0.18)}>
            <div style={{ position: "absolute", left: PAD, top: 650, width: 1776, display: "flex", gap: 26 }}>
              <Card accent={C.amber} style={{ width: 574, height: 200 }}><K>原因 1</K><Body style={{ marginTop: 8 }}>书里没说周期取多少。周期 5 和周期 21，是两个完全不同的季节。</Body></Card>
              <Card accent={C.amber} style={{ width: 574, height: 200 }}><K>原因 2</K><Body style={{ marginTop: 8 }}>书里没说端点怎么处理。移动平均吃掉的两端算不算进方差，结果差很多。</Body></Card>
              <Card accent={C.amber} style={{ width: 574, height: 200 }}><K>原因 3</K><Body style={{ marginTop: 8 }}>书里没给出数据窗口。窗口一换，趋势和季节的方差比都会变。</Body></Card>
            </div>
          </Build>
          <Build at={lf("problem", 0.26)}>
            <div style={{ position: "absolute", left: PAD, top: 890, fontFamily: FONT.sans, fontSize: FT.meta, color: C.inkFaint }}>
              结论：这四个数是引用，不是可复现的测量；本片所有数字都进证据文件。
            </div>
          </Build>
        </div>

        <div>
          <div style={{ position: "absolute", left: PAD, top: 236, fontFamily: FONT.sans, fontSize: FT.h2, color: C.inkDim }}>
            分解给出的是一张体检报告：趋势多强，季节多强，残差还剩多少。
          </div>
          <Build at={lf("problem", 0.38)}>
            <div style={{ position: "absolute", left: PAD, top: 300 }}>
              <LinePlot
                series={[
                  { values: d.maotai.close, color: C.amber, name: "收盘价" },
                  { values: d.maotai.trend, color: C.cyan, name: "趋势项 T" },
                ]}
                width={1120} height={460} title="茅台 730 天：价格 与 5 日中心化移动平均" yFmt={(v) => v.toFixed(0)} at={lf("problem", 0.4)}
              />
            </div>
          </Build>
          <Build at={lf("problem", 0.44)}>
            <div style={{ position: "absolute", left: PAD + 1184, top: 300, width: 592 }}>
              <Stat label="趋势解释了" accent={C.cyan} value={fmtF(s.decomp.maotai.trend, 4)} sub="去季节之后，99.8% 的方差不在了" style={{ height: 210 }} />
              <Stat label="季节解释了" accent={C.amber} value={fmtF(s.decomp.maotai.seasonal, 4)} sub="去趋势之后，只剩不到 1%" style={{ height: 210, marginTop: 18 }} />
            </div>
          </Build>
          <Build at={lf("problem", 0.5)}>
            <div style={{ position: "absolute", left: PAD, top: 790, fontFamily: FONT.sans, fontSize: FT.body, color: C.inkDim }}>
              两条线几乎重合，残差是价格里那一点日内的噪声；季节项相对两千元的价格可以忽略。
            </div>
          </Build>
        </div>

        <div>
          <div style={{ position: "absolute", left: PAD, top: 236, fontFamily: FONT.sans, fontSize: FT.h2, color: C.inkDim }}>
            再看五分钟线：一天四十八根，五天二百四十根。
          </div>
          <Build at={lf("problem", 0.68)}>
            <div style={{ position: "absolute", left: PAD, top: 300, width: 1120 }}>
              <LinePlot series={[{ values: d.minute.close, color: C.amber, name: "五分钟收盘价" }]} width={1120} height={380} title="茅台 5 分钟线 · 2026-08-10 → 08-14" yFmt={(v) => v.toFixed(0)} at={lf("problem", 0.7)} />
            </div>
          </Build>
          <Build at={lf("problem", 0.72)}>
            <div style={{ position: "absolute", left: PAD + 1184, top: 300, width: 592 }}>
              <Stat label="趋势强度" accent={C.cyan} value={fmtF(s.decomp.minute.trend, 4)} sub="周期 48 · 有效点 192" style={{ height: 170 }} />
              <Stat label="季节强度" accent={C.amber} value={fmtF(s.decomp.minute.seasonal, 4)} sub="48 个相位，每个相位 4 个观测" style={{ height: 170, marginTop: 18 }} />
            </div>
          </Build>
          <Build at={lf("problem", 0.8)}>
            <div style={{ position: "absolute", left: PAD, top: 700, width: 1120 }}>
              <LinePlot series={[{ values: d.profile.value, color: C.violet, name: "季节项 S（48 相位）" }]} width={1120} height={250} title="日内季节形状：早盘低，午后高" zeroLine yFmt={(v) => v.toFixed(1)} at={lf("problem", 0.72)} />
            </div>
          </Build>
          <Build at={lf("problem", 0.86)}>
            <div style={{ position: "absolute", left: PAD + 1184, top: 700, width: 592 }}>
              <Card accent={C.violet} style={{ height: 250 }}>
                <K>同一个标的，两个频率</K>
                <Body style={{ marginTop: 10 }}>日线趋势 0.998、季节 0.008；五分钟趋势 0.675、季节 0.187。采样频率一换，两个数都变。</Body>
              </Card>
            </div>
          </Build>
        </div>
      </Pages>
    </Scene>
  );
};
