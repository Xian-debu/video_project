import React from "react";
import { Build } from "../../design/primitives";
import { C, FONT, FT } from "../../design/tokens";
import { Body, Card, CodeBlock, K, M, PAD, Pages, Scene, SceneHead, Stat, fmtP, lf } from "../shared";

/* 边界：四条不能说的话，然后是三种代价。 */

const Say: React.FC<{ n: string; text: string; verdict: string; color: string }> = ({ n, text, verdict, color }) => (
  <div style={{ display: "flex", gap: 18, alignItems: "baseline", marginTop: 14 }}>
    <div style={{ width: 40, fontFamily: FONT.mono, fontSize: FT.label, color: C.inkFaint }}>{n}</div>
    <div style={{ flex: 1 }}>
      <Body size={FT.body} color={C.ink}>{text}</Body>
      <div style={{ fontFamily: FONT.sans, fontSize: FT.meta, color, marginTop: 2 }}>{verdict}</div>
    </div>
  </div>
);

const Row: React.FC<{ label: string; value: string; color?: string; sub?: string }> = ({ label, value, color = C.ink, sub }) => (
  <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginTop: 12 }}>
    <Body size={FT.body} color={C.inkDim}>{label}</Body>
    <div style={{ display: "flex", alignItems: "baseline", gap: 12 }}>
      {sub ? <span style={{ fontFamily: FONT.sans, fontSize: FT.meta, color: C.inkFaint }}>{sub}</span> : null}
      <span style={{ fontFamily: FONT.mono, fontSize: FT.h2, color }}>{value}</span>
    </div>
  </div>
);

