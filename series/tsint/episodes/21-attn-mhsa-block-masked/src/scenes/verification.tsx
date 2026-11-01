import React from "react";
import { C, FT } from "../../design/tokens";
import { Bars, Body, CW, Card, Chip, Formula, Head, KV, LinePlot, M, PAD, Pages, Row, Stat, Verdict, fmtE, fmtF, fmtInt, pageAt } from "../shared";

const P1: React.FC = () => (
  <>
    <Head kicker="06 / 验证" title="三十五项，零失败" goal="四类检查各自的职责" />
    <div style={{ position: "absolute", left: PAD, top: 340, width: 560 }}>
      <Card accent={C.cyan} style={{ height: 400 }} pad={26}>
        <Stat label="证据检查" value={M.meta.checks.ok + " / " + M.meta.checks.total} sub="cabal run -v0 tsbase -- evidence-ch03-attn" accent={C.cyan} />
      </Card>
    </div>
    <div style={{ position: "absolute", left: PAD + 600, top: 340, width: CW - 600 }}>
      <Card label="四类，按职责分" accent={C.violet} style={{ height: 400 }}>
        <Row name="数据" value={M.meta.checks.data + " 项"} note="窗口形状、日期、sha、z 分数" color={C.cyan} />
        <Row name="结构" value={M.meta.checks.struct + " 项"} note="行和、置换、零块、参数、掩码" color={C.violet} />
        <Row name="梯度" value={M.meta.checks.grad + " 项"} note="数值梯度 + 五步下降" color={C.amber} />
        <Row name="真实窗口" value={M.meta.checks.real + " 项"} note="熵、缩放消融、查表读数" color={C.coral} />
      </Card>
    </div>
    <div style={{ position: "absolute", left: PAD, top: 780, width: CW }}>
      <Body size={FT.meta} color={C.inkFaint}>
        另有 {M.meta.tests.suites} 套 cabal 测试、{fmtInt(M.meta.tests.asserts)} 条断言，全部通过。
      </Body>
    </div>
  </>
);

const P2: React.FC = () => {
  const cols = M.data.series.slice(0, 4);
  return (
    <>
      <Head kicker="06 / 验证" title="先验数据本身" goal="96 × 8，一个窗口" />
      <div style={{ position: "absolute", left: PAD, top: 340, width: 1040 }}>
        <Card label="列内 z 分数（8 列取 4 条）" accent={C.cyan} style={{ height: 420 }} pad={18}>
          <LinePlot width={980} height={330} zeroLine
            series={cols.map((c, i) => ({ values: M.window.z[c], color: [C.cyan, C.amber, C.violet, C.coral][i], name: c }))}
            title={M.data.first + " → " + M.data.last} padL={70} padB={44} />
        </Card>
      </div>
      <div style={{ position: "absolute", left: PAD + 1080, top: 340, width: CW - 1080 }}>
        <Card label="清单" accent={C.violet} style={{ height: 420 }}>
          <KV k="行 × 列" v={M.data.rows + " × " + M.data.cols} color={C.cyan} size={FT.h2} />
          <KV k="字节" v={fmtInt(M.data.bytes)} color={C.inkDim} />
          <KV k="sha256" v={M.data.sha256.slice(0, 12) + "…"} color={C.inkDim} />
          <Body size={FT.meta} style={{ marginTop: 12 }}>六只股票 + 沪深 300 + 深证成指，内连接后取最后 96 个交易日。</Body>
        </Card>
      </div>
      <div style={{ position: "absolute", left: PAD, top: 790, width: CW }}>
        <Chip color={C.cyan}>六项数据检查：形状、列名、日期单调、首尾、无缺失、sha 一致</Chip>
      </div>
    </>
  );
};

const P3: React.FC = () => (
  <>
    <Head kicker="06 / 验证" title="结构检查：行和与置换" goal="两条最容易写成摆设的检查" />
    <div style={{ position: "absolute", left: PAD, top: 350, width: 920 }}>
      <Card label="① softmax 行和" accent={C.cyan} style={{ height: 340 }}>
        <Formula size={38} note="双精度下，误差应在十的负十二次方以内">
          Σ_j A[i, j] = 1
        </Formula>
        <Verdict ok label="96 行全部通过" />
      </Card>
    </div>
    <div style={{ position: "absolute", left: PAD + 960, top: 350, width: CW - 960 }}>
      <Card label="② 置换等变" accent={C.amber} style={{ height: 340 }}>
        <Body size={FT.body} color={C.ink}>把输入行按置换 π 打乱，输出应当同样打乱。</Body>
        <KV k="实测误差" v={fmtE(M.struct.permErr, 1)} color={C.cyan} size={FT.h2} />
        <Body size={FT.meta} style={{ marginTop: 10 }}>精确为零：本仓没有位置编码，置换等变是设计性质。</Body>
      </Card>
    </div>
    <div style={{ position: "absolute", left: PAD, top: 730, width: CW }}>
      <Card label="为什么先跑这条" accent={C.violet} pad={18}>
        <Body size={FT.body} color={C.ink}>它能抓出「拼接顺序按时间步还是按头」这类形状正确、语义错位的错误。</Body>
      </Card>
    </div>
  </>
);

