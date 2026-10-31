import React from "react";
import { Build } from "../../design/primitives";
import { C, FONT, FT } from "../../design/tokens";
import { Body, Card, Chip, K, M, PAD, Pages, Scene, SceneHead, Stat, lf } from "../shared";

/* 边界：五条不能说的话；指标是压缩，压缩就有损。 */

const Limit: React.FC<{ n: string; title: string; text: string; color?: string }> = ({ n, title, text, color = C.coral }) => (
  <div style={{ display: "flex", gap: 16, alignItems: "flex-start", marginTop: 14 }}>
    <div style={{ width: 40, fontFamily: FONT.mono, fontSize: FT.h2, color, lineHeight: 1.1 }}>{n}</div>
    <div style={{ flex: 1 }}>
      <div style={{ fontFamily: FONT.sans, fontSize: FT.body, color: C.ink }}>{title}</div>
      <Body size={FT.meta} style={{ marginTop: 4 }}>{text}</Body>
    </div>
  </div>
);

export const SBoundary: React.FC = () => {
  const s = M.stats;
  return (
    <Scene id="boundary">
      <SceneHead id="boundary" />
      <Pages id="boundary" at={[0, 0.26, 0.5, 0.68, 0.88]}>
        <div>
          <div style={{ position: "absolute", left: PAD, top: 236, fontFamily: FONT.sans, fontSize: FT.h2, color: C.inkDim }}>
            最后说边界，五条不能说的话。第一条：τ 不是 p 值。
          </div>
          <Build at={lf("boundary", 0.03)}>
            <div style={{ position: "absolute", left: PAD, top: 306, width: 1120 }}>
              <Card label="临界值表的假设" accent={C.coral} style={{ height: 350 }}>
                <Limit n="1" title="τ 不是 p 值" text="拿 τ 和 0.05 比，是这一集开头那件真事；错不在符号，在读法。" />
                <Limit n="1a" title="临界值表是大样本渐近的" text="样本小的时候，表上的临界值更负；按大样本表判，会偏保守。" color={C.amber} />
                <Limit n="1b" title="我们没做小样本修正" text="没有 bootstrap，也没有有限样本表；用的是书里那三档渐近值。" color={C.amber} />
              </Card>
            </div>
          </Build>
          <Build at={lf("boundary", 0.12)}>
            <div style={{ position: "absolute", left: PAD + 1184, top: 306, width: 592 }}>
              <Stat label="5% 临界值" accent={C.coral} value="−2.86" sub="大样本；小样本更负" valueColor={C.coral} style={{ height: 156 }} />
              <Stat label="样本" accent={C.amber} value={String(s.adf.nobs_level)} sub="234 个有效观测；不算大" style={{ height: 156, marginTop: 14 }} />
            </div>
          </Build>
          <Build at={lf("boundary", 0.2)}>
            <div style={{ position: "absolute", left: PAD, top: 696, fontFamily: FONT.sans, fontSize: FT.body, color: C.inkDim }}>
              所以 τ 只能当参考，不能当判决书；它不给二值的「平稳 / 不平稳」。
            </div>
          </Build>
        </div>

        <div>
          <div style={{ position: "absolute", left: PAD, top: 236, fontFamily: FONT.sans, fontSize: FT.h2, color: C.inkDim }}>
            第二条：漂移性的零点五，不是安全。
          </div>
          <Build at={lf("boundary", 0.3)}>
            <div style={{ position: "absolute", left: PAD, top: 306, width: 1120 }}>
              <Card label="为什么零点五不能直接信" accent={C.amber} style={{ height: 350 }}>
                <Limit n="2" title="单边趋势也是零点五" text="一条一直涨的直线，指标给 0.4977；它不告诉你「有没有漂移」。" color={C.amber} />
                <Limit n="2a" title="换个窗口，数就变" text="同一只股票：0.1642、0.2519、0.6925；从零点一六到零点六九，差四倍。" color={C.coral} />
                <Limit n="2b" title="m 和归一化区间，书里都没给" text="我们选 m = 9，用九个中位数自身的范围归一化；换一下，数就变。" color={C.amber} />
              </Card>
            </div>
          </Build>
          <Build at={lf("boundary", 0.4)}>
            <div style={{ position: "absolute", left: PAD + 1184, top: 306, width: 592 }}>
              <Stat label="三个窗口" accent={C.coral} value="0.16 → 0.69" sub="同一只股票，换窗口就换数" valueColor={C.coral} style={{ height: 180 }} />
              <Card label="结论" accent={C.cyan} style={{ height: 154, marginTop: 14 }}>
                <Chip color={C.cyan}>只能同口径比较</Chip>
                <Body size={FT.meta} style={{ marginTop: 10 }}>跨窗口、跨 m、跨归一化，都不行。</Body>
              </Card>
            </div>
          </Build>
          <Build at={lf("boundary", 0.46)}>
            <div style={{ position: "absolute", left: PAD, top: 696, fontFamily: FONT.sans, fontSize: FT.body, color: C.inkDim }}>
              所以这个数只说明形状；不说明漂移的强弱，也不说明有没有漂移。
            </div>
          </Build>
        </div>

        <div>
          <div style={{ position: "absolute", left: PAD, top: 236, fontFamily: FONT.sans, fontSize: FT.h2, color: C.inkDim }}>
            第三条：转移性的九分之二，也不是稳定。
          </div>
          <Build at={lf("boundary", 0.54)}>
            <div style={{ position: "absolute", left: PAD, top: 306, width: 1120 }}>
              <Card label="三个脆的地方" accent={C.coral} style={{ height: 360 }}>
                <Limit n="3" title="九分之二是「两行是零行」的结果" text="常数序列 900 个点全在状态 1；两行零行把列方差拉到 1/9。" color={C.coral} />
                <Limit n="3a" title="零行补成均匀行，数就变" text="补均匀之后，常数序列的三列方差不再是 1/9；九分之二也就不成立。" color={C.amber} />
                <Limit n="3b" title="状态数固定三，换成四，数也变" text="分箱个数一改，转移矩阵和列方差都跟着改。" color={C.amber} />
              </Card>
            </div>
          </Build>
          <Build at={lf("boundary", 0.62)}>
            <div style={{ position: "absolute", left: PAD + 1184, top: 306, width: 592 }}>
              <Card label="分箱边界也很脆" accent={C.coral} style={{ height: 360 }}>
                <Body>我们试过 0.15 这个数：它本该落在第二格，浮点误差让它落回第一格。</Body>
                <div style={{ fontFamily: FONT.mono, fontSize: FT.body, color: C.coral, marginTop: 14 }}>1/3 → 1/3 以下</div>
                <Body size={FT.meta} style={{ marginTop: 10 }}>这不是理论上的可能，是实测；所以分箱规则必须写死，不能顺手改。</Body>
              </Card>
            </div>
          </Build>
        </div>

        <div>
          <div style={{ position: "absolute", left: PAD, top: 236, fontFamily: FONT.sans, fontSize: FT.h2, color: C.inkDim }}>
            第四条：ADF 的三个假设；tau 只能是参考。
          </div>
          <Build at={lf("boundary", 0.72)}>
            <div style={{ position: "absolute", left: PAD, top: 306, width: 1120 }}>
              <Card label="三个假设" accent={C.coral} style={{ height: 350 }}>
                <Limit n="4" title="用滞后项吸收自相关" text="滞后阶选得不合适，残差还有结构；τ 的分布就不再是表上的那个。" />
                <Limit n="4a" title="异方差和结构突变，我们没处理" text="价格波动聚集、政策断点，都可能把结论带偏；临界值表也不管这些。" color={C.amber} />
                <Limit n="4b" title="临界值表本身也有边界" text="表是对特定回归型、特定样本量渐近成立的；换设定要换表。" color={C.amber} />
              </Card>
            </div>
          </Build>
          <Build at={lf("boundary", 0.8)}>
            <div style={{ position: "absolute", left: PAD + 1184, top: 306, width: 592 }}>
              <Stat label="tau 的性质" accent={C.amber} value="参考" sub="概率性的说法，不是二值判决" style={{ height: 156 }} />
              <Stat label="不做的事" accent={C.coral} value="预测" sub="三个指标都不给明天涨还是跌" valueColor={C.coral} style={{ height: 156, marginTop: 14 }} />
            </div>
          </Build>
          <Build at={lf("boundary", 0.85)}>
            <div style={{ position: "absolute", left: PAD, top: 696, fontFamily: FONT.sans, fontSize: FT.body, color: C.inkDim }}>
              第五条：三个指标都不给预测；它们描述序列的性质，不告诉你明天涨还是跌。
            </div>
          </Build>
        </div>

        <div>
          <div style={{ position: "absolute", left: PAD, top: 236, fontFamily: FONT.sans, fontSize: FT.h2, color: C.inkDim }}>
            五条边界，其实是一句话：指标是压缩，压缩就有损。
          </div>
          <Build at={lf("boundary", 0.9)}>
            <div style={{ position: "absolute", left: PAD, top: 312, display: "flex", gap: 26 }}>
              <Stat label="第一条" accent={C.coral} value="τ ≠ p" sub="临界值表是大样本渐近的；没做小样本修正" style={{ width: 424, height: 220 }} />
              <Stat label="第二条" accent={C.amber} value="0.5 ≠ 安全" sub="单边趋势也 0.5；换窗口 0.16–0.69" style={{ width: 424, height: 220 }} />
              <Stat label="第三条" accent={C.violet} value="2/9 ≠ 稳定" sub="零行、状态数、分箱边界都会改数" style={{ width: 424, height: 220 }} />
              <Stat label="第四、五条" accent={C.cyan} value="不给判决" sub="三个假设都成立才是表上的结论；都不给预测" style={{ width: 424, height: 220 }} />
            </div>
          </Build>
          <Build at={lf("boundary", 0.96)}>
            <div style={{ position: "absolute", left: PAD, top: 576, width: 1776 }}>
              <Card accent={C.coral} style={{ height: 150 }}>
                <div style={{ fontFamily: FONT.sans, fontSize: FT.h2, color: C.ink }}>它把一条序列压成一个数；压掉的东西，比留下的多。</div>
                <K style={{ display: "block", marginTop: 10 }}>画面上的每个数，都带着自己的适用条件</K>
              </Card>
            </div>
          </Build>
          <Build at={lf("boundary", 0.99)}>
            <div style={{ position: "absolute", left: PAD, top: 768, fontFamily: FONT.sans, fontSize: FT.body, color: C.inkDim }}>
              换个窗口，换个口径，换个状态数；这三个数就都变了。
            </div>
          </Build>
        </div>
      </Pages>
    </Scene>
  );
};
