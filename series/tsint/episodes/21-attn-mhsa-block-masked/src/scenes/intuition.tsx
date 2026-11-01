import React from "react";
import { C, FONT, FT } from "../../design/tokens";
import { Bars, Body, CW, Card, Chip, Formula, Head, K, KV, LinePlot, M, PAD, Pages, Row, SoftmaxRow, Stat, fmtF, fmtP, pageAt } from "../shared";

const P1: React.FC = () => {
  const cols = M.data.series.slice(0, 3);
  const palette = [C.cyan, C.amber, C.violet];
  return (
    <>
      <Head kicker="04 / 直觉" title="注意力是一次软查表" goal="96 个位置互相提问、互相回答" />
      <div style={{ position: "absolute", left: PAD, top: 340, width: 1080 }}>
        <Card label="输入窗口（列内 z 分数）" accent={C.cyan} style={{ height: 400 }} pad={18}>
          <LinePlot width={1000} height={310}
            series={cols.map((c, i) => ({ values: M.window.z[c], color: palette[i], name: c }))}
            title={M.data.first + " → " + M.data.last + " · 96 个交易日"} padL={64} padB={40} padT={26} />
        </Card>
      </div>
      <div style={{ position: "absolute", left: PAD + 1120, top: 340, width: CW - 1120 }}>
        <Card label="两条路径" accent={C.violet} style={{ height: 400 }}>
          <KV k="Q · 我想问什么" v="96 × 16（每头）" color={C.cyan} />
          <KV k="K · 我能回答什么" v="96 × 16（每头）" color={C.amber} />
          <KV k="V · 我实际携带什么" v="96 × 16（每头）" color={C.violet} />
          <Body size={FT.meta} style={{ marginTop: 14 }}>
            打分是 Q 和 K 的内积；加权求和用的是 V。三者同源，但投影不同。
          </Body>
        </Card>
      </div>
    </>
  );
};

const P2: React.FC = () => (
  <>
    <Head kicker="04 / 直觉" title="缩放是在调温度" goal="同一组打分，除不除 √d_k" />
    <div style={{ position: "absolute", left: PAD, top: 350, width: 980 }}>
      <Card label="手算 2×2：Q = K = [[1],[2]]，V = [[10],[20]]" accent={C.amber} style={{ height: 380 }}>
        <SoftmaxRow label="第 0 行" logits={M.hand.logitsRows[0]} weights={M.hand.weights[0]} />
        <div style={{ marginTop: 14 }} />
        <SoftmaxRow label="第 1 行" logits={M.hand.logitsRows[1]} weights={M.hand.weights[1]} />
        <Body size={FT.body} style={{ marginTop: 18 }}>
          权重乘 V：第 0 行输出 {fmtF(M.hand.out0, 4)}，第 1 行输出 {fmtF(M.hand.out1, 4)}。
        </Body>
        <K style={{ display: "block", marginTop: 10 }}>d_k = 1，所以缩放因子是 1；这里只演示 softmax 的形状</K>
      </Card>
    </div>
    <div style={{ position: "absolute", left: PAD + 1020, top: 350, width: CW - 1020 }}>
      <Card label="真实窗口上的两个读数" accent={C.coral} style={{ height: 380 }}>
        <KV k="缩放后 · 最大 |logit|" v={fmtF(M.scaling.scaledMax, 4)} color={C.cyan} size={FT.h2} />
        <KV k="不缩放 · 最大 |logit|" v={fmtF(M.scaling.unscaledMax, 4)} color={C.coral} size={FT.h2} />
        <KV k="缩放后 · 平均熵" v={fmtF(M.scaling.scaledEntropy, 4) + " bit"} color={C.cyan} />
        <KV k="不缩放 · 平均熵" v={fmtF(M.scaling.unscaledEntropy, 4) + " bit"} color={C.coral} />
        <Body size={FT.meta} style={{ marginTop: 12 }}>熵越低，分布越尖；不缩放时掉到约 4.1 bit。</Body>
      </Card>
    </div>
  </>
);

const P3: React.FC = () => (
  <>
    <Head kicker="04 / 直觉" title="四个头有多像" goal="初始化权重下的注意力熵" />
    <div style={{ position: "absolute", left: PAD, top: 350, width: 900 }}>
      <Card label="每头平均熵（96 行）" accent={C.cyan} style={{ height: 380 }} pad={18}>
        <Bars width={820} rowH={62} max={6.585}
          items={M.heads.stats.map((s, i) => ({
            label: "head" + s.head,
            value: s.entropyBits,
            text: fmtF(s.entropyBits, 4) + " bit",
            color: [C.cyan, C.amber, C.violet, C.coral][i],
          }))} />
        <K style={{ display: "block", marginTop: 6 }}>96 列均匀分布的上限 = log₂96 = 6.585 bit</K>
      </Card>
    </div>
    <div style={{ position: "absolute", left: PAD + 940, top: 350, width: CW - 940 }}>
      <Card label="这说明什么" accent={C.coral} style={{ height: 380 }}>
        <Body size={FT.lead} color={C.ink}>四个头几乎是均匀的。</Body>
        <Body size={FT.body} style={{ marginTop: 14 }}>
          最大权重平均只有 {fmtP(Math.min(...M.heads.stats.map((s) => s.maxWeightMean)), 2)} 到 {fmtP(Math.max(...M.heads.stats.map((s) => s.maxWeightMean)), 2)}。
          没有训练，就没有分化，也没有可解释的「注意力模式」。
        </Body>
        <Body size={FT.body} style={{ marginTop: 14 }} color={C.coral}>
          所以本集不声称任何头学到了周期、趋势或结构。
        </Body>
      </Card>
    </div>
  </>
);

const P4: React.FC = () => (
  <>
    <Head kicker="04 / 直觉" title="最后一次查表" goal="最后一行注意力落在哪些日子" />
    <div style={{ position: "absolute", left: PAD, top: 350, width: 940 }}>
      <Card label="head0 · 窗口最后一行 · 权重最高的 6 天" accent={C.violet} style={{ height: 380 }} pad={18}>
        <Bars width={860} rowH={48} max={0.05}
          items={M.heads.lookup.map((r) => ({ label: r.date, value: r.weight, text: fmtP(r.weight, 2), color: C.violet }))} />
      </Card>
    </div>
    <div style={{ position: "absolute", left: PAD + 980, top: 350, width: CW - 980 }}>
      <Card label="怎么读这张表" accent={C.cyan} style={{ height: 380 }}>
        <Row name="最高权重" value={fmtP(M.heads.lookup[0].weight, 2)} color={C.violet} />
        <Row name="均匀权重 1/96" value="1.04%" color={C.inkDim} />
        <Row name="倍数" value="约 4.5 倍" color={C.inkDim} />
        <Body size={FT.body} style={{ marginTop: 16 }}>
          比均匀高几倍，但仍然很平；日期分布也看不出周期。随机权重下，这就是预期结果。
        </Body>
      </Card>
    </div>
  </>
);

export const SIntuition: React.FC = () => (
  <Pages id="intuition" at={[0, pageAt("intuition", 6), pageAt("intuition", 13), pageAt("intuition", 20)]}>
    <P1 />
    <P2 />
    <P3 />
    <P4 />
  </Pages>
);
