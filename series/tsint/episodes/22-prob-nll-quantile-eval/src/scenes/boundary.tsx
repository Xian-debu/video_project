import React from "react";
import { C, FONT, FT } from "../../design/tokens";
import { Body, CW, Card, Chip, Formula, Head, K, KV, M, PAD, Pages, Row, Stat, pageAt } from "../shared";

const P1: React.FC = () => (
  <>
    <Head kicker="07 / 边界" title="第一条与第二条" goal="没训练，也没外推" />
    <div style={{ position: "absolute", left: PAD, top: 350, width: 1060 }}>
      <Card label="① 没有训练预测头" accent={C.coral} style={{ height: 340 }}>
        <Row name="损失函数" value="验证了：值、梯度、拟合" color={C.cyan} />
        <Row name="端到端" value="没接回模型训练" color={C.coral} />
        <Row name="预测精度" value="不报，因为没有" color={C.coral} />
        <K style={{ display: "block", marginTop: 10 }}>本集回答“损失算得对不对”，不回答“模型准不准”。</K>
      </Card>
    </div>
    <div style={{ position: "absolute", left: PAD + 1100, top: 350, width: CW - 1100 }}>
      <Card label="② 只有一个标的" accent={C.violet} style={{ height: 340 }}>
        <Row name="标的" value="600519" />
        <Row name="窗口" value={M.real.n + " 个交易日"} />
        <Row name="市场" value="A 股单一市场" color={C.violet} />
        <K style={{ display: "block", marginTop: 10 }}>换标的、换市场、换周期，覆盖率和 QL 都要重新验。</K>
      </Card>
    </div>
    <div style={{ position: "absolute", left: PAD, top: 740, width: CW }}>
      <Body size={FT.lead} color={C.ink}>先说不做什么，再说做了什么。</Body>
    </div>
  </>
);

const P2: React.FC = () => (
  <>
    <Head kicker="07 / 边界" title="第三条：高斯假设太强" goal="肥尾，区间偏宽" />
    <div style={{ position: "absolute", left: PAD, top: 350, width: 1060 }}>
      <Card label="读数" accent={C.amber} style={{ height: 340 }}>
        <Row name="名义 80% 区间" value="0.8000" />
        <Row name="实际覆盖" value={M.real.coverageGauss80.toFixed(4)} color={C.amber} />
        <Row name="经验分位区间" value={M.real.coverage80.toFixed(4)} color={C.cyan} />
        <K style={{ display: "block", marginTop: 10 }}>高斯区间比名义略宽，说明残差的标准差被尾部拉大；经验分位没有这个假设。</K>
      </Card>
    </div>
    <div style={{ position: "absolute", left: PAD + 1100, top: 350, width: CW - 1100 }}>
      <Card label="怎么理解" accent={C.coral} style={{ height: 340 }}>
        <Body size={FT.body} color={C.ink}>正态装不下肥尾：为了让 80% 覆盖到，σ 被撑大，中心区间也跟着变宽。</Body>
        <Body size={FT.body} color={C.inkDim} style={{ marginTop: 12 }}>
          本仓不声称高斯拟合足够好；它只是一个可算、可验的基线。要更好的尾部，得换分布或换分位数口径。
        </Body>
      </Card>
    </div>
    <div style={{ position: "absolute", left: PAD, top: 740, width: CW }}>
      <Body size={FT.body} color={C.inkDim}>一个覆盖率数字背后，是“假设对不对”的问题，不是调参能解决的。</Body>
    </div>
  </>
);

const P3: React.FC = () => (
  <>
    <Head kicker="07 / 边界" title="第四、五条：两处数字错误" goal="书的常数，brief 的手算" />
    <div style={{ position: "absolute", left: PAD, top: 345, width: 1060 }}>
      <Card label="④ 勘误 E37" accent={C.amber} style={{ height: 360 }}>
        <Row name="式 3.30" value="少 ½log 2π" color={C.coral} />
        <Row name="式 3.42" value="没有系数 2" color={C.coral} />
        <Row name="计划书手算" value="1.765512（错）" color={C.coral} />
        <Row name="正确书版" value={M.nll.book.toFixed(10)} color={C.cyan} />
        <Row name="正确标准版" value={M.nll.std.toFixed(10)} color={C.cyan} />
        <K style={{ display: "block", marginTop: 6 }}>勘误不是挑错，是让后面所有集不再沿用错数。</K>
      </Card>
    </div>
    <div style={{ position: "absolute", left: PAD + 1100, top: 345, width: CW - 1100 }}>
      <Card label="⑤ brief 里的数字" accent={C.coral} style={{ height: 360 }}>
        <Body size={FT.body} color={C.ink}>brief 写“手算 NLL = 1.765512”。</Body>
        <Body size={FT.body} color={C.inkDim} style={{ marginTop: 10 }}>用 μ=1, σ=2, y=3 复算，书版是 1.1931471806，标准版是 2.1120857138。</Body>
        <Body size={FT.body} color={C.coral} style={{ marginTop: 10 }}>两者都不是 1.765512，所以这个数不沿用。</Body>
        <K style={{ display: "block", marginTop: 12 }}>证据里保留两条正确读数，画面不用错数。</K>
      </Card>
    </div>
  </>
);

