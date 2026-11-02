import React from "react";
import { AbsoluteFill } from "remotion";
import { C, FONT, FT } from "../../design/tokens";
import {
  PAD, M, pagesOf, Pages, Scene, SceneHead, Card, Body, Chip, Stat, Row,
  WeightSquares, Formula, fmt4, fmtPct,
} from "../shared";

const sm = M.softmin;
const nt = 93;

/** 93 个窗口里只有一个亮着：min 的梯度只从这里回来。 */
const OneHot: React.FC<{ width: number; hot: number }> = ({ width, hot }) => {
  const cell = 15, gap = 5, perRow = 31;
  const h = Math.ceil(nt / perRow) * (cell + gap);
  return (
    <svg width={width} height={h + 30} style={{ display: "block" }}>
      {Array.from({ length: nt }).map((_, i) => {
        const r = Math.floor(i / perRow), c = i % perRow;
        const on = i === hot;
        return (
          <rect
            key={i}
            x={c * (cell + gap)}
            y={r * (cell + gap)}
            width={cell}
            height={cell}
            rx={3}
            fill={on ? C.cyan : C.panel}
            stroke={on ? C.cyan : C.panelLine}
            strokeWidth={1}
          />
        );
      })}
      <text x={0} y={h + 22} fill={C.inkFaint} fontFamily={FONT.mono} fontSize={FT.micro}>{"93 个窗口 · 只有第 " + (hot + 1) + " 个拿到梯度"}</text>
    </svg>
  );
};

