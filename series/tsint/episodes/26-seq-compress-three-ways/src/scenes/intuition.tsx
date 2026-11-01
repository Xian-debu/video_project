import React from "react";
import { AbsoluteFill } from "remotion";
import { C, FONT, FT, FT_T } from "../../design/tokens";
import { PAD, CW, M, pageAt, Pages, Scene, SceneHead, Stat, Mono, Body, Card, Row, Formula, LinePlot, Chip } from "../shared";

const CloseStrip: React.FC<{ values: number[]; w: number; h: number; color: string; dim?: boolean }> = ({ values, w, h, color, dim }) => {
  const lo = Math.min(...values);
  const hi = Math.max(...values);
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 3, height: h }}>
      {values.map((v, i) => (
        <div key={i} style={{
          width: w, height: Math.max(4, ((v - lo) / Math.max(1e-9, hi - lo)) * (h - 4) + 4),
          background: color, opacity: dim ? 0.55 : 0.92, borderRadius: 2,
        }} />
      ))}
    </div>
  );
};

const PhaseGrid: React.FC = () => {
  const { phases, keepPerPhase, pointsPerPhase } = M.phase;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
      {phases.map((row, q) => (
        <div key={q} style={{ display: "flex", alignItems: "center", gap: 5 }}>
          <div style={{ width: 66, fontFamily: FONT.mono, fontSize: FT.micro, color: C.inkFaint }}>相位 {q}</div>
          {row.map((v, i) => {
            const keep = i >= pointsPerPhase - keepPerPhase;
            const t = Math.max(0, Math.min(1, (v + 3) / 6));
            return (
              <div key={i} style={{
                width: 110, height: 30, borderRadius: 3,
                background: keep ? "rgba(94,234,212," + (0.18 + 0.62 * t).toFixed(2) + ")" : C.panelLine,
                border: keep ? "1px solid transparent" : "1px solid #1B2836",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontFamily: FONT.mono, fontSize: 12, color: keep ? C.ink : C.inkFaint,
              }}>{v.toFixed(1)}</div>
            );
          })}
        </div>
      ))}
    </div>
  );
};

