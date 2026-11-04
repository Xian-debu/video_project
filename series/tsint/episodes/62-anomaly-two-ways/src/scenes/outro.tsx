import React from "react";
import { AbsoluteFill } from "remotion";
import { C, FONT, FT } from "../../design/tokens";
import { Body, Card, CodeBlock, Foot, KV, M, PAD, Pages, Scene, SceneHead, Stat, fmt4, pagesOf } from "../shared";
import { AeDiagram, SpikeDriftIntro } from "../figs";

export const OutroScene: React.FC = () => (
  <Scene id="outro">
    <SceneHead id="outro" />
    <Pages id="outro" at={pagesOf("outro")}>
      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 292, width: 620 }}>
          <Body size={FT.h1} color={C.ink} style={{ lineHeight: 1.2 }}>回到开头<br />那两条曲线。</Body>
          <Body style={{ marginTop: 26 }}>
            尖峰那天残差越过阈值，漂移那段重构分越过阈值。两把尺子各抓住一个，谁也没抓住两个。这既是这一集的结论，
            也是实际系统的做法：两个分数并排放，各报警一次。
          </Body>
          <div style={{ display: "flex", marginTop: 28 }}>
            <KV k="尖峰" v="残差报警" color={C.cyan} />
            <KV k="漂移" v="重构报警" color={C.violet} />
            <KV k="两边" v="各管一边" color={C.inkDim} />
          </div>
        </div>
        <div style={{ position: "absolute", left: 790, top: 292, width: 1030 }}>
          <Card label="两处注入 · 两种分数各抓到一处" accent={C.cyan} style={{ width: 1010 }} pad={20}>
            <SpikeDriftIntro width={950} height={250} />
          </Card>
          <div style={{ marginTop: 16, fontFamily: FONT.mono, fontSize: FT.meta, color: C.inkFaint, lineHeight: 1.7, width: 990 }}>
            左：残差在这个高点上越过 3.446733。右：重构分在这段上越过 1.624461。
          </div>
        </div>
        <Foot>两处注入，两把尺子各抓一处。</Foot>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 292, width: 620 }}>
          <Body size={FT.h1} color={C.ink} style={{ lineHeight: 1.2 }}>自编码器<br />只是工具。</Body>
          <Body style={{ marginTop: 26 }}>
            它把 32 个点压成 8 个数再还原；本集只借它的重构误差当分数。换成 PCA、换成别的自编码器，逻辑不变——
            分数要匹配异常的形状，这一点不会变。
          </Body>
        </div>
        <div style={{ position: "absolute", left: 790, top: 292, width: 1030 }}>
          <Card label="32 → 8 → 32 · 552 个参数" accent={C.violet} style={{ width: 1010 }} pad={20}>
            <AeDiagram width={940} height={280} />
          </Card>
        </div>
        <Foot>方法不是重点，分数与异常的匹配才是。</Foot>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 292, width: 620 }}>
          <Body size={FT.h1} color={C.ink} style={{ lineHeight: 1.2 }}>最后复盘<br />四个数。</Body>
          <Body style={{ marginTop: 26 }}>
            尖峰 0.7059 对 0.0714；漂移 0.0914 对 0.6199。两个模块 251 行、24 条单测、19 项检查、{Math.round(M.timing.seconds)} 秒。
            屏幕上的每个数都能一条命令跑出来。
          </Body>
          <div style={{ display: "flex", marginTop: 28 }}>
            <KV k="检查" v={M.summary.passed + "/" + M.summary.total} color={C.cyan} />
            <KV k="模块" v={M.code.totalLines + " 行"} color={C.inkDim} />
            <KV k="耗时" v={M.timing.seconds.toFixed(1) + " s"} color={C.amber} />
          </div>
        </div>
        <div style={{ position: "absolute", left: 790, top: 292, width: 1030 }}>
          <div style={{ display: "flex", gap: 14 }}>
            <Stat label="尖峰 · 残差" value={fmt4(M.pred.spikeF1)} sub="预测残差赢" accent={C.cyan} style={{ width: 232 }} valueColor={C.cyan} valueSize={50} />
            <Stat label="尖峰 · 重构" value={fmt4(M.recon.spikeF1)} sub="低近十倍" accent={C.violet} style={{ width: 232 }} valueColor={C.inkDim} valueSize={50} />
            <Stat label="漂移 · 残差" value={fmt4(M.pred.driftF1)} sub="几乎不响" accent={C.coral} style={{ width: 232 }} valueColor={C.inkDim} valueSize={50} />
            <Stat label="漂移 · 重构" value={fmt4(M.recon.driftF1)} sub="重构误差赢" accent={C.violet} style={{ width: 232 }} valueColor={C.violet} valueSize={50} />
          </div>
          <CodeBlock
            title="复现三条"
            width={1010}
            lines={[
              { t: "cabal run tsbase -- evidence-ch07-anom \\" },
              { t: "  --data data/episodes/62-anomaly-two-ways \\" },
              { t: "  --out out/evidence-62 \\", hi: true },
              { t: "  --evidence inventory/evidence/62-anomaly-two-ways.ch7-anom.json", hi: true },
              { t: "" },
              { t: "cabal test" },
              { t: "node scripts/make.mjs --film tsint-62-anomaly-two-ways" },
            ]}
          />
        </div>
        <Foot>感谢观看，下一集，两种异常一起用。</Foot>
      </AbsoluteFill>
    </Pages>
  </Scene>
);
