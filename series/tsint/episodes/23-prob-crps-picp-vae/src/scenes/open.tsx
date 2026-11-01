import React from "react";
import { AbsoluteFill } from "remotion";
import { C, FONT, FT, FT_T } from "../../design/tokens";
import { PAD, CW, M, pageAt, Pages, Scene, SceneHead, Stat, K, Mono, Body, Card, Row, Verdict } from "../shared";

export const SOpen: React.FC = () => {
  const at = [0, pageAt("open", 6), pageAt("open", 12)];
  return (
    <Scene id="open">
      <SceneHead id="open" />
      <Pages id="open" at={at}>
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 470, width: CW }}>
            <div style={{ fontFamily: FONT.mono, fontSize: FT.label, letterSpacing: FT_T.label, color: C.amber }}>CRPS · PICP · ELBO</div>
            <div style={{ fontFamily: FONT.serif, fontSize: 132, color: C.ink, marginTop: 18, lineHeight: 1.08 }}>整个分布，怎么打分</div>
            <Body style={{ marginTop: 24, maxWidth: 1180 }} size={FT.body}>
              上一集把预测收窄到一个数和一组分位数；这一集让模型交出整个分布，再用一个分数把它和观测放在同一把尺子上。
            </Body>
          </div>
          <div style={{ position: "absolute", left: PAD, top: 780, width: CW, display: "flex", gap: 28 }}>
            <Stat label="证据" value="41 / 41" sub="五类检查，零失败" style={{ width: 420 }} />
            <Stat label="CRPS 黄金值" value="0.2337" sub="高斯、y = μ" accent={C.amber} style={{ width: 420 }} />
            <Stat label="KL 手算" value="1.3069" sub="μ = 1，σ² = 4" accent={C.violet} style={{ width: 420 }} />
          </div>
        </AbsoluteFill>

        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 430, width: CW, display: "flex", gap: 26 }}>
            <Card label="01 · 分数" accent={C.cyan} style={{ width: 540, height: 300 }}>
              <div style={{ fontFamily: FONT.serif, fontSize: 72, color: C.ink }}>CRPS</div>
              <Body size={FT.label} style={{ marginTop: 14 }}>
                连续排序概率分数。把预测分布和观测值积成一个数，单位与平均误差相同。
              </Body>
              <Mono size={FT.meta} color={C.inkFaint} style={{ display: "block", marginTop: 18 }}>封闭形式：高斯可解析</Mono>
            </Card>
            <Card label="02 · 区间" accent={C.amber} style={{ width: 540, height: 300 }}>
              <div style={{ fontFamily: FONT.serif, fontSize: 72, color: C.ink }}>PICP</div>
              <Body size={FT.label} style={{ marginTop: 14 }}>
                区间覆盖率。落在区间里的观测占多少，只能落在 1/n 的栅格上。
              </Body>
              <Mono size={FT.meta} color={C.inkFaint} style={{ display: "block", marginTop: 18 }}>边界容差：十的负十二次方</Mono>
            </Card>
            <Card label="03 · 生成器" accent={C.violet} style={{ width: 540, height: 300 }}>
              <div style={{ fontFamily: FONT.serif, fontSize: 72, color: C.ink }}>ELBO</div>
              <Body size={FT.label} style={{ marginTop: 14 }}>
                变分下界，等于重建项加 KL。这一集用 VAE 做一个可以手算的例子。
              </Body>
              <Mono size={FT.meta} color={C.inkFaint} style={{ display: "block", marginTop: 18 }}>结构：768 → 32 → 8</Mono>
            </Card>
          </div>
          <div style={{ position: "absolute", left: PAD, top: 790, width: CW }}>
            <Row name="书页" value={M.meta.bookPages} note="印刷版页码，与库里的 PDF 版式不同，按印刷版引用" width={1100} />
            <Row name="本集结论" value="一个分布、一个区间、一个下界" note="三个数都写进证据，断言可重跑" width={1100} />
          </div>
        </AbsoluteFill>

        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 430, width: CW, display: "flex", gap: 26 }}>
            <Stat label="交付" value="41 / 41" sub="证据全过" style={{ width: 400, height: 210 }} />
            <Stat label="测试" value={fmtT()} sub="82 套 · 1,097 条断言" accent={C.amber} style={{ width: 400, height: 210 }} />
            <Stat label="重跑耗时" value="79 s" sub="单条命令，写 4 份 CSV" accent={C.violet} style={{ width: 400, height: 210 }} />
            <Stat label="面板数据" value="2,669 行" sub="8 个通道 · 1000 个窗口" accent={C.coral} style={{ width: 400, height: 210 }} />
          </div>
          <div style={{ position: "absolute", left: PAD, top: 700, width: CW }}>
            <Body size={FT.label}>
              本集只回答“分布这个口径怎么算、算得对不对”，不回答“模型准不准”。后面第五节会把边界逐条说清。
            </Body>
            <div style={{ marginTop: 22, display: "flex", gap: 18 }}>
              <Verdict ok label="实现通过" />
              <Verdict ok label="证据通过" />
              <Verdict ok={false} label="未做端到端训练" />
            </div>
          </div>
        </AbsoluteFill>
      </Pages>
    </Scene>
  );
};

function fmtT() {
  return M.meta.tests.suites + " 套";
}