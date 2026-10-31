import React from "react";
import { Build } from "../../design/primitives";
import { C, FONT, FT } from "../../design/tokens";
import { Body, Card, Chip, Formula, K, M, Matrix, PAD, Pages, Row, Scene, SceneHead, Verdict, lf } from "../shared";

/* 问题：三处不对劲——叫卷积却算互相关、因果卷积下标反了、归一化压成一步。 */

export const SProblem: React.FC = () => {
  const m = M;
  const hand = m.struct.hand;
  return (
    <Scene id="problem">
      <SceneHead id="problem" />
      <Pages id="problem" at={[0, 0.16, 0.31, 0.44, 0.62, 0.84]}>
        <div>
          <Build at={lf("problem", 0.03)}>
            <div style={{ position: "absolute", left: PAD, top: 300 }}>
              <Formula size={56} style={{ color: C.ink }}>y_ij = Σ_m Σ_n x_(i+m, j+n) · w_mn</Formula>
              <K style={{ display: "block", marginTop: 14 }}>式 (2.48) · 书里这一行没有翻转</K>
            </div>
          </Build>
          <Build at={lf("problem", 0.09)}>
            <div style={{ position: "absolute", left: PAD, top: 476, display: "flex", gap: 26 }}>
              <Card label="它做的事" accent={C.cyan} style={{ width: 875, height: 300 }}>
                <div style={{ fontFamily: FONT.serif, fontSize: FT.h2, color: C.ink }}>窗口按位乘核，再求和</div>
                <Body style={{ marginTop: 14 }}>核原样压在窗口上，不转。相邻位置共享同一个核。</Body>
              </Card>
              <Card label="它没做的事" accent={C.coral} style={{ width: 875, height: 300 }}>
                <div style={{ fontFamily: FONT.serif, fontSize: FT.h2, color: C.ink }}>核一次都没有转一百八十度</div>
                <Body style={{ marginTop: 14 }}>数学意义下的卷积要先翻转。所以这个式子算的是互相关。</Body>
              </Card>
            </div>
          </Build>
          <Build at={lf("problem", 0.13)}>
            <div style={{ position: "absolute", left: PAD, top: 812, fontFamily: FONT.sans, fontSize: FT.body, color: C.inkDim }}>
              书里叫它卷积，这是通行叫法；但同一个核，转不转，结果差一个镜像。
            </div>
          </Build>
        </div>

        <div>
          <Build at={lf("problem", 0.19)}>
            <div style={{ position: "absolute", left: PAD, top: 300 }}>
              <Formula size={50} style={{ color: C.ink }}>互相关：y = X ⊛ W　　真卷积：y = X ⊛ rot180(W)</Formula>
              <K style={{ display: "block", marginTop: 14 }}>深度学习框架里的卷积层，实现的是互相关</K>
            </div>
          </Build>
          <Build at={lf("problem", 0.24)}>
            <div style={{ position: "absolute", left: PAD, top: 452, display: "flex", gap: 26 }}>
              <Card label="后果" accent={C.amber} style={{ width: 1776, height: 250 }}>
                <Body size={FT.lead} style={{ color: C.ink }}>
                  书里的式子和库里的实现，名字一样、方向相反。手写时照抄式子，梯度会悄悄少一个符号。
                </Body>
              </Card>
            </div>
          </Build>
        </div>

        <div>
          <Build at={lf("problem", 0.33)}>
            <div style={{ position: "absolute", left: PAD, top: 286, display: "flex", gap: 40 }}>
              <div>
                <Matrix rows={hand.x} cell={84} color={C.inkDim} caption="输入 X · 三乘三" showNumbers digits={0} />
              </div>
              <div>
                <Matrix rows={hand.w} cell={84} color={C.amber} caption="核 W · 两乘二" showNumbers digits={0} />
              </div>
              <div>
                <Matrix rows={hand.cross} cell={84} color={C.cyan} caption="互相关输出" showNumbers digits={0} />
              </div>
              <div>
                <Matrix rows={hand.trueConv} cell={84} color={C.violet} caption="真卷积输出（换号）" showNumbers digits={0} />
              </div>
            </div>
          </Build>
          <Build at={lf("problem", 0.37)}>
            <div style={{ position: "absolute", left: PAD, top: 560 }}>
              <Row name="左上角" value="1×1 + 2×0 + 4×0 + 5×(−1) = −4" note="窗口按位乘，再求和" width={1776} />
              <Row name="右上角" value="2×1 + 3×0 + 5×0 + 6×(−1) = −4" note="核往右挪一格" width={1776} />
              <Row name="四个都一样" value="核的和为零（1 + 0 + 0 − 1）" note="窗口每移一格，四项一起加一：平移不变" width={1776} />
              <Row name="真卷积" value="四个数全部换号：4，4，4，4" note="rot180 两次还原" color={C.violet} width={1776} />
            </div>
          </Build>
          <Build at={lf("problem", 0.41)}>
            <div style={{ position: "absolute", left: PAD, top: 742, display: "flex", gap: 20 }}>
              <Verdict ok label="测试钉住这四个数" />
              <K style={{ lineHeight: "24px" }}>ConvsSpec：非对称核 2D 黄金 −4 / −4 / −4 / −4</K>
            </div>
          </Build>
        </div>

        <div>
          <Build at={lf("problem", 0.47)}>
            <div style={{ position: "absolute", left: PAD, top: 296 }}>
              <Formula size={52} style={{ color: C.ink }}>y_t = Σ_(j=1..K) w_j · x_(t−j+1)</Formula>
              <K style={{ display: "block", marginTop: 14 }}>式 (2.62) 的本仓改法：求和到 t 为止，不含未来</K>
            </div>
          </Build>
          <Build at={lf("problem", 0.52)}>
            <div style={{ position: "absolute", left: PAD, top: 462, display: "flex", gap: 26 }}>
              <Card label="书里写法" accent={C.coral} style={{ width: 875, height: 320 }}>
                <Body style={{ color: C.ink }}>求和写成从 t 减 K 加一开始，到 t 结束；当 k 等于核长，有一项就是当刻的 x_t。</Body>
                <K style={{ display: "block", marginTop: 12 }}>照抄实现，核会反过来压在序列上</K>
              </Card>
              <Card label="后果" accent={C.amber} style={{ width: 875, height: 320 }}>
                <Body style={{ color: C.ink }}>静默泄漏未来：改最后一个输入，前面的输出也会动。测试里专门钉了这条因果性。</Body>
                <K style={{ display: "block", marginTop: 12 }}>改 x[4]，y[0..3] 一个都不许变</K>
              </Card>
            </div>
          </Build>
        </div>

        <div>
          <Build at={lf("problem", 0.65)}>
            <div style={{ position: "absolute", left: PAD, top: 288 }}>
              <Formula size={48} style={{ color: C.ink }}>P = D~^(−1/2) (A + I) D~^(−1/2)</Formula>
              <K style={{ display: "block", marginTop: 14 }}>式 (2.64) · 一行式子，三个没写的约定</K>
            </div>
          </Build>
          <Build at={lf("problem", 0.7)}>
            <div style={{ position: "absolute", left: PAD, top: 446, width: 1776 }}>
              <Row name="没写清一" value="原来的 A 对角线是不是零" note="不为零时再加 I，等于加了两遍自环" width={1776} />
              <Row name="没写清二" value="相关图的阈值取多少" note="零点六到零点三，边从四条涨到三百五十七条" width={1776} />
              <Row name="没写清三" value="稠密图能不能直接套" note="书里自己写了：会退化成全连接" color={C.coral} width={1776} />
            </div>
          </Build>
        </div>

        <div>
          <div style={{ position: "absolute", left: PAD, top: 288, fontFamily: FONT.sans, fontSize: FT.h2, color: C.inkDim }}>
            所以这一集加了两个实验：一张真图，一组环图。
          </div>
          <Build at={lf("problem", 0.88)}>
            <div style={{ position: "absolute", left: PAD, top: 396, display: "flex", gap: 26 }}>
              <Card label="真实行情图" accent={C.cyan} style={{ width: 875, height: 320 }}>
                <div style={{ fontFamily: FONT.serif, fontSize: FT.h2, color: C.ink }}>五十只票，阈值从零点六扫到零点三</div>
                <Body style={{ marginTop: 14 }}>两条收益序列的相关系数超过阈值就连边。图越密，邻居越多。</Body>
                <K style={{ display: "block", marginTop: 12 }}>对抗基线：传播子换成单位矩阵</K>
              </Card>
              <Card label="合成环图" accent={C.violet} style={{ width: 875, height: 320 }}>
                <div style={{ fontFamily: FONT.serif, fontSize: FT.h2, color: C.ink }}>半径从一放到二十五</div>
                <Body style={{ marginTop: 14 }}>每个节点的标签就在自己身上；邻居的信息是噪声。看结构注入会不会稀释它。</Body>
                <K style={{ display: "block", marginTop: 12 }}>半径越大，掺进来的邻居越多</K>
              </Card>
            </div>
          </Build>
          <Build at={lf("problem", 0.94)}>
            <div style={{ position: "absolute", left: PAD, top: 764, display: "flex", gap: 20 }}>
              <Chip color={C.cyan}>真图：量有没有东西可学</Chip>
              <Chip color={C.violet}>环图：量结构注入稀释多少</Chip>
              <Chip color={C.amber}>同一份代码、同一个参数量</Chip>
            </div>
          </Build>
        </div>
      </Pages>
    </Scene>
  );
};