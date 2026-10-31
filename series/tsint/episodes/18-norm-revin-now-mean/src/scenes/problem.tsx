import React from "react";
import { C, FONT, FT } from "../../design/tokens";
import { Body, CW, Card, Chip, Formula, Head, K, M, PAD, Pages, Row, Stat } from "../shared";

const P1: React.FC = () => (
  <>
    <Head kicker="02 / 问题" title="三句话，五个没答" goal="书里只有文字" />
    <div style={{ position: "absolute", left: PAD, top: 330, width: 860 }}>
      <Card label="p.45 · NLinear" accent={C.cyan} style={{ height: 250 }}>
        <Body size={FT.body} color={C.ink} style={{ fontFamily: FONT.serif }}>
          「先用序列的最后一个值减去输入，经过一个线性层后再加回减去的部分。」
        </Body>
        <div style={{ marginTop: 16 }}><Chip color={C.cyan}>[15] 称 NowNorm</Chip></div>
      </Card>
    </div>
    <div style={{ position: "absolute", left: PAD + 890, top: 330, width: CW - 890 }}>
      <Card label="p.46 · SparseTSF" accent={C.amber} style={{ height: 250 }}>
        <Body size={FT.body} color={C.ink} style={{ fontFamily: FONT.serif }}>
          「减去序列本身的均值，输出模型之后再加回减去的部分。」
        </Body>
        <div style={{ marginTop: 16 }}><Chip color={C.amber}>[18] 称 MeanNorm</Chip></div>
      </Card>
    </div>
    <div style={{ position: "absolute", left: PAD, top: 620, width: CW }}>
      <div style={{ fontFamily: FONT.mono, fontSize: FT.label, color: C.coral, marginBottom: 6 }}>五个没答</div>
      <Row name="减均值：整条序列还是窗口" value="没说" color={C.coral} note="统计窗决定能不能防泄漏" />
      <Row name="除标准差：哪一个标准差" value="没说" color={C.coral} note="总体还是样本，除以 H 还是 H−1" />
      <Row name="方差为零时怎么办" value="没说" color={C.coral} note="没有 eps，停牌段会除以零" />
      <Row name="仿射的两个参数" value="没说" color={C.coral} note="初值、是否可学、反变换怎么反" />
      <Row name="反变换用哪组统计量" value="没说" color={C.coral} note="重算就不是同一次变换" />
      <div style={{ marginTop: 26 }}>
        <Body size={FT.lead} color={C.ink}>
          五个问题，书里一个都没答。这一集把它们全部写死。
        </Body>
      </div>
    </div>
  </>
);

const P2: React.FC = () => (
  <>
    <Head kicker="02 / 问题" title="表 3.1：六行，五种做法" goal="同一个骨架，不同的 base" />
    <div style={{ position: "absolute", left: PAD, top: 340, width: CW }}>
      <Row name="TSMixer · RLinear · TimeMixer" value="可逆实例归一化" color={C.cyan} note="减均值、除标准差，带仿射" />
      <Row name="NLinear" value="NowNorm" color={C.violet} note="只减末值，过一个线性层再加回" />
      <Row name="SparseTSF" value="MeanNorm" color={C.amber} note="只减均值，不除标准差" />
      <Row name="DLinear" value="不用归一化" color={C.coral} note="表里唯一留空的" />
      <Row name="FITS" value="实例归一化" color={C.inkDim} note="减均值除标准差，但没有仿射" />
      <div style={{ marginTop: 34, display: "flex", gap: 22 }}>
        <Stat label="模型数" value="6" accent={C.cyan} style={{ width: 360, height: 150 }} sub={<span>表 3.1 六行</span>} />
        <Stat label="独立做法" value="5" accent={C.violet} style={{ width: 360, height: 150 }} sub={<span>三种归一化 + 不用 + 无仿射</span>} />
        <Stat label="书中比较段落" value="0" accent={C.coral} style={{ width: 360, height: 150 }} sub={<span>只有表格，没有解释</span>} />
      </div>
      <div style={{ marginTop: 40 }}>
        <Body size={FT.lead} color={C.ink}>
          六行表格没有说：为什么是这个 base，换了 base 会差多少。
        </Body>
      </div>
    </div>
  </>
);

const P3: React.FC = () => (
  <>
    <Head kicker="02 / 问题" title="缺的那一步" goal="要公式，也要能分开它们的实验" />
    <div style={{ position: "absolute", left: PAD, top: 350, width: CW, display: "flex", gap: 26 }}>
      <Card label="缺一 · 可执行的公式" accent={C.cyan} style={{ flex: 1, height: 330 }}>
        <Formula size={26} color={C.cyan}>x̃ = (x − μ) / √(σ² + ε)</Formula>
        <Formula size={26} color={C.violet} style={{ marginTop: 12 }}>x̃ = x − x_T</Formula>
        <Formula size={26} color={C.amber} style={{ marginTop: 12 }}>x̃ = x − mean(x)</Formula>
        <Body size={FT.body} style={{ marginTop: 16 }}>
          三个 base，一套骨架。公式不在书里，在引用的论文里。
        </Body>
      </Card>
      <Card label="缺二 · 能分开它们的实验" accent={C.violet} style={{ flex: 1, height: 330 }}>
        <Body size={FT.body} color={C.inkDim}>
          只报一个 MAE，看不出 base 的作用：模型、初始化、数据都在变。
          实验必须固定骨干和数据，只换 base。
        </Body>
        <Body size={FT.body} color={C.inkDim} style={{ marginTop: 14 }}>
          变量只剩一个，排序才有意义。
        </Body>
      </Card>
    </div>
    <div style={{ position: "absolute", left: PAD, top: 730, width: CW }}>
      <Body size={FT.lead} color={C.ink}>
        于是这一集做两件事：写三个模块，各带一组断言；再跑两组数据，看排序会不会翻。
      </Body>
    </div>
  </>
);

export const SProblem: React.FC = () => (
  <Pages id="problem" at={[0, 0.401, 0.753]}>
    <P1 />
    <P2 />
    <P3 />
  </Pages>
);
