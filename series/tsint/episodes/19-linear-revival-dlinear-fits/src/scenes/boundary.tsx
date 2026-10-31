import React from "react";
import { C, FONT, FT } from "../../design/tokens";
import { Body, CW, Card, Chip, Head, K, M, PAD, Pages, Row, fmtInt, pageAt } from "../shared";

const P1: React.FC = () => (
  <>
    <Head kicker="07 / 边界" title="哪些话不能说" goal="证据的效力边界，和数字一样重要" />
    <div style={{ position: "absolute", left: PAD, top: 350, width: CW, display: "flex", gap: 24 }}>
      <Card label="不能说 · 一" accent={C.coral} style={{ flex: 1, height: 380 }}>
        <Body size={FT.h2} color={C.ink}>「我们复现了书里的表 3.1」</Body>
        <Body size={FT.body} style={{ marginTop: 14 }}>
          表里 7.05e4 / 1.397e5 / 4.5e3 是论文设置下的参数量，输入输出长度、通道数都没公布。
          我们的 2328 / 4656 / 2352 是按 96 进 24 出算出来的，只能在量级上对话。
        </Body>
        <div style={{ marginTop: 16 }}><Chip color={C.coral}>C 级证据 · 只作引用</Chip></div>
      </Card>
      <Card label="不能说 · 二" accent={C.coral} style={{ flex: 1, height: 380 }}>
        <Body size={FT.h2} color={C.ink}>「线性模型打败了最朴素基线」</Body>
        <Body size={FT.body} style={{ marginTop: 14 }}>
          日线和五分钟线上，最朴素基线都更低。我们赢的是「在三条线性模型里谁更好」，
          以及「参数少一个数量级时误差还接近」。
        </Body>
        <div style={{ marginTop: 16 }}><Chip color={C.coral}>不要制造翻盘叙事</Chip></div>
      </Card>
      <Card label="不能说 · 三" accent={C.coral} style={{ flex: 1, height: 380 }}>
        <Body size={FT.h2} color={C.ink}>「这是全部 A 股上的结论」</Body>
        <Body size={FT.body} style={{ marginTop: 14 }}>
          八条日线序列、一只股票的五分钟线，都来自一家数据源。
          换成小盘股、别的市场、别的年份，排序都可能变。
        </Body>
        <div style={{ marginTop: 16 }}><Chip color={C.coral}>样本外 ≠ 全市场</Chip></div>
      </Card>
    </div>
    <div style={{ position: "absolute", left: PAD, top: 800, width: CW }}>
      <Body size={FT.lead} color={C.ink}>
        这一集能给的最强结论只有一句：同样输入输出下，线性结构的参数量确实小，而小模型没有必然输。
      </Body>
    </div>
  </>
);

const Deviation: React.FC<{ n: string; a: string; b: string; why: string }> = ({ n, a, b, why }) => (
  <div style={{ display: "flex", alignItems: "baseline", borderBottom: "1px solid " + C.panelLine, padding: "12px 0" }}>
    <div style={{ width: 44, fontFamily: FONT.mono, fontSize: FT.meta, color: C.amber }}>{n}</div>
    <div style={{ width: 420, fontFamily: FONT.sans, fontSize: FT.body, color: C.inkDim }}>{a}</div>
    <div style={{ width: 60, fontFamily: FONT.mono, fontSize: FT.body, color: C.inkFaint }}>→</div>
    <div style={{ width: 400, fontFamily: FONT.mono, fontSize: FT.meta, color: C.ink }}>{b}</div>
    <div style={{ flex: 1, fontFamily: FONT.sans, fontSize: FT.meta, color: C.inkFaint }}>{why}</div>
  </div>
);

const P2: React.FC = () => (
  <>
    <Head kicker="07 / 边界" title="数据上的四处偏离" goal="写进清单，不藏在脚注里" />
    <div style={{ position: "absolute", left: PAD, top: 350, width: CW }}>
      <Card label="入选序列与原计划的差异" accent={C.amber} pad={20}>
        <Deviation n="1" a="sz000858 五粮液" b="sz000596 古井贡酒" why="源数据 2015-07-30 起缺 60 天，窗口会被截断" />
        <Deviation n="2" a="sh600030 中信证券" b="sh601318 中国平安" why="2018-12-25 起停牌 10 天，不满足连续窗口" />
        <Deviation n="3" a="sh600036 招商银行" b="保留，面板 2669 天" why="2015-04 停牌 5 天，八列内连接少 5 天" />
        <Deviation n="4" a="五分钟 2019–2025" b={M.data.minuteFirst.slice(0, 10) + " – " + M.data.minuteLast.slice(0, 10)} why="源库连续五分钟线只有 5000 根，取满 104 个交易日" />
      </Card>
    </div>
    <div style={{ position: "absolute", left: PAD, top: 760, width: 900 }}>
      <Row name="日线面板" value={fmtInt(M.data.dailyRows) + " 行 · " + fmtInt(M.data.dailyBytes) + " B"} width={880} />
      <Row name="五分钟样本" value={fmtInt(M.data.minuteRows) + " 行 · " + fmtInt(M.data.minuteDays) + " 天"} width={880} />
    </div>
    <div style={{ position: "absolute", left: PAD + 950, top: 760, width: CW - 950 }}>
      <Card label="替换原则" accent={C.cyan} pad={18}>
        <Body size={FT.body}>同板块、同流动性量级、在窗口内无停牌；替换后不调整任何超参数。</Body>
      </Card>
    </div>
  </>
);

const P3: React.FC = () => (
  <>
    <Head kicker="07 / 边界" title="本集没做的事" goal="留给后续单元，而不是假装做过" />
    <div style={{ position: "absolute", left: PAD, top: 350, width: CW, display: "flex", gap: 24 }}>
      <Card label="FITS 只实现了主线" accent={C.violet} style={{ flex: 1, height: 330 }}>
        <Body size={FT.body}>
          原文里的通道混合与插值频率处理没做；本集只有「rFFT → 线性层 → 逆基」这一条。
          低通带来的振铃也没有额外抑制。
        </Body>
        <K style={{ display: "block", marginTop: 14 }}>实现范围见 docs/plan.md 的「不做什么」</K>
      </Card>
      <Card label="没有调参搜索" accent={C.cyan} style={{ flex: 1, height: 330 }}>
        <Body size={FT.body}>
          三个模型共用同一套 lr、轮数、早停；没有为任何一个模型单独搜超参。
          因此排序反映结构差异，但也可能被这组超参偏袒。
        </Body>
      </Card>
      <Card label="没有跨市场验证" accent={C.amber} style={{ flex: 1, height: 330 }}>
        <Body size={FT.body}>
          只有 A 股日线与一只股票的五分钟线；没有美股、期货、外汇，
          也没有多变量通道。
        </Body>
      </Card>
    </div>
    <div style={{ position: "absolute", left: PAD, top: 760, width: CW }}>
      <Card label="下一步" accent={C.cyan} pad={20}>
        <Body size={FT.h2} color={C.ink}>
          把「卷积看时序」接上：因果空洞卷积、FFT 周期、二维聚合——结构更复杂，问题还是同一个：它到底多学到了什么？
        </Body>
      </Card>
    </div>
  </>
);

export const SBoundary: React.FC = () => (
  <Pages id="boundary" at={[0, pageAt("boundary", 10), pageAt("boundary", 20)]}>
    <P1 />
    <P2 />
    <P3 />
  </Pages>
);