export const SBoundary: React.FC = () => {
  const f = M.stats.fft;
  const b = M.stats.basis;
  const cost = M.stats.cost;
  return (
    <Scene id="boundary">
      <SceneHead id="boundary" />
      <Pages id="boundary" at={[0, 0.16, 0.37, 0.55, 0.74]}>
        <div>
          <div style={{ position: "absolute", left: PAD, top: 236, fontFamily: FONT.sans, fontSize: FT.h2, color: C.inkDim }}>
            四条不能说的话；先看第一条：补零。
          </div>
          <Build at={lf("boundary", 0.03)}>
            <div style={{ position: "absolute", left: PAD, top: 310, width: 1180 }}>
              <Card label="四句话" accent={C.coral} style={{ height: 400 }}>
                <Say n="01" text="补零能提高分辨率。" verdict="不能，这是误解。" color={C.coral} />
                <Say n="02" text="FFT 能找到任何周期。" verdict="不能，对不上格子就会泄漏。" color={C.coral} />
                <Say n="03" text="基展开的系数一定可信。" verdict="不能，条件数会放大误差。" color={C.coral} />
                <Say n="04" text="Patch 拼回去等于原序列。" verdict="不是，只有特例成立。" color={C.coral} />
              </Card>
            </div>
          </Build>
          <Build at={lf("boundary", 0.09)}>
            <div style={{ position: "absolute", left: PAD + 1220, top: 310, width: 556 }}>
              <Stat label="分辨率" accent={C.cyan} value="1 / T" sub="由观测时长决定，不由点数决定" style={{ height: 190 }} />
              <Stat label="补零" accent={C.amber} value="频域插值" sub="格子变密，峰还是那么宽" style={{ height: 190, marginTop: 16 }} />
            </div>
          </Build>
          <Build at={lf("boundary", 0.13)}>
            <div style={{ position: "absolute", left: PAD, top: 780, width: 1776, background: C.panel, border: "1px solid " + C.panelLine, borderLeft: "3px solid " + C.amber, borderRadius: 12, padding: "20px 26px" }}>
              <div style={{ fontFamily: FONT.sans, fontSize: FT.h2, color: C.ink }}>补零只是把同一个峰，画得更细；它没有造出新信息。</div>
              <K style={{ display: "block", marginTop: 8 }}>分辨率 = 1 / 观测时长</K>
            </div>
          </Build>
        </div>

        <div>
          <div style={{ position: "absolute", left: PAD, top: 236, fontFamily: FONT.sans, fontSize: FT.h2, color: C.inkDim }}>
            第二条：周期五落在两格之间，能量摊开。
          </div>
          <Build at={lf("boundary", 0.18)}>
            <div style={{ position: "absolute", left: PAD, top: 310, width: 1060 }}>
              <CodeBlock
                title="512 个点 · 周期 5 个样本"
                lines={[
                  { t: "bin  = 512 / 5 = 102.4       -- 不在格子上", hi: true },
                  { t: "peak = bin 102", dim: true },
                  { t: "(|X[102]|^2 + |X[103]|^2)", hi: true },
                  { t: "  / sum |X[1..255]|^2 = 82.7%", hi: true },
                  { t: "", dim: true },
                  { t: "峰高被削，旁边长出旁瓣", dim: true },
                ]}
                width={1060} size={FT.code}
              />
            </div>
          </Build>
          <Build at={lf("boundary", 0.25)}>
            <div style={{ position: "absolute", left: PAD, top: 640, width: 1060 }}>
              <Card label="为什么会这样" accent={C.coral} style={{ height: 200 }}>
                <Body color={C.ink}>FFT 只能表示整 bin 频率；周期五不是整 bin，能量必须摊到相邻两格。</Body>
                <Body size={FT.meta} style={{ marginTop: 10 }}>这不是数值误差，是硬截断的代价。</Body>
              </Card>
            </div>
          </Build>
          <Build at={lf("boundary", 0.3)}>
            <div style={{ position: "absolute", left: PAD + 1100, top: 310, width: 676 }}>
              <Stat label="峰值 bin" accent={C.coral} value={String(f.leak_peak_bin)} sub="理论位置 102.4" valueColor={C.coral} style={{ height: 170 }} />
              <Stat label="相邻两格占比" accent={C.coral} value={fmtP(f.leak_two_bin_share, 1)} sub="其余能量散在旁瓣里" valueColor={C.coral} style={{ height: 170, marginTop: 16 }} />
              <Stat label="加窗的代价" accent={C.amber} value="主瓣变宽" sub="泄漏少了，分辨率也降了" style={{ height: 170, marginTop: 16 }} />
            </div>
          </Build>
          <Build at={lf("boundary", 0.35)}>
            <div style={{ position: "absolute", left: PAD, top: 880, fontFamily: FONT.sans, fontSize: FT.body, color: C.inkDim }}>
              要减泄漏，得加窗；加了窗，峰就变胖。两件事不能同时要。
            </div>
          </Build>
        </div>

        <div>
          <div style={{ position: "absolute", left: PAD, top: 236, fontFamily: FONT.sans, fontSize: FT.h2, color: C.inkDim }}>
            第三条：系数有歧义，拟合值没有。
          </div>
          <Build at={lf("boundary", 0.4)}>
            <div style={{ position: "absolute", left: PAD, top: 310, width: 1060 }}>
              <Card label="同一个最小二乘，两组基" accent={C.amber} style={{ height: 300 }}>
                <Row label="归一化幂基" value={b.cond_normalized.toFixed(3)} color={C.cyan} sub="条件数" />
                <Row label="原始幂基" value={b.cond_raw.toExponential(1)} color={C.coral} sub="条件数" />
                <Body size={FT.meta} style={{ marginTop: 14 }}>条件数大的时候，系数对噪声极其敏感；数据差一点，系数可能完全不同。</Body>
              </Card>
            </div>
          </Build>
          <Build at={lf("boundary", 0.46)}>
            <div style={{ position: "absolute", left: PAD + 1100, top: 310, width: 676 }}>
              <Stat label="系数" accent={C.coral} value="会变" sub="换基、加噪，都可能完全不一样" valueColor={C.coral} style={{ height: 170 }} />
              <Stat label="拟合值" accent={C.cyan} value="几乎不变" sub="预测的是同一组数" valueColor={C.cyan} style={{ height: 170, marginTop: 16 }} />
              <Stat label="报系数时" accent={C.amber} value="带上基" sub="再带上条件数" style={{ height: 170, marginTop: 16 }} />
            </div>
          </Build>
          <Build at={lf("boundary", 0.53)}>
            <div style={{ position: "absolute", left: PAD, top: 880, width: 1776, background: C.panel, border: "1px solid " + C.panelLine, borderLeft: "3px solid " + C.amber, borderRadius: 12, padding: "20px 26px" }}>
              <div style={{ fontFamily: FONT.sans, fontSize: FT.h2, color: C.ink }}>只报系数，不报基和条件数，等于报了一个没有意义的数。</div>
            </div>
          </Build>
        </div>

        <div>
          <div style={{ position: "absolute", left: PAD, top: 236, fontFamily: FONT.sans, fontSize: FT.h2, color: C.inkDim }}>
            第四条：Patch 拼回去，只有特例等于原序列。
          </div>
          <Build at={lf("boundary", 0.58)}>
            <div style={{ position: "absolute", left: PAD, top: 310, width: 1060 }}>
              <Card label="什么时候等于" accent={C.violet} style={{ height: 330 }}>
                <Row label="不重叠（步长 = 段长）" value="相等" color={C.cyan} />
                <Row label="填充恰好补上" value="相等" color={C.cyan} />
                <Row label="一般重叠平均" value="抹掉一点高频" color={C.coral} />
                <Row label="这一集的实测" value="0" color={C.cyan} sub="填充与覆盖次数正好对上" />
                <Body size={FT.meta} style={{ marginTop: 12 }}>换个步长，这个零就没了；重叠越多，平均得越狠。</Body>
              </Card>
            </div>
          </Build>
          <Build at={lf("boundary", 0.65)}>
            <div style={{ position: "absolute", left: PAD + 1100, top: 310, width: 676 }}>
              <Stat label="往返误差" accent={C.cyan} value="0" sub="48 点、p=8、s=4；特例" valueColor={C.cyan} style={{ height: 170 }} />
              <Stat label="步长换成 2" accent={C.coral} value="不是零" sub="重叠平均开始起作用" valueColor={C.coral} style={{ height: 170, marginTop: 16 }} />
              <Stat label="高频" accent={C.amber} value="被平均掉" sub="重叠越多，抹得越狠" style={{ height: 170, marginTop: 16 }} />
            </div>
          </Build>
          <Build at={lf("boundary", 0.71)}>
            <div style={{ position: "absolute", left: PAD, top: 880, width: 1776, fontFamily: FONT.sans, fontSize: FT.body, color: C.inkDim }}>
              拼回去等于原序列，是这一组参数给的运气，不是 Patch 的性质。
            </div>
          </Build>
        </div>

        <div>
          <div style={{ position: "absolute", left: PAD, top: 236, fontFamily: FONT.sans, fontSize: FT.h2, color: C.inkDim }}>
            三种办法，三种代价。
          </div>
          <Build at={lf("boundary", 0.77)}>
            <div style={{ position: "absolute", left: PAD, top: 310, display: "flex", gap: 26 }}>
              <Card label="FFT" accent={C.cyan} style={{ width: 574, height: 330 }}>
                <div style={{ fontFamily: FONT.mono, fontSize: FT.h2, color: C.cyan }}>长度</div>
                <Body style={{ marginTop: 8 }}>radix-2 要求二的幂；730 点补到 1024。</Body>
                <K style={{ display: "block", marginTop: 10 }}>点数 ×{(cost.pad / 730).toFixed(2)}</K>
                <Body size={FT.meta} style={{ marginTop: 8 }}>算力多花 {fmtP(cost.padOverhead, 1)}；不补就得换算法。</Body>
              </Card>
              <Card label="基展开" accent={C.amber} style={{ width: 574, height: 330 }}>
                <div style={{ fontFamily: FONT.mono, fontSize: FT.h2, color: C.amber }}>求逆</div>
                <Body style={{ marginTop: 8 }}>解一个线性系统，复杂度是立方的。</Body>
                <K style={{ display: "block", marginTop: 10 }}>cond² 放大误差</K>
                <Body size={FT.meta} style={{ marginTop: 8 }}>观测越多，正规方程条件数越差。</Body>
              </Card>
              <Card label="Patch" accent={C.violet} style={{ width: 574, height: 330 }}>
                <div style={{ fontFamily: FONT.mono, fontSize: FT.h2, color: C.violet }}>边界</div>
                <Body style={{ marginTop: 8 }}>切得越碎，段数越多，参数总量越大。</Body>
                <K style={{ display: "block", marginTop: 10 }}>12 段 × 8 点</K>
                <Body size={FT.meta} style={{ marginTop: 8 }}>还要处理填充、重叠、拼回的顺序。</Body>
              </Card>
            </div>
          </Build>
          <Build at={lf("boundary", 0.92)}>
            <div style={{ position: "absolute", left: PAD, top: 720, width: 1776 }}>
              <Card accent={C.cyan} style={{ height: 140 }}>
                <div style={{ fontFamily: FONT.sans, fontSize: FT.h2, color: C.ink }}>换坐标从来不是免费的；它只是把代价从一个地方搬到另一个地方。</div>
                <K style={{ display: "block", marginTop: 8 }}>这一集的证据到此为止</K>
              </Card>
            </div>
          </Build>
        </div>
      </Pages>
    </Scene>
  );
};