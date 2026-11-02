import React from "react";
import { AbsoluteFill } from "remotion";
import { C, FONT, FT } from "../../design/tokens";
import {
  PAD, M, pagesOf, Pages, Scene, SceneHead, Card, Body, Chip, Stat, Row, Verdict, Formula,
  MiniTable, LinePlot, WeightSquares, CheckGrid, MlpNet, fmt4, fmtInt, fmtPct, checkGroups,
} from "../shared";

const sm = M.softmin;
const sw = M.sweep;
const an = M.anneal;
const st = M.stall;
const mt = M.meta;

export const SVerification: React.FC = () => {
  const at = pagesOf("verification");
  return (
    <Scene id="verification">
      <SceneHead id="verification" />
      <Pages id="verification" at={at}>
        {/* 页一：证据总览 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 292, width: 780 }}>
            <div style={{ fontFamily: FONT.serif, fontSize: FT.h1, color: C.ink, lineHeight: 1.18 }}>
              证据程序，
              <br />
              三十五组全过。
            </div>
            <Body style={{ marginTop: 20, width: 750 }}>
              {fmtInt(mt.tests.assertions)} 条单元断言证明代码没坏，{mt.evidence.checks} 组证据检查证明读数没算错。两组都跑，才敢说「这个数是测出来的」。证据耗时 {fmt4(mt.evidence.seconds, 1)} 秒，分组如下。
            </Body>
            <div style={{ marginTop: 22, display: "flex", flexWrap: "wrap", gap: 10, width: 760 }}>
              {checkGroups().map((g) => (
                <Chip key={g.g} color={C.cyan}>{g.g} {g.pass}/{g.total}</Chip>
              ))}
            </div>
          </div>
          <div style={{ position: "absolute", left: 920, top: 292, width: 900 }}>
            <Card label={mt.evidence.passed + " / " + mt.evidence.checks + " 组检查"} accent={C.cyan} pad={22}>
              <CheckGrid width={840} />
              <div style={{ marginTop: 18, display: "flex", gap: 14 }}>
                <Stat label="检查" value={mt.evidence.passed + " / " + mt.evidence.checks} sub="全部通过" valueColor={C.cyan} valueSize={34} />
                <Stat label="耗时" value={fmt4(mt.evidence.seconds, 1) + " s"} sub="含全搜索与训练" valueColor={C.amber} valueSize={34} />
              </div>
            </Card>
          </div>
        </AbsoluteFill>

        {/* 页二：黄金值 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 292, width: 800 }}>
            <div style={{ fontFamily: FONT.serif, fontSize: FT.h1, color: C.ink, lineHeight: 1.18 }}>
              先钉住
              <br />
              一个黄金值。
            </div>
            <Body style={{ marginTop: 20, width: 770 }}>
              三个窗口距离全为零、α 等于一时，SoftMin 必须等于负的自然对数三。这个数写死在测试里，实现错一位就对不上。第二项检查是 α 放大到一百万时它必须贴近 min，第三项是梯度之和必须是一。
            </Body>
            <div style={{ marginTop: 20 }}>
              <Card label="三行都通过" accent={C.cyan} pad={18}>
                <Row name="三个零距离，α = 1" value={fmt4(sm.golden)} note="= −log 3" color={C.cyan} />
                <Row name="α = 1e6 与 min 的差" value={sm.alphaBig.toExponential(2)} note="小于 1e-5" />
                <Row name="四个权重的和" value={fmt4(sm.gradSum, 4)} note="解析梯度与数值梯度差 0" color={C.cyan} />
              </Card>
            </div>
          </div>
          <div style={{ position: "absolute", left: 900, top: 292, width: 920 }}>
            <Card label="同一公式的两次校验" accent={C.violet} pad={22}>
              <Formula size={36} color={C.cyan}>{"SoftMin(1; [0,0,0]) = −log 3"}</Formula>
              <div style={{ height: 14 }} />
              <Formula size={30} color={C.inkDim}>{"|SoftMin(1e6; x) − min(x)| < 1e-5"}</Formula>
              <div style={{ height: 14 }} />
              <Formula size={30} color={C.inkDim}>{"Σ_i ∂SoftMin/∂x_i = 1"}</Formula>
              <div style={{ marginTop: 16 }}>
                <Body color={C.inkDim}>
                  三条都是可以手算的恒等式，不依赖数据。数据相关的结果放在后面几页。
                </Body>
              </div>
            </Card>
          </div>
        </AbsoluteFill>

        {/* 页三：权重随着 α 变硬 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 292, width: 800 }}>
            <div style={{ fontFamily: FONT.serif, fontSize: FT.h1, color: C.ink, lineHeight: 1.18 }}>
              α 一放大，
              <br />
              权重就往一个窗口上塌。
            </div>
            <Body style={{ marginTop: 20, width: 770 }}>
              同样四个距离零、零点五、一、一点五：α 等于一时四个窗口权重是零点四六、零点二八、零点一七、零点一零；α 到了二十，第一个窗口就是一点零零，其余归零。这就是「软到硬」的定量形状。
            </Body>
            <div style={{ marginTop: 20, display: "flex", gap: 12 }}>
              <Chip color={C.coral}>min 的零权重 {fmt4(sm.minZeroFrac)}</Chip>
              <Chip color={C.cyan}>SoftMin α=1：四格全正</Chip>
            </div>
          </div>
          <div style={{ position: "absolute", left: 900, top: 292, width: 920 }}>
            <Card label="三个 α 下的四个窗口权重" accent={C.cyan} pad={22}>
              <WeightSquares rows={sm.weights} width={840} labels={["窗口 1", "窗口 2", "窗口 3", "窗口 4"]} />
              <div style={{ marginTop: 10 }}>
                <Body color={C.inkDim} size={FT.meta}>
                  距离向量固定为 [0, 0.5, 1, 1.5]。α 增大时，权重向最近的窗口集中，和 min 的 one-hot 越来越像。
                </Body>
              </div>
            </Card>
          </div>
        </AbsoluteFill>

        {/* 页四：α 扫描 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 292, width: 740 }}>
            <div style={{ fontFamily: FONT.serif, fontSize: FT.h1, color: C.ink, lineHeight: 1.18 }}>
              三档 α，
              <br />
              分类全对。
            </div>
            <Body style={{ marginTop: 20, width: 710 }}>
              合成数据上，α 从一到一百，训练与测试准确率全部一点零零；落点误差却从一点八一一三升到二点一四一五。分类目标已经满足，模板还原真实形状的精度反而下降 —— 这是「优化目标决定学到什么」的最直接证据。
            </Body>
            <div style={{ marginTop: 22, display: "flex", gap: 10 }}>
              <Chip color={C.cyan}>α=1 · 1.8113</Chip>
              <Chip color={C.amber}>α=10 · 2.1242</Chip>
              <Chip color={C.violet}>α=100 · 2.1415</Chip>
            </div>
          </div>
          <div style={{ position: "absolute", left: 860, top: 292, width: 980 }}>
            <Card label="α 扫描：三个档位的完整读数" accent={C.amber} pad={20}>
              <MiniTable
                head={["α", "训练准确率", "测试准确率", "平均落点误差", "末轮损失", "零梯度比例"]}
                colW={[110, 190, 190, 220, 170, 170]}
                width={920}
                rowH={44}
                rows={sw.map((s) => [fmtInt(s.alpha), fmt4(s.trainAcc, 2), fmt4(s.testAcc, 2), fmt4(s.meanErr), fmt4(s.finalLoss), fmt4(s.gradZeroFrac, 2)])}
              />
            </Card>
          </div>
        </AbsoluteFill>

        {/* 页五：退火 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 288, width: 760 }}>
            <div style={{ fontFamily: FONT.serif, fontSize: FT.h1, color: C.ink, lineHeight: 1.18 }}>
              退火把损失
              <br />
              从一点四四压到零点零一。
            </div>
            <Body style={{ marginTop: 20, width: 730 }}>
              三十轮，α 分三档：一到八轮 alpha 等于一，九到二十轮等于二十，之后等于二百。损失在换档处有一次明显上跳，然后继续下降到底。最后训练、测试准确率都是满分，五个模板的落点误差平均一点八二零一。
            </Body>
            <div style={{ marginTop: 22, display: "flex", gap: 12 }}>
              <Chip color={C.cyan}>损失 {fmt4(an.losses[0], 4)} → {fmt4(an.losses[an.losses.length - 1], 4)}</Chip>
              <Chip color={C.amber}>测试准确率 {fmt4(an.testAcc, 2)}</Chip>
            </div>
          </div>
          <div style={{ position: "absolute", left: 860, top: 280, width: 980 }}>
            <Card label="三十轮的训练损失：换档处上跳，随后继续降" accent={C.cyan} pad={16}>
              <LinePlot
                width={930}
                height={340}
                series={[{ name: "训练损失", color: C.cyan, values: an.losses }]}
                yFmt={(v) => v.toFixed(2)}
                vlines={[{ i: 8, color: C.amber, label: "α → 20" }, { i: 20, color: C.violet, label: "α → 200" }]}
              />
            </Card>
          </div>
        </AbsoluteFill>

        {/* 页六：α=1000 没停 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 292, width: 780 }}>
            <div style={{ fontFamily: FONT.serif, fontSize: FT.h1, color: C.ink, lineHeight: 1.18 }}>
              α 到一千，
              <br />
              训练也没停。
            </div>
            <Body style={{ marginTop: 20, width: 750 }}>
              按计划，α 超过五百梯度下溢、训练会停住。实测：十二轮里损失从一点六二零五降到零点零七三一，降了九成五，测试准确率一点零零。原因是下溢只把非最小窗口的权重压成零，梯度仍从最小那个窗口回来 —— SoftMin 退化成 min，但没有断流。
            </Body>
            <div style={{ marginTop: 22, display: "flex", gap: 12 }}>
              <Chip color={C.cyan}>损失 {fmt4(st.lossStart, 4)} → {fmt4(st.lossEnd, 4)}</Chip>
              <Chip color={C.coral}>计划 vs 实测：结论相反</Chip>
            </div>
          </div>
          <div style={{ position: "absolute", left: 920, top: 292, width: 900 }}>
            <Card label="α = 1000 的十二轮" accent={C.coral} pad={22}>
              <Row name="损失下降" value={fmt4(st.lossChangePct, 1) + "%"} note="没有停住" color={C.cyan} />
              <Row name="测试准确率" value={fmt4(st.testAcc, 2)} note="仍然满分" color={C.cyan} />
              <Row name="权重为零的比例" value={fmt4(st.weightZeroFrac)} note="下溢确实发生了" color={C.coral} />
              <Row name="α = 1 时的零权重比例" value={fmt4(st.weightZeroFracAlpha1)} note="软的时候一个都没归零" />
            </Card>
          </div>
        </AbsoluteFill>

        {/* 页七：树与 MLP */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 288, width: 740 }}>
            <div style={{ fontFamily: FONT.serif, fontSize: FT.h1, color: C.ink, lineHeight: 1.18 }}>
              好的特征
              <br />
              让树变浅。
            </div>
            <Body style={{ marginTop: 20, width: 710 }}>
              五个学到的距离当特征，决策树深度二就到训练、测试全对；二十个原始点当特征，深度四才到拐点，训练零点九四四四、测试零点八六六七，差七点七八个百分点。同一个模型，特征换了，过拟合的门槛完全不同。
            </Body>
            <div style={{ marginTop: 22, display: "flex", gap: 12 }}>
              <Chip color={C.cyan}>距离特征：深度 {M.tree.bestDepth} · {fmt4(M.tree.bestTest, 2)}</Chip>
              <Chip color={C.amber}>原始点：深度 {M.tree.rawBestDepth} · {fmt4(M.tree.rawGap)}</Chip>
            </div>
          </div>
          <div style={{ position: "absolute", left: 860, top: 286, width: 980 }}>
            <Card label="深度 vs 测试准确率" accent={C.amber} pad={16}>
              <LinePlot
                width={930}
                height={290}
                series={[
                  { name: "距离特征 · 测试", color: C.cyan, values: M.tree.testAcc },
                  { name: "原始点 · 测试", color: C.amber, values: M.tree.rawTest },
                ]}
                yFmt={(v) => v.toFixed(2)}
                vlines={[{ i: M.tree.bestDepth, color: C.cyan, label: "2" }, { i: M.tree.rawBestDepth, color: C.amber, label: "4" }]}
              />
            </Card>
            <div style={{ marginTop: 12 }}>
              <Card label="分类头：100 → 16 → 3 的小 MLP" accent={C.violet} pad={14}>
                <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
                  <MlpNet sizes={M.mlp.sizes} width={520} height={160} />
                  <div>
                    <Row name="准确率" value={fmt4(M.mlp.testAcc)} note="合成" color={C.amber} />
                    <Row name="梯度差" value={fmt4(M.mlp.gradCheck)} note="一致" color={C.cyan} />
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </AbsoluteFill>
      </Pages>
    </Scene>
  );
};
