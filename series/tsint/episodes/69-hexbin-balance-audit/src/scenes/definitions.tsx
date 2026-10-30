import React from "react";
import { Build } from "../../design/primitives";
import { C, FONT, FT } from "../../design/tokens";
import { Head, Scene, PAD, Card, Body, Mono, K, M, beatAt, fmtF, fmtSci } from "../shared";

const Line: React.FC<{ children: React.ReactNode; color?: string }> = ({ children, color = C.ink }) => (
  <div style={{ fontFamily: FONT.mono, fontSize: FT.mono, color, lineHeight: 1.85 }}>{children}</div>
);
const Note: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div style={{ fontFamily: FONT.sans, fontSize: FT.meta, color: C.inkFaint, lineHeight: 1.65, marginTop: 12 }}>{children}</div>
);

/** 定义：窗口 → 两维 → 标准化/PCA → 六边形分箱。 */
export const SDefinitions: React.FC = () => {
  const b = (i: number) => beatAt("definitions", i, 34);
  const p = M.panel20;
  const ex = M.example;
  return (
    <Scene id="definitions">
      <Head kicker="03 / 定义" title="一个窗口，两个数，三行公式" goal="从三十二天到一个点" />

      <div style={{ position: "absolute", left: PAD, top: 272, width: 560 }}>
        <Build at={b(3)}>
          <Card label="1 · 窗口 → 两个数" accent={C.cyan} style={{ width: 560, height: 402 }} pad={22}>
            <Line>r_i = ln(C_i / C_(i-1))</Line>
            <Line color={C.cyan}>μ = (1/32) Σ r_i</Line>
            <Line color={C.cyan}>σ = sqrt((1/32) Σ (r_i − μ)²)</Line>
            <Line> </Line>
            <Line color={C.inkDim}>n = 32 个日收益</Line>
            <Line color={C.inkDim}>需 33 个收盘价</Line>
            <Line color={C.inkDim}>窗口逐日滑动 1 步</Line>
            <Note>σ 除以 32（总体标准差，ddof=0）：要的是这一段窗口的描述统计，不是对总体的无偏估计。</Note>
          </Card>
        </Build>
      </div>

      <div style={{ position: "absolute", left: 672, top: 272, width: 560 }}>
        <Build at={b(8)}>
          <Card label="2 · 标准化 + 2×2 PCA" accent={C.violet} style={{ width: 560, height: 402 }} pad={22}>
            <Line>z_x = (μ − m_x) / s_x</Line>
            <Line>z_y = (σ − m_y) / s_y</Line>
            <Line>Σ = [[1, b], [b, 1]]</Line>
            <Line color={C.violet}>b = {fmtF(p.lam1 - 1, 6)}</Line>
            <Line color={C.violet}>λ1 = 1 + |b| = {fmtF(p.lam1, 6)}</Line>
            <Line color={C.violet}>λ2 = 1 − |b| = {fmtF(p.lam2, 6)}</Line>
            <Line>θ = 45° · (cos, sin) = (0.7071, 0.7071)</Line>
            <Note>对角都是 1，特征向量与 b 无关，恒为 45°；反变换误差 {fmtSci(p.reconMaxErr)}（浮点极限）。</Note>
          </Card>
        </Build>
      </div>

      <div style={{ position: "absolute", left: 1272, top: 272, width: 528 }}>
        <Build at={b(13)}>
          <Card label="3 · 下一节：六边形分箱" accent={C.amber} style={{ width: 528, height: 402 }} pad={22}>
            <Line>row = round(y / (s·√3/2))</Line>
            <Line>col = round(x/s − 0.5·(row mod 2))</Line>
            <Line> </Line>
            <Line color={C.amber}>cx = s·(col + 0.5·(row mod 2))</Line>
            <Line color={C.amber}>cy = s·(√3/2)·row</Line>
            <Line> </Line>
            <Line color={C.inkDim}>s = max(rx/g, ry/(g·√3/2))</Line>
            <Line color={C.inkDim}>g = 30 → s = {fmtF(p.hexSize, 6)}</Line>
            <Note>公式先摆在这里；下一场用图解释怎么数格子。格心与分箱互为逆，二十三条断言里有一条专门验它。</Note>
          </Card>
        </Build>
      </div>

      <div style={{ position: "absolute", left: PAD, top: 700, width: 1060 }}>
        <Build at={b(24)}>
          <Card label={"样例窗口 · " + ex.code} accent={C.cyan} style={{ width: 1060, height: 250 }} pad={22}>
            <div style={{ display: "flex", gap: 56, alignItems: "baseline" }}>
              <div>
                <K>区间</K>
                <div><Mono size={FT.h2}>{ex.firstDate} → {ex.lastDate}</Mono></div>
              </div>
              <div>
                <K>μ · 平均日收益</K>
                <div><Mono size={FT.h2} color={C.cyan}>{ex.mu.toFixed(6)}</Mono></div>
              </div>
              <div>
                <K>σ · 日收益波动</K>
                <div><Mono size={FT.h2} color={C.cyan}>{ex.sd.toFixed(6)}</Mono></div>
              </div>
            </div>
            <Body size={FT.meta} style={{ marginTop: 18 }}>
              32 个日收益，压成一个点；它在图上的位置由 (μ, σ) 决定，格子由上面三行公式决定。
              五万多个窗口，每一个都能这样追到具体日期。
            </Body>
          </Card>
        </Build>
      </div>

      <div style={{ position: "absolute", left: 1160, top: 700, width: 640 }}>
        <Build at={b(28)}>
          <Card label="四条本仓口径" accent={C.inkFaint} style={{ width: 640, height: 250 }} pad={20}>
            <Body size={FT.meta} style={{ lineHeight: 1.8 }}>
              ① 收益用对数收益，窗口内不年化。<br />
              ② 波动 ddof=0；PCA 的 z-score ddof=1（样本相关）。<br />
              ③ 二维 PCA 全秩旋转，不是截断近似。<br />
              ④ 网格固定 30×30，敏感度另报 15–60。
            </Body>
          </Card>
        </Build>
      </div>
    </Scene>
  );
};
