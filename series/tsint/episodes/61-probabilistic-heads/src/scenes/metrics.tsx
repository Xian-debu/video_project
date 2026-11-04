import React from "react";
import { AbsoluteFill } from "remotion";
import { C, FONT, FT } from "../../design/tokens";
import { Body, Card, Foot, KV, M, PAD, Pages, Row, Scene, SceneHead, Stat, fmt2, fmt3, fmt4, fmtInt, pagesOf } from "../shared";
import { CoverageBars, CrossingBars, DataSplit, LossDelta } from "../figs";

export const MetricsScene: React.FC = () => (
  <Scene id="metrics">
    <SceneHead id="metrics" />
    <Pages id="metrics" at={pagesOf("metrics")}>
      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 292, width: 620 }}>
          <Body size={FT.h1} color={C.ink} style={{ lineHeight: 1.2 }}>数据口径，<br />先钉死。</Body>
          <Body style={{ marginTop: 26 }}>
            取 000001 的百分比对数收益：一百乘对数比。全序列六千五百九十九行，从一九九八年十一月到二零二六年十月。
            训练池取目标日在一五到一九年的一千二百一十九个，少样本协议只取四百个拟合九条线；测试段是二零二零到二二年的七百二十八个。
          </Body>
          <div style={{ display: "flex", marginTop: 28 }}>
            <KV k="全集" v={fmtInt(M.data.returnsRows)} color={C.inkDim} />
            <KV k="训练池" v={fmtInt(M.data.trainRows)} color={C.cyan} />
            <KV k="拟合" v={M.data.fitRows} color={C.violet} />
            <KV k="测试" v={M.data.testRows} color={C.coral} />
          </div>
        </div>
        <div style={{ position: "absolute", left: 790, top: 292, width: 1030 }}>
          <Card label="四段：全集 / 训练池 / 拟合子集 / 测试与覆盖率" accent={C.cyan}>
            <DataSplit width={950} height={248} />
          </Card>
          <div style={{ marginTop: 12, fontFamily: FONT.mono, fontSize: FT.micro, color: C.inkFaint, width: 1000 }}>
            窗口 {M.data.winLen} 个点，特征 {M.data.winBuckets} 维；分位网格九条：0.1 到 0.9。
          </div>
        </div>
        <Foot>数据讲清楚，后面的数才有意义。</Foot>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 292, width: 620 }}>
          <Body size={FT.h1} color={C.ink} style={{ lineHeight: 1.2 }}>三点三六，<br />到零。</Body>
          <Body style={{ marginTop: 26 }}>
            测试段七百二十八样本、两万六千二百零八对，逆序对八百八十一，交叉率百分之三点三六一六，落在书里三到五的量级里。
            排序之后逆序对是零，精确的零；而每个样本的九个值一个不少，只换了位置。这是零成本最硬的证据。
          </Body>
          <div style={{ display: "flex", marginTop: 28 }}>
            <KV k="逆序对" v={M.crossing.pairs} color={C.coral} />
            <KV k="交叉率" v={fmt2(M.crossing.rate * 100, 4) + "%"} color={C.amber} />
            <KV k="排序后" v="0" color={C.cyan} />
          </div>
        </div>
        <div style={{ position: "absolute", left: 790, top: 292, width: 1030 }}>
          <Card label="逆序对：排序前 881，排序后 0" accent={C.coral}>
            <CrossingBars width={930} height={226} />
          </Card>
          <Card label="这个零不是把线画平换来的" accent={C.cyan} style={{ marginTop: 14, width: 1020 }}>
            <Row name="多重集" value="不变" note="每样本九个值原样保留，排序只换顺序" width={972} color={C.cyan} valueW={280} />
            <Row name="单点能力" value="不变" note="每条线在自己的 tau 上仍是同一个预测" width={972} color={C.cyan} valueW={280} />
            <Row name="交叉" value="被消除" note="不是被掩盖：逐对检查都归零" width={972} color={C.amber} valueW={280} />
          </Card>
        </div>
        <Foot>只换了位置，没有丢预测。</Foot>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 292, width: 620 }}>
          <Body size={FT.h1} color={C.ink} style={{ lineHeight: 1.2 }}>代价，<br />零点二六。</Body>
          <Body style={{ marginTop: 26 }}>
            排序前 pinball 损失零点七二六七三一，排序后零点七二四八六四，相对变化负的百分之零点二五六八。
            也就是说几乎没变，还略降了一点。不能把这个下降包装成精度提升：排序不产生新信息，只让组合更整齐。
          </Body>
          <div style={{ display: "flex", marginTop: 28 }}>
            <KV k="排序前" v={fmt4(M.pinball.before, 6)} color={C.coral} />
            <KV k="排序后" v={fmt4(M.pinball.after, 6)} color={C.cyan} />
            <KV k="容差" v="2%" color={C.amber} />
          </div>
        </div>
        <div style={{ position: "absolute", left: 790, top: 292, width: 1030 }}>
          <Card label="同一批预测，只换顺序" accent={C.violet}>
            <LossDelta width={930} height={214} />
          </Card>
          <div style={{ marginTop: 14, fontFamily: FONT.mono, fontSize: FT.meta, color: C.inkFaint, lineHeight: 1.6, width: 1000 }}>
            检查的容差是百分之二，实际差零点二六。结论只有一句：加顺序约束不牺牲精度。
          </div>
        </div>
        <Foot>这是本集最想让人记住的一句。</Foot>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 292, width: 620 }}>
          <Body size={FT.h1} color={C.ink} style={{ lineHeight: 1.2 }}>分布头：<br />二点二七与零点九二。</Body>
          <Body style={{ marginTop: 26 }}>
            拟合高斯：均值负零点零二六六，标准差二点一六九，测试段 NLL 二点二七四五。锚点检查：mu 等于 y、sigma 等于一，
            NLL 零点九一八九，和手算对得上。覆盖率名义九十五，实测九十二点四：五百天里三十八天落在区间外。
          </Body>
          <div style={{ display: "flex", marginTop: 28 }}>
            <KV k="mu" v={fmt4(M.dist.mu)} color={C.cyan} />
            <KV k="sigma" v={fmt3(M.dist.sigma)} color={C.violet} />
            <KV k="覆盖" v={fmt3(M.dist.coverage)} color={C.coral} />
          </div>
        </div>
        <div style={{ position: "absolute", left: 790, top: 292, width: 1030 }}>
          <div style={{ display: "flex", gap: 16 }}>
            <Stat label="测试段 NLL" value={fmt4(M.dist.nll)} sub="拟合高斯 · 728 样本" accent={C.cyan} style={{ width: 326 }} valueColor={C.cyan} />
            <Stat label="覆盖率" value={fmt3(M.dist.coverage)} sub="名义 0.95 · 500 天" accent={C.coral} style={{ width: 326 }} valueColor={C.coral} />
            <Stat label="区间外" value="38 天" sub="15 低 / 23 高" accent={C.amber} style={{ width: 326 }} valueColor={C.amber} />
          </div>
          <Card label="名义与实测：区间画出来对得上吗" accent={C.coral} style={{ marginTop: 16, width: 1020 }}>
            <CoverageBars width={930} height={200} />
          </Card>
        </div>
        <Foot>尾部比高斯厚，这条线照实报。</Foot>
      </AbsoluteFill>
    </Pages>
  </Scene>
);
