import React from "react";
import { Build } from "../../design/primitives";
import { C, FONT, FT } from "../../design/tokens";
import { Body, Card, Chip, K, LinePlot, M, PAD, Pages, Scene, SceneHead, Stat, fmtF, fmtInt, lf } from "../shared";

const Part: React.FC<{ sym: string; name: string; note: string; color: string; width: number }> = ({ sym, name, note, color, width }) => (
  <Card label={name} accent={color} style={{ width, height: 260 }}>
    <div style={{ fontFamily: FONT.serif, fontSize: 62, color, lineHeight: 1.05 }}>{sym}</div>
    <Body size={FT.meta} style={{ marginTop: 12 }}>{note}</Body>
  </Card>
);

export const SOpen: React.FC = () => {
  const d = M.series;
  const s = M.stats;
  const seasonLo = Math.min(...d.maotai.seasonal);
  const seasonHi = Math.max(...d.maotai.seasonal);
  void seasonLo;
  return (
    <Scene id="open">
      <SceneHead id="open" />
      <Pages id="open" at={[0, 0.16, 0.36, 0.6, 0.8]}>
        <div>
          <div style={{ position: "absolute", left: PAD, top: 236, fontFamily: FONT.sans, fontSize: FT.h2, color: C.inkDim }}>
            一条序列里混着三种东西，拆开才谈得上分别描述。
          </div>
          <Build at={lf("open", 0.05)}>
            <div style={{ position: "absolute", left: PAD, top: 318, display: "flex", gap: 26 }}>
              <Part sym="T" name="趋势" note="中心化移动平均；偶数阶首末为 1/(2m)" color={C.cyan} width={574} />
              <Part sym="S" name="季节" note="相位均值；同一位置跨周期共享" color={C.amber} width={574} />
              <Part sym="R" name="残差" note="剩下的部分；两端没有定义" color={C.violet} width={574} />
            </div>
          </Build>
          <Build at={lf("open", 0.11)}>
            <div style={{ position: "absolute", left: PAD, top: 640, width: 1776, background: C.panel, border: "1px solid " + C.panelLine, borderLeft: "3px solid " + C.cyan, borderRadius: 12, padding: "20px 26px" }}>
              <div style={{ fontFamily: FONT.sans, fontSize: FT.h2, color: C.ink }}>这一集做三件事：写清定义、算出两个强度、再说清它们不能干什么。</div>
              <K style={{ display: "block", marginTop: 8 }}>经典分解 · 式 (2.1) · 式 (2.2)</K>
            </div>
          </Build>
        </div>

        <div>
          <div style={{ position: "absolute", left: PAD, top: 236, fontFamily: FONT.sans, fontSize: FT.h2, color: C.inkDim }}>
            贵州茅台，二零一九到二零二一；七百三十个交易日，周期取五。
          </div>
          <Build at={lf("open", 0.2)}>
            <div style={{ position: "absolute", left: PAD, top: 300 }}>
              <LinePlot
                series={[
                  { values: d.maotai.close, color: C.amber, name: "收盘价" },
                  { values: d.maotai.trend, color: C.cyan, name: "趋势项 T" },
                ]}
                width={1120} height={460} title="前复权收盘价 与 中心化 5 日移动平均" yFmt={(v) => v.toFixed(0)} at={lf("open", 0.22)}
              />
            </div>
          </Build>
          <Build at={lf("open", 0.26)}>
            <div style={{ position: "absolute", left: PAD + 1184, top: 300, width: 592 }}>
              <Stat label="趋势强度" accent={C.cyan} value={fmtF(s.decomp.maotai.trend, 4)} sub="1 − var(R)/var(X−S)" valueColor={C.cyan} style={{ height: 210 }} />
              <Stat label="季节强度" accent={C.amber} value={fmtF(s.decomp.maotai.seasonal, 4)} sub="1 − var(R)/var(X−T)" valueColor={C.amber} style={{ height: 210, marginTop: 18 }} />
            </div>
          </Build>
          <Build at={lf("open", 0.3)}>
            <div style={{ position: "absolute", left: PAD, top: 790, fontFamily: FONT.sans, fontSize: FT.body, color: C.inkDim }}>
              两条线几乎重合；季节项在 {fmtF(seasonLo, 2)} 到 +{fmtF(seasonHi, 2)} 元之间摆动。
            </div>
          </Build>
        </div>

        <div>
          <div style={{ position: "absolute", left: PAD, top: 236, fontFamily: FONT.sans, fontSize: FT.h2, color: C.inkDim }}>
            换一个样本：平安银行，同样七百三十天，周期二十一。
          </div>
          <Build at={lf("open", 0.4)}>
            <div style={{ position: "absolute", left: PAD, top: 318, width: 760 }}>
              <LinePlot series={[{ values: d.pingan.close, color: C.amber, name: "收盘价" }]} width={760} height={320} title="平安银行 2019-01-02 → 2021-12-31" yFmt={(v) => v.toFixed(0)} at={lf("open", 0.42)} />
            </div>
          </Build>
          <Build at={lf("open", 0.44)}>
            <div style={{ position: "absolute", left: PAD + 800, top: 318, width: 976, display: "flex", gap: 26 }}>
              <Stat label="趋势强度" accent={C.cyan} value={fmtF(s.decomp.pingan.trend, 4)} sub="周期 21 · 有效点 710" style={{ width: 475, height: 210 }} />
              <Stat label="季节强度" accent={C.amber} value={fmtF(s.decomp.pingan.seasonal, 4)} sub="周期 21 · 有效点 710" style={{ width: 475, height: 210 }} />
            </div>
          </Build>
          <Build at={lf("open", 0.48)}>
            <div style={{ position: "absolute", left: PAD + 800, top: 560, width: 976 }}>
              <Card accent={C.coral} style={{ height: 180 }}>
                <div style={{ fontFamily: FONT.sans, fontSize: FT.h2, color: C.ink }}>两个样本，趋势都强，季节都弱。</div>
                <Body style={{ marginTop: 10 }}>这不是某一只股票的特殊性，是日线价格这个量本身的性质。</Body>
              </Card>
            </div>
          </Build>
        </div>

        <div>
          <div style={{ position: "absolute", left: PAD, top: 236, fontFamily: FONT.sans, fontSize: FT.h2, color: C.inkDim }}>
            反例：同一只茅台，换成五分钟线，周期四十八。
          </div>
          <Build at={lf("open", 0.64)}>
            <div style={{ position: "absolute", left: PAD, top: 300 }}>
              <LinePlot
                series={[{ values: d.minute.close, color: C.amber, name: "五分钟收盘价" }]}
                width={1120} height={430} title="五日 · 240 根 5 分钟 K 线" yFmt={(v) => v.toFixed(0)} at={lf("open", 0.66)}
              />
            </div>
          </Build>
          <Build at={lf("open", 0.68)}>
            <div style={{ position: "absolute", left: PAD + 1184, top: 300, width: 592 }}>
              <Stat label="趋势强度" accent={C.cyan} value={fmtF(s.decomp.minute.trend, 4)} sub="周期 48 · 有效点 192" style={{ height: 210 }} />
              <Stat label="季节强度" accent={C.amber} value={fmtF(s.decomp.minute.seasonal, 4)} sub="周期 48 · 有效点 192" style={{ height: 210, marginTop: 18 }} />
            </div>
          </Build>
          <Build at={lf("open", 0.72)}>
            <div style={{ position: "absolute", left: PAD, top: 760, fontFamily: FONT.sans, fontSize: FT.body, color: C.inkDim }}>
              同一个标的，换了采样频率，两个数都变了。强度是描述，不是本质。
            </div>
          </Build>
        </div>

        <div>
          <div style={{ position: "absolute", left: PAD, top: 236, fontFamily: FONT.sans, fontSize: FT.h2, color: C.inkDim }}>
            合成序列先给三个极端。
          </div>
          <Build at={lf("open", 0.84)}>
            <div style={{ position: "absolute", left: PAD, top: 318, display: "flex", gap: 26 }}>
              <Stat label="纯趋势" accent={C.cyan} value="1 / 0" sub="趋势强度 1 · 季节强度 0" style={{ width: 574, height: 220 }} />
              <Stat label="纯周期" accent={C.amber} value="0 / 1" sub="趋势强度 0 · 季节强度 1" style={{ width: 574, height: 220 }} />
              <Stat label="纯噪声" accent={C.coral} value={fmtF(s.noiseTrend, 4)} sub="趋势强度不是 0；季节 0.0042" valueColor={C.coral} style={{ width: 574, height: 220 }} />
            </div>
          </Build>
          <Build at={lf("open", 0.9)}>
            <div style={{ position: "absolute", left: PAD, top: 586, width: 1776, background: C.panel, border: "1px solid " + C.panelLine, borderLeft: "3px solid " + C.coral, borderRadius: 12, padding: "20px 26px" }}>
              <div style={{ fontFamily: FONT.sans, fontSize: FT.h2, color: C.ink }}>最后一个数不是零。这一集的难点，就在这个不是零上。</div>
              <K style={{ display: "block", marginTop: 8 }}>纯噪声 · 1000 点残差 · 周期 4 的核残余</K>
            </div>
          </Build>
        </div>
      </Pages>
    </Scene>
  );
};
