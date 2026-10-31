import React from "react";
import { C, FONT, FT } from "../../design/tokens";
import { Bars, Body, Card, Chip, CW, CodeBlock, Head, K, LinePlot, M, PAD, Pages, Row, Stat, Verdict, fmtE, fmtF, fmtInt } from "../shared";

const P1: React.FC = () => (
  <>
    <Head kicker="06 / 验证" title="四条读数，四层交叉" goal="价格、收益、两条去趋势路径" />
    <div style={{ position: "absolute", left: PAD, top: 330, width: CW }}>
      <Card label="evidence · ch2-corr-stl" accent={C.cyan} style={{ height: 430 }}>
        <Row name="价格面板" value={fmtF(M.readings.price.score, 6)} note={<span>mean {fmtF(M.readings.price.mean, 4)} · var {fmtF(M.readings.price.var, 4)}</span>} color={C.cyan} />
        <Row name="收益面板" value={fmtF(M.readings.returns.score, 6)} note={<span>mean {fmtF(M.readings.returns.mean, 4)} · var {fmtF(M.readings.returns.var, 4)}</span>} color={C.violet} />
        <Row name="STL 去趋势" value={fmtF(M.readings.stl.score, 6)} note={<span>mean {fmtF(M.readings.stl.mean, 4)} · var {fmtF(M.readings.stl.var, 4)}</span>} color={C.amber} />
        <Row name="经典去趋势" value={fmtF(M.readings.classic.score, 6)} note={<span>mean {fmtF(M.readings.classic.mean, 4)} · var {fmtF(M.readings.classic.var, 4)}</span>} color={C.coral} />
        <div style={{ display: "flex", gap: 30, marginTop: 22 }}>
          <Chip color={C.cyan}>{fmtInt(M.readings.price.pairs)} 对</Chip>
          <K>价格 → 收益：差 0.1504</K>
          <K>STL vs 经典：差 0.0384</K>
        </div>
      </Card>
    </div>
    <div style={{ position: "absolute", left: PAD, top: 800, width: CW }}>
      <Body size={FT.lead} color={C.ink}>
        面板换了四种算法，读数都在 1.07 到 1.24 之间 —— 这个读数本身就窄。
      </Body>
    </div>
  </>
);

const P2: React.FC = () => (
  <>
    <Head kicker="06 / 验证" title="两条去趋势路径，殊途同归" goal="STL 与经典分解都指向 1.2 附近" />
    <div style={{ position: "absolute", left: PAD, top: 336, width: CW, display: "flex", gap: 26 }}>
      <Card label="STL 去趋势" accent={C.cyan} style={{ flex: 1, height: 340 }}>
        <div style={{ fontFamily: FONT.mono, fontSize: FT.num, color: C.cyan }}>{fmtF(M.readings.stl.score, 6)}</div>
        <Body size={FT.body} style={{ marginTop: 16 }}>
          LOESS 趋势，周期 5，n_s 7，n_t 11。残差面板的相关方差 {fmtF(M.readings.stl.var, 4)}，
          比原始价格的 {fmtF(M.readings.price.var, 4)} 小一个量级。
        </Body>
        <Body size={FT.meta} color={C.inkFaint} style={{ marginTop: 14 }}>
          mean 被推到 {fmtF(M.readings.stl.mean, 4)}：LOESS 只拿走低频，相位内的相关还留着。
        </Body>
      </Card>
      <Card label="经典去趋势" accent={C.coral} style={{ flex: 1, height: 340 }}>
        <div style={{ fontFamily: FONT.mono, fontSize: FT.num, color: C.coral }}>{fmtF(M.readings.classic.score, 6)}</div>
        <Body size={FT.body} style={{ marginTop: 16 }}>
          中心化移动平均，周期 5。残差面板的相关方差 {fmtF(M.readings.classic.var, 4)}，
          均值 {fmtF(M.readings.classic.mean, 4)}，都是四个里最高的。
        </Body>
        <Body size={FT.meta} color={C.inkFaint} style={{ marginTop: 14 }}>
          移动平均窗更短，拿走的趋势更少，残差里剩的公共成分更多。
        </Body>
      </Card>
    </div>
    <div style={{ position: "absolute", left: PAD, top: 760, width: CW }}>
      <Body size={FT.lead} color={C.ink}>
        两条路径的读数差 0.0384：一致性还是有的。但用它们算季节强度，差距会放大到十九倍。
      </Body>
    </div>
  </>
);

