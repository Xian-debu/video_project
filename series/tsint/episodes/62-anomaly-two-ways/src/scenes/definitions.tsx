import React from "react";
import { AbsoluteFill } from "remotion";
import { C, FONT, FT } from "../../design/tokens";
import { Body, Card, Foot, Formula, KV, M, PAD, Pages, Scene, SceneHead, pagesOf } from "../shared";
import { AeDiagram, CausalWindow } from "../figs";

const Cell: React.FC<{ label: string; note: string; color: string }> = ({ label, note, color }) => (
  <div style={{ width: 300, height: 148, border: "1px solid " + (color === C.inkFaint ? C.panelLine : color), borderRadius: 10, padding: "16px 18px", boxSizing: "border-box", background: color === C.inkFaint ? C.bgSoft : "rgba(94,234,212,0.05)" }}>
    <div style={{ fontFamily: FONT.mono, fontSize: FT.micro, color }}>{label}</div>
    <div style={{ fontFamily: FONT.mono, fontSize: 34, color: color === C.inkFaint ? C.inkDim : color, marginTop: 12 }}>{note}</div>
  </div>
);

export const DefinitionsScene: React.FC = () => (
  <Scene id="definitions">
    <SceneHead id="definitions" />
    <Pages id="definitions" at={pagesOf("definitions")}>
      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 292, width: 620 }}>
          <Body size={FT.h1} color={C.ink} style={{ lineHeight: 1.2 }}>先把残差<br />写下来。</Body>
          <Body style={{ marginTop: 26 }}>
            残差是实际值减预测值的绝对值。阈值不手调，而是取标定段残差的 0.99 分位：九成九的正常点都在它下面，
            所以报警率天然只有百分之一左右。
          </Body>
        </div>
        <div style={{ position: "absolute", left: 790, top: 292, width: 1030 }}>
          <Card label="阈值为什么是分位数" accent={C.cyan} style={{ width: 1010 }} pad={26}>
            <Formula size={40} note="九成九的正常点都在阈值下面">P(r ≤ τ) = 0.99</Formula>
            <div style={{ height: 14 }} />
            <Formula size={40} color={C.cyan} note="标定段 487 个窗口上直接取分位">τ = {M.pred.threshold.toFixed(6)}</Formula>
            <div style={{ height: 14 }} />
            <Formula size={40} color={C.amber} note="标定段实测报警率">0.8214% ≈ 1%</Formula>
          </Card>
          <div style={{ marginTop: 18, fontFamily: FONT.mono, fontSize: FT.meta, color: C.inkFaint, lineHeight: 1.7, width: 980 }}>
            分位数是「排序后取第几个」，不是拟合出来的参数。所以标定段一变，阈值就跟着变。
          </div>
        </div>
        <Foot>阈值是分位数，不是拍出来的数。</Foot>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 292, width: 620 }}>
          <Body size={FT.h1} color={C.ink} style={{ lineHeight: 1.2 }}>三十二个点，<br />只看过去。</Body>
          <Body style={{ marginTop: 26 }}>
            每个样本都是过去 32 天的切片，右端对齐要判定的那一天。不看未来，所以线上能实时算；窗口重叠，一天一个样本，
            728 个测试点就是 728 个样本。
          </Body>
          <div style={{ display: "flex", marginTop: 28 }}>
            <KV k="窗口" v="32 点" color={C.cyan} />
            <KV k="方向" v="因果" color={C.inkDim} />
            <KV k="步长" v="1 天" color={C.inkDim} />
          </div>
        </div>
        <div style={{ position: "absolute", left: 790, top: 292, width: 1030 }}>
          <Card label="因果窗口 · 右端对齐当前点" accent={C.cyan} style={{ width: 1010 }} pad={22}>
            <CausalWindow width={950} height={220} />
          </Card>
          <div style={{ marginTop: 18, fontFamily: FONT.mono, fontSize: FT.meta, color: C.inkFaint, lineHeight: 1.7, width: 980 }}>
            窗口重叠是刻意的：每个点都要有一个「过去 32 天」的视角。代价是相邻样本高度相关，F1 的置信区间会宽一些。
          </div>
        </div>
        <Foot>因果窗口：右端对齐当前点，一步一天。</Foot>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 292, width: 620 }}>
          <Body size={FT.h1} color={C.ink} style={{ lineHeight: 1.2 }}>压成八个数，<br />再还原。</Body>
          <Body style={{ marginTop: 26 }}>
            输入 32 维，隐层 8 维，输出 32 维，tanh 隐层、线性输出，损失是逐维均方误差。参数只有 552 个——小到能在证据
            程序里 200 轮训完，也小到可以逐行手写梯度。
          </Body>
          <div style={{ display: "flex", marginTop: 28 }}>
            <KV k="参数" v={M.recon.params} color={C.violet} />
            <KV k="隐层" v={M.recon.hidden} color={C.amber} />
            <KV k="训练" v={M.recon.epochs + " 轮"} color={C.inkDim} />
          </div>
        </div>
        <div style={{ position: "absolute", left: 790, top: 292, width: 1030 }}>
          <Card label="32 → 8 → 32 · 552 个参数" accent={C.violet} style={{ width: 1010 }} pad={20}>
            <AeDiagram width={940} height={280} />
          </Card>
        </div>
        <Foot>552 个参数：三十二维进，三十二维出。</Foot>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 292, width: 620 }}>
          <Body size={FT.h1} color={C.ink} style={{ lineHeight: 1.2 }}>评价用<br />F1。</Body>
          <Body style={{ marginTop: 26 }}>
            真正异常、被判异常是 TP；正常被判异常是 FP；异常被判正常是 FN。精确率是 TP/(TP+FP)，召回率是 TP/(TP+FN)，
            F1 是二者的调和平均——它同时惩罚漏报和误报。
          </Body>
        </div>
        <div style={{ position: "absolute", left: 790, top: 292, width: 1030 }}>
          <div style={{ display: "flex", gap: 12 }}>
            <Cell label="TP · 真阳性" note="异常 → 报警" color={C.cyan} />
            <Cell label="FP · 假阳性" note="正常 → 报警" color={C.coral} />
            <Cell label="FN · 假阴性" note="异常 → 放过" color={C.amber} />
            <Cell label="TN · 真阴性" note="正常 → 放过" color={C.inkFaint} />
          </div>
          <div style={{ marginTop: 22, fontFamily: FONT.serif, fontSize: 38, color: C.ink, lineHeight: 1.5 }}>
            P = TP / (TP + FP)&nbsp;&nbsp; R = TP / (TP + FN)&nbsp;&nbsp; F1 = 2PR / (P + R)
          </div>
          <div style={{ marginTop: 12, fontFamily: FONT.mono, fontSize: FT.micro, color: C.inkFaint }}>
            分母为零时约定返回 0 · 两种异常各算一次 F1
          </div>
        </div>
        <Foot>先摊成四格，才谈得上比较。</Foot>
      </AbsoluteFill>
    </Pages>
  </Scene>
);
