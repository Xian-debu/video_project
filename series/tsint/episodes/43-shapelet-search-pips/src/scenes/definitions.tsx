import React from "react";
import { AbsoluteFill } from "remotion";
import { C, FONT, FT } from "../../design/tokens";
import {
  PAD, M, pagesOf, Pages, Scene, SceneHead, Card, Body, Chip, Stat, Row, Verdict,
  SeriesBox, SlideCurve, SplitDots, PipFig, MiniTable, fmt4, fmtInt,
} from "../shared";

export const SDefinitions: React.FC = () => {
  const at = pagesOf("definitions");
  const g = M.gainSplit;
  return (
    <Scene id="definitions">
      <SceneHead id="definitions" />
      <Pages id="definitions" at={at}>
        {/* 页一：子序列与距离 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 292, width: 780 }}>
            <div style={{ fontFamily: FONT.serif, fontSize: FT.h1, color: C.ink, lineHeight: 1.2 }}>
              一段形状，
              <br />
              一条规则。
            </div>
            <Body style={{ marginTop: 22, width: 750 }}>
              一条序列 x 长度 n；候选片段 s 是 x 的连续子序列，长度 L，从位置 p 开始。s 对另一条序列 y 的距离，是 y 的所有窗口里、与 s 的 z 归一化欧氏距离的最小值。
            </Body>
            <div style={{ marginTop: 24, background: "#101823", border: "1px solid " + C.panelLine, borderRadius: 10, padding: "16px 20px", fontFamily: FONT.mono, fontSize: FT.body, color: C.ink, lineHeight: 1.8 }}>
              <div>s = x[p : p + L]</div>
              <div>z(v) = (v − mean(v)) / std(v)</div>
              <div style={{ color: C.cyan }}>{"d(s, y) = min_i || z(s) − z(y_i) ||"}</div>
            </div>
          </div>
          <div style={{ position: "absolute", left: 900, top: 292, width: 940 }}>
            <Card label="为什么归一化，为什么取最小" accent={C.cyan} pad={22}>
              <Row name="z 归一化" value="减均值、除标准差" note="幅度不该影响形状" width={880} />
              <Row name="取最小" value="min over windows" note="形状可以出现在任何位置" width={880} />
              <Row name="距离的含义" value="最像的那个窗口有多像" note="不是整条序列的平均相似度" width={880} />
            </Card>
            <div style={{ marginTop: 16 }}>
              <Card label="下一步：把距离变成分类" accent={C.amber} pad={20}>
                <Body>
                  有了距离就能排序：把九十条训练序列按到 s 的距离从小到大排，在某个位置切一刀，左边判正类，右边判负类。刀切在哪里，由信息熵决定。
                </Body>
              </Card>
            </div>
          </div>
        </AbsoluteFill>

        {/* 页二：排序 + 熵 + 阈值 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 292, width: 760 }}>
            <div style={{ fontFamily: FONT.serif, fontSize: FT.h1, color: C.ink, lineHeight: 1.2 }}>
              排序，切一刀，
              <br />
              算增益。
            </div>
            <Body style={{ marginTop: 20, width: 730 }}>
              两类时熵最大是一 bit，当两类各半。增益等于父熵减去左右子熵的加权平均，权重是两边样本数占全体的比例。三分类对每类各做一次一对其余，取最大的那个。
            </Body>
            <div style={{ marginTop: 16, background: "#101823", border: "1px solid " + C.panelLine, borderRadius: 10, padding: "14px 18px", fontFamily: FONT.mono, fontSize: FT.meta, color: C.ink, lineHeight: 1.75 }}>
              <div>H(S) = − Σ p log₂ p</div>
              <div>Gain = H(S) − (|L|/|S|)H(L) − (|R|/|S|)H(R)</div>
              <div style={{ color: C.cyan }}>t = (d_k + d_(k+1)) / 2 ，只在 d_k &lt; d_(k+1) 处切</div>
            </div>
          </div>
          <div style={{ position: "absolute", left: 880, top: 280, width: 960 }}>
            <Card label="最优分裂：距离轴上的 59 与 31" accent={C.coral} pad={18}>
              <SplitDots pos={g.posDist} neg={g.negDist} threshold={g.threshold} width={900} height={230} posLabel="第 3 类（30 条）" negLabel="其余 59 条" />
              <div style={{ display: "flex", justifyContent: "space-between", fontFamily: FONT.mono, fontSize: FT.micro, color: C.inkFaint }}>
                <span>距离 0</span>
                <span style={{ color: C.coral }}>阈值 {fmt4(g.threshold)}</span>
                <span>距离 2.2</span>
              </div>
            </Card>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14, marginTop: 14 }}>
              <Stat label="左 59 条" value={String(g.left)} sub="其中正类 0 条" valueColor={C.inkDim} valueSize={32} />
              <Stat label="右 31 条" value={String(g.right)} sub="其中正类 30 条" valueColor={C.amber} valueSize={32} />
              <Stat label="增益" value={fmt4(g.gain)} sub="bit，本集最优" valueColor={C.cyan} valueSize={32} />
            </div>
          </div>
        </AbsoluteFill>

        {/* 页三：方向 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 292, width: 760 }}>
            <div style={{ fontFamily: FONT.serif, fontSize: FT.h1, color: C.ink, lineHeight: 1.2 }}>
              距离小像它，
              <br />
              距离大也可能像它。
            </div>
            <Body style={{ marginTop: 20, width: 730 }}>
              通常假设距离小才像这个类。但增益对方向是对称的：把正类放在阈值右边，同样能拿高分。这叫反向 shapelet。本集的最优模板就来自第一类序列，却对第三类分裂最好。
            </Body>
            <div style={{ marginTop: 22, display: "flex", gap: 12, flexWrap: "wrap" }}>
              <Chip color={C.cyan}>正向：d ≤ t 判正类</Chip>
              <Chip color={C.amber}>反向：d &gt; t 判正类</Chip>
            </div>
            <div style={{ marginTop: 22 }}>
              <Card label="第三类的距离全部大于 1.2866" accent={C.amber} pad={18}>
                <Body>
                  第一、二类全在 1.2036 以下。分界线正好把第三类隔离在外 —— 第三类里没有这段八周期形状，所以距离反而大。
                </Body>
              </Card>
            </div>
          </div>
          <div style={{ position: "absolute", left: 880, top: 292, width: 960 }}>
            <Card label="Top-5：全是长度 8，全来自第 1 条序列" accent={C.violet} pad={18}>
              <MiniTable
                head={["起点", "长度", "来源序列", "命中类别", "增益", "阈值"]}
                colW={[110, 100, 150, 170, 150, 160]}
                width={900}
                rowH={34}
                rows={M.top5.map((t) => [String(t.start), String(t.len), "#" + t.series, "第 " + (t.class + 1) + " 类", fmt4(t.gain), fmt4(t.threshold)])}
              />
            </Card>
            <div style={{ marginTop: 16 }}>
              <Card label="分类器必须知道方向" accent={C.coral} pad={20}>
                <Body>
                  本集的分类器只用同类模板，所以反向模板没有参与预测。这是一个可以改进的地方，也是后面一集把 min 换成 SoftMin 的动机之一。
                </Body>
              </Card>
            </div>
          </div>
        </AbsoluteFill>

        {/* 页四：PIPs */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 292, width: 720 }}>
            <div style={{ fontFamily: FONT.serif, fontSize: FT.h1, color: C.ink, lineHeight: 1.2 }}>
              十个拐点，
              <br />
              一百个点。
            </div>
            <Body style={{ marginTop: 20, width: 690 }}>
              PIP 是感知重要点。做法很贪心：先取首尾两点；每轮找离当前折线最远的那个点，加进来，重画折线，再找。取十个点，就把一百点压成十个拐点。
            </Body>
            <div style={{ marginTop: 20, fontFamily: FONT.mono, fontSize: FT.body, color: C.inkDim, lineHeight: 1.8 }}>
              <div>1 · 取首尾</div>
              <div>2 · 找最大偏差点</div>
              <div>3 · 加入，重画折线</div>
              <div style={{ color: C.cyan }}>4 · 重复到 10 个点</div>
            </div>
          </div>
          <div style={{ position: "absolute", left: 840, top: 286, width: 1000 }}>
            <Card label="一条真实序列的十个拐点" accent={C.amber} pad={18}>
              <PipFig series={M.pipsDemo.series} pips={M.pipsDemo.pips} reconstruct={M.pipsDemo.reconstruct} width={950} height={250} />
            </Card>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14, marginTop: 14 }}>
              <Stat label="拐点位置" value={M.pipsDemo.pips.slice(0, 5).join(", ")} sub="前十之外还有 29, 33, 38, 42, 99" valueColor={C.amber} valueSize={26} />
              <Stat label="重构 RMSE" value={fmt4(M.pipsDemo.rmse)} sub="十个折点拟合一百点" valueColor={C.cyan} valueSize={32} />
              <Stat label="均匀取点" value={fmt4(M.pipsDemo.rmseUniform)} sub="同样十个点，均匀分布" valueColor={C.inkDim} valueSize={32} />
            </div>
          </div>
        </AbsoluteFill>

        {/* 页五：两个检验 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 292, width: 760 }}>
            <div style={{ fontFamily: FONT.serif, fontSize: FT.h1, color: C.ink, lineHeight: 1.2 }}>
              两个检验，
              <br />
              两套假设。
            </div>
            <Body style={{ marginTop: 20, width: 730 }}>
              ANOVA 的 F 比组间均方和组内均方，假设各组正态、方差齐。Kruskal 的 H 先把所有值换成秩，再比秩和，不假设正态。所以它们会在同一批数据上给出相反的结论。
            </Body>
            <div style={{ marginTop: 20 }}>
              <Chip color={C.cyan}>F：均值差</Chip>{" "}
              <Chip color={C.amber}>H：秩的差</Chip>
            </div>
          </div>
          <div style={{ position: "absolute", left: 880, top: 292, width: 980 }}>
            <Card label="F 统计量" accent={C.cyan} pad={22}>
              <div style={{ fontFamily: FONT.mono, fontSize: FT.lead, color: C.ink }}>F = MSB / MSW</div>
              <div style={{ marginTop: 8, fontFamily: FONT.mono, fontSize: FT.meta, color: C.inkFaint }}>MSB = SSB / (k−1) · MSW = SSW / (N−k) · p 走 F 分布</div>
            </Card>
            <div style={{ marginTop: 14 }}>
              <Card label="H 统计量" accent={C.amber} pad={22}>
                <div style={{ fontFamily: FONT.mono, fontSize: FT.lead, color: C.ink }}>H = 12/(N(N+1)) · Σ n_i (R̄_i − (N+1)/2)²</div>
                <div style={{ marginTop: 8, fontFamily: FONT.mono, fontSize: FT.meta, color: C.inkFaint }}>并列值取平均秩，再做并列校正 · p 走卡方分布，自由度 k−1</div>
              </Card>
            </div>
          </div>
        </AbsoluteFill>
      </Pages>
    </Scene>
  );
};
