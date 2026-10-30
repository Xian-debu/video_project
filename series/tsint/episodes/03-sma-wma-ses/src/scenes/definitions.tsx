import React from "react";
import { Build } from "../../design/primitives";
import { C, FONT, FT } from "../../design/tokens";
import { Body, Card, Chip, K, Mono, PAD, Pages, Scene, SceneHead, fmtF, lf, M } from "../shared";

/** 定义：书上的三条公式，加本仓补的两条换算。 */
export const SDefinitions: React.FC = () => {
  const id = "definitions";
  const b = (k: number) => lf(id, k);
  const al = M.bridge.alpha_for_20;
  return (
    <Scene id={id}>
      <SceneHead id={id} />
      <Pages id={id} at={[0, 0.3, 0.55, 0.8]}>
        {/* 1 · 两条窗口公式 */}
        <div>
          <div style={{ position: "absolute", left: PAD, top: 262 }}>
            <Build at={b(0.01)}>
              <Card label="式 2.13 · 简单移动平均" accent={C.amber} pad={24} style={{ width: 860, height: 250 }}>
                <Mono size={FT.h2} color={C.ink}>s_t = (1 / N) · Σ x_i  (i = t-N+1 .. t)</Mono>
                <Body size={FT.body} style={{ marginTop: 16 }}>窗口里 N 个点，每个点一样重；输出只有 N 个点的“份量”。</Body>
                <K>N 是窗口宽度，也是唯一的旋钮</K>
              </Card>
            </Build>
            <Build at={b(0.06)}>
              <Card label="式 2.14 · 加权移动平均" accent={C.cyan} pad={24} style={{ width: 860, marginTop: 16 }}>
                <Mono size={FT.h2} color={C.ink}>s_t = (Σ w_i x_i) / (Σ w_i)</Mono>
                <Body size={FT.body} style={{ marginTop: 16 }}>分母是权重和，不是 N。书里没规定 w 怎么取，这是它留白的地方。</Body>
              </Card>
            </Build>
          </div>
          <div style={{ position: "absolute", left: PAD + 900, top: 262, width: 876 }}>
            <Build at={b(0.03)}>
              <Card label="一条容易写错的式子" accent={C.coral} pad={24} style={{ width: 876, height: 234 }}>
                <Body color={C.ink} size={FT.h2} style={{ fontFamily: FONT.serif }}>除以 N，会悄悄改变尺度。</Body>
                <Body size={FT.body} style={{ marginTop: 12 }}>取权重 [0, 0, 1]：正确输出 3，错写成除以 N 得 0.5。这条在测试里。</Body>
                <K color={C.coral}>分母错了，读出来的幅度全是错的</K>
              </Card>
            </Build>
            <Build at={b(0.09)}>
              <Card accent={C.violet} pad={24} style={{ width: 876, marginTop: 16 }}>
                <Body size={FT.body}>权重必须非负；全零的时候没有定义，要报错，不能返回零。</Body>
                <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
                  <Chip color={C.violet}>EmptyWeights</Chip>
                  <Chip color={C.violet}>NegativeWeight</Chip>
                  <Chip color={C.violet}>ZeroWeights</Chip>
                </div>
              </Card>
            </Build>
          </div>
        </div>

        {/* 2 · SES 与 α */}
        <div>
          <div style={{ position: "absolute", left: PAD, top: 262 }}>
            <Build at={b(0.32)}>
              <Card label="式 2.15 · 一次指数平滑" accent={C.cyan} pad={24} style={{ width: 860, height: 246 }}>
                <Mono size={FT.h2} color={C.ink}>s_t = α · x_t + (1-α) · s_(t-1)</Mono>
                <Body size={FT.body} style={{ marginTop: 16 }}>没有窗口，只有记忆；α 越大，越相信今天。</Body>
                <K>α 在零到一之间，两端都是退化情形</K>
              </Card>
            </Build>
            <Build at={b(0.37)}>
              <Card label="式 2.16 · 初值" accent={C.amber} pad={24} style={{ width: 860, marginTop: 16 }}>
                <Mono size={FT.body} color={C.ink}>s_0 = (1 / n) · Σ x_i, 通常 n = 3</Mono>
                <Body size={FT.body} style={{ marginTop: 12 }}>初值不是随便给的；它的影响会以 (1-α)^t 衰减。</Body>
              </Card>
            </Build>
          </div>
          <div style={{ position: "absolute", left: PAD + 900, top: 262, width: 876 }}>
            {[
              { t: "α = 1", s: "输出就是输入，没有平滑", c: C.coral },
              { t: "α → 0", s: "一条水平线，等于永远用初值", c: C.inkDim },
              { t: "α = 0.5", s: "记忆半衰，重心在最近一个点", c: C.cyan },
            ].map((r, i) => (
              <Build key={r.t} at={b(0.34 + i * 0.03)}>
                <Card label={"边界 " + (i + 1)} accent={r.c} pad={20} style={{ width: 876, height: 118, marginTop: i ? 12 : 0 }}>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 18 }}>
                    <Mono size={FT.h2} color={r.c}>{r.t}</Mono>
                    <Body size={FT.body} color={C.inkDim}>{r.s}</Body>
                  </div>
                </Card>
              </Build>
            ))}
            <Build at={b(0.43)}>
              <Body size={FT.meta} style={{ marginTop: 14 }}>这两个极端在测试里各钉了一条断言。</Body>
            </Build>
          </div>
        </div>

        {/* 3 · 质心推导 */}
        <div>
          <div style={{ position: "absolute", left: PAD, top: 258 }}>
            <Build at={b(0.57)}>
              <Card label="阶跃响应的质心" accent={C.amber} pad={24} style={{ width: 860, height: 250 }}>
                <Mono size={FT.body} color={C.ink}>G = Σ t · (g_t - g_(t-1)) = Σ (1 - g_t)</Mono>
                <Body size={FT.body} style={{ marginTop: 14 }}>给一个从零到一的阶跃，输出爬到一之前缺的那块面积，就是平均滞后。SMA 与 SES 都能解析算出来。</Body>
              </Card>
            </Build>
            <Build at={b(0.62)}>
              <Card accent={C.cyan} pad={24} style={{ width: 860, marginTop: 16 }}>
                <div style={{ marginBottom: 12 }}>
                  <Mono size={FT.body} color={C.amber}>SMA：Σ (1 - (t+1)/N) = (N-1)/2</Mono>
                  <Body size={FT.meta} style={{ marginTop: 4 }}>N 个等权点，重心在正中间</Body>
                </div>
                <div>
                  <Mono size={FT.body} color={C.cyan}>SES：Σ (1-α)^(t+1) = (1-α)/α</Mono>
                  <Body size={FT.meta} style={{ marginTop: 4 }}>几何衰减，重心在尾巴上</Body>
                </div>
              </Card>
            </Build>
          </div>
          <div style={{ position: "absolute", left: PAD + 900, top: 258, width: 876 }}>
            <Build at={b(0.59)}>
              <Card label="为什么用面积" accent={C.violet} pad={24} style={{ width: 876, height: 466 }}>
                <Body color={C.ink} size={FT.h2} style={{ fontFamily: FONT.serif }}>质心是权重的“平均位置”。</Body>
                <Body size={FT.body} style={{ marginTop: 12 }}>把权重看成质量分布：SMA 是均匀的尺子，质心在正中；SES 是按几何级数递减的尾巴，质心靠近今天。</Body>
                <Body size={FT.body} style={{ marginTop: 12 }}>两个分布只要质心相同，对“缓慢漂移”的平均延迟就相同；差别在更高阶的矩——也就是响应形状。</Body>
                <K style={{ display: "block", marginTop: 14 }}>一阶矩对齐，比较才公平；二阶矩不同，形状仍然不同</K>
              </Card>
            </Build>
          </div>
          <div style={{ position: "absolute", left: PAD, top: 604, width: 1776 }}>
            <Build at={b(0.68)}>
              <Card accent={C.coral} pad={20} style={{ width: 1776, height: 130 }}>
                <Body size={FT.body}>第一条是书里的公式直接推出来的；第二条书中没有，是本仓补的。</Body>
                <K color={C.coral}>推导不算结论；两个质心相等，才是结论</K>
              </Card>
            </Build>
          </div>
        </div>

        {/* 4 · 换算 */}
        <div>
          <div style={{ position: "absolute", left: PAD, top: 272, width: 1776 }}>
            <Body color={C.ink} size={FT.lead}>让两个质心相等，就得到换算：α = 2 / (N + 1)。</Body>
          </div>
          <div style={{ position: "absolute", left: PAD, top: 356, width: 860 }}>
            <Build at={b(0.82)}>
              <Card label="推导" accent={C.violet} pad={24} style={{ width: 860, height: 250 }}>
                <div style={{ marginBottom: 10 }}><Mono size={FT.body} color={C.ink}>(N - 1) / 2 = (1 - α) / α</Mono></div>
                <div style={{ marginBottom: 10 }}><Mono size={FT.body} color={C.ink}>α (N - 1) = 2 (1 - α)</Mono></div>
                <div><Mono size={FT.body} color={C.ink}>α = 2 / (N + 1)</Mono></div>
                <K style={{ display: "block", marginTop: 14 }}>反过来：N = 2 / α - 1</K>
              </Card>
            </Build>
          </div>
          <div style={{ position: "absolute", left: PAD + 900, top: 356, width: 876 }}>
            <Build at={b(0.85)}>
              <Card label="N = 20 的情形" accent={C.amber} pad={24} style={{ width: 876, height: 250 }}>
                <div style={{ display: "flex", alignItems: "baseline", gap: 24 }}>
                  <Mono size={FT.display} color={C.amber}>{fmtF(al, 6)}</Mono>
                  <Body size={FT.body} color={C.inkDim}>α = 2 / 21</Body>
                </div>
                <Body size={FT.body} style={{ marginTop: 14 }}>这个 α 配 N=20，质心都在 9.5；换个 α 再比，就不是同一把尺子。</Body>
                <div style={{ marginTop: 10 }}><Chip color={C.amber}>这是本仓推导 · 书中未给</Chip></div>
              </Card>
            </Build>
          </div>
        </div>
      </Pages>
    </Scene>
  );
};
