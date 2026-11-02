import React from "react";
import { AbsoluteFill } from "remotion";
import { C, FONT, FT } from "../../design/tokens";
import {
  PAD, M, pagesOf, Pages, Scene, SceneHead, Card, Body, Chip, Row, KV, Bars, MiniTable, fmt4, fmtInt,
} from "../shared";
import { CorrHistFig } from "../figs";

const d = M.data;
const oneCell = 1 / 9;

export const SBoundary: React.FC = () => {
  const at = pagesOf("boundary");
  return (
    <Scene id="boundary">
      <SceneHead id="boundary" />
      <Pages id="boundary" at={at}>
        {/* 页一：小图 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 290, width: 640 }}>
            <div style={{ fontFamily: FONT.serif, fontSize: FT.h1, color: C.ink, lineHeight: 1.18 }}>
              三十个节点，
              <br />
              是最好的教学尺寸。
            </div>
            <Body style={{ marginTop: 20, width: 620 }}>
              {"一张三十行三十列的稠密矩阵能整张放进缓存，打印出来也看得清。真实图动辄上百万节点，邻接表要换成稀疏格式、邻居要采样、小批次要按子图切——那是另一门手艺，本集不假装会。"}
            </Body>
            <div style={{ marginTop: 20 }}>
              <Row name="本集" value={d.cols + " 节点 · " + d.edges + " 边"} note={fmtInt(d.pairs) + " 对里筛出来"} color={C.cyan} width={600} />
              <Row name="工业图" value="10⁶ 节点起" note="稠密矩阵 10¹² 项，放不下" color={C.coral} width={600} />
            </div>
          </div>
          <div style={{ position: "absolute", left: 760, top: 290, width: 1060 }}>
            <Card label="规模一换，三件事都得重写" accent={C.coral} pad={24}>
              <MiniTable
                head={["环节", "本集写法", "百万节点时"]}
                rows={[
                  ["邻接存储", "30 × 30 稠密矩阵", "稀疏表 / CSR，按边遍历"],
                  ["邻居聚合", "整行矩阵乘", "按子图采样邻居，分块算"],
                  ["节点划分", "21 / 9 手挑", "inductive：训练时没见过节点"],
                  ["边的来源", "一次算好的静态相关", "滑动窗口，边随时间变"],
                ]}
                colW={[240, 360, 400]}
                width={1010}
                rowH={54}
              />
            </Card>
            <div style={{ marginTop: 16 }}>
              <Body color={C.inkDim} size={FT.meta}>
                {"这四条不是「以后优化」，是换了量级就不成立的假设。"}
              </Body>
            </div>
          </div>
        </AbsoluteFill>

        {/* 页二：相关不是因果 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 290, width: 640 }}>
            <div style={{ fontFamily: FONT.serif, fontSize: FT.h1, color: C.ink, lineHeight: 1.18 }}>
              连上线，
              <br />
              不等于谁影响谁。
            </div>
            <Body style={{ marginTop: 20, width: 620 }}>
              {"相关系数只说明两条曲线同向或反向，不说明方向，更不说明因果。同行业的两只股票高度相关，很可能是因为它们共享同一批因子，而不是一只在推另一只。图上的箭头是画出来的，机制没有。"}
            </Body>
            <div style={{ marginTop: 20 }}>
              <Row name="阈值" value={"|corr| ≥ " + M.graph.theta} note="人选的，不是学出来的" color={C.amber} width={600} />
              <Row name="换阈值" value="边数会变" note="但没有一条检查能告诉你哪个对" color={C.coral} width={600} />
            </div>
          </div>
          <div style={{ position: "absolute", left: 760, top: 286, width: 1060 }}>
            <Card label="435 对相关系数：阈值画在哪，图就长成什么样" accent={C.amber} pad={22}>
              <CorrHistFig width={1000} height={330} />
            </Card>
            <div style={{ marginTop: 16 }}>
              <Body color={C.inkDim} size={FT.meta}>
                {"本集把阈值当作给定条件，不当作发现；所以所有结论都只能说「在这张图上」，不能说「市场里」。"}
              </Body>
            </div>
          </div>
        </AbsoluteFill>

        {/* 页三：对齐丢天数 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 290, width: 660 }}>
            <div style={{ fontFamily: FONT.serif, fontSize: FT.h1, color: C.ink, lineHeight: 1.18 }}>
              对齐，
              <br />
              丢了一百二十天。
            </div>
            <Body style={{ marginTop: 20, width: 640 }}>
              {"原始面板 " + fmtInt(d.rows) + " 行，但三十只股票不是每天都有成交。只在三十列全部有值的交易日上算相关，剩下的 " + fmtInt(d.rows - d.alignedDays) + " 天被丢掉——约占 " + fmt4((1 - d.alignedDays / d.rows) * 100, 1) + "%。停牌、上市晚、退市，都会造成这种缺失。"}
            </Body>
            <div style={{ marginTop: 18 }}>
              <Chip color={C.coral}>{"丢掉 " + fmtInt(d.rows - d.alignedDays) + " 天"}</Chip>
            </div>
          </div>
          <div style={{ position: "absolute", left: 780, top: 300, width: 1040 }}>
            <Bars
              items={[
                { label: "原始行", value: d.rows, text: fmtInt(d.rows), color: C.inkDim, dim: true },
                { label: "对齐后", value: d.alignedDays, text: fmtInt(d.alignedDays), color: C.cyan },
                { label: "丢掉", value: d.rows - d.alignedDays, text: fmtInt(d.rows - d.alignedDays), color: C.coral },
              ]}
              width={1000}
              max={d.rows}
              rowH={72}
              labelW={150}
            />
            <div style={{ marginTop: 16 }}>
              <Body color={C.inkDim} size={FT.meta}>
                {"没有做前向填充，也没有插值：宁可少算，不编数据。"}
              </Body>
            </div>
          </div>
        </AbsoluteFill>

        {/* 页四：一格十一百分点 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 290, width: 660 }}>
            <div style={{ fontFamily: FONT.serif, fontSize: FT.h1, color: C.ink, lineHeight: 1.18 }}>
              九个测试点，
              <br />
              一格就是十一个百分点。
            </div>
            <Body style={{ marginTop: 20, width: 640 }}>
              {"九格里的对错，一格等于 " + fmt4(oneCell * 100, 1) + " 个百分点。GCN 九格全对、GAT 错一格、自注意力错三格，三个模型的差距只在一到三格之间。这个样本量支撑不了「谁更好」的结论，只能支撑「三个都学到了点东西」。"}
            </Body>
            <div style={{ marginTop: 20 }}>
              <Row name="一格" value={fmt4(oneCell, 4)} note="= 11.1 个百分点" color={C.amber} width={620} />
              <Row name="测试节点" value={String(d.testNodes)} note="没有置信区间可言" color={C.coral} width={620} />
            </div>
          </div>
          <div style={{ position: "absolute", left: 780, top: 292, width: 1040 }}>
            <Card label="差几格：9 − 8 = 1 格，9 − 6 = 3 格" accent={C.amber} pad={24}>
              <MiniTable
                head={["比较", "差几格", "差几个百分点"]}
                rows={[
                  ["GCN vs GAT", "1", fmt4(oneCell * 100, 1)],
                  ["GCN vs 自注意力", "3", fmt4(3 * oneCell * 100, 1)],
                  ["GAT vs 自注意力", "2", fmt4(2 * oneCell * 100, 1)],
                  ["GCN vs 随机", "6", fmt4(6 * oneCell * 100, 1)],
                ]}
                colW={[340, 220, 340]}
                width={1000}
                rowH={54}
                hilite={0}
              />
            </Card>
            <div style={{ marginTop: 16 }}>
              <Body color={C.inkDim} size={FT.meta}>
                {"要下结论，得换更大的样本、多次划分、报均值与方差——这一集只把机制钉住，不抢结论的活。"}
              </Body>
            </div>
          </div>
        </AbsoluteFill>

        {/* 页五：不是工业级 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 290, width: 660 }}>
            <div style={{ fontFamily: FONT.serif, fontSize: FT.h1, color: C.ink, lineHeight: 1.18 }}>
              这是最小实现，
              <br />
              不是工业级 GNN。
            </div>
            <Body style={{ marginTop: 20, width: 640 }}>
              {"没有稀疏大图、没有 inductive 划分、没有动态图、没有边特征，也没有调参和早停。四个模块加起来不到两千行，全部有测试和梯度核对——它的价值是把书上那几行公式变成能跑的、能查错的代码，而不是在榜单上赢。"}
            </Body>
            <div style={{ marginTop: 20, display: "flex", gap: 12, flexWrap: "wrap" }}>
              <Chip color={C.cyan}>{M.meta.tests.groups + " 组测试"}</Chip>
              <Chip color={C.violet}>{fmtInt(M.meta.tests.assertions) + " 条断言"}</Chip>
              <Chip color={C.amber}>{M.meta.evidence.checks + " 项证据"}</Chip>
            </div>
          </div>
          <div style={{ position: "absolute", left: 780, top: 296, width: 1040 }}>
            <Card label="明确不做的事" accent={C.coral} pad={24}>
              <KV k="稀疏大图" v="不做" note="稠密矩阵在这个规模够用" color={C.coral} />
              <KV k="inductive" v="不做" note="测试节点训练时就见过特征，只是不给标签" color={C.coral} />
              <KV k="动态图" v="不做" note="边按整段样本一次算好，不随时间重算" color={C.coral} />
              <KV k="调参与早停" v="不做" note="三个模型共用一套配方，公平优先" color={C.coral} />
            </Card>
          </div>
        </AbsoluteFill>
      </Pages>
    </Scene>
  );
};
