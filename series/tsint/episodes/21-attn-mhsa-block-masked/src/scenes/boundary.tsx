import React from "react";
import { C, FT } from "../../design/tokens";
import { Body, CW, Card, Chip, Head, K, KV, M, PAD, Pages, Row, fmtF, fmtP, pageAt } from "../shared";

const P1: React.FC = () => (
  <>
    <Head kicker="07 / 边界" title="第一条与第二条" goal="没训练，也没有块梯度" />
    <div style={{ position: "absolute", left: PAD, top: 350, width: 960 }}>
      <Card label="① 没有训练" accent={C.coral} style={{ height: 420 }}>
        <Body size={FT.body} color={C.ink}>四个头的权重都是初始化值，没跑过一步优化。</Body>
        <KV k="head0 平均熵" v={fmtF(M.struct.head0Entropy, 4) + " bit"} color={C.amber} />
        <KV k="均匀上限" v="6.585 bit" color={C.inkDim} />
        <Body size={FT.body} color={C.coral} style={{ marginTop: 10 }}>注意力接近均匀，这是预期，不是缺陷。</Body>
        <K style={{ display: "block", marginTop: 8 }}>所以本集不声称任何头学到周期或结构</K>
      </Card>
    </div>
    <div style={{ position: "absolute", left: PAD + 1000, top: 350, width: CW - 1000 }}>
      <Card label="② 块没有解析梯度" accent={C.amber} style={{ height: 420 }}>
        <Body size={FT.body} color={C.ink}>只有 Mhsa 写了 mhsaLossGrad。</Body>
        <Body size={FT.body} color={C.ink} style={{ marginTop: 12 }}>
          TransformerBlock 的前向有实现，反向没有做数值对照。
        </Body>
        <Chip color={C.amber}>这是明确的空白，不是「已验证」</Chip>
      </Card>
    </div>
  </>
);

const P2: React.FC = () => (
  <>
    <Head kicker="07 / 边界" title="第三条与第四条" goal="不预测，也不外推" />
    <div style={{ position: "absolute", left: PAD, top: 350, width: 960 }}>
      <Card label="③ 没有预测头" accent={C.coral} style={{ height: 400 }}>
        <Body size={FT.body} color={C.ink}>没有回测，没有准确率，没有收益曲线。</Body>
        <Body size={FT.body} color={C.ink} style={{ marginTop: 12 }}>本集只回答「机制对不对」，不回答「有没有用」。</Body>
        <K style={{ display: "block", marginTop: 12 }}>验证的是实现与定义一致，不是策略有效</K>
      </Card>
    </div>
    <div style={{ position: "absolute", left: PAD + 1000, top: 350, width: CW - 1000 }}>
      <Card label="④ 只有一个窗口" accent={C.violet} style={{ height: 400 }}>
        <Row name="交易日" value={String(M.meta.config.horizon)} />
        <Row name="序列" value={String(M.meta.config.channels)} />
        <Row name="区间" value={M.data.first.slice(0, 7) + " → " + M.data.last.slice(0, 7)} />
        <Body size={FT.body} color={C.ink} style={{ marginTop: 12 }}>换市场、换标的、换窗口，结论都要重验。</Body>
      </Card>
    </div>
  </>
);

