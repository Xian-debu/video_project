import React from "react";
import { AbsoluteFill } from "remotion";
import { C, FONT, FT, FT_T } from "../../design/tokens";
import {
  PAD, M, pagesOf, Pages, Scene, SceneHead, Card, Body, Chip, Stat,
  LinePlot, Row, Formula, CodeBlock, AlignMatrix, fmtF,
} from "../shared";

export const SDefinitions: React.FC = () => {
  const at = pagesOf("definitions");
  const mo = M.motif;
  return (
    <Scene id="definitions">
      <SceneHead id="definitions" />
      <Pages id="definitions" at={at}>
        {/* 页一：ED */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 292, width: 900 }}>
            <Formula size={56} note="两条等长序列，逐点差、平方、求和、开方">
              ED(a,b) = sqrt( Σᵢ (aᵢ − bᵢ)² )
            </Formula>
            <Body style={{ marginTop: 26, width: 860 }}>
              欧氏距离假设第 i 点只跟第 i 点比。两条曲线哪怕完全同形，只要时间轴错开一格，逐点差就全部对不上。这就是上一页那四十倍差距的来源。
            </Body>
          </div>
          <div style={{ position: "absolute", left: 1040, top: 292, width: 790 }}>
            <Card label="错位即惩罚" accent={C.coral} pad={18}>
              <LinePlot
                width={750} height={240} legend zeroLine
                yFmt={(v) => v.toFixed(1)}
                series={[
                  { name: "a", color: C.ink, values: mo.a },
                  { name: "b（a 左移 5）", color: C.coral, values: mo.b },
                ]}
              />
              <div style={{ fontFamily: FONT.mono, fontSize: FT.meta, color: C.coral, marginTop: 10 }}>
                ED = {fmtF(mo.ed, 4)}　·　DTW = {fmtF(mo.dtw, 4)}
              </div>
            </Card>
          </div>
        </AbsoluteFill>

        {/* 页二：DTW 放开假设 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 296, width: 860 }}>
            <div style={{ fontFamily: FONT.serif, fontSize: FT.h1, color: C.ink, lineHeight: 1.24 }}>
              把「同一时刻」
              <br />
              换成「某个时刻」。
            </div>
            <Body style={{ marginTop: 22, width: 820 }}>
              DTW 允许 a 的第 i 点对上 b 的第 j 点。不再要求 i 等于 j，只要求对齐路径单调、连续、从左上走到右下。代价是搜索空间变大了，收益是错位不再致命。
            </Body>
          </div>
          <div style={{ position: "absolute", left: 1020, top: 300, width: 810 }}>
            <Card label="对齐的自由度" accent={C.cyan} pad={26}>
              <div style={{ fontFamily: FONT.mono, fontSize: 34, color: C.ink, lineHeight: 1.6 }}>
                a₁ ↔ b₁　a₂ ↔ b₃　a₃ ↔ b₃
                <br />
                a₄ ↔ b₅　a₅ ↔ b₅　a₆ ↔ b₆
              </div>
              <Body style={{ marginTop: 18, fontSize: FT.meta }}>
                一点可以对齐一点，也可以对齐一段；一段可以对齐一段。路径不能回头，所以时间顺序仍然保留。
              </Body>
            </Card>
          </div>
        </AbsoluteFill>

        {/* 页三：代价矩阵 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 288, width: 860 }}>
            <div style={{ fontFamily: FONT.mono, fontSize: FT.label, color: C.cyan, letterSpacing: FT_T.label }}>代价矩阵 · 逐格填</div>
            <div style={{ marginTop: 16 }}>
              <Formula size={48} note="局部代价 = 两点差的平方" color={C.amber}>
                d(i,j) = (aᵢ − bⱼ)²
              </Formula>
              <div style={{ marginTop: 22 }}>
                <Formula size={44} note="三选一：左边、上边、左上" color={C.amber}>
                  D(i,j) = d(i,j) + min(D(i−1,j), D(i,j−1), D(i−1,j−1))
                </Formula>
              </div>
            </div>
            <Body style={{ marginTop: 22, width: 830 }}>
              第一行和第一列先累加，因为它们的邻居只有一个。其余每格都在三个已填的邻居里挑最小，加上本格的局部代价。
            </Body>
          </div>
          <div style={{ position: "absolute", left: 1000, top: 292, width: 830 }}>
            <Card label="递推就是全部" accent={C.cyan} pad={22}>
              <CodeBlock
                width={780}
                lines={[
                  { t: "D[0][0] = d(0,0)" },
                  { t: "D[i][0] = D[i-1][0] + d(i,0)" },
                  { t: "D[0][j] = D[0][j-1] + d(0,j)" },
                  { t: "" },
                  { t: "for i, j:" },
                  { t: "  D[i][j] = d(i,j) + min(", hi: true },
                  { t: "    D[i-1][j], D[i][j-1], D[i-1][j-1])", hi: true },
                ]}
              />
            </Card>
          </div>
        </AbsoluteFill>

        {/* 页四：归一化 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 292, width: 900 }}>
            <Formula size={50} note="终点取右下角，再按两条序列的长度归一">
              DTW(a,b) = sqrt( D(n,m) / (n + m) )
            </Formula>
            <Body style={{ marginTop: 26, width: 860 }}>
              不除以 n 加 m，长序列的累计代价会系统性偏大，两条长得像的曲线也会被距离惩罚。除以长度之和，是为了让不同长度、不同点数的窗可比。
            </Body>
          </div>
          <div style={{ position: "absolute", left: 1060, top: 300, width: 770 }}>
            <Card label="为什么不是除以 n" accent={C.violet} pad={22}>
              <Body>
                路径长度不固定，最短 n 步，最长 n 加 m 减一。用 n 或 m 都会偏向一端。n 加 m 是路径上界的一半，做分母最稳。
              </Body>
            </Card>
            <div style={{ marginTop: 16 }}>
              <Stat label="本集两条序列等长" value="n = m = 60" sub="分母固定为 120，比较仍公平" valueSize={32} />
            </div>
          </div>
        </AbsoluteFill>

        {/* 页五：带宽 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 292, width: 820 }}>
            <div style={{ fontFamily: FONT.serif, fontSize: FT.h1, color: C.ink, lineHeight: 1.24 }}>带宽六，一条走廊。</div>
            <Body style={{ marginTop: 20, width: 790 }}>
              只允许 i 减 j 的绝对值不超过六。带外格子的代价记为正无穷，路径就走不进去。带宽把搜索从整张方阵压成一条对角线走廊，也防止 DTW 为了凑距离把时间轴乱拉。
            </Body>
            <div style={{ marginTop: 22 }}>
              <Row name="带宽" value="6" width={770} />
              <Row name="带内宽度" value="13 格" width={770} />
              <Row name="代价" value="不许跨过 6 个点" width={770} />
            </div>
          </div>
          <div style={{ position: "absolute", left: 1100, top: 300, width: 760 }}>
            <BandFigure />
          </div>
        </AbsoluteFill>

        {/* 页六：路径 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 292, width: 760 }}>
            <div style={{ fontFamily: FONT.serif, fontSize: FT.h1, color: C.ink, lineHeight: 1.24 }}>路径是唯一能看见的中间量。</div>
            <Body style={{ marginTop: 22, width: 730 }}>
              从右下角往左上回溯，每步走向左、上或左上。路径贴着低代价走，把两段形态对上。代价矩阵画成热图，深色低代价、浅色高代价，青色就是这次对齐的选择。
            </Body>
            <div style={{ marginTop: 20 }}>
              <Chip color={C.cyan}>路径 {mo.path.length} 步</Chip>
            </div>
          </div>
          <div style={{ position: "absolute", left: 990, top: 286 }}>
            <AlignMatrix cost={mo.cost} path={mo.path} cell={9} title="motif a 与左移 5 点的 b" />
          </div>
        </AbsoluteFill>

        {/* 页七：四个成员 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 292, width: 1776 }}>
            <div style={{ fontFamily: FONT.serif, fontSize: FT.h1, color: C.ink }}>弹性集成不只用一个距离。</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 18, marginTop: 30 }}>
              <Card label="DTW" accent={C.amber} pad={22} style={{ minHeight: 300 }}>
                <Body>原始形状对齐。容差宽，能吸收相位差，也最容易把不相干的段拉在一起。</Body>
              </Card>
              <Card label="导数 DTW" accent={C.cyan} pad={22} style={{ minHeight: 300 }}>
                <Body>先对序列求导，再跑 DTW。比的是斜率而不是绝对值，对缓慢漂移更稳。本集权重最高。</Body>
              </Card>
              <Card label="加权 DTW" accent={C.violet} pad={22} style={{ minHeight: 300 }}>
                <Body>给时间轴偏移加惩罚，参数 g 等于 0.05。它更相信「大致同一时刻」，只在必要处允许拉伸。</Body>
              </Card>
              <Card label="LCSS" accent={C.coral} pad={22} style={{ minHeight: 300 }}>
                <Body>数最长公共子序列，容差 eps 取 0.2。它按匹配点数计分，对孤立噪声最宽容，但也很容易失去分辨力。</Body>
              </Card>
            </div>
          </div>
        </AbsoluteFill>

        {/* 页八：权重 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 292, width: 880 }}>
            <Formula size={46} note="留一准确率，减随机猜测，截断，归一化" color={C.violet}>
              w_m = max(0, acc_m − 1/K) / Σₘ max(0, acc_m − 1/K)
            </Formula>
            <Body style={{ marginTop: 24, width: 840 }}>
              三个类，随机猜中的概率是三分之一。一个距离的留一准确率如果只有三分之一，它对集成没有信息，权重应是零；低于三分之一，说明它在反向预测，截断为零。
            </Body>
            <div style={{ marginTop: 20 }}>
              <Row name="留一" value="每次留一个窗" width={820} />
              <Row name="K" value="3 类" width={820} />
              <Row name="截断" value="max(0, ·)" width={820} />
            </div>
          </div>
          <div style={{ position: "absolute", left: 1040, top: 300, width: 790 }}>
            <Card label="示意：两个成员" accent={C.violet} pad={22}>
              <Row name="成员 A 留一准确率" value="0.6667" width={720} />
              <Row name="A 的原始分" value="0.3334" width={720} />
              <Row name="成员 B 留一准确率" value="0.3333" width={720} />
              <Row name="B 的原始分" value="0.0000" width={720} />
              <Row name="归一化后" value="A 1.0 · B 0.0" color={C.violet} width={720} />
            </Card>
          </div>
        </AbsoluteFill>

        {/* 页九：投票 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 292, width: 960 }}>
            <Formula size={46} note="每个距离投一票，按权重加总，取最大" color={C.cyan}>
              pred = argmax_c Σₘ w_m · 1[labelₘ = c]
            </Formula>
            <Body style={{ marginTop: 26, width: 920 }}>
              也可以不带权，四个距离各投一票；本集用的是加权版。权重为零的成员仍然参与计算，只是票不计入，所以 LCSS 这一集等于被自动淘汰。
            </Body>
          </div>
          <div style={{ position: "absolute", left: 1100, top: 300, width: 730 }}>
            <Card label="三个数字记住集成" accent={C.cyan} pad={22}>
              <Stat label="成员数" value="4" sub="DTW · 导数 · 加权 · LCSS" valueSize={40} />
              <div style={{ marginTop: 10 }}>
                <Stat label="权重和" value="1.0" sub="归一化之后" valueColor={C.violet} valueSize={40} />
              </div>
              <div style={{ marginTop: 10 }}>
                <Stat label="本集实际权重" value="0.7273 最高" sub="导数 DTW" valueColor={C.amber} valueSize={34} />
              </div>
            </Card>
          </div>
        </AbsoluteFill>
      </Pages>
    </Scene>
  );
};

const BandFigure: React.FC = () => {
  const n = 60, band = 6, cell = 9;
  return (
    <div>
      <div style={{ fontFamily: FONT.mono, fontSize: FT.micro, color: C.cyan, marginBottom: 8 }}>|i − j| ≤ 6 · 带内可走</div>
      <div style={{ position: "relative", width: n * cell, height: n * cell, background: C.panel, border: "1px solid " + C.panelLine, overflow: "hidden" }}>
        {Array.from({ length: n }, (_, i) => Array.from({ length: n }, (_, j) => (
          Math.abs(i - j) <= band ? (
            <div key={i + "-" + j} style={{ position: "absolute", left: j * cell, top: i * cell, width: cell - 1, height: cell - 1, background: C.cyan, opacity: 0.22 }} />
          ) : null
        )))}
        <svg width={n * cell} height={n * cell} style={{ position: "absolute", left: 0, top: 0 }}>
          <line x1={0} y1={0} x2={n * cell} y2={n * cell} stroke={C.ink} strokeWidth={1.6} />
        </svg>
      </div>
      <div style={{ fontFamily: FONT.mono, fontSize: FT.micro, color: C.inkFaint, marginTop: 8 }}>横轴 b 的位置 · 纵轴 a 的位置 · 对角线是严格同步</div>
    </div>
  );
};
