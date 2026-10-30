import React from "react";
import { Build } from "../../design/primitives";
import { C, FONT, FT } from "../../design/tokens";
import { Body, Card, Chip, K, LinePlot, M, PAD, Pages, Scene, SceneHead, Stat, fmtE, fmtF, lf } from "../shared";

/* 直觉：整段变频率、整段变系数、整段变很多小段。 */

export const SIntuition: React.FC = () => {
  const s = M.stats.fft;
  const b = M.stats.basis;
  const p = M.stats.patch;
  const syn = M.series.synthetic;
  const bas = M.series.basis;
  const pat = M.series.patches;
  const rec = M.series.patchRecon;
  const all = pat.rows.flat();
  const lo = Math.min(...all);
  const hi = Math.max(...all);
  return (
    <Scene id="intuition">
      <SceneHead id="intuition" />
      <Pages id="intuition" at={[0, 0.21, 0.4, 0.69, 0.86]}>
        <div>
          <div style={{ position: "absolute", left: PAD, top: 236, fontFamily: FONT.sans, fontSize: FT.h2, color: C.inkDim }}>
            一条序列，看成一组正弦波的叠加；每个频率配一个振幅和相位。
          </div>
          <Build at={lf("intuition", 0.03)}>
            <div style={{ position: "absolute", left: PAD, top: 310 }}>
              <LinePlot series={[{ values: syn.x, color: C.amber, name: "x(t)：呼吸 + 心跳 + 噪声" }]} width={1120} height={420} title="采样 1000 Hz · 分析用 4096 点 · 图中前 1000 点 · 图 2.12 的合成信号" yFmt={(v) => v.toFixed(2)} at={lf("intuition", 0.05)} />
            </div>
          </Build>
          <Build at={lf("intuition", 0.07)}>
            <div style={{ position: "absolute", left: PAD + 1184, top: 310, width: 592 }}>
              <Stat label="呼吸" accent={C.cyan} value="0.3 Hz" sub="低频，主周期约 3.3 秒" style={{ height: 128 }} />
              <Stat label="心跳" accent={C.amber} value="1.17 Hz" sub="次低频，主周期约 0.85 秒" style={{ height: 128, marginTop: 14 }} />
              <Stat label="噪声" accent={C.coral} value="10 Hz" sub="高频，谱上在右边很远" style={{ height: 128, marginTop: 14 }} />
            </div>
          </Build>
          <Build at={lf("intuition", 0.12)}>
            <div style={{ position: "absolute", left: PAD, top: 790, fontFamily: FONT.sans, fontSize: FT.body, color: C.inkDim }}>
              三个峰各自落在该在的位置；频谱就是这组复数的模。
            </div>
          </Build>
        </div>

        <div>
          <div style={{ position: "absolute", left: PAD, top: 236, fontFamily: FONT.sans, fontSize: FT.h2, color: C.inkDim }}>
            把九到十一赫兹滤掉：剩下的 RMS，被滤掉的 RMS，都和手算对得上。
          </div>
          <Build at={lf("intuition", 0.23)}>
            <div style={{ position: "absolute", left: PAD, top: 300 }}>
              <LinePlot
                series={[
                  { values: syn.x, color: C.inkFaint, name: "原始 x", dash: true },
                  { values: syn.bandStop, color: C.cyan, name: "带阻后" },
                ]}
                width={1120} height={440} title="原始与带阻之后（分析 4096 点，图中前 1000 点）" yFmt={(v) => v.toFixed(2)} at={lf("intuition", 0.25)}
              />
            </div>
          </Build>
          <Build at={lf("intuition", 0.27)}>
            <div style={{ position: "absolute", left: PAD + 1184, top: 300, width: 592 }}>
              <Stat label="剩下的 RMS" accent={C.cyan} value="0.7906" sub="手算 sqrt(1.25/2)" valueColor={C.cyan} style={{ height: 168 }} />
              <Stat label="被滤掉的 RMS" accent={C.coral} value="0.1790" sub="手算 0.1768；差 1.3%" valueColor={C.coral} style={{ height: 168, marginTop: 16 }} />
            </div>
          </Build>
          <Build at={lf("intuition", 0.31)}>
            <div style={{ position: "absolute", left: PAD, top: 800, fontFamily: FONT.sans, fontSize: FT.body, color: C.inkDim }}>
              差的那一点是泄漏：十赫兹不在整 bin 上，能量摊到了邻格。
            </div>
          </Build>
        </div>

        <div>
          <div style={{ position: "absolute", left: PAD, top: 236, fontFamily: FONT.sans, fontSize: FT.h2, color: C.inkDim }}>
            基展开：线性序列，二百五十个点；拟合出来的截距落在中点上。
          </div>
          <Build at={lf("intuition", 0.42)}>
            <div style={{ position: "absolute", left: PAD, top: 300 }}>
              <LinePlot
                series={[
                  { values: bas.close, color: C.amber, name: "线性序列 x(t)" },
                  { values: bas.fitted, color: C.cyan, name: "三次基拟合", dash: true },
                ]}
                width={1120} height={440} title="x = 5 + 0.1 t · 250 个点" yFmt={(v) => v.toFixed(0)} at={lf("intuition", 0.44)}
              />
            </div>
          </Build>
          <Build at={lf("intuition", 0.47)}>
            <div style={{ position: "absolute", left: PAD + 1184, top: 300, width: 592 }}>
              <Stat label="系数 θ₁ / θ₂" accent={C.cyan} value={b.theta_lin.map((v) => v.toFixed(1)).join(" / ")} sub="在 v = 2u − 1 坐标下" valueColor={C.cyan} style={{ height: 150 }} />
              <Stat label="残差最大值" accent={C.amber} value={fmtE(b.lin_resid_max, 1)} sub="机器精度；不是「拟合得好」" style={{ height: 150, marginTop: 16 }} />
            </div>
          </Build>
          <Build at={lf("intuition", 0.53)}>
            <div style={{ position: "absolute", left: PAD, top: 800, fontFamily: FONT.sans, fontSize: FT.body, color: C.inkDim }}>
              v 从负一到一，中点就是 v 等于零；所以截距不是五，是十七点五。
            </div>
          </Build>
        </div>

        <div>
          <div style={{ position: "absolute", left: PAD, top: 236, fontFamily: FONT.sans, fontSize: FT.h2, color: C.inkDim }}>
            Patch：每段八个数，步长四；四十八个点，一共切出十二段。
          </div>
          <Build at={lf("intuition", 0.71)}>
            <div style={{ position: "absolute", left: PAD, top: 310 }}>
              <Card label="12 段 × 8 点（颜色越亮值越高）" accent={C.violet} style={{ padding: 20 }}>
                <div>
                  {pat.rows.map((row: number[], r: number) => (
                    <div key={r} style={{ display: "flex", gap: 6, marginTop: r === 0 ? 0 : 6 }}>
                      {row.map((v, c) => {
                        const t = (v - lo) / (hi - lo || 1);
                        return (
                          <div key={c} style={{ width: 84, height: 34, borderRadius: 6, background: "rgba(167,139,250," + (0.08 + 0.72 * t).toFixed(3) + ")", border: "1px solid " + C.panelLine, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT.mono, fontSize: FT.micro, color: C.ink }}>
                            {v.toFixed(0)}
                          </div>
                        );
                      })}
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </Build>
          <Build at={lf("intuition", 0.75)}>
            <div style={{ position: "absolute", left: PAD + 1290, top: 310, width: 486 }}>
              <Stat label="段数" accent={C.violet} value={String(p.patches)} sub="N = ⌊(48 − 8)/4⌋ + 2" style={{ height: 140 }} />
              <Stat label="填充后长度" accent={C.violet} value={String(p.padded_len)} sub="末尾补 4 个重复值" style={{ height: 140, marginTop: 14 }} />
              <Stat label="覆盖原序列" accent={C.cyan} value={String(p.covered) + " 点"} sub="最后一段与倒数第二段有重叠" style={{ height: 140, marginTop: 14 }} />
            </div>
          </Build>
          <Build at={lf("intuition", 0.79)}>
            <div style={{ position: "absolute", left: PAD, top: 860, fontFamily: FONT.sans, fontSize: FT.body, color: C.inkDim }}>
              每段自己一个表示；段之间靠重叠对齐，不靠公式拼。
            </div>
          </Build>
        </div>

        <div>
          <div style={{ position: "absolute", left: PAD, top: 236, fontFamily: FONT.sans, fontSize: FT.h2, color: C.inkDim }}>
            拼回去：重叠处按次数平均；四十八个点，往返误差是零。
          </div>
          <Build at={lf("intuition", 0.88)}>
            <div style={{ position: "absolute", left: PAD, top: 300 }}>
              <LinePlot
                series={[
                  { values: rec.close, color: C.amber, name: "原序列", dash: true },
                  { values: rec.recon, color: C.cyan, name: "拼回的重建" },
                ]}
                width={1720} height={380} title="48 个点 · 12 段 · 重叠平均" yFmt={(v) => v.toFixed(0)} at={lf("intuition", 0.89)}
              />
            </div>
          </Build>
          <Build at={lf("intuition", 0.94)}>
            <div style={{ position: "absolute", left: PAD, top: 720, display: "flex", gap: 26 }}>
              <Stat label="往返误差" accent={C.cyan} value={fmtE(p.roundtrip_err, 0)} sub="精确零；因为填充与覆盖次数正好对上" valueColor={C.cyan} style={{ width: 875, height: 150 }} />
              <Stat label="三句话" value="频率 / 系数 / 小段" sub="FFT 整段变频率；基展开整段变系数；Patch 整段变小段。" accent={C.violet} style={{ width: 875, height: 150 }} />
            </div>
          </Build>
        </div>
      </Pages>
    </Scene>
  );
};
