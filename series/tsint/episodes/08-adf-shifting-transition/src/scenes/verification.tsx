import React from "react";
import { Build } from "../../design/primitives";
import { C, FONT, FT } from "../../design/tokens";
import { Bars, Body, Card, Chip, K, LinePlot, M, Matrix, PAD, Pages, Scene, SceneHead, Stat, lf } from "../shared";

/* 数字：43 条检查、七条序列的 tau、六个漂移性数、三个转移性数的对照。 */

const ROW_W = 640;

const TauTrack: React.FC<{ label: string; tau: number; good: boolean; note?: string }> = ({ label, tau, good, note }) => {
  const x = Math.min(1, Math.abs(tau) / 6) * ROW_W;
  const crit = (2.86 / 6) * ROW_W;
  return (
    <div style={{ display: "flex", alignItems: "center", marginTop: 10 }}>
      <div style={{ width: 300, fontFamily: FONT.sans, fontSize: FT.meta, color: C.inkDim }}>{label}</div>
      <div style={{ width: ROW_W, height: 16, position: "relative", background: C.panelLine, borderRadius: 3 }}>
        <div style={{ position: "absolute", left: crit, top: -4, height: 24, width: 2, background: C.amber }} />
        <div style={{ position: "absolute", left: Math.max(0, x - 5), top: 2, width: 12, height: 12, borderRadius: 6, background: good ? C.cyan : C.coral }} />
      </div>
      <div style={{ width: 96, textAlign: "right", fontFamily: FONT.mono, fontSize: FT.meta, color: good ? C.cyan : C.coral }}>{tau.toFixed(2)}</div>
      {note ? <div style={{ width: 150, marginLeft: 14 }}><Body size={FT.micro}>{note}</Body></div> : null}
    </div>
  );
};

