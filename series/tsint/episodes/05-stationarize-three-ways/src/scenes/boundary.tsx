import React from "react";
import { Build } from "../../design/primitives";
import { C, FONT, FT } from "../../design/tokens";
import { Body, Card, Chip, K, PAD, Pages, Scene, SceneHead, lf } from "../shared";

const No: React.FC<{ n: string; claim: string; truth: string; width: number }> = ({ n, claim, truth, width }) => (
  <Card label={"不能说 · " + n} accent={C.coral} style={{ width, height: 240 }}>
    <div style={{ fontFamily: FONT.sans, fontSize: FT.h2, color: C.ink, textDecoration: "line-through", textDecorationColor: C.coral }}>{claim}</div>
    <Body style={{ marginTop: 14 }}>{truth}</Body>
  </Card>
);

export const SBoundary: React.FC = () => (
  <Scene id="boundary">
    <SceneHead id="boundary" />
    <Pages id="boundary" at={[0, 0.55]}>
      <div>
        <div style={{ position: "absolute", left: PAD, top: 236, fontFamily: FONT.sans, fontSize: FT.h2, color: C.inkDim }}>
          四条不能说的话，都是这一章常见的误读。
        </div>
        <Build at={lf("boundary", 0.06)}>
          <div style={{ position: "absolute", left: PAD, top: 318, display: "flex", flexWrap: "wrap", gap: 22, width: 1776 }}>
            <No n="第一条" claim="差分能提高预测。" truth="不一定。差分去掉的是信息，不是噪声；它换来可建模性，不保证精度。" width={877} />
            <No n="第二条" claim="差分会把均值变成零。" truth="不会。差分不减均值。均值归零是标准化干的。" width={877} />
            <No n="第三条" claim="对数能治趋势。" truth="不能。对数只改尺度；加法趋势原样保留，指数趋势被拉成直线。" width={877} />
            <No n="第四条" claim="Z-score 是平稳化。" truth="不是。它是仿射变换，ACF 与原来完全相同。" width={877} />
          </div>
        </Build>
      </div>

      <div>
        <div style={{ position: "absolute", left: PAD, top: 236, fontFamily: FONT.sans, fontSize: FT.h2, color: C.inkDim }}>
          还有三条实现边界：不是缺陷，是定义。
        </div>
        <Build at={lf("boundary", 0.6)}>
          <div style={{ position: "absolute", left: PAD, top: 318, display: "flex", gap: 22 }}>
            <Card label="代价 1" accent={C.amber} style={{ width: 577, height: 260 }}>
              <K>差分放大噪声</K>
              <Body style={{ marginTop: 10 }}>白噪声做差分，方差翻倍；随机游走差分回来的是步长噪声。</Body>
            </Card>
            <Card label="代价 2" accent={C.amber} style={{ width: 577, height: 260 }}>
              <K>差分丢观测</K>
              <Body style={{ marginTop: 10 }}>d 阶丢 d 个点；加季节差分再丢 L 个点。时间戳必须一起丢。</Body>
            </Card>
            <Card label="代价 3" accent={C.amber} style={{ width: 577, height: 260 }}>
              <K>季节差分要求长度</K>
              <Body style={{ marginTop: 10 }}>长度不大于周期就报 DiffTooShort，不返回空序列假装成功。</Body>
            </Card>
          </div>
        </Build>
        <Build at={lf("boundary", 0.68)}>
          <div style={{ position: "absolute", left: PAD, top: 620, width: 1776, background: C.panel, border: "1px solid " + C.panelLine, borderLeft: "3px solid " + C.cyan, borderRadius: 12, padding: "20px 26px" }}>
            <div style={{ fontFamily: FONT.sans, fontSize: FT.h2, color: C.ink }}>变换之后，先检查变换是否成立：对数的定义域、差分的长度、标准化的方差。</div>
            <K style={{ display: "block", marginTop: 8 }}>报错比修数好：修数是猜，报错是事实</K>
          </div>
        </Build>
        <Build at={lf("boundary", 0.74)}>
          <div style={{ position: "absolute", left: PAD, top: 760, width: 1776 }}>
            <Chip color={C.cyan}>这一集的方法到此为止；下一场收尾</Chip>
          </div>
        </Build>
      </div>
    </Pages>
  </Scene>
);
