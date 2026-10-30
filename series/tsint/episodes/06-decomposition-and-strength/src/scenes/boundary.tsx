import React from "react";
import { Build } from "../../design/primitives";
import { C, FONT, FT } from "../../design/tokens";
import { Body, Card, Chip, K, PAD, Pages, Scene, SceneHead, Stat, lf } from "../shared";

const No: React.FC<{ n: string; bad: string; why: React.ReactNode; width: number }> = ({ n, bad, why, width }) => (
  <Card label={"不能说 · " + n} accent={C.coral} style={{ width, height: 250 }}>
    <div style={{ fontFamily: FONT.sans, fontSize: FT.lead, color: C.coral, textDecoration: "line-through", textDecorationColor: C.coral, lineHeight: 1.4 }}>{bad}</div>
    <Body size={FT.meta} style={{ marginTop: 10 }}>{why}</Body>
  </Card>
);

export const SBoundary: React.FC = () => (
  <Scene id="boundary">
    <SceneHead id="boundary" />
    <Pages id="boundary" at={[0, 0.52]}>
      <div>
        <div style={{ position: "absolute", left: PAD, top: 236, fontFamily: FONT.sans, fontSize: FT.h2, color: C.inkDim }}>
          四条不能说的话：每一条都是把「描述」当成了「结论」。
        </div>
        <Build at={lf("boundary", 0.05)}>
          <div style={{ position: "absolute", left: PAD, top: 310, display: "flex", gap: 26 }}>
            <No n="第一条" bad="趋势强度高，就能预测。" width={574} why={"强度是解释比例，不是可预测性。它没说未来误差多大，也没做显著性检验；一条随机游走，趋势强度也可能很高。"} />
            <No n="第二条" bad="季节强度高，就能做季节交易。" width={574} why={"强度是方差占比，没算成本，没算滑点；也没回答这个季节明年还在不在。"} />
            <No n="第三条" bad="纯噪声的趋势强度是零。" width={574} why={"不是。0.274 是核的残余；换周期、换长度，这个数会变，不能当固定门槛。"} />
          </div>
        </Build>
        <Build at={lf("boundary", 0.18)}>
          <div style={{ position: "absolute", left: PAD, top: 620, display: "flex", gap: 26 }}>
            <No n="第四条" bad="分解是唯一的分解。" width={574} why={"STL、X-13、HP 滤波都叫分解，给出的趋势和季节可以完全不同；经典分解只是其中最老的一种。"} />
            <div style={{ width: 1176, background: C.panel, border: "1px solid " + C.panelLine, borderLeft: "3px solid " + C.amber, borderRadius: 12, padding: "20px 26px", height: 250 }}>
              <K>一句话</K>
              <div style={{ fontFamily: FONT.sans, fontSize: FT.h2, color: C.ink, marginTop: 6, lineHeight: 1.5 }}>强度是「这条序列、这个周期、这个核」下的描述。</div>
              <Body size={FT.meta} style={{ marginTop: 8 }}>三样里换一样，数就换一个；所以报数的时候，三样都要写出来。</Body>
            </div>
          </div>
        </Build>
        <Build at={lf("boundary", 0.3)}>
          <div style={{ position: "absolute", left: PAD, top: 910, fontFamily: FONT.sans, fontSize: FT.meta, color: C.inkFaint }}>
            这四条不是苛求，是「可复现」的最低要求。
          </div>
        </Build>
      </div>

      <div>
        <div style={{ position: "absolute", left: PAD, top: 236, fontFamily: FONT.sans, fontSize: FT.h2, color: C.inkDim }}>
          实现上的代价：丢点不是缺陷，是定义。
        </div>
        <Build at={lf("boundary", 0.58)}>
          <div style={{ position: "absolute", left: PAD, top: 310, display: "flex", gap: 26 }}>
            <Card accent={C.amber} style={{ width: 574, height: 250 }}><K>代价 1 · 端点丢点</K><Body style={{ marginTop: 8 }}>周期 5，两端各丢 2 个点：730 天只剩 726 天。周期 21，各丢 10 个，只剩 710。周期 48，各丢 24 个，240 根只剩 192 根。</Body></Card>
            <Card accent={C.amber} style={{ width: 574, height: 250 }}><K>代价 2 · 周期必须对</K><Body style={{ marginTop: 8 }}>周期必须等于季节长度；选错周期，季节项会把别的周期吸进来。</Body></Card>
            <Card accent={C.amber} style={{ width: 574, height: 250 }}><K>代价 3 · 乘法要求全正</K><Body style={{ marginTop: 8 }}>有零有负只能走加法，或者先加一再取对数；这一步不自动做，要调用方决定。</Body></Card>
          </div>
        </Build>
        <Build at={lf("boundary", 0.68)}>
          <div style={{ position: "absolute", left: PAD, top: 630, width: 1776, background: C.panel, border: "1px solid " + C.panelLine, borderLeft: "3px solid " + C.cyan, borderRadius: 12, padding: "22px 26px" }}>
            <div style={{ fontFamily: FONT.sans, fontSize: FT.h2, color: C.ink }}>移动平均在端点没有定义；补零、补端点值，都是凭空造趋势。</div>
            <K style={{ display: "block", marginTop: 8 }}>所以返回 Left 或 Nothing，不返回一个猜出来的数。</K>
          </div>
        </Build>
        <Build at={lf("boundary", 0.72)}>
          <div style={{ position: "absolute", left: PAD, top: 830, width: 1776, display: "flex", gap: 26 }}>
            <Stat label="已验证端点" value="2 → 727" sub="730 天 · m = 5 · 有效 726" style={{ width: 875, height: 170 }} />
            <Stat label="已验证端点" value="24 → 215" sub="240 根 · m = 48 · 有效 192" style={{ width: 875, height: 170 }} />
          </div>
        </Build>
      </div>
    </Pages>
  </Scene>
);
