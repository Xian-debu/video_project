import React from "react";
import { Build } from "../../design/primitives";
import { C, FONT, FT } from "../../design/tokens";
import { Body, Card, Chip, K, LinePlot, M, PAD, Pages, Scene, SceneHead, Stat, fmtInt, fmtM, lf } from "../shared";

export const SProblem: React.FC = () => {
  const d = M.series;
  const s = M.stats;
  return (
    <Scene id="problem">
      <SceneHead id="problem" />
      <Pages id="problem" at={[0, 0.27, 0.53, 0.77]}>
        <div>
          <div style={{ position: "absolute", left: PAD, top: 236, fontFamily: FONT.sans, fontSize: FT.h2, color: C.inkDim }}>
            均值、方差、自相关，都得是常数；这条价格曲线一条都不满足。
          </div>
          <Build at={lf("problem", 0.06)}>
            <div style={{ position: "absolute", left: PAD, top: 300, width: 1180 }}>
              <LinePlot series={[{ values: d.close, color: C.amber, name: "收盘价" }]} width={1180} height={460}
                title="价格：均值在移动，方差在放大" yFmt={(v) => v.toFixed(0)} at={lf("problem", 0.08)} />
            </div>
          </Build>
          <Build at={lf("problem", 0.1)}>
            <div style={{ position: "absolute", left: PAD + 1184, top: 300, width: 592 }}>
              <Stat label="水平 ACF" accent={C.amber} value={s.acfLevel.toFixed(6)} sub="几乎是单位根" style={{ height: 196 }} />
              <Stat label="差分后 ACF" accent={C.cyan} value={s.acfDiff.toFixed(6)} sub="记忆被拿走" style={{ height: 196, marginTop: 18 }} />
              <Body size={FT.meta} style={{ marginTop: 16 }}>差分后收益均值 {fmtM(s.retMean)} 元，标准差 {fmtM(s.retSd)} 元。</Body>
            </div>
          </Build>
        </div>

        <div>
          <div style={{ position: "absolute", left: PAD, top: 236, fontFamily: FONT.sans, fontSize: FT.h2, color: C.inkDim }}>
            换一个样本、换一年，方向相同。
          </div>
          <Build at={lf("problem", 0.31)}>
            <div style={{ position: "absolute", left: PAD, top: 320, display: "flex", gap: 26 }}>
              <Card label="样本 A · 贵州茅台 2019–2021" accent={C.cyan} style={{ width: 574, height: 330 }}>
                <div style={{ fontFamily: FONT.mono, fontSize: 44, color: C.ink }}>{s.acfLevel.toFixed(4)}</div>
                <K>水平 ACF · 730 行</K>
                <div style={{ fontFamily: FONT.mono, fontSize: 44, color: C.cyan, marginTop: 22 }}>{s.acfDiff.toFixed(4)}</div>
                <K>差分后 ACF</K>
              </Card>
              <Card label="样本 B · 平安银行 2015 牛熊段" accent={C.amber} style={{ width: 574, height: 330 }}>
                <div style={{ fontFamily: FONT.mono, fontSize: 44, color: C.ink }}>{s.bullAcfLevel.toFixed(4)}</div>
                <K>水平 ACF · 244 行</K>
                <div style={{ fontFamily: FONT.mono, fontSize: 44, color: C.amber, marginTop: 22 }}>{s.bullAcfDiff.toFixed(4)}</div>
                <K>差分后 ACF</K>
              </Card>
              <div style={{ width: 574, paddingTop: 22 }}>
                <Body>两个样本、两个年份、两种行情。水平序列都接近单位根，差分后都回到零附近。</Body>
                <Body style={{ marginTop: 18 }}>所以这不是某只票的特殊性，是价格这个量本身的性质。</Body>
              </div>
            </div>
          </Build>
        </div>

        <div>
          <div style={{ position: "absolute", left: PAD, top: 236, fontFamily: FONT.sans, fontSize: FT.h2, color: C.inkDim }}>
            一个更干净的例子：随机游走，一万零一个点，种子四十二。
          </div>
          <Build at={lf("problem", 0.57)}>
            <div style={{ position: "absolute", left: PAD, top: 300, width: 900 }}>
              <LinePlot series={[{ values: d.walk, color: C.amber, name: "水平" }]} width={900} height={250}
                title="水平：方差随时间线性增长" yFmt={(v) => v.toFixed(0)} at={lf("problem", 0.58)} />
            </div>
          </Build>
          <Build at={lf("problem", 0.6)}>
            <div style={{ position: "absolute", left: PAD, top: 570, width: 900 }}>
              <LinePlot series={[{ values: d.walkDiff, color: C.cyan, name: "差分" }]} width={900} height={250}
                title="差分：回到步长噪声" yFmt={(v) => v.toFixed(1)} zeroLine at={lf("problem", 0.62)} />
            </div>
          </Build>
          <Build at={lf("problem", 0.63)}>
            <div style={{ position: "absolute", left: PAD + 940, top: 300, width: 856 }}>
              <div style={{ display: "flex", gap: 18 }}>
                <Stat label="水平方差" accent={C.amber} value={fmtM(s.walkVarLevel, 2)} sub="而且随时间增长" style={{ width: 419, height: 200 }} />
                <Stat label="差分方差" accent={C.cyan} value={fmtM(s.walkVarDiff, 4)} sub="理论值 1（步噪声 σ=1）" style={{ width: 419, height: 200 }} />
              </div>
              <Card accent={C.coral} style={{ marginTop: 18 }}>
                <K>常见错误</K>
                <Body style={{ marginTop: 8 }}>
                  白噪声做差分，方差才是 2σ²。随机游走差分回来的是步长噪声，方差就是 σ²。实测 1.0127，对得上 1。
                </Body>
              </Card>
            </div>
          </Build>
        </div>

        <div>
          <div style={{ position: "absolute", left: PAD, top: 236, fontFamily: FONT.sans, fontSize: FT.h2, color: C.inkDim }}>
            第三种病：方差本身在变，叫异方差。
          </div>
          <Build at={lf("problem", 0.81)}>
            <div style={{ position: "absolute", left: PAD, top: 300, width: 900 }}>
              <LinePlot series={[{ values: d.hetero, color: C.amber, name: "乘性噪声" }]} width={900} height={470}
                title="水平：波动幅度跟着水平走" yFmt={(v) => v.toFixed(0)} at={lf("problem", 0.82)} />
            </div>
          </Build>
          <Build at={lf("problem", 0.84)}>
            <div style={{ position: "absolute", left: PAD + 940, top: 300, width: 856 }}>
              <LinePlot series={[{ values: d.logHetero, color: C.cyan, name: "取对数" }]} width={856} height={276}
                title="取对数：波动幅度被拉平" yFmt={(v) => v.toFixed(1)} at={lf("problem", 0.85)} />
              <div style={{ display: "flex", gap: 18, marginTop: 16 }}>
                <Stat label="corr(水平, 局部波动)" accent={C.amber} value={fmtM(s.corrLevel, 4)} sub="正相关，异方差明显" style={{ width: 440, height: 170 }} />
                <Stat label="corr(log, 局部波动)" accent={C.cyan} value={fmtM(s.corrLog, 4)} sub="压到 0.37，方向反过来" style={{ width: 440, height: 170 }} />
              </div>
              <div style={{ marginTop: 12 }}>
                <Chip color={C.amber}>对数治方差，不治趋势</Chip>
              </div>
            </div>
          </Build>
        </div>
      </Pages>
    </Scene>
  );
};
