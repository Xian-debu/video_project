import React from "react";
import { Build } from "../../design/primitives";
import { C, FONT, FT } from "../../design/tokens";
import { Body, Card, Chip, K, LinePlot, M, PAD, Pages, Scene, SceneHead, Stat, fmtP, lf } from "../shared";

/* 开场：三种换坐标的方式、一段真实数据、三个问题、两笔账。 */

const Method: React.FC<{ sym: string; name: string; note: string; color: string; width: number }> = ({ sym, name, note, color, width }) => (
  <Card label={name} accent={color} style={{ width, height: 250 }}>
    <div style={{ fontFamily: FONT.serif, fontSize: 58, color, lineHeight: 1.05 }}>{sym}</div>
    <Body size={FT.meta} style={{ marginTop: 12 }}>{note}</Body>
  </Card>
);

const log10 = (v: number) => Math.log10(Math.max(1e-12, v));

export const SOpen: React.FC = () => {
  const s = M.stats.fft;
  const d = M.series;
  const spec = d.spectrum.magnitude;
  const specLog = spec.slice(1, 128).map(log10);
  const p5 = (() => {
    const e = (a: number, b: number) => { let t = 0; for (let i = a; i <= b; i++) t += spec[i] * spec[i]; return t; };
    return e(1, 255);
  })();
  const bin5 = (() => { let t = 0; for (let i = 102; i <= 103; i++) t += spec[i] * spec[i]; return t; })();
  return (
    <Scene id="open">
      <SceneHead id="open" />
      <Pages id="open" at={[0, 0.11, 0.26, 0.37, 0.47, 0.58, 0.75, 0.94]}>
        <div>
          <div style={{ position: "absolute", left: PAD, top: 236, fontFamily: FONT.sans, fontSize: FT.h2, color: C.inkDim }}>
            同一条序列，换一组基，换个样子看。
          </div>
          <Build at={lf("open", 0.03)}>
            <div style={{ position: "absolute", left: PAD, top: 318, display: "flex", gap: 26 }}>
              <Method sym="FFT" name="频谱" note="把整段序列写成一组正弦的叠加，看每个频率占多少能量。" color={C.cyan} width={574} />
              <Method sym="Σθv" name="基展开" note="先选一组基本形状，再把序列投影上去，系数就是坐标。" color={C.amber} width={574} />
              <Method sym="P×N" name="Patch" note="不再要求整段平稳；切成小段，每一段自己一个表示。" color={C.violet} width={574} />
            </div>
          </Build>
          <Build at={lf("open", 0.07)}>
            <div style={{ position: "absolute", left: PAD, top: 632, width: 1776, background: C.panel, border: "1px solid " + C.panelLine, borderLeft: "3px solid " + C.cyan, borderRadius: 12, padding: "20px 26px" }}>
              <div style={{ fontFamily: FONT.sans, fontSize: FT.h2, color: C.ink }}>三种办法，都在回答同一个问题：这串数还能怎么写。</div>
              <K style={{ display: "block", marginTop: 8 }}>第 2 章 · 书页 p.25–30 · 换一套坐标系</K>
            </div>
          </Build>
        </div>

        <div>
          <div style={{ position: "absolute", left: PAD, top: 236, fontFamily: FONT.sans, fontSize: FT.h2, color: C.inkDim }}>
            共同点是一句话；不同点在代价。
          </div>
          <Build at={lf("open", 0.13)}>
            <div style={{ position: "absolute", left: PAD, top: 318, width: 860 }}>
              <Card label="三种办法的共同点" accent={C.cyan} style={{ height: 380 }}>
                <div style={{ fontFamily: FONT.serif, fontSize: 64, color: C.ink, lineHeight: 1.2 }}>{"x = Σ θᵢ vᵢ"}</div>
                <Body style={{ marginTop: 18 }}>每个 x 都是基向量 v 的组合，θ 是这组坐标下的系数。</Body>
                <Body size={FT.meta} style={{ marginTop: 8 }}>换坐标系 = 换一组 v，θ 跟着变，x 不变。</Body>
              </Card>
            </div>
          </Build>
          <Build at={lf("open", 0.17)}>
            <div style={{ position: "absolute", left: PAD + 900, top: 318, width: 876 }}>
              <Card label="三种办法的不同点" accent={C.amber} style={{ height: 380 }}>
                {[
                  ["FFT", "基固定：正弦；系数是一次变换", C.cyan],
                  ["基展开", "基可选：多项式、傅里叶、任意形状", C.amber],
                  ["Patch", "基是片段：每段各自拟合，再拼回", C.violet],
                ].map(([n, t, c]: any) => (
                  <div key={n} style={{ display: "flex", gap: 18, alignItems: "baseline", marginTop: 14 }}>
                    <div style={{ width: 110 }}><Chip color={c}>{n}</Chip></div>
                    <Body size={FT.body} color={C.inkDim}>{t}</Body>
                  </div>
                ))}
                <Body size={FT.meta} style={{ marginTop: 16 }}>共同点决定能不能换；不同点决定换完付出什么。</Body>
              </Card>
            </div>
          </Build>
          <Build at={lf("open", 0.22)}>
            <div style={{ position: "absolute", left: PAD, top: 748, fontFamily: FONT.sans, fontSize: FT.body, color: C.inkDim }}>
              三种写法没有哪个更对，只有哪个更适合手里这段数据。
            </div>
          </Build>
        </div>

        <div>
          <div style={{ position: "absolute", left: PAD, top: 236, fontFamily: FONT.sans, fontSize: FT.h2, color: C.inkDim }}>
            先看一段真实数据：茅台日线，七百三十个交易日。
          </div>
          <Build at={lf("open", 0.28)}>
            <div style={{ position: "absolute", left: PAD, top: 300 }}>
              <LinePlot series={[{ values: d.daily.close, color: C.amber, name: "前复权收盘价" }]} width={1120} height={430} title={"2019-01-02 → 2021-12-31 · " + d.daily.close.length + " 行"} yFmt={(v) => v.toFixed(0)} at={lf("open", 0.3)} />
            </div>
          </Build>
          <Build at={lf("open", 0.32)}>
            <div style={{ position: "absolute", left: PAD + 1184, top: 300, width: 592 }}>
              <Stat label="FFT 窗口" accent={C.cyan} value={String(s.window)} sub="取最后 512 个点做一次变换" style={{ height: 160 }} />
              <Stat label="最大谱线（bin）" accent={C.cyan} value={String(s.top_bin)} sub={"|X| = " + s.top_mag.toFixed(0) + " · 它吃掉了大部分能量"} style={{ height: 160, marginTop: 16 }} />
            </div>
          </Build>
          <Build at={lf("open", 0.34)}>
            <div style={{ position: "absolute", left: PAD, top: 780, fontFamily: FONT.sans, fontSize: FT.body, color: C.inkDim }}>
              五百一十二个点，就是两年的日线；第一个 bin 对应周期长于窗口的慢波动。
            </div>
          </Build>
        </div>

        <div>
          <div style={{ position: "absolute", left: PAD, top: 236, fontFamily: FONT.sans, fontSize: FT.h2, color: C.inkDim }}>
            慢波动占九成七；一周的周期，安静得几乎看不见。
          </div>
          <Build at={lf("open", 0.39)}>
            <div style={{ position: "absolute", left: PAD, top: 300 }}>
              <LinePlot series={[{ values: specLog, color: C.cyan, name: "log10 |X_k|" }]} width={1120} height={430} title="频谱（k = 1..127，纵轴 log10）" yFmt={(v) => v.toFixed(0)} at={lf("open", 0.41)} />
            </div>
          </Build>
          <Build at={lf("open", 0.42)}>
            <div style={{ position: "absolute", left: PAD + 1184, top: 300, width: 592 }}>
              <Stat label="低频占比" accent={C.cyan} value={fmtP(s.low_freq_share, 1)} sub="bin 1..25；对应周期 20 天以上" valueColor={C.cyan} style={{ height: 160 }} />
              <Stat label="周期五附近" accent={C.amber} value={fmtP(s.period5_share, 2)} sub="0.15–0.25 周期/日；约 4–7 天" valueColor={C.amber} style={{ height: 160, marginTop: 16 }} />
            </div>
          </Build>
          <Build at={lf("open", 0.44)}>
            <div style={{ position: "absolute", left: PAD, top: 780, fontFamily: FONT.sans, fontSize: FT.body, color: C.inkDim }}>
              周内周期落在 102、103 号 bin，能量只占万分之{(bin5 / p5 * 1e4).toFixed(1)}。
            </div>
          </Build>
        </div>

        <div>
          <div style={{ position: "absolute", left: PAD, top: 236, fontFamily: FONT.sans, fontSize: FT.h2, color: C.inkDim }}>
            换一条时间轴：五分钟线，五天，二百四十根。
          </div>
          <Build at={lf("open", 0.49)}>
            <div style={{ position: "absolute", left: PAD, top: 300 }}>
              <LinePlot series={[{ values: d.minute.close, color: C.violet, name: "五分钟收盘价" }]} width={1120} height={430} title="2026-08-10 → 2026-08-14 · 240 根" yFmt={(v) => v.toFixed(0)} at={lf("open", 0.5)} />
            </div>
          </Build>
          <Build at={lf("open", 0.51)}>
            <div style={{ position: "absolute", left: PAD + 1184, top: 300, width: 592 }}>
              <Stat label="Patch 参数" accent={C.violet} value="48 / 8 / 4" sub="每天 48 根 · 段长 8 · 步长 4" style={{ height: 160 }} />
              <Stat label="切出块数" accent={C.violet} value={String(M.stats.patch.count_48_8_4)} sub={"填充后长度 " + M.stats.patch.padded_len + "，覆盖 " + M.stats.patch.covered + " 个点"} style={{ height: 160, marginTop: 16 }} />
            </div>
          </Build>
          <Build at={lf("open", 0.54)}>
            <div style={{ position: "absolute", left: PAD, top: 780, fontFamily: FONT.sans, fontSize: FT.body, color: C.inkDim }}>
              日线看不出一天里的节律；五分钟线可以。采样频率本身就是视角。
            </div>
          </Build>
        </div>

        <div>
          <div style={{ position: "absolute", left: PAD, top: 236, fontFamily: FONT.sans, fontSize: FT.h2, color: C.inkDim }}>
            三种办法，对应三个问题。
          </div>
          <Build at={lf("open", 0.6)}>
            <div style={{ position: "absolute", left: PAD, top: 318, display: "flex", gap: 26 }}>
              <Card label="FFT" accent={C.cyan} style={{ width: 574, height: 300 }}>
                <div style={{ fontFamily: FONT.sans, fontSize: FT.h1, color: C.ink, lineHeight: 1.25 }}>整段序列，频率成分是什么</div>
                <Body style={{ marginTop: 14 }}>把序列写成一组正弦的叠加，看每个频率占多少能量。</Body>
              </Card>
              <Card label="基展开" accent={C.amber} style={{ width: 574, height: 300 }}>
                <div style={{ fontFamily: FONT.sans, fontSize: FT.h1, color: C.ink, lineHeight: 1.25 }}>已知基本形状，系数是多少</div>
                <Body style={{ marginTop: 14 }}>FFT 是特例；换基就是换一组「基本形状」。</Body>
              </Card>
              <Card label="Patch" accent={C.violet} style={{ width: 574, height: 300 }}>
                <div style={{ fontFamily: FONT.sans, fontSize: FT.h1, color: C.ink, lineHeight: 1.25 }}>序列不稳，能不能分段看</div>
                <Body style={{ marginTop: 14 }}>不再要求整段平稳；每一段自己一个表示。</Body>
              </Card>
            </div>
          </Build>
          <Build at={lf("open", 0.67)}>
            <div style={{ position: "absolute", left: PAD, top: 668, width: 1776 }}>
              <Card accent={C.cyan} style={{ height: 150 }}>
                <div style={{ fontFamily: FONT.sans, fontSize: FT.h2, color: C.ink }}>这一集就按这三个问题走：先讲缺口，再讲直觉，然后是签名、实现、数字，最后讲边界。</div>
                <K style={{ display: "block", marginTop: 10 }}>三条线 · 每个数字对应一条检查 · 证据固定在 52 份数据与 55 条检查上</K>
              </Card>
            </div>
          </Build>
          <Build at={lf("open", 0.71)}>
            <div style={{ position: "absolute", left: PAD, top: 858, fontFamily: FONT.sans, fontSize: FT.meta, color: C.inkFaint }}>
              下一集换回时间轴；这一集先看看换空间之后，什么变简单了，什么变贵了。
            </div>
          </Build>
        </div>

        <div>
          <div style={{ position: "absolute", left: PAD, top: 236, fontFamily: FONT.sans, fontSize: FT.h2, color: C.inkDim }}>
            第一笔账：五百一十二个点，直接算要二十六万次乘法。
          </div>
          <Build at={lf("open", 0.77)}>
            <div style={{ position: "absolute", left: PAD, top: 318, display: "flex", gap: 26 }}>
              <Stat label="朴素 DFT" accent={C.coral} value="262,144" sub="N² = 512 × 512 次复数乘法" valueColor={C.coral} style={{ width: 574, height: 220 }} />
              <Stat label="radix-2 FFT" accent={C.cyan} value="2,304" sub="(N/2)·log₂N = 256 × 9" valueColor={C.cyan} style={{ width: 574, height: 220 }} />
              <Stat label="加速比" accent={C.cyan} value="113.8×" sub="这是换坐标的第一个红利" valueColor={C.cyan} style={{ width: 574, height: 220 }} />
            </div>
          </Build>
          <Build at={lf("open", 0.82)}>
            <div style={{ position: "absolute", left: PAD, top: 576, width: 1776 }}>
              <Card accent={C.amber} style={{ height: 128 }}>
                <div style={{ fontFamily: FONT.sans, fontSize: FT.h2, color: C.ink }}>但红利不是白拿的：radix-2 要求长度是二的幂。七百三十天补到一千零二十四，多出四成。</div>
                <K style={{ display: "block", marginTop: 8 }}>补零不等于提高分辨率；分辨率的由观测时长决定。</K>
              </Card>
            </div>
          </Build>
          <Build at={lf("open", 0.87)}>
            <div style={{ position: "absolute", left: PAD, top: 736, fontFamily: FONT.sans, fontSize: FT.body, color: C.inkDim }}>
              第二笔账：基展开要解一个线性系统；Patch 的代价在参数怎么选。
            </div>
          </Build>
          <Build at={lf("open", 0.9)}>
            <div style={{ position: "absolute", left: PAD, top: 800, width: 1776, background: C.panel, border: "1px solid " + C.panelLine, borderLeft: "3px solid " + C.cyan, borderRadius: 12, padding: "18px 26px" }}>
              <Body size={FT.body} color={C.ink}>这一集的所有数字，都能在证据里查到；三条证据文件，五十五条检查。</Body>
            </div>
          </Build>
        </div>

        <div>
          <div style={{ position: "absolute", left: PAD, top: 236, fontFamily: FONT.sans, fontSize: FT.h2, color: C.inkDim }}>
            五十五条检查，五十二份输入。
          </div>
          <Build at={lf("open", 0.955)}>
            <div style={{ position: "absolute", left: PAD, top: 318, display: "flex", gap: 26 }}>
              <Stat label="手算" accent={C.cyan} value="15" sub="Parseval、冲激、DC、整 bin 单音" style={{ width: 574, height: 220 }} />
              <Stat label="真实数据" accent={C.amber} value="7" sub="日线、五分钟线、派生 CSV" style={{ width: 574, height: 220 }} />
              <Stat label="合成" accent={C.violet} value="33" sub="三音混音、泄漏、基展开、Patch" style={{ width: 574, height: 220 }} />
            </div>
          </Build>
          <Build at={lf("open", 0.97)}>
            <div style={{ position: "absolute", left: PAD, top: 586, fontFamily: FONT.sans, fontSize: FT.body, color: C.inkDim }}>
              先从书页上的三个缺口开始。
            </div>
          </Build>
        </div>
      </Pages>
    </Scene>
  );
};
