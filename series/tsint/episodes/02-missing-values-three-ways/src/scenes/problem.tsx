import React from "react";
import { Build } from "../../design/primitives";
import { C, FONT, FT } from "../../design/tokens";
import { Card, Body, Mono, K, Chip, PAD, Pages, Scene, SceneHead, MaskGrid, Bars, fmtInt, fmtE, M, lf } from "../shared";

/** 问题：删除偏误、均值压方差、LOCF 造零，以及遮挡实验的设计。 */
export const SProblem: React.FC = () => {
  const id = "problem";
  const b = (k: number) => lf(id, k);
  const v = M.variance;
  const z = M.zeros;
  return (
    <Scene id={id}>
      <SceneHead id={id} />
      <Pages id={id} at={[0, 0.26, 0.5, 0.72]}>
        {/* 1 · 删行 = 删尾部 */}
        <div>
          <div style={{ position: "absolute", left: PAD, top: 276, width: 1776 }}>
            <Body color={C.ink} size={FT.lead}>如果把缺失的行直接删掉，剩下的样本就不是随机样本。</Body>
          </div>
          {[
            { t: "停牌常发生在坏消息之后", s: "也可能发生在重组之前", c: C.coral },
            { t: "删掉它们，等于删掉尾部", s: "极端行情先从样本里消失", c: C.coral },
            { t: "波动被低估，收益被高估", s: "这叫样本选择偏误", c: C.amber },
          ].map((c, i) => (
            <div key={c.t} style={{ position: "absolute", left: PAD + i * 600, top: 350, width: 560 }}>
              <Build at={b(0.04 + i * 0.03)}>
                <Card label={"偏误 " + (i + 1)} accent={c.c} pad={22} style={{ width: 560, height: 200 }}>
                  <Body color={C.ink} size={FT.h2} style={{ fontFamily: FONT.serif, lineHeight: 1.4 }}>{c.t}</Body>
                  <K style={{ display: "block", marginTop: 18 }}>{c.s}</K>
                </Card>
              </Build>
            </div>
          ))}
          <div style={{ position: "absolute", left: PAD, top: 590, width: 1776 }}>
            <Build at={b(0.16)}>
              <Card accent={C.inkFaint} pad={20} style={{ width: 1776, height: 130 }}>
                <Body size={FT.body}>本集的样本里，退市股的六年断档不是缺失值，而是根本没有交易。删行会连同「坏消息之后停牌」这段历史一起删掉。</Body>
                <K>所以三种填法都要量代价，而不是先假定某一种更好</K>
              </Card>
            </Build>
          </div>
        </div>

        {/* 2 · 均值压方差 */}
        <div>
          <div style={{ position: "absolute", left: PAD, top: 272, width: 1776 }}>
            <Body color={C.ink} size={FT.lead}>均值是一个常数；常数不贡献方差，填得越多，方差越小。</Body>
          </div>
          <div style={{ position: "absolute", left: PAD, top: 360, width: 880 }}>
            <Build at={b(0.29)}>
              <Card label="收益率方差随遮挡比例（可解析）" accent={C.coral} pad={22} style={{ width: 880, height: 300 }}>
                <Bars width={820} rowH={64} at={b(0.3)} items={[
                  { label: "p = 0", value: v.p5.obs, text: fmtE(v.p5.obs), color: C.inkDim },
                  { label: "p = 5%", value: v.p5.imputed, text: fmtE(v.p5.imputed), color: C.coral },
                  { label: "p = 20%", value: v.p20.imputed, text: fmtE(v.p20.imputed), color: C.coral },
                ]} unit="单位：日收益方差 · 均值填充后实测" />
                <K style={{ display: "block", marginTop: 10 }}>每挡都少掉与 p 相同的比例；第 6 场会逐条复算</K>
              </Card>
            </Build>
          </div>
          <div style={{ position: "absolute", left: PAD + 920, top: 360, width: 856 }}>
            <Build at={b(0.33)}>
              <Card label="为什么" accent={C.amber} pad={22} style={{ width: 856, height: 300 }}>
                <Body color={C.ink} size={FT.h2} style={{ fontFamily: FONT.serif, lineHeight: 1.5 }}>
                  Var(填充后) = (1 − p) · Var(原序列)
                </Body>
                <Body size={FT.body} style={{ marginTop: 18 }}>观测占 1−p，常数占 p；常数与观测无关，交叉项为零，只剩观测部分的方差。</Body>
                <div style={{ marginTop: 18 }}><Chip>这是恒等式，不是近似</Chip></div>
              </Card>
            </Build>
          </div>
        </div>

        {/* 3 · LOCF 零收益 */}
        <div>
          <div style={{ position: "absolute", left: PAD, top: 276, width: 860 }}>
            <Body color={C.ink} size={FT.lead}>上一次观测值往前带，填出来的收益很多是零。</Body>
          </div>
          <div style={{ position: "absolute", left: PAD, top: 360, width: 880 }}>
            <Build at={b(0.53)}>
              <Card label="零收益个数 · 5% 遮挡" accent={C.amber} pad={22} style={{ width: 880, height: 280 }}>
                <Bars width={820} rowH={70} at={b(0.54)} items={[
                  { label: "原始", value: z.orig, text: fmtInt(z.orig), color: C.inkDim },
                  { label: "LOCF 后", value: z.single, text: fmtInt(z.single), color: C.amber },
                ]} unit="零收益不贡献方差，但会改变分布形状" />
              </Card>
            </Build>
          </div>
          <div style={{ position: "absolute", left: PAD + 920, top: 360, width: 856 }}>
            <Build at={b(0.57)}>
              <Card label="代价是两条" accent={C.coral} pad={22} style={{ width: 856, height: 280 }}>
                <Body color={C.ink} size={FT.h2} style={{ fontFamily: FONT.serif }}>一是零收益变多。</Body>
                <Body color={C.ink} size={FT.h2} style={{ fontFamily: FONT.serif, marginTop: 10 }}>二是长平台把下跌压成一次跳变。</Body>
                <K style={{ display: "block", marginTop: 18 }}>最大跳跃 12.7%（第 6 场给数）</K>
              </Card>
            </Build>
          </div>
        </div>

        {/* 4 · 遮挡实验 */}
        <div>
          <div style={{ position: "absolute", left: PAD, top: 268, width: 860 }}>
            <Body color={C.ink} size={FT.lead}>遮挡实验：在完整序列内部挖洞，遮 5% 或 20%。</Body>
            <div style={{ marginTop: 8 }}><K>只在内部挖，首尾各留一个观测；线性插值在首尾无定义</K></div>
          </div>
          <div style={{ position: "absolute", left: PAD, top: 380, width: 880 }}>
            <Build at={b(0.76)}>
              <Card label={"p = 5% · " + fmtInt(M.returns.p5.masked) + " / " + fmtInt(M.returns.n)} accent={C.cyan} pad={18} style={{ width: 880, height: 330 }}>
                <MaskGrid width={840} height={270} which="p5" at={b(0.78)} />
              </Card>
            </Build>
          </div>
          <div style={{ position: "absolute", left: PAD + 920, top: 380, width: 856 }}>
            <Build at={b(0.8)}>
              <Card label={"p = 20% · " + fmtInt(M.returns.p20.masked) + " / " + fmtInt(M.returns.n)} accent={C.amber} pad={18} style={{ width: 856, height: 330 }}>
                <MaskGrid width={820} height={270} which="p20" at={b(0.82)} />
              </Card>
            </Build>
          </div>
          <div style={{ position: "absolute", left: PAD, top: 740, width: 1776 }}>
            <Build at={b(0.88)}>
              <Card accent={C.violet} pad={18} style={{ width: 1776, height: 110 }}>
                <Body size={FT.body}>挖完洞，用三种方法填回去，再和真实值比较：价格 MAE、收益 MAE、方差。</Body>
                <K>方差最重要，因为它决定风险</K>
              </Card>
            </Build>
          </div>
        </div>
      </Pages>
    </Scene>
  );
};
