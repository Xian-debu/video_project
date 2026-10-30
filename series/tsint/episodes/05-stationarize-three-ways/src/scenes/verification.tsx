import React from "react";
import { Build } from "../../design/primitives";
import { C, FONT, FT } from "../../design/tokens";
import { Body, Card, Chip, K, M, PAD, Pages, Scene, SceneHead, Stat, fmtE, fmtM, lf } from "../shared";

const Cells: React.FC<{ values: (string | number)[]; color: string; label: string; w?: number }> = ({ values, color, label, w = 132 }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
    <div style={{ width: 250, fontFamily: FONT.mono, fontSize: FT.meta, color: C.inkFaint }}>{label}</div>
    {values.map((v, i) => (
      <div key={i} style={{
        width: w, height: 64, display: "flex", alignItems: "center", justifyContent: "center",
        background: "#101823", border: "1px solid " + C.panelLine, borderTop: "2px solid " + color,
        borderRadius: 8, fontFamily: FONT.mono, fontSize: FT.mono + 6, color: C.ink,
      }}>{v}</div>
    ))}
  </div>
);

export const SVerification: React.FC = () => {
  const s = M.stats;
  const meta = M.meta;
  return (
    <Scene id="verification">
      <SceneHead id="verification" />
      <Pages id="verification" at={[0, 0.19, 0.41, 0.61, 0.81]}>
        <div>
          <div style={{ position: "absolute", left: PAD, top: 236, fontFamily: FONT.sans, fontSize: FT.h2, color: C.inkDim }}>
            先手算，四个例子都在测试里。
          </div>
          <Build at={lf("verification", 0.05)}>
            <div style={{ position: "absolute", left: PAD, top: 330 }}>
              <Cells label="原序列" values={[1, 4, 9, 16]} color={C.inkFaint} />
              <div style={{ height: 30 }} />
              <Cells label="一阶差分" values={s.manualD1} color={C.cyan} />
              <div style={{ height: 30 }} />
              <Cells label="二阶差分" values={s.manualD2} color={C.cyan} />
              <div style={{ height: 30 }} />
              <Cells label="季节差分 L=2" values={s.manualSeasonal2} color={C.amber} />
            </div>
          </Build>
          <Build at={lf("verification", 0.1)}>
            <div style={{ position: "absolute", left: PAD, top: 700, width: 1180 }}>
              <Body>周期二的季节差分把 [1,4,9,16] 变成 [8,12]：它减的是间隔一位的数，不是相邻位。</Body>
            </div>
          </Build>
        </div>

        <div>
          <div style={{ position: "absolute", left: PAD, top: 236, fontFamily: FONT.sans, fontSize: FT.h2, color: C.inkDim }}>
            真实数据：两个样本，同一个方向。
          </div>
          <Build at={lf("verification", 0.23)}>
            <div style={{ position: "absolute", left: PAD, top: 320, width: 1776 }}>
              <div style={{ display: "flex", gap: 26 }}>
                <Card label="贵州茅台 2019–2021 · 730 行" accent={C.cyan} style={{ width: 875, height: 300 }}>
                  <div style={{ display: "flex", gap: 40 }}>
                    <div><div style={{ fontFamily: FONT.mono, fontSize: 52, color: C.ink }}>{s.acfLevel.toFixed(4)}</div><K>水平 ACF</K></div>
                    <div style={{ fontFamily: FONT.mono, fontSize: 52, color: C.inkFaint }}>→</div>
                    <div><div style={{ fontFamily: FONT.mono, fontSize: 52, color: C.cyan }}>{s.acfDiff.toFixed(4)}</div><K>差分后 ACF</K></div>
                  </div>
                  <Body style={{ marginTop: 18 }}>收益均值 {fmtM(s.retMean)} 元，标准差 {fmtM(s.retSd)} 元。</Body>
                </Card>
                <Card label="平安银行 2015 · 244 行" accent={C.amber} style={{ width: 875, height: 300 }}>
                  <div style={{ display: "flex", gap: 40 }}>
                    <div><div style={{ fontFamily: FONT.mono, fontSize: 52, color: C.ink }}>{s.bullAcfLevel.toFixed(4)}</div><K>水平 ACF</K></div>
                    <div style={{ fontFamily: FONT.mono, fontSize: 52, color: C.inkFaint }}>→</div>
                    <div><div style={{ fontFamily: FONT.mono, fontSize: 52, color: C.amber }}>{s.bullAcfDiff.toFixed(4)}</div><K>差分后 ACF</K></div>
                  </div>
                  <Body style={{ marginTop: 18 }}>牛熊交替的一年，结论不变：水平接近单位根，差分回到零附近。</Body>
                </Card>
              </div>
            </div>
          </Build>
        </div>

        <div>
          <div style={{ position: "absolute", left: PAD, top: 236, fontFamily: FONT.sans, fontSize: FT.h2, color: C.inkDim }}>
            随机游走：方差从 2458 掉到 1.01，和理论值对得上。
          </div>
          <Build at={lf("verification", 0.45)}>
            <div style={{ position: "absolute", left: PAD, top: 320, width: 1776 }}>
              <div style={{ display: "flex", gap: 26 }}>
                <Stat label="水平方差" accent={C.amber} value={fmtM(s.walkVarLevel, 2)} sub="随时间线性增长，没有常数方差" style={{ width: 574, height: 260 }} valueSize={64} />
                <Stat label="差分方差" accent={C.cyan} value={fmtM(s.walkVarDiff, 4)} sub="n = 10001，seed = 42" style={{ width: 574, height: 260 }} valueSize={64} />
                <Stat label="与理论值 1 的相对误差" accent={C.violet} value="1.27%" sub="步噪声 σ=1，差分还原出 σ²" style={{ width: 574, height: 260 }} valueSize={64} />
              </div>
            </div>
          </Build>
          <Build at={lf("verification", 0.5)}>
            <div style={{ position: "absolute", left: PAD, top: 640, width: 1776 }}>
              <Body>
                ACF：水平 {s.walkAcfLevel.toFixed(4)} → 差分 {s.walkAcfDiff.toFixed(6)}。记忆被拿走，方差变成常数——两个变化同时发生，才叫改变积分阶。
              </Body>
            </div>
          </Build>
        </div>

        <div>
          <div style={{ position: "absolute", left: PAD, top: 236, fontFamily: FONT.sans, fontSize: FT.h2, color: C.inkDim }}>
            Z-score 的数字最干净：均值 0、方差 1、完全可逆。
          </div>
          <Build at={lf("verification", 0.65)}>
            <div style={{ position: "absolute", left: PAD, top: 320, width: 1776 }}>
              <div style={{ display: "flex", gap: 22 }}>
                <Stat label="μ" accent={C.violet} value={fmtM(s.mu, 2)} sub="总体口径，除以 T" style={{ width: 424, height: 200 }} valueSize={44} />
                <Stat label="σ" accent={C.violet} value={fmtM(s.sd, 2)} sub="总体口径" style={{ width: 424, height: 200 }} valueSize={44} />
                <Stat label="Σz" accent={C.cyan} value={fmtE(s.sumZ, 2)} sub="数值上就是零" style={{ width: 424, height: 200 }} valueSize={44} />
                <Stat label="Σz²" accent={C.cyan} value={fmtM(s.sumZ2, 6)} sub="等于样本数 730" style={{ width: 424, height: 200 }} valueSize={44} />
              </div>
            </div>
          </Build>
          <Build at={lf("verification", 0.7)}>
            <div style={{ position: "absolute", left: PAD, top: 570, width: 1776 }}>
              <div style={{ display: "flex", gap: 26 }}>
                <Card accent={C.cyan} style={{ width: 875 }}>
                  <K>反变换</K>
                  <div style={{ fontFamily: FONT.mono, fontSize: 40, color: C.ink, marginTop: 8 }}>max |x − (zσ+μ)| = {fmtE(s.inverseMaxErr, 2)}</div>
                </Card>
                <Card accent={C.amber} style={{ width: 875 }}>
                  <K>ACF 不变</K>
                  <div style={{ fontFamily: FONT.mono, fontSize: 40, color: C.ink, marginTop: 8 }}>{s.acfZ.toFixed(6)} vs {s.acfLevel.toFixed(6)}</div>
                </Card>
              </div>
            </div>
          </Build>
          <Build at={lf("verification", 0.75)}>
            <div style={{ position: "absolute", left: PAD, top: 790, width: 1776 }}>
              <Chip color={C.coral}>差 {fmtE(s.acfDelta, 2)}：标准化没有改变任何时间结构</Chip>
            </div>
          </Build>
        </div>

        <div>
          <div style={{ position: "absolute", left: PAD, top: 236, fontFamily: FONT.sans, fontSize: FT.h2, color: C.inkDim }}>
            对数治异方差；证据三十一条，全部通过。
          </div>
          <Build at={lf("verification", 0.85)}>
            <div style={{ position: "absolute", left: PAD, top: 320, width: 1776 }}>
              <div style={{ display: "flex", gap: 26 }}>
                <Card label="corr(水平, 局部波动)" accent={C.amber} style={{ width: 574, height: 250 }}>
                  <div style={{ fontFamily: FONT.mono, fontSize: 56, color: C.ink }}>{fmtM(s.corrLevel, 4)}</div>
                </Card>
                <Card label="corr(log, 局部波动)" accent={C.cyan} style={{ width: 574, height: 250 }}>
                  <div style={{ fontFamily: FONT.mono, fontSize: 56, color: C.ink }}>{fmtM(s.corrLog, 4)}</div>
                </Card>
                <Card label="方差比 · 5 日 / 1 日" accent={C.violet} style={{ width: 574, height: 250 }}>
                  <div style={{ fontFamily: FONT.mono, fontSize: 56, color: C.ink }}>{fmtM(s.varianceRatio5, 4)}</div>
                </Card>
              </div>
            </div>
          </Build>
          <Build at={lf("verification", 0.9)}>
            <div style={{ position: "absolute", left: PAD, top: 610, width: 1776 }}>
              <div style={{ display: "flex", gap: 26 }}>
                <Card accent={C.coral} style={{ width: 875 }}>
                  <K>证据覆盖</K>
                  <Body style={{ marginTop: 8 }}>手算 {meta.checks.manual} 条、真实数据 {meta.checks.data} 条、合成 {meta.checks.synthetic} 条，共 {meta.checks.total} 条，失败 {meta.checks.failed} 条。</Body>
                </Card>
                <Card accent={C.cyan} style={{ width: 875 }}>
                  <K>验收标准</K>
                  <Body style={{ marginTop: 8 }}>画面上的每个数字都能回到一条检查。不是看起来对，是能复现。</Body>
                </Card>
              </div>
            </div>
          </Build>
        </div>
      </Pages>
    </Scene>
  );
};