const P4: React.FC = () => (
  <>
    <Head kicker="06 / 验证" title="零块与参数账" goal="把实现压到只剩归一化" />
    <div style={{ position: "absolute", left: PAD, top: 350, width: 880 }}>
      <Card label="权重全设零" accent={C.coral} style={{ height: 340 }}>
        <Formula size={36} note="残差保留，注意力和前馈项归零">
          block(Z) = LN(LN(Z))
        </Formula>
        <Verdict ok label={"逐行误差 " + String(M.struct.zeroBlockPerRow)} />
      </Card>
    </div>
    <div style={{ position: "absolute", left: PAD + 920, top: 350, width: CW - 920 }}>
      <Card label="参数计数" accent={C.cyan} style={{ height: 340 }}>
        <KV k="注意力" v={fmtInt(M.meta.params.mhsa)} color={C.cyan} size={FT.h2} />
        <KV k="块矩阵" v={fmtInt(M.meta.params.blockMatrix)} color={C.amber} size={FT.h2} />
        <KV k="合计" v={fmtInt(M.meta.params.blockTotal)} color={C.violet} size={FT.h2} />
      </Card>
    </div>
    <div style={{ position: "absolute", left: PAD, top: 730, width: 900 }}>
      <Body size={FT.body} color={C.inkDim}>
        合计不是 49,728：偏置全省略，前馈与层归一化单独算，所以每一条都能对上公式。
      </Body>
    </div>
  </>
);

const P5: React.FC = () => (
  <>
    <Head kicker="06 / 验证" title="掩码三项" goal="未来的权重必须恰为零" />
    <div style={{ position: "absolute", left: PAD, top: 350, width: CW }}>
      <Card label="逐项读数" accent={C.cyan} style={{ height: 340 }}>
        <Row name="严格上三角权重和" value={String(M.mask.strictUpperSum)} note="不是「接近零」，是恰为零" color={C.cyan} />
        <Row name="前 3 行输出与未掩码对照" value="完全一致" color={C.cyan} />
        <Row name="首 token 的注意力分布" value="只落在自己" color={C.amber} />
      </Card>
    </div>
    <div style={{ position: "absolute", left: PAD, top: 730, width: CW }}>
      <Body size={FT.lead} color={C.ink}>
        −∞ 在 softmax 里变成 exp(−∞) = 0；换成 0 就会得到 exp(0) = 1，未来照样有权重。
      </Body>
    </div>
  </>
);

const P6: React.FC = () => (
  <>
    <Head kicker="06 / 验证" title="梯度：数值对解析" goal="只覆盖多头注意力这一半" />
    <div style={{ position: "absolute", left: PAD, top: 350, width: 940 }}>
      <Card label="中心差分" accent={C.cyan} style={{ height: 400 }}>
        <Row name="参数个数" value={String(M.grad.params)} />
        <Row name="步长 ε" value="1e-5" />
        <Row name="最大误差" value={fmtE(M.grad.maxErr, 2)} color={C.cyan} />
        <Row name="门槛" value="1e-6" />
        <Body size={FT.meta} style={{ marginTop: 12 }}>256 个小矩阵参数逐一扰动，分析梯度与数值梯度逐项对照。</Body>
      </Card>
    </div>
    <div style={{ position: "absolute", left: PAD + 980, top: 350, width: CW - 980 }}>
      <Card label="五步梯度下降" accent={C.amber} style={{ height: 400 }}>
        <KV k="学习率" v={String(M.grad.lr)} color={C.violet} />
        <KV k="损失 · 下降前" v={fmtF(M.grad.lossBefore, 4)} color={C.coral} size={FT.h2} />
        <KV k="损失 · 下降后" v={fmtF(M.grad.lossAfter, 4)} color={C.cyan} size={FT.h2} />
        <Body size={FT.meta} style={{ marginTop: 12 }}>这一步只证明梯度能用来下降，不证明模型有用。</Body>
      </Card>
    </div>
  </>
);

const P7: React.FC = () => (
  <>
    <Head kicker="06 / 验证" title="缩放消融：真实窗口读数" goal="不缩放会变尖，但不会 NaN" />
    <div style={{ position: "absolute", left: PAD, top: 350, width: 1000 }}>
      <Card label="最大 |logit|" accent={C.coral} style={{ height: 380 }} pad={18}>
        <Bars width={920} rowH={80} max={Math.ceil(M.scaling.unscaledMax)}
          items={[
            { label: "缩放后", value: M.scaling.scaledMax, text: fmtF(M.scaling.scaledMax, 4), color: C.cyan },
            { label: "不缩放", value: M.scaling.unscaledMax, text: fmtF(M.scaling.unscaledMax, 4), color: C.coral },
          ]} />
      </Card>
    </div>
    <div style={{ position: "absolute", left: PAD + 1040, top: 350, width: CW - 1040 }}>
      <Card label="平均熵" accent={C.cyan} style={{ height: 380 }}>
        <KV k="缩放后" v={fmtF(M.scaling.scaledEntropy, 4) + " bit"} color={C.cyan} size={FT.h2} />
        <KV k="不缩放" v={fmtF(M.scaling.unscaledEntropy, 4) + " bit"} color={C.coral} size={FT.h2} />
        <Body size={FT.body} style={{ marginTop: 14 }}>分布更尖，但仍是合法分布。</Body>
        <Chip color={C.amber}>没有出现 NaN：双精度下只是饱和与熵塌缩</Chip>
      </Card>
    </div>
    <div style={{ position: "absolute", left: PAD, top: 760, width: CW }}>
      <Body size={FT.meta} color={C.inkFaint}>
        计划草稿里「去掉缩放会炸成 NaN」的说法是错的，已在勘误 E36 与边界页更正。
      </Body>
    </div>
  </>
);

export const SVerification: React.FC = () => (
  <Pages id="verification" at={[0, pageAt("verification", 4), pageAt("verification", 12), pageAt("verification", 19), pageAt("verification", 28), pageAt("verification", 32), pageAt("verification", 38)]}>
    <P1 />
    <P2 />
    <P3 />
    <P4 />
    <P5 />
    <P6 />
    <P7 />
  </Pages>
);