export const SVerification: React.FC = () => {
  const s = M.stats;
  const d = M.series;
  const med = d.shiftingMedians;
  return (
    <Scene id="verification">
      <SceneHead id="verification" />
      <Pages id="verification" at={[0, 0.13, 0.33, 0.5, 0.7, 0.9]}>
        <div>
          <div style={{ position: "absolute", left: PAD, top: 236, fontFamily: FONT.sans, fontSize: FT.h2, color: C.inkDim }}>
            先看总体：四十三条检查，零失败。
          </div>
          <Build at={lf("verification", 0.03)}>
            <div style={{ position: "absolute", left: PAD, top: 312, display: "flex", gap: 26 }}>
              <Stat label="检查" accent={C.cyan} value={String(s.checks.total)} sub={"手算 " + s.checks.manual + " · 数据 " + s.checks.data + " · 失败 " + s.checks.failed} style={{ width: 574, height: 200 }} />
              <Stat label="断言" accent={C.amber} value="55" sub="ADF 30 · 漂移性 11 · 转移性 14" style={{ width: 574, height: 200 }} />
              <Stat label="整套测试" accent={C.violet} value={String(s.tests.suite)} sub="加上前面几集，套件总数" style={{ width: 574, height: 200 }} />
            </div>
          </Build>
          <Build at={lf("verification", 0.07)}>
            <div style={{ position: "absolute", left: PAD, top: 556, width: 1776 }}>
              <Card accent={C.cyan} style={{ height: 150 }}>
                <div style={{ fontFamily: FONT.sans, fontSize: FT.h2, color: C.ink }}>每个数字都能回到一条检查；不是看起来对，是能复现。</div>
                <K style={{ display: "block", marginTop: 10 }}>{M.meta.command}</K>
              </Card>
            </div>
          </Build>
          <Build at={lf("verification", 0.1)}>
            <div style={{ position: "absolute", left: PAD, top: 748, fontFamily: FONT.sans, fontSize: FT.body, color: C.inkDim }}>
              先看 ADF 的七条序列。
            </div>
          </Build>
        </div>

        <div>
          <div style={{ position: "absolute", left: PAD, top: 236, fontFamily: FONT.sans, fontSize: FT.h2, color: C.inkDim }}>
            白噪声 τ 很负；随机游走 τ 接近零。这就是这张表该有的样子。
          </div>
          <Build at={lf("verification", 0.16)}>
            <div style={{ position: "absolute", left: PAD, top: 306, width: 1240 }}>
              <Card label="七条序列 · 橙线是 5% 临界值 −2.86" accent={C.cyan} style={{ height: 420 }}>
                <TauTrack label="白噪声" tau={s.adf.tau_white} good note="无单位根" />
                <TauTrack label="随机游走" tau={s.adf.tau_walk} good={false} note="有单位根" />
                <TauTrack label="茅台收盘价（水平）" tau={s.adf.tau_level} good={false} note="没跨线" />
                <TauTrack label="茅台收益率（差分）" tau={s.adf.tau_diff} good note="跨线" />
                <TauTrack label="带趋势的回归" tau={s.adf.tau_trend} good={false} note="没跨线" />
                <TauTrack label="滞后八阶" tau={s.adf.tau_lag8} good={false} note="没跨线" />
                <TauTrack label="随机游走的差分" tau={s.adf.tau_walk_diff} good note="跨线" />
              </Card>
            </div>
          </Build>
          <Build at={lf("verification", 0.24)}>
            <div style={{ position: "absolute", left: PAD + 1300, top: 306, width: 476 }}>
              <Stat label="白噪声" accent={C.cyan} value={s.adf.tau_white.toFixed(2)} sub="每一点都不记得上一点" valueColor={C.cyan} style={{ height: 156 }} />
              <Stat label="随机游走" accent={C.coral} value={s.adf.tau_walk.toFixed(2)} sub="记性最好；τ 接近零" valueColor={C.coral} style={{ height: 156, marginTop: 14 }} />
              <Body size={FT.meta} style={{ marginTop: 16 }}>记性越差，这个数越负。</Body>
            </div>
          </Build>
        </div>

        <div>
          <div style={{ position: "absolute", left: PAD, top: 236, fontFamily: FONT.sans, fontSize: FT.h2, color: C.inkDim }}>
            茅台：水平值没跨线，差分跨过去了；结论不随滞后阶改变。
          </div>
          <Build at={lf("verification", 0.37)}>
            <div style={{ position: "absolute", left: PAD, top: 306, width: 1120 }}>
              <LinePlot
                series={[
                  { values: d.level.close, color: C.coral, name: "收盘价水平（前复权）" },
                  { values: d.diff.dclose, color: C.cyan, name: "收益率（差分）" },
                ]}
                width={1120}
                height={300}
                title={"同一段 250 个点；水平值漂移，差分围着零转"}
                at={lf("verification", 0.38)}
                zeroLine
                yFmt={(v) => v.toFixed(0)}
              />
            </div>
          </Build>
          <Build at={lf("verification", 0.42)}>
            <div style={{ position: "absolute", left: PAD, top: 630, display: "flex", gap: 26 }}>
              <Stat label="水平值" accent={C.coral} value={s.adf.tau_level.toFixed(4)} sub="−1.70 没跨过 −2.86" valueColor={C.coral} style={{ width: 424, height: 150 }} />
              <Stat label="差分" accent={C.cyan} value={s.adf.tau_diff.toFixed(4)} sub="−4.06 跨过去了" valueColor={C.cyan} style={{ width: 424, height: 150 }} />
              <Stat label="带趋势" accent={C.coral} value={s.adf.tau_trend.toFixed(2)} sub="−1.61 仍在临界值右边" valueColor={C.coral} style={{ width: 424, height: 150 }} />
              <Stat label="滞后八阶" accent={C.coral} value={s.adf.tau_lag8.toFixed(2)} sub="−1.97 也没跨线" valueColor={C.coral} style={{ width: 424, height: 150 }} />
            </div>
          </Build>
          <Build at={lf("verification", 0.47)}>
            <div style={{ position: "absolute", left: PAD, top: 810, fontFamily: FONT.sans, fontSize: FT.body, color: C.inkDim }}>
              所以结论，不随滞后阶改变。价格不平稳，收益率平稳。
            </div>
          </Build>
        </div>

        <div>
          <div style={{ position: "absolute", left: PAD, top: 236, fontFamily: FONT.sans, fontSize: FT.h2, color: C.inkDim }}>
            再看第二个指标，漂移性：六个值，一种口径。
          </div>
          <Build at={lf("verification", 0.53)}>
            <div style={{ position: "absolute", left: PAD, top: 306, width: 1120 }}>
              <Card label="六个数 · 单位是「形状」不是「强度」" accent={C.amber} style={{ height: 380 }}>
                <Bars
                  width={1040}
                  max={1}
                  rowH={52}
                  at={lf("verification", 0.54)}
                  items={[
                    { label: "等差数列", value: s.shifting.arith_1_10, text: s.shifting.arith_1_10.toFixed(4), color: C.amber },
                    { label: "单边斜坡", value: s.shifting.ramp_250, text: s.shifting.ramp_250.toFixed(4), color: C.amber },
                    { label: "随机游走", value: s.shifting.random_walk, text: s.shifting.random_walk.toFixed(4), color: C.cyan },
                    { label: "茅台 2013", value: s.shifting.w2013, text: s.shifting.w2013.toFixed(4), color: C.cyan },
                    { label: "茅台 2017", value: s.shifting.w2017, text: s.shifting.w2017.toFixed(4), color: C.cyan },
                    { label: "最后 250 点", value: s.shifting.last250, text: s.shifting.last250.toFixed(4), color: C.cyan },
                  ]}
                />
              </Card>
            </div>
          </Build>
          <Build at={lf("verification", 0.62)}>
            <div style={{ position: "absolute", left: PAD + 1184, top: 306, width: 592 }}>
              <Card label="同一只股票，三个窗口" accent={C.coral} style={{ height: 380 }}>
                <div style={{ fontFamily: FONT.mono, fontSize: FT.num, color: C.ink }}>0.1642 → 0.6925</div>
                <Body style={{ marginTop: 12 }}>从零点一六到零点六九，差了四倍；窗口换一下，数就换。</Body>
                <div style={{ marginTop: 16 }}><Chip color={C.coral}>所以这个数，不能跨窗口直接比</Chip></div>
                <Body size={FT.meta} style={{ marginTop: 14 }}>零点五只说明形状对称；单边趋势与等差都是零点五。</Body>
              </Card>
            </div>
          </Build>
        </div>

        <div>
          <div style={{ position: "absolute", left: PAD, top: 236, fontFamily: FONT.sans, fontSize: FT.h2, color: C.inkDim }}>
            再看第三个指标，转移性：完美周期三分之二，常数序列九分之二。
          </div>
          <Build at={lf("verification", 0.73)}>
            <div style={{ position: "absolute", left: PAD, top: 306, width: 860 }}>
              <Card label="六个值" accent={C.violet} style={{ height: 400 }}>
                <div style={{ display: "flex", gap: 14 }}>
                  <Stat label="完美周期" accent={C.violet} value={s.transition.periodic.toFixed(4)} sub="2/3" valueColor={C.violet} style={{ width: 396, height: 156 }} />
                  <Stat label="常数序列" accent={C.coral} value={s.transition.constant.toFixed(4)} sub="2/9" valueColor={C.coral} style={{ width: 396, height: 156 }} />
                </div>
                <div style={{ display: "flex", gap: 14, marginTop: 14 }}>
                  <Stat label="单一符号" accent={C.coral} value={s.transition.single_symbol.toFixed(4)} sub="也是 2/9" valueColor={C.coral} style={{ width: 396, height: 156 }} />
                  <Stat label="白噪声" accent={C.cyan} value={s.transition.iid.toFixed(5)} sub="三态都在用" valueColor={C.cyan} style={{ width: 396, height: 156 }} />
                </div>
              </Card>
            </div>
          </Build>
          <Build at={lf("verification", 0.79)}>
            <div style={{ position: "absolute", left: PAD + 900, top: 306, width: 876 }}>
              <Card label="茅台符号 · 只有两个状态到过" accent={C.cyan} style={{ height: 400 }}>
                <Matrix rows={d.transition.sh600519_sign.counts} cell={58} showNumbers digits={0} color={C.cyan} rowLabels={["跌 →", "平 →", "涨 →"]} colLabels={["跌", "平", "涨"]} />
                <div style={{ display: "flex", gap: 16, marginTop: 14 }}>
                  <Body size={FT.meta}>中间那行全是零；茅台符号里没有零收益率，涨跌互现。</Body>
                  <div style={{ fontFamily: FONT.mono, fontSize: FT.meta, color: C.cyan }}>{s.transition.sign_600519.toFixed(4)}</div>
                </div>
              </Card>
            </div>
          </Build>
          <Build at={lf("verification", 0.84)}>
            <div style={{ position: "absolute", left: PAD, top: 736, display: "flex", gap: 26 }}>
              <Stat label="茅台符号" accent={C.cyan} value={s.transition.sign_600519.toFixed(4)} sub="两态；零行拉低三列方差" valueColor={C.cyan} style={{ width: 574, height: 150 }} />
              <Stat label="小市值票符号" accent={C.violet} value={s.transition.sign_002456.toFixed(5)} sub="三态都到过，分布更均匀" valueColor={C.violet} style={{ width: 574, height: 150 }} />
              <Stat label="相差" accent={C.coral} value="22 倍" sub="不是「更不稳定」，是状态更少" valueColor={C.coral} style={{ width: 574, height: 150 }} />
            </div>
          </Build>
        </div>

        <div>
          <div style={{ position: "absolute", left: PAD, top: 236, fontFamily: FONT.sans, fontSize: FT.h2, color: C.inkDim }}>
            每个数字都能回到一条检查；不是看起来对，是能复现。
          </div>
          <Build at={lf("verification", 0.93)}>
            <div style={{ position: "absolute", left: PAD, top: 312, display: "flex", gap: 26 }}>
              <Card label="ADF" accent={C.cyan} style={{ width: 574, height: 300 }}>
                <Body>七条序列的 tau 与临界值；常数序列的秩亏；Schwert 的 15 阶。</Body>
                <div style={{ marginTop: 14 }}><Chip color={C.cyan}>手算 + 数据，各有一条</Chip></div>
              </Card>
              <Card label="漂移性" accent={C.amber} style={{ width: 574, height: 300 }}>
                <Body>等差与斜坡的零点五；四个窗口的中位数链；m = 20 时不等于 m = 9。</Body>
                <div style={{ marginTop: 14 }}><Chip color={C.amber}>口径锁在测试里</Chip></div>
              </Card>
              <Card label="转移性" accent={C.violet} style={{ width: 574, height: 300 }}>
                <Body>周期的 2/3；常数的 2/9；单符号的 2/9；clamp 与零行。</Body>
                <div style={{ marginTop: 14 }}><Chip color={C.violet}>两个黄金值各一条</Chip></div>
              </Card>
            </div>
          </Build>
          <Build at={lf("verification", 0.97)}>
            <div style={{ position: "absolute", left: PAD, top: 660, width: 1776 }}>
              <Card accent={C.cyan} style={{ height: 150 }}>
                <div style={{ fontFamily: FONT.sans, fontSize: FT.h2, color: C.ink }}>四十三条检查，零失败；每个数都能复现，每个口径都有测试。</div>
                <K style={{ display: "block", marginTop: 10 }}>下一页说边界：五个不能说的话</K>
              </Card>
            </div>
          </Build>
        </div>
      </Pages>
    </Scene>
  );
};
