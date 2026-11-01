import React from "react";
import { C, FONT, FT } from "../../design/tokens";
import { Body, CW, Card, Chip, Formula, Head, K, KV, M, PAD, Pages, Row, Stat, fmtInt, pageAt } from "../shared";

const P1: React.FC = () => (
  <>
    <Head kicker="第 3 章 / 概率与损失" title="概率预测入门" goal="高斯 NLL · 分位数损失 · QL 指标" />
    <div style={{ position: "absolute", left: PAD, top: 340, width: 1060 }}>
      <Card label="本集论点" accent={C.cyan} style={{ height: 330 }}>
        <Body size={FT.lead} color={C.ink}>报一个数不够，报一个分布才有概率口径。</Body>
        <Body size={FT.lead} color={C.ink} style={{ marginTop: 8 }}>三个式子，三处口径错误。</Body>
        <Body size={FT.body} style={{ marginTop: 18 }}>
          书里给了 NLL、pinball 和 QL。常数项、σ 的参数化、τ 的取值、QL 的系数，
          这些都没写全；本仓逐条补，并且把每处差异写成证据。
        </Body>
        <div style={{ marginTop: 16, display: "flex", gap: 10 }}>
          <Chip color={C.cyan}>code: ts-base</Chip>
          <Chip color={C.amber}>book p.67–69</Chip>
          <Chip color={C.inkFaint}>evidence 41 checks</Chip>
        </div>
      </Card>
    </div>
    <div style={{ position: "absolute", left: PAD + 1100, top: 340, width: CW - 1100 }}>
      <Card label="三件事" accent={C.violet} style={{ height: 330 }} pad={18}>
        <KV k="① 高斯 NLL" v="均值 μ，尺度 σ" color={C.cyan} size={FT.body} />
        <KV k="② 分位数损失" v="τ=0.9 时低估罚 9 倍" color={C.amber} size={FT.body} />
        <KV k="③ QL 指标" v="书版无系数 2" color={C.coral} size={FT.body} />
        <K style={{ display: "block", marginTop: 12 }}>同一个误差，方向不同，价格不同。</K>
      </Card>
    </div>
    <div style={{ position: "absolute", left: PAD, top: 730, width: CW }}>
      <Body size={FT.lead} color={C.ink}>先回答：损失到底在罚什么。</Body>
    </div>
  </>
);

const P2: React.FC = () => (
  <>
    <Head kicker="01 / 开场" title="书给骨架，口径自己定" goal="三个式子和三个缺口" />
    <div style={{ position: "absolute", left: PAD, top: 350, width: 980 }}>
      <Card label="本书 p.67–69 · 式 3.28–3.32 / 3.42" accent={C.inkFaint} style={{ height: 330 }}>
        <Formula size={34} note="式 3.30：书里没有 ½log 2π 常数；式 3.42 也没有系数 2">
          L = ½Σ[log σ² + (y−μ)²/σ²]
        </Formula>
        <Formula size={34} note="式 3.31：pinball，τ 分位数">
          L_τ = τ(y−q) if y≥q else (1−τ)(q−y)
        </Formula>
        <div style={{ marginTop: 10, display: "flex", gap: 10 }}>
          <Chip color={C.inkFaint}>没有 σ 地板</Chip>
          <Chip color={C.inkFaint}>没有 τ 集合</Chip>
          <Chip color={C.inkFaint}>没有 QL 系数</Chip>
        </div>
      </Card>
    </div>
    <div style={{ position: "absolute", left: PAD + 1020, top: 350, width: CW - 1020 }}>
      <Card label="本仓补的口径" accent={C.coral} style={{ height: 330 }}>
        <Row name="① 常数项" value="补 ½log 2π" color={C.cyan} />
        <Row name="② σ 参数化" value="softplus(raw)+1e-6" color={C.amber} />
        <Row name="③ τ 集合" value="0.1 / 0.25 / 0.5 / 0.75 / 0.9" />
        <Row name="④ QL 归一化" value="书版 + ×2 两套" color={C.violet} />
        <Row name="⑤ 评估" value="覆盖率 + 交叉率" color={C.coral} />
      </Card>
    </div>
    <div style={{ position: "absolute", left: PAD, top: 740, width: CW }}>
      <Card label="纪律" accent={C.cyan} pad={16}>
        <Body size={FT.body} color={C.ink}>
          补的部分是本仓约定；书里漏的、brief 抄错的，都登记在勘误 E37，画面用的数必须是证据里的数。
        </Body>
      </Card>
    </div>
  </>
);

const P3: React.FC = () => (
  <>
    <Head kicker="01 / 开场" title="交付两样东西" goal="实现 + 可复跑的证据" />
    <div style={{ position: "absolute", left: PAD, top: 350, width: CW, display: "flex", gap: 22 }}>
      <Stat label="证据检查" value={M.meta.checks.ok + " / " + M.meta.checks.total} accent={C.cyan} style={{ flex: 1, height: 240 }}
        sub={<span>数据 {M.meta.checks.data} · 高斯 {M.meta.checks.gauss} · 分位数 {M.meta.checks.quantile} · QL {M.meta.checks.eval} · 真实 {M.meta.checks.real}</span>} />
      <Stat label="测试套件" value={M.meta.tests.suites + " 套 / " + fmtInt(M.meta.tests.asserts) + " 断言"} accent={C.amber} valueSize={FT.num} style={{ flex: 1, height: 240 }}
        sub={<span>gaussnll {M.meta.tests.gaussnll} · quantileloss {M.meta.tests.quantileloss} · evalql {M.meta.tests.evalql}</span>} />
      <Stat label="真实收益 NLL" value={M.real.nll.toFixed(4)} accent={C.coral} style={{ flex: 1, height: 240 }}
        sub={<span>连续密度可大于 1，所以 NLL 可以是负数——不是 bug</span>} />
    </div>
    <div style={{ position: "absolute", left: PAD, top: 640, width: CW, display: "flex", gap: 22 }}>
      <Card label="能跑的 Haskell" accent={C.cyan} style={{ flex: 1 }} pad={18}>
        <K style={{ display: "block" }}>cabal run -v0 tsbase -- evidence-ch03-prob</K>
        <K style={{ display: "block", marginTop: 4 }}>  --data data/episodes/22-prob-nll-quantile-eval</K>
        <K style={{ display: "block", marginTop: 4 }}>  --out  data/episodes/22-prob-nll-quantile-eval</K>
        <Body size={FT.meta} style={{ marginTop: 10 }}>一条命令重跑 41 项，写出 3 份 CSV、summary 与三份单元证据。</Body>
      </Card>
      <Card label="必须诚实的地方" accent={C.coral} style={{ flex: 1 }} pad={18}>
        <Row name="训练预测头了吗" value="没有" color={C.coral} />
        <Row name="只有一个标的" value="600519 · 240 天" color={C.coral} />
        <Row name="能证明模型有用吗" value="不能，只证明口径对" color={C.coral} />
      </Card>
    </div>
  </>
);

export const SOpen: React.FC = () => (
  <Pages id="open" at={[0, pageAt("open", 10), pageAt("open", 19)]}>
    <P1 />
    <P2 />
    <P3 />
  </Pages>
);