const P3: React.FC = () => (
  <>
    <Head kicker="06 / 验证" title="分布的形状" goal="计数比均值更能说明问题" />
    <div style={{ position: "absolute", left: PAD, top: 340, width: CW }}>
      <Bars
        width={1500}
        max={M.pairs.negPrice}
        rowH={78}
        items={[
          { label: "价格 p>0.8", value: M.pairs.hiPrice, text: fmtInt(M.pairs.hiPrice) + " 对", color: C.cyan },
          { label: "收益 p>0.8", value: M.pairs.hiRet, text: fmtInt(M.pairs.hiRet) + " 对", color: C.violet },
          { label: "价格 p<0", value: M.pairs.negPrice, text: fmtInt(M.pairs.negPrice) + " 对", color: C.amber },
          { label: "收益 p<0", value: M.pairs.negRet, text: fmtInt(M.pairs.negRet) + " 对", color: C.coral },
        ]}
        unit={"总对数 " + fmtInt(M.pairs.total) + "（100 只 × 251 天，100 × 99 / 2）"}
      />
    </div>
    <div style={{ position: "absolute", left: PAD, top: 760, width: CW }}>
      <Card label="读法" accent={C.amber} style={{ height: 230 }}>
        <Body size={FT.body} color={C.ink}>
          价格里有 {fmtInt(M.pairs.hiPrice)} 对强正相关，收益里只有 {fmtInt(M.pairs.hiRet)} 对。
          价格有 {fmtInt(M.pairs.negPrice)} 对负相关，收益里只有 {fmtInt(M.pairs.negRet)} 对。
        </Body>
        <Body size={FT.body} color={C.inkDim} style={{ marginTop: 12 }}>
          去趋势把共同的涨跌拿走，也把「相关」这件事本身拿走了大半。
        </Body>
      </Card>
    </div>
  </>
);

const P4: React.FC = () => (
  <>
    <Head kicker="06 / 验证" title="茅台这一条，两个强度" goal="剖面相同，分母不同" />
    <div style={{ position: "absolute", left: PAD, top: 336, width: 980 }}>
      <LinePlot
        width={960}
        height={420}
        zeroLine
        legend
        series={[
          { values: M.profiles.stl, color: C.cyan, name: "STL" },
          { values: M.profiles.classic, color: C.coral, name: "经典", dash: true },
        ]}
        yFmt={(v) => v.toFixed(1)}
        title="五个相位的季节效应（元）"
      />
    </div>
    <div style={{ position: "absolute", left: PAD + 1010, top: 336, width: CW - 1010 }}>
      <Card label="强度" accent={C.cyan} style={{ height: 420 }}>
        <div style={{ display: "flex", gap: 40 }}>
          <div>
            <K>STL</K>
            <div style={{ fontFamily: FONT.mono, fontSize: FT.h2, color: C.cyan }}>{fmtF(M.maotaiStats.stl, 6)}</div>
          </div>
          <div>
            <K>经典</K>
            <div style={{ fontFamily: FONT.mono, fontSize: FT.h2, color: C.coral }}>{fmtF(M.maotaiStats.classic, 6)}</div>
          </div>
        </div>
        <Body size={FT.body} style={{ marginTop: 18 }}>
          比值 {fmtF(M.maotaiStats.stl / M.maotaiStats.classic, 1)} 倍。
          剖面最大差 {fmtF(M.maotaiStats.gap, 3)} 元；季节振幅只有均价的 {fmtF(M.maotaiStats.ampPct, 4)}%。
        </Body>
        <Body size={FT.body} style={{ marginTop: 14 }}>
          式(2.2) 只有一个式子，但 var(R) 里的 R 换了定义：LOESS 剩下的 vs 移动平均剩下的。
          移动平均窗短，残差里还留着趋势，分母被抬高，强度就掉下去。
        </Body>
      </Card>
    </div>
  </>
);

const P5: React.FC = () => (
  <>
    <Head kicker="06 / 验证" title="合成的部分，逐位对得上" goal="真值已知，就能量误差" />
    <div style={{ position: "absolute", left: PAD, top: 336, width: CW, display: "flex", gap: 24 }}>
      <Stat label="趋势重建误差" value={fmtE(M.synthetic.trendErr, 2)} accent={C.cyan} style={{ flex: 1, height: 190 }} sub={<span>n = {M.synthetic.n}，深内段</span>} />
      <Stat label="季节重建误差" value={fmtE(M.synthetic.seasonErr, 2)} accent={C.violet} style={{ flex: 1, height: 190 }} sub={<span>同一条合成序列</span>} />
      <Stat label="恒等式误差" value={fmtE(M.synthetic.identityErr, 1)} accent={C.amber} style={{ flex: 1, height: 190 }} sub={<span>X − T − S − R，逐位</span>} />
      <Stat label="证据检查" value={"22 / 22"} accent={C.coral} style={{ flex: 1, height: 190 }} sub={<span>数据 4 · 结构 4 · 行为 14</span>} />
    </div>
    <div style={{ position: "absolute", left: PAD, top: 580, width: CW }}>
      <Card label="证据包 · inventory/evidence/ch2-corr-stl" accent={C.cyan} style={{ height: 260 }}>
        <div style={{ display: "flex", gap: 22, flexWrap: "wrap" }}>
          <Verdict ok label="22 / 22 通过" />
          <Chip color={C.cyan}>commit 31b99c5</Chip>
          <K>ts-base 61 suites / {fmtInt(M.meta.tests.asserts)} 断言</K>
          <K>{M.meta.runAt}</K>
        </div>
        <Body size={FT.body} style={{ marginTop: 16 }}>
          读数是确定的：1.0683759229、1.2187852629、1.1927418917、1.2311591349。
          合成数据上的误差在 1e−15 量级，恒等式在 1e−16 以下。
        </Body>
      </Card>
    </div>
  </>
);

export const SVerification: React.FC = () => (
  <Pages id="verification" at={[0, 10 / 32, 14 / 32, 18 / 32, 25 / 32]}>
    <P1 />
    <P2 />
    <P3 />
    <P4 />
    <P5 />
  </Pages>
);
