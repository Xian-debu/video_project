import React from "react";
import { AbsoluteFill } from "remotion";
import { C, FONT, FT } from "../../design/tokens";
import {
  PAD, M, pagesOf, Pages, Scene, SceneHead, Card, Body, Chip, Row, MiniTable, fmt4, fmt2, fmtInt,
} from "../shared";
import { GraphFig, CorrHistFig, DensityFig } from "../figs";

const d = M.data;
const gm = M.graph;

export const SOpen: React.FC = () => {
  const at = pagesOf("open");
  return (
    <Scene id="open">
      <SceneHead id="open" />
      <Pages id="open" at={at}>
        {/* 页一：一张图 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 296, width: 660 }}>
            <div style={{ fontFamily: FONT.serif, fontSize: FT.h1, color: C.ink, lineHeight: 1.18 }}>
              三十只股票，
              <br />
              一张图。
            </div>
            <Body style={{ marginTop: 22, width: 640 }}>
              {d.firstDate + " 到 " + d.lastDate + "，一共 " + fmtInt(d.rows) + " 个交易日。三十只股票，三个行业，每只股票的对数收益两两算相关；绝对值过 0.3 就连一条边，于是有了 " + d.edges + " 条边的一张图。"}
            </Body>
            <div style={{ marginTop: 24, display: "flex", gap: 12, flexWrap: "wrap" }}>
              <Chip color={C.cyan}>{fmtInt(d.rows) + " 天"}</Chip>
              <Chip color={C.violet}>{d.cols + " 只"}</Chip>
              <Chip color={C.amber}>{d.edges + " 条边"}</Chip>
            </div>
          </div>
          <div style={{ position: "absolute", left: 760, top: 282, width: 1080 }}>
            <Card label="相关性变成邻接：环上按行业分段" accent={C.cyan} pad={16}>
              <GraphFig width={1010} height={600} />
            </Card>
          </div>
        </AbsoluteFill>

        {/* 页二：边从阈值来 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 290, width: 650 }}>
            <div style={{ fontFamily: FONT.serif, fontSize: FT.h1, color: C.ink, lineHeight: 1.18 }}>
              边是算出来的，
              <br />
              不是查来的。
            </div>
            <Body style={{ marginTop: 20, width: 630 }}>
              {"三十只股票两两配对是 " + d.pairs + " 对相关性；过 0.3 的有 " + d.edges + " 对。最强的四对全在银行内部：工行-建行 " + fmt4(gm.edges[0].corr) + "、工行-农行 " + fmt4(gm.edges[1].corr) + "、农行-中行 " + fmt4(gm.edges[2].corr) + "、工行-中行 " + fmt4(gm.edges[3].corr) + "。"}
            </Body>
            <div style={{ marginTop: 20 }}>
              <Row name="全部配对" value={fmtInt(d.pairs) + " 对"} note="每个行业 45 对" color={C.inkDim} />
              <Row name="越过阈值" value={d.edges + " 对"} note={"θ = " + fmt2(gm.theta, 1)} color={C.cyan} />
              <Row name="最强一对" value={fmt4(gm.edges[0].corr)} note={gm.edges[0].a + " · " + gm.edges[0].b} color={C.amber} />
            </div>
          </div>
          <div style={{ position: "absolute", left: 780, top: 288, width: 1050 }}>
            <Card label="|相关性| 的分布：0.3 是一条人为画的线" accent={C.amber} pad={18}>
              <CorrHistFig width={520} height={300} />
            </Card>
            <div style={{ marginTop: 12 }}>
              <Row name="高于 0.8" value={"银行内部" } note="四对全是同业" color={C.coral} width={980} />
              <Row name="0.3 附近" value={"最多的一档"} note="阈值一动，边数就变" color={C.inkFaint} width={980} />
            </div>
          </div>
        </AbsoluteFill>

        {/* 页三：行业块 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 292, width: 660 }}>
            <div style={{ fontFamily: FONT.serif, fontSize: FT.h1, color: C.ink, lineHeight: 1.18 }}>
              行业块，
              <br />
              几乎连满。
            </div>
            <Body style={{ marginTop: 20, width: 640 }}>
              {"行业内 " + d.intraPairs + " 对里连上 " + d.intra + " 对，密度 " + fmt4(gm.intraRate) + "；跨行业 " + d.crossPairs + " 对里只连上 " + d.cross + " 对，密度 " + fmt4(gm.crossRate) + "。差了十倍多，图的块结构先于任何模型出现。"}
            </Body>
            <div style={{ marginTop: 20 }}>
              <Row name="度数范围" value={gm.minDeg + " – " + gm.maxDeg} note="30 个节点最多只能连 29" color={C.violet} />
              <Row name="对齐天数" value={fmtInt(d.alignedDays)} note={"原面板 " + fmtInt(d.rows) + " 天"} color={C.inkDim} />
            </div>
          </div>
          <div style={{ position: "absolute", left: 780, top: 290, width: 1050 }}>
            <Card label="行业内 0.9926，跨行业 0.0933" accent={C.cyan} pad={22}>
              <DensityFig width={990} />
            </Card>
          </div>
        </AbsoluteFill>

        {/* 页四：三件事 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 288, width: 700 }}>
            <div style={{ fontFamily: FONT.serif, fontSize: FT.h1, color: C.ink, lineHeight: 1.18 }}>
              这一集
              <br />
              讲三件事。
            </div>
            <Body style={{ marginTop: 20, width: 680 }}>
              固定邻接的 GCN、学边权的 GAT、完全不要图的自注意力；最后用打乱邻接做对照，看这张图到底贡献了什么。三套实现都在同一个面板、同一个划分上跑。
            </Body>
            <div style={{ marginTop: 20, display: "flex", gap: 12, flexWrap: "wrap" }}>
              <Chip color={C.cyan}>固定邻接</Chip>
              <Chip color={C.violet}>学权重</Chip>
              <Chip color={C.amber}>不要图</Chip>
            </div>
          </div>
          <div style={{ position: "absolute", left: 800, top: 288, width: 1060 }}>
            <Card label="三种用图的方式，三套参数" accent={C.cyan} pad={22}>
              <MiniTable
                head={["模型", "参数", "怎么用图"]}
                rows={[
                  ["GCN", fmtInt(M.gcn.params), "邻接固定，每层乘一次 P"],
                  ["GAT", fmtInt(M.gat.params), "每条边的权重由打分学出来"],
                  ["自注意力", fmtInt(M.attn.params), "不用图，所有点两两互看"],
                ]}
                colW={[200, 180, 560]}
                width={1000}
                rowH={54}
              />
            </Card>
            <div style={{ marginTop: 16 }}>
              <Body color={C.inkDim} size={FT.meta}>
                {"打乱邻接、置换编号、同种子重跑，三样对照都在验证一页里，全部有检查项。"}
              </Body>
            </div>
          </div>
        </AbsoluteFill>
      </Pages>
    </Scene>
  );
};
