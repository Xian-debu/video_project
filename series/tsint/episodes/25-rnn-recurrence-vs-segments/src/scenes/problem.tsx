import React from "react";
import { AbsoluteFill } from "remotion";
import { C, FONT, FT, FT_T } from "../../design/tokens";
import { PAD, CW, M, pageAt, Pages, Scene, SceneHead, Stat, K, Mono, Body, Card, Row, Formula, LinePlot, Chip } from "../shared";

const Cell: React.FC<{ x: number; y: number; w: number; h: number; label: string; sub?: string; accent?: string }> = ({ x, y, w, h, label, sub, accent = C.panelLine }) => (
  <div style={{ position: "absolute", left: x, top: y, width: w, height: h, background: C.bgSoft, border: "1px solid " + C.panelLine, borderTop: "2px solid " + accent, borderRadius: 10, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
    <div style={{ fontFamily: FONT.mono, fontSize: FT.mono, color: C.ink }}>{label}</div>
    {sub ? <div style={{ fontFamily: FONT.sans, fontSize: FT.micro, color: C.inkFaint, marginTop: 6 }}>{sub}</div> : null}
  </div>
);

export const SProblem: React.FC = () => {
  const at = [0, pageAt("problem", 8), pageAt("problem", 13), pageAt("problem", 22)];
  const ar = M.curves.ar;
  return (
    <Scene id="problem">
      <SceneHead id="problem" />
      <Pages id="problem" at={at}>
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 330, width: 1120, height: 560 }}>
            <div style={{ fontFamily: FONT.mono, fontSize: FT.meta, letterSpacing: FT_T.meta, color: C.inkFaint }}>自回归回路 · 一条不能并行的链</div>
            <Cell x={40} y={90} w={230} h={100} label="x_t" sub="第 t 步输入" />
            <Cell x={360} y={90} w={230} h={100} label="RNN cell" sub="z_t = W x_t + U h_{t-1} + b" accent={C.cyan} />
            <Cell x={680} y={90} w={230} h={100} label="h_t" sub="隐藏状态 32 维" accent={C.cyan} />
            <Cell x={360} y={260} w={230} h={100} label="Head" sub="x̂_t = H h_t" accent={C.amber} />
            <Cell x={680} y={260} w={230} h={100} label="x̂_t" sub="这一步的预测" accent={C.amber} />
            <div style={{ position: "absolute", left: 660, top: 190, fontFamily: FONT.mono, fontSize: 40, color: C.inkFaint }}>↺</div>
            <div style={{ position: "absolute", left: 380, top: 190, fontFamily: FONT.mono, fontSize: 40, color: C.inkFaint }}>←</div>
            <div style={{ position: "absolute", left: 40, top: 420, fontFamily: FONT.sans, fontSize: FT.meta, color: C.inkFaint, lineHeight: 1.6 }}>
              第 t 步的输出，变成第 t+1 步的输入。<br />链的长度等于预测步数，这就是串行的来源。
            </div>
          </div>
          <div style={{ position: "absolute", left: 1240, top: 350, width: 536 }}>
            <Card label="为什么慢" accent={C.cyan} style={{ width: 536, height: 250 }}>
              <div style={{ fontFamily: FONT.mono, fontSize: 56, color: C.ink }}>96 + 24</div>
              <Body size={FT.label} style={{ marginTop: 8 }}>历史 96 步读完，还要再走 24 步生成。共 120 次单元前向。</Body>
            </Card>
            <Card label="误差从哪来" accent={C.coral} style={{ width: 536, height: 250, marginTop: 24 }}>
              <div style={{ fontFamily: FONT.mono, fontSize: 56, color: C.ink }}>1.10×</div>
              <Body size={FT.label} style={{ marginTop: 8 }}>第 24 步的误差比第 1 步大 1.10 倍：错的值被当成下一步的输入。</Body>
            </Card>
          </div>
        </AbsoluteFill>

        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 360, width: CW }}>
            <Formula size={80} note="自回归的调用次数 = 历史长度 + 预测长度">calls_AR = H + F = 96 + 24 = 120</Formula>
          </div>
          <div style={{ position: "absolute", left: PAD, top: 620, width: CW, display: "flex", gap: 26 }}>
            <Stat label="读历史" value="96 次" sub="每一步更新一次状态" style={{ width: 560, height: 210 }} />
            <Stat label="生成" value="24 次" sub="每一步都依赖上一步" accent={C.amber} style={{ width: 560, height: 210 }} />
            <Stat label="合计" value="120 次" sub="无法并行，这是下限" accent={C.coral} style={{ width: 560, height: 210 }} />
          </div>
          <div style={{ position: "absolute", left: PAD, top: 880, width: CW }}>
            <Mono size={FT.meta} color={C.inkFaint}>口径：单序列，非批次；1,121 个参数，隐藏维 32，一层 tanh</Mono>
          </div>
        </AbsoluteFill>

        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 340, width: 1180 }}>
            <LinePlot
              title="24 步误差曲线 · 平均绝对误差（标准化收益）"
              series={[
                { values: ar.map((r) => r.ar), color: C.cyan, name: "逐点递归" },
                { values: ar.map((r) => r.direct), color: C.coral, name: "直接多步头" },
                { values: ar.map((r) => r.naive), color: C.inkFaint, name: "朴素基线" },
              ]}
              width={1180} height={520} padL={96} padB={64} yFmt={(v) => v.toFixed(3)}
            />
          </div>
          <div style={{ position: "absolute", left: 1330, top: 360, width: 446 }}>
            <Card label="第 1 步" accent={C.cyan} style={{ width: 446, height: 160 }}>
              <div style={{ fontFamily: FONT.mono, fontSize: 44, color: C.ink }}>{M.rnn.arMae1.toFixed(4)}</div>
              <Mono size={FT.micro} color={C.inkFaint}>递归的起点</Mono>
            </Card>
            <Card label="第 24 步" accent={C.cyan} style={{ width: 446, height: 160, marginTop: 20 }}>
              <div style={{ fontFamily: FONT.mono, fontSize: 44, color: C.ink }}>{M.rnn.arMae24.toFixed(4)}</div>
              <Mono size={FT.micro} color={C.inkFaint}>膨胀 {M.rnn.expansion.toFixed(2)} 倍</Mono>
            </Card>
            <Card label="直接多步头" accent={C.coral} style={{ width: 446, height: 160, marginTop: 20 }}>
              <div style={{ fontFamily: FONT.mono, fontSize: 44, color: C.ink }}>{M.rnn.directMae24.toFixed(4)}</div>
              <Mono size={FT.micro} color={C.inkFaint}>= 递归的 {M.rnn.directVsAr.toFixed(2)} 倍</Mono>
            </Card>
          </div>
        </AbsoluteFill>

        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 350, width: 1120 }}>
            <div style={{ fontFamily: FONT.mono, fontSize: FT.meta, letterSpacing: FT_T.meta, color: C.inkFaint }}>分段 · 历史 12 块，生成 3 块</div>
            <div style={{ display: "flex", gap: 6, marginTop: 18 }}>
              {M.meta.window.blocks > 0 ? Array.from({ length: M.meta.window.blocks }).map((_, i) => (
                <div key={i} style={{ width: 78, height: 74, background: C.bgSoft, border: "1px solid " + C.panelLine, borderTop: "3px solid " + C.cyan, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT.mono, fontSize: FT.micro, color: C.inkFaint }}>s{i + 1}</div>
              )) : null}
            </div>
            <div style={{ display: "flex", gap: 6, marginTop: 12 }}>
              {Array.from({ length: M.meta.window.genBlocks }).map((_, i) => (
                <div key={i} style={{ width: 320, height: 74, background: C.bgSoft, border: "1px solid " + C.panelLine, borderTop: "3px solid " + C.amber, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT.mono, fontSize: FT.micro, color: C.inkFaint }}>gen block {i + 1} · 8 步</div>
              ))}
            </div>
            <Body style={{ marginTop: 24, maxWidth: 1080 }} size={FT.label}>
              每块只跑一次循环单元，块与块之间可以并行。前向次数从 120 降到 15，但块内没有逐步修正，这是后面平滑度问题的伏笔。
            </Body>
          </div>
          <div style={{ position: "absolute", left: 1240, top: 380, width: 536 }}>
            <Stat label="分段前向" value="15 次" sub="12 段编码 + 3 块生成" accent={C.amber} style={{ width: 536, height: 190 }} />
            <Stat label="逐点前向" value="120 次" sub="串行 24 步，每步一次" style={{ width: 536, height: 190, marginTop: 22 }} />
            <Card label="比值" accent={C.violet} style={{ width: 536, height: 150, marginTop: 22 }}>
              <div style={{ fontFamily: FONT.mono, fontSize: 44, color: C.ink }}>120 / 15 = 8</div>
            </Card>
          </div>
        </AbsoluteFill>
      </Pages>
    </Scene>
  );
};
