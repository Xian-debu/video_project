import React from "react";
import { C, FONT, FT } from "../../design/tokens";
import { Body, Card, Chip, CW, Head, K, PAD, Pages, Row } from "../shared";

const Item: React.FC<{ idx: string; title: string; a: string; b: string; accent?: string }> = ({ idx, title, a, b, accent = C.inkFaint }) => (
  <div style={{ width: 560, padding: "18px 22px", background: C.panel, border: "1px solid " + C.panelLine, borderRadius: 12 }}>
    <div style={{ display: "flex", alignItems: "baseline", gap: 14 }}>
      <div style={{ fontFamily: FONT.mono, fontSize: FT.meta, color: accent }}>{idx}</div>
      <div style={{ fontFamily: FONT.sans, fontSize: FT.h3, color: C.ink }}>{title}</div>
    </div>
    <Body size={FT.body} style={{ marginTop: 10 }}>{a}</Body>
    <Body size={FT.meta} style={{ marginTop: 6 }}>{b}</Body>
  </div>
);

const P1: React.FC = () => (
  <>
    <Head kicker="07 / 边界" title="这一集没做六件事" goal="没做的，排在明面上" />
    <div style={{ position: "absolute", left: PAD, top: 320, width: CW, display: "flex", flexWrap: "wrap", gap: 22 }}>
      <Item idx="①" title="没有换更大的面板" a="100 只票、一年，够说明机制。" b="不够代表全市场。" />
      <Item idx="②" title="没有做下游" a="只比补全误差，没有拿补全矩阵去训预测模型。" b="补得准不等于预测准。" />
      <Item idx="③" title="没有调超参" a="邻居数、带宽、秩、岭项都是固定小值。" b="调参会改变排序，这一点必须说清楚。" accent={C.amber} />
      <Item idx="④" title="整段缺失的退化" a="低秩补出零，是模型的必然。" b="不是我们没实现。" accent={C.coral} />
      <Item idx="⑤" title="DTW 不是距离" a="不满足三角不等式，没有度量结构。" b="所以最近邻只能暴力两两算。" />
      <Item idx="⑥" title="书中未给的，都是本仓补的" a="距离、权重、目标函数、迭代式、超参。" b="全部登记在自授条目里。" accent={C.cyan} />
    </div>
  </>
);

const P2: React.FC = () => (
  <>
    <Head kicker="07 / 边界" title="补的和改的，都留了编号" goal="后续集不能悄悄改口径" />
    <div style={{ position: "absolute", left: PAD, top: 340, width: 1000 }}>
      <Card label="自授条目 A32" accent={C.cyan} style={{ height: 380 }}>
        <Row name="距离" value="DTW，三条转移 + 带宽" note="书 p.17 只有一句列举" />
        <Row name="KNN 权重" value="等权 1/k" note="只排序，不加权" />
        <Row name="低秩目标" value="只在 Ω 上算残差" note="缺失格不参与" />
        <Row name="迭代与容差" value="300 轮 / 1e−10" note="硬截断与软阈值各一套" />
        <Row name="矩阵分解" value="ALS + 岭项 λ=1e−3" note="因子不唯一只比重建" />
      </Card>
    </div>
    <div style={{ position: "absolute", left: PAD + 1040, top: 340, width: CW - 1040 }}>
      <Card label="勘误 E29" accent={C.coral} style={{ height: 170 }}>
        <Body size={FT.body}>
          式(2.40) 的 X ≈ F · X̂ 维度不自洽，本仓按 X̂ · F 实现。
        </Body>
      </Card>
      <Card label="冻结" accent={C.amber} style={{ height: 170, marginTop: 26 }}>
        <Body size={FT.body}>
          这些口径写进自授与勘误，后续集引用时必须一致。
        </Body>
        <div style={{ marginTop: 14 }}><Chip color={C.amber}>口径冻结</Chip></div>
      </Card>
    </div>
  </>
);

export const SBoundary: React.FC = () => (
  <Pages id="boundary" at={[0, 0.5]}>
    <P1 />
    <P2 />
  </Pages>
);
