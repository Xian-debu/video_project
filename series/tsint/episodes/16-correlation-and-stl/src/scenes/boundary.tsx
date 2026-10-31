import React from "react";
import { C, FONT, FT } from "../../design/tokens";
import { Body, Card, Chip, CW, Formula, Head, K, M, PAD, Pages, Row, fmtF } from "../shared";

const P1: React.FC = () => (
  <>
    <Head kicker="07 / 边界" title="两个数，各自的边界" goal="读数不当强度，强度不跨方法" />
    <div style={{ position: "absolute", left: PAD, top: 330, width: 900 }}>
      <Card label="为什么会偏" accent={C.coral} style={{ height: 340 }}>
        <Body size={FT.body} color={C.ink}>
          loess1 的窗口半径 r = (span−1)/2。中点有左右对称的 r 个邻居；
          端点左侧没有邻居，窗口被截成半边。
        </Body>
        <Body size={FT.body} color={C.ink} style={{ marginTop: 14 }}>
          截断的窗口本身不是错 —— 权重会重新归一化 —— 但局部线性拟合再用它做外推，
          端点值就被一条内插直线的延长线决定了。
        </Body>
        <Body size={FT.meta} color={C.inkFaint} style={{ marginTop: 16 }}>
          合成序列上量过：n = 60 时端点误差 2.03e−3，内点 2.8e−14。
        </Body>
      </Card>
    </div>
    <div style={{ position: "absolute", left: PAD + 940, top: 330, width: CW - 940 }}>
      <Card label="所以本仓的选择" accent={C.cyan} style={{ height: 340 }}>
        <Body size={FT.body} color={C.ink}>
          端点照常输出，不标 Nothing。STL 的输出要逐点满足 X = T + S + R，
          标缺失会让恒等式在两端断掉。
        </Body>
        <Body size={FT.body} color={C.ink} style={{ marginTop: 14 }}>
          代价是：真序列两端一两个周期的分解结果不可信。画图时不裁，但报结论时不拿端点说话。
        </Body>
        <div style={{ marginTop: 16 }}><Chip color={C.coral}>A34 · 端点局部线性</Chip></div>
      </Card>
    </div>
  </>
);

const P2: React.FC = () => (
  <>
    <Head kicker="07 / 边界" title="读数的天花板" goal="式(2.4) 的值域与样本量" />
    <div style={{ position: "absolute", left: PAD, top: 330, width: 900 }}>
      <Card label="值域" accent={C.violet} style={{ height: 330 }}>
        <Formula size={40} color={C.violet}>mean(p) &lt; Corr ≤ mean(p) + 1</Formula>
        <Body size={FT.body} style={{ marginTop: 18 }}>
          第二项在 (0, 1]。所以这个读数永远比平均相关大一点，最多大 1。
          它不是「相关强度」，更像「相关一致性 + 齐整度」的合成。
        </Body>
      </Card>
    </div>
    <div style={{ position: "absolute", left: PAD + 940, top: 330, width: CW - 940 }}>
      <Card label="样本的边界" accent={C.amber} style={{ height: 330 }}>
        <Body size={FT.body} color={C.ink}>
          100 只票、251 天、4950 对 —— 这 4950 个 Pearson 不是独立样本：
          同一只票出现在 99 对里。var(p) 的有效样本量远小于 K。
        </Body>
        <Body size={FT.body} color={C.ink} style={{ marginTop: 14 }}>
          读数只做描述，不做显著性。要推断得先处理这层相关性，本片不做。
        </Body>
      </Card>
    </div>
    <div style={{ position: "absolute", left: PAD, top: 760, width: CW }}>
      <Body size={FT.lead} color={C.ink}>
        所以片中从不写「相关性 1.07，显著高于」这类句子。只有读数本身。
      </Body>
    </div>
  </>
);

const P3: React.FC = () => (
  <>
    <Head kicker="07 / 边界" title="没做的三件事" goal="明确划出去，别让人误读" />
    <div style={{ position: "absolute", left: PAD, top: 340, width: CW }}>
      <Card label="范围" accent={C.coral} style={{ height: 430 }}>
        <Row name="鲁棒 STL" value="不做" note="bisquare 外层迭代需要残差尺度估计，书中没给，本仓也没实现" color={C.coral} />
        <Row name="RobustSTL 的 LAD 趋势" value="不做" note="L1 趋势项要另一套求解器，属于另一篇论文" color={C.coral} />
        <Row name="参数自动调优" value="不做" note="n_s、n_t 固定成公式，不做搜索；调参不是这一集要讲的事" color={C.coral} />
        <Row name="端点修正" value="不做" note="不补零、不平移、不外推；端点偏差写在片上，不藏进代码" color={C.amber} />
        <Row name="显著性检验" value="不做" note="见上一页：4950 对不独立，读数只做描述" color={C.amber} />
      </Card>
    </div>
    <div style={{ position: "absolute", left: PAD, top: 850, width: CW }}>
      <K>自授条目 A 三十三 / A 三十四 · 全部写在模块头注释里</K>
    </div>
  </>
);

export const SBoundary: React.FC = () => (
  <Pages id="boundary" at={[0, 7 / 21, 13 / 21]}>
    <P1 />
    <P2 />
    <P3 />
  </Pages>
);
