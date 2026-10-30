import React from "react";
import { Build } from "../../design/primitives";
import { C, FONT, FT } from "../../design/tokens";
import { Head, Scene, PAD, Card, Body, Mono, K, Num, M, beatAt } from "../shared";

/** 收束：七个边界、一个隐藏边界、一条断言。 */
export const SOutro: React.FC = () => {
  const b = (i: number) => beatAt("outro", i, 31);
  const m = M.meta;
  return (
    <Scene id="outro">
      <Head kicker="08 / 七个边界" title="七个边界，一把尺子" goal="公式能复用，结论不能外推" />

      <div style={{ position: "absolute", left: PAD, top: 292, width: 1776 }}>
        <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
          <B n="01" title="证据等级" c={C.coral} at={b(0)}>书里只有协议。检测器是本仓自建，正负对照都有，但只能标 B 级。</B>
          <B n="02" title="数据范围" c={C.amber} at={b(8)}>一只股票，两千六百天。不是全市场，行业也集中在少数板块。</B>
          <B n="03" title="价格口径" c={C.violet} at={b(12)}>前复权收盘价。分红送股已经调整；换口径，标签和特征都会变。</B>
          <B n="04" title="模型范围" c={C.cyan} at={b(17)}>只有查表、朴素、线性。结论只说协议，不说某类模型更强。</B>
          <B n="05" title="探针定义" c={C.coral} at={b(22)}>最近邻查表。换探针，一百七十倍会变；真泄漏的方向不变。</B>
          <B n="06" title="固定预测" c={C.violet} at={b(28)}>单次训练。负 gap 不代表泛化好，只说明训练没拟合。两条误差一起报。</B>
          <B n="07" title="面板" c={C.amber} at={b(34)}>二十只大盘股，行业和市值都偏大，不能推全市场。</B>
        </div>

        <Build at={b(38)} style={{ marginTop: 16 }}>
          <Card label="还有一条隐藏边界" accent={C.inkFaint} style={{ width: 1776, height: 92 }} pad={14}>
            <div style={{ display: "flex", gap: 26, alignItems: "baseline" }}>
              <span style={{ fontFamily: FONT.sans, fontSize: FT.body, color: C.ink }}>滚动轮数依赖初始长度。</span>
              <Mono size={FT.meta} color={C.coral}>n_init 换掉，70 轮就换掉</Mono>
              <span style={{ marginLeft: "auto", fontFamily: FONT.sans, fontSize: FT.meta, color: C.inkFaint }}>轮数不是数据的固有属性。</span>
            </div>
          </Card>
        </Build>

        <Build at={b(46)} style={{ marginTop: 14 }}>
          <Card accent={C.cyan} style={{ width: 1776, height: 132 }} pad={20}>
            <div style={{ display: "flex", alignItems: "center", gap: 40 }}>
              <div style={{ fontFamily: FONT.serif, fontSize: FT.lead, color: C.ink, lineHeight: 1.5 }}>
                机制可复现。数字可复算。<br />结论不外推。
              </div>
              <div style={{ width: 1, height: 84, background: C.panelLine }} />
              <div>
                <Body size={FT.body} color={C.inkDim}>切分不是调参。</Body>
                <div style={{ fontFamily: FONT.mono, fontSize: FT.meta, color: C.inkFaint, marginTop: 6 }}>比例和种子提前写死，之后才允许看测试集。</div>
              </div>
              <div style={{ marginLeft: "auto", textAlign: "right" }}>
                <K>本机快照</K>
                <div style={{ fontFamily: FONT.mono, fontSize: FT.micro, color: C.inkFaint, marginTop: 4 }}>
                  {m.rows} 点 · {m.tests} 条断言<br />{m.tsBaseCommit.slice(0, 7)}
                </div>
              </div>
            </div>
          </Card>
        </Build>
      </div>

      <Build at={b(50)} style={{ position: "absolute", left: PAD, top: 930, width: 1500 }}>
        <div style={{ fontFamily: FONT.serif, fontSize: FT.num, color: C.ink }}>写死之后，才允许看测试集。</div>
      </Build>
    </Scene>
  );
};

const B: React.FC<{ n: string; title: string; c: string; at: number; children: React.ReactNode }> = ({ n, title, c, at, children }) => (
  <Build at={at} style={{ width: 429 }}>
    <Card accent={c} style={{ width: 429, height: 170 }} pad={18}>
      <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
        <span style={{ fontFamily: FONT.mono, fontSize: FT.micro, color: C.inkFaint }}>{n}</span>
        <span style={{ fontFamily: FONT.sans, fontSize: FT.h2, color: C.ink }}>{title}</span>
      </div>
      <div style={{ fontFamily: FONT.sans, fontSize: FT.meta, color: C.inkFaint, lineHeight: 1.55, marginTop: 10 }}>{children}</div>
    </Card>
  </Build>
);