export const SIntuition: React.FC = () => {
  const at = [0, pageAt("intuition", 7), pageAt("intuition", 14), pageAt("intuition", 22)];
  const s = M.sample;
  return (
    <Scene id="intuition">
      <SceneHead id="intuition" />
      <Pages id="intuition" at={at}>
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 340, width: 1180 }}>
            <Card label="原始收盘价 · 三十二根" style={{ width: 1180 }}>
              <CloseStrip values={M.split.closes} w={30} h={90} color={C.inkDim} />
              <Mono size={FT.micro} color={C.inkFaint} style={{ display: "block", marginTop: 10 }}>{M.split.times[0]} 起，逐根</Mono>
            </Card>
            <Card label="拆成偶数位十六根" accent={C.cyan} style={{ width: 1180, marginTop: 24 }}>
              <CloseStrip values={M.split.even} w={58} h={70} color={C.cyan} />
            </Card>
            <Card label="拆成奇数位十六根" accent={C.amber} style={{ width: 1180, marginTop: 24 }}>
              <CloseStrip values={M.split.odd} w={58} h={70} color={C.amber} />
            </Card>
          </div>
          <div style={{ position: "absolute", left: 1330, top: 340, width: 518 }}>
            <Stat label="往返误差" value={M.split.err.toFixed(1)} sub="交错回去逐位相等" style={{ width: 518, height: 200 }} />
            <Card label="这不是近似" style={{ width: 518, marginTop: 24 }}>
              <Body size={FT.label}>拆分与交错是同一个置换的正反两面。信息一根没丢，所以往返精确为零。</Body>
            </Card>
          </div>
        </AbsoluteFill>

        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 330, width: 1180 }}>
            <Card label="九十六步铺成十二行 · 每行同一相位" accent={C.amber} style={{ width: 1180 }}>
              <PhaseGrid />
            </Card>
          </div>
          <div style={{ position: "absolute", left: 1250, top: 330, width: 598 }}>
            <Stat label="相位" value={M.phase.period + " 行"} sub={"每行 " + M.phase.pointsPerPhase + " 个点"} accent={C.amber} style={{ width: 598, height: 190 }} />
            <Stat label="保留" value={"每行 " + M.phase.keepPerPhase + " 点"} sub="亮格是保留的，暗格被丢掉" accent={C.amber} style={{ width: 598, height: 190, marginTop: 24 }} />
            <Card label="为什么这样折" style={{ width: 598, marginTop: 24 }}>
              <Body size={FT.label}>同一相位的点，隔十二步出现一次。它们描述的是同一时刻的形状，可以直接比较。</Body>
            </Card>
          </div>
        </AbsoluteFill>

        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 340, width: 1180 }}>
            <Card label="九十六步 · 最后八根才有用" accent={C.violet} style={{ width: 1180 }}>
              <div style={{ display: "flex", gap: 3 }}>
                {Array.from({ length: 96 }).map((_, i) => (
                  <div key={i} style={{
                    flex: 1, height: 64, borderRadius: 2,
                    background: i >= 88 ? C.violet : C.panelLine,
                    opacity: i >= 88 ? 0.9 : 0.75,
                  }} />
                ))}
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 10 }}>
                <Mono size={FT.micro} color={C.inkFaint}>x_t-95</Mono>
                <Mono size={FT.micro} color={C.inkFaint}>x_t-8</Mono>
                <Mono size={FT.micro} color={C.violet}>x_t</Mono>
              </div>
            </Card>
            <div style={{ display: "flex", gap: 22, marginTop: 24 }}>
              <Card label="丢掉的" accent={C.coral} style={{ width: 576 }}>
                <Mono size={FT.label} color={C.inkDim} style={{ display: "block" }}>88 根历史</Mono>
                <Body size={FT.label} style={{ marginTop: 8 }}>前面八十八根直接不看。</Body>
              </Card>
              <Card label="留下的" accent={C.violet} style={{ width: 576 }}>
                <Mono size={FT.label} color={C.violet} style={{ display: "block" }}>8 根历史</Mono>
                <Body size={FT.label} style={{ marginTop: 8 }}>连周期都不管，只看最近。</Body>
              </Card>
            </div>
          </div>
          <div style={{ position: "absolute", left: 1250, top: 340, width: 598 }}>
            <Card label="三种丢法，三种赌注" style={{ width: 598 }}>
              <Row name="奇偶" value="置换不丢信息" note="恒等，赌注稳赢" width={530} color={C.cyan} />
              <Row name="周期" value="同相位可加" note="赌历史形状能迁移" width={530} color={C.amber} />
              <Row name="最后时刻" value="未来只看最近" note="赌远期无用" width={530} color={C.violet} />
            </Card>
          </div>
        </AbsoluteFill>

        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 330, width: 1230 }}>
            <LinePlot
              width={1230} height={430} at={20}
              title="二十四步 · 三种压缩的读数对照"
              series={[
                { values: s.actual, color: C.inkDim, name: "真实" },
                { values: s.sparse, color: C.cyan, name: "周期稀疏" },
                { values: s.last8, color: C.violet, name: "最后八根" },
                { values: s.dense, color: C.coral, name: "稠密线性" },
              ]}
              yFmt={(v) => v.toFixed(2)}
            />
          </div>
          <div style={{ position: "absolute", left: 1340, top: 330, width: 508 }}>
            <Stat label="周期稀疏" value="0.6226" sub="九十六个参数，最准" style={{ width: 508, height: 180 }} />
            <Stat label="最后八根" value="0.7092" sub="二百一十六个参数" accent={C.violet} style={{ width: 508, height: 180, marginTop: 22 }} />
            <Stat label="稠密线性" value="0.8973" sub="两千三百二十八个参数" accent={C.coral} style={{ width: 508, height: 180, marginTop: 22 }} />
          </div>
        </AbsoluteFill>
      </Pages>
    </Scene>
  );
};
