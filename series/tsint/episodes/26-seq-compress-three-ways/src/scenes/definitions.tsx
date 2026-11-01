import React from "react";
import { AbsoluteFill } from "remotion";
import { C, FONT, FT, FT_T } from "../../design/tokens";
import { PAD, CW, M, pageAt, Pages, Scene, SceneHead, Stat, Mono, Body, Card, Row, Formula, K, Chip } from "../shared";

export const SDefinitions: React.FC = () => {
  const at = [0, pageAt("definitions", 7), pageAt("definitions", 15), pageAt("definitions", 20), pageAt("definitions", 28)];
  const p = M.params;
  return (
    <Scene id="definitions">
      <SceneHead id="definitions" />
      <Pages id="definitions" at={at}>
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 320, width: 1150 }}>
            <Card label="定义一 · 奇偶下采样" accent={C.cyan} style={{ width: 1150 }}>
              <Formula size={46}>{"split(x) = (x_0, x_2, …), (x_1, x_3, …)"}</Formula>
              <Formula size={46} style={{ marginTop: 18 }}>{"merge(e, o) = [e_0, o_0, e_1, o_1, …]"}</Formula>
              <Body size={FT.body} style={{ marginTop: 20 }}>
                按下标拆成偶数位和奇数位，每条保留原顺序；用时交错回去。这是一个置换，置换不丢信息。
              </Body>
            </Card>
            <div style={{ display: "flex", gap: 12, marginTop: 22 }}>
              <Chip color={C.cyan}>往返误差 0.0</Chip>
              <Chip color={C.cyan}>唯一无损的一条</Chip>
            </div>
          </div>
          <div style={{ position: "absolute", left: 1290, top: 320, width: 558 }}>
            <Stat label="往返误差" value={M.split.err.toFixed(1)} sub="精确为零，不是约等于" style={{ width: 558, height: 210 }} />
            <Card label="口径" style={{ width: 558, marginTop: 26 }}>
              <Body size={FT.label}>拆与合必须是同一件事的两个方向。测试拿真实收盘价做逐位比较。</Body>
            </Card>
          </div>
        </AbsoluteFill>

        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 330, width: 1150 }}>
            <Card label="定义二 · 周期下采样" accent={C.amber} style={{ width: 1150 }}>
              <Formula size={42}>{"z_q = [x_q, x_{q+p}, …, x_{q+(m-1)p}]"}</Formula>
              <Row name="周期 p" value={M.phase.period.toString()} note={"九十六步折成 " + M.phase.pointsPerPhase + " 个相位"} width={1050} />
              <Row name="每相位点数" value={M.phase.pointsPerPhase.toString()} note={"只保留最后 " + M.phase.keepPerPhase + " 个"} width={1050} />
              <Row name="参数量" value={p.sparse.toString()} note={"p × K × w = 12 × 2 × 4"} color={C.amber} width={1050} />
              <Body size={FT.label} style={{ marginTop: 14 }}>
                输出下标钉死为 q 加 b 乘 p：相位在前，块在后。同一相位的点用一个小窗口做线性读数。
              </Body>
            </Card>
          </div>
          <div style={{ position: "absolute", left: 1290, top: 330, width: 558 }}>
            <Stat label="相位" value={M.phase.period + " × " + M.phase.pointsPerPhase} sub="十二行，每行八个点" accent={C.amber} style={{ width: 558, height: 210 }} />
            <Stat label="参数" value={p.sparse.toString()} sub="十二个相位，每个两块，每块四权" accent={C.amber} style={{ width: 558, height: 210, marginTop: 26 }} />
          </div>
        </AbsoluteFill>

        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 320, width: 1150 }}>
            <Card label="定义三 · 最后时刻压缩" accent={C.violet} style={{ width: 1150 }}>
              <Formula size={46}>{"z = [x_{t-L+1}, …, x_t],   y = W z + b"}</Formula>
              <Formula size={46} style={{ marginTop: 16 }}>{"W ∈ R^{24×L},  L = " + 8}</Formula>
              <Row name="权重" value="24 × 8 = 192" note="每步只看最后八根" width={1050} />
              <Row name="偏置" value="24" note="每步一个" width={1050} />
              <Row name="合计" value={p.last.toString()} note="三个头里居中" color={C.violet} width={1050} />
            </Card>
            <div style={{ display: "flex", gap: 12, marginTop: 22 }}>
              <Chip color={C.violet}>前面 88 根不看</Chip>
              <Chip color={C.violet}>连周期都不管</Chip>
            </div>
          </div>
          <div style={{ position: "absolute", left: 1290, top: 320, width: 558 }}>
            <Stat label="读多少历史" value={"8 / 96"} sub="只看最后八根" accent={C.violet} style={{ width: 558, height: 210 }} />
            <Stat label="参数" value={p.last.toString()} sub="二十四乘八加二十四" accent={C.violet} style={{ width: 558, height: 210, marginTop: 26 }} />
          </div>
        </AbsoluteFill>

        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 330, width: CW }}>
            <Card label="拟合口径 · 三件必须钉死的事" style={{ width: CW }}>
              <Row name="求解器" value="闭式最小二乘 + 岭项" note="正规方程加高斯消元，没有随机初始化" width={1660} />
              <Row name="标准化" value="训练段均值方差" note="对数收益统一口径，三段同一把尺" width={1660} />
              <Row name="切分" value={"前七成训练 / 后 " + M.data.test + " 个测试"} note={"训练 " + M.data.train + "，测试 " + M.data.test + "，不重叠"} width={1660} />
              <Row name="随机性" value="没有" note="同样的数据，跑两次读数逐位相同" color={C.cyan} width={1660} />
            </Card>
          </div>
          <div style={{ position: "absolute", left: PAD, top: 790, width: CW, display: "flex", gap: 26 }}>
            <Card label="为什么用闭式解" accent={C.cyan} style={{ width: 860, height: 160 }}>
              <Body size={FT.label}>三个头都是线性模型，最小二乘有解析解。能解析就不必下降——读数可复现，实验才可对照。</Body>
            </Card>
            <Card label="代价" accent={C.coral} style={{ width: 860, height: 160 }}>
              <Body size={FT.label}>闭式解不是训练。本集不能说 SCINet 收敛，只能说三个头在同一份数据上的对照。</Body>
            </Card>
          </div>
        </AbsoluteFill>

        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 380, width: CW, display: "flex", gap: 40 }}>
            <Card label="稠密口径" accent={C.coral} style={{ width: 860, height: 260 }}>
              <Formula size={44}>{"96 × 24 = " + p.denseMacs}</Formula>
              <Body size={FT.label} style={{ marginTop: 12 }}>九十六步全看，每步一个读出。参数两千三百二十八。</Body>
            </Card>
            <Card label="压缩口径" accent={C.cyan} style={{ width: 860, height: 260 }}>
              <Formula size={44}>{"12 × 24 = " + p.compressedMacs}</Formula>
              <Body size={FT.label} style={{ marginTop: 12 }}>先压到十二条，再做同样的二十四步读出。</Body>
            </Card>
          </div>
          <div style={{ position: "absolute", left: PAD, top: 700, width: CW }}>
            <div style={{ display: "flex", alignItems: "baseline", gap: 24 }}>
              <div style={{ fontFamily: FONT.mono, fontSize: FT.label, letterSpacing: FT_T.label, color: C.inkFaint }}>压缩比</div>
              <div style={{ fontFamily: FONT.mono, fontSize: 132, color: C.cyan, lineHeight: 1 }}>{p.ratio}</div>
              <div style={{ fontFamily: FONT.sans, fontSize: FT.h2, color: C.inkDim }}>这个八是这一集的核心数字。</div>
            </div>
            <Row name="乘加比值" value={p.denseMacs + " / " + p.compressedMacs + " = " + p.ratio} note="算力掉到八分之一" color={C.cyan} width={1500} />
            <Row name="参数对照" value={p.dense + " / " + p.sparse} note="参数也少了二十四倍，但更准" width={1500} />
          </div>
        </AbsoluteFill>
      </Pages>
    </Scene>
  );
};
