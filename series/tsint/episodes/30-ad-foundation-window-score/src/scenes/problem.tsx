import React from "react";
import { AbsoluteFill } from "remotion";
import { C, FONT, FT } from "../../design/tokens";
import { PAD, CW, M, fmtF, pageAt, Pages, Scene, SceneHead, Card, Row, Body, Mono, PairBar, TagDot, Chip } from "../shared";

const range = (a: number, b: number) => Array.from({ length: b - a + 1 }, (_, i) => a + i);

/** 80 个点的小格子条：真值段与两组预测各自上色。 */
const Strip: React.FC<{ label: string; marks: number[]; color: string }> = ({ label, marks, color }) => (
  <div style={{ display: "flex", alignItems: "center", marginTop: 12 }}>
    <div style={{ width: 92, fontFamily: FONT.mono, fontSize: FT.meta, color: C.inkFaint }}>{label}</div>
    <div style={{ display: "flex", gap: 2 }}>
      {Array.from({ length: 80 }, (_, i) => (
        <div key={i} style={{
          width: 8, height: 20, borderRadius: 2,
          background: marks.includes(i) ? color : C.panelLine,
          opacity: marks.includes(i) ? 0.95 : 0.55,
        }} />
      ))}
    </div>
  </div>
);

const Table: React.FC<{
  head: string[]; rows: { cells: string[]; color?: string; dim?: boolean }[];
  widths: number[]; width: number;
}> = ({ head, rows, widths, width }) => (
  <div style={{ width }}>
    <div style={{ display: "flex", padding: "0 0 10px", borderBottom: "1px solid " + C.panelLine }}>
      {head.map((h, i) => (
        <div key={h} style={{ width: widths[i], fontFamily: FONT.mono, fontSize: FT.micro, letterSpacing: 0.6, color: C.inkFaint }}>{h}</div>
      ))}
    </div>
    {rows.map((r, k) => (
      <div key={k} style={{ display: "flex", alignItems: "baseline", padding: "13px 0", borderBottom: "1px solid " + C.panelLine, opacity: r.dim ? 0.6 : 1 }}>
        {r.cells.map((c, i) => (
          <div key={i} style={{
            width: widths[i], fontFamily: i === 0 ? FONT.sans : FONT.mono, fontSize: i === 0 ? FT.body : FT.body,
            color: i === 0 ? C.inkDim : (r.color ?? C.ink), fontVariantNumeric: "tabular-nums",
          }}>{c}</div>
        ))}
      </div>
    ))}
  </div>
);

const truthMarks = [...range(0, 9), ...range(20, 29)];
const aMarks = [1, 3, 5, 7, 9, 21, 23, 25, 27, 29, ...range(40, 47)];
const bMarks = range(0, 9);

