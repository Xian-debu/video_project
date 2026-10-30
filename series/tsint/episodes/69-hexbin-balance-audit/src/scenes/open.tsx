import React from "react";
import { Build } from "../../design/primitives";
import { C, FONT, FT } from "../../design/tokens";
import { Head, Scene, PAD, Card, Body, Mono, K, Stat, M, beatAt, HexPlot, fmtInt, fmtP } from "../shared";

/** 开场：五万个窗口先做一次「数格子」体检。 */
export const SOpen: React.FC = () => {
  const b = (i: number) => beatAt("open", i, 37);
  const p = M.panel20;
  const top = M.topBins.slice(0, 5);
  const maxCount = top[0].count;
  return (
    <Scene id="open">
      <Head kicker="第 8 章 / 评估层" title="前 20% 的格子，装下 92%" goal="五万个窗口，先数格子再谈精度" />

      <div style={{ position: "absolute", left: PAD, top: 272, width: 560 }}>
        <Build at={b(1)}>
          <Stat label="数据" value={fmtInt(M.data.rows)} accent={C.cyan} style={{ width: 560, height: 132 }}
            sub={M.data.first + " → " + M.data.last + " · " + M.data.codes + " 只 A 股 · 前复权"} />
        </Build>
        <Build at={b(4)}>
          <Stat label="窗口" value={fmtInt(p.windows)} accent={C.cyan} style={{ width: 560, height: 132, marginTop: 14 }}
            sub={"32 个日收益 / 窗 · 每只 1,289–2,642 个窗口"} />
        </Build>
        <Build at={b(11)}>
          <Stat label="占用格子" value={fmtInt(p.occupiedBins)} accent={C.violet} style={{ width: 560, height: 132, marginTop: 14 }}
            sub={"六边形网格 30×30 · 前 20% = " + p.k20 + " 格"} />
        </Build>
        <Build at={b(18)}>
          <Stat label="集中度 · 前 20% 格子覆盖" value={fmtP(p.concentration)} accent={C.coral} style={{ width: 560, height: 132, marginTop: 14 }}
            valueColor={C.coral} sub={"阈值 60% → 本数据集判为不均衡"} />
        </Build>
      </div>

      <div style={{ position: "absolute", left: 672, top: 272 }}>
        <Build at={b(14)}>
          <HexPlot cells={M.cells20} s={p.hexSize} width={560} height={620} at={b(14)} topN={3} />
        </Build>
      </div>

      <div style={{ position: "absolute", left: 1272, top: 272, width: 528 }}>
        <Build at={b(20)}>
          <Card label="最大的五个格子" accent={C.cyan} style={{ width: 528, height: 330 }} pad={20}>
            {top.map((t, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", height: 52 }}>
                <Mono size={FT.meta} color={C.inkFaint} style={{ width: 92 }}>{t.row + "," + t.col}</Mono>
                <div style={{ flex: 1, height: 10, background: C.panelLine, borderRadius: 3, marginRight: 12 }}>
                  <div style={{ width: (t.count / maxCount) * 100 + "%", height: 10, borderRadius: 3, background: i === 0 ? C.coral : C.cyan, opacity: 0.9 }} />
                </div>
                <Mono size={FT.meta} color={i === 0 ? C.coral : C.inkDim} style={{ width: 92, textAlign: "right" }}>{fmtInt(t.count)}</Mono>
              </div>
            ))}
            <Body size={FT.meta} style={{ marginTop: 8 }}>格号 = (行, 列)，轴向整数坐标；颜色越暖样本越多。</Body>
          </Card>
        </Build>

        <Build at={b(22)}>
          <Card accent={C.coral} style={{ width: 528, height: 150, marginTop: 16 }} pad={20}>
            <Body color={C.ink} size={FT.h2} style={{ fontFamily: FONT.serif, lineHeight: 1.45 }}>
              最大的一个格子，装了两千五百八十三个窗口。
            </Body>
            <K>占全部样本的 {fmtP(M.topBinShare)}</K>
          </Card>
        </Build>

        <Build at={b(24)}>
          <Card accent={C.inkFaint} style={{ width: 528, height: 110, marginTop: 16 }} pad={16}>
            <Body size={FT.meta}>同一份数据、同一套投影：二十只 A 股 92.04%，三只蓝筹 70.09%。</Body>
            <K>蓝筹更像彼此 → 点云更窄 → 集中度也不同</K>
          </Card>
        </Build>
      </div>
    </Scene>
  );
};