const P4: React.FC = () => (
  <>
    <Head kicker="07 / 边界" title="负 NLL 与两个 commit" goal="都是解释得清的事" />
    <div style={{ position: "absolute", left: PAD, top: 345, width: 1060 }}>
      <Card label="负 NLL 不是 bug" accent={C.cyan} style={{ height: 350 }}>
        <Row name="密度峰值 σ=0.01" value="39.89" />
        <Row name="log 密度" value="+3.69" color={C.cyan} />
        <Row name="真实收益 NLL" value={M.real.nll.toFixed(4)} color={C.cyan} />
        <K style={{ display: "block", marginTop: 10 }}>连续分布的密度可以超过 1，负对数自然可以为负；这和概率不能超过 1 不矛盾。</K>
      </Card>
    </div>
    <div style={{ position: "absolute", left: PAD + 1100, top: 345, width: CW - 1100 }}>
      <Card label="两个 commit 号" accent={C.violet} style={{ height: 350 }}>
        <Row name="算法提交" value="eb61a30" color={C.cyan} />
        <Row name="证据提交" value="f46bdca" color={C.amber} />
        <Row name="为什么不同" value="证据在算法之后单独提交" />
        <K style={{ display: "block", marginTop: 10 }}>证据 JSON 里记录的 commit 是编译时的 HEAD，所以跨提交对照会差一个；这是流程，不是笔误。</K>
      </Card>
    </div>
    <div style={{ position: "absolute", left: PAD, top: 740, width: CW }}>
      <Body size={FT.body} color={C.inkDim}>凡是看起来像错的数，要么解释清楚，要么删掉重算。</Body>
    </div>
  </>
);

const P5: React.FC = () => (
  <>
    <Head kicker="07 / 边界" title="欠着的两件事" goal="A7 卡片与演示 CLI" />
    <div style={{ position: "absolute", left: PAD, top: 350, width: 1060 }}>
      <Card label="还没做" accent={C.coral} style={{ height: 330 }}>
        <Row name="A7 算法卡片" value="欠着，W 阶段统一补" color={C.coral} />
        <Row name="演示 CLI" value="规划中，只有证据子命令" color={C.coral} />
        <Row name="口径" value="不假装完成" color={C.amber} />
        <K style={{ display: "block", marginTop: 10 }}>这两项在计划的 W 阶段清单里，状态写的是 pending，不是 done。</K>
      </Card>
    </div>
    <div style={{ position: "absolute", left: PAD + 1100, top: 350, width: CW - 1100 }}>
      <Card label="本集为什么仍算 ready" accent={C.cyan} style={{ height: 330 }}>
        <Row name="实现" value="三个模块 + 29 条断言" color={C.cyan} />
        <Row name="证据" value={M.meta.checks.ok + " / " + M.meta.checks.total} color={C.cyan} />
        <Row name="勘误" value="E37 已登记" color={C.amber} />
        <Row name="欠账" value="明确列出，不藏" />
        <K style={{ display: "block", marginTop: 10 }}>ready 说的是“这一集的内容可交付”，不是“整个项目没有缺口”。</K>
      </Card>
    </div>
    <div style={{ position: "absolute", left: PAD, top: 740, width: CW }}>
      <Body size={FT.lead} color={C.ink}>都说清了，才敢说 ready。</Body>
    </div>
  </>
);

export const SBoundary: React.FC = () => (
  <Pages id="boundary" at={[0, pageAt("boundary", 7), pageAt("boundary", 14), pageAt("boundary", 21), pageAt("boundary", 27)]}>
    <P1 />
    <P2 />
    <P3 />
    <P4 />
    <P5 />
  </Pages>
);
