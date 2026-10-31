import React from "react";
import { C, FONT, FT } from "../../design/tokens";
import { Bars, Body, CW, Card, Formula, Head, K, LinePlot, M, PAD, Pages, Row, Stat, fmtF, fmtInt } from "../shared";

const P1: React.FC = () => (
  <>
    <Head kicker="04 / 直觉" title="误差怎么随视野长" goal="同一条序列，两个基准" />
    <div style={{ position: "absolute", left: PAD, top: 336, width: 1180 }}>
      <LinePlot
        width={1180}
        height={470}
        series={[
          { values: M.curves.syn_now, color: C.violet, name: "NowNorm" },
          { values: M.curves.syn_mean, color: C.amber, name: "MeanNorm" },
        ]}
        yFmt={(v) => fmtF(v, 2)}
        title="有漂移的合成序列 · 每一步的 MAE"
      />
    </div>
    <div style={{ position: "absolute", left: PAD + 1220, top: 336, width: CW - 1220, display: "flex", flexDirection: "column", gap: 18 }}>
      <Stat label="NowNorm · 二十四步" value={fmtF(M.mae.drift.now, 2)} accent={C.violet} style={{ height: 150 }} sub={<span>基准跟着末值走</span>} />
      <Stat label="MeanNorm · 二十四步" value={fmtF(M.mae.drift.mean, 2)} accent={C.amber} style={{ height: 150 }} sub={<span>基准落在窗口中间</span>} />
      <Stat label="倍率" value={fmtF(M.mae.drift.mean / M.mae.drift.now, 2) + "×"} accent={C.coral} style={{ height: 150 }} sub={<span>差距随视野拉大</span>} />
    </div>
    <div style={{ position: "absolute", left: PAD, top: 830, width: CW }}>
      <Body size={FT.body} color={C.inkDim}>
        两条曲线从第一步就分开：均值基准要补半个窗口的漂移，视野越长，补得越多。
      </Body>
    </div>
  </>
);

const P2: React.FC = () => (
  <>
    <Head kicker="04 / 直觉" title="排序翻转" goal="同一骨干，只换 base" />
    <div style={{ position: "absolute", left: PAD, top: 340, width: 860 }}>
      <div style={{ fontFamily: FONT.mono, fontSize: FT.label, color: C.amber, marginBottom: 10 }}>有漂移 · 斜率 0.05</div>
      <Bars
        width={830}
        max={2.2}
        items={[
          { label: "NowNorm", value: M.mae.drift.now, text: fmtF(M.mae.drift.now, 4), color: C.violet },
          { label: "MeanNorm", value: M.mae.drift.mean, text: fmtF(M.mae.drift.mean, 4), color: C.amber },
        ]}
      />
      <div style={{ fontFamily: FONT.mono, fontSize: FT.label, color: C.violet, marginTop: 34, marginBottom: 10 }}>无趋势 · 只留周期与噪声</div>
      <Bars
        width={830}
        max={2.2}
        items={[
          { label: "NowNorm", value: M.mae.flat.now, text: fmtF(M.mae.flat.now, 4), color: C.violet },
          { label: "MeanNorm", value: M.mae.flat.mean, text: fmtF(M.mae.flat.mean, 4), color: C.amber },
        ]}
      />
    </div>
    <div style={{ position: "absolute", left: PAD + 940, top: 340, width: CW - 940, display: "flex", flexDirection: "column", gap: 18 }}>
      <Stat label="漂移组 · 倍数" value={fmtF(M.mae.drift.mean / M.mae.drift.now, 2) + "×"} accent={C.amber} style={{ height: 140 }} sub={<span>末值赢</span>} />
      <Stat label="平稳组 · 倍数" value={fmtF(M.mae.flat.now / M.mae.flat.mean, 2) + "×"} accent={C.violet} style={{ height: 140 }} sub={<span>均值赢</span>} />
      <Card label="唯一变量" accent={C.coral}>
        <Body size={FT.body} color={C.inkDim}>
          骨干、初始化、优化器、轮数全同，只换 base。排序翻转，说明选 base 就是选假设。
        </Body>
      </Card>
    </div>
  </>
);

const P3: React.FC = () => (
  <>
    <Head kicker="04 / 直觉" title="真实指数上也一样" goal="上证指数，二十四步视野" />
    <div style={{ position: "absolute", left: PAD, top: 336, width: 1180 }}>
      <LinePlot
        width={1180}
        height={430}
        series={[
          { values: M.curves.idx_now, color: C.violet, name: "NowNorm" },
          { values: M.curves.idx_revin, color: C.cyan, name: "RevIN" },
          { values: M.curves.idx_mean, color: C.amber, name: "MeanNorm" },
        ]}
        yFmt={(v) => fmtF(v, 1)}
        title="上证指数 · 每一步的 MAE（点）"
      />
    </div>
    <div style={{ position: "absolute", left: PAD + 1220, top: 336, width: CW - 1220, display: "flex", flexDirection: "column", gap: 14 }}>
      <Stat label="NowNorm" value={fmtF(M.mae.index.now, 2)} accent={C.violet} style={{ height: 140 }} sub={<span>最低</span>} />
      <Stat label="RevIN" value={fmtF(M.mae.index.revin, 2)} accent={C.cyan} style={{ height: 140 }} sub={<span>中间</span>} />
      <Stat label="MeanNorm" value={fmtF(M.mae.index.mean, 2)} accent={C.amber} style={{ height: 140 }} sub={<span>最高</span>} />
    </div>
    <div style={{ position: "absolute", left: PAD, top: 800, width: CW }}>
      <Body size={FT.lead} color={C.ink}>
        指数比合成序列平滑，漂移也更持续。末值基准领先，但差距没有合成数据那么大。
      </Body>
    </div>
  </>
);

export const SIntuition: React.FC = () => (
  <Pages id="intuition" at={[0, 0.417, 0.719]}>
    <P1 />
    <P2 />
    <P3 />
  </Pages>
);
