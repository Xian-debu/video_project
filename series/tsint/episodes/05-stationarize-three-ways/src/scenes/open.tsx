import React from "react";
import { Build } from "../../design/primitives";
import { C, FONT, FT } from "../../design/tokens";
import { Body, Card, Chip, K, LinePlot, M, PAD, Pages, Scene, SceneHead, Stat, fmtInt, lf } from "../shared";

const PathCard: React.FC<{ label: string; sym: string; name: string; note: string; color: string; width: number }> = ({ label, sym, name, note, color, width }) => (
  <Card label={label} accent={color} style={{ width, height: 300 }}>
    <div style={{ fontFamily: FONT.serif, fontSize: 64, color, lineHeight: 1.1 }}>{sym}</div>
    <div style={{ fontFamily: FONT.sans, fontSize: FT.h2, color: C.ink, marginTop: 10 }}>{name}</div>
    <Body size={FT.meta} style={{ marginTop: 12 }}>{note}</Body>
  </Card>
);

export const SOpen: React.FC = () => {
  const d = M.series;
  const s = M.stats;
  return (
    <Scene id="open">
      <SceneHead id="open" />
      <Pages id="open" at={[0, 0.22, 0.48, 0.74]}>
        <div>
          <div style={{ position: "absolute", left: PAD, top: 236, fontFamily: FONT.sans, fontSize: FT.h2, color: C.inkDim }}>
            三条路，三种作用；只有一条改变积分阶。
          </div>
          <Build at={lf("open", 0.06)}>
            <div style={{ position: "absolute", left: PAD, top: 318, display: "flex", gap: 26 }}>
              <PathCard label="路径 1 · 差分" sym="Δ" name="差分" note="改积分阶；把趋势还原成噪声。" color={C.cyan} width={574} />
              <PathCard label="路径 2 · 对数" sym="log" name="对数" note="改方差尺度；乘法变加法。" color={C.amber} width={574} />
              <PathCard label="路径 3 · 标准化" sym="z" name="Z-score" note="改坐标；形状一点不动。" color={C.violet} width={574} />
            </div>
          </Build>
          <Build at={lf("open", 0.12)}>
            <div style={{ position: "absolute", left: PAD, top: 660, width: 1776, background: C.panel, border: "1px solid " + C.panelLine, borderLeft: "3px solid " + C.coral, borderRadius: 12, padding: "20px 26px" }}>
              <div style={{ fontFamily: FONT.sans, fontSize: FT.h2, color: C.ink }}>把 Z-score 放进平稳化，是这一章最容易抄错的一句话。</div>
              <K style={{ display: "block", marginTop: 8 }}>本片的判断：它叫标准化；证据在第六场</K>
            </div>
          </Build>
        </div>

        <div>
          <div style={{ position: "absolute", left: PAD, top: 236, fontFamily: FONT.sans, fontSize: FT.h2, color: C.inkDim }}>
            贵州茅台，二零一九年初到二零二一年底；七百三十个交易日，前复权。
          </div>
          <Build at={lf("open", 0.28)}>
            <div style={{ position: "absolute", left: PAD, top: 300 }}>
              <LinePlot
                series={[{ values: d.close, color: C.amber, name: "收盘价" }]}
                width={1180} height={470}
                title="2019-01-02 → 2021-12-31 · 前复权收盘价"
                yFmt={(v) => v.toFixed(0)} at={lf("open", 0.3)}
              />
            </div>
          </Build>
          <Build at={lf("open", 0.31)}>
            <div style={{ position: "absolute", left: PAD + 1184, top: 300, width: 592 }}>
              <Stat label="样本" accent={C.cyan} value={<span>{fmtInt(M.data.daily.rows)} 行</span>} sub="2019-01-02 → 2021-12-31 · 日线" style={{ height: 168 }} />
              <Stat label="区间涨幅" accent={C.amber} value={<span>+254.68%</span>} sub="从 492 元，最高 2227 元" valueColor={C.amber} style={{ height: 168, marginTop: 18 }} />
            </div>
          </Build>
        </div>

        <div>
          <div style={{ position: "absolute", left: PAD, top: 236, fontFamily: FONT.sans, fontSize: FT.h2, color: C.inkDim }}>
            先记住三个数字，后面逐个解释。
          </div>
          <Build at={lf("open", 0.52)}>
            <div style={{ position: "absolute", left: PAD, top: 318, display: "flex", gap: 26 }}>
              <Stat label="水平 ACF" accent={C.amber} value={s.acfLevel.toFixed(4)} sub="价格几乎记住前一天" style={{ width: 574, height: 240 }} />
              <Stat label="差分后 ACF" accent={C.cyan} value={s.acfDiff.toFixed(4)} sub="记忆被拿走" style={{ width: 574, height: 240 }} />
              <Stat label="Z-score 后 ACF" accent={C.violet} value={s.acfZ.toFixed(4)} sub="和水平序列一模一样" style={{ width: 574, height: 240 }} />
            </div>
          </Build>
          <Build at={lf("open", 0.58)}>
            <div style={{ position: "absolute", left: PAD, top: 610, fontFamily: FONT.sans, fontSize: FT.body, color: C.inkDim }}>
              一个改了，一个没改；第三个只是换了坐标。
            </div>
          </Build>
        </div>

        <div>
          <div style={{ position: "absolute", left: PAD, top: 236, fontFamily: FONT.sans, fontSize: FT.h2, color: C.inkDim }}>
            所以这一集先把名字改回来：Z-score 是标准化，不是平稳化。
          </div>
          <Build at={lf("open", 0.78)}>
            <div style={{ position: "absolute", left: PAD, top: 320, width: 1180 }}>
              <Card accent={C.violet} style={{ height: 300 }}>
                <div style={{ fontFamily: FONT.serif, fontSize: 46, color: C.ink }}>仿射变换，不改时间结构。</div>
                <Body style={{ marginTop: 18 }}>
                  平移加缩放，自相关只依赖形状，不依赖位置和尺度。所以 Z 之后的 ACF，与原来完全相同。
                </Body>
                <div style={{ marginTop: 18 }}>
                  <Chip color={C.violet}>差 2.4e−15</Chip>
                </div>
              </Card>
            </div>
          </Build>
          <Build at={lf("open", 0.84)}>
            <div style={{ position: "absolute", left: PAD + 1184, top: 320, width: 592 }}>
              <Card accent={C.cyan} style={{ height: 300 }}>
                <K>本片路线</K>
                <div style={{ fontFamily: FONT.sans, fontSize: FT.h2, color: C.ink, marginTop: 12, lineHeight: 1.5 }}>
                  差分改积分阶<br />对数改方差<br />标准化改坐标
                </div>
              </Card>
            </div>
          </Build>
        </div>
      </Pages>
    </Scene>
  );
};