export const SProblem: React.FC = () => {
  const at = [0, pageAt("problem", 9), pageAt("problem", 27)];
  const s = M.scores;
  const rows = [
    { cells: ["重构 MSE", fmtF(s.mse.p, 4), fmtF(s.mse.r, 4), fmtF(s.mse.f1, 4)], color: C.cyan },
    { cells: ["重构 MAE", fmtF(s.mae.p, 4), fmtF(s.mae.r, 4), fmtF(s.mae.f1, 4)], color: C.cyan },
    { cells: ["预测误差", fmtF(s.pred.p, 4), fmtF(s.pred.r, 4), fmtF(s.pred.f1, 4)], color: C.amber },
    { cells: ["范围调整", fmtF(s.mse.rp, 4), fmtF(s.mse.rr, 4), fmtF(s.mse.rf1, 4)], color: C.coral },
  ];
  return (
    <Scene id="problem">
      <SceneHead id="problem" />
      <Pages id="problem" at={at}>
        {/* 页一：三个口径 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 300, width: 1080 }}>
            <Body size={FT.h2} color={C.ink} style={{ lineHeight: 1.4 }}>
              做异常检测，绕不开一张表：表里是预测，现在要报一个分数。问题来了 —— 报哪一个。
            </Body>
            <Card label="第一种 · 逐点" accent={C.cyan} pad={20} style={{ marginTop: 30 }}>
              <Body size={FT.body}>预测对了一个点，算一个真阳性。分母是预测点数、异常点数。</Body>
              <Mono size={FT.meta} color={C.cyan} style={{ display: "block", marginTop: 8 }}>TP = | 预测 ∩ 真值 |</Mono>
            </Card>
            <Card label="第二种 · 点调整" accent={C.amber} pad={20} style={{ marginTop: 16 }}>
              <Body size={FT.body}>一段异常里，只要命中一个点，整段算命中。真阳性按段数，不按点数。</Body>
              <Mono size={FT.meta} color={C.amber} style={{ display: "block", marginTop: 8 }}>TP = 被命中的真实段数</Mono>
            </Card>
            <Card label="第三种 · 范围调整" accent={C.coral} pad={20} style={{ marginTop: 16 }}>
              <Body size={FT.body}>按段算，还要看覆盖比例：预测段盖住真实段的比例不小于 α，才算命中。</Body>
              <Mono size={FT.meta} color={C.coral} style={{ display: "block", marginTop: 8 }}>overlap / | 真实段 | ≥ α</Mono>
            </Card>
          </div>
          <div style={{ position: "absolute", left: 1210, top: 300, width: 610 }}>
            <Card label="同一个词，三种真阳性" accent={C.violet} pad={22}>
              <Row name="逐点" value="一个点" note="最严：点必须落在真值里" width={560} />
              <Row name="点调整" value="一整段" note="命中一点，整段算抓到" width={560} />
              <Row name="范围调整" value="一整段 + α" note="盖得不够，仍然不算" width={560} />
              <div style={{ marginTop: 18 }}>
                <Body size={FT.meta}>三种口径都是行业标准，都能在论文里找到。它们不是谁对谁错 —— 是三种不同的问法。</Body>
              </div>
            </Card>
          </div>
        </AbsoluteFill>

        {/* 页二：真实读数 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 300, width: 1010 }}>
            <Card label="真实读数 · 586 窗 · 60 注入点" accent={C.cyan}>
              <Table
                head={["口径", "精度", "召回", "F1"]}
                rows={rows}
                widths={[330, 200, 200, 200]}
                width={950}
              />
              <div style={{ marginTop: 20 }}>
                <Body size={FT.meta}>同一批预测，四个读数。第二行是重点：两个不同的分数，读数完全相同。</Body>
              </div>
            </Card>
          </div>
          <div style={{ position: "absolute", left: 1150, top: 300, width: 670 }}>
            <Card label="为什么第二行一模一样" accent={C.amber} pad={22}>
              <Body size={FT.body}>
                MSE 和 MAE 是两个不同的分数。但这六个窗口，两种分数都排前六 —— 尖峰把平方项和绝对项一起抬起来，
                所以选出的窗口完全相同，F1 也完全相同。
              </Body>
              <Row name="MSE 的 F1" value={fmtF(s.mse.f1, 4)} width={620} />
              <Row name="MAE 的 F1" value={fmtF(s.mae.f1, 4)} width={620} />
              <div style={{ marginTop: 18 }}>
                <Chip color={C.amber}>平局也是读数</Chip>
              </div>
            </Card>
          </div>
        </AbsoluteFill>

        {/* 页三：排序翻转 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 300, width: 1140 }}>
            <Body size={FT.h2} color={C.ink} style={{ lineHeight: 1.4 }}>
              更麻烦的是排序：换一组预测，冠军会换人。
            </Body>
            <Card label="合成例子 · 80 个点，两段真异常" style={{ marginTop: 26 }}>
              <Strip label="真值" marks={truthMarks} color={C.amber} />
              <Strip label="预测 A" marks={aMarks} color={C.cyan} />
              <Strip label="预测 B" marks={bMarks} color={C.violet} />
              <div style={{ display: "flex", gap: 26, marginTop: 20 }}>
                <TagDot color={C.amber}>真异常：0–9、20–29</TagDot>
                <TagDot color={C.cyan}>A：两段各命中 5 点，另有 8 个误报</TagDot>
                <TagDot color={C.violet}>B：只覆盖第一段，覆盖满</TagDot>
              </div>
            </Card>
          </div>
          <div style={{ position: "absolute", left: 1250, top: 300, width: 570 }}>
            <Card label="普通 F1 · B 赢" accent={C.cyan} pad={20}>
              <PairBar
                a={{ label: "A", value: M.flip.plainA, text: fmtF(M.flip.plainA, 4) }}
                b={{ label: "B", value: M.flip.plainB, text: fmtF(M.flip.plainB, 4) }}
                width={520} height={108} max={1}
              />
            </Card>
            <Card label="点调整 F1 · A 赢" accent={C.amber} pad={20} style={{ marginTop: 18 }}>
              <PairBar
                a={{ label: "A", value: M.flip.padjA, text: fmtF(M.flip.padjA, 4) }}
                b={{ label: "B", value: M.flip.padjB, text: fmtF(M.flip.padjB, 4) }}
                width={520} height={108} max={1} colorB={C.violet}
              />
            </Card>
            <Card label="范围调整 · A 归零" accent={C.coral} pad={20} style={{ marginTop: 18 }}>
              <Body size={FT.meta}>
                A 的命中散在段里，每段覆盖不到 α = 0.2；按段算，一段都不算命中 —— F1 是 {fmtF(M.flip.rangeA, 4)}。
              </Body>
            </Card>
          </div>
          <div style={{ position: "absolute", left: PAD, top: 862, width: 1140 }}>
            <Body size={FT.body} color={C.ink}>
              同一组预测，两种口径，两个冠军。所以 F1 不是模型的属性，是口径的属性 —— 报 F1 之前，先报口径。
            </Body>
          </div>
        </AbsoluteFill>
      </Pages>
    </Scene>
  );
};
