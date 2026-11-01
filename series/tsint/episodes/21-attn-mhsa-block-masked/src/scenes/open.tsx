import React from "react";
import { C, FONT, FT } from "../../design/tokens";
import { Body, CW, Card, Chip, Formula, Head, K, KV, M, PAD, Pages, Row, Stat, Verdict, fmtInt, pageAt } from "../shared";

const P1: React.FC = () => (
  <>
    <Head kicker="第 3 章 / 注意力" title="注意力三件套" goal="多头自注意力 · Transformer 块 · 因果掩码" />
    <div style={{ position: "absolute", left: PAD, top: 340, width: 1080 }}>
      <Card label="本集论点" accent={C.cyan} style={{ height: 340 }}>
        <Body size={FT.lead} color={C.ink}>书里只给三行式子。</Body>
        <Body size={FT.lead} color={C.ink} style={{ marginTop: 8 }}>这一集把它补成能跑、能验的实现。</Body>
        <Body size={FT.body} style={{ marginTop: 20 }}>
          头数、维度、初始化、残差、层归一化、掩码，这些书里没有的施工细节，
          由本仓自己定，并且逐项写成证据。
        </Body>
        <div style={{ marginTop: 18, display: "flex", gap: 10 }}>
          <Chip color={C.cyan}>code: ts-base</Chip>
          <Chip color={C.amber}>book p.53–56</Chip>
          <Chip color={C.inkFaint}>evidence 35 checks</Chip>
        </div>
      </Card>
    </div>
    <div style={{ position: "absolute", left: PAD + 1120, top: 340, width: CW - 1120 }}>
      <Card label="三件套" accent={C.violet} style={{ height: 340 }} pad={18}>
        <KV k="① 多头自注意力" v="softmax(QKᵀ/√d_k)·V，四个头" color={C.cyan} size={FT.body} />
        <KV k="② Transformer 块" v="LN → MHSA → 残差 → LN → FFN → 残差" color={C.amber} size={FT.body} />
        <KV k="③ 因果掩码" v="上三角 −∞；第 i 天只看 ≤ i" color={C.coral} size={FT.body} />
      </Card>
    </div>
    <div style={{ position: "absolute", left: PAD, top: 730, width: CW }}>
      <Body size={FT.lead} color={C.ink}>三个问题：式子怎么写、形状怎么对、机制怎么验。</Body>
    </div>
  </>
);

const P2: React.FC = () => (
  <>
    <Head kicker="01 / 开场" title="三行式子，六个空格" goal="书的骨架与本仓的施工图之间" />
    <div style={{ position: "absolute", left: PAD, top: 360, width: 960 }}>
      <Card label="本书 p.54 · 式 3.19–3.21（骨架原文）" accent={C.inkFaint} style={{ height: 330 }}>
        <Formula size={40} note="式 3.19：Attention(Q, K, V) = softmax(QKᵀ / √d_k) · V">
          Attn(Q, K, V) = softmax(QKᵀ/√d_k) V
        </Formula>
        <div style={{ marginTop: 26, display: "flex", gap: 10 }}>
          <Chip color={C.inkFaint}>只有这一步</Chip>
          <Chip color={C.inkFaint}>没有 Q/K/V 的来源</Chip>
          <Chip color={C.inkFaint}>没有拼接与残差</Chip>
        </div>
      </Card>
    </div>
    <div style={{ position: "absolute", left: PAD + 1000, top: 360, width: CW - 1000 }}>
      <Card label="本仓补的六件事" accent={C.coral} style={{ height: 330 }}>
        <Row name="① Q/K/V 的线性映射" value="64 × 64 × 3" />
        <Row name="② 头数与每头宽度" value="h = 4 · d_k = 16" />
        <Row name="③ 初始化" value="uniform(±√(3/d))" />
        <Row name="④ 残差与层归一化" value="LN eps = 1e-5" />
        <Row name="⑤ 前馈网络" value="64 → 256 → 64" />
        <Row name="⑥ 因果掩码" value="上三角 = −∞" color={C.coral} />
      </Card>
    </div>
    <div style={{ position: "absolute", left: PAD, top: 740, width: CW }}>
      <Card label="纪律" accent={C.cyan} pad={18}>
        <Body size={FT.body} color={C.ink}>
          补的部分是本仓的选择，不是书的标准答案。凡是书上没有的，证据里都注明来源是「本仓约定」。
        </Body>
      </Card>
    </div>
  </>
);

const P3: React.FC = () => (
  <>
    <Head kicker="01 / 开场" title="交付两样东西" goal="实现 + 可复跑的证据" />
    <div style={{ position: "absolute", left: PAD, top: 356, width: CW, display: "flex", gap: 22 }}>
      <Stat label="证据检查" value={M.meta.checks.ok + " / " + M.meta.checks.total} accent={C.cyan} style={{ flex: 1, height: 250 }}
        sub={<span>数据 {M.meta.checks.data} · 结构 {M.meta.checks.struct} · 梯度 {M.meta.checks.grad} · 真实窗口 {M.meta.checks.real}</span>} />
      <Stat label="测试套件" value={M.meta.tests.suites + " 套 / " + fmtInt(M.meta.tests.asserts) + " 断言"} accent={C.amber} valueSize={FT.num} style={{ flex: 1, height: 250 }}
        sub={<span>mhsa {M.meta.tests.mhsa} · block {M.meta.tests.block} · masked {M.meta.tests.masked}</span>} />
      <Stat label="块总参数" value={fmtInt(M.meta.params.blockTotal)} accent={C.violet} style={{ flex: 1, height: 250 }}
        sub={<span>注意力 {fmtInt(M.meta.params.mhsa)} + 前馈 {fmtInt(M.meta.params.blockMatrix)}</span>} />
    </div>
    <div style={{ position: "absolute", left: PAD, top: 660, width: CW, display: "flex", gap: 22 }}>
      <Card label="能跑的 Haskell" accent={C.cyan} style={{ flex: 1 }}>
        <K style={{ display: "block" }}>cabal run -v0 tsbase -- evidence-ch03-attn</K>
        <K style={{ display: "block", marginTop: 4 }}>  --data data/episodes/21-attn-mhsa-block-masked</K>
        <K style={{ display: "block", marginTop: 4 }}>  --out  data/episodes/21-attn-mhsa-block-masked</K>
        <Body size={FT.meta} style={{ marginTop: 12 }}>一条命令重跑全部 35 项，写出 CSV、summary.json 与三份单元证据。</Body>
      </Card>
      <Card label="必须诚实的地方" accent={C.coral} style={{ flex: 1 }}>
        <Row name="权重是否训练" value="否，全是初始化值" color={C.coral} />
        <Row name="头是否学到结构" value="否，熵接近均匀" color={C.coral} />
        <Row name="能否用于预测" value="不能，没有预测头" color={C.coral} />
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
