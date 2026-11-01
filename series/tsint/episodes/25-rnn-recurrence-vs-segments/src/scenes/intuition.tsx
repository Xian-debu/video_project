import React from "react";
import { AbsoluteFill } from "remotion";
import { C, FONT, FT, FT_T } from "../../design/tokens";
import { PAD, CW, M, pageAt, Pages, Scene, SceneHead, Stat, K, Mono, Body, Card, Row, Formula, LinePlot, Bars, Chip } from "../shared";

const Pips: React.FC<{ n: number; color: string; label: string; w?: number; h?: number }> = ({ n, color, label, w = 10, h = 34 }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
    <div style={{ display: "flex", gap: 3 }}>
      {Array.from({ length: n }).map((_, i) => <div key={i} style={{ width: w, height: h, background: color, opacity: 0.35 + (0.55 * i) / Math.max(1, n - 1), borderRadius: 2 }} />)}
    </div>
    <div style={{ fontFamily: FONT.mono, fontSize: FT.micro, color: C.inkFaint }}>{label}</div>
  </div>
);

export const SIntuition: React.FC = () => {
  const at = [0, pageAt("intuition", 8), pageAt("intuition", 18), pageAt("intuition", 23)];
  const ar = M.curves.ar;
  const seg = M.curves.seg;
  return (
    <Scene id="intuition">
      <SceneHead id="intuition" />
      <Pages id="intuition" at={at}>
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 380, width: 1180 }}>
            <div style={{ fontFamily: FONT.mono, fontSize: FT.meta, letterSpacing: FT_T.meta, color: C.cyan }}>逐点递归 · 历史被压成一个向量</div>
            <div style={{ marginTop: 24 }}><Pips n={48} color={C.cyan} label="96 步历史（每格代表两步）" w={18} /></div>
            <div style={{ marginTop: 30, display: "flex", alignItems: "center", gap: 26 }}>
              <div style={{ fontFamily: FONT.mono, fontSize: 40, color: C.inkFaint }}>→</div>
              <div style={{ display: "flex", gap: 3 }}>
                {Array.from({ length: 32 }).map((_, i) => <div key={i} style={{ width: 8, height: 40, background: C.cyan, opacity: 0.9, borderRadius: 2 }} />)}
              </div>
              <div style={{ fontFamily: FONT.mono, fontSize: FT.meta, color: C.inkFaint }}>h ∈ R³²</div>
            </div>
            <div style={{ marginTop: 34 }}><Pips n={24} color={C.amber} label="生成的 24 步：每一步都看同一个摘要" w={22} /></div>
            <Body style={{ marginTop: 30, maxWidth: 1100 }} size={FT.label}>读到最后，96 步只剩一个 32 维向量。生成时每一步都从这里出发，错一步，后面全部带偏差。</Body>
          </div>
          <div style={{ position: "absolute", left: 1300, top: 380, width: 476 }}>
            <Card label="信息去哪了" accent={C.coral} style={{ width: 476, height: 250 }}>
              <Body size={FT.label}>压缩必然丢信息：96 × 1 个数压进 32 个数，块内形状被抹平。</Body>
            </Card>
            <Card label="误差怎么涨" accent={C.amber} style={{ width: 476, height: 220, marginTop: 22 }}>
              <div style={{ fontFamily: FONT.mono, fontSize: 48, color: C.ink }}>{M.rnn.arMae1.toFixed(4)} → {M.rnn.arMae24.toFixed(4)}</div>
              <Mono size={FT.micro} color={C.inkFaint}>第 1 步 → 第 24 步</Mono>
            </Card>
          </div>
        </AbsoluteFill>

        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 320, width: 1260 }}>
            <LinePlot
              title="逐点递归的误差曲线 · 横轴 1–24 步"
              series={[
                { values: ar.map((r) => r.ar), color: C.cyan, name: "逐点递归" },
                { values: ar.map((r) => r.direct), color: C.coral, name: "直接多步头" },
                { values: ar.map((r) => r.naive), color: C.inkFaint, name: "朴素基线" },
              ]}
              width={1260} height={540} padL={104} padB={64} yFmt={(v) => v.toFixed(3)}
            />
          </div>
          <div style={{ position: "absolute", left: 1400, top: 360, width: 376 }}>
            <Card label="逐点递归" accent={C.cyan} style={{ width: 376, height: 200 }}>
              <div style={{ fontFamily: FONT.mono, fontSize: 40, color: C.ink }}>{M.rnn.arMae24.toFixed(4)}</div>
              <Mono size={FT.micro} color={C.inkFaint}>第 24 步 · 膨胀 {M.rnn.expansion.toFixed(2)} 倍</Mono>
            </Card>
            <Card label="直接多步头" accent={C.coral} style={{ width: 376, height: 200, marginTop: 22 }}>
              <div style={{ fontFamily: FONT.mono, fontSize: 40, color: C.ink }}>{M.rnn.directMae24.toFixed(4)}</div>
              <Mono size={FT.micro} color={C.inkFaint}>一次出 24 步，误差基本是平的</Mono>
            </Card>
            <Card label="朴素基线" accent={C.inkFaint} style={{ width: 376, height: 160, marginTop: 22 }}>
              <div style={{ fontFamily: FONT.mono, fontSize: 40, color: C.ink }}>{M.rnn.naive24.toFixed(4)}</div>
              <Mono size={FT.micro} color={C.inkFaint}>永远预测 0</Mono>
            </Card>
          </div>
        </AbsoluteFill>

        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 320, width: 1260 }}>
            <LinePlot
              title="两条路的 24 步误差 · 分段从更差追上并反超"
              series={[
                { values: ar.map((r) => r.ar), color: C.cyan, name: "逐点递归" },
                { values: seg.map((r) => r.mae), color: C.amber, name: "分段并行" },
              ]}
              width={1260} height={540} padL={104} padB={64} yFmt={(v) => v.toFixed(3)}
            />
          </div>
          <div style={{ position: "absolute", left: 1400, top: 360, width: 376 }}>
            <Card label="第 1 步" accent={C.amber} style={{ width: 376, height: 180 }}>
              <div style={{ fontFamily: FONT.mono, fontSize: 38, color: C.ink }}>{M.seg.mae1.toFixed(4)}</div>
              <Mono size={FT.micro} color={C.inkFaint}>分段不如递归的 {M.rnn.arMae1.toFixed(4)}</Mono>
            </Card>
            <Card label="第 24 步" accent={C.amber} style={{ width: 376, height: 180, marginTop: 22 }}>
              <div style={{ fontFamily: FONT.mono, fontSize: 38, color: C.ink }}>{M.seg.mae24.toFixed(4)}</div>
              <Mono size={FT.micro} color={C.inkFaint}>反超递归的 {M.rnn.arMae24.toFixed(4)}</Mono>
            </Card>
            <Card label="曲线形状" accent={C.cyan} style={{ width: 376, height: 150, marginTop: 22 }}>
              <Body size={FT.meta}>分段往下走，递归往上走。两条路的误差来源不同。</Body>
            </Card>
          </div>
        </AbsoluteFill>

        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 360, width: 1120 }}>
            <Card label="二阶差分的平均绝对值 · 越小越平滑" accent={C.coral} style={{ width: 1120, height: 420 }}>
              <Bars
                items={[
                  { label: "逐点递归", value: M.seg.smoothAr, text: M.seg.smoothAr.toFixed(4), color: C.cyan },
                  { label: "分段并行", value: M.seg.smoothSeg, text: M.seg.smoothSeg.toFixed(4), color: C.coral },
                ]}
                width={1060} max={0.8} rowH={92} labelW={190} unit="分段更抖，比值 1.43"
              />
              <Body size={FT.meta} style={{ marginTop: 18 }}>我们原本的预期是反过来的：块内一次生成 8 步，应该更连贯。</Body>
            </Card>
          </div>
          <div style={{ position: "absolute", left: 1240, top: 360, width: 536 }}>
            <Card label="三句话" accent={C.cyan} style={{ width: 536, height: 420 }}>
              <Row name="一" value="递归 = 滚动摘要" width={470} />
              <Row name="二" value="分段 = 切块并行" width={470} />
              <Row name="三" value="误差形状不同" width={470} />
              <div style={{ marginTop: 18, display: "flex", gap: 10, flexWrap: "wrap" }}>
                <Chip color={C.coral}>平滑度反直觉</Chip>
                <Chip color={C.amber}>下一站：实现</Chip>
              </div>
            </Card>
          </div>
        </AbsoluteFill>
      </Pages>
    </Scene>
  );
};
