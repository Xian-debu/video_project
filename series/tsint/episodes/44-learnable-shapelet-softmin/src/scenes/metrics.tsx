import React from "react";
import { AbsoluteFill } from "remotion";
import { C, FONT, FT } from "../../design/tokens";
import {
  PAD, M, pagesOf, Pages, Scene, SceneHead, Card, Body, Chip, Stat, Row, Formula,
  MiniTable, LinePlot, TemplatePlot, MlpNet, fmt4, fmtInt, fmtPct,
} from "../shared";

const sw = M.sweep;
const tr = M.tree;
const rl = M.real;
const an = M.anneal;

export const SMetrics: React.FC = () => {
  const at = pagesOf("metrics");
  return (
    <Scene id="metrics">
      <SceneHead id="metrics" />
      <Pages id="metrics" at={at}>
        {/* 页一：α 扫描表 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 292, width: 740 }}>
            <div style={{ fontFamily: FONT.serif, fontSize: FT.h1, color: C.ink, lineHeight: 1.18 }}>
              三个 α，
              <br />
              三张成绩单。
            </div>
            <Body style={{ marginTop: 20, width: 710 }}>
              合成数据上固定其余一切，只改 α 跑三遍：训练准确率和测试准确率都是满分，说明分类任务对 α 不敏感；模板落点误差反而略升，因为分类目标只要求「分得开」，不要求「长得像」。
            </Body>
            <div style={{ marginTop: 22, display: "flex", gap: 10 }}>
              <Chip color={C.cyan}>α=1 · {fmt4(sw[0].meanErr)}</Chip>
              <Chip color={C.amber}>α=10 · {fmt4(sw[1].meanErr)}</Chip>
              <Chip color={C.violet}>α=100 · {fmt4(sw[2].meanErr)}</Chip>
            </div>
          </div>
          <div style={{ position: "absolute", left: 860, top: 292, width: 980 }}>
            <Card label="α 扫描：三个档位" accent={C.cyan} pad={20}>
              <MiniTable
                head={["α", "训练准确率", "测试准确率", "平均落点误差", "末轮损失"]}
                colW={[150, 210, 210, 250, 210]}
                width={920}
                rowH={44}
                rows={sw.map((s) => [fmtInt(s.alpha), fmt4(s.trainAcc, 2), fmt4(s.testAcc, 2), fmt4(s.meanErr), fmt4(s.finalLoss)])}
              />
            </Card>
            <div style={{ marginTop: 14 }}>
              <Body color={C.inkDim}>
                误差的定义是：学到模板的落点与真实植入位置的距离（循环序列上的最短平移）。满分分类不代表精确落点。
              </Body>
            </div>
          </div>
        </AbsoluteFill>

        {/* 页二：模板误差表 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 292, width: 700 }}>
            <div style={{ fontFamily: FONT.serif, fontSize: FT.h1, color: C.ink, lineHeight: 1.18 }}>
              五个模板，
              <br />
              五种落点。
            </div>
            <Body style={{ marginTop: 20, width: 680 }}>
              退火训练出来的五个模板，长度分别是八、八、十二、十二、二十。落点误差从零点七八到三点一七，最好的是最长那个（长度二十）—— 长模板在软最小值下更容易被「推」到正确位置。
            </Body>
            <div style={{ marginTop: 18 }}>
              <Card label="最长的模板：误差 0.7987" accent={C.violet} pad={12}>
                <TemplatePlot values={an.templates[4].values} width={560} height={130} color={C.violet} label="长度 20 · 学到第 4 个模板" note={"落点误差 " + fmt4(an.templates[4].err) + " · 平移 " + an.templates[4].shift + " 点"} />
              </Card>
            </div>
          </div>
          <div style={{ position: "absolute", left: 800, top: 288, width: 1040 }}>
            <Card label="五个模板的落点误差（退火到 α = 200）" accent={C.amber} pad={18}>
              <MiniTable
                head={["序号", "长度", "落点误差", "最优位置", "循环误差", "平移"]}
                colW={[110, 110, 180, 170, 180, 130]}
                width={980}
                rowH={40}
                rows={an.templates.map((t, i) => ["#" + (i + 1), String(t.len), fmt4(t.err), String(t.bestPos), fmt4(t.cyclicErr), String(t.shift)])}
              />
            </Card>
            <div style={{ marginTop: 14 }}>
              <Body color={C.inkDim}>
                平均落点误差 {fmt4(an.meanErr)}。循环误差与落点误差的数值很接近，因为序列首尾相接后，末尾附近的采样会绕回开头。
              </Body>
            </div>
          </div>
        </AbsoluteFill>

        {/* 页三：树的两条曲线 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 292, width: 740 }}>
            <div style={{ fontFamily: FONT.serif, fontSize: FT.h1, color: C.ink, lineHeight: 1.18 }}>
              浅树就够，
              <br />
              但特征得选对。
            </div>
            <Body style={{ marginTop: 20, width: 710 }}>
              用五个学到的距离当特征训练决策树，深度二就到训练、测试全对。换成二十个原始点当特征，深度四才到拐点：训练零点九四四四、测试零点八六六七。特征好，树可以浅；特征差，深树只是在背样本。
            </Body>
            <div style={{ marginTop: 22, display: "flex", gap: 12 }}>
              <Chip color={C.cyan}>距离特征：深度 {tr.bestDepth} 满分</Chip>
              <Chip color={C.amber}>原始点：深度 {tr.rawBestDepth} · gap {fmt4(tr.rawGap)}</Chip>
            </div>
          </div>
          <div style={{ position: "absolute", left: 860, top: 286, width: 980 }}>
            <Card label="深度 vs 准确率：五距离特征（实线）与二十原始点（虚线）" accent={C.cyan} pad={16}>
              <LinePlot
                width={930}
                height={340}
                series={[
                  { name: "距离 · 测试", color: C.cyan, values: tr.testAcc },
                  { name: "距离 · 训练", color: C.cyan, values: tr.trainAcc, dash: true },
                  { name: "原始点 · 测试", color: C.amber, values: tr.rawTest },
                  { name: "原始点 · 训练", color: C.amber, values: tr.rawTrain, dash: true },
                ]}
                yFmt={(v) => v.toFixed(2)}
                vlines={[{ i: tr.bestDepth, color: C.cyan, label: "深度 2" }, { i: tr.rawBestDepth, color: C.amber, label: "深度 4" }]}
              />
            </Card>
          </div>
        </AbsoluteFill>

        {/* 页四：真实四读数 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 288, width: 720 }}>
            <div style={{ fontFamily: FONT.serif, fontSize: FT.display, color: C.cyan, lineHeight: 1 }}>{fmt4(rl.lsAcc)}</div>
            <Body style={{ marginTop: 18, width: 700 }}>
              一百五十只股票：四十五个训练窗、一百零五个测试窗。学到模板的准确率零点五五二四；上一集暴力搜索零点三四二九；DTW 最近邻零点五一四三；随机是零点三三三三。
            </Body>
            <div style={{ marginTop: 20 }}>
              <Card label="五个模板的平均落点误差" accent={C.violet} pad={18}>
                <Row name="平均误差" value={fmt4(rl.meanErr)} note="五个模板，一百零五条测试窗" color={C.violet} />
                <Row name="最好 / 最差" value={fmt4(Math.min(...rl.errors)) + " / " + fmt4(Math.max(...rl.errors))} note="逐模板分解" />
              </Card>
            </div>
          </div>
          <div style={{ position: "absolute", left: 880, top: 292, width: 960 }}>
            <Card label="四条路，同一批数据" accent={C.cyan} pad={22}>
              <Row
                name="随机猜"
                value={fmt4(rl.chance)}
                note="三类各 1/3"
              />
              <Row name="第 43 集：暴力搜索模板" value={fmt4(rl.searchBaseline)} note="不学，只搜" color={C.coral} />
              <Row name="DTW 1-NN（带宽 6）" value={fmt4(rl.dtwAcc)} note="不学模板，直接最近邻" color={C.violet} />
              <Row name="本集：SoftMin 学到的模板" value={fmt4(rl.lsAcc)} note="可导、可学" color={C.cyan} />
              <div style={{ marginTop: 14 }}>
                <Body color={C.inkDim} size={FT.meta}>
                  比搜索模板高 {fmtInt(Math.round((rl.lsAcc - rl.searchBaseline) * 105))} 条测试窗（{fmt4((rl.lsAcc - rl.searchBaseline) * 100, 1)} 个百分点）。
                </Body>
              </div>
            </Card>
          </div>
        </AbsoluteFill>

        {/* 页五：合成数据三条路线 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 292, width: 740 }}>
            <div style={{ fontFamily: FONT.serif, fontSize: FT.h1, color: C.ink, lineHeight: 1.18 }}>
              合成数据上
              <br />
              三条路线都接近满分。
            </div>
            <Body style={{ marginTop: 20, width: 710 }}>
              这里补一个对照：同样的合成数据，DTW 最近邻全对，SoftMin 学到的模板也全对，一个 100-16-3 的小 MLP 用二十个原始点的窗口拿到零点九六六七。这说明「能不能学会形状」在这个任务上不是瓶颈，真实数据才是。
            </Body>
            <div style={{ marginTop: 22, display: "flex", gap: 12 }}>
              <Chip color={C.cyan}>DTW · {fmt4(M.dtw.synthAcc, 2)}</Chip>
              <Chip color={C.amber}>MLP · {fmt4(M.mlp.testAcc)}</Chip>
              <Chip color={C.violet}>测试损失 {fmt4(M.mlp.testLoss)}</Chip>
            </div>
          </div>
          <div style={{ position: "absolute", left: 860, top: 292, width: 980 }}>
            <Card label="小 MLP 的结构：100 → 16 → 3" accent={C.amber} pad={18}>
              <MlpNet sizes={M.mlp.sizes} width={900} height={250} />
              <Row name="四十轮后的测试准确率" value={fmt4(M.mlp.testAcc)} note="合成数据六十条测试窗" color={C.amber} />
              <Row name="解析 / 数值梯度最大相对差" value={fmt4(M.mlp.gradCheck)} note="反传实现正确" color={C.cyan} />
            </Card>
          </div>
        </AbsoluteFill>
      </Pages>
    </Scene>
  );
};
