import React from "react";
import { Build } from "../../design/primitives";
import { C, FONT, FT } from "../../design/tokens";
import { Body, Card, Chip, CodeBlock, K, M, PAD, Pages, Scene, SceneHead, Stat, fmtE, fmtP, lf } from "../shared";

/* 数字：五十五条检查，按证据类型分组。 */

const Row: React.FC<{ label: string; value: string; color?: string; sub?: string }> = ({ label, value, color = C.ink, sub }) => (
  <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginTop: 12 }}>
    <Body size={FT.body} color={C.inkDim}>{label}</Body>
    <div style={{ display: "flex", alignItems: "baseline", gap: 12 }}>
      {sub ? <span style={{ fontFamily: FONT.sans, fontSize: FT.meta, color: C.inkFaint }}>{sub}</span> : null}
      <span style={{ fontFamily: FONT.mono, fontSize: FT.h2, color }}>{value}</span>
    </div>
  </div>
);

export const SVerification: React.FC = () => {
  const f = M.stats.fft;
  const c = M.stats.checks;
  const t = M.stats.tests;
  return (
    <Scene id="verification">
      <SceneHead id="verification" />
      <Pages id="verification" at={[0, 0.29, 0.61, 0.76]}>
        <div>
          <div style={{ position: "absolute", left: PAD, top: 236, fontFamily: FONT.sans, fontSize: FT.h2, color: C.inkDim }}>
            五十五条检查，零失败；按证据类型分成三组。
          </div>
          <Build at={lf("verification", 0.03)}>
            <div style={{ position: "absolute", left: PAD, top: 310, display: "flex", gap: 26 }}>
              <Card label="手算" accent={C.cyan} style={{ width: 574, height: 190 }}>
                <div style={{ fontFamily: FONT.mono, fontSize: FT.num, color: C.cyan }}>{c.manual}</div>
                <Body size={FT.meta} style={{ marginTop: 6 }}>Parseval、冲激、直流、余弦：都能用纸笔推出来</Body>
              </Card>
              <Card label="真实数据" accent={C.amber} style={{ width: 574, height: 190 }}>
                <div style={{ fontFamily: FONT.mono, fontSize: FT.num, color: C.amber }}>{c.data}</div>
                <Body size={FT.meta} style={{ marginTop: 6 }}>贵州茅台日线；窗口、占比、峰位</Body>
              </Card>
              <Card label="合成" accent={C.violet} style={{ width: 574, height: 190 }}>
                <div style={{ fontFamily: FONT.mono, fontSize: FT.num, color: C.violet }}>{c.synthetic}</div>
                <Body size={FT.meta} style={{ marginTop: 6 }}>三个单音；带通、带阻、谱线位置</Body>
              </Card>
            </div>
          </Build>
          <Build at={lf("verification", 0.1)}>
            <div style={{ position: "absolute", left: PAD, top: 540, width: 1776 }}>
              <Card label="三条证据文件，按算法分" accent={C.cyan} style={{ height: 180 }}>
                <div style={{ display: "flex", gap: 20, marginTop: 8, alignItems: "center" }}>
                  <Chip color={C.cyan}>FFT 26 条</Chip>
                  <Chip color={C.amber}>基展开 18 条</Chip>
                  <Chip color={C.violet}>Patch 11 条</Chip>
                  <Body size={FT.meta} color={C.inkFaint}>每条都对应一个证据文件里的数</Body>
                </div>
              </Card>
            </div>
          </Build>
          <Build at={lf("verification", 0.19)}>
            <div style={{ position: "absolute", left: PAD, top: 760, width: 1776 }}>
              <Card accent={C.cyan} style={{ height: 150 }}>
                <div style={{ display: "flex", alignItems: "baseline", gap: 26 }}>
                  <Body size={FT.body} color={C.inkDim}>Parseval 相对误差</Body>
                  <span style={{ fontFamily: FONT.mono, fontSize: FT.num, color: C.cyan }}>{fmtE(f.parseval_rel_err, 2)}</span>
                  <Body size={FT.meta} color={C.inkFaint}>512 点；时域能量与频域能量之差</Body>
                </div>
                <Body style={{ marginTop: 8 }}>冲激全一、直流只在 bin 0、余弦只有两个非零 bin：这些是精确值，不是近似。</Body>
              </Card>
            </div>
          </Build>
        </div>

        <div>
          <div style={{ position: "absolute", left: PAD, top: 236, fontFamily: FONT.sans, fontSize: FT.h2, color: C.inkDim }}>
            合成部分：三个整 bin 单音，谱线落在预期位置。
          </div>
          <Build at={lf("verification", 0.31)}>
            <div style={{ position: "absolute", left: PAD, top: 310, width: 900 }}>
              <CodeBlock
                title="采样 1024 Hz · 4096 点"
                lines={[
                  { t: "0.25 Hz  A=1.00   ->  bin 1   mag 2048", hi: true },
                  { t: "1.25 Hz  A=0.50   ->  bin 5   mag 1024", hi: true },
                  { t: "10.0 Hz  A=0.25   ->  bin 40  mag 512 ", hi: true },
                  { t: "", dim: true },
                  { t: "mag = A * N / 2", dim: true },
                ]}
                width={900} size={FT.code}
              />
            </div>
          </Build>
          <Build at={lf("verification", 0.36)}>
            <div style={{ position: "absolute", left: PAD, top: 590, width: 900 }}>
              <Card label="两个滤波用例" accent={C.violet} style={{ height: 210 }}>
                <Row label="带通 1–2 Hz，只留 1.25 Hz" value={f.bandpass_rms.toFixed(4)} color={C.violet} sub="/ 0.5 / √2" />
                <Row label="带阻 9–11 Hz，去掉 10 Hz" value={f.bandstop_rms.toFixed(4)} color={C.amber} sub="/ 手算 0.7906" />
                <Body size={FT.meta} style={{ marginTop: 10 }}>容差百分之一；两个都和手算一致。</Body>
              </Card>
            </div>
          </Build>
          <Build at={lf("verification", 0.42)}>
            <div style={{ position: "absolute", left: PAD + 940, top: 310, width: 836 }}>
              <Stat label="谱线位置" accent={C.cyan} value="bin 1 · 5 · 40" sub="频率正好落在整 bin 上" style={{ height: 170 }} />
              <Stat label="幅值" accent={C.cyan} value="2048 · 1024 · 512" sub="正好等于半振幅乘点数" style={{ height: 170, marginTop: 16 }} />
              <Stat label="手算容差" accent={C.amber} value="1%" sub="不是估出来的；先算再比" style={{ height: 170, marginTop: 16 }} />
            </div>
          </Build>
          <Build at={lf("verification", 0.47)}>
            <div style={{ position: "absolute", left: PAD, top: 870, fontFamily: FONT.sans, fontSize: FT.body, color: C.inkDim }}>
              频率落在格子上，谱线才干净；落在格子之间，就是后面边界那节的事。
            </div>
          </Build>
        </div>

        <div>
          <div style={{ position: "absolute", left: PAD, top: 236, fontFamily: FONT.sans, fontSize: FT.h2, color: C.inkDim }}>
            真实数据：窗口五百一十二，频谱二百五十六；三个数。
          </div>
          <Build at={lf("verification", 0.63)}>
            <div style={{ position: "absolute", left: PAD, top: 310, width: 1060 }}>
              <Card label="贵州茅台日线 · 最长的第一段" accent={C.amber} style={{ height: 330 }}>
                <Row label="窗口长度" value={String(f.window)} sub="取最前面 512 个交易日" />
                <Row label="频谱长度" value="256" sub="实序列前后对称，只看一半" />
                <Row label="最大能量所在 bin" value={String(f.top_bin)} sub={"mag " + f.top_mag.toFixed(2)} color={C.amber} />
                <Row label="频带占比" value="低频 97.7% · 周期五 0.32%" color={C.cyan} />
              </Card>
            </div>
          </Build>
          <Build at={lf("verification", 0.69)}>
            <div style={{ position: "absolute", left: PAD + 1100, top: 310, width: 676 }}>
              <Stat label="低频占比" accent={C.cyan} value={fmtP(f.low_freq_share, 1)} sub="E[1..25] / E[1..255]" valueColor={C.cyan} style={{ height: 160 }} />
              <Stat label="周期五占比" accent={C.violet} value={fmtP(f.period5_share, 2)} sub="4–6.7 天波段" valueColor={C.violet} style={{ height: 160, marginTop: 16 }} />
              <Stat label="检查条数" accent={C.amber} value={String(c.data)} sub="三个数，三条检查" style={{ height: 160, marginTop: 16 }} />
            </div>
          </Build>
          <Build at={lf("verification", 0.73)}>
            <div style={{ position: "absolute", left: PAD, top: 860, width: 1776, background: C.panel, border: "1px solid " + C.panelLine, borderLeft: "3px solid " + C.amber, borderRadius: 12, padding: "18px 26px" }}>
              <Body size={FT.body} color={C.ink}>数字不靠眼看，靠断言；报表里的每一个数，都能在 CSV 里复算。</Body>
            </div>
          </Build>
        </div>

        <div>
          <div style={{ position: "absolute", left: PAD, top: 236, fontFamily: FONT.sans, fontSize: FT.h2, color: C.inkDim }}>
            测试这边：四十七条新断言，套件总数五百五十。
          </div>
          <Build at={lf("verification", 0.78)}>
            <div style={{ position: "absolute", left: PAD, top: 310, width: 1060 }}>
              <CodeBlock
                title="新增断言"
                lines={[
                  { t: "FftSpec        18", hi: true },
                  { t: "BasisExpSpec   14", hi: true },
                  { t: "PatchifySpec   15", hi: true },
                  { t: "", dim: true },
                  { t: "total          47   -> suite " + t.suite, hi: true },
                ]}
                width={1060} size={FT.code}
              />
            </div>
          </Build>
          <Build at={lf("verification", 0.85)}>
            <div style={{ position: "absolute", left: PAD + 1100, top: 310, width: 676 }}>
              <Stat label="新断言" accent={C.cyan} value={String(t.fft + t.basis + t.patch)} sub="每条都挂在一个错误分支或一个恒等式上" valueColor={C.cyan} style={{ height: 160 }} />
              <Stat label="套件总数" accent={C.cyan} value={String(t.suite)} sub="全部通过" style={{ height: 160, marginTop: 16 }} />
              <Stat label="失败" accent={C.coral} value="0" sub="连续两次运行" style={{ height: 160, marginTop: 16 }} />
            </div>
          </Build>
          <Build at={lf("verification", 0.93)}>
            <div style={{ position: "absolute", left: PAD, top: 870, width: 1776 }}>
              <Card accent={C.cyan} style={{ height: 150 }}>
                <div style={{ fontFamily: FONT.sans, fontSize: FT.h2, color: C.ink }}>验收标准：画面上的每个数字，都能回到一条检查。</div>
                <K style={{ display: "block", marginTop: 8 }}>不是看起来对，是能复现。</K>
              </Card>
            </div>
          </Build>
        </div>
      </Pages>
    </Scene>
  );
};