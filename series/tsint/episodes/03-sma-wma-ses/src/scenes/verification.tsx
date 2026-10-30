import React from "react";
import { Build } from "../../design/primitives";
import { C, FONT, FT } from "../../design/tokens";
import { Body, Card, Chip, K, Mono, PAD, Pages, Scene, SceneHead, fmtE, fmtM, lf, M } from "../shared";

/** 一个小格子：黄金样例的逐点对照。 */
const Cell: React.FC<{ v: string; c: string; fill?: string }> = ({ v, c, fill }) => (
  <div style={{ width: 78, height: 64, borderRadius: 6, border: "1px solid " + c, background: fill ?? "transparent", display: "flex", alignItems: "center", justifyContent: "center" }}>
    <Mono size={FT.body} color={c}>{v}</Mono>
  </div>
);

/** 验证：从一条断言走到一整段行情。 */
export const SVerification: React.FC = () => {
  const id = "verification";
  const b = (k: number) => lf(id, k);
  const c = M.centroids;
  const dc = M.dailyCompare;
  const dr = M.drift;
  const ini = M.init;
  const fq = M.frequency;
  return (
    <Scene id={id}>
      <SceneHead id={id} />
      <Pages id={id} at={[0, 0.18, 0.4, 0.6, 0.78]}>
        {/* 1 · 黄金样例 */}
        <div>
          <div style={{ position: "absolute", left: PAD, top: 250, width: 1180 }}>
            <Build at={b(0.01)}>
              <Card label="SMA · N=3，输入 1..5" accent={C.amber} pad={22} style={{ width: 1180, height: 190 }}>
                <div style={{ display: "flex", gap: 10 }}>
                  {["1", "2", "3", "4", "5"].map((x) => <Cell key={x} v={x} c={C.inkDim} />)}
                </div>
                <div style={{ display: "flex", gap: 10, marginTop: 12, paddingLeft: 176 }}>
                  {["2", "3", "4"].map((x) => <Cell key={x} v={x} c={C.amber} fill={C.panel} />)}
                </div>
                <Body size={FT.meta} style={{ marginTop: 12 }}>窗口滑动，输出长度是 n 减 N 加一；右端对齐。</Body>
              </Card>
            </Build>
            <Build at={b(0.05)}>
              <Card label="SES · α=0.5，s0=2，输入 1..4" accent={C.cyan} pad={22} style={{ width: 1180, marginTop: 14 }}>
                <div style={{ display: "flex", gap: 10 }}>
                  {["1", "2", "3", "4"].map((x) => <Cell key={x} v={x} c={C.inkDim} />)}
                </div>
                <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
                  {["1.5", "1.75", "2.375", "3.1875"].map((x) => <Cell key={x} v={x} c={C.cyan} fill={C.panel} />)}
                </div>
                <Body size={FT.meta} style={{ marginTop: 12 }}>每一步是上一半、新一半；手算能对上，才敢相信代码。</Body>
              </Card>
            </Build>
          </div>
          <div style={{ position: "absolute", left: PAD + 1200, top: 250, width: 576 }}>
            <Build at={b(0.03)}>
              <Card label="这两个例子在测试里" accent={C.violet} pad={22} style={{ width: 576, height: 360 }}>
                <Body size={FT.body}>黄金样例不是数据，是手算：先知道答案，再看代码。</Body>
                <div style={{ marginTop: 16 }}><Chip color={C.amber}>SMA · 12 条断言</Chip></div>
                <div style={{ marginTop: 10 }}><Chip color={C.cyan}>SES · 16 条断言</Chip></div>
                <div style={{ marginTop: 16 }}><K>输出长度、右端对齐、边界，都从这里钉住</K></div>
              </Card>
            </Build>
          </div>
        </div>

        {/* 2 · 质心恒等 */}
        <div>
          <div style={{ position: "absolute", left: PAD, top: 276, width: 1776 }}>
            <Body color={C.ink} size={FT.lead}>把 N=20 和 α=2/21 摆在一起，两个质心必须相等。</Body>
          </div>
          <div style={{ position: "absolute", left: PAD, top: 356, width: 860 }}>
            <Build at={b(0.2)}>
              <Card label="解析值" accent={C.amber} pad={24} style={{ width: 860, height: 276 }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <div><Mono size={FT.display} color={C.amber}>{c.sma20.toFixed(2)}</Mono><Body size={FT.micro}>SMA20 · (N-1)/2</Body></div>
                  <div><Mono size={FT.display} color={C.cyan}>{c.ses_2_21.toFixed(2)}</Mono><Body size={FT.micro}>SES(2/21) · (1-α)/α</Body></div>
                </div>
                <Body size={FT.body} style={{ marginTop: 16 }}>差是 {fmtE(M.bridge.centroid_diff, 1)}；不是近似相等，是代数上相等。</Body>
              </Card>
            </Build>
          </div>
          <div style={{ position: "absolute", left: PAD + 900, top: 356, width: 876 }}>
            <Build at={b(0.23)}>
              <Card label="实测值" accent={C.cyan} pad={24} style={{ width: 876, height: 276 }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <div><Mono size={FT.display} color={C.cyan}>9.5</Mono><Body size={FT.micro}>阶跃响应积分 · SMA</Body></div>
                  <div><Mono size={FT.display} color={C.violet}>9.5</Mono><Body size={FT.micro}>阶跃响应积分 · SES</Body></div>
                </div>
                <Body size={FT.body} style={{ marginTop: 16 }}>实测与解析在浮点误差内一致；证据文件里两边都记。</Body>
              </Card>
            </Build>
          </div>
          <div style={{ position: "absolute", left: PAD, top: 660, width: 1776 }}>
            <Build at={b(0.27)}>
              <Card accent={C.coral} pad={20} style={{ width: 1776, height: 120 }}>
                <Body size={FT.body}>这就是“同一把尺子”：α=2/(N+1) 不是调参口诀，是质心相等的解。</Body>
              </Card>
            </Build>
          </div>
        </div>

        {/* 3 · 权重与质心 */}
        <div>
          <div style={{ position: "absolute", left: PAD, top: 268, width: 860 }}>
            <Build at={b(0.42)}>
              <Card label="三种权重，三个质心" accent={C.cyan} pad={22} style={{ width: 860, height: 330 }}>
                {[
                  ["等权 N=20", c.sma20, C.amber],
                  ["线性 WMA20", c.wma_linear20, C.cyan],
                  ["三角 WMA20", c.wma_tri20, C.violet],
                ].map(([lab, v, col]) => (
                  <div key={String(lab)} style={{ display: "flex", alignItems: "center", gap: 14, padding: "10px 0" }}>
                    <Mono size={FT.meta} color={C.inkDim} style={{ width: 160 }}>{lab as string}</Mono>
                    <div style={{ flex: 1, height: 16, background: C.bg, borderRadius: 3 }}>
                      <div style={{ height: 16, width: ((v as number) / 10) * 100 + "%", background: col as string, borderRadius: 3 }} />
                    </div>
                    <Mono size={FT.body} color={col as string}>{(v as number).toFixed(2)}</Mono>
                  </div>
                ))}
                <Body size={FT.meta} style={{ marginTop: 10 }}>线性权重偏心，质心 6.33；三角权重关于中点对称，还是 9.5。</Body>
              </Card>
            </Build>
          </div>
          <div style={{ position: "absolute", left: PAD + 900, top: 268, width: 876 }}>
            <Build at={b(0.45)}>
              <Card label="为什么" accent={C.amber} pad={22} style={{ width: 876, height: 330 }}>
                <Mono size={FT.body} color={C.ink}>G = Σ i · w_i / Σ w_i</Mono>
                <Body size={FT.body} style={{ marginTop: 14 }}>线性权重把质量压向最近的一端，所以重心前移；三角权重左右对称，重心回到正中。</Body>
                <K style={{ display: "block", marginTop: 14 }}>WMA 的“偏心”是一个可调参数，不是 bug</K>
              </Card>
            </Build>
          </div>
        </div>

        {/* 4 · 工程不变量 */}
        <div>
          <div style={{ position: "absolute", left: PAD, top: 268, width: 860 }}>
            <Build at={b(0.62)}>
              <Card label="增量滑动和的漂移" accent={C.violet} pad={24} style={{ width: 860, height: 340 }}>
                <Mono size={FT.display} color={C.violet}>{fmtE(dr.inc_vs_direct, 2)}</Mono>
                <Body size={FT.body} style={{ marginTop: 12 }}>十万个点的斜坡上，增量式与直接求和的差；重算周期把它压在这个量级。</Body>
                <Body size={FT.meta} style={{ marginTop: 8 }}>窗口 {dr.window} · 每 1024 步重算一次</Body>
              </Card>
            </Build>
          </div>
          <div style={{ position: "absolute", left: PAD + 900, top: 268, width: 876 }}>
            <Build at={b(0.65)}>
              <Card label="初值的影响会衰减" accent={C.cyan} pad={24} style={{ width: 876, height: 340 }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <div><Mono size={FT.h1} color={C.cyan}>{fmtM(ini.max_diff_first5, 3)}</Mono><Body size={FT.micro}>前 5 步的平均偏差</Body></div>
                  <div><Mono size={FT.h1} color={C.amber}>{fmtE(ini.max_diff_after100, 2)}</Mono><Body size={FT.micro}>100 步之后</Body></div>
                </div>
                <Body size={FT.body} style={{ marginTop: 14 }}>初值定在第一个观测和取前三点均值，差别会以 (1-α)^t 指数衰减。</Body>
              </Card>
            </Build>
          </div>
        </div>

        {/* 5 · 一整段行情 */}
        <div>
          <div style={{ position: "absolute", left: PAD, top: 262, width: 860 }}>
            <Build at={b(0.8)}>
              <Card label="日线对比 · SMA20 与 SES(2/21)" accent={C.amber} pad={22} style={{ width: 860, height: 300 }}>
                {[
                  ["相关系数", fmtM(dc.corr_sma20_ses21, 4), C.amber],
                  ["最大绝对差", fmtM(dc.max_abs_diff, 2) + " 元", C.coral],
                  ["平均绝对差", fmtM(dc.mean_abs_diff, 2) + " 元", C.cyan],
                  ["末值比", fmtM(dc.sma20_last, 1) + " / " + fmtM(dc.ses21_last, 1), C.violet],
                ].map(([k, v, col]) => (
                  <div key={String(k)} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid " + C.panelLine }}>
                    <Body size={FT.meta} color={C.inkDim}>{k as string}</Body>
                    <Mono size={FT.body} color={col as string}>{v as string}</Mono>
                  </div>
                ))}
              </Card>
            </Build>
          </div>
          <div style={{ position: "absolute", left: PAD + 900, top: 262, width: 876 }}>
            <Build at={b(0.83)}>
              <Card label="频率换算" accent={C.cyan} pad={22} style={{ width: 876, height: 146 }}>
                <Mono size={FT.h2} color={C.cyan}>{fq.daily_bar_minutes} 分钟 / {fq.intraday_bar_minutes} 分钟 = {fq.ratio}×</Mono>
                <Body size={FT.meta} style={{ marginTop: 8 }}>日线 20 根等于 {fq.daily_window_minutes} 分钟，五分钟线只能给 {fq.intraday_window_minutes} 分钟；窗口不是“点数”，是“时间”。</Body>
              </Card>
            </Build>
            <Build at={b(0.86)}>
              <Card label="证据" accent={C.violet} pad={22} style={{ width: 876, marginTop: 14 }}>
                <div style={{ display: "flex", alignItems: "baseline", gap: 28 }}>
                  <div><Mono size={FT.h1} color={C.violet}>41</Mono><Body size={FT.micro}>新增断言</Body></div>
                  <div><Mono size={FT.h1} color={C.cyan}>408</Mono><Body size={FT.micro}>总套件</Body></div>
                  <div><Mono size={FT.h1} color={C.amber}>730</Mono><Body size={FT.micro}>日线行</Body></div>
                </div>
                <Body size={FT.meta} style={{ marginTop: 8 }}>数据 sha256 {M.data.daily.sha256.slice(0, 12)}… · 证据随仓提交</Body>
              </Card>
            </Build>
          </div>
        </div>
      </Pages>
    </Scene>
  );
};
