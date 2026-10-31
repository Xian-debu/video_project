import React from "react";
import { Build } from "../../design/primitives";
import { C, FONT, FT } from "../../design/tokens";
import { Body, Card, K, M, PAD, Pages, Scene, SceneHead, lf } from "../shared";

/* 边界：单头不是 transformer、无因果、二次成本、−1e30 的代价、不是预测证据。 */

const items = [
  { label: "01 · 单头不是 Transformer", accent: C.coral, head: "一个块，不是整张图", text: "没有残差、没有层归一化、没有前馈层；图 2.18 的整机结构不在本集范围。" },
  { label: "02 · 默认没有因果性", accent: C.amber, head: "看见未来是默认行为", text: "不加掩码，第 t 个位置能看见后面所有位置；要因果，必须显式屏蔽并测上三角。" },
  { label: "03 · 成本是平方的", accent: C.violet, head: "T² 个分数", text: "十六个位置是二百五十六；一千个位置是一百万。这是与卷积最本质的取舍。" },
  { label: "04 · −1e30 不是 −∞", accent: C.cyan, head: "整行屏蔽会变零", text: "若一行内分数相差超过 1e30，这一行整行变零；接受它，因为比 NaN 好排查。" },
  { label: "05 · 不是预测的证据", accent: C.inkDim, head: "对齐 ≠ 预测", text: "复制任务是自监督对齐任务，答案在输入里；真实窗口的 dev 只衡量像不像单位阵。" },
];

export const SBoundary: React.FC = () => {
  const m = M;
  return (
    <Scene id="boundary">
      <SceneHead id="boundary" />
      <Pages id="boundary" at={[0, 0.3, 0.6]}>
        <div>
          <div style={{ position: "absolute", left: PAD, top: 236, fontFamily: FONT.sans, fontSize: FT.h2, color: C.inkDim }}>
            五条边界，先说前三条。
          </div>
          <Build at={lf("boundary", 0.03)}>
            <div style={{ position: "absolute", left: PAD, top: 312, display: "flex", gap: 26 }}>
              {items.slice(0, 2).map((it) => (
                <Card key={it.label} label={it.label} accent={it.accent} style={{ width: 874, height: 330 }}>
                  <div style={{ fontFamily: FONT.serif, fontSize: FT.h1, color: C.ink }}>{it.head}</div>
                  <Body style={{ marginTop: 14 }}>{it.text}</Body>
                </Card>
              ))}
            </div>
          </Build>
          <Build at={lf("boundary", 0.12)}>
            <div style={{ position: "absolute", left: PAD, top: 690, width: 1776 }}>
              <Card label={items[2].label} accent={items[2].accent} style={{ width: 1776, height: 210 }}>
                <div style={{ fontFamily: FONT.serif, fontSize: FT.h1, color: C.ink }}>{items[2].head}</div>
                <Body style={{ marginTop: 12 }}>{items[2].text}</Body>
              </Card>
            </div>
          </Build>
        </div>

        <div>
          <div style={{ position: "absolute", left: PAD, top: 236, fontFamily: FONT.sans, fontSize: FT.h2, color: C.inkDim }}>
            后两条：数值近似有代价，诊断量不能越界解释。
          </div>
          <Build at={lf("boundary", 0.33)}>
            <div style={{ position: "absolute", left: PAD, top: 312, display: "flex", gap: 26 }}>
              {items.slice(3).map((it) => (
                <Card key={it.label} label={it.label} accent={it.accent} style={{ width: 874, height: 300 }}>
                  <div style={{ fontFamily: FONT.serif, fontSize: FT.h1, color: C.ink }}>{it.head}</div>
                  <Body style={{ marginTop: 14 }}>{it.text}</Body>
                </Card>
              ))}
            </div>
          </Build>
          <Build at={lf("boundary", 0.4)}>
            <div style={{ position: "absolute", left: PAD, top: 656, width: 1776 }}>
              <Card accent={C.cyan} style={{ height: 170 }}>
                <div style={{ fontFamily: FONT.sans, fontSize: FT.h2, color: C.ink }}>所有结论都限定在「对齐」这件事上；换任务，数字全都要重测。</div>
                <K style={{ display: "block", marginTop: 10 }}>算法性质不变：行和为一、平移不变、溢出可防</K>
              </Card>
            </div>
          </Build>
        </div>

        <div>
          <div style={{ position: "absolute", left: PAD, top: 236, fontFamily: FONT.sans, fontSize: FT.h2, color: C.inkDim }}>
            一句话收边界：它只是一个块，不是一个模型。
          </div>
          <Build at={lf("boundary", 0.63)}>
            <div style={{ position: "absolute", left: PAD, top: 320, width: 1776 }}>
              <Card label="本集做了什么" accent={C.cyan} style={{ width: 1776, height: 250 }}>
                <div style={{ fontFamily: FONT.serif, fontSize: FT.h1, color: C.ink }}>
                  单头缩放点积注意力、因果掩码、正弦位置编码、复制任务训练、真实窗口诊断。
                </div>
                <Body style={{ marginTop: 12 }}>{m.attn.copyParams} 个参数、{m.meta.checks.total} 项检查、{m.meta.tests.attention} 条断言；每个数字都能用同一个命令重跑。</Body>
              </Card>
            </div>
          </Build>
          <Build at={lf("boundary", 0.72)}>
            <div style={{ position: "absolute", left: PAD, top: 620, width: 1776 }}>
              <Card label="本集没做什么" accent={C.inkFaint} style={{ width: 1776, height: 250 }}>
                <div style={{ fontFamily: FONT.serif, fontSize: FT.h1, color: C.ink }}>
                  多头、多层堆叠、残差与层归一化、位置编码学习、自回归生成、大规模序列。
                </div>
                <Body style={{ marginTop: 12 }}>这些都留到需要它们的时候再写，不在一集里塞满。</Body>
              </Card>
            </div>
          </Build>
        </div>
      </Pages>
    </Scene>
  );
};