const P3: React.FC = () => (
  <>
    <Head kicker="07 / 边界" title="第五条与第六条" goal="设计性质，以及我们自己补的部分" />
    <div style={{ position: "absolute", left: PAD, top: 350, width: 960 }}>
      <Card label="⑤ 没有位置编码" accent={C.cyan} style={{ height: 420 }}>
        <Body size={FT.body} color={C.ink}>输入只有 8 条序列的嵌入，没有时间位置信息。</Body>
        <KV k="置换等变误差" v={String(M.struct.permErr)} color={C.cyan} />
        <Body size={FT.body} style={{ marginTop: 10 }}>这是设计性质，不是数值巧合。</Body>
        <K style={{ display: "block", marginTop: 8 }}>要让顺序起作用，得额外加位置编码或因果结构</K>
      </Card>
    </div>
    <div style={{ position: "absolute", left: PAD + 1000, top: 350, width: CW - 1000 }}>
      <Card label="⑥ 书外部分是我们补的" accent={C.amber} style={{ height: 420 }}>
        <Body size={FT.body} color={C.ink}>初始化、维度、d_ff、LN 的 eps、拼接顺序、掩码写法。</Body>
        <Body size={FT.body} style={{ marginTop: 12 }}>这些是本仓的选择，不是书的标准答案。</Body>
        <Body size={FT.meta} color={C.inkFaint} style={{ marginTop: 12 }}>书 p.53–56 只给骨架，勘误 E36 记录了这一点。</Body>
      </Card>
    </div>
  </>
);

const P4: React.FC = () => (
  <>
    <Head kicker="07 / 边界" title="第七条：一条勘误" goal="计划草稿说会 NaN，这是错的" />
    <div style={{ position: "absolute", left: PAD, top: 360, width: CW }}>
      <Card label="错在哪，对的是什么" accent={C.coral} style={{ height: 380 }}>
        <Row name="草稿说法" value="去掉缩放会炸成 NaN" color={C.coral} />
        <Row name="实际读数" value={"最大 logit " + fmtF(M.scaling.unscaledMax, 4) + "，仍是有限值"} color={C.cyan} />
        <Row name="真实效应" value="softmax 饱和，熵从 6.16 掉到 4.12 bit" />
        <Body size={FT.body} style={{ marginTop: 14 }}>
          双精度下 exp(22.86) 不会溢出；训练会变慢、梯度会变小，但不会 NaN。
        </Body>
      </Card>
    </div>
    <div style={{ position: "absolute", left: PAD, top: 790, width: CW }}>
      <Chip color={C.amber}>这个更正已经写进 docs/09-book-errata.md 的 E36</Chip>
    </div>
  </>
);

const P5: React.FC = () => (
  <>
    <Head kicker="07 / 边界" title="第八到第十条" goal="commit、卡片与 CLI" />
    <div style={{ position: "absolute", left: PAD, top: 340, width: 1000 }}>
      <Card label="⑧ 两个 commit 号不是笔误" accent={C.violet} style={{ height: 460 }}>
        <Row name="证据 JSON 记录" value={M.artifacts.evidenceCommit} color={C.cyan} />
        <Row name="summary.json 记录" value="19ba447" />
        <Body size={FT.body} style={{ marginTop: 12 }}>
          证据提交时二进制已经编好，summary 里存的是编译时 HEAD；跨提交对照时两者会差一个。
        </Body>
        <K style={{ display: "block", marginTop: 10 }}>文档说明了原因，不当作错误抹掉</K>
      </Card>
    </div>
    <div style={{ position: "absolute", left: PAD + 1040, top: 340, width: CW - 1040 }}>
      <Card label="⑨ ⑩" accent={C.amber} style={{ height: 460 }}>
        <Body size={FT.body} color={C.ink}>A7 算法卡片还没写，留到 W 阶段统一补。</Body>
        <Body size={FT.body} color={C.ink} style={{ marginTop: 14 }}>演示 CLI 仍是规划中，现在只有证据子命令。</Body>
        <Body size={FT.meta} color={C.inkFaint} style={{ marginTop: 14 }}>这两项在计划的 W 阶段清单里</Body>
      </Card>
    </div>
  </>
);

export const SBoundary: React.FC = () => (
  <Pages id="boundary" at={[0, pageAt("boundary", 10), pageAt("boundary", 16), pageAt("boundary", 22), pageAt("boundary", 26)]}>
    <P1 />
    <P2 />
    <P3 />
    <P4 />
    <P5 />
  </Pages>
);
