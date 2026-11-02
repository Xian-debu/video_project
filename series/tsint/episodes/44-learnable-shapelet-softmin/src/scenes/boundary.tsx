import React from "react";
import { AbsoluteFill } from "remotion";
import { C, FONT, FT } from "../../design/tokens";
import {
  PAD, M, pagesOf, Pages, Scene, SceneHead, Card, Body, Chip, Stat, Row, Verdict,
  MiniTable, fmt4, fmtInt, fmtPct,
} from "../shared";

const mt = M.meta;
const rl = M.real;
const st = M.stall;
const tr = M.tree;
const reuse = mt.reuse;

export const SBoundary: React.FC = () => {
  const at = pagesOf("boundary");
  return (
    <Scene id="boundary">
      <SceneHead id="boundary" />
      <Pages id="boundary" at={at}>
        {/* 页一：十倍规则 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 292, width: 800 }}>
            <div style={{ fontFamily: FONT.serif, fontSize: FT.h1, color: C.ink, lineHeight: 1.18 }}>
              十倍规则
              <br />
              在分类任务上不成立。
            </div>
            <Body style={{ marginTop: 20, width: 770 }}>
              书里的十倍规则来自「用 SoftMin 近似 min 去还原一条已知形状」。我们的训练目标是分类交叉熵，不是重建误差；分类早就满分了，模板只要「分得开」，没有压力去长得像真形状。所以 α 变大不会自动让落点更准。
            </Body>
            <div style={{ marginTop: 22, display: "flex", gap: 12 }}>
              <Chip color={C.coral}>计划：α×10 → 误差÷10</Chip>
              <Chip color={C.cyan}>实测：1.8113 → 2.1242 → 2.1415</Chip>
            </div>
          </div>
          <div style={{ position: "absolute", left: 920, top: 292, width: 900 }}>
            <Card label="计划 vs 实测：第一条偏差" accent={C.coral} pad={22}>
              <Row name="计划原文" value="误差应随 α 缩小十倍" note="书的定性结论" />
              <Row name="α = 1" value={fmt4(M.sweep[0].meanErr)} note="二十五轮" />
              <Row name="α = 10" value={fmt4(M.sweep[1].meanErr)} note="不降反升" color={C.coral} />
              <Row name="α = 100" value={fmt4(M.sweep[2].meanErr)} note="继续略升" color={C.coral} />
            </Card>
            <div style={{ marginTop: 14 }}>
              <Body color={C.inkDim}>
                这不是实现错误：同一份权重、同一批窗口，只改 α。结论按实测讲，不按书里的预期讲。
              </Body>
            </div>
          </div>
        </AbsoluteFill>

        {/* 页二：下溢不等于断流 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 292, width: 800 }}>
            <div style={{ fontFamily: FONT.serif, fontSize: FT.h1, color: C.ink, lineHeight: 1.18 }}>
              下溢把 SoftMin
              <br />
              压成 min，不是断流。
            </div>
            <Body style={{ marginTop: 20, width: 770 }}>
              计划里说 α 大于五百梯度下溢、训练停住。实测确实有大面积下溢：α 到一千时九成权重为零。但梯度没有断，因为最小的那个窗口权重始终是一，梯度仍从它回来。断流要所有窗口同时归零，这要求距离全都远离零，本集的数据没有出现。
            </Body>
            <div style={{ marginTop: 22 }}>
              <Card label="α = 1000，十二轮" accent={C.cyan} pad={18}>
                <Row name="零权重比例" value={fmt4(st.weightZeroFrac)} note="下溢真实存在" color={C.coral} />
                <Row name="损失下降" value={fmt4(st.lossChangePct, 1) + "%"} note="训练没有停" color={C.cyan} />
              </Card>
            </div>
          </div>
          <div style={{ position: "absolute", left: 920, top: 292, width: 900 }}>
            <Card label="第二条偏差：停住 vs 退化成 min" accent={C.amber} pad={22}>
              <Row name="计划" value="α > 500 训练停住" note="梯度下溢导致" />
              <Row name="实测损失" value={fmt4(st.lossStart, 4) + " → " + fmt4(st.lossEnd, 4)} note="下降 95.5%" color={C.cyan} />
              <Row name="实测准确率" value={fmt4(st.testAcc, 2)} note="十二轮后仍满分" color={C.cyan} />
              <Row name="机制" value="下溢只压非最小窗口" note="最小窗口权重恒为一" />
            </Card>
          </div>
        </AbsoluteFill>

        {/* 页三：树的拐点 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 292, width: 780 }}>
            <div style={{ fontFamily: FONT.serif, fontSize: FT.h1, color: C.ink, lineHeight: 1.18 }}>
              树的拐点
              <br />
              取决于特征，不取决于树。
            </div>
            <Body style={{ marginTop: 20, width: 750 }}>
              计划想用决策树深度的过拟合拐点来说明「模板好，树就浅」。实测：五个学到的距离特征，深度二就到满分，根本没出现过拟合段；换成二十个原始点，拐点才出现在深度四，训练与测试差七点八个点。所以「树浅」不是 universally 好，是特征好。
            </Body>
            <div style={{ marginTop: 22, display: "flex", gap: 12 }}>
              <Chip color={C.cyan}>距离特征：深度 {tr.bestDepth}</Chip>
              <Chip color={C.amber}>原始点：深度 {tr.rawBestDepth} · gap {fmt4(tr.rawGap)}</Chip>
            </div>
          </div>
          <div style={{ position: "absolute", left: 900, top: 292, width: 920 }}>
            <Card label="两条曲线的拐点不同" accent={C.amber} pad={22}>
              <Row name="距离特征 最好" value={fmt4(tr.bestTrain) + " / " + fmt4(tr.bestTest)} note={"深度 " + tr.bestDepth + "，训练 / 测试"} color={C.cyan} />
              <Row name="原始点 最好" value={fmt4(tr.rawTrain[tr.rawBestDepth - 1]) + " / " + fmt4(tr.rawTest[tr.rawBestDepth - 1])} note={"深度 " + tr.rawBestDepth + "，训练 / 测试"} color={C.amber} />
              <Row name="原始点 八层测试" value={fmt4(tr.rawTest[tr.rawTest.length - 1])} note="掉下来了" color={C.coral} />
            </Card>
          </div>
        </AbsoluteFill>

        {/* 页四：数据口径 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 292, width: 800 }}>
            <div style={{ fontFamily: FONT.serif, fontSize: FT.h1, color: C.ink, lineHeight: 1.18 }}>
              数据是借来的，
              <br />
              口径要写清楚。
            </div>
            <Body style={{ marginTop: 20, width: 770 }}>
              本集没有重新导出数据，直接复用第 43 集的面板：全市场同门类各五十只、{fmtInt(reuse.panel.rows)} 行 × {reuse.panel.cols} 列、{reuse.panel.start} 到 {reuse.panel.end}。计划里写的是「六十日 × 五字段」的多通道窗口，这里只用最后一百日的收盘价单通道。
            </Body>
            <div style={{ marginTop: 22, display: "flex", gap: 12 }}>
              <Chip color={C.amber}>计划：60 日 × 5 字段</Chip>
              <Chip color={C.cyan}>实际：100 日 × close</Chip>
            </div>
          </div>
          <div style={{ position: "absolute", left: 920, top: 292, width: 900 }}>
            <Card label="偏差同时出现在三个地方" accent={C.violet} pad={22}>
              <Row name="manifest" value="deviation 第一条" note="ts-base 数据目录" />
              <Row name="dist.json" value="meta.deviations[0]" note="成片数据源" />
              <Row name="这一页" value="画面与字幕" note="观众能核对" color={C.cyan} />
              <div style={{ marginTop: 12 }}>
                <Body color={C.inkDim} size={FT.meta}>
                  三处对不上，就不算讲清楚。多通道留给下一集的卷积：卷积核天生适合吃「五天 × 五个字段」的小块。
                </Body>
              </div>
            </Card>
          </div>
        </AbsoluteFill>

        {/* 页五：未验证清单 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 292, width: 800 }}>
            <div style={{ fontFamily: FONT.serif, fontSize: FT.h1, color: C.ink, lineHeight: 1.18 }}>
              四件没验证的事，
              <br />
              和下一集。
            </div>
            <Body style={{ marginTop: 20, width: 770 }}>
              第一，十倍规则只在分类目标下被否，重建目标下没测；第二，α 超过一千的数值行为没测；第三，五个模板的长度是手挑的，没有连续搜索；第四，真实数据只跑了五个模板，没有做多随机初始化。
            </Body>
            <div style={{ marginTop: 20, display: "flex", gap: 12 }}>
              <Verdict ok label="35 / 35 检查" />
              <Chip color={C.inkDim}>{mt.newCases} 条新断言</Chip>
            </div>
          </div>
          <div style={{ position: "absolute", left: 920, top: 292, width: 900 }}>
            <Card label="未验证清单" accent={C.coral} pad={22}>
              <Row name="十倍规则的普适性" value="未测" note="只否定了分类目标下的版本" />
              <Row name="α > 1000" value="未测" note="下溢后的数值行为" />
              <Row name="模板长度" value="固定 8 / 12 / 20" note="没有连续搜索" />
              <Row name="随机初始化" value="单一 seed 7" note="没有跑多次方差" />
            </Card>
            <div style={{ marginTop: 14 }}>
              <Card label={"下一集 · " + mt.next.minutes + " 分钟"} accent={C.cyan} pad={18}>
                <Body>{mt.next.title}</Body>
                <div style={{ marginTop: 10 }}>
                  <Chip color={C.cyan}>{mt.next.id}</Chip>
                </div>
              </Card>
            </div>
          </div>
        </AbsoluteFill>
      </Pages>
    </Scene>
  );
};
