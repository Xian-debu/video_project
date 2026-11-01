import React from "react";
import { AbsoluteFill } from "remotion";
import { C, FONT, FT, FT_T } from "../../design/tokens";
import { PAD, CW, M, pageAt, Pages, Scene, SceneHead, Stat, Mono, Body, Card, Row, Verdict } from "../shared";

export const SOpen: React.FC = () => {
  const at = [0, pageAt("open", 9), pageAt("open", 18)];
  const sparse = M.compress.find((c) => c.model === "sparse")!;
  const last8 = M.compress.find((c) => c.model === "last8")!;
  const dense = M.compress.find((c) => c.model === "dense")!;
  return (
    <Scene id="open">
      <SceneHead id="open" />
      <Pages id="open" at={at}>
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 470, width: CW }}>
            <div style={{ fontFamily: FONT.mono, fontSize: FT.label, letterSpacing: FT_T.label, color: C.cyan }}>COMPRESS · 96 → 12</div>
            <div style={{ fontFamily: FONT.serif, fontSize: 128, color: C.ink, marginTop: 18, lineHeight: 1.08 }}>序列压缩三法</div>
            <Body style={{ marginTop: 24, maxWidth: 1300 }} size={FT.body}>
              96 步历史压到 12 步再预测。三种压法本集都实现：奇偶下采样、周期下采样、只留最后几根。同一份六十分钟线，同一把尺子。
            </Body>
          </div>
          <div style={{ position: "absolute", left: PAD, top: 830, width: CW, display: "flex", gap: 28 }}>
            <Stat label="压缩比" value={M.params.ratio + " : 1"} sub={"乘加 " + M.params.denseMacs + " → " + M.params.compressedMacs} style={{ width: 520 }} />
            <Stat label="证据" value={M.meta.checks.ok + " / " + M.meta.checks.total} sub="四组检查，零失败" accent={C.amber} style={{ width: 520 }} />
            <Stat label="测试" value={M.meta.tests.suites + " 套"} sub={M.meta.tests.asserts + " 条断言，零失败"} accent={C.violet} style={{ width: 520 }} />
          </div>
        </AbsoluteFill>

        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 400, width: CW, display: "flex", gap: 26 }}>
            <Card label="01 · 奇偶下采样" accent={C.cyan} style={{ width: 570, height: 340 }}>
              <div style={{ fontFamily: FONT.serif, fontSize: 52, color: C.ink }}>Lossless</div>
              <Body size={FT.label} style={{ marginTop: 12 }}>
                按下标拆成偶数位与奇数位，用时交错回去。置换不丢信息，往返误差精确为零。
              </Body>
              <Mono size={FT.meta} color={C.inkFaint} style={{ display: "block", marginTop: 18 }}>往返误差 0.0 · 卷积核 {M.params.scin} 个参数</Mono>
            </Card>
            <Card label="02 · 周期下采样" accent={C.amber} style={{ width: 570, height: 340 }}>
              <div style={{ fontFamily: FONT.serif, fontSize: 52, color: C.ink }}>Folded</div>
              <Body size={FT.label} style={{ marginTop: 12 }}>
                周期 12，96 步折成 12 个相位；每相位 8 个点只留最后 4 个。SparseTSF 式稀疏线性头。
              </Body>
              <Mono size={FT.meta} color={C.inkFaint} style={{ display: "block", marginTop: 18 }}>{sparse.params} 个参数 · 误差 {sparse.mae.toFixed(4)}</Mono>
            </Card>
            <Card label="03 · 最后时刻压缩" accent={C.violet} style={{ width: 570, height: 340 }}>
              <div style={{ fontFamily: FONT.serif, fontSize: 52, color: C.ink }}>Truncated</div>
              <Body size={FT.label} style={{ marginTop: 12 }}>
                只看最后 8 根。头是 24×8 的线性映射，连周期都不管。最粗暴，也最短。
              </Body>
              <Mono size={FT.meta} color={C.inkFaint} style={{ display: "block", marginTop: 18 }}>{last8.params} 个参数 · 误差 {last8.mae.toFixed(4)}</Mono>
            </Card>
          </div>
          <div style={{ position: "absolute", left: PAD, top: 790, width: CW }}>
            <Row name="同一个输入" value="96 步历史 → 24 步预测" note="对数收益，训练段均值方差标准化" width={1400} />
            <Row name="同一个求解器" value="闭式最小二乘 + 岭项" note="正规方程加高斯消元，无随机初始化" width={1400} />
            <Row name="这一集的意外" value={"参数最少的 " + sparse.params + " 个最准"} note={"稠密 " + dense.params + " 个参数误差 " + dense.mae.toFixed(4) + "，输给常数基线 " + M.baseline.constant.toFixed(4)} width={1400} />
          </div>
        </AbsoluteFill>

        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 430, width: CW, display: "flex", gap: 26 }}>
            <Stat label="周期稀疏头" value={sparse.mae.toFixed(4)} sub={sparse.params + " 个参数，误差最小"} style={{ width: 560, height: 230 }} />
            <Stat label="最后 8 根头" value={last8.mae.toFixed(4)} sub={last8.params + " 个参数，居中"} accent={C.amber} style={{ width: 560, height: 230 }} />
            <Stat label="稠密线性头" value={dense.mae.toFixed(4)} sub={dense.params + " 个参数，输给基线"} accent={C.coral} style={{ width: 560, height: 230 }} />
          </div>
          <div style={{ position: "absolute", left: PAD, top: 730, width: CW, display: "flex", gap: 26 }}>
            <Card label="本集结论" accent={C.cyan} style={{ width: 860, height: 210 }}>
              <Body size={FT.body}>
                压缩不只是省算力：压得最狠的一条，在同一份数据上误差最小；参数最多的那条，反而过拟合到不如不学。
              </Body>
            </Card>
            <Card label="交付状态" accent={C.amber} style={{ width: 860, height: 210 }}>
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                <Verdict ok label="实现通过" />
                <Verdict ok label="证据通过" />
                <Verdict ok={false} label="未做端到端训练" />
              </div>
              <Mono size={FT.meta} color={C.inkFaint} style={{ display: "block", marginTop: 14 }}>book {M.meta.bookPages} · 六十分钟线 {M.data.rows} 根</Mono>
            </Card>
          </div>
        </AbsoluteFill>
      </Pages>
    </Scene>
  );
};