export const SProblem: React.FC = () => {
  const at = pagesOf("problem");
  return (
    <Scene id="problem">
      <SceneHead id="problem" />
      <Pages id="problem" at={at}>
        {/* 页一：min 只让一个窗口有梯度 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 292, width: 780 }}>
            <div style={{ fontFamily: FONT.serif, fontSize: FT.h1, color: C.ink, lineHeight: 1.18 }}>
              梯度只从
              <br />
              最小的窗口回来。
            </div>
            <Body style={{ marginTop: 22, width: 750 }}>
              min 对九十二个窗口的偏导是零，只对最小的那个窗口给梯度。这意味模板的任何参数只能收到一条序列里一小段的信号，其余位置的窗口被彻底忽略。模板于是变成了「从数据里截一段」，而不是「学一段」。
            </Body>
            <div style={{ marginTop: 24, display: "flex", gap: 12 }}>
              <Chip color={C.coral}>min 的零权重比例 {fmt4(sm.minZeroFrac)}</Chip>
              <Chip color={C.inkDim}>93 个窗口，92 个零</Chip>
            </div>
          </div>
          <div style={{ position: "absolute", left: 900, top: 300, width: 940 }}>
            <Card label="min 的梯度分布：一条序列一次只有一个窗口亮" accent={C.coral} pad={20}>
              <OneHot width={880} hot={40} />
            </Card>
          </div>
        </AbsoluteFill>

        {/* 页二：第 43 集的模板是截出来的 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 292, width: 780 }}>
            <div style={{ fontFamily: FONT.serif, fontSize: FT.h1, color: C.ink, lineHeight: 1.18 }}>
              上一集的模板，
              <br />
              是枚举出来的。
            </div>
            <Body style={{ marginTop: 22, width: 740 }}>
              第 43 集的做法：把每条序列、每个长度、每个起点组合出的候选全部摊开，逐个算信息增益，取最大的那个当模板。模板本身不是参数，是搜索结果。这一集要问：能不能不搜索，直接让梯度把模板调出来。
            </Body>
            <div style={{ marginTop: 24, display: "flex", gap: 12 }}>
              <Chip color={C.amber}>短处：穷举</Chip>
              <Chip color={C.cyan}>目标：可导</Chip>
            </div>
          </div>
          <div style={{ position: "absolute", left: 900, top: 292, width: 940 }}>
            <Card label="上一集的四步，只有最后一步能学" accent={C.amber} pad={22}>
              <Row name="枚举候选" value="序列 × 长度 × 起点" note="离散组合" />
              <Row name="逐个打分" value="一对其余信息增益" note="每个候选一次排序" />
              <Row name="取最大" value="argmax" note="不可导，无法回传" />
              <Row name="模板" value="固定下来" note="模型参数里没有它" color={C.coral} />
            </Card>
          </div>
        </AbsoluteFill>

        {/* 页三：SoftMin 的换法 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 288, width: 820 }}>
            <div style={{ fontFamily: FONT.serif, fontSize: FT.h1, color: C.ink, lineHeight: 1.18 }}>
              把 min 换成
              <br />
              一条软的最小值。
            </div>
            <Body style={{ marginTop: 20, width: 790 }}>
              距离向量是四个窗口的距离。SoftMin 把它们压成一个标量：离得近、α 又大时它逼近最小值，但不等于最小值 —— 所以每个窗口都还能分到一点权重，梯度可以从所有窗口回来。
            </Body>
            <div style={{ marginTop: 20 }}>
              <Card label="α = 1 时四个窗口的权重" accent={C.cyan} pad={16}>
                <WeightSquares rows={[sm.weights[0]]} width={760} labels={["窗口 1", "窗口 2", "窗口 3", "窗口 4"]} />
                <Body color={C.inkDim} size={FT.meta} style={{ marginTop: 6 }}>
                  距离越小权重越大，四个权重加起来正好是 1。
                </Body>
              </Card>
            </div>
          </div>
          <div style={{ position: "absolute", left: 900, top: 292, width: 940 }}>
            <Card label="min 与 SoftMin 的写法对照" accent={C.violet} pad={22}>
              <Formula size={FT.h2}>{"min(x) = x 里最小的那一个"}</Formula>
              <div style={{ height: 16 }} />
              <Formula size={FT.h2} color={C.cyan}>{"SoftMin(α; x) = −(1/α) log Σ exp(−α x_i)"}</Formula>
              <div style={{ height: 18 }} />
              <Row name="min 的权重" value="[1, 0, 0, 0]" note="其余窗口梯度为零" />
              <Row name="SoftMin 的权重" value="softmax(−α x)" note="四格全为正，和为一" color={C.cyan} />
            </Card>
          </div>
        </AbsoluteFill>

        {/* 页四：代价与悬念 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 292, width: 800 }}>
            <div style={{ fontFamily: FONT.serif, fontSize: FT.h1, color: C.ink, lineHeight: 1.18 }}>
              便宜，
              <br />
              但不是没有代价。
            </div>
            <Body style={{ marginTop: 22, width: 770 }}>
              这笔换法最直接的风险是数值下溢：α 越大，指数项越小，小到浮点数的下界以下就归零。归一化之后，那些窗口的权重会变成零 —— 这时 SoftMin 退化成硬 min。第二集的教训在这里又出现一次：算得出来，不等于算得对。
            </Body>
            <div style={{ marginTop: 24, display: "flex", gap: 12 }}>
              <Chip color={C.coral}>α=1000 时下溢比例 {fmtPct(sm.underflow[2].fraction, 1)}</Chip>
              <Chip color={C.amber}>代价：数值稳定性</Chip>
            </div>
          </div>
          <div style={{ position: "absolute", left: 920, top: 292, width: 920 }}>
            <Card label="下溢比例随 α 上升" accent={C.coral} pad={22}>
              <Row name="α = 200" value={fmtPct(sm.underflow[0].fraction, 1)} note="六个窗口里两个归零" />
              <Row name="α = 500" value={fmtPct(sm.underflow[1].fraction, 1)} note="四个归零" />
              <Row name="α = 1000" value={fmtPct(sm.underflow[2].fraction, 1)} note="五个归零，逼近硬 min" color={C.coral} />
            </Card>
            <div style={{ marginTop: 14 }}>
              <Body color={C.inkDim}>
                所以这一集用三段退火：α 从一慢慢升到二百，先让模板在软梯度下找到位置，再收紧到接近 min。剩下的问题：书里说的两条定量结论，实测能不能站住。
              </Body>
            </div>
          </div>
        </AbsoluteFill>
      </Pages>
    </Scene>
  );
};
