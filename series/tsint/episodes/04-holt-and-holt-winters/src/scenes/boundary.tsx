import React from "react";
import { Build } from "../../design/primitives";
import { C, FONT, FT } from "../../design/tokens";
import { Body, Card, Chip, K, Mono, PAD, Pages, Scene, SceneHead, lf } from "../shared";

/** 边界：五条不能说的话，以及零与外推。 */
export const SBoundary: React.FC = () => {
  const id = "boundary";
  const b = (k: number) => lf(id, k);
  const items = [
    { n: "01", t: "α=2/(N+1) 只匹配质心", s: "上一集讲过：不匹配方差，也不匹配尾部", c: C.coral },
    { n: "02", t: "趋势一定让预测更好", s: "不一定；一步误差上它刚才就输了", c: C.amber },
    { n: "03", t: "乘法模型更「高级」", s: "它只是另一种误差度量；有零就不能直接用", c: C.cyan },
    { n: "04", t: "季节振幅是常数", s: "加法这么假设，乘法不这么假设；真实数据都不完全对", c: C.violet },
    { n: "05", t: "L 可以随便取", s: "L 是周期；取错了，季节项就是噪声", c: C.coral },
  ];
  return (
    <Scene id={id}>
      <SceneHead id={id} />
      <Pages id={id} at={[0, 0.5]}>
        {/* 1 · 五条 */}
        <div>
          {items.map((x, i) => {
            const col = i % 2;
            const row = Math.floor(i / 2);
            const wide = i === 4;
            return (
              <div key={x.n} style={{ position: "absolute", left: PAD + (wide ? 0 : col * 908), top: 250 + row * 176, width: wide ? 1776 : 868 }}>
                <Build at={b(0.02 + i * 0.03)}>
                  <Card accent={x.c} pad={20} style={{ width: wide ? 1776 : 868, height: wide ? 150 : 156 }}>
                    <div style={{ display: "flex", alignItems: "baseline", gap: 18 }}>
                      <Mono size={FT.h2} color={x.c}>{x.n}</Mono>
                      <Body color={C.ink} size={FT.h2} style={{ fontFamily: FONT.serif }}>{x.t}</Body>
                    </div>
                    <Body size={FT.meta} style={{ marginTop: 8 }}>{x.s}</Body>
                  </Card>
                </Build>
              </div>
            );
          })}
          <div style={{ position: "absolute", left: PAD, top: 790, width: 1776 }}>
            <Body size={FT.meta}>前四条是方法本身的边界：等价只在质心这一维成立，季节振幅与 L 都不是免费的。</Body>
          </div>
        </div>

        {/* 2 · 零与外推 */}
        <div>
          <div style={{ position: "absolute", left: PAD, top: 250, width: 860 }}>
            <Build at={b(0.52)}>
              <Card label="零不是缺失，是信息" accent={C.amber} pad={24} style={{ width: 860, height: 360 }}>
                <Body size={FT.body} color={C.ink}>停牌就是停牌，没有成交就是没有成交。填掉它，你会失去一条事实；直接喂给乘法，模型会当场坏掉。</Body>
                <Body size={FT.body} style={{ marginTop: 14 }}>两种错方向相反：一种是假装数据完整，一种是假装模型能吃。</Body>
                <div style={{ marginTop: 14 }}><Chip color={C.amber}>先判断语义，再决定模型</Chip></div>
              </Card>
            </Build>
          </div>
          <div style={{ position: "absolute", left: PAD + 900, top: 250, width: 876 }}>
            <Build at={b(0.56)}>
              <Card label="外推不是预测" accent={C.coral} pad={24} style={{ width: 876, height: 360 }}>
                <Body size={FT.body} color={C.ink}>斜线延出去，只是把最后一个斜率延续；它不知道转折，也不该假装知道。</Body>
                <Body size={FT.body} style={{ marginTop: 14 }}>所以输出要带不确定区间；区间不是装饰，是模型的一部分。</Body>
                <div style={{ marginTop: 14 }}><Mono size={FT.meta} color={C.coral}>ŷ_h = s + h · b ± z · σ · sqrt(h)</Mono></div>
              </Card>
            </Build>
          </div>
          <div style={{ position: "absolute", left: PAD, top: 664, width: 1776 }}>
            <Build at={b(0.6)}>
              <Card accent={C.cyan} pad={22} style={{ width: 1776, height: 150 }}>
                <Body color={C.ink} size={FT.h2} style={{ fontFamily: FONT.serif }}>这些边界不是缺陷，是方法本身的选择。</Body>
                <Body size={FT.body} style={{ marginTop: 10 }}>你可以接受交换，但不能假装交换不存在。</Body>
              </Card>
            </Build>
          </div>
        </div>
      </Pages>
    </Scene>
  );
};
