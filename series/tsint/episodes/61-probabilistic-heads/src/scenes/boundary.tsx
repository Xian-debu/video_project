import React from "react";
import { AbsoluteFill } from "remotion";
import { C, FONT, FT } from "../../design/tokens";
import { Body, Card, Foot, KV, M, PAD, Pages, Row, Scene, SceneHead, fmt2, fmt4, pagesOf } from "../shared";
import { QuantileTails } from "../figs";

export const BoundaryScene: React.FC = () => (
  <Scene id="boundary">
    <SceneHead id="boundary" />
    <Pages id="boundary" at={pagesOf("boundary")}>
      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 292, width: 620 }}>
          <Body size={FT.h1} color={C.ink} style={{ lineHeight: 1.2 }}>交叉率是<br />设定的函数。</Body>
          <Body style={{ marginTop: 26 }}>
            百分之三点三六不是普适常数。同一份数据换窗口：六十四点时交叉率到十四；特征很少、样本很多时，掉到万分之三。
            本集选三十二点窗口与四百个拟合，理由是它落在书里三到五的量级。换设定，屏幕上的数就会变。
          </Body>
          <div style={{ display: "flex", marginTop: 28 }}>
            <KV k="本集" v="3.36%" color={C.cyan} />
            <KV k="窗口 64" v="14%" color={C.coral} />
            <KV k="p 小 n 大" v="0.03%" color={C.violet} />
          </div>
        </div>
        <div style={{ position: "absolute", left: 790, top: 292, width: 1030 }}>
          <Card label="同一份数据，三种设定" accent={C.amber} style={{ width: 1020 }}>
            <Row name="窗口 32 · 拟合 400" value="3.3616%" note="本集口径：落在书里 3–5% 的量级" width={972} color={C.cyan} valueW={280} />
            <Row name="窗口 64 · 拟合 200" value="14.10%" note="特征翻倍、样本减半，估计误差放大" width={972} color={C.coral} valueW={280} />
            <Row name="窗口 20 · 全量 1,155" value="0.0275%" note="参数少、样本多，九条线几乎平行" width={972} color={C.violet} valueW={280} />
          </Card>
          <div style={{ marginTop: 16, fontFamily: FONT.mono, fontSize: FT.meta, color: C.inkFaint, lineHeight: 1.6, width: 1000 }}>
            所以这个数只能和这套口径一起引用。脱离口径引用它，就是耍流氓。
          </div>
        </div>
        <Foot>换设定，屏幕上的数就会变。</Foot>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 292, width: 620 }}>
          <Body size={FT.h1} color={C.ink} style={{ lineHeight: 1.2 }}>覆盖率差，<br />全在尾部。</Body>
          <Body style={{ marginTop: 26 }}>
            名义九十五，实测九十二点四。区间外的三十八天里二十三天在上方，因为右尾比高斯厚：九十五分位实测四点零六，
            高斯只给三点五四。五百天里最极端的一天跌了十七点七，左尾的百分之一处也比高斯更远。只看中间，会以为拟合很好。
          </Body>
          <div style={{ display: "flex", marginTop: 28 }}>
            <KV k="名义" v="0.9500" color={C.inkDim} />
            <KV k="实测" v={fmt4(M.dist.coverage)} color={C.coral} />
            <KV k="最极端" v="−17.69" color={C.amber} />
          </div>
        </div>
        <div style={{ position: "absolute", left: 790, top: 292, width: 1030 }}>
          <Card label="经验分位（实线）与高斯分位（虚线）：中间更薄，两端的尾巴各自不同" accent={C.coral}>
            <QuantileTails width={930} height={330} />
          </Card>
          <div style={{ marginTop: 8, fontFamily: FONT.mono, fontSize: FT.micro, color: C.inkFaint, width: 1010 }}>
            5% 分位经验 {fmt2(M.tails.q05)} vs 高斯 {fmt2(M.tails.g05)}（左尾更薄）；95% 分位经验 {fmt2(M.tails.q95)} vs 高斯 {fmt2(M.tails.g95)}（右尾更高）。
          </div>
        </div>
        <Foot>真正决定覆盖率的是尾部那几个点。</Foot>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 292, width: 620 }}>
          <Body size={FT.h1} color={C.ink} style={{ lineHeight: 1.2 }}>能说，<br />与不能说。</Body>
          <Body style={{ marginTop: 26 }}>
            能说的是：独立训练的分位线会交叉，量级三到五；按样本排序消掉交叉，不需要新参数；排序后 pinball 损失变化小于零点三；
            高斯头覆盖率低于名义值，尾部偏厚。不能说：排序提升了预测精度，或者高斯头已经校准。
          </Body>
          <div style={{ display: "flex", marginTop: 28 }}>
            <KV k="能说" v="4 条" color={C.cyan} />
            <KV k="不能说" v="4 条" color={C.coral} />
          </div>
        </div>
        <div style={{ position: "absolute", left: 790, top: 292, width: 1030 }}>
          <div style={{ display: "flex", gap: 18 }}>
            <Card label="能说" accent={C.cyan} style={{ width: 500 }} pad={20}>
              <Row name="交叉存在" value="3–5%" width={452} color={C.cyan} valueW={200} />
              <Row name="排序消交叉" value="零参数" width={452} color={C.cyan} valueW={200} />
              <Row name="代价" value="&lt; 0.3%" width={452} color={C.cyan} valueW={200} />
              <Row name="尾部偏厚" value="0.924" width={452} color={C.cyan} valueW={200} />
            </Card>
            <Card label="不能说" accent={C.coral} style={{ width: 500 }} pad={20}>
              <Row name="提升精度" value="不能" width={452} color={C.coral} valueW={200} />
              <Row name="普遍成立" value="不能" width={452} color={C.coral} valueW={200} />
              <Row name="小样本外" value="不能" width={452} color={C.coral} valueW={200} />
              <Row name="已经校准" value="不能" width={452} color={C.coral} valueW={200} />
            </Card>
          </div>
          <div style={{ marginTop: 16, fontFamily: FONT.mono, fontSize: FT.micro, color: C.inkFaint, width: 1000 }}>
            边界写清楚，结论才站得住。能被复核的只是这四条口径下的读数。
          </div>
        </div>
        <Foot>边界写清楚，结论才站得住。</Foot>
      </AbsoluteFill>
    </Pages>
  </Scene>
);
