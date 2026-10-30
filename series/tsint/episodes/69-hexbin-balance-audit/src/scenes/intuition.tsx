import React from "react";
import { useCurrentFrame } from "remotion";
import { Build } from "../../design/primitives";
import { C, FONT, FT } from "../../design/tokens";
import { Head, Scene, PAD, Card, Body, Mono, K, M, beatAt, HexPlot, SensitivityRows, fmtP } from "../shared";

/** 轴向坐标示意：尖顶六边形网格、奇行右移半格、一个高亮格子与它的 (col,row)。 */
const HexSchematic: React.FC = () => {
  const s = 54;
  const h = Math.sqrt(3) / 2;
  const r = s / Math.sqrt(3);
  const parity = (row: number) => ((row % 2) + 2) % 2;
  const cx = (col: number, row: number) => 420 + s * (col + 0.5 * parity(row));
  const cy = (row: number) => 215 + s * h * row;
  const pts = (x: number, y: number) => {
    const out: string[] = [];
    for (let k = 0; k < 6; k++) {
      const a = (Math.PI / 180) * (30 + 60 * k);
      out.push((x + r * Math.cos(a)).toFixed(2) + "," + (y + r * Math.sin(a)).toFixed(2));
    }
    return out.join(" ");
  };
  const cells: React.ReactNode[] = [];
  for (let row = -4; row <= 4; row++) {
    for (let col = -6; col <= 6; col++) {
      const x = cx(col, row);
      const y = cy(row);
      const hot = row === 1 && col === 1;
      cells.push(
        <polygon key={col + ":" + row} points={pts(x, y)} fill={hot ? C.cyanDeep : "#1C2A38"} stroke={hot ? C.cyan : "#2E4256"} strokeWidth={hot ? 2.5 : 1} opacity={hot ? 1 : 0.9} />
      );
    }
  }
  return (
    <Card label="轴向坐标 · 尖顶六边形" accent={C.cyan} style={{ width: 880, height: 680 }} pad={20}>
      <svg width={840} height={420} style={{ display: "block" }}>
        {cells}
        <line x1={cx(1, 1) + 20} y1={cy(1) - 22} x2={cx(1, 1) + 96} y2={cy(1) - 98} stroke={C.cyan} strokeWidth={1.5} />
        <text x={cx(1, 1) + 102} y={cy(1) - 102} fill={C.cyan} fontFamily={FONT.mono} fontSize={20}>(col=1, row=1)</text>
        <line x1={40} y1={420 - 24} x2={300} y2={420 - 24} stroke={C.cyan} strokeWidth={2} />
        <text x={310} y={420 - 18} fill={C.cyan} fontFamily={FONT.mono} fontSize={19}>col →</text>
        <line x1={46} y1={420 - 40} x2={46} y2={120} stroke={C.violet} strokeWidth={2} />
        <text x={58} y={130} fill={C.violet} fontFamily={FONT.mono} fontSize={19}>row ↑</text>
      </svg>
      <div style={{ fontFamily: FONT.mono, fontSize: FT.code, lineHeight: 1.7, color: C.inkDim, marginTop: 4 }}>
        <div>cx = s·(col + 0.5·(row mod 2))</div>
        <div>cy = s·(√3/2)·row</div>
        <div style={{ color: C.cyan }}>row = round(y/(s·√3/2))</div>
        <div style={{ color: C.cyan }}>col = round(x/s − 0.5·(row mod 2))</div>
      </div>
      <Body size={FT.micro} style={{ marginTop: 8 }}>
        奇行整体右移半格；先定 row，再用 row 的奇偶修正 col。s 由网格数决定，30×30 时 s ≈ 0.00273。
      </Body>
    </Card>
  );
};

/** 直觉：密度图怎么读，以及网格尺寸的影响。 */
export const SIntuition: React.FC = () => {
  const b = (i: number) => beatAt("intuition", i, 41);
  const f = useCurrentFrame();
  const plotAt = b(16);
  const p = M.panel20;
  const s30 = M.gridSensitivity.find((g) => g.gridsize === 30)!;
  const s60 = M.gridSensitivity.find((g) => g.gridsize === 60)!;
  return (
    <Scene id="intuition">
      <Head kicker="04 / 看图" title="图上每一格，都是一群窗口" goal="密度图的读法" />

      <div style={{ position: "absolute", left: PAD, top: 268 }}>
        <Build at={b(1)}>
          {f >= plotAt ? <HexPlot cells={M.cells20} s={p.hexSize} width={880} height={680} at={plotAt} topN={3} /> : <HexSchematic />}
        </Build>
      </div>

      <div style={{ position: "absolute", left: 992, top: 268, width: 808 }}>
        {f < plotAt ? (
          <Build at={b(2)}>
            <Card label="为什么用六边形" accent={C.violet} style={{ width: 808, height: 260 }} pad={22}>
              <Body size={FT.body} style={{ lineHeight: 1.8 }}>
                ① 方格只有 4 个邻居，六边形有 6 个，边界更少。<br />
                ② 六边形更接近圆：从中心到各边界等距，方向偏差更小。<br />
                ③ 每个点只属于一个格子，计数不重不漏。
              </Body>
              <Body size={FT.micro} style={{ marginTop: 14 }}>
                坐标用轴向整数对 (col, row)：奇行整体右移半格，所以 col 要加 0.5 的修正项。
              </Body>
            </Card>
          </Build>
        ) : (
        <>
        <Build at={b(17)}>
          <Card label="读图三条" accent={C.cyan} style={{ width: 808, height: 236 }} pad={20}>
            <Body size={FT.body} style={{ lineHeight: 1.75 }}>
              ① 密集区在 μ≈0、σ≈2%：指数涨跌的日常波动。<br />
              ② 越往外越稀：边缘格子只有个位数样本，尾部靠不住。<br />
              ③ 点云略向右上倾斜：高波动窗口的平均收益也略高（b = 0.0744）。
            </Body>
          </Card>
        </Build>

        <Build at={b(26)}>
          <Card label="网格尺寸敏感度" accent={C.violet} style={{ width: 808, height: 300, marginTop: 16 }} pad={20}>
            <SensitivityRows width={760} at={b(26)} />
            <Body size={FT.micro} style={{ marginTop: 6 }}>
              横条从 80% 起画；集中度绝对值见右侧数字。30×30 是本集主口径。
            </Body>
          </Card>
        </Build>

        <Build at={b(34)}>
          <Card accent={C.coral} style={{ width: 808, height: 108, marginTop: 16 }} pad={16}>
            <Body size={FT.meta} color={C.ink}>
              从 15 到 30 几乎不变（{fmtP(M.gridSensitivity[0].concentration)} → {fmtP(s30.concentration)}），
              到 60 才降到 {fmtP(s60.concentration)}：九成二不是画法造成的，但格子越细尾部越容易漏。
            </Body>
          </Card>
        </Build>

        <Build at={b(38)}>
          <div style={{ marginTop: 10 }}>
            <K>占用格子：15→{M.gridSensitivity[0].occupiedBins} · 30→{s30.occupiedBins} · 60→{s60.occupiedBins}</K>
          </div>
        </Build>
        </>
        )}
      </div>
    </Scene>
  );
};