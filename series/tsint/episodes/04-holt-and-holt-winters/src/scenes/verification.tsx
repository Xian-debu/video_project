import React from "react";
import { Build } from "../../design/primitives";
import { C, FONT, FT } from "../../design/tokens";
import { Body, Card, Chip, K, Mono, PAD, Pages, Scene, SceneHead, SeasonPlot, fmtE, fmtInt, fmtM, lf, M } from "../shared";

const Cell: React.FC<{ v: string; c: string; w?: number }> = ({ v, c, w = 96 }) => (
  <div style={{ width: w, height: 58, borderRadius: 6, border: "1px solid " + c, display: "flex", alignItems: "center", justifyContent: "center" }}>
    <Mono size={FT.body} color={c}>{v}</Mono>
  </div>
);

/** 验证：手算、日线、季节、零值、日内。 */
export const SVerification: React.FC = () => {
  const id = "verification";
  const b = (k: number) => lf(id, k);
  const man = M.holt.manual;
  const dl = M.holt.daily;
  const a5 = M.hw.add5;
  const a252 = M.hw.add252;
  const mul = M.hw.mul5;
  const z = M.hw.zero;
  const ip = M.hw.intraday;
  return (
    <Scene id={id}>
      <SceneHead id={id} />
      <Pages id={id} at={[0, 0.2, 0.4, 0.6, 0.8]}>
        {/* 1 · 手算 */}
        <div>
          <div style={{ position: "absolute", left: PAD, top: 244, width: 1150 }}>
            <Build at={b(0.01)}>
              <Card label="Holt · α=β=0.5，s0=10，b0=1，输入 10 / 12 / 14" accent={C.amber} pad={22} style={{ width: 1150, height: 360 }}>
                <div style={{ display: "flex", gap: 10 }}>
                  {man.x.map((x: number) => <Cell key={"x" + x} v={String(x)} c={C.inkDim} />)}
                </div>
                <div style={{ marginTop: 14 }}><K>水平 s</K></div>
                <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
                  {man.level.map((x: number) => <Cell key={"s" + x} v={String(x)} c={C.amber} w={170} />)}
                </div>
                <div style={{ marginTop: 14 }}><K>趋势 b</K></div>
                <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
                  {man.trend.map((x: number) => <Cell key={"b" + x} v={String(x)} c={C.cyan} w={170} />)}
                </div>
              </Card>
            </Build>
          </div>
          <div style={{ position: "absolute", left: PAD + 1190, top: 244, width: 586 }}>
            <Build at={b(0.05)}>
              <Card label="下一步预测" accent={C.violet} pad={22} style={{ width: 586, height: 360 }}>
                <Mono size={FT.display - 10} color={C.violet}>{man.forecast[0]}</Mono>
                <Body size={FT.body} style={{ marginTop: 12 }}>十点五，十一点六二五，十三点二八一二五；趋势从零点七五走到一点二九六八七五。</Body>
                <div style={{ marginTop: 14 }}><Chip color={C.amber}>Holt · 14 条断言</Chip></div>
                <div style={{ marginTop: 10 }}><Chip color={C.cyan}>HW · 19 条断言</Chip></div>
              </Card>
            </Build>
          </div>
          <div style={{ position: "absolute", left: PAD, top: 640, width: 1776 }}>
            <Body size={FT.meta}>黄金样例的加法与乘法各手算四步，每一个状态都能对上；这里只放了 Holt 的三步。</Body>
          </div>
        </div>

        {/* 2 · 日线 */}
        <div>
          <div style={{ position: "absolute", left: PAD, top: 250, width: 1776 }}>
            <Body color={C.ink} size={FT.lead}>七百三十个交易日上，趋势让一步误差变差。</Body>
          </div>
          <div style={{ position: "absolute", left: PAD, top: 336, width: 860 }}>
            <Build at={b(0.22)}>
              <Card label="Holt · α=0.2 β=0.1" accent={C.amber} pad={24} style={{ width: 860, height: 250 }}>
                <Mono size={FT.num} color={C.amber}>{fmtInt(dl.sse)}</Mono>
                <Body size={FT.body} style={{ marginTop: 14 }}>一步误差平方和；末态水平 {fmtM(dl.lastLevel, 2)}，趋势 {fmtM(dl.lastTrend, 2)}。</Body>
              </Card>
            </Build>
          </div>
          <div style={{ position: "absolute", left: PAD + 900, top: 336, width: 876 }}>
            <Build at={b(0.26)}>
              <Card label="同 α 的一次平滑" accent={C.cyan} pad={24} style={{ width: 876, height: 250 }}>
                <Mono size={FT.num} color={C.cyan}>{fmtInt(dl.sseSes)}</Mono>
                <Body size={FT.body} style={{ marginTop: 14 }}>没有趋势项，反而略好；差的不是拟合，是外推。</Body>
              </Card>
            </Build>
          </div>
          <div style={{ position: "absolute", left: PAD, top: 626, width: 1776 }}>
            <Build at={b(0.27)}>
              <Card accent={C.coral} pad={22} style={{ width: 1776, height: 140 }}>
                <Body color={C.ink} size={FT.h2} style={{ fontFamily: FONT.serif }}>趋势让一步误差变差 {(dl.improve * 100).toFixed(2)}%。这个结论不漂亮，但它是数据说的。</Body>
                <K>没有为了好看去换参数；换参数会让前面的手算对不上</K>
              </Card>
            </Build>
          </div>
        </div>

        {/* 3 · 季节 */}
        <div>
          <div style={{ position: "absolute", left: PAD, top: 250, width: 1100 }}>
            <Body color={C.ink} size={FT.lead}>季节长度决定拟合：L=5 贴近周内，L=252 是一年的交易日。</Body>
          </div>
          <div style={{ position: "absolute", left: PAD, top: 336, width: 1100 }}>
            <Build at={b(0.42)}>
              <Card label="一步误差平方和" accent={C.cyan} pad={22} style={{ width: 1100, height: 330 }}>
                {[
                  ["HW 加法 L=5", a5.sse, C.cyan, a5.amp.toFixed(2) + " 元振幅"],
                  ["HW 乘法 L=5", mul.sse, C.coral, "同周期，略差"],
                  ["HW 加法 L=252", a252.sse, C.violet, a252.amp.toFixed(2) + " 元振幅"],
                ].map(([lab, v, c, note]) => (
                  <div key={String(lab)} style={{ padding: "12px 0", borderBottom: "1px solid " + C.panelLine }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                      <Mono size={FT.meta} color={c as string}>{lab as string}</Mono>
                      <div style={{ display: "flex", gap: 18, alignItems: "baseline" }}>
                        <K>{note as string}</K>
                        <Mono size={FT.body} color={c as string}>{fmtInt(v as number)}</Mono>
                      </div>
                    </div>
                    <div style={{ height: 10, background: C.bg, borderRadius: 3, marginTop: 8 }}>
                      <div style={{ height: 10, width: ((v as number) / a252.sse) * 100 + "%", background: c as string, borderRadius: 3, opacity: 0.9 }} />
                    </div>
                  </div>
                ))}
              </Card>
            </Build>
          </div>
          <div style={{ position: "absolute", left: PAD + 1140, top: 336, width: 636 }}>
            <Build at={b(0.47)}>
              <Card label="五个偏移（元）" accent={C.amber} pad={22} style={{ width: 636, height: 330 }}>
                {a5.season.map((v: number, i: number) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0" }}>
                    <K>{["周一", "周二", "周三", "周四", "周五"][i]}</K>
                    <Mono size={FT.meta} color={v >= 0 ? C.cyan : C.coral}>{v >= 0 ? "+" : ""}{fmtM(v, 3)}</Mono>
                  </div>
                ))}
                <Body size={FT.meta} style={{ marginTop: 12 }}>周三最低、周五最高；乘法在这段数据上略差。</Body>
              </Card>
            </Build>
          </div>
        </div>

        {/* 4 · 零值 */}
        <div>
          <div style={{ position: "absolute", left: PAD, top: 250, width: 1776 }}>
            <Body color={C.ink} size={FT.lead}>零值：加法能跑但结果没有意义，乘法直接拒绝。</Body>
          </div>
          <div style={{ position: "absolute", left: PAD, top: 336, width: 860 }}>
            <Build at={b(0.62)}>
              <Card label="停牌记零的成交量" accent={C.amber} pad={24} style={{ width: 860, height: 300 }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <div><Mono size={FT.num} color={C.amber}>{fmtInt(M.data.volume.rows)}</Mono><Body size={FT.micro}>总行数</Body></div>
                  <div><Mono size={FT.num} color={C.coral}>{fmtInt(M.data.volume.zero_rows)}</Mono><Body size={FT.micro}>零</Body></div>
                  <div><Mono size={FT.num} color={C.violet}>{fmtInt(M.data.volume.max_zero_run)}</Mono><Body size={FT.micro}>最长连续零</Body></div>
                </div>
                <Body size={FT.body} style={{ marginTop: 18 }}>加法模型的误差 {fmtE(z.additiveSse, 3)}：水平被零拉飞，数字大得没有意义。</Body>
              </Card>
            </Build>
          </div>
          <div style={{ position: "absolute", left: PAD + 900, top: 336, width: 876 }}>
            <Build at={b(0.66)}>
              <Card label="乘法的回答" accent={C.coral} pad={24} style={{ width: 876, height: 300 }}>
                <div style={{ fontFamily: FONT.mono, fontSize: FT.num, color: C.coral }}>{z.error.code}</div>
                <Body size={FT.body} style={{ marginTop: 14 }}>下标 {z.error.index}，值 {z.error.value}；不是 NaN，是一个可以处理的错误。</Body>
                <div style={{ marginTop: 14 }}><Chip color={C.coral}>入口拒绝，而不是递推爆炸</Chip></div>
              </Card>
            </Build>
          </div>
          <div style={{ position: "absolute", left: PAD, top: 688, width: 1776 }}>
            <Build at={b(0.64)}>
              <Card accent={C.cyan} pad={18} style={{ width: 1776, height: 112 }}>
                <Body size={FT.body}>这就是保护分支的价值：坏数据在入口被拦住，后面的所有数字仍然可解释。</Body>
                <K>证据文件里两条都记：加法 7.337e+16，乘法 HWNonPositive</K>
              </Card>
            </Build>
          </div>
        </div>

        {/* 5 · 日内 */}
        <div>
          <div style={{ position: "absolute", left: PAD, top: 244, width: 1776 }}>
            <Body color={C.ink} size={FT.lead}>日内：只保留每天恰好 48 根，按当日均值归一成份额。</Body>
          </div>
          <div style={{ position: "absolute", left: PAD, top: 320 }}>
            <Build at={b(0.82)}>
              <SeasonPlot mode="intraday" width={1120} height={400} at={b(0.81)} />
            </Build>
          </div>
          <div style={{ position: "absolute", left: PAD + 1150, top: 320, width: 626 }}>
            <Build at={b(0.85)}>
              <Card label="六十八天 · 三千二百六十四根" accent={C.cyan} pad={20} style={{ width: 626, height: 400 }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <div><Mono size={FT.num} color={C.cyan}>{ip.corr.toFixed(5)}</Mono><Body size={FT.micro}>拟合 vs 实测相关</Body></div>
                  <div><Mono size={FT.num} color={C.amber}>{ip.amp.toFixed(2)}</Mono><Body size={FT.micro}>振幅</Body></div>
                </div>
                <Body size={FT.body} style={{ marginTop: 16 }}>开盘第一根 {ip.empirical[0].toFixed(3)}，11:30 {ip.empirical[23].toFixed(3)}，收盘 {ip.empirical[47].toFixed(3)}。</Body>
                <Body size={FT.meta} style={{ marginTop: 10 }}>参数 α={ip.alpha}，β={ip.beta}，γ={ip.gamma}，L={ip.L}；β=0 是选择，因为份额没有长期趋势。</Body>
                <div style={{ marginTop: 12 }}><Chip color={C.cyan}>SSE {ip.sse.toFixed(2)}</Chip></div>
              </Card>
            </Build>
          </div>
          <div style={{ position: "absolute", left: PAD, top: 744, width: 1776 }}>
            <Body size={FT.meta}>二十四条证据检查全部通过：四条手算，六条模型，十四条数据；每个屏幕数字都能回到一条检查。</Body>
          </div>
        </div>
      </Pages>
    </Scene>
  );
};
