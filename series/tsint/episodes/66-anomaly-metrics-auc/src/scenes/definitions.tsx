import React from "react";
import { C, FONT, FT } from "../../design/tokens";
import { Build } from "../../design/primitives";
import { Math } from "../../design/Math";
import { Head, Scene, PAD, Card, Body, Mono, K, Num, M, beatAt } from "../shared";

/** 定义：四计数、三个阈值指标、两条曲线；公式与基线都写在屏幕上。 */
export const SDefinitions: React.FC = () => {
  const b = (i: number) => beatAt("definitions", i, 32);
  const w = 536;
  return (
    <Scene id="definitions">
      <Head kicker="02 / 三个指标" title="四个计数，三条曲线" goal="从混淆矩阵到 ROC 与 PR" />

      <div style={{ position: "absolute", left: PAD, top: 292, display: "flex", gap: 24 }}>
        <Build at={b(0)}>
          <Card label="阈值指标 · 式 8.7 / 8.8 / 8.9" accent={C.cyan} pad={20} style={{ width: w, height: 600 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
              <Math tex={String.raw`\mathrm{Precision}=\frac{\mathrm{TP}}{\mathrm{TP}+\mathrm{FP}}`} block size={21} color={C.cyan} align="left" />
              <Math tex={String.raw`\mathrm{Recall}=\frac{\mathrm{TP}}{\mathrm{TP}+\mathrm{FN}}`} block size={21} color={C.cyan} align="left" />
              <Math tex={String.raw`\mathrm{Accuracy}=\frac{\mathrm{TP}+\mathrm{TN}}{\mathrm{TP}+\mathrm{TN}+\mathrm{FP}+\mathrm{FN}}`} block size={20} color={C.cyan} align="left" />
            </div>
            <div style={{ marginTop: 10, borderTop: "1px solid " + C.panelLine, paddingTop: 12 }}>
              <Body size={FT.meta} color={C.inkDim}>{"TP 真阳 · FP 假阳 · FN 假阴 · TN 真阴。四个数先数清楚，再谈比例。"}</Body>
              <Body size={FT.meta} color={C.inkDim} style={{ marginTop: 8 }}>{"分母为零时精确率没有定义；返回 0 会把「没预测」伪装成「全错」。"}</Body>
            </div>
            <div style={{ marginTop: 14, background: C.bg, borderRadius: 8, padding: "10px 12px" }}>
              <K>{"本机 99:1 样本 · 全判正常"}</K>
              <div style={{ fontFamily: FONT.mono, fontSize: FT.meta, color: C.inkDim, marginTop: 6 }}>{"TP 0 · FP 0 · FN 1 · TN 99"}</div>
              <div style={{ fontFamily: FONT.mono, fontSize: FT.meta, color: C.amber, marginTop: 4 }}>{"Acc 0.99 · Recall 0 · F1 0"}</div>
            </div>
          </Card>
        </Build>

        <Build at={b(16)}>
          <Card label="综合与排序 · 式 8.10 · AUC" accent={C.violet} pad={20} style={{ width: w, height: 600 }}>
            <Math tex={String.raw`F_\beta=(1+\beta^2)\,\frac{P\cdot R}{\beta^2 P+R}`} block size={22} color={C.violet} align="left" />
            <Body size={FT.meta} color={C.inkDim} style={{ marginTop: 6 }}>{"β=1 是调和平均；β<1 偏精确率，β>1 偏召回率。"}</Body>
            <div style={{ height: 1, background: C.panelLine, margin: "14px 0" }} />
            <Math tex={String.raw`\mathrm{AUC}=\frac{\sum_{i\in +}\mathrm{rank}_i-\frac{n_+(n_++1)}{2}}{n_+\,n_-}`} block size={21} color={C.cyan} align="left" />
            <Body size={FT.meta} color={C.inkDim} style={{ marginTop: 6 }}>{"只用到正类的秩；并列分数取平均秩。"}</Body>
            <div style={{ marginTop: 14, background: C.bg, borderRadius: 8, padding: "10px 12px" }}>
              <K>{"ROC 的两个端点"}</K>
              <div style={{ fontFamily: FONT.mono, fontSize: FT.meta, color: C.inkDim, marginTop: 6 }}>{"(FPR, TPR) 从 (0,0) 走到 (1,1)"}</div>
              <div style={{ fontFamily: FONT.mono, fontSize: FT.meta, color: C.cyan, marginTop: 4 }}>{"对角线 = 随机 · AUC 0.5"}</div>
            </div>
          </Card>
        </Build>

        <Build at={b(23)}>
          <Card label="PR 曲线 · PR-AUC 与 AP" accent={C.amber} pad={20} style={{ width: w, height: 600 }}>
            <div style={{ fontFamily: FONT.sans, fontSize: FT.body, color: C.inkDim, lineHeight: 1.6 }}>
              横轴召回率，纵轴精确率。<br />
              曲线下的面积是 PR-AUC。
            </div>
            <Math tex={String.raw`\mathrm{AP}=\sum_n (R_n-R_{n-1})\,P_n`} block size={24} color={C.amber} align="left" />
            <Body size={FT.meta} color={C.inkDim}>{"按分数降序扫，每一步算一次 P 与 R；AP 是阶梯版面积。"}</Body>
            <div style={{ height: 1, background: C.panelLine, margin: "14px 0" }} />
            <div style={{ fontFamily: FONT.sans, fontSize: FT.body, color: C.inkDim, lineHeight: 1.6 }}>
              随机基线不是 0.5，<br />
              是正类比例。
            </div>
            <div style={{ marginTop: 8, display: "flex", alignItems: "baseline", gap: 8 }}>
              <Num value={M.pooled.prevalence} digits={4} size={36} color={C.coral} />
              <span style={{ fontFamily: FONT.sans, fontSize: FT.meta, color: C.inkFaint }}>本机正类比例</span>
            </div>
            <div style={{ marginTop: 12, background: C.bg, borderRadius: 8, padding: "10px 12px" }}>
              <K>{"AUC 与 AP 都在问排序"}</K>
              <div style={{ fontFamily: FONT.mono, fontSize: FT.meta, color: C.inkDim, marginTop: 6 }}>{"AUC：全局排序 · AP：前面抓得准不准"}</div>
            </div>
          </Card>
        </Build>
      </div>

      <Build at={b(29)} style={{ position: "absolute", left: PAD, top: 930, width: 1500 }}>
        <div style={{ fontFamily: FONT.serif, fontSize: 40, color: C.ink }}>定义只规定形状，样本才决定基线。</div>
      </Build>
    </Scene>
  );
};
