import React from "react";
import { AbsoluteFill } from "remotion";
import { C, FONT, FT } from "../../design/tokens";
import { PAD, M, pagesOf, Pages, Scene, SceneHead, Card, Row, Body, Verdict, Chip, K, Heat, Bars, PairBar, fmtInt, names } from "../shared";

export const SIntuition: React.FC = () => {
  const at = pagesOf("intuition");
  const n = names();
  return (
    <Scene id="intuition">
      <SceneHead id="intuition" />
      <Pages id="intuition" at={at}>
        {/* 页一：邻接热图 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 268 }}>
            <Heat
              matrix={M.adjacency.matrix}
              labels={n}
              groups={M.adjacency.groups}
              cell={46}
              gap={2}
              labelW={104}
              size={FT.micro}
              min={0}
              max={1}
              showVals={false}
            />
            <div style={{ display: "flex", gap: 14, marginTop: 14 }}>
              {M.data.subgroupNames.map((g, i) => (
                <Chip key={g} color={i === 0 ? C.cyan : i === 1 ? C.violet : C.inkFaint}>{g}</Chip>
              ))}
              <Chip color={C.panelLine}>颜色 = 被选中的窗占比</Chip>
            </div>
          </div>
          <div style={{ position: "absolute", left: 900, top: 268, width: 950 }}>
            <Card label="最重的六条边" accent={C.cyan}>
              {M.adjacency.topEdges.map((e, i) => (
                <Row key={i} name={String(i + 1).padStart(2, "0")} value={e.v.toFixed(4)} note={e.a + " → " + e.b} width={900} />
              ))}
            </Card>
            <Body size={FT.meta} color={C.inkFaint} style={{ marginTop: 14, width: 900 }}>
              茅台指向五粮液 0.90，反向只有 0.59；泸州老窖与五粮液双向 0.84；跨组几乎全黑，五粮液到燕京 0.032。
            </Body>
          </div>
        </AbsoluteFill>

        {/* 页二：组内结构 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 288, width: 1010 }}>
            <Card label="组内权重 · 平均" accent={C.cyan}>
              <Bars
                items={[
                  { label: M.data.subgroupNames[0], value: M.adjacency.within.baijiu, color: C.cyan, text: M.adjacency.within.baijiu.toFixed(4) + " · 7 只" },
                  { label: M.data.subgroupNames[1], value: M.adjacency.within.beer, color: C.violet, text: M.adjacency.within.beer.toFixed(4) + " · 3 只" },
                  { label: M.data.subgroupNames[2], value: M.adjacency.within.other, color: C.inkFaint, text: M.adjacency.within.other.toFixed(4) + " · 2 只" },
                ]}
                width={960}
                max={0.6}
                labelW={110}
                rowH={54}
              />
            </Card>
            <Card label="对称性" accent={C.amber} style={{ marginTop: 20 }}>
              <Row name="成对出现的边" value={(M.gnn.symFrac * 100).toFixed(1) + "%"} note={"共 " + M.adjacency.symPairs + " 对，总边 " + fmtInt(M.gnn.edges)} width={960} />
              <Row name="不对称的意思" value="龙头带小弟" note="茅台选五粮液，五粮液不一定选茅台" width={960} />
            </Card>
          </div>
          <div style={{ position: "absolute", left: 1150, top: 288, width: 700 }}>
            <PairBar
              a={{ label: "实测组内精度", value: M.gnn.precision, text: M.gnn.precision.toFixed(4) }}
              b={{ label: "随机基线", value: M.gnn.baseline, text: M.gnn.baseline.toFixed(4) }}
              width={640}
              max={1}
              height={84}
              at={0}
            />
            <Body size={FT.body} color={C.inkDim} style={{ marginTop: 20, width: 660, lineHeight: 1.65 }}>
              随机连边的组内精度是 0.379，学出来的是 0.586。结构确实学到了行业同步性，问题在后面：它没有变成检测读数。
            </Body>
            <div style={{ display: "flex", gap: 14, marginTop: 18 }}>
              <Chip color={C.cyan}>样本 {M.gnn.samples} 窗</Chip>
              <Chip color={C.amber}>出度 {M.gnn.degree.toFixed(0)}</Chip>
            </div>
          </div>
        </AbsoluteFill>

        {/* 页三：训练与对比损失 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 288, width: 1010 }}>
            <Card label="训练损失 · 首轮到末轮" accent={C.cyan}>
              <Bars
                items={[
                  { label: "图 · 首轮", value: M.gnn.lossFirst, color: C.cyan, text: M.gnn.lossFirst.toFixed(4) },
                  { label: "图 · 末轮", value: M.gnn.lossLast, color: C.cyan, text: M.gnn.lossLast.toFixed(4) },
                  { label: "无图 · 首轮", value: M.gnn.flatLossFirst, color: C.inkFaint, text: M.gnn.flatLossFirst.toFixed(4) },
                  { label: "无图 · 末轮", value: M.gnn.flatLossLast, color: C.inkFaint, text: M.gnn.flatLossLast.toFixed(4) },
                ]}
                width={960}
                max={1.1}
                labelW={130}
                rowH={58}
              />
            </Card>
            <Body size={FT.body} color={C.inkDim} style={{ marginTop: 18, width: 960, lineHeight: 1.65 }}>
              {M.params.epochs} 轮，学习率 {M.params.lr}，种子 {M.params.seed}。图比无图低了 {M.gnn.gapLast.toFixed(4)}——方向对，幅度小。
            </Body>
          </div>
          <div style={{ position: "absolute", left: 1150, top: 288, width: 700 }}>
            <Card label="对比损失 · 三个温度" accent={C.violet}>
              <Row name="τ = 0.05" value={M.infonce.lossTau005.toFixed(4)} note="最硬，正样本几乎必然赢" width={640} />
              <Row name="τ = 0.10" value={M.infonce.lossTau01.toFixed(4)} note="温度越小，损失越低" width={640} />
              <Row name="τ = 0.50" value={M.infonce.lossTau05.toFixed(4)} note="最软，负样本也分到概率" width={640} />
            </Card>
            <Card label="正负距离" accent={C.cyan} style={{ marginTop: 18 }}>
              <Row name="正样本" value={M.infonce.posMean.toFixed(3)} note="同票两个视图" width={640} />
              <Row name="负样本" value={M.infonce.negMean.toFixed(3)} note="同窗另外十一只" width={640} />
            </Card>
          </div>
        </AbsoluteFill>
      </Pages>
    </Scene>
  );
};

